# Week 7. Location & Maps: 위치 권한, 현재 위치, 실시간 추적, 지도, 마커, 도형

> 이 노트 읽는 법: **📘/💻/🧪 원문**(영어 그대로) 바로 밑에 **🇰🇷 한글 해설**이 있어요. 코드 밑의 **▶ Snack에서 바로 실행하기**를 누르면 그 코드가 Expo Snack에서 열려요(`expo-location`, `react-native-maps` 자동 포함). **지도는 Web에서 안 나와요.** 오른쪽 위 **My Device**를 고르고 폰의 Expo Go로 QR을 찍거나, Android/iOS 미리보기를 쓰세요. **Test 2 범위.**

## 0. 이번 주 한눈에 보기

**위치 기능 4단계 공식**
```jsx
const { status } = await Location.requestForegroundPermissionsAsync(); // 1. 권한 요청
if (status !== "granted") { setErrorMsg("..."); return; }              // 2. 거절 처리
const pos = await Location.getCurrentPositionAsync({});                 // 3. 위치 한 번
const [place] = await Location.reverseGeocodeAsync(pos.coords);         // 4. 좌표 → 주소
```

| 하고 싶은 것 | 함수/컴포넌트 | 기억할 점 |
| --- | --- | --- |
| 권한 묻기 | `requestForegroundPermissionsAsync()` | `status === "granted"` 확인. 거절해도 앱은 동작해야 함 |
| 위치 한 번 | `getCurrentPositionAsync({})` | `pos.coords.latitude/longitude/accuracy` |
| 좌표 → 주소 | `reverseGeocodeAsync(coords)` | **배열** 반환, 첫 번째가 최선. Web에서 안 됨 |
| 계속 추적 | `watchPositionAsync(options, callback)` | `subscription.remove()`로 **꼭 정리**(배터리) |
| 지도 | `<MapView style={{flex:1}} />` | 크기 없으면 안 보임. default export |
| 시작 위치 | `initialRegion` | 처음만. 나중에 바꿔도 안 움직임 |
| 코드로 이동 | `mapRef.current.animateToRegion(region, ms)` | `useRef` + `ref={mapRef}` |
| 파란 점 | `showsUserLocation` | Android는 **권한 먼저** 필요 |
| 핀 | `<Marker coordinate={{...}} title description onPress />` | named export `{ Marker }` |
| 영역 | `<Polygon coordinates={[...]} fillColor strokeColor />` | 점 3개 이상 |
| 지도 탭 좌표 | `onPress={(e) => e.nativeEvent.coordinate}` | `onLongPress`도 같음 |
| 장소 아이콘 숨기기 | `showsPointsOfInterest={false}`(iOS) + `customMapStyle`(Android) | **둘 다** 필요 |

**좌표 상식**: 위도(latitude)는 남북 -90~90, 경도(longitude)는 동서 -180~180. 그리니치 서쪽은 음수라서 토론토 경도는 약 **-79.35**. delta 0.01도 ≈ 약 1km, **작을수록 확대**.

{{TOC}}

@@NOTE G-Geolocation/handuser-loc.md
@@K _pre
위치가 필요한 앱: 근처 식당, 길 찾기, 위치 맞춤 콘텐츠. RN에서는 **`expo-location`** 라이브러리로 GPS를 써요(Snack에서도 동작). Web 미리보기는 브라우저 위치를 쓰는데 권한이 없을 수 있어서, **실제 폰(My Device + Expo Go)** 이 확실해요.

**Permissions Matter(권한이 중요)**: GPS를 쓰기 전에 반드시 사용자에게 **허락**을 받아야 하고, 거절하면 **우아하게(gracefully)** 처리해야 해요(앱이 터지거나 멈추면 안 됨).
@@K One‑Time Location Lookup
**한 번만 위치 가져오기** (화면이 열릴 때 등).
코드 흐름: `useEffect` 안에서 async 함수 정의 → 권한 요청 → `granted` 아니면 에러 메시지 → `getCurrentPositionAsync` → state 저장 → 화면에 위도/경도.
@@K Tracking Location in Real Time
**실시간 추적** (운동 앱, 내비게이션).
- `watchPositionAsync(옵션, 콜백)`: 위치가 바뀔 때마다 콜백 호출.
- 반환된 **subscription**을 cleanup에서 `remove()`. 안 하면 GPS가 계속 켜져 **배터리 소모**.
@@K What You Should Remember
- 비동기 위치 호출은 **useEffect** 안에서.
- watcher는 **반드시 정리**. 화면이 닫힌 **뒤에** 시작된 watcher까지 (그래서 `cancelled` 깃발이 필요해요, 아래 7.1 Live Location 참고).

