# Week 5. Lists: FlatList, 정렬과 검색, 데이터 불러오기, 목록과 상세, 당겨서 새로고침

> 이 노트 읽는 법: **📘/💻/🧪 원문**(영어 그대로) 바로 밑에 **🇰🇷 한글 해설**이 있어요. 코드 밑의 **▶ Snack에서 바로 실행하기**를 누르면 그 코드가 Expo Snack에서 열려요. **5~7주차는 Test 2 범위**라서 특히 꼼꼼하게 정리했어요.

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

{{TOC}}

@@NOTE E-Lists/working-with-lists.md
@@K FlatList
**FlatList** = iOS, Android 둘 다에서 목록을 보여 주는 **권장** 방법.
- `.map()`은 아이템을 **전부 한 번에** 그려서 비효율. FlatList는 **virtualization**(화면에 보이는 것 위주로만 렌더링)으로 최적화.
- `data`에 객체 배열을 넘기고, 각 객체엔 **안정적이고 고유한 key**가 필요해요. `id`나 `key` 속성, 또는 `keyExtractor`로 지정. 없으면 배열 위치(index)를 쓰고 **경고**, 목록이 바뀔 때 엉뚱한 줄이 업데이트될 수 있어요.

예제 해설:
- `new Array(10).fill(null).map((v, i) => ({ id: i.toString(), title: `Item ${i}` }))` → 10칸짜리 빈 배열을 null로 채우고 map으로 객체 10개 생성.
- `React.memo(...)`로 감싼 `Row` → **memoized(기억된)** 컴포넌트. props가 안 바뀌면 다시 안 그려요(성능).
- `initialNumToRender={10}` 처음에 그릴 개수, `windowSize={10}` 메모리에 유지할 범위.
- 💡 FlatList는 **PureComponent**: props가 **얕게(shallow)** 바뀌었을 때만 다시 렌더링. 그래서 row를 `React.memo()`로 감싸면 불필요한 업데이트를 막아요.
@@K Fixed Height Rows
줄 높이가 **고정**이면 `getItemLayout`으로 미리 알려 줘요. `length`(줄 높이), `offset`(위에서부터 거리 = 높이 × index), `index`. 특정 위치로 스크롤할 때 빠르고, 레이아웃이 튀지 않아요.

@@NOTE E-Lists/sorting-lists.md
@@K _pre
**정렬과 검색의 원리**: FlatList는 `data` 배열을 그대로 그려요. 배열을 바꾸면(추가, 삭제, 정렬, 필터) 목록이 **자동으로** 다시 그려져요. UI를 건드릴 필요가 없어요.

코스노트는 정렬/필터를 **`useMemo`** 로 감싸라고 해요. `useMemo(() => 계산, [의존성])` 는 의존성이 바뀔 때만 다시 계산하고 아니면 **이전 결과를 재사용**(메모이제이션)해요. (인클래스에서는 "목록이 클 때까지는 생략해도 된다"고 했어요. 같은 아이디어.)

예제 해설:
- state 2개: `ascending`(정렬 방향, boolean), `filter`(검색어).
- 필터: `filter ? itemsToShow.filter(...) : itemsToShow` → 검색어가 있을 때만 거르기. `toLowerCase()`를 양쪽에 써서 **대소문자 무시**. `includes()`로 포함 여부.
- 정렬: `[...filtered].sort(...)` → **복사본**을 정렬(sort는 원본을 바꾸니까). 숫자 비교는 `a - b`(오름차순), `b - a`(내림차순).
- `useMemo(..., [filter, ascending])` → 둘 중 하나가 바뀔 때만 다시 계산.
- 버튼 제목 `Sort ${ascending ? 'Ascending' : 'Descending'}`, 토글은 `setAscending((prev) => !prev)`.
- 검색창은 **controlled TextInput**(3주차).

