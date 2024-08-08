import { pool } from "../connections/database.js";
import existsTable from "./existsTable.js";
export const userTable = async () => {
  try {
    const createUserTable = `
            CREATE TABLE users(
                id SERIAL PRIMARY KEY,
                first_name TEXT NOT NULL,
                last_name TEXT NOT NULL,
                email TEXT NOT NULL,
                password TEXT  NOT NULL,
                login_status BOOLEAN NOT NULL,
                user_status TEXT NOT NULL,
                gender Text NOT NULL,
                token TEXT[],
                refresh_token TEXT[],
                created_at TIMESTAMP DEFAULT NOW()
            ) 
        `;
    const result = await existsTable("users");
    if (result.rows[0].exists) {
      console.log("Users Table already exists");
    } else {
      await pool.query(createUserTable);
      console.log("Users table has been created");
    }
  } catch (error) {
    console.log(error);
  }
};
