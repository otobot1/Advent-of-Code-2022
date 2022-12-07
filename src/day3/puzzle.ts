import fs from "fs";




export const types = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'] as const;
export type Types = typeof types[number];

const priorities = [null, ...types] as const;




export const main = () => {
    puzzle2();
}




const puzzle1 = () => {
    const inputPath = `${process.env.PROJECT_ROOT}/src/day3/input.txt`;
    if (!inputPath) throw "Invalid inputPath";


    const fileContents = fs.readFileSync(inputPath, "utf8");


    const stringArray = fileContents.split(/\r?\n/);


    let prioritySum = 0;

    for (const backpackContents of stringArray) {
        const backpackLength = backpackContents.length;
        if (backpackLength % 2 !== 0) throw "backpackLength isn't even.";

        const backpackMidpoint = backpackLength / 2;

        const compartment1 = Array.from(backpackContents.slice(0, backpackMidpoint)) as Types[];
        const compartment2 = Array.from(backpackContents.slice(backpackMidpoint)) as Types[];


        let sharedType: Types | undefined;

        outerLoop: for (const type1 of compartment1) {
            for (const type2 of compartment2) {
                if (type1 === type2) {
                    sharedType = type1;
                    break outerLoop;
                }
            }
        }

        if (!sharedType) throw "sharedType is undefined.";


        const priority = priorities.indexOf(sharedType);


        prioritySum += priority;
    }


    console.log(prioritySum);
}




const puzzle2 = () => {
    const inputPath = `${process.env.PROJECT_ROOT}/src/day3/input.txt`;
    if (!inputPath) throw "Invalid inputPath";


    const fileContents = fs.readFileSync(inputPath, "utf8");


    const stringArray = fileContents.split(/\r?\n/);


    let prioritySum = 0;

    for (let backpackIndex = 0; backpackIndex < stringArray.length; backpackIndex += 3) {
        const backpack1 = Array.from(stringArray[backpackIndex]) as Types[];
        const backpack2 = Array.from(stringArray[backpackIndex + 1]) as Types[];
        const backpack3 = Array.from(stringArray[backpackIndex + 2]) as Types[];


        let sharedType: Types | undefined;

        outerLoop: for (const type1 of backpack1) {
            for (const type2 of backpack2) {
                if (type1 === type2) {
                    for (const type3 of backpack3) {
                        if (type1 === type3) {
                            sharedType = type1;
                            break outerLoop;
                        }
                    }
                }
            }
        }

        if (!sharedType) throw "sharedType is undefined.";


        const priority = priorities.indexOf(sharedType);


        prioritySum += priority;
    }


    console.log(prioritySum);
}