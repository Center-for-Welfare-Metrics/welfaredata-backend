export {}
const mongoose = require('mongoose')
const bcrypt = require('bcrypt')

const saltRounds = 10

const UserSchema = new mongoose.Schema({
    email: {type:String, required:true, unique:true },
    password: {type:String, required:true }
})

UserSchema.pre('save', function(this:any,next){
    let user = this
    if(user.isNew || user.isModified('password')){
        bcrypt.hash(user.password,saltRounds,(error,hashedPassword) => {
            if(error){
                next(error)
            }else{
                user.password = hashedPassword
                next()
            }
        })
    }else{
        next()
    }
})

UserSchema.methods.validatePassword = function(password){
    let user = this
    return new Promise((resolve,reject) => {
        bcrypt.compare(password,user.password)
        .then((result) => {
            resolve(result)
        })
        .catch((error)=>{
            reject(error)
        })
    })
    
}

module.exports = mongoose.model('User',UserSchema)