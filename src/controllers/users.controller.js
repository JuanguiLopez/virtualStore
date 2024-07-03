const UserDTO = require("../dao/DTOs/UserDTO");
const { usersService } = require("../repositories");

class UsersController {
  static async getAll(req, res) {
    try {
      const users = await usersService.getAll();
      const usersDTO = users.map((user) => new UserDTO(user));

      res.send({ status: "success", payload: usersDTO });
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

  static async deleteInactive(req, res) {
    try {
      const result = await usersService.deleteInactive();

      res.send({ status: "success", payload: result });
    } catch (error) {
      res.status(500).send({ status: "error", error: error.message });
    }
  }

  static async updateUser(req, res) {
    const uid = req.params.uid;
    const { role } = req.body;

    try {
      const payload = await usersService.update(uid, { role });

      res.send({ status: "success", payload: payload });
    } catch (error) {
      res.status(500).send({ status: "error", error: error.message });
    }
  }

  static async deleteUser(req, res) {
    const uid = req.params.uid;

    try {
      const payload = await usersService.delete(uid);

      res.send({ status: "success", payload: payload });
    } catch (error) {
      res.status(500).send({ status: "error", error: error.message });
    }
  }
}

module.exports = UsersController;
