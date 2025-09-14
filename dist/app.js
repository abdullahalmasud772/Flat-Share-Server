"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const cors_1 = __importDefault(require("cors"));
const express_1 = __importDefault(require("express"));
const routes_1 = __importDefault(require("./app/routes"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const notFound_1 = __importDefault(require("./app/middlewares/notFound"));
const path_1 = __importDefault(require("path"));
const serve_favicon_1 = __importDefault(require("serve-favicon"));
const app = (0, express_1.default)();
app.use((0, serve_favicon_1.default)(path_1.default.join(__dirname, "../public", "favicon.ico")));
app.use((0, cors_1.default)({
    origin: [
        "https://flatshare.vercel.app",
        "http://localhost:3000",
        "http://localhost:3001",
    ],
    credentials: true,
}));
app.use((0, cookie_parser_1.default)());
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use("/api/v1", routes_1.default);
app.get("/", (req, res) => {
    res.status(200).json({ message: "Flatshare API is running 🚀" });
});
//global error handler
// app.use(globalErrorHandler);
//handle not found
app.use(notFound_1.default);
exports.default = app;
