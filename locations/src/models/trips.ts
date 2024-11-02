import mongoose, { Schema, Document } from "mongoose";
// a7a

export interface ITrip extends Document {
    _id: mongoose.Types.ObjectId;
    tripId: number;
    driverId: Schema.Types.ObjectId;
    riderId: string;
    pickupLocation: {
        type: string;
        coordinates: number[];
    };
    destination: {
        type: string;
        coordinates: number[];
    };
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