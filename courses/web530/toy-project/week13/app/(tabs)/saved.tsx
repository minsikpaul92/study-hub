import { useState } from "react";
import { View, Text, FlatList } from "react-native";
import { useAtomValue, useSetAtom } from "jotai";
import { spotsAtom } from "@/store/spotsAtom";
import { savedIdsAtom, setSavedAtom } from "@/store/savedAtom";
import SavedRow from "@/components/SavedRow";
import AppButton from "@/components/AppButton";
import { colors, common } from "@/styles/common";

export default function SavedScreen() {
  const spots = useAtomValue(spotsAtom);
  const savedIds = useAtomValue(savedIdsAtom);
  const setSavedIds = useSetAtom(setSavedAtom); // Week 13: 바꾸면 서버(users/{uid})에도 저장된다
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const saved = spots.filter((s) => savedIds.includes(s.id));

  function toggleSelect(id: string) {
    setSelectedIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  }
  function remove(id: string) {
    setSavedIds((prev) => prev.filter((x) => x !== id));
    setSelectedIds((prev) => prev.filter((x) => x !== id));
  }
  function removeSelected() {
    setSavedIds((prev) => prev.filter((x) => !selectedIds.includes(x)));
    setSelectedIds([]);
  }

  return (
    <View style={common.screen}>
      <FlatList
        data={saved}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <SavedRow spot={item} selected={selectedIds.includes(item.id)} onToggleSelect={toggleSelect} onRemove={remove} />
        )}
        ListEmptyComponent={<Text style={[common.subtle, { padding: 16 }]}>No saved spots. Long-press a spot to save it.</Text>}
      />
      {selectedIds.length > 0 && (
        <View style={{ padding: 16 }}>
          <AppButton title={`Remove ${selectedIds.length} selected`} color={colors.danger} onPress={removeSelected} />
        </View>
      )}
    </View>
  );
}
