import fs from "fs";




type Node = {
    height: number;
    checked: boolean;
    distance: number;
    rowIndex: number;
    columnIndex: number;
}


type subQueue = {
    distance: number,
    nodes: Node[],
}


type GridInfo = {
    endingNode: Node;
    grid: Node[][];
    queue: subQueue[];
}




export const main = () => {
    puzzle2();
}




const puzzle1 = () => {
    const inputPath = `${process.env.PROJECT_ROOT}/src/day12/input.txt`;
    if (!inputPath) throw "Invalid inputPath";


    const fileContents = fs.readFileSync(inputPath, "utf8");


    const stringArray = fileContents.split(/\r?\n/);


    const gridInfo = getGridInfo(stringArray, false);


    traverseNodes(gridInfo, false);


    const shortestPathLength = gridInfo.endingNode.distance;


    console.log(shortestPathLength);
}




const puzzle2 = () => {
    const inputPath = `${process.env.PROJECT_ROOT}/src/day12/test-input.txt`;
    if (!inputPath) throw "Invalid inputPath";


    const fileContents = fs.readFileSync(inputPath, "utf8");


    const stringArray = fileContents.split(/\r?\n/);


    const gridInfo = getGridInfo(stringArray, true);


    traverseNodes(gridInfo, true);


    const shortestPathLength = getNearestLowPointDistance(gridInfo);


    console.log(shortestPathLength);
}




const getGridInfo = (stringArray: string[], mode: boolean): GridInfo => {
    const rowCount = stringArray.length;
    const columnCount = stringArray[0].length;

    const grid: Node[][] = [];
    let startingNode: Node | undefined;
    let endingNode: Node | undefined;


    for (let rowIndex = 0; rowIndex < rowCount; rowIndex++) {
        const chars = stringArray[rowIndex].split("");
        const rowNodes: Node[] = [];


        for (let columnIndex = 0; columnIndex < columnCount; columnIndex++) {
            const column = chars[columnIndex];
            const node: Node = {
                height: -1,
                checked: false,
                distance: Infinity,
                rowIndex: rowIndex,
                columnIndex: columnIndex,
            };


            if (column === "S") {
                node.height = "a".charCodeAt(0);
                node.distance = 0;
                startingNode = node;
            }
            else if (column === "E") {
                node.height = "z".charCodeAt(0);
                endingNode = node;
            }
            else {
                node.height = column.charCodeAt(0);
            }


            rowNodes.push(node);
        }


        grid.push(rowNodes);
    }


    if (!startingNode || !endingNode) throw "Undefined starting or ending node.";


    const initialNode = mode ? endingNode : startingNode;

    const subQueue: subQueue = {
        distance: 0,
        nodes: [initialNode],
    }


    const gridInfo: GridInfo = {
        endingNode: endingNode,
        grid: grid,
        queue: [subQueue],
    };


    return gridInfo;
}




const traverseNodes = (gridInfo: GridInfo, mode: boolean): void => {
    const queue = gridInfo.queue;
    const endingNode = gridInfo.endingNode;


    let success = false;
    let subQueue = queue[0];
    let i = 0;

    outerLoop: for (; i < 99999; i++) {
        while (!subQueue.nodes.length) {
            queue.shift();

            if (!queue.length) break outerLoop;

            subQueue = queue[0];
        }


        const currentNode = subQueue.nodes.shift()!;      //guaranteed to be defined. can't exit while loop while subqueue is empty.


        // const breakpoint = (
        //     (currentNode.rowIndex >= endingNode.rowIndex - 1 && currentNode.rowIndex <= endingNode.rowIndex + 1 && currentNode.columnIndex === endingNode.columnIndex) ||
        //     (currentNode.columnIndex >= endingNode.columnIndex - 1 && currentNode.columnIndex <= endingNode.columnIndex + 1 && currentNode.rowIndex === endingNode.rowIndex)
        // );

        if (!currentNode.checked) {
            if (mode) {
                checkNode2(gridInfo, currentNode);
            }
            else {
                checkNode1(gridInfo, currentNode);


                if (currentNode === endingNode) {
                    success = true;
                    break;
                }
            }
        }
    }


    if (!mode && !success) console.log("Failure.");
}




const checkNode1 = (gridInfo: GridInfo, currentNode: Node): void => {
    const grid = gridInfo.grid;

    const currentNodeHeight = currentNode.height;
    const newTentativeDistance = currentNode.distance + 1;
    const neighbours = getNeighbours(grid, currentNode);


    for (const neighbour of neighbours) {
        const neighbourHeight = neighbour.height;
        const neighbourDistance = neighbour.distance;


        if (neighbourHeight <= currentNodeHeight + 1) {
            if (newTentativeDistance >= neighbourDistance) continue;

            neighbour.distance = newTentativeDistance;

            placeInQueue(gridInfo, neighbour);
        }
    }


    currentNode.checked = true;
}




const checkNode2 = (gridInfo: GridInfo, currentNode: Node): void => {
    const grid = gridInfo.grid;

    const currentNodeHeight = currentNode.height;
    const newTentativeDistance = currentNode.distance + 1;
    const neighbours = getNeighbours(grid, currentNode);


    for (const neighbour of neighbours) {
        const neighbourHeight = neighbour.height;
        const neighbourDistance = neighbour.distance;


        if (neighbourHeight <= currentNodeHeight + 1) {
            if (newTentativeDistance >= neighbourDistance) continue;

            neighbour.distance = newTentativeDistance;

            placeInQueue(gridInfo, neighbour);
        }
    }


    currentNode.checked = true;
}




const getNeighbours = (grid: Node[][], currentNode: Node): Node[] => {
    const rowIndex = currentNode.rowIndex;
    const columnIndex = currentNode.columnIndex;

    const neighbourCoordinates: [number, number][] = [[columnIndex + 1, rowIndex], [columnIndex - 1, rowIndex], [columnIndex, rowIndex + 1], [columnIndex, rowIndex - 1]];


    const neighbours: Node[] = [];

    neighbourCoordinates.forEach(([column, row]) => {
        const neighbourRow = grid[row];

        if (!neighbourRow) return;


        const neighbour = neighbourRow[column];

        if (neighbour && !neighbour.checked) neighbours.push(neighbour);
    });


    return neighbours;
}




const placeInQueue = (gridInfo: GridInfo, node: Node): void => {
    const queue = gridInfo.queue;
    const queueLength = queue.length;
    const nodeDistance = node.distance;


    const newSubQueue: subQueue = {
        distance: nodeDistance,
        nodes: [node],
    }

    if (!queueLength) {

        queue.push(newSubQueue);

        return;
    }


    for (let index = 0; index < queueLength; index++) {
        const subQueue = queue[index];
        const nodes = subQueue.nodes;

        if (!nodes.length) continue;


        const distance = subQueue.distance;


        if (distance === nodeDistance) {
            nodes.push(node);
            return;
        };

        if (distance < nodeDistance) continue;

        //arrayDistance > nodeDistance
        queue.splice(index, 0, newSubQueue);
        return;
    }


    //nodeDistance is greater than any extant subQueue.distance
    queue.push(newSubQueue);
}




const getNearestLowPointDistance = (gridInfo: GridInfo): number => {
    const grid = gridInfo.grid;
    const lowPointHeight = "a".charCodeAt(0);

    let shortestPathLength = 999999;


    for (const row of grid) {
        for (const node of row) {
            if (node.height !== lowPointHeight) continue;

            
            const distance = node.distance;

            if (distance < shortestPathLength) shortestPathLength = distance;
        }
    }


    return shortestPathLength;
}