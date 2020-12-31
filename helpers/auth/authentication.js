const jwt = require('jsonwebtoken')

const signIn = (should_singin,user,response) => {
    if(should_singin){
        delete user.password
        const token = jwt.sign(user,process.env.SECRET,{expiresIn:'2h'})
        response.cookie('token',token,{httpOnly:true}).status(200).json(user)
    }else{
        response.status(412).json({
            email:['Credenciais não encontradas.']
        })
    }
}


const logOut = (response) => {
    response.clearCookie('token').sendStatus(200)
}

module.exports = {
    signIn,
    logOut
}