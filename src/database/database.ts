import { Client,Pool } from "pg";
import { configDotenv } from "dotenv";
configDotenv(); 

const connection = new Pool({
  user: "postgres",
  host: "localhost",
  database:"startpage_db",
  password: "password",
  port:5432,
});

connection.connect().then(() => {
  console.log("Connected to Postgres ");
});

export default connection;