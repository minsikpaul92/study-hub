# Week 8. Expo 로컬 개발 + TypeScript + Expo Router: Snack을 졸업하고 진짜 프로젝트로

> 이 노트 읽는 법: **📘 원문**(영어 그대로) 바로 밑에 **🇰🇷 한글 해설**이 있어요. 이번 주는 강의 노트와 랩이 없어서 **코스노트만** 다뤄요. 지금까지는 Snack 한 파일로 했지만, 이번 주부터는 **내 컴퓨터(VS Code)에 Expo 프로젝트를 만들고 폴더/파일을 나눠서** 만들어요. 그래서 Expo Router 코드는 Snack 링크 대신 "로컬 프로젝트에서 실행" 안내가 붙어 있어요. 대신 맨 끝 **손으로 써 보기**에 같은 구조(탭 + 탭 안 스택 + Jotai + id로 상세 화면)를 **Snack 한 파일**로 흉내 낸 연습 앱을 넣어 뒀어요.

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

**TypeScript 최소 문법**: `let n: number`, `string[]`, `interface Props { name: string; excited?: boolean }`, `useState<Product[]>([])`, `(text: string) => void`. `?`는 "있어도 되고 없어도 됨(optional)".

**함정 모음**
- 파일 이름을 바꾸면 경로도 바뀌어요. `two.tsx` → `settings.tsx` 로 바꿨으면 `_layout.tsx`의 `<Tabs.Screen name="two">`도 `"settings"`로 같이 바꿔야 해요.
- 상세 화면을 `(tabs)` **밖**에 두면 탭 바가 사라지고 헤더에 `product/[id]`가 그대로 보여요. 해결은 **탭 안에 Stack 넣기(Tab-to-Stack)**.
- 탭 안에 Stack을 넣으면 헤더가 두 개 생겨요 → 바깥 탭 쪽에 `headerShown: false`.
- `@/store/...`의 `@/`는 **프로젝트 루트**를 뜻하는 별칭(alias)이에요. Snack에는 없어요.
- `npx expo start --tunnel`에서 ngrok 에러가 나면 `npm install -g @expo/ngrok@4.1.0`.

{{TOC}}

@@NOTE Z-Guides/tool-dev-setup.md
@@K _pre
로컬 개발을 시작하기 전에 설치할 도구 목록이에요. 시험에 나올 내용은 거의 없지만, **이게 안 되면 Week 8부터 아무것도 못 해요**.
@@K VS Code
**VS Code** = 코드 편집기(워드가 문서 편집기인 것처럼). 웹 개발에서 가장 많이 쓰는 편집기예요.
@@K VS Code Extensions
확장 프로그램 7개 설치. 꼭 필요한 건 **ESLint**(실수 잡기), **Prettier**(자동 정리), **Expo Tools**. 이름과 **만든 회사(publisher)** 를 꼭 확인하고 설치하세요(가짜 확장이 있어요).
@@K Setup formatting
저장할 때 자동으로 코드 정리되게 하기: Settings에서 **Format On Save**, **Format On Paste** 켜고, **Default Formatter**를 **Prettier**로.
@@K Node.js and npm (Node Package Manager)
Expo는 **Node.js** 위에서 돌아가요. **LTS(장기 지원) 버전**을 받으세요("Current"는 불안정할 수 있음). 설치 후 터미널에서 `node --version`, `npm --version`으로 확인. **npm** = 패키지(라이브러리) 설치 도구. 예: `npm install jotai`.
@@K Expo Go App
폰에 **Expo Go** 설치 → 컴퓨터에서 프로젝트를 실행하면 나오는 **QR 코드를 찍으면** 앱이 폰에 떠요. Snack에서 My Device로 쓰던 그 앱이에요.
@@K Git
`git --version`으로 확인하고 없으면 설치. 그다음 이름과 이메일을 한 번 설정하면 커밋할 때마다 "도장"처럼 찍혀요.
@@K Optional: GitHub Copilot
선택 사항. 학생 인증하면 무료로 쓸 수 있는 AI 코딩 도우미예요.

