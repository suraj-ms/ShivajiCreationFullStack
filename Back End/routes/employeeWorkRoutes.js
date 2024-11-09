const express = require("express");

const { isLoggedIn, customRole } = require("../middlewares/UserMiddleware");
const { createWorkLog, deleteEmployeeWork, getWorkLogsByWeek,
    getEmployeeWorkLogsByDateRange, updateWorkLog
 } = require("../controllers/employeeWorkController");

const router = express.Router();

router.route("/createWorkLog").post(isLoggedIn, customRole('manager', 'admin'), createWorkLog);
router.route("/deleteEmployeeWork/:workLogId").delete(isLoggedIn, customRole('manager', 'admin'), deleteEmployeeWork) 
router.route("/getWorkLogsByWeek").get(isLoggedIn, getWorkLogsByWeek) 
router.route("/getEmployeeWorkLogsByDateRange/:employeeId").get(isLoggedIn, getEmployeeWorkLogsByDateRange) 
router.route("/updateWorkLog/:employeeId/:workLogId").put(isLoggedIn, customRole('manager', 'admin'), updateWorkLog) 



module.exports = router;