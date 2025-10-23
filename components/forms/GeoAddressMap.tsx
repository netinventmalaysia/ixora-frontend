import React, { useEffect, useMemo, useRef, useState } from 'react';
import dynamic from 'next/dynamic';
import { useFormContext, useWatch } from 'react-hook-form';
import Button from './Button';
// Dynamically import to avoid SSR window dependency
const MapClickHandler = dynamic(() => import('./MapClickHandler'), { ssr: false });

// Dynamically import react-leaflet components to avoid SSR issues
const MapContainer = dynamic(() => import('react-leaflet').then(m => m.MapContainer), { ssr: false });
const TileLayer = dynamic(() => import('react-leaflet').then(m => m.TileLayer), { ssr: false });
const Marker = dynamic(() => import('react-leaflet').then(m => m.Marker), { ssr: false });
// Note: avoid importing hooks from react-leaflet at module scope to prevent SSR issues

type Props = {
  addressFields?: { address?: string; city?: string; state?: string; postalcode?: string; country?: string };
  latField?: string;
  lngField?: string;
  label?: string;
  readOnly?: boolean;
};

// Small helper: build a single-line address string from form fields
const buildAddress = (vals: Record<string, any>, path: Props['addressFields']) => {
  if (!path) return '';
  const p = path;
  const parts = [p.address && vals[p.address], p.city && vals[p.city], p.state && vals[p.state], p.postalcode && vals[p.postalcode], p.country && vals[p.country]]
    .filter(Boolean)
    .map(String);
  return parts.join(', ');
};

