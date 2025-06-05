import mongoose from "mongoose";

const { Schema, model, Types } = mongoose;

const pcSchema = new Schema({
    assetId: { type: String, unique: true, required: true },
    model: { type: String, required: true },
    make: { type: String, required: true },
    macAddress: { type: String },
    ipAddress: { type: String },
    os: { type: String },
    ram: { type: String },
    hardDisk: { type: String },
    metadata: { type: Schema.Types.Mixed },
    user: { type: Types.ObjectId, ref: "User" }
}, { timestamps: true });

export default model("PC", pcSchema);