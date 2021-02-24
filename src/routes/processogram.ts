import express from 'express'

const router = express.Router()

import ProcessogramController from '@/controllers/ProcessogramController'

import {AuthProtected} from '@/middlewares/logged'

router.get('/all', 
    // AuthProtected, 
    ProcessogramController.all
)

export default router