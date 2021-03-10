import {Request,Response} from 'express'

import ProcessogramModel from '@/models/Processogram'
import CrudController from '@/controllers/CrudController'

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

            response.success(processogram)
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

            updated_document[pushTo].push(object)

            processogram.save()

            processogram.populate('productionSystem lifefates.lifeFate lifefates.phases.phase lifefates.phases.circumstances.circumstance')
            .execPopulate()
            .then((populated:any) => {                
                response.success(populated)
            })
        })
    }
}


export default ProcessogramController