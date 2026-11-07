// 루트 레이아웃.
// Week 12: 로그인 상태(authAtom)를 지켜보다가
//   - 로그인 안 했는데 탭 화면에 있으면 → /auth 로
//   - 로그인 했는데 /auth 에 있으면 → /spots 로
// 보낸다. (코스노트 Getting Started with Firebase 의 RootLayoutNav 와 같은 패턴)
//
// app/
// ├── _layout.tsx              ← 지금 이 파일
// ├── auth.tsx                 ← /auth  (Week 12)
// ├── edit/[id].tsx            ← /edit/3 (Week 11, 모달)
// └── (tabs)/
//     ├── _layout.tsx          ← Tabs
//     ├── spots/ (_layout, index, [id], reviews/[id])
//     ├── map.tsx
//     ├── saved.tsx
//     └── about.tsx
import { useEffect, useState } from "react";
import { Stack, useRouter, useSegments } from "expo-router";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { StatusBar } from "expo-status-bar";
import { useAtomValue } from "jotai";
import { authAtom } from "@/store/authAtom";

export default function RootLayout() {
  const user = useAtomValue(authAtom);
  const segments = useSegments(); // 지금 URL 의 조각들. 예: ["(tabs)", "spots", "[id]"]
  const router = useRouter();

  // 네비게이션이 준비되기 전에 replace 하면 에러가 나므로, 한 번 렌더된 뒤에만 이동한다
  const [hasMounted, setHasMounted] = useState(false);
  useEffect(() => setHasMounted(true), []);

  useEffect(() => {
    if (!hasMounted) return;
    const inAuth = segments[0] === "auth";
    if (!user && !inAuth) {
      router.replace("/auth"); // replace: 뒤로가기로 돌아올 수 없게 바꿔치기
    } else if (user && inAuth) {
      router.replace("/spots");
    }
  }, [user, segments, hasMounted]);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="auth" options={{ headerShown: false, title: "Sign in" }} />
        <Stack.Screen name="edit/[id]" options={{ presentation: "modal", title: "Edit spot" }} />
      </Stack>
      <StatusBar style="auto" />
    </GestureHandlerRootView>
  );
}
