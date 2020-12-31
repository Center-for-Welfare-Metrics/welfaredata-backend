const jwt = require('jsonwebtoken')

const signIn = (should_singin,user,response) => {
    if(should_singin){
        delete user.password
        const token = jwt.sign(user,process.env.SECRET,{expiresIn:'2h'})
        let options = {
            httpOnly:true
        }
        if(process.env.NODE_EV === 'prod'){
            options.sameSite = 'none'
            options.secure = true
        }
        response.cookie('token',token,options).status(200).json(user)
    }else{
        response.status(412).json({
            email:['Credenciais não encontradas.']
        })
    }
}


const logOut = (response) => {
    let options = {
        httpOnly:true
    }
    if(process.env.NODE_EV === 'prod'){
        options.sameSite = 'none'
        options.secure = true
    }
    response.clearCookie('token',options).sendStatus(200)
}

module.exports = {
    signIn,
    logOut
}