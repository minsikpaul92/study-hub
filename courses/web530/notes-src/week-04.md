# Week 4. Navigation: 여러 화면 오가기 (Stack, Tab, Drawer, 중첩, 화면 간 State)

> 이 노트 읽는 법: **📘/💻/🧪 원문**(영어 그대로) 바로 밑에 **🇰🇷 한글 해설**이 있어요. 코드 밑의 **▶ Snack에서 바로 실행하기**를 누르면 그 코드가 Expo Snack에서 열려요. 이번 주 Snack 링크에는 React Navigation 패키지(버전 7, SDK 54용)가 자동으로 들어가 있어요. **SDK는 54 그대로** 두세요. 55에서는 안 돌아가요.

> 🧭 **챕터 읽는 순서**: 챕터마다 맨 앞의 **🧭 먼저 한국어로** 상자(구성과 할 일) → 원문 출처 → 영어 원문 → ▶ Snack → 🇰🇷 한글 해설이에요. 코드 위에 **⌨️**가 있으면 직접 쳐 볼 코드이고, 없으면 읽기만 하거나 **👀 여기서 결과 보기**로 결과만 확인하면 돼요.

## 0. 이번 주 한눈에 보기

웹은 URL과 뒤로 가기 버튼이 공짜로 있지만, 앱은 **화면 이동을 전부 JavaScript로 관리**해야 해요. 그 표준 도구가 **React Navigation**이에요.

**기본 뼈대 (외우세요)**
```jsx
const Stack = createNativeStackNavigator();       // 1. 컴포넌트 바깥에서 한 번 생성
<NavigationContainer>                              // 2. 앱에 딱 하나, 가장 바깥
  <Stack.Navigator initialRouteName="Home">        // 3. 내비게이터
    <Stack.Screen name="Home" component={Home} />  // 4. 화면 등록 (name ↔ component)
  </Stack.Navigator>
</NavigationContainer>
```

**내비게이터 3종 비교**
| | Stack | Bottom Tabs | Drawer |
| --- | --- | --- | --- |
| 생성 함수 | `createNativeStackNavigator()` | `createBottomTabNavigator()` | `createDrawerNavigator()` |
| 패키지 | `@react-navigation/native-stack` | `@react-navigation/bottom-tabs` | `@react-navigation/drawer` |
| 모양 | 카드 더미처럼 위로 쌓임, 뒤로 가기 화살표 | 아래 탭 바, 뒤로 가기 없음 | 옆에서 나오는 메뉴(햄버거 아이콘) |
| 이전 화면 state | pop되면 **사라짐**(unmount) | 탭 바꿔도 **유지**(mounted) | |

**스택 이동 메서드 (시험 단골 표)**
| 메서드 | 하는 일 | 비유 |
| --- | --- | --- |
| `navigate('X')` | 이미 X에 있으면 그대로(params만 갱신), 아니면 push | "X로 가 줘" |
| `push('X')` | **무조건 새 복사본**을 위에 쌓음 | 같은 카드 한 장 더 올리기 |
| `goBack()` | 한 장 빼기(pop) | 뒤로 가기 |
| `popTo('X')` | X가 맨 위가 될 때까지 빼기 | X까지 되감기 |
| `popToTop()` | 첫 화면까지 전부 빼기 | 처음으로 (로그아웃 후) |

**최대 함정**: 아래에 있는 Home으로 돌아가려고 `navigate('Home')`을 쓰면 돌아가는 게 아니라 **Home 복사본을 하나 더 쌓아요.** 돌아갈 땐 `goBack()`이나 `popTo('Home')`.

**params 공식**: 보내기 `navigation.navigate('Details', { id: 1 })` / 받기 `const { id = 0 } = route.params ?? {};`

{{PRACTICE}}

{{TOC}}

@@NOTE D-Navigation/navigating.md
@@S _doc | read
Stack, Tab, Drawer 내비게이터와 화면 이동 방법을 정리한 글이에요. 💻 4.1 예제에서 단계별로 직접 쳐 보니까 여기서는 읽고 개념만 잡으면 돼요.
@@K Testing Navigation in Snack
코스노트 예제를 Snack에서 돌리려면 `package.json`을 이 내용으로 바꾸라는 안내예요. React Navigation은 **버전 7**에 맞춰 쓰여 있고, 나머지 패키지(screens, safe-area-context, gesture-handler, reanimated 등)는 **Expo SDK 54**와 버전이 맞아야 해요. 이 노트의 Snack 링크는 필요한 패키지를 이미 넣어 두었어요.

@@K Introduction to Navigation
**왜 Navigation 라이브러리가 필요해?** 앱도 화면, 화면 전환, 뒤로 가기 기록(history), **deep linking**(링크를 누르면 앱의 특정 화면이 바로 열리는 것)이 필요한데 RN에는 내장된 게 없어요. 커뮤니티 표준이 **React Navigation**.

첫 예제 해설:
- 지금까지는 컴포넌트 하나가 JSX를 바로 return 했는데, 이제는 **내비게이션 트리**를 정의해요.
- `createNativeStackNavigator()`로 스택을 만들고 `NavigationContainer`로 감싸요. 컨테이너는 앱 전체의 **내비게이션 state**를 관리해요.
- **Stack = 카드 더미**. 새 화면은 위에 **push**, 뒤로 가면 **pop**.
- `<Stack.Screen name="Home" component={Home} />` 에서 `name`이 **route 이름**. 등록된 화면은 `navigation` prop을 **자동으로** 받아요.
- `navigation.navigate('Settings')` 로 이동, `navigation.goBack()` 으로 복귀.
- `initialRouteName`이 첫 화면. 없으면 **첫 번째로 적은 화면**.
- 헤더 바와 Android 뒤로 가기 버튼은 내비게이터가 **자동으로** 처리.

@@K Passing data between screens
**화면 사이에 데이터 넘기기** (쇼핑앱에서 상품을 누르면 그 상품 상세가 나오는 것처럼).
- 보내기: `navigation.navigate('Details', { title: 'First Item' })` → **두 번째 인자 객체**.
- 받기: 목적지 화면의 **`route` prop** → `route.params`.
- `const { title = 'Unknown Item' } = route.params ?? {};`
  - `??` (nullish coalescing): 왼쪽이 `null`이나 `undefined`면 오른쪽 사용.
  - params 없이 열리면(첫 화면이거나 deep link) `route.params`는 `undefined` → 그걸 구조 분해하면 **앱이 터져요**. 그래서 `?? {}` 로 빈 객체 대체 + 기본값.
