// Campus Spots - Week 4: Navigation (Tabs + nested Stack, params, header, push/pop, useNavigation, Jotai across screens)
// 이번 주 목표: 한 화면짜리 앱을 "탭 3개 + 스택" 구조로 바꾼다. (Lab 4 와 같은 구조)
//
//   NavigationContainer
//   └─ Tab.Navigator
//      ├─ "SpotsTab"  → SpotsStack (Stack.Navigator)
//      │                 ├─ "SpotList"
//      │                 └─ "SpotDetail"   (params: id, name)
//      ├─ "Saved"
//      └─ "About"
import { View, Text, Image, Button, ScrollView, StyleSheet, Platform } from "react-native";
import { NavigationContainer, useNavigation } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";
import { atom, useAtom, useAtomValue } from "jotai";

// ---------- 데이터 (이번 주부터 좌표와 설명도 넣어둔다. Week 7 지도에서 쓴다) ----------
const SPOTS = [
  { id: "1", name: "Library Quiet Zone", category: "Study", rating: 4.7, campus: "Newnham", latitude: 43.7953, longitude: -79.3487, description: "Silent floor with outlets at every desk." },
  { id: "2", name: "Tim Hortons (Building A)", category: "Food", rating: 3.9, campus: "Newnham", latitude: 43.7949, longitude: -79.3509, description: "Coffee and a quick bagel between classes." },
  { id: "3", name: "Courtyard Benches", category: "Chill", rating: 4.2, campus: "Newnham", latitude: 43.7941, longitude: -79.3497, description: "Sunny benches in the middle of campus." },
  { id: "4", name: "Learning Commons", category: "Study", rating: 4.5, campus: "Seneca@York", latitude: 43.7715, longitude: -79.4989, description: "Group tables and bookable rooms." },
  { id: "5", name: "Markham Cafe", category: "Food", rating: 4.1, campus: "Markham", latitude: 43.8497, longitude: -79.3667, description: "Bright cafe with good soup." },
  { id: "6", name: "King Lake Trail", category: "Chill", rating: 4.8, campus: "King", latitude: 43.9542, longitude: -79.5172, description: "Walking trail around Lake Seneca." },
];

// ---------- 전역 상태 ----------
// 화면이 여러 개가 되었으므로 스팟 목록과 저장 목록을 모두 atom 으로 둔다.
const spotsAtom = atom(SPOTS);
const savedIdsAtom = atom([]);

// ---------- 공용 컴포넌트 ----------
function SaveButton({ id }) {
  const [savedIds, setSavedIds] = useAtom(savedIdsAtom);
  const isSaved = savedIds.includes(id);
  return (
    <Button
      title={isSaved ? "♥" : "♡"}
      color="#e11d48"
      disabled={!id}
      onPress={() =>
        setSavedIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]))
      }
    />
  );
}

// useNavigation 훅: 화면 컴포넌트가 아니어도 navigation 객체를 꺼낼 수 있다
function SpotCard({ spot }) {
  const navigation = useNavigation();
  return (
    <View style={styles.card}>
      <Image source={{ uri: `https://picsum.photos/seed/spot${spot.id}/120` }} style={styles.thumb} />
      <View style={styles.cardBody}>
        <Text style={styles.cardTitle} numberOfLines={1}>
          {spot.name}
        </Text>
        <Text style={styles.subtle}>
          {spot.category} · {spot.campus} · ★ {spot.rating.toFixed(1)}
        </Text>
        <Button
          title="Details"
          onPress={() => navigation.navigate("SpotDetail", { id: spot.id, name: spot.name })}
        />
      </View>
      <SaveButton id={spot.id} />
    </View>
  );
}

// ---------- 화면 ----------
function SpotListScreen() {
  const spots = useAtomValue(spotsAtom);
  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
      {spots.map((spot) => (
        <SpotCard key={spot.id} spot={spot} />
      ))}
    </ScrollView>
  );
}

