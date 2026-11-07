# Week 3. 스타일과 레이아웃: StyleSheet, Flexbox, Platform, 공통 컴포넌트

> 이 노트 읽는 법: **📘/💻/🧪 원문**(영어 그대로) 바로 밑에 **🇰🇷 한글 해설**이 있어요. 코드 밑의 **▶ Snack에서 바로 실행하기**를 누르면 그 코드가 Expo Snack에서 열려요.

## 0. 이번 주 한눈에 보기

이번 주는 앱을 **예쁘게, 그리고 화면 크기에 맞게 배치**하는 법을 배워요. React Native에는 CSS 파일이 없어요. 대신 **JavaScript 객체**로 스타일을 써요.

| CSS(웹) | React Native | 차이 |
| --- | --- | --- |
| `font-size: 20px;` | `fontSize: 20` | **camelCase**, 단위(px) 없이 **숫자** |
| `.title { ... }` 클래스 | `StyleSheet.create({ title: {...} })` | 이름 붙인 스타일 객체 |
| `class="a b"` | `style={[styles.a, styles.b]}` | 배열, **뒤에 있는 게 이김** |
| `flex-direction` 기본 `row` | `flexDirection` 기본 **`"column"`** | 시험 단골! |
| `flex: 1 1 auto` | `flex: 1` | **숫자 하나**만 |
| div 색이 안쪽 글자로 상속 | View는 상속 **안 함** | Text 안의 Text만 상속 |

Flexbox 두 축, 이것만 기억하면 레이아웃 문제 절반은 풀려요.
- **`justifyContent`** = **주축(main axis)** 정렬. 주축은 `flexDirection` 방향.
- **`alignItems`** = **교차축(cross axis)** 정렬. 주축의 수직 방향.
- `flexDirection`을 바꾸면 **두 축도 바뀐다.**


## 목차

- 1. 📘 코스노트: React Native StyleSheets
- 2. 📘 코스노트: Common React Native Components
- 3. 💻 인클래스 예제: Week 3.1 - Notes and Examples
- 4. 🧪 Lab: Lab 3 - Layout and Styling
- ✅ Week 3 시험 대비 체크리스트


---

## 1. 📘 코스노트: React Native StyleSheets

> 원문 출처: https://seneca-ictoer.github.io/WEB530/C-Styling/stylesheets

When building web pages, we use CSS StyleSheets to describe the presentation of elements. We will continue this trend as we work with React Native applications. By moving styles out of the JSX, you will keep the code concise and easier to understand.

Check out the following example. We are building a new StyleSheet by passing a JavaScript object to the `StyleSheet.create()` function. The stylesheet contains two styles: `container` and `title`. To assign a style to the appropriate component, we set the `style` property, for example `<View style={styles.container}>`.

```jsx
import { View, Text, StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: '#eaeaea',
  },
  title: {
    marginTop: 16,
    paddingVertical: 8,
    borderWidth: 4,
    borderColor: '#20232a',
    borderRadius: 6,
    backgroundColor: '#61dafb',
    color: '#20232a',
    textAlign: 'center',
    fontSize: 30,
    fontWeight: 'bold',
  },
});

export default function App() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>React Native</Text>
    </View>
  );
}
```

