import fs from "fs";

import { types, Types } from "../day03/puzzle.js";




export const main = () => {
    puzzle2();
}




const puzzle1 = () => {
    const inputPath = `${process.env.PROJECT_ROOT}/src/day05/input.txt`;
    if (!inputPath) throw "Invalid inputPath";


    const fileContents = fs.readFileSync(inputPath, "utf8");


    const stringArray = fileContents.split(/\r?\n/);


    const emptyRowIndex = stringArray.indexOf("");

    const diagramRows = stringArray.slice(0, emptyRowIndex).reverse();
    const listOfMoves = stringArray.slice(emptyRowIndex + 1);


    const stacks = getStacks(diagramRows);


    for (const move of listOfMoves) {
        const [_junk1, countString, _junk2, originString, _junk3, destinationString] = move.split(" ");


        const countNum = Number(countString);
        const originNum = Number(originString);
        const destinationNum = Number(destinationString);

        if (isNaN(countNum) || isNaN(originNum) || isNaN(destinationNum)) throw "NaN";


        const originStack = stacks[originNum - 1];
        const destinationStack = stacks[destinationNum - 1];


        for (let i = 0; i < countNum; i++) {
            const item =  originStack.pop();

            if (!item) throw "item is undefined";

            destinationStack.push(item);
        }


        stacks[originNum - 1] = originStack;
        stacks[destinationNum - 1] = destinationStack;
    }


    const outputArray: string[] = [];

    for (const stack of stacks) {
        const item = stack.pop();

        if (!item) throw "item is undefined";

        outputArray.push(item);
    }


    console.log(outputArray.join(""));
}




const puzzle2 = () => {
    const inputPath = `${process.env.PROJECT_ROOT}/src/day05/input.txt`;
    if (!inputPath) throw "Invalid inputPath";


    const fileContents = fs.readFileSync(inputPath, "utf8");


    const stringArray = fileContents.split(/\r?\n/);


    const emptyRowIndex = stringArray.indexOf("");

    const diagramRows = stringArray.slice(0, emptyRowIndex).reverse();
    const listOfMoves = stringArray.slice(emptyRowIndex + 1);


    const stacks = getStacks(diagramRows);


    for (const move of listOfMoves) {
        const [_junk1, countString, _junk2, originString, _junk3, destinationString] = move.split(" ");


        const countNum = Number(countString);
        const originNum = Number(originString);
        const destinationNum = Number(destinationString);

        if (isNaN(countNum) || isNaN(originNum) || isNaN(destinationNum)) throw "NaN";


        const oldOriginStack = stacks[originNum - 1];
        const oldDestinationStack = stacks[destinationNum - 1];


        const items = oldOriginStack.slice(oldOriginStack.length - countNum);
        const newOriginStack = oldOriginStack.slice(0, oldOriginStack.length - countNum);

        const newDestinationStack = [...oldDestinationStack, ...items];


        stacks[originNum - 1] = newOriginStack;
        stacks[destinationNum - 1] = newDestinationStack;
    }


    const outputArray: string[] = [];

    for (const stack of stacks) {
        const item = stack.pop();

        if (!item) throw "item is undefined";

        outputArray.push(item);
    }


    console.log(outputArray.join(""));
}




const getStacks = (diagramRows: string[]): Types[][] => {
    const stacks: Types[][] = [];


    for (const row of diagramRows) {
        const columns = row.split("");
        let columnCount = 0;

        for (let columnIndex = 1; columnIndex < columns.length; columnIndex += 4) {
            const column = columns[columnIndex];


            if (column === " " || column === "[" || column === "]") {
                columnCount++;
                continue;
            }


            if (!isNaN(Number(column))) {
                if (Number(column) != columnCount + 1) throw "Invalid column number.";
                stacks.push([]);
            }
            else {
                if (!isType(column)) throw `column '${column}' is not a valid Type.`;

                stacks[columnCount].push(column);
            }


            columnCount++;
        }
    }


    return stacks;
}




const isType = (string: string): string is Types => {   //@ts-ignore
    return types.includes(string);
}