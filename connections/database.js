import pkg from "pg";
const { Pool } = pkg;
import dotenv from "dotenv";
dotenv.config();
const pool = new Pool({
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
});
const connectdb = () => {
  pool
    .connect()
    .then(() => {
      console.log("database is connect");
    })
    .catch((error) => console.log("database is not  connect " + error));
};
export { connectdb, pool };
