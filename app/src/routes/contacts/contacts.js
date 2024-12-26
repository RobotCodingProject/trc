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
} = require("./contacts.ctrl");

// router.use(cookieParser());

router.get("/", getAllContacts);
router.get("/add", addContactForm);
router.post("/add", createContact);
router.get("/:id", getContact);
router.put("/:id", updateContact);
router.delete("/:id", deleteContact);

module.exports = router;
