// Campus Spots - Week 8: Expo 로컬 프로젝트 + TypeScript + 파일 분리
// Snack 의 App.js 하나에 있던 코드를 역할별 폴더로 나눴다. 동작은 Week 7 과 같다.
//   data/        고정 데이터 (스팟 목록, 지도 좌표)
//   store/       Jotai atom (전역 상태) + 타입
//   lib/         순수 함수 (거리 계산)
//   hooks/       커스텀 훅 (위치 watch)
//   components/  재사용 UI
//   screens/     화면
//   navigation/  화면 params 타입
//   styles/      공용 스타일
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { Ionicons } from "@expo/vector-icons";
import { StatusBar } from "expo-status-bar";

import SpotListScreen from "./screens/SpotListScreen";
import SpotDetailScreen from "./screens/SpotDetailScreen";
import ReviewsScreen from "./screens/ReviewsScreen";
import MapScreen from "./screens/MapScreen";
import SavedScreen from "./screens/SavedScreen";
import AboutScreen from "./screens/AboutScreen";
import HeartButton from "./components/HeartButton";
import { colors } from "./styles/common";
import type { SpotsStackParamList, TabParamList } from "./navigation/types";

const Stack = createNativeStackNavigator<SpotsStackParamList>();
const Tab = createBottomTabNavigator<TabParamList>();

function SpotsStack() {
  return (
    <Stack.Navigator screenOptions={{ headerStyle: { backgroundColor: colors.primary }, headerTintColor: "#fff" }}>
      <Stack.Screen name="SpotList" component={SpotListScreen} options={{ title: "Campus Spots" }} />
      <Stack.Screen
        name="SpotDetail"
        component={SpotDetailScreen}
        options={({ route }) => ({
          title: route.params?.name ?? "Details",
          headerRight: () => <HeartButton id={route.params?.id} />,
        })}
      />
      <Stack.Screen name="Reviews" component={ReviewsScreen} options={({ route }) => ({ title: `Reviews: ${route.params?.name ?? ""}` })} />
    </Stack.Navigator>
  );
}

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <NavigationContainer>
        <Tab.Navigator screenOptions={{ tabBarActiveTintColor: colors.primary }}>
          <Tab.Screen
            name="SpotsTab"
            component={SpotsStack}
            options={{ title: "Spots", headerShown: false, tabBarIcon: ({ color, size }) => <Ionicons name="location" color={color} size={size} /> }}
          />
          <Tab.Screen name="Map" component={MapScreen} options={{ tabBarIcon: ({ color, size }) => <Ionicons name="map" color={color} size={size} /> }} />
          <Tab.Screen name="Saved" component={SavedScreen} options={{ tabBarIcon: ({ color, size }) => <Ionicons name="heart" color={color} size={size} /> }} />
          <Tab.Screen name="About" component={AboutScreen} options={{ tabBarIcon: ({ color, size }) => <Ionicons name="information-circle" color={color} size={size} /> }} />
        </Tab.Navigator>
      </NavigationContainer>
      <StatusBar style="light" />
    </GestureHandlerRootView>
  );
}
