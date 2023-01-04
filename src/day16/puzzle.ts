import fs from "fs";
import { Worker } from "worker_threads";
import { printProgress } from "../utils/utils.js";




export type Valve = {
    name: string;
    index: number;
    flowRate: number;
    neighbours: string[];
}


export type ValveCollection = {
    [index: string]: Valve;
}


type ValveInfo = {
    namesList: string[];
    valveCollection: ValveCollection;
}


type Cache = {
    [index: string]: number | undefined;
}


export type WorkerData = {
    elephantNamesList: string[];
    myNamesList: string[];
    valveCollection: ValveCollection;
    valveDistanceMatrix: number[][];
}


type MaximumPressureRelease = { max: number };




const isTest = false;
const isPartTwo = true;


const THREAD_COUNT = 4;
const cache: Cache = {};
let startTime = 0;




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




const puzzle = async () => {
    const inputPath = `${process.env.PROJECT_ROOT}/src/day16/${isTest ? "test-" : ""}input.txt`;
    if (!inputPath) throw "Invalid inputPath";


    const fileContents = fs.readFileSync(inputPath, "utf8");


    const stringArray = fileContents.split(/\r?\n/);


    startTime = (new Date).getTime();


    const valveInfo = getValveCollection(stringArray);


    const maximumPressureRelease = await getMaximumPressureRelease(valveInfo);


    console.log(maximumPressureRelease);
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




const getMaximumPressureRelease = async (valveInfo: ValveInfo): Promise<number> => {
    const valveDistanceMatrix = getValveDistanceMatrix(valveInfo);

    // outputMatrixToFile(`${process.env.PROJECT_ROOT}/src/day16/matrix-output.txt`, valveDistanceMatrix);
    // throw "";


    const { namesList, valveCollection } = valveInfo;
    const startingValve = valveCollection["AA"];

    let maximumPressureRelease: number;

    if (isPartTwo) maximumPressureRelease = await getPressureWithElephant(valveInfo, valveDistanceMatrix);
    else maximumPressureRelease = getPressureRelease(startingValve, [], 0, 30, namesList, valveCollection, valveDistanceMatrix);


    return maximumPressureRelease;
}




const getPressureWithElephant = async (valveInfo: ValveInfo, valveDistanceMatrix: number[][]): Promise<number> => {
    const { namesList: originalNamesList, valveCollection } = valveInfo;
    const originalValveCount = originalNamesList.length;
    const maximumPressureRelease: MaximumPressureRelease = { max: 0 };
    const workerPromises: Promise<void>[] = [];


    let outerIndex = 0
    let leadingElephantValveNames: string[];

    for (; outerIndex < originalValveCount; outerIndex++) {
        const firstValveName = originalNamesList[outerIndex];
        leadingElephantValveNames = [firstValveName];


        workerPromises.push(getCurrentPressureRelease(leadingElephantValveNames, originalNamesList, valveCollection, valveDistanceMatrix, maximumPressureRelease));


        while (leadingElephantValveNames.length < originalValveCount - outerIndex) {
            for (let innerIndex = leadingElephantValveNames.length; innerIndex < originalValveCount; innerIndex++) {
                const currentValveName = originalNamesList[innerIndex];
                const currentElephantValveNames = [...leadingElephantValveNames, currentValveName];

                workerPromises.push(getCurrentPressureRelease(currentElephantValveNames, originalNamesList, valveCollection, valveDistanceMatrix, maximumPressureRelease));
            }


            const nextValveName = originalNamesList[leadingElephantValveNames.length];
            leadingElephantValveNames.push(nextValveName);
        }


        const remainingNamesList = originalNamesList.filter((valveName) => !leadingElephantValveNames.includes(valveName))


        workerPromises.push(getCurrentPressureRelease(remainingNamesList, originalNamesList, valveCollection, valveDistanceMatrix, maximumPressureRelease));


        await Promise.all(workerPromises);


        printProgress(outerIndex + 1, originalValveCount, startTime);
    }


    return maximumPressureRelease.max;
}




export const getMyValveNames = (namesList: string[], leadingElephantValveNames: string[]): string[] => namesList.filter((valveName) => !leadingElephantValveNames.includes(valveName));




const getCurrentPressureRelease = async (
    currentElephantValveNames: string[], originalNamesList: string[], valveCollection: ValveCollection, valveDistanceMatrix: number[][], maximumPressureRelease: MaximumPressureRelease
): Promise<void> => {
    const myValveNames = getMyValveNames(originalNamesList, currentElephantValveNames);


    const elephantPressureRelease = checkCache(currentElephantValveNames);
    const myPressureRelease = checkCache(myValveNames);


    let currentPressureRelease: number;

    if (elephantPressureRelease && myPressureRelease) currentPressureRelease = elephantPressureRelease + myPressureRelease;
    else currentPressureRelease = await createWorker(currentElephantValveNames, myValveNames, valveCollection, valveDistanceMatrix);


    if (currentPressureRelease > maximumPressureRelease.max) maximumPressureRelease.max = currentPressureRelease;
}




const checkCache = (namesList: string[]): number | undefined => {
    const cacheID = namesList.join("");

    return cache[cacheID];
}




const createWorker = (elephantNamesList: string[], myNamesList: string[], valveCollection: ValveCollection, valveDistanceMatrix: number[][]): Promise<number> => {
    return new Promise((resolve, reject) => {
        const workerData: WorkerData = { elephantNamesList, myNamesList, valveCollection, valveDistanceMatrix };

        //@ts-ignore    //handle ts vs js
        const path = process[Symbol.for("ts-node.register.instance")] ? "./src/day16/worker" : "./dist/day16/worker";


        const worker = new Worker(path, { workerData });


        worker.on("message", (data: unknown) => resolve(Number(data)));
        worker.on("error", (error) => reject(error));
    });
}




export const getPressureRelease = (currentValve: Valve, oldMovesList: string[], oldPressureRelease: number, oldMinutesRemaining: number, namesList: string[], valveCollection: ValveCollection, valveDistanceMatrix: number[][]): number => {
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