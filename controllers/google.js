import dotenv from "dotenv";
import { OAuth2Client } from "google-auth-library";
import bcrypt from "bcrypt";
import {
  emailExistsQuery,
  refreshTokenSave,
  signupQuery,
  tokenSave,
  user,
  userGenderAndUserStutausUpdate,
  userLoginStatusUpdate,
} from "../models/user.js";
import jwt from "jsonwebtoken";
dotenv.config();
const saltRounds = 10;
const client = new OAuth2Client(process.env.CLIENT_ID);
const googleUserDataSave = async (req, res) => {
  try {
    const idToken = req.body.token;
    const ticket = await client.verifyIdToken({
      idToken: idToken,
      audience: process.env.CLIENT_ID,
    });
    const payload = ticket.getPayload();
    const { email_verified, given_name, family_name, email } = payload;
    const hashPassword = await bcrypt.hash(email, saltRounds);
    if (email_verified == true) {
      const emailExist = await emailExistsQuery([email]);
      if (emailExist.rows[0].count == 0) {
        const dataSave = await signupQuery([
          given_name,
          family_name,
          email,
          hashPassword,
          false,
          "userstatus",
          "gender",
        ]);
        const fetchUserData = dataSave.rows[0];
        if (
          fetchUserData.user_status == "userstatus" &&
          fetchUserData.gender == "gender"
        ) {
          res.status(200).send({ message: fetchUserData });
        }
      } else {
        const userData = await user(email);
        const fetchUserData = userData.rows[0];
        if (
          fetchUserData.user_status == "userstatus" &&
          fetchUserData.gender == "gender"
        ) {
          res.status(200).send({ data: fetchUserData });
        } else {
          const userData = await user(email);
          const token = await jwtToken(userData.rows[0]);
          res.status(200).send(token);
        }
      }
    }
  } catch (error) {
    console.log("google", error);
  }
};
const updateGenderAndUserStutaus = async (req, res) => {
  try {
    const { gender, who, id } = req.body;
    if (gender === "" || who === "") {
      res
        .status(400)
        .send({ error: "please select your gender and Doctor or Patient" });
    } else {
      const data = await userGenderAndUserStutausUpdate([gender, who, id]);
      const token = await jwtToken(data.rows[0]);
      res.status(200).send(token);
    }
  } catch (error) {
    console.log("updateGenderAndUserStutaus", error);
  }
};
const jwtToken = async (data) => {
  try {
    const privateKey = process.env.JWT_KEY;
    const { id, first_name, last_name, user_status } = data;

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

export { googleUserDataSave, updateGenderAndUserStutaus };
