# Week 8. Expo 로컬 개발 + TypeScript + Expo Router: Snack을 졸업하고 진짜 프로젝트로

> 이 노트 읽는 법: **📘 원문**(영어 그대로) 바로 밑에 **🇰🇷 한글 해설**이 있어요. 이번 주는 **코스노트**와 교수님이 올려 준 **Week 8.1 TypeScript 강의 노트**를 다뤄요(랩은 없어요). Test 3(5~7주차) 직전 주라서 TypeScript 강의는 fetch + FlatList 코드와 이어서 보면 좋아요. 지금까지는 Snack 한 파일로 했지만, 이번 주부터는 **내 컴퓨터(VS Code)에 Expo 프로젝트를 만들고 폴더/파일을 나눠서** 만들어요. 그래서 Expo Router 코드는 Snack 링크 대신 "로컬 프로젝트에서 실행" 안내가 붙어 있어요. 대신 맨 끝 **손으로 써 보기**에 같은 구조(탭 + 탭 안 스택 + Jotai + id로 상세 화면)를 **Snack 한 파일**로 흉내 낸 연습 앱을 넣어 뒀어요.

> 🧭 **챕터 읽는 순서**: 챕터마다 맨 앞의 **🧭 먼저 한국어로** 상자(구성과 할 일) → 원문 출처 → 영어 원문 → ▶ Snack → 🇰🇷 한글 해설이에요. 코드 위에 **⌨️**가 있으면 직접 쳐 볼 코드이고, 없으면 읽기만 하거나 **👀 여기서 결과 보기**로 결과만 확인하면 돼요.

## 0. 이번 주 한눈에 보기

**Expo Router 파일 이름 규칙 4가지 (시험 단골)**

| 파일/폴더 이름 | 의미 | 예시 → 경로(route) |
| --- | --- | --- |
| `index.tsx` | 그 폴더의 첫 화면(홈) | `app/index.tsx` → `/`, `app/settings/index.tsx` → `/settings` |
| `_layout.tsx` | 같은 폴더 화면들을 감싸는 틀(Stack, Tabs, Slot) | `app/(tabs)/_layout.tsx` → 아래 탭 바 |
| `(이름)/` 괄호 폴더 | **경로에서 이름이 빠지는** 그룹 | `app/(auth)/login.tsx` → `/login` |
| `[id].tsx` 대괄호 | **동적** 경로, 값은 `useLocalSearchParams()` | `app/profile/[id].tsx` → `/profile/123` |

**React Navigation(Week 4)과 Expo Router 비교**

| 하고 싶은 것 | React Navigation (Week 4) | Expo Router (Week 8) |
| --- | --- | --- |
| 화면 등록 | `<Stack.Screen name="Details" component={Details} />` | **파일을 만들면 끝** (`app/details.tsx`) |
| 이동 | `navigation.navigate("Details", { id })` | `<Link href={`/products/${id}`}>` |
| 값 받기 | `route.params.id` | `const { id } = useLocalSearchParams()` |
| 헤더 제목 | `options={{ title }}` | `_layout.tsx` 안 `<Stack.Screen name="[id]" options={{ title }} />` |
| 전체 감싸기 | `<NavigationContainer>` | 필요 없음 (Router가 알아서) |

**TypeScript 최소 문법 (Week 8.1 강의 기준)**: `let n: number`, `string[]`, `interface Props { name: string; excited?: boolean }`, `useState<Product[]>([])`, `useState<string | null>(null)`, `type Status = "loading" | "ready" | "error"`, `(text: string) => void`. `?`는 "있어도 되고 없어도 됨(optional)", `|`는 "또는".

**TypeScript 타입을 꼭 적는 때**: 초기값이 `[]`나 `null`인 state, props(interface), API 데이터, 이름 붙인 핸들러의 매개변수. 나머지는 TS가 추론(inference)해요.

**함정 모음**
- 빨간 줄(타입 에러)이 있어도 **앱은 실행돼요**. Metro가 타입을 지우기 때문. 체커와 실행은 별개.
- `useState([])`는 `never[]`가 되어서 `item.id`에 에러. `useState<User[]>([])`로 고쳐요.
- `any`는 검사를 꺼 버려서 실행할 때 크래시가 나고, `unknown`은 `typeof`로 확인한 뒤에만 쓸 수 있어요.
- `json: User[]`는 서버를 검사하는 게 아니라 **약속**이에요. 그래서 `res.ok` 체크도 필요해요.
- 파일 이름을 바꾸면 경로도 바뀌어요. `two.tsx` → `settings.tsx` 로 바꿨으면 `_layout.tsx`의 `<Tabs.Screen name="two">`도 `"settings"`로 같이 바꿔야 해요.
- 상세 화면을 `(tabs)` **밖**에 두면 탭 바가 사라지고 헤더에 `product/[id]`가 그대로 보여요. 해결은 **탭 안에 Stack 넣기(Tab-to-Stack)**.
- 탭 안에 Stack을 넣으면 헤더가 두 개 생겨요 → 바깥 탭 쪽에 `headerShown: false`.
- `@/store/...`의 `@/`는 **프로젝트 루트**를 뜻하는 별칭(alias)이에요. Snack에는 없어요.
- `npx expo start --tunnel`에서 ngrok 에러가 나면 `npm install -g @expo/ngrok@4.1.0`.


**⌨️ 직접 쳐 볼 것 (이 순서대로)**

어디 칸을 누르면 그 코드로 바로 가요. 코드 위에도 ⌨️ 표시가 있어요.

