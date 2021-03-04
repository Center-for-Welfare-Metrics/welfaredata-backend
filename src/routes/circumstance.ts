import express from 'express'

const router = express.Router()

import CrudController from '@/controllers/CrudController'

import CircumstanceModel from '@/models/Circumstance'


import {AuthProtected} from '@/middlewares/logged'


const Controller = new CrudController(CircumstanceModel)

router.all('/*',AuthProtected)

router.get('',
    Controller.read
)

router.post('',
    Controller.create
)

router.patch('/:_id',
    Controller.update
)

router.delete('/:_id',
    Controller.deleteById
)

router.post('/getOneReference', 
    Controller.read_one
)

export default router
