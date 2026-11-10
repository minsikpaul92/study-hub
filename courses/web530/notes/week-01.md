# Week 1. React 기초: 컴포넌트, JSX, Props, PropTypes

> 이 노트 읽는 법
> - **📘 원문**: 강의자료 영어 원문 그대로입니다. 요약하지 않았어요. 시험 문제는 이 원문 표현으로 나오니까 영어 문장도 꼭 눈으로 한 번 읽어 두세요.
> - **🇰🇷 한글 해설**: 원문 바로 밑에 고등학생 눈높이로 풀어 쓴 설명입니다.
> - **▶ Snack에서 바로 실행하기**: 누르면 그 코드가 들어간 Expo Snack이 열립니다. 오른쪽 미리보기에서 결과를 보고, 코드를 직접 바꿔 보세요.
> - **💻 인클래스 예제**: 교수님이 수업 중에 라이브 코딩한 순서 그대로입니다. 단계별로 코드가 어떻게 바뀌는지 따라가 보세요.

> 🧭 **챕터 읽는 순서**: 챕터마다 맨 앞의 **🧭 먼저 한국어로** 상자(구성과 할 일) → 원문 출처 → 영어 원문 → ▶ Snack → 🇰🇷 한글 해설이에요. 코드 위에 **⌨️**가 있으면 직접 쳐 볼 코드이고, 없으면 읽기만 하거나 **👀 여기서 결과 보기**로 결과만 확인하면 돼요.

## 0. 이번 주 한눈에 보기

이번 주는 "앱 화면을 레고 블록처럼 조립하는 법"을 배우는 주예요.

| 키워드 | 한 줄 설명 | 비유 |
| --- | --- | --- |
| Component (컴포넌트) | 화면 조각을 만들어 주는 **함수** | 레고 블록 한 개 |
| JSX | JavaScript 안에 HTML처럼 생긴 태그를 쓰는 문법 | 블록 설계도 |
| Props | 부모가 자식 컴포넌트에게 넘겨주는 값 | 블록에 붙이는 이름표 |
| `{ }` | JSX 안에서 JavaScript 값을 쓰는 창문 | "여기는 계산해서 넣어 줘" 표시 |
| PropTypes | "이 컴포넌트는 이런 props를 받아요" 라는 약속(계약)을 검사 | 택배 상자에 붙은 "취급주의 / 내용물 목록" |
| React Native 컴포넌트 | `<div>` 대신 `<View>`, `<p>` 대신 `<Text>` | 웹 레고 대신 모바일 전용 레고 |

시험에서 자주 나오는 함정 5개를 먼저 알려 줄게요.
1. JSX는 **부모 태그 하나**로 감싸야 한다. (`<>...</>` Fragment 가능)
2. 직접 만든 컴포넌트 이름은 **대문자로 시작**해야 한다. (`myButton` X, `MyButton` O)
3. React Native에서 글자는 반드시 `<Text>` 안에. `<View>안녕</View>` 하면 앱이 터진다.
4. `<Button>`의 글자는 자식이 아니라 `title` prop으로 준다.
5. PropTypes는 **경고만** 한다. 화면은 그대로 그려진다. 그리고 React 19부터는 아예 무시된다.


**⌨️ 직접 쳐 볼 것 (이 순서대로)**

어디 칸을 누르면 그 코드로 바로 가요. 코드 위에도 ⌨️ 표시가 있어요.

