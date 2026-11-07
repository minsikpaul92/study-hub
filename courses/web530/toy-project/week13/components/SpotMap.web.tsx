// Week 13: 플랫폼별 파일 (Week 3 "Platform-Specific Files")
// react-native-maps 는 웹에서 동작하지 않는다. Metro 는 웹으로 번들할 때 SpotMap.tsx 대신
// 이 SpotMap.web.tsx 를 고른다. 그래서 웹에서는 지도 대신 "가까운 순 목록"을 보여준다.
// 두 파일은 같은 props 를 받으므로 map.tsx 는 아무것도 바꿀 필요가 없다.
import { View, Text, FlatList, Pressable, StyleSheet } from "react-native";
import { useAtomValue } from "jotai";
import { spotsAtom } from "@/store/spotsAtom";
import { myLocationAtom } from "@/store/locationAtom";
import { useWatchLocation } from "@/hooks/useWatchLocation";
import { distanceInMetres, formatDistance } from "@/lib/distance";
import { common } from "@/styles/common";
import type { SpotMapProps } from "./SpotMap";

export type { SpotDraft } from "./SpotMap";

export default function SpotMap({ onOpenSpot }: SpotMapProps) {
  const spots = useAtomValue(spotsAtom);
  const myLocation = useAtomValue(myLocationAtom);
  const errorMsg = useWatchLocation(); // 웹에서는 브라우저가 위치 권한을 묻는다

  const sorted = myLocation
    ? [...spots].sort((a, b) => distanceInMetres(myLocation, a) - distanceInMetres(myLocation, b))
    : spots;

  return (
    <FlatList
      style={common.screen}
      contentContainerStyle={common.content}
      data={sorted}
      keyExtractor={(item) => item.id}
      ListHeaderComponent={
        <View style={styles.notice}>
          <Text style={common.cardTitle}>The map runs on iOS and Android.</Text>
          <Text style={common.subtle}>On the web you get the spots sorted by distance instead.</Text>
          {errorMsg && <Text style={common.error}>{errorMsg}</Text>}
        </View>
      }
      renderItem={({ item }) => (
        <Pressable onPress={() => onOpenSpot(item)} style={({ pressed }) => [common.card, pressed && common.pressed]}>
          <Text style={[common.cardTitle, { flex: 1 }]}>{item.name}</Text>
          <Text style={common.subtle}>{myLocation ? formatDistance(distanceInMetres(myLocation, item)) : `${item.latitude.toFixed(3)}, ${item.longitude.toFixed(3)}`}</Text>
        </Pressable>
      )}
    />
  );
}

const styles = StyleSheet.create({
  notice: { backgroundColor: "#eef2ff", padding: 14, borderRadius: 12, gap: 4 },
});
