# Week 7. 여러 화면(Multiple Views)과 IoC

> **읽는 법**: 📑 표시는 교수님 슬라이드의 핵심 문장(영어 원문 그대로 짧게 발췌)이고, 바로 아래 **🇰🇷 한글 해설**이 이어져요. 💻 표시는 교수님 샘플 코드(`WK_7_Player_With_DI`, `WK_7_Login_MySql`)예요. ⌨️ 표시가 있는 코드는 IntelliJ JavaFX 프로젝트에서 직접 쳐 보세요.
>
> **Quiz 5 (11월 20일) 범위: Week 7 + Week 8.** 이 주차는 Week 6 Segment 5(DI, Repository, Service)를 바탕으로 해서, 맨 아래에 그 복습도 붙였어요.

## 0. 이번 주 한눈에 보기

| 개념 | 한 줄 정리 | 퀴즈에 나오는 모양 |
| --- | --- | --- |
| Stage vs Scene | Stage = 창, Scene = 창 안에 보이는 화면 하나 | "화면 전환은 `stage.setScene(otherScene)`" |
| 화면 전환 | Scene을 여러 개 만들어 두고 **이벤트**에서 `setScene` | 버튼 핸들러 안에 무엇을 쓰나 |
| 같은 레이아웃, 내용만 교체 | BorderPane 틀은 그대로, `setCenter(...)`로 가운데만 교체 | 메뉴 있는 앱의 방식 |
| 새 창 띄우기 | `new Stage()` + `setScene` + `show()` / `showAndWait()` | 모달 대화상자: `initOwner`, `initModality` |
| 마우스, 키 이벤트 | `MouseButton.PRIMARY/SECONDARY`, `KeyCode.UP/DOWN` | 키 이벤트는 **scene**에 등록 |
| IoC | 객체 생성과 흐름 제어를 **프레임워크가** 가져감. "Don't call us, we'll call you." | IoC 정의, 장점 4개 |
| IoC 기법 | DI, Service Locator, Event/Callback, Template Method | "IoC ≠ DI, DI는 IoC의 한 기법" |
| Guice | `AbstractModule.configure()`에서 `bind(인터페이스).to(구현).in(Singleton)`, 생성자에 `@Inject` | `setControllerFactory(injector::getInstance)` |

**함정 모음**

- **IoC와 DI는 같은 말이 아니다.** DI는 IoC를 구현하는 가장 흔한 방법 중 하나.
- Service Locator도 IoC다. 다만 의존성을 **숨겨서** 요즘은 덜 쓴다.
- `bind(A).to(B)`의 방향: **인터페이스 → 구현 클래스**. 반대로 쓰면 틀린 답.
- FXMLLoader는 기본적으로 **인자 없는 생성자**로 컨트롤러를 만든다. 생성자 주입을 하려면 `setControllerFactory(injector::getInstance)`가 필요하다.
- `showAndWait()`는 창이 닫힐 때까지 **다음 줄로 안 넘어간다**. `show()`는 바로 넘어간다.
- 키 이벤트(`setOnKeyPressed`)는 포커스를 받는 **scene**에 다는 게 안전하다. Pane에 달면 포커스가 없어서 안 될 수 있다.


**⌨️ IntelliJ에서 직접 쳐 볼 것 (이 순서대로)**

어디 칸을 누르면 그 코드로 바로 가요. 코드 위에도 ⌨️ 표시가 있어요.

