// Week 9: Expo Router 루트 레이아웃
// App.tsx 와 NavigationContainer 가 사라졌다. app/ 폴더의 파일 구조가 곧 네비게이션 구조다.
//
// app/
// ├── _layout.tsx              ← 지금 이 파일 (Stack: 전체 앱을 감싼다)
// └── (tabs)/                  ← 괄호 폴더 = Route Group (URL 에 안 나타남)
//     ├── _layout.tsx          ← Tabs (하단 탭 4개)
//     ├── spots/
//     │   ├── _layout.tsx      ← Spots 탭 안의 Stack
//     │   ├── index.tsx        ← /spots          목록
//     │   ├── [id].tsx         ← /spots/3        상세 (동적 라우트)
//     │   └── reviews/[id].tsx ← /spots/reviews/3 리뷰
//     ├── map.tsx              ← /map
//     ├── saved.tsx            ← /saved
//     └── about.tsx            ← /about
import { Stack } from "expo-router";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { StatusBar } from "expo-status-bar";

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      </Stack>
      <StatusBar style="light" />
    </GestureHandlerRootView>
  );
}
