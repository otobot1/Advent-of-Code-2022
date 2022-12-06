import fs from "fs";




export const main = () => {
    puzzle1();
}




const puzzle1 = () => {
    const inputPath = `${process.env.PROJECT_ROOT}/src/day5/input.txt`;
    if (!inputPath) throw "Invalid inputPath";


    const fileContents = fs.readFileSync(inputPath, "utf8");


    const stringArray = fileContents.split(/\r?\n/);


    const emptyRowIndex = stringArray.indexOf("");

    const diagramRows = stringArray.slice(0, emptyRowIndex);
    const listOfMoves = stringArray.slice(emptyRowIndex + 1);


    console.log(diagramRows[diagramRows.length - 1].split(" "))
}