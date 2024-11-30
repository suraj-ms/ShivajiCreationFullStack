const app = require("./app");
require('dotenv').config({
  path: process.env.NODE_ENV === 'production' ? '.env.production' : '.env.development'
});
const connectWithDb = require("./config/db");


if (process.env.NODE_ENV === 'development') {
  console.log('Running env in development mode');
} else {
  console.log('Running env in production mode');
}

// connect with databases
connectWithDb();

app.get("/", (req, res) => {
  res.send("Hello");
});

app.listen(process.env.PORT, () => {
  console.log(`Server is running at port: ${process.env.PORT}`);
});