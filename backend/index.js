import exp from "express";
import dotenv from "dotenv";
import cors from "cors";
import mongoose from "mongoose";
import morgan from "morgan";
import chalk from "chalk";
import dateFormat from "dateformat";
import bcryptjs from "bcryptjs";
import { userApp, adminApp } from "./routes/index.js";
import User from "./models/User.js";

dotenv.config();

const app = exp();

app.use(exp.json());
app.use(
    cors({
        origin: process.env.FRONTEND_URL,
        optionsSuccessStatus: 200
    })
);

const requestIds = new Set();
const logFormat = (tokens, req, res) => {
    if (requestIds.size > process.env.MAX_REQUEST_IDS) {
        requestIds.clear();
    }
    const requestId = req.headers["x-request-id"];
    if (requestIds.has(requestId)) {
        requestIds.delete(requestId);
        return null;
    }
    requestIds.add(requestId);
    const remoteAddr = req.ip;
    const date = dateFormat(new Date(), "dd/mmmm/yyyy HH:MM:ss");
    const method = tokens.method(req, res);
    const url = tokens.url(req, res);
    const httpVersion = tokens["http-version"](req, res);
    const status = tokens.status(req, res);
    const statusColor = (status) => {
        return status >= 500
            ? chalk.red
            : status >= 400
            ? chalk.yellow
            : status >= 300
            ? chalk.cyan
            : chalk.green;
    };
    return `${remoteAddr} - - ${chalk.blue("[" + date + "]")} "${statusColor(
        status
    )(method + " " + url + " HTTP/" + httpVersion)}" ${status} -`;
};

app.use(morgan(logFormat));

app.use("/api/user", userApp);
app.use("/api/admin", adminApp);

app.use((err, req, res, next) => {
    res.status(err.status || 500).send({ message: err.message });
});

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log("Connected to MongoDB.");
}).catch((err) => {
    console.error("MongoDB connection error:", err);
});

async function createAdmin() {
    try {
        const admin = await User.findOne({ role: "admin" });

        if (!admin) {
            const hashedPass = await bcryptjs.hash(process.env.ADMIN_PASS, 10);
            await User.create({
                name: "Administrator",
                username: "admin",
                email: "admin@pcinventory.com",
                password: hashedPass,
                role: "admin",
                designation: "System Administrator",
                division: "IT"
            });
            console.log("Default admin user created.\n");
        } else {
            console.log("Admin user already exists.\n");
        }
    } catch (err) {
        console.log("Error creating admin user:", err, "\n");
    }
}

createAdmin();

const port = process.env.PORT || 4000;

app.listen(port, () => {
    console.log(`\nHTTP Server on Port ${port}`);
});
