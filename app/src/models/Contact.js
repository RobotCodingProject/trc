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
      // class_day가 배열이거나 값이 있다면 join(", ")을 사용하고, 없다면 빈 문자열로 설정
      const classDayValue = Array.isArray(contactInfo.class_day)
        ? contactInfo.class_day.join(", ")
        : contactInfo.class_day || "";

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
          classDayValue, //contactInfo.class_day ? contactInfo.class_day.join(", ") : "",
          contactInfo.start_time,
          contactInfo.end_time,
          contactInfo.memo,
        ],
        (err, result) => {
          if (err) {
            console.error("Database Error:", err);
            reject(err);
          } else {
            resolve(result);
          }
        }
      );
    });
  }

  static updateContact(student_id, contactInfo) {
    return new Promise((resolve, reject) => {
      // class_day가 배열이거나 값이 있다면 join(", ")을 사용하고, 없다면 빈 문자열로 설정
      const classDayValue = Array.isArray(contactInfo.class_day)
        ? contactInfo.class_day.join(", ")
        : contactInfo.class_day || "";
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
          classDayValue, //contactInfo.class_day ? contactInfo.class_day.join(", ") : "",
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

  static getProgress(id) {
    return new Promise((resolve, reject) => {
      const query =
        "SELECT * FROM progress WHERE student_id = ? ORDER BY date ASC";
      db.query(query, [id], (err, results) => {
        if (err) return reject(err);
        resolve(results);
      });
    });
  }

  static getStudentById(id) {
    return new Promise((resolve, reject) => {
      const query = "SELECT * FROM contacts WHERE student_id = ?";
      db.query(query, [id], (err, results) => {
        if (err) return reject(err);
        if (results.length === 0) return resolve(null); // 학생이 없을 경우 null 반환
        resolve(results[0]); // 첫 번째 결과(학생 정보) 반환
      });
    });
  }

  static addProgress(student_id, progressInfo, callback) {
    const query =
      "INSERT INTO progress (student_id, date, day, time, robot, coding) VALUES (?, ?, ?, ?, ?, ?)";
    db.query(
      query,
      [
        student_id,
        progressInfo.date,
        progressInfo.day,
        progressInfo.time,
        progressInfo.robot,
        progressInfo.coding,
      ],
      (err, result) => {
        if (err) callback(err, null);
        else callback(null, result);
      }
    );
  }

  static updateProgress(progress_id, progressInfo, callback) {
    const query =
      "UPDATE progress SET date = ?, day = ?, time = ?, robot = ?, coding = ? WHERE id = ?";
    db.query(
      query,
      [
        progressInfo.date,
        progressInfo.day,
        progressInfo.time,
        progressInfo.robot,
        progressInfo.coding,
        progress_id,
      ],
      (err, result) => {
        if (err) callback(err, null);
        else callback(null, result);
      }
    );
  }

  static deleteProgress(progress_id, callback) {
    const query = "DELETE FROM progress WHERE id = ?";
    db.query(query, [progress_id], (err, result) => {
      if (err) callback(err, null);
      else callback(null, result);
    });
  }
}

module.exports = Contact;
