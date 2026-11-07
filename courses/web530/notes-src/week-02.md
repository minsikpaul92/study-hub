# Week 2. 이벤트와 State: 버튼을 누르면 화면이 바뀌게 만들기

> 이 노트 읽는 법: **📘/💻/🧪 원문**(영어 그대로) 바로 밑에 **🇰🇷 한글 해설**이 있어요. 코드 밑의 **▶ Snack에서 바로 실행하기**를 누르면 그 코드가 Expo Snack에서 열려요.

> 🧭 **챕터 읽는 순서**: 챕터마다 맨 앞의 **🧭 먼저 한국어로** 상자(구성과 할 일) → 원문 출처 → 영어 원문 → ▶ Snack → 🇰🇷 한글 해설이에요. 코드 위에 **⌨️**가 있으면 직접 쳐 볼 코드이고, 없으면 읽기만 하거나 **👀 여기서 결과 보기**로 결과만 확인하면 돼요.

## 0. 이번 주 한눈에 보기

1주차에 만든 화면은 "그림"일 뿐이었어요. 버튼을 눌러도 아무것도 안 바뀌었죠. 이번 주는 화면이 **반응하고, 기억하고, 다시 그려지게** 만드는 주예요. 1차 시험(Test 1)의 핵심 범위라서 아주 중요해요.

| 키워드 | 한 줄 설명 | 비유 |
| --- | --- | --- |
| Event handler | 이벤트(누르기, 입력)가 일어나면 실행되는 함수 | 초인종 누르면 울리는 벨 |
| `onPress`, `onChangeText`, `onValueChange` | RN의 이벤트 이름 (웹의 onClick, onChange 대신) | |
| `useState` | 컴포넌트가 값을 **기억**하고, 바뀌면 **다시 그리게** 하는 Hook | 컴포넌트의 메모장 |
| 함수형 업데이트 `setX(prev => ...)` | 이전 값을 기준으로 새 값을 계산 | "지금 몇 개든 거기에 1 더해 줘" |
| `useEffect` | 화면 그리기 **말고** 다른 일(타이머, 데이터 불러오기)을 하는 곳 | 그림 다 그린 뒤 하는 뒷정리, 심부름 |
| Cleanup 함수 | effect가 시작한 일을 정리 (타이머 끄기 등) | 나갈 때 불 끄기 |
| Dependency array `[]` | effect를 **언제 다시** 실행할지 정하는 목록 | 알람 조건 |
| Lifting state up | 공유해야 하는 state를 **가장 가까운 공통 부모**로 올리기 | 형제가 같이 쓰는 용돈은 부모님이 관리 |
| `useCallback` | 함수를 렌더링마다 새로 만들지 않고 **같은 함수**로 유지 | |
| Context | Provider로 감싼 아래쪽 컴포넌트들이 값을 꺼내 쓰기 | 교실 공용 칠판 |
| Jotai `atom` | Provider 없이 어디서든 쓰는 전역 state | 단톡방 공지 |

**시험 필수 공식** (원문에 3번 이상 반복돼요):
`setCount((prev) => prev + 1)`, `setOn((prev) => !prev)`, `setItems((prev) => [...prev, item])`
새 값이 **이전 값에 따라** 정해지면 무조건 함수형!

{{PRACTICE}}

{{TOC}}

@@NOTE B-Components/events.md
@@S _doc | read
이벤트(onPress 등)를 처리하는 방법이에요. 💻 2.1 "Event Handlers"에서 직접 쳐 보니까 여기서는 읽기만 해요.
@@K Event Handlers
**Event handler(이벤트 핸들러)** = 어떤 일이 일어났을 때(버튼 누름, 글자 입력) 실행되는 **콜백 함수**예요.

첫 예제 해설:
- `useState('Waiting')` 으로 status를 "Waiting"으로 시작.
- `<Button onPress={(e) => setStatus('Clicked')} />` 누르면 status가 "Clicked"로 바뀌고 화면이 다시 그려져요.
- `(e)` 는 이벤트 객체인데 여기선 안 써요.

원문 중간 문단(내부 동작) 요약:
- React는 핸들러를 실제 DOM 요소에 하나하나 붙이지 않아요. **내부 사전(dictionary)** 에 "이 이벤트엔 이 함수" 하고 적어 두고, 앱 **루트에 핸들러 하나**만 둬요.
- 이벤트가 생기면 트리를 따라 루트까지 **올라가요(bubbles up)**. React가 사전을 보고 맞는 함수를 실행해요.
- 그래서 웹이든 iOS든 Android든 **같은 방법**으로 이벤트를 연결할 수 있어요.
- jQuery는 명령형이라 "요소를 찾아서 핸들러를 붙여라"를 따로 써야 했지만, React는 JSX 안에 **선언형**으로 적어서 UI 구조와 같이 보여요.

