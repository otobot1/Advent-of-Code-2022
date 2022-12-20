import fs from "fs";




const isTest = false;
const isPartTwo = true;




export const main = () => {
    isPartTwo ? puzzle2() : puzzle1();
}




const puzzle1 = () => {
    const inputPath = `${process.env.PROJECT_ROOT}/src/day20/${isTest ? "test-" : ""}input.txt`;
    if (!inputPath) throw "Invalid inputPath";


    const fileContents = fs.readFileSync(inputPath, "utf8");


    const stringArray = fileContents.split(/\r?\n/);
}




const puzzle2 = () => {
    const inputPath = `${process.env.PROJECT_ROOT}/src/day20/${isTest ? "test-" : ""}input.txt`;
    if (!inputPath) throw "Invalid inputPath";


    const fileContents = fs.readFileSync(inputPath, "utf8");


    const stringArray = fileContents.split(/\r?\n/);
}