@@NOTE H-Expo/expo.md
@@K _pre
**Expo**가 뭔지, 그리고 이제 Snack을 떠나 **내 컴퓨터에서** 개발하는 방법.
@@K What is Expo?
**Expo** = React Native **위에** 만든 오픈소스 프레임워크 + 도구 모음. iOS/Android 각각의 복잡한 설정을 대신 처리해 줘서 **JavaScript나 TypeScript만으로** 진짜 네이티브 앱을 만들 수 있어요.
@@K Core Benefits
**장점 4가지** (시험에 "Expo를 쓰는 이유"로 나올 수 있어요)
1. **Zero Native Configuration**: Java, Swift, Gradle 같은 네이티브 설정 안 건드려도 됨.
2. **Unified API**: 카메라, 위치, 센서 등을 **하나의 JS API**로 (Week 7 `expo-location`이 그 예).
3. **OTA(Over-the-Air) 업데이트**: 작은 수정은 앱스토어 심사 없이 바로 사용자에게 배포.
4. **Universal**: 한 번 짜서 Android, iOS, Web 모두.
@@K Expo vs. Bare React Native
**Bare(순수) React Native**는 Android 프로젝트(Java/Kotlin)와 iOS 프로젝트(Swift/Obj-C)를 **따로** 관리해야 하고 Android Studio, Xcode 같은 무거운 프로그램이 필요해요. Expo는 이걸 감싸서 없애 줘요.

표 핵심: Bare는 iOS 빌드에 **Mac 필수**, Expo(Managed)는 **어떤 OS에서도** 두 플랫폼 빌드 가능. 네이티브 코드를 직접 고치는 대신 **Config Plugins**로 처리.
@@K Moving Beyond Expo Snack
Snack은 연습장으로는 최고지만 실제 앱에는 한계가 있어요. 로컬로 옮기면:
- **파일 완전 제어**: 폴더 구조, 에셋, **Git** 사용.
- **VS Code의 힘**: 린트, 스니펫, 디버깅.
- **npm 패키지 무제한**: Snack은 일부 패키지만 지원.
- **오프라인 개발** 가능.

💡 **좋은 소식**: 코드 문법은 **그대로**예요. Snack에서 배운 hooks, 컴포넌트, 스타일이 똑같이 동작해요.
@@K How Expo Works: The Managed Workflow
이 수업은 **Managed Workflow**를 써요. 네이티브 컴파일은 Expo가 뒤에서 하고, 우리는 **JS/TS 층만** 다뤄요.
@@K The Magic of Expo Go
`npx expo start`를 하면 컴퓨터가 앱 전체를 빌드하는 게 아니라 **Metro**라는 **번들러**를 켜요. Metro가 JS 파일들을 하나로 묶고(bundle), 폰의 Expo Go가 네트워크(또는 터널)로 그 번들을 받아 **네이티브 화면으로 그려요**.

💡 비유: **컴퓨터 = 웹 서버, Expo Go = 모바일용 웹 브라우저**. 그래서 저장하면 폰 화면이 바로 바뀌어요.
@@K Creating a New Expo Project
**명령어 3개만 기억** (실습 필수)
```bash
npx create-expo-app myapp --template blank   # 1. 새 프로젝트 (SDK 54 선택)
cd myapp                                       # 2. 폴더로 이동
npx expo start --tunnel                        # 3. 개발 서버 실행 (QR 코드 나옴)
```
- `--template blank`: 빈 템플릿(App.js 하나). Expo Router 버전은 아래에서 `--template tabs`.
- `--tunnel`: 학교 Wi-Fi처럼 폰과 컴퓨터가 같은 네트워크로 바로 연결이 안 될 때 **인터넷 터널**로 연결.
- **ngrok 에러**가 나면 원문에 있는 두 줄로 직접 설치.
@@K Running Your New App
폰에서 **Expo Go**로 QR 찍기(추천). 아니면 iOS 시뮬레이터(Mac만) 또는 Android 에뮬레이터.
"Expo Go를 업데이트하라"는 에러가 나면 스토어 버전이 늦은 거라 https://expo.dev/go 에서 최신 버전을 직접 설치.
@@K Modifying the App
**App.js**를 고치면 돼요(Snack과 똑같이). 직접 만든 컴포넌트는 **`/components`** 폴더에 따로 넣는 게 규칙이에요.

