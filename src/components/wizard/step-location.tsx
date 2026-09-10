'use client';

import React, { useState, useEffect } from 'react';
import { TAMIL_NADU_DISTRICTS, getDistrictCoordinates } from '@/lib/constants/locations';
import { useLanguage } from '@/components/providers/language-provider';
import { Select } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { MapPin, Navigation, Info } from 'lucide-react';

interface StepLocationProps {
  district: string;
  constituency: string;
  city: string;
  locality: string;
  latitude?: number;
  longitude?: number;
  onChange: (fields: {
    district?: string;
    constituency?: string;
    city?: string;
    locality?: string;
    latitude?: number;
    longitude?: number;
  }) => void;
  errors?: Record<string, string>;
}

export function StepLocation({
  district,
  constituency,
  city,
  locality,
  latitude,
  longitude,
  onChange,
  errors = {},
}: StepLocationProps) {
  const { isTamil } = useLanguage();
  const [gpsLoading, setGpsLoading] = useState(false);
  const [gpsMsg, setGpsMsg] = useState<string | null>(null);

  // If district is selected but coordinates are empty, auto-populate from district coordinates
  useEffect(() => {
    if (district && (latitude === undefined || longitude === undefined || latitude === 0)) {
      const coords = getDistrictCoordinates(district);
      onChange({ latitude: coords.lat, longitude: coords.lng });
    }
  }, [district, latitude, longitude, onChange]);

  const selectedDistrictData = TAMIL_NADU_DISTRICTS.find(
    d => d.nameEn.toLowerCase() === district.toLowerCase()
  );

  const handleGetLocation = () => {
    if (!navigator.geolocation) {
      setGpsMsg('Geolocation is not supported by your browser');
      return;
    }

    setGpsLoading(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setGpsLoading(false);
        onChange({
          latitude: pos.coords.latitude,
          longitude: pos.coords.longitude,
        });
        setGpsMsg(`GPS Coordinates Recorded (${pos.coords.latitude.toFixed(4)}, ${pos.coords.longitude.toFixed(4)})`);
      },
      () => {
        setGpsLoading(false);
        setGpsMsg('Unable to retrieve location. Please fill the district & locality manually.');
      }
    );
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      <div>
        <h3 className="text-xl font-bold text-navy-950 font-tamil">
          {isTamil ? '2. இருப்பிடம் & தொகுதி விபரம்' : '2. Location & Jurisdiction'}
        </h3>
        <p className="text-sm text-navy-600 mt-1">
          {isTamil 
            ? 'துல்லியமான அதிகாரியை சென்றடைய உங்கள் மாவட்டம் மற்றும் பகுதியை தேர்வு செய்யவும்.' 
            : 'Select your district and locality to route to the correct municipal or legislative authority.'}
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        
        {/* State */}
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-navy-700 mb-1.5">
            {isTamil ? 'மாநிலம்' : 'State'}
          </label>
          <input
            type="text"
            disabled
            value="Tamil Nadu (தமிழ்நாடு)"
            className="h-11 w-full rounded-lg border border-navy-200 bg-navy-50 px-3.5 text-sm text-navy-600 font-medium cursor-not-allowed"
          />
        </div>

        {/* District */}
        <div>
          <Select
            label={isTamil ? 'மாவட்டம்' : 'District'}
            value={district}
            error={errors.district}
            onChange={(e) => {
              const newDist = e.target.value;
              const distData = TAMIL_NADU_DISTRICTS.find(d => d.nameEn === newDist);
              const coords = getDistrictCoordinates(newDist);
              onChange({
                district: newDist,
                constituency: distData?.constituenciesEn[0] || '',
                latitude: coords.lat,
                longitude: coords.lng,
                city: city || newDist,
              });
            }}
          >
            <option value="">{isTamil ? '-- மாவட்டத்தை தேர்வு செய்க --' : '-- Select District --'}</option>
            {TAMIL_NADU_DISTRICTS.map((d) => (
              <option key={d.id} value={d.nameEn}>
                {isTamil ? `${d.nameTa} (${d.nameEn})` : d.nameEn}
              </option>
            ))}
          </Select>
        </div>

        {/* Assembly Constituency */}
        <div>
          <Select
            label={isTamil ? 'சட்டமன்றத் தொகுதி' : 'Assembly Constituency'}
            value={constituency}
            error={errors.constituency}
            disabled={!district}
            onChange={(e) => onChange({ constituency: e.target.value })}
          >
            <option value="">
              {district 
                ? (isTamil ? '-- தொகுதியை தேர்வு செய்க --' : '-- Select Constituency --') 
                : (isTamil ? 'முதலில் மாவட்டத்தை தேர்வு செய்க' : 'Select district first')}
            </option>
            {selectedDistrictData?.constituenciesEn.map((c, i) => (
              <option key={c} value={c}>
                {isTamil && selectedDistrictData.constituenciesTa[i]
                  ? `${selectedDistrictData.constituenciesTa[i]} (${c})`
                  : c}
              </option>
            ))}
          </Select>
        </div>

        {/* City / Town */}
        <div>
          <Input
            label={isTamil ? 'நகரம் / கிராமம்' : 'City / Town'}
            placeholder={isTamil ? 'எ.கா: சென்னை / கோவை / திருச்சி' : 'e.g. Chennai / Madurai / Salem'}
            value={city}
            error={errors.city}
            onChange={(e) => onChange({ city: e.target.value })}
          />
        </div>
      </div>

      {/* Street / Locality Area */}
      <div>
        <Input
          label={isTamil ? 'தெரு / பகுதி / முக்கிய அடையாளம்' : 'Area / Locality / Street Landmark'}
          placeholder={isTamil ? 'எ.கா: அண்ணா நகர் 2வது மெயின் ரோடு, பேருந்து நிறுத்தம் அருகில்' : 'e.g. 2nd Main Road, Near Bus Stand'}
          value={locality}
          error={errors.locality}
          onChange={(e) => onChange({ locality: e.target.value })}
          helperText={isTamil 
            ? 'உங்கள் தனிப்பட்ட வீட்டு முகவரியை குறிப்பிட வேண்டாம். பொதுப் பகுதி அடையாளத்தை மட்டும் தரவும்.' 
            : 'Do not enter your private house number. Provide public street name or civic landmark.'}
        />
      </div>

      {/* Optional GPS Helper */}
      <div className="p-4 rounded-xl border border-navy-200 bg-navy-50/60 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-xs text-navy-700">
          <MapPin className="w-4 h-4 text-emerald-600 flex-shrink-0" />
          <span>
            {gpsMsg || (isTamil ? 'துல்லியமான வரைபட இருப்பிடத்திற்கு GPS பயன்படுத்தலாம் (விருப்பமானது).' : 'Optional: Auto-attach GPS location for municipal maintenance crew.')}
          </span>
        </div>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={handleGetLocation}
          isLoading={gpsLoading}
          className="text-xs py-1.5"
        >
          <Navigation className="w-3.5 h-3.5 mr-1" />
          {isTamil ? 'GPS பதிவு செய்' : 'Get GPS Pin'}
        </Button>
      </div>
    </div>
  );
}
