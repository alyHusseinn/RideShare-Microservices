import mongoose, { Schema } from "mongoose";
// a7a
const tripSchema = new mongoose.Schema({
    tripId: {
        type: Number,
        required: true,
        unique: true,
    },
    driverId: { type: Schema.Types.ObjectId, ref: "Driver" },
    riderId: {
        type: String,
        required: true,
    },
    pickupLocation: {
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
    destination: {
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
    isMatched: {
        type: Boolean,
        default: false,
    }
});

export default mongoose.model("Trip", tripSchema);