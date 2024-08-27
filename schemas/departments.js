import { pool } from "../connections/database.js";
import existsTable from "./existsTable.js";
export const departmentTable = async () => {
  try {
    const createdepartmentTable = `
            CREATE TABLE departments(
                department_id SERIAL PRIMARY KEY,
                department_name TEXT NOT NULL, 
                created_at TIMESTAMP DEFAULT NOW()
            ) 
        `;
    const result = await existsTable("departments");
    if (result.rows[0].exists) {
      console.log("department Table already exists");
    } else {
      await pool.query(createdepartmentTable);
      console.log("department table has been created");
    }
  } catch (error) {
    console.log(error);
  }
};
