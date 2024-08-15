import express from "express";
import { signup, login, logout, accessToken } from "./controllers/user.js";
import { verifyUserToken } from "./middleware/verifyusertoken.js";

const route = express.Router();
route.post("/api/signup", signup);
route.post("/api/login", login);
route.post("/api/refreshtoken", accessToken);
route.post("/api/logout", verifyUserToken, logout);

export default route;
