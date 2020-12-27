const Validator = require('validatorjs');
const validator = (body, rules, customMessages) => {
    return new Promise((resolve,reject) => {
        const validation = new Validator(body, rules, customMessages)
        validation.passes(() => resolve())
        validation.fails(() => reject(validation.errors))
    })
};

module.exports = validator;