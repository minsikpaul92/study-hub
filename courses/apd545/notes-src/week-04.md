# Week 4. JavaFX 기초: 화면 구조, 컴포넌트, 이벤트

> **읽는 법**: 📑 표시는 교수님 슬라이드의 핵심 문장(영어 원문 그대로 짧게 발췌)이고, 바로 아래 **🇰🇷 한글 해설**이 이어져요. 💻 표시는 교수님 샘플 코드(`WK_4_Grocery_Check`)예요. ⌨️ 표시가 있는 코드는 IntelliJ JavaFX 프로젝트에서 직접 쳐 보세요.
>
> 드디어 창이 뜨는 프로그램이에요. **Stage ⊃ Scene ⊃ Node** 구조와 **이벤트 핸들러 등록**은 Week 5~8 내내 그대로 써요.

## 0. 이번 주 한눈에 보기

| 개념 | 한 줄 정리 | 시험에 나오는 모양 |
| --- | --- | --- |
| Model vs UI | 모델은 비즈니스 로직, UI를 **몰라야** 함 (println도 가정 X) | "모델에 둘 코드인가?" |
| Stage / Scene / Node | 창 / 창에 보이는 화면(scene graph) / 그 안의 모든 요소 | 포함 관계 |
| `Application` | `start(Stage)`를 override, `main`에서 `launch(args)` | 실행 순서 |
| FXML + Scene Builder | 화면은 XML(선언형), 동작은 Controller(Java) | `fx:controller`, `fx:id`, `onAction="#메서드"` |
| Pane | 자식을 가지는 기본 컨테이너. `getChildren().add(...)` | 절대 좌표 `relocate(x, y)` |
| 컴포넌트 설정 | `setPrefSize`, `setStyle`, `setDisable`, `setVisible`, `setEditable` | disable vs invisible |
| 재사용 Pane | `class AddressPane extends Pane`로 묶어서 컴포넌트처럼 | 추가 순서 = 그리는 순서 |
| 이벤트 3요소 | event, **source**(이벤트가 생긴 컴포넌트), handler | `getSource()` 캐스팅 |
| 핸들러 등록 | `setOnAction(EventHandler<ActionEvent>)`. 안 하면 안 불림 | `handle(T event)` 하나 |

**함정 모음**

- `start()` 안에서 `stage.show()`를 빼먹으면 **창이 안 뜬다**.
- `getChildren().add(x)`를 안 하면 만든 컴포넌트가 **안 보인다**.
- `event.getSource()`는 `Object`를 돌려준다. `getText()`를 쓰려면 `((Button) e.getSource())`로 **캐스팅**.
- `"" + x`로 숫자를 문자열로, `Integer.parseInt(s)` 등으로 문자열을 숫자로. 빈 문자열을 parse하면 `NumberFormatException`.
- `setDisable(true)`는 보이지만 못 누름, `setVisible(false)`는 안 보이고 못 누름.
- 같은 Node 객체는 scene graph에 **한 번만** 들어갈 수 있다(부모가 하나).

{{PRACTICE}}

{{TOC}}

@@SLIDE week-04-1-javafx-intro.md
@@S _doc | read
GUI 프로그램이 무엇인지, JavaFX 앱의 **기본 뼈대**(Application, Stage, Scene)가 어떻게 생겼는지 봐요.
@@S Basic Structure of JavaFX | type
할 일: JavaFXBasic을 쳐서 OK 버튼 하나짜리 창 띄우기
@@S Display a simple shape | type
할 일: ShowCircle을 쳐서 Pane 위에 원 그리기, 반지름과 색을 바꿔 보기
@@K Model, User Interface, GUI
세 단어 구분이 핵심이에요.

- **Model**: 앱의 두뇌(계산, 규칙, 데이터). 은행이라면 계좌 잔액 계산.
- **User Interface**: 사용자와 대화하는 부분. 모델을 **불러서** 바꾸고, 바뀐 결과를 보여 줘요. 계산은 안 해요.
- **GUI**: 창(window)을 쓰는 UI.

