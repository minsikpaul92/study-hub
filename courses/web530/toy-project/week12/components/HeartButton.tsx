import { Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useAtomValue } from "jotai";
import { savedIdsAtom, useToggleSaved } from "../store/savedAtom";
import { colors, common } from "../styles/common";

// 24pt 아이콘 + hitSlop 12 → 실제 터치 영역은 48pt
export default function HeartButton({ id }: { id?: string }) {
  const savedIds = useAtomValue(savedIdsAtom);
  const toggle = useToggleSaved();
  const isSaved = id ? savedIds.includes(id) : false;
  return (
    <Pressable
      disabled={!id}
      hitSlop={12}
      onPress={() => id && toggle(id)}
      style={({ pressed }) => pressed && common.pressed}
    >
      <Ionicons name={isSaved ? "heart" : "heart-outline"} size={24} color={colors.heart} />
    </Pressable>
  );
}
