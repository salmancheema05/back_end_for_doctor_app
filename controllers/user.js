import bcrypt from "bcrypt";
import {
  signupQuery,
  emailExistsQuery,
  user,
  TokenSave,
} from "../models/user.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();
const saltRounds = 10;
const login = async (req, res) => {
  try {
    const data = req.body;
    if (data.email == "" || data.password == "") {
      res.status(404).send({ error: "requird email and password" });
    } else {
      const getInfo = await user(data.email);
      if (getInfo.rowCount === 0) {
        res.status(404).send({ error: "your email and password is wrong" });
      } else {
        const token = await verlfyPassword(data.password, getInfo.rows);
        if (token.code === 404) {
          res.status(token.code).send({ error: token.error });
        } else {
          res.status(200).send({ message: token.message });
        }
      }
    }
  } catch (error) {
    console.log(error);
  }
};
const verlfyPassword = async (password, data) => {
  try {
    const userPassword = data[0].password;
    const hashPassword = await bcrypt.compare(password, userPassword);
    if (hashPassword == false) {
      return { code: 404, error: "your email and password is wrong" };
    } else {
      const createJwt = await jwtToken(data);
      if (createJwt.code == 200) {
        return { code: createJwt.code, message: createJwt.message };
      } else {
        return { code: createJwt.code, error: createJwt.err };
      }
    }
  } catch (error) {
    console.log(error);
  }
};
const jwtToken = async (data) => {
  try {
    const privateKey = process.env.JWT_KEY;
    const { id, firstname, lastname, user_status } = data[0];
    const user = { id, firstname, lastname, user_status };
    const token = jwt.sign({ user }, privateKey);
    if (token) {
      const saveToken = [token, id];
      const result = await TokenSave(saveToken);
      const lastIndex = result.rows[0].token.length - 1;
      const latestToken = result.rows[0].token[lastIndex];
      return { code: 200, message: latestToken };
    } else {
      return { code: 404, error: "server problem" };
    }
  } catch (error) {
    console.log(error);
  }
};
const signup = async (req, res) => {
  try {
    const { firstname, lastname, email, password, user_status, gender } =
      req.body;
    const hashPassword = await bcrypt.hash(password, saltRounds);

    const emailExists = await emailExistsQuery([email]);
    if (emailExists.rows[0].count == 1) {
      res.status(200).send({ message: "Email already exists" });
    } else {
      const result = await signupQuery([
        firstname,
        lastname,
        email,
        hashPassword,
        false,
        user_status,
        gender,
      ]);
      res.status(200).send({ message: "your account has been created" });
    }
  } catch (error) {
    console.error("signup", error);
  }
};
export { signup, login };
