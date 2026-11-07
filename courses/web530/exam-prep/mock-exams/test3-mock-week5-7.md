# WEB530 Mock Test 3: Weeks 5 to 7 (Lists, Touch, Maps & Geolocation)

> 이 모의시험은 Test1, Test2와 같은 형식(객관식 1점, 짧은 서술 3점, Snack 코딩 문항)으로 만들었어요.
> 문제는 실제 시험처럼 영어로 썼고, 정답과 한글 해설은 `test3-mock-week5-7-answers.md`에 따로 있어요. 먼저 풀고 나서 답지를 보세요.
> 범위: Week 5 (FlatList, 정렬/검색, fetch 상태, List and Detail, Pull to Refresh), Week 6 (Pressable, hitSlop, ScrollView, 선택 가능한 행, PanResponder, Swipeable), Week 7 (expo-location, watchPositionAsync, MapView, Marker, Polygon)
> 시간 가이드: Section 1~2는 30분, Section 3는 문항당 25~35분

| Section | 문항 | 배점 |
|---|---|---|
| 1. Multiple Choice | Q1 ~ Q8 | 8 x 1 = 8 |
| 2. Short Essay | Q9 ~ Q12 | 4 x 3 = 12 |
| 3. Programming | Q13 Lists (16), Q14 Touch (10), Q15 Maps (10) | 36 |
| 합계 | | 56 |

---

## Section 1: Multiple Choice (1 mark each)

### Question 1

A screen needs to show 1,000 products. A classmate renders them with a `ScrollView` and `products.map(...)`. Why do the Week 5 notes use a `FlatList` instead?

- A. `ScrollView` cannot scroll more than 100 children, so the last 900 products would be cut off.
- B. `FlatList` renders only the rows in a window around the visible area and reuses row components as you scroll, while `ScrollView` renders every child at once.
- C. `FlatList` sorts the data automatically, so the products appear in a predictable order.
- D. `ScrollView` does not support the `key` prop, so React cannot tell the rows apart.

### Question 2

The API returns objects shaped like `{ postId: 7, title: 'Hello' }`. Which `keyExtractor` is correct?

- A. `keyExtractor={(item) => item.postId}`
- B. `keyExtractor={({ item }) => item.postId.toString()}`
- C. `keyExtractor={(item) => item.postId.toString()}`
- D. No `keyExtractor` is needed, because `FlatList` falls back to `item.postId`.

### Question 3

```jsx
fetch(URL)
  .then((res) => res.json())
  .then((json) => setPosts(json))
  .catch(() => setError('Could not load the posts.'));
```

The server answers with a 500 error page. What happens?

- A. `fetch` rejects, the `catch` runs, and the error message is shown.
- B. `fetch` resolves, because a 500 is still a response. The `catch` only runs if a later step throws, so without checking `res.ok` the error is not detected properly.
- C. `fetch` retries automatically three times and then shows the error message.
- D. React Native shows a red error screen and the app closes.

### Question 4

A list screen has both a `loading` state and a `refreshing` state. Why not use one `loading` state for both?

- A. `FlatList` only accepts a state variable whose name is exactly `refreshing`.
- B. The first load replaces the whole screen with a spinner, while a pull to refresh keeps the list on screen and shows the spinner at the top. One flag cannot describe both.
- C. `useState` can only hold one boolean per component.
- D. `refreshing` must start as `true`, and `loading` must start as `false`.

### Question 5

A user presses and holds a `Pressable` for one second, then lifts the finger. It has `onPress`, `onPressIn`, `onPressOut` and `onLongPress` handlers. Which events fire, in order?

- A. `onPressIn`, `onPressOut`, `onPress`, `onLongPress`
- B. `onPressIn`, `onLongPress`, `onPressOut`
- C. `onPressIn`, `onLongPress`, `onPressOut`, `onPress`
- D. `onLongPress` only

### Question 6

A close icon is 24 by 24 points and users keep missing it. The design must not change size. What is the Week 6 fix?

- A. Wrap it in a `ScrollView` so it can be scrolled into a better position.
- B. Add `hitSlop={20}` to its `Pressable`, so the touch area grows by 20 points on every side while the layout stays the same.
- C. Add `padding: 20` to its style.
- D. Replace the `Pressable` with a `Button`, which is always 44 points tall.

### Question 7

```jsx
useEffect(async () => {
  const { status } = await Location.requestForegroundPermissionsAsync();
  // ...
}, []);
```

Why do the Week 7 notes define an `async` function inside the effect and call it, instead of writing it like this?

- A. `await` is not allowed in React Native.
- B. An effect may only return a clean-up function, and an `async` function always returns a promise.
- C. `requestForegroundPermissionsAsync` only works when called from a button.
- D. `async` functions run before the first render, so the screen would never appear.

### Question 8

