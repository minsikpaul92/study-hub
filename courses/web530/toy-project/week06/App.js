// Campus Spots - Week 6: Touch (Pressable, pressed feedback, hitSlop, long press, horizontal ScrollView,
//                         selectable rows, PanResponder drag & snap back, Swipeable delete)
// 이번 주 목표: Button 대신 Pressable 로 "손가락에 반응하는" 앱 만들기
//  - 카드 전체를 누르면 상세로, 길게 누르면 저장 토글
//  - 작은 하트 아이콘은 hitSlop 으로 터치 영역을 넓힌다
//  - 카테고리 칩을 가로 ScrollView 로
//  - 목록 위 "팁 카드"를 옆으로 밀어서 닫기 (PanResponder + Animated)
//  - Saved 탭: 행을 눌러 여러 개 선택 / 왼쪽으로 밀어서 삭제 (Gesture Handler 의 Swipeable)
import { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  Image,
  Pressable,
  TextInput,
  FlatList,
  ScrollView,
  ActivityIndicator,
  Animated,
  PanResponder,
  StyleSheet,
  Platform,
} from "react-native";
import { NavigationContainer, useNavigation } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { GestureHandlerRootView, Swipeable } from "react-native-gesture-handler";
import { Ionicons } from "@expo/vector-icons";
import { atom, useAtom, useAtomValue, useSetAtom } from "jotai";

const SPOTS = [
  { id: "1", name: "Library Quiet Zone", category: "Study", rating: 4.7, campus: "Newnham", latitude: 43.7953, longitude: -79.3487, description: "Silent floor with outlets at every desk." },
  { id: "2", name: "Tim Hortons (Building A)", category: "Food", rating: 3.9, campus: "Newnham", latitude: 43.7949, longitude: -79.3509, description: "Coffee and a quick bagel between classes." },
  { id: "3", name: "Courtyard Benches", category: "Chill", rating: 4.2, campus: "Newnham", latitude: 43.7941, longitude: -79.3497, description: "Sunny benches in the middle of campus." },
  { id: "4", name: "Learning Commons", category: "Study", rating: 4.5, campus: "Seneca@York", latitude: 43.7715, longitude: -79.4989, description: "Group tables and bookable rooms." },
  { id: "5", name: "Markham Cafe", category: "Food", rating: 4.1, campus: "Markham", latitude: 43.8497, longitude: -79.3667, description: "Bright cafe with good soup." },
  { id: "6", name: "King Lake Trail", category: "Chill", rating: 4.8, campus: "King", latitude: 43.9542, longitude: -79.5172, description: "Walking trail around Lake Seneca." },
];
const CATEGORIES = ["All", "Study", "Food", "Chill"];
const REVIEWS_URL = "https://jsonplaceholder.typicode.com/comments?postId=";

const spotsAtom = atom(SPOTS);
const savedIdsAtom = atom([]);

// 저장 토글 로직을 한 곳에 둔다 (하트 버튼, 길게 누르기, 스와이프가 모두 사용)
function useToggleSaved() {
  const setSavedIds = useSetAtom(savedIdsAtom);
  return (id) =>
    setSavedIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
}

// ---------- 공용 버튼 (Pressable) ----------
function AppButton({ title, onPress, color = "#4f46e5" }) {
  return (
    <Pressable
      onPress={onPress}
      // style 에 함수를 주면 pressed 값을 받아 "눌린 순간" 스타일을 줄 수 있다
      style={({ pressed }) => [styles.button, { backgroundColor: color }, pressed && styles.pressed]}
    >
      <Text style={styles.buttonText}>{title}</Text>
    </Pressable>
  );
}

// 하트 아이콘은 24pt 로 작다 → hitSlop 으로 사방 12pt 씩 터치 영역을 넓혀 44pt 이상으로
function HeartButton({ id }) {
  const savedIds = useAtomValue(savedIdsAtom);
  const toggle = useToggleSaved();
  const isSaved = savedIds.includes(id);
  return (
    <Pressable
      disabled={!id}
      hitSlop={12}
      onPress={() => toggle(id)}
      style={({ pressed }) => pressed && styles.pressed}
    >
      <Ionicons name={isSaved ? "heart" : "heart-outline"} size={24} color="#e11d48" />
    </Pressable>
  );
}

function SpotCard({ spot }) {
  const navigation = useNavigation();
  const toggle = useToggleSaved();
  return (
    <Pressable
      onPress={() => navigation.navigate("SpotDetail", { id: spot.id, name: spot.name })}
      onLongPress={() => toggle(spot.id)} // 길게 누르면 저장 (단축 기능)
      style={({ pressed }) => [styles.card, pressed && styles.cardPressed]}
    >
      <Image source={{ uri: `https://picsum.photos/seed/spot${spot.id}/120` }} style={styles.thumb} />
      <View style={styles.cardBody}>
        <Text style={styles.cardTitle} numberOfLines={1}>
          {spot.name}
        </Text>
        <Text style={styles.subtle}>
          {spot.category} · {spot.campus} · ★ {spot.rating.toFixed(1)}
        </Text>
      </View>
      <HeartButton id={spot.id} />
    </Pressable>
  );
}

