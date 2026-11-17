# Week 10. Lambda, Stream, Property와 Binding, Scene Builder 그림판

> **읽는 법**: 📑 표시는 교수님 슬라이드의 핵심 문장(영어 원문 그대로 짧게 발췌)이고, 바로 아래 **🇰🇷 한글 해설**이 이어져요. ⌨️ 표시가 있는 코드는 IntelliJ에서 직접 쳐 보세요. Lambda와 Stream은 `main`만으로, Property와 Binding은 JavaFX 라이브러리가 있는 프로젝트(Week 4 샘플처럼 Maven JavaFX)에서 `main`으로 돌려 볼 수 있어요.
>
> Week 4에서 쓴 `setOnAction(e -> ...)`가 정확히 무엇인지, Week 5 MVC에서 Model이 바뀌면 View가 알아서 바뀌던 원리(Property)를 이번 주에 제대로 배워요.

## 0. 이번 주 한눈에 보기

| 개념 | 한 줄 정리 | 시험에 나오는 모양 |
| --- | --- | --- |
| Lambda | 이름 없는 함수. `(파라미터) -> 식` 또는 `-> { 문장; }` | 괄호, 중괄호, return 생략 규칙 |
| Functional Interface | 추상 메서드가 **딱 하나**(SAM). `@FunctionalInterface`는 컴파일 검사만 | 추상 메서드 2개면 람다 불가 |
| Method Reference | `System.out::println`, `Dish::getName` | 람다를 더 짧게 |
| Predicate / Consumer / Function | `test`→boolean / `accept`→void / `apply`→R | filter / forEach / map |
| Stream | 컬렉션을 **선언형**으로 처리하는 파이프라인 | `stream()`으로 시작 |
| 중간 vs 최종 연산 | filter, sorted, map(**lazy**) / forEach, collect, count, reduce | 최종 연산 없으면 아무 일도 안 함 |
| 한 번만 사용 | 소비한 스트림 재사용 → `IllegalStateException` | |
| Property | 값을 감싸서 **listener**와 **binding**을 가능하게 | `get`, `set`, `xxxProperty()` |
| ChangeListener vs InvalidationListener | (ov, old, new) eager / (observable) lazy | 파라미터 개수 |
| bind | 단방향. target이 source를 따라감, target에 `set` 불가 | 기존 값 사라짐 |
| bindBidirectional | 양방향. 처음엔 **인자로 준 쪽 값**으로 맞춰짐 | |
| Fluent / Bindings / Low-Level | `a.multiply(2)` / `Bindings.add(a,b)` / `computeValue()` 오버라이드 | |
| ToggleGroup + userData | 라디오 버튼 하나만 선택, 선택된 것의 데이터 꺼내기 | 캐스팅 |

**함정 모음**

- 파라미터가 **없으면** 괄호 필수: `() -> ...`. 하나일 때만 괄호 생략 가능.
- 중괄호를 쓰고 값을 돌려줘야 하면 `return` 필수. 중괄호 없이 `return`을 쓰면 **문법 에러**(`x -> return x;` 안 됨).
- 람다 변수는 메서드처럼 바로 부를 수 없어요. `func(2.0)`이 아니라 `func.apply(2.0)`.
- 중간 연산만 있고 최종 연산이 없으면 filter 안의 코드가 **한 번도 실행되지 않아요**(lazy).
- `map`에 넘기는 람다는 **Function**(값을 바꿔 돌려줌), `forEach`는 **Consumer**. 슬라이드 주석 중 map을 Consumer라고 쓴 곳이 있는데 틀렸어요.
- `bind()`는 **void**를 돌려줘요. 그래서 `a.bind(b).multiply(2)` 같은 체인은 컴파일 에러. 계산은 `a.bind(b.multiply(2))`처럼 **괄호 안에서**.
- `bind`된 property에 `set()`하면 `RuntimeException`("A bound value cannot be set").
- `bindBidirectional(source)` 직후 두 값은 **source(인자) 값**이 돼요. target의 원래 값은 사라짐.

{{PRACTICE}}

{{TOC}}

