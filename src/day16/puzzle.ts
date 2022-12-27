import fs from "fs";
// import { outputMatrixToFile, writeOutputToFile } from "../utils/utils.js";




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
const isPartTwo = true;




// const testMatrix = [
//     [0, 1, 2, 1, 2, 3, 4, 5, 1, 2],
//     [1, 0, 1, 2, 3, 4, 5, 6, 2, 3],
//     [2, 1, 0, 1, 2, 3, 4, 5, 3, 4],
//     [1, 2, 1, 0, 1, 2, 3, 4, 2, 3],
//     [2, 3, 2, 1, 0, 1, 2, 3, 3, 4],
//     [3, 4, 3, 2, 1, 0, 1, 2, 4, 5],
//     [4, 5, 4, 3, 2, 1, 0, 1, 5, 6],
//     [5, 6, 5, 4, 3, 2, 1, 0, 6, 7],
//     [1, 2, 3, 2, 3, 4, 5, 6, 0, 1],
//     [2, 3, 4, 3, 4, 5, 6, 7, 1, 0],
// ]


// const openValveString = "open";




export const main = () => {
    puzzle();
}




const puzzle = () => {
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

    // outputMatrixToFile(`${process.env.PROJECT_ROOT}/src/day16/matrix-output.txt`, valveDistanceMatrix);
    // throw "";


    const { namesList, valveCollection } = valveInfo;
    const startingValve = valveCollection["AA"];

    let maximumPressureRelease: number;

    if (isPartTwo) {
        const highestPressure: [number] = [0];

        getPressureWithElephant(startingValve, [], [], highestPressure, namesList, valveCollection, valveDistanceMatrix)

        maximumPressureRelease = highestPressure[0];
    } else {
        maximumPressureRelease = getPressureRelease(startingValve, [], 0, 30, namesList, valveCollection, valveDistanceMatrix);
    }


    return maximumPressureRelease;
}




const getPressureWithElephant = (startingValve: Valve, oldElephantMovesList: string[], oldKeptValvesList: string[], highestPressure: [number], oldNamesList: string[], valveCollection: ValveCollection, valveDistanceMatrix: number[][]): void => {
    for (let index = 0; index < oldNamesList.length; index++) {
        const currentValveName = oldNamesList[index];

        if (valveCollection[currentValveName].flowRate === 0) continue;

        for (const valveName of oldElephantMovesList) if (valveName === currentValveName) continue;

        for (const valveName of oldKeptValvesList) if (valveName === currentValveName) continue;


        const newNamesList = [...oldNamesList.slice(0, index), ...oldNamesList.slice(index + 1)];
        const newElephantMovesList = [...oldElephantMovesList, currentValveName];
        const newKeptValvesList = [...oldKeptValvesList, currentValveName];


        //elephant gets the new valve
        let myValue = getPressureRelease(startingValve, [], 0, 26, newNamesList, valveCollection, valveDistanceMatrix);
        let elephantValue = getPressureRelease(startingValve, [], 0, 26, newElephantMovesList, valveCollection, valveDistanceMatrix);

        let newPressureRelease = myValue + elephantValue;
        if (newPressureRelease > highestPressure[0]) highestPressure[0] = newPressureRelease;

        //wrap recursive call in setTimeout so garbage collector can clear out the stack
        setTimeout(() => getPressureWithElephant(startingValve, newElephantMovesList, oldKeptValvesList, highestPressure, newNamesList, valveCollection, valveDistanceMatrix), 0);


        //i keep new valve
        myValue = getPressureRelease(startingValve, [], 0, 26, oldNamesList, valveCollection, valveDistanceMatrix);
        elephantValue = getPressureRelease(startingValve, [], 0, 26, oldElephantMovesList, valveCollection, valveDistanceMatrix);

        newPressureRelease = myValue + elephantValue;
        if (newPressureRelease > highestPressure[0]) highestPressure[0] = newPressureRelease;

        //wrap recursive call in setTimeout so garbage collector can clear out the stack
        setTimeout(() => getPressureWithElephant(startingValve, oldElephantMovesList, newKeptValvesList, highestPressure, oldNamesList, valveCollection, valveDistanceMatrix), 0);
    }
}




const getPressureRelease = (currentValve: Valve, oldMovesList: string[], oldPressureRelease: number, oldMinutesRemaining: number, namesList: string[], valveCollection: ValveCollection, valveDistanceMatrix: number[][]): number => {
    const distanceRow = valveDistanceMatrix[currentValve.index];


    // const breakpoint = (depth === 1 && currentValve.name === "DD");


    let currentPressureRelease = oldPressureRelease;

    for (let index = 0; index < namesList.length; index++) {
        const valveName = namesList[index];

        const valve = valveCollection[valveName];

        if (valve === currentValve || oldMovesList.includes(valveName)) continue;

        if (valve.flowRate === 0) {
            oldMovesList = [...oldMovesList, valveName];
            continue;
        }


        const newMovesList = [...oldMovesList, valveName];

        const distance = distanceRow[valve.index];

        const newMinutesRemaining = oldMinutesRemaining - distance - 1;

        if (newMinutesRemaining < 0) continue;


        let newPressureRelease = oldPressureRelease + (valve.flowRate * newMinutesRemaining);

        newPressureRelease = getPressureRelease(valve, newMovesList, newPressureRelease, newMinutesRemaining, namesList, valveCollection, valveDistanceMatrix);


        if (newPressureRelease > currentPressureRelease) currentPressureRelease = newPressureRelease;
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


        if (matrixRow[neighbour.index] === undefined || matrixRow[neighbour.index] > currentDepth + 1) getDepth(neighbour, currentDepth + 1, valveCollection, matrixRow);
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