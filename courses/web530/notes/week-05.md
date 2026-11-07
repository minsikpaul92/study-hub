# Week 5. Lists: FlatList, 정렬과 검색, 데이터 불러오기, 목록과 상세, 당겨서 새로고침

> 이 노트 읽는 법: 챕터마다 맨 앞에 **🧭 먼저 한국어로** 상자가 한 번 나와요(그 챕터의 구성과 할 일). 그다음 원문 출처, **📘/💻/🧪 원문**(영어 그대로), **▶ Snack**, **🇰🇷 한글 해설** 순서예요. 코드 바로 위에 **⌨️ 이 코드는 Snack에서 직접 쳐 보세요**가 있으면 직접 타이핑할 코드이고, 표시가 없는 코드는 읽고 이해만 하면 돼요. **5~7주차는 Test 3 범위**라서 특히 꼼꼼하게 정리했어요.

## 0. 이번 주 한눈에 보기

앱 화면의 대부분은 **목록**이에요(메일함, 연락처, 피드). 이번 주는 목록을 빠르게 보여 주고, 정렬하고, 검색하고, 서버에서 받아 오고, 눌러서 상세로 가고, 당겨서 새로고침하는 것까지 배워요.

**FlatList 필수 props**
| prop | 역할 | 예 |
| --- | --- | --- |
| `data` | 보여 줄 배열 | `data={posts}` |
| `renderItem` | 한 줄(row)을 어떻게 그릴지. **`({ item })`** 을 받음 | `renderItem={({ item }) => <Text>{item.title}</Text>}` |
| `keyExtractor` | 각 줄의 고유 key, **문자열** 반환 | `keyExtractor={(item) => item.id.toString()}` |
| `ListEmptyComponent` | data가 **비었을 때** 보여 줄 것 | `<Text>No items</Text>` |
| `ListHeaderComponent` | 목록 **맨 위**에 붙어서 **같이 스크롤**되는 것 | `Showing 5 of 10` |
| `refreshing` + `onRefresh` | 당겨서 새로고침 | `refreshing={refreshing} onRefresh={refresh}` |
| `onEndReached` | 끝에 가까워지면 더 불러오기(무한 스크롤) | |
| `windowSize` | 화면 몇 장 분량을 미리 그려 둘지 (기본 **21**) | |

**왜 `.map()` 대신 FlatList?** `.map()`(ScrollView)은 **전부 한꺼번에** 그려요. FlatList는 **virtualization(가상화)** 으로 **보이는 부분 근처만** 그려요. 1000개여도 빨라요.

**데이터 불러오기 4가지 상태 (시험 단골)**: loading(스피너) → 성공(목록) / error(메시지 + 다시 시도) / empty(빈 목록 메시지)

**fetch 최대 함정**: `fetch`는 **네트워크가 끊겼을 때만** 실패(reject)해요. 404나 500은 "성공한 응답"으로 와요. 그래서 반드시 **`if (!res.ok) throw new Error(...)`** 로 직접 에러를 던져야 catch로 가요.


**⌨️ Snack에서 직접 쳐 볼 것 (이 순서대로)**

어디 칸을 누르면 그 코드로 바로 가요. 코드 위에도 ⌨️ 표시가 있어요.

