import { Router } from "express";
import { UserRoutes } from "../modules/user/user.routes";
import { AuthRoutes } from "../modules/auth/auth.routes";
import { FlatRoutes } from "../modules/Flat/flat.routes";

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
];

modulesRoutes.forEach((route) => router.use(route.path, route.route));

export default router;