export default function GeoAddressMap({ addressFields = { address: 'address', city: 'city', state: 'state', postalcode: 'postalcode', country: 'country' }, latField = 'lat', lngField = 'lng', label = 'Map Location', readOnly = false }: Props) {
  let methods: any = null;
  try { methods = useFormContext(); } catch { methods = null; }
  const watch = methods?.watch;
  const setValue = methods?.setValue;
  const control = methods?.control;

  const [center, setCenter] = useState<[number, number]>([2.197, 102.249]); // Default near Melaka
  const [markerPos, setMarkerPos] = useState<[number, number] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const mapRef = useRef<any>(null);
  const [isClient, setIsClient] = useState(false);
  const [reverseLoading, setReverseLoading] = useState(false);
  const [reverseError, setReverseError] = useState<string | null>(null);
  const [customIcon, setCustomIcon] = useState<any>(null);

  // Watch address values to enable Geocode button
  const allVals = methods ? useWatch({ control }) : undefined;
  const addressStr = useMemo(() => (methods ? buildAddress(allVals || {}, addressFields) : ''), [allVals, methods]);
  // Watch latitude/longitude from the form
  const latFromForm = methods ? Number((allVals as any)?.[latField]) : undefined;
  const lngFromForm = methods ? Number((allVals as any)?.[lngField]) : undefined;

  // Initialize from existing lat/lng in the form
  useEffect(() => {
    setIsClient(typeof window !== 'undefined');
    if (!methods) return;
    const lat = Number(watch?.(latField));
    const lng = Number(watch?.(lngField));
    if (!Number.isNaN(lat) && !Number.isNaN(lng) && lat && lng) {
      const pos: [number, number] = [lat, lng];
      setCenter(pos);
      setMarkerPos(pos);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Create a custom DivIcon for the marker on client only
  useEffect(() => {
    if (!isClient) return;
    let cancelled = false;
    (async () => {
      const mod: any = await import('leaflet');
      const L = mod?.default ?? mod;
      if (cancelled) return;
      const html = `
        <span style="display:inline-block;width:22px;height:22px;background:#2563eb;border:2px solid #fff;border-radius:50%;box-shadow:0 2px 6px rgba(0,0,0,.25);"></span>
      `;
      const icon = L.divIcon({
        className: 'ixora-leaflet-divicon',
        html,
        iconSize: [22, 22],
        iconAnchor: [11, 11],
      });
      setCustomIcon(icon);
    })();
    return () => { cancelled = true; };
  }, [isClient]);

  // Recenter map when lat/lng fields change externally (e.g., prefills or manual edits)
  useEffect(() => {
    if (!methods) return;
    const lat = Number(latFromForm);
    const lng = Number(lngFromForm);
    if (!Number.isNaN(lat) && !Number.isNaN(lng) && lat && lng) {
      const next: [number, number] = [lat, lng];
      // Only update if different from current marker position
      const same = markerPos && Math.abs(markerPos[0] - lat) < 1e-6 && Math.abs(markerPos[1] - lng) < 1e-6;
      if (!same) {
        setCenter(next);
        setMarkerPos(next);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [latFromForm, lngFromForm]);

  const doGeocode = async () => {
    if (!addressStr) return;
    try {
      setLoading(true);
      setError(null);
      // Use OpenStreetMap Nominatim geocoding
      const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(addressStr)}`;
      const res = await fetch(url, { headers: { 'Accept': 'application/json' } });
      if (!res.ok) throw new Error(`Geocoding failed: ${res.status}`);
      const data: any[] = await res.json();
      if (!Array.isArray(data) || data.length === 0) throw new Error('No results from geocoding');
      const best = data[0];
      const lat = Number(best.lat);
      const lon = Number(best.lon);
      if (Number.isNaN(lat) || Number.isNaN(lon)) throw new Error('Invalid coordinates from geocoding');
      const pos: [number, number] = [lat, lon];
      setCenter(pos);
      setMarkerPos(pos);
      if (methods) {
        setValue?.(latField, lat, { shouldDirty: true });
        setValue?.(lngField, lon, { shouldDirty: true });
      }
    } catch (e: any) {
      setError(e?.message || 'Failed to geocode address');
    } finally {
      setLoading(false);
    }
  };

  // Reverse geocode to populate address fields
  const reverseGeocode = async (lat: number, lng: number) => {
    if (!methods || readOnly) return;
    try {
      setReverseLoading(true);
      setReverseError(null);
      const url = `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${encodeURIComponent(lat)}&lon=${encodeURIComponent(lng)}`;
      const res = await fetch(url, { headers: { 'Accept': 'application/json' } });
      if (!res.ok) throw new Error(`Reverse geocoding failed: ${res.status}`);
      const json: any = await res.json();
      const addr = json?.address || {};
      // Compose a human address line
      const lineParts: string[] = [];
      if (addr.house_number) lineParts.push(String(addr.house_number));
      if (addr.road) lineParts.push(String(addr.road));
      if (!addr.road && (addr.neighbourhood || addr.suburb)) lineParts.push(String(addr.neighbourhood || addr.suburb));
      const addressLine = lineParts.join(' ');
      const city = (addr.city || addr.town || addr.village || addr.hamlet || addr.suburb || '') as string;
      const state = (addr.state || addr.state_district || addr.region || '') as string;
      const postal = (addr.postcode || '') as string;
      const country = (addr.country || '') as string;
      const f = addressFields || {};
      if (f.address) setValue?.(f.address, addressLine, { shouldDirty: true, shouldValidate: true });
      if (f.city) setValue?.(f.city, city, { shouldDirty: true, shouldValidate: true });
      if (f.state) setValue?.(f.state, state, { shouldDirty: true, shouldValidate: true });
      if (f.postalcode) setValue?.(f.postalcode, postal, { shouldDirty: true, shouldValidate: true });
      if (f.country) setValue?.(f.country, country, { shouldDirty: true, shouldValidate: true });
    } catch (e: any) {
      setReverseError(e?.message || 'Failed to reverse geocode');
    } finally {
      setReverseLoading(false);
    }
  };

  // Draggable Marker; map click handled via whenCreated
  const DraggableMarker: React.FC = () => {
    if (!markerPos || !customIcon) return null;
    return (
      <Marker
        position={markerPos}
        icon={customIcon}
        draggable={!readOnly}
        eventHandlers={{
          dragend: (e: any) => {
            const m = e.target;
            const p = m.getLatLng();
            const pos: [number, number] = [p.lat, p.lng];
            setMarkerPos(pos);
            if (methods) {
              setValue?.(latField, p.lat, { shouldDirty: true });
              setValue?.(lngField, p.lng, { shouldDirty: true });
            }
            // Update address from new marker position
            reverseGeocode(p.lat, p.lng);
          }
        }}
      />
    );
  };

  return (
    <div className="w-full">
      <div className="flex items-end justify-between gap-3">
        <div className="text-sm font-medium text-gray-900">{label}</div>
        <div className="flex items-center gap-2">
          <Button type="button" variant="secondary" onClick={doGeocode} disabled={!addressStr || loading}>{loading ? 'Locating…' : 'Geocode address'}</Button>
          {error && <span className="text-xs text-red-600">{error}</span>}
        </div>
      </div>
      <div className="mt-2 h-72 w-full rounded-md overflow-hidden border border-gray-200">
        {!isClient ? null : (
        <MapContainer
          key={`${center[0]?.toFixed?.(6) || center[0]},${center[1]?.toFixed?.(6) || center[1]}`}
          center={center as any}
          zoom={16}
          style={{ height: '100%', width: '100%' }}
          scrollWheelZoom
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <MapClickHandler
            readOnly={readOnly}
            onClick={({ lat, lng }) => {
              const pos: [number, number] = [lat, lng];
              setMarkerPos(pos);
              if (methods) {
                setValue?.(latField, lat, { shouldDirty: true });
                setValue?.(lngField, lng, { shouldDirty: true });
              }
              // Update address from clicked point
              reverseGeocode(lat, lng);
            }}
          />
          {markerPos && <DraggableMarker />}
        </MapContainer>
        )}
      </div>
      {methods && (
        <div className="mt-2 text-xs text-gray-600">
          <span>Lat/Lng:</span>{' '}
          <span>{String(watch?.(latField) ?? '')}</span>{' / '}
          <span>{String(watch?.(lngField) ?? '')}</span>
          {reverseLoading && <span className="ml-2 text-gray-500">(updating address…)</span>}
          {reverseError && <span className="ml-2 text-red-600">{reverseError}</span>}
        </div>
      )}
    </div>
  );
}
