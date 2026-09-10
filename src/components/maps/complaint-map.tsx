'use client';

import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { getDistrictCoordinates } from '@/lib/constants/locations';
import { MapPin } from 'lucide-react';

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
  const [mounted, setMounted] = useState(false);
  const [position, setPosition] = useState<[number, number] | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    // 1. If explicit latitude & longitude provided
    if (
      latitude !== undefined &&
      longitude !== undefined &&
      !isNaN(Number(latitude)) &&
      !isNaN(Number(longitude)) &&
      Number(latitude) !== 0 &&
      Number(longitude) !== 0
    ) {
      setPosition([Number(latitude), Number(longitude)]);
      setLoading(false);
      return;
    }

    // 2. Default fallback from district coordinates (guaranteed to exist for all TN districts)
    const districtDefault = getDistrictCoordinates(district);
    const fallbackPos: [number, number] = [districtDefault.lat, districtDefault.lng];

    if (!locality && !district) {
      setPosition([13.0827, 80.2707]); // Chennai, Tamil Nadu default
      setLoading(false);
      return;
    }

    let cancelled = false;
    setLoading(true);

    // Try geocoding locality + district + Tamil Nadu
    const query = [locality, district, 'Tamil Nadu'].filter(Boolean).join(', ');

    fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=1`, {
      headers: { 'Accept': 'application/json' },
    })
      .then(res => res.json())
      .then((data: any[]) => {
        if (cancelled) return;
        if (data && data[0]?.lat && data[0]?.lon) {
          setPosition([parseFloat(data[0].lat), parseFloat(data[0].lon)]);
        } else {
          // If street-level search fails, try district directly or use fallback
          setPosition(fallbackPos);
        }
      })
      .catch(() => {
        if (cancelled) return;
        setPosition(fallbackPos);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [latitude, longitude, locality, district]);

  if (!mounted || loading || !position) {
    return (
      <div
        className="rounded-xl border border-navy-200 bg-navy-50/70 flex flex-col items-center justify-center text-xs text-navy-500 gap-2"
        style={{ height }}
      >
        <div className="w-6 h-6 border-2 border-emerald-600 border-t-transparent rounded-full animate-spin" />
        <span>Loading map location...</span>
      </div>
    );
  }

  return (
    <div className="rounded-xl overflow-hidden border border-navy-200 shadow-sm relative" style={{ height }}>
      <MapContainer center={position} zoom={14} style={{ height: '100%', width: '100%' }} scrollWheelZoom={false}>
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        <Marker position={position}>
          <Popup>
            <div className="text-xs font-semibold text-navy-900 p-0.5">
              <div className="font-bold text-navy-950 flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-emerald-600 inline" />
                <span>{locality || 'Grievance Site'}</span>
              </div>
              {district && <span className="block text-navy-500 font-normal mt-0.5">{district}, Tamil Nadu</span>}
            </div>
          </Popup>
        </Marker>
      </MapContainer>
    </div>
  );
}
