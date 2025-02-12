import React, { useEffect, useState } from "react";
import { SOCKET_EVENTS, SOCKET_EMITTERS } from "../constants";
import { Trip } from "../types";
import { Socket } from "socket.io-client";
interface Props {
  socket: Socket;
}

export const RiderDashboard: React.FC<Props> = ({ socket }: Props) => {
  const [currentTrip, setCurrentTrip] = useState<Trip | null>(null);

  useEffect(() => {
    if (!socket) return;
    socket.on(SOCKET_EMITTERS.RIDER_YOUR_TRIP_MATCHED, (trip: Trip) => {
      setCurrentTrip(trip);
    });

    socket.on(SOCKET_EMITTERS.RIDER_YOUR_TRIP_ONGOING, ({ tripId, status }) => {
      setCurrentTrip((prev) =>
        prev && prev.tripId === tripId ? { ...prev, status } : prev
      );
    });

    socket.on(
      SOCKET_EMITTERS.RIDER_YOUR_TRIP_COMPLETED,
      ({ tripId, status }) => {
        setCurrentTrip((prev) =>
          prev && prev.tripId === tripId ? { ...prev, status } : prev
        );
      }
    );

    return () => {
      socket.off(SOCKET_EMITTERS.RIDER_YOUR_TRIP_MATCHED);
      socket.off(SOCKET_EMITTERS.RIDER_YOUR_TRIP_ONGOING);
      socket.off(SOCKET_EMITTERS.RIDER_YOUR_TRIP_COMPLETED);
    };
  }, [socket]);

  const confirmTripOngoing = () => {
    if (currentTrip) {
      socket?.emit(
        SOCKET_EVENTS.RIDER_CONFIRM_TRIP_ONGOING,
        currentTrip.tripId,
        "ongoing"
      );
    }
  };

  const confirmTripCompleted = () => {
    if (currentTrip) {
      socket?.emit(
        SOCKET_EVENTS.RIDER_CONFIRM_TRIP_COMPLETED,
        currentTrip.tripId,
        "completed"
      );
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Rider Dashboard</h1>

      {currentTrip ? (
        <div className="mt-4 p-4 border-4 rounded border-gray-300 border-dashed">
          <h2 className="text-xl font-semibold">Current Trip</h2>
          <p>Trip ID: {currentTrip.tripId}</p>
          <p>Driver ID: {currentTrip.driverId}</p>
          <p>Status: {currentTrip?.status || "pending"}</p>

          <div className="mt-2 space-x-2">
            {currentTrip.status === "ongoing" && (
              <button
                onClick={confirmTripOngoing}
                className="px-4 py-2 rounded bg-yellow-500 text-white"
              >
                Please Confirm that Trip is Ongoing
              </button>
            )}
            {currentTrip.status === "completed" && (
              <button
                onClick={confirmTripCompleted}
                className="px-4 py-2 rounded bg-green-500 text-white"
              >
                Please Confirm that Trip is Completed
              </button>
            )}
          </div>
        </div>
      ) : (
        <p>No active trips</p>
      )}
    </div>
  );
};