두 번째 예제: 로직이 길면 핸들러를 **따로 함수로 빼서**(`buttonClicked`) `onPress={buttonClicked}` 처럼 이름만 넘겨요. 주의! `onPress={buttonClicked()}` 처럼 **괄호를 붙이면** 렌더링하자마자 실행돼 버려요. 함수를 "넘기는" 것과 "호출하는" 것의 차이, 시험에 잘 나와요.

세 번째 예제는 **class 컴포넌트**(옛날 방식)라서 `this`, `bind`가 나와요. 핵심 아이디어만 기억하세요: 버튼마다 **다른 인자(선수 번호)** 를 핸들러에 넘길 수 있다. 함수형으로 쓰면 `onPress={() => onPlayerSelected(number)}` 처럼 화살표 함수로 감싸면 돼요.

@@K Synthetic Events
**Synthetic event(합성 이벤트)**: React가 각 플랫폼의 진짜(native) 이벤트를 **똑같은 모양의 객체로 포장**한 것. 그래서 어느 브라우저, 어느 기기든 같은 방식으로 다룰 수 있어요.

Event pooling(이벤트 풀링)은 옛날 React(16 이하) 이야기예요. React 17부터 없어졌어요. 지금은 이벤트 객체를 비동기 코드 안에서 읽어도 괜찮아요.

@@NOTE B-Components/hooks.md
@@S _doc | read
useState, useEffect 같은 Hook 설명이에요. 💻 2.2 State, useEffect 예제와 같은 내용이라 읽고 개념만 잡으면 돼요.
@@K Introduction to Hooks
**`useState()`** 는 함수형 컴포넌트에 **기억력**을 주는 Hook이에요. 원래 함수는 호출될 때마다 처음부터 다시 실행돼서 변수가 리셋되거든요. useState로 만든 값은 다시 그려져도 **유지**돼요.

```jsx
const [name, setName] = useState('Paula');
//     ^값    ^바꾸는 함수      ^처음 값
```
- `useState`는 **배열**을 돌려줘요: `[현재 값, 값을 바꾸는 함수]`. 그래서 대괄호 `[ ]` 로 **배열 구조 분해**를 해요.
- 첫 예제처럼 바꿀 일이 없으면 `const [name] = useState('WEB530')` 처럼 setter를 생략해도 돼요.
- state는 여러 개 만들어도 돼요. 값마다 `useState`를 한 번씩. 객체 하나에 다 넣는 건 복잡해져서 **비추천**.

두 번째 예제는 **controlled input(제어 컴포넌트)** 패턴이에요. 시험 단골!
```jsx
<TextInput value={name} onChangeText={setName} />
```
- `value={name}`: 입력창에 보이는 글자 = state.
- `onChangeText={setName}`: 글자가 바뀔 때마다 새 문자열을 setName에 넣음. RN의 `onChangeText`는 **이벤트 객체가 아니라 문자열을 바로** 줘서 setName을 그냥 넘길 수 있어요.

마지막 문단: class 컴포넌트의 `setState()`는 여러 값을 한 번에 합쳐(merge) 바꿀 수 있었지만, `useState`는 **값마다 각자의 setter**를 써요.

@@K Updating state based on the previous value
이 부분이 Week 2의 **최대 함정**이에요.

`count`는 그 렌더링 순간에 찍힌 **스냅샷(사진)** 이에요. 다음 렌더링 전까지 안 바뀌어요. 그래서:
```jsx
setCount(count + 1);  // count는 0 → "1로 만들어"
setCount(count + 1);  // count는 여전히 0 → "1로 만들어"
```
결과는 2가 아니라 **1**. 둘 다 "1로 해 줘"라고 했으니까요.

해결: setter에 **함수**를 넘겨요.
```jsx
setCount((prev) => prev + 1); // React: 최신값 0 넣어 줄게 → 1
setCount((prev) => prev + 1); // React: 최신값 1 넣어 줄게 → 2
```
비유: 친구 두 명에게 "지금 칠판 숫자 보고 1 더해서 적어"라고 하면, 둘이 동시에 0을 보고 둘 다 1을 적어요(버그). "앞사람이 적은 숫자에 1 더해"라고 하면 순서대로 1, 2가 돼요(함수형).

**규칙**: 새 값이 이전 값에 의존하면 함수형. `setName('Paula')`처럼 의존하지 않으면 값 그대로.

