import { Router } from "express";
import { BuyerControllers } from "./buyer.controllers";
import auth from "../../middlewares/auth";

const router = Router();

router.get("/", BuyerControllers.getAllBuyer);

router.get("/:id", BuyerControllers.getSingleBuyer);

export const BuyerRoutes = router;
