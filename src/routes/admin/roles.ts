import express from 'express'

const router = express.Router()

import RolesController from '@/controllers/Admin/RolesController'

router.get('', 
    RolesController.get
)

router.post('',
    RolesController.create,
)

router.put('/:_id',
    RolesController.update
)

router.delete('/:_id',
    RolesController.delete
)

export default router