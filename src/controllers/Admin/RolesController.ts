import { Request,Response } from "express"
import { READ,CREATE, UPDATE, DELETE_BY_ID, READ_ONE_BY_ID } from '@/useCases/CRUD'
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
            Model:RoleModel,
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
            Model:RoleModel
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
                    Model:RoleModel
                })
                .then((created) => {
                    response.success(created)
                })
            }
        })
    },
    delete:(request:Request,response:Response) => {
        let { _id } = request.params

        READ_ONE_BY_ID({_id,Model:RoleModel})
        .then((role) => {
            if(role.name === 'Admin'){
                response.preconditionFailed()
            }else{
                DELETE_BY_ID({_id,Model:RoleModel})
                .then(() => {
                    response.success()
                })
            }
        })
        .catch((error) => {
            response.internalServerError(error)
        })
    }
}

export default RolesController