모델이 UI를 모른다는 게 중요해요. 모델 안에 `System.out.println`이 있으면 콘솔 앱에서만 쓸 수 있어요. 이게 Week 5 MVC의 출발점이에요.
@@K What is GUI?
GUI는 **컴포넌트**(control, widget)로 조립해요: 버튼, 텍스트필드, 리스트... 그리고 다시 강조: **모델 클래스와 UI 클래스는 코드에서 분리**. 그래야 같은 모델을 콘솔, JavaFX, 웹 화면이 함께 쓸 수 있어요.
@@K History of GUI with Java
AWT → Swing → JavaFX 순서만 기억하면 돼요.
@@K JavaFX vs Swing
JavaFX 장점: 그래픽, 멀티미디어까지 **하나의 API**, **CSS**로 디자인, **GPU** 가속, 더 나은 스레드 지원, Scene Builder가 IDE와 상관없이 같은 코드를 만듦.
@@K Scene Builder and FXML
**FXML** = 화면 배치를 적은 XML 파일. Scene Builder는 FXML을 드래그 앤 드롭으로 편집하는 도구예요.

"declarative(선언형)" = **무엇을** 보여줄지만 적고, **어떻게** 만드는지는 JavaFX가 알아서. HTML과 비슷해요.

장점: 화면(FXML)과 동작(Java 코드)이 분리돼서 디자이너와 개발자가 따로 일할 수 있고 유지보수가 쉬워요.
@@K Basic Structure of JavaFX
뼈대를 외우세요.

1. `extends Application`
2. `start(Stage primaryStage)` override: JavaFX가 **창을 만들어서 넘겨줘요**. 우리는 내용만 채워요.
3. 컴포넌트 만들기 → `new Scene(루트, 너비, 높이)` → `stage.setScene(scene)` → `stage.show()`.
4. `main`에서 `launch(args)`: JavaFX를 시작하고, JavaFX가 `start`를 **불러줘요**.

마지막 줄이 Week 7 IoC의 "Don't call us, we'll call you" 예시예요. 우리는 `start`를 직접 부르지 않아요.
@@K Display a simple shape
`Pane`은 **절대 좌표** 컨테이너예요. 원의 중심을 (100, 100)에 두면 그 자리에 그려져요. 좌표는 **왼쪽 위가 (0, 0)**, 오른쪽이 x+, **아래쪽이 y+**(수학과 반대).

`setStroke`는 테두리 색, `setFill`은 안쪽 색.
@@K Components of JavaFX
용어 정리 표:

| 용어 | 뜻 | 비유 |
| --- | --- | --- |
| Stage | 창 | 극장 무대 |
| Scene | 무대 위 장면 (scene graph 루트를 가짐) | 한 장면 |
| Node | scene graph의 모든 요소 | 배우, 소품 |
| Pane (Container) | 자식 Node를 가지는 Node | 소품 상자 |
| Control | 사용자와 상호작용하는 Node (Button, TextField) | |
| Controller class | FXML 화면의 이벤트 핸들러를 모은 클래스 | |
| Event handler | 사용자 동작에 반응하는 메서드 | |

Stage에는 **활성 Scene이 하나**만 있어요(Week 7에서 갈아 끼우기).
@@K Welcome Application (FXML project)
FXML 프로젝트의 3파일 역할:

- `.fxml`: 화면 배치
- `Main`(Application): FXML을 **로드**해서 창에 띄움
- `Controller`: 버튼 눌렀을 때 할 일

Scene Builder 순서: VBox를 루트로(Trim Document to Selection) → Alignment CENTER → Label, ImageView 추가. 루트의 Pref Size가 처음 창 크기가 돼요.

슬라이드는 Eclipse 기준이지만 우리는 IntelliJ의 JavaFX 템플릿(`hello-view.fxml`, `HelloApplication`, `HelloController`)이 같은 구조예요.

@@SLIDE week-04-2-components.md
@@S _doc | read
버튼, 텍스트필드, 리스트 같은 **컴포넌트**를 코드로 만들고 꾸미는 법, 그리고 **scene graph**(부모-자식 나무)를 봐요.
@@S Example: FruitListApp | type
할 일: FruitListApp을 쳐서 TextField, 버튼 2개, ListView 배치를 그대로 만들어 보기
@@K Scene and Scene Graph
scene graph = **나무 구조**. 루트 하나에서 시작해 Pane 안에 Pane, 그 안에 Button... 부모(parent)와 자식(child) 관계예요. Week 3 Collection처럼 `getChildren()`이 **리스트**를 돌려줘요.
@@K Window Component
양방향으로 이동할 수 있어요: 자식 → `getParent()`, 부모 → `getChildren()`. `getChildren()`의 타입은 `ObservableList<Node>`: 바뀌면 화면이 **자동으로 다시 그려지는** 리스트예요.
@@K Button and its settings
자주 쓰는 설정 정리:

