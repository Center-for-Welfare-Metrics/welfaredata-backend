const validator = require('./validate')

const UserValidator = {
    login: ({body},response,next) => {
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
                message:'Validation Failed',
                data:errors
            })
        })
    },
    register: ({body},response,next) => {
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
                message:'Validation Failed',
                data:errors
            })
        })
    }
}


module.exports = UserValidator