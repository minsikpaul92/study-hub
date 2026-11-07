// Week 10 부터: 이 데이터는 앱에서 직접 쓰지 않고, About 화면의 "Seed" 버튼으로 Firestore 에 올리는 용도다.
import type { Spot } from "@/store/spotsAtom";

// 처음 앱에 들어있는 스팟들 (Week 10 부터는 Firestore 에서 받아온다)
// createdBy 는 올리는 사람(로그인한 사용자)으로 채워지므로 여기에는 없다
export const SPOTS: Omit<Spot, "createdBy">[] = [
  { id: "1", name: "Library Quiet Zone", category: "Study", rating: 4.7, campus: "Newnham", latitude: 43.7953, longitude: -79.3487, description: "Silent floor with outlets at every desk." },
  { id: "2", name: "Tim Hortons (Building A)", category: "Food", rating: 3.9, campus: "Newnham", latitude: 43.7949, longitude: -79.3509, description: "Coffee and a quick bagel between classes." },
  { id: "3", name: "Courtyard Benches", category: "Chill", rating: 4.2, campus: "Newnham", latitude: 43.7941, longitude: -79.3497, description: "Sunny benches in the middle of campus." },
  { id: "4", name: "Learning Commons", category: "Study", rating: 4.5, campus: "Seneca@York", latitude: 43.7715, longitude: -79.4989, description: "Group tables and bookable rooms." },
  { id: "5", name: "Markham Cafe", category: "Food", rating: 4.1, campus: "Markham", latitude: 43.8497, longitude: -79.3667, description: "Bright cafe with good soup." },
  { id: "6", name: "King Lake Trail", category: "Chill", rating: 4.8, campus: "King", latitude: 43.9542, longitude: -79.5172, description: "Walking trail around Lake Seneca." },
];

export const CATEGORIES = ["All", "Study", "Food", "Chill"] as const;

export const REVIEWS_URL = "https://jsonplaceholder.typicode.com/comments?postId=";

// 지도 시작 위치와 캠퍼스 경계
export const NEWNHAM = { latitude: 43.79457, longitude: -79.35043, latitudeDelta: 0.012, longitudeDelta: 0.012 };
export const CAMPUS_OUTLINE = [
  { latitude: 43.79701, longitude: -79.35178 },
  { latitude: 43.79849, longitude: -79.3453 },
  { latitude: 43.79483, longitude: -79.34612 },
  { latitude: 43.79382, longitude: -79.35049 },
];
