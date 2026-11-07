import { useSetAtom } from "jotai";
import type { BottomTabScreenProps } from "@react-navigation/bottom-tabs";
import SpotMap, { SpotDraft } from "../components/SpotMap";
import { spotsAtom, Spot } from "../store/spotsAtom";
import type { TabParamList } from "../navigation/types";

type Props = BottomTabScreenProps<TabParamList, "Map">;

export default function MapScreen({ navigation, route }: Props) {
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
      focusId={route.params?.focusId}
      focusAt={route.params?.at}
      onAddSpot={addSpot}
      onOpenSpot={(spot) =>
        navigation.navigate("SpotsTab", { screen: "SpotDetail", params: { id: spot.id, name: spot.name } })
      }
    />
  );
}
