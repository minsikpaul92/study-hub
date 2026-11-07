// "/" (앱을 처음 열었을 때의 주소) → /spots 로 보낸다.
// 이 파일이 없으면 "/" 에 맞는 화면이 없어서 Not Found 가 뜬다.
import { Redirect } from "expo-router";

export default function Index() {
  return <Redirect href="/spots" />;
}
