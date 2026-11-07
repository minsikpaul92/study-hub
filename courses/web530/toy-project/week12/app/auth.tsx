// /auth : 로그인 / 회원가입 화면 (Firebase Auth REST)
// 로그인에 성공하면 authAtom 에 사용자 정보를 넣는다 → app/_layout.tsx 가 그걸 보고 탭 화면으로 보낸다
import { useState } from "react";
import { View, Text, TextInput, ActivityIndicator, StyleSheet } from "react-native";
import { useSetAtom } from "jotai";
import { authAtom } from "@/store/authAtom";
import { signIn, signUp } from "@/lib/auth";
import AppButton from "@/components/AppButton";
import { colors, common } from "@/styles/common";

export default function AuthScreen() {
  const setAuth = useSetAtom(authAtom);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function run(action: typeof signIn) {
    if (!email || password.length < 6) {
      setError("Enter an email and a password of at least 6 characters.");
      return;
    }
    setBusy(true);
    setError(null);
    try {
      const user = await action(email.trim(), password);
      setAuth(user); // ← 이 한 줄이 화면 전환을 일으킨다
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <View style={[common.center, styles.container]}>
      <Text style={styles.logo}>Campus Spots</Text>
      <Text style={common.subtle}>Sign in to see and share spots</Text>

      <TextInput
        value={email}
        onChangeText={setEmail}
        placeholder="Email"
        autoCapitalize="none"
        keyboardType="email-address"
        style={[common.input, styles.input]}
      />
      <TextInput
        value={password}
        onChangeText={setPassword}
        placeholder="Password (6+ characters)"
        secureTextEntry // 비밀번호를 ●●● 로 가린다
        style={[common.input, styles.input]}
      />

      {error && <Text style={common.error}>{error}</Text>}

      {busy ? (
        <ActivityIndicator size="large" />
      ) : (
        <View style={styles.buttons}>
          <AppButton title="Sign in" onPress={() => run(signIn)} />
          <AppButton title="Create account" color={colors.gray} onPress={() => run(signUp)} />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { alignItems: "stretch", gap: 12 },
  logo: { fontSize: 32, fontWeight: "bold", color: colors.primary, textAlign: "center" },
  input: { flex: 0 },
  buttons: { gap: 8 },
});
