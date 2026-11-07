// Firebase 프로젝트 정보 (Firebase Console > Project settings > General 에서 복사)
// 이 두 값만 내 프로젝트 값으로 바꾸면 된다.
export const firebaseConfig = {
  projectId: "YOUR_PROJECT_ID",
  apiKey: "YOUR_WEB_API_KEY",
};

// Firestore REST API 의 기본 주소. 뒤에 /spots 를 붙이면 spots 컬렉션이다.
export const firestoreEndpoint = `https://firestore.googleapis.com/v1/projects/${firebaseConfig.projectId}/databases/(default)/documents`;
