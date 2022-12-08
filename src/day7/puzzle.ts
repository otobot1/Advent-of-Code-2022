import fs from "fs";




type Directory = {
    name: string;
    parentDirectory: string;
    directContentsSize: number;
    subDirectories: string[];
}

type DirectoryCollection = {
    [index: string]: Directory;
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


    const directoryCollection = getDirectoryCollection(stringArray);


    const overallSum = getOverallSum(directoryCollection);


    console.log(overallSum);
}




const getDirectoryCollection = (stringArray: string[]): DirectoryCollection => {
    const directoryCollection: DirectoryCollection = {
        "/": {
            name: "/",
            parentDirectory: "",
            directContentsSize: 0,
            subDirectories: [],
        }
    };

    let currentDirectory = directoryCollection["/"];


    for (const command of stringArray) {
        if (command.startsWith(cdPrefix)) {
            currentDirectory = handleCd(directoryCollection, currentDirectory, command);    //breaks here because code expects unique dir names :dead:
            continue;
        }


        if (command.startsWith("$")) continue;   //handles "$ ls"


        if (command.startsWith(dirPrefix)) {
            const remainder = command.slice(dirPrefix.length);

            currentDirectory.subDirectories.push(remainder);

            continue;
        }

        
        const size = Number(command.split(" ")[0]);

        if (isNaN(size)) throw "size is NaN.";

        currentDirectory.directContentsSize += size;
    }


    return directoryCollection;
}




const handleCd = (directoryCollection: DirectoryCollection, currentDirectory: Directory, command: string): Directory => {
    const remainder = command.slice(cdPrefix.length);

    if (remainder === "..") return directoryCollection[currentDirectory.parentDirectory];


    let newCurrentDirectory = directoryCollection[remainder];

    if (!newCurrentDirectory) {
        newCurrentDirectory = {
            name: remainder,
            parentDirectory: currentDirectory.name,
            directContentsSize: 0,
            subDirectories: [],
        };

        directoryCollection[remainder] = newCurrentDirectory;
    }


    return newCurrentDirectory;
}




const getOverallSum = (directoryCollection: DirectoryCollection): number => {
    let overallSum = 0;


    for (const [_primaryDirectoryName, primaryDirectory] of Object.entries(directoryCollection)) {
        const directorySum = getSumRecursive(directoryCollection, primaryDirectory);

        if (directorySum <= 100000) overallSum += directorySum;
    }


    return overallSum;
}




const getSumRecursive = (directoryCollection: DirectoryCollection, directory: Directory): number => {
    let sum = directory.directContentsSize;


    for (const subDirectoryName of directory.subDirectories) {
        sum += getSumRecursive(directoryCollection, directoryCollection[subDirectoryName]);
    }


    return sum;
}