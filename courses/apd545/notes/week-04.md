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


**⌨️ IntelliJ에서 직접 쳐 볼 것 (이 순서대로)**

어디 칸을 누르면 그 코드로 바로 가요. 코드 위에도 ⌨️ 표시가 있어요.

| # | 어디 | 무엇을 |
| --- | --- | --- |
| 1 | [Basic Structure of JavaFX](#practice-1) | JavaFXBasic을 쳐서 OK 버튼 하나짜리 창 띄우기 |
| 2 | [Display a simple shape](#practice-2) | ShowCircle을 쳐서 Pane 위에 원 그리기, 반지름과 색을 바꿔 보기 |
| 3 | [Example: FruitListApp](#practice-3) | FruitListApp을 쳐서 TextField, 버튼 2개, ListView 배치를 그대로 만들어 보기 |
| 4 | [Example: AddressPane](#practice-4) | AddressPane을 만들고 OneApp, TwoApp에서 제목만 바꿔 두 번 재사용해 보기 |
| 5 | [Registering a handler](#practice-5) | SimpleEventTest를 쳐서 버튼을 누를 때마다 콘솔에 메시지가 찍히는지 확인 |
| 6 | [One handler for many buttons: Keypad](#practice-6) | 4x3 키패드를 만들고 getSource()로 어떤 버튼이 눌렸는지 출력 |
| 7 | [Example: Calculator](#practice-7) | CalculatorApp을 쳐서 값 입력 후 Compute로 제곱과 제곱근 표시 |

나머지 👀 표시는 읽고 이해만 하면 돼요. 같은 개념을 위 예제에서 이미 타이핑해요.



## 목차

- 1. 📑 강의 슬라이드: Week 4 · Segment 1. User Interfaces and JavaFX Applications
- 2. 📑 강의 슬라이드: Week 4 · Segment 2. Components and Containers
- 3. 📑 강의 슬라이드: Week 4 · Segment 3. Grouping Components Together
- 4. 📑 강의 슬라이드: Week 4 · Segment 4. Event Driven Programming
- 5. 💻 교수님 샘플 코드: Week 4 · Sample: WK_4_Grocery_Check
- 🧩 이번 주 토이 프로젝트: CafeOrder Week 4
- ✅ 시험 대비 체크리스트 (Week 4)
- ✍️ 손으로 써 보기


---

## 1. 📑 강의 슬라이드: Week 4 · Segment 1. User Interfaces and JavaFX Applications

<div class="sum" data-kind="read">

**🧭 먼저 한국어로** · 👀 읽고 이해하기 (타이핑 안 해도 돼요)

GUI 프로그램이 무엇인지, JavaFX 앱의 **기본 뼈대**(Application, Stage, Scene)가 어떻게 생겼는지 봐요.

**이 챕터 구성**

- 👀 **Model, User Interface, GUI**: Model: 앱의 두뇌(계산, 규칙, 데이터).
- 👀 **What is GUI?**: GUI는 컴포넌트(control, widget)로 조립해요: 버튼, 텍스트필드, 리스트...
- 👀 **History of GUI with Java**: AWT → Swing → JavaFX 순서만 기억하면 돼요.
- 👀 **JavaFX vs Swing**: JavaFX 장점: 그래픽, 멀티미디어까지 하나의 API, CSS로 디자인, GPU 가속, 더 나은 스레드 지원, Scene Builder가 IDE와 상관없이 같은 코드를 만듦.
- 👀 **Scene Builder and FXML**: FXML = 화면 배치를 적은 XML 파일. Scene Builder는 FXML을 드래그 앤 드롭으로 편집하는 도구예요.
- ⌨️ **[Basic Structure of JavaFX](#practice-1)**:  (⌨️ JavaFXBasic을 쳐서 OK 버튼 하나짜리 창 띄우기)
- ⌨️ **[Display a simple shape](#practice-2)**:  (⌨️ ShowCircle을 쳐서 Pane 위에 원 그리기, 반지름과 색을 바꿔 보기)
- 👀 **Components of JavaFX**: Stage에는 활성 Scene이 하나만 있어요(Week 7에서 갈아 끼우기).
- 👀 **Welcome Application (FXML project)**: `.fxml`: 화면 배치

</div>

> 원문 출처: APD545 Week 4 · Segment 1 "GUI with JavaFX" 강의 슬라이드 (Mahboob Ali, Seneca) 핵심 문장 발췌

### 📑 Model, User Interface, GUI

> - The **model** of an application consists of all classes that represent the "business logic" part of the application. The model is always developed separately from the user interface. It should not assume any knowledge about the user interface at all (e.g., model classes should not assume that `System.out.println()` is available).
> - The **user interface** is the part of the application that is attached to the model which handles interaction with the user and does NOT deal with the business logic. It often causes the model to change, and the changes are reflected back on the user interface.
> - A **graphical user interface (GUI)** is a user interface that makes use of one or more windows to interact with the user.

**🇰🇷 한글 해설**

세 단어 구분이 핵심이에요.

- **Model**: 앱의 두뇌(계산, 규칙, 데이터). 은행이라면 계좌 잔액 계산.
- **User Interface**: 사용자와 대화하는 부분. 모델을 **불러서** 바꾸고, 바뀐 결과를 보여 줘요. 계산은 안 해요.
- **GUI**: 창(window)을 쓰는 UI.

모델이 UI를 모른다는 게 중요해요. 모델 안에 `System.out.println`이 있으면 콘솔 앱에서만 쓸 수 있어요. 이게 Week 5 MVC의 출발점이에요.

### 📑 What is GUI?

> GUIs are built from GUI components, also called **controls** or **widgets** (window gadgets). There should always be a **separation** in your code between the model classes and the user interface classes. Such a separation allows you to share the same model classes with different interfaces.

**🇰🇷 한글 해설**

GUI는 **컴포넌트**(control, widget)로 조립해요: 버튼, 텍스트필드, 리스트... 그리고 다시 강조: **모델 클래스와 UI 클래스는 코드에서 분리**. 그래야 같은 모델을 콘솔, JavaFX, 웹 화면이 함께 쓸 수 있어요.

### 📑 History of GUI with Java

> AWT (original) → Swing (Java SE 1.2) → **JavaFX** (current GUI, graphics and multimedia API).

**🇰🇷 한글 해설**

AWT → Swing → JavaFX 순서만 기억하면 돼요.

### 📑 JavaFX vs Swing

> - JavaFX provides one API for GUI, graphics and multimedia (images, animation, audio, video). Swing is only for GUIs.
> - JavaFX Scene Builder produces the same code regardless of the IDE.
> - Complete control over look-and-feel via **CSS**.
> - Better threading support; uses the **GPU** for hardware-accelerated rendering.

**🇰🇷 한글 해설**

JavaFX 장점: 그래픽, 멀티미디어까지 **하나의 API**, **CSS**로 디자인, **GPU** 가속, 더 나은 스레드 지원, Scene Builder가 IDE와 상관없이 같은 코드를 만듦.

### 📑 Scene Builder and FXML

> JavaFX Scene Builder lets you create GUIs by dragging and dropping components. It generates **FXML**, an XML vocabulary for defining and arranging JavaFX GUI controls. This is an example of **declarative** programming. The separation of the interface (the GUI) from the implementation (the Java code) makes it easier to debug, modify and maintain.

**🇰🇷 한글 해설**

**FXML** = 화면 배치를 적은 XML 파일. Scene Builder는 FXML을 드래그 앤 드롭으로 편집하는 도구예요.

"declarative(선언형)" = **무엇을** 보여줄지만 적고, **어떻게** 만드는지는 JavaFX가 알아서. HTML과 비슷해요.

장점: 화면(FXML)과 동작(Java 코드)이 분리돼서 디자이너와 개발자가 따로 일할 수 있고 유지보수가 쉬워요.

### 📑 Basic Structure of JavaFX

> Application → override the **start(Stage)** method. Stage, Scene, and Nodes.


<p class="typeit" id="practice-1">⌨️ <b>이 코드는 IntelliJ에서 직접 쳐 보세요</b>: JavaFXBasic을 쳐서 OK 버튼 하나짜리 창 띄우기</p>

```java
public class JavaFXBasic extends Application {
    @Override
    public void start(Stage primaryStage) {
        Button btOK = new Button("OK");
        Scene scene = new Scene(btOK, 200, 250);
        primaryStage.setTitle("JavaFX Basic Structure");
        primaryStage.setScene(scene);
        primaryStage.show();
    }

    public static void main(String[] args) {
        launch(args);
    }
}
```

**🇰🇷 한글 해설**

뼈대를 외우세요.

1. `extends Application`
2. `start(Stage primaryStage)` override: JavaFX가 **창을 만들어서 넘겨줘요**. 우리는 내용만 채워요.
3. 컴포넌트 만들기 → `new Scene(루트, 너비, 높이)` → `stage.setScene(scene)` → `stage.show()`.
4. `main`에서 `launch(args)`: JavaFX를 시작하고, JavaFX가 `start`를 **불러줘요**.

마지막 줄이 Week 7 IoC의 "Don't call us, we'll call you" 예시예요. 우리는 `start`를 직접 부르지 않아요.

### 📑 Display a simple shape


<p class="typeit" id="practice-2">⌨️ <b>이 코드는 IntelliJ에서 직접 쳐 보세요</b>: ShowCircle을 쳐서 Pane 위에 원 그리기, 반지름과 색을 바꿔 보기</p>

```java
Circle circle = new Circle();
circle.setCenterX(100);
circle.setCenterY(100);
circle.setRadius(50);
circle.setStroke(Color.BLACK);
circle.setFill(Color.WHITE);

Pane pane = new Pane();
pane.getChildren().add(circle);
primaryStage.setScene(new Scene(pane, 200, 200));
```

**🇰🇷 한글 해설**

`Pane`은 **절대 좌표** 컨테이너예요. 원의 중심을 (100, 100)에 두면 그 자리에 그려져요. 좌표는 **왼쪽 위가 (0, 0)**, 오른쪽이 x+, **아래쪽이 y+**(수학과 반대).

`setStroke`는 테두리 색, `setFill`은 안쪽 색.

### 📑 Components of JavaFX

> - **Stage**: the window in which a JavaFX app's GUI is displayed (`javafx.stage`).
> - **Scene**: the stage contains one active scene that defines the GUI as a **scene graph**, a tree data structure of an app's visual elements (`javafx.scene`).
> - **Node**: each visual element in the scene graph is a node.
> - **Container / Layout container**: nodes that have children; arrange their child nodes. Base class: **Pane**.
> - **Controls**: Labels, TextFields, Buttons and more.
> - **Controller class**: an FXML GUI's event handlers are defined in a controller class.
> - **Event handler**: a method that responds to a user interaction.

**🇰🇷 한글 해설**

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

### 📑 Welcome Application (FXML project)

> - `Welcome.fxml`: the FXML markup for GUI.
> - `Main.java`: creates the GUI from the FXML file and displays it in a window.
> - `WelcomeController.java`: the class in which you'd define the GUI's event handlers.
>
> In Scene Builder: add a **VBox**, make it the root (Edit > Trim Document to Selection), set Alignment to CENTER, Pref Width 450, Pref Height 300, add a Label and an ImageView.

**🇰🇷 한글 해설**

FXML 프로젝트의 3파일 역할:

- `.fxml`: 화면 배치
- `Main`(Application): FXML을 **로드**해서 창에 띄움
- `Controller`: 버튼 눌렀을 때 할 일

Scene Builder 순서: VBox를 루트로(Trim Document to Selection) → Alignment CENTER → Label, ImageView 추가. 루트의 Pref Size가 처음 창 크기가 돼요.

슬라이드는 Eclipse 기준이지만 우리는 IntelliJ의 JavaFX 템플릿(`hello-view.fxml`, `HelloApplication`, `HelloController`)이 같은 구조예요.


---

## 2. 📑 강의 슬라이드: Week 4 · Segment 2. Components and Containers

<div class="sum" data-kind="read">

**🧭 먼저 한국어로** · 👀 읽고 이해하기 (타이핑 안 해도 돼요)

버튼, 텍스트필드, 리스트 같은 **컴포넌트**를 코드로 만들고 꾸미는 법, 그리고 **scene graph**(부모-자식 나무)를 봐요.

**이 챕터 구성**

- 👀 **Scene and Scene Graph**: scene graph = 나무 구조. 루트 하나에서 시작해 Pane 안에 Pane, 그 안에 Button...
- 👀 **Window Component**: 양방향으로 이동할 수 있어요: 자식 → `getParent()`, 부모 → `getChildren()`.
- 👀 **Button and its settings**: `setText`, `setGraphic(new ImageView(...))`: 글자, 그림
- ⌨️ **[Example: FruitListApp](#practice-3)**:  (⌨️ FruitListApp을 쳐서 TextField, 버튼 2개, ListView 배치를 그대로 만들어 보기)

</div>

> 원문 출처: APD545 Week 4 · Segment 2 "Components and Containers" 강의 슬라이드 (Mahboob Ali, Seneca) 핵심 문장 발췌

### 📑 Scene and Scene Graph

> The scene is arranged as a tree-like graph containing Node objects, called the **scene graph**. It begins with a **root node**. If node c is contained within another node p, then c is called a **child** of p and p is the **parent** of c.

**🇰🇷 한글 해설**

scene graph = **나무 구조**. 루트 하나에서 시작해 Pane 안에 Pane, 그 안에 Button... 부모(parent)와 자식(child) 관계예요. Week 3 Collection처럼 `getChildren()`이 **리스트**를 돌려줘요.

### 📑 Window Component

```java
Parent p = aComponent.getParent();
ObservableList<Node> children = aParent.getChildren();
Node c1 = children.get(0);
```

**🇰🇷 한글 해설**

양방향으로 이동할 수 있어요: 자식 → `getParent()`, 부모 → `getChildren()`. `getChildren()`의 타입은 `ObservableList<Node>`: 바뀌면 화면이 **자동으로 다시 그려지는** 리스트예요.

### 📑 Button and its settings

```java
Button b = new Button("Press Me");
b.setText("Don't Press Me");
b.setAlignment(Pos.CENTER);

Image anImage = new Image(getClass().getResourceAsStream("brain.gif"));
Button b2 = new Button("Brain", new ImageView(anImage));
b2.setGraphic(new ImageView(anImage));

b.setStyle("-fx-font: 22 arial; -fx-base: rgb(170,0,0); -fx-text-fill: rgb(255,255,255);");
b.setDisable(true);     // cannot be controlled
b.setVisible(false);    // cannot be seen nor controlled
b.relocate(40, 60);     // x, y relative to its parent (top-left corner)
b.setPrefSize(100, 25); // width, height
```

**🇰🇷 한글 해설**

자주 쓰는 설정 정리:

- `setText`, `setGraphic(new ImageView(...))`: 글자, 그림
- `setStyle("-fx-...")`: CSS. `-fx-font`, `-fx-base`(배경), `-fx-text-fill`(글자색)
- `setDisable(true)`: 회색, 못 누름 / `setVisible(false)`: 아예 안 보임
- `relocate(x, y)`: **부모 기준** 왼쪽 위 좌표 / `setPrefSize(w, h)`: 원하는 크기

이미지는 `getClass().getResourceAsStream("brain.gif")`로 읽어요. 파일을 코드와 같은 리소스 폴더에 둬야 해요.

### 📑 Example: FruitListApp


<p class="typeit" id="practice-3">⌨️ <b>이 코드는 IntelliJ에서 직접 쳐 보세요</b>: FruitListApp을 쳐서 TextField, 버튼 2개, ListView 배치를 그대로 만들어 보기</p>

```java
Pane aPane = new Pane();

TextField newItemField = new TextField();
newItemField.relocate(10, 10);
newItemField.setPrefSize(150, 25);

Button addButton = new Button("Add");
addButton.relocate(175, 10);
addButton.setPrefSize(100, 25);

Button removeButton = new Button("Remove");
removeButton.relocate(175, 45);
removeButton.setPrefSize(100, 25);

ListView<String> fruitList = new ListView<>();
String[] fruits = {"Apples", "Oranges", "Bananas", "Cherries"};
fruitList.setItems(FXCollections.observableArrayList(fruits));
fruitList.relocate(10, 45);
fruitList.setPrefSize(150, 150);

aPane.getChildren().addAll(newItemField, addButton, removeButton, fruitList);
primaryStage.setTitle("My Fruit List");
primaryStage.setResizable(false);
primaryStage.setScene(new Scene(aPane, 285, 205));
primaryStage.show();
```

**🇰🇷 한글 해설**

흐름: Pane 하나 만들고 → 컴포넌트마다 `relocate` + `setPrefSize` → `aPane.getChildren().addAll(...)` → Scene에 Pane.

`fruitList.setItems(FXCollections.observableArrayList(fruits))`: 배열을 ListView가 쓰는 `ObservableList`로 바꿔 넣어요. Week 5 MVC에서 매번 나오는 줄이에요.

`setResizable(false)`로 크기를 고정하면 창이 테두리만큼 살짝 커져서 슬라이드는 Scene 크기를 12x8 줄였어요. 이런 픽셀 계산이 불편해서 다음 주와 Week 6에 **레이아웃 Pane**(VBox, GridPane, BorderPane)을 써요. 그리고 이 앱의 Add, Remove 버튼은 아직 아무 일도 안 해요. 이벤트는 Segment 4.


---

## 3. 📑 강의 슬라이드: Week 4 · Segment 3. Grouping Components Together

<div class="sum" data-kind="read">

**🧭 먼저 한국어로** · 👀 읽고 이해하기 (타이핑 안 해도 돼요)

여러 컴포넌트를 **Pane 하나로 묶어서** 하나의 부품처럼 재사용하는 법이에요. Week 2의 상속(`extends Pane`)이 GUI에서 쓰이는 첫 예예요.

**이 챕터 구성**

- 👀 **Organizing Components**: 이름, 주소, 전화번호 입력칸이 여러 창에 반복된다면? 매번 10줄씩 복사하지 말고 Pane 클래스 하나로 만들어 한 줄로 붙여요.
- ⌨️ **[Example: AddressPane](#practice-4)**:  (⌨️ AddressPane을 만들고 OneApp, TwoApp에서 제목만 바꿔 두 번 재사용해 보기)
- 👀 **ComboBox**: ComboBox = 드롭다운. 선택된 하나만 보여요(ListView는 여러 개가 다 보임).
- 👀 **Reusing the pane**: 같은 클래스로 객체를 두 개 만들어 위치만 다르게.

</div>

> 원문 출처: APD545 Week 4 · Segment 3 "Grouping Components Together" 강의 슬라이드 (Mahboob Ali, Seneca) 핵심 문장 발췌

### 📑 Organizing Components

> It is a good idea to share component layouts among the similar windows within an application so that the amount of code you write is reduced. We often lay out components onto a **Pane** and then place the Pane on our window. We can have a Pane within another Pane.

**🇰🇷 한글 해설**

이름, 주소, 전화번호 입력칸이 여러 창에 반복된다면? 매번 10줄씩 복사하지 말고 **Pane 클래스 하나**로 만들어 한 줄로 붙여요. Pane 안에 Pane도 넣을 수 있어요.

### 📑 Example: AddressPane


<p class="typeit" id="practice-4">⌨️ <b>이 코드는 IntelliJ에서 직접 쳐 보세요</b>: AddressPane을 만들고 OneApp, TwoApp에서 제목만 바꿔 두 번 재사용해 보기</p>

```java
public class AddressPane extends Pane {
    public AddressPane(String title) {
        Pane innerPane = new Pane();
        innerPane.setStyle("-fx-background-color: white; -fx-border-color: gray; -fx-padding: 4 4;");

        Label label1 = new Label("Name:");
        label1.relocate(10, 20);
        label1.setPrefSize(80, 30);
        TextField nameField = new TextField();
        nameField.relocate(100, 20);
        nameField.setPrefSize(300, 30);
        // ... Street, City, Province, Postal Code the same way

        innerPane.getChildren().addAll(label1, nameField /* , ... */);

        Label titleLabel = new Label(title);
        titleLabel.setStyle("-fx-background-color: white; -fx-translate-y: -8; -fx-translate-x: 10;");
        getChildren().addAll(innerPane, titleLabel);   // order matters: title drawn on top
    }
}
```

> The order of adding is important because we want the titleLabel to be drawn **on top of** the innerPane. The AddressPane class itself is not a runnable application. It will be "treated" as a **single component**.

**🇰🇷 한글 해설**

`AddressPane extends Pane`이니까 AddressPane **is a** Pane이에요. 그래서 `aPane.getChildren().add(myPanel)`처럼 다른 컴포넌트와 똑같이 넣을 수 있어요.

- 생성자 매개변수 `title`로 테두리 제목만 바꿔요.
- `getChildren().addAll(innerPane, titleLabel)`: 이 클래스 **자신**의 자식 목록(`this.getChildren()`).
- **나중에 추가한 게 위에 그려져요.** 제목 라벨이 테두리 선을 덮어야 하니 마지막에 추가.
- `-fx-translate-y: -8`: 라벨을 위로 8px 올려 테두리 선에 걸치게.
- `main`이 없으니 혼자 실행되는 앱이 아니라 **부품**이에요.

### 📑 ComboBox

> A ComboBox represents a drop-down list. Only the selected item is shown.

```java
ObservableList<String> options = FXCollections.observableArrayList(
        "Home Address", "Work Address", "Alternate Address");
ComboBox<String> addressBox = new ComboBox<>(options);
addressBox.setPromptText("Choose address type");
addressBox.setValue("Work Address");
```

**🇰🇷 한글 해설**

ComboBox = 드롭다운. 선택된 하나만 보여요(ListView는 여러 개가 다 보임).

- `setPromptText("...")`: 아무것도 안 골랐을 때 안내 문구
- `setValue("Work Address")`: 처음 선택값
- `getValue()`: 지금 선택값 (나중에 이벤트에서 씀)

슬라이드는 `new ComboBox(options)`처럼 raw type을 쓰는데, Week 3에서 배운 대로 `ComboBox<String>`이 맞아요.

### 📑 Reusing the pane

```java
AddressPane myPanel1 = new AddressPane("HOME ADDRESS");
myPanel1.relocate(170, 10);
AddressPane myPanel2 = new AddressPane("ALTERNATE ADDRESS");
myPanel2.relocate(170, 230);
aPane.getChildren().addAll(myPanel1, myPanel2);
```

**🇰🇷 한글 해설**

같은 클래스로 **객체를 두 개** 만들어 위치만 다르게. 이게 객체지향 재사용이에요. AddressPane 코드를 한 줄도 안 고쳤어요.


---

## 4. 📑 강의 슬라이드: Week 4 · Segment 4. Event Driven Programming

<div class="sum" data-kind="read">

**🧭 먼저 한국어로** · 👀 읽고 이해하기 (타이핑 안 해도 돼요)

버튼을 누르면 무언가 일어나게 하는 **이벤트 처리**예요. 이벤트, source, handler 세 단어와 "**등록해야 불린다**"가 핵심이에요.

**이 챕터 구성**

- 👀 **Three important definitions**: 세 단어를 문장으로: "사용자가 Button(source)을 클릭하면 ActionEvent(event)가 생기고, 등록된 handler가 실행된다.
- 👀 **Understanding events flow**: 흐름 5단계를 외우세요: 사용자 동작 → 이벤트 생성 → 핸들러 호출 → 모델 변경 → 화면 갱신.
- 👀 **Handling Events**: `EventHandler<T>`는 메서드가 `handle(T event)` 하나인 제네릭 인터페이스예요.
- ⌨️ **[Registering a handler](#practice-5)**:  (⌨️ SimpleEventTest를 쳐서 버튼을 누를 때마다 콘솔에 메시지가 찍히는지 확인)
- ⌨️ **[One handler for many buttons: Keypad](#practice-6)**:  (⌨️ 4x3 키패드를 만들고 getSource()로 어떤 버튼이 눌렸는지 출력)
- ⌨️ **[Example: Calculator](#practice-7)**:  (⌨️ CalculatorApp을 쳐서 값 입력 후 Compute로 제곱과 제곱근 표시)

</div>

> 원문 출처: APD545 Week 4 · Segment 4 "Event Handling" 강의 슬라이드 (Mahboob Ali, Seneca) 핵심 문장 발췌

### 📑 Three important definitions

> - An **event** is something that happens in the program based on some kind of triggering input, typically caused by user interaction such as pressing a key, moving the mouse, or pressing a mouse button.
> - The **source** of an event is the component for which the event was generated (i.e., when handling button clicks, the Button is the source).
> - An **event handler** is a procedure that contains the code to be executed when a specific type of event occurs.

**🇰🇷 한글 해설**

세 단어를 문장으로: "사용자가 **Button**(source)을 클릭하면 **ActionEvent**(event)가 생기고, 등록된 **handler**가 실행된다."

### 📑 Understanding events flow

> The user causes an event → events are generated → the appropriate event handler is called → the event handling code **changes the model** → the user interface is **updated** to reflect these changes.

**🇰🇷 한글 해설**

흐름 5단계를 외우세요: 사용자 동작 → 이벤트 생성 → 핸들러 호출 → **모델 변경** → **화면 갱신**. 마지막 두 단계가 Week 5 Controller의 두 가지 일(Model 바꾸기, View update)과 똑같아요.

### 📑 Handling Events

> Application logic is contained in the event filters and handlers, which are objects of the **EventHandler** interface.

```java
public interface EventHandler<T extends Event> extends EventListener {
    void handle(T event);
}
```

> EventHandler is a generic interface in `javafx.event`. EventListener is a **marker interface** (empty, no methods) in `java.util`.

**🇰🇷 한글 해설**

`EventHandler<T>`는 메서드가 `handle(T event)` **하나**인 제네릭 인터페이스예요. 메서드가 하나라서 Week 7부터 쓰는 **람다** `e -> ...`로 줄여 쓸 수 있어요.

**marker interface** = 메서드가 하나도 없는 인터페이스. "나는 이런 종류야"라고 표시만 해요. 예: `EventListener`, `Serializable`(Week 9).

### 📑 Registering a handler

> For every event that we want to handle, we must not only write the event handler but also **register** that event handler too. Like signing up on a webpage to receive an email notification.


<p class="typeit" id="practice-5">⌨️ <b>이 코드는 IntelliJ에서 직접 쳐 보세요</b>: SimpleEventTest를 쳐서 버튼을 누를 때마다 콘솔에 메시지가 찍히는지 확인</p>

```java
aButton.setOnAction(new EventHandler<ActionEvent>() {
    public void handle(ActionEvent event) {
        System.out.println("That felt good!");
    }
});
```

**🇰🇷 한글 해설**

`new EventHandler<ActionEvent>() { ... }`는 **익명 내부 클래스**: 이름 없는 클래스를 그 자리에서 만들고 객체까지 만들어요.

등록(`setOnAction`)을 안 하면 아무리 handle을 잘 써도 **안 불려요**. 이메일 알림 구독과 같아요.

같은 코드를 람다로:

```java
aButton.setOnAction(e -> System.out.println("That felt good!"));
```

### 📑 One handler for many buttons: Keypad


<p class="typeit" id="practice-6">⌨️ <b>이 코드는 IntelliJ에서 직접 쳐 보세요</b>: 4x3 키패드를 만들고 getSource()로 어떤 버튼이 눌렸는지 출력</p>

```java
String[] labels = {"1","2","3","4","5","6","7","8","9","*","0","#"};
for (int row = 0; row < 4; row++) {
    for (int col = 0; col < 3; col++) {
        buttons[row][col] = new Button(labels[row * 3 + col]);
        buttons[row][col].relocate(10 + col * 70, 10 + row * 70);
        buttons[row][col].setPrefSize(65, 65);
        buttons[row][col].setOnAction(new EventHandler<ActionEvent>() {
            public void handle(ActionEvent actionEvent) {
                System.out.println("Button " +
                    ((Button) actionEvent.getSource()).getText() + " was pressed.");
            }
        });
        aPane.getChildren().add(buttons[row][col]);
    }
}
```

**🇰🇷 한글 해설**

버튼 12개를 2중 for문으로 만들어요. 위치 `relocate(10 + col*70, 10 + row*70)`: 칸마다 70px 간격. 라벨 인덱스 `row*3 + col`: 2차원 → 1차원 변환.

**`actionEvent.getSource()`**: 이벤트가 생긴 버튼. 반환형이 `Object`라서 `(Button)`으로 캐스팅해야 `getText()`를 쓸 수 있어요. 시험 단골이에요.

참고: 슬라이드 설명은 "Pane이 EventHandler를 implements"하는 방식을 말하지만, 실제 코드는 버튼마다 익명 클래스를 새로 만들어요. 진짜 하나만 쓰려면 handler를 변수에 한 번 만들어 두고 모든 버튼에 같은 변수를 넘기면 돼요.

### 📑 Example: Calculator

> Convert text to numbers: `Float.parseFloat(s)`, `Integer.parseInt(s)`, `Double.parseDouble(s)`, `Boolean.parseBoolean(s)`. Convert a number into a String: `aTextField.setText("" + x);`. Output-only fields: `setEditable(false)`.


<p class="typeit" id="practice-7">⌨️ <b>이 코드는 IntelliJ에서 직접 쳐 보세요</b>: CalculatorApp을 쳐서 값 입력 후 Compute로 제곱과 제곱근 표시</p>

```java
computeButton.setOnAction(new EventHandler<ActionEvent>() {
    public void handle(ActionEvent actionEvent) {
        if (valueField.getText().length() > 0) {
            float value = Float.parseFloat(valueField.getText());
            squareField.setText("" + value * value);
            rootField.setText("" + Math.sqrt(value));
        }
    }
});
```

**🇰🇷 한글 해설**

입력 → 숫자 변환 → 계산 → 출력 패턴이에요.

- `valueField.getText().length() > 0`: 빈칸이면 계산 안 함 (빈 문자열을 parse하면 `NumberFormatException`)
- `Float.parseFloat(...)`: 문자열 → 숫자
- `"" + value * value`: 숫자 → 문자열 (곱셈이 먼저 계산돼요)
- `setEditable(false)`: 결과 칸은 읽기 전용

`"abc"`를 넣으면 여전히 예외가 나요. try-catch로 감싸는 게 더 안전해요.


---

## 5. 💻 교수님 샘플 코드: Week 4 · Sample: WK_4_Grocery_Check

<div class="sum" data-kind="type">

**🧭 먼저 한국어로** · ⌨️ IntelliJ에서 직접 쳐 보기

할 일: IntelliJ 새 JavaFX 프로젝트에서 FXML + Controller로 장보기 목록 앱 만들기 (버튼 이름과 방향 버그도 고쳐 보기)

**이 챕터 구성**

- ⌨️ **Example: GroceryApplication (load FXML)**: `FXMLLoader`가 FXML을 읽어 Node 나무를 만들고(`load()`), 동시에 `fx:controller`에 적힌 컨트롤러 객체도 만들어요.
- ⌨️ **Example: grocery-view.fxml (key parts)**: `fx:controller="...GroceryController"`: 이 화면의 컨트롤러 클래스
- ⌨️ **Example: GroceryController**: `@FXML`: FXML이 이 필드, 메서드를 볼 수 있게 해요(private이어도).

</div>

> 원문 출처: APD545 Week 4 교수님 샘플 코드 WK_4_Grocery_Check 발췌 (FXML + Controller)

### 💻 Example: GroceryApplication (load FXML)

```java
public class GroceryApplication extends Application {
    @Override
    public void start(Stage stage) throws IOException {
        FXMLLoader fxmlLoader = new FXMLLoader(GroceryApplication.class.getResource("grocery-view.fxml"));
        Scene scene = new Scene(fxmlLoader.load());
        stage.setTitle("Hello!");
        stage.setScene(scene);
        stage.show();
    }
}
```

**🇰🇷 한글 해설**

`FXMLLoader`가 FXML을 읽어 Node 나무를 만들고(`load()`), 동시에 `fx:controller`에 적힌 컨트롤러 객체도 만들어요. `getResource("grocery-view.fxml")`는 이 클래스와 **같은 패키지의 resources 폴더**에서 찾아요. 경로가 틀리면 `Location is not set` 에러.

### 💻 Example: grocery-view.fxml (key parts)

```xml
<GridPane fx:controller="ca.senecacollege.application.controllers.GroceryController" ...>
   <children>
      <Label text="Grocery List" />
      <Label text="Checked List" GridPane.columnIndex="2" />
      <ListView fx:id="groceryLV" GridPane.rowIndex="1" />
      <ListView fx:id="checkedLV" GridPane.columnIndex="2" GridPane.rowIndex="1" />
      <VBox alignment="CENTER" spacing="30.0" GridPane.columnIndex="1" GridPane.rowIndex="1">
         <Button onAction="#onClickMoveGroceryLeftToRight" text="&gt;&gt;&gt;" />
         <Button onAction="#onClickMoveGroceryRightToLeft" text="&lt;&lt;&lt;" />
      </VBox>
   </children>
</GridPane>
```

**🇰🇷 한글 해설**

FXML과 Java를 잇는 세 가지:

- `fx:controller="...GroceryController"`: 이 화면의 컨트롤러 클래스
- `fx:id="groceryLV"`: 컨트롤러의 `@FXML private ListView<String> groceryLV;` 필드와 **이름이 같아야** 연결
- `onAction="#onClickMoveGroceryLeftToRight"`: 버튼 클릭 시 부를 컨트롤러 메서드 (`#` 붙임)

GridPane 3열: 왼쪽 리스트, 가운데 버튼 VBox, 오른쪽 리스트. `&gt;`는 XML에서 `>` 문자예요.

### 💻 Example: GroceryController

```java
public class GroceryController {
    @FXML private ListView<String> checkedLV;
    @FXML private ListView<String> groceryLV;

    private ObservableList<String> grocery_list =
        FXCollections.observableArrayList("Apple", "Orange", "PineApple", "Cherry");
    private ObservableList<String> checked_list = FXCollections.observableArrayList();

    @FXML
    public void initialize() {
        groceryLV.setItems(grocery_list);
        checkedLV.setItems(checked_list);
    }

    @FXML
    void onClickMoveGroceryLeftToRight(ActionEvent event) {
        String temp = checkedLV.getSelectionModel().getSelectedItem();
        if (temp != null) {
            grocery_list.add(temp);
            checkedLV.getSelectionModel().clearSelection();
            checked_list.remove(temp);
        }
    }

    @FXML
    void onClickMoveGroceryRightToLeft(ActionEvent event) {
        String temp = groceryLV.getSelectionModel().getSelectedItem();
        if (temp != null) {
            checked_list.add(temp);
            groceryLV.getSelectionModel().clearSelection();
            grocery_list.remove(temp);
        }
    }
}
```

**🇰🇷 한글 해설**

- `@FXML`: FXML이 이 필드, 메서드를 볼 수 있게 해요(private이어도).
- `initialize()`: FXMLLoader가 `@FXML` 필드를 다 채운 **뒤에** 자동으로 불러요. 생성자에서는 `groceryLV`가 아직 null이라 여기서 `setItems`를 해요.
- `getSelectionModel().getSelectedItem()`: 선택 안 했으면 **null** → `if (temp != null)` 검사.
- `ObservableList`를 바꾸면(`add`, `remove`) ListView가 **자동 갱신**돼요. 그래서 원본 코드의 `setItems` 재호출은 사실 필요 없어요(여기서는 뺐어요).

버그 찾기: `>>>` 버튼은 왼쪽 → 오른쪽으로 옮겨야 자연스러운데 `onClickMoveGroceryLeftToRight`는 실제로 **오른쪽(checked) → 왼쪽(grocery)**으로 옮겨요. 메서드 이름과 동작이 뒤바뀌어 있어요. 두 메서드 이름을 서로 바꾸거나 FXML의 `onAction`을 바꿔 연결하면 고쳐져요.


---

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
