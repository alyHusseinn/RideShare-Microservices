import { Server, Socket } from "socket.io";
import TripsService from "./services/tripsService";
import DriversService from "./services/driversService";
import { type Location } from "./types"
import ApiTripsService from "./services/apiTripService";
import { SOCKET_EMITTERS, SOCKET_EVENTS } from "./constants";
import { ITrip } from "./models/trips";
import { IDriver } from "./models/drivers";

const riderSockets: Map<number, { socketId: string, username: string }> = new Map();

const socketHandler = (io: Server) => {
    const handleDriverConnection = (socket: Socket, driverId: string, username: string) => {
        DriversService.createOne(+driverId, username, socket.id);
    };

    const handleRiderConnection = (socket: Socket, riderId: string, username: string) => {
        riderSockets.set(+riderId, { socketId: socket.id, username });
    };

    const handleTripMatching = async (socket: Socket, trip: ITrip, driver: IDriver) => {
        await TripsService.updateMatching(trip._id, driver!._id, true);
        await ApiTripsService.updateMatching(trip.tripId, driver?.driverId!);

        io.to(socket.id).emit(SOCKET_EMITTERS.DRIVER_NEW_TRIP_FOR, {
            tripId: trip.tripId,
            riderId: trip.riderId,
            pickupLocation: trip.pickupLocation,
            destination: trip.destination,
        });

        io.to(riderSockets.get(trip.riderId)?.socketId!).emit(SOCKET_EMITTERS.RIDER_YOUR_TRIP_MATCHED, {
            tripId: trip.tripId,
            driverId: driver?.driverId,
        });

        socket.join(`trip-${trip.tripId}`);
        // put the rider with socketId in the trip room
        const riderSocketId = riderSockets.get(trip.riderId)
        const riderSocket = io.sockets.sockets.get(riderSocketId?.socketId!);
        riderSocket?.join(`trip-${trip.tripId}`);
    };

    io.on("connection", (socket) => {
        console.log("a user connected");

        const userId = socket.handshake.query["x-user-id"] as string;
        const username = socket.handshake.query["x-user-name"] as string;
        const isDriver = socket.handshake.query["x-user-role"] === "driver";

        console.log("User ID:", userId, "Username:", username, "Is Driver:", isDriver);

        if (isDriver) {
            handleDriverConnection(socket, userId, username);
        } else {
            handleRiderConnection(socket, userId, username);
        }

        socket.on(SOCKET_EVENTS.DRIVER_LOCATION_UPDATE, async (location: Location) => {
            const nearbyTrips = await TripsService.findNearby(location);

            if (nearbyTrips.length > 0) {
                const trip = nearbyTrips[0];
                const driver = await DriversService.updateAvilability(socket.id, true);
                if (driver) {
                    await handleTripMatching(socket, trip, driver);
                }
            }
        });
        socket.on(SOCKET_EVENTS.DRIVER_AVAILABLE_UPDATE, async (available: boolean) => {
            await DriversService.updateAvilability(socket.id, available);
        });

        socket.on(SOCKET_EVENTS.DRIVER_SET_TRIP_ONGOING, async (tripId: number, status: string) => {
            const trip = await TripsService.findById(tripId);
            if (trip) {
                const riderSocketId = riderSockets.get(trip.riderId)?.socketId;
                if (riderSocketId) {
                    io.to(riderSocketId).emit(SOCKET_EMITTERS.RIDER_YOUR_TRIP_ONGOING, {
                        tripId: trip.tripId,
                        status,
                    });
                }
            }
        });

        socket.on(SOCKET_EVENTS.DRIVER_SET_TRIP_COMPLETED, async (tripId: number, status: string) => {
            const trip = await TripsService.findById(tripId);
            if (trip) {
                const riderSocketId = riderSockets.get(trip.riderId)?.socketId;
                if (riderSocketId) {
                    io.to(riderSocketId).emit(SOCKET_EMITTERS.RIDER_YOUR_TRIP_COMPLETED, {
                        tripId: trip.tripId,
                        status,
                    });
                }
            }
        });
        socket.on(SOCKET_EVENTS.RIDER_CONFIRM_TRIP_ONGOING, async (tripId: number, status: string) => {
            const trip = await TripsService.findById(tripId);
            if (trip) {
                await ApiTripsService.updateStatus(trip.tripId, "ongoing");
                io.to(`trip-${trip.tripId}`).emit(SOCKET_EMITTERS.TRIP_ONGOING, {
                    tripId: trip.tripId
                });
            }
        });

        socket.on(SOCKET_EVENTS.RIDER_CONFIRM_TRIP_COMPLETED, async (tripId: number, status: string) => {
            const trip = await TripsService.findById(tripId);
            if (trip) {
                try {
                    await ApiTripsService.updateStatus(trip.tripId, "completed");
                    await TripsService.deleteOne(trip._id);
                    io.to(`trip-${trip.tripId}`).emit(SOCKET_EMITTERS.TRIP_COMPLETED, {
                        tripId: trip.tripId,
                    });
                } catch (err) {
                    console.log(err);
                }
            }
        });

        // TODO: handle Notifing riders or drivers when one of them is disconnected or offline

        // TODO: Don't delete driver's data when disconnected and have trip ongoing 
        // and find a way to map him to his data when  he reconnects

        socket.on("disconnect", () => {
            console.log("user disconnected");
            if (isDriver) {
                DriversService.deleteOne(+userId);
            } else {
                riderSockets.delete(+userId);
            }
        });
    });
};

export default socketHandler;