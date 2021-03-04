import mongoose,{Schema, SchemaTypeOptions} from 'mongoose'

export interface ICommonInformations {
    name: SchemaTypeOptions<any> | Schema
    description: SchemaTypeOptions<any> | Schema
    medias: SchemaTypeOptions<any> | Schema
}

const CommonInformations : ICommonInformations = {
    name: {type:String, required:false },
    description: { type:String, required:false },
    medias: [{
        name:{ type:String, required:false },
        description:{ type:String, required:false },
        url:{type:String, required:true }
    }]
}

export interface IProcessogram extends mongoose.Document {
    name?:string
    description:string
    specie:string
    productionSystem:string
    lifefates?:any[]
    phases?:any[]
    circumstances?:any[]
}

const ProcessogramSchema : Schema = new mongoose.Schema({
    specie:{ type:String, required:true, ref:'Specie' },
    productionSystem:{ type:mongoose.Types.ObjectId, required:true,ref:'ProductionSystem' },
    ...CommonInformations,
    lifefates:[{
        lifeFate: { type:mongoose.Types.ObjectId, required:true,ref:'LifeFate' },
        ...CommonInformations,
        phases:[{
            phase: { type:mongoose.Types.ObjectId, required:true,ref:'Phase' },
            ...CommonInformations,
            circumstances:[{
                circumstance: { type:mongoose.Types.ObjectId, required:true,ref:'Circumstance' },
                ...CommonInformations,
            }]
        }]
    }]
},{
    timestamps:true,
    strict:false
})

export default mongoose.model<IProcessogram>('Processogram',ProcessogramSchema)