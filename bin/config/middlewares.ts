import {Express} from 'express'

const cookieParser = require('cookie-parser')
const bodyParser = require('body-parser')
const cors = require('cors')
const morgan = require('morgan')
const helmet = require('helmet')

export default (app:Express) => {
  app.use(bodyParser.json())
  app.use(bodyParser.urlencoded({ extended: false }))
  app.use(cookieParser())
  app.use(cors({credentials: true, origin: [process.env.CLIENT_DOMAIN,process.env.CLIENT_DOMAIN_2]}))
  app.use(helmet())
  app.use(morgan("tiny"))
}