@@NOTE G-Geolocation/disp-maps.md
@@K _pre
지도는 **`react-native-maps`** 의 **`MapView`** 컴포넌트로 보여 줘요.
- Snack에서는 Expo Go(실제 폰)에서만 보이고 **Web 미리보기에서는 안 보여요**.
- MapView는 **폰 자체의 지도**를 감싼 거라 플랫폼마다 달라요: **iOS = Apple Maps, Android = Google Maps**. 대부분의 prop은 둘 다 되지만 일부는 한쪽만. (시험 포인트)
@@K Rendering a Basic Map
**코드 해설**: 전체 화면 지도 + 파란 점(내 위치) + **Find Me** 버튼으로 다시 내 위치로 이동.
@@K Understanding the Map Props
**prop 4개 (시험 단골)**
- **`showsUserLocation`**: 파란 점. 앱이 이미 위치 권한이 있어야 해요. **Android는 권한 없으면 조용히 안 나와요** → expo-location으로 먼저 요청.
- **`initialRegion`**: 처음 보이는 영역 = 중심 `latitude`, `longitude` + 보이는 범위 `latitudeDelta`, `longitudeDelta`(도 단위). delta가 **작을수록 확대**. **시작만** 정함, 나중에 바꿔도 지도 안 움직임.
- **`ref` + `animateToRegion`**: 코드로 지도 이동. `useRef`로 ref 만들고 `mapRef.current.animateToRegion(region, duration)`. 두 플랫폼 다 되지만 **iOS는 duration 무시**.
- **`followsUserLocation`**: 사용자 따라 중심 유지. **Apple Maps 전용**, Android에선 아무것도 안 함. 두 플랫폼 다 하려면 animateToRegion으로 직접.

@@NOTE G-Geolocation/work-maps.md
@@K _pre
지도에 내 **마커(핀)**, **도형**, 데이터를 올리면 훨씬 유용해져요.
@@K Adding Custom Markers
**Marker** = 특정 좌표의 핀(캠퍼스, 가게, 랜드마크).
**지도 자체의 관심 장소(POI: 가게, 식당 등) 숨기기는 플랫폼마다 달라요**:
- iOS(Apple Maps): `showsPointsOfInterest={false}`
- Android(Google Maps): `customMapStyle` 규칙
→ 예제는 **둘 다** 써요. (Lab 6 Part 1 주석 내용!)
`initialRegion`으로 마커들이 보이는 곳에서 시작, delta로 확대 정도.
@@K Drawing Shapes (Polygons)
**Polygon** = 좌표 목록을 이어 닫힌 도형. 캠퍼스 경계, 배달 구역, 동네 등 **영역** 표시.
@@K What You Should Remember
- 점은 `Marker`, 영역은 `Polygon`.
- POI 숨기기는 iOS `showsPointsOfInterest={false}` + Android `customMapStyle`.
- 모두 Expo Go 실제 기기에서 동작.