@@NOTE Z-Guides/typescript.md
@@K _pre
**TypeScript(TS)** = JavaScript + **타입(type)**. 변수, 함수 매개변수, props가 **어떤 종류의 값인지 미리 적어 두는** 언어예요. Expo Router 템플릿이 전부 `.tsx`라서 이번 주에 같이 봐요.
- `.ts` = 타입이 있는 JS 파일, `.tsx` = 타입 + JSX가 있는 파일(컴포넌트).
@@K Why Use TypeScript in React Native?
**왜 쓰나 4가지**
1. **실행 전에 에러를 잡아요** (오타, 잘못된 값).
2. **자동완성이 좋아져요** (VS Code가 props 이름을 알려 줌).
3. **컴포넌트가 읽기 쉬워져요** (어떤 props가 필요한지 한눈에).
4. **팀 작업**에 좋아요 (데이터 모양이 명확).
@@K Introduction to TypeScript Syntax
TS가 처음이라면 알아야 할 기초 문법 3가지(변수, 배열, 객체)예요.
@@K Variables and Types
`이름: 타입 = 값`. 기본 타입 3개: `number`, `string`, `boolean`.
`count = "hello"` 처럼 다른 타입을 넣으면 **빨간 줄**이 생겨요.
@@K Arrays
배열은 `타입[]`. `number[]` = 숫자만 들어가는 배열.
@@K Objects
객체는 `{ 속성: 타입; 속성: 타입 }` 으로 **모양(shape)** 을 적어요. 이 모양에 이름을 붙인 게 아래의 **interface**예요.
@@K Using TypeScript in React Native Components
컴포넌트는 `.tsx` 파일에 써요.
@@K Functional Component Without Props
props가 없으면 **JS와 똑같아요**. 타입을 적을 게 없으니까요.
@@K Typing Component Props with Interfaces
**제일 중요한 부분 (시험 포인트)**
- `interface GreetingProps { name: string; excited?: boolean; }`: props의 설계도.
- `name`은 **필수**, `excited?`의 **`?`는 선택(optional)**.
- `function Greeting({ name, excited }: GreetingProps)`: 구조 분해한 props 뒤에 `: 인터페이스이름`.
- `<Greeting />` 처럼 `name`을 빼먹으면 VS Code가 **에러로 표시**해요. Week 1에서 배운 **PropTypes**가 하던 일을 TS가 **실행 전에** 해 주는 거예요.

