import {Application} from 'express'
import root from './root'


export default (app:Application) => {
    app.use('/',root)
}
  