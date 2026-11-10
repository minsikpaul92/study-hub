# 교수님 샘플시험 Part별 강의자료 매칭 (Test 1, Test 2)

> "Part 2"가 정확히 어느 것인지 애매해서, 두 샘플시험의 **모든 Part**를 매칭했어요. 둘째 Part인 **Test 1 Part B**와 **Test 2 Part B**는 맨 앞에 따로 먼저 적었어요.
> 강의자료 = 교수님 강의노트(인클래스 라이브 코딩 노트, `W주차.N` 표기)와 코스노트(seneca-ictoer.github.io/WEB530). 두 샘플시험 모두 "코드를 그대로 베끼면 안 되고 행동(behaviour)을 만족시켜야" 해서, 아래는 **어디를 보고 어떻게 응용하는지**까지 적었어요.

## 한눈에 보기 (Part B 먼저)

| 시험 | Part | 배점 | 가장 먼저 볼 곳 |
| --- | --- | --- | --- |
| Test 1 | **B** Poll 표시와 MyApp | 5 | [W1.1 Passing props](https://github.com/nick-romanidis/web530-2267-nsa/blob/main/lectures/week-01.1-notes.md), [W1.2 React Native 컴포넌트](https://github.com/nick-romanidis/web530-2267-nsa/blob/main/lectures/week-01.2-notes.md), 코스노트 [Functional Components](https://seneca-ictoer.github.io/WEB530/B-Components/func-components) |
| Test 2 | **B** Jotai 공유 state | 9 | [W2.2 Example: Using Jotai](https://github.com/nick-romanidis/web530-2267-nsa/blob/main/lectures/week-02.2-notes.md), 코스노트 [Hooks > Global State with Jotai](https://seneca-ictoer.github.io/WEB530/B-Components/hooks) |

---

## Test 1. Class Poll (24점, 35분)

### Part A. `VoteButton` (5점)

| 요구사항 | 강의자료 매칭 |
| --- | --- |
| props 3개를 받는 함수형 컴포넌트, 구조분해 | [W1.1 Example: Passing props](https://github.com/nick-romanidis/web530-2267-nsa/blob/main/lectures/week-01.1-notes.md), [Functional Components > Properties (props)](https://seneca-ictoer.github.io/WEB530/B-Components/func-components) |
| `label` 선택 prop, 기본값 `Vote` | [W1.2 Example: PropTypes and Validation](https://github.com/nick-romanidis/web530-2267-nsa/blob/main/lectures/week-01.2-notes.md) (defaultProps 또는 기본 매개변수), [Validating Props > Required Values](https://seneca-ictoer.github.io/WEB530/B-Components/validating-props) |
| PropTypes: `string.isRequired`, `func.isRequired` | [W1.2 Example: PropTypes and Validation](https://github.com/nick-romanidis/web530-2267-nsa/blob/main/lectures/week-01.2-notes.md), [Validating Props > Type Validation, Required Values, Specific types](https://seneca-ictoer.github.io/WEB530/B-Components/validating-props) |
| `Button`의 `title`, 템플릿 문자열 `LABEL CHOICE` | [W3.1 Common Components > Button](https://github.com/nick-romanidis/web530-2267-nsa/blob/main/lectures/week-03.1-notes.md), [W1.1 Example: JS-Expressions](https://github.com/nick-romanidis/web530-2267-nsa/blob/main/lectures/week-01.1-notes.md) |
| 누르면 `onVote(choice)` (인자를 넘겨 호출) | [W2.1 Example: Event Handlers](https://github.com/nick-romanidis/web530-2267-nsa/blob/main/lectures/week-02.1-notes.md), [W2.1 Example: Passing Props](https://github.com/nick-romanidis/web530-2267-nsa/blob/main/lectures/week-02.1-notes.md), [Event Handling > Event Handlers](https://seneca-ictoer.github.io/WEB530/B-Components/events) |
| state 없음 (stateless child) | [W2.2 Example: Lifting State Up](https://github.com/nick-romanidis/web530-2267-nsa/blob/main/lectures/week-02.2-notes.md) (자식은 props만, 부모가 state 소유) |

### Part B. `Poll` 표시와 `MyApp` (5점)  ← 둘째 Part

| 요구사항 | 강의자료 매칭 |
| --- | --- |
| `Poll` 컴포넌트, `question` prop | [W1.1 Example: Passing props](https://github.com/nick-romanidis/web530-2267-nsa/blob/main/lectures/week-01.1-notes.md) |
| `Text` 두 개와 `VoteButton` 세 개 (`Yes`, `No`, `Maybe`) | [W1.1 Example: Multiple Tags](https://github.com/nick-romanidis/web530-2267-nsa/blob/main/lectures/week-01.1-notes.md), [W2.1 Common Components](https://github.com/nick-romanidis/web530-2267-nsa/blob/main/lectures/week-02.1-notes.md) |
| `questions.map(...)`으로 `Poll`을 여러 개 그리기 (손으로 두 번 쓰지 않기) | [W1.2 Example: PropTypes and Validation](https://github.com/nick-romanidis/web530-2267-nsa/blob/main/lectures/week-01.2-notes.md) 안의 `topics.map(...)` 예, [W1.1 Example: JS-Expressions](https://github.com/nick-romanidis/web530-2267-nsa/blob/main/lectures/week-01.1-notes.md) |
| `key` prop (없으면 경고) | 같은 `map` 예의 `<li key={topic}>`. 코스노트 [Working with Item Lists](https://seneca-ictoer.github.io/WEB530/E-Lists/working-with-lists)에도 key 설명이 있어요 |
| PropTypes는 `VoteButton`만 | (Part A와 동일) |

### Part C. 투표 (8점)

| 요구사항 | 강의자료 매칭 |
| --- | --- |
| `Poll`이 모든 state를 소유 | [W2.2 Example: State](https://github.com/nick-romanidis/web530-2267-nsa/blob/main/lectures/week-02.2-notes.md), [W2.2 Example: Lifting State Up](https://github.com/nick-romanidis/web530-2267-nsa/blob/main/lectures/week-02.2-notes.md) |
| 제어 `TextInput` (`value` + `onChangeText`) | [W3.1 Common Components > TextInput](https://github.com/nick-romanidis/web530-2267-nsa/blob/main/lectures/week-03.1-notes.md), [Common Components > TextInput](https://seneca-ictoer.github.io/WEB530/C-Styling/common-comp) |
| 이름이 비어 있으면 버튼 대신 안내 `Text` (삼항 연산자) | [W1.1 Example: JS-Expressions](https://github.com/nick-romanidis/web530-2267-nsa/blob/main/lectures/week-01.1-notes.md) (`? :` 와 `&&`) |
| 투표 수 +1을 **함수형 setter**로: `setCount((prev) => prev + 1)` | [W2.2 Example: State](https://github.com/nick-romanidis/web530-2267-nsa/blob/main/lectures/week-02.2-notes.md), [Hooks > Updating state based on the previous value](https://seneca-ictoer.github.io/WEB530/B-Components/hooks) |
| 마지막 투표 `NAME voted CHOICE` 저장, 투표 전/후 문구 전환 | [W2.2 Example: State](https://github.com/nick-romanidis/web530-2267-nsa/blob/main/lectures/week-02.2-notes.md) (state 두 개 이상, 렌더링에서 조건 분기) |

### Part D. 열린 시간 타이머와 닫기 (6점)

| 요구사항 | 강의자료 매칭 |
| --- | --- |
| `useEffect` + `setInterval`로 1초마다 +1 | [W2.2 Example: useEffect](https://github.com/nick-romanidis/web530-2267-nsa/blob/main/lectures/week-02.2-notes.md), [Hooks > Running Side Effects with useEffect](https://seneca-ictoer.github.io/WEB530/B-Components/hooks) |
| **cleanup 함수**로 `clearInterval` | [W2.2 Example: useEffect](https://github.com/nick-romanidis/web530-2267-nsa/blob/main/lectures/week-02.2-notes.md) 안의 `return () => ...`, [Hooks > Cleaning up an effect](https://seneca-ictoer.github.io/WEB530/B-Components/hooks) |
| 닫히면 타이머 멈춤 (의존성 배열에 `closed`) | [Hooks > Effects that depend on a value](https://seneca-ictoer.github.io/WEB530/B-Components/hooks) |
| `Close poll` 버튼, 닫힌 뒤 `disabled` | [W3.1 Common Components > Button](https://github.com/nick-romanidis/web530-2267-nsa/blob/main/lectures/week-03.1-notes.md) (`disabled` prop) |
| 닫힌 뒤 투표 버튼 숨김, 메시지 분기 (`votes === 0`이면 다른 문구) | [W1.1 Example: JS-Expressions](https://github.com/nick-romanidis/web530-2267-nsa/blob/main/lectures/week-01.1-notes.md) (조건부 렌더링) |
| 폴마다 독립된 타이머와 투표 | 컴포넌트 인스턴스마다 state가 따로예요. [W2.2 Example: State](https://github.com/nick-romanidis/web530-2267-nsa/blob/main/lectures/week-02.2-notes.md) |

---

## Test 2. Quick Workout (25점, 45분)

### Part A. 스택 내비게이션 (9점)

| 요구사항 | 강의자료 매칭 |
| --- | --- |
| 1~2. 스택 만들기, 화면 3개 등록, 시작 화면 | [W4.1 Example: Stack Navigator (Step 1~3)](https://github.com/nick-romanidis/web530-2267-nsa/blob/main/lectures/week-04.1-notes.md), [Navigating > Introduction to Navigation](https://seneca-ictoer.github.io/WEB530/D-Navigation/navigating) |
| 3. `navigate`로 화면 열기 | [W4.1 Step 4 - Navigate Forward](https://github.com/nick-romanidis/web530-2267-nsa/blob/main/lectures/week-04.1-notes.md) |
| 4~5. 파라미터 `index` 보내기와 읽기, 없을 때 기본 0 | [W4.1 Example: Passing Params](https://github.com/nick-romanidis/web530-2267-nsa/blob/main/lectures/week-04.1-notes.md), [Navigating > Passing data between screens](https://seneca-ictoer.github.io/WEB530/D-Navigation/navigating) |
| 6. 현재 위에 새로 쌓기 (`push`) | [W4.1 Example: Navigate vs Push](https://github.com/nick-romanidis/web530-2267-nsa/blob/main/lectures/week-04.1-notes.md) |
| 7. 이전으로 (`goBack`) | [W4.1 Example: Going Back > Step 1](https://github.com/nick-romanidis/web530-2267-nsa/blob/main/lectures/week-04.1-notes.md) |
| 8. 스택에 있는 `Workout`으로 한 번에 (`popTo`) | [W4.1 Going Back > Step 2 (Fix the Navigate to Home Trap)](https://github.com/nick-romanidis/web530-2267-nsa/blob/main/lectures/week-04.1-notes.md), [Navigating > Moving through the stack](https://seneca-ictoer.github.io/WEB530/D-Navigation/navigating) |
| 9. 맨 처음으로 (`popToTop`) | [W4.1 Going Back > Step 3 (Pop to the Top)](https://github.com/nick-romanidis/web530-2267-nsa/blob/main/lectures/week-04.1-notes.md) |
| 화면 안에서 `navigation` 쓰기 (`useNavigation`) | [W4.1 Example: The useNavigation Hook](https://github.com/nick-romanidis/web530-2267-nsa/blob/main/lectures/week-04.1-notes.md) |

### Part B. Jotai 공유 state (9점)  ← 둘째 Part

| 요구사항 | 강의자료 매칭 |
| --- | --- |
| `atom({ rest: 30, done: [] })`를 컴포넌트 밖에서 만들기 | [W2.2 Example: Using Jotai](https://github.com/nick-romanidis/web530-2267-nsa/blob/main/lectures/week-02.2-notes.md), [Hooks > Global State with Jotai](https://seneca-ictoer.github.io/WEB530/B-Components/hooks) |
| `useAtom`으로 `[workout, setWorkout]`, 읽기만이면 `useAtomValue` | 같은 Jotai 예제 |
| `setWorkout((prev) => ({ ...prev, rest: prev.rest + 10 }))` (함수형 업데이트 + 다른 필드 유지) | [W2.2 Example: State](https://github.com/nick-romanidis/web530-2267-nsa/blob/main/lectures/week-02.2-notes.md) (함수형 setter), 객체 복사 `...prev`는 [W2.2 Example: Using Jotai](https://github.com/nick-romanidis/web530-2267-nsa/blob/main/lectures/week-02.2-notes.md) |
| 10 미만, 60 초과 방지, `disabled` 조건 | [W3.1 Common Components > Button](https://github.com/nick-romanidis/web530-2267-nsa/blob/main/lectures/week-03.1-notes.md) (`disabled`) |
| `Completed: N of 4`는 `done.length` (state에서 계산) | [W1.1 Example: JS-Expressions](https://github.com/nick-romanidis/web530-2267-nsa/blob/main/lectures/week-01.1-notes.md) |
| 중복 방지: `prev.done.includes(i) ? prev : { ...prev, done: [...prev.done, i] }` | JS 배열 문법. 업데이트 모양은 Jotai 예제와 같아요 |
| 여러 화면이 같은 atom을 읽기 (props, params 안 쓰기) | [W4.1 Example: Handling State Across Screens](https://github.com/nick-romanidis/web530-2267-nsa/blob/main/lectures/week-04.1-notes.md), [Handling State](https://seneca-ictoer.github.io/WEB530/D-Navigation/handling-state) |
| Reset: `done: []`로 비우고 `rest`는 유지 | 위와 동일한 `...prev` 패턴 |

### Part C. `styles.js` 스타일링 (7점)

| 요구사항 | 강의자료 매칭 |
| --- | --- |
| `styles.js`에 `StyleSheet.create`, 이름이 `App.js`와 일치 | [W3.1 Example: StyleSheet.create()](https://github.com/nick-romanidis/web530-2267-nsa/blob/main/lectures/week-03.1-notes.md), [React Native StyleSheets](https://seneca-ictoer.github.io/WEB530/C-Styling/stylesheets) |
| 글자 크기와 굵기 (`fontSize`, `fontWeight`) | [W3.1 Common Components > Text](https://github.com/nick-romanidis/web530-2267-nsa/blob/main/lectures/week-03.1-notes.md) |
| 한 줄에 나란히 (`flexDirection: "row"`), 양 끝으로 (`justifyContent: "space-between"`), 세로 중앙 (`alignItems: "center"`) | [W3.1 Example: Layout with Flexbox](https://github.com/nick-romanidis/web530-2267-nsa/blob/main/lectures/week-03.1-notes.md), [StyleSheets > Building responsive layouts using Flexbox](https://seneca-ictoer.github.io/WEB530/C-Styling/stylesheets). RN은 `flexDirection` 기본이 `column`이라는 점이 핵심 |
| 간격 (`gap`), 패딩, 배경색, `borderRadius` (`gap`은 W3.1에 없어서 CSS-Tricks 가이드 참고) | [W3.1 Example: StyleSheet.create()](https://github.com/nick-romanidis/web530-2267-nsa/blob/main/lectures/week-03.1-notes.md) |
| 테두리 (`borderWidth`, `borderColor`), 배열 스타일에서 뒤에 오는 `cardDone`이 덮어쓰기 | [W3.1 Example: Inline Styles / StyleSheet.create()](https://github.com/nick-romanidis/web530-2267-nsa/blob/main/lectures/week-03.1-notes.md) |
| 원형 뱃지: `width`, `height` 32, `borderRadius: 16`, 가운데 정렬 | Flexbox 예제의 `justifyContent` + `alignItems` |
| `cardName`이 남은 공간을 다 차지 (`flex: 1`) | [W3.1 Example: Layout with Flexbox](https://github.com/nick-romanidis/web530-2267-nsa/blob/main/lectures/week-03.1-notes.md) (`flex` 비율 부분) |
| 참고: 샘플시험 안내문이 CSS-Tricks Flexbox 가이드를 쓰라고 해요 (CSS 이름은 camelCase로) | 샘플시험 안내문 |

---

## 이렇게 활용하세요

1. 시험처럼 샘플 문제를 먼저 풀고 막힌 Part의 표에서 해당 노트를 열어요.
2. 노트의 예제를 **그대로 복사하지 말고** 요구사항 문장에 맞게 고쳐서 써요 (교수님이 강조).
3. 우리 사이트의 주차 해설노트(Week 1~4)에서 같은 제목을 찾으면 한글 해설도 같이 나와요.
