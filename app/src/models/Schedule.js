"use strict";

const db = require("../config/db");

class Schedule {
  static getAllSchedule(callback) {
    const query = "SELECT * FROM schedule";
    db.query(query, callback);
  }

  static getScheduleInfo(id, callback) {
    const query = "SELECT * FROM schedule WHERE id = ?";
    db.query(query, [id], (err, data) => {
      if (err) callback(err);
      else callback(null, data[0]);
    });
  }

  static save(scheduleInfo) {
    return new Promise((resolve, reject) => {
      const query =
        "INSERT INTO schedule (schedule_name, category, date, time, teacher) VALUES (?, ?, ?, ?, ?)";
      db.query(
        query,
        [
          scheduleInfo.schedule_name,
          scheduleInfo.category,
          scheduleInfo.date,
          scheduleInfo.time,
          scheduleInfo.teacher,
        ],
        (err, result) => {
          if (err) reject(err);
          else resolve(result);
        }
      );
    });
  }

  static updateSchedule(id, scheduleInfo) {
    return new Promise((resolve, reject) => {
      const query =
        "UPDATE schedule SET schedule_name = ?, category = ?, date = ?, time = ?, teacher = ? WHERE id = ?";
      db.query(
        query,
        [
          scheduleInfo.schedule_name,
          scheduleInfo.category,
          scheduleInfo.date,
          scheduleInfo.time,
          scheduleInfo.teacher,
          id,
        ],
        (err, result) => {
          if (err) reject(err);
          else resolve(result);
        }
      );
    });
  }

  static deleteSchedule(id) {
    return new Promise((resolve, reject) => {
      const query = "DELETE FROM schedule WHERE id = ?";
      db.query(query, [student_id], (err, result) => {
        if (err) reject(err);
        else resolve(result);
      });
    });
  }
}

module.exports = Schedule;
