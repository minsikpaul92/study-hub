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
    createdBy: str(f.createdBy), // Week 12: 누가 만들었는지 (Firebase Auth 의 localId)
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

// ---------------- CRUD (Week 12: 로그인 토큰을 같이 보낸다) ----------------
// | 동작   | HTTP 메서드 | 주소                   |
// | Create | POST        | /spots                 |
// | Read   | GET         | /spots  또는 /spots/ID |
// | Update | PATCH       | /spots/ID?updateMask.fieldPaths=name&... |
// | Delete | DELETE      | /spots/ID              |
//
// 모든 요청 헤더에 Authorization: Bearer <idToken> 을 붙인다.
// Firestore 보안 규칙(firestore.rules)이 이 토큰으로 "누가 요청했는지" 확인한다.
function headers(token: string) {
  return { "Content-Type": "application/json", Authorization: `Bearer ${token}` };
}

// READ: GET /spots  → Spot[]
export async function getSpots(token: string): Promise<Spot[]> {
  const res = await fetch(`${firestoreEndpoint}/spots`, { headers: headers(token) });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const data: { documents?: FirestoreDoc[] } = await res.json();
  // 컬렉션이 비어 있으면 documents 키 자체가 없다
  return (data.documents ?? []).map(docToSpot);
}

// CREATE: POST /spots → Firestore 가 id 를 만들어 새 문서를 돌려준다
export async function createSpot(token: string, spot: Omit<Spot, "id">): Promise<Spot> {
  const res = await fetch(`${firestoreEndpoint}/spots`, {
    method: "POST",
    headers: headers(token),
    body: JSON.stringify({ fields: spotToFields(spot) }),
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return docToSpot(await res.json());
}

// UPDATE: PATCH /spots/ID
// updateMask 에 적은 필드만 바뀐다. 안 적으면 보내지 않은 필드가 "삭제"되니 주의!
export async function updateSpot(token: string, id: string, changes: Partial<Omit<Spot, "id">>): Promise<Spot> {
  const mask = Object.keys(changes)
    .map((key) => `updateMask.fieldPaths=${key}`)
    .join("&");
  const res = await fetch(`${firestoreEndpoint}/spots/${id}?${mask}`, {
    method: "PATCH",
    headers: headers(token),
    body: JSON.stringify({ fields: spotToFields(changes) }),
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return docToSpot(await res.json());
}

// DELETE: DELETE /spots/ID  (성공하면 빈 객체 {} 가 온다)
export async function deleteSpot(token: string, id: string): Promise<void> {
  const res = await fetch(`${firestoreEndpoint}/spots/${id}`, { method: "DELETE", headers: headers(token) });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
}

// ---------------- Week 13: 사용자별 저장 목록 (users/{uid} 문서의 savedIds 배열) ----------------
// 배열은 Firestore 에서 이렇게 생겼다:
// { "savedIds": { "arrayValue": { "values": [ { "stringValue": "abc" }, { "stringValue": "def" } ] } } }

export async function getSavedIds(token: string, uid: string): Promise<string[]> {
  const res = await fetch(`${firestoreEndpoint}/users/${uid}`, { headers: headers(token) });
  if (res.status === 404) return []; // 아직 한 번도 저장 안 한 사용자 → 문서가 없음
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const doc = await res.json();
  const values: { stringValue: string }[] = doc.fields?.savedIds?.arrayValue?.values ?? [];
  return values.map((v) => v.stringValue);
}

// PATCH 는 문서가 없으면 새로 만들어 준다 (upsert)
export async function putSavedIds(token: string, uid: string, ids: string[]): Promise<void> {
  const res = await fetch(`${firestoreEndpoint}/users/${uid}?updateMask.fieldPaths=savedIds`, {
    method: "PATCH",
    headers: headers(token),
    body: JSON.stringify({
      fields: { savedIds: { arrayValue: { values: ids.map((id) => ({ stringValue: id })) } } },
    }),
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
}
