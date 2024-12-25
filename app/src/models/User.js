"use strict";

const UserStorage = require("./UserStorage");

class User {
  constructor(body) {
    this.body = body;
  }

  async login() {
    const client = this.body;
    try {
      const { id, pw } = await UserStorage.getUserInfo(client.id);

      if (id) {
        if (id === client.id && pw === client.pw) {
          return { success: true };
        }
        return { success: false, msg: "invalid password." };
      }
      return { success: false, msg: "username does not exsist." };
    } catch (err) {
      return { success: false, msg: err };
    }
  }

  async register() {
    const client = this.body;
    try {
      const response = await UserStorage.save(client);
      return response;
    } catch (err) {
      return { success: false, msg: err };
    }
  }
}

module.exports = User;
