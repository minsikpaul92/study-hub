import { StyleSheet, Platform } from "react-native";

// 여러 화면이 같이 쓰는 스타일 (Lab 3 의 styles.js 와 같은 역할)
export const colors = {
  primary: "#4f46e5",
  danger: "#E53935",
  green: "#059669",
  gray: "#6b7280",
  bg: "#f5f5f7",
  heart: "#e11d48",
};

export const common = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.bg },
  content: { padding: 16, gap: 12 },
  center: { flex: 1, alignItems: "center", justifyContent: "center", gap: 8, padding: 20 },
  title: { fontSize: 24, fontWeight: "bold", color: "#1c1c1e" },
  subtle: { color: colors.gray },
  body: { fontSize: 16, lineHeight: 22 },
  error: { color: "#dc2626", textAlign: "center" },
  input: { flex: 1, backgroundColor: "white", borderWidth: 1, borderColor: "#d1d5db", borderRadius: 8, padding: 10 },
  pressed: { opacity: 0.6 },
  cardTitle: { fontSize: 16, fontWeight: "600" },
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
});
