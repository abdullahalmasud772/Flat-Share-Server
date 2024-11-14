import { Router } from "express";
import { UserRoutes } from "../modules/user/user.routes";
import { AuthRoutes } from "../modules/auth/auth.routes";
import { FlatRoutes } from "../modules/Flat/flat.routes";
import { BookingRoutes } from "../modules/booking/booking.routers";
import { SellerRoutes } from "../modules/seller/seller.routes";
import { BuyerRoutes } from "../modules/buyer/buyer.routes";
import { AdminRoutes } from "../modules/admin/admin.routes";
import { PaymentRoutes } from "../modules/payment/payment.routes";

const router = Router();

const modulesRoutes = [
  {
    path: "/user",
    route: UserRoutes,
  },
  {
    path: "/admin",
    route: AdminRoutes,
  },
  {
    path: "/seller",
    route: SellerRoutes,
  },
  {
    path: "/buyer",
    route: BuyerRoutes,
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
  {
    path: "/payment",
    route: PaymentRoutes,
  },
];

modulesRoutes.forEach((route) => router.use(route.path, route.route));

export default router;
