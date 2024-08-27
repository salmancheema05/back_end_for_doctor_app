import { pool } from "../connections/database.js";
const selectAllDoctor = async () => {
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
    users.user_status = $1`;
    return await pool.query(selectQuery, ["doctor"]);
  } catch (error) {
    console.log("department", error);
  }
};
export { selectAllDoctor };