// ---------- 밀어서 닫는 팁 카드 (PanResponder) ----------
function TipCard() {
  const [dismissed, setDismissed] = useState(false);
  const translateX = useRef(new Animated.Value(0)).current;

  const pan = useRef(
    PanResponder.create({
      // 옆으로 10pt 이상 움직였을 때만 이 카드가 제스처를 가져간다 (세로 스크롤은 FlatList 에게)
      onMoveShouldSetPanResponder: (_, g) => Math.abs(g.dx) > 10,
      onPanResponderMove: (_, g) => translateX.setValue(g.dx),
      onPanResponderRelease: (_, g) => {
        if (Math.abs(g.dx) > 120) {
          // 충분히 밀었다 → 화면 밖으로 날리고 닫기
          Animated.timing(translateX, {
            toValue: g.dx > 0 ? 500 : -500,
            duration: 200,
            useNativeDriver: true,
          }).start(() => setDismissed(true));
        } else {
          // 조금만 밀었다 → 제자리로 (취소)
          Animated.spring(translateX, { toValue: 0, useNativeDriver: true }).start();
        }
      },
    })
  ).current;

  if (dismissed) return null;

  return (
    <Animated.View {...pan.panHandlers} style={[styles.tip, { transform: [{ translateX }] }]}>
      <Text style={styles.tipText}>Tip: long-press a spot to save it. Swipe this card away.</Text>
    </Animated.View>
  );
}

// ---------- 화면들 ----------
function SpotListScreen() {
  const spots = useAtomValue(spotsAtom);
  const [sortBy, setSortBy] = useState("name");
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All");

  const visible = [...spots]
    .filter((s) => category === "All" || s.category === category)
    .filter((s) => s.name.toLowerCase().includes(query.toLowerCase()))
    .sort((a, b) => (sortBy === "name" ? a.name.localeCompare(b.name) : b.rating - a.rating));

  return (
    <View style={styles.screen}>
      <View style={styles.toolbar}>
        <TextInput value={query} onChangeText={setQuery} placeholder="Search spots" style={styles.input} />
        <AppButton
          title={sortBy === "name" ? "A-Z" : "★"}
          onPress={() => setSortBy((prev) => (prev === "name" ? "rating" : "name"))}
        />
      </View>

      {/* 가로 스크롤: horizontal + 스크롤바 숨김 */}
      <View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chips}>
          {CATEGORIES.map((c) => (
            <Pressable
              key={c}
              onPress={() => setCategory(c)}
              style={({ pressed }) => [styles.chip, category === c && styles.chipActive, pressed && styles.pressed]}
            >
              <Text style={[styles.chipText, category === c && styles.chipTextActive]}>{c}</Text>
            </Pressable>
          ))}
        </ScrollView>
      </View>

      <FlatList
        data={visible}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <SpotCard spot={item} />}
        contentContainerStyle={styles.content}
        ListHeaderComponent={
          <View style={{ gap: 8 }}>
            <TipCard />
            <Text style={styles.subtle}>
              {visible.length} of {spots.length} spots
            </Text>
          </View>
        }
        ListEmptyComponent={<Text style={styles.subtle}>No spots match.</Text>}
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
      <AppButton title="Read reviews" onPress={() => navigation.navigate("Reviews", { id: spot.id, name: spot.name })} />
      <AppButton title={`Next: ${next.name}`} color="#6b7280" onPress={() => navigation.push("SpotDetail", { id: next.id, name: next.name })} />
    </ScrollView>
  );
}

