const express = require("express");
require("dotenv").config();
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const cors = require('cors');



//import all routes here
const userRouter = require("./routes/userRouter");
const customerRoutes = require("./routes/customerRoutes");
const itemPriceRouter = require("./routes/item&priceRouter");
const employeeRouter = require("./routes/employeeRouter");
const employeeWorkRoutes = require("./routes/employeeWorkRoutes");



const app = express();

//regular middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors());



//morgan middleware
app.use(morgan("tiny"));

// routers middleware
app.use("/api/v1", userRouter);
app.use("/api/v1", customerRoutes);
app.use("/api/v1", itemPriceRouter);
app.use("/api/v1", employeeRouter);
app.use("/api/v1", employeeWorkRoutes);

module.exports = app;

