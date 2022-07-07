const { executeQuery } = require("../db/connection");
const Customer = require("./Customer");
const Pizza = require("./Pizza");

class Order {
  constructor(customer) {
    this.customer = customer;
  }

  static async saveOrder() {}

  static async getOne(id) {
    let result = await executeQuery(`SELECT * FROM Orders WHERE id=${id}`);
    let order = result[0];
    order.customer = await Customer.getOne(order.CustomerId);
    order.pizzas = await Pizza.getAll(order.Id);
    return order;
  }

  static async getAll() {
    const result = await executeQuery("SELECT * FROM Orders");

    for (let i = 0; i < result.length; i++) {
      let order = result[i];
      order.customer = await Customer.getOne(order.CustomerId);
      order.pizzas = await Pizza.getAll(order.Id);

      result[i] = order;
    }

    return result;
  }
}

module.exports = Order;
