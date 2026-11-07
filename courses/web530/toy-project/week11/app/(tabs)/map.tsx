// /map : 지도 탭.
// Week 11: 길게 눌러 만든 스팟을 Firestore 에 POST 로 저장한다 (새로고침해도 남아 있음)
import { Alert } from "react-native";
import { useSetAtom } from "jotai";
import { useLocalSearchParams, useRouter } from "expo-router";
import SpotMap, { SpotDraft } from "@/components/SpotMap";
import { addSpotAtom } from "@/store/spotsAtom";

export default function MapScreen() {
  const router = useRouter();
  const { focusId, at } = useLocalSearchParams<{ focusId?: string; at?: string }>();
  const addSpot = useSetAtom(addSpotAtom);

  async function handleAdd(name: string, draft: SpotDraft) {
    try {
      return await addSpot({
        name,
        category: "Other",
        rating: 0,
        campus: "Newnham",
        latitude: draft.coordinate.latitude,
        longitude: draft.coordinate.longitude,
        description: draft.address,
      });
    } catch {
      Alert.alert("Could not save", "The spot was not saved. Try again.");
    }
  }

  return (
    <SpotMap
      focusId={focusId}
      focusAt={at ? Number(at) : undefined}
      onAddSpot={handleAdd}
      onOpenSpot={(spot) => router.navigate({ pathname: "/spots/[id]", params: { id: spot.id } })}
    />
  );
}
