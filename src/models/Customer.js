const { executeQuery } = require("../db/connection");

class Customer {
  static async getOne(id) {
    let result = await executeQuery(`SELECT * FROM Customers WHERE id=${id}`);
    let customer = result[0];
    return customer;
  }
}

module.exports = Customer;