@@K Running Side Effects with `useEffect`
컴포넌트의 본업은 **JSX를 return 하는 것 하나**예요. 그 외의 일(데이터 불러오기, 타이머, 구독 등)을 **side effect(부수 효과)** 라고 하고, 그건 `useEffect` 안에서 해요.

**Race condition(경쟁 상태)**: 여러 일이 끝나는 **순서/타이밍**에 따라 결과가 꼬이는 문제. 예: 늦게 보낸 요청의 답이 먼저 오고, 먼저 보낸 요청의 답이 나중에 와서 덮어써 버리는 경우.

```jsx
useEffect(() => { /* 할 일 */ }, [ /* 의존성 */ ]);
```
| 두 번째 인자 | 언제 실행? |
| --- | --- |
| 없음 | **매번** 렌더링 후 |
| `[]` (빈 배열) | **첫 렌더링 후 한 번만** |
| `[a, b]` | 첫 렌더링 후 + a나 b가 **바뀔 때마다** |

예제 해설: `fetchUser()`는 2초 뒤 사용자 정보를 주는 **가짜 fetch**(Promise)예요. `useEffect(..., [])` 로 처음 한 번만 불러서 `.then()` 안에서 state 3개를 바꿔요. 화면은 "Loading ..." → 2초 뒤 "Wayne".

**배열을 빼면?** effect가 state를 바꿈 → 다시 렌더링 → effect 또 실행 → 또 fetch → ... **무한 반복!**

@@K Cleaning up an effect
effect가 **return 하는 함수 = cleanup(정리) 함수**.

React가 cleanup을 부르는 때 (시험 포인트!):
1. 컴포넌트가 화면에서 **사라질 때(unmount)**
2. effect를 **다시 실행하기 직전**

Promise는 취소가 안 돼서 `ignore` **깃발(flag)** 패턴을 써요.
- effect 시작: `let ignore = false;`
- 응답 오면: `if (!ignore)` 일 때만 state 변경.
- cleanup: `ignore = true;` → "이제 그 답은 무시해."

비유: 피자를 주문했는데 그 사이 이사를 갔어요. cleanup은 "이전 주소로 오는 피자는 받지 마"라고 메모를 남기는 거예요.

@@K Effects that depend on a value
effect가 props나 state를 쓰면 **의존성 배열에 넣어요**. React는 렌더링마다 배열 값을 이전과 비교해서 바뀌었으면 **이전 cleanup 실행 → effect 다시 실행**.

예제: User 1은 3초, User 2는 1초 걸려요. User 1 누르고 바로 User 2를 누르면?
- `userId`가 2로 바뀜 → User 1 effect의 cleanup이 `ignore = true` → 3초 뒤 Wayne이 와도 무시됨.
- ignore가 없으면: Mario가 먼저 보였다가 Wayne으로 **덮어써짐**(race condition 버그).

참고: 진짜 `fetch()`는 `AbortController`로 아예 **취소**할 수 있어요. `controller.abort()`를 cleanup에서 호출.

@@K Lifting State Up
**Lifting state up = state를 위로 올리기.** 두 컴포넌트가 같은 데이터를 써야 하면, 각자 state를 갖지 말고 **가장 가까운 공통 부모**로 state를 옮긴 다음, props로 내려 줘요.

언제 올려야 하나 (원문 4가지):
1. 두 개 이상의 컴포넌트가 같은 데이터를 보여 줄 때
2. 한 컴포넌트가 바꾼 값을 다른 컴포넌트가 읽을 때
3. 같은 state를 여러 곳에 중복으로 갖고 있을 때
4. 각자 버전을 들고 있어서 서로 안 맞을 때(out of sync)

예제 구조:
```
App (name state 주인, single source of truth)
├── NameInput   ← name + onChange(=setName) 받음 (값 바꾸는 역할)
└── NamePreview ← name만 받음 (보여 주는 역할)
```
**Single source of truth(단일 진실 공급원)**: 진짜 값은 딱 한 곳(부모)에만 있다. 자식은 props로 받고, 바꾸고 싶으면 부모가 준 **함수를 호출해서 부모에게 부탁**해요. 데이터는 아래로(props), 요청은 위로(callback).

@@K Keeping Functions Stable with `useCallback`
조금 어렵지만 인클래스 예제(2.2 useEffect)와 똑같은 내용이라 꼭 이해하세요.

**왜 문제가 생기나?**
- 숫자는 `1 === 1` 이 true. 그런데 함수는 렌더링할 때마다 **새로 만들어진 다른 객체**예요. 코드가 똑같아도 `===` 비교하면 false.
- `Ticker`의 effect는 `[onTick]`에 의존해요. 부모가 다시 그려질 때마다 `handleTick`이 새로 생기니까 effect가 매번 다시 실행돼요.

