# Week 3. 스타일과 레이아웃: StyleSheet, Flexbox, Platform, 공통 컴포넌트

> 이 노트 읽는 법: **📘/💻/🧪 원문**(영어 그대로) 바로 밑에 **🇰🇷 한글 해설**이 있어요. 코드 밑의 **▶ Snack에서 바로 실행하기**를 누르면 그 코드가 Expo Snack에서 열려요.

## 0. 이번 주 한눈에 보기

이번 주는 앱을 **예쁘게, 그리고 화면 크기에 맞게 배치**하는 법을 배워요. React Native에는 CSS 파일이 없어요. 대신 **JavaScript 객체**로 스타일을 써요.

| CSS(웹) | React Native | 차이 |
| --- | --- | --- |
| `font-size: 20px;` | `fontSize: 20` | **camelCase**, 단위(px) 없이 **숫자** |
| `.title { ... }` 클래스 | `StyleSheet.create({ title: {...} })` | 이름 붙인 스타일 객체 |
| `class="a b"` | `style={[styles.a, styles.b]}` | 배열, **뒤에 있는 게 이김** |
| `flex-direction` 기본 `row` | `flexDirection` 기본 **`"column"`** | 시험 단골! |
| `flex: 1 1 auto` | `flex: 1` | **숫자 하나**만 |
| div 색이 안쪽 글자로 상속 | View는 상속 **안 함** | Text 안의 Text만 상속 |

Flexbox 두 축, 이것만 기억하면 레이아웃 문제 절반은 풀려요.
- **`justifyContent`** = **주축(main axis)** 정렬. 주축은 `flexDirection` 방향.
- **`alignItems`** = **교차축(cross axis)** 정렬. 주축의 수직 방향.
- `flexDirection`을 바꾸면 **두 축도 바뀐다.**

{{TOC}}

@@NOTE C-Styling/stylesheets.md
@@K _pre
**StyleSheet 기본**
- 웹에서 CSS를 HTML 밖으로 빼듯이, RN에서도 스타일을 JSX 밖으로 빼서 코드를 깔끔하게 해요.
- `StyleSheet.create({ container: {...}, title: {...} })` 에 **JavaScript 객체**를 넘겨요.
- 적용은 `<View style={styles.container}>` 처럼 `style` prop에.

첫 예제의 속성들: `flex: 1`(화면 채우기), `padding`, `paddingVertical`(위아래 패딩만), `borderWidth`, `borderColor`, `borderRadius`(둥근 모서리), `textAlign`, `fontWeight: 'bold'`(문자열!). `'#eaeaea'` 같은 색도 문자열.

**Platform.select() 예제**
- 폰마다 상단 상태바(시계 있는 줄) 높이가 달라서, 플랫폼별로 패딩을 다르게 줄 때가 있어요.
- `...Platform.select({ ios: {...}, android: {...} })` → 지금 기기에 맞는 객체를 골라서 `...`(spread)로 스타일 안에 **펼쳐 넣어요**.
- Android는 `StatusBar.currentHeight`로 상태바 높이를 알 수 있지만, iOS는 이 값이 없어요(undefined). 그래서 iOS는 고정 패딩 20.
@@K Building responsive layouts using Flexbox
**Flexbox**: 아이템을 **한 방향(행 또는 열)** 으로 배치하는 **1차원** 레이아웃 방식. 공간이 남으면 늘어나고(grow), 모자라면 줄어들어요(shrink).

원문 포인트:
- `flex`는 `flex-grow`, `flex-shrink`, `flex-basis`의 **줄임말**. 개별 속성보다 `flex`를 쓰라고 권장.
- **헷갈리는 포인트**: `flexDirection: 'column'`인데 결과는 "세 줄(rows)"처럼 보여요. column은 "아이템이 **세로로 쌓이는 방향**"이라는 뜻이라서, 결과적으로 위아래 세 칸이 생기는 거예요.
- 기기를 돌려도(가로/세로) 자동으로 맞춰져요. 이게 **반응형(responsive)**.

