export const SOCKET_EVENTS = {
  DRIVER_LOCATION_UPDATE: 'driver_location_update',
  DRIVER_AVAILABLE_UPDATE: 'driver_available_update',
  DRIVER_SET_TRIP_ONGOING: 'driver_set_trip_ongoing',
  DRIVER_SET_TRIP_COMPLETED: 'driver_set_trip_completed',
  RIDER_CONFIRM_TRIP_ONGOING: 'rider_confirm_trip_ongoing',
  RIDER_CONFIRM_TRIP_COMPLETED: 'rider_confirm_trip_completed'
};

export const SOCKET_EMITTERS = {
  DRIVER_NEW_TRIP_FOR: 'driver_new_trip_for',
  RIDER_YOUR_TRIP_MATCHED: 'rider_your_trip_matched',
  RIDER_YOUR_TRIP_ONGOING: 'rider_your_trip_ongoing',
  RIDER_YOUR_TRIP_COMPLETED: 'rider_your_trip_completed',
  TRIP_ONGOING: 'trip_ongoing',
  TRIP_COMPLETED: 'trip_completed'
};