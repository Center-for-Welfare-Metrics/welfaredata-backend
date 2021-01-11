const UserController = {
    get: (request,response)=>{
        let {auth_user} = request
        response.status(200).json(auth_user)
    }
}



module.exports = UserController