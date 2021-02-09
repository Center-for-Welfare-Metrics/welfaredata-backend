import mongoose,{HookNextFunction,Schema} from 'mongoose'

import bcrypt from 'bcrypt'

export interface IUser extends mongoose.Document {
    name:string
    email:string
    password?:string
    validatePassword(password:string):Promise<boolean>;
    secureJsonfy():any;
}

const saltRounds = 10

const UserSchema : Schema = new mongoose.Schema({
    name: {type:String, required:true},
    email: {type:String, required:true, unique:true },
    password: {type:String, required:true }
})

UserSchema.pre<any>('save', function(next:HookNextFunction){
    let user = this
    if(user.isNew || user.isModified('password')){
        bcrypt.hash(user.password,saltRounds,(error,hashedPassword:string) => {
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

UserSchema.methods.validatePassword = function(this:any,password:string){
    let user = this
    return new Promise((resolve,reject) => {
        bcrypt.compare(password,user.password || '')
        .then((result) => {
            resolve(result)
        })
        .catch((error)=>{
            reject(error)
        })
    })
}

UserSchema.methods.secureJsonfy = function(this:any){
    let user_to_json = this.toJSON()
    delete user_to_json.password
    return user_to_json
}

export default mongoose.model<IUser>('User',UserSchema)