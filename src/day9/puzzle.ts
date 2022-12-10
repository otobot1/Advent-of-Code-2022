import fs from "fs";




export const main = () => {
    puzzle1();
}




const puzzle1 = () => {
    const inputPath = `${process.env.PROJECT_ROOT}/src/day9/input.txt`;
    if (!inputPath) throw "Invalid inputPath";


    const fileContents = fs.readFileSync(inputPath, "utf8");


    const stringArray = fileContents.split(/\r?\n/);


    const count = getCount(stringArray);


    console.log(count);
}




const getCount = (stringArray: string[]) => {
    const ARRAY_LENGTH = 1000;
    const startingPosition = Math.floor(ARRAY_LENGTH / 2);


    //outer array elements are rows, inner array elements are columns. origin is in top left of grid
    const positions: number[][] = Array(ARRAY_LENGTH).fill(null).map(() => Array(ARRAY_LENGTH).fill(0));


    const headPosition: [number, number] = [startingPosition, startingPosition];        //[X, Y]
    const tailPosition: [number, number] = [startingPosition, startingPosition];        //[X, Y]

    positions[startingPosition][startingPosition] = 1;


    for (const string of stringArray) {
        const direction = string.charAt(0);
        const moveLength = Number(string.slice(2));

        if (isNaN(moveLength)) throw "moveLength is NaN.";


        if (direction === "R") moveRight(positions, headPosition, tailPosition, moveLength);
        else if (direction === "L") moveLeft(positions, headPosition, tailPosition, moveLength);
        else if (direction === "U") moveUp(positions, headPosition, tailPosition, moveLength);
        else if (direction === "D") moveDown(positions, headPosition, tailPosition, moveLength);
        else throw "Invalid direction.";
    }


    let count = 0;

    for (const row of positions) {
        for (const position of row) {
            if (position === 1) count++;
        }
    }


    return count;
}




const moveRight = (positions: number[][], headPosition: [number, number], tailPosition: [number, number], moveLength: number): void => {
    while (moveLength > 0) {
        moveLength--;


        headPosition[0] = headPosition[0] + 1;


        const tailX = tailPosition[0];
        const tailY = tailPosition[1];
        const headX = headPosition[0];
        const headY = headPosition[1];


        if (
            (tailX === headX || tailX === headX + 1 || tailX === headX - 1) &&
            (tailY === headY || tailY === headY + 1 || tailY === headY - 1)
        ) continue;     //still touching. tail doesn't move.

        tailPosition[0] = headX - 1;
        tailPosition[1] = headY;


        positions[tailPosition[0]][tailPosition[1]] = 1;
    }
}


const moveLeft = (positions: number[][], headPosition: [number, number], tailPosition: [number, number], moveLength: number): void => {
    while (moveLength > 0) {
        moveLength--;


        headPosition[0] = headPosition[0] - 1;


        const tailX = tailPosition[0];
        const tailY = tailPosition[1];
        const headX = headPosition[0];
        const headY = headPosition[1];


        if (
            (tailX === headX || tailX === headX + 1 || tailX === headX - 1) &&
            (tailY === headY || tailY === headY + 1 || tailY === headY - 1)
        ) continue;     //still touching. tail doesn't move.

        tailPosition[0] = headX + 1;
        tailPosition[1] = headY;


        positions[tailPosition[0]][tailPosition[1]] = 1;
    }
}


const moveUp = (positions: number[][], headPosition: [number, number], tailPosition: [number, number], moveLength: number): void => {
    while (moveLength > 0) {
        moveLength--;


        headPosition[1] = headPosition[1] - 1;


        const tailX = tailPosition[0];
        const tailY = tailPosition[1];
        const headX = headPosition[0];
        const headY = headPosition[1];


        if (
            (tailX === headX || tailX === headX + 1 || tailX === headX - 1) &&
            (tailY === headY || tailY === headY + 1 || tailY === headY - 1)
        ) continue;     //still touching. tail doesn't move.

        tailPosition[0] = headX;
        tailPosition[1] = headY + 1;


        positions[tailPosition[0]][tailPosition[1]] = 1;
    }
}


const moveDown = (positions: number[][], headPosition: [number, number], tailPosition: [number, number], moveLength: number): void => {
    while (moveLength > 0) {
        moveLength--;


        headPosition[1] = headPosition[1] + 1;


        const tailX = tailPosition[0];
        const tailY = tailPosition[1];
        const headX = headPosition[0];
        const headY = headPosition[1];


        if (
            (tailX === headX || tailX === headX + 1 || tailX === headX - 1) &&
            (tailY === headY || tailY === headY + 1 || tailY === headY - 1)
        ) continue;     //still touching. tail doesn't move.

        tailPosition[0] = headX;
        tailPosition[1] = headY - 1;


        positions[tailPosition[0]][tailPosition[1]] = 1;
    }
}