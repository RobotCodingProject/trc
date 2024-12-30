"use strict";

const asyncHandler = require("express-async-handler");
const Contact = require("../../models/Contact");

// @desc Get all contacts
// @route GET /contacts
const getAllContacts = asyncHandler(async (req, res) => {
  try {
    Contact.getAllContacts((err, contacts) => {
      if (err) {
        res.status(500).send({ error: err.message });
      } else {
        res.render("contacts/index", { contacts });
      }
    });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

// @desc View add contact form
// @route GET /contacts/add
const addContactForm = asyncHandler((req, res) => {
  res.render("contacts/add");
});

// @desc Create a contact
// @route POST/contacts/add
const createContact = asyncHandler(async (req, res) => {
  const { name, email, mobile } = req.body;

  if (!name || !email || !mobile) {
    return res.status(400).send({ error: "All fields are required" });
  }

  try {
    await Contact.save({ name, email, mobile });
    res.redirect("/contacts");
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
});

// @desc Get contact
// @route GET /contacts/:id
const getContact = asyncHandler(async (req, res) => {
  const { id } = req.params;
  try {
    Contact.getContactInfo(id, (err, contact) => {
      if (err || !contact) {
        res.status(404).send({ error: "Student not found" });
      }
      res.render("contacts/update", { contact });
    });
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
});

// @desc Update contact
// @route PUT /contacts/:id
const updateContact = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const { name, email, mobile } = req.body;

  if (!name || !email || !mobile) {
    const error = new Error("All fields are required");
    error.status = 400;
    return next(error);
  }

  try {
    const updatedContact = await Contact.updateContact(id, {
      name,
      email,
      mobile,
    });
    if (!updatedContact) {
      const error = new Error("Contact not found");
      error.status = 404;
      return next(error);
    }
    res.redirect("/contacts");
  } catch (err) {
    return next(err); // Pass any unexpected errors to the error handler
  }
});

// @desc Delete contact
// @route DELETE /contacts/:id
const deleteContact = asyncHandler(async (req, res, next) => {
  const { id } = req.params;

  try {
    const deletedContact = await Contact.deleteContact(id);
    if (!deletedContact) {
      const error = new Error("Contact not found");
      error.status = 404;
      return next(error);
    }
    res.redirect("/contacts");
  } catch (err) {
    return next(err); // Pass any unexpected errors to the error handler
  }
});

module.exports = {
  getAllContacts,
  createContact,
  getContact,
  updateContact,
  deleteContact,
  addContactForm,
};
