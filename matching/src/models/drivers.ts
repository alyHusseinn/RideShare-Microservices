import { truncate } from "fs";
import mongoose, { Document } from "mongoose";

export interface IDriver extends Document {
    _id: mongoose.Types.ObjectId;
    username: string;
    driverId: number;
    socketId: string;
    location?: {
        type: string;
        coordinates: number[];
    } | null;
    available: boolean;
}

const driverSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
    },
    driverId: {
        type: Number,
        required: true,
        unique: true,
    },
    socketId: {
        type: String,
        required: true,
        unique: true,
    },
    location: {
        type: {
            type: String,
            enum: ["Point"] ,
            required: true,
        },
        coordinates: {
            type: [Number], // {long, lat}
            required: true,
        },
    },
    available: {
        type: Boolean,
        default: true,
    }
})

driverSchema.index({ location: "2dsphere" });
export default mongoose.model("Driver", driverSchema);