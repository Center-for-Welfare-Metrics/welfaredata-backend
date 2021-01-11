const jwt = require('jsonwebtoken')

const options:any = {
    httpOnly:true
}

if(process.env.NODE_ENV === 'prod'){
    options.sameSite = 'none'
    options.secure = true
}

const signIn = (should_singin:boolean,user:any,response:any) => {
    if(should_singin){
        delete user.password
        const token = jwt.sign(user,process.env.SECRET,{expiresIn:'6h'})
        response.cookie('token',token,options).status(200).json(user)
    }else{
        response.status(412).json({
            email:['Credenciais não encontradas.']
        })
    }
}


const logOut = (response:any) => {
    response.clearCookie('token',options).sendStatus(200)
}

module.exports = {
    signIn,
    logOut
}