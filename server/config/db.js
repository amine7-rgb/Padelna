import mongoose from "mongoose";

export const isMongoConnected = () => mongoose.connection.readyState === 1;

export const connectMongo = async (mongoUri) => {
  if (!mongoUri || isMongoConnected()) {
    return false;
  }

  await mongoose.connect(mongoUri, { serverSelectionTimeoutMS: 5000 });
  return true;
};

