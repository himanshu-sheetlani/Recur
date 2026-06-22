import { Router } from "express";
import { health } from "../controller/health.controller.ts";

const route = Router()

route.get("/", health)

export default route