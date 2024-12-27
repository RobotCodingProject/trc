"use strict";

const db = require("../config/db");

class Contact {
  static getAllContacts(callback) {
    const query = "SELECT * FROM contacts";
    db.query(query, callback);
  }

  static getContactInfo(id, callback) {
    const query = "SELECT * FROM contacts WHERE id = ?";
    db.query(query, [id], (err, data) => {
      if (err) callback(err);
      else callback(null, data[0]);
    });
  }

  static save(contactInfo) {
    return new Promise((resolve, reject) => {
      const query =
        "INSERT INTO contacts (name, email, mobile) VALUES (?, ?, ?)";
      db.query(
        query,
        [contactInfo.name, contactInfo.email, contactInfo.mobile],
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
        "UPDATE contacts SET name = ?, email = ?, mobile = ? WHERE id = ?";
      db.query(
        query,
        [contactInfo.name, contactInfo.email, contactInfo.mobile, id],
        (err, result) => {
          if (err) reject(err);
          else resolve(result);
        }
      );
    });
  }

  static deleteContact(id) {
    return new Promise((resolve, reject) => {
      const query = "DELETE FROM contacts WHERE id = ?";
      db.query(query, [id], (err, result) => {
        if (err) reject(err);
        else resolve(result);
      });
    });
  }
}

module.exports = Contact;
