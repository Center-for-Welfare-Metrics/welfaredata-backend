import express from 'express'

import CrudController from '@/controllers/CrudController'

import LifeFateModel from '@/models/LifeFate'

import {AuthProtected} from '@/middlewares/logged'

import PC from '@/controllers/ProcessogramController'

const multer = require('multer')

const upload = multer()


const router = express.Router()

const Controller = new CrudController(LifeFateModel)

router.all('/*',AuthProtected)

router.get('',
    Controller.read
)

router.post('',
    Controller.create
)

router.patch('/:_id/:specie',
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