▶ **[Snack에서 바로 실행하기](https://snack.expo.dev/?name=WEB530%20W3%20React%20Native%20StyleSheets&platform=web&sdkVersion=54.0.0&code=import%20%7B%20View%2C%20Text%2C%20StyleSheet%20%7D%20from%20%27react-native%27%3B%0A%0Aconst%20styles%20%3D%20StyleSheet.create%28%7B%0A%20%20container%3A%20%7B%0A%20%20%20%20flex%3A%201%2C%0A%20%20%20%20padding%3A%2024%2C%0A%20%20%20%20backgroundColor%3A%20%27%23eaeaea%27%2C%0A%20%20%7D%2C%0A%20%20title%3A%20%7B%0A%20%20%20%20marginTop%3A%2016%2C%0A%20%20%20%20paddingVertical%3A%208%2C%0A%20%20%20%20borderWidth%3A%204%2C%0A%20%20%20%20borderColor%3A%20%27%2320232a%27%2C%0A%20%20%20%20borderRadius%3A%206%2C%0A%20%20%20%20backgroundColor%3A%20%27%2361dafb%27%2C%0A%20%20%20%20color%3A%20%27%2320232a%27%2C%0A%20%20%20%20textAlign%3A%20%27center%27%2C%0A%20%20%20%20fontSize%3A%2030%2C%0A%20%20%20%20fontWeight%3A%20%27bold%27%2C%0A%20%20%7D%2C%0A%7D%29%3B%0A%0Aexport%20default%20function%20App%28%29%20%7B%0A%20%20return%20%28%0A%20%20%20%20%3CView%20style%3D%7Bstyles.container%7D%3E%0A%20%20%20%20%20%20%3CText%20style%3D%7Bstyles.title%7D%3EReact%20Native%3C%2FText%3E%0A%20%20%20%20%3C%2FView%3E%0A%20%20%29%3B%0A%7D%0A)** (SDK 54, 필요한 패키지 자동 포함)


![Styled Container](data:image/png;base64...)


Depending on the platform, we may need to fine-tune our styles. For example, you may need to apply different padding to prevent components from rendering below the status bar of the device. React Native contains a Platform interface that allows us to learn about the underlying OS. Let's take advantage of Platform and rewrite the container style so that it renders a different UI depending on the device used.

```jsx
import { View, Text, StyleSheet, Platform, StatusBar } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#eaeaea',
    ...Platform.select({
      ios: { padding: 20 },
      android: { paddingTop: StatusBar.currentHeight },
    }),
  },
  // ...
});
```

On android devices, we can determine the height of the status bar by reading from `StatusBar.currentHeight` but this is not possible on iOS. To workaround the differences in the platform, we use `Platform.select()` to add conditional styles that render different interfaces on different devices.

**🇰🇷 한글 해설**

**StyleSheet 기본**
- 웹에서 CSS를 HTML 밖으로 빼듯이, RN에서도 스타일을 JSX 밖으로 빼서 코드를 깔끔하게 해요.
- `StyleSheet.create({ container: {...}, title: {...} })` 에 **JavaScript 객체**를 넘겨요.
- 적용은 `<View style={styles.container}>` 처럼 `style` prop에.

첫 예제의 속성들: `flex: 1`(화면 채우기), `padding`, `paddingVertical`(위아래 패딩만), `borderWidth`, `borderColor`, `borderRadius`(둥근 모서리), `textAlign`, `fontWeight: 'bold'`(문자열!). `'#eaeaea'` 같은 색도 문자열.

**Platform.select() 예제**
- 폰마다 상단 상태바(시계 있는 줄) 높이가 달라서, 플랫폼별로 패딩을 다르게 줄 때가 있어요.
- `...Platform.select({ ios: {...}, android: {...} })` → 지금 기기에 맞는 객체를 골라서 `...`(spread)로 스타일 안에 **펼쳐 넣어요**.
- Android는 `StatusBar.currentHeight`로 상태바 높이를 알 수 있지만, iOS는 이 값이 없어요(undefined). 그래서 iOS는 고정 패딩 20.

#### 📘 Building responsive layouts using Flexbox

Before the flexbox layout model was introduced, approaches used to build layouts were hacky and prone to errors. Flexbox provides a simple and elegant way to build layouts by abstracting many of the properties that are required in order to make the layout work.

The Flexible Layout module (or flexbox) is a box model that allows a one-dimensional layout method for arranging items in rows or columns. Items grow to fill additional space or shrink to fit into smaller spaces.

The main idea is to give a container the ability to alter its items' width, height and order to best fill the available space. The flexbox layout is direction-agnostic, as opposed to regular layouts, and works very well for components of an application.

If you haven't had an opportunity to work with Flexbox, check out the [Complete Guide to Flexbox](https://css-tricks.com/snippets/css/a-guide-to-flexbox/). The article is a great place to start learning to build flexible layouts.

Let's implement a simple layout with three sections that flex from the top to bottom of the screen. We use `flex` as a short hand for `flex-grow`, `flex-shrink`, and `flex-basis`. Using this shorthand is recommended rather than setting individual properties since it will set other values intelligently.

As you review the example, you may notice that the `flexDirection` is set to `column` yet our output shows three rows. We use `column` because that is the direction in which the items will be rendered. That is, they are contained vertically, in a column.

It is important to realize that the output will look correct regardless of the device orientation. When a device is rotated the UI will adjust appropriately.

```jsx
import { View, Text, StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    padding: 10,
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'space-around',
  },

  cell: {
    flexGrow: 1,
    alignSelf: 'stretch',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'lightgray',
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: 'darkslategray',
  },

  cellText: {
    color: 'darkslategray',
    fontWeight: 'bold',
  },
});

export default function App() {
  return (
    <View style={styles.container}>
      <View style={styles.cell}>
        <Text style={styles.cellText}>Top</Text>
      </View>
      <View style={styles.cell}>
        <Text style={styles.cellText}>Middle</Text>
      </View>
      <View style={styles.cell}>
        <Text style={styles.cellText}>Bottom</Text>
      </View>
    </View>
  );
}
```

▶ **[Snack에서 바로 실행하기](https://snack.expo.dev/?name=WEB530%20W3%20%20-%20Building%20responsive%20layouts%20using%20Flexbox&platform=web&sdkVersion=54.0.0&code=import%20%7B%20View%2C%20Text%2C%20StyleSheet%20%7D%20from%20%27react-native%27%3B%0A%0Aconst%20styles%20%3D%20StyleSheet.create%28%7B%0A%20%20container%3A%20%7B%0A%20%20%20%20padding%3A%2010%2C%0A%20%20%20%20flex%3A%201%2C%0A%20%20%20%20flexDirection%3A%20%27column%27%2C%0A%20%20%20%20justifyContent%3A%20%27space-around%27%2C%0A%20%20%7D%2C%0A%0A%20%20cell%3A%20%7B%0A%20%20%20%20flexGrow%3A%201%2C%0A%20%20%20%20alignSelf%3A%20%27stretch%27%2C%0A%20%20%20%20alignItems%3A%20%27center%27%2C%0A%20%20%20%20justifyContent%3A%20%27center%27%2C%0A%20%20%20%20backgroundColor%3A%20%27lightgray%27%2C%0A%20%20%20%20borderWidth%3A%201%2C%0A%20%20%20%20borderStyle%3A%20%27dashed%27%2C%0A%20%20%20%20borderColor%3A%20%27darkslategray%27%2C%0A%20%20%7D%2C%0A%0A%20%20cellText%3A%20%7B%0A%20%20%20%20color%3A%20%27darkslategray%27%2C%0A%20%20%20%20fontWeight%3A%20%27bold%27%2C%0A%20%20%7D%2C%0A%7D%29%3B%0A%0Aexport%20default%20function%20App%28%29%20%7B%0A%20%20return%20%28%0A%20%20%20%20%3CView%20style%3D%7Bstyles.container%7D%3E%0A%20%20%20%20%20%20%3CView%20style%3D%7Bstyles.cell%7D%3E%0A%20%20%20%20%20%20%20%20%3CText%20style%3D%7Bstyles.cellText%7D%3ETop%3C%2FText%3E%0A%20%20%20%20%20%20%3C%2FView%3E%0A%20%20%20%20%20%20%3CView%20style%3D%7Bstyles.cell%7D%3E%0A%20%20%20%20%20%20%20%20%3CText%20style%3D%7Bstyles.cellText%7D%3EMiddle%3C%2FText%3E%0A%20%20%20%20%20%20%3C%2FView%3E%0A%20%20%20%20%20%20%3CView%20style%3D%7Bstyles.cell%7D%3E%0A%20%20%20%20%20%20%20%20%3CText%20style%3D%7Bstyles.cellText%7D%3EBottom%3C%2FText%3E%0A%20%20%20%20%20%20%3C%2FView%3E%0A%20%20%20%20%3C%2FView%3E%0A%20%20%29%3B%0A%7D%0A)** (SDK 54, 필요한 패키지 자동 포함)


![Flexbox Column](https://seneca-ictoer.github.io/WEB530/assets/images/ex2-flex-col-c065189e92ff284af15d6c251358b546.png)


If we change the `flexDirection` to `row` instead, we get the following output. Try it in the example above: run it, then change `'column'` to `'row'`.

![Flexbox Row](https://seneca-ictoer.github.io/WEB530/assets/images/ex2-flex-row-804d467c17e5b512d95419bb39bb351c.png)

**🇰🇷 한글 해설**

**Flexbox**: 아이템을 **한 방향(행 또는 열)** 으로 배치하는 **1차원** 레이아웃 방식. 공간이 남으면 늘어나고(grow), 모자라면 줄어들어요(shrink).

원문 포인트:
- `flex`는 `flex-grow`, `flex-shrink`, `flex-basis`의 **줄임말**. 개별 속성보다 `flex`를 쓰라고 권장.
- **헷갈리는 포인트**: `flexDirection: 'column'`인데 결과는 "세 줄(rows)"처럼 보여요. column은 "아이템이 **세로로 쌓이는 방향**"이라는 뜻이라서, 결과적으로 위아래 세 칸이 생기는 거예요.
- 기기를 돌려도(가로/세로) 자동으로 맞춰져요. 이게 **반응형(responsive)**.

예제 해설:
- `container`: `justifyContent: 'space-around'` → 주축(세로)으로 아이템 주변에 균등한 여백.
- `cell`: `flexGrow: 1` → 남는 공간을 똑같이 나눠 가짐. `alignSelf: 'stretch'` → 나 혼자 가로로 꽉 채움. `alignItems/justifyContent: 'center'` → 안의 글자를 가운데로.
- `'column'`을 `'row'`로 바꾸면 Top/Middle/Bottom이 **가로로 나란히** 세 칸이 돼요. 직접 바꿔 보세요!


---

## 2. 📘 코스노트: Common React Native Components

> 원문 출처: https://seneca-ictoer.github.io/WEB530/C-Styling/common-comp

### 📘 View

This is the most fundamental component for building a UI. A `View` is a container that maps directly to the native view equivalent: `UIView` on iOS, `android.View` on Android, or `<div>` in a browser. Views can be styled and can hold other views and components.

Learn more: [View](https://reactnative.dev/docs/view)

**🇰🇷 한글 해설**

**View** = 가장 기본 상자(컨테이너). iOS의 `UIView`, Android의 `android.View`, 웹의 `<div>`에 해당. 스타일 가능, 다른 컴포넌트를 담을 수 있어요.

### 📘 Text

A component for displaying text. Like the `View` component, you can style and nest a `Text` component. In fact, nesting is an easy way to display formatted text rather than annotating ranges of a string with specific formatting (like bold or colours). Inner `Text` components will inherit styles (such as fontFamily) from parent components.

Unlike most other components, `Text` is unique relative to layout. Everything inside a `<Text>` block no longer uses the Flexbox layout. Instead, it uses a text layout, meaning that nested `Text` components are no longer rectangles, but wrap when they see the end of the line.

Learn more: [Text](https://reactnative.dev/docs/text)

**🇰🇷 한글 해설**

**Text** = 글자 표시. 두 가지가 시험 포인트예요.
1. **중첩(nesting)**: Text 안에 Text를 넣어 일부만 굵게/색깔. 안쪽 Text는 바깥 Text의 스타일(fontFamily 등)을 **상속**해요.
2. **레이아웃이 특별함**: `<Text>` 안은 Flexbox가 아니라 **텍스트 레이아웃**. 안쪽 Text들은 사각형 상자가 아니라 글자처럼 줄 끝에서 **줄바꿈(wrap)** 돼요.

### 📘 Button

A basic button component that renders correctly on any platform. When clicked, a button will fire the `onPress` event. Although the styling is not completely customizable, buttons do support standard states such as the `disabled` state.

Learn more: [Button](https://reactnative.dev/docs/button)

**🇰🇷 한글 해설**

**Button** = 플랫폼마다 알맞게 그려지는 기본 버튼. 누르면 `onPress`. 스타일을 **완전히 바꿀 수는 없어요**(style prop 없음). `disabled` 상태는 지원.

### 📘 TextInput

A component for capturing text from the user. Using properties, a `TextInput` can be configured to provide several features, such as auto-correction, auto-capitalization, placeholder text, multi-line text, and different keyboard types, such as a numeric keypad or email keyboard.

When the user modifies the contents of a `TextInput`, the `onChangeText` event is fired. Other common events include the `onSubmitEditing` and `onFocus` events.

Learn more: [TextInput](https://reactnative.dev/docs/textinput)

**🇰🇷 한글 해설**

**TextInput** = 글자 입력창. props로 자동 수정(autoCorrect), 자동 대문자(autoCapitalize), placeholder, 여러 줄(multiline), 키보드 종류(숫자, 이메일 등)를 설정. 이벤트: `onChangeText`(글자 바뀔 때), `onSubmitEditing`(엔터/완료 누를 때), `onFocus`(입력창 선택될 때).

### 📘 Switch

Rendered as a toggle, this component provides an easy way to represent Boolean values. This is a controlled component and therefore the programmer is responsible for updating a property to reflect the correct state (toggled or not). By implementing a handler for the `onValueChange` event, you can set the `value` to keep the toggle synchronized with the value.

Learn more: [Switch](https://reactnative.dev/docs/switch)

**🇰🇷 한글 해설**

**Switch** = on/off 토글. **Controlled component(제어 컴포넌트)** 라서 프로그래머가 직접 state를 업데이트해야 움직여요. `onValueChange`에서 state를 바꾸고 `value`에 그 state를 넣어야 동기화돼요. 안 하면 손가락으로 밀어도 다시 튕겨 돌아가요.

### 📘 FlatList & SectionList

A component for rendering lists. A `FlatList` supports "Pull to Refresh" and "Scroll loading". You can even group list items under headings by using a `<SectionList>`.

Learn More: [FlatList](https://reactnative.dev/docs/flatlist), [SectionList](https://reactnative.dev/docs/sectionlist)

**🇰🇷 한글 해설**

**FlatList** = 목록 전용 컴포넌트. Pull to Refresh(당겨서 새로고침), Scroll loading 지원. **SectionList**는 제목별로 묶은 목록. 5주차에 자세히 배워요.

### 📘 Image

Renders an image on the UI. In order to be useful, you must first provide the image data to the component. There are two ways to load the image data, via the network (using a URI) or by providing the data to the component. If you have the image stored as a file within your application, you can use `require()` to use it as an image source.

It is worth noting that an `Image` loaded from the network will not display unless the width and height style properties are set. (Images loaded with `require()` already know their size.) There is also a `resizeMode` property in case you need to scale the image so that it fits within the dimensions of the actual component.

Learn More: [Image](https://reactnative.dev/docs/image)

```jsx
import React from 'react';
import { View, Image, StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    paddingTop: 50,
  },
  image: {
    width: 50,
    height: 50,
  },
});

const MyImageComponent = () => {
  return (
    <View style={styles.container}>
      <Image style={styles.image} source={{ uri: 'https://reactnative.dev/img/tiny_logo.png' }} />
      <Image
        style={styles.image}
        source={{
          uri: 'data:image/png;base64, iVBORw0KGgoAAAANSUhEUgAAADMAAAAzCAYAAAA6oTAqAAAAEXRFWHRTb2Z0d2FyZQBwbmdjcnVzaEB1SfMAAABQSURBVGje7dSxCQBACARB+2/ab8BEeQNhFi6WSYzYLYudDQYGBgYGBgYGBgYGBgYGBgZmcvDqYGBgmhivGQYGBgYGBgYGBgYGBgYGBgbmQw+P/eMrC5UTVAAAAABJRU5ErkJggg==',
        }}
      />
    </View>
  );
};

export default function App() {
  return <MyImageComponent />;
}
```

▶ **[Snack에서 바로 실행하기](https://snack.expo.dev/?name=WEB530%20W3%20Image&platform=web&sdkVersion=54.0.0&code=import%20React%20from%20%27react%27%3B%0Aimport%20%7B%20View%2C%20Image%2C%20StyleSheet%20%7D%20from%20%27react-native%27%3B%0A%0Aconst%20styles%20%3D%20StyleSheet.create%28%7B%0A%20%20container%3A%20%7B%0A%20%20%20%20paddingTop%3A%2050%2C%0A%20%20%7D%2C%0A%20%20image%3A%20%7B%0A%20%20%20%20width%3A%2050%2C%0A%20%20%20%20height%3A%2050%2C%0A%20%20%7D%2C%0A%7D%29%3B%0A%0Aconst%20MyImageComponent%20%3D%20%28%29%20%3D%3E%20%7B%0A%20%20return%20%28%0A%20%20%20%20%3CView%20style%3D%7Bstyles.container%7D%3E%0A%20%20%20%20%20%20%3CImage%20style%3D%7Bstyles.image%7D%20source%3D%7B%7B%20uri%3A%20%27https%3A%2F%2Freactnative.dev%2Fimg%2Ftiny_logo.png%27%20%7D%7D%20%2F%3E%0A%20%20%20%20%20%20%3CImage%0A%20%20%20%20%20%20%20%20style%3D%7Bstyles.image%7D%0A%20%20%20%20%20%20%20%20source%3D%7B%7B%0A%20%20%20%20%20%20%20%20%20%20uri%3A%20%27data%3Aimage%2Fpng%3Bbase64%2C%20iVBORw0KGgoAAAANSUhEUgAAADMAAAAzCAYAAAA6oTAqAAAAEXRFWHRTb2Z0d2FyZQBwbmdjcnVzaEB1SfMAAABQSURBVGje7dSxCQBACARB%2B2%2Fab8BEeQNhFi6WSYzYLYudDQYGBgYGBgYGBgYGBgYGBgZmcvDqYGBgmhivGQYGBgYGBgYGBgYGBgYGBgbmQw%2BP%2FeMrC5UTVAAAAABJRU5ErkJggg%3D%3D%27%2C%0A%20%20%20%20%20%20%20%20%7D%7D%0A%20%20%20%20%20%20%2F%3E%0A%20%20%20%20%3C%2FView%3E%0A%20%20%29%3B%0A%7D%3B%0A%0Aexport%20default%20function%20App%28%29%20%7B%0A%20%20return%20%3CMyImageComponent%20%2F%3E%3B%0A%7D%0A)** (SDK 54, 필요한 패키지 자동 포함)


![Images](https://seneca-ictoer.github.io/WEB530/assets/images/ex3-images-9ac48219a706766e312c55b3e69686dc.png)


**🇰🇷 한글 해설**

**Image** 핵심 3가지:
1. 이미지 불러오는 2가지 방법: 네트워크 `source={{ uri: 'https://...' }}` / 앱 안의 파일 `source={require('./a.png')}`.
2. **네트워크 이미지는 width/height를 꼭 줘야** 보여요. (require 이미지는 크기를 이미 알아서 생략 가능)
3. `resizeMode`로 상자 크기에 맞게 늘리거나 자르는 방식 조절.

예제의 두 번째 이미지는 `data:image/png;base64,...` **data URI**예요. 이미지 데이터를 글자로 직접 넣은 방식.

### 📘 Icons

One more thing about images ... it is possible to use icon fonts such as FontAwesome directly in your React Native apps. Expo projects (and Snack) include the `@expo/vector-icons` package, which bundles many popular icon sets. Import the set you want and pass the icon's `name`, `size` and `color`. You can search every available icon in the [icon directory](https://icons.expo.fyi/).

```jsx
import { View, StyleSheet } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';

export default function App() {
  return (
    <View style={styles.container}>
      <FontAwesome name="home" size={32} color="#20232a" />
      <FontAwesome name="heart" size={32} color="#e53935" />
      <FontAwesome name="star" size={32} color="#fbc02d" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    gap: 24,
    paddingTop: 50,
    paddingLeft: 24,
  },
});
```

▶ **[Snack에서 바로 실행하기](https://snack.expo.dev/?name=WEB530%20W3%20Icons&platform=web&sdkVersion=54.0.0&code=import%20%7B%20View%2C%20StyleSheet%20%7D%20from%20%27react-native%27%3B%0Aimport%20%7B%20FontAwesome%20%7D%20from%20%27%40expo%2Fvector-icons%27%3B%0A%0Aexport%20default%20function%20App%28%29%20%7B%0A%20%20return%20%28%0A%20%20%20%20%3CView%20style%3D%7Bstyles.container%7D%3E%0A%20%20%20%20%20%20%3CFontAwesome%20name%3D%22home%22%20size%3D%7B32%7D%20color%3D%22%2320232a%22%20%2F%3E%0A%20%20%20%20%20%20%3CFontAwesome%20name%3D%22heart%22%20size%3D%7B32%7D%20color%3D%22%23e53935%22%20%2F%3E%0A%20%20%20%20%20%20%3CFontAwesome%20name%3D%22star%22%20size%3D%7B32%7D%20color%3D%22%23fbc02d%22%20%2F%3E%0A%20%20%20%20%3C%2FView%3E%0A%20%20%29%3B%0A%7D%0A%0Aconst%20styles%20%3D%20StyleSheet.create%28%7B%0A%20%20container%3A%20%7B%0A%20%20%20%20flexDirection%3A%20%27row%27%2C%0A%20%20%20%20gap%3A%2024%2C%0A%20%20%20%20paddingTop%3A%2050%2C%0A%20%20%20%20paddingLeft%3A%2024%2C%0A%20%20%7D%2C%0A%7D%29%3B%0A&dependencies=%40expo%2Fvector-icons%40%5E15.0.3)** (SDK 54, 필요한 패키지 자동 포함)



**🇰🇷 한글 해설**

**아이콘**: Expo(그리고 Snack)에는 `@expo/vector-icons`가 기본으로 들어 있어요. `import { FontAwesome } from '@expo/vector-icons';` 하고 `<FontAwesome name="home" size={32} color="#20232a" />` 처럼 이름, 크기, 색만 주면 돼요. 아이콘 이름은 https://icons.expo.fyi 에서 검색. 4주차 탭 아이콘에서 다시 써요.

예제의 `gap: 24`는 자식들 사이 간격이에요.


---

## 3. 💻 인클래스 예제: Week 3.1 - Notes and Examples

> 원문 출처: github.com/nick-romanidis/web530-2267-nsa  week-03.1-notes.md

### 💻 React Native Playground

React Native Playground (Snack)
_Use this for the examples. Modify App.js_
(https://snack.expo.dev)

**🇰🇷 한글 해설**

Snack 그대로 사용.

### 💻 Example: Inline Styles

- React Native does not use CSS files.
- Styles are JavaScript objects passed to the `style` prop.
- They look like CSS, but property names are camelCase (`fontSize`, not `font-size`) and sizes are plain numbers, not `px`.
- Show a `View` and a `Text` styled inline.

```jsx
import { View, Text } from "react-native";

export default function MyApp() {
  return (
    <View style={{ padding: 20, marginTop: 100 }}>
      <Text style={{ fontSize: 24, color: "blue" }}>Hello Styles!</Text>
    </View>
  );
}
```

▶ **[Snack에서 바로 실행하기](https://snack.expo.dev/?name=WEB530%20W3%20Example%3A%20Inline%20Styles&platform=web&sdkVersion=54.0.0&code=import%20%7B%20View%2C%20Text%20%7D%20from%20%22react-native%22%3B%0A%0Aexport%20default%20function%20MyApp%28%29%20%7B%0A%20%20return%20%28%0A%20%20%20%20%3CView%20style%3D%7B%7B%20padding%3A%2020%2C%20marginTop%3A%20100%20%7D%7D%3E%0A%20%20%20%20%20%20%3CText%20style%3D%7B%7B%20fontSize%3A%2024%2C%20color%3A%20%22blue%22%20%7D%7D%3EHello%20Styles%21%3C%2FText%3E%0A%20%20%20%20%3C%2FView%3E%0A%20%20%29%3B%0A%7D%0A)** (SDK 54, 필요한 패키지 자동 포함)

- Notice the double braces. The outer `{ }` switches JSX into JavaScript, the inner `{ }` is the style object.
- Inline styles are fine for quick demos, but they get messy fast and cannot be reused.

**🇰🇷 한글 해설**

**코드 해설**
- RN은 CSS 파일이 없어요. 스타일 = `style` prop에 넘기는 **JS 객체**.
- `fontSize`(camelCase), `24`(px 없는 숫자), `color: "blue"`(문자열).
- `style={{ ... }}` **이중 중괄호**: 바깥 `{}` = "여기부터 JS", 안쪽 `{}` = 스타일 객체. (1주차에 배운 거 그대로)
- 인라인 스타일은 빠른 테스트용. 길어지면 지저분하고 **재사용 불가**.

### 💻 Example: StyleSheet.create()

- Move the styles into a `StyleSheet` at the bottom of the file.
- Each key (`container`, `title`) is a named style you can reuse.

```jsx
import { View, Text, StyleSheet } from "react-native";

export default function MyApp() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Hello Styles!</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    marginTop: 100,
    backgroundColor: "#eee",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
  },
});
```

▶ **[Snack에서 바로 실행하기](https://snack.expo.dev/?name=WEB530%20W3%20Example%3A%20StyleSheet.create%28%29&platform=web&sdkVersion=54.0.0&code=import%20%7B%20View%2C%20Text%2C%20StyleSheet%20%7D%20from%20%22react-native%22%3B%0A%0Aexport%20default%20function%20MyApp%28%29%20%7B%0A%20%20return%20%28%0A%20%20%20%20%3CView%20style%3D%7Bstyles.container%7D%3E%0A%20%20%20%20%20%20%3CText%20style%3D%7Bstyles.title%7D%3EHello%20Styles%21%3C%2FText%3E%0A%20%20%20%20%3C%2FView%3E%0A%20%20%29%3B%0A%7D%0A%0Aconst%20styles%20%3D%20StyleSheet.create%28%7B%0A%20%20container%3A%20%7B%0A%20%20%20%20padding%3A%2020%2C%0A%20%20%20%20marginTop%3A%20100%2C%0A%20%20%20%20backgroundColor%3A%20%22%23eee%22%2C%0A%20%20%7D%2C%0A%20%20title%3A%20%7B%0A%20%20%20%20fontSize%3A%2028%2C%0A%20%20%20%20fontWeight%3A%20%22bold%22%2C%0A%20%20%7D%2C%0A%7D%29%3B%0A)** (SDK 54, 필요한 패키지 자동 포함)

- It keeps the JSX readable and puts all the styling in one place.
- A named style can be reused by as many components as you like.
- Show that a typo is silently ignored. Change `fontSize` to `fontSise`: there is no warning, the title just goes back to the default size. Older versions of React Native checked style names here, but that check was removed. TypeScript catches these typos, which we cover later in the course.
- `styles` is used before it is declared. That works because `MyApp` does not run until after the whole file has loaded.

**🇰🇷 한글 해설**

**코드 해설**
- 스타일을 파일 **아래쪽** `StyleSheet.create`로 옮김. `container`, `title` 은 이름 붙은 스타일.
- 장점: JSX가 깔끔해지고, 스타일이 한곳에 모이고, 여러 컴포넌트에서 **재사용**.
- **함정 실험**: `fontSize`를 `fontSise`로 오타 → **경고 없이 그냥 무시**돼요. 글자가 기본 크기로 돌아갈 뿐. (TypeScript를 쓰면 잡아 줘요.)
- `styles`를 선언 **전에** 쓰는데 왜 될까? `MyApp` 함수는 파일 전체가 로드된 **뒤에** 실행되니까요.

### 💻 Example: Layout with Flexbox

- Flexbox lays items out in one direction at a time, a row or a column.
- It solves the classic CSS headaches: centring content vertically, giving children equal widths, and making columns the same height.
- Flexbox guide: (https://css-tricks.com/snippets/css/a-guide-to-flexbox/)
- Practice: Flexbox Froggy (https://flexboxfroggy.com/)
- Start with a container holding three coloured boxes.
- The `style` prop also accepts an array. Styles are merged left to right, so later entries win.

```jsx
import { View, StyleSheet } from "react-native";

export default function MyApp() {
  return (
    <View style={styles.container}>
      <View style={[styles.box, styles.red]} />
      <View style={[styles.box, styles.green]} />
      <View style={[styles.box, styles.blue]} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 100,
    backgroundColor: "#eee",
  },
  box: {
    width: 80,
    height: 80,
  },
  red: { backgroundColor: "tomato" },
  green: { backgroundColor: "mediumseagreen" },
  blue: { backgroundColor: "dodgerblue" },
});
```

▶ **[Snack에서 바로 실행하기](https://snack.expo.dev/?name=WEB530%20W3%20Example%3A%20Layout%20with%20Flexbox&platform=web&sdkVersion=54.0.0&code=import%20%7B%20View%2C%20StyleSheet%20%7D%20from%20%22react-native%22%3B%0A%0Aexport%20default%20function%20MyApp%28%29%20%7B%0A%20%20return%20%28%0A%20%20%20%20%3CView%20style%3D%7Bstyles.container%7D%3E%0A%20%20%20%20%20%20%3CView%20style%3D%7B%5Bstyles.box%2C%20styles.red%5D%7D%20%2F%3E%0A%20%20%20%20%20%20%3CView%20style%3D%7B%5Bstyles.box%2C%20styles.green%5D%7D%20%2F%3E%0A%20%20%20%20%20%20%3CView%20style%3D%7B%5Bstyles.box%2C%20styles.blue%5D%7D%20%2F%3E%0A%20%20%20%20%3C%2FView%3E%0A%20%20%29%3B%0A%7D%0A%0Aconst%20styles%20%3D%20StyleSheet.create%28%7B%0A%20%20container%3A%20%7B%0A%20%20%20%20flex%3A%201%2C%0A%20%20%20%20marginTop%3A%20100%2C%0A%20%20%20%20backgroundColor%3A%20%22%23eee%22%2C%0A%20%20%7D%2C%0A%20%20box%3A%20%7B%0A%20%20%20%20width%3A%2080%2C%0A%20%20%20%20height%3A%2080%2C%0A%20%20%7D%2C%0A%20%20red%3A%20%7B%20backgroundColor%3A%20%22tomato%22%20%7D%2C%0A%20%20green%3A%20%7B%20backgroundColor%3A%20%22mediumseagreen%22%20%7D%2C%0A%20%20blue%3A%20%7B%20backgroundColor%3A%20%22dodgerblue%22%20%7D%2C%0A%7D%29%3B%0A)** (SDK 54, 필요한 패키지 자동 포함)

- The boxes stack top to bottom. In React Native `flexDirection` defaults to `"column"`. On the web it defaults to `"row"`.
- `flex: 1` on the container makes it fill the space it is given, which here is the rest of the screen.
- Change the direction to a row.

```jsx
  container: {
    flex: 1,
    marginTop: 100,
    backgroundColor: "#eee",
    flexDirection: "row",
  },
```

- Centre the boxes both ways.
- `justifyContent` works along the main axis (the `flexDirection`).
- `alignItems` works along the cross axis (the other direction).

```jsx
  container: {
    flex: 1,
    marginTop: 100,
    backgroundColor: "#eee",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
```

- Try `justifyContent` with `"space-between"`, `"space-around"`, and `"space-evenly"`.
- Switch `flexDirection` back to `"column"`. The boxes are still centred, but now `justifyContent` moves them up and down and `alignItems` moves them left and right. The axes swap with the direction.
- Now build equal columns. Remove the fixed `width` and give each column `flex: 1` so they share the row evenly.
- Put a different amount of text in each column. They all end up the same height, because `alignItems` defaults to `"stretch"`.

```jsx
import { View, Text, StyleSheet } from "react-native";

export default function MyApp() {
  return (
    <View style={styles.container}>
      <View style={styles.row}>
        <View style={[styles.column, styles.red]}>
          <Text>Short</Text>
        </View>
        <View style={[styles.column, styles.green]}>
          <Text>
            This column has a lot more text, but every column is still the
            same height.
          </Text>
        </View>
        <View style={[styles.column, styles.blue]}>
          <Text>Medium length</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 100,
  },
  row: {
    flexDirection: "row",
  },
  column: {
    flex: 1,
    padding: 10,
  },
  red: { backgroundColor: "tomato" },
  green: { backgroundColor: "mediumseagreen" },
  blue: { backgroundColor: "dodgerblue" },
});
```

▶ **[Snack에서 바로 실행하기](https://snack.expo.dev/?name=WEB530%20W3%20Example%3A%20Layout%20with%20Flexbox&platform=web&sdkVersion=54.0.0&code=import%20%7B%20View%2C%20Text%2C%20StyleSheet%20%7D%20from%20%22react-native%22%3B%0A%0Aexport%20default%20function%20MyApp%28%29%20%7B%0A%20%20return%20%28%0A%20%20%20%20%3CView%20style%3D%7Bstyles.container%7D%3E%0A%20%20%20%20%20%20%3CView%20style%3D%7Bstyles.row%7D%3E%0A%20%20%20%20%20%20%20%20%3CView%20style%3D%7B%5Bstyles.column%2C%20styles.red%5D%7D%3E%0A%20%20%20%20%20%20%20%20%20%20%3CText%3EShort%3C%2FText%3E%0A%20%20%20%20%20%20%20%20%3C%2FView%3E%0A%20%20%20%20%20%20%20%20%3CView%20style%3D%7B%5Bstyles.column%2C%20styles.green%5D%7D%3E%0A%20%20%20%20%20%20%20%20%20%20%3CText%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20This%20column%20has%20a%20lot%20more%20text%2C%20but%20every%20column%20is%20still%20the%0A%20%20%20%20%20%20%20%20%20%20%20%20same%20height.%0A%20%20%20%20%20%20%20%20%20%20%3C%2FText%3E%0A%20%20%20%20%20%20%20%20%3C%2FView%3E%0A%20%20%20%20%20%20%20%20%3CView%20style%3D%7B%5Bstyles.column%2C%20styles.blue%5D%7D%3E%0A%20%20%20%20%20%20%20%20%20%20%3CText%3EMedium%20length%3C%2FText%3E%0A%20%20%20%20%20%20%20%20%3C%2FView%3E%0A%20%20%20%20%20%20%3C%2FView%3E%0A%20%20%20%20%3C%2FView%3E%0A%20%20%29%3B%0A%7D%0A%0Aconst%20styles%20%3D%20StyleSheet.create%28%7B%0A%20%20container%3A%20%7B%0A%20%20%20%20flex%3A%201%2C%0A%20%20%20%20marginTop%3A%20100%2C%0A%20%20%7D%2C%0A%20%20row%3A%20%7B%0A%20%20%20%20flexDirection%3A%20%22row%22%2C%0A%20%20%7D%2C%0A%20%20column%3A%20%7B%0A%20%20%20%20flex%3A%201%2C%0A%20%20%20%20padding%3A%2010%2C%0A%20%20%7D%2C%0A%20%20red%3A%20%7B%20backgroundColor%3A%20%22tomato%22%20%7D%2C%0A%20%20green%3A%20%7B%20backgroundColor%3A%20%22mediumseagreen%22%20%7D%2C%0A%20%20blue%3A%20%7B%20backgroundColor%3A%20%22dodgerblue%22%20%7D%2C%0A%7D%29%3B%0A)** (SDK 54, 필요한 패키지 자동 포함)

- Change the green column to `flex: 2` by adding `{ flex: 2 }` to the end of its style array. It now takes twice the space of the others.
- In React Native, `flex` takes a single number. It is not the `flex: 1 1 auto` shorthand from CSS.

**🇰🇷 한글 해설**

**코드 해설 (수업 순서)**
1. 상자 3개. `style={[styles.box, styles.red]}` → **스타일 배열**, 왼쪽부터 합쳐지고 **뒤가 이김**.
2. 기본은 위에서 아래로 쌓임. RN의 `flexDirection` 기본값은 **`"column"`** (웹은 row).
3. `flex: 1` 컨테이너 → 남은 화면을 꽉 채움.
4. `flexDirection: "row"` → 가로로.
5. `justifyContent: "center"` + `alignItems: "center"` → 정가운데.
   - `justifyContent` 값: `flex-start`, `center`, `flex-end`, `space-between`(양끝 붙이고 사이 균등), `space-around`(각 아이템 주변 균등), `space-evenly`(모든 간격 완전 균등)
6. 다시 `"column"`으로 → 이제 justifyContent는 **위아래**, alignItems는 **좌우**. **축이 바뀜!**
7. 같은 너비 열(equal columns): 고정 width 빼고 각 열에 `flex: 1` → 가로를 **똑같이 나눔**.
8. 글자 양이 달라도 **높이가 같아요**. `alignItems` 기본값이 **`"stretch"`** 라서.
9. 초록 열에 `{ flex: 2 }` 추가 → 다른 열의 **2배**. (비율: 1:2:1)
10. RN의 `flex`는 **숫자 하나**. CSS의 `flex: 1 1 auto` 같은 축약형 아님.

Flexbox Froggy 게임으로 연습하라고 했어요(Lab 3 Q1). 게임은 CSS 이름(`justify-content`)을 쓰니 RN에선 camelCase로 바꿔 생각하세요.

### 💻 Example: Platform.OS

- iOS and Android sometimes need small adjustments, for example the status bar is a different height on each.
- `Platform.OS` returns a string: `"ios"`, `"android"`, or `"web"`.
- Switch between the Web, iOS, and Android tabs in the Snack preview to see each message.

```jsx
import { View, Text, Platform } from "react-native";

export default function MyApp() {
  return (
    <View style={{ marginTop: 100 }}>
      <Text>
        {Platform.OS === "ios" && "Running on iOS"}
        {Platform.OS === "android" && "Running on Android"}
        {Platform.OS === "web" && "Running on Web"}
      </Text>
    </View>
  );
}
```

▶ **[Snack에서 바로 실행하기](https://snack.expo.dev/?name=WEB530%20W3%20Example%3A%20Platform.OS&platform=web&sdkVersion=54.0.0&code=import%20%7B%20View%2C%20Text%2C%20Platform%20%7D%20from%20%22react-native%22%3B%0A%0Aexport%20default%20function%20MyApp%28%29%20%7B%0A%20%20return%20%28%0A%20%20%20%20%3CView%20style%3D%7B%7B%20marginTop%3A%20100%20%7D%7D%3E%0A%20%20%20%20%20%20%3CText%3E%0A%20%20%20%20%20%20%20%20%7BPlatform.OS%20%3D%3D%3D%20%22ios%22%20%26%26%20%22Running%20on%20iOS%22%7D%0A%20%20%20%20%20%20%20%20%7BPlatform.OS%20%3D%3D%3D%20%22android%22%20%26%26%20%22Running%20on%20Android%22%7D%0A%20%20%20%20%20%20%20%20%7BPlatform.OS%20%3D%3D%3D%20%22web%22%20%26%26%20%22Running%20on%20Web%22%7D%0A%20%20%20%20%20%20%3C%2FText%3E%0A%20%20%20%20%3C%2FView%3E%0A%20%20%29%3B%0A%7D%0A)** (SDK 54, 필요한 패키지 자동 포함)

- This is conditional rendering with `&&`, a very common React pattern.
  - JavaScript's `&&` returns the right side when the left side is true.
  - When the left side is false, it returns `false`.
  - React renders nothing for `false`, `null`, and `undefined`, so only one message shows.
  - Careful: React _does_ render `0`. `{items.length && <Text>...</Text>}` shows a stray `0` when the list is empty.
- `Platform.Version` gives the OS version. On Android it is a number (like `34`), on iOS a string (like `"17.4"`).

**🇰🇷 한글 해설**

**코드 해설**
- `Platform.OS` → `"ios"`, `"android"`, `"web"` 중 하나의 **문자열**.
- `{조건 && <내용>}` → **조건부 렌더링**. 조건이 true면 오른쪽을 반환, false면 false 반환 → React는 `false`, `null`, `undefined`를 **안 그려요.**
- **함정**: React는 숫자 `0`은 그려요! `{items.length && <Text>...</Text>}` 에서 목록이 비면 화면에 **0**이 떠요. 해결: `{items.length > 0 && ...}`.
- `Platform.Version`: Android는 숫자(34), iOS는 문자열("17.4").
- Snack 미리보기에서 Web/iOS/Android 탭을 바꿔 가며 확인해 보세요.

### 💻 Example: Platform-Specific Styles

- You can branch on `Platform.OS` inside the StyleSheet.

```jsx
import { View, Text, StyleSheet, Platform } from "react-native";

export default function MyApp() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Platform-Specific Styling</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    marginTop: 100,
    backgroundColor: Platform.OS === "ios" ? "#d0e8ff" : "#ffe8d0",
  },
  title: {
    fontSize: Platform.OS === "android" ? 30 : 24,
    fontWeight: "bold",
  },
});
```

▶ **[Snack에서 바로 실행하기](https://snack.expo.dev/?name=WEB530%20W3%20Example%3A%20Platform-Specific%20Styles&platform=web&sdkVersion=54.0.0&code=import%20%7B%20View%2C%20Text%2C%20StyleSheet%2C%20Platform%20%7D%20from%20%22react-native%22%3B%0A%0Aexport%20default%20function%20MyApp%28%29%20%7B%0A%20%20return%20%28%0A%20%20%20%20%3CView%20style%3D%7Bstyles.container%7D%3E%0A%20%20%20%20%20%20%3CText%20style%3D%7Bstyles.title%7D%3EPlatform-Specific%20Styling%3C%2FText%3E%0A%20%20%20%20%3C%2FView%3E%0A%20%20%29%3B%0A%7D%0A%0Aconst%20styles%20%3D%20StyleSheet.create%28%7B%0A%20%20container%3A%20%7B%0A%20%20%20%20padding%3A%2020%2C%0A%20%20%20%20marginTop%3A%20100%2C%0A%20%20%20%20backgroundColor%3A%20Platform.OS%20%3D%3D%3D%20%22ios%22%20%3F%20%22%23d0e8ff%22%20%3A%20%22%23ffe8d0%22%2C%0A%20%20%7D%2C%0A%20%20title%3A%20%7B%0A%20%20%20%20fontSize%3A%20Platform.OS%20%3D%3D%3D%20%22android%22%20%3F%2030%20%3A%2024%2C%0A%20%20%20%20fontWeight%3A%20%22bold%22%2C%0A%20%20%7D%2C%0A%7D%29%3B%0A)** (SDK 54, 필요한 패키지 자동 포함)

- Useful when spacing or font sizes need to differ between platforms.

**🇰🇷 한글 해설**

**코드 해설**: StyleSheet 안에서 **삼항 연산자**로 분기. `Platform.OS === "ios" ? "#d0e8ff" : "#ffe8d0"` → iOS면 하늘색, 아니면 살구색.

### 💻 Example: Platform.select()

- `Platform.select()` takes an object keyed by platform and returns the value for the one the app is running on.
- This is cleaner than several `Platform.OS === ...` checks.
- Keys:
  - `ios` - used only on iOS.
  - `android` - used only on Android.
  - `native` - used on both iOS and Android, but not web.
  - `web` - used only on the web.
  - `default` - the fallback when no other key matches. Optional, but recommended.
- Inside a StyleSheet, `Platform.select()` can return a whole style object. Spread it into a style with `...`.
- `StatusBar.currentHeight` is the height of the Android status bar. It is `undefined` on iOS, which is why iOS gets its own padding.

```jsx
import { View, Text, StyleSheet, Platform, StatusBar } from "react-native";

export default function MyApp() {
  return (
    <View style={styles.container}>
      <Text>Clear of the status bar on every platform</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#eaeaea",
    ...Platform.select({
      ios: { paddingTop: 60 },
      android: { paddingTop: StatusBar.currentHeight },
      default: { paddingTop: 20 },
    }),
  },
});
```

▶ **[Snack에서 바로 실행하기](https://snack.expo.dev/?name=WEB530%20W3%20Example%3A%20Platform.select%28%29&platform=web&sdkVersion=54.0.0&code=import%20%7B%20View%2C%20Text%2C%20StyleSheet%2C%20Platform%2C%20StatusBar%20%7D%20from%20%22react-native%22%3B%0A%0Aexport%20default%20function%20MyApp%28%29%20%7B%0A%20%20return%20%28%0A%20%20%20%20%3CView%20style%3D%7Bstyles.container%7D%3E%0A%20%20%20%20%20%20%3CText%3EClear%20of%20the%20status%20bar%20on%20every%20platform%3C%2FText%3E%0A%20%20%20%20%3C%2FView%3E%0A%20%20%29%3B%0A%7D%0A%0Aconst%20styles%20%3D%20StyleSheet.create%28%7B%0A%20%20container%3A%20%7B%0A%20%20%20%20flex%3A%201%2C%0A%20%20%20%20backgroundColor%3A%20%22%23eaeaea%22%2C%0A%20%20%20%20...Platform.select%28%7B%0A%20%20%20%20%20%20ios%3A%20%7B%20paddingTop%3A%2060%20%7D%2C%0A%20%20%20%20%20%20android%3A%20%7B%20paddingTop%3A%20StatusBar.currentHeight%20%7D%2C%0A%20%20%20%20%20%20default%3A%20%7B%20paddingTop%3A%2020%20%7D%2C%0A%20%20%20%20%7D%29%2C%0A%20%20%7D%2C%0A%7D%29%3B%0A)** (SDK 54, 필요한 패키지 자동 포함)

- `Platform.select()` is not limited to styles. It can pick any value, such as a string.

```jsx
import { View, Text, Platform } from "react-native";

export default function MyApp() {
  const message = Platform.select({
    ios: "Hello from iOS",
    android: "Hello from Android",
    web: "Hello from Web",
    default: "Hello from somewhere",
  });

  return (
    <View style={{ marginTop: 100 }}>
      <Text>{message}</Text>
    </View>
  );
}
```

▶ **[Snack에서 바로 실행하기](https://snack.expo.dev/?name=WEB530%20W3%20Example%3A%20Platform.select%28%29&platform=web&sdkVersion=54.0.0&code=import%20%7B%20View%2C%20Text%2C%20Platform%20%7D%20from%20%22react-native%22%3B%0A%0Aexport%20default%20function%20MyApp%28%29%20%7B%0A%20%20const%20message%20%3D%20Platform.select%28%7B%0A%20%20%20%20ios%3A%20%22Hello%20from%20iOS%22%2C%0A%20%20%20%20android%3A%20%22Hello%20from%20Android%22%2C%0A%20%20%20%20web%3A%20%22Hello%20from%20Web%22%2C%0A%20%20%20%20default%3A%20%22Hello%20from%20somewhere%22%2C%0A%20%20%7D%29%3B%0A%0A%20%20return%20%28%0A%20%20%20%20%3CView%20style%3D%7B%7B%20marginTop%3A%20100%20%7D%7D%3E%0A%20%20%20%20%20%20%3CText%3E%7Bmessage%7D%3C%2FText%3E%0A%20%20%20%20%3C%2FView%3E%0A%20%20%29%3B%0A%7D%0A)** (SDK 54, 필요한 패키지 자동 포함)

**🇰🇷 한글 해설**

**코드 해설**
- `Platform.select({ ios: A, android: B, native: C, web: D, default: E })` → 지금 플랫폼에 맞는 값 **하나를 골라 반환**.
- 키 5개 의미 (시험 포인트):
  - `ios`: iOS만 / `android`: Android만 / `native`: iOS와 Android 둘 다(웹 제외) / `web`: 웹만 / `default`: 아무것도 안 맞을 때(권장)
- 스타일 객체를 반환할 땐 `...Platform.select({...})` 로 **펼쳐 넣기**.
- `StatusBar.currentHeight`: Android 상태바 높이. iOS에선 `undefined`.
- 스타일뿐 아니라 **문자열 같은 아무 값**이나 고를 수 있어요(두 번째 예제).

### 💻 Example: Platform-Specific Files

- When a component is very different on each platform, give each platform its own file.
- React Native picks the matching file automatically. The import does not mention the platform.

```jsx
MyButton.ios.js
MyButton.android.js
MyButton.js
```

```jsx
import MyButton from "./MyButton";
```

- No conditional logic is needed in the component.
- `MyButton.js` is the fallback for any platform without its own file (the web here).

**🇰🇷 한글 해설**

**파일 이름으로 플랫폼 나누기**
- `MyButton.ios.js`, `MyButton.android.js`, `MyButton.js` 를 만들어 두고
- `import MyButton from "./MyButton";` 이라고만 쓰면 RN이 **알아서 맞는 파일**을 골라요. import에 플랫폼 이름을 안 써요!
- `MyButton.js`는 전용 파일이 없는 플랫폼(여기선 web)의 **기본(fallback)**.
- 컴포넌트가 플랫폼마다 **아주 다를 때** 쓰는 방법. 조금 다를 땐 Platform.OS / select.

### 💻 Common Components

- Last week's table introduced these. Now we style them.

**🇰🇷 한글 해설**

2주차 표에 나온 컴포넌트들에 이제 스타일을 입혀 봐요.

#### 💻 View

- The most fundamental building block. `<div>` in HTML, `UIView` on iOS, `android.view.View` on Android.
- Can hold any number of children, including other Views.
- Styled with padding, margin, borders, background colour, and flexbox.
- Cannot hold bare text. Text must go inside a `Text`.

```jsx
import { View, Text } from "react-native";

export default function MyApp() {
  return (
    <View
      style={{ padding: 20, marginTop: 100, borderWidth: 2, borderRadius: 8 }}
    >
      <Text>Hello again</Text>
    </View>
  );
}
```

▶ **[Snack에서 바로 실행하기](https://snack.expo.dev/?name=WEB530%20W3%20Common%20Components%20-%20View&platform=web&sdkVersion=54.0.0&code=import%20%7B%20View%2C%20Text%20%7D%20from%20%22react-native%22%3B%0A%0Aexport%20default%20function%20MyApp%28%29%20%7B%0A%20%20return%20%28%0A%20%20%20%20%3CView%0A%20%20%20%20%20%20style%3D%7B%7B%20padding%3A%2020%2C%20marginTop%3A%20100%2C%20borderWidth%3A%202%2C%20borderRadius%3A%208%20%7D%7D%0A%20%20%20%20%3E%0A%20%20%20%20%20%20%3CText%3EHello%20again%3C%2FText%3E%0A%20%20%20%20%3C%2FView%3E%0A%20%20%29%3B%0A%7D%0A)** (SDK 54, 필요한 패키지 자동 포함)

**🇰🇷 한글 해설**

**코드 해설**: View에 `padding`, `marginTop`, `borderWidth`, `borderRadius`. View 안에 글자를 바로 쓰면 안 되고 Text로 감싸야 해요.

#### 💻 Text

- The only component that can display text.
- An outer `Text` acts like a `<p>` (block). A `Text` inside a `Text` acts like a `<span>` (inline).
- Nested `Text` inherits styles from its parent `Text`. This is the one place React Native styles cascade. A `View` does not pass its styles down.

```jsx
import { View, Text, StyleSheet } from "react-native";

export default function MyApp() {
  return (
    <View style={styles.container}>
      <Text style={styles.paragraph}>
        This whole sentence is grey and size 18, but{" "}
        <Text style={styles.highlight}>these words are also bold and red</Text>.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    marginTop: 100,
  },
  paragraph: {
    fontSize: 18,
    color: "#555",
  },
  highlight: {
    fontWeight: "bold",
    color: "crimson",
  },
});
```

▶ **[Snack에서 바로 실행하기](https://snack.expo.dev/?name=WEB530%20W3%20Common%20Components%20-%20Text&platform=web&sdkVersion=54.0.0&code=import%20%7B%20View%2C%20Text%2C%20StyleSheet%20%7D%20from%20%22react-native%22%3B%0A%0Aexport%20default%20function%20MyApp%28%29%20%7B%0A%20%20return%20%28%0A%20%20%20%20%3CView%20style%3D%7Bstyles.container%7D%3E%0A%20%20%20%20%20%20%3CText%20style%3D%7Bstyles.paragraph%7D%3E%0A%20%20%20%20%20%20%20%20This%20whole%20sentence%20is%20grey%20and%20size%2018%2C%20but%7B%22%20%22%7D%0A%20%20%20%20%20%20%20%20%3CText%20style%3D%7Bstyles.highlight%7D%3Ethese%20words%20are%20also%20bold%20and%20red%3C%2FText%3E.%0A%20%20%20%20%20%20%3C%2FText%3E%0A%20%20%20%20%3C%2FView%3E%0A%20%20%29%3B%0A%7D%0A%0Aconst%20styles%20%3D%20StyleSheet.create%28%7B%0A%20%20container%3A%20%7B%0A%20%20%20%20padding%3A%2020%2C%0A%20%20%20%20marginTop%3A%20100%2C%0A%20%20%7D%2C%0A%20%20paragraph%3A%20%7B%0A%20%20%20%20fontSize%3A%2018%2C%0A%20%20%20%20color%3A%20%22%23555%22%2C%0A%20%20%7D%2C%0A%20%20highlight%3A%20%7B%0A%20%20%20%20fontWeight%3A%20%22bold%22%2C%0A%20%20%20%20color%3A%20%22crimson%22%2C%0A%20%20%7D%2C%0A%7D%29%3B%0A)** (SDK 54, 필요한 패키지 자동 포함)

- Show that styles do not cascade from a `View`. Remove `color` from `paragraph`, then add `color: "blue"` to `container` instead. In HTML and CSS, a `<div>`'s colour passes down to the text inside it. In React Native it does not, on every platform including Snack's Web preview, so the sentence turns black instead of blue.

**🇰🇷 한글 해설**

**코드 해설**
- 바깥 Text = `<p>`처럼 블록, 안쪽 Text = `<span>`처럼 인라인.
- 안쪽 Text는 바깥 Text 스타일(크기 18, 회색)을 **상속**하고 자기 스타일(굵게, 빨강)을 **추가**.
- `{" "}` 는 줄바꿈 때문에 사라질 수 있는 **공백 한 칸**을 확실히 넣는 방법.
- **상속은 Text→Text에서만!** View에 `color: "blue"`를 줘도 안의 글자는 파랗게 안 돼요(검정). 웹 CSS와 가장 다른 점. Lab 3 Part B가 이 개념이에요.

#### 💻 Button

- Renders as a native button, so it looks different on each platform.
- It does not accept a `style` prop. You can only change its `color`.
- Later we will build custom buttons that can be fully styled.

```jsx
import { View, Button, Alert } from "react-native";

export default function MyApp() {
  return (
    <View style={{ marginTop: 100, padding: 20 }}>
      <Button
        title="Save"
        color="seagreen"
        onPress={() => Alert.alert("Saved")}
      />
    </View>
  );
}
```

▶ **[Snack에서 바로 실행하기](https://snack.expo.dev/?name=WEB530%20W3%20Common%20Components%20-%20Button&platform=ios&sdkVersion=54.0.0&code=import%20%7B%20View%2C%20Button%2C%20Alert%20%7D%20from%20%22react-native%22%3B%0A%0Aexport%20default%20function%20MyApp%28%29%20%7B%0A%20%20return%20%28%0A%20%20%20%20%3CView%20style%3D%7B%7B%20marginTop%3A%20100%2C%20padding%3A%2020%20%7D%7D%3E%0A%20%20%20%20%20%20%3CButton%0A%20%20%20%20%20%20%20%20title%3D%22Save%22%0A%20%20%20%20%20%20%20%20color%3D%22seagreen%22%0A%20%20%20%20%20%20%20%20onPress%3D%7B%28%29%20%3D%3E%20Alert.alert%28%22Saved%22%29%7D%0A%20%20%20%20%20%20%2F%3E%0A%20%20%20%20%3C%2FView%3E%0A%20%20%29%3B%0A%7D%0A)** (SDK 54, 필요한 패키지 자동 포함)

- To space buttons out, wrap each one in a `View` and style the `View`.
- FYI: to reuse a colour, keep it in a constant. It is not a global, just a normal variable you could move into its own file and `import`.
- On iOS `color` sets the text colour. On Android it sets the background.

```jsx
import { View, Button, Alert } from "react-native";

const colors = {
  primary: "#2196F3",
  danger: "crimson",
};

export default function MyApp() {
  return (
    <View style={{ marginTop: 100, padding: 20 }}>
      <Button
        title="Save"
        color={colors.primary}
        onPress={() => Alert.alert("Saved")}
      />
      <Button
        title="Delete"
        color={colors.danger}
        onPress={() => Alert.alert("Deleted")}
      />
    </View>
  );
}
```

▶ **[Snack에서 바로 실행하기](https://snack.expo.dev/?name=WEB530%20W3%20Common%20Components%20-%20Button&platform=ios&sdkVersion=54.0.0&code=import%20%7B%20View%2C%20Button%2C%20Alert%20%7D%20from%20%22react-native%22%3B%0A%0Aconst%20colors%20%3D%20%7B%0A%20%20primary%3A%20%22%232196F3%22%2C%0A%20%20danger%3A%20%22crimson%22%2C%0A%7D%3B%0A%0Aexport%20default%20function%20MyApp%28%29%20%7B%0A%20%20return%20%28%0A%20%20%20%20%3CView%20style%3D%7B%7B%20marginTop%3A%20100%2C%20padding%3A%2020%20%7D%7D%3E%0A%20%20%20%20%20%20%3CButton%0A%20%20%20%20%20%20%20%20title%3D%22Save%22%0A%20%20%20%20%20%20%20%20color%3D%7Bcolors.primary%7D%0A%20%20%20%20%20%20%20%20onPress%3D%7B%28%29%20%3D%3E%20Alert.alert%28%22Saved%22%29%7D%0A%20%20%20%20%20%20%2F%3E%0A%20%20%20%20%20%20%3CButton%0A%20%20%20%20%20%20%20%20title%3D%22Delete%22%0A%20%20%20%20%20%20%20%20color%3D%7Bcolors.danger%7D%0A%20%20%20%20%20%20%20%20onPress%3D%7B%28%29%20%3D%3E%20Alert.alert%28%22Deleted%22%29%7D%0A%20%20%20%20%20%20%2F%3E%0A%20%20%20%20%3C%2FView%3E%0A%20%20%29%3B%0A%7D%0A)** (SDK 54, 필요한 패키지 자동 포함)

**🇰🇷 한글 해설**

**코드 해설**
- Button은 **style prop을 안 받아요.** 바꿀 수 있는 건 `color`뿐.
- 버튼 사이 간격은 버튼을 **View로 감싸서** View에 margin.
- `color`의 의미가 플랫폼마다 달라요: **iOS는 글자색, Android는 배경색**. (시험 포인트)
- `const colors = {...}` 는 그냥 일반 상수. 색을 재사용하려고 모아 둔 것.
- 완전히 꾸미고 싶으면 6주차 `Pressable`로 직접 버튼을 만들어요.

#### 💻 Image

- Displays an image from the web, the project's files, or a data URI.
- `source` replaces the HTML `src`.
- A remote image must be given a `width` and `height`. React Native cannot know the size until it downloads the file, so without them nothing shows.

```jsx
import { View, Image } from "react-native";

export default function MyApp() {
  return (
    <View style={{ marginTop: 100, padding: 20 }}>
      <Image
        style={{ width: 200, height: 200, borderRadius: 10 }}
        source={{ uri: "https://picsum.photos/201" }}
      />
    </View>
  );
}
```

▶ **[Snack에서 바로 실행하기](https://snack.expo.dev/?name=WEB530%20W3%20Common%20Components%20-%20Image&platform=web&sdkVersion=54.0.0&code=import%20%7B%20View%2C%20Image%20%7D%20from%20%22react-native%22%3B%0A%0Aexport%20default%20function%20MyApp%28%29%20%7B%0A%20%20return%20%28%0A%20%20%20%20%3CView%20style%3D%7B%7B%20marginTop%3A%20100%2C%20padding%3A%2020%20%7D%7D%3E%0A%20%20%20%20%20%20%3CImage%0A%20%20%20%20%20%20%20%20style%3D%7B%7B%20width%3A%20200%2C%20height%3A%20200%2C%20borderRadius%3A%2010%20%7D%7D%0A%20%20%20%20%20%20%20%20source%3D%7B%7B%20uri%3A%20%22https%3A%2F%2Fpicsum.photos%2F201%22%20%7D%7D%0A%20%20%20%20%20%20%2F%3E%0A%20%20%20%20%3C%2FView%3E%0A%20%20%29%3B%0A%7D%0A)** (SDK 54, 필요한 패키지 자동 포함)

- Notice the remote `source` is an object with a `uri` key.
- Local images use `require()` instead.
- A new Snack already has an image in its `assets` folder, `snack-icon.png`. Use that one.

```jsx
<Image source={require("./assets/snack-icon.png")} />
```

- A local image already knows its size, so `width` and `height` are optional. Add them to resize it.
- The `require()` path must be a fixed string. You cannot build it from a variable.
- Some Image props only work on Android or only on iOS. Check the docs before relying on one.

**🇰🇷 한글 해설**

**코드 해설**
- 원격 이미지: `source={{ uri: "https://..." }}` → `source`에 **`uri` 키를 가진 객체**. width/height **필수**(다운받기 전엔 크기를 모르니까).
- 로컬 이미지: `source={require("./assets/snack-icon.png")}` → 크기를 이미 알아서 width/height 선택.
- `require()` 경로는 **고정 문자열**이어야 해요. 변수로 조립 불가 (`require("./" + name)` X).
- `borderRadius: 10` 둥근 모서리. width의 절반을 주면 **원**(Lab 3 Part A 힌트).

#### 💻 ScrollView

- A screen does not scroll by default. Content that runs past the bottom is cut off.
- Wrap long content in a `ScrollView`.

```jsx
import { ScrollView, Text } from "react-native";

// An array of the numbers 1 to 50
const lines = Array.from({ length: 50 }, (_, i) => i + 1);

export default function MyApp() {
  return (
    <ScrollView style={{ marginTop: 100, padding: 20 }}>
      {lines.map((n) => (
        <Text key={n} style={{ fontSize: 20 }}>
          Line {n}
        </Text>
      ))}
    </ScrollView>
  );
}
```

▶ **[Snack에서 바로 실행하기](https://snack.expo.dev/?name=WEB530%20W3%20Common%20Components%20-%20ScrollView&platform=web&sdkVersion=54.0.0&code=import%20%7B%20ScrollView%2C%20Text%20%7D%20from%20%22react-native%22%3B%0A%0A%2F%2F%20An%20array%20of%20the%20numbers%201%20to%2050%0Aconst%20lines%20%3D%20Array.from%28%7B%20length%3A%2050%20%7D%2C%20%28_%2C%20i%29%20%3D%3E%20i%20%2B%201%29%3B%0A%0Aexport%20default%20function%20MyApp%28%29%20%7B%0A%20%20return%20%28%0A%20%20%20%20%3CScrollView%20style%3D%7B%7B%20marginTop%3A%20100%2C%20padding%3A%2020%20%7D%7D%3E%0A%20%20%20%20%20%20%7Blines.map%28%28n%29%20%3D%3E%20%28%0A%20%20%20%20%20%20%20%20%3CText%20key%3D%7Bn%7D%20style%3D%7B%7B%20fontSize%3A%2020%20%7D%7D%3E%0A%20%20%20%20%20%20%20%20%20%20Line%20%7Bn%7D%0A%20%20%20%20%20%20%20%20%3C%2FText%3E%0A%20%20%20%20%20%20%29%29%7D%0A%20%20%20%20%3C%2FScrollView%3E%0A%20%20%29%3B%0A%7D%0A)** (SDK 54, 필요한 패키지 자동 포함)

- The 50 lines run off the bottom of the screen. Scroll to see them all.
- Change `ScrollView` to `View` and try again. The content is cut off and will not scroll.
- `.map()` with a `key` is the same pattern we used for lists in Week 1.2.
- `style` styles the scrolling window itself. `contentContainerStyle` styles the content inside it. Use `contentContainerStyle` for padding around the content and for flexbox properties like `alignItems`.
- Replace the opening `ScrollView` tag with this one. The lines are now centred and the padding scrolls with the content.

```jsx
<ScrollView
  style={{ marginTop: 100 }}
  contentContainerStyle={{ padding: 20, alignItems: "center" }}
>
```
- A `ScrollView` renders every child at once. That is fine for a page of content, but not for a list of hundreds of items. That is `FlatList`, later in the course.

**🇰🇷 한글 해설**

**코드 해설**
- `Array.from({ length: 50 }, (_, i) => i + 1)` → [1, 2, ..., 50] 배열 만들기. `_`는 "안 쓰는 값" 표시.
- 화면은 기본적으로 **스크롤 안 됨**. ScrollView를 View로 바꾸면 아래가 잘려요.
- `style` = 스크롤 **창 자체**의 스타일 / `contentContainerStyle` = 창 **안의 내용**의 스타일. padding이나 `alignItems` 같은 flexbox 속성은 **contentContainerStyle**에! (시험 포인트)
- ScrollView는 자식을 **한꺼번에 전부** 그려요. 수백 개 목록엔 부적합 → 5주차 **FlatList**.

#### 💻 TextInput

- Captures text from the keyboard.
- Use `onChangeText`, which gives you the new string. `onChange` gives an event object instead.
- Make it a controlled component: the state holds the value, and `value` shows it.

```jsx
import { useState } from "react";
import { View, Text, TextInput, StyleSheet } from "react-native";

export default function MyApp() {
  const [name, setName] = useState("");

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Enter your name"
        value={name}
        onChangeText={setName}
      />
      <Text style={styles.greeting}>Hello {name}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    marginTop: 100,
  },
  input: {
    borderWidth: 1,
    borderRadius: 6,
    padding: 10,
  },
  greeting: {
    marginTop: 20,
    fontSize: 18,
  },
});
```

▶ **[Snack에서 바로 실행하기](https://snack.expo.dev/?name=WEB530%20W3%20Common%20Components%20-%20TextInput&platform=web&sdkVersion=54.0.0&code=import%20%7B%20useState%20%7D%20from%20%22react%22%3B%0Aimport%20%7B%20View%2C%20Text%2C%20TextInput%2C%20StyleSheet%20%7D%20from%20%22react-native%22%3B%0A%0Aexport%20default%20function%20MyApp%28%29%20%7B%0A%20%20const%20%5Bname%2C%20setName%5D%20%3D%20useState%28%22%22%29%3B%0A%0A%20%20return%20%28%0A%20%20%20%20%3CView%20style%3D%7Bstyles.container%7D%3E%0A%20%20%20%20%20%20%3CTextInput%0A%20%20%20%20%20%20%20%20style%3D%7Bstyles.input%7D%0A%20%20%20%20%20%20%20%20placeholder%3D%22Enter%20your%20name%22%0A%20%20%20%20%20%20%20%20value%3D%7Bname%7D%0A%20%20%20%20%20%20%20%20onChangeText%3D%7BsetName%7D%0A%20%20%20%20%20%20%2F%3E%0A%20%20%20%20%20%20%3CText%20style%3D%7Bstyles.greeting%7D%3EHello%20%7Bname%7D%3C%2FText%3E%0A%20%20%20%20%3C%2FView%3E%0A%20%20%29%3B%0A%7D%0A%0Aconst%20styles%20%3D%20StyleSheet.create%28%7B%0A%20%20container%3A%20%7B%0A%20%20%20%20padding%3A%2020%2C%0A%20%20%20%20marginTop%3A%20100%2C%0A%20%20%7D%2C%0A%20%20input%3A%20%7B%0A%20%20%20%20borderWidth%3A%201%2C%0A%20%20%20%20borderRadius%3A%206%2C%0A%20%20%20%20padding%3A%2010%2C%0A%20%20%7D%2C%0A%20%20greeting%3A%20%7B%0A%20%20%20%20marginTop%3A%2020%2C%0A%20%20%20%20fontSize%3A%2018%2C%0A%20%20%7D%2C%0A%7D%29%3B%0A)** (SDK 54, 필요한 패키지 자동 포함)

- A `TextInput` has no border by default. Without `borderWidth` it is invisible until you tap it.
- `onChangeText={setName}` passes the setter directly. It is the same as `onChangeText={(text) => setName(text)}`.
- Show a few of the props that change the keyboard and behaviour. Tap each field on a device to see the keyboard change.

```jsx
<TextInput
  style={styles.input}
  placeholder="Email"
  keyboardType="email-address"
  autoCapitalize="none"
  autoCorrect={false}
/>
<TextInput style={styles.input} placeholder="Password" secureTextEntry />
<TextInput style={styles.input} placeholder="Comments" multiline />
```

**🇰🇷 한글 해설**

**코드 해설**
- `onChangeText` = 새 **문자열**을 줌 / `onChange` = **이벤트 객체**를 줌.
- **Controlled component**: state가 값을 들고, `value`로 보여 줌.
- TextInput은 기본 **테두리가 없어요.** `borderWidth` 안 주면 투명해서 안 보여요.
- `onChangeText={setName}` 은 `onChangeText={(text) => setName(text)}` 와 같아요.
- 유용한 props: `keyboardType="email-address"`(이메일 키보드), `autoCapitalize="none"`(첫 글자 자동 대문자 끄기), `autoCorrect={false}`(자동 수정 끄기), `secureTextEntry`(비밀번호 ●●●), `multiline`(여러 줄).

#### 💻 Switch

- Renders as an on/off toggle for a true/false value.
- It is a controlled component. It only moves if you update the state in `onValueChange`.
- It may not render on the web, so test it in the iOS or Android preview.
- Use the switch to change the styles. A `false` entry in a style array is ignored, so `isOn && styles.dark` only applies when the switch is on.

```jsx
import { useState } from "react";
import { View, Text, Switch, StyleSheet } from "react-native";

export default function MyApp() {
  const [isOn, setIsOn] = useState(false);

  return (
    <View style={[styles.container, isOn && styles.dark]}>
      <Text style={[styles.label, isOn && styles.lightText]}>
        Dark mode is {isOn ? "on" : "off"}
      </Text>
      <Switch value={isOn} onValueChange={setIsOn} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 100,
    alignItems: "center",
    backgroundColor: "#fff",
  },
  dark: {
    backgroundColor: "#222",
  },
  label: {
    fontSize: 18,
    marginBottom: 10,
    color: "#222",
  },
  lightText: {
    color: "#fff",
  },
});
```

▶ **[Snack에서 바로 실행하기](https://snack.expo.dev/?name=WEB530%20W3%20Common%20Components%20-%20Switch&platform=web&sdkVersion=54.0.0&code=import%20%7B%20useState%20%7D%20from%20%22react%22%3B%0Aimport%20%7B%20View%2C%20Text%2C%20Switch%2C%20StyleSheet%20%7D%20from%20%22react-native%22%3B%0A%0Aexport%20default%20function%20MyApp%28%29%20%7B%0A%20%20const%20%5BisOn%2C%20setIsOn%5D%20%3D%20useState%28false%29%3B%0A%0A%20%20return%20%28%0A%20%20%20%20%3CView%20style%3D%7B%5Bstyles.container%2C%20isOn%20%26%26%20styles.dark%5D%7D%3E%0A%20%20%20%20%20%20%3CText%20style%3D%7B%5Bstyles.label%2C%20isOn%20%26%26%20styles.lightText%5D%7D%3E%0A%20%20%20%20%20%20%20%20Dark%20mode%20is%20%7BisOn%20%3F%20%22on%22%20%3A%20%22off%22%7D%0A%20%20%20%20%20%20%3C%2FText%3E%0A%20%20%20%20%20%20%3CSwitch%20value%3D%7BisOn%7D%20onValueChange%3D%7BsetIsOn%7D%20%2F%3E%0A%20%20%20%20%3C%2FView%3E%0A%20%20%29%3B%0A%7D%0A%0Aconst%20styles%20%3D%20StyleSheet.create%28%7B%0A%20%20container%3A%20%7B%0A%20%20%20%20flex%3A%201%2C%0A%20%20%20%20paddingTop%3A%20100%2C%0A%20%20%20%20alignItems%3A%20%22center%22%2C%0A%20%20%20%20backgroundColor%3A%20%22%23fff%22%2C%0A%20%20%7D%2C%0A%20%20dark%3A%20%7B%0A%20%20%20%20backgroundColor%3A%20%22%23222%22%2C%0A%20%20%7D%2C%0A%20%20label%3A%20%7B%0A%20%20%20%20fontSize%3A%2018%2C%0A%20%20%20%20marginBottom%3A%2010%2C%0A%20%20%20%20color%3A%20%22%23222%22%2C%0A%20%20%7D%2C%0A%20%20lightText%3A%20%7B%0A%20%20%20%20color%3A%20%22%23fff%22%2C%0A%20%20%7D%2C%0A%7D%29%3B%0A)** (SDK 54, 필요한 패키지 자동 포함)

**🇰🇷 한글 해설**

**코드 해설**
- `<Switch value={isOn} onValueChange={setIsOn} />` → controlled. `onValueChange`가 새 boolean을 줘요.
- 웹에서는 안 보일 수 있으니 iOS/Android 미리보기로 확인.
- `style={[styles.container, isOn && styles.dark]}` → **조건부 스타일**. isOn이 false면 배열에 `false`가 들어가는데, 스타일 배열의 false는 **무시**돼요. 그래서 켜졌을 때만 dark가 적용.
- 다크 모드처럼 상태에 따라 스타일을 바꾸는 패턴. 시험에 잘 나올 만한 유형이에요.


---

## 4. 🧪 Lab: Lab 3 - Layout and Styling

> 원문 출처: github.com/nick-romanidis/web530-2267-nsa  lab-3.md

**🇰🇷 들어가기 전에**

Lab 3는 **레이아웃 직접 짜기** 연습이에요. 문제 조건(스타일 이름, 파일 분리, flex로 같은 너비 등)이 아주 구체적이라 그대로 시험 채점 기준처럼 읽으면 좋아요.

### 🧪 A Note on AI

AI assistants are welcome in this course, but use them to get unstuck, not to do the work. Attempt every question yourself first. If you are stuck, paste **your** code and ask why it does not work or what concept you are missing, rather than asking for the answer. Never keep code you could not explain line by line to a classmate. If you cannot explain it, you cannot debug it or build on it, and it is not yours yet. The same goes for the game: looking up the answer to a level skips the practice the level was built to give you. The point of this lab is not the finished Snack or the finished game. It is the ability to lay out a screen yourself.

**🇰🇷 한글 해설**

AI는 막힐 때만. Flexbox Froggy 답도 찾아보지 말고 직접 풀라고 해요.

### 🧪 Overview

This lab has two questions. Plan for about 60 minutes.

- Question 1 is a browser game that teaches flexbox. You submit a screenshot.
- Question 2 is a React Native component you build in Expo Snack. You submit the Snack link.

**🇰🇷 한글 해설**

Q1은 Flexbox Froggy 게임 스크린샷, Q2는 Snack으로 프로필 카드 만들기.

### 🧪 Submission

- Submit to the `Lab 3` assessment in Blackboard:
  - One screenshot for Question 1.
  - One Snack link for Question 2. After you save, the link looks like `https://snack.expo.dev/@yourname/web530-lab-3-...`.
- The lab is due **Tuesday, September 29 at 1:30 PM**.
- Only students who participated in the week 3 Tuesday/Wednesday class, and handed in a lab slip can receive marks for this lab. If you did not, you are still encouraged to complete it as practice.
- Before submitting, save the Snack one last time and open your link in a private browser window to confirm it loads without signing in.

**🇰🇷 한글 해설**

스크린샷 1장 + Snack 링크 1개. 시크릿 창으로 링크 열리는지 확인.

### 🧪 Question 1 - Flexbox Froggy (1 point)

React Native lays out every screen with flexbox, so this is the layout system you will use for the rest of the course.

Complete all 24 levels of Flexbox Froggy: (https://flexboxfroggy.com/)

- The game uses CSS names with dashes (`justify-content`, `flex-direction`). In React Native the same properties are camelCase (`justifyContent`, `flexDirection`) and the values are strings (`"center"`).
- One difference to remember: in the game, and on the web, `flex-direction` starts as `row`. In React Native, `flexDirection` starts as `"column"`.
- Your progress is saved in your browser. If you finish over more than one sitting, use the same browser each time.

To submit:

- Click **Level 24 of 24** at the top left to open the level menu. Every level from 1 to 24 must show as solved.
- Take a screenshot of the whole browser window with that menu open.

**🇰🇷 한글 해설**

24단계 전부 클리어. 게임은 CSS 문법(대시), RN은 camelCase + 문자열 값. 웹 기본 방향은 row, **RN은 column**.

### 🧪 Question 2 - Profile Card (4 points)



**🇰🇷 한글 해설**

4파트(A~D), 각 1점. 아래에서 파트별로 어떤 개념을 쓰는지 정리할게요.

#### 🧪 Setup

1. Open the React Native Playground (Snack) at https://snack.expo.dev and sign in.
2. Rename the Snack to `WEB530 Lab 3 - Your Name` (click the name at the top left).
3. In the file list on the left, add a new file named `styles.js` in the same folder as `App.js`.
4. Paste in the two starter files below.
5. Click **Save** so the Snack gets a permanent link.

Starter for `App.js`:

```jsx
import { ScrollView, Text } from "react-native";
import styles from "./styles";

export default function MyApp() {
  return (
    <ScrollView style={styles.screen}>
      <Text>Question 2</Text>
      {/* Your ProfileCards go here */}
    </ScrollView>
  );
}
```

▶ 이 코드는 다른 파일(또는 Expo Router의 app 폴더 구조)이 필요해서 Snack 한 파일로는 실행되지 않아요. VS Code 로컬 Expo 프로젝트에서 해당 파일에 붙여 넣어 실행하세요.

Starter for `styles.js`:

```js
import { StyleSheet } from "react-native";

export default StyleSheet.create({
  screen: {
    marginTop: 60,
    backgroundColor: "#f0f0f0",
  },
});
```

▶ **[Snack에서 바로 실행하기](https://snack.expo.dev/?name=WEB530%20W3%20Question%202%20-%20Profile%20Card%20%284%20points%29%20-%20Setup&platform=web&sdkVersion=54.0.0&code=import%20%7B%20StyleSheet%20%7D%20from%20%22react-native%22%3B%0A%0Aexport%20default%20StyleSheet.create%28%7B%0A%20%20screen%3A%20%7B%0A%20%20%20%20marginTop%3A%2060%2C%0A%20%20%20%20backgroundColor%3A%20%22%23f0f0f0%22%2C%0A%20%20%7D%2C%0A%7D%29%3B%0A)** (SDK 54, 필요한 패키지 자동 포함)

Check your work in more than one preview. The shadow in Part D looks different on the Web, Android, and iOS tabs, and that is the point.

**🇰🇷 한글 해설**

`styles.js` 파일을 따로 만들어 `export default StyleSheet.create({...})` 하고, App.js에서 `import styles from "./styles";`. **스타일 파일 분리** 연습이에요.

#### 🧪 The Component

Create a component called `ProfileCard` in `App.js`. It displays a social media style profile and accepts these props:

- `name` (string)
- `handle` (string), for example `"@jordan"`
- `imageUri` (string), a link to an image. `https://picsum.photos/200` works, or use any image link you like.
- `topic` (string), default `"React Native"`
- `posts`, `followers`, `following` (numbers)

In `MyApp`, render `ProfileCard` **twice** under the `Question 2` heading, with different values for every prop. Leave `topic` out of one of them so the default shows.

The card is built in four parts, each worth 1 point.

**🇰🇷 한글 해설**

props: `name`, `handle`, `imageUri`, `topic`(기본값 "React Native"), `posts`, `followers`, `following`. 두 번 렌더링하고 하나는 topic을 빼서 기본값이 보이게. → 1주차 구조 분해 기본값.

#### 🧪 Part A - Header Row (1 point)

The top of the card is a row with the photo on the left and the name and handle on the right.

- The photo is an `Image` that is 80 wide and 80 high, shown as a circle.
- To the right of the photo, the name sits above the handle. The name is size 20 and bold. The handle is grey.
- There is a gap between the photo and the text.
- The name and handle are centred vertically against the photo, not stuck to the top of it.

Hint: A remote image shows nothing unless it has a width and height. A `borderRadius` of half the width turns a square into a circle.

**🇰🇷 한글 해설**

**쓰는 개념**: `flexDirection: "row"`(사진 왼쪽, 글자 오른쪽), Image width/height 80 + `borderRadius: 40`(원), 이름/핸들은 View로 묶어 세로로, **세로 가운데 정렬은 row 컨테이너에 `alignItems: "center"`**(row에서 교차축 = 세로), 간격은 `gap` 또는 `marginLeft`.

#### 🧪 Part B - Bio Line (1 point)

Under the header row, show one line of text:

`Currently learning TOPIC.`

- `TOPIC` is the value of the `topic` prop.
- Only the topic is bold and coloured (pick any colour). The rest of the sentence is not.
- The sentence has a font size of 16, and the topic must be the same size without you setting `fontSize` on it a second time.

Hint: A `Text` inside a `Text` inherits the outer `Text`'s styles.

**🇰🇷 한글 해설**

**쓰는 개념**: Text 안의 Text 상속. 바깥 Text에 `fontSize: 16`, 안쪽 Text엔 굵기와 색만. 안쪽에 fontSize를 또 주면 감점 조건이에요.

#### 🧪 Part C - Stats Row (1 point)

At the bottom of the card, show three stats side by side: **Posts**, **Followers**, and **Following**.

- Each stat is a number from the props above a small label, for example `128` over `Posts`.
- The number is large and bold. The label is smaller and grey.
- The three stats have equal widths and are centred in their space.
- A thin line separates the stats row from the bio above it.

Requirements:

- The equal widths must come from flexbox. Do not give the stats a fixed `width`.
- Write a small `Stat` component that takes `value` and `label` props, and use it three times inside `ProfileCard`.

**🇰🇷 한글 해설**

**쓰는 개념**: `Stat({ value, label })` 작은 컴포넌트를 3번 재사용. 각 Stat에 `flex: 1` + `alignItems: "center"` → 고정 width 없이 **같은 너비**. 구분선은 stats row에 `borderTopWidth: 1`.

#### 🧪 Part D - The Card and Styles File (1 point)

- The card has a white background, rounded corners, padding inside, and a margin of 16 around it so it does not touch the screen edges or the other card.
- The card has a shadow, set with `Platform.select()` inside the StyleSheet. Use these values:
  - `ios`: `shadowColor: "#000"`, `shadowOffset: { width: 0, height: 2 }`, `shadowOpacity: 0.2`, `shadowRadius: 4`
  - `android`: `elevation: 4`
  - `default`: `borderWidth: 1` and `borderColor: "#ddd"`
- Add a comment above the `Platform.select()` explaining, in your own words, why the web preview gets the `default` style.

Requirements:

- Every style is in `styles.js`, created with `StyleSheet.create()`, and imported into `App.js`. There are **no** inline `style={{ ... }}` objects anywhere in `App.js`.
- Style names describe what they are for (`card`, `headerRow`, `statLabel`), not what they look like (`bold`, `grey`, `box1`).

Hint: `Platform.select()` returns an object here, so spread it into the card style with `...Platform.select({ ... })`. Remember to import `Platform` into `styles.js`.

**🇰🇷 한글 해설**

**쓰는 개념**: `...Platform.select({ ios: {...}, android: { elevation: 4 }, default: {...} })` 를 card 스타일 안에 spread.
- **왜 web은 default인가?** select에 `web` 키가 없으니까, 맞는 키가 없을 때 쓰는 `default`가 선택돼요. (iOS 그림자 속성, Android elevation은 웹에서 의미가 없으니 테두리로 대체)
- App.js에 **인라인 스타일 0개**.
- 스타일 이름은 **용도**로(`card`, `headerRow`), 모양으로 짓지 않기(`bold`, `grey` X).


---

## ✅ Week 3 시험 대비 체크리스트

1. RN 스타일 속성 이름 규칙? → camelCase, 크기는 단위 없는 숫자
2. `style={{ }}` 이중 중괄호 의미? → JS 영역 + 객체
3. `style={[a, b]}` 에서 겹치면? → **뒤(b)가 이김**
4. 스타일 이름 오타(`fontSise`)는? → 경고 없이 무시
5. RN `flexDirection` 기본값? → `"column"` (웹은 row)
6. `justifyContent` vs `alignItems`? → 주축 / 교차축
7. 열 높이가 같아지는 이유? → `alignItems` 기본값 `"stretch"`
8. `flex: 2`의 의미? → 형제 대비 2배 공간
9. `Platform.select` 키 5개? → ios, android, native, web, default
10. 플랫폼별 파일 이름? → `X.ios.js`, `X.android.js`, `X.js`(fallback), import는 `"./X"`
11. `{0 && <Text/>}` 결과? → 화면에 **0**이 보임
12. 스타일 상속은 어디서만? → **Text 안의 Text**. View는 상속 안 함
13. Button에 style을 줄 수 있나? → 없음, `color`만 (iOS 글자색, Android 배경색)
14. 원격 Image가 안 보이는 이유? → width/height 없음
15. ScrollView padding/alignItems는? → `contentContainerStyle`
16. TextInput이 안 보이는 이유? → 기본 테두리 없음
17. Switch가 안 움직이는 이유? → controlled라서 `onValueChange`로 state 업데이트 필요
18. 조건부 스타일? → `[styles.a, isOn && styles.b]`

**손으로 써 보기 과제**: 아래 "설정 화면"을 보지 않고 만들어 보세요. 3주차 개념(StyleSheet, flex row, alignItems, Switch, 조건부 스타일, Platform.select, Text 중첩)이 다 들어 있어요.

```jsx
import { useState } from "react";
import { View, Text, Switch, StyleSheet, Platform } from "react-native";

function SettingRow({ label, value, onChange }) {
  return (
    <View style={styles.row}>
      <Text style={styles.label}>{label}</Text>
      <Switch value={value} onValueChange={onChange} />
    </View>
  );
}

export default function App() {
  const [dark, setDark] = useState(false);
  const [sound, setSound] = useState(true);

  return (
    <View style={[styles.screen, dark && styles.darkScreen]}>
      <Text style={[styles.title, dark && styles.lightText]}>
        Settings for <Text style={styles.highlight}>{Platform.OS}</Text>
      </Text>
      <View style={styles.card}>
        <SettingRow label="Dark mode" value={dark} onChange={setDark} />
        <SettingRow label="Sound" value={sound} onChange={setSound} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, paddingTop: 80, paddingHorizontal: 16, backgroundColor: "#f0f0f0" },
  darkScreen: { backgroundColor: "#222" },
  title: { fontSize: 22, marginBottom: 16, color: "#222" },
  lightText: { color: "#fff" },
  highlight: { fontWeight: "bold", color: "tomato" },
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 8,
    ...Platform.select({
      ios: { shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.2, shadowRadius: 4 },
      android: { elevation: 4 },
      default: { borderWidth: 1, borderColor: "#ddd" },
    }),
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 12,
  },
  label: { fontSize: 18 },
});
```

▶ **[Snack에서 바로 실행하기](https://snack.expo.dev/?name=WEB530%20W3%20practice&platform=web&sdkVersion=54.0.0&code=import%20%7B%20useState%20%7D%20from%20%22react%22%3B%0Aimport%20%7B%20View%2C%20Text%2C%20Switch%2C%20StyleSheet%2C%20Platform%20%7D%20from%20%22react-native%22%3B%0A%0Afunction%20SettingRow%28%7B%20label%2C%20value%2C%20onChange%20%7D%29%20%7B%0A%20%20return%20%28%0A%20%20%20%20%3CView%20style%3D%7Bstyles.row%7D%3E%0A%20%20%20%20%20%20%3CText%20style%3D%7Bstyles.label%7D%3E%7Blabel%7D%3C%2FText%3E%0A%20%20%20%20%20%20%3CSwitch%20value%3D%7Bvalue%7D%20onValueChange%3D%7BonChange%7D%20%2F%3E%0A%20%20%20%20%3C%2FView%3E%0A%20%20%29%3B%0A%7D%0A%0Aexport%20default%20function%20App%28%29%20%7B%0A%20%20const%20%5Bdark%2C%20setDark%5D%20%3D%20useState%28false%29%3B%0A%20%20const%20%5Bsound%2C%20setSound%5D%20%3D%20useState%28true%29%3B%0A%0A%20%20return%20%28%0A%20%20%20%20%3CView%20style%3D%7B%5Bstyles.screen%2C%20dark%20%26%26%20styles.darkScreen%5D%7D%3E%0A%20%20%20%20%20%20%3CText%20style%3D%7B%5Bstyles.title%2C%20dark%20%26%26%20styles.lightText%5D%7D%3E%0A%20%20%20%20%20%20%20%20Settings%20for%20%3CText%20style%3D%7Bstyles.highlight%7D%3E%7BPlatform.OS%7D%3C%2FText%3E%0A%20%20%20%20%20%20%3C%2FText%3E%0A%20%20%20%20%20%20%3CView%20style%3D%7Bstyles.card%7D%3E%0A%20%20%20%20%20%20%20%20%3CSettingRow%20label%3D%22Dark%20mode%22%20value%3D%7Bdark%7D%20onChange%3D%7BsetDark%7D%20%2F%3E%0A%20%20%20%20%20%20%20%20%3CSettingRow%20label%3D%22Sound%22%20value%3D%7Bsound%7D%20onChange%3D%7BsetSound%7D%20%2F%3E%0A%20%20%20%20%20%20%3C%2FView%3E%0A%20%20%20%20%3C%2FView%3E%0A%20%20%29%3B%0A%7D%0A%0Aconst%20styles%20%3D%20StyleSheet.create%28%7B%0A%20%20screen%3A%20%7B%20flex%3A%201%2C%20paddingTop%3A%2080%2C%20paddingHorizontal%3A%2016%2C%20backgroundColor%3A%20%22%23f0f0f0%22%20%7D%2C%0A%20%20darkScreen%3A%20%7B%20backgroundColor%3A%20%22%23222%22%20%7D%2C%0A%20%20title%3A%20%7B%20fontSize%3A%2022%2C%20marginBottom%3A%2016%2C%20color%3A%20%22%23222%22%20%7D%2C%0A%20%20lightText%3A%20%7B%20color%3A%20%22%23fff%22%20%7D%2C%0A%20%20highlight%3A%20%7B%20fontWeight%3A%20%22bold%22%2C%20color%3A%20%22tomato%22%20%7D%2C%0A%20%20card%3A%20%7B%0A%20%20%20%20backgroundColor%3A%20%22%23fff%22%2C%0A%20%20%20%20borderRadius%3A%2012%2C%0A%20%20%20%20padding%3A%208%2C%0A%20%20%20%20...Platform.select%28%7B%0A%20%20%20%20%20%20ios%3A%20%7B%20shadowColor%3A%20%22%23000%22%2C%20shadowOffset%3A%20%7B%20width%3A%200%2C%20height%3A%202%20%7D%2C%20shadowOpacity%3A%200.2%2C%20shadowRadius%3A%204%20%7D%2C%0A%20%20%20%20%20%20android%3A%20%7B%20elevation%3A%204%20%7D%2C%0A%20%20%20%20%20%20default%3A%20%7B%20borderWidth%3A%201%2C%20borderColor%3A%20%22%23ddd%22%20%7D%2C%0A%20%20%20%20%7D%29%2C%0A%20%20%7D%2C%0A%20%20row%3A%20%7B%0A%20%20%20%20flexDirection%3A%20%22row%22%2C%0A%20%20%20%20justifyContent%3A%20%22space-between%22%2C%0A%20%20%20%20alignItems%3A%20%22center%22%2C%0A%20%20%20%20padding%3A%2012%2C%0A%20%20%7D%2C%0A%20%20label%3A%20%7B%20fontSize%3A%2018%20%7D%2C%0A%7D%29%3B%0A)** (SDK 54, 필요한 패키지 자동 포함)

**해설**: `row`는 가로 배치라서 `justifyContent: "space-between"`이 **가로** 양끝(글자 왼쪽, 스위치 오른쪽), `alignItems: "center"`가 **세로** 가운데예요. 제목의 플랫폼 이름은 Text 안의 Text라 크기 22를 물려받고 색과 굵기만 바뀌어요.
