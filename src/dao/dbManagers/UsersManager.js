const userModel = require("../models/user");

class UsersDao {
  async getAll() {
    return await userModel.find().lean();
  }

  async getById(id) {
    return await userModel.findOne({ _id: id }).populate("carts.cart").lean();
  }

  async getByProperty(property, name) {
    let opts = {};
    opts[property] = name;
    let result = await userModel.findOne(opts).lean();
    return result;
  }

  async create(user) {
    return await userModel.create(user);
  }

  async update(id, user) {
    return await userModel.updateOne({ _id: id }, user);
  }

  async delete(id) {
    return await userModel.deleteOne({ _id: id });
  }
}

module.exports = UsersDao;
