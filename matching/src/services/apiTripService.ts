import env from "../config/env";

const ApiTripsService = {
    updateMatching: async (tripId: number, driverId: number) => {
        const res = await fetch(env.TRIPS_SERVICE_URL! + "/" + tripId, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                driver_id: driverId,
                status: "pending",
            }),
        })

        if (res.ok) {
            return true;
        } else {
            return false;
        }
    },
    updateStatus: async (tripId: number, driverId: number, status: "ongoing" | "completed") => {
        const res = await fetch(env.TRIPS_SERVICE_URL! + "/" + tripId, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                driver_id: driverId,
                status,
            }),
        })
        if (res.ok) {
            return true;
        } else {
            return false;
        }
    },
}

export default ApiTripsService;