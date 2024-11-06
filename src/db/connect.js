const mongoose = require("mongoose");
const { DB_PASSWORD, DB_USERNAME } = require("../config");

async function connect() {
  try {
    await mongoose.connect(
      `mongodb+srv://${DB_USERNAME}:${DB_PASSWORD}@uzhnu.vg1vi.mongodb.net/lab_three`
    );
    console.log("db connected");
  } catch (e) {
    console.log("Error DB connect", e);
  }
}

module.exports = { connect };