A `MapView` has `initialRegion={NEWNHAM}`. After the user pans away, the code sets a new value for that prop, but the map does not move. What do the notes do to move the map from code?

- A. Change the `key` of the `MapView` so it is rebuilt.
- B. Use the `region` prop together with `followsUserLocation`, which works on both platforms.
- C. Give the map a ref with `useRef`, then call `mapRef.current.animateToRegion(region, 1000)`.
- D. Call `Location.watchPositionAsync`, which moves the map automatically.

---

## Section 2: Short Essay (3 marks each)

### Question 9

```jsx
const products = [
  { id: 1, name: 'Pen', price: 2 },
  { id: 2, name: 'Bag', price: 30 },
  { id: 3, name: 'Book', price: 15 },
];

export default function MyApp() {
  const [cheapFirst, setCheapFirst] = useState(true);

  const visible = products.sort((a, b) =>
    cheapFirst ? a.price - b.price : b.price - a.price
  );

  return (
    <View style={{ flex: 1, paddingTop: 60 }}>
      <Button title="Flip order" onPress={() => setCheapFirst((prev) => !prev)} />
      <FlatList
        data={visible}
        keyExtractor={(item) => item.id}
        renderItem={(item) => <Text>{item.name}</Text>}
      />
    </View>
  );
}
```

The code above has three separate problems. For each one, explain what rule it breaks and show the fix. One mark per problem.

### Question 10

A posts screen uses the Week 5 pattern with `loading`, `error` and `posts` state.

(a) The code checks `if (loading)` before `if (error)`. When the user presses **Try Again** after an error, what does the user see, and why does the order of those two checks matter? (1 mark)

(b) Why is `setLoading(false)` called inside `.finally()` instead of inside the `.then()` that stores the posts? (1 mark)

(c) What does `ListEmptyComponent` show, and why is a blank screen not good enough when the list is empty? (1 mark)

### Question 11

The Week 6 Swipe to Delete example puts each row in a `MessageRow` component wrapped in `Swipeable`.

(a) Why is `MessageRow` declared at the top level of the file instead of inside `MyApp`? (1 mark)

(b) `Swipeable` has an `onSwipeableOpen` prop that could delete the message as soon as the row opens. Why do the notes reveal a **Delete** button and delete only when it is tapped? (1 mark)

(c) In the hand-built Drag and Snap Back example, `onMoveShouldSetPanResponder` returns `Math.abs(gesture.dx) > 10`. What problem does that rule prevent? (1 mark)

### Question 12

```jsx
useEffect(() => {
  let subscription;
  let cancelled = false;

  async function startWatching() {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') return;
    subscription = await Location.watchPositionAsync(
      { accuracy: Location.Accuracy.High, timeInterval: 1000, distanceInterval: 1 },
      (pos) => setLocation(pos.coords)
    );
    if (cancelled) subscription.remove();
  }

  startWatching();

  return () => {
    cancelled = true;
    if (subscription) subscription.remove();
  };
}, []);
```

(a) What goes wrong if the clean-up function is removed? (1 mark)

(b) The clean-up already calls `subscription.remove()`. What situation is the `cancelled` flag for? (1 mark)

(c) Give one difference between `getCurrentPositionAsync` and `watchPositionAsync`, and one kind of app that needs the second one. (1 mark)

---

## Section 3: Programming

> 실제 시험은 교수님이 만든 starter Snack 링크를 주지만, 여기서는 starter 코드를 직접 붙여 넣어요.
> https://snack.expo.dev 를 열고 SDK 54(기본값)인지 확인한 뒤 `App.js`에 starter를 붙여 넣으세요.

### Question 13: Lists (16 marks)

#### Before you start

- Open https://snack.expo.dev and paste the starter into App.js. Keep Snack on SDK 54 (the default).
- The Web preview is enough for Parts A to C. Part D (pull to refresh) needs the **Android** or **iOS** tab, or your phone.
- You may use the course notes at https://seneca-ictoer.github.io/WEB530/. The question describes behaviour, not code. Marks are for making that behaviour work in this app.
- Do not change the styles. Every style you need is already in the starter.
- Do not use `ScrollView` or `.map()` for the rows.

#### Starter

```jsx
import { View, Text, StyleSheet } from 'react-native';

const URL = 'https://jsonplaceholder.typicode.com/todos?userId=1';

export default function MyApp() {
  return (
    <View style={styles.container}>
      <Text>Tasks will go here.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingTop: 60 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderColor: '#ddd',
  },
  title: { flex: 1, fontSize: 16 },
  status: { fontWeight: 'bold', marginLeft: 12 },
  done: { color: 'green' },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 8,
    marginHorizontal: 16,
    marginVertical: 8,
  },
  header: { padding: 8, textAlign: 'center', color: '#666' },
  empty: { padding: 20, color: '#666' },
  error: { color: 'red', textAlign: 'center', padding: 20 },
});
```

