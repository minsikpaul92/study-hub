// Campus Spots - Week 2: Events, State, Lifting State Up, useEffect, Jotai
// 이번 주 목표:
//  - 버튼 이벤트로 스팟을 "저장"한다 (Jotai: props 없이 공유하는 상태)
//  - TextInput + useState로 새 스팟을 추가한다 (Lifting State Up)
//  - Switch로 Study 스팟만 보기 (조건부 렌더링)
//  - useEffect + setInterval 로 현재 시각을 보여주고 "지금 영업중" 표시 (cleanup 포함)
import { useState, useEffect } from "react";
import { View, Text, Button, TextInput, Switch, ScrollView } from "react-native";
import PropTypes from "prop-types";
import { atom, useAtom, useAtomValue } from "jotai";

// ---------- 데이터 ----------
const INITIAL_SPOTS = [
  { id: "1", name: "Library Quiet Zone", category: "Study", rating: 4.7, campus: "Newnham", open: 8, close: 22 },
  { id: "2", name: "Tim Hortons (Building A)", category: "Food", rating: 3.9, campus: "Newnham", open: 7, close: 19 },
  { id: "3", name: "Courtyard Benches", category: "Chill", rating: 4.2, campus: "Newnham", open: 0, close: 24 },
  { id: "4", name: "Learning Commons", category: "Study", rating: 4.5, campus: "Seneca@York", open: 8, close: 20 },
];

// ---------- 전역 상태 (Jotai) ----------
// 저장한 스팟 id 배열. 어느 컴포넌트에서든 useAtom 으로 읽고 바꿀 수 있다.
const savedIdsAtom = atom([]);

// ---------- 컴포넌트 ----------
// 시계: useEffect 의 cleanup 예제
function Clock({ onTick }) {
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const id = setInterval(() => {
      const d = new Date();
      setNow(d);
      onTick(d.getHours());
    }, 1000);
    // 컴포넌트가 사라질 때 타이머를 멈춘다 (안 멈추면 메모리 누수)
    return () => {
      console.log("Clock cleanup");
      clearInterval(id);
    };
  }, [onTick]);

  return <Text>Now: {now.toLocaleTimeString()}</Text>;
}

// 저장 개수 배지: 부모에게 props를 받지 않고 atom 을 직접 읽는다
function SavedBadge() {
  const savedIds = useAtomValue(savedIdsAtom);
  return <Text style={{ fontWeight: "bold" }}>Saved: {savedIds.length}</Text>;
}

// 저장 버튼: atom 을 직접 바꾼다
function SaveButton({ id }) {
  const [savedIds, setSavedIds] = useAtom(savedIdsAtom);
  const isSaved = savedIds.includes(id);

  function toggle() {
    // 이전 값에 의존할 때는 함수형 업데이트를 쓴다
    setSavedIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  }

  return <Button title={isSaved ? "♥ Saved" : "♡ Save"} onPress={toggle} />;
}

function SpotCard({ spot, hour }) {
  const isOpen = hour >= spot.open && hour < spot.close;
  return (
    <View style={{ padding: 12, marginTop: 12, borderWidth: 1, borderColor: "#ccc" }}>
      <Text style={{ fontSize: 18, fontWeight: "600" }}>{spot.name}</Text>
      <Text>
        {spot.category} · {spot.campus} · {spot.rating.toFixed(1)}
      </Text>
      <Text style={{ color: isOpen ? "green" : "red" }}>{isOpen ? "Open now" : "Closed"}</Text>
      <SaveButton id={spot.id} />
    </View>
  );
}

SpotCard.propTypes = {
  spot: PropTypes.shape({
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    category: PropTypes.string.isRequired,
    rating: PropTypes.number.isRequired,
  }).isRequired,
  hour: PropTypes.number.isRequired,
};

// 새 스팟 입력 폼: 상태는 부모(MyApp)가 갖고, 이 컴포넌트는 onAdd 콜백만 받는다 (Lifting State Up)
function AddSpotForm({ onAdd }) {
  const [name, setName] = useState("");

  function handleAdd() {
    if (name.trim() === "") return;
    onAdd(name.trim());
    setName("");
  }

  return (
    <View style={{ marginTop: 16 }}>
      <TextInput
        value={name}
        onChangeText={setName}
        placeholder="New spot name"
        style={{ borderWidth: 1, borderColor: "#999", padding: 8 }}
      />
      <Button title="Add Spot" onPress={handleAdd} />
    </View>
  );
}

// ---------- 앱 ----------
export default function MyApp() {
  const [spots, setSpots] = useState(INITIAL_SPOTS);
  const [studyOnly, setStudyOnly] = useState(false);
  const [hour, setHour] = useState(new Date().getHours());

  function addSpot(name) {
    const newSpot = {
      id: String(Date.now()),
      name,
      category: "Other",
      rating: 0,
      campus: "Newnham",
      open: 0,
      close: 24,
    };
    setSpots((prev) => [...prev, newSpot]);
  }

  const visibleSpots = studyOnly ? spots.filter((s) => s.category === "Study") : spots;

  return (
    <ScrollView contentContainerStyle={{ padding: 20, paddingTop: 60 }}>
      <Text style={{ fontSize: 28, fontWeight: "bold" }}>Campus Spots</Text>
      <Clock onTick={setHour} />
      <SavedBadge />

      <View style={{ flexDirection: "row", alignItems: "center", marginTop: 8 }}>
        <Text>Study spots only </Text>
        <Switch value={studyOnly} onValueChange={setStudyOnly} />
      </View>

      {visibleSpots.map((spot) => (
        <SpotCard key={spot.id} spot={spot} hour={hour} />
      ))}

      <AddSpotForm onAdd={addSpot} />
    </ScrollView>
  );
}
