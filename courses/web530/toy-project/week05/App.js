// Campus Spots - Week 5: Lists (FlatList, sort/filter/search, empty state, fetch, list-detail, pull to refresh)
// 이번 주 목표:
//  - SpotList 를 ScrollView + map() 에서 FlatList 로 바꾼다
//  - 정렬 버튼(이름/평점), 검색창, 결과 개수, 빈 화면(ListEmptyComponent)
//  - 상세 화면에서 "Reviews" 화면으로 이동 → 인터넷에서 리뷰를 fetch (로딩/에러/빈 화면/당겨서 새로고침)
//    리뷰 API: https://jsonplaceholder.typicode.com/comments?postId=스팟id (가짜 API지만 진짜 네트워크 요청)
import { useState, useEffect } from "react";
import {
  View,
  Text,
  Image,
  Button,
  TextInput,
  FlatList,
  ScrollView,
  ActivityIndicator,
  StyleSheet,
  Platform,
} from "react-native";
import { NavigationContainer, useNavigation } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";
import { atom, useAtom, useAtomValue } from "jotai";

const SPOTS = [
  { id: "1", name: "Library Quiet Zone", category: "Study", rating: 4.7, campus: "Newnham", latitude: 43.7953, longitude: -79.3487, description: "Silent floor with outlets at every desk." },
  { id: "2", name: "Tim Hortons (Building A)", category: "Food", rating: 3.9, campus: "Newnham", latitude: 43.7949, longitude: -79.3509, description: "Coffee and a quick bagel between classes." },
  { id: "3", name: "Courtyard Benches", category: "Chill", rating: 4.2, campus: "Newnham", latitude: 43.7941, longitude: -79.3497, description: "Sunny benches in the middle of campus." },
  { id: "4", name: "Learning Commons", category: "Study", rating: 4.5, campus: "Seneca@York", latitude: 43.7715, longitude: -79.4989, description: "Group tables and bookable rooms." },
  { id: "5", name: "Markham Cafe", category: "Food", rating: 4.1, campus: "Markham", latitude: 43.8497, longitude: -79.3667, description: "Bright cafe with good soup." },
  { id: "6", name: "King Lake Trail", category: "Chill", rating: 4.8, campus: "King", latitude: 43.9542, longitude: -79.5172, description: "Walking trail around Lake Seneca." },
];

const REVIEWS_URL = "https://jsonplaceholder.typicode.com/comments?postId=";

const spotsAtom = atom(SPOTS);
const savedIdsAtom = atom([]);

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

// ---------- 목록 화면: 정렬 + 검색 + 개수 + 빈 화면 ----------
function SpotListScreen() {
  const spots = useAtomValue(spotsAtom);
  const [sortBy, setSortBy] = useState("name"); // "name" | "rating"
  const [query, setQuery] = useState("");

  // 원본 배열은 건드리지 않는다: filter() 는 새 배열, sort() 전에 [...] 로 복사
  const visible = [...spots]
    .filter((s) => s.name.toLowerCase().includes(query.toLowerCase()))
    .sort((a, b) => (sortBy === "name" ? a.name.localeCompare(b.name) : b.rating - a.rating));

  return (
    <View style={styles.screen}>
      <View style={styles.toolbar}>
        <TextInput value={query} onChangeText={setQuery} placeholder="Search spots" style={styles.input} />
        <Button
          title={sortBy === "name" ? "Sort: A-Z" : "Sort: ★"}
          onPress={() => setSortBy((prev) => (prev === "name" ? "rating" : "name"))}
        />
      </View>
      <Text style={styles.count}>
        {visible.length} of {spots.length} spots
      </Text>
      <FlatList
        data={visible}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <SpotCard spot={item} />}
        contentContainerStyle={styles.content}
        ListEmptyComponent={<Text style={styles.subtle}>No spots match "{query}".</Text>}
      />
    </View>
  );
}

function SpotDetailScreen({ navigation, route }) {
  const spots = useAtomValue(spotsAtom);
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

  const next = spots[(index + 1) % spots.length];

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
      <Image source={{ uri: `https://picsum.photos/seed/spot${spot.id}/600/300` }} style={styles.hero} />
      <Text style={styles.title}>{spot.name}</Text>
      <Text style={styles.subtle}>
        {spot.category} · {spot.campus} · ★ {spot.rating.toFixed(1)}
      </Text>
      <Text style={styles.body}>{spot.description}</Text>
      <Button title="Read reviews" onPress={() => navigation.navigate("Reviews", { id: spot.id, name: spot.name })} />
      <Button title={`Next spot: ${next.name}`} onPress={() => navigation.push("SpotDetail", { id: next.id, name: next.name })} />
      <Button title="Back to list" onPress={() => navigation.popToTop()} />
    </ScrollView>
  );
}

