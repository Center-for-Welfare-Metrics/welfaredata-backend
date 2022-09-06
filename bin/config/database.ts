const mongoose = require("mongoose");

export default () => {
  // Database connection
  mongoose.connect(process.env.MONGO_CONNECTION_URL, {}, (err: any) => {
    if (err) {
      console.error(err);
    } else {
      console.info("Mongo connected");
    }
  });
};
