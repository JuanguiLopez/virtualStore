const { usersService } = require("../repositories");

class UsersController {
  static async changeRole(req, res) {
    try {
      console.log("<---ENTRA--->");
      const id = req.params.uid;
      const user = await usersService.getById(id);

      if (!["usuario", "premium"].includes(user.role)) {
        throw new Error("User has an invalid role");
      }
      console.log("user.role --->", user.role);
      if (user.role == "usuario") {
        user.role = "premium";
      } else {
        user.role = "usuario";
      }
      console.log("user.role --->", user.role);
      await usersService.update(user._id.toString(), {
        $set: { role: user.role },
      });

      res.send({ status: "success", payload: "User role changed succesfully" });
    } catch (error) {
      req.logger.error(error);
      res.status(500).send({ status: "error", error: error.message });
    }
  }
}

module.exports = UsersController;