function ReviewsScreen({ route }) {
  const { id } = route.params ?? {};
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  function loadReviews() {
    return fetch(REVIEWS_URL + id)
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then((json) => {
        setReviews(json);
        setError(null);
      })
      .catch(() => setError("Could not load reviews."));
  }

  useEffect(() => {
    loadReviews().finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
      </View>
    );
  }
  if (error) {
    return (
      <View style={styles.center}>
        <Text style={styles.error}>{error}</Text>
        <AppButton
          title="Try Again"
          onPress={() => {
            setLoading(true);
            loadReviews().finally(() => setLoading(false));
          }}
        />
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
      ListEmptyComponent={<Text style={styles.subtle}>No reviews yet.</Text>}
      refreshing={refreshing}
      onRefresh={() => {
        setRefreshing(true);
        loadReviews().finally(() => setRefreshing(false));
      }}
    />
  );
}

// Saved 행: 컴포넌트를 바깥(최상위)에 선언해야 스와이프 위치가 유지된다
function SavedRow({ spot, selected, onToggleSelect, onRemove }) {
  return (
    <Swipeable
      overshootRight={false}
      renderRightActions={() => (
        <Pressable style={styles.delete} onPress={() => onRemove(spot.id)}>
          <Text style={styles.deleteText}>Remove</Text>
        </Pressable>
      )}
    >
      <Pressable
        onPress={() => onToggleSelect(spot.id)}
        style={({ pressed }) => [styles.savedRow, selected && styles.savedRowSelected, pressed && styles.pressed]}
      >
        <Ionicons name={selected ? "checkbox" : "square-outline"} size={22} color="#4f46e5" />
        <Text style={[styles.cardTitle, { flex: 1 }]}>{spot.name}</Text>
      </Pressable>
    </Swipeable>
  );
}

function SavedScreen() {
  const spots = useAtomValue(spotsAtom);
  const [savedIds, setSavedIds] = useAtom(savedIdsAtom);
  const [selectedIds, setSelectedIds] = useState([]);
  const saved = spots.filter((s) => savedIds.includes(s.id));

  function toggleSelect(id) {
    setSelectedIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  }
  function remove(id) {
    setSavedIds((prev) => prev.filter((x) => x !== id));
    setSelectedIds((prev) => prev.filter((x) => x !== id));
  }
  function removeSelected() {
    setSavedIds((prev) => prev.filter((x) => !selectedIds.includes(x)));
    setSelectedIds([]);
  }

  return (
    <View style={styles.screen}>
      <FlatList
        data={saved}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <SavedRow
            spot={item}
            selected={selectedIds.includes(item.id)}
            onToggleSelect={toggleSelect}
            onRemove={remove}
          />
        )}
        ListEmptyComponent={<Text style={[styles.subtle, { padding: 16 }]}>No saved spots. Long-press a spot to save it.</Text>}
      />
      {selectedIds.length > 0 && (
        <View style={{ padding: 16 }}>
          <AppButton title={`Remove ${selectedIds.length} selected`} color="#E53935" onPress={removeSelected} />
        </View>
      )}
    </View>
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
          headerRight: () => <HeartButton id={route.params?.id} />,
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
    // Gesture Handler(Swipeable)는 이 루트 안에서만 동작한다. 앱 전체를 한 번 감싼다.
    <GestureHandlerRootView style={{ flex: 1 }}>
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
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: "#f5f5f7" },
  content: { padding: 16, gap: 12 },
  center: { flex: 1, alignItems: "center", justifyContent: "center", gap: 8, padding: 20 },
  toolbar: { flexDirection: "row", alignItems: "center", gap: 8, paddingHorizontal: 16, paddingTop: 12 },
  input: { flex: 1, backgroundColor: "white", borderWidth: 1, borderColor: "#d1d5db", borderRadius: 8, padding: 10 },
  chips: { gap: 8, paddingHorizontal: 16, paddingTop: 12 },
  chip: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: 999, backgroundColor: "white", borderWidth: 1, borderColor: "#d1d5db" },
  chipActive: { backgroundColor: "#4f46e5", borderColor: "#4f46e5" },
  chipText: { color: "#374151" },
  chipTextActive: { color: "white", fontWeight: "600" },
  title: { fontSize: 24, fontWeight: "bold", color: "#1c1c1e" },
  subtle: { color: "#6b7280" },
  body: { fontSize: 16, lineHeight: 22 },
  error: { color: "#dc2626", textAlign: "center" },
  button: { paddingVertical: 12, paddingHorizontal: 16, borderRadius: 10, alignItems: "center", minHeight: 44 },
  buttonText: { color: "white", fontWeight: "600" },
  pressed: { opacity: 0.6 },
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
  cardPressed: { backgroundColor: "#eef2ff", transform: [{ scale: 0.98 }] },
  tip: { backgroundColor: "#fef3c7", padding: 14, borderRadius: 12 },
  tipText: { color: "#92400e" },
  review: { backgroundColor: "white", padding: 12, borderRadius: 12, gap: 4 },
  thumb: { width: 56, height: 56, borderRadius: 8 },
  hero: { width: "100%", height: 180, borderRadius: 12 },
  cardBody: { flex: 1, gap: 4 },
  cardTitle: { fontSize: 16, fontWeight: "600" },
  savedRow: { flexDirection: "row", alignItems: "center", gap: 12, padding: 18, backgroundColor: "white", borderBottomWidth: 1, borderColor: "#e5e7eb" },
  savedRowSelected: { backgroundColor: "#eef2ff" },
  delete: { justifyContent: "center", paddingHorizontal: 24, backgroundColor: "#E53935" },
  deleteText: { color: "white", fontWeight: "600" },
});
