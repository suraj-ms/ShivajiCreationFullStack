const app = require("./app");
require("dotenv").config();
const connectWithDb = require("./config/db");

// connect with databases
connectWithDb();

app.get("/", (req, res) => {
    res.send("Hello");
  });

app.listen(process.env.PORT, () => {
    console.log(`Server is running at port: ${process.env.PORT}`);
  });