@@LEC week-07.1-notes.md
@@K React Native Playground
패키지 2개 필요: `expo-location`(위치), `react-native-maps`(지도). 이번 주는 **폰**에서. 위치 예제는 Web에서도 되지만(브라우저가 위치를 물음) 노트북 위치는 Wi-Fi 기반이라 부정확. **지도는 Web 불가**. Expo Go의 권한 답은 Snack별이 아니라 **Expo Go 앱 단위**로 기억돼요. 다시 보려면 폰 설정에서 Expo Go 위치 권한을 바꾸세요.
@@K Why Location?
- 위치에서 시작하는 앱이 많아요(근처 식당, 픽업, 날씨, 달리기).
- 폰은 **GPS, Wi-Fi, 기지국**으로 위치를 찾고 앱은 **위도와 경도**를 받아요.
- 위치는 **사생활**(집, 직장, 동선). 그래서 OS가 앱에게 묻게 하고 사용자는 **거절**할 수 있어요. 거절해도 앱은 계속 동작해야 해요.
- 위치 함수는 5주차 fetch처럼 **비동기(Promise)** → useEffect 안에서, 결과는 state에.
- 묻는 방법 2가지: **한 번**(지금 어디?), **계속**(움직일 때마다 알려 줘).
@@K Example: Where Am I?
가장 단순한 위치 기능: 한 번 묻고, 좌표 보여 주고, 주소로 바꾸기.
@@K Starter Code
"찾는 중" 스피너가 영원히 돌아요. 아직 아무도 위치를 묻지 않으니까.
@@K Step 1 - Ask for Permission
- `import * as Location from "expo-location";` → 모든 기능이 `Location.xxx`로.
- `errorMsg` state(`null` = 에러 없음).
- **async/await**: `await`는 Promise가 끝날 때까지 기다렸다가 결과를 줌. `async` 함수 안에서만 사용. 5주차 `.then()`과 같은 일인데 위에서 아래로 읽혀요.
- **useEffect 콜백 자체는 async가 될 수 없어요.** effect는 cleanup 함수만 return 할 수 있는데 async 함수는 항상 Promise를 return 하니까. 그래서 안에 async 함수를 정의하고 호출. (시험 개념 문제 후보!)
- **Foreground** 권한 = 앱이 열려 있는 동안. Background(앱이 닫혀도)는 추가 설정과 앱스토어 심사 필요.
- 거절 → 에러 화면. 허용해도 여전히 스피너: 권한은 **문만 열어 줄 뿐**, 위치를 아직 안 물었으니까.
@@K Step 2 - Get the Position
- `const pos = await Location.getCurrentPositionAsync({});` `{}`는 기본 옵션.
- `pos.coords`: `latitude`, `longitude`, `accuracy`, `altitude`, `speed`, `heading`(일부는 null 가능). `pos.timestamp`도 있음.
- **try/catch** = await 코드에서 reject 처리(5주차 `.catch()`). 폰의 위치 서비스가 꺼져 있을 때 대비.
- `toFixed(5)` = 소수점 5자리(약 1미터). GPS가 실제로 재는 것보다 숫자가 많아서 잘라요.
- **`accuracy`** = 미터 단위 **반지름**. 폰이 그 원 안 어딘가에 있다는 뜻. 실내 vs 창가 비교해 보세요.
- 뉴넘 캠퍼스 ≈ 43.79, -79.35.
@@K Step 3 - Find the Address
- `reverseGeocodeAsync(coords)` → 좌표를 주소로(**reverse geocoding**). **배열**을 반환, 첫 번째가 가장 잘 맞는 것.
- 주소 필드: `name`, `street`, `streetNumber`, `city`, `region`, `postalCode`, `country`. 전부 **null 가능**.
- 주소는 좌표보다 늦게 오니까 렌더링 전에 `address &&`로 확인.
- 폰 내장 서비스를 써서 **Web에서는 실패** → catch가 에러 표시.
@@K Finished Code
**완성 코드 해설**: `errorMsg`, `location`, `address` state → useEffect 안 async `getLocation`(권한 → 위치 → 주소, try/catch) → early return 3단(에러 → 스피너 → 결과). 5주차 fetch 패턴과 구조가 같아요.
@@K Example: Live Location
- 달리기 앱, 배달 추적, 길 안내는 **바뀔 때마다** 위치가 필요.
- `watchPositionAsync`는 멈추라고 할 때까지 새 위치마다 함수를 불러요. **멈추는 게 중요**: 남겨 두면 GPS가 계속 켜져서 배터리가 닳아요.
@@K Step 1 - Watch Instead of Get
- 매 업데이트마다 주소 조회는 너무 많아서 주소 부분 제거.
- `watchPositionAsync({ accuracy: Location.Accuracy.High, timeInterval: 1000, distanceInterval: 1 }, (pos) => setLocation(pos.coords))`
  - 두 번째 인자 = **콜백**, 새 위치마다 실행.
  - 옵션은 **정확도 vs 배터리** 트레이드오프. `Accuracy.High` = GPS. 두 interval은 필요 이상 자주 부르지 않게(1초, 1미터).
