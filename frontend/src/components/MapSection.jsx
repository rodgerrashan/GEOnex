import React, { useState, useRef, useEffect, useContext } from "react";
import { MapContainer, TileLayer, useMap, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { assets } from "../assets/assets";
import PointRecorded from "./PointRecorded";
import ConfirmDiscard from "./ConfirmDiscard";
import { Context } from "../context/Context";
import useSensorData from "./useSensorData";
import useBaseSensorData from "./useBaseSensorData";
import LoadingSpinner from "./LoadingSpinner";

import { useParams } from "react-router-dom";


// const markerIcon = new L.Icon({
//   iconUrl: assets.location_point,
//   iconSize: [40, 40],
//   iconAnchor: [17, 46], //[left/right, top/bottom]
//   popupAnchor: [0, -46], //[left/right, top/bottom]
// });

// const markerIconDevice = new L.Icon({
//   iconUrl: assets.device_point,
//   iconSize: [40, 40],
//   iconAnchor: [17, 46], //[left/right, top/bottom]
//   popupAnchor: [0, -46], //[left/right, top/bottom]
// });

// const markerIconBase = new L.Icon({
//   iconUrl: assets.base_point,
//   iconSize: [40, 40],
//   iconAnchor: [17, 46], //[left/right, top/bottom]
//   popupAnchor: [0, -46], //[left/right, top/bottom]
// });

// Hook to track window width
function useWindowSize() {
  const [size, setSize] = useState({ width: window.innerWidth });
  useEffect(() => {
    const handle = () =>
      setSize({ width: window.innerWidth });
    window.addEventListener("resize", handle);
    return () => window.removeEventListener("resize", handle);
  }, []);
  return size;
}

const MapSection = () => {
  const { projectId } = useParams();
  const ZOOM_LEVEL = 20;
  const mapRef = useRef();
  const { width } = useWindowSize();

  const [base, setBase] = useState({ lat: 7.254822, lng: 80.59252 });
  const [center, setCenter] = useState({ lat: 7.254822, lng: 80.59215 });
  
  const {
    navigate,
    fetchPoints,
    loadingPoints,
    showPointRecorded,
    setShowPointRecorded,
    showConfirmDiscard,
    setShowConfirmDiscard,
  } = useContext(Context);

  // mock devices 
  const rovers = ["device123", "device456"];
  const baseStation = "base123";
  // Define your WebSocket URL here
  const WS_URL = "http://localhost:5000";
  // Use our custom hook to get sensor data and connection status
  const { sensorData, connectionStatus } = useSensorData(WS_URL, rovers);
  const { baseSensorData, baseconnectionStatus } = useBaseSensorData(WS_URL, baseStation);



  // Update the base position when base sensor data updates
  useEffect(() => {
    console.log("Base Sensor Data:", baseSensorData);
    if (baseSensorData &&
      typeof baseSensorData.latitude === 'number' && 
      typeof baseSensorData.longitude === 'number') {
      setBase({
        lat: baseSensorData.latitude,
        lng: baseSensorData.longitude,
      });
    }
  }, [baseSensorData, baseStation]);



  // Update the center position based on rover and base positions
  useEffect(() => {
    // If we have valid sensor data from rovers
    if (Array.isArray(sensorData) && sensorData.length > 0) {

      const validRoverData = sensorData.filter(data => 
      data && typeof data.latitude === 'number' && typeof data.longitude === 'number'
      );

      if (validRoverData.length > 0) {
      // Calculate average of all valid rover positions
      const avgLat = validRoverData.reduce((sum, data) => sum + data.latitude, 0) / validRoverData.length;
      const avgLng = validRoverData.reduce((sum, data) => sum + data.longitude, 0) / validRoverData.length;

      }
    } else if (base) {
        // If no valid rover data, set center to base position
        setCenter({
          lat: base.lat,
          lng: base.lng
        });
      }
    
  }, [sensorData, base]);

  // Fetch previously recorded points from Context when projectId changes
  useEffect(() => {
    if (projectId) {
      fetchPoints(projectId);
    }
  }, [projectId]);

  // Recenter the map when center state changes
  const RecenterAutomatically = ({ center }) => {
    const map = useMap();
    useEffect(() => {
      map.setView(center);
    }, [center, map]);
    return null;
  };

  // Choose marker size based on width
  const getSize = () => {
    if (width < 640) return [30, 30];
    if (width < 768) return [35, 35];
    return [40, 40];
  };
  const [iconSize, setIconSize] = useState(getSize());

  // Update iconSize on resize
  useEffect(() => {
    setIconSize(getSize());
  }, [width]);

  // Create icons with responsive size


  const pulseIcon = L.divIcon({
  className: '',
  html: `
    <div class="relative w-10 h-10">
      <div class="absolute w-full h-full bg-blue-500 rounded-full opacity-60 animate-pulse-signal"></div>
      <div class="absolute w-2.5 h-2.5 bg-blue-600 rounded-full top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10"></div>
    </div>
  `,
  iconSize: [20, 20],
  iconAnchor: [10, 10],
});

const baseIcon = L.divIcon({
  className: '',
  html: `
    <div class="relative w-12 h-12">
      <div class="absolute w-full h-full bg-green-500 rounded-full opacity-60 animate-wave"></div>
      <div class="absolute w-full h-full bg-green-500 rounded-full opacity-60 animate-wave-delay"></div>
      <div class="absolute w-3 h-3 bg-green-600 rounded-full top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10"></div>
    </div>
  `,
  iconSize: [24, 24],
  iconAnchor: [12, 12],
});


  return (
    <div className="w-full h-full relative ">
      <MapContainer
        center={center}
        zoom={ZOOM_LEVEL}
        ref={mapRef}
        className="w-full h-full"
      >
        <TileLayer
          url="https://api.maptiler.com/maps/basic-v2/256/{z}/{x}/{y}.png?key=adWhcNjZozsvPpfwl4Zo"
          //https://api.maptiler.com/maps/outdoor-v2/256/{z}/{x}/{y}.png?key=adWhcNjZozsvPpfwl4Zo
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        <RecenterAutomatically center={center} />

        <MapFix />
        {/* Live Device Markers */}
        {sensorData.map((data) => (
          <Marker
            key={data.deviceName}
            position={[data.latitude, data.longitude]}
            icon={pulseIcon}
          >
            <Popup>
              <b>{data.deviceName}</b>
              <p>Status: {data.status}</p>
            </Popup>
          </Marker>
        ))}

        {/* Base Device Marker */}
        <Marker position={[base.lat, base.lng]} icon={baseIcon}>
          <Popup>
  <div class="p-2 w-56 text-sm">
    {/* Header */}
      <div class="flex items-center space-x-2 mb-1">
        <svg class="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20"></svg>
        <path d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"/>
        
        <span class="font-semibold truncate">{base.deviceName}</span>
      </div>

      {/* Status */}
    <div class="flex items-center space-x-1 mb-1">
      <span class="text-gray-600">Status:</span>
      <span class="px-1.5 py-0.5 bg-green-100 text-green-700 rounded text-xs">{base.status}</span>
    </div>

    {/* Battery & Signal */}
    <div class="flex items-center justify-between">
      <div class="flex items-center space-x-1">
        <svg class="w-4 h-4 text-yellow-500" fill="currentColor" viewBox="0 0 24 24">
          <path d="M16 4h-1V2h-6v2H8a2 2 0 00-2 2v12a2 2 0 002 2h8a2 2 0 002-2V6a2 2 0 00-2-2zM8 6h8v12H8V6z"/>
        </svg>
        <span>{base.batteryLevel}%</span>
      </div>
      <div class="flex items-center space-x-1">
        <svg class="w-4 h-4 text-blue-500 animate-pulse" fill="currentColor" viewBox="0 0 20 20">
          <path d="M2 14s2-4 6-4 6 4 6 4h2s-2-6-8-6-8 6-8 6h2z"/>
        </svg>
        <span>{base.signalStrength} dBm</span>
      </div>
    </div>
  </div>
</Popup>


        </Marker>
        

        {/* Loading Overlay */}
        {loadingPoints && (
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-[1500] backdrop-blur-0">
            <LoadingSpinner size={10}/>
            {/* Replace with a spinner or skeleton loader if desired */}
          </div>
        )}
      </MapContainer>

      {/* Display connection status (optional for debugging) */}
      <div className="absolute top-4 left-4 bg-white p-2 rounded shadow">
        <p>Status: {connectionStatus}</p>
        <p>Base Status: {baseconnectionStatus}</p>
      </div>

      {/* Buttons on the bottom right */}
      <div className="absolute bottom-4 right-2 flex flex-col gap-1 md:gap-2 z-[1000] items-center">
        {/* Taken points button */}
        <button
          className="bg-black p-2 md:p-3 rounded-full shadow-md w-8 h-8 md:w-12 md:h-12 flex items-center justify-center "
          onClick={() => {
            navigate(`/takenpoints/${projectId}`);
          }}
        >
          <img src={assets.filter} alt="Button 1" className="w-4 h-4 md:w-6 md:h-6" />
        </button>

        {/* Button 2 */}
        <button
          className="bg-orange-500 p-2 md:p-3 rounded-full shadow-md w-8 h-8 md:w-12 md:h-12 flex items-center "
          onClick={() => setShowConfirmDiscard(true)}
        >
          <img src={assets.reverse} alt="Button 2" className="w-4 h-4 md:w-6 md:h-6" />
        </button>

        {/* Button 3 */}
        <button
          className="bg-blue-500 p-3 md:p-4 rounded-full shadow-md w-10 h-10 md:w-16 md:h-16 flex items-center "
          onClick={() => setShowPointRecorded(true)}
        >
          <img src={assets.add_location} alt="Button 3" className="w-4 h-4 md:w-8 md:h-8" />
        </button>
      </div>

      {/* Show Point Recorded Popup */}
      {showPointRecorded && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/30 backdrop-blur-[5px] z-[2000]">
          <PointRecorded sensorData={sensorData} baseData={baseSensorData} projectId={projectId} />
        </div>
      )}

      {/* Show Confirm Discard Popup */}
      {showConfirmDiscard && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/30 backdrop-blur-[5px] z-[2000]">
          <ConfirmDiscard projectId={projectId}/>
        </div>
      )}
    </div>
  );
};

// Custom component to invalidate size on load
const MapFix = () => {
  const map = useMap();
  useEffect(() => {
    setTimeout(() => {
      map.invalidateSize();
    }, 400); // Small delay ensures proper resizing
  }, [map]);
  return null;
};

export default MapSection;