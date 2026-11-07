# Week 2. 이벤트와 State: 버튼을 누르면 화면이 바뀌게 만들기

> 이 노트 읽는 법: **📘/💻/🧪 원문**(영어 그대로) 바로 밑에 **🇰🇷 한글 해설**이 있어요. 코드 밑의 **▶ Snack에서 바로 실행하기**를 누르면 그 코드가 Expo Snack에서 열려요.

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


## 목차

- 1. 📘 코스노트: Event Handling
- 2. 📘 코스노트: Hooks for Stateful Components
- 3. 📘 코스노트: Class Components (Optional)
- 4. 💻 인클래스 예제: Week 2.1 - Notes and Examples
- 5. 💻 인클래스 예제: Week 2.2 - Notes and Examples
- 6. 🧪 Lab: Lab 2 - React Native, Events, and State
- ✅ Week 2 시험 대비 체크리스트


---

## 1. 📘 코스노트: Event Handling

> 원문 출처: https://seneca-ictoer.github.io/WEB530/B-Components/events

### 📘 Event Handlers

An **event handler** is a callback function that is triggered once an event takes place. For example, this could be a button click or when the value of a text box is changed. In React, we can configure event handlers on components by modifying the JSX. Let's take a look at a simple example. When the button is clicked, the status is changed from `Waiting` to `Clicked`.

```jsx
import { useState } from 'react';
import { View, Text, Button } from 'react-native';

export default function App() {
  const [status, setStatus] = useState('Waiting');

  return (
    <View>
      <Text>Status: {status}</Text>
      <Button title="Click Me" onPress={(e) => setStatus('Clicked')} />
    </View>
  );
}
```

