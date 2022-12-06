import fs from "fs";




const moves = ["rock", "paper", "scissors"] as const;
type Moves = typeof moves[number];

const opponentLetters = ["A", "B", "C"] as const;
type OpponentLetters = typeof opponentLetters[number];

const myLetters = ["X", "Y", "Z"] as const;
type MyLetters = typeof myLetters[number];

const results = ["win", "draw", "loss"] as const;
type Results = typeof results[number];

type MyResults = {
    [key in typeof myLetters[number]]: Results;
}
const myResults: MyResults = {
    X: "loss",
    Y: "draw",
    Z: "win",
} as const;


type Points_Moves = {
    [key in typeof moves[number]]: number;
}
type Points_Results = {
    [key in typeof results[number]]: number;
}
const points: Points_Moves & Points_Results = {
    rock: 1,
    paper: 2,
    scissors: 3,
    win: 6,
    draw: 3,
    loss: 0,
} as const;


/*
{
    opponent's move: {
        my move: result
    }
}
*/
type ResultsMatrix = {
    [key in typeof moves[number]]: {
        [key in typeof moves[number]]: Results;
    };
}
const resultsMatrix: ResultsMatrix = {
    rock: {
        rock: "draw",
        paper: "win",
        scissors: "loss",
    },
    paper: {
        rock: "loss",
        paper: "draw",
        scissors: "win",
    },
    scissors: {
        rock: "win",
        paper: "loss",
        scissors: "draw",
    },
} as const;




export const main = () => {
    puzzle2();
}




const puzzle1 = () => {
    const inputPath = `${process.env.PROJECT_ROOT}/src/day2/input.txt`;
    if (!inputPath) throw "Invalid inputPath";


    const fileContents = fs.readFileSync(inputPath, "utf8");


    const stringArray = fileContents.split(/\r?\n/);


    let totalScore = 0;

    for (const row of stringArray) {
        const opponentChar = row.charAt(0) as OpponentLetters;
        const myChar = row.charAt(2) as MyLetters;


        const opponentMove = moves[opponentLetters.indexOf(opponentChar)];
        if (!opponentMove) throw "opponentMove is undefined";

        const myMove = moves[myLetters.indexOf(myChar)];
        if (!myMove) throw "myMove is undefined";


        const result = resultsMatrix[opponentMove][myMove];


        const score = points[myMove] + points[result];


        totalScore += score;
    }


    console.log(totalScore);
}




const puzzle2 = () => {
    const inputPath = `${process.env.PROJECT_ROOT}/src/day2/input.txt`;
    if (!inputPath) throw "Invalid inputPath";


    const fileContents = fs.readFileSync(inputPath, "utf8");


    const stringArray = fileContents.split(/\r?\n/);


    let totalScore = 0;

    for (const row of stringArray) {
        const opponentChar = row.charAt(0) as OpponentLetters;
        const myChar = row.charAt(2) as MyLetters;


        const opponentMove = moves[opponentLetters.indexOf(opponentChar)];
        if (!opponentMove) throw "opponentMove is undefined";

        const intendedResult = myResults[myChar];


        let myMove: Moves | undefined = undefined;
        
        for (const [move, result] of Object.entries(resultsMatrix[opponentMove])) {
            if (result === intendedResult) {
                myMove = move as Moves;
                break;
            }
        }

        if (!myMove) throw "myMove is undefined";


        const score = points[myMove] + points[intendedResult];


        totalScore += score;
    }


    console.log(totalScore);
}