| # | 어디 | 무엇을 |
| --- | --- | --- |
| 1 | [Example: Types](#practice-1) | App.tsx로 이름 바꾸고 number, string, boolean, number[], 객체 타입 변수 5개 출력 |
| 2 | [Example: Typed Props › Starter Code](#practice-2) | Stat 컴포넌트 3개짜리 시작 코드 (props 타입 없음) |
| 3 | [Example: Typed Props › Step 1 - Describe the Props](#practice-3) | interface StatProps { label: string; value: number } + ({ ... }: StatProps) |
| 4 | [Example: Typed Props › Step 2 - Add an Optional Prop](#practice-4) | unit?: string 추가 + 구조분해에서 unit = "" 기본값 |
| 5 | [Example: Typed Props › Step 3 - Break the Contract](#practice-5) | value="320" 문자열로 바꾸기, label 지우기 (일부러 에러 내기) |
| 6 | [Example: Typed State and Events › Starter Code](#practice-6) | 손님 목록 앱 시작 코드 (useState([]), useState(null) 상태) |
| 7 | [Example: Typed State and Events › Step 1 - Let Inference Do Its Job, Then Help It](#practice-7) | useState<string[]>([]) 로 고치기 |
| 8 | [Example: Typed State and Events › Step 2 - State That Can Be Null](#practice-8) | useState<string | null>(null) 로 고치기 |
| 9 | [Example: Typed State and Events › Step 3 - Type the Handlers](#practice-9) | handleChange(text: string) 함수 만들고 onChangeText에 연결, addGuest(): void |
| 10 | [Example: Typed API Data › Starter Code](#practice-10) | users fetch + FlatList 시작 코드 (타입 없음) |
| 11 | [Example: Typed API Data › Step 1 - Describe the Data](#practice-11) | interface User + useState<User[]>([]) + renderItem({ item }: { item: User }) |
| 12 | [Example: Typed API Data › Step 2 - Literal Types for Status](#practice-12) | type Status = "loading" | "ready" | "error" + res.ok 체크 + 상태별 early return |
| 13 | [Example: Typed API Data › Step 3 - The Payoff](#practice-13) | item.email을 item.emial로 일부러 틀리게 쓰기 |
| 14 | [Example: any and unknown](#practice-14) | let value: any = "hello"; value = 123; value.toUpperCase(); 를 붙여 보고 any를 unknown으로 바꾸기 |

나머지 👀 표시는 읽고 이해만 하면 돼요. 같은 개념을 위 예제에서 이미 타이핑해요.



## 목차

- 1. 📘 코스노트: Setup Tools & Dev Environment
- 2. 📘 코스노트: Introduction to Expo
- 3. 📘 코스노트: TypeScript for React Native
- 4. 💻 인클래스 예제: Week 8.1 - Notes and Examples
- 5. 📘 코스노트: Introduction to Expo Router
- ✅ Week 8 시험 대비 체크리스트
- ✍️ 손으로 써 보기: Mini Product Shop (Snack 한 파일 버전)


---

## 1. 📘 코스노트: Setup Tools & Dev Environment

<div class="sum" data-kind="type">

**🧭 먼저 한국어로** · ⌨️ Snack에서 직접 쳐 보기

Snack을 졸업하고 내 컴퓨터에 Expo 프로젝트를 만드는 준비 과정이에요. 명령어는 터미널에서 직접 따라 쳐 보세요.

**이 챕터 구성**

- 👀 **VS Code**: VS Code = 코드 편집기(워드가 문서 편집기인 것처럼).
- 👀 **VS Code › VS Code Extensions**: 확장 프로그램 7개 설치. 꼭 필요한 건 ESLint(실수 잡기), Prettier(자동 정리), Expo Tools.
- 👀 **VS Code › Setup formatting**: 저장할 때 자동으로 코드 정리되게 하기: Settings에서 Format On Save, Format On Paste 켜고, Default Formatter를 Prettier로.
- 👀 **Node.js and npm (Node Package Manager)**: Expo는 Node.js 위에서 돌아가요. LTS(장기 지원) 버전을 받으세요("Current"는 불안정할 수 있음).
- 👀 **Expo Go App**: 폰에 Expo Go 설치 → 컴퓨터에서 프로젝트를 실행하면 나오는 QR 코드를 찍으면 앱이 폰에 떠요.
- 👀 **Git**: `git --version`으로 확인하고 없으면 설치.
- 👀 **Git › Optional: GitHub Copilot**: 선택 사항. 학생 인증하면 무료로 쓸 수 있는 AI 코딩 도우미예요.

</div>

> 원문 출처: https://seneca-ictoer.github.io/WEB530/Z-Guides/tool-dev-setup

This guide takes you through the setup of the tools needed for developing apps with React Native and Expo.

**🇰🇷 한글 해설**

로컬 개발을 시작하기 전에 설치할 도구 목록이에요. 시험에 나올 내용은 거의 없지만, **이게 안 되면 Week 8부터 아무것도 못 해요**.

### 📘 VS Code

Visual Studio Code (also called VS Code) is a code editor. The application enables you to read, write, and edit code, much like how Word is used for reading, writing, and editing documents. VS Code is, if not the most used, then one of the most used code editors in web development.

* Download and install VS Code: <https://code.visualstudio.com/download>

**🇰🇷 한글 해설**

**VS Code** = 코드 편집기(워드가 문서 편집기인 것처럼). 웹 개발에서 가장 많이 쓰는 편집기예요.

#### 📘 VS Code Extensions

* In VS Code, navigate to Extensions:

![VS Code Extensions](https://seneca-ictoer.github.io/WEB530/assets/images/vs-code-extensions-5bf19c42679c76568ba2c18ca06fb23f.png)

* Add the following extensions by entering part of the name in the search box, and clicking “Install” (be sure to check that it is the correct name and publisher):
  + [ES7+ React/Redux/React-Native snippets](https://marketplace.visualstudio.com/items?itemName=dsznajder.es7-react-js-snippets) (dsznajder)
  + [ESLint](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint) (Microsoft)
  + [Prettier - Code formatter](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode) (prettier.io)
  + [Expo Tools](https://marketplace.visualstudio.com/items?itemName=expo.vscode-expo-tools) (Expo)
  + [Git Graph](https://marketplace.visualstudio.com/items?itemName=mhutchie.git-graph) (mhutchie)
  + [Auto Rename Tag](https://marketplace.visualstudio.com/items?itemName=formulahendry.auto-rename-tag) (Jun Han)
  + [Auto Close Tag](https://marketplace.visualstudio.com/items?itemName=formulahendry.auto-close-tag) (Jun Han)

**🇰🇷 한글 해설**

확장 프로그램 7개 설치. 꼭 필요한 건 **ESLint**(실수 잡기), **Prettier**(자동 정리), **Expo Tools**. 이름과 **만든 회사(publisher)** 를 꼭 확인하고 설치하세요(가짜 확장이 있어요).

#### 📘 Setup formatting

It's nice when your code looks neat, has the correct indentation, spacing, and line breaks. It makes the code easier to read and manage, and it makes it a lot easier to collaborate with others on a shared codebase. We can set up VS Code to help us format the code automatically when we save.

* Open the settings dialog, go to File -> Preferences -> Settings.
* Go to Text Editor -> Formatting. Enable “Format On Paste” and “Format On Save”. Hint: You can also search for “Format On” at the top of the window.

![VS Code Formatting Settings](https://seneca-ictoer.github.io/WEB530/assets/images/vs-code-formatting-64fd2b9d92b386dddd13f2e2f885a2a2.png)

* Search “Default Formatter” and select “Prettier - Code formatter”:

![VS Code Default Formatter](https://seneca-ictoer.github.io/WEB530/assets/images/vs-code-default-formatter-28c9e11f339e64866d41dc7888639c03.png)

* Close Visual Studio Code.

**🇰🇷 한글 해설**

저장할 때 자동으로 코드 정리되게 하기: Settings에서 **Format On Save**, **Format On Paste** 켜고, **Default Formatter**를 **Prettier**로.

### 📘 Node.js and npm (Node Package Manager)

*React Native and Expo require Node.js to be installed.*

* Install Node.js using the prebuilt installer. You can download it from the official website: [https://nodejs.org/en/download](https://nodejs.org/en/download/)

  + Download the latest stable (LTS) version of Node.js. Do not use the “Current Version” as it may contain features that are considered unstable. Ensure you choose the correct operating system and bitness.

  ![NodeJS Installer](https://seneca-ictoer.github.io/WEB530/assets/images/nodejs-install-1ce431a5cc441460f6eb69f6d64c4d0f.png)
* Follow the installation instructions provided for your operating system. It is a good idea to reboot your system after the installation has completed.
* Once installed, you will have both Node.js and npm available in your command line/terminal interface.
* Test the successful installation by typing the following commands in the terminal or command prompt on your computer:

*You can also use the integrated terminal in VS Code. In VS Code, open the Terminal window by clicking the Terminal menu* -> *New Terminal.*

```jsx
node --version
npm --version
```

**🇰🇷 한글 해설**

Expo는 **Node.js** 위에서 돌아가요. **LTS(장기 지원) 버전**을 받으세요("Current"는 불안정할 수 있음). 설치 후 터미널에서 `node --version`, `npm --version`으로 확인. **npm** = 패키지(라이브러리) 설치 도구. 예: `npm install jotai`.

### 📘 Expo Go App

* Install the [Expo Go](https://docs.expo.dev/get-started/set-up-your-environment/) app: To test your app on your mobile device, you'll need to install the Expo app. You can download it from the App Store (iOS) or Google Play (Android).
* Once you have the Expo app installed, you can scan the QR code in the Expo developer tools to load your app onto your mobile device (once you are running an Expo project).

Read more here: <https://docs.expo.dev/get-started/set-up-your-environment/>

**🇰🇷 한글 해설**

폰에 **Expo Go** 설치 → 컴퓨터에서 프로젝트를 실행하면 나오는 **QR 코드를 찍으면** 앱이 폰에 떠요. Snack에서 My Device로 쓰던 그 앱이에요.

### 📘 Git

Check if you have Git installed by running the following command in a terminal or command prompt (Beware: If you've only used GitHub Desktop, you won't have it available on the command line):

```jsx
git --version
```

If the response is something other than `git version 2.x.x` then you must install Git:

a) If you're on a Mac and already running [Homebrew](https://brew.sh/), you can install it with:

```jsx
brew install git
```

…or the equivalent command if you're already using a package manager on Windows or Linux.

b) Otherwise you can download and install Git [from the official website](https://git-scm.com/).

Then configure your [name](https://docs.github.com/en/get-started/getting-started-with-git/setting-your-username-in-git#setting-your-git-username-for-every-repository-on-your-computer) and [email](https://docs.github.com/en/account-and-profile/setting-up-and-managing-your-personal-account-on-github/managing-email-preferences/setting-your-commit-email-address#setting-your-email-address-for-every-repository-on-your-computer), which will be “stamped” into any commits you make with these terminal commands:

```jsx
git config --global user.name "YOUR_NAME"
git config --global user.email "YOUR_EMAIL"
```

**🇰🇷 한글 해설**

`git --version`으로 확인하고 없으면 설치. 그다음 이름과 이메일을 한 번 설정하면 커밋할 때마다 "도장"처럼 찍혀요.

#### 📘 Optional: GitHub Copilot

If you don’t already have it, it is highly recommended to sign up for GitHub Copilot, which is GitHub’s “AI pair programmer” that is super useful when working with code. It is well integrated into VS Code and can be a very valuable companion when navigating a foreign codebase and a framework that you are actively learning to use, such as Expo and React Native.

1. You can get access for free through [GitHub Education](https://github.com/edu/students) if you sign in and verify your status as a student (please note that the approval process can take a few days).
2. Once you’ve signed up, follow their instructions for activating [GitHub Copilot](https://github.com/features/copilot/) on your account.
3. And then install [the required extension in VS Code](https://docs.github.com/en/copilot/using-github-copilot/using-github-copilot-code-suggestions-in-your-editor?tool=vscode). Follow that guide to experiment with the various ways to autocomplete code suggestions and to use the integrated chat function. We’ll demo it further during the course.

✋🏻 And that's it! You're now ready to start developing React Native apps with Expo.

**🇰🇷 한글 해설**

선택 사항. 학생 인증하면 무료로 쓸 수 있는 AI 코딩 도우미예요.


---

## 2. 📘 코스노트: Introduction to Expo

<div class="sum" data-kind="type">

**🧭 먼저 한국어로** · ⌨️ Snack에서 직접 쳐 보기

npx create-expo-app으로 프로젝트를 만들고 Expo Go로 폰에서 실행하는 방법이에요. 직접 따라 해 보세요.

**이 챕터 구성**

- 👀 **What is Expo?**: Expo = React Native 위에 만든 오픈소스 프레임워크 + 도구 모음.
- 👀 **What is Expo? › Core Benefits**: 장점 4가지 (시험에 "Expo를 쓰는 이유"로 나올 수 있어요)
- 👀 **Expo vs. Bare React Native**: Bare(순수) React Native는 Android 프로젝트(Java/Kotlin)와 iOS 프로젝트(Swift/Obj-C)를 따로 관리해야 하고 Android Studio, Xcode 같은 무거운 프로그램이 필요해요.
- 👀 **Moving Beyond Expo Snack**: Snack은 연습장으로는 최고지만 실제 앱에는 한계가 있어요.
- 👀 **How Expo Works: The Managed Workflow**: 이 수업은 Managed Workflow를 써요.
- 👀 **How Expo Works: The Managed Workflow › The Magic of Expo Go**: `npx expo start`를 하면 컴퓨터가 앱 전체를 빌드하는 게 아니라 Metro라는 번들러를 켜요.
- 👀 **Creating a New Expo Project**: npx create-expo-app myapp --template blank # 1.
- 👀 **Running Your New App**: 폰에서 Expo Go로 QR 찍기(추천). 아니면 iOS 시뮬레이터(Mac만) 또는 Android 에뮬레이터.
- 👀 **Modifying the App**: App.js를 고치면 돼요(Snack과 똑같이).

</div>

> 원문 출처: https://seneca-ictoer.github.io/WEB530/H-Expo/expo

**🇰🇷 한글 해설**

**Expo**가 뭔지, 그리고 이제 Snack을 떠나 **내 컴퓨터에서** 개발하는 방법.

### 📘 What is Expo?

Expo is an open-source framework and platform built on top of **React Native**. It provides a robust set of tools, libraries, and services that radically simplify mobile app development by abstracting away the complex, platform-specific ecosystems of iOS and Android.

By leveraging Expo, you can build truly native cross-platform mobile applications using only **JavaScript or TypeScript**.

**🇰🇷 한글 해설**

**Expo** = React Native **위에** 만든 오픈소스 프레임워크 + 도구 모음. iOS/Android 각각의 복잡한 설정을 대신 처리해 줘서 **JavaScript나 TypeScript만으로** 진짜 네이티브 앱을 만들 수 있어요.

#### 📘 Core Benefits

* **Zero Native Configuration:** You don't need to touch Java, Objective-C, Swift, or complex build Gradle files to get started.
* **Unified API:** Access native device hardware (like the camera, biometrics, location, and sensors) through a single, consistent JavaScript API.
* **Instant Over-the-Air (OTA) Updates:** Publish updates directly to your users instantly, bypassing the lengthy App Store or Google Play review processes for minor changes and bug fixes.
* **Universal Development:** Write code once and run it seamlessly on Android, iOS, and even the Web.

**🇰🇷 한글 해설**

**장점 4가지** (시험에 "Expo를 쓰는 이유"로 나올 수 있어요)
1. **Zero Native Configuration**: Java, Swift, Gradle 같은 네이티브 설정 안 건드려도 됨.
2. **Unified API**: 카메라, 위치, 센서 등을 **하나의 JS API**로 (Week 7 `expo-location`이 그 예).
3. **OTA(Over-the-Air) 업데이트**: 작은 수정은 앱스토어 심사 없이 바로 사용자에게 배포.
4. **Universal**: 한 번 짜서 Android, iOS, Web 모두.

### 📘 Expo vs. Bare React Native

When building a mobile app with standard ("bare") React Native, you are responsible for managing two entirely separate native projects: an Android project (built with Java/Kotlin) and an iOS project (built with Swift/Objective-C). This requires installing heavy software like Android Studio and Xcode, configuring environment variables, and dealing with mismatched build tools.

Expo eliminates this friction by wrapping around React Native.

| Feature | Bare React Native | Expo (Managed Workflow) |
| --- | --- | --- |
| **Language Requirements** | JavaScript + Swift/Kotlin (for native modules) | Strictly JavaScript / TypeScript |
| **Development Machine** | Requires macOS for iOS builds; Windows/Linux/macOS for Android | Any OS (Windows, Mac, Linux) can build for both platforms |
| **Setup Overhead** | High (Xcode, Android Studio, SDKs, Emulators) | Low (Node.js, VS Code, and a mobile device) |
| **Native Code Access** | Direct access to modify native directories | Handled via Expo Config Plugins (no direct native editing required) |

**🇰🇷 한글 해설**

**Bare(순수) React Native**는 Android 프로젝트(Java/Kotlin)와 iOS 프로젝트(Swift/Obj-C)를 **따로** 관리해야 하고 Android Studio, Xcode 같은 무거운 프로그램이 필요해요. Expo는 이걸 감싸서 없애 줘요.

표 핵심: Bare는 iOS 빌드에 **Mac 필수**, Expo(Managed)는 **어떤 OS에서도** 두 플랫폼 빌드 가능. 네이티브 코드를 직접 고치는 대신 **Config Plugins**로 처리.

### 📘 Moving Beyond Expo Snack

Up until this point, you have been using **Expo Snack** to write and test code directly in your web browser. Snack is an amazing playground for prototyping, but it has concrete limitations when building real-world production applications.

Graduating from Snack to a local development workflow unlocks the capabilities required for professional software engineering:

* **Complete File Control:** Instead of working in a single browser tab, your project lives entirely on your machine. You can structure complex directories, manage assets locally, and use Git version control.
* **Advanced Code Editing:** You get the full power of VS Code, including real-time linting, code snippets, local extensions, and robust debugging tools.
* **Unlimited Ecosystem Access:** Snack only supports a curated subset of npm packages. Local development allows you to install *any* third-party package or library available in the Node ecosystem.
* **Offline Development:** You don't need an active internet connection to compile and test code on your local network.

💡 **The good news:** Your React Native code does not change! Writing a component locally in VS Code uses the exact same syntax, hooks, and layout logic you learned inside Expo Snack.

**🇰🇷 한글 해설**

Snack은 연습장으로는 최고지만 실제 앱에는 한계가 있어요. 로컬로 옮기면:
- **파일 완전 제어**: 폴더 구조, 에셋, **Git** 사용.
- **VS Code의 힘**: 린트, 스니펫, 디버깅.
- **npm 패키지 무제한**: Snack은 일부 패키지만 지원.
- **오프라인 개발** 가능.

💡 **좋은 소식**: 코드 문법은 **그대로**예요. Snack에서 배운 hooks, 컴포넌트, 스타일이 똑같이 동작해요.

### 📘 How Expo Works: The Managed Workflow

In this course, we utilize the **Managed Workflow**. Under this model, Expo handles the native iOS and Android compilation under the hood. You only deal with the JavaScript/TypeScript layer.

**🇰🇷 한글 해설**

이 수업은 **Managed Workflow**를 써요. 네이티브 컴파일은 Expo가 뒤에서 하고, 우리는 **JS/TS 층만** 다뤄요.

#### 📘 The Magic of Expo Go

The fastest way to develop with Expo is using **Expo Go**, the same client application you used to preview your Snacks on a physical phone.

When you run your development server locally on your computer using the command line interface (CLI), Expo doesn't compile a massive binary file and push it to your phone. Instead, it starts a local bundler called **Metro** that bundles your JavaScript files.

The Expo Go app on your phone opens this bundle via a local network connection (or a secure tunnel) and renders it instantly using your device's native rendering engines.

💡 **Think of Expo Go like a web browser for mobile apps:** Your local computer acts as the web server hosting your project files, and Expo Go acts as the mobile browser rendering native components dynamically.

**🇰🇷 한글 해설**

`npx expo start`를 하면 컴퓨터가 앱 전체를 빌드하는 게 아니라 **Metro**라는 **번들러**를 켜요. Metro가 JS 파일들을 하나로 묶고(bundle), 폰의 Expo Go가 네트워크(또는 터널)로 그 번들을 받아 **네이티브 화면으로 그려요**.

💡 비유: **컴퓨터 = 웹 서버, Expo Go = 모바일용 웹 브라우저**. 그래서 저장하면 폰 화면이 바로 바뀌어요.

### 📘 Creating a New Expo Project

If you haven't already done so, please follow the steps outlined in [Setup Tools & Dev Environment](https://seneca-ictoer.github.io/WEB530/Z-Guides/tool-dev-setup).

1. Start VS Code.
2. Choose `File`, `Open Folder...`. It is recommended you choose an empty folder however you will create a new folder for your application in the next step.
3. Type `npx create-expo-app myapp --template blank` (where `myapp` refers to the name of the application folder you want to create).

* `Ok to proceed? (y)` - You may be asked to install packages, press `y` or `ENTER` to install the packages and proceed.
* `Select an Expo SDK version` - Choose `For learning with Expo Go (SDK 54)`.
* The installation may take a minute or two to complete.

4. Move into the project folder: `cd myapp`.
5. Start the development server: `npx expo start --tunnel`.

* If asked, install `@expo/ngrok`.

⚠️ It is not uncommon to receive an error like:
`CommandError: Please install @expo/ngrok@^4.1.0 and try again`

💡If you receive the above message, try installing `ngrok` manually:
`npm install -g @expo/ngrok@4.1.0`
`npm install --save-dev @expo/ngrok@^4.1.0`

**🇰🇷 한글 해설**

**명령어 3개만 기억** (실습 필수)
```bash
npx create-expo-app myapp --template blank   # 1. 새 프로젝트 (SDK 54 선택)
cd myapp                                       # 2. 폴더로 이동
npx expo start --tunnel                        # 3. 개발 서버 실행 (QR 코드 나옴)
```
- `--template blank`: 빈 템플릿(App.js 하나). Expo Router 버전은 아래에서 `--template tabs`.
- `--tunnel`: 학교 Wi-Fi처럼 폰과 컴퓨터가 같은 네트워크로 바로 연결이 안 될 때 **인터넷 터널**로 연결.
- **ngrok 에러**가 나면 원문에 있는 두 줄로 직접 설치.

### 📘 Running Your New App

You can run your app in several ways:

* On your phone (recommended)
  + Install Expo Go from the App Store or Google Play
  + Scan the QR code from Expo Dev Tools
  + Your app loads instantly

On a simulator/emulator

* iOS Simulator (macOS only)
* Android Emulator (optional)

💡 If you receive an error that Expo Go needs to be updated on your device,
it may be that the version available in the store is outdated. You can manually
install the latest version by going to (<https://expo.dev/go>).

**🇰🇷 한글 해설**

폰에서 **Expo Go**로 QR 찍기(추천). 아니면 iOS 시뮬레이터(Mac만) 또는 Android 에뮬레이터.
"Expo Go를 업데이트하라"는 에러가 나면 스토어 버전이 늦은 거라 https://expo.dev/go 에서 최신 버전을 직접 설치.

### 📘 Modifying the App

You can make changes to App.js (just like when working with Snack). When creating custom components, add them to a subfolder called `/components`.

**🇰🇷 한글 해설**

**App.js**를 고치면 돼요(Snack과 똑같이). 직접 만든 컴포넌트는 **`/components`** 폴더에 따로 넣는 게 규칙이에요.


---

## 3. 📘 코스노트: TypeScript for React Native

<div class="sum" data-kind="read">

**🧭 먼저 한국어로** · 👀 읽고 이해하기 (타이핑 안 해도 돼요)

TypeScript 기초(타입, interface, props 타입)예요. 읽고 이해하면서, 다음 Expo Router 예제에서 직접 써 봐요.

**이 챕터 구성**

- 👀 **Why Use TypeScript in React Native?**: 실행 전에 에러를 잡아요 (오타, 잘못된 값).
- 👀 **Introduction to TypeScript Syntax**: TS가 처음이라면 알아야 할 기초 문법 3가지(변수, 배열, 객체)예요.
- 👀 **Introduction to TypeScript Syntax › Variables and Types**: `이름: 타입 = 값`. 기본 타입 3개: `number`, `string`, `boolean`.
- 👀 **Introduction to TypeScript Syntax › Arrays**: 배열은 `타입[]`. `number[]` = 숫자만 들어가는 배열.
- 👀 **Introduction to TypeScript Syntax › Objects**: 객체는 `{ 속성: 타입; 속성: 타입 }` 으로 모양(shape) 을 적어요.
- 👀 **Using TypeScript in React Native Components › Functional Component Without Props**: props가 없으면 JS와 똑같아요. 타입을 적을 게 없으니까요.
- 👀 **Using TypeScript in React Native Components › Typing Component Props with Interfaces**: `interface GreetingProps { name: string; excited?: boolean; }`: props의 설계도.
- 👀 **Typing State with useState**: `useState<number>(0)`: 꺾쇠 `<>` 안에 state 타입.
- 👀 **Typing Event Handlers**: `(): void`: 아무것도 반환하지 않는 함수.
- 👀 **Combining Props, State, and Events**: `CounterProps`로 `start`를 숫자로 정하고, `useState(start)`는 숫자로 추론, 버튼은 `prev => prev + 1`(Week 2 함수형 업데이트).
- 👀 **Typing API Data (Beginner Level)**: fetch로 받는 데이터(Week 5)의 모양을 interface로 정하고, `useState<Post[]>([])`로 "Post들의 배열"이라고 알려 줘요.
- 👀 **When You Don’t Need to Use Types**: 생략: 타입이 뻔할 때(`useState(0)`), 빠르게 실험할 때, 단순 UI.
- 👀 **Summary**: TS = 안전 + 명확. props는 interface, state는 필요할 때 `<타입>`.

</div>

> 원문 출처: https://seneca-ictoer.github.io/WEB530/Z-Guides/typescript

TypeScript is a powerful extension of JavaScript that adds static typing. This means you can define the types of variables, function parameters, and component props ahead of time. This helps catch errors early, improve code readability, and make your React Native apps more robust and maintainable.

**🇰🇷 한글 해설**

**TypeScript(TS)** = JavaScript + **타입(type)**. 변수, 함수 매개변수, props가 **어떤 종류의 값인지 미리 적어 두는** 언어예요. Expo Router 템플릿이 전부 `.tsx`라서 이번 주에 같이 봐요.
- `.ts` = 타입이 있는 JS 파일, `.tsx` = 타입 + JSX가 있는 파일(컴포넌트).

### 📘 Why Use TypeScript in React Native?

TypeScript offers several benefits that make it a valuable tool for React Native development:

* Catch errors early: TypeScript checks your code for type errors before you even run your app, reducing runtime bugs.
* Better editor support: Tools like VS Code and Snack provide improved auto-completion and IntelliSense with TypeScript.
* Clearer components: By explicitly defining the types of props, your components become easier to understand and use.
* Scalability: TypeScript helps teams work together more effectively by making data structures and interfaces explicit.

React Native fully supports TypeScript, and you can write your components in `.tsx` files, which are just like `.js` files but with type annotations.

**🇰🇷 한글 해설**

**왜 쓰나 4가지**
1. **실행 전에 에러를 잡아요** (오타, 잘못된 값).
2. **자동완성이 좋아져요** (VS Code가 props 이름을 알려 줌).
3. **컴포넌트가 읽기 쉬워져요** (어떤 props가 필요한지 한눈에).
4. **팀 작업**에 좋아요 (데이터 모양이 명확).

### 📘 Introduction to TypeScript Syntax

If you are new to TypeScript, here are some foundational concepts and syntax you should know.

**🇰🇷 한글 해설**

TS가 처음이라면 알아야 할 기초 문법 3가지(변수, 배열, 객체)예요.

#### 📘 Variables and Types

In TypeScript, you declare variables with explicit types to ensure they hold the expected kind of data.

```jsx
let count: number = 0; // number type
let name: string = 'Nicholas'; // string type
let isActive: boolean = true; // boolean type
```

**🇰🇷 한글 해설**

`이름: 타입 = 값`. 기본 타입 3개: `number`, `string`, `boolean`.
`count = "hello"` 처럼 다른 타입을 넣으면 **빨간 줄**이 생겨요.

#### 📘 Arrays

Arrays can be typed to hold only specific types of elements.

```jsx
let scores: number[] = [10, 20, 30];
let names: string[] = ['Ava', 'Ben', 'Chris'];
```

**🇰🇷 한글 해설**

배열은 `타입[]`. `number[]` = 숫자만 들어가는 배열.

#### 📘 Objects

You can define the shape of objects by specifying the types of their properties.

```jsx
let user: { name: string; age: number } = {
  name: 'Ava',
  age: 21,
};
```

**🇰🇷 한글 해설**

객체는 `{ 속성: 타입; 속성: 타입 }` 으로 **모양(shape)** 을 적어요. 이 모양에 이름을 붙인 게 아래의 **interface**예요.

### 📘 Using TypeScript in React Native Components

React Native components are typically written in `.tsx` files. These files allow you to add type annotations to your components and props.

**🇰🇷 한글 해설**

컴포넌트는 `.tsx` 파일에 써요.

#### 📘 Functional Component Without Props

Here is a simple example of a functional component written in TypeScript:

```jsx
import React from 'react';
import { View, Text } from 'react-native';

export default function MyBox() {
  return (
    <View style={{ padding: 20, backgroundColor: 'lightblue' }}>
      <Text>Hello from TypeScript!</Text>
    </View>
  );
}
```

▶ **[Snack에서 바로 실행하기](https://snack.expo.dev/?name=WEB530%20W8%20Using%20TypeScript%20in%20React%20Native%20Components%20-%20Func&platform=web&sdkVersion=54.0.0&code=import%20React%20from%20%27react%27%3B%0Aimport%20%7B%20View%2C%20Text%20%7D%20from%20%27react-native%27%3B%0A%0Aexport%20default%20function%20MyBox%28%29%20%7B%0A%20%20return%20%28%0A%20%20%20%20%3CView%20style%3D%7B%7B%20padding%3A%2020%2C%20backgroundColor%3A%20%27lightblue%27%20%7D%7D%3E%0A%20%20%20%20%20%20%3CText%3EHello%20from%20TypeScript%21%3C%2FText%3E%0A%20%20%20%20%3C%2FView%3E%0A%20%20%29%3B%0A%7D%0A)** (SDK 54, 필요한 패키지 자동 포함) <button class="snack-embed" type="button">👀 여기서 결과 보기</button>



**🇰🇷 한글 해설**

props가 없으면 **JS와 똑같아요**. 타입을 적을 게 없으니까요.

#### 📘 Typing Component Props with Interfaces

Interfaces in TypeScript let you define the expected structure of props passed to components.

Example: Component with Typed Props

```jsx
import { View, Text } from 'react-native';

interface GreetingProps {
  name: string; // required prop
  excited?: boolean; // optional prop
}

function Greeting({ name, excited }: GreetingProps) {
  return (
    <Text>
      Hello {name}
      {excited ? '!!!' : '.'}
    </Text>
  );
}

// Using the component
export default function App() {
  return (
    <View style={{ padding: 20 }}>
      <Greeting name="Ava" />
      <Greeting name="Ben" excited={true} />
    </View>
  );
}
```

▶ **[Snack에서 바로 실행하기](https://snack.expo.dev/?name=WEB530%20W8%20Using%20TypeScript%20in%20React%20Native%20Components%20-%20Typi&platform=web&sdkVersion=54.0.0&code=import%20%7B%20View%2C%20Text%20%7D%20from%20%27react-native%27%3B%0A%0Ainterface%20GreetingProps%20%7B%0A%20%20name%3A%20string%3B%20%2F%2F%20required%20prop%0A%20%20excited%3F%3A%20boolean%3B%20%2F%2F%20optional%20prop%0A%7D%0A%0Afunction%20Greeting%28%7B%20name%2C%20excited%20%7D%3A%20GreetingProps%29%20%7B%0A%20%20return%20%28%0A%20%20%20%20%3CText%3E%0A%20%20%20%20%20%20Hello%20%7Bname%7D%0A%20%20%20%20%20%20%7Bexcited%20%3F%20%27%21%21%21%27%20%3A%20%27.%27%7D%0A%20%20%20%20%3C%2FText%3E%0A%20%20%29%3B%0A%7D%0A%0A%2F%2F%20Using%20the%20component%0Aexport%20default%20function%20App%28%29%20%7B%0A%20%20return%20%28%0A%20%20%20%20%3CView%20style%3D%7B%7B%20padding%3A%2020%20%7D%7D%3E%0A%20%20%20%20%20%20%3CGreeting%20name%3D%22Ava%22%20%2F%3E%0A%20%20%20%20%20%20%3CGreeting%20name%3D%22Ben%22%20excited%3D%7Btrue%7D%20%2F%3E%0A%20%20%20%20%3C%2FView%3E%0A%20%20%29%3B%0A%7D%0A)** (SDK 54, 필요한 패키지 자동 포함) <button class="snack-embed" type="button">👀 여기서 결과 보기</button>



If you remove `name="Ava"`, an editor that checks types (such as VS Code) marks the `<Greeting>` as an error, because a required prop is missing.

**🇰🇷 한글 해설**

**제일 중요한 부분 (시험 포인트)**
- `interface GreetingProps { name: string; excited?: boolean; }`: props의 설계도.
- `name`은 **필수**, `excited?`의 **`?`는 선택(optional)**.
- `function Greeting({ name, excited }: GreetingProps)`: 구조 분해한 props 뒤에 `: 인터페이스이름`.
- `<Greeting />` 처럼 `name`을 빼먹으면 VS Code가 **에러로 표시**해요. Week 1에서 배운 **PropTypes**가 하던 일을 TS가 **실행 전에** 해 주는 거예요.

💡 Snack의 `App.js`에서도 interface나 `: string` 같은 TS 문법이 실행돼요(위 링크로 확인 완료). 단, `useState<number>(0)`처럼 **함수 호출에 꺾쇠 `<>`를 붙이는 문법**이나 `값 as 타입` 문법은 Snack `App.js`에서 에러가 나요(직접 확인함). 로컬 `.tsx` 파일에서는 괜찮아요.

### 📘 Typing State with useState

React hooks like `useState` can also be typed to specify the type of state variables.

Example: Typed State

```jsx
import React, { useState } from 'react';

const [count, setCount] = useState<number>(0);
```

TypeScript can often infer the type automatically:

```jsx
const [name, setName] = useState('Ava'); // inferred as string
```

**🇰🇷 한글 해설**

`useState<number>(0)`: 꺾쇠 `<>` 안에 state 타입. 하지만 `useState(0)`처럼 **초기값으로 타입이 뻔하면 TS가 알아서 추론(infer)** 해요. 빈 배열 `[]`처럼 추론이 안 될 때 꼭 적어요 → 아래 `useState<Post[]>([])`.

### 📘 Typing Event Handlers

You can type event handler functions to ensure they receive the correct parameters.

Example: Button Press Handler

```jsx
const handlePress = (): void => {
  console.log('Pressed!');
};

<Button title="Press me" onPress={handlePress} />;
```

Example: TextInput Change Handler

```jsx
const handleChange = (text: string) => {
  setName(text);
};

<TextInput value={name} onChangeText={handleChange} />;
```

**🇰🇷 한글 해설**

- `(): void`: 아무것도 **반환하지 않는** 함수.
- `onChangeText`는 **문자열**을 넘겨주니까 `(text: string) => ...`.

### 📘 Combining Props, State, and Events

Here is a small but complete example that combines typed props, state, and event handlers.

```jsx
import React, { useState } from 'react';
import { View, Text, Button } from 'react-native';

interface CounterProps {
  start: number;
}

function Counter({ start }: CounterProps) {
  const [count, setCount] = useState(start);

  return (
    <View style={{ padding: 20 }}>
      <Text style={{ fontSize: 24 }}>Count: {count}</Text>
      <Button title="+1" onPress={() => setCount((prev) => prev + 1)} />
    </View>
  );
}

export default function App() {
  return <Counter start={5} />;
}
```

▶ **[Snack에서 바로 실행하기](https://snack.expo.dev/?name=WEB530%20W8%20Combining%20Props%2C%20State%2C%20and%20Events&platform=web&sdkVersion=54.0.0&code=import%20React%2C%20%7B%20useState%20%7D%20from%20%27react%27%3B%0Aimport%20%7B%20View%2C%20Text%2C%20Button%20%7D%20from%20%27react-native%27%3B%0A%0Ainterface%20CounterProps%20%7B%0A%20%20start%3A%20number%3B%0A%7D%0A%0Afunction%20Counter%28%7B%20start%20%7D%3A%20CounterProps%29%20%7B%0A%20%20const%20%5Bcount%2C%20setCount%5D%20%3D%20useState%28start%29%3B%0A%0A%20%20return%20%28%0A%20%20%20%20%3CView%20style%3D%7B%7B%20padding%3A%2020%20%7D%7D%3E%0A%20%20%20%20%20%20%3CText%20style%3D%7B%7B%20fontSize%3A%2024%20%7D%7D%3ECount%3A%20%7Bcount%7D%3C%2FText%3E%0A%20%20%20%20%20%20%3CButton%20title%3D%22%2B1%22%20onPress%3D%7B%28%29%20%3D%3E%20setCount%28%28prev%29%20%3D%3E%20prev%20%2B%201%29%7D%20%2F%3E%0A%20%20%20%20%3C%2FView%3E%0A%20%20%29%3B%0A%7D%0A%0Aexport%20default%20function%20App%28%29%20%7B%0A%20%20return%20%3CCounter%20start%3D%7B5%7D%20%2F%3E%3B%0A%7D%0A)** (SDK 54, 필요한 패키지 자동 포함) <button class="snack-embed" type="button">👀 여기서 결과 보기</button>



**🇰🇷 한글 해설**

**코드 해설**: `CounterProps`로 `start`를 숫자로 정하고, `useState(start)`는 숫자로 추론, 버튼은 `prev => prev + 1`(Week 2 함수형 업데이트). props, state, 이벤트가 한 번에 다 들어간 예제.

### 📘 Typing API Data (Beginner Level)

When fetching data from an API, it is helpful to define interfaces for the expected response data.

```jsx
interface Post {
  id: number;
  title: string;
  body: string;
}

const [posts, setPosts] = useState<Post[]>([]);
```

**🇰🇷 한글 해설**

fetch로 받는 데이터(Week 5)의 **모양을 interface로** 정하고, `useState<Post[]>([])`로 "Post들의 배열"이라고 알려 줘요. 그러면 `item.title` 같은 걸 쓸 때 자동완성이 되고 오타가 잡혀요.

### 📘 When You Don’t Need to Use Types

While TypeScript is very useful, you don’t need to type everything. Here are some guidelines:

**Skip typing when:**

* The type is obvious (e.g., useState(0))
* You are prototyping quickly
* You are writing simple UI components

**Use types when:**

* Passing props to components
* Handling API data
* Managing complex state

**🇰🇷 한글 해설**

**다 적을 필요 없어요.**
- 생략: 타입이 뻔할 때(`useState(0)`), 빠르게 실험할 때, 단순 UI.
- 꼭 적기: **props**, **API 데이터**, **복잡한 state**.

### 📘 Summary

* TypeScript adds safety and clarity to React Native apps.
* Use interfaces to type props.
* Use typed state when needed.
* TypeScript works naturally with Snack and Expo.

**🇰🇷 한글 해설**

TS = 안전 + 명확. props는 **interface**, state는 필요할 때 `<타입>`.


---

## 4. 💻 인클래스 예제: Week 8.1 - Notes and Examples

<div class="sum" data-kind="type">

**🧭 먼저 한국어로** · ⌨️ Snack에서 직접 쳐 보기

교수님이 Week 8 수업에서 라이브 코딩한 TypeScript 순서예요. Snack에서 App.js를 App.tsx로 바꿔서 하고, 아래 ⌨️ 표시된 곳은 처음부터 직접 쳐 보세요. 타입 에러는 빨간 줄로만 표시되고 앱은 그대로 실행돼요.

**이 챕터 구성**

- ⏭️ **React Native Playground**: Snack 설정 안내예요. 핵심은 한 가지: 파일을 App.js에서 App.tsx로 이름 바꾸기.
- 👀 **Why TypeScript?**: TypeScript를 쓰는 이유예요. 객관식으로 나오기 좋은 내용이라 읽어 두세요.
- ⌨️ **[Example: Types](#practice-1)**: 변수 타입 쓰는 법. 일부러 틀리게 고쳐 보면서 빨간 줄이 뜨는 걸 확인해요. (⌨️ App.tsx로 이름 바꾸고 number, string, boolean, number[], 객체 타입 변수 5개 출력)
- 👀 **Example: Types › How It Works**: 타입 표기의 문법 설명이에요.
- 👀 **Example: Types › What to Show**: 교수님이 보여 준 실험 6개예요. 읽고 어떤 에러가 나올지 예측해 보세요.
- ⌨️ **Example: Typed Props**: 컴포넌트 props에 interface를 붙이는 연습이에요. 시험에 제일 많이 나오는 TypeScript 문법이에요.
- ⌨️ **[Example: Typed Props › Starter Code](#practice-2)**: 타입이 없어서 label, value, unit이 any로 표시되는 상태를 먼저 봐요. (⌨️ Stat 컴포넌트 3개짜리 시작 코드 (props 타입 없음))
- ⌨️ **[Example: Typed Props › Step 1 - Describe the Props](#practice-3)**: props의 설계도를 만들고 매개변수에 붙여요. (⌨️ interface StatProps { label: string; value: number } + ({ ... }: StatProps))
- ⌨️ **[Example: Typed Props › Step 2 - Add an Optional Prop](#practice-4)**: 물음표는 선택(optional), 기본값으로 undefined 대비. (⌨️ unit?: string 추가 + 구조분해에서 unit = "" 기본값)
- ⌨️ **[Example: Typed Props › Step 3 - Break the Contract](#practice-5)**: 계약을 어기면 어떤 에러 메시지가 뜨는지 확인해요. (⌨️ value="320" 문자열로 바꾸기, label 지우기 (일부러 에러 내기))
- 👀 **Example: Typed Props › Finished Code**: 내가 친 코드와 비교하는 완성본이에요.
- ⌨️ **Example: Typed State and Events**: useState와 이벤트 핸들러에 타입 붙이기예요. 빈 배열과 null이 핵심이에요.
- ⌨️ **[Example: Typed State and Events › Starter Code](#practice-6)**: 빨간 줄 'never' 에러를 직접 확인해요. (⌨️ 손님 목록 앱 시작 코드 (useState([]), useState(null) 상태))
- ⌨️ **[Example: Typed State and Events › Step 1 - Let Inference Do Its Job, Then Help It](#practice-7)**: 빈 배열은 타입을 알려 줘야 해요. (⌨️ useState<string[]>([]) 로 고치기)
- ⌨️ **[Example: Typed State and Events › Step 2 - State That Can Be Null](#practice-8)**: 유니언 타입 `|`는 "또는". (⌨️ useState<string | null>(null) 로 고치기)
- ⌨️ **[Example: Typed State and Events › Step 3 - Type the Handlers](#practice-9)**: 이름 붙인 핸들러는 매개변수 타입을 직접 적어요. (⌨️ handleChange(text: string) 함수 만들고 onChangeText에 연결, addGuest(): void)
- 👀 **Example: Typed State and Events › Finished Code**: 내 코드와 비교하세요.
- ⌨️ **Example: Typed API Data**: API로 받은 데이터에 interface를 붙이는 예제예요. Test 3의 fetch 문제와 이어지는 내용이라 꼭 쳐 보세요.
- ⌨️ **[Example: Typed API Data › Starter Code](#practice-10)**: useState([])가 never[]가 돼서 item.id에 빨간 줄이 생겨요. (⌨️ users fetch + FlatList 시작 코드 (타입 없음))
- ⌨️ **[Example: Typed API Data › Step 1 - Describe the Data](#practice-11)**: 쓰는 필드만 적어요. 서버가 더 보내도 괜찮아요. (⌨️ interface User + useState<User[]>([]) + renderItem({ item }: { item: User }))
- ⌨️ **[Example: Typed API Data › Step 2 - Literal Types for Status](#practice-12)**: 상태가 세 개일 때 boolean 대신 문자열 리터럴 유니언. res.ok 체크는 Week 5 그대로예요. (⌨️ type Status = "loading" | "ready" | "error" + res.ok 체크 + 상태별 early return)
- ⌨️ **[Example: Typed API Data › Step 3 - The Payoff](#practice-13)**: 오타가 빨간 줄로 바로 잡혀요. 타입을 쓰는 가장 큰 이유예요. (⌨️ item.email을 item.emial로 일부러 틀리게 쓰기)
- 👀 **Example: Typed API Data › Finished Code**: 완성본이에요. 시험 직전에 다시 훑어보세요.
- ⌨️ **[Example: any and unknown](#practice-14)**: any는 검사를 꺼 버려서 실행할 때 터지고, unknown은 확인하기 전에는 못 쓰게 막아 줘요. (⌨️ let value: any = "hello"; value = 123; value.toUpperCase(); 를 붙여 보고 any를 unknown으로 바꾸기)
- 👀 **Example: any and unknown › What to Show**: any와 unknown 실험 5단계예요.
- 👀 **TypeScript Checklist**: 교수님이 정리한 요약이에요. 아래 한글 해설과 함께 시험 전에 한 번 더 보세요.

</div>

> 원문 출처: github.com/nick-romanidis/web530-2267-nsa  week-08.1-notes.md

### 💻 React Native Playground

React Native Playground (Snack)
_Use this for the examples. Modify App.tsx_
(https://snack.expo.dev)

- Keep Snack on SDK 54 (the default).
- Every example this week only needs `react-native`. Leave `package.json` alone.
- This week's examples are TypeScript, so the file is `App.tsx`, not `App.js`. In the file list, hover over `App.js`, open its menu (the three dots on the left) and choose **Rename to App.tsx**. Do this once per Snack. The same menu renames it back.
- Type errors show as red squiggles in the editor, with a red mark in the scrollbar on the right. Hover over a squiggle to read the message. The "No errors" indicator at the bottom only counts runtime errors, so look for squiggles, not the indicator.
- Everything this week runs on **Web**.

**🇰🇷 한글 해설**

- Snack은 **SDK 54 기본값** 그대로, `package.json`은 건드리지 마세요. 이번 주 예제는 `react-native`만 써요.
- 이번 주 예제는 TypeScript라서 파일 이름이 `App.js`가 아니라 **`App.tsx`**예요. 파일 목록에서 `App.js`에 마우스를 올리고 점 세 개 메뉴 → **Rename to App.tsx**. Snack마다 한 번만 하면 돼요.
- 타입 에러는 에디터에서 **빨간 밑줄(squiggle)** 로 보여요. 마우스를 올리면 설명이 떠요. 아래쪽 "No errors" 표시는 **실행 중 에러**만 세니까 빨간 줄은 직접 찾아야 해요.
- 전부 **Web**에서 실행돼요.

### 💻 Why TypeScript?

- JavaScript finds out about a wrong type when the code runs: a missing prop renders as nothing, a string where a number was expected does string maths, and `undefined.name` crashes. TypeScript finds out while you type.
- TypeScript is JavaScript plus type annotations. Every `.js` file you have written this term is valid TypeScript. You add types where they help and let TypeScript work out the rest.
- Props become a contract. In Week 1 PropTypes warned in the console at runtime. A TypeScript interface does the same job in the editor, before the app runs, and React 19 dropped PropTypes anyway.
- The types never reach the phone. Metro strips them out and ships plain JavaScript, so a type error does not stop the app from running. That is why Snack runs an `App.tsx` with squiggles in it. The checker is a tool for you, not a gate for the device.
- Every new Expo project is TypeScript by default. The Expo projects later in the course are `.tsx` files, so this is the week to get comfortable.

**🇰🇷 한글 해설**

**왜 TypeScript인가 (시험 포인트)**
1. JS는 틀린 타입을 **실행할 때** 알아요(props 빠지면 화면에 안 나오고, `undefined.name`은 앱이 죽음). TS는 **코드를 치는 중에** 알려 줘요.
2. TS = JS + **타입 표기**. 지금까지 쓴 `.js`는 전부 유효한 TS예요. 필요한 곳에만 타입을 적고 나머지는 TS가 추측(inference)해요.
3. props가 **계약(contract)** 이 돼요. Week 1의 PropTypes는 실행할 때 콘솔에 경고했는데, interface는 **실행 전에 에디터에서** 알려 줘요. 게다가 React 19에서 PropTypes는 없어졌어요.
4. **타입은 폰에 가지 않아요.** Metro가 타입을 지우고 일반 JS만 보내요. 그래서 빨간 줄이 있어도 **앱은 실행돼요**. 체커는 나를 위한 도구지, 막는 문이 아니에요.
5. 새 Expo 프로젝트는 기본이 TypeScript(`.tsx`)예요.

### 💻 Example: Types

- The pieces from the slides, in a screen you can run.


<p class="typeit" id="practice-1">⌨️ <b>이 코드는 Snack에서 직접 쳐 보세요</b>: App.tsx로 이름 바꾸고 number, string, boolean, number[], 객체 타입 변수 5개 출력</p>

```tsx
import { View, Text, StyleSheet } from "react-native";

let count: number = 0;
let name: string = "Nicholas";
let isActive: boolean = true;
let scores: number[] = [10, 20, 30];
let user: { name: string; age: number } = { name: "Ava", age: 21 };

export default function MyApp() {
  return (
    <View style={styles.container}>
      <Text style={styles.line}>count: {count}</Text>
      <Text style={styles.line}>name: {name}</Text>
      <Text style={styles.line}>isActive: {String(isActive)}</Text>
      <Text style={styles.line}>scores: {scores.join(", ")}</Text>
      <Text style={styles.line}>
        user: {user.name}, {user.age}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingTop: 60, paddingHorizontal: 20 },
  line: { fontSize: 18, marginBottom: 8 },
});
```

▶ **[Snack에서 바로 실행하기](https://snack.expo.dev/?name=WEB530%20W8%20Example%3A%20Types&platform=web&sdkVersion=54.0.0&code=import%20%7B%20View%2C%20Text%2C%20StyleSheet%20%7D%20from%20%22react-native%22%3B%0A%0Alet%20count%3A%20number%20%3D%200%3B%0Alet%20name%3A%20string%20%3D%20%22Nicholas%22%3B%0Alet%20isActive%3A%20boolean%20%3D%20true%3B%0Alet%20scores%3A%20number%5B%5D%20%3D%20%5B10%2C%2020%2C%2030%5D%3B%0Alet%20user%3A%20%7B%20name%3A%20string%3B%20age%3A%20number%20%7D%20%3D%20%7B%20name%3A%20%22Ava%22%2C%20age%3A%2021%20%7D%3B%0A%0Aexport%20default%20function%20MyApp%28%29%20%7B%0A%20%20return%20%28%0A%20%20%20%20%3CView%20style%3D%7Bstyles.container%7D%3E%0A%20%20%20%20%20%20%3CText%20style%3D%7Bstyles.line%7D%3Ecount%3A%20%7Bcount%7D%3C%2FText%3E%0A%20%20%20%20%20%20%3CText%20style%3D%7Bstyles.line%7D%3Ename%3A%20%7Bname%7D%3C%2FText%3E%0A%20%20%20%20%20%20%3CText%20style%3D%7Bstyles.line%7D%3EisActive%3A%20%7BString%28isActive%29%7D%3C%2FText%3E%0A%20%20%20%20%20%20%3CText%20style%3D%7Bstyles.line%7D%3Escores%3A%20%7Bscores.join%28%22%2C%20%22%29%7D%3C%2FText%3E%0A%20%20%20%20%20%20%3CText%20style%3D%7Bstyles.line%7D%3E%0A%20%20%20%20%20%20%20%20user%3A%20%7Buser.name%7D%2C%20%7Buser.age%7D%0A%20%20%20%20%20%20%3C%2FText%3E%0A%20%20%20%20%3C%2FView%3E%0A%20%20%29%3B%0A%7D%0A%0Aconst%20styles%20%3D%20StyleSheet.create%28%7B%0A%20%20container%3A%20%7B%20flex%3A%201%2C%20paddingTop%3A%2060%2C%20paddingHorizontal%3A%2020%20%7D%2C%0A%20%20line%3A%20%7B%20fontSize%3A%2018%2C%20marginBottom%3A%208%20%7D%2C%0A%7D%29%3B%0A)** (SDK 54, 필요한 패키지 자동 포함)

**🇰🇷 한글 해설**

**코드 해설**
- `let count: number = 0;`: 이름 뒤에 `: 타입`. 앞으로 다시 넣는 값도 이 타입이어야 해요.
- `number[]`: 숫자만 들어가는 배열. `{ name: string; age: number }`: 객체의 모양(속성 이름과 타입).
- `String(isActive)`는 TS가 아니라 **React Native 규칙**이에요. `<Text>`는 boolean을 그냥 못 그려서 문자열로 바꿔요.

#### 💻 How It Works

- A type annotation is a colon and a type after the name: `count: number`. It says what the variable may hold, now and after every reassignment.
- `number[]` is an array of numbers. `{ name: string; age: number }` is the shape of an object: these properties, with these types, nothing missing.
- `String(isActive)` is a React Native thing, not a TypeScript thing: `Text` will not render a bare boolean.

**🇰🇷 한글 해설**

- 타입 표기 = **콜론 + 타입** (`count: number`).
- `number[]` 배열, `{ ... }` 객체 모양. 객체 타입은 **빠진 속성이 없는지 검사하는 체크리스트**예요.

#### 💻 What to Show

1. Run it. Five lines of output, nothing special. TypeScript only shows up when something is wrong.
2. Change `let count: number = 0;` to `let count: number = "zero";`. A squiggle appears under `count`. Hover: `Type 'string' is not assignable to type 'number'`. Now look at the preview: the app still runs and prints `count: zero`. The checker and the runtime are separate.
3. Under the variables add `scores.push("forty");`. Same message. The array type applies to everything you put in later, not only the initial values.
4. Delete `age: 21` from `user`. Hover: `Property 'age' is missing`. An object type is a checklist.
5. Sometimes a property really is optional. Add a question mark to it in the type: `{ name: string; age?: number }`. The squiggle goes away. `age?` means the property may be left out, and inside the code its type is `number | undefined`. Run it: the line shows `user: Ava,` with nothing after the comma, because `user.age` is `undefined` and `Text` renders nothing for it. That is the trade: optional means every use has to cope with it missing.
6. Remove the annotation from `count` so it reads `let count = 0;`, then hover over `count`. The tooltip says `let count: number`. TypeScript inferred it from the `0`. Change the value to `"zero"` again: still an error. You get checking without writing a type, which is how most lines of TypeScript look.

**🇰🇷 한글 해설**

**실험 6개 (결과를 외우지 말고 이유를 이해하세요)**
1. 그냥 실행하면 평범해요. TS는 틀렸을 때만 존재감이 있어요.
2. `count: number = "zero"`로 바꾸면 빨간 줄(`Type 'string' is not assignable to type 'number'`)이 뜨는데 **앱은 `count: zero`를 그대로 출력**해요. 체커와 실행은 별개!
3. `scores.push("forty")`도 에러. 배열 타입은 나중에 넣는 값에도 적용돼요.
4. `user`에서 `age`를 지우면 `Property 'age' is missing`.
5. `age?: number`처럼 `?`를 붙이면 에러가 사라져요. 대신 값의 타입이 `number | undefined`가 되어서 **쓸 때마다 없을 수 있다는 걸 감안**해야 해요. (화면엔 `user: Ava,` 로 나오고 age 자리는 빈칸)
6. `let count = 0;`처럼 타입을 안 적으면 TS가 `number`로 **추론(inference)** 해요. 대부분의 TS 코드는 이렇게 타입을 안 적고 쓴 줄이에요.

### 💻 Example: Typed Props

- A component with props is the first place types earn their keep. The interface is a contract between the component and everyone who uses it, and TypeScript checks both sides.

**🇰🇷 한글 해설**

**핵심**: interface는 컴포넌트와 사용하는 쪽 사이의 계약서예요. TS가 **양쪽 모두** 검사해요(만든 쪽에서 읽을 때, 쓰는 쪽에서 넘길 때).

#### 💻 Starter Code

- Replace everything in `App.tsx`. Three stat cards, written the way we have written components all term.


<p class="typeit" id="practice-2">⌨️ <b>이 코드는 Snack에서 직접 쳐 보세요</b>: Stat 컴포넌트 3개짜리 시작 코드 (props 타입 없음)</p>

```tsx
import { View, Text, StyleSheet } from "react-native";

function Stat({ label, value, unit }) {
  return (
    <View style={styles.card}>
      <Text style={styles.value}>
        {value} {unit}
      </Text>
      <Text style={styles.label}>{label}</Text>
    </View>
  );
}

export default function MyApp() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Today</Text>
      <Stat label="Steps" value={8412} />
      <Stat label="Distance" value={6.2} unit="km" />
      <Stat label="Calories" value={320} unit="kcal" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingTop: 60, paddingHorizontal: 20 },
  title: { fontSize: 28, fontWeight: "700", marginBottom: 16 },
  card: {
    padding: 16,
    marginBottom: 12,
    borderRadius: 8,
    backgroundColor: "#E3F2FD",
  },
  value: { fontSize: 24, fontWeight: "600" },
  label: { fontSize: 14, color: "#555" },
});
```

▶ **[Snack에서 바로 실행하기](https://snack.expo.dev/?name=WEB530%20W8%20Example%3A%20Typed%20Props%20-%20Starter%20Code&platform=web&sdkVersion=54.0.0&code=import%20%7B%20View%2C%20Text%2C%20StyleSheet%20%7D%20from%20%22react-native%22%3B%0A%0Afunction%20Stat%28%7B%20label%2C%20value%2C%20unit%20%7D%29%20%7B%0A%20%20return%20%28%0A%20%20%20%20%3CView%20style%3D%7Bstyles.card%7D%3E%0A%20%20%20%20%20%20%3CText%20style%3D%7Bstyles.value%7D%3E%0A%20%20%20%20%20%20%20%20%7Bvalue%7D%20%7Bunit%7D%0A%20%20%20%20%20%20%3C%2FText%3E%0A%20%20%20%20%20%20%3CText%20style%3D%7Bstyles.label%7D%3E%7Blabel%7D%3C%2FText%3E%0A%20%20%20%20%3C%2FView%3E%0A%20%20%29%3B%0A%7D%0A%0Aexport%20default%20function%20MyApp%28%29%20%7B%0A%20%20return%20%28%0A%20%20%20%20%3CView%20style%3D%7Bstyles.container%7D%3E%0A%20%20%20%20%20%20%3CText%20style%3D%7Bstyles.title%7D%3EToday%3C%2FText%3E%0A%20%20%20%20%20%20%3CStat%20label%3D%22Steps%22%20value%3D%7B8412%7D%20%2F%3E%0A%20%20%20%20%20%20%3CStat%20label%3D%22Distance%22%20value%3D%7B6.2%7D%20unit%3D%22km%22%20%2F%3E%0A%20%20%20%20%20%20%3CStat%20label%3D%22Calories%22%20value%3D%7B320%7D%20unit%3D%22kcal%22%20%2F%3E%0A%20%20%20%20%3C%2FView%3E%0A%20%20%29%3B%0A%7D%0A%0Aconst%20styles%20%3D%20StyleSheet.create%28%7B%0A%20%20container%3A%20%7B%20flex%3A%201%2C%20paddingTop%3A%2060%2C%20paddingHorizontal%3A%2020%20%7D%2C%0A%20%20title%3A%20%7B%20fontSize%3A%2028%2C%20fontWeight%3A%20%22700%22%2C%20marginBottom%3A%2016%20%7D%2C%0A%20%20card%3A%20%7B%0A%20%20%20%20padding%3A%2016%2C%0A%20%20%20%20marginBottom%3A%2012%2C%0A%20%20%20%20borderRadius%3A%208%2C%0A%20%20%20%20backgroundColor%3A%20%22%23E3F2FD%22%2C%0A%20%20%7D%2C%0A%20%20value%3A%20%7B%20fontSize%3A%2024%2C%20fontWeight%3A%20%22600%22%20%7D%2C%0A%20%20label%3A%20%7B%20fontSize%3A%2014%2C%20color%3A%20%22%23555%22%20%7D%2C%0A%7D%29%3B%0A)** (SDK 54, 필요한 패키지 자동 포함)

- Run it. It works, and the editor already has something to say: squiggles under `label`, `value` and `unit`, and one under the first `<Stat>` in `MyApp`. Hover over `label`: `Binding element 'label' implicitly has an 'any' type`. TypeScript was not told what a `Stat` expects, so each prop is `any`, which means unchecked.
- Hover over the first `<Stat>`: `Property 'unit' is missing`. With nothing else to go on, TypeScript guessed the props from the destructuring: three props, all required. A guessed contract is wrong in both directions, and that is the gap the next step closes.

**🇰🇷 한글 해설**

**시작 코드 읽기**
- `function Stat({ label, value, unit })`: 타입이 하나도 없어요. 그래서 세 props가 모두 `any`(검사 안 함)로 빨간 줄이 생겨요.
- 첫 번째 `<Stat>`에 `Property 'unit' is missing`이 뜨는 건, TS가 구조분해를 보고 "3개 다 필수겠지" 하고 **추측**했기 때문이에요. 추측한 계약은 양쪽으로 틀려요. 다음 단계에서 고쳐요.

#### 💻 Step 1 - Describe the Props

- Above `Stat`, add an interface for its props.


<p class="typeit" id="practice-3">⌨️ <b>이 코드는 Snack에서 직접 쳐 보세요</b>: interface StatProps { label: string; value: number } + ({ ... }: StatProps)</p>

```tsx
interface StatProps {
  label: string;
  value: number;
}
```

- Annotate the props parameter with it.


<p class="typeit sm">⌨️ 이 부분도 직접 쳐 보세요</p>

```tsx
function Stat({ label, value, unit }: StatProps) {
```

- The three squiggles inside `Stat` are gone, and two new ones appear: `unit` in the parameter and `unit="km"` in `MyApp`. Hover: `Property 'unit' does not exist on type 'StatProps'`. The interface is the whole truth about a `Stat`. Anything not in it is an error on both sides, where it is read and where it is passed.
- `interface` is the TypeScript keyword for naming an object shape. The naming convention is the component name plus `Props`.

**🇰🇷 한글 해설**

```tsx
interface StatProps { label: string; value: number; }
function Stat({ label, value, unit }: StatProps) {
```
- `interface` = 객체 모양에 이름 붙이는 키워드. 이름은 **컴포넌트이름 + Props** (`StatProps`).
- 구조분해한 `{ ... }` 뒤에 `: StatProps`.
- 이제 `unit`이 interface에 **없어서** 에러가 나요. interface에 없는 건 읽는 곳과 넘기는 곳 모두 에러. (그래서 다음 단계가 필요)

#### 💻 Step 2 - Add an Optional Prop

- Add `unit` to the interface with a question mark.


<p class="typeit" id="practice-4">⌨️ <b>이 코드는 Snack에서 직접 쳐 보세요</b>: unit?: string 추가 + 구조분해에서 unit = &quot;&quot; 기본값</p>

```tsx
interface StatProps {
  label: string;
  value: number;
  unit?: string;
}
```

- `?` means the prop may be left out. Inside the component its type is `string | undefined`, so give it a default where it is destructured.


<p class="typeit sm">⌨️ 이 부분도 직접 쳐 보세요</p>

```tsx
function Stat({ label, value, unit = "" }: StatProps) {
```

- Everything is clear. Run it: the same three cards, but now `Stat` has a contract.
- A required prop has no `?`. Leaving it out is an error. An optional prop has `?`, and the component has to cope with it missing, usually with a default.

**🇰🇷 한글 해설**

- `unit?: string`: **`?` = 선택 prop**. 빼도 에러 아님. 이때 안에서 타입은 `string | undefined`.
- 그래서 구조분해할 때 **기본값** `unit = ""`을 줘요. 필수 prop은 `?`가 없고 빼면 에러, 선택 prop은 `?`가 있고 컴포넌트가 없을 때를 처리해야 해요.

<div class="pt" id="practice-5"></div>

#### 💻 Step 3 - Break the Contract

- Change `value={320}` to `value="320"`. Hover: `Type 'string' is not assignable to type 'number'`. In JavaScript this would silently work until someone tried to add to it.
- Delete `label="Steps"` from the first card. Hover over `Stat`: `Property 'label' is missing`. This is the PropTypes `isRequired` warning from Week 1, except it is in the editor and it is red.
- Put them back. Then, in `MyApp`, start typing a fourth card: `<Stat ` and press Ctrl+Space. The editor lists `label`, `value` and `unit`, with their types, and marks which are optional. The interface is also documentation that cannot go stale.
- Delete the half-typed card before moving on.

**🇰🇷 한글 해설**

- `value="320"` (문자열) → `Type 'string' is not assignable to type 'number'`. JS였다면 조용히 돌다가 나중에 더하기에서 버그가 났을 거예요.
- `label`을 빼면 `Property 'label' is missing`. Week 1 PropTypes의 `isRequired` 경고와 같은 역할인데 에디터에서 빨갛게 보이는 거예요.
- 새 `<Stat ` 을 치고 Ctrl+Space를 누르면 props 목록과 타입, 선택 여부가 떠요. interface는 **낡지 않는 문서**이기도 해요.

#### 💻 Finished Code

- Compare against this if something is not working.

```tsx
import { View, Text, StyleSheet } from "react-native";

interface StatProps {
  label: string;
  value: number;
  unit?: string;
}

function Stat({ label, value, unit = "" }: StatProps) {
  return (
    <View style={styles.card}>
      <Text style={styles.value}>
        {value} {unit}
      </Text>
      <Text style={styles.label}>{label}</Text>
    </View>
  );
}

export default function MyApp() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Today</Text>
      <Stat label="Steps" value={8412} />
      <Stat label="Distance" value={6.2} unit="km" />
      <Stat label="Calories" value={320} unit="kcal" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingTop: 60, paddingHorizontal: 20 },
  title: { fontSize: 28, fontWeight: "700", marginBottom: 16 },
  card: {
    padding: 16,
    marginBottom: 12,
    borderRadius: 8,
    backgroundColor: "#E3F2FD",
  },
  value: { fontSize: 24, fontWeight: "600" },
  label: { fontSize: 14, color: "#555" },
});
```

▶ **[Snack에서 바로 실행하기](https://snack.expo.dev/?name=WEB530%20W8%20Example%3A%20Typed%20Props%20-%20Finished%20Code&platform=web&sdkVersion=54.0.0&code=import%20%7B%20View%2C%20Text%2C%20StyleSheet%20%7D%20from%20%22react-native%22%3B%0A%0Ainterface%20StatProps%20%7B%0A%20%20label%3A%20string%3B%0A%20%20value%3A%20number%3B%0A%20%20unit%3F%3A%20string%3B%0A%7D%0A%0Afunction%20Stat%28%7B%20label%2C%20value%2C%20unit%20%3D%20%22%22%20%7D%3A%20StatProps%29%20%7B%0A%20%20return%20%28%0A%20%20%20%20%3CView%20style%3D%7Bstyles.card%7D%3E%0A%20%20%20%20%20%20%3CText%20style%3D%7Bstyles.value%7D%3E%0A%20%20%20%20%20%20%20%20%7Bvalue%7D%20%7Bunit%7D%0A%20%20%20%20%20%20%3C%2FText%3E%0A%20%20%20%20%20%20%3CText%20style%3D%7Bstyles.label%7D%3E%7Blabel%7D%3C%2FText%3E%0A%20%20%20%20%3C%2FView%3E%0A%20%20%29%3B%0A%7D%0A%0Aexport%20default%20function%20MyApp%28%29%20%7B%0A%20%20return%20%28%0A%20%20%20%20%3CView%20style%3D%7Bstyles.container%7D%3E%0A%20%20%20%20%20%20%3CText%20style%3D%7Bstyles.title%7D%3EToday%3C%2FText%3E%0A%20%20%20%20%20%20%3CStat%20label%3D%22Steps%22%20value%3D%7B8412%7D%20%2F%3E%0A%20%20%20%20%20%20%3CStat%20label%3D%22Distance%22%20value%3D%7B6.2%7D%20unit%3D%22km%22%20%2F%3E%0A%20%20%20%20%20%20%3CStat%20label%3D%22Calories%22%20value%3D%7B320%7D%20unit%3D%22kcal%22%20%2F%3E%0A%20%20%20%20%3C%2FView%3E%0A%20%20%29%3B%0A%7D%0A%0Aconst%20styles%20%3D%20StyleSheet.create%28%7B%0A%20%20container%3A%20%7B%20flex%3A%201%2C%20paddingTop%3A%2060%2C%20paddingHorizontal%3A%2020%20%7D%2C%0A%20%20title%3A%20%7B%20fontSize%3A%2028%2C%20fontWeight%3A%20%22700%22%2C%20marginBottom%3A%2016%20%7D%2C%0A%20%20card%3A%20%7B%0A%20%20%20%20padding%3A%2016%2C%0A%20%20%20%20marginBottom%3A%2012%2C%0A%20%20%20%20borderRadius%3A%208%2C%0A%20%20%20%20backgroundColor%3A%20%22%23E3F2FD%22%2C%0A%20%20%7D%2C%0A%20%20value%3A%20%7B%20fontSize%3A%2024%2C%20fontWeight%3A%20%22600%22%20%7D%2C%0A%20%20label%3A%20%7B%20fontSize%3A%2014%2C%20color%3A%20%22%23555%22%20%7D%2C%0A%7D%29%3B%0A)** (SDK 54, 필요한 패키지 자동 포함) <button class="snack-embed" type="button">👀 여기서 결과 보기</button>

**🇰🇷 한글 해설**

**완성본 확인 포인트**: ① `interface StatProps`에 `unit?` ② `unit = ""` 기본값 ③ `({ ... }: StatProps)`. 이 세 줄이 보이면 맞아요.

### 💻 Example: Typed State and Events

- `useState` usually needs no type: TypeScript reads it from the initial value. The exceptions are state that starts empty or starts as `null`, because the initial value does not say what comes later.

**🇰🇷 한글 해설**

**핵심**: `useState`는 보통 타입을 안 적어도 돼요(초기값으로 추론). **초기값이 `[]`나 `null`일 때만** 알려 줘야 해요. 초기값만으로는 나중에 뭐가 들어올지 모르니까요.

#### 💻 Starter Code

- Replace everything in `App.tsx`. A guest list: type a name, add it, tap a guest to check them in.


<p class="typeit" id="practice-6">⌨️ <b>이 코드는 Snack에서 직접 쳐 보세요</b>: 손님 목록 앱 시작 코드 (useState([]), useState(null) 상태)</p>

```tsx
import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  Pressable,
  StyleSheet,
} from "react-native";

export default function MyApp() {
  const [name, setName] = useState("");
  const [guests, setGuests] = useState([]);
  const [selected, setSelected] = useState(null);

  function addGuest() {
    if (name.trim() === "") return;
    setGuests((prev) => [...prev, name.trim()]);
    setName("");
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Guest List</Text>
      <TextInput
        style={styles.input}
        placeholder="Name"
        value={name}
        onChangeText={(text) => setName(text)}
      />
      <Button title="Add" onPress={addGuest} />
      {guests.map((guest, index) => (
        <Pressable key={index} onPress={() => setSelected(guest)}>
          <Text style={styles.guest}>{guest}</Text>
        </Pressable>
      ))}
      <Text style={styles.message}>
        {selected ? `Checking in: ${selected}` : "Tap a guest to check them in"}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingTop: 60, paddingHorizontal: 20 },
  title: { fontSize: 28, fontWeight: "700", marginBottom: 16 },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
    fontSize: 16,
  },
  guest: { fontSize: 18, paddingVertical: 8 },
  message: { marginTop: 16, fontSize: 16, color: "#555" },
});
```

▶ **[Snack에서 바로 실행하기](https://snack.expo.dev/?name=WEB530%20W8%20Example%3A%20Typed%20State%20and%20Events%20-%20Starter%20Code&platform=web&sdkVersion=54.0.0&code=import%20%7B%20useState%20%7D%20from%20%22react%22%3B%0Aimport%20%7B%0A%20%20View%2C%0A%20%20Text%2C%0A%20%20TextInput%2C%0A%20%20Button%2C%0A%20%20Pressable%2C%0A%20%20StyleSheet%2C%0A%7D%20from%20%22react-native%22%3B%0A%0Aexport%20default%20function%20MyApp%28%29%20%7B%0A%20%20const%20%5Bname%2C%20setName%5D%20%3D%20useState%28%22%22%29%3B%0A%20%20const%20%5Bguests%2C%20setGuests%5D%20%3D%20useState%28%5B%5D%29%3B%0A%20%20const%20%5Bselected%2C%20setSelected%5D%20%3D%20useState%28null%29%3B%0A%0A%20%20function%20addGuest%28%29%20%7B%0A%20%20%20%20if%20%28name.trim%28%29%20%3D%3D%3D%20%22%22%29%20return%3B%0A%20%20%20%20setGuests%28%28prev%29%20%3D%3E%20%5B...prev%2C%20name.trim%28%29%5D%29%3B%0A%20%20%20%20setName%28%22%22%29%3B%0A%20%20%7D%0A%0A%20%20return%20%28%0A%20%20%20%20%3CView%20style%3D%7Bstyles.container%7D%3E%0A%20%20%20%20%20%20%3CText%20style%3D%7Bstyles.title%7D%3EGuest%20List%3C%2FText%3E%0A%20%20%20%20%20%20%3CTextInput%0A%20%20%20%20%20%20%20%20style%3D%7Bstyles.input%7D%0A%20%20%20%20%20%20%20%20placeholder%3D%22Name%22%0A%20%20%20%20%20%20%20%20value%3D%7Bname%7D%0A%20%20%20%20%20%20%20%20onChangeText%3D%7B%28text%29%20%3D%3E%20setName%28text%29%7D%0A%20%20%20%20%20%20%2F%3E%0A%20%20%20%20%20%20%3CButton%20title%3D%22Add%22%20onPress%3D%7BaddGuest%7D%20%2F%3E%0A%20%20%20%20%20%20%7Bguests.map%28%28guest%2C%20index%29%20%3D%3E%20%28%0A%20%20%20%20%20%20%20%20%3CPressable%20key%3D%7Bindex%7D%20onPress%3D%7B%28%29%20%3D%3E%20setSelected%28guest%29%7D%3E%0A%20%20%20%20%20%20%20%20%20%20%3CText%20style%3D%7Bstyles.guest%7D%3E%7Bguest%7D%3C%2FText%3E%0A%20%20%20%20%20%20%20%20%3C%2FPressable%3E%0A%20%20%20%20%20%20%29%29%7D%0A%20%20%20%20%20%20%3CText%20style%3D%7Bstyles.message%7D%3E%0A%20%20%20%20%20%20%20%20%7Bselected%20%3F%20%60Checking%20in%3A%20%24%7Bselected%7D%60%20%3A%20%22Tap%20a%20guest%20to%20check%20them%20in%22%7D%0A%20%20%20%20%20%20%3C%2FText%3E%0A%20%20%20%20%3C%2FView%3E%0A%20%20%29%3B%0A%7D%0A%0Aconst%20styles%20%3D%20StyleSheet.create%28%7B%0A%20%20container%3A%20%7B%20flex%3A%201%2C%20paddingTop%3A%2060%2C%20paddingHorizontal%3A%2020%20%7D%2C%0A%20%20title%3A%20%7B%20fontSize%3A%2028%2C%20fontWeight%3A%20%22700%22%2C%20marginBottom%3A%2016%20%7D%2C%0A%20%20input%3A%20%7B%0A%20%20%20%20borderWidth%3A%201%2C%0A%20%20%20%20borderColor%3A%20%22%23ccc%22%2C%0A%20%20%20%20borderRadius%3A%208%2C%0A%20%20%20%20padding%3A%2012%2C%0A%20%20%20%20marginBottom%3A%208%2C%0A%20%20%20%20fontSize%3A%2016%2C%0A%20%20%7D%2C%0A%20%20guest%3A%20%7B%20fontSize%3A%2018%2C%20paddingVertical%3A%208%20%7D%2C%0A%20%20message%3A%20%7B%20marginTop%3A%2016%2C%20fontSize%3A%2016%2C%20color%3A%20%22%23555%22%20%7D%2C%0A%7D%29%3B%0A)** (SDK 54, 필요한 패키지 자동 포함)

- Run it. Add a couple of names and tap one. It all works, and the editor has one squiggle, under the updater function inside `setGuests`. Hover: `Type 'string' is not assignable to type 'never'`.

**🇰🇷 한글 해설**

**시작 코드 읽기**: 이름을 입력해 추가(`addGuest`)하고, 손님을 누르면 `selected`에 저장하는 앱. 실행은 잘 되는데 `setGuests` 안쪽에 `Type 'string' is not assignable to type 'never'` 빨간 줄이 하나 있어요.

#### 💻 Step 1 - Let Inference Do Its Job, Then Help It

- Hover over `name` in `useState("")`. The tooltip says `const name: string`. The initial value was a string, so the state is a string, and `setName` only accepts strings. No annotation needed. The same goes for a counter that starts at `0` or a flag that starts `false`.
- Hover over `guests`. The tooltip says `never[]`: an array that can never hold anything. An empty array tells TypeScript nothing about what will go in it, so it assumes nothing may.
- Tell it. `useState` takes the state type in angle brackets.


<p class="typeit" id="practice-7">⌨️ <b>이 코드는 Snack에서 직접 쳐 보세요</b>: useState&lt;string[]&gt;([]) 로 고치기</p>

```tsx
const [guests, setGuests] = useState<string[]>([]);
```

- The squiggle moves. It is now on `guest` in `setSelected(guest)`. Hover: `Argument of type 'string' is not assignable to parameter of type 'SetStateAction<null>'`. `selected` started as `null`, so TypeScript decided it is always `null`.

**🇰🇷 한글 해설**

- `useState("")`는 `string`으로 추론돼요. 카운터 `0`, 플래그 `false`도 마찬가지.
- `useState([])`의 `guests`는 `never[]`: "아무것도 못 넣는 배열". 빈 배열은 정보가 없어서 TS가 아무것도 안 들어간다고 가정해요.
- 해결: `useState<string[]>([])`. 꺾쇠 `<>` 안에 state 타입.
- 그러면 에러가 `setSelected(guest)`로 옮겨가요. `selected`가 `null`로 시작해서 TS가 "항상 null"이라고 결정했기 때문이에요.

#### 💻 Step 2 - State That Can Be Null

- `selected` is sometimes a string and sometimes `null`. Say both.


<p class="typeit" id="practice-8">⌨️ <b>이 코드는 Snack에서 직접 쳐 보세요</b>: useState&lt;string | null&gt;(null) 로 고치기</p>

```tsx
const [selected, setSelected] = useState<string | null>(null);
```

- `string | null` is a union type: one of these. The `|` reads as "or".
- Everything is clear. Run it again. Nothing changed on screen, which is the point: the app was already correct, and the editor can now prove it.
- Rule of thumb: annotate `useState` when the initial value is `[]` or `null`. Otherwise leave it to inference.

**🇰🇷 한글 해설**

- `useState<string | null>(null)`. **`string | null`은 유니언(union) 타입** = "문자열 또는 null". `|`는 "또는"으로 읽어요.
- 화면은 안 변해요. 앱은 원래 맞았고, 이제 에디터가 증명할 수 있게 된 거예요.
- **규칙**: 초기값이 `[]`나 `null`이면 `<타입>`을 적고, 나머지는 추론에 맡겨요. (시험 단골)

#### 💻 Step 3 - Type the Handlers

- Move the two handlers into named functions. Under `addGuest`, add one for the input.


<p class="typeit" id="practice-9">⌨️ <b>이 코드는 Snack에서 직접 쳐 보세요</b>: handleChange(text: string) 함수 만들고 onChangeText에 연결, addGuest(): void</p>

```tsx
function handleChange(text: string) {
  setName(text);
}
```

- Use it: `onChangeText={handleChange}`.
- Give `addGuest` a return type. `void` means it returns nothing.


<p class="typeit sm">⌨️ 이 부분도 직접 쳐 보세요</p>

```tsx
function addGuest(): void {
```

- Now change `text: string` to `text: number`. The squiggle is not inside `handleChange`; it is on `onChangeText` in the JSX. `TextInput` declares that it calls `onChangeText` with a string, so a function that wants a number does not fit. The component tells you what it passes.
- Put `string` back. In practice you rarely write the parameter type for inline arrows like `(text) => setName(text)`, because TypeScript reads it from the prop. Named handlers need it written down.

**🇰🇷 한글 해설**

- `function handleChange(text: string)`: 이름 붙인 핸들러는 **매개변수 타입을 직접** 적어요.
- `function addGuest(): void`: 반환값 없음은 `void`.
- 일부러 `text: number`로 바꾸면 에러가 핸들러 안이 아니라 JSX의 `onChangeText`에 떠요. `TextInput`이 "나는 문자열을 넘겨줄게"라고 선언해 놨는데 숫자를 받는 함수는 안 맞기 때문이에요.
- `onChangeText={(text) => setName(text)}`처럼 JSX 안 인라인 화살표 함수는 TS가 prop에서 읽어 와서 보통 타입을 안 적어요.

#### 💻 Finished Code

- Compare against this if something is not working.

```tsx
import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  Pressable,
  StyleSheet,
} from "react-native";

export default function MyApp() {
  const [name, setName] = useState("");
  const [guests, setGuests] = useState<string[]>([]);
  const [selected, setSelected] = useState<string | null>(null);

  function addGuest(): void {
    if (name.trim() === "") return;
    setGuests((prev) => [...prev, name.trim()]);
    setName("");
  }

  function handleChange(text: string) {
    setName(text);
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Guest List</Text>
      <TextInput
        style={styles.input}
        placeholder="Name"
        value={name}
        onChangeText={handleChange}
      />
      <Button title="Add" onPress={addGuest} />
      {guests.map((guest, index) => (
        <Pressable key={index} onPress={() => setSelected(guest)}>
          <Text style={styles.guest}>{guest}</Text>
        </Pressable>
      ))}
      <Text style={styles.message}>
        {selected ? `Checking in: ${selected}` : "Tap a guest to check them in"}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingTop: 60, paddingHorizontal: 20 },
  title: { fontSize: 28, fontWeight: "700", marginBottom: 16 },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
    fontSize: 16,
  },
  guest: { fontSize: 18, paddingVertical: 8 },
  message: { marginTop: 16, fontSize: 16, color: "#555" },
});
```

▶ 이 코드는 `useState<...>()` 같은 TypeScript 문법이 있어서 Snack의 `App.js`에서는 에러가 나요. [Snack](https://snack.expo.dev)을 새로 열고 왼쪽 파일 목록에서 `App.js` 메뉴(점 세 개) → **Rename to App.tsx** 한 번 한 뒤 붙여 넣으세요. 빨간 줄(squiggle)이 타입 에러 표시이고, 앱은 그래도 실행돼요.

**🇰🇷 한글 해설**

**확인 포인트**: `useState<string[]>([])`, `useState<string | null>(null)`, `handleChange(text: string)`, `addGuest(): void`. 시험에서 이 네 가지가 빈칸으로 나올 수 있어요.

### 💻 Example: Typed API Data

- This is where TypeScript pays for itself. Data from a server is the one thing in the app you did not write, and every `item.name` is a guess about its shape. An interface turns the guess into something the editor can check.

**🇰🇷 한글 해설**

**핵심**: 서버 데이터는 내가 쓰지 않은 유일한 데이터라서 `item.name`은 전부 추측이에요. interface로 추측을 에디터가 검사할 수 있는 약속으로 바꿔요.

#### 💻 Starter Code

- Replace everything in `App.tsx`. The Week 5 fetch pattern: load the users, show a spinner, then a list.


<p class="typeit" id="practice-10">⌨️ <b>이 코드는 Snack에서 직접 쳐 보세요</b>: users fetch + FlatList 시작 코드 (타입 없음)</p>

```tsx
import { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  StyleSheet,
} from "react-native";

const URL = "https://jsonplaceholder.typicode.com/users";

export default function MyApp() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(URL)
      .then((res) => res.json())
      .then((json) => setUsers(json))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={users}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.row}>
            <Text style={styles.name}>{item.name}</Text>
            <Text style={styles.detail}>{item.email}</Text>
            <Text style={styles.detail}>{item.company.name}</Text>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingTop: 60 },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  row: { padding: 20, borderBottomWidth: 1, borderColor: "#ddd" },
  name: { fontSize: 18, fontWeight: "600" },
  detail: { fontSize: 14, color: "#666" },
});
```

▶ **[Snack에서 바로 실행하기](https://snack.expo.dev/?name=WEB530%20W8%20Example%3A%20Typed%20API%20Data%20-%20Starter%20Code&platform=web&sdkVersion=54.0.0&code=import%20%7B%20useState%2C%20useEffect%20%7D%20from%20%22react%22%3B%0Aimport%20%7B%0A%20%20View%2C%0A%20%20Text%2C%0A%20%20FlatList%2C%0A%20%20ActivityIndicator%2C%0A%20%20StyleSheet%2C%0A%7D%20from%20%22react-native%22%3B%0A%0Aconst%20URL%20%3D%20%22https%3A%2F%2Fjsonplaceholder.typicode.com%2Fusers%22%3B%0A%0Aexport%20default%20function%20MyApp%28%29%20%7B%0A%20%20const%20%5Busers%2C%20setUsers%5D%20%3D%20useState%28%5B%5D%29%3B%0A%20%20const%20%5Bloading%2C%20setLoading%5D%20%3D%20useState%28true%29%3B%0A%0A%20%20useEffect%28%28%29%20%3D%3E%20%7B%0A%20%20%20%20fetch%28URL%29%0A%20%20%20%20%20%20.then%28%28res%29%20%3D%3E%20res.json%28%29%29%0A%20%20%20%20%20%20.then%28%28json%29%20%3D%3E%20setUsers%28json%29%29%0A%20%20%20%20%20%20.finally%28%28%29%20%3D%3E%20setLoading%28false%29%29%3B%0A%20%20%7D%2C%20%5B%5D%29%3B%0A%0A%20%20if%20%28loading%29%20%7B%0A%20%20%20%20return%20%28%0A%20%20%20%20%20%20%3CView%20style%3D%7Bstyles.center%7D%3E%0A%20%20%20%20%20%20%20%20%3CActivityIndicator%20size%3D%22large%22%20%2F%3E%0A%20%20%20%20%20%20%3C%2FView%3E%0A%20%20%20%20%29%3B%0A%20%20%7D%0A%0A%20%20return%20%28%0A%20%20%20%20%3CView%20style%3D%7Bstyles.container%7D%3E%0A%20%20%20%20%20%20%3CFlatList%0A%20%20%20%20%20%20%20%20data%3D%7Busers%7D%0A%20%20%20%20%20%20%20%20keyExtractor%3D%7B%28item%29%20%3D%3E%20item.id.toString%28%29%7D%0A%20%20%20%20%20%20%20%20renderItem%3D%7B%28%7B%20item%20%7D%29%20%3D%3E%20%28%0A%20%20%20%20%20%20%20%20%20%20%3CView%20style%3D%7Bstyles.row%7D%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%3CText%20style%3D%7Bstyles.name%7D%3E%7Bitem.name%7D%3C%2FText%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%3CText%20style%3D%7Bstyles.detail%7D%3E%7Bitem.email%7D%3C%2FText%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%3CText%20style%3D%7Bstyles.detail%7D%3E%7Bitem.company.name%7D%3C%2FText%3E%0A%20%20%20%20%20%20%20%20%20%20%3C%2FView%3E%0A%20%20%20%20%20%20%20%20%29%7D%0A%20%20%20%20%20%20%2F%3E%0A%20%20%20%20%3C%2FView%3E%0A%20%20%29%3B%0A%7D%0A%0Aconst%20styles%20%3D%20StyleSheet.create%28%7B%0A%20%20container%3A%20%7B%20flex%3A%201%2C%20paddingTop%3A%2060%20%7D%2C%0A%20%20center%3A%20%7B%20flex%3A%201%2C%20justifyContent%3A%20%22center%22%2C%20alignItems%3A%20%22center%22%20%7D%2C%0A%20%20row%3A%20%7B%20padding%3A%2020%2C%20borderBottomWidth%3A%201%2C%20borderColor%3A%20%22%23ddd%22%20%7D%2C%0A%20%20name%3A%20%7B%20fontSize%3A%2018%2C%20fontWeight%3A%20%22600%22%20%7D%2C%0A%20%20detail%3A%20%7B%20fontSize%3A%2014%2C%20color%3A%20%22%23666%22%20%7D%2C%0A%7D%29%3B%0A)** (SDK 54, 필요한 패키지 자동 포함)

- Run it. The list loads. The editor has two squiggles, both in the `FlatList`. Hover over `id` in `keyExtractor`: `Property 'id' does not exist on type 'never'`. Same cause as the guest list: `useState([])` is a `never[]`, so each `item` is a `never`, and a `never` has no properties.
- Hover over `item` in `renderItem`: `Binding element 'item' implicitly has an 'any' type`. The `Stat` starter all over again. TypeScript does not know what a row is, so `item.name`, `item.email` and `item.company.name` are not checked at all. Misspell one and nothing turns red.
- Notice there is no squiggle on `setUsers(json)` either. `res.json()` returns `any`, and `any` fits anywhere. That is the problem with `any`: it switches the checker off, and the error shows up somewhere else or not at all.

**🇰🇷 한글 해설**

**시작 코드 읽기** (Week 5 fetch 패턴 + 타입 없음)
- `useState([])` → `never[]`라서 `keyExtractor`의 `item.id`에 빨간 줄(`Property 'id' does not exist on type 'never'`).
- `renderItem`의 `item`은 암묵적 `any`. 그래서 `item.name`, `item.email`이 **검사 안 돼요**. 오타를 내도 빨갛게 안 돼요.
- `setUsers(json)`에 빨간 줄이 없는 이유: `res.json()`이 `any`를 돌려주고 `any`는 어디에나 들어가기 때문이에요. **any는 검사를 끄는 스위치**예요.

#### 💻 Step 1 - Describe the Data

- Above `MyApp`, describe one user. Only the fields this screen uses; the API sends more, and extra fields are fine.


<p class="typeit" id="practice-11">⌨️ <b>이 코드는 Snack에서 직접 쳐 보세요</b>: interface User + useState&lt;User[]&gt;([]) + renderItem({ item }: { item: User })</p>

```tsx
interface User {
  id: number;
  name: string;
  email: string;
  company: { name: string };
}
```

- Type the state and the response.


<p class="typeit sm">⌨️ 이 부분도 직접 쳐 보세요</p>

```tsx
const [users, setUsers] = useState<User[]>([]);
```


<p class="typeit sm">⌨️ 이 부분도 직접 쳐 보세요</p>

```tsx
.then((json: User[]) => setUsers(json))
```

- The `keyExtractor` squiggle is gone. Hover over its `item`: it is a `User` now, worked out from the `data` prop. The `renderItem` squiggle stays, because the object `renderItem` receives does not pick up the row type on its own. Say what it is in the parameter.


<p class="typeit sm">⌨️ 이 부분도 직접 쳐 보세요</p>

```tsx
renderItem={({ item }: { item: User }) => (
```

- Every squiggle is gone. Type `item.` inside `renderItem` and the editor offers `id`, `name`, `email` and `company`.
- `json: User[]` is a promise you are making, not a check. TypeScript never sees the server. If the API changes, the interface is wrong and the editor cannot know. The interface documents what you expect; the error handling from Week 5 covers the day the server disagrees.

**🇰🇷 한글 해설**

```tsx
interface User { id: number; name: string; email: string; company: { name: string }; }
const [users, setUsers] = useState<User[]>([]);
.then((json: User[]) => setUsers(json))
renderItem={({ item }: { item: User }) => (
```
- interface에는 **화면에서 쓰는 필드만**. 서버가 더 보내도 괜찮아요.
- `keyExtractor`의 `item`은 `data`를 보고 TS가 `User`로 알아내요. 하지만 `renderItem`이 받는 객체는 자동으로 안 알아내서 `({ item }: { item: User })`로 **직접** 적어요.
- ⚠️ `json: User[]`는 **검사가 아니라 약속**이에요. TS는 서버를 못 봐요. 서버가 바뀌는 날을 위해 Week 5의 에러 처리가 필요해요.

#### 💻 Step 2 - Literal Types for Status

- The screen has three states: loading, ready, and the error case this starter skipped. A boolean cannot hold three. Above `MyApp`, under the interface, name them.


<p class="typeit" id="practice-12">⌨️ <b>이 코드는 Snack에서 직접 쳐 보세요</b>: type Status = &quot;loading&quot; | &quot;ready&quot; | &quot;error&quot; + res.ok 체크 + 상태별 early return</p>

```tsx
type Status = "loading" | "ready" | "error";
```

- `type` is like `interface`, but it can name any type, not only object shapes. This one is a union of three string literals: the only values a `Status` may be.
- Replace the `loading` state.


<p class="typeit sm">⌨️ 이 부분도 직접 쳐 보세요</p>

```tsx
const [status, setStatus] = useState<Status>("loading");
```

- Replace the fetch chain so it records the outcome. The `res.ok` check is the one from Week 5: `fetch` only rejects when the network fails, so a 404 has to be turned into an error by hand.


<p class="typeit sm">⌨️ 이 부분도 직접 쳐 보세요</p>

```tsx
fetch(URL)
  .then((res) => {
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return res.json();
  })
  .then((json: User[]) => {
    setUsers(json);
    setStatus("ready");
  })
  .catch(() => setStatus("error"));
```

- Replace the `if (loading)` block with one return per state.


<p class="typeit sm">⌨️ 이 부분도 직접 쳐 보세요</p>

```tsx
if (status === "loading") {
  return (
    <View style={styles.center}>
      <ActivityIndicator size="large" />
    </View>
  );
}

if (status === "error") {
  return (
    <View style={styles.center}>
      <Text>Could not load the users. Check your connection.</Text>
    </View>
  );
}
```

- Run it. Same screen as before. Now change `setStatus("ready")` to `setStatus("done")`. Hover: `Argument of type '"done"' is not assignable to parameter of type 'Status'`. A typo in a status string is a compile error, not a screen that is stuck on the spinner.
- Change the URL to `https://jsonplaceholder.typicode.com/nothing` and run it. The server answers 404, the `res.ok` check throws, and the error screen shows. Without that check, the 404 body parses as an empty object and the list quietly renders nothing. Put both back.

**🇰🇷 한글 해설**

```tsx
type Status = "loading" | "ready" | "error";
const [status, setStatus] = useState<Status>("loading");
```
- 화면 상태가 3개(로딩, 완료, 에러)면 boolean으로는 못 담아요. `type`은 `interface`와 비슷한데 **객체가 아닌 것에도** 이름을 붙일 수 있어요. 문자열 리터럴 유니언 = 이 세 값 중 하나만 허용.
- fetch 체인: `if (!res.ok) throw new Error(...)`. **fetch는 404여도 reject하지 않아요(네트워크가 끊길 때만)**. 그래서 직접 던져야 `.catch`로 가요. Test 3 문제 1의 error 조건이 이 부분이에요.
- `if (status === "loading") return ...;`, `if (status === "error") return ...;` 상태마다 early return 하나씩.
- 실험: `setStatus("done")` → 에러(`"done"`은 `Status`가 아님). 오타가 있으면 스피너에서 영원히 멈추는 대신 **컴파일 에러**가 나요. URL을 `/nothing`으로 바꾸면 404 → `res.ok` 체크가 던져서 에러 화면.

<div class="pt" id="practice-13"></div>

#### 💻 Step 3 - The Payoff

- In `renderItem`, change `item.email` to `item.emial`. Squiggle: `Property 'emial' does not exist on type 'User'`. In the JavaScript version that line renders an empty `Text` and nobody notices until a user does.
- Fix the typo. That one squiggle is the whole argument for typing API data.

**🇰🇷 한글 해설**

`item.emial` 오타 → `Property 'emial' does not exist on type 'User'`. JS였다면 빈 `Text`가 조용히 그려져서 사용자가 알려 줄 때까지 몰랐을 거예요. **API 데이터에 타입을 붙이는 이유가 이 한 줄에 다 들어 있어요.**

#### 💻 Finished Code

- Compare against this if something is not working.

```tsx
import { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  StyleSheet,
} from "react-native";

const URL = "https://jsonplaceholder.typicode.com/users";

interface User {
  id: number;
  name: string;
  email: string;
  company: { name: string };
}

type Status = "loading" | "ready" | "error";

export default function MyApp() {
  const [users, setUsers] = useState<User[]>([]);
  const [status, setStatus] = useState<Status>("loading");

  useEffect(() => {
    fetch(URL)
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then((json: User[]) => {
        setUsers(json);
        setStatus("ready");
      })
      .catch(() => setStatus("error"));
  }, []);

  if (status === "loading") {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (status === "error") {
    return (
      <View style={styles.center}>
        <Text>Could not load the users. Check your connection.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={users}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }: { item: User }) => (
          <View style={styles.row}>
            <Text style={styles.name}>{item.name}</Text>
            <Text style={styles.detail}>{item.email}</Text>
            <Text style={styles.detail}>{item.company.name}</Text>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingTop: 60 },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  row: { padding: 20, borderBottomWidth: 1, borderColor: "#ddd" },
  name: { fontSize: 18, fontWeight: "600" },
  detail: { fontSize: 14, color: "#666" },
});
```

▶ 이 코드는 `useState<...>()` 같은 TypeScript 문법이 있어서 Snack의 `App.js`에서는 에러가 나요. [Snack](https://snack.expo.dev)을 새로 열고 왼쪽 파일 목록에서 `App.js` 메뉴(점 세 개) → **Rename to App.tsx** 한 번 한 뒤 붙여 넣으세요. 빨간 줄(squiggle)이 타입 에러 표시이고, 앱은 그래도 실행돼요.

**🇰🇷 한글 해설**

**확인 포인트**: `interface User`, `type Status`, `useState<User[]>([])`, `useState<Status>("loading")`, `res.ok` 체크, `.catch(() => setStatus("error"))`, `({ item }: { item: User })`. 이 코드가 Test 3 문제 1(fetch + FlatList)의 뼈대와 거의 같아요.

### 💻 Example: any and unknown

- Paste these lines above `MyApp` in any of the examples.


<p class="typeit" id="practice-14">⌨️ <b>이 코드는 Snack에서 직접 쳐 보세요</b>: let value: any = &quot;hello&quot;; value = 123; value.toUpperCase(); 를 붙여 보고 any를 unknown으로 바꾸기</p>

```ts
let value: any = "hello";
value = 123;
value.toUpperCase();
```

**🇰🇷 한글 해설**

`any`와 `unknown`의 차이를 보여 주는 실험이에요.
- `any`: 검사를 **끔**. 숫자를 넣고 `value.toUpperCase()`를 불러도 빨간 줄이 없지만 **실행하면 `value.toUpperCase is not a function`으로 앱이 죽어요**. TS가 막으려던 바로 그 에러를 `any`가 통과시킨 거예요.
- `unknown`: 뭐든 받지만 **무엇인지 확인하기 전에는 못 써요**.

#### 💻 What to Show

1. No squiggles anywhere. `any` tells TypeScript to stop checking this variable, so reassigning a number is fine and calling a string method on it is fine.
2. Run it. The app crashes with `value.toUpperCase is not a function`. That is the runtime error TypeScript exists to prevent, and `any` let it through.
3. Change `any` to `unknown`. Now `value.toUpperCase()` has a squiggle: `'value' is of type 'unknown'`. `unknown` also accepts anything, but it will not let you use the value until you have checked what it is.

```ts
if (typeof value === "string") {
  value.toUpperCase();
}
```

4. Inside the `if`, TypeScript knows `value` is a string, so the call is allowed. The check narrows the type.
5. Delete the lines before moving on. The lesson: when you reach for `any` to make a squiggle go away, you have switched off the thing that found the bug.

**🇰🇷 한글 해설**

1. `any`면 빨간 줄 없음. 2. 실행하면 크래시. 3. `unknown`으로 바꾸면 `'value' is of type 'unknown'` 에러.
4. `if (typeof value === "string") { value.toUpperCase(); }` 안에서는 TS가 `string`임을 알아서 허용 (**type narrowing**, 확인하면 타입이 좁혀짐).
5. 교훈: 빨간 줄을 없애려고 `any`를 쓰면 **버그를 찾아 주는 기능을 꺼 버린** 거예요.

### 💻 TypeScript Checklist

- Rename `App.js` to `App.tsx` and let the squiggles guide you. Red means TypeScript found something; the app will still run.
- Let TypeScript infer when the value is obvious: `useState(0)`, `useState("")`, a mapped array, a string.
- Annotate state that starts as `[]` or `null`: `useState<string[]>([])`, `useState<User | null>(null)`.
- Give every component with props an interface named after it, `StatProps`. Mark optional props with `?` and give them a default.
- Describe API data with an interface before you fetch it, and only the fields you use. Give `FlatList` rows the type too: `({ item }: { item: User })`.
- Use a union of string literals for a value with a fixed set of options, like a status.
- Named event handlers need parameter types: `(text: string)`. Inline arrows in JSX usually do not.
- Avoid `any`. If you really do not know the type yet, `unknown` keeps the checker on.
- Keep the Week 2 updater rule: `setCount((prev) => prev + 1)`. TypeScript checks the types, not the logic.

**🇰🇷 한글 해설**

**시험 전 TypeScript 요약**
- `App.js` → `App.tsx`로 바꾸고 빨간 줄을 길잡이로 삼기. 빨간 줄이 있어도 앱은 실행돼요.
- 값이 뻔하면 추론에 맡기기: `useState(0)`, `useState("")`.
- **`[]`나 `null`로 시작하는 state는 타입 적기**: `useState<string[]>([])`, `useState<User | null>(null)`.
- props가 있는 컴포넌트는 `StatProps`처럼 **이름 + Props** interface. 선택 prop은 `?`, 기본값 같이.
- API 데이터는 fetch 전에 interface로 설명(쓰는 필드만). `FlatList`의 `renderItem`도 `({ item }: { item: User })`.
- 선택지가 정해진 값(상태 등)은 문자열 리터럴 유니언 `"loading" | "ready" | "error"`.
- 이름 붙인 핸들러는 매개변수 타입 필수: `(text: string)`. JSX 안 인라인 화살표는 보통 생략.
- `any`는 피하고, 모르면 `unknown`.
- Week 2의 업데이터 규칙은 그대로: `setCount((prev) => prev + 1)`. TS는 타입만 검사하고 **로직은 검사 안 해요**.


---

## 5. 📘 코스노트: Introduction to Expo Router

<div class="sum" data-kind="type">

**🧭 먼저 한국어로** · ⌨️ Snack에서 직접 쳐 보기

app 폴더 구조로 화면을 만드는 Expo Router예요. VS Code의 로컬 Expo 프로젝트에서 직접 만들어 보세요.

**이 챕터 구성**

- 👀 **What is Expo Router?**: React Navigation은 `NavigationContainer`, `Stack.Screen`을 코드로 하나하나 등록해야 했어요.
- 👀 **Why Use Expo Router?**: 화면 = 파일: 파일 경로가 곧 화면 주소.
- 👀 **Core Concepts & File Conventions**: 프로젝트 루트의 `app/` 폴더 안 파일 하나하나가 경로(route)가 돼요.
- 👀 **Core Concepts & File Conventions › 1. The Entry Point: `index.tsx`**: `index` = 그 폴더의 기본 화면. 웹사이트의 `index.html`과 같아요.
- 👀 **Core Concepts & File Conventions › 2. Layout Files: `_layout.tsx`**: `_layout` = 같은 폴더의 화면들을 감싸는 틀.
- 👀 **Core Concepts & File Conventions › 3. Route Groups: `(directory-name)`**: 괄호 폴더 = 정리용 폴더. 경로에서 이름이 사라져요.
- 👀 **Core Concepts & File Conventions › 4. Dynamic Routes: `[id].tsx`**: 대괄호 = 값이 바뀌는 자리. `app/profile/[id].tsx` 하나로 `/profile/123`, `/profile/steve` 모두 처리.
- 👀 **Structural Visualization: Layouts vs. Screens**: 파일 트리가 실제 화면 구조로 어떻게 바뀌는지 보는 부분.
- 👀 **Structural Visualization: Layouts vs. Screens › Example Directory Architecture**: 읽는 연습 (시험에 "이 파일의 경로는?"이 나올 수 있어요)
- 👀 **Setting Up Expo Router**: Week 8 앞부분과 같은데 템플릿만 다름: `npx create-expo-app@latest MyRouterApp --template tabs`.
- 👀 **Running Your New App**: 실행 방법은 위 Expo 노트와 같아요(Expo Go로 QR).
- 👀 **Understanding the Default File Architecture**: `(tabs)/_layout.tsx`: 아래 탭 바 설정.
- 👀 **Begin implementing a Product Shop application**: 여기부터 Product Shop 앱을 단계별로 만들어요: 탭 설정 → 설정 화면 → Jotai로 상품 목록 → 상품 목록 화면 → `[id]` 상세 화면 → 탭 안 Stack으로 고치기.
- 👀 **Begin implementing a Product Shop application › Configure Tabs**: 두 번째 탭을 Settings로 바꾸기
- 👀 **Begin implementing a Product Shop application › Update the Settings Screen**: `settings.tsx`를 덮어써서 컴포넌트 이름을 `SettingsScreen`으로, 제목을 "Settings"로.
- 👀 **Begin implementing a Product Shop application › Install Jotai and Configure a Product List**: Jotai로 상품 목록을 전역 state로 (Week 4에서 배운 Jotai 그대로)
- 👀 **Begin implementing a Product Shop application › Update Tab One - Make it the Product Shop**: 코드 해설 (Week 5 FlatList + Week 4 Jotai + 새로운 `Link`)
- 👀 **Begin implementing a Product Shop application › Create the Dynamic Product Details Screen**: `app/product/[id].tsx` 해설
- 👀 **Begin implementing a Product Shop application › Checkpoint & Architecture Review**: 지금까지: 탭 2개, Jotai 전역 상품 목록, `[id]` 동적 상세 화면.
- 👀 **Resolving the Issues: Building a Tab-Nested Stack**: 루트의 `product/` 폴더를 없애고, 첫 번째 탭 안에 Stack을 중첩해요.
- 👀 **Resolving the Issues: Building a Tab-Nested Stack › Step 1: Restructure Your Directories**: `app/(tabs)/products/` 폴더 만들기.
- 👀 **Resolving the Issues: Building a Tab-Nested Stack › Step 2: Create the Products Stack Layout**: `(tabs)/products/_layout.tsx` 해설
- 👀 **Resolving the Issues: Building a Tab-Nested Stack › Step 3: Update the Root Tabs Layout**: `(tabs)/_layout.tsx` 수정
- 👀 **Resolving the Issues: Building a Tab-Nested Stack › Step 4: Fix Relative Links**: 링크 주소를 새 구조에 맞게 `/products/${item.id}` 로.
- 👀 **Summary: What You Learned › 1. File-Based Routing with Expo Router**: 파일 트리 = 화면 구조. `_layout.tsx`가 틀, `(tabs)` 같은 괄호 폴더는 경로에 안 나옴.
- 👀 **Summary: What You Learned › 2. State Splitting with Jotai**: 상품 데이터를 화면 안 배열이 아니라 atom(전역) 에 두고 목록과 상세 화면이 같이 읽어요.
- 👀 **Summary: What You Learned › 3. Dynamic Screen Rendering**: `[id].tsx` 하나가 모든 상품 상세를 담당, 값은 `useLocalSearchParams`.
- 👀 **Summary: What You Learned › 4. Advanced Tab-to-Stack Architecture**: 상세 화면을 탭 밖에 두면 탭 바가 사라져요. 탭 폴더 안에 Stack(`_layout.tsx`)을 중첩하면 탭 바 유지 + 깔끔한 제목 + 뒤로 가기.

</div>

> 원문 출처: https://seneca-ictoer.github.io/WEB530/H-Expo/expo-router

**🇰🇷 한글 해설**

**Expo Router** = **파일 기반 라우팅(file-based routing)**. Week 4 React Navigation 위에 만들어졌어요.
핵심 한 줄: **"폴더/파일 구조 = 앱의 화면 구조"**. Next.js 같은 웹 프레임워크와 같은 아이디어예요.

### 📘 What is Expo Router?

Expo Router is a powerful, file-based routing framework built on top of **React Navigation**. If you have ever used web frameworks like Next.js, Remix, or Nuxt, the concept will feel immediately familiar: **your file structure determines your application's navigation structure.**

Instead of writing hundreds of lines of boilerplate code to manually configure navigation containers, stacks, and screen listeners in JavaScript, you simply organize your files into directories. Expo Router automatically translates that directory structure into fully functioning native navigation paradigms for iOS and Android.

**🇰🇷 한글 해설**

React Navigation은 `NavigationContainer`, `Stack.Screen`을 코드로 하나하나 등록해야 했어요. Expo Router는 **`app/` 폴더에 파일을 만들기만 하면** 그게 화면이 되고, iOS/Android의 진짜 네이티브 내비게이션으로 바뀌어요.

### 📘 Why Use Expo Router?

* **Screens are just files:** The directory path of your code file matches the screen's route.
* **Deep Linking by Default:** Because every screen has a distinct "URL path" under the hood, your app inherently supports deep linking (e.g., launching the app directly to a specific product page from a web link).
* **Native Performance:** While it uses file paths like a web browser, it renders **100% native platform components** underneath. It utilizes standard iOS and Android transitions, gestures, and animations.
* **Type Safety:** It can automatically generate TypeScript types for your routes, preventing broken links at compile time.

**🇰🇷 한글 해설**

**장점 4가지**
1. **화면 = 파일**: 파일 경로가 곧 화면 주소.
2. **딥 링크 기본 지원**: 모든 화면에 URL 같은 주소가 있어서, 웹 링크로 앱의 특정 상품 페이지를 바로 열 수 있어요.
3. **네이티브 성능**: 주소는 웹처럼 쓰지만 화면은 100% 네이티브 컴포넌트와 애니메이션.
4. **타입 안전**: 경로 타입을 자동 생성해서 잘못된 링크를 미리 잡아요.

### 📘 Core Concepts & File Conventions

Expo Router relies on a dedicated directory at the root of your project named `app/`. Every file created inside this folder becomes a route.

To build complex mobile interfaces (like tab bars, headers, and slide-out menus), Expo Router uses specific naming conventions:

**🇰🇷 한글 해설**

프로젝트 루트의 **`app/`** 폴더 안 파일 하나하나가 경로(route)가 돼요. 특수한 이름 규칙 4가지가 아래 1~4번이에요. (맨 위 0번 표에 정리)

#### 📘 1. The Entry Point: `index.tsx`

A file named `index` represents the root or "homepage" of that specific directory level.

* `app/index.tsx` matches the root path `/` (the very first screen the user sees when opening the app).
* `app/settings/index.tsx` matches the path `/settings`.

**🇰🇷 한글 해설**

`index` = 그 폴더의 **기본 화면**. 웹사이트의 `index.html`과 같아요.

#### 📘 2. Layout Files: `_layout.tsx`

Layout files are used to wrap around a collection of child screens. They allow you to define a shared user interface element-such as a **Native Stack Header** or a **Bottom Tab Bar**, that persists across multiple pages.

* A `_layout` file applies to every single sibling file and sub-folder within its directory.
* Inside a layout file, you render a `<Slot />` component (to simply pass through the current child screen) or specific structural components like `<Stack />` or `<Tabs />`.

**🇰🇷 한글 해설**

**`_layout`** = 같은 폴더의 화면들을 **감싸는 틀**. 헤더(Stack)나 아래 탭 바(Tabs)처럼 여러 화면에 계속 보이는 UI를 여기서 정해요.
- 같은 폴더의 **모든 파일과 하위 폴더**에 적용.
- 안에 `<Slot />`(그냥 현재 화면을 통과시킴), `<Stack />`, `<Tabs />` 중 하나를 그려요.

#### 📘 3. Route Groups: `(directory-name)`

Sometimes you need to organize files into folders for shared layouts *without* altering the URL path. Parentheses tell Expo Router to completely ignore that folder name in the URL path.

* **Example:** A folder named `app/(auth)/login.tsx` maps to the path `/login` (the `(auth)` is ignored in the route).
* This allows you to easily separate your user experience into logical sections, such as `(auth)` for login screens and `(tabs)` for your main dashboard, giving each section its own isolated layout configuration.

**🇰🇷 한글 해설**

**괄호 폴더** = 정리용 폴더. **경로에서 이름이 사라져요**. `app/(auth)/login.tsx`는 `/auth/login`이 아니라 **`/login`**.
용도: `(auth)`는 로그인 화면들, `(tabs)`는 메인 화면들처럼 **구역마다 다른 레이아웃**을 주려고.

#### 📘 4. Dynamic Routes: `[id].tsx`

To capture dynamic parameters (like an ID for an article or a user profile handle), wrap the filename in square brackets.

* `app/profile/[id].tsx` maps to `/profile/123` or `/profile/steve`.
* You can access that dynamic parameter inside the component using the `useLocalSearchParams()` hook.

**🇰🇷 한글 해설**

**대괄호** = 값이 바뀌는 자리. `app/profile/[id].tsx` 하나로 `/profile/123`, `/profile/steve` 모두 처리.
값은 컴포넌트 안에서 **`useLocalSearchParams()`** 로 꺼내요. (Week 4의 `route.params`와 같은 역할)

### 📘 Structural Visualization: Layouts vs. Screens

To understand how individual files assemble into a real mobile app, look at how an `app/` folder translates to the visual hierarchy on a device screen:

**🇰🇷 한글 해설**

파일 트리가 실제 화면 구조로 어떻게 바뀌는지 보는 부분.

#### 📘 Example Directory Architecture

Here is what a typical, robust production app structure looks like using these conventions:

```jsx
app/
├── _layout.tsx         # Global configurations (Themes, Global Context providers)
├── (auth)/             # Group for authentication screens
│   ├── _layout.tsx     # Stack layout (hides headers for login)
│   ├── login.tsx       # Maps to route: /login
│   └── register.tsx    # Maps to route: /register
├── (tabs)/             # Group for main application workflow
│   ├── _layout.tsx     # Bottom Tabs Layout configuration
│   ├── index.tsx       # Home Tab. Maps to route: /
│   └── explore.tsx     # Explore Tab. Maps to route: /explore
└── details/            # Standard sub-directory
    └── [id].tsx        # Dynamic Route. Maps to route: /details/42
```

**🇰🇷 한글 해설**

**읽는 연습** (시험에 "이 파일의 경로는?"이 나올 수 있어요)
- `app/(auth)/login.tsx` → `/login` (괄호 무시)
- `app/(tabs)/index.tsx` → `/` (괄호 무시 + index)
- `app/(tabs)/explore.tsx` → `/explore`
- `app/details/[id].tsx` → `/details/42` (괄호 없는 일반 폴더는 경로에 남음)
- `_layout.tsx`는 화면이 아니라 **틀**이라서 경로가 없어요.

### 📘 Setting Up Expo Router

1. Start VS Code.
2. Choose `File`, `Open Folder...`. It is recommended you choose an empty folder however you will create a new folder for your application in the next step.
3. Create a project with Router included: `npx create-expo-app@latest MyRouterApp --template tabs` (where `MyRouterApp` refers to the name of the application folder you want to create).

* `Ok to proceed? (y)` - You may be asked to install packages, press `y` or `ENTER` to install the packages and proceed.
* `Select an Expo SDK version` - Choose `For learning with Expo Go (SDK 54)`.
* The installation may take a minute or two to complete.

4. Move into the project folder: `cd MyRouterApp`.
5. Start the development server: `npx expo start --tunnel`.

* If asked, install `@expo/ngrok`.

⚠️ It is not uncommon to receive an error like:
`CommandError: Please install @expo/ngrok@^4.1.0 and try again`

💡If you receive the above message, try installing `ngrok` manually:
`npm install -g @expo/ngrok@4.1.0`
`npm install --save-dev @expo/ngrok@^4.1.0`

**🇰🇷 한글 해설**

Week 8 앞부분과 같은데 템플릿만 다름: **`npx create-expo-app@latest MyRouterApp --template tabs`**. `tabs` 템플릿에 Expo Router가 이미 들어 있어요.

### 📘 Running Your New App

You can run your app in several ways:

* On your phone (recommended)
  + Install Expo Go from the App Store or Google Play
  + Scan the QR code from Expo Dev Tools
  + Your app loads instantly

On a simulator/emulator

* iOS Simulator (macOS only)
* Android Emulator (optional)

💡 If you receive an error that Expo Go needs to be updated on your device,
it may be that the version available in the store is outdated. You can manually
install the latest version by going to (<https://expo.dev/go>).

**🇰🇷 한글 해설**

실행 방법은 위 Expo 노트와 같아요(Expo Go로 QR).

### 📘 Understanding the Default File Architecture

Open your project in VS Code. The default template structures your navigation files within the `app/` directory like this:

```jsx
app/
├── (tabs)/             <-- Route Group for your main application screens
│   ├── _layout.tsx     <-- This file defines and configures the visual bottom tab bar.
│   ├── index.tsx       <-- Because this is named index, it acts as the default root path (/) for your application.
│   └── two.tsx         <-- This maps directly to the /two path. The _layout.tsx file hooks this up to show as the second icon on your bottom tab bar.
├── _layout.tsx         <-- Global Root Layout file.
├── +html.tsx           <-- Expo Router supports iOS, Android, and Web. This file is used strictly for web builds.
├── +not-found.tsx      <-- Custom fallback screen if a route does not exist
└── modal.tsx           <-- In the default template, usually configured to slide up from the bottom as a native modal overlay.
```

**🇰🇷 한글 해설**

**tabs 템플릿 기본 구조**
- `(tabs)/_layout.tsx`: 아래 **탭 바** 설정.
- `(tabs)/index.tsx`: 첫 번째 탭, 경로 `/`.
- `(tabs)/two.tsx`: 두 번째 탭, 경로 `/two`.
- `_layout.tsx`(루트): 앱 전체 설정.
- `+html.tsx`: **웹 빌드 전용**. `+not-found.tsx`: 없는 경로일 때 보여 줄 화면(404). `+`로 시작하면 특수 파일.
- `modal.tsx`: 아래에서 올라오는 모달 화면.

### 📘 Begin implementing a Product Shop application



**🇰🇷 한글 해설**

여기부터 **Product Shop** 앱을 단계별로 만들어요: 탭 설정 → 설정 화면 → Jotai로 상품 목록 → 상품 목록 화면 → `[id]` 상세 화면 → 탭 안 Stack으로 고치기.

#### 📘 Configure Tabs

1. In the VS Code file explorer, expand the `app` folder, and then expand the `(tabs)` folder.
2. Right-click on `two.tsx` and select `Rename`.
3. Change the name to `settings.tsx` and press Enter.

💡 What just happened? Expo Router instantly changed your app's internal URL route from `/two` to `/settings`. If you were to look at your app right now, the second tab might throw an error or disappear because the layout file is still looking for the old path! Let's fix that.

4. Open `app/(tabs)/_layout.tsx`.
5. Look inside the file for the `<Tabs>` component. You will see a `<Tabs.Screen>` entry specifically configured for `two`.
6. Change the `name` property from `two` to `settings`.
7. Change the `title` property to `Settings` so the text under the icon looks correct on your screen.
8. Change the icon to display as a gear.

```jsx
<Tabs.Screen
  name="settings"
  options={{
    title: 'Settings',
    tabBarIcon: ({ color }) => <TabBarIcon name="cog" color={color} />,
  }}
/>
```

9. Locate the `<Tabs.Screen>` entry where `name="index"`.
10. Update the `title` to `Products` and swap out the `tabBarIcon` for a shopping cart icon.

```jsx
tabBarIcon: ({ color }) => <TabBarIcon name="shopping-cart" color={color} />;
```

**🇰🇷 한글 해설**

**두 번째 탭을 Settings로 바꾸기**
1. `two.tsx` → `settings.tsx`로 이름 변경. 이 순간 경로가 `/two` → `/settings`로 바뀌어요.
2. 그런데 `_layout.tsx`는 아직 `name="two"`를 찾고 있어서 탭이 깨져요 → **`name="settings"`**, `title: 'Settings'`, 아이콘 `cog`(톱니바퀴)로 수정.
3. 첫 탭(`name="index"`)은 제목 `Products`, 아이콘 `shopping-cart`.

💡 교훈: **파일 이름 = 경로 = `Tabs.Screen`의 name**. 셋이 항상 같아야 해요.

#### 📘 Update the Settings Screen

1. Open `app/(tabs)/settings.tsx`.
2. Overwrite the contents of the file with the following TypeScript.

* Change component name to `SettingsScreen`.
* Clean up the copy, so that our screen appears as a settings screen instead.

```jsx
import { StyleSheet } from 'react-native';

import EditScreenInfo from '@/components/EditScreenInfo';
import { Text, View } from '@/components/Themed';

export default function SettingsScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Settings</Text>
      <View style={styles.separator} lightColor="#eee" darkColor="rgba(255,255,255,0.1)" />
      <EditScreenInfo path="app/(tabs)/settings.tsx" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: '80%',
  },
});
```

▶ 이 코드는 다른 파일(또는 Expo Router의 app 폴더 구조)이 필요해서 Snack 한 파일로는 실행되지 않아요. VS Code 로컬 Expo 프로젝트에서 해당 파일에 붙여 넣어 실행하세요.

**🇰🇷 한글 해설**

**코드 해설**: `settings.tsx`를 덮어써서 컴포넌트 이름을 `SettingsScreen`으로, 제목을 "Settings"로.
- `@/components/Themed`의 `Text`, `View`: 템플릿이 만든 **다크 모드 대응** 컴포넌트(`lightColor`, `darkColor` props).
- `@/` = 프로젝트 루트 별칭. 그래서 이 코드는 Snack에서 못 돌려요.

#### 📘 Install Jotai and Configure a Product List

Let's install Jotai and configure it to store our 'hardcoded' product list.

1. Run the following command in your project terminal to install the package: `npm install jotai`.
2. It is a best practice to keep your state files separated from your UI view files. Create a dedicated folder and file for your global atoms.
3. In your project root, create a new folder named `store`.
4. Inside that folder, create a new file named `productsAtom.ts`.
5. Paste the following code into `/store/productsAtom.ts`.

```jsx
import { atom } from 'jotai';

// Define a TypeScript interface for your product structure
export interface Product {
  id: string;
  name: string;
  price: number;
  description: string;
}

// Create a read-only atom containing your hardcoded list of products
export const productsAtom = atom<Product[]>([
  {
    id: '1',
    name: 'Wireless Noise-Canceling Headphones',
    price: 299.99,
    description: 'Immersive sound with premium comfort and long battery life.',
  },
  {
    id: '2',
    name: 'Mechanical Gaming Keyboard',
    price: 129.99,
    description: 'Tactile blue switches with customizable RGB backlighting.',
  },
  {
    id: '3',
    name: 'Ergonomic Wireless Mouse',
    price: 79.99,
    description: 'Precision tracking designed to reduce wrist strain during long sessions.',
  },
  {
    id: '4',
    name: 'Ultra-Wide 4K Monitor',
    price: 449.99,
    description: 'Stunning crystal-clear display perfect for multitasking and gaming.',
  },
]);
```

**🇰🇷 한글 해설**

**Jotai로 상품 목록을 전역 state로** (Week 4에서 배운 Jotai 그대로)
- `npm install jotai`로 설치(Snack은 자동이었지만 로컬은 직접 설치).
- **state 파일은 화면 파일과 분리**하는 게 좋은 습관 → 루트에 `store/` 폴더, 안에 `productsAtom.ts`.
- `export interface Product { id: string; name: string; price: number; description: string; }`: 위 TS 노트의 **interface**로 상품 모양 정의.
- `atom<Product[]>([...])`: "Product 배열"을 담는 atom. 지금은 하드코딩, 나중에 Firebase에서 가져와요.

#### 📘 Update Tab One - Make it the Product Shop

1. Open `app/(tabs)/index.tsx`.
2. Overwrite the contents of the file with the following TypeScript to hook up your Jotai store.

```jsx
import { StyleSheet, Text, View, FlatList, TouchableOpacity } from 'react-native';
import { Link } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAtomValue } from 'jotai';
import { productsAtom } from '@/store/productsAtom';

export default function ShopScreen() {
  // Read the product list directly from your global Jotai store
  const products = useAtomValue(productsAtom);

  return (
    <SafeAreaView style={styles.container} edges={['left', 'right']}>
      <Text style={styles.heading}>Available Hardware</Text>

      <FlatList
        data={products}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          // Link navigates completely outside the tab directory to the product stack folder
          <Link href={`/product/${item.id}`} asChild>
            <TouchableOpacity style={styles.card}>
              <View style={styles.infoContainer}>
                <Text style={styles.prodName}>{item.name}</Text>
                {/* Dynamically formatting the numeric price from the atom */}
                <Text style={styles.prodPrice}>${item.price.toFixed(2)}</Text>
              </View>
              <Text style={styles.arrow}>View →</Text>
            </TouchableOpacity>
          </Link>
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingHorizontal: 16, backgroundColor: '#f5f5f7' },
  heading: {
    fontSize: 22,
    fontWeight: 'bold',
    marginTop: 16,
    marginBottom: 16,
    color: '#1c1c1e',
  },
  card: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    elevation: 1,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 4,
  },
  infoContainer: {
    flex: 1,
    paddingRight: 8,
  },
  prodName: { fontSize: 16, fontWeight: '600', color: '#1c1c1e' },
  prodPrice: { fontSize: 14, color: '#007AFF', marginTop: 4 },
  arrow: { color: '#8e8e93', fontWeight: 'bold' },
});
```

▶ 이 코드는 다른 파일(또는 Expo Router의 app 폴더 구조)이 필요해서 Snack 한 파일로는 실행되지 않아요. VS Code 로컬 Expo 프로젝트에서 해당 파일에 붙여 넣어 실행하세요.

**🇰🇷 한글 해설**

**코드 해설** (Week 5 FlatList + Week 4 Jotai + 새로운 `Link`)
- `useAtomValue(productsAtom)`: atom을 **읽기만** 할 때. (`useAtom`은 `[값, set함수]`)
- `FlatList` + `keyExtractor` + `renderItem`: Week 5 그대로.
- **`<Link href={`/product/${item.id}`} asChild>`**: 누르면 그 경로로 이동. **`asChild`** = Link가 자기 대신 **안쪽 자식(`TouchableOpacity`)을 누르는 대상**으로 쓰라는 뜻. 그래서 카드 전체가 버튼이 돼요.
- `item.price.toFixed(2)`: 소수점 둘째 자리(299.99).
- `SafeAreaView edges={['left','right']}`: 노치 피하기, 위아래는 헤더/탭이 처리하니 좌우만.

#### 📘 Create the Dynamic Product Details Screen

To separate our detail view from our main navigation screens, we will create a dynamic route outside of the route group. This ensures the bottom tab bar hides when viewing a specific product.

1. Inside your `app/` directory, create a new folder named `product`.
2. Inside the `app/product/` folder, create a new file named `[id].tsx`.
3. Overwrite the contents of `app/product/[id].tsx` with the following code to hook it into the global Jotai atom state:

```jsx
import { StyleSheet, Text, View } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { useAtomValue } from 'jotai';
import { productsAtom } from '@/store/productsAtom';

export default function ProductDetailsScreen() {
  // Capture the specific dynamic URL segment string parameter
  const { id } = useLocalSearchParams<{ id: string }>();

  // Fetch the full global product list from Jotai
  const products = useAtomValue(productsAtom);

  // Look up item data details from our global atom state
  const product = products.find((p) => p.id === id);

  if (!product) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Product Not Found</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.detailBox}>
        <Text style={styles.idBadge}>SKU Code: {product.id}</Text>
        <Text style={styles.title}>{product.name}</Text>
        <Text style={styles.price}>${product.price.toFixed(2)}</Text>
        <Text style={styles.description}>{product.description}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#f5f5f7', justifyContent: 'center' },
  detailBox: {
    backgroundColor: '#fff',
    padding: 24,
    borderRadius: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 4,
  },
  idBadge: {
    fontSize: 11,
    color: '#8e8e93',
    fontWeight: 'bold',
    marginBottom: 8,
    textTransform: 'uppercase',
  },
  title: { fontSize: 24, fontWeight: 'bold', color: '#1c1c1e', marginBottom: 6 },
  price: { fontSize: 20, fontWeight: '600', color: '#007AFF', marginBottom: 16 },
  description: { fontSize: 15, color: '#48484a', lineHeight: 22 },
  errorText: { fontSize: 18, color: '#ff3b30', textAlign: 'center' },
});
```

▶ 이 코드는 다른 파일(또는 Expo Router의 app 폴더 구조)이 필요해서 Snack 한 파일로는 실행되지 않아요. VS Code 로컬 Expo 프로젝트에서 해당 파일에 붙여 넣어 실행하세요.

**🇰🇷 한글 해설**

**`app/product/[id].tsx` 해설**
- `const { id } = useLocalSearchParams<{ id: string }>();`: 주소의 `[id]` 자리 값을 꺼내요. `<{ id: string }>`은 TS로 "id는 문자열"이라고 알려 주는 것.
- `products.find((p) => p.id === id)`: 전역 목록에서 그 id의 상품 찾기. **id 하나만 넘기고 상세 데이터는 atom에서 찾는** 패턴이에요(Week 5 상세 화면과 같은 생각).
- 못 찾으면 `"Product Not Found"`를 먼저 return(**early return**).

#### 📘 Checkpoint & Architecture Review

At this point, your core application structure and data flow are fully functional:

* Two Distinct Tabs: A Products shop home screen and a Settings screen.
* Global State Management: Product data is safely lifted out of local UI components and centralized inside a Jotai atom.
* Dynamic Routing: Clicking any item in the `FlatList` reads its unique ID and redirects the user to a full-screen product breakdown.

However, if you interact with the application in its current state, you will notice two major navigation quirks that affect the user experience. Let's look at why they happen and how a Stack Navigator resolves them.

**Diagnosing the Core Navigation Issues**

```jsx
Current Behavior (No Stack Container):
[Products Tab Grid] ──(Click Product)──> [Full Screen View]
                                         ↳ ❌ Bottom Tabs Hidden
                                         ↳ ❌ Header displays "product/[id]"
```

**Issue 1:** Header displays `product/[id]` instead of a clean title

* Why it happens: When you navigate to a screen that doesn’t have a layout configuration file wrapping it, Expo Router has to guess what to show at the top of the screen. Because it has no instructions, it falls back to displaying the literal file system path of that page `product/[id]`.
* The Fix: By wrapping the dynamic file inside a native layout containing a `<Stack>` component, we can explicitly declare options (like title: "Product Details") for that specific file name.

**Issue 2:** The bottom tab bar is completely hidden

* Why it happens: Right now, our `[id].tsx` file lives completely outside of the `(tabs)/` directory. Because it is a completely separate root-level folder, navigating to `/product/1` pushes the user entirely out of the Tab navigation context, making it impossible to switch back to Settings without hitting a back button.
* The Fix: To fix this, we can introduce an architecture called a `Tab-to-Stack` flow. Instead of placing the product details screen out on its own, we will nestedly wrap our Products tab inside a `Stack Navigator`. This way, when a user pushes a new screen onto the stack, it animates natively inside the tab interface, keeping the bottom tab bar visible.

**The Strategy: Implementing a Stack Navigator**
To clean this up, we are going to modify our file architecture. We will introduce a local `_layout.tsx` file to group our store views and handle screen titles dynamically.

Here is how our visual route tree will change:

```jsx
Before (Loose Root Files):             After (Nested Stack Layout):
app/                                   app/
├── (tabs)/                            ├── (tabs)/
│   ├── index.tsx                      │   ├── _layout.tsx
│   └── settings.tsx                   │   ├── index.tsx  <-- (Nested Stack Start)
└── product/                           │   ├── [id].tsx   <-- (Pushed onto Stack)
    └── [id].tsx (Tabs hidden)         │   └── settings.tsx
```

**🇰🇷 한글 해설**

지금까지: 탭 2개, Jotai 전역 상품 목록, `[id]` 동적 상세 화면. 그런데 **문제 2개**가 있어요.

**문제 1. 헤더에 `product/[id]`가 그대로 보임**
- 이유: 이 화면을 감싸는 `_layout`이 없으니 Router가 제목을 몰라서 **파일 경로**를 보여 줘요.
- 해결: `<Stack>` 레이아웃으로 감싸고 `options={{ title: 'Product Details' }}`.

**문제 2. 아래 탭 바가 사라짐**
- 이유: `product/` 폴더가 `(tabs)/` **밖**에 있어서, 들어가면 탭 영역을 완전히 벗어나요.
- 해결: **Tab-to-Stack**. 상품 탭 **안에** Stack을 넣어서, 상세 화면이 탭 안에서 쌓이게(push) 하기. 그러면 탭 바가 계속 보여요.

마지막 그림이 바뀔 구조 전후 비교예요. (원문 그림은 `products/` 폴더를 생략해서 그렸는데, 실제로는 아래 Step 1처럼 `(tabs)/products/` 안에 들어가요.)

### 📘 Resolving the Issues: Building a Tab-Nested Stack

To ensure that our product details screen preserves the bottom tab bar and displays a clean native header, we must restructure our folder tree. We will remove the root-level `product/` directory and nest a dynamic stack directly inside the first tab.

**🇰🇷 한글 해설**

루트의 `product/` 폴더를 없애고, **첫 번째 탭 안에 Stack을 중첩**해요. 4단계예요.

#### 📘 Step 1: Restructure Your Directories

1. Inside `app/(tabs)/`, create a new folder named `products`.
2. Move your existing `app/(tabs)/index.tsx` file *into* this new `app/(tabs)/products/` folder.
3. Move your existing `app/product/[id].tsx` file *into* this new `app/(tabs)/products/` folder.
4. Delete the now-empty, root-level `app/product/` folder.

Your updated `app/(tabs)/` directory should now look exactly like this:

```jsx
app/
└── (tabs)/
├── products/          <-- The nested Stack container folder
│   ├── index.tsx      <-- The product list grid (Main tab screen)
│   └── [id].tsx       <-- Dynamic product details (Pushes onto stack)
├── _layout.tsx        <-- The global tab bar controller
└── settings.tsx       <-- Standalone settings tab screen
```

**🇰🇷 한글 해설**

**폴더 옮기기**
1. `app/(tabs)/products/` 폴더 만들기.
2. `(tabs)/index.tsx` → `(tabs)/products/index.tsx`로 이동.
3. `app/product/[id].tsx` → `(tabs)/products/[id].tsx`로 이동.
4. 빈 `app/product/` 삭제.

이제 경로: 목록 `/products`, 상세 `/products/1`.

#### 📘 Step 2: Create the Products Stack Layout

Now we need to define a local sub-layout file inside the `products/` folder. This configures the Stack Navigator to handle headers and back-navigation within this specific tab.

1. Inside `app/(tabs)/products/`, create a new file named `_layout.tsx`.
2. Paste the following code into it:

```jsx
import { Stack } from 'expo-router';

export default function ProductsLayout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: '#fff' },
        headerTintColor: '#007AFF',
        headerTitleStyle: { fontWeight: 'bold' },
      }}
    >
      {/* The main product list screen header */}
      <Stack.Screen name="index" options={{ title: 'Hardware Shop' }} />
      {/* The dynamic detail view screen header */}
      <Stack.Screen name="[id]" options={{ title: 'Product Details' }} />
    </Stack>
  );
}
```

**🇰🇷 한글 해설**

**`(tabs)/products/_layout.tsx` 해설**
- `<Stack screenOptions={...}>`: 이 폴더의 모든 화면에 공통 헤더 스타일. `headerTintColor`는 **뒤로 가기 버튼과 제목 색**.
- `<Stack.Screen name="index" options={{ title: 'Hardware Shop' }} />`: 목록 화면 제목.
- `<Stack.Screen name="[id]" options={{ title: 'Product Details' }} />`: 상세 화면 제목. **name은 파일 이름 그대로**(대괄호 포함!).

Week 4의 `<Stack.Navigator>` + `<Stack.Screen>`과 똑같은 모양인데, `component=` 가 없어요. **파일이 곧 컴포넌트**니까요.

#### 📘 Step 3: Update the Root Tabs Layout

Because we moved the root profile components into a subfolder, we must update our main tab controller file `app/(tabs)/_layout.tsx` so it targets the new folder directory name instead of the raw index file.

1. Open `app/(tabs)/_layout.tsx`.
2. Locate the first `<Tabs.Screen>` entry where `name="index"`.
3. Change the `name` property from "index" to "products".

Your updated tab configuration block should look like this:

```jsx
<Tabs.Screen
  name="products" // <-- Target the folder name instead of index
  options={{
    title: 'Products',
    headerShown: false, // Hides the outer tab header to prevent double-headers!
    tabBarIcon: ({ color }) => (
      <SymbolView
        name={{
          ios: 'cart.fill',
          android: 'shopping_cart',
          web: 'shopping-cart',
        }}
        tintColor={color}
        size={28}
      />
    ),
  }}
/>
```

**🇰🇷 한글 해설**

**`(tabs)/_layout.tsx` 수정**
- `name="index"` → **`name="products"`** (이제 파일이 아니라 **폴더 이름**을 가리켜요).
- **`headerShown: false`**: 탭의 헤더를 숨겨요. 안 그러면 탭 헤더 + Stack 헤더 **두 개**가 보여요(double header).
- `SymbolView`: 플랫폼마다 다른 아이콘 이름(iOS SF Symbols `cart.fill`, Android `shopping_cart`, Web `shopping-cart`)을 줄 수 있는 아이콘 컴포넌트.

#### 📘 Step 4: Fix Relative Links

Finally, we need to update the navigation link inside our product list grid file. Because `index.tsx` and `[id].tsx` are now sibling files residing in the exact same directory, the path context becomes direct.

1. Open `app/(tabs)/products/index.tsx`.
2. Locate the `<Link>` component wrapping your `TouchableOpacity` card.
3. Change the explicit root path link from `href={"/product/" + item.id}` to a dynamic, localized route template:

```jsx
<Link href={`/products/${item.id}`} asChild>
```

Save all open files and press `r` in your terminal to clear the caching bundle.

**🇰🇷 한글 해설**

링크 주소를 새 구조에 맞게 **`/products/${item.id}`** 로. 저장 후 터미널에서 **`r`** 을 눌러 리로드.

이제 흐름: 목록에서 카드 누름 → 탭 바는 그대로, 위 헤더에 "Product Details"와 **뒤로 가기** 버튼.

### 📘 Summary: What You Learned

Here is a summary of the core concepts, tools, and structural patterns you mastered in this lesson:

**🇰🇷 한글 해설**

**이번 주 4줄 요약**

#### 📘 1. File-Based Routing with Expo Router

* **Directory Layouts:** You learned that the file tree directly translates into application screens. Folders wrap logical scopes, files represent separate rendering targets, and components like `_layout.tsx` orchestrate contextual layouts across directories.
* **Route Groups `(tabs)`:** You leveraged parentheses to organically group code for structural clarity without affecting the app's clean URL matching patterns.

**🇰🇷 한글 해설**

파일 트리 = 화면 구조. `_layout.tsx`가 틀, `(tabs)` 같은 괄호 폴더는 경로에 안 나옴.

#### 📘 2. State Splitting with Jotai

* **Centralized Store:** You moved away from brittle local arrays inside screen layouts and decoupled the business logic.
* **Atomic Architecture:** By using **Atoms**, you discovered a lightweight state layer that efficiently streams structured types across multiple UI components (such as a multi-item grid list and an isolated detail card view).

**🇰🇷 한글 해설**

상품 데이터를 화면 안 배열이 아니라 **atom(전역)** 에 두고 목록과 상세 화면이 **같이** 읽어요.

#### 📘 3. Dynamic Screen Rendering

* **Variable Segments `[id].tsx`:** You configured dynamic param matching using brackets. This enables a single file layout to act as a placeholder, reading matching parameters straight from the router context (`useLocalSearchParams`).

**🇰🇷 한글 해설**

`[id].tsx` 하나가 모든 상품 상세를 담당, 값은 `useLocalSearchParams`.

#### 📘 4. Advanced Tab-to-Stack Architecture

* **Layout Isolation:** You learned how loose, directory-separate screens break out of the tab viewer, hiding global core UI components.
* **Nested Stacks:** By nesting a `<Stack>` navigator inside a single `<Tabs.Screen>` group folder, you completed an industry-standard navigation flow. This layout allows detail pages to natively animate, handles clean window titles, establishes system-provided back links, and preserves the visibility of the primary tab navigation bar at all times.

**🇰🇷 한글 해설**

상세 화면을 탭 밖에 두면 탭 바가 사라져요. **탭 폴더 안에 Stack(`_layout.tsx`)을 중첩**하면 탭 바 유지 + 깔끔한 제목 + 뒤로 가기. 실무 표준 구조예요.


---

## ✅ Week 8 시험 대비 체크리스트

1. Expo를 쓰는 이유 4가지? → 네이티브 설정 없음, 통합 API, OTA 업데이트, 한 코드로 Android/iOS/Web
2. Bare RN과 Expo(Managed)의 가장 큰 차이? → Bare는 네이티브 프로젝트 2개 직접 관리(iOS는 Mac 필요), Expo는 JS/TS만
3. `npx expo start`가 켜는 번들러 이름? → **Metro**. Expo Go는 "앱용 브라우저"
4. 새 프로젝트 명령? → `npx create-expo-app myapp --template blank` (Router는 `--template tabs`)
5. 학교 Wi-Fi에서 연결 안 될 때 옵션? → `--tunnel`
6. `interface Props { name: string; excited?: boolean }`에서 `?`의 뜻? → 선택(optional) prop
7. 빈 배열 state에 타입 주기? → `useState<Post[]>([])`
8. `useState(null)`로 시작하는 선택된 항목 state의 타입? → `useState<string | null>(null)` (유니언 `|` = 또는)
9. `useState([])`만 쓰면 `item.id`가 에러인 이유? → `never[]`로 추론돼서. `<User[]>`로 알려 줘야 함
10. 상태가 loading, ready, error 세 가지일 때 타입? → `type Status = "loading" | "ready" | "error"` (문자열 리터럴 유니언)
11. FlatList `renderItem`에서 item 타입 적기? → `({ item }: { item: User })`
12. 이름 붙인 `onChangeText` 핸들러의 매개변수 타입? → `(text: string)`, 반환 없음은 `: void`
13. `any`와 `unknown`의 차이? → any는 검사 끔(크래시 가능), unknown은 typeof로 확인해야 사용 가능
14. 타입 에러(빨간 줄)가 있으면 앱이 안 돌아가나? → 아니요, 돌아가요. 타입은 실행 전에 지워져요
15. `app/(auth)/login.tsx`의 경로? → `/login`
16. `app/settings/index.tsx`의 경로? → `/settings`
17. 동적 경로 파일 이름과 값 꺼내는 hook? → `[id].tsx`, `useLocalSearchParams()`
18. `_layout.tsx` 안에 그리는 세 가지? → `<Slot />`, `<Stack />`, `<Tabs />`
19. `<Link href="..." asChild>`의 `asChild`? → 자식 컴포넌트(TouchableOpacity)를 누르는 대상으로 사용
20. 상세 화면이 탭 밖에 있을 때 생기는 문제 2개와 해결? → 헤더에 파일 경로, 탭 바 사라짐 → 탭 안에 Stack 중첩
21. 탭 안 Stack에서 헤더가 두 개 보일 때? → 탭 쪽 `Tabs.Screen`에 `headerShown: false`
22. `useAtomValue`와 `useAtom`의 차이? → 읽기만 vs `[값, set함수]`

## ✍️ 손으로 써 보기: Mini Product Shop (Snack 한 파일 버전)

Expo Router는 Snack에서 폴더를 만들기 어려워서, **같은 구조를 Week 4 React Navigation으로 흉내 낸** 버전이에요. 아래 주석의 **"Expo Router라면"** 부분과 비교하면서 따라 쳐 보세요. TypeScript 문법(interface, 제네릭)도 같이 연습돼요.

```tsx
import { View, Text, FlatList, Pressable, StyleSheet, Switch } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { atom, useAtomValue, useAtom } from "jotai";

// store/productsAtom.ts 에 해당
interface Product {
  id: string;
  name: string;
  price: number;
  description: string;
}

// 파일에서는 atom<Product[]>([...]) 처럼 써도 돼요
const initialProducts: Product[] = [
  { id: "1", name: "Wireless Headphones", price: 299.99, description: "Immersive sound." },
  { id: "2", name: "Mechanical Keyboard", price: 129.99, description: "Tactile blue switches." },
  { id: "3", name: "Wireless Mouse", price: 79.99, description: "Reduces wrist strain." },
];
const productsAtom = atom(initialProducts);
const showPriceAtom = atom(true);

// app/(tabs)/products/index.tsx 에 해당
function ShopScreen({ navigation }: any) {
  const products = useAtomValue(productsAtom);
  const showPrice = useAtomValue(showPriceAtom);
  return (
    <FlatList
      data={products}
      keyExtractor={(item) => item.id}
      contentContainerStyle={{ padding: 16 }}
      renderItem={({ item }) => (
        // Expo Router라면: <Link href={`/products/${item.id}`} asChild>
        <Pressable
          style={({ pressed }) => [styles.card, pressed && { opacity: 0.6 }]}
          onPress={() => navigation.navigate("Details", { id: item.id })}
        >
          <View style={{ flex: 1 }}>
            <Text style={styles.name}>{item.name}</Text>
            {showPrice && <Text style={styles.price}>${item.price.toFixed(2)}</Text>}
          </View>
          <Text>View →</Text>
        </Pressable>
      )}
    />
  );
}

// app/(tabs)/products/[id].tsx 에 해당
function DetailsScreen({ route }: any) {
  // Expo Router라면: const { id } = useLocalSearchParams<{ id: string }>();
  const { id } = route.params;
  const products = useAtomValue(productsAtom);
  const product = products.find((p) => p.id === id);

  if (!product) {
    return <Text style={{ padding: 20 }}>Product Not Found</Text>;
  }
  return (
    <View style={styles.box}>
      <Text style={styles.sku}>SKU: {product.id}</Text>
      <Text style={styles.title}>{product.name}</Text>
      <Text style={styles.price}>${product.price.toFixed(2)}</Text>
      <Text>{product.description}</Text>
    </View>
  );
}

// app/(tabs)/settings.tsx 에 해당
function SettingsScreen() {
  const [showPrice, setShowPrice] = useAtom(showPriceAtom);
  return (
    <View style={styles.row}>
      <Text style={{ fontSize: 16 }}>Show prices</Text>
      <Switch value={showPrice} onValueChange={setShowPrice} />
    </View>
  );
}

// app/(tabs)/products/_layout.tsx 에 해당 (탭 안의 Stack)
const Stack = createNativeStackNavigator();
function ProductsStack() {
  return (
    <Stack.Navigator screenOptions={{ headerTintColor: "#007AFF" }}>
      <Stack.Screen name="Index" component={ShopScreen} options={{ title: "Hardware Shop" }} />
      <Stack.Screen name="Details" component={DetailsScreen} options={{ title: "Product Details" }} />
    </Stack.Navigator>
  );
}

// app/(tabs)/_layout.tsx 에 해당
const Tab = createBottomTabNavigator();
export default function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator>
        {/* headerShown: false 로 헤더 두 개 방지 */}
        <Tab.Screen name="Products" component={ProductsStack} options={{ headerShown: false }} />
        <Tab.Screen name="Settings" component={SettingsScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  card: { flexDirection: "row", alignItems: "center", backgroundColor: "#fff", padding: 16, borderRadius: 12, marginBottom: 12 },
  name: { fontSize: 16, fontWeight: "600" },
  price: { color: "#007AFF", marginTop: 4 },
  box: { margin: 20, padding: 24, backgroundColor: "#fff", borderRadius: 16, gap: 6 },
  sku: { fontSize: 11, color: "#8e8e93", fontWeight: "bold" },
  title: { fontSize: 22, fontWeight: "bold" },
  row: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", padding: 20 },
});
```

▶ 이 코드는 `useState<...>()` 같은 TypeScript 문법이 있어서 Snack의 `App.js`에서는 에러가 나요. [Snack](https://snack.expo.dev)을 새로 열고 왼쪽 파일 목록에서 `App.js` 메뉴(점 세 개) → **Rename to App.tsx** 한 번 한 뒤 붙여 넣으세요. 빨간 줄(squiggle)이 타입 에러 표시이고, 앱은 그래도 실행돼요.

**해설**
- **탭 안에 Stack**: `Products` 탭의 component가 화면이 아니라 `ProductsStack`(Stack 전체)이에요. 그래서 상세 화면으로 가도 아래 탭 바가 그대로 있어요. Expo Router에서 `(tabs)/products/_layout.tsx`가 하는 일과 같아요.
- **headerShown: false**: 이걸 빼 보세요. 위에 "Products" 헤더와 "Hardware Shop" 헤더가 **두 개** 겹쳐 보여요.
- **Jotai 공유**: Settings 탭에서 스위치를 끄면 Products 탭의 가격이 사라져요. 두 화면이 같은 atom(`showPriceAtom`)을 보기 때문이에요. 읽기만 하는 곳은 `useAtomValue`, 바꾸는 곳은 `useAtom`.
- **id만 넘기기**: 상세 화면에는 `id`만 넘기고 데이터는 atom에서 `find`. Expo Router의 `[id].tsx`도 똑같이 주소에는 id만 있어요.
- **TS 연습**: `interface Product`로 모양을 정하고 `const initialProducts: Product[]`로 "Product 배열"이라고 표시했어요. 원문처럼 `atom<Product[]>([...])`로 써도 같은 뜻인데, Snack의 `App.js`에서는 이 꺾쇠 문법이 에러가 나요(로컬 `.ts`/`.tsx` 파일에서는 문제없음). 그래서 변수에 타입을 붙이는 방식으로 바꿨어요. `{ navigation }: any`는 연습용으로 타입 검사를 끈 거예요(실제 프로젝트에선 Expo Router가 타입을 대신 만들어 줘요).

### 로컬에서 진짜 Expo Router로 해 보기

```bash
npx create-expo-app@latest MyRouterApp --template tabs
cd MyRouterApp
npm install jotai
npx expo start --tunnel
```

그다음 위 📘 원문의 순서대로 `store/productsAtom.ts` → `(tabs)/products/index.tsx` → `(tabs)/products/[id].tsx` → `(tabs)/products/_layout.tsx` → `(tabs)/_layout.tsx`의 `name="products"` 순서로 만들어 보세요.