- 결과는 **subscription**, `subscription.remove()`로 중지 → cleanup에서 호출(2주차 타이머 정리 패턴).
- **`cancelled` 깃발이 필요한 이유 (중요!)**: 권한 대화상자가 떠 있는 동안 화면이 닫히면 cleanup이 **subscription이 생기기 전에** 실행돼요. 그 뒤에 watch가 시작되면 아무도 안 끄게 되죠. 그래서 시작될 때 `if (cancelled) { sub.remove(); }`로 바로 끄기.
- 가만히 있으면 `distanceInterval` 때문에 업데이트가 멈춰요.
@@K Step 2 - Count the Updates
`setUpdates((prev) => prev + 1)` 함수형(이전 값 기반). 걸으면 약 1초에 한 번 증가, 멈추면 정지. watch가 살아 있다는 증거.
@@K Step 3 - Pause and Resume
- `tracking` state + effect 첫 줄 `if (!tracking) return;` + 의존성 `[tracking]`.
- **Pause** → tracking 변경 → React가 **cleanup 실행(watch 제거)** → effect 재실행 → 첫 줄에서 return(새 watch 없음).
- **Resume** → 새 watch. 권한 요청은 다시 실행되지만 이미 허락해서 대화상자 없이 즉시 응답. 새 watch는 항상 **현재 위치를 먼저** 보고해서 카운트가 바로 +1.
- 2주차 Lab Q5 스톱워치(`[running]`)와 완전히 같은 구조예요!
@@K Finished Code
**완성 코드 해설**: `[tracking]` 의존 effect 안에서 `cancelled` 깃발 + `subscription` 변수 → async 함수(권한 → watch) → cleanup에서 `cancelled = true; subscription?.remove();`. Pause/Resume 버튼. Test 2에서 "watcher 정리" 코드를 쓰라고 하면 이 패턴.
@@K Maps
- 좌표 숫자는 읽기 어려워요. 지도로 보여 주면 관계가 보여요.
- `MapView`는 **그림이 아니라 폰의 진짜 지도**를 감싼 것 → 이동, 확대, 회전이 Maps 앱처럼.
- 플랫폼마다 다른 지도(iOS Apple, Android Google), 일부 prop은 한쪽 전용.
- Expo Go는 API 키 불필요. 출시하는 Android 앱은 Google Maps 키 필요(빌드 설정).
- **모든 지도 예제는 My Device.** Web은 에러.
@@K Example: Your First Map
첫 지도: 화면 채우기 → 캠퍼스에서 시작 → 파란 점 → Find Me 버튼.
@@K Starter Code
- `position: "absolute"` + `bottom: 40` → 버튼을 flexbox 흐름에서 빼서 바닥 위 40에 **떠 있게**. `alignSelf: "center"`로 가로 가운데.
- 버튼은 6주차 Pressable + pressed 스타일.
@@K Step 1 - Show a Map
- `import MapView from "react-native-maps";` → **default export라 중괄호 없음**.
- 지도는 크기가 없어서 `style={{ flex: 1 }}`(또는 StyleSheet)로 채워야 보여요. 없으면 **아무것도 안 그려짐**.
- JSX에서 **뒤에 오는 것이 위에** 그려져요. 버튼이 지도 뒤에 있어서 지도 위에 떠요.
- 드래그 이동, 핀치 확대, 두 손가락 회전은 다 내장.
@@K Step 2 - Start on Campus
- region = 중심 + 범위. delta 0.01 ≈ 1km.
- 0.1 → 노스요크 대부분, 0.002 → 건물 하나. **작을수록 확대.**
- `initialRegion`은 **시작만**. 이후 prop을 바꿔도 지도는 그대로. 나중에 움직이려면 코드로 명령(Step 4).
@@K Step 3 - Show the Blue Dot
- `showsUserLocation`은 **Android에서 권한 없으면 조용히 실패** → expo-location으로 먼저 권한.
- `hasPermission` state + effect에서 요청 → `showsUserLocation={hasPermission}`.
- 파란 점 주변 옅은 원 = accuracy 반지름.
- `followsUserLocation`은 Apple 전용 → Step 4가 양쪽 해결책.
@@K Step 4 - Find Me
- `const mapRef = useRef(null);` + `<MapView ref={mapRef}>`.
- **6주차 useRef와 반대 방향**: 6주차는 값을 보관, 여기선 React가 렌더링 후 **컴포넌트 자체**를 `mapRef.current`에 넣어 줘요. 지도에는 메서드가 있고 그중 `animateToRegion`.
- `findMe`: 현재 위치 → `mapRef.current.animateToRegion({ ...coords, latitudeDelta: 0.005, longitudeDelta: 0.005 }, 1000)`. 1000ms(iOS는 무시).
- `disabled={!hasPermission}`.
- 모든 지도 앱에 있는 "다시 내 위치로" 버튼, 양쪽 플랫폼에서 동작.
@@K Finished Code
**완성 코드 해설**: MapView(ref, initialRegion, showsUserLocation) + 권한 effect + findMe(getCurrentPosition → animateToRegion) + 떠 있는 Pressable 버튼. Lab 6 Part 1~2의 뼈대예요.
@@K Example: Campus Markers
- Marker = 좌표의 핀, "이 장소가 중요해"라는 표시.
- Marker는 MapView **안의 자식 컴포넌트**라서 장소 배열을 `.map()`으로 마커 배열로(5주차 목록과 같은 원리).
@@K Starter Code
세네카 캠퍼스 데이터 + 전부 보이는 지도(delta 0.3) + 하단 정보 카드(`position: "absolute"` + `left`, `right` 20 → 가로로 늘어남).
@@K Step 1 - Add One Marker
- `import MapView, { Marker } from "react-native-maps";` → Marker는 **named export(중괄호)**.
- MapView가 더 이상 self-closing이 아님(자식 생김).
- 필수 prop은 **`coordinate`** 하나(`{ latitude, longitude }`).
- 핀을 누르면 **callout**(말풍선)에 `title`, `description`. Android는 길찾기 버튼도.
@@K Step 2 - A Marker for Every Campus
`CAMPUSES.map((c) => <Marker key={c.id} coordinate={...} title={c.name} />)`. 각 마커에 **key** 필수. 배열에 하나 추가하면 JSX 수정 없이 핀이 늘어나요.
@@K Step 3 - Show the Selected Campus
- callout은 작아서 보통 **자기 패널**에 상세를 보여 줘요.
- `selected` state에 **캠퍼스 객체 전체** 저장 → 카드에서 어떤 필드든 표시.
- 마커 `onPress={() => setSelected(c)}`.
- 카드: `{selected ? 이름/주소 : 힌트}`.
- `pinColor`는 처음 한 번만. Android는 그려진 마커의 색 변경이 반영 안 돼서 **선택 색으로 쓰기엔 불안정** → 카드가 선택 피드백.
@@K Step 4 - Hide Other Places
- 기본 지도의 식당, 가게, 버스 정류장이 내 마커와 경쟁.
- `customMapStyle={[{ featureType: "poi", stylers: [{ visibility: "off" }] }]}` → Google Maps 스타일 규칙. **poi** = point of interest.
- `showsPointsOfInterest={false}` → iOS용, Android는 무시. `customMapStyle` → Android용, Apple은 무시. **둘이 합쳐야 양쪽 다.**
@@K Finished Code
**완성 코드 해설**: CAMPUSES 배열 → `.map()` Marker(key, coordinate, title, onPress) → selected state → 하단 카드. POI 숨기기 두 prop. 목록(5주차) + 선택 state + 지도가 합쳐진 Test 2 스타일 코드예요.
@@K Example: Drawing on the Map
- Marker는 **점**, Polygon은 **영역**(캠퍼스 경계, 배달 구역).
- 지도는 사용자가 **탭한 좌표**도 알려 줘요(핀 꽂기, 영역 그리기).
@@K Starter Code
뉴넘 캠퍼스 지도 + 마지막 단계에서 쓸 Clear 버튼.
@@K Step 1 - Outline the Campus
- `Polygon` import, 캠퍼스 꼭짓점 배열 `CAMPUS_CORNERS`.
- `<Polygon coordinates={CAMPUS_CORNERS} strokeColor="red" strokeWidth={2} />`.
- 점들을 **순서대로** 잇고 첫 점으로 닫아요. 순서를 바꾸면 선이 꼬여요.
- 지도 좌표로 그려서 이동, 확대해도 제자리.
@@K Step 2 - Fill It In
`fillColor="rgba(255, 0, 0, 0.2)"` → rgba = 빨강, 초록, 파랑, **알파(투명도)**. 0.2 = 20% 불투명이라 지도가 비쳐 보여요.
@@K Step 3 - Draw Your Own Shape
- `points` state(빈 배열).
- `onPress={(e) => { const point = e.nativeEvent.coordinate; setPoints((prev) => [...prev, point]); }}` → 탭한 좌표는 **`e.nativeEvent.coordinate`**. 함수형 업데이트. 좌표를 먼저 `point` 변수에 꺼내 두는 이유: 업데이터는 React가 나중에 실행하니까 이벤트 객체 대신 단순한 값만 쓰게.
- 점마다 Marker(**index를 key로**: 끝에 추가하거나 전부 지우기만 해서 순서가 안 바뀌니 안전).
- `{points.length >= 3 && <Polygon ... />}` → 면적이 있으려면 **최소 3점**.
- Clear: `setPoints([])`.
- 지도 자체의 장소 아이콘을 탭하면 그 장소를 누른 거라 점이 안 생겨요 → POI 숨기면 해결.
@@K Finished Code
**완성 코드 해설**: 고정 Polygon(캠퍼스) + 사용자가 탭한 점들(Marker) + 3점 이상이면 사용자 Polygon + Clear 버튼. `e.nativeEvent.coordinate`와 `&&` 조건부 렌더링이 핵심.
@@K Location and Maps Checklist
**위치와 지도 체크리스트 8개 (서술형 대비)**
1. 위치는 **필요한 기능을 쓸 때** 묻기(앱 열자마자 X), 이유를 분명히.
2. "아니요" 처리: 권한 거절, 위치 서비스 꺼짐 둘 다 메시지, 나머지 앱은 계속 동작.
3. 위치 찾는 동안 진행 표시(몇 초 걸림).
4. 화면 닫히거나 일시정지하면 watch 중지(배터리).
5. 사용자가 지도를 옮긴 뒤 **다시 중심으로** 버튼.
6. 마커는 적고 의미 있게, 경쟁하는 지도 장소는 숨기기.
7. 모든 지도 prop의 **플랫폼 확인**(Apple 전용, Google 전용).
8. 실제 폰에서, 가능하면 iOS와 Android 둘 다 테스트. Web은 지도 불가.

