const BigPromise = require("../middlewares/bigPromise");
const CustomError = require("../utils/CustomError ");
const cookieToken = require("../utils/cookieToken");
const User = require("../model/user")
const crypto = require("crypto");
const bcrypt = require("bcryptjs");

exports.signup = BigPromise(async (req, res, next) => {

    const { userName, password } = req.body;

    if (!userName || !password) {
        const missingField = !userName ? "User Name" : "Password";
        return next(new CustomError(`${missingField} is required`, 400));
    }

    const existingUser = await User.findOne({ userName });
    if (existingUser) {
        return next(new CustomError("Username already exists", 400));
    }

    const user = await User.create({
        userName,
        password,
    });

    cookieToken(user, res);
});

exports.login = BigPromise(async (req, res, next) => {
    console.log(req.body);
    const { userName, password } = req.body;

    // check for presence of email and password
    if (!userName || !password) {
        return next(new CustomError("please provide User Name and password", 400));
    }

    // get user from DB
    const user = await User.findOne({ userName }).select("+password");

    // if user not found in DB
    if (!user) {
        return next(
            new CustomError("User Name or password does not match or exist", 400)
        );
    }

    // match the password
    const isPasswordCorrect = await user.isValidatedPassword(password);

    //if password do not match
    if (!isPasswordCorrect) {
        return next(
            new CustomError("Username or password does not match or exist", 400)
        );
    }

    // if all goes good and we send the token
    cookieToken(user, res);
});


exports.logout = BigPromise(async (req, res, next) => {
    //clear the cookie
    res.cookie("token", null, {
        expires: new Date(Date.now()),
        httpOnly: true,
    });
    //send JSON response for success
    res.status(200).json({
        succes: true,
        message: "Logout success",
    });
});


exports.forgotPassword = BigPromise(async (req, res, next) => {
    const { userName, secretKey, newPassword } = req.body;

    // Check if newPassword is provided
    if (!newPassword) {
        return next(new CustomError("Please provide a new password", 400));
    }

    const user = await User.findOne({ userName });

    if (!user) {
        return next(new CustomError("userName not found as registered", 400));
    }

    if (secretKey === process.env.FORGOT_PASSWORD_SECRET_KEY) {
        user.password = newPassword;
        await user.save();

        res.status(200).json({
            success: true,
            message: "Password updated successfully",
        });

    } else {
        return next(
            new CustomError("secretKey does not match or exist", 400)
        );
    }
});

exports.updateUserDetails = BigPromise(async (req, res, next) => {
    const { userName, password } = req.body;

    if (!userName || !password) {
        return next(new CustomError("Please provide both username and password", 400));
    }

    // Find the user
    const user = await User.findOne({ userName });

    if (!user) {
        return next(new CustomError("User not found", 404));
    }

    // Update the user fields
    user.userName = userName;
    user.password = password;

    // Save the user to trigger the 'pre' save middleware
    await user.save();

    res.status(200).json({
        success: true,
        user,
    });
});

exports.adminAllUser = BigPromise(async (req, res, next) => {
    // select all users
    const users = await User.find();

    // send all users
    res.status(200).json({
        success: true,
        users,
    });
});

exports.admingetOneUser = BigPromise(async (req, res, next) => {
    // get userName from url and find user in database
    const user = await User.findOne({ userName: req.params.userName });

    if (!user) {
        return next(new CustomError("No user found", 400));
    }

    // send user data
    res.status(200).json({
        success: true,
        user,
    });
});


exports.adminUpdateOneUserDetails = BigPromise(async (req, res, next) => {
    const { userName, password, role } = req.body;

    if (!userName) {
        return res.status(400).json({
            success: false,
            message: "Please provide userName, email, and name."
        });
    }

    // Create new data object for the update
    const newData = {
        userName,
        role,
    };

    // If a password is provided, hash it before updating
    if (password) {
        newData.password = await bcrypt.hash(password, 10);
    }

    // Find the user by userName and update their details
    const user = await User.findOneAndUpdate({ userName }, newData, {
        new: true,
        runValidators: true,
        useFindAndModify: false,
    });

    if (!user) {
        return res.status(404).json({
            success: false,
            message: "User not found."
        });
    }

    res.status(200).json({
        success: true,
        data: user, // Optionally return the updated user data
    });
});


exports.adminDeleteOneUser = BigPromise(async (req, res, next) => {

    const { userId } = req.params;
    
    const user = await User.findById(userId);

    if (!user) {
      return next(new CustomError("No such user found", 401));
    }
   
    // remove user from database
    await User.deleteOne({ _id: userId });
  
    res.status(200).json({
      success: true,
    });
  });
  