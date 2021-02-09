import jwt from 'jsonwebtoken'

import {IUser} from '@/models/User'

import {CookieOptions, Response} from 'express'

const hours = (value:number) => {
    return value * 60 * 60 * 1000
}

const options:CookieOptions = {
    httpOnly:true
}

if(process.env.NODE_ENV === 'prod'){
    options.sameSite = 'none'
    options.secure = true
}

export const signIn = (should_singin:boolean,user:IUser,response:Response) => {
    if(should_singin){        
        const token = jwt.sign(user.secureJsonfy(),process.env.SECRET!,{expiresIn:'12h'})
        response.cookie('token',token,{...options,maxAge: hours(12)}).status(200).json(user)
    }else{
        response.notFound({
            email:['Credentials not found']
        })
    }
}

export const logOut = (response:Response) => {
    response.clearCookie('token',options).sendStatus(200)
}