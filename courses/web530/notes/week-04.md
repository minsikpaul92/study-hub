# Week 4. Navigation: 여러 화면 오가기 (Stack, Tab, Drawer, 중첩, 화면 간 State)

> 이 노트 읽는 법: **📘/💻/🧪 원문**(영어 그대로) 바로 밑에 **🇰🇷 한글 해설**이 있어요. 코드 밑의 **▶ Snack에서 바로 실행하기**를 누르면 그 코드가 Expo Snack에서 열려요. 이번 주 Snack 링크에는 React Navigation 패키지(버전 7, SDK 54용)가 자동으로 들어가 있어요. **SDK는 54 그대로** 두세요. 55에서는 안 돌아가요.

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


## 목차

- 1. 📘 코스노트: Navigating Between Screens
- 2. 📘 코스노트: Handling State
- 3. 💻 인클래스 예제: Week 4.1 - Notes and Examples
- 4. 🧪 Lab: Lab 4 - Navigation
- ✅ Week 4 시험 대비 체크리스트


---

## 1. 📘 코스노트: Navigating Between Screens

> 원문 출처: https://seneca-ictoer.github.io/WEB530/D-Navigation/navigating

### 📘 Testing Navigation in Snack

Every example on this page has an **Example** panel under it, and some also show a screenshot of the output. Press **Run this example** to open the code in Expo Snack, where you can change it and watch the result update. The preview shows the web version of the app; switch to **iOS** or **Android** in the preview, or choose **My Device** and scan the QR code with Expo Go, to try it on a phone.

To try the examples in your own Snack, replace the contents of the package.json file with the following.

*package.json*

```json
{
  "dependencies": {
    "@react-navigation/native": "^7.0.0",
    "@react-navigation/native-stack": "^7.0.0",
    "@react-navigation/bottom-tabs": "^7.0.0",
    "@react-navigation/drawer": "^7.0.0",
    "react-native-screens": "~4.16.0",
    "react-native-safe-area-context": "~5.6.0",
    "react-native-gesture-handler": "~2.28.0",
    "react-native-reanimated": "~4.1.1",
    "react-native-worklets": "0.5.1",
    "@expo/vector-icons": "^15.0.3"
  }
}
```

The `@react-navigation` packages are pinned to version 7, which these notes are written for. The other packages are native modules (and the icon set used by the tab examples), and their versions must match the Expo SDK your Snack uses. The versions above match SDK 54, Snack's default. If you switch SDKs, Snack will flag any version that doesn't match.

**🇰🇷 한글 해설**

코스노트 예제를 Snack에서 돌리려면 `package.json`을 이 내용으로 바꾸라는 안내예요. React Navigation은 **버전 7**에 맞춰 쓰여 있고, 나머지 패키지(screens, safe-area-context, gesture-handler, reanimated 등)는 **Expo SDK 54**와 버전이 맞아야 해요. 이 노트의 Snack 링크는 필요한 패키지를 이미 넣어 두었어요.

### 📘 Introduction to Navigation

Most apps have more than one screen, so they need a way to move between them. A web browser gives you this for free: every page has a URL, and the back button walks through a history of pages. React Native has nothing like it built in. Apps still need screens, transitions between them, a history to go back through, and often **deep linking** (opening the app directly on a specific screen, for example from a notification).

The community standard for this is the **React Navigation** library. It provides stack, tab and drawer navigators, deep linking, and typed route params for TypeScript. Let's start off with an example.

```jsx
import { View, Text, Button } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

const Stack = createNativeStackNavigator();

function Home({ navigation }) {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>Home Screen</Text>
      <Button title="Go to Settings" onPress={() => navigation.navigate('Settings')} />
    </View>
  );
}

function Settings({ navigation }) {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>Settings Screen</Text>
      <Button title="Go Back Home" onPress={() => navigation.goBack()} />
    </View>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="Home" component={Home} />
        <Stack.Screen name="Settings" component={Settings} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
```

