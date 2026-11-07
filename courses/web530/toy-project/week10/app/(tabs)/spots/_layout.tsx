import { Stack } from "expo-router";
import { colors } from "@/styles/common";

// Map 탭에서 /spots/3 으로 바로 들어와도 아래에 목록(index)이 깔리도록 한다 → 뒤로가기 가능
export const unstable_settings = { initialRouteName: "index" };

export default function SpotsLayout() {
  return (
    <Stack screenOptions={{ headerStyle: { backgroundColor: colors.primary }, headerTintColor: "#fff" }}>
      <Stack.Screen name="index" options={{ title: "Campus Spots" }} />
      <Stack.Screen name="[id]" options={{ title: "Details" }} />
      <Stack.Screen name="reviews/[id]" options={{ title: "Reviews" }} />
    </Stack>
  );
}
