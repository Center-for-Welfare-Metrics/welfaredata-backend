


export const assignValues = (object:any) => {
    let new_object:any = {}
    Object.keys(object).forEach((key) => {
        if(object[key]){
            new_object[key] = object[key]
        }
    })
    return new_object
}



export const assignFindQuery = (object:any,isiD:string[]=[]) => {
    let new_object:any = {}
    Object.keys(object).forEach((key) => {
        let object_value = object[key]
        if(isiD.includes(key)){
            new_object[key] = object_value
        }else{
            new_object[key] = {
                $regex: object_value,
                $options: 'i'
            }
        }
    })
    return new_object
}