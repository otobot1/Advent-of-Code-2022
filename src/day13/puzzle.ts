import fs from "fs";




type Packet = (number | Packet)[];

type Pair = [Packet, Packet];

type Valid = boolean | null;




const dividerPacket1 = [[2]];
const dividerPacket2 = [[6]];




export const main = () => {
    puzzle2();
}




const puzzle1 = () => {
    const inputPath = `${process.env.PROJECT_ROOT}/src/day13/input.txt`;
    if (!inputPath) throw "Invalid inputPath";


    const fileContents = fs.readFileSync(inputPath, "utf8");


    const stringArray = fileContents.split(/\r?\n/);


    const pairs = getPairs(stringArray);


    const indices = getValidIndices(pairs);


    const sum = getIndicesSum(indices);


    console.log(sum);
}




const puzzle2 = () => {
    const inputPath = `${process.env.PROJECT_ROOT}/src/day13/input.txt`;
    if (!inputPath) throw "Invalid inputPath";


    const fileContents = fs.readFileSync(inputPath, "utf8");


    const stringArray = fileContents.split(/\r?\n/);


    const sortedPackets = getSortedPackets(stringArray);


    const decoderKey = getDecoderKey(sortedPackets);


    console.log(decoderKey);
}




const getPairs = (stringArray: string[]): Pair[] => {
    const pairs: Pair[] = [];


    for (let index = 0; index < stringArray.length; index += 3) {
        const firstPacket = JSON.parse(stringArray[index]);
        const secondPacket = JSON.parse(stringArray[index + 1]);
        const emptyLine = stringArray[index + 2];


        if (!Array.isArray(firstPacket)) throw "Invalid firstPacket.";
        if (!Array.isArray(secondPacket)) throw "Invalid secondPacket.";
        if (emptyLine) throw "Invalid emptyLine.";


        pairs.push([firstPacket, secondPacket]);
    }


    return pairs;
}




const getValidIndices = (pairs: Pair[]): number[] => {      //returns 0-indexed indices
    const validIndices: number[] = [];


    for (let index = 0; index < pairs.length; index++) {
        const pair = pairs[index];

        const valid = checkPair(pair[0], pair[1]);

        if (valid) validIndices.push(index);
    }


    return validIndices;
}




const checkPair = (packetOne: number | Packet, packetTwo: number | Packet): Valid => {
    //handle 2 nums
    if (typeof packetOne === "number" && typeof packetTwo === "number") {
        if (packetOne < packetTwo) return true;
        if (packetOne === packetTwo) return null;
        return false;   //packetOne > packetTwo
    }


    //handle array cases
    if (typeof packetOne === "number") packetOne = [packetOne];
    if (typeof packetTwo === "number") packetTwo = [packetTwo];


    let valid: Valid = null;

    for (let index = 0; index < packetOne.length || index < packetTwo.length; index++) {
        const item1 = packetOne[index];
        const item2 = packetTwo[index];


        if (item1 === undefined && item2 === undefined) return null;
        if (item1 === undefined) return true;
        if (item2 === undefined) return false;


        valid = checkPair(item1, item2);

        if (valid !== null) return valid;
    }


    return valid;
}




const getSortedPackets = (stringArray: string[]): Packet[] => {
    const sortedPackets: Packet[] = [dividerPacket1, dividerPacket2];


    for (const string of stringArray) {
        if (!string) continue;

        const packet: Packet = JSON.parse(string);

        sortPacket(sortedPackets, packet);
    }


    return sortedPackets;
}




const sortPacket = (sortedPackets: Packet[], newPacket: Packet): void => {
    for (let index = 0; index <= sortedPackets.length; index++) {
        const oldPacket = sortedPackets[index];


        if (oldPacket === undefined) {
            sortedPackets.push(newPacket)
            return;
        }


        const isCorrectIndex = checkPair(newPacket, oldPacket);

        if (isCorrectIndex) {
            sortedPackets.splice(index, 0, newPacket);
            return;
        }
    }


    throw "Unable to sort packet.";
}




const getIndicesSum = (indices: number[]): number => {      //takes 0-indexed indices, returns sum of 1-indexed indices
    let sum = 0;


    for (const zeroIndex of indices) {
        sum += zeroIndex + 1;
    }


    return sum;
}




const getDecoderKey = (sortedPackets: Packet[]): number => {
    let index1 = -1;
    let index2 = -1;


    for (let index = 0; index < sortedPackets.length; index++) {
        const packet = sortedPackets[index];


        if (packet === dividerPacket1) index1 = index + 1;
        else if (packet === dividerPacket2) index2 = index + 1;


        if (index1 !== -1 && index2 !== -1) break;
    }


    if (index1 === -1 || index2 === -1) throw "Invalid index.";


    return index1 * index2;
}