// /about : 앱 정보 + (Week 10) 빈 Firestore 에 샘플 스팟을 넣는 버튼
import { useState } from "react";
import { View, Text, Platform } from "react-native";
import { useSetAtom } from "jotai";
import AppButton from "@/components/AppButton";
import { SPOTS } from "@/data/spots";
import { createSpot } from "@/lib/firestore";
import { fetchSpotsAtom } from "@/store/spotsAtom";
import { common } from "@/styles/common";

export default function AboutScreen() {
  const fetchSpots = useSetAtom(fetchSpotsAtom);
  const [status, setStatus] = useState("");

  async function seed() {
    try {
      setStatus("Uploading...");
      // id 는 Firestore 가 새로 만들어 주므로 빼고 보낸다 (구조 분해 + 나머지 연산자)
      for (const { id, ...rest } of SPOTS) {
        await createSpot(rest);
      }
      await fetchSpots();
      setStatus(`Uploaded ${SPOTS.length} spots.`);
    } catch {
      setStatus("Upload failed. Check firebaseConfig and Firestore rules.");
    }
  }

  return (
    <View style={common.center}>
      <Text style={common.title}>Campus Spots</Text>
      <Text style={common.subtle}>WEB530 toy project</Text>
      <Text style={common.subtle}>Made by: Paul</Text>
      <Text style={common.subtle}>Running on {Platform.OS}</Text>
      <View style={{ height: 24 }} />
      {/* 한 번만 누를 것! 여러 번 누르면 같은 스팟이 여러 개 생긴다 */}
      <AppButton title="Seed sample spots (once)" onPress={seed} />
      {status !== "" && <Text style={common.subtle}>{status}</Text>}
    </View>
  );
}