- 원문 규칙: **"Always treat params as optional."** params는 항상 없을 수도 있다고 생각하라.

@@K Customizing navigation header bars
**헤더 꾸미기**: `<Stack.Screen options={...}>`
- `options`에 **함수**를 주면 `({ route }) => ({ ... })` 처럼 route를 받아서 params로 헤더를 만들 수 있어요.
- `title: route.params?.title ?? 'Details'` → `?.`(optional chaining): params가 없으면 에러 대신 undefined.
- `headerRight: () => <Button .../>` → 헤더 오른쪽에 버튼. 여기선 재고(qtyAvail)가 0이면 Buy 비활성화.
- 함수 리턴에서 객체를 바로 돌려줄 때 `({ ... })` 처럼 **괄호로 감싸요**. 안 감싸면 `{}`를 함수 본문으로 착각해요.

@@K Updating params
`navigation.setParams({ title: 'Super Widget' })` → **현재 화면**의 params를 바꿔요. params를 읽는 곳(헤더 options 포함)이 **자동으로 업데이트**. 그리고 **merge(합치기)** 라서 언급 안 한 params는 그대로 유지.

@@K Moving through the stack
위 0번의 "스택 이동 메서드" 표가 바로 이 표예요. 예제에서 버튼을 하나씩 눌러 보며 헤더의 뒤로 가기 화살표를 관찰하세요.
- **Navigate to next level**: 이미 Level 화면에 있으니 **숫자만 바뀜**(새 화면 X).
- **Push next level**: 새 Level 화면이 쌓여서 뒤로 가기를 그만큼 더 눌러야 함.
- 마지막 문단 = 최대 함정: 아래쪽 Home으로 `navigate('Home')`하면 **Home이 하나 더 쌓임**. `goBack()`이나 `popTo('Home')` 사용.

@@K The useNavigation hook
**`navigation` prop은 Stack.Screen으로 등록된 "화면"만 받아요.** 화면 안에 있는 일반 컴포넌트(재사용 버튼 등)는 못 받아요.
- 해결: `const navigation = useNavigation();` (`@react-navigation/native`에서 import)
- 안 쓰면 Home이 `navigation`을 props로 버튼까지 계속 내려 줘야 해요(prop drilling).

@@K Tab and drawer navigators
**Tab**: 앱의 큰 섹션(최상위)용. **Drawer**: 옆에서 나오는 메뉴. 둘 다 모든 플랫폼에서 쓸 수 있어요.

예제는 3주차 `Platform.select()`로 **플랫폼마다 다른 내비게이터**를 골라요: iOS = 탭, Android = 드로어, 그 외(web) = 스택. (필수는 아니고 시연용)
- `Platform.select`가 고른 건 **JSX를 돌려주는 함수**라서 `{Navigator()}` 처럼 **호출**해서 넣어요.
- `tabBarIcon: ({ color, size }) => <Ionicons name="home" color={color} size={size} />` → 탭 바가 원하는 색과 크기를 받아서 아이콘을 그리는 **함수**. 선택된 탭은 색이 바뀌어요. 없으면 placeholder 기호가 나와요.

**결론 문단 (시험 문장)**: 세 내비게이터는 생성 함수만 다르고, `<X.Navigator>`, `<X.Screen>` JSX와 화면이 받는 `navigation`, `route` props는 **똑같다.** "Navigators differ in how they look and behave, not in how you write screens."

@@K Nesting navigators
**내비게이터 중첩** = 한 내비게이터를 다른 내비게이터의 **Screen 안에** 넣기. 실제 앱은 거의 다 이렇게 해요.

4가지 패턴:
- **Stack → Tabs**: 스택 안에 탭. 상세 화면이 **탭 바 위를 덮음**.
- **Tabs → Stack**: 각 탭이 자기 스택을 가짐. **탭 바가 계속 보임**. (대부분 앱의 방식, Lab 4가 이것)
- **Drawer → Tabs → Stack**: 큰 앱에서 흔함.
- **Stack → Drawer**: 로그인 후에만 드로어.

**예제 1 (Stack → Tabs)** 해설:
- `MainTabs`(탭 내비게이터를 return 하는 컴포넌트)를 스택의 `Main` 화면으로 등록. `options={{ headerShown: false }}`로 스택 헤더 숨김(안 숨기면 헤더 2개).
- Feed에서 `navigate('Post')`: 탭 내비게이터에 Post가 없으니 **부모 스택으로 올라가서** 찾음 → Post가 탭 위에 쌓임. **위로 찾아가는 건 자동.**
- Post에서 Account 탭으로 가려면? Account는 **안쪽(자식)** 탭 내비게이터에 있어서 그냥 이름으로는 못 찾아요(현재 내비게이터와 **부모만** 찾음). → **부모 화면 이름 먼저, 안쪽 화면은 `screen`으로**: `navigation.popTo('Main', { screen: 'Account' })`.
- 왜 popTo? Main이 Post **아래**에 있으니까. `navigate('Main', ...)`를 쓰면 탭 복사본이 또 쌓이는 함정.

**예제 2 (Tabs → Stack)** 해설:
- `MessagesStack`(스택을 return)을 탭의 `Messages` 화면으로. 탭 바가 Thread 화면에서도 **계속 보여요**.
- 탭도 헤더를 그리고 스택도 헤더를 그려서 **헤더 2개**가 됨 → Messages 탭에 `headerShown: false`. 스택 헤더(뒤로 가기 화살표 있음)만 남겨요. Contacts 탭은 스택이 없으니 탭 헤더 유지.
- Contacts(스택 바깥)에서 Thread 열기: `navigation.navigate('Messages', { screen: 'Thread', params: { from: 'Sam' } })` → **탭 이름 → 안쪽 화면 이름 → params**. 탭 내비게이터는 push를 안 하니까 여기선 navigate가 맞아요(탭 전환 + 안쪽 스택이 Thread를 엶).

