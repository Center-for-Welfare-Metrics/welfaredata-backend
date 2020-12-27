const router = require('express').Router()
const AuthController = require('../controllers/AuthController')
const UserValidator = require('../../helpers/validators/user-validator')

router.post('/register',UserValidator.register,AuthController.register)


module.exports = router