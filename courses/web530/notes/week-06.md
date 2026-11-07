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


**⌨️ 직접 쳐 볼 것 (이 순서대로)**

어디 칸을 누르면 그 코드로 바로 가요. 코드 위에도 ⌨️ 표시가 있어요.

| # | 어디 | 무엇을 |
| --- | --- | --- |
| 1 | [Example: Pressable › Starter Code](#practice-1) | 버튼처럼 생긴 View 시작 코드 쳐 두기 |
| 2 | [Example: Pressable › Step 1 - Make It Pressable](#practice-2) | View를 Pressable로 바꾸고 onPress에서 setTaps((prev) => prev + 1) |
| 3 | [Example: Pressable › Step 2 - Show Pressed Feedback](#practice-3) | style={({ pressed }) => [styles.button, pressed && styles.pressed]} |
| 4 | [Example: Pressable › Step 3 - Log Every Press Event](#practice-4) | onPressIn, onPressOut, onPress, onLongPress를 로그로 찍기 |
| 5 | [Example: ScrollView › Starter Code](#practice-5) | Row 30개짜리 세로 ScrollView 쳐 두기 |
| 6 | [Example: ScrollView › Step 1 - Add a Horizontal Row](#practice-6) | ScrollView horizontal + contentContainerStyle로 가로 카드 줄 추가 |
| 7 | [Example: Pressable Rows in a FlatList › Starter Code](#practice-7) | 줄 40개 FlatList 시작 코드 쳐 두기 |
| 8 | [Example: Pressable Rows in a FlatList › Step 1 - Make the Rows Pressable](#practice-8) | 줄 View를 Pressable로 바꾸고 pressed 피드백 |
| 9 | [Example: Pressable Rows in a FlatList › Step 2 - Select Rows](#practice-9) | selected 객체 state + toggle(id)로 줄 선택 표시 |
| 10 | [Example: Drag and Snap Back › Starter Code](#practice-10) | 안 움직이는 카드 시작 코드 쳐 두기 |
| 11 | [Example: Drag and Snap Back › Step 1 - Follow the Finger](#practice-11) | useRef(new Animated.Value(0)) + PanResponder로 손가락 따라가기 |
| 12 | [Example: Drag and Snap Back › Step 2 - Snap Back on Release](#practice-12) | onPanResponderRelease에서 Animated.spring으로 복귀 |
| 13 | [Example: Drag and Snap Back › Step 3 - Commit Past a Threshold](#practice-13) | Math.abs(dx) > 120이면 Animated.timing으로 밀어내고 setDismissed(true) |
| 14 | [Example: Swipe to Delete › Starter Code](#practice-14) | MessageRow가 있는 받은편지함 FlatList 쳐 두기 |
| 15 | [Example: Swipe to Delete › Step 1 - Add the Gesture Root](#practice-15) | 바깥 View를 GestureHandlerRootView로 바꾸기 |
| 16 | [Example: Swipe to Delete › Step 2 - Make the Rows Swipeable](#practice-16) | 줄을 Swipeable renderRightActions로 감싸기 |
| 17 | [Example: Swipe to Delete › Step 3 - Delete the Message](#practice-17) | remove(id)에서 filter로 지우고 onDelete prop 연결 |

나머지 👀 표시는 읽고 이해만 하면 돼요. 같은 개념을 위 예제에서 이미 타이핑해요.



## 목차

- 1. 📘 코스노트: Handling Touch
- 2. 📘 코스노트: Scrolling
- 3. 📘 코스노트: Swipeable and Cancellable
- 4. 💻 인클래스 예제: Week 6.1 - Notes and Examples
- ✅ Week 6 시험 대비 체크리스트


---

## 1. 📘 코스노트: Handling Touch

<div class="sum" data-kind="read">

**🧭 먼저 한국어로** · 👀 읽고 이해하기 (타이핑 안 해도 돼요)

탭과 길게 누르기 같은 터치를 처리하는 방법이에요. 💻 6.1 Pressable 예제에서 직접 쳐 보니까 여기서는 읽기만 해요.

**이 챕터 구성**

- 👀 **Pressable**: Gesture Responder System(GRS): 사용자가 탭하려는 건지, 스크롤하려는 건지 등을 판단하는 RN 내장 시스템.
- 👀 **Long Press, Press In, and Press Out**: 이벤트가 발생하는 순서가 핵심이에요(위 0번 표).
- 👀 **Improving Touch Targets with `hitSlop`**: 터치 대상은 최소 44×44 포인트(접근성, accessibility).
- 👀 **Android Ripple Effects**: `android_ripple={{ color: '...' }}` → Android 고유의 물결 피드백(Material Design).
- 👀 **When to Use Gesture Handler**: Pressable: 버튼, 카드, 목록 줄, 단순 탭/길게 누르기.

</div>

> 원문 출처: https://seneca-ictoer.github.io/WEB530/F-Touch/handling-touch

### 📘 Pressable

Mobile apps rely heavily on touch interactions. Users tap, press, scroll, swipe, and perform multi‑touch gestures. React Native includes a built‑in **Gesture Responder System (GRS)** that interprets these interactions and decides whether the user intends to tap, scroll, or perform another gesture. While the GRS is powerful, most apps rarely interact with it directly. Instead, React Native provides higher‑level components that simplify touch handling.

In modern React Native, the recommended way to handle taps and presses is the **Pressable** component. Pressable replaces the older `TouchableOpacity`, `TouchableHighlight`, `TouchableWithoutFeedback`, and `TouchableNativeFeedback` components. These legacy components still work, but they are no longer recommended for new code.

`Pressable` provides:

* `onPress` - simple tap
* `onLongPress` - long press
* `onPressIn` / `onPressOut` - press lifecycle events
* `android_ripple` - native ripple effects on Android
* `hitSlop` - makes touch targets easier to tap
* A **style callback** that lets you change appearance when pressed

This makes `Pressable` flexible enough to build custom buttons, cards, list items, and any other interactive UI element.

The examples on this page show feedback in a `Text` component rather than with `Alert.alert()`. Alerts work on phones, but they do nothing in the web preview.

```jsx
import { useState } from 'react';
import { Pressable, Text, StyleSheet, View } from 'react-native';

export default function App() {
  const [message, setMessage] = useState('Not pressed yet');

  return (
    <View style={styles.container}>
      <Pressable
        onPress={() => setMessage('You tapped the button.')}
        style={({ pressed }) => [
          styles.button,
          { backgroundColor: pressed ? '#1976D2' : '#2196F3' },
        ]}
      >
        <Text style={styles.buttonText}>Press Me</Text>
      </Pressable>
      <Text style={styles.message}>{message}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 60,
    alignItems: 'center',
  },
  button: {
    padding: 20,
    borderRadius: 6,
    width: 260,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
  },
  message: {
    marginTop: 20,
    fontSize: 16,
  },
});
```

▶ **[Snack에서 바로 실행하기](https://snack.expo.dev/?name=WEB530%20W6%20Pressable&platform=web&sdkVersion=54.0.0&code=import%20%7B%20useState%20%7D%20from%20%27react%27%3B%0Aimport%20%7B%20Pressable%2C%20Text%2C%20StyleSheet%2C%20View%20%7D%20from%20%27react-native%27%3B%0A%0Aexport%20default%20function%20App%28%29%20%7B%0A%20%20const%20%5Bmessage%2C%20setMessage%5D%20%3D%20useState%28%27Not%20pressed%20yet%27%29%3B%0A%0A%20%20return%20%28%0A%20%20%20%20%3CView%20style%3D%7Bstyles.container%7D%3E%0A%20%20%20%20%20%20%3CPressable%0A%20%20%20%20%20%20%20%20onPress%3D%7B%28%29%20%3D%3E%20setMessage%28%27You%20tapped%20the%20button.%27%29%7D%0A%20%20%20%20%20%20%20%20style%3D%7B%28%7B%20pressed%20%7D%29%20%3D%3E%20%5B%0A%20%20%20%20%20%20%20%20%20%20styles.button%2C%0A%20%20%20%20%20%20%20%20%20%20%7B%20backgroundColor%3A%20pressed%20%3F%20%27%231976D2%27%20%3A%20%27%232196F3%27%20%7D%2C%0A%20%20%20%20%20%20%20%20%5D%7D%0A%20%20%20%20%20%20%3E%0A%20%20%20%20%20%20%20%20%3CText%20style%3D%7Bstyles.buttonText%7D%3EPress%20Me%3C%2FText%3E%0A%20%20%20%20%20%20%3C%2FPressable%3E%0A%20%20%20%20%20%20%3CText%20style%3D%7Bstyles.message%7D%3E%7Bmessage%7D%3C%2FText%3E%0A%20%20%20%20%3C%2FView%3E%0A%20%20%29%3B%0A%7D%0A%0Aconst%20styles%20%3D%20StyleSheet.create%28%7B%0A%20%20container%3A%20%7B%0A%20%20%20%20paddingTop%3A%2060%2C%0A%20%20%20%20alignItems%3A%20%27center%27%2C%0A%20%20%7D%2C%0A%20%20button%3A%20%7B%0A%20%20%20%20padding%3A%2020%2C%0A%20%20%20%20borderRadius%3A%206%2C%0A%20%20%20%20width%3A%20260%2C%0A%20%20%20%20alignItems%3A%20%27center%27%2C%0A%20%20%7D%2C%0A%20%20buttonText%3A%20%7B%0A%20%20%20%20color%3A%20%27white%27%2C%0A%20%20%20%20fontSize%3A%2016%2C%0A%20%20%7D%2C%0A%20%20message%3A%20%7B%0A%20%20%20%20marginTop%3A%2020%2C%0A%20%20%20%20fontSize%3A%2016%2C%0A%20%20%7D%2C%0A%7D%29%3B%0A)** (SDK 54, 필요한 패키지 자동 포함) <button class="snack-embed" type="button">👀 여기서 결과 보기</button>



This example demonstrates the most important modern pattern: **Pressable’s style can change based on whether the component is pressed.**

**🇰🇷 한글 해설**

**Gesture Responder System(GRS)**: 사용자가 탭하려는 건지, 스크롤하려는 건지 등을 **판단**하는 RN 내장 시스템. 강력하지만 직접 쓸 일은 드물고, 더 쉬운 컴포넌트를 써요.

**Pressable** = 요즘 권장되는 터치 컴포넌트. 옛날 `TouchableOpacity`, `TouchableHighlight`, `TouchableWithoutFeedback`, `TouchableNativeFeedback`을 **대체**(아직 작동은 하지만 새 코드엔 비추천).

Pressable이 주는 것 (원문 6개):
- `onPress` 탭 / `onLongPress` 길게 누르기 / `onPressIn`, `onPressOut` 누르기 시작과 끝
- `android_ripple` Android 물결 효과
- `hitSlop` 터치 영역 넓히기
- **style 콜백**: 눌렸는지(`pressed`)에 따라 모양 바꾸기

예제 해설: `style={({ pressed }) => [styles.button, pressed && styles.pressed]}` → 누르는 동안만 pressed 스타일. 이 페이지는 Alert 대신 `Text`로 결과를 보여 줘요(Alert는 Web에서 안 되니까).

### 📘 Long Press, Press In, and Press Out

`Pressable` supports additional events that help you build richer interactions. The example lists each event as it fires, so you can see their order: a tap fires `onPressIn`, `onPressOut`, then `onPress`, while holding the button fires `onLongPress` instead of `onPress`. Sliding your finger off the button before lifting it cancels the press: only `onPressIn` and `onPressOut` fire, so a user who changes their mind does not trigger anything.

```jsx
import { useState } from 'react';
import { Pressable, Text, View, StyleSheet } from 'react-native';

export default function App() {
  const [events, setEvents] = useState([]);

  // Keep the five most recent events, newest first.
  const log = (name) => setEvents((prev) => [name, ...prev].slice(0, 5));

  return (
    <View style={styles.container}>
      <Pressable
        onPress={() => log('onPress (tap)')}
        onLongPress={() => log('onLongPress (held)')}
        onPressIn={() => log('onPressIn (finger down)')}
        onPressOut={() => log('onPressOut (finger lifted)')}
        style={({ pressed }) => [styles.button, { backgroundColor: pressed ? '#ddd' : '#eee' }]}
      >
        <Text>Press or Hold</Text>
      </Pressable>
      {events.map((event, i) => (
        <Text key={i}>{event}</Text>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 60,
    alignItems: 'center',
  },
  button: {
    padding: 20,
    borderRadius: 6,
    width: 260,
    alignItems: 'center',
    marginBottom: 20,
  },
});
```

▶ **[Snack에서 바로 실행하기](https://snack.expo.dev/?name=WEB530%20W6%20Long%20Press%2C%20Press%20In%2C%20and%20Press%20Out&platform=web&sdkVersion=54.0.0&code=import%20%7B%20useState%20%7D%20from%20%27react%27%3B%0Aimport%20%7B%20Pressable%2C%20Text%2C%20View%2C%20StyleSheet%20%7D%20from%20%27react-native%27%3B%0A%0Aexport%20default%20function%20App%28%29%20%7B%0A%20%20const%20%5Bevents%2C%20setEvents%5D%20%3D%20useState%28%5B%5D%29%3B%0A%0A%20%20%2F%2F%20Keep%20the%20five%20most%20recent%20events%2C%20newest%20first.%0A%20%20const%20log%20%3D%20%28name%29%20%3D%3E%20setEvents%28%28prev%29%20%3D%3E%20%5Bname%2C%20...prev%5D.slice%280%2C%205%29%29%3B%0A%0A%20%20return%20%28%0A%20%20%20%20%3CView%20style%3D%7Bstyles.container%7D%3E%0A%20%20%20%20%20%20%3CPressable%0A%20%20%20%20%20%20%20%20onPress%3D%7B%28%29%20%3D%3E%20log%28%27onPress%20%28tap%29%27%29%7D%0A%20%20%20%20%20%20%20%20onLongPress%3D%7B%28%29%20%3D%3E%20log%28%27onLongPress%20%28held%29%27%29%7D%0A%20%20%20%20%20%20%20%20onPressIn%3D%7B%28%29%20%3D%3E%20log%28%27onPressIn%20%28finger%20down%29%27%29%7D%0A%20%20%20%20%20%20%20%20onPressOut%3D%7B%28%29%20%3D%3E%20log%28%27onPressOut%20%28finger%20lifted%29%27%29%7D%0A%20%20%20%20%20%20%20%20style%3D%7B%28%7B%20pressed%20%7D%29%20%3D%3E%20%5Bstyles.button%2C%20%7B%20backgroundColor%3A%20pressed%20%3F%20%27%23ddd%27%20%3A%20%27%23eee%27%20%7D%5D%7D%0A%20%20%20%20%20%20%3E%0A%20%20%20%20%20%20%20%20%3CText%3EPress%20or%20Hold%3C%2FText%3E%0A%20%20%20%20%20%20%3C%2FPressable%3E%0A%20%20%20%20%20%20%7Bevents.map%28%28event%2C%20i%29%20%3D%3E%20%28%0A%20%20%20%20%20%20%20%20%3CText%20key%3D%7Bi%7D%3E%7Bevent%7D%3C%2FText%3E%0A%20%20%20%20%20%20%29%29%7D%0A%20%20%20%20%3C%2FView%3E%0A%20%20%29%3B%0A%7D%0A%0Aconst%20styles%20%3D%20StyleSheet.create%28%7B%0A%20%20container%3A%20%7B%0A%20%20%20%20paddingTop%3A%2060%2C%0A%20%20%20%20alignItems%3A%20%27center%27%2C%0A%20%20%7D%2C%0A%20%20button%3A%20%7B%0A%20%20%20%20padding%3A%2020%2C%0A%20%20%20%20borderRadius%3A%206%2C%0A%20%20%20%20width%3A%20260%2C%0A%20%20%20%20alignItems%3A%20%27center%27%2C%0A%20%20%20%20marginBottom%3A%2020%2C%0A%20%20%7D%2C%0A%7D%29%3B%0A)** (SDK 54, 필요한 패키지 자동 포함) <button class="snack-embed" type="button">👀 여기서 결과 보기</button>



**🇰🇷 한글 해설**

이벤트가 발생하는 **순서**가 핵심이에요(위 0번 표).
- 탭: `onPressIn` → `onPressOut` → `onPress`
- 길게 누름: `onPress` 대신 `onLongPress`
- 손가락을 버튼 밖으로 빼고 떼면 **취소**: `onPressIn`, `onPressOut`만. 마음을 바꾼 사용자가 실수로 실행하지 않게.

### 📘 Improving Touch Targets with `hitSlop`

Touch targets should be at least 44×44 points for accessibility. If your UI element is small, you can expand its touch area:

```jsx
import { useState } from 'react';
import { Pressable, Text, View, StyleSheet } from 'react-native';

export default function App() {
  const [taps, setTaps] = useState(0);

  return (
    <View style={styles.container}>
      <Pressable hitSlop={20} onPress={() => setTaps((prev) => prev + 1)}>
        <Text style={styles.smallText}>Small Icon</Text>
      </Pressable>
      <Text>Taps: {taps}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 60,
    alignItems: 'center',
  },
  smallText: {
    fontSize: 14,
    padding: 10,
  },
});
```

▶ **[Snack에서 바로 실행하기](https://snack.expo.dev/?name=WEB530%20W6%20Improving%20Touch%20Targets%20with%20%60hitSlop%60&platform=web&sdkVersion=54.0.0&code=import%20%7B%20useState%20%7D%20from%20%27react%27%3B%0Aimport%20%7B%20Pressable%2C%20Text%2C%20View%2C%20StyleSheet%20%7D%20from%20%27react-native%27%3B%0A%0Aexport%20default%20function%20App%28%29%20%7B%0A%20%20const%20%5Btaps%2C%20setTaps%5D%20%3D%20useState%280%29%3B%0A%0A%20%20return%20%28%0A%20%20%20%20%3CView%20style%3D%7Bstyles.container%7D%3E%0A%20%20%20%20%20%20%3CPressable%20hitSlop%3D%7B20%7D%20onPress%3D%7B%28%29%20%3D%3E%20setTaps%28%28prev%29%20%3D%3E%20prev%20%2B%201%29%7D%3E%0A%20%20%20%20%20%20%20%20%3CText%20style%3D%7Bstyles.smallText%7D%3ESmall%20Icon%3C%2FText%3E%0A%20%20%20%20%20%20%3C%2FPressable%3E%0A%20%20%20%20%20%20%3CText%3ETaps%3A%20%7Btaps%7D%3C%2FText%3E%0A%20%20%20%20%3C%2FView%3E%0A%20%20%29%3B%0A%7D%0A%0Aconst%20styles%20%3D%20StyleSheet.create%28%7B%0A%20%20container%3A%20%7B%0A%20%20%20%20paddingTop%3A%2060%2C%0A%20%20%20%20alignItems%3A%20%27center%27%2C%0A%20%20%7D%2C%0A%20%20smallText%3A%20%7B%0A%20%20%20%20fontSize%3A%2014%2C%0A%20%20%20%20padding%3A%2010%2C%0A%20%20%7D%2C%0A%7D%29%3B%0A)** (SDK 54, 필요한 패키지 자동 포함) <button class="snack-embed" type="button">👀 여기서 결과 보기</button>



`hitSlop={20}` adds 20 points of invisible padding around the element, so the touch area grows without changing the layout. It also accepts an object such as `{ top: 10, bottom: 10 }` to extend one side at a time. Keep the slop smaller than the gap to the next touch target, or a tap may land on the wrong one.

The web preview ignores `hitSlop`, so a click just outside the text does nothing there. Choose **My Device** and run the example on your phone to feel the difference.

**🇰🇷 한글 해설**

- 터치 대상은 **최소 44×44 포인트**(접근성, accessibility).
- `hitSlop={20}` → 주변에 **보이지 않는 20포인트 여유**를 줘서 레이아웃은 그대로, 터치 영역만 커짐.
- 객체로 한쪽씩도 가능: `{ top: 10, bottom: 10 }`.
- 주의: 옆 버튼과의 간격보다 작게. 겹치면 엉뚱한 버튼이 눌려요.
- **Web 미리보기는 hitSlop을 무시**해요. 폰에서 확인.

### 📘 Android Ripple Effects

`Pressable` supports native Android ripple feedback:

```jsx
import { useState } from 'react';
import { Pressable, Text, View, StyleSheet, Platform } from 'react-native';

export default function App() {
  const [taps, setTaps] = useState(0);

  return (
    <View style={styles.container}>
      <Pressable
        onPress={() => setTaps((prev) => prev + 1)}
        android_ripple={{
          color: 'rgba(0,0,0,0.3)',
          foreground: true,
        }}
        style={styles.rippleButton}
      >
        <Text style={styles.text}>Android Ripple (Visible)</Text>
      </Pressable>
      <Text>Taps: {taps}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 60,
    alignItems: 'center',
    gap: 20,
  },
  rippleButton: {
    padding: 20,
    borderRadius: 8,
    backgroundColor: '#E3F2FD', // light background so ripple is visible
    overflow: Platform.OS === 'android' ? 'hidden' : 'visible', // required for ripple clipping
  },
  text: {
    fontSize: 16,
  },
});
```

▶ **[Snack에서 바로 실행하기](https://snack.expo.dev/?name=WEB530%20W6%20Android%20Ripple%20Effects&platform=web&sdkVersion=54.0.0&code=import%20%7B%20useState%20%7D%20from%20%27react%27%3B%0Aimport%20%7B%20Pressable%2C%20Text%2C%20View%2C%20StyleSheet%2C%20Platform%20%7D%20from%20%27react-native%27%3B%0A%0Aexport%20default%20function%20App%28%29%20%7B%0A%20%20const%20%5Btaps%2C%20setTaps%5D%20%3D%20useState%280%29%3B%0A%0A%20%20return%20%28%0A%20%20%20%20%3CView%20style%3D%7Bstyles.container%7D%3E%0A%20%20%20%20%20%20%3CPressable%0A%20%20%20%20%20%20%20%20onPress%3D%7B%28%29%20%3D%3E%20setTaps%28%28prev%29%20%3D%3E%20prev%20%2B%201%29%7D%0A%20%20%20%20%20%20%20%20android_ripple%3D%7B%7B%0A%20%20%20%20%20%20%20%20%20%20color%3A%20%27rgba%280%2C0%2C0%2C0.3%29%27%2C%0A%20%20%20%20%20%20%20%20%20%20foreground%3A%20true%2C%0A%20%20%20%20%20%20%20%20%7D%7D%0A%20%20%20%20%20%20%20%20style%3D%7Bstyles.rippleButton%7D%0A%20%20%20%20%20%20%3E%0A%20%20%20%20%20%20%20%20%3CText%20style%3D%7Bstyles.text%7D%3EAndroid%20Ripple%20%28Visible%29%3C%2FText%3E%0A%20%20%20%20%20%20%3C%2FPressable%3E%0A%20%20%20%20%20%20%3CText%3ETaps%3A%20%7Btaps%7D%3C%2FText%3E%0A%20%20%20%20%3C%2FView%3E%0A%20%20%29%3B%0A%7D%0A%0Aconst%20styles%20%3D%20StyleSheet.create%28%7B%0A%20%20container%3A%20%7B%0A%20%20%20%20paddingTop%3A%2060%2C%0A%20%20%20%20alignItems%3A%20%27center%27%2C%0A%20%20%20%20gap%3A%2020%2C%0A%20%20%7D%2C%0A%20%20rippleButton%3A%20%7B%0A%20%20%20%20padding%3A%2020%2C%0A%20%20%20%20borderRadius%3A%208%2C%0A%20%20%20%20backgroundColor%3A%20%27%23E3F2FD%27%2C%20%2F%2F%20light%20background%20so%20ripple%20is%20visible%0A%20%20%20%20overflow%3A%20Platform.OS%20%3D%3D%3D%20%27android%27%20%3F%20%27hidden%27%20%3A%20%27visible%27%2C%20%2F%2F%20required%20for%20ripple%20clipping%0A%20%20%7D%2C%0A%20%20text%3A%20%7B%0A%20%20%20%20fontSize%3A%2016%2C%0A%20%20%7D%2C%0A%7D%29%3B%0A)** (SDK 54, 필요한 패키지 자동 포함) <button class="snack-embed" type="button">👀 여기서 결과 보기</button>



Ripple effects automatically adapt to Material Design guidelines. They only appear on Android, so switch the preview to **Android** (or use **My Device** with an Android phone) to see one.

**🇰🇷 한글 해설**

`android_ripple={{ color: '...' }}` → Android 고유의 물결 피드백(Material Design). **Android에서만** 보여요.

### 📘 When to Use Gesture Handler

`Pressable` is perfect for:

* Buttons
* Cards
* List items
* Simple taps and long presses

For more advanced gestures, use the Gesture Handler library:

* Swipes
* Drags
* Panning
* Pinch‑to‑zoom
* Complex gesture combinations

Gesture Handler describes each gesture with the `Gesture` API and attaches it to a component with `GestureDetector`:

* `Gesture.Tap()`
* `Gesture.LongPress()`
* `Gesture.Pan()` (drags and swipes)
* `Gesture.Pinch()`

These are ideal for building custom gesture‑driven UI.

**🇰🇷 한글 해설**

**Pressable**: 버튼, 카드, 목록 줄, 단순 탭/길게 누르기.
**Gesture Handler 라이브러리**: 스와이프, 드래그, 패닝(panning, 끌어서 이동), 핀치 줌(두 손가락 확대), 복잡한 조합.
- `Gesture` API로 제스처를 정의하고 `GestureDetector`로 컴포넌트에 붙여요.
- `Gesture.Tap()`, `Gesture.LongPress()`, `Gesture.Pan()`(드래그, 스와이프), `Gesture.Pinch()`.


---

## 2. 📘 코스노트: Scrolling

<div class="sum" data-kind="read">

**🧭 먼저 한국어로** · 👀 읽고 이해하기 (타이핑 안 해도 돼요)

ScrollView와 FlatList 스크롤 정리예요. 읽고 개념만 잡으면 돼요.

**이 챕터 구성**

- 👀 **Scrolling with your fingers**: `ScrollView`는 자식을 전부 한 번에 렌더링.
- 👀 **ScrollView vs FlatList**: FlatList는 화면에 나타날 때 렌더링(lazy), 화면 밖으로 나가면 unmount, virtualization, 구분선, 여러 열, 당겨서 새로고침, 무한 스크롤 지원.
- 👀 **SafeAreaView**: 노치나 둥근 모서리가 있는 iOS 기기에서 시스템 UI(상태바, 홈 인디케이터)에 내용이 가려질 수 있어요.
- 👀 **Basic ScrollView Example**: SafeAreaView로 감싼 세로 ScrollView.
- 👀 **Horizontal Scrolling**: `<ScrollView horizontal>` → 가로 스크롤.
- 👀 **Momentum and Natural Scrolling**: 스크롤은 continuous(손가락이 움직이는 동안 매 프레임), 탭은 discrete(한 번).
- 👀 **Nested Scrolling**: 중첩 스크롤: 세로 페이지 안에 가로 카드 줄(앱스토어 홈 화면처럼).
- 👀 **Scrolling and Touch Together**: 목록 줄은 스크롤도 되고 탭도 돼야 해요. 둘 다 손가락이 줄 위에서 시작하는데 RN이 판단해요:

</div>

> 원문 출처: https://seneca-ictoer.github.io/WEB530/F-Touch/scrolling

### 📘 Scrolling with your fingers

Scrolling is one of the most common gestures in mobile apps. Users swipe vertically to read long content, swipe horizontally to browse galleries, and pan through screens of information. In React Native, scrolling is typically implemented using the `ScrollView` component.

A `ScrollView` renders **all of its children at once**, which makes it ideal for:

* Static content
* Short lists
* Forms
* Articles or long text blocks

However, because it renders everything up front, a `ScrollView` must have a **bounded height**. If you do not constrain its height, it will expand to fit all its children and will not scroll.

**🇰🇷 한글 해설**

`ScrollView`는 자식을 **전부 한 번에** 렌더링. 그래서 정적 콘텐츠, 짧은 목록, 폼, 긴 글에 적합.
**주의**: ScrollView는 **높이가 제한(bounded height)** 되어야 해요. 제한이 없으면 자식 크기만큼 늘어나서 스크롤이 안 돼요.

### 📘 ScrollView vs FlatList

While `ScrollView` is simple and flexible, it is **not** the best choice for large or dynamic lists. For those cases, React Native provides [FlatList](https://seneca-ictoer.github.io/WEB530/E-Lists/working-with-lists), which:

* Renders items lazily as they appear on screen
* Unmounts items that scroll off screen
* Uses virtualization for performance
* Supports separators, multiple columns, pull‑to‑refresh, and infinite scrolling

Use this rule of thumb:

* **ScrollView** → small, static content
* **FlatList** → large or dynamic lists

**🇰🇷 한글 해설**

FlatList는 화면에 나타날 때 렌더링(lazy), 화면 밖으로 나가면 **unmount**, virtualization, 구분선, 여러 열, 당겨서 새로고침, 무한 스크롤 지원.
**규칙**: ScrollView → 작고 정적인 콘텐츠 / FlatList → 크거나 동적인 목록.

### 📘 SafeAreaView

On modern iOS devices with notches or rounded corners, content can be obscured by system UI. `SafeAreaView` ensures your content stays within the visible safe area by automatically applying padding.

It is recommended for:

* Full‑screen layouts
* Scrollable screens
* Any screen where content touches the edges

**🇰🇷 한글 해설**

노치나 둥근 모서리가 있는 iOS 기기에서 시스템 UI(상태바, 홈 인디케이터)에 내용이 가려질 수 있어요. `SafeAreaView`는 보이는 **안전 영역** 안에 내용이 있도록 자동으로 패딩을 줘요. 전체 화면, 스크롤 화면, 가장자리에 닿는 화면에 권장.

### 📘 Basic ScrollView Example

The example below shows a vertical `ScrollView` wrapped in a `SafeAreaView`. The text is repeated so it extends beyond the screen, and the user can scroll naturally with their finger.

```jsx
import { StyleSheet, Text, ScrollView } from 'react-native';
import { SafeAreaView, SafeAreaProvider } from 'react-native-safe-area-context';

const paragraph =
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor ' +
  'incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud ' +
  'exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure ' +
  'dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.';

export default function App() {
  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
        <ScrollView style={styles.scrollView} contentContainerStyle={styles.contentContainer}>
          {Array.from({ length: 6 }, (_, i) => (
            <Text key={i} style={styles.text}>
              {i + 1}. {paragraph}
            </Text>
          ))}
        </ScrollView>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    marginHorizontal: 20,
    backgroundColor: '#FCE4EC',
  },
  contentContainer: {
    padding: 20,
  },
  text: {
    fontSize: 18,
    lineHeight: 28,
    marginBottom: 20,
  },
});
```

▶ **[Snack에서 바로 실행하기](https://snack.expo.dev/?name=WEB530%20W6%20Basic%20ScrollView%20Example&platform=web&sdkVersion=54.0.0&code=import%20%7B%20StyleSheet%2C%20Text%2C%20ScrollView%20%7D%20from%20%27react-native%27%3B%0Aimport%20%7B%20SafeAreaView%2C%20SafeAreaProvider%20%7D%20from%20%27react-native-safe-area-context%27%3B%0A%0Aconst%20paragraph%20%3D%0A%20%20%27Lorem%20ipsum%20dolor%20sit%20amet%2C%20consectetur%20adipiscing%20elit%2C%20sed%20do%20eiusmod%20tempor%20%27%20%2B%0A%20%20%27incididunt%20ut%20labore%20et%20dolore%20magna%20aliqua.%20Ut%20enim%20ad%20minim%20veniam%2C%20quis%20nostrud%20%27%20%2B%0A%20%20%27exercitation%20ullamco%20laboris%20nisi%20ut%20aliquip%20ex%20ea%20commodo%20consequat.%20Duis%20aute%20irure%20%27%20%2B%0A%20%20%27dolor%20in%20reprehenderit%20in%20voluptate%20velit%20esse%20cillum%20dolore%20eu%20fugiat%20nulla%20pariatur.%27%3B%0A%0Aexport%20default%20function%20App%28%29%20%7B%0A%20%20return%20%28%0A%20%20%20%20%3CSafeAreaProvider%3E%0A%20%20%20%20%20%20%3CSafeAreaView%20style%3D%7Bstyles.container%7D%3E%0A%20%20%20%20%20%20%20%20%3CScrollView%20style%3D%7Bstyles.scrollView%7D%20contentContainerStyle%3D%7Bstyles.contentContainer%7D%3E%0A%20%20%20%20%20%20%20%20%20%20%7BArray.from%28%7B%20length%3A%206%20%7D%2C%20%28_%2C%20i%29%20%3D%3E%20%28%0A%20%20%20%20%20%20%20%20%20%20%20%20%3CText%20key%3D%7Bi%7D%20style%3D%7Bstyles.text%7D%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%7Bi%20%2B%201%7D.%20%7Bparagraph%7D%0A%20%20%20%20%20%20%20%20%20%20%20%20%3C%2FText%3E%0A%20%20%20%20%20%20%20%20%20%20%29%29%7D%0A%20%20%20%20%20%20%20%20%3C%2FScrollView%3E%0A%20%20%20%20%20%20%3C%2FSafeAreaView%3E%0A%20%20%20%20%3C%2FSafeAreaProvider%3E%0A%20%20%29%3B%0A%7D%0A%0Aconst%20styles%20%3D%20StyleSheet.create%28%7B%0A%20%20container%3A%20%7B%0A%20%20%20%20flex%3A%201%2C%0A%20%20%7D%2C%0A%20%20scrollView%3A%20%7B%0A%20%20%20%20marginHorizontal%3A%2020%2C%0A%20%20%20%20backgroundColor%3A%20%27%23FCE4EC%27%2C%0A%20%20%7D%2C%0A%20%20contentContainer%3A%20%7B%0A%20%20%20%20padding%3A%2020%2C%0A%20%20%7D%2C%0A%20%20text%3A%20%7B%0A%20%20%20%20fontSize%3A%2018%2C%0A%20%20%20%20lineHeight%3A%2028%2C%0A%20%20%20%20marginBottom%3A%2020%2C%0A%20%20%7D%2C%0A%7D%29%3B%0A&dependencies=react-native-safe-area-context%40~5.6.0)** (SDK 54, 필요한 패키지 자동 포함) <button class="snack-embed" type="button">👀 여기서 결과 보기</button>



**🇰🇷 한글 해설**

**코드 해설**: SafeAreaView로 감싼 세로 ScrollView. 글을 반복해서 화면보다 길게 만들어 손가락으로 스크롤.

### 📘 Horizontal Scrolling

ScrollView also supports horizontal scrolling:

```jsx
import { StyleSheet, Text, View, ScrollView } from 'react-native';
import { SafeAreaView, SafeAreaProvider } from 'react-native-safe-area-context';

export default function App() {
  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
        <Text style={styles.title}>Horizontal ScrollView</Text>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          <View style={[styles.card, { backgroundColor: '#FFCDD2' }]}>
            <Text style={styles.cardText}>Card 1</Text>
          </View>

          <View style={[styles.card, { backgroundColor: '#F8BBD0' }]}>
            <Text style={styles.cardText}>Card 2</Text>
          </View>

          <View style={[styles.card, { backgroundColor: '#E1BEE7' }]}>
            <Text style={styles.cardText}>Card 3</Text>
          </View>

          <View style={[styles.card, { backgroundColor: '#D1C4E9' }]}>
            <Text style={styles.cardText}>Card 4</Text>
          </View>

          <View style={[styles.card, { backgroundColor: '#C5CAE9' }]}>
            <Text style={styles.cardText}>Card 5</Text>
          </View>
        </ScrollView>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: '600',
    marginLeft: 20,
    marginBottom: 10,
  },
  scrollContent: {
    paddingHorizontal: 20,
  },
  card: {
    width: 200,
    height: 150,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  cardText: {
    fontSize: 18,
    fontWeight: '500',
  },
});
```

▶ **[Snack에서 바로 실행하기](https://snack.expo.dev/?name=WEB530%20W6%20Horizontal%20Scrolling&platform=web&sdkVersion=54.0.0&code=import%20%7B%20StyleSheet%2C%20Text%2C%20View%2C%20ScrollView%20%7D%20from%20%27react-native%27%3B%0Aimport%20%7B%20SafeAreaView%2C%20SafeAreaProvider%20%7D%20from%20%27react-native-safe-area-context%27%3B%0A%0Aexport%20default%20function%20App%28%29%20%7B%0A%20%20return%20%28%0A%20%20%20%20%3CSafeAreaProvider%3E%0A%20%20%20%20%20%20%3CSafeAreaView%20style%3D%7Bstyles.container%7D%3E%0A%20%20%20%20%20%20%20%20%3CText%20style%3D%7Bstyles.title%7D%3EHorizontal%20ScrollView%3C%2FText%3E%0A%0A%20%20%20%20%20%20%20%20%3CScrollView%0A%20%20%20%20%20%20%20%20%20%20horizontal%0A%20%20%20%20%20%20%20%20%20%20showsHorizontalScrollIndicator%3D%7Bfalse%7D%0A%20%20%20%20%20%20%20%20%20%20contentContainerStyle%3D%7Bstyles.scrollContent%7D%0A%20%20%20%20%20%20%20%20%3E%0A%20%20%20%20%20%20%20%20%20%20%3CView%20style%3D%7B%5Bstyles.card%2C%20%7B%20backgroundColor%3A%20%27%23FFCDD2%27%20%7D%5D%7D%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%3CText%20style%3D%7Bstyles.cardText%7D%3ECard%201%3C%2FText%3E%0A%20%20%20%20%20%20%20%20%20%20%3C%2FView%3E%0A%0A%20%20%20%20%20%20%20%20%20%20%3CView%20style%3D%7B%5Bstyles.card%2C%20%7B%20backgroundColor%3A%20%27%23F8BBD0%27%20%7D%5D%7D%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%3CText%20style%3D%7Bstyles.cardText%7D%3ECard%202%3C%2FText%3E%0A%20%20%20%20%20%20%20%20%20%20%3C%2FView%3E%0A%0A%20%20%20%20%20%20%20%20%20%20%3CView%20style%3D%7B%5Bstyles.card%2C%20%7B%20backgroundColor%3A%20%27%23E1BEE7%27%20%7D%5D%7D%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%3CText%20style%3D%7Bstyles.cardText%7D%3ECard%203%3C%2FText%3E%0A%20%20%20%20%20%20%20%20%20%20%3C%2FView%3E%0A%0A%20%20%20%20%20%20%20%20%20%20%3CView%20style%3D%7B%5Bstyles.card%2C%20%7B%20backgroundColor%3A%20%27%23D1C4E9%27%20%7D%5D%7D%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%3CText%20style%3D%7Bstyles.cardText%7D%3ECard%204%3C%2FText%3E%0A%20%20%20%20%20%20%20%20%20%20%3C%2FView%3E%0A%0A%20%20%20%20%20%20%20%20%20%20%3CView%20style%3D%7B%5Bstyles.card%2C%20%7B%20backgroundColor%3A%20%27%23C5CAE9%27%20%7D%5D%7D%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%3CText%20style%3D%7Bstyles.cardText%7D%3ECard%205%3C%2FText%3E%0A%20%20%20%20%20%20%20%20%20%20%3C%2FView%3E%0A%20%20%20%20%20%20%20%20%3C%2FScrollView%3E%0A%20%20%20%20%20%20%3C%2FSafeAreaView%3E%0A%20%20%20%20%3C%2FSafeAreaProvider%3E%0A%20%20%29%3B%0A%7D%0A%0Aconst%20styles%20%3D%20StyleSheet.create%28%7B%0A%20%20container%3A%20%7B%0A%20%20%20%20flex%3A%201%2C%0A%20%20%20%20paddingTop%3A%2020%2C%0A%20%20%7D%2C%0A%20%20title%3A%20%7B%0A%20%20%20%20fontSize%3A%2022%2C%0A%20%20%20%20fontWeight%3A%20%27600%27%2C%0A%20%20%20%20marginLeft%3A%2020%2C%0A%20%20%20%20marginBottom%3A%2010%2C%0A%20%20%7D%2C%0A%20%20scrollContent%3A%20%7B%0A%20%20%20%20paddingHorizontal%3A%2020%2C%0A%20%20%7D%2C%0A%20%20card%3A%20%7B%0A%20%20%20%20width%3A%20200%2C%0A%20%20%20%20height%3A%20150%2C%0A%20%20%20%20borderRadius%3A%2012%2C%0A%20%20%20%20justifyContent%3A%20%27center%27%2C%0A%20%20%20%20alignItems%3A%20%27center%27%2C%0A%20%20%20%20marginRight%3A%2015%2C%0A%20%20%7D%2C%0A%20%20cardText%3A%20%7B%0A%20%20%20%20fontSize%3A%2018%2C%0A%20%20%20%20fontWeight%3A%20%27500%27%2C%0A%20%20%7D%2C%0A%7D%29%3B%0A&dependencies=react-native-safe-area-context%40~5.6.0)** (SDK 54, 필요한 패키지 자동 포함) <button class="snack-embed" type="button">👀 여기서 결과 보기</button>



This is useful for:

* Image carousels
* Category chips
* Horizontal menus

**When NOT to use ScrollView**

Avoid ScrollView when:

* You have hundreds or thousands of items
* Items are loaded from a server
* You need infinite scrolling
* You need pull‑to‑refresh
* You need item separators or multi‑column layouts

In these cases, FlatList is the correct choice.

**🇰🇷 한글 해설**

`<ScrollView horizontal>` → 가로 스크롤. 이미지 캐러셀, 카테고리 칩, 가로 메뉴에 사용.
**ScrollView를 피해야 할 때 (원문 5개)**: 수백, 수천 개 / 서버에서 불러옴 / 무한 스크롤 / 당겨서 새로고침 / 구분선이나 여러 열 → 이럴 땐 FlatList.

### 📘 Momentum and Natural Scrolling

Scrolling is a **continuous** gesture: the content moves every frame for as long as the finger moves. A tap or a long press, by contrast, is a **discrete** gesture that fires once and is over.

Mobile scrolling also has momentum. A quick flick keeps the content moving after the finger lifts, and it slows down on its own. A slow drag moves exactly as far as the finger. `ScrollView` and `FlatList` use the platform's own scrolling, so this behaviour matches every other app on the phone without any extra code. The web preview scrolls with the mouse wheel or trackpad instead, so try the examples on your phone with **My Device** to feel it.

**🇰🇷 한글 해설**

- 스크롤은 **continuous**(손가락이 움직이는 동안 매 프레임), 탭은 **discrete**(한 번).
- **Momentum(관성)**: 빠르게 튕기면 손을 떼도 계속 움직이다가 저절로 느려짐. 천천히 끌면 손가락만큼만.
- ScrollView, FlatList는 **플랫폼 자체 스크롤**을 써서 코드 없이도 다른 앱과 똑같은 느낌. Web은 마우스 휠이라 폰에서 느껴 보세요.

### 📘 Nested Scrolling

A horizontal list inside a vertical page is a common layout: think of an app store's home screen, with rows of cards that scroll sideways inside a page that scrolls down. React Native gives each drag to the scroll view that matches its direction, so a sideways drag on the cards moves the cards and an upward drag moves the page.

```jsx
import { ScrollView, View, Text, StyleSheet } from 'react-native';

const cards = Array.from({ length: 10 }, (_, i) => `Card ${i + 1}`);
const rows = Array.from({ length: 30 }, (_, i) => `Item ${i + 1}`);

export default function App() {
  return (
    <ScrollView style={styles.container}>
      <Text style={styles.heading}>Featured</Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.cards}
      >
        {cards.map((card) => (
          <View key={card} style={styles.card}>
            <Text style={styles.text}>{card}</Text>
          </View>
        ))}
      </ScrollView>
      {rows.map((row) => (
        <View key={row} style={styles.row}>
          <Text style={styles.text}>{row}</Text>
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, marginTop: 60 },
  heading: { fontSize: 22, fontWeight: '600', padding: 20 },
  cards: { paddingHorizontal: 20, paddingBottom: 20 },
  card: {
    width: 150,
    height: 150,
    marginRight: 15,
    borderRadius: 12,
    backgroundColor: '#dde',
    justifyContent: 'center',
    alignItems: 'center',
  },
  row: { padding: 20, borderBottomWidth: 1, borderColor: '#ccc' },
  text: { fontSize: 18 },
});
```

▶ **[Snack에서 바로 실행하기](https://snack.expo.dev/?name=WEB530%20W6%20Nested%20Scrolling&platform=web&sdkVersion=54.0.0&code=import%20%7B%20ScrollView%2C%20View%2C%20Text%2C%20StyleSheet%20%7D%20from%20%27react-native%27%3B%0A%0Aconst%20cards%20%3D%20Array.from%28%7B%20length%3A%2010%20%7D%2C%20%28_%2C%20i%29%20%3D%3E%20%60Card%20%24%7Bi%20%2B%201%7D%60%29%3B%0Aconst%20rows%20%3D%20Array.from%28%7B%20length%3A%2030%20%7D%2C%20%28_%2C%20i%29%20%3D%3E%20%60Item%20%24%7Bi%20%2B%201%7D%60%29%3B%0A%0Aexport%20default%20function%20App%28%29%20%7B%0A%20%20return%20%28%0A%20%20%20%20%3CScrollView%20style%3D%7Bstyles.container%7D%3E%0A%20%20%20%20%20%20%3CText%20style%3D%7Bstyles.heading%7D%3EFeatured%3C%2FText%3E%0A%20%20%20%20%20%20%3CScrollView%0A%20%20%20%20%20%20%20%20horizontal%0A%20%20%20%20%20%20%20%20showsHorizontalScrollIndicator%3D%7Bfalse%7D%0A%20%20%20%20%20%20%20%20contentContainerStyle%3D%7Bstyles.cards%7D%0A%20%20%20%20%20%20%3E%0A%20%20%20%20%20%20%20%20%7Bcards.map%28%28card%29%20%3D%3E%20%28%0A%20%20%20%20%20%20%20%20%20%20%3CView%20key%3D%7Bcard%7D%20style%3D%7Bstyles.card%7D%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%3CText%20style%3D%7Bstyles.text%7D%3E%7Bcard%7D%3C%2FText%3E%0A%20%20%20%20%20%20%20%20%20%20%3C%2FView%3E%0A%20%20%20%20%20%20%20%20%29%29%7D%0A%20%20%20%20%20%20%3C%2FScrollView%3E%0A%20%20%20%20%20%20%7Brows.map%28%28row%29%20%3D%3E%20%28%0A%20%20%20%20%20%20%20%20%3CView%20key%3D%7Brow%7D%20style%3D%7Bstyles.row%7D%3E%0A%20%20%20%20%20%20%20%20%20%20%3CText%20style%3D%7Bstyles.text%7D%3E%7Brow%7D%3C%2FText%3E%0A%20%20%20%20%20%20%20%20%3C%2FView%3E%0A%20%20%20%20%20%20%29%29%7D%0A%20%20%20%20%3C%2FScrollView%3E%0A%20%20%29%3B%0A%7D%0A%0Aconst%20styles%20%3D%20StyleSheet.create%28%7B%0A%20%20container%3A%20%7B%20flex%3A%201%2C%20marginTop%3A%2060%20%7D%2C%0A%20%20heading%3A%20%7B%20fontSize%3A%2022%2C%20fontWeight%3A%20%27600%27%2C%20padding%3A%2020%20%7D%2C%0A%20%20cards%3A%20%7B%20paddingHorizontal%3A%2020%2C%20paddingBottom%3A%2020%20%7D%2C%0A%20%20card%3A%20%7B%0A%20%20%20%20width%3A%20150%2C%0A%20%20%20%20height%3A%20150%2C%0A%20%20%20%20marginRight%3A%2015%2C%0A%20%20%20%20borderRadius%3A%2012%2C%0A%20%20%20%20backgroundColor%3A%20%27%23dde%27%2C%0A%20%20%20%20justifyContent%3A%20%27center%27%2C%0A%20%20%20%20alignItems%3A%20%27center%27%2C%0A%20%20%7D%2C%0A%20%20row%3A%20%7B%20padding%3A%2020%2C%20borderBottomWidth%3A%201%2C%20borderColor%3A%20%27%23ccc%27%20%7D%2C%0A%20%20text%3A%20%7B%20fontSize%3A%2018%20%7D%2C%0A%7D%29%3B%0A)** (SDK 54, 필요한 패키지 자동 포함) <button class="snack-embed" type="button">👀 여기서 결과 보기</button>



In the web preview, scroll the cards sideways with Shift and the mouse wheel, or with two fingers on a trackpad.

Nesting works when the directions differ. Nesting scroll views that scroll the **same** way causes conflicts, because both want every drag. React Native even warns when a `FlatList` is placed inside a vertical `ScrollView`, since the list can no longer tell which rows are on screen. Keep nesting shallow, and use a `FlatList` for the main scrolling content.

**🇰🇷 한글 해설**

**중첩 스크롤**: 세로 페이지 안에 가로 카드 줄(앱스토어 홈 화면처럼).
- RN은 드래그 **방향에 맞는** 스크롤뷰에 제스처를 줘요. 옆으로 끌면 카드가, 위로 끌면 페이지가 움직여요.
- **방향이 다를 때만 OK.** 같은 방향끼리 중첩하면 둘 다 드래그를 원해서 충돌. 세로 ScrollView 안에 FlatList를 넣으면 **경고**(FlatList가 무엇이 화면에 있는지 알 수 없어서 virtualization이 깨짐).
- 중첩은 얕게, 메인 스크롤은 FlatList.
- Web에서 가로 스크롤: Shift + 마우스 휠, 또는 트랙패드 두 손가락.

### 📘 Scrolling and Touch Together

Rows in a scrolling list usually need to be tappable as well. Both gestures start with a finger on a row, so React Native decides which one the user meant: a finger that lifts without moving is a tap, and a finger that moves is a scroll, which cancels the press on the row. You get this for free by putting a `Pressable` inside each row.

```jsx
import { useState } from 'react';
import { View, Text, Pressable, FlatList, StyleSheet } from 'react-native';

const rows = Array.from({ length: 40 }, (_, i) => ({
  id: String(i + 1),
  title: `Row ${i + 1}`,
}));

export default function App() {
  const [selected, setSelected] = useState({});

  function toggle(id) {
    setSelected((prev) => ({ ...prev, [id]: !prev[id] }));
  }

  const count = Object.values(selected).filter(Boolean).length;

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>{count} selected</Text>
      <FlatList
        data={rows}
        keyExtractor={(item) => item.id}
        extraData={selected}
        renderItem={({ item }) => (
          <Pressable
            style={({ pressed }) => [
              styles.row,
              selected[item.id] && styles.selected,
              pressed && styles.pressed,
            ]}
            onPress={() => toggle(item.id)}
          >
            <Text style={styles.text}>{item.title}</Text>
          </Pressable>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingTop: 60 },
  heading: { fontSize: 18, fontWeight: '600', padding: 20 },
  row: { padding: 20, borderBottomWidth: 1, borderColor: '#ccc' },
  selected: { backgroundColor: '#BBDEFB' },
  pressed: { backgroundColor: '#eee' },
  text: { fontSize: 18 },
});
```

▶ **[Snack에서 바로 실행하기](https://snack.expo.dev/?name=WEB530%20W6%20Scrolling%20and%20Touch%20Together&platform=web&sdkVersion=54.0.0&code=import%20%7B%20useState%20%7D%20from%20%27react%27%3B%0Aimport%20%7B%20View%2C%20Text%2C%20Pressable%2C%20FlatList%2C%20StyleSheet%20%7D%20from%20%27react-native%27%3B%0A%0Aconst%20rows%20%3D%20Array.from%28%7B%20length%3A%2040%20%7D%2C%20%28_%2C%20i%29%20%3D%3E%20%28%7B%0A%20%20id%3A%20String%28i%20%2B%201%29%2C%0A%20%20title%3A%20%60Row%20%24%7Bi%20%2B%201%7D%60%2C%0A%7D%29%29%3B%0A%0Aexport%20default%20function%20App%28%29%20%7B%0A%20%20const%20%5Bselected%2C%20setSelected%5D%20%3D%20useState%28%7B%7D%29%3B%0A%0A%20%20function%20toggle%28id%29%20%7B%0A%20%20%20%20setSelected%28%28prev%29%20%3D%3E%20%28%7B%20...prev%2C%20%5Bid%5D%3A%20%21prev%5Bid%5D%20%7D%29%29%3B%0A%20%20%7D%0A%0A%20%20const%20count%20%3D%20Object.values%28selected%29.filter%28Boolean%29.length%3B%0A%0A%20%20return%20%28%0A%20%20%20%20%3CView%20style%3D%7Bstyles.container%7D%3E%0A%20%20%20%20%20%20%3CText%20style%3D%7Bstyles.heading%7D%3E%7Bcount%7D%20selected%3C%2FText%3E%0A%20%20%20%20%20%20%3CFlatList%0A%20%20%20%20%20%20%20%20data%3D%7Brows%7D%0A%20%20%20%20%20%20%20%20keyExtractor%3D%7B%28item%29%20%3D%3E%20item.id%7D%0A%20%20%20%20%20%20%20%20extraData%3D%7Bselected%7D%0A%20%20%20%20%20%20%20%20renderItem%3D%7B%28%7B%20item%20%7D%29%20%3D%3E%20%28%0A%20%20%20%20%20%20%20%20%20%20%3CPressable%0A%20%20%20%20%20%20%20%20%20%20%20%20style%3D%7B%28%7B%20pressed%20%7D%29%20%3D%3E%20%5B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20styles.row%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20selected%5Bitem.id%5D%20%26%26%20styles.selected%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20pressed%20%26%26%20styles.pressed%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%5D%7D%0A%20%20%20%20%20%20%20%20%20%20%20%20onPress%3D%7B%28%29%20%3D%3E%20toggle%28item.id%29%7D%0A%20%20%20%20%20%20%20%20%20%20%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%3CText%20style%3D%7Bstyles.text%7D%3E%7Bitem.title%7D%3C%2FText%3E%0A%20%20%20%20%20%20%20%20%20%20%3C%2FPressable%3E%0A%20%20%20%20%20%20%20%20%29%7D%0A%20%20%20%20%20%20%2F%3E%0A%20%20%20%20%3C%2FView%3E%0A%20%20%29%3B%0A%7D%0A%0Aconst%20styles%20%3D%20StyleSheet.create%28%7B%0A%20%20container%3A%20%7B%20flex%3A%201%2C%20paddingTop%3A%2060%20%7D%2C%0A%20%20heading%3A%20%7B%20fontSize%3A%2018%2C%20fontWeight%3A%20%27600%27%2C%20padding%3A%2020%20%7D%2C%0A%20%20row%3A%20%7B%20padding%3A%2020%2C%20borderBottomWidth%3A%201%2C%20borderColor%3A%20%27%23ccc%27%20%7D%2C%0A%20%20selected%3A%20%7B%20backgroundColor%3A%20%27%23BBDEFB%27%20%7D%2C%0A%20%20pressed%3A%20%7B%20backgroundColor%3A%20%27%23eee%27%20%7D%2C%0A%20%20text%3A%20%7B%20fontSize%3A%2018%20%7D%2C%0A%7D%29%3B%0A)** (SDK 54, 필요한 패키지 자동 포함) <button class="snack-embed" type="button">👀 여기서 결과 보기</button>



Tap rows to select them, and tap again to clear. On a phone, start a scroll with your finger on a row: the row never gets selected.

* `selected` is an object of ids, such as `{ '3': true, '7': true }`. `toggle` copies it and flips one id, using the updater form because the new state depends on the old.
* The pressed style comes last in the style array, so the press feedback still shows on a selected row.
* `extraData={selected}` tells `FlatList` that the rows depend on something outside `data`. Without it, an optimized list can skip re-rendering and leave a tapped row looking unselected.

**🇰🇷 한글 해설**

목록 줄은 스크롤도 되고 탭도 돼야 해요. 둘 다 손가락이 줄 위에서 시작하는데 RN이 판단해요:
- 손가락이 **안 움직이고** 떨어지면 → **탭**
- 손가락이 **움직이면** → **스크롤**, 줄의 press는 **취소**
→ 각 줄에 Pressable만 넣으면 공짜로 해결.

예제 3가지 포인트 (원문 bullet):
1. `selected`는 id 객체 `{ '3': true, '7': true }`. `toggle`은 복사 후 한 id만 뒤집기, **함수형 업데이트**(새 state가 이전에 의존).
2. pressed 스타일을 스타일 배열 **마지막**에 → 선택된 줄에서도 누름 피드백이 보임.
3. **`extraData={selected}`** → FlatList에게 "줄이 data 말고 다른 것(selected)에도 의존한다"고 알려 줌. 없으면 최적화된 목록이 다시 그리기를 건너뛰어 탭한 줄이 선택 안 된 것처럼 보일 수 있어요.


---

## 3. 📘 코스노트: Swipeable and Cancellable

<div class="sum" data-kind="read">

**🧭 먼저 한국어로** · 👀 읽고 이해하기 (타이핑 안 해도 돼요)

스와이프와 취소 제스처예요. 💻 6.1 Drag and Snap Back, Swipe to Delete에서 직접 쳐 봐요.

**이 챕터 구성**

- 👀 **Swipe Gestures**: 스와이프 = 가로 드래그. 메일, 메시지, 할 일 앱에서 줄을 밀어 삭제, 보관, 읽음 표시.
- 👀 **Building a Cancellable Swipe**: PanResponder: 손가락 위치를 알려 줌.
- 👀 **Building a Cancellable Swipe › Understanding the Example**: 5가지 핵심 (그대로 시험에 나올 만해요)
- 👀 **Swipeable Rows**: 모든 줄에 PanResponder를 직접 쓰는 건 노가다.
- 👀 **Swipeable Rows › Understanding the Example**: `GestureHandlerRootView`: 모든 gesture-handler 컴포넌트는 이 안에 있어야 함.
- 👀 **When to Use Swipe Actions**: 쓸 때: 보조 행동(삭제, 보관), 자주 하는 행동, 목록을 깔끔하게, 한 손 빠른 조작.

</div>

> 원문 출처: https://seneca-ictoer.github.io/WEB530/F-Touch/swipe-cancel

### 📘 Swipe Gestures

Swipe gestures are a common pattern in mobile apps. Email clients, messaging apps, and task managers often allow users to swipe a row to reveal quick actions such as **Delete**, **Archive**, or **Mark as Read**.

A swipe is a horizontal drag, and it must be **cancellable**. Users often start a swipe and change their mind, so a short swipe should snap back and do nothing. Only a deliberate swipe should act. This prevents accidental destructive actions and matches how native iOS and Android apps behave.

A swipe must also share the screen with scrolling. A row that swipes sideways should only take the gesture once the finger is clearly moving sideways, and leave vertical drags to the list.

Swipes need a touch screen. The web preview only has a mouse, so run the examples on this page on your phone with **My Device**.

**🇰🇷 한글 해설**

**스와이프** = 가로 드래그. 메일, 메시지, 할 일 앱에서 줄을 밀어 삭제, 보관, 읽음 표시.
**필수 조건 2가지 (시험 포인트)**:
1. **Cancellable(취소 가능)**: 사용자가 시작했다가 마음을 바꿀 수 있어요. **짧은 스와이프는 원위치(snap back)**, 의도적인 긴 스와이프만 실행. 실수로 지우는 사고 방지.
2. **스크롤과 공존**: 손가락이 **확실히 옆으로** 움직일 때만 스와이프가 제스처를 가져가고, 세로 드래그는 목록에 양보.
터치 화면 필요 → 폰에서.

### 📘 Building a Cancellable Swipe

React Native includes two tools for building gestures by hand. `PanResponder` reports where the finger is, and `Animated` moves a view smoothly without re-rendering the component on every frame. The example below lets you drag a card sideways. A short drag snaps back; a drag past 120 points slides the card off the screen.

```jsx
import { useRef, useState } from 'react';
import { View, Text, Button, Animated, PanResponder, StyleSheet } from 'react-native';

export default function App() {
  const [dismissed, setDismissed] = useState(false);
  const translateX = useRef(new Animated.Value(0)).current;

  const pan = useRef(
    PanResponder.create({
      // Only take the gesture once the finger moves sideways.
      onMoveShouldSetPanResponder: (_, gesture) => Math.abs(gesture.dx) > 10,
      onPanResponderMove: (_, gesture) => {
        translateX.setValue(gesture.dx);
      },
      onPanResponderRelease: (_, gesture) => {
        if (Math.abs(gesture.dx) > 120) {
          // Far enough: commit, and slide the card off the screen.
          Animated.timing(translateX, {
            toValue: gesture.dx > 0 ? 500 : -500,
            duration: 200,
            useNativeDriver: true,
          }).start(() => setDismissed(true));
        } else {
          // Not far enough: cancel, and spring back.
          Animated.spring(translateX, {
            toValue: 0,
            useNativeDriver: true,
          }).start();
        }
      },
    })
  ).current;

  function reset() {
    translateX.setValue(0);
    setDismissed(false);
  }

  return (
    <View style={styles.container}>
      {dismissed ? (
        <Button title="Bring It Back" onPress={reset} />
      ) : (
        <Animated.View {...pan.panHandlers} style={[styles.card, { transform: [{ translateX }] }]}>
          <Text style={styles.text}>Swipe Me</Text>
        </Animated.View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 100,
    paddingHorizontal: 20,
  },
  card: {
    padding: 20,
    borderRadius: 8,
    backgroundColor: '#eef',
  },
  text: {
    fontSize: 18,
  },
});
```

▶ **[Snack에서 바로 실행하기](https://snack.expo.dev/?name=WEB530%20W6%20Building%20a%20Cancellable%20Swipe&platform=ios&sdkVersion=54.0.0&code=import%20%7B%20useRef%2C%20useState%20%7D%20from%20%27react%27%3B%0Aimport%20%7B%20View%2C%20Text%2C%20Button%2C%20Animated%2C%20PanResponder%2C%20StyleSheet%20%7D%20from%20%27react-native%27%3B%0A%0Aexport%20default%20function%20App%28%29%20%7B%0A%20%20const%20%5Bdismissed%2C%20setDismissed%5D%20%3D%20useState%28false%29%3B%0A%20%20const%20translateX%20%3D%20useRef%28new%20Animated.Value%280%29%29.current%3B%0A%0A%20%20const%20pan%20%3D%20useRef%28%0A%20%20%20%20PanResponder.create%28%7B%0A%20%20%20%20%20%20%2F%2F%20Only%20take%20the%20gesture%20once%20the%20finger%20moves%20sideways.%0A%20%20%20%20%20%20onMoveShouldSetPanResponder%3A%20%28_%2C%20gesture%29%20%3D%3E%20Math.abs%28gesture.dx%29%20%3E%2010%2C%0A%20%20%20%20%20%20onPanResponderMove%3A%20%28_%2C%20gesture%29%20%3D%3E%20%7B%0A%20%20%20%20%20%20%20%20translateX.setValue%28gesture.dx%29%3B%0A%20%20%20%20%20%20%7D%2C%0A%20%20%20%20%20%20onPanResponderRelease%3A%20%28_%2C%20gesture%29%20%3D%3E%20%7B%0A%20%20%20%20%20%20%20%20if%20%28Math.abs%28gesture.dx%29%20%3E%20120%29%20%7B%0A%20%20%20%20%20%20%20%20%20%20%2F%2F%20Far%20enough%3A%20commit%2C%20and%20slide%20the%20card%20off%20the%20screen.%0A%20%20%20%20%20%20%20%20%20%20Animated.timing%28translateX%2C%20%7B%0A%20%20%20%20%20%20%20%20%20%20%20%20toValue%3A%20gesture.dx%20%3E%200%20%3F%20500%20%3A%20-500%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20duration%3A%20200%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20useNativeDriver%3A%20true%2C%0A%20%20%20%20%20%20%20%20%20%20%7D%29.start%28%28%29%20%3D%3E%20setDismissed%28true%29%29%3B%0A%20%20%20%20%20%20%20%20%7D%20else%20%7B%0A%20%20%20%20%20%20%20%20%20%20%2F%2F%20Not%20far%20enough%3A%20cancel%2C%20and%20spring%20back.%0A%20%20%20%20%20%20%20%20%20%20Animated.spring%28translateX%2C%20%7B%0A%20%20%20%20%20%20%20%20%20%20%20%20toValue%3A%200%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20useNativeDriver%3A%20true%2C%0A%20%20%20%20%20%20%20%20%20%20%7D%29.start%28%29%3B%0A%20%20%20%20%20%20%20%20%7D%0A%20%20%20%20%20%20%7D%2C%0A%20%20%20%20%7D%29%0A%20%20%29.current%3B%0A%0A%20%20function%20reset%28%29%20%7B%0A%20%20%20%20translateX.setValue%280%29%3B%0A%20%20%20%20setDismissed%28false%29%3B%0A%20%20%7D%0A%0A%20%20return%20%28%0A%20%20%20%20%3CView%20style%3D%7Bstyles.container%7D%3E%0A%20%20%20%20%20%20%7Bdismissed%20%3F%20%28%0A%20%20%20%20%20%20%20%20%3CButton%20title%3D%22Bring%20It%20Back%22%20onPress%3D%7Breset%7D%20%2F%3E%0A%20%20%20%20%20%20%29%20%3A%20%28%0A%20%20%20%20%20%20%20%20%3CAnimated.View%20%7B...pan.panHandlers%7D%20style%3D%7B%5Bstyles.card%2C%20%7B%20transform%3A%20%5B%7B%20translateX%20%7D%5D%20%7D%5D%7D%3E%0A%20%20%20%20%20%20%20%20%20%20%3CText%20style%3D%7Bstyles.text%7D%3ESwipe%20Me%3C%2FText%3E%0A%20%20%20%20%20%20%20%20%3C%2FAnimated.View%3E%0A%20%20%20%20%20%20%29%7D%0A%20%20%20%20%3C%2FView%3E%0A%20%20%29%3B%0A%7D%0A%0Aconst%20styles%20%3D%20StyleSheet.create%28%7B%0A%20%20container%3A%20%7B%0A%20%20%20%20flex%3A%201%2C%0A%20%20%20%20paddingTop%3A%20100%2C%0A%20%20%20%20paddingHorizontal%3A%2020%2C%0A%20%20%7D%2C%0A%20%20card%3A%20%7B%0A%20%20%20%20padding%3A%2020%2C%0A%20%20%20%20borderRadius%3A%208%2C%0A%20%20%20%20backgroundColor%3A%20%27%23eef%27%2C%0A%20%20%7D%2C%0A%20%20text%3A%20%7B%0A%20%20%20%20fontSize%3A%2018%2C%0A%20%20%7D%2C%0A%7D%29%3B%0A)** (SDK 54, 필요한 패키지 자동 포함)



**🇰🇷 한글 해설**

RN 내장 도구 2개로 직접 만들기:
- **PanResponder**: 손가락 위치를 알려 줌.
- **Animated**: 매 프레임 컴포넌트를 다시 렌더링하지 **않고** 뷰를 부드럽게 움직임.
예제: 카드를 옆으로 끌어서, 짧으면 돌아오고 **120포인트** 넘으면 화면 밖으로 날아감.

#### 📘 Understanding the Example

1. `useRef` keeps the same object for the whole life of the component. Without it, `new Animated.Value(0)` would create a fresh value, back at 0, on every render. Changing a ref does not cause a re-render.
2. `onMoveShouldSetPanResponder` decides whether the card takes the gesture. It only says yes after 10 points of sideways movement, so taps and vertical drags are left for other components, such as a scroll view.
3. `onPanResponderMove` sets the card's offset to `gesture.dx`, the distance the finger has moved sideways.
4. `onPanResponderRelease` is where the swipe is either committed or cancelled. `Animated.spring` returns the card to 0 with a small bounce, and `Animated.timing` slides it off the screen. The `start` callback changes state only after the animation ends.
5. `useNativeDriver: true` runs the animation on the native side, so it stays smooth even when JavaScript is busy.

**🇰🇷 한글 해설**

**5가지 핵심 (그대로 시험에 나올 만해요)**
1. **`useRef`**: 컴포넌트 일생 동안 **같은 객체** 유지. 없으면 렌더링마다 `new Animated.Value(0)`이 새로 생겨 0으로 리셋. ref를 바꿔도 **다시 렌더링 안 됨**. (useState와의 차이!)
2. **`onMoveShouldSetPanResponder`**: 이 카드가 제스처를 가져갈지 결정. 옆으로 **10포인트** 넘게 움직였을 때만 yes → 탭과 세로 드래그는 스크롤뷰 등에 양보. (제스처 우선순위 규칙)
3. **`onPanResponderMove`**: 카드 위치 = `gesture.dx`(손가락이 옆으로 움직인 거리).
4. **`onPanResponderRelease`**: 손을 뗄 때 **실행 또는 취소** 결정. `Animated.spring` = 0으로 살짝 튕기며 복귀, `Animated.timing` = 화면 밖으로 미끄러짐. `start(콜백)`의 콜백은 **애니메이션이 끝난 뒤** state 변경.
5. **`useNativeDriver: true`**: 애니메이션을 네이티브 쪽에서 실행 → JS가 바빠도 부드러움.

### 📘 Swipeable Rows

Writing a `PanResponder` for every list row would be a lot of work. In practice, apps use the **Swipeable** component from the `react-native-gesture-handler` library, which Expo includes.

`Swipeable` provides:

* Smooth, physics‑based swipe gestures
* Left and right action panels
* Automatic cancellation when the swipe is not far enough
* Callbacks when a swipe passes a threshold
* Full support for iOS and Android

The example below shows an inbox of swipeable rows. Swiping a row left reveals a **Delete** button underneath it. A short swipe snaps back; a swipe past about half the button's width leaves the row open, and tapping **Delete** removes the message.

```jsx
import { useState } from 'react';
import { View, Text, Pressable, FlatList, StyleSheet } from 'react-native';
import { GestureHandlerRootView, Swipeable } from 'react-native-gesture-handler';

const inbox = [
  { id: '1', from: 'Registrar', subject: 'Your timetable is ready' },
  { id: '2', from: 'Library', subject: 'Book due Friday' },
  { id: '3', from: 'Campus Store', subject: 'Textbook back in stock' },
  { id: '4', from: 'IT Services', subject: 'Password expires in 7 days' },
  { id: '5', from: 'Study Group', subject: 'Room 2104 at 3 PM' },
  { id: '6', from: 'Athletics', subject: 'Intramural sign-ups open' },
  { id: '7', from: 'Career Centre', subject: 'Resume workshop Thursday' },
  { id: '8', from: 'Student Union', subject: 'Free pancakes Monday' },
];

function MessageRow({ item, onDelete }) {
  return (
    <Swipeable
      overshootRight={false}
      renderRightActions={() => (
        <Pressable style={styles.deleteButton} onPress={() => onDelete(item.id)}>
          <Text style={styles.actionText}>Delete</Text>
        </Pressable>
      )}
    >
      <View style={styles.row}>
        <Text style={styles.from}>{item.from}</Text>
        <Text style={styles.subject}>{item.subject}</Text>
      </View>
    </Swipeable>
  );
}

export default function App() {
  const [messages, setMessages] = useState(inbox);

  function deleteMessage(id) {
    setMessages((prev) => prev.filter((item) => item.id !== id));
  }

  return (
    <GestureHandlerRootView style={styles.container}>
      <FlatList
        data={messages}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <MessageRow item={item} onDelete={deleteMessage} />}
        ListEmptyComponent={<Text style={styles.empty}>No messages.</Text>}
      />
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 60,
  },
  row: {
    padding: 20,
    borderBottomWidth: 1,
    borderColor: '#ddd',
    backgroundColor: 'white',
  },
  from: {
    fontSize: 16,
    fontWeight: '600',
  },
  subject: {
    fontSize: 14,
    color: '#666',
  },
  deleteButton: {
    justifyContent: 'center',
    paddingHorizontal: 24,
    backgroundColor: '#E53935',
  },
  actionText: {
    color: 'white',
    fontWeight: '600',
  },
  empty: {
    padding: 20,
    color: '#666',
  },
});
```

▶ **[Snack에서 바로 실행하기](https://snack.expo.dev/?name=WEB530%20W6%20Swipeable%20Rows&platform=ios&sdkVersion=54.0.0&code=import%20%7B%20useState%20%7D%20from%20%27react%27%3B%0Aimport%20%7B%20View%2C%20Text%2C%20Pressable%2C%20FlatList%2C%20StyleSheet%20%7D%20from%20%27react-native%27%3B%0Aimport%20%7B%20GestureHandlerRootView%2C%20Swipeable%20%7D%20from%20%27react-native-gesture-handler%27%3B%0A%0Aconst%20inbox%20%3D%20%5B%0A%20%20%7B%20id%3A%20%271%27%2C%20from%3A%20%27Registrar%27%2C%20subject%3A%20%27Your%20timetable%20is%20ready%27%20%7D%2C%0A%20%20%7B%20id%3A%20%272%27%2C%20from%3A%20%27Library%27%2C%20subject%3A%20%27Book%20due%20Friday%27%20%7D%2C%0A%20%20%7B%20id%3A%20%273%27%2C%20from%3A%20%27Campus%20Store%27%2C%20subject%3A%20%27Textbook%20back%20in%20stock%27%20%7D%2C%0A%20%20%7B%20id%3A%20%274%27%2C%20from%3A%20%27IT%20Services%27%2C%20subject%3A%20%27Password%20expires%20in%207%20days%27%20%7D%2C%0A%20%20%7B%20id%3A%20%275%27%2C%20from%3A%20%27Study%20Group%27%2C%20subject%3A%20%27Room%202104%20at%203%20PM%27%20%7D%2C%0A%20%20%7B%20id%3A%20%276%27%2C%20from%3A%20%27Athletics%27%2C%20subject%3A%20%27Intramural%20sign-ups%20open%27%20%7D%2C%0A%20%20%7B%20id%3A%20%277%27%2C%20from%3A%20%27Career%20Centre%27%2C%20subject%3A%20%27Resume%20workshop%20Thursday%27%20%7D%2C%0A%20%20%7B%20id%3A%20%278%27%2C%20from%3A%20%27Student%20Union%27%2C%20subject%3A%20%27Free%20pancakes%20Monday%27%20%7D%2C%0A%5D%3B%0A%0Afunction%20MessageRow%28%7B%20item%2C%20onDelete%20%7D%29%20%7B%0A%20%20return%20%28%0A%20%20%20%20%3CSwipeable%0A%20%20%20%20%20%20overshootRight%3D%7Bfalse%7D%0A%20%20%20%20%20%20renderRightActions%3D%7B%28%29%20%3D%3E%20%28%0A%20%20%20%20%20%20%20%20%3CPressable%20style%3D%7Bstyles.deleteButton%7D%20onPress%3D%7B%28%29%20%3D%3E%20onDelete%28item.id%29%7D%3E%0A%20%20%20%20%20%20%20%20%20%20%3CText%20style%3D%7Bstyles.actionText%7D%3EDelete%3C%2FText%3E%0A%20%20%20%20%20%20%20%20%3C%2FPressable%3E%0A%20%20%20%20%20%20%29%7D%0A%20%20%20%20%3E%0A%20%20%20%20%20%20%3CView%20style%3D%7Bstyles.row%7D%3E%0A%20%20%20%20%20%20%20%20%3CText%20style%3D%7Bstyles.from%7D%3E%7Bitem.from%7D%3C%2FText%3E%0A%20%20%20%20%20%20%20%20%3CText%20style%3D%7Bstyles.subject%7D%3E%7Bitem.subject%7D%3C%2FText%3E%0A%20%20%20%20%20%20%3C%2FView%3E%0A%20%20%20%20%3C%2FSwipeable%3E%0A%20%20%29%3B%0A%7D%0A%0Aexport%20default%20function%20App%28%29%20%7B%0A%20%20const%20%5Bmessages%2C%20setMessages%5D%20%3D%20useState%28inbox%29%3B%0A%0A%20%20function%20deleteMessage%28id%29%20%7B%0A%20%20%20%20setMessages%28%28prev%29%20%3D%3E%20prev.filter%28%28item%29%20%3D%3E%20item.id%20%21%3D%3D%20id%29%29%3B%0A%20%20%7D%0A%0A%20%20return%20%28%0A%20%20%20%20%3CGestureHandlerRootView%20style%3D%7Bstyles.container%7D%3E%0A%20%20%20%20%20%20%3CFlatList%0A%20%20%20%20%20%20%20%20data%3D%7Bmessages%7D%0A%20%20%20%20%20%20%20%20keyExtractor%3D%7B%28item%29%20%3D%3E%20item.id%7D%0A%20%20%20%20%20%20%20%20renderItem%3D%7B%28%7B%20item%20%7D%29%20%3D%3E%20%3CMessageRow%20item%3D%7Bitem%7D%20onDelete%3D%7BdeleteMessage%7D%20%2F%3E%7D%0A%20%20%20%20%20%20%20%20ListEmptyComponent%3D%7B%3CText%20style%3D%7Bstyles.empty%7D%3ENo%20messages.%3C%2FText%3E%7D%0A%20%20%20%20%20%20%2F%3E%0A%20%20%20%20%3C%2FGestureHandlerRootView%3E%0A%20%20%29%3B%0A%7D%0A%0Aconst%20styles%20%3D%20StyleSheet.create%28%7B%0A%20%20container%3A%20%7B%0A%20%20%20%20flex%3A%201%2C%0A%20%20%20%20paddingTop%3A%2060%2C%0A%20%20%7D%2C%0A%20%20row%3A%20%7B%0A%20%20%20%20padding%3A%2020%2C%0A%20%20%20%20borderBottomWidth%3A%201%2C%0A%20%20%20%20borderColor%3A%20%27%23ddd%27%2C%0A%20%20%20%20backgroundColor%3A%20%27white%27%2C%0A%20%20%7D%2C%0A%20%20from%3A%20%7B%0A%20%20%20%20fontSize%3A%2016%2C%0A%20%20%20%20fontWeight%3A%20%27600%27%2C%0A%20%20%7D%2C%0A%20%20subject%3A%20%7B%0A%20%20%20%20fontSize%3A%2014%2C%0A%20%20%20%20color%3A%20%27%23666%27%2C%0A%20%20%7D%2C%0A%20%20deleteButton%3A%20%7B%0A%20%20%20%20justifyContent%3A%20%27center%27%2C%0A%20%20%20%20paddingHorizontal%3A%2024%2C%0A%20%20%20%20backgroundColor%3A%20%27%23E53935%27%2C%0A%20%20%7D%2C%0A%20%20actionText%3A%20%7B%0A%20%20%20%20color%3A%20%27white%27%2C%0A%20%20%20%20fontWeight%3A%20%27600%27%2C%0A%20%20%7D%2C%0A%20%20empty%3A%20%7B%0A%20%20%20%20padding%3A%2020%2C%0A%20%20%20%20color%3A%20%27%23666%27%2C%0A%20%20%7D%2C%0A%7D%29%3B%0A&dependencies=react-native-gesture-handler%40~2.28.0)** (SDK 54, 필요한 패키지 자동 포함)



**🇰🇷 한글 해설**

모든 줄에 PanResponder를 직접 쓰는 건 노가다. 실제 앱은 **`react-native-gesture-handler`의 `Swipeable`** 사용(Expo에 포함).
Swipeable이 주는 것: 물리 기반 부드러운 스와이프, 왼쪽/오른쪽 액션 패널, 충분히 안 밀면 **자동 취소**, 임계값 넘으면 콜백, iOS/Android 지원.
예제: 왼쪽으로 밀면 아래 **Delete** 버튼이 드러남. 짧으면 복귀, 버튼 너비 절반 넘으면 열린 채 유지, Delete 탭 → 삭제.

#### 📘 Understanding the Example

1. `GestureHandlerRootView` - All gesture‑handler components must be inside this root view. Put it once, around the whole app.
2. `MessageRow` - Each row is wrapped in a `Swipeable`, which handles dragging, cancelling, snapping back and staying open. `MessageRow` is declared at the top level, outside `App`. A component declared inside another one is a new component on every render, so every row would be rebuilt, and lose its swipe position, each time the list changed.
3. Right action panel - `renderRightActions` returns the panel underneath the right edge of the row. Swiping left reveals it. The row has a white background so the panel stays hidden until the swipe.
4. `overshootRight={false}` - Stops the row at the edge of the panel instead of letting it stretch further.
5. Deleting - Tapping **Delete** calls `onDelete`, which removes the message with the updater form of `setMessages`.
6. Gesture priority - Dragging up and down scrolls the list. A row only takes the gesture when the finger moves sideways.

The swipe only reveals the button; the tap deletes. Deleting is destructive, so it takes two deliberate actions. `Swipeable` also has an `onSwipeableOpen` callback that could delete the row as soon as it opens, but then a slightly long swipe would lose a message with no way back. Save that pattern for actions that can be undone, such as archiving.

**🇰🇷 한글 해설**

**6가지 핵심**
1. **`GestureHandlerRootView`**: 모든 gesture-handler 컴포넌트는 이 안에 있어야 함. 앱 전체를 **한 번** 감싸기.
2. **`MessageRow`는 App 바깥(최상위)에 선언**. 컴포넌트 안에서 컴포넌트를 선언하면 렌더링마다 **새 컴포넌트**가 돼서 줄이 전부 새로 만들어지고 스와이프 위치를 잃어요. (시험 함정 후보!)
3. **`renderRightActions`**: 줄 오른쪽 아래에 깔리는 패널을 반환. 왼쪽으로 밀면 보임. 줄 배경이 **흰색**이어야 스와이프 전엔 패널이 가려져요.
4. **`overshootRight={false}`**: 패널 끝에서 멈춤(더 늘어나지 않게).
5. 삭제: Delete 탭 → `onDelete` → `setMessages`의 **함수형 업데이트**로 제거.
6. 제스처 우선순위: 위아래 드래그는 스크롤, 옆으로 움직일 때만 줄이 가져감.

**설계 원칙**: 스와이프는 버튼을 **드러내기만**, 삭제는 **탭**으로. 파괴적 행동(삭제)은 **두 번의 의도적 동작**이 필요. `onSwipeableOpen`으로 열리자마자 지우면 조금 길게 민 실수로 메시지를 잃어요. 그건 되돌릴 수 있는 행동(보관)에만.

### 📘 When to Use Swipe Actions

Use swipe actions when:

* The action is secondary, such as delete or archive
* The user performs it frequently
* You want to keep the list clean
* You want fast, one‑handed interactions

Avoid swipe actions when:

* The action is critical and the swipe is the only way to do it
* The user needs a confirmation step that a swipe cannot give
* The gesture might conflict with other horizontal scrolling on the screen

Swipes are hidden: nothing on screen tells the user they exist. Always offer another way to reach the same action, such as a button on the detail screen.

💡 Note: `Swipeable` Is Deprecated

The `Swipeable` component used in this example still works, but it has been officially marked as deprecated in `react-native-gesture-handler`. This means it may be removed in a future release and should not be used in new production apps.

**What this means for you**

* You can safely use `Swipeable` for learning purposes in this course.
* It helps you understand the idea of “swipeable and cancellable” UI elements.
* It keeps the example simple and avoids extra setup.

**What modern apps use instead**

Newer React Native projects typically build swipe gestures using:

* `ReanimatedSwipeable`, the replacement component, with a very similar API
* The Gesture API (`Gesture.Pan()`, `GestureDetector`) for custom gestures
* Reanimated for smooth, native‑driven animations

This approach gives developers more control and better performance, especially for complex interactions like Gmail‑style swipe actions.

**Why this example stays as‑is**

* It works reliably in the course environment (Snack).
* It clearly demonstrates the swipe‑to‑delete pattern.
* It avoids the complexity of Reanimated and Worklets, which are beyond the scope of this module.

As you continue learning, you’ll see how the newer Gesture API can be used to build the same interaction with more flexibility and modern tooling.

**🇰🇷 한글 해설**

**쓸 때**: 보조 행동(삭제, 보관), 자주 하는 행동, 목록을 깔끔하게, 한 손 빠른 조작.
**피할 때**: 중요한데 스와이프가 **유일한** 방법일 때, 확인 단계가 필요할 때, 화면의 다른 가로 스크롤과 충돌할 때.
스와이프는 **숨겨져 있어요**(화면에 존재를 알려 주는 게 없음). 그래서 **항상 다른 방법도 제공**(상세 화면의 버튼 등).

💡 `Swipeable`은 **deprecated**(앞으로 없어질 수 있음). 수업용으로는 OK. 요즘은 `ReanimatedSwipeable`(거의 같은 API), Gesture API(`Gesture.Pan()`, `GestureDetector`), Reanimated를 써요. 이 예제를 그대로 두는 이유: Snack에서 잘 되고, 패턴을 명확히 보여 주고, Reanimated/Worklets의 복잡함을 피하려고.


---

## 4. 💻 인클래스 예제: Week 6.1 - Notes and Examples

<div class="sum" data-kind="type">

**🧭 먼저 한국어로** · ⌨️ Snack에서 직접 쳐 보기

6.1 수업 라이브 코딩이에요. Starter Code에서 시작해 Step 순서대로 고쳐 가요. 스와이프 예제는 폰(Expo Go)에서 확인하세요.

**이 챕터 구성**

- ⏭️ **React Native Playground**: 패키지와 실행 환경 안내예요.
- 👀 **Why Touch?**: 탭 같은 discrete 제스처와 스크롤 같은 continuous 제스처를 구분해요.
- ⌨️ **Example: Pressable**: Pressable은 모양이 없는 터치 컴포넌트예요.
- ⌨️ **[Example: Pressable › Starter Code](#practice-1)**: 이 단계 코드를 직접 쳐 보세요. (⌨️ 버튼처럼 생긴 View 시작 코드 쳐 두기)
- ⌨️ **[Example: Pressable › Step 1 - Make It Pressable](#practice-2)**: 이 단계 코드를 직접 쳐 보세요. (⌨️ View를 Pressable로 바꾸고 onPress에서 setTaps((prev) => prev + 1))
- ⌨️ **[Example: Pressable › Step 2 - Show Pressed Feedback](#practice-3)**: style을 함수로 줘서 누르는 동안 모양을 바꿔요. (⌨️ style={({ pressed }) => [styles.button, pressed && styles.pressed]})
- ⌨️ **[Example: Pressable › Step 3 - Log Every Press Event](#practice-4)**: 이벤트 순서가 시험 포인트예요. (⌨️ onPressIn, onPressOut, onPress, onLongPress를 로그로 찍기)
- 👀 **Example: Pressable › Finished Code**: 완성 코드 해설: `taps`, `events` state.
- 👀 **Example: Hit Slop**: hitSlop으로 작은 버튼의 터치 영역을 넓혀요.
- 👀 **Scrolling**: 스크롤과 관성(momentum) 개념이에요.
- ⌨️ **Example: ScrollView**: 세로 페이지 안에 가로 카드 줄을 넣어요.
- ⌨️ **[Example: ScrollView › Starter Code](#practice-5)**: 이 단계 코드를 직접 쳐 보세요. (⌨️ Row 30개짜리 세로 ScrollView 쳐 두기)
- ⌨️ **[Example: ScrollView › Step 1 - Add a Horizontal Row](#practice-6)**: 이 단계 코드를 직접 쳐 보세요. (⌨️ ScrollView horizontal + contentContainerStyle로 가로 카드 줄 추가)
- 👀 **Example: ScrollView › Finished Code**: 완성 코드 해설: 바깥 세로 ScrollView 안에 제목 + 가로 ScrollView(카드들) + 세로 줄 30개.
- ⌨️ **Example: Pressable Rows in a FlatList**: 목록은 스크롤도 되고 줄 탭도 돼야 해요.
- ⌨️ **[Example: Pressable Rows in a FlatList › Starter Code](#practice-7)**: 이 단계 코드를 직접 쳐 보세요. (⌨️ 줄 40개 FlatList 시작 코드 쳐 두기)
- ⌨️ **[Example: Pressable Rows in a FlatList › Step 1 - Make the Rows Pressable](#practice-8)**: 이 단계 코드를 직접 쳐 보세요. (⌨️ 줄 View를 Pressable로 바꾸고 pressed 피드백)
- ⌨️ **[Example: Pressable Rows in a FlatList › Step 2 - Select Rows](#practice-9)**: 함수형 업데이트와 객체 복사를 연습해요. (⌨️ selected 객체 state + toggle(id)로 줄 선택 표시)
- 👀 **Example: Pressable Rows in a FlatList › Finished Code**: 완성 코드 해설: `selected` 객체 state, `toggle` 함수, derived `count`, Pressable 줄 + 3단 스타일 배열, `extraData`.
- 👀 **Swipe and Cancel**: 스와이프는 짧으면 취소되고 세로 스크롤을 막지 않아야 해요.
- ⌨️ **Example: Drag and Snap Back**: PanResponder와 Animated로 직접 끌기를 만들어요. 폰에서 확인하세요.
- ⌨️ **[Example: Drag and Snap Back › Starter Code](#practice-10)**: 이 단계 코드를 직접 쳐 보세요. (⌨️ 안 움직이는 카드 시작 코드 쳐 두기)
- ⌨️ **[Example: Drag and Snap Back › Step 1 - Follow the Finger](#practice-11)**: 이 단계 코드를 직접 쳐 보세요. (⌨️ useRef(new Animated.Value(0)) + PanResponder로 손가락 따라가기)
- ⌨️ **[Example: Drag and Snap Back › Step 2 - Snap Back on Release](#practice-12)**: 이 단계 코드를 직접 쳐 보세요. (⌨️ onPanResponderRelease에서 Animated.spring으로 복귀)
- ⌨️ **[Example: Drag and Snap Back › Step 3 - Commit Past a Threshold](#practice-13)**: 이 단계 코드를 직접 쳐 보세요. (⌨️ Math.abs(dx) > 120이면 Animated.timing으로 밀어내고 setDismissed(true))
- 👀 **Example: Drag and Snap Back › Finished Code**: 완성 코드 해설: useRef(Animated.Value, PanResponder) + 세 콜백(ShouldSet, Move, Release) + 임계값 120 + dismissed state + Reset 버튼.
- ⌨️ **Example: Swipe to Delete**: 실제 앱처럼 Gesture Handler의 Swipeable을 써요. 폰에서 확인하세요.
- ⌨️ **[Example: Swipe to Delete › Starter Code](#practice-14)**: MessageRow는 MyApp 바깥에 선언해요. (⌨️ MessageRow가 있는 받은편지함 FlatList 쳐 두기)
- ⌨️ **[Example: Swipe to Delete › Step 1 - Add the Gesture Root](#practice-15)**: 이 단계 코드를 직접 쳐 보세요. (⌨️ 바깥 View를 GestureHandlerRootView로 바꾸기)
- ⌨️ **[Example: Swipe to Delete › Step 2 - Make the Rows Swipeable](#practice-16)**: 이 단계 코드를 직접 쳐 보세요. (⌨️ 줄을 Swipeable renderRightActions로 감싸기)
- ⌨️ **[Example: Swipe to Delete › Step 3 - Delete the Message](#practice-17)**: 이 단계 코드를 직접 쳐 보세요. (⌨️ remove(id)에서 filter로 지우고 onDelete prop 연결)
- 👀 **Example: Swipe to Delete › Finished Code**: 완성 코드 해설: GestureHandlerRootView > FlatList > (최상위 선언) MessageRow > Swipeable(renderRightActions = Delete Pressable).
- 👀 **Touch UX Checklist**: 터치 UX 체크리스트 6개는 서술형으로 나올 수 있어요.

</div>

> 원문 출처: github.com/nick-romanidis/web530-2267-nsa  week-06.1-notes.md

### 💻 React Native Playground

React Native Playground (Snack)
_Use this for the examples. Modify App.js_
(https://snack.expo.dev)

- Keep Snack on SDK 54 (the default).
- Every example except the last one only needs `react-native`. The Swipe to Delete example uses React Native Gesture Handler, so replace the contents of `package.json` before that one.

_package.json_

```json
{
  "dependencies": {
    "react-native-gesture-handler": "~2.28.0"
  }
}
```

- This week is about fingers, and the web preview only has a mouse. A click is a tap and holding the button down is a long press, so the Pressable examples work on **Web**. Hit slop, momentum scrolling and the swipe examples need a touch screen. Choose **My Device** and open the Snack in Expo Go on your phone for those.

**🇰🇷 한글 해설**

마지막 예제(Swipe to Delete)만 `react-native-gesture-handler` 필요(링크에 자동 포함). Web은 마우스뿐이라: 클릭 = 탭, 꾹 누르기 = long press는 Web에서 OK. hitSlop, 관성 스크롤, 스와이프는 **폰**에서.

### 💻 Why Touch?

- Mobile apps are built around touch, not a mouse and keyboard. Every interaction is a gesture: tap, long press, scroll, swipe.
- Good touch handling feels instant. The user sees a response the moment their finger lands, not when it lifts.
- Gestures come in two kinds. A tap or a long press is discrete: one event, and it is over. A scroll or a swipe is continuous: a stream of movement, updated every frame, that can end in an action or be cancelled.
- React Native has components for the common gestures: `Pressable` for taps, `ScrollView` and `FlatList` for scrolling. Swipes need a little more work.

**🇰🇷 한글 해설**

**Discrete vs Continuous** (0번 표). RN은 흔한 제스처용 컴포넌트를 줘요: 탭은 Pressable, 스크롤은 ScrollView/FlatList. 스와이프는 조금 더 작업이 필요.

### 💻 Example: Pressable

- `Pressable` is the touch component. It wraps any content and reports what the finger does. It replaces the older `TouchableOpacity` and `TouchableHighlight`, which still work but are not used in new code.
- `Button` from Week 2 is fine for a plain button, but it cannot be styled. `Pressable` has no look of its own, so it can be anything: a button, a card, a list row.

**🇰🇷 한글 해설**

Pressable은 **모양이 없는** 터치 컴포넌트라 버튼, 카드, 목록 줄 무엇이든 될 수 있어요. 2주차 `Button`은 스타일을 못 바꾸지만 Pressable은 자유.

#### 💻 Starter Code

- Replace everything in `App.js`. It is a box styled to look like a button, and nothing happens when you press it.


<p class="typeit" id="practice-1">⌨️ <b>이 코드는 Snack에서 직접 쳐 보세요</b>: 버튼처럼 생긴 View 시작 코드 쳐 두기</p>

```jsx
import { View, Text, StyleSheet } from "react-native";

export default function MyApp() {
  return (
    <View style={styles.container}>
      <View style={styles.button}>
        <Text style={styles.buttonText}>Tap Me</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingTop: 60, alignItems: "center" },
  button: {
    width: 200,
    padding: 20,
    borderRadius: 8,
    alignItems: "center",
    backgroundColor: "#2196F3",
  },
  buttonText: { color: "white", fontSize: 18 },
  message: { marginTop: 20, marginBottom: 10, fontSize: 16 },
});
```

▶ **[Snack에서 바로 실행하기](https://snack.expo.dev/?name=WEB530%20W6%20Example%3A%20Pressable%20-%20Starter%20Code&platform=web&sdkVersion=54.0.0&code=import%20%7B%20View%2C%20Text%2C%20StyleSheet%20%7D%20from%20%22react-native%22%3B%0A%0Aexport%20default%20function%20MyApp%28%29%20%7B%0A%20%20return%20%28%0A%20%20%20%20%3CView%20style%3D%7Bstyles.container%7D%3E%0A%20%20%20%20%20%20%3CView%20style%3D%7Bstyles.button%7D%3E%0A%20%20%20%20%20%20%20%20%3CText%20style%3D%7Bstyles.buttonText%7D%3ETap%20Me%3C%2FText%3E%0A%20%20%20%20%20%20%3C%2FView%3E%0A%20%20%20%20%3C%2FView%3E%0A%20%20%29%3B%0A%7D%0A%0Aconst%20styles%20%3D%20StyleSheet.create%28%7B%0A%20%20container%3A%20%7B%20flex%3A%201%2C%20paddingTop%3A%2060%2C%20alignItems%3A%20%22center%22%20%7D%2C%0A%20%20button%3A%20%7B%0A%20%20%20%20width%3A%20200%2C%0A%20%20%20%20padding%3A%2020%2C%0A%20%20%20%20borderRadius%3A%208%2C%0A%20%20%20%20alignItems%3A%20%22center%22%2C%0A%20%20%20%20backgroundColor%3A%20%22%232196F3%22%2C%0A%20%20%7D%2C%0A%20%20buttonText%3A%20%7B%20color%3A%20%22white%22%2C%20fontSize%3A%2018%20%7D%2C%0A%20%20message%3A%20%7B%20marginTop%3A%2020%2C%20marginBottom%3A%2010%2C%20fontSize%3A%2016%20%7D%2C%0A%7D%29%3B%0A)** (SDK 54, 필요한 패키지 자동 포함)

- A `View` has no `onPress`. Looking like a button is not enough.

**🇰🇷 한글 해설**

버튼처럼 **생긴** View. 하지만 View에는 `onPress`가 없어서 눌러도 아무 일 없음. "생긴 것만으로는 버튼이 아니다."

#### 💻 Step 1 - Make It Pressable

- Add `useState` and `Pressable` to the imports.


<p class="typeit" id="practice-2">⌨️ <b>이 코드는 Snack에서 직접 쳐 보세요</b>: View를 Pressable로 바꾸고 onPress에서 setTaps((prev) =&gt; prev + 1)</p>

```jsx
import { useState } from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
```

- Add state for the tap count at the top of `MyApp`.


<p class="typeit sm">⌨️ 이 부분도 직접 쳐 보세요</p>

```jsx
const [taps, setTaps] = useState(0);
```

- Change the button `View` to a `Pressable` with an `onPress`, and show the count under it.


<p class="typeit sm">⌨️ 이 부분도 직접 쳐 보세요</p>

```jsx
<Pressable
  style={styles.button}
  onPress={() => setTaps((prev) => prev + 1)}
>
  <Text style={styles.buttonText}>Tap Me</Text>
</Pressable>
<Text style={styles.message}>Taps: {taps}</Text>
```

- Run it and tap. The count goes up, but nothing on the button changes while your finger is down. On a phone the button feels dead.

**🇰🇷 한글 해설**

View를 `Pressable`로 바꾸고 `onPress={() => setTaps((prev) => prev + 1)}`. 숫자는 오르는데 누르는 동안 **모양 변화가 없어서** 폰에선 "죽은" 느낌.

#### 💻 Step 2 - Show Pressed Feedback

- `style` on a `Pressable` can be a function. It receives `{ pressed }` and returns the style to use. Replace the `style` prop.


<p class="typeit" id="practice-3">⌨️ <b>이 코드는 Snack에서 직접 쳐 보세요</b>: style={({ pressed }) =&gt; [styles.button, pressed &amp;&amp; styles.pressed]}</p>

```jsx
style={({ pressed }) => [styles.button, pressed && styles.pressed]}
```

- Add the pressed style.


<p class="typeit sm">⌨️ 이 부분도 직접 쳐 보세요</p>

```jsx
pressed: { backgroundColor: "#1565C0" },
```

- A style array applies left to right, so `styles.pressed` overrides the background. When `pressed` is `false`, the `false` in the array is ignored.
- Press and hold. The button darkens the moment the press starts and goes back when you let go. That instant change is the visual feedback every touch target needs.

**🇰🇷 한글 해설**

- Pressable의 `style`은 **함수**가 될 수 있어요: `({ pressed }) => [styles.button, pressed && styles.pressed]`.
- 스타일 배열은 **왼쪽에서 오른쪽**으로 적용, pressed가 배경을 덮어씀. pressed가 false면 배열의 false는 무시.
- 손가락이 닿는 **순간** 어두워지고 떼면 원래대로. 모든 터치 대상에 필요한 **시각 피드백**.

#### 💻 Step 3 - Log Every Press Event

- `onPress` is one of four events. Add a log to see them all. Under the `taps` state, add the list and a function that adds one entry to it.


<p class="typeit" id="practice-4">⌨️ <b>이 코드는 Snack에서 직접 쳐 보세요</b>: onPressIn, onPressOut, onPress, onLongPress를 로그로 찍기</p>

```jsx
const [events, setEvents] = useState([]);

function log(name) {
  setEvents((prev) => [...prev, name]);
}
```

- Give the `Pressable` the other three events, and log `onPress` as well. `onPressIn` does not call `log`: it replaces the whole list, so every new press starts with an empty log and shows only its own events.


<p class="typeit sm">⌨️ 이 부분도 직접 쳐 보세요</p>

```jsx
onPress={() => {
  setTaps((prev) => prev + 1);
  log("onPress");
}}
onPressIn={() => setEvents(["onPressIn"])}
onPressOut={() => log("onPressOut")}
onLongPress={() => log("onLongPress")}
```

- Show the log under the count, with its style.


<p class="typeit sm">⌨️ 이 부분도 직접 쳐 보세요</p>

```jsx
{events.map((event, index) => (
  <Text key={index} style={styles.event}>
    {event}
  </Text>
))}
```


<p class="typeit sm">⌨️ 이 부분도 직접 쳐 보세요</p>

```jsx
event: { fontSize: 14, color: "#666" },
```

- Tap: `onPressIn`, `onPressOut`, `onPress`. The finger goes down, comes up, and only then is it a tap.
- The list is cleared in `onPressIn`, not `onPress`, because `onPressIn` is the first event of every press. `onPress` comes last, so clearing there would wipe out the two events before it.
- Hold for half a second: `onPressIn`, `onLongPress`, `onPressOut`, and no `onPress`. The count does not change. A long press replaces the tap; it is not added to it. Long press is for secondary actions, like a context menu.
- On a phone, press the button, slide your finger off it, and let go: `onPressIn`, `onPressOut`, and nothing else. Sliding off cancels the press. That is the first cancellable gesture of the week.

**🇰🇷 한글 해설**

- 이벤트 4개를 로그로 확인. `onPressIn`에서 로그를 **비우는** 이유: 모든 누름의 **첫 이벤트**라서. onPress는 마지막이라 거기서 비우면 앞의 두 개가 지워져요.
- 탭: In → Out → Press. 길게: In → LongPress → Out, **onPress 없음, 숫자 안 오름**. 길게 누르기는 탭에 **추가가 아니라 대체**. 보조 기능(컨텍스트 메뉴)용.
- 밖으로 빼고 떼기: In → Out만 → **이번 주 첫 번째 취소 가능한 제스처**.

#### 💻 Finished Code

- Compare against this if something is not working.

```jsx
import { useState } from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";

export default function MyApp() {
  const [taps, setTaps] = useState(0);
  const [events, setEvents] = useState([]);

  function log(name) {
    setEvents((prev) => [...prev, name]);
  }

  return (
    <View style={styles.container}>
      <Pressable
        style={({ pressed }) => [styles.button, pressed && styles.pressed]}
        onPress={() => {
          setTaps((prev) => prev + 1);
          log("onPress");
        }}
        onPressIn={() => setEvents(["onPressIn"])}
        onPressOut={() => log("onPressOut")}
        onLongPress={() => log("onLongPress")}
      >
        <Text style={styles.buttonText}>Tap Me</Text>
      </Pressable>
      <Text style={styles.message}>Taps: {taps}</Text>
      {events.map((event, index) => (
        <Text key={index} style={styles.event}>
          {event}
        </Text>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingTop: 60, alignItems: "center" },
  button: {
    width: 200,
    padding: 20,
    borderRadius: 8,
    alignItems: "center",
    backgroundColor: "#2196F3",
  },
  pressed: { backgroundColor: "#1565C0" },
  buttonText: { color: "white", fontSize: 18 },
  message: { marginTop: 20, marginBottom: 10, fontSize: 16 },
  event: { fontSize: 14, color: "#666" },
});
```

▶ **[Snack에서 바로 실행하기](https://snack.expo.dev/?name=WEB530%20W6%20Example%3A%20Pressable%20-%20Finished%20Code&platform=web&sdkVersion=54.0.0&code=import%20%7B%20useState%20%7D%20from%20%22react%22%3B%0Aimport%20%7B%20View%2C%20Text%2C%20Pressable%2C%20StyleSheet%20%7D%20from%20%22react-native%22%3B%0A%0Aexport%20default%20function%20MyApp%28%29%20%7B%0A%20%20const%20%5Btaps%2C%20setTaps%5D%20%3D%20useState%280%29%3B%0A%20%20const%20%5Bevents%2C%20setEvents%5D%20%3D%20useState%28%5B%5D%29%3B%0A%0A%20%20function%20log%28name%29%20%7B%0A%20%20%20%20setEvents%28%28prev%29%20%3D%3E%20%5B...prev%2C%20name%5D%29%3B%0A%20%20%7D%0A%0A%20%20return%20%28%0A%20%20%20%20%3CView%20style%3D%7Bstyles.container%7D%3E%0A%20%20%20%20%20%20%3CPressable%0A%20%20%20%20%20%20%20%20style%3D%7B%28%7B%20pressed%20%7D%29%20%3D%3E%20%5Bstyles.button%2C%20pressed%20%26%26%20styles.pressed%5D%7D%0A%20%20%20%20%20%20%20%20onPress%3D%7B%28%29%20%3D%3E%20%7B%0A%20%20%20%20%20%20%20%20%20%20setTaps%28%28prev%29%20%3D%3E%20prev%20%2B%201%29%3B%0A%20%20%20%20%20%20%20%20%20%20log%28%22onPress%22%29%3B%0A%20%20%20%20%20%20%20%20%7D%7D%0A%20%20%20%20%20%20%20%20onPressIn%3D%7B%28%29%20%3D%3E%20setEvents%28%5B%22onPressIn%22%5D%29%7D%0A%20%20%20%20%20%20%20%20onPressOut%3D%7B%28%29%20%3D%3E%20log%28%22onPressOut%22%29%7D%0A%20%20%20%20%20%20%20%20onLongPress%3D%7B%28%29%20%3D%3E%20log%28%22onLongPress%22%29%7D%0A%20%20%20%20%20%20%3E%0A%20%20%20%20%20%20%20%20%3CText%20style%3D%7Bstyles.buttonText%7D%3ETap%20Me%3C%2FText%3E%0A%20%20%20%20%20%20%3C%2FPressable%3E%0A%20%20%20%20%20%20%3CText%20style%3D%7Bstyles.message%7D%3ETaps%3A%20%7Btaps%7D%3C%2FText%3E%0A%20%20%20%20%20%20%7Bevents.map%28%28event%2C%20index%29%20%3D%3E%20%28%0A%20%20%20%20%20%20%20%20%3CText%20key%3D%7Bindex%7D%20style%3D%7Bstyles.event%7D%3E%0A%20%20%20%20%20%20%20%20%20%20%7Bevent%7D%0A%20%20%20%20%20%20%20%20%3C%2FText%3E%0A%20%20%20%20%20%20%29%29%7D%0A%20%20%20%20%3C%2FView%3E%0A%20%20%29%3B%0A%7D%0A%0Aconst%20styles%20%3D%20StyleSheet.create%28%7B%0A%20%20container%3A%20%7B%20flex%3A%201%2C%20paddingTop%3A%2060%2C%20alignItems%3A%20%22center%22%20%7D%2C%0A%20%20button%3A%20%7B%0A%20%20%20%20width%3A%20200%2C%0A%20%20%20%20padding%3A%2020%2C%0A%20%20%20%20borderRadius%3A%208%2C%0A%20%20%20%20alignItems%3A%20%22center%22%2C%0A%20%20%20%20backgroundColor%3A%20%22%232196F3%22%2C%0A%20%20%7D%2C%0A%20%20pressed%3A%20%7B%20backgroundColor%3A%20%22%231565C0%22%20%7D%2C%0A%20%20buttonText%3A%20%7B%20color%3A%20%22white%22%2C%20fontSize%3A%2018%20%7D%2C%0A%20%20message%3A%20%7B%20marginTop%3A%2020%2C%20marginBottom%3A%2010%2C%20fontSize%3A%2016%20%7D%2C%0A%20%20event%3A%20%7B%20fontSize%3A%2014%2C%20color%3A%20%22%23666%22%20%7D%2C%0A%7D%29%3B%0A)** (SDK 54, 필요한 패키지 자동 포함) <button class="snack-embed" type="button">👀 여기서 결과 보기</button>

**🇰🇷 한글 해설**

**완성 코드 해설**: `taps`, `events` state. Pressable에 style 함수 + 4개 이벤트. 이벤트 순서 표를 직접 확인할 수 있는 실험 앱이에요. Web에서 클릭/꾹 누르기로 해 보세요.

### 💻 Example: Hit Slop

- Touch targets must be big enough for a finger: at least 44 by 44 points on iOS, 48 on Android. Icons are often smaller than that.
- `hitSlop` makes the touchable area bigger without changing the layout. The box looks the same; the finger has more room.
- Run this one on your phone. The web preview ignores `hitSlop`, so a click just outside the box does nothing there.
- Replace everything in `App.js`. It is a 24-point close button, outlined in red so you can see how small it is.

```jsx
import { useState } from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";

export default function MyApp() {
  const [taps, setTaps] = useState(0);

  return (
    <View style={styles.container}>
      <Pressable style={styles.close} onPress={() => setTaps((prev) => prev + 1)}>
        <Text style={styles.closeText}>X</Text>
      </Pressable>
      <Text style={styles.message}>Taps: {taps}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingTop: 60, alignItems: "center" },
  close: {
    width: 24,
    height: 24,
    borderWidth: 1,
    borderColor: "red",
    alignItems: "center",
    justifyContent: "center",
  },
  closeText: { fontSize: 12 },
  message: { marginTop: 40, fontSize: 16 },
});
```

▶ **[Snack에서 바로 실행하기](https://snack.expo.dev/?name=WEB530%20W6%20Example%3A%20Hit%20Slop&platform=web&sdkVersion=54.0.0&code=import%20%7B%20useState%20%7D%20from%20%22react%22%3B%0Aimport%20%7B%20View%2C%20Text%2C%20Pressable%2C%20StyleSheet%20%7D%20from%20%22react-native%22%3B%0A%0Aexport%20default%20function%20MyApp%28%29%20%7B%0A%20%20const%20%5Btaps%2C%20setTaps%5D%20%3D%20useState%280%29%3B%0A%0A%20%20return%20%28%0A%20%20%20%20%3CView%20style%3D%7Bstyles.container%7D%3E%0A%20%20%20%20%20%20%3CPressable%20style%3D%7Bstyles.close%7D%20onPress%3D%7B%28%29%20%3D%3E%20setTaps%28%28prev%29%20%3D%3E%20prev%20%2B%201%29%7D%3E%0A%20%20%20%20%20%20%20%20%3CText%20style%3D%7Bstyles.closeText%7D%3EX%3C%2FText%3E%0A%20%20%20%20%20%20%3C%2FPressable%3E%0A%20%20%20%20%20%20%3CText%20style%3D%7Bstyles.message%7D%3ETaps%3A%20%7Btaps%7D%3C%2FText%3E%0A%20%20%20%20%3C%2FView%3E%0A%20%20%29%3B%0A%7D%0A%0Aconst%20styles%20%3D%20StyleSheet.create%28%7B%0A%20%20container%3A%20%7B%20flex%3A%201%2C%20paddingTop%3A%2060%2C%20alignItems%3A%20%22center%22%20%7D%2C%0A%20%20close%3A%20%7B%0A%20%20%20%20width%3A%2024%2C%0A%20%20%20%20height%3A%2024%2C%0A%20%20%20%20borderWidth%3A%201%2C%0A%20%20%20%20borderColor%3A%20%22red%22%2C%0A%20%20%20%20alignItems%3A%20%22center%22%2C%0A%20%20%20%20justifyContent%3A%20%22center%22%2C%0A%20%20%7D%2C%0A%20%20closeText%3A%20%7B%20fontSize%3A%2012%20%7D%2C%0A%20%20message%3A%20%7B%20marginTop%3A%2040%2C%20fontSize%3A%2016%20%7D%2C%0A%7D%29%3B%0A)** (SDK 54, 필요한 패키지 자동 포함) <button class="snack-embed" type="button">👀 여기서 결과 보기</button>

- Tap just outside the red box. Nothing. Tap the edge with your thumb and it is a coin toss.
- Add `hitSlop` to the `Pressable`.

```jsx
hitSlop={20}
```

- Tap just outside the box again. It counts. The target is now 20 points bigger on every side, 64 by 64, and the layout did not move.
- `hitSlop` also takes an object for one side at a time, such as `{ top: 10, bottom: 10 }`.
- Keep slop smaller than the gap to the next target. Two overlapping touch areas mean a tap goes to the wrong one.

**🇰🇷 한글 해설**

- 손가락용 최소 크기: **iOS 44×44, Android 48**. 아이콘은 보통 더 작아요.
- 24포인트 닫기 버튼(빨간 테두리) → 바깥을 탭하면 안 됨.
- `hitSlop={20}` → 사방 20씩, 실제 터치 영역 **64×64**(24 + 20 + 20), 레이아웃은 그대로.
- 객체로 한쪽씩 `{ top: 10, bottom: 10 }`. 옆 대상과 겹치지 않게.
- Web은 hitSlop 무시 → 폰에서 확인.

### 💻 Scrolling

- Scrolling is a continuous gesture. A vertical drag moves the content every frame for as long as the finger moves.
- Mobile scrolling has momentum. A flick keeps scrolling after the finger lifts and slows down on its own. A slow drag moves exactly as far as the finger. React Native uses the platform's own scrolling, so it feels like every other app on the phone.
- From Week 5: `ScrollView` renders all of its children at once and suits a page of content. `FlatList` renders only what is near the screen and suits long or fetched lists.

**🇰🇷 한글 해설**

- 스크롤 = continuous. 관성(momentum): 튕기면 계속 가다 느려짐, 천천히 끌면 손가락만큼.
- 5주차 복습: ScrollView는 전부 한 번에(페이지용), FlatList는 화면 근처만(긴 목록, 서버 목록).

### 💻 Example: ScrollView

- A vertical page of rows, then a horizontal row of cards inside it. Most app home screens have both: a feed that scrolls down, with carousels that scroll sideways.

**🇰🇷 한글 해설**

세로 페이지 + 그 안의 가로 카드 줄. 대부분 앱 홈 화면 구조.

#### 💻 Starter Code

- Replace everything in `App.js`.


<p class="typeit" id="practice-5">⌨️ <b>이 코드는 Snack에서 직접 쳐 보세요</b>: Row 30개짜리 세로 ScrollView 쳐 두기</p>

```jsx
import { ScrollView, View, Text, StyleSheet } from "react-native";

const rows = Array.from({ length: 30 }, (_, i) => `Item ${i + 1}`);

export default function MyApp() {
  return (
    <ScrollView style={styles.container}>
      {rows.map((row) => (
        <View key={row} style={styles.row}>
          <Text style={styles.text}>{row}</Text>
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, marginTop: 60 },
  row: { padding: 20, borderBottomWidth: 1, borderColor: "#ccc" },
  text: { fontSize: 18 },
});
```

▶ **[Snack에서 바로 실행하기](https://snack.expo.dev/?name=WEB530%20W6%20Example%3A%20ScrollView%20-%20Starter%20Code&platform=web&sdkVersion=54.0.0&code=import%20%7B%20ScrollView%2C%20View%2C%20Text%2C%20StyleSheet%20%7D%20from%20%22react-native%22%3B%0A%0Aconst%20rows%20%3D%20Array.from%28%7B%20length%3A%2030%20%7D%2C%20%28_%2C%20i%29%20%3D%3E%20%60Item%20%24%7Bi%20%2B%201%7D%60%29%3B%0A%0Aexport%20default%20function%20MyApp%28%29%20%7B%0A%20%20return%20%28%0A%20%20%20%20%3CScrollView%20style%3D%7Bstyles.container%7D%3E%0A%20%20%20%20%20%20%7Brows.map%28%28row%29%20%3D%3E%20%28%0A%20%20%20%20%20%20%20%20%3CView%20key%3D%7Brow%7D%20style%3D%7Bstyles.row%7D%3E%0A%20%20%20%20%20%20%20%20%20%20%3CText%20style%3D%7Bstyles.text%7D%3E%7Brow%7D%3C%2FText%3E%0A%20%20%20%20%20%20%20%20%3C%2FView%3E%0A%20%20%20%20%20%20%29%29%7D%0A%20%20%20%20%3C%2FScrollView%3E%0A%20%20%29%3B%0A%7D%0A%0Aconst%20styles%20%3D%20StyleSheet.create%28%7B%0A%20%20container%3A%20%7B%20flex%3A%201%2C%20marginTop%3A%2060%20%7D%2C%0A%20%20row%3A%20%7B%20padding%3A%2020%2C%20borderBottomWidth%3A%201%2C%20borderColor%3A%20%22%23ccc%22%20%7D%2C%0A%20%20text%3A%20%7B%20fontSize%3A%2018%20%7D%2C%0A%7D%29%3B%0A)** (SDK 54, 필요한 패키지 자동 포함)

- `Array.from({ length: 30 }, ...)` builds 30 strings without typing them. The string doubles as the `key`.
- On a phone, flick the list and watch it coast. Drag slowly and it follows your finger exactly. On the web preview, use the mouse wheel or the trackpad.

**🇰🇷 한글 해설**

`Array.from({ length: 30 }, (_, i) => `Row ${i + 1}`)` 30개 문자열, 문자열 자체를 key로.

#### 💻 Step 1 - Add a Horizontal Row

- Add the cards above `rows`.


<p class="typeit" id="practice-6">⌨️ <b>이 코드는 Snack에서 직접 쳐 보세요</b>: ScrollView horizontal + contentContainerStyle로 가로 카드 줄 추가</p>

```jsx
const cards = Array.from({ length: 10 }, (_, i) => `Card ${i + 1}`);
```

- Add a heading and a horizontal `ScrollView` inside the outer one, above the rows.


<p class="typeit sm">⌨️ 이 부분도 직접 쳐 보세요</p>

```jsx
<Text style={styles.heading}>Featured</Text>
<ScrollView
  horizontal
  showsHorizontalScrollIndicator={false}
  contentContainerStyle={styles.cards}
>
  {cards.map((card) => (
    <View key={card} style={styles.card}>
      <Text style={styles.text}>{card}</Text>
    </View>
  ))}
</ScrollView>
```

- Add the styles.


<p class="typeit sm">⌨️ 이 부분도 직접 쳐 보세요</p>

```jsx
heading: { fontSize: 22, fontWeight: "600", padding: 20 },
cards: { paddingHorizontal: 20, paddingBottom: 20 },
card: {
  width: 150,
  height: 150,
  marginRight: 15,
  borderRadius: 12,
  backgroundColor: "#dde",
  justifyContent: "center",
  alignItems: "center",
},
```

- `horizontal` is the only change that makes it scroll sideways. It is the same gesture, rotated.
- `contentContainerStyle` styles the content inside the scroll area, so the padding scrolls with the cards. `style` would pad the window around them.
- On a phone, drag sideways on the cards: they scroll and the page stays put. Drag up on the cards: the page scrolls. React Native gives the gesture to whichever scroll view matches the direction of the drag. On the web preview, scroll sideways with Shift and the mouse wheel, or two fingers on a trackpad.
- Nesting is safe when the directions differ. A scroll view inside one that scrolls the same way fights it for every drag. A `FlatList` inside a vertical `ScrollView` even warns about it in the console, because the `FlatList` can no longer tell what is on screen. Keep nesting shallow, and use a `FlatList` for the main list.

**🇰🇷 한글 해설**

- **`horizontal`** 한 단어로 가로 스크롤.
- `contentContainerStyle`은 **안의 내용** 스타일이라 패딩이 카드와 같이 스크롤, `style`은 바깥 창.
- 옆으로 끌면 카드, 위로 끌면 페이지. 방향 맞는 스크롤뷰가 제스처를 가져가요.
- 같은 방향 중첩은 싸움, 세로 ScrollView 안 FlatList는 콘솔 경고.

#### 💻 Finished Code

- Compare against this if something is not working.

```jsx
import { ScrollView, View, Text, StyleSheet } from "react-native";

const cards = Array.from({ length: 10 }, (_, i) => `Card ${i + 1}`);
const rows = Array.from({ length: 30 }, (_, i) => `Item ${i + 1}`);

export default function MyApp() {
  return (
    <ScrollView style={styles.container}>
      <Text style={styles.heading}>Featured</Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.cards}
      >
        {cards.map((card) => (
          <View key={card} style={styles.card}>
            <Text style={styles.text}>{card}</Text>
          </View>
        ))}
      </ScrollView>
      {rows.map((row) => (
        <View key={row} style={styles.row}>
          <Text style={styles.text}>{row}</Text>
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, marginTop: 60 },
  heading: { fontSize: 22, fontWeight: "600", padding: 20 },
  cards: { paddingHorizontal: 20, paddingBottom: 20 },
  card: {
    width: 150,
    height: 150,
    marginRight: 15,
    borderRadius: 12,
    backgroundColor: "#dde",
    justifyContent: "center",
    alignItems: "center",
  },
  row: { padding: 20, borderBottomWidth: 1, borderColor: "#ccc" },
  text: { fontSize: 18 },
});
```

▶ **[Snack에서 바로 실행하기](https://snack.expo.dev/?name=WEB530%20W6%20Example%3A%20ScrollView%20-%20Finished%20Code&platform=web&sdkVersion=54.0.0&code=import%20%7B%20ScrollView%2C%20View%2C%20Text%2C%20StyleSheet%20%7D%20from%20%22react-native%22%3B%0A%0Aconst%20cards%20%3D%20Array.from%28%7B%20length%3A%2010%20%7D%2C%20%28_%2C%20i%29%20%3D%3E%20%60Card%20%24%7Bi%20%2B%201%7D%60%29%3B%0Aconst%20rows%20%3D%20Array.from%28%7B%20length%3A%2030%20%7D%2C%20%28_%2C%20i%29%20%3D%3E%20%60Item%20%24%7Bi%20%2B%201%7D%60%29%3B%0A%0Aexport%20default%20function%20MyApp%28%29%20%7B%0A%20%20return%20%28%0A%20%20%20%20%3CScrollView%20style%3D%7Bstyles.container%7D%3E%0A%20%20%20%20%20%20%3CText%20style%3D%7Bstyles.heading%7D%3EFeatured%3C%2FText%3E%0A%20%20%20%20%20%20%3CScrollView%0A%20%20%20%20%20%20%20%20horizontal%0A%20%20%20%20%20%20%20%20showsHorizontalScrollIndicator%3D%7Bfalse%7D%0A%20%20%20%20%20%20%20%20contentContainerStyle%3D%7Bstyles.cards%7D%0A%20%20%20%20%20%20%3E%0A%20%20%20%20%20%20%20%20%7Bcards.map%28%28card%29%20%3D%3E%20%28%0A%20%20%20%20%20%20%20%20%20%20%3CView%20key%3D%7Bcard%7D%20style%3D%7Bstyles.card%7D%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%3CText%20style%3D%7Bstyles.text%7D%3E%7Bcard%7D%3C%2FText%3E%0A%20%20%20%20%20%20%20%20%20%20%3C%2FView%3E%0A%20%20%20%20%20%20%20%20%29%29%7D%0A%20%20%20%20%20%20%3C%2FScrollView%3E%0A%20%20%20%20%20%20%7Brows.map%28%28row%29%20%3D%3E%20%28%0A%20%20%20%20%20%20%20%20%3CView%20key%3D%7Brow%7D%20style%3D%7Bstyles.row%7D%3E%0A%20%20%20%20%20%20%20%20%20%20%3CText%20style%3D%7Bstyles.text%7D%3E%7Brow%7D%3C%2FText%3E%0A%20%20%20%20%20%20%20%20%3C%2FView%3E%0A%20%20%20%20%20%20%29%29%7D%0A%20%20%20%20%3C%2FScrollView%3E%0A%20%20%29%3B%0A%7D%0A%0Aconst%20styles%20%3D%20StyleSheet.create%28%7B%0A%20%20container%3A%20%7B%20flex%3A%201%2C%20marginTop%3A%2060%20%7D%2C%0A%20%20heading%3A%20%7B%20fontSize%3A%2022%2C%20fontWeight%3A%20%22600%22%2C%20padding%3A%2020%20%7D%2C%0A%20%20cards%3A%20%7B%20paddingHorizontal%3A%2020%2C%20paddingBottom%3A%2020%20%7D%2C%0A%20%20card%3A%20%7B%0A%20%20%20%20width%3A%20150%2C%0A%20%20%20%20height%3A%20150%2C%0A%20%20%20%20marginRight%3A%2015%2C%0A%20%20%20%20borderRadius%3A%2012%2C%0A%20%20%20%20backgroundColor%3A%20%22%23dde%22%2C%0A%20%20%20%20justifyContent%3A%20%22center%22%2C%0A%20%20%20%20alignItems%3A%20%22center%22%2C%0A%20%20%7D%2C%0A%20%20row%3A%20%7B%20padding%3A%2020%2C%20borderBottomWidth%3A%201%2C%20borderColor%3A%20%22%23ccc%22%20%7D%2C%0A%20%20text%3A%20%7B%20fontSize%3A%2018%20%7D%2C%0A%7D%29%3B%0A)** (SDK 54, 필요한 패키지 자동 포함) <button class="snack-embed" type="button">👀 여기서 결과 보기</button>

**🇰🇷 한글 해설**

**완성 코드 해설**: 바깥 세로 ScrollView 안에 제목 + 가로 ScrollView(카드들) + 세로 줄 30개.

### 💻 Example: Pressable Rows in a FlatList

- A list has to scroll and its rows have to be tappable. Both start with a finger on a row, so the app must decide which one the user meant.
- React Native decides for you. A finger that lifts without moving is a tap. A finger that moves is a scroll, and the press on the row is cancelled.

**🇰🇷 한글 해설**

목록은 스크롤도, 줄 탭도 돼야 해요. RN이 판단: 안 움직이고 떼면 탭, 움직이면 스크롤(press 취소).

#### 💻 Starter Code

- Replace everything in `App.js`. It is the Week 5 `FlatList` with 40 plain rows.


<p class="typeit" id="practice-7">⌨️ <b>이 코드는 Snack에서 직접 쳐 보세요</b>: 줄 40개 FlatList 시작 코드 쳐 두기</p>

```jsx
import { View, Text, FlatList, StyleSheet } from "react-native";

const rows = Array.from({ length: 40 }, (_, i) => ({
  id: String(i + 1),
  title: `Row ${i + 1}`,
}));

export default function MyApp() {
  return (
    <View style={styles.container}>
      <FlatList
        data={rows}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.row}>
            <Text style={styles.text}>{item.title}</Text>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingTop: 60 },
  row: { padding: 20, borderBottomWidth: 1, borderColor: "#ccc" },
  text: { fontSize: 18 },
});
```

▶ **[Snack에서 바로 실행하기](https://snack.expo.dev/?name=WEB530%20W6%20Example%3A%20Pressable%20Rows%20in%20a%20FlatList%20-%20Starter%20Co&platform=web&sdkVersion=54.0.0&code=import%20%7B%20View%2C%20Text%2C%20FlatList%2C%20StyleSheet%20%7D%20from%20%22react-native%22%3B%0A%0Aconst%20rows%20%3D%20Array.from%28%7B%20length%3A%2040%20%7D%2C%20%28_%2C%20i%29%20%3D%3E%20%28%7B%0A%20%20id%3A%20String%28i%20%2B%201%29%2C%0A%20%20title%3A%20%60Row%20%24%7Bi%20%2B%201%7D%60%2C%0A%7D%29%29%3B%0A%0Aexport%20default%20function%20MyApp%28%29%20%7B%0A%20%20return%20%28%0A%20%20%20%20%3CView%20style%3D%7Bstyles.container%7D%3E%0A%20%20%20%20%20%20%3CFlatList%0A%20%20%20%20%20%20%20%20data%3D%7Brows%7D%0A%20%20%20%20%20%20%20%20keyExtractor%3D%7B%28item%29%20%3D%3E%20item.id%7D%0A%20%20%20%20%20%20%20%20renderItem%3D%7B%28%7B%20item%20%7D%29%20%3D%3E%20%28%0A%20%20%20%20%20%20%20%20%20%20%3CView%20style%3D%7Bstyles.row%7D%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%3CText%20style%3D%7Bstyles.text%7D%3E%7Bitem.title%7D%3C%2FText%3E%0A%20%20%20%20%20%20%20%20%20%20%3C%2FView%3E%0A%20%20%20%20%20%20%20%20%29%7D%0A%20%20%20%20%20%20%2F%3E%0A%20%20%20%20%3C%2FView%3E%0A%20%20%29%3B%0A%7D%0A%0Aconst%20styles%20%3D%20StyleSheet.create%28%7B%0A%20%20container%3A%20%7B%20flex%3A%201%2C%20paddingTop%3A%2060%20%7D%2C%0A%20%20row%3A%20%7B%20padding%3A%2020%2C%20borderBottomWidth%3A%201%2C%20borderColor%3A%20%22%23ccc%22%20%7D%2C%0A%20%20text%3A%20%7B%20fontSize%3A%2018%20%7D%2C%0A%7D%29%3B%0A)** (SDK 54, 필요한 패키지 자동 포함)

**🇰🇷 한글 해설**

5주차 FlatList, 평범한 줄 40개.

#### 💻 Step 1 - Make the Rows Pressable

- Add `Pressable` to the `react-native` import.
- Change each row's `View` to a `Pressable` with pressed feedback.


<p class="typeit" id="practice-8">⌨️ <b>이 코드는 Snack에서 직접 쳐 보세요</b>: 줄 View를 Pressable로 바꾸고 pressed 피드백</p>

```jsx
renderItem={({ item }) => (
  <Pressable
    style={({ pressed }) => [styles.row, pressed && styles.pressed]}
  >
    <Text style={styles.text}>{item.title}</Text>
  </Pressable>
)}
```

- Add the style.


<p class="typeit sm">⌨️ 이 부분도 직접 쳐 보세요</p>

```jsx
pressed: { backgroundColor: "#eee" },
```

- Tap a row and it greys while your finger is down.
- On a phone, put your finger on a row and start scrolling. The row may grey for an instant, then the list takes over and the row goes back to white. That is the press being cancelled because the finger moved.

**🇰🇷 한글 해설**

줄 View → Pressable + pressed 피드백. 폰에서 줄 위에서 스크롤을 시작하면 순간 회색이 됐다가 목록이 가져가며 원래대로 = **press 취소**.

#### 💻 Step 2 - Select Rows

- Add `useState` to the imports. Store the selected rows as an object of ids, so `{ "3": true, "7": true }` means rows 3 and 7 are selected.


<p class="typeit" id="practice-9">⌨️ <b>이 코드는 Snack에서 직접 쳐 보세요</b>: selected 객체 state + toggle(id)로 줄 선택 표시</p>

```jsx
const [selected, setSelected] = useState({});

function toggle(id) {
  setSelected((prev) => ({ ...prev, [id]: !prev[id] }));
}

const count = Object.values(selected).filter(Boolean).length;
```

- `toggle` copies the previous object and flips one id. The new state depends on the old, so it uses the updater form.
- `count` is derived on every render, like `visible` in Week 5. It is not state.
- Add the count above the `FlatList`.


<p class="typeit sm">⌨️ 이 부분도 직접 쳐 보세요</p>

```jsx
<Text style={styles.heading}>{count} selected</Text>
```

- Give each row an `onPress` and a selected style. The pressed style comes last so it still shows on a selected row.


<p class="typeit sm">⌨️ 이 부분도 직접 쳐 보세요</p>

```jsx
<Pressable
  style={({ pressed }) => [
    styles.row,
    selected[item.id] && styles.selected,
    pressed && styles.pressed,
  ]}
  onPress={() => toggle(item.id)}
>
```

- Add `extraData` to the `FlatList`.


<p class="typeit sm">⌨️ 이 부분도 직접 쳐 보세요</p>

```jsx
extraData={selected}
```

- `FlatList` skips re-rendering its rows when its props look unchanged, and `data` does not change when a row is selected. `extraData` tells it the rows also depend on `selected`. This list would happen to work without it, because the inline `renderItem` is a new function on every render, but a memoized `renderItem` would leave a tapped row looking unselected. Pass `extraData` whenever rows read state from outside `data`.
- Add the styles.


<p class="typeit sm">⌨️ 이 부분도 직접 쳐 보세요</p>

```jsx
heading: { fontSize: 18, fontWeight: "600", padding: 20 },
selected: { backgroundColor: "#BBDEFB" },
```

- Tap a few rows: they turn blue and the count follows. Tap one again to clear it. On a phone, a scroll that starts on a row never selects it.

**🇰🇷 한글 해설**

- 선택 상태는 **id 객체** `{ "3": true }`. `toggle`: `setSelected((prev) => ({ ...prev, [id]: !prev[id] }))` 복사 + 뒤집기, 함수형.
- `count`는 state가 아니라 **derived**(5주차 visible처럼).
- 스타일 순서: `[styles.row, selected[id] && styles.selected, pressed && styles.pressed]` → pressed가 마지막이라 선택된 줄에서도 누름 피드백.
- **`extraData={selected}`**: FlatList는 props가 안 바뀌면 줄을 다시 안 그려요. 줄 선택해도 `data`는 그대로라 "rows가 selected에도 의존한다"고 알려 줘야 해요. 이 예제는 renderItem이 인라인 함수라 우연히 동작하지만, memoized renderItem이면 선택이 안 보여요. **data 밖의 state를 읽으면 항상 extraData.**

#### 💻 Finished Code

- Compare against this if something is not working.

```jsx
import { useState } from "react";
import { View, Text, Pressable, FlatList, StyleSheet } from "react-native";

const rows = Array.from({ length: 40 }, (_, i) => ({
  id: String(i + 1),
  title: `Row ${i + 1}`,
}));

export default function MyApp() {
  const [selected, setSelected] = useState({});

  function toggle(id) {
    setSelected((prev) => ({ ...prev, [id]: !prev[id] }));
  }

  const count = Object.values(selected).filter(Boolean).length;

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>{count} selected</Text>
      <FlatList
        data={rows}
        keyExtractor={(item) => item.id}
        extraData={selected}
        renderItem={({ item }) => (
          <Pressable
            style={({ pressed }) => [
              styles.row,
              selected[item.id] && styles.selected,
              pressed && styles.pressed,
            ]}
            onPress={() => toggle(item.id)}
          >
            <Text style={styles.text}>{item.title}</Text>
          </Pressable>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingTop: 60 },
  heading: { fontSize: 18, fontWeight: "600", padding: 20 },
  row: { padding: 20, borderBottomWidth: 1, borderColor: "#ccc" },
  selected: { backgroundColor: "#BBDEFB" },
  pressed: { backgroundColor: "#eee" },
  text: { fontSize: 18 },
});
```

▶ **[Snack에서 바로 실행하기](https://snack.expo.dev/?name=WEB530%20W6%20Example%3A%20Pressable%20Rows%20in%20a%20FlatList%20-%20Finished%20C&platform=web&sdkVersion=54.0.0&code=import%20%7B%20useState%20%7D%20from%20%22react%22%3B%0Aimport%20%7B%20View%2C%20Text%2C%20Pressable%2C%20FlatList%2C%20StyleSheet%20%7D%20from%20%22react-native%22%3B%0A%0Aconst%20rows%20%3D%20Array.from%28%7B%20length%3A%2040%20%7D%2C%20%28_%2C%20i%29%20%3D%3E%20%28%7B%0A%20%20id%3A%20String%28i%20%2B%201%29%2C%0A%20%20title%3A%20%60Row%20%24%7Bi%20%2B%201%7D%60%2C%0A%7D%29%29%3B%0A%0Aexport%20default%20function%20MyApp%28%29%20%7B%0A%20%20const%20%5Bselected%2C%20setSelected%5D%20%3D%20useState%28%7B%7D%29%3B%0A%0A%20%20function%20toggle%28id%29%20%7B%0A%20%20%20%20setSelected%28%28prev%29%20%3D%3E%20%28%7B%20...prev%2C%20%5Bid%5D%3A%20%21prev%5Bid%5D%20%7D%29%29%3B%0A%20%20%7D%0A%0A%20%20const%20count%20%3D%20Object.values%28selected%29.filter%28Boolean%29.length%3B%0A%0A%20%20return%20%28%0A%20%20%20%20%3CView%20style%3D%7Bstyles.container%7D%3E%0A%20%20%20%20%20%20%3CText%20style%3D%7Bstyles.heading%7D%3E%7Bcount%7D%20selected%3C%2FText%3E%0A%20%20%20%20%20%20%3CFlatList%0A%20%20%20%20%20%20%20%20data%3D%7Brows%7D%0A%20%20%20%20%20%20%20%20keyExtractor%3D%7B%28item%29%20%3D%3E%20item.id%7D%0A%20%20%20%20%20%20%20%20extraData%3D%7Bselected%7D%0A%20%20%20%20%20%20%20%20renderItem%3D%7B%28%7B%20item%20%7D%29%20%3D%3E%20%28%0A%20%20%20%20%20%20%20%20%20%20%3CPressable%0A%20%20%20%20%20%20%20%20%20%20%20%20style%3D%7B%28%7B%20pressed%20%7D%29%20%3D%3E%20%5B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20styles.row%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20selected%5Bitem.id%5D%20%26%26%20styles.selected%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20pressed%20%26%26%20styles.pressed%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%5D%7D%0A%20%20%20%20%20%20%20%20%20%20%20%20onPress%3D%7B%28%29%20%3D%3E%20toggle%28item.id%29%7D%0A%20%20%20%20%20%20%20%20%20%20%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%3CText%20style%3D%7Bstyles.text%7D%3E%7Bitem.title%7D%3C%2FText%3E%0A%20%20%20%20%20%20%20%20%20%20%3C%2FPressable%3E%0A%20%20%20%20%20%20%20%20%29%7D%0A%20%20%20%20%20%20%2F%3E%0A%20%20%20%20%3C%2FView%3E%0A%20%20%29%3B%0A%7D%0A%0Aconst%20styles%20%3D%20StyleSheet.create%28%7B%0A%20%20container%3A%20%7B%20flex%3A%201%2C%20paddingTop%3A%2060%20%7D%2C%0A%20%20heading%3A%20%7B%20fontSize%3A%2018%2C%20fontWeight%3A%20%22600%22%2C%20padding%3A%2020%20%7D%2C%0A%20%20row%3A%20%7B%20padding%3A%2020%2C%20borderBottomWidth%3A%201%2C%20borderColor%3A%20%22%23ccc%22%20%7D%2C%0A%20%20selected%3A%20%7B%20backgroundColor%3A%20%22%23BBDEFB%22%20%7D%2C%0A%20%20pressed%3A%20%7B%20backgroundColor%3A%20%22%23eee%22%20%7D%2C%0A%20%20text%3A%20%7B%20fontSize%3A%2018%20%7D%2C%0A%7D%29%3B%0A)** (SDK 54, 필요한 패키지 자동 포함) <button class="snack-embed" type="button">👀 여기서 결과 보기</button>

**🇰🇷 한글 해설**

**완성 코드 해설**: `selected` 객체 state, `toggle` 함수, derived `count`, Pressable 줄 + 3단 스타일 배열, `extraData`. Test 3에 "선택 가능한 목록" 문제가 나오면 이 코드가 정답 패턴이에요.

### 💻 Swipe and Cancel

- A swipe is a horizontal drag. Apps use it for quick actions on a row: delete, archive, reveal more options. Mail, Messages and most to-do apps do this.
- A swipe must be cancellable. The user may start one and change their mind, so a short swipe snaps back and does nothing. Only a deliberate swipe acts.
- A horizontal swipe must not block vertical scrolling. The row should only claim the gesture once the finger is clearly moving sideways.
- The swipe examples need a touch screen. Run them on your phone with **My Device**.

**🇰🇷 한글 해설**

스와이프 = 가로 드래그. 조건: **취소 가능**(짧으면 원위치), **세로 스크롤을 막지 않기**(확실히 옆으로 갈 때만 가져가기). 폰 필요.

### 💻 Example: Drag and Snap Back

- Build a swipe by hand first, with two tools that come with React Native. `PanResponder` reports where the finger is. `Animated` moves a view without re-rendering the component on every frame.

**🇰🇷 한글 해설**

RN 내장 도구로 직접 만들어 보기: `PanResponder`(손가락 위치), `Animated`(다시 렌더링 없이 이동).

#### 💻 Starter Code

- Replace everything in `App.js`. It is a card that does not move.


<p class="typeit" id="practice-10">⌨️ <b>이 코드는 Snack에서 직접 쳐 보세요</b>: 안 움직이는 카드 시작 코드 쳐 두기</p>

```jsx
import { View, Text, StyleSheet } from "react-native";

export default function MyApp() {
  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.text}>Swipe Me</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingTop: 100, paddingHorizontal: 20 },
  card: { padding: 20, borderRadius: 8, backgroundColor: "#eef" },
  text: { fontSize: 18 },
});
```

▶ **[Snack에서 바로 실행하기](https://snack.expo.dev/?name=WEB530%20W6%20Example%3A%20Drag%20and%20Snap%20Back%20-%20Starter%20Code&platform=web&sdkVersion=54.0.0&code=import%20%7B%20View%2C%20Text%2C%20StyleSheet%20%7D%20from%20%22react-native%22%3B%0A%0Aexport%20default%20function%20MyApp%28%29%20%7B%0A%20%20return%20%28%0A%20%20%20%20%3CView%20style%3D%7Bstyles.container%7D%3E%0A%20%20%20%20%20%20%3CView%20style%3D%7Bstyles.card%7D%3E%0A%20%20%20%20%20%20%20%20%3CText%20style%3D%7Bstyles.text%7D%3ESwipe%20Me%3C%2FText%3E%0A%20%20%20%20%20%20%3C%2FView%3E%0A%20%20%20%20%3C%2FView%3E%0A%20%20%29%3B%0A%7D%0A%0Aconst%20styles%20%3D%20StyleSheet.create%28%7B%0A%20%20container%3A%20%7B%20flex%3A%201%2C%20paddingTop%3A%20100%2C%20paddingHorizontal%3A%2020%20%7D%2C%0A%20%20card%3A%20%7B%20padding%3A%2020%2C%20borderRadius%3A%208%2C%20backgroundColor%3A%20%22%23eef%22%20%7D%2C%0A%20%20text%3A%20%7B%20fontSize%3A%2018%20%7D%2C%0A%7D%29%3B%0A)** (SDK 54, 필요한 패키지 자동 포함)

**🇰🇷 한글 해설**

안 움직이는 카드.

#### 💻 Step 1 - Follow the Finger

- Add `useRef`, `Animated` and `PanResponder` to the imports.


<p class="typeit" id="practice-11">⌨️ <b>이 코드는 Snack에서 직접 쳐 보세요</b>: useRef(new Animated.Value(0)) + PanResponder로 손가락 따라가기</p>

```jsx
import { useRef } from "react";
import { View, Text, Animated, PanResponder, StyleSheet } from "react-native";
```

- At the top of `MyApp`, create an animated value for the card's horizontal offset.


<p class="typeit sm">⌨️ 이 부분도 직접 쳐 보세요</p>

```jsx
const translateX = useRef(new Animated.Value(0)).current;
```

- `useRef` is a hook that keeps the same object for the whole life of the component. Writing `new Animated.Value(0)` straight in the component would make a new value, back at 0, on every render. `useRef` creates it once, and `.current` is the value it holds. Changing it does not cause a render.
- Under it, create the pan responder, also kept in a ref.


<p class="typeit sm">⌨️ 이 부분도 직접 쳐 보세요</p>

```jsx
const pan = useRef(
  PanResponder.create({
    onMoveShouldSetPanResponder: (_, gesture) => Math.abs(gesture.dx) > 10,
    onPanResponderMove: (_, gesture) => {
      translateX.setValue(gesture.dx);
    },
  })
).current;
```

- `gesture.dx` is how far the finger has moved sideways since it went down.
- `onMoveShouldSetPanResponder` decides whether this view takes the gesture. It only says yes after 10 points of sideways movement, so a tap or a vertical drag is left for anything else on the screen, like a scroll view. That is the gesture priority rule in one line.
- `onPanResponderMove` runs for every movement and sets the offset. No state, no re-render.
- Change the card `View` to an `Animated.View`, spread the handlers onto it, and move it with a transform.


<p class="typeit sm">⌨️ 이 부분도 직접 쳐 보세요</p>

```jsx
<Animated.View
  {...pan.panHandlers}
  style={[styles.card, { transform: [{ translateX }] }]}
>
  <Text style={styles.text}>Swipe Me</Text>
</Animated.View>
```

- Drag the card. It follows your finger. Let go, and it stays wherever you left it.

**🇰🇷 한글 해설**

- `const translateX = useRef(new Animated.Value(0)).current;` **useRef**: 일생 동안 같은 객체, `.current`가 값, 바꿔도 렌더링 안 함. 컴포넌트에 그냥 `new Animated.Value(0)`을 쓰면 렌더링마다 0으로 리셋.
- `PanResponder.create({...})`도 ref에.
- `gesture.dx` = 손가락이 내려간 뒤 옆으로 움직인 거리.
- `onMoveShouldSetPanResponder: (_, g) => Math.abs(g.dx) > 10` → 옆으로 10 넘어야 가져감(제스처 우선순위 한 줄 요약).
- `onPanResponderMove`: 움직일 때마다 offset 설정. state 없음, 렌더링 없음.
- 카드를 `Animated.View`로, `{...panResponder.panHandlers}` 펼치기, `transform: [{ translateX }]`로 이동.
- 놓으면 그 자리에 멈춤 → Step 2.

#### 💻 Step 2 - Snap Back on Release

- Add `onPanResponderRelease` to the `PanResponder.create` object.


<p class="typeit" id="practice-12">⌨️ <b>이 코드는 Snack에서 직접 쳐 보세요</b>: onPanResponderRelease에서 Animated.spring으로 복귀</p>

```jsx
onPanResponderRelease: () => {
  Animated.spring(translateX, {
    toValue: 0,
    useNativeDriver: true,
  }).start();
},
```

- `Animated.spring` animates the value back to 0 with a little bounce. `useNativeDriver: true` runs the animation on the native side, so it stays smooth even when JavaScript is busy.
- Drag and let go. The card springs home. Every swipe is cancelled, which is the safe default, but now nothing ever happens.

**🇰🇷 한글 해설**

`onPanResponderRelease`에서 `Animated.spring(translateX, { toValue: 0, useNativeDriver: true }).start()` → 살짝 튕기며 복귀. 이제 **모든 스와이프가 취소**됨(안전한 기본값). 하지만 아무것도 실행 안 됨 → Step 3.

#### 💻 Step 3 - Commit Past a Threshold

- A short swipe should cancel and a long one should act. Add `useState` and `Button` to the imports, and a `dismissed` state at the top of `MyApp`.


<p class="typeit" id="practice-13">⌨️ <b>이 코드는 Snack에서 직접 쳐 보세요</b>: Math.abs(dx) &gt; 120이면 Animated.timing으로 밀어내고 setDismissed(true)</p>

```jsx
const [dismissed, setDismissed] = useState(false);
```

- Replace `onPanResponderRelease`. Past 120 points the card slides off the screen, and only then is it dismissed.


<p class="typeit sm">⌨️ 이 부분도 직접 쳐 보세요</p>

```jsx
onPanResponderRelease: (_, gesture) => {
  if (Math.abs(gesture.dx) > 120) {
    Animated.timing(translateX, {
      toValue: gesture.dx > 0 ? 500 : -500,
      duration: 200,
      useNativeDriver: true,
    }).start(() => setDismissed(true));
  } else {
    Animated.spring(translateX, {
      toValue: 0,
      useNativeDriver: true,
    }).start();
  }
},
```

- `.start()` takes a callback that runs when the animation ends. The state changes after the card has left, not before.
- Add a reset function above the `return`, and show a button instead of the card once it is dismissed.


<p class="typeit sm">⌨️ 이 부분도 직접 쳐 보세요</p>

```jsx
function reset() {
  translateX.setValue(0);
  setDismissed(false);
}
```


<p class="typeit sm">⌨️ 이 부분도 직접 쳐 보세요</p>

```jsx
{dismissed ? (
  <Button title="Bring It Back" onPress={reset} />
) : (
  <Animated.View
    {...pan.panHandlers}
    style={[styles.card, { transform: [{ translateX }] }]}
  >
    <Text style={styles.text}>Swipe Me</Text>
  </Animated.View>
)}
```

- Swipe a little and let go: it snaps back. Swipe most of the way: it flies off. That is swipe and cancel. Libraries add velocity, so a fast flick counts even when it is short, but the idea is the same.

**🇰🇷 한글 해설**

- `Math.abs(dx) > 120`이면 `Animated.timing`으로 화면 밖으로, 아니면 spring 복귀.
- `.start(() => setDismissed(true))` → **애니메이션이 끝난 뒤** state 변경.
- 짧게 = 복귀, 길게 = 날아감. 이게 **swipe and cancel**. 라이브러리는 **속도(velocity)** 도 봐서 짧아도 빠르게 튕기면 인정.

#### 💻 Finished Code

- Compare against this if something is not working.

```jsx
import { useRef, useState } from "react";
import {
  View,
  Text,
  Button,
  Animated,
  PanResponder,
  StyleSheet,
} from "react-native";

export default function MyApp() {
  const [dismissed, setDismissed] = useState(false);
  const translateX = useRef(new Animated.Value(0)).current;

  const pan = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, gesture) => Math.abs(gesture.dx) > 10,
      onPanResponderMove: (_, gesture) => {
        translateX.setValue(gesture.dx);
      },
      onPanResponderRelease: (_, gesture) => {
        if (Math.abs(gesture.dx) > 120) {
          Animated.timing(translateX, {
            toValue: gesture.dx > 0 ? 500 : -500,
            duration: 200,
            useNativeDriver: true,
          }).start(() => setDismissed(true));
        } else {
          Animated.spring(translateX, {
            toValue: 0,
            useNativeDriver: true,
          }).start();
        }
      },
    })
  ).current;

  function reset() {
    translateX.setValue(0);
    setDismissed(false);
  }

  return (
    <View style={styles.container}>
      {dismissed ? (
        <Button title="Bring It Back" onPress={reset} />
      ) : (
        <Animated.View
          {...pan.panHandlers}
          style={[styles.card, { transform: [{ translateX }] }]}
        >
          <Text style={styles.text}>Swipe Me</Text>
        </Animated.View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingTop: 100, paddingHorizontal: 20 },
  card: { padding: 20, borderRadius: 8, backgroundColor: "#eef" },
  text: { fontSize: 18 },
});
```

▶ **[Snack에서 바로 실행하기](https://snack.expo.dev/?name=WEB530%20W6%20Example%3A%20Drag%20and%20Snap%20Back%20-%20Finished%20Code&platform=ios&sdkVersion=54.0.0&code=import%20%7B%20useRef%2C%20useState%20%7D%20from%20%22react%22%3B%0Aimport%20%7B%0A%20%20View%2C%0A%20%20Text%2C%0A%20%20Button%2C%0A%20%20Animated%2C%0A%20%20PanResponder%2C%0A%20%20StyleSheet%2C%0A%7D%20from%20%22react-native%22%3B%0A%0Aexport%20default%20function%20MyApp%28%29%20%7B%0A%20%20const%20%5Bdismissed%2C%20setDismissed%5D%20%3D%20useState%28false%29%3B%0A%20%20const%20translateX%20%3D%20useRef%28new%20Animated.Value%280%29%29.current%3B%0A%0A%20%20const%20pan%20%3D%20useRef%28%0A%20%20%20%20PanResponder.create%28%7B%0A%20%20%20%20%20%20onMoveShouldSetPanResponder%3A%20%28_%2C%20gesture%29%20%3D%3E%20Math.abs%28gesture.dx%29%20%3E%2010%2C%0A%20%20%20%20%20%20onPanResponderMove%3A%20%28_%2C%20gesture%29%20%3D%3E%20%7B%0A%20%20%20%20%20%20%20%20translateX.setValue%28gesture.dx%29%3B%0A%20%20%20%20%20%20%7D%2C%0A%20%20%20%20%20%20onPanResponderRelease%3A%20%28_%2C%20gesture%29%20%3D%3E%20%7B%0A%20%20%20%20%20%20%20%20if%20%28Math.abs%28gesture.dx%29%20%3E%20120%29%20%7B%0A%20%20%20%20%20%20%20%20%20%20Animated.timing%28translateX%2C%20%7B%0A%20%20%20%20%20%20%20%20%20%20%20%20toValue%3A%20gesture.dx%20%3E%200%20%3F%20500%20%3A%20-500%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20duration%3A%20200%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20useNativeDriver%3A%20true%2C%0A%20%20%20%20%20%20%20%20%20%20%7D%29.start%28%28%29%20%3D%3E%20setDismissed%28true%29%29%3B%0A%20%20%20%20%20%20%20%20%7D%20else%20%7B%0A%20%20%20%20%20%20%20%20%20%20Animated.spring%28translateX%2C%20%7B%0A%20%20%20%20%20%20%20%20%20%20%20%20toValue%3A%200%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20useNativeDriver%3A%20true%2C%0A%20%20%20%20%20%20%20%20%20%20%7D%29.start%28%29%3B%0A%20%20%20%20%20%20%20%20%7D%0A%20%20%20%20%20%20%7D%2C%0A%20%20%20%20%7D%29%0A%20%20%29.current%3B%0A%0A%20%20function%20reset%28%29%20%7B%0A%20%20%20%20translateX.setValue%280%29%3B%0A%20%20%20%20setDismissed%28false%29%3B%0A%20%20%7D%0A%0A%20%20return%20%28%0A%20%20%20%20%3CView%20style%3D%7Bstyles.container%7D%3E%0A%20%20%20%20%20%20%7Bdismissed%20%3F%20%28%0A%20%20%20%20%20%20%20%20%3CButton%20title%3D%22Bring%20It%20Back%22%20onPress%3D%7Breset%7D%20%2F%3E%0A%20%20%20%20%20%20%29%20%3A%20%28%0A%20%20%20%20%20%20%20%20%3CAnimated.View%0A%20%20%20%20%20%20%20%20%20%20%7B...pan.panHandlers%7D%0A%20%20%20%20%20%20%20%20%20%20style%3D%7B%5Bstyles.card%2C%20%7B%20transform%3A%20%5B%7B%20translateX%20%7D%5D%20%7D%5D%7D%0A%20%20%20%20%20%20%20%20%3E%0A%20%20%20%20%20%20%20%20%20%20%3CText%20style%3D%7Bstyles.text%7D%3ESwipe%20Me%3C%2FText%3E%0A%20%20%20%20%20%20%20%20%3C%2FAnimated.View%3E%0A%20%20%20%20%20%20%29%7D%0A%20%20%20%20%3C%2FView%3E%0A%20%20%29%3B%0A%7D%0A%0Aconst%20styles%20%3D%20StyleSheet.create%28%7B%0A%20%20container%3A%20%7B%20flex%3A%201%2C%20paddingTop%3A%20100%2C%20paddingHorizontal%3A%2020%20%7D%2C%0A%20%20card%3A%20%7B%20padding%3A%2020%2C%20borderRadius%3A%208%2C%20backgroundColor%3A%20%22%23eef%22%20%7D%2C%0A%20%20text%3A%20%7B%20fontSize%3A%2018%20%7D%2C%0A%7D%29%3B%0A)** (SDK 54, 필요한 패키지 자동 포함)

**🇰🇷 한글 해설**

**완성 코드 해설**: useRef(Animated.Value, PanResponder) + 세 콜백(ShouldSet, Move, Release) + 임계값 120 + dismissed state + Reset 버튼. 직접 구현 버전이라 개념 문제(useRef가 왜 필요한가, useNativeDriver란)에 대비하기 좋아요.

### 💻 Example: Swipe to Delete

- Real apps use a library for swipeable rows instead of hand-writing `PanResponder` for every list. React Native Gesture Handler is the standard one, and Expo includes it.
- Its `Swipeable` component does the work of the previous example: it follows the finger, snaps back on a short swipe, and stays open on a long one, showing actions underneath the row.
- Replace `package.json` with the one at the top of these notes.

**🇰🇷 한글 해설**

실제 앱은 줄마다 PanResponder를 쓰지 않고 **React Native Gesture Handler**의 `Swipeable`을 써요. 따라오고, 짧으면 복귀, 길면 열림, 아래에 액션 표시.

#### 💻 Starter Code

- Replace everything in `App.js`. It is an inbox in a `FlatList`, with each row in its own component.


<p class="typeit" id="practice-14">⌨️ <b>이 코드는 Snack에서 직접 쳐 보세요</b>: MessageRow가 있는 받은편지함 FlatList 쳐 두기</p>

```jsx
import { useState } from "react";
import { View, Text, FlatList, StyleSheet } from "react-native";

const inbox = [
  { id: "1", from: "Registrar", subject: "Your timetable is ready" },
  { id: "2", from: "Library", subject: "Book due Friday" },
  { id: "3", from: "Campus Store", subject: "Textbook back in stock" },
  { id: "4", from: "IT Services", subject: "Password expires in 7 days" },
  { id: "5", from: "Study Group", subject: "Room 2104 at 3 PM" },
  { id: "6", from: "Athletics", subject: "Intramural sign-ups open" },
  { id: "7", from: "Career Centre", subject: "Resume workshop Thursday" },
  { id: "8", from: "Student Union", subject: "Free pancakes Monday" },
  { id: "9", from: "Professor", subject: "Lab 6 posted" },
  { id: "10", from: "Transit", subject: "Bus pass renewal" },
  { id: "11", from: "Food Services", subject: "New menu this week" },
  { id: "12", from: "Library", subject: "Study rooms now bookable" },
];

function MessageRow({ item }) {
  return (
    <View style={styles.row}>
      <Text style={styles.from}>{item.from}</Text>
      <Text style={styles.subject}>{item.subject}</Text>
    </View>
  );
}

export default function MyApp() {
  const [messages, setMessages] = useState(inbox);

  return (
    <View style={styles.container}>
      <FlatList
        data={messages}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <MessageRow item={item} />}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingTop: 60 },
  row: {
    padding: 20,
    borderBottomWidth: 1,
    borderColor: "#ddd",
    backgroundColor: "white",
  },
  from: { fontSize: 16, fontWeight: "600" },
  subject: { fontSize: 14, color: "#666" },
});
```

▶ **[Snack에서 바로 실행하기](https://snack.expo.dev/?name=WEB530%20W6%20Example%3A%20Swipe%20to%20Delete%20-%20Starter%20Code&platform=web&sdkVersion=54.0.0&code=import%20%7B%20useState%20%7D%20from%20%22react%22%3B%0Aimport%20%7B%20View%2C%20Text%2C%20FlatList%2C%20StyleSheet%20%7D%20from%20%22react-native%22%3B%0A%0Aconst%20inbox%20%3D%20%5B%0A%20%20%7B%20id%3A%20%221%22%2C%20from%3A%20%22Registrar%22%2C%20subject%3A%20%22Your%20timetable%20is%20ready%22%20%7D%2C%0A%20%20%7B%20id%3A%20%222%22%2C%20from%3A%20%22Library%22%2C%20subject%3A%20%22Book%20due%20Friday%22%20%7D%2C%0A%20%20%7B%20id%3A%20%223%22%2C%20from%3A%20%22Campus%20Store%22%2C%20subject%3A%20%22Textbook%20back%20in%20stock%22%20%7D%2C%0A%20%20%7B%20id%3A%20%224%22%2C%20from%3A%20%22IT%20Services%22%2C%20subject%3A%20%22Password%20expires%20in%207%20days%22%20%7D%2C%0A%20%20%7B%20id%3A%20%225%22%2C%20from%3A%20%22Study%20Group%22%2C%20subject%3A%20%22Room%202104%20at%203%20PM%22%20%7D%2C%0A%20%20%7B%20id%3A%20%226%22%2C%20from%3A%20%22Athletics%22%2C%20subject%3A%20%22Intramural%20sign-ups%20open%22%20%7D%2C%0A%20%20%7B%20id%3A%20%227%22%2C%20from%3A%20%22Career%20Centre%22%2C%20subject%3A%20%22Resume%20workshop%20Thursday%22%20%7D%2C%0A%20%20%7B%20id%3A%20%228%22%2C%20from%3A%20%22Student%20Union%22%2C%20subject%3A%20%22Free%20pancakes%20Monday%22%20%7D%2C%0A%20%20%7B%20id%3A%20%229%22%2C%20from%3A%20%22Professor%22%2C%20subject%3A%20%22Lab%206%20posted%22%20%7D%2C%0A%20%20%7B%20id%3A%20%2210%22%2C%20from%3A%20%22Transit%22%2C%20subject%3A%20%22Bus%20pass%20renewal%22%20%7D%2C%0A%20%20%7B%20id%3A%20%2211%22%2C%20from%3A%20%22Food%20Services%22%2C%20subject%3A%20%22New%20menu%20this%20week%22%20%7D%2C%0A%20%20%7B%20id%3A%20%2212%22%2C%20from%3A%20%22Library%22%2C%20subject%3A%20%22Study%20rooms%20now%20bookable%22%20%7D%2C%0A%5D%3B%0A%0Afunction%20MessageRow%28%7B%20item%20%7D%29%20%7B%0A%20%20return%20%28%0A%20%20%20%20%3CView%20style%3D%7Bstyles.row%7D%3E%0A%20%20%20%20%20%20%3CText%20style%3D%7Bstyles.from%7D%3E%7Bitem.from%7D%3C%2FText%3E%0A%20%20%20%20%20%20%3CText%20style%3D%7Bstyles.subject%7D%3E%7Bitem.subject%7D%3C%2FText%3E%0A%20%20%20%20%3C%2FView%3E%0A%20%20%29%3B%0A%7D%0A%0Aexport%20default%20function%20MyApp%28%29%20%7B%0A%20%20const%20%5Bmessages%2C%20setMessages%5D%20%3D%20useState%28inbox%29%3B%0A%0A%20%20return%20%28%0A%20%20%20%20%3CView%20style%3D%7Bstyles.container%7D%3E%0A%20%20%20%20%20%20%3CFlatList%0A%20%20%20%20%20%20%20%20data%3D%7Bmessages%7D%0A%20%20%20%20%20%20%20%20keyExtractor%3D%7B%28item%29%20%3D%3E%20item.id%7D%0A%20%20%20%20%20%20%20%20renderItem%3D%7B%28%7B%20item%20%7D%29%20%3D%3E%20%3CMessageRow%20item%3D%7Bitem%7D%20%2F%3E%7D%0A%20%20%20%20%20%20%2F%3E%0A%20%20%20%20%3C%2FView%3E%0A%20%20%29%3B%0A%7D%0A%0Aconst%20styles%20%3D%20StyleSheet.create%28%7B%0A%20%20container%3A%20%7B%20flex%3A%201%2C%20paddingTop%3A%2060%20%7D%2C%0A%20%20row%3A%20%7B%0A%20%20%20%20padding%3A%2020%2C%0A%20%20%20%20borderBottomWidth%3A%201%2C%0A%20%20%20%20borderColor%3A%20%22%23ddd%22%2C%0A%20%20%20%20backgroundColor%3A%20%22white%22%2C%0A%20%20%7D%2C%0A%20%20from%3A%20%7B%20fontSize%3A%2016%2C%20fontWeight%3A%20%22600%22%20%7D%2C%0A%20%20subject%3A%20%7B%20fontSize%3A%2014%2C%20color%3A%20%22%23666%22%20%7D%2C%0A%7D%29%3B%0A)** (SDK 54, 필요한 패키지 자동 포함)

- `MessageRow` is declared outside `MyApp`, at the top level, like every component so far. A component declared inside another one is a new component on every render, so React throws the old rows away and builds new ones. Each row would lose its swipe position every time the list changed.
- The row has a white background on purpose. The delete button sits underneath it, and a transparent row would show it before any swipe.

**🇰🇷 한글 해설**

- FlatList 받은편지함, 줄은 `MessageRow` 컴포넌트.
- **MessageRow는 MyApp 바깥**에 선언. 안에 선언하면 렌더링마다 새 컴포넌트 → React가 옛 줄을 버리고 새로 만듦 → 스와이프 위치를 잃음.
- 줄 배경이 **흰색**인 이유: 삭제 버튼이 아래 깔려 있어서 투명하면 미리 보여요.

#### 💻 Step 1 - Add the Gesture Root

- Add the Gesture Handler import under the `react-native` import.


<p class="typeit" id="practice-15">⌨️ <b>이 코드는 Snack에서 직접 쳐 보세요</b>: 바깥 View를 GestureHandlerRootView로 바꾸기</p>

```jsx
import {
  GestureHandlerRootView,
  Swipeable,
} from "react-native-gesture-handler";
```

- Change the outer `View` in `MyApp` to a `GestureHandlerRootView`, keeping its style.


<p class="typeit sm">⌨️ 이 부분도 직접 쳐 보세요</p>

```jsx
<GestureHandlerRootView style={styles.container}>
  ...
</GestureHandlerRootView>
```

- Gesture Handler only works inside this root view. Put it once, around the whole app.
- Run it. Nothing looks different.

**🇰🇷 한글 해설**

`GestureHandlerRootView`로 바깥 View 교체(style 유지). Gesture Handler는 이 안에서만 작동, 앱 전체를 **한 번** 감싸기.

#### 💻 Step 2 - Make the Rows Swipeable

- Wrap the row in `MessageRow` in a `Swipeable`, with a delete panel on the right.


<p class="typeit" id="practice-16">⌨️ <b>이 코드는 Snack에서 직접 쳐 보세요</b>: 줄을 Swipeable renderRightActions로 감싸기</p>

```jsx
function MessageRow({ item }) {
  return (
    <Swipeable
      overshootRight={false}
      renderRightActions={() => (
        <Pressable style={styles.delete}>
          <Text style={styles.deleteText}>Delete</Text>
        </Pressable>
      )}
    >
      <View style={styles.row}>
        <Text style={styles.from}>{item.from}</Text>
        <Text style={styles.subject}>{item.subject}</Text>
      </View>
    </Swipeable>
  );
}
```

- Add `Pressable` to the `react-native` import, and the styles.


<p class="typeit sm">⌨️ 이 부분도 직접 쳐 보세요</p>

```jsx
delete: {
  justifyContent: "center",
  paddingHorizontal: 24,
  backgroundColor: "#E53935",
},
deleteText: { color: "white", fontWeight: "600" },
```

- `renderRightActions` returns what sits under the right edge of the row. Swiping left reveals it.
- `overshootRight={false}` stops the row at the edge of the panel instead of letting it stretch past.
- On your phone, swipe a row left a little and let go: it snaps back. That is the cancel. Swipe past about half the button's width: it stays open. Swipe it back to close it.
- Now drag up and down on the rows: the list scrolls and no row moves. A row only takes the gesture when the finger moves sideways.

**🇰🇷 한글 해설**

- `<Swipeable renderRightActions={() => (삭제 패널)} overshootRight={false}>` 로 줄 감싸기.
- 왼쪽으로 조금 밀고 놓기 → 복귀(취소). 버튼 너비 절반 넘게 → 열린 채 유지.
- 위아래 드래그 → 목록 스크롤, 줄은 안 움직임.

#### 💻 Step 3 - Delete the Message

- Add a delete function to `MyApp`, under the state.


<p class="typeit" id="practice-17">⌨️ <b>이 코드는 Snack에서 직접 쳐 보세요</b>: remove(id)에서 filter로 지우고 onDelete prop 연결</p>

```jsx
function deleteMessage(id) {
  setMessages((prev) => prev.filter((item) => item.id !== id));
}
```

- Pass it to each row.


<p class="typeit sm">⌨️ 이 부분도 직접 쳐 보세요</p>

```jsx
renderItem={({ item }) => (
  <MessageRow item={item} onDelete={deleteMessage} />
)}
```

- In `MessageRow`, accept the prop and call it from the button.


<p class="typeit sm">⌨️ 이 부분도 직접 쳐 보세요</p>

```jsx
function MessageRow({ item, onDelete }) {
```


<p class="typeit sm">⌨️ 이 부분도 직접 쳐 보세요</p>

```jsx
<Pressable style={styles.delete} onPress={() => onDelete(item.id)}>
```

- Add an empty state to the `FlatList`, as in Week 5, with its style.


<p class="typeit sm">⌨️ 이 부분도 직접 쳐 보세요</p>

```jsx
ListEmptyComponent={<Text style={styles.empty}>No messages.</Text>}
```


<p class="typeit sm">⌨️ 이 부분도 직접 쳐 보세요</p>

```jsx
empty: { padding: 20, color: "#666" },
```

- Swipe a row open and tap **Delete**. It is gone. Delete them all to see the empty state.
- The swipe only reveals the button; the tap deletes. Deleting is destructive, so it takes two deliberate actions. `Swipeable` also has `onSwipeableOpen`, which could delete as soon as the row opens, but then a slightly long swipe would lose a message with no way back. Save that for actions that can be undone, like archive.
- `Swipeable` is marked deprecated in favour of `ReanimatedSwipeable`, which needs the Reanimated library. It still works, the replacement's API is very similar, and it needs no extra setup, so it is the simpler one to learn with. The course notes say more.

**🇰🇷 한글 해설**

- `remove(id)`: `setMessages((prev) => prev.filter((m) => m.id !== id))` 함수형.
- `onDelete={() => remove(item.id)}` prop으로 전달, MessageRow의 Delete 버튼에서 호출.
- 다 지우면 `ListEmptyComponent`.
- 스와이프는 **드러내기만**, 탭이 삭제. 파괴적 행동은 두 번의 의도적 동작. `onSwipeableOpen` 즉시 삭제는 되돌릴 수 있는 행동(archive)에만.
- Swipeable은 deprecated(대체: ReanimatedSwipeable), 하지만 추가 설정이 없어 배우기 쉬움.

#### 💻 Finished Code

- Compare against this if something is not working.

```jsx
import { useState } from "react";
import { View, Text, Pressable, FlatList, StyleSheet } from "react-native";
import {
  GestureHandlerRootView,
  Swipeable,
} from "react-native-gesture-handler";

const inbox = [
  { id: "1", from: "Registrar", subject: "Your timetable is ready" },
  { id: "2", from: "Library", subject: "Book due Friday" },
  { id: "3", from: "Campus Store", subject: "Textbook back in stock" },
  { id: "4", from: "IT Services", subject: "Password expires in 7 days" },
  { id: "5", from: "Study Group", subject: "Room 2104 at 3 PM" },
  { id: "6", from: "Athletics", subject: "Intramural sign-ups open" },
  { id: "7", from: "Career Centre", subject: "Resume workshop Thursday" },
  { id: "8", from: "Student Union", subject: "Free pancakes Monday" },
  { id: "9", from: "Professor", subject: "Lab 6 posted" },
  { id: "10", from: "Transit", subject: "Bus pass renewal" },
  { id: "11", from: "Food Services", subject: "New menu this week" },
  { id: "12", from: "Library", subject: "Study rooms now bookable" },
];

function MessageRow({ item, onDelete }) {
  return (
    <Swipeable
      overshootRight={false}
      renderRightActions={() => (
        <Pressable style={styles.delete} onPress={() => onDelete(item.id)}>
          <Text style={styles.deleteText}>Delete</Text>
        </Pressable>
      )}
    >
      <View style={styles.row}>
        <Text style={styles.from}>{item.from}</Text>
        <Text style={styles.subject}>{item.subject}</Text>
      </View>
    </Swipeable>
  );
}

export default function MyApp() {
  const [messages, setMessages] = useState(inbox);

  function deleteMessage(id) {
    setMessages((prev) => prev.filter((item) => item.id !== id));
  }

  return (
    <GestureHandlerRootView style={styles.container}>
      <FlatList
        data={messages}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <MessageRow item={item} onDelete={deleteMessage} />
        )}
        ListEmptyComponent={<Text style={styles.empty}>No messages.</Text>}
      />
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingTop: 60 },
  row: {
    padding: 20,
    borderBottomWidth: 1,
    borderColor: "#ddd",
    backgroundColor: "white",
  },
  from: { fontSize: 16, fontWeight: "600" },
  subject: { fontSize: 14, color: "#666" },
  delete: {
    justifyContent: "center",
    paddingHorizontal: 24,
    backgroundColor: "#E53935",
  },
  deleteText: { color: "white", fontWeight: "600" },
  empty: { padding: 20, color: "#666" },
});
```

▶ **[Snack에서 바로 실행하기](https://snack.expo.dev/?name=WEB530%20W6%20Example%3A%20Swipe%20to%20Delete%20-%20Finished%20Code&platform=ios&sdkVersion=54.0.0&code=import%20%7B%20useState%20%7D%20from%20%22react%22%3B%0Aimport%20%7B%20View%2C%20Text%2C%20Pressable%2C%20FlatList%2C%20StyleSheet%20%7D%20from%20%22react-native%22%3B%0Aimport%20%7B%0A%20%20GestureHandlerRootView%2C%0A%20%20Swipeable%2C%0A%7D%20from%20%22react-native-gesture-handler%22%3B%0A%0Aconst%20inbox%20%3D%20%5B%0A%20%20%7B%20id%3A%20%221%22%2C%20from%3A%20%22Registrar%22%2C%20subject%3A%20%22Your%20timetable%20is%20ready%22%20%7D%2C%0A%20%20%7B%20id%3A%20%222%22%2C%20from%3A%20%22Library%22%2C%20subject%3A%20%22Book%20due%20Friday%22%20%7D%2C%0A%20%20%7B%20id%3A%20%223%22%2C%20from%3A%20%22Campus%20Store%22%2C%20subject%3A%20%22Textbook%20back%20in%20stock%22%20%7D%2C%0A%20%20%7B%20id%3A%20%224%22%2C%20from%3A%20%22IT%20Services%22%2C%20subject%3A%20%22Password%20expires%20in%207%20days%22%20%7D%2C%0A%20%20%7B%20id%3A%20%225%22%2C%20from%3A%20%22Study%20Group%22%2C%20subject%3A%20%22Room%202104%20at%203%20PM%22%20%7D%2C%0A%20%20%7B%20id%3A%20%226%22%2C%20from%3A%20%22Athletics%22%2C%20subject%3A%20%22Intramural%20sign-ups%20open%22%20%7D%2C%0A%20%20%7B%20id%3A%20%227%22%2C%20from%3A%20%22Career%20Centre%22%2C%20subject%3A%20%22Resume%20workshop%20Thursday%22%20%7D%2C%0A%20%20%7B%20id%3A%20%228%22%2C%20from%3A%20%22Student%20Union%22%2C%20subject%3A%20%22Free%20pancakes%20Monday%22%20%7D%2C%0A%20%20%7B%20id%3A%20%229%22%2C%20from%3A%20%22Professor%22%2C%20subject%3A%20%22Lab%206%20posted%22%20%7D%2C%0A%20%20%7B%20id%3A%20%2210%22%2C%20from%3A%20%22Transit%22%2C%20subject%3A%20%22Bus%20pass%20renewal%22%20%7D%2C%0A%20%20%7B%20id%3A%20%2211%22%2C%20from%3A%20%22Food%20Services%22%2C%20subject%3A%20%22New%20menu%20this%20week%22%20%7D%2C%0A%20%20%7B%20id%3A%20%2212%22%2C%20from%3A%20%22Library%22%2C%20subject%3A%20%22Study%20rooms%20now%20bookable%22%20%7D%2C%0A%5D%3B%0A%0Afunction%20MessageRow%28%7B%20item%2C%20onDelete%20%7D%29%20%7B%0A%20%20return%20%28%0A%20%20%20%20%3CSwipeable%0A%20%20%20%20%20%20overshootRight%3D%7Bfalse%7D%0A%20%20%20%20%20%20renderRightActions%3D%7B%28%29%20%3D%3E%20%28%0A%20%20%20%20%20%20%20%20%3CPressable%20style%3D%7Bstyles.delete%7D%20onPress%3D%7B%28%29%20%3D%3E%20onDelete%28item.id%29%7D%3E%0A%20%20%20%20%20%20%20%20%20%20%3CText%20style%3D%7Bstyles.deleteText%7D%3EDelete%3C%2FText%3E%0A%20%20%20%20%20%20%20%20%3C%2FPressable%3E%0A%20%20%20%20%20%20%29%7D%0A%20%20%20%20%3E%0A%20%20%20%20%20%20%3CView%20style%3D%7Bstyles.row%7D%3E%0A%20%20%20%20%20%20%20%20%3CText%20style%3D%7Bstyles.from%7D%3E%7Bitem.from%7D%3C%2FText%3E%0A%20%20%20%20%20%20%20%20%3CText%20style%3D%7Bstyles.subject%7D%3E%7Bitem.subject%7D%3C%2FText%3E%0A%20%20%20%20%20%20%3C%2FView%3E%0A%20%20%20%20%3C%2FSwipeable%3E%0A%20%20%29%3B%0A%7D%0A%0Aexport%20default%20function%20MyApp%28%29%20%7B%0A%20%20const%20%5Bmessages%2C%20setMessages%5D%20%3D%20useState%28inbox%29%3B%0A%0A%20%20function%20deleteMessage%28id%29%20%7B%0A%20%20%20%20setMessages%28%28prev%29%20%3D%3E%20prev.filter%28%28item%29%20%3D%3E%20item.id%20%21%3D%3D%20id%29%29%3B%0A%20%20%7D%0A%0A%20%20return%20%28%0A%20%20%20%20%3CGestureHandlerRootView%20style%3D%7Bstyles.container%7D%3E%0A%20%20%20%20%20%20%3CFlatList%0A%20%20%20%20%20%20%20%20data%3D%7Bmessages%7D%0A%20%20%20%20%20%20%20%20keyExtractor%3D%7B%28item%29%20%3D%3E%20item.id%7D%0A%20%20%20%20%20%20%20%20renderItem%3D%7B%28%7B%20item%20%7D%29%20%3D%3E%20%28%0A%20%20%20%20%20%20%20%20%20%20%3CMessageRow%20item%3D%7Bitem%7D%20onDelete%3D%7BdeleteMessage%7D%20%2F%3E%0A%20%20%20%20%20%20%20%20%29%7D%0A%20%20%20%20%20%20%20%20ListEmptyComponent%3D%7B%3CText%20style%3D%7Bstyles.empty%7D%3ENo%20messages.%3C%2FText%3E%7D%0A%20%20%20%20%20%20%2F%3E%0A%20%20%20%20%3C%2FGestureHandlerRootView%3E%0A%20%20%29%3B%0A%7D%0A%0Aconst%20styles%20%3D%20StyleSheet.create%28%7B%0A%20%20container%3A%20%7B%20flex%3A%201%2C%20paddingTop%3A%2060%20%7D%2C%0A%20%20row%3A%20%7B%0A%20%20%20%20padding%3A%2020%2C%0A%20%20%20%20borderBottomWidth%3A%201%2C%0A%20%20%20%20borderColor%3A%20%22%23ddd%22%2C%0A%20%20%20%20backgroundColor%3A%20%22white%22%2C%0A%20%20%7D%2C%0A%20%20from%3A%20%7B%20fontSize%3A%2016%2C%20fontWeight%3A%20%22600%22%20%7D%2C%0A%20%20subject%3A%20%7B%20fontSize%3A%2014%2C%20color%3A%20%22%23666%22%20%7D%2C%0A%20%20delete%3A%20%7B%0A%20%20%20%20justifyContent%3A%20%22center%22%2C%0A%20%20%20%20paddingHorizontal%3A%2024%2C%0A%20%20%20%20backgroundColor%3A%20%22%23E53935%22%2C%0A%20%20%7D%2C%0A%20%20deleteText%3A%20%7B%20color%3A%20%22white%22%2C%20fontWeight%3A%20%22600%22%20%7D%2C%0A%20%20empty%3A%20%7B%20padding%3A%2020%2C%20color%3A%20%22%23666%22%20%7D%2C%0A%7D%29%3B%0A&dependencies=react-native-gesture-handler%40~2.28.0)** (SDK 54, 필요한 패키지 자동 포함)

**🇰🇷 한글 해설**

**완성 코드 해설**: GestureHandlerRootView > FlatList > (최상위 선언) MessageRow > Swipeable(renderRightActions = Delete Pressable). 삭제는 부모의 함수형 filter. ListEmptyComponent로 빈 상태.

### 💻 Touch UX Checklist

- Make touch targets at least 44 points, and use `hitSlop` when the visual has to be smaller.
- Give feedback the moment the finger lands: the `pressed` style.
- Keep gestures simple. A swipe is a shortcut, not the only way to do something important.
- Make gestures forgiving: a short swipe cancels, and a scroll that starts on a row does not tap it.
- Keep the UI fast. Gestures run every frame, so never block the JavaScript thread while one is in progress.
- Test on a real device. The web preview has a mouse, and users have thumbs.

**🇰🇷 한글 해설**

**터치 UX 체크리스트 6개 (그대로 서술형 문제로 나올 수 있어요)**
1. 터치 대상은 **44포인트 이상**, 작으면 `hitSlop`.
2. 손가락이 닿는 **순간** 피드백(pressed 스타일).
3. 제스처는 단순하게. 스와이프는 **지름길**이지 중요한 일의 **유일한** 방법이면 안 됨.
4. 제스처는 너그럽게: 짧은 스와이프는 취소, 줄에서 시작한 스크롤은 탭이 아님.
5. UI는 빠르게: 제스처는 매 프레임 실행되니 JS 스레드를 막지 말 것.
6. **실제 기기**에서 테스트. Web은 마우스, 사용자는 엄지.


---

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

▶ **[Snack에서 바로 실행하기](https://snack.expo.dev/?name=WEB530%20W6%20practice&platform=web&sdkVersion=54.0.0&code=import%20%7B%20useState%20%7D%20from%20%22react%22%3B%0Aimport%20%7B%20View%2C%20Text%2C%20FlatList%2C%20Pressable%2C%20StyleSheet%20%7D%20from%20%22react-native%22%3B%0A%0Aconst%20START%20%3D%20%5B%0A%20%20%7B%20id%3A%20%221%22%2C%20title%3A%20%22Read%20week%206%20notes%22%2C%20done%3A%20false%2C%20star%3A%20false%20%7D%2C%0A%20%20%7B%20id%3A%20%222%22%2C%20title%3A%20%22Practice%20FlatList%22%2C%20done%3A%20true%2C%20star%3A%20false%20%7D%2C%0A%20%20%7B%20id%3A%20%223%22%2C%20title%3A%20%22Try%20swipe%20on%20my%20phone%22%2C%20done%3A%20false%2C%20star%3A%20true%20%7D%2C%0A%5D%3B%0A%0Aexport%20default%20function%20App%28%29%20%7B%0A%20%20const%20%5Btodos%2C%20setTodos%5D%20%3D%20useState%28START%29%3B%0A%20%20const%20%5BlastEvent%2C%20setLastEvent%5D%20%3D%20useState%28%22Tap%20a%20row%2C%20or%20hold%20it%20to%20delete%22%29%3B%0A%0A%20%20const%20toggleDone%20%3D%20%28id%29%20%3D%3E%0A%20%20%20%20setTodos%28%28prev%29%20%3D%3E%20prev.map%28%28t%29%20%3D%3E%20%28t.id%20%3D%3D%3D%20id%20%3F%20%7B%20...t%2C%20done%3A%20%21t.done%20%7D%20%3A%20t%29%29%29%3B%0A%20%20const%20toggleStar%20%3D%20%28id%29%20%3D%3E%0A%20%20%20%20setTodos%28%28prev%29%20%3D%3E%20prev.map%28%28t%29%20%3D%3E%20%28t.id%20%3D%3D%3D%20id%20%3F%20%7B%20...t%2C%20star%3A%20%21t.star%20%7D%20%3A%20t%29%29%29%3B%0A%20%20const%20remove%20%3D%20%28id%29%20%3D%3E%20setTodos%28%28prev%29%20%3D%3E%20prev.filter%28%28t%29%20%3D%3E%20t.id%20%21%3D%3D%20id%29%29%3B%0A%0A%20%20return%20%28%0A%20%20%20%20%3CView%20style%3D%7Bstyles.container%7D%3E%0A%20%20%20%20%20%20%3CText%20style%3D%7Bstyles.status%7D%3E%7BlastEvent%7D%3C%2FText%3E%0A%20%20%20%20%20%20%3CFlatList%0A%20%20%20%20%20%20%20%20data%3D%7Btodos%7D%0A%20%20%20%20%20%20%20%20keyExtractor%3D%7B%28item%29%20%3D%3E%20item.id%7D%0A%20%20%20%20%20%20%20%20extraData%3D%7Btodos%7D%0A%20%20%20%20%20%20%20%20renderItem%3D%7B%28%7B%20item%20%7D%29%20%3D%3E%20%28%0A%20%20%20%20%20%20%20%20%20%20%3CPressable%0A%20%20%20%20%20%20%20%20%20%20%20%20onPress%3D%7B%28%29%20%3D%3E%20%7B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20toggleDone%28item.id%29%3B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20setLastEvent%28%60Tapped%3A%20%24%7Bitem.title%7D%60%29%3B%0A%20%20%20%20%20%20%20%20%20%20%20%20%7D%7D%0A%20%20%20%20%20%20%20%20%20%20%20%20onLongPress%3D%7B%28%29%20%3D%3E%20%7B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20remove%28item.id%29%3B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20setLastEvent%28%60Deleted%3A%20%24%7Bitem.title%7D%60%29%3B%0A%20%20%20%20%20%20%20%20%20%20%20%20%7D%7D%0A%20%20%20%20%20%20%20%20%20%20%20%20style%3D%7B%28%7B%20pressed%20%7D%29%20%3D%3E%20%5Bstyles.row%2C%20item.done%20%26%26%20styles.done%2C%20pressed%20%26%26%20styles.pressed%5D%7D%0A%20%20%20%20%20%20%20%20%20%20%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%3CText%20style%3D%7B%5Bstyles.title%2C%20item.done%20%26%26%20styles.doneText%5D%7D%3E%7Bitem.title%7D%3C%2FText%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%3CPressable%20hitSlop%3D%7B20%7D%20onPress%3D%7B%28%29%20%3D%3E%20toggleStar%28item.id%29%7D%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3CText%20style%3D%7Bstyles.star%7D%3E%7Bitem.star%20%3F%20%22%E2%98%85%22%20%3A%20%22%E2%98%86%22%7D%3C%2FText%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%3C%2FPressable%3E%0A%20%20%20%20%20%20%20%20%20%20%3C%2FPressable%3E%0A%20%20%20%20%20%20%20%20%29%7D%0A%20%20%20%20%20%20%20%20ListEmptyComponent%3D%7B%3CText%3EAll%20done%21%3C%2FText%3E%7D%0A%20%20%20%20%20%20%2F%3E%0A%20%20%20%20%3C%2FView%3E%0A%20%20%29%3B%0A%7D%0A%0Aconst%20styles%20%3D%20StyleSheet.create%28%7B%0A%20%20container%3A%20%7B%20flex%3A%201%2C%20paddingTop%3A%2060%2C%20paddingHorizontal%3A%2016%20%7D%2C%0A%20%20status%3A%20%7B%20marginBottom%3A%2012%2C%20color%3A%20%22%23555%22%20%7D%2C%0A%20%20row%3A%20%7B%20flexDirection%3A%20%22row%22%2C%20alignItems%3A%20%22center%22%2C%20padding%3A%2016%2C%20backgroundColor%3A%20%22%23fff%22%2C%20borderBottomWidth%3A%201%2C%20borderColor%3A%20%22%23eee%22%20%7D%2C%0A%20%20done%3A%20%7B%20backgroundColor%3A%20%22%23eef7ee%22%20%7D%2C%0A%20%20pressed%3A%20%7B%20backgroundColor%3A%20%22%23ddd%22%20%7D%2C%0A%20%20title%3A%20%7B%20flex%3A%201%2C%20fontSize%3A%2016%20%7D%2C%0A%20%20doneText%3A%20%7B%20textDecorationLine%3A%20%22line-through%22%2C%20color%3A%20%22%23888%22%20%7D%2C%0A%20%20star%3A%20%7B%20fontSize%3A%2014%20%7D%2C%0A%7D%29%3B%0A)** (SDK 54, 필요한 패키지 자동 포함) <button class="snack-embed" type="button">👀 여기서 결과 보기</button>

**해설**: 줄 전체는 Pressable(탭 = 완료, 길게 = 삭제). 별은 작은 글자라 `hitSlop={20}`으로 누르기 쉽게 했어요. 별의 Pressable이 안쪽에 있어서 별을 누르면 별만 반응해요. 스타일 배열에서 `pressed`가 마지막이라 완료된 줄에서도 누름 피드백이 보여요.
