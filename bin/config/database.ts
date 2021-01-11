const mongoose = require('mongoose')

module.exports = () => {
  // Database connection
  mongoose.connect(process.env.MONGO_CONNECTION_URL,
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex:true
      // useUnifiedTopology:true
    }, (err:any) => {
      if (err) {
        // Log the error
        console.error(err)
      }
      else {
        // Log success
        console.info("Mongo connected")
      }
    })
}