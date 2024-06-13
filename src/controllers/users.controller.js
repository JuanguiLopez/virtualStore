const { usersService } = require("../repositories");

class UsersController {
  static async getAll(req, res) {
    try {
      const users = await usersService.getAll();

      res.send({ status: "success", payload: users });
    } catch (error) {
      res.status(500).send({ status: "error", error: error.message });
    }
  }

  static async changeRole(req, res) {
    try {
      const id = req.params.uid;
      await usersService.changeRole(id);

      res.send({ status: "success", payload: "User role changed succesfully" });
    } catch (error) {
      req.logger.error(error);
      res.status(500).send({ status: "error", error: error.message });
    }
  }

  static async uploadDocuments(req, res) {
    try {
      //console.log(req.files);
      const uid = req.params.uid;
      await usersService.addDocuments(uid, req.files);

      res.send({ status: "success" });
    } catch (error) {
      res.status(500).send({ status: "error", error: error.message });
    }
  }

  static async uploadProfilePicture(req, res) {
    try {
      const uid = req.params.uid;
      await usersService.addProfilePicture(uid, req.file);

      res.send({ status: "success" });
    } catch (error) {
      res.status(500).send({ status: "error", error: error.message });
    }
  }

  static async uploadProducts(req, res) {
    try {
      const uid = req.params.uid;
      await usersService.addProducts(uid, req.files);

      res.send({ status: "success" });
    } catch (error) {
      res.status(500).send({ status: "error", error: error.message });
    }
  }
}

module.exports = UsersController;
