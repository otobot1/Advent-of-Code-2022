import fs from "fs";
import { writeOutputToFile } from "../utils/utils.js"




type Coordinates = [number, number];

type Node = "A" | "R" | "S" | "O";

type Grid = Node[][];


type GridInfo = {
    lowestRock: number;
    grid: Grid;
}




const sandOrigin = [500, 0] as const;
const X_MIN = 300;
const X_MAX = 700;
const Y_MIN = 0;
const Y_MAX = 200;
const X_LENGTH = X_MAX - X_MIN;
const Y_LENGTH = Y_MAX - Y_MIN;




export const main = () => {
    puzzle2();
}




const puzzle1 = () => {
    const inputPath = `${process.env.PROJECT_ROOT}/src/day14/input.txt`;
    if (!inputPath) throw "Invalid inputPath";


    const fileContents = fs.readFileSync(inputPath, "utf8");


    const stringArray = fileContents.split(/\r?\n/);


    const gridInfo = getGridinfo(stringArray);


    placeSand(gridInfo);


    printGridToFile(gridInfo);


    const sandCount = getSandCount(gridInfo.grid);


    console.log(sandCount);
}




const puzzle2 = () => {
    const inputPath = `${process.env.PROJECT_ROOT}/src/day14/input.txt`;
    if (!inputPath) throw "Invalid inputPath";


    const fileContents = fs.readFileSync(inputPath, "utf8");


    const stringArray = fileContents.split(/\r?\n/);


    const gridInfo = getGridinfo(stringArray);


    addFloor(gridInfo);


    placeSand(gridInfo);


    printGridToFile(gridInfo);


    const sandCount = getSandCount(gridInfo.grid);


    console.log(sandCount);
}




const getGridinfo = (stringArray: string[]): GridInfo => {


    //grid[0] is y=0. grid[n][0] is x=300. y-axis goes from 0 to 200. x-axis goes from 300 to 700.
    const grid: Grid = Array(Y_LENGTH).fill(null).map(() => Array(X_LENGTH).fill("A"));

    grid[sandOrigin[1] - Y_MIN][sandOrigin[0] - X_MIN] = "O";


    let lowestRock = 0;

    for (const string of stringArray) {
        const coordinates = getCoordinatesFromRow(string);


        for (let index = 0; index < coordinates.length - 1; index++) {
            const startingCoordinates = coordinates[index];
            const endingCoordinates = coordinates[index + 1];

            markRockLine(grid, startingCoordinates, endingCoordinates);

            if (startingCoordinates[1] > lowestRock) lowestRock = startingCoordinates[1];
            else if (endingCoordinates[1] > lowestRock) lowestRock = endingCoordinates[1];
        }
    }


    const gridInfo: GridInfo = {
        lowestRock: lowestRock,
        grid: grid,
    }


    return gridInfo;
}




const getCoordinatesFromRow = (rowString: string): Coordinates[] => {
    const coordinatePairs = rowString.split(" -> ");


    const coordinates: Coordinates[] = [];

    for (const coordinatePair of coordinatePairs) {
        const coordinateStrings = coordinatePair.split(",");


        const xCoordinate = Number(coordinateStrings[0]);
        const yCoordinate = Number(coordinateStrings[1]);

        if (isNaN(xCoordinate) || isNaN(yCoordinate)) throw "Invalid coordinate.";


        coordinates.push([xCoordinate, yCoordinate]);
    }


    return coordinates;
}