예제 해설:
- `container`: `justifyContent: 'space-around'` → 주축(세로)으로 아이템 주변에 균등한 여백.
- `cell`: `flexGrow: 1` → 남는 공간을 똑같이 나눠 가짐. `alignSelf: 'stretch'` → 나 혼자 가로로 꽉 채움. `alignItems/justifyContent: 'center'` → 안의 글자를 가운데로.
- `'column'`을 `'row'`로 바꾸면 Top/Middle/Bottom이 **가로로 나란히** 세 칸이 돼요. 직접 바꿔 보세요!

@@NOTE C-Styling/common-comp.md
@@K View
**View** = 가장 기본 상자(컨테이너). iOS의 `UIView`, Android의 `android.View`, 웹의 `<div>`에 해당. 스타일 가능, 다른 컴포넌트를 담을 수 있어요.
@@K Text
**Text** = 글자 표시. 두 가지가 시험 포인트예요.
1. **중첩(nesting)**: Text 안에 Text를 넣어 일부만 굵게/색깔. 안쪽 Text는 바깥 Text의 스타일(fontFamily 등)을 **상속**해요.
2. **레이아웃이 특별함**: `<Text>` 안은 Flexbox가 아니라 **텍스트 레이아웃**. 안쪽 Text들은 사각형 상자가 아니라 글자처럼 줄 끝에서 **줄바꿈(wrap)** 돼요.
@@K Button
**Button** = 플랫폼마다 알맞게 그려지는 기본 버튼. 누르면 `onPress`. 스타일을 **완전히 바꿀 수는 없어요**(style prop 없음). `disabled` 상태는 지원.
@@K TextInput
**TextInput** = 글자 입력창. props로 자동 수정(autoCorrect), 자동 대문자(autoCapitalize), placeholder, 여러 줄(multiline), 키보드 종류(숫자, 이메일 등)를 설정. 이벤트: `onChangeText`(글자 바뀔 때), `onSubmitEditing`(엔터/완료 누를 때), `onFocus`(입력창 선택될 때).
@@K Switch
**Switch** = on/off 토글. **Controlled component(제어 컴포넌트)** 라서 프로그래머가 직접 state를 업데이트해야 움직여요. `onValueChange`에서 state를 바꾸고 `value`에 그 state를 넣어야 동기화돼요. 안 하면 손가락으로 밀어도 다시 튕겨 돌아가요.
@@K FlatList & SectionList
**FlatList** = 목록 전용 컴포넌트. Pull to Refresh(당겨서 새로고침), Scroll loading 지원. **SectionList**는 제목별로 묶은 목록. 5주차에 자세히 배워요.
@@K Image
**Image** 핵심 3가지:
1. 이미지 불러오는 2가지 방법: 네트워크 `source={{ uri: 'https://...' }}` / 앱 안의 파일 `source={require('./a.png')}`.
2. **네트워크 이미지는 width/height를 꼭 줘야** 보여요. (require 이미지는 크기를 이미 알아서 생략 가능)
3. `resizeMode`로 상자 크기에 맞게 늘리거나 자르는 방식 조절.

예제의 두 번째 이미지는 `data:image/png;base64,...` **data URI**예요. 이미지 데이터를 글자로 직접 넣은 방식.
@@K Icons
**아이콘**: Expo(그리고 Snack)에는 `@expo/vector-icons`가 기본으로 들어 있어요. `import { FontAwesome } from '@expo/vector-icons';` 하고 `<FontAwesome name="home" size={32} color="#20232a" />` 처럼 이름, 크기, 색만 주면 돼요. 아이콘 이름은 https://icons.expo.fyi 에서 검색. 4주차 탭 아이콘에서 다시 써요.

예제의 `gap: 24`는 자식들 사이 간격이에요.

