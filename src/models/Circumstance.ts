import mongoose,{Schema,SchemaTypeOptions} from 'mongoose'
import { MediaSchema } from './Processogram'


export interface ICircumstance extends mongoose.Document {
    name:string
    specie:string
    description?:string
    createdBy?:string
    lastUpdatedBy?:string
    medias: SchemaTypeOptions<any> | Schema
}

const CircumstanceSchema : Schema = new mongoose.Schema({
    specie:{ type:String, required:true, ref:'Specie' },
    name: {type:String, required:true,immutable:true },
    alternative_name:{type:String,required:false},
    description: {type:String},
    createdBy: {type:mongoose.Types.ObjectId, required:false,ref:'User'},
    lastUpdatedBy: {type:mongoose.Types.ObjectId, required:false,ref:'User'},
    medias: [MediaSchema]
},{
    timestamps:true,
})

export default mongoose.model<ICircumstance>('Circumstance',CircumstanceSchema)