const markRockLine = (grid: Grid, startingCoordinates: Coordinates, endingCoordinates: Coordinates): void => {
    let isHorizontal: boolean;

    if (startingCoordinates[0] === endingCoordinates[0] && startingCoordinates[1] !== endingCoordinates[1]) isHorizontal = false;
    else if (startingCoordinates[0] !== endingCoordinates[0] && startingCoordinates[1] === endingCoordinates[1]) isHorizontal = true;
    else throw "Invalid coordinates.";


    let coordinates = startingCoordinates;
    let isIncreasing: boolean;

    if (isHorizontal) {
        if (startingCoordinates[0] < endingCoordinates[0]) isIncreasing = true;
        else isIncreasing = false;


        for (let i = 0; ; i++) {
            if (i > 999) throw "Unbounded for loop.";


            const xCoordinate = coordinates[0];
            const yCoordinate = coordinates[1];

            grid[yCoordinate - Y_MIN][xCoordinate - X_MIN] = "R";


            if (coordinates[0] === endingCoordinates[0]) break;


            isIncreasing ? coordinates[0]++ : coordinates[0]--;
        }
    }
    else {
        if (startingCoordinates[1] < endingCoordinates[1]) isIncreasing = true;
        else isIncreasing = false;


        for (let i = 0; ; i++) {
            if (i > 999) throw "Unbounded for loop.";
            const xCoordinate = coordinates[0];
            const yCoordinate = coordinates[1];

            grid[yCoordinate - Y_MIN][xCoordinate - X_MIN] = "R";


            if (coordinates[1] === endingCoordinates[1]) break;


            isIncreasing ? coordinates[1]++ : coordinates[1]--;
        }
    }
}




const placeSand = (gridInfo: GridInfo): void => {
    const grid = gridInfo.grid;
    const lowestRock = gridInfo.lowestRock;


    for (let i = 0; i < 999999; i++) {
        if (grid[sandOrigin[1] - Y_MIN][sandOrigin[0] - X_MIN] === "S") return; 


        let coordinates: Coordinates = [...sandOrigin];
        let isSettled = false;


        for (let j = 0; j < 9999; j++) {
            const xCoordinate = coordinates[0];
            const yCoordinate = coordinates[1];
            const newYCoordinate = yCoordinate + 1;


            if (yCoordinate > lowestRock + 2) return;      //no more sand will settle


            if (grid[newYCoordinate - Y_MIN][xCoordinate - X_MIN] === "A") coordinates = [xCoordinate, newYCoordinate];
            else if (grid[newYCoordinate - Y_MIN][xCoordinate - X_MIN - 1] === "A") coordinates = [xCoordinate - 1, newYCoordinate];
            else if (grid[newYCoordinate - Y_MIN][xCoordinate - X_MIN + 1] === "A") coordinates = [xCoordinate + 1, newYCoordinate];
            else {
                isSettled = true;
                break;
            }
        }


        if (!isSettled) throw "Failed to settle.";


        const finalXCoordinate = coordinates[0];
        const finalYCoordinate = coordinates[1];

        grid[finalYCoordinate - Y_MIN][finalXCoordinate - X_MIN] = "S";
    }


    throw "placeSand didn't return.";
}




const getSandCount = (grid: Grid): number => {
    let sandCount = 0;


    for (const row of grid) {
        for (const node of row) {
            if (node === "S") sandCount++;
        }
    }


    return sandCount;
}




const printGridToFile = (gridInfo: GridInfo): void => {
    const grid = gridInfo.grid;
    const outputStringArray: string[] = [];


    for (const row of grid) {
        const rowStringArray: string[] = [];


        for (let columnIndex = 0; columnIndex < row.length; columnIndex++) {
            const node = row[columnIndex];


            if (columnIndex < 150 || columnIndex > row.length - 150) continue;


            let string: string;

            if (node === "O") string = "+";
            else if (node === "A") string = ".";
            else if (node === "R") string = "#";
            else if (node === "S") string = "o";
            else throw "Invalid node.";


            rowStringArray.push(string);
        }


        outputStringArray.push(rowStringArray.join(""));
    }


    const outputString = outputStringArray.join("\r\n");
    const outputPathString = `${process.env.PROJECT_ROOT}/src/day14/output.txt`;


    writeOutputToFile(outputPathString, outputString);
}




const addFloor = (gridInfo: GridInfo): void => {
    const grid = gridInfo.grid;
    const lowestRock = gridInfo.lowestRock;
    

    const floorYLevel = lowestRock + 2;
    const newFloorRow: Node[] = Array(X_LENGTH).fill("R");


    grid[floorYLevel] = newFloorRow;
}