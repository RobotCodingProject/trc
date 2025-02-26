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
      else {
        // Split the comma-separated string back into an array
        if (data[0] && data[0].class_day) {
          data[0].class_day = data[0].class_day.split(", "); // Convert to array
        }
        callback(null, data[0]);
      }
    });
  }

  static save(contactInfo) {
    return new Promise((resolve, reject) => {
      const query =
        "INSERT INTO contacts (status, student_name, school_name, school_year, email, parent_name, contact_number, ndis, class_day, start_time, end_time, memo) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
      db.query(
        query,
        [
          contactInfo.status,
          contactInfo.student_name,
          contactInfo.school_name,
          contactInfo.school_year,
          contactInfo.email,
          contactInfo.parent_name,
          contactInfo.contact_number,
          contactInfo.ndis,
          contactInfo.class_day ? contactInfo.class_day.join(", ") : "",
          contactInfo.start_time,
          contactInfo.end_time,
          contactInfo.memo,
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
        "UPDATE contacts SET status = ?, student_name = ?, school_name = ?, school_year = ?, email = ?, parent_name = ?, contact_number = ?, ndis = ?, class_day = ?, start_time = ?, end_time = ?, memo =? WHERE student_id = ?";
      db.query(
        query,
        [
          contactInfo.status,
          contactInfo.student_name,
          contactInfo.school_name,
          contactInfo.school_year,
          contactInfo.email,
          contactInfo.parent_name,
          contactInfo.contact_number,
          contactInfo.ndis,
          contactInfo.class_day ? contactInfo.class_day.join(", ") : "",
          contactInfo.start_time,
          contactInfo.end_time,
          contactInfo.memo,
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

  static filterContactsByStatus(status, callback) {
    const query = "SELECT * FROM contacts WHERE status = ?";
    db.query(query, [status], (err, results) => {
      if (err) {
        console.error("Error executing filter query:", err);
        return callback(err, null);
      }
      callback(null, results);
    });
  }
}

module.exports = Contact;
