import mongoose,{Schema} from 'mongoose'

export interface IProcessogram extends mongoose.Document {
    name:string
}

const ProcessogramSchema : Schema = new mongoose.Schema({
    name: {type:String, required:true}
},{
    timestamps:true,
    strict:false
})

export default mongoose.model<IProcessogram>('Processogram',ProcessogramSchema)