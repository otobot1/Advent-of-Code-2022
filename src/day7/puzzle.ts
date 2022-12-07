import fs from "fs";




type Directory = {
    name: string;
    parentDirectory: string;
    directContentsSize: number;
    subDirectories: string[];
}

type DirectoryList = {
    [index: string]: Directory;
}




export const main = () => {
    puzzle1();
}




const puzzle1 = () => {
    const inputPath = `${process.env.PROJECT_ROOT}/src/day7/test-input.txt`;
    if (!inputPath) throw "Invalid inputPath";


    const fileContents = fs.readFileSync(inputPath, "utf8");


    const stringArray = fileContents.split(/\r?\n/);


    const directoryList: DirectoryList = {};
    let currentDirectory: Directory;

    for (const command of stringArray) {

    }
}