import {Express} from 'express'
import root from './root'
import processogram from './processogram'
import admin from './admin'

export default (app:Express) => {
    app.use('/',root)
    app.use('/processogram',processogram)
    app.use('/admin',admin)
}