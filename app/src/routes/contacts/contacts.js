"use strict";

const express = require("express");
const router = express.Router();

// const cookieParser = require("cookie-parser");

const {
  getAllContacts,
  createContact,
  getContact,
  updateContact,
  deleteContact,
  addContactForm,
  searchContacts,
  getProgress,
  addProgress,
  updateProgress,
  deleteProgress,
} = require("./contacts.ctrl");

// router.use(cookieParser());

router.route("/search").get(searchContacts);
router.route("/").get(getAllContacts);
router.route("/add").get(addContactForm).post(createContact);
router.route("/:id").get(getContact).put(updateContact).delete(deleteContact);

router
  .route("/progress/:id")
  .get((req, res) => {
    const student_id = req.params.id;
    getProgress(student_id, res); // 여기서 res 객체를 전달
  })
  .post(addProgress)
  .put(updateProgress)
  .delete(deleteProgress);

module.exports = router;
