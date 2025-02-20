"use strict";

const asyncHandler = require("express-async-handler");

// const calendar = asyncHandler(async (req, res) => {
//   try {
//     const schedule = [];
//     res.render("schedule/index", { schedule });
//   } catch (error) {
//     res.status(500).send({ error: error.message });
//   }
// });

// module.exports = calendar;

const Schedule = require("../../models/Schedule");

// @desc Get all schedule
// @route GET /schedule
const getAllSchedule = asyncHandler(async (req, res) => {
  try {
    Schedule.getAllSchedule((err, schedule) => {
      if (err) {
        res.status(500).send({ error: err.message });
      } else {
        res.render("schedule/index", { schedule, query: "" });
      }
    });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

// @desc View add schedule form
// @route GET /schedule/add
const addScheduleForm = asyncHandler((req, res) => {
  res.render("schedule/add");
});

// @desc Create a schedule
// @route POST /schedule/add
const createSchedule = asyncHandler(async (req, res) => {
  const {
    // id,
    category,
    start_date,
    end_date,
    start_time,
    end_time,
    all_day,
    teacher,
    memo,
  } = req.body;

  if (
    !category ||
    !start_date ||
    !end_date ||
    !start_time ||
    !end_time ||
    !all_day ||
    !teacher ||
    !memo
  ) {
    return res.status(400).send({ error: "Required fields are missing" });
  }

  try {
    await Schedule.save({
      // id,
      category,
      start_date,
      end_date,
      start_time,
      end_time,
      all_day,
      teacher,
      memo,
    });
    res.redirect("/schedule");
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
});

// @desc Get schedule
// @route GET /schedule/:id
const getSchedule = asyncHandler(async (req, res) => {
  const { id } = req.params;
  try {
    Schedule.getScheduleInfo(id, (err, schedule) => {
      if (err || !schedule) {
        res.status(404).send({ error: "Schedule not found" });
      } else {
        res.render("schedule/update", { schedule });
      }
    });
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
});

// @desc Update schedule
// @route PUT /schedule/:id
const updateSchedule = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const {
    category,
    start_date,
    end_date,
    start_time,
    end_time,
    all_day,
    teacher,
    memo,
  } = req.body;

  if (
    !category ||
    !start_date ||
    !end_date ||
    !start_time ||
    !end_time ||
    !all_day ||
    !teacher ||
    !memo
  ) {
    const error = new Error("Required fields are missing");
    error.status = 400;
    return next(error);
  }

  try {
    const updatedSchedule = await Schedule.updatedSchedule(id, {
      // schedule_name,
      category,
      start_date,
      end_date,
      start_time,
      end_time,
      all_day,
      teacher,
      memo,
    });
    if (!updatedSchedule) {
      const error = new Error("Schedule not found");
      error.status = 404;
      return next(error);
    }
    res.redirect("/schedule");
  } catch (err) {
    return next(err); // Pass any unexpected errors to the error handler
  }
});

// @desc Delete schedule
// @route DELETE /schedule/:id
const deleteSchedule = asyncHandler(async (req, res, next) => {
  const { id } = req.params;

  try {
    const deletedSchedule = await Schedule.deleteSchedule(id);
    if (!deletedSchedule) {
      const error = new Error("Schedule not found");
      error.status = 404;
      return next(error);
    }
    res.redirect("/schedule");
  } catch (err) {
    return next(err); // Pass any unexpected errors to the error handler
  }
});

module.exports = {
  getAllSchedule,
  createSchedule,
  getSchedule,
  updateSchedule,
  deleteSchedule,
  addScheduleForm,
};