@@NOTE D-Navigation/handling-state.md
@@S _doc | read
여러 화면이 같은 데이터를 나눠 쓰는 방법이에요. 💻 4.1 "Handling State Across Screens"에서 Jotai로 직접 쳐 봐요.
@@K _pre
**여러 화면이 같이 쓰는 state**는 어떻게? React Navigation에는 **내비게이션 전용 state API가 없어요.** 그냥 일반 React 방식(2주차)을 써요. 여기서는 **Jotai**.

예제 해설:
- `itemsAtom = atom({ first: 5, second: 0, third: 15 })` → 재고 수량을 전역 atom으로.
- `ItemList`는 `useAtom(itemsAtom)`으로 읽어서 버튼 제목에 `(5)` 같은 수량 표시.
- `BuyButton`은 **헤더**에 들어가는 컴포넌트. 같은 atom을 읽고 쓰기.
- `setItems((prev) => ({ ...prev, [id]: Math.max(0, prev[id] - 1) }))` 한 줄씩 뜯어보면:
  - `(prev) => ...` 함수형 업데이트 (이전 값 기반)
  - `{ ...prev }` 기존 객체를 **복사** (state는 직접 수정하면 안 되고 **새 객체**를 만들어야 다시 그려져요)
  - `[id]: ...` **계산된 속성 이름**. id가 'first'면 `first: ...`
  - `Math.max(0, x)` 0 아래로 안 내려가게
- `disabled={qty === 0}` 재고 0이면 회색.
- 원문 팁: App에 state를 올려서(lifting) props로 내려도 되지만, 화면은 **내가 아니라 내비게이터가 렌더링**해서 props 전달이 번거로워요. Jotai가 더 깔끔.

