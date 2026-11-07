// Campus Spots - Week 1: Components, JSX, Props, PropTypes
// 이번 주 목표: 캠퍼스 스팟을 보여주는 "카드" 컴포넌트를 만들고 props로 데이터를 넘긴다.
import { View, Text, ScrollView } from "react-native";
import PropTypes from "prop-types";

// 1) 가장 작은 컴포넌트: 앱 제목
function AppHeader() {
  return (
    <View>
      <Text style={{ fontSize: 28, fontWeight: "bold" }}>Campus Spots</Text>
      <Text>Find the best places on campus</Text>
    </View>
  );
}

// 2) JS 표현식 { } 를 쓰는 함수: 숫자 평점을 별 문자열로 바꾼다
function toStars(rating) {
  return "★".repeat(Math.round(rating)) + "☆".repeat(5 - Math.round(rating));
}

// 3) props를 받는 재사용 컴포넌트
//    category 기본값은 "Other" (default parameter)
function SpotCard({ name, category = "Other", rating, campus }) {
  return (
    <View style={{ padding: 12, marginTop: 12, borderWidth: 1, borderColor: "#ccc" }}>
      <Text style={{ fontSize: 18, fontWeight: "600" }}>{name}</Text>
      <Text>
        {category} · {campus}
      </Text>
      <Text>
        {toStars(rating)} ({rating.toFixed(1)})
      </Text>
      {/* 조건부 렌더링: 평점이 4.5 이상이면 배지를 보여준다 */}
      {rating >= 4.5 && <Text style={{ color: "green" }}>Top pick!</Text>}
    </View>
  );
}

// 4) PropTypes로 props 검증: 잘못된 타입이 들어오면 콘솔에 경고가 뜬다
SpotCard.propTypes = {
  name: PropTypes.string.isRequired,
  category: PropTypes.oneOf(["Study", "Food", "Chill", "Other"]),
  rating: PropTypes.number.isRequired,
  campus: PropTypes.string.isRequired,
};

// 5) 가장 바깥(부모) 컴포넌트
export default function MyApp() {
  const totalSpots = 3;

  return (
    <ScrollView contentContainerStyle={{ padding: 20, paddingTop: 60 }}>
      <AppHeader />
      <Text style={{ marginTop: 8 }}>Total spots: {totalSpots}</Text>

      <SpotCard name="Library Quiet Zone" category="Study" rating={4.7} campus="Newnham" />
      <SpotCard name="Tim Hortons (Building A)" category="Food" rating={3.9} campus="Newnham" />
      <SpotCard name="Courtyard Benches" rating={4.2} campus="Newnham" />

      {/* 일부러 틀려보기: category="Coffee" 로 바꾸거나 campus를 지우면 PropTypes 경고가 콘솔에 뜬다 */}
    </ScrollView>
  );
}
