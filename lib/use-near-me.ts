"use client";

import { useEffect, useState } from "react";

export interface Coordinates {
  lat: number;
  lng: number;
}

const STORAGE_KEY = "near_me_coordinates";
const SYNC_EVENT = "near-me:coords-updated";

function dispatchSync() {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent(SYNC_EVENT));
  }
}

export function useNearMe() {
  const [coordinates, setCoordinates] = useState<Coordinates | null>(null);
  const [isDetecting, setIsDetecting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const sync = () => {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        try {
          setCoordinates(JSON.parse(stored));
        } catch {
          localStorage.removeItem(STORAGE_KEY);
          setCoordinates(null);
        }
      } else {
        setCoordinates(null);
      }
    };

    sync(); // initial load
    window.addEventListener(SYNC_EVENT, sync);
    return () => window.removeEventListener(SYNC_EVENT, sync);
  }, []);

  const detectLocation = (): Promise<Coordinates> => {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        const msg = "Geolocation is not supported by your browser";
        setError(msg);
        reject(new Error(msg));
        return;
      }

      setIsDetecting(true);
      setError(null);

      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const coords: Coordinates = {
            lat: pos.coords.latitude,
            lng: pos.coords.longitude,
          };
          localStorage.setItem(STORAGE_KEY, JSON.stringify(coords));
          dispatchSync(); // notify all instances
          setIsDetecting(false);
          resolve(coords);
        },
        (err) => {
          setIsDetecting(false);
          let msg = "Unable to retrieve your location";
          if (err.code === err.PERMISSION_DENIED) {
            msg = "Location access denied";
          } else if (err.code === err.TIMEOUT) {
            msg = "Location request timed out";
          }
          setError(msg);
          reject(new Error(msg));
        },
        { timeout: 10_000, maximumAge: 5 * 60 * 1000 },
      );
    });
  };

  const clearLocation = () => {
    localStorage.removeItem(STORAGE_KEY);
    dispatchSync(); // notify all instances
  };

  return { coordinates, isDetecting, error, detectLocation, clearLocation };
}

export function getDistanceKm(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number,
): number {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

export function formatDistance(km: number): string {
  if (km < 1) {
    return `${Math.round(km * 1000)} m`;
  }
  if (km < 10) {
    return `${km.toFixed(1)} km`;
  }
  return `${Math.round(km)} km`;
}
