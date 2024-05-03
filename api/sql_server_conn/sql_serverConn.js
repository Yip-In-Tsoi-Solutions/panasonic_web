import sql_server from "mssql";
const sql_serverConn = async () => {
  const connectionString = {
    user: "sa",
    password: "P@ssw0rd",
    server: "127.0.0.1", // e.g., localhost
    database: "demo",
    options: {
      encrypt: false
    },
  };
  return await sql_server.connect(connectionString);
};
export default sql_serverConn;
