import React, { useState, useRef, useEffect, useContext } from "react";
import { MapContainer, TileLayer, useMap, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { assets } from "../assets/assets";
import PointRecorded from "./PointRecorded";
import ConfirmDiscard from "./ConfirmDiscard";
import { Context } from "../context/Context";
import useSensorData from "./useSensorData";
import { useParams } from "react-router-dom";

const markerIcon = new L.Icon({
  iconUrl: assets.location_point,
  iconSize: [40, 40],
  iconAnchor: [17, 46], //[left/right, top/bottom]
  popupAnchor: [0, -46], //[left/right, top/bottom]
});

const markerIconDevice = new L.Icon({
  iconUrl: assets.device_point,
  iconSize: [40, 40],
  iconAnchor: [17, 46], //[left/right, top/bottom]
  popupAnchor: [0, -46], //[left/right, top/bottom]
});

const markerIconBase = new L.Icon({
  iconUrl: assets.base_point,
  iconSize: [40, 40],
  iconAnchor: [17, 46], //[left/right, top/bottom]
  popupAnchor: [0, -46], //[left/right, top/bottom]
});

const MapSection = () => {
  const { projectId } = useParams();

  const [center, setCenter] = useState({ lat: 7.254822, lng: 80.59215 });
  const ZOOM_LEVEL = 24;
  const mapRef = useRef();

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

  // Define your WebSocket URL here
  const WS_URL = "http://13.61.32.218:5000";
  // Use our custom hook to get sensor data and connection status
  const { sensorData, connectionStatus } = useSensorData(WS_URL);

  // Update the map center when sensor data updates
  useEffect(() => {
    if (sensorData.latitude && sensorData.longitude) {
      setCenter({
        lat: sensorData.latitude,
        lng: sensorData.longitude,
      });
    }
  }, [sensorData.latitude, sensorData.longitude]);

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

  return (
    <div className="w-full h-full relative">
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
        {/* Live Device Marker */}
        <Marker position={[center.lat, center.lng]} icon={markerIcon}>
          <Popup>
            <b>Device</b>
            <br />
            {sensorData.deviceId || "Unknown Device"}
          </Popup>
        </Marker>

        {/* Base Device Marker */}
        <Marker position={[base.lat, base.lng]} icon={markerIconBase}>
          <Popup>
            <b>Base</b>
          </Popup>
        </Marker>

        {/* Recorded Points Markers (from Context) */}
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
          ))}

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
      </div>

      {/* Buttons on the bottom right */}
      <div className="absolute bottom-4 right-2 flex flex-col gap-2 z-[1000] items-center">
        {/* Button 1 */}
        <button
          className="bg-black p-3 rounded-full shadow-md w-12 h-12 flex items-center justify-center "
          onClick={() => {
            navigate(`/takenpoints/${projectId}`);
          }}
        >
          <img src={assets.filter} alt="Button 1" className="w-6 h-6" />
        </button>

        {/* Button 2 */}
        <button
          className="bg-orange-500 p-3 rounded-full shadow-md w-12 h-12 flex items-center "
          onClick={() => setShowConfirmDiscard(true)}
        >
          <img src={assets.reverse} alt="Button 2" className="w-6 h-6" />
        </button>

        {/* Button 3 */}
        <button
          className="bg-blue-500 p-4 rounded-full shadow-md w-16 h-16 flex items-center "
          onClick={() => setShowPointRecorded(true)}
        >
          <img src={assets.add_location} alt="Button 3" className="w-8 h-8" />
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
