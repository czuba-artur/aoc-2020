const { count } = require('console');
const { readFileSync } = require('fs');

function buildRules(input) {
    const rules = [];

    input.forEach(rule => {
        const [bagName, includes] = rule.split('bags contain');
        const parsedInsideBags = includes.split(',').map(value => value.replace('.', '').trim());

        let insideBags = [];
        if (includes !== ' no other bags.') {
            parsedInsideBags.forEach(value => {
                const whitespaceIndex = value.indexOf(' ');
                const count = parseInt(value.substr(0, whitespaceIndex), 10);
                const name = value.substr(whitespaceIndex, value.lastIndexOf(' ')).trim();

                insideBags.push({
                    name,
                    count,
                });
            });
        }

        rules.push({
            name: bagName.trim(),
            insideBags,
        });
    });

    return rules;
}

function buildRulesTree(rules) {
    function getTreeFor(name) {
        const tree = [];
        const entry = rules.find(value => value.name === name);
        if (!entry) {
            throw Error(`Invalid entry ${name}`);
        }

        if (entry.insideBags.length === 0) {
            return tree;
        }

        entry.insideBags.forEach(bag => {
            tree.push({
                name: bag.name,
                count: bag.count,
                children: getTreeFor(bag.name),
            });
        });

        return tree;
    }

    const tree = [];
    rules.forEach(rule => {
        tree.push({
            name: rule.name,
            count: 1,
            children: getTreeFor(rule.name),
        });
    });

    return tree;
}

function findInTree(tree, value) {
    let sum = 0;
    if (tree.children.length === 0) {
        return sum;
    }

    if (tree.children.find(child => child.name === value)) {
        sum++;
    }

    sum += tree.children.filter(childNode => findInTree(childNode, value)).length;

    return sum;
}

function countChildren(bag) {
    return bag.children.reduce((prev, curr) => prev + curr.count * countChildren(curr), 1);
}

const tasks = [
    {
        fileName: './Input/Day7/Example1.txt',
    },
    {
        fileName: './Input/Day7/Input.txt',
    },
    {
        fileName: './Input/Day7/Input.txt',
        countBags: true,
    },
];

tasks.forEach((task, index) => {
    const input = readFileSync(task.fileName).toString().split('\n');
    const rules = buildRules(input);
    const rulesTree = {
        name: 'root',
        children: buildRulesTree(rules)
    };

    let answer = '';
    if (task.countBags) {
        answer = countChildren(rulesTree.children.find(val => val.name === 'shiny gold')) - 1;
    } else {
        answer = findInTree(rulesTree, 'shiny gold') - 1;
    }


    console.log(`Answer for task ${index + 1} ${task.fileName}: ${answer}`);
});
