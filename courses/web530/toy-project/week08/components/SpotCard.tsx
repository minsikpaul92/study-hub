import { View, Text, Image, Pressable, StyleSheet } from "react-native";
import { useAtomValue } from "jotai";
import HeartButton from "./HeartButton";
import { Spot } from "../store/spotsAtom";
import { myLocationAtom } from "../store/locationAtom";
import { useToggleSaved } from "../store/savedAtom";
import { distanceInMetres, formatDistance } from "../lib/distance";
import { colors, common } from "../styles/common";

interface SpotCardProps {
  spot: Spot;
  onPress: () => void; // 어디로 이동할지는 부모(화면)가 정한다 → 카드는 네비게이션 방식을 몰라도 됨
}

export default function SpotCard({ spot, onPress }: SpotCardProps) {
  const toggle = useToggleSaved();
  const myLocation = useAtomValue(myLocationAtom);
  return (
    <Pressable
      onPress={onPress}
      onLongPress={() => toggle(spot.id)}
      style={({ pressed }) => [common.card, pressed && styles.pressed]}
    >
      <Image source={{ uri: `https://picsum.photos/seed/spot${spot.id}/120` }} style={styles.thumb} />
      <View style={styles.body}>
        <Text style={common.cardTitle} numberOfLines={1}>
          {spot.name}
        </Text>
        <Text style={common.subtle}>
          {spot.category} · {spot.campus} · ★ {spot.rating.toFixed(1)}
        </Text>
        {myLocation && (
          <Text style={styles.distance}>{formatDistance(distanceInMetres(myLocation, spot))} away</Text>
        )}
      </View>
      <HeartButton id={spot.id} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  pressed: { backgroundColor: "#eef2ff", transform: [{ scale: 0.98 }] },
  thumb: { width: 56, height: 56, borderRadius: 8 },
  body: { flex: 1, gap: 4 },
  distance: { color: colors.green, fontSize: 13 },
});
