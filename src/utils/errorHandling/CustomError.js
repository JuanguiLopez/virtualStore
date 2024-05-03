const ErrorTypes = require("./ErrorTypes");

class CustomError extends Error {
  constructor({ name = "error", cause, message, code = ErrorTypes.UNKNOWN }) {
    super(message); // constructor clase padre Error -> al pasar message es como tener this.message = message
    this.name = name;
    this.code = code;
    this.cause = cause;
  }
}

module.exports = CustomError;
