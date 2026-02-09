import { addUser , getAllusers, UserLogin } from "../controllers/UsersControler.js";

import express from "express";
const UserRouter = express.Router();


UserRouter.post("/AddAdmin", addUser);
UserRouter.get("/getAll", getAllusers);
UserRouter.post("/login", UserLogin);


export default UserRouter;