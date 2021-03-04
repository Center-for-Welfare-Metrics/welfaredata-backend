import express from 'express'

const router = express.Router()

import ProcessogramController from '@/controllers/ProcessogramController'

import {AuthProtected} from '@/middlewares/logged'

router.get('/all', 
    // AuthProtected, 
    ProcessogramController.all
)

router.post('',
    AuthProtected,
    ProcessogramController.create
)

router.patch('/:_id',
    AuthProtected,
    ProcessogramController.update
)

router.post('/:_id/new_layer',
    AuthProtected,
    ProcessogramController.createNewLayer
)
export default router