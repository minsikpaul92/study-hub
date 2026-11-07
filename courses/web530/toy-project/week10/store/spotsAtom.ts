import { atom } from "jotai";
import { getSpots } from "@/lib/firestore";

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

// 1) 데이터를 담는 atom. 이제 빈 배열로 시작하고 Firestore 에서 채운다.
export const spotsAtom = atom<Spot[]>([]);

// 2) 쓰기 전용 "action atom": 불러오기 동작을 atom 안에 넣는다 (코스노트의 fetchProductsAtom 과 같은 패턴)
//    화면에서는 const fetchSpots = useSetAtom(fetchSpotsAtom); await fetchSpots(); 로 쓴다.
export const fetchSpotsAtom = atom(null, async (_get, set) => {
  const spots = await getSpots(); // 실패하면 throw → 화면에서 catch 해서 에러 표시
  set(spotsAtom, spots);
});
