"use strict";

const db = require("../config/db");

class Contact {
  static getAllContacts(callback) {
    const query = "SELECT * FROM contacts";
    db.query(query, callback);
  }

  static getContactInfo(id, callback) {
    const query = "SELECT * FROM contacts WHERE student_id = ?";
    db.query(query, [id], (err, data) => {
      if (err) callback(err);
      else callback(null, data[0]);
    });
  }

  static save(contactInfo) {
    return new Promise((resolve, reject) => {
      const query =
        "INSERT INTO contacts (student_name, school_name, school_year, email, parent_name, contact_number, trial_date_time, ndis, class_day, class_time) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
      db.query(
        query,
        [
          contactInfo.student_name,
          contactInfo.school_name,
          contactInfo.school_year,
          contactInfo.email,
          contactInfo.parent_name,
          contactInfo.contact_number,
          contactInfo.trial_date_time,
          contactInfo.ndis,
          contactInfo.class_day,
          contactInfo.class_time,
          // contactInfo.memo_note,
        ],
        (err, result) => {
          if (err) reject(err);
          else resolve(result);
        }
      );
    });
  }

  static updateContact(student_id, contactInfo) {
    return new Promise((resolve, reject) => {
      const query =
        "UPDATE contacts SET student_name = ?, school_name = ?, school_year = ?, email = ?, parent_name = ?, contact_number = ?, trial_date_time = ?, ndis = ?, class_day = ?, class_time = ? WHERE student_id = ?";
      db.query(
        query,
        [
          contactInfo.student_name,
          contactInfo.school_name,
          contactInfo.school_year,
          contactInfo.email,
          contactInfo.parent_name,
          contactInfo.contact_number,
          contactInfo.trial_date_time,
          contactInfo.ndis,
          contactInfo.class_day,
          contactInfo.class_time,
          // contactInfo.memo_note,
          student_id,
        ],
        (err, result) => {
          if (err) reject(err);
          else resolve(result);
        }
      );
    });
  }

  static deleteContact(student_id) {
    return new Promise((resolve, reject) => {
      const query = "DELETE FROM contacts WHERE student_id = ?";
      db.query(query, [student_id], (err, result) => {
        if (err) reject(err);
        else resolve(result);
      });
    });
  }

  // @desc Search contacts
  static searchContacts(query, callback) {
    const searchQuery =
      "SELECT * FROM contacts WHERE LOWER(student_name) LIKE LOWER(?)";
    const queryParam = `%${query}%`;

    db.query(searchQuery, [queryParam], (err, results) => {
      if (err) {
        console.error("Error executing search query:", err);
        return callback(err, null);
      }
      callback(null, results);
    });
  }
}

module.exports = Contact;