@@SLIDE week-10-1-lambda-stream.md
@@S _doc | read
Java 8의 **람다**(코드를 값처럼 넘기기)와 **스트림**(컬렉션을 쿼리처럼 처리하기)을 배워요. 이 챕터는 `main`만으로 전부 돌려 볼 수 있어요.
@@S Functional Interfaces | type
할 일: MyEquation 인터페이스를 만들고 area, perimeter 두 람다로 3, 4를 계산해 12.0과 14.0이 나오는지 확인
@@S What are Streams? | type
할 일: 23, 84, 74, 85, 54, 60에서 54보다 큰 것만 골라 정렬하고 16진수 대문자로 출력해 3C 4A 54 55가 나오는지 확인
@@S Two important characteristics | type
할 일: 같은 스트림에 forEach를 두 번 불러 IllegalStateException이 나는 것 직접 보기
@@K Why the need?
왜 람다가 생겼을까요? CPU 코어가 여러 개(멀티코어)가 되면서, 데이터를 나눠서 **동시에** 처리하고 싶어졌어요. 람다 + 스트림으로 쓰면 `stream()`을 `parallelStream()`으로 바꾸는 것만으로 병렬 처리가 돼요. for문으로 직접 쓰면 이걸 손으로 쪼개야 해서 어렵고 버그가 많아요.
@@K What is Functional Programming?
함수형 프로그래밍 = **코드(동작)를 메서드에 넘기는 것**. 지금까지는 메서드에 값(숫자, 객체)만 넘겼는데, 이제 "이렇게 처리해 줘"라는 동작 자체를 넘겨요. 그리고 값을 직접 바꾸기(mutable)보다 **새 값을 만들어 내는** 방식을 좋아해요.
@@K Lambda
람다 = **이름 없는 함수**. 수학의 람다 대수(lambda calculus)에서 이름을 따왔어요. Java 8부터 함수를 변수에 담고, 다른 메서드에 넘길 수 있어요. 다른 언어에서 closure라고 부르는 것과 거의 같은 개념이에요.
@@K Imperative vs Declarative
- **명령형**(imperative): for문, if, break, found 변수까지 **모든 단계**를 내가 지시.
- **선언형**(declarative): `cities.contains("Chicago")`처럼 **무엇을** 원하는지만 말하고 방법은 Java에게 맡김.

⚠️ 슬라이드 원본에서는 두 예제의 이름표(imperative/declarative)가 **서로 바뀌어** 붙어 있는 곳이 있어요. for문 쪽이 명령형, contains 쪽이 선언형이 맞아요. 시험에서는 "단계를 하나하나 쓰면 명령형"으로 기억하세요.

선언형의 장점: 바뀌는 변수(found)가 없음, 반복이 숨겨짐, 짧고 읽기 쉬움, 실수가 적음.
@@K JavaFX Button onAction
Week 4에서 쓴 바로 그 코드예요! 위는 **익명 클래스**(EventHandler를 그 자리에서 구현), 아래는 같은 일을 하는 **람다**. `EventHandler`는 추상 메서드가 `handle` 하나뿐인 인터페이스라서 람다로 줄일 수 있어요. `event`의 타입(ActionEvent)도 Java가 알아서 추론해요.
@@K Lambda Expressions: Syntax
규칙 4개를 꼭 외우세요.

1. 파라미터가 **하나**면 괄호 생략 가능: `x -> x * x`. **없으면** `() -> ...` 괄호 필수. 두 개 이상도 괄호 필수.
2. 중괄호 **없으면** 식 하나만, 그 값이 **자동으로 return**.
3. 중괄호 **있고** 값을 돌려줘야 하면 `return` **필수**.
4. 람다는 반환 타입을 안 써요. 어디에 대입되는지(함수형 인터페이스)가 정해 줘요.

⚠️ 슬라이드 원본 오류 두 가지:
- `func(2.0)`처럼 부르는 예가 있는데, 람다 변수는 **인터페이스 객체**라서 `func.apply(2.0)`처럼 그 인터페이스의 메서드로 불러야 해요.
- `(String txt) -> return txt...`처럼 중괄호 없이 `return`을 쓴 예는 **문법 에러**예요. `(String txt) -> { return ...; }` 또는 `return` 없이 식만.

`(x, y) -> x > y ? x : y`는 삼항 연산자로 if-else를 식 하나로 만든 거예요.
@@K Functional Interfaces
함수형 인터페이스 = **추상 메서드가 딱 하나**인 인터페이스(SAM, Single Abstract Method). 람다는 오직 이런 인터페이스 자리에만 들어갈 수 있어요. 메서드가 하나뿐이니 "이 람다가 그 메서드의 몸통"이라고 Java가 알 수 있거든요.

