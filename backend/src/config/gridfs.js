const mongoose = require("mongoose");

let gridfsBucket;

const initializeGridFS = () => {
  gridfsBucket = new mongoose.mongo.GridFSBucket(
    mongoose.connection.db,
    {
      bucketName: "phoneImages",
    }
  );

  console.log("GridFS initialized");
};

const getGridFSBucket = () => {
  if (!gridfsBucket) {
    throw new Error("GridFS is not initialized");
  }

  return gridfsBucket;
};

module.exports = {
  initializeGridFS,
  getGridFSBucket,
};