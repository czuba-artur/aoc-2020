const { readFileSync } = require('fs');

const ROWS_COUNT = 127;
const COLUMNS_COUNT = 7;

function resolveSeatId(row, column) {
    return (row * (COLUMNS_COUNT + 1)) + column;
}

function resolveSeatColumnAndRow(input) {
    const coordinates = input.split('');

    let lastRowIndex = 0;
    let lastColumnIndex = 0;
    let currentRowsHalf = [0, ROWS_COUNT];
    let currentColumnHalf = [0, COLUMNS_COUNT];

    coordinates.forEach((letter, index) => {
        let difference;
        let newValue;

        switch (letter) {
            case 'F':
                difference = currentRowsHalf[1] - currentRowsHalf[0];
                newValue = currentRowsHalf[1] - Math.round(difference / 2);
                currentRowsHalf = [currentRowsHalf[0], newValue];
                lastRowIndex = index;
                return;
            case 'B':
                difference = currentRowsHalf[1] - currentRowsHalf[0];
                newValue = currentRowsHalf[0] + Math.round(difference / 2);
                currentRowsHalf = [newValue, currentRowsHalf[1]];
                lastRowIndex = index;
                return;
            case 'L':
                difference = currentColumnHalf[1] - currentColumnHalf[0];
                newValue = currentColumnHalf[1] - Math.round(difference / 2);
                currentColumnHalf = [currentColumnHalf[0], newValue];
                lastColumnIndex = index;
                return;
            case 'R':
                difference = currentColumnHalf[1] - currentColumnHalf[0];
                newValue = currentColumnHalf[0] + Math.round(difference / 2);
                currentColumnHalf = [newValue, currentColumnHalf[1]];
                lastColumnIndex = index;
                return;
        }

        throw Error(`Unsupported ${letter}`);
    });

    return {
        row: currentRowsHalf[coordinates[lastRowIndex] === 'F' ? 0 : 1],
        column: currentColumnHalf[coordinates[lastColumnIndex] === 'L' ? 0 : 1],
    }
}

const tasks = [
    {
        fileName: './Input/Day5/Example1.txt',
    },
    {
        fileName: './Input/Day5/Input.txt',
        highestOnly: true,
    },
    {
        fileName: './Input/Day5/Input.txt',
        findEmpty: true,
    },
];

tasks.forEach((task, index) => {
    const seats = readFileSync(task.fileName)
        .toString()
        .toUpperCase()
        .split('\n');

    let answer = seats.map(seat => resolveSeatColumnAndRow(seat));

    if (task.highestOnly) {
        answer = answer.map(({row, column}) => resolveSeatId(row, column)).sort((a, b) => a - b).pop();
    } else if (task.findEmpty) {
        const sortedRows = answer.map(({row}) => row).sort((a, b) => a - b);
        const hightestRow = Math.max(...sortedRows);
        const lowestRow = Math.min(...sortedRows);
        const filteredRows = answer.filter(({row}) => row !== lowestRow && row !== hightestRow);
        const seatIds = filteredRows
            .map(({row, column}) => resolveSeatId(row, column))
            .sort((a, b) => a - b);

        const missingSeatIds = seatIds
            .filter((id, index) => seatIds[index + 1] !== id + 1 && index + 1 < seatIds.length)
            .map(id => id + 1);

        answer = missingSeatIds.join();
    } else {
        answer = answer.map(({row, column}) => resolveSeatId(row, column)).join();
    }

    console.log(`Answer for task ${index + 1} ${task.fileName}: ${answer}`);
});
