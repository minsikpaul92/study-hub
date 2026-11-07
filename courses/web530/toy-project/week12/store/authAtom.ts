import { atom } from "jotai";

// 로그인한 사용자 정보. null 이면 로그아웃 상태.
// (코스노트는 토큰 문자열만 저장하지만, 우리는 "내가 만든 스팟" 확인을 위해 localId 와 email 도 같이 저장한다)
export interface AuthUser {
  idToken: string; // Firebase 가 준 JWT. Firestore 요청 헤더에 붙인다.
  localId: string; // 사용자 고유 id (= Firestore 규칙의 request.auth.uid)
  email: string;
}

export const authAtom = atom<AuthUser | null>(null);
