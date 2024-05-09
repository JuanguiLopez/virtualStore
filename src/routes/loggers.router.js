const { Router } = require("express");
const LoggerController = require("../controllers/loggers.controller");

const router = Router();

router.get("/loggerTest", LoggerController.getAll);

module.exports = router;
