const sql_server = require("mssql");
const sql_serverConn = async () => {
  const connectionString = {
    user: "sa",
    password: "P@ssw0rd",
    server: "0.0.0.0", // ใช้ชื่อคอนเทนเนอร์
    database: "demo",
    options: {
      encrypt: false,
    }
  };
  return await sql_server.connect(connectionString);
};
module.exports = sql_serverConn;