@@LEC week-04.1-notes.md
@@S _doc | type
4.1 수업 라이브 코딩이에요. Starter Code에서 시작해 Step 순서대로 고쳐 가요. ⌨️ 표시된 코드는 Snack에서 직접 쳐 보세요.
@@S React Native Playground | skim
수업 전에 Snack의 package.json을 바꾸라는 안내예요. 링크에는 이미 들어 있어요.
@@S Why Navigation? | read
웹과 달리 앱은 화면 이동과 기록을 JS로 관리해야 해요.
@@S Example: The NavigationContainer | read
NavigationContainer 규칙 3개가 시험 포인트예요.
@@S Example: Stack Navigator | type
스택 = 카드 더미. Starter Code부터 Step 5까지 이어서 쳐 보세요.
@@S Starter Code | type
할 일: Home, Settings 화면이 있는 시작 코드 쳐 두기
화면과 버튼은 있고 연결만 안 된 상태예요.
@@S Step 1 - Import the Navigation Pieces | type
할 일: NavigationContainer, createNativeStackNavigator import
core 패키지와 stack 패키지에서 가져와요.
@@S Step 2 - Create the Stack | type
할 일: 컴포넌트 바깥 맨 위에 const Stack = createNativeStackNavigator()
컴포넌트 안에서 만들면 안 돼요.
@@S Step 3 - Register the Screens | type
할 일: NavigationContainer > Stack.Navigator > Stack.Screen name, component={HomeScreen}
component에는 컴포넌트 자체를 넘겨요. <HomeScreen />이 아니에요.
@@S Step 4 - Navigate Forward | type
할 일: HomeScreen({ navigation })에서 navigation.navigate("Settings")
navigate의 문자열은 Screen name과 정확히 같아야 해요.
@@S Step 5 - Go Back | type
할 일: Settings에 navigation.goBack() 버튼
goBack은 헤더 뒤로 가기 화살표와 같은 일을 해요.
@@S Example: Navigate vs Push | type
이미 열린 화면을 부를 때 navigate와 push가 달라져요.
@@S Step 1 - Make Room for More Buttons | type
할 일: 버튼을 감싼 View에 gap: 8
버튼 간격만 정리해요.
@@S Step 2 - Navigate to the Screen You Are On | type
할 일: Settings에서 navigate("Settings") 버튼 추가
이미 거기 있으면 아무 일도 안 일어나요.
@@S Step 3 - Push the Screen You Are On | type
할 일: Settings에서 push("Settings") 버튼 추가
push는 항상 복사본을 쌓아요.
@@S Step 4 - Navigate to a Screen Below You | type
할 일: Settings에서 navigate("Home") 버튼 추가
함정이에요. 원래 Home으로 돌아가지 않고 새 Home이 쌓여요.
@@S Example: Going Back | type
뒤로 가는 방법 3가지(goBack, popTo, popToTop)예요.
@@S Step 1 - Go Back One Screen | read
goBack은 한 장만 빼요.
@@S Step 2 - Fix the Navigate to Home Trap | type
할 일: navigation.popTo("Home") 버튼
Home이 맨 위가 될 때까지 빼서 원래 Home으로 가요.
@@S Step 3 - Pop to the Top | type
할 일: navigation.popToTop() 버튼
스택의 첫 화면까지 한 번에 가요.
@@S Example: The useNavigation Hook | type
화면이 아닌 컴포넌트는 useNavigation 훅으로 navigation을 얻어요.
@@S Step 1 - Move the Button into Its Own Component | type
할 일: SettingsButton 컴포넌트로 분리하고 에러 확인
등록된 화면이 아니라 navigation prop을 못 받아요.
@@S Step 2 - Import the Hook | type
할 일: import에 useNavigation 추가
이 단계 코드를 직접 쳐 보세요.
@@S Step 3 - Call the Hook | type
할 일: SettingsButton 첫 줄에 const navigation = useNavigation()
Hook은 컴포넌트 안에서만 불러요.
@@S Step 4 - Clean Up HomeScreen | type
할 일: HomeScreen 파라미터에서 navigation 지우기
이 단계 코드를 직접 쳐 보세요.
@@S Example: Passing Params | type
params = 다음 화면에 넘기는 데이터예요.
@@S Step 1 - Remove the Navigate to Settings Button | type
할 일: 이전 예제용 버튼 지우기
이 단계 코드를 직접 쳐 보세요.
@@S Step 2 - Send a Param | type
할 일: navigation.navigate("Settings", { level: 1 })
params는 두 번째 인자 객체로 보내요.
@@S Step 3 - Read the Param | type
할 일: SettingsScreen({ navigation, route })에서 route.params.level 읽기
받는 쪽은 route.params예요.
@@S Step 4 - Push the Next Level | type
할 일: push("Settings", { level: level + 1 })
이 단계 코드를 직접 쳐 보세요.
@@S Step 5 - Show the Crash, Then Fix It | type
할 일: initialRouteName="Settings"로 크래시 보고 const { level = 1 } = route.params ?? {}로 고치기
params 없이 열리면 undefined를 구조분해해서 크래시가 나요.
@@S Step 6 - Update the Current Screen's Params | type
할 일: navigation.setParams({ level: 1 }) 버튼
이동 없이 지금 화면의 params만 바꿔요.
@@S Example: Customizing the Header | type
헤더 모양과 제목, 버튼을 바꿔요.
@@S Step 1 - Style Every Header | type
할 일: Stack.Navigator screenOptions에 headerStyle, headerTintColor
모든 화면에 적용돼요.
@@S Step 2 - Give Home a Title | type
할 일: Home Screen에 options={{ title: "..." }}
화면 하나에만 적용되고 screenOptions보다 우선해요.
@@S Step 3 - Put the Level in the Header | type
할 일: options={({ route }) => ({ title: `Settings Level ${...}` })}
params를 쓰려면 options를 함수로 줘요.
@@S Step 4 - Add a Header Button | type
할 일: options 함수에서 headerRight: () => <Button />
이 단계 코드를 직접 쳐 보세요.
@@S Example: Tab Navigator | type
탭 바는 항상 보이고, 스택과 같은 Navigator와 Screen 패턴을 써요.
@@S Starter Code | type
할 일: 카운터가 있는 Home과 Settings 시작 코드 쳐 두기
이 단계 코드를 직접 쳐 보세요.
@@S Step 1 - Import the Navigation Pieces | type
할 일: createBottomTabNavigator import
@react-navigation/bottom-tabs 패키지예요.
@@S Step 2 - Create the Tabs | type
할 일: const Tab = createBottomTabNavigator()
이 단계 코드를 직접 쳐 보세요.
@@S Step 3 - Register the Screens | type
할 일: NavigationContainer > Tab.Navigator > Tab.Screen 두 개
탭에는 뒤로 가기 화살표가 없어요.
@@S Step 4 - Show That Tabs Keep Their State | read
탭은 다른 탭으로 가도 state가 남아요. 스택에서 pop된 화면은 사라져요.
@@S Step 5 - Add Icons | type
할 일: Ionicons import + options={{ tabBarIcon: ({ color, size }) => ... }}
이 단계 코드를 직접 쳐 보세요.
@@S Step 6 - Colour the Selected Tab | type
할 일: screenOptions={{ tabBarActiveTintColor: "purple" }}
이 단계 코드를 직접 쳐 보세요.
@@S Example: Drawer Navigator | read
옆에서 나오는 메뉴예요. 실행해서 모양만 확인해요.
@@S Example: Choosing a Navigator per Platform | read
Platform.select로 플랫폼마다 다른 내비게이터를 골라요.
@@S Example: Nesting Navigators | read
스택 안에 탭을 넣는 중첩 패턴이에요.
@@S Example: Handling State Across Screens | type
params는 한 방향뿐이라 여러 화면이 함께 바꾸는 데이터는 Jotai로 공유해요.
@@S Starter Code | type
할 일: stock 객체와 Home, Details, BuyButton 시작 코드 쳐 두기
이 단계 코드를 직접 쳐 보세요.
@@S Step 1 - Import Jotai | type
할 일: import { atom, useAtom } from "jotai"
이 단계 코드를 직접 쳐 보세요.
@@S Step 2 - Turn the Object into an Atom | type
할 일: const stockAtom = atom({ ... })
이 단계 코드를 직접 쳐 보세요.
@@S Step 3 - Read the Atom in HomeScreen | type
할 일: HomeScreen에 const [stock] = useAtom(stockAtom)
이 단계 코드를 직접 쳐 보세요.
@@S Step 4 - Read the Atom in DetailsScreen | type
할 일: DetailsScreen에도 같은 한 줄
이 단계 코드를 직접 쳐 보세요.
@@S Step 5 - Read and Update the Atom in BuyButton | type
할 일: const [stock, setStock] = useAtom(stockAtom) + 함수형 setStock으로 하나 줄이기
이 단계 코드를 직접 쳐 보세요.
@@S Step 6 - Show That Every Screen Stays in Sync | read
Buy를 누르면 모든 화면 숫자가 같이 바뀌는지 확인해요.
@@K React Native Playground
수업 시작 전에 Snack의 `package.json`을 이 내용으로 **교체**하라는 안내. 버전 7 고정 이유: 7에서 `navigate()` 동작이 바뀌어서 옛날 튜토리얼과 다르게 보일 수 있어요. jotai는 마지막 예제용.
@@K Why Navigation?
웹은 URL + 뒤로 가기가 공짜, RN은 화면, 전환, 기록을 **전부 JS로** 관리해야 해요.
@@K Example: The NavigationContainer
**NavigationContainer 규칙 3개** (시험 포인트)
1. 가장 **바깥** 내비게이션 컴포넌트여야 함.
2. 앱에 **딱 하나**. 중첩된 내비게이터는 자기 컨테이너가 필요 없어요.
3. 웹 React의 router 같은 역할.
@@K Example: Stack Navigator
카드 더미 비유. 앞으로 가면 push, 뒤로 가면 pop. 모바일 앱에서 **가장 흔한** 패턴. 아래 Step을 따라 Starter Code를 완성해 가요.
@@K Starter Code
화면(Home, Settings), 버튼, 스타일은 다 있고 **연결만 안 된** 상태. 지금은 MyApp이 HomeScreen을 그냥 보여 줘요.
@@K Step 1 - Import the Navigation Pieces
`NavigationContainer`는 core 패키지(`@react-navigation/native`), `createNativeStackNavigator`는 stack 패키지에서 import.
@@K Step 2 - Create the Stack
`const Stack = createNativeStackNavigator();` 를 **컴포넌트 바깥, 맨 위**에 한 번. 컴포넌트 안에서 만들면 렌더링마다 새 내비게이터가 생겨요. 결과물은 `Stack.Navigator`와 `Stack.Screen`을 가진 객체.
@@K Step 3 - Register the Screens
- `name`(route 이름) ↔ `component`(컴포넌트) 연결.
- **`component={HomeScreen}`** 처럼 컴포넌트 **자체**를 넘겨요. `component={<HomeScreen />}` 아님! 언제 그릴지는 내비게이터가 정해요. (시험 함정)
- 헤더 제목은 기본으로 route 이름("Home").
@@K Step 4 - Navigate Forward
- 등록된 화면은 `navigation` prop을 자동으로 받으니 `function HomeScreen({ navigation })` 으로 꺼내요.
- `navigation.navigate("Settings")` 문자열은 Step 3의 `name`과 **정확히** 같아야 해요. 오타면 화면엔 아무 일도 없고 콘솔에 `NAVIGATE` action "was not handled by any navigator" 메시지.
- Settings 헤더에 뒤로 가기 화살표가 **자동으로** 생겨요.
@@K Step 5 - Go Back
`navigation.goBack()` = pop. 헤더 화살표와 같은 일. 디자인상 필요할 때만 직접 버튼을 만들면 돼요.
@@K Finished Code
**완성 코드 해설**: import 2줄 → `Stack` 생성 → 화면 컴포넌트(각자 `{ navigation }` 받음) → `MyApp`에서 Container > Navigator > Screen 2개. 이 뼈대가 이번 주 모든 예제의 출발점이에요. 빈 Snack에서 **보지 않고** 이 코드를 써 볼 수 있으면 4주차 50%는 끝!
@@K Example: Navigate vs Push
`navigate()`와 `push()`는 **이미 열린 화면**을 부를 때 차이가 나요.
@@K Step 1 - Make Room for More Buttons
`gap: 8`로 버튼 간격.
@@K Step 2 - Navigate to the Screen You Are On
Settings에서 `navigate("Settings")` → **아무 일도 안 일어남**. 이미 거기 있으니까.
@@K Step 3 - Push the Screen You Are On
`push("Settings")` → **항상 복사본 추가**. 3번 누르면 Home까지 뒤로 가기를 **4번** 눌러야 해요(Settings 4장).
@@K Step 4 - Navigate to a Screen Below You
**함정!** 아래에 있는 Home으로 `navigate("Home")` → 돌아가는 게 아니라 **Home 2호**가 쌓임. 증거: 이 Home에는 **뒤로 가기 화살표**가 있어요(원래 Home은 맨 아래라 화살표 없음). `push()`는 상품 → 관련 상품 → 관련 상품... 같은 **drill-down** 흐름에 적합.
@@K Finished SettingsScreen
버튼 4개(Go Back, Navigate to Settings, Push Settings, Navigate to Home)를 비교하는 화면. 직접 눌러 보며 스택 깊이를 세어 보세요.
@@K Example: Going Back
뒤로 가는 방법 3가지: `goBack()`, `popTo()`, `popToTop()`.
@@K Step 1 - Go Back One Screen
`goBack()` = 한 장만 pop. 브라우저 뒤로 가기, 헤더 화살표와 같아요. 복사본끼리 구분이 안 되는 문제는 params로 해결(두 예제 뒤).
@@K Step 2 - Fix the Navigate to Home Trap
`navigation.popTo("Home")` → Home이 맨 위가 될 때까지 pop. 한 번에 원래 Home으로, **뒤로 가기 화살표 없음** = 진짜 원래 Home.
@@K Step 3 - Pop to the Top
`popToTop()` → 스택의 **첫 화면**까지. 로그아웃 후에 유용. 여기선 Home이 첫 화면이라 popTo("Home")과 결과가 같지만, `popTo`는 **이름 지정**, `popToTop`은 **항상 첫 화면**.
@@K Finished SettingsScreen
버튼: Go Back / Navigate to Settings / Push Settings / Pop to Home / Pop to Top. 표로 정리한 5개 메서드를 한 화면에서 비교할 수 있어요.
@@K Example: The useNavigation Hook
화면만 `navigation` prop을 받아요. 재사용 버튼(화면 아님)은 `useNavigation()` 훅으로 같은 객체를 얻어요.
@@K Step 1 - Move the Button into Its Own Component
버튼을 `SettingsButton` 컴포넌트로 분리 → 누르면 **`navigation` is not defined** 에러. 등록된 Screen이 아니라서 prop을 못 받으니까.
@@K Step 2 - Import the Hook
기존 `@react-navigation/native` import에 `useNavigation` 추가.
@@K Step 3 - Call the Hook
`const navigation = useNavigation();` 를 컴포넌트 첫 줄에. Hook은 **컴포넌트 안에서만** 호출 가능(useState와 같은 규칙).
@@K Step 4 - Clean Up HomeScreen
HomeScreen은 이제 navigation을 안 쓰니 파라미터에서 제거.
@@K Finished Code
**완성 코드 해설**: `SettingsButton`이 `useNavigation()`으로 스스로 이동. HomeScreen은 그냥 `<SettingsButton />`만 렌더링. props 전달 없음.
@@K Example: Passing Params
params = 다음 화면에 넘기는 데이터. `navigate()`/`push()`의 **두 번째 인자** 객체 → 받는 쪽은 `route.params`. 이번엔 Settings 복사본마다 `level`을 줘서 구분해요.
@@K Step 1 - Remove the Navigate to Settings Button
이전 예제용 버튼 정리.
@@K Step 2 - Send a Param
`navigation.navigate("Settings", { level: 1 })`. params는 문자열, 숫자, 배열, 객체 무엇이든 가능.
@@K Step 3 - Read the Param
화면은 `navigation` 옆에 **`route`** prop도 받아요. `function SettingsScreen({ navigation, route })` → `route.params.level`.
@@K Step 4 - Push the Next Level
`push("Settings", { level: level + 1 })`. 몇 번 push 후 Go Back 하면 숫자가 하나씩 줄어요.
@@K Step 5 - Show the Crash, Then Fix It
`initialRouteName="Settings"`로 바꾸면 params 없이 열려서 **크래시**(undefined를 구조 분해). 고치기: `const { level = 1 } = route.params ?? {};`
@@K Step 6 - Update the Current Screen's Params
`navigation.setParams({ level: 1 })` → 이동 없이 **현재 화면** params만 변경 + 다시 렌더링. merge 방식. 뒤로 가기 횟수는 그대로(스택 안 바뀜).
@@K Finished Code
**완성 코드 해설**: SettingsButton이 `{ level: 1 }` 전달 → SettingsScreen이 안전하게 읽고(`?? {}` + 기본값), Push로 level+1, Reset으로 setParams. **params 3종 세트**(보내기, 안전하게 받기, 현재 화면 수정)가 다 들어 있어요.
@@K Example: Customizing the Header
`options`는 **객체**도 되고 **route를 받는 함수**도 돼요. params를 읽으려면 함수.
@@K Step 1 - Style Every Header
`<Stack.Navigator screenOptions={{ ... }}>` → **모든 화면**에 적용. `headerStyle: { backgroundColor }` 헤더 배경, `headerTintColor` 제목과 **뒤로 가기 화살표** 색.
@@K Step 2 - Give Home a Title
`<Stack.Screen options={{ title: "..." }}>` → 그 **화면 하나**만. `screenOptions`보다 **우선**.
@@K Step 3 - Put the Level in the Header
`options={({ route }) => ({ title: `Settings Level ${route.params?.level ?? 1}` })}` 처럼 함수로. setParams를 하면 options 함수가 **다시 실행**돼서 헤더도 바뀌어요.
@@K Step 4 - Add a Header Button
options 함수는 `navigation`도 받아요: `({ navigation, route }) => ({ headerRight: () => <Button ... /> })`.
- `headerRight`: 헤더 오른쪽에 아무 컴포넌트.
- `headerLeft`: 왼쪽. 단 **뒤로 가기 화살표를 대체**해요.
- `headerShown: false`: 헤더 완전히 숨김(중첩 예제에서 다시 나옴).
@@K Finished Code
**완성 코드 해설**: 변경은 `MyApp`만. Navigator의 `screenOptions`(전체 보라색 헤더) + Home의 `options` 객체(title) + Settings의 `options` 함수(level 제목 + headerRight Reset 버튼, level 1이면 disabled).
@@K Example: Tab Navigator
탭 = 앱의 최상위 섹션, 탭 바는 **항상 보임**. 스택과 같은 Navigator/Screen 패턴, 생성 함수만 다름.
@@K Starter Code
새 앱. Home에 카운터가 있는 이유는 탭을 바꿔도 state가 유지되는지 보려고.
@@K Step 1 - Import the Navigation Pieces
`createBottomTabNavigator`는 `@react-navigation/bottom-tabs` 패키지.
@@K Step 2 - Create the Tabs
`const Tab = createBottomTabNavigator();` → `Tab.Navigator`, `Tab.Screen`.
@@K Step 3 - Register the Screens
적은 순서대로 아래 탭이 생겨요. 탭에는 **뒤로 가기 화살표가 없어요**(쌓는 게 아니라 옆으로 전환).
@@K Step 4 - Show That Tabs Keep Their State
**중요 개념**: 탭은 다른 탭으로 가도 **mounted 상태 유지** → 카운트가 남아 있어요. 반면 스택에서 `goBack()`으로 pop된 화면은 **unmount** → state 사라짐. (시험 비교 문제 후보)
@@K Step 5 - Add Icons
`import { Ionicons } from "@expo/vector-icons";` → `options={{ tabBarIcon: ({ color, size }) => <Ionicons name="home" color={color} size={size} /> }}`. tabBarIcon은 탭 바가 주는 color, size를 받는 **함수**라서 선택되면 색이 바뀌어요.
@@K Step 6 - Colour the Selected Tab
`<Tab.Navigator screenOptions={{ tabBarActiveTintColor: "purple" }}>` → 선택된 탭 아이콘과 글자 색. 이 색이 tabBarIcon의 `color`로 들어가요.
@@K Finished Code
**완성 코드 해설**: Tab 생성 → `screenOptions`로 활성 색 → 탭 3개, 각자 `tabBarIcon`. Home 카운터로 탭 state 유지 확인.
@@K Example: Drawer Navigator
드로어 = 옆에서 미끄러져 나오는 메뉴. 상시 탭이 필요 없는 설정, 보조 섹션에 좋아요. 헤더에 **햄버거 아이콘이 자동**으로 생기고, 모든 Screen이 메뉴 항목이 돼요. 세 내비게이터 비교 4줄은 코스노트 결론과 같아요(생성 함수만 다르고 JSX와 props는 같음). Drawer는 gesture-handler, reanimated 패키지도 필요해서 Snack 링크에 자동 포함했어요.
@@K Example: Choosing a Navigator per Platform
같은 두 화면이 **세 가지 다른 내비게이터**에 들어가요. 무엇이 될지는 `Platform.select()` 블록 하나만 결정.
@@K How It Works
- 키는 `ios`, `android`, `default`. **web 키가 없으니 웹은 default**.
- 각 값은 내비게이터를 return 하는 **함수**. MyApp에서 `Navigator()`로 **호출**.
- 화면은 한 번만 작성, 감싸는 것만 바뀜.
@@K What to Show
1. Web: default 스택. Home 헤더만, 탭도 메뉴도 없음.
2. **막다른 길**: 웹에선 Settings로 갈 방법이 없음. 스택은 누군가 `navigate()`를 불러야 움직이는데 버튼이 없으니까. → 그래서 실제 앱은 내비게이터를 **조합**.
3. iOS: 아래 탭 바.
4. Android: 왼쪽 메뉴 아이콘, 또는 왼쪽 끝에서 스와이프 → 드로어.
5. 정리: 세 내비게이터, 같은 두 화면, 나머지는 그대로.
@@K Example: Nesting Navigators
코스노트 "Nesting navigators"와 같은 내용(Stack → Tabs 패턴). 4가지 중첩 패턴을 다시 보세요.
@@K How It Works
- `MainTabs`는 `Tab.Navigator`를 return 하는 평범한 컴포넌트, 스택이 이걸 `Main` 화면으로 등록 → **탭 전체가 스택의 화면 하나**.
- `NavigationContainer`는 **여전히 맨 위에 하나**.
- Post는 탭 **바깥**이라 탭 바를 덮어요.
- 각 내비게이터는 **자기 history**를 따로 가짐.
@@K What to Show
1. Feed 탭, 헤더 하나(탭의 헤더).
2. `headerShown: false`를 지우면 헤더 **2개**(스택의 "Main" + 탭의 "Feed").
3. **위로는 자동**: Feed에서 `navigate("Post")` → 탭에 없으니 부모 스택으로 → Post가 탭 위에.
4. 뒤로 → Feed 그대로.
5. **아래로는 부모 이름 필요**: `popTo("Main", { screen: "Account" })`.
6. `navigate("Account")`만 쓰면 **아무 일도 없음** + 개발 모드 에러 로그.
7. 함정: `navigate("Main", { screen: "Account" })` → 되는 것처럼 보이지만 탭 복사본이 Post 위에 쌓임. Android 뒤로 가기가 앱 종료 대신 Post로 감.
@@K Example: Handling State Across Screens
params는 **한 방향**(다음 화면으로)만. 여러 화면이 같이 **바꾸는** 데이터는 공유 state(Jotai)가 필요.
@@K Starter Code
`stock`이 일반 객체라 아무것도 안 바뀜. Buy가 동작 안 함, Banana는 0이라 회색.
문제점: BuyButton은 **헤더**가 그리고, 두 화면은 **내비게이터**가 그려서, 내가 직접 컨트롤하는 공통 부모가 없어요. useState로는 못 닿아요.
@@K Step 1 - Import Jotai
`import { atom, useAtom } from "jotai";`
@@K Step 2 - Turn the Object into an Atom
`const stockAtom = atom({...})`. 이름이 바뀌어서 `stock`을 읽던 곳들이 전부 **크래시**. 하나씩 고쳐 가요.
@@K Step 3 - Read the Atom in HomeScreen
`const [stock] = useAtom(stockAtom);` → 값만 필요하니 첫 번째만.
@@K Step 4 - Read the Atom in DetailsScreen
같은 한 줄.
@@K Step 5 - Read and Update the Atom in BuyButton
`const [stock, setStock] = useAtom(stockAtom);` → `setStock((prev) => ({ ...prev, [item]: prev[item] - 1 }))`.
- 함수형 = 이전 값 기반.
- `{ ...prev, [item]: ... }` **새 객체**를 만들기. `prev[item]--` 처럼 직접 고치면 React가 바뀐 걸 몰라서 **다시 안 그려요**.
@@K Step 6 - Show That Every Screen Stays in Sync
Apple에서 Buy → Details 숫자 감소 → 0이면 Buy 회색 → 뒤로 가면 목록 숫자도 감소. 세 컴포넌트가 서로 props를 안 주고 **같은 atom**만 봐요.
@@K Finished Code
**완성 코드 해설**: `stockAtom` 하나를 HomeScreen(목록 수량), DetailsScreen(상세 수량), BuyButton(헤더, 감소)이 같이 씀. Lab 4 Part B4의 Save 버튼이 이 Buy 버튼의 **배열 버전**이에요.