| # | 어디 | 무엇을 |
| --- | --- | --- |
| 1 | [Example: Simple Components](#practice-1) | MyButton 컴포넌트를 만들고 MyApp 안에서 <MyButton />으로 쓰기 |
| 2 | [Example: Multiple Tags](#practice-2) | h1과 MyButton을 div(또는 Fragment <>)로 감싸서 함께 return |
| 3 | [Example: JS-Expressions](#practice-3) | 변수를 만들고 { }로 버튼 글자와 disabled 속성에 넣기 |
| 4 | [Example: Passing props](#practice-4) | MyButton에 buttonText, isEnabled props를 넘기고 구조분해와 기본값으로 받기 |
| 5 | [Example: PropTypes and Validation](#practice-5) | MyButton에 PropTypes(string, bool, isRequired)를 붙이고 잘못된 값을 넘겨 콘솔 경고 확인 |
| 6 | [Example: Introduce React Native Components (not HTML)](#practice-6) | 1.1의 div, h1, button을 View, Text, Button으로 바꿔서 Snack에서 실행 |

나머지 👀 표시는 읽고 이해만 하면 돼요. 같은 개념을 위 예제에서 이미 타이핑해요.



## 목차

- 1. 📘 코스노트: Introduction to React
- 2. 📘 코스노트: Introduction to React Native
- 3. 📘 코스노트: Functional Components
- 4. 📘 코스노트: Validating Props
- 5. 💻 인클래스 예제: Week 1.1 - Notes and Examples
- 6. 💻 인클래스 예제: Week 1.2 - Notes and Examples
- 7. 🧪 Lab: Lab 1 - Components and Props
- ✅ Week 1 시험 대비 체크리스트


---

## 1. 📘 코스노트: Introduction to React

<div class="sum" data-kind="read">

**🧭 먼저 한국어로** · 👀 읽고 이해하기 (타이핑 안 해도 돼요)

React가 무엇이고 왜 컴포넌트로 화면을 나누는지 소개하는 글이에요. 아래 💻 1.1 예제에서 직접 쳐 보니까 여기서는 읽고 개념만 잡으면 돼요.

**이 챕터 구성**

- 👀 **What is React**: React가 뭐냐? 화면(UI, User Interface)을 만드는 JavaScript 라이브러리예요.
- 👀 **React components**: JSX는 처음 그릴 때는 그냥 "HTML 비슷한 글자"예요.
- 👀 **React components › JavaScript XML (JSX)**: JSX = JavaScript + XML(HTML 비슷한 태그).
- 👀 **React components › Writing components using JSX**: 컴포넌트 = JSX를 return 하는 함수. 이게 전부예요.
- 👀 **React components › Using JavaScript expressions**: JSX 안에서 중괄호 `{ }` 는 "여기는 JavaScript야" 라는 표시예요.

</div>

> 원문 출처: https://seneca-ictoer.github.io/WEB530/A-Introduction/intro-react

### 📘 What is React

If you visit the [reactjs.org](https://reactjs.org/) website, you will learn that *React is a JavaScript library for building user interfaces*. Released by [Facebook](https://www.facebook.com/) in 2013, React is used by companies big and small to develop user interfaces (UIs) for web, mobile and desktop applications. React is often compared to [Angular](https://angular.io/) but there are alot of differences between the two.

* Based on the Model-View-Controller (MVC) pattern, Angular is a front-end framework for building web applications. React, on the other hand, is for creating user interfaces (the "View" part of the MVC pattern).
* Angular works on the web page's DOM, updating the entire page when a change is made to the data driving our view. React implements a virtual DOM allowing for quicker updates since only the relevant portions are updated.
* Angular offers one-way and two-way binding but React only uses one-way. Since data only flows in one direction, React apps can be easier to debug.

In this course, we will learn how to use React (and React Native) to produce cross-platform applications.

**React is component-based.**

Components are reusable pieces of code used to render HTML markup (what the user sees) to the browser DOM (the render target). Components are similar to views in Handlebars but they can manage their own state.

**React is declarative.**

React components mix *HTML* markup and JavaScript together using a syntax called JavaScript XML (or simply JSX). When developing React components, there is no need to execute steps using imperative approaches. Instead, programmers can easily build interactive user interfaces (UI) by describing what they should look like. In other words, programmers will decide what HTML elements each component will render, not how they will be rendered.

💡 **Declarative syntax**
A way of describing the code you want to write, without having to worry about how it's going to be implemented. In other words, you are specifying what needs to be done.

💡 **Imperative syntax**
You supply a set of instructions to follow and the computer does what you want. In other words, you are defining how a task should be performed.

**🇰🇷 한글 해설**

**React가 뭐냐?** 화면(UI, User Interface)을 만드는 JavaScript **라이브러리**예요. 2013년 Facebook(지금의 Meta)이 만들었어요.

Angular와 비교하는 부분이 나오는데, 시험용으로 딱 3개만 기억하세요.
- Angular는 MVC 전체를 다 하는 **프레임워크**, React는 그중 **View(보이는 부분)만** 담당하는 라이브러리.
- Angular는 진짜 DOM을 다루고, React는 **Virtual DOM(가상 DOM)** 을 써서 바뀐 부분만 빠르게 고친다.
- React는 데이터가 **한 방향(one-way)** 으로만 흐른다. 부모에서 자식으로. 그래서 버그 찾기가 쉽다.

**React is component-based (컴포넌트 기반)**: 화면을 작은 조각(컴포넌트)으로 나눠서 만들고, 그 조각을 재사용해요. 원문에 Handlebars 이야기가 나오는데, 예전에 배운 템플릿 엔진(WEB322 등)이랑 비슷하지만 React 컴포넌트는 **자기 상태(state)를 스스로 관리**할 수 있다는 점이 다르다는 뜻이에요.

**React is declarative (선언형)**: 여기가 개념 문제로 잘 나와요.
- **선언형(Declarative)**: "무엇(what)을 보여 줄지"만 말한다. 예: "버튼 하나랑 제목 하나 보여 줘."
- **명령형(Imperative)**: "어떻게(how) 할지" 순서를 하나하나 지시한다. 예: "div를 찾아라, 그 안에 버튼을 만들어라, 글자를 넣어라..."

식당에 비유하면, 선언형은 "김치찌개 주세요"라고 주문하는 것, 명령형은 주방에 들어가서 "물 500ml 넣고, 김치 넣고, 10분 끓이고..." 하고 직접 지시하는 거예요. React는 주문만 하면 요리(화면 갱신)는 React가 알아서 해 줘요.

### 📘 React components

In React, we will build our UI using JSX. JSX is just static text that represents the resulting HTML. On the initial render, React components and their JSX are no different than other template libraries. For example, Handlebars will render a template to HTML and a React component will do the same. However, React becomes much more interesting when data is changed. When using Handlebars, if the data changes we need to render the view again. With React, changes to the page are made automatically.

When data changes, refreshing a Handlebars view will take time but with React things update much more efficiently thanks to the virtual DOM. Reacts virtual DOM keeps a tally of the *real* DOM elements in memory and as data changes, it compares the new content with the already displayed content. Using diffing and patching, the virtual DOM can execute the imperative steps needed to update the HTML.

*Remember, we are going to declare our components using declarative code and not worry about how to refresh the page. React will figure out exactly how the UI should be rendered or updated.*

💡 **Diffing**
Comparing old content with new content to figure out what's changed.

💡 **Patching**
Executing the necessary DOM operations to render the new content.

**🇰🇷 한글 해설**

JSX는 처음 그릴 때는 그냥 "HTML 비슷한 글자"예요. React가 진짜 빛나는 건 **데이터가 바뀔 때**예요.

- Handlebars 같은 템플릿: 데이터가 바뀌면 화면 전체를 다시 그려야 함.
- React: **Virtual DOM**이 메모리에 화면의 복사본을 들고 있다가, 새 화면과 비교해서 **바뀐 부분만** 고침.

두 단어를 꼭 외우세요.
- **Diffing**: 옛날 화면과 새 화면을 비교해서 "뭐가 바뀌었는지" 찾는 것. (틀린 그림 찾기)
- **Patching**: 찾은 차이만 실제 화면에 반영하는 것. (틀린 부분만 지우개로 지우고 다시 그리기)

#### 📘 JavaScript XML (JSX)

Remember, we will build React components using JSX syntax. JSX allows us to mix HTML and JavaScript together. The code we write is extracted from the HTML and transpiled into JavaScript statements. Browsers have no idea what JSX is and they don't need to since they only see the pure JavaScript after it is transpiled.

💡 **Transpiler**
A [source-to-source compiler](https://en.wikipedia.org/wiki/Source-to-source_compiler) which takes the source code of a program written in some programming language and converts it into another programming language.

Let's take a look at a simple "hello world" example. This is a React app, not a React Native app so the target is a web browser. As you study the example, you will notice a few things:

* The first few lines of the program will create a React DOM element from an HTML element in the browsers DOM.
* The last few lines build our UI, returning HTML to be rendered in the browser.
* The application combines JavaScript and XML. Since this is a React app the render target is the browser and so JSX has support for HTML tags. In other words, React already has components built-in for the common HTML elements that you use on a daily basis.

💡 Want to try the examples yourself? Open [this CodeSandbox template](https://codesandbox.io/p/sandbox/react-basic-3rqll4) and start coding.

**index.html**

```jsx
<div id="root"></div>
```

▶ 웹 React 코드예요. [교수님 CodeSandbox 템플릿](https://codesandbox.io/p/sandbox/react-basic-3rqll4)에 붙여넣어 실행하세요.

**index.js**

```jsx
import React from 'react';
import { createRoot } from 'react-dom/client';

const rootElement = document.getElementById('root');
const root = createRoot(rootElement);

root.render(
  <p>
    Hello, <strong>JSX</strong>!
  </p>
);
```

▶ 웹 React 코드예요. [교수님 CodeSandbox 템플릿](https://codesandbox.io/p/sandbox/react-basic-3rqll4)에 붙여넣어 실행하세요.

If you need to render multiple tags, they must be nested within a single tag. This is because React needs a root component to render. For example, you can't render adjacent elements like `<p><p><p>`. Look at the next code example and you will notice that the `<p>` and `<button>` have been placed into a single `<div>`.

Tag names are case-sensitive. When writing HTML, as is done in the code example below, specify the tag names using only lowercase characters. When specifying non-html elements, start the tag with a capital letter. This convention makes it easier to scan the markup and spot the built-in HTML elements.

We can also pass HTML elements any of their standard properties. In the code example, we are passing the "foo" property. Since this is not a standard property, a warning may be logged but the HTML will still render.

```jsx
// React needs a root element to render.
// Notice the tag names use lowercase letters.
// Also notice the property "foo" added to the button.
import React from 'react';
import { createRoot } from 'react-dom/client';

const root = createRoot(document.getElementById('root'));

root.render(
  <div>
    <p>JSX is fun</p>
    <button foo="bar">Click Me</button>
  </div>
);
```

▶ 웹 React 코드예요. [교수님 CodeSandbox 템플릿](https://codesandbox.io/p/sandbox/react-basic-3rqll4)에 붙여넣어 실행하세요.

JSX is a great way to describe even complex UI structures.

```jsx
// Render a much more complex UI
import React from 'react';
import { createRoot } from 'react-dom/client';

const root = createRoot(document.getElementById('root'));

root.render(
  <section>
    <header>
      <h1>JSX</h1>
    </header>

    <nav>
      <a href="item">Link 1</a>
      <br />
      <a href="item">Link 2</a>
    </nav>

    <main>
      <p>This is a much more complex UI.</p>
    </main>

    <footer>
      <small>&copy; SDSS</small>
    </footer>
  </section>
);
```

▶ 웹 React 코드예요. [교수님 CodeSandbox 템플릿](https://codesandbox.io/p/sandbox/react-basic-3rqll4)에 붙여넣어 실행하세요.

**🇰🇷 한글 해설**

**JSX = JavaScript + XML(HTML 비슷한 태그)**. 브라우저는 JSX를 못 읽어요. 그래서 **Transpiler(트랜스파일러, 예: Babel)** 가 JSX를 순수 JavaScript로 바꿔 줘요. Transpiler는 "한 프로그래밍 언어를 다른 언어로 번역하는 컴파일러"예요.

예제에서 기억할 규칙:
1. `createRoot(document.getElementById('root'))` 로 HTML의 `<div id="root">`를 React가 그림 그릴 도화지로 잡는다. 그리고 `root.render(...)` 로 그린다. (이건 웹 React 이야기. React Native에서는 `export default function App()` 이 그 역할을 해요.)
2. **여러 태그를 나란히 반환할 수 없다.** 꼭 `<div>` 같은 부모 하나로 감싸야 한다. 이유: React는 "뿌리(root)가 하나인 나무"만 그릴 수 있어서.
3. **태그 이름은 대소문자를 구분**한다. HTML 태그는 소문자(`div`, `p`), 내가 만든 컴포넌트는 대문자 시작(`MyButton`).
4. `foo="bar"` 처럼 이상한 속성을 넣으면 경고는 뜰 수 있지만 그래도 화면은 그려진다.

#### 📘 Writing components using JSX

Components are the fundamental building blocks of React.

```jsx
import React from 'react';
import { createRoot } from 'react-dom/client';

// "MyComponent" is simply a function that returns some JSX,
// which defines the elements of our UI
function MyComponent() {
  return (
    <div>
      <h1>My First Component</h1>
      <p>A component is the fundamental building block of React.</p>
    </div>
  );
}

const root = createRoot(document.getElementById('root'));

// Render the component
root.render(<MyComponent />);
```

▶ 웹 React 코드예요. [교수님 CodeSandbox 템플릿](https://codesandbox.io/p/sandbox/react-basic-3rqll4)에 붙여넣어 실행하세요.

In the above example, we are defining a component called `MyComponent`, which is literally just a function of that name. In line 18 we are rendering our custom tag. React replaces that tag with the JSX returned by `MyComponent`.

Using JSX markup is not only useful for building reusable components but also for describing UI structures that have parent-child relationships. As an example, a `<li>` tag is useful as a child of a `<ul>`. To make this work, we can build our own components specifying the `children` property.

```jsx
import React from 'react';
import { createRoot } from 'react-dom/client';

// Renders a <div> element containing a heading, paragraph and unordered list.
// The list is populated using {props.children}.
function ParentComponent(props) {
  return (
    <div>
      <h1>Parent Component</h1>
      <p>This component encapsulates a ul element containing the children</p>
      <ul>{props.children}</ul>
    </div>
  );
}

// Renders a <li> element. The text for the list item is populated using {props.children}
function ChildComponent(props) {
  return <li>{props.children}</li>;
}

const root = createRoot(document.getElementById('root'));

// Render the nested UI structure
root.render(
  <ParentComponent>
    <ChildComponent>First child</ChildComponent>
    <ChildComponent>Second child</ChildComponent>
  </ParentComponent>
);
```

▶ 웹 React 코드예요. [교수님 CodeSandbox 템플릿](https://codesandbox.io/p/sandbox/react-basic-3rqll4)에 붙여넣어 실행하세요.

In the parent-child example, we are defining two React components. If you look at the JSX for the final render, you will notice that `<ChildComponent>` is a child of`<ParentComponent>`. You will also notice that `<ChildComponent>` accepts text as its child instead of additional JSX elements. In both components,`{props.children}` acts as a placeholder for the content.

So, text is passed into the `<ChildComponent>` and multiple `<ChildComponent>` tags are passed into the `<ParentComponent>` yet the rendered output includes the `<div>`, `<h1>`, `<p>`, `<ul>`, and three `<li>` tags. The browser shows something like this:

**🇰🇷 한글 해설**

**컴포넌트 = JSX를 return 하는 함수.** 이게 전부예요.

```jsx
function MyComponent() {   // 대문자로 시작하는 함수
  return <h1>Hi</h1>;      // JSX를 돌려준다
}
<MyComponent />            // 태그처럼 쓴다
```

`props.children` 이 처음 나오는데 아주 중요해요. 태그 **사이에 들어간 내용물**이 `children`이라는 이름으로 자식 컴포넌트에 전달돼요.

```jsx
<ChildComponent>First child</ChildComponent>
//              ^^^^^^^^^^^ 이 글자가 props.children
```

택배 상자로 비유하면 `<ParentComponent>` 는 상자이고, 그 사이에 넣은 `<ChildComponent>` 들이 내용물(children)이에요. 상자(Parent)는 `{props.children}` 자리에 내용물을 꺼내 놓아요.

참고로 원문 마지막 줄 "The browser shows something like this:" 뒤에는 원래 실행 결과 그림이 있었어요. 결과는 제목 "Parent Component", 문장 하나, 그리고 점(•)으로 된 목록 2줄(First child, Second child)이에요. (원문에는 "three `<li>` tags"라고 적혀 있지만 실제 코드에는 ChildComponent가 2개라서 `<li>`도 2개예요.)

#### 📘 Using JavaScript expressions

The following examples shows how easy it is to mix JavaScript and HTML to build JSX. You will notice that JavaScript variables can be passed in to components. Any valid JavaScript expression can be placed between the `{ }`.

```jsx
import React from 'react';
import { createRoot } from 'react-dom/client';

const enabled = false;
const value = 'Test';
const buttonText = 'GO';

const root = createRoot(document.getElementById('root'));

root.render(
  <div>
    <input type="text" value={value} />
    <button disabled={!enabled}>{buttonText}</button>
  </div>
);
```

▶ 웹 React 코드예요. [교수님 CodeSandbox 템플릿](https://codesandbox.io/p/sandbox/react-basic-3rqll4)에 붙여넣어 실행하세요.

Even arrays can be used to build a dynamic UI:

```jsx
import React from 'react';
import { createRoot } from 'react-dom/client';

const optionArray = [
  { id: 1, name: 'First' },
  { id: 2, name: 'Second' },
  { id: 3, name: 'Third' },
];

const root = createRoot(document.getElementById('root'));

root.render(
  <div>
    <h1>Array</h1>

    {/* Maps "array" to an array of "<option>"s.
        Note the "key" property on "<option>".
        This is necessary for performance reasons,
        and React will warn us if it's missing. */}
    <select size="3">
      {optionArray.map((item) => (
        <option key={item.id} value={item.id}>
          {item.name}
        </option>
      ))}
    </select>
  </div>
);
```

▶ 웹 React 코드예요. [교수님 CodeSandbox 템플릿](https://codesandbox.io/p/sandbox/react-basic-3rqll4)에 붙여넣어 실행하세요.

**🇰🇷 한글 해설**

JSX 안에서 **중괄호 `{ }` 는 "여기는 JavaScript야"** 라는 표시예요. 그 안에는 **값이 나오는 식(expression)** 이면 뭐든 들어가요. 변수, 계산식, 삼항연산자, 함수 호출 등. 단, `if`문이나 `for`문 같은 **문장(statement)** 은 못 들어가요.

- `disabled={!enabled}`: enabled가 false니까 `!enabled`는 true, 그래서 버튼이 비활성화.
- 배열을 화면에 그릴 때는 **`.map()`** 을 써요. 배열의 각 항목을 JSX로 "변신"시키는 거예요.
- `.map()`으로 만든 항목에는 반드시 **`key`** 를 줘야 해요. key는 React가 "누가 누군지" 구분하는 학생증 번호 같은 거예요. 없으면 경고가 떠요. 보통 `id`를 key로 써요.


---

## 2. 📘 코스노트: Introduction to React Native

<div class="sum" data-kind="read">

**🧭 먼저 한국어로** · 👀 읽고 이해하기 (타이핑 안 해도 돼요)

React Native가 웹 React와 무엇이 다른지 설명해요. HTML 태그 대신 View, Text 같은 네이티브 컴포넌트를 쓴다는 게 핵심이에요. 읽고 이해만 하면 돼요.

</div>

> 원문 출처: https://seneca-ictoer.github.io/WEB530/A-Introduction/intro-react-native

On Android, developers build Java apps while on iOS developers implement Swift apps. As a mobile app developer, you will have to learn both languages since picking only one platform is not realistic for success. As a React native developer, you only need to learn one language to target both platforms.

Earlier, we learned that the render target of React is the web browser. React Native on the other hand communicates with the underlying mobile OS to render native controls that behave and look as the OS user would expect. The good news is, the API we use to build React Native mobile apps is almost identical to that of React for the web. A main difference between the two flavours is the fact that React Native ships with components to be used on mobile platforms rather than with HTML elements.

You may be wondering if you can work around mobile apps all-together. In reality, this may be possible, at least at the early stages. But eventually you may find that mobile browsers lack many capabilities needed by your mobile apps. Here are a few things to consider:

* Many of the native controls built-in to mobile devices cannot be replicated by web browsers. For example, the date picker control. It usually looks very different in a web browser than as a native control on your mobile device.
* Many web apps assume the presence of a mouse but mobile devices are almost always interacted using a finger on a touch screen. Mobile platforms have a gesture system to deal with this type of interaction.
* Consistency and familiarity are important for a good user experience. Your app needs to look and behave as if it is part of the device.
* Since React Native uses actual components from the platform, it can easily deal with updates to the underlying OS. As controls are updated and improved, these updates are automatically rolled into your native app.

It is important to mention that although iOS and Android have several areas of overlap, it may not be feasible to write a single codebase shared entirely on both OS. You will want to take advantage of iOS-specific controls and Android specific controls to give your users the experience they expect. Concentrate on providing users the best experience possible rather than building a completely portable application.

💡 Want to try the examples yourself? Open [Snack](https://snack.expo.dev/) and start coding React Native applications in your browser.

**🇰🇷 한글 해설**

**React Native는 뭐가 다른가?**
- 원래 Android 앱은 Java(또는 Kotlin), iOS 앱은 Swift로 따로 만들어야 해요. 언어를 두 개 배워야 하죠.
- React Native를 쓰면 **JavaScript 하나로 두 플랫폼 앱을 다** 만들 수 있어요.
- React(웹)는 브라우저에 HTML을 그리고, React Native는 **휴대폰 OS의 진짜 네이티브 부품(native controls)** 을 그려요. 그래서 앱이 그 폰에 원래 있던 앱처럼 보이고 움직여요.
- 문법(API)은 React와 **거의 똑같아요.** 차이는 HTML 태그 대신 모바일용 컴포넌트(`View`, `Text` 등)를 쓴다는 것.

"그냥 모바일 웹사이트로 만들면 안 돼?"에 대한 답 4가지 (개념 문제 후보):
1. 날짜 선택기(date picker) 같은 **네이티브 컨트롤**은 브라우저가 똑같이 못 따라 한다.
2. 웹은 **마우스**를 가정하지만, 폰은 **손가락 터치와 제스처**를 쓴다.
3. 사용자는 **익숙하고 일관된** 경험을 원한다. 앱이 그 기기의 일부처럼 느껴져야 한다.
4. OS가 업데이트되면 네이티브 부품도 같이 좋아진다. React Native 앱은 그걸 **자동으로** 받는다.

마지막 문단도 중요해요. iOS와 Android 코드를 100% 똑같이 쓰는 게 목표가 아니에요. **각 플랫폼 사용자가 기대하는 최고의 경험**을 주는 게 목표예요. (그래서 3주차에 `Platform.OS` 를 배워요.)


---

## 3. 📘 코스노트: Functional Components

<div class="sum" data-kind="read">

**🧭 먼저 한국어로** · 👀 읽고 이해하기 (타이핑 안 해도 돼요)

함수 컴포넌트와 props를 정리한 글이에요. 💻 1.1 "Passing props"에서 직접 쳐 보니까 여기서는 읽기만 해요.

**이 챕터 구성**

- 👀 **Introduction**: Functional Component(함수형 컴포넌트) 는 함수로 만든 컴포넌트예요.
- 👀 **Functional components**: 여기서부터 React Native 코드예요. `View`(상자)와 `Text`(글자)를 `react-native`에서 import 해요.
- 👀 **Properties (`props`)**: Props = 부모가 자식에게 주는 값(속성).

</div>

> 원문 출처: https://seneca-ictoer.github.io/WEB530/B-Components/func-components

### 📘 Introduction

Functional Components are a simple and efficient way to create reusable UI elements in React and React Native. They use JavaScript functions instead of [classes](https://seneca-ictoer.github.io/WEB530/B-Components/class-components) (which used to be the standard way of writing React components), promoting a declarative coding style. Functional components can leverage React Hooks to manage state and lifecycle events. They offer simplicity, reusability, and composability, making development easier and more productive.

**🇰🇷 한글 해설**

**Functional Component(함수형 컴포넌트)** 는 함수로 만든 컴포넌트예요. 옛날에는 class로 만들었는데(옵션 읽을거리), 요즘은 함수형이 표준이에요. 이유: 짧고, 읽기 쉽고, **Hooks**(2주차)로 상태(state)와 생명주기(lifecycle)를 다룰 수 있어서요.

### 📘 Functional components

Functional components are a simplification of React's original version of [implementing classes](https://react.dev/reference/react/Component) that extend the `Component` class ([optional reading here](https://seneca-ictoer.github.io/WEB530/B-Components/class-components)). Functional components are usually easier to read and require less coding:

```jsx
import { View, Text } from 'react-native';

// MyComponent is written as a functional component.
function MyComponent() {
  return (
    <View>
      <Text>
        <Text>React Native</Text>
        {'\n'}
        <Text>This is a functional component. It is Stateless.</Text>
      </Text>
    </View>
  );
}

export default function App() {
  return <MyComponent />;
}
```

▶ **[Snack에서 바로 실행하기](https://snack.expo.dev/?name=WEB530%20W1%20Functional%20components&platform=web&sdkVersion=54.0.0&code=import%20%7B%20View%2C%20Text%20%7D%20from%20%27react-native%27%3B%0A%0A%2F%2F%20MyComponent%20is%20written%20as%20a%20functional%20component.%0Afunction%20MyComponent%28%29%20%7B%0A%20%20return%20%28%0A%20%20%20%20%3CView%3E%0A%20%20%20%20%20%20%3CText%3E%0A%20%20%20%20%20%20%20%20%3CText%3EReact%20Native%3C%2FText%3E%0A%20%20%20%20%20%20%20%20%7B%27%5Cn%27%7D%0A%20%20%20%20%20%20%20%20%3CText%3EThis%20is%20a%20functional%20component.%20It%20is%20Stateless.%3C%2FText%3E%0A%20%20%20%20%20%20%3C%2FText%3E%0A%20%20%20%20%3C%2FView%3E%0A%20%20%29%3B%0A%7D%0A%0Aexport%20default%20function%20App%28%29%20%7B%0A%20%20return%20%3CMyComponent%20%2F%3E%3B%0A%7D%0A)** (SDK 54, 필요한 패키지 자동 포함) <button class="snack-embed" type="button">👀 여기서 결과 보기</button>



In the example above, you can see that we have written `MyComponent` using a function. As you study the code example, you will notice that:

* `MyComponent()` function is a **pure function**. It affects nothing outside of its own scope, and always returns the same output given the same input.
* The function is written using JavaScript function syntax. It is also perfectly fine to declare the function using arrow function syntax:
  `const MyComponent = () => { … }`

**🇰🇷 한글 해설**

여기서부터 React Native 코드예요. `View`(상자)와 `Text`(글자)를 `react-native`에서 import 해요.

- **Pure function(순수 함수)**: 바깥 세상에 영향을 주지 않고, **같은 입력이면 항상 같은 출력**을 내는 함수. 자판기처럼 같은 버튼 누르면 항상 같은 음료가 나와요.
- `{'\n'}` 은 줄바꿈 문자예요. `Text` 안에 `Text`를 넣으면 웹의 `<span>`처럼 한 줄에 이어 붙는데, 줄을 바꾸고 싶어서 넣은 거예요.
- 함수는 `function MyComponent() {}` 로 써도 되고, 화살표 함수 `const MyComponent = () => {}` 로 써도 똑같아요.

### 📘 Properties (`props`)

Let's rewrite the component again, this time we will introduce properties. Our function will accept a new parameter `props` that will contain an object with each of the properties that were passed as attributes when the component was called:

```jsx
import { View, Text } from 'react-native';

function MyComponent(props) {
  return (
    <View>
      <Text>
        <Text>{props.heading}</Text>
        {'\n'}
        <Text>This is a functional component. It has {props.body}.</Text>
      </Text>
    </View>
  );
}

export default function App() {
  return <MyComponent heading="React Native" body="props" />;
}
```

▶ **[Snack에서 바로 실행하기](https://snack.expo.dev/?name=WEB530%20W1%20Properties%20%28%60props%60%29&platform=web&sdkVersion=54.0.0&code=import%20%7B%20View%2C%20Text%20%7D%20from%20%27react-native%27%3B%0A%0Afunction%20MyComponent%28props%29%20%7B%0A%20%20return%20%28%0A%20%20%20%20%3CView%3E%0A%20%20%20%20%20%20%3CText%3E%0A%20%20%20%20%20%20%20%20%3CText%3E%7Bprops.heading%7D%3C%2FText%3E%0A%20%20%20%20%20%20%20%20%7B%27%5Cn%27%7D%0A%20%20%20%20%20%20%20%20%3CText%3EThis%20is%20a%20functional%20component.%20It%20has%20%7Bprops.body%7D.%3C%2FText%3E%0A%20%20%20%20%20%20%3C%2FText%3E%0A%20%20%20%20%3C%2FView%3E%0A%20%20%29%3B%0A%7D%0A%0Aexport%20default%20function%20App%28%29%20%7B%0A%20%20return%20%3CMyComponent%20heading%3D%22React%20Native%22%20body%3D%22props%22%20%2F%3E%3B%0A%7D%0A)** (SDK 54, 필요한 패키지 자동 포함) <button class="snack-embed" type="button">👀 여기서 결과 보기</button>


React Native
This is a functional component. It has props.


[Default properties](https://react.dev/learn/passing-props-to-a-component#specifying-a-default-value-for-a-prop) can be added by destructuring the props object and adding default values using standard JavaScript syntax:

```jsx
import { View, Text } from 'react-native';

function MyComponent(props) {
  return (
    <View>
      <Text>
        <Text>{props.heading || 'React Native Default Props'}</Text>
        {'\n'}
        <Text>This is a functional component. It has {props.body || 'default props'}.</Text>
      </Text>
    </View>
  );
}

export default function App() {
  return <MyComponent heading="React Native" />;
}
```

▶ **[Snack에서 바로 실행하기](https://snack.expo.dev/?name=WEB530%20W1%20Properties%20%28%60props%60%29&platform=web&sdkVersion=54.0.0&code=import%20%7B%20View%2C%20Text%20%7D%20from%20%27react-native%27%3B%0A%0Afunction%20MyComponent%28props%29%20%7B%0A%20%20return%20%28%0A%20%20%20%20%3CView%3E%0A%20%20%20%20%20%20%3CText%3E%0A%20%20%20%20%20%20%20%20%3CText%3E%7Bprops.heading%20%7C%7C%20%27React%20Native%20Default%20Props%27%7D%3C%2FText%3E%0A%20%20%20%20%20%20%20%20%7B%27%5Cn%27%7D%0A%20%20%20%20%20%20%20%20%3CText%3EThis%20is%20a%20functional%20component.%20It%20has%20%7Bprops.body%20%7C%7C%20%27default%20props%27%7D.%3C%2FText%3E%0A%20%20%20%20%20%20%3C%2FText%3E%0A%20%20%20%20%3C%2FView%3E%0A%20%20%29%3B%0A%7D%0A%0Aexport%20default%20function%20App%28%29%20%7B%0A%20%20return%20%3CMyComponent%20heading%3D%22React%20Native%22%20%2F%3E%3B%0A%7D%0A)** (SDK 54, 필요한 패키지 자동 포함) <button class="snack-embed" type="button">👀 여기서 결과 보기</button>


React Native
This is a functional component. It has default props.


It is often simpler to [destructure the props](https://react.dev/learn/passing-props-to-a-component#step-2-read-props-inside-the-child-component) directly in the parameter declaration, leaving out the props keyword altogether:

```jsx
import { View, Text } from 'react-native';

function MyComponent({ heading = 'React Native Default Props', body = 'default props' }) {
  return (
    <View>
      <Text>
        <Text>{heading}</Text>
        {'\n'}
        <Text>This is a functional component. It has {body}.</Text>
      </Text>
    </View>
  );
}

export default function App() {
  return <MyComponent heading="React Native" />;
}
```

▶ **[Snack에서 바로 실행하기](https://snack.expo.dev/?name=WEB530%20W1%20Properties%20%28%60props%60%29&platform=web&sdkVersion=54.0.0&code=import%20%7B%20View%2C%20Text%20%7D%20from%20%27react-native%27%3B%0A%0Afunction%20MyComponent%28%7B%20heading%20%3D%20%27React%20Native%20Default%20Props%27%2C%20body%20%3D%20%27default%20props%27%20%7D%29%20%7B%0A%20%20return%20%28%0A%20%20%20%20%3CView%3E%0A%20%20%20%20%20%20%3CText%3E%0A%20%20%20%20%20%20%20%20%3CText%3E%7Bheading%7D%3C%2FText%3E%0A%20%20%20%20%20%20%20%20%7B%27%5Cn%27%7D%0A%20%20%20%20%20%20%20%20%3CText%3EThis%20is%20a%20functional%20component.%20It%20has%20%7Bbody%7D.%3C%2FText%3E%0A%20%20%20%20%20%20%3C%2FText%3E%0A%20%20%20%20%3C%2FView%3E%0A%20%20%29%3B%0A%7D%0A%0Aexport%20default%20function%20App%28%29%20%7B%0A%20%20return%20%3CMyComponent%20heading%3D%22React%20Native%22%20%2F%3E%3B%0A%7D%0A)** (SDK 54, 필요한 패키지 자동 포함) <button class="snack-embed" type="button">👀 여기서 결과 보기</button>


React Native
This is a functional component. It has default props.


**🇰🇷 한글 해설**

**Props = 부모가 자식에게 주는 값(속성).** HTML의 속성(attribute)처럼 써요.

```jsx
<MyComponent heading="React Native" body="props" />
// 자식 함수는 props = { heading: "React Native", body: "props" } 를 받음
```

기본값(default) 주는 방법 2가지, 시험에 자주 나와요.
1. **`||` 연산자**: `props.heading || '기본값'` 앞의 값이 비어 있으면(undefined, 빈 문자열 등) 뒤의 값을 써요.
2. **구조 분해(destructuring) + 기본값**: `function MyComponent({ heading = '기본값', body = 'default props' })` 파라미터 자리에서 바로 꺼내면서 기본값을 지정. 이 방법이 더 깔끔해서 수업에서 주로 써요.

구조 분해가 낯설면 이렇게 생각하세요. `props`라는 가방을 받아서 `props.heading`, `props.body` 하고 하나씩 꺼내는 대신, 가방을 받자마자 `{ heading, body }`로 **내용물을 바로 꺼내 놓는 것**이에요.


---

## 4. 📘 코스노트: Validating Props

<div class="sum" data-kind="read">

**🧭 먼저 한국어로** · 👀 읽고 이해하기 (타이핑 안 해도 돼요)

PropTypes로 props 타입을 검사하는 방법이에요. 💻 1.2 PropTypes 예제와 같은 내용이라 읽고 개념만 잡으면 돼요.

**이 챕터 구성**

- 👀 **Validating Component Properties**: PropTypes는 HTML 폼의 입력값 검사(field validation)와 비슷해요.
- 👀 **Validating Component Properties › Type Validation**: `prop-types` 패키지를 import 하고, `컴포넌트이름.propTypes = { ...
- 👀 **Validating Component Properties › Required Values**: 타입 뒤에 `.isRequired` 를 붙이면 "반드시 넘겨야 함"이 돼요.
- 👀 **Validating Component Properties › Any value**: `PropTypes.any.isRequired`: "타입은 아무거나 괜찮은데 뭔가는 꼭 넘겨라."
- 👀 **Validating Component Properties › Specific types**: `instanceOf(MyComponent)`: 특정 클래스의 인스턴스여야 함.
- 👀 **Validating Component Properties › Specific values**: 타입이 아니라 값 자체를 검사하는 것들이에요.
- 👀 **Validating Component Properties › Custom validators**: 직접 검사 함수를 만들 수도 있어요. 함수는 `(props, name, component)` 3개를 받아요.

</div>

> 원문 출처: https://seneca-ictoer.github.io/WEB530/B-Components/validating-props

### 📘 Validating Component Properties

You can think of property validation in components similar to field validation in HTML forms. The goal is to inform *developers* implementing a component that they have provided a value that is not acceptable. This improves the experience for developers that are interacting with components you have created.

**🇰🇷 한글 해설**

PropTypes는 HTML 폼의 입력값 검사(field validation)와 비슷해요. 다만 검사 대상이 **사용자가 아니라 개발자**예요. "이 컴포넌트를 쓰는 다른 개발자가 이상한 값을 넣으면 알려 주자"는 목적이에요.

#### 📘 Type Validation

The `prop-types` package includes simple property type validators that can handle most primitive types of JavaScript values. You will use these validators frequently to ensure property values contain the expected data type. It is worth noting that if you do not pass a value to a given property, the type is not validated and no warning is displayed.

```jsx
import React from 'react';
import { View, Text, TextInput } from 'react-native';
import PropTypes from 'prop-types';

const MyComponent = function ({ myString, myNumber, myBool, myFunc, myArray, myObject }) {
  return (
    <View>
      <Text>{myString}</Text>
      <Text>{myNumber}</Text>
      <TextInput editable={myBool} placeholder="Enter text" />
      <Text>{myFunc()}</Text>
      <Text>
        {myArray.map((i) => (
          <Text key={i}>{i}</Text>
        ))}
      </Text>
      <Text>{myObject.myProp}</Text>
    </View>
  );
};

MyComponent.propTypes = {
  myString: PropTypes.string,
  myNumber: PropTypes.number,
  myBool: PropTypes.bool,
  myFunc: PropTypes.func,
  myArray: PropTypes.array,
  myObject: PropTypes.object,
};

export default function App() {
  return (
    <MyComponent
      myString="String"
      myNumber={42}
      myBool={false}
      myFunc={() => 'Function'}
      myArray={['A', 'B', 'C']}
      myObject={{ myProp: 'Object.myProp' }}
    />
  );
}
```

▶ **[Snack에서 바로 실행하기](https://snack.expo.dev/?name=WEB530%20W1%20Validating%20Component%20Properties%20-%20Type%20Validation&platform=web&sdkVersion=54.0.0&code=import%20React%20from%20%27react%27%3B%0Aimport%20%7B%20View%2C%20Text%2C%20TextInput%20%7D%20from%20%27react-native%27%3B%0Aimport%20PropTypes%20from%20%27prop-types%27%3B%0A%0Aconst%20MyComponent%20%3D%20function%20%28%7B%20myString%2C%20myNumber%2C%20myBool%2C%20myFunc%2C%20myArray%2C%20myObject%20%7D%29%20%7B%0A%20%20return%20%28%0A%20%20%20%20%3CView%3E%0A%20%20%20%20%20%20%3CText%3E%7BmyString%7D%3C%2FText%3E%0A%20%20%20%20%20%20%3CText%3E%7BmyNumber%7D%3C%2FText%3E%0A%20%20%20%20%20%20%3CTextInput%20editable%3D%7BmyBool%7D%20placeholder%3D%22Enter%20text%22%20%2F%3E%0A%20%20%20%20%20%20%3CText%3E%7BmyFunc%28%29%7D%3C%2FText%3E%0A%20%20%20%20%20%20%3CText%3E%0A%20%20%20%20%20%20%20%20%7BmyArray.map%28%28i%29%20%3D%3E%20%28%0A%20%20%20%20%20%20%20%20%20%20%3CText%20key%3D%7Bi%7D%3E%7Bi%7D%3C%2FText%3E%0A%20%20%20%20%20%20%20%20%29%29%7D%0A%20%20%20%20%20%20%3C%2FText%3E%0A%20%20%20%20%20%20%3CText%3E%7BmyObject.myProp%7D%3C%2FText%3E%0A%20%20%20%20%3C%2FView%3E%0A%20%20%29%3B%0A%7D%3B%0A%0AMyComponent.propTypes%20%3D%20%7B%0A%20%20myString%3A%20PropTypes.string%2C%0A%20%20myNumber%3A%20PropTypes.number%2C%0A%20%20myBool%3A%20PropTypes.bool%2C%0A%20%20myFunc%3A%20PropTypes.func%2C%0A%20%20myArray%3A%20PropTypes.array%2C%0A%20%20myObject%3A%20PropTypes.object%2C%0A%7D%3B%0A%0Aexport%20default%20function%20App%28%29%20%7B%0A%20%20return%20%28%0A%20%20%20%20%3CMyComponent%0A%20%20%20%20%20%20myString%3D%22String%22%0A%20%20%20%20%20%20myNumber%3D%7B42%7D%0A%20%20%20%20%20%20myBool%3D%7Bfalse%7D%0A%20%20%20%20%20%20myFunc%3D%7B%28%29%20%3D%3E%20%27Function%27%7D%0A%20%20%20%20%20%20myArray%3D%7B%5B%27A%27%2C%20%27B%27%2C%20%27C%27%5D%7D%0A%20%20%20%20%20%20myObject%3D%7B%7B%20myProp%3A%20%27Object.myProp%27%20%7D%7D%0A%20%20%20%20%2F%3E%0A%20%20%29%3B%0A%7D%0A&dependencies=prop-types%40%2A)** (SDK 54, 필요한 패키지 자동 포함) <button class="snack-embed" type="button">👀 여기서 결과 보기</button>

Copy and paste the previous code example into the course's React playground, then try changing the property values so they use the wrong types. For example, change `myBool={false}` to `myBool={"false"}`. You should see a warning similar to: Failed prop type: Invalid prop `myBool` of type `string` supplied to `MyComponent`, expected `boolean`.

💡 React 19 removed `propTypes` checking, so these warnings only appear in React 18 and earlier. The course playground uses React 18 for this reason. Expo SDK 53 and later (including the current Snack) use React 19, where `propTypes` are silently ignored. Newer projects use TypeScript to check props instead; see the [TypeScript guide](https://seneca-ictoer.github.io/WEB530/Z-Guides/typescript).

**🇰🇷 한글 해설**

`prop-types` 패키지를 import 하고, `컴포넌트이름.propTypes = { ... }` 객체를 붙여요.

| 검사기 | 의미 |
| --- | --- |
| `PropTypes.string` | 문자열 |
| `PropTypes.number` | 숫자 |
| `PropTypes.bool` | true/false (주의: `boolean` 아니고 `bool`) |
| `PropTypes.func` | 함수 (주의: `function` 아니고 `func`) |
| `PropTypes.array` | 배열 |
| `PropTypes.object` | 객체 |

**함정 1**: prop을 아예 안 넘기면 타입 검사를 안 해요. 경고 없음. (그래서 `isRequired`가 필요해요.)

**함정 2 (아주 중요)**: React 19부터 propTypes 검사가 **없어졌어요.** 그래서 경고를 보려면 React 18을 쓰는 교수님 CodeSandbox 템플릿에서 해야 해요. 지금 Snack(Expo SDK 53 이상)은 React 19라서 propTypes를 **조용히 무시**해요. 앞으로는 TypeScript가 이 역할을 대신해요. 아래 Snack 링크는 코드 구조를 보는 용도로만 쓰고, 경고 실험은 CodeSandbox에서 하세요.

`myBool={"false"}` 처럼 따옴표로 감싸면 그건 boolean이 아니라 **문자열** "false" 예요. 그래서 경고가 떠요.

#### 📘 Required Values

As mentioned earlier, no warning is shown if you simply ignore a property but there are times when a value is required. Using the `prop-types` package, we can indicate the values that must be specified. Let's modify the previous code example to require all properties be specified.

```jsx
MyComponent.propTypes = {
  myString: PropTypes.string.isRequired,
  myNumber: PropTypes.number.isRequired,
  myBool: PropTypes.bool.isRequired,
  myFunc: PropTypes.func.isRequired,
  myArray: PropTypes.array.isRequired,
  myObject: PropTypes.object.isRequired,
};
```

**🇰🇷 한글 해설**

타입 뒤에 `.isRequired` 를 붙이면 "반드시 넘겨야 함"이 돼요. 안 넘기면 `The prop ... is marked as required ... but its value is undefined` 경고가 떠요.

#### 📘 Any value

Sometimes you don't know (or care) what type of property is passed to your component but you want to ensure something is passed in. In other words, it is a required property but the data type doesn't matter. This is easily accomplished using `PropTypes.any.isRequired`.

**🇰🇷 한글 해설**

`PropTypes.any.isRequired`: "타입은 아무거나 괜찮은데 **뭔가는 꼭** 넘겨라."

#### 📘 Specific types

If you need a property validator that checks for a custom type defined by your application, for example a component called `MyComponent`, there are `PropTypes` for this as well.

* `PropTypes.instanceOf(MyComponent)` - requires an instance of `MyComponent`.
* `PropTypes.oneOfType([PropTypes.string, MyComponent])` - requires an instance of `string` or `MyComponent`.
* `PropTypes.arrayOf(PropTypes.instanceOf(MyComponent))` - requires an array of `MyComponent` instances.

**🇰🇷 한글 해설**

- `instanceOf(MyComponent)`: 특정 클래스의 인스턴스여야 함.
- `oneOfType([A, B])`: A **또는** B 타입이면 OK. (타입 여러 개 중 하나)
- `arrayOf(X)`: X 타입들로만 이루어진 배열.

#### 📘 Specific values

So far, we’ve validated the type of each prop, but sometimes the actual value matters just as much.

* `PropTypes.oneOf(possibleValues)` - Checks the property value and warns if the value is not contained in an array `possibleValues`.
* `PropTypes.shape(comparableObj)` - Similar to `instanceOf()` but we don't care about the actual type. Instead, we care that the object passed in has all of the required properties and that each property is valid.

**🇰🇷 한글 해설**

타입이 아니라 **값 자체**를 검사하는 것들이에요.
- `oneOf(['Fall', 'Winter', 'Summer'])`: 이 목록 안의 값만 허용. (`oneOfType`과 헷갈리지 마세요! `oneOf`는 **값**, `oneOfType`은 **타입**)
- `shape({ name: PropTypes.string })`: 객체 안에 어떤 필드들이 어떤 타입으로 있어야 하는지 모양(shape)을 검사.

#### 📘 Custom validators

The validators provided by the `prop-types` package cover a wide range of scenarios but you may require some sort of custom validation logic. Simply define a function accepting three arguments `(props, name, component) => { }`. Return `null` if the value is valid otherwise return an `Error` instance.

```jsx
MyComponent.propTypes = {
  myNumber: (props, name, component) =>
    Number.isFinite(props[name]) && props[name] >= 10 && props[name] <= 99
      ? null
      : new Error(`${component}.${name} expects a number between 10 and 99`),
};
```

**🇰🇷 한글 해설**

직접 검사 함수를 만들 수도 있어요. 함수는 `(props, name, component)` 3개를 받아요.
- 통과하면 `null` 반환
- 실패하면 `new Error(...)` 반환

예제는 "10 이상 99 이하의 숫자인지" 검사해요. `Number.isFinite(x)` 는 "진짜 유한한 숫자인지" 확인하는 함수예요.


---

## 5. 💻 인클래스 예제: Week 1.1 - Notes and Examples

<div class="sum" data-kind="type">

**🧭 먼저 한국어로** · ⌨️ Snack에서 직접 쳐 보기

교수님이 1.1 수업에서 라이브 코딩한 웹 React 예제예요. ⌨️ 표시된 코드는 CodeSandbox 템플릿을 Fork해서 처음부터 직접 쳐 보세요.

**이 챕터 구성**

- ⏭️ **Playground**: 교수님 CodeSandbox 템플릿 링크예요. Fork해서 내 것으로 만들어 두세요.
- ⌨️ **[Example: Simple Components](#practice-1)**: 컴포넌트는 화면 조각을 돌려주는 대문자 함수예요. (⌨️ MyButton 컴포넌트를 만들고 MyApp 안에서 <MyButton />으로 쓰기)
- ⌨️ **[Example: Multiple Tags](#practice-2)**: JSX는 부모 태그 하나만 return할 수 있어요. (⌨️ h1과 MyButton을 div(또는 Fragment <>)로 감싸서 함께 return)
- ⌨️ **[Example: JS-Expressions](#practice-3)**: JSX 안에서 { }를 쓰면 JS 값을 넣을 수 있어요. (⌨️ 변수를 만들고 { }로 버튼 글자와 disabled 속성에 넣기)
- ⌨️ **[Example: Passing props](#practice-4)**: Week 1의 핵심이에요. 같은 컴포넌트를 다른 값으로 재사용해요. (⌨️ MyButton에 buttonText, isEnabled props를 넘기고 구조분해와 기본값으로 받기)

</div>

> 원문 출처: github.com/nick-romanidis/web530-2267-nsa  week-01.1-notes.md

**🇰🇷 들어가기 전에**

여기부터는 교수님이 1주차 첫 수업(1.1)에서 **라이브 코딩한 예제**예요. 원문 bullet(•)은 교수님이 수업 중에 "이걸 보여 줘라(Show that ...)" 하고 적어 둔 메모예요. 1.1은 **웹 React**라서 `<div>`, `<button>` 같은 HTML 태그를 쓰고, CodeSandbox 템플릿에서 돌려요.

### 💻 Playground

React Playground (Professor's CodeSpace Template)
(https://codesandbox.io/p/sandbox/react-basic-3rqll4)

**🇰🇷 한글 해설**

교수님 CodeSandbox 템플릿 링크예요. 들어가서 **Fork** 하면 내 것으로 복사돼요. `src/index.js` 에서 코드를 고치면 돼요.

### 💻 Example: Simple Components

- MyApp is the most parent component.
- It is a JavaScript function
- Tags are case sensitive
  - HTML should remain in lower case.
  - Our custom components will have an uppercase letter at the start.
- Show that after return there is ( ) surrounding the HTML, it is not required. `return <MyButton />;`


<p class="typeit" id="practice-1">⌨️ <b>이 코드는 CodeSandbox에서 직접 쳐 보세요</b>: MyButton 컴포넌트를 만들고 MyApp 안에서 &lt;MyButton /&gt;으로 쓰기</p>

```jsx
function MyButton() {
  return <button>I'm a button</button>;
}

function MyApp() {
  return <MyButton />;
}
```

▶ 웹 React 코드예요. [교수님 CodeSandbox 템플릿](https://codesandbox.io/p/sandbox/react-basic-3rqll4)에 붙여넣어 실행하세요.

**🇰🇷 한글 해설**

**코드 해설**
- `function MyButton()`: 버튼 하나를 돌려주는 컴포넌트.
- `function MyApp()`: 가장 바깥(최상위 부모) 컴포넌트. 그 안에서 `<MyButton />` 을 태그처럼 써요.
- `return` 뒤에 `( )` 괄호는 여러 줄일 때 보기 좋으라고 쓰는 거고, 한 줄이면 없어도 돼요.
- 대문자 규칙: `<button>`(소문자) 는 HTML 버튼, `<MyButton>`(대문자) 은 내가 만든 컴포넌트.

**직접 해 보기**: `MyButton`을 `myButton`으로 바꿔 보세요. React가 HTML 태그로 착각해서 아무것도 안 나오거나 경고가 떠요.

### 💻 Example: Multiple Tags

- If you need multiple tags, they cannot be side by side.
- Create a parent tag then add the children.
- Show how to add the H1 tag


<p class="typeit" id="practice-2">⌨️ <b>이 코드는 CodeSandbox에서 직접 쳐 보세요</b>: h1과 MyButton을 div(또는 Fragment &lt;&gt;)로 감싸서 함께 return</p>

```jsx
function MyApp() {
  return (
    <div>
      <h1>Welcome to my app</h1>
      <MyButton />
    </div>
  );
}
```

▶ 웹 React 코드예요. [교수님 CodeSandbox 템플릿](https://codesandbox.io/p/sandbox/react-basic-3rqll4)에 붙여넣어 실행하세요.

- If you don't want a parent tag, you can use `<>...</>`

```jsx
function MyApp() {
  return (
    <>
      <h1>Welcome to my app</h1>
      <MyButton />
    </>
  );
}
```

▶ 웹 React 코드예요. [교수님 CodeSandbox 템플릿](https://codesandbox.io/p/sandbox/react-basic-3rqll4)에 붙여넣어 실행하세요.

**🇰🇷 한글 해설**

**코드 해설**
- `<h1>` 과 `<MyButton />` 을 나란히 return 하면 에러! 부모 `<div>` 하나로 감싸야 해요.
- 부모 div가 필요 없으면 **Fragment** `<>...</>` 를 써요. 화면에 아무 태그도 추가하지 않는 "투명한 포장지"예요.

### 💻 Example: JS-Expressions

- Show that we can define JS constants
- Show that we can use those constants in a tag argument using { }


<p class="typeit" id="practice-3">⌨️ <b>이 코드는 CodeSandbox에서 직접 쳐 보세요</b>: 변수를 만들고 { }로 버튼 글자와 disabled 속성에 넣기</p>

```jsx
function MyButton() {
  const buttonText = "I'm a button";

  return <button>{buttonText}</button>;
}
```

▶ 웹 React 코드예요. [교수님 CodeSandbox 템플릿](https://codesandbox.io/p/sandbox/react-basic-3rqll4)에 붙여넣어 실행하세요.

- Show that we can use these constants as attribute values
- Show that we can negate a Boolean {!varname}

```jsx
function MyButton() {
  const buttonText = "I'm a button";
  const enable = false;

  return <button disabled={!enable}>{buttonText}</button>;
}
```

▶ 웹 React 코드예요. [교수님 CodeSandbox 템플릿](https://codesandbox.io/p/sandbox/react-basic-3rqll4)에 붙여넣어 실행하세요.

- Show that html tokens such as &copy; can be used

```jsx
function MyButton() {
  const buttonText = "I'm a button";
  const enable = false;

  return <button disabled={!enable}>{buttonText} &copy;</button>;
}
```

▶ 웹 React 코드예요. [교수님 CodeSandbox 템플릿](https://codesandbox.io/p/sandbox/react-basic-3rqll4)에 붙여넣어 실행하세요.

**🇰🇷 한글 해설**

**코드 해설**
- `const buttonText = "I'm a button";` 일반 JS 변수를 만들고
- `<button>{buttonText}</button>` 처럼 `{ }` 안에 넣으면 변수 값이 화면에 나와요.
- 속성(attribute) 값에도 `{ }` 를 써요: `disabled={!enable}`. `enable`이 false라서 `!enable`은 true, 그래서 버튼이 비활성화돼요.
- `&copy;` 같은 HTML 특수문자(엔티티)도 JSX 글자 안에서 쓸 수 있어요. 화면에 © 가 나와요.

### 💻 Example: Passing props

- Pass props to our button component and read information from there instead of constants.
- Show what happens if `buttonText` is omitted.


<p class="typeit" id="practice-4">⌨️ <b>이 코드는 CodeSandbox에서 직접 쳐 보세요</b>: MyButton에 buttonText, isEnabled props를 넘기고 구조분해와 기본값으로 받기</p>

```jsx
function MyButton(props) {
  return <button disabled={!props.isEnabled}>{props.buttonText}</button>;
}

function MyApp() {
  return (
    <div>
      <h1>Welcome to my app</h1>
      <MyButton buttonText="My Button" isEnabled={true} />
    </div>
  );
}
```

▶ 웹 React 코드예요. [교수님 CodeSandbox 템플릿](https://codesandbox.io/p/sandbox/react-basic-3rqll4)에 붙여넣어 실행하세요.

- Let's set a default value so when removing `buttonText` the control doesn't look broken.

```jsx
function MyButton(props) {
  return (
    <button disabled={!props.isEnabled}>
      {props.buttonText || "My Button"}
    </button>
  );
}

function MyApp() {
  return (
    <div>
      <h1>Welcome to my app</h1>
      <MyButton isEnabled={true} />
    </div>
  );
}
```

▶ 웹 React 코드예요. [교수님 CodeSandbox 템플릿](https://codesandbox.io/p/sandbox/react-basic-3rqll4)에 붙여넣어 실행하세요.

- Another way to create default values is by using `destructuring`.

```jsx
function MyButton({ buttonText = "My Button", isEnabled = false }) {
  return <button disabled={!isEnabled}>{buttonText}</button>;
}

function MyApp() {
  return (
    <div>
      <h1>Welcome to my app</h1>
      <MyButton isEnabled={true} />
    </div>
  );
}
```

▶ 웹 React 코드예요. [교수님 CodeSandbox 템플릿](https://codesandbox.io/p/sandbox/react-basic-3rqll4)에 붙여넣어 실행하세요.

**🇰🇷 한글 해설**

이 예제가 Week 1의 핵심이에요. 같은 버튼 컴포넌트에 **다른 값을 넣어 재사용**하는 법.

**코드 해설 (3단계로 발전)**
1. `MyButton(props)` 로 받고 `props.buttonText`, `props.isEnabled` 로 꺼내 씀. `buttonText`를 안 넘기면 버튼 글자가 비어서 이상해 보여요.
2. `{props.buttonText || "My Button"}`: 값이 없으면 "My Button"으로 대체. (OR 연산자 기본값)
3. `function MyButton({ buttonText = "My Button", isEnabled = false })`: **구조 분해 + 기본값**. 가장 깔끔한 최종형.

주의: 숫자나 boolean, 변수는 `isEnabled={true}` 처럼 **중괄호**로, 문자열은 `buttonText="My Button"` 처럼 **따옴표**로 넘겨요. `isEnabled="true"` 라고 쓰면 그건 문자열이에요!


---

## 6. 💻 인클래스 예제: Week 1.2 - Notes and Examples

<div class="sum" data-kind="type">

**🧭 먼저 한국어로** · ⌨️ Snack에서 직접 쳐 보기

1.2 수업 예제예요. 앞부분 PropTypes는 웹 React(CodeSandbox), 뒷부분부터 React Native(Snack)예요. ⌨️ 표시된 코드는 직접 쳐 보세요.

**이 챕터 구성**

- ⏭️ **React Playground**: PropTypes 예제용 CodeSandbox 템플릿 안내예요.
- ⌨️ **[Example: PropTypes and Validation](#practice-5)**: PropTypes는 개발 모드에서 콘솔 경고만 내요. (⌨️ MyButton에 PropTypes(string, bool, isRequired)를 붙이고 잘못된 값을 넘겨 콘솔 경고 확인)
- ⏭️ **React Native Playground**: 여기서부터 Expo Snack을 써요. App.js를 고치면 오른쪽에 결과가 나와요.
- ⌨️ **[Example: Introduce React Native Components (not HTML)](#practice-6)**: HTML 태그 대신 React Native 컴포넌트를 써요. (⌨️ 1.1의 div, h1, button을 View, Text, Button으로 바꿔서 Snack에서 실행)
- 👀 **HTML to React Native**: HTML 태그와 React Native 컴포넌트 대응표예요. 통째로 외워 두세요.

</div>

> 원문 출처: github.com/nick-romanidis/web530-2267-nsa  week-01.2-notes.md

### 💻 React Playground

React Playground (Professor's CodeSpace Template)
(https://codesandbox.io/p/sandbox/react-basic-3rqll4)

**🇰🇷 한글 해설**

1.2 수업 앞부분(PropTypes)도 웹 React라서 같은 CodeSandbox 템플릿을 써요. 이 템플릿은 **React 18**이라 PropTypes 경고가 보여요.

### 💻 Example: PropTypes and Validation

- A component has no way to say what props it expects. PropTypes lets us declare that contract.
- React checks the contract **in development only** and prints a warning in the console. Nothing is enforced in production.
- The checks come from the separate `prop-types` package, so it must be installed and imported.
- PropTypes is deprecated. React 19 no longer checks it, and TypeScript replaces it. We will revisit this when we learn TypeScript.


<p class="typeit" id="practice-5">⌨️ <b>이 코드는 CodeSandbox에서 직접 쳐 보세요</b>: MyButton에 PropTypes(string, bool, isRequired)를 붙이고 잘못된 값을 넘겨 콘솔 경고 확인</p>

```jsx
import PropTypes from "prop-types";

function Greeting({ name, age, isStudent }) {
  return (
    <div>
      <p>Hello {name}</p>
      <p>Age: {age}</p>
      <p>{isStudent ? "Student" : "Not a student"}</p>
    </div>
  );
}

// Prop validation
Greeting.propTypes = {
  name: PropTypes.string.isRequired, // must be a string
  age: PropTypes.number.isRequired, // must be a number
  isStudent: PropTypes.bool, // optional boolean
};

function MyApp() {
  return <Greeting name="Nicholas" age={42} isStudent={false} />;
}
```

▶ 웹 React 코드예요. [교수님 CodeSandbox 템플릿](https://codesandbox.io/p/sandbox/react-basic-3rqll4)에 붙여넣어 실행하세요.

- Show what happens when the contract is broken. Open the browser console and try each line.
- The app still renders. PropTypes only warns, it does not stop the component.

```jsx
function MyApp() {
  return (
    <>
      {/* OK */}
      <Greeting name="Nicholas" age={42} isStudent={false} />

      {/* Warning: Failed prop type: Invalid prop `age` of type `string`
          supplied to `Greeting`, expected `number`. */}
      <Greeting name="Nicholas" age="42" />

      {/* Warning: Failed prop type: The prop `name` is marked as required
          in `Greeting`, but its value is `undefined`. */}
      <Greeting age={42} />
    </>
  );
}
```

▶ 웹 React 코드예요. [교수님 CodeSandbox 템플릿](https://codesandbox.io/p/sandbox/react-basic-3rqll4)에 붙여넣어 실행하세요.

- Optional props should have a default so the component never renders something odd.
- Reuse the destructuring default from Week 1.1. PropTypes says "optional", the default says "what it is when omitted".

```jsx
function Greeting({ name, age, isStudent = false }) {
  return (
    <div>
      <p>Hello {name}</p>
      <p>Age: {age}</p>
      <p>{isStudent ? "Student" : "Not a student"}</p>
    </div>
  );
}

Greeting.propTypes = {
  name: PropTypes.string.isRequired,
  age: PropTypes.number.isRequired,
  isStudent: PropTypes.bool,
};
```

▶ 웹 React 코드예요. [교수님 CodeSandbox 템플릿](https://codesandbox.io/p/sandbox/react-basic-3rqll4)에 붙여넣어 실행하세요.

- There are validators for more than primitives. The ones you will use most:
  - `PropTypes.oneOf([...])` restricts a prop to a fixed set of values.
  - `PropTypes.func` for callbacks.
  - `PropTypes.arrayOf(type)` for lists.
  - `PropTypes.shape({...})` for objects with known fields.

```jsx
import PropTypes from "prop-types";

function Course({ code, term, topics, instructor, onSelect }) {
  return (
    <div>
      <h2>
        {code} ({term})
      </h2>
      <p>Instructor: {instructor.name}</p>
      <ul>
        {topics.map((topic) => (
          <li key={topic}>{topic}</li>
        ))}
      </ul>
      <button onClick={() => onSelect(code)}>Select</button>
    </div>
  );
}

Course.propTypes = {
  code: PropTypes.string.isRequired,
  term: PropTypes.oneOf(["Fall", "Winter", "Summer"]).isRequired,
  topics: PropTypes.arrayOf(PropTypes.string).isRequired,
  instructor: PropTypes.shape({
    name: PropTypes.string.isRequired,
    email: PropTypes.string,
  }).isRequired,
  onSelect: PropTypes.func.isRequired,
};

function MyApp() {
  return (
    <Course
      code="WEB530"
      term="Fall"
      topics={["JSX", "Components", "Props"]}
      instructor={{ name: "Nicholas" }}
      onSelect={(code) => alert(`Selected ${code}`)}
    />
  );
}
```

▶ 웹 React 코드예요. [교수님 CodeSandbox 템플릿](https://codesandbox.io/p/sandbox/react-basic-3rqll4)에 붙여넣어 실행하세요.

- Try `term="Spring"` or `topics="JSX"` and read the warning. The message names the prop, the component, what it got, and what it expected.

**🇰🇷 한글 해설**

**핵심 4줄 요약 (원문 첫 bullet들)**
- 컴포넌트는 스스로 "나 이런 props 받아요"라고 말할 방법이 없다. PropTypes가 그 **계약(contract)** 을 선언하게 해 준다.
- 검사는 **개발 모드에서만**, 콘솔 **경고**로만. 배포(production)에서는 아무것도 안 한다.
- `prop-types` 는 별도 패키지라 설치하고 import 해야 한다.
- PropTypes는 **deprecated(더 이상 권장 안 함)**. React 19는 검사 안 하고, TypeScript가 대신한다.

**코드 해설: Greeting**
- `name: PropTypes.string.isRequired` → 이름은 문자열, 필수.
- `age: PropTypes.number.isRequired` → 나이는 숫자, 필수.
- `isStudent: PropTypes.bool` → 선택. 그래서 기본값 `isStudent = false` 를 같이 준다. "PropTypes는 선택이라고 말하고, 기본값은 안 넘겼을 때 무엇인지 말한다."
- `{isStudent ? "Student" : "Not a student"}` → **삼항 연산자**. `조건 ? 참일때 : 거짓일때`.

**계약 깨 보기**
- `age="42"` → 따옴표라서 문자열! 경고: expected `number`.
- `<Greeting age={42} />` → name 빠짐. 경고: marked as required ... undefined.
- 그래도 **화면은 그려진다.** 경고만 할 뿐.

**코드 해설: Course (복합 검사기)**
- `term: PropTypes.oneOf(["Fall", "Winter", "Summer"])` → 이 셋 중 하나만. `"Spring"` 넣으면 경고.
- `topics: PropTypes.arrayOf(PropTypes.string)` → 문자열 배열. `topics="JSX"`(그냥 문자열) 넣으면 경고.
- `instructor: PropTypes.shape({ name: ..., email: ... })` → 객체 모양 검사.
- `onSelect: PropTypes.func` → 함수(콜백).
- `topics.map((topic) => <li key={topic}>{topic}</li>)` → 배열을 `<li>` 목록으로. key는 topic 문자열 자체.
- `onClick={() => onSelect(code)}` → 클릭하면 부모가 준 함수에 `code`를 넣어 호출. 부모는 `alert`로 띄움. **템플릿 리터럴** `` `Selected ${code}` `` 는 백틱(`)과 `${}`로 문자열 안에 변수를 넣는 문법이에요.

### 💻 React Native Playground

React Native Playground (Snack)
_Use this for the examples. Modify App.js_
(https://snack.expo.dev)

**🇰🇷 한글 해설**

여기서부터는 **React Native**. 이제 CodeSandbox 말고 **Expo Snack**을 써요. Snack은 브라우저에서 React Native를 바로 돌려 보는 놀이터예요. `App.js` 를 고치면 오른쪽에 결과가 나와요. 오른쪽 위에서 **Web / iOS / Android / My Device**를 고를 수 있어요. 폰에 **Expo Go** 앱을 깔고 QR을 찍으면 내 폰에서도 돌아가요.

### 💻 Example: Introduce React Native Components (not HTML)

- Rewrite the this example using proper React Native components.

```jsx
function MyButton() {
  const buttonText = "I'm a button";
  const enable = false;

  return <button disabled={!enable}>{buttonText}</button>;
}

function MyApp() {
  return (
    <div>
      <h1>Welcome to my app</h1>
      <MyButton />
    </div>
  );
}
```

▶ 웹 React 코드예요. [교수님 CodeSandbox 템플릿](https://codesandbox.io/p/sandbox/react-basic-3rqll4)에 붙여넣어 실행하세요.

- Notice React Native component names begin with capital letters.


<p class="typeit" id="practice-6">⌨️ <b>이 코드는 Snack에서 직접 쳐 보세요</b>: 1.1의 div, h1, button을 View, Text, Button으로 바꿔서 Snack에서 실행</p>

```jsx
import { View, Text, Button } from "react-native";

function MyButton() {
  const buttonText = "I'm a button";
  const enable = false;

  return <Button disabled={!enable} title={buttonText} />;
}

export default function MyApp() {
  return (
    <View>
      <Text>Welcome to my app</Text>
      <MyButton />
    </View>
  );
}
```

▶ **[Snack에서 바로 실행하기](https://snack.expo.dev/?name=WEB530%20W1%20Example%3A%20Introduce%20React%20Native%20Components%20%28not%20HT&platform=web&sdkVersion=54.0.0&code=import%20%7B%20View%2C%20Text%2C%20Button%20%7D%20from%20%22react-native%22%3B%0A%0Afunction%20MyButton%28%29%20%7B%0A%20%20const%20buttonText%20%3D%20%22I%27m%20a%20button%22%3B%0A%20%20const%20enable%20%3D%20false%3B%0A%0A%20%20return%20%3CButton%20disabled%3D%7B%21enable%7D%20title%3D%7BbuttonText%7D%20%2F%3E%3B%0A%7D%0A%0Aexport%20default%20function%20MyApp%28%29%20%7B%0A%20%20return%20%28%0A%20%20%20%20%3CView%3E%0A%20%20%20%20%20%20%3CText%3EWelcome%20to%20my%20app%3C%2FText%3E%0A%20%20%20%20%20%20%3CMyButton%20%2F%3E%0A%20%20%20%20%3C%2FView%3E%0A%20%20%29%3B%0A%7D%0A)** (SDK 54, 필요한 패키지 자동 포함) <button class="snack-embed" type="button">👀 여기서 결과 보기</button>

- Show that text must live inside `Text`. React Native does not allow a bare string inside a `View`.
- This crashes the app. Remove the `Text` tags below and read the error.


<p class="typeit sm">⌨️ 이 부분도 직접 쳐 보세요</p>

```jsx
import { View, Text } from "react-native";

export default function MyApp() {
  return (
    <View>
      <Text>Welcome to my app</Text>
    </View>
  );
}
```

▶ **[Snack에서 바로 실행하기](https://snack.expo.dev/?name=WEB530%20W1%20Example%3A%20Introduce%20React%20Native%20Components%20%28not%20HT&platform=web&sdkVersion=54.0.0&code=import%20%7B%20View%2C%20Text%20%7D%20from%20%22react-native%22%3B%0A%0Aexport%20default%20function%20MyApp%28%29%20%7B%0A%20%20return%20%28%0A%20%20%20%20%3CView%3E%0A%20%20%20%20%20%20%3CText%3EWelcome%20to%20my%20app%3C%2FText%3E%0A%20%20%20%20%3C%2FView%3E%0A%20%20%29%3B%0A%7D%0A)** (SDK 54, 필요한 패키지 자동 포함) <button class="snack-embed" type="button">👀 여기서 결과 보기</button>

- Error: `Text strings must be rendered within a <Text> component.`

**🇰🇷 한글 해설**

**코드 해설: HTML 버전 → React Native 버전**

| HTML 버전 | React Native 버전 | 바뀐 점 |
| --- | --- | --- |
| `<div>` | `<View>` | 상자 |
| `<h1>Welcome</h1>` | `<Text>Welcome</Text>` | RN에는 h1이 없음. 글자는 다 Text |
| `<button>{buttonText}</button>` | `<Button title={buttonText} />` | 글자를 **title prop**으로. 자식으로 안 씀. 그래서 self-closing `/>` |
| `function MyApp` | `export default function MyApp` | Snack은 App.js의 **default export**를 앱 시작점으로 씀 |

- 맨 위 `import { View, Text, Button } from "react-native";` 를 빼먹으면 "View is not defined" 에러.
- RN 컴포넌트 이름은 전부 **대문자로 시작**.

**일부러 터뜨려 보기**: `<Text>` 를 지우고 `<View>Welcome to my app</View>` 로 바꾸면 에러가 나요.
`Text strings must be rendered within a <Text> component.` 이 문장 그대로 시험에 나올 수 있어요. 뜻: "글자는 반드시 Text 컴포넌트 안에서 그려야 한다."

### 💻 HTML to React Native

| HTML                 | React Native | Notes                                          |
| -------------------- | ------------ | ---------------------------------------------- |
| `<div>`              | `View`       | Container, no text directly inside             |
| `<p>`, `<h1>`, `<span>` | `Text`    | All text, no separate heading components       |
| `<button>`           | `Button`     | Label goes in the `title` prop, not as children |
| `<input>`            | `TextInput`  |                                                |
| `<img>`              | `Image`      | Needs a `source` prop                          |
| `<ul>`, `<li>`       | `View` + `Text` | Lists get their own component later       |

**🇰🇷 한글 해설**

이 표는 **통째로 외우세요.** 2주차 표가 이걸 확장한 버전이에요.
- `<ul>`, `<li>` 는 RN에 없어요. 지금은 `View` + `Text`로 흉내 내고, 5주차에 `FlatList`라는 전용 컴포넌트를 배워요.
- `Image`는 `src`가 아니라 `source` prop을 써요.


---

## 7. 🧪 Lab: Lab 1 - Components and Props

<div class="sum" data-kind="lab">

**🧭 먼저 한국어로** · 🧪 혼자 풀어 보기

Lab 1 문제예요. 정답 대신 힌트와 참고할 예제 위치만 적어 뒀어요. 위 예제를 다 쳐 본 다음 혼자 풀어 보세요.

**이 챕터 구성**

- ⏭️ **A Note on AI**: AI는 막혔을 때 도움 받는 용도로만 쓰고, 내가 한 줄 한 줄 설명 못 하는 코드는 남기지 말라는 안내예요.
- 👀 **Setup**: CodeSandbox 계정 만들고, 교수님 템플릿을 Fork, 이름 바꾸고, `package.json`에 React 18 + prop-types 가 있는지 확인.
- ⏭️ **Submission**: CodeSandbox 링크 하나만 Blackboard에 제출.
- 🧪 **Question 1 - Your First Component (1 point)**: 참고 예제: 1.1 Simple Components.
- 🧪 **Question 2 - Add a Button (1 point)**: 포인트: HelloMessage가 이제 글자 + 버튼 두 개를 return 하니까 부모 태그로 감싸야 해요(1.1 Multiple Tags).
- 🧪 **Question 3 - Create a Reusable Button Component (1 point)**: 참고 예제: 1.1 Passing props의 최종형(구조 분해 + `disabled={!isEnabled}`) 거의 그대로예요.
- 🧪 **Question 4 - Display Dynamic Text (1 point)**: 포인트: `Welcome, {name}!` 처럼 JSX 글자 중간에 `{ }`.
- 🧪 **Question 5 - Using JavaScript Inside Components (1 point)**: 참고 예제: 1.1 JS-Expressions.
- 🧪 **Question 6 - Prop Validation (1 point)**: 참고 예제: 1.2 PropTypes Greeting.

</div>

> 원문 출처: github.com/nick-romanidis/web530-2267-nsa  lab-1.md

**🇰🇷 들어가기 전에**

Lab 1은 위에서 배운 웹 React 예제(1.1, 1.2)를 내 손으로 다시 쓰는 연습이에요. 아래에서 각 문제가 **어떤 예제를 참고하면 되는지** 연결해 줄게요. 정답 코드를 통째로 주기보다, 막히는 지점과 핵심 패턴을 짚어 줄게요. (Lab 원문에도 "AI가 대신 쓰게 하지 말고 막힐 때만 써라"라고 되어 있어요.)

### 🧪 A Note on AI

AI assistants are welcome in this course, but use them to get unstuck, not to do the work. Attempt every question yourself first. If you are stuck, paste **your** code and ask why it does not work or what concept you are missing, rather than asking for the answer. Never keep code you could not explain line by line to a classmate. If you cannot explain it, you cannot debug it or build on it, and it is not yours yet. The point of this lab is not the finished sandbox. It is the ability to write these components yourself, and having an assistant write them for you skips the only part that builds that ability.

**🇰🇷 한글 해설**

AI는 막혔을 때 도움 받는 용도로만 쓰고, 내가 한 줄 한 줄 설명 못 하는 코드는 남기지 말라는 안내예요. 시험장에서는 AI가 없으니, 이 노트로 공부할 때도 **Snack 링크를 열어 직접 타이핑**해 보는 게 제일 좋아요.

### 🧪 Setup

1. You need a free CodeSandbox account. Sign in with your GitHub account, or create one at https://codesandbox.io.
2. Open the React Playground (Professor's CodeSandbox Template) and fork it:
   (https://codesandbox.io/p/sandbox/react-basic-3rqll4)
3. Rename the sandbox to `WEB530 Lab 1 - Your Name`.
4. Open `package.json` and verify it matches the file below. It must use React 18 and include `prop-types`. If it does not, replace the contents with the file below and restart the sandbox.

```json
{
  "name": "react",
  "version": "1.0.0",
  "description": "",
  "keywords": [],
  "main": "src/index.js",
  "dependencies": {
    "prop-types": "^15.8.1",
    "react": "^18.3.1",
    "react-dom": "^18.3.1",
    "react-scripts": "^5.0.0"
  },
  "devDependencies": {
    "loader-utils": "3.2.1"
  },
  "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build",
    "test": "react-scripts test --env=jsdom",
    "eject": "react-scripts eject"
  },
  "browserslist": [">0.2%", "not dead", "not ie <= 11", "not op_mini all"]
}
```

**🇰🇷 한글 해설**

CodeSandbox 계정 만들고, 교수님 템플릿을 Fork, 이름 바꾸고, `package.json`에 **React 18 + prop-types** 가 있는지 확인. React 18이어야 PropTypes 경고가 보여요.

### 🧪 Submission

- Submit **one** CodeSandbox link to the `Lab 1` assessment in Blackboard.
- The lab is due before the end of Friday's class.
- All questions go in the same sandbox. Write every component in `src/index.js`.
- `MyApp` must render the answer to each question in order, under a heading, like this:

```jsx
function MyApp() {
  return (
    <div>
      <h2>Question 1</h2>
      <HelloMessage />

      <h2>Question 3</h2>
      <MyButton buttonText="Save" isEnabled={true} />
      <MyButton buttonText="Delete" isEnabled={false} />

      {/* and so on */}
    </div>
  );
}
```

▶ 웹 React 코드예요. [교수님 CodeSandbox 템플릿](https://codesandbox.io/p/sandbox/react-basic-3rqll4)에 붙여넣어 실행하세요.

- Before submitting, make sure the sandbox is public. Open your link in a private browser window to confirm it loads without signing in.

**🇰🇷 한글 해설**

- CodeSandbox 링크 **하나**만 Blackboard에 제출.
- 모든 문제를 `src/index.js` 한 파일에.
- `MyApp` 안에 `<h2>Question 1</h2>` 처럼 제목 달고 순서대로 렌더링.
- 제출 전에 **시크릿 창**에서 링크가 로그인 없이 열리는지 확인 (public 설정).

### 🧪 Question 1 - Your First Component (1 point)

Create a component called `HelloMessage` that displays the text: "Hello from my component!"

Starter:

```jsx
import { createRoot } from "react-dom/client";

function MyApp() {
  return <div>{/* Render your HelloMessage component here */}</div>;
}

createRoot(document.getElementById("root")).render(<MyApp />);
```

▶ 웹 React 코드예요. [교수님 CodeSandbox 템플릿](https://codesandbox.io/p/sandbox/react-basic-3rqll4)에 붙여넣어 실행하세요.

**🇰🇷 한글 해설**

**참고 예제**: 1.1 Simple Components.
`HelloMessage` 라는 **대문자** 함수를 만들고 문장을 return. MyApp의 `<div>` 안에 `<HelloMessage />`.

### 🧪 Question 2 - Add a Button (1 point)

Add a button under your text in `HelloMessage` that logs "Button pressed!" to the console.

Hint:

```jsx
<button onClick={() => console.log("Button pressed!")}>Press me</button>
```

▶ 웹 React 코드예요. [교수님 CodeSandbox 템플릿](https://codesandbox.io/p/sandbox/react-basic-3rqll4)에 붙여넣어 실행하세요.

**🇰🇷 한글 해설**

**포인트**: HelloMessage가 이제 글자 + 버튼 두 개를 return 하니까 **부모 태그로 감싸야** 해요(1.1 Multiple Tags). `onClick`(웹 React는 onClick, RN은 onPress!)에 화살표 함수를 넣어요. 결과는 화면이 아니라 **콘솔**에서 확인.

### 🧪 Question 3 - Create a Reusable Button Component (1 point)

Create a component called `MyButton` that accepts:

- `buttonText` (string)
- `isEnabled` (boolean)

The button must display `buttonText` and be disabled when `isEnabled` is false.

Render it twice with different props.

**🇰🇷 한글 해설**

**참고 예제**: 1.1 Passing props의 최종형(구조 분해 + `disabled={!isEnabled}`) 거의 그대로예요. 두 번 렌더링할 때 하나는 `isEnabled={true}`, 하나는 `{false}`로 주면 회색 버튼이 보여요.

### 🧪 Question 4 - Display Dynamic Text (1 point)

Create a component called `WelcomeMessage` that accepts a `name` prop and displays:

```jsx
Welcome, NAME!
```

Render it with your own name.

**🇰🇷 한글 해설**

**포인트**: `Welcome, {name}!` 처럼 JSX 글자 중간에 `{ }`. 쉼표와 느낌표 위치까지 문제와 똑같이.

### 🧪 Question 5 - Using JavaScript Inside Components (1 point)

Create a component called `ProfileCard` that displays:

- A name
- A program
- A fun fact
- A button that does nothing yet (we'll use it later)

You must use JavaScript variables inside the component to store the values.

Requirements:

- Inside `ProfileCard`, create three variables:

```jsx
const name = "Your Name";
const program = "Your Program";
const funFact = "Something interesting about you";
```

- Display each variable inside a `<p>` element.
- Add a `<button>` at the bottom with the text "Learn More".
- Render `<ProfileCard />` inside `MyApp`.

**🇰🇷 한글 해설**

**참고 예제**: 1.1 JS-Expressions. 변수는 **컴포넌트 함수 안에** `const`로 선언(문제 조건). 각 값을 `<p>{name}</p>` 처럼 따로따로. 버튼은 아무 동작 없어도 됨.

### 🧪 Question 6 - Prop Validation (1 point)

Add PropTypes to two of your components:

- `MyButton`: `buttonText` is a required string, `isEnabled` is an optional boolean.
- `WelcomeMessage`: `name` is a required string.

Then prove the validation works:

- In `MyApp`, add one **commented-out** line that would break one of these rules, for example passing a number as `name`.
- Above it, add a comment containing the warning React printed in the console when you tried it.

Example of what this looks like:

```jsx
{
  /* Warning: Failed prop type: Invalid prop `name` of type `number` supplied to `WelcomeMessage`, expected `string`. */
}
{
  /* <WelcomeMessage name={42} /> */
}
```

Remember: PropTypes only warn in the console. The page still renders.

**🇰🇷 한글 해설**

**참고 예제**: 1.2 PropTypes Greeting.
- `buttonText: PropTypes.string.isRequired`, `isEnabled: PropTypes.bool` (optional이니 isRequired 없음)
- `name: PropTypes.string.isRequired`
- 일부러 틀린 줄을 **주석 처리**해서 넣고, 그 위에 콘솔에 실제로 뜬 경고 문장을 주석으로 복사. JSX 안 주석은 `{/* ... */}` 형태라는 것도 기억!


---

## ✅ Week 1 시험 대비 체크리스트

아래 질문에 영어 키워드로 답할 수 있으면 통과예요.

1. React는 framework인가 library인가? → **library**, UI(View)만 담당.
2. Declarative vs Imperative 차이? → **what** vs **how**.
3. Diffing과 Patching은? → 비교해서 차이 찾기 / 차이만 실제 화면에 반영.
4. JSX를 브라우저가 읽을 수 있게 바꿔 주는 것은? → **transpiler**.
5. 여러 태그를 return 하려면? → 부모 하나로 감싸거나 Fragment `<>...</>`.
6. `props.children` 은 무엇? → 여는 태그와 닫는 태그 **사이의 내용물**.
7. props 기본값 두 가지 방법? → `props.x || 기본값`, 구조 분해 `{ x = 기본값 }`.
8. `PropTypes.bool` vs `boolean`? → **bool**. 함수는 **func**.
9. `oneOf` vs `oneOfType`? → 값 목록 / 타입 목록.
10. PropTypes가 실패하면? → 콘솔 **경고만**, 렌더링은 계속. React 19에서는 무시.
11. RN에서 글자를 View에 바로 쓰면? → `Text strings must be rendered within a <Text> component.`
12. RN `Button` 글자는 어디에? → **`title`** prop.

**손으로 써 보기 과제**: 빈 Snack을 열고, 아래를 보지 않고 직접 써 보세요.
- `ProfileCard` 컴포넌트: props로 `name`, `program`을 받고(기본값 있음), `View`와 `Text` 2개, `Button` 1개를 보여 주기.
- 다 썼으면 아래 링크의 예시와 비교해 보세요.

```jsx
import { View, Text, Button } from "react-native";

function ProfileCard({ name = "Student", program = "CPA" }) {
  const funFact = "I love React Native";
  return (
    <View style={{ marginTop: 100, padding: 16 }}>
      <Text>Name: {name}</Text>
      <Text>Program: {program}</Text>
      <Text>Fun fact: {funFact}</Text>
      <Button title="Learn More" />
    </View>
  );
}

export default function App() {
  return <ProfileCard name="Paul" />;
}
```

▶ **[Snack에서 바로 실행하기](https://snack.expo.dev/?name=WEB530%20W1%20practice&platform=web&sdkVersion=54.0.0&code=import%20%7B%20View%2C%20Text%2C%20Button%20%7D%20from%20%22react-native%22%3B%0A%0Afunction%20ProfileCard%28%7B%20name%20%3D%20%22Student%22%2C%20program%20%3D%20%22CPA%22%20%7D%29%20%7B%0A%20%20const%20funFact%20%3D%20%22I%20love%20React%20Native%22%3B%0A%20%20return%20%28%0A%20%20%20%20%3CView%20style%3D%7B%7B%20marginTop%3A%20100%2C%20padding%3A%2016%20%7D%7D%3E%0A%20%20%20%20%20%20%3CText%3EName%3A%20%7Bname%7D%3C%2FText%3E%0A%20%20%20%20%20%20%3CText%3EProgram%3A%20%7Bprogram%7D%3C%2FText%3E%0A%20%20%20%20%20%20%3CText%3EFun%20fact%3A%20%7BfunFact%7D%3C%2FText%3E%0A%20%20%20%20%20%20%3CButton%20title%3D%22Learn%20More%22%20%2F%3E%0A%20%20%20%20%3C%2FView%3E%0A%20%20%29%3B%0A%7D%0A%0Aexport%20default%20function%20App%28%29%20%7B%0A%20%20return%20%3CProfileCard%20name%3D%22Paul%22%20%2F%3E%3B%0A%7D%0A)** (SDK 54, 필요한 패키지 자동 포함) <button class="snack-embed" type="button">👀 여기서 결과 보기</button>

다음 주(Week 2) 예고: 지금 만든 버튼은 눌러도 숫자가 안 바뀌어요. 화면이 "기억"하고 "다시 그리게" 하려면 **state(useState)** 가 필요해요.
