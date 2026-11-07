// /edit/[id] : 스팟 수정 화면 (모달). PATCH 로 바뀐 필드만 저장한다.
import { useState } from "react";
import { View, Text, TextInput, Pressable, ScrollView, Alert, StyleSheet } from "react-native";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import { useAtomValue, useSetAtom } from "jotai";
import { spotsAtom, updateSpotAtom, Spot } from "@/store/spotsAtom";
import { authAtom } from "@/store/authAtom";
import AppButton from "@/components/AppButton";
import { colors, common } from "@/styles/common";

const CATEGORY_OPTIONS: Spot["category"][] = ["Study", "Food", "Chill", "Other"];

export default function EditSpotScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const spot = useAtomValue(spotsAtom).find((s) => s.id === id);
  const updateSpot = useSetAtom(updateSpotAtom);
  const user = useAtomValue(authAtom);

  // 폼의 처음 값 = 지금 스팟의 값 (controlled input)
  const [name, setName] = useState(spot?.name ?? "");
  const [category, setCategory] = useState<Spot["category"]>(spot?.category ?? "Other");
  const [rating, setRating] = useState(spot?.rating ?? 0);
  const [description, setDescription] = useState(spot?.description ?? "");
  const [saving, setSaving] = useState(false);

  if (!spot || spot.createdBy !== user?.localId) {
    return (
      <View style={common.center}>
        <Text>{spot ? "You can only edit spots you created." : "Spot not found"}</Text>
      </View>
    );
  }

  async function save() {
    if (name.trim() === "") {
      Alert.alert("Name is required");
      return;
    }
    setSaving(true);
    try {
      await updateSpot({ id, changes: { name: name.trim(), category, rating, description } });
      router.back(); // 모달 닫기
    } catch {
      Alert.alert("Could not save", "Check your connection and try again.");
    } finally {
      setSaving(false);
    }
  }

  // 평점은 0 ~ 5 사이, 0.5 단위
  function changeRating(delta: number) {
    setRating((prev) => Math.min(5, Math.max(0, prev + delta)));
  }

  return (
    <ScrollView style={common.screen} contentContainerStyle={common.content}>
      <Stack.Screen options={{ title: `Edit ${spot.name}` }} />

      <Text style={styles.label}>Name</Text>
      <TextInput value={name} onChangeText={setName} style={[common.input, styles.full]} />

      <Text style={styles.label}>Category</Text>
      <View style={styles.row}>
        {CATEGORY_OPTIONS.map((c) => (
          <Pressable
            key={c}
            onPress={() => setCategory(c)}
            style={({ pressed }) => [styles.chip, category === c && styles.chipActive, pressed && common.pressed]}
          >
            <Text style={category === c ? styles.chipTextActive : undefined}>{c}</Text>
          </Pressable>
        ))}
      </View>

      <Text style={styles.label}>Rating: ★ {rating.toFixed(1)}</Text>
      <View style={styles.row}>
        <View style={{ flex: 1 }}>
          <AppButton title="- 0.5" color={colors.gray} onPress={() => changeRating(-0.5)} />
        </View>
        <View style={{ flex: 1 }}>
          <AppButton title="+ 0.5" color={colors.gray} onPress={() => changeRating(0.5)} />
        </View>
      </View>

      <Text style={styles.label}>Description</Text>
      <TextInput
        value={description}
        onChangeText={setDescription}
        multiline
        style={[common.input, styles.full, { minHeight: 90, textAlignVertical: "top" }]}
      />

      <AppButton title={saving ? "Saving..." : "Save"} onPress={save} disabled={saving} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  label: { fontWeight: "600", marginTop: 4 },
  full: { flex: 0 },
  row: { flexDirection: "row", gap: 8, flexWrap: "wrap" },
  chip: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: 999, backgroundColor: "white", borderWidth: 1, borderColor: "#d1d5db" },
  chipActive: { backgroundColor: colors.primary, borderColor: colors.primary },
  chipTextActive: { color: "white", fontWeight: "600" },
});
