import { atom, useSetAtom } from "jotai";

// 저장한 스팟 id 목록
export const savedIdsAtom = atom<string[]>([]);

// 저장 토글을 어디서나 쓰기 위한 커스텀 훅
export function useToggleSaved() {
  const setSavedIds = useSetAtom(savedIdsAtom);
  return (id: string) =>
    setSavedIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
}
