// /spots : 스팟 목록.
// Week 10: 데이터를 Firestore 에서 GET 으로 받아온다. 로딩 / 에러 / 당겨서 새로고침 (Week 5 패턴 그대로)
import { useEffect, useState } from "react";
import { View, Text, TextInput, FlatList, ScrollView, Pressable, ActivityIndicator, StyleSheet } from "react-native";
import { useAtomValue, useSetAtom } from "jotai";
import { useRouter } from "expo-router";
import { spotsAtom, fetchSpotsAtom, Spot } from "@/store/spotsAtom";
import { myLocationAtom } from "@/store/locationAtom";
import { distanceInMetres } from "@/lib/distance";
import { CATEGORIES } from "@/data/spots";
import SpotCard from "@/components/SpotCard";
import TipCard from "@/components/TipCard";
import AppButton from "@/components/AppButton";
import { colors, common } from "@/styles/common";

type SortBy = "name" | "rating" | "near";

export default function SpotListScreen() {
  const router = useRouter();
  const spots = useAtomValue(spotsAtom);
  const myLocation = useAtomValue(myLocationAtom);
  const [sortBy, setSortBy] = useState<SortBy>("name");
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<string>("All");
  const fetchSpots = useSetAtom(fetchSpotsAtom);
  const [loading, setLoading] = useState(spots.length === 0);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function load() {
    try {
      await fetchSpots();
      setError(null);
    } catch {
      setError("Could not load spots. Check firebaseConfig and your connection.");
    }
  }

  // 처음 들어왔을 때 store 가 비어 있으면 불러온다
  useEffect(() => {
    if (spots.length === 0) load().finally(() => setLoading(false));
  }, []);

  async function refresh() {
    setRefreshing(true);
    await load();
    setRefreshing(false);
  }

  function compare(a: Spot, b: Spot) {
    if (sortBy === "rating") return b.rating - a.rating;
    if (sortBy === "near" && myLocation) return distanceInMetres(myLocation, a) - distanceInMetres(myLocation, b);
    return a.name.localeCompare(b.name);
  }

  function nextSort() {
    setSortBy((prev) => (prev === "name" ? "rating" : prev === "rating" && myLocation ? "near" : "name"));
  }

  const visible = [...spots]
    .filter((s) => category === "All" || s.category === category)
    .filter((s) => s.name.toLowerCase().includes(query.toLowerCase()))
    .sort(compare);

  if (loading) {
    return (
      <View style={common.center}>
        <ActivityIndicator size="large" />
        <Text>Loading spots...</Text>
      </View>
    );
  }

  if (error && spots.length === 0) {
    return (
      <View style={common.center}>
        <Text style={common.error}>{error}</Text>
        <AppButton
          title="Try Again"
          onPress={() => {
            setLoading(true);
            load().finally(() => setLoading(false));
          }}
        />
      </View>
    );
  }

  return (
    <View style={common.screen}>
      <View style={styles.toolbar}>
        <TextInput value={query} onChangeText={setQuery} placeholder="Search spots" style={common.input} />
        <AppButton title={{ name: "A-Z", rating: "★", near: "Near" }[sortBy]} onPress={nextSort} />
      </View>
      <View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chips}>
          {CATEGORIES.map((c) => (
            <Pressable
              key={c}
              onPress={() => setCategory(c)}
              style={({ pressed }) => [styles.chip, category === c && styles.chipActive, pressed && common.pressed]}
            >
              <Text style={category === c ? styles.chipTextActive : undefined}>{c}</Text>
            </Pressable>
          ))}
        </ScrollView>
      </View>
      <FlatList
        data={visible}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <SpotCard spot={item} onPress={() => router.push({ pathname: "/spots/[id]", params: { id: item.id } })} />
        )}
        contentContainerStyle={common.content}
        ListHeaderComponent={
          <View style={{ gap: 8 }}>
            <TipCard text="Tip: long-press a spot to save it. Swipe this card away." />
            <Text style={common.subtle}>
              {visible.length} of {spots.length} spots
            </Text>
          </View>
        }
        ListEmptyComponent={
          <Text style={common.subtle}>
            {spots.length === 0 ? "No spots in Firestore yet. Go to About and tap Seed sample spots." : "No spots match."}
          </Text>
        }
        refreshing={refreshing}
        onRefresh={refresh}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  toolbar: { flexDirection: "row", alignItems: "center", gap: 8, paddingHorizontal: 16, paddingTop: 12 },
  chips: { gap: 8, paddingHorizontal: 16, paddingTop: 12 },
  chip: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: 999, backgroundColor: "white", borderWidth: 1, borderColor: "#d1d5db" },
  chipActive: { backgroundColor: colors.primary, borderColor: colors.primary },
  chipTextActive: { color: "white", fontWeight: "600" },
});
