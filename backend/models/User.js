import mongoose from "mongoose";

const { Schema, model, Types } = mongoose;

const userSchema = new Schema({
    username: { type: String, unique: true, required: true },
    name: { type: String, required: true },
    email: { type: String, unique: true, required: true },
    role: { type: String, enum: ["user", "admin"], default: "user" },
    password: { type: String, required: true },
    designation: { type: String },
    division: { type: String },
}, { timestamps: true });

export default model("User", userSchema);