'use client';

import React, { useEffect, useState } from 'react';
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
  const [position, setPosition] = useState<[number, number] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (latitude && longitude) {
      setPosition([latitude, longitude]);
      return;
    }

    if (!locality && !district) {
      setError('No location data available for this complaint.');
      return;
    }

    let cancelled = false;
    setLoading(true);
    setError(null);

    const query = [locality, district].filter(Boolean).join(', ');

    fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=1`, {
      headers: { 'Accept': 'application/json' },
    })
      .then(res => res.json())
      .then((data: any[]) => {
        if (cancelled) return;
        if (data && data[0]?.lat && data[0]?.lon) {
          setPosition([parseFloat(data[0].lat), parseFloat(data[0].lon)]);
        } else {
          setError('Location not found on map.');
        }
      })
      .catch(() => {
        if (cancelled) return;
        setError('Unable to load map location.');
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [latitude, longitude, locality, district]);

  if (error) {
    return (
      <div className="rounded-xl border border-navy-200 bg-navy-50 flex items-center justify-center text-xs text-navy-500" style={{ height }}>
        {error}
      </div>
    );
  }

  if (loading || !position) {
    return (
      <div className="rounded-xl border border-navy-200 bg-navy-50 flex items-center justify-center text-xs text-navy-500" style={{ height }}>
        Loading map...
      </div>
    );
  }

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
