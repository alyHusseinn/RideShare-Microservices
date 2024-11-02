export const SOCKET_EVENTS = {
    DRIVER_LOCATION_UPDATE: "driverLocationUpdate",
    DRIVER_AVAILABLE_UPDATE: "driverAvailableUpdate",
    DRIVER_UPDATE_TRIP_STATUS: "driverUpdateTripStatus",
    DRIVER_SET_TRIP_ONGOING: "driverSetTripOngoing",
    DRIVER_SET_TRIP_COMPLETED: "driverSetTripCompleted",
    RIDER_CONFIRM_TRIP_ONGOING: "riderConfirmTripOngoing",
    RIDER_CONFIRM_TRIP_COMPLETED: "riderConfirmTripCompleted",
};

export const SOCKET_EMITTERS = {
    DRIVER_NEW_TRIP_FOR: "newTripForYou",
    RIDER_YOUR_TRIP_MATCHED: "yourTripMatched",
    RIDER_YOUR_TRIP_ONGOING: "yourTripOngoing",
    RIDER_YOUR_TRIP_COMPLETED: "yourTripCompleted",
    TRIP_ONGOING: "tripOngoing",
    TRIP_COMPLETED: "tripCompleted", 
};

