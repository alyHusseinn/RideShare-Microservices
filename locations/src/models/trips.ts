import mongoose, { Schema, Document } from "mongoose";
// a7a

export interface ITrip extends Document {
    _id: mongoose.Types.ObjectId;
    tripId: number;
    driverId?: mongoose.Types.ObjectId | null;
    riderId: number;
    pickupLocation?: {
        type: string;
        coordinates: number[];
    } | null;
    destination?: {
        type: string;
        coordinates: number[];
    } | null;
    isMatched: boolean;
}

const tripSchema = new mongoose.Schema({
    tripId: {
        type: Number,
        required: true,
        unique: true,
    },
    driverId: { type: Schema.Types.ObjectId, ref: "Driver" },
    riderId: {
        type: Number,
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