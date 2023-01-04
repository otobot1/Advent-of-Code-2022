import { parentPort, workerData as originalWorkerData } from "worker_threads";

import { getPressureRelease, WorkerData } from "./puzzle.js";




export const main = (): void => {
    if (!parentPort) throw "This is the main thread.";


    const workerData = originalWorkerData as WorkerData;
    const elephantNamesList = workerData.elephantNamesList;
    const myNamesList = workerData.myNamesList;
    const valveCollection = workerData.valveCollection;
    const valveDistanceMatrix = workerData.valveDistanceMatrix;

    const startingValve = valveCollection["AA"];


    const elephantPressureRelease = getPressureRelease(startingValve, [], 0, 26, elephantNamesList, valveCollection, valveDistanceMatrix);
    const myPressureRelease = getPressureRelease(startingValve, [], 0, 26, myNamesList, valveCollection, valveDistanceMatrix);


    parentPort.postMessage({ elephantPressureRelease, myPressureRelease });
}