@@LEC week-03.1-notes.md
@@K React Native Playground
Snack 그대로 사용.
@@K Example: Inline Styles
**코드 해설**
- RN은 CSS 파일이 없어요. 스타일 = `style` prop에 넘기는 **JS 객체**.
- `fontSize`(camelCase), `24`(px 없는 숫자), `color: "blue"`(문자열).
- `style={{ ... }}` **이중 중괄호**: 바깥 `{}` = "여기부터 JS", 안쪽 `{}` = 스타일 객체. (1주차에 배운 거 그대로)
- 인라인 스타일은 빠른 테스트용. 길어지면 지저분하고 **재사용 불가**.
@@K Example: StyleSheet.create()
**코드 해설**
- 스타일을 파일 **아래쪽** `StyleSheet.create`로 옮김. `container`, `title` 은 이름 붙은 스타일.
- 장점: JSX가 깔끔해지고, 스타일이 한곳에 모이고, 여러 컴포넌트에서 **재사용**.
- **함정 실험**: `fontSize`를 `fontSise`로 오타 → **경고 없이 그냥 무시**돼요. 글자가 기본 크기로 돌아갈 뿐. (TypeScript를 쓰면 잡아 줘요.)
- `styles`를 선언 **전에** 쓰는데 왜 될까? `MyApp` 함수는 파일 전체가 로드된 **뒤에** 실행되니까요.
@@K Example: Layout with Flexbox
**코드 해설 (수업 순서)**
1. 상자 3개. `style={[styles.box, styles.red]}` → **스타일 배열**, 왼쪽부터 합쳐지고 **뒤가 이김**.
2. 기본은 위에서 아래로 쌓임. RN의 `flexDirection` 기본값은 **`"column"`** (웹은 row).
3. `flex: 1` 컨테이너 → 남은 화면을 꽉 채움.
4. `flexDirection: "row"` → 가로로.
5. `justifyContent: "center"` + `alignItems: "center"` → 정가운데.
   - `justifyContent` 값: `flex-start`, `center`, `flex-end`, `space-between`(양끝 붙이고 사이 균등), `space-around`(각 아이템 주변 균등), `space-evenly`(모든 간격 완전 균등)
6. 다시 `"column"`으로 → 이제 justifyContent는 **위아래**, alignItems는 **좌우**. **축이 바뀜!**
7. 같은 너비 열(equal columns): 고정 width 빼고 각 열에 `flex: 1` → 가로를 **똑같이 나눔**.
8. 글자 양이 달라도 **높이가 같아요**. `alignItems` 기본값이 **`"stretch"`** 라서.
9. 초록 열에 `{ flex: 2 }` 추가 → 다른 열의 **2배**. (비율: 1:2:1)
10. RN의 `flex`는 **숫자 하나**. CSS의 `flex: 1 1 auto` 같은 축약형 아님.

Flexbox Froggy 게임으로 연습하라고 했어요(Lab 3 Q1). 게임은 CSS 이름(`justify-content`)을 쓰니 RN에선 camelCase로 바꿔 생각하세요.
@@K Example: Platform.OS
**코드 해설**
- `Platform.OS` → `"ios"`, `"android"`, `"web"` 중 하나의 **문자열**.
- `{조건 && <내용>}` → **조건부 렌더링**. 조건이 true면 오른쪽을 반환, false면 false 반환 → React는 `false`, `null`, `undefined`를 **안 그려요.**
- **함정**: React는 숫자 `0`은 그려요! `{items.length && <Text>...</Text>}` 에서 목록이 비면 화면에 **0**이 떠요. 해결: `{items.length > 0 && ...}`.
- `Platform.Version`: Android는 숫자(34), iOS는 문자열("17.4").
- Snack 미리보기에서 Web/iOS/Android 탭을 바꿔 가며 확인해 보세요.
@@K Example: Platform-Specific Styles
**코드 해설**: StyleSheet 안에서 **삼항 연산자**로 분기. `Platform.OS === "ios" ? "#d0e8ff" : "#ffe8d0"` → iOS면 하늘색, 아니면 살구색.
@@K Example: Platform.select()
**코드 해설**
- `Platform.select({ ios: A, android: B, native: C, web: D, default: E })` → 지금 플랫폼에 맞는 값 **하나를 골라 반환**.
- 키 5개 의미 (시험 포인트):
  - `ios`: iOS만 / `android`: Android만 / `native`: iOS와 Android 둘 다(웹 제외) / `web`: 웹만 / `default`: 아무것도 안 맞을 때(권장)
