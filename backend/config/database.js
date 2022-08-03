const Sequelize = require("sequelize");
const database = require("./vars");
const db = {};
const sequelize = new Sequelize("endChat", "root", "", {
  host: database.uri,
  dialect: "mysql",
  // operatorsAliases: false,
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000,
  },
  define: {
    freezeTableName: true,
    timestamps: false,
  },
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

t = async () => {
  try {
    await sequelize.authenticate();
    console.log("Connection has been established successfully.");
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
};

t();

module.exports = db;

// const mysql = require("mysql");
// const con = mysql.createConnection({
//   host: "localhost",
//   user: "root",
//   password: "",
//   database: "stella",
// });

// connection.connect((err) => {
//   if (err) throw err;
//   console.log("Connected!");
// });
