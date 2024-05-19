import { Router } from "express";
import { UserControllers } from "./user.controllers";

const router = Router();

router.post("/user", UserControllers.createUser);

export const UserRoutes = router;
