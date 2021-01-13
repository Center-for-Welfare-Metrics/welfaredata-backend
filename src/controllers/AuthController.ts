import UserModel from '@/models/User'
import {signIn,logOut} from '@/helpers/auth/authentication'
import {Request,Response} from 'express'

const AuthControllerr = {
    login: async (request:Request,response:Response) => {
        const {email,password} = request.body
        try {
            const user = await UserModel.findOne({email}).exec()
            if(user){
                user.validatePassword(password)
                .then((result) => {
                    signIn(result,user,response)
                })
                .catch(()=>{
                    response.notFound({
                        email:['Credentials not found.']
                    })
                })
            }else{
                response.notFound({
                    email:['Credentials not found.']
                })
            }

        } catch (error) {
            response.internalServerError(error)
        }
    },
    register: async (request:Request,response:Response) => {
        try {
            const {email,password} = request.body
            const user = new UserModel({email,password})
            await user.save()
            signIn(true,user,response)
        } catch (error) {
            response.internalServerError(error)
        }
    },
    logout: (request:Request,response:Response) => {
        logOut(response)
    }
}


export default AuthControllerr