import mongoose,{Schema,SchemaTypeOptions} from 'mongoose'


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
    name: {type:String, required:true,unique:true},
    description: {type:String},
    createdBy: {type:mongoose.Types.ObjectId, required:false,ref:'User'},
    lastUpdatedBy: {type:mongoose.Types.ObjectId, required:false,ref:'User'},
    medias: [{
        name:{ type:String, required:false },
        description:{ type:String, required:false },
        url:{type:String, required:true }
    }]
},{
    timestamps:true,
})

export default mongoose.model<ICircumstance>('Circumstance',CircumstanceSchema)