const { executeQuery } = require("../db/connection");
const Topping = require("./Topping");

class Pizza {
  static async getOne(id) {
    let result = await executeQuery(`SELECT * FROM PizzaOrder WHERE id=${id}`);
    let pizza = result[0];
    return pizza;
  }

  static async getAll(orderId) {
    let result = await executeQuery(
      `SELECT * FROM PizzaOrder WHERE OrderId=${orderId}`
    );

    for (let i = 0; i < result.length; i++) {
      let pizza = result[i];
      pizza.toppings = await Topping.getAll(pizza.Id);
      console.log(pizza.Id);
      result[i] = pizza;
    }

    return result;
  }
}

module.exports = Pizza;
