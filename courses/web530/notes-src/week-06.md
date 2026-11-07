# Week 6. Touch: Pressable, Hit Slop, 스크롤, 스와이프와 취소

> 이 노트 읽는 법: **📘/💻 원문**(영어 그대로) 바로 밑에 **🇰🇷 한글 해설**이 있어요. 코드 밑의 **▶ Snack에서 바로 실행하기**를 누르면 그 코드가 Expo Snack에서 열려요. 이번 주는 **손가락** 주간이라, Pressable 예제는 Web에서도 되지만 hitSlop, 관성 스크롤, 스와이프는 **폰(My Device + Expo Go)** 에서 해 봐야 느낌이 와요. 스와이프 예제 링크는 iOS 미리보기로 열리게 해 두었어요. **Test 3 범위.**

> 🧭 **챕터 읽는 순서**: 챕터마다 맨 앞의 **🧭 먼저 한국어로** 상자(구성과 할 일) → 원문 출처 → 영어 원문 → ▶ Snack → 🇰🇷 한글 해설이에요. 코드 위에 **⌨️**가 있으면 직접 쳐 볼 코드이고, 없으면 읽기만 하거나 **👀 여기서 결과 보기**로 결과만 확인하면 돼요.

## 0. 이번 주 한눈에 보기

**제스처의 두 종류 (개념 문제 단골)**
| 종류 | 설명 | 예 |
| --- | --- | --- |
| **Discrete(이산적)** | 한 번 일어나고 끝 | 탭(tap), 길게 누르기(long press) |
| **Continuous(연속적)** | 매 프레임 움직임이 이어짐, 마지막에 실행되거나 **취소**될 수 있음 | 스크롤, 스와이프, 드래그 |

**Pressable 이벤트 순서 (시험 단골)**
| 사용자 동작 | 발생 이벤트 |
| --- | --- |
| 짧게 탭 | `onPressIn` → `onPressOut` → `onPress` |
| 길게 누름(약 0.5초) | `onPressIn` → `onLongPress` → `onPressOut` (**onPress 없음**) |
| 누른 채 손가락을 밖으로 빼고 뗌 | `onPressIn` → `onPressOut` (**취소**, 아무것도 실행 안 함) |

**핵심 도구 정리**
| 하고 싶은 것 | 도구 |
| --- | --- |
| 버튼, 카드, 목록 줄을 누르기 | `Pressable` (옛날 `TouchableOpacity` 등은 이제 비추천) |
| 누르는 동안 모양 바꾸기 | `style={({ pressed }) => [...]}` 함수 |
| 작은 아이콘을 누르기 쉽게 | `hitSlop={20}` (최소 44pt iOS / 48 Android) |
| Android 물결 효과 | `android_ripple` |
| 적은 양 스크롤 | `ScrollView` (전부 한 번에 렌더링) |
| 많은/서버 목록 | `FlatList` |
| 가로 스크롤 | `<ScrollView horizontal>` |
| 노치(notch) 피하기 | `SafeAreaView` |
| 직접 드래그 구현 | `PanResponder` + `Animated` + `useRef` |
| 스와이프해서 삭제 | `react-native-gesture-handler`의 `Swipeable` + `GestureHandlerRootView` |

{{PRACTICE}}

{{TOC}}

@@NOTE F-Touch/handling-touch.md
@@S _doc | read
탭과 길게 누르기 같은 터치를 처리하는 방법이에요. 💻 6.1 Pressable 예제에서 직접 쳐 보니까 여기서는 읽기만 해요.
@@K Pressable
**Gesture Responder System(GRS)**: 사용자가 탭하려는 건지, 스크롤하려는 건지 등을 **판단**하는 RN 내장 시스템. 강력하지만 직접 쓸 일은 드물고, 더 쉬운 컴포넌트를 써요.

**Pressable** = 요즘 권장되는 터치 컴포넌트. 옛날 `TouchableOpacity`, `TouchableHighlight`, `TouchableWithoutFeedback`, `TouchableNativeFeedback`을 **대체**(아직 작동은 하지만 새 코드엔 비추천).

Pressable이 주는 것 (원문 6개):
- `onPress` 탭 / `onLongPress` 길게 누르기 / `onPressIn`, `onPressOut` 누르기 시작과 끝
- `android_ripple` Android 물결 효과
- `hitSlop` 터치 영역 넓히기
- **style 콜백**: 눌렸는지(`pressed`)에 따라 모양 바꾸기

예제 해설: `style={({ pressed }) => [styles.button, pressed && styles.pressed]}` → 누르는 동안만 pressed 스타일. 이 페이지는 Alert 대신 `Text`로 결과를 보여 줘요(Alert는 Web에서 안 되니까).

