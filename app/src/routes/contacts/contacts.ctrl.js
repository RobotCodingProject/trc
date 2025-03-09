"use strict";

const asyncHandler = require("express-async-handler");
const Contact = require("../../models/Contact");

// @desc Get all contacts
// @route GET /contacts

const getAllContacts = asyncHandler(async (req, res) => {
  try {
    const status = req.query.status || ""; // 쿼리에서 status 값 가져오기, 없으면 빈 문자열로 설정

    // status 값이 있을 경우 필터링된 연락처를 가져오고, 없으면 모든 연락처를 가져옴
    if (status) {
      Contact.filterContactsByStatus(status, (err, contacts) => {
        if (err) {
          res.status(500).send({ error: err.message });
        } else {
          res.render("contacts/index", { contacts, query: "", status });
        }
      });
    } else {
      // status가 없는 경우, 모든 연락처를 가져옵니다.
      Contact.getAllContacts((err, contacts) => {
        if (err) {
          res.status(500).send({ error: err.message });
        } else {
          res.render("contacts/index", { contacts, query: "", status });
        }
      });
    }
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
    status,
    student_name,
    school_name,
    school_year,
    email,
    parent_name,
    contact_number,
    ndis,
    class_day,
    start_time,
    end_time,
    memo,
  } = req.body;

  if (!student_name) {
    return res.status(400).send({ error: "Required fields are missing" });
  }

  try {
    await Contact.save({
      // id,
      status,
      student_name,
      school_name,
      school_year,
      email,
      parent_name,
      contact_number,
      ndis,
      class_day,
      start_time,
      end_time,
      memo,
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
    status,
    student_name,
    school_name,
    school_year,
    email,
    parent_name,
    contact_number,
    ndis,
    class_day,
    start_time,
    end_time,
    memo,
  } = req.body;

  if (!student_name) {
    const error = new Error("Required fields are missing");
    error.status = 400;
    return next(error);
  }

  try {
    const updatedContact = await Contact.updateContact(id, {
      status,
      student_name,
      school_name,
      school_year,
      email,
      parent_name,
      contact_number,
      ndis,
      class_day,
      start_time,
      end_time,
      memo,
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

// @desc Student Progress
// @route GET /contacts/progress
const getProgress = (req, res) => {
  const student_id = req.params.id; // URL에서 student_id 가져오기

  const query = "SELECT * FROM progress WHERE student_id = ? ORDER BY date ASC";
  db.query(query, [student_id], (err, results) => {
    if (err) {
      return res.status(500).json({ error: "Database query error" });
    }

    // 데이터가 없으면 빈 배열을 반환
    res.json(results);
  });
};

// const getProgress = asyncHandler(async (req, res) => {
//   const { id } = req.params;
//   Contact.getProgress(id, (err, results) => {
//     if (err) return res.status(500).json({ error: err.message });
//     if (!results.length) {
//       return res
//         .status(404)
//         .json({ message: "No progress records found for this student." });
//     }
//     res.json(results);
//   });
// });

const addProgress = asyncHandler(async (req, res) => {
  const { id } = req.params;

  Contact.addProgress(id, req.body, (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.status(201).json({ message: "Progress added successfully", result });
  });
});

const updateProgress = asyncHandler(async (req, res) => {
  const { id } = req.params;

  Contact.updateProgress(id, req.body, (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Progress record not found." });
    }
    res.json({ message: "Progress updated successfully", result });
  });
});

const deleteProgress = asyncHandler(async (req, res) => {
  const { id } = req.params;

  Contact.deleteProgress(id, (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Progress record not found." });
    }
    res.json({ message: "Progress deleted successfully", result });
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
  getProgress,
  addProgress,
  updateProgress,
  deleteProgress,
};