@@LAB lab-6.md
@@K _intro
Lab 6 **Park It**(주차 위치 기억 앱)은 7주차 예제 4개(Where Am I, Live Location, Your First Map, Drawing on the Map)를 합친 문제예요. 각 파트의 연결 예제와 "내 말로 설명" 주석 포인트를 정리했어요.
@@K A Note on AI
AI는 막힐 때만. 목표: 적절한 순간에 위치를 묻고, 지도에 올리고, 다 쓰면 그만 쓰기.
@@K Overview
Part 1 지도, 2 주차 위치 저장, 3 주소, 4 거리, 5 수동 수정과 귀가. 순서대로.
@@K Setup
SDK 54, styles.js 분리, starter 3개 파일. 카드는 이미 `position: "absolute"`로 떠 있어요.
@@K Styling Rules
App.js에 인라인 스타일 금지. Pressable의 style 함수가 배열을 return 하는 건 OK.
@@K Running Your App
폰(My Device)에서. 안 되면 Android 탭(위치가 오샤와로 고정). Expo Go는 권한 답을 앱 단위로 기억.
@@K Submission
수업 끝나기 전 Snack 링크 제출.
@@K Part 1 - The Map (1 point)
**연결**: 7.1 Your First Map Step 1~2 + Campus Markers Step 4.
- `style` flex 1, `initialRegion={START}`, 카드는 JSX에서 지도 **뒤에**(위에 그려짐).
- 주석(내 말로): MapView는 iOS에서 Apple Maps, Android에서 Google Maps를 쓰는데, `showsPointsOfInterest`는 Apple만, `customMapStyle`은 Google만 알아들어서 두 개를 같이 줘야 양쪽에서 숨겨진다.
@@K Part 2 - Park Here (1 point)
**연결**: 7.1 Your First Map Step 3~4, 단 권한 요청을 **버튼 안으로** 이동.
- 주석(내 말로): 앱 열자마자 물으면 사용자는 왜 필요한지 모르고 거절하기 쉽다. 주차 버튼을 누른 순간이면 위치가 왜 필요한지 분명해서 허락받기 쉽고, 필요할 때만 쓰게 된다.
- `spot` state `{ latitude, longitude, time: new Date() }` 시작은 null.
- 진행 중 state(`finding`)로 버튼 `Finding you...`, disabled. `finally`에서 원복.
- 파란 점용 권한 state 따로(Android 조건).
- `animateToRegion` delta 0.005.
@@K Part 3 - The Address (1 point)
**연결**: 7.1 Where Am I Step 3 + Live Location의 cancelled 깃발.
- `useEffect(..., [spot])` 안에서 reverse geocode(Part 5의 길게 누르기도 같이 커버).
- 먼저 주소 state를 비워 `Looking up the address...` → 이전 주소 절대 표시 X.
- 실패하거나 street 없으면 `lat.toFixed(5), lng.toFixed(5)`.
- 주석(내 말로): 주소 조회가 끝나기 전에 spot이 또 바뀌면, 늦게 도착한 옛날 주소가 새 spot의 주소를 덮어쓸 수 있다(race condition). cancelled 깃발로 옛날 결과를 무시한다.
@@K Part 4 - How Far Is the Car? (1 point)
**연결**: 7.1 Live Location.
- watch로 받은 최신 위치는 state, **거리는 state 아님**(derived, return 위에서 `distanceInMetres` 계산).
- `const parked = spot !== null;` 의존성 `[parked]`.
- 주석(내 말로): `[spot]`이면 spot을 길게 눌러 옮길 때마다(시간도 바뀌니까) watch를 껐다 켜게 되는데, 필요한 건 "주차 중인지 아닌지"가 바뀔 때만 watch를 시작/중지하는 것이라 boolean `parked`가 맞다.
- 20m 미만이면 `right here`.
@@K Part 5 - Fix the Spot and Go Home (1 point)
**연결**: 7.1 Drawing on the Map Step 3.
- `onLongPress={(e) => setSpot({ ...e.nativeEvent.coordinate, time: new Date() })}`. 권한 없어도 동작.
- I'm Back: `setSpot(null)` → parked false → watch 정리, 주소 effect도 힌트로.
- Part 3, 4 effect가 제대로면 **새 코드가 거의 필요 없음**. 이게 effect를 state에 의존시키는 설계의 장점이에요.

