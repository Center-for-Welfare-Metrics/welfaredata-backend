import mongoose,{Schema,SchemaTypeOptions} from 'mongoose'

export interface IProductionSystem extends mongoose.Document {
    name:string
    specie:string
    description?:string
    global_population?:string
    name_synonyms?:string[]
    createdBy?:string
    lastUpdatedBy?:string
    medias: SchemaTypeOptions<any> | Schema
}

const ProductionSystemSchema : Schema = new mongoose.Schema({
    specie:{ type:String, required:true, ref:'Specie' },
    name: {type:String, required:true,unique:true},
    description: {type:String},
    global_population: {type:String},
    name_synonyms:[String],
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


export default mongoose.model<IProductionSystem>('ProductionSystem',ProductionSystemSchema)