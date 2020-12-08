const { readFileSync } = require('fs');

function processInstructions(instructions, switchInstructions) {
    let acc = 0;
    let instructionIndex = 0;
    const visitedIndexes = [];

    do {
        let [instruction, value] = instructions[instructionIndex].split(' ');
        const parsedValue = parseInt(value, 10);

        if (instruction === 'jmp' && switchInstructions) {
            instruction = 'nop';
        } else if (instruction === 'nop' && switchInstructions) {
            instruction = 'jmp';
        }

        visitedIndexes.push(instructionIndex);
        switch (instruction) {
            case 'acc':
                acc += parsedValue;
                instructionIndex++;
                break;
            case 'jmp':
                instructionIndex += parsedValue;
                break;
            case 'nop':
                instructionIndex++;
                break;
        }
    } while (!visitedIndexes.includes(instructionIndex) && instructionIndex < instructions.length);

    return acc;
}

const tasks = [
    {
        fileName: './Input/Day8/Example1.txt',
    },
    {
        fileName: './Input/Day8/Input.txt',
    },
    {
        fileName: './Input/Day7/Input.txt',
        switchInstructions: true,
    },
];

tasks.forEach((task, index) => {
    const input = readFileSync(task.fileName)
        .toString()
        .split('\n');

    let answer = processInstructions(input, task.switchInstructions);
    console.log(`Answer for task ${index + 1} ${task.fileName}: ${answer}`);
});
