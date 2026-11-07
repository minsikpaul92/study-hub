import { atom } from "jotai";
import { SPOTS } from "../data/spots";

// TypeScript interface: 스팟 하나의 "모양"을 정의한다.
// Week 1 의 PropTypes 가 하던 일을 이제 타입이 (실행 전에) 해준다.
export interface Spot {
  id: string;
  name: string;
  category: "Study" | "Food" | "Chill" | "Other";
  rating: number;
  campus: string;
  latitude: number;
  longitude: number;
  description: string;
}

export const spotsAtom = atom<Spot[]>(SPOTS);
