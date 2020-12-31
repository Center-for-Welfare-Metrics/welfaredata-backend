const jwt = require('jsonwebtoken')


const OnlyGuest = (request,response,next) => {
    let {token} = request.cookies
    if(token){
        response.sendStatus(412)
    }else{
        next()
    }
}


const AuthProtected = (request,response,next) => {
    let {token} = request.cookies
    if(token){
        jwt.verify(token,process.env.SECRET,(error,decoded) => {
            if(error){
                response.sendStatus(401) 
            }else{
                request._id = decoded._id
                next()
            }
        })
    }else{
        response.sendStatus(401)
    }
}

module.exports = {
    OnlyGuest,
    AuthProtected
}