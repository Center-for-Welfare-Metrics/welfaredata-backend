const router = require('express').Router()
const AuthController = require('../controllers/AuthController')
const UserController = require('../controllers/UserController')
const UserValidator = require('../../helpers/validators/user-validator')
const {OnlyGuest,AuthProtected} = require('../middlewares/logged')

router.post('/login',OnlyGuest,UserValidator.login,AuthController.login)

router.post('/register',OnlyGuest,UserValidator.register,AuthController.register)

router.post('/logout', AuthController.logout)

router.get('/user',AuthProtected,UserController.get)

module.exports = router