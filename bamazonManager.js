var mysql = require("mysql");
var inquirer = require("inquirer");
var Table = require('cli-table');

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
  inquirer
    .prompt({
      name: "action",
      type: "list",
      message: "What would you like to do?",
      choices: [
        "View Products for Sale",
        "View Low Inventory",
        "Add to Inventory",
        "Add New Product",
        "Exit"
      ]
    })
    .then(function(answer) {
      switch (answer.action) {
        case "View Products for Sale":
          viewProducts();
          break;

        case "View Low Inventory":
          viewLow();
          break;

        case "Add to Inventory":
          addInventory();
          break;

        case "Add New Product":
          addNew();
          break;

        case "Exit":
          exit();
          break;
      }
    });
};

function viewProducts() {
  var table = new Table({
    head: ['Item ID', 'Product Name', 'Price', 'Stock Quantity']
  });

  var tableArray = [];
  var query = "SELECT * FROM products";
  connection.query(query, function(err, rows){
    for (i = 0; i < rows.length; i++) {
      tableArray.push([rows[i].item_id, rows[i].product_name, rows[i].price, rows[i].stock_quantity]);
    }

    for (i= 0; i < rows.length; i++) {
      table.push(tableArray[i]);
    }

    console.log(table.toString());
    runSearch();
  })
}

function viewLow() {
  var table = new Table({
    head: ['Item ID', 'Product Name', 'Price', 'Stock Quantity']
  });

  var tableArray = [];
  var query = "SELECT * FROM products ORDER BY stock_quantity ASC";
  connection.query(query, function(err, rows) {
    for (i = 0; i < rows.length; i++) {
      tableArray.push([rows[i].item_id, rows[i].product_name, rows[i].price, rows[i].stock_quantity]);
    }

    for (i= 0; i < rows.length; i++) {
      if (rows[i].stock_quantity < 6) {
        table.push(tableArray[i]);
      } 
    }
    console.log(table.toString());
    runSearch();
  })
}

function addInventory() {
  var table = new Table({
    head: ['Item ID', 'Product Name', 'Price', 'Stock Quantity']
  });

  var tableArray = [];
  var query = "SELECT * FROM products";
  connection.query(query, function(err, rows){
    for (i = 0; i < rows.length; i++) {
      tableArray.push([rows[i].item_id, rows[i].product_name, rows[i].price, rows[i].stock_quantity]);
    }

    for (i= 0; i < rows.length; i++) {
      table.push(tableArray[i]);
    }
    console.log(table.toString());
    inquirer.prompt ([
    {
      name: 'id',
      message: 'What is the ID of the product you would like to add to?' 
    },
    {
      name: 'quantity',
      message: 'How many units of this product would you like to add?'
    }
    ]).then(function(answers){
      findQuantity(answers.id, answers.quantity);
    });
  });
}

function findQuantity(id, quantity) {
  
  var query = "SELECT * FROM products";
  connection.query(query, function(err, rows){
    var idNum = parseFloat(id) - 1;
    stock = rows[idNum].stock_quantity;
    updatedQuantity = stock + parseFloat(quantity); 
    addQuantity(id); 
  });
}

function addQuantity(id) {
  var query = "UPDATE products SET ? WHERE ?";
  connection.query(query, [{stock_quantity: updatedQuantity}, {item_id: id}], function(err, res) {
    console.log("Added stock successfully!");
    runSearch();
  });
}

function addNew() {
  inquirer.prompt ([
    {
      name: 'product',
      message: 'What is the name of the product you want to add?' 
    },
    {
      name: 'department',
      message: 'What department is this product in?'
    },
    {
      name: 'quantity',
      message: 'How many units of this product would you like to add?'
    },
    {
      name: 'price',
      message: 'What is the price of this product by unit?'
    }
    ]).then(function(answers){
      
      var query = connection.query("INSERT INTO products SET ?", 
      {
        product_name: answers.product, 
        department_name: answers.department, 
        price: answers.price, 
        stock_quantity: answers.quantity
        }, 
        function(err, res) {
          console.log("Added product successfully!");
          runSearch();
        });
    });
};

function exit() {
  connection.end();
}