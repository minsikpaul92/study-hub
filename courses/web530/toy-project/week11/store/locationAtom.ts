import { atom } from "jotai";

export interface LatLng {
  latitude: number;
  longitude: number;
}

// 내 현재 위치. 아직 모르면 null.
export const myLocationAtom = atom<LatLng | null>(null);