@@NOTE E-Lists/fetching-list-data.md
@@K _pre
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
@@K Lazy Loading of List Data
**Lazy loading(지연 로딩) / 무한 스크롤**: 끝까지 내리면 자동으로 더 불러오기(SNS 피드).
- `onEndReached`: 끝에 가까워지면 호출되는 함수.
- `onEndReachedThreshold={0.5}`: 끝까지 **화면 절반** 남았을 때 호출.
- 4단계: 처음 묶음 로드 → 바닥 근처 감지 → 더 가져오기 → 기존 목록 **뒤에 붙이기**.
@@K Best practices for infinite scrolling
- `loadingMore` state로 **중복 요청 방지**(이미 불러오는 중이면 또 안 부름)
- `setItems(prev => [...prev, ...newItems])` 로 **이어 붙이기**(함수형 + spread)
- 안정적인 key로 깜빡임 방지
- 서버 페이지네이션(pagination, 페이지 단위로 나눠 받기)과 같이 쓰기

@@NOTE E-Lists/lists-and-detail-views.md
@@K Introduction
**List → Detail 패턴**: 목록 보여 주기 → 하나를 탭 → 상세 화면. 메일함, 연락처, 쇼핑, 뉴스 모두 이 패턴. 재료 3개: **FlatList**(목록) + **Pressable**(터치) + **React Navigation**(화면 이동).
@@K Example
아래 소단원들이 이 패턴을 조각조각 보여 줘요.
@@K Navigation
4주차 Stack Navigator 그대로. List와 Detail 두 화면 등록, Detail 헤더 제목은 params에서.
@@K List Screen
각 줄을 **Pressable**로 감싸서 `onPress`에 `navigation.navigate('Detail', { item })`. Pressable은 6주차에 자세히.
@@K Detail Screen
`route.params`에서 item을 꺼내 보여 줘요.
@@K Passing Data Between Screens
보내기 `navigate('Detail', { item })`, 받기 `const { item } = route.params;`. 문자열, 숫자, 객체, 배열, API 결과 등 무엇이든 넘길 수 있어요.
@@K Fetching Detail Data
**id만 넘기고 상세 화면이 직접 fetch**하는 방법도 있어요. 상품 페이지, 프로필, 기사처럼 필요할 때 불러오는 데이터에 좋아요.
- 장점: params가 작고, 항상 **최신** 데이터.
- 단점(비용): 상세 화면을 열 때마다 **요청 한 번 더**, 로딩 시간 발생. (Lab 5 Q5 주석으로 쓸 내용!)
@@K Full Solution (Local Data)
**완성 코드 해설**
- `ListScreen`: 20개 데이터 생성, `openDetail(item)` 함수로 navigate.
- `renderItem`이 `Pressable`(행 스타일 그대로) 안에 제목 + "Tap to view details".
- `DetailScreen`: `const { item } = route.params;` 주의: 이 코드는 params가 없으면 크래시해요. 4주차 규칙대로라면 `route.params ?? {}`로 안전하게.
- 헤더 제목: `options={({ route }) => ({ title: route.params.item.title })}`.
@@K Full Example (Fetching Remote Data)
**완성 코드 해설**: 위 패턴 + 목록을 API(jsonplaceholder)에서 받아 오기. loading/error 처리와 Pressable → Detail 흐름이 한 파일에 다 들어 있어요. 시험 직전 복습용으로 이 코드를 처음부터 끝까지 따라 쳐 보세요.