#### Scenario

You are building a task board. The tasks come from a fake API that returns 20 tasks shaped like `{ userId, id, title, completed }`. Open the URL in a browser tab first to see the data.

#### Part A - Load and show the tasks (5 marks)

- The tasks live in state, start as an empty array, and are loaded once when the screen first renders, with `fetch`.
- Replace the placeholder `Text` with a `FlatList` that shows every task.
- Each row uses the `row` style. The task's title is on the left in the `title` style. On the right, a second `Text` reads `Done` if the task is completed or `Open` if it is not. It uses the `status` style, and a completed task also uses the `done` style.
- The `id`s are numbers. Your `keyExtractor` must return a string.

#### Part B - Loading, errors and empty (4 marks)

- While the first load is running, the whole screen shows an `ActivityIndicator` and the text `Loading tasks...`, centred with the `center` style.
- If the load fails, the whole screen shows `Could not load the tasks. Check your connection and try again.` in the `error` style, and a `Try Again` button. Pressing it shows the spinner again and reloads.
- A 404 or 500 response must count as a failure. Check for it before reading the JSON.
- If the API returns no tasks, the list shows `No tasks yet.` in the `empty` style.
- Test it: end the URL in `/todoz` for the error, and use `?userId=99` for the empty list. Put the URL back afterwards.

#### Part C - Search and sort (4 marks)

- Above the list, add a `Button` and a controlled `TextInput` with the placeholder `Search tasks`, in the `input` style.
- Typing filters the list by title. Upper and lower case do not matter.
- The list starts sorted by title, A to Z. The button reads `Sort Z to A` and flips the order. After a press it reads `Sort A to Z`.
- The filtered and sorted array is **not** stored in state. It is built on every render from the tasks, the search text and the sort direction. Filter first, then sort.
- Above the first row, a `Text` in the `header` style reads `Showing N of M tasks`, where N is the number of rows on screen and M is the total. It must scroll with the list.
- When the search text is not empty and nothing matches, the list shows `No tasks match "TEXT".` instead of `No tasks yet.`

#### Part D - Pull to refresh (3 marks)

- Pulling down on the list shows the refresh spinner at the top, reloads the tasks, and hides the spinner when done.
- During a refresh the list stays on screen. The full screen `Loading tasks...` spinner is only for the first load and for `Try Again`.
- Under `Showing N of M tasks`, a second line in the `header` style reads `Updated` and the time the tasks last arrived, for example `Updated 10:42:07 AM`.
- Do not write any gesture code.

---

### Question 14: Touch (10 marks)

#### Before you start

- Paste the starter into App.js. The Web preview is enough: a click is a tap, and holding the mouse button down is a long press. `hitSlop` only works on a phone.
- Do not change the styles.
- Use `Pressable`. Do not use `Button`, `TouchableOpacity` or `TouchableHighlight`.

#### Starter

```jsx
import { View, Text, FlatList, StyleSheet } from 'react-native';

const SEATS = Array.from({ length: 24 }, (_, i) => ({
  id: String(i + 1),
  label: `Seat ${i + 1}`,
}));

export default function MyApp() {
  return (
    <View style={styles.container}>
      <View style={styles.bar}>
        <Text style={styles.heading}>Pick your seats</Text>
        <View style={styles.clear}>
          <Text style={styles.clearText}>X</Text>
        </View>
      </View>
      <FlatList
        data={SEATS}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.row}>
            <Text style={styles.text}>{item.label}</Text>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingTop: 60 },
  bar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingBottom: 10,
  },
  heading: { fontSize: 18, fontWeight: '600' },
  clear: {
    width: 24,
    height: 24,
    borderWidth: 1,
    borderColor: 'red',
    alignItems: 'center',
    justifyContent: 'center',
  },
  clearText: { fontSize: 12 },
  row: {
    padding: 20,
    borderBottomWidth: 1,
    borderColor: '#ccc',
    backgroundColor: 'white',
  },
  selected: { backgroundColor: '#BBDEFB' },
  held: { backgroundColor: '#FFE0B2' },
  pressed: { backgroundColor: '#eee' },
  text: { fontSize: 18 },
  note: { fontSize: 14, color: '#666' },
});
```

#### Scenario

A cinema seat picker. The user taps seats to select them, long presses a seat to hold it for a friend, and clears the selection with the small X.

#### Part A - Pressable rows (2 marks)

- Every row is a `Pressable` in the `row` style.
- While the finger is down on a row, it also uses the `pressed` style. The feedback must appear the moment the press starts, not when it ends.

#### Part B - Selecting seats (3 marks)

