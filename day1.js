const { readFileSync } = require('fs');

function findSumOfTwo(input, expectedValue) {
    for (let firstNumber of input) {
        for (let secondNumber of input) {
            if (firstNumber + secondNumber === expectedValue) {
                return [firstNumber, secondNumber];
            }
        }
    }

    return undefined;
}

function findSumOfThree(input, expectedValue) {
    for (let firstNumber of input) {
        for (let secondNumber of input) {
            for (let thirdNumber of input) {
                if (firstNumber + secondNumber + thirdNumber === expectedValue) {
                    return [firstNumber, secondNumber, thirdNumber];
                }
            }
        }
    }
}

const tasks = [
    {
        fileName: './Input/Day1/Example1.txt',
        strategy: 'two',
        expectedValue: 2020,
    },
    {
        fileName: './Input/Day1/Input.txt',
        strategy: 'two',
        expectedValue: 2020,
    },
    {
        fileName: './Input/Day1/Example1.txt',
        strategy: 'three',
        expectedValue: 2020,
    },
    {
        fileName: './Input/Day1/Input.txt',
        strategy: 'three',
        expectedValue: 2020,
    }
];

tasks.forEach(task => {
    const resolver = task.strategy === 'two' ? findSumOfTwo : findSumOfThree;

    const matchingNumbers = resolver(
        readFileSync(task.fileName)
            .toString()
            .split('\n')
            .map(value => parseFloat(value))
            .filter(value => !Object.is(value, NaN)),
        task.expectedValue,
        task.requiredNumbers,
    );
    if (!matchingNumbers) {
        console.log(`No matching numbers found for file ${task.fileName}`);
        return;
    }

    const answer = matchingNumbers.reduce((prev, curr) => prev * curr, 1);

    console.log(`Answer for file ${task.fileName}: ${matchingNumbers.join(' * ')} = ${answer}`);
});

