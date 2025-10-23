import React from 'react';
import { useMapEvents } from 'react-leaflet';

type Props = {
  onClick: (latlng: { lat: number; lng: number }) => void;
  readOnly?: boolean;
};

export default function MapClickHandler({ onClick, readOnly = false }: Props) {
  useMapEvents({
    click(e) {
      if (readOnly) return;
      onClick({ lat: e.latlng.lat, lng: e.latlng.lng });
    },
  });
  return null;
}
