# Node.js and MySQL
## Week #12 HW
This week we created an Amazon-like storefront with the MySQL. The app will take in orders from customers and deplete stock from the store's inventory.

### Getting Started
- Clone repo.
- Run command in Terminal `npm install`

## Customer
- Run command `node bamazonCustomer.js`

### Demo
![Demo GIF](assets/node_mysql_demo.gif)

### What This Does
- Prints the table of products.
- Prompts customer which product they would like to purchase by ID number.
- Asks for the quantity.
- If there is a sufficient amount of the product in stock, it will return the total for that purchase.
- However, if there is not enough of the product in stock, it will tell the user that there isn't enough of the product.
- If the purchase goes through, it updates the stock quantity to reflect the purchase.

## Manager
- Run command `node bamazonManager.js`

### Demo
![Demo GIF](assets/manager_store.gif)

### What This Does
- Provides a menu of options to View Products, View Low Inventory, Add to Inventory, and Add New Products
