import { useEffect, useState } from "react";
import * as Location from "expo-location";
import { useSetAtom } from "jotai";
import { myLocationAtom } from "../store/locationAtom";

// 커스텀 훅: 권한 요청 + 위치 계속 받기 + cleanup 을 한 곳에 모았다.
// 이 훅을 쓰는 컴포넌트가 화면에서 사라지면 watch 도 멈춘다.
export function useWatchLocation() {
  const setMyLocation = useSetAtom(myLocationAtom);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    let subscription: Location.LocationSubscription | undefined;
    let cancelled = false;

    async function startWatching() {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setErrorMsg("Location permission denied. The map still works without it.");
        return;
      }
      try {
        subscription = await Location.watchPositionAsync(
          { accuracy: Location.Accuracy.High, timeInterval: 2000, distanceInterval: 5 },
          (pos) => setMyLocation({ latitude: pos.coords.latitude, longitude: pos.coords.longitude })
        );
      } catch {
        setErrorMsg("Could not get your location. Is location turned on?");
        return;
      }
      if (cancelled) subscription.remove();
    }

    startWatching();
    return () => {
      cancelled = true;
      subscription?.remove();
    };
  }, []);

  return errorMsg;
}

// 좌표 → 사람이 읽는 주소
export async function addressFor(coordinate: { latitude: number; longitude: number }): Promise<string> {
  try {
    const places = await Location.reverseGeocodeAsync(coordinate);
    const p = places[0];
    return p ? [p.streetNumber, p.street, p.city].filter(Boolean).join(" ") : "Unknown address";
  } catch {
    return "Unknown address";
  }
}
