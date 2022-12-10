import fs from "fs";




export const main = () => {
    puzzle2();
}




const puzzle1 = () => {
    const inputPath = `${process.env.PROJECT_ROOT}/src/day9/input.txt`;
    if (!inputPath) throw "Invalid inputPath";


    const fileContents = fs.readFileSync(inputPath, "utf8");


    const stringArray = fileContents.split(/\r?\n/);


    const count = getCount(stringArray, 2);


    console.log(count);
}




const puzzle2 = () => {
    const inputPath = `${process.env.PROJECT_ROOT}/src/day9/input.txt`;
    if (!inputPath) throw "Invalid inputPath";


    const fileContents = fs.readFileSync(inputPath, "utf8");


    const stringArray = fileContents.split(/\r?\n/);


    const count = getCount(stringArray, 10);


    console.log(count);
}




const getCount = (stringArray: string[], knotCount: number) => {
    const GRID_LENGTH = 5000;
    const startingPosition = Math.floor(GRID_LENGTH / 2);


    //outer array elements are rows, inner array elements are columns. origin is in top left of grid
    const grid: number[][] = Array(GRID_LENGTH).fill(null).map(() => Array(GRID_LENGTH).fill(0));

    const positions: [number, number][] = Array(knotCount).fill(null).map(() => [startingPosition, startingPosition]);

    grid[startingPosition][startingPosition] = 1;


    for (const string of stringArray) {
        const direction = string.charAt(0);
        const moveLength = Number(string.slice(2));

        if (isNaN(moveLength)) throw "moveLength is NaN.";


        if (direction === "R") moveRight(grid, positions, knotCount, moveLength);
        else if (direction === "L") moveLeft(grid, positions, knotCount, moveLength);
        else if (direction === "U") moveUp(grid, positions, knotCount, moveLength);
        else if (direction === "D") moveDown(grid, positions, knotCount, moveLength);
        else throw "Invalid direction.";
    }


    let count = 0;

    for (const row of grid) {
        for (const position of row) {
            if (position === 1) count++;
        }
    }


    return count;
}




const moveRight = (grid: number[][], positions: [number, number][], knotCount: number, moveLength: number): void => {
    while (moveLength > 0) {
        moveLength--;


        positions[0][0] = positions[0][0] + 1;


        for (let leaderIndex = 0; leaderIndex < knotCount - 1; leaderIndex++) {
            const followerIndex = leaderIndex + 1;

            const leader = positions[leaderIndex];
            const follower = positions[followerIndex];

            const leaderX = leader[0];
            const leaderY = leader[1];
            const followerX = follower[0];
            const followerY = follower[1];


            if (
                (leaderX === followerX || leaderX === followerX + 1 || leaderX === followerX - 1) &&
                (leaderY === followerY || leaderY === followerY + 1 || leaderY === followerY - 1)
            ) break;        //still touching. follower doesn't move.


            handleFollower(follower, leaderX, leaderY, followerX, followerY);


            if (followerIndex === knotCount - 1) grid[follower[0]][follower[1]] = 1;
        }
    }
}


const moveLeft = (grid: number[][], positions: [number, number][], knotCount: number, moveLength: number): void => {
    while (moveLength > 0) {
        moveLength--;


        positions[0][0] = positions[0][0] - 1;


        for (let leaderIndex = 0; leaderIndex < knotCount - 1; leaderIndex++) {
            const followerIndex = leaderIndex + 1;

            const leader = positions[leaderIndex];
            const follower = positions[followerIndex];

            const leaderX = leader[0];
            const leaderY = leader[1];
            const followerX = follower[0];
            const followerY = follower[1];


            if (
                (leaderX === followerX || leaderX === followerX + 1 || leaderX === followerX - 1) &&
                (leaderY === followerY || leaderY === followerY + 1 || leaderY === followerY - 1)
            ) break;        //still touching. follower doesn't move.


            handleFollower(follower, leaderX, leaderY, followerX, followerY);


            if (followerIndex === knotCount - 1) grid[follower[0]][follower[1]] = 1;
        }
    }
}