- `setText`, `setGraphic(new ImageView(...))`: 글자, 그림
- `setStyle("-fx-...")`: CSS. `-fx-font`, `-fx-base`(배경), `-fx-text-fill`(글자색)
- `setDisable(true)`: 회색, 못 누름 / `setVisible(false)`: 아예 안 보임
- `relocate(x, y)`: **부모 기준** 왼쪽 위 좌표 / `setPrefSize(w, h)`: 원하는 크기

이미지는 `getClass().getResourceAsStream("brain.gif")`로 읽어요. 파일을 코드와 같은 리소스 폴더에 둬야 해요.
@@K Example: FruitListApp
흐름: Pane 하나 만들고 → 컴포넌트마다 `relocate` + `setPrefSize` → `aPane.getChildren().addAll(...)` → Scene에 Pane.

`fruitList.setItems(FXCollections.observableArrayList(fruits))`: 배열을 ListView가 쓰는 `ObservableList`로 바꿔 넣어요. Week 5 MVC에서 매번 나오는 줄이에요.

`setResizable(false)`로 크기를 고정하면 창이 테두리만큼 살짝 커져서 슬라이드는 Scene 크기를 12x8 줄였어요. 이런 픽셀 계산이 불편해서 다음 주와 Week 6에 **레이아웃 Pane**(VBox, GridPane, BorderPane)을 써요. 그리고 이 앱의 Add, Remove 버튼은 아직 아무 일도 안 해요. 이벤트는 Segment 4.

@@SLIDE week-04-3-grouping.md
@@S _doc | read
여러 컴포넌트를 **Pane 하나로 묶어서** 하나의 부품처럼 재사용하는 법이에요. Week 2의 상속(`extends Pane`)이 GUI에서 쓰이는 첫 예예요.
@@S Example: AddressPane | type
할 일: AddressPane을 만들고 OneApp, TwoApp에서 제목만 바꿔 두 번 재사용해 보기
@@K Organizing Components
이름, 주소, 전화번호 입력칸이 여러 창에 반복된다면? 매번 10줄씩 복사하지 말고 **Pane 클래스 하나**로 만들어 한 줄로 붙여요. Pane 안에 Pane도 넣을 수 있어요.
@@K Example: AddressPane
`AddressPane extends Pane`이니까 AddressPane **is a** Pane이에요. 그래서 `aPane.getChildren().add(myPanel)`처럼 다른 컴포넌트와 똑같이 넣을 수 있어요.

- 생성자 매개변수 `title`로 테두리 제목만 바꿔요.
- `getChildren().addAll(innerPane, titleLabel)`: 이 클래스 **자신**의 자식 목록(`this.getChildren()`).
- **나중에 추가한 게 위에 그려져요.** 제목 라벨이 테두리 선을 덮어야 하니 마지막에 추가.
- `-fx-translate-y: -8`: 라벨을 위로 8px 올려 테두리 선에 걸치게.
- `main`이 없으니 혼자 실행되는 앱이 아니라 **부품**이에요.
@@K ComboBox
ComboBox = 드롭다운. 선택된 하나만 보여요(ListView는 여러 개가 다 보임).

- `setPromptText("...")`: 아무것도 안 골랐을 때 안내 문구
- `setValue("Work Address")`: 처음 선택값
- `getValue()`: 지금 선택값 (나중에 이벤트에서 씀)

슬라이드는 `new ComboBox(options)`처럼 raw type을 쓰는데, Week 3에서 배운 대로 `ComboBox<String>`이 맞아요.
@@K Reusing the pane
같은 클래스로 **객체를 두 개** 만들어 위치만 다르게. 이게 객체지향 재사용이에요. AddressPane 코드를 한 줄도 안 고쳤어요.

@@SLIDE week-04-4-events.md
@@S _doc | read
버튼을 누르면 무언가 일어나게 하는 **이벤트 처리**예요. 이벤트, source, handler 세 단어와 "**등록해야 불린다**"가 핵심이에요.
@@S Registering a handler | type
할 일: SimpleEventTest를 쳐서 버튼을 누를 때마다 콘솔에 메시지가 찍히는지 확인
@@S One handler for many buttons: Keypad | type
할 일: 4x3 키패드를 만들고 getSource()로 어떤 버튼이 눌렸는지 출력
@@S Example: Calculator | type
할 일: CalculatorApp을 쳐서 값 입력 후 Compute로 제곱과 제곱근 표시
@@K Three important definitions
세 단어를 문장으로: "사용자가 **Button**(source)을 클릭하면 **ActionEvent**(event)가 생기고, 등록된 **handler**가 실행된다."
@@K Understanding events flow
흐름 5단계를 외우세요: 사용자 동작 → 이벤트 생성 → 핸들러 호출 → **모델 변경** → **화면 갱신**. 마지막 두 단계가 Week 5 Controller의 두 가지 일(Model 바꾸기, View update)과 똑같아요.
@@K Handling Events
`EventHandler<T>`는 메서드가 `handle(T event)` **하나**인 제네릭 인터페이스예요. 메서드가 하나라서 Week 7부터 쓰는 **람다** `e -> ...`로 줄여 쓸 수 있어요.

