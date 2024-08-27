import { selectDoctorByDept } from "../models/department.js";
import { selectAllDoctor } from "../models/doctor.js";

const getAlldoctor = async (req, res) => {
  try {
    const { department_id } = req.body;
    if (department_id == 0) {
      const result = await selectAllDoctor();
      res.status(200).send(result.rows);
    } else {
      const result = await selectDoctorByDept([department_id]);
      res.status(200).send(result.rows);
    }
  } catch (error) {
    console.log("getAllDepartment", error);
  }
};
export { getAlldoctor };