const moveUp = (grid: number[][], positions: [number, number][], knotCount: number, moveLength: number): void => {
    while (moveLength > 0) {
        moveLength--;


        positions[0][1] = positions[0][1] - 1;


        for (let leaderIndex = 0; leaderIndex < knotCount - 1; leaderIndex++) {
            const followerIndex = leaderIndex + 1;

            const leader = positions[leaderIndex];
            const follower = positions[followerIndex];

            const leaderX = leader[0];
            const leaderY = leader[1];
            const followerX = follower[0];
            const followerY = follower[1];


            if (
                (leaderX === followerX || leaderX === followerX + 1 || leaderX === followerX - 1) &&
                (leaderY === followerY || leaderY === followerY + 1 || leaderY === followerY - 1)
            ) break;        //still touching. follower doesn't move.


            handleFollower(follower, leaderX, leaderY, followerX, followerY);


            if (followerIndex === knotCount - 1) grid[follower[0]][follower[1]] = 1;
        }
    }
}


const moveDown = (grid: number[][], positions: [number, number][], knotCount: number, moveLength: number): void => {
    while (moveLength > 0) {
        moveLength--;


        positions[0][1] = positions[0][1] + 1;


        for (let leaderIndex = 0; leaderIndex < knotCount - 1; leaderIndex++) {
            const followerIndex = leaderIndex + 1;

            const leader = positions[leaderIndex];
            const follower = positions[followerIndex];

            const leaderX = leader[0];
            const leaderY = leader[1];
            const followerX = follower[0];
            const followerY = follower[1];


            if (
                (leaderX === followerX || leaderX === followerX + 1 || leaderX === followerX - 1) &&
                (leaderY === followerY || leaderY === followerY + 1 || leaderY === followerY - 1)
            ) break;        //still touching. follower doesn't move.


            handleFollower(follower, leaderX, leaderY, followerX, followerY);


            if (followerIndex === knotCount - 1) grid[follower[0]][follower[1]] = 1;
        }
    }
}




const handleFollower = (follower: [number, number], leaderX: number, leaderY: number, followerX: number, followerY: number): void => {
    if (leaderX === followerX + 2) {
        follower[0] = followerX + 1;

        if (leaderY === followerY) return;
        else if (leaderY === followerY + 1 || leaderY === followerY - 1) follower[1] = leaderY;
        else if (leaderY === followerY + 2) follower[1] = followerY + 1;
        else if (leaderY === followerY - 2) follower[1] = followerY - 1;
        else throw "Invalid difference."
    }
    else if (leaderX === followerX - 2) {
        follower[0] = followerX - 1;

        if (leaderY === followerY) return;
        else if (leaderY === followerY + 1 || leaderY === followerY - 1) follower[1] = leaderY;
        else if (leaderY === followerY + 2) follower[1] = followerY + 1;
        else if (leaderY === followerY - 2) follower[1] = followerY - 1;
        else throw "Invalid difference."
    }
    else if (leaderY === followerY + 2) {
        follower[1] = followerY + 1;

        if (leaderX === followerX) return;
        else if (leaderX === followerX + 1 || leaderX === followerX - 1) follower[0] = leaderX;
        else if (leaderX === followerX + 2) follower[0] = followerX + 1;
        else if (leaderX === followerX - 2) follower[0] = followerX - 1;
        else throw "Invalid difference."
    }
    else if (leaderY === followerY - 2) {
        follower[1] = followerY - 1;

        if (leaderX === followerX) return;
        else if (leaderX === followerX + 1 || leaderX === followerX - 1) follower[0] = leaderX;
        else if (leaderX === followerX + 2) follower[0] = followerX + 1;
        else if (leaderX === followerX - 2) follower[0] = followerX - 1;
        else throw "Invalid difference."
    }
    else throw "Invalid difference.";
}