💡 Snack의 `App.js`에서도 interface나 `: string` 같은 TS 문법이 실행돼요(위 링크로 확인 완료). 단, `useState<number>(0)`처럼 **함수 호출에 꺾쇠 `<>`를 붙이는 문법**이나 `값 as 타입` 문법은 Snack `App.js`에서 에러가 나요(직접 확인함). 로컬 `.tsx` 파일에서는 괜찮아요.
@@K Typing State with useState
`useState<number>(0)`: 꺾쇠 `<>` 안에 state 타입. 하지만 `useState(0)`처럼 **초기값으로 타입이 뻔하면 TS가 알아서 추론(infer)** 해요. 빈 배열 `[]`처럼 추론이 안 될 때 꼭 적어요 → 아래 `useState<Post[]>([])`.
@@K Typing Event Handlers
- `(): void`: 아무것도 **반환하지 않는** 함수.
- `onChangeText`는 **문자열**을 넘겨주니까 `(text: string) => ...`.
@@K Combining Props, State, and Events
**코드 해설**: `CounterProps`로 `start`를 숫자로 정하고, `useState(start)`는 숫자로 추론, 버튼은 `prev => prev + 1`(Week 2 함수형 업데이트). props, state, 이벤트가 한 번에 다 들어간 예제.
@@K Typing API Data (Beginner Level)
fetch로 받는 데이터(Week 5)의 **모양을 interface로** 정하고, `useState<Post[]>([])`로 "Post들의 배열"이라고 알려 줘요. 그러면 `item.title` 같은 걸 쓸 때 자동완성이 되고 오타가 잡혀요.
@@K When You Don’t Need to Use Types
**다 적을 필요 없어요.**
- 생략: 타입이 뻔할 때(`useState(0)`), 빠르게 실험할 때, 단순 UI.
- 꼭 적기: **props**, **API 데이터**, **복잡한 state**.
@@K Summary
TS = 안전 + 명확. props는 **interface**, state는 필요할 때 `<타입>`.

@@NOTE H-Expo/expo-router.md
@@K _pre
**Expo Router** = **파일 기반 라우팅(file-based routing)**. Week 4 React Navigation 위에 만들어졌어요.
핵심 한 줄: **"폴더/파일 구조 = 앱의 화면 구조"**. Next.js 같은 웹 프레임워크와 같은 아이디어예요.
@@K What is Expo Router?
React Navigation은 `NavigationContainer`, `Stack.Screen`을 코드로 하나하나 등록해야 했어요. Expo Router는 **`app/` 폴더에 파일을 만들기만 하면** 그게 화면이 되고, iOS/Android의 진짜 네이티브 내비게이션으로 바뀌어요.
@@K Why Use Expo Router?
**장점 4가지**
1. **화면 = 파일**: 파일 경로가 곧 화면 주소.
2. **딥 링크 기본 지원**: 모든 화면에 URL 같은 주소가 있어서, 웹 링크로 앱의 특정 상품 페이지를 바로 열 수 있어요.
3. **네이티브 성능**: 주소는 웹처럼 쓰지만 화면은 100% 네이티브 컴포넌트와 애니메이션.
4. **타입 안전**: 경로 타입을 자동 생성해서 잘못된 링크를 미리 잡아요.
@@K Core Concepts & File Conventions
프로젝트 루트의 **`app/`** 폴더 안 파일 하나하나가 경로(route)가 돼요. 특수한 이름 규칙 4가지가 아래 1~4번이에요. (맨 위 0번 표에 정리)
@@K 1. The Entry Point: `index.tsx`
`index` = 그 폴더의 **기본 화면**. 웹사이트의 `index.html`과 같아요.
@@K 2. Layout Files: `_layout.tsx`
**`_layout`** = 같은 폴더의 화면들을 **감싸는 틀**. 헤더(Stack)나 아래 탭 바(Tabs)처럼 여러 화면에 계속 보이는 UI를 여기서 정해요.
- 같은 폴더의 **모든 파일과 하위 폴더**에 적용.
- 안에 `<Slot />`(그냥 현재 화면을 통과시킴), `<Stack />`, `<Tabs />` 중 하나를 그려요.
@@K 3. Route Groups: `(directory-name)`
**괄호 폴더** = 정리용 폴더. **경로에서 이름이 사라져요**. `app/(auth)/login.tsx`는 `/auth/login`이 아니라 **`/login`**.
용도: `(auth)`는 로그인 화면들, `(tabs)`는 메인 화면들처럼 **구역마다 다른 레이아웃**을 주려고.
@@K 4. Dynamic Routes: `[id].tsx`
**대괄호** = 값이 바뀌는 자리. `app/profile/[id].tsx` 하나로 `/profile/123`, `/profile/steve` 모두 처리.
값은 컴포넌트 안에서 **`useLocalSearchParams()`** 로 꺼내요. (Week 4의 `route.params`와 같은 역할)
@@K Structural Visualization: Layouts vs. Screens
파일 트리가 실제 화면 구조로 어떻게 바뀌는지 보는 부분.
@@K Example Directory Architecture
**읽는 연습** (시험에 "이 파일의 경로는?"이 나올 수 있어요)
- `app/(auth)/login.tsx` → `/login` (괄호 무시)
- `app/(tabs)/index.tsx` → `/` (괄호 무시 + index)
- `app/(tabs)/explore.tsx` → `/explore`
- `app/details/[id].tsx` → `/details/42` (괄호 없는 일반 폴더는 경로에 남음)
- `_layout.tsx`는 화면이 아니라 **틀**이라서 경로가 없어요.
@@K Setting Up Expo Router
Week 8 앞부분과 같은데 템플릿만 다름: **`npx create-expo-app@latest MyRouterApp --template tabs`**. `tabs` 템플릿에 Expo Router가 이미 들어 있어요.
@@K Running Your New App
실행 방법은 위 Expo 노트와 같아요(Expo Go로 QR).
@@K Understanding the Default File Architecture
**tabs 템플릿 기본 구조**
- `(tabs)/_layout.tsx`: 아래 **탭 바** 설정.
- `(tabs)/index.tsx`: 첫 번째 탭, 경로 `/`.
- `(tabs)/two.tsx`: 두 번째 탭, 경로 `/two`.
- `_layout.tsx`(루트): 앱 전체 설정.
- `+html.tsx`: **웹 빌드 전용**. `+not-found.tsx`: 없는 경로일 때 보여 줄 화면(404). `+`로 시작하면 특수 파일.
- `modal.tsx`: 아래에서 올라오는 모달 화면.
@@K Begin implementing a Product Shop application
여기부터 **Product Shop** 앱을 단계별로 만들어요: 탭 설정 → 설정 화면 → Jotai로 상품 목록 → 상품 목록 화면 → `[id]` 상세 화면 → 탭 안 Stack으로 고치기.
@@K Configure Tabs
**두 번째 탭을 Settings로 바꾸기**
1. `two.tsx` → `settings.tsx`로 이름 변경. 이 순간 경로가 `/two` → `/settings`로 바뀌어요.
2. 그런데 `_layout.tsx`는 아직 `name="two"`를 찾고 있어서 탭이 깨져요 → **`name="settings"`**, `title: 'Settings'`, 아이콘 `cog`(톱니바퀴)로 수정.
3. 첫 탭(`name="index"`)은 제목 `Products`, 아이콘 `shopping-cart`.

