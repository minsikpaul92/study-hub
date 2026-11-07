import { Pressable, Text, StyleSheet } from "react-native";
import { colors, common } from "../styles/common";

// props 의 타입을 interface 로 적는다. color 처럼 ? 가 붙으면 선택(optional) prop
interface AppButtonProps {
  title: string;
  onPress: () => void;
  color?: string;
  disabled?: boolean;
}

export default function AppButton({ title, onPress, color = colors.primary, disabled = false }: AppButtonProps) {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      style={({ pressed }) => [
        styles.button,
        { backgroundColor: color },
        (pressed || disabled) && common.pressed,
      ]}
    >
      <Text style={styles.text}>{title}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: { paddingVertical: 12, paddingHorizontal: 16, borderRadius: 10, alignItems: "center", minHeight: 44 },
  text: { color: "white", fontWeight: "600" },
});