`@FunctionalInterface`는 **없어도** 동작해요. 붙이면 실수로 추상 메서드를 두 개 만들었을 때 컴파일러가 잡아 줘요. (default, static 메서드는 개수에 안 들어가요.)

`area.compute(3, 4)` → 12.0, `perimeter.compute(3, 4)` → 14.0 (직접 돌려 확인했어요). 파라미터 타입은 인터페이스에서 double로 정해져 있어서 3, 4가 3.0, 4.0이 돼요.

⚠️ 슬라이드에서 같은 예제의 인터페이스 이름이 `Convert`와 `Converter`로 섞여 나와요. 이름은 하나로 통일해야 컴파일돼요.
@@K Method Reference
람다가 **메서드 하나를 그냥 부르기만** 할 때 `::`로 더 줄일 수 있어요.

| 람다 | 메서드 참조 |
| --- | --- |
| `e -> System.out.println(e)` | `System.out::println` |
| `d -> d.getName()` | `Dish::getName` |
| `s -> Integer.parseInt(s)` | `Integer::parseInt` |

괄호 `()`를 쓰지 않는 것에 주의. `System.out::println()`은 에러예요.
@@K java.util.function
Java가 미리 만들어 둔 함수형 인터페이스 3총사:

| 이름 | 메서드 | 하는 일 | 스트림에서 |
| --- | --- | --- | --- |
| `Predicate<T>` | `boolean test(T)` | 조건 검사 | `filter` |
| `Consumer<T>` | `void accept(T)` | 받아서 쓰기만, 돌려주는 것 없음 | `forEach` |
| `Function<T,R>` | `R apply(T)` | T를 R로 변환 | `map` |

`Comparator`도 `compare` 하나뿐이라 함수형 인터페이스예요. 익명 클래스 6줄이 람다 한 줄이 되는 걸 보세요. 더 짧게는 `Comparator.comparing(Apple::getWeight)`.
@@K What are Streams?
스트림 = 컬렉션 위에서 도는 **처리 파이프라인**(공장 컨베이어 벨트). Week 9의 IO Stream과는 **전혀 다른 것**이에요(이름만 같음).

예제 흐름: `[23, 84, 74, 85, 54, 60]` → filter(54 초과) → `[84, 74, 85, 60]` → sorted → `[60, 74, 84, 85]` → map(16진수) → `3C 4A 54 55`. 54는 `>`라서 빠져요. (직접 돌려 확인했어요.)

`threshold`처럼 람다 안에서 쓰는 바깥 지역변수는 **값이 바뀌지 않아야**(effectively final) 해요. 뒤에서 `threshold = 60;`을 하면 컴파일 에러.
@@K Java 7 VS Java 8 Code
Java 7이라면: 400 칼로리 미만을 담을 리스트 만들기, for로 거르기, `Collections.sort`에 Comparator 익명 클래스, 또 for로 이름만 뽑기. 10줄이 넘어요. Java 8은 파이프라인 한 줄.

`collect(Collectors.toList())`는 결과를 다시 **List로 모으는** 최종 연산이에요.

⚠️ 슬라이드 원본에 `menu.Stream()`, `Dishes::getCalories` 같은 오타가 있어요. 정확히는 소문자 `stream()`, 클래스 이름 `Dish`.
@@K What exactly is the Stream?
한 문장으로: **컬렉션은 데이터(저장), 스트림은 계산(처리)**. 스트림은 데이터를 저장하지 않고 원본(source)에서 흘려 보내며 처리만 해요. 원본 리스트는 **바뀌지 않아요**.

소스: 컬렉션(`list.stream()`), 배열(`Arrays.stream(arr)`), 파일 줄(`Files.lines`). 연산: filter, map, reduce, find, match, sort.
@@K Two important characteristics
- **파이프라이닝**: 중간 연산이 스트림을 돌려줘서 `.`으로 계속 이어 붙여요.
- **내부 반복**: for문을 내가 안 써요. 스트림이 안에서 돌아요.
- **한 번만 순회**: 다 쓴 스트림을 다시 쓰면 `IllegalStateException: stream has already been operated upon or closed`. 다시 필요하면 `list.stream()`을 새로 불러요.
@@K Stream Operations
- **중간 연산**(filter, sorted, map, distinct, limit): 스트림을 돌려줌. **lazy**라서 최종 연산이 불릴 때까지 아무것도 안 해요.
- **최종 연산**(forEach, collect, count, reduce): 결과를 만들고 스트림을 닫아요.

