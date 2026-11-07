// Campus Spots - Week 3: StyleSheet, Flexbox, Platform, Common Components (Image, Switch, TextInput)
// 이번 주 목표: Week 2 앱의 기능은 그대로 두고 "보기 좋게" 만든다.
//  - 인라인 스타일을 StyleSheet.create() 로 옮긴다
//  - flexDirection: "row" 로 카드 안을 [사진 | 글 | 버튼] 가로 배치
//  - Platform.select() 로 iOS 그림자 / Android elevation 을 나눈다
import { useState, useEffect } from "react";
import {
  View,
  Text,
  Image,
  Button,
  TextInput,
  Switch,
  ScrollView,
  StyleSheet,
  Platform,
} from "react-native";
import PropTypes from "prop-types";
import { atom, useAtom, useAtomValue } from "jotai";

const INITIAL_SPOTS = [
  { id: "1", name: "Library Quiet Zone", category: "Study", rating: 4.7, campus: "Newnham", open: 8, close: 22 },
  { id: "2", name: "Tim Hortons (Building A)", category: "Food", rating: 3.9, campus: "Newnham", open: 7, close: 19 },
  { id: "3", name: "Courtyard Benches", category: "Chill", rating: 4.2, campus: "Newnham", open: 0, close: 24 },
  { id: "4", name: "Learning Commons", category: "Study", rating: 4.5, campus: "Seneca@York", open: 8, close: 20 },
];

const CATEGORY_COLORS = { Study: "#4f46e5", Food: "#ea580c", Chill: "#059669", Other: "#6b7280" };

const savedIdsAtom = atom([]);

function Clock({ onTick }) {
  const [now, setNow] = useState(new Date());
  useEffect(() => {
    const id = setInterval(() => {
      const d = new Date();
      setNow(d);
      onTick(d.getHours());
    }, 1000);
    return () => clearInterval(id);
  }, [onTick]);
  return <Text style={styles.subtle}>{now.toLocaleTimeString()}</Text>;
}

function SavedBadge() {
  const savedIds = useAtomValue(savedIdsAtom);
  return (
    <View style={styles.badge}>
      <Text style={styles.badgeText}>♥ {savedIds.length}</Text>
    </View>
  );
}

function SaveButton({ id }) {
  const [savedIds, setSavedIds] = useAtom(savedIdsAtom);
  const isSaved = savedIds.includes(id);
  function toggle() {
    setSavedIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  }
  return <Button title={isSaved ? "♥" : "♡"} color="#e11d48" onPress={toggle} />;
}

function SpotCard({ spot, hour }) {
  const isOpen = hour >= spot.open && hour < spot.close;
  return (
    <View style={styles.card}>
      {/* Image: 원격 이미지는 uri 와 함께 width/height 를 꼭 줘야 보인다 */}
      <Image source={{ uri: `https://picsum.photos/seed/spot${spot.id}/120` }} style={styles.thumb} />

      {/* flex: 1 → 남는 가로 공간을 이 영역이 다 차지 */}
      <View style={styles.cardBody}>
        <Text style={styles.cardTitle} numberOfLines={1}>
          {spot.name}
        </Text>
        <View style={styles.row}>
          {/* 스타일 배열: 공통 스타일 + 카테고리별 색 */}
          <Text style={[styles.chip, { backgroundColor: CATEGORY_COLORS[spot.category] }]}>
            {spot.category}
          </Text>
          <Text style={styles.subtle}> {spot.campus}</Text>
        </View>
        <Text style={[styles.status, isOpen ? styles.open : styles.closed]}>
          {isOpen ? "Open now" : "Closed"} · ★ {spot.rating.toFixed(1)}
        </Text>
      </View>

      <SaveButton id={spot.id} />
    </View>
  );
}

SpotCard.propTypes = {
  spot: PropTypes.object.isRequired,
  hour: PropTypes.number.isRequired,
};

function AddSpotForm({ onAdd }) {
  const [name, setName] = useState("");
  function handleAdd() {
    if (name.trim() === "") return;
    onAdd(name.trim());
    setName("");
  }
  return (
    <View style={styles.form}>
      <TextInput value={name} onChangeText={setName} placeholder="New spot name" style={styles.input} />
      <Button title="Add" onPress={handleAdd} />
    </View>
  );
}

export default function MyApp() {
  const [spots, setSpots] = useState(INITIAL_SPOTS);
  const [studyOnly, setStudyOnly] = useState(false);
  const [hour, setHour] = useState(new Date().getHours());

  function addSpot(name) {
    setSpots((prev) => [
      ...prev,
      { id: String(Date.now()), name, category: "Other", rating: 0, campus: "Newnham", open: 0, close: 24 },
    ]);
  }

  const visibleSpots = studyOnly ? spots.filter((s) => s.category === "Study") : spots;

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
      {/* 헤더: 왼쪽 제목 / 오른쪽 배지 → justifyContent: "space-between" */}
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Campus Spots</Text>
          <Clock onTick={setHour} />
        </View>
        <SavedBadge />
      </View>

      <View style={styles.filterRow}>
        <Text>Study spots only</Text>
        <Switch value={studyOnly} onValueChange={setStudyOnly} />
      </View>

      {visibleSpots.map((spot) => (
        <SpotCard key={spot.id} spot={spot} hour={hour} />
      ))}

      <AddSpotForm onAdd={addSpot} />
      <Text style={styles.footer}>Running on {Platform.OS}</Text>
    </ScrollView>
  );
}

// ---------- 스타일 ----------
// 실습 팁: 이 객체를 styles.js 로 옮기고 `import styles from "./styles";` 로 불러와도 똑같이 동작한다 (Lab 3 Part D).
const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: "#f5f5f7" },
  content: { padding: 16, paddingTop: 60, gap: 12 },
  header: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  title: { fontSize: 28, fontWeight: "bold", color: "#1c1c1e" },
  subtle: { color: "#6b7280" },
  badge: { backgroundColor: "#ffe4e6", paddingVertical: 6, paddingHorizontal: 12, borderRadius: 999 },
  badgeText: { color: "#e11d48", fontWeight: "bold" },
  filterRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  card: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    padding: 12,
    borderRadius: 12,
    backgroundColor: "white",
    // Platform.select: 플랫폼마다 다른 스타일을 고른다
    ...Platform.select({
      ios: { shadowColor: "#000", shadowOpacity: 0.08, shadowRadius: 6, shadowOffset: { width: 0, height: 2 } },
      android: { elevation: 2 },
      default: { borderWidth: 1, borderColor: "#e5e7eb" },
    }),
  },
  thumb: { width: 56, height: 56, borderRadius: 8 },
  cardBody: { flex: 1, gap: 4 },
  cardTitle: { fontSize: 16, fontWeight: "600" },
  row: { flexDirection: "row", alignItems: "center" },
  chip: {
    color: "white",
    fontSize: 12,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 999,
    overflow: "hidden",
  },
  status: { fontSize: 13 },
  open: { color: "#059669" },
  closed: { color: "#dc2626" },
  form: { flexDirection: "row", alignItems: "center", gap: 8 },
  input: { flex: 1, backgroundColor: "white", borderWidth: 1, borderColor: "#d1d5db", borderRadius: 8, padding: 10 },
  footer: { textAlign: "center", color: "#9ca3af", marginTop: 8 },
});
