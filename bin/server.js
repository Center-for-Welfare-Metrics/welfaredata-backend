require('dotenv').config()
require('./config/database')()
const express = require('express')
const http = require('http')
const middlewaresAppConfig = require('./config/middlewares')
const routes = require('../src/routes')
// const session = require('express-session')
const app = express()


middlewaresAppConfig(app)

app.use(express.static(__dirname,{dotfiles:'allow'}))

// if(process.env.NODE_ENV === 'prod'){
//     app.use(session({
//         cookie:{
//             sameSite:'none',
//             secure:true
//         }
//     }))
// }

routes(app)

const server = http.Server(app)
server.listen(process.env.PORT || 8080)