시험 포인트: `list.stream().filter(x -> { System.out.println(x); return true; });`만 쓰면 **아무것도 출력 안 돼요**. 최종 연산이 없으니까요.

@@SLIDE week-10-2-properties-binding.md
@@S _doc | read
JavaFX의 **Property**(값을 감싼 객체)와 **Binding**(값 두 개를 자동으로 맞추기)을 배워요. Week 5 MVC에서 Model이 바뀌면 화면이 따라 바뀌던 비밀이에요.
@@S Listeners | type
할 일: SimpleIntegerProperty에 ChangeListener를 달고 set(5), set(5), set(7)을 해서 리스너가 몇 번 불리는지 세어 보기
@@S Two-directional binding | type
할 일: source "A", target "B"로 bindBidirectional 후 두 값 출력, target.set("C") 후 source 값 확인
@@S Low-Level Binding | type
할 일: cost와 itemCount로 DoubleBinding을 만들고 itemCount를 바꿔서 totalCost가 자동으로 바뀌는지 확인
@@K Introduction
Property = 값(String, int 등)을 감싼 **상자**인데, 상자 안 값이 바뀌면 **알려 줘요**. 그래서 두 가지가 가능해요:
- **Listener**: 바뀌면 내 코드 실행
- **Binding**: 다른 Property와 값을 자동 동기화

화면(View)의 `textProperty()`를 데이터에 묶어 두면, 데이터만 바꿔도 화면이 바뀌어요. MVC의 핵심 연결 고리예요.
@@K Read/Writable Properties
`StringProperty`는 추상 타입, `SimpleStringProperty`가 실제 구현이에요(List / ArrayList 관계와 비슷). 읽기 `get()`, 쓰기 `set()`. `getValue()`/`setValue()`도 있어요(기본형 대신 객체로).
@@K Read-Only Properties
밖에서는 읽기만, 안에서는 바꿀 수 있게 하려면:
1. 클래스 안에 `ReadOnlyStringWrapper`(바꿀 수 있는 원본)를 둬요.
2. 밖에 줄 때는 `getReadOnlyProperty()`로 **읽기 전용 얼굴**만 줘요.

`ReadOnlyStringProperty`에는 `set()`이 아예 없어서 바깥 코드가 바꿀 수 없어요. private 필드 + getter만 두는 캡슐화와 같은 생각이에요.
@@K Creating a property
`Simple` + 타입 + `Property`: `SimpleIntegerProperty`, `SimpleDoubleProperty`, `SimpleBooleanProperty`, `SimpleObjectProperty<T>`, `SimpleListProperty` ...

초기값 없이 만들면 기본값: 숫자 0, boolean false, String **""**(빈 문자열), 컬렉션은 빈 것.

생성자에 `(bean, name, 초기값)`을 줄 수 있어요. bean = 이 property를 가진 객체(`this`), name = 이름. 디버깅이나 리스너에서 "누구의 무슨 property인지" 알 때 써요.

모든 Property의 3가지 능력: **listen, bind, get/set**.
@@K JavaFX Java Bean: Example
JavaFX Bean 규칙(시험에 자주 나와요). 속성 이름이 `password`면:

| 메서드 | 모양 |
| --- | --- |
| getter | `public final String getPassword()` |
| setter | `public final void setPassword(String)` |
| property getter | `public StringProperty passwordProperty()` |

읽기 전용인 `userName`은 setter가 **없고**, `userNameProperty()`가 `ReadOnlyStringProperty`를 돌려줘요. TableView의 `PropertyValueFactory("password")`가 이 이름 규칙으로 메서드를 찾아요(Week 7, 8과 연결).
@@K Listeners
`addListener`에 넣을 수 있는 두 종류:

| | 파라미터 | 언제 |
| --- | --- | --- |
| `InvalidationListener` | `(Observable o)` 1개 | 값이 **무효해졌을 때** |
| `ChangeListener` | `(ov, oldVal, newVal)` 3개 | 값이 **실제로 바뀌었을 때** |