**marker interface** = 메서드가 하나도 없는 인터페이스. "나는 이런 종류야"라고 표시만 해요. 예: `EventListener`, `Serializable`(Week 9).
@@K Registering a handler
`new EventHandler<ActionEvent>() { ... }`는 **익명 내부 클래스**: 이름 없는 클래스를 그 자리에서 만들고 객체까지 만들어요.

등록(`setOnAction`)을 안 하면 아무리 handle을 잘 써도 **안 불려요**. 이메일 알림 구독과 같아요.

같은 코드를 람다로:

```java
aButton.setOnAction(e -> System.out.println("That felt good!"));
```
@@K One handler for many buttons: Keypad
버튼 12개를 2중 for문으로 만들어요. 위치 `relocate(10 + col*70, 10 + row*70)`: 칸마다 70px 간격. 라벨 인덱스 `row*3 + col`: 2차원 → 1차원 변환.

**`actionEvent.getSource()`**: 이벤트가 생긴 버튼. 반환형이 `Object`라서 `(Button)`으로 캐스팅해야 `getText()`를 쓸 수 있어요. 시험 단골이에요.

참고: 슬라이드 설명은 "Pane이 EventHandler를 implements"하는 방식을 말하지만, 실제 코드는 버튼마다 익명 클래스를 새로 만들어요. 진짜 하나만 쓰려면 handler를 변수에 한 번 만들어 두고 모든 버튼에 같은 변수를 넘기면 돼요.
@@K Example: Calculator
입력 → 숫자 변환 → 계산 → 출력 패턴이에요.

- `valueField.getText().length() > 0`: 빈칸이면 계산 안 함 (빈 문자열을 parse하면 `NumberFormatException`)
- `Float.parseFloat(...)`: 문자열 → 숫자
- `"" + value * value`: 숫자 → 문자열 (곱셈이 먼저 계산돼요)
- `setEditable(false)`: 결과 칸은 읽기 전용

`"abc"`를 넣으면 여전히 예외가 나요. try-catch로 감싸는 게 더 안전해요.

@@IN week-04-grocery-check.md
@@S _doc | type
할 일: IntelliJ 새 JavaFX 프로젝트에서 FXML + Controller로 장보기 목록 앱 만들기 (버튼 이름과 방향 버그도 고쳐 보기)
@@K Example: GroceryApplication (load FXML)
`FXMLLoader`가 FXML을 읽어 Node 나무를 만들고(`load()`), 동시에 `fx:controller`에 적힌 컨트롤러 객체도 만들어요. `getResource("grocery-view.fxml")`는 이 클래스와 **같은 패키지의 resources 폴더**에서 찾아요. 경로가 틀리면 `Location is not set` 에러.
@@K Example: grocery-view.fxml (key parts)
FXML과 Java를 잇는 세 가지:

- `fx:controller="...GroceryController"`: 이 화면의 컨트롤러 클래스
- `fx:id="groceryLV"`: 컨트롤러의 `@FXML private ListView<String> groceryLV;` 필드와 **이름이 같아야** 연결
- `onAction="#onClickMoveGroceryLeftToRight"`: 버튼 클릭 시 부를 컨트롤러 메서드 (`#` 붙임)

GridPane 3열: 왼쪽 리스트, 가운데 버튼 VBox, 오른쪽 리스트. `&gt;`는 XML에서 `>` 문자예요.
@@K Example: GroceryController
- `@FXML`: FXML이 이 필드, 메서드를 볼 수 있게 해요(private이어도).
- `initialize()`: FXMLLoader가 `@FXML` 필드를 다 채운 **뒤에** 자동으로 불러요. 생성자에서는 `groceryLV`가 아직 null이라 여기서 `setItems`를 해요.
- `getSelectionModel().getSelectedItem()`: 선택 안 했으면 **null** → `if (temp != null)` 검사.
- `ObservableList`를 바꾸면(`add`, `remove`) ListView가 **자동 갱신**돼요. 그래서 원본 코드의 `setItems` 재호출은 사실 필요 없어요(여기서는 뺐어요).