▶ **[Snack에서 바로 실행하기](https://snack.expo.dev/?name=WEB530%20W2%20Event%20Handlers&platform=web&sdkVersion=54.0.0&code=import%20%7B%20useState%20%7D%20from%20%27react%27%3B%0Aimport%20%7B%20View%2C%20Text%2C%20Button%20%7D%20from%20%27react-native%27%3B%0A%0Aexport%20default%20function%20App%28%29%20%7B%0A%20%20const%20%5Bstatus%2C%20setStatus%5D%20%3D%20useState%28%27Waiting%27%29%3B%0A%0A%20%20return%20%28%0A%20%20%20%20%3CView%3E%0A%20%20%20%20%20%20%3CText%3EStatus%3A%20%7Bstatus%7D%3C%2FText%3E%0A%20%20%20%20%20%20%3CButton%20title%3D%22Click%20Me%22%20onPress%3D%7B%28e%29%20%3D%3E%20setStatus%28%27Clicked%27%29%7D%20%2F%3E%0A%20%20%20%20%3C%2FView%3E%0A%20%20%29%3B%0A%7D%0A)** (SDK 54, 필요한 패키지 자동 포함) <button class="snack-embed" type="button">👀 여기서 결과 보기</button>



You can see that an event handler is attached within the JSX by adding the appropriate attribute. In the previous example, we have added `onPress={(e) => setStatus('Clicked')}` to the `<Button>` component. The handler is defined inline using arrow function syntax.

When you assign an event handler, React adds the handler to an internal dictionary of events and functions. Tracking events in this way allows React to keep the declarative UI structures separate from the platform we are running on. For example, if we are running our App in a browser, events are not attached to the underlying DOM element. Instead, there is a single event handler on the root of the app. Once fired, an event **bubbles up** through the tree to the root. React sees the event, checks its internal mapping, then runs the appropriate function. It may seem like a lot of effort but the benefits are plentiful. Since we don't rely on the DOM (or the specifics of the OS), we can wire up events using the same method on all platforms.

As we just learned, we will define events directly in our JSX markup. React uses a declarative approach for setting up event handlers. An advantage to this approach is that event handlers in JSX markup are part of the UI structure. If you compare this to something like JQuery, in JQuery you write imperative code that selects the relevant DOM element and attaches event handler functions. You are left no choice but to track down code that assigns event handlers making debugging and understanding program flow more difficult.

In the code example above, the event handler was coded inline within the JSX using arrow function syntax. This is handy if your function is simple but there are times when you need to perform multiple operations or add complex logic. In these cases, you can move the handler logic to a separate function, then call that function instead.

```jsx
import { useState } from 'react';
import { View, Text, Button } from 'react-native';

export default function App() {
  const [status, setStatus] = useState('Waiting');

  const buttonClicked = () => {
    // Do a bunch of things here.
    setStatus('Clicked');
  };

  return (
    <View>
      <Text>Status: {status}</Text>
      <Button title="Click Me" onPress={buttonClicked} />
    </View>
  );
}
```

▶ **[Snack에서 바로 실행하기](https://snack.expo.dev/?name=WEB530%20W2%20Event%20Handlers&platform=web&sdkVersion=54.0.0&code=import%20%7B%20useState%20%7D%20from%20%27react%27%3B%0Aimport%20%7B%20View%2C%20Text%2C%20Button%20%7D%20from%20%27react-native%27%3B%0A%0Aexport%20default%20function%20App%28%29%20%7B%0A%20%20const%20%5Bstatus%2C%20setStatus%5D%20%3D%20useState%28%27Waiting%27%29%3B%0A%0A%20%20const%20buttonClicked%20%3D%20%28%29%20%3D%3E%20%7B%0A%20%20%20%20%2F%2F%20Do%20a%20bunch%20of%20things%20here.%0A%20%20%20%20setStatus%28%27Clicked%27%29%3B%0A%20%20%7D%3B%0A%0A%20%20return%20%28%0A%20%20%20%20%3CView%3E%0A%20%20%20%20%20%20%3CText%3EStatus%3A%20%7Bstatus%7D%3C%2FText%3E%0A%20%20%20%20%20%20%3CButton%20title%3D%22Click%20Me%22%20onPress%3D%7BbuttonClicked%7D%20%2F%3E%0A%20%20%20%20%3C%2FView%3E%0A%20%20%29%3B%0A%7D%0A)** (SDK 54, 필요한 패키지 자동 포함) <button class="snack-embed" type="button">👀 여기서 결과 보기</button>



It is also possible to pass arguments to event handlers. In the following code example, we are rendering a list of buttons using the objects contained in the `players` array. When a button is clicked, the text is replaced to include the name of the player object associated to the button that was clicked. This code example combines many of the topics we have learned so far.

```jsx
import { Component } from 'react';
import { View, Text, Button } from 'react-native';

class PlayerList extends Component {
  // Initially, the user has not picked their favourite player.
  state = {
    favouritePlayer: null,
  };

  // Event handler for the button onPress event.
  // We only define a single function, it will handle the onPress
  // event for all of the buttons. It accepts an argument.
  onPlayerSelected(number) {
    // Find the object associated to the number of the player.
    const { name } = this.props.players.find((i) => i.number === number);

    this.setState({ favouritePlayer: name });
  }

  render() {
    const { favouritePlayer } = this.state;

    // Conditionally render the <Text> element.
    let text;

    if (favouritePlayer) text = <Text>Your favourite player is {favouritePlayer}</Text>;
    else text = <Text>Choose your favourite player ...</Text>;

    return (
      <View>
        {text}
        {this.props.players.map(({ number, name }) => (
          // We must bind the event handler context in order for the function to access the
          // component, specifically the setState() function. In addition, pass the player.number
          // as an argument to the handler.
          <Button key={number} title={name} onPress={this.onPlayerSelected.bind(this, number)} />
        ))}
      </View>
    );
  }
}

export default function App() {
  // An array of objects passed to the <PlayerList> component as a
  // prop called players. Each player object will render its own <Button>
  const players = [
    { number: 34, name: 'Auston Matthews' },
    { number: 91, name: 'John Tavares' },
    { number: 63, name: 'Matias Maccelli' },
  ];

  return <PlayerList players={players} />;
}
```

▶ **[Snack에서 바로 실행하기](https://snack.expo.dev/?name=WEB530%20W2%20Event%20Handlers&platform=web&sdkVersion=54.0.0&code=import%20%7B%20Component%20%7D%20from%20%27react%27%3B%0Aimport%20%7B%20View%2C%20Text%2C%20Button%20%7D%20from%20%27react-native%27%3B%0A%0Aclass%20PlayerList%20extends%20Component%20%7B%0A%20%20%2F%2F%20Initially%2C%20the%20user%20has%20not%20picked%20their%20favourite%20player.%0A%20%20state%20%3D%20%7B%0A%20%20%20%20favouritePlayer%3A%20null%2C%0A%20%20%7D%3B%0A%0A%20%20%2F%2F%20Event%20handler%20for%20the%20button%20onPress%20event.%0A%20%20%2F%2F%20We%20only%20define%20a%20single%20function%2C%20it%20will%20handle%20the%20onPress%0A%20%20%2F%2F%20event%20for%20all%20of%20the%20buttons.%20It%20accepts%20an%20argument.%0A%20%20onPlayerSelected%28number%29%20%7B%0A%20%20%20%20%2F%2F%20Find%20the%20object%20associated%20to%20the%20number%20of%20the%20player.%0A%20%20%20%20const%20%7B%20name%20%7D%20%3D%20this.props.players.find%28%28i%29%20%3D%3E%20i.number%20%3D%3D%3D%20number%29%3B%0A%0A%20%20%20%20this.setState%28%7B%20favouritePlayer%3A%20name%20%7D%29%3B%0A%20%20%7D%0A%0A%20%20render%28%29%20%7B%0A%20%20%20%20const%20%7B%20favouritePlayer%20%7D%20%3D%20this.state%3B%0A%0A%20%20%20%20%2F%2F%20Conditionally%20render%20the%20%3CText%3E%20element.%0A%20%20%20%20let%20text%3B%0A%0A%20%20%20%20if%20%28favouritePlayer%29%20text%20%3D%20%3CText%3EYour%20favourite%20player%20is%20%7BfavouritePlayer%7D%3C%2FText%3E%3B%0A%20%20%20%20else%20text%20%3D%20%3CText%3EChoose%20your%20favourite%20player%20...%3C%2FText%3E%3B%0A%0A%20%20%20%20return%20%28%0A%20%20%20%20%20%20%3CView%3E%0A%20%20%20%20%20%20%20%20%7Btext%7D%0A%20%20%20%20%20%20%20%20%7Bthis.props.players.map%28%28%7B%20number%2C%20name%20%7D%29%20%3D%3E%20%28%0A%20%20%20%20%20%20%20%20%20%20%2F%2F%20We%20must%20bind%20the%20event%20handler%20context%20in%20order%20for%20the%20function%20to%20access%20the%0A%20%20%20%20%20%20%20%20%20%20%2F%2F%20component%2C%20specifically%20the%20setState%28%29%20function.%20In%20addition%2C%20pass%20the%20player.number%0A%20%20%20%20%20%20%20%20%20%20%2F%2F%20as%20an%20argument%20to%20the%20handler.%0A%20%20%20%20%20%20%20%20%20%20%3CButton%20key%3D%7Bnumber%7D%20title%3D%7Bname%7D%20onPress%3D%7Bthis.onPlayerSelected.bind%28this%2C%20number%29%7D%20%2F%3E%0A%20%20%20%20%20%20%20%20%29%29%7D%0A%20%20%20%20%20%20%3C%2FView%3E%0A%20%20%20%20%29%3B%0A%20%20%7D%0A%7D%0A%0Aexport%20default%20function%20App%28%29%20%7B%0A%20%20%2F%2F%20An%20array%20of%20objects%20passed%20to%20the%20%3CPlayerList%3E%20component%20as%20a%0A%20%20%2F%2F%20prop%20called%20players.%20Each%20player%20object%20will%20render%20its%20own%20%3CButton%3E%0A%20%20const%20players%20%3D%20%5B%0A%20%20%20%20%7B%20number%3A%2034%2C%20name%3A%20%27Auston%20Matthews%27%20%7D%2C%0A%20%20%20%20%7B%20number%3A%2091%2C%20name%3A%20%27John%20Tavares%27%20%7D%2C%0A%20%20%20%20%7B%20number%3A%2063%2C%20name%3A%20%27Matias%20Maccelli%27%20%7D%2C%0A%20%20%5D%3B%0A%0A%20%20return%20%3CPlayerList%20players%3D%7Bplayers%7D%20%2F%3E%3B%0A%7D%0A)** (SDK 54, 필요한 패키지 자동 포함) <button class="snack-embed" type="button">👀 여기서 결과 보기</button>



**🇰🇷 한글 해설**

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

### 📘 Synthetic Events

We discovered that events are bubbled up and handled by an internal mapping system. This allows for a more uniform approach for handling events that can be shared across different browsers or devices. React wraps each native event in an object with the same interface on every platform. These wrapped events are called **synthetic events**.

💡 **Event pooling (older React only)**
You may read in older tutorials that React reuses ("pools") synthetic event objects, so reading `e.target` inside asynchronous code fails. React 17 removed event pooling. In current React and React Native, an event object keeps its properties for as long as your code needs them.

**🇰🇷 한글 해설**

**Synthetic event(합성 이벤트)**: React가 각 플랫폼의 진짜(native) 이벤트를 **똑같은 모양의 객체로 포장**한 것. 그래서 어느 브라우저, 어느 기기든 같은 방식으로 다룰 수 있어요.

Event pooling(이벤트 풀링)은 옛날 React(16 이하) 이야기예요. React 17부터 없어졌어요. 지금은 이벤트 객체를 비동기 코드 안에서 읽어도 괜찮아요.


---

## 2. 📘 코스노트: Hooks for Stateful Components

> 원문 출처: https://seneca-ictoer.github.io/WEB530/B-Components/hooks

### 📘 Introduction to Hooks

The React Hook API introduces the `useState()` function. `useState()` enables your functional component to become stateful, i.e. it can remember things between each time it is called. Let's look at a code example. In the example we will configure and use initial state values.

```jsx
import { useState } from 'react';
import { View, Text } from 'react-native';

export default function App() {
  const [name] = useState('WEB530');
  const [year] = useState(1967);

  return (
    <View>
      <Text>Welcome to {name}</Text>
      <Text>Established in {year}</Text>
    </View>
  );
}
```

▶ **[Snack에서 바로 실행하기](https://snack.expo.dev/?name=WEB530%20W2%20Introduction%20to%20Hooks&platform=web&sdkVersion=54.0.0&code=import%20%7B%20useState%20%7D%20from%20%27react%27%3B%0Aimport%20%7B%20View%2C%20Text%20%7D%20from%20%27react-native%27%3B%0A%0Aexport%20default%20function%20App%28%29%20%7B%0A%20%20const%20%5Bname%5D%20%3D%20useState%28%27WEB530%27%29%3B%0A%20%20const%20%5Byear%5D%20%3D%20useState%281967%29%3B%0A%0A%20%20return%20%28%0A%20%20%20%20%3CView%3E%0A%20%20%20%20%20%20%3CText%3EWelcome%20to%20%7Bname%7D%3C%2FText%3E%0A%20%20%20%20%20%20%3CText%3EEstablished%20in%20%7Byear%7D%3C%2FText%3E%0A%20%20%20%20%3C%2FView%3E%0A%20%20%29%3B%0A%7D%0A)** (SDK 54, 필요한 패키지 자동 포함) <button class="snack-embed" type="button">👀 여기서 결과 보기</button>


Welcome to WEB530
Established in 1967


The `App` component is a *stateful* functional component thanks to the `useState()` hook. The example initializes two pieces of state, `name` and `year`, by calling `useState()` once for each state value. You can have as many pieces of state that you need, simply call `useState()` for each. Although it is possible to store a JavaScript object as a state value, it can complicate things and isn't recommended.

Look closely at the code example. You will notice that when we call `useState()`, square brackets surround the variable name. Check out line 5 where it says `[name]`. The reason we use the brackets is because `useState()` returns an array and so can take advantage of array destructuring syntax. The first value of the array is the state value, this is later injected into the UI. The second value of the array is a function that can be used to update the value. Since we are not changing the state, we discard this value. Now let's check out an example where the state is changed.

```jsx
import React, { useState } from 'react';
import { View, Text, TextInput } from 'react-native';

export default function App() {
  // Notice we are destructuring a second variable,
  // it is used for changing the "name" state value.
  const [name, setName] = useState('Paula');

  return (
    <View>
      <Text>What is your name?</Text>
      <TextInput value={name} onChangeText={setName} />
      <Text>Your name is {name}.</Text>
    </View>
  );
}
```

▶ **[Snack에서 바로 실행하기](https://snack.expo.dev/?name=WEB530%20W2%20Introduction%20to%20Hooks&platform=web&sdkVersion=54.0.0&code=import%20React%2C%20%7B%20useState%20%7D%20from%20%27react%27%3B%0Aimport%20%7B%20View%2C%20Text%2C%20TextInput%20%7D%20from%20%27react-native%27%3B%0A%0Aexport%20default%20function%20App%28%29%20%7B%0A%20%20%2F%2F%20Notice%20we%20are%20destructuring%20a%20second%20variable%2C%0A%20%20%2F%2F%20it%20is%20used%20for%20changing%20the%20%22name%22%20state%20value.%0A%20%20const%20%5Bname%2C%20setName%5D%20%3D%20useState%28%27Paula%27%29%3B%0A%0A%20%20return%20%28%0A%20%20%20%20%3CView%3E%0A%20%20%20%20%20%20%3CText%3EWhat%20is%20your%20name%3F%3C%2FText%3E%0A%20%20%20%20%20%20%3CTextInput%20value%3D%7Bname%7D%20onChangeText%3D%7BsetName%7D%20%2F%3E%0A%20%20%20%20%20%20%3CText%3EYour%20name%20is%20%7Bname%7D.%3C%2FText%3E%0A%20%20%20%20%3C%2FView%3E%0A%20%20%29%3B%0A%7D%0A)** (SDK 54, 필요한 패키지 자동 포함) <button class="snack-embed" type="button">👀 여기서 결과 보기</button>


What is your name?
Paula
Your name is Paula.


In the code example, you will notice we now destructure multiple variables from the array returned by `useState()`. `setName` refers to a function that can be used to change the State. The code above automatically calls the `setName()` function any time the text is changed but we could call it manually using something like `setName("New Name")`. After `setName()` is called the `name` is updated and the UI refreshed.

With functional components that use the `useState()` hook, you can see that we will need to update each piece of state individually. Unlike `setState()` where we could merge multiple pieces of state at the same time, we now have individual functions.

**🇰🇷 한글 해설**

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

#### 📘 Updating state based on the previous value

There is one trap with the setter function. The state variable is a plain value that was filled in when the component rendered. It does not change until the next render. If the new value depends on the old one, calculating it from the variable can go wrong. In the example, the button is meant to add 2 by calling `setCount()` twice.

```jsx
import { useState } from 'react';
import { View, Text, Button } from 'react-native';

export default function App() {
  const [count, setCount] = useState(0);

  return (
    <View>
      <Text>Count: {count}</Text>
      <Button
        title="Add 2"
        onPress={() => {
          // Bug: both calls read the same count.
          setCount(count + 1);
          setCount(count + 1);
        }}
      />
    </View>
  );
}
```

▶ **[Snack에서 바로 실행하기](https://snack.expo.dev/?name=WEB530%20W2%20Introduction%20to%20Hooks%20-%20Updating%20state%20based%20on%20th&platform=web&sdkVersion=54.0.0&code=import%20%7B%20useState%20%7D%20from%20%27react%27%3B%0Aimport%20%7B%20View%2C%20Text%2C%20Button%20%7D%20from%20%27react-native%27%3B%0A%0Aexport%20default%20function%20App%28%29%20%7B%0A%20%20const%20%5Bcount%2C%20setCount%5D%20%3D%20useState%280%29%3B%0A%0A%20%20return%20%28%0A%20%20%20%20%3CView%3E%0A%20%20%20%20%20%20%3CText%3ECount%3A%20%7Bcount%7D%3C%2FText%3E%0A%20%20%20%20%20%20%3CButton%0A%20%20%20%20%20%20%20%20title%3D%22Add%202%22%0A%20%20%20%20%20%20%20%20onPress%3D%7B%28%29%20%3D%3E%20%7B%0A%20%20%20%20%20%20%20%20%20%20%2F%2F%20Bug%3A%20both%20calls%20read%20the%20same%20count.%0A%20%20%20%20%20%20%20%20%20%20setCount%28count%20%2B%201%29%3B%0A%20%20%20%20%20%20%20%20%20%20setCount%28count%20%2B%201%29%3B%0A%20%20%20%20%20%20%20%20%7D%7D%0A%20%20%20%20%20%20%2F%3E%0A%20%20%20%20%3C%2FView%3E%0A%20%20%29%3B%0A%7D%0A)** (SDK 54, 필요한 패키지 자동 포함) <button class="snack-embed" type="button">👀 여기서 결과 보기</button>


Count: 0

⬇️ *after pressing the button once*

Count: 1


The count goes up by 1, not 2. Both calls read the same `count` of `0`, so both ask React to make it `1`. The same thing happens when the update is delayed by a timer or an effect: the code uses whichever value `count` had when it was written, not the current one.

The fix is to pass a function to the setter instead of a value. React calls the function with the latest state and uses whatever it returns.

```jsx
onPress={() => {
  setCount((prev) => prev + 1);
  setCount((prev) => prev + 1);
}}
```

Now each call receives the value produced by the one before it and the count goes up by 2.

💡 Whenever the new state depends on the old state, always use the function form: `setCount((prev) => prev + 1)`, `setOn((prev) => !prev)`, `setItems((prev) => [...prev, item])`. If it does not, such as `setName('Paula')`, pass the value directly.

**🇰🇷 한글 해설**

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

### 📘 Running Side Effects with `useEffect`

The `useEffect()` hook is used to run "side effects" in your component. Remember, functional components only have one job, that is, to return JSX content. If a component needs to do something else this should be done by a `useEffect()` hook.

So, what kind of initialization or cleanup would a component need to handle? There are many reasons for developers to implement this functionality. A common example could be, loading data. You could use the `fetch API` to fetch data from a remote device and display it on your UI. Fetching is an asynchronous operation and if not implemented correctly, may introduce race conditions or buggy behaviour. Using `useEffect()` we can minimize these problems.

💡 **Race condition**
Occurs when the sequence or timing of events is important. A race condition can occur when events execute in an undesirable order. [Still unclear?](https://techterms.com/definition/race_condition)

The `useEffect()` hook takes two arguments: a function to run, and an optional **dependency array**. React calls the function after the component finishes rendering. An empty array (`[]`) means the effect doesn't depend on any props or state, so it runs only once, after the first render.

```jsx
import { useEffect, useState } from 'react';
import { View, Text } from 'react-native';

// A utility function to fake a call to the fetch API.
// This returns user information after 2 seconds.
function fetchUser() {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ id: 99, name: 'Wayne' });
    }, 2000);
  });
}

export default function App() {
  const [id, setId] = useState(0);
  const [name, setName] = useState('');
  const [status, setStatus] = useState('Loading ...');

  // Runs once, after the first render.
  useEffect(() => {
    fetchUser().then((user) => {
      setId(user.id);
      setName(user.name);
      setStatus('Ready ...');
    });
  }, []);

  return (
    <View>
      <Text>ID: {id}</Text>
      <Text>Name: {name}</Text>
      <Text>Status: {status}</Text>
    </View>
  );
}
```

▶ **[Snack에서 바로 실행하기](https://snack.expo.dev/?name=WEB530%20W2%20Running%20Side%20Effects%20with%20%60useEffect%60&platform=web&sdkVersion=54.0.0&code=import%20%7B%20useEffect%2C%20useState%20%7D%20from%20%27react%27%3B%0Aimport%20%7B%20View%2C%20Text%20%7D%20from%20%27react-native%27%3B%0A%0A%2F%2F%20A%20utility%20function%20to%20fake%20a%20call%20to%20the%20fetch%20API.%0A%2F%2F%20This%20returns%20user%20information%20after%202%20seconds.%0Afunction%20fetchUser%28%29%20%7B%0A%20%20return%20new%20Promise%28%28resolve%29%20%3D%3E%20%7B%0A%20%20%20%20setTimeout%28%28%29%20%3D%3E%20%7B%0A%20%20%20%20%20%20resolve%28%7B%20id%3A%2099%2C%20name%3A%20%27Wayne%27%20%7D%29%3B%0A%20%20%20%20%7D%2C%202000%29%3B%0A%20%20%7D%29%3B%0A%7D%0A%0Aexport%20default%20function%20App%28%29%20%7B%0A%20%20const%20%5Bid%2C%20setId%5D%20%3D%20useState%280%29%3B%0A%20%20const%20%5Bname%2C%20setName%5D%20%3D%20useState%28%27%27%29%3B%0A%20%20const%20%5Bstatus%2C%20setStatus%5D%20%3D%20useState%28%27Loading%20...%27%29%3B%0A%0A%20%20%2F%2F%20Runs%20once%2C%20after%20the%20first%20render.%0A%20%20useEffect%28%28%29%20%3D%3E%20%7B%0A%20%20%20%20fetchUser%28%29.then%28%28user%29%20%3D%3E%20%7B%0A%20%20%20%20%20%20setId%28user.id%29%3B%0A%20%20%20%20%20%20setName%28user.name%29%3B%0A%20%20%20%20%20%20setStatus%28%27Ready%20...%27%29%3B%0A%20%20%20%20%7D%29%3B%0A%20%20%7D%2C%20%5B%5D%29%3B%0A%0A%20%20return%20%28%0A%20%20%20%20%3CView%3E%0A%20%20%20%20%20%20%3CText%3EID%3A%20%7Bid%7D%3C%2FText%3E%0A%20%20%20%20%20%20%3CText%3EName%3A%20%7Bname%7D%3C%2FText%3E%0A%20%20%20%20%20%20%3CText%3EStatus%3A%20%7Bstatus%7D%3C%2FText%3E%0A%20%20%20%20%3C%2FView%3E%0A%20%20%29%3B%0A%7D%0A)** (SDK 54, 필요한 패키지 자동 포함) <button class="snack-embed" type="button">👀 여기서 결과 보기</button>


ID: 0
Name:
Status: Loading ...

⬇️ *after about two seconds*

ID: 99
Name: Wayne
Status: Ready ...


Leave out the array and the effect runs after *every* render. Because this effect updates state, and updating state causes another render, the user would be fetched again every time the first fetch finished.

**🇰🇷 한글 해설**

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

#### 📘 Cleaning up an effect

After about two seconds, the user is fetched and the UI is updated. But the user might leave the screen before the response arrives. The `.then()` callback still runs later and tries to update a component that no longer exists. React ignores that update, but the work is wasted, and the same pattern causes real bugs when an effect runs more than once: a slow, older response can arrive after a newer one and overwrite it.

To handle this, an effect can return a **cleanup function**. React calls it when the component is removed from the screen (unmounted), and also before it runs the effect again. Promises can't be cancelled, so the usual pattern is a flag that tells the callback to ignore a result that is no longer wanted.

```jsx
import { useEffect, useState } from 'react';
import { View, Text } from 'react-native';

// A utility function to fake a call to the fetch API.
// This returns user information after 2 seconds.
function fetchUser() {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ id: 99, name: 'Wayne' });
    }, 2000);
  });
}

export default function App() {
  const [id, setId] = useState(0);
  const [name, setName] = useState('');
  const [status, setStatus] = useState('Loading ...');

  useEffect(() => {
    let ignore = false;

    fetchUser().then((user) => {
      // Skip the update if the cleanup has already run.
      if (!ignore) {
        setId(user.id);
        setName(user.name);
        setStatus('Ready ...');
      }
    });

    // The cleanup function.
    return () => {
      ignore = true;
    };
  }, []);

  return (
    <View>
      <Text>ID: {id}</Text>
      <Text>Name: {name}</Text>
      <Text>Status: {status}</Text>
    </View>
  );
}
```

▶ **[Snack에서 바로 실행하기](https://snack.expo.dev/?name=WEB530%20W2%20Running%20Side%20Effects%20with%20%60useEffect%60%20-%20Cleaning%20u&platform=web&sdkVersion=54.0.0&code=import%20%7B%20useEffect%2C%20useState%20%7D%20from%20%27react%27%3B%0Aimport%20%7B%20View%2C%20Text%20%7D%20from%20%27react-native%27%3B%0A%0A%2F%2F%20A%20utility%20function%20to%20fake%20a%20call%20to%20the%20fetch%20API.%0A%2F%2F%20This%20returns%20user%20information%20after%202%20seconds.%0Afunction%20fetchUser%28%29%20%7B%0A%20%20return%20new%20Promise%28%28resolve%29%20%3D%3E%20%7B%0A%20%20%20%20setTimeout%28%28%29%20%3D%3E%20%7B%0A%20%20%20%20%20%20resolve%28%7B%20id%3A%2099%2C%20name%3A%20%27Wayne%27%20%7D%29%3B%0A%20%20%20%20%7D%2C%202000%29%3B%0A%20%20%7D%29%3B%0A%7D%0A%0Aexport%20default%20function%20App%28%29%20%7B%0A%20%20const%20%5Bid%2C%20setId%5D%20%3D%20useState%280%29%3B%0A%20%20const%20%5Bname%2C%20setName%5D%20%3D%20useState%28%27%27%29%3B%0A%20%20const%20%5Bstatus%2C%20setStatus%5D%20%3D%20useState%28%27Loading%20...%27%29%3B%0A%0A%20%20useEffect%28%28%29%20%3D%3E%20%7B%0A%20%20%20%20let%20ignore%20%3D%20false%3B%0A%0A%20%20%20%20fetchUser%28%29.then%28%28user%29%20%3D%3E%20%7B%0A%20%20%20%20%20%20%2F%2F%20Skip%20the%20update%20if%20the%20cleanup%20has%20already%20run.%0A%20%20%20%20%20%20if%20%28%21ignore%29%20%7B%0A%20%20%20%20%20%20%20%20setId%28user.id%29%3B%0A%20%20%20%20%20%20%20%20setName%28user.name%29%3B%0A%20%20%20%20%20%20%20%20setStatus%28%27Ready%20...%27%29%3B%0A%20%20%20%20%20%20%7D%0A%20%20%20%20%7D%29%3B%0A%0A%20%20%20%20%2F%2F%20The%20cleanup%20function.%0A%20%20%20%20return%20%28%29%20%3D%3E%20%7B%0A%20%20%20%20%20%20ignore%20%3D%20true%3B%0A%20%20%20%20%7D%3B%0A%20%20%7D%2C%20%5B%5D%29%3B%0A%0A%20%20return%20%28%0A%20%20%20%20%3CView%3E%0A%20%20%20%20%20%20%3CText%3EID%3A%20%7Bid%7D%3C%2FText%3E%0A%20%20%20%20%20%20%3CText%3EName%3A%20%7Bname%7D%3C%2FText%3E%0A%20%20%20%20%20%20%3CText%3EStatus%3A%20%7Bstatus%7D%3C%2FText%3E%0A%20%20%20%20%3C%2FView%3E%0A%20%20%29%3B%0A%7D%0A)** (SDK 54, 필요한 패키지 자동 포함) <button class="snack-embed" type="button">👀 여기서 결과 보기</button>



By adding `return () => { ... }` to the end of the effect, React now knows how to clean it up. If the component unmounts before the user arrives, `ignore` is set to `true` and the callback leaves the state alone.

**🇰🇷 한글 해설**

effect가 **return 하는 함수 = cleanup(정리) 함수**.

React가 cleanup을 부르는 때 (시험 포인트!):
1. 컴포넌트가 화면에서 **사라질 때(unmount)**
2. effect를 **다시 실행하기 직전**

Promise는 취소가 안 돼서 `ignore` **깃발(flag)** 패턴을 써요.
- effect 시작: `let ignore = false;`
- 응답 오면: `if (!ignore)` 일 때만 state 변경.
- cleanup: `ignore = true;` → "이제 그 답은 무시해."

비유: 피자를 주문했는데 그 사이 이사를 갔어요. cleanup은 "이전 주소로 오는 피자는 받지 마"라고 메모를 남기는 거예요.

#### 📘 Effects that depend on a value

When an effect uses props or state, list them in the dependency array. After each render, React compares every value in the array with the one from the previous render. If any of them changed, React runs the previous cleanup and then runs the effect again.

In the example below, the user to load depends on `userId`. Pressing a button changes the ID, so the effect fetches that user. Try pressing **User 1** and then quickly **User 2**. The cleanup for the first request runs as soon as the ID changes, so its late response can't overwrite the second user.

```jsx
import { useEffect, useState } from 'react';
import { View, Text, Button } from 'react-native';

const names = { 1: 'Wayne', 2: 'Mario' };

// Fakes a call to the fetch API. User 1 takes 3 seconds, user 2 takes 1.
function fetchUser(id) {
  return new Promise((resolve) => {
    setTimeout(() => resolve({ id, name: names[id] }), id === 1 ? 3000 : 1000);
  });
}

export default function App() {
  const [userId, setUserId] = useState(1);
  const [user, setUser] = useState(null);

  useEffect(() => {
    let ignore = false;
    setUser(null);

    fetchUser(userId).then((result) => {
      if (!ignore) setUser(result);
    });

    return () => {
      ignore = true;
    };
  }, [userId]); // Run again whenever userId changes.

  return (
    <View>
      <Text>Selected user: {userId}</Text>
      <Text>Name: {user ? user.name : 'Loading ...'}</Text>
      <Button title="User 1" onPress={() => setUserId(1)} />
      <Button title="User 2" onPress={() => setUserId(2)} />
    </View>
  );
}
```

▶ **[Snack에서 바로 실행하기](https://snack.expo.dev/?name=WEB530%20W2%20Running%20Side%20Effects%20with%20%60useEffect%60%20-%20Effects%20th&platform=web&sdkVersion=54.0.0&code=import%20%7B%20useEffect%2C%20useState%20%7D%20from%20%27react%27%3B%0Aimport%20%7B%20View%2C%20Text%2C%20Button%20%7D%20from%20%27react-native%27%3B%0A%0Aconst%20names%20%3D%20%7B%201%3A%20%27Wayne%27%2C%202%3A%20%27Mario%27%20%7D%3B%0A%0A%2F%2F%20Fakes%20a%20call%20to%20the%20fetch%20API.%20User%201%20takes%203%20seconds%2C%20user%202%20takes%201.%0Afunction%20fetchUser%28id%29%20%7B%0A%20%20return%20new%20Promise%28%28resolve%29%20%3D%3E%20%7B%0A%20%20%20%20setTimeout%28%28%29%20%3D%3E%20resolve%28%7B%20id%2C%20name%3A%20names%5Bid%5D%20%7D%29%2C%20id%20%3D%3D%3D%201%20%3F%203000%20%3A%201000%29%3B%0A%20%20%7D%29%3B%0A%7D%0A%0Aexport%20default%20function%20App%28%29%20%7B%0A%20%20const%20%5BuserId%2C%20setUserId%5D%20%3D%20useState%281%29%3B%0A%20%20const%20%5Buser%2C%20setUser%5D%20%3D%20useState%28null%29%3B%0A%0A%20%20useEffect%28%28%29%20%3D%3E%20%7B%0A%20%20%20%20let%20ignore%20%3D%20false%3B%0A%20%20%20%20setUser%28null%29%3B%0A%0A%20%20%20%20fetchUser%28userId%29.then%28%28result%29%20%3D%3E%20%7B%0A%20%20%20%20%20%20if%20%28%21ignore%29%20setUser%28result%29%3B%0A%20%20%20%20%7D%29%3B%0A%0A%20%20%20%20return%20%28%29%20%3D%3E%20%7B%0A%20%20%20%20%20%20ignore%20%3D%20true%3B%0A%20%20%20%20%7D%3B%0A%20%20%7D%2C%20%5BuserId%5D%29%3B%20%2F%2F%20Run%20again%20whenever%20userId%20changes.%0A%0A%20%20return%20%28%0A%20%20%20%20%3CView%3E%0A%20%20%20%20%20%20%3CText%3ESelected%20user%3A%20%7BuserId%7D%3C%2FText%3E%0A%20%20%20%20%20%20%3CText%3EName%3A%20%7Buser%20%3F%20user.name%20%3A%20%27Loading%20...%27%7D%3C%2FText%3E%0A%20%20%20%20%20%20%3CButton%20title%3D%22User%201%22%20onPress%3D%7B%28%29%20%3D%3E%20setUserId%281%29%7D%20%2F%3E%0A%20%20%20%20%20%20%3CButton%20title%3D%22User%202%22%20onPress%3D%7B%28%29%20%3D%3E%20setUserId%282%29%7D%20%2F%3E%0A%20%20%20%20%3C%2FView%3E%0A%20%20%29%3B%0A%7D%0A)** (SDK 54, 필요한 패키지 자동 포함) <button class="snack-embed" type="button">👀 여기서 결과 보기</button>



Without the `ignore` flag, pressing **User 1** then **User 2** would show Mario first and then, when the slower request finished, replace him with Wayne even though user 2 is selected.

💡 A real `fetch()` request can be cancelled, not just ignored. Create an [`AbortController`](https://developer.mozilla.org/en-US/docs/Web/API/AbortController), pass its `signal` to `fetch()`, and call `controller.abort()` in the cleanup function.

**🇰🇷 한글 해설**

effect가 props나 state를 쓰면 **의존성 배열에 넣어요**. React는 렌더링마다 배열 값을 이전과 비교해서 바뀌었으면 **이전 cleanup 실행 → effect 다시 실행**.

예제: User 1은 3초, User 2는 1초 걸려요. User 1 누르고 바로 User 2를 누르면?
- `userId`가 2로 바뀜 → User 1 effect의 cleanup이 `ignore = true` → 3초 뒤 Wayne이 와도 무시됨.
- ignore가 없으면: Mario가 먼저 보였다가 Wayne으로 **덮어써짐**(race condition 버그).

참고: 진짜 `fetch()`는 `AbortController`로 아예 **취소**할 수 있어요. `controller.abort()`를 cleanup에서 호출.

### 📘 Lifting State Up

Sometimes multiple components need to work with the same piece of data. When this happens, each component should not keep its own separate state. Instead, React encourages a pattern called `lifting state up`. This means you move the shared state into the closest common parent component, then pass the data down as props.

This keeps your UI consistent and prevents components from getting *out of sync*.

**Why lift state up?**

You should lift state up when:

* Two or more components need to display the same data.
* One component needs to update data that another component reads.
* You find yourself duplicating state in multiple places.
* Components behave inconsistently because they each track their own version of the data.

React uses *one‑way data flow*, so the parent becomes the single source of truth.

In the example, we have two components:

* `<NameInput />`: lets the user type their name
* `<NamePreview />`: displays the name

Both components need access to the same value, so the state must live in the parent.

```jsx
import { useState } from 'react';
import { View, Text, TextInput } from 'react-native';

function NameInput({ name, onChange }) {
  return <TextInput value={name} onChangeText={onChange} />;
}

function NamePreview({ name }) {
  return <Text>Your name is {name}</Text>;
}

export default function App() {
  const [name, setName] = useState('');

  return (
    <View>
      <Text>What is your name?</Text>
      <NameInput name={name} onChange={setName} />
      <NamePreview name={name} />
    </View>
  );
}
```

▶ **[Snack에서 바로 실행하기](https://snack.expo.dev/?name=WEB530%20W2%20Lifting%20State%20Up&platform=web&sdkVersion=54.0.0&code=import%20%7B%20useState%20%7D%20from%20%27react%27%3B%0Aimport%20%7B%20View%2C%20Text%2C%20TextInput%20%7D%20from%20%27react-native%27%3B%0A%0Afunction%20NameInput%28%7B%20name%2C%20onChange%20%7D%29%20%7B%0A%20%20return%20%3CTextInput%20value%3D%7Bname%7D%20onChangeText%3D%7BonChange%7D%20%2F%3E%3B%0A%7D%0A%0Afunction%20NamePreview%28%7B%20name%20%7D%29%20%7B%0A%20%20return%20%3CText%3EYour%20name%20is%20%7Bname%7D%3C%2FText%3E%3B%0A%7D%0A%0Aexport%20default%20function%20App%28%29%20%7B%0A%20%20const%20%5Bname%2C%20setName%5D%20%3D%20useState%28%27%27%29%3B%0A%0A%20%20return%20%28%0A%20%20%20%20%3CView%3E%0A%20%20%20%20%20%20%3CText%3EWhat%20is%20your%20name%3F%3C%2FText%3E%0A%20%20%20%20%20%20%3CNameInput%20name%3D%7Bname%7D%20onChange%3D%7BsetName%7D%20%2F%3E%0A%20%20%20%20%20%20%3CNamePreview%20name%3D%7Bname%7D%20%2F%3E%0A%20%20%20%20%3C%2FView%3E%0A%20%20%29%3B%0A%7D%0A)** (SDK 54, 필요한 패키지 자동 포함) <button class="snack-embed" type="button">👀 여기서 결과 보기</button>



**How this works**

* The `App` component owns the `name` state.
* `NameInput` receives the current value and a function to update it.
* `NamePreview` receives the current value only.
* Both components always stay synchronized because they rely on the same source of truth.

**Benefits of lifting state up**

* Prevents duplicated or conflicting state.
* Makes data flow predictable.
* Keeps components simple and focused.
* Helps you reason about where state should live.

💡 If multiple components need the same data, the state belongs in their nearest shared parent.

**🇰🇷 한글 해설**

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

### 📘 Keeping Functions Stable with `useCallback`

The dependency array of `useEffect()` works by comparing each value with the value from the previous render. For numbers, strings and booleans this is simple: `1` is the same as `1`. Functions are different. Every time a component renders, any function declared inside it is created again as a brand new object, even though the code inside it has not changed. React compares functions by identity, so the `handleTick` from one render is *not* the same as the `handleTick` from the next render.

This matters when a function is a dependency of `useEffect()`. In the example, `App` owns a counter and passes a function down to `<Ticker />`. The `Ticker` starts a one second timer and calls the function when the timer fires.

```jsx
import { useEffect, useState } from 'react';
import { View, Text } from 'react-native';

function Ticker({ onTick }) {
  useEffect(() => {
    const id = setTimeout(() => {
      onTick();
    }, 1000);

    return () => {
      clearTimeout(id);
    };
  }, [onTick]);

  return <Text>Ticking ...</Text>;
}

export default function App() {
  const [count, setCount] = useState(0);

  const handleTick = () => {
    setCount((prev) => prev + 1);
  };

  return (
    <View>
      <Text>Ticks: {count}</Text>
      <Ticker onTick={handleTick} />
    </View>
  );
}
```

▶ **[Snack에서 바로 실행하기](https://snack.expo.dev/?name=WEB530%20W2%20Keeping%20Functions%20Stable%20with%20%60useCallback%60&platform=web&sdkVersion=54.0.0&code=import%20%7B%20useEffect%2C%20useState%20%7D%20from%20%27react%27%3B%0Aimport%20%7B%20View%2C%20Text%20%7D%20from%20%27react-native%27%3B%0A%0Afunction%20Ticker%28%7B%20onTick%20%7D%29%20%7B%0A%20%20useEffect%28%28%29%20%3D%3E%20%7B%0A%20%20%20%20const%20id%20%3D%20setTimeout%28%28%29%20%3D%3E%20%7B%0A%20%20%20%20%20%20onTick%28%29%3B%0A%20%20%20%20%7D%2C%201000%29%3B%0A%0A%20%20%20%20return%20%28%29%20%3D%3E%20%7B%0A%20%20%20%20%20%20clearTimeout%28id%29%3B%0A%20%20%20%20%7D%3B%0A%20%20%7D%2C%20%5BonTick%5D%29%3B%0A%0A%20%20return%20%3CText%3ETicking%20...%3C%2FText%3E%3B%0A%7D%0A%0Aexport%20default%20function%20App%28%29%20%7B%0A%20%20const%20%5Bcount%2C%20setCount%5D%20%3D%20useState%280%29%3B%0A%0A%20%20const%20handleTick%20%3D%20%28%29%20%3D%3E%20%7B%0A%20%20%20%20setCount%28%28prev%29%20%3D%3E%20prev%20%2B%201%29%3B%0A%20%20%7D%3B%0A%0A%20%20return%20%28%0A%20%20%20%20%3CView%3E%0A%20%20%20%20%20%20%3CText%3ETicks%3A%20%7Bcount%7D%3C%2FText%3E%0A%20%20%20%20%20%20%3CTicker%20onTick%3D%7BhandleTick%7D%20%2F%3E%0A%20%20%20%20%3C%2FView%3E%0A%20%20%29%3B%0A%7D%0A)** (SDK 54, 필요한 패키지 자동 포함) <button class="snack-embed" type="button">👀 여기서 결과 보기</button>


Ticks: 0
Ticking ...

⬇️ *one second later, and every second after that*

Ticks: 1
Ticks: 2
Ticks: 3
...


The counter never stops. Follow the chain of events:

1. `Ticker` renders and the effect starts a timer.
2. The timer fires and calls `onTick`, which updates the state in `App`.
3. `App` re-renders and creates a **new** `handleTick` function.
4. `Ticker` re-renders with a new `onTick` prop. React compares it with the old one, sees a different function, runs the clean-up and runs the effect again, which starts another timer.
5. Return to step 2.

Each tick schedules the next one. The effect depends on a value that changes on every render, so it runs on every render.

A tempting fix is to pass an empty array so the effect only runs once.

```jsx
useEffect(() => {
  const id = setTimeout(() => {
    onTick();
  }, 1000);

  return () => {
    clearTimeout(id);
  };
}, []);
```

The counter now ticks once and stops, but the editor shows a warning: `React Hook useEffect has a missing dependency: 'onTick'`. The effect uses `onTick` but claims to depend on nothing. React will keep calling the `onTick` it captured on the first render, even if the parent later passes a different function. In this small example that is harmless. In a larger app it is a common source of bugs where an effect quietly works with out of date values, so the warning should not be ignored.

The correct fix is to stop the function from changing in the first place. The `useCallback()` hook takes a function and a dependency array, and returns the same function object on every render for as long as the dependencies stay the same.

```jsx
import { useCallback, useEffect, useState } from 'react';
import { View, Text } from 'react-native';

function Ticker({ onTick }) {
  useEffect(() => {
    const id = setTimeout(() => {
      onTick();
    }, 1000);

    return () => {
      clearTimeout(id);
    };
  }, [onTick]);

  return <Text>Ticking ...</Text>;
}

export default function App() {
  const [count, setCount] = useState(0);

  const handleTick = useCallback(() => {
    setCount((prev) => prev + 1);
  }, []);

  return (
    <View>
      <Text>Ticks: {count}</Text>
      <Ticker onTick={handleTick} />
    </View>
  );
}
```

▶ **[Snack에서 바로 실행하기](https://snack.expo.dev/?name=WEB530%20W2%20Keeping%20Functions%20Stable%20with%20%60useCallback%60&platform=web&sdkVersion=54.0.0&code=import%20%7B%20useCallback%2C%20useEffect%2C%20useState%20%7D%20from%20%27react%27%3B%0Aimport%20%7B%20View%2C%20Text%20%7D%20from%20%27react-native%27%3B%0A%0Afunction%20Ticker%28%7B%20onTick%20%7D%29%20%7B%0A%20%20useEffect%28%28%29%20%3D%3E%20%7B%0A%20%20%20%20const%20id%20%3D%20setTimeout%28%28%29%20%3D%3E%20%7B%0A%20%20%20%20%20%20onTick%28%29%3B%0A%20%20%20%20%7D%2C%201000%29%3B%0A%0A%20%20%20%20return%20%28%29%20%3D%3E%20%7B%0A%20%20%20%20%20%20clearTimeout%28id%29%3B%0A%20%20%20%20%7D%3B%0A%20%20%7D%2C%20%5BonTick%5D%29%3B%0A%0A%20%20return%20%3CText%3ETicking%20...%3C%2FText%3E%3B%0A%7D%0A%0Aexport%20default%20function%20App%28%29%20%7B%0A%20%20const%20%5Bcount%2C%20setCount%5D%20%3D%20useState%280%29%3B%0A%0A%20%20const%20handleTick%20%3D%20useCallback%28%28%29%20%3D%3E%20%7B%0A%20%20%20%20setCount%28%28prev%29%20%3D%3E%20prev%20%2B%201%29%3B%0A%20%20%7D%2C%20%5B%5D%29%3B%0A%0A%20%20return%20%28%0A%20%20%20%20%3CView%3E%0A%20%20%20%20%20%20%3CText%3ETicks%3A%20%7Bcount%7D%3C%2FText%3E%0A%20%20%20%20%20%20%3CTicker%20onTick%3D%7BhandleTick%7D%20%2F%3E%0A%20%20%20%20%3C%2FView%3E%0A%20%20%29%3B%0A%7D%0A)** (SDK 54, 필요한 패키지 자동 포함) <button class="snack-embed" type="button">👀 여기서 결과 보기</button>



Now `handleTick` is created once. Every render of `App` passes the identical function to `Ticker`, the `[onTick]` dependency never changes, and the effect runs once. The dependency array is honest, there is no warning, and the counter ticks a single time.

Notice that `handleTick` uses the function form of the setter, `setCount((prev) => prev + 1)`, because the new count depends on the old one. With `useCallback()` this matters even more. A function created with `useCallback(..., [])` is created once, so if it used `count` it would only ever see the `count` from the first render, which is `0`, and every tick would set the count to `1`. The function form asks React for the latest value instead, so the callback doesn't depend on `count` at all and the empty array is truthful.

💡 `useCallback()` is not a performance tool to wrap around every function. Reach for it when a function is a dependency of `useEffect()`, or when it is passed to a child component that must not re-render needlessly. Everywhere else, a plain function is simpler and just as fast.

**🇰🇷 한글 해설**

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

### 📘 Sharing data via context

Typically, React components will fetch the data that they *and their children* need but sometimes it is convenient for our app to load *global* data that can be shared across multiple components. To share global data, you can use the React **Context API**. Components that are rendered within a context are able to access the data provided by the context.

```jsx
import { createContext, useContext, useEffect, useState } from 'react';
import { View, Text } from 'react-native';

const UserContext = createContext();

// A utility function to fake a call to the fetch API.
// This returns user information after 2 seconds.
function fetchUser() {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ id: 99, name: 'Wayne' });
    }, 2000);
  });
}

// A container component. It shares state information
// with child components using a context.
function UserContextProvider({ children }) {
  const [user, setUser] = useState({
    id: 0,
    name: '...',
  });

  useEffect(() => {
    fetchUser().then((user) => {
      setUser({
        id: user.id,
        name: user.name,
      });
    });
  }, []);

  return <UserContext.Provider value={user}>{children}</UserContext.Provider>;
}

// Renders a <Text> component that includes the user name.
// The name is obtained from the context provided by the
// UserContextProvider. As the name changes the UI is updated.
function UserInfo() {
  const user = useContext(UserContext);

  return <Text>User name is {user.name}</Text>;
}

export default function App() {
  return (
    <View>
      <UserContextProvider>
        <View>
          <UserInfo />
        </View>
        <View>
          <UserInfo />
        </View>
        <View>
          <UserInfo />
        </View>
      </UserContextProvider>
    </View>
  );
}
```

▶ **[Snack에서 바로 실행하기](https://snack.expo.dev/?name=WEB530%20W2%20Sharing%20data%20via%20context&platform=web&sdkVersion=54.0.0&code=import%20%7B%20createContext%2C%20useContext%2C%20useEffect%2C%20useState%20%7D%20from%20%27react%27%3B%0Aimport%20%7B%20View%2C%20Text%20%7D%20from%20%27react-native%27%3B%0A%0Aconst%20UserContext%20%3D%20createContext%28%29%3B%0A%0A%2F%2F%20A%20utility%20function%20to%20fake%20a%20call%20to%20the%20fetch%20API.%0A%2F%2F%20This%20returns%20user%20information%20after%202%20seconds.%0Afunction%20fetchUser%28%29%20%7B%0A%20%20return%20new%20Promise%28%28resolve%29%20%3D%3E%20%7B%0A%20%20%20%20setTimeout%28%28%29%20%3D%3E%20%7B%0A%20%20%20%20%20%20resolve%28%7B%20id%3A%2099%2C%20name%3A%20%27Wayne%27%20%7D%29%3B%0A%20%20%20%20%7D%2C%202000%29%3B%0A%20%20%7D%29%3B%0A%7D%0A%0A%2F%2F%20A%20container%20component.%20It%20shares%20state%20information%0A%2F%2F%20with%20child%20components%20using%20a%20context.%0Afunction%20UserContextProvider%28%7B%20children%20%7D%29%20%7B%0A%20%20const%20%5Buser%2C%20setUser%5D%20%3D%20useState%28%7B%0A%20%20%20%20id%3A%200%2C%0A%20%20%20%20name%3A%20%27...%27%2C%0A%20%20%7D%29%3B%0A%0A%20%20useEffect%28%28%29%20%3D%3E%20%7B%0A%20%20%20%20fetchUser%28%29.then%28%28user%29%20%3D%3E%20%7B%0A%20%20%20%20%20%20setUser%28%7B%0A%20%20%20%20%20%20%20%20id%3A%20user.id%2C%0A%20%20%20%20%20%20%20%20name%3A%20user.name%2C%0A%20%20%20%20%20%20%7D%29%3B%0A%20%20%20%20%7D%29%3B%0A%20%20%7D%2C%20%5B%5D%29%3B%0A%0A%20%20return%20%3CUserContext.Provider%20value%3D%7Buser%7D%3E%7Bchildren%7D%3C%2FUserContext.Provider%3E%3B%0A%7D%0A%0A%2F%2F%20Renders%20a%20%3CText%3E%20component%20that%20includes%20the%20user%20name.%0A%2F%2F%20The%20name%20is%20obtained%20from%20the%20context%20provided%20by%20the%0A%2F%2F%20UserContextProvider.%20As%20the%20name%20changes%20the%20UI%20is%20updated.%0Afunction%20UserInfo%28%29%20%7B%0A%20%20const%20user%20%3D%20useContext%28UserContext%29%3B%0A%0A%20%20return%20%3CText%3EUser%20name%20is%20%7Buser.name%7D%3C%2FText%3E%3B%0A%7D%0A%0Aexport%20default%20function%20App%28%29%20%7B%0A%20%20return%20%28%0A%20%20%20%20%3CView%3E%0A%20%20%20%20%20%20%3CUserContextProvider%3E%0A%20%20%20%20%20%20%20%20%3CView%3E%0A%20%20%20%20%20%20%20%20%20%20%3CUserInfo%20%2F%3E%0A%20%20%20%20%20%20%20%20%3C%2FView%3E%0A%20%20%20%20%20%20%20%20%3CView%3E%0A%20%20%20%20%20%20%20%20%20%20%3CUserInfo%20%2F%3E%0A%20%20%20%20%20%20%20%20%3C%2FView%3E%0A%20%20%20%20%20%20%20%20%3CView%3E%0A%20%20%20%20%20%20%20%20%20%20%3CUserInfo%20%2F%3E%0A%20%20%20%20%20%20%20%20%3C%2FView%3E%0A%20%20%20%20%20%20%3C%2FUserContextProvider%3E%0A%20%20%20%20%3C%2FView%3E%0A%20%20%29%3B%0A%7D%0A)** (SDK 54, 필요한 패키지 자동 포함) <button class="snack-embed" type="button">👀 여기서 결과 보기</button>



Study the code example. On line 4, we create a new context by calling `createContext()`. Next we have our utility function for fetching user data. This is similar to the `fetchUser()` function in the other code examples except that we are setting the state value to an object rather than setting individual properties. Finally, we have a `UserContextProvider()` function. The job of this component is to fetch the user information and update the context when the information has been received back by the API.

You will notice the `UserContextProvider()` function accepts an argument `{ children }`. You will also notice that it renders a `<UserContext.Provider>` component. The `<UserContext.Provider>` will act as a container sharing data with the child components. In the example, we are sharing the `user` object by passing it into the `value` attribute.

In our main app component, we render multiple `<UserInfo>` components *used for displaying the user name*. This component grabs the shared data from the parent context provider by calling `useContext()`. As the data is changed, the UI is updated.

**Output:**

User name is ...
User name is ...
User name is ...

⬇️ *after about two seconds*

User name is Wayne
User name is Wayne
User name is Wayne

It is worth mentioning that the `<UserInfo>` component has no knowledge of the global data. Instead of passing the data down from the top-level component as property values, we can rely on the `useContext()` function to provide access to the global data. Components (like the inner `<View>` components) that have nothing to do with the data don't need (or care) about it.

**🇰🇷 한글 해설**

**Context API** = 여러 컴포넌트가 같이 쓰는 **전역 데이터**를 props 없이 나눠 주는 방법.

3단계 공식:
1. **만들기**: `const UserContext = createContext();`
2. **제공하기**: `<UserContext.Provider value={user}>{children}</UserContext.Provider>` 로 감싸기
3. **꺼내 쓰기**: 자식 어디서든 `const user = useContext(UserContext);`

예제의 `UserContextProvider`는 데이터를 불러오고(useEffect) Provider로 감싸 주는 **컨테이너 컴포넌트**예요. `{ children }` 을 받아서 Provider 안에 넣어요.

중간의 `<View>`들은 데이터에 관심이 없어도 돼요. 이게 Context의 장점: 중간 단계 컴포넌트들이 props를 줄줄이 전달하는 **prop drilling**을 안 해도 돼요.

### 📘 Global State with Jotai

The React Context API is useful for sharing global data, but it can become verbose as your app grows. You need to create a context, wrap your components in a provider, and manually pass values through the provider’s value attribute. For many apps, this is more setup than necessary.

Jotai is a lightweight state‑management library that makes global state feel as simple as using `useState()`. Instead of creating providers or reducers, you create small pieces of state called `atoms`. Any component can read or update an atom directly.

Jotai works in React Native and Expo with no extra configuration. To use it in your own Snack, add `jotai` to `package.json`. Snack also asks for `@types/react`, which Jotai lists as optional; add it too to clear the message.

**Why Jotai?**

Jotai gives you:

* Global state with the simplicity of `useState`.
* No providers to wrap your app.
* No reducers, actions, or boilerplate.
* Automatic updates across all components that use the same atom.

*If Context feels like “plumbing,” Jotai feels like “just state.”*

Here is the same “global user” idea from the Context example, rewritten using Jotai.

```jsx
import { atom, useAtom } from 'jotai';
import { useEffect } from 'react';
import { View, Text } from 'react-native';

// A global atom that stores the user object.
const userAtom = atom({ id: 0, name: '...' });

// A utility function to fake a call to the fetch API.
function fetchUser() {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ id: 99, name: 'Wayne' });
    }, 2000);
  });
}

function UserLoader() {
  const [, setUser] = useAtom(userAtom);

  useEffect(() => {
    fetchUser().then((user) => {
      setUser(user);
    });
  }, []);

  return null; // This component only loads data.
}

function UserInfo() {
  const [user] = useAtom(userAtom);
  return <Text>User name is {user.name}</Text>;
}

export default function App() {
  return (
    <View>
      <UserLoader />
      <UserInfo />
      <UserInfo />
      <UserInfo />
    </View>
  );
}
```

▶ **[Snack에서 바로 실행하기](https://snack.expo.dev/?name=WEB530%20W2%20Global%20State%20with%20Jotai&platform=web&sdkVersion=54.0.0&code=import%20%7B%20atom%2C%20useAtom%20%7D%20from%20%27jotai%27%3B%0Aimport%20%7B%20useEffect%20%7D%20from%20%27react%27%3B%0Aimport%20%7B%20View%2C%20Text%20%7D%20from%20%27react-native%27%3B%0A%0A%2F%2F%20A%20global%20atom%20that%20stores%20the%20user%20object.%0Aconst%20userAtom%20%3D%20atom%28%7B%20id%3A%200%2C%20name%3A%20%27...%27%20%7D%29%3B%0A%0A%2F%2F%20A%20utility%20function%20to%20fake%20a%20call%20to%20the%20fetch%20API.%0Afunction%20fetchUser%28%29%20%7B%0A%20%20return%20new%20Promise%28%28resolve%29%20%3D%3E%20%7B%0A%20%20%20%20setTimeout%28%28%29%20%3D%3E%20%7B%0A%20%20%20%20%20%20resolve%28%7B%20id%3A%2099%2C%20name%3A%20%27Wayne%27%20%7D%29%3B%0A%20%20%20%20%7D%2C%202000%29%3B%0A%20%20%7D%29%3B%0A%7D%0A%0Afunction%20UserLoader%28%29%20%7B%0A%20%20const%20%5B%2C%20setUser%5D%20%3D%20useAtom%28userAtom%29%3B%0A%0A%20%20useEffect%28%28%29%20%3D%3E%20%7B%0A%20%20%20%20fetchUser%28%29.then%28%28user%29%20%3D%3E%20%7B%0A%20%20%20%20%20%20setUser%28user%29%3B%0A%20%20%20%20%7D%29%3B%0A%20%20%7D%2C%20%5B%5D%29%3B%0A%0A%20%20return%20null%3B%20%2F%2F%20This%20component%20only%20loads%20data.%0A%7D%0A%0Afunction%20UserInfo%28%29%20%7B%0A%20%20const%20%5Buser%5D%20%3D%20useAtom%28userAtom%29%3B%0A%20%20return%20%3CText%3EUser%20name%20is%20%7Buser.name%7D%3C%2FText%3E%3B%0A%7D%0A%0Aexport%20default%20function%20App%28%29%20%7B%0A%20%20return%20%28%0A%20%20%20%20%3CView%3E%0A%20%20%20%20%20%20%3CUserLoader%20%2F%3E%0A%20%20%20%20%20%20%3CUserInfo%20%2F%3E%0A%20%20%20%20%20%20%3CUserInfo%20%2F%3E%0A%20%20%20%20%20%20%3CUserInfo%20%2F%3E%0A%20%20%20%20%3C%2FView%3E%0A%20%20%29%3B%0A%7D%0A&dependencies=%40types%2Freact%40%2A%2Cjotai%40%2A)** (SDK 54, 필요한 패키지 자동 포함)



**How this works**

* `userAtom` is a global piece of state.
* Any component can read it with `useAtom(userAtom)`.
* Any component can update it with the setter returned by `useAtom`.
* When the atom changes, all components using it automatically re-render.
* No providers, no context tree, no prop drilling.

**When to choose Jotai over Context**

Use Jotai when:

* You want global state without boilerplate.
* You want something simpler than Redux or Context.
* Multiple components need to read/write the same data.

Context is still useful for things like themes or configuration, but for shared data that changes over time, Jotai is often the cleaner choice.

**🇰🇷 한글 해설**

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


---

## 3. 📘 코스노트: Class Components (Optional)

> 원문 출처: https://seneca-ictoer.github.io/WEB530/B-Components/class-components

This page documents how to work with props and state in [React's legacy Class Components](https://react.dev/reference/react/Component). You will be using [functional components](https://seneca-ictoer.github.io/WEB530/B-Components/func-components) in your apps, but you might come across older code samples or documentation that uses class-based components, so this can be useful context to have.

**🇰🇷 한글 해설**

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

### 📘 Component state and properties

Components are useless unless they display or use data in some meaningful way. We will set some initial data so that our components can render the initial view. As data changes, React can track those changes and automatically update the UI. We will refer to each *snapshot* of the data as the **component state**. Whenever we tell a React component to change its state, the component will automatically re-render itself. The component state can be controlled by the component itself or by code that exists outside of the component itself.

**Properties** (or Attributes) are used to pass data into components. We will pass data to our components properties by modifying the JSX. Properties are different than state because they are typically set during the initial render but remain unchanged afterward. If a property is changed, then the component will need to be re-rendered to keep the display in sync. It is typically a parent component that decides when to re-render the component.

**🇰🇷 한글 해설**

- **State**: 컴포넌트 데이터의 **스냅샷**. 바뀌면 컴포넌트가 자동으로 다시 그려져요.
- **Properties(props)**: 바깥(부모)에서 넣어 주는 값. 보통 처음 렌더링 때 정해지고 그 뒤로 안 바뀌어요. 다시 그릴지는 부모가 결정.

### 📘 Working with component state

If your component uses state, you should remember to set some initial data. Doing so will prevent render failures due to having unexpected or missing state values. When setting the state, we can simply pass a JavaScript object to the component. The object properties can be used to initialize the data.

```jsx
import React from 'react';
import { View, Button } from 'react-native';

class MyComponent extends React.Component {
  // The initial state is set to a plain JavaScript object
  // with multiple state properties.
  state = {
    first: false,
    second: true,
  };

  render() {
    // The returned JSX uses the boolean "first" and "second" state
    // properties for the value of the <Button> "disabled" properties.
    // The state is set on lines 7-10 so we can safely read these values.
    return (
      <View>
        <Button disabled={this.state.first} title="First" />
        <Button disabled={this.state.second} title="Second" />
      </View>
    );
  }
}

export default function App() {
  return <MyComponent />;
}
```

▶ **[Snack에서 바로 실행하기](https://snack.expo.dev/?name=WEB530%20W2%20Working%20with%20component%20state&platform=web&sdkVersion=54.0.0&code=import%20React%20from%20%27react%27%3B%0Aimport%20%7B%20View%2C%20Button%20%7D%20from%20%27react-native%27%3B%0A%0Aclass%20MyComponent%20extends%20React.Component%20%7B%0A%20%20%2F%2F%20The%20initial%20state%20is%20set%20to%20a%20plain%20JavaScript%20object%0A%20%20%2F%2F%20with%20multiple%20state%20properties.%0A%20%20state%20%3D%20%7B%0A%20%20%20%20first%3A%20false%2C%0A%20%20%20%20second%3A%20true%2C%0A%20%20%7D%3B%0A%0A%20%20render%28%29%20%7B%0A%20%20%20%20%2F%2F%20The%20returned%20JSX%20uses%20the%20boolean%20%22first%22%20and%20%22second%22%20state%0A%20%20%20%20%2F%2F%20properties%20for%20the%20value%20of%20the%20%3CButton%3E%20%22disabled%22%20properties.%0A%20%20%20%20%2F%2F%20The%20state%20is%20set%20on%20lines%207-10%20so%20we%20can%20safely%20read%20these%20values.%0A%20%20%20%20return%20%28%0A%20%20%20%20%20%20%3CView%3E%0A%20%20%20%20%20%20%20%20%3CButton%20disabled%3D%7Bthis.state.first%7D%20title%3D%22First%22%20%2F%3E%0A%20%20%20%20%20%20%20%20%3CButton%20disabled%3D%7Bthis.state.second%7D%20title%3D%22Second%22%20%2F%3E%0A%20%20%20%20%20%20%3C%2FView%3E%0A%20%20%20%20%29%3B%0A%20%20%7D%0A%7D%0A%0Aexport%20default%20function%20App%28%29%20%7B%0A%20%20return%20%3CMyComponent%20%2F%3E%3B%0A%7D%0A)** (SDK 54, 필요한 패키지 자동 포함) <button class="snack-embed" type="button">👀 여기서 결과 보기</button>



We have set the initial state and safely rendered the component. What about updating the state after the component has already been rendered? In the example below, a component is rendered with the initial state. After three seconds, the state object is replaced by calling `setState()`. React will automatically detect the change of state and force the component to re-render itself.

```jsx
import React from 'react';
import { View, Text } from 'react-native';

class MyComponent extends React.Component {
  // The initial state is set to a plain JavaScript object
  // with multiple state properties.
  state = {
    heading: 'React-Native (Initial)',
    body: 'Loading, just a moment please ...',
  };

  // This is a "lifecycle" method. It is invoked immediately after
  // a component is inserted into the tree (UI).
  componentDidMount() {
    // After 3 seconds, change the state. React will re-render
    // the component to show the new values.
    setTimeout(
      function () {
        this.setState({
          heading: 'React-Native (Updated)',
          body: 'The new state values have been rendered!',
        });
      }.bind(this),
      3000
    );
  }

  render() {
    // If we store the state into local variables the JSX will
    // look a bit cleaner and becomes easier to understand.
    const { heading, body } = this.state;

    return (
      <View>
        <Text>
          <Text>{heading}</Text>
          {'\n'}
          <Text>{body}</Text>
        </Text>
      </View>
    );
  }
}

export default function App() {
  return <MyComponent />;
}
```

▶ **[Snack에서 바로 실행하기](https://snack.expo.dev/?name=WEB530%20W2%20Working%20with%20component%20state&platform=web&sdkVersion=54.0.0&code=import%20React%20from%20%27react%27%3B%0Aimport%20%7B%20View%2C%20Text%20%7D%20from%20%27react-native%27%3B%0A%0Aclass%20MyComponent%20extends%20React.Component%20%7B%0A%20%20%2F%2F%20The%20initial%20state%20is%20set%20to%20a%20plain%20JavaScript%20object%0A%20%20%2F%2F%20with%20multiple%20state%20properties.%0A%20%20state%20%3D%20%7B%0A%20%20%20%20heading%3A%20%27React-Native%20%28Initial%29%27%2C%0A%20%20%20%20body%3A%20%27Loading%2C%20just%20a%20moment%20please%20...%27%2C%0A%20%20%7D%3B%0A%0A%20%20%2F%2F%20This%20is%20a%20%22lifecycle%22%20method.%20It%20is%20invoked%20immediately%20after%0A%20%20%2F%2F%20a%20component%20is%20inserted%20into%20the%20tree%20%28UI%29.%0A%20%20componentDidMount%28%29%20%7B%0A%20%20%20%20%2F%2F%20After%203%20seconds%2C%20change%20the%20state.%20React%20will%20re-render%0A%20%20%20%20%2F%2F%20the%20component%20to%20show%20the%20new%20values.%0A%20%20%20%20setTimeout%28%0A%20%20%20%20%20%20function%20%28%29%20%7B%0A%20%20%20%20%20%20%20%20this.setState%28%7B%0A%20%20%20%20%20%20%20%20%20%20heading%3A%20%27React-Native%20%28Updated%29%27%2C%0A%20%20%20%20%20%20%20%20%20%20body%3A%20%27The%20new%20state%20values%20have%20been%20rendered%21%27%2C%0A%20%20%20%20%20%20%20%20%7D%29%3B%0A%20%20%20%20%20%20%7D.bind%28this%29%2C%0A%20%20%20%20%20%203000%0A%20%20%20%20%29%3B%0A%20%20%7D%0A%0A%20%20render%28%29%20%7B%0A%20%20%20%20%2F%2F%20If%20we%20store%20the%20state%20into%20local%20variables%20the%20JSX%20will%0A%20%20%20%20%2F%2F%20look%20a%20bit%20cleaner%20and%20becomes%20easier%20to%20understand.%0A%20%20%20%20const%20%7B%20heading%2C%20body%20%7D%20%3D%20this.state%3B%0A%0A%20%20%20%20return%20%28%0A%20%20%20%20%20%20%3CView%3E%0A%20%20%20%20%20%20%20%20%3CText%3E%0A%20%20%20%20%20%20%20%20%20%20%3CText%3E%7Bheading%7D%3C%2FText%3E%0A%20%20%20%20%20%20%20%20%20%20%7B%27%5Cn%27%7D%0A%20%20%20%20%20%20%20%20%20%20%3CText%3E%7Bbody%7D%3C%2FText%3E%0A%20%20%20%20%20%20%20%20%3C%2FText%3E%0A%20%20%20%20%20%20%3C%2FView%3E%0A%20%20%20%20%29%3B%0A%20%20%7D%0A%7D%0A%0Aexport%20default%20function%20App%28%29%20%7B%0A%20%20return%20%3CMyComponent%20%2F%3E%3B%0A%7D%0A)** (SDK 54, 필요한 패키지 자동 포함) <button class="snack-embed" type="button">👀 여기서 결과 보기</button>


React-Native (Initial)
Loading, just a moment please ...

⬇️

React-Native (Updated)
The new state values have been rendered!


In the example above, the state object was replaced with a new object. Instead of replacing the entire state object each time, we can change single properties instead (leaving the rest of the state as it was).

```jsx
// The initial state is set to a plain JavaScript object
// with multiple state properties.
state = {
    heading: "React-Native",
    body: "Loading, just a moment please ..."
}

componentDidMount() {
    // Only a single property is changed. React merges the new
    // state variable into the existing state variable.
    setTimeout(function () {
        this.setState({
            body: "Only the 'body' state variable was changed."
        });
    }.bind(this), 3000);
}
```

**🇰🇷 한글 해설**

class에서는 `state = { ... }` 객체로 초기값을 주고, `this.setState({...})`로 바꿔요. `componentDidMount()`는 화면에 처음 붙은 직후 한 번 실행되는 **생명주기 메서드**(함수형의 `useEffect(..., [])`). class의 setState는 **일부 속성만 넘겨도 나머지와 합쳐(merge)** 줘요.

### 📘 Working with component properties

In React, **properties** are like state, they allow you to pass data into components. Unlike state, properties are usually only set once, when the component is rendered. Setting property values is slightly different than when working with state values.

💡 **Immutable**
An object or value that cannot be changed.

In the example, we are setting the default property values for a component. Notice the "static" keyword. The default properties are not instance variables as with component state. This is because properties are immutable so there is no need for them to be kept as instance variables.

```jsx
import React from 'react';
import { View, Button } from 'react-native';

class MyComponent extends React.Component {
  // The default properties are set using a plain
  // JavaScript object. Notice the "static" keyword.
  static defaultProps = {
    firstTitle: 'First',
    secondDisabled: true,
  };

  render() {
    // Get the property values before we render the component.
    const { firstTitle, secondDisabled } = this.props;

    return (
      <View>
        <Button title={firstTitle} />
        <Button disabled={secondDisabled} title="Second" />
      </View>
    );
  }
}

export default function App() {
  return <MyComponent />;
}
```

▶ **[Snack에서 바로 실행하기](https://snack.expo.dev/?name=WEB530%20W2%20Working%20with%20component%20properties&platform=web&sdkVersion=54.0.0&code=import%20React%20from%20%27react%27%3B%0Aimport%20%7B%20View%2C%20Button%20%7D%20from%20%27react-native%27%3B%0A%0Aclass%20MyComponent%20extends%20React.Component%20%7B%0A%20%20%2F%2F%20The%20default%20properties%20are%20set%20using%20a%20plain%0A%20%20%2F%2F%20JavaScript%20object.%20Notice%20the%20%22static%22%20keyword.%0A%20%20static%20defaultProps%20%3D%20%7B%0A%20%20%20%20firstTitle%3A%20%27First%27%2C%0A%20%20%20%20secondDisabled%3A%20true%2C%0A%20%20%7D%3B%0A%0A%20%20render%28%29%20%7B%0A%20%20%20%20%2F%2F%20Get%20the%20property%20values%20before%20we%20render%20the%20component.%0A%20%20%20%20const%20%7B%20firstTitle%2C%20secondDisabled%20%7D%20%3D%20this.props%3B%0A%0A%20%20%20%20return%20%28%0A%20%20%20%20%20%20%3CView%3E%0A%20%20%20%20%20%20%20%20%3CButton%20title%3D%7BfirstTitle%7D%20%2F%3E%0A%20%20%20%20%20%20%20%20%3CButton%20disabled%3D%7BsecondDisabled%7D%20title%3D%22Second%22%20%2F%3E%0A%20%20%20%20%20%20%3C%2FView%3E%0A%20%20%20%20%29%3B%0A%20%20%7D%0A%7D%0A%0Aexport%20default%20function%20App%28%29%20%7B%0A%20%20return%20%3CMyComponent%20%2F%3E%3B%0A%7D%0A)** (SDK 54, 필요한 패키지 자동 포함) <button class="snack-embed" type="button">👀 여기서 결과 보기</button>



Properties would be more useful if we could set them for each instance of a component directly in the JSX. Below you will find the revised App() function illustrating how the property value can be changed rather than using the default values. We can pass any valid JavaScript expression in the JSX.

```jsx
export default function App() {
  return <MyComponent firstTitle="From Prop" secondDisabled={false} />;
}
```

**🇰🇷 한글 해설**

**Immutable(불변)**: 바꿀 수 없는 값. props는 불변이라 자식이 직접 바꾸면 안 돼요. class에서는 `static defaultProps`로 기본값을 줘요(함수형에서는 구조 분해 기본값).

### 📘 Passing data from parent to child components

Combining much of the content learned, we are initializing state and passing property data to child components from a parent component.

```jsx
import { Component } from 'react';
import { View, Button } from 'react-native';

class ParentComponent extends Component {
  state = {
    items: ['First Child', 'Second Child', 'Third Child'],
  };

  render() {
    const { items } = this.state;

    return (
      <View>
        {items.map((item) => (
          // A child component is rendered for each item in the
          // state.items array. Data is passed using a property.
          <ChildComponent key={item} buttonTitle={item} />
        ))}
      </View>
    );
  }
}

class ChildComponent extends Component {
  render() {
    const { buttonTitle } = this.props;

    return <Button title={buttonTitle} />;
  }
}

export default function App() {
  return <ParentComponent />;
}
```

▶ **[Snack에서 바로 실행하기](https://snack.expo.dev/?name=WEB530%20W2%20Passing%20data%20from%20parent%20to%20child%20components&platform=web&sdkVersion=54.0.0&code=import%20%7B%20Component%20%7D%20from%20%27react%27%3B%0Aimport%20%7B%20View%2C%20Button%20%7D%20from%20%27react-native%27%3B%0A%0Aclass%20ParentComponent%20extends%20Component%20%7B%0A%20%20state%20%3D%20%7B%0A%20%20%20%20items%3A%20%5B%27First%20Child%27%2C%20%27Second%20Child%27%2C%20%27Third%20Child%27%5D%2C%0A%20%20%7D%3B%0A%0A%20%20render%28%29%20%7B%0A%20%20%20%20const%20%7B%20items%20%7D%20%3D%20this.state%3B%0A%0A%20%20%20%20return%20%28%0A%20%20%20%20%20%20%3CView%3E%0A%20%20%20%20%20%20%20%20%7Bitems.map%28%28item%29%20%3D%3E%20%28%0A%20%20%20%20%20%20%20%20%20%20%2F%2F%20A%20child%20component%20is%20rendered%20for%20each%20item%20in%20the%0A%20%20%20%20%20%20%20%20%20%20%2F%2F%20state.items%20array.%20Data%20is%20passed%20using%20a%20property.%0A%20%20%20%20%20%20%20%20%20%20%3CChildComponent%20key%3D%7Bitem%7D%20buttonTitle%3D%7Bitem%7D%20%2F%3E%0A%20%20%20%20%20%20%20%20%29%29%7D%0A%20%20%20%20%20%20%3C%2FView%3E%0A%20%20%20%20%29%3B%0A%20%20%7D%0A%7D%0A%0Aclass%20ChildComponent%20extends%20Component%20%7B%0A%20%20render%28%29%20%7B%0A%20%20%20%20const%20%7B%20buttonTitle%20%7D%20%3D%20this.props%3B%0A%0A%20%20%20%20return%20%3CButton%20title%3D%7BbuttonTitle%7D%20%2F%3E%3B%0A%20%20%7D%0A%7D%0A%0Aexport%20default%20function%20App%28%29%20%7B%0A%20%20return%20%3CParentComponent%20%2F%3E%3B%0A%7D%0A)** (SDK 54, 필요한 패키지 자동 포함) <button class="snack-embed" type="button">👀 여기서 결과 보기</button>



**🇰🇷 한글 해설**

부모가 자기 state를 자식의 props로 내려 주는 패턴이에요. 함수형의 lifting state up과 같은 원리.

### 📘 Lifecycle methods

React components have a life cycle in which the framework executes various functions in a specific order. In fact, the `render()` function is a lifecycle method used to return the content to be rendered by a component.

There are three main lifecycle flows in React: when the component is first rendered (mounted), whenever it is updated, and when it is removed (unmounted).

**Initial Render**

`getDerivedStateFromProps()` `👉` `render()` `👉` `componentDidMount()`

**Update**

`getDerivedStateFromProps()` `👉` `shouldComponentUpdate()` `👉` `render()` `👉` `getSnapshotBeforeUpdate()` `👉` `componentDidUpdate()`

**Unmount**

`componentWillUnmount()`

**🇰🇷 한글 해설**

컴포넌트의 일생: **생성(mount) → 업데이트(update) → 제거(unmount)**. 각 시점에 실행되는 메서드가 있어요. 함수형에서는 이걸 전부 `useEffect` 하나로 처리해요(위 비교표).

#### 📘 Methods

* **componentDidMount**
  This is called after the component is mounted. This method can be used to perform initialization work such as fetching data.
* **componentDidUpdate**
  This is called when the component is updated. In most cases you will not need to handle this event.
* **componentWillUnmount**
  Called when a component is about to be removed. Gives an opportunity to cancel any pending asynchronous requests.
* **getDerivedStateFromProps**
  Called when the component is first rendered or if a new property value is received. Allows you to update the state of the component based on property values.
* **getSnapshotBeforeUpdate**
  Called right before an update is shown on screen. It lets you read information from the current screen (such as a scroll position) before it changes. Whatever it returns is passed to `componentDidUpdate()`.
* **render**
  Returns the content to be rendered by the component. The method is called when the component is first mounted, if a property value is received, or when `setState()` is called.
* **shouldComponentUpdate**
  Called before `render()`, this method allows you to decide whether the component should re-render. Return `true` to allow rendering otherwise return `false`.

**🇰🇷 한글 해설**

각 생명주기 메서드 목록이에요. 시험에는 함수형 기준으로 나오니 위 비교표 정도만 알아 두면 충분해요.


---

## 4. 💻 인클래스 예제: Week 2.1 - Notes and Examples

> 원문 출처: github.com/nick-romanidis/web530-2267-nsa  week-02.1-notes.md

### 💻 React Native Playground

React Native Playground (Snack)
_Use this for the examples. Modify App.js_
(https://snack.expo.dev)

**🇰🇷 한글 해설**

2주차부터는 계속 **Snack**에서 해요. `App.js`만 고치면 돼요.

### 💻 Common Components

- These are covered in depth in a later week. For now, know they exist and how they differ from HTML.
- Build on the HTML to React Native table from Week 1.2.

| HTML                       | React Native | What is different                                                     |
| -------------------------- | ------------ | --------------------------------------------------------------------- |
| `<div>`                    | `View`       | Container only, cannot hold bare text                                 |
| `<p>`, `<h1>`, `<span>`    | `Text`       | The only place text can render. A `Text` inside a `Text` acts like a `<span>` |
| `<button>`                 | `Button`     | Label goes in the `title` prop. Uses `onPress`, not `onClick`         |
| `<input type="text">`      | `TextInput`  | Uses `onChangeText`, which gives you the string, not an event object  |
| `<input type="checkbox">`  | `Switch`     | Renders as a toggle. Uses `value` and `onValueChange`                 |
| `<img>`                    | `Image`      | Uses `source`, not `src`. Remote images need a width and height       |
| A scrolling page           | `ScrollView` | Screens do not scroll by default, content must be wrapped             |

- Notice the event names change too: `onPress`, `onChangeText`, `onValueChange`. That leads into event handlers.

**🇰🇷 한글 해설**

1.2의 표를 확장한 표예요. **이벤트 이름까지** 외우세요.
- `Button` → `onPress` (웹은 onClick)
- `TextInput` → `onChangeText` (이벤트 객체가 아니라 **문자열**을 줌)
- `Switch` → `value` + `onValueChange` (체크박스 대신 토글 스위치)
- `Image` → `source` (웹은 src). 인터넷 이미지는 **width/height 필수**.
- 화면은 기본적으로 **스크롤이 안 돼요.** 스크롤하려면 `ScrollView`로 감싸야 해요.
- `Text` 안의 `Text`는 웹의 `<span>`처럼 한 줄 안에서 일부만 꾸밀 때 써요.

### 💻 Example: Event Handlers

- Create an app with a Button.
- Add the event handler using a function (defined in the component).
- Must run this on a device or emulator (Snack's iOS/Android preview or Expo Go). `Alert.alert` does nothing in the Web preview.

```jsx
import { View, Button, Alert } from "react-native";

function MyButton() {
  function handlePress() {
    Alert.alert("That felt good");
  }

  return <Button onPress={handlePress} title="I'm a button" />;
}

export default function MyApp() {
  return (
    <View style={{ marginTop: 100 }}>
      <MyButton />
    </View>
  );
}
```

▶ **[Snack에서 바로 실행하기](https://snack.expo.dev/?name=WEB530%20W2%20Example%3A%20Event%20Handlers&platform=ios&sdkVersion=54.0.0&code=import%20%7B%20View%2C%20Button%2C%20Alert%20%7D%20from%20%22react-native%22%3B%0A%0Afunction%20MyButton%28%29%20%7B%0A%20%20function%20handlePress%28%29%20%7B%0A%20%20%20%20Alert.alert%28%22That%20felt%20good%22%29%3B%0A%20%20%7D%0A%0A%20%20return%20%3CButton%20onPress%3D%7BhandlePress%7D%20title%3D%22I%27m%20a%20button%22%20%2F%3E%3B%0A%7D%0A%0Aexport%20default%20function%20MyApp%28%29%20%7B%0A%20%20return%20%28%0A%20%20%20%20%3CView%20style%3D%7B%7B%20marginTop%3A%20100%20%7D%7D%3E%0A%20%20%20%20%20%20%3CMyButton%20%2F%3E%0A%20%20%20%20%3C%2FView%3E%0A%20%20%29%3B%0A%7D%0A)** (SDK 54, 필요한 패키지 자동 포함)

- Show that the function can use arrow notation too.

```jsx
function MyButton() {
  const handlePress = () => {
    Alert.alert("That felt good");
  };

  return <Button onPress={handlePress} title="I'm a button" />;
}
```

- Now show the event handler can be defined inline as well.

```jsx
function MyButton() {
  return (
    <Button onPress={() => Alert.alert("That felt good")} title="I'm a button" />
  );
}
```

**🇰🇷 한글 해설**

**코드 해설**: 핸들러를 쓰는 3가지 방법. 결과는 모두 같아요.
1. `function handlePress() {...}` 컴포넌트 **안에** 일반 함수 선언 → `onPress={handlePress}`
2. `const handlePress = () => {...}` 화살표 함수 → `onPress={handlePress}`
3. `onPress={() => Alert.alert("That felt good")}` **인라인**

- `Alert.alert(제목, 메시지)` 는 **Web 미리보기에서는 아무 일도 안 일어나요!** Snack 오른쪽 위에서 iOS/Android를 고르거나 폰의 Expo Go로 확인하세요. (아래 Snack 링크는 그래서 iOS 미리보기로 열려요.)
- `style={{ marginTop: 100 }}`: 폰 상단 상태바(시계)에 가리지 않게 내린 것. 바깥 `{}`는 "JS 값", 안쪽 `{}`는 "객체".

### 💻 Example: Passing Props

- Modify the button to accept props, `{text, enabled}`.
- Set a default value `enabled = true`.
- Set a default value `text = "Button"`.
- Wire the button to read the props.

```jsx
function MyButton({ text = "Button", enabled = true }) {
  return (
    <Button
      disabled={!enabled}
      title={text}
      onPress={() => Alert.alert("That felt good")}
    />
  );
}
```

- Pass in values from the parent.

```jsx
export default function MyApp() {
  return (
    <View style={{ marginTop: 100 }}>
      <MyButton text="Click Me!" />
    </View>
  );
}
```

▶ 웹 React 코드예요. [교수님 CodeSandbox 템플릿](https://codesandbox.io/p/sandbox/react-basic-3rqll4)에 붙여넣어 실행하세요.

- Add another prop `message` and set the default value to `That felt good`.
- Wire the alert to receive the message.
- NOTE: You are already in a JS code block, you don't need the `{ }` brackets.

```jsx
import { View, Button, Alert } from "react-native";

function MyButton({
  text = "Button",
  enabled = true,
  message = "That felt good",
}) {
  return (
    <Button
      disabled={!enabled}
      title={text}
      onPress={() => Alert.alert(message)}
    />
  );
}

export default function MyApp() {
  return (
    <View style={{ marginTop: 100 }}>
      <MyButton text="Click Me!" message="That felt great!" />
    </View>
  );
}
```

▶ **[Snack에서 바로 실행하기](https://snack.expo.dev/?name=WEB530%20W2%20Example%3A%20Passing%20Props&platform=ios&sdkVersion=54.0.0&code=import%20%7B%20View%2C%20Button%2C%20Alert%20%7D%20from%20%22react-native%22%3B%0A%0Afunction%20MyButton%28%7B%0A%20%20text%20%3D%20%22Button%22%2C%0A%20%20enabled%20%3D%20true%2C%0A%20%20message%20%3D%20%22That%20felt%20good%22%2C%0A%7D%29%20%7B%0A%20%20return%20%28%0A%20%20%20%20%3CButton%0A%20%20%20%20%20%20disabled%3D%7B%21enabled%7D%0A%20%20%20%20%20%20title%3D%7Btext%7D%0A%20%20%20%20%20%20onPress%3D%7B%28%29%20%3D%3E%20Alert.alert%28message%29%7D%0A%20%20%20%20%2F%3E%0A%20%20%29%3B%0A%7D%0A%0Aexport%20default%20function%20MyApp%28%29%20%7B%0A%20%20return%20%28%0A%20%20%20%20%3CView%20style%3D%7B%7B%20marginTop%3A%20100%20%7D%7D%3E%0A%20%20%20%20%20%20%3CMyButton%20text%3D%22Click%20Me%21%22%20message%3D%22That%20felt%20great%21%22%20%2F%3E%0A%20%20%20%20%3C%2FView%3E%0A%20%20%29%3B%0A%7D%0A)** (SDK 54, 필요한 패키지 자동 포함)

**🇰🇷 한글 해설**

**코드 해설**
- `function MyButton({ text = "Button", enabled = true, message = "That felt good" })` → props 3개, 전부 기본값.
- `disabled={!enabled}` → enabled가 true면 disabled는 false.
- `onPress={() => Alert.alert(message)}` → **원문 NOTE**: 이미 `{ }` JS 영역 안이라서 `message`에 또 중괄호를 붙이지 않아요. `Alert.alert({message})` 라고 쓰면 객체가 들어가서 틀려요!
- 부모: `<MyButton text="Click Me!" message="That felt great!" />` → enabled는 안 넘겼으니 기본값 true.


---

## 5. 💻 인클래스 예제: Week 2.2 - Notes and Examples

> 원문 출처: github.com/nick-romanidis/web530-2267-nsa  week-02.2-notes.md

### 💻 React Native Playground

React Native Playground (Snack)
_Use this for the examples. Modify App.js_
(https://snack.expo.dev)

**🇰🇷 한글 해설**

같은 Snack에서 계속.

### 💻 Example: State

- Start from this version.

```jsx
import { View, Button } from "react-native";

function MyButton({ enabled = true }) {
  return <Button disabled={!enabled} title="Click Me" />;
}

export default function MyApp() {
  return (
    <View style={{ marginTop: 100 }}>
      <MyButton />
    </View>
  );
}
```

▶ **[Snack에서 바로 실행하기](https://snack.expo.dev/?name=WEB530%20W2%20Example%3A%20State&platform=web&sdkVersion=54.0.0&code=import%20%7B%20View%2C%20Button%20%7D%20from%20%22react-native%22%3B%0A%0Afunction%20MyButton%28%7B%20enabled%20%3D%20true%20%7D%29%20%7B%0A%20%20return%20%3CButton%20disabled%3D%7B%21enabled%7D%20title%3D%22Click%20Me%22%20%2F%3E%3B%0A%7D%0A%0Aexport%20default%20function%20MyApp%28%29%20%7B%0A%20%20return%20%28%0A%20%20%20%20%3CView%20style%3D%7B%7B%20marginTop%3A%20100%20%7D%7D%3E%0A%20%20%20%20%20%20%3CMyButton%20%2F%3E%0A%20%20%20%20%3C%2FView%3E%0A%20%20%29%3B%0A%7D%0A)** (SDK 54, 필요한 패키지 자동 포함) <button class="snack-embed" type="button">👀 여기서 결과 보기</button>

- Add a variable to the button to count how many times it is clicked.

```jsx
import { View, Button, Alert } from "react-native";

function MyButton({ enabled = true }) {
  let count = 0;

  return (
    <Button
      disabled={!enabled}
      onPress={() => {
        count++;
        Alert.alert(`${count}`);
      }}
      title="Click Me"
    />
  );
}
```

- Show the click count on the button.
- It will not refresh because we are not using state.

```jsx
function MyButton({ enabled = true }) {
  let count = 0;

  return (
    <Button
      disabled={!enabled}
      onPress={() => {
        count++;
        Alert.alert(`${count}`);
      }}
      title={`Button clicked ${count} times`}
    />
  );
}
```

- Let's fix this by adding state.
- Let's remove the Alert as well.

```jsx
import { useState } from "react";
import { View, Button } from "react-native";

function MyButton({ enabled = true }) {
  const [count, setCount] = useState(0);

  return (
    <Button
      disabled={!enabled}
      onPress={() => {
        setCount((prev) => prev + 1);
      }}
      title={`Button clicked ${count} times`}
    />
  );
}

export default function MyApp() {
  return (
    <View style={{ marginTop: 100 }}>
      <MyButton />
    </View>
  );
}
```

▶ **[Snack에서 바로 실행하기](https://snack.expo.dev/?name=WEB530%20W2%20Example%3A%20State&platform=web&sdkVersion=54.0.0&code=import%20%7B%20useState%20%7D%20from%20%22react%22%3B%0Aimport%20%7B%20View%2C%20Button%20%7D%20from%20%22react-native%22%3B%0A%0Afunction%20MyButton%28%7B%20enabled%20%3D%20true%20%7D%29%20%7B%0A%20%20const%20%5Bcount%2C%20setCount%5D%20%3D%20useState%280%29%3B%0A%0A%20%20return%20%28%0A%20%20%20%20%3CButton%0A%20%20%20%20%20%20disabled%3D%7B%21enabled%7D%0A%20%20%20%20%20%20onPress%3D%7B%28%29%20%3D%3E%20%7B%0A%20%20%20%20%20%20%20%20setCount%28%28prev%29%20%3D%3E%20prev%20%2B%201%29%3B%0A%20%20%20%20%20%20%7D%7D%0A%20%20%20%20%20%20title%3D%7B%60Button%20clicked%20%24%7Bcount%7D%20times%60%7D%0A%20%20%20%20%2F%3E%0A%20%20%29%3B%0A%7D%0A%0Aexport%20default%20function%20MyApp%28%29%20%7B%0A%20%20return%20%28%0A%20%20%20%20%3CView%20style%3D%7B%7B%20marginTop%3A%20100%20%7D%7D%3E%0A%20%20%20%20%20%20%3CMyButton%20%2F%3E%0A%20%20%20%20%3C%2FView%3E%0A%20%20%29%3B%0A%7D%0A)** (SDK 54, 필요한 패키지 자동 포함) <button class="snack-embed" type="button">👀 여기서 결과 보기</button>

- The new count depends on the old one, so we pass a function to `setCount`. Show what goes wrong if we use `count` directly instead.
- Change the button to add 2 by calling `setCount` twice.

```jsx
function MyButton({ enabled = true }) {
  const [count, setCount] = useState(0);

  return (
    <Button
      disabled={!enabled}
      onPress={() => {
        // Bug: both calls read the same count.
        setCount(count + 1);
        setCount(count + 1);
      }}
      title={`Button clicked ${count} times`}
    />
  );
}
```

- Press it. The count goes up by 1, not 2.
- `count` is a plain variable that was filled in when the component rendered. Both calls read the same value, so both say "make it 1". React batches them and applies the same value twice.
- Now change both calls to `setCount((prev) => prev + 1)`. React runs each function on the latest value, so the count goes up by 2.
- To avoid stale state, always use this syntax when the new value depends on the old one: `setCount((prev) => prev + 1)`, `setOn((prev) => !prev)`, `setItems((prev) => [...prev, item])`.

```jsx
function MyButton({ enabled = true }) {
  const [count, setCount] = useState(0);

  return (
    <Button
      disabled={!enabled}
      onPress={() => {
        setCount((prev) => prev + 1);
      }}
      title={`Button clicked ${count} times`}
    />
  );
}
```

**🇰🇷 한글 해설**

**수업 흐름 따라가기 (5단계)**
1. 시작 버전: 그냥 버튼.
2. `let count = 0;` 일반 변수로 세기 → Alert에는 숫자가 올라가는데...
3. 버튼 제목에 `count`를 보여 주면 **화면이 안 바뀌어요.** 왜? 일반 변수가 바뀌어도 React는 **다시 그려야 하는지 몰라요.** 그리고 다시 그려지면 `let count = 0`부터 다시 시작해서 리셋돼요.
4. `useState(0)`로 바꾸면 해결. `setCount`가 "값 바꿨으니 다시 그려!"라고 React에 알려 줘요.
5. 함정 실험: `setCount(count + 1)` 두 번 → 1씩만 증가(버그). `setCount((prev) => prev + 1)` 두 번 → 2씩 증가.

원문의 마지막 bullet이 시험 정답 문장이에요: "To avoid stale state, always use this syntax when the new value depends on the old one". **Stale state** = 오래된(상한) state 값.

### 💻 Example: Lifting State Up

- Lift state up, so that the parent knows when the value changes.
- Move the press handler outside of the function and pass as a prop.

```jsx
import { useState } from "react";
import { Text, View, Button } from "react-native";

function MyButton({ enabled = true, handlePress, count }) {
  return (
    <Button
      disabled={!enabled}
      onPress={handlePress}
      title={`Button clicked ${count} times`}
    />
  );
}

export default function MyApp() {
  const [count, setCount] = useState(0);

  return (
    <View style={{ marginTop: 100 }}>
      <Text>Button clicked {count} times</Text>
      <MyButton
        count={count}
        handlePress={() => {
          setCount((prev) => prev + 1);
        }}
      />
    </View>
  );
}
```

▶ **[Snack에서 바로 실행하기](https://snack.expo.dev/?name=WEB530%20W2%20Example%3A%20Lifting%20State%20Up&platform=web&sdkVersion=54.0.0&code=import%20%7B%20useState%20%7D%20from%20%22react%22%3B%0Aimport%20%7B%20Text%2C%20View%2C%20Button%20%7D%20from%20%22react-native%22%3B%0A%0Afunction%20MyButton%28%7B%20enabled%20%3D%20true%2C%20handlePress%2C%20count%20%7D%29%20%7B%0A%20%20return%20%28%0A%20%20%20%20%3CButton%0A%20%20%20%20%20%20disabled%3D%7B%21enabled%7D%0A%20%20%20%20%20%20onPress%3D%7BhandlePress%7D%0A%20%20%20%20%20%20title%3D%7B%60Button%20clicked%20%24%7Bcount%7D%20times%60%7D%0A%20%20%20%20%2F%3E%0A%20%20%29%3B%0A%7D%0A%0Aexport%20default%20function%20MyApp%28%29%20%7B%0A%20%20const%20%5Bcount%2C%20setCount%5D%20%3D%20useState%280%29%3B%0A%0A%20%20return%20%28%0A%20%20%20%20%3CView%20style%3D%7B%7B%20marginTop%3A%20100%20%7D%7D%3E%0A%20%20%20%20%20%20%3CText%3EButton%20clicked%20%7Bcount%7D%20times%3C%2FText%3E%0A%20%20%20%20%20%20%3CMyButton%0A%20%20%20%20%20%20%20%20count%3D%7Bcount%7D%0A%20%20%20%20%20%20%20%20handlePress%3D%7B%28%29%20%3D%3E%20%7B%0A%20%20%20%20%20%20%20%20%20%20setCount%28%28prev%29%20%3D%3E%20prev%20%2B%201%29%3B%0A%20%20%20%20%20%20%20%20%7D%7D%0A%20%20%20%20%20%20%2F%3E%0A%20%20%20%20%3C%2FView%3E%0A%20%20%29%3B%0A%7D%0A)** (SDK 54, 필요한 패키지 자동 포함) <button class="snack-embed" type="button">👀 여기서 결과 보기</button>

**🇰🇷 한글 해설**

**코드 해설**
- state(`count`)가 `MyButton`에서 **부모 `MyApp`으로 이사** 왔어요.
- `MyButton`은 이제 state가 없어요. `count`(보여 줄 값)와 `handlePress`(누르면 부를 함수)를 **props로 받기만** 해요.
- 그래서 부모의 `<Text>`와 버튼 제목이 **항상 같은 숫자**를 보여요. 이게 lifting state up의 목적.
- Lab 2 Question 4(농구 점수판)가 이 패턴 그대로예요.

### 💻 Example: useEffect

- Add a side effect.
- The function returned from the effect is the clean-up. Here it cancels the timer.

```jsx
import { useState, useEffect } from "react";
import { Text, View, Button } from "react-native";

function MyButton({ enabled = true, handlePress, count }) {
  useEffect(() => {
    // Initialize the component

    // Start async task
    const id = setTimeout(() => {
      handlePress();
    }, 1000);

    return () => {
      // Cleanup code here
      clearTimeout(id);
    };
  });

  return (
    <Button
      disabled={!enabled}
      onPress={handlePress}
      title={`Button clicked ${count} times`}
    />
  );
}

export default function MyApp() {
  const [count, setCount] = useState(0);

  return (
    <View style={{ marginTop: 100 }}>
      <Text>Button clicked {count} times</Text>
      <MyButton
        count={count}
        handlePress={() => {
          setCount((prev) => prev + 1);
        }}
      />
    </View>
  );
}
```

▶ **[Snack에서 바로 실행하기](https://snack.expo.dev/?name=WEB530%20W2%20Example%3A%20useEffect&platform=web&sdkVersion=54.0.0&code=import%20%7B%20useState%2C%20useEffect%20%7D%20from%20%22react%22%3B%0Aimport%20%7B%20Text%2C%20View%2C%20Button%20%7D%20from%20%22react-native%22%3B%0A%0Afunction%20MyButton%28%7B%20enabled%20%3D%20true%2C%20handlePress%2C%20count%20%7D%29%20%7B%0A%20%20useEffect%28%28%29%20%3D%3E%20%7B%0A%20%20%20%20%2F%2F%20Initialize%20the%20component%0A%0A%20%20%20%20%2F%2F%20Start%20async%20task%0A%20%20%20%20const%20id%20%3D%20setTimeout%28%28%29%20%3D%3E%20%7B%0A%20%20%20%20%20%20handlePress%28%29%3B%0A%20%20%20%20%7D%2C%201000%29%3B%0A%0A%20%20%20%20return%20%28%29%20%3D%3E%20%7B%0A%20%20%20%20%20%20%2F%2F%20Cleanup%20code%20here%0A%20%20%20%20%20%20clearTimeout%28id%29%3B%0A%20%20%20%20%7D%3B%0A%20%20%7D%29%3B%0A%0A%20%20return%20%28%0A%20%20%20%20%3CButton%0A%20%20%20%20%20%20disabled%3D%7B%21enabled%7D%0A%20%20%20%20%20%20onPress%3D%7BhandlePress%7D%0A%20%20%20%20%20%20title%3D%7B%60Button%20clicked%20%24%7Bcount%7D%20times%60%7D%0A%20%20%20%20%2F%3E%0A%20%20%29%3B%0A%7D%0A%0Aexport%20default%20function%20MyApp%28%29%20%7B%0A%20%20const%20%5Bcount%2C%20setCount%5D%20%3D%20useState%280%29%3B%0A%0A%20%20return%20%28%0A%20%20%20%20%3CView%20style%3D%7B%7B%20marginTop%3A%20100%20%7D%7D%3E%0A%20%20%20%20%20%20%3CText%3EButton%20clicked%20%7Bcount%7D%20times%3C%2FText%3E%0A%20%20%20%20%20%20%3CMyButton%0A%20%20%20%20%20%20%20%20count%3D%7Bcount%7D%0A%20%20%20%20%20%20%20%20handlePress%3D%7B%28%29%20%3D%3E%20%7B%0A%20%20%20%20%20%20%20%20%20%20setCount%28%28prev%29%20%3D%3E%20prev%20%2B%201%29%3B%0A%20%20%20%20%20%20%20%20%7D%7D%0A%20%20%20%20%20%20%2F%3E%0A%20%20%20%20%3C%2FView%3E%0A%20%20%29%3B%0A%7D%0A)** (SDK 54, 필요한 패키지 자동 포함) <button class="snack-embed" type="button">👀 여기서 결과 보기</button>

- Notice the program keeps counting and never stops!
- Each value change causes a render which causes useEffect to fire.
- Add a dependency array so it runs only after the first render.
- Notice the warning due to the empty `[]`.

```jsx
function MyButton({ enabled = true, handlePress, count }) {
  useEffect(() => {
    // Initialize the component

    // Start async task
    const id = setTimeout(() => {
      handlePress();
    }, 1000);

    return () => {
      // Cleanup code here
      clearTimeout(id);
    };
  }, []); // Safe to ignore

  return (
    <Button
      disabled={!enabled}
      onPress={handlePress}
      title={`Button clicked ${count} times`}
    />
  );
}
```

- To get rid of the warning we can use `useCallback`.
- `useCallback` keeps the same function between renders, so `[handlePress]` does not change and the effect only runs once.

```jsx
import { useState, useEffect, useCallback } from "react";
import { Text, View, Button } from "react-native";

function MyButton({ enabled = true, handlePress, count }) {
  useEffect(() => {
    // Initialize the component

    // Start async task
    const id = setTimeout(() => {
      handlePress();
    }, 1000);

    return () => {
      // Cleanup code here
      clearTimeout(id);
    };
  }, [handlePress]);

  return (
    <Button
      disabled={!enabled}
      onPress={handlePress}
      title={`Button clicked ${count} times`}
    />
  );
}

export default function MyApp() {
  const [count, setCount] = useState(0);

  const handlePress = useCallback(() => {
    setCount((prev) => prev + 1);
  }, []);

  return (
    <View style={{ marginTop: 100 }}>
      <Text>Button clicked {count} times</Text>
      <MyButton count={count} handlePress={handlePress} />
    </View>
  );
}
```

▶ **[Snack에서 바로 실행하기](https://snack.expo.dev/?name=WEB530%20W2%20Example%3A%20useEffect&platform=web&sdkVersion=54.0.0&code=import%20%7B%20useState%2C%20useEffect%2C%20useCallback%20%7D%20from%20%22react%22%3B%0Aimport%20%7B%20Text%2C%20View%2C%20Button%20%7D%20from%20%22react-native%22%3B%0A%0Afunction%20MyButton%28%7B%20enabled%20%3D%20true%2C%20handlePress%2C%20count%20%7D%29%20%7B%0A%20%20useEffect%28%28%29%20%3D%3E%20%7B%0A%20%20%20%20%2F%2F%20Initialize%20the%20component%0A%0A%20%20%20%20%2F%2F%20Start%20async%20task%0A%20%20%20%20const%20id%20%3D%20setTimeout%28%28%29%20%3D%3E%20%7B%0A%20%20%20%20%20%20handlePress%28%29%3B%0A%20%20%20%20%7D%2C%201000%29%3B%0A%0A%20%20%20%20return%20%28%29%20%3D%3E%20%7B%0A%20%20%20%20%20%20%2F%2F%20Cleanup%20code%20here%0A%20%20%20%20%20%20clearTimeout%28id%29%3B%0A%20%20%20%20%7D%3B%0A%20%20%7D%2C%20%5BhandlePress%5D%29%3B%0A%0A%20%20return%20%28%0A%20%20%20%20%3CButton%0A%20%20%20%20%20%20disabled%3D%7B%21enabled%7D%0A%20%20%20%20%20%20onPress%3D%7BhandlePress%7D%0A%20%20%20%20%20%20title%3D%7B%60Button%20clicked%20%24%7Bcount%7D%20times%60%7D%0A%20%20%20%20%2F%3E%0A%20%20%29%3B%0A%7D%0A%0Aexport%20default%20function%20MyApp%28%29%20%7B%0A%20%20const%20%5Bcount%2C%20setCount%5D%20%3D%20useState%280%29%3B%0A%0A%20%20const%20handlePress%20%3D%20useCallback%28%28%29%20%3D%3E%20%7B%0A%20%20%20%20setCount%28%28prev%29%20%3D%3E%20prev%20%2B%201%29%3B%0A%20%20%7D%2C%20%5B%5D%29%3B%0A%0A%20%20return%20%28%0A%20%20%20%20%3CView%20style%3D%7B%7B%20marginTop%3A%20100%20%7D%7D%3E%0A%20%20%20%20%20%20%3CText%3EButton%20clicked%20%7Bcount%7D%20times%3C%2FText%3E%0A%20%20%20%20%20%20%3CMyButton%20count%3D%7Bcount%7D%20handlePress%3D%7BhandlePress%7D%20%2F%3E%0A%20%20%20%20%3C%2FView%3E%0A%20%20%29%3B%0A%7D%0A)** (SDK 54, 필요한 패키지 자동 포함) <button class="snack-embed" type="button">👀 여기서 결과 보기</button>

**🇰🇷 한글 해설**

**수업 흐름 따라가기**
1. 의존성 배열 **없이** useEffect: 1초 뒤 handlePress → count 바뀜 → 다시 렌더 → effect 다시 → ... **영원히 카운트**.
2. `[]` 추가: 한 번만 실행. 하지만 handlePress를 안 적었다고 **경고**(원문 코멘트 "Safe to ignore").
3. 정답: 부모에서 `useCallback(() => {...}, [])` 으로 handlePress를 고정 + 자식은 `[handlePress]`. 경고 없음, 한 번만 실행.

`setTimeout` 은 id를 돌려주고, cleanup에서 `clearTimeout(id)` 로 타이머를 꺼요. Lab 2 Q5(스톱워치)는 `setInterval` / `clearInterval` 버전이에요. setTimeout은 **한 번**, setInterval은 **반복**.

### 💻 Example: Using Context for State

- Start from this version. It is the lifted state example with the `useEffect` and `useCallback` removed. Copy and paste it into `App.js`.

```jsx
import { useState } from "react";
import { Text, View, Button } from "react-native";

function MyButton({ enabled = true, handlePress, count }) {
  return (
    <Button
      disabled={!enabled}
      onPress={handlePress}
      title={`Button clicked ${count} times`}
    />
  );
}

export default function MyApp() {
  const [count, setCount] = useState(0);

  const handlePress = () => {
    setCount((prev) => prev + 1);
  };

  return (
    <View style={{ marginTop: 100 }}>
      <Text>Button clicked {count} times</Text>
      <MyButton count={count} handlePress={handlePress} />
    </View>
  );
}
```

▶ **[Snack에서 바로 실행하기](https://snack.expo.dev/?name=WEB530%20W2%20Example%3A%20Using%20Context%20for%20State&platform=web&sdkVersion=54.0.0&code=import%20%7B%20useState%20%7D%20from%20%22react%22%3B%0Aimport%20%7B%20Text%2C%20View%2C%20Button%20%7D%20from%20%22react-native%22%3B%0A%0Afunction%20MyButton%28%7B%20enabled%20%3D%20true%2C%20handlePress%2C%20count%20%7D%29%20%7B%0A%20%20return%20%28%0A%20%20%20%20%3CButton%0A%20%20%20%20%20%20disabled%3D%7B%21enabled%7D%0A%20%20%20%20%20%20onPress%3D%7BhandlePress%7D%0A%20%20%20%20%20%20title%3D%7B%60Button%20clicked%20%24%7Bcount%7D%20times%60%7D%0A%20%20%20%20%2F%3E%0A%20%20%29%3B%0A%7D%0A%0Aexport%20default%20function%20MyApp%28%29%20%7B%0A%20%20const%20%5Bcount%2C%20setCount%5D%20%3D%20useState%280%29%3B%0A%0A%20%20const%20handlePress%20%3D%20%28%29%20%3D%3E%20%7B%0A%20%20%20%20setCount%28%28prev%29%20%3D%3E%20prev%20%2B%201%29%3B%0A%20%20%7D%3B%0A%0A%20%20return%20%28%0A%20%20%20%20%3CView%20style%3D%7B%7B%20marginTop%3A%20100%20%7D%7D%3E%0A%20%20%20%20%20%20%3CText%3EButton%20clicked%20%7Bcount%7D%20times%3C%2FText%3E%0A%20%20%20%20%20%20%3CMyButton%20count%3D%7Bcount%7D%20handlePress%3D%7BhandlePress%7D%20%2F%3E%0A%20%20%20%20%3C%2FView%3E%0A%20%20%29%3B%0A%7D%0A)** (SDK 54, 필요한 패키지 자동 포함) <button class="snack-embed" type="button">👀 여기서 결과 보기</button>

- Create the context and a provider component.
- Merge the context into the button.
- Create a new component for displaying the information.
- Update the MyApp component.

```jsx
import { useState, createContext, useContext } from "react";
import { Text, View, Button } from "react-native";

// Create the Context
const CountContext = createContext();

function CountProvider({ children }) {
  const [count, setCount] = useState(0);

  const handlePress = () => {
    setCount((prev) => prev + 1);
  };

  return (
    <CountContext.Provider value={{ count, handlePress }}>
      {children}
    </CountContext.Provider>
  );
}

function MyButton({ enabled = true }) {
  const { count, handlePress } = useContext(CountContext);

  return (
    <Button
      disabled={!enabled}
      onPress={handlePress}
      title={`Button clicked ${count} times`}
    />
  );
}

function CountDisplay() {
  const { count } = useContext(CountContext);
  return <Text>Button clicked {count} times</Text>;
}

export default function MyApp() {
  return (
    <CountProvider>
      <View style={{ marginTop: 100 }}>
        <CountDisplay />
        <MyButton />
      </View>
    </CountProvider>
  );
}
```

▶ **[Snack에서 바로 실행하기](https://snack.expo.dev/?name=WEB530%20W2%20Example%3A%20Using%20Context%20for%20State&platform=web&sdkVersion=54.0.0&code=import%20%7B%20useState%2C%20createContext%2C%20useContext%20%7D%20from%20%22react%22%3B%0Aimport%20%7B%20Text%2C%20View%2C%20Button%20%7D%20from%20%22react-native%22%3B%0A%0A%2F%2F%20Create%20the%20Context%0Aconst%20CountContext%20%3D%20createContext%28%29%3B%0A%0Afunction%20CountProvider%28%7B%20children%20%7D%29%20%7B%0A%20%20const%20%5Bcount%2C%20setCount%5D%20%3D%20useState%280%29%3B%0A%0A%20%20const%20handlePress%20%3D%20%28%29%20%3D%3E%20%7B%0A%20%20%20%20setCount%28%28prev%29%20%3D%3E%20prev%20%2B%201%29%3B%0A%20%20%7D%3B%0A%0A%20%20return%20%28%0A%20%20%20%20%3CCountContext.Provider%20value%3D%7B%7B%20count%2C%20handlePress%20%7D%7D%3E%0A%20%20%20%20%20%20%7Bchildren%7D%0A%20%20%20%20%3C%2FCountContext.Provider%3E%0A%20%20%29%3B%0A%7D%0A%0Afunction%20MyButton%28%7B%20enabled%20%3D%20true%20%7D%29%20%7B%0A%20%20const%20%7B%20count%2C%20handlePress%20%7D%20%3D%20useContext%28CountContext%29%3B%0A%0A%20%20return%20%28%0A%20%20%20%20%3CButton%0A%20%20%20%20%20%20disabled%3D%7B%21enabled%7D%0A%20%20%20%20%20%20onPress%3D%7BhandlePress%7D%0A%20%20%20%20%20%20title%3D%7B%60Button%20clicked%20%24%7Bcount%7D%20times%60%7D%0A%20%20%20%20%2F%3E%0A%20%20%29%3B%0A%7D%0A%0Afunction%20CountDisplay%28%29%20%7B%0A%20%20const%20%7B%20count%20%7D%20%3D%20useContext%28CountContext%29%3B%0A%20%20return%20%3CText%3EButton%20clicked%20%7Bcount%7D%20times%3C%2FText%3E%3B%0A%7D%0A%0Aexport%20default%20function%20MyApp%28%29%20%7B%0A%20%20return%20%28%0A%20%20%20%20%3CCountProvider%3E%0A%20%20%20%20%20%20%3CView%20style%3D%7B%7B%20marginTop%3A%20100%20%7D%7D%3E%0A%20%20%20%20%20%20%20%20%3CCountDisplay%20%2F%3E%0A%20%20%20%20%20%20%20%20%3CMyButton%20%2F%3E%0A%20%20%20%20%20%20%3C%2FView%3E%0A%20%20%20%20%3C%2FCountProvider%3E%0A%20%20%29%3B%0A%7D%0A)** (SDK 54, 필요한 패키지 자동 포함) <button class="snack-embed" type="button">👀 여기서 결과 보기</button>

**🇰🇷 한글 해설**

**코드 해설 (4단계, 원문 bullet 순서)**
1. `const CountContext = createContext();` 컨텍스트 만들기.
2. `CountProvider` 컴포넌트: state와 handlePress를 갖고 있고, `value={{ count, handlePress }}` 로 **객체 하나에 담아** 제공. `{{ }}` 는 "JS 영역 + 객체".
3. `MyButton`, `CountDisplay`: `const { count, handlePress } = useContext(CountContext);` 로 꺼내 씀. props 없음!
4. `MyApp`: `<CountProvider>`로 감싸기만. state 없음.

Provider로 감싸지 않은 곳에서 `useContext`를 쓰면 값이 `undefined`라서 에러가 나요. 자주 하는 실수!

### 💻 Example: Using Jotai

- Jotai makes it so much easier.
- A tiny state-management library that gives you global state with the same simplicity as useState.
- Instead of building context providers, reducers, or stores, you create small "atoms" that behave like shared pieces of state.
- Any component can read or update an atom directly, without prop-drilling or boilerplate.

_package.json_

```js
{
  "dependencies": {
    "react-native-paper": "4.9.2",
    "@expo/vector-icons": "^15.0.3",
    "jotai": "*",
    "@babel/template": "*",
    "@types/react": "*"
  }
}
```

- Start from this version. It is the lifted state example with `CountDisplay` added and the Context removed. Copy and paste it into `App.js`.

```jsx
import { useState } from "react";
import { Text, View, Button } from "react-native";

function MyButton({ enabled = true, handlePress, count }) {
  return (
    <Button
      disabled={!enabled}
      onPress={handlePress}
      title={`Button clicked ${count} times`}
    />
  );
}

function CountDisplay({ count }) {
  return <Text>Button clicked {count} times</Text>;
}

export default function MyApp() {
  const [count, setCount] = useState(0);

  const handlePress = () => {
    setCount((prev) => prev + 1);
  };

  return (
    <View style={{ marginTop: 100 }}>
      <CountDisplay count={count} />
      <MyButton count={count} handlePress={handlePress} />
    </View>
  );
}
```

▶ **[Snack에서 바로 실행하기](https://snack.expo.dev/?name=WEB530%20W2%20Example%3A%20Using%20Jotai&platform=web&sdkVersion=54.0.0&code=import%20%7B%20useState%20%7D%20from%20%22react%22%3B%0Aimport%20%7B%20Text%2C%20View%2C%20Button%20%7D%20from%20%22react-native%22%3B%0A%0Afunction%20MyButton%28%7B%20enabled%20%3D%20true%2C%20handlePress%2C%20count%20%7D%29%20%7B%0A%20%20return%20%28%0A%20%20%20%20%3CButton%0A%20%20%20%20%20%20disabled%3D%7B%21enabled%7D%0A%20%20%20%20%20%20onPress%3D%7BhandlePress%7D%0A%20%20%20%20%20%20title%3D%7B%60Button%20clicked%20%24%7Bcount%7D%20times%60%7D%0A%20%20%20%20%2F%3E%0A%20%20%29%3B%0A%7D%0A%0Afunction%20CountDisplay%28%7B%20count%20%7D%29%20%7B%0A%20%20return%20%3CText%3EButton%20clicked%20%7Bcount%7D%20times%3C%2FText%3E%3B%0A%7D%0A%0Aexport%20default%20function%20MyApp%28%29%20%7B%0A%20%20const%20%5Bcount%2C%20setCount%5D%20%3D%20useState%280%29%3B%0A%0A%20%20const%20handlePress%20%3D%20%28%29%20%3D%3E%20%7B%0A%20%20%20%20setCount%28%28prev%29%20%3D%3E%20prev%20%2B%201%29%3B%0A%20%20%7D%3B%0A%0A%20%20return%20%28%0A%20%20%20%20%3CView%20style%3D%7B%7B%20marginTop%3A%20100%20%7D%7D%3E%0A%20%20%20%20%20%20%3CCountDisplay%20count%3D%7Bcount%7D%20%2F%3E%0A%20%20%20%20%20%20%3CMyButton%20count%3D%7Bcount%7D%20handlePress%3D%7BhandlePress%7D%20%2F%3E%0A%20%20%20%20%3C%2FView%3E%0A%20%20%29%3B%0A%7D%0A)** (SDK 54, 필요한 패키지 자동 포함) <button class="snack-embed" type="button">👀 여기서 결과 보기</button>

- Create a global atom above the components.
- Replace the `useState` in `MyApp` with nothing. `MyApp` no longer owns the count.
- In `MyButton` and `CountDisplay`, remove the props and call `useAtom(countAtom)` instead. It returns the same `[value, setter]` pair as `useState`.
- Notice there is no provider to wrap and no props to pass.

_App.js_

```jsx
import { atom, useAtom } from "jotai";
import { Text, View, Button } from "react-native";

// Global atom
const countAtom = atom(0);

function MyButton({ enabled = true }) {
  const [count, setCount] = useAtom(countAtom);

  return (
    <Button
      disabled={!enabled}
      onPress={() => setCount((prev) => prev + 1)}
      title={`Button clicked ${count} times`}
    />
  );
}

function CountDisplay() {
  const [count] = useAtom(countAtom);
  return <Text>Button clicked {count} times</Text>;
}

export default function MyApp() {
  return (
    <View style={{ marginTop: 100 }}>
      <CountDisplay />
      <MyButton />
    </View>
  );
}
```

▶ **[Snack에서 바로 실행하기](https://snack.expo.dev/?name=WEB530%20W2%20Example%3A%20Using%20Jotai&platform=web&sdkVersion=54.0.0&code=import%20%7B%20atom%2C%20useAtom%20%7D%20from%20%22jotai%22%3B%0Aimport%20%7B%20Text%2C%20View%2C%20Button%20%7D%20from%20%22react-native%22%3B%0A%0A%2F%2F%20Global%20atom%0Aconst%20countAtom%20%3D%20atom%280%29%3B%0A%0Afunction%20MyButton%28%7B%20enabled%20%3D%20true%20%7D%29%20%7B%0A%20%20const%20%5Bcount%2C%20setCount%5D%20%3D%20useAtom%28countAtom%29%3B%0A%0A%20%20return%20%28%0A%20%20%20%20%3CButton%0A%20%20%20%20%20%20disabled%3D%7B%21enabled%7D%0A%20%20%20%20%20%20onPress%3D%7B%28%29%20%3D%3E%20setCount%28%28prev%29%20%3D%3E%20prev%20%2B%201%29%7D%0A%20%20%20%20%20%20title%3D%7B%60Button%20clicked%20%24%7Bcount%7D%20times%60%7D%0A%20%20%20%20%2F%3E%0A%20%20%29%3B%0A%7D%0A%0Afunction%20CountDisplay%28%29%20%7B%0A%20%20const%20%5Bcount%5D%20%3D%20useAtom%28countAtom%29%3B%0A%20%20return%20%3CText%3EButton%20clicked%20%7Bcount%7D%20times%3C%2FText%3E%3B%0A%7D%0A%0Aexport%20default%20function%20MyApp%28%29%20%7B%0A%20%20return%20%28%0A%20%20%20%20%3CView%20style%3D%7B%7B%20marginTop%3A%20100%20%7D%7D%3E%0A%20%20%20%20%20%20%3CCountDisplay%20%2F%3E%0A%20%20%20%20%20%20%3CMyButton%20%2F%3E%0A%20%20%20%20%3C%2FView%3E%0A%20%20%29%3B%0A%7D%0A&dependencies=%40types%2Freact%40%2A%2Cjotai%40%2A)** (SDK 54, 필요한 패키지 자동 포함)

**🇰🇷 한글 해설**

**코드 해설**
- `package.json`에 `jotai` 추가 필요 (Snack 링크엔 자동 포함).
- `const countAtom = atom(0);` → 컴포넌트 **바깥**(파일 맨 위)에 선언. 안에 선언하면 렌더링마다 새 atom이 생겨서 공유가 안 돼요.
- `useAtom(countAtom)` 은 `useState`랑 똑같이 `[값, setter]`를 줘요.
- `CountDisplay`는 값만 필요하니 `const [count] = useAtom(countAtom);`
- MyApp에 state도, Provider도, props도 **없어요.** Context 버전과 비교해 보세요. 코드가 훨씬 짧아요.


---

## 6. 🧪 Lab: Lab 2 - React Native, Events, and State

> 원문 출처: github.com/nick-romanidis/web530-2267-nsa  lab-2.md

**🇰🇷 들어가기 전에**

Lab 2는 Test 1 대비용으로 아주 좋은 문제들이에요. 각 문제가 어떤 인클래스 예제와 연결되는지, 어디서 실수하기 쉬운지 정리했어요. 정답 코드를 통째로 쓰기보다 **핵심 패턴**만 보여 줄게요. 직접 Snack에 쳐 보세요.

### 🧪 A Note on AI

AI assistants are welcome in this course, but use them to get unstuck, not to do the work. Attempt every question yourself first. If you are stuck, paste **your** code and ask why it does not work or what concept you are missing, rather than asking for the answer. Never keep code you could not explain line by line to a classmate. If you cannot explain it, you cannot debug it or build on it, and it is not yours yet. The point of this lab is not the finished Snack. It is the ability to write these components yourself, and having an assistant write them for you skips the only part that builds that ability.

**🇰🇷 한글 해설**

AI는 막혔을 때만 쓰고, 설명 못 하는 코드는 남기지 말라는 안내. 시험장에선 혼자 써야 하니 직접 타이핑 연습이 제일 중요해요.

### 🧪 Setup

This lab uses React Native only. There is no React DOM, no `div`, and no `createRoot`. Plan for about 60 minutes.

1. You need a free Expo account. Create one at https://expo.dev/signup, or sign in with your GitHub account.
2. Open the React Native Playground (Snack) at https://snack.expo.dev and sign in.
3. Rename the Snack to `WEB530 Lab 2 - Your Name` (click the name at the top left).
4. Open `App.js`, delete everything in it, and paste in the starter below.
5. Click **Save** so the Snack gets a permanent link.

Starter for `App.js`:

```jsx
import { ScrollView, Text } from "react-native";

export default function MyApp() {
  return (
    <ScrollView style={{ marginTop: 60 }}>
      <Text>Question 1</Text>
      {/* Your components go here */}
    </ScrollView>
  );
}
```

▶ **[Snack에서 바로 실행하기](https://snack.expo.dev/?name=WEB530%20W2%20Setup&platform=web&sdkVersion=54.0.0&code=import%20%7B%20ScrollView%2C%20Text%20%7D%20from%20%22react-native%22%3B%0A%0Aexport%20default%20function%20MyApp%28%29%20%7B%0A%20%20return%20%28%0A%20%20%20%20%3CScrollView%20style%3D%7B%7B%20marginTop%3A%2060%20%7D%7D%3E%0A%20%20%20%20%20%20%3CText%3EQuestion%201%3C%2FText%3E%0A%20%20%20%20%20%20%7B%2F%2A%20Your%20components%20go%20here%20%2A%2F%7D%0A%20%20%20%20%3C%2FScrollView%3E%0A%20%20%29%3B%0A%7D%0A)** (SDK 54, 필요한 패키지 자동 포함) <button class="snack-embed" type="button">👀 여기서 결과 보기</button>

About that one line of style: the `style={{ marginTop: 60 }}` on the outer `ScrollView` pushes your content below the phone's clock and status bar so you can see it in the preview. It stays on the outer `ScrollView` in `MyApp` and nowhere else. **It is the only style allowed in this lab.** Do not add `style` props or `StyleSheet` anywhere else. Styling is covered in a later week.

**🇰🇷 한글 해설**

React Native만 써요(div, createRoot 없음). 허용된 스타일은 바깥 ScrollView의 `marginTop: 60` **딱 하나**. 스타일은 3주차에 배워요.

### 🧪 Running Your App

Snack shows a preview on the right. There are three ways to run your code:

- **Web** tab: fastest, but `Alert.alert` does nothing here.
- **Android** or **iOS** tab: a real emulator in your browser. It can take a minute to start and you may be placed in a queue.
- **My Device**: install the Expo Go app on your phone, then scan the QR code.

Questions 1 and 3 use `Alert.alert`, so check them on the Android or iOS tab or on your phone.

**🇰🇷 한글 해설**

Web 탭은 빠르지만 `Alert.alert`가 안 돼요. Q1, Q3는 Android/iOS 탭이나 Expo Go 폰으로 확인하세요.

### 🧪 Submission

- Submit **one** Snack link to the `Lab 2` assessment in Blackboard. After you save, the link looks like `https://snack.expo.dev/@yourname/web530-lab-2-...`.
- The lab is due Monday at 11:59 PM. You have the weekend to complete it.
- Only students who participated in the week 2 Tuesday/Wednesday class, and handed in a lab slip can receive marks for this lab. If you did not, you are still encouraged to complete it as preparation for your first test, even though no marks will be awarded.
- All questions go in the same Snack. Write every component in `App.js`.
- `MyApp` must render the answer to each question in order, under a `Text` heading, like this:

```jsx
export default function MyApp() {
  return (
    <ScrollView style={{ marginTop: 60 }}>
      <Text>Question 1</Text>
      <ReminderButton />
      <ReminderButton task="Submit Lab 2" minutes={30} />

      <Text>Question 2</Text>
      <NameTag />

      {/* and so on */}
    </ScrollView>
  );
}
```

▶ 웹 React 코드예요. [교수님 CodeSandbox 템플릿](https://codesandbox.io/p/sandbox/react-basic-3rqll4)에 붙여넣어 실행하세요.

- Before submitting, save one last time and open your link in a private browser window to confirm it loads without signing in.

**🇰🇷 한글 해설**

Snack 링크 하나 제출, 모든 컴포넌트는 App.js에, MyApp에서 `<Text>Question N</Text>` 제목과 함께 순서대로.

### 🧪 Question 1 - Events and Props (1 point)

Create a component called `ReminderButton` that renders a `Button`. It accepts two props with default values:

- `task` (string), default `"Drink water"`
- `minutes` (number), default `10`

When pressed, the button shows an alert with the title `Reminder` and the message `TASK in MINUTES minutes`, for example `Drink water in 10 minutes`.

Requirements:

- The button's `title` must be the value of `task`.
- Write the press handler as a named function inside the component (for example `handlePress`), not inline in the JSX.
- Render `ReminderButton` twice in `MyApp`: once with no props, and once with both props set to values of your choice.

Hint: `Alert.alert("Title", "Message")` takes the title first. Import `Alert` from `react-native`.

**🇰🇷 한글 해설**

**연결 예제**: 2.1 Passing Props.
- 기본값: `{ task = "Drink water", minutes = 10 }`
- 핸들러는 **이름 있는 함수**로 (`function handlePress() {...}`), 인라인 X.
- `Alert.alert("Reminder", `${task} in ${minutes} minutes`)` 처럼 **제목이 먼저**, 메시지가 두 번째.
- 버튼 title은 task.

### 🧪 Question 2 - Text Input and State (1 point)

Create a component called `NameTag` that renders a `TextInput` and a `Text`.

- The `TextInput` has the placeholder `Type your name`.
- The `Text` below it reads `Hello, NAME` and updates on every keystroke.
- When the input is empty, the `Text` reads `Hello, stranger`.

Requirements:

- Store the typed value in state with `useState`.
- The `TextInput` must be controlled: pass the state to `value` and update it with `onChangeText`.

Hint: `onChangeText` gives you the new string directly, so `onChangeText={setName}` works. There is no event object to dig through.

**🇰🇷 한글 해설**

**연결 예제**: 코스노트 Hooks의 TextInput 예제(controlled input).
- `const [name, setName] = useState("");`
- `<TextInput placeholder="Type your name" value={name} onChangeText={setName} />`
- 빈 문자열일 때 "stranger": `name || "stranger"` 또는 삼항 연산자. 빈 문자열 `""`은 falsy라서 `||`가 잘 동작해요.

### 🧪 Question 3 - Toggling State and Conditional Rendering (1 point)

Create a component called `NotificationSettings` with three parts:

- A `Text` that reads `Notifications are on` or `Notifications are off`. Notifications are off when the app starts.
- A `Button` that toggles notifications. Its title reads `Turn notifications on` when they are off, and `Turn notifications off` when they are on.
- A `Button` titled `Send test notification` that is **disabled** while notifications are off. When pressed, it shows an alert saying `Test notification sent`.

Requirements:

- One `useState` holds the on/off value as a boolean.
- The toggle button flips the boolean. Use the function form: `setEnabled((prev) => !prev)`.
- The send button uses the `disabled` prop. Do not hide the button; it must stay visible and greyed out.

Hint: A ternary inside JSX chooses between two strings: `{enabled ? "on" : "off"}`. The same trick works inside the `title` prop.

**🇰🇷 한글 해설**

**연결 개념**: boolean state + 함수형 토글 `setEnabled((prev) => !prev)` + 삼항 연산자.
- 문장: `Notifications are {enabled ? "on" : "off"}`
- 토글 버튼 title도 삼항으로: on이면 "Turn notifications off".
- 보내기 버튼은 **숨기지 말고** `disabled={!enabled}`. 문제에서 "Do not hide the button" 이라고 강조했어요. `{enabled && <Button .../>}` 로 숨기면 감점!

### 🧪 Question 4 - Lifting State Up (1 point)

Build a basketball scoreboard from two components.

`ScoreButton` is a child component with three props:

- `label` (string) - the button title
- `points` (number) - how much to add to the score, can be negative
- `onScore` (function) - called with `points` when the button is pressed

`Scoreboard` is the parent. It owns the score in state and renders:

- A `Text` that reads `Score: N`
- Three `ScoreButton`s: `Three pointer` (+3), `Free throw` (+1), and `Technical foul` (-2)
- A `Button` titled `New game` that sets the score back to 0

Requirements:

- `ScoreButton` must **not** have any state of its own. It only reports the press to the parent.
- When adding points, update state with the function form: `setScore((prev) => prev + points)`.
- Render `<Scoreboard />` in `MyApp`.

**🇰🇷 한글 해설**

**연결 예제**: 2.2 Lifting State Up.
- `ScoreButton({ label, points, onScore })`: state 없음. `onPress={() => onScore(points)}` 로 **부모에게 points를 전달**.
- `Scoreboard`: `const [score, setScore] = useState(0);` 그리고 `onScore={(p) => setScore((prev) => prev + p)}`.
- `points`가 음수(-2)여도 더하기로 처리돼요.
- New game: `setScore(0)` (이전 값과 무관하니 값 그대로 넣어도 OK).

### 🧪 Question 5 - useEffect and Cleanup (1 point)

Create a component called `Stopwatch` that counts seconds.

- A `Text` reads `Elapsed: N seconds`.
- A `Button` toggles between `Start` and `Stop`. Its title changes to match what it will do next.
- A `Button` titled `Reset` sets the seconds back to 0. It must work whether the stopwatch is running or stopped.

Requirements:

- Two pieces of state: the elapsed seconds and whether the stopwatch is running.
- Use `useEffect` with `[running]` as its dependency array.
- Inside the effect, if the stopwatch is not running, do nothing. If it is running, start a `setInterval` that adds one second every 1000 ms, and return a cleanup function that calls `clearInterval`.
- Add `console.log("Stopwatch cleanup")` inside the cleanup function. Press Start, then Stop, and confirm the message appears in the console.
- Inside the interval, update the seconds with the function form `setSeconds((prev) => prev + 1)`. Add a comment above that line explaining, in your own words, why `setSeconds(seconds + 1)` would not work here.

Hint: `setInterval` returns an id. Keep it in a `const` and pass it to `clearInterval` in the cleanup.

**🇰🇷 한글 해설**

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

### 🧪 Question 6 - Shared State Without Props (1 point)

Build a tiny shopping cart where the count is shared between components that are **not** parent and child.

- `CartBadge` renders a `Text` that reads `Cart: N items`.
- `AddToCartButton` accepts an `item` prop (string) and renders a `Button` titled `Add ITEM`. Pressing it adds 1 to the cart count.
- In `MyApp`, render one `CartBadge` followed by two `AddToCartButton`s with different `item` values, for example `Coffee` and `Bagel`. The badge must update when either button is pressed.

Requirements:

- `MyApp` must **not** hold the cart count in state, and no cart count or handler may be passed as a prop. `CartBadge` and `AddToCartButton` read and update the shared value themselves.
- Use **one** of the two approaches from class:
  - **React Context**: create a context with `createContext`, write a `CartProvider` component that owns the state, wrap the `ScrollView` in `MyApp` with it, and read the value with `useContext` in both components.
  - **Jotai**: create one `atom` for the count and use `useAtom` in both components. When you import from `jotai`, Snack offers to add it to `package.json`. Accept that. If it does not, add `"jotai": "*"` to the `dependencies` in `package.json` yourself.
- Add a comment above `CartBadge` naming which approach you used and one sentence on why you picked it.

You only need one approach for marks, but it is recommended that you code this question both ways as preparation for your test. Both techniques are testable. If you do both, keep your submitted `App.js` to one approach and put the other version in a comment block or a second file in the Snack.

**🇰🇷 한글 해설**

**연결 예제**: 2.2 Using Context for State / Using Jotai.
- 조건: MyApp에 state 금지, props로 count/handler 전달 금지.
- Jotai가 더 짧아요: `const cartAtom = atom(0);` 그리고 두 컴포넌트에서 `useAtom(cartAtom)`.
- Context로 하면: `CartContext`, `CartProvider`(state 주인), MyApp에서 ScrollView를 Provider로 감싸기.
- 원문: "Both techniques are testable." **시험에 둘 다 나올 수 있어요.** 두 방법 모두 써 보세요.


---

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

▶ **[Snack에서 바로 실행하기](https://snack.expo.dev/?name=WEB530%20W2%20practice&platform=web&sdkVersion=54.0.0&code=import%20%7B%20useState%2C%20useEffect%20%7D%20from%20%22react%22%3B%0Aimport%20%7B%20View%2C%20Text%2C%20Button%20%7D%20from%20%22react-native%22%3B%0A%0Afunction%20LikeButton%28%7B%20amount%2C%20onLike%20%7D%29%20%7B%0A%20%20return%20%3CButton%20title%3D%7B%60%2B%24%7Bamount%7D%60%7D%20onPress%3D%7B%28%29%20%3D%3E%20onLike%28amount%29%7D%20%2F%3E%3B%0A%7D%0A%0Aexport%20default%20function%20App%28%29%20%7B%0A%20%20const%20%5Blikes%2C%20setLikes%5D%20%3D%20useState%280%29%3B%0A%20%20const%20%5Bauto%2C%20setAuto%5D%20%3D%20useState%28false%29%3B%0A%0A%20%20useEffect%28%28%29%20%3D%3E%20%7B%0A%20%20%20%20if%20%28%21auto%29%20return%3B%0A%20%20%20%20const%20id%20%3D%20setInterval%28%28%29%20%3D%3E%20%7B%0A%20%20%20%20%20%20setLikes%28%28prev%29%20%3D%3E%20prev%20%2B%201%29%3B%0A%20%20%20%20%7D%2C%203000%29%3B%0A%20%20%20%20return%20%28%29%20%3D%3E%20clearInterval%28id%29%3B%0A%20%20%7D%2C%20%5Bauto%5D%29%3B%0A%0A%20%20const%20handleLike%20%3D%20%28amount%29%20%3D%3E%20setLikes%28%28prev%29%20%3D%3E%20prev%20%2B%20amount%29%3B%0A%0A%20%20return%20%28%0A%20%20%20%20%3CView%20style%3D%7B%7B%20marginTop%3A%20100%20%7D%7D%3E%0A%20%20%20%20%20%20%3CText%3ELikes%3A%20%7Blikes%7D%3C%2FText%3E%0A%20%20%20%20%20%20%3CLikeButton%20amount%3D%7B1%7D%20onLike%3D%7BhandleLike%7D%20%2F%3E%0A%20%20%20%20%20%20%3CLikeButton%20amount%3D%7B5%7D%20onLike%3D%7BhandleLike%7D%20%2F%3E%0A%20%20%20%20%20%20%3CButton%0A%20%20%20%20%20%20%20%20title%3D%7Bauto%20%3F%20%22Stop%20auto%20like%22%20%3A%20%22Start%20auto%20like%22%7D%0A%20%20%20%20%20%20%20%20onPress%3D%7B%28%29%20%3D%3E%20setAuto%28%28prev%29%20%3D%3E%20%21prev%29%7D%0A%20%20%20%20%20%20%2F%3E%0A%20%20%20%20%3C%2FView%3E%0A%20%20%29%3B%0A%7D%0A)** (SDK 54, 필요한 패키지 자동 포함) <button class="snack-embed" type="button">👀 여기서 결과 보기</button>

**해설**: `likes`는 부모(App)가 갖고, `LikeButton`은 몇 개 더할지(`amount`)만 부모에게 알려요(lifting state up). 자동 모드는 `[auto]`에 의존하는 effect라서 auto가 바뀔 때마다 이전 interval을 cleanup으로 끄고 새로 판단해요.
