import { ITrip } from "../models/trips";
import Driver, { IDriver } from "../models/drivers";
import { type Location } from "../types";
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
        return await Driver.find({
            location: {
                $near: {
                    $geometry: {
                        type: "Point",
                        coordinates: [location.lat, location.long],
                    },
                    $maxDistance: 10000,
                    $minDistance: 0,
                },
            },
            available: true,
        });
    },
    findBySocketId: async (socketId: string): Promise<IDriver> => {
        return (await Driver.findOne({ socketId }))!;
    },
    updateAvilability: async (socketId: string, available: boolean) => {
        return await Driver.findOneAndUpdate({ socketId }, { available });
    },
    deleteOne: async (id: number) => {
        return await Driver.findOneAndDelete({ driverId: id });
    }
    // deleteOneBySocketId: async (socketId: string) => {
    //     return await Driver.findOneAndDelete({ socketId });
    // }
};

export default driversService;