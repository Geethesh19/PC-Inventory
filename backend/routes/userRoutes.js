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
    createUser,
    readPCs,
} from "../controllers/userControllers.js";

const userApp = Router();

userApp
    .route("")
    .all((req, res, next) => {
        if (req.method !== "POST") {
            verifyToken("user")(req, res, next);
        } else {
            next();
        }
    })
    .post(expressAsyncHandler(createUser))
    .get(expressAsyncHandler(readUserOrAdmin))
    .put(expressAsyncHandler(updateUserOrAdmin))
    .delete(expressAsyncHandler(deleteUserOrAdmin));

userApp.post("/login", expressAsyncHandler(loginUserOrAdmin("user")));

userApp.get(
    "/pcs",
    verifyToken("user"),
    expressAsyncHandler(readPCs)
);

export default userApp;
