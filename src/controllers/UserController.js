const UserController = {
    get: (request,response)=>{
        let {_id} = request
        response.status(200).json(_id)
    }
}



module.exports = UserController