💡 교훈: **파일 이름 = 경로 = `Tabs.Screen`의 name**. 셋이 항상 같아야 해요.
@@K Update the Settings Screen
**코드 해설**: `settings.tsx`를 덮어써서 컴포넌트 이름을 `SettingsScreen`으로, 제목을 "Settings"로.
- `@/components/Themed`의 `Text`, `View`: 템플릿이 만든 **다크 모드 대응** 컴포넌트(`lightColor`, `darkColor` props).
- `@/` = 프로젝트 루트 별칭. 그래서 이 코드는 Snack에서 못 돌려요.
@@K Install Jotai and Configure a Product List
**Jotai로 상품 목록을 전역 state로** (Week 4에서 배운 Jotai 그대로)
- `npm install jotai`로 설치(Snack은 자동이었지만 로컬은 직접 설치).
- **state 파일은 화면 파일과 분리**하는 게 좋은 습관 → 루트에 `store/` 폴더, 안에 `productsAtom.ts`.
- `export interface Product { id: string; name: string; price: number; description: string; }`: 위 TS 노트의 **interface**로 상품 모양 정의.
- `atom<Product[]>([...])`: "Product 배열"을 담는 atom. 지금은 하드코딩, 나중에 Firebase에서 가져와요.
@@K Update Tab One - Make it the Product Shop
**코드 해설** (Week 5 FlatList + Week 4 Jotai + 새로운 `Link`)
- `useAtomValue(productsAtom)`: atom을 **읽기만** 할 때. (`useAtom`은 `[값, set함수]`)
- `FlatList` + `keyExtractor` + `renderItem`: Week 5 그대로.
- **`<Link href={`/product/${item.id}`} asChild>`**: 누르면 그 경로로 이동. **`asChild`** = Link가 자기 대신 **안쪽 자식(`TouchableOpacity`)을 누르는 대상**으로 쓰라는 뜻. 그래서 카드 전체가 버튼이 돼요.
- `item.price.toFixed(2)`: 소수점 둘째 자리(299.99).
- `SafeAreaView edges={['left','right']}`: 노치 피하기, 위아래는 헤더/탭이 처리하니 좌우만.
@@K Create the Dynamic Product Details Screen
**`app/product/[id].tsx` 해설**
- `const { id } = useLocalSearchParams<{ id: string }>();`: 주소의 `[id]` 자리 값을 꺼내요. `<{ id: string }>`은 TS로 "id는 문자열"이라고 알려 주는 것.
- `products.find((p) => p.id === id)`: 전역 목록에서 그 id의 상품 찾기. **id 하나만 넘기고 상세 데이터는 atom에서 찾는** 패턴이에요(Week 5 상세 화면과 같은 생각).
- 못 찾으면 `"Product Not Found"`를 먼저 return(**early return**).
@@K Checkpoint & Architecture Review
지금까지: 탭 2개, Jotai 전역 상품 목록, `[id]` 동적 상세 화면. 그런데 **문제 2개**가 있어요.

