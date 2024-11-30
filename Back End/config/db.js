const mongoose = require("mongoose");

const connectWithDb = () => {
  if (process.env.NODE_ENV === 'development') {
    console.log(`Running db in ${process.env.NODE_ENV} mode`);
  } else if (process.env.NODE_ENV === 'production') {
    console.log(`Running db in ${process.env.NODE_ENV} mode`);
  }
  mongoose
    .connect(process.env.DB_URL)
    .then(console.log(`DB GOT CONNECTED`))
    .catch((error) => {
      console.log(`DB CONNECTION ISSUES`);
      console.log(error);
      process.exit(1);
    });
};

module.exports = connectWithDb;