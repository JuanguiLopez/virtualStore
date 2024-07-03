const { jwtSecret } = require("../config/config");
const UserDTO = require("../dao/DTOs/UserDTO");
const userModel = require("../dao/models/user");
const { usersService } = require("../repositories");
const MailingService = require("../services/mailing.service");
const { createHash, isValidPassword } = require("../utils/utils");
const jwt = require("jsonwebtoken");

const mailingService = new MailingService();

class SessionsController {
  static async register(req, res) {
    /*const { first_name, last_name, age, email, password } = req.body;
    
      if (!first_name || !last_name || !age || !email || !password) {
        return res.status(400).send({ status: "error", error: "missing data" });
      }
    
      const hashedPassword = createHash(password);
    
      const result = await userModel.create({
        first_name,
        last_name,
        age,
        email,
        password: hashedPassword,
        role: "usuario",
      });
    */

    //await mailingService.sendRegistrationMail(email);
    res.send({
      status: "success",
      message: "user registered succesfully",
      payload: req.session.user,
    }); //, details: result });
  }

  static async registerFail(req, res) {
    req.logger.fatal(`something went wrong in the register process`);
    res.status(401).send({ status: "error", error: "authentication error" });
  }

  static async login(req, res) {
    /*const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).send({ status: "error", error: "missing data" });
    }*/

    const user = req.user;

    //if (email == "adminCoder@coder.com" && password == "adminCod3r123") {
    if (user.email == "adminCoder@coder.com") {
      /** create user session for admin */
      req.session.user = {
        name: user.first_name,
        email: user.email,
        role: user.role,
        isAdmin: true,
        isUser: false,
        isPremium: false,
      };
    } else {
      /*const user = await userModel.findOne({ email: email });
      if (!user) {
        return res
          .status(401)
          .send({ status: "error", error: "user not found" });
      }

      if (!isValidPassword(user, password)) {
        return res
          .status(401)
          .send({ status: "error", error: "incorrect password" });
      }*/

      /** create user session */
      const userIsAdmin = user.role == "admin" ? true : false;
      const userIsUser = user.role == "usuario" ? true : false;
      const userIsPremium = user.role == "premium" ? true : false;

      req.session.user = {
        id: user._id,
        name: `${user.first_name} ${user.last_name}`,
        age: user.age,
        email: user.email,
        cart: user.cart,
        role: user.role,
        isAdmin: userIsAdmin,
        isUser: userIsUser,
        isPremium: userIsPremium,
      };
    }
    req.logger.debug(`sesión creada correctamente!`);

    // set last_connection
    await usersService.setLastConnection(user._id);

    /** service answer */
    res.status(200).send({
      status: "success",
      payload: req.session.user,
      message: "succesfully logged in",
    });
  }

  static async loginFail(req, res) {
    req.logger.warning(`login fail`);
    res.status(401).send({ status: "error", error: "login fail" });
  }

  static async github(req, res) {}

  static async githubCallback(req, res) {
    req.session.user = {
      name: `${req.user.first_name} ${req.user.last_name}`,
      age: req.user.age,
      email: req.user.email,
      cart: req.user.cart,
      role: req.user.role,
    };

    res.redirect("/");
  }

  static async logout(req, res) {
    // set last_connection
    await usersService.setLastConnection(req.session.user._id);

    req.session.destroy((err) => {
      if (err)
        return res
          .status(500)
          .send({ status: "error", error: "there was an error login out" });

      req.logger.info(`user logged out`);
      res.redirect("/login");
    });
  }

  static async sendEmailResPass(req, res) {
    const email = req.body.email;
    let user = await usersService.getByProperty("email", email);

    if (!user) {
      res
        .status(400)
        .send({ status: "error", error: "not a valid user email" });
    }

    await mailingService.sendPasswordResetMail(user, email);
    res.send({ payload: true });
  }

  static async validateToken(req, res) {
    const { passwordResetToken } = req.params;

    try {
      jwt.verify(passwordResetToken, jwtSecret, (error) => {
        if (error) {
          return res.redirect("/sendEmailResPass");
        }

        res.redirect("/resetPassword");
      });
    } catch (error) {
      res.status(500).send({ status: "error", error: error.message });
    }
  }
  static async resetPassword(req, res) {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).send({ status: "error", error: "missing data" });
    }

    //const user = await userModel.findOne({ email: email });
    const user = await usersService.getByProperty("email", email);
    if (!user) {
      return res.status(401).send({ status: "error", error: "user not found" });
    }

    if (isValidPassword(user, password)) {
      return res.status(400).send({ status: "error", error: "same password" });
    }

    const hashedPassword = createHash(password);

    const result = await userModel.updateOne(
      { _id: user._id },
      { $set: { password: hashedPassword } }
    );

    res.send({
      status: "success",
      message: "password reset succesfully",
      details: result,
    });
  }

  static async current(req, res) {
    const user = req.session.user;
    const userDTO = new UserDTO(user);
    res.send({ payload: userDTO });
  }
}

module.exports = SessionsController;