- 스타일 객체를 반환할 땐 `...Platform.select({...})` 로 **펼쳐 넣기**.
- `StatusBar.currentHeight`: Android 상태바 높이. iOS에선 `undefined`.
- 스타일뿐 아니라 **문자열 같은 아무 값**이나 고를 수 있어요(두 번째 예제).
@@K Example: Platform-Specific Files
**파일 이름으로 플랫폼 나누기**
- `MyButton.ios.js`, `MyButton.android.js`, `MyButton.js` 를 만들어 두고
- `import MyButton from "./MyButton";` 이라고만 쓰면 RN이 **알아서 맞는 파일**을 골라요. import에 플랫폼 이름을 안 써요!
- `MyButton.js`는 전용 파일이 없는 플랫폼(여기선 web)의 **기본(fallback)**.
- 컴포넌트가 플랫폼마다 **아주 다를 때** 쓰는 방법. 조금 다를 땐 Platform.OS / select.
@@K Common Components
2주차 표에 나온 컴포넌트들에 이제 스타일을 입혀 봐요.
@@K View
**코드 해설**: View에 `padding`, `marginTop`, `borderWidth`, `borderRadius`. View 안에 글자를 바로 쓰면 안 되고 Text로 감싸야 해요.
@@K Text
**코드 해설**
- 바깥 Text = `<p>`처럼 블록, 안쪽 Text = `<span>`처럼 인라인.
- 안쪽 Text는 바깥 Text 스타일(크기 18, 회색)을 **상속**하고 자기 스타일(굵게, 빨강)을 **추가**.
- `{" "}` 는 줄바꿈 때문에 사라질 수 있는 **공백 한 칸**을 확실히 넣는 방법.
- **상속은 Text→Text에서만!** View에 `color: "blue"`를 줘도 안의 글자는 파랗게 안 돼요(검정). 웹 CSS와 가장 다른 점. Lab 3 Part B가 이 개념이에요.
@@K Button
**코드 해설**
- Button은 **style prop을 안 받아요.** 바꿀 수 있는 건 `color`뿐.
- 버튼 사이 간격은 버튼을 **View로 감싸서** View에 margin.
- `color`의 의미가 플랫폼마다 달라요: **iOS는 글자색, Android는 배경색**. (시험 포인트)
- `const colors = {...}` 는 그냥 일반 상수. 색을 재사용하려고 모아 둔 것.
- 완전히 꾸미고 싶으면 6주차 `Pressable`로 직접 버튼을 만들어요.
@@K Image
**코드 해설**
- 원격 이미지: `source={{ uri: "https://..." }}` → `source`에 **`uri` 키를 가진 객체**. width/height **필수**(다운받기 전엔 크기를 모르니까).
- 로컬 이미지: `source={require("./assets/snack-icon.png")}` → 크기를 이미 알아서 width/height 선택.
- `require()` 경로는 **고정 문자열**이어야 해요. 변수로 조립 불가 (`require("./" + name)` X).
- `borderRadius: 10` 둥근 모서리. width의 절반을 주면 **원**(Lab 3 Part A 힌트).
@@K ScrollView
**코드 해설**
- `Array.from({ length: 50 }, (_, i) => i + 1)` → [1, 2, ..., 50] 배열 만들기. `_`는 "안 쓰는 값" 표시.
- 화면은 기본적으로 **스크롤 안 됨**. ScrollView를 View로 바꾸면 아래가 잘려요.
- `style` = 스크롤 **창 자체**의 스타일 / `contentContainerStyle` = 창 **안의 내용**의 스타일. padding이나 `alignItems` 같은 flexbox 속성은 **contentContainerStyle**에! (시험 포인트)
- ScrollView는 자식을 **한꺼번에 전부** 그려요. 수백 개 목록엔 부적합 → 5주차 **FlatList**.
@@K TextInput
**코드 해설**
- `onChangeText` = 새 **문자열**을 줌 / `onChange` = **이벤트 객체**를 줌.
- **Controlled component**: state가 값을 들고, `value`로 보여 줌.
- TextInput은 기본 **테두리가 없어요.** `borderWidth` 안 주면 투명해서 안 보여요.
- `onChangeText={setName}` 은 `onChangeText={(text) => setName(text)}` 와 같아요.
- 유용한 props: `keyboardType="email-address"`(이메일 키보드), `autoCapitalize="none"`(첫 글자 자동 대문자 끄기), `autoCorrect={false}`(자동 수정 끄기), `secureTextEntry`(비밀번호 ●●●), `multiline`(여러 줄).
@@K Switch
**코드 해설**
- `<Switch value={isOn} onValueChange={setIsOn} />` → controlled. `onValueChange`가 새 boolean을 줘요.
- 웹에서는 안 보일 수 있으니 iOS/Android 미리보기로 확인.
- `style={[styles.container, isOn && styles.dark]}` → **조건부 스타일**. isOn이 false면 배열에 `false`가 들어가는데, 스타일 배열의 false는 **무시**돼요. 그래서 켜졌을 때만 dark가 적용.
- 다크 모드처럼 상태에 따라 스타일을 바꾸는 패턴. 시험에 잘 나올 만한 유형이에요.