람다 파라미터 개수로 Java가 어느 쪽인지 구분해요. 같은 값을 다시 `set`하면(5 → 5) ChangeListener는 **안 불려요**. 그래서 할 일 연습의 답은 2번(0→5, 5→7)이에요.

리스너를 나중에 떼려면(`removeListener`) 람다를 **변수에 담아 두어야** 해요. 그 자리에서 쓴 람다는 다시 가리킬 방법이 없거든요.
@@K Change vs Invalidation Listeners
- **Invalidation**(lazy): "값이 옛날 거야" 표시만 하고 새 값을 바로 계산하지 않아요. 누가 `get()` 할 때 계산. 레이아웃처럼 자주 바뀌는 곳에서 효율적.
- **Change**(eager): 바뀌는 즉시 새 값을 계산해서 old, new를 줘요. 폼 입력 검사(validation)처럼 바로 반응해야 할 때.

외우는 법: 새 값이 필요하면 Change, 바뀌었다는 사실만 필요하면 Invalidation.
@@K Binding
바인딩 = 두 값을 **항상 같게** 유지. 속으로는 Change 리스너가 "source 바뀌면 target도 set"을 대신 해 주는 거예요. 리스너를 직접 쓰는 것보다 짧고 실수가 적어요.
@@K One-directional binding
`targetProperty.bind(sourceProperty)`: **target이 source를 따라가요**. 읽는 법: "target을 source에 묶는다".

- bind 하는 순간 target의 "Second Value"는 **사라지고** "First Value"가 돼요.
- 이미 다른 것에 bind돼 있으면 새 것으로 교체.
- `bind(null)`은 `NullPointerException`.
- bind된 target에 `set()`하면 `RuntimeException`. 풀려면 `unbind()`.

예: `label.textProperty().bind(textField.textProperty());` → 입력하는 대로 Label이 바뀌어요.
@@K Two-directional binding
`bindBidirectional`: 어느 쪽을 바꿔도 다른 쪽이 따라와요. 시작할 때는 **인자로 준 쪽(source) 값**으로 둘 다 맞춰져요.

할 일 연습 예상 결과: source "A", target "B" → bind 후 둘 다 **A**. `target.set("C")` 후 source도 **C**. 단방향과 달리 target에 `set`해도 에러가 안 나요.

폼에서 TextField와 Model의 property를 양방향으로 묶으면, 입력하면 Model이 바뀌고 Model을 바꾸면 화면이 바뀌어요.
@@K Intermediate binding techniques
"그대로 복사"가 아니라 **계산된 값**에 묶고 싶을 때 3가지 방법:
1. **Fluent API**: property에 바로 `.add()`, `.multiply()`, `.concat()`을 이어 붙이기. 가장 읽기 쉬움.
2. **Bindings API**: `Bindings.add(a, b)` 같은 정적 메서드.
3. **Low-Level API**: `DoubleBinding`을 직접 만들어 `computeValue()`에 계산식. 가장 자유로움.
@@K Fluent API
`degrees.multiply(Math.PI).divide(180)`은 값이 아니라 **식(Binding 객체)**이에요. degrees가 바뀌면 radians도 자동 재계산.

⚠️ 슬라이드 원본에 `target.bind(source).multiply(2)` 모양의 예가 있는데 **틀렸어요**. `bind()`는 void라서 뒤에 `.multiply`를 붙일 수 없어요. 계산은 항상 **bind 괄호 안**에서: `target.bind(source.multiply(2))`.

String은 `concat`, 숫자는 `add/subtract/multiply/divide`, 비교는 `greaterThan`, `isEqualTo` 등.
@@K The Bindings API
`Bindings` 클래스의 정적 메서드들이에요. `Bindings.add(priceA, priceB)`는 `priceA.add(priceB)`와 같아요. `subtract`, `divide`는 **순서가 중요**(a - b ≠ b - a).

`Bindings.bindContent(plainList, observableList)`: ObservableList 내용이 바뀌면 일반 List도 똑같이 맞춰져요. `Bindings.when(조건).then(값1).otherwise(값2)`는 바인딩 버전 삼항 연산자예요.
@@K Low-Level Binding
계산이 복잡할 때 직접 Binding을 만들어요.

1. `new DoubleBinding() { ... }` 익명 클래스.
2. `{ super.bind(cost, itemCount); }`: **초기화 블록**(이름 없는 중괄호)에서 "이 값들이 바뀌면 다시 계산해"라고 등록.
3. `computeValue()`만 오버라이드해서 계산식 반환.