**문제 1. 헤더에 `product/[id]`가 그대로 보임**
- 이유: 이 화면을 감싸는 `_layout`이 없으니 Router가 제목을 몰라서 **파일 경로**를 보여 줘요.
- 해결: `<Stack>` 레이아웃으로 감싸고 `options={{ title: 'Product Details' }}`.

**문제 2. 아래 탭 바가 사라짐**
- 이유: `product/` 폴더가 `(tabs)/` **밖**에 있어서, 들어가면 탭 영역을 완전히 벗어나요.
- 해결: **Tab-to-Stack**. 상품 탭 **안에** Stack을 넣어서, 상세 화면이 탭 안에서 쌓이게(push) 하기. 그러면 탭 바가 계속 보여요.

마지막 그림이 바뀔 구조 전후 비교예요. (원문 그림은 `products/` 폴더를 생략해서 그렸는데, 실제로는 아래 Step 1처럼 `(tabs)/products/` 안에 들어가요.)
@@K Resolving the Issues: Building a Tab-Nested Stack
루트의 `product/` 폴더를 없애고, **첫 번째 탭 안에 Stack을 중첩**해요. 4단계예요.
@@K Step 1: Restructure Your Directories
**폴더 옮기기**
1. `app/(tabs)/products/` 폴더 만들기.
2. `(tabs)/index.tsx` → `(tabs)/products/index.tsx`로 이동.
3. `app/product/[id].tsx` → `(tabs)/products/[id].tsx`로 이동.
4. 빈 `app/product/` 삭제.

이제 경로: 목록 `/products`, 상세 `/products/1`.
@@K Step 2: Create the Products Stack Layout
**`(tabs)/products/_layout.tsx` 해설**
- `<Stack screenOptions={...}>`: 이 폴더의 모든 화면에 공통 헤더 스타일. `headerTintColor`는 **뒤로 가기 버튼과 제목 색**.
- `<Stack.Screen name="index" options={{ title: 'Hardware Shop' }} />`: 목록 화면 제목.
- `<Stack.Screen name="[id]" options={{ title: 'Product Details' }} />`: 상세 화면 제목. **name은 파일 이름 그대로**(대괄호 포함!).

