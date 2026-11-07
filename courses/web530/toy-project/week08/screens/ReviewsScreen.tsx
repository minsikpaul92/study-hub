import { useEffect, useState } from "react";
import { View, Text, FlatList, ActivityIndicator, StyleSheet } from "react-native";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import AppButton from "../components/AppButton";
import { REVIEWS_URL } from "../data/spots";
import { common } from "../styles/common";
import type { SpotsStackParamList } from "../navigation/types";

// API 가 돌려주는 리뷰 하나의 모양
interface Review {
  id: number;
  email: string;
  body: string;
}

type Props = NativeStackScreenProps<SpotsStackParamList, "Reviews">;

export default function ReviewsScreen({ route }: Props) {
  const { id } = route.params ?? {};
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  // async/await 버전 (Week 5 의 .then() 체인과 같은 일)
  async function loadReviews() {
    try {
      const res = await fetch(REVIEWS_URL + id);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json: Review[] = await res.json();
      setReviews(json);
      setError(null);
    } catch {
      setError("Could not load reviews.");
    }
  }

  useEffect(() => {
    loadReviews().finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <View style={common.center}>
        <ActivityIndicator size="large" />
      </View>
    );
  }
  if (error) {
    return (
      <View style={common.center}>
        <Text style={common.error}>{error}</Text>
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
      style={common.screen}
      contentContainerStyle={common.content}
      data={reviews}
      keyExtractor={(item) => item.id.toString()}
      renderItem={({ item }) => (
        <View style={styles.review}>
          <Text style={common.cardTitle}>{item.email}</Text>
          <Text>{item.body}</Text>
        </View>
      )}
      ListEmptyComponent={<Text style={common.subtle}>No reviews yet.</Text>}
      refreshing={refreshing}
      onRefresh={() => {
        setRefreshing(true);
        loadReviews().finally(() => setRefreshing(false));
      }}
    />
  );
}

const styles = StyleSheet.create({
  review: { backgroundColor: "white", padding: 12, borderRadius: 12, gap: 4 },
});
