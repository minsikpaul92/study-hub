import { View, Text, Image, ScrollView, StyleSheet } from "react-native";
import { useAtomValue } from "jotai";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { spotsAtom } from "../store/spotsAtom";
import AppButton from "../components/AppButton";
import { colors, common } from "../styles/common";
import type { SpotsStackParamList } from "../navigation/types";

type Props = NativeStackScreenProps<SpotsStackParamList, "SpotDetail">;

export default function SpotDetailScreen({ navigation, route }: Props) {
  const spots = useAtomValue(spotsAtom);
  const { id } = route.params ?? {};
  const index = spots.findIndex((s) => s.id === id);
  const spot = spots[index];

  if (!spot) {
    return (
      <View style={common.center}>
        <Text>Spot not found</Text>
      </View>
    );
  }
  const next = spots[(index + 1) % spots.length];

  return (
    <ScrollView style={common.screen} contentContainerStyle={common.content}>
      <Image source={{ uri: `https://picsum.photos/seed/spot${spot.id}/600/300` }} style={styles.hero} />
      <Text style={common.title}>{spot.name}</Text>
      <Text style={common.subtle}>
        {spot.category} · {spot.campus} · ★ {spot.rating.toFixed(1)}
      </Text>
      <Text style={common.body}>{spot.description}</Text>
      <AppButton title="Read reviews" onPress={() => navigation.navigate("Reviews", { id: spot.id, name: spot.name })} />
      <AppButton
        title="Show on map"
        color={colors.green}
        // 부모(Tab) 네비게이터의 화면으로 이동
        onPress={() => navigation.getParent()?.navigate("Map", { focusId: spot.id, at: Date.now() })}
      />
      <AppButton title={`Next: ${next.name}`} color={colors.gray} onPress={() => navigation.push("SpotDetail", { id: next.id, name: next.name })} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  hero: { width: "100%", height: 180, borderRadius: 12 },
});
