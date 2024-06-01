import { pool } from "../connections/database.js";

const signupQuery = async (data) => {
  try {
    const insertQuery = `INSERT INTO users (
        first_name, last_name, email,password,login_status,user_status,gender) 
        VALUES ($1,$2,$3,$4,$5,$6,$7)`;
    return await pool.query(insertQuery, data);
  } catch (error) {
    console.error("signup", error);
  }
};
const emailExistsQuery = async (data) => {
  try {
    const selectQuery = "SELECT COUNT(*) as count FROM users WHERE email = $1";
    return await pool.query(selectQuery, data);
  } catch (error) {
    console.error("emailExistsQuery", error);
    throw error;
  }
};
const user = async (data) => {
  try {
    const getEmail = [data];
    const fetchQuery = `SELECT * FROM users WHERE "email" =  $1`;
    return await pool.query(fetchQuery, getEmail);
  } catch (error) {
    console.log(error);
  }
};
const TokenSave = async (data) => {
  try {
    const tokenSaveQuery = `UPDATE users SET login_status=true,token = ARRAY_APPEND("token", $1 ) WHERE "id" = $2  RETURNING token`;
    return await pool.query(tokenSaveQuery, data);
  } catch (error) {
    console.log(error);
  }
};
export { signupQuery, emailExistsQuery, user, TokenSave };
