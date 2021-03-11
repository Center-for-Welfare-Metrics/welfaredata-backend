import express from 'express'

const router = express.Router()

import CrudController from '@/controllers/CrudController'

import ProcessogramController from '@/controllers/ProcessogramController'

import ProcessogramModel from '@/models/Processogram'

import {AuthProtected} from '@/middlewares/logged'

const Controller = new CrudController(ProcessogramModel,'productionSystem lifefates.lifeFate lifefates.phases.phase lifefates.phases.circumstances.circumstance')

const multer = require('multer')

const upload = multer()

router.get('/all', 
    // AuthProtected,
    ProcessogramController.all
)

router.get('/:_id',
    AuthProtected,
    Controller.get_one_by_id
)

router.post('',
    AuthProtected,
    ProcessogramController.create
)

router.patch('/:_id/upload',
    upload.single('file'),
    ProcessogramController.upload
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