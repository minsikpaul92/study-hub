import { Pressable, Text, StyleSheet } from "react-native";
import { Swipeable } from "react-native-gesture-handler";
import { Ionicons } from "@expo/vector-icons";
import { Spot } from "../store/spotsAtom";
import { colors, common } from "../styles/common";

interface SavedRowProps {
  spot: Spot;
  selected: boolean;
  onToggleSelect: (id: string) => void;
  onRemove: (id: string) => void;
  actionLabel?: string;
}

// 왼쪽으로 밀면 Remove 버튼이 나오는 행 (Week 6 Swipeable 예제)
export default function SavedRow({ spot, selected, onToggleSelect, onRemove, actionLabel = "Remove" }: SavedRowProps) {
  return (
    <Swipeable
      overshootRight={false}
      renderRightActions={() => (
        <Pressable style={styles.delete} onPress={() => onRemove(spot.id)}>
          <Text style={styles.deleteText}>{actionLabel}</Text>
        </Pressable>
      )}
    >
      <Pressable
        onPress={() => onToggleSelect(spot.id)}
        style={({ pressed }) => [styles.row, selected && styles.selected, pressed && common.pressed]}
      >
        <Ionicons name={selected ? "checkbox" : "square-outline"} size={22} color={colors.primary} />
        <Text style={[common.cardTitle, { flex: 1 }]}>{spot.name}</Text>
      </Pressable>
    </Swipeable>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: "row", alignItems: "center", gap: 12, padding: 18, backgroundColor: "white", borderBottomWidth: 1, borderColor: "#e5e7eb" },
  selected: { backgroundColor: "#eef2ff" },
  delete: { justifyContent: "center", paddingHorizontal: 24, backgroundColor: colors.danger },
  deleteText: { color: "white", fontWeight: "600" },
});
