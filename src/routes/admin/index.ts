import express from 'express'
import { AuthProtected } from '@/middlewares/logged'
const router = express.Router()

import users from './users'

router.all('/*',AuthProtected)

router.use('/users',users)

export default router