import UserModel from '@/models/User'
import {signIn,logOut} from '@/helpers/auth/authentication'
import {Request,Response} from 'express'
import { CREATE } from '@/useCases/CRUD'

const AuthControllerr = {
    /**
     * REQUEST BODY PARAMS
     * @param email string
     * @param password string
     * @returns User Object -> {_id, email, name,createdBy? }
     */
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
    /**
     * REQUEST BODY PARAMS
     * @param name string
     * @param email string
     * @param password string
     * @returns User Object -> {_id, email, name,createdBy? }
     */
    register: async (request:Request,response:Response) => {
        try {
            const {name,email,password} = request.body
            const user = await CREATE({
                values:{name,email,password},
                AnyModel:UserModel
            })
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