@@LAB lab-3.md
@@K _intro
Lab 3는 **레이아웃 직접 짜기** 연습이에요. 문제 조건(스타일 이름, 파일 분리, flex로 같은 너비 등)이 아주 구체적이라 그대로 시험 채점 기준처럼 읽으면 좋아요.
@@K A Note on AI
AI는 막힐 때만. Flexbox Froggy 답도 찾아보지 말고 직접 풀라고 해요.
@@K Overview
Q1은 Flexbox Froggy 게임 스크린샷, Q2는 Snack으로 프로필 카드 만들기.
@@K Submission
스크린샷 1장 + Snack 링크 1개. 시크릿 창으로 링크 열리는지 확인.
@@K Question 1 - Flexbox Froggy (1 point)
24단계 전부 클리어. 게임은 CSS 문법(대시), RN은 camelCase + 문자열 값. 웹 기본 방향은 row, **RN은 column**.
@@K Question 2 - Profile Card (4 points)
4파트(A~D), 각 1점. 아래에서 파트별로 어떤 개념을 쓰는지 정리할게요.
@@K Setup
`styles.js` 파일을 따로 만들어 `export default StyleSheet.create({...})` 하고, App.js에서 `import styles from "./styles";`. **스타일 파일 분리** 연습이에요.
@@K The Component
props: `name`, `handle`, `imageUri`, `topic`(기본값 "React Native"), `posts`, `followers`, `following`. 두 번 렌더링하고 하나는 topic을 빼서 기본값이 보이게. → 1주차 구조 분해 기본값.
@@K Part A - Header Row (1 point)
**쓰는 개념**: `flexDirection: "row"`(사진 왼쪽, 글자 오른쪽), Image width/height 80 + `borderRadius: 40`(원), 이름/핸들은 View로 묶어 세로로, **세로 가운데 정렬은 row 컨테이너에 `alignItems: "center"`**(row에서 교차축 = 세로), 간격은 `gap` 또는 `marginLeft`.
@@K Part B - Bio Line (1 point)
**쓰는 개념**: Text 안의 Text 상속. 바깥 Text에 `fontSize: 16`, 안쪽 Text엔 굵기와 색만. 안쪽에 fontSize를 또 주면 감점 조건이에요.
@@K Part C - Stats Row (1 point)
**쓰는 개념**: `Stat({ value, label })` 작은 컴포넌트를 3번 재사용. 각 Stat에 `flex: 1` + `alignItems: "center"` → 고정 width 없이 **같은 너비**. 구분선은 stats row에 `borderTopWidth: 1`.
@@K Part D - The Card and Styles File (1 point)
**쓰는 개념**: `...Platform.select({ ios: {...}, android: { elevation: 4 }, default: {...} })` 를 card 스타일 안에 spread.
- **왜 web은 default인가?** select에 `web` 키가 없으니까, 맞는 키가 없을 때 쓰는 `default`가 선택돼요. (iOS 그림자 속성, Android elevation은 웹에서 의미가 없으니 테두리로 대체)
- App.js에 **인라인 스타일 0개**.
- 스타일 이름은 **용도**로(`card`, `headerRow`), 모양으로 짓지 않기(`bold`, `grey` X).

