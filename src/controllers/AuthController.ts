export {}
const UserModel = require('@/models/User')
const { signIn,logOut } = require('@/helpers/auth/authentication')

const AuthControllerr = {
    login: async (request,response) => {
        const {email,password} = request.body
        try {
            const user = await UserModel.findOne({email}).exec()
            if(user){
                user.validatePassword(password)
                .then((result) => {
                    signIn(result,user.toJSON(),response)
                })
                .catch(()=>{
                    response.status(404).json({
                        email:['Credenciais não encontradas.']
                    })
                })
            }else{
                response.status(404).json({
                    email:['Credenciais não encontradas.']
                })
            }

        } catch (error) {
            response.status(500).json(error)
        }
    },
    register: async (request,response) => {
        try {
            const {email,password} = request.body
            const user = new UserModel({email,password})
            await user.save()
            signIn(true,user.toJSON(),response)
        } catch (error) {
            response.status(500).json(error)
        }
    },
    logout: (request,response) => {
        logOut(response)
    }
}


module.exports = AuthControllerr