import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import { tokenRemove } from "../models/user.js";
dotenv.config();

const verifyUserToken = (req, res, next) => {
  const tokenKey = process.env.JWT_KEY;
  let token = req.headers["authorizated"];
  if (!token) {
    return res.status(400).send({ error: "Please povide token" });
  } else {
    token = token.split(" ")[1];

    jwt.verify(token, tokenKey, async (error) => {
      if (error) {
        const decoded = jwt.decode(token);
        await tokenRemove([token, decoded.user.id]);
        return res.status(401).send({ error: "unauthorizated" });
      } else {
        next();
      }
    });
  }
};
export { verifyUserToken };
