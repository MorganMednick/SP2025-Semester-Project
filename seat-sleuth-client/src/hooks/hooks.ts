import { useEffect, useState } from 'react';
import geohash from 'ngeohash';
import { useMediaQuery } from '@mantine/hooks';

export const useGeoPoint = () => {
  const [geoPoint, setGeoPoint] = useState<string | null>(null);
  const [location, setLocation] = useState<{ lat: number; long: number } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [geoPointFetching, setGeoPointFetching] = useState(true);

  useEffect(() => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by this browser.');
      setGeoPointFetching(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = position.coords.latitude;
        const long = position.coords.longitude;

        setLocation({ lat, long });
        setGeoPoint(geohash.encode(lat, long));
        setGeoPointFetching(false);
      },
      (err) => {
        setError(err.message);
        setGeoPointFetching(false);
      },
    );
  }, []);

  return { geoPoint, location, error, geoPointFetching };
};

export const useIsMobile = () => {
  return useMediaQuery('(max-width: 725px)');
};