@@NOTE E-Lists/pull-to-refresh.md
@@K Introduction
**Pull to refresh(당겨서 새로고침)**: 목록 맨 위에서 아래로 끌어당기면 다시 불러오기. FlatList에 **내장**돼 있어서 제스처를 직접 감지할 필요 없어요.
@@K How Pull to Refresh Works
props 2개:
1. `refreshing` (boolean): true면 맨 위에 스피너.
2. `onRefresh` (함수): 사용자가 당기면 호출.
원문 명언: **"React Native handles the gesture. You handle the data."** (제스처는 RN이, 데이터는 내가)
💡 터치가 필요해서 **Web 미리보기에서는 안 돼요.** iOS/Android 미리보기나 Expo Go 폰에서.
@@K Basic Pull‑to‑Refresh Example
**코드 해설**: `onRefresh`에서 `setRefreshing(true)` → (가짜 네트워크 대기) → 데이터 갱신 → `setRefreshing(false)`. 스피너를 켜고 끄는 건 **내 책임**.
@@K Pull to Refresh with API Data
**코드 해설**: 같은 패턴인데 실제 API(posts)를 다시 fetch. 처음 로드는 useEffect, 수동 새로고침은 onRefresh.
@@K Best Practices
1. 빠르게. 느리면 스피너 + 캐싱 고려.
2. 화면 열 때마다 새로고침 X. **첫 로드는 useEffect, 수동은 pull to refresh**.
3. `refreshing`을 직접 수정 X. 로드 전 true, 후 false로 **set**.
4. UI 스레드를 막지 않기(async 사용).
5. 필요하면 페이지네이션과 같이(새로고침은 위쪽, 페이지네이션은 아래쪽).

