require('dotenv').config()
require('./config/database')()
const express = require('express')
const http = require('http')
const middlewaresAppConfig = require('./config/middlewares')
// const routes = require('./routes')
const app = express()

// Middlewares are imported here.
middlewaresAppConfig(app)

app.use(express.static(__dirname,{dotfiles:'allow'}))

// Add app routes.
// routes(app)

const server = http.Server(app)
server.listen(process.env.PORT || 8080)
