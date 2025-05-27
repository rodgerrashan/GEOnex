import React, { useState, useEffect, useRef } from "react";
import LoadingSpinner from "./LoadingSpinner";

const DeviceGridMap = ({ 
  sensorData = [], 
  baseSensorData, 
  connectionStatus, 
  baseConnectionStatus 
}) => {
  // Grid configuration
  const gridSize = 500; // px
  const gridCells = 16; // 10x10 grid
  const cellSize = gridSize / gridCells;
  
  // State for calculated positions
  const [devicePositions, setDevicePositions] = useState([]);
  const [basePosition, setBasePosition] = useState(null);
  const [gridBounds, setGridBounds] = useState({
    minLat: 0, maxLat: 0, 
    minLng: 0, maxLng: 0
  });
  
  // Canvas ref for drawing
  const canvasRef = useRef(null);
  
  // Calculate grid bounds based on all positions
  useEffect(() => {
    // Collect all valid positions (base + rovers)
    const allPositions = [];
    
    // Add base position if valid
    if (baseSensorData && 
        typeof baseSensorData.latitude === 'number' && 
        typeof baseSensorData.longitude === 'number') {
      allPositions.push({
        lat: baseSensorData.latitude,
        lng: baseSensorData.longitude
      });
    }
    
    // Add rover positions if valid
    if (Array.isArray(sensorData)) {
      sensorData.forEach(data => {
        if (data && 
            typeof data.latitude === 'number' && 
            typeof data.longitude === 'number') {
          allPositions.push({
            lat: data.latitude,
            lng: data.longitude
          });
        }
      });
    }
    
    // If we have positions, calculate bounds
    if (allPositions.length > 0) {
      const lats = allPositions.map(pos => pos.lat);
      const lngs = allPositions.map(pos => pos.lng);
      
      // Get min/max values
      const minLat = Math.min(...lats);
      const maxLat = Math.max(...lats);
      const minLng = Math.min(...lngs);
      const maxLng = Math.max(...lngs);
      
      // Add 10% padding to bounds
      const latPadding = (maxLat - minLat) * 0.1 || 0.001; // Default small value if zero
      const lngPadding = (maxLng - minLng) * 0.1 || 0.001;
      
      setGridBounds({
        minLat: minLat - latPadding,
        maxLat: maxLat + latPadding,
        minLng: minLng - lngPadding,
        maxLng: maxLng + lngPadding
      });
    }
  }, [sensorData, baseSensorData]);
  
  // Convert geographic coordinates to grid positions
  useEffect(() => {
    const { minLat, maxLat, minLng, maxLng } = gridBounds;
    
    // Calculate base position
    if (baseSensorData &&
        typeof baseSensorData.latitude === 'number' && 
        typeof baseSensorData.longitude === 'number') {
      const x = ((baseSensorData.longitude - minLng) / (maxLng - minLng)) * gridSize;
      const y = gridSize - ((baseSensorData.latitude - minLat) / (maxLat - minLat)) * gridSize;
      setBasePosition({ x, y, data: baseSensorData });
    }
    
    // Calculate device positions
    if (Array.isArray(sensorData)) {
      const positions = sensorData
        .filter(data => data && 
          typeof data.latitude === 'number' && 
          typeof data.longitude === 'number')
        .map(data => {
          const x = ((data.longitude - minLng) / (maxLng - minLng)) * gridSize;
          const y = gridSize - ((data.latitude - minLat) / (maxLat - minLat)) * gridSize;
          
          // Calculate distance to base if base position exists
          let distance = null;
          if (baseSensorData?.latitude && baseSensorData?.longitude) {
            // Haversine formula for distance calculation
            const R = 6371000; // Earth radius in meters
            const lat1 = data.latitude * Math.PI/180;
            const lat2 = baseSensorData.latitude * Math.PI/180;
            const deltaLat = (baseSensorData.latitude - data.latitude) * Math.PI/180;
            const deltaLng = (baseSensorData.longitude - data.longitude) * Math.PI/180;
            
            const a = Math.sin(deltaLat/2) * Math.sin(deltaLat/2) +
                     Math.cos(lat1) * Math.cos(lat2) *
                     Math.sin(deltaLng/2) * Math.sin(deltaLng/2);
            const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
            distance = R * c; // in meters
          }
          
          return { x, y, data, distance };
        });
      
      setDevicePositions(positions);
    }
  }, [sensorData, baseSensorData, gridBounds]);
  
  // Draw the grid and device positions
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, gridSize, gridSize);
    
    // Draw grid lines
    ctx.strokeStyle = '#ccc';
    ctx.lineWidth = 1;
    
    // Draw vertical grid lines
    for (let i = 0; i <= gridCells; i++) {
      const pos = i * cellSize;
      ctx.beginPath();
      ctx.moveTo(pos, 0);
      ctx.lineTo(pos, gridSize);
      ctx.stroke();
    }
    
    // Draw horizontal grid lines
    for (let i = 0; i <= gridCells; i++) {
      const pos = i * cellSize;
      ctx.beginPath();
      ctx.moveTo(0, pos);
      ctx.lineTo(gridSize, pos);
      ctx.stroke();
    }
    
    // Draw base station if available
    if (basePosition) {
      ctx.beginPath();
      ctx.arc(basePosition.x, basePosition.y, 10, 0, 2 * Math.PI);
      ctx.fillStyle = '#555';
      ctx.fill();
      
      // Draw signal waves around base
      ctx.beginPath();
      ctx.arc(basePosition.x, basePosition.y, 20, 0, 2 * Math.PI);
      ctx.strokeStyle = '#555';
      ctx.stroke();
      
      ctx.beginPath();
      ctx.arc(basePosition.x, basePosition.y, 30, 0, 2 * Math.PI);
      ctx.strokeStyle = '#777';
      ctx.stroke();
    }
    
    // Draw devices and connections to base
    devicePositions.forEach(device => {
      // Draw device
      ctx.beginPath();
      ctx.arc(device.x, device.y, 8, 0, 2 * Math.PI);
      ctx.fillStyle = '#3b82f6'; // blue-500
      ctx.fill();
      
      // Draw connection line to base if base exists
      if (basePosition) {
        ctx.beginPath();
        ctx.moveTo(device.x, device.y);
        ctx.lineTo(basePosition.x, basePosition.y);
        ctx.strokeStyle = '#3b82f680'; // Semi-transparent blue
        ctx.lineWidth = 2;
        ctx.stroke();
        
        // Draw distance text at midpoint
        if (device.distance !== null) {
          const midX = (device.x + basePosition.x) / 2;
          const midY = (device.y + basePosition.y) / 2;
          
          // Format distance (meters or kilometers)
          let distanceText = '';
          if (device.distance < 1000) {
            distanceText = `${Math.round(device.distance)}m`;
          } else {
            distanceText = `${(device.distance / 1000).toFixed(2)}km`;
          }
          
          ctx.font = '12px Arial';
          ctx.fillStyle = '#000';
          ctx.textAlign = 'center';
          ctx.fillText(distanceText, midX, midY - 5);
        }
      }
      
      // Draw device ID
      ctx.font = '15px Arial';
      ctx.fillStyle = '#000';
      ctx.textAlign = 'center';
      ctx.fillText(device.data.deviceName || 'unknown', device.x, device.y - 15);
    });
    
  }, [devicePositions, basePosition, gridSize, gridCells, cellSize]);
  
