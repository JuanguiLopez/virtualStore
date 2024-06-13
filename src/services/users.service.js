const MailingService = require("../services/mailing.service");
const mailingService = new MailingService();

class UsersService {
  constructor(dao) {
    this.dao = dao;
  }

  async getAll() {
    return await this.dao.getAll();
  }

  async getById(id) {
    return await this.dao.getById(id);
  }

  async getByProperty(property, value) {
    let user;
    try {
      user = await this.dao.getByProperty(property, value);
      /*if (!user)
        throw {
          message: `There's no user by ${property} = ${value}`,
          status: 400,
        };*/
    } catch (error) {
      console.log("ERROR user service", error);
    }
    return user;
  }

  async create(user) {
    await mailingService.sendRegistrationMail(user.email);
    return await this.dao.create(user);
  }

  async update(id, user) {
    const userToUpdate = await this.dao.getById(id);
    if (!userToUpdate) {
      return null;
    }

    return await this.dao.update(id, user);
  }

  async delete(id) {
    await this.dao.getById(id);
    return await this.dao.delete(id);
  }

  async setLastConnection(id) {
    const user = await this.getById(id);
    await this.update(id, { last_connection: new Date().toLocaleString() });
  }

  async addDocuments(id, files) {
    const user = await this.getById(id);
    let documents = user.documents || [];

    documents = documents.concat(
      files.map((file) => {
        return {
          name: file.originalname,
          reference: file.path.split("public")[1].replace(/\\/g, "/"),
        };
      })
    );

    await this.update(id, { documents: documents });
  }

  async addProfilePicture(id, file) {
    await this.getById(id);

    await this.update(id, {
      profile_picture: file.path.split("public")[1].replace(/\\/g, "/"),
    });
  }

  async addProducts(id, files) {
    const user = await this.getById(id);
    let products = user.products || [];

    products = products.concat(
      files.map((file) => {
        return {
          name: file.originalname,
          reference: file.path.split("public")[1].replace(/\\/g, "/"),
        };
      })
    );

    await this.update(id, { products: products });
  }

  async changeRole(id) {
    const user = await this.getById(id);

    /** Valida documentos */
    // const requiredDocuments = [
    //   "Identificacion",
    //   "Comprobante de domicilio",
    //   "Comprobante de estado de cuenta",
    // ];

    if (user.role == "usuario") {
      if (!user.documents.some((d) => d.name.includes("Identificacion"))) {
        throw new Error(
          "El usuario no ha terminado de procesar su documentación"
        );
      }
      if (
        !user.documents.some((d) => d.name.includes("Comprobante de domicilio"))
      ) {
        throw new Error(
          "El usuario no ha terminado de procesar su documentación"
        );
      }
      if (
        !user.documents.some((d) =>
          d.name.includes("Comprobante de estado de cuenta")
        )
      ) {
        throw new Error(
          "El usuario no ha terminado de procesar su documentación"
        );
      }
    }

    if (!["usuario", "premium"].includes(user.role)) {
      throw new Error("User has an invalid role");
    }

    user.role = user.role == "usuario" ? "premium" : "usuario";

    await this.update(user._id.toString(), { $set: { role: user.role } });
  }
}

module.exports = UsersService;
