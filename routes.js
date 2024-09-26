import express from "express";
import { signup, login, logout, accessToken } from "./controllers/user.js";
import { verifyUserToken } from "./middleware/verifyusertoken.js";
import { getAllDepartment } from "./controllers/department.js";
import { getAlldoctor } from "./controllers/doctor.js";
import {
  googleUserDataSave,
  updateGenderAndUserStutaus,
} from "./controllers/google.js";

const route = express.Router();
route.post("/api/signup", signup);
route.post("/api/login", login);
route.post("/api/refreshtoken", accessToken);
route.post("/api/logout", verifyUserToken, logout);

route.get("/api/alldepartment", getAllDepartment);

route.post("/api/alldoctor", getAlldoctor);
route.post("/api/googleuserdatasave", googleUserDataSave);
route.post("/api/updategenderanduserstatus", updateGenderAndUserStutaus);
export default route;
