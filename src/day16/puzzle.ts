import fs from "fs";
import { writeOutputToFile } from "../utils/utils.js";




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




const isTest = true;
const isPartTwo = false;


// const openValveString = "open";




export const main = () => {
    isPartTwo ? puzzle2() : puzzle1();
}




const puzzle1 = () => {
    const inputPath = `${process.env.PROJECT_ROOT}/src/day16/${isTest ? "test-" : ""}input.txt`;
    if (!inputPath) throw "Invalid inputPath";


    const fileContents = fs.readFileSync(inputPath, "utf8");


    const stringArray = fileContents.split(/\r?\n/);


    const valveInfo = getValveCollection(stringArray);


    const maximumPressureRelease = getMaximumPressureRelease(valveInfo);


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
        const name = string.slice("Valve ".length, "Valve AA".length);


        const [firstHalf, secondHalf] = string.split("; ");


        const flowRate = Number(firstHalf.slice(firstHalf.indexOf("=") + 1));

        if (isNaN(flowRate)) throw "flowRate is NaN";


        const neighbours = secondHalf.split("valve")[1].slice(1).trim().split(", ");


        const valve: Valve = { name, index: namesList.length, flowRate, neighbours };

        valveCollection[name] = valve;


        namesList.push(name);
    }


    const valveInfo: ValveInfo = { namesList, valveCollection };


    return valveInfo;
}




const getMaximumPressureRelease = (valveInfo: ValveInfo): number => {
    const valveDistanceMatrix = getValveDistanceMatrix(valveInfo);


    const startingValve = valveInfo.valveCollection["AA"];

    const maximumPressureRelease: number = getPressureRelease(startingValve, [], 0, 30, valveInfo, valveDistanceMatrix, 0, []);


    return maximumPressureRelease;
}




const getPressureRelease = (currentValve: Valve, oldMovesList: string[], oldPressureRelease: number, oldMinutesRemaining: number, valveInfo: ValveInfo, valveDistanceMatrix: number[][], depth: number, outputStringArray: string[]): number => {
    const { namesList, valveCollection } = valveInfo;
    const distanceRow = valveDistanceMatrix[currentValve.index];


    let currentPressureRelease = oldPressureRelease;

    for (let index = 0; index < namesList.length; index++) {
        const valveName = namesList[index];

        const valve = valveCollection[valveName];

        if (valve === currentValve || oldMovesList.includes(valveName)) continue;


        const newMovesList = [...oldMovesList, valveName];

        const distance = distanceRow[valve.index];

        const newMinutesRemaining = oldMinutesRemaining - distance - 1;


        let newPressureRelease = oldPressureRelease + (valve.flowRate * newMinutesRemaining);

        newPressureRelease = getPressureRelease(valve, newMovesList, newPressureRelease, newMinutesRemaining, valveInfo, valveDistanceMatrix, depth + 1, outputStringArray);


        if (newPressureRelease > currentPressureRelease) currentPressureRelease = newPressureRelease;


        outputStringArray.push(`currentPressureRelease = ${currentPressureRelease}. newMovesList = ${newMovesList}`);
    }


    if (!depth) {
        for (let stringIndex = 0; stringIndex < outputStringArray.length + 99; stringIndex += 100) {
            const subArray: string[] = [];

            for (let subIndex = stringIndex; subIndex < stringIndex + 100 && subIndex < outputStringArray.length; subIndex++) subArray.push(outputStringArray[subIndex]);

            fs.writeFileSync(`${process.env.PROJECT_ROOT}/src/day16/output.txt`, `\r\n${subArray.join("\r\n")}`, { flag: "w" });
        }
    }


    return currentPressureRelease;
}




const getValveDistanceMatrix = (valveInfo: ValveInfo): number[][] => {
    const { namesList } = valveInfo;


    const valveDistanceMatrix: number[][] = namesList.map(valveName => getMatrixRow(valveName, valveInfo));


    return valveDistanceMatrix;
}




const getMatrixRow = (originValveName: string, valveInfo: ValveInfo): number[] => {
    const { namesList, valveCollection } = valveInfo;
    const originValve = valveCollection[originValveName];

    if (!originValve) throw "originValve is undefined.";


    const matrixRow: number[] = Array(namesList.length);

    getDepth(originValve, 0, valveCollection, matrixRow);


    return matrixRow;
}




const getDepth = (currentValve: Valve, currentDepth: number, valveCollection: ValveCollection, matrixRow: number[]): void => {
    matrixRow[currentValve.index] = currentDepth;


    for (const neighbourName of currentValve.neighbours) {
        const neighbour = valveCollection[neighbourName];

        if (!neighbour) throw "neighbour is undefined.";


        if (matrixRow[neighbour.index] === undefined) getDepth(neighbour, currentDepth + 1, valveCollection, matrixRow);
    }
}




// const getOptimalPath = (optimalValveOrder: string[], valveCollection: ValveCollection): string[] => {
//     const optimalPath: string[] = [];


//     let currentLocationName = "AA";
//     let currentValve = valveCollection[currentLocationName];

//     if (!currentValve) throw "currentValve is undefined.";

//     for (const nextValveName of optimalValveOrder) {
//         const pathSegment = getPathSegment(currentValve, nextValveName, valveCollection, []);

//         if (!pathSegment) throw "pathSegment is undefined.";


//         optimalPath.push(...pathSegment);
//     }


//     return optimalPath;
// }




// const getPathSegment = (currentValve: Valve, targetValveName: string, valveCollection: ValveCollection, oldPathSegment: string[]): string[] | void => {
//     const currentPathSegment = [...oldPathSegment, currentValve.name];


//     for (const neighbourName of currentValve.neighbours) {
//         if (neighbourName === targetValveName) return [...currentPathSegment, targetValveName, openValveString];
//     }


//     for (const neighbourName of currentValve.neighbours) {
//         const neighbour = valveCollection[neighbourName];


//         const newPathSegment = getPathSegment(neighbour, targetValveName, valveCollection, currentPathSegment);

//         if (newPathSegment) return newPathSegment;
//     }
// }




// const getMaximumPressureRelease = (optimalPath: string[], valveCollection: ValveCollection): number => {
//     let minutesRemaining = 30;
//     let previousLocationName: string | undefined;
//     let maximumPressureRelease = 0;


//     for (const nextStep of optimalPath) {
//         minutesRemaining--;


//         if (nextStep !== openValveString) {
//             previousLocationName = nextStep;
//             continue;
//         }


//         if (!previousLocationName) throw "previousLocationName is undefined.";

//         const valve = valveCollection[previousLocationName]

//         maximumPressureRelease += valve.flowRate * minutesRemaining;
//     }


//     return maximumPressureRelease;
// }