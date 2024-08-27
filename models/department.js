import { pool } from "../connections/database.js";
const selectAllDepartment = async () => {
  try {
    const selectQuery = "SELECT * FROM departments ";
    return await pool.query(selectQuery);
  } catch (error) {
    console.log("department", error);
  }
};
const selectDoctorByDept = async (data) => {
  try {
    const selectQuery = `SELECT
      users.id,
      users.first_name,
      users.last_name,
      dept.department_name
  FROM
      users
  JOIN
      deptasignstodoctor asign ON users.id = asign.doctor_id
  JOIN
      departments dept ON dept.department_id = asign.department_id
  WHERE
      dept.department_id = $1`;
    return await pool.query(selectQuery, data);
  } catch (error) {
    console.log("department", error);
  }
};
export { selectAllDepartment, selectDoctorByDept };