@@LAB lab-4.md
@@S _doc | lab
Lab 4는 짝과 함께 내비게이션 앱을 계획하고 만드는 랩이에요. 힌트만 적어 뒀으니 혼자 풀어 보세요.
@@K _intro
Lab 4는 4주차 전부(탭 + 중첩 스택 + params + 헤더 + push/popToTop + Jotai + useNavigation)를 한 앱에 넣는 **종합 문제**예요. Test 2 대비로 아주 좋아요. 아래에서 파트별로 어떤 인클래스 예제를 보면 되는지 연결했어요.
@@K A Note on AI
AI는 막혔을 때만. 이번 랩은 그룹 활동 + 서로 테스트까지 있어요.
@@K Overview
그룹이 같이 앱 지도를 그리고(A), 각자 직접 만들고(B), 서로 테스트(C).
@@K The Clock
수업 시간 안에 끝내는 랩이라 시간 배분 안내예요.
@@K Submission
지도 사진 + Snack 링크, 테스트 결과 주석 블록 포함.
@@K Setup
교수님 starter Snack을 **Fork**. package.json 그대로, **SDK 54 유지**. Web 미리보기로 충분.
@@K Part A - Plan Together
**지도에 들어갈 것**: 앱 이름, 탭 3개(browse, saved, about) 이름과 Ionicons 아이콘 이름, 모든 route 이름(browse 안의 스택 화면 2개 포함), 아이템 데이터 4개 이상(`id`, `name` + 필드 2개), 어떤 내비게이터가 어떤 걸 품는지(상자 안 상자).
@@K Part B - Build It Yourself
지도 그대로 직접 구현. ITEMS 배열을 그룹 데이터로 교체.
@@K Part B1 - Tabs and a Nested Stack
**연결**: 코스노트 Nesting navigators의 **두 번째 예제(Messages/Contacts)** 와 똑같은 패턴(Tabs → Stack).
- `BrowseStack`이 스택 내비게이터를 return.
- Details에서 **탭 바가 보여야** 정답(안 보이면 거꾸로 중첩한 것).
- 헤더 2개 문제 → browse 탭에 `headerShown: false`.
@@K Part B2 - Params and the Header
**연결**: 4.1 Passing Params, Customizing the Header.
- `.map()`으로 아이템마다 Button, `navigate("Details", { id, name })` params 2개.
- Details: `ITEMS.find((it) => it.id === id)`로 찾기. 없으면 `Item not found` (params 없을 때 크래시 금지 → `route.params ?? {}`).
- 헤더 title: `route.params?.name ?? "Details"`.
@@K Part B3 - Push and Pop
**연결**: 4.1 Navigate vs Push, Going Back.
- Next item: `findIndex`로 현재 위치, `(index + 1) % ITEMS.length`로 마지막 다음은 처음으로. `push` 사용.
- 주석에 쓸 내용(내 말로): navigate는 이미 Details에 있으니 **새 화면을 쌓지 않고 params만 바꿔서**, 뒤로 가기가 이전 아이템으로 안 돌아간다.
- Back to list: `popToTop()`.
@@K Part B4 - Saved Items and Shared State
**연결**: 4.1 Handling State Across Screens(Buy 버튼) + useNavigation Hook.
- `savedAtom = atom([])` 배열.
- 저장 여부: `saved.includes(id)`. 토글: `prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]`.
- Save/Unsave 버튼은 **별도 컴포넌트**, headerRight는 렌더링 + id 전달만.
- Browse 버튼도 별도 컴포넌트, `useNavigation()` 사용.
@@K Bonus - Open a Saved Item
saved 탭은 browse 스택 **바깥**이라 `navigate("Browse", { screen: "Details", params: { id, name } })`. 코스노트의 "Message Sam" 버튼과 같은 원리.
@@K Part C - Test Each Other
그룹원끼리 서로의 Snack을 주석 체크리스트대로 테스트하고 결과(pass/fail/not built)를 적기. 실패를 고쳤으면 무엇을 바꿨는지 마지막 줄에.

