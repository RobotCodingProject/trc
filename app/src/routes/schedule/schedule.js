"use strict";

const express = require("express");
const router = express.Router();
const calendar = require("./schedule.ctrl");

router.get("/", calendar);

module.exports = router;
