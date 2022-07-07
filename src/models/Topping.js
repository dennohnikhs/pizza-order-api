const { executeQuery } = require("../db/connection");

class Topping {
  static async getOne(id) {
    let result = await executeQuery(`SELECT * FROM Toppings WHERE id=${id}`);
    let topping = result[0];
    return topping;
  }

  static async getAll(pizzaId) {
    let result = await executeQuery(
      `SELECT * FROM Toppings WHERE PizzaId=${pizzaId}`
    );

    return result;
  }
}

module.exports = Topping;