@@TEXT
## ✅ Week 4 시험 대비 체크리스트

1. NavigationContainer 규칙? → 가장 바깥, 앱에 하나, 중첩 내비게이터는 컨테이너 X
2. `createNativeStackNavigator()`는 어디서 호출? → 컴포넌트 **바깥**, 한 번
3. `component={Home}` vs `component={<Home/>}`? → 컴포넌트 **자체**를 넘긴다
4. `initialRouteName`이 없으면? → 첫 번째 Screen
5. navigate / push / goBack / popTo / popToTop 차이? (0번 표)
6. 아래 화면으로 navigate하면? → 복사본이 하나 더 쌓임
7. 화면이 아닌 컴포넌트가 이동하려면? → `useNavigation()`
8. params 보내기/받기? → `navigate("X", {...})` / `route.params`
9. params 없이 열리면? → undefined, 구조 분해 시 크래시 → `route.params ?? {}` + 기본값
10. `setParams`의 특징? → 현재 화면만, merge
11. `screenOptions` vs `options`? → 내비게이터 전체 / 화면 하나(우선)
12. headerRight / headerLeft / headerShown?
13. 탭을 바꿔도 state가 유지되는 이유? → 탭 화면은 mounted 유지 (스택에서 pop된 화면은 unmount)
14. `tabBarIcon`은 무엇? → `({ color, size }) => 아이콘` 함수
15. 중첩 패턴 4가지와 각 특징?
16. 중첩에서 헤더 2개 문제? → `headerShown: false`
17. 안쪽 내비게이터의 화면으로 가기? → `navigate("부모", { screen: "자식", params })`
18. 화면 간 공유 state? → Jotai atom (내비게이션 전용 state API 없음)
19. state 객체 업데이트 시 `{ ...prev, [key]: v }` 를 쓰는 이유? → 새 객체여야 다시 렌더링

