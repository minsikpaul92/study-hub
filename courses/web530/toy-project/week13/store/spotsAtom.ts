import { atom, Getter } from "jotai";
import { getSpots, createSpot, updateSpot, deleteSpot } from "@/lib/firestore";
import { authAtom } from "@/store/authAtom";

// Week 12: 요청마다 로그인 토큰이 필요하다. get(authAtom) 으로 다른 atom 의 값을 읽는다.
function tokenOf(get: Getter): string {
  const user = get(authAtom);
  if (!user) throw new Error("Not signed in");
  return user.idToken;
}

export interface Spot {
  id: string;
  name: string;
  category: "Study" | "Food" | "Chill" | "Other";
  rating: number;
  campus: string;
  latitude: number;
  longitude: number;
  description: string;
  createdBy: string; // Week 12: 만든 사람의 localId
}

// 1) 데이터를 담는 atom. 이제 빈 배열로 시작하고 Firestore 에서 채운다.
export const spotsAtom = atom<Spot[]>([]);

// 2) 쓰기 전용 "action atom": 불러오기 동작을 atom 안에 넣는다 (코스노트의 fetchProductsAtom 과 같은 패턴)
//    화면에서는 const fetchSpots = useSetAtom(fetchSpotsAtom); await fetchSpots(); 로 쓴다.
export const fetchSpotsAtom = atom(null, async (get, set) => {
  const spots = await getSpots(tokenOf(get)); // 실패하면 throw → 화면에서 catch 해서 에러 표시
  set(spotsAtom, spots);
});

// ---------- Week 11: 쓰기 action atom 들 ----------
// 순서: (1) 서버에 요청 → (2) 성공하면 화면의 상태(spotsAtom)도 같은 모양으로 바꾼다
// 서버가 실패하면 throw 되므로 (2) 는 실행되지 않는다 → 화면과 DB 가 어긋나지 않는다

// 새 스팟에는 createdBy 를 자동으로 넣는다 → 화면은 createdBy 를 몰라도 된다
export const addSpotAtom = atom(null, async (get, set, spot: Omit<Spot, "id" | "createdBy">) => {
  const user = get(authAtom);
  if (!user) throw new Error("Not signed in");
  const created = await createSpot(user.idToken, { ...spot, createdBy: user.localId });
  set(spotsAtom, (prev) => [...prev, created]);
  return created;
});

export const updateSpotAtom = atom(
  null,
  async (get, set, { id, changes }: { id: string; changes: Partial<Omit<Spot, "id">> }) => {
    const updated = await updateSpot(tokenOf(get), id, changes);
    set(spotsAtom, (prev) => prev.map((s) => (s.id === id ? updated : s)));
  }
);

export const deleteSpotAtom = atom(null, async (get, set, id: string) => {
  await deleteSpot(tokenOf(get), id);
  set(spotsAtom, (prev) => prev.filter((s) => s.id !== id));
});