@@K Long Press, Press In, and Press Out
이벤트가 발생하는 **순서**가 핵심이에요(위 0번 표).
- 탭: `onPressIn` → `onPressOut` → `onPress`
- 길게 누름: `onPress` 대신 `onLongPress`
- 손가락을 버튼 밖으로 빼고 떼면 **취소**: `onPressIn`, `onPressOut`만. 마음을 바꾼 사용자가 실수로 실행하지 않게.

@@K Improving Touch Targets with `hitSlop`
- 터치 대상은 **최소 44×44 포인트**(접근성, accessibility).
- `hitSlop={20}` → 주변에 **보이지 않는 20포인트 여유**를 줘서 레이아웃은 그대로, 터치 영역만 커짐.
- 객체로 한쪽씩도 가능: `{ top: 10, bottom: 10 }`.
- 주의: 옆 버튼과의 간격보다 작게. 겹치면 엉뚱한 버튼이 눌려요.
- **Web 미리보기는 hitSlop을 무시**해요. 폰에서 확인.

@@K Android Ripple Effects
`android_ripple={{ color: '...' }}` → Android 고유의 물결 피드백(Material Design). **Android에서만** 보여요.

@@K When to Use Gesture Handler
**Pressable**: 버튼, 카드, 목록 줄, 단순 탭/길게 누르기.
**Gesture Handler 라이브러리**: 스와이프, 드래그, 패닝(panning, 끌어서 이동), 핀치 줌(두 손가락 확대), 복잡한 조합.
- `Gesture` API로 제스처를 정의하고 `GestureDetector`로 컴포넌트에 붙여요.
- `Gesture.Tap()`, `Gesture.LongPress()`, `Gesture.Pan()`(드래그, 스와이프), `Gesture.Pinch()`.

@@NOTE F-Touch/scrolling.md
@@S _doc | read
ScrollView와 FlatList 스크롤 정리예요. 읽고 개념만 잡으면 돼요.
@@K Scrolling with your fingers
`ScrollView`는 자식을 **전부 한 번에** 렌더링. 그래서 정적 콘텐츠, 짧은 목록, 폼, 긴 글에 적합.
**주의**: ScrollView는 **높이가 제한(bounded height)** 되어야 해요. 제한이 없으면 자식 크기만큼 늘어나서 스크롤이 안 돼요.
@@K ScrollView vs FlatList
FlatList는 화면에 나타날 때 렌더링(lazy), 화면 밖으로 나가면 **unmount**, virtualization, 구분선, 여러 열, 당겨서 새로고침, 무한 스크롤 지원.
**규칙**: ScrollView → 작고 정적인 콘텐츠 / FlatList → 크거나 동적인 목록.
@@K SafeAreaView
노치나 둥근 모서리가 있는 iOS 기기에서 시스템 UI(상태바, 홈 인디케이터)에 내용이 가려질 수 있어요. `SafeAreaView`는 보이는 **안전 영역** 안에 내용이 있도록 자동으로 패딩을 줘요. 전체 화면, 스크롤 화면, 가장자리에 닿는 화면에 권장.
@@K Basic ScrollView Example
**코드 해설**: SafeAreaView로 감싼 세로 ScrollView. 글을 반복해서 화면보다 길게 만들어 손가락으로 스크롤.
@@K Horizontal Scrolling
`<ScrollView horizontal>` → 가로 스크롤. 이미지 캐러셀, 카테고리 칩, 가로 메뉴에 사용.
**ScrollView를 피해야 할 때 (원문 5개)**: 수백, 수천 개 / 서버에서 불러옴 / 무한 스크롤 / 당겨서 새로고침 / 구분선이나 여러 열 → 이럴 땐 FlatList.
@@K Momentum and Natural Scrolling
- 스크롤은 **continuous**(손가락이 움직이는 동안 매 프레임), 탭은 **discrete**(한 번).
- **Momentum(관성)**: 빠르게 튕기면 손을 떼도 계속 움직이다가 저절로 느려짐. 천천히 끌면 손가락만큼만.
- ScrollView, FlatList는 **플랫폼 자체 스크롤**을 써서 코드 없이도 다른 앱과 똑같은 느낌. Web은 마우스 휠이라 폰에서 느껴 보세요.
@@K Nested Scrolling
**중첩 스크롤**: 세로 페이지 안에 가로 카드 줄(앱스토어 홈 화면처럼).
- RN은 드래그 **방향에 맞는** 스크롤뷰에 제스처를 줘요. 옆으로 끌면 카드가, 위로 끌면 페이지가 움직여요.
- **방향이 다를 때만 OK.** 같은 방향끼리 중첩하면 둘 다 드래그를 원해서 충돌. 세로 ScrollView 안에 FlatList를 넣으면 **경고**(FlatList가 무엇이 화면에 있는지 알 수 없어서 virtualization이 깨짐).
- 중첩은 얕게, 메인 스크롤은 FlatList.
- Web에서 가로 스크롤: Shift + 마우스 휠, 또는 트랙패드 두 손가락.
@@K Scrolling and Touch Together
목록 줄은 스크롤도 되고 탭도 돼야 해요. 둘 다 손가락이 줄 위에서 시작하는데 RN이 판단해요:
- 손가락이 **안 움직이고** 떨어지면 → **탭**
- 손가락이 **움직이면** → **스크롤**, 줄의 press는 **취소**
→ 각 줄에 Pressable만 넣으면 공짜로 해결.

