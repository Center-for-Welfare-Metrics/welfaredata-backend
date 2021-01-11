const validator = require('./validate')

module.exports = {
    login: ({body}:any,response:any,next:any) => {
        let rules = {
            email:'email|required',
            password:'min:6'
        }
        validator(body,rules,{})
        .then(()=>{
            next()
        })
        .catch((errors:any) => {
            response.status(412)
            .json({
                success:false,
                message:'Operação Rejeitada',
                data:errors
            })
        })
    },
    register: ({body}:any,response:any,next:any) => {
        let rules = {
            email:'email|required',
            password:'min:6|confirmed'
        }
        validator(body,rules,{})
        .then(()=>{
            next()
        })
        .catch((errors:any) => {
            response.status(412)
            .json({
                success:false,
                message:'Operação Rejeitada',
                data:errors
            })
        })
    }
}