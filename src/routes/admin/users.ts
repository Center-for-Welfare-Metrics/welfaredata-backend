import express from 'express'

const router = express.Router()

import ManageUsersController from '@/controllers/Admin/ManageUsersController'
import ManageUsersValidator from '@/helpers/validators/manage-users-validator'

router.get('', 
    ManageUsersController.get
)

router.post('',
    ManageUsersValidator.create,
    ManageUsersController.create
)

router.put('/:_id',
    ManageUsersController.update
)

export default router