@@TEXT
## ✅ Week 7 시험 대비 체크리스트

1. 위치 권한 요청 함수와 확인 값? → `requestForegroundPermissionsAsync()`, `status === "granted"`
2. Foreground vs Background 권한?
3. useEffect 콜백을 async로 못 만드는 이유? → effect는 cleanup만 return, async는 Promise를 return
4. await를 쓸 수 있는 곳? → async 함수 안
5. 위치 한 번 / 계속? → `getCurrentPositionAsync` / `watchPositionAsync`
6. `pos.coords`에 들어 있는 것? → latitude, longitude, accuracy, altitude, speed, heading
7. accuracy의 의미? → 미터 단위 반지름
8. reverseGeocodeAsync 반환형? → 배열(첫 번째가 최선), 필드는 null 가능, Web 불가
9. watch를 정리하는 방법과 이유? → `subscription.remove()` in cleanup, 배터리
10. cancelled 깃발이 필요한 상황? → 권한 대화상자 중 화면이 닫히면 구독 생성 전에 cleanup 실행
11. Pause/Resume 구현? → `[tracking]` 의존 + 첫 줄 early return
12. MapView가 안 보이는 이유? → 크기(flex: 1) 없음 / Web 미리보기
13. iOS와 Android 지도? → Apple Maps / Google Maps
14. initialRegion 4개 값과 delta 의미? → 작을수록 확대, 시작만 설정
15. 코드로 지도 이동? → `useRef` + `ref` + `animateToRegion(region, ms)` (iOS는 ms 무시)
16. showsUserLocation 주의점? → Android는 권한 먼저
17. followsUserLocation? → Apple 전용
18. MapView / Marker import 차이? → default / named `{ Marker }`
19. POI 숨기기? → iOS `showsPointsOfInterest={false}` + Android `customMapStyle`
20. 지도 탭 좌표? → `e.nativeEvent.coordinate`
21. Polygon 최소 점 개수와 rgba 알파?
22. 위치를 묻기 좋은 시점? → 기능을 쓸 때

