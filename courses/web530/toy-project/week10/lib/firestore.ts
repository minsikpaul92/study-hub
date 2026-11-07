// Firestore REST 응답 ↔ 우리 앱의 Spot 객체 변환 + 네트워크 함수
import { firestoreEndpoint } from "@/config/firebaseConfig";
import type { Spot } from "@/store/spotsAtom";

// Firestore 는 값마다 타입 이름을 붙여서 돌려준다:
// { "name": { "stringValue": "Library" }, "rating": { "doubleValue": 4.7 } }
export type FirestoreValue =
  | { stringValue: string }
  | { doubleValue: number }
  | { integerValue: string }
  | { booleanValue: boolean };

export interface FirestoreDoc {
  name: string; // "projects/.../documents/spots/AbC123"
  fields?: Record<string, FirestoreValue | undefined>;
}

function str(v: FirestoreValue | undefined, fallback = ""): string {
  return v && "stringValue" in v ? v.stringValue : fallback;
}

// 숫자는 doubleValue(소수) 또는 integerValue(정수, 문자열로 옴) 두 가지로 올 수 있다
function num(v: FirestoreValue | undefined, fallback = 0): number {
  if (!v) return fallback;
  if ("doubleValue" in v) return v.doubleValue;
  if ("integerValue" in v) return parseFloat(v.integerValue);
  return fallback;
}

// Firestore 문서 하나 → Spot
export function docToSpot(doc: FirestoreDoc): Spot {
  const f = doc.fields ?? {};
  return {
    id: doc.name.split("/").pop() ?? "", // 경로의 마지막 조각이 문서 id
    name: str(f.name, "Unnamed spot"),
    category: str(f.category, "Other") as Spot["category"],
    rating: num(f.rating),
    campus: str(f.campus, "Newnham"),
    latitude: num(f.latitude),
    longitude: num(f.longitude),
    description: str(f.description),
  };
}

// Spot(의 일부) → Firestore fields  (POST 할 때 쓴다)
export function spotToFields(spot: Partial<Omit<Spot, "id">>) {
  const fields: Record<string, FirestoreValue> = {};
  for (const [key, value] of Object.entries(spot)) {
    if (typeof value === "string") fields[key] = { stringValue: value };
    else if (typeof value === "number") fields[key] = { doubleValue: value };
  }
  return fields;
}

// READ: GET /spots  → Spot[]
export async function getSpots(): Promise<Spot[]> {
  const res = await fetch(`${firestoreEndpoint}/spots`);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const data: { documents?: FirestoreDoc[] } = await res.json();
  // 컬렉션이 비어 있으면 documents 키 자체가 없다
  return (data.documents ?? []).map(docToSpot);
}

// CREATE 미리보기: 빈 DB 에 샘플 데이터를 넣을 때만 About 화면에서 쓴다. 자세한 설명은 Week 11.
export async function seedSpot(spot: Omit<Spot, "id">): Promise<void> {
  const res = await fetch(`${firestoreEndpoint}/spots`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ fields: spotToFields(spot) }),
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
}