예제 3가지 포인트 (원문 bullet):
1. `selected`는 id 객체 `{ '3': true, '7': true }`. `toggle`은 복사 후 한 id만 뒤집기, **함수형 업데이트**(새 state가 이전에 의존).
2. pressed 스타일을 스타일 배열 **마지막**에 → 선택된 줄에서도 누름 피드백이 보임.
3. **`extraData={selected}`** → FlatList에게 "줄이 data 말고 다른 것(selected)에도 의존한다"고 알려 줌. 없으면 최적화된 목록이 다시 그리기를 건너뛰어 탭한 줄이 선택 안 된 것처럼 보일 수 있어요.

@@NOTE F-Touch/swipe-cancel.md
@@S _doc | read
스와이프와 취소 제스처예요. 💻 6.1 Drag and Snap Back, Swipe to Delete에서 직접 쳐 봐요.
@@K Swipe Gestures
**스와이프** = 가로 드래그. 메일, 메시지, 할 일 앱에서 줄을 밀어 삭제, 보관, 읽음 표시.
**필수 조건 2가지 (시험 포인트)**:
1. **Cancellable(취소 가능)**: 사용자가 시작했다가 마음을 바꿀 수 있어요. **짧은 스와이프는 원위치(snap back)**, 의도적인 긴 스와이프만 실행. 실수로 지우는 사고 방지.
2. **스크롤과 공존**: 손가락이 **확실히 옆으로** 움직일 때만 스와이프가 제스처를 가져가고, 세로 드래그는 목록에 양보.
터치 화면 필요 → 폰에서.
@@K Building a Cancellable Swipe
RN 내장 도구 2개로 직접 만들기:
- **PanResponder**: 손가락 위치를 알려 줌.
- **Animated**: 매 프레임 컴포넌트를 다시 렌더링하지 **않고** 뷰를 부드럽게 움직임.
예제: 카드를 옆으로 끌어서, 짧으면 돌아오고 **120포인트** 넘으면 화면 밖으로 날아감.
@@K Understanding the Example
**5가지 핵심 (그대로 시험에 나올 만해요)**
1. **`useRef`**: 컴포넌트 일생 동안 **같은 객체** 유지. 없으면 렌더링마다 `new Animated.Value(0)`이 새로 생겨 0으로 리셋. ref를 바꿔도 **다시 렌더링 안 됨**. (useState와의 차이!)
2. **`onMoveShouldSetPanResponder`**: 이 카드가 제스처를 가져갈지 결정. 옆으로 **10포인트** 넘게 움직였을 때만 yes → 탭과 세로 드래그는 스크롤뷰 등에 양보. (제스처 우선순위 규칙)
3. **`onPanResponderMove`**: 카드 위치 = `gesture.dx`(손가락이 옆으로 움직인 거리).
4. **`onPanResponderRelease`**: 손을 뗄 때 **실행 또는 취소** 결정. `Animated.spring` = 0으로 살짝 튕기며 복귀, `Animated.timing` = 화면 밖으로 미끄러짐. `start(콜백)`의 콜백은 **애니메이션이 끝난 뒤** state 변경.
5. **`useNativeDriver: true`**: 애니메이션을 네이티브 쪽에서 실행 → JS가 바빠도 부드러움.
@@K Swipeable Rows
모든 줄에 PanResponder를 직접 쓰는 건 노가다. 실제 앱은 **`react-native-gesture-handler`의 `Swipeable`** 사용(Expo에 포함).
Swipeable이 주는 것: 물리 기반 부드러운 스와이프, 왼쪽/오른쪽 액션 패널, 충분히 안 밀면 **자동 취소**, 임계값 넘으면 콜백, iOS/Android 지원.
예제: 왼쪽으로 밀면 아래 **Delete** 버튼이 드러남. 짧으면 복귀, 버튼 너비 절반 넘으면 열린 채 유지, Delete 탭 → 삭제.
@@K Understanding the Example
**6가지 핵심**
1. **`GestureHandlerRootView`**: 모든 gesture-handler 컴포넌트는 이 안에 있어야 함. 앱 전체를 **한 번** 감싸기.
2. **`MessageRow`는 App 바깥(최상위)에 선언**. 컴포넌트 안에서 컴포넌트를 선언하면 렌더링마다 **새 컴포넌트**가 돼서 줄이 전부 새로 만들어지고 스와이프 위치를 잃어요. (시험 함정 후보!)
3. **`renderRightActions`**: 줄 오른쪽 아래에 깔리는 패널을 반환. 왼쪽으로 밀면 보임. 줄 배경이 **흰색**이어야 스와이프 전엔 패널이 가려져요.
4. **`overshootRight={false}`**: 패널 끝에서 멈춤(더 늘어나지 않게).
5. 삭제: Delete 탭 → `onDelete` → `setMessages`의 **함수형 업데이트**로 제거.
6. 제스처 우선순위: 위아래 드래그는 스크롤, 옆으로 움직일 때만 줄이 가져감.

