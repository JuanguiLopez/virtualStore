const ErrorTypes = require("../utils/errorHandling/ErrorTypes");

const errorHandling = (error, req, res, next) => {
  //console.log(`cause: ${error.cause}`);
  switch (error.code) {
    case ErrorTypes.ROUTING_ERROR:
      req.logger.error(`cause: ${error.cause}`);
      res.status(400).send({ status: "error", error: error.name });
      break;

    case ErrorTypes.INVALID_TYPE_ERROR:
      req.logger.error(`cause: ${error.cause}`);
      res.status(400).send({ status: "error", error: error.name });
      break;

    case ErrorTypes.DATABASE_ERROR:
      req.logger.error(`cause: ${error.cause}`);
      res.status(400).send({ status: "error", error: error.name });
      break;

    default:
      req.logger.fatal(`cause: ${error.cause}`);
      res.status(500).send({ status: "error", error: "Unhandled error" });
      break;
  }

  next();
};

module.exports = errorHandling;
