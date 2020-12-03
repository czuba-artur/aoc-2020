const {readFileSync} = require('fs');

const TREE_SYMBOL = '#';

function countTrees(map, velocity, startPosition) {
    let foundTrees = 0;

    let x = startPosition.x;
    let y = startPosition.y;

    do {
        if (map[ y ][ x ] === TREE_SYMBOL) {
            foundTrees++;
        }

        x = (x + velocity.x) % map[ 0 ].length;
        y += velocity.y;

        if (x > map[ 0 ].length) {
            console.log(x + 1, y + 1);
        }
    } while (y < map.length);

    return foundTrees;
}

const tasks = [
    {
        fileName: './Input/Day3/Example1.txt',
        velocities: [ {
            x: 3,
            y: 1,
        } ],
        startPosition: {
            x: 0,
            y: 0,
        }
    },
    {
        fileName: './Input/Day3/Input.txt',
        velocities: [ {
            x: 3,
            y: 1,
        } ],
        startPosition: {
            x: 0,
            y: 0,
        }
    },
    {
        fileName: './Input/Day3/Example1.txt',
        velocities: [
            {
                x: 1,
                y: 1,
            },
            {
                x: 3,
                y: 1,
            },
            {
                x: 5,
                y: 1,
            },
            {
                x: 7,
                y: 1,
            },
            {
                x: 1,
                y: 2,
            },
        ],
        startPosition: {
            x: 0,
            y: 0,
        }
    },
    {
        fileName: './Input/Day3/Input.txt',
        velocities: [
            {
                x: 1,
                y: 1,
            },
            {
                x: 3,
                y: 1,
            },
            {
                x: 5,
                y: 1,
            },
            {
                x: 7,
                y: 1,
            },
            {
                x: 1,
                y: 2,
            },
        ],
        startPosition: {
            x: 0,
            y: 0,
        }
    },
];

tasks.forEach(task => {
    const map = readFileSync(task.fileName).toString().split('\n');
    const answer = task.velocities.map(velocity => countTrees(map, velocity, task.startPosition)).reduce((prev, curr) => prev * curr, 1);
    console.log(`Answer for ${task.fileName}: ${answer}`);
})