무한 루프 5단계 (원문 순서 그대로 외우면 좋아요):
1. Ticker 렌더 → effect가 타이머 시작
2. 타이머 → `onTick` 호출 → App의 state 변경
3. App 다시 렌더 → **새** handleTick 생성
4. Ticker가 새 onTick을 받음 → 다르네? → cleanup 후 effect 재실행 → 새 타이머
5. 2번으로

**잘못된 해결**: `[]` 빈 배열. 한 번만 돌긴 하는데 경고: `React Hook useEffect has a missing dependency: 'onTick'`. 의존성을 속이는 거라 큰 앱에서 **오래된 값(stale value)** 버그의 원인이 돼요.

**올바른 해결**: `useCallback(함수, [의존성])` 으로 함수를 감싸면 의존성이 안 바뀌는 한 **같은 함수 객체**를 돌려줘요. → onTick 안 바뀜 → effect 한 번만.

추가 포인트: useCallback 안에서 `setCount(count + 1)`을 쓰면 첫 렌더의 count(0)만 계속 보게 돼요. 그래서 `setCount((prev) => prev + 1)` 함수형을 써야 `[]`가 "정직"해져요.

**useCallback은 아무 데나 쓰는 성능 도구가 아니에요.** 함수가 useEffect의 의존성일 때, 또는 자식에게 넘길 때만.

@@K Sharing data via context
**Context API** = 여러 컴포넌트가 같이 쓰는 **전역 데이터**를 props 없이 나눠 주는 방법.

3단계 공식:
1. **만들기**: `const UserContext = createContext();`
2. **제공하기**: `<UserContext.Provider value={user}>{children}</UserContext.Provider>` 로 감싸기
3. **꺼내 쓰기**: 자식 어디서든 `const user = useContext(UserContext);`

예제의 `UserContextProvider`는 데이터를 불러오고(useEffect) Provider로 감싸 주는 **컨테이너 컴포넌트**예요. `{ children }` 을 받아서 Provider 안에 넣어요.

중간의 `<View>`들은 데이터에 관심이 없어도 돼요. 이게 Context의 장점: 중간 단계 컴포넌트들이 props를 줄줄이 전달하는 **prop drilling**을 안 해도 돼요.

@@K Global State with Jotai
Context는 만들기, Provider로 감싸기, value 넘기기... 준비가 많아요(원문 표현: "plumbing", 배관 공사). **Jotai**는 훨씬 간단해요.

```jsx
const countAtom = atom(0);                  // 컴포넌트 바깥에 전역 atom
const [count, setCount] = useAtom(countAtom); // useState랑 똑같이 생김!
```
- **Provider 없음**, reducer 없음, 보일러플레이트 없음.
- 같은 atom을 쓰는 컴포넌트는 atom이 바뀌면 **모두 자동으로** 다시 그려져요.
- `const [, setUser] = useAtom(userAtom);` → 쉼표 앞을 비우면 "값은 필요 없고 setter만" 이라는 뜻.
- `return null;` → 화면에 아무것도 안 그리고 데이터만 불러오는 컴포넌트.
- Snack에서 쓰려면 `package.json`에 `jotai` 추가(+ `@types/react`). 아래 Snack 링크에는 자동으로 들어가 있어요.

언제 뭘 쓰나: 테마, 설정 같은 건 Context도 좋고, **자주 바뀌는 공유 데이터**는 Jotai가 깔끔해요.

@@NOTE B-Components/class-components.md
@@S _doc | skim
옛날 방식인 클래스 컴포넌트 소개예요. 함수 컴포넌트와 무엇이 다른지만 알면 되니까 가볍게 훑어요.
@@K _pre
**(선택 읽기)** class 컴포넌트는 옛날 방식이에요. 수업에서는 함수형만 써요. 다만 인터넷 예제나 오래된 문서에서 볼 수 있으니 **읽을 줄만** 알면 돼요. 함수형과 비교표만 기억하세요.

