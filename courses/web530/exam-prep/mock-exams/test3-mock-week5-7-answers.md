# WEB530 Mock Test 3 정답과 해설 (Weeks 5 to 7)

> 문제지: `test3-mock-week5-7.md`
> 정답은 **굵은 글씨 + ✅** 로 표시했어요. 각 문항 밑에 "어디에 나와 있나"로 강의노트 위치를 적어 두었어요.
> 강의노트 링크 약어
> - W5 = [Week 5.1 Notes](https://github.com/nick-romanidis/web530-2267-nsa/blob/main/lectures/week-05.1-notes.md)
> - W6 = [Week 6.1 Notes](https://github.com/nick-romanidis/web530-2267-nsa/blob/main/lectures/week-06.1-notes.md)
> - W7 = [Week 7.1 Notes](https://github.com/nick-romanidis/web530-2267-nsa/blob/main/lectures/week-07.1-notes.md)
> - Lab 5, Lab 6 = repo의 `labs/lab-5.md`, `labs/lab-6.md`

---

## Section 1: Multiple Choice

### Q1. **✅ B**

- 정답: **B. `FlatList` renders only the rows in a window around the visible area and reuses row components as you scroll, while `ScrollView` renders every child at once.**
- 해설: `ScrollView + map()`은 1,000개를 한 번에 다 그려요. `FlatList`는 화면 근처(window)만 그리고 스크롤하면서 행 컴포넌트를 재활용(recycling)해요. 그래서 긴 목록은 FlatList.
- 함정: A의 "100개 제한" 같은 규칙은 없어요. C, FlatList는 정렬을 안 해줘요. 정렬은 내가 배열을 바꿔서 해요.
- 어디에 나와 있나: W5 "Why Lists?", "Example: FlatList" (windowSize 기본값 21 설명까지)

### Q2. **✅ C**

- 정답: **C. `keyExtractor={(item) => item.postId.toString()}`**
- 해설: `keyExtractor`는 반드시 문자열을 돌려줘야 해요. 숫자 id는 `.toString()`. 그리고 keyExtractor는 item을 그냥 받아요. `({ item })`처럼 구조분해하는 건 **renderItem** 쪽이에요. 이 둘을 헷갈리면 바로 감점.
- 함정: D, FlatList는 `item.key` 다음에 `item.id`를 찾아요. `postId`는 안 찾아요.
- 어디에 나와 있나: W5 "Example: FlatList" 설명 bullet ("keyExtractor must return a string..."), Lab 5 Q1

### Q3. **✅ B**

- 정답: **B. `fetch` resolves, because a 500 is still a response...**
- 해설: `fetch`는 네트워크 자체가 끊겼을 때만 reject돼요. 404, 500도 "응답은 왔다"라서 성공으로 취급돼요. 그래서 `if (!res.ok) throw new Error(...)`로 직접 에러를 던져야 `.catch()`로 가요.
- 어디에 나와 있나: W5 "Fetching List Data > Step 2 - Handle Errors", Lab 5 Q4 (res.ok 주석 요구)

### Q4. **✅ B**

- 정답: **B. The first load replaces the whole screen with a spinner, while a pull to refresh keeps the list on screen...**
- 해설: 처음 로딩은 화면 전체를 스피너로 바꾸고, 당겨서 새로고침은 목록을 그대로 두고 위에만 스피너가 돌아요. 보여주는 화면이 다르니까 상태도 두 개.
- 어디에 나와 있나: W5 "Pull to Refresh > Step 1" ("loading and refreshing are separate on purpose"), Lab 5 Q6

### Q5. **✅ B**

- 정답: **B. `onPressIn`, `onLongPress`, `onPressOut`**
- 해설: 길게 누르면 탭(onPress)은 **대체**돼요. 더해지는 게 아니에요. 그래서 onPress는 안 나와요. 짧게 탭하면 `onPressIn → onPressOut → onPress` 순서.
- 어디에 나와 있나: W6 "Example: Pressable > Step 3 - Log Every Press Event"

### Q6. **✅ B**

- 정답: **B. Add `hitSlop={20}` to its `Pressable`...**
- 해설: `hitSlop`은 보이는 크기는 그대로 두고 손가락이 닿는 영역만 넓혀요. 24 + 20 + 20 = 64. padding은 레이아웃(보이는 크기)이 바뀌니까 조건 위반.
- 어디에 나와 있나: W6 "Example: Hit Slop"

### Q7. **✅ B**

- 정답: **B. An effect may only return a clean-up function, and an `async` function always returns a promise.**
- 해설: useEffect는 "정리 함수" 또는 아무것도 안 돌려줘야 해요. async 함수는 무조건 Promise를 돌려주니까 effect 자체를 async로 만들면 안 돼요. 그래서 안에 async 함수를 만들고 바로 호출해요.
- 어디에 나와 있나: W7 "Where Am I? > Step 1 - Ask for Permission"

### Q8. **✅ C**

- 정답: **C. Give the map a ref with `useRef`, then call `mapRef.current.animateToRegion(region, 1000)`.**
- 해설: `initialRegion`은 "처음 시작 위치"만 정해요. 나중에 바꿔도 지도는 안 움직여요. 코드로 움직이려면 지도 자체에 ref를 달고 `animateToRegion`을 불러야 해요. B의 `followsUserLocation`은 Apple Maps 전용이라 Android에서는 안 돼요.
- 어디에 나와 있나: W7 "Your First Map > Step 2, Step 3, Step 4"

---

## Section 2: Short Essay

### Q9. 세 가지 버그 (3점)

**✅ 모범답안**

1. **`products.sort()`가 원본 배열을 바꿔요(mutate).** `.sort()`는 제자리 정렬이라서 모듈 상수 `products`가 바뀌어요. 복사본을 정렬해야 해요.
   ```jsx
   const visible = [...products].sort((a, b) =>
     cheapFirst ? a.price - b.price : b.price - a.price
   );
   ```
2. **`keyExtractor`가 숫자를 돌려줘요.** id가 숫자니까 문자열로 바꿔야 해요.
   ```jsx
   keyExtractor={(item) => item.id.toString()}
   ```
3. **`renderItem`의 파라미터가 틀렸어요.** renderItem은 `{ item, index }` 객체를 받아요. `(item) => item.name`은 객체.name이라서 undefined. 구조분해해야 해요.
   ```jsx
   renderItem={({ item }) => <Text>{item.name}</Text>}
   ```

- 해설: Test1 Q6에서 "고친 걸 쓰는 곳까지 고쳐야 1점"이라는 피드백을 받았죠. 이번에도 **규칙 이름 + 고친 코드** 둘 다 써야 만점이에요.
- 어디에 나와 있나: W5 "Example: FlatList" (renderItem 설명, keyExtractor 문자열), "Sorting and Filtering > Step 1" (`[...fruits]` 복사 이유)

### Q10. 로딩, 에러, 빈 상태 (3점)

**✅ 모범답안**

- (a) 다시 시도를 누르면 `setLoading(true)`가 되고, `loading`을 먼저 검사하니까 **스피너가 보여요**. `error`가 아직 남아 있어도 스피너가 먼저 나와요. 순서가 반대면 에러 화면이 계속 떠서 다시 로딩 중인지 사용자가 알 수 없어요.
- (b) `.finally()`는 **성공이든 실패든 항상** 실행돼요. `.then()` 안에만 두면 실패했을 때 로딩이 영원히 끝나지 않아서 스피너가 계속 돌아요.
- (c) `ListEmptyComponent`는 `data`가 빈 배열일 때만 보이는 메시지예요(예: `No posts yet.`). 빈 화면은 사용자가 보기에 **고장 난 것처럼** 보이니까 "비어 있다"고 말해줘야 해요.
- 어디에 나와 있나: W5 "Fetching List Data > Step 1, 2, 3"

### Q11. 스와이프 (3점)

**✅ 모범답안**

- (a) 컴포넌트를 다른 컴포넌트 **안에서** 선언하면 렌더링할 때마다 새 컴포넌트가 만들어져요. React는 옛 행을 버리고 새로 만들어서, **스와이프 위치(상태)를 잃어요**. 그래서 최상위에 선언.
- (b) 삭제는 되돌릴 수 없는 **파괴적인 동작**이라서 두 번의 의도적인 행동(스와이프로 버튼 보이기 + 탭)을 요구해요. onSwipeableOpen으로 지우면 조금 길게 스와이프만 해도 메시지가 사라져요. 그런 즉시 실행은 되돌릴 수 있는 동작(예: archive)에만 써요.
- (c) 옆으로 10포인트 이상 움직였을 때만 제스처를 가져가요. 그래서 **탭이나 세로 스크롤을 카드가 빼앗지 않아요**(제스처 우선순위 규칙).
- 어디에 나와 있나: W6 "Swipe to Delete > Starter Code 설명", "Step 3 - Delete the Message", "Drag and Snap Back > Step 1"

### Q12. 위치 추적 (3점)

**✅ 모범답안**

- (a) 화면이 닫혀도 watch가 계속 돌아서 **GPS가 켜진 채로 배터리를 소모**해요. 언마운트된 컴포넌트에 setLocation을 계속 부르게 돼요.
- (b) 권한 대화상자가 떠 있는 동안(아직 subscription이 없을 때) 화면이 닫히면 clean-up은 지울 게 없어요. 나중에 watch가 시작되면 `cancelled`가 true라서 **바로 remove** 해요. 즉, "clean-up이 먼저 실행되고 watch가 나중에 시작되는 경쟁 상황(race)" 대비.
- (c) `getCurrentPositionAsync`는 **한 번** 위치를 가져오고 끝, `watchPositionAsync`는 위치가 바뀔 때마다 **계속** 콜백을 불러요. 예: 러닝 앱, 배달 추적, 길 안내.
- 어디에 나와 있나: W7 "Example: Live Location > Step 1", Lab 6 Part 4

---

## Section 3: Programming

### Q13. Lists (16점)

**✅ 모범답안 App.js**

```jsx
import { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  FlatList,
  ActivityIndicator,
  StyleSheet,
} from 'react-native';

const URL = 'https://jsonplaceholder.typicode.com/todos?userId=1';

export default function MyApp() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [updatedAt, setUpdatedAt] = useState(null);
  const [search, setSearch] = useState('');
  const [ascending, setAscending] = useState(true);

  function loadTasks() {
    return fetch(URL)
      .then((res) => {
        // fetch only rejects when the network fails. A 404 or 500 still resolves,
        // so throw here to reach the catch.
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then((json) => {
        setTasks(json);
        setUpdatedAt(new Date());
        setError(null);
      })
      .catch(() =>
        setError('Could not load the tasks. Check your connection and try again.')
      );
  }

  useEffect(() => {
    loadTasks().finally(() => setLoading(false));
  }, []);

  function retry() {
    setLoading(true);
    loadTasks().finally(() => setLoading(false));
  }

  function refreshTasks() {
    setRefreshing(true);
    loadTasks().finally(() => setRefreshing(false));
  }

  // Derived on every render, not stored in state. filter() returns a new array,
  // so sort() never touches tasks.
  const visible = tasks
    .filter((task) => task.title.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) =>
      ascending ? a.title.localeCompare(b.title) : b.title.localeCompare(a.title)
    );

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
        <Text>Loading tasks...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.center}>
        <Text style={styles.error}>{error}</Text>
        <Button title="Try Again" onPress={retry} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Button
        title={ascending ? 'Sort Z to A' : 'Sort A to Z'}
        onPress={() => setAscending((prev) => !prev)}
      />
      <TextInput
        style={styles.input}
        placeholder="Search tasks"
        value={search}
        onChangeText={setSearch}
      />
      <FlatList
        data={visible}
        keyExtractor={(item) => item.id.toString()}
        refreshing={refreshing}
        onRefresh={refreshTasks}
        renderItem={({ item }) => (
          <View style={styles.row}>
            <Text style={styles.title}>{item.title}</Text>
            <Text style={[styles.status, item.completed && styles.done]}>
              {item.completed ? 'Done' : 'Open'}
            </Text>
          </View>
        )}
        ListHeaderComponent={
          <View>
            <Text style={styles.header}>
              Showing {visible.length} of {tasks.length} tasks
            </Text>
            <Text style={styles.header}>
              Updated {updatedAt?.toLocaleTimeString()}
            </Text>
          </View>
        }
        ListEmptyComponent={
          <Text style={styles.empty}>
            {search ? `No tasks match "${search}".` : 'No tasks yet.'}
          </Text>
        }
      />
    </View>
  );
}

// styles: starter 그대로
```

**채점 기준 (교수님 피드백 스타일로 예상)**

| Part | 점수 | 체크 포인트 |
|---|---|---|
| A | 5 | tasks 빈 배열 state, useEffect `[]` + fetch, FlatList의 data/renderItem/keyExtractor, `({ item })`, `.toString()`, Done/Open + `[styles.status, item.completed && styles.done]` |
| B | 4 | loading 초기값 true + 전체화면 스피너, `res.ok` 검사, 에러 화면 + Try Again이 스피너 다시 보여줌, `ListEmptyComponent` |
| C | 4 | controlled TextInput(value + onChangeText), 대소문자 무시, 정렬 토글 + 버튼 글자 바뀜, **visible을 state에 저장 안 함**, filter 먼저, ListHeaderComponent로 개수, 검색어 있을 때 다른 빈 메시지 |
| D | 3 | `refreshing`/`onRefresh`, loading과 **다른** state, `toLocaleTimeString()` 시간 표시 |

**한글 코드 해설 (고등학생 버전)**

- `useState([])`: 처음엔 데이터가 없으니까 빈 배열. FlatList에 undefined를 주면 안 돼서 빈 배열로 시작해요.
- `loadTasks()`가 `return fetch(...)`로 Promise를 **돌려주는** 게 핵심이에요. 그래야 밖에서 `.finally()`를 붙여서 "끝나면 스피너 꺼"를 할 수 있어요. Test2 Q8처럼 함수만 만들고 연결 안 하면 0점이에요.
- `visible`은 계산 결과예요. 저장하는 게 아니라 렌더링할 때마다 "tasks에서 걸러서 정렬한 것"을 새로 만들어요. state는 원재료(tasks, search, ascending)만.
- `if (loading) return ...` 같은 **조기 return**은 모든 useState 아래에 있어야 해요. 훅을 조기 return 아래에 두면 에러예요.
- `ListHeaderComponent`는 목록과 같이 스크롤돼요. FlatList 위에 그냥 `<Text>`를 두면 고정돼서 문제 조건 위반.
- 빈 메시지: `search ? A : B`. 검색어가 있으면 "검색 결과 없음", 없으면 "아예 데이터 없음".

---

### Q14. Touch (10점)

**✅ 모범답안 App.js**

```jsx
import { useState } from 'react';
import { View, Text, Pressable, FlatList, StyleSheet } from 'react-native';

const SEATS = Array.from({ length: 24 }, (_, i) => ({
  id: String(i + 1),
  label: `Seat ${i + 1}`,
}));

export default function MyApp() {
  const [selected, setSelected] = useState({});
  const [held, setHeld] = useState({});

  function toggleSelect(id) {
    if (held[id]) return; // a held seat ignores taps
    setSelected((prev) => ({ ...prev, [id]: !prev[id] }));
  }

  function toggleHold(id) {
    setHeld((prev) => ({ ...prev, [id]: !prev[id] }));
    setSelected((prev) => ({ ...prev, [id]: false }));
  }

  const count = Object.values(selected).filter(Boolean).length;

  return (
    <View style={styles.container}>
      <View style={styles.bar}>
        <Text style={styles.heading}>{count} selected</Text>
        <Pressable
          style={styles.clear}
          hitSlop={20}
          onPress={() => setSelected({})}
        >
          <Text style={styles.clearText}>X</Text>
        </Pressable>
      </View>
      <FlatList
        data={SEATS}
        keyExtractor={(item) => item.id}
        extraData={[selected, held]}
        renderItem={({ item }) => (
          <Pressable
            style={({ pressed }) => [
              styles.row,
              selected[item.id] && styles.selected,
              held[item.id] && styles.held,
              pressed && styles.pressed,
            ]}
            onPress={() => toggleSelect(item.id)}
            onLongPress={() => toggleHold(item.id)}
          >
            <Text style={styles.text}>{item.label}</Text>
            {held[item.id] && <Text style={styles.note}>Held</Text>}
          </Pressable>
        )}
      />
    </View>
  );
}

// styles: starter 그대로
```

**채점 기준**

| Part | 점수 | 체크 포인트 |
|---|---|---|
| A | 2 | Pressable + `style={({ pressed }) => [...]}` 함수형 스타일 |
| B | 3 | 객체 id state + updater `(prev) => ({ ...prev, [id]: !prev[id] })`, count 파생값, pressed가 배열 **마지막**, `extraData` |
| C | 3 | `onLongPress`, Held 텍스트, hold 시 선택 해제, held면 onPress 무시(`disabled` 쓰면 길게 누르기도 막혀서 감점) |
| D | 2 | X를 Pressable로, `setSelected({})`, `hitSlop={20}` |

**한글 코드 해설**

- `style={({ pressed }) => [...]}`: Pressable의 style에 **함수**를 줄 수 있어요. 손가락이 닿아 있는 동안 pressed가 true. 배열은 왼쪽부터 적용되고 뒤에 오는 게 덮어써요. 그래서 pressed를 맨 뒤에 둬야 선택된 행에서도 눌림 색이 보여요.
- `{ ...prev, [id]: !prev[id] }`: 이전 객체를 복사하고 그 id 하나만 뒤집어요. `[id]`는 "변수 id의 값을 키로 써라"는 문법(computed key).
- `Object.values(selected).filter(Boolean).length`: `{1: true, 2: false}`에서 true만 세요. 해제한 좌석은 false로 남아 있어서 `Object.keys().length`로 세면 틀려요.
- `extraData`: FlatList는 data가 그대로면 행을 다시 안 그릴 수 있어요. 행이 data 밖의 state(selected, held)를 읽으니까 알려줘야 해요.
- Part C 함정: `disabled={held[item.id]}`로 막으면 onLongPress까지 막혀서 다시 풀 수가 없어요. 그래서 함수 안에서 `if (held[id]) return;`.

---

### Q15. Maps & Geolocation (10점)

**✅ 모범답안 App.js**

```jsx
import { useState, useRef } from 'react';
import * as Location from 'expo-location';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import MapView, { Marker } from 'react-native-maps';

const SHOPS = [ /* starter 그대로 */ ];
const START = { /* starter 그대로 */ };

// iOS ignores customMapStyle and Android ignores showsPointsOfInterest,
// so it takes both to hide the places everywhere.
const HIDE_PLACES = [{ featureType: 'poi', stylers: [{ visibility: 'off' }] }];

export default function MyApp() {
  const [selected, setSelected] = useState(null);
  const [canShowUser, setCanShowUser] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);
  const [finding, setFinding] = useState(false);
  const mapRef = useRef(null);

  // Ask when the user presses the button, so they know why we need it.
  async function nearMe() {
    setFinding(true);
    setErrorMsg(null);
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Location is needed for Near Me. You can still tap the shops.');
        return;
      }
      setCanShowUser(true);
      const pos = await Location.getCurrentPositionAsync({});
      mapRef.current.animateToRegion(
        {
          latitude: pos.coords.latitude,
          longitude: pos.coords.longitude,
          latitudeDelta: 0.005,
          longitudeDelta: 0.005,
        },
        1000
      );
    } catch {
      setErrorMsg('Could not get your location. Is location turned on?');
    } finally {
      setFinding(false);
    }
  }

  return (
    <View style={styles.container}>
      <MapView
        ref={mapRef}
        style={styles.map}
        initialRegion={START}
        showsUserLocation={canShowUser}
        showsPointsOfInterest={false}
        customMapStyle={HIDE_PLACES}
      >
        {SHOPS.map((shop) => (
          <Marker
            key={shop.id}
            coordinate={{ latitude: shop.latitude, longitude: shop.longitude }}
            title={shop.name}
            description={shop.address}
            onPress={() => setSelected(shop)}
          />
        ))}
      </MapView>
      <Pressable
        style={({ pressed }) => [
          styles.button,
          pressed && styles.pressed,
          finding && styles.disabled,
        ]}
        onPress={nearMe}
        disabled={finding}
      >
        <Text style={styles.buttonText}>{finding ? 'Finding you...' : 'Near Me'}</Text>
      </Pressable>
      <View style={styles.card}>
        {errorMsg ? (
          <Text style={styles.error}>{errorMsg}</Text>
        ) : selected ? (
          <>
            <Text style={styles.cardTitle}>{selected.name}</Text>
            <Text style={styles.cardText}>{selected.address}</Text>
          </>
        ) : (
          <Text style={styles.cardHint}>Tap a coffee shop.</Text>
        )}
      </View>
    </View>
  );
}

// styles: starter 그대로
```

**채점 기준**

| Part | 점수 | 체크 포인트 |
|---|---|---|
| A | 3 | MapView `style={styles.map}`(크기 없으면 안 보임), `initialRegion`, MapView가 **먼저** 와서 버튼과 카드가 위에 그려짐, `SHOPS.map` + `key`, `showsPointsOfInterest={false}` + `customMapStyle` 둘 다 |
| B | 2 | Marker `onPress`로 selected 저장, 카드 삼항 연산자 |
| C | 5 | 버튼에서 권한 요청, 거절 메시지, `showsUserLocation` state, `try/catch`, `useRef` + `animateToRegion` delta 0.005, `finally`로 버튼 복구, `disabled` + 스타일 |

**한글 코드 해설**

- `import * as Location`: expo-location의 모든 함수를 `Location.` 아래에 모아요.
- 권한을 **버튼 누를 때** 묻는 이유: 앱 열자마자 물어보면 사용자가 왜 필요한지 몰라서 거절하기 쉬워요. Lab 6 Part 2가 똑같은 요구예요.
- `return`이 try 안에 있어도 `finally`는 실행돼요. 그래서 거절, 실패, 성공 모든 경우에 버튼이 "Near Me"로 돌아와요.
- `MapView`에 `<Marker>`를 자식으로 넣으려면 `<MapView />` 자기닫힘을 `<MapView>...</MapView>`로 바꿔야 해요. 은근히 자주 틀려요.
- `MapView, { Marker }`: MapView는 default export(중괄호 없음), Marker는 named export(중괄호). Test2 Q6에서 import는 잘 했으니 이 차이만 기억.
- 지도 문제는 웹 미리보기가 안 돼요. 시험에서도 휴대폰 Expo Go로 확인해야 하니 미리 Expo Go 설치해 두세요.
