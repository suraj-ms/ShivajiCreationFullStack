const { login, signup, logout, forgotPassword,
     updateUserDetails, adminAllUser, admingetOneUser,
     adminUpdateOneUserDetails,
     adminDeleteOneUser, } = require("../controllers/userControllers");
     
const express = require("express");

const { isLoggedIn, customRole } = require("../middlewares/UserMiddleware");

const router = express.Router();


router.route("/signup").post(signup);
router.route("/login").post(login);
router.route("/logout").post(logout);
router.route("/admin/forgotPassword").post(isLoggedIn, customRole("admin"), forgotPassword);
router.route("/updateUserDetails").post(isLoggedIn, customRole("admin"), updateUserDetails);
router.route("/admin/adminAllUser").get(isLoggedIn, customRole("admin"), adminAllUser);
router.route("/admin/adminUpdateOneUserDetails").post(isLoggedIn, customRole("admin"), adminUpdateOneUserDetails);
router.route("/admin/admingetOneUser/:userName").get(isLoggedIn, customRole("admin"), admingetOneUser)
router.route("/admin/adminDeleteOneUser/:userId").delete(adminDeleteOneUser);


module.exports = router;