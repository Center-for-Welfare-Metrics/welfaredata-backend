import { Request,Response } from 'express'
import UserModel from '@/models/User'
import { READ,CREATE, UPDATE } from '@/useCases/CRUD'

const ManageUsersController = {
     /**
     * REQUEST QUERY PARAMS
     * @param skip? number
     * @param limit? number
     * @param name? string
     * @param email? string
     * @param createdBy? objectId
     * @returns data: User Object Array -> [ {_id, email, name,createdBy? } ]
     * @returns count: Count of total documents matched on filter
     */
    get: (request:Request,response:Response) => {
        let { skip,limit,name,email,createdBy } = request.query
        READ({
            skip,
            limit,
            query:{name,email,createdBy},
            AnyModel:UserModel,
            isId:['createdBy'],
            exclude:{password:0},
            populate:['role']
        })
        .then((documents) => {
            response.success(documents)
        })
        .catch((error) => {
            response.internalServerError(error)
        })
    },
    /** 
        REQUEST BODY PARAMS
        @param name string
        @param email string
        @param password string
        @param role objectId
    */
    create: (request:Request,response:Response) => {
        let { name,email,password,role } = request.body
        CREATE({
            values:{
                name,
                email,
                password,
                role,
                createdBy:request.auth_user?._id
            },
            AnyModel:UserModel
        })
        .then(() => {
            response.success()
        })
    },
    /** 
        REQUEST BODY PARAMS
        @param role objectId
    */
   update: (request:Request,response:Response) => {
    let { _id } = request.params
    let { role } = request.body
    UPDATE({
        _id,
        values:{
            role
        },
        AnyModel:UserModel
    })
    .then(() => {
        response.success()
    })
},
}



export default ManageUsersController