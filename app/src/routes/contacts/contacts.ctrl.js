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
  if (!id) {
    return res.status(400).json({ error: "Student ID is missing" });
  }
  try {
    Contact.getContactInfo(id, (err, c) => {
      if (err || !c) {
        res.status(404).send({ error: "Student not found" });
      } else {
        c.class_day = c.class_day || [];
        res.render("contacts/update", { c });
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
  if (!id) {
    return res.status(400).json({ error: "Student ID is missing" });
  }
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
// @route GET /contacts/progress/:id
const getProgress = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({ error: "Student ID is missing" });
  }
  try {
    // 학생 정보 가져오기 (이제 Promise 기반)
    const student = await Contact.getStudentById(id);
    if (!student) {
      return res.status(404).json({ error: "Student not found" });
    }
    // 학생의 진행 데이터 가져오기
    const progress = await Contact.getProgress(id);
    res.render("contacts/progress", {
      student, // 학생 정보
      progress: progress || [], // 진행 데이터
    });
  } catch (err) {
    console.error("Error fetching progress:", err);
    res.status(500).json({ error: err.message });
  }
});

const addProgress = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { date, day, start_time, end_time, robot, status, coding } = req.body;

  try {
    // 학생이 존재하는지 확인
    const student = await Contact.getStudentById(id);
    if (!student) {
      return res.status(404).send("Student not found");
    }

    // 새 진행 데이터 추가
    await Contact.addProgress(id, {
      date,
      day,
      start_time,
      end_time,
      robot,
      status,
      coding,
    });

    // 진행 데이터 저장 후, 해당 학생의 progress 페이지로 리다이렉트
    res.redirect(`/contacts/progress/${id}`);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
});

// const getProgress = asyncHandler(async (req, res) => {
//   const { id } = req.params;
//   try {
//     const results = await Contact.getProgress(id); // assuming getProgress returns a promise
//     if (!results || results.length === 0) {
//       return res
//         .status(404)
//         .json({ message: "No progress records found for this student." });
//     }
//     res.json(results);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });

//addProgress
// const addProgress = asyncHandler(async (req, res) => {
//   const { id } = req.params;

//   if (!id) {
//     return res.status(400).json({ error: "Student ID is missing" });
//   }

//   try {
//     // Contact에 progress 추가하는 로직
//     await Contact.addProgress(id, req.body);
//     res.status(201).json({ message: "Progress added successfully" });
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });

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

// const deleteProgress = asyncHandler(async (req, res, next) => {
//   const { id } = req.params;

//   try {
//     const result = Contact.deleteProgress(id);

//     if (result.affectedRows === 0) {
//       return res.status(404).json({ error: "Progress record not found" });
//     }

//     res.redirect("back"); // 현재 페이지 새로고침
//     // res.redirect(`/contacts/progress/${id}`);
//   } catch (err) {
//     next(err); // 에러 핸들러로 전달
//   }
// });

const deleteProgress = asyncHandler(async (req, res, next) => {
  const { id } = req.params;

  try {
    const deletedProgress = await Contact.deleteProgress(id);
    if (!deletedProgress) {
      const error = new Error("Progress not found");
      error.status = 404;
      return next(error);
    }
    res.redirect("back");
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
  searchContacts,
  getProgress,
  addProgress,
  updateProgress,
  deleteProgress,
};
