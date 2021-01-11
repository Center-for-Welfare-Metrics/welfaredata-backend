const Validator = require('validatorjs')


module.exports = (body, rules, customMessages:string) => {
    return new Promise<void>((resolve,reject) => {
        const validation = new Validator(body, rules, customMessages)
        validation.passes(() => resolve())
        validation.fails(() => reject(validation.errors))
    })
};