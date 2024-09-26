import { pool } from "../connections/database.js";

const signupQuery = async (data) => {
  try {
    const insertQuery = `INSERT INTO users (
        first_name, last_name, email,password,login_status,user_status,gender) 
        VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING *`;
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
const tokenSave = async (data) => {
  try {
    const tokenSaveQuery = `UPDATE users SET login_status=true,token = ARRAY_APPEND("token", $1 ) WHERE "id" = $2  RETURNING token`;
    return await pool.query(tokenSaveQuery, data);
  } catch (error) {
    console.log(error);
  }
};
const refreshTokenSave = async (data) => {
  try {
    const tokenSaveQuery = `UPDATE users SET login_status=true,refresh_token = ARRAY_APPEND("refresh_token", $1 ) WHERE "id" = $2  RETURNING refresh_token`;
    return await pool.query(tokenSaveQuery, data);
  } catch (error) {
    console.log(error);
  }
};
const tokenRemove = async (data) => {
  try {
    const tokenQuery = `UPDATE users SET token = array_remove(token , $1 ) WHERE "id" = $2`;
    return await pool.query(tokenQuery, data);
  } catch (error) {
    console.log(error);
  }
};
const refreshTokenRemove = async (data) => {
  try {
    const refreshToken = `UPDATE users SET refresh_token = array_remove(refresh_token , $1 ) WHERE "id" = $2`;
    return await pool.query(refreshToken, data);
  } catch (error) {
    console.log(error);
  }
};
const fetchRefreshToken = async (data) => {
  try {
    const getRefreshToken = `SELECT refresh_token FROM users WHERE "id" = $1 `;
    return await pool.query(getRefreshToken, data);
  } catch (error) {
    console.log("refreshToken", error);
  }
};
const userTokenRemove = async (data) => {
  try {
    const tokenRemoveQuery = `UPDATE users SET token = array_remove(token , $1 ) WHERE "id" = $2`;
    return await pool.query(tokenRemoveQuery, data);
  } catch (error) {
    console.log(error);
  }
};
const userRefreshTokenRemove = async (data) => {
  try {
    const refreshTokenRemoveQuery = `UPDATE users SET refresh_token = array_remove(refresh_token , $1 ) WHERE "id" = $2`;
    return await pool.query(refreshTokenRemoveQuery, data);
  } catch (error) {
    console.log(error);
  }
};
const userLoginStatusUpdate = async (data) => {
  try {
    const LoginStatusQuery = `UPDATE users SET login_status = $1 WHERE id = $2  RETURNING login_status`;
    return await pool.query(LoginStatusQuery, data);
  } catch (error) {
    console.log(error);
  }
};
const userGenderAndUserStutausUpdate = async (data) => {
  try {
    const updateQuery = `UPDATE users SET gender= $1,user_status=$2 WHERE id = $3  RETURNING *`;
    return await pool.query(updateQuery, data);
  } catch (error) {
    console.log(error);
  }
};
export {
  signupQuery,
  emailExistsQuery,
  user,
  tokenSave,
  refreshTokenSave,
  tokenRemove,
  refreshTokenRemove,
  fetchRefreshToken,
  userTokenRemove,
  userRefreshTokenRemove,
  userLoginStatusUpdate,
  userGenderAndUserStutausUpdate,
};
