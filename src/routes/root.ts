import express from 'express'

const router = express.Router()

import AuthController from '@/controllers/AuthController'

import UserController from '@/controllers/UserController'

import UserValidator from '@/helpers/validators/user-validator'

import {OnlyGuest,AuthProtected} from '@/middlewares/logged'

router.post('/login',OnlyGuest,UserValidator.login,AuthController.login)

router.post('/register',OnlyGuest,UserValidator.register,AuthController.register)

router.post('/logout', AuthController.logout)

router.get('/user',AuthProtected,UserController.get)

export default router