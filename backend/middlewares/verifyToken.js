import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import User from "../models/User.js";

dotenv.config();

export default function verifyToken (role) {
    return async (req, res, next) => {
        let bearerToken = req.headers.authorization;
        if (!bearerToken) {
            return res                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          
                .status(401)
                .send({ message: "Unauthorized Access. Please Login." });
        }
        let token = bearerToken.split(" ")[1];
        try {
            const decodedToken = jwt.verify(token, process.env.SECRET_KEY);
            const { username } = decodedToken;
            const user = await User.findOne({ username });
            if (!user) {
                return res.status(400).send({ error: "Bad Request" });
            }
            if (user.role !== role) {
                return res.status(403).send({ error: "Forbidden" });
            }
            req.username = username;
            next();
        } catch (err) {
            next(err);
        }
    };
};