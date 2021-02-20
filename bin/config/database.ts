const mongoose = require('mongoose')

export default () => {
  // Database connection
  mongoose.connect(process.env.MONGO_CONNECTION_URL,
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex:true,
      useFindAndModify:false
    }, (err:any) => {
      if (err) {
        console.error(err)
      }
      else {
        console.info("Mongo connected")
      }
    })
}