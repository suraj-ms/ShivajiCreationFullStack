const BigPromise = require("../middlewares/bigPromise");
const cookieToken = require("../utils/cookieToken");
const User = require("../model/user")
const bcrypt = require("bcryptjs");

exports.signup = BigPromise(async (req, res, next) => {

    const { userName, password } = req.body;

    if (!userName || !password) {
        const missingField = !userName ? "User Name" : "Password";
        return res.status(400).json({ success: false, message: `${missingField} is required` });
    }

    const existingUser = await User.findOne({ userName });
    if (existingUser) {
        return res.status(409).json({ success: false, message: 'Username already exists' });
    }

    const user = await User.create({
        userName,
        password,
    });

    cookieToken(user, res);
});

exports.login = BigPromise(async (req, res, next) => {
    const { userName, password } = req.body;
   
    // check for presence of email and password
    if (!userName || !password) {     
        return res.status(400).json({ success: false, message:  `please provide User Name and password` });
    }

    // get user from DB
    const user = await User.findOne({ userName }).select("+password");

    // if user not found in DB
    // In the backend (userControllers.js or similar)
    if (!user) {
        return res.status(401).json({ success: false, message: 'Username or password does not match or exist' });
    }

    // match the password
    const isPasswordCorrect = await user.isValidatedPassword(password);

    //if password do not match
    if (!isPasswordCorrect) {
        return res.status(401).json({ success: false, message:  `password does not match or exist` });
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
        return res.status(400).json({ success: false, message:  `Please provide a new password` });
    }

    const user = await User.findOne({ userName });

    if (!user) {
        return res.status(404).json({ success: false, message:  `userName not found as registered` });
    }

    if (secretKey === process.env.FORGOT_PASSWORD_SECRET_KEY) {
        user.password = newPassword;
        await user.save();

        res.status(200).json({
            success: true,
            message: "Password updated successfully",
        });

    } else {
        return res.status(401).json({ success: false, message:  `secretKey does not match or exist` });
    }
});

exports.updateUserDetails = BigPromise(async (req, res, next) => {
    const { userName, password } = req.body;

    if (!userName || !password) {
        return res.status(400).json({ success: false, message:  `Please provide both username and password` });

    }

    // Find the user
    const user = await User.findOne({ userName });

    if (!user) {
        return res.status(404).json({ success: false, message:  `User not found` });

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
        return res.status(404).json({ success: false, message:  `No user found` });

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
        return res.status(401).json({
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
        return res.status(404).json({ success: false, message:  `User not found` });

    }

    // remove user from database
    await User.deleteOne({ _id: userId });

    res.status(200).json({
        success: true,
    });
});
