export {}

declare global{
    namespace Express {
        interface Request {
            auth_user?:string
        }
    }
}