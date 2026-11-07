// 탭 레이아웃.
// Week 13: 로그인하면 내 저장 목록을 서버에서 불러오고, Saved 탭에 개수 배지를 단다.
import { useEffect } from "react";
import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useAtomValue, useSetAtom } from "jotai";
import { authAtom } from "@/store/authAtom";
import { savedIdsAtom, loadSavedAtom } from "@/store/savedAtom";
import { colors } from "@/styles/common";

export default function TabLayout() {
  const user = useAtomValue(authAtom);
  const savedIds = useAtomValue(savedIdsAtom);
  const loadSaved = useSetAtom(loadSavedAtom);

  useEffect(() => {
    if (user) loadSaved().catch(() => {}); // 실패해도 앱은 계속 쓸 수 있게 조용히 넘어간다
  }, [user]);

  return (
    <Tabs screenOptions={{ tabBarActiveTintColor: colors.primary }}>
      <Tabs.Screen
        name="spots"
        options={{
          title: "Spots",
          headerShown: false,
          tabBarIcon: ({ color, size }) => <Ionicons name="location" color={color} size={size} />,
        }}
      />
      <Tabs.Screen
        name="map"
        options={{ title: "Map", tabBarIcon: ({ color, size }) => <Ionicons name="map" color={color} size={size} /> }}
      />
      <Tabs.Screen
        name="saved"
        options={{
          title: "Saved",
          tabBarIcon: ({ color, size }) => <Ionicons name="heart" color={color} size={size} />,
          // 0 이면 배지를 숨긴다 (undefined)
          tabBarBadge: savedIds.length > 0 ? savedIds.length : undefined,
        }}
      />
      <Tabs.Screen
        name="about"
        options={{ title: "About", tabBarIcon: ({ color, size }) => <Ionicons name="information-circle" color={color} size={size} /> }}
      />
    </Tabs>
  );
}
