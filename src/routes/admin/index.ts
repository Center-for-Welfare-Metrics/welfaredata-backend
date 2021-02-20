import express from 'express'
import { AuthProtected } from '@/middlewares/logged'
const router = express.Router()

import users from './users'
import roles from './roles'

router.all('/*',AuthProtected)

router.use('/users',users)

router.use('/roles',roles)

export default router