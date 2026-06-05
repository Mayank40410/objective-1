import mongoose from "mongoose";

const connectDB = async () => {
  try {

    const conn = await mongoose.connect(process.env.MONGO_URI);

    console.log("MongoDB Connected Successfully");
    console.log(conn.connection.host);

  } catch (error) {

    console.log(
      "MongoDB connection error:",
      error.message
    );

  }
};

export default connectDB;