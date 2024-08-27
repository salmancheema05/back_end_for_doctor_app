import bcrypt from "bcrypt";
import {
  signupQuery,
  emailExistsQuery,
  user,
  tokenSave,
  refreshTokenSave,
  fetchRefreshToken,
  userTokenRemove,
  userRefreshTokenRemove,
  userLoginStatusUpdate,
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
          res
            .status(200)
            .send({ message: token.message, refreshtoken: token.refreshtoken });
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
        return {
          code: createJwt.code,
          message: createJwt.message,
          refreshtoken: createJwt.refreshtoken,
        };
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
    const { id, first_name, last_name, user_status } = data[0];

    const user = { id, first_name, last_name, user_status };
    const createtoken = jwt.sign({ user }, privateKey, { expiresIn: "2h" });
    await userLoginStatusUpdate([true, id]);

    const createRefreshtoken = jwt.sign({ user }, privateKey);
    if (createtoken && createRefreshtoken) {
      const saveToken = [createtoken, id];
      const saveRefreshToken = [createRefreshtoken, id];

      const token = await tokenSave(saveToken);
      const refreshtoken = await refreshTokenSave(saveRefreshToken);
      const lastIndexToken = token.rows[0].token.length - 1;
      const latestToken = token.rows[0].token[lastIndexToken];

      const lastIndexRefreshToken =
        refreshtoken.rows[0].refresh_token.length - 1;
      const latestRefreshToken =
        refreshtoken.rows[0].refresh_token[lastIndexRefreshToken];

      return {
        code: 200,
        message: latestToken,
        refreshtoken: latestRefreshToken,
      };
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
const logout = async (req, res) => {
  try {
    const refreshToken = req.body;
    let token = req.headers["authorizated"];
    token = token.split(" ")[1];
    const decoded = jwt.decode(token);
    const userId = decoded.user.id;
    await userTokenRemove([token, userId]);
    await userRefreshTokenRemove([refreshToken.refresh_token, userId]);
    const status = await userLoginStatusUpdate([false, userId]);
    res.status(200).send(status.rows[0]);
  } catch (error) {
    console.log("logout", error);
  }
};
const accessToken = async (req, res) => {
  try {
    const privateKey = process.env.JWT_KEY;
    let refreshToken = req.headers["authorizated"];
    refreshToken = refreshToken.split(" ")[1];
    const decoded = jwt.decode(refreshToken);
    const { id, first_name, last_name, user_status } = decoded.user;

    const getRefreshtoken = await fetchRefreshToken([id]);
    const refreshTokenArray = getRefreshtoken.rows[0].refresh_token;
    const findRefreshtoken = refreshTokenArray.find(
      (element) => element == refreshToken
    );
    if (findRefreshtoken === undefined) {
      res.status(404).send({ error: "Provid Refresh Token" });
    } else {
      const user = { id, first_name, last_name, user_status };
      const createtoken = jwt.sign({ user }, privateKey, { expiresIn: "2h" });
      const token = await tokenSave([createtoken, id]);
      const lastIndexToken = token.rows[0].token.length - 1;
      const latestToken = token.rows[0].token[lastIndexToken];
      res.status(200).send({ message: latestToken });
    }
  } catch (error) {
    console.log("refreshtoken", error);
  }
};
export { signup, login, logout, accessToken };