| class 컴포넌트 | 함수형 컴포넌트 |
| --- | --- |
| `state = { a: 1 }` | `const [a, setA] = useState(1)` |
| `this.setState({ a: 2 })` (합쳐짐, merge) | `setA(2)` (값마다 따로) |
| `this.props.x` | `({ x })` |
| `componentDidMount()` | `useEffect(() => {...}, [])` |
| `componentWillUnmount()` | useEffect의 cleanup 함수 |
| `componentDidUpdate()` | `useEffect(() => {...}, [deps])` |
| `render() { return ... }` | 함수가 바로 return |
@@K Component state and properties
- **State**: 컴포넌트 데이터의 **스냅샷**. 바뀌면 컴포넌트가 자동으로 다시 그려져요.
- **Properties(props)**: 바깥(부모)에서 넣어 주는 값. 보통 처음 렌더링 때 정해지고 그 뒤로 안 바뀌어요. 다시 그릴지는 부모가 결정.
@@K Working with component state
class에서는 `state = { ... }` 객체로 초기값을 주고, `this.setState({...})`로 바꿔요. `componentDidMount()`는 화면에 처음 붙은 직후 한 번 실행되는 **생명주기 메서드**(함수형의 `useEffect(..., [])`). class의 setState는 **일부 속성만 넘겨도 나머지와 합쳐(merge)** 줘요.
@@K Working with component properties
**Immutable(불변)**: 바꿀 수 없는 값. props는 불변이라 자식이 직접 바꾸면 안 돼요. class에서는 `static defaultProps`로 기본값을 줘요(함수형에서는 구조 분해 기본값).
@@K Passing data from parent to child components
부모가 자기 state를 자식의 props로 내려 주는 패턴이에요. 함수형의 lifting state up과 같은 원리.
@@K Lifecycle methods
컴포넌트의 일생: **생성(mount) → 업데이트(update) → 제거(unmount)**. 각 시점에 실행되는 메서드가 있어요. 함수형에서는 이걸 전부 `useEffect` 하나로 처리해요(위 비교표).
@@K Methods
각 생명주기 메서드 목록이에요. 시험에는 함수형 기준으로 나오니 위 비교표 정도만 알아 두면 충분해요.

@@LEC week-02.1-notes.md
@@S _doc | type
2.1 수업 라이브 코딩 예제예요. ⌨️ 표시된 코드는 빈 Snack에서 직접 쳐 보세요.
@@S React Native Playground | skim
Snack 안내예요.
@@S Common Components | read
기본 컴포넌트와 이벤트 이름 표예요. onPress, onChangeText, onValueChange는 외워 두세요.
@@S Example: Event Handlers | type
할 일: handlePress를 함수 선언, 화살표 함수, 인라인 세 방식으로 onPress에 연결
onPress={handlePress}처럼 함수를 넘기고, 괄호를 붙여 바로 부르지 않아요.
@@S Example: Passing Props | type
할 일: MyButton({ text, enabled, message })에 기본값을 주고 disabled={!enabled}, Alert로 message 보여 주기
props 구조분해와 기본값을 연습해요.
@@K React Native Playground
2주차부터는 계속 **Snack**에서 해요. `App.js`만 고치면 돼요.

@@K Common Components
1.2의 표를 확장한 표예요. **이벤트 이름까지** 외우세요.
- `Button` → `onPress` (웹은 onClick)
- `TextInput` → `onChangeText` (이벤트 객체가 아니라 **문자열**을 줌)
- `Switch` → `value` + `onValueChange` (체크박스 대신 토글 스위치)
- `Image` → `source` (웹은 src). 인터넷 이미지는 **width/height 필수**.
- 화면은 기본적으로 **스크롤이 안 돼요.** 스크롤하려면 `ScrollView`로 감싸야 해요.
- `Text` 안의 `Text`는 웹의 `<span>`처럼 한 줄 안에서 일부만 꾸밀 때 써요.

@@K Example: Event Handlers
**코드 해설**: 핸들러를 쓰는 3가지 방법. 결과는 모두 같아요.
1. `function handlePress() {...}` 컴포넌트 **안에** 일반 함수 선언 → `onPress={handlePress}`
2. `const handlePress = () => {...}` 화살표 함수 → `onPress={handlePress}`
3. `onPress={() => Alert.alert("That felt good")}` **인라인**

- `Alert.alert(제목, 메시지)` 는 **Web 미리보기에서는 아무 일도 안 일어나요!** Snack 오른쪽 위에서 iOS/Android를 고르거나 폰의 Expo Go로 확인하세요. (아래 Snack 링크는 그래서 iOS 미리보기로 열려요.)
- `style={{ marginTop: 100 }}`: 폰 상단 상태바(시계)에 가리지 않게 내린 것. 바깥 `{}`는 "JS 값", 안쪽 `{}`는 "객체".

@@K Example: Passing Props
**코드 해설**
- `function MyButton({ text = "Button", enabled = true, message = "That felt good" })` → props 3개, 전부 기본값.
- `disabled={!enabled}` → enabled가 true면 disabled는 false.
- `onPress={() => Alert.alert(message)}` → **원문 NOTE**: 이미 `{ }` JS 영역 안이라서 `message`에 또 중괄호를 붙이지 않아요. `Alert.alert({message})` 라고 쓰면 객체가 들어가서 틀려요!
- 부모: `<MyButton text="Click Me!" message="That felt great!" />` → enabled는 안 넘겼으니 기본값 true.

