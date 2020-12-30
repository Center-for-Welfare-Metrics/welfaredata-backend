const UserModel = require('../models/User')
const jwt = require('jsonwebtoken')
const { signIn } = require('../../helpers/auth/authentication')

const AuthControllerr = {
    login: (request,response) => {
        const {email,password} = request.body
        UserModel.findOne({email})
        .then((user) => user.validatePassword(password) )
        .then((result) => signIn(result,email,response) )
        .catch(()=>{
            response.status(412).json({
                email:['Credentials not found']
            })
        })
    },
    register: (request,response) => {
        const {email,password} = request.body
        const user = new UserModel({email,password})
        user.save()
        .then(()=>{
            const token = jwt.sign({email},process.env.SECRET,{expiresIn:'2h'})
            response.cookie('token',token,{
                httpOnly:true,
                domain:process.env.CLIENT_DOMAIN,
                secure:true
            }).sendStatus(200)
        })
        .catch((error)=>{
            response.status(500).json(error)
        })
    }
}


module.exports = AuthControllerr