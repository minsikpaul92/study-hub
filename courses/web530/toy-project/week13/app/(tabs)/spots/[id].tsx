// /spots/[id] : 동적 라우트. 파일 이름의 [id] 가 URL 의 값이 된다. (/spots/3 → id = "3")
// Week 11: 헤더에 Edit(연필) 버튼 → /edit/[id] 모달, 아래에 Delete 버튼 (확인 후 DELETE)
import { View, Text, Image, ScrollView, Pressable, Alert, StyleSheet } from "react-native";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useAtomValue, useSetAtom } from "jotai";
import { spotsAtom, deleteSpotAtom } from "@/store/spotsAtom";
import { authAtom } from "@/store/authAtom";
import AppButton from "@/components/AppButton";
import HeartButton from "@/components/HeartButton";
import { colors, common } from "@/styles/common";

export default function SpotDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const spots = useAtomValue(spotsAtom);
  const deleteSpot = useSetAtom(deleteSpotAtom);
  const user = useAtomValue(authAtom);
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
  const isMine = spot.createdBy === user?.localId; // Week 12: 내가 만든 스팟만 수정/삭제 가능

  // 지우기는 되돌릴 수 없으므로 한 번 더 묻는다 (Week 6 Touch UX: 위험한 동작은 두 번의 의도적인 행동)
  function confirmDelete() {
    Alert.alert("Delete spot?", `"${spot.name}" will be removed for everyone.`, [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          try {
            await deleteSpot(spot.id);
            router.back();
          } catch {
            Alert.alert("Could not delete", "Try again.");
          }
        },
      },
    ]);
  }

  return (
    <ScrollView style={common.screen} contentContainerStyle={common.content}>
      {/* 화면 안에서 헤더 옵션을 바꾸는 Expo Router 방식 (React Navigation 의 options 함수 대신) */}
      <Stack.Screen
        options={{
          title: spot.name,
          headerRight: () => (
            <View style={styles.headerButtons}>
              {isMine && (
                <Pressable hitSlop={12} onPress={() => router.push({ pathname: "/edit/[id]", params: { id: spot.id } })}>
                  <Ionicons name="create-outline" size={24} color="white" />
                </Pressable>
              )}
              <HeartButton id={spot.id} />
            </View>
          ),
        }}
      />

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
      {isMine && <AppButton title="Delete spot" color={colors.danger} onPress={confirmDelete} />}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  hero: { width: "100%", height: 180, borderRadius: 12 },
  headerButtons: { flexDirection: "row", alignItems: "center", gap: 16 },
});
