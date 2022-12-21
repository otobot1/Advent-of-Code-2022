import fs from "fs";
import { outputMatrixToFile } from "../utils/utils.js";




type Valve = {
    name: string;
    index: number;
    flowRate: number;
    neighbours: string[];
}


type ValveCollection = {
    [index: string]: Valve;
}


type ValveInfo = {
    namesList: string[];
    valveCollection: ValveCollection;
}




const isTest = false;
const isPartTwo = false;




export const main = () => {
    isPartTwo ? puzzle2() : puzzle1();
}




const puzzle1 = () => {
    const inputPath = `${process.env.PROJECT_ROOT}/src/day16/${isTest ? "test-" : ""}input.txt`;
    if (!inputPath) throw "Invalid inputPath";


    const fileContents = fs.readFileSync(inputPath, "utf8");


    const stringArray = fileContents.split(/\r?\n/);


    const valveInfo = getValveCollection(stringArray);


    const optimalValveOrder = getOptimalValveOrder(valveInfo);


    const maximumPressureRelease = getMaximumPressureRelease(optimalValveOrder, valveInfo.valveCollection);


    console.log(maximumPressureRelease);
}




const puzzle2 = () => {
    const inputPath = `${process.env.PROJECT_ROOT}/src/day16/${isTest ? "test-" : ""}input.txt`;
    if (!inputPath) throw "Invalid inputPath";


    const fileContents = fs.readFileSync(inputPath, "utf8");


    const stringArray = fileContents.split(/\r?\n/);
}




const getValveCollection = (stringArray: string[]): ValveInfo => {
    const namesList: string[] = [];
    const valveCollection: ValveCollection = {};


    for (const string of stringArray) {
        const name = string.slice("Valve ".length + 1, "Valve AA ".length);


        const [firstHalf, secondHalf] = string.split("; ");


        const flowRate = Number(firstHalf.slice(firstHalf.indexOf("=") + 1));

        if (isNaN(flowRate)) throw "flowRate is NaN";


        const neighbours = secondHalf.split("valve")[1].slice(1).trim().split(", ");


        namesList.push(name);


        const valve: Valve = { name, index: namesList.length, flowRate, neighbours };

        valveCollection[name] = valve;
    }


    const valveInfo: ValveInfo = { namesList, valveCollection };


    return valveInfo;
}



//@ts-ignore
const getOptimalValveOrder = (valveInfo: ValveInfo): string[] => {
    const valveDistanceMatrix = getValveDistanceMatrix(valveInfo);
    outputMatrixToFile("output", valveDistanceMatrix);

    throw "not done"
}




const getValveDistanceMatrix = (valveInfo: ValveInfo): number[][] => {
    const { namesList } = valveInfo;


    const valveDistanceMatrix: number[][] = namesList.map((valveName) => getMatrixRow(valveName, valveInfo));


    return valveDistanceMatrix;
}




const getMatrixRow = (originValveName: string, valveInfo: ValveInfo): number[] => {
    const { namesList, valveCollection } = valveInfo;
    const originValve = valveCollection[originValveName];

    if (!originValve) throw "originValve is undefined.";


    const matrixRow: number[] = [];

    for (const valveName of namesList) {
        if (valveName === originValve.name) {
            matrixRow.push(0);
            continue;
        }


        const valve = valveCollection[valveName];

        if (!matrixRow[valve.index]) getDepth(originValve, 0, valveCollection, matrixRow);
    }


    return matrixRow;
}




const getDepth = (currentValve: Valve, currentDepth: number, valveCollection: ValveCollection, matrixRow: number[]): void => {
    matrixRow[currentValve.index] = currentDepth;


    for (const neighbourName of currentValve.neighbours) {
        const neighbour = valveCollection[neighbourName];

        if (!neighbour) throw "neighbour is undefined.";

        
        if (!matrixRow[neighbour.index]) getDepth(neighbour, currentDepth + 1, valveCollection, matrixRow);
    }
}




const getMaximumPressureRelease = (optimalValveOrder: string[], valveCollection: ValveCollection): number => {
    let minutesRemaining = 30;
    let currentLocation = "AA";
    let maximumPressureRelease = 0;


    for (const nextValveName of optimalValveOrder) {
        const nextValve = valveCollection[nextValveName];
        if (!nextValve) throw "nextValve is undefined.";


        while (currentLocation !== nextValveName) {
            minutesRemaining--;
        }


        minutesRemaining--;


        maximumPressureRelease += nextValve.flowRate * minutesRemaining;
    }


    return maximumPressureRelease;
}