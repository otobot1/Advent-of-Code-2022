import fs from "fs";




type Operations = "+" | "-" | "*" | "/";
type OperationAmount = number | "old";

type Monkey = {
    items: number[];
    operation: Operations;
    operationAmount: OperationAmount;
    testDivisor: number;
    successMonkey: number;
    failMonkey: number;
    inspectionCount: number;
}




export const main = () => {
    puzzle2();
}




const puzzle1 = () => {
    const inputPath = `${process.env.PROJECT_ROOT}/src/day11/input.txt`;
    if (!inputPath) throw "Invalid inputPath";


    const fileContents = fs.readFileSync(inputPath, "utf8");


    const stringArray = fileContents.split(/\r?\n/);


    const items: number[] = [];
    const monkeys = getMonkeys(stringArray, items);


    executeRounds(monkeys, items, 20, true);


    const monkeyBusiness = getMonkeyBusiness(monkeys);


    console.log(monkeyBusiness);
}




const puzzle2 = () => {
    const inputPath = `${process.env.PROJECT_ROOT}/src/day11/input.txt`;
    if (!inputPath) throw "Invalid inputPath";


    const fileContents = fs.readFileSync(inputPath, "utf8");


    const stringArray = fileContents.split(/\r?\n/);


    const items: number[] = [];
    const monkeys = getMonkeys(stringArray, items);


    executeRounds(monkeys, items, 10000, false);


    const monkeyBusiness = getMonkeyBusiness(monkeys);


    console.log(monkeyBusiness);
}




const getMonkeys = (stringArray: string[], items: number[]): Monkey[] => {
    const monkeys: Monkey[] = [];
    let monkeyIndex = 0;


    for (let stringIndex = 0; stringIndex < stringArray.length; stringIndex += 7) {
        const monkey: Monkey = {
            items: [],
            operation: "+",
            operationAmount: 0,
            testDivisor: 0,
            successMonkey: 0,
            failMonkey: 0,
            inspectionCount: 0,
        };


        const string1 = stringArray[stringIndex];
        const monkeyNum = Number(string1.slice("Monkey ".length, string1.length - 1));
        if (isNaN(monkeyNum) || monkeyNum !== monkeyIndex) throw "Invalid monkeyNum.";


        const string2 = stringArray[stringIndex + 1].slice("  Starting items: ".length);
        const startingItems = string2.split(", ").map(getNum);
        const existingItemsCount = items.length;
        const newItemsCount = startingItems.length;

        items.push(...startingItems);

        for (let index = existingItemsCount; index < existingItemsCount + newItemsCount; index++) monkey.items.push(index);


        const subString = stringArray[stringIndex + 2].slice("  Operation: new = old ".length);

        const operation = subString.charAt(0);
        if (!isOperation(operation)) throw "Invalid operation.";
        monkey.operation = operation;

        const amountString = subString.slice(2);
        let amount: OperationAmount;
        if (amountString === "old") amount = "old";
        else {
            amount = Number(amountString)
            if (isNaN(amount)) throw "amount is NaN.";
        }
        monkey.operationAmount = amount;


        const divisor = Number(stringArray[stringIndex + 3].slice("  Test: divisible by ".length));
        if (isNaN(divisor)) throw "divisor is NaN.";
        monkey.testDivisor = divisor;


        const successNum = Number(stringArray[stringIndex + 4].slice("    If true: throw to monkey ".length));
        if (isNaN(successNum)) throw "successNum is NaN.";
        monkey.successMonkey = successNum;


        const failNum = Number(stringArray[stringIndex + 5].slice("    If false: throw to monkey ".length));
        if (isNaN(failNum)) throw "failNum is NaN.";
        monkey.failMonkey = failNum;


        if (stringArray[stringIndex + 6]) throw "Expecting empty line.";


        monkeys.push(monkey);
        monkeyIndex++;
    }


    return monkeys;
}




const executeRounds = (monkeys: Monkey[], items: number[], roundCount: number, decreaseWorry: boolean): void => {
    const divisorsProduct = getDivisorsProduct(monkeys);


    for (let round = 1; round <= roundCount; round++) {
        for (const monkey of monkeys) {
            for (const itemIndex of monkey.items) {
                let worryLevel = items[itemIndex];


                const operation = monkey.operation;
                const operationAmount = monkey.operationAmount === "old" ? worryLevel : monkey.operationAmount;
                
                if (operation === "+") worryLevel += operationAmount;
                else if (operation === "-") worryLevel -= operationAmount;
                else if (operation === "*") worryLevel *= operationAmount;
                else if (operation === "/") worryLevel /= operationAmount;
                else throw "Invalid operation.";


                if (decreaseWorry) worryLevel = Math.floor(worryLevel / 3);
                else worryLevel = worryLevel % divisorsProduct;


                items[itemIndex] = worryLevel;


                const testResult = worryLevel % monkey.testDivisor === 0 ? true : false;

                if (testResult) monkeys[monkey.successMonkey].items.push(itemIndex);
                else monkeys[monkey.failMonkey].items.push(itemIndex);


                monkey.inspectionCount++;
            }


            monkey.items = [];
        }
    }
}




const getMonkeyBusiness = (monkeys: Monkey[]): number => {
    let maxMonkey = 0;
    let secondMonkey = 0;


    for (const monkey of monkeys) {
        const count = monkey.inspectionCount;

        if (count > maxMonkey) {
            secondMonkey = maxMonkey;
            maxMonkey = count;
        }
        else if (count > secondMonkey) secondMonkey = count;
    }


    const monkeyBusiness = maxMonkey * secondMonkey;


    return monkeyBusiness;
}




const getDivisorsProduct = (monkeys: Monkey[]): number => {
    let product = 1;

    for (const monkey of monkeys) {
        product *= monkey.testDivisor;
    }

    return product;
}




const getNum = (numString: string): number => {
    const num = Number(numString);

    if (isNaN(num)) throw "num is NaN.";

    return num;
}




const isOperation = (operation: string): operation is Operations => {
    if (operation === "+" || operation === "-" || operation === "*" || operation === "/") return true;

    return false;
}