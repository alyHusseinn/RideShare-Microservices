import env from "../config/env";

const ApiTripsService = {
    updateMatching: async (tripId: number, driverId: number) => {
        const res = await fetch(env.TRIPS_SERVICE_URL!, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                tripId,
                driverId,
            }),
        })

        if (res.ok) {
            return true;
        } else {
            return false;
        }
    },
    updateStatus: async (tripId: number, status: "ongoing" | "completed") => {
        const res = await fetch(env.TRIPS_SERVICE_URL!, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                tripId,
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