▶ **[Snack에서 바로 실행하기](https://snack.expo.dev/?name=WEB530%20W4%20Introduction%20to%20Navigation&platform=web&sdkVersion=54.0.0&code=import%20%7B%20View%2C%20Text%2C%20Button%20%7D%20from%20%27react-native%27%3B%0Aimport%20%7B%20NavigationContainer%20%7D%20from%20%27%40react-navigation%2Fnative%27%3B%0Aimport%20%7B%20createNativeStackNavigator%20%7D%20from%20%27%40react-navigation%2Fnative-stack%27%3B%0A%0Aconst%20Stack%20%3D%20createNativeStackNavigator%28%29%3B%0A%0Afunction%20Home%28%7B%20navigation%20%7D%29%20%7B%0A%20%20return%20%28%0A%20%20%20%20%3CView%20style%3D%7B%7B%20flex%3A%201%2C%20alignItems%3A%20%27center%27%2C%20justifyContent%3A%20%27center%27%20%7D%7D%3E%0A%20%20%20%20%20%20%3CText%3EHome%20Screen%3C%2FText%3E%0A%20%20%20%20%20%20%3CButton%20title%3D%22Go%20to%20Settings%22%20onPress%3D%7B%28%29%20%3D%3E%20navigation.navigate%28%27Settings%27%29%7D%20%2F%3E%0A%20%20%20%20%3C%2FView%3E%0A%20%20%29%3B%0A%7D%0A%0Afunction%20Settings%28%7B%20navigation%20%7D%29%20%7B%0A%20%20return%20%28%0A%20%20%20%20%3CView%20style%3D%7B%7B%20flex%3A%201%2C%20alignItems%3A%20%27center%27%2C%20justifyContent%3A%20%27center%27%20%7D%7D%3E%0A%20%20%20%20%20%20%3CText%3ESettings%20Screen%3C%2FText%3E%0A%20%20%20%20%20%20%3CButton%20title%3D%22Go%20Back%20Home%22%20onPress%3D%7B%28%29%20%3D%3E%20navigation.goBack%28%29%7D%20%2F%3E%0A%20%20%20%20%3C%2FView%3E%0A%20%20%29%3B%0A%7D%0A%0Aexport%20default%20function%20App%28%29%20%7B%0A%20%20return%20%28%0A%20%20%20%20%3CNavigationContainer%3E%0A%20%20%20%20%20%20%3CStack.Navigator%20initialRouteName%3D%22Home%22%3E%0A%20%20%20%20%20%20%20%20%3CStack.Screen%20name%3D%22Home%22%20component%3D%7BHome%7D%20%2F%3E%0A%20%20%20%20%20%20%20%20%3CStack.Screen%20name%3D%22Settings%22%20component%3D%7BSettings%7D%20%2F%3E%0A%20%20%20%20%20%20%3C%2FStack.Navigator%3E%0A%20%20%20%20%3C%2FNavigationContainer%3E%0A%20%20%29%3B%0A%7D%0A&dependencies=%40react-navigation%2Fnative%40%5E7.0.0%2C%40react-navigation%2Fnative-stack%40%5E7.0.0%2Creact-native-safe-area-context%40~5.6.0%2Creact-native-screens%40~4.16.0)** (SDK 54, 필요한 패키지 자동 포함) <button class="snack-embed" type="button">👀 여기서 결과 보기</button>


![Intro to Navigation](https://seneca-ictoer.github.io/WEB530/assets/images/intro-nav-bc09d90ea699ef5c0f38079dcd15ede5.png)


In earlier React examples, we typically returned JSX directly from a single component. With React Navigation, we define a navigation tree instead. We create a stack navigator with `createNativeStackNavigator()` and wrap it in a `NavigationContainer`, which manages the navigation state for the whole app.

A stack navigator works like a deck of cards. Each new screen is **pushed** on top of the stack, and going back **pops** it off to reveal the one underneath.

Each screen is a normal React component registered with `<Stack.Screen name="Home" component={Home} />`. The name prop defines the route name, and React Navigation automatically passes a navigation prop to each screen component. We call `navigation.navigate('Settings')` to move to another screen and `navigation.goBack()` to return; the navigator handles showing and hiding screens and managing the back stack for us.

When the app starts, the screen named by `initialRouteName` (in this case, "Home") is shown. Without it, the navigator starts on the first screen listed. Navigating to "Settings" pushes a new screen onto the stack, and going back pops it off. The header bar and platform back behavior (including Android’s system back button) are handled automatically by the navigator.

**🇰🇷 한글 해설**

**왜 Navigation 라이브러리가 필요해?** 앱도 화면, 화면 전환, 뒤로 가기 기록(history), **deep linking**(링크를 누르면 앱의 특정 화면이 바로 열리는 것)이 필요한데 RN에는 내장된 게 없어요. 커뮤니티 표준이 **React Navigation**.

첫 예제 해설:
- 지금까지는 컴포넌트 하나가 JSX를 바로 return 했는데, 이제는 **내비게이션 트리**를 정의해요.
- `createNativeStackNavigator()`로 스택을 만들고 `NavigationContainer`로 감싸요. 컨테이너는 앱 전체의 **내비게이션 state**를 관리해요.
- **Stack = 카드 더미**. 새 화면은 위에 **push**, 뒤로 가면 **pop**.
- `<Stack.Screen name="Home" component={Home} />` 에서 `name`이 **route 이름**. 등록된 화면은 `navigation` prop을 **자동으로** 받아요.
- `navigation.navigate('Settings')` 로 이동, `navigation.goBack()` 으로 복귀.
- `initialRouteName`이 첫 화면. 없으면 **첫 번째로 적은 화면**.
- 헤더 바와 Android 뒤로 가기 버튼은 내비게이터가 **자동으로** 처리.

#### 📘 Passing data between screens

In the previous example, each screen was independent. In real apps, screens often need to share information. For example, in a shopping app, tapping an item in a list should navigate to a details screen and show information about that specific item.

React Navigation makes this straightforward. When calling `navigation.navigate()`, you can pass a JavaScript object as the second argument. The destination screen receives this data through the `route` prop.

```jsx
import { View, Text, Button } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

const Stack = createNativeStackNavigator();

function ItemList({ navigation }) {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>Item List</Text>

      <Button
        title="First Item"
        onPress={() => navigation.navigate('Details', { title: 'First Item' })}
      />

      <Button
        title="Second Item"
        onPress={() => navigation.navigate('Details', { title: 'Second Item' })}
      />

      <Button
        title="Third Item"
        onPress={() => navigation.navigate('Details', { title: 'Third Item' })}
      />
    </View>
  );
}

function Details({ route }) {
  // route.params contains the object passed from navigate()
  const { title = 'Unknown Item' } = route.params ?? {};

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>Details: {title}</Text>
    </View>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="ItemList">
        <Stack.Screen name="ItemList" component={ItemList} />
        <Stack.Screen name="Details" component={Details} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
```

▶ **[Snack에서 바로 실행하기](https://snack.expo.dev/?name=WEB530%20W4%20Introduction%20to%20Navigation%20-%20Passing%20data%20between%20&platform=web&sdkVersion=54.0.0&code=import%20%7B%20View%2C%20Text%2C%20Button%20%7D%20from%20%27react-native%27%3B%0Aimport%20%7B%20NavigationContainer%20%7D%20from%20%27%40react-navigation%2Fnative%27%3B%0Aimport%20%7B%20createNativeStackNavigator%20%7D%20from%20%27%40react-navigation%2Fnative-stack%27%3B%0A%0Aconst%20Stack%20%3D%20createNativeStackNavigator%28%29%3B%0A%0Afunction%20ItemList%28%7B%20navigation%20%7D%29%20%7B%0A%20%20return%20%28%0A%20%20%20%20%3CView%20style%3D%7B%7B%20flex%3A%201%2C%20alignItems%3A%20%27center%27%2C%20justifyContent%3A%20%27center%27%20%7D%7D%3E%0A%20%20%20%20%20%20%3CText%3EItem%20List%3C%2FText%3E%0A%0A%20%20%20%20%20%20%3CButton%0A%20%20%20%20%20%20%20%20title%3D%22First%20Item%22%0A%20%20%20%20%20%20%20%20onPress%3D%7B%28%29%20%3D%3E%20navigation.navigate%28%27Details%27%2C%20%7B%20title%3A%20%27First%20Item%27%20%7D%29%7D%0A%20%20%20%20%20%20%2F%3E%0A%0A%20%20%20%20%20%20%3CButton%0A%20%20%20%20%20%20%20%20title%3D%22Second%20Item%22%0A%20%20%20%20%20%20%20%20onPress%3D%7B%28%29%20%3D%3E%20navigation.navigate%28%27Details%27%2C%20%7B%20title%3A%20%27Second%20Item%27%20%7D%29%7D%0A%20%20%20%20%20%20%2F%3E%0A%0A%20%20%20%20%20%20%3CButton%0A%20%20%20%20%20%20%20%20title%3D%22Third%20Item%22%0A%20%20%20%20%20%20%20%20onPress%3D%7B%28%29%20%3D%3E%20navigation.navigate%28%27Details%27%2C%20%7B%20title%3A%20%27Third%20Item%27%20%7D%29%7D%0A%20%20%20%20%20%20%2F%3E%0A%20%20%20%20%3C%2FView%3E%0A%20%20%29%3B%0A%7D%0A%0Afunction%20Details%28%7B%20route%20%7D%29%20%7B%0A%20%20%2F%2F%20route.params%20contains%20the%20object%20passed%20from%20navigate%28%29%0A%20%20const%20%7B%20title%20%3D%20%27Unknown%20Item%27%20%7D%20%3D%20route.params%20%3F%3F%20%7B%7D%3B%0A%0A%20%20return%20%28%0A%20%20%20%20%3CView%20style%3D%7B%7B%20flex%3A%201%2C%20alignItems%3A%20%27center%27%2C%20justifyContent%3A%20%27center%27%20%7D%7D%3E%0A%20%20%20%20%20%20%3CText%3EDetails%3A%20%7Btitle%7D%3C%2FText%3E%0A%20%20%20%20%3C%2FView%3E%0A%20%20%29%3B%0A%7D%0A%0Aexport%20default%20function%20App%28%29%20%7B%0A%20%20return%20%28%0A%20%20%20%20%3CNavigationContainer%3E%0A%20%20%20%20%20%20%3CStack.Navigator%20initialRouteName%3D%22ItemList%22%3E%0A%20%20%20%20%20%20%20%20%3CStack.Screen%20name%3D%22ItemList%22%20component%3D%7BItemList%7D%20%2F%3E%0A%20%20%20%20%20%20%20%20%3CStack.Screen%20name%3D%22Details%22%20component%3D%7BDetails%7D%20%2F%3E%0A%20%20%20%20%20%20%3C%2FStack.Navigator%3E%0A%20%20%20%20%3C%2FNavigationContainer%3E%0A%20%20%29%3B%0A%7D%0A&dependencies=%40react-navigation%2Fnative%40%5E7.0.0%2C%40react-navigation%2Fnative-stack%40%5E7.0.0%2Creact-native-safe-area-context%40~5.6.0%2Creact-native-screens%40~4.16.0)** (SDK 54, 필요한 패키지 자동 포함) <button class="snack-embed" type="button">👀 여기서 결과 보기</button>


![Pass Properties in Navigation](https://seneca-ictoer.github.io/WEB530/assets/images/pass-prop-nav-8bdcec4dc737e93bd60d2c7decdaacd7.png)


Always treat params as optional. If a screen is opened without them (for example, as the initial route or from a deep link), `route.params` is `undefined`, and destructuring it would crash the app. Writing `route.params ?? {}` falls back to an empty object, and `title = 'Unknown Item'` gives the value a default.

**🇰🇷 한글 해설**

**화면 사이에 데이터 넘기기** (쇼핑앱에서 상품을 누르면 그 상품 상세가 나오는 것처럼).
- 보내기: `navigation.navigate('Details', { title: 'First Item' })` → **두 번째 인자 객체**.
- 받기: 목적지 화면의 **`route` prop** → `route.params`.
- `const { title = 'Unknown Item' } = route.params ?? {};`
  - `??` (nullish coalescing): 왼쪽이 `null`이나 `undefined`면 오른쪽 사용.
  - params 없이 열리면(첫 화면이거나 deep link) `route.params`는 `undefined` → 그걸 구조 분해하면 **앱이 터져요**. 그래서 `?? {}` 로 빈 객체 대체 + 기본값.
- 원문 규칙: **"Always treat params as optional."** params는 항상 없을 수도 있다고 생각하라.

#### 📘 Customizing navigation header bars

The default navigation headers you’ve seen so far are fairly simple; they show the route name and a back button. React Navigation allows you to customize these headers so they better match the content of each screen.

In this example, we’ll pass item data to a details screen and use that data to customize the header title and add a “Buy” button to the header bar.

```jsx
import { View, Text, Button } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

const Stack = createNativeStackNavigator();

function ItemList({ navigation }) {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>Item List</Text>

      <Button
        title="First Item"
        onPress={() =>
          navigation.navigate('Details', {
            title: 'First Item',
            desc: 'First item description',
            qtyAvail: 5,
          })
        }
      />

      <Button
        title="Second Item"
        onPress={() =>
          navigation.navigate('Details', {
            title: 'Second Item',
            desc: 'Second item description',
            qtyAvail: 0,
          })
        }
      />

      <Button
        title="Third Item"
        onPress={() =>
          navigation.navigate('Details', {
            title: 'Third Item',
            desc: 'Third item description',
            qtyAvail: 15,
          })
        }
      />
    </View>
  );
}

function Details({ route }) {
  const { desc = 'No description' } = route.params ?? {};

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>Description: {desc}</Text>
    </View>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="ItemList">
        <Stack.Screen name="ItemList" component={ItemList} />

        <Stack.Screen
          name="Details"
          component={Details}
          options={({ route }) => ({
            title: route.params?.title ?? 'Details',
            headerRight: () => (
              <Button
                title="Buy"
                onPress={() => {}}
                disabled={(route.params?.qtyAvail ?? 0) === 0}
              />
            ),
          })}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
```

▶ **[Snack에서 바로 실행하기](https://snack.expo.dev/?name=WEB530%20W4%20Introduction%20to%20Navigation%20-%20Customizing%20navigatio&platform=web&sdkVersion=54.0.0&code=import%20%7B%20View%2C%20Text%2C%20Button%20%7D%20from%20%27react-native%27%3B%0Aimport%20%7B%20NavigationContainer%20%7D%20from%20%27%40react-navigation%2Fnative%27%3B%0Aimport%20%7B%20createNativeStackNavigator%20%7D%20from%20%27%40react-navigation%2Fnative-stack%27%3B%0A%0Aconst%20Stack%20%3D%20createNativeStackNavigator%28%29%3B%0A%0Afunction%20ItemList%28%7B%20navigation%20%7D%29%20%7B%0A%20%20return%20%28%0A%20%20%20%20%3CView%20style%3D%7B%7B%20flex%3A%201%2C%20alignItems%3A%20%27center%27%2C%20justifyContent%3A%20%27center%27%20%7D%7D%3E%0A%20%20%20%20%20%20%3CText%3EItem%20List%3C%2FText%3E%0A%0A%20%20%20%20%20%20%3CButton%0A%20%20%20%20%20%20%20%20title%3D%22First%20Item%22%0A%20%20%20%20%20%20%20%20onPress%3D%7B%28%29%20%3D%3E%0A%20%20%20%20%20%20%20%20%20%20navigation.navigate%28%27Details%27%2C%20%7B%0A%20%20%20%20%20%20%20%20%20%20%20%20title%3A%20%27First%20Item%27%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20desc%3A%20%27First%20item%20description%27%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20qtyAvail%3A%205%2C%0A%20%20%20%20%20%20%20%20%20%20%7D%29%0A%20%20%20%20%20%20%20%20%7D%0A%20%20%20%20%20%20%2F%3E%0A%0A%20%20%20%20%20%20%3CButton%0A%20%20%20%20%20%20%20%20title%3D%22Second%20Item%22%0A%20%20%20%20%20%20%20%20onPress%3D%7B%28%29%20%3D%3E%0A%20%20%20%20%20%20%20%20%20%20navigation.navigate%28%27Details%27%2C%20%7B%0A%20%20%20%20%20%20%20%20%20%20%20%20title%3A%20%27Second%20Item%27%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20desc%3A%20%27Second%20item%20description%27%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20qtyAvail%3A%200%2C%0A%20%20%20%20%20%20%20%20%20%20%7D%29%0A%20%20%20%20%20%20%20%20%7D%0A%20%20%20%20%20%20%2F%3E%0A%0A%20%20%20%20%20%20%3CButton%0A%20%20%20%20%20%20%20%20title%3D%22Third%20Item%22%0A%20%20%20%20%20%20%20%20onPress%3D%7B%28%29%20%3D%3E%0A%20%20%20%20%20%20%20%20%20%20navigation.navigate%28%27Details%27%2C%20%7B%0A%20%20%20%20%20%20%20%20%20%20%20%20title%3A%20%27Third%20Item%27%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20desc%3A%20%27Third%20item%20description%27%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20qtyAvail%3A%2015%2C%0A%20%20%20%20%20%20%20%20%20%20%7D%29%0A%20%20%20%20%20%20%20%20%7D%0A%20%20%20%20%20%20%2F%3E%0A%20%20%20%20%3C%2FView%3E%0A%20%20%29%3B%0A%7D%0A%0Afunction%20Details%28%7B%20route%20%7D%29%20%7B%0A%20%20const%20%7B%20desc%20%3D%20%27No%20description%27%20%7D%20%3D%20route.params%20%3F%3F%20%7B%7D%3B%0A%0A%20%20return%20%28%0A%20%20%20%20%3CView%20style%3D%7B%7B%20flex%3A%201%2C%20alignItems%3A%20%27center%27%2C%20justifyContent%3A%20%27center%27%20%7D%7D%3E%0A%20%20%20%20%20%20%3CText%3EDescription%3A%20%7Bdesc%7D%3C%2FText%3E%0A%20%20%20%20%3C%2FView%3E%0A%20%20%29%3B%0A%7D%0A%0Aexport%20default%20function%20App%28%29%20%7B%0A%20%20return%20%28%0A%20%20%20%20%3CNavigationContainer%3E%0A%20%20%20%20%20%20%3CStack.Navigator%20initialRouteName%3D%22ItemList%22%3E%0A%20%20%20%20%20%20%20%20%3CStack.Screen%20name%3D%22ItemList%22%20component%3D%7BItemList%7D%20%2F%3E%0A%0A%20%20%20%20%20%20%20%20%3CStack.Screen%0A%20%20%20%20%20%20%20%20%20%20name%3D%22Details%22%0A%20%20%20%20%20%20%20%20%20%20component%3D%7BDetails%7D%0A%20%20%20%20%20%20%20%20%20%20options%3D%7B%28%7B%20route%20%7D%29%20%3D%3E%20%28%7B%0A%20%20%20%20%20%20%20%20%20%20%20%20title%3A%20route.params%3F.title%20%3F%3F%20%27Details%27%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20headerRight%3A%20%28%29%20%3D%3E%20%28%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3CButton%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20title%3D%22Buy%22%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20onPress%3D%7B%28%29%20%3D%3E%20%7B%7D%7D%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20disabled%3D%7B%28route.params%3F.qtyAvail%20%3F%3F%200%29%20%3D%3D%3D%200%7D%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%2F%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%29%2C%0A%20%20%20%20%20%20%20%20%20%20%7D%29%7D%0A%20%20%20%20%20%20%20%20%2F%3E%0A%20%20%20%20%20%20%3C%2FStack.Navigator%3E%0A%20%20%20%20%3C%2FNavigationContainer%3E%0A%20%20%29%3B%0A%7D%0A&dependencies=%40react-navigation%2Fnative%40%5E7.0.0%2C%40react-navigation%2Fnative-stack%40%5E7.0.0%2Creact-native-safe-area-context%40~5.6.0%2Creact-native-screens%40~4.16.0)** (SDK 54, 필요한 패키지 자동 포함) <button class="snack-embed" type="button">👀 여기서 결과 보기</button>


![Custom Headers in Navigation](https://seneca-ictoer.github.io/WEB530/assets/images/custom-header-nav-b8a8aabafd41b3297562bb834d76e9e5.png)


The `ItemList` screen passes several pieces of data to the `Details` screen using `navigation.navigate('Details', { ... })`. These values become available on the destination screen through the `route.params` object, which is how React Navigation exposes parameters. Because the header is configured inside the `<Stack.Screen>` definition, we can customize it using the `options` prop and access the same route parameters there. This allows the header title to reflect the selected item’s name and enables us to add a “Buy” button directly in the header bar. The button’s disabled state is also driven by the passed-in data; if `qtyAvail` is `0`, the button appears disabled. This approach keeps the screen component itself simple while letting the navigation layer dynamically adjust the header based on the item the user selected.

**🇰🇷 한글 해설**

**헤더 꾸미기**: `<Stack.Screen options={...}>`
- `options`에 **함수**를 주면 `({ route }) => ({ ... })` 처럼 route를 받아서 params로 헤더를 만들 수 있어요.
- `title: route.params?.title ?? 'Details'` → `?.`(optional chaining): params가 없으면 에러 대신 undefined.
- `headerRight: () => <Button .../>` → 헤더 오른쪽에 버튼. 여기선 재고(qtyAvail)가 0이면 Buy 비활성화.
- 함수 리턴에서 객체를 바로 돌려줄 때 `({ ... })` 처럼 **괄호로 감싸요**. 안 감싸면 `{}`를 함수 본문으로 착각해요.

#### 📘 Updating params

A screen can also change its own params with `navigation.setParams()`. Anything that reads those params, including the header options, updates automatically.

```jsx
import { View, Text, Button } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

const Stack = createNativeStackNavigator();

function Home({ navigation }) {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Button
        title="Open Widget"
        onPress={() => navigation.navigate('Details', { title: 'Widget' })}
      />
    </View>
  );
}

function Details({ navigation, route }) {
  const { title = 'Unknown Item' } = route.params ?? {};

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>Editing: {title}</Text>
      <Button
        title="Rename to Super Widget"
        onPress={() => navigation.setParams({ title: 'Super Widget' })}
      />
    </View>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Home" component={Home} />
        <Stack.Screen
          name="Details"
          component={Details}
          options={({ route }) => ({ title: route.params?.title ?? 'Details' })}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
```

▶ **[Snack에서 바로 실행하기](https://snack.expo.dev/?name=WEB530%20W4%20Introduction%20to%20Navigation%20-%20Updating%20params&platform=web&sdkVersion=54.0.0&code=import%20%7B%20View%2C%20Text%2C%20Button%20%7D%20from%20%27react-native%27%3B%0Aimport%20%7B%20NavigationContainer%20%7D%20from%20%27%40react-navigation%2Fnative%27%3B%0Aimport%20%7B%20createNativeStackNavigator%20%7D%20from%20%27%40react-navigation%2Fnative-stack%27%3B%0A%0Aconst%20Stack%20%3D%20createNativeStackNavigator%28%29%3B%0A%0Afunction%20Home%28%7B%20navigation%20%7D%29%20%7B%0A%20%20return%20%28%0A%20%20%20%20%3CView%20style%3D%7B%7B%20flex%3A%201%2C%20alignItems%3A%20%27center%27%2C%20justifyContent%3A%20%27center%27%20%7D%7D%3E%0A%20%20%20%20%20%20%3CButton%0A%20%20%20%20%20%20%20%20title%3D%22Open%20Widget%22%0A%20%20%20%20%20%20%20%20onPress%3D%7B%28%29%20%3D%3E%20navigation.navigate%28%27Details%27%2C%20%7B%20title%3A%20%27Widget%27%20%7D%29%7D%0A%20%20%20%20%20%20%2F%3E%0A%20%20%20%20%3C%2FView%3E%0A%20%20%29%3B%0A%7D%0A%0Afunction%20Details%28%7B%20navigation%2C%20route%20%7D%29%20%7B%0A%20%20const%20%7B%20title%20%3D%20%27Unknown%20Item%27%20%7D%20%3D%20route.params%20%3F%3F%20%7B%7D%3B%0A%0A%20%20return%20%28%0A%20%20%20%20%3CView%20style%3D%7B%7B%20flex%3A%201%2C%20alignItems%3A%20%27center%27%2C%20justifyContent%3A%20%27center%27%20%7D%7D%3E%0A%20%20%20%20%20%20%3CText%3EEditing%3A%20%7Btitle%7D%3C%2FText%3E%0A%20%20%20%20%20%20%3CButton%0A%20%20%20%20%20%20%20%20title%3D%22Rename%20to%20Super%20Widget%22%0A%20%20%20%20%20%20%20%20onPress%3D%7B%28%29%20%3D%3E%20navigation.setParams%28%7B%20title%3A%20%27Super%20Widget%27%20%7D%29%7D%0A%20%20%20%20%20%20%2F%3E%0A%20%20%20%20%3C%2FView%3E%0A%20%20%29%3B%0A%7D%0A%0Aexport%20default%20function%20App%28%29%20%7B%0A%20%20return%20%28%0A%20%20%20%20%3CNavigationContainer%3E%0A%20%20%20%20%20%20%3CStack.Navigator%3E%0A%20%20%20%20%20%20%20%20%3CStack.Screen%20name%3D%22Home%22%20component%3D%7BHome%7D%20%2F%3E%0A%20%20%20%20%20%20%20%20%3CStack.Screen%0A%20%20%20%20%20%20%20%20%20%20name%3D%22Details%22%0A%20%20%20%20%20%20%20%20%20%20component%3D%7BDetails%7D%0A%20%20%20%20%20%20%20%20%20%20options%3D%7B%28%7B%20route%20%7D%29%20%3D%3E%20%28%7B%20title%3A%20route.params%3F.title%20%3F%3F%20%27Details%27%20%7D%29%7D%0A%20%20%20%20%20%20%20%20%2F%3E%0A%20%20%20%20%20%20%3C%2FStack.Navigator%3E%0A%20%20%20%20%3C%2FNavigationContainer%3E%0A%20%20%29%3B%0A%7D%0A&dependencies=%40react-navigation%2Fnative%40%5E7.0.0%2C%40react-navigation%2Fnative-stack%40%5E7.0.0%2Creact-native-safe-area-context%40~5.6.0%2Creact-native-screens%40~4.16.0)** (SDK 54, 필요한 패키지 자동 포함) <button class="snack-embed" type="button">👀 여기서 결과 보기</button>



`setParams()` merges the new values into the existing params, so any params you don't mention keep their values.

**🇰🇷 한글 해설**

`navigation.setParams({ title: 'Super Widget' })` → **현재 화면**의 params를 바꿔요. params를 읽는 곳(헤더 options 포함)이 **자동으로 업데이트**. 그리고 **merge(합치기)** 라서 언급 안 한 params는 그대로 유지.

#### 📘 Moving through the stack

`navigate()` and `goBack()` cover most apps, but a stack navigator has a few more ways to move around:

| Method | What it does |
| --- | --- |
| `navigation.navigate('Name')` | Stays put if that screen is already focused (only its params update); otherwise pushes it |
| `navigation.push('Name')` | Always pushes a new copy of the screen, even if one is already focused, which suits drill-down flows |
| `navigation.goBack()` | Pops the current screen and returns to the previous one |
| `navigation.popTo('Name')` | Pops screens until the named screen is on top |
| `navigation.popToTop()` | Pops everything and returns to the first screen in the stack, for example after logging out |

Try each button below and watch the back arrow in the header. Pressing **Navigate to next level** only changes the level number, while **Push next level** adds a new screen you have to go back through.

```jsx
import { View, Text, Button } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

const Stack = createNativeStackNavigator();

function Home({ navigation }) {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>Home Screen</Text>
      <Button title="Open Level 1" onPress={() => navigation.navigate('Level', { depth: 1 })} />
    </View>
  );
}

function Level({ navigation, route }) {
  const { depth = 1 } = route.params ?? {};

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', gap: 8 }}>
      <Text>Level {depth}</Text>
      <Button
        title="Navigate to next level"
        onPress={() => navigation.navigate('Level', { depth: depth + 1 })}
      />
      <Button
        title="Push next level"
        onPress={() => navigation.push('Level', { depth: depth + 1 })}
      />
      <Button title="Go back" onPress={() => navigation.goBack()} />
      <Button title="Pop to Home" onPress={() => navigation.popTo('Home')} />
      <Button title="Pop to top" onPress={() => navigation.popToTop()} />
    </View>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Home" component={Home} />
        <Stack.Screen name="Level" component={Level} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
```

▶ **[Snack에서 바로 실행하기](https://snack.expo.dev/?name=WEB530%20W4%20Introduction%20to%20Navigation%20-%20Moving%20through%20the%20st&platform=web&sdkVersion=54.0.0&code=import%20%7B%20View%2C%20Text%2C%20Button%20%7D%20from%20%27react-native%27%3B%0Aimport%20%7B%20NavigationContainer%20%7D%20from%20%27%40react-navigation%2Fnative%27%3B%0Aimport%20%7B%20createNativeStackNavigator%20%7D%20from%20%27%40react-navigation%2Fnative-stack%27%3B%0A%0Aconst%20Stack%20%3D%20createNativeStackNavigator%28%29%3B%0A%0Afunction%20Home%28%7B%20navigation%20%7D%29%20%7B%0A%20%20return%20%28%0A%20%20%20%20%3CView%20style%3D%7B%7B%20flex%3A%201%2C%20alignItems%3A%20%27center%27%2C%20justifyContent%3A%20%27center%27%20%7D%7D%3E%0A%20%20%20%20%20%20%3CText%3EHome%20Screen%3C%2FText%3E%0A%20%20%20%20%20%20%3CButton%20title%3D%22Open%20Level%201%22%20onPress%3D%7B%28%29%20%3D%3E%20navigation.navigate%28%27Level%27%2C%20%7B%20depth%3A%201%20%7D%29%7D%20%2F%3E%0A%20%20%20%20%3C%2FView%3E%0A%20%20%29%3B%0A%7D%0A%0Afunction%20Level%28%7B%20navigation%2C%20route%20%7D%29%20%7B%0A%20%20const%20%7B%20depth%20%3D%201%20%7D%20%3D%20route.params%20%3F%3F%20%7B%7D%3B%0A%0A%20%20return%20%28%0A%20%20%20%20%3CView%20style%3D%7B%7B%20flex%3A%201%2C%20alignItems%3A%20%27center%27%2C%20justifyContent%3A%20%27center%27%2C%20gap%3A%208%20%7D%7D%3E%0A%20%20%20%20%20%20%3CText%3ELevel%20%7Bdepth%7D%3C%2FText%3E%0A%20%20%20%20%20%20%3CButton%0A%20%20%20%20%20%20%20%20title%3D%22Navigate%20to%20next%20level%22%0A%20%20%20%20%20%20%20%20onPress%3D%7B%28%29%20%3D%3E%20navigation.navigate%28%27Level%27%2C%20%7B%20depth%3A%20depth%20%2B%201%20%7D%29%7D%0A%20%20%20%20%20%20%2F%3E%0A%20%20%20%20%20%20%3CButton%0A%20%20%20%20%20%20%20%20title%3D%22Push%20next%20level%22%0A%20%20%20%20%20%20%20%20onPress%3D%7B%28%29%20%3D%3E%20navigation.push%28%27Level%27%2C%20%7B%20depth%3A%20depth%20%2B%201%20%7D%29%7D%0A%20%20%20%20%20%20%2F%3E%0A%20%20%20%20%20%20%3CButton%20title%3D%22Go%20back%22%20onPress%3D%7B%28%29%20%3D%3E%20navigation.goBack%28%29%7D%20%2F%3E%0A%20%20%20%20%20%20%3CButton%20title%3D%22Pop%20to%20Home%22%20onPress%3D%7B%28%29%20%3D%3E%20navigation.popTo%28%27Home%27%29%7D%20%2F%3E%0A%20%20%20%20%20%20%3CButton%20title%3D%22Pop%20to%20top%22%20onPress%3D%7B%28%29%20%3D%3E%20navigation.popToTop%28%29%7D%20%2F%3E%0A%20%20%20%20%3C%2FView%3E%0A%20%20%29%3B%0A%7D%0A%0Aexport%20default%20function%20App%28%29%20%7B%0A%20%20return%20%28%0A%20%20%20%20%3CNavigationContainer%3E%0A%20%20%20%20%20%20%3CStack.Navigator%3E%0A%20%20%20%20%20%20%20%20%3CStack.Screen%20name%3D%22Home%22%20component%3D%7BHome%7D%20%2F%3E%0A%20%20%20%20%20%20%20%20%3CStack.Screen%20name%3D%22Level%22%20component%3D%7BLevel%7D%20%2F%3E%0A%20%20%20%20%20%20%3C%2FStack.Navigator%3E%0A%20%20%20%20%3C%2FNavigationContainer%3E%0A%20%20%29%3B%0A%7D%0A&dependencies=%40react-navigation%2Fnative%40%5E7.0.0%2C%40react-navigation%2Fnative-stack%40%5E7.0.0%2Creact-native-safe-area-context%40~5.6.0%2Creact-native-screens%40~4.16.0)** (SDK 54, 필요한 패키지 자동 포함) <button class="snack-embed" type="button">👀 여기서 결과 보기</button>



Be careful using `navigate()` to return to a screen further down the stack. If Home is below the current screen, `navigation.navigate('Home')` does not go back to it; it pushes a second Home on top. Use `goBack()` or `popTo('Home')` instead.

**🇰🇷 한글 해설**

위 0번의 "스택 이동 메서드" 표가 바로 이 표예요. 예제에서 버튼을 하나씩 눌러 보며 헤더의 뒤로 가기 화살표를 관찰하세요.
- **Navigate to next level**: 이미 Level 화면에 있으니 **숫자만 바뀜**(새 화면 X).
- **Push next level**: 새 Level 화면이 쌓여서 뒤로 가기를 그만큼 더 눌러야 함.
- 마지막 문단 = 최대 함정: 아래쪽 Home으로 `navigate('Home')`하면 **Home이 하나 더 쌓임**. `goBack()`이나 `popTo('Home')` 사용.

#### 📘 The useNavigation hook

Only screens registered with a navigator receive the `navigation` prop. A component nested inside a screen, such as a reusable button, can get the same object from the `useNavigation()` hook.

```jsx
import { View, Text, Button } from 'react-native';
import { NavigationContainer, useNavigation } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

const Stack = createNativeStackNavigator();

// Not a screen, so it doesn't receive a navigation prop
function ProfileButton() {
  const navigation = useNavigation();

  return <Button title="View Profile" onPress={() => navigation.navigate('Profile')} />;
}

function Home() {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>Home Screen</Text>
      <ProfileButton />
    </View>
  );
}

function Profile() {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>Profile Screen</Text>
    </View>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Home" component={Home} />
        <Stack.Screen name="Profile" component={Profile} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
```

▶ **[Snack에서 바로 실행하기](https://snack.expo.dev/?name=WEB530%20W4%20Introduction%20to%20Navigation%20-%20The%20useNavigation%20hoo&platform=web&sdkVersion=54.0.0&code=import%20%7B%20View%2C%20Text%2C%20Button%20%7D%20from%20%27react-native%27%3B%0Aimport%20%7B%20NavigationContainer%2C%20useNavigation%20%7D%20from%20%27%40react-navigation%2Fnative%27%3B%0Aimport%20%7B%20createNativeStackNavigator%20%7D%20from%20%27%40react-navigation%2Fnative-stack%27%3B%0A%0Aconst%20Stack%20%3D%20createNativeStackNavigator%28%29%3B%0A%0A%2F%2F%20Not%20a%20screen%2C%20so%20it%20doesn%27t%20receive%20a%20navigation%20prop%0Afunction%20ProfileButton%28%29%20%7B%0A%20%20const%20navigation%20%3D%20useNavigation%28%29%3B%0A%0A%20%20return%20%3CButton%20title%3D%22View%20Profile%22%20onPress%3D%7B%28%29%20%3D%3E%20navigation.navigate%28%27Profile%27%29%7D%20%2F%3E%3B%0A%7D%0A%0Afunction%20Home%28%29%20%7B%0A%20%20return%20%28%0A%20%20%20%20%3CView%20style%3D%7B%7B%20flex%3A%201%2C%20alignItems%3A%20%27center%27%2C%20justifyContent%3A%20%27center%27%20%7D%7D%3E%0A%20%20%20%20%20%20%3CText%3EHome%20Screen%3C%2FText%3E%0A%20%20%20%20%20%20%3CProfileButton%20%2F%3E%0A%20%20%20%20%3C%2FView%3E%0A%20%20%29%3B%0A%7D%0A%0Afunction%20Profile%28%29%20%7B%0A%20%20return%20%28%0A%20%20%20%20%3CView%20style%3D%7B%7B%20flex%3A%201%2C%20alignItems%3A%20%27center%27%2C%20justifyContent%3A%20%27center%27%20%7D%7D%3E%0A%20%20%20%20%20%20%3CText%3EProfile%20Screen%3C%2FText%3E%0A%20%20%20%20%3C%2FView%3E%0A%20%20%29%3B%0A%7D%0A%0Aexport%20default%20function%20App%28%29%20%7B%0A%20%20return%20%28%0A%20%20%20%20%3CNavigationContainer%3E%0A%20%20%20%20%20%20%3CStack.Navigator%3E%0A%20%20%20%20%20%20%20%20%3CStack.Screen%20name%3D%22Home%22%20component%3D%7BHome%7D%20%2F%3E%0A%20%20%20%20%20%20%20%20%3CStack.Screen%20name%3D%22Profile%22%20component%3D%7BProfile%7D%20%2F%3E%0A%20%20%20%20%20%20%3C%2FStack.Navigator%3E%0A%20%20%20%20%3C%2FNavigationContainer%3E%0A%20%20%29%3B%0A%7D%0A&dependencies=%40react-navigation%2Fnative%40%5E7.0.0%2C%40react-navigation%2Fnative-stack%40%5E7.0.0%2Creact-native-safe-area-context%40~5.6.0%2Creact-native-screens%40~4.16.0)** (SDK 54, 필요한 패키지 자동 포함) <button class="snack-embed" type="button">👀 여기서 결과 보기</button>



Without the hook, `Home` would have to pass its `navigation` prop down to `ProfileButton`, and to every other component in between that needs it.

**🇰🇷 한글 해설**

**`navigation` prop은 Stack.Screen으로 등록된 "화면"만 받아요.** 화면 안에 있는 일반 컴포넌트(재사용 버튼 등)는 못 받아요.
- 해결: `const navigation = useNavigation();` (`@react-navigation/native`에서 import)
- 안 쓰면 Home이 `navigation`을 props로 버튼까지 계속 내려 줘야 해요(prop drilling).

#### 📘 Tab and drawer navigators

So far, we’ve used a stack navigator and buttons to move between screens. React Navigation also provides other navigator types, such as bottom tabs and drawers, which are common patterns in mobile apps. Tabs are often used for top‑level sections of an app, while drawers provide a slide‑out menu, though both can be used on any platform.

In this example, we’ll use `Platform.select()` to choose a different navigator depending on the device. On iOS, we’ll show a bottom tab navigator; on Android, a drawer navigator; and on any other platform, we’ll fall back to a stack navigator. This isn’t a requirement (tabs and drawers work everywhere), but it’s a useful way to demonstrate how `Platform.select()` can dynamically change UI behavior.

```jsx
import { View, Text, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createDrawerNavigator } from '@react-navigation/drawer';

function Home() {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>Home Content</Text>
    </View>
  );
}

function Settings() {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>Settings Content</Text>
    </View>
  );
}

const Stack = createNativeStackNavigator();
const Tabs = createBottomTabNavigator();
const Drawer = createDrawerNavigator();

// Choose a navigator based on the platform
const Navigator = Platform.select({
  ios: () => (
    <Tabs.Navigator>
      <Tabs.Screen
        name="Home"
        component={Home}
        options={{
          tabBarIcon: ({ color, size }) => <Ionicons name="home" color={color} size={size} />,
        }}
      />
      <Tabs.Screen
        name="Settings"
        component={Settings}
        options={{
          tabBarIcon: ({ color, size }) => <Ionicons name="settings" color={color} size={size} />,
        }}
      />
    </Tabs.Navigator>
  ),
  android: () => (
    <Drawer.Navigator>
      <Drawer.Screen name="Home" component={Home} />
      <Drawer.Screen name="Settings" component={Settings} />
    </Drawer.Navigator>
  ),
  default: () => (
    <Stack.Navigator initialRouteName="Home">
      <Stack.Screen name="Home" component={Home} />
      <Stack.Screen name="Settings" component={Settings} />
    </Stack.Navigator>
  ),
});

export default function App() {
  return <NavigationContainer>{Navigator()}</NavigationContainer>;
}
```

▶ **[Snack에서 바로 실행하기](https://snack.expo.dev/?name=WEB530%20W4%20Introduction%20to%20Navigation%20-%20Tab%20and%20drawer%20naviga&platform=web&sdkVersion=54.0.0&code=import%20%7B%20View%2C%20Text%2C%20Platform%20%7D%20from%20%27react-native%27%3B%0Aimport%20%7B%20Ionicons%20%7D%20from%20%27%40expo%2Fvector-icons%27%3B%0Aimport%20%7B%20NavigationContainer%20%7D%20from%20%27%40react-navigation%2Fnative%27%3B%0Aimport%20%7B%20createNativeStackNavigator%20%7D%20from%20%27%40react-navigation%2Fnative-stack%27%3B%0Aimport%20%7B%20createBottomTabNavigator%20%7D%20from%20%27%40react-navigation%2Fbottom-tabs%27%3B%0Aimport%20%7B%20createDrawerNavigator%20%7D%20from%20%27%40react-navigation%2Fdrawer%27%3B%0A%0Afunction%20Home%28%29%20%7B%0A%20%20return%20%28%0A%20%20%20%20%3CView%20style%3D%7B%7B%20flex%3A%201%2C%20alignItems%3A%20%27center%27%2C%20justifyContent%3A%20%27center%27%20%7D%7D%3E%0A%20%20%20%20%20%20%3CText%3EHome%20Content%3C%2FText%3E%0A%20%20%20%20%3C%2FView%3E%0A%20%20%29%3B%0A%7D%0A%0Afunction%20Settings%28%29%20%7B%0A%20%20return%20%28%0A%20%20%20%20%3CView%20style%3D%7B%7B%20flex%3A%201%2C%20alignItems%3A%20%27center%27%2C%20justifyContent%3A%20%27center%27%20%7D%7D%3E%0A%20%20%20%20%20%20%3CText%3ESettings%20Content%3C%2FText%3E%0A%20%20%20%20%3C%2FView%3E%0A%20%20%29%3B%0A%7D%0A%0Aconst%20Stack%20%3D%20createNativeStackNavigator%28%29%3B%0Aconst%20Tabs%20%3D%20createBottomTabNavigator%28%29%3B%0Aconst%20Drawer%20%3D%20createDrawerNavigator%28%29%3B%0A%0A%2F%2F%20Choose%20a%20navigator%20based%20on%20the%20platform%0Aconst%20Navigator%20%3D%20Platform.select%28%7B%0A%20%20ios%3A%20%28%29%20%3D%3E%20%28%0A%20%20%20%20%3CTabs.Navigator%3E%0A%20%20%20%20%20%20%3CTabs.Screen%0A%20%20%20%20%20%20%20%20name%3D%22Home%22%0A%20%20%20%20%20%20%20%20component%3D%7BHome%7D%0A%20%20%20%20%20%20%20%20options%3D%7B%7B%0A%20%20%20%20%20%20%20%20%20%20tabBarIcon%3A%20%28%7B%20color%2C%20size%20%7D%29%20%3D%3E%20%3CIonicons%20name%3D%22home%22%20color%3D%7Bcolor%7D%20size%3D%7Bsize%7D%20%2F%3E%2C%0A%20%20%20%20%20%20%20%20%7D%7D%0A%20%20%20%20%20%20%2F%3E%0A%20%20%20%20%20%20%3CTabs.Screen%0A%20%20%20%20%20%20%20%20name%3D%22Settings%22%0A%20%20%20%20%20%20%20%20component%3D%7BSettings%7D%0A%20%20%20%20%20%20%20%20options%3D%7B%7B%0A%20%20%20%20%20%20%20%20%20%20tabBarIcon%3A%20%28%7B%20color%2C%20size%20%7D%29%20%3D%3E%20%3CIonicons%20name%3D%22settings%22%20color%3D%7Bcolor%7D%20size%3D%7Bsize%7D%20%2F%3E%2C%0A%20%20%20%20%20%20%20%20%7D%7D%0A%20%20%20%20%20%20%2F%3E%0A%20%20%20%20%3C%2FTabs.Navigator%3E%0A%20%20%29%2C%0A%20%20android%3A%20%28%29%20%3D%3E%20%28%0A%20%20%20%20%3CDrawer.Navigator%3E%0A%20%20%20%20%20%20%3CDrawer.Screen%20name%3D%22Home%22%20component%3D%7BHome%7D%20%2F%3E%0A%20%20%20%20%20%20%3CDrawer.Screen%20name%3D%22Settings%22%20component%3D%7BSettings%7D%20%2F%3E%0A%20%20%20%20%3C%2FDrawer.Navigator%3E%0A%20%20%29%2C%0A%20%20default%3A%20%28%29%20%3D%3E%20%28%0A%20%20%20%20%3CStack.Navigator%20initialRouteName%3D%22Home%22%3E%0A%20%20%20%20%20%20%3CStack.Screen%20name%3D%22Home%22%20component%3D%7BHome%7D%20%2F%3E%0A%20%20%20%20%20%20%3CStack.Screen%20name%3D%22Settings%22%20component%3D%7BSettings%7D%20%2F%3E%0A%20%20%20%20%3C%2FStack.Navigator%3E%0A%20%20%29%2C%0A%7D%29%3B%0A%0Aexport%20default%20function%20App%28%29%20%7B%0A%20%20return%20%3CNavigationContainer%3E%7BNavigator%28%29%7D%3C%2FNavigationContainer%3E%3B%0A%7D%0A&dependencies=%40expo%2Fvector-icons%40%5E15.0.3%2C%40react-navigation%2Fbottom-tabs%40%5E7.0.0%2C%40react-navigation%2Fdrawer%40%5E7.0.0%2C%40react-navigation%2Fnative%40%5E7.0.0%2C%40react-navigation%2Fnative-stack%40%5E7.0.0%2Creact-native-gesture-handler%40~2.28.0%2Creact-native-reanimated%40~4.1.1%2Creact-native-safe-area-context%40~5.6.0%2Creact-native-screens%40~4.16.0%2Creact-native-worklets%400.5.1)** (SDK 54, 필요한 패키지 자동 포함) <button class="snack-embed" type="button">👀 여기서 결과 보기</button>



This example shows how different navigator types can be swapped in depending on the platform. When you run it, the preview starts on Web, so it shows the stack. Switch the preview to iOS to see the tabs, or to Android to see the drawer.

Each tab sets the `tabBarIcon` option to draw its icon. It is a function that receives the `color` and `size` the tab bar wants, so the icon changes colour when its tab is selected. Without it, the tab bar shows a placeholder symbol. The icons come from `@expo/vector-icons`, which is included in every Expo project.

All three navigators follow the same pattern. Each has its own creation function (`createNativeStackNavigator()`, `createBottomTabNavigator()` and `createDrawerNavigator()`), each uses the same `<X.Navigator>` and `<X.Screen>` JSX, and the screens inside them use the same `navigation` and `route` props. Navigators differ in how they look and behave, not in how you write screens.

**🇰🇷 한글 해설**

**Tab**: 앱의 큰 섹션(최상위)용. **Drawer**: 옆에서 나오는 메뉴. 둘 다 모든 플랫폼에서 쓸 수 있어요.

예제는 3주차 `Platform.select()`로 **플랫폼마다 다른 내비게이터**를 골라요: iOS = 탭, Android = 드로어, 그 외(web) = 스택. (필수는 아니고 시연용)
- `Platform.select`가 고른 건 **JSX를 돌려주는 함수**라서 `{Navigator()}` 처럼 **호출**해서 넣어요.
- `tabBarIcon: ({ color, size }) => <Ionicons name="home" color={color} size={size} />` → 탭 바가 원하는 색과 크기를 받아서 아이콘을 그리는 **함수**. 선택된 탭은 색이 바뀌어요. 없으면 placeholder 기호가 나와요.

**결론 문단 (시험 문장)**: 세 내비게이터는 생성 함수만 다르고, `<X.Navigator>`, `<X.Screen>` JSX와 화면이 받는 `navigation`, `route` props는 **똑같다.** "Navigators differ in how they look and behave, not in how you write screens."

#### 📘 Nesting navigators

Real apps almost always use more than one navigator: for example, a stack for signing in, tabs for the main sections of the app, and a drawer for settings. They are combined by nesting one navigator inside a screen of another. Common patterns include:

* **Stack → Tabs:** tabs inside a stack, so detail screens open over the tab bar.
* **Tabs → Stack:** each tab has its own stack of screens.
* **Drawer → Tabs → Stack:** very common in large apps.
* **Stack → Drawer:** the drawer only appears after the user logs in.

The example below uses the first pattern. The tabs are the app's main sections, and detail screens pushed on the stack open over the tab bar.

```jsx
import { View, Text, Button } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

const Stack = createNativeStackNavigator();
const Tabs = createBottomTabNavigator();

function Feed({ navigation }) {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>Feed</Text>
      <Button title="Open Post" onPress={() => navigation.navigate('Post')} />
    </View>
  );
}

function Account() {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>Account</Text>
    </View>
  );
}

function Post({ navigation }) {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>Post Details</Text>
      <Button
        title="Go to the Account tab"
        onPress={() => navigation.popTo('Main', { screen: 'Account' })}
      />
    </View>
  );
}

// The tab navigator is itself a screen in the stack below
function MainTabs() {
  return (
    <Tabs.Navigator>
      <Tabs.Screen
        name="Feed"
        component={Feed}
        options={{
          tabBarIcon: ({ color, size }) => <Ionicons name="newspaper" color={color} size={size} />,
        }}
      />
      <Tabs.Screen
        name="Account"
        component={Account}
        options={{
          tabBarIcon: ({ color, size }) => <Ionicons name="person" color={color} size={size} />,
        }}
      />
    </Tabs.Navigator>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Main" component={MainTabs} options={{ headerShown: false }} />
        <Stack.Screen name="Post" component={Post} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
```

▶ **[Snack에서 바로 실행하기](https://snack.expo.dev/?name=WEB530%20W4%20Introduction%20to%20Navigation%20-%20Nesting%20navigators&platform=web&sdkVersion=54.0.0&code=import%20%7B%20View%2C%20Text%2C%20Button%20%7D%20from%20%27react-native%27%3B%0Aimport%20%7B%20Ionicons%20%7D%20from%20%27%40expo%2Fvector-icons%27%3B%0Aimport%20%7B%20NavigationContainer%20%7D%20from%20%27%40react-navigation%2Fnative%27%3B%0Aimport%20%7B%20createNativeStackNavigator%20%7D%20from%20%27%40react-navigation%2Fnative-stack%27%3B%0Aimport%20%7B%20createBottomTabNavigator%20%7D%20from%20%27%40react-navigation%2Fbottom-tabs%27%3B%0A%0Aconst%20Stack%20%3D%20createNativeStackNavigator%28%29%3B%0Aconst%20Tabs%20%3D%20createBottomTabNavigator%28%29%3B%0A%0Afunction%20Feed%28%7B%20navigation%20%7D%29%20%7B%0A%20%20return%20%28%0A%20%20%20%20%3CView%20style%3D%7B%7B%20flex%3A%201%2C%20alignItems%3A%20%27center%27%2C%20justifyContent%3A%20%27center%27%20%7D%7D%3E%0A%20%20%20%20%20%20%3CText%3EFeed%3C%2FText%3E%0A%20%20%20%20%20%20%3CButton%20title%3D%22Open%20Post%22%20onPress%3D%7B%28%29%20%3D%3E%20navigation.navigate%28%27Post%27%29%7D%20%2F%3E%0A%20%20%20%20%3C%2FView%3E%0A%20%20%29%3B%0A%7D%0A%0Afunction%20Account%28%29%20%7B%0A%20%20return%20%28%0A%20%20%20%20%3CView%20style%3D%7B%7B%20flex%3A%201%2C%20alignItems%3A%20%27center%27%2C%20justifyContent%3A%20%27center%27%20%7D%7D%3E%0A%20%20%20%20%20%20%3CText%3EAccount%3C%2FText%3E%0A%20%20%20%20%3C%2FView%3E%0A%20%20%29%3B%0A%7D%0A%0Afunction%20Post%28%7B%20navigation%20%7D%29%20%7B%0A%20%20return%20%28%0A%20%20%20%20%3CView%20style%3D%7B%7B%20flex%3A%201%2C%20alignItems%3A%20%27center%27%2C%20justifyContent%3A%20%27center%27%20%7D%7D%3E%0A%20%20%20%20%20%20%3CText%3EPost%20Details%3C%2FText%3E%0A%20%20%20%20%20%20%3CButton%0A%20%20%20%20%20%20%20%20title%3D%22Go%20to%20the%20Account%20tab%22%0A%20%20%20%20%20%20%20%20onPress%3D%7B%28%29%20%3D%3E%20navigation.popTo%28%27Main%27%2C%20%7B%20screen%3A%20%27Account%27%20%7D%29%7D%0A%20%20%20%20%20%20%2F%3E%0A%20%20%20%20%3C%2FView%3E%0A%20%20%29%3B%0A%7D%0A%0A%2F%2F%20The%20tab%20navigator%20is%20itself%20a%20screen%20in%20the%20stack%20below%0Afunction%20MainTabs%28%29%20%7B%0A%20%20return%20%28%0A%20%20%20%20%3CTabs.Navigator%3E%0A%20%20%20%20%20%20%3CTabs.Screen%0A%20%20%20%20%20%20%20%20name%3D%22Feed%22%0A%20%20%20%20%20%20%20%20component%3D%7BFeed%7D%0A%20%20%20%20%20%20%20%20options%3D%7B%7B%0A%20%20%20%20%20%20%20%20%20%20tabBarIcon%3A%20%28%7B%20color%2C%20size%20%7D%29%20%3D%3E%20%3CIonicons%20name%3D%22newspaper%22%20color%3D%7Bcolor%7D%20size%3D%7Bsize%7D%20%2F%3E%2C%0A%20%20%20%20%20%20%20%20%7D%7D%0A%20%20%20%20%20%20%2F%3E%0A%20%20%20%20%20%20%3CTabs.Screen%0A%20%20%20%20%20%20%20%20name%3D%22Account%22%0A%20%20%20%20%20%20%20%20component%3D%7BAccount%7D%0A%20%20%20%20%20%20%20%20options%3D%7B%7B%0A%20%20%20%20%20%20%20%20%20%20tabBarIcon%3A%20%28%7B%20color%2C%20size%20%7D%29%20%3D%3E%20%3CIonicons%20name%3D%22person%22%20color%3D%7Bcolor%7D%20size%3D%7Bsize%7D%20%2F%3E%2C%0A%20%20%20%20%20%20%20%20%7D%7D%0A%20%20%20%20%20%20%2F%3E%0A%20%20%20%20%3C%2FTabs.Navigator%3E%0A%20%20%29%3B%0A%7D%0A%0Aexport%20default%20function%20App%28%29%20%7B%0A%20%20return%20%28%0A%20%20%20%20%3CNavigationContainer%3E%0A%20%20%20%20%20%20%3CStack.Navigator%3E%0A%20%20%20%20%20%20%20%20%3CStack.Screen%20name%3D%22Main%22%20component%3D%7BMainTabs%7D%20options%3D%7B%7B%20headerShown%3A%20false%20%7D%7D%20%2F%3E%0A%20%20%20%20%20%20%20%20%3CStack.Screen%20name%3D%22Post%22%20component%3D%7BPost%7D%20%2F%3E%0A%20%20%20%20%20%20%3C%2FStack.Navigator%3E%0A%20%20%20%20%3C%2FNavigationContainer%3E%0A%20%20%29%3B%0A%7D%0A&dependencies=%40expo%2Fvector-icons%40%5E15.0.3%2C%40react-navigation%2Fbottom-tabs%40%5E7.0.0%2C%40react-navigation%2Fnative%40%5E7.0.0%2C%40react-navigation%2Fnative-stack%40%5E7.0.0%2Creact-native-safe-area-context%40~5.6.0%2Creact-native-screens%40~4.16.0)** (SDK 54, 필요한 패키지 자동 포함) <button class="snack-embed" type="button">👀 여기서 결과 보기</button>



Each navigator manages its own history, and screens inside any navigator receive the same `navigation` and `route` props. When `Feed` calls `navigation.navigate('Post')`, the tab navigator doesn't have a `Post` screen, so the action passes up to the parent stack, which pushes `Post` over the tabs.

Going the other way needs one extra step. `Post` can't call `navigation.navigate('Account')`, because `Account` lives inside the nested tab navigator, and React Navigation only looks in the current navigator and its parents. Instead, name the parent screen first and the nested screen second: `navigation.popTo('Main', { screen: 'Account' })`.

It uses `popTo()` rather than `navigate()` because `Main` is below `Post` in the stack. This is the same trap as going back with `navigate()`: `navigation.navigate('Main', { screen: 'Account' })` looks like it works, but it pushes a second copy of the tabs on top of `Post`. There is no back arrow to reveal the mistake, because `Main` hides its header, and on Android the back button returns to `Post` instead of leaving the app. `popTo()` goes back to the existing `Main` and then selects the `Account` tab.

The second pattern turns this inside out. The tabs are the parent, and one tab holds a stack. The tab bar stays visible on every screen, including the ones the stack pushes, which is how most apps with a bottom tab bar behave.

```jsx
import { View, Text, Button } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

const Stack = createNativeStackNavigator();
const Tabs = createBottomTabNavigator();

function Inbox({ navigation }) {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>Inbox</Text>
      <Button
        title="Open thread with Sam"
        onPress={() => navigation.navigate('Thread', { from: 'Sam' })}
      />
    </View>
  );
}

function Thread({ route }) {
  const { from = 'Unknown' } = route.params ?? {};

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>Thread with {from}</Text>
    </View>
  );
}

function Contacts({ navigation }) {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>Contacts</Text>
      <Button
        title="Message Sam"
        onPress={() =>
          navigation.navigate('Messages', { screen: 'Thread', params: { from: 'Sam' } })
        }
      />
    </View>
  );
}

// The stack is itself a screen in the tab navigator below
function MessagesStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Inbox" component={Inbox} />
      <Stack.Screen
        name="Thread"
        component={Thread}
        options={({ route }) => ({ title: route.params?.from ?? 'Thread' })}
      />
    </Stack.Navigator>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <Tabs.Navigator>
        <Tabs.Screen
          name="Messages"
          component={MessagesStack}
          options={{
            headerShown: false,
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="chatbubbles" color={color} size={size} />
            ),
          }}
        />
        <Tabs.Screen
          name="Contacts"
          component={Contacts}
          options={{
            tabBarIcon: ({ color, size }) => <Ionicons name="people" color={color} size={size} />,
          }}
        />
      </Tabs.Navigator>
    </NavigationContainer>
  );
}
```

▶ **[Snack에서 바로 실행하기](https://snack.expo.dev/?name=WEB530%20W4%20Introduction%20to%20Navigation%20-%20Nesting%20navigators&platform=web&sdkVersion=54.0.0&code=import%20%7B%20View%2C%20Text%2C%20Button%20%7D%20from%20%27react-native%27%3B%0Aimport%20%7B%20Ionicons%20%7D%20from%20%27%40expo%2Fvector-icons%27%3B%0Aimport%20%7B%20NavigationContainer%20%7D%20from%20%27%40react-navigation%2Fnative%27%3B%0Aimport%20%7B%20createNativeStackNavigator%20%7D%20from%20%27%40react-navigation%2Fnative-stack%27%3B%0Aimport%20%7B%20createBottomTabNavigator%20%7D%20from%20%27%40react-navigation%2Fbottom-tabs%27%3B%0A%0Aconst%20Stack%20%3D%20createNativeStackNavigator%28%29%3B%0Aconst%20Tabs%20%3D%20createBottomTabNavigator%28%29%3B%0A%0Afunction%20Inbox%28%7B%20navigation%20%7D%29%20%7B%0A%20%20return%20%28%0A%20%20%20%20%3CView%20style%3D%7B%7B%20flex%3A%201%2C%20alignItems%3A%20%27center%27%2C%20justifyContent%3A%20%27center%27%20%7D%7D%3E%0A%20%20%20%20%20%20%3CText%3EInbox%3C%2FText%3E%0A%20%20%20%20%20%20%3CButton%0A%20%20%20%20%20%20%20%20title%3D%22Open%20thread%20with%20Sam%22%0A%20%20%20%20%20%20%20%20onPress%3D%7B%28%29%20%3D%3E%20navigation.navigate%28%27Thread%27%2C%20%7B%20from%3A%20%27Sam%27%20%7D%29%7D%0A%20%20%20%20%20%20%2F%3E%0A%20%20%20%20%3C%2FView%3E%0A%20%20%29%3B%0A%7D%0A%0Afunction%20Thread%28%7B%20route%20%7D%29%20%7B%0A%20%20const%20%7B%20from%20%3D%20%27Unknown%27%20%7D%20%3D%20route.params%20%3F%3F%20%7B%7D%3B%0A%0A%20%20return%20%28%0A%20%20%20%20%3CView%20style%3D%7B%7B%20flex%3A%201%2C%20alignItems%3A%20%27center%27%2C%20justifyContent%3A%20%27center%27%20%7D%7D%3E%0A%20%20%20%20%20%20%3CText%3EThread%20with%20%7Bfrom%7D%3C%2FText%3E%0A%20%20%20%20%3C%2FView%3E%0A%20%20%29%3B%0A%7D%0A%0Afunction%20Contacts%28%7B%20navigation%20%7D%29%20%7B%0A%20%20return%20%28%0A%20%20%20%20%3CView%20style%3D%7B%7B%20flex%3A%201%2C%20alignItems%3A%20%27center%27%2C%20justifyContent%3A%20%27center%27%20%7D%7D%3E%0A%20%20%20%20%20%20%3CText%3EContacts%3C%2FText%3E%0A%20%20%20%20%20%20%3CButton%0A%20%20%20%20%20%20%20%20title%3D%22Message%20Sam%22%0A%20%20%20%20%20%20%20%20onPress%3D%7B%28%29%20%3D%3E%0A%20%20%20%20%20%20%20%20%20%20navigation.navigate%28%27Messages%27%2C%20%7B%20screen%3A%20%27Thread%27%2C%20params%3A%20%7B%20from%3A%20%27Sam%27%20%7D%20%7D%29%0A%20%20%20%20%20%20%20%20%7D%0A%20%20%20%20%20%20%2F%3E%0A%20%20%20%20%3C%2FView%3E%0A%20%20%29%3B%0A%7D%0A%0A%2F%2F%20The%20stack%20is%20itself%20a%20screen%20in%20the%20tab%20navigator%20below%0Afunction%20MessagesStack%28%29%20%7B%0A%20%20return%20%28%0A%20%20%20%20%3CStack.Navigator%3E%0A%20%20%20%20%20%20%3CStack.Screen%20name%3D%22Inbox%22%20component%3D%7BInbox%7D%20%2F%3E%0A%20%20%20%20%20%20%3CStack.Screen%0A%20%20%20%20%20%20%20%20name%3D%22Thread%22%0A%20%20%20%20%20%20%20%20component%3D%7BThread%7D%0A%20%20%20%20%20%20%20%20options%3D%7B%28%7B%20route%20%7D%29%20%3D%3E%20%28%7B%20title%3A%20route.params%3F.from%20%3F%3F%20%27Thread%27%20%7D%29%7D%0A%20%20%20%20%20%20%2F%3E%0A%20%20%20%20%3C%2FStack.Navigator%3E%0A%20%20%29%3B%0A%7D%0A%0Aexport%20default%20function%20App%28%29%20%7B%0A%20%20return%20%28%0A%20%20%20%20%3CNavigationContainer%3E%0A%20%20%20%20%20%20%3CTabs.Navigator%3E%0A%20%20%20%20%20%20%20%20%3CTabs.Screen%0A%20%20%20%20%20%20%20%20%20%20name%3D%22Messages%22%0A%20%20%20%20%20%20%20%20%20%20component%3D%7BMessagesStack%7D%0A%20%20%20%20%20%20%20%20%20%20options%3D%7B%7B%0A%20%20%20%20%20%20%20%20%20%20%20%20headerShown%3A%20false%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20tabBarIcon%3A%20%28%7B%20color%2C%20size%20%7D%29%20%3D%3E%20%28%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3CIonicons%20name%3D%22chatbubbles%22%20color%3D%7Bcolor%7D%20size%3D%7Bsize%7D%20%2F%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%29%2C%0A%20%20%20%20%20%20%20%20%20%20%7D%7D%0A%20%20%20%20%20%20%20%20%2F%3E%0A%20%20%20%20%20%20%20%20%3CTabs.Screen%0A%20%20%20%20%20%20%20%20%20%20name%3D%22Contacts%22%0A%20%20%20%20%20%20%20%20%20%20component%3D%7BContacts%7D%0A%20%20%20%20%20%20%20%20%20%20options%3D%7B%7B%0A%20%20%20%20%20%20%20%20%20%20%20%20tabBarIcon%3A%20%28%7B%20color%2C%20size%20%7D%29%20%3D%3E%20%3CIonicons%20name%3D%22people%22%20color%3D%7Bcolor%7D%20size%3D%7Bsize%7D%20%2F%3E%2C%0A%20%20%20%20%20%20%20%20%20%20%7D%7D%0A%20%20%20%20%20%20%20%20%2F%3E%0A%20%20%20%20%20%20%3C%2FTabs.Navigator%3E%0A%20%20%20%20%3C%2FNavigationContainer%3E%0A%20%20%29%3B%0A%7D%0A&dependencies=%40expo%2Fvector-icons%40%5E15.0.3%2C%40react-navigation%2Fbottom-tabs%40%5E7.0.0%2C%40react-navigation%2Fnative%40%5E7.0.0%2C%40react-navigation%2Fnative-stack%40%5E7.0.0%2Creact-native-safe-area-context%40~5.6.0%2Creact-native-screens%40~4.16.0)** (SDK 54, 필요한 패키지 자동 포함) <button class="snack-embed" type="button">👀 여기서 결과 보기</button>



Two things to notice. First, a tab navigator draws a header of its own, and so does the stack, so the Messages tab would show two headers stacked on top of each other. `headerShown: false` on the Messages tab hides the tab's header and lets the stack's header, with its back arrow, do the work. The Contacts tab has no stack, so it keeps the tab's header. Second, `Contacts` is outside the stack, so it can't call `navigation.navigate('Thread')` directly. It names the tab first and the screen inside it second, with the params alongside: `navigation.navigate('Messages', { screen: 'Thread', params: { from: 'Sam' } })`. A tab navigator never pushes anything, so this just switches to the Messages tab and the stack inside it opens the thread.

**🇰🇷 한글 해설**

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


---

## 2. 📘 코스노트: Handling State

> 원문 출처: https://seneca-ictoer.github.io/WEB530/D-Navigation/handling-state

On the previous page, we looked at examples that passed data between screens using route parameters. But many apps need shared global state, for example, an inventory count that updates across multiple screens. In React Navigation, there is no special navigation-specific state API. Instead, you manage global state the same way you would in any React app.

To keep things simple and modern, we’ll use Jotai, the lightweight global state library from [Hooks for Stateful Components](https://seneca-ictoer.github.io/WEB530/B-Components/hooks#global-state-with-jotai). It works well with React Native and React Navigation. Jotai lets you create small “atoms” that hold state, and any component can read or update them without prop drilling.

Below is a version of the earlier “custom header” example rewritten to use Jotai for global state. To run it in your own Snack, add `jotai` to the package.json from the previous page, along with `@types/react`. Jotai doesn't need `@types/react`, but Snack reports it as missing without it.

```jsx
import { View, Text, Button } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { atom, useAtom } from 'jotai';

const Stack = createNativeStackNavigator();

// Global state atom
const itemsAtom = atom({
  first: 5,
  second: 0,
  third: 15,
});

// ItemList screen
function ItemList({ navigation }) {
  const [items] = useAtom(itemsAtom);

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Button
        title={`First Item (${items.first})`}
        onPress={() =>
          navigation.navigate('Details', {
            id: 'first',
            title: 'First Item',
            desc: 'First item description',
          })
        }
      />

      <Button
        title={`Second Item (${items.second})`}
        onPress={() =>
          navigation.navigate('Details', {
            id: 'second',
            title: 'Second Item',
            desc: 'Second item description',
          })
        }
      />

      <Button
        title={`Third Item (${items.third})`}
        onPress={() =>
          navigation.navigate('Details', {
            id: 'third',
            title: 'Third Item',
            desc: 'Third item description',
          })
        }
      />
    </View>
  );
}

// Details screen
function Details({ route }) {
  const { desc = 'No description' } = route.params ?? {};
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>Description: {desc}</Text>
    </View>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="ItemList">
        <Stack.Screen name="ItemList" component={ItemList} />

        <Stack.Screen
          name="Details"
          component={Details}
          options={({ route }) => ({
            title: route.params?.title ?? 'Details',
            headerRight: () => <BuyButton route={route} />,
          })}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

// Header button that updates global state
function BuyButton({ route }) {
  const [items, setItems] = useAtom(itemsAtom);
  const id = route.params?.id;
  const qty = items[id] ?? 0;

  const decrement = () => {
    setItems((prev) => ({ ...prev, [id]: Math.max(0, prev[id] - 1) }));
  };

  return <Button title="Buy" onPress={decrement} disabled={qty === 0} />;
}
```

▶ **[Snack에서 바로 실행하기](https://snack.expo.dev/?name=WEB530%20W4%20Handling%20State&platform=web&sdkVersion=54.0.0&code=import%20%7B%20View%2C%20Text%2C%20Button%20%7D%20from%20%27react-native%27%3B%0Aimport%20%7B%20NavigationContainer%20%7D%20from%20%27%40react-navigation%2Fnative%27%3B%0Aimport%20%7B%20createNativeStackNavigator%20%7D%20from%20%27%40react-navigation%2Fnative-stack%27%3B%0Aimport%20%7B%20atom%2C%20useAtom%20%7D%20from%20%27jotai%27%3B%0A%0Aconst%20Stack%20%3D%20createNativeStackNavigator%28%29%3B%0A%0A%2F%2F%20Global%20state%20atom%0Aconst%20itemsAtom%20%3D%20atom%28%7B%0A%20%20first%3A%205%2C%0A%20%20second%3A%200%2C%0A%20%20third%3A%2015%2C%0A%7D%29%3B%0A%0A%2F%2F%20ItemList%20screen%0Afunction%20ItemList%28%7B%20navigation%20%7D%29%20%7B%0A%20%20const%20%5Bitems%5D%20%3D%20useAtom%28itemsAtom%29%3B%0A%0A%20%20return%20%28%0A%20%20%20%20%3CView%20style%3D%7B%7B%20flex%3A%201%2C%20alignItems%3A%20%27center%27%2C%20justifyContent%3A%20%27center%27%20%7D%7D%3E%0A%20%20%20%20%20%20%3CButton%0A%20%20%20%20%20%20%20%20title%3D%7B%60First%20Item%20%28%24%7Bitems.first%7D%29%60%7D%0A%20%20%20%20%20%20%20%20onPress%3D%7B%28%29%20%3D%3E%0A%20%20%20%20%20%20%20%20%20%20navigation.navigate%28%27Details%27%2C%20%7B%0A%20%20%20%20%20%20%20%20%20%20%20%20id%3A%20%27first%27%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20title%3A%20%27First%20Item%27%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20desc%3A%20%27First%20item%20description%27%2C%0A%20%20%20%20%20%20%20%20%20%20%7D%29%0A%20%20%20%20%20%20%20%20%7D%0A%20%20%20%20%20%20%2F%3E%0A%0A%20%20%20%20%20%20%3CButton%0A%20%20%20%20%20%20%20%20title%3D%7B%60Second%20Item%20%28%24%7Bitems.second%7D%29%60%7D%0A%20%20%20%20%20%20%20%20onPress%3D%7B%28%29%20%3D%3E%0A%20%20%20%20%20%20%20%20%20%20navigation.navigate%28%27Details%27%2C%20%7B%0A%20%20%20%20%20%20%20%20%20%20%20%20id%3A%20%27second%27%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20title%3A%20%27Second%20Item%27%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20desc%3A%20%27Second%20item%20description%27%2C%0A%20%20%20%20%20%20%20%20%20%20%7D%29%0A%20%20%20%20%20%20%20%20%7D%0A%20%20%20%20%20%20%2F%3E%0A%0A%20%20%20%20%20%20%3CButton%0A%20%20%20%20%20%20%20%20title%3D%7B%60Third%20Item%20%28%24%7Bitems.third%7D%29%60%7D%0A%20%20%20%20%20%20%20%20onPress%3D%7B%28%29%20%3D%3E%0A%20%20%20%20%20%20%20%20%20%20navigation.navigate%28%27Details%27%2C%20%7B%0A%20%20%20%20%20%20%20%20%20%20%20%20id%3A%20%27third%27%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20title%3A%20%27Third%20Item%27%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20desc%3A%20%27Third%20item%20description%27%2C%0A%20%20%20%20%20%20%20%20%20%20%7D%29%0A%20%20%20%20%20%20%20%20%7D%0A%20%20%20%20%20%20%2F%3E%0A%20%20%20%20%3C%2FView%3E%0A%20%20%29%3B%0A%7D%0A%0A%2F%2F%20Details%20screen%0Afunction%20Details%28%7B%20route%20%7D%29%20%7B%0A%20%20const%20%7B%20desc%20%3D%20%27No%20description%27%20%7D%20%3D%20route.params%20%3F%3F%20%7B%7D%3B%0A%20%20return%20%28%0A%20%20%20%20%3CView%20style%3D%7B%7B%20flex%3A%201%2C%20alignItems%3A%20%27center%27%2C%20justifyContent%3A%20%27center%27%20%7D%7D%3E%0A%20%20%20%20%20%20%3CText%3EDescription%3A%20%7Bdesc%7D%3C%2FText%3E%0A%20%20%20%20%3C%2FView%3E%0A%20%20%29%3B%0A%7D%0A%0Aexport%20default%20function%20App%28%29%20%7B%0A%20%20return%20%28%0A%20%20%20%20%3CNavigationContainer%3E%0A%20%20%20%20%20%20%3CStack.Navigator%20initialRouteName%3D%22ItemList%22%3E%0A%20%20%20%20%20%20%20%20%3CStack.Screen%20name%3D%22ItemList%22%20component%3D%7BItemList%7D%20%2F%3E%0A%0A%20%20%20%20%20%20%20%20%3CStack.Screen%0A%20%20%20%20%20%20%20%20%20%20name%3D%22Details%22%0A%20%20%20%20%20%20%20%20%20%20component%3D%7BDetails%7D%0A%20%20%20%20%20%20%20%20%20%20options%3D%7B%28%7B%20route%20%7D%29%20%3D%3E%20%28%7B%0A%20%20%20%20%20%20%20%20%20%20%20%20title%3A%20route.params%3F.title%20%3F%3F%20%27Details%27%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20headerRight%3A%20%28%29%20%3D%3E%20%3CBuyButton%20route%3D%7Broute%7D%20%2F%3E%2C%0A%20%20%20%20%20%20%20%20%20%20%7D%29%7D%0A%20%20%20%20%20%20%20%20%2F%3E%0A%20%20%20%20%20%20%3C%2FStack.Navigator%3E%0A%20%20%20%20%3C%2FNavigationContainer%3E%0A%20%20%29%3B%0A%7D%0A%0A%2F%2F%20Header%20button%20that%20updates%20global%20state%0Afunction%20BuyButton%28%7B%20route%20%7D%29%20%7B%0A%20%20const%20%5Bitems%2C%20setItems%5D%20%3D%20useAtom%28itemsAtom%29%3B%0A%20%20const%20id%20%3D%20route.params%3F.id%3B%0A%20%20const%20qty%20%3D%20items%5Bid%5D%20%3F%3F%200%3B%0A%0A%20%20const%20decrement%20%3D%20%28%29%20%3D%3E%20%7B%0A%20%20%20%20setItems%28%28prev%29%20%3D%3E%20%28%7B%20...prev%2C%20%5Bid%5D%3A%20Math.max%280%2C%20prev%5Bid%5D%20-%201%29%20%7D%29%29%3B%0A%20%20%7D%3B%0A%0A%20%20return%20%3CButton%20title%3D%22Buy%22%20onPress%3D%7Bdecrement%7D%20disabled%3D%7Bqty%20%3D%3D%3D%200%7D%20%2F%3E%3B%0A%7D%0A&dependencies=%40react-navigation%2Fnative%40%5E7.0.0%2C%40react-navigation%2Fnative-stack%40%5E7.0.0%2C%40types%2Freact%40%2A%2Cjotai%40%2A%2Creact-native-safe-area-context%40~5.6.0%2Creact-native-screens%40~4.16.0)** (SDK 54, 필요한 패키지 자동 포함) <button class="snack-embed" type="button">👀 여기서 결과 보기</button>



This example uses Jotai to manage global state in a way that feels natural with React Navigation. The `itemsAtom` holds the inventory counts for each item, and any screen can read or update this atom using the `useAtom` hook. The `ItemList` screen reads the atom to display the current quantities, and the `Details` screen uses a custom header button that also reads from the atom and updates it when the user taps “Buy.” Because Jotai atoms are reactive, updating the atom automatically refreshes both the header and the UI on any screen that uses the same state. There’s no prop drilling and no navigation-specific state API. It’s just clean, modern React state management that works seamlessly with navigation. Try it: press **Buy** on the first item a few times, then go back and watch its count on the list.

💡 Another valid way to share state across screens is to “lift state up” into your `App()` component and pass it down through `props`. This works, but it quickly becomes more complex as your app grows because every screen needs to receive and forward that state. Jotai avoids this entirely by giving you simple global atoms that any screen can read or update without prop drilling. For most React Native apps, especially when combined with navigation, Jotai is the cleaner and more scalable approach.

**🇰🇷 한글 해설**

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


---

## 3. 💻 인클래스 예제: Week 4.1 - Notes and Examples

> 원문 출처: github.com/nick-romanidis/web530-2267-nsa  week-04.1-notes.md

### 💻 React Native Playground

React Native Playground (Snack)
_Use this for the examples. Modify App.js_
(https://snack.expo.dev)

- Keep Snack on SDK 54 (the default). SDK 55 currently fails to load `react-native-screens`, so no navigation example runs on it.
- Replace the contents of `package.json` before starting. Every example today uses it.

_package.json_

```json
{
  "dependencies": {
    "@react-navigation/native": "^7.0.0",
    "@react-navigation/native-stack": "^7.0.0",
    "@react-navigation/bottom-tabs": "^7.0.0",
    "@react-navigation/drawer": "^7.0.0",
    "react-native-screens": "~4.16.0",
    "react-native-safe-area-context": "~5.6.0",
    "react-native-gesture-handler": "~2.28.0",
    "react-native-reanimated": "~4.1.1",
    "react-native-worklets": "0.5.1",
    "@expo/vector-icons": "^15.0.3",
    "jotai": "*",
    "@types/react": "*"
  }
}
```

- The `@react-navigation` packages are pinned to version 7. Version 7 changed how `navigate()` behaves, so older tutorials can disagree with what students see.
- The other versions match SDK 54. If you switch SDKs, Snack flags the ones that don't match.
- `jotai` is for the last example. Snack asks for `@types/react` alongside it, even though Jotai doesn't need it.

**🇰🇷 한글 해설**

수업 시작 전에 Snack의 `package.json`을 이 내용으로 **교체**하라는 안내. 버전 7 고정 이유: 7에서 `navigate()` 동작이 바뀌어서 옛날 튜토리얼과 다르게 보일 수 있어요. jotai는 마지막 예제용.

### 💻 Why Navigation?

- A web browser gives you navigation for free: every page has a URL, and the back button walks through the history.
- React Native has none of that. Screens, transitions and the history of where the user has been are all managed in JavaScript.
- Real apps also want deep linking: opening the app directly on a screen, for example from a notification.
- React Navigation is the community standard. It provides stack, tab and drawer navigators, deep linking, and typed params for TypeScript.
- Once it is set up, it also handles the Android back button for you.

**🇰🇷 한글 해설**

웹은 URL + 뒤로 가기가 공짜, RN은 화면, 전환, 기록을 **전부 JS로** 관리해야 해요.

### 💻 Example: The NavigationContainer

- Every navigation app starts with a `NavigationContainer`. It holds the navigation state for the whole app.
- Show the empty shell. The navigators go inside it.

```jsx
import { NavigationContainer } from "@react-navigation/native";

export default function MyApp() {
  return <NavigationContainer>{/* Navigators go here */}</NavigationContainer>;
}
```

▶ 웹 React 코드예요. [교수님 CodeSandbox 템플릿](https://codesandbox.io/p/sandbox/react-basic-3rqll4)에 붙여넣어 실행하세요.

- It must be the outermost navigation component.
- Only one per app. A nested navigator never needs its own container.
- Think of it like the router in a React web app.

**🇰🇷 한글 해설**

**NavigationContainer 규칙 3개** (시험 포인트)
1. 가장 **바깥** 내비게이션 컴포넌트여야 함.
2. 앱에 **딱 하나**. 중첩된 내비게이터는 자기 컨테이너가 필요 없어요.
3. 웹 React의 router 같은 역할.

### 💻 Example: Stack Navigator

- Screens stack on top of each other like a deck of cards. Navigating forward **pushes** a screen, going back **pops** it.
- The most common navigation pattern in mobile apps.

**🇰🇷 한글 해설**

카드 더미 비유. 앞으로 가면 push, 뒤로 가면 pop. 모바일 앱에서 **가장 흔한** 패턴. 아래 Step을 따라 Starter Code를 완성해 가요.

#### 💻 Starter Code

- Paste this into `App.js`. The screens, buttons and styles are done. Nothing is connected yet.
- It runs as is: `MyApp` shows `HomeScreen` directly, and the button does nothing.

```jsx
import { View, Text, Button, StyleSheet } from "react-native";

function HomeScreen() {
  return (
    <View style={styles.screen}>
      <Text>Home Screen</Text>
      <Button title="Go to Settings" />
    </View>
  );
}

function SettingsScreen() {
  return (
    <View style={styles.screen}>
      <Text>Settings Screen</Text>
      <Button title="Go Back" />
    </View>
  );
}

export default function MyApp() {
  return <HomeScreen />;
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});
```

▶ **[Snack에서 바로 실행하기](https://snack.expo.dev/?name=WEB530%20W4%20Example%3A%20Stack%20Navigator%20-%20Starter%20Code&platform=web&sdkVersion=54.0.0&code=import%20%7B%20View%2C%20Text%2C%20Button%2C%20StyleSheet%20%7D%20from%20%22react-native%22%3B%0A%0Afunction%20HomeScreen%28%29%20%7B%0A%20%20return%20%28%0A%20%20%20%20%3CView%20style%3D%7Bstyles.screen%7D%3E%0A%20%20%20%20%20%20%3CText%3EHome%20Screen%3C%2FText%3E%0A%20%20%20%20%20%20%3CButton%20title%3D%22Go%20to%20Settings%22%20%2F%3E%0A%20%20%20%20%3C%2FView%3E%0A%20%20%29%3B%0A%7D%0A%0Afunction%20SettingsScreen%28%29%20%7B%0A%20%20return%20%28%0A%20%20%20%20%3CView%20style%3D%7Bstyles.screen%7D%3E%0A%20%20%20%20%20%20%3CText%3ESettings%20Screen%3C%2FText%3E%0A%20%20%20%20%20%20%3CButton%20title%3D%22Go%20Back%22%20%2F%3E%0A%20%20%20%20%3C%2FView%3E%0A%20%20%29%3B%0A%7D%0A%0Aexport%20default%20function%20MyApp%28%29%20%7B%0A%20%20return%20%3CHomeScreen%20%2F%3E%3B%0A%7D%0A%0Aconst%20styles%20%3D%20StyleSheet.create%28%7B%0A%20%20screen%3A%20%7B%0A%20%20%20%20flex%3A%201%2C%0A%20%20%20%20alignItems%3A%20%22center%22%2C%0A%20%20%20%20justifyContent%3A%20%22center%22%2C%0A%20%20%7D%2C%0A%7D%29%3B%0A)** (SDK 54, 필요한 패키지 자동 포함) <button class="snack-embed" type="button">👀 여기서 결과 보기</button>

**🇰🇷 한글 해설**

화면(Home, Settings), 버튼, 스타일은 다 있고 **연결만 안 된** 상태. 지금은 MyApp이 HomeScreen을 그냥 보여 줘요.

#### 💻 Step 1 - Import the Navigation Pieces

- Add two imports under the `react-native` import.

```jsx
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
```

- `NavigationContainer` comes from the core package. Every navigator type needs it.
- `createNativeStackNavigator` comes from the stack package. Tabs and drawers have their own packages later today.

**🇰🇷 한글 해설**

`NavigationContainer`는 core 패키지(`@react-navigation/native`), `createNativeStackNavigator`는 stack 패키지에서 import.

#### 💻 Step 2 - Create the Stack

- Add this line under the imports, outside every component.

```jsx
const Stack = createNativeStackNavigator();
```

- `createNativeStackNavigator()` returns an object with a `Navigator` and a `Screen`, used as `Stack.Navigator` and `Stack.Screen`.
- Create it once, at the top level. Calling it inside a component would build a new navigator on every render.

**🇰🇷 한글 해설**

`const Stack = createNativeStackNavigator();` 를 **컴포넌트 바깥, 맨 위**에 한 번. 컴포넌트 안에서 만들면 렌더링마다 새 내비게이터가 생겨요. 결과물은 `Stack.Navigator`와 `Stack.Screen`을 가진 객체.

#### 💻 Step 3 - Register the Screens

- Replace the `return` in `MyApp` with the container, the navigator, and one `Stack.Screen` per screen.

```jsx
export default function MyApp() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Settings" component={SettingsScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
```

▶ 웹 React 코드예요. [교수님 CodeSandbox 템플릿](https://codesandbox.io/p/sandbox/react-basic-3rqll4)에 붙여넣어 실행하세요.

- Each `Stack.Screen` maps a route name to a component. The `name` is what you navigate to.
- Pass the component itself, `component={HomeScreen}`, not `<HomeScreen />`. The navigator decides when to render it.
- `initialRouteName` picks the first screen. Without it, the first screen listed is used.
- Run it. Home now has a header titled "Home", taken from the route name. The button still does nothing, because nothing tells it where to go.

**🇰🇷 한글 해설**

- `name`(route 이름) ↔ `component`(컴포넌트) 연결.
- **`component={HomeScreen}`** 처럼 컴포넌트 **자체**를 넘겨요. `component={<HomeScreen />}` 아님! 언제 그릴지는 내비게이터가 정해요. (시험 함정)
- 헤더 제목은 기본으로 route 이름("Home").

#### 💻 Step 4 - Navigate Forward

- Every screen registered in Step 3 receives a `navigation` prop automatically. Destructure it in `HomeScreen`.

```jsx
function HomeScreen({ navigation }) {
```

- Give the button an `onPress` that navigates to the `Settings` route.

```jsx
<Button
  title="Go to Settings"
  onPress={() => navigation.navigate("Settings")}
/>
```

- The string must match a `name` from Step 3 exactly. A typo does nothing on screen, and the console logs that the `NAVIGATE` action "was not handled by any navigator".
- Run it. Pressing the button pushes Settings onto the stack, and a back arrow appears in its header on its own.

**🇰🇷 한글 해설**

- 등록된 화면은 `navigation` prop을 자동으로 받으니 `function HomeScreen({ navigation })` 으로 꺼내요.
- `navigation.navigate("Settings")` 문자열은 Step 3의 `name`과 **정확히** 같아야 해요. 오타면 화면엔 아무 일도 없고 콘솔에 `NAVIGATE` action "was not handled by any navigator" 메시지.
- Settings 헤더에 뒤로 가기 화살표가 **자동으로** 생겨요.

#### 💻 Step 5 - Go Back

- Do the same in `SettingsScreen`: destructure `navigation`, then add an `onPress` to the button.

```jsx
function SettingsScreen({ navigation }) {
```

```jsx
<Button title="Go Back" onPress={() => navigation.goBack()} />
```

- `goBack()` pops the current screen off the stack.
- Show that the button and the header's back arrow do the same job. You only need your own back button when the design calls for one.

**🇰🇷 한글 해설**

`navigation.goBack()` = pop. 헤더 화살표와 같은 일. 디자인상 필요할 때만 직접 버튼을 만들면 돼요.

#### 💻 Finished Code

- This is the completed example. Compare it against yours if something doesn't work and you can't find the typo.

```jsx
import { View, Text, Button, StyleSheet } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

const Stack = createNativeStackNavigator();

function HomeScreen({ navigation }) {
  return (
    <View style={styles.screen}>
      <Text>Home Screen</Text>
      <Button
        title="Go to Settings"
        onPress={() => navigation.navigate("Settings")}
      />
    </View>
  );
}

function SettingsScreen({ navigation }) {
  return (
    <View style={styles.screen}>
      <Text>Settings Screen</Text>
      <Button title="Go Back" onPress={() => navigation.goBack()} />
    </View>
  );
}

export default function MyApp() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Settings" component={SettingsScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});
```

▶ **[Snack에서 바로 실행하기](https://snack.expo.dev/?name=WEB530%20W4%20Example%3A%20Stack%20Navigator%20-%20Finished%20Code&platform=web&sdkVersion=54.0.0&code=import%20%7B%20View%2C%20Text%2C%20Button%2C%20StyleSheet%20%7D%20from%20%22react-native%22%3B%0Aimport%20%7B%20NavigationContainer%20%7D%20from%20%22%40react-navigation%2Fnative%22%3B%0Aimport%20%7B%20createNativeStackNavigator%20%7D%20from%20%22%40react-navigation%2Fnative-stack%22%3B%0A%0Aconst%20Stack%20%3D%20createNativeStackNavigator%28%29%3B%0A%0Afunction%20HomeScreen%28%7B%20navigation%20%7D%29%20%7B%0A%20%20return%20%28%0A%20%20%20%20%3CView%20style%3D%7Bstyles.screen%7D%3E%0A%20%20%20%20%20%20%3CText%3EHome%20Screen%3C%2FText%3E%0A%20%20%20%20%20%20%3CButton%0A%20%20%20%20%20%20%20%20title%3D%22Go%20to%20Settings%22%0A%20%20%20%20%20%20%20%20onPress%3D%7B%28%29%20%3D%3E%20navigation.navigate%28%22Settings%22%29%7D%0A%20%20%20%20%20%20%2F%3E%0A%20%20%20%20%3C%2FView%3E%0A%20%20%29%3B%0A%7D%0A%0Afunction%20SettingsScreen%28%7B%20navigation%20%7D%29%20%7B%0A%20%20return%20%28%0A%20%20%20%20%3CView%20style%3D%7Bstyles.screen%7D%3E%0A%20%20%20%20%20%20%3CText%3ESettings%20Screen%3C%2FText%3E%0A%20%20%20%20%20%20%3CButton%20title%3D%22Go%20Back%22%20onPress%3D%7B%28%29%20%3D%3E%20navigation.goBack%28%29%7D%20%2F%3E%0A%20%20%20%20%3C%2FView%3E%0A%20%20%29%3B%0A%7D%0A%0Aexport%20default%20function%20MyApp%28%29%20%7B%0A%20%20return%20%28%0A%20%20%20%20%3CNavigationContainer%3E%0A%20%20%20%20%20%20%3CStack.Navigator%20initialRouteName%3D%22Home%22%3E%0A%20%20%20%20%20%20%20%20%3CStack.Screen%20name%3D%22Home%22%20component%3D%7BHomeScreen%7D%20%2F%3E%0A%20%20%20%20%20%20%20%20%3CStack.Screen%20name%3D%22Settings%22%20component%3D%7BSettingsScreen%7D%20%2F%3E%0A%20%20%20%20%20%20%3C%2FStack.Navigator%3E%0A%20%20%20%20%3C%2FNavigationContainer%3E%0A%20%20%29%3B%0A%7D%0A%0Aconst%20styles%20%3D%20StyleSheet.create%28%7B%0A%20%20screen%3A%20%7B%0A%20%20%20%20flex%3A%201%2C%0A%20%20%20%20alignItems%3A%20%22center%22%2C%0A%20%20%20%20justifyContent%3A%20%22center%22%2C%0A%20%20%7D%2C%0A%7D%29%3B%0A&dependencies=%40react-navigation%2Fnative%40%5E7.0.0%2C%40react-navigation%2Fnative-stack%40%5E7.0.0%2Creact-native-safe-area-context%40~5.6.0%2Creact-native-screens%40~4.16.0)** (SDK 54, 필요한 패키지 자동 포함) <button class="snack-embed" type="button">👀 여기서 결과 보기</button>

**🇰🇷 한글 해설**

**완성 코드 해설**: import 2줄 → `Stack` 생성 → 화면 컴포넌트(각자 `{ navigation }` 받음) → `MyApp`에서 Container > Navigator > Screen 2개. 이 뼈대가 이번 주 모든 예제의 출발점이에요. 빈 Snack에서 **보지 않고** 이 코드를 써 볼 수 있으면 4주차 50%는 끝!

### 💻 Example: Navigate vs Push

- `navigate()` and `push()` look the same until you call them for a screen that is already open.
- Start from the finished Stack Navigator code. Every change in this example goes in `SettingsScreen`, plus one line in the styles.

**🇰🇷 한글 해설**

`navigate()`와 `push()`는 **이미 열린 화면**을 부를 때 차이가 나요.

#### 💻 Step 1 - Make Room for More Buttons

- Add `gap: 8` to `styles.screen` so the buttons don't touch.

```jsx
screen: {
  flex: 1,
  alignItems: "center",
  justifyContent: "center",
  gap: 8,
},
```

**🇰🇷 한글 해설**

`gap: 8`로 버튼 간격.

#### 💻 Step 2 - Navigate to the Screen You Are On

- Add this button to `SettingsScreen`, under the **Go Back** button.

```jsx
<Button
  title="Navigate to Settings"
  onPress={() => navigation.navigate("Settings")}
/>
```

- Run it, open Settings and press it. Nothing happens. You are already on Settings, so `navigate()` stays put.

**🇰🇷 한글 해설**

Settings에서 `navigate("Settings")` → **아무 일도 안 일어남**. 이미 거기 있으니까.

#### 💻 Step 3 - Push the Screen You Are On

- Add a second button under it. The only difference is `push` instead of `navigate`.

```jsx
<Button title="Push Settings" onPress={() => navigation.push("Settings")} />
```

- `push()` always adds another copy. Press it three times, then count the back presses to reach Home. It takes four, one per copy of Settings.
- Show the header after each press. Every copy has its own back arrow.

**🇰🇷 한글 해설**

`push("Settings")` → **항상 복사본 추가**. 3번 누르면 Home까지 뒤로 가기를 **4번** 눌러야 해요(Settings 4장).

#### 💻 Step 4 - Navigate to a Screen Below You

- Add a third button that navigates to Home.

```jsx
<Button
  title="Navigate to Home"
  onPress={() => navigation.navigate("Home")}
/>
```

- This is the trap. Home is below you in the stack, but `navigate()` does not go back to it. It pushes a second Home on top.
- Show that this Home has a back arrow in its header. The first Home never does.
- To go back to a screen, use `goBack()` or `popTo()` from the next example.
- `push()` suits drill-down flows, like opening a related product from a product page.

**🇰🇷 한글 해설**

**함정!** 아래에 있는 Home으로 `navigate("Home")` → 돌아가는 게 아니라 **Home 2호**가 쌓임. 증거: 이 Home에는 **뒤로 가기 화살표**가 있어요(원래 Home은 맨 아래라 화살표 없음). `push()`는 상품 → 관련 상품 → 관련 상품... 같은 **drill-down** 흐름에 적합.

#### 💻 Finished SettingsScreen

- Only `SettingsScreen` and the `gap` line changed. Compare against this if a button doesn't work.

```jsx
function SettingsScreen({ navigation }) {
  return (
    <View style={styles.screen}>
      <Text>Settings Screen</Text>
      <Button title="Go Back" onPress={() => navigation.goBack()} />
      <Button
        title="Navigate to Settings"
        onPress={() => navigation.navigate("Settings")}
      />
      <Button title="Push Settings" onPress={() => navigation.push("Settings")} />
      <Button
        title="Navigate to Home"
        onPress={() => navigation.navigate("Home")}
      />
    </View>
  );
}
```

**🇰🇷 한글 해설**

버튼 4개(Go Back, Navigate to Settings, Push Settings, Navigate to Home)를 비교하는 화면. 직접 눌러 보며 스택 깊이를 세어 보세요.

### 💻 Example: Going Back

- A stack has three ways to go back.
- Start from the finished Navigate vs Push code. Every change goes in `SettingsScreen` again.

**🇰🇷 한글 해설**

뒤로 가는 방법 3가지: `goBack()`, `popTo()`, `popToTop()`.

#### 💻 Step 1 - Go Back One Screen

- You already have this one. The **Go Back** button calls `goBack()`.
- Run it, open Settings, and press **Push Settings** three times. Now press **Go Back** once.
- `goBack()` pops one screen, like the back button in a browser. It does the same job as the arrow in the header.
- You can't tell the copies of Settings apart yet. Params, two examples from now, are how each screen gets its own data.

**🇰🇷 한글 해설**

`goBack()` = 한 장만 pop. 브라우저 뒤로 가기, 헤더 화살표와 같아요. 복사본끼리 구분이 안 되는 문제는 params로 해결(두 예제 뒤).

#### 💻 Step 2 - Fix the Navigate to Home Trap

- In the last example, **Navigate to Home** put a second Home on top. Change that button to use `popTo()`, and rename it.

```jsx
<Button title="Pop to Home" onPress={() => navigation.popTo("Home")} />
```

- Push a few copies of Settings, then press **Pop to Home**. One press takes you all the way back.
- Show that Home has no back arrow this time. It is the original Home, not a new copy.
- `popTo("Home")` pops screens until the named one is on top. Use it to jump several levels back to a specific screen.

**🇰🇷 한글 해설**

`navigation.popTo("Home")` → Home이 맨 위가 될 때까지 pop. 한 번에 원래 Home으로, **뒤로 가기 화살표 없음** = 진짜 원래 Home.

#### 💻 Step 3 - Pop to the Top

- Add one more button under **Pop to Home**.

```jsx
<Button title="Pop to Top" onPress={() => navigation.popToTop()} />
```

- `popToTop()` pops everything and returns to the first screen in the stack. Useful after logging out.
- Here it lands on Home, the same as **Pop to Home**, because Home is the first screen. `popTo()` is for a named screen anywhere in the stack, and `popToTop()` always goes to the first one.

**🇰🇷 한글 해설**

`popToTop()` → 스택의 **첫 화면**까지. 로그아웃 후에 유용. 여기선 Home이 첫 화면이라 popTo("Home")과 결과가 같지만, `popTo`는 **이름 지정**, `popToTop`은 **항상 첫 화면**.

#### 💻 Finished SettingsScreen

- Compare against this if a button doesn't work.

```jsx
function SettingsScreen({ navigation }) {
  return (
    <View style={styles.screen}>
      <Text>Settings Screen</Text>
      <Button title="Go Back" onPress={() => navigation.goBack()} />
      <Button
        title="Navigate to Settings"
        onPress={() => navigation.navigate("Settings")}
      />
      <Button title="Push Settings" onPress={() => navigation.push("Settings")} />
      <Button title="Pop to Home" onPress={() => navigation.popTo("Home")} />
      <Button title="Pop to Top" onPress={() => navigation.popToTop()} />
    </View>
  );
}
```

**🇰🇷 한글 해설**

버튼: Go Back / Navigate to Settings / Push Settings / Pop to Home / Pop to Top. 표로 정리한 5개 메서드를 한 화면에서 비교할 수 있어요.

### 💻 Example: The useNavigation Hook

- Only screens get the `navigation` prop.
- Show a reusable button that is not a screen. It gets the same object from the `useNavigation()` hook.
- Start from the finished Going Back code. This time the changes go in `HomeScreen`, a new component, and the imports.

**🇰🇷 한글 해설**

화면만 `navigation` prop을 받아요. 재사용 버튼(화면 아님)은 `useNavigation()` 훅으로 같은 객체를 얻어요.

#### 💻 Step 1 - Move the Button into Its Own Component

- Add a new component above `HomeScreen`, and move Home's **Go to Settings** button into it.

```jsx
// Not a screen, so it doesn't receive a navigation prop.
function SettingsButton() {
  return (
    <Button
      title="Go to Settings"
      onPress={() => navigation.navigate("Settings")}
    />
  );
}
```

- In `HomeScreen`, put the new component where the button was.

```jsx
<SettingsButton />
```

- Run it and press the button. It crashes with an error saying `navigation` is not defined.
- `SettingsButton` isn't registered as a `Stack.Screen`, so nothing gives it a `navigation` prop.

**🇰🇷 한글 해설**

버튼을 `SettingsButton` 컴포넌트로 분리 → 누르면 **`navigation` is not defined** 에러. 등록된 Screen이 아니라서 prop을 못 받으니까.

#### 💻 Step 2 - Import the Hook

- Add `useNavigation` to the existing `@react-navigation/native` import.

```jsx
import { NavigationContainer, useNavigation } from "@react-navigation/native";
```

**🇰🇷 한글 해설**

기존 `@react-navigation/native` import에 `useNavigation` 추가.

#### 💻 Step 3 - Call the Hook

- Add this as the first line inside `SettingsButton`.

```jsx
const navigation = useNavigation();
```

- Run it. The button works again.
- `useNavigation()` returns the same object a screen gets as its prop, from whichever screen the component is inside.
- Hooks can only be called inside components, so this is the same rule as `useState`.

**🇰🇷 한글 해설**

`const navigation = useNavigation();` 를 컴포넌트 첫 줄에. Hook은 **컴포넌트 안에서만** 호출 가능(useState와 같은 규칙).

#### 💻 Step 4 - Clean Up HomeScreen

- `HomeScreen` no longer uses `navigation`, so remove it from the parameters.

```jsx
function HomeScreen() {
```

- Without the hook, `HomeScreen` would have to pass `navigation` down as a prop, through every component in between.

**🇰🇷 한글 해설**

HomeScreen은 이제 navigation을 안 쓰니 파라미터에서 제거.

#### 💻 Finished Code

- Only the import, `SettingsButton` and `HomeScreen` changed. Compare against this if the button doesn't work.

```jsx
import { NavigationContainer, useNavigation } from "@react-navigation/native";
```

```jsx
// Not a screen, so it doesn't receive a navigation prop.
function SettingsButton() {
  const navigation = useNavigation();

  return (
    <Button
      title="Go to Settings"
      onPress={() => navigation.navigate("Settings")}
    />
  );
}

function HomeScreen() {
  return (
    <View style={styles.screen}>
      <Text>Home Screen</Text>
      <SettingsButton />
    </View>
  );
}
```

**🇰🇷 한글 해설**

**완성 코드 해설**: `SettingsButton`이 `useNavigation()`으로 스스로 이동. HomeScreen은 그냥 `<SettingsButton />`만 렌더링. props 전달 없음.

### 💻 Example: Passing Params

- Screens often need data from the screen before, like the item a user tapped.
- Pass an object as the second argument to `navigate()` or `push()`. The next screen reads it from `route.params`.
- Start from the finished useNavigation code. Each copy of Settings gets a `level` param, so you can finally tell the copies apart.

**🇰🇷 한글 해설**

params = 다음 화면에 넘기는 데이터. `navigate()`/`push()`의 **두 번째 인자** 객체 → 받는 쪽은 `route.params`. 이번엔 Settings 복사본마다 `level`을 줘서 구분해요.

#### 💻 Step 1 - Remove the Navigate to Settings Button

- Delete the **Navigate to Settings** button from `SettingsScreen`. It was only there for the Navigate vs Push example.

**🇰🇷 한글 해설**

이전 예제용 버튼 정리.

#### 💻 Step 2 - Send a Param

- In `SettingsButton`, add a second argument to `navigate()`.

```jsx
onPress={() => navigation.navigate("Settings", { level: 1 })}
```

- Params can be any JavaScript object: strings, numbers, arrays, other objects.

**🇰🇷 한글 해설**

`navigation.navigate("Settings", { level: 1 })`. params는 문자열, 숫자, 배열, 객체 무엇이든 가능.

#### 💻 Step 3 - Read the Param

- Every screen gets a `route` prop alongside `navigation`. Add it to `SettingsScreen`, and read `level` from `route.params`.

```jsx
function SettingsScreen({ navigation, route }) {
  const { level } = route.params;
```

- Change the text to show the level.

```jsx
<Text>Settings Level {level}</Text>
```

- Run it. Settings now says **Settings Level 1**.

**🇰🇷 한글 해설**

화면은 `navigation` 옆에 **`route`** prop도 받아요. `function SettingsScreen({ navigation, route })` → `route.params.level`.

#### 💻 Step 4 - Push the Next Level

- Give **Push Settings** a param too, one higher than the current level.

```jsx
<Button
  title="Push Settings"
  onPress={() => navigation.push("Settings", { level: level + 1 })}
/>
```

- Push a few times, then press **Go Back**. The levels count down, one copy at a time. These are the copies the Going Back example couldn't tell apart.

**🇰🇷 한글 해설**

`push("Settings", { level: level + 1 })`. 몇 번 push 후 Go Back 하면 숫자가 하나씩 줄어요.

#### 💻 Step 5 - Show the Crash, Then Fix It

- Always treat params as optional. A screen opened without them (as the first screen, or from a deep link) gets `undefined`, and destructuring `undefined` crashes the app.
- Show the crash. In `MyApp`, change `initialRouteName` to `"Settings"`.

```jsx
<Stack.Navigator initialRouteName="Settings">
```

- Run it. The app crashes, because nothing passed params to the first screen.
- Fix the line in `SettingsScreen`.

```jsx
const { level = 1 } = route.params ?? {};
```

- `route.params ?? {}` falls back to an empty object, and `level = 1` gives a default.
- Run it. Settings opens as **Settings Level 1**. Change `initialRouteName` back to `"Home"`.

**🇰🇷 한글 해설**

`initialRouteName="Settings"`로 바꾸면 params 없이 열려서 **크래시**(undefined를 구조 분해). 고치기: `const { level = 1 } = route.params ?? {};`

#### 💻 Step 6 - Update the Current Screen's Params

- Add a button under **Push Settings** that resets the level without navigating.

```jsx
<Button
  title="Reset to Level 1"
  onPress={() => navigation.setParams({ level: 1 })}
/>
```

- Push to level 3 or 4, then press **Reset to Level 1**. The text changes, but you are still on the same screen. **Go Back** still goes back the same number of times.
- `setParams()` updates the current screen's params, and the screen re-renders. It merges, so params you don't mention keep their values.

**🇰🇷 한글 해설**

`navigation.setParams({ level: 1 })` → 이동 없이 **현재 화면** params만 변경 + 다시 렌더링. merge 방식. 뒤로 가기 횟수는 그대로(스택 안 바뀜).

#### 💻 Finished Code

- Only `SettingsButton` and `SettingsScreen` changed, and `initialRouteName` should be back to `"Home"`. Compare against this if something doesn't work.

```jsx
// Not a screen, so it doesn't receive a navigation prop.
function SettingsButton() {
  const navigation = useNavigation();

  return (
    <Button
      title="Go to Settings"
      onPress={() => navigation.navigate("Settings", { level: 1 })}
    />
  );
}
```

```jsx
function SettingsScreen({ navigation, route }) {
  const { level = 1 } = route.params ?? {};

  return (
    <View style={styles.screen}>
      <Text>Settings Level {level}</Text>
      <Button title="Go Back" onPress={() => navigation.goBack()} />
      <Button
        title="Push Settings"
        onPress={() => navigation.push("Settings", { level: level + 1 })}
      />
      <Button
        title="Reset to Level 1"
        onPress={() => navigation.setParams({ level: 1 })}
      />
      <Button title="Pop to Home" onPress={() => navigation.popTo("Home")} />
      <Button title="Pop to Top" onPress={() => navigation.popToTop()} />
    </View>
  );
}
```

**🇰🇷 한글 해설**

**완성 코드 해설**: SettingsButton이 `{ level: 1 }` 전달 → SettingsScreen이 안전하게 읽고(`?? {}` + 기본값), Push로 level+1, Reset으로 setParams. **params 3종 세트**(보내기, 안전하게 받기, 현재 화면 수정)가 다 들어 있어요.

### 💻 Example: Customizing the Header

- Each screen can set header options.
- `options` can be an object, or a function that receives the `route`. Use the function to read params.
- Start from the finished Passing Params code. Every change goes in `MyApp`, on the navigator and its screens.

**🇰🇷 한글 해설**

`options`는 **객체**도 되고 **route를 받는 함수**도 돼요. params를 읽으려면 함수.

#### 💻 Step 1 - Style Every Header

- Add `screenOptions` to `Stack.Navigator`.

```jsx
<Stack.Navigator
  initialRouteName="Home"
  screenOptions={{
    headerStyle: { backgroundColor: "#4f46e5" },
    headerTintColor: "#fff",
  }}
>
```

- Run it. Both headers turn purple with white text.
- `screenOptions` on the `Navigator` applies to every screen in it.
- `headerTintColor` colours the title and the back arrow.

**🇰🇷 한글 해설**

`<Stack.Navigator screenOptions={{ ... }}>` → **모든 화면**에 적용. `headerStyle: { backgroundColor }` 헤더 배경, `headerTintColor` 제목과 **뒤로 가기 화살표** 색.

#### 💻 Step 2 - Give Home a Title

- Add `options` to the Home screen.

```jsx
<Stack.Screen
  name="Home"
  component={HomeScreen}
  options={{ title: "My App" }}
/>
```

- `title` replaces the route name in the header.
- `options` on one `Stack.Screen` applies to just that screen, and overrides `screenOptions`.

**🇰🇷 한글 해설**

`<Stack.Screen options={{ title: "..." }}>` → 그 **화면 하나**만. `screenOptions`보다 **우선**.

#### 💻 Step 3 - Put the Level in the Header

- Settings needs a title that changes with its params, so its `options` is a function that receives the `route`.

```jsx
<Stack.Screen
  name="Settings"
  component={SettingsScreen}
  options={({ route }) => ({
    title: `Level ${route.params?.level ?? 1}`,
  })}
/>
```

- Run it and push a few levels. Each header shows its own level.
- Press **Reset to Level 1**. The header updates too, because `setParams()` re-runs the `options` function.
- `route.params?.level ?? 1` is the same rule as Step 5 of the last example: params might be missing, so give a default.

**🇰🇷 한글 해설**

`options={({ route }) => ({ title: `Settings Level ${route.params?.level ?? 1}` })}` 처럼 함수로. setParams를 하면 options 함수가 **다시 실행**돼서 헤더도 바뀌어요.

#### 💻 Step 4 - Add a Header Button

- The `options` function also receives `navigation`. Add `headerRight` to put a **Reset** button in the header, greyed out when you are already on level 1.

```jsx
options={({ navigation, route }) => ({
  title: `Level ${route.params?.level ?? 1}`,
  headerRight: () => (
    <Button
      title="Reset"
      onPress={() => navigation.setParams({ level: 1 })}
      disabled={(route.params?.level ?? 1) === 1}
    />
  ),
})}
```

- Push to level 3, then press **Reset** in the header. It does the same job as the **Reset to Level 1** button on the screen, then greys itself out.
- `headerRight` puts any component on the right side of the header. `headerLeft` does the same on the left, but replaces the back arrow.
- `headerShown: false` hides the header completely. It comes back in the nesting example.

**🇰🇷 한글 해설**

options 함수는 `navigation`도 받아요: `({ navigation, route }) => ({ headerRight: () => <Button ... /> })`.
- `headerRight`: 헤더 오른쪽에 아무 컴포넌트.
- `headerLeft`: 왼쪽. 단 **뒤로 가기 화살표를 대체**해요.
- `headerShown: false`: 헤더 완전히 숨김(중첩 예제에서 다시 나옴).

#### 💻 Finished Code

- Only `MyApp` changed. Compare against this if the header doesn't look right.

```jsx
export default function MyApp() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Home"
        screenOptions={{
          headerStyle: { backgroundColor: "#4f46e5" },
          headerTintColor: "#fff",
        }}
      >
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{ title: "My App" }}
        />
        <Stack.Screen
          name="Settings"
          component={SettingsScreen}
          options={({ navigation, route }) => ({
            title: `Level ${route.params?.level ?? 1}`,
            headerRight: () => (
              <Button
                title="Reset"
                onPress={() => navigation.setParams({ level: 1 })}
                disabled={(route.params?.level ?? 1) === 1}
              />
            ),
          })}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
```

▶ 웹 React 코드예요. [교수님 CodeSandbox 템플릿](https://codesandbox.io/p/sandbox/react-basic-3rqll4)에 붙여넣어 실행하세요.

**🇰🇷 한글 해설**

**완성 코드 해설**: 변경은 `MyApp`만. Navigator의 `screenOptions`(전체 보라색 헤더) + Home의 `options` 객체(title) + Settings의 `options` 함수(level 제목 + headerRight Reset 버튼, level 1이면 disabled).

### 💻 Example: Tab Navigator

- Tabs are for the top-level sections of an app. The tab bar is always visible.
- Same `Navigator` and `Screen` pattern as the stack, with a different creation function.

**🇰🇷 한글 해설**

탭 = 앱의 최상위 섹션, 탭 바는 **항상 보임**. 스택과 같은 Navigator/Screen 패턴, 생성 함수만 다름.

#### 💻 Starter Code

- This is a new app, so replace everything in `App.js`. The three screens and styles are done. Nothing is connected yet.
- It runs as is: `MyApp` shows `HomeScreen` directly. The counter on Home is there to show what happens to state when you switch tabs.

```jsx
import { useState } from "react";
import { View, Text, Button, StyleSheet } from "react-native";

function HomeScreen() {
  const [count, setCount] = useState(0);

  return (
    <View style={styles.screen}>
      <Text>Home Screen</Text>
      <Text>Count: {count}</Text>
      <Button title="Add One" onPress={() => setCount((prev) => prev + 1)} />
    </View>
  );
}

function ProfileScreen() {
  return (
    <View style={styles.screen}>
      <Text>Profile Screen</Text>
    </View>
  );
}

function SettingsScreen() {
  return (
    <View style={styles.screen}>
      <Text>Settings Screen</Text>
    </View>
  );
}

export default function MyApp() {
  return <HomeScreen />;
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
});
```

▶ **[Snack에서 바로 실행하기](https://snack.expo.dev/?name=WEB530%20W4%20Example%3A%20Tab%20Navigator%20-%20Starter%20Code&platform=web&sdkVersion=54.0.0&code=import%20%7B%20useState%20%7D%20from%20%22react%22%3B%0Aimport%20%7B%20View%2C%20Text%2C%20Button%2C%20StyleSheet%20%7D%20from%20%22react-native%22%3B%0A%0Afunction%20HomeScreen%28%29%20%7B%0A%20%20const%20%5Bcount%2C%20setCount%5D%20%3D%20useState%280%29%3B%0A%0A%20%20return%20%28%0A%20%20%20%20%3CView%20style%3D%7Bstyles.screen%7D%3E%0A%20%20%20%20%20%20%3CText%3EHome%20Screen%3C%2FText%3E%0A%20%20%20%20%20%20%3CText%3ECount%3A%20%7Bcount%7D%3C%2FText%3E%0A%20%20%20%20%20%20%3CButton%20title%3D%22Add%20One%22%20onPress%3D%7B%28%29%20%3D%3E%20setCount%28%28prev%29%20%3D%3E%20prev%20%2B%201%29%7D%20%2F%3E%0A%20%20%20%20%3C%2FView%3E%0A%20%20%29%3B%0A%7D%0A%0Afunction%20ProfileScreen%28%29%20%7B%0A%20%20return%20%28%0A%20%20%20%20%3CView%20style%3D%7Bstyles.screen%7D%3E%0A%20%20%20%20%20%20%3CText%3EProfile%20Screen%3C%2FText%3E%0A%20%20%20%20%3C%2FView%3E%0A%20%20%29%3B%0A%7D%0A%0Afunction%20SettingsScreen%28%29%20%7B%0A%20%20return%20%28%0A%20%20%20%20%3CView%20style%3D%7Bstyles.screen%7D%3E%0A%20%20%20%20%20%20%3CText%3ESettings%20Screen%3C%2FText%3E%0A%20%20%20%20%3C%2FView%3E%0A%20%20%29%3B%0A%7D%0A%0Aexport%20default%20function%20MyApp%28%29%20%7B%0A%20%20return%20%3CHomeScreen%20%2F%3E%3B%0A%7D%0A%0Aconst%20styles%20%3D%20StyleSheet.create%28%7B%0A%20%20screen%3A%20%7B%0A%20%20%20%20flex%3A%201%2C%0A%20%20%20%20alignItems%3A%20%22center%22%2C%0A%20%20%20%20justifyContent%3A%20%22center%22%2C%0A%20%20%20%20gap%3A%208%2C%0A%20%20%7D%2C%0A%7D%29%3B%0A)** (SDK 54, 필요한 패키지 자동 포함) <button class="snack-embed" type="button">👀 여기서 결과 보기</button>

**🇰🇷 한글 해설**

새 앱. Home에 카운터가 있는 이유는 탭을 바꿔도 state가 유지되는지 보려고.

#### 💻 Step 1 - Import the Navigation Pieces

- Add two imports under the `react-native` import.

```jsx
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
```

- `NavigationContainer` is the same as before. Every navigator needs it.
- `createBottomTabNavigator` comes from its own package, `@react-navigation/bottom-tabs`.

**🇰🇷 한글 해설**

`createBottomTabNavigator`는 `@react-navigation/bottom-tabs` 패키지.

#### 💻 Step 2 - Create the Tabs

- Add this line under the imports, outside every component.

```jsx
const Tab = createBottomTabNavigator();
```

- It returns the same shape as the stack: a `Tab.Navigator` and a `Tab.Screen`.

**🇰🇷 한글 해설**

`const Tab = createBottomTabNavigator();` → `Tab.Navigator`, `Tab.Screen`.

#### 💻 Step 3 - Register the Screens

- Replace the `return` in `MyApp` with the container, the navigator, and one `Tab.Screen` per screen.

```jsx
export default function MyApp() {
  return (
    <NavigationContainer>
      <Tab.Navigator>
        <Tab.Screen name="Home" component={HomeScreen} />
        <Tab.Screen name="Profile" component={ProfileScreen} />
        <Tab.Screen name="Settings" component={SettingsScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
```

▶ 웹 React 코드예요. [교수님 CodeSandbox 템플릿](https://codesandbox.io/p/sandbox/react-basic-3rqll4)에 붙여넣어 실행하세요.

- Run it. A tab bar appears at the bottom with one tab per screen, in the order you listed them.
- Show that no screen has a back arrow. Tabs switch between sections side by side, they don't stack.
- Each tab shows a placeholder symbol for now. Icons come in Step 5.

**🇰🇷 한글 해설**

적은 순서대로 아래 탭이 생겨요. 탭에는 **뒤로 가기 화살표가 없어요**(쌓는 게 아니라 옆으로 전환).

#### 💻 Step 4 - Show That Tabs Keep Their State

- No code in this step. Press **Add One** a few times on Home, switch to Profile, then switch back.
- The count is still there. Tabs stay mounted when you switch away, so each tab keeps its state.
- Compare that to the stack: a screen you pop with `goBack()` is unmounted, and its state is gone.

**🇰🇷 한글 해설**

**중요 개념**: 탭은 다른 탭으로 가도 **mounted 상태 유지** → 카운트가 남아 있어요. 반면 스택에서 `goBack()`으로 pop된 화면은 **unmount** → state 사라짐. (시험 비교 문제 후보)

#### 💻 Step 5 - Add Icons

- Import an icon set under the other imports.

```jsx
import { Ionicons } from "@expo/vector-icons";
```

- Give the Home tab an `options` prop with a `tabBarIcon`.

```jsx
<Tab.Screen
  name="Home"
  component={HomeScreen}
  options={{
    tabBarIcon: ({ color, size }) => (
      <Ionicons name="home" color={color} size={size} />
    ),
  }}
/>
```

- Run it. Home has an icon, and the other two still show the placeholder.
- `tabBarIcon` is a function that receives the `color` and `size` the tab bar wants, so the icon changes colour when its tab is selected.
- Do the same for the other two tabs, with `name="person"` for Profile and `name="settings"` for Settings.
- Icons come from `@expo/vector-icons`, which is part of every Expo project. Search them at (https://icons.expo.fyi/).

**🇰🇷 한글 해설**

`import { Ionicons } from "@expo/vector-icons";` → `options={{ tabBarIcon: ({ color, size }) => <Ionicons name="home" color={color} size={size} /> }}`. tabBarIcon은 탭 바가 주는 color, size를 받는 **함수**라서 선택되면 색이 바뀌어요.

#### 💻 Step 6 - Colour the Selected Tab

- Add `screenOptions` to `Tab.Navigator`, the same prop the stack used for its headers.

```jsx
<Tab.Navigator screenOptions={{ tabBarActiveTintColor: "#4f46e5" }}>
```

- Run it. The selected tab's icon and label turn purple. That colour is what `tabBarIcon` receives as `color`.

**🇰🇷 한글 해설**

`<Tab.Navigator screenOptions={{ tabBarActiveTintColor: "purple" }}>` → 선택된 탭 아이콘과 글자 색. 이 색이 tabBarIcon의 `color`로 들어가요.

#### 💻 Finished Code

- This is the completed example. Compare it against yours if something doesn't work and you can't find the typo.

```jsx
import { useState } from "react";
import { View, Text, Button, StyleSheet } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";

const Tab = createBottomTabNavigator();

function HomeScreen() {
  const [count, setCount] = useState(0);

  return (
    <View style={styles.screen}>
      <Text>Home Screen</Text>
      <Text>Count: {count}</Text>
      <Button title="Add One" onPress={() => setCount((prev) => prev + 1)} />
    </View>
  );
}

function ProfileScreen() {
  return (
    <View style={styles.screen}>
      <Text>Profile Screen</Text>
    </View>
  );
}

function SettingsScreen() {
  return (
    <View style={styles.screen}>
      <Text>Settings Screen</Text>
    </View>
  );
}

export default function MyApp() {
  return (
    <NavigationContainer>
      <Tab.Navigator screenOptions={{ tabBarActiveTintColor: "#4f46e5" }}>
        <Tab.Screen
          name="Home"
          component={HomeScreen}
          options={{
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="home" color={color} size={size} />
            ),
          }}
        />
        <Tab.Screen
          name="Profile"
          component={ProfileScreen}
          options={{
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="person" color={color} size={size} />
            ),
          }}
        />
        <Tab.Screen
          name="Settings"
          component={SettingsScreen}
          options={{
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="settings" color={color} size={size} />
            ),
          }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
});
```

▶ **[Snack에서 바로 실행하기](https://snack.expo.dev/?name=WEB530%20W4%20Example%3A%20Tab%20Navigator%20-%20Finished%20Code&platform=web&sdkVersion=54.0.0&code=import%20%7B%20useState%20%7D%20from%20%22react%22%3B%0Aimport%20%7B%20View%2C%20Text%2C%20Button%2C%20StyleSheet%20%7D%20from%20%22react-native%22%3B%0Aimport%20%7B%20NavigationContainer%20%7D%20from%20%22%40react-navigation%2Fnative%22%3B%0Aimport%20%7B%20createBottomTabNavigator%20%7D%20from%20%22%40react-navigation%2Fbottom-tabs%22%3B%0Aimport%20%7B%20Ionicons%20%7D%20from%20%22%40expo%2Fvector-icons%22%3B%0A%0Aconst%20Tab%20%3D%20createBottomTabNavigator%28%29%3B%0A%0Afunction%20HomeScreen%28%29%20%7B%0A%20%20const%20%5Bcount%2C%20setCount%5D%20%3D%20useState%280%29%3B%0A%0A%20%20return%20%28%0A%20%20%20%20%3CView%20style%3D%7Bstyles.screen%7D%3E%0A%20%20%20%20%20%20%3CText%3EHome%20Screen%3C%2FText%3E%0A%20%20%20%20%20%20%3CText%3ECount%3A%20%7Bcount%7D%3C%2FText%3E%0A%20%20%20%20%20%20%3CButton%20title%3D%22Add%20One%22%20onPress%3D%7B%28%29%20%3D%3E%20setCount%28%28prev%29%20%3D%3E%20prev%20%2B%201%29%7D%20%2F%3E%0A%20%20%20%20%3C%2FView%3E%0A%20%20%29%3B%0A%7D%0A%0Afunction%20ProfileScreen%28%29%20%7B%0A%20%20return%20%28%0A%20%20%20%20%3CView%20style%3D%7Bstyles.screen%7D%3E%0A%20%20%20%20%20%20%3CText%3EProfile%20Screen%3C%2FText%3E%0A%20%20%20%20%3C%2FView%3E%0A%20%20%29%3B%0A%7D%0A%0Afunction%20SettingsScreen%28%29%20%7B%0A%20%20return%20%28%0A%20%20%20%20%3CView%20style%3D%7Bstyles.screen%7D%3E%0A%20%20%20%20%20%20%3CText%3ESettings%20Screen%3C%2FText%3E%0A%20%20%20%20%3C%2FView%3E%0A%20%20%29%3B%0A%7D%0A%0Aexport%20default%20function%20MyApp%28%29%20%7B%0A%20%20return%20%28%0A%20%20%20%20%3CNavigationContainer%3E%0A%20%20%20%20%20%20%3CTab.Navigator%20screenOptions%3D%7B%7B%20tabBarActiveTintColor%3A%20%22%234f46e5%22%20%7D%7D%3E%0A%20%20%20%20%20%20%20%20%3CTab.Screen%0A%20%20%20%20%20%20%20%20%20%20name%3D%22Home%22%0A%20%20%20%20%20%20%20%20%20%20component%3D%7BHomeScreen%7D%0A%20%20%20%20%20%20%20%20%20%20options%3D%7B%7B%0A%20%20%20%20%20%20%20%20%20%20%20%20tabBarIcon%3A%20%28%7B%20color%2C%20size%20%7D%29%20%3D%3E%20%28%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3CIonicons%20name%3D%22home%22%20color%3D%7Bcolor%7D%20size%3D%7Bsize%7D%20%2F%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%29%2C%0A%20%20%20%20%20%20%20%20%20%20%7D%7D%0A%20%20%20%20%20%20%20%20%2F%3E%0A%20%20%20%20%20%20%20%20%3CTab.Screen%0A%20%20%20%20%20%20%20%20%20%20name%3D%22Profile%22%0A%20%20%20%20%20%20%20%20%20%20component%3D%7BProfileScreen%7D%0A%20%20%20%20%20%20%20%20%20%20options%3D%7B%7B%0A%20%20%20%20%20%20%20%20%20%20%20%20tabBarIcon%3A%20%28%7B%20color%2C%20size%20%7D%29%20%3D%3E%20%28%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3CIonicons%20name%3D%22person%22%20color%3D%7Bcolor%7D%20size%3D%7Bsize%7D%20%2F%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%29%2C%0A%20%20%20%20%20%20%20%20%20%20%7D%7D%0A%20%20%20%20%20%20%20%20%2F%3E%0A%20%20%20%20%20%20%20%20%3CTab.Screen%0A%20%20%20%20%20%20%20%20%20%20name%3D%22Settings%22%0A%20%20%20%20%20%20%20%20%20%20component%3D%7BSettingsScreen%7D%0A%20%20%20%20%20%20%20%20%20%20options%3D%7B%7B%0A%20%20%20%20%20%20%20%20%20%20%20%20tabBarIcon%3A%20%28%7B%20color%2C%20size%20%7D%29%20%3D%3E%20%28%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3CIonicons%20name%3D%22settings%22%20color%3D%7Bcolor%7D%20size%3D%7Bsize%7D%20%2F%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%29%2C%0A%20%20%20%20%20%20%20%20%20%20%7D%7D%0A%20%20%20%20%20%20%20%20%2F%3E%0A%20%20%20%20%20%20%3C%2FTab.Navigator%3E%0A%20%20%20%20%3C%2FNavigationContainer%3E%0A%20%20%29%3B%0A%7D%0A%0Aconst%20styles%20%3D%20StyleSheet.create%28%7B%0A%20%20screen%3A%20%7B%0A%20%20%20%20flex%3A%201%2C%0A%20%20%20%20alignItems%3A%20%22center%22%2C%0A%20%20%20%20justifyContent%3A%20%22center%22%2C%0A%20%20%20%20gap%3A%208%2C%0A%20%20%7D%2C%0A%7D%29%3B%0A&dependencies=%40expo%2Fvector-icons%40%5E15.0.3%2C%40react-navigation%2Fbottom-tabs%40%5E7.0.0%2C%40react-navigation%2Fnative%40%5E7.0.0%2Creact-native-safe-area-context%40~5.6.0%2Creact-native-screens%40~4.16.0)** (SDK 54, 필요한 패키지 자동 포함) <button class="snack-embed" type="button">👀 여기서 결과 보기</button>

**🇰🇷 한글 해설**

**완성 코드 해설**: Tab 생성 → `screenOptions`로 활성 색 → 탭 3개, 각자 `tabBarIcon`. Home 카운터로 탭 state 유지 확인.

### 💻 Example: Drawer Navigator

- A drawer slides in from the side. Good for settings or secondary sections that don't need a permanent tab.

```jsx
import { View, Text, StyleSheet } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createDrawerNavigator } from "@react-navigation/drawer";

const Drawer = createDrawerNavigator();

function HomeScreen() {
  return (
    <View style={styles.screen}>
      <Text>Home Screen</Text>
    </View>
  );
}

function SettingsScreen() {
  return (
    <View style={styles.screen}>
      <Text>Settings Screen</Text>
    </View>
  );
}

export default function MyApp() {
  return (
    <NavigationContainer>
      <Drawer.Navigator>
        <Drawer.Screen name="Home" component={HomeScreen} />
        <Drawer.Screen name="Settings" component={SettingsScreen} />
      </Drawer.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});
```

▶ **[Snack에서 바로 실행하기](https://snack.expo.dev/?name=WEB530%20W4%20Example%3A%20Drawer%20Navigator&platform=web&sdkVersion=54.0.0&code=import%20%7B%20View%2C%20Text%2C%20StyleSheet%20%7D%20from%20%22react-native%22%3B%0Aimport%20%7B%20NavigationContainer%20%7D%20from%20%22%40react-navigation%2Fnative%22%3B%0Aimport%20%7B%20createDrawerNavigator%20%7D%20from%20%22%40react-navigation%2Fdrawer%22%3B%0A%0Aconst%20Drawer%20%3D%20createDrawerNavigator%28%29%3B%0A%0Afunction%20HomeScreen%28%29%20%7B%0A%20%20return%20%28%0A%20%20%20%20%3CView%20style%3D%7Bstyles.screen%7D%3E%0A%20%20%20%20%20%20%3CText%3EHome%20Screen%3C%2FText%3E%0A%20%20%20%20%3C%2FView%3E%0A%20%20%29%3B%0A%7D%0A%0Afunction%20SettingsScreen%28%29%20%7B%0A%20%20return%20%28%0A%20%20%20%20%3CView%20style%3D%7Bstyles.screen%7D%3E%0A%20%20%20%20%20%20%3CText%3ESettings%20Screen%3C%2FText%3E%0A%20%20%20%20%3C%2FView%3E%0A%20%20%29%3B%0A%7D%0A%0Aexport%20default%20function%20MyApp%28%29%20%7B%0A%20%20return%20%28%0A%20%20%20%20%3CNavigationContainer%3E%0A%20%20%20%20%20%20%3CDrawer.Navigator%3E%0A%20%20%20%20%20%20%20%20%3CDrawer.Screen%20name%3D%22Home%22%20component%3D%7BHomeScreen%7D%20%2F%3E%0A%20%20%20%20%20%20%20%20%3CDrawer.Screen%20name%3D%22Settings%22%20component%3D%7BSettingsScreen%7D%20%2F%3E%0A%20%20%20%20%20%20%3C%2FDrawer.Navigator%3E%0A%20%20%20%20%3C%2FNavigationContainer%3E%0A%20%20%29%3B%0A%7D%0A%0Aconst%20styles%20%3D%20StyleSheet.create%28%7B%0A%20%20screen%3A%20%7B%0A%20%20%20%20flex%3A%201%2C%0A%20%20%20%20alignItems%3A%20%22center%22%2C%0A%20%20%20%20justifyContent%3A%20%22center%22%2C%0A%20%20%7D%2C%0A%7D%29%3B%0A&dependencies=%40react-navigation%2Fdrawer%40%5E7.0.0%2C%40react-navigation%2Fnative%40%5E7.0.0%2Creact-native-gesture-handler%40~2.28.0%2Creact-native-reanimated%40~4.1.1%2Creact-native-safe-area-context%40~5.6.0%2Creact-native-screens%40~4.16.0%2Creact-native-worklets%400.5.1)** (SDK 54, 필요한 패키지 자동 포함) <button class="snack-embed" type="button">👀 여기서 결과 보기</button>

- The hamburger icon appears in the header on its own. Every screen becomes a menu item.
- Compare the three navigators:
  - Each has its own creation function: `createNativeStackNavigator()`, `createBottomTabNavigator()`, `createDrawerNavigator()`.
  - All use the same `<X.Navigator>` and `<X.Screen>` JSX.
  - Screens get the same `navigation` and `route` props in all three.
  - They differ in how they look and behave, not in how you write screens.

**🇰🇷 한글 해설**

드로어 = 옆에서 미끄러져 나오는 메뉴. 상시 탭이 필요 없는 설정, 보조 섹션에 좋아요. 헤더에 **햄버거 아이콘이 자동**으로 생기고, 모든 Screen이 메뉴 항목이 돼요. 세 내비게이터 비교 4줄은 코스노트 결론과 같아요(생성 함수만 다르고 JSX와 props는 같음). Drawer는 gesture-handler, reanimated 패키지도 필요해서 Snack 링크에 자동 포함했어요.

### 💻 Example: Choosing a Navigator per Platform

- `Platform.select()` from week 3 returns the value for the current platform. It can return a whole navigator.
- The point to make: the same two screens end up in three different navigators. Only the `Platform.select()` block decides which.
- Replace everything in `App.js` with this. There's nothing to build, just run it on each platform.

```jsx
import { View, Text, Platform, StyleSheet } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createDrawerNavigator } from "@react-navigation/drawer";

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();
const Drawer = createDrawerNavigator();

function HomeScreen() {
  return (
    <View style={styles.screen}>
      <Text>Home Content</Text>
    </View>
  );
}

function SettingsScreen() {
  return (
    <View style={styles.screen}>
      <Text>Settings Content</Text>
    </View>
  );
}

// Choose a navigator based on the platform.
const Navigator = Platform.select({
  ios: () => (
    <Tab.Navigator>
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Settings" component={SettingsScreen} />
    </Tab.Navigator>
  ),
  android: () => (
    <Drawer.Navigator>
      <Drawer.Screen name="Home" component={HomeScreen} />
      <Drawer.Screen name="Settings" component={SettingsScreen} />
    </Drawer.Navigator>
  ),
  default: () => (
    <Stack.Navigator>
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="Settings" component={SettingsScreen} />
    </Stack.Navigator>
  ),
});

export default function MyApp() {
  return <NavigationContainer>{Navigator()}</NavigationContainer>;
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});
```

▶ **[Snack에서 바로 실행하기](https://snack.expo.dev/?name=WEB530%20W4%20Example%3A%20Choosing%20a%20Navigator%20per%20Platform&platform=web&sdkVersion=54.0.0&code=import%20%7B%20View%2C%20Text%2C%20Platform%2C%20StyleSheet%20%7D%20from%20%22react-native%22%3B%0Aimport%20%7B%20NavigationContainer%20%7D%20from%20%22%40react-navigation%2Fnative%22%3B%0Aimport%20%7B%20createNativeStackNavigator%20%7D%20from%20%22%40react-navigation%2Fnative-stack%22%3B%0Aimport%20%7B%20createBottomTabNavigator%20%7D%20from%20%22%40react-navigation%2Fbottom-tabs%22%3B%0Aimport%20%7B%20createDrawerNavigator%20%7D%20from%20%22%40react-navigation%2Fdrawer%22%3B%0A%0Aconst%20Stack%20%3D%20createNativeStackNavigator%28%29%3B%0Aconst%20Tab%20%3D%20createBottomTabNavigator%28%29%3B%0Aconst%20Drawer%20%3D%20createDrawerNavigator%28%29%3B%0A%0Afunction%20HomeScreen%28%29%20%7B%0A%20%20return%20%28%0A%20%20%20%20%3CView%20style%3D%7Bstyles.screen%7D%3E%0A%20%20%20%20%20%20%3CText%3EHome%20Content%3C%2FText%3E%0A%20%20%20%20%3C%2FView%3E%0A%20%20%29%3B%0A%7D%0A%0Afunction%20SettingsScreen%28%29%20%7B%0A%20%20return%20%28%0A%20%20%20%20%3CView%20style%3D%7Bstyles.screen%7D%3E%0A%20%20%20%20%20%20%3CText%3ESettings%20Content%3C%2FText%3E%0A%20%20%20%20%3C%2FView%3E%0A%20%20%29%3B%0A%7D%0A%0A%2F%2F%20Choose%20a%20navigator%20based%20on%20the%20platform.%0Aconst%20Navigator%20%3D%20Platform.select%28%7B%0A%20%20ios%3A%20%28%29%20%3D%3E%20%28%0A%20%20%20%20%3CTab.Navigator%3E%0A%20%20%20%20%20%20%3CTab.Screen%20name%3D%22Home%22%20component%3D%7BHomeScreen%7D%20%2F%3E%0A%20%20%20%20%20%20%3CTab.Screen%20name%3D%22Settings%22%20component%3D%7BSettingsScreen%7D%20%2F%3E%0A%20%20%20%20%3C%2FTab.Navigator%3E%0A%20%20%29%2C%0A%20%20android%3A%20%28%29%20%3D%3E%20%28%0A%20%20%20%20%3CDrawer.Navigator%3E%0A%20%20%20%20%20%20%3CDrawer.Screen%20name%3D%22Home%22%20component%3D%7BHomeScreen%7D%20%2F%3E%0A%20%20%20%20%20%20%3CDrawer.Screen%20name%3D%22Settings%22%20component%3D%7BSettingsScreen%7D%20%2F%3E%0A%20%20%20%20%3C%2FDrawer.Navigator%3E%0A%20%20%29%2C%0A%20%20default%3A%20%28%29%20%3D%3E%20%28%0A%20%20%20%20%3CStack.Navigator%3E%0A%20%20%20%20%20%20%3CStack.Screen%20name%3D%22Home%22%20component%3D%7BHomeScreen%7D%20%2F%3E%0A%20%20%20%20%20%20%3CStack.Screen%20name%3D%22Settings%22%20component%3D%7BSettingsScreen%7D%20%2F%3E%0A%20%20%20%20%3C%2FStack.Navigator%3E%0A%20%20%29%2C%0A%7D%29%3B%0A%0Aexport%20default%20function%20MyApp%28%29%20%7B%0A%20%20return%20%3CNavigationContainer%3E%7BNavigator%28%29%7D%3C%2FNavigationContainer%3E%3B%0A%7D%0A%0Aconst%20styles%20%3D%20StyleSheet.create%28%7B%0A%20%20screen%3A%20%7B%0A%20%20%20%20flex%3A%201%2C%0A%20%20%20%20alignItems%3A%20%22center%22%2C%0A%20%20%20%20justifyContent%3A%20%22center%22%2C%0A%20%20%7D%2C%0A%7D%29%3B%0A&dependencies=%40react-navigation%2Fbottom-tabs%40%5E7.0.0%2C%40react-navigation%2Fdrawer%40%5E7.0.0%2C%40react-navigation%2Fnative%40%5E7.0.0%2C%40react-navigation%2Fnative-stack%40%5E7.0.0%2Creact-native-gesture-handler%40~2.28.0%2Creact-native-reanimated%40~4.1.1%2Creact-native-safe-area-context%40~5.6.0%2Creact-native-screens%40~4.16.0%2Creact-native-worklets%400.5.1)** (SDK 54, 필요한 패키지 자동 포함) <button class="snack-embed" type="button">👀 여기서 결과 보기</button>

**🇰🇷 한글 해설**

같은 두 화면이 **세 가지 다른 내비게이터**에 들어가요. 무엇이 될지는 `Platform.select()` 블록 하나만 결정.

#### 💻 How It Works

- `Platform.select()` looks at the keys `ios`, `android` and `default`. Web has no key of its own here, so it gets `default`.
- Each value is a function that returns a navigator. `Platform.select()` picks one function, and `MyApp` calls it with `Navigator()` inside the `NavigationContainer`.
- The screens are written once and reused by all three navigators. Only the wrapper changes.

**🇰🇷 한글 해설**

- 키는 `ios`, `android`, `default`. **web 키가 없으니 웹은 default**.
- 각 값은 내비게이터를 return 하는 **함수**. MyApp에서 `Navigator()`로 **호출**.
- 화면은 한 번만 작성, 감싸는 것만 바뀜.

#### 💻 What to Show

1. **Web.** Run it in the Web preview. You see a header that says **Home** and nothing else: no tab bar, no menu. This is the stack from `default`.
2. **Point out the dead end.** There's no way to reach Settings on web. A stack only moves when something calls `navigate()`, and these screens have no buttons. That's one reason real apps combine navigators, which is the next example.
3. **iOS.** Switch the preview to iOS. A tab bar appears at the bottom with Home and Settings, and tapping a tab switches screens.
4. **Android.** Switch the preview to Android. The header has a menu icon on the left. Tap it, or swipe in from the left edge, to open the drawer with Home and Settings.
5. **Back to the code.** Point at the `Platform.select()` block. Three navigators, the same two screens, and nothing else in the app changed.

- The iOS and Android previews in Snack run on a remote simulator and can take a minute to start. Opening the Snack in Expo Go on a phone also works, but only shows your phone's platform.
- This is a demo, not a requirement. Tabs and drawers work on every platform.

**🇰🇷 한글 해설**

1. Web: default 스택. Home 헤더만, 탭도 메뉴도 없음.
2. **막다른 길**: 웹에선 Settings로 갈 방법이 없음. 스택은 누군가 `navigate()`를 불러야 움직이는데 버튼이 없으니까. → 그래서 실제 앱은 내비게이터를 **조합**.
3. iOS: 아래 탭 바.
4. Android: 왼쪽 메뉴 아이콘, 또는 왼쪽 끝에서 스와이프 → 드로어.
5. 정리: 세 내비게이터, 같은 두 화면, 나머지는 그대로.

### 💻 Example: Nesting Navigators

- Real apps almost always use more than one navigator: a stack for signing in, tabs for the main sections, a drawer for settings.
- They are combined by putting one navigator inside a screen of another.
- Common patterns:
  - Stack → Tabs: detail screens open over the tab bar.
  - Tabs → Stack: each tab has its own stack of screens.
  - Drawer → Tabs → Stack: very common in large apps.
  - Stack → Drawer: the drawer only appears after login.
- Show the first pattern: tabs inside a stack.
- Replace everything in `App.js` with this. There's nothing to build. The steps under **What to Show** walk through it.

```jsx
import { View, Text, Button, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function FeedScreen({ navigation }) {
  return (
    <View style={styles.screen}>
      <Text>Feed</Text>
      <Button title="Open Post" onPress={() => navigation.navigate("Post")} />
    </View>
  );
}

function AccountScreen() {
  return (
    <View style={styles.screen}>
      <Text>Account</Text>
    </View>
  );
}

function PostScreen({ navigation }) {
  return (
    <View style={styles.screen}>
      <Text>Post Details</Text>
      <Button
        title="Go to the Account tab"
        onPress={() => navigation.popTo("Main", { screen: "Account" })}
      />
    </View>
  );
}

// The tab navigator is itself a screen in the stack below.
function MainTabs() {
  return (
    <Tab.Navigator>
      <Tab.Screen
        name="Feed"
        component={FeedScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="newspaper" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="Account"
        component={AccountScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="person" color={color} size={size} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

export default function MyApp() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="Main"
          component={MainTabs}
          options={{ headerShown: false }}
        />
        <Stack.Screen name="Post" component={PostScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});
```

▶ **[Snack에서 바로 실행하기](https://snack.expo.dev/?name=WEB530%20W4%20Example%3A%20Nesting%20Navigators&platform=web&sdkVersion=54.0.0&code=import%20%7B%20View%2C%20Text%2C%20Button%2C%20StyleSheet%20%7D%20from%20%22react-native%22%3B%0Aimport%20%7B%20Ionicons%20%7D%20from%20%22%40expo%2Fvector-icons%22%3B%0Aimport%20%7B%20NavigationContainer%20%7D%20from%20%22%40react-navigation%2Fnative%22%3B%0Aimport%20%7B%20createNativeStackNavigator%20%7D%20from%20%22%40react-navigation%2Fnative-stack%22%3B%0Aimport%20%7B%20createBottomTabNavigator%20%7D%20from%20%22%40react-navigation%2Fbottom-tabs%22%3B%0A%0Aconst%20Stack%20%3D%20createNativeStackNavigator%28%29%3B%0Aconst%20Tab%20%3D%20createBottomTabNavigator%28%29%3B%0A%0Afunction%20FeedScreen%28%7B%20navigation%20%7D%29%20%7B%0A%20%20return%20%28%0A%20%20%20%20%3CView%20style%3D%7Bstyles.screen%7D%3E%0A%20%20%20%20%20%20%3CText%3EFeed%3C%2FText%3E%0A%20%20%20%20%20%20%3CButton%20title%3D%22Open%20Post%22%20onPress%3D%7B%28%29%20%3D%3E%20navigation.navigate%28%22Post%22%29%7D%20%2F%3E%0A%20%20%20%20%3C%2FView%3E%0A%20%20%29%3B%0A%7D%0A%0Afunction%20AccountScreen%28%29%20%7B%0A%20%20return%20%28%0A%20%20%20%20%3CView%20style%3D%7Bstyles.screen%7D%3E%0A%20%20%20%20%20%20%3CText%3EAccount%3C%2FText%3E%0A%20%20%20%20%3C%2FView%3E%0A%20%20%29%3B%0A%7D%0A%0Afunction%20PostScreen%28%7B%20navigation%20%7D%29%20%7B%0A%20%20return%20%28%0A%20%20%20%20%3CView%20style%3D%7Bstyles.screen%7D%3E%0A%20%20%20%20%20%20%3CText%3EPost%20Details%3C%2FText%3E%0A%20%20%20%20%20%20%3CButton%0A%20%20%20%20%20%20%20%20title%3D%22Go%20to%20the%20Account%20tab%22%0A%20%20%20%20%20%20%20%20onPress%3D%7B%28%29%20%3D%3E%20navigation.popTo%28%22Main%22%2C%20%7B%20screen%3A%20%22Account%22%20%7D%29%7D%0A%20%20%20%20%20%20%2F%3E%0A%20%20%20%20%3C%2FView%3E%0A%20%20%29%3B%0A%7D%0A%0A%2F%2F%20The%20tab%20navigator%20is%20itself%20a%20screen%20in%20the%20stack%20below.%0Afunction%20MainTabs%28%29%20%7B%0A%20%20return%20%28%0A%20%20%20%20%3CTab.Navigator%3E%0A%20%20%20%20%20%20%3CTab.Screen%0A%20%20%20%20%20%20%20%20name%3D%22Feed%22%0A%20%20%20%20%20%20%20%20component%3D%7BFeedScreen%7D%0A%20%20%20%20%20%20%20%20options%3D%7B%7B%0A%20%20%20%20%20%20%20%20%20%20tabBarIcon%3A%20%28%7B%20color%2C%20size%20%7D%29%20%3D%3E%20%28%0A%20%20%20%20%20%20%20%20%20%20%20%20%3CIonicons%20name%3D%22newspaper%22%20color%3D%7Bcolor%7D%20size%3D%7Bsize%7D%20%2F%3E%0A%20%20%20%20%20%20%20%20%20%20%29%2C%0A%20%20%20%20%20%20%20%20%7D%7D%0A%20%20%20%20%20%20%2F%3E%0A%20%20%20%20%20%20%3CTab.Screen%0A%20%20%20%20%20%20%20%20name%3D%22Account%22%0A%20%20%20%20%20%20%20%20component%3D%7BAccountScreen%7D%0A%20%20%20%20%20%20%20%20options%3D%7B%7B%0A%20%20%20%20%20%20%20%20%20%20tabBarIcon%3A%20%28%7B%20color%2C%20size%20%7D%29%20%3D%3E%20%28%0A%20%20%20%20%20%20%20%20%20%20%20%20%3CIonicons%20name%3D%22person%22%20color%3D%7Bcolor%7D%20size%3D%7Bsize%7D%20%2F%3E%0A%20%20%20%20%20%20%20%20%20%20%29%2C%0A%20%20%20%20%20%20%20%20%7D%7D%0A%20%20%20%20%20%20%2F%3E%0A%20%20%20%20%3C%2FTab.Navigator%3E%0A%20%20%29%3B%0A%7D%0A%0Aexport%20default%20function%20MyApp%28%29%20%7B%0A%20%20return%20%28%0A%20%20%20%20%3CNavigationContainer%3E%0A%20%20%20%20%20%20%3CStack.Navigator%3E%0A%20%20%20%20%20%20%20%20%3CStack.Screen%0A%20%20%20%20%20%20%20%20%20%20name%3D%22Main%22%0A%20%20%20%20%20%20%20%20%20%20component%3D%7BMainTabs%7D%0A%20%20%20%20%20%20%20%20%20%20options%3D%7B%7B%20headerShown%3A%20false%20%7D%7D%0A%20%20%20%20%20%20%20%20%2F%3E%0A%20%20%20%20%20%20%20%20%3CStack.Screen%20name%3D%22Post%22%20component%3D%7BPostScreen%7D%20%2F%3E%0A%20%20%20%20%20%20%3C%2FStack.Navigator%3E%0A%20%20%20%20%3C%2FNavigationContainer%3E%0A%20%20%29%3B%0A%7D%0A%0Aconst%20styles%20%3D%20StyleSheet.create%28%7B%0A%20%20screen%3A%20%7B%0A%20%20%20%20flex%3A%201%2C%0A%20%20%20%20alignItems%3A%20%22center%22%2C%0A%20%20%20%20justifyContent%3A%20%22center%22%2C%0A%20%20%7D%2C%0A%7D%29%3B%0A&dependencies=%40expo%2Fvector-icons%40%5E15.0.3%2C%40react-navigation%2Fbottom-tabs%40%5E7.0.0%2C%40react-navigation%2Fnative%40%5E7.0.0%2C%40react-navigation%2Fnative-stack%40%5E7.0.0%2Creact-native-safe-area-context%40~5.6.0%2Creact-native-screens%40~4.16.0)** (SDK 54, 필요한 패키지 자동 포함) <button class="snack-embed" type="button">👀 여기서 결과 보기</button>

**🇰🇷 한글 해설**

코스노트 "Nesting navigators"와 같은 내용(Stack → Tabs 패턴). 4가지 중첩 패턴을 다시 보세요.

#### 💻 How It Works

- `MainTabs` is an ordinary component that returns a `Tab.Navigator`. The stack registers it as the `Main` screen, so the whole tab navigator is one screen in the stack.
- Still one `NavigationContainer`, at the very top. The nested navigator never gets its own.
- The stack holds two screens: `Main` (the tabs) and `Post`. `Post` is outside the tabs, which is why it covers the tab bar.
- Each navigator keeps its own history, and screens get the same props wherever they live.

**🇰🇷 한글 해설**

- `MainTabs`는 `Tab.Navigator`를 return 하는 평범한 컴포넌트, 스택이 이걸 `Main` 화면으로 등록 → **탭 전체가 스택의 화면 하나**.
- `NavigationContainer`는 **여전히 맨 위에 하나**.
- Post는 탭 **바깥**이라 탭 바를 덮어요.
- 각 내비게이터는 **자기 history**를 따로 가짐.

#### 💻 What to Show

1. **Run it.** You land on the Feed tab with a tab bar at the bottom and one header, titled **Feed**. That header belongs to the tab navigator.
2. **Show why `headerShown: false` is there.** Delete `options={{ headerShown: false }}` from the `Main` screen and run it. Now there are two headers: the stack's, titled **Main**, above the tab navigator's, titled **Feed**. Put it back.
3. **Up is automatic.** Press **Open Post**. Post slides in over the tabs, the tab bar disappears, and a back arrow appears.
   - `FeedScreen` calls `navigate("Post")`. The tab navigator has no `Post`, so the action passes up to the parent stack, which pushes `Post` over the tabs.
4. **Back to the tabs.** Press the back arrow. You return to Feed with the tab bar, exactly as you left it.
5. **Down needs the parent's name.** Open Post again and press **Go to the Account tab**. You land on the Account tab.
   - `PostScreen` can't name `Account` on its own, because `Account` is inside the tab navigator. Name the parent screen first, then the screen inside it: `popTo("Main", { screen: "Account" })`.
   - It uses `popTo()`, not `navigate()`, because `Main` is below Post in the stack. This is the same trap as Navigate vs Push.
6. **Show the failure.** Change the button to `navigation.navigate("Account")`. Press it and nothing happens. In development, React Navigation logs an error that no navigator handled the action.
7. **Show the trap (optional).** Change the button to `navigation.navigate("Main", { screen: "Account" })`. It looks like it works, but `navigate()` pushed a second copy of the tabs on top of Post. There's no back arrow, because `Main` hides its header. On Android, the back button takes you to Post instead of leaving the app. Change it back to `popTo()`.

**🇰🇷 한글 해설**

1. Feed 탭, 헤더 하나(탭의 헤더).
2. `headerShown: false`를 지우면 헤더 **2개**(스택의 "Main" + 탭의 "Feed").
3. **위로는 자동**: Feed에서 `navigate("Post")` → 탭에 없으니 부모 스택으로 → Post가 탭 위에.
4. 뒤로 → Feed 그대로.
5. **아래로는 부모 이름 필요**: `popTo("Main", { screen: "Account" })`.
6. `navigate("Account")`만 쓰면 **아무 일도 없음** + 개발 모드 에러 로그.
7. 함정: `navigate("Main", { screen: "Account" })` → 되는 것처럼 보이지만 탭 복사본이 Post 위에 쌓임. Android 뒤로 가기가 앱 종료 대신 Post로 감.

### 💻 Example: Handling State Across Screens

- Params pass data one way, into the next screen. Data that several screens change needs shared state.
- React Navigation has no state API of its own. Use the same tools as any React app.
- Show Jotai from week 2 keeping stock counts in sync between the list and a header button.
- `jotai` is already in the `package.json` from the top of these notes.

**🇰🇷 한글 해설**

params는 **한 방향**(다음 화면으로)만. 여러 화면이 같이 **바꾸는** 데이터는 공유 state(Jotai)가 필요.

#### 💻 Starter Code

- This is a new app, so replace everything in `App.js`. The navigator, both screens, the header button and the styles are done.
- It runs as is, but the counts are a plain object, so nothing can change them. **Buy** does nothing, and it is greyed out for Banana because Banana starts at 0.

```jsx
import { View, Button, Text, StyleSheet } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

const Stack = createNativeStackNavigator();

// Stock counts. A plain object for now, so nothing can change them.
const stock = { Apple: 5, Banana: 0, Cherry: 15 };

function HomeScreen({ navigation }) {
  return (
    <View style={styles.screen}>
      {Object.keys(stock).map((item) => (
        <Button
          key={item}
          title={`${item} (${stock[item]})`}
          onPress={() => navigation.navigate("Details", { item })}
        />
      ))}
    </View>
  );
}

function DetailsScreen({ route }) {
  const { item = "Apple" } = route.params ?? {};

  return (
    <View style={styles.screen}>
      <Text>
        {item}: {stock[item]} in stock
      </Text>
    </View>
  );
}

// Lives in the header, not inside a screen.
function BuyButton({ item }) {
  const qty = stock[item] ?? 0;

  return <Button title="Buy" disabled={qty === 0} />;
}

export default function MyApp() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen
          name="Details"
          component={DetailsScreen}
          options={({ route }) => ({
            title: route.params?.item ?? "Details",
            headerRight: () => <BuyButton item={route.params?.item} />,
          })}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});
```

▶ **[Snack에서 바로 실행하기](https://snack.expo.dev/?name=WEB530%20W4%20Example%3A%20Handling%20State%20Across%20Screens%20-%20Starter%20C&platform=web&sdkVersion=54.0.0&code=import%20%7B%20View%2C%20Button%2C%20Text%2C%20StyleSheet%20%7D%20from%20%22react-native%22%3B%0Aimport%20%7B%20NavigationContainer%20%7D%20from%20%22%40react-navigation%2Fnative%22%3B%0Aimport%20%7B%20createNativeStackNavigator%20%7D%20from%20%22%40react-navigation%2Fnative-stack%22%3B%0A%0Aconst%20Stack%20%3D%20createNativeStackNavigator%28%29%3B%0A%0A%2F%2F%20Stock%20counts.%20A%20plain%20object%20for%20now%2C%20so%20nothing%20can%20change%20them.%0Aconst%20stock%20%3D%20%7B%20Apple%3A%205%2C%20Banana%3A%200%2C%20Cherry%3A%2015%20%7D%3B%0A%0Afunction%20HomeScreen%28%7B%20navigation%20%7D%29%20%7B%0A%20%20return%20%28%0A%20%20%20%20%3CView%20style%3D%7Bstyles.screen%7D%3E%0A%20%20%20%20%20%20%7BObject.keys%28stock%29.map%28%28item%29%20%3D%3E%20%28%0A%20%20%20%20%20%20%20%20%3CButton%0A%20%20%20%20%20%20%20%20%20%20key%3D%7Bitem%7D%0A%20%20%20%20%20%20%20%20%20%20title%3D%7B%60%24%7Bitem%7D%20%28%24%7Bstock%5Bitem%5D%7D%29%60%7D%0A%20%20%20%20%20%20%20%20%20%20onPress%3D%7B%28%29%20%3D%3E%20navigation.navigate%28%22Details%22%2C%20%7B%20item%20%7D%29%7D%0A%20%20%20%20%20%20%20%20%2F%3E%0A%20%20%20%20%20%20%29%29%7D%0A%20%20%20%20%3C%2FView%3E%0A%20%20%29%3B%0A%7D%0A%0Afunction%20DetailsScreen%28%7B%20route%20%7D%29%20%7B%0A%20%20const%20%7B%20item%20%3D%20%22Apple%22%20%7D%20%3D%20route.params%20%3F%3F%20%7B%7D%3B%0A%0A%20%20return%20%28%0A%20%20%20%20%3CView%20style%3D%7Bstyles.screen%7D%3E%0A%20%20%20%20%20%20%3CText%3E%0A%20%20%20%20%20%20%20%20%7Bitem%7D%3A%20%7Bstock%5Bitem%5D%7D%20in%20stock%0A%20%20%20%20%20%20%3C%2FText%3E%0A%20%20%20%20%3C%2FView%3E%0A%20%20%29%3B%0A%7D%0A%0A%2F%2F%20Lives%20in%20the%20header%2C%20not%20inside%20a%20screen.%0Afunction%20BuyButton%28%7B%20item%20%7D%29%20%7B%0A%20%20const%20qty%20%3D%20stock%5Bitem%5D%20%3F%3F%200%3B%0A%0A%20%20return%20%3CButton%20title%3D%22Buy%22%20disabled%3D%7Bqty%20%3D%3D%3D%200%7D%20%2F%3E%3B%0A%7D%0A%0Aexport%20default%20function%20MyApp%28%29%20%7B%0A%20%20return%20%28%0A%20%20%20%20%3CNavigationContainer%3E%0A%20%20%20%20%20%20%3CStack.Navigator%3E%0A%20%20%20%20%20%20%20%20%3CStack.Screen%20name%3D%22Home%22%20component%3D%7BHomeScreen%7D%20%2F%3E%0A%20%20%20%20%20%20%20%20%3CStack.Screen%0A%20%20%20%20%20%20%20%20%20%20name%3D%22Details%22%0A%20%20%20%20%20%20%20%20%20%20component%3D%7BDetailsScreen%7D%0A%20%20%20%20%20%20%20%20%20%20options%3D%7B%28%7B%20route%20%7D%29%20%3D%3E%20%28%7B%0A%20%20%20%20%20%20%20%20%20%20%20%20title%3A%20route.params%3F.item%20%3F%3F%20%22Details%22%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20headerRight%3A%20%28%29%20%3D%3E%20%3CBuyButton%20item%3D%7Broute.params%3F.item%7D%20%2F%3E%2C%0A%20%20%20%20%20%20%20%20%20%20%7D%29%7D%0A%20%20%20%20%20%20%20%20%2F%3E%0A%20%20%20%20%20%20%3C%2FStack.Navigator%3E%0A%20%20%20%20%3C%2FNavigationContainer%3E%0A%20%20%29%3B%0A%7D%0A%0Aconst%20styles%20%3D%20StyleSheet.create%28%7B%0A%20%20screen%3A%20%7B%0A%20%20%20%20flex%3A%201%2C%0A%20%20%20%20alignItems%3A%20%22center%22%2C%0A%20%20%20%20justifyContent%3A%20%22center%22%2C%0A%20%20%7D%2C%0A%7D%29%3B%0A&dependencies=%40react-navigation%2Fnative%40%5E7.0.0%2C%40react-navigation%2Fnative-stack%40%5E7.0.0%2Creact-native-safe-area-context%40~5.6.0%2Creact-native-screens%40~4.16.0)** (SDK 54, 필요한 패키지 자동 포함) <button class="snack-embed" type="button">👀 여기서 결과 보기</button>

- Before adding anything, point out the problem. `BuyButton` needs to change a count, and `HomeScreen` and `DetailsScreen` need to show it.
- `useState` in one of them can't reach the others. `BuyButton` is rendered by the header, and both screens are rendered by the navigator, so none of them is a parent you control.

**🇰🇷 한글 해설**

`stock`이 일반 객체라 아무것도 안 바뀜. Buy가 동작 안 함, Banana는 0이라 회색.
문제점: BuyButton은 **헤더**가 그리고, 두 화면은 **내비게이터**가 그려서, 내가 직접 컨트롤하는 공통 부모가 없어요. useState로는 못 닿아요.

#### 💻 Step 1 - Import Jotai

- Add this import under the others.

```jsx
import { atom, useAtom } from "jotai";
```

**🇰🇷 한글 해설**

`import { atom, useAtom } from "jotai";`

#### 💻 Step 2 - Turn the Object into an Atom

- Replace the plain `stock` object with an atom. Same values, wrapped in `atom()`, with a new name.

```jsx
// Global stock counts, shared by every screen.
const stockAtom = atom({ Apple: 5, Banana: 0, Cherry: 15 });
```

- Run it. It crashes, saying `stock` is not defined. Every component was reading the plain object, and it's gone.
- The next three steps fix them one at a time.

**🇰🇷 한글 해설**

`const stockAtom = atom({...})`. 이름이 바뀌어서 `stock`을 읽던 곳들이 전부 **크래시**. 하나씩 고쳐 가요.

#### 💻 Step 3 - Read the Atom in HomeScreen

- Add this as the first line inside `HomeScreen`.

```jsx
const [stock] = useAtom(stockAtom);
```

- Run it. The list is back. Don't open an item yet, because `DetailsScreen` and `BuyButton` still crash.
- Only the value is needed here, so only the first item of the array is kept.

**🇰🇷 한글 해설**

`const [stock] = useAtom(stockAtom);` → 값만 필요하니 첫 번째만.

#### 💻 Step 4 - Read the Atom in DetailsScreen

- Add the same line as the first line inside `DetailsScreen`.

```jsx
const [stock] = useAtom(stockAtom);
```

**🇰🇷 한글 해설**

같은 한 줄.

#### 💻 Step 5 - Read and Update the Atom in BuyButton

- `BuyButton` needs the setter too. Add this as its first line.

```jsx
const [stock, setStock] = useAtom(stockAtom);
```

- Give the button an `onPress` that takes one off this item's count.

```jsx
<Button
  title="Buy"
  disabled={qty === 0}
  onPress={() => setStock((prev) => ({ ...prev, [item]: prev[item] - 1 }))}
/>
```

- The updater form `(prev) => ...` is used because the new count depends on the old one.
- `{ ...prev, [item]: ... }` builds a new object with one count changed. Changing `prev` directly would not re-render anything.

**🇰🇷 한글 해설**

`const [stock, setStock] = useAtom(stockAtom);` → `setStock((prev) => ({ ...prev, [item]: prev[item] - 1 }))`.
- 함수형 = 이전 값 기반.
- `{ ...prev, [item]: ... }` **새 객체**를 만들기. `prev[item]--` 처럼 직접 고치면 React가 바뀐 걸 몰라서 **다시 안 그려요**.

#### 💻 Step 6 - Show That Every Screen Stays in Sync

- No code in this step. Open Apple and press **Buy** a few times. The count on the Details screen goes down.
- Keep pressing until it reaches 0. **Buy** greys itself out.
- Go back. The count on the list has changed too.
- `HomeScreen`, `DetailsScreen` and `BuyButton` never pass the counts to each other. They all read the same atom.
- The alternative is lifting state into `MyApp` and passing it to every screen. It works, but every screen has to receive and pass it along, and screens are rendered by the navigator, not by you, which makes passing props awkward.

**🇰🇷 한글 해설**

Apple에서 Buy → Details 숫자 감소 → 0이면 Buy 회색 → 뒤로 가면 목록 숫자도 감소. 세 컴포넌트가 서로 props를 안 주고 **같은 atom**만 봐요.

#### 💻 Finished Code

- This is the completed example. Compare it against yours if something doesn't work and you can't find the typo.

```jsx
import { View, Button, Text, StyleSheet } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { atom, useAtom } from "jotai";

const Stack = createNativeStackNavigator();

// Global stock counts, shared by every screen.
const stockAtom = atom({ Apple: 5, Banana: 0, Cherry: 15 });

function HomeScreen({ navigation }) {
  const [stock] = useAtom(stockAtom);

  return (
    <View style={styles.screen}>
      {Object.keys(stock).map((item) => (
        <Button
          key={item}
          title={`${item} (${stock[item]})`}
          onPress={() => navigation.navigate("Details", { item })}
        />
      ))}
    </View>
  );
}

function DetailsScreen({ route }) {
  const [stock] = useAtom(stockAtom);
  const { item = "Apple" } = route.params ?? {};

  return (
    <View style={styles.screen}>
      <Text>
        {item}: {stock[item]} in stock
      </Text>
    </View>
  );
}

// Lives in the header, but reads and updates the same atom.
function BuyButton({ item }) {
  const [stock, setStock] = useAtom(stockAtom);
  const qty = stock[item] ?? 0;

  return (
    <Button
      title="Buy"
      disabled={qty === 0}
      onPress={() => setStock((prev) => ({ ...prev, [item]: prev[item] - 1 }))}
    />
  );
}

export default function MyApp() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen
          name="Details"
          component={DetailsScreen}
          options={({ route }) => ({
            title: route.params?.item ?? "Details",
            headerRight: () => <BuyButton item={route.params?.item} />,
          })}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});
```

▶ **[Snack에서 바로 실행하기](https://snack.expo.dev/?name=WEB530%20W4%20Example%3A%20Handling%20State%20Across%20Screens%20-%20Finished%20&platform=web&sdkVersion=54.0.0&code=import%20%7B%20View%2C%20Button%2C%20Text%2C%20StyleSheet%20%7D%20from%20%22react-native%22%3B%0Aimport%20%7B%20NavigationContainer%20%7D%20from%20%22%40react-navigation%2Fnative%22%3B%0Aimport%20%7B%20createNativeStackNavigator%20%7D%20from%20%22%40react-navigation%2Fnative-stack%22%3B%0Aimport%20%7B%20atom%2C%20useAtom%20%7D%20from%20%22jotai%22%3B%0A%0Aconst%20Stack%20%3D%20createNativeStackNavigator%28%29%3B%0A%0A%2F%2F%20Global%20stock%20counts%2C%20shared%20by%20every%20screen.%0Aconst%20stockAtom%20%3D%20atom%28%7B%20Apple%3A%205%2C%20Banana%3A%200%2C%20Cherry%3A%2015%20%7D%29%3B%0A%0Afunction%20HomeScreen%28%7B%20navigation%20%7D%29%20%7B%0A%20%20const%20%5Bstock%5D%20%3D%20useAtom%28stockAtom%29%3B%0A%0A%20%20return%20%28%0A%20%20%20%20%3CView%20style%3D%7Bstyles.screen%7D%3E%0A%20%20%20%20%20%20%7BObject.keys%28stock%29.map%28%28item%29%20%3D%3E%20%28%0A%20%20%20%20%20%20%20%20%3CButton%0A%20%20%20%20%20%20%20%20%20%20key%3D%7Bitem%7D%0A%20%20%20%20%20%20%20%20%20%20title%3D%7B%60%24%7Bitem%7D%20%28%24%7Bstock%5Bitem%5D%7D%29%60%7D%0A%20%20%20%20%20%20%20%20%20%20onPress%3D%7B%28%29%20%3D%3E%20navigation.navigate%28%22Details%22%2C%20%7B%20item%20%7D%29%7D%0A%20%20%20%20%20%20%20%20%2F%3E%0A%20%20%20%20%20%20%29%29%7D%0A%20%20%20%20%3C%2FView%3E%0A%20%20%29%3B%0A%7D%0A%0Afunction%20DetailsScreen%28%7B%20route%20%7D%29%20%7B%0A%20%20const%20%5Bstock%5D%20%3D%20useAtom%28stockAtom%29%3B%0A%20%20const%20%7B%20item%20%3D%20%22Apple%22%20%7D%20%3D%20route.params%20%3F%3F%20%7B%7D%3B%0A%0A%20%20return%20%28%0A%20%20%20%20%3CView%20style%3D%7Bstyles.screen%7D%3E%0A%20%20%20%20%20%20%3CText%3E%0A%20%20%20%20%20%20%20%20%7Bitem%7D%3A%20%7Bstock%5Bitem%5D%7D%20in%20stock%0A%20%20%20%20%20%20%3C%2FText%3E%0A%20%20%20%20%3C%2FView%3E%0A%20%20%29%3B%0A%7D%0A%0A%2F%2F%20Lives%20in%20the%20header%2C%20but%20reads%20and%20updates%20the%20same%20atom.%0Afunction%20BuyButton%28%7B%20item%20%7D%29%20%7B%0A%20%20const%20%5Bstock%2C%20setStock%5D%20%3D%20useAtom%28stockAtom%29%3B%0A%20%20const%20qty%20%3D%20stock%5Bitem%5D%20%3F%3F%200%3B%0A%0A%20%20return%20%28%0A%20%20%20%20%3CButton%0A%20%20%20%20%20%20title%3D%22Buy%22%0A%20%20%20%20%20%20disabled%3D%7Bqty%20%3D%3D%3D%200%7D%0A%20%20%20%20%20%20onPress%3D%7B%28%29%20%3D%3E%20setStock%28%28prev%29%20%3D%3E%20%28%7B%20...prev%2C%20%5Bitem%5D%3A%20prev%5Bitem%5D%20-%201%20%7D%29%29%7D%0A%20%20%20%20%2F%3E%0A%20%20%29%3B%0A%7D%0A%0Aexport%20default%20function%20MyApp%28%29%20%7B%0A%20%20return%20%28%0A%20%20%20%20%3CNavigationContainer%3E%0A%20%20%20%20%20%20%3CStack.Navigator%3E%0A%20%20%20%20%20%20%20%20%3CStack.Screen%20name%3D%22Home%22%20component%3D%7BHomeScreen%7D%20%2F%3E%0A%20%20%20%20%20%20%20%20%3CStack.Screen%0A%20%20%20%20%20%20%20%20%20%20name%3D%22Details%22%0A%20%20%20%20%20%20%20%20%20%20component%3D%7BDetailsScreen%7D%0A%20%20%20%20%20%20%20%20%20%20options%3D%7B%28%7B%20route%20%7D%29%20%3D%3E%20%28%7B%0A%20%20%20%20%20%20%20%20%20%20%20%20title%3A%20route.params%3F.item%20%3F%3F%20%22Details%22%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20headerRight%3A%20%28%29%20%3D%3E%20%3CBuyButton%20item%3D%7Broute.params%3F.item%7D%20%2F%3E%2C%0A%20%20%20%20%20%20%20%20%20%20%7D%29%7D%0A%20%20%20%20%20%20%20%20%2F%3E%0A%20%20%20%20%20%20%3C%2FStack.Navigator%3E%0A%20%20%20%20%3C%2FNavigationContainer%3E%0A%20%20%29%3B%0A%7D%0A%0Aconst%20styles%20%3D%20StyleSheet.create%28%7B%0A%20%20screen%3A%20%7B%0A%20%20%20%20flex%3A%201%2C%0A%20%20%20%20alignItems%3A%20%22center%22%2C%0A%20%20%20%20justifyContent%3A%20%22center%22%2C%0A%20%20%7D%2C%0A%7D%29%3B%0A&dependencies=%40react-navigation%2Fnative%40%5E7.0.0%2C%40react-navigation%2Fnative-stack%40%5E7.0.0%2C%40types%2Freact%40%2A%2Cjotai%40%2A%2Creact-native-safe-area-context%40~5.6.0%2Creact-native-screens%40~4.16.0)** (SDK 54, 필요한 패키지 자동 포함) <button class="snack-embed" type="button">👀 여기서 결과 보기</button>

**🇰🇷 한글 해설**

**완성 코드 해설**: `stockAtom` 하나를 HomeScreen(목록 수량), DetailsScreen(상세 수량), BuyButton(헤더, 감소)이 같이 씀. Lab 4 Part B4의 Save 버튼이 이 Buy 버튼의 **배열 버전**이에요.


---

## 4. 🧪 Lab: Lab 4 - Navigation

> 원문 출처: github.com/nick-romanidis/web530-2267-nsa  lab-4.md

**🇰🇷 들어가기 전에**

Lab 4는 4주차 전부(탭 + 중첩 스택 + params + 헤더 + push/popToTop + Jotai + useNavigation)를 한 앱에 넣는 **종합 문제**예요. Test 2 대비로 아주 좋아요. 아래에서 파트별로 어떤 인클래스 예제를 보면 되는지 연결했어요.

### 🧪 A Note on AI

AI assistants are welcome in this course, but use them to get unstuck, not to do the work. Attempt every question yourself first. If you are stuck, paste **your** code and ask why it does not work or what concept you are missing, rather than asking for the answer. Never keep code you could not explain line by line to a classmate. If you cannot explain it, you cannot debug it or build on it, and it is not yours yet. This lab has a built-in check on that: a teammate is going to test your app while you watch, and you will test theirs. The point of this lab is not the finished Snack. It is being able to wire up navigation yourself, and to read someone else's app well enough to find what is wrong with it.

**🇰🇷 한글 해설**

AI는 막혔을 때만. 이번 랩은 그룹 활동 + 서로 테스트까지 있어요.

### 🧪 Overview

This is a group lab with individual submissions, done entirely in class. You plan the app with your project group, build it on your own, then test each other's work.

- **Part A - Plan together.** Your group agrees on an app and draws its navigation map.
- **Part B - Build it yourself.** Every member builds the group's map in their own Snack. Your code is your own.
- **Part C - Test each other.** A teammate runs a set of checks on your app and records the results in your Snack. You do the same for them.

Your group is your project group. The list is in `project/project-groups.md` in the course repo. Because everyone in the group builds the same map, a teammate can test your app without reading your code.

This lab is also the first time you work with your project group, and getting to know each other is part of the point. **The app you build here is not your project.** Project brainstorming happens in formal sessions after the study break, so do not spend this lab pitching ideas or trying to pick the perfect topic.

**🇰🇷 한글 해설**

그룹이 같이 앱 지도를 그리고(A), 각자 직접 만들고(B), 서로 테스트(C).

#### 🧪 The Clock

The period runs from 11:40 to 1:25. These times are not suggestions:

| Time  | What                                                                 |
| ----- | -------------------------------------------------------------------- |
| 11:40 | Find your group, sit together, fork the starter Snack.               |
| 11:45 | Part A. Theme chosen by 11:47. Map drawn and photographed by 12:00.   |
| 12:00 | Part B. Build in order: B1, B2, B3, B4, then the bonus if time allows. |
| 12:55 | Part C. Stop building, whatever state your app is in, and start testing. |
| 1:20  | Save, check your link in a private window, submit.                   |

Part C needs two people. If you keep building past 12:55, your tester cannot finish either, and the lab is incomplete for both of you.

Checkpoints for Part B: B1 working by 12:15, B2 by 12:30, B3 by 12:40. If you are behind a checkpoint by more than five minutes, ask for help instead of pushing through alone.

**🇰🇷 한글 해설**

수업 시간 안에 끝내는 랩이라 시간 배분 안내예요.

### 🧪 Submission

- Submit to the `Lab 4` assessment in Blackboard:
  - One photo or screenshot of your group's navigation map for Part A.
  - One Snack link for Parts B and C. After you save, the link looks like `https://snack.expo.dev/@yourname/web530-lab-4-...`.
- The lab is due at the end of class. Submit before you leave.
- This lab is marked **complete** or **incomplete**. Complete means all of the following: the map photo, a Snack where B1 to B4 work, a Part C block filled in by a teammate, and your name as the tester in a teammate's Snack. The bonus is optional.
- Only students who participate in class and hand in a lab slip can receive credit for this lab. If you miss the class, you are still encouraged to complete it as practice.
- Every member submits their own Snack. Two Snacks in the same group with the same code are both incomplete. Same map, same route names, same screens: yes. Same code: no.
- Before submitting, save the Snack one last time and open your link in a private browser window to confirm it loads without signing in.

**🇰🇷 한글 해설**

지도 사진 + Snack 링크, 테스트 결과 주석 블록 포함.

### 🧪 Setup

1. Sign in to Snack at https://snack.expo.dev.
2. Open the starter Snack: https://snack.expo.dev/@nick-romanidis/lab4-starter
3. Click **Fork** (top right) so you get your own copy. If you cannot see a Fork button, you are not signed in.
4. Rename your copy to `WEB530 Lab 4 - Your Name` (click the name at the top left).
5. Click **Save** so the Snack gets a permanent link.

The starter already has three files. Do not replace them.

- `package.json` has the week 4 dependencies. Leave it alone, and keep Snack on SDK 54 (the default). SDK 55 does not load `react-native-screens`, so nothing in this lab runs on it.
- `styles.js` has a centred `screen` style. Add to it if you want, but keep styling minimal. This lab is about navigation, not looks.
- `App.js` has the imports, the Part C comment block, a placeholder item array, empty screen components, and a tab navigator with one tab. Each placeholder has a comment saying which part fills it in.

The Web preview is enough for everything in this lab. Check the Android or iOS tab once at the end to see the native tab bar and header.

**🇰🇷 한글 해설**

교수님 starter Snack을 **Fork**. package.json 그대로, **SDK 54 유지**. Web 미리보기로 충분.

### 🧪 Part A - Plan Together

With your group, pick a small app and draw its navigation map. Every member builds this same map in Part B, so agree on the details now. Do not use the fruit stand, the feed and account app, or anything else from the week 4 notes.

The theme does not matter and it is not your project. Give yourselves two minutes to choose, and if you cannot agree, take the first one on this list that nobody objects to:

- a campus food truck finder
- a board game collection
- a hiking trail guide
- a plant shop
- a podcast library

Spend the rest of Part A on the map, which is what you need for Part B, and on the names on it, which is who you are working with for the rest of the term.

The app has **three bottom tabs**. Your group names them, but they play these roles:

1. A **browse** tab. It contains a stack with two screens: a list of items and a details screen for one item.
2. A **saved** tab. It shows the items the user has saved from the details screen.
3. An **about** tab. It shows the app name, your group number and the names of every member.

Your map must show:

- The app name and the theme.
- The three tab names and the icon name for each, chosen from https://icons.expo.fyi/ (the Ionicons set).
- The route name of every screen, including the two inside the browse tab's stack.
- The item data: at least **four** items, each with an `id`, a `name`, and two more fields of your choice (for example `price` and `region`, or `players` and `minutes`).
- Which navigator holds which. A box inside a box is fine.

Draw it on paper, a whiteboard, or any drawing tool. Write the group number and the names of the members present on it. Everyone takes a photo, and everyone submits it.

**🇰🇷 한글 해설**

**지도에 들어갈 것**: 앱 이름, 탭 3개(browse, saved, about) 이름과 Ionicons 아이콘 이름, 모든 route 이름(browse 안의 스택 화면 2개 포함), 아이템 데이터 4개 이상(`id`, `name` + 필드 2개), 어떤 내비게이터가 어떤 걸 품는지(상자 안 상자).

### 🧪 Part B - Build It Yourself

Build the group's map in your own Snack, in order. The code is yours: write it, do not receive it. Replace the placeholder items in the `ITEMS` array with your group's data.

**🇰🇷 한글 해설**

지도 그대로 직접 구현. ITEMS 배열을 그룹 데이터로 교체.

#### 🧪 Part B1 - Tabs and a Nested Stack

- The tab navigator has the three tabs from your map, in that order. The app opens on the browse tab.
- Every tab has a `tabBarIcon` from `Ionicons`, using the icon names on your map. The icon takes the `color` and `size` the tab bar gives it.
- The browse tab's component, `BrowseStack` in the starter, is **not** a plain screen. It returns a stack navigator with the list screen and the details screen. Use the route names from your map.
- The **tab bar stays visible on the details screen**. If it disappears when you open an item, you nested the navigators the other way around.
- **Exactly one header is visible on every screen.** If the browse tab shows two stacked headers, hide one of them.

Hint: The course notes show both directions under **Nesting navigators**. The second example there, Messages and Contacts, is this exact pattern, including the double-header fix. Read it before you start B1.

**🇰🇷 한글 해설**

**연결**: 코스노트 Nesting navigators의 **두 번째 예제(Messages/Contacts)** 와 똑같은 패턴(Tabs → Stack).
- `BrowseStack`이 스택 내비게이터를 return.
- Details에서 **탭 바가 보여야** 정답(안 보이면 거꾸로 중첩한 것).
- 헤더 2개 문제 → browse 탭에 `headerShown: false`.

#### 🧪 Part B2 - Params and the Header

- The list screen renders one `Button` per item in your array, using `.map()`. Pressing it opens the details screen with **two params**: the item's `id` and its `name`.
- The details screen looks the item up in the array by `id` and shows all of its fields.
- The details screen must **not crash** when it is opened with no params. Show the text `Item not found` instead. A quick way to check, if you have a minute: temporarily set `initialRouteName` on the stack to the details screen, confirm the message shows, then put it back.
- The header title of the details screen is the item's `name`, taken from the params. When there is no name, the title is `Details`.
- The list screen's header title is the app name, not the route name.

Hint: `options` can be a function that receives `route`. `route.params?.name ?? "Details"` handles the missing case.

**🇰🇷 한글 해설**

**연결**: 4.1 Passing Params, Customizing the Header.
- `.map()`으로 아이템마다 Button, `navigate("Details", { id, name })` params 2개.
- Details: `ITEMS.find((it) => it.id === id)`로 찾기. 없으면 `Item not found` (params 없을 때 크래시 금지 → `route.params ?? {}`).
- 헤더 title: `route.params?.name ?? "Details"`.

#### 🧪 Part B3 - Push and Pop

Add two buttons to the details screen:

- `Next item` opens the details of the **next** item in your array (after the last item, wrap around to the first). It must open **on top of** the current details screen, so the header back arrow returns to the item you came from.
- `Back to list` returns to the list screen in **one press**, no matter how many `Next item` presses came before it.

Requirements:

- `Next item` uses `push`. Add a comment above it explaining, in your own words, what would happen if it used `navigate` instead.
- `Back to list` uses `popToTop`.

Hint: Find the current item's position in the array with `findIndex`, then use `%` to wrap.

**🇰🇷 한글 해설**

**연결**: 4.1 Navigate vs Push, Going Back.
- Next item: `findIndex`로 현재 위치, `(index + 1) % ITEMS.length`로 마지막 다음은 처음으로. `push` 사용.
- 주석에 쓸 내용(내 말로): navigate는 이미 Details에 있으니 **새 화면을 쌓지 않고 params만 바꿔서**, 뒤로 가기가 이전 아이템으로 안 돌아간다.
- Back to list: `popToTop()`.

#### 🧪 Part B4 - Saved Items and Shared State

The saved tab and the details screen share one list of saved ids through a Jotai atom, as in week 2. No saved data is passed as a prop or a param.

- One atom holds an array of saved `id`s. It starts empty.
- The details screen has a `headerRight` button. Its title is `Save` when the item is not saved and `Unsave` when it is. Pressing it toggles the item in the atom. Update the atom with the function form, `setSaved((prev) => ...)`.
- The saved tab lists the saved items by name, one `Text` or `Button` each.
- When nothing is saved, the saved tab shows the text `Nothing saved yet` and a `Browse` button that switches to the browse tab.
- The about tab shows the app name, your group number, and every member's name.

Requirements:

- The `Browse` button is its own component, not a screen. It gets the navigation object from the `useNavigation` hook.
- The `Save` and `Unsave` button is its own component that reads and updates the atom itself. The header only renders it and passes the item's `id`.

Hint: This is the Buy button from the notes, with an array instead of an object. `saved.includes(id)` tells you whether the item is saved. To toggle it: `prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]`. For the saved list, `ITEMS.filter((item) => saved.includes(item.id))` gives you the items to show.

**🇰🇷 한글 해설**

**연결**: 4.1 Handling State Across Screens(Buy 버튼) + useNavigation Hook.
- `savedAtom = atom([])` 배열.
- 저장 여부: `saved.includes(id)`. 토글: `prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]`.
- Save/Unsave 버튼은 **별도 컴포넌트**, headerRight는 렌더링 + id 전달만.
- Browse 버튼도 별도 컴포넌트, `useNavigation()` 사용.

#### 🧪 Bonus - Open a Saved Item

Only start this if B1 to B4 work and it is not yet 12:55. It is not needed to complete the lab.

- Pressing a saved item on the saved tab opens **its details screen inside the browse tab**, with the same two params as the list screen. The browse tab becomes selected and the tab bar stays visible.

Hint: The saved tab is outside the browse tab's stack, so `navigate("Details", ...)` cannot find it. Name the tab first, then the screen inside it: `navigate("Browse", { screen: "Details", params: { id, name } })`. Use your own route names. The **Message Sam** button in the course notes' Messages and Contacts example does exactly this.

**🇰🇷 한글 해설**

saved 탭은 browse 스택 **바깥**이라 `navigate("Browse", { screen: "Details", params: { id, name } })`. 코스노트의 "Message Sam" 버튼과 같은 원리.

### 🧪 Part C - Test Each Other

At 12:55, stop building. Pair up inside your group. If your group has an odd number, form a chain so everyone tests one app and everyone is tested once. If your tester is still building, test someone else in the group who is ready, and do not wait.

The tester opens the author's Snack, follows the checks in the comment block at the top of `App.js` **exactly as written**, and writes one word after each `Result:` line: `pass`, `fail`, or `not built`. The author watches and does not help. If a check fails, the author fixes it afterwards and writes down what changed.

The results live in that comment block. The tester types them in while sitting with the author, or sends them to the author to paste in. The block is already in the starter, so there is nothing to copy.

Requirements:

- The block is filled in completely: every `Result:` line has an answer, and the author, app and tester names are real. The tester is a member of your group and is not you.
- Your name appears as the tester in at least one teammate's Snack. Testing a teammate's app is part of completing the lab.
- For check 7, the tester tries something the other checks do not cover and writes one or two sentences about what happened. Pressing the same tab twice, opening the same item twice in a row, and saving every item are all fair game.
- An honest `not built` is fine. It tells the author exactly what still has to be done before 1:20.
- If any check failed, the fix is in the submitted code and the last line says what changed. A fail that was fixed counts as finished. A fail that was left alone does not.

**🇰🇷 한글 해설**

그룹원끼리 서로의 Snack을 주석 체크리스트대로 테스트하고 결과(pass/fail/not built)를 적기. 실패를 고쳤으면 무엇을 바꿨는지 마지막 줄에.


---

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

▶ **[Snack에서 바로 실행하기](https://snack.expo.dev/?name=WEB530%20W4%20practice&platform=web&sdkVersion=54.0.0&code=import%20%7B%20View%2C%20Text%2C%20Button%20%7D%20from%20%22react-native%22%3B%0Aimport%20%7B%20NavigationContainer%20%7D%20from%20%22%40react-navigation%2Fnative%22%3B%0Aimport%20%7B%20createNativeStackNavigator%20%7D%20from%20%22%40react-navigation%2Fnative-stack%22%3B%0Aimport%20%7B%20createBottomTabNavigator%20%7D%20from%20%22%40react-navigation%2Fbottom-tabs%22%3B%0Aimport%20%7B%20Ionicons%20%7D%20from%20%22%40expo%2Fvector-icons%22%3B%0Aimport%20%7B%20atom%2C%20useAtom%20%7D%20from%20%22jotai%22%3B%0A%0Aconst%20BOOKS%20%3D%20%5B%0A%20%20%7B%20id%3A%201%2C%20title%3A%20%22Clean%20Code%22%20%7D%2C%0A%20%20%7B%20id%3A%202%2C%20title%3A%20%22You%20Don%27t%20Know%20JS%22%20%7D%2C%0A%20%20%7B%20id%3A%203%2C%20title%3A%20%22Eloquent%20JavaScript%22%20%7D%2C%0A%5D%3B%0A%0Aconst%20savedAtom%20%3D%20atom%28%5B%5D%29%3B%0Aconst%20Stack%20%3D%20createNativeStackNavigator%28%29%3B%0Aconst%20Tab%20%3D%20createBottomTabNavigator%28%29%3B%0A%0Afunction%20ListScreen%28%7B%20navigation%20%7D%29%20%7B%0A%20%20return%20%28%0A%20%20%20%20%3CView%20style%3D%7B%7B%20flex%3A%201%2C%20padding%3A%2016%2C%20gap%3A%208%20%7D%7D%3E%0A%20%20%20%20%20%20%7BBOOKS.map%28%28b%29%20%3D%3E%20%28%0A%20%20%20%20%20%20%20%20%3CButton%0A%20%20%20%20%20%20%20%20%20%20key%3D%7Bb.id%7D%0A%20%20%20%20%20%20%20%20%20%20title%3D%7Bb.title%7D%0A%20%20%20%20%20%20%20%20%20%20onPress%3D%7B%28%29%20%3D%3E%20navigation.navigate%28%22Detail%22%2C%20%7B%20id%3A%20b.id%2C%20title%3A%20b.title%20%7D%29%7D%0A%20%20%20%20%20%20%20%20%2F%3E%0A%20%20%20%20%20%20%29%29%7D%0A%20%20%20%20%3C%2FView%3E%0A%20%20%29%3B%0A%7D%0A%0Afunction%20DetailScreen%28%7B%20route%20%7D%29%20%7B%0A%20%20const%20%7B%20id%20%7D%20%3D%20route.params%20%3F%3F%20%7B%7D%3B%0A%20%20const%20book%20%3D%20BOOKS.find%28%28b%29%20%3D%3E%20b.id%20%3D%3D%3D%20id%29%3B%0A%20%20if%20%28%21book%29%20return%20%3CText%3EBook%20not%20found%3C%2FText%3E%3B%0A%20%20return%20%28%0A%20%20%20%20%3CView%20style%3D%7B%7B%20flex%3A%201%2C%20padding%3A%2016%20%7D%7D%3E%0A%20%20%20%20%20%20%3CText%20style%3D%7B%7B%20fontSize%3A%2020%20%7D%7D%3E%7Bbook.title%7D%3C%2FText%3E%0A%20%20%20%20%3C%2FView%3E%0A%20%20%29%3B%0A%7D%0A%0Afunction%20SaveButton%28%7B%20id%20%7D%29%20%7B%0A%20%20const%20%5Bsaved%2C%20setSaved%5D%20%3D%20useAtom%28savedAtom%29%3B%0A%20%20const%20isSaved%20%3D%20saved.includes%28id%29%3B%0A%20%20return%20%28%0A%20%20%20%20%3CButton%0A%20%20%20%20%20%20title%3D%7BisSaved%20%3F%20%22Unsave%22%20%3A%20%22Save%22%7D%0A%20%20%20%20%20%20onPress%3D%7B%28%29%20%3D%3E%0A%20%20%20%20%20%20%20%20setSaved%28%28prev%29%20%3D%3E%20%28prev.includes%28id%29%20%3F%20prev.filter%28%28s%29%20%3D%3E%20s%20%21%3D%3D%20id%29%20%3A%20%5B...prev%2C%20id%5D%29%29%0A%20%20%20%20%20%20%7D%0A%20%20%20%20%2F%3E%0A%20%20%29%3B%0A%7D%0A%0Afunction%20BooksStack%28%29%20%7B%0A%20%20return%20%28%0A%20%20%20%20%3CStack.Navigator%3E%0A%20%20%20%20%20%20%3CStack.Screen%20name%3D%22List%22%20component%3D%7BListScreen%7D%20options%3D%7B%7B%20title%3A%20%22My%20Books%22%20%7D%7D%20%2F%3E%0A%20%20%20%20%20%20%3CStack.Screen%0A%20%20%20%20%20%20%20%20name%3D%22Detail%22%0A%20%20%20%20%20%20%20%20component%3D%7BDetailScreen%7D%0A%20%20%20%20%20%20%20%20options%3D%7B%28%7B%20route%20%7D%29%20%3D%3E%20%28%7B%0A%20%20%20%20%20%20%20%20%20%20title%3A%20route.params%3F.title%20%3F%3F%20%22Detail%22%2C%0A%20%20%20%20%20%20%20%20%20%20headerRight%3A%20%28%29%20%3D%3E%20%3CSaveButton%20id%3D%7Broute.params%3F.id%7D%20%2F%3E%2C%0A%20%20%20%20%20%20%20%20%7D%29%7D%0A%20%20%20%20%20%20%2F%3E%0A%20%20%20%20%3C%2FStack.Navigator%3E%0A%20%20%29%3B%0A%7D%0A%0Afunction%20SavedScreen%28%29%20%7B%0A%20%20const%20%5Bsaved%5D%20%3D%20useAtom%28savedAtom%29%3B%0A%20%20const%20items%20%3D%20BOOKS.filter%28%28b%29%20%3D%3E%20saved.includes%28b.id%29%29%3B%0A%20%20return%20%28%0A%20%20%20%20%3CView%20style%3D%7B%7B%20flex%3A%201%2C%20padding%3A%2016%20%7D%7D%3E%0A%20%20%20%20%20%20%7Bitems.length%20%3D%3D%3D%200%20%3F%20%3CText%3ENothing%20saved%20yet%3C%2FText%3E%20%3A%20items.map%28%28b%29%20%3D%3E%20%3CText%20key%3D%7Bb.id%7D%3E%7Bb.title%7D%3C%2FText%3E%29%7D%0A%20%20%20%20%3C%2FView%3E%0A%20%20%29%3B%0A%7D%0A%0Aexport%20default%20function%20App%28%29%20%7B%0A%20%20return%20%28%0A%20%20%20%20%3CNavigationContainer%3E%0A%20%20%20%20%20%20%3CTab.Navigator%3E%0A%20%20%20%20%20%20%20%20%3CTab.Screen%0A%20%20%20%20%20%20%20%20%20%20name%3D%22Books%22%0A%20%20%20%20%20%20%20%20%20%20component%3D%7BBooksStack%7D%0A%20%20%20%20%20%20%20%20%20%20options%3D%7B%7B%0A%20%20%20%20%20%20%20%20%20%20%20%20headerShown%3A%20false%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20tabBarIcon%3A%20%28%7B%20color%2C%20size%20%7D%29%20%3D%3E%20%3CIonicons%20name%3D%22book%22%20color%3D%7Bcolor%7D%20size%3D%7Bsize%7D%20%2F%3E%2C%0A%20%20%20%20%20%20%20%20%20%20%7D%7D%0A%20%20%20%20%20%20%20%20%2F%3E%0A%20%20%20%20%20%20%20%20%3CTab.Screen%0A%20%20%20%20%20%20%20%20%20%20name%3D%22Saved%22%0A%20%20%20%20%20%20%20%20%20%20component%3D%7BSavedScreen%7D%0A%20%20%20%20%20%20%20%20%20%20options%3D%7B%7B%0A%20%20%20%20%20%20%20%20%20%20%20%20tabBarIcon%3A%20%28%7B%20color%2C%20size%20%7D%29%20%3D%3E%20%3CIonicons%20name%3D%22bookmark%22%20color%3D%7Bcolor%7D%20size%3D%7Bsize%7D%20%2F%3E%2C%0A%20%20%20%20%20%20%20%20%20%20%7D%7D%0A%20%20%20%20%20%20%20%20%2F%3E%0A%20%20%20%20%20%20%3C%2FTab.Navigator%3E%0A%20%20%20%20%3C%2FNavigationContainer%3E%0A%20%20%29%3B%0A%7D%0A&dependencies=%40expo%2Fvector-icons%40%5E15.0.3%2C%40react-navigation%2Fbottom-tabs%40%5E7.0.0%2C%40react-navigation%2Fnative%40%5E7.0.0%2C%40react-navigation%2Fnative-stack%40%5E7.0.0%2C%40types%2Freact%40%2A%2Cjotai%40%2A%2Creact-native-safe-area-context%40~5.6.0%2Creact-native-screens%40~4.16.0)** (SDK 54, 필요한 패키지 자동 포함) <button class="snack-embed" type="button">👀 여기서 결과 보기</button>

**해설**: Tabs → Stack 패턴이라 Detail에서도 탭 바가 보여요. Books 탭에 `headerShown: false`를 줘서 헤더가 하나만 보여요. SaveButton과 SavedScreen은 서로 props를 주고받지 않고 `savedAtom`만 같이 봐요. `items.length === 0 ? ... : ...` 은 3주차의 `0` 함정을 피하는 방법이에요.
