import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { userValidator } from "../validators/index.js";
import User from "../models/User.js";

dotenv.config();

// POST http://localhost:4000/api/admin/login
// POST http://localhost:4000/api/user/login
function loginUserOrAdmin(role) {
    return async (req, res) => {
        const { username, password } = req.body;
        if (!username || !password) {
            return res.status(400).send({
                message:
                    "Username and Password should be present in the request."
            });
        }

        const data = { username, password };
        const validationResult = userValidator.safeParse(data);
        if (!validationResult.success) {
            return res
                .status(400)
                .send({ message: validationResult.error.errors[0].message });
        }

        let user = await User.findOne({ username });
        if (
            !user ||
            (user && !(await bcryptjs.compare(password, user.password)))
        ) {
            return res
                .status(400)
                .send({ message: "Invalid Username or Password." });
        }

        if (user.role !== role) {
            return res
                .status(403)
                .send({ message: "Forbidden. Cannot Login." });
        }
        const token = jwt.sign({ username }, process.env.SECRET_KEY, {
            expiresIn: process.env.JWT_EXPIRY
        });
        user = user.toObject();
        delete user.password;
        delete user._id;
        return res.status(200).send({
            message: "Login Successful.",
            token,
            user
        });
    };
}

// GET http://localhost:4000/api/admin
// GET http://localhost:4000/api/user
async function readUserOrAdmin(req, res) {
    let user = await User.findOne({ username: req.username });
    user = user.toObject();
    delete user.password;
    delete user._id;
    return res.status(200).send(user);
}

// PUT http://localhost:4000/api/admin
// PUT http://localhost:4000/api/user
async function updateUserOrAdmin(req, res) {
    const {
        name,
        username,
        email,
        password,
        oldPassword,
        newPassword,
        designation,
        division
    } = req.body;

    if ((newPassword && !oldPassword) || (!newPassword && oldPassword)) {
        return res.status(400).send({
            message: "Old Password should be there in the request."
        });
    }
    const validationResult1 = userValidator.safeParse({
        password: oldPassword
    });
    const validationResult2 = userValidator.safeParse({
        password: newPassword
    });
    if (newPassword && oldPassword) {
        if (!validationResult1.success || !validationResult2.success) {
            return res.status(400).send({
                message: `${validationResult1.error.errors[0].message} ${validationResult2.error.errors[0].message}`
            });
        }
        const user = await User.findOne({ username: req.username });
        const flag = await bcryptjs.compare(oldPassword, user.password);
        if (!flag) {
            return res
                .status(400)
                .send({ message: "Old Password is incorrect." });
        }
        if (oldPassword === newPassword) {
            return res
                .status(400)
                .send({ message: "New Password is same as Old Password." });
        }
        const hashedPass = await bcryptjs.hash(newPassword, 10);
        await User.updateOne(
            { username: req.username },
            { $set: { password: hashedPass } }
        );
        return res
            .status(200)
            .send({ message: "Password updated successfully." });
    }

    if (
        (!name && !username && !email && !designation && !division) ||
        !password
    ) {
        return res.status(400).send({
            message:
                "Name or Username or Email or Designation or Division and Password should be there in the request."
        });
    }

    const data = {};
    if (name) {
        data.name = name;
    }
    if (username) {
        data.username = username;
    }
    if (email) {
        data.email = email;
    }
    if (designation) {
        data.designation = designation;
    }
    if (division) {
        data.division = division;
    }
    data.password = password;
    const validationResult = userValidator.safeParse(data);
    if (!validationResult.success) {
        return res
            .status(400)
            .send({ message: validationResult.error.errors[0].message });
    }

    const user = await User.findOne({ username: req.username });
    const flag = await bcryptjs.compare(password, user.password);
    if (!flag) {
        return res.status(400).send({ message: "Password is incorrect." });
    }

    let cou = 0;

    if (name && name !== user.name) {
        cou++;
    }
    if (username && user.username !== username) {
        let userExists = await User.findOne({ username });
        if (userExists) {
            return res
                .status(400)
                .send({ message: "Username already exists." });
        }
        cou++;
    }
    if (email && user.email !== email) {
        let userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).send({ message: "Email already exists." });
        }
        cou++;
    }
    if (designation && designation !== user.designation) {
        cou++;
    }
    if (division && division !== user.division) {
        cou++;
    }

    if (!cou) {
        return res
            .status(400)
            .send({ message: "Given fields are same as original." });
    }

    delete data.password;

    await User.updateOne(
        { username: req.username },
        { $set: data }
    );

    return res.status(200).send({ message: "User updated successfully" });
}

// DELETE http://localhost:4000/api/admin
// DELETE http://localhost:4000/api/user
async function deleteUserOrAdmin(req, res) {
    await User.deleteOne({
        username: req.username
    });

    return res.status(200).send({ message: "The user has been deleted" });
}

export {
    loginUserOrAdmin,
    readUserOrAdmin,
    updateUserOrAdmin,
    deleteUserOrAdmin
};
