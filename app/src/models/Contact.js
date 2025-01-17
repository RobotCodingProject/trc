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
      "INSERT INTO contacts (student_name, school_name, school_year, student_email, parent_name, contact_number, trial_date_time, ndis, class_day, class_time, memo_note) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
    db.query(
      query,
      [
        contactInfo.student_name,
        contactInfo.school_name,
        contactInfo.school_year,
        contactInfo.student_email,
        contactInfo.parent_name,
        contactInfo.contact_number,
        contactInfo.trial_date_time,
        contactInfo.ndis,
        contactInfo.class_day,
        contactInfo.class_time,
        contactInfo.memo_note,
      ],
      (err, result) => {
        if (err) reject(err);
        else resolve(result);
      }
    );
  });
}


  static updateContact(id, contactInfo) {
    return new Promise((resolve, reject) => {
      const query =
        "UPDATE contacts SET student_name = ?, school_name = ?, school_year = ?, student_email = ?, parent_name = ?, contact_number = ?, trial_date_time = ?, ndis = ?, class_day = ?, class_time = ?, memo_note = ? WHERE student_id = ?";
      db.query(
        query,
        [
          contactInfo.student_name,
          contactInfo.school_name,
          contactInfo.school_year,
          contactInfo.student_email,
          contactInfo.parent_name,
          contactInfo.contact_number,
          contactInfo.trial_date_time,
          contactInfo.ndis,
          contactInfo.class_day,
          contactInfo.class_time,
          contactInfo.memo_note,
          id,
        ],
        (err, result) => {
          if (err) reject(err);
          else resolve(result);
        }
      );
    });
  }

  static deleteContact(id) {
    return new Promise((resolve, reject) => {
      const query = "DELETE FROM contacts WHERE student_id = ?";
      db.query(query, [id], (err, result) => {
        if (err) reject(err);
        else resolve(result);
      });
    });
  }
}

module.exports = Contact;
