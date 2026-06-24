import { Router } from "express";
import { login, signup } from "../controller/auth.controller.ts";
import { checkAuth } from "../controller/checkAuth.controller.ts";

const route = Router()

route.post("/login", login)
route.post("/signup", signup)
route.get("/me", checkAuth)

export default route