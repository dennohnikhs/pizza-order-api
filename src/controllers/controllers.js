const { executeQuery } = require("../db/connection");
const Order = require("../models/Order");

async function PlaceOrder(req, res) {
  let name = req.body.name;
  let phoneNumber = req.body.phone_number;
  let pizzas = req.body.pizzas;

  if (!name) {
    return res.send({
      success: false,
      message: "Name is required",
    });
  }

  if (!phoneNumber) {
    return res.send({
      success: false,
      message: "phone_number is required and should be less than 10 characters",
    });
  }

  if (!pizzas || pizzas.length < 1) {
    return res.send({
      success: false,
      message: "select at least one pizza",
    });
  }

  let result = await executeQuery(
    `INSERT INTO Customers (Name,PhoneNumber) VALUES ('${name}','${phoneNumber}')`,

    []
  );

  result = await executeQuery(
    `INSERT INTO Orders (CustomerId)  VALUES ((SELECT Id FROM Customers ORDER BY Id DESC LIMIT 1))`,
    []
  );

  for (let i = 0; i < pizzas.length; i++) {
    const pizza = pizzas[i];
    let toppings = pizza.toppings;

    result = await executeQuery(
      `INSERT INTO PizzaOrder (OrderId,Size)  VALUES ((SELECT Id FROM Orders ORDER BY Id DESC LIMIT 1 ),'${pizza.size}')`,

      []
    );

    for (let j = 0; j < toppings.length; j++) {
      const topping = toppings[j];

      result = await executeQuery(
        `INSERT INTO PizzaTopping (PizzaId,Topping)  VALUES ((SELECT Id FROM PizzaOrder ORDER BY Id DESC LIMIT 1 ),'${topping}')`,
        []
      );
    }
  }

  res.send({ success: true, message: "order placed successfully" });
}

async function oldOrdersList(req, res) {
  const orders = await executeQuery(
    "SELECT c.Name,c.PhoneNumber,o.* FROM Orders o INNER JOIN Customers c ON c.Id = o.CustomerId",
    []
  );

  for (let i = 0; i < orders.length; i++) {
    let order = orders[i];

    let pizzas = await executeQuery(
      `SELECT * FROM PizzaOrder WHERE OrderId=${order.Id}`,
      []
    );

    for (let j = 0; j < pizzas.length; j++) {
      let pizza = pizzas[j];
      let toppings = await executeQuery(
        `SELECT * FROM PizzaTopping WHERE PizzaId=${pizza.Id}`,
        []
      );
      pizza.ToppingCount = toppings.length;
      pizza.Toppings = toppings;
    }

    order.pizzas = pizzas;
    order.PizzaCount = pizzas.length;
    orders[i] = order;
  }

  res.json({
    success: true,
    success_message: "list of orders",
    orders: orders,
  });
}
//this is functioning code queryying our pizza db from routes to controllers
async function listOrders(req, res) {
  res.json({
    success: true,
    success_message: "list of orders",
    orders: await Order.getAll(),
  });
}
module.exports = {
  PlaceOrder,
  listOrders,
};
