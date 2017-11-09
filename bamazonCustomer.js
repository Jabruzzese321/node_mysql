var mysql = require("mysql");
var inquirer = require("inquirer");

var connection = mysql.createConnection({
  host: "localhost",
  port: 3306,

  // Your username
  user: "root",

  // Your password
  password: "",
  database: "bamazon"
});

connection.connect(function(err) {
  if (err) throw err;
  runSearch();
});

let stock = 0;
let updatedQuantity = 0;

function runSearch() {
  inquirer.prompt ([
    {
      name: 'id',
      message: 'What is the product ID that you would like to buy?' 
    },
    {
      name: 'quantity',
      message: 'How many units of this product would you like to buy?'
    }
    ]).then(function(answers){
      checkProduct(answers.id, answers.quantity);
    });
};

function checkProduct(id, quantity) {
  console.log("Checking availability...");

  var query = "SELECT stock_quantity FROM products WHERE ?";

  connection.query(query, {item_id: id}, function(err, res){

    stock = res[0].stock_quantity;

      if(res[0].stock_quantity >= quantity) {
        console.log("We have availability! Purchasing now!");
        buyProduct(id, quantity);
      } else {
        console.log("Insufficient quantity!");
        connection.end();
      };
  });
}; 
  
function buyProduct(id, quantity){
  updatedQuantity = stock - quantity;
  console.log(updatedQuantity);
  console.log(id);

  var query = "UPDATE products SET ? WHERE ?";

    connection.query(query, [{stock_quantity: updatedQuantity}, {item_id: id}], function(err, res) {
      console.log("Purchase is successful!");
      showPrice(id, quantity);
    }
  );
}

function showPrice(id, quantity){
  var query = "SELECT price FROM products WHERE ?";

  connection.query(query, {item_id: id}, function(err, res){
    console.log("Your total purchase was " + (res[0].price * quantity));
    connection.end();
  });
};