Week 4의 `<Stack.Navigator>` + `<Stack.Screen>`과 똑같은 모양인데, `component=` 가 없어요. **파일이 곧 컴포넌트**니까요.
@@K Step 3: Update the Root Tabs Layout
**`(tabs)/_layout.tsx` 수정**
- `name="index"` → **`name="products"`** (이제 파일이 아니라 **폴더 이름**을 가리켜요).
- **`headerShown: false`**: 탭의 헤더를 숨겨요. 안 그러면 탭 헤더 + Stack 헤더 **두 개**가 보여요(double header).
- `SymbolView`: 플랫폼마다 다른 아이콘 이름(iOS SF Symbols `cart.fill`, Android `shopping_cart`, Web `shopping-cart`)을 줄 수 있는 아이콘 컴포넌트.
@@K Step 4: Fix Relative Links
링크 주소를 새 구조에 맞게 **`/products/${item.id}`** 로. 저장 후 터미널에서 **`r`** 을 눌러 리로드.

이제 흐름: 목록에서 카드 누름 → 탭 바는 그대로, 위 헤더에 "Product Details"와 **뒤로 가기** 버튼.
@@K Summary: What You Learned
**이번 주 4줄 요약**
@@K 1. File-Based Routing with Expo Router
파일 트리 = 화면 구조. `_layout.tsx`가 틀, `(tabs)` 같은 괄호 폴더는 경로에 안 나옴.
@@K 2. State Splitting with Jotai
상품 데이터를 화면 안 배열이 아니라 **atom(전역)** 에 두고 목록과 상세 화면이 **같이** 읽어요.
@@K 3. Dynamic Screen Rendering
`[id].tsx` 하나가 모든 상품 상세를 담당, 값은 `useLocalSearchParams`.
@@K 4. Advanced Tab-to-Stack Architecture
상세 화면을 탭 밖에 두면 탭 바가 사라져요. **탭 폴더 안에 Stack(`_layout.tsx`)을 중첩**하면 탭 바 유지 + 깔끔한 제목 + 뒤로 가기. 실무 표준 구조예요.

@@TEXT
## ✅ Week 8 시험 대비 체크리스트

1. Expo를 쓰는 이유 4가지? → 네이티브 설정 없음, 통합 API, OTA 업데이트, 한 코드로 Android/iOS/Web
2. Bare RN과 Expo(Managed)의 가장 큰 차이? → Bare는 네이티브 프로젝트 2개 직접 관리(iOS는 Mac 필요), Expo는 JS/TS만
3. `npx expo start`가 켜는 번들러 이름? → **Metro**. Expo Go는 "앱용 브라우저"
4. 새 프로젝트 명령? → `npx create-expo-app myapp --template blank` (Router는 `--template tabs`)
5. 학교 Wi-Fi에서 연결 안 될 때 옵션? → `--tunnel`
6. `interface Props { name: string; excited?: boolean }`에서 `?`의 뜻? → 선택(optional) prop
7. 빈 배열 state에 타입 주기? → `useState<Post[]>([])`
8. `app/(auth)/login.tsx`의 경로? → `/login`
9. `app/settings/index.tsx`의 경로? → `/settings`
10. 동적 경로 파일 이름과 값 꺼내는 hook? → `[id].tsx`, `useLocalSearchParams()`
11. `_layout.tsx` 안에 그리는 세 가지? → `<Slot />`, `<Stack />`, `<Tabs />`
12. `<Link href="..." asChild>`의 `asChild`? → 자식 컴포넌트(TouchableOpacity)를 누르는 대상으로 사용
13. 상세 화면이 탭 밖에 있을 때 생기는 문제 2개와 해결? → 헤더에 파일 경로, 탭 바 사라짐 → 탭 안에 Stack 중첩
14. 탭 안 Stack에서 헤더가 두 개 보일 때? → 탭 쪽 `Tabs.Screen`에 `headerShown: false`
15. `useAtomValue`와 `useAtom`의 차이? → 읽기만 vs `[값, set함수]`

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
