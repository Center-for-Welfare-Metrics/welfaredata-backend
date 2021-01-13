import Validator from 'validatorjs'
import {Rules,ErrorMessages} from 'validatorjs'


export default (body:any, rules:Rules, customMessages:ErrorMessages) => {
    return new Promise<void>((resolve,reject) => {
        const validation = new Validator(body,rules,customMessages)
        validation.passes(() => resolve())
        validation.fails(() => reject(validation.errors))
    })
}