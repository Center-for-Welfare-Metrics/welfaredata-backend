import AWS from 'aws-sdk'

const s3 = new AWS.S3()

const encode = (data:any) => {
    let buffer = Buffer.from(data)
    let base64 = buffer.toString('base64')
    return base64
}

export const upload = (disk:string,file_name:string) => {
    
}

export const download = (disk:string,file_name:string) => {
    return new Promise((resolve,reject) => {
        let key = `${disk}${file_name}`
        s3.getObject({
            Bucket:process.env.AWS_BUCKET_NAME!,
            Key:key
        }).promise()
        .then(({Body}) => {
            resolve(encode(Body))
        })
        .catch((error) => {
            reject(error)
        })
    })
}