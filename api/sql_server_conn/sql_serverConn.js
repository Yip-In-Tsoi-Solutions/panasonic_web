const sql_server = require("mssql");
require('dotenv').config()
const sql_serverConn = async () => {
  const connectionString = {
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    server: process.env.DB_SERVER,
    database: process.env.DB_NAME,
    options: {
      encrypt: false,
    }
  };
  return await sql_server.connect(connectionString);
};
module.exports = sql_serverConn;
