import { ITrip } from "../models/trips";
import Driver, { IDriver } from "../models/drivers";
import { type Location } from "../types";
import { Types } from "mongoose";
// driver service

const driversService = {
    createOne: async (driverId: number, username: string, socketId: string) => {
        try {
            const driver = await Driver.create({
                driverId,
                username,
                socketId,
                available: false,
                location: {
                    type: "Point",
                    coordinates: [0, 0],
                }
            });
            return driver;
        } catch (error) {
            console.log(error);
        }
    },
    findNearby: async (location: Location) => {
        // return await Driver.find({
        //     location: {
        //         $near: {
        //             $geometry: {
        //                 type: "Point",
        //                 coordinates: [location.long, location.lat],
        //             },
        //             $maxDistance: 10000,
        //             $minDistance: 0,
        //         },
        //     },
        //     available: true,
        // });
        return await Driver.find({ available: true });
    },
    findBySocketId: async (socketId: string): Promise<IDriver> => {
        return (await Driver.findOne({ socketId }))!;
    },
    findById: async (id: Types.ObjectId): Promise<IDriver | null> => {
        return await Driver.findById(id);
    }, 
    updateCurrentLocation: async (socketId: string, location: Location) => {
        return await Driver.findOneAndUpdate({ socketId }, {
            location: {
                type: "Point",
                coordinates: [location.long, location.lat],
            }
        });
    },
    updateAvilability: async (socketId: string, available: boolean) => {
        return await Driver.findOneAndUpdate({ socketId }, { available });
    },
    deleteOne: async (id: number) => {
        return await Driver.findOneAndDelete({ driverId: id });
    }
};

export default driversService;