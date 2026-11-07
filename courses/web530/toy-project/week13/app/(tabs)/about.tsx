// /about : 앱 정보 + 내 계정 + 로그아웃 + 빈 DB 에 샘플 스팟 넣기
import { useState } from "react";
import { View, Text, Platform } from "react-native";
import { useAtom, useSetAtom } from "jotai";
import AppButton from "@/components/AppButton";
import { SPOTS } from "@/data/spots";
import { addSpotAtom, spotsAtom } from "@/store/spotsAtom";
import { authAtom } from "@/store/authAtom";
import { savedIdsAtom } from "@/store/savedAtom";
import { colors, common } from "@/styles/common";

export default function AboutScreen() {
  const [user, setUser] = useAtom(authAtom);
  const addSpot = useSetAtom(addSpotAtom);
  const setSpots = useSetAtom(spotsAtom);
  const setSavedIds = useSetAtom(savedIdsAtom);
  const [status, setStatus] = useState("");

  async function seed() {
    try {
      setStatus("Uploading...");
      for (const { id, ...rest } of SPOTS) {
        await addSpot(rest); // createdBy 는 addSpotAtom 이 내 localId 로 채운다
      }
      setStatus(`Uploaded ${SPOTS.length} spots.`);
    } catch {
      setStatus("Upload failed. Check firebaseConfig and Firestore rules.");
    }
  }

  function logout() {
    // 다른 사람이 같은 폰으로 로그인할 수 있으니 내 데이터도 비운다
    setSpots([]);
    setSavedIds([]);
    setUser(null); // → _layout.tsx 가 /auth 로 보낸다
  }

  return (
    <View style={common.center}>
      <Text style={common.title}>Campus Spots</Text>
      <Text style={common.subtle}>WEB530 toy project · Made by Paul</Text>
      <Text style={common.subtle}>Running on {Platform.OS}</Text>
      <Text style={common.body}>Signed in as {user?.email}</Text>
      <View style={{ height: 16 }} />
      <AppButton title="Seed sample spots (once)" onPress={seed} />
      {status !== "" && <Text style={common.subtle}>{status}</Text>}
      <AppButton title="Log out" color={colors.danger} onPress={logout} />
    </View>
  );
}
