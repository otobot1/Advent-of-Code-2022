import fs from "fs";




export const writeOutputToFile = (outputFilePath: string, outputString: string, maxFileIndex = 10, fileIndex = 0): void => {
    try {
        if (outputFilePath.endsWith(".txt")) outputFilePath = outputFilePath.slice(0, outputFilePath.length - ".txt".length);


        let alteredPath = `${outputFilePath}.txt`;


        if (fileIndex) alteredPath = `${outputFilePath}${fileIndex}.txt`;


        fs.writeFileSync(alteredPath, outputString, { flag: "wx" });
    }
    catch (error) {
        if (fileIndex < maxFileIndex) {
            fileIndex++;

            writeOutputToFile(outputFilePath, outputString, maxFileIndex, fileIndex);
        }
        else throw "maxFileIndex reached";
    }
}




export const outputMatrixToFile = (outputFilePath: string, outputMatrix: unknown[][], maxFileIndex = 10, fileIndex = 0): void => {
    const outputStringArray: string[] = [];


    for (const row of outputMatrix) {
        const rowStringArray: string[] = [];


        for (const cell of row) rowStringArray.push(String(cell));


        outputStringArray.push(rowStringArray.join(""));
    }


    const outputString = outputStringArray.join("\r\n");


    writeOutputToFile(outputFilePath, outputString, maxFileIndex, fileIndex);
}




type IntervalObject = {
    days?: number;
    hours?: number;
    minutes?: number;
    seconds: number;
}


export const getIntervalObject = (milliseconds: number): IntervalObject => {
    const millisecondsPerSecond = 1000;
    const millisecondsPerMinute = millisecondsPerSecond * 60;
    const millisecondsPerHour = millisecondsPerMinute * 60;
    const millisecondsPerDay = millisecondsPerHour * 24;


    let remainder = milliseconds;

    const days = Math.floor(remainder / millisecondsPerDay);
    remainder = remainder % millisecondsPerDay;

    const hours = Math.floor(remainder / millisecondsPerHour);
    remainder = remainder % millisecondsPerHour;

    const minutes = Math.floor(remainder / millisecondsPerMinute);
    remainder = remainder % millisecondsPerMinute;

    const seconds = Math.round(remainder / millisecondsPerSecond);


    const intervalObject: IntervalObject = {
        days: days || undefined,
        hours: (days || hours) ? hours : undefined,
        minutes: (days || hours || minutes) ? minutes : undefined,
        seconds: seconds,
    }


    return intervalObject;
}




export const printProgress = (currentCount: number, totalCount: number, startTime: number): void => {
    const fractionalCompletion = currentCount / totalCount;
    const percentCompletion = Math.round(fractionalCompletion * 100);


    const currentTime = (new Date).getTime();

    const intervalMilliseconds = currentTime - startTime;

    const estimatedFinalIntervalTime = intervalMilliseconds / currentCount * totalCount;

    const estimatedMillisecondsToCompletion = estimatedFinalIntervalTime - intervalMilliseconds;


    const intervalObject = getIntervalObject(estimatedMillisecondsToCompletion);

    let intervalString = (intervalObject.days ? `${intervalObject.days}d` : "");
    intervalString += (intervalObject.hours || intervalObject.days ? `${intervalObject.hours}:` : "");
    intervalString += (intervalObject.minutes || intervalObject.hours || intervalObject.days ? `${intervalObject.minutes}:` : "");
    intervalString += `${intervalObject.seconds}${intervalObject.minutes ? "." : "s."}`;


    console.log(`${currentCount}/${totalCount} - ${percentCompletion}%. Estimated time to completion: ${intervalString}`);
}