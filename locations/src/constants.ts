// export const SOCKET_EVENTS = {
//     DRIVER_LOCATION_UPDATE: "driverLocationUpdate",
//     DRIVER_AVAILABLE_UPDATE: "driverAvailableUpdate",
//     DRIVER_UPDATE_TRIP_STATUS: "driverUpdateTripStatus",
//     DRIVER_SET_TRIP_ONGOING: "driverSetTripOngoing",
//     DRIVER_SET_TRIP_COMPLETED: "driverSetTripCompleted",
//     RIDER_CONFIRM_TRIP_ONGOING: "riderConfirmTripOngoing",
//     RIDER_CONFIRM_TRIP_COMPLETED: "riderConfirmTripCompleted",
// };

// export const SOCKET_EMITTERS = {
//     DRIVER_NEW_TRIP_FOR: "newTripForYou",
//     RIDER_YOUR_TRIP_MATCHED: "yourTripMatched",
//     RIDER_YOUR_TRIP_ONGOING: "yourTripOngoing",
//     RIDER_YOUR_TRIP_COMPLETED: "yourTripCompleted",
//     TRIP_ONGOING: "tripOngoing",
//     TRIP_COMPLETED: "tripCompleted", 
// };

export const SOCKET_EVENTS = {
  DRIVER_LOCATION_UPDATE: 'driver:location:update',
  DRIVER_AVAILABLE_UPDATE: 'driver:available:update',
  DRIVER_SET_TRIP_ONGOING: 'driver:set:trip:ongoing',
  DRIVER_SET_TRIP_COMPLETED: 'driver:set:trip:completed',
  RIDER_CONFIRM_TRIP_ONGOING: 'rider:confirm:trip:ongoing',
  RIDER_CONFIRM_TRIP_COMPLETED: 'rider:confirm:trip:completed'
};

export const SOCKET_EMITTERS = {
  DRIVER_NEW_TRIP_FOR: 'driver:new:trip:for',
  RIDER_YOUR_TRIP_MATCHED: 'rider:your:trip:matched',
  RIDER_YOUR_TRIP_ONGOING: 'rider:your:trip:ongoing',
  RIDER_YOUR_TRIP_COMPLETED: 'rider:your:trip:completed',
  TRIP_ONGOING: 'trip:ongoing',
  TRIP_COMPLETED: 'trip:completed'
};