@@TEXT
## ✅ Week 3 시험 대비 체크리스트

1. RN 스타일 속성 이름 규칙? → camelCase, 크기는 단위 없는 숫자
2. `style={{ }}` 이중 중괄호 의미? → JS 영역 + 객체
3. `style={[a, b]}` 에서 겹치면? → **뒤(b)가 이김**
4. 스타일 이름 오타(`fontSise`)는? → 경고 없이 무시
5. RN `flexDirection` 기본값? → `"column"` (웹은 row)
6. `justifyContent` vs `alignItems`? → 주축 / 교차축
7. 열 높이가 같아지는 이유? → `alignItems` 기본값 `"stretch"`
8. `flex: 2`의 의미? → 형제 대비 2배 공간
9. `Platform.select` 키 5개? → ios, android, native, web, default
10. 플랫폼별 파일 이름? → `X.ios.js`, `X.android.js`, `X.js`(fallback), import는 `"./X"`
11. `{0 && <Text/>}` 결과? → 화면에 **0**이 보임
12. 스타일 상속은 어디서만? → **Text 안의 Text**. View는 상속 안 함
13. Button에 style을 줄 수 있나? → 없음, `color`만 (iOS 글자색, Android 배경색)
14. 원격 Image가 안 보이는 이유? → width/height 없음
15. ScrollView padding/alignItems는? → `contentContainerStyle`
16. TextInput이 안 보이는 이유? → 기본 테두리 없음
17. Switch가 안 움직이는 이유? → controlled라서 `onValueChange`로 state 업데이트 필요
18. 조건부 스타일? → `[styles.a, isOn && styles.b]`

**손으로 써 보기 과제**: 아래 "설정 화면"을 보지 않고 만들어 보세요. 3주차 개념(StyleSheet, flex row, alignItems, Switch, 조건부 스타일, Platform.select, Text 중첩)이 다 들어 있어요.

```jsx
import { useState } from "react";
import { View, Text, Switch, StyleSheet, Platform } from "react-native";

function SettingRow({ label, value, onChange }) {
  return (
    <View style={styles.row}>
      <Text style={styles.label}>{label}</Text>
      <Switch value={value} onValueChange={onChange} />
    </View>
  );
}

export default function App() {
  const [dark, setDark] = useState(false);
  const [sound, setSound] = useState(true);

  return (
    <View style={[styles.screen, dark && styles.darkScreen]}>
      <Text style={[styles.title, dark && styles.lightText]}>
        Settings for <Text style={styles.highlight}>{Platform.OS}</Text>
      </Text>
      <View style={styles.card}>
        <SettingRow label="Dark mode" value={dark} onChange={setDark} />
        <SettingRow label="Sound" value={sound} onChange={setSound} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, paddingTop: 80, paddingHorizontal: 16, backgroundColor: "#f0f0f0" },
  darkScreen: { backgroundColor: "#222" },
  title: { fontSize: 22, marginBottom: 16, color: "#222" },
  lightText: { color: "#fff" },
  highlight: { fontWeight: "bold", color: "tomato" },
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 8,
    ...Platform.select({
      ios: { shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.2, shadowRadius: 4 },
      android: { elevation: 4 },
      default: { borderWidth: 1, borderColor: "#ddd" },
    }),
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 12,
  },
  label: { fontSize: 18 },
});
```

**해설**: `row`는 가로 배치라서 `justifyContent: "space-between"`이 **가로** 양끝(글자 왼쪽, 스위치 오른쪽), `alignItems: "center"`가 **세로** 가운데예요. 제목의 플랫폼 이름은 Text 안의 Text라 크기 22를 물려받고 색과 굵기만 바뀌어요.
