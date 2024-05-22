const { Command } = require("commander");
const dotenv = require("dotenv");

dotenv.config();

/** COMMANDER */
const program = new Command();
program.option(
  "-p,--persistence <persistence>",
  "The selected persistence",
  "MONGO"
);

const options = program.opts();
program.parse(process.argv);

//console.log("---------->", options.persistence);

module.exports = {
  port: process.env.PORT,
  mongoConnLink: process.env.MONGO_CONNECTION_LINK,
  sessionSecret: process.env.SESSION_SECRET,
  userAdmin: process.env.USER_ADMIN,
  passAdmin: process.env.PASS_ADMIN,
  jwtSecret: process.env.JWT_SECRET,
  persistence: options.persistence,
  mailing: {
    service: process.env.MAIL_SERVICE,
    port: process.env.MAIL_PORT,
    auth: {
      user: process.env.MAIL_AUTH_USER,
      pass: process.env.MAIL_AUTH_PASS,
    },
  },
};
