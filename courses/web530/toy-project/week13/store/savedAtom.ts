import { atom, useSetAtom } from "jotai";
import { authAtom } from "@/store/authAtom";
import { getSavedIds, putSavedIds } from "@/lib/firestore";

// 저장한 스팟 id 목록 (화면에 보이는 값)
export const savedIdsAtom = atom<string[]>([]);

// Week 13: 로그인 직후 서버에서 내 저장 목록을 불러온다
export const loadSavedAtom = atom(null, async (get, set) => {
  const user = get(authAtom);
  if (!user) return;
  set(savedIdsAtom, await getSavedIds(user.idToken, user.localId));
});

// Week 13: 저장 목록 바꾸기 = (1) 화면 먼저 바꾸고 (2) 서버에 저장, 실패하면 (3) 원래대로 되돌린다
// 이런 방식을 "낙관적 업데이트(optimistic update)" 라고 한다. 하트가 즉시 반응해서 앱이 빠르게 느껴진다.
export const setSavedAtom = atom(null, async (get, set, update: (prev: string[]) => string[]) => {
  const before = get(savedIdsAtom);
  const after = update(before);
  set(savedIdsAtom, after); // (1)
  const user = get(authAtom);
  if (!user) return;
  try {
    await putSavedIds(user.idToken, user.localId, after); // (2)
  } catch {
    set(savedIdsAtom, before); // (3)
  }
});

// 저장 토글을 어디서나 쓰기 위한 커스텀 훅 (HeartButton, 길게 누르기)
export function useToggleSaved() {
  const setSaved = useSetAtom(setSavedAtom);
  return (id: string) => setSaved((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
}
