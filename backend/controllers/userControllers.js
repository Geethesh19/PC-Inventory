import bcryptjs from "bcryptjs";
import { userValidator } from "../validators/index.js";
import User from "../models/User.js";
import PC from "../models/PC.js";

// POST http://localhost:4000/api/user
async function createUser(req, res) {
    const { name, username, email, password, designation, division } = req.body;
    if (
        !name ||
        !username ||
        !email ||
        !password ||
        !designation ||
        !division
    ) {
        return res.status(400).send({
            message:
                "Name, Username, Email, Password, Designation and Division should be there in the request."
        });
    }

    const data = {
        name,
        username,
        email,
        password,
        designation,
        division
    };
    const validationResult = userValidator.safeParse(data);
    if (!validationResult.success) {
        return res
            .status(400)
            .send({ message: validationResult.error.errors[0].message });
    }

    let user = await User.findOne({ username });
    if (user) {
        return res.status(400).send({ message: "Username already exists." });
    }

    user = await User.findOne({ email });
    if (user) {
        return res.status(400).send({ message: "Email already exists." });
    }

    const hashedPass = await bcryptjs.hash(password, 10);
    await User.create({
        name,
        username,
        email,
        password: hashedPass,
        designation,
        division
    });

    return res.status(200).send({
        message: `User ${name} registered successfully. Please login.`
    });
}

// GET http://localhost:4000/api/user/pcs
async function readPCs(req, res) {
    const user = await User.findOne({ username: req.username });
    if (!user) {
        return res.status(404).send({ message: "User not found." });
    }
    const pcs = await PC.find({ user: user._id });
    return res.status(200).send(pcs);
}

export { createUser, readPCs };