| # | 어디 | 무엇을 |
| --- | --- | --- |
| 1 | [Example: two Scenes, one Stage](#practice-1) | MultiScene을 쳐서 두 버튼으로 Scene이 왔다 갔다 하는지 확인 |
| 2 | [One layout for each view](#practice-2) | TwoLayoutsOneStage를 쳐서 "password"를 넣었을 때만 환영 화면으로 바뀌는지 확인 |
| 3 | [View with same layout › ControlCircleWithMouseAndKey](#practice-3) | CirclePane과 ControlCircleWithMouseAndKey를 쳐서 버튼, 마우스 좌/우 클릭, 위/아래 키로 원 크기 바꾸기 |
| 4 | [Example: AppModule (Guice bindings)](#practice-4) | AppModule을 쳐서 bind와 @Provides 두 방식 익히기 |
| 5 | [Example: HelloApplication (Injector + controller factory)](#practice-5) | HelloApplication의 start, initializeRootLayout, showPlayerOverviewLayout을 쳐서 화면 두 개를 끼워 넣기 |
| 6 | [Example: PlayerOverviewController (@Inject constructor)](#practice-6) | @Inject 생성자와 initialize()를 쳐서 TableView에 선수 목록 띄우기 |

나머지 👀 표시는 읽고 이해만 하면 돼요. 같은 개념을 위 예제에서 이미 타이핑해요.



## 목차

- 1. 📑 강의 슬라이드: Week 7 · Segment 1. Working with Multiple Views
- 2. 📑 강의 슬라이드: Week 7 · Segment 2. Inversion of Control (IoC)
- 3. 💻 교수님 샘플 코드: Week 7 샘플 코드: WK_7_Player_With_DI (Guice + FXML + 여러 화면)
- 4. 💻 교수님 샘플 코드: Week 7 샘플 코드: WK_7_Login_MySql (JavaFX + JDBC + MySQL)
- 🔁 Week 6 Segment 5 복습: DI, Repository, Service (Week 7의 바탕)
- 🧩 이번 주 토이 프로젝트: CafeOrder Week 7
- ✅ Quiz 5 대비 체크리스트 (Week 7)
- ✍️ 손으로 써 보기


---

## 1. 📑 강의 슬라이드: Week 7 · Segment 1. Working with Multiple Views

<div class="sum" data-kind="read">

**🧭 먼저 한국어로** · 👀 읽고 이해하기 (타이핑 안 해도 돼요)

지금까지는 창 하나에 화면 하나였죠. 이번엔 **화면이 여러 개인 앱**을 만들어요. 방법은 두 가지예요: (1) Scene을 여러 개 만들어 갈아 끼우기, (2) 틀(BorderPane)은 그대로 두고 가운데 내용만 바꾸기.

**이 챕터 구성**

- 👀 **Outcomes**: 목표 세 가지: JavaFX에서 화면 여러 개 만들기, 화면 사이 이동하기, 화면끼리 데이터 주고받기.
- 👀 **Introduction**: 핵심 문장: "views are created as Scene-objects and the transitioning between them happens with events".
- ⌨️ **[Example: two Scenes, one Stage](#practice-1)**:  (⌨️ MultiScene을 쳐서 두 버튼으로 Scene이 왔다 갔다 하는지 확인)
- ⌨️ **[One layout for each view](#practice-2)**:  (⌨️ TwoLayoutsOneStage를 쳐서 "password"를 넣었을 때만 환영 화면으로 바뀌는지 확인)
- 👀 **View with same layout**: 메뉴가 있는 앱은 보통 틀은 고정하고 내용 부분만 바꿔요.
- ⌨️ **[View with same layout › ControlCircleWithMouseAndKey](#practice-3)**:  (⌨️ CirclePane과 ControlCircleWithMouseAndKey를 쳐서 버튼, 마우스 좌/우 클릭, 위/아래 키로 원 크기 바꾸기)

</div>

> 원문 출처: APD545 Week 7 · Segment 1 "Working with Multiple Views" 강의 슬라이드 (Mahboob Ali, Seneca) 핵심 문장 발췌. 코드는 슬라이드 예제를 정리

### 📑 Outcomes

> - Creating multiple views in JavaFX
> - How to work with Multiple views
> - Communicating with multiple views

**🇰🇷 한글 해설**

목표 세 가지: JavaFX에서 화면 여러 개 **만들기**, 화면 사이 **이동하기**, 화면끼리 **데이터 주고받기**. 세 번째(통신)는 샘플 코드 `WK_7_Player_With_DI`에서 Overview 화면과 Edit 대화상자가 같은 Repository를 공유하는 방식으로 나와요.

### 📑 Introduction

> - Generally, the views are created as Scene-objects and the transitioning between them happens with events bound to the application.
> - The example below has two Scene objects which both have their own content and an event related to the content.
> - Instead of having an object for laying out components (such as BorderPane) in the example Scene objects, both objects have just one user interface component.

**🇰🇷 한글 해설**

핵심 문장: "views are created as **Scene-objects** and the transitioning between them happens with **events**". 즉,

- 화면 하나 = `Scene` 객체 하나
- 화면 전환 = 버튼 같은 이벤트 핸들러 안에서 `stage.setScene(다른Scene)`

JavaFX 구조를 다시 떠올리면 **Stage(창) ⊃ Scene(화면) ⊃ Node(버튼, 레이아웃...)** 예요. 연극으로 치면 Stage는 무대, Scene은 장면이에요. 무대는 하나인데 장면을 바꿔 끼우는 거예요.

이 예제에서는 레이아웃(BorderPane 등) 없이 Scene에 버튼 하나만 바로 넣었어요. `new Scene(sc1)`처럼 Scene의 루트에는 Parent 종류(Button도 Parent의 하위 클래스)면 다 들어가요.

### 📑 Example: two Scenes, one Stage


<p class="typeit" id="practice-1">⌨️ <b>이 코드는 IntelliJ에서 직접 쳐 보세요</b>: MultiScene을 쳐서 두 버튼으로 Scene이 왔다 갔다 하는지 확인</p>

```java
import javafx.application.Application;
import javafx.scene.Scene;
import javafx.scene.control.Button;
import javafx.stage.Stage;

public class MultiScene extends Application {
    @Override
    public void start(Stage ps) {
        Button sc1 = new Button("Scene 1 ..");
        Button sc2 = new Button("Scene 2.");
        Scene first = new Scene(sc1);
        Scene second = new Scene(sc2);

        sc1.setOnAction((event) -> {
            ps.setScene(second);
        });
        sc2.setOnAction((event) -> {
            ps.setScene(first);
        });

        ps.setScene(first);
        ps.show();
    }

    public static void main(String[] args) { launch(args); }
}
```

**🇰🇷 한글 해설**

흐름을 따라가 보세요.

1. 버튼 두 개, Scene 두 개를 **미리 다 만들어** 둬요.
2. `sc1` 버튼을 누르면 `ps.setScene(second)`, `sc2`를 누르면 `ps.setScene(first)`.
3. 처음엔 `first`를 보여주고 `ps.show()`.

포인트: 람다 안에서 `ps`, `first`, `second`를 쓸 수 있는 건 이 변수들이 **effectively final**(한 번 정하고 안 바뀜)이라서예요. 람다 안에서 쓰는 지역 변수를 나중에 다시 대입하면 컴파일 에러가 나요.

`(event) -> { ps.setScene(second); }`는 `EventHandler<ActionEvent>`를 람다로 짧게 쓴 거예요. 괄호와 중괄호를 줄이면 `e -> ps.setScene(second)`.

### 📑 One layout for each view

> - In the first view user is asked to input a password.
> - If the user types a wrong password, the application informs the user about the mistake.
> - If the user types the correct password, the application switches to the next view.
> - The concrete switching event has been bound to the login button.


<p class="typeit" id="practice-2">⌨️ <b>이 코드는 IntelliJ에서 직접 쳐 보세요</b>: TwoLayoutsOneStage를 쳐서 &quot;password&quot;를 넣었을 때만 환영 화면으로 바뀌는지 확인</p>

```java
public class TwoLayoutsOneStage extends Application {
    @Override
    public void start(Stage window) throws Exception {
        // 1. Creating the view for asking a password
        Label instructionText = new Label("Write the password and press Log in");
        PasswordField passwordField = new PasswordField();
        Button startButton = new Button("Log in");
        Label errorMessage = new Label("");

        // Layout 1
        GridPane layout = new GridPane();
        layout.add(instructionText, 0, 0);
        layout.add(passwordField, 0, 1);
        layout.add(startButton, 0, 2);
        layout.add(errorMessage, 0, 3);
        layout.setPrefSize(300, 180);
        layout.setAlignment(Pos.CENTER);
        layout.setVgap(10);
        layout.setHgap(10);
        layout.setPadding(new Insets(20, 20, 20, 20));
        Scene passwordView = new Scene(layout);

        // Layout 2
        Label welcomeText = new Label("Welcome, this is the beginning!");
        StackPane welcomeLayout = new StackPane();
        welcomeLayout.setPrefSize(300, 180);
        welcomeLayout.getChildren().add(welcomeText);
        welcomeLayout.setAlignment(Pos.CENTER);
        Scene welcomeView = new Scene(welcomeLayout);

        startButton.setOnAction((event) -> {
            if (!passwordField.getText().trim().equals("password")) {
                errorMessage.setText("Unknown password!");
                return;
            }
            window.setScene(welcomeView);
        });

        window.setScene(passwordView);
        window.show();
    }

    public static void main(String[] args) { launch(args); }
}
```

**🇰🇷 한글 해설**

로그인 화면 → 환영 화면 예제예요. 화면마다 **다른 레이아웃**(GridPane, StackPane)을 써요.

- `PasswordField`: 입력이 `●●●`로 보이는 TextField. 값은 똑같이 `getText()`.
- `layout.add(node, col, row)`: GridPane은 **column이 먼저**. 여기서는 전부 column 0, row 0~3이라 세로로 쌓여요.
- `new Insets(20, 20, 20, 20)`: top, right, bottom, left 순서.
- 비밀번호 검사: `passwordField.getText().trim().equals("password")`. 틀리면 에러 라벨을 바꾸고 **`return`으로 핸들러를 끝내서** 화면 전환 줄까지 안 가게 해요. 이 `return` 패턴이 Week 8 회원가입 검사에서도 똑같이 나와요.
- 문자열 비교는 `==`가 아니라 **`.equals()`**. 퀴즈 단골 함정이에요.

참고: 원래 슬라이드는 매개변수 이름이 `ps`인데 본문에서 `window.setScene(...)`을 써서 그대로는 컴파일이 안 돼요. 여기서는 매개변수 이름을 `window`로 맞춰 놨어요. 시험 코드에서 이런 이름 불일치를 찾으라고 할 수도 있어요.

### 📑 View with same layout

> - Sometimes one wants an application to have a permanent view whose parts are swapped when needed.
> - Typically applications that have some kind of menus function in this manner.
> - When pressing the buttons on the main menu the content of the content area changes.

```java
class CirclePane extends StackPane {
    private Circle circle = new Circle(50);

    public CirclePane() {
        getChildren().add(circle);
        circle.setStroke(Color.BLACK);
        circle.setFill(Color.WHITE);
    }
    public void enlarge() {
        circle.setRadius(circle.getRadius() + 2);
    }
    public void shrink() {
        circle.setRadius(circle.getRadius() > 2 ? circle.getRadius() - 2 : circle.getRadius());
    }
}
```

**🇰🇷 한글 해설**

메뉴가 있는 앱은 보통 **틀은 고정**하고 내용 부분만 바꿔요. 예: 위쪽 메뉴바, 아래쪽 버튼 줄은 그대로, 가운데만 교체.

`CirclePane`은 `StackPane`을 **상속**해서 원 하나를 가진 나만의 컴포넌트예요. `enlarge()`는 반지름 +2, `shrink()`는 반지름이 2보다 클 때만 -2(삼항 연산자 `조건 ? A : B`). 원이 0 이하로 줄어 사라지는 걸 막는 거예요.

이렇게 **기능을 가진 Pane을 클래스로 따로 만들면**, 바깥 앱은 `circlePane.enlarge()`만 부르면 돼요. 원을 어떻게 키우는지는 몰라도 돼요. 작은 MVC예요.

#### 📑 ControlCircleWithMouseAndKey


<p class="typeit" id="practice-3">⌨️ <b>이 코드는 IntelliJ에서 직접 쳐 보세요</b>: CirclePane과 ControlCircleWithMouseAndKey를 쳐서 버튼, 마우스 좌/우 클릭, 위/아래 키로 원 크기 바꾸기</p>

```java
public class ControlCircleWithMouseAndKey extends Application {
    private CirclePane circlePane = new CirclePane();

    @Override
    public void start(Stage primaryStage) {
        HBox hBox = new HBox();
        hBox.setSpacing(10);
        hBox.setAlignment(Pos.CENTER);
        Button btEnlarge = new Button("Enlarge");
        Button btShrink = new Button("Shrink");
        hBox.getChildren().add(btEnlarge);
        hBox.getChildren().add(btShrink);

        btEnlarge.setOnAction(e -> circlePane.enlarge());
        btShrink.setOnAction(e -> circlePane.shrink());

        BorderPane borderPane = new BorderPane();
        borderPane.setCenter(circlePane);
        borderPane.setBottom(hBox);
        BorderPane.setAlignment(hBox, Pos.CENTER);

        Scene scene = new Scene(borderPane, 200, 150);
        primaryStage.setTitle("ControlCircle");
        primaryStage.setScene(scene);
        primaryStage.show();

        circlePane.setOnMouseClicked(e -> {
            if (e.getButton() == MouseButton.PRIMARY) {
                circlePane.enlarge();
            } else if (e.getButton() == MouseButton.SECONDARY) {
                circlePane.shrink();
            }
        });

        scene.setOnKeyPressed(e -> {
            if (e.getCode() == KeyCode.UP) { circlePane.enlarge(); }
            else if (e.getCode() == KeyCode.DOWN) { circlePane.shrink(); }
        });
    }

    public static void main(String[] args) { launch(args); }
}
```

**🇰🇷 한글 해설**

같은 동작(키우기/줄이기)을 **세 가지 입력**으로 연결한 예제예요.

| 입력 | 어디에 등록 | 코드 |
| --- | --- | --- |
| 버튼 | 각 Button | `btEnlarge.setOnAction(e -> circlePane.enlarge())` |
| 마우스 | circlePane | `setOnMouseClicked`, `e.getButton() == MouseButton.PRIMARY`(왼쪽) / `SECONDARY`(오른쪽) |
| 키보드 | **scene** | `scene.setOnKeyPressed`, `e.getCode() == KeyCode.UP` / `DOWN` |

- `BorderPane`: `setCenter(circlePane)`, `setBottom(hBox)`. 가운데 원, 아래 버튼 줄. `BorderPane.setAlignment(hBox, Pos.CENTER)`는 **static 메서드**로 특정 자식의 정렬을 정해요.
- 키 이벤트를 scene에 다는 이유: 키 입력은 **포커스를 가진 노드**로 가요. Pane은 보통 포커스를 안 받으니 scene 단위로 받는 게 확실해요.
- `primaryStage.show()` 다음에 이벤트를 등록해도 괜찮아요. 이벤트는 나중에 사용자가 누를 때 실행되니까요.


---

## 2. 📑 강의 슬라이드: Week 7 · Segment 2. Inversion of Control (IoC)

<div class="sum" data-kind="read">

**🧭 먼저 한국어로** · 👀 읽고 이해하기 (타이핑 안 해도 돼요)

**Inversion of Control(제어의 역전)**. 짧은 세그먼트지만 Quiz 5 객관식에 정의, 장점, 기법 이름이 그대로 나오기 좋아요. Week 6의 DI와 어떻게 다른지(IoC가 더 큰 개념)를 확실히 구분하세요.

**이 챕터 구성**

- 👀 **Outcomes**: 목표 세 개를 동사로 기억하세요: IoC를 설명하고(explain), 프레임워크에서 IoC를 알아보고(spot: DI, callback, 디자인 패턴), 코드에서 쓴다(use: Guice로 수동 연결 대신).
- 👀 **Inversion of Control (IoC)**: 정의: 원래는 내 코드가 직접 객체를 만들고(`new`) 실행 순서를 정했는데, 그 제어권을 프레임워크나 컨테이너에게 넘기는 것이에요.
- 👀 **What is it?**: 객체 생성과 연결(wiring) 책임이 내 코드 → 프레임워크/컨테이너로 이동.
- 👀 **Why it matters?**: 장점 네 개는 영어 단어 그대로 외우세요. 객관식 보기에 그대로 나와요.
- 👀 **In Action**: 수동 연결(`new`)과 Guice 주입(`@Inject`)을 나란히 비교해요. 아래 샘플 코드에서 실제로 쳐 봐요.
- 👀 **IoC Techniques**: IoC를 구현하는 방법 네 가지. "다음 중 IoC 기법이 아닌 것은?" 문제를 대비해 이름과 한 줄 설명을 짝지으세요.
- 👀 **Example from the class**: Controller는 필요한 것(Stage, Repository)을 생성자에 선언만 한다.
- 👀 **What IoC is not?**: IoC ≠ DI. IoC는 큰 원칙(제어를 넘긴다), DI는 그걸 구현하는 가장 흔한 기법이에요.
- 👀 **Analogy: Restaurant Ordering**: IoC 없이: 주방에 들어가서 재료 모으고 직접 요리.

</div>

> 원문 출처: APD545 Week 7 · Segment 2 "Inversion of Control" 강의 슬라이드 (Mahboob Ali, Seneca) 핵심 문장 발췌

### 📑 Outcomes

> - I can explain IoC: define Inversion of Control and describe how it changes responsibility in a program.
> - I can spot IoC in frameworks: recognize examples of IoC in Dependency Injection, callbacks, and design patterns.
> - I can use IoC in code: apply IoC by writing code that uses a DI framework (like Guice) instead of manual wiring.

**🇰🇷 한글 해설**

목표 세 개를 동사로 기억하세요: IoC를 **설명**하고(explain), 프레임워크에서 IoC를 **알아보고**(spot: DI, callback, 디자인 패턴), 코드에서 **쓴다**(use: Guice로 수동 연결 대신).

### 📑 Inversion of Control (IoC)

> Inversion of Control (IoC) is a design principle in software engineering where the control over program flow or object creation is inverted: instead of the application code directly managing dependencies and execution, a framework or container takes responsibility for providing objects and orchestrating the flow.
>
> Key idea: **"Don't call us, we'll call you."**

**🇰🇷 한글 해설**

**정의**: 원래는 내 코드가 직접 객체를 만들고(`new`) 실행 순서를 정했는데, 그 **제어권을 프레임워크나 컨테이너에게 넘기는 것**이에요. 그래서 "역전(inversion)".

**"Don't call us, we'll call you."** (할리우드 원칙): 오디션 본 배우에게 "우리한테 전화하지 마세요, 필요하면 우리가 전화할게요". 내 코드가 프레임워크를 부르는 게 아니라, **프레임워크가 내 코드를 불러요**.

이미 매일 쓰고 있어요. JavaFX에서 `start(Stage)`를 우리가 직접 부른 적 없죠? `launch()`하면 **JavaFX가** 알아서 `start`를 불러요. 버튼 핸들러도 우리가 부르지 않고 JavaFX가 클릭될 때 불러요. 이것도 IoC예요.

### 📑 What is it?

> - Shifts responsibility of object creation & wiring from your code → to a framework/container
> - Your code focuses on business logic, not dependency management

**🇰🇷 한글 해설**

두 줄 요약:

- 객체 **생성과 연결(wiring)** 책임이 내 코드 → 프레임워크/컨테이너로 이동.
- 그래서 내 코드는 **비즈니스 로직**에만 집중하고, 의존성 관리는 신경 안 써요.

"wiring"은 "A 객체에 B 객체를 넣어 주는 것", 예를 들어 Controller에 Repository를 넣는 것이에요.

### 📑 Why it matters?

> - **Decoupling**: Classes don't depend on concrete implementations
> - **Flexibility**: Swap implementations easily (e.g., mock vs real repository)
> - **Testability**: Easier unit testing with injected dependencies
> - **Maintainability**: Centralized configuration, less scattered `new` statements

**🇰🇷 한글 해설**

장점 네 개는 영어 단어 그대로 외우세요. 객관식 보기에 그대로 나와요.

| 장점 | 뜻 | 예 |
| --- | --- | --- |
| **Decoupling** | 클래스가 구체 구현에 묶이지 않음 | Controller는 `IPlayerRepository`만 앎 |
| **Flexibility** | 구현을 쉽게 바꿈 | 메모리 저장 → DB 저장으로 교체 |
| **Testability** | 테스트가 쉬움 | 진짜 DB 대신 가짜(mock) 저장소 주입 |
| **Maintainability** | 설정이 한곳에 모임, `new`가 흩어지지 않음 | 바꿀 곳은 `AppModule` 한 군데 |

"실행 속도가 빨라진다"는 장점이 **아니에요**. 오답 보기로 잘 나와요.

### 📑 In Action

> Without IoC (manual wiring):

```java
SceneRepository repo = new InMemorySceneRepository();
MainController controller = new MainController(stage, repo);
```

> With IoC (using Guice): Framework injects dependencies automatically

```java
@Inject
public MainController(Stage stage, SceneRepository repo) { ... }
```

**🇰🇷 한글 해설**

**Without IoC**: 내가 직접 `new InMemorySceneRepository()`를 만들고 Controller 생성자에 넣어요. Controller를 쓰는 곳마다 이 `new`를 반복해야 하고, 저장소를 바꾸려면 그 모든 곳을 고쳐야 해요.

**With IoC (Guice)**: Controller 생성자에 `@Inject`만 붙이고 "나는 Stage와 SceneRepository가 필요해"라고 **선언만** 해요. 누가 어떤 구현을 넣을지는 Guice가 `AppModule`의 bind 설정을 보고 정해요.

```java
// AppModule
bind(SceneRepository.class).to(InMemorySceneRepository.class).in(Singleton.class);

// 앱 시작할 때
Injector injector = Guice.createInjector(new AppModule());
MainController c = injector.getInstance(MainController.class);  // 생성자 인자를 Guice가 채움
```

### 📑 IoC Techniques

> - **Dependency Injection (DI)**: Constructor, setter, or field injection. Most popular because it makes dependencies explicit and testable.
> - **Service Locator Pattern**: Instead of injecting, classes ask a central "locator" for dependencies. Still IoC, because the class doesn't decide how the dependency is built. Less favored today because it hides dependencies.
> - **Event-driven / Callback style**: Framework calls your code at the right time (e.g., JavaFX method, servlet lifecycle methods). You don't control the flow, the framework does. This inversion of control is about program flow, not just object creation.
> - **Template Method Pattern**: Framework defines the skeleton of an algorithm, and your subclass provides specific steps. Control of execution order is inverted to the framework.

**🇰🇷 한글 해설**

IoC를 구현하는 방법 네 가지. "다음 중 IoC 기법이 **아닌** 것은?" 문제를 대비해 이름과 한 줄 설명을 짝지으세요.

1. **Dependency Injection (DI)**: 생성자(constructor), setter, 필드(field) 주입. **가장 인기**. 의존성이 생성자에 **드러나서(explicit)** 테스트하기 좋아요.
2. **Service Locator**: 주입받는 대신 클래스가 중앙 "locator"에게 **직접 달라고 요청**해요. 그래도 어떻게 만드는지는 클래스가 정하지 않으니 IoC예요. 단점: 의존성이 **숨겨져서** 요즘은 덜 써요. (Week 5 샘플의 주석 처리된 `AppContext.getUserService()`가 이 모양이에요.)
3. **Event-driven / Callback**: 프레임워크가 **적절한 때에 내 코드를 불러요**. JavaFX `start()`, 버튼 핸들러, 서블릿 생명주기 메서드. 이건 객체 생성이 아니라 **프로그램 흐름**의 역전이에요.
4. **Template Method Pattern**: 프레임워크가 알고리즘의 **뼈대(순서)**를 정하고, 내 하위 클래스는 단계 몇 개만 채워요. `Application`을 상속해 `start()`만 구현하는 게 비슷한 예예요 (`init()` → `start()` → `stop()` 순서는 JavaFX가 정함).

### 📑 Example from the class

> - Controllers declare dependencies (Stage, SceneRepository)
> - Guice AppModule binds interfaces → implementations
> - FXMLLoader uses Guice to create controllers
> - Result: Controllers only handle scene logic, not wiring

**🇰🇷 한글 해설**

수업 예제의 IoC 흐름 네 줄:

1. Controller는 필요한 것(Stage, Repository)을 생성자에 **선언**만 한다.
2. Guice `AppModule`이 **인터페이스 → 구현**을 bind한다.
3. **FXMLLoader가 Guice를 써서** Controller를 만든다 (`setControllerFactory(injector::getInstance)`).
4. 결과: Controller는 화면 로직만 하고, 연결(wiring)은 안 한다.

3번이 왜 필요한지가 핵심이에요. FXML에 `fx:controller="...PlayerOverviewController"`라고 쓰면 FXMLLoader는 원래 **인자 없는 생성자**로 `new PlayerOverviewController()`를 하려고 해요. 그런데 우리 Controller 생성자는 `(Stage, PlayerRepository)`를 받죠. 그래서 "Controller는 네가 만들지 말고 Guice에게 받아"라고 알려 주는 게 `setControllerFactory`예요.

### 📑 What IoC is not?

> IoC is ≠ Dependency Injection. Rather DI is the most commonly used technique of IoC.

**🇰🇷 한글 해설**

**IoC ≠ DI.** IoC는 큰 원칙(제어를 넘긴다), DI는 그걸 구현하는 **가장 흔한 기법**이에요. 관계로 쓰면 DI ⊂ IoC. "모든 DI는 IoC지만, 모든 IoC가 DI는 아니다" (예: 이벤트 콜백은 IoC지만 DI는 아님).

### 📑 Analogy: Restaurant Ordering

> - Without IoC (manual control): You go into the kitchen, gather ingredients, cook the meal yourself. You control everything.
> - With IoC (inversion of control): You sit at a table, order from the menu. The chef and staff handle cooking, serving, cleanup. You focus only on enjoying the meal.

**🇰🇷 한글 해설**

- **IoC 없이**: 주방에 들어가서 재료 모으고 직접 요리. 모든 걸 내가 제어.
- **IoC로**: 테이블에 앉아 메뉴에서 주문. 요리, 서빙, 정리는 셰프와 직원이 함. 나는 **먹는 것(비즈니스 로직)**에만 집중.

Week 6 DI 슬라이드의 비유 "셰프가 채소를 직접 기르지 않고 납품받는다"와 짝으로 기억하세요. DI는 "재료(의존성)를 밖에서 받는다", IoC는 "흐름 전체를 남이 관리한다".


---

## 3. 💻 교수님 샘플 코드: Week 7 샘플 코드: WK_7_Player_With_DI (Guice + FXML + 여러 화면)

<div class="sum" data-kind="type">

**🧭 먼저 한국어로** · ⌨️ IntelliJ에서 직접 쳐 보기

수업 시간 메인 예제예요. **Guice로 컨트롤러를 만들고**, BorderPane 틀(RootLayout) 가운데에 PlayerOverview를 끼우고, Edit 화면은 **모달 대화상자(새 Stage)**로 띄워요. Week 7 두 세그먼트(여러 화면 + IoC)가 한 프로젝트에 다 들어 있어요.

**이 챕터 구성**

- 👀 **Project Structure**: 폴더 역할이 Week 6에서 배운 계층과 똑같아요: `controllers`(화면 로직), `models`(Player), `repositories`(데이터 접근), `utilities`(Guice 설정 AppModule).
- ⌨️ **[Example: AppModule (Guice bindings)](#practice-4)**:  (⌨️ AppModule을 쳐서 bind와 @Provides 두 방식 익히기)
- ⌨️ **Example: Repository interface and implementation**: Repository 패턴 그대로예요. 인터페이스(계약)에 `findAll`, `add`, `remove` 세 개, 구현 클래스는 메모리에 `ObservableList`로 저장해요.
- ⌨️ **Example: Player model with JavaFX properties**: 필드가 `String`이 아니라 `StringProperty`예요.
- ⌨️ **[Example: HelloApplication (Injector + controller factory)](#practice-5)**:  (⌨️ HelloApplication의 start, initializeRootLayout, showPlayerOverviewLayout을 쳐서 화면 두 개를 끼워 넣기)
- ⌨️ **[Example: PlayerOverviewController (@Inject constructor)](#practice-6)**:  (⌨️ @Inject 생성자와 initialize()를 쳐서 TableView에 선수 목록 띄우기)
- ⌨️ **Example: PlayerEditDialogController (Save / Cancel)**: `isClicked` 플래그: Save면 `true`, Cancel이면 `false`.
- ⌨️ **Example: module-info.java**: Java 모듈 설정이에요. 에러가 나면 대부분 여기 문제예요.

</div>

> 원문 출처: APD545 Week 7 교수님 샘플 코드 WK_7_Player_With_DI (Blackboard), 주요 파일 발췌. import 문은 생략

### 💻 Project Structure

```text
src/main/java/
  module-info.java
  ca/senecacollege/application/
    wk_7_player_with_di/  HelloApplication.java, Launcher.java
    controllers/          RootController, PlayerOverviewController, PlayerEditDialogController
    models/               Player.java, DateConverter.java
    repositories/         IPlayerRepository.java, PlayerRepository.java
    utilities/            AppModule.java
src/main/resources/.../wk_7_player_with_di/
    RootLayout.fxml (BorderPane + MenuBar), PlayerOverview.fxml (TableView), PlayerEditDialog.fxml
pom.xml: javafx-controls, javafx-fxml 21, com.google.inject:guice 7.0.0
```

**🇰🇷 한글 해설**

폴더 역할이 Week 6에서 배운 계층과 똑같아요: `controllers`(화면 로직), `models`(Player), `repositories`(데이터 접근), `utilities`(Guice 설정 AppModule). FXML이 세 개인데 화면 구성은 이래요.

- `RootLayout.fxml`: BorderPane, 위에 MenuBar. **틀**.
- `PlayerOverview.fxml`: TableView + 상세 라벨. 틀의 **가운데(center)**에 끼움.
- `PlayerEditDialog.fxml`: 입력 폼. **새 창(Stage)**으로 띄움.

슬라이드의 두 방식(같은 틀에서 내용 교체, 새 창 띄우기)이 둘 다 들어 있어요.

### 💻 Example: AppModule (Guice bindings)


<p class="typeit" id="practice-4">⌨️ <b>이 코드는 IntelliJ에서 직접 쳐 보세요</b>: AppModule을 쳐서 bind와 @Provides 두 방식 익히기</p>

```java
public class AppModule extends AbstractModule {
    private Stage primaryStage;

    public AppModule(Stage primaryStage) {
        this.primaryStage = primaryStage;
    }

    @Override
    protected void configure() {
        bind(IPlayerRepository.class).to(PlayerRepository.class).in(Singleton.class);
    }

    @Provides
    @Singleton
    public Stage providePrimaryStage() {
        return primaryStage;
    }
}
```

**🇰🇷 한글 해설**

Guice 설정 클래스예요. 두 가지 방법이 같이 나와요.

1. **`bind(...).to(...).in(...)`**: "누가 `IPlayerRepository`를 달라고 하면 `PlayerRepository`를 만들어 주고, 앱 전체에서 **하나만(Singleton)** 써라". 방향은 **인터페이스 → 구현**.
2. **`@Provides` 메서드**: `Stage`처럼 Guice가 직접 `new` 할 수 없는 객체(JavaFX가 만들어서 `start()`로 넘겨준 것)를 주는 방법. 생성자로 받은 `primaryStage`를 그대로 돌려줘요. `@Singleton`이라 항상 같은 Stage.

`in(Singleton.class)`와 `in(Scopes.SINGLETON)`은 같은 뜻이에요 (Week 5 샘플은 `Scopes.SINGLETON`).

### 💻 Example: Repository interface and implementation

```java
public interface IPlayerRepository {
    ObservableList<Player> findAll();
    void add(Player player);
    void remove(Player player);
}

public class PlayerRepository implements IPlayerRepository {
    private final ObservableList<Player> players = FXCollections.observableArrayList();

    public PlayerRepository() {
        players.add(new Player("John", "Michle", "Alpha"));
        players.add(new Player("Jack", "Adams", "Gamma"));
        players.add(new Player("Mike", "Tylor", "Beta"));
        // ... 4 more players
    }

    @Override public ObservableList<Player> findAll() { return players; }
    @Override public void add(Player player) { players.add(player); }
    @Override public void remove(Player player) { players.remove(player); }
}
```

**🇰🇷 한글 해설**

Repository 패턴 그대로예요. 인터페이스(계약)에 `findAll`, `add`, `remove` 세 개, 구현 클래스는 메모리에 `ObservableList`로 저장해요.

`ObservableList`를 쓰는 이유: `playerTable.setItems(list)`로 연결해 두면, 리스트에 add/remove만 해도 **TableView가 자동으로 갱신**돼요. 화면을 다시 그리는 코드를 따로 안 써도 돼요.

나중에 DB에 저장하고 싶으면 `JdbcPlayerRepository implements IPlayerRepository`를 만들고 `AppModule`의 bind 한 줄만 바꾸면 돼요. 이게 "Flexibility"예요. Week 8 JDBC와 이어지는 지점이에요.

### 💻 Example: Player model with JavaFX properties

```java
public class Player {
    private final StringProperty firstName;
    private final StringProperty lastName;
    private final StringProperty team;
    private final ObjectProperty<LocalDate> birthday;
    // street, postalCode, city ...

    public Player() { this("", "", ""); }

    public Player(String firstName, String lastName, String team) {
        this.firstName = new SimpleStringProperty(firstName);
        this.lastName = new SimpleStringProperty(lastName);
        this.team = new SimpleStringProperty(team);
        this.birthday = new SimpleObjectProperty<LocalDate>(LocalDate.of(2026, 2, 11));
    }

    public StringProperty getFirstNameProperty() { return firstName; }
    public String getFirstName() { return firstName.get(); }
    public void setFirstName(String fn) { firstName.set(fn); }
    // same pattern for lastName, team, birthday ...
}
```

**🇰🇷 한글 해설**

필드가 `String`이 아니라 `StringProperty`예요. 프로퍼티는 "값이 바뀌면 알려 주는 값"이라서, TableView 칸에 연결해 두면 값이 바뀔 때 화면도 바뀌어요.

메서드 세 개 세트: `getFirstNameProperty()`(프로퍼티 자체), `getFirstName()`(값), `setFirstName()`(값 바꾸기). 표준 이름은 `firstNameProperty()`인데 교수님 코드는 `getFirstNameProperty()`로 썼어요. 어느 쪽이든 아래 `setCellValueFactory` 람다에서 부르기만 하면 돼요.

`Player()` 기본 생성자는 `this("", "", "")`로 **다른 생성자를 호출**해요. 새 선수 추가할 때 빈 Player를 만드는 데 써요.

### 💻 Example: HelloApplication (Injector + controller factory)


<p class="typeit" id="practice-5">⌨️ <b>이 코드는 IntelliJ에서 직접 쳐 보세요</b>: HelloApplication의 start, initializeRootLayout, showPlayerOverviewLayout을 쳐서 화면 두 개를 끼워 넣기</p>

```java
public class HelloApplication extends Application {
    private Injector injector;
    private Stage primaryStage;
    private BorderPane rootLayout;

    @Override
    public void start(Stage primaryStage) throws IOException {
        this.primaryStage = primaryStage;
        this.primaryStage.setTitle("Team Player Application");
        // creating DI containers with the primaryStage
        injector = Guice.createInjector(new AppModule(primaryStage));
        initializeRootLayout();
        showPlayerOverviewLayout();
    }

    private void initializeRootLayout() {
        try {
            FXMLLoader loader = new FXMLLoader(HelloApplication.class.getResource("RootLayout.fxml"));
            // ask the GUICE to provide the constructor default or overloaded
            loader.setControllerFactory(injector::getInstance);
            rootLayout = loader.load();
            Scene scene = new Scene(rootLayout);
            primaryStage.setScene(scene);
            primaryStage.show();
        } catch (Exception e) { e.printStackTrace(); }
    }

    private void showPlayerOverviewLayout() {
        try {
            FXMLLoader fxmlLoader = new FXMLLoader(HelloApplication.class.getResource("PlayerOverview.fxml"));
            fxmlLoader.setControllerFactory(injector::getInstance);
            AnchorPane ap = fxmlLoader.load();
            PlayerOverviewController playerOverviewController = fxmlLoader.getController();
            playerOverviewController.setMainApp(this);
            rootLayout.setCenter(ap);
        } catch (Exception e) { e.printStackTrace(); }
    }

    // Dialog creation leveraging DI controller factory
    public boolean showPlayerAddEditDialog() throws IOException {
        FXMLLoader loader = new FXMLLoader(HelloApplication.class.getResource("PlayerEditDialog.fxml"));
        loader.setControllerFactory(injector::getInstance);
        AnchorPane content = loader.load();
        Stage dialog = new Stage();
        dialog.setTitle("Add / Edit Player Information");
        dialog.initOwner(primaryStage);
        dialog.initModality(Modality.WINDOW_MODAL);
        dialog.setScene(new Scene(content));
        PlayerEditDialogController controller = loader.getController();
        controller.setDialogStage(dialog);
        dialog.showAndWait();
        return controller.isSaveClicked();
    }
}
```

**🇰🇷 한글 해설**

앱 시작의 순서:

1. `Guice.createInjector(new AppModule(primaryStage))`: DI 컨테이너(Injector) 생성. Stage를 넘겨야 `@Provides`로 줄 수 있어요.
2. `initializeRootLayout()`: RootLayout.fxml 로드 → Scene → Stage에 붙이고 show.
3. `showPlayerOverviewLayout()`: PlayerOverview.fxml 로드 → `rootLayout.setCenter(ap)`. **틀은 그대로, 가운데만 끼우기**.

모든 FXMLLoader에 `setControllerFactory(injector::getInstance)`가 있어요. `injector::getInstance`는 메서드 참조로, `cls -> injector.getInstance(cls)`와 같아요. FXML이 요청한 컨트롤러 클래스를 Guice가 만들어 주고, 생성자의 `@Inject` 인자들도 채워 줘요.

`fxmlLoader.getController()`: 로드가 끝난 뒤 그 FXML의 컨트롤러 객체를 꺼내요. 여기서 `setMainApp(this)`로 앱을 넘겨서 컨트롤러가 나중에 대화상자를 열 수 있게 해요. **화면끼리 통신하는 방법**이에요.

`showPlayerAddEditDialog()`가 모달 대화상자의 정석이에요.

- `new Stage()`: 새 창
- `initOwner(primaryStage)`: 주인 창 지정
- `initModality(Modality.WINDOW_MODAL)`: 주인 창을 클릭 못 하게 막음
- `showAndWait()`: **창이 닫힐 때까지 기다렸다가** 다음 줄 실행
- `return controller.isSaveClicked()`: 닫힌 뒤 Save였는지 결과를 돌려줌

### 💻 Example: PlayerOverviewController (@Inject constructor)


<p class="typeit" id="practice-6">⌨️ <b>이 코드는 IntelliJ에서 직접 쳐 보세요</b>: @Inject 생성자와 initialize()를 쳐서 TableView에 선수 목록 띄우기</p>

```java
public class PlayerOverviewController {
    @FXML private TableView<Player> playerTable;
    @FXML private TableColumn<Player, String> firstNameColumn;
    @FXML private TableColumn<Player, String> lastNameColumn;
    @FXML private TableColumn<Player, String> teamColumn;
    @FXML private Label firstNameLabel;   // ... more labels

    private HelloApplication mainApp;
    private final Stage primaryStage;
    private final PlayerRepository _repository;

    @Inject
    public PlayerOverviewController(Stage primaryStage, PlayerRepository _repository) {
        this.primaryStage = primaryStage;
        this._repository = _repository;
    }

    @FXML
    private void initialize() {
        firstNameColumn.setCellValueFactory(cv -> cv.getValue().getFirstNameProperty());
        lastNameColumn.setCellValueFactory(cv -> cv.getValue().getLastNameProperty());
        teamColumn.setCellValueFactory(cv -> cv.getValue().getTeamProperty());
        playerTable.setItems(_repository.findAll());
        playerTable.getSelectionModel().selectedItemProperty()
                   .addListener((ob, cV, nV) -> showPlayerDetails(nV));
    }

    @FXML
    void handleDeletePlayer(ActionEvent event) {
        Player player = playerTable.getSelectionModel().getSelectedItem();
        if (player != null)
            _repository.remove(player);
        else {
            Alert al = new Alert(Alert.AlertType.WARNING);
            al.initOwner(primaryStage);
            al.setContentText("Please select a player from the table first");
            al.show();
        }
    }

    @FXML
    void handleNewPlayer(ActionEvent event) throws IOException {
        Player newPlayer = new Player();
        _repository.add(newPlayer);
        playerTable.getSelectionModel().select(newPlayer);
        boolean isClicked = mainApp.showPlayerAddEditDialog();
        if (!isClicked) {
            _repository.remove(newPlayer);   // rollback the changes
        }
    }

    public void setMainApp(HelloApplication helloApplication) { mainApp = helloApplication; }
}
```

**🇰🇷 한글 해설**

- `@Inject` 생성자: Guice가 `Stage`(@Provides에서)와 `PlayerRepository`를 넣어 줘요.
- `@FXML private void initialize()`: FXML 로드가 끝나고 `@FXML` 필드들이 다 채워진 **다음에** JavaFX가 자동으로 불러요. 생성자 안에서는 아직 `playerTable`이 null이라서 테이블 설정은 반드시 `initialize()`에서 해요. 퀴즈 단골이에요.
- `setCellValueFactory(cv -> cv.getValue().getFirstNameProperty())`: 각 행의 Player 객체(`cv.getValue()`)에서 어떤 프로퍼티를 이 칸에 보여줄지.
- `selectedItemProperty().addListener((ob, oldV, newV) -> showPlayerDetails(newV))`: 선택이 바뀔 때마다 오른쪽 상세 라벨 갱신.
- 삭제: 선택이 없으면 `getSelectedItem()`이 **null** → 경고 Alert.
- 새로 만들기: 빈 Player를 먼저 저장소에 넣고 대화상자를 열어, Cancel이면 **다시 빼서 되돌려요(rollback)**.

⚠️ 눈여겨볼 점: AppModule은 `IPlayerRepository`를 Singleton으로 bind했는데, 이 컨트롤러들은 인터페이스가 아니라 **구체 클래스 `PlayerRepository`**를 달라고 해요. Guice는 bind 안 된 구체 클래스를 그때그때 새로 만들어 주기 때문에(Singleton 아님), 두 컨트롤러가 **서로 다른 저장소**를 받을 수 있어요. 올바른 방법은 생성자 타입을 `IPlayerRepository`로 쓰는 것이에요. 이게 "구체 구현이 아니라 인터페이스에 의존하라(Decoupling)"는 말의 실제 예예요.

### 💻 Example: PlayerEditDialogController (Save / Cancel)

```java
public class PlayerEditDialogController {
    @FXML private TextField firstNameTextField;   // ... more fields
    private final PlayerRepository repository;
    private Stage stage;
    private boolean isClicked = false;

    @Inject
    public PlayerEditDialogController(PlayerRepository repository) {
        this.repository = repository;
    }

    @FXML
    void handleSave(ActionEvent event) {
        Player player = resolveActivePlayer();
        if (player != null) {
            player.setFirstName(firstNameTextField.getText());
            // ... other fields
            player.setBirthday(DateConverter.convertToLocalDate(birthdayTextField.getText()));
        }
        isClicked = true;
        stage.close();
    }

    @FXML
    void handleCancel(ActionEvent event) {
        isClicked = false;
        stage.close();
    }

    public void setDialogStage(Stage stage) { this.stage = stage; /* fill fields from last player */ }
    public boolean isSaveClicked() { return isClicked; }
}
```

**🇰🇷 한글 해설**

대화상자 컨트롤러의 정석 구조예요.

- `isClicked` 플래그: Save면 `true`, Cancel이면 `false`. 대화상자가 닫힌 뒤 부른 쪽이 `isSaveClicked()`로 확인해요.
- Save와 Cancel 둘 다 `stage.close()`로 창을 닫아요. 그래서 `setDialogStage(stage)`로 자기 창을 미리 받아 둬야 해요.
- Save일 때만 Player 값을 바꿔요. Cancel이면 모델은 그대로. (Week 6 "custom dialog에서 model이 middle-man" 내용과 같은 원리.)
- `DateConverter.convertToLocalDate("11.02.2026")`: 문자열 ↔ `LocalDate` 변환. 형식 `dd.MM.yyyy`.

### 💻 Example: module-info.java

```java
module ca.senecacollege.application.wk_7_player_with_di {
    requires javafx.controls;
    requires javafx.fxml;
    requires com.google.guice;

    opens ca.senecacollege.application.wk_7_player_with_di to javafx.fxml;
    exports ca.senecacollege.application.wk_7_player_with_di;
    exports ca.senecacollege.application.controllers;
    opens ca.senecacollege.application.controllers to javafx.fxml;
    exports ca.senecacollege.application.repositories to com.google.guice;
    exports ca.senecacollege.application.utilities to com.google.guice;
}
```

**🇰🇷 한글 해설**

Java 모듈 설정이에요. 에러가 나면 대부분 여기 문제예요.

- `requires`: 쓰는 라이브러리 (`javafx.controls`, `javafx.fxml`, `com.google.guice`).
- `opens ... to javafx.fxml`: FXMLLoader가 **리플렉션**으로 `@FXML private` 필드에 값을 넣으려면 패키지가 열려 있어야 해요.
- `exports ... to com.google.guice`: Guice가 repositories, utilities 클래스를 만들 수 있게 공개.

새 패키지를 만들었는데 "cannot access class" 에러가 나면 여기에 `exports`/`opens` 줄이 빠진 거예요.


---

## 4. 💻 교수님 샘플 코드: Week 7 샘플 코드: WK_7_Login_MySql (JavaFX + JDBC + MySQL)

<div class="sum" data-kind="read">

**🧭 먼저 한국어로** · 👀 읽고 이해하기 (타이핑 안 해도 돼요)

Week 8 JDBC를 **미리 보여 준** 샘플이에요. 로그인 창에서 Register 버튼으로 **두 번째 창**을 띄우고, MySQL에 회원을 저장/조회해요. Week 7(여러 창)과 Week 8(JDBC)이 만나는 지점이라 Quiz 5에 딱 맞아요. 코드에 일부러 찾아볼 만한 버그가 있어요.

**이 챕터 구성**

- ⌨️ **Example: DatabaseAccess (JDBC)**: Week 8 Segment 3~4에서 배우는 JDBC 순서가 그대로 있어요.
- ⌨️ **Example: LoginController (open a second window)**: `registerButtonEvent`: 새 창 띄우기 정석 4줄 (FXML 로드 → `new Stage()` → `setScene` → `show()`).
- ⌨️ **Example: RegistrationController**: 이름이 비어도 `return`이 없어서 빈 이름으로 저장돼요.
- ⌨️ **Example: module-info.java (requires java.sql)**: JDBC를 쓰려면 모듈 설정에 `requires java.sql;`이 꼭 있어야 해요.

</div>

> 원문 출처: APD545 Week 7 교수님 샘플 코드 WK_7_Login_MySql (Blackboard), 주요 파일 발췌. DB 비밀번호는 지움, import 문은 생략

### 💻 Example: DatabaseAccess (JDBC)

```java
public class DatabaseAccess {
    private static final String DB_URL = "jdbc:mysql://localhost:3306/";
    private static final String DB_NAME = "javafxregistration?useSSL=false";
    private static final String DB_USER = "root";
    private static final String DB_PASSWORD = "<your password>";
    private static final String INSERT_QRY =
        " insert into registration(full_name, email_id, password) values (?, ?, ?)";
    private static final String SELECT_QRY =
        " select * from registration where email_id = ? AND password = ?";

    public void insertRecord(String fn, String email, String pw) {
        try (Connection connection = DriverManager.getConnection(DB_URL + DB_NAME, DB_USER, DB_PASSWORD);
             PreparedStatement ps = connection.prepareStatement(INSERT_QRY)) {
            ps.setString(1, fn);
            ps.setString(2, email);
            ps.setString(3, pw);
            ps.executeUpdate();
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    public boolean validation(String email, String pw) {
        try (Connection connection = DriverManager.getConnection(DB_URL + DB_NAME, DB_USER, DB_PASSWORD);
             PreparedStatement ps = connection.prepareStatement(SELECT_QRY)) {
            ps.setString(1, email);
            ps.setString(2, pw);
            ResultSet rs = ps.executeQuery();
            while (rs.next()) { return true; }
        } catch (Exception e) {
            e.printStackTrace();
        }
        return false;
    }
}
```

**🇰🇷 한글 해설**

Week 8 Segment 3~4에서 배우는 JDBC 순서가 그대로 있어요.

1. `DriverManager.getConnection(url, user, pw)` → `Connection`
2. `connection.prepareStatement(SQL)` → `PreparedStatement` (`?` 자리표시자)
3. `ps.setString(1, ...)` → `?`를 **1번부터** 채움
4. 쓰기는 `executeUpdate()`(바뀐 행 수 int), 읽기는 `executeQuery()`(ResultSet)
5. `try ( ... )` **try-with-resources**: 괄호 안 자원(Connection, PreparedStatement)이 끝나면 자동으로 close.

`validation`의 `while (rs.next()) { return true; }`: 결과 행이 **하나라도 있으면** true. `if (rs.next())`와 같은 뜻이에요.

⚠️ 실행 전 확인: 이 프로젝트 `pom.xml`에는 MySQL 드라이버(`mysql-connector-j`) 의존성이 없어요. 그대로 실행하면 `No suitable driver found` SQLException이 나요. 드라이버 jar를 추가해야 해요 (Week 8 Segment 4 Step 2 "Download the MySQL JDBC Connector").

### 💻 Example: LoginController (open a second window)

```java
public class LoginController {
    @FXML private TextField emailIdTextFiled;
    @FXML private Button loginButton;
    @FXML private TextField passwordTextField;
    @FXML private Button registerButton;

    private DatabaseAccess db = new DatabaseAccess();

    @FXML
    void loginButtonEvent(ActionEvent event) {
        Window window = loginButton.getScene().getWindow();
        if (emailIdTextFiled.getText().isEmpty()) {
            Alert alert = new Alert(Alert.AlertType.ERROR);
            alert.setContentText("Please enter email");
            alert.initOwner(window);
            alert.showAndWait();
        }
        boolean flag = db.validation(emailIdTextFiled.getText(), passwordTextField.getText());
        if (flag) {
            Alert alert = new Alert(Alert.AlertType.ERROR);
            alert.setContentText("Login Successful");
            alert.initOwner(window);
            alert.showAndWait();
        } else {
            Alert alert = new Alert(Alert.AlertType.ERROR);
            alert.setContentText("Either username or password is incorrect");
            alert.initOwner(window);
            alert.showAndWait();
        }
    }

    @FXML
    void registerButtonEvent(ActionEvent event) throws IOException {
        FXMLLoader loader = new FXMLLoader(LoginSignupApplication.class.getResource("register.fxml"));
        Parent root = loader.load();
        Stage stage = new Stage();
        Scene scene = new Scene(root);
        stage.setScene(scene);
        stage.setTitle("Register Account");
        stage.show();
    }
}
```

**🇰🇷 한글 해설**

`registerButtonEvent`: **새 창 띄우기** 정석 4줄 (FXML 로드 → `new Stage()` → `setScene` → `show()`). 슬라이드처럼 같은 창의 Scene을 바꾸는 게 아니라 **창을 하나 더** 띄워요.

`loginButton.getScene().getWindow()`: 버튼이 들어 있는 창을 얻어서 Alert의 주인(`initOwner`)으로 써요. 그러면 Alert가 그 창 가운데에 떠요.

⚠️ 버그 찾기 (퀴즈에 코드 읽기로 나오기 좋아요):

- 이메일이 비었을 때 Alert만 띄우고 **`return`이 없어서** 아래 DB 검사까지 그대로 실행돼요. Week 8 슬라이드 코드처럼 `return;`을 넣어야 해요.
- 로그인 성공인데 `AlertType.ERROR`를 써요. `INFORMATION`이 맞아요.

### 💻 Example: RegistrationController

```java
public class RegistrationController {
    @FXML private TextField emailTextField;
    @FXML private TextField fullnameTextField;
    @FXML private PasswordField passwordField;
    @FXML private Button submitBtn;

    private DatabaseAccess db = new DatabaseAccess();

    @FXML
    void cancelButtonEvent(ActionEvent event) {
        Platform.exit();
    }

    @FXML
    void submitButtonEvent(ActionEvent event) {
        Window owner = submitBtn.getScene().getWindow();
        if (fullnameTextField.getText().trim().isEmpty()) {
            Alert alert = new Alert(Alert.AlertType.ERROR);
            alert.setContentText("Please enter user name");
            alert.initOwner(owner);
            alert.showAndWait();
        }
        db.insertRecord(emailTextField.getText(),
                        fullnameTextField.getText(),
                        passwordField.getText());
    }
}
```

**🇰🇷 한글 해설**

⚠️ 여기도 버그가 두 개 있어요.

1. 이름이 비어도 `return`이 없어서 **빈 이름으로 저장**돼요.
2. `insertRecord(String fn, String email, String pw)`인데 호출은 `insertRecord(email, fullname, password)` 순서예요. 그래서 DB의 `full_name` 칸에 **이메일이**, `email_id` 칸에 **이름이** 들어가요. 컴파일러는 둘 다 String이라 못 잡아요. PreparedStatement의 `?` 순서와 인자 순서를 항상 맞춰 보세요.

`Platform.exit()`: JavaFX 앱 전체를 종료해요.

### 💻 Example: module-info.java (requires java.sql)

```java
module ca.senecacollege.application.wk_7_login_mysql {
    requires javafx.controls;
    requires javafx.fxml;
    requires java.sql;

    opens ca.senecacollege.application.wk_7_login_mysql to javafx.fxml;
    exports ca.senecacollege.application.wk_7_login_mysql;
    exports ca.senecacollege.application.controllers;
    opens ca.senecacollege.application.controllers to javafx.fxml;
}
```

**🇰🇷 한글 해설**

JDBC를 쓰려면 모듈 설정에 **`requires java.sql;`**이 꼭 있어야 해요. 없으면 `Connection`, `DriverManager`를 import할 때부터 컴파일 에러예요. 퀴즈에 "JDBC를 쓰기 위해 module-info에 추가할 줄은?"으로 나올 수 있어요.


---

## 🔁 Week 6 Segment 5 복습: DI, Repository, Service (Week 7의 바탕)

> 📑 **Dependency Injection (DI)** is a design pattern where objects receive their dependencies from an external source rather than creating them internally. Promotes loose coupling between classes. Makes code easier to test and maintain.
>
> 📑 **Repository Pattern** separates the logic that retrieves data from the business logic that uses the data, acting as a mediator between the domain and data mapping layers. Allows swapping between memory, database, or API without changing business code.
>
> 📑 **Service Design Pattern** introduces a dedicated layer that encapsulates business logic and workflows, separating them from both the UI (controllers) and data access (repositories). Current: Controller → Repository → Data. Improved: **Controller → Service → Repository → Data**.

**🇰🇷 한글 해설**

- **DI**: 필요한 객체를 안에서 `new` 하지 않고 **밖에서 받기**. 비유: 셰프가 채소를 직접 기르지 않고 납품받음. 장점: 느슨한 결합(loose coupling), 테스트 쉬움.
- **Repository**: 데이터를 어디서 가져오는지(메모리, DB, API)를 숨기는 중간 관리자. 비유: 도서관 책장을 직접 뒤지지 않고 **카탈로그**에 물어봄.
- **DI + Repository**: Controller는 DI로 Repository를 받고, Repository가 메모리든 DB든 Controller는 상관없음.
- **Service**: 비즈니스 규칙, 검증, 작업 흐름을 모은 층. Controller는 UI 이벤트만 처리.
- 세 개 관계: DI는 "어떻게 받나", Repository는 "데이터 접근 분리", Service는 "비즈니스 로직 분리". 그리고 **IoC**는 이 모든 연결을 프레임워크(Guice)에 맡기는 더 큰 원칙.

## 🧩 이번 주 토이 프로젝트: CafeOrder Week 7

Week 6까지 만든 CafeOrder에 **Guice**를 넣어요. `MenuRepository` 인터페이스와 `InMemoryMenuRepository`, `OrderService`를 `AppModule`에서 bind하고, 컨트롤러 생성자에 `@Inject`, FXMLLoader에 `setControllerFactory(injector::getInstance)`. 메뉴 화면과 영수증 화면을 **두 Scene**으로 나눠 전환해요. (Week 7 토이 가이드는 준비 중이에요. Quiz 5 대비 노트와 퀴즈를 먼저 올렸어요.)

## ✅ Quiz 5 대비 체크리스트 (Week 7)

- [ ] Stage, Scene, Node 관계를 설명하고 `setScene`으로 화면을 바꿀 수 있다.
- [ ] 같은 틀에서 내용만 바꾸기(`borderPane.setCenter`)와 새 창 띄우기(`new Stage()`)를 구분한다.
- [ ] `show()`와 `showAndWait()`의 차이, `initOwner`, `initModality(Modality.WINDOW_MODAL)`를 안다.
- [ ] `MouseButton.PRIMARY/SECONDARY`, `KeyCode.UP/DOWN`, 키 이벤트를 scene에 다는 이유를 안다.
- [ ] IoC 정의와 "Don't call us, we'll call you"를 말할 수 있다.
- [ ] IoC 장점 4개(Decoupling, Flexibility, Testability, Maintainability)를 안다.
- [ ] IoC 기법 4개(DI, Service Locator, Event/Callback, Template Method)와 각 한 줄 설명을 안다.
- [ ] "IoC ≠ DI, DI는 IoC의 가장 흔한 기법"을 설명할 수 있다.
- [ ] Guice: `AbstractModule`, `configure()`, `bind(I).to(Impl).in(Singleton.class)`, `@Inject`, `@Provides`, `Guice.createInjector`, `setControllerFactory(injector::getInstance)`.
- [ ] `initialize()`가 생성자보다 늦게, `@FXML` 필드가 채워진 뒤에 불린다는 것을 안다.

## ✍️ 손으로 써 보기

1. 버튼 하나(`Next`)가 있는 Scene A와, 라벨 `"Page B"`와 버튼 `Back`이 있는 Scene B를 만들어 서로 오가는 `start` 메서드를 써 보세요.

<details><summary>1번 예시 답</summary>

```java
@Override
public void start(Stage stage) {
    Button next = new Button("Next");
    Scene a = new Scene(new StackPane(next), 250, 120);

    Button back = new Button("Back");
    VBox boxB = new VBox(10, new Label("Page B"), back);
    boxB.setAlignment(Pos.CENTER);
    Scene b = new Scene(boxB, 250, 120);

    next.setOnAction(e -> stage.setScene(b));
    back.setOnAction(e -> stage.setScene(a));

    stage.setScene(a);
    stage.show();
}
```

</details>

2. `IGreetingService`와 구현 `KoreanGreetingService`가 있어요. Guice로 `GreetingController`에 생성자 주입되도록 `AppModule`과 컨트롤러 생성자를 써 보세요. 서비스는 앱 전체에서 하나만 쓰게 하세요.

<details><summary>2번 예시 답</summary>

```java
public class AppModule extends AbstractModule {
    @Override
    protected void configure() {
        bind(IGreetingService.class).to(KoreanGreetingService.class).in(Scopes.SINGLETON);
    }
}

public class GreetingController {
    private final IGreetingService service;

    @Inject
    public GreetingController(IGreetingService service) {
        this.service = service;
    }
}

// 사용
Injector injector = Guice.createInjector(new AppModule());
FXMLLoader loader = new FXMLLoader(getClass().getResource("greeting-view.fxml"));
loader.setControllerFactory(injector::getInstance);
```

</details>

3. 아래 코드의 문제점 두 가지를 찾으세요.

```java
@FXML
void onLogin(ActionEvent e) {
    if (userField.getText() == "") {
        errorLabel.setText("Enter a user name");
    }
    stage.setScene(homeScene);
}
```

<details><summary>3번 정답</summary>

(1) 문자열을 `==`로 비교해요. `userField.getText().isEmpty()` 또는 `.equals("")`를 써야 해요. (2) 에러 메시지를 보여준 뒤 `return;`이 없어서 이름이 비어도 홈 화면으로 넘어가요.

</details>
