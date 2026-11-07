# Campus Spots 토이 프로젝트

WEB530 강의 전체를 관통하는 토이 프로젝트. 매주 그 주 강의 내용을 하나씩 더해서 Week 13 에 완성된다.
주차별 설명, 튜터 해설, Snack 열기 버튼은 가이드 페이지(Campus Spots 로드맵 아티팩트)에 있다.

| 주차 | 주제 | 실행 방법 |
| --- | --- | --- |
| week01 | 컴포넌트, Props, PropTypes | Snack (App.js) |
| week02 | 이벤트, State, useEffect, Jotai | Snack |
| week03 | StyleSheet, Flexbox, Platform | Snack |
| week04 | 탭 + 스택 네비게이션 | Snack |
| week05 | FlatList, 검색/정렬, fetch, 당겨서 새로고침 | Snack |
| week06 | Pressable, hitSlop, PanResponder, Swipeable | Snack (스와이프는 휴대폰) |
| week07 | 위치, 지도, Marker, Polygon | Snack, My Device (Expo Go) |
| week08 | 로컬 Expo + TypeScript + 폴더 분리 | `npm install` 후 `npx expo start --tunnel` |
| week09 | Expo Router | 같음 |
| week10 | Firestore REST 읽기 | `config/firebaseConfig.ts` 에 내 값 입력 |
| week11 | Firestore CRUD | 같음 |
| week12 | Firebase Auth + 보안 규칙 | `firestore.rules` 를 콘솔에 Publish |
| week13 | 최종 통합 | 같음 |

- week01~07 은 `App.js` 하나를 Snack 에 붙여넣으면 된다. `snack-links.json` 에 코드가 들어간 Snack 링크도 있다.
- week08~13 은 각각 완성된 프로젝트 폴더다 (node_modules 제외). 폴더에서 `npm install` 을 먼저 실행한다.
- 검증: week01~07 Android 번들 + 웹 실행, week08~13 `tsc --noEmit` + Android 번들, week13 웹 빌드에서 로그인 → 목록 → 상세 → 리뷰 → 지도(웹 대체 화면) 흐름 확인 (Firebase 응답은 가짜로 대체).
