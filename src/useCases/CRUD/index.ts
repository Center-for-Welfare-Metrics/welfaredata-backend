import mongoose,{Document, Query, Schema} from 'mongoose'
import { assignValues,assignFindQuery } from '@/helpers/object'

interface ICreate {
    values:any
    Model:mongoose.Model<any>
}


export const CREATE = ({values,Model}:ICreate) => {
    const valid_values = assignValues(values)
    const ANY = new Model(valid_values)
    return ANY.save()
}


//------------------------------------------------------------------------------------------------------------


interface IRead {
    skip:any
    limit:any
    query:any
    Model:mongoose.Model<any>
    isId?:string[]
    exclude?:any,
    populate?:string[]
}

export const READ = ({
    skip,
    limit,
    query,
    Model,
    isId,
    exclude,
    populate
}:IRead) => {
    let skipToNumber = (Number(skip) || 0)
    let limitToNumber = (Number(limit) || 0)
    query = assignValues(query)
    query = assignFindQuery(query,isId)
    return Model.find(query,exclude,{skip:skipToNumber,limit:limitToNumber}).populate(populate?.join(''))
}



//------------------------------------------------------------------------------------------------------------



interface IReadById{
    _id:string
    Model:mongoose.Model<any>
}

export const READ_ONE_BY_ID = ({_id,Model}:IReadById) => {
    return Model.findById(_id)
}



//------------------------------------------------------------------------------------------------------------


interface IReadOne{
    query:any
    Model:mongoose.Model<any>
    populate?:string[]
}


export const READ_ONE = ({query,Model,populate}:IReadOne) => {
    return Model.findOne(query).populate(populate?.join(''))
}


//------------------------------------------------------------------------------------------------------------



interface IUpdate extends ICreate {
    _id:string
}


export const UPDATE = ({values,Model,_id}:IUpdate) => {
    values = assignValues(values)
    return Model.findByIdAndUpdate(_id,{$set:values},{new:true})
}

// interface IPatchUpdate extends ICreate {
//     id_tree:any,
//     values:any
// }

// export const PATCH_UPDATE = ({values,Model,id_tree}:IPatchUpdate) => {
//     values = assignValues(values)
//     console.log(id_tree)
//     return Model.updateOne(id_tree,{$set:values},{new:true})
// }



//------------------------------------------------------------------------------------------------------------



interface IDeleteById{
    _id:string
    Model:mongoose.Model<any>
}

export const DELETE_BY_ID = ({_id,Model}:IDeleteById) => {
    return Model.findByIdAndRemove(_id)
}