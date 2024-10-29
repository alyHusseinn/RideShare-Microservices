import mongoose from "mongoose";

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
            enum: ["Point"],
            required: true,
        },
        coordinates: {
            type: [Number],
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