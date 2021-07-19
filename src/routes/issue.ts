import express from 'express'

import { addIssue } from '@/api/gitlab'

const router = express.Router()


router.post('',(request,response)=>{
    let { title,description } = request.body
    addIssue({title,description})    
    .then(() => {
        response.success()
    })
    .catch((error) => {        
        response.internalServerError(error)
    })
})

export default router
