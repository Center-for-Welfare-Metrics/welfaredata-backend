import mongoose,{HookNextFunction} from 'mongoose'

import bcrypt from 'bcrypt'

export interface IUser extends mongoose.Document {
    name:string
    email:string
    password:string
    validatePassword(password:string):Promise<boolean>
    secureJsonfy():any
}

const saltRounds = 10

const UserSchema = new mongoose.Schema({
    name: {type:String, required:true},
    email: {type:String, required:true, unique:true },
    password: {type:String, required:true }
})

UserSchema.pre('save', function(this:IUser,next:HookNextFunction){
    let user = this
    if(user.isNew || user.isModified('password')){
        bcrypt.hash(user.password,saltRounds,(error:any,hashedPassword:string) => {
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

UserSchema.methods.validatePassword = function(this:IUser,password:string){
    let user = this
    return new Promise((resolve,reject) => {
        bcrypt.compare(password,user.password)
        .then((result) => {
            resolve(result)
        })
        .catch((error:any)=>{
            reject(error)
        })
    })
}

UserSchema.methods.secureJsonfy = function(){
    let user_to_json = this.toJSON()
    delete user_to_json.password
    return user_to_json
}

export default mongoose.model<IUser>('User',UserSchema)