**설계 원칙**: 스와이프는 버튼을 **드러내기만**, 삭제는 **탭**으로. 파괴적 행동(삭제)은 **두 번의 의도적 동작**이 필요. `onSwipeableOpen`으로 열리자마자 지우면 조금 길게 민 실수로 메시지를 잃어요. 그건 되돌릴 수 있는 행동(보관)에만.
@@K When to Use Swipe Actions
**쓸 때**: 보조 행동(삭제, 보관), 자주 하는 행동, 목록을 깔끔하게, 한 손 빠른 조작.
**피할 때**: 중요한데 스와이프가 **유일한** 방법일 때, 확인 단계가 필요할 때, 화면의 다른 가로 스크롤과 충돌할 때.
스와이프는 **숨겨져 있어요**(화면에 존재를 알려 주는 게 없음). 그래서 **항상 다른 방법도 제공**(상세 화면의 버튼 등).

💡 `Swipeable`은 **deprecated**(앞으로 없어질 수 있음). 수업용으로는 OK. 요즘은 `ReanimatedSwipeable`(거의 같은 API), Gesture API(`Gesture.Pan()`, `GestureDetector`), Reanimated를 써요. 이 예제를 그대로 두는 이유: Snack에서 잘 되고, 패턴을 명확히 보여 주고, Reanimated/Worklets의 복잡함을 피하려고.

