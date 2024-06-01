import express from "express";
import { signup, login } from "./controllers/user.js";

const route = express.Router();
route.post("/api/signup", signup);
route.post("/api/login", login);
export default route;
