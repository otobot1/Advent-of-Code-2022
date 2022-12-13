import fs from "fs";




export const main = () => {
    puzzle1And2();
}




const puzzle1And2 = () => {
    const inputPath = `${process.env.PROJECT_ROOT}/src/day01/input.txt`;
    if (!inputPath) throw "Invalid inputPath";


    const fileContents = fs.readFileSync(inputPath, "utf8");


    const stringArray = fileContents.split(/\r?\n/);


    let highestSum = 0;
    let secondSum = 0;
    let thirdSum = 0;

    for (let i = 0; i < stringArray.length; i++) {
        let currentSum = 0;

        for (; i < stringArray.length; i++) {
            const string = stringArray[i];

            if (string === "") break;


            const num = Number(string);

            if (isNaN(num)) throw `"${string}" is NaN`;


            currentSum += num;
        }


        if (currentSum > highestSum) {
            thirdSum = secondSum;
            secondSum = highestSum;
            highestSum = currentSum;
        }
        else if (currentSum > secondSum) {
            thirdSum = secondSum;
            secondSum = currentSum;
        }
        else if (currentSum > thirdSum) {
            thirdSum = currentSum;
        }
    }


    const sumOfSums = highestSum + secondSum + thirdSum;


    console.log(`highestSum = ${highestSum}\nsecondSum = ${secondSum}\nthirdSum = ${thirdSum}\nsumOfSums = ${sumOfSums}`);
}