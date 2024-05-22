const { Router } = require("express");

const passport = require("passport");
const SessionsController = require("../controllers/sessions.controller");

const sessionRouter = Router();

sessionRouter.post(
  "/register",
  passport.authenticate("register", {
    failureRedirect: "/api/sessions/registerFail",
  }),
  SessionsController.register
);

sessionRouter.get("/registerFail", SessionsController.registerFail);

sessionRouter.post(
  "/login",
  passport.authenticate("login", {
    failureRedirect: "/api/sessions/loginFail",
    session: false,
  }),
  SessionsController.login
);

sessionRouter.get("/loginFail", SessionsController.loginFail);

sessionRouter.get(
  "/github",
  passport.authenticate("github", { scope: ["user:email"] }),
  SessionsController.github
);

sessionRouter.get(
  "/githubcallback",
  passport.authenticate("github", { failureRedirect: "/login" }),
  SessionsController.githubCallback
);

sessionRouter.get("/logout", SessionsController.logout);

sessionRouter.post("/sendEmailResPass", SessionsController.sendEmailResPass);

sessionRouter.get(
  "/validateToken/:passwordResetToken",
  SessionsController.validateToken
);

sessionRouter.post("/resetPassword", SessionsController.resetPassword);

sessionRouter.get("/current", SessionsController.current);

module.exports = sessionRouter;
