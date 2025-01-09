"use strict";

const asyncHandler = require("express-async-handler");

const calendar = asyncHandler(async (req, res) => {
  try {
    const schedule = [];
    res.render("schedule/index", { schedule });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

module.exports = calendar;