| # | 어디 | 무엇을 |
| --- | --- | --- |
| 1 | [Example: FlatList](#practice-1) | 과일 배열 + FlatList(data, renderItem({ item }), keyExtractor) + flex: 1 컨테이너 |
| 2 | [Example: Sorting and Filtering › Step 1 - Sort with a Button](#practice-2) | ascending state + [...fruits].sort(localeCompare) + 정렬 버튼 |
| 3 | [Example: Sorting and Filtering › Step 2 - Filter with a TextInput](#practice-3) | query state + TextInput + filter 다음 sort |
| 4 | [Example: Sorting and Filtering › Step 3 - Show an Empty State](#practice-4) | ListEmptyComponent 추가 |
| 5 | [Example: Fetching List Data › Starter Code](#practice-5) | posts state + useEffect에서 fetch + FlatList (시작 코드) |
| 6 | [Example: Fetching List Data › Step 1 - Show a Spinner While Loading](#practice-6) | loading state(true로 시작) + finally에서 false + early return 스피너 |
| 7 | [Example: Fetching List Data › Step 2 - Handle Errors](#practice-7) | error state + if (!res.ok) throw + catch 메시지 + Try Again 버튼 |
| 8 | [Example: Fetching List Data › Step 3 - Show an Empty State](#practice-8) | ListEmptyComponent + ?userId=99로 빈 목록 테스트 |
| 9 | [Example: List and Detail › Step 1 - Put the List in a Stack](#practice-9) | MyApp → PostsScreen 이름 바꾸고 NavigationContainer + Stack 감싸기 |
| 10 | [Example: List and Detail › Step 2 - Make Each Row Tappable](#practice-10) | 줄을 Pressable로 감싸고 navigate("Details", { post: item }) |
| 11 | [Example: List and Detail › Step 3 - Add the Details Screen](#practice-11) | DetailsScreen에서 const { post } = route.params |
| 12 | [Example: Pull to Refresh › Step 1 - Track the Refresh](#practice-12) | refreshing state + refresh 함수(true → loadPosts → finally false) |
| 13 | [Example: Pull to Refresh › Step 2 - Wire Up the List](#practice-13) | FlatList에 refreshing, onRefresh 연결 |
| 14 | [Example: Pull to Refresh › Step 3 - Prove It Reloaded](#practice-14) | updated 시각 state + ListHeaderComponent로 표시 |

나머지 👀 표시는 읽고 이해만 하면 돼요. 같은 개념을 위 예제에서 이미 타이핑해요.



## 목차

- 1. 📘 코스노트: Working with Item Lists
- 2. 📘 코스노트: Sorting and filtering lists
- 3. 📘 코스노트: Fetching List Data
- 4. 📘 코스노트: Data Lists and Detail Views
- 5. 📘 코스노트: Pull to Refresh
- 6. 💻 인클래스 예제: Week 5.1 - Notes and Examples
- 7. 🧪 Lab: Lab 5 - Lists
- ✅ Week 5 시험 대비 체크리스트


---

## 1. 📘 코스노트: Working with Item Lists

<div class="sum" data-kind="read">

**🧭 먼저 한국어로** · 👀 읽고 이해하기 (타이핑 안 해도 돼요)

코스노트의 FlatList 소개예요. 같은 내용을 아래 💻 인클래스 "Example: FlatList"에서 직접 쳐 보니까 여기서는 읽고 개념만 잡으면 돼요.

**이 챕터 구성**

- 👀 **FlatList**: FlatList는 data, renderItem, keyExtractor 세 개로 목록을 그려요. 화면 근처만 그려서(virtualization) 긴 목록도 빨라요. 코드는 Snack으로 실행만 해 보세요.
- 👀 **FlatList › Fixed Height Rows**: 줄 높이가 모두 같으면 getItemLayout으로 미리 알려 줘서 더 빨라져요. 시험보다는 성능 팁이에요.

</div>

> 원문 출처: https://seneca-ictoer.github.io/WEB530/E-Lists/working-with-lists

### 📘 FlatList

React Native provides the `FlatList` component as the recommended way to render lists on both iOS and Android. While you can render lists using JavaScript’s `.map()`, this quickly becomes inefficient because `.map()` renders every item at once. `FlatList` is optimized for mobile performance through virtualization, meaning it only renders what is visible on screen.

To get started, pass an array of objects to the `data` prop. Each object must have a stable, unique key. The recommended pattern is to provide an `id` or `key` property, or tell the list which property to use with `keyExtractor`. If no key is found, React Native falls back to each item's position in the array and logs a warning, which can cause rows to update incorrectly when the list changes.

```jsx
import React from 'react';
import { Text, View, FlatList } from 'react-native';

const itemsToShow = new Array(10)
  .fill(null)
  .map((v, i) => ({ id: i.toString(), title: `Item ${i}` }));

// Memoized row component for better performance
const Row = React.memo(({ title }) => {
  return <Text style={{ padding: 10 }}>{title}</Text>;
});

export default function App() {
  return (
    <View style={{ marginTop: 50 }}>
      <FlatList
        data={itemsToShow}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <Row title={item.title} />}
        ListEmptyComponent={<Text>No items found</Text>}
        initialNumToRender={10}
        windowSize={10}
      />
    </View>
  );
}
```

▶ **[Snack에서 바로 실행하기](https://snack.expo.dev/?name=WEB530%20W5%20FlatList&platform=web&sdkVersion=54.0.0&code=import%20React%20from%20%27react%27%3B%0Aimport%20%7B%20Text%2C%20View%2C%20FlatList%20%7D%20from%20%27react-native%27%3B%0A%0Aconst%20itemsToShow%20%3D%20new%20Array%2810%29%0A%20%20.fill%28null%29%0A%20%20.map%28%28v%2C%20i%29%20%3D%3E%20%28%7B%20id%3A%20i.toString%28%29%2C%20title%3A%20%60Item%20%24%7Bi%7D%60%20%7D%29%29%3B%0A%0A%2F%2F%20Memoized%20row%20component%20for%20better%20performance%0Aconst%20Row%20%3D%20React.memo%28%28%7B%20title%20%7D%29%20%3D%3E%20%7B%0A%20%20return%20%3CText%20style%3D%7B%7B%20padding%3A%2010%20%7D%7D%3E%7Btitle%7D%3C%2FText%3E%3B%0A%7D%29%3B%0A%0Aexport%20default%20function%20App%28%29%20%7B%0A%20%20return%20%28%0A%20%20%20%20%3CView%20style%3D%7B%7B%20marginTop%3A%2050%20%7D%7D%3E%0A%20%20%20%20%20%20%3CFlatList%0A%20%20%20%20%20%20%20%20data%3D%7BitemsToShow%7D%0A%20%20%20%20%20%20%20%20keyExtractor%3D%7B%28item%29%20%3D%3E%20item.id%7D%0A%20%20%20%20%20%20%20%20renderItem%3D%7B%28%7B%20item%20%7D%29%20%3D%3E%20%3CRow%20title%3D%7Bitem.title%7D%20%2F%3E%7D%0A%20%20%20%20%20%20%20%20ListEmptyComponent%3D%7B%3CText%3ENo%20items%20found%3C%2FText%3E%7D%0A%20%20%20%20%20%20%20%20initialNumToRender%3D%7B10%7D%0A%20%20%20%20%20%20%20%20windowSize%3D%7B10%7D%0A%20%20%20%20%20%20%2F%3E%0A%20%20%20%20%3C%2FView%3E%0A%20%20%29%3B%0A%7D%0A)** (SDK 54, 필요한 패키지 자동 포함) <button class="snack-embed" type="button">👀 여기서 결과 보기</button>


![List Items](data:image/webp;base64...)


In this example, we begin by generating an array of ten objects using `fill` and `map`, each containing an `id` and a `title`. React Native requires every list item to have a stable, unique key, so we use the `id` field and pass it to `keyExtractor`. The `FlatList` then receives this array through its `data` prop, and each item is rendered using the `renderItem` function, which returns a memoized `Row` component for better performance.

Because `FlatList` is optimized for mobile scrolling through virtualization, it only renders items that are visible on screen, and props like `initialNumToRender` and `windowSize` help control how many items are rendered initially and kept in memory. We also include a `ListEmptyComponent` to handle cases where the list has no data. This structure ensures smooth scrolling, efficient rendering, and predictable updates.

💡 `FlatList` is a `PureComponent`, meaning it only re-renders when props change shallowly. Wrapping each row in `React.memo()` prevents unnecessary updates and improves performance, especially with long lists.

**🇰🇷 한글 해설**

**FlatList** = iOS, Android 둘 다에서 목록을 보여 주는 **권장** 방법.
- `.map()`은 아이템을 **전부 한 번에** 그려서 비효율. FlatList는 **virtualization**(화면에 보이는 것 위주로만 렌더링)으로 최적화.
- `data`에 객체 배열을 넘기고, 각 객체엔 **안정적이고 고유한 key**가 필요해요. `id`나 `key` 속성, 또는 `keyExtractor`로 지정. 없으면 배열 위치(index)를 쓰고 **경고**, 목록이 바뀔 때 엉뚱한 줄이 업데이트될 수 있어요.

예제 해설:
- `new Array(10).fill(null).map((v, i) => ({ id: i.toString(), title: `Item ${i}` }))` → 10칸짜리 빈 배열을 null로 채우고 map으로 객체 10개 생성.
- `React.memo(...)`로 감싼 `Row` → **memoized(기억된)** 컴포넌트. props가 안 바뀌면 다시 안 그려요(성능).
- `initialNumToRender={10}` 처음에 그릴 개수, `windowSize={10}` 메모리에 유지할 범위.
- 💡 FlatList는 **PureComponent**: props가 **얕게(shallow)** 바뀌었을 때만 다시 렌더링. 그래서 row를 `React.memo()`로 감싸면 불필요한 업데이트를 막아요.

#### 📘 Fixed Height Rows

If each row has a fixed height, you can add:

```jsx
getItemLayout={(data, index) => ({
  length: 50,
  offset: 50 * index,
  index,
})}
```

This improves scroll-to-index performance and prevents layout jumps.

**🇰🇷 한글 해설**

줄 높이가 **고정**이면 `getItemLayout`으로 미리 알려 줘요. `length`(줄 높이), `offset`(위에서부터 거리 = 높이 × index), `index`. 특정 위치로 스크롤할 때 빠르고, 레이아웃이 튀지 않아요.


---

## 2. 📘 코스노트: Sorting and filtering lists

<div class="sum" data-kind="read">

**🧭 먼저 한국어로** · 👀 읽고 이해하기 (타이핑 안 해도 돼요)

정렬과 검색을 useMemo로 묶는 코스노트 버전이에요. 같은 기능을 💻 "Example: Sorting and Filtering"에서 더 쉬운 코드로 쳐 보니까 여기서는 useMemo가 왜 쓰였는지만 이해하면 돼요.

**이 챕터 구성**

- 👀 **시작 부분**: 검색어로 filter, 버튼으로 sort, 결과를 useMemo로 기억해서 필요할 때만 다시 계산해요. 실행해서 검색과 정렬이 어떻게 반응하는지 확인만 해 보세요.

</div>

> 원문 출처: https://seneca-ictoer.github.io/WEB530/E-Lists/sorting-lists

The `FlatList` component renders whatever items you pass into its `data` array. If you modify the array, by adding, removing, sorting, or filtering items, the list automatically re-renders to reflect those changes. This makes `FlatList` ideal for building interactive UIs where users can search, filter, or reorder content.

However, modern React Native best practices recommend **avoiding sorting or filtering directly inside the render function**. Instead, these operations should be memoized using `useMemo` so they only run when their inputs change. This improves performance and prevents unnecessary re-renders.

Below is an example that demonstrates sorting and filtering using modern patterns.

```jsx
import React, { useState, useMemo } from 'react';
import { Text, View, Button, TextInput, FlatList } from 'react-native';

// Generate 99 items with stable IDs
const itemsToShow = new Array(99)
  .fill(null)
  .map((v, i) => ({ id: i.toString(), title: `Item ${i}` }));

// Memoized row component for performance
const Row = React.memo(({ title }) => {
  return <Text style={{ padding: 8 }}>{title}</Text>;
});

export default function App() {
  const [ascending, setAscending] = useState(true);
  const [filter, setFilter] = useState('');

  // Memoize sorting + filtering so it only recalculates when needed
  const filteredAndSorted = useMemo(() => {
    // Filter
    const filtered = filter
      ? itemsToShow.filter((item) => item.title.toLowerCase().includes(filter.toLowerCase()))
      : itemsToShow;

    // Sort
    const sorted = [...filtered].sort((a, b) => {
      const aNum = Number(a.id);
      const bNum = Number(b.id);
      return ascending ? aNum - bNum : bNum - aNum;
    });

    return sorted;
  }, [filter, ascending]);

  return (
    <View style={{ flex: 1, marginTop: 50, padding: 10 }}>
      <Button
        title={`Sort ${ascending ? 'Ascending' : 'Descending'}`}
        onPress={() => setAscending((prev) => !prev)}
      />

      <TextInput
        placeholder="Search Text"
        value={filter}
        onChangeText={setFilter}
        style={{
          borderWidth: 1,
          borderColor: '#ccc',
          padding: 8,
          marginVertical: 10,
        }}
      />

      <FlatList
        data={filteredAndSorted}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <Row title={item.title} />}
        ListEmptyComponent={<Text>No items found</Text>}
        initialNumToRender={20}
        windowSize={10}
      />
    </View>
  );
}
```

▶ **[Snack에서 바로 실행하기](https://snack.expo.dev/?name=WEB530%20W5%20Sorting%20and%20filtering%20lists&platform=web&sdkVersion=54.0.0&code=import%20React%2C%20%7B%20useState%2C%20useMemo%20%7D%20from%20%27react%27%3B%0Aimport%20%7B%20Text%2C%20View%2C%20Button%2C%20TextInput%2C%20FlatList%20%7D%20from%20%27react-native%27%3B%0A%0A%2F%2F%20Generate%2099%20items%20with%20stable%20IDs%0Aconst%20itemsToShow%20%3D%20new%20Array%2899%29%0A%20%20.fill%28null%29%0A%20%20.map%28%28v%2C%20i%29%20%3D%3E%20%28%7B%20id%3A%20i.toString%28%29%2C%20title%3A%20%60Item%20%24%7Bi%7D%60%20%7D%29%29%3B%0A%0A%2F%2F%20Memoized%20row%20component%20for%20performance%0Aconst%20Row%20%3D%20React.memo%28%28%7B%20title%20%7D%29%20%3D%3E%20%7B%0A%20%20return%20%3CText%20style%3D%7B%7B%20padding%3A%208%20%7D%7D%3E%7Btitle%7D%3C%2FText%3E%3B%0A%7D%29%3B%0A%0Aexport%20default%20function%20App%28%29%20%7B%0A%20%20const%20%5Bascending%2C%20setAscending%5D%20%3D%20useState%28true%29%3B%0A%20%20const%20%5Bfilter%2C%20setFilter%5D%20%3D%20useState%28%27%27%29%3B%0A%0A%20%20%2F%2F%20Memoize%20sorting%20%2B%20filtering%20so%20it%20only%20recalculates%20when%20needed%0A%20%20const%20filteredAndSorted%20%3D%20useMemo%28%28%29%20%3D%3E%20%7B%0A%20%20%20%20%2F%2F%20Filter%0A%20%20%20%20const%20filtered%20%3D%20filter%0A%20%20%20%20%20%20%3F%20itemsToShow.filter%28%28item%29%20%3D%3E%20item.title.toLowerCase%28%29.includes%28filter.toLowerCase%28%29%29%29%0A%20%20%20%20%20%20%3A%20itemsToShow%3B%0A%0A%20%20%20%20%2F%2F%20Sort%0A%20%20%20%20const%20sorted%20%3D%20%5B...filtered%5D.sort%28%28a%2C%20b%29%20%3D%3E%20%7B%0A%20%20%20%20%20%20const%20aNum%20%3D%20Number%28a.id%29%3B%0A%20%20%20%20%20%20const%20bNum%20%3D%20Number%28b.id%29%3B%0A%20%20%20%20%20%20return%20ascending%20%3F%20aNum%20-%20bNum%20%3A%20bNum%20-%20aNum%3B%0A%20%20%20%20%7D%29%3B%0A%0A%20%20%20%20return%20sorted%3B%0A%20%20%7D%2C%20%5Bfilter%2C%20ascending%5D%29%3B%0A%0A%20%20return%20%28%0A%20%20%20%20%3CView%20style%3D%7B%7B%20flex%3A%201%2C%20marginTop%3A%2050%2C%20padding%3A%2010%20%7D%7D%3E%0A%20%20%20%20%20%20%3CButton%0A%20%20%20%20%20%20%20%20title%3D%7B%60Sort%20%24%7Bascending%20%3F%20%27Ascending%27%20%3A%20%27Descending%27%7D%60%7D%0A%20%20%20%20%20%20%20%20onPress%3D%7B%28%29%20%3D%3E%20setAscending%28%28prev%29%20%3D%3E%20%21prev%29%7D%0A%20%20%20%20%20%20%2F%3E%0A%0A%20%20%20%20%20%20%3CTextInput%0A%20%20%20%20%20%20%20%20placeholder%3D%22Search%20Text%22%0A%20%20%20%20%20%20%20%20value%3D%7Bfilter%7D%0A%20%20%20%20%20%20%20%20onChangeText%3D%7BsetFilter%7D%0A%20%20%20%20%20%20%20%20style%3D%7B%7B%0A%20%20%20%20%20%20%20%20%20%20borderWidth%3A%201%2C%0A%20%20%20%20%20%20%20%20%20%20borderColor%3A%20%27%23ccc%27%2C%0A%20%20%20%20%20%20%20%20%20%20padding%3A%208%2C%0A%20%20%20%20%20%20%20%20%20%20marginVertical%3A%2010%2C%0A%20%20%20%20%20%20%20%20%7D%7D%0A%20%20%20%20%20%20%2F%3E%0A%0A%20%20%20%20%20%20%3CFlatList%0A%20%20%20%20%20%20%20%20data%3D%7BfilteredAndSorted%7D%0A%20%20%20%20%20%20%20%20keyExtractor%3D%7B%28item%29%20%3D%3E%20item.id%7D%0A%20%20%20%20%20%20%20%20renderItem%3D%7B%28%7B%20item%20%7D%29%20%3D%3E%20%3CRow%20title%3D%7Bitem.title%7D%20%2F%3E%7D%0A%20%20%20%20%20%20%20%20ListEmptyComponent%3D%7B%3CText%3ENo%20items%20found%3C%2FText%3E%7D%0A%20%20%20%20%20%20%20%20initialNumToRender%3D%7B20%7D%0A%20%20%20%20%20%20%20%20windowSize%3D%7B10%7D%0A%20%20%20%20%20%20%2F%3E%0A%20%20%20%20%3C%2FView%3E%0A%20%20%29%3B%0A%7D%0A)** (SDK 54, 필요한 패키지 자동 포함) <button class="snack-embed" type="button">👀 여기서 결과 보기</button>



This example demonstrates how to combine sorting and filtering in a performant way. We begin by generating an array of 99 items, each with a stable `id` and a `title`. The user can toggle between ascending and descending order using a button, and they can filter the list by typing into a controlled `TextInput`. Instead of sorting and filtering inside the render function, which would cause unnecessary work on every re-render, we wrap the logic inside a `useMemo` hook. This ensures the list is only recalculated when the filter text or sort direction changes. The `FlatList` then receives this memoized array through its data prop, and each row is rendered using a memoized `Row` component for improved performance. A `ListEmptyComponent` is included to handle cases where no items match the filter. This approach keeps the UI responsive, avoids wasted renders, and follows modern React Native best practices.

**🇰🇷 한글 해설**

**정렬과 검색의 원리**: FlatList는 `data` 배열을 그대로 그려요. 배열을 바꾸면(추가, 삭제, 정렬, 필터) 목록이 **자동으로** 다시 그려져요. UI를 건드릴 필요가 없어요.

코스노트는 정렬/필터를 **`useMemo`** 로 감싸라고 해요. `useMemo(() => 계산, [의존성])` 는 의존성이 바뀔 때만 다시 계산하고 아니면 **이전 결과를 재사용**(메모이제이션)해요. (인클래스에서는 "목록이 클 때까지는 생략해도 된다"고 했어요. 같은 아이디어.)

예제 해설:
- state 2개: `ascending`(정렬 방향, boolean), `filter`(검색어).
- 필터: `filter ? itemsToShow.filter(...) : itemsToShow` → 검색어가 있을 때만 거르기. `toLowerCase()`를 양쪽에 써서 **대소문자 무시**. `includes()`로 포함 여부.
- 정렬: `[...filtered].sort(...)` → **복사본**을 정렬(sort는 원본을 바꾸니까). 숫자 비교는 `a - b`(오름차순), `b - a`(내림차순).
- `useMemo(..., [filter, ascending])` → 둘 중 하나가 바뀔 때만 다시 계산.
- 버튼 제목 `Sort ${ascending ? 'Ascending' : 'Descending'}`, 토글은 `setAscending((prev) => !prev)`.
- 검색창은 **controlled TextInput**(3주차).


---

## 3. 📘 코스노트: Fetching List Data

<div class="sum" data-kind="read">

**🧭 먼저 한국어로** · 👀 읽고 이해하기 (타이핑 안 해도 돼요)

API에서 목록을 받아 오는 코스노트예요. 시험에 나오는 loading, error, empty 처리는 💻 "Example: Fetching List Data"에서 단계별로 쳐 봐요.

**이 챕터 구성**

- 👀 **시작 부분**: useEffect에서 fetch → 받은 배열을 state에 저장 → FlatList에 넘겨요. 흐름만 이해하면 돼요.
- 👀 **Lazy Loading of List Data**: 끝까지 스크롤하면 onEndReached로 다음 페이지를 더 불러오는 무한 스크롤이에요. 개념과 prop 이름만 알아 두세요.
- ⏭️ **Lazy Loading of List Data › Best practices for infinite scrolling**: 무한 스크롤 주의사항 목록이에요. 중복 요청 막기, 로딩 표시, 끝 처리 정도만 기억하세요.

</div>

> 원문 출처: https://seneca-ictoer.github.io/WEB530/E-Lists/fetching-list-data

Many applications need to load list data from a remote API. In this example, we fetch a list of user names and display them using a `FlatList`. We use the `useEffect()` hook to perform the asynchronous request when the component mounts, and we store the results in state so they can be sorted and filtered just like locally generated data.

Modern React Native best practices recommend:

* Using an **async function inside useEffect**
* Adding a **cleanup flag** to ignore a response that arrives after the component unmounts
* Including **loading and error states**, and checking `response.ok`, since `fetch()` only rejects on network failures
* Memoizing sorting and filtering with `useMemo`
* Using **stable keys** instead of array indexes

Below is the updated version.

```jsx
import React, { useState, useEffect, useMemo } from 'react';
import { Text, View, Button, TextInput, FlatList, ActivityIndicator } from 'react-native';

// Memoized row component for performance
const Row = React.memo(({ title }) => {
  return <Text style={{ padding: 8 }}>{title}</Text>;
});

export default function App() {
  const [ascending, setAscending] = useState(true);
  const [filter, setFilter] = useState('');
  const [data, setData] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch data using modern async pattern
  useEffect(() => {
    let isMounted = true;

    const load = async () => {
      try {
        const resp = await fetch('https://jsonplaceholder.typicode.com/users');
        if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
        const users = await resp.json();

        if (isMounted) {
          setData(
            users.map((u) => ({
              id: u.id.toString(), // stable key
              title: u.name,
            }))
          );
        }
      } catch (e) {
        if (isMounted) setError('Failed to load data');
      } finally {
        // Runs after success or failure, so the spinner always goes away.
        if (isMounted) setLoading(false);
      }
    };

    load();
    return () => {
      isMounted = false;
    };
  }, []);

  // Memoize sorting + filtering
  const filteredAndSorted = useMemo(() => {
    const filtered = filter
      ? data.filter((item) => item.title.toLowerCase().includes(filter.toLowerCase()))
      : data;

    const sorted = [...filtered].sort((a, b) => {
      return ascending ? a.title.localeCompare(b.title) : b.title.localeCompare(a.title);
    });

    return sorted;
  }, [data, filter, ascending]);

  if (loading) {
    return (
      <View style={{ marginTop: 50 }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={{ marginTop: 50 }}>
        <Text>{error}</Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, marginTop: 50, padding: 10 }}>
      <Button
        title={`Sort ${ascending ? 'Ascending' : 'Descending'}`}
        onPress={() => setAscending((prev) => !prev)}
      />

      <TextInput
        placeholder="Search Text"
        value={filter}
        onChangeText={setFilter}
        style={{
          borderWidth: 1,
          borderColor: '#ccc',
          padding: 8,
          marginVertical: 10,
        }}
      />

      <FlatList
        data={filteredAndSorted}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <Row title={item.title} />}
        ListEmptyComponent={<Text>No items found</Text>}
        initialNumToRender={20}
        windowSize={10}
      />
    </View>
  );
}
```

▶ **[Snack에서 바로 실행하기](https://snack.expo.dev/?name=WEB530%20W5%20Fetching%20List%20Data&platform=web&sdkVersion=54.0.0&code=import%20React%2C%20%7B%20useState%2C%20useEffect%2C%20useMemo%20%7D%20from%20%27react%27%3B%0Aimport%20%7B%20Text%2C%20View%2C%20Button%2C%20TextInput%2C%20FlatList%2C%20ActivityIndicator%20%7D%20from%20%27react-native%27%3B%0A%0A%2F%2F%20Memoized%20row%20component%20for%20performance%0Aconst%20Row%20%3D%20React.memo%28%28%7B%20title%20%7D%29%20%3D%3E%20%7B%0A%20%20return%20%3CText%20style%3D%7B%7B%20padding%3A%208%20%7D%7D%3E%7Btitle%7D%3C%2FText%3E%3B%0A%7D%29%3B%0A%0Aexport%20default%20function%20App%28%29%20%7B%0A%20%20const%20%5Bascending%2C%20setAscending%5D%20%3D%20useState%28true%29%3B%0A%20%20const%20%5Bfilter%2C%20setFilter%5D%20%3D%20useState%28%27%27%29%3B%0A%20%20const%20%5Bdata%2C%20setData%5D%20%3D%20useState%28%5B%5D%29%3B%0A%0A%20%20const%20%5Bloading%2C%20setLoading%5D%20%3D%20useState%28true%29%3B%0A%20%20const%20%5Berror%2C%20setError%5D%20%3D%20useState%28null%29%3B%0A%0A%20%20%2F%2F%20Fetch%20data%20using%20modern%20async%20pattern%0A%20%20useEffect%28%28%29%20%3D%3E%20%7B%0A%20%20%20%20let%20isMounted%20%3D%20true%3B%0A%0A%20%20%20%20const%20load%20%3D%20async%20%28%29%20%3D%3E%20%7B%0A%20%20%20%20%20%20try%20%7B%0A%20%20%20%20%20%20%20%20const%20resp%20%3D%20await%20fetch%28%27https%3A%2F%2Fjsonplaceholder.typicode.com%2Fusers%27%29%3B%0A%20%20%20%20%20%20%20%20if%20%28%21resp.ok%29%20throw%20new%20Error%28%60HTTP%20%24%7Bresp.status%7D%60%29%3B%0A%20%20%20%20%20%20%20%20const%20users%20%3D%20await%20resp.json%28%29%3B%0A%0A%20%20%20%20%20%20%20%20if%20%28isMounted%29%20%7B%0A%20%20%20%20%20%20%20%20%20%20setData%28%0A%20%20%20%20%20%20%20%20%20%20%20%20users.map%28%28u%29%20%3D%3E%20%28%7B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20id%3A%20u.id.toString%28%29%2C%20%2F%2F%20stable%20key%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20title%3A%20u.name%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%7D%29%29%0A%20%20%20%20%20%20%20%20%20%20%29%3B%0A%20%20%20%20%20%20%20%20%7D%0A%20%20%20%20%20%20%7D%20catch%20%28e%29%20%7B%0A%20%20%20%20%20%20%20%20if%20%28isMounted%29%20setError%28%27Failed%20to%20load%20data%27%29%3B%0A%20%20%20%20%20%20%7D%20finally%20%7B%0A%20%20%20%20%20%20%20%20%2F%2F%20Runs%20after%20success%20or%20failure%2C%20so%20the%20spinner%20always%20goes%20away.%0A%20%20%20%20%20%20%20%20if%20%28isMounted%29%20setLoading%28false%29%3B%0A%20%20%20%20%20%20%7D%0A%20%20%20%20%7D%3B%0A%0A%20%20%20%20load%28%29%3B%0A%20%20%20%20return%20%28%29%20%3D%3E%20%7B%0A%20%20%20%20%20%20isMounted%20%3D%20false%3B%0A%20%20%20%20%7D%3B%0A%20%20%7D%2C%20%5B%5D%29%3B%0A%0A%20%20%2F%2F%20Memoize%20sorting%20%2B%20filtering%0A%20%20const%20filteredAndSorted%20%3D%20useMemo%28%28%29%20%3D%3E%20%7B%0A%20%20%20%20const%20filtered%20%3D%20filter%0A%20%20%20%20%20%20%3F%20data.filter%28%28item%29%20%3D%3E%20item.title.toLowerCase%28%29.includes%28filter.toLowerCase%28%29%29%29%0A%20%20%20%20%20%20%3A%20data%3B%0A%0A%20%20%20%20const%20sorted%20%3D%20%5B...filtered%5D.sort%28%28a%2C%20b%29%20%3D%3E%20%7B%0A%20%20%20%20%20%20return%20ascending%20%3F%20a.title.localeCompare%28b.title%29%20%3A%20b.title.localeCompare%28a.title%29%3B%0A%20%20%20%20%7D%29%3B%0A%0A%20%20%20%20return%20sorted%3B%0A%20%20%7D%2C%20%5Bdata%2C%20filter%2C%20ascending%5D%29%3B%0A%0A%20%20if%20%28loading%29%20%7B%0A%20%20%20%20return%20%28%0A%20%20%20%20%20%20%3CView%20style%3D%7B%7B%20marginTop%3A%2050%20%7D%7D%3E%0A%20%20%20%20%20%20%20%20%3CActivityIndicator%20size%3D%22large%22%20%2F%3E%0A%20%20%20%20%20%20%3C%2FView%3E%0A%20%20%20%20%29%3B%0A%20%20%7D%0A%0A%20%20if%20%28error%29%20%7B%0A%20%20%20%20return%20%28%0A%20%20%20%20%20%20%3CView%20style%3D%7B%7B%20marginTop%3A%2050%20%7D%7D%3E%0A%20%20%20%20%20%20%20%20%3CText%3E%7Berror%7D%3C%2FText%3E%0A%20%20%20%20%20%20%3C%2FView%3E%0A%20%20%20%20%29%3B%0A%20%20%7D%0A%0A%20%20return%20%28%0A%20%20%20%20%3CView%20style%3D%7B%7B%20flex%3A%201%2C%20marginTop%3A%2050%2C%20padding%3A%2010%20%7D%7D%3E%0A%20%20%20%20%20%20%3CButton%0A%20%20%20%20%20%20%20%20title%3D%7B%60Sort%20%24%7Bascending%20%3F%20%27Ascending%27%20%3A%20%27Descending%27%7D%60%7D%0A%20%20%20%20%20%20%20%20onPress%3D%7B%28%29%20%3D%3E%20setAscending%28%28prev%29%20%3D%3E%20%21prev%29%7D%0A%20%20%20%20%20%20%2F%3E%0A%0A%20%20%20%20%20%20%3CTextInput%0A%20%20%20%20%20%20%20%20placeholder%3D%22Search%20Text%22%0A%20%20%20%20%20%20%20%20value%3D%7Bfilter%7D%0A%20%20%20%20%20%20%20%20onChangeText%3D%7BsetFilter%7D%0A%20%20%20%20%20%20%20%20style%3D%7B%7B%0A%20%20%20%20%20%20%20%20%20%20borderWidth%3A%201%2C%0A%20%20%20%20%20%20%20%20%20%20borderColor%3A%20%27%23ccc%27%2C%0A%20%20%20%20%20%20%20%20%20%20padding%3A%208%2C%0A%20%20%20%20%20%20%20%20%20%20marginVertical%3A%2010%2C%0A%20%20%20%20%20%20%20%20%7D%7D%0A%20%20%20%20%20%20%2F%3E%0A%0A%20%20%20%20%20%20%3CFlatList%0A%20%20%20%20%20%20%20%20data%3D%7BfilteredAndSorted%7D%0A%20%20%20%20%20%20%20%20keyExtractor%3D%7B%28item%29%20%3D%3E%20item.id%7D%0A%20%20%20%20%20%20%20%20renderItem%3D%7B%28%7B%20item%20%7D%29%20%3D%3E%20%3CRow%20title%3D%7Bitem.title%7D%20%2F%3E%7D%0A%20%20%20%20%20%20%20%20ListEmptyComponent%3D%7B%3CText%3ENo%20items%20found%3C%2FText%3E%7D%0A%20%20%20%20%20%20%20%20initialNumToRender%3D%7B20%7D%0A%20%20%20%20%20%20%20%20windowSize%3D%7B10%7D%0A%20%20%20%20%20%20%2F%3E%0A%20%20%20%20%3C%2FView%3E%0A%20%20%29%3B%0A%7D%0A)** (SDK 54, 필요한 패키지 자동 포함) <button class="snack-embed" type="button">👀 여기서 결과 보기</button>



**🇰🇷 한글 해설**

**API에서 목록 불러오기**. `useEffect`로 마운트될 때 비동기 요청, 결과는 state에 저장 → 그 뒤는 로컬 데이터처럼 정렬/검색 가능.

**모던 베스트 프랙티스 5가지** (원문 bullet 그대로 외우기 좋아요):
1. useEffect **안에 async 함수**를 만들어 호출 (useEffect 콜백 자체를 async로 만들면 안 돼요. cleanup 함수 대신 Promise를 반환하게 되니까)
2. **cleanup 깃발**(`isMounted`)로 언마운트 후 도착한 응답 무시 (2주차 ignore 패턴)
3. **loading, error state** + `response.ok` 확인 (`fetch`는 네트워크 실패에만 reject)
4. 정렬/필터는 `useMemo`
5. 배열 index 대신 **안정적인 key**

코드 흐름:
- `try { await fetch → if (!resp.ok) throw → await resp.json() → setData }`
- `catch { setError('Failed to load data') }`
- `finally { setLoading(false) }` → 성공이든 실패든 **항상** 스피너 끄기.
- `users.map((u) => ({ id: u.id.toString(), title: u.name }))` → API 데이터를 내 목록 모양으로 변환.
- 렌더링: `if (loading) return 스피너;` → `if (error) return 에러;` → 정상 목록. **early return** 패턴.
- 이름 정렬은 `a.title.localeCompare(b.title)` (문자열 비교).

### 📘 Lazy Loading of List Data

The `FlatList` component includes an `onEndReached` property that makes it easy to implement infinite scrolling. This pattern is common in social media feeds, where new content loads automatically as the user scrolls.

To implement lazy loading:

1. Load an initial batch of items
2. Detect when the user scrolls near the bottom
3. Fetch or generate additional items
4. Append them to the existing list

```jsx
<FlatList
  data={items}
  renderItem={...}
  onEndReached={() => {
    if (!loadingMore) {
      loadMoreItems(); // fetch or generate more data
    }
  }}
  onEndReachedThreshold={0.5} // triggers when the end is half a screen away
/>
```

**🇰🇷 한글 해설**

**Lazy loading(지연 로딩) / 무한 스크롤**: 끝까지 내리면 자동으로 더 불러오기(SNS 피드).
- `onEndReached`: 끝에 가까워지면 호출되는 함수.
- `onEndReachedThreshold={0.5}`: 끝까지 **화면 절반** 남았을 때 호출.
- 4단계: 처음 묶음 로드 → 바닥 근처 감지 → 더 가져오기 → 기존 목록 **뒤에 붙이기**.

#### 📘 Best practices for infinite scrolling

* Track a `loadingMore` state to avoid duplicate requests
* Append new items using `setItems(prev => [...prev, ...newItems])`
* Use stable keys to prevent flicker
* Combine with server-side pagination when available

**🇰🇷 한글 해설**

- `loadingMore` state로 **중복 요청 방지**(이미 불러오는 중이면 또 안 부름)
- `setItems(prev => [...prev, ...newItems])` 로 **이어 붙이기**(함수형 + spread)
- 안정적인 key로 깜빡임 방지
- 서버 페이지네이션(pagination, 페이지 단위로 나눠 받기)과 같이 쓰기


---

## 4. 📘 코스노트: Data Lists and Detail Views

<div class="sum" data-kind="read">

**🧭 먼저 한국어로** · 👀 읽고 이해하기 (타이핑 안 해도 돼요)

목록에서 줄을 누르면 상세 화면으로 가는 코스노트예요. 같은 구조를 💻 "Example: List and Detail"에서 쳐 보니까 여기서는 읽기만 해요.

**이 챕터 구성**

- ⏭️ **Introduction**: 목록은 요약, 상세는 전체를 보여 준다는 설명이에요.
- ⏭️ **Example**: 아래 하위 단계들의 큰 그림이에요: 네비게이션 → 목록 화면 → 상세 화면 → 데이터 전달.
- 👀 **Example › Navigation**: Stack 두 개 화면(목록, 상세)을 등록하는 4주차 코드 그대로예요.
- 👀 **Example › List Screen**: 줄을 누르면 navigate("Details", { 데이터 })로 이동해요.
- 👀 **Example › Detail Screen**: route.params에서 데이터를 꺼내서 보여 줘요.
- 👀 **Example › Passing Data Between Screens**: 객체 통째로 넘기기 vs id만 넘기기. 큰 데이터는 id만 넘기는 게 원칙이에요.
- 👀 **Example › Fetching Detail Data**: id만 받은 상세 화면이 직접 fetch하는 방법이에요. 개념만 알아 두세요.
- 👀 **Full Solution (Local Data)**: 지금까지 조각을 합친 완성 코드예요. Snack으로 실행해서 눌러 보기만 하세요.
- 👀 **Full Example (Fetching Remote Data)**: 같은 앱을 API 데이터로 바꾼 버전이에요. 실행해서 흐름만 확인하세요.

</div>

> 원문 출처: https://seneca-ictoer.github.io/WEB530/E-Lists/lists-and-detail-views

### 📘 Introduction

Many mobile apps follow a familiar pattern:

1. Show a **list** of items
2. Let the user **tap** an item
3. Navigate to a **detail view** showing more information

Examples include:

* Email inbox → email detail
* Contacts → contact profile
* Products → product page
* News feed → article view

React Native makes this pattern straightforward using:

* **FlatList** for efficient list rendering
* **Pressable** for touch interactions
* **React Navigation** for screen‑to‑screen navigation

This page shows how to build a simple “List → Detail” flow.

**🇰🇷 한글 해설**

**List → Detail 패턴**: 목록 보여 주기 → 하나를 탭 → 상세 화면. 메일함, 연락처, 쇼핑, 뉴스 모두 이 패턴. 재료 3개: **FlatList**(목록) + **Pressable**(터치) + **React Navigation**(화면 이동).

### 📘 Example



**🇰🇷 한글 해설**

아래 소단원들이 이 패턴을 조각조각 보여 줘요.

#### 📘 Navigation

To navigate between screens, we use the [Stack Navigator](https://seneca-ictoer.github.io/WEB530/D-Navigation/navigating) from React Navigation.

```jsx
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="List" component={ListScreen} />
        <Stack.Screen name="Detail" component={DetailScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
```

**🇰🇷 한글 해설**

4주차 Stack Navigator 그대로. List와 Detail 두 화면 등록, Detail 헤더 제목은 params에서.

#### 📘 List Screen

The list screen displays a list of items using `FlatList`. Each row is a `Pressable` that navigates to the detail screen.

```jsx
import React from 'react';
import { View, Text, FlatList, Pressable, StyleSheet } from 'react-native';

export function ListScreen({ navigation }) {
  const data = new Array(20).fill(null).map((_, id) => ({
    id,
    title: `Item ${id}`,
    description: `This is item number ${id}.`,
  }));

  function openDetail(item) {
    navigation.navigate('Detail', { item });
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={data}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <Pressable style={styles.row} onPress={() => openDetail(item)}>
            <Text style={styles.rowTitle}>{item.title}</Text>
            <Text style={styles.rowSubtitle}>Tap to view details</Text>
          </Pressable>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  row: {
    padding: 20,
    borderBottomWidth: 1,
    borderColor: '#ddd',
  },
  rowTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  rowSubtitle: {
    fontSize: 14,
    color: '#666',
  },
});
```

**🇰🇷 한글 해설**

각 줄을 **Pressable**로 감싸서 `onPress`에 `navigation.navigate('Detail', { item })`. Pressable은 6주차에 자세히.

#### 📘 Detail Screen

The detail screen receives the selected item through `route.params`.

```jsx
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export function DetailScreen({ route }) {
  const { item } = route.params;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{item.title}</Text>
      <Text style={styles.description}>{item.description}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: { fontSize: 28, fontWeight: '700', marginBottom: 10 },
  description: { fontSize: 18, lineHeight: 26 },
});
```

**🇰🇷 한글 해설**

`route.params`에서 item을 꺼내 보여 줘요.

#### 📘 Passing Data Between Screens

React Navigation automatically passes parameters using:

```jsx
navigation.navigate('Detail', { item });
```

The detail screen retrieves them using:

```jsx
const { item } = route.params;
```

You can pass:

* Strings
* Numbers
* Objects
* Arrays
* API results

This makes it easy to show a list of items and then display more information about a selected one.

**🇰🇷 한글 해설**

보내기 `navigate('Detail', { item })`, 받기 `const { item } = route.params;`. 문자열, 숫자, 객체, 배열, API 결과 등 무엇이든 넘길 수 있어요.

#### 📘 Fetching Detail Data

Sometimes you only pass an ID, and the detail screen fetches the rest:

```jsx
navigation.navigate('Detail', { id: item.id });
```

Then in the detail screen:

```jsx
useEffect(() => {
  fetch(`https://example.com/items/${id}`)
    .then((res) => res.json())
    .then(setItem);
}, [id]);
```

This is useful for:

* Product pages
* User profiles
* News articles
* Any data that needs to be loaded on demand

**🇰🇷 한글 해설**

**id만 넘기고 상세 화면이 직접 fetch**하는 방법도 있어요. 상품 페이지, 프로필, 기사처럼 필요할 때 불러오는 데이터에 좋아요.
- 장점: params가 작고, 항상 **최신** 데이터.
- 단점(비용): 상세 화면을 열 때마다 **요청 한 번 더**, 로딩 시간 발생. (Lab 5 Q5 주석으로 쓸 내용!)

### 📘 Full Solution (Local Data)

```jsx
import { View, Text, FlatList, Pressable, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

const Stack = createNativeStackNavigator();

// ----------------------
// List Screen
// ----------------------
function ListScreen({ navigation }) {
  const data = new Array(20).fill(null).map((_, id) => ({
    id,
    title: `Item ${id}`,
    description: `This is the detail view for item ${id}.`,
  }));

  function openDetail(item) {
    navigation.navigate('Detail', { item });
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={data}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <Pressable style={styles.row} onPress={() => openDetail(item)}>
            <Text style={styles.rowTitle}>{item.title}</Text>
            <Text style={styles.rowSubtitle}>Tap to view details</Text>
          </Pressable>
        )}
      />
    </View>
  );
}

// ----------------------
// Detail Screen
// ----------------------
function DetailScreen({ route }) {
  const { item } = route.params;

  return (
    <View style={styles.detailContainer}>
      <Text style={styles.detailTitle}>{item.title}</Text>
      <Text style={styles.detailDescription}>{item.description}</Text>
    </View>
  );
}

// ----------------------
// App Entry
// ----------------------
export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="List" component={ListScreen} />
        <Stack.Screen
          name="Detail"
          component={DetailScreen}
          options={({ route }) => ({
            title: route.params.item.title,
          })}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

// ----------------------
// Styles
// ----------------------
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  row: {
    padding: 20,
    borderBottomWidth: 1,
    borderColor: '#ddd',
  },
  rowTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  rowSubtitle: {
    fontSize: 14,
    color: '#666',
  },
  detailContainer: {
    flex: 1,
    padding: 20,
  },
  detailTitle: {
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 10,
  },
  detailDescription: {
    fontSize: 18,
    lineHeight: 26,
  },
});
```

▶ **[Snack에서 바로 실행하기](https://snack.expo.dev/?name=WEB530%20W5%20Full%20Solution%20%28Local%20Data%29&platform=web&sdkVersion=54.0.0&code=import%20%7B%20View%2C%20Text%2C%20FlatList%2C%20Pressable%2C%20StyleSheet%20%7D%20from%20%27react-native%27%3B%0Aimport%20%7B%20NavigationContainer%20%7D%20from%20%27%40react-navigation%2Fnative%27%3B%0Aimport%20%7B%20createNativeStackNavigator%20%7D%20from%20%27%40react-navigation%2Fnative-stack%27%3B%0A%0Aconst%20Stack%20%3D%20createNativeStackNavigator%28%29%3B%0A%0A%2F%2F%20----------------------%0A%2F%2F%20List%20Screen%0A%2F%2F%20----------------------%0Afunction%20ListScreen%28%7B%20navigation%20%7D%29%20%7B%0A%20%20const%20data%20%3D%20new%20Array%2820%29.fill%28null%29.map%28%28_%2C%20id%29%20%3D%3E%20%28%7B%0A%20%20%20%20id%2C%0A%20%20%20%20title%3A%20%60Item%20%24%7Bid%7D%60%2C%0A%20%20%20%20description%3A%20%60This%20is%20the%20detail%20view%20for%20item%20%24%7Bid%7D.%60%2C%0A%20%20%7D%29%29%3B%0A%0A%20%20function%20openDetail%28item%29%20%7B%0A%20%20%20%20navigation.navigate%28%27Detail%27%2C%20%7B%20item%20%7D%29%3B%0A%20%20%7D%0A%0A%20%20return%20%28%0A%20%20%20%20%3CView%20style%3D%7Bstyles.container%7D%3E%0A%20%20%20%20%20%20%3CFlatList%0A%20%20%20%20%20%20%20%20data%3D%7Bdata%7D%0A%20%20%20%20%20%20%20%20keyExtractor%3D%7B%28item%29%20%3D%3E%20item.id.toString%28%29%7D%0A%20%20%20%20%20%20%20%20renderItem%3D%7B%28%7B%20item%20%7D%29%20%3D%3E%20%28%0A%20%20%20%20%20%20%20%20%20%20%3CPressable%20style%3D%7Bstyles.row%7D%20onPress%3D%7B%28%29%20%3D%3E%20openDetail%28item%29%7D%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%3CText%20style%3D%7Bstyles.rowTitle%7D%3E%7Bitem.title%7D%3C%2FText%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%3CText%20style%3D%7Bstyles.rowSubtitle%7D%3ETap%20to%20view%20details%3C%2FText%3E%0A%20%20%20%20%20%20%20%20%20%20%3C%2FPressable%3E%0A%20%20%20%20%20%20%20%20%29%7D%0A%20%20%20%20%20%20%2F%3E%0A%20%20%20%20%3C%2FView%3E%0A%20%20%29%3B%0A%7D%0A%0A%2F%2F%20----------------------%0A%2F%2F%20Detail%20Screen%0A%2F%2F%20----------------------%0Afunction%20DetailScreen%28%7B%20route%20%7D%29%20%7B%0A%20%20const%20%7B%20item%20%7D%20%3D%20route.params%3B%0A%0A%20%20return%20%28%0A%20%20%20%20%3CView%20style%3D%7Bstyles.detailContainer%7D%3E%0A%20%20%20%20%20%20%3CText%20style%3D%7Bstyles.detailTitle%7D%3E%7Bitem.title%7D%3C%2FText%3E%0A%20%20%20%20%20%20%3CText%20style%3D%7Bstyles.detailDescription%7D%3E%7Bitem.description%7D%3C%2FText%3E%0A%20%20%20%20%3C%2FView%3E%0A%20%20%29%3B%0A%7D%0A%0A%2F%2F%20----------------------%0A%2F%2F%20App%20Entry%0A%2F%2F%20----------------------%0Aexport%20default%20function%20App%28%29%20%7B%0A%20%20return%20%28%0A%20%20%20%20%3CNavigationContainer%3E%0A%20%20%20%20%20%20%3CStack.Navigator%3E%0A%20%20%20%20%20%20%20%20%3CStack.Screen%20name%3D%22List%22%20component%3D%7BListScreen%7D%20%2F%3E%0A%20%20%20%20%20%20%20%20%3CStack.Screen%0A%20%20%20%20%20%20%20%20%20%20name%3D%22Detail%22%0A%20%20%20%20%20%20%20%20%20%20component%3D%7BDetailScreen%7D%0A%20%20%20%20%20%20%20%20%20%20options%3D%7B%28%7B%20route%20%7D%29%20%3D%3E%20%28%7B%0A%20%20%20%20%20%20%20%20%20%20%20%20title%3A%20route.params.item.title%2C%0A%20%20%20%20%20%20%20%20%20%20%7D%29%7D%0A%20%20%20%20%20%20%20%20%2F%3E%0A%20%20%20%20%20%20%3C%2FStack.Navigator%3E%0A%20%20%20%20%3C%2FNavigationContainer%3E%0A%20%20%29%3B%0A%7D%0A%0A%2F%2F%20----------------------%0A%2F%2F%20Styles%0A%2F%2F%20----------------------%0Aconst%20styles%20%3D%20StyleSheet.create%28%7B%0A%20%20container%3A%20%7B%0A%20%20%20%20flex%3A%201%2C%0A%20%20%7D%2C%0A%20%20row%3A%20%7B%0A%20%20%20%20padding%3A%2020%2C%0A%20%20%20%20borderBottomWidth%3A%201%2C%0A%20%20%20%20borderColor%3A%20%27%23ddd%27%2C%0A%20%20%7D%2C%0A%20%20rowTitle%3A%20%7B%0A%20%20%20%20fontSize%3A%2018%2C%0A%20%20%20%20fontWeight%3A%20%27600%27%2C%0A%20%20%7D%2C%0A%20%20rowSubtitle%3A%20%7B%0A%20%20%20%20fontSize%3A%2014%2C%0A%20%20%20%20color%3A%20%27%23666%27%2C%0A%20%20%7D%2C%0A%20%20detailContainer%3A%20%7B%0A%20%20%20%20flex%3A%201%2C%0A%20%20%20%20padding%3A%2020%2C%0A%20%20%7D%2C%0A%20%20detailTitle%3A%20%7B%0A%20%20%20%20fontSize%3A%2028%2C%0A%20%20%20%20fontWeight%3A%20%27700%27%2C%0A%20%20%20%20marginBottom%3A%2010%2C%0A%20%20%7D%2C%0A%20%20detailDescription%3A%20%7B%0A%20%20%20%20fontSize%3A%2018%2C%0A%20%20%20%20lineHeight%3A%2026%2C%0A%20%20%7D%2C%0A%7D%29%3B%0A&dependencies=%40react-navigation%2Fnative%40%5E7.0.0%2C%40react-navigation%2Fnative-stack%40%5E7.0.0%2Creact-native-safe-area-context%40~5.6.0%2Creact-native-screens%40~4.16.0)** (SDK 54, 필요한 패키지 자동 포함) <button class="snack-embed" type="button">👀 여기서 결과 보기</button>



**🇰🇷 한글 해설**

**완성 코드 해설**
- `ListScreen`: 20개 데이터 생성, `openDetail(item)` 함수로 navigate.
- `renderItem`이 `Pressable`(행 스타일 그대로) 안에 제목 + "Tap to view details".
- `DetailScreen`: `const { item } = route.params;` 주의: 이 코드는 params가 없으면 크래시해요. 4주차 규칙대로라면 `route.params ?? {}`로 안전하게.
- 헤더 제목: `options={({ route }) => ({ title: route.params.item.title })}`.

### 📘 Full Example (Fetching Remote Data)

```jsx
import { useEffect, useState } from 'react';
import { View, Text, FlatList, Pressable, StyleSheet, ActivityIndicator } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

const Stack = createNativeStackNavigator();

// ----------------------
// List Screen
// ----------------------
function ListScreen({ navigation }) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch('https://jsonplaceholder.typicode.com/posts')
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then((json) => {
        setData(json);
        setLoading(false);
      })
      .catch((err) => {
        setError('Failed to load data');
        setLoading(false);
      });
  }, []);

  function openDetail(item) {
    navigation.navigate('Detail', { id: item.id });
  }

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
        <Text>Loading posts…</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.center}>
        <Text style={{ color: 'red' }}>{error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={data}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <Pressable style={styles.row} onPress={() => openDetail(item)}>
            <Text style={styles.rowTitle}>{item.title}</Text>
            <Text style={styles.rowSubtitle}>Tap to view details</Text>
          </Pressable>
        )}
      />
    </View>
  );
}

// ----------------------
// Detail Screen
// ----------------------
function DetailScreen({ route }) {
  const { id } = route.params;

  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`https://jsonplaceholder.typicode.com/posts/${id}`)
      .then((res) => res.json())
      .then((json) => {
        setItem(json);
        setLoading(false);
      });
  }, [id]);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
        <Text>Loading details…</Text>
      </View>
    );
  }

  return (
    <View style={styles.detailContainer}>
      <Text style={styles.detailTitle}>{item.title}</Text>
      <Text style={styles.detailDescription}>{item.body}</Text>
    </View>
  );
}

// ----------------------
// App Entry
// ----------------------
export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="List" component={ListScreen} />
        <Stack.Screen name="Detail" component={DetailScreen} options={{ title: 'Post Details' }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

// ----------------------
// Styles
// ----------------------
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  row: {
    padding: 20,
    borderBottomWidth: 1,
    borderColor: '#ddd',
  },
  rowTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  rowSubtitle: {
    fontSize: 14,
    color: '#666',
  },
  detailContainer: {
    flex: 1,
    padding: 20,
  },
  detailTitle: {
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 10,
  },
  detailDescription: {
    fontSize: 18,
    lineHeight: 26,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
```

▶ **[Snack에서 바로 실행하기](https://snack.expo.dev/?name=WEB530%20W5%20Full%20Example%20%28Fetching%20Remote%20Data%29&platform=web&sdkVersion=54.0.0&code=import%20%7B%20useEffect%2C%20useState%20%7D%20from%20%27react%27%3B%0Aimport%20%7B%20View%2C%20Text%2C%20FlatList%2C%20Pressable%2C%20StyleSheet%2C%20ActivityIndicator%20%7D%20from%20%27react-native%27%3B%0Aimport%20%7B%20NavigationContainer%20%7D%20from%20%27%40react-navigation%2Fnative%27%3B%0Aimport%20%7B%20createNativeStackNavigator%20%7D%20from%20%27%40react-navigation%2Fnative-stack%27%3B%0A%0Aconst%20Stack%20%3D%20createNativeStackNavigator%28%29%3B%0A%0A%2F%2F%20----------------------%0A%2F%2F%20List%20Screen%0A%2F%2F%20----------------------%0Afunction%20ListScreen%28%7B%20navigation%20%7D%29%20%7B%0A%20%20const%20%5Bdata%2C%20setData%5D%20%3D%20useState%28%5B%5D%29%3B%0A%20%20const%20%5Bloading%2C%20setLoading%5D%20%3D%20useState%28true%29%3B%0A%20%20const%20%5Berror%2C%20setError%5D%20%3D%20useState%28null%29%3B%0A%0A%20%20useEffect%28%28%29%20%3D%3E%20%7B%0A%20%20%20%20fetch%28%27https%3A%2F%2Fjsonplaceholder.typicode.com%2Fposts%27%29%0A%20%20%20%20%20%20.then%28%28res%29%20%3D%3E%20%7B%0A%20%20%20%20%20%20%20%20if%20%28%21res.ok%29%20throw%20new%20Error%28%60HTTP%20%24%7Bres.status%7D%60%29%3B%0A%20%20%20%20%20%20%20%20return%20res.json%28%29%3B%0A%20%20%20%20%20%20%7D%29%0A%20%20%20%20%20%20.then%28%28json%29%20%3D%3E%20%7B%0A%20%20%20%20%20%20%20%20setData%28json%29%3B%0A%20%20%20%20%20%20%20%20setLoading%28false%29%3B%0A%20%20%20%20%20%20%7D%29%0A%20%20%20%20%20%20.catch%28%28err%29%20%3D%3E%20%7B%0A%20%20%20%20%20%20%20%20setError%28%27Failed%20to%20load%20data%27%29%3B%0A%20%20%20%20%20%20%20%20setLoading%28false%29%3B%0A%20%20%20%20%20%20%7D%29%3B%0A%20%20%7D%2C%20%5B%5D%29%3B%0A%0A%20%20function%20openDetail%28item%29%20%7B%0A%20%20%20%20navigation.navigate%28%27Detail%27%2C%20%7B%20id%3A%20item.id%20%7D%29%3B%0A%20%20%7D%0A%0A%20%20if%20%28loading%29%20%7B%0A%20%20%20%20return%20%28%0A%20%20%20%20%20%20%3CView%20style%3D%7Bstyles.center%7D%3E%0A%20%20%20%20%20%20%20%20%3CActivityIndicator%20size%3D%22large%22%20%2F%3E%0A%20%20%20%20%20%20%20%20%3CText%3ELoading%20posts%E2%80%A6%3C%2FText%3E%0A%20%20%20%20%20%20%3C%2FView%3E%0A%20%20%20%20%29%3B%0A%20%20%7D%0A%0A%20%20if%20%28error%29%20%7B%0A%20%20%20%20return%20%28%0A%20%20%20%20%20%20%3CView%20style%3D%7Bstyles.center%7D%3E%0A%20%20%20%20%20%20%20%20%3CText%20style%3D%7B%7B%20color%3A%20%27red%27%20%7D%7D%3E%7Berror%7D%3C%2FText%3E%0A%20%20%20%20%20%20%3C%2FView%3E%0A%20%20%20%20%29%3B%0A%20%20%7D%0A%0A%20%20return%20%28%0A%20%20%20%20%3CView%20style%3D%7Bstyles.container%7D%3E%0A%20%20%20%20%20%20%3CFlatList%0A%20%20%20%20%20%20%20%20data%3D%7Bdata%7D%0A%20%20%20%20%20%20%20%20keyExtractor%3D%7B%28item%29%20%3D%3E%20item.id.toString%28%29%7D%0A%20%20%20%20%20%20%20%20renderItem%3D%7B%28%7B%20item%20%7D%29%20%3D%3E%20%28%0A%20%20%20%20%20%20%20%20%20%20%3CPressable%20style%3D%7Bstyles.row%7D%20onPress%3D%7B%28%29%20%3D%3E%20openDetail%28item%29%7D%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%3CText%20style%3D%7Bstyles.rowTitle%7D%3E%7Bitem.title%7D%3C%2FText%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%3CText%20style%3D%7Bstyles.rowSubtitle%7D%3ETap%20to%20view%20details%3C%2FText%3E%0A%20%20%20%20%20%20%20%20%20%20%3C%2FPressable%3E%0A%20%20%20%20%20%20%20%20%29%7D%0A%20%20%20%20%20%20%2F%3E%0A%20%20%20%20%3C%2FView%3E%0A%20%20%29%3B%0A%7D%0A%0A%2F%2F%20----------------------%0A%2F%2F%20Detail%20Screen%0A%2F%2F%20----------------------%0Afunction%20DetailScreen%28%7B%20route%20%7D%29%20%7B%0A%20%20const%20%7B%20id%20%7D%20%3D%20route.params%3B%0A%0A%20%20const%20%5Bitem%2C%20setItem%5D%20%3D%20useState%28null%29%3B%0A%20%20const%20%5Bloading%2C%20setLoading%5D%20%3D%20useState%28true%29%3B%0A%0A%20%20useEffect%28%28%29%20%3D%3E%20%7B%0A%20%20%20%20fetch%28%60https%3A%2F%2Fjsonplaceholder.typicode.com%2Fposts%2F%24%7Bid%7D%60%29%0A%20%20%20%20%20%20.then%28%28res%29%20%3D%3E%20res.json%28%29%29%0A%20%20%20%20%20%20.then%28%28json%29%20%3D%3E%20%7B%0A%20%20%20%20%20%20%20%20setItem%28json%29%3B%0A%20%20%20%20%20%20%20%20setLoading%28false%29%3B%0A%20%20%20%20%20%20%7D%29%3B%0A%20%20%7D%2C%20%5Bid%5D%29%3B%0A%0A%20%20if%20%28loading%29%20%7B%0A%20%20%20%20return%20%28%0A%20%20%20%20%20%20%3CView%20style%3D%7Bstyles.center%7D%3E%0A%20%20%20%20%20%20%20%20%3CActivityIndicator%20size%3D%22large%22%20%2F%3E%0A%20%20%20%20%20%20%20%20%3CText%3ELoading%20details%E2%80%A6%3C%2FText%3E%0A%20%20%20%20%20%20%3C%2FView%3E%0A%20%20%20%20%29%3B%0A%20%20%7D%0A%0A%20%20return%20%28%0A%20%20%20%20%3CView%20style%3D%7Bstyles.detailContainer%7D%3E%0A%20%20%20%20%20%20%3CText%20style%3D%7Bstyles.detailTitle%7D%3E%7Bitem.title%7D%3C%2FText%3E%0A%20%20%20%20%20%20%3CText%20style%3D%7Bstyles.detailDescription%7D%3E%7Bitem.body%7D%3C%2FText%3E%0A%20%20%20%20%3C%2FView%3E%0A%20%20%29%3B%0A%7D%0A%0A%2F%2F%20----------------------%0A%2F%2F%20App%20Entry%0A%2F%2F%20----------------------%0Aexport%20default%20function%20App%28%29%20%7B%0A%20%20return%20%28%0A%20%20%20%20%3CNavigationContainer%3E%0A%20%20%20%20%20%20%3CStack.Navigator%3E%0A%20%20%20%20%20%20%20%20%3CStack.Screen%20name%3D%22List%22%20component%3D%7BListScreen%7D%20%2F%3E%0A%20%20%20%20%20%20%20%20%3CStack.Screen%20name%3D%22Detail%22%20component%3D%7BDetailScreen%7D%20options%3D%7B%7B%20title%3A%20%27Post%20Details%27%20%7D%7D%20%2F%3E%0A%20%20%20%20%20%20%3C%2FStack.Navigator%3E%0A%20%20%20%20%3C%2FNavigationContainer%3E%0A%20%20%29%3B%0A%7D%0A%0A%2F%2F%20----------------------%0A%2F%2F%20Styles%0A%2F%2F%20----------------------%0Aconst%20styles%20%3D%20StyleSheet.create%28%7B%0A%20%20container%3A%20%7B%0A%20%20%20%20flex%3A%201%2C%0A%20%20%7D%2C%0A%20%20row%3A%20%7B%0A%20%20%20%20padding%3A%2020%2C%0A%20%20%20%20borderBottomWidth%3A%201%2C%0A%20%20%20%20borderColor%3A%20%27%23ddd%27%2C%0A%20%20%7D%2C%0A%20%20rowTitle%3A%20%7B%0A%20%20%20%20fontSize%3A%2018%2C%0A%20%20%20%20fontWeight%3A%20%27600%27%2C%0A%20%20%7D%2C%0A%20%20rowSubtitle%3A%20%7B%0A%20%20%20%20fontSize%3A%2014%2C%0A%20%20%20%20color%3A%20%27%23666%27%2C%0A%20%20%7D%2C%0A%20%20detailContainer%3A%20%7B%0A%20%20%20%20flex%3A%201%2C%0A%20%20%20%20padding%3A%2020%2C%0A%20%20%7D%2C%0A%20%20detailTitle%3A%20%7B%0A%20%20%20%20fontSize%3A%2028%2C%0A%20%20%20%20fontWeight%3A%20%27700%27%2C%0A%20%20%20%20marginBottom%3A%2010%2C%0A%20%20%7D%2C%0A%20%20detailDescription%3A%20%7B%0A%20%20%20%20fontSize%3A%2018%2C%0A%20%20%20%20lineHeight%3A%2026%2C%0A%20%20%7D%2C%0A%20%20center%3A%20%7B%0A%20%20%20%20flex%3A%201%2C%0A%20%20%20%20justifyContent%3A%20%27center%27%2C%0A%20%20%20%20alignItems%3A%20%27center%27%2C%0A%20%20%7D%2C%0A%7D%29%3B%0A&dependencies=%40react-navigation%2Fnative%40%5E7.0.0%2C%40react-navigation%2Fnative-stack%40%5E7.0.0%2Creact-native-safe-area-context%40~5.6.0%2Creact-native-screens%40~4.16.0)** (SDK 54, 필요한 패키지 자동 포함) <button class="snack-embed" type="button">👀 여기서 결과 보기</button>



**🇰🇷 한글 해설**

**완성 코드 해설**: 위 패턴 + 목록을 API(jsonplaceholder)에서 받아 오기. loading/error 처리와 Pressable → Detail 흐름이 한 파일에 다 들어 있어요. 시험 직전 복습용으로 이 코드를 처음부터 끝까지 따라 쳐 보세요.


---

## 5. 📘 코스노트: Pull to Refresh

<div class="sum" data-kind="read">

**🧭 먼저 한국어로** · 👀 읽고 이해하기 (타이핑 안 해도 돼요)

당겨서 새로고침 코스노트예요. 시험용 버전은 💻 "Example: Pull to Refresh"에서 쳐 봐요.

**이 챕터 구성**

- ⏭️ **Introduction**: 목록을 아래로 당기면 다시 불러오는 익숙한 기능이에요.
- 👀 **How Pull to Refresh Works**: FlatList에 refreshing(지금 새로고침 중인지)과 onRefresh(당겼을 때 할 일) 두 prop만 주면 돼요.
- 👀 **Basic Pull‑to‑Refresh Example**: 가짜 데이터로 만든 가장 작은 예제예요. 휴대폰(Expo Go)에서 실행해서 당겨 보세요.
- 👀 **Pull to Refresh with API Data**: API를 다시 fetch하는 버전이에요. 💻 예제와 거의 같아서 읽기만 해요.
- ⏭️ **Best Practices**: 새로고침 중 중복 요청 막기, 스크롤 위치 유지 같은 팁이에요.

</div>

> 원문 출처: https://seneca-ictoer.github.io/WEB530/E-Lists/pull-to-refresh

### 📘 Introduction

Mobile users expect lists to stay up‑to‑date. Whether checking email, refreshing a news feed, or reloading product data, the most common pattern is **pull to refresh**: the user drags downward at the top of a list to trigger a reload.

React Native provides built‑in support for this pattern through the `FlatList` component. You do **not** need to detect gestures manually - the list handles the pull gesture for you.

**🇰🇷 한글 해설**

**Pull to refresh(당겨서 새로고침)**: 목록 맨 위에서 아래로 끌어당기면 다시 불러오기. FlatList에 **내장**돼 있어서 제스처를 직접 감지할 필요 없어요.

### 📘 How Pull to Refresh Works

`FlatList` exposes two props that enable pull‑to‑refresh:

1. `refreshing` - A boolean that tells React Native whether the list is currently refreshing. When `true`, the list shows a spinner at the top.
2. `onRefresh` - A function that is called when the user performs the pull‑to‑refresh gesture.

Together, they look like this:

```jsx
<FlatList data={items} refreshing={refreshing} onRefresh={loadData} />
```

React Native handles the gesture. You handle the data.

💡 Pulling to refresh needs a touch screen, so it doesn't work in the web preview of the examples below. Run an example and switch the preview to **iOS** or **Android**, or choose **My Device** and open it in Expo Go.

**🇰🇷 한글 해설**

props 2개:
1. `refreshing` (boolean): true면 맨 위에 스피너.
2. `onRefresh` (함수): 사용자가 당기면 호출.
원문 명언: **"React Native handles the gesture. You handle the data."** (제스처는 RN이, 데이터는 내가)
💡 터치가 필요해서 **Web 미리보기에서는 안 돼요.** iOS/Android 미리보기나 Expo Go 폰에서.

### 📘 Basic Pull‑to‑Refresh Example

The example below shows how to refresh a list of items using a simulated network request.

```jsx
import { useState } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';

export default function App() {
  const [items, setItems] = useState(['Apple', 'Banana', 'Cherry']);
  const [refreshing, setRefreshing] = useState(false);

  function loadData() {
    setRefreshing(true);

    // Simulate a network request
    setTimeout(() => {
      setItems((prev) => [...prev, 'New Item ' + (prev.length + 1)]);
      setRefreshing(false);
    }, 1200);
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={items}
        keyExtractor={(item) => item}
        refreshing={refreshing}
        onRefresh={loadData}
        renderItem={({ item }) => (
          <View style={styles.row}>
            <Text style={styles.text}>{item}</Text>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingTop: 60 },
  row: {
    padding: 20,
    borderBottomWidth: 1,
    borderColor: '#ddd',
  },
  text: { fontSize: 18 },
});
```

▶ **[Snack에서 바로 실행하기](https://snack.expo.dev/?name=WEB530%20W5%20Basic%20Pull%E2%80%91to%E2%80%91Refresh%20Example&platform=web&sdkVersion=54.0.0&code=import%20%7B%20useState%20%7D%20from%20%27react%27%3B%0Aimport%20%7B%20View%2C%20Text%2C%20FlatList%2C%20StyleSheet%20%7D%20from%20%27react-native%27%3B%0A%0Aexport%20default%20function%20App%28%29%20%7B%0A%20%20const%20%5Bitems%2C%20setItems%5D%20%3D%20useState%28%5B%27Apple%27%2C%20%27Banana%27%2C%20%27Cherry%27%5D%29%3B%0A%20%20const%20%5Brefreshing%2C%20setRefreshing%5D%20%3D%20useState%28false%29%3B%0A%0A%20%20function%20loadData%28%29%20%7B%0A%20%20%20%20setRefreshing%28true%29%3B%0A%0A%20%20%20%20%2F%2F%20Simulate%20a%20network%20request%0A%20%20%20%20setTimeout%28%28%29%20%3D%3E%20%7B%0A%20%20%20%20%20%20setItems%28%28prev%29%20%3D%3E%20%5B...prev%2C%20%27New%20Item%20%27%20%2B%20%28prev.length%20%2B%201%29%5D%29%3B%0A%20%20%20%20%20%20setRefreshing%28false%29%3B%0A%20%20%20%20%7D%2C%201200%29%3B%0A%20%20%7D%0A%0A%20%20return%20%28%0A%20%20%20%20%3CView%20style%3D%7Bstyles.container%7D%3E%0A%20%20%20%20%20%20%3CFlatList%0A%20%20%20%20%20%20%20%20data%3D%7Bitems%7D%0A%20%20%20%20%20%20%20%20keyExtractor%3D%7B%28item%29%20%3D%3E%20item%7D%0A%20%20%20%20%20%20%20%20refreshing%3D%7Brefreshing%7D%0A%20%20%20%20%20%20%20%20onRefresh%3D%7BloadData%7D%0A%20%20%20%20%20%20%20%20renderItem%3D%7B%28%7B%20item%20%7D%29%20%3D%3E%20%28%0A%20%20%20%20%20%20%20%20%20%20%3CView%20style%3D%7Bstyles.row%7D%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%3CText%20style%3D%7Bstyles.text%7D%3E%7Bitem%7D%3C%2FText%3E%0A%20%20%20%20%20%20%20%20%20%20%3C%2FView%3E%0A%20%20%20%20%20%20%20%20%29%7D%0A%20%20%20%20%20%20%2F%3E%0A%20%20%20%20%3C%2FView%3E%0A%20%20%29%3B%0A%7D%0A%0Aconst%20styles%20%3D%20StyleSheet.create%28%7B%0A%20%20container%3A%20%7B%20flex%3A%201%2C%20paddingTop%3A%2060%20%7D%2C%0A%20%20row%3A%20%7B%0A%20%20%20%20padding%3A%2020%2C%0A%20%20%20%20borderBottomWidth%3A%201%2C%0A%20%20%20%20borderColor%3A%20%27%23ddd%27%2C%0A%20%20%7D%2C%0A%20%20text%3A%20%7B%20fontSize%3A%2018%20%7D%2C%0A%7D%29%3B%0A)** (SDK 54, 필요한 패키지 자동 포함) <button class="snack-embed" type="button">👀 여기서 결과 보기</button>



**🇰🇷 한글 해설**

**코드 해설**: `onRefresh`에서 `setRefreshing(true)` → (가짜 네트워크 대기) → 데이터 갱신 → `setRefreshing(false)`. 스피너를 켜고 끄는 건 **내 책임**.

### 📘 Pull to Refresh with API Data

Pull‑to‑refresh becomes most useful when combined with remote data. Here is a version that fetches posts from an API and reloads them when the user pulls down.

```jsx
import { useState, useEffect } from 'react';
import { View, Text, FlatList, ActivityIndicator, StyleSheet } from 'react-native';

export default function App() {
  const [posts, setPosts] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);

  function loadPosts() {
    return fetch('https://jsonplaceholder.typicode.com/posts')
      .then((res) => res.json())
      .then((json) => setPosts(json));
  }

  useEffect(() => {
    // finally() runs after success or failure, so loading always ends.
    loadPosts().finally(() => setLoading(false));
  }, []);

  function refresh() {
    setRefreshing(true);
    loadPosts().finally(() => setRefreshing(false));
  }

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
        <Text>Loading posts…</Text>
      </View>
    );
  }

  return (
    <FlatList
      style={styles.container}
      data={posts}
      keyExtractor={(item) => item.id.toString()}
      refreshing={refreshing}
      onRefresh={refresh}
      renderItem={({ item }) => (
        <View style={styles.row}>
          <Text style={styles.title}>{item.title}</Text>
          <Text style={styles.body}>{item.body}</Text>
        </View>
      )}
    />
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingTop: 60 },
  row: {
    padding: 20,
    borderBottomWidth: 1,
    borderColor: '#ddd',
  },
  title: { fontSize: 18, fontWeight: '600' },
  body: { fontSize: 14, color: '#555', marginTop: 4 },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
```

▶ **[Snack에서 바로 실행하기](https://snack.expo.dev/?name=WEB530%20W5%20Pull%20to%20Refresh%20with%20API%20Data&platform=web&sdkVersion=54.0.0&code=import%20%7B%20useState%2C%20useEffect%20%7D%20from%20%27react%27%3B%0Aimport%20%7B%20View%2C%20Text%2C%20FlatList%2C%20ActivityIndicator%2C%20StyleSheet%20%7D%20from%20%27react-native%27%3B%0A%0Aexport%20default%20function%20App%28%29%20%7B%0A%20%20const%20%5Bposts%2C%20setPosts%5D%20%3D%20useState%28%5B%5D%29%3B%0A%20%20const%20%5Brefreshing%2C%20setRefreshing%5D%20%3D%20useState%28false%29%3B%0A%20%20const%20%5Bloading%2C%20setLoading%5D%20%3D%20useState%28true%29%3B%0A%0A%20%20function%20loadPosts%28%29%20%7B%0A%20%20%20%20return%20fetch%28%27https%3A%2F%2Fjsonplaceholder.typicode.com%2Fposts%27%29%0A%20%20%20%20%20%20.then%28%28res%29%20%3D%3E%20res.json%28%29%29%0A%20%20%20%20%20%20.then%28%28json%29%20%3D%3E%20setPosts%28json%29%29%3B%0A%20%20%7D%0A%0A%20%20useEffect%28%28%29%20%3D%3E%20%7B%0A%20%20%20%20%2F%2F%20finally%28%29%20runs%20after%20success%20or%20failure%2C%20so%20loading%20always%20ends.%0A%20%20%20%20loadPosts%28%29.finally%28%28%29%20%3D%3E%20setLoading%28false%29%29%3B%0A%20%20%7D%2C%20%5B%5D%29%3B%0A%0A%20%20function%20refresh%28%29%20%7B%0A%20%20%20%20setRefreshing%28true%29%3B%0A%20%20%20%20loadPosts%28%29.finally%28%28%29%20%3D%3E%20setRefreshing%28false%29%29%3B%0A%20%20%7D%0A%0A%20%20if%20%28loading%29%20%7B%0A%20%20%20%20return%20%28%0A%20%20%20%20%20%20%3CView%20style%3D%7Bstyles.center%7D%3E%0A%20%20%20%20%20%20%20%20%3CActivityIndicator%20size%3D%22large%22%20%2F%3E%0A%20%20%20%20%20%20%20%20%3CText%3ELoading%20posts%E2%80%A6%3C%2FText%3E%0A%20%20%20%20%20%20%3C%2FView%3E%0A%20%20%20%20%29%3B%0A%20%20%7D%0A%0A%20%20return%20%28%0A%20%20%20%20%3CFlatList%0A%20%20%20%20%20%20style%3D%7Bstyles.container%7D%0A%20%20%20%20%20%20data%3D%7Bposts%7D%0A%20%20%20%20%20%20keyExtractor%3D%7B%28item%29%20%3D%3E%20item.id.toString%28%29%7D%0A%20%20%20%20%20%20refreshing%3D%7Brefreshing%7D%0A%20%20%20%20%20%20onRefresh%3D%7Brefresh%7D%0A%20%20%20%20%20%20renderItem%3D%7B%28%7B%20item%20%7D%29%20%3D%3E%20%28%0A%20%20%20%20%20%20%20%20%3CView%20style%3D%7Bstyles.row%7D%3E%0A%20%20%20%20%20%20%20%20%20%20%3CText%20style%3D%7Bstyles.title%7D%3E%7Bitem.title%7D%3C%2FText%3E%0A%20%20%20%20%20%20%20%20%20%20%3CText%20style%3D%7Bstyles.body%7D%3E%7Bitem.body%7D%3C%2FText%3E%0A%20%20%20%20%20%20%20%20%3C%2FView%3E%0A%20%20%20%20%20%20%29%7D%0A%20%20%20%20%2F%3E%0A%20%20%29%3B%0A%7D%0A%0Aconst%20styles%20%3D%20StyleSheet.create%28%7B%0A%20%20container%3A%20%7B%20flex%3A%201%2C%20paddingTop%3A%2060%20%7D%2C%0A%20%20row%3A%20%7B%0A%20%20%20%20padding%3A%2020%2C%0A%20%20%20%20borderBottomWidth%3A%201%2C%0A%20%20%20%20borderColor%3A%20%27%23ddd%27%2C%0A%20%20%7D%2C%0A%20%20title%3A%20%7B%20fontSize%3A%2018%2C%20fontWeight%3A%20%27600%27%20%7D%2C%0A%20%20body%3A%20%7B%20fontSize%3A%2014%2C%20color%3A%20%27%23555%27%2C%20marginTop%3A%204%20%7D%2C%0A%20%20center%3A%20%7B%0A%20%20%20%20flex%3A%201%2C%0A%20%20%20%20justifyContent%3A%20%27center%27%2C%0A%20%20%20%20alignItems%3A%20%27center%27%2C%0A%20%20%7D%2C%0A%7D%29%3B%0A)** (SDK 54, 필요한 패키지 자동 포함) <button class="snack-embed" type="button">👀 여기서 결과 보기</button>



**🇰🇷 한글 해설**

**코드 해설**: 같은 패턴인데 실제 API(posts)를 다시 fetch. 처음 로드는 useEffect, 수동 새로고침은 onRefresh.

### 📘 Best Practices

1. Keep refresh actions fast - Users expect refresh to complete quickly. If your API is slow, show a spinner and consider caching.
2. Avoid refreshing on every screen load - Use pull‑to‑refresh for manual reloads. Use `useEffect` for initial loads.
3. Do not modify `refreshing` directly - Always set it to `true` before loading and `false` after.
4. Keep the UI responsive - Never block the UI thread. Use async functions or promises.
5. Combine with pagination if needed - Pull‑to‑refresh reloads the top of the list. Pagination loads more items at the bottom.

**🇰🇷 한글 해설**

1. 빠르게. 느리면 스피너 + 캐싱 고려.
2. 화면 열 때마다 새로고침 X. **첫 로드는 useEffect, 수동은 pull to refresh**.
3. `refreshing`을 직접 수정 X. 로드 전 true, 후 false로 **set**.
4. UI 스레드를 막지 않기(async 사용).
5. 필요하면 페이지네이션과 같이(새로고침은 위쪽, 페이지네이션은 아래쪽).


---

## 6. 💻 인클래스 예제: Week 5.1 - Notes and Examples

<div class="sum" data-kind="type">

**🧭 먼저 한국어로** · ⌨️ Snack에서 직접 쳐 보기

교수님이 수업에서 라이브 코딩한 순서예요. 이번 주에서 가장 중요한 부분이고, 아래 ⌨️ 표시된 곳은 Snack을 새로 열고 처음부터 직접 쳐 보세요. 시험 코딩 문제가 이 모양으로 나와요.

**이 챕터 구성**

- ⏭️ **React Native Playground**: 예제에 필요한 패키지와 데이터(jsonplaceholder posts) 안내예요.
- 👀 **Why Lists?**: 좋은 목록의 디자인 원칙이에요. 객관식, 서술 문제로 나올 수 있어서 읽어 두세요.
- ⌨️ **[Example: FlatList](#practice-1)**: 빈 Snack에서 과일 목록을 FlatList로 그려 보세요. renderItem에서 ({ item }) 구조분해, keyExtractor는 문자열, 컨테이너 flex: 1이 시험 단골 실수 포인트예요. (⌨️ 과일 배열 + FlatList(data, renderItem({ item }), keyExtractor) + flex: 1 컨테이너)
- ⌨️ **Example: Sorting and Filtering**: 앞의 FlatList 코드에 정렬 버튼과 검색창을 단계별로 붙여요. Step 1부터 3까지 이어서 직접 쳐 보세요.
- ⌨️ **[Example: Sorting and Filtering › Step 1 - Sort with a Button](#practice-2)**: state는 방향 하나, 정렬된 배열은 매번 계산해요. 복사([...]) 후 sort가 포인트. (⌨️ ascending state + [...fruits].sort(localeCompare) + 정렬 버튼)
- ⌨️ **[Example: Sorting and Filtering › Step 2 - Filter with a TextInput](#practice-3)**: 검색어로 먼저 filter하고 그다음 sort해요. (⌨️ query state + TextInput + filter 다음 sort)
- ⌨️ **[Example: Sorting and Filtering › Step 3 - Show an Empty State](#practice-4)**: 검색 결과가 없을 때 메시지를 보여 줘요. (⌨️ ListEmptyComponent 추가)
- 👀 **Example: Sorting and Filtering › Finished Code**: 내가 친 코드와 비교해 보는 완성본이에요.
- ⌨️ **Example: Fetching List Data**: API에서 posts를 받아 오면서 로딩, 에러, 빈 목록을 모두 처리해요. Test 3 코딩 문제의 핵심 뼈대예요.
- ⌨️ **[Example: Fetching List Data › Starter Code](#practice-5)**: 여기서부터 Snack에 쳐서 시작해요. fetch → res.json() → setPosts 흐름. (⌨️ posts state + useEffect에서 fetch + FlatList (시작 코드))
- ⌨️ **[Example: Fetching List Data › Step 1 - Show a Spinner While Loading](#practice-6)**: ActivityIndicator와 early return 패턴. (⌨️ loading state(true로 시작) + finally에서 false + early return 스피너)
- ⌨️ **[Example: Fetching List Data › Step 2 - Handle Errors](#practice-7)**: fetch는 404여도 reject 안 해서 res.ok를 직접 확인해야 해요. 시험 최다 함정. (⌨️ error state + if (!res.ok) throw + catch 메시지 + Try Again 버튼)
- ⌨️ **[Example: Fetching List Data › Step 3 - Show an Empty State](#practice-8)**: 빈 응답도 사용자에게 알려 줘요. (⌨️ ListEmptyComponent + ?userId=99로 빈 목록 테스트)
- 👀 **Example: Fetching List Data › Finished Code**: 시험 직전에 다시 볼 완성본이에요. 내 코드와 비교하세요.
- ⌨️ **Example: List and Detail**: 앞의 Fetching 코드를 Stack에 넣고 줄을 누르면 상세로 가게 만들어요. 4주차 + 5주차 합체 문제라 꼭 쳐 보세요.
- ⌨️ **[Example: List and Detail › Step 1 - Put the List in a Stack](#practice-9)**: 화면 컴포넌트와 앱 루트를 나누는 연습. (⌨️ MyApp → PostsScreen 이름 바꾸고 NavigationContainer + Stack 감싸기)
- ⌨️ **[Example: List and Detail › Step 2 - Make Each Row Tappable](#practice-10)**: numberOfLines={1}로 미리보기 한 줄. (⌨️ 줄을 Pressable로 감싸고 navigate("Details", { post: item }))
- ⌨️ **[Example: List and Detail › Step 3 - Add the Details Screen](#practice-11)**: 넘겨받은 데이터를 보여 줘요. (⌨️ DetailsScreen에서 const { post } = route.params)
- 👀 **Example: List and Detail › Finished Code**: 4주차와 5주차가 합쳐진 완성본이에요. 비교용.
- ⌨️ **Example: Pull to Refresh**: 앞 코드에 당겨서 새로고침을 붙여요. 휴대폰 Expo Go에서 확인하세요(Web은 안 돼요).
- ⌨️ **[Example: Pull to Refresh › Step 1 - Track the Refresh](#practice-12)**: loading과 refreshing을 따로 두는 이유가 Lab 5 Q6에 나와요. (⌨️ refreshing state + refresh 함수(true → loadPosts → finally false))
- ⌨️ **[Example: Pull to Refresh › Step 2 - Wire Up the List](#practice-13)**: prop 두 개면 끝. (⌨️ FlatList에 refreshing, onRefresh 연결)
- ⌨️ **[Example: Pull to Refresh › Step 3 - Prove It Reloaded](#practice-14)**: 목록과 같이 스크롤되는 헤더. (⌨️ updated 시각 state + ListHeaderComponent로 표시)
- 👀 **Example: Pull to Refresh › Finished PostsScreen**: state 5개짜리 최종본이에요. 비교용.

</div>

> 원문 출처: github.com/nick-romanidis/web530-2267-nsa  week-05.1-notes.md

### 💻 React Native Playground

React Native Playground (Snack)
_Use this for the examples. Modify App.js_
(https://snack.expo.dev)

- Keep Snack on SDK 54 (the default). SDK 55 still fails to load `react-native-screens`, so the navigation examples do not run on it.
- The first three examples only need `react-native`. The List and Detail example adds React Navigation, so replace the contents of `package.json` before that one. It is the Week 4 file with the tab, drawer and Jotai packages removed.

_package.json_

```json
{
  "dependencies": {
    "@react-navigation/native": "^7.0.0",
    "@react-navigation/native-stack": "^7.0.0",
    "react-native-screens": "~4.16.0",
    "react-native-safe-area-context": "~5.6.0"
  }
}
```

- The fetch examples load `https://jsonplaceholder.typicode.com/posts`, a free fake API that returns 100 posts. Open it in a browser tab first so everyone sees the shape of the data: `userId`, `id`, `title`, `body`.

**🇰🇷 한글 해설**

처음 세 예제는 `react-native`만 필요. List and Detail 예제부터 React Navigation 패키지가 필요해요(Snack 링크에 자동 포함). 데이터는 jsonplaceholder의 가짜 posts 100개(`userId`, `id`, `title`, `body`). 브라우저에서 주소를 열어 데이터 모양을 먼저 보세요.

### 💻 Why Lists?

- Most mobile apps are list-driven: messages, contacts, products, posts, notifications.
- A `ScrollView` with `.map()` from Week 3 renders every child at once. Fine for a page of content, a problem for a thousand rows.
- `FlatList` is the list component. It only renders the rows that are on screen plus a small buffer (windowing), and it reuses row components as you scroll (recycling).
- Each item becomes a row. Keep rows consistent: a clear hierarchy (title, subtitle), touch-friendly spacing, and visual separation (a border or a card). A row that leads somewhere should look tappable.

**🇰🇷 한글 해설**

**목록 디자인 원칙**: 줄마다 일관되게. 분명한 위계(제목, 부제목), 손가락으로 누르기 편한 간격, 시각적 구분(테두리나 카드). 어딘가로 이동하는 줄은 **눌러질 것처럼 보여야** 해요.

### 💻 Example: FlatList

- Show a list of fruit. Replace everything in `App.js`.


<p class="typeit" id="practice-1">⌨️ <b>이 코드는 Snack에서 직접 쳐 보세요</b>: 과일 배열 + FlatList(data, renderItem({ item }), keyExtractor) + flex: 1 컨테이너</p>

```jsx
import { View, Text, FlatList, StyleSheet } from "react-native";

const fruits = [
  { id: "1", name: "Apple", color: "Red" },
  { id: "2", name: "Cherry", color: "Red" },
  { id: "3", name: "Banana", color: "Yellow" },
  { id: "4", name: "Grape", color: "Purple" },
  { id: "5", name: "Lemon", color: "Yellow" },
  { id: "6", name: "Kiwi", color: "Green" },
  { id: "7", name: "Orange", color: "Orange" },
  { id: "8", name: "Blueberry", color: "Blue" },
];

export default function MyApp() {
  return (
    <View style={styles.container}>
      <FlatList
        data={fruits}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.row}>
            <Text style={styles.title}>{item.name}</Text>
            <Text style={styles.subtitle}>{item.color}</Text>
          </View>
        )}
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
  },
  title: { fontSize: 18, fontWeight: "600" },
  subtitle: { fontSize: 14, color: "#666" },
});
```

▶ **[Snack에서 바로 실행하기](https://snack.expo.dev/?name=WEB530%20W5%20Example%3A%20FlatList&platform=web&sdkVersion=54.0.0&code=import%20%7B%20View%2C%20Text%2C%20FlatList%2C%20StyleSheet%20%7D%20from%20%22react-native%22%3B%0A%0Aconst%20fruits%20%3D%20%5B%0A%20%20%7B%20id%3A%20%221%22%2C%20name%3A%20%22Apple%22%2C%20color%3A%20%22Red%22%20%7D%2C%0A%20%20%7B%20id%3A%20%222%22%2C%20name%3A%20%22Cherry%22%2C%20color%3A%20%22Red%22%20%7D%2C%0A%20%20%7B%20id%3A%20%223%22%2C%20name%3A%20%22Banana%22%2C%20color%3A%20%22Yellow%22%20%7D%2C%0A%20%20%7B%20id%3A%20%224%22%2C%20name%3A%20%22Grape%22%2C%20color%3A%20%22Purple%22%20%7D%2C%0A%20%20%7B%20id%3A%20%225%22%2C%20name%3A%20%22Lemon%22%2C%20color%3A%20%22Yellow%22%20%7D%2C%0A%20%20%7B%20id%3A%20%226%22%2C%20name%3A%20%22Kiwi%22%2C%20color%3A%20%22Green%22%20%7D%2C%0A%20%20%7B%20id%3A%20%227%22%2C%20name%3A%20%22Orange%22%2C%20color%3A%20%22Orange%22%20%7D%2C%0A%20%20%7B%20id%3A%20%228%22%2C%20name%3A%20%22Blueberry%22%2C%20color%3A%20%22Blue%22%20%7D%2C%0A%5D%3B%0A%0Aexport%20default%20function%20MyApp%28%29%20%7B%0A%20%20return%20%28%0A%20%20%20%20%3CView%20style%3D%7Bstyles.container%7D%3E%0A%20%20%20%20%20%20%3CFlatList%0A%20%20%20%20%20%20%20%20data%3D%7Bfruits%7D%0A%20%20%20%20%20%20%20%20keyExtractor%3D%7B%28item%29%20%3D%3E%20item.id%7D%0A%20%20%20%20%20%20%20%20renderItem%3D%7B%28%7B%20item%20%7D%29%20%3D%3E%20%28%0A%20%20%20%20%20%20%20%20%20%20%3CView%20style%3D%7Bstyles.row%7D%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%3CText%20style%3D%7Bstyles.title%7D%3E%7Bitem.name%7D%3C%2FText%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%3CText%20style%3D%7Bstyles.subtitle%7D%3E%7Bitem.color%7D%3C%2FText%3E%0A%20%20%20%20%20%20%20%20%20%20%3C%2FView%3E%0A%20%20%20%20%20%20%20%20%29%7D%0A%20%20%20%20%20%20%2F%3E%0A%20%20%20%20%3C%2FView%3E%0A%20%20%29%3B%0A%7D%0A%0Aconst%20styles%20%3D%20StyleSheet.create%28%7B%0A%20%20container%3A%20%7B%20flex%3A%201%2C%20paddingTop%3A%2060%20%7D%2C%0A%20%20row%3A%20%7B%0A%20%20%20%20padding%3A%2020%2C%0A%20%20%20%20borderBottomWidth%3A%201%2C%0A%20%20%20%20borderColor%3A%20%22%23ddd%22%2C%0A%20%20%7D%2C%0A%20%20title%3A%20%7B%20fontSize%3A%2018%2C%20fontWeight%3A%20%22600%22%20%7D%2C%0A%20%20subtitle%3A%20%7B%20fontSize%3A%2014%2C%20color%3A%20%22%23666%22%20%7D%2C%0A%7D%29%3B%0A)** (SDK 54, 필요한 패키지 자동 포함)

- Three props do the work: `data` is the array, `renderItem` says what a row looks like, and `keyExtractor` says how to identify each row.
- There is no `.map()` and no `key` prop. `FlatList` calls `renderItem` once per visible row and handles the keys itself.
- `renderItem` receives an object, and the row's data is in its `item` property. That is why the parameter is written `({ item })`. The object also has `index`, which you rarely need.
- `keyExtractor` must return a string. Without it, `FlatList` looks for `item.key`, then `item.id`, so this list would work without one. Write it anyway: real data uses other names (`_id`, `postId`), and numbers need `.toString()`.
- The `container` needs `flex: 1`. A `FlatList` scrolls inside the space its parent gives it, and with no height it gets none.
- Show that only the visible rows render. Give `renderItem` a body with a `console.log` in it.

```jsx
renderItem={({ item }) => {
  console.log(item.name);
  return (
    <View style={styles.row}>
      <Text style={styles.title}>{item.name}</Text>
      <Text style={styles.subtitle}>{item.color}</Text>
    </View>
  );
}}
```

- Replace the array with a generated one and scroll. On load, only the first ten or so names appear in the console. More appear as you scroll, and only then. The list is still instant.

```jsx
const fruits = Array.from({ length: 1000 }, (_, i) => ({
  id: String(i + 1),
  name: `Fruit ${i + 1}`,
  color: "Green",
}));
```

- Look closer at the console: it is about 100 names, not 10. "Only what is on screen" is a simplification. `FlatList` renders a window around the visible area, `windowSize` screens tall, and the default is 21: ten screens above, ten below. At the top there is nothing above, so it fills ten screens below, and ten rows per screen is about 100 rows. The window is big on purpose, so fast scrolling never shows blank rows.
- Show the window shrink. Add this prop to the `FlatList` and reload.

```jsx
windowSize={3}
```

- Now the console shows the visible rows plus about a screen of spare, and the rest appear only as you scroll. Fling the list and blank cells flash by before they fill in. That is why the default is 21. Remove the prop; it is a demo setting, not something to ship.
- Do not go lower than 3. With `windowSize={1}` the window has no room to grow, and the list never renders past the first ten rows: it just re-renders them on every scroll.
- Before moving on, go back to the original example: paste the FlatList code from the top of this section into `App.js` again. That removes the 1000 rows, the `console.log` and `windowSize` in one go. The next example builds on that code.

**🇰🇷 한글 해설**

**코드 해설 (과일 목록)**
- 핵심 prop 3개: `data`(배열), `renderItem`(줄 모양), `keyExtractor`(줄 식별).
- `.map()`도 `key` prop도 **없어요.** FlatList가 보이는 줄마다 renderItem을 부르고 key도 알아서 처리.
- `renderItem`은 **객체**를 받고 데이터는 그 안의 `item` 속성에 있어서 `({ item })`로 꺼내요. `index`도 있지만 거의 안 써요. (자주 틀리는 부분: `renderItem={(item) => item.name}` X → `({ item })` O)
- `keyExtractor`는 **문자열**을 반환. 없으면 `item.key` → `item.id` 순으로 찾아요. 그래도 항상 써라(실제 데이터는 `_id`, `postId` 같은 이름이고 숫자는 `.toString()` 필요).
- 컨테이너에 **`flex: 1`** 필수. FlatList는 부모가 준 공간 안에서 스크롤하는데 높이가 없으면 공간이 0.

**virtualization 실험**
- renderItem에 `console.log` → 1000개를 만들어도 처음엔 일부만 로그. 스크롤하면 그때 더.
- 자세히 보면 10개가 아니라 약 **100개**. FlatList는 화면의 `windowSize`배 높이만큼 그려요. 기본 **21**(위 10화면 + 현재 + 아래 10화면). 맨 위에선 위가 없으니 아래 10화면 × 10줄 ≈ 100줄. 빠르게 스크롤해도 빈칸이 안 보이게 일부러 크게 잡은 것.
- `windowSize={3}`으로 줄이면 로그가 확 줄지만, 빨리 튕기면 **빈 칸이 번쩍**. 그래서 기본이 21. **3 미만 금지**: `windowSize={1}`이면 처음 10줄 이후로 영영 안 그려져요.

### 💻 Example: Sorting and Filtering

- Users expect a predictable order, and a way to narrow a long list down.
- Neither one touches the UI. You change the array, and `FlatList` renders whatever it gets.
- Start from the finished FlatList code.

**🇰🇷 한글 해설**

사용자는 예측 가능한 **순서**와 긴 목록을 **좁히는 방법**을 원해요. 둘 다 UI는 안 건드리고 **배열만** 바꿔요.

#### 💻 Step 1 - Sort with a Button

- Add `useState` and `Button` to the imports.


<p class="typeit" id="practice-2">⌨️ <b>이 코드는 Snack에서 직접 쳐 보세요</b>: ascending state + [...fruits].sort(localeCompare) + 정렬 버튼</p>

```jsx
import { useState } from "react";
import { View, Text, Button, FlatList, StyleSheet } from "react-native";
```

- Inside `MyApp`, above the `return`, add state for the direction and build the sorted array from it.


<p class="typeit sm">⌨️ 이 부분도 직접 쳐 보세요</p>

```jsx
const [ascending, setAscending] = useState(true);

const visible = [...fruits].sort((a, b) =>
  ascending ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name)
);
```

- Add a button above the `FlatList`.


<p class="typeit sm">⌨️ 이 부분도 직접 쳐 보세요</p>

```jsx
<Button
  title={ascending ? "Sort Z to A" : "Sort A to Z"}
  onPress={() => setAscending((prev) => !prev)}
/>
```

- Point the list at the sorted array.


<p class="typeit sm">⌨️ 이 부분도 직접 쳐 보세요</p>

```jsx
data={visible}
```

- Run it. Each press flips the order.
- `[...fruits]` copies the array first. `.sort()` sorts in place, and the original must stay as it is. Here it is a module-level constant; later it is state, and state is never mutated.
- `localeCompare` sorts strings the way people expect, with `"apple"` before `"Banana"`. For numbers, subtract: `a.price - b.price`.
- `visible` is not state. It is derived from state on every render, so there is nothing to keep in sync. The only state is the direction.
- The course notes wrap this in `useMemo` so it only recalculates when the inputs change. Same idea. Skip it until a list is big enough to notice.

**🇰🇷 한글 해설**

- state는 **방향 하나**(`ascending`). 정렬된 배열 `visible`은 state가 아니라 렌더링마다 **계산(derived)** 해요. 동기화할 게 없어서 버그가 줄어요. (시험 개념: **derived state**는 state로 저장하지 말 것)
- `[...fruits]` 먼저 **복사**. `.sort()`는 **원본을 직접 바꾸는(in place)** 함수라서. 지금은 상수지만 나중에 state가 되면 state는 절대 직접 바꾸면 안 돼요.
- `localeCompare`: 사람이 기대하는 문자열 순서("apple"이 "Banana"보다 앞). 숫자는 빼기 `a.price - b.price`.

#### 💻 Step 2 - Filter with a TextInput

- Add `TextInput` to the `react-native` import.
- Add state for the search text, and filter before sorting. Replace the `visible` lines.


<p class="typeit" id="practice-3">⌨️ <b>이 코드는 Snack에서 직접 쳐 보세요</b>: query state + TextInput + filter 다음 sort</p>

```jsx
const [search, setSearch] = useState("");

const visible = fruits
  .filter((item) => item.name.toLowerCase().includes(search.toLowerCase()))
  .sort((a, b) =>
    ascending ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name)
  );
```

- `.filter()` returns a new array, so the `[...fruits]` copy is gone. `.sort()` sorts that new array, and `fruits` is still untouched.
- Filter first, then sort. Sorting a shorter list is less work, and the result is the same.
- Add a controlled `TextInput` between the button and the list, as in Week 3.


<p class="typeit sm">⌨️ 이 부분도 직접 쳐 보세요</p>

```jsx
<TextInput
  style={styles.input}
  placeholder="Search"
  value={search}
  onChangeText={setSearch}
/>
```

- Add its style.


<p class="typeit sm">⌨️ 이 부분도 직접 쳐 보세요</p>

```jsx
input: {
  borderWidth: 1,
  borderColor: "#ccc",
  padding: 8,
  marginHorizontal: 20,
  marginVertical: 10,
},
```

- Type `an`: Banana and Orange. Type `rr`: Cherry and Blueberry. Every keystroke re-renders, the array is rebuilt, and the list follows.
- Type `zz`. The list is empty, and nothing says so. A blank screen looks broken.

**🇰🇷 한글 해설**

- `.filter()`는 **새 배열**을 반환하니 `[...fruits]` 복사가 필요 없어졌어요. sort는 그 새 배열을 정렬, 원본 안전.
- **먼저 필터, 그다음 정렬**: 짧은 목록을 정렬하는 게 일이 적고 결과는 같아요.
- 검색창은 controlled TextInput. `an` → Banana, Orange. `rr` → Cherry, Blueberry.
- `zz` → 빈 화면에 **아무 말도 없음** → 고장 난 것처럼 보임 → Step 3.

#### 💻 Step 3 - Show an Empty State

- Add `ListEmptyComponent` to the `FlatList`. It renders only when `data` is empty.


<p class="typeit" id="practice-4">⌨️ <b>이 코드는 Snack에서 직접 쳐 보세요</b>: ListEmptyComponent 추가</p>

```jsx
ListEmptyComponent={<Text style={styles.empty}>No fruit matches.</Text>}
```

- Add its style.


<p class="typeit sm">⌨️ 이 부분도 직접 쳐 보세요</p>

```jsx
empty: { padding: 20, color: "#666" },
```

- Empty is a state the user will see, so say something. The same prop handles a fetched list that comes back with nothing in it.

**🇰🇷 한글 해설**

`ListEmptyComponent`는 data가 **비었을 때만** 렌더링. 빈 화면도 사용자가 보는 상태이니 **말을 해 줘야** 해요. 서버에서 빈 목록이 와도 같은 prop이 처리.

#### 💻 Finished Code

- Compare against this if something is not working.

```jsx
import { useState } from "react";
import {
  View,
  Text,
  Button,
  TextInput,
  FlatList,
  StyleSheet,
} from "react-native";

const fruits = [
  { id: "1", name: "Apple", color: "Red" },
  { id: "2", name: "Cherry", color: "Red" },
  { id: "3", name: "Banana", color: "Yellow" },
  { id: "4", name: "Grape", color: "Purple" },
  { id: "5", name: "Lemon", color: "Yellow" },
  { id: "6", name: "Kiwi", color: "Green" },
  { id: "7", name: "Orange", color: "Orange" },
  { id: "8", name: "Blueberry", color: "Blue" },
];

export default function MyApp() {
  const [ascending, setAscending] = useState(true);
  const [search, setSearch] = useState("");

  const visible = fruits
    .filter((item) => item.name.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) =>
      ascending ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name)
    );

  return (
    <View style={styles.container}>
      <Button
        title={ascending ? "Sort Z to A" : "Sort A to Z"}
        onPress={() => setAscending((prev) => !prev)}
      />
      <TextInput
        style={styles.input}
        placeholder="Search"
        value={search}
        onChangeText={setSearch}
      />
      <FlatList
        data={visible}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.row}>
            <Text style={styles.title}>{item.name}</Text>
            <Text style={styles.subtitle}>{item.color}</Text>
          </View>
        )}
        ListEmptyComponent={<Text style={styles.empty}>No fruit matches.</Text>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingTop: 60 },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 8,
    marginHorizontal: 20,
    marginVertical: 10,
  },
  row: {
    padding: 20,
    borderBottomWidth: 1,
    borderColor: "#ddd",
  },
  title: { fontSize: 18, fontWeight: "600" },
  subtitle: { fontSize: 14, color: "#666" },
  empty: { padding: 20, color: "#666" },
});
```

▶ **[Snack에서 바로 실행하기](https://snack.expo.dev/?name=WEB530%20W5%20Example%3A%20Sorting%20and%20Filtering%20-%20Finished%20Code&platform=web&sdkVersion=54.0.0&code=import%20%7B%20useState%20%7D%20from%20%22react%22%3B%0Aimport%20%7B%0A%20%20View%2C%0A%20%20Text%2C%0A%20%20Button%2C%0A%20%20TextInput%2C%0A%20%20FlatList%2C%0A%20%20StyleSheet%2C%0A%7D%20from%20%22react-native%22%3B%0A%0Aconst%20fruits%20%3D%20%5B%0A%20%20%7B%20id%3A%20%221%22%2C%20name%3A%20%22Apple%22%2C%20color%3A%20%22Red%22%20%7D%2C%0A%20%20%7B%20id%3A%20%222%22%2C%20name%3A%20%22Cherry%22%2C%20color%3A%20%22Red%22%20%7D%2C%0A%20%20%7B%20id%3A%20%223%22%2C%20name%3A%20%22Banana%22%2C%20color%3A%20%22Yellow%22%20%7D%2C%0A%20%20%7B%20id%3A%20%224%22%2C%20name%3A%20%22Grape%22%2C%20color%3A%20%22Purple%22%20%7D%2C%0A%20%20%7B%20id%3A%20%225%22%2C%20name%3A%20%22Lemon%22%2C%20color%3A%20%22Yellow%22%20%7D%2C%0A%20%20%7B%20id%3A%20%226%22%2C%20name%3A%20%22Kiwi%22%2C%20color%3A%20%22Green%22%20%7D%2C%0A%20%20%7B%20id%3A%20%227%22%2C%20name%3A%20%22Orange%22%2C%20color%3A%20%22Orange%22%20%7D%2C%0A%20%20%7B%20id%3A%20%228%22%2C%20name%3A%20%22Blueberry%22%2C%20color%3A%20%22Blue%22%20%7D%2C%0A%5D%3B%0A%0Aexport%20default%20function%20MyApp%28%29%20%7B%0A%20%20const%20%5Bascending%2C%20setAscending%5D%20%3D%20useState%28true%29%3B%0A%20%20const%20%5Bsearch%2C%20setSearch%5D%20%3D%20useState%28%22%22%29%3B%0A%0A%20%20const%20visible%20%3D%20fruits%0A%20%20%20%20.filter%28%28item%29%20%3D%3E%20item.name.toLowerCase%28%29.includes%28search.toLowerCase%28%29%29%29%0A%20%20%20%20.sort%28%28a%2C%20b%29%20%3D%3E%0A%20%20%20%20%20%20ascending%20%3F%20a.name.localeCompare%28b.name%29%20%3A%20b.name.localeCompare%28a.name%29%0A%20%20%20%20%29%3B%0A%0A%20%20return%20%28%0A%20%20%20%20%3CView%20style%3D%7Bstyles.container%7D%3E%0A%20%20%20%20%20%20%3CButton%0A%20%20%20%20%20%20%20%20title%3D%7Bascending%20%3F%20%22Sort%20Z%20to%20A%22%20%3A%20%22Sort%20A%20to%20Z%22%7D%0A%20%20%20%20%20%20%20%20onPress%3D%7B%28%29%20%3D%3E%20setAscending%28%28prev%29%20%3D%3E%20%21prev%29%7D%0A%20%20%20%20%20%20%2F%3E%0A%20%20%20%20%20%20%3CTextInput%0A%20%20%20%20%20%20%20%20style%3D%7Bstyles.input%7D%0A%20%20%20%20%20%20%20%20placeholder%3D%22Search%22%0A%20%20%20%20%20%20%20%20value%3D%7Bsearch%7D%0A%20%20%20%20%20%20%20%20onChangeText%3D%7BsetSearch%7D%0A%20%20%20%20%20%20%2F%3E%0A%20%20%20%20%20%20%3CFlatList%0A%20%20%20%20%20%20%20%20data%3D%7Bvisible%7D%0A%20%20%20%20%20%20%20%20keyExtractor%3D%7B%28item%29%20%3D%3E%20item.id%7D%0A%20%20%20%20%20%20%20%20renderItem%3D%7B%28%7B%20item%20%7D%29%20%3D%3E%20%28%0A%20%20%20%20%20%20%20%20%20%20%3CView%20style%3D%7Bstyles.row%7D%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%3CText%20style%3D%7Bstyles.title%7D%3E%7Bitem.name%7D%3C%2FText%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%3CText%20style%3D%7Bstyles.subtitle%7D%3E%7Bitem.color%7D%3C%2FText%3E%0A%20%20%20%20%20%20%20%20%20%20%3C%2FView%3E%0A%20%20%20%20%20%20%20%20%29%7D%0A%20%20%20%20%20%20%20%20ListEmptyComponent%3D%7B%3CText%20style%3D%7Bstyles.empty%7D%3ENo%20fruit%20matches.%3C%2FText%3E%7D%0A%20%20%20%20%20%20%2F%3E%0A%20%20%20%20%3C%2FView%3E%0A%20%20%29%3B%0A%7D%0A%0Aconst%20styles%20%3D%20StyleSheet.create%28%7B%0A%20%20container%3A%20%7B%20flex%3A%201%2C%20paddingTop%3A%2060%20%7D%2C%0A%20%20input%3A%20%7B%0A%20%20%20%20borderWidth%3A%201%2C%0A%20%20%20%20borderColor%3A%20%22%23ccc%22%2C%0A%20%20%20%20padding%3A%208%2C%0A%20%20%20%20marginHorizontal%3A%2020%2C%0A%20%20%20%20marginVertical%3A%2010%2C%0A%20%20%7D%2C%0A%20%20row%3A%20%7B%0A%20%20%20%20padding%3A%2020%2C%0A%20%20%20%20borderBottomWidth%3A%201%2C%0A%20%20%20%20borderColor%3A%20%22%23ddd%22%2C%0A%20%20%7D%2C%0A%20%20title%3A%20%7B%20fontSize%3A%2018%2C%20fontWeight%3A%20%22600%22%20%7D%2C%0A%20%20subtitle%3A%20%7B%20fontSize%3A%2014%2C%20color%3A%20%22%23666%22%20%7D%2C%0A%20%20empty%3A%20%7B%20padding%3A%2020%2C%20color%3A%20%22%23666%22%20%7D%2C%0A%7D%29%3B%0A)** (SDK 54, 필요한 패키지 자동 포함) <button class="snack-embed" type="button">👀 여기서 결과 보기</button>

**🇰🇷 한글 해설**

**완성 코드 해설**: state는 `ascending`과 `query` 두 개뿐. `visible = fruits.filter(...).sort(...)`를 return 위에서 매번 계산 → `data={visible}`. 버튼, 검색창, FlatList, ListEmptyComponent. 이 구조가 Lab 5 Q2~Q3의 뼈대예요.

### 💻 Example: Fetching List Data

- Real lists come from an API, and that changes the component. The data is not there when the screen first renders, and it might never arrive.
- Fetching brings three states with it: loading, error and empty. The lifecycle is: start loading, show a spinner, fetch, render the list, and if it failed, say so and offer a retry.

**🇰🇷 한글 해설**

실제 목록은 API에서 와요. 첫 렌더링 때는 데이터가 **없고**, 영영 안 올 수도 있어요. 그래서 상태 3개가 생겨요: **loading, error, empty**. 흐름: 로딩 시작 → 스피너 → fetch → 목록, 실패하면 메시지 + 다시 시도.

#### 💻 Starter Code

- This is a new app, so replace everything in `App.js`. It fetches the posts and shows them, and nothing else.


<p class="typeit" id="practice-5">⌨️ <b>이 코드는 Snack에서 직접 쳐 보세요</b>: posts state + useEffect에서 fetch + FlatList (시작 코드)</p>

```jsx
import { useState, useEffect } from "react";
import { View, Text, FlatList, StyleSheet } from "react-native";

const URL = "https://jsonplaceholder.typicode.com/posts";

export default function MyApp() {
  const [posts, setPosts] = useState([]);

  function loadPosts() {
    return fetch(URL)
      .then((res) => res.json())
      .then((json) => setPosts(json));
  }

  useEffect(() => {
    // Demo only: wait two seconds so the empty screen is visible.
    const id = setTimeout(() => {
      loadPosts();
    }, 2000);
    return () => clearTimeout(id);
  }, []);

  return (
    <View style={styles.container}>
      <FlatList
        data={posts}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.row}>
            <Text style={styles.title}>{item.title}</Text>
            <Text style={styles.subtitle}>{item.body}</Text>
          </View>
        )}
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
  },
  title: { fontSize: 18, fontWeight: "600" },
  subtitle: { fontSize: 14, color: "#666" },
});
```

▶ **[Snack에서 바로 실행하기](https://snack.expo.dev/?name=WEB530%20W5%20Example%3A%20Fetching%20List%20Data%20-%20Starter%20Code&platform=web&sdkVersion=54.0.0&code=import%20%7B%20useState%2C%20useEffect%20%7D%20from%20%22react%22%3B%0Aimport%20%7B%20View%2C%20Text%2C%20FlatList%2C%20StyleSheet%20%7D%20from%20%22react-native%22%3B%0A%0Aconst%20URL%20%3D%20%22https%3A%2F%2Fjsonplaceholder.typicode.com%2Fposts%22%3B%0A%0Aexport%20default%20function%20MyApp%28%29%20%7B%0A%20%20const%20%5Bposts%2C%20setPosts%5D%20%3D%20useState%28%5B%5D%29%3B%0A%0A%20%20function%20loadPosts%28%29%20%7B%0A%20%20%20%20return%20fetch%28URL%29%0A%20%20%20%20%20%20.then%28%28res%29%20%3D%3E%20res.json%28%29%29%0A%20%20%20%20%20%20.then%28%28json%29%20%3D%3E%20setPosts%28json%29%29%3B%0A%20%20%7D%0A%0A%20%20useEffect%28%28%29%20%3D%3E%20%7B%0A%20%20%20%20%2F%2F%20Demo%20only%3A%20wait%20two%20seconds%20so%20the%20empty%20screen%20is%20visible.%0A%20%20%20%20const%20id%20%3D%20setTimeout%28%28%29%20%3D%3E%20%7B%0A%20%20%20%20%20%20loadPosts%28%29%3B%0A%20%20%20%20%7D%2C%202000%29%3B%0A%20%20%20%20return%20%28%29%20%3D%3E%20clearTimeout%28id%29%3B%0A%20%20%7D%2C%20%5B%5D%29%3B%0A%0A%20%20return%20%28%0A%20%20%20%20%3CView%20style%3D%7Bstyles.container%7D%3E%0A%20%20%20%20%20%20%3CFlatList%0A%20%20%20%20%20%20%20%20data%3D%7Bposts%7D%0A%20%20%20%20%20%20%20%20keyExtractor%3D%7B%28item%29%20%3D%3E%20item.id.toString%28%29%7D%0A%20%20%20%20%20%20%20%20renderItem%3D%7B%28%7B%20item%20%7D%29%20%3D%3E%20%28%0A%20%20%20%20%20%20%20%20%20%20%3CView%20style%3D%7Bstyles.row%7D%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%3CText%20style%3D%7Bstyles.title%7D%3E%7Bitem.title%7D%3C%2FText%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%3CText%20style%3D%7Bstyles.subtitle%7D%3E%7Bitem.body%7D%3C%2FText%3E%0A%20%20%20%20%20%20%20%20%20%20%3C%2FView%3E%0A%20%20%20%20%20%20%20%20%29%7D%0A%20%20%20%20%20%20%2F%3E%0A%20%20%20%20%3C%2FView%3E%0A%20%20%29%3B%0A%7D%0A%0Aconst%20styles%20%3D%20StyleSheet.create%28%7B%0A%20%20container%3A%20%7B%20flex%3A%201%2C%20paddingTop%3A%2060%20%7D%2C%0A%20%20row%3A%20%7B%0A%20%20%20%20padding%3A%2020%2C%0A%20%20%20%20borderBottomWidth%3A%201%2C%0A%20%20%20%20borderColor%3A%20%22%23ddd%22%2C%0A%20%20%7D%2C%0A%20%20title%3A%20%7B%20fontSize%3A%2018%2C%20fontWeight%3A%20%22600%22%20%7D%2C%0A%20%20subtitle%3A%20%7B%20fontSize%3A%2014%2C%20color%3A%20%22%23666%22%20%7D%2C%0A%7D%29%3B%0A)** (SDK 54, 필요한 패키지 자동 포함)

- `posts` starts as an empty array, so the first render has something to give the list.
- `useEffect` with `[]` runs once, after the first render, as in Week 2. That is where the request starts.
- The timer is only there for the demo. On the classroom network the posts arrive too fast to see anything, so the request waits two seconds. The clean-up cancels the timer if the component unmounts first, the same pattern as Week 2. The finished code at the end leaves the timer out.
- `fetch` returns a promise for the response, and `res.json()` returns a promise for the parsed body. `loadPosts` returns the chain so the next steps can wait on it.
- `item.id` is a number here, so `keyExtractor` converts it.
- Run it. For two seconds the screen is blank, then the list appears. Nothing tells the user that anything is happening, and if the request fails, the screen stays blank forever.

**🇰🇷 한글 해설**

- `posts`는 빈 배열로 시작(첫 렌더링에도 목록에 줄 게 있게).
- `useEffect(..., [])` 한 번 실행 → 요청 시작.
- 2초 타이머는 **데모용**(교실 네트워크가 너무 빨라서). cleanup으로 타이머 취소(2주차 패턴). 완성 코드에는 없어요.
- `fetch`는 응답의 Promise, `res.json()`은 파싱된 본문의 Promise. `loadPosts`가 체인을 return 해서 다음 단계가 기다릴 수 있게.
- `item.id`가 숫자라 keyExtractor에서 `.toString()`.
- 문제: 2초 동안 빈 화면, 실패하면 영원히 빈 화면.

#### 💻 Step 1 - Show a Spinner While Loading

- Add `ActivityIndicator` to the `react-native` import.
- Add a `loading` state under `posts`. It starts as `true` because the first load starts right away.


<p class="typeit" id="practice-6">⌨️ <b>이 코드는 Snack에서 직접 쳐 보세요</b>: loading state(true로 시작) + finally에서 false + early return 스피너</p>

```jsx
const [loading, setLoading] = useState(true);
```

- Change the line inside the timer so it clears the flag when the request finishes.


<p class="typeit sm">⌨️ 이 부분도 직접 쳐 보세요</p>

```jsx
loadPosts().finally(() => setLoading(false));
```

- Above the main `return`, return a different screen while loading.


<p class="typeit sm">⌨️ 이 부분도 직접 쳐 보세요</p>

```jsx
if (loading) {
  return (
    <View style={styles.center}>
      <ActivityIndicator size="large" />
      <Text>Loading posts...</Text>
    </View>
  );
}
```

- Add its style.


<p class="typeit sm">⌨️ 이 부분도 직접 쳐 보세요</p>

```jsx
center: { flex: 1, justifyContent: "center", alignItems: "center" },
```

- `.finally()` runs after success or failure, so the spinner always goes away.
- An early `return` for each state keeps the main `return` simple. The list code never has to ask whether the data is ready.
- Run it. The two seconds are now a spinner and a message instead of a blank screen.

**🇰🇷 한글 해설**

- `ActivityIndicator` = 빙글빙글 로딩 스피너.
- `loading` state는 **true로 시작**(첫 로드가 바로 시작되니까).
- `.finally(() => setLoading(false))` → 성공, 실패 상관없이 **항상** 스피너 끄기.
- `if (loading) return (스피너 화면);` **early return** → 메인 return은 데이터가 준비됐는지 신경 안 써도 됨.

#### 💻 Step 2 - Handle Errors

- Add `Button` to the `react-native` import.
- Add an `error` state. `null` means no error.


<p class="typeit" id="practice-7">⌨️ <b>이 코드는 Snack에서 직접 쳐 보세요</b>: error state + if (!res.ok) throw + catch 메시지 + Try Again 버튼</p>

```jsx
const [error, setError] = useState(null);
```

- Replace `loadPosts`. It checks the response, stores the posts, and records a message if anything went wrong.


<p class="typeit sm">⌨️ 이 부분도 직접 쳐 보세요</p>

```jsx
function loadPosts() {
  return fetch(URL)
    .then((res) => {
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return res.json();
    })
    .then((json) => {
      setPosts(json);
      setError(null);
    })
    .catch(() =>
      setError("Could not load the posts. Check your connection and try again.")
    );
}
```

- `fetch` only rejects when the network fails. A 404 or a 500 is a successful response as far as `fetch` is concerned, so check `res.ok` and throw to reach the `catch`.
- The message is for the user. No status codes, say what happened and what to do.
- Add a retry function under the effect. It shows the spinner again and reloads.


<p class="typeit sm">⌨️ 이 부분도 직접 쳐 보세요</p>

```jsx
function retry() {
  setLoading(true);
  loadPosts().finally(() => setLoading(false));
}
```

- Add the error screen under the loading one.


<p class="typeit sm">⌨️ 이 부분도 직접 쳐 보세요</p>

```jsx
if (error) {
  return (
    <View style={styles.center}>
      <Text style={styles.error}>{error}</Text>
      <Button title="Try Again" onPress={retry} />
    </View>
  );
}
```

- Add its style.


<p class="typeit sm">⌨️ 이 부분도 직접 쳐 보세요</p>

```jsx
error: { color: "red", textAlign: "center", padding: 20 },
```

- Show it. Change `URL` to end in `/postz`. The API answers 404, `res.ok` is false, and the error screen appears. Press **Try Again** to watch the spinner come back and the error return. Fix the URL.
- The order of the early returns matters. `loading` is checked first, so pressing **Try Again** shows the spinner even though `error` is still set.

**🇰🇷 한글 해설**

- `error` state: `null`이면 에러 없음.
- **핵심**: `fetch`는 **네트워크가 실패할 때만** reject. 404, 500도 fetch 입장에선 "성공한 응답". 그래서 `if (!res.ok) throw new Error(`HTTP ${res.status}`)`로 직접 던져야 `catch`로 가요. (Lab 5 Q4 주석 내용!)
- 에러 메시지는 **사용자용**: 상태 코드 말고, 무슨 일이 있었고 뭘 하면 되는지.
- `retry()`: 스피너 다시 켜고 다시 로드.
- 테스트: URL을 `/postz`로 → 404 → 에러 화면 → Try Again → 스피너 → 다시 에러.
- **early return 순서가 중요**: loading을 먼저 검사해서, Try Again을 누르면 error가 아직 있어도 스피너가 보여요.

#### 💻 Step 3 - Show an Empty State

- Add `ListEmptyComponent` to the `FlatList`, as in the previous example.


<p class="typeit" id="practice-8">⌨️ <b>이 코드는 Snack에서 직접 쳐 보세요</b>: ListEmptyComponent + ?userId=99로 빈 목록 테스트</p>

```jsx
ListEmptyComponent={<Text style={styles.empty}>No posts yet.</Text>}
```

- Add its style.


<p class="typeit sm">⌨️ 이 부분도 직접 쳐 보세요</p>

```jsx
empty: { padding: 20, color: "#666" },
```

- Show it. Change `URL` to end in `/posts?userId=99`. The API filters by user, nobody has that id, and it returns `[]`. The list renders with the message. Fix the URL.
- That is the whole lifecycle: a spinner, the list, an error with a retry, and a message when there is nothing to show. The next example builds on this code.

**🇰🇷 한글 해설**

`ListEmptyComponent` 추가. 테스트: `/posts?userId=99` → 서버가 `[]` 반환 → "없음" 메시지. 이로써 **전체 생명주기 완성**: 스피너 → 목록 → 에러 + 재시도 → 빈 목록 메시지.

#### 💻 Finished Code

- Compare against this if something is not working.

```jsx
import { useState, useEffect } from "react";
import {
  View,
  Text,
  Button,
  FlatList,
  ActivityIndicator,
  StyleSheet,
} from "react-native";

const URL = "https://jsonplaceholder.typicode.com/posts";

export default function MyApp() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  function loadPosts() {
    return fetch(URL)
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then((json) => {
        setPosts(json);
        setError(null);
      })
      .catch(() =>
        setError("Could not load the posts. Check your connection and try again.")
      );
  }

  useEffect(() => {
    loadPosts().finally(() => setLoading(false));
  }, []);

  function retry() {
    setLoading(true);
    loadPosts().finally(() => setLoading(false));
  }

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
        <Text>Loading posts...</Text>
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
      <FlatList
        data={posts}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.row}>
            <Text style={styles.title}>{item.title}</Text>
            <Text style={styles.subtitle}>{item.body}</Text>
          </View>
        )}
        ListEmptyComponent={<Text style={styles.empty}>No posts yet.</Text>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingTop: 60 },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  row: {
    padding: 20,
    borderBottomWidth: 1,
    borderColor: "#ddd",
  },
  title: { fontSize: 18, fontWeight: "600" },
  subtitle: { fontSize: 14, color: "#666" },
  error: { color: "red", textAlign: "center", padding: 20 },
  empty: { padding: 20, color: "#666" },
});
```

▶ **[Snack에서 바로 실행하기](https://snack.expo.dev/?name=WEB530%20W5%20Example%3A%20Fetching%20List%20Data%20-%20Finished%20Code&platform=web&sdkVersion=54.0.0&code=import%20%7B%20useState%2C%20useEffect%20%7D%20from%20%22react%22%3B%0Aimport%20%7B%0A%20%20View%2C%0A%20%20Text%2C%0A%20%20Button%2C%0A%20%20FlatList%2C%0A%20%20ActivityIndicator%2C%0A%20%20StyleSheet%2C%0A%7D%20from%20%22react-native%22%3B%0A%0Aconst%20URL%20%3D%20%22https%3A%2F%2Fjsonplaceholder.typicode.com%2Fposts%22%3B%0A%0Aexport%20default%20function%20MyApp%28%29%20%7B%0A%20%20const%20%5Bposts%2C%20setPosts%5D%20%3D%20useState%28%5B%5D%29%3B%0A%20%20const%20%5Bloading%2C%20setLoading%5D%20%3D%20useState%28true%29%3B%0A%20%20const%20%5Berror%2C%20setError%5D%20%3D%20useState%28null%29%3B%0A%0A%20%20function%20loadPosts%28%29%20%7B%0A%20%20%20%20return%20fetch%28URL%29%0A%20%20%20%20%20%20.then%28%28res%29%20%3D%3E%20%7B%0A%20%20%20%20%20%20%20%20if%20%28%21res.ok%29%20throw%20new%20Error%28%60HTTP%20%24%7Bres.status%7D%60%29%3B%0A%20%20%20%20%20%20%20%20return%20res.json%28%29%3B%0A%20%20%20%20%20%20%7D%29%0A%20%20%20%20%20%20.then%28%28json%29%20%3D%3E%20%7B%0A%20%20%20%20%20%20%20%20setPosts%28json%29%3B%0A%20%20%20%20%20%20%20%20setError%28null%29%3B%0A%20%20%20%20%20%20%7D%29%0A%20%20%20%20%20%20.catch%28%28%29%20%3D%3E%0A%20%20%20%20%20%20%20%20setError%28%22Could%20not%20load%20the%20posts.%20Check%20your%20connection%20and%20try%20again.%22%29%0A%20%20%20%20%20%20%29%3B%0A%20%20%7D%0A%0A%20%20useEffect%28%28%29%20%3D%3E%20%7B%0A%20%20%20%20loadPosts%28%29.finally%28%28%29%20%3D%3E%20setLoading%28false%29%29%3B%0A%20%20%7D%2C%20%5B%5D%29%3B%0A%0A%20%20function%20retry%28%29%20%7B%0A%20%20%20%20setLoading%28true%29%3B%0A%20%20%20%20loadPosts%28%29.finally%28%28%29%20%3D%3E%20setLoading%28false%29%29%3B%0A%20%20%7D%0A%0A%20%20if%20%28loading%29%20%7B%0A%20%20%20%20return%20%28%0A%20%20%20%20%20%20%3CView%20style%3D%7Bstyles.center%7D%3E%0A%20%20%20%20%20%20%20%20%3CActivityIndicator%20size%3D%22large%22%20%2F%3E%0A%20%20%20%20%20%20%20%20%3CText%3ELoading%20posts...%3C%2FText%3E%0A%20%20%20%20%20%20%3C%2FView%3E%0A%20%20%20%20%29%3B%0A%20%20%7D%0A%0A%20%20if%20%28error%29%20%7B%0A%20%20%20%20return%20%28%0A%20%20%20%20%20%20%3CView%20style%3D%7Bstyles.center%7D%3E%0A%20%20%20%20%20%20%20%20%3CText%20style%3D%7Bstyles.error%7D%3E%7Berror%7D%3C%2FText%3E%0A%20%20%20%20%20%20%20%20%3CButton%20title%3D%22Try%20Again%22%20onPress%3D%7Bretry%7D%20%2F%3E%0A%20%20%20%20%20%20%3C%2FView%3E%0A%20%20%20%20%29%3B%0A%20%20%7D%0A%0A%20%20return%20%28%0A%20%20%20%20%3CView%20style%3D%7Bstyles.container%7D%3E%0A%20%20%20%20%20%20%3CFlatList%0A%20%20%20%20%20%20%20%20data%3D%7Bposts%7D%0A%20%20%20%20%20%20%20%20keyExtractor%3D%7B%28item%29%20%3D%3E%20item.id.toString%28%29%7D%0A%20%20%20%20%20%20%20%20renderItem%3D%7B%28%7B%20item%20%7D%29%20%3D%3E%20%28%0A%20%20%20%20%20%20%20%20%20%20%3CView%20style%3D%7Bstyles.row%7D%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%3CText%20style%3D%7Bstyles.title%7D%3E%7Bitem.title%7D%3C%2FText%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%3CText%20style%3D%7Bstyles.subtitle%7D%3E%7Bitem.body%7D%3C%2FText%3E%0A%20%20%20%20%20%20%20%20%20%20%3C%2FView%3E%0A%20%20%20%20%20%20%20%20%29%7D%0A%20%20%20%20%20%20%20%20ListEmptyComponent%3D%7B%3CText%20style%3D%7Bstyles.empty%7D%3ENo%20posts%20yet.%3C%2FText%3E%7D%0A%20%20%20%20%20%20%2F%3E%0A%20%20%20%20%3C%2FView%3E%0A%20%20%29%3B%0A%7D%0A%0Aconst%20styles%20%3D%20StyleSheet.create%28%7B%0A%20%20container%3A%20%7B%20flex%3A%201%2C%20paddingTop%3A%2060%20%7D%2C%0A%20%20center%3A%20%7B%20flex%3A%201%2C%20justifyContent%3A%20%22center%22%2C%20alignItems%3A%20%22center%22%20%7D%2C%0A%20%20row%3A%20%7B%0A%20%20%20%20padding%3A%2020%2C%0A%20%20%20%20borderBottomWidth%3A%201%2C%0A%20%20%20%20borderColor%3A%20%22%23ddd%22%2C%0A%20%20%7D%2C%0A%20%20title%3A%20%7B%20fontSize%3A%2018%2C%20fontWeight%3A%20%22600%22%20%7D%2C%0A%20%20subtitle%3A%20%7B%20fontSize%3A%2014%2C%20color%3A%20%22%23666%22%20%7D%2C%0A%20%20error%3A%20%7B%20color%3A%20%22red%22%2C%20textAlign%3A%20%22center%22%2C%20padding%3A%2020%20%7D%2C%0A%20%20empty%3A%20%7B%20padding%3A%2020%2C%20color%3A%20%22%23666%22%20%7D%2C%0A%7D%29%3B%0A)** (SDK 54, 필요한 패키지 자동 포함) <button class="snack-embed" type="button">👀 여기서 결과 보기</button>

**🇰🇷 한글 해설**

**완성 코드 해설 (시험 직전 꼭 다시 보기)**
- state 3개: `posts`, `loading`, `error`.
- `loadPosts`: `fetch(URL)` → `res.ok` 확인 → `json()` → `setPosts` → catch에서 `setError(메시지)` → finally에서 `setLoading(false)`.
- `useEffect(() => { loadPosts(); }, [])`.
- `retry`: `setLoading(true); setError(null); loadPosts();`
- 렌더링: loading → error → 목록(ListEmptyComponent 포함) 순서의 early return.

### 💻 Example: List and Detail

- Most mobile apps use this pattern. The list is the overview, and tapping a row opens the detail. Mail, Contacts and Instagram all work this way.
- It is progressive disclosure: show what the user needs right now, and reveal the rest when they ask for it. The list stays clean, and the detail has room.
- Under the hood it is the stack navigator from Week 4, with the row passed as a param.
- Start from the finished Fetching List Data code, and replace `package.json` with the one at the top of these notes.

**🇰🇷 한글 해설**

**Progressive disclosure(점진적 공개)**: 지금 필요한 것만 보여 주고, 나머지는 요청할 때 보여 주기. 목록은 깔끔하게, 상세는 넉넉하게. 내부적으로는 4주차 스택 + row를 param으로 전달.

#### 💻 Step 1 - Put the List in a Stack

- Add the navigation imports under the `react-native` import.


<p class="typeit" id="practice-9">⌨️ <b>이 코드는 Snack에서 직접 쳐 보세요</b>: MyApp → PostsScreen 이름 바꾸고 NavigationContainer + Stack 감싸기</p>

```jsx
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
```

- Create the stack under the imports, outside every component.


<p class="typeit sm">⌨️ 이 부분도 직접 쳐 보세요</p>

```jsx
const Stack = createNativeStackNavigator();
```

- Rename `MyApp` to `PostsScreen`, remove its `export default`, and give it the `navigation` prop.


<p class="typeit sm">⌨️ 이 부분도 직접 쳐 보세요</p>

```jsx
function PostsScreen({ navigation }) {
```

- Add a new `MyApp` at the bottom, above the styles.


<p class="typeit sm">⌨️ 이 부분도 직접 쳐 보세요</p>

```jsx
export default function MyApp() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Posts" component={PostsScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
```

▶ 웹 React 코드예요. [교수님 CodeSandbox 템플릿](https://codesandbox.io/p/sandbox/react-basic-3rqll4)에 붙여넣어 실행하세요.

- Remove `paddingTop` from `container`. The header provides the space now.


<p class="typeit sm">⌨️ 이 부분도 직접 쳐 보세요</p>

```jsx
container: { flex: 1 },
```

- Run it. The same list, with a **Posts** header.

**🇰🇷 한글 해설**

`MyApp`을 `PostsScreen`으로 이름 바꾸고(`export default` 제거, `navigation` prop 받기), 새 `MyApp`이 NavigationContainer + Stack을 return. 헤더가 공간을 만들어 주니 `paddingTop` 제거.

#### 💻 Step 2 - Make Each Row Tappable

- Add `Pressable` to the `react-native` import.
- Replace the row. The `View` becomes a `Pressable` that navigates, and the body is cut to one line.


<p class="typeit" id="practice-10">⌨️ <b>이 코드는 Snack에서 직접 쳐 보세요</b>: 줄을 Pressable로 감싸고 navigate(&quot;Details&quot;, { post: item })</p>

```jsx
renderItem={({ item }) => (
  <Pressable
    style={styles.row}
    onPress={() => navigation.navigate("Details", { post: item })}
  >
    <Text style={styles.title}>{item.title}</Text>
    <Text style={styles.subtitle} numberOfLines={1}>
      {item.body}
    </Text>
  </Pressable>
)}
```

- `Pressable` is the general touch wrapper. It has no look of its own, so the row style stays the same. There is more on touch later in the course.
- `numberOfLines={1}` trims the body to a preview with an ellipsis. The list is the summary; the full text belongs on the detail screen.
- The whole post goes along as a param, so the detail screen has nothing to fetch.
- Press a row. Nothing opens, and the console says the `NAVIGATE` action was not handled, because there is no `Details` screen yet.

**🇰🇷 한글 해설**

- row의 `View`를 **`Pressable`** 로 교체 → `onPress={() => navigation.navigate("Details", { post: item })}`.
- Pressable은 **모양이 없는** 터치 감싸개라 row 스타일 그대로.
- `numberOfLines={1}` → 본문을 한 줄로 자르고 말줄임(…). 목록은 요약, 전체는 상세에서.
- 아직 Details 화면이 없어서 누르면 콘솔에 `NAVIGATE` 미처리 메시지.

#### 💻 Step 3 - Add the Details Screen

- Add the screen under `PostsScreen`. It reads the post from `route.params`, as in Week 4.


<p class="typeit" id="practice-11">⌨️ <b>이 코드는 Snack에서 직접 쳐 보세요</b>: DetailsScreen에서 const { post } = route.params</p>

```jsx
function DetailsScreen({ route }) {
  const { post } = route.params;

  return (
    <View style={styles.detail}>
      <Text style={styles.title}>{post.title}</Text>
      <Text style={styles.body}>{post.body}</Text>
    </View>
  );
}
```

- Register it under the **Posts** screen, with the post's title in the header.


<p class="typeit sm">⌨️ 이 부분도 직접 쳐 보세요</p>

```jsx
<Stack.Screen
  name="Details"
  component={DetailsScreen}
  options={({ route }) => ({ title: route.params.post.title })}
/>
```

- Add the styles.


<p class="typeit sm">⌨️ 이 부분도 직접 쳐 보세요</p>

```jsx
detail: { flex: 1, padding: 20 },
body: { fontSize: 16, lineHeight: 24, marginTop: 10 },
```

- Run it. Press a row, read the post, and go back with the header button. The list is exactly where you left it, because the `Posts` screen stayed on the stack.
- Params should be small and serializable. A post is fine. For big records, pass only the `id` and let the detail screen fetch the rest. The course notes have that version.

**🇰🇷 한글 해설**

- `const { post } = route.params;`로 읽기, 헤더 제목은 post.title.
- 뒤로 가면 목록이 **그대로**(Posts 화면이 스택에 남아 있으니까, unmount 안 됨).
- params는 **작고 직렬화 가능**(serializable, JSON으로 바꿀 수 있는)해야 해요. 큰 레코드는 **id만** 넘기고 상세가 fetch.

#### 💻 Finished Code

- Compare against this if something is not working.

```jsx
import { useState, useEffect } from "react";
import {
  View,
  Text,
  Button,
  FlatList,
  Pressable,
  ActivityIndicator,
  StyleSheet,
} from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

const URL = "https://jsonplaceholder.typicode.com/posts";

const Stack = createNativeStackNavigator();

function PostsScreen({ navigation }) {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  function loadPosts() {
    return fetch(URL)
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then((json) => {
        setPosts(json);
        setError(null);
      })
      .catch(() =>
        setError("Could not load the posts. Check your connection and try again.")
      );
  }

  useEffect(() => {
    loadPosts().finally(() => setLoading(false));
  }, []);

  function retry() {
    setLoading(true);
    loadPosts().finally(() => setLoading(false));
  }

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
        <Text>Loading posts...</Text>
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
      <FlatList
        data={posts}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <Pressable
            style={styles.row}
            onPress={() => navigation.navigate("Details", { post: item })}
          >
            <Text style={styles.title}>{item.title}</Text>
            <Text style={styles.subtitle} numberOfLines={1}>
              {item.body}
            </Text>
          </Pressable>
        )}
        ListEmptyComponent={<Text style={styles.empty}>No posts yet.</Text>}
      />
    </View>
  );
}

function DetailsScreen({ route }) {
  const { post } = route.params;

  return (
    <View style={styles.detail}>
      <Text style={styles.title}>{post.title}</Text>
      <Text style={styles.body}>{post.body}</Text>
    </View>
  );
}

export default function MyApp() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Posts" component={PostsScreen} />
        <Stack.Screen
          name="Details"
          component={DetailsScreen}
          options={({ route }) => ({ title: route.params.post.title })}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  row: {
    padding: 20,
    borderBottomWidth: 1,
    borderColor: "#ddd",
  },
  title: { fontSize: 18, fontWeight: "600" },
  subtitle: { fontSize: 14, color: "#666" },
  error: { color: "red", textAlign: "center", padding: 20 },
  empty: { padding: 20, color: "#666" },
  detail: { flex: 1, padding: 20 },
  body: { fontSize: 16, lineHeight: 24, marginTop: 10 },
});
```

▶ **[Snack에서 바로 실행하기](https://snack.expo.dev/?name=WEB530%20W5%20Example%3A%20List%20and%20Detail%20-%20Finished%20Code&platform=web&sdkVersion=54.0.0&code=import%20%7B%20useState%2C%20useEffect%20%7D%20from%20%22react%22%3B%0Aimport%20%7B%0A%20%20View%2C%0A%20%20Text%2C%0A%20%20Button%2C%0A%20%20FlatList%2C%0A%20%20Pressable%2C%0A%20%20ActivityIndicator%2C%0A%20%20StyleSheet%2C%0A%7D%20from%20%22react-native%22%3B%0Aimport%20%7B%20NavigationContainer%20%7D%20from%20%22%40react-navigation%2Fnative%22%3B%0Aimport%20%7B%20createNativeStackNavigator%20%7D%20from%20%22%40react-navigation%2Fnative-stack%22%3B%0A%0Aconst%20URL%20%3D%20%22https%3A%2F%2Fjsonplaceholder.typicode.com%2Fposts%22%3B%0A%0Aconst%20Stack%20%3D%20createNativeStackNavigator%28%29%3B%0A%0Afunction%20PostsScreen%28%7B%20navigation%20%7D%29%20%7B%0A%20%20const%20%5Bposts%2C%20setPosts%5D%20%3D%20useState%28%5B%5D%29%3B%0A%20%20const%20%5Bloading%2C%20setLoading%5D%20%3D%20useState%28true%29%3B%0A%20%20const%20%5Berror%2C%20setError%5D%20%3D%20useState%28null%29%3B%0A%0A%20%20function%20loadPosts%28%29%20%7B%0A%20%20%20%20return%20fetch%28URL%29%0A%20%20%20%20%20%20.then%28%28res%29%20%3D%3E%20%7B%0A%20%20%20%20%20%20%20%20if%20%28%21res.ok%29%20throw%20new%20Error%28%60HTTP%20%24%7Bres.status%7D%60%29%3B%0A%20%20%20%20%20%20%20%20return%20res.json%28%29%3B%0A%20%20%20%20%20%20%7D%29%0A%20%20%20%20%20%20.then%28%28json%29%20%3D%3E%20%7B%0A%20%20%20%20%20%20%20%20setPosts%28json%29%3B%0A%20%20%20%20%20%20%20%20setError%28null%29%3B%0A%20%20%20%20%20%20%7D%29%0A%20%20%20%20%20%20.catch%28%28%29%20%3D%3E%0A%20%20%20%20%20%20%20%20setError%28%22Could%20not%20load%20the%20posts.%20Check%20your%20connection%20and%20try%20again.%22%29%0A%20%20%20%20%20%20%29%3B%0A%20%20%7D%0A%0A%20%20useEffect%28%28%29%20%3D%3E%20%7B%0A%20%20%20%20loadPosts%28%29.finally%28%28%29%20%3D%3E%20setLoading%28false%29%29%3B%0A%20%20%7D%2C%20%5B%5D%29%3B%0A%0A%20%20function%20retry%28%29%20%7B%0A%20%20%20%20setLoading%28true%29%3B%0A%20%20%20%20loadPosts%28%29.finally%28%28%29%20%3D%3E%20setLoading%28false%29%29%3B%0A%20%20%7D%0A%0A%20%20if%20%28loading%29%20%7B%0A%20%20%20%20return%20%28%0A%20%20%20%20%20%20%3CView%20style%3D%7Bstyles.center%7D%3E%0A%20%20%20%20%20%20%20%20%3CActivityIndicator%20size%3D%22large%22%20%2F%3E%0A%20%20%20%20%20%20%20%20%3CText%3ELoading%20posts...%3C%2FText%3E%0A%20%20%20%20%20%20%3C%2FView%3E%0A%20%20%20%20%29%3B%0A%20%20%7D%0A%0A%20%20if%20%28error%29%20%7B%0A%20%20%20%20return%20%28%0A%20%20%20%20%20%20%3CView%20style%3D%7Bstyles.center%7D%3E%0A%20%20%20%20%20%20%20%20%3CText%20style%3D%7Bstyles.error%7D%3E%7Berror%7D%3C%2FText%3E%0A%20%20%20%20%20%20%20%20%3CButton%20title%3D%22Try%20Again%22%20onPress%3D%7Bretry%7D%20%2F%3E%0A%20%20%20%20%20%20%3C%2FView%3E%0A%20%20%20%20%29%3B%0A%20%20%7D%0A%0A%20%20return%20%28%0A%20%20%20%20%3CView%20style%3D%7Bstyles.container%7D%3E%0A%20%20%20%20%20%20%3CFlatList%0A%20%20%20%20%20%20%20%20data%3D%7Bposts%7D%0A%20%20%20%20%20%20%20%20keyExtractor%3D%7B%28item%29%20%3D%3E%20item.id.toString%28%29%7D%0A%20%20%20%20%20%20%20%20renderItem%3D%7B%28%7B%20item%20%7D%29%20%3D%3E%20%28%0A%20%20%20%20%20%20%20%20%20%20%3CPressable%0A%20%20%20%20%20%20%20%20%20%20%20%20style%3D%7Bstyles.row%7D%0A%20%20%20%20%20%20%20%20%20%20%20%20onPress%3D%7B%28%29%20%3D%3E%20navigation.navigate%28%22Details%22%2C%20%7B%20post%3A%20item%20%7D%29%7D%0A%20%20%20%20%20%20%20%20%20%20%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%3CText%20style%3D%7Bstyles.title%7D%3E%7Bitem.title%7D%3C%2FText%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%3CText%20style%3D%7Bstyles.subtitle%7D%20numberOfLines%3D%7B1%7D%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%7Bitem.body%7D%0A%20%20%20%20%20%20%20%20%20%20%20%20%3C%2FText%3E%0A%20%20%20%20%20%20%20%20%20%20%3C%2FPressable%3E%0A%20%20%20%20%20%20%20%20%29%7D%0A%20%20%20%20%20%20%20%20ListEmptyComponent%3D%7B%3CText%20style%3D%7Bstyles.empty%7D%3ENo%20posts%20yet.%3C%2FText%3E%7D%0A%20%20%20%20%20%20%2F%3E%0A%20%20%20%20%3C%2FView%3E%0A%20%20%29%3B%0A%7D%0A%0Afunction%20DetailsScreen%28%7B%20route%20%7D%29%20%7B%0A%20%20const%20%7B%20post%20%7D%20%3D%20route.params%3B%0A%0A%20%20return%20%28%0A%20%20%20%20%3CView%20style%3D%7Bstyles.detail%7D%3E%0A%20%20%20%20%20%20%3CText%20style%3D%7Bstyles.title%7D%3E%7Bpost.title%7D%3C%2FText%3E%0A%20%20%20%20%20%20%3CText%20style%3D%7Bstyles.body%7D%3E%7Bpost.body%7D%3C%2FText%3E%0A%20%20%20%20%3C%2FView%3E%0A%20%20%29%3B%0A%7D%0A%0Aexport%20default%20function%20MyApp%28%29%20%7B%0A%20%20return%20%28%0A%20%20%20%20%3CNavigationContainer%3E%0A%20%20%20%20%20%20%3CStack.Navigator%3E%0A%20%20%20%20%20%20%20%20%3CStack.Screen%20name%3D%22Posts%22%20component%3D%7BPostsScreen%7D%20%2F%3E%0A%20%20%20%20%20%20%20%20%3CStack.Screen%0A%20%20%20%20%20%20%20%20%20%20name%3D%22Details%22%0A%20%20%20%20%20%20%20%20%20%20component%3D%7BDetailsScreen%7D%0A%20%20%20%20%20%20%20%20%20%20options%3D%7B%28%7B%20route%20%7D%29%20%3D%3E%20%28%7B%20title%3A%20route.params.post.title%20%7D%29%7D%0A%20%20%20%20%20%20%20%20%2F%3E%0A%20%20%20%20%20%20%3C%2FStack.Navigator%3E%0A%20%20%20%20%3C%2FNavigationContainer%3E%0A%20%20%29%3B%0A%7D%0A%0Aconst%20styles%20%3D%20StyleSheet.create%28%7B%0A%20%20container%3A%20%7B%20flex%3A%201%20%7D%2C%0A%20%20center%3A%20%7B%20flex%3A%201%2C%20justifyContent%3A%20%22center%22%2C%20alignItems%3A%20%22center%22%20%7D%2C%0A%20%20row%3A%20%7B%0A%20%20%20%20padding%3A%2020%2C%0A%20%20%20%20borderBottomWidth%3A%201%2C%0A%20%20%20%20borderColor%3A%20%22%23ddd%22%2C%0A%20%20%7D%2C%0A%20%20title%3A%20%7B%20fontSize%3A%2018%2C%20fontWeight%3A%20%22600%22%20%7D%2C%0A%20%20subtitle%3A%20%7B%20fontSize%3A%2014%2C%20color%3A%20%22%23666%22%20%7D%2C%0A%20%20error%3A%20%7B%20color%3A%20%22red%22%2C%20textAlign%3A%20%22center%22%2C%20padding%3A%2020%20%7D%2C%0A%20%20empty%3A%20%7B%20padding%3A%2020%2C%20color%3A%20%22%23666%22%20%7D%2C%0A%20%20detail%3A%20%7B%20flex%3A%201%2C%20padding%3A%2020%20%7D%2C%0A%20%20body%3A%20%7B%20fontSize%3A%2016%2C%20lineHeight%3A%2024%2C%20marginTop%3A%2010%20%7D%2C%0A%7D%29%3B%0A&dependencies=%40react-navigation%2Fnative%40%5E7.0.0%2C%40react-navigation%2Fnative-stack%40%5E7.0.0%2Creact-native-safe-area-context%40~5.6.0%2Creact-native-screens%40~4.16.0)** (SDK 54, 필요한 패키지 자동 포함) <button class="snack-embed" type="button">👀 여기서 결과 보기</button>

**🇰🇷 한글 해설**

**완성 코드 해설**: Fetching List Data 완성 코드 + Stack(Posts, Details) + Pressable row + Details 화면. 4주차와 5주차가 합쳐진 형태라 Test 3에 나오기 딱 좋은 구조예요.

### 💻 Example: Pull to Refresh

- Users expect to refresh a list by pulling down on it. Social feeds, email and dashboards all do it.
- `FlatList` has it built in through two props, `refreshing` and `onRefresh`. There is no gesture code to write. React Native handles the pull, you handle the data.
- Pulling needs a touch screen, so it does nothing in the web preview. Switch the preview to **iOS** or **Android**, or choose **My Device** and open it in Expo Go.
- Start from the finished List and Detail code. Every change is inside `PostsScreen`.

**🇰🇷 한글 해설**

`refreshing` + `onRefresh` 두 prop. 제스처 코드 없음. Web에서는 안 되니 iOS/Android/Expo Go.

#### 💻 Step 1 - Track the Refresh

- Add a `refreshing` state under `error`, and a function that reloads the posts, next to `retry`.


<p class="typeit" id="practice-12">⌨️ <b>이 코드는 Snack에서 직접 쳐 보세요</b>: refreshing state + refresh 함수(true → loadPosts → finally false)</p>

```jsx
const [refreshing, setRefreshing] = useState(false);
```


<p class="typeit sm">⌨️ 이 부분도 직접 쳐 보세요</p>

```jsx
function refreshPosts() {
  setRefreshing(true);
  loadPosts().finally(() => setRefreshing(false));
}
```

- `loading` and `refreshing` are separate on purpose. The first load replaces the whole screen with a spinner. A refresh keeps the list on screen and spins at the top.

**🇰🇷 한글 해설**

**`loading`과 `refreshing`을 분리하는 이유** (Lab 5 Q6 주석 내용!): 첫 로드는 **화면 전체**를 스피너로 바꾸고, 새로고침은 **목록을 그대로 둔 채** 위에서만 돌아야 해요. state 하나로는 두 가지 다른 화면을 구분할 수 없어요.

#### 💻 Step 2 - Wire Up the List

- Add the two props to the `FlatList`.


<p class="typeit" id="practice-13">⌨️ <b>이 코드는 Snack에서 직접 쳐 보세요</b>: FlatList에 refreshing, onRefresh 연결</p>

```jsx
refreshing={refreshing}
onRefresh={refreshPosts}
```

- Pull down. The indicator appears at the top, the posts reload, and the indicator goes away. The list keeps its position.

**🇰🇷 한글 해설**

`<FlatList refreshing={refreshing} onRefresh={refresh} />`. 당기면 위에 스피너, 다시 로드, 스피너 사라짐, **스크롤 위치 유지**.

#### 💻 Step 3 - Prove It Reloaded

- The API returns the same 100 posts every time, so nothing visibly changed. Record when the data arrived.
- Add one more state.


<p class="typeit" id="practice-14">⌨️ <b>이 코드는 Snack에서 직접 쳐 보세요</b>: updated 시각 state + ListHeaderComponent로 표시</p>

```jsx
const [updatedAt, setUpdatedAt] = useState(null);
```

- Set it where the posts are stored, in `loadPosts`.


<p class="typeit sm">⌨️ 이 부분도 직접 쳐 보세요</p>

```jsx
.then((json) => {
  setPosts(json);
  setUpdatedAt(new Date());
  setError(null);
})
```

- Show it above the rows with `ListHeaderComponent`. It scrolls with the list, unlike a `Text` placed above the `FlatList`.


<p class="typeit sm">⌨️ 이 부분도 직접 쳐 보세요</p>

```jsx
ListHeaderComponent={
  <Text style={styles.updated}>
    Updated {updatedAt?.toLocaleTimeString()}
  </Text>
}
```

- Add its style.


<p class="typeit sm">⌨️ 이 부분도 직접 쳐 보세요</p>

```jsx
updated: { padding: 10, textAlign: "center", color: "#666" },
```

- Pull again. The time changes.
- Keep pull to refresh for manual reloads, and `useEffect` for the first load. Keep it fast: if the API is slow, the user is left holding the list.

**🇰🇷 한글 해설**

API가 매번 같은 데이터를 줘서 바뀐 게 안 보이니, 받은 **시각**을 state로 기록(`new Date()`), `toLocaleTimeString()`으로 표시. 위치는 **`ListHeaderComponent`**: 목록과 **같이 스크롤**돼요(FlatList 위에 둔 Text는 안 따라옴).

#### 💻 Finished PostsScreen

- Only `PostsScreen` changed. Compare against this if something is not working.

```jsx
function PostsScreen({ navigation }) {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [updatedAt, setUpdatedAt] = useState(null);

  function loadPosts() {
    return fetch(URL)
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then((json) => {
        setPosts(json);
        setUpdatedAt(new Date());
        setError(null);
      })
      .catch(() =>
        setError("Could not load the posts. Check your connection and try again.")
      );
  }

  useEffect(() => {
    loadPosts().finally(() => setLoading(false));
  }, []);

  function retry() {
    setLoading(true);
    loadPosts().finally(() => setLoading(false));
  }

  function refreshPosts() {
    setRefreshing(true);
    loadPosts().finally(() => setRefreshing(false));
  }

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
        <Text>Loading posts...</Text>
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
      <FlatList
        data={posts}
        keyExtractor={(item) => item.id.toString()}
        refreshing={refreshing}
        onRefresh={refreshPosts}
        renderItem={({ item }) => (
          <Pressable
            style={styles.row}
            onPress={() => navigation.navigate("Details", { post: item })}
          >
            <Text style={styles.title}>{item.title}</Text>
            <Text style={styles.subtitle} numberOfLines={1}>
              {item.body}
            </Text>
          </Pressable>
        )}
        ListHeaderComponent={
          <Text style={styles.updated}>
            Updated {updatedAt?.toLocaleTimeString()}
          </Text>
        }
        ListEmptyComponent={<Text style={styles.empty}>No posts yet.</Text>}
      />
    </View>
  );
}
```

- Add the `updated` style to the `StyleSheet` at the bottom.

```jsx
updated: { padding: 10, textAlign: "center", color: "#666" },
```

**🇰🇷 한글 해설**

**완성 코드 해설**: state 5개(posts, loading, error, refreshing, updated). `loadPosts`가 성공 시 posts와 updated를 같이 set. `refresh`: `setRefreshing(true)` → loadPosts → finally `setRefreshing(false)`. FlatList에 refreshing, onRefresh, ListHeaderComponent, ListEmptyComponent.


---

## 7. 🧪 Lab: Lab 5 - Lists

<div class="sum" data-kind="lab">

**🧭 먼저 한국어로** · 🧪 혼자 풀어 보기

연락처 앱을 Q1부터 Q6까지 쌓아 가는 랩이에요. 💻 예제를 다 쳐 본 다음, 예제를 보지 않고 혼자 풀어 보세요. 막히면 아래 한글 해설의 힌트만 보세요.

**이 챕터 구성**

- ⏭️ **A Note on AI**: AI는 막혔을 때만, 내가 설명할 수 없는 코드는 내 것이 아니라는 안내예요.
- ⏭️ **Overview**: 문제 6개, 각 1점.
- 👀 **Setup**: 시작 코드(연락처 데이터와 스타일)예요. Snack으로 열어서 시작하세요.
- ⏭️ **Styling Rules**: StyleSheet.create 사용 등 스타일 규칙이에요.
- ⏭️ **Running Your App**: 실행 방법 안내예요.
- ⏭️ **Submission**: 제출 방법이에요.
- 🧪 **Question 1 - FlatList (1 point)**: 💻 Example: FlatList와 같은 문제예요. 연락처를 FlatList로.
- 🧪 **Question 2 - Sorting (1 point)**: 💻 Sorting Step 1과 같은 패턴이에요.
- 🧪 **Question 3 - Search, Count and Empty State (1 point)**: 💻 Sorting Step 2, 3 + 몇 개 보이는지 개수 표시.
- 🧪 **Question 4 - Fetching the Contacts (1 point)**: 💻 Fetching List Data 전체 흐름. res.ok 확인 잊지 말기.
- 🧪 **Question 5 - Contact Screen (1 point)**: 💻 List and Detail과 같은 구조예요.
- 🧪 **Question 6 - Pull to Refresh (1 point)**: 💻 Pull to Refresh와 같아요. loading과 refreshing 분리.

</div>

> 원문 출처: github.com/nick-romanidis/web530-2267-nsa  lab-5.md

**🇰🇷 들어가기 전에**

Lab 5는 연락처 앱 하나를 Q1부터 Q6까지 쌓아 가는 구조로, 5주차 인클래스 예제 순서와 거의 같아요. **Test 3 대비 최고의 연습 문제**예요. 아래에 각 문제의 연결 예제와 주석에 쓸 "내 말로 설명" 포인트를 정리했어요.

### 🧪 A Note on AI

AI assistants are welcome in this course, but use them to get unstuck, not to do the work. Attempt every question yourself first. If you are stuck, paste **your** code and ask why it does not work or what concept you are missing, rather than asking for the answer. Never keep code you could not explain line by line to a classmate. If you cannot explain it, you cannot debug it or build on it, and it is not yours yet. The point of this lab is not the finished Snack. It is being able to put any array on screen as a list, and to handle everything that can happen while that array is on its way from a server.

**🇰🇷 한글 해설**

AI는 막힐 때만. 주석으로 "내 말로 설명" 요구가 많은 랩이라 개념 이해가 중요해요.

### 🧪 Overview

You build one app, a contact list, and each question adds to it. Plan for about 60 minutes.

- Questions 1 to 3 use a small array of contacts that is already in the starter.
- Question 4 swaps that array for real data from an API.
- Questions 5 and 6 add a contact screen and pull to refresh.

Because every question builds on the one before, do them in order. Your submitted Snack shows the finished app, and it is marked against all six questions.

**🇰🇷 한글 해설**

연락처 앱 하나를 단계별로. Q1~3 로컬 배열, Q4 API, Q5 상세 화면, Q6 새로고침. 순서대로.

### 🧪 Setup

1. Open the React Native Playground (Snack) at https://snack.expo.dev and sign in.
2. Rename the Snack to `WEB530 Lab 5 - Your Name` (click the name at the top left).
3. Keep Snack on SDK 54 (the default). SDK 55 does not load `react-native-screens`, so the navigation in this lab does not run on it.
4. In the file list on the left, add a new file named `styles.js` in the same folder as `App.js`.
5. Replace the contents of `package.json`, `App.js` and `styles.js` with the three starter files below.
6. Click **Save** so the Snack gets a permanent link.

Starter for `package.json`:

```json
{
  "dependencies": {
    "@react-navigation/native": "^7.0.0",
    "@react-navigation/native-stack": "^7.0.0",
    "react-native-screens": "~4.16.0",
    "react-native-safe-area-context": "~5.6.0"
  }
}
```

Starter for `App.js`:

```jsx
import { View, Text } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import styles from "./styles";

// Questions 1 to 3 use this array. Question 4 replaces it with the API.
const CONTACTS = [
  {
    id: 1,
    name: "Priya Shah",
    email: "priya@example.com",
    address: { city: "Toronto" },
  },
  {
    id: 2,
    name: "Marcus Lee",
    email: "marcus@example.com",
    address: { city: "Ottawa" },
  },
  {
    id: 3,
    name: "Ana Costa",
    email: "ana@example.com",
    address: { city: "Toronto" },
  },
  {
    id: 4,
    name: "Liam O'Brien",
    email: "liam@example.com",
    address: { city: "Halifax" },
  },
  {
    id: 5,
    name: "Sofia Rossi",
    email: "sofia@example.com",
    address: { city: "Vancouver" },
  },
  {
    id: 6,
    name: "Daniel Kim",
    email: "daniel@example.com",
    address: { city: "Montreal" },
  },
];

const Stack = createNativeStackNavigator();

function ContactsScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <Text>Your list goes here</Text>
    </View>
  );
}

export default function MyApp() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Contacts" component={ContactsScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
```

▶ 이 코드는 다른 파일(또는 Expo Router의 app 폴더 구조)이 필요해서 Snack 한 파일로는 실행되지 않아요. VS Code 로컬 Expo 프로젝트에서 해당 파일에 붙여 넣어 실행하세요.

Starter for `styles.js`:

```js
import { StyleSheet } from "react-native";

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
});
```

▶ **[Snack에서 바로 실행하기](https://snack.expo.dev/?name=WEB530%20W5%20Setup&platform=web&sdkVersion=54.0.0&code=import%20%7B%20StyleSheet%20%7D%20from%20%22react-native%22%3B%0A%0Aexport%20default%20StyleSheet.create%28%7B%0A%20%20container%3A%20%7B%0A%20%20%20%20flex%3A%201%2C%0A%20%20%20%20backgroundColor%3A%20%22%23fff%22%2C%0A%20%20%7D%2C%0A%7D%29%3B%0A)** (SDK 54, 필요한 패키지 자동 포함) <button class="snack-embed" type="button">👀 여기서 결과 보기</button>

The stack navigator is already there, so the app has a **Contacts** header from the start and you do not need `marginTop` to get below the status bar. Look at the shape of each contact: the city is inside an `address` object. That is on purpose. It matches the API you switch to in Question 4.

**🇰🇷 한글 해설**

SDK 54 유지, `styles.js` 분리, starter 파일 3개 교체. 스택이 이미 있어서 marginTop 불필요. 도시가 `address` 객체 안에 있는 건 Q4의 API 모양과 맞추려고.

### 🧪 Styling Rules

- Every style is in `styles.js`, created with `StyleSheet.create()`, as in Lab 3. There are **no** inline `style={{ ... }}` objects anywhere in `App.js`.
- Style names describe what they are for (`row`, `contactName`, `searchInput`), not what they look like (`bold`, `grey`, `box1`).
- Keep the styling simple. This lab is about lists, not looks.

**🇰🇷 한글 해설**

모든 스타일은 styles.js, **인라인 스타일 0개**, 스타일 이름은 용도로.

### 🧪 Running Your App

The **Web** preview is enough for Questions 1 to 5. Pull to refresh in Question 6 needs a touch screen, so check it on the **Android** or **iOS** tab, or on your phone with **My Device** and Expo Go.

**🇰🇷 한글 해설**

Q1~5는 Web으로 충분, Q6(당겨서 새로고침)은 터치 필요.

### 🧪 Submission

- Submit **one** Snack link to the `Lab 5` assessment in Blackboard. After you save, the link looks like `https://snack.expo.dev/@yourname/web530-lab-5-...`.
- The lab is due at the end of class. Submit before you leave.
- Only students who participate in class and hand in a lab slip can receive marks for this lab. If you miss the class, you are still encouraged to complete it as practice.
- Before submitting, save one last time and open your link in a private browser window to confirm it loads without signing in.

**🇰🇷 한글 해설**

수업 끝나기 전 Snack 링크 제출, 시크릿 창으로 확인.

### 🧪 Question 1 - FlatList (1 point)

Replace the placeholder `Text` in `ContactsScreen` with a `FlatList` that shows every contact in `CONTACTS`.

Each row shows:

- The contact's **name**, large and bold, with the **email** under it in a smaller grey font.
- The contact's **city** on the right-hand side of the row, in a colour of your choice.
- A thin line under each row to separate it from the next.

Requirements:

- Use `FlatList` with `data`, `renderItem` and `keyExtractor`. Do not use `ScrollView` or `.map()` for the rows.
- The `id`s are numbers. Your `keyExtractor` must return a string.
- The name and email sit on the left, the city on the right, and a long name must not push the city off the screen. Use flexbox from week 3, not a fixed `width`.

Hint: Make the row a `View` with `flexDirection: "row"`. Wrap the name and email in their own `View` and give it `flex: 1`, so it takes all the space the city does not need. The city is at `item.address.city`.

**🇰🇷 한글 해설**

**연결**: 5.1 FlatList.
- `data`, `renderItem`, `keyExtractor`(id가 숫자 → `item.id.toString()`). ScrollView/`.map()` 금지.
- 레이아웃: row에 `flexDirection: "row"`, 이름+이메일 View에 **`flex: 1`** → 도시가 필요한 만큼만 쓰고 나머지를 차지. 긴 이름이 도시를 밀어내지 않아요. 고정 width 금지.
- 도시는 `item.address.city`. 구분선은 `borderBottomWidth`.

### 🧪 Question 2 - Sorting (1 point)

Add two buttons above the list: `Sort by name` and `Sort by city`.

- The list starts sorted by name, A to Z.
- `Sort by city` sorts the list by city, A to Z. Contacts in the **same city** are sorted by name. With the starter data, Ana Costa must come before Priya Shah, even though Priya is first in the array.
- The button for the order that is already showing is **disabled**. When the app starts, `Sort by name` is disabled.

Requirements:

- One piece of state holds which sort is active, for example `"name"` or `"city"`.
- The sorted array is **not** stored in state. Build it from `CONTACTS` and the sort state on every render, above the `return`.
- The original `CONTACTS` array must never be changed. Add a comment above your sort explaining, in your own words, why you copy the array before calling `.sort()` instead of sorting `CONTACTS` itself.
- Lay out the two buttons side by side in a row.

Hint: `localeCompare` returns `0` when two strings are equal, and `0` is falsy. So `a.address.city.localeCompare(b.address.city) || a.name.localeCompare(b.name)` compares cities first, and only compares names when the cities are the same.

**🇰🇷 한글 해설**

**연결**: 5.1 Sorting Step 1.
- state는 `sortBy` 하나(`"name"` / `"city"`). 정렬된 배열은 state 아님(derived).
- 도시 같으면 이름순: `a.address.city.localeCompare(b.address.city) || a.name.localeCompare(b.name)`. localeCompare는 같으면 **0**(falsy) → `||` 오른쪽으로.
- 현재 정렬 버튼은 `disabled={sortBy === "name"}`.
- 주석(내 말로): `.sort()`는 원본을 직접 바꾸니까, 원본 CONTACTS를 지키려고 `[...CONTACTS]` 복사본을 정렬한다.

### 🧪 Question 3 - Search, Count and Empty State (1 point)

Add a controlled `TextInput` between the buttons and the list, with the placeholder `Search by name or city`.

- Typing filters the list. A contact stays in the list if the text appears in its **name or its city**. Upper and lower case do not matter: `tor`, `TOR` and `Tor` all find both Toronto contacts.
- The search and the sort work together. Search `o` and then switch the sort, and the filtered list re-sorts.
- Above the first row, show `Showing N of M contacts`, where `N` is the number of rows on screen and `M` is the total number of contacts. This text must scroll with the list.
- When nothing matches, the list shows `No contacts match "TEXT".` with the search text in it, for example `No contacts match "zz".`

Requirements:

- Filter first, then sort, in the same derived array as Question 2. There is still only the sort state and the search text in state.
- `.filter()` returns a new array, so the copy from Question 2 is no longer needed. Keep your Question 2 comment and update it to say what keeps the original array safe now.
- Use `ListHeaderComponent` for the count and `ListEmptyComponent` for the empty message. A `Text` placed above the `FlatList` does not scroll with it, so it does not count.

**🇰🇷 한글 해설**

**연결**: 5.1 Sorting Step 2~3.
- 이름 **또는** 도시에 포함되면 남기기, `toLowerCase()`로 대소문자 무시.
- 필터 → 정렬 순서. `.filter()`가 새 배열이라 복사 불필요 → Q2 주석을 "filter가 새 배열을 만들어서 원본이 안전하다"로 수정.
- `Showing N of M contacts` → **ListHeaderComponent**(같이 스크롤). N = 결과 길이, M = 전체 길이.
- `No contacts match "zz".` → **ListEmptyComponent**.

### 🧪 Question 4 - Fetching the Contacts (1 point)

Replace the starter data with real data from this API, which returns ten users in the same shape as the starter array (plus a few extra fields):

`https://jsonplaceholder.typicode.com/users`

Open the link in a browser tab first and find `name`, `email` and `address.city` in the first user.

- **Delete** the `CONTACTS` array. The contacts now live in state, start as an empty array, and are loaded once when the screen first renders.
- While the first load is running, the whole screen shows an `ActivityIndicator` and the text `Loading contacts...` instead of the list.
- If the load fails, the whole screen shows a message for the user and a `Try Again` button that shows the spinner and loads again. The message must say what happened and what to do. No status codes.
- If the load succeeds but the API returns no contacts, the list shows `No contacts yet.` instead of `No contacts match "".` The match message from Question 3 is only for when the user has typed something.
- `Showing N of M contacts` still works, now out of 10.

Requirements:

- Use `useEffect` with an empty dependency array, and `fetch`.
- Check `res.ok` before calling `res.json()`. Add a comment above that check explaining, in your own words, why `.catch()` alone is not enough.
- Test all three cases before you move on, and put the URL back after each one:
  - The error screen: change the end of the URL to `/userz`. The API answers 404.
  - `Try Again`: with the URL still broken, press it. The spinner shows, then the error comes back.
  - The empty list: change the end of the URL to `/users?id=99`. No user has that id, so the API returns `[]`.

Hint: This is the Fetching List Data example from the week 5 notes. Use the same three pieces of state and the same early `return`s, then check that your Question 1 to 3 code still works with `contacts` in place of `CONTACTS`.

**🇰🇷 한글 해설**

**연결**: 5.1 Fetching List Data 완성 코드 그대로의 패턴.
- contacts state(빈 배열 시작), loading, error 세 개. early return.
- 주석(내 말로): fetch는 네트워크 실패에만 reject하고 404, 500은 정상 응답으로 오기 때문에 `.catch()`만으로는 못 잡는다. 그래서 `res.ok`를 확인해서 직접 throw 한다.
- 빈 목록 메시지 분기: 검색어가 있으면 `No contacts match "..."`, 없으면 `No contacts yet.`
- 세 가지 테스트(`/userz`, Try Again, `/users?id=99`)를 직접 해 보기.

### 🧪 Question 5 - Contact Screen (1 point)

Pressing a row opens a second screen in the stack that shows that contact's full details.

- Register a second screen in the stack named `Contact`. Its header title is the contact's name.
- Each row is a `Pressable`. Pressing it navigates to `Contact` with **two params only**: the contact's `id` and `name`. Do **not** pass the whole contact object.
- The contact screen fetches that one contact itself from `https://jsonplaceholder.typicode.com/users/ID`, where `ID` is the `id` param. While it loads, the screen shows an `ActivityIndicator`.
- When it has loaded, the screen shows the contact's name as a large heading, then their email, phone, website, street and city, and company name, each with a label (`Email:`, `Phone:` and so on). The company catch phrase goes last, in italics.
- If the request fails, the screen shows `Could not load this contact.` To check it, temporarily change the URL on this screen to end in `/users/99`.
- Going back keeps the list as it was: the same sort, the same search text.

Requirements:

- The contact screen's `useEffect` has `[id]` as its dependency array.
- Add a comment above your `navigate` call explaining, in your own words, why this app passes only the `id` instead of the whole contact, and what it costs.

Hint: `options` can be a function that receives `route`, as in week 4. The phone and website are at the top level of the user, the street is `address.street`, and the company fields are `company.name` and `company.catchPhrase`. A `Text` inside a `Text`, from Lab 3, lets you make only the label bold.

**🇰🇷 한글 해설**

**연결**: 코스노트 Fetching Detail Data + 4주차 options 함수.
- params는 **id와 name만**. 상세 화면이 `/users/${id}`를 fetch, `useEffect(..., [id])`.
- 헤더 title은 `route.params?.name`.
- 라벨만 굵게: Text 안의 Text(`<Text><Text style={bold}>Email: </Text>{user.email}</Text>`).
- 주석(내 말로): id만 넘기면 params가 작고 상세 화면이 항상 최신 데이터를 보여 주지만, 화면을 열 때마다 요청을 한 번 더 보내고 로딩을 기다려야 한다(비용).

### 🧪 Question 6 - Pull to Refresh (1 point)

Let the user reload the contacts by pulling down on the list.

- Pulling down on the list shows the refresh spinner at the top, reloads the contacts from the API, and hides the spinner when it is done.
- During a refresh the list **stays on screen**. The full-screen `Loading contacts...` spinner from Question 4 is only for the first load and for `Try Again`.
- The search text and the sort survive a refresh.
- Under `Showing N of M contacts`, show `Updated` and the time the contacts last arrived, for example `Updated 10:42:07 AM`. Every successful load or refresh updates it.

Requirements:

- Use the `refreshing` and `onRefresh` props of `FlatList`. Do not write any gesture code.
- The refresh has its own piece of state, separate from the loading state. Add a comment above it explaining, in your own words, why one `loading` state cannot do both jobs.
- Store the time in state where the contacts are stored, and show it with `toLocaleTimeString()`.

Check this one on the **Android** or **iOS** tab, or on your phone. Pulling does nothing in the web preview. The API returns the same ten users every time, so the updated time is how you know the refresh worked.

**🇰🇷 한글 해설**

**연결**: 5.1 Pull to Refresh.
- `refreshing` 별도 state. 주석(내 말로): 첫 로드는 화면 전체를 스피너로 바꾸고 새로고침은 목록을 유지해야 해서, 한 state로는 두 상황을 구분할 수 없다.
- `Updated 10:42:07 AM` → contacts를 저장하는 곳에서 `new Date()` 저장, `toLocaleTimeString()`.
- 검색어와 정렬은 state라서 새로고침 후에도 유지돼요.


---

## ✅ Week 5 시험 대비 체크리스트

1. FlatList가 `.map()`보다 나은 이유? → virtualization, 보이는 근처만 렌더링
2. FlatList 필수 3 props? → `data`, `renderItem`, `keyExtractor`
3. renderItem의 파라미터 모양? → `({ item, index })` 객체, 보통 `({ item })`
4. keyExtractor 반환 타입? → **문자열** (숫자 id는 `.toString()`)
5. FlatList가 안 보이거나 스크롤 안 될 때? → 부모에 `flex: 1`
6. windowSize 기본값과 의미? → 21 (위 10 + 현재 + 아래 10 화면)
7. `.sort()` 전에 복사하는 이유? → sort는 원본을 바꿈(in place). `.filter()`는 새 배열
8. 정렬 결과를 state에 저장하나? → 아니요, derived(매 렌더링 계산)
9. 숫자 정렬 / 문자열 정렬? → `a - b` / `a.localeCompare(b)`
10. 필터와 정렬 순서? → 필터 먼저
11. ListEmptyComponent / ListHeaderComponent 역할?
12. fetch가 404에서 catch로 안 가는 이유와 해결? → reject는 네트워크 실패만 / `if (!res.ok) throw`
13. 데이터 로딩 3가지 상태? → loading, error, empty
14. `.finally()`를 쓰는 이유? → 성공/실패 상관없이 스피너 끄기
15. useEffect 안 async 패턴? → 안에 async 함수 정의 후 호출, cleanup 깃발
16. Pressable과 numberOfLines={1}?
17. params로 전체 객체 vs id만? 장단점
18. Pull to refresh 두 props? → `refreshing`, `onRefresh` / Web에서 안 됨
19. loading과 refreshing을 분리하는 이유?
20. 무한 스크롤 prop? → `onEndReached`, `onEndReachedThreshold`

**손으로 써 보기 과제**: Test 3 스타일 미니 앱. jsonplaceholder의 todos를 불러와서 검색, 완료/미완료 정렬, 빈 상태, 에러 + 재시도, 당겨서 새로고침까지. 보지 않고 써 본 뒤 비교하세요.

```jsx
import { useEffect, useState } from "react";
import { View, Text, FlatList, TextInput, Button, ActivityIndicator, StyleSheet } from "react-native";

const URL = "https://jsonplaceholder.typicode.com/todos?userId=1";

export default function App() {
  const [todos, setTodos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);
  const [query, setQuery] = useState("");
  const [doneFirst, setDoneFirst] = useState(false);

  const loadTodos = async () => {
    try {
      const res = await fetch(URL);
      // fetch only rejects on network failure, so check the status ourselves
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      setTodos(data);
      setError(null);
    } catch (e) {
      setError("Could not load your todos. Check your connection and try again.");
    }
  };

  useEffect(() => {
    loadTodos().finally(() => setLoading(false));
  }, []);

  const retry = () => {
    setLoading(true);
    loadTodos().finally(() => setLoading(false));
  };

  const refresh = () => {
    setRefreshing(true);
    loadTodos().finally(() => setRefreshing(false));
  };

  // derived, not state
  const visible = todos
    .filter((t) => t.title.toLowerCase().includes(query.toLowerCase()))
    .sort((a, b) => (doneFirst ? Number(b.completed) - Number(a.completed) : a.id - b.id));

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
        <Text>Loading todos...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.center}>
        <Text>{error}</Text>
        <Button title="Try Again" onPress={retry} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Button
        title={doneFirst ? "Sort by id" : "Done first"}
        onPress={() => setDoneFirst((prev) => !prev)}
      />
      <TextInput style={styles.input} placeholder="Search" value={query} onChangeText={setQuery} />
      <FlatList
        data={visible}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.row}>
            <Text style={styles.title}>{item.title}</Text>
            <Text>{item.completed ? "Done" : "Todo"}</Text>
          </View>
        )}
        ListHeaderComponent={<Text>Showing {visible.length} of {todos.length}</Text>}
        ListEmptyComponent={<Text>No todos match "{query}".</Text>}
        refreshing={refreshing}
        onRefresh={refresh}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingTop: 60, paddingHorizontal: 16 },
  center: { flex: 1, alignItems: "center", justifyContent: "center", gap: 8 },
  input: { borderWidth: 1, borderColor: "#ccc", padding: 8, marginVertical: 8 },
  row: { flexDirection: "row", paddingVertical: 10, borderBottomWidth: 1, borderColor: "#eee" },
  title: { flex: 1 },
});
```

▶ **[Snack에서 바로 실행하기](https://snack.expo.dev/?name=WEB530%20W5%20practice&platform=web&sdkVersion=54.0.0&code=import%20%7B%20useEffect%2C%20useState%20%7D%20from%20%22react%22%3B%0Aimport%20%7B%20View%2C%20Text%2C%20FlatList%2C%20TextInput%2C%20Button%2C%20ActivityIndicator%2C%20StyleSheet%20%7D%20from%20%22react-native%22%3B%0A%0Aconst%20URL%20%3D%20%22https%3A%2F%2Fjsonplaceholder.typicode.com%2Ftodos%3FuserId%3D1%22%3B%0A%0Aexport%20default%20function%20App%28%29%20%7B%0A%20%20const%20%5Btodos%2C%20setTodos%5D%20%3D%20useState%28%5B%5D%29%3B%0A%20%20const%20%5Bloading%2C%20setLoading%5D%20%3D%20useState%28true%29%3B%0A%20%20const%20%5Brefreshing%2C%20setRefreshing%5D%20%3D%20useState%28false%29%3B%0A%20%20const%20%5Berror%2C%20setError%5D%20%3D%20useState%28null%29%3B%0A%20%20const%20%5Bquery%2C%20setQuery%5D%20%3D%20useState%28%22%22%29%3B%0A%20%20const%20%5BdoneFirst%2C%20setDoneFirst%5D%20%3D%20useState%28false%29%3B%0A%0A%20%20const%20loadTodos%20%3D%20async%20%28%29%20%3D%3E%20%7B%0A%20%20%20%20try%20%7B%0A%20%20%20%20%20%20const%20res%20%3D%20await%20fetch%28URL%29%3B%0A%20%20%20%20%20%20%2F%2F%20fetch%20only%20rejects%20on%20network%20failure%2C%20so%20check%20the%20status%20ourselves%0A%20%20%20%20%20%20if%20%28%21res.ok%29%20throw%20new%20Error%28%60HTTP%20%24%7Bres.status%7D%60%29%3B%0A%20%20%20%20%20%20const%20data%20%3D%20await%20res.json%28%29%3B%0A%20%20%20%20%20%20setTodos%28data%29%3B%0A%20%20%20%20%20%20setError%28null%29%3B%0A%20%20%20%20%7D%20catch%20%28e%29%20%7B%0A%20%20%20%20%20%20setError%28%22Could%20not%20load%20your%20todos.%20Check%20your%20connection%20and%20try%20again.%22%29%3B%0A%20%20%20%20%7D%0A%20%20%7D%3B%0A%0A%20%20useEffect%28%28%29%20%3D%3E%20%7B%0A%20%20%20%20loadTodos%28%29.finally%28%28%29%20%3D%3E%20setLoading%28false%29%29%3B%0A%20%20%7D%2C%20%5B%5D%29%3B%0A%0A%20%20const%20retry%20%3D%20%28%29%20%3D%3E%20%7B%0A%20%20%20%20setLoading%28true%29%3B%0A%20%20%20%20loadTodos%28%29.finally%28%28%29%20%3D%3E%20setLoading%28false%29%29%3B%0A%20%20%7D%3B%0A%0A%20%20const%20refresh%20%3D%20%28%29%20%3D%3E%20%7B%0A%20%20%20%20setRefreshing%28true%29%3B%0A%20%20%20%20loadTodos%28%29.finally%28%28%29%20%3D%3E%20setRefreshing%28false%29%29%3B%0A%20%20%7D%3B%0A%0A%20%20%2F%2F%20derived%2C%20not%20state%0A%20%20const%20visible%20%3D%20todos%0A%20%20%20%20.filter%28%28t%29%20%3D%3E%20t.title.toLowerCase%28%29.includes%28query.toLowerCase%28%29%29%29%0A%20%20%20%20.sort%28%28a%2C%20b%29%20%3D%3E%20%28doneFirst%20%3F%20Number%28b.completed%29%20-%20Number%28a.completed%29%20%3A%20a.id%20-%20b.id%29%29%3B%0A%0A%20%20if%20%28loading%29%20%7B%0A%20%20%20%20return%20%28%0A%20%20%20%20%20%20%3CView%20style%3D%7Bstyles.center%7D%3E%0A%20%20%20%20%20%20%20%20%3CActivityIndicator%20size%3D%22large%22%20%2F%3E%0A%20%20%20%20%20%20%20%20%3CText%3ELoading%20todos...%3C%2FText%3E%0A%20%20%20%20%20%20%3C%2FView%3E%0A%20%20%20%20%29%3B%0A%20%20%7D%0A%0A%20%20if%20%28error%29%20%7B%0A%20%20%20%20return%20%28%0A%20%20%20%20%20%20%3CView%20style%3D%7Bstyles.center%7D%3E%0A%20%20%20%20%20%20%20%20%3CText%3E%7Berror%7D%3C%2FText%3E%0A%20%20%20%20%20%20%20%20%3CButton%20title%3D%22Try%20Again%22%20onPress%3D%7Bretry%7D%20%2F%3E%0A%20%20%20%20%20%20%3C%2FView%3E%0A%20%20%20%20%29%3B%0A%20%20%7D%0A%0A%20%20return%20%28%0A%20%20%20%20%3CView%20style%3D%7Bstyles.container%7D%3E%0A%20%20%20%20%20%20%3CButton%0A%20%20%20%20%20%20%20%20title%3D%7BdoneFirst%20%3F%20%22Sort%20by%20id%22%20%3A%20%22Done%20first%22%7D%0A%20%20%20%20%20%20%20%20onPress%3D%7B%28%29%20%3D%3E%20setDoneFirst%28%28prev%29%20%3D%3E%20%21prev%29%7D%0A%20%20%20%20%20%20%2F%3E%0A%20%20%20%20%20%20%3CTextInput%20style%3D%7Bstyles.input%7D%20placeholder%3D%22Search%22%20value%3D%7Bquery%7D%20onChangeText%3D%7BsetQuery%7D%20%2F%3E%0A%20%20%20%20%20%20%3CFlatList%0A%20%20%20%20%20%20%20%20data%3D%7Bvisible%7D%0A%20%20%20%20%20%20%20%20keyExtractor%3D%7B%28item%29%20%3D%3E%20item.id.toString%28%29%7D%0A%20%20%20%20%20%20%20%20renderItem%3D%7B%28%7B%20item%20%7D%29%20%3D%3E%20%28%0A%20%20%20%20%20%20%20%20%20%20%3CView%20style%3D%7Bstyles.row%7D%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%3CText%20style%3D%7Bstyles.title%7D%3E%7Bitem.title%7D%3C%2FText%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%3CText%3E%7Bitem.completed%20%3F%20%22Done%22%20%3A%20%22Todo%22%7D%3C%2FText%3E%0A%20%20%20%20%20%20%20%20%20%20%3C%2FView%3E%0A%20%20%20%20%20%20%20%20%29%7D%0A%20%20%20%20%20%20%20%20ListHeaderComponent%3D%7B%3CText%3EShowing%20%7Bvisible.length%7D%20of%20%7Btodos.length%7D%3C%2FText%3E%7D%0A%20%20%20%20%20%20%20%20ListEmptyComponent%3D%7B%3CText%3ENo%20todos%20match%20%22%7Bquery%7D%22.%3C%2FText%3E%7D%0A%20%20%20%20%20%20%20%20refreshing%3D%7Brefreshing%7D%0A%20%20%20%20%20%20%20%20onRefresh%3D%7Brefresh%7D%0A%20%20%20%20%20%20%2F%3E%0A%20%20%20%20%3C%2FView%3E%0A%20%20%29%3B%0A%7D%0A%0Aconst%20styles%20%3D%20StyleSheet.create%28%7B%0A%20%20container%3A%20%7B%20flex%3A%201%2C%20paddingTop%3A%2060%2C%20paddingHorizontal%3A%2016%20%7D%2C%0A%20%20center%3A%20%7B%20flex%3A%201%2C%20alignItems%3A%20%22center%22%2C%20justifyContent%3A%20%22center%22%2C%20gap%3A%208%20%7D%2C%0A%20%20input%3A%20%7B%20borderWidth%3A%201%2C%20borderColor%3A%20%22%23ccc%22%2C%20padding%3A%208%2C%20marginVertical%3A%208%20%7D%2C%0A%20%20row%3A%20%7B%20flexDirection%3A%20%22row%22%2C%20paddingVertical%3A%2010%2C%20borderBottomWidth%3A%201%2C%20borderColor%3A%20%22%23eee%22%20%7D%2C%0A%20%20title%3A%20%7B%20flex%3A%201%20%7D%2C%0A%7D%29%3B%0A)** (SDK 54, 필요한 패키지 자동 포함) <button class="snack-embed" type="button">👀 여기서 결과 보기</button>

**해설**: state는 6개지만 `visible`은 state가 아니라 매번 계산해요. 첫 로드와 Try Again은 `loading`(전체 화면 스피너), 당겨서 새로고침은 `refreshing`(목록 유지)으로 나눴어요. `Number(true)`는 1, `Number(false)`는 0이라 완료된 것을 앞으로 보낼 수 있어요.
