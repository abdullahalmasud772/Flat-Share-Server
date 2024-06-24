"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const user_routes_1 = require("../modules/user/user.routes");
const auth_routes_1 = require("../modules/auth/auth.routes");
const flat_routes_1 = require("../modules/Flat/flat.routes");
const booking_routers_1 = require("../modules/booking/booking.routers");
const seller_routes_1 = require("../modules/seller/seller.routes");
const buyer_routes_1 = require("../modules/buyer/buyer.routes");
const admin_routes_1 = require("../modules/admin/admin.routes");
const router = (0, express_1.Router)();
const modulesRoutes = [
    {
        path: "/user",
        route: user_routes_1.UserRoutes,
    },
    {
        path: "/admin",
        route: admin_routes_1.AdminRoutes,
    },
    {
        path: "/seller",
        route: seller_routes_1.SellerRoutes,
    },
    {
        path: "/buyer",
        route: buyer_routes_1.BuyerRoutes,
    },
    {
        path: "/auth",
        route: auth_routes_1.AuthRoutes,
    },
    {
        path: "/flat",
        route: flat_routes_1.FlatRoutes,
    },
    {
        path: "/booking",
        route: booking_routers_1.BookingRoutes,
    },
];
modulesRoutes.forEach((route) => router.use(route.path, route.route));
exports.default = router;