- Tapping a seat selects it, and it uses the `selected` style. Tapping it again clears it.
- Store the selection in one piece of state as an object of ids, for example `{ "3": true, "7": true }`. Every update uses the updater form.
- The heading reads `N selected` instead of `Pick your seats`. N is worked out on every render and is **not** stored in state.
- The `pressed` style must still show on a selected row.
- Make sure the rows re-render when the selection changes, even though `data` does not change.

#### Part C - Holding a seat (3 marks)

- Long pressing a seat holds it: the row uses the `held` style and shows a second `Text`, `Held`, in the `note` style. Long pressing it again releases it.
- Holding a selected seat clears its selection, so a seat is never selected and held at the same time.
- Tapping a held seat does nothing. It must still be possible to long press it to release it.
- Held seats are not counted in `N selected`.

#### Part D - The clear button (2 marks)

- The red X becomes a `Pressable` in the `clear` style. Tapping it clears every selected seat. Held seats stay held.
- The X stays 24 by 24 on screen, but its touch area is 20 points bigger on every side.

---

### Question 15: Maps & Geolocation (10 marks)

#### Before you start

- Replace `package.json` in the Snack with the one below, and keep Snack on SDK 54.
- This question needs a phone. Choose **My Device** and open the Snack in Expo Go. `react-native-maps` has no web version.
- Do not change the styles or the data.

```json
{
  "dependencies": {
    "expo-location": "~19.0.8",
    "react-native-maps": "1.20.1"
  }
}
```

#### Starter

```jsx
import { View, Text, Pressable, StyleSheet } from 'react-native';

const SHOPS = [
  { id: 'bean', name: 'Bean There', address: '1800 Finch Ave E', latitude: 43.7962, longitude: -79.3462 },
  { id: 'grind', name: 'Daily Grind', address: '3401 Don Mills Rd', latitude: 43.7899, longitude: -79.3526 },
  { id: 'brew', name: 'Brew Lab', address: '2 Leslie St N', latitude: 43.7988, longitude: -79.3611 },
  { id: 'cup', name: 'Second Cup Corner', address: '55 Sheppard Ave E', latitude: 43.7768, longitude: -79.3442 },
];

const START = {
  latitude: 43.7905,
  longitude: -79.3505,
  latitudeDelta: 0.04,
  longitudeDelta: 0.04,
};

export default function MyApp() {
  return (
    <View style={styles.container}>
      <Pressable style={({ pressed }) => [styles.button, pressed && styles.pressed]}>
        <Text style={styles.buttonText}>Near Me</Text>
      </Pressable>
      <View style={styles.card}>
        <Text style={styles.cardHint}>Tap a coffee shop.</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  map: { flex: 1 },
  button: {
    position: 'absolute',
    top: 60,
    alignSelf: 'center',
    padding: 14,
    borderRadius: 8,
    backgroundColor: '#2196F3',
  },
  pressed: { backgroundColor: '#1565C0' },
  disabled: { backgroundColor: '#90CAF9' },
  buttonText: { color: 'white', fontSize: 16 },
  card: {
    position: 'absolute',
    bottom: 40,
    left: 20,
    right: 20,
    padding: 16,
    borderRadius: 8,
    backgroundColor: 'white',
  },
  cardTitle: { fontSize: 18, fontWeight: '600' },
  cardText: { fontSize: 14, color: '#666', marginTop: 4 },
  cardHint: { fontSize: 16, color: '#666', textAlign: 'center' },
  error: { fontSize: 14, color: 'red', textAlign: 'center' },
});
```

#### Scenario

A coffee finder near Newnham Campus. The map shows the coffee shops, the card at the bottom shows the one you tapped, and **Near Me** takes the map to where you are.

#### Part A - The map and the shops (3 marks)

- A map fills the whole screen and starts at `START`. The button and the card sit on top of it.
- There is one `Marker` for every shop in `SHOPS`, with the shop's name as the title and its address as the description. Do not write `<Marker>` by hand for each shop.
- The map's own places (restaurants, shops, schools) are hidden on **both** iOS and Android.

#### Part B - The selected shop (2 marks)

- Tapping a marker shows that shop in the card: its name in the `cardTitle` style and its address under it in the `cardText` style.
- Before any shop is tapped, the card shows the starter's hint.

#### Part C - Near Me (5 marks)

- The app asks for location permission when the user presses **Near Me**, not when the app opens.
- If the user says no, the card shows `Location is needed for Near Me. You can still tap the shops.` in the `error` style. The map keeps working.
- If the user says yes, the blue dot for the user appears on the map, the app gets the current position, and the map glides there with both deltas at `0.005`.
- If getting the position fails, the card shows `Could not get your location. Is location turned on?` in the `error` style.
- While the app is working, the button reads `Finding you...`, is disabled, and also uses the `disabled` style. It goes back to `Near Me` when it is done, whether it worked or not.
- Pressing **Near Me** again clears an old error message.
