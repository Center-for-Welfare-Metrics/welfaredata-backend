import {Request,Response} from 'express'

import ProcessogramModel, { IMedia } from '@/models/Processogram'
import CrudController from '@/controllers/CrudController'
import { upload } from '@/storage/storage'

const Controller = new CrudController(ProcessogramModel,'productionSystem')

const ProcessogramController = {
    all:(request:Request,response:Response)=>{
        ProcessogramModel.find({},{user_id:0}).populate('productionSystem lifefates.lifeFate lifefates.phases.phase lifefates.phases.circumstances.circumstance')
        .then((documents) => {
            response.success(documents)
        })
    },
    create:Controller.create,
    /**
     * REQUEST BODY PARAMS
     * @param id_tree string
     * @param file file
     */
    upload:(request:Request,response:Response) => {
        let { originalname,buffer,mimetype,size } = request.file      
        
        let { id_tree } = request.body        

        id_tree = JSON.parse(id_tree)

        let { _id } = request.params

        upload(originalname,buffer,mimetype)
        .then((value) => {
            let source = value.Location
            let new_media : IMedia = {
                originalName:originalname,
                url:source,
                size:size,
                type:mimetype
            }
            ProcessogramModel.findById(_id).populate('productionSystem lifefates.lifeFate lifefates.phases.phase lifefates.phases.circumstances.circumstance')
            .then((processogram:any) => {
                let updated_document = processogram                
                Object.keys(id_tree).forEach((key)=>{                                         
                    updated_document = updated_document?.[key].id(id_tree[key])
                })
                
                updated_document.medias.push(new_media)

                processogram.save()

                response.success(updated_document)
            }).catch((error)=>{
                response.internalServerError(error)
            })
        })
        .catch((error) => {
            response.internalServerError(error)
        })

                
    },
    /**
     * REQUEST BODY PARAMS
     * @param id_tree string
     * @param values string
     */
    update:(request:Request,response:Response) => {
        let { id_tree,values } = request.body
        let { _id } = request.params        
        
        ProcessogramModel.findById(_id).populate('productionSystem lifefates.lifeFate lifefates.phases.phase lifefates.phases.circumstances.circumstance')
        .then((processogram:any) => {
            let updated_document = processogram

            Object.keys(id_tree).forEach((key)=>{            
                updated_document = updated_document?.[key].id(id_tree[key])
            })
            
            Object.keys(values).forEach((key) => {
                updated_document[key] = values[key]
            })

            processogram.save()
            .then((saved:any) => {
                response.success(saved)
            })
            
        }).catch((error)=>{
            console.error(error)
        })        
    },
    /**
     * REQUEST BODY PARAMS
     * @param id_tree
     * @param pushTo string
     * @param object object
     */
    createNewLayer:(request:Request,response:Response) => {
        let { id_tree,pushTo,object } = request.body
        let { _id } = request.params

        ProcessogramModel.findById(_id)
        .then((processogram:any) => {
            let updated_document = processogram

            Object.keys(id_tree).forEach((key)=>{            
                updated_document = updated_document?.[key].id(id_tree[key])
            })

            if(!updated_document[pushTo]){
                updated_document[pushTo] = []
            }            

            let key = Object.keys(object)[0]
            let value = object[key]
            
            let indexFinded = updated_document[pushTo].findIndex((item:any) => item[key] === value)

            if(indexFinded < 0){
                updated_document[pushTo].push(object)
                processogram.save()
                .then((saved:any)=>{
                    saved.populate('productionSystem lifefates.lifeFate lifefates.phases.phase lifefates.phases.circumstances.circumstance')
                    .execPopulate()
                    .then((populated:any) => {                
                        response.success(populated)
                    })
                })
            }else{
                processogram.populate('productionSystem lifefates.lifeFate lifefates.phases.phase lifefates.phases.circumstances.circumstance')
                .execPopulate()
                .then((populated:any) => {                
                    response.success(populated)
                })
            }
        })
    }
}


export default ProcessogramController