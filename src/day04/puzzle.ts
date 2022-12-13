import fs from "fs";




export const main = () => {
    puzzle2();
}




const puzzle1 = () => {
    const inputPath = `${process.env.PROJECT_ROOT}/src/day04/input.txt`;
    if (!inputPath) throw "Invalid inputPath";


    const fileContents = fs.readFileSync(inputPath, "utf8");


    const stringArray = fileContents.split(/\r?\n/);


    let overlapCount = 0;

    for (const pair of stringArray) {
        const ranges = pair.split(",");
        const range1 = ranges[0];
        const range2 = ranges[1];


        const range1Endpoints = range1.split("-");

        const range1Start = Number(range1Endpoints[0]);
        if (isNaN(range1Start)) throw "range1Start is NaN.";

        const range1End = Number(range1Endpoints[1]);
        if (isNaN(range1End)) throw "range1End is NaN.";


        const range2Endpoints = range2.split("-");

        const range2Start = Number(range2Endpoints[0]);
        if (isNaN(range2Start)) throw "range2Start is NaN.";
        
        const range2End = Number(range2Endpoints[1]);
        if (isNaN(range2End)) throw "range2End is NaN.";


        if ((range1Start >= range2Start && range1End <= range2End) || (range2Start >= range1Start && range2End <= range1End)) overlapCount++;
    }


    console.log(overlapCount);
}




const puzzle2 = () => {
    const inputPath = `${process.env.PROJECT_ROOT}/src/day04/input.txt`;
    if (!inputPath) throw "Invalid inputPath";


    const fileContents = fs.readFileSync(inputPath, "utf8");


    const stringArray = fileContents.split(/\r?\n/);


    let overlapCount = 0;

    for (const pair of stringArray) {
        const ranges = pair.split(",");
        const range1String = ranges[0];
        const range2String = ranges[1];


        const range1Endpoints = range1String.split("-");

        const range1Start = Number(range1Endpoints[0]);
        if (isNaN(range1Start)) throw "range1Start is NaN.";

        const range1End = Number(range1Endpoints[1]);
        if (isNaN(range1End)) throw "range1End is NaN.";


        const range2Endpoints = range2String.split("-");

        const range2Start = Number(range2Endpoints[0]);
        if (isNaN(range2Start)) throw "range2Start is NaN.";
        
        const range2End = Number(range2Endpoints[1]);
        if (isNaN(range2End)) throw "range2End is NaN.";


        const range1: number[] = [];

        for (let section = range1Start; section <= range1End; section++) {
            range1.push(section);
        }


        for (const section of range1) {
            if (section >= range2Start && section <= range2End) {
                overlapCount++;
                break;
            }
        }
    }


    console.log(overlapCount);
}