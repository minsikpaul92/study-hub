# Test 3 교수님 샘플 프로그래밍 문제 모범답안과 해설

> 문제지: 교수님이 올려 준 `Test 3 Practice Programming Questions` (이 페이지의 "문제" 링크).
> 시험은 **프로그래밍 문제 2개**(Q1 7점 약 13분, Q2 6점 약 12분, 합계 13점)예요. 시작 코드는 Snack **Web** 미리보기에서 풀고, 다 끝나면 `App.js`를 답안 칸에 복사해요. `styles.js`는 이미 다 주어져서 스타일은 안 짜도 돼요.
> 교수님 말씀: **답을 외우지 말고, 모든 줄을 설명할 수 있으면 준비 끝.** 시험에서는 앱 종류와 요구사항이 바뀌어요. 그래서 아래에 "시험에서 바뀔 수 있는 부분"도 같이 정리했어요.
> 이 두 모범답안은 react-native-web 환경에서 가짜 fetch를 붙여 직접 실행해 확인했어요(정상 응답, 404, 빈 배열, 탭, 누르고 있기, 길게 누르기).


## 교수님 주석의 질문 항목별로 어느 강의노트를 볼까 (코스노트 기준, 인클래스 제외)

코드 안의 `📖` 주석에도 같은 출처를 적어 뒀어요. 코스노트: https://seneca-ictoer.github.io/WEB530/

### Question 1. Post Comments (주석에 3개 항목)