@@LEC week-06.1-notes.md
@@S _doc | type
6.1 수업 라이브 코딩이에요. Starter Code에서 시작해 Step 순서대로 고쳐 가요. 스와이프 예제는 폰(Expo Go)에서 확인하세요.
@@S React Native Playground | skim
패키지와 실행 환경 안내예요.
@@S Why Touch? | read
탭 같은 discrete 제스처와 스크롤 같은 continuous 제스처를 구분해요.
@@S Example: Pressable | type
Pressable은 모양이 없는 터치 컴포넌트예요.
@@S Starter Code | type
할 일: 버튼처럼 생긴 View 시작 코드 쳐 두기
이 단계 코드를 직접 쳐 보세요.
@@S Step 1 - Make It Pressable | type
할 일: View를 Pressable로 바꾸고 onPress에서 setTaps((prev) => prev + 1)
이 단계 코드를 직접 쳐 보세요.
@@S Step 2 - Show Pressed Feedback | type
할 일: style={({ pressed }) => [styles.button, pressed && styles.pressed]}
style을 함수로 줘서 누르는 동안 모양을 바꿔요.
@@S Step 3 - Log Every Press Event | type
할 일: onPressIn, onPressOut, onPress, onLongPress를 로그로 찍기
이벤트 순서가 시험 포인트예요.
@@S Example: Hit Slop | read
hitSlop으로 작은 버튼의 터치 영역을 넓혀요.
@@S Scrolling | read
스크롤과 관성(momentum) 개념이에요.
@@S Example: ScrollView | type
세로 페이지 안에 가로 카드 줄을 넣어요.
@@S Starter Code | type
할 일: Row 30개짜리 세로 ScrollView 쳐 두기
이 단계 코드를 직접 쳐 보세요.
@@S Step 1 - Add a Horizontal Row | type
할 일: ScrollView horizontal + contentContainerStyle로 가로 카드 줄 추가
이 단계 코드를 직접 쳐 보세요.
@@S Example: Pressable Rows in a FlatList | type
목록은 스크롤도 되고 줄 탭도 돼야 해요.
@@S Starter Code | type
할 일: 줄 40개 FlatList 시작 코드 쳐 두기
이 단계 코드를 직접 쳐 보세요.
@@S Step 1 - Make the Rows Pressable | type
할 일: 줄 View를 Pressable로 바꾸고 pressed 피드백
이 단계 코드를 직접 쳐 보세요.
@@S Step 2 - Select Rows | type
할 일: selected 객체 state + toggle(id)로 줄 선택 표시
함수형 업데이트와 객체 복사를 연습해요.
@@S Swipe and Cancel | read
스와이프는 짧으면 취소되고 세로 스크롤을 막지 않아야 해요.
@@S Example: Drag and Snap Back | type
PanResponder와 Animated로 직접 끌기를 만들어요. 폰에서 확인하세요.
@@S Starter Code | type
할 일: 안 움직이는 카드 시작 코드 쳐 두기
이 단계 코드를 직접 쳐 보세요.
@@S Step 1 - Follow the Finger | type
할 일: useRef(new Animated.Value(0)) + PanResponder로 손가락 따라가기
이 단계 코드를 직접 쳐 보세요.
@@S Step 2 - Snap Back on Release | type
할 일: onPanResponderRelease에서 Animated.spring으로 복귀
이 단계 코드를 직접 쳐 보세요.
@@S Step 3 - Commit Past a Threshold | type
할 일: Math.abs(dx) > 120이면 Animated.timing으로 밀어내고 setDismissed(true)
이 단계 코드를 직접 쳐 보세요.
@@S Example: Swipe to Delete | type
실제 앱처럼 Gesture Handler의 Swipeable을 써요. 폰에서 확인하세요.
@@S Starter Code | type
할 일: MessageRow가 있는 받은편지함 FlatList 쳐 두기
MessageRow는 MyApp 바깥에 선언해요.
@@S Step 1 - Add the Gesture Root | type
할 일: 바깥 View를 GestureHandlerRootView로 바꾸기
이 단계 코드를 직접 쳐 보세요.
@@S Step 2 - Make the Rows Swipeable | type
할 일: 줄을 Swipeable renderRightActions로 감싸기
이 단계 코드를 직접 쳐 보세요.
@@S Step 3 - Delete the Message | type
할 일: remove(id)에서 filter로 지우고 onDelete prop 연결
이 단계 코드를 직접 쳐 보세요.
@@S Touch UX Checklist | read
터치 UX 체크리스트 6개는 서술형으로 나올 수 있어요.
@@K React Native Playground
마지막 예제(Swipe to Delete)만 `react-native-gesture-handler` 필요(링크에 자동 포함). Web은 마우스뿐이라: 클릭 = 탭, 꾹 누르기 = long press는 Web에서 OK. hitSlop, 관성 스크롤, 스와이프는 **폰**에서.
@@K Why Touch?
**Discrete vs Continuous** (0번 표). RN은 흔한 제스처용 컴포넌트를 줘요: 탭은 Pressable, 스크롤은 ScrollView/FlatList. 스와이프는 조금 더 작업이 필요.
@@K Example: Pressable
Pressable은 **모양이 없는** 터치 컴포넌트라 버튼, 카드, 목록 줄 무엇이든 될 수 있어요. 2주차 `Button`은 스타일을 못 바꾸지만 Pressable은 자유.
@@K Starter Code
버튼처럼 **생긴** View. 하지만 View에는 `onPress`가 없어서 눌러도 아무 일 없음. "생긴 것만으로는 버튼이 아니다."
@@K Step 1 - Make It Pressable
View를 `Pressable`로 바꾸고 `onPress={() => setTaps((prev) => prev + 1)}`. 숫자는 오르는데 누르는 동안 **모양 변화가 없어서** 폰에선 "죽은" 느낌.
@@K Step 2 - Show Pressed Feedback
- Pressable의 `style`은 **함수**가 될 수 있어요: `({ pressed }) => [styles.button, pressed && styles.pressed]`.
- 스타일 배열은 **왼쪽에서 오른쪽**으로 적용, pressed가 배경을 덮어씀. pressed가 false면 배열의 false는 무시.
- 손가락이 닿는 **순간** 어두워지고 떼면 원래대로. 모든 터치 대상에 필요한 **시각 피드백**.
@@K Step 3 - Log Every Press Event
- 이벤트 4개를 로그로 확인. `onPressIn`에서 로그를 **비우는** 이유: 모든 누름의 **첫 이벤트**라서. onPress는 마지막이라 거기서 비우면 앞의 두 개가 지워져요.
- 탭: In → Out → Press. 길게: In → LongPress → Out, **onPress 없음, 숫자 안 오름**. 길게 누르기는 탭에 **추가가 아니라 대체**. 보조 기능(컨텍스트 메뉴)용.
- 밖으로 빼고 떼기: In → Out만 → **이번 주 첫 번째 취소 가능한 제스처**.
@@K Finished Code
**완성 코드 해설**: `taps`, `events` state. Pressable에 style 함수 + 4개 이벤트. 이벤트 순서 표를 직접 확인할 수 있는 실험 앱이에요. Web에서 클릭/꾹 누르기로 해 보세요.
@@K Example: Hit Slop
- 손가락용 최소 크기: **iOS 44×44, Android 48**. 아이콘은 보통 더 작아요.
- 24포인트 닫기 버튼(빨간 테두리) → 바깥을 탭하면 안 됨.
- `hitSlop={20}` → 사방 20씩, 실제 터치 영역 **64×64**(24 + 20 + 20), 레이아웃은 그대로.
- 객체로 한쪽씩 `{ top: 10, bottom: 10 }`. 옆 대상과 겹치지 않게.
- Web은 hitSlop 무시 → 폰에서 확인.
@@K Scrolling
- 스크롤 = continuous. 관성(momentum): 튕기면 계속 가다 느려짐, 천천히 끌면 손가락만큼.
- 5주차 복습: ScrollView는 전부 한 번에(페이지용), FlatList는 화면 근처만(긴 목록, 서버 목록).
@@K Example: ScrollView
세로 페이지 + 그 안의 가로 카드 줄. 대부분 앱 홈 화면 구조.
@@K Starter Code
`Array.from({ length: 30 }, (_, i) => `Row ${i + 1}`)` 30개 문자열, 문자열 자체를 key로.
@@K Step 1 - Add a Horizontal Row
- **`horizontal`** 한 단어로 가로 스크롤.
- `contentContainerStyle`은 **안의 내용** 스타일이라 패딩이 카드와 같이 스크롤, `style`은 바깥 창.
- 옆으로 끌면 카드, 위로 끌면 페이지. 방향 맞는 스크롤뷰가 제스처를 가져가요.
- 같은 방향 중첩은 싸움, 세로 ScrollView 안 FlatList는 콘솔 경고.
@@K Finished Code
**완성 코드 해설**: 바깥 세로 ScrollView 안에 제목 + 가로 ScrollView(카드들) + 세로 줄 30개.
@@K Example: Pressable Rows in a FlatList
목록은 스크롤도, 줄 탭도 돼야 해요. RN이 판단: 안 움직이고 떼면 탭, 움직이면 스크롤(press 취소).
@@K Starter Code
5주차 FlatList, 평범한 줄 40개.
@@K Step 1 - Make the Rows Pressable
줄 View → Pressable + pressed 피드백. 폰에서 줄 위에서 스크롤을 시작하면 순간 회색이 됐다가 목록이 가져가며 원래대로 = **press 취소**.
@@K Step 2 - Select Rows
- 선택 상태는 **id 객체** `{ "3": true }`. `toggle`: `setSelected((prev) => ({ ...prev, [id]: !prev[id] }))` 복사 + 뒤집기, 함수형.
- `count`는 state가 아니라 **derived**(5주차 visible처럼).
- 스타일 순서: `[styles.row, selected[id] && styles.selected, pressed && styles.pressed]` → pressed가 마지막이라 선택된 줄에서도 누름 피드백.
- **`extraData={selected}`**: FlatList는 props가 안 바뀌면 줄을 다시 안 그려요. 줄 선택해도 `data`는 그대로라 "rows가 selected에도 의존한다"고 알려 줘야 해요. 이 예제는 renderItem이 인라인 함수라 우연히 동작하지만, memoized renderItem이면 선택이 안 보여요. **data 밖의 state를 읽으면 항상 extraData.**
@@K Finished Code
**완성 코드 해설**: `selected` 객체 state, `toggle` 함수, derived `count`, Pressable 줄 + 3단 스타일 배열, `extraData`. Test 3에 "선택 가능한 목록" 문제가 나오면 이 코드가 정답 패턴이에요.
@@K Swipe and Cancel
스와이프 = 가로 드래그. 조건: **취소 가능**(짧으면 원위치), **세로 스크롤을 막지 않기**(확실히 옆으로 갈 때만 가져가기). 폰 필요.
@@K Example: Drag and Snap Back
RN 내장 도구로 직접 만들어 보기: `PanResponder`(손가락 위치), `Animated`(다시 렌더링 없이 이동).
@@K Starter Code
안 움직이는 카드.
@@K Step 1 - Follow the Finger
- `const translateX = useRef(new Animated.Value(0)).current;` **useRef**: 일생 동안 같은 객체, `.current`가 값, 바꿔도 렌더링 안 함. 컴포넌트에 그냥 `new Animated.Value(0)`을 쓰면 렌더링마다 0으로 리셋.
- `PanResponder.create({...})`도 ref에.
- `gesture.dx` = 손가락이 내려간 뒤 옆으로 움직인 거리.
- `onMoveShouldSetPanResponder: (_, g) => Math.abs(g.dx) > 10` → 옆으로 10 넘어야 가져감(제스처 우선순위 한 줄 요약).
- `onPanResponderMove`: 움직일 때마다 offset 설정. state 없음, 렌더링 없음.
- 카드를 `Animated.View`로, `{...panResponder.panHandlers}` 펼치기, `transform: [{ translateX }]`로 이동.
- 놓으면 그 자리에 멈춤 → Step 2.
@@K Step 2 - Snap Back on Release
`onPanResponderRelease`에서 `Animated.spring(translateX, { toValue: 0, useNativeDriver: true }).start()` → 살짝 튕기며 복귀. 이제 **모든 스와이프가 취소**됨(안전한 기본값). 하지만 아무것도 실행 안 됨 → Step 3.
@@K Step 3 - Commit Past a Threshold
- `Math.abs(dx) > 120`이면 `Animated.timing`으로 화면 밖으로, 아니면 spring 복귀.
- `.start(() => setDismissed(true))` → **애니메이션이 끝난 뒤** state 변경.
- 짧게 = 복귀, 길게 = 날아감. 이게 **swipe and cancel**. 라이브러리는 **속도(velocity)** 도 봐서 짧아도 빠르게 튕기면 인정.
@@K Finished Code
**완성 코드 해설**: useRef(Animated.Value, PanResponder) + 세 콜백(ShouldSet, Move, Release) + 임계값 120 + dismissed state + Reset 버튼. 직접 구현 버전이라 개념 문제(useRef가 왜 필요한가, useNativeDriver란)에 대비하기 좋아요.
@@K Example: Swipe to Delete
실제 앱은 줄마다 PanResponder를 쓰지 않고 **React Native Gesture Handler**의 `Swipeable`을 써요. 따라오고, 짧으면 복귀, 길면 열림, 아래에 액션 표시.
@@K Starter Code
- FlatList 받은편지함, 줄은 `MessageRow` 컴포넌트.
- **MessageRow는 MyApp 바깥**에 선언. 안에 선언하면 렌더링마다 새 컴포넌트 → React가 옛 줄을 버리고 새로 만듦 → 스와이프 위치를 잃음.
- 줄 배경이 **흰색**인 이유: 삭제 버튼이 아래 깔려 있어서 투명하면 미리 보여요.
@@K Step 1 - Add the Gesture Root
`GestureHandlerRootView`로 바깥 View 교체(style 유지). Gesture Handler는 이 안에서만 작동, 앱 전체를 **한 번** 감싸기.
@@K Step 2 - Make the Rows Swipeable
- `<Swipeable renderRightActions={() => (삭제 패널)} overshootRight={false}>` 로 줄 감싸기.
- 왼쪽으로 조금 밀고 놓기 → 복귀(취소). 버튼 너비 절반 넘게 → 열린 채 유지.
- 위아래 드래그 → 목록 스크롤, 줄은 안 움직임.
@@K Step 3 - Delete the Message
- `remove(id)`: `setMessages((prev) => prev.filter((m) => m.id !== id))` 함수형.
- `onDelete={() => remove(item.id)}` prop으로 전달, MessageRow의 Delete 버튼에서 호출.
- 다 지우면 `ListEmptyComponent`.
- 스와이프는 **드러내기만**, 탭이 삭제. 파괴적 행동은 두 번의 의도적 동작. `onSwipeableOpen` 즉시 삭제는 되돌릴 수 있는 행동(archive)에만.
- Swipeable은 deprecated(대체: ReanimatedSwipeable), 하지만 추가 설정이 없어 배우기 쉬움.
@@K Finished Code
**완성 코드 해설**: GestureHandlerRootView > FlatList > (최상위 선언) MessageRow > Swipeable(renderRightActions = Delete Pressable). 삭제는 부모의 함수형 filter. ListEmptyComponent로 빈 상태.
@@K Touch UX Checklist
**터치 UX 체크리스트 6개 (그대로 서술형 문제로 나올 수 있어요)**
1. 터치 대상은 **44포인트 이상**, 작으면 `hitSlop`.
2. 손가락이 닿는 **순간** 피드백(pressed 스타일).
3. 제스처는 단순하게. 스와이프는 **지름길**이지 중요한 일의 **유일한** 방법이면 안 됨.
4. 제스처는 너그럽게: 짧은 스와이프는 취소, 줄에서 시작한 스크롤은 탭이 아님.
5. UI는 빠르게: 제스처는 매 프레임 실행되니 JS 스레드를 막지 말 것.
6. **실제 기기**에서 테스트. Web은 마우스, 사용자는 엄지.

