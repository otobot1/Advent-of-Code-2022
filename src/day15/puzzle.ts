import fs from "fs";
import { writeOutputToFile } from "../utils/utils.js";




type Node = "S" | "B" | "." | "o";      //"." = possibly contains beacon. "o" = cannot contain beacon.


type Grid = Node[][];


type Coordinates = [number, number];


type Pair = {
    sensor: Coordinates;
    beacon: Coordinates;
}




const isTest = false;

const X_MIN = isTest ? -100 : -1500000;
const X_MAX = isTest ? 100 : 8500000;
const X_LENGTH = X_MAX - X_MIN + 1;

const Y_MIN = isTest ? -100 : -2000000;
const Y_MAX = isTest ? 100 : 10000000
const Y_LENGTH = Y_MAX - Y_MIN + 1;

const ANSWER_Y_COORDINATE = isTest ? 10 : 2000000;




export const main = () => {
    puzzle1();
}




const puzzle1 = () => {
    const inputPath = `${process.env.PROJECT_ROOT}/src/day15/${isTest ? "test-" : ""}input.txt`;
    if (!inputPath) throw "Invalid inputPath";


    const fileContents = fs.readFileSync(inputPath, "utf8");


    const stringArray = fileContents.split(/\r?\n/);


    const pairs = getPairs(stringArray);


    const markedGrid = getMarkedGrid(pairs);


    printGridToFile(markedGrid);


    const markedNodesCount = countMarkedNodesInRow(markedGrid);


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




const getMarkedGrid = (pairs: Pair[]): Grid => {
    const grid: Grid = Array(Y_LENGTH * 2).fill(null).map((): Node[] => Array(X_LENGTH * 2).fill("."));


    for (const pair of pairs) {
        const [sensorXCoordinate, sensorYCoordinate] = pair.sensor;
        const [beaconXCoordinate, beaconYCoordinate] = pair.beacon;


        const maxDistance = Math.abs(sensorXCoordinate - beaconXCoordinate) + Math.abs(sensorYCoordinate - beaconYCoordinate);


        for (let currentDistance = 1; currentDistance <= maxDistance; currentDistance++) {      //go around ring clockwise
            let currentXCoordinate = sensorXCoordinate;
            let currentYCoordinate = sensorYCoordinate + currentDistance;


            while (currentYCoordinate > sensorYCoordinate) {
                if (grid[currentYCoordinate - Y_MIN][currentXCoordinate - X_MIN] === ".") grid[currentYCoordinate - Y_MIN][currentXCoordinate - X_MIN] = "o";

                currentXCoordinate++;
                currentYCoordinate--;
            }


            while (currentXCoordinate > sensorXCoordinate) {
                if (grid[currentYCoordinate - Y_MIN][currentXCoordinate - X_MIN] === ".") grid[currentYCoordinate - Y_MIN][currentXCoordinate - X_MIN] = "o";

                currentXCoordinate--;
                currentYCoordinate--;
            }


            while (currentYCoordinate < sensorYCoordinate) {
                if (grid[currentYCoordinate - Y_MIN][currentXCoordinate - X_MIN] === ".") grid[currentYCoordinate - Y_MIN][currentXCoordinate - X_MIN] = "o";

                currentXCoordinate--;
                currentYCoordinate++;
            }


            while (currentXCoordinate < sensorXCoordinate) {
                if (grid[currentYCoordinate - Y_MIN][currentXCoordinate - X_MIN] === ".") grid[currentYCoordinate - Y_MIN][currentXCoordinate - X_MIN] = "o";

                currentXCoordinate++;
                currentYCoordinate++;
            }
        }


        grid[sensorYCoordinate - Y_MIN][sensorXCoordinate - X_MIN] = "S";
        grid[beaconYCoordinate - Y_MIN][beaconXCoordinate - X_MIN] = "B";
    }


    return grid;
}




const countMarkedNodesInRow = (grid: Grid): number => {
    const row = grid[ANSWER_Y_COORDINATE - Y_MIN];


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