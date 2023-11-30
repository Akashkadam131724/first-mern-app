const mongoose = require("mongoose");

const URI = process.env.MONGO_URI;

const connectDb = async () => {
  try {
    await mongoose.connect(URI);
    console.log("connection established");
  } catch (error) {
    console.error("Connection failed to DB:", error);
    process.exit(0);
  }
};

module.exports = connectDb;
