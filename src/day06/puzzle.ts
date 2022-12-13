import fs from "fs";




export const main = () => {
    puzzle2();
}




const puzzle1 = () => {
    const inputPath = `${process.env.PROJECT_ROOT}/src/day06/input.txt`;
    if (!inputPath) throw "Invalid inputPath";


    const fileContents = fs.readFileSync(inputPath, "utf8");


    const letters = fileContents.split("");
    const letterCount = letters.length;


    let firstLetter = letters[0];
    let secondLetter = letters[1];
    let thirdLetter = letters[2];
    let endOfMarker = -1;

    for (let letterIndex = 1; letterIndex < letterCount; letterIndex++) {
        const currentLetter = letters[letterIndex];


        if (firstLetter === secondLetter || firstLetter === thirdLetter || secondLetter === thirdLetter || currentLetter === firstLetter || currentLetter === secondLetter || currentLetter === thirdLetter) {
            firstLetter = secondLetter;
            secondLetter = thirdLetter;
            thirdLetter = currentLetter;
        }
        else {
            endOfMarker = letterIndex;
            break;
        }
    }

    console.log(endOfMarker + 1);
}




const puzzle2 = () => {
    const inputPath = `${process.env.PROJECT_ROOT}/src/day06/input.txt`;
    if (!inputPath) throw "Invalid inputPath";


    const fileContents = fs.readFileSync(inputPath, "utf8");


    const MARKER_LENGTH = 14;
    const bufferLength = MARKER_LENGTH - 1;
    const lettersBuffer = Array.apply(null, Array(bufferLength));


    const letters = fileContents.split("");
    const letterCount = letters.length;


    let endOfMarker = -1;

    for (let currentLetterIndex = 1; currentLetterIndex < letterCount; currentLetterIndex++) {
        const currentLetter = letters[currentLetterIndex];


        if (!hasDuplicate(currentLetter, lettersBuffer, bufferLength)) {
            endOfMarker = currentLetterIndex;
            break;
        };
    }

    console.log(endOfMarker + 1);
}




const hasDuplicate = (currentLetter: string, lettersBuffer: (string | unknown)[], bufferLength: number): boolean => {
    for (let outerIndex = 0; outerIndex < bufferLength; outerIndex++) {
        const outerLetter = lettersBuffer[outerIndex];

        if (!outerLetter) {
            lettersBuffer[outerIndex] = currentLetter;
            return true;
        }


        for (let innerIndex = 0; innerIndex < bufferLength; innerIndex++) {
            if (outerIndex === innerIndex) continue;

            const innerLetter = lettersBuffer[innerIndex];

            if (outerLetter === innerLetter) {
                handleFailure(currentLetter, lettersBuffer, bufferLength);

                return true;
            }
        }


        if (outerLetter === currentLetter) {
            handleFailure(currentLetter, lettersBuffer, bufferLength);

            return true;
        }
    }


    return false;
}




const handleFailure = (currentLetter: string, lettersBuffer: (string | unknown)[], bufferLength: number): void => {
    for (let failIndex = 0; failIndex < bufferLength - 1; failIndex++) {
        const indexLetter = lettersBuffer[failIndex];
        const nextLetter = lettersBuffer[failIndex + 1];

        if (indexLetter === undefined || (nextLetter === undefined && failIndex < bufferLength - 1)) {
            lettersBuffer[failIndex] = currentLetter;
            return;
        }


        lettersBuffer[failIndex] = nextLetter;
    }


    lettersBuffer[bufferLength - 1] = currentLetter;
}