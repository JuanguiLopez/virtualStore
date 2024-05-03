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
    return await this.dao.getProductById(id);
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
}

module.exports = UsersService;
