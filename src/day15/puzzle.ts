import fs from "fs";
import { writeOutputToFile, getIntervalObject } from "../utils/utils.js";




type Node = "S" | "B" | "." | "o";      //"." = possibly contains beacon. "o" = cannot contain beacon.


type Grid = Node[][];


type Coordinates = [number, number];


type Pair = {
    sensor: Coordinates;
    beacon: Coordinates;
}


type Intersections = {
    minimumXCoordinate: number;
    maximumXCoordinate: number;
}




const isTest = false;

const X_MIN = isTest ? -100 : -1500000;
const X_MAX = isTest ? 100 : 8500000;
const X_LENGTH = X_MAX - X_MIN + 1;

const Y_MIN = isTest ? -100 : -2000000;
const Y_MAX = isTest ? 100 : 10000000
const Y_LENGTH = Y_MAX - Y_MIN + 1;

const ANSWER_Y_COORDINATE = isTest ? 10 : 2000000;


let startTime = 0;




export const main = () => {
    puzzle1();
}




const puzzle1 = () => {
    const inputPath = `${process.env.PROJECT_ROOT}/src/day15/${isTest ? "test-" : ""}input.txt`;
    if (!inputPath) throw "Invalid inputPath";


    const fileContents = fs.readFileSync(inputPath, "utf8");


    const stringArray = fileContents.split(/\r?\n/);


    startTime = (new Date).getTime();


    const pairs = getPairs(stringArray);


    const targetRow = getTargetRow(pairs);


    const markedNodesCount = countMarkedNodesInRow(targetRow);


    console.log(markedNodesCount);
}




const getPairs = (stringArray: string[]): Pair[] => {
    const pairs = stringArray.map(
        (string): Pair => {
            const halves = string.split(":");


            const coordinatesPair = halves.map(
                (halfString: string): [number, number] => {    //coordinatesPair[0] = sensor, coordinatesPair[1] = beacon.
                    const quarters = halfString.split(", y=");
                    const xString = quarters[0];
                    const yString = quarters[1];


                    const xCoordinate = Number(xString.slice(xString.indexOf("=") + 1));
                    const yCoordinate = Number(yString);

                    if (isNaN(xCoordinate) || isNaN(yCoordinate)) throw "Invalid coordinate.";


                    return [xCoordinate, yCoordinate];
                }
            );


            const pair: Pair = {
                sensor: coordinatesPair[0],
                beacon: coordinatesPair[1],
            }


            return pair;
        }
    );


    return pairs;
}




const getTargetRow = (pairs: Pair[]): Node[] => {
    const targetRow: Node[] = Array(X_LENGTH * 2).fill(".");
    const pairCount = pairs.length;


    for (let pairIndex = 0; pairIndex < pairCount; pairIndex++) {
        const pair = pairs[pairIndex];


        const intersections = getIntersections(pair);

        if (!intersections) {
            printProgress(pairIndex + 1, pairCount);
            continue;
        }

        if (typeof intersections === "number") {
            if (targetRow[intersections - X_MIN] === ".") targetRow[intersections - X_MIN] = "o";
        }
        else {
            for (let index = intersections.minimumXCoordinate - X_MIN; index <= intersections.maximumXCoordinate - X_MIN; index++) {
                if (targetRow[index] === ".") targetRow[index] = "o";
            }
        }


        const [sensorXCoordinate, sensorYCoordinate] = pair.sensor;
        const [beaconXCoordinate, beaconYCoordinate] = pair.beacon;

        if (sensorYCoordinate === ANSWER_Y_COORDINATE) targetRow[sensorXCoordinate - X_MIN] = "S";
        if (beaconYCoordinate === ANSWER_Y_COORDINATE) targetRow[beaconXCoordinate - X_MIN] = "B";


        printProgress(pairIndex + 1, pairCount);
    }


    return targetRow;
}




