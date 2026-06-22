import { Router } from "express";
import { login, signup } from "../controller/auth.controller.ts";

const route = Router()

route.post("/login", login)
route.post("/signup", signup)

export default route