처음 값: 15 × 25 = **375.0**. `itemCount.set(20)` 하면 `totalCost.get()`이 **500.0**. `super.bind`를 빼먹으면 값이 바뀌어도 재계산이 안 돼요(시험 함정).

@@SLIDE week-10-4-gui-editor.md
@@S _doc | read
Scene Builder로 **그림판 앱**(Painter)을 만들며 BorderPane, TitledPane, RadioButton + ToggleGroup, 마우스 드래그 이벤트를 연결해요.
@@S PainterController | type
할 일: Scene Builder로 화면을 만들고 PainterController를 직접 쳐서, 드래그하면 원이 그려지고 Undo, Clear가 동작하는지 확인
@@K Scene Graph and Node Size
크기를 숫자로 딱 고정(`setWidth(300)`)하지 말고, **선호 크기(pref)**와 최소/최대 범위를 주고 레이아웃에게 맡기라는 뜻이에요. 그래야 창 크기를 바꿔도 잘 늘어나요. 위치도 절대 좌표가 아니라 **부모 기준**으로.
@@K BorderPane areas
BorderPane 5칸: top, bottom, left, right, center. 다 **선택 사항**이에요. 비어 있는 칸은 옆 칸이 늘어나서 채워요. 그림판에서는 left에 도구(VBox), center에 그림 그리는 Pane을 둬요. center가 남는 공간을 다 먹어서 그리기 영역이 커져요.
@@K Layout settings
- `USE_COMPUTED_SIZE`: 내용물에 맞춰 크기 자동 계산(기본값).
- `MAX_VALUE`(Double.MAX_VALUE): 가능한 만큼 **늘어나기**.
- `USE_PREF_SIZE`: 선호 크기 이상으로 **안 늘어나기**. 도구 열이 필요한 만큼만 차지하게.
- `TitledPane`: 제목 줄 + 접었다 펼 수 있는 패널. "Color", "Size" 묶음에 써요.
- `fx:id="drawingAreaPane"`: 컨트롤러의 `@FXML Pane drawingAreaPane`과 **이름이 같아야** 연결돼요.
@@K RadioButton and ToggleGroup
RadioButton만 여러 개 두면 **여러 개가 동시에** 선택돼요. 같은 `ToggleGroup`에 넣어야 하나만 선택돼요. 색 그룹(colorToggleGroup)과 크기 그룹(sizeToggleGroup)을 따로 두어서 색 하나, 크기 하나를 고르게 해요.

코드로는 `rb.setToggleGroup(group);`. 선택된 것은 `group.getSelectedToggle()`.
@@K Controller and event handler names
Scene Builder에서 쓰는 이름과 컨트롤러 메서드 이름이 **정확히 같아야** 해요(Week 7 FXML과 같은 규칙). FXML에는 `onMouseDragged="#drawingAreaMouseDragged"`처럼 `#`이 붙어요.

`View > Show Sample Controller Skeleton`을 누르면 Scene Builder가 @FXML 필드와 빈 메서드를 만들어 줘요. 복사해서 시작하면 오타가 줄어요.
@@K PainterController
코드 읽기 포인트:

- **enum PenSize**: SMALL(2), MEDIUM(4), LARGE(6). enum에 필드와 생성자를 둘 수 있어요. `radius.getRadius()`로 숫자를 꺼내요.
- **`initialize()`**: FXML이 로드되고 @FXML 필드가 채워진 **뒤에** 자동 호출돼요. 생성자에서 하면 필드가 아직 null이라 안 돼요.
- **`setUserData`**: 버튼마다 "내 값"(Color, PenSize)을 붙여 두기. 그래서 핸들러 하나(`colorRadioButtonSelected`)로 버튼 4개를 처리해요. `getUserData()`는 Object라서 **캐스팅** `(Color)` 필요.
- **드래그**: 마우스가 움직일 때마다 그 위치에 작은 `Circle`을 Pane 자식으로 추가. 원이 촘촘히 이어져서 선처럼 보여요.
- **Undo**: 마지막 자식(`count - 1`) 하나 삭제. 원 하나만 지워져서 여러 번 눌러야 해요. `count > 0` 검사 없이 지우면 빈 화면에서 예외.
- **Clear**: `getChildren().clear()`.

