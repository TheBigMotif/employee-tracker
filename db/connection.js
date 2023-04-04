const mysql = require("mysql2");

const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  database: "employees",
  password: "6910",
});

module.exports = connection;
