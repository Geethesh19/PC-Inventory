import { Router } from "express";
import { verifyToken } from "../middlewares/index.js";
import expressAsyncHandler from "express-async-handler";
import {
    loginUserOrAdmin,
    readUserOrAdmin,
    updateUserOrAdmin,
    deleteUserOrAdmin
} from "../controllers/commonControllers.js";
import {
    readPC,
    createPC,
    updatePC,
    deletePC,
    readPCs
} from "../controllers/adminControllers.js";

const adminApp = Router();

adminApp
    .route("")
    .all(verifyToken("admin"))
    .get(expressAsyncHandler(readUserOrAdmin))
    .put(expressAsyncHandler(updateUserOrAdmin))
    .delete(expressAsyncHandler(deleteUserOrAdmin));

adminApp.post("/login", expressAsyncHandler(loginUserOrAdmin("admin")));

adminApp.post("/pc", verifyToken("admin"), expressAsyncHandler(createPC));

adminApp.get("/pcs", verifyToken("admin"), expressAsyncHandler(readPCs));

adminApp
    .route("/pc/:assetId")
    .all(verifyToken("admin"))
    .get(expressAsyncHandler(readPC))
    .put(expressAsyncHandler(updatePC))
    .delete(expressAsyncHandler(deletePC));

export default adminApp;