Paint vs Color: `Color`는 `Paint`의 자식이에요. 그래서 `Paint brushColor = Color.BLACK;`이 돼요.

@@TEXT
## 🧩 이번 주 토이 프로젝트: CafeOrder Week 10

주문 화면의 합계를 **바인딩**으로 바꿔요. 각 `OrderLine`에 `IntegerProperty quantity`, `DoubleProperty price`를 두고 `subtotal = quantity.multiply(price)`로 묶어요. 합계 Label은 `totalLabel.textProperty().bind(Bindings.format("$%.2f", total))`. 메뉴 검색은 스트림으로: `menu.stream().filter(i -> i.getName().contains(keyword)).collect(Collectors.toList())`. 버튼 이벤트는 전부 람다로. (토이 가이드는 준비 중이에요.)

## ✅ 시험 대비 체크리스트 (Week 10)

- [ ] 람다 문법 규칙(괄호, 중괄호, return 생략)을 설명하고 틀린 람다를 찾을 수 있다.
- [ ] 함수형 인터페이스(SAM)의 뜻과 `@FunctionalInterface`의 역할을 안다.
- [ ] 익명 클래스를 람다로, 람다를 메서드 참조로 바꿀 수 있다.
- [ ] Predicate, Consumer, Function의 메서드 이름과 반환 타입을 안다.
- [ ] filter, sorted, map, forEach, collect로 파이프라인을 쓰고 결과를 예측할 수 있다.
- [ ] 중간 연산(lazy)과 최종 연산을 구분하고, 스트림은 한 번만 쓸 수 있음을 안다.
- [ ] Simple...Property를 만들고 get/set 할 수 있고, ReadOnlyWrapper의 쓰임을 안다.
- [ ] JavaFX Bean의 세 메서드(getX, setX, xProperty) 이름 규칙을 안다.
- [ ] ChangeListener와 InvalidationListener의 차이(파라미터, eager/lazy)를 안다.
- [ ] bind와 bindBidirectional의 방향, 초기값, set 가능 여부를 안다.
- [ ] Fluent API, Bindings API, Low-Level(computeValue)로 계산된 바인딩을 만들 수 있다.
- [ ] ToggleGroup, setUserData/getUserData, initialize()의 역할을 안다.

## ✍️ 손으로 써 보기

1. 다음 람다 중 컴파일 에러가 나는 것을 모두 고르세요.

```java
Runnable r1 = -> System.out.println("hi");
Function<Integer, Integer> f1 = x -> x + 1;
Function<Integer, Integer> f2 = x -> return x + 1;
BiFunction<Integer, Integer, Integer> f3 = (a, b) -> { a + b; };
Supplier<String> s1 = () -> "hello";
```

<details><summary>1번 정답</summary>

`r1`(파라미터 없으면 `()` 필수), `f2`(중괄호 없이 return 불가), `f3`(중괄호 안에서는 `return a + b;` 필요). f1, s1은 정상.

</details>

2. `List<String> names = Arrays.asList("Kim", "Lee", "Park", "Choi", "Jo");`에서 길이가 3 이상인 이름만 대문자로 바꿔 알파벳순 List로 만드는 스트림을 쓰세요. 결과는?

<details><summary>2번 예시 답</summary>

```java
List<String> result = names.stream()
        .filter(n -> n.length() >= 3)
        .map(String::toUpperCase)
        .sorted()
        .collect(Collectors.toList());
System.out.println(result);   // [CHOI, KIM, LEE, PARK]
```

</details>

3. 출력을 예측하세요.

```java
IntegerProperty a = new SimpleIntegerProperty(1);
IntegerProperty b = new SimpleIntegerProperty(2);
IntegerProperty c = new SimpleIntegerProperty(3);
b.bind(a.multiply(10));
c.bindBidirectional(b);
a.set(5);
System.out.println(a.get() + " " + b.get() + " " + c.get());
```

<details><summary>3번 정답</summary>

`5 50 50`. b는 a × 10을 따라가요(10 → 50). c는 b와 양방향이라 처음에 b 값(10)으로 맞춰지고, b가 50이 되면 c도 50. (주의: 이 상태에서 `c.set(7)`을 하면 b에 set하려다 b가 단방향 bind돼 있어서 예외가 나요.)

</details>
