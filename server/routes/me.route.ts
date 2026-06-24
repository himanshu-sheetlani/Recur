import { Router } from "express";
import { checkAuth } from "../controller/checkAuth.controller.ts";

const route = Router();

route.get("/", checkAuth)

export default route