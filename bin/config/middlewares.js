const cookieParser = require('cookie-parser')
const bodyParser = require('body-parser')
const cors = require('cors')
const morgan = require('morgan')

module.exports = (app) => {
  app.use(bodyParser.json())
  app.use(bodyParser.urlencoded({ extended: false }))
  app.use(cookieParser())
  app.use(cors())

  // Log requests
  app.use(morgan("tiny"))
}