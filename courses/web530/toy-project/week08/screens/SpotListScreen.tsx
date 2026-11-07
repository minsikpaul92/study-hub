import { useState } from "react";
import { View, Text, TextInput, FlatList, ScrollView, Pressable, StyleSheet } from "react-native";
import { useAtomValue } from "jotai";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { spotsAtom, Spot } from "../store/spotsAtom";
import { myLocationAtom } from "../store/locationAtom";
import { distanceInMetres } from "../lib/distance";
import { CATEGORIES } from "../data/spots";
import SpotCard from "../components/SpotCard";
import TipCard from "../components/TipCard";
import AppButton from "../components/AppButton";
import { colors, common } from "../styles/common";
import type { SpotsStackParamList } from "../navigation/types";

type Props = NativeStackScreenProps<SpotsStackParamList, "SpotList">;
type SortBy = "name" | "rating" | "near";

export default function SpotListScreen({ navigation }: Props) {
  const spots = useAtomValue(spotsAtom);
  const myLocation = useAtomValue(myLocationAtom);
  const [sortBy, setSortBy] = useState<SortBy>("name");
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<string>("All");

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
          <SpotCard spot={item} onPress={() => navigation.navigate("SpotDetail", { id: item.id, name: item.name })} />
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
        ListEmptyComponent={<Text style={common.subtle}>No spots match.</Text>}
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
