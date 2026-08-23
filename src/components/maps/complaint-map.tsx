'use client';

import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

export function ComplaintMap({
  latitude,
  longitude,
  locality,
  district,
  height = 400,
}: {
  latitude?: number;
  longitude?: number;
  locality?: string;
  district?: string;
  height?: number;
}) {
  if (!latitude || !longitude) {
    return (
      <div className="rounded-xl border border-navy-200 bg-navy-50 flex items-center justify-center text-xs text-navy-500" style={{ height }}>
        No location data available for this complaint.
      </div>
    );
  }

  const position: L.LatLngExpression = [latitude, longitude];

  return (
    <div className="rounded-xl overflow-hidden border border-navy-200 shadow-sm" style={{ height }}>
      <MapContainer center={position} zoom={13} style={{ height: '100%', width: '100%' }} scrollWheelZoom={false}>
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        <Marker position={position}>
          <Popup>
            <div className="text-xs font-semibold text-navy-900">
              {locality}
              {district && <span className="block text-navy-500 font-normal">{district}</span>}
            </div>
          </Popup>
        </Marker>
      </MapContainer>
    </div>
  );
}
