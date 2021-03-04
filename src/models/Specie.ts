import mongoose,{Schema} from 'mongoose'


export interface ISpecie extends mongoose.Document {
    _id:string
    description?:string
    common_names?:string[]
    genus_name?:string
    specific_name:string
    global_population?:string
    createdBy?:string
    lastUpdatedBy?:string
    name_synonyms:string[]
}

const SpecieSchema : Schema = new mongoose.Schema({
    _id: {type:String, required:true},
    description:{ type:String },
    specific_name: { type: String },
    name_synonyms: [String],
    genus_name: { type: String },
    common_names: [String],
    global_population:{type:String},
    createdBy: {type:mongoose.Types.ObjectId, required:false,ref:'User'},
    lastUpdatedBy: {type:mongoose.Types.ObjectId, required:false,ref:'User'}
},{
    timestamps:true,
})

export default mongoose.model<ISpecie>('Specie',SpecieSchema)