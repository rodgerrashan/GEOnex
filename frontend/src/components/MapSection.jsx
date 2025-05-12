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

  const [center, setCenter] = useState({ lat: 7.254822, lng: 80.59215 });
  const ZOOM_LEVEL = 20;
  const mapRef = useRef();

  const { width } = useWindowSize();

  const [base, setBase] = useState({ lat: 7.254822, lng: 80.59252 });
  


  const {
    navigate,
    backendUrl,
    points,
    fetchPoints,
    setPoints,
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


  // Update rover positions based on sensor data
  useEffect(() => {
    console.log("Sensor Data:", sensorData);
    if (sensorData && sensorData[rovers[0]] && sensorData[rovers[0]].latitude && sensorData[rovers[0]].longitude) {
      setRover({
        lat: sensorData[rovers[0]].latitude,
        lng: sensorData[rovers[0]].longitude,
      });
    }
    if (sensorData && sensorData[rovers[1]] && sensorData[rovers[1]].latitude && sensorData[rovers[1]].longitude) {
      setBase({
        lat: sensorData[rovers[1]].latitude,
        lng: sensorData[rovers[1]].longitude,
      });
    }
  }, [sensorData, rovers]);

 

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


  useEffect(() => {
    if (rover.lat && rover.lng && base.lat && base.lng) {
      // Calculate the center point between rover and base
      const centerLat = (rover.lat + base.lat) / 2;
      const centerLng = (rover.lng + base.lng) / 2;
      
      setCenter({
        lat: centerLat,
        lng: centerLng
      });
    } else if (rover.lat && rover.lng) {
      // If only rover position is available
      setCenter({
        lat: rover.lat,
        lng: rover.lng
      });
    } else if (base.lat && base.lng) {
      // If only base position is available
      setCenter({
        lat: base.lat,
        lng: base.lng
      });
    }
  }, [rover, base]);

  

  
  useEffect(() => {
    console.log("Sensor Data:", sensorData);
    if (sensorData && 
      typeof sensorData.latitude === 'number' && 
      typeof sensorData.longitude === 'number') {
      setCenter({
      lat: sensorData.latitude,
      lng: sensorData.longitude,
      });
    }
  }, [sensorData]);

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
  const markerIcon = new L.Icon({
    iconUrl: assets.location_point,
    iconSize,
    iconAnchor: [iconSize[0] / 2, iconSize[1]],
    popupAnchor: [0, -iconSize[1]],
  });
  const markerIconDevice = new L.Icon({
    iconUrl: assets.device_point,
    iconSize,
    iconAnchor: [iconSize[0] / 2, iconSize[1]],
    popupAnchor: [0, -iconSize[1]],
  });
  const markerIconBase = new L.Icon({
    iconUrl: assets.base_point,
    iconSize,
    iconAnchor: [iconSize[0] / 2, iconSize[1]],
    popupAnchor: [0, -iconSize[1]],
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
        {/* Live Device Markers
        {rovers.map((deviceName) => {
          console.log("Device Name:", deviceName);
          const roverData = sensorData[deviceName];
          if (roverData && roverData.latitude && roverData.longitude) {
            return (
              <Marker 
                key={deviceName}
                position={[roverData.latitude, roverData.longitude]} 
                icon={markerIcon}
              >
                <Popup>
                  <b>Device</b>
                  <br />
                  {roverData.deviceName || roverId}
                </Popup>
              </Marker>
            );
          }
          return null;
        })} */}

        {/* Base Device Marker */}
        <Marker position={[base.lat, base.lng]} icon={markerIconBase}>
          <Popup>
            <b>Base</b>
          </Popup>
        </Marker>

        {/* Recorded Points Markers (from Context)
        {!loadingPoints &&
          points.map((point) => (
            <Marker
              key={point._id}
              position={[point.Latitude, point.Longitude]}
              icon={markerIconDevice}
            >
              <Popup>
                <b>{point.Name}</b>
              </Popup>
            </Marker>
          ))} */}

        {/* Loading Overlay */}
        {loadingPoints && (
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-[1500]">
            <p>Loading recorded points...</p>
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
        {/* Button 1 */}
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
          <PointRecorded sensorData={sensorData} projectId={projectId} />
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