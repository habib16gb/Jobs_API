const mongoose = require("mongoose");

const connectDB = (url) => {
  console.log(`DB Connected Success ...`.bgCyan.bold);
  return mongoose.connect(url, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
  });
};

module.exports = connectDB;
