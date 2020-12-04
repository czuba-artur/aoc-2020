const { readFileSync } = require('fs');

const VALID_MIN_BYR = 1920;
const VALID_MAX_BYR = 2002;

const VALID_MIN_IYR = 2010;
const VALID_MAX_IYR = 2020;

const VALID_MIN_EYR = 2020;
const VALID_MAX_EYR = 2030;

const VALID_PERSON_MIN_HEIGHT_IN_CM = 150;
const VALID_PERSON_MAX_HEIGHT_IN_CM = 193;

const VALID_PERSON_MIN_HEIGHT_IN_IN = 59;
const VALID_PERSON_MAX_HEIGHT_IN_IN = 76;

const VALID_HEX_COLOR_REGEXP = /^#[0-9a-f]{3,6}$/i;

const VALID_EYE_COLORS = ['amb', 'blu', 'brn', 'gry', 'grn', 'hzl', 'oth'];

const VALID_PID_LENGTH = 9;
const VALID_PID_REGEXP = /[0-9]+/;

function validateRange(value, min, max) {
    let parsedValue;
    if (typeof value !== 'number') {
        parsedValue = parseInt(value, 10);
        if (Object.is(parsedValue, NaN)) {
            return false;
        }
    } else {
        parsedValue = value;
    }

    return parsedValue >= min && parsedValue <= max;
}

const validateBYR = value => validateRange(value, VALID_MIN_BYR, VALID_MAX_BYR);
const validateIYR = value => validateRange(value, VALID_MIN_IYR, VALID_MAX_IYR);
const validateEYR = value => validateRange(value, VALID_MIN_EYR, VALID_MAX_EYR);
const validateHGT = value => {
    const parsedValue = parseFloat(value);
    if (Object.is(value, NaN)) {
        return false;
    }

    const unit = value.replace(parsedValue.toString(), '');
    if (!unit || !['cm', 'in'].includes(unit)) {
        return false;
    }

    return unit === 'cm'
        ? validateRange(parsedValue, VALID_PERSON_MIN_HEIGHT_IN_CM, VALID_PERSON_MAX_HEIGHT_IN_CM)
        : validateRange(parsedValue, VALID_PERSON_MIN_HEIGHT_IN_IN, VALID_PERSON_MAX_HEIGHT_IN_IN);
}

const validateHCL = value => VALID_HEX_COLOR_REGEXP.test(value.toLowerCase());
const validateECL = value => VALID_EYE_COLORS.includes(value.toLowerCase());
const validatePID = value => value.length === VALID_PID_LENGTH && VALID_PID_REGEXP.test(value);

const validatorConfigsMap = new Map()
    .set('byr', {
        validator: validateBYR,
    })
    .set('iyr', {
        validator: validateIYR,
    })
    .set('eyr', {
        validator: validateEYR,
    })
    .set('hgt', {
        validator: validateHGT,
    })
    .set('hcl', {
        validator: validateHCL,
    })
    .set('ecl', {
        validator: validateECL,
    })
    .set('pid', {
        validator: validatePID,
    })
    .set('cid', {
        validator: () => true,
        isOptional: true,
    })
    ;

function validatePassport(passport, disableValuesValidation) {
    const parsedPassport = {};

    passport
        .split(' ')
        .forEach(entry => {
            const [key, value] = entry.split(':');

            if (!key) {
                throw Error(`Invalid passport entry: ${entry}`);
            }

            parsedPassport[key] = value;
        });


    for (let [key, {isOptional, validator}] of Array.from(validatorConfigsMap.entries())) {
        const value = parsedPassport[key];
        if (!value && !isOptional) {
            return false;
        }

        if (disableValuesValidation) {
            continue;
        }

        if (!validator(parsedPassport[key])) {
            return false;
        }
    }


    return true;
}

const tasks = [
    {
        fileName: './Input/Day4/Example1.txt',
        disableValuesValidation: true,
    },
    {
        fileName: './Input/Day4/Input.txt',
        disableValuesValidation: true,
    },
    {
        fileName: './Input/Day4/Example2.txt',
    },
    {
        fileName: './Input/Day4/Example3.txt',
    },
    {
        fileName: './Input/Day4/Input.txt',
    },
];

tasks.forEach((task, index) => {
    const passports = readFileSync(task.fileName)
        .toString()
        .split('\n\n')
        .map(passport => passport.split('\n').join(' '));

    const answer = passports
        .filter(passport => validatePassport(passport, task.disableValuesValidation))
        .length;


    console.log(`Answer for task ${index + 1} ${task.fileName}: ${answer}`);
});