// ---------- 리뷰 화면: fetch + 로딩 + 에러 + 빈 화면 + 당겨서 새로고침 ----------
function ReviewsScreen({ route }) {
  const { id } = route.params ?? {};
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [updatedAt, setUpdatedAt] = useState(null);

  function loadReviews() {
    return fetch(REVIEWS_URL + id)
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then((json) => {
        setReviews(json);
        setUpdatedAt(new Date());
        setError(null);
      })
      .catch(() => setError("Could not load reviews. Check your connection and try again."));
  }

  useEffect(() => {
    loadReviews().finally(() => setLoading(false));
  }, [id]);

  function retry() {
    setLoading(true);
    loadReviews().finally(() => setLoading(false));
  }

  function refresh() {
    setRefreshing(true);
    loadReviews().finally(() => setRefreshing(false));
  }

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
        <Text>Loading reviews...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.center}>
        <Text style={styles.error}>{error}</Text>
        <Button title="Try Again" onPress={retry} />
      </View>
    );
  }

  return (
    <FlatList
      style={styles.screen}
      contentContainerStyle={styles.content}
      data={reviews}
      keyExtractor={(item) => item.id.toString()}
      renderItem={({ item }) => (
        <View style={styles.review}>
          <Text style={styles.cardTitle}>{item.email}</Text>
          <Text>{item.body}</Text>
        </View>
      )}
      ListHeaderComponent={<Text style={styles.count}>Updated {updatedAt?.toLocaleTimeString()}</Text>}
      ListEmptyComponent={<Text style={styles.subtle}>No reviews yet.</Text>}
      refreshing={refreshing}
      onRefresh={refresh}
    />
  );
}

function SavedScreen() {
  const spots = useAtomValue(spotsAtom);
  const savedIds = useAtomValue(savedIdsAtom);
  const saved = spots.filter((s) => savedIds.includes(s.id));
  return (
    <FlatList
      style={styles.screen}
      contentContainerStyle={styles.content}
      data={saved}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <View style={styles.card}>
          <Text style={[styles.cardTitle, { flex: 1 }]}>{item.name}</Text>
          <SaveButton id={item.id} />
        </View>
      )}
      ListEmptyComponent={<Text style={styles.subtle}>No saved spots yet. Tap ♡ on a spot.</Text>}
    />
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

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function SpotsStack() {
  return (
    <Stack.Navigator screenOptions={{ headerStyle: { backgroundColor: "#4f46e5" }, headerTintColor: "#fff" }}>
      <Stack.Screen name="SpotList" component={SpotListScreen} options={{ title: "Campus Spots" }} />
      <Stack.Screen
        name="SpotDetail"
        component={SpotDetailScreen}
        options={({ route }) => ({
          title: route.params?.name ?? "Details",
          headerRight: () => <SaveButton id={route.params?.id} />,
        })}
      />
      <Stack.Screen
        name="Reviews"
        component={ReviewsScreen}
        options={({ route }) => ({ title: `Reviews: ${route.params?.name ?? ""}` })}
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
            headerShown: false,
            tabBarIcon: ({ color, size }) => <Ionicons name="location" color={color} size={size} />,
          }}
        />
        <Tab.Screen
          name="Saved"
          component={SavedScreen}
          options={{ tabBarIcon: ({ color, size }) => <Ionicons name="heart" color={color} size={size} /> }}
        />
        <Tab.Screen
          name="About"
          component={AboutScreen}
          options={{ tabBarIcon: ({ color, size }) => <Ionicons name="information-circle" color={color} size={size} /> }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: "#f5f5f7" },
  content: { padding: 16, gap: 12 },
  center: { flex: 1, alignItems: "center", justifyContent: "center", gap: 8, padding: 20 },
  toolbar: { flexDirection: "row", alignItems: "center", gap: 8, paddingHorizontal: 16, paddingTop: 12 },
  input: { flex: 1, backgroundColor: "white", borderWidth: 1, borderColor: "#d1d5db", borderRadius: 8, padding: 10 },
  count: { color: "#6b7280", paddingHorizontal: 16, paddingTop: 8 },
  title: { fontSize: 24, fontWeight: "bold", color: "#1c1c1e" },
  subtle: { color: "#6b7280" },
  body: { fontSize: 16, lineHeight: 22 },
  error: { color: "#dc2626", textAlign: "center" },
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
  review: { backgroundColor: "white", padding: 12, borderRadius: 12, gap: 4 },
  thumb: { width: 56, height: 56, borderRadius: 8 },
  hero: { width: "100%", height: 180, borderRadius: 12 },
  cardBody: { flex: 1, gap: 4, alignItems: "flex-start" },
  cardTitle: { fontSize: 16, fontWeight: "600" },
});
