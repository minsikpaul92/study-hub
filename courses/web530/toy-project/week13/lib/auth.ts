// Firebase Authentication REST API (Identity Toolkit)
import { firebaseConfig } from "@/config/firebaseConfig";
import type { AuthUser } from "@/store/authAtom";

const BASE = "https://identitytoolkit.googleapis.com/v1/accounts";

// 회원가입(signUp)과 로그인(signInWithPassword)은 주소만 다르고 요청 모양이 같다
async function request(action: "signUp" | "signInWithPassword", email: string, password: string): Promise<AuthUser> {
  const res = await fetch(`${BASE}:${action}?key=${firebaseConfig.apiKey}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password, returnSecureToken: true }),
  });
  const data = await res.json();
  if (!res.ok) {
    // 예: EMAIL_EXISTS, INVALID_LOGIN_CREDENTIALS, WEAK_PASSWORD : Password should be at least 6 characters
    throw new Error(data.error?.message ?? `HTTP ${res.status}`);
  }
  return { idToken: data.idToken, localId: data.localId, email: data.email };
}

export const signUp = (email: string, password: string) => request("signUp", email, password);
export const signIn = (email: string, password: string) => request("signInWithPassword", email, password);
