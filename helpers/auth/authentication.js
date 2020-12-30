const jwt = require('jsonwebtoken')

const signIn = (should_singin,email,response) => {
    if(should_singin){
        const token = jwt.sign({email},process.env.SECRET,{expiresIn:'2h'})
        response.cookie('token',token,{httpOnly:true}).sendStatus(200)
    }else{
        response.status(412).json({
            email:['Credentials not found']
        })
    }
}

module.exports = {
    signIn
}