function SpotDetailScreen({ navigation, route }) {
  const spots = useAtomValue(spotsAtom);
  // params 가 없을 수도 있다 → ?? {} 로 방어 (없으면 크래시)
  const { id } = route.params ?? {};
  const index = spots.findIndex((s) => s.id === id);
  const spot = spots[index];

  if (!spot) {
    return (
      <View style={styles.center}>
        <Text>Spot not found</Text>
      </View>
    );
  }

  const next = spots[(index + 1) % spots.length]; // 마지막 다음은 처음으로

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
      <Image source={{ uri: `https://picsum.photos/seed/spot${spot.id}/600/300` }} style={styles.hero} />
      <Text style={styles.title}>{spot.name}</Text>
      <Text style={styles.subtle}>
        {spot.category} · {spot.campus} · ★ {spot.rating.toFixed(1)}
      </Text>
      <Text style={styles.body}>{spot.description}</Text>

      {/* push: 같은 화면을 위에 하나 더 쌓는다 (navigate 는 같은 화면이면 쌓지 않음) */}
      <Button title={`Next spot: ${next.name}`} onPress={() => navigation.push("SpotDetail", { id: next.id, name: next.name })} />
      <Button title="Back to list" onPress={() => navigation.popToTop()} />
    </ScrollView>
  );
}

function SavedScreen() {
  const spots = useAtomValue(spotsAtom);
  const savedIds = useAtomValue(savedIdsAtom);
  const saved = spots.filter((s) => savedIds.includes(s.id));
  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
      {saved.length === 0 ? (
        <Text style={styles.subtle}>No saved spots yet. Tap ♡ on a spot.</Text>
      ) : (
        saved.map((spot) => (
          <View key={spot.id} style={styles.card}>
            <Text style={[styles.cardTitle, { flex: 1 }]}>{spot.name}</Text>
            <SaveButton id={spot.id} />
          </View>
        ))
      )}
    </ScrollView>
  );
}

function AboutScreen() {
  return (
    <View style={styles.center}>
      <Text style={styles.title}>Campus Spots</Text>
      <Text style={styles.subtle}>WEB530 toy project</Text>
      <Text style={styles.subtle}>Made by: Paul</Text>
    </View>
  );
}

// ---------- 네비게이터 ----------
const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function SpotsStack() {
  return (
    <Stack.Navigator
      screenOptions={{ headerStyle: { backgroundColor: "#4f46e5" }, headerTintColor: "#fff" }}
    >
      <Stack.Screen name="SpotList" component={SpotListScreen} options={{ title: "Campus Spots" }} />
      <Stack.Screen
        name="SpotDetail"
        component={SpotDetailScreen}
        // options 를 함수로 쓰면 route.params 를 읽어 제목을 만들 수 있다
        options={({ route }) => ({
          title: route.params?.name ?? "Details",
          headerRight: () => <SaveButton id={route.params?.id} />,
        })}
      />
    </Stack.Navigator>
  );
}

export default function MyApp() {
  return (
    <NavigationContainer>
      <Tab.Navigator screenOptions={{ tabBarActiveTintColor: "#4f46e5" }}>
        <Tab.Screen
          name="SpotsTab"
          component={SpotsStack}
          options={{
            title: "Spots",
            headerShown: false, // 안쪽 Stack 이 헤더를 그리므로 탭 헤더는 숨긴다 (헤더 두 줄 방지)
            tabBarIcon: ({ color, size }) => <Ionicons name="location" color={color} size={size} />,
          }}
        />
        <Tab.Screen
          name="Saved"
          component={SavedScreen}
          options={{
            tabBarIcon: ({ color, size }) => <Ionicons name="heart" color={color} size={size} />,
          }}
        />
        <Tab.Screen
          name="About"
          component={AboutScreen}
          options={{
            tabBarIcon: ({ color, size }) => <Ionicons name="information-circle" color={color} size={size} />,
          }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: "#f5f5f7" },
  content: { padding: 16, gap: 12 },
  center: { flex: 1, alignItems: "center", justifyContent: "center", gap: 6 },
  title: { fontSize: 24, fontWeight: "bold", color: "#1c1c1e" },
  subtle: { color: "#6b7280" },
  body: { fontSize: 16, lineHeight: 22 },
  card: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    padding: 12,
    borderRadius: 12,
    backgroundColor: "white",
    ...Platform.select({
      ios: { shadowColor: "#000", shadowOpacity: 0.08, shadowRadius: 6, shadowOffset: { width: 0, height: 2 } },
      android: { elevation: 2 },
      default: { borderWidth: 1, borderColor: "#e5e7eb" },
    }),
  },
  thumb: { width: 56, height: 56, borderRadius: 8 },
  hero: { width: "100%", height: 180, borderRadius: 12 },
  cardBody: { flex: 1, gap: 4, alignItems: "flex-start" },
  cardTitle: { fontSize: 16, fontWeight: "600" },
});
