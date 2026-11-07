// /spots/[id] : 동적 라우트. 파일 이름의 [id] 가 URL 의 값이 된다. (/spots/3 → id = "3")
import { View, Text, Image, ScrollView, StyleSheet } from "react-native";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import { useAtomValue } from "jotai";
import { spotsAtom } from "@/store/spotsAtom";
import AppButton from "@/components/AppButton";
import HeartButton from "@/components/HeartButton";
import { colors, common } from "@/styles/common";

export default function SpotDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const spots = useAtomValue(spotsAtom);
  const index = spots.findIndex((s) => s.id === id);
  const spot = spots[index];

  if (!spot) {
    return (
      <View style={common.center}>
        <Stack.Screen options={{ title: "Details" }} />
        <Text>Spot not found</Text>
      </View>
    );
  }
  const next = spots[(index + 1) % spots.length];

  return (
    <ScrollView style={common.screen} contentContainerStyle={common.content}>
      {/* 화면 안에서 헤더 옵션을 바꾸는 Expo Router 방식 (React Navigation 의 options 함수 대신) */}
      <Stack.Screen options={{ title: spot.name, headerRight: () => <HeartButton id={spot.id} /> }} />

      <Image source={{ uri: `https://picsum.photos/seed/spot${spot.id}/600/300` }} style={styles.hero} />
      <Text style={common.title}>{spot.name}</Text>
      <Text style={common.subtle}>
        {spot.category} · {spot.campus} · ★ {spot.rating.toFixed(1)}
      </Text>
      <Text style={common.body}>{spot.description}</Text>
      <AppButton title="Read reviews" onPress={() => router.push({ pathname: "/spots/reviews/[id]", params: { id: spot.id } })} />
      <AppButton
        title="Show on map"
        color={colors.green}
        onPress={() => router.navigate({ pathname: "/map", params: { focusId: spot.id, at: String(Date.now()) } })}
      />
      {/* push: 같은 [id] 화면을 하나 더 쌓는다 → 뒤로가기로 이전 스팟에 돌아감 */}
      <AppButton title={`Next: ${next.name}`} color={colors.gray} onPress={() => router.push({ pathname: "/spots/[id]", params: { id: next.id } })} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  hero: { width: "100%", height: 180, borderRadius: 12 },
});