// Add state for container dimensions
const containerRef = useRef(null);
const [containerSize, setContainerSize] = useState({ width: 0, height: 0 });

// Add resize observer effect
useEffect(() => {
    if (!containerRef.current) return;

    const resizeObserver = new ResizeObserver(entries => {
        const { width, height } = entries[0].contentRect;
        // Keep aspect ratio square by using minimum dimension
        const size = Math.min(width * 0.9, height * 0.7); // 90% of width, 70% of height
        setContainerSize({ width: size, height: size });
    });

    resizeObserver.observe(containerRef.current);
    return () => resizeObserver.disconnect();
}, []);

return (
    <div ref={containerRef} className="flex flex-col items-center w-full h-full p-2 ">
        <div className=" w-full h-full flex flex-grow flex-col bg-white p-6">
            <div className="relative flex-grow flex items-center justify-center">
                {/* Loading overlay */}
                {(!devicePositions.length && !basePosition) && (
                    <div className="absolute inset-0 flex items-center justify-center bg-gray-50 bg-opacity-75">
                        <LoadingSpinner />
                    </div>
                )}
                
                {/* Map canvas */}
                <canvas 
                    ref={canvasRef}
                    width={gridSize}
                    height={gridSize}
                    style={{
                        width: containerSize.width,
                        height: containerSize.height
                    }}
                    className="border border-gray-300"
                />
            </div>
            
            <div className="flex justify-center max-w-7xl">
                <div className="mt-4 grid grid-cols-2 sm:grid-cols-2 gap-16  ">
                <div className="text-sm max-w-36">
                    <div className="text-xs md:text-sm lg:text-base font-semibold">Connected Rovers: {devicePositions.length}</div>
                    <ul className="text-xs md:text-sm lg:text-base mt-1">
                        {devicePositions.map((device, index) => (
                            <li key={index} className="flex justify-between">
                                <span>{device.data.deviceName || `Rover ${index + 1}`}</span>
                                <span className="text-gray-500">
                                    {device.distance !== null ? 
                                        (device.distance < 1000 ? 
                                            `${Math.round(device.distance)}m` : 
                                            `${(device.distance / 1000).toFixed(2)}km`) : 
                                        'N/A'}
                                </span>
                            </li>
                        ))}
                    </ul>
                </div>
                
                <div className="text-xs md:text-sm lg:text-base max-w-48">
                    <div className="text-xs md:text-sm lg:text-base font-semibold">Base Station</div>
                    {basePosition ? (
                        <div className="text-xs md:text-sm lg:text-base mt-1">
                            <p>ID: {baseSensorData.deviceName|| 'Base'}</p>
                            <p>Lat: {baseSensorData.latitude.toFixed(6)}</p>
                            <p>Lng: {baseSensorData.longitude.toFixed(6)}</p>
                        </div>
                    ) : (
                        <p className="text-xs md:text-sm lg:text-base mt-1 text-gray-500">Not connected</p>
                    )}
                </div>
            </div>

            </div>
            
        </div>
        
        <div className="mt-8 text-xs md:text-sm text-gray-500 mb-0">
            Grid coordinates: {gridBounds.minLat.toFixed(6)}° to {gridBounds.maxLat.toFixed(6)}° lat, 
            {gridBounds.minLng.toFixed(6)}° to {gridBounds.maxLng.toFixed(6)}° lng
        </div>
    </div>
);
};

export default DeviceGridMap;