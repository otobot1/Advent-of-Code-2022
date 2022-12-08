import fs from "fs";




type Directory = {
    name: string;
    directContentsSize: number;
    subDirectories: {
        [index: string]: Directory;
    };
}




export const main = () => {
    puzzle1();
}




const cdPrefix = "$ cd ";
const dirPrefix = "dir ";




const puzzle1 = () => {
    const inputPath = `${process.env.PROJECT_ROOT}/src/day7/input.txt`;
    if (!inputPath) throw "Invalid inputPath";


    const fileContents = fs.readFileSync(inputPath, "utf8");


    const stringArray = fileContents.split(/\r?\n/);


    const rootDirectory = getRootDirectory(stringArray);


    const overallSum = getOverallSum(rootDirectory);


    console.log(overallSum);
}




const puzzle2 = () => {
    const inputPath = `${process.env.PROJECT_ROOT}/src/day7/input.txt`;
    if (!inputPath) throw "Invalid inputPath";


    const fileContents = fs.readFileSync(inputPath, "utf8");


    const stringArray = fileContents.split(/\r?\n/);


    const rootDirectory = getRootDirectory(stringArray);


    const overallSum = getOverallSum(rootDirectory);


    console.log(overallSum);
}




const getRootDirectory = (stringArray: string[]): Directory => {
    const rootDirectory: Directory = {
        name: "/",
        directContentsSize: 0,
        subDirectories: {},
    };

    let directoryBuffer: Directory[] = [];
    let currentDirectory = rootDirectory;


    for (const command of stringArray) {
        if (command.startsWith(cdPrefix)) {
            currentDirectory = handleCd(directoryBuffer, currentDirectory, command);
            continue;
        }


        if (command.startsWith("$")) continue;   //handles "$ ls"


        if (command.startsWith(dirPrefix)) {
            handleDir(currentDirectory, command);

            continue;
        }


        const size = Number(command.split(" ")[0]);

        if (isNaN(size)) throw "size is NaN.";

        currentDirectory.directContentsSize += size;
    }


    return rootDirectory;
}




const handleCd = (directoryBuffer: Directory[], currentDirectory: Directory, command: string): Directory => {
    const remainder = command.slice(cdPrefix.length);


    if (remainder === "/") return currentDirectory;


    let newCurrentDirectory: Directory | undefined;


    if (remainder === "..") {
        newCurrentDirectory = directoryBuffer.pop();
    }
    else {
        newCurrentDirectory = currentDirectory.subDirectories[remainder];
        directoryBuffer.push(currentDirectory);
    }


    if (!newCurrentDirectory) throw "newCurrentDirectory is undefined.";

    return newCurrentDirectory;
}




const handleDir = (currentDirectory: Directory, command: string): void => {
    const remainder = command.slice(dirPrefix.length);

    const newDirectory: Directory = {
        name: remainder,
        directContentsSize: 0,
        subDirectories: {},
    };

    currentDirectory.subDirectories[remainder] = newDirectory;
}




const getOverallSum = (rootDirectory: Directory): number => {
    const sumArray: number[] = [];

    getSumArray(sumArray, rootDirectory);


    let overallSum = 0;

    for (const sum of sumArray) {
        if (sum <= 100000) overallSum += sum;
    }


    return overallSum;
}




const getSumArray = (sumArray: number[], directory: Directory): number => {
    let sum = directory.directContentsSize;


    for (const [_subDirectoryName, subDirectory] of Object.entries(directory.subDirectories)) {
        sum += getSumArray(sumArray, subDirectory);
    }


    sumArray.push(sum);


    return sum;
}