@@TEXT
## ✅ Week 6 시험 대비 체크리스트

1. Discrete vs Continuous 제스처 예시?
2. Pressable이 대체한 옛 컴포넌트? → TouchableOpacity, TouchableHighlight 등
3. 탭 / 길게 누름 / 밖으로 빼고 떼기의 이벤트 순서? (0번 표)
4. long press 하면 onPress도 실행되나? → 아니요, **대체**
5. 누르는 동안 스타일 바꾸기? → `style={({ pressed }) => [...]}`
6. 최소 터치 크기? → iOS 44, Android 48 / `hitSlop`
7. hitSlop={20}인 24pt 버튼의 실제 터치 영역? → 64×64
8. Web에서 안 되는 것? → hitSlop, 관성, 스와이프, Alert, android_ripple(Android만)
9. ScrollView vs FlatList 선택 기준?
10. 가로 스크롤? → `horizontal`
11. 중첩 스크롤이 괜찮은 조건? → 방향이 다를 때
12. 스크롤과 탭을 RN이 구분하는 방법? → 움직이면 스크롤(press 취소), 안 움직이면 탭
13. `extraData`가 필요한 때? → 줄이 data 밖의 state를 읽을 때
14. useRef vs useState? → 같은 객체 유지, 바뀌어도 렌더링 안 함 / 바뀌면 렌더링
15. PanResponder 콜백 3개와 역할?
16. `useNativeDriver: true`? → 네이티브에서 애니메이션, JS가 바빠도 부드러움
17. spring vs timing?
18. 스와이프의 두 조건? → 취소 가능, 세로 스크롤 방해 X
19. GestureHandlerRootView는 어디에? → 앱 전체를 한 번
20. 행 컴포넌트를 바깥에 선언하는 이유?
21. 스와이프 즉시 삭제를 피하는 이유?

