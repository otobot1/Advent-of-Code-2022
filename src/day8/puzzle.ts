import fs from "fs";




export const main = () => {
    puzzle2();
}




const puzzle1 = () => {
    const inputPath = `${process.env.PROJECT_ROOT}/src/day8/input.txt`;
    if (!inputPath) throw "Invalid inputPath";


    const fileContents = fs.readFileSync(inputPath, "utf8");


    const stringArray = fileContents.split(/\r?\n/);


    const grid = getGrid(stringArray);


    const visibilityCount = getVisibilityCount(grid);


    console.log(visibilityCount);
}




const puzzle2 = () => {
    const inputPath = `${process.env.PROJECT_ROOT}/src/day8/input.txt`;
    if (!inputPath) throw "Invalid inputPath";


    const fileContents = fs.readFileSync(inputPath, "utf8");


    const stringArray = fileContents.split(/\r?\n/);


    const grid = getGrid(stringArray);


    const maxScenicScore = getMaxScenicScore(grid);


    console.log(maxScenicScore);
}




const getGrid = (stringArray: string[]): number[][] => {
    const grid: number[][] = [];


    for (const string of stringArray) {
        const characters = string.split("");


        const row: number[] = [];

        for (const char of characters) {
            const num = Number(char);

            if (isNaN(num)) throw "num is NaN.";

            row.push(num);
        }


        grid.push(row);
    }


    return grid;
}




const getVisibilityCount = (grid: number[][]): number => {
    const rowCount = grid.length;
    const columnCount = grid[0].length;

    
    let visibilityCount = 0;
    
    for (let rowIndex = 0; rowIndex < rowCount; rowIndex++) {
        const row = grid[rowIndex];

        for (let columnIndex = 0; columnIndex < columnCount; columnIndex++) {
            const targetTree = row[columnIndex];

            if (isVisible(grid, row, targetTree, rowIndex, columnIndex, rowCount, columnCount)) visibilityCount++;
        }
    }


    return visibilityCount;
}




const isVisible = (grid: number[][], row: number[], targetHeight: number, rowIndex: number, columnIndex: number, rowCount: number, columnCount: number): boolean => {
    if (
        isVisibleLeft(row, targetHeight, columnIndex) ||
        isVisibleRight(row, targetHeight, columnIndex, columnCount) ||
        isVisibleUp(grid, targetHeight, rowIndex, columnIndex) ||
        isVisibleDown(grid, targetHeight, rowIndex, columnIndex, rowCount)
    ) return true;


    return false;
}


const isVisibleLeft = (row: number[], targetHeight: number, columnIndex: number): boolean => {
    if (columnIndex === 0) return true;

    for (const height of row.slice(0, columnIndex)) {
        if (height >= targetHeight) return false;
    }

    return true;
}


const isVisibleRight = (row: number[], targetHeight: number, columnIndex: number, columnCount: number): boolean => {
    if (columnIndex + 1 === columnCount) return true;

    for (const height of row.slice(columnIndex + 1)) {
        if (height >= targetHeight) return false;
    }

    return true;
}


const isVisibleUp = (grid: number[][], targetHeight: number, rowIndex: number, columnIndex: number): boolean => {
    if (rowIndex === 0) return true;

    for (const row of grid.slice(0, rowIndex)) {
        const height = row[columnIndex];

        if (height >= targetHeight) return false;
    }

    return true;
}


const isVisibleDown = (grid: number[][], targetHeight: number, rowIndex: number, columnIndex: number, rowCount: number): boolean => {
    if (rowIndex + 1 === rowCount) return true;

    for (const row of grid.slice(rowIndex + 1)) {
        const height = row[columnIndex];

        if (height >= targetHeight) return false;
    }

    return true;
}




const getMaxScenicScore = (grid: number[][]): number => {
    const rowCount = grid.length;
    const columnCount = grid[0].length;

    
    let maxScenicScore = 0;
    
    for (let rowIndex = 0; rowIndex < rowCount; rowIndex++) {
        const row = grid[rowIndex];


        for (let columnIndex = 0; columnIndex < columnCount; columnIndex++) {
            const targetTree = row[columnIndex];

            
            const leftScore = getLeftScore(row, targetTree, columnIndex);
            const rightScore = getRightScore(row, targetTree, columnIndex, columnCount);
            const upScore = getUpScore(grid, targetTree, rowIndex, columnIndex);
            const downScore = getDownScore(grid, targetTree, rowIndex, columnIndex, rowCount);


            const score = leftScore * rightScore * upScore * downScore;


            if (score > maxScenicScore) maxScenicScore = score;
        }
    }


    return maxScenicScore;
}


const getLeftScore = (row: number[], targetHeight: number, columnIndex: number): number => {
    if (columnIndex === 0) return 0;


    let count = 0;

    for (const height of row.slice(0, columnIndex).reverse()) {
        count++;

        if (height >= targetHeight) break;
    }


    return count;
}


const getRightScore = (row: number[], targetHeight: number, columnIndex: number, columnCount: number): number => {
    if (columnIndex + 1 === columnCount) return 0;


    let count = 0;

    for (const height of row.slice(columnIndex + 1)) {
        count++;

        if (height >= targetHeight) break;
    }


    return count;
}


const getUpScore = (grid: number[][], targetHeight: number, rowIndex: number, columnIndex: number): number => {
    if (rowIndex === 0) return 0;


    let count = 0;

    for (const row of grid.slice(0, rowIndex).reverse()) {
        count++;

        const height = row[columnIndex];

        if (height >= targetHeight) break;
    }


    return count;
}


const getDownScore = (grid: number[][], targetHeight: number, rowIndex: number, columnIndex: number, rowCount: number): number => {
    if (rowIndex + 1 === rowCount) return 0;


    let count = 0;

    for (const row of grid.slice(rowIndex + 1)) {
        count++;

        const height = row[columnIndex];

        if (height >= targetHeight) break;
    }


    return count;
}