@@LEC week-02.2-notes.md
@@S _doc | type
2.2 수업 예제예요. State, useEffect, Context, Jotai는 코딩 문제의 핵심이라 ⌨️ 표시된 코드는 꼭 직접 쳐 보세요.
@@S React Native Playground | skim
같은 Snack에서 계속해요.
@@S Example: State | type
할 일: useState로 count를 만들고 버튼을 누를 때 setCount(count + 1), 버튼 제목에 count 표시
일반 변수로는 화면이 안 바뀌고, state를 바꿔야 다시 그려져요.
@@S Example: Lifting State Up | type
할 일: count state를 부모 MyApp으로 옮기고 count와 handlePress를 props로 내려 주기
state를 부모로 올려서 여러 자식이 같은 값을 나눠 써요.
@@S Example: useEffect | type
할 일: useEffect + setTimeout으로 1초마다 세고, 의존성 배열과 clearTimeout cleanup 넣기
의존성 배열과 cleanup이 시험 단골이에요.
@@S Example: Using Context for State | type
할 일: createContext, CountProvider(value={{ count, handlePress }}), useContext로 꺼내 쓰기
props 없이 멀리 있는 컴포넌트에 state를 나눠 줘요.
@@S Example: Using Jotai | type
할 일: 파일 맨 위에 countAtom = atom(0), 컴포넌트에서 useAtom(countAtom)으로 읽고 바꾸기
Context보다 짧게 여러 컴포넌트가 함께 쓰는 state를 만들어요.
@@K React Native Playground
같은 Snack에서 계속.

@@K Example: State
**수업 흐름 따라가기 (5단계)**
1. 시작 버전: 그냥 버튼.
2. `let count = 0;` 일반 변수로 세기 → Alert에는 숫자가 올라가는데...
3. 버튼 제목에 `count`를 보여 주면 **화면이 안 바뀌어요.** 왜? 일반 변수가 바뀌어도 React는 **다시 그려야 하는지 몰라요.** 그리고 다시 그려지면 `let count = 0`부터 다시 시작해서 리셋돼요.
4. `useState(0)`로 바꾸면 해결. `setCount`가 "값 바꿨으니 다시 그려!"라고 React에 알려 줘요.
5. 함정 실험: `setCount(count + 1)` 두 번 → 1씩만 증가(버그). `setCount((prev) => prev + 1)` 두 번 → 2씩 증가.

원문의 마지막 bullet이 시험 정답 문장이에요: "To avoid stale state, always use this syntax when the new value depends on the old one". **Stale state** = 오래된(상한) state 값.

@@K Example: Lifting State Up
**코드 해설**
- state(`count`)가 `MyButton`에서 **부모 `MyApp`으로 이사** 왔어요.
- `MyButton`은 이제 state가 없어요. `count`(보여 줄 값)와 `handlePress`(누르면 부를 함수)를 **props로 받기만** 해요.
- 그래서 부모의 `<Text>`와 버튼 제목이 **항상 같은 숫자**를 보여요. 이게 lifting state up의 목적.
- Lab 2 Question 4(농구 점수판)가 이 패턴 그대로예요.

@@K Example: useEffect
**수업 흐름 따라가기**
1. 의존성 배열 **없이** useEffect: 1초 뒤 handlePress → count 바뀜 → 다시 렌더 → effect 다시 → ... **영원히 카운트**.
2. `[]` 추가: 한 번만 실행. 하지만 handlePress를 안 적었다고 **경고**(원문 코멘트 "Safe to ignore").
3. 정답: 부모에서 `useCallback(() => {...}, [])` 으로 handlePress를 고정 + 자식은 `[handlePress]`. 경고 없음, 한 번만 실행.

`setTimeout` 은 id를 돌려주고, cleanup에서 `clearTimeout(id)` 로 타이머를 꺼요. Lab 2 Q5(스톱워치)는 `setInterval` / `clearInterval` 버전이에요. setTimeout은 **한 번**, setInterval은 **반복**.

@@K Example: Using Context for State
**코드 해설 (4단계, 원문 bullet 순서)**
1. `const CountContext = createContext();` 컨텍스트 만들기.
2. `CountProvider` 컴포넌트: state와 handlePress를 갖고 있고, `value={{ count, handlePress }}` 로 **객체 하나에 담아** 제공. `{{ }}` 는 "JS 영역 + 객체".
3. `MyButton`, `CountDisplay`: `const { count, handlePress } = useContext(CountContext);` 로 꺼내 씀. props 없음!
4. `MyApp`: `<CountProvider>`로 감싸기만. state 없음.

