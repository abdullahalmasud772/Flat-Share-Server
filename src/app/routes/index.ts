import { Router } from "express";
import { UserRoutes } from "../modules/user/user.routes";
import { AuthRoutes } from "../modules/auth/auth.routes";
import { FlatRoutes } from "../modules/Flat/flat.routes";
import { BookingRoutes } from "../modules/booking/booking.routers";

const router = Router();

const modulesRoutes = [
  {
    path: "/user",
    route: UserRoutes,
  },
  {
    path: "/auth",
    route: AuthRoutes,
  },
  {
    path: "/flat",
    route: FlatRoutes,
  },
  {
    path: "/booking",
    route: BookingRoutes,
  },
];

modulesRoutes.forEach((route) => router.use(route.path, route.route));

export default router;
