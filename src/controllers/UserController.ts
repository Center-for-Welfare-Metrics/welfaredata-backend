import {Request,Response} from 'express'


const UserController = {
    get: (request:Request,response:Response)=>{
        let {auth_user} = request
        response.status(200).json(auth_user)
    }
}



export default UserController