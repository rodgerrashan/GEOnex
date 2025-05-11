import React, { useState, useEffect } from "react";
import { MapPin, Battery, Signal, Radio, Settings, Globe } from "lucide-react";

// In a real implementation, you would import actual map libraries
const MapComponent = ({ children, center, zoom }) => {
  return (
    <div className="relative w-full h-full bg-blue-50 rounded-lg overflow-hidden">
      {/* This would be replaced with actual map component in production */}
      <div className="absolute inset-0 bg-blue-50 flex flex-col items-center justify-center">
        <Globe className="w-12 h-12 text-blue-300 mb-2" />
        <span className="text-blue-400 font-medium">Interactive Map</span>
        <span className="text-blue-400 text-sm">Center: {center[0].toFixed(4)}, {center[1].toFixed(4)} | Zoom: {zoom}</span>
      </div>
      {children}
    </div>
  );
};

const MapSection = () => {
  // State for devices and points
  const [baseStations, setBaseStations] = useState([]);
  const [clientDevices, setClientDevices] = useState([]);
  const [points, setPoints] = useState([]);
  
  // Map/Polygon view toggle
  const [viewMode, setViewMode] = useState("map");
  
  // Animation state
  const [animationFrame, setAnimationFrame] = useState(0);
  
  // Map properties
  const [mapCenter, setMapCenter] = useState([51.505, -0.09]);
  const [mapZoom, setMapZoom] = useState(13);
  
  // Mock data for demonstration
  useEffect(() => {
    // Simulating fetching base stations and client devices
    const mockBaseStations = [
      { id: 1, Name: "Base-1", lat: 51.505, lng: -0.09, battery: 85, signal: 95 },
      { id: 2, Name: "Base-2", lat: 51.51, lng: -0.1, battery: 72, signal: 88 }
    ];
    
    const mockClientDevices = [
      { id: 1, Name: "Client-1", lat: 51.507, lng: -0.11, battery: 65, signal: 78 },
      { id: 2, Name: "Client-2", lat: 51.503, lng: -0.085, battery: 42, signal: 63 }
    ];
    
    const mockPoints = [
      { id: 1, lat: 51.505, lng: -0.09 },
      { id: 2, lat: 51.51, lng: -0.1 },
      { id: 3, lat: 51.507, lng: -0.11 },
      { id: 4, lat: 51.503, lng: -0.085 }
    ];
    
    setBaseStations(mockBaseStations);
    setClientDevices(mockClientDevices);
    setPoints(mockPoints);
    
    // In a real application, you would fetch data from your API here
  }, []);
  
  // Animation effect for transmission indicators
  useEffect(() => {
    const interval = setInterval(() => {
      setAnimationFrame(prev => (prev + 1) % 3);
    }, 800);
    
    return () => clearInterval(interval);
  }, []);
  
  // Function to calculate pixel position on the mock map
  // In a real implementation, you would use the map's projection methods
  const getPixelPosition = (lat, lng) => {
    // Simple linear transformation for demo purposes
    const x = ((lng - mapCenter[1]) * 2000) + 500;
    const y = ((mapCenter[0] - lat) * 2000) + 300;
    return { x, y };
  };
  
  // Render transmit animation circle
  const renderTransmitAnimation = (type) => {
    const sizes = ["w-6 h-6", "w-12 h-12", "w-16 h-16"];
    const colors = type === "base" 
      ? ["bg-blue-500/30", "bg-blue-500/20", "bg-blue-500/10"] 
      : ["bg-green-500/30", "bg-green-500/20", "bg-green-500/10"];
    
    return (
      <div className="absolute -top-8 -left-8">
        {sizes.map((size, i) => (
          <div 
            key={i}
            className={`absolute rounded-full ${size} ${colors[i]} 
                       ${i === animationFrame ? "opacity-100" : "opacity-0"} 
                       transition-opacity duration-300`}
          />
        ))}
      </div>
    );
  };
  
  // Render device status card
  const renderDeviceStatus = (device) => (
    <div className="flex flex-col items-center bg-white p-2 rounded-lg shadow-lg">
      <div className="font-bold text-sm">{device.Name}</div>
      <div className="flex items-center gap-1 text-xs mt-1">
        <Battery className="w-4 h-4 text-gray-600" />
        <span className={`${device.battery > 50 ? 'text-green-600' : 'text-red-600'}`}>
          {device.battery}%
        </span>
        <Signal className="w-4 h-4 ml-2 text-gray-600" />
        <span className={`${device.signal > 60 ? 'text-green-600' : 'text-red-600'}`}>
          {device.signal}%
        </span>
      </div>
    </div>
  );
  
  // Render map view with devices and markers
  const renderMapView = () => (
    <MapComponent center={mapCenter} zoom={mapZoom}>
      {/* Base Stations */}
      {baseStations.map((station) => {
        const pos = getPixelPosition(station.lat, station.lng);
        return (
          <div 
            key={station.id}
            className="absolute transform -translate-x-1/2 -translate-y-1/2"
            style={{ left: `${pos.x}px`, top: `${pos.y}px` }}
          >
            <div className="relative">
              {renderTransmitAnimation("base")}
              <div className="bg-blue-600 p-2 rounded-full text-white relative z-10">
                <Radio className="w-6 h-6" />
              </div>
              <div className="absolute -bottom-24 left-1/2 transform -translate-x-1/2 mt-2 z-20">
                {renderDeviceStatus(station)}
              </div>
            </div>
          </div>
        );
      })}
      
      {/* Client Devices */}
      {clientDevices.map((device) => {
        const pos = getPixelPosition(device.lat, device.lng);
        return (
          <div 
            key={device.id}
            className="absolute transform -translate-x-1/2 -translate-y-1/2"
            style={{ left: `${pos.x}px`, top: `${pos.y}px` }}
          >
            <div className="relative">
              {renderTransmitAnimation("client")}
              <div className="bg-green-600 p-2 rounded-full text-white relative z-10">
                <MapPin className="w-6 h-6" />
              </div>
              <div className="absolute -bottom-24 left-1/2 transform -translate-x-1/2 mt-2 z-20">
                {renderDeviceStatus(device)}
              </div>
            </div>
          </div>
        );
      })}
    </MapComponent>
  );
  
  // Render polygon view with lines connecting points
  const renderPolygonView = () => (
    <div className="relative w-full h-full bg-blue-50 rounded-lg overflow-hidden">
      <div className="absolute inset-0 bg-blue-50 flex flex-col items-center justify-center">
        <Settings className="w-12 h-12 text-blue-300 mb-2" />
        <span className="text-blue-400 font-medium">Polygon View</span>
      </div>
      
      {/* SVG for polygon visualization */}
      <svg className="absolute inset-0 w-full h-full">
        {points.length > 0 && (
          <polygon 
            points={points.map(p => {
              const pos = getPixelPosition(p.lat, p.lng);
              return `${pos.x},${pos.y}`;
            }).join(' ')}
            className="fill-blue-300/30 stroke-blue-600 stroke-2"
          />
        )}
      </svg>
      
      {/* Points */}
      {points.map((point, index) => {
        const pos = getPixelPosition(point.lat, point.lng);
        return (
          <div 
            key={index}
            className="absolute transform -translate-x-1/2 -translate-y-1/2"
            style={{ left: `${pos.x}px`, top: `${pos.y}px` }}
          >
            <div className="bg-blue-600 w-4 h-4 rounded-full border-2 border-white" />
            <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 text-xs font-medium bg-white px-1 rounded shadow">
              Point {index + 1}
            </div>
          </div>
        );
      })}
    </div>
  );
  
  return (
    <div className="w-full h-full flex flex-col">
      {/* View Toggle */}
      <div className="flex items-center justify-end mb-3">
        <div className="bg-gray-100 p-1 rounded-lg flex shadow-md">
          <button 
            className={`px-4 py-2 rounded-md transition-all ${viewMode === "map" 
              ? "bg-white shadow-sm text-blue-600 font-medium" 
              : "text-gray-600 hover:bg-gray-200"}`}
            onClick={() => setViewMode("map")}
          >
            <div className="flex items-center">
              <Globe className="w-4 h-4 mr-2" />
              Map View
            </div>
          </button>
          <button 
            className={`px-4 py-2 rounded-md transition-all ${viewMode === "polygon" 
              ? "bg-white shadow-sm text-blue-600 font-medium" 
              : "text-gray-600 hover:bg-gray-200"}`}
            onClick={() => setViewMode("polygon")}
          >
            <div className="flex items-center">
              <Settings className="w-4 h-4 mr-2" />
              Polygon View
            </div>
          </button>
        </div>
      </div>
      
      {/* Map/Polygon Container */}
      <div className="flex-grow">
        {viewMode === "map" ? renderMapView() : renderPolygonView()}
      </div>
    </div>
  );
};

export default MapSection;