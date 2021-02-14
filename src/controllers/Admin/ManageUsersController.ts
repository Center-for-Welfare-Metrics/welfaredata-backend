import { assignFindQuery, assignValues } from '@/helpers/object'
import { createUser, getUsers } from '@/useCases/User'
import { Request,Response } from 'express'


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
        let query_params = assignValues({name,email,createdBy})
        let find_query = assignFindQuery(query_params,['createdBy'])
        getUsers(skip,limit,find_query)
        .then((documents) => {
            response.success(documents)
        })
        .catch((error) => {
            response.internalServerError(error)
        })
    },
    /** 
        REQUEST BODY PARAMS
        @param name? string
        @param email string
        @param password string
    */
    create: (request:Request,response:Response) => {
        let { name,email,password } = request.body
        createUser({
            name,
            email,
            password,
            createdBy:request.auth_user?._id
        })
        .then(() => {
            response.success()
        })
    }
}



export default ManageUsersController