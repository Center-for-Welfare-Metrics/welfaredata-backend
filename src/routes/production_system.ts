import express from 'express'


import CrudController from '@/controllers/CrudController'

import ProductionSystemModel from '@/models/ProductionSystem'

import {AuthProtected} from '@/middlewares/logged'

import PC from '@/controllers/ProcessogramController'

const router = express.Router()

const multer = require('multer')

const upload = multer()

const Controller = new CrudController(ProductionSystemModel)


router.all('/*',AuthProtected)

router.get('',
    Controller.read
)

router.post('',
    Controller.create
)

router.patch('/:_id',
    Controller.update_next,
    PC.all
)

router.patch('/:_id/upload',
    upload.single('file'),
    Controller.upload
)

router.delete('/:_id',
    Controller.deleteById
)

router.post('/getOneReference', 
    Controller.read_one
)

export default router
