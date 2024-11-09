const express = require("express");

const { isLoggedIn, customRole } = require("../middlewares/UserMiddleware");
const { createEmp, updateEmp, deleteEmp, getSingleEmp, getAllEmp } = require("../controllers/employeesController");

const router = express.Router();

router.route("/createEmployee").post(isLoggedIn, customRole('manager', 'admin'), createEmp);
router.route("/updateEmp/:empid").put(isLoggedIn, customRole('manager', 'admin'), updateEmp)
router.route("/deleteEmp/:empid").delete(isLoggedIn, customRole('manager', 'admin'), deleteEmp)
router.route("/getSingleEmp/:empid").get(isLoggedIn, getSingleEmp); 

router.route("/getAllEmp").get(isLoggedIn, getAllEmp)


module.exports = router;