import express from 'express'

const router = express.Router()

import CrudController from '@/controllers/CrudController'

import SpecieModel from '@/models/Specie'


import {AuthProtected} from '@/middlewares/logged'


const Controller = new CrudController(SpecieModel)

router.get('/:_id',
    Controller.get_one_by_id
)

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

export default router