@@LEC week-05.1-notes.md
@@K React Native Playground
처음 세 예제는 `react-native`만 필요. List and Detail 예제부터 React Navigation 패키지가 필요해요(Snack 링크에 자동 포함). 데이터는 jsonplaceholder의 가짜 posts 100개(`userId`, `id`, `title`, `body`). 브라우저에서 주소를 열어 데이터 모양을 먼저 보세요.
@@K Why Lists?
**목록 디자인 원칙**: 줄마다 일관되게. 분명한 위계(제목, 부제목), 손가락으로 누르기 편한 간격, 시각적 구분(테두리나 카드). 어딘가로 이동하는 줄은 **눌러질 것처럼 보여야** 해요.
@@K Example: FlatList
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
@@K Example: Sorting and Filtering
사용자는 예측 가능한 **순서**와 긴 목록을 **좁히는 방법**을 원해요. 둘 다 UI는 안 건드리고 **배열만** 바꿔요.
@@K Step 1 - Sort with a Button
- state는 **방향 하나**(`ascending`). 정렬된 배열 `visible`은 state가 아니라 렌더링마다 **계산(derived)** 해요. 동기화할 게 없어서 버그가 줄어요. (시험 개념: **derived state**는 state로 저장하지 말 것)
- `[...fruits]` 먼저 **복사**. `.sort()`는 **원본을 직접 바꾸는(in place)** 함수라서. 지금은 상수지만 나중에 state가 되면 state는 절대 직접 바꾸면 안 돼요.
- `localeCompare`: 사람이 기대하는 문자열 순서("apple"이 "Banana"보다 앞). 숫자는 빼기 `a.price - b.price`.
@@K Step 2 - Filter with a TextInput
- `.filter()`는 **새 배열**을 반환하니 `[...fruits]` 복사가 필요 없어졌어요. sort는 그 새 배열을 정렬, 원본 안전.
- **먼저 필터, 그다음 정렬**: 짧은 목록을 정렬하는 게 일이 적고 결과는 같아요.
- 검색창은 controlled TextInput. `an` → Banana, Orange. `rr` → Cherry, Blueberry.
- `zz` → 빈 화면에 **아무 말도 없음** → 고장 난 것처럼 보임 → Step 3.
@@K Step 3 - Show an Empty State
`ListEmptyComponent`는 data가 **비었을 때만** 렌더링. 빈 화면도 사용자가 보는 상태이니 **말을 해 줘야** 해요. 서버에서 빈 목록이 와도 같은 prop이 처리.
@@K Finished Code
**완성 코드 해설**: state는 `ascending`과 `query` 두 개뿐. `visible = fruits.filter(...).sort(...)`를 return 위에서 매번 계산 → `data={visible}`. 버튼, 검색창, FlatList, ListEmptyComponent. 이 구조가 Lab 5 Q2~Q3의 뼈대예요.
@@K Example: Fetching List Data
실제 목록은 API에서 와요. 첫 렌더링 때는 데이터가 **없고**, 영영 안 올 수도 있어요. 그래서 상태 3개가 생겨요: **loading, error, empty**. 흐름: 로딩 시작 → 스피너 → fetch → 목록, 실패하면 메시지 + 다시 시도.
@@K Starter Code
- `posts`는 빈 배열로 시작(첫 렌더링에도 목록에 줄 게 있게).
- `useEffect(..., [])` 한 번 실행 → 요청 시작.
- 2초 타이머는 **데모용**(교실 네트워크가 너무 빨라서). cleanup으로 타이머 취소(2주차 패턴). 완성 코드에는 없어요.
- `fetch`는 응답의 Promise, `res.json()`은 파싱된 본문의 Promise. `loadPosts`가 체인을 return 해서 다음 단계가 기다릴 수 있게.
- `item.id`가 숫자라 keyExtractor에서 `.toString()`.
- 문제: 2초 동안 빈 화면, 실패하면 영원히 빈 화면.
@@K Step 1 - Show a Spinner While Loading
- `ActivityIndicator` = 빙글빙글 로딩 스피너.
- `loading` state는 **true로 시작**(첫 로드가 바로 시작되니까).
- `.finally(() => setLoading(false))` → 성공, 실패 상관없이 **항상** 스피너 끄기.
- `if (loading) return (스피너 화면);` **early return** → 메인 return은 데이터가 준비됐는지 신경 안 써도 됨.
@@K Step 2 - Handle Errors
- `error` state: `null`이면 에러 없음.
- **핵심**: `fetch`는 **네트워크가 실패할 때만** reject. 404, 500도 fetch 입장에선 "성공한 응답". 그래서 `if (!res.ok) throw new Error(`HTTP ${res.status}`)`로 직접 던져야 `catch`로 가요. (Lab 5 Q4 주석 내용!)
- 에러 메시지는 **사용자용**: 상태 코드 말고, 무슨 일이 있었고 뭘 하면 되는지.
- `retry()`: 스피너 다시 켜고 다시 로드.
- 테스트: URL을 `/postz`로 → 404 → 에러 화면 → Try Again → 스피너 → 다시 에러.
- **early return 순서가 중요**: loading을 먼저 검사해서, Try Again을 누르면 error가 아직 있어도 스피너가 보여요.
@@K Step 3 - Show an Empty State
`ListEmptyComponent` 추가. 테스트: `/posts?userId=99` → 서버가 `[]` 반환 → "없음" 메시지. 이로써 **전체 생명주기 완성**: 스피너 → 목록 → 에러 + 재시도 → 빈 목록 메시지.
@@K Finished Code
**완성 코드 해설 (시험 직전 꼭 다시 보기)**
- state 3개: `posts`, `loading`, `error`.
- `loadPosts`: `fetch(URL)` → `res.ok` 확인 → `json()` → `setPosts` → catch에서 `setError(메시지)` → finally에서 `setLoading(false)`.
- `useEffect(() => { loadPosts(); }, [])`.
- `retry`: `setLoading(true); setError(null); loadPosts();`
- 렌더링: loading → error → 목록(ListEmptyComponent 포함) 순서의 early return.
@@K Example: List and Detail
**Progressive disclosure(점진적 공개)**: 지금 필요한 것만 보여 주고, 나머지는 요청할 때 보여 주기. 목록은 깔끔하게, 상세는 넉넉하게. 내부적으로는 4주차 스택 + row를 param으로 전달.
@@K Step 1 - Put the List in a Stack
`MyApp`을 `PostsScreen`으로 이름 바꾸고(`export default` 제거, `navigation` prop 받기), 새 `MyApp`이 NavigationContainer + Stack을 return. 헤더가 공간을 만들어 주니 `paddingTop` 제거.
@@K Step 2 - Make Each Row Tappable
- row의 `View`를 **`Pressable`** 로 교체 → `onPress={() => navigation.navigate("Details", { post: item })}`.
- Pressable은 **모양이 없는** 터치 감싸개라 row 스타일 그대로.
- `numberOfLines={1}` → 본문을 한 줄로 자르고 말줄임(…). 목록은 요약, 전체는 상세에서.
- 아직 Details 화면이 없어서 누르면 콘솔에 `NAVIGATE` 미처리 메시지.
@@K Step 3 - Add the Details Screen
- `const { post } = route.params;`로 읽기, 헤더 제목은 post.title.
- 뒤로 가면 목록이 **그대로**(Posts 화면이 스택에 남아 있으니까, unmount 안 됨).
- params는 **작고 직렬화 가능**(serializable, JSON으로 바꿀 수 있는)해야 해요. 큰 레코드는 **id만** 넘기고 상세가 fetch.
@@K Finished Code
**완성 코드 해설**: Fetching List Data 완성 코드 + Stack(Posts, Details) + Pressable row + Details 화면. 4주차와 5주차가 합쳐진 형태라 Test 2에 나오기 딱 좋은 구조예요.
@@K Example: Pull to Refresh
`refreshing` + `onRefresh` 두 prop. 제스처 코드 없음. Web에서는 안 되니 iOS/Android/Expo Go.
@@K Step 1 - Track the Refresh
**`loading`과 `refreshing`을 분리하는 이유** (Lab 5 Q6 주석 내용!): 첫 로드는 **화면 전체**를 스피너로 바꾸고, 새로고침은 **목록을 그대로 둔 채** 위에서만 돌아야 해요. state 하나로는 두 가지 다른 화면을 구분할 수 없어요.
@@K Step 2 - Wire Up the List
`<FlatList refreshing={refreshing} onRefresh={refresh} />`. 당기면 위에 스피너, 다시 로드, 스피너 사라짐, **스크롤 위치 유지**.
@@K Step 3 - Prove It Reloaded
API가 매번 같은 데이터를 줘서 바뀐 게 안 보이니, 받은 **시각**을 state로 기록(`new Date()`), `toLocaleTimeString()`으로 표시. 위치는 **`ListHeaderComponent`**: 목록과 **같이 스크롤**돼요(FlatList 위에 둔 Text는 안 따라옴).
@@K Finished PostsScreen
**완성 코드 해설**: state 5개(posts, loading, error, refreshing, updated). `loadPosts`가 성공 시 posts와 updated를 같이 set. `refresh`: `setRefreshing(true)` → loadPosts → finally `setRefreshing(false)`. FlatList에 refreshing, onRefresh, ListHeaderComponent, ListEmptyComponent.

