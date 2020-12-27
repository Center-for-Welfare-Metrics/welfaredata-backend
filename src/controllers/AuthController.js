const UserModel = require('../models/User')

const AuthController = {
    register: (request,response) => {
        const {email,password} = request.body
        const user = new UserModel({email,password})
        user.save()
        .then(()=>{
            response.sendStatus(200)
        })
        .catch((error)=>{
            response.status(500).json(error)
        })
    }
}


module.exports = AuthController