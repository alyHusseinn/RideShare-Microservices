import { ObjectId, Types } from "mongoose";
import Trip, { ITrip } from "../models/trips";
import { type Location } from "../types";
import DriversService from "./driversService";
import ApiTripsService from "./apiTripService";
import { SOCKET_EMITTERS } from "../constants";
import { Server } from "socket.io";

const tripsService = {
    createOne: async (tripId: number, riderId: number, origin: Location, destination: Location): Promise<ITrip> => {
        try {
            const newTrip = await Trip.create({
                pickupLocation: {
                    type: "Point",
                    coordinates: [origin.lat, origin.long],
                },
                destination: {
                    type: "Point",
                    coordinates: [destination.lat, destination.long],
                },
                tripId,
                riderId,
                isMatched: false,
            });

            if (!newTrip) {
                throw new Error("Trip creation failed.");
            }
            return newTrip;
        } catch (error) {
            console.error("Error creating trip:", error);
            throw error;
        }
    },
    findNearby: async (location: Location): Promise<ITrip[]> => {
        return await Trip.find({
            origin: {
                $near: {
                    $geometry: {
                        type: "Point",
                        coordinates: [location.lat, location.long],
                    },
                    $maxDistance: 10000,
                    $minDistance: 0,
                },
            },
            isMatched: false,
        });
    },
    matchTrip: async (io: Server, trip: ITrip) => {
        const drivers = await DriversService.findNearby({
            lat: trip?.pickupLocation!.coordinates[0],
            long: trip?.pickupLocation!.coordinates[1],
        });

        console.log(trip._id)

        if (drivers.length > 0) {
            const driver = drivers[0]
            await tripsService.updateMatching(trip._id, driver._id, true);
            io.to(driver.socketId).emit(SOCKET_EMITTERS.DRIVER_NEW_TRIP_FOR, {
                tripId: trip.tripId,
                riderId: trip.riderId,
                pickupLocation: trip?.pickupLocation!.coordinates,
                destination: trip?.destination!.coordinates,
            })
            await ApiTripsService.updateMatching(trip.tripId, driver.driverId);

            // we should emit to the socketid of the rider not riderid

            // TO-DO: emit rider with the trip's driver

            // TODO: join rider and driver to the trip room
        }

    },
    findById: async (id: number): Promise<ITrip | null> => {
        return await Trip.findOne({ tripId: id });
    },
    updateMatching: async (id: Types.ObjectId, driverId: Types.ObjectId, isMatched: boolean) => {
        return await Trip.findByIdAndUpdate(id, { driverId, isMatched });
    },
    deleteOne: async (id: Types.ObjectId) => {
        return await Trip.findByIdAndDelete(id);
    }
};

export default tripsService;