const getIntersections = (pair: Pair): Intersections | number | null => {
    const [sensorXCoordinate, sensorYCoordinate] = pair.sensor;
    const [beaconXCoordinate, beaconYCoordinate] = pair.beacon;


    const maxDistance = Math.abs(sensorXCoordinate - beaconXCoordinate) + Math.abs(sensorYCoordinate - beaconYCoordinate);


    //go around ring clockwise
    let minimumXCoordinate: number | undefined;
    let maximumXCoordinate: number | undefined;
    let singleSquareOverlapXCoordinate: number | undefined;
    let currentXCoordinate = sensorXCoordinate;
    let currentYCoordinate = sensorYCoordinate + maxDistance;


    if (currentYCoordinate === ANSWER_Y_COORDINATE) singleSquareOverlapXCoordinate = currentXCoordinate;

    while (currentYCoordinate > sensorYCoordinate) {
        currentXCoordinate++;
        currentYCoordinate--;

        if (currentYCoordinate === ANSWER_Y_COORDINATE) maximumXCoordinate = currentXCoordinate;
    }


    while (currentXCoordinate > sensorXCoordinate) {
        currentXCoordinate--;
        currentYCoordinate--;

        if (currentYCoordinate === ANSWER_Y_COORDINATE) maximumXCoordinate = currentXCoordinate;
    }

    if (currentYCoordinate === ANSWER_Y_COORDINATE) singleSquareOverlapXCoordinate = currentXCoordinate;


    while (currentYCoordinate < sensorYCoordinate) {
        currentXCoordinate--;
        currentYCoordinate++;

        if (currentYCoordinate === ANSWER_Y_COORDINATE) minimumXCoordinate = currentXCoordinate;
    }


    while (currentXCoordinate < sensorXCoordinate) {
        currentXCoordinate++;
        currentYCoordinate++;

        if (currentYCoordinate === ANSWER_Y_COORDINATE) minimumXCoordinate = currentXCoordinate;
    }



    if (!minimumXCoordinate && !maximumXCoordinate) return null;

    if (!minimumXCoordinate || !maximumXCoordinate || minimumXCoordinate === maximumXCoordinate) {
        if (singleSquareOverlapXCoordinate) return singleSquareOverlapXCoordinate;

        throw "Only 1 coordinate found.";
    }


    const intersections: Intersections = {
        maximumXCoordinate: maximumXCoordinate,
        minimumXCoordinate: minimumXCoordinate,
    }


    return intersections;
}




const countMarkedNodesInRow = (row: Node[]): number => {
    let count = 0;

    for (const node of row) {
        if (node !== "." && node !== "B") count++;
    }



    return count;
}




const printGridToFile = (grid: Grid): void => {
    const outputStringArray: string[] = [];


    for (const row of grid) {
        const rowStringArray: string[] = [];


        for (let columnIndex = 0; columnIndex < row.length; columnIndex++) {
            const node = row[columnIndex];


            if (columnIndex < 20 || columnIndex > row.length - 20) continue;


            rowStringArray.push(node);
        }


        outputStringArray.push(rowStringArray.join(""));
    }


    const outputString = outputStringArray.join("\r\n");
    const outputPathString = `${process.env.PROJECT_ROOT}/src/day15/output.txt`;


    writeOutputToFile(outputPathString, outputString);
}




const printProgress = (currentCount: number, totalCount: number): void => {
    const fractionalCompletion = currentCount / totalCount;
    const percentCompletion = Math.round(fractionalCompletion * 100);


    const currentTime = (new Date).getTime();

    const intervalMilliseconds = currentTime - startTime;

    const estimatedFinalIntervalTime = intervalMilliseconds / currentCount * totalCount;

    const estimatedMillisecondsToCompletion = estimatedFinalIntervalTime - intervalMilliseconds;


    const intervalObject = getIntervalObject(estimatedMillisecondsToCompletion);

    let intervalString = (intervalObject.days ? `${intervalObject.days}d` : "");
    intervalString += (intervalObject.hours ? `${intervalObject.hours}:` : "");
    intervalString += (intervalObject.minutes ? `${intervalObject.minutes}:` : "");
    intervalString += `${intervalObject.seconds}${intervalObject.minutes ? "." : "s."}`;


    console.log(`${currentCount}/${totalCount} - ${percentCompletion}%. Estimated time to completion: ${intervalString}`);
}