**손으로 써 보기 과제**: "내 맛집 지도". 지도를 길게 눌러 맛집 핀 추가, 핀을 누르면 하단 카드에 정보, Find Me 버튼, POI 숨기기. 보지 않고 써 본 뒤 비교하세요. (폰의 Expo Go나 iOS/Android 미리보기에서 실행)

```jsx
import { useEffect, useRef, useState } from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import MapView, { Marker } from "react-native-maps";
import * as Location from "expo-location";

const START = { latitude: 43.7955, longitude: -79.3496, latitudeDelta: 0.02, longitudeDelta: 0.02 };
const HIDE_POI = [{ featureType: "poi", stylers: [{ visibility: "off" }] }];

export default function App() {
  const mapRef = useRef(null);
  const [hasPermission, setHasPermission] = useState(false);
  const [spots, setSpots] = useState([]);
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    const ask = async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      setHasPermission(status === "granted");
    };
    ask();
  }, []);

  const findMe = async () => {
    try {
      const pos = await Location.getCurrentPositionAsync({});
      mapRef.current.animateToRegion(
        { ...pos.coords, latitudeDelta: 0.005, longitudeDelta: 0.005 },
        1000
      );
    } catch (e) {
      console.log("Could not get location");
    }
  };

  const addSpot = (e) => {
    const coord = e.nativeEvent.coordinate;
    setSpots((prev) => [...prev, { id: Date.now().toString(), name: `Spot ${prev.length + 1}`, ...coord }]);
  };

  return (
    <View style={styles.container}>
      <MapView
        ref={mapRef}
        style={styles.map}
        initialRegion={START}
        showsUserLocation={hasPermission}
        showsPointsOfInterest={false}
        customMapStyle={HIDE_POI}
        onLongPress={addSpot}
      >
        {spots.map((s) => (
          <Marker
            key={s.id}
            coordinate={{ latitude: s.latitude, longitude: s.longitude }}
            title={s.name}
            onPress={() => setSelected(s)}
          />
        ))}
      </MapView>
      <View style={styles.card}>
        <Text style={styles.cardTitle}>
          {selected ? selected.name : "Long-press the map to add a spot"}
        </Text>
        {selected && (
          <Text>
            {selected.latitude.toFixed(5)}, {selected.longitude.toFixed(5)}
          </Text>
        )}
        <Pressable
          disabled={!hasPermission}
          onPress={findMe}
          style={({ pressed }) => [styles.button, pressed && styles.pressed, !hasPermission && styles.disabled]}
        >
          <Text style={styles.buttonText}>Find Me</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  map: { flex: 1 },
  card: { position: "absolute", left: 20, right: 20, bottom: 40, padding: 16, borderRadius: 12, backgroundColor: "#fff", gap: 8 },
  cardTitle: { fontSize: 18, fontWeight: "bold" },
  button: { backgroundColor: "#1e88e5", padding: 12, borderRadius: 8, alignItems: "center" },
  pressed: { backgroundColor: "#1565c0" },
  disabled: { backgroundColor: "#aaa" },
  buttonText: { color: "#fff", fontWeight: "bold" },
});
```

**해설**: 권한은 화면이 열릴 때 한 번만 묻고, 그 결과(`hasPermission`)로 파란 점과 버튼 활성화를 정해요. 길게 누른 좌표는 `e.nativeEvent.coordinate`, 추가는 함수형 업데이트. 카드가 JSX에서 지도 뒤에 있어서 지도 위에 떠요.
