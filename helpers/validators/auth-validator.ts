import validator from './validate'
import {Response,NextFunction,Request} from 'express'

export default {
    login: ({body}:Request,response:Response,next:NextFunction) => {
        let rules = {
            email:'email|required',
            password:'min:6|required'
        }
        validator(body,rules,{})
        .then(()=>{
            next()
        })
        .catch((errors) => {
            response.preconditionFailed(errors)
        })
    },
    register: ({body}:Request,response:Response,next:NextFunction) => {
        let rules = {
            email:'email|required',
            password:'min:6|required|confirmed'
        }
        validator(body,rules,{})
        .then(()=>{
            next()
        })
        .catch((errors) => {
            response.preconditionFailed(errors)
        })
    }
}