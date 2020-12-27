const mongoose = require('mongoose')
const bcrypt = require('bcrypt')

const saltRounds = 10

const UserSchema = new mongoose.Schema({
    email: {type:String, required:true, unique:true },
    password: {type:String, required:true }
})

UserSchema.pre('save', function(next){
    if(this.isNew || this.isModified('password')){
        bcrypt.hash(this.password,saltRounds,(error,hashedPassword) => {
            if(error){
                next(error)
            }else{
                this.password = hashedPassword
                next()
            }
        })
    }else{
        next()
    }
})

module.exports = mongoose.model('User',UserSchema)