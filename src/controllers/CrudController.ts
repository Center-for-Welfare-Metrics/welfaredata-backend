import mongoose from "mongoose";

import { Request,Response } from 'express'

import { CREATE, DELETE_BY_ID, READ, READ_ONE, UPDATE } from "@/useCases/CRUD";

class RegularCrudController {
    model:mongoose.Model<any>;
    populate?:string

    constructor(model:mongoose.Model<any>,populate?:string){
        this.model = model
        this.populate = populate
    }
    
    read_one = (request:Request,response:Response) => {
        let query = request.body

        READ_ONE({
            query,
            Model:this.model
        }).then((document) => {
            if(document){
                response.success(document)
            }else{
                response.notFound()
            }
            
        }).catch((error) => {
            response.internalServerError(error)
        })
    }

    create = (request:Request,response:Response) => {
        let values = request.body
        let { auth_user } = request
        CREATE({
            values:{...values,createdBy:auth_user?._id},
            Model:this.model
        }).then((created:any) => {
            if(this.populate){
                created.populate(this.populate).execPopulate()
                .then((populated:any) => {
                    response.success(populated)
                })                    
            }else{
                response.success(created)
            }            
        }).catch((error:any) => {
            response.internalServerError(error)
        })
    }


    read = (request:Request,response:Response) => {
        let values = request.body
        READ({
            skip:0,
            limit:50,
            query:values,
            Model:this.model
        }).then((documents)=>{
            response.success(documents)
        }).catch((error) => {
            response.internalServerError(error)
        })
    }


    update = (request:Request,response:Response) => {
        let values = request.body
        let { auth_user } = request
        let {_id} = request.params
        UPDATE({
            _id,
            Model:this.model,
            values:{...values,lastUpdatedBy:auth_user?._id},
        })
        .then((updated_document) => {
            response.success(updated_document)
        }).catch((error) => {
            response.internalServerError(error)
        })
    }


    deleteById = (request:Request,response:Response) => {
        let {_id} = request.params
        DELETE_BY_ID({
            _id,
            Model:this.model
        })
        .then(()=>{
            response.success()
        }).catch((error) => {
            response.internalServerError(error)
        })        
    }

}



export default RegularCrudController