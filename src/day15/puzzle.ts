import fs from "fs";
import { writeOutputToFile, printProgress } from "../utils/utils.js";




type Node = "S" | "B" | "." | "o";      //"." = possibly contains beacon. "o" = cannot contain beacon.


type Grid = Node[][];


type Coordinates = [number, number];


type Pair = {
    sensor: Coordinates;
    beacon: Coordinates;
}

type DetailedPair = {
    maxDistance: number;
} & Pair;


type Intersections = {
    minimumXCoordinate: number;
    maximumXCoordinate: number;
}


type CheckedCoordinates = {
    [index: string]: boolean;
}

const checkedCoordinates: CheckedCoordinates = {};




const isTest = false;
const isPartTwo = true;

const X_MIN = isPartTwo ? 0 : (isTest ? -100 : -1500000);
const X_MAX = isPartTwo ? (isTest ? 20 : 4000000) : (isTest ? 100 : 8500000);
const X_LENGTH = X_MAX - X_MIN + 1;

const Y_MIN = isPartTwo ? 0 : (isTest ? -100 : -2000000);
const Y_MAX = isPartTwo ? (isTest ? 20 : 4000000) : (isTest ? 100 : 10000000);
const Y_LENGTH = Y_MAX - Y_MIN + 1;

const ANSWER_Y_COORDINATE = isTest ? 10 : 2000000;


let startTime = 0;




export const main = () => {
    isPartTwo ? puzzle2() : puzzle1();
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




const puzzle2 = () => {
    const inputPath = `${process.env.PROJECT_ROOT}/src/day15/${isTest ? "test-" : ""}input.txt`;
    if (!inputPath) throw "Invalid inputPath";


    const fileContents = fs.readFileSync(inputPath, "utf8");


    const stringArray = fileContents.split(/\r?\n/);


    startTime = (new Date).getTime();


    const pairs = getPairs(stringArray);


    const tuningFrequency = getTuningFrequency(pairs);


    console.log(tuningFrequency);
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
            printProgress(pairIndex + 1, pairCount, startTime);
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


        printProgress(pairIndex + 1, pairCount, startTime);
    }


    return targetRow;
}




const getIntersections = (pair: Pair): Intersections | number | null => {
    const [sensorXCoordinate, sensorYCoordinate] = pair.sensor;

    const maxDistance = getMaxDistance(pair);


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




const getMaxDistance = (pair: Pair): number => {
    const [sensorXCoordinate, sensorYCoordinate] = pair.sensor;
    const [beaconXCoordinate, beaconYCoordinate] = pair.beacon;


    const maxDistance = Math.abs(sensorXCoordinate - beaconXCoordinate) + Math.abs(sensorYCoordinate - beaconYCoordinate);


    return maxDistance;
}




const getTuningFrequency = (pairs: Pair[]): number => {
    const detailedPairs = getDetailedPairs(pairs);


    const targetCoordinates = getTargetCoordinates(detailedPairs);


    const tuningFrequency = (targetCoordinates[0] * 4000000) + targetCoordinates[1];


    return tuningFrequency;
}




const getDetailedPairs = (pairs: Pair[]): DetailedPair[] => {
    const detailedPairs: DetailedPair[] = [];


    for (const pair of pairs) {
        const maxDistance = getMaxDistance(pair);


        const detailedPair = { maxDistance, ...pair };


        detailedPairs.push(detailedPair);
    }


    return detailedPairs;
}




const getTargetCoordinates = (detailedPairs: DetailedPair[]): Coordinates => {
    for (let outerPairIndex = 0; outerPairIndex < detailedPairs.length; outerPairIndex++) {
        const outerDetailedPair = detailedPairs[outerPairIndex];
        const [outerSensorXCoordinate, outerSensorYCoordinate] = outerDetailedPair.sensor;
        const outerMaxDistance = outerDetailedPair.maxDistance;


        let currentXCoordinate = outerSensorXCoordinate;
        let currentYCoordinate = outerSensorYCoordinate + outerMaxDistance + 1;

        while (currentYCoordinate > outerSensorYCoordinate) {
            if (isUntouched(currentXCoordinate, currentYCoordinate, outerDetailedPair, detailedPairs)) return [currentXCoordinate, currentYCoordinate];

            currentXCoordinate++;
            currentYCoordinate--;
        }

        while (currentXCoordinate > outerSensorXCoordinate) {
            if (isUntouched(currentXCoordinate, currentYCoordinate, outerDetailedPair, detailedPairs)) return [currentXCoordinate, currentYCoordinate];

            currentXCoordinate--;
            currentYCoordinate--;
        }

        while (currentYCoordinate < outerSensorYCoordinate) {
            if (isUntouched(currentXCoordinate, currentYCoordinate, outerDetailedPair, detailedPairs)) return [currentXCoordinate, currentYCoordinate];

            currentXCoordinate--;
            currentYCoordinate++;
        }

        while (currentXCoordinate < outerSensorXCoordinate) {
            if (isUntouched(currentXCoordinate, currentYCoordinate, outerDetailedPair, detailedPairs)) return [currentXCoordinate, currentYCoordinate];

            currentXCoordinate++;
            currentYCoordinate++;
        }


        printProgress(outerPairIndex + 1, detailedPairs.length, startTime);
    }


    throw "Unable to find targetCoordinates.";
}




const isUntouched = (xCoordinate: number, yCoordinate: number, outerDetailedPair: DetailedPair, detailedPairs: DetailedPair[]): boolean => {
    if (xCoordinate < X_MIN || xCoordinate > X_MAX || yCoordinate < Y_MIN || yCoordinate > Y_MAX || checkedCoordinates[getCoordinatesString(xCoordinate, yCoordinate)]) return false;


    for (const innerDetailedPair of detailedPairs) {
        if (innerDetailedPair === outerDetailedPair) continue;


        const [innerSensorXCoordinate, innerSensorYCoordinate] = innerDetailedPair.sensor;
        const innerMaxDistance = innerDetailedPair.maxDistance;


        if (
            xCoordinate > innerSensorXCoordinate + innerMaxDistance || xCoordinate < innerSensorXCoordinate - innerMaxDistance ||
            yCoordinate > innerSensorYCoordinate + innerMaxDistance || yCoordinate < innerSensorYCoordinate - innerMaxDistance
        ) continue;


        const distance = Math.abs(xCoordinate - innerSensorXCoordinate) + Math.abs(yCoordinate - innerSensorYCoordinate);


        if (distance <= innerMaxDistance) {
            checkedCoordinates[getCoordinatesString(xCoordinate, yCoordinate)] = true;
            return false;
        }
    }


    return true;
}




const getCoordinatesString = (xCoordinate: number, yCoordinate: number): string => {
    return `[${xCoordinate}, ${yCoordinate}]`;
}