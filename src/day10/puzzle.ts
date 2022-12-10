import fs from "fs";




const states = ["noop", "add1", "add2"] as const;
type States = typeof states[number];




export const main = () => {
    puzzle2();
}




const puzzle1 = () => {
    const inputPath = `${process.env.PROJECT_ROOT}/src/day10/input.txt`;
    if (!inputPath) throw "Invalid inputPath";


    const fileContents = fs.readFileSync(inputPath, "utf8");


    const stringArray = fileContents.split(/\r?\n/);


    const signalStrengthSum = getSignalStrengthSum(stringArray);


    console.log(signalStrengthSum);
}




const puzzle2 = () => {
    const inputPath = `${process.env.PROJECT_ROOT}/src/day10/input.txt`;
    if (!inputPath) throw "Invalid inputPath";


    const fileContents = fs.readFileSync(inputPath, "utf8");


    const stringArray = fileContents.split(/\r?\n/);


    const image = getImage(stringArray);


    const outputStringArray = getOutputStringArray(image);


    const outputString = outputStringArray.join("\r\n");


    console.log(outputString);
}




const getImage = (stringArray: string[]): number[] => {
    const image: number[] = Array(40 * 6).fill(0);
    const stringArrayLength = stringArray.length;
    let stringIndex = -1;
    let state: States = <States>"noop";
    let cycle = 1;
    let xRegister = 1;
    let numToAdd: number | undefined = undefined;


    while (cycle <= 99999) {
        if (cycle >= xRegister - 1 && cycle <= xRegister + 1) image[cycle - 1] = 1;


        if (state === "noop" || state === "add2") {
            stringIndex++;

            if (stringIndex >= stringArrayLength) break;

            const string = stringArray[stringIndex];


            const instruction = string.slice(0, 4);


            if (instruction === "noop") state === "noop";
            else if (instruction === "addx") {
                const num = Number(string.slice(5));

                if (isNaN(num)) throw "num is NaN.";


                state = "add1";
                numToAdd = num;
            }
            else throw "Invalid instruction.";
        }
        else if (state === "add1") {
            if (numToAdd === undefined) throw "Cannot add undefined number.";

            xRegister += numToAdd;
            numToAdd = undefined;
            state = "add2";
        }
        else throw "Invalid state.";


        cycle++;
    }


    return image;
}




const getOutputStringArray = (image: number[]): string[] => {
    const outputStringArray: string[] = [];


    for (let index = 0; index < image.length;) {
        const indexMax = index + 39;
        let outputString = "";


        for (; index <= indexMax; index++) {
            const pixel: string = image[index] === 1 ? "#" : ".";

            outputString = outputString.concat(pixel);
        }


        outputStringArray.push(outputString);
    }


    return outputStringArray;
}




const getSignalStrengthSum = (stringArray: string[]): number => {
    const stringArrayLength = stringArray.length;
    let signalStrengthSum = 0;
    let stringIndex = -1;
    let state: States = <States>"noop";
    let cycle = 1;
    let xRegister = 1;
    let numToAdd: number | undefined = undefined;


    while (cycle <= 99999) {
        if (cycle % 40 === 20) signalStrengthSum += (xRegister * cycle);


        if (state === "noop" || state === "add2") {
            stringIndex++;

            if (stringIndex >= stringArrayLength) break;

            const string = stringArray[stringIndex];


            const instruction = string.slice(0, 4);


            if (instruction === "noop") state === "noop";
            else if (instruction === "addx") {
                const num = Number(string.slice(5));

                if (isNaN(num)) throw "num is NaN.";


                state = "add1";
                numToAdd = num;
            }
            else throw "Invalid instruction.";
        }
        else if (state === "add1") {
            if (numToAdd === undefined) throw "Cannot add undefined number.";

            xRegister += numToAdd;
            numToAdd = undefined;
            state = "add2";
        }
        else throw "Invalid state.";


        cycle++;
    }


    return signalStrengthSum;
}