const { readFileSync } = require('fs');

function countAnswers(input) {
    const splitted = input.split('\n');
    const peopleCount = splitted.length;
    const answers = splitted.join('').split('');
    const uniqueAnswers = [...new Set(answers)];
    const answersMap = new Map();

    answers.forEach(answer => {
        const currentValue = answersMap.has(answer) ? answersMap.get(answer) : 0;
        answersMap.set(answer, currentValue + 1);
    });

    return {
        answers: uniqueAnswers,
        peopleCount,
        answersMap,
    }
}

const tasks = [
    {
        fileName: './Input/Day6/Example1.txt',
    },
    {
        fileName: './Input/Day6/Input.txt',
    },
    {
        fileName: './Input/Day6/Example1.txt',
        countGroups: true,
    },
    {
        fileName: './Input/Day6/Input.txt',
        countGroups: true,
    },
];

tasks.forEach((task, index) => {
    const input = readFileSync(task.fileName).toString().split('\n\n');
    const result = input.map(value => countAnswers(value));

    let answer = '';
    if (task.countGroups) {
        answer = 0;
        result.forEach(({peopleCount, answersMap}) => {
            Array.from(answersMap.values()).forEach(value => {
                if (value === peopleCount) {
                    answer++;
                }
            });
        });
    } else {
        answer = result.reduce((prev, curr) => prev + curr.answers.length, 0);
    }

    console.log(`Answer for task ${index + 1} ${task.fileName}: ${answer}`);
});
