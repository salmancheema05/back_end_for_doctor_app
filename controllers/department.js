import { selectAllDepartment } from "../models/department.js";

const getAllDepartment = async (req, res) => {
  try {
    const result = await selectAllDepartment();
    res.status(200).send(result.rows);
  } catch (error) {
    console.log("getAllDepartment", error);
  }
};
export { getAllDepartment };
