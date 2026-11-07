import { useEffect, useRef, useState } from "react";
import { View, Text, TextInput, Pressable, StyleSheet } from "react-native";
import MapView, { Marker, Polygon, LongPressEvent } from "react-native-maps";
import { Ionicons } from "@expo/vector-icons";
import { useAtomValue } from "jotai";
import { spotsAtom, Spot } from "../store/spotsAtom";
import { myLocationAtom, LatLng } from "../store/locationAtom";
import { useWatchLocation, addressFor } from "../hooks/useWatchLocation";
import { distanceInMetres, formatDistance } from "../lib/distance";
import { NEWNHAM, CAMPUS_OUTLINE } from "../data/spots";
import AppButton from "./AppButton";
import { colors, common } from "../styles/common";

// 새 스팟 초안: 지도에서 길게 누른 좌표 + 주소
export interface SpotDraft {
  coordinate: LatLng;
  address: string;
}

interface SpotMapProps {
  focusId?: string; // 이 스팟으로 지도 이동
  focusAt?: number; // 같은 스팟을 다시 눌러도 effect 가 돌도록 시간값
  onOpenSpot: (spot: Spot) => void; // "Open details" 를 눌렀을 때
  onAddSpot: (name: string, draft: SpotDraft) => Promise<Spot | void> | Spot | void; // 새 스팟 저장
}

// 지도 화면의 본체. 네비게이션 방법(React Navigation / Expo Router)은 몰라도 되도록 콜백으로 받는다.
export default function SpotMap({ focusId, focusAt, onOpenSpot, onAddSpot }: SpotMapProps) {
  const spots = useAtomValue(spotsAtom);
  const myLocation = useAtomValue(myLocationAtom);
  const errorMsg = useWatchLocation();
  const [selected, setSelected] = useState<Spot | null>(null);
  const [draft, setDraft] = useState<SpotDraft | null>(null);
  const [draftName, setDraftName] = useState("");
  const mapRef = useRef<MapView>(null);

  useEffect(() => {
    if (!focusId) return;
    const spot = spots.find((s) => s.id === focusId);
    if (!spot) return;
    setSelected(spot);
    mapRef.current?.animateToRegion(
      { latitude: spot.latitude, longitude: spot.longitude, latitudeDelta: 0.005, longitudeDelta: 0.005 },
      800
    );
  }, [focusId, focusAt]);

  function findMe() {
    if (!myLocation) return;
    mapRef.current?.animateToRegion({ ...myLocation, latitudeDelta: 0.005, longitudeDelta: 0.005 }, 800);
  }

  async function startDraft(e: LongPressEvent) {
    const coordinate = e.nativeEvent.coordinate;
    setSelected(null);
    setDraft({ coordinate, address: "Looking up address..." });
    setDraft({ coordinate, address: await addressFor(coordinate) });
  }

  async function saveDraft() {
    if (!draft || draftName.trim() === "") return;
    const created = await onAddSpot(draftName.trim(), draft);
    setDraft(null);
    setDraftName("");
    if (created) setSelected(created);
  }

  return (
    <View style={common.screen}>
      <MapView
        ref={mapRef}
        style={{ flex: 1 }}
        initialRegion={NEWNHAM}
        showsUserLocation={!!myLocation}
        showsPointsOfInterest={false}
        onLongPress={startDraft}
      >
        <Polygon coordinates={CAMPUS_OUTLINE} strokeWidth={2} strokeColor={colors.primary} fillColor="rgba(79, 70, 229, 0.12)" />
        {spots.map((spot) => (
          <Marker
            key={spot.id}
            coordinate={{ latitude: spot.latitude, longitude: spot.longitude }}
            title={spot.name}
            onPress={() => {
              setDraft(null);
              setSelected(spot);
            }}
          />
        ))}
        {draft && <Marker coordinate={draft.coordinate} pinColor="blue" />}
      </MapView>

      <Pressable
        onPress={findMe}
        disabled={!myLocation}
        style={({ pressed }) => [styles.fab, !myLocation && { opacity: 0.4 }, pressed && common.pressed]}
      >
        <Ionicons name="locate" size={24} color="white" />
      </Pressable>

      <View style={styles.card}>
        {errorMsg && <Text style={common.error}>{errorMsg}</Text>}
        {draft ? (
          <>
            <Text style={common.cardTitle}>New spot</Text>
            <Text style={common.subtle}>{draft.address}</Text>
            <TextInput value={draftName} onChangeText={setDraftName} placeholder="Spot name" style={common.input} />
            <View style={styles.row}>
              <View style={{ flex: 1 }}>
                <AppButton title="Add spot" onPress={saveDraft} />
              </View>
              <View style={{ flex: 1 }}>
                <AppButton title="Cancel" color={colors.gray} onPress={() => setDraft(null)} />
              </View>
            </View>
          </>
        ) : selected ? (
          <>
            <Text style={common.cardTitle}>{selected.name}</Text>
            <Text style={common.subtle}>
              {selected.category} · ★ {selected.rating.toFixed(1)}
              {myLocation ? ` · ${formatDistance(distanceInMetres(myLocation, selected))} away` : ""}
            </Text>
            <AppButton title="Open details" onPress={() => onOpenSpot(selected)} />
          </>
        ) : (
          <Text style={common.subtle}>Tap a pin, or long-press the map to add a spot.</Text>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  fab: {
    position: "absolute",
    right: 16,
    top: 16,
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  card: { position: "absolute", left: 16, right: 16, bottom: 16, padding: 14, gap: 8, borderRadius: 12, backgroundColor: "white" },
  row: { flexDirection: "row", gap: 8 },
});
