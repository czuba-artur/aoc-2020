const { readFileSync } = require('fs');

function parsePolicyString(input) {
    const policyString = input.split(':').shift();
    if (!policyString) {
        throw Error('Invalid policy string');
    }
    const [range, requiredLetter] = policyString.split(' ');
    if (!range || !requiredLetter) {
        throw Error('Invalid policy string');
    }

    const [left, right] = range.split('-');
    if (!left || !right) {
        throw Error('Invalid policy string');
    }

    const parsedLeft = parseInt(left, 10);
    const parsedRight = parseInt(right, 10);

    if (Object.is(parsedLeft, NaN) || Object.is(parsedRight, NaN)) {
        throw Error('Invalid policy string');
    }

    return {
        left: parsedLeft,
        right: parsedRight,
        letter: requiredLetter
    }
}

function simplePolicyBuilder(input) {
    const parsedPolicy = parsePolicyString(input);

    return {
        occurences: {
            min: parsedPolicy.left,
            max: parsedPolicy.right,
        },
        letter: parsedPolicy.letter,
    }
}

function simplePolicyValidator(password, policy) {
    if (!policy.occurences || !policy.occurences.min || !policy.occurences.max || !policy.letter) {
        throw Error('Invalid policy provided');
    }

    if (!password) {
        return false;
    }

    const matchingLettersCount = password.split('').filter(letter => letter === policy.letter).length;

    return matchingLettersCount >= policy.occurences.min && matchingLettersCount <= policy.occurences.max;
}

function advancedPolicyBuilder(input) {
    const parsedPolicy = parsePolicyString(input);

    if (parsedPolicy.left - 1 < 0 || parsedPolicy.right < 0) {
        throw Error('Invalid policy');
    }

    return {
        indexes: [parsedPolicy.left - 1, parsedPolicy.right - 1],
        letter: parsedPolicy.letter,
    };
}

function advancedPolicyValidator(password, policy) {
    if (!policy.indexes || !policy.letter) {
        throw Error('Invalid policy provided');
    }

    if (!password) {
        return false;
    }

    return policy.indexes.filter(index => password[index] === policy.letter).length === 1;
}

const passwordPolicies = new Map()
    .set('simple', {builder: simplePolicyBuilder, validator: simplePolicyValidator})
    .set('advanced', {builder: advancedPolicyBuilder, validator: advancedPolicyValidator});

const tasks = [
    {
        fileName: './Input/Day2/Example1.txt',
        policy: 'simple'
    },
    {
        fileName: './Input/Day2/Input.txt',
        policy: 'simple'
    },
    {
        fileName: './Input/Day2/Example2.txt',
        policy: 'advanced'
    },
    {
        fileName: './Input/Day2/Input.txt',
        policy: 'advanced'
    }
];

tasks.forEach(task => {
    const passwords = readFileSync(task.fileName).toString().split('\n');
    const {builder, validator} = passwordPolicies.get(task.policy);

    const validPasswords = passwords.filter(password => {
        const policy = builder(password);
        return validator(password.split(': ').pop(), policy);
    });

    console.log(`Answer for ${task.fileName}: ${validPasswords.length}`);
});
