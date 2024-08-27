import express from "express";
import { connectdb } from "./connections/database.js";
import { userTable } from "./schemas/user.js";
import { departmentTable } from "./schemas/departments.js";
import creatDeptAsignsToDoctorTable from "./schemas/deptasignstodoctor.js";
import route from "./routes.js";
import cors from "cors";
import dotenv from "dotenv";
dotenv.config();
const host = process.env.HOST;
const port = process.env.PORT;
const app = express();
app.use(express.json());
app.use(cors());
app.use(route);
app.get("/", (req, res) => {
  res.send("Hello World");
});
userTable();
departmentTable();
creatDeptAsignsToDoctorTable();
connectdb();
app.listen(port, host, () => {
  console.log("server is running on " + host + ":" + port);
});
