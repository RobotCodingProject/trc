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
        "INSERT INTO schedule (category, date, time, teacher, memo) VALUES (?, ?, ?, ?, memo)";
      db.query(
        query,
        [
          scheduleInfo.category,
          scheduleInfo.date,
          scheduleInfo.time,
          scheduleInfo.teacher,
          scheduleInfo.memo,
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
        "UPDATE schedule SET category = ?, date = ?, time = ?, teacher = ?, memo = ? WHERE id = ?";
      db.query(
        query,
        [
          scheduleInfo.category,
          scheduleInfo.date,
          scheduleInfo.time,
          scheduleInfo.teacher,
          scheduleInfo.memo,
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
      db.query(query, [id], (err, result) => {
        if (err) reject(err);
        else resolve(result);
      });
    });
  }
}

module.exports = Schedule;
