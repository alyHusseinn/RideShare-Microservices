import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from 'react-leaflet';
import { LatLng, Icon } from 'leaflet';
import { Location } from '../types';
import 'leaflet/dist/leaflet.css';

const icon = new Icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41]
});

// Component to recenter map when user location is found
const LocationUpdater: React.FC<{ center: LatLng }> = ({ center }) => {
  const map = useMap();
  useEffect(() => {
    map.setView(center, 15);
  }, [center, map]);
  return null;
};

const LocationPicker: React.FC<{
  onLocationSelect: (location: Location) => void;
}> = ({ onLocationSelect }) => {
  useMapEvents({
    click(e) {
      onLocationSelect({
        lat: e.latlng.lat,
        long: e.latlng.lng
      });
    }
  });
  return null;
};

export const CreateTrip: React.FC = () => {
  const navigate = useNavigate();
  const [pickupLocation, setPickupLocation] = useState<Location | null>(null);
  const [destination, setDestination] = useState<Location | null>(null);
  const [activeSelection, setActiveSelection] = useState<'pickup' | 'destination'>('pickup');
  const [currentLocation, setCurrentLocation] = useState<LatLng>(new LatLng(40.7128, -74.0060));
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setCurrentLocation(new LatLng(latitude, longitude));
          // Set pickup location to current location by default
          setPickupLocation({ lat: latitude, long: longitude });
          setIsLoading(false);
        },
        (error) => {
          console.error('Error getting location:', error);
          setIsLoading(false);
        }
      );
    } else {
      setIsLoading(false);
    }
  }, []);
  const handleLocationSelect = (location: Location) => {
    if (activeSelection === 'pickup') {
      setPickupLocation(location);
    } else {
      setDestination(location);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!pickupLocation || !destination) return;

    try {
      const response = await fetch('http://localhost:3000/api/trips', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          origin: pickupLocation,
          destination
        }),
        credentials: 'include'
      });

      console.log(pickupLocation)
      console.log(destination)

      if (response.ok) {
        navigate('/');
      } else {
        console.error('Failed to create trip');
      }
    } catch (error) {
      console.error('Error creating trip:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">Loading your location...</div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h2 className="text-3xl font-bold mb-6">Create a New Trip</h2>

      <div className="mb-4">
        <div className="flex space-x-4 mb-4">
          <button
            className={`px-4 py-2 rounded ${
              activeSelection === 'pickup'
                ? 'bg-blue-500 text-white'
                : 'bg-gray-200'
            }`}
            onClick={() => setActiveSelection('pickup')}
          >
            Select Pickup Location
          </button>
          <button
            className={`px-4 py-2 rounded ${
              activeSelection === 'destination'
                ? 'bg-blue-500 text-white'
                : 'bg-gray-200'
            }`}
            onClick={() => setActiveSelection('destination')}
          >
            Select Destination
          </button>
        </div>

        <div className="h-[500px] rounded-lg overflow-hidden shadow-lg">
          <MapContainer
            center={currentLocation}
            zoom={15}
            style={{ height: '100%', width: '100%' }}
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />
            <LocationUpdater center={currentLocation} />
            <LocationPicker onLocationSelect={handleLocationSelect} />
            {pickupLocation && (
              <Marker
                position={[pickupLocation.lat, pickupLocation.long]}
                icon={icon}
              />
            )}
            {destination && (
              <Marker
                position={[destination.lat, destination.long]}
                icon={icon}
              />
            )}
          </MapContainer>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-6">
        <div>
          <h3 className="font-semibold mb-2">Pickup Location</h3>
          {pickupLocation ? (
            <p>
              Lat: {pickupLocation.lat?.toFixed(6)}, Lng:{' '}
              {pickupLocation.long?.toFixed(6)}
            </p>
          ) : (
            <p className="text-gray-500">Click on the map to set pickup location</p>
          )}
        </div>
        <div>
          <h3 className="font-semibold mb-2">Destination</h3>
          {destination ? (
            <p>
              Lat: {destination.lat.toFixed(6)}, Lng:{' '}
              {destination.long.toFixed(6)}
            </p>
          ) : (
            <p className="text-gray-500">Click on the map to set destination</p>
          )}
        </div>
      </div>

      <button
        onClick={handleSubmit}
        disabled={!pickupLocation || !destination}
        className={`w-full py-3 rounded-lg ${
          pickupLocation && destination
            ? 'bg-blue-500 hover:bg-blue-600 text-white'
            : 'bg-gray-300 cursor-not-allowed text-gray-500'
        }`}
      >
        Create Trip
      </button>
    </div>
  );
};