const dotenv = require("dotenv");

dotenv.config();

module.exports = {
  port: process.env.PORT,
  mongoConnLink: process.env.MONGO_CONNECTION_LINK,
  sessionSecret: process.env.SESSION_SECRET,
  userAdmin: process.env.USER_ADMIN,
  passAdmin: process.env.PASS_ADMIN,
};
