import React, { useEffect, useState } from "react";
import { Socket } from "socket.io-client";
import { SOCKET_EVENTS, SOCKET_EMITTERS } from "../constants";
import { Trip, Location } from "../types";

interface Props {
  socket: Socket;
}

export const DriverDashboard: React.FC<Props> = ({ socket }: Props) => {
  const [available, setAvailable] = useState(false);
  const [currentTrip, setCurrentTrip] = useState<Trip | null>(null);

  useEffect(() => {
    if (!socket) return;
    socket.on(SOCKET_EMITTERS.DRIVER_NEW_TRIP_FOR, (trip: Trip) => {
      setCurrentTrip(trip);
    });

    const updateLocation = () => {
      // use navigator.geolocation to get the current location
      if(!navigator.geolocation) {
        console.log("Geolocation is not supported by this browser.");
        return;
      }
      navigator.geolocation.getCurrentPosition((position) => {
        const currentLocation: Location = {
          lat: position.coords.latitude,
          long: position.coords.longitude,
        };
        console.log("Current location:", currentLocation);
        socket.emit(SOCKET_EVENTS.DRIVER_LOCATION_UPDATE, currentLocation);
      });
    };

    const updateInvtervalInMiliseconds = 60000; // 10 minutes

    const updateLocationInverval = setInterval(() => {
      updateLocation();
    }, updateInvtervalInMiliseconds);

    return () => {
      socket.off(SOCKET_EMITTERS.DRIVER_NEW_TRIP_FOR);
      clearInterval(updateLocationInverval);
    };
  }, [socket]);

  const toggleAvailability = () => {
    const newAvailable = !available;
    setAvailable(newAvailable);
    socket.emit(SOCKET_EVENTS.DRIVER_AVAILABLE_UPDATE, newAvailable);
  };

  const setTripOngoing = () => {
    if (currentTrip) {
      socket.emit(
        SOCKET_EVENTS.DRIVER_SET_TRIP_ONGOING,
        currentTrip.tripId,
        "ongoing"
      );
    }
  };

  const setTripCompleted = () => {
    if (currentTrip) {
      socket.emit(
        SOCKET_EVENTS.DRIVER_SET_TRIP_COMPLETED,
        currentTrip.tripId,
        "completed"
      );
      setCurrentTrip(null);
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Driver Dashboard</h1>

      <div className="space-y-4">
        <button
          onClick={toggleAvailability}
          className={`px-4 py-2 rounded ${
            available ? "bg-green-500" : "bg-red-500"
          } text-white`}
        >
          {available ? "Available" : "Unavailable"}
        </button>

        {currentTrip && (
          <div className="mt-4 p-4 border rounded">
            <h2 className="text-xl font-semibold">Current Trip</h2>
            <p>Trip ID: {currentTrip.tripId}</p>
            <p>Rider ID: {currentTrip.riderId}</p>
            <div className="mt-2 space-x-2">
              <button
                onClick={setTripOngoing}
                className="px-4 py-2 rounded bg-yellow-500 text-white"
              >
                Start Trip
              </button>
              <button
                onClick={setTripCompleted}
                className="px-4 py-2 rounded bg-green-500 text-white"
              >
                Complete Trip
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
