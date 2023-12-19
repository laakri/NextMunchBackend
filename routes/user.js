const express = require("express");
const bcrypt = require("bcrypt");
const User = require("../models/user");
const jwt = require("jsonwebtoken");
const router = express.Router();
const multer = require("multer");
const checkauth = require("../middleware/check-user");
const rateLimit = require("express-rate-limit");

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // limit each IP to 5 requests per windowMs
  message: "Too many login attempts, please try again later.",
});

/*************-Signup-********** */



router.post("/signup", async (req, res, next) => {
  try {
    const phoneExists = await User.exists({ phone: req.body.phone });
    if (phoneExists) {
      return res.status(409).json({
        error: 'phone already exists.',
        message: 'phone already exists.',
      });
    }

    const hash = await bcrypt.hash(req.body.password, 10);
    const user = new User({
      name: req.body.name,
      email: req.body.email,
      phone: req.body.phone,
      password: hash,
    });
    const result = await user.save();
    res.status(201).json({
      message: "User created!",
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      error: err,
      message: "An error occurred while creating the user.",
    });
  }
});

/*************-Login-********** */
router.post("/login", limiter, (req, res, next) => {
  let fetchedUser;

  User.findOne({ phone: req.body.phone })
    .then((user) => {
      if (!user) {
        throw new Error("Incorrect phone or password!");
      }

      fetchedUser = user;
      return bcrypt.compare(req.body.password, user.password);
    })
    .then((result) => {
      if (!result) {
        throw new Error("Incorrect phone or password!");
      }

      const token = jwt.sign(
        { email: fetchedUser.phone, userId: fetchedUser._id },
        "secret_this_should_be_longer_secret_this_should_be_longer_",
        { expiresIn: "1h" }
      );

      res.status(200).json({
        token: token,
        expiresIn: 3600,
        userId: fetchedUser._id,
        userName: fetchedUser.name,
        userPicture: fetchedUser.imgPath,
        userRole: fetchedUser.roles[0],
      });
    })
    .catch((err) => {
      console.error("Authentication error:", err);

      res.status(401).json({
        message: "Authentication failed. Incorrect phone or password.",
      });
    });
});

/***************-change-password-*******************/

router.post("/change-password", async (req, res) => {
  const { newPassword, email } = req.body;

  try {
    // Retrieve the user by email
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Compare the provided password with the stored hashed password
    const isPasswordMatch = await bcrypt.compare(newPassword, user.password);

    if (isPasswordMatch) {
      return res.status(400).json({
        message: "New password should be different from the old password",
      });
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update the user's password and save to the database
    user.password = hashedPassword;
    await user.save();

    res.status(200).json({ message: "Password updated successfully" });
  } catch (error) {
    console.error("Error updating password:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});
/*************-Get Users-********** */

router.get("/users", async (req, res, next) => {
  try {
    const users = await User.find({ }, { name: true, phone: true, email: true, roles: true }).populate();
    res.status(200).json({ users });
  } catch (err) {
    console.error("Error fetching users:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});

/***************-Delete-*******************/

router.delete("/delete/:id", async (req, res, next) => {
  try {
    console.log("Deleting user with ID:", req.params.id); // Add this line
    await User.findByIdAndDelete(req.params.id);
    res.status(200).json({
      message: "User Deleted seccesfully !",
      message: "User Deleted successfully!",
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      error: err,
    });
  }
});

 
module.exports = router;