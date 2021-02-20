import { Request,Response } from "express"
import { READ,CREATE, UPDATE } from '@/useCases/CRUD'
import RoleModel from '@/models/Role'

const RolesController = {
    /**
     * REQUEST QUERY PARAMS
     * @param skip? number
     * @param limit? number
     * @param name? string
     * @param createdBy? objectId
     * @returns data: Role Object Array -> [ {_id, name,createdBy? } ]
     * @returns count: Count of total documents matched on filter
     */
    get: (request:Request,response:Response) => {
        let { skip,limit,name,createdBy } = request.query
        READ({
            skip,
            limit,
            query:{name,createdBy},
            AnyModel:RoleModel,
            isId:['createdBy']
        })
        .then((documents) => {
            response.success(documents)
        })
        .catch((error) => {
            response.internalServerError(error)
        })
    },
    /**
     * REQUEST QUERY PARAMS
     * @param name string
     * @param description string
     * @param can any 
     */
    create:(request:Request,response:Response) => {
        let { name,description,can } = request.body
        CREATE({
            values:{
                name,
                description,
                can,
                createdBy:request.auth_user?._id
            },
            AnyModel:RoleModel
        })
        .then((created:any) => {
            response.success(created)
        })
    },
    /**
     * REQUEST QUERY PARAMS
     * @param name string
     * @param description string
     * @param can any 
     */
    update:(request:Request,response:Response) => {
        let { _id } = request.params
        let { name,description,can } = request.body
        RoleModel.findById(_id)
        .then((role) => {
            if(role?.name === 'Admin'){
                response.success()
            }else{
                UPDATE({
                    _id,
                    values:{
                        name,
                        description,
                        can
                    },
                    AnyModel:RoleModel
                })
                .then((created) => {
                    response.success(created)
                })
            }
        })
    }
}

export default RolesController