Provider로 감싸지 않은 곳에서 `useContext`를 쓰면 값이 `undefined`라서 에러가 나요. 자주 하는 실수!

@@K Example: Using Jotai
**코드 해설**
- `package.json`에 `jotai` 추가 필요 (Snack 링크엔 자동 포함).
- `const countAtom = atom(0);` → 컴포넌트 **바깥**(파일 맨 위)에 선언. 안에 선언하면 렌더링마다 새 atom이 생겨서 공유가 안 돼요.
- `useAtom(countAtom)` 은 `useState`랑 똑같이 `[값, setter]`를 줘요.
- `CountDisplay`는 값만 필요하니 `const [count] = useAtom(countAtom);`
- MyApp에 state도, Provider도, props도 **없어요.** Context 버전과 비교해 보세요. 코드가 훨씬 짧아요.

@@LAB lab-2.md
@@S _doc | lab
Lab 2 문제예요. 정답 대신 힌트와 참고할 예제 위치만 적어 뒀어요. 혼자 풀어 보세요.
@@K _intro
Lab 2는 Test 1 대비용으로 아주 좋은 문제들이에요. 각 문제가 어떤 인클래스 예제와 연결되는지, 어디서 실수하기 쉬운지 정리했어요. 정답 코드를 통째로 쓰기보다 **핵심 패턴**만 보여 줄게요. 직접 Snack에 쳐 보세요.
@@K A Note on AI
AI는 막혔을 때만 쓰고, 설명 못 하는 코드는 남기지 말라는 안내. 시험장에선 혼자 써야 하니 직접 타이핑 연습이 제일 중요해요.
@@K Setup
React Native만 써요(div, createRoot 없음). 허용된 스타일은 바깥 ScrollView의 `marginTop: 60` **딱 하나**. 스타일은 3주차에 배워요.
@@K Running Your App
Web 탭은 빠르지만 `Alert.alert`가 안 돼요. Q1, Q3는 Android/iOS 탭이나 Expo Go 폰으로 확인하세요.
@@K Submission
Snack 링크 하나 제출, 모든 컴포넌트는 App.js에, MyApp에서 `<Text>Question N</Text>` 제목과 함께 순서대로.
@@K Question 1 - Events and Props (1 point)
**연결 예제**: 2.1 Passing Props.
- 기본값: `{ task = "Drink water", minutes = 10 }`
- 핸들러는 **이름 있는 함수**로 (`function handlePress() {...}`), 인라인 X.
- `Alert.alert("Reminder", `${task} in ${minutes} minutes`)` 처럼 **제목이 먼저**, 메시지가 두 번째.
- 버튼 title은 task.
@@K Question 2 - Text Input and State (1 point)
**연결 예제**: 코스노트 Hooks의 TextInput 예제(controlled input).
- `const [name, setName] = useState("");`
- `<TextInput placeholder="Type your name" value={name} onChangeText={setName} />`
- 빈 문자열일 때 "stranger": `name || "stranger"` 또는 삼항 연산자. 빈 문자열 `""`은 falsy라서 `||`가 잘 동작해요.
@@K Question 3 - Toggling State and Conditional Rendering (1 point)
**연결 개념**: boolean state + 함수형 토글 `setEnabled((prev) => !prev)` + 삼항 연산자.
- 문장: `Notifications are {enabled ? "on" : "off"}`
- 토글 버튼 title도 삼항으로: on이면 "Turn notifications off".
- 보내기 버튼은 **숨기지 말고** `disabled={!enabled}`. 문제에서 "Do not hide the button" 이라고 강조했어요. `{enabled && <Button .../>}` 로 숨기면 감점!
@@K Question 4 - Lifting State Up (1 point)
**연결 예제**: 2.2 Lifting State Up.
- `ScoreButton({ label, points, onScore })`: state 없음. `onPress={() => onScore(points)}` 로 **부모에게 points를 전달**.
- `Scoreboard`: `const [score, setScore] = useState(0);` 그리고 `onScore={(p) => setScore((prev) => prev + p)}`.
- `points`가 음수(-2)여도 더하기로 처리돼요.
- New game: `setScore(0)` (이전 값과 무관하니 값 그대로 넣어도 OK).
@@K Question 5 - useEffect and Cleanup (1 point)
**연결 예제**: 2.2 useEffect + 코스노트 Cleaning up an effect.
뼈대만 보여 줄게요:
```jsx
useEffect(() => {
  if (!running) return;              // 멈춘 상태면 아무것도 안 함
  const id = setInterval(() => {
    setSeconds((prev) => prev + 1);  // 왜 함수형인지 주석 필수!
  }, 1000);
  return () => {
    console.log("Stopwatch cleanup");
    clearInterval(id);
  };
}, [running]);
```
**주석에 쓸 이유(내 말로)**: interval 안의 함수는 effect가 실행될 때 한 번 만들어져서, 그때의 `seconds`(예: 0)만 계속 기억해요. 그래서 `seconds + 1`은 매번 0+1=1이 돼서 1에서 멈춰요. 함수형은 React가 **최신 값**을 넣어 줘서 제대로 올라가요.
@@K Question 6 - Shared State Without Props (1 point)
**연결 예제**: 2.2 Using Context for State / Using Jotai.
- 조건: MyApp에 state 금지, props로 count/handler 전달 금지.
- Jotai가 더 짧아요: `const cartAtom = atom(0);` 그리고 두 컴포넌트에서 `useAtom(cartAtom)`.
- Context로 하면: `CartContext`, `CartProvider`(state 주인), MyApp에서 ScrollView를 Provider로 감싸기.
- 원문: "Both techniques are testable." **시험에 둘 다 나올 수 있어요.** 두 방법 모두 써 보세요.

