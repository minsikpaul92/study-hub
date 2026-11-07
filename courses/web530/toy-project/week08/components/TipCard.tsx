import { useRef, useState } from "react";
import { Animated, PanResponder, Text, StyleSheet } from "react-native";

// 옆으로 밀면 닫히는 카드 (Week 6 PanResponder 예제)
export default function TipCard({ text }: { text: string }) {
  const [dismissed, setDismissed] = useState(false);
  const translateX = useRef(new Animated.Value(0)).current;

  const pan = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, g) => Math.abs(g.dx) > 10,
      onPanResponderMove: (_, g) => translateX.setValue(g.dx),
      onPanResponderRelease: (_, g) => {
        if (Math.abs(g.dx) > 120) {
          Animated.timing(translateX, {
            toValue: g.dx > 0 ? 500 : -500,
            duration: 200,
            useNativeDriver: true,
          }).start(() => setDismissed(true));
        } else {
          Animated.spring(translateX, { toValue: 0, useNativeDriver: true }).start();
        }
      },
    })
  ).current;

  if (dismissed) return null;

  return (
    <Animated.View {...pan.panHandlers} style={[styles.tip, { transform: [{ translateX }] }]}>
      <Text style={styles.text}>{text}</Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  tip: { backgroundColor: "#fef3c7", padding: 14, borderRadius: 12 },
  text: { color: "#92400e" },
});
