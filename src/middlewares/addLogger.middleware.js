const { devLogger, prodLogger } = require("../utils/loggers");

const addLogger = (req, res, next) => {
  switch (process.env.NODE_ENV) {
    case "development":
      req.logger = devLogger;
      break;

    case "production":
      req.logger = prodLogger;
      break;

    default:
      req.logger = devLogger;
      break;
  }

  req.logger.info(`NODE_ENV: ${process.env.NODE_ENV} - [JG]`);

  next();
};

module.exports = addLogger;