@@LAB lab-5.md
@@K _intro
Lab 5는 연락처 앱 하나를 Q1부터 Q6까지 쌓아 가는 구조로, 5주차 인클래스 예제 순서와 거의 같아요. **Test 2 대비 최고의 연습 문제**예요. 아래에 각 문제의 연결 예제와 주석에 쓸 "내 말로 설명" 포인트를 정리했어요.
@@K A Note on AI
AI는 막힐 때만. 주석으로 "내 말로 설명" 요구가 많은 랩이라 개념 이해가 중요해요.
@@K Overview
연락처 앱 하나를 단계별로. Q1~3 로컬 배열, Q4 API, Q5 상세 화면, Q6 새로고침. 순서대로.
@@K Setup
SDK 54 유지, `styles.js` 분리, starter 파일 3개 교체. 스택이 이미 있어서 marginTop 불필요. 도시가 `address` 객체 안에 있는 건 Q4의 API 모양과 맞추려고.
@@K Styling Rules
모든 스타일은 styles.js, **인라인 스타일 0개**, 스타일 이름은 용도로.
@@K Running Your App
Q1~5는 Web으로 충분, Q6(당겨서 새로고침)은 터치 필요.
@@K Submission
수업 끝나기 전 Snack 링크 제출, 시크릿 창으로 확인.
@@K Question 1 - FlatList (1 point)
**연결**: 5.1 FlatList.
- `data`, `renderItem`, `keyExtractor`(id가 숫자 → `item.id.toString()`). ScrollView/`.map()` 금지.
- 레이아웃: row에 `flexDirection: "row"`, 이름+이메일 View에 **`flex: 1`** → 도시가 필요한 만큼만 쓰고 나머지를 차지. 긴 이름이 도시를 밀어내지 않아요. 고정 width 금지.
- 도시는 `item.address.city`. 구분선은 `borderBottomWidth`.
@@K Question 2 - Sorting (1 point)
**연결**: 5.1 Sorting Step 1.
- state는 `sortBy` 하나(`"name"` / `"city"`). 정렬된 배열은 state 아님(derived).
- 도시 같으면 이름순: `a.address.city.localeCompare(b.address.city) || a.name.localeCompare(b.name)`. localeCompare는 같으면 **0**(falsy) → `||` 오른쪽으로.
- 현재 정렬 버튼은 `disabled={sortBy === "name"}`.
- 주석(내 말로): `.sort()`는 원본을 직접 바꾸니까, 원본 CONTACTS를 지키려고 `[...CONTACTS]` 복사본을 정렬한다.
@@K Question 3 - Search, Count and Empty State (1 point)
**연결**: 5.1 Sorting Step 2~3.
- 이름 **또는** 도시에 포함되면 남기기, `toLowerCase()`로 대소문자 무시.
- 필터 → 정렬 순서. `.filter()`가 새 배열이라 복사 불필요 → Q2 주석을 "filter가 새 배열을 만들어서 원본이 안전하다"로 수정.
- `Showing N of M contacts` → **ListHeaderComponent**(같이 스크롤). N = 결과 길이, M = 전체 길이.
- `No contacts match "zz".` → **ListEmptyComponent**.
@@K Question 4 - Fetching the Contacts (1 point)
**연결**: 5.1 Fetching List Data 완성 코드 그대로의 패턴.
- contacts state(빈 배열 시작), loading, error 세 개. early return.
- 주석(내 말로): fetch는 네트워크 실패에만 reject하고 404, 500은 정상 응답으로 오기 때문에 `.catch()`만으로는 못 잡는다. 그래서 `res.ok`를 확인해서 직접 throw 한다.
- 빈 목록 메시지 분기: 검색어가 있으면 `No contacts match "..."`, 없으면 `No contacts yet.`
- 세 가지 테스트(`/userz`, Try Again, `/users?id=99`)를 직접 해 보기.
@@K Question 5 - Contact Screen (1 point)
**연결**: 코스노트 Fetching Detail Data + 4주차 options 함수.
- params는 **id와 name만**. 상세 화면이 `/users/${id}`를 fetch, `useEffect(..., [id])`.
- 헤더 title은 `route.params?.name`.
- 라벨만 굵게: Text 안의 Text(`<Text><Text style={bold}>Email: </Text>{user.email}</Text>`).
- 주석(내 말로): id만 넘기면 params가 작고 상세 화면이 항상 최신 데이터를 보여 주지만, 화면을 열 때마다 요청을 한 번 더 보내고 로딩을 기다려야 한다(비용).
@@K Question 6 - Pull to Refresh (1 point)
**연결**: 5.1 Pull to Refresh.
- `refreshing` 별도 state. 주석(내 말로): 첫 로드는 화면 전체를 스피너로 바꾸고 새로고침은 목록을 유지해야 해서, 한 state로는 두 상황을 구분할 수 없다.
- `Updated 10:42:07 AM` → contacts를 저장하는 곳에서 `new Date()` 저장, `toLocaleTimeString()`.
- 검색어와 정렬은 state라서 새로고침 후에도 유지돼요.

@@TEXT
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

**손으로 써 보기 과제**: Test 2 스타일 미니 앱. jsonplaceholder의 todos를 불러와서 검색, 완료/미완료 정렬, 빈 상태, 에러 + 재시도, 당겨서 새로고침까지. 보지 않고 써 본 뒤 비교하세요.

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

**해설**: state는 6개지만 `visible`은 state가 아니라 매번 계산해요. 첫 로드와 Try Again은 `loading`(전체 화면 스피너), 당겨서 새로고침은 `refreshing`(목록 유지)으로 나눴어요. `Number(true)`는 1, `Number(false)`는 0이라 완료된 것을 앞으로 보낼 수 있어요.
