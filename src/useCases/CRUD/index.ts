import mongoose,{Document, Query, Schema} from 'mongoose'
import { assignValues,assignFindQuery } from '@/helpers/object'

interface ICreate {
    values:any
    AnyModel:mongoose.Model<any>
}


export const CREATE = ({values,AnyModel}:ICreate) => {
    const valid_values = assignValues(values)
    const ANY = new AnyModel(valid_values)
    return ANY.save()
}

interface IRead {
    skip:any
    limit:any
    query:any
    AnyModel:mongoose.Model<any>
    isId?:string[]
    exclude?:any,
    populate?:string[]
}

export const READ = ({
    skip,
    limit,
    query,
    AnyModel,
    isId,
    exclude,
    populate
}:IRead) => {
    let skipToNumber = (Number(skip) || 0)
    let limitToNumber = (Number(limit) || 0)
    query = assignValues(query)
    query = assignFindQuery(query,isId)
    return AnyModel.find(query,exclude,{skip:skipToNumber,limit:limitToNumber}).populate(populate?.join(''))
}

interface IReadById{
    _id:string
    AnyModel:mongoose.Model<any>
}

export const READ_ONE_BY_ID = ({_id,AnyModel}:IReadById) => {
    return AnyModel.findById(_id)
}

interface IUpdate extends ICreate {
    _id:string
}

export const UPDATE = ({values,AnyModel,_id}:IUpdate) => {
    console.log(_id)
    values = assignValues(values)
    return AnyModel.findByIdAndUpdate(_id,{$set:values},{new:true})
}

interface IDeleteById{
    _id:string
    AnyModel:mongoose.Model<any>
}

export const DELETE_BY_ID = ({_id,AnyModel}:IDeleteById) => {
    return AnyModel.findByIdAndRemove(_id)
}