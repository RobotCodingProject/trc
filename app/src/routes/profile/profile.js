"use strict";
const express = require("express");
const router = express.Router();
const profileController = require("./profile.ctrl");
// Route to display profile page
router.get("/", profileController.getProfile);
// Route to edit profile page
router.get("/edit", profileController.editProfile);
// Route to update profile (handle form submission)
router.post("/update", profileController.updateProfile);
module.exports = router;
