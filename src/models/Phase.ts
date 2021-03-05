import mongoose,{Schema,SchemaTypeOptions} from 'mongoose'
import { MediaSchema } from './Processogram'


export interface IPhase extends mongoose.Document {
    name:string
    specie:string
    description?:string
    createdBy?:string
    lastUpdatedBy?:string
    medias: SchemaTypeOptions<any> | Schema
}

const PhaseSchema : Schema = new mongoose.Schema({
    specie:{ type:String, required:true, ref:'Specie' },
    name: {type:String, required:true },
    description: {type:String},
    createdBy: {type:mongoose.Types.ObjectId, required:false,ref:'User'},
    lastUpdatedBy: {type:mongoose.Types.ObjectId, required:false,ref:'User'},
    medias: [MediaSchema]
},{
    timestamps:true,
})

export default mongoose.model<IPhase>('Phase',PhaseSchema)