import validator from './validate'
import {Response,NextFunction,Request} from 'express'

export default {
    login: ({body}:Request,response:Response,next:NextFunction) => {
        let rules = {
            email:'email|required',
            password:'min:6'
        }
        validator(body,rules,{})
        .then(()=>{
            next()
        })
        .catch((errors) => {
            response.status(412)
            .json({
                success:false,
                message:'Operação Rejeitada',
                data:errors
            })
        })
    },
    register: ({body}:Request,response:Response,next:NextFunction) => {
        let rules = {
            email:'email|required',
            password:'min:6|confirmed'
        }
        validator(body,rules,{})
        .then(()=>{
            next()
        })
        .catch((errors) => {
            response.status(412)
            .json({
                success:false,
                message:'Operação Rejeitada',
                data:errors
            })
        })
    }
}