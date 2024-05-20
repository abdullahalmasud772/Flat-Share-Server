import { Router } from "express";
import { UserControllers } from "./user.controllers";

const router = Router();

router.post("/", UserControllers.createUser);

export const UserRoutes = router;
