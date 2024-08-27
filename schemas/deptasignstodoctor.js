import { pool } from "../connections/database.js";
import existsTable from "./existsTable.js";

const creatDeptAsignsToDoctorTable = async () => {
  try {
    const createTableQuery = `CREATE TABLE deptasignstodoctor(
        dept_asign_to_doctor_id SERIAL PRIMARY KEY,
        doctor_id INT,
        department_id INT,
        FOREIGN KEY (doctor_id) REFERENCES users(id),
        FOREIGN KEY (department_id) REFERENCES departments(department_id ),
        created_at TIMESTAMP DEFAULT NOW()
    )`;
    const result = await existsTable("deptasignstodoctor");
    if (result.rows[0].exists) {
      console.log("Department asigns to doctor Table already exists");
    } else {
      await pool.query(createTableQuery);
      console.log("Department asigns to doctor table has been created");
    }
  } catch (error) {
    console.log(error);
  }
};

export default creatDeptAsignsToDoctorTable;
