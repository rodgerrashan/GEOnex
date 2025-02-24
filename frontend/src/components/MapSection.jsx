import React, { useState, useRef, useEffect } from "react";
import { MapContainer, TileLayer, useMap } from "react-leaflet";
import osm from "./osm-provider";
import "leaflet/dist/leaflet.css";

const MapSection = () => {
  const [center, setCenter] = useState({ lat: 7.254822, lng: 80.59215 });
  const ZOOM_LEVEL = 24;
  const mapRef = useRef();

  return (
    <div className="w-full h-[500px]">
      <MapContainer
        center={center}
        zoom={ZOOM_LEVEL}
        ref={mapRef}
        className="w-full h-full"
      >
        <TileLayer url={osm.maptiler.url} attribution={osm.maptiler.attribution} />
        <MapFix />
      </MapContainer>
    </div>
  );
};

// ✅ Fix: Custom component to invalidate size on load
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