**손으로 써 보기 과제**: "할 일 목록". 줄을 탭하면 완료 토글(Pressable + extraData), 길게 누르면 삭제, pressed 피드백, 작은 ★ 아이콘에 hitSlop. 보지 않고 써 본 뒤 비교하세요.

```jsx
import { useState } from "react";
import { View, Text, FlatList, Pressable, StyleSheet } from "react-native";

const START = [
  { id: "1", title: "Read week 6 notes", done: false, star: false },
  { id: "2", title: "Practice FlatList", done: true, star: false },
  { id: "3", title: "Try swipe on my phone", done: false, star: true },
];

export default function App() {
  const [todos, setTodos] = useState(START);
  const [lastEvent, setLastEvent] = useState("Tap a row, or hold it to delete");

  const toggleDone = (id) =>
    setTodos((prev) => prev.map((t) => (t.id === id ? { ...t, done: !t.done } : t)));
  const toggleStar = (id) =>
    setTodos((prev) => prev.map((t) => (t.id === id ? { ...t, star: !t.star } : t)));
  const remove = (id) => setTodos((prev) => prev.filter((t) => t.id !== id));

  return (
    <View style={styles.container}>
      <Text style={styles.status}>{lastEvent}</Text>
      <FlatList
        data={todos}
        keyExtractor={(item) => item.id}
        extraData={todos}
        renderItem={({ item }) => (
          <Pressable
            onPress={() => {
              toggleDone(item.id);
              setLastEvent(`Tapped: ${item.title}`);
            }}
            onLongPress={() => {
              remove(item.id);
              setLastEvent(`Deleted: ${item.title}`);
            }}
            style={({ pressed }) => [styles.row, item.done && styles.done, pressed && styles.pressed]}
          >
            <Text style={[styles.title, item.done && styles.doneText]}>{item.title}</Text>
            <Pressable hitSlop={20} onPress={() => toggleStar(item.id)}>
              <Text style={styles.star}>{item.star ? "★" : "☆"}</Text>
            </Pressable>
          </Pressable>
        )}
        ListEmptyComponent={<Text>All done!</Text>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingTop: 60, paddingHorizontal: 16 },
  status: { marginBottom: 12, color: "#555" },
  row: { flexDirection: "row", alignItems: "center", padding: 16, backgroundColor: "#fff", borderBottomWidth: 1, borderColor: "#eee" },
  done: { backgroundColor: "#eef7ee" },
  pressed: { backgroundColor: "#ddd" },
  title: { flex: 1, fontSize: 16 },
  doneText: { textDecorationLine: "line-through", color: "#888" },
  star: { fontSize: 14 },
});
```

**해설**: 줄 전체는 Pressable(탭 = 완료, 길게 = 삭제). 별은 작은 글자라 `hitSlop={20}`으로 누르기 쉽게 했어요. 별의 Pressable이 안쪽에 있어서 별을 누르면 별만 반응해요. 스타일 배열에서 `pressed`가 마지막이라 완료된 줄에서도 누름 피드백이 보여요.