@@TEXT
## ✅ Week 2 시험 대비 체크리스트

1. RN 이벤트 이름 3개? → `onPress`, `onChangeText`, `onValueChange`
2. `onPress={handlePress}` 와 `onPress={handlePress()}` 차이? → 함수 전달 / 렌더링 즉시 호출(버그)
3. `useState`가 돌려주는 것? → `[값, setter]` 배열
4. `setCount(count + 1)` 두 번이 1만 올라가는 이유? → count는 렌더링 시점 스냅샷, 둘 다 같은 값 읽음. 해결: `setCount(prev => prev + 1)`
5. `useEffect` 의존성: 없음 / `[]` / `[x]` 각각 언제 실행?
6. cleanup이 실행되는 두 시점? → unmount될 때, effect 재실행 직전
7. 의존성 배열 없이 effect에서 state를 바꾸면? → 무한 루프
8. 함수를 의존성에 넣었더니 effect가 계속 돈다. 이유와 해결? → 렌더마다 새 함수 객체 / `useCallback`
9. Lifting state up이란? → 공유 state를 가장 가까운 공통 부모로, 자식은 props와 콜백으로
10. Context 3단계? → `createContext` / `<X.Provider value>` / `useContext(X)`
11. Jotai 2개 함수? → `atom(초기값)`, `useAtom(atom)`. Provider 필요 없음
12. Web 미리보기에서 안 되는 것? → `Alert.alert`

**손으로 써 보기 과제**: 아래 앱을 보지 않고 직접 만들어 보세요. 2주차 개념(state, 함수형 업데이트, lifting, useEffect cleanup, Jotai)이 다 들어 있어요.
- 상단에 "좋아요 N개" 표시 (`LikeCounter`)
- 버튼 2개(`+1`, `+5`)는 `LikeButton` 컴포넌트, state 없이 부모에게 알리기
- 3초마다 자동으로 +1 되는 자동 모드 토글 (useEffect + setInterval + cleanup)

```jsx
import { useState, useEffect } from "react";
import { View, Text, Button } from "react-native";

function LikeButton({ amount, onLike }) {
  return <Button title={`+${amount}`} onPress={() => onLike(amount)} />;
}

export default function App() {
  const [likes, setLikes] = useState(0);
  const [auto, setAuto] = useState(false);

  useEffect(() => {
    if (!auto) return;
    const id = setInterval(() => {
      setLikes((prev) => prev + 1);
    }, 3000);
    return () => clearInterval(id);
  }, [auto]);

  const handleLike = (amount) => setLikes((prev) => prev + amount);

  return (
    <View style={{ marginTop: 100 }}>
      <Text>Likes: {likes}</Text>
      <LikeButton amount={1} onLike={handleLike} />
      <LikeButton amount={5} onLike={handleLike} />
      <Button
        title={auto ? "Stop auto like" : "Start auto like"}
        onPress={() => setAuto((prev) => !prev)}
      />
    </View>
  );
}
```

**해설**: `likes`는 부모(App)가 갖고, `LikeButton`은 몇 개 더할지(`amount`)만 부모에게 알려요(lifting state up). 자동 모드는 `[auto]`에 의존하는 effect라서 auto가 바뀔 때마다 이전 interval을 cleanup으로 끄고 새로 판단해요.
