import { PrismaClient } from "@prisma/client";
import bcryptjs from "bcryptjs";
import { userValidator } from "../validators/index.js";

const prisma = new PrismaClient();

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

    let user = await prisma.user.findUnique({
        where: { username }
    });
    if (user) {
        return res.status(400).send({ message: "Username already exists." });
    }

    user = await prisma.user.findUnique({
        where: { email }
    });
    if (user) {
        return res.status(400).send({ message: "Email already exists." });
    }

    const hashedPass = await bcryptjs.hash(password, 10);
    await prisma.user.create({
        data: {
            name,
            username,
            email,
            password: hashedPass,
            designation,
            division
        }
    });

    return res.status(200).send({
        message: `User ${name} registered successfully. Please login.`
    });
}

// GET http://localhost:4000/api/user/pcs
async function readPCs(req, res) {
    const user = await prisma.user.findUnique({
        where: { username: req.username },
        include: {
            computers: true
        }
    });

    if (!user) {
        return res.status(404).send({ message: "User not found." });
    }

    return res.status(200).send(user.computers);
}

export { createUser, readPCs };
