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
        res.render("contacts/index", { contacts, query: "" });
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
// @route POST /contacts/add
const createContact = asyncHandler(async (req, res) => {
  const {
    // id,
    student_name,
    school_name,
    school_year,
    email,
    parent_name,
    contact_number,
    trial_date_time,
    ndis,
    class_day,
    class_time,
    // memo_note,
  } = req.body;

  if (!student_name || !contact_number) {
    return res.status(400).send({ error: "Required fields are missing" });
  }

  try {
    await Contact.save({
      // id,
      student_name,
      school_name,
      school_year,
      email,
      parent_name,
      contact_number,
      trial_date_time,
      ndis,
      class_day,
      class_time,
      // memo_note,
    });
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
      } else {
        contact.class_day = contact.class_day || [];
        res.render("contacts/update", { contact });
      }
    });
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
});

// @desc Update contact
// @route PUT /contacts/:id
const updateContact = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const {
    student_name,
    school_name,
    school_year,
    email,
    parent_name,
    contact_number,
    trial_date_time,
    ndis,
    class_day,
    class_time,
    // memo_note,
  } = req.body;

  if (!student_name || !contact_number) {
    const error = new Error("Required fields are missing");
    error.status = 400;
    return next(error);
  }

  try {
    const updatedContact = await Contact.updateContact(id, {
      student_name,
      school_name,
      school_year,
      email,
      parent_name,
      contact_number,
      trial_date_time,
      ndis,
      class_day: class_day,
      class_time,
      // memo_note,
    });
    if (!updatedContact) {
      const error = new Error("Student not found");
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
      const error = new Error("Student not found");
      error.status = 404;
      return next(error);
    }
    res.redirect("/contacts");
  } catch (err) {
    return next(err); // Pass any unexpected errors to the error handler
  }
});

// @desc Search contacts
// @route GET /contacts/search
const searchContacts = asyncHandler(async (req, res) => {
  const { query } = req.query;

  if (!query || query.trim() === "") {
    return res.redirect("/contacts");
  }

  Contact.searchContacts(query, (err, contacts) => {
    if (err || !contacts.length) {
      res.render("contacts/index", {
        contacts: [],
        query,
        error: "No results found",
      });
    } else {
      res.render("contacts/index", { contacts, query });
    }
  });
});

module.exports = {
  getAllContacts,
  createContact,
  getContact,
  updateContact,
  deleteContact,
  addContactForm,
  searchContacts,
};
