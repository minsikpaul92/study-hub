import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "@/styles/common";

// Tabs.Screen 의 name 은 파일/폴더 이름과 같아야 한다 (spots 폴더, map.tsx ...)
export default function TabLayout() {
  return (
    <Tabs screenOptions={{ tabBarActiveTintColor: colors.primary }}>
      <Tabs.Screen
        name="spots"
        options={{
          title: "Spots",
          headerShown: false, // 안쪽 spots/_layout.tsx 의 Stack 이 헤더를 그린다 (헤더 두 줄 방지)
          tabBarIcon: ({ color, size }) => <Ionicons name="location" color={color} size={size} />,
        }}
      />
      <Tabs.Screen
        name="map"
        options={{ title: "Map", tabBarIcon: ({ color, size }) => <Ionicons name="map" color={color} size={size} /> }}
      />
      <Tabs.Screen
        name="saved"
        options={{ title: "Saved", tabBarIcon: ({ color, size }) => <Ionicons name="heart" color={color} size={size} /> }}
      />
      <Tabs.Screen
        name="about"
        options={{ title: "About", tabBarIcon: ({ color, size }) => <Ionicons name="information-circle" color={color} size={size} /> }}
      />
    </Tabs>
  );
}
