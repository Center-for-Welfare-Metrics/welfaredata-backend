import jwt from 'jsonwebtoken'

import {IUser} from '@/models/User'

import {Response} from 'express'

const options:any = {
    httpOnly:true
}

if(process.env.NODE_ENV === 'prod'){
    options.sameSite = 'none'
    options.secure = true
}

export const signIn = (should_singin:boolean,user:IUser,response:Response) => {
    if(should_singin){
        const token = jwt.sign(user.secureJsonfy(),process.env.SECRET!,{expiresIn:'6h'})
        response.cookie('token',token,options).status(200).json(user)
    }else{
        response.notFound({
            email:['Credentials not found']
        })
    }
}

export const logOut = (response:Response) => {
    response.clearCookie('token',options).sendStatus(200)
}