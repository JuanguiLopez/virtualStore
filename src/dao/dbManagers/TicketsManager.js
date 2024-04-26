const ticketModel = require("../models/ticket");

class TicketsDao {
  async getAll() {
    return await ticketModel.find().lean();
  }

  async getById(id) {
    return await ticketModel.findOne({ _id: id }).lean();
  }

  async create(ticket) {
    return await ticketModel.create(ticket);
  }

  async update(id, ticket) {
    return await ticketModel.updateOne({ _id: id }, ticket);
  }

  async delete(id) {
    return await ticketModel.deleteOne({ _id: id });
  }
}

module.exports = TicketsDao;
