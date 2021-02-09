import {Request,Response} from 'express'

import ProcessogramModel from '@/models/Processogram'

const ProcessogramController = {
    all:(request:Request,response:Response)=>{
        ProcessogramModel.find()
        .then((documents) => {
            response.success(documents)
        })
    }
}




export default ProcessogramController