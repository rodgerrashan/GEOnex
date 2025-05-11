import React, { useState, useRef, useEffect, useContext } from "react";
import { MapContainer, TileLayer, useMap, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { assets } from "../assets/assets";
import PointRecorded from "./PointRecorded";
import ConfirmDiscard from "./ConfirmDiscard";
import { Context } from "../context/Context";
import { useParams } from "react-router-dom";
import mqtt from "mqtt"; 

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

// Custom hook for MQTT data
function useMQTTData(brokerUrl, topics) {
  const [mqttData, setMqttData] = useState({
    latitude: null,
    longitude: null,
    deviceId: null,
    timestamp: null,
    connectionStatus: "Disconnected"
  });
  const clientRef = useRef(null);

  useEffect(() => {
    // Initialize and connect MQTT client
    const client = mqtt.connect(brokerUrl, {
      clientId: `react_${Math.random().toString(16).slice(2, 8)}`,
      clean: true,
      reconnectPeriod: 3000
    });

    clientRef.current = client;

    // Handle connection events
    client.on('connect', () => {
      console.log('Connected to MQTT broker');
      setMqttData(prev => ({ ...prev, connectionStatus: "Connected" }));
      
      // Subscribe to provided topics
      if (Array.isArray(topics)) {
        topics.forEach(topic => {
          client.subscribe(topic, (err) => {
            if (err) console.error(`Error subscribing to ${topic}:`, err);
            else console.log(`Subscribed to ${topic}`);
          });
        });
      } else if (typeof topics === 'string') {
        client.subscribe(topics, (err) => {
          if (err) console.error(`Error subscribing to ${topics}:`, err);
          else console.log(`Subscribed to ${topics}`);
        });
      }
    });

    client.on('message', (topic, message) => {
      console.log(`Message received on ${topic}:`, message.toString());
      try {
        const payload = JSON.parse(message.toString());
        
        // Process and update state based on the message
        // Adjust this part based on your actual MQTT message format
        if (payload.lat !== undefined && payload.lng !== undefined) {
          setMqttData(prev => ({
            ...prev,
            latitude: payload.lat,
            longitude: payload.lng,
            deviceId: payload.deviceId || prev.deviceId,
            timestamp: payload.timestamp || new Date().toISOString()
          }));
        }
      } catch (e) {
        console.error("Error parsing MQTT message:", e);
      }
    });

    client.on('error', (err) => {
      console.error('MQTT connection error:', err);
      setMqttData(prev => ({ ...prev, connectionStatus: "Error" }));
    });

    client.on('reconnect', () => {
      console.log('Attempting to reconnect to MQTT broker');
      setMqttData(prev => ({ ...prev, connectionStatus: "Reconnecting" }));
    });

    client.on('disconnect', () => {
      console.log('Disconnected from MQTT broker');
      setMqttData(prev => ({ ...prev, connectionStatus: "Disconnected" }));
    });

    // Cleanup function
    return () => {
      if (client) {
        console.log('Cleaning up MQTT connection');
        client.end(true);
      }
    };
  }, [brokerUrl]); // Re-initialize if broker URL changes

  return mqttData;
}

const MapSection = () => {
  const { projectId } = useParams();

  const [center, setCenter] = useState({ lat: 7.254822, lng: 80.59215 });
  const ZOOM_LEVEL = 24;
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

  // Define your MQTT broker URL and topics here
  const MQTT_BROKER_URL = "mqtt://broker.example.com:1883"; // Replace with your broker URL
  const MQTT_TOPICS = ["device/location", "device/status"]; // Replace with your topics
  
  // Use our custom hook to get MQTT data and connection status
  const mqttData = useMQTTData(MQTT_BROKER_URL, MQTT_TOPICS);

  // Update the map center when MQTT data updates
  useEffect(() => {
    if (mqttData.latitude && mqttData.longitude) {
      setCenter({
        lat: mqttData.latitude,
        lng: mqttData.longitude,
      });
    }
  }, [mqttData.latitude, mqttData.longitude]);

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
    <div className="w-full h-full relative">
      <MapContainer
        center={center}
        zoom={ZOOM_LEVEL}
        ref={mapRef}
        className="w-full h-full"
      >
        <TileLayer
          url="https://api.maptiler.com/maps/basic-v2/256/{z}/{x}/{y}.png?key=adWhcNjZozsvPpfwl4Zo"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        <RecenterAutomatically center={center} />
        <MapFix />
        
        {/* Live Device Marker from MQTT */}
        {mqttData.latitude && mqttData.longitude && (
          <Marker position={[mqttData.latitude, mqttData.longitude]} icon={markerIcon}>
            <Popup>
              <b>Device</b>
              <br />
              {mqttData.deviceId || "Unknown Device"}
              <br />
              Last update: {new Date(mqttData.timestamp).toLocaleTimeString()}
            </Popup>
          </Marker>
        )}

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
          </div>
        )}
      </MapContainer>

      {/* Display connection status */}
      <div className="absolute top-4 left-4 bg-white p-2 rounded shadow z-[1000]">
        <p>MQTT Status: {mqttData.connectionStatus}</p>
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
          <PointRecorded sensorData={mqttData} projectId={projectId} />
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