class LoggerController {
  static async getAll(req, res) {
    req.logger.fatal("this is a fatal log");
    req.logger.error("this is a error log");
    req.logger.warning("this is a warning log");
    req.logger.info("this is a info log");
    req.logger.http("this is an http log");
    req.logger.debug("this is a debug log");

    res.send({ status: "success", payload: "Logger working" });
  }
}

module.exports = LoggerController;
