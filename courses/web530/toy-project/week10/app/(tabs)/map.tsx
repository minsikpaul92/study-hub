// /map : 지도 탭. 지도 본체는 components/SpotMap.tsx (Week 8 과 같은 컴포넌트를 그대로 재사용)
import { useSetAtom } from "jotai";
import { useLocalSearchParams, useRouter } from "expo-router";
import SpotMap, { SpotDraft } from "@/components/SpotMap";
import { spotsAtom, Spot } from "@/store/spotsAtom";

export default function MapScreen() {
  const router = useRouter();
  // URL 쿼리 파라미터는 항상 문자열이다 → at 은 숫자로 바꿔서 넘긴다
  const { focusId, at } = useLocalSearchParams<{ focusId?: string; at?: string }>();
  const setSpots = useSetAtom(spotsAtom);

  function addSpot(name: string, draft: SpotDraft): Spot {
    const newSpot: Spot = {
      id: String(Date.now()),
      name,
      category: "Other",
      rating: 0,
      campus: "Newnham",
      latitude: draft.coordinate.latitude,
      longitude: draft.coordinate.longitude,
      description: draft.address,
    };
    setSpots((prev) => [...prev, newSpot]);
    return newSpot;
  }

  return (
    <SpotMap
      focusId={focusId}
      focusAt={at ? Number(at) : undefined}
      onAddSpot={addSpot}
      onOpenSpot={(spot) => router.navigate({ pathname: "/spots/[id]", params: { id: spot.id } })}
    />
  );
}
