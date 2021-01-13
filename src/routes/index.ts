import {Express} from 'express'
import root from './root'


export default (app:Express) => {
    app.use('/',root)
}
  