**손으로 써 보기 과제 (Lab 4 축소판)**: 탭 2개(Books, Saved). Books 탭 안에 스택(List → Detail). Detail 헤더 오른쪽에 Save 버튼(Jotai). 보지 않고 써 본 뒤 비교하세요.

```jsx
import { View, Text, Button } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";
import { atom, useAtom } from "jotai";

const BOOKS = [
  { id: 1, title: "Clean Code" },
  { id: 2, title: "You Don't Know JS" },
  { id: 3, title: "Eloquent JavaScript" },
];

const savedAtom = atom([]);
const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function ListScreen({ navigation }) {
  return (
    <View style={{ flex: 1, padding: 16, gap: 8 }}>
      {BOOKS.map((b) => (
        <Button
          key={b.id}
          title={b.title}
          onPress={() => navigation.navigate("Detail", { id: b.id, title: b.title })}
        />
      ))}
    </View>
  );
}

function DetailScreen({ route }) {
  const { id } = route.params ?? {};
  const book = BOOKS.find((b) => b.id === id);
  if (!book) return <Text>Book not found</Text>;
  return (
    <View style={{ flex: 1, padding: 16 }}>
      <Text style={{ fontSize: 20 }}>{book.title}</Text>
    </View>
  );
}

function SaveButton({ id }) {
  const [saved, setSaved] = useAtom(savedAtom);
  const isSaved = saved.includes(id);
  return (
    <Button
      title={isSaved ? "Unsave" : "Save"}
      onPress={() =>
        setSaved((prev) => (prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]))
      }
    />
  );
}

function BooksStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="List" component={ListScreen} options={{ title: "My Books" }} />
      <Stack.Screen
        name="Detail"
        component={DetailScreen}
        options={({ route }) => ({
          title: route.params?.title ?? "Detail",
          headerRight: () => <SaveButton id={route.params?.id} />,
        })}
      />
    </Stack.Navigator>
  );
}

function SavedScreen() {
  const [saved] = useAtom(savedAtom);
  const items = BOOKS.filter((b) => saved.includes(b.id));
  return (
    <View style={{ flex: 1, padding: 16 }}>
      {items.length === 0 ? <Text>Nothing saved yet</Text> : items.map((b) => <Text key={b.id}>{b.title}</Text>)}
    </View>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator>
        <Tab.Screen
          name="Books"
          component={BooksStack}
          options={{
            headerShown: false,
            tabBarIcon: ({ color, size }) => <Ionicons name="book" color={color} size={size} />,
          }}
        />
        <Tab.Screen
          name="Saved"
          component={SavedScreen}
          options={{
            tabBarIcon: ({ color, size }) => <Ionicons name="bookmark" color={color} size={size} />,
          }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
```

**해설**: Tabs → Stack 패턴이라 Detail에서도 탭 바가 보여요. Books 탭에 `headerShown: false`를 줘서 헤더가 하나만 보여요. SaveButton과 SavedScreen은 서로 props를 주고받지 않고 `savedAtom`만 같이 봐요. `items.length === 0 ? ... : ...` 은 3주차의 `0` 함정을 피하는 방법이에요.
