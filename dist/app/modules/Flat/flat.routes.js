"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FlatRoutes = void 0;
const express_1 = __importDefault(require("express"));
const flat_controllers_1 = require("./flat.controllers");
const auth_1 = __importDefault(require("../../middlewares/auth"));
const fileUploadHelper_1 = require("../../../helpers/fileUploadHelper");
const client_1 = require("@prisma/client");
const user_1 = require("../../../enums/user");
const router = express_1.default.Router();
router.post("/", (0, auth_1.default)(client_1.UserRole.SELLER), fileUploadHelper_1.FileUploadHelper.upload.single("file"), (req, res, next) => {
    req.body = JSON.parse(req.body.data);
    return flat_controllers_1.FlatController.createFlat(req, res, next);
});
router.get("/", flat_controllers_1.FlatController.getAllFlats);
router.get("/seller", (0, auth_1.default)(user_1.ENUM_USER_ROLE.SELLER), flat_controllers_1.FlatController.getSellerFlats);
router.get("/:id", flat_controllers_1.FlatController.getSingleFlat);
router.patch(
//"/updateFlat",
"/:id", (0, auth_1.default)(user_1.ENUM_USER_ROLE.ADMIN, user_1.ENUM_USER_ROLE.SELLER), 
/* FlatController.updateFlat, */
fileUploadHelper_1.FileUploadHelper.upload.single("file"), (req, res, next) => {
    var _a;
    req.body = JSON.parse((_a = req === null || req === void 0 ? void 0 : req.body) === null || _a === void 0 ? void 0 : _a.data);
    return flat_controllers_1.FlatController.updateFlat(req, res, next);
});
router.delete("/soft/:id", (0, auth_1.default)(user_1.ENUM_USER_ROLE.ADMIN), flat_controllers_1.FlatController.softDeleteFlat);
router.delete("/:id", (0, auth_1.default)(user_1.ENUM_USER_ROLE.ADMIN), flat_controllers_1.FlatController.deleteFlat);
exports.FlatRoutes = router;
