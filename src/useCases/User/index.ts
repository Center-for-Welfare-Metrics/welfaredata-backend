import { assignValues } from '@/helpers/object'
import UserModel from '@/models/User'

interface User {
    name:string
    email:string
    password:string
    createdBy?:string
}

export const createUser = ({name,email,password,createdBy}:User) => {
    let values = assignValues({name,email,password,createdBy})

    const user = new UserModel(values)

    return user.save()
}

export const getUsers = (skip:any,limit:any,query:any) => {
    let skipToNumber = (Number(skip) || 0)
    let limitToNumber = (Number(limit) || 0)
    return UserModel.find(query,{password:0},{skip:skipToNumber,limit:limitToNumber})
}