| 주석 항목 | 요구사항 한 줄 | 볼 곳 |
| --- | --- | --- |
| **Load the comments (2점)** | `useEffect`로 한 번 fetch, `comments`에 저장 | [Fetching List Data](https://seneca-ictoer.github.io/WEB530/E-Lists/fetching-list-data) 예제의 `useEffect(..., [])`와 `setData` 부분 |
| **Loading and errors (2점)** | 스피너 + 문구, `res.ok`로 에러 처리 | [Fetching List Data](https://seneca-ictoer.github.io/WEB530/E-Lists/fetching-list-data) 예제의 `if (loading)`, `if (error)`와 설명의 "`fetch()`는 네트워크 실패일 때만 reject, `response.ok` 확인", 같은 패턴 코드는 [Data Lists and Detail Views](https://seneca-ictoer.github.io/WEB530/E-Lists/lists-and-detail-views) > Full Example (Fetching Remote Data)의 `if (!res.ok) throw ...` |
| **Show the comments (3점)** | `FlatList`, key는 id, 빈 목록 문구 | [Working with Item Lists](https://seneca-ictoer.github.io/WEB530/E-Lists/working-with-lists) > FlatList (`keyExtractor`, `renderItem`, `ListEmptyComponent`) |

### Question 2. Camping Packing List (주석에 3개 항목)

| 주석 항목 | 요구사항 한 줄 | 볼 곳 (정확한 위치) |
| --- | --- | --- |
| **Packing items (4점)** | `Pressable` 행, 누르는 동안 `styles.pressed`, 탭 토글, `styles.packed`, `extraData` | [Scrolling](https://seneca-ictoer.github.io/WEB530/F-Touch/scrolling) > **Scrolling and Touch Together**. 예제 하나에 다 있어요: `useState({})`(id 객체), `toggle`의 `setSelected((prev) => ({ ...prev, [id]: !prev[id] }))`, `style={({ pressed }) => [styles.row, selected[item.id] && styles.selected, pressed && styles.pressed]}`, `extraData={selected}`. 아래 불릿 3개가 각각 id 객체, pressed가 맨 뒤인 이유, extraData 이유를 설명해요. `pressed` 스타일 함수의 기본 설명은 [Handling Touch](https://seneca-ictoer.github.io/WEB530/F-Touch/handling-touch) > Pressable |
| **Progress (1점)** | 헤딩 `N of 8 packed`, 해제해도 정확 | 같은 [Scrolling](https://seneca-ictoer.github.io/WEB530/F-Touch/scrolling) > Scrolling and Touch Together 예제의 `const count = Object.values(selected).filter(Boolean).length;`와 `<Text>{count} selected</Text>`. 값이 `false`로 바뀌어도 키는 남아서 `filter(Boolean)`이 필요한 이유가 문제의 함정이에요 |
| **Start over (1점)** | "Unpack all"은 `onLongPress`일 때만, 일반 탭은 힌트 | [Handling Touch](https://seneca-ictoer.github.io/WEB530/F-Touch/handling-touch) > **Long Press, Press In, and Press Out**. "길게 누르면 `onPress`가 아니라 `onLongPress`가 실행된다"는 설명과 예제의 `onLongPress={() => ...}`. 힌트용 `hint` state는 시작 코드에 이미 있어서 일반 `onPress`에서 `setHint(...)`만 하면 돼요 |

정리: Q2는 **Scrolling > Scrolling and Touch Together** 한 군데로 4+1점(6점 중 5점)을 거의 그대로 풀 수 있고, 나머지 1점은 **Handling Touch > Long Press**예요. 교수님이 "코드를 그대로 베끼지 말고 이해해서 쓰라"고 한 대로, 변수 이름(`selected` 대신 `packed`, `rows` 대신 `ITEMS`)과 요구 문구를 바꿔 쓰는 연습을 하세요.

---

## Question 1. Post Comments (7점)

### 채점 기준 (교수님 주석 그대로)

| Part | 배점 | 확인할 것 |
| --- | --- | --- |
| 불러오기 | 2 | `useEffect(..., [])`에서 `fetch(URL)`, 결과를 `comments`에 저장, **한 번만** 실행 |
| 로딩과 에러 | 2 | 로딩 중 스피너 + "Loading comments..." (`styles.center`), 서버가 에러를 주면 `styles.error` 메시지. **`res.ok` 확인이 핵심** |
| 목록 | 3 | `FlatList`에 행(`styles.row`)마다 name(`styles.title`)과 email(`styles.subtitle`), `keyExtractor`는 id, 빈 목록이면 `ListEmptyComponent`로 "No comments yet." |

### 모범답안 (`App.js`의 `MyApp`만)

```jsx
export default function MyApp() {
  // 📖 강의노트 Fetching List Data: loading, error state (data, loading, error 세 개)
  // https://seneca-ictoer.github.io/WEB530/E-Lists/fetching-list-data
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 📖 Fetching List Data: useEffect로 마운트 때 fetch, 끝의 [] = 한 번만
  useEffect(() => {
    fetch(URL)
      .then((res) => {
        // 📖 Fetching List Data: "fetch()는 네트워크 실패일 때만 reject, response.ok 확인"
        //    같은 패턴 코드: Data Lists and Detail Views > Full Example (Fetching Remote Data)
        //    https://seneca-ictoer.github.io/WEB530/E-Lists/lists-and-detail-views
        if (!res.ok) throw new Error('HTTP ' + res.status);
        return res.json();
      })
      .then((json) => setComments(json))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  // 📖 Fetching List Data: if (loading) { <ActivityIndicator size="large" /> } 로 early return
  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
        <Text>Loading comments...</Text>
      </View>
    );
  }

  // 📖 Fetching List Data: if (error) 화면도 같은 방식
  if (error) {
    return (
      <View style={styles.center}>
        <Text style={styles.error}>Could not load comments: {error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Comments on Post 1</Text>
      {/* 📖 Working with Item Lists > FlatList: data, renderItem, keyExtractor
          https://seneca-ictoer.github.io/WEB530/E-Lists/working-with-lists */}
      <FlatList
        data={comments}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.row}>
            <Text style={styles.title}>{item.name}</Text>
            <Text style={styles.subtitle}>{item.email}</Text>
          </View>
        )}
        // 📖 Working with Item Lists > FlatList: ListEmptyComponent (목록이 비었을 때)
        ListEmptyComponent={<Text style={styles.empty}>No comments yet.</Text>}
      />
    </View>
  );
}
```

### 한 줄씩 설명

- `useState([])`, `useState(true)`, `useState(null)`: 데이터, 로딩 중인지, 에러 메시지. 처음에는 로딩 중이라서 `loading`을 `true`로 시작해요.
- `useEffect(() => {...}, [])`: 빈 의존성 배열 `[]`이 **"앱이 열릴 때 한 번만"** 이에요. `[]`를 빼먹으면 렌더링할 때마다 fetch가 다시 돌아요(2점 중 절반 이상 잃는 실수).
- `if (!res.ok) throw new Error(...)`: **fetch는 404, 500을 받아도 실패로 치지 않아요.** (네트워크가 끊길 때만 reject) 그래서 `res.ok`를 직접 보고 던져야 `.catch`로 가요. 문제에서 URL을 `commentsx`로 바꿔 보라고 한 이유가 이거예요. 안 던지면 404의 빈 객체 `{}`가 `comments`에 들어가서 FlatList가 에러가 되거나 아무것도 안 나와요.
- `.finally(() => setLoading(false))`: 성공해도 실패해도 로딩은 끝나요. `.then` 안에서만 끄면 에러 때 스피너가 영원히 돌아요.
- `if (loading) return ...`: **early return**. 로딩 중에는 목록 대신 스피너 화면(`styles.center`)만 보여 줘요. 문제 문장 "instead of the list"가 이 뜻이에요.
- `if (error) return ...`: 에러 화면도 같은 방식. 순서는 loading, error, 정상 목록.
- `keyExtractor={(item) => item.id.toString()}`: 문자열을 돌려줘야 해요. id가 숫자라서 `.toString()`. `renderItem`처럼 `({ item })`이 아니라 그냥 `(item)`이에요(Week 5 함정).
- `renderItem={({ item }) => ...}`: 이건 **구조분해** `({ item })`.
- `ListEmptyComponent={<Text .../>}`: 목록이 비면 FlatList가 대신 보여 주는 부분. 문제의 "It must be part of the list, not a separate screen"이 이 prop을 쓰라는 뜻이에요. `if (comments.length === 0) return ...` 같은 별도 화면으로 만들면 감점.
- **헤딩 위치**: 빈 목록(`postId=999`)일 때는 헤딩이 그대로 있고 그 밑에 "No comments yet."이 나와야 해요(교수님 체크 항목). 위 답안은 헤딩과 `FlatList`가 같은 화면에 있어서 맞아요. 로딩과 에러 화면에는 헤딩이 없어도 돼요("instead of the list").

### 자주 하는 실수 (점수 깎이는 곳)

1. `[]` 빼먹기 또는 `useEffect` 밖에서 `fetch` 호출 (무한 요청)
2. `res.ok` 확인 없음 (404 테스트 실패)
3. `.finally` 없이 성공할 때만 `setLoading(false)` (에러 때 스피너 계속)
4. `keyExtractor`에 `item.id`를 숫자 그대로 반환, 또는 key 자체를 안 줌 (콘솔 warning)
5. 빈 목록을 `ListEmptyComponent`가 아닌 별도 `if` 화면으로 처리
6. `renderItem={(item) => ...}` 처럼 구조분해 누락

### 시험에서 바뀔 수 있는 부분

- 다른 주소와 다른 필드 (예: posts의 `title`, users의 `name`과 `company.name`). 구조는 같아요.
- 에러 테스트 방법 (주소 일부를 틀리게 바꾸기). 같은 `res.ok` 패턴이에요.
- 목록 위나 아래의 **추가 부분**: `ListHeaderComponent`, `ListFooterComponent`, `ItemSeparatorComponent`. 문제에 "an extra part of the list"라고 적혀 있어요.
- 검색창, 정렬 버튼, 당겨서 새로고침(`refreshing`, `onRefresh`)이 붙을 수 있어요. (Week 5.1 Notes)

---

## Question 2. Camping Packing List (6점)

### 채점 기준

| Part | 배점 | 확인할 것 |
| --- | --- | --- |
| 아이템 담기 | 4 | `Pressable` 행, 누르고 있는 동안 `styles.pressed`, 탭하면 packed 토글(객체 `{ i2: true }`), packed는 `styles.packed`, `FlatList`에 **`extraData`** |
| 진행 상황 | 1 | 헤딩이 `N of 8 packed`, 해제해도 정확 |
| 처음부터 다시 | 1 | "Unpack all"은 **`onLongPress`일 때만** 동작, 일반 탭은 힌트 "Hold the button to unpack everything." |

### 모범답안 (`App.js`, `Pressable`을 import에 추가)

```jsx
import { useState } from 'react';
import { View, Text, FlatList, Pressable } from 'react-native';
import styles from './styles';

// ITEMS 배열은 시작 코드 그대로

export default function MyApp() {
  const [hint, setHint] = useState('');
  // 📖 Scrolling > "Scrolling and Touch Together": 선택을 id 객체 state로 (selected[id])
  //    https://seneca-ictoer.github.io/WEB530/F-Touch/scrolling
  const [packed, setPacked] = useState({});

  // 📖 Sorting and filtering lists: 화면에 쓰는 값은 state에서 계산 (별도 state로 두지 않기)
  //    https://seneca-ictoer.github.io/WEB530/E-Lists/sorting-lists
  const packedCount = Object.values(packed).filter(Boolean).length;

  // 📖 Scrolling > "Scrolling and Touch Together": setSelected((prev) => ({ ...prev, [id]: !prev[id] }))
  function toggle(id) {
    setPacked((prev) => ({ ...prev, [id]: !prev[id] }));
  }

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>
        {packedCount} of {ITEMS.length} packed
      </Text>
      <FlatList
        data={ITEMS}
        // 📖 Scrolling > "Scrolling and Touch Together": extraData={selected}
        //    "없으면 최적화된 목록이 다시 안 그려서, 눌러도 선택 표시가 안 바뀔 수 있음"
        extraData={packed}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          // 📖 Handling Touch > Pressable: onPress, style={({ pressed }) => ...} (누르는 동안만 pressed = true)
          //    https://seneca-ictoer.github.io/WEB530/F-Touch/handling-touch
          <Pressable
            onPress={() => toggle(item.id)}
            style={({ pressed }) => [
              styles.row,
              packed[item.id] && styles.packed,
              pressed && styles.pressed,
            ]}
          >
            <Text style={styles.name}>{item.name}</Text>
          </Pressable>
        )}
      />
      {/* 📖 Handling Touch > "Long Press, Press In, and Press Out": 길게 누르면 onPress 대신 onLongPress 실행
          https://seneca-ictoer.github.io/WEB530/F-Touch/handling-touch */}
      <Pressable
        style={styles.button}
        onPress={() => setHint('Hold the button to unpack everything.')}
        onLongPress={() => {
          setPacked({});
          setHint('');
        }}
      >
        <Text style={styles.buttonText}>Unpack all</Text>
      </Pressable>
      <Text style={styles.hint}>{hint}</Text>
    </View>
  );
}
```

### 한 줄씩 설명

- `import { ..., Pressable }`: 시작 코드에는 `Pressable`이 없어요. **import 추가를 잊지 마세요.** (Reference error)
- `useState({})`: 담은 아이템을 **id를 키로 하는 객체**로 기억해요. 예: `{ i2: true, i5: true }`. 배열이 아니라 객체라서 "이 id가 담겼나?"를 `packed[item.id]` 한 줄로 확인할 수 있어요.
- `setPacked((prev) => ({ ...prev, [id]: !prev[id] }))`: **state를 직접 바꾸지 않고** 복사(`...prev`)한 새 객체를 만들어요. `[id]`는 계산된 속성 이름이고, `!prev[id]`가 토글이에요. 처음엔 `undefined`라서 `!undefined`는 `true`.
- `style={({ pressed }) => [...]}`: `Pressable`의 `style`에는 **함수**를 줄 수 있고, 누르고 있는 동안만 `pressed`가 `true`예요. 함수가 아니라 배열만 주면 `pressed`를 못 써요(Week 6).
- `[styles.row, packed[item.id] && styles.packed, pressed && styles.pressed]`: 스타일 배열은 **뒤에 오는 게 앞을 덮어써요.** `false`나 `undefined`는 무시돼서 조건부 스타일에 쓰기 좋아요.
- `extraData={packed}`: **이 문제의 숨은 1순위 포인트**. `FlatList`는 `data`가 바뀌지 않으면 행을 다시 안 그려요(PureComponent처럼 동작). 지금은 `data={ITEMS}`가 안 바뀌어서, 선택이 바뀌어도 FlatList가 모르는 상태예요. `extraData`에 상태를 넘겨야 다시 그려요. 문제의 마지막 체크 항목이 "앱이 extraData 없이도 돌아가는 것처럼 보일 수 있다"고 경고한 이유가 이거예요(작은 목록은 우연히 다시 그려져요).
- `Object.values(packed).filter(Boolean).length`: **`Object.keys(packed).length`로 세면 틀려요.** 해제하면 키는 남고 값이 `false`가 되어서, 3개 담았다가 1개를 풀어도 3으로 나와요. 문제의 "It must still be right after an item is unpacked again"가 이 함정이에요. 값이 `true`인 것만 센 답이 정답이에요. 이렇게 **state에서 계산해서 쓰는 값은 별도 state로 두지 않아요**(derived state, Week 5).
- `onPress` vs `onLongPress`: 버튼의 **짧게 누르기는 힌트만**, **길게 누르기가 실제 동작**. 비어 있는 객체 `{}`로 리셋하면 전부 해제돼요.
- `<Text>{hint}</Text>`: 힌트는 `hint` state가 이미 선언돼 있어서 값만 바꿔 주면 돼요.

### 자주 하는 실수

1. `extraData` 누락 (테스트로는 안 보여서 가장 많이 잃는 점수)
2. `Object.keys(packed).length`로 개수 세기 (해제 후 틀림)
3. `packed[id] = !packed[id]`처럼 state를 직접 변경, 또는 `setPacked`에 업데이트 함수 없이 이전 값을 덮어쓰기
4. `Pressable` import 누락
5. "Unpack all"에 `onPress`로 리셋을 연결 (일반 탭에서도 지워져 버림), 또는 `onLongPress`만 쓰고 힌트를 안 보여 줌
6. 행 `View`를 `Pressable`로 안 바꾸고 `Text`에만 `onPress`를 붙이기 (눌렀을 때 회색이 안 보임)

### 시험에서 바뀔 수 있는 부분

- 한 번에 하나만 선택하는 방식 (`selectedId` state, 비교는 `item.id === selectedId`), 여러 개 선택(이번 문제)과 구분하세요.
- `onLongPress`로 **삭제**나 **즐겨찾기** 같은 다른 동작, `delayLongPress` 시간 변경.
- 선택된 개수 대신 합계(가격 총합 등). 항상 `reduce`나 `filter`로 state에서 계산해요.
- `Pressable` 대신 `TouchableOpacity` 등 다른 터치 컴포넌트가 나올 수 있어요. Week 6 노트의 비교표를 확인하세요.

---

## 시험 직전 30초 체크

1. fetch: `useEffect` + `[]`, `res.ok`, `.catch`, `.finally`, 로딩 early return, 에러 early return
2. FlatList: `keyExtractor` 문자열, `renderItem({ item })`, `ListEmptyComponent`, 선택 state가 있으면 `extraData`
3. Pressable: `style={({ pressed }) => ...}`, `onPress`, `onLongPress`
4. 세는 값은 state에서 계산 (`filter(Boolean).length`)
5. 끝나기 전에 콘솔을 열어 red error, missing key warning이 없는지 확인
6. `App.js`는 몇 분마다 메모장에 복사해 두기 (시험에서는 Snack 저장이 안 돼요)
