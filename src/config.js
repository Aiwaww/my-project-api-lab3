const dotenv = require("dotenv");
dotenv.config({ path: "./.env.development" });

const ENV = {
  DB_PASSWORD: process.env.DB_PASSWORD,
  DB_USERNAME: process.env.DB_USERNAME,
  JWT_SECRET: process.env.JWT_SECRET,
};

module.exports = ENV;
