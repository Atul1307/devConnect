const mongoose = require('mongoose');

const connectDB = async () => {
  await mongoose.connect(
    'mongodb+srv://NamasteAtul:ll9BDyBfP0p7f7rr@namastenodebyatul.441pb.mongodb.net/devConnect'
  );
};

module.exports = connectDB;
