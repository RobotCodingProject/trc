"use strict";

const express = require("express");
const router = express.Router();
// const calendar = require("./schedule.ctrl");

const {
  getAllSchedule,
  createSchedule,
  getSchedule,
  updateSchedule,
  deleteSchedule,
  addScheduleForm,
  //   calendar,
} = require("./schedule.ctrl");

// router.get("/", calendar);
router.route("/").get(getAllSchedule);
router.route("/add").get(addScheduleForm).post(createSchedule);
router
  .route("/:id")
  .get(getSchedule)
  .put(updateSchedule)
  .delete(deleteSchedule);

module.exports = router;