버그 찾기: `>>>` 버튼은 왼쪽 → 오른쪽으로 옮겨야 자연스러운데 `onClickMoveGroceryLeftToRight`는 실제로 **오른쪽(checked) → 왼쪽(grocery)**으로 옮겨요. 메서드 이름과 동작이 뒤바뀌어 있어요. 두 메서드 이름을 서로 바꾸거나 FXML의 `onAction`을 바꿔 연결하면 고쳐져요.

@@TEXT
## 🧩 이번 주 토이 프로젝트: CafeOrder Week 4

콘솔이던 CafeOrder에 첫 화면을 붙여요. 왼쪽 `ListView`에 메뉴, 오른쪽 `ListView`에 장바구니, 가운데 `Add >>`, `<< Remove` 버튼, 아래 `Label`에 합계. FXML + Controller로 만들고, 버튼 핸들러에서 서비스(Week 3)를 부르고 합계 라벨을 갱신해요. (토이 가이드는 준비 중이에요.)

## ✅ 시험 대비 체크리스트 (Week 4)

- [ ] Model, UI, GUI의 역할과 "모델은 UI를 모른다"를 설명할 수 있다.
- [ ] Stage, Scene, Node, Pane, Control의 관계를 말할 수 있다.
- [ ] `Application`, `start(Stage)`, `launch(args)`, `setScene`, `show()`로 창을 띄울 수 있다.
- [ ] FXML의 `fx:controller`, `fx:id`, `onAction="#..."`과 컨트롤러의 `@FXML`, `initialize()`를 연결할 수 있다.
- [ ] `relocate`, `setPrefSize`, `setStyle`, `setDisable`, `setVisible`, `setEditable`을 구분한다.
- [ ] `extends Pane`으로 재사용 가능한 부품을 만들 수 있다.
- [ ] ComboBox의 `setPromptText`, `setValue`, `getValue`를 안다.
- [ ] event, source, handler를 정의하고, 핸들러를 등록해야 불린다는 것을 안다.
- [ ] `EventHandler<ActionEvent>`를 익명 클래스와 람다 두 가지로 쓸 수 있다.
- [ ] `getSource()` 캐스팅, `parseInt`/`parseDouble`, `"" + x` 변환을 쓸 수 있다.

## ✍️ 손으로 써 보기

1. TextField 하나, Button `Greet` 하나, Label 하나를 Pane에 두고, 버튼을 누르면 Label에 `Hello, <이름>!`이 나오는 `start` 메서드를 쓰세요. 이름이 비어 있으면 `Enter a name`.

<details><summary>1번 예시 답</summary>

```java
@Override
public void start(Stage stage) {
    TextField nameField = new TextField();
    nameField.relocate(10, 10);
    Button greet = new Button("Greet");
    greet.relocate(180, 10);
    Label out = new Label();
    out.relocate(10, 50);

    greet.setOnAction(e -> {
        String name = nameField.getText().trim();
        if (name.isEmpty()) out.setText("Enter a name");
        else out.setText("Hello, " + name + "!");
    });

    Pane pane = new Pane();
    pane.getChildren().addAll(nameField, greet, out);
    stage.setScene(new Scene(pane, 260, 90));
    stage.show();
}
```

</details>

2. 버튼 `A`, `B`, `C`가 같은 핸들러 하나를 공유하고, 눌린 버튼의 글자를 출력하게 하세요. 핸들러는 **한 번만** 만드세요.

<details><summary>2번 예시 답</summary>

```java
EventHandler<ActionEvent> handler = e -> {
    Button src = (Button) e.getSource();
    System.out.println(src.getText() + " pressed");
};
for (String s : new String[]{"A", "B", "C"}) {
    Button b = new Button(s);
    b.setOnAction(handler);
    pane.getChildren().add(b);
}
```

</details>

3. 아래 컨트롤러에서 실행하면 `NullPointerException`이 나요. 이유와 고치는 법은?

```java
public class MyController {
    @FXML private ListView<String> list;

    public MyController() {
        list.setItems(FXCollections.observableArrayList("a", "b"));
    }
}
```

<details><summary>3번 정답</summary>

생성자가 실행될 때는 FXMLLoader가 아직 `@FXML` 필드를 채우지 않아서 `list`가 null이에요. 이 코드를 `@FXML public void initialize() { ... }`로 옮기면 돼요. FXML의 `fx:id="list"` 이름이 필드와 같은지도 확인하세요.

</details>
