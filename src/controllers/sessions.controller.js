const userModel = require("../dao/models/user");
const { createHash, isValidPassword } = require("../utils");

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
    res.send({ status: "success", message: "user registered" }); //, details: result });
  }

  static async registerFail(req, res) {
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
      req.session.user = {
        id: user._id,
        name: `${user.first_name} ${user.last_name}`,
        age: user.age,
        email: user.email,
        cart: user.cart,
        role: user.role,
      };
    }

    /** service answer */
    res.status(200).send({
      status: "success",
      payload: req.session.user,
      message: "succesfully logged in",
    });
  }

  static async loginFail(req, res) {
    res.status(401).send({ status: "error", error: "login fail" });
  }

  static async github(req, res) {}

  static async githubCallback(req, res) {
    req.session.user = {
      name: `${req.user.first_name} ${req.user.last_name}`,
      age: req.user.age,
      email: req.user.email,
      role: req.user.role,
    };

    res.redirect("/");
  }

  static async logout(req, res) {
    req.session.destroy((err) => {
      if (err)
        return res
          .status(500)
          .send({ status: "error", error: "there was an error login out" });

      res.redirect("/login");
    });
  }

  static async resetPassword(req, res) {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).send({ status: "error", error: "missing data" });
    }

    const user = await userModel.findOne({ email: email });
    if (!user) {
      return res.status(401).send({ status: "error", error: "user not found" });
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
    user = req.session.user;
    res.send({ payload: user });
  }
}

module.exports = SessionsController;
