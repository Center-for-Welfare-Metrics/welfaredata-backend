import {Express,ErrorRequestHandler} from 'express'



declare global{
    namespace Express {
        interface Request {
            auth_user?:string
        }
        interface Response {
            success(data?:any):void
            notFound(data:any):void
            internalServerError(data:any):void
            preconditionFailed(data?:any):void
            unauthorized(data?:any):void
        }
    }
}

export default (app:Express) => {
    app.response.success = function(data){
        if(data){
            this.status(200).json(data)
        }else{
            this.sendStatus(200)
        }
    }

    app.response.notFound = function(data){
        this.status(404).json(data)
    }

    app.response.internalServerError = function(error){
        this.status(500).json(error)
    }

    app.response.preconditionFailed = function(data){
        if(data){
            this.status(412).json(data)
        }else{
            this.sendStatus(412)
        }
    }

    app.response.unauthorized = function(data){
        if(data){
            this.status(401).json(data)
        }else{
            this.sendStatus(401)
        }
    }
}

