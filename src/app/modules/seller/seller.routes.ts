import { Router } from "express";
import auth from "../../middlewares/auth";
import { SellerControllers } from "./seller.controllers";

const router = Router();

router.get("/", SellerControllers.getAllSeller);

router.get("/:id", SellerControllers.getSingleSeller);

export const SellerRoutes = router;
