const router = require('express').Router()
const AuthController = require('../controllers/AuthController')
const UserValidator = require('../../helpers/validators/user-validator')


router.post('/login',UserValidator.login,AuthController.login)

router.post('/register',UserValidator.register,AuthController.register)


module.exports = router