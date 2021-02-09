import {Express} from 'express'
import root from './root'
import processogram from './processogram'

export default (app:Express) => {
    app.use('/',root)
    app.use('/processogram',processogram)
}
  