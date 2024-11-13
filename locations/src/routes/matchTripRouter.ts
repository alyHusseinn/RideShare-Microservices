import { Router } from "express";
import { z } from "zod";
import { Server } from "socket.io";
import TripsService from "../services/tripsService";

const router = Router();

const zodSchema = z.object({
    ID: z.number(),
    rider_id: z.number(),
    origin: z.object({
        lat: z.number(),
        long: z.number(),
    }),
    destination: z.object({
        long: z.number(),
        lat: z.number(),
    })
});

/**
 *  POST / to match a trip with available driver if find one
 *  if not set it as not matched till available driver exists
 */
function matchRouter(io: Server): Router {
    router.post("/", async (req, res) => {
        try {
            const { ID, rider_id, origin, destination } = zodSchema.parse(req.body);

            const trip = await TripsService.createOne(ID, rider_id, origin, destination);
            console.log("Trip created:", trip);
            TripsService.matchTrip(io, trip);
            res.status(200).json({ message: "New trip added, looking for a driver...." });
        } catch (error) {
            console.error(error);
            if (error instanceof z.ZodError) {
                res.status(400).json({ error: "Invalid request body" });
            } else {
                res.status(500).json({ error: "Internal server error" });
            }
        }
    });
    return router;
}

export default matchRouter;