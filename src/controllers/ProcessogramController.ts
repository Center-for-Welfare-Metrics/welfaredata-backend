import {Request,Response} from 'express'

import ProcessogramModel from '@/models/Processogram'

const ProcessogramController = {
    all:(request:Request,response:Response)=>{
        ProcessogramModel.find({},{user_id:0})
        .then((documents) => {
            response.success(documents)
        })
    }
}


export default ProcessogramController