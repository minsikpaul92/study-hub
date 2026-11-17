# Week 5. MVC 분리: Model, View, Controller

> **읽는 법**: 📑 표시는 교수님 슬라이드의 핵심 문장(영어 원문 그대로 짧게 발췌)이고, 바로 아래 **🇰🇷 한글 해설**이 이어져요. 💻 표시는 교수님 샘플 코드(`WK_5_Properties_Manual_DI`)예요. ⌨️ 표시가 있는 코드는 IntelliJ에서 직접 쳐 보세요.
>
> **Quiz 4 범위(Week 5~6 + Workshop 3)**였던 주차예요. Quiz 4 연습문제 Q1, Q2, Q3, Q11, Q12가 전부 이 주에서 나왔어요. 샘플 코드의 properties, Repository, Guice는 Week 6~8로 바로 이어져요.

## 0. 이번 주 한눈에 보기

| 개념 | 한 줄 정리 | 시험에 나오는 모양 |
| --- | --- | --- |
| Model | 비즈니스 로직과 데이터. UI를 모름. **먼저 만들고 테스트** | `ItemList.add/remove` |
| View | 모델을 **보여줌**. `update()`로 새로고침, 컴포넌트 getter 제공 | 생성자 끝에서 `update()` 호출 이유 |
| Controller | 입력을 받아 **모델 변경 → view.update()** | 모든 핸들러의 두 가지 일 |
| MVC 장점 3개 | decouple, complexity 감소, flexibility/maintainability 증가 | performance는 **아님** |
| 선택 없음 | `getSelectedIndex()` = **-1**, `getSelectedItem()` = **null** | `if (index >= 0)` |
| KeyReleased | 글자가 들어간 **뒤**에 발생 | KeyPressed는 한 글자 늦음 |
| `trim()` | 앞뒤 공백 제거 | 공백만 입력 방지 |
| JavaFX property | `StringProperty name` + `getName`, `setName`, `nameProperty` | `bindBidirectional` |
| Manual DI → Guice | `AppContext`에서 직접 new → `AbstractModule` + `setControllerFactory` | Week 6~7로 연결 |

**함정 모음**

- 핸들러 안에서 모델만 바꾸고 `view.update()`를 빼먹으면 **화면이 안 바뀐다**.
- 반대로 view의 ListView에 직접 `getItems().add(...)`를 하면 모델과 화면이 **어긋난다**. 항상 모델을 바꾸고 update.
- 모델 배열 크기(100) 그대로 `setItems` 하면 빈 줄 100개. `getSize()`만큼 **정확한 배열**을 만들어야 한다.
- `setItems`로 목록을 다시 채우면 **선택이 풀린다**. 선택 index를 기억했다가 `select(index)`.
- Controller 핸들러 메서드는 **private**: 바깥 클래스가 부를 일이 없으니까.
- `getSource()` 대신 View의 getter(`view.getAddButton()`)로 컴포넌트에 접근하는 구조.

{{PRACTICE}}

{{TOC}}

@@SLIDE week-05-1-mvc-separation.md
@@S _doc | read
Week 1에서 개념만 봤던 MVC를 이번엔 **진짜 GUI 코드로** 셋으로 나눠요. 이 세그먼트는 왜 나누는지만 짧게 말해요.
@@K Re-visiting MVC
Week 4에서는 Model과 UI 두 개로 나눴죠. 이번엔 **UI를 또 둘로** 나눠요.

- **View**: 보여주기 담당 (눈)
- **Controller**: 입력 받아서 모델 바꾸기 담당 (손)
- **Model**: 데이터와 규칙 (두뇌)

식당으로 비유하면 View는 메뉴판과 테이블, Controller는 주문 받는 직원, Model은 주방이에요.
@@K Motivation
한 바퀴 흐름: 사용자가 **View**를 봄 → **Controller**와 상호작용(버튼 클릭) → **Model** 변경 → 바뀐 내용이 **View**에 반영. Week 4 이벤트 흐름 5단계와 같은 이야기예요.
@@K The need
지금까지는 Application 클래스 하나에 화면, 이벤트, 데이터가 다 섞여 있었어요. 셋을 나누면 하나만 **갈아 끼우기**가 쉬워져요(예: 화면만 FXML로 바꾸기, 모델만 DB로 바꾸기).

**장점 3개를 정확히 외우세요**(Quiz 4 Q1): (1) model과 view를 **decouple**, (2) 전체 설계의 **complexity 감소**, (3) **flexibility와 maintainability** 증가. "실행 속도 향상"은 장점에 **없어요**. 오답 보기로 잘 나와요.

@@SLIDE week-05-2-model.md
@@S _doc | read
장보기 목록 앱의 **모델** `ItemList`를 만들고 **UI 없이 먼저 테스트**해요.
@@S add and remove | type
할 일: ItemList에 add, remove를 쓰고 Test the model 코드로 "너무 많이 지우기, 너무 많이 넣기"를 확인
@@K What is the model?
모델 찾는 질문: "화면 **밑에** 무엇이 있나? 우리가 보여주고 바꾸는 게 무엇인가?" 장보기 앱이면 **품목 목록**이에요. 그래서 모델 이름이 `ItemList`.

그리고 UI가 필요로 하는 동작(추가, 삭제)을 **public 메서드**로 열어 둬요. ATM 화면이 아무리 예뻐도 Bank 모델이 동작하지 않으면 의미가 없죠.
@@K ItemList
`MAXIMUM_SIZE` 크기 배열 + 실제 개수 `size`. 배열 칸은 100개지만 의미 있는 건 앞의 `size`개뿐이에요. (Week 3라면 `ArrayList`를 쓰겠지만, 여기서는 배열로 원리를 보여줘요.)
@@K add and remove
- `add`: `items[size++] = item;` 현재 `size` 칸에 넣고 **그다음** size를 1 늘려요(후위 증가). 꽉 차면 무시.
- `remove(index)`: 유효한 index인지 검사 → 뒤의 원소를 **한 칸씩 앞으로** 당김 → `size--`.

둘 다 **경계 검사**를 모델 안에서 해요. 그래서 컨트롤러가 이상한 값을 넘겨도 모델이 망가지지 않아요.
@@K Test the model
UI 붙이기 **전에** 모델만 테스트하는 습관. 세 가지 경계 상황을 꼭 시험해요: 정상 추가/삭제, **너무 많이 지우기**(빈 목록에서 remove → 아무 일 없음), **너무 많이 넣기**(200개 넣어도 100개에서 멈춤). 이게 나중에 배우는 단위 테스트의 기초예요.

@@SLIDE week-05-3-view.md
@@S _doc | read
모델을 화면에 보여 주는 **View** 클래스예요. `update()` 메서드와 **getter**가 핵심이에요.
@@S GroceryListView | type
할 일: GroceryListView를 쳐서 ItemList에 3개를 넣고 띄웠을 때 정확히 3줄만 보이는지 확인
@@K Views as Panes
View를 `Pane`의 자식 클래스로 만들어요(Week 4 AddressPane과 같은 방식). 그러면 `new Scene(view, ...)`처럼 바로 창에 넣을 수 있어요. 앱에는 View가 여러 개 있을 수 있어요.
@@K update()
`update()` = "모델을 다시 읽어서 화면을 새로 그려". View는 모델을 읽어야 하니까 **생성자로 모델을 받아** 필드에 저장해요.

이 "생성자로 필요한 걸 받기"가 바로 **생성자 주입(DI)**이에요. Week 6~7의 그 DI가 여기서 처음 등장해요.
@@K Instance variables and getters
두 가지 변경:

1. 컴포넌트를 생성자 **지역 변수 → 필드**로. 그래야 `update()`와 getter에서 쓸 수 있어요.
2. 컨트롤러가 버튼에 핸들러를 달아야 하니까 **getter**(`getAddButton()` 등) 제공.

그리고 **생성자 마지막 줄에 `update()`**: 처음 뜰 때부터 모델의 실제 상태를 보여주려고요. Quiz 4 Q11 정답 그대로예요 ("refresh right away").
@@K GroceryListView
구조를 한 번 더: 필드(모델 + 컴포넌트 4개) → getter 4개 → 생성자(모델 저장, 컴포넌트 생성과 배치, `getChildren().addAll`, `update()`) → `update()`.

View에는 `setOnAction`이 **하나도 없어요.** 이벤트 연결은 Controller의 일이에요.
@@K Why exactList?
모델 배열은 항상 100칸이에요. 그대로 `setItems`하면 3개만 넣었어도 ListView에 null 97줄이 생겨요. 그래서 `model.getSize()` 크기의 새 배열에 복사해서 넘겨요.

@@SLIDE week-05-4-controller.md
@@S _doc | read
모델과 뷰를 잇는 **Controller**예요. "모든 핸들러는 모델을 바꾸고 뷰를 update한다"가 이 주의 제일 중요한 문장이에요.
@@S Add Items | type
할 일: GroceryListApp에 Add 핸들러를 달고, 빈칸이나 공백만 넣으면 추가되지 않는지 확인
@@S Removing Items | type
할 일: Remove 핸들러를 달고, 아무것도 선택 안 하고 Remove를 눌러도 에러가 없는지 확인
@@S Extras: Disabling the Add button | type
할 일: setOnKeyReleased로 입력할 때마다 update()를 불러 Add 버튼이 켜지고 꺼지는지 확인 (KeyPressed로 바꿔서 차이도 보기)
@@K The controller
이 예제에서는 **Application 클래스가 Controller** 역할을 해요. `start()`에서 모델과 뷰를 만들고(`new GroceryListView(model)`로 모델을 넘김) 이벤트를 연결해요.

FXML 방식(Week 4, 6)에서는 별도의 Controller 클래스가 이 역할을 해요. 이름은 달라도 하는 일은 같아요.
@@K Add Items
**모든 이벤트 핸들러가 하는 두 가지 일**(Quiz 4 Q12): (1) **Change the Model**, (2) **Update the View**.

세부 포인트:

- `trim()`: `"   "`를 빈 문자열로. `length() > 0` 검사로 빈 항목 방지.
- `setText("")`: 추가 후 입력칸 비우기(Extras).
- 핸들러 메서드는 `private`, 실제 등록은 `view.getAddButton().setOnAction(...)`. 익명 클래스 안에서는 `handleAddButtonPress()` 한 줄만 불러요. 람다로는 `view.getAddButton().setOnAction(e -> handleAddButtonPress());`
@@K Removing Items
`getSelectedIndex()`는 아무것도 선택 안 했으면 **-1**(Quiz 4 Q3). 그대로 `model.remove(-1)`을 해도 모델이 검사하니 괜찮지만, 컨트롤러에서 **`if (index >= 0)`**로 먼저 걸러요. 불필요한 update도 막고요.

`getSelectedItem()`(값)은 선택이 없으면 **null**이에요. index는 -1, item은 null. 둘을 구분하세요.
@@K Extras: Disabling the remove button
UX 개선: 선택이 없으면 Remove 버튼을 **비활성화**해서 "지금은 못 눌러"를 눈으로 알려줘요.

- 판단 코드는 **View의 update()**에 넣어요(화면 모양 문제니까).
- 리스트를 클릭할 때마다 update를 부르도록 `setOnMousePressed` 연결.
- 문제: update가 `setItems`로 목록을 새로 채우면 **선택이 풀려요.** 그래서 선택 index를 저장 → setItems → `select(index)`로 복원.
@@K Extras: Disabling the Add button
입력칸이 비어 있으면 Add 비활성화. 타이핑할 때마다 update를 불러야 해요.

**왜 KeyReleased인가**(Quiz 4 Q2): KeyPressed는 키를 누르는 순간, 글자가 TextField에 **들어가기 전**에 발생해요. 그래서 "a"를 처음 쳤을 때 text는 아직 `""`이라 버튼이 안 켜져요(한 글자 늦음). KeyReleased는 글자가 **들어간 뒤**라 정확해요.

한계: 마우스로 붙여넣기 하면 키 이벤트가 없어서 안 불려요. 그래서 실무에서는 Week 10의 `textProperty().addListener(...)`를 써요.

@@IN week-05-student-manager.md
@@S _doc | read
교수님 Week 5 샘플은 강의(ItemList)보다 한 걸음 앞서 있어요: **JavaFX property**, **Repository 인터페이스**, **수동 DI**, 그리고 **Guice**까지. Week 6 Segment 5, Week 7 Guice를 미리 보는 코드예요.
@@S Example: Student model with properties | type
할 일: Student를 property 3개(name, grade, enrolled)로 만들고, 각각 get, set, xxxProperty 세 메서드를 직접 써 보기
@@K Project Structure
폴더가 곧 계층이에요: models(데이터), repositories(데이터 보관), services(규칙: 로그인 인증), controllers(화면 동작), utility(객체 연결). Week 3 Service Layer + Week 5 MVC + Repository가 다 합쳐진 모양이에요.
@@K Example: Student model with properties
JavaFX **bean 규칙**: 필드 하나마다 메서드 3개.

- `getName()`: `name.get()`
- `setName(String)`: `name.set(...)`
- `nameProperty()`: property 객체 **자체**를 반환 (binding, listener용)

boolean은 getter가 `isEnrolled()`. Quiz 4 Q20이 이 패턴을 쓰라는 문제였어요. 일반 `String name` 대신 `StringProperty`를 쓰는 이유: 값이 바뀌면 **알림**을 보낼 수 있어서 화면과 자동으로 동기화돼요.
@@K Example: Repository interface and in-memory implementation
Repository = 데이터를 **어디에** 저장하는지 숨기는 층. 인터페이스 `IStudentRepository`에 "목록 주기, 추가, 삭제"만 정하고, 지금은 메모리(`ObservableList`)로 구현. 나중에 Week 8처럼 DB 구현으로 바꿔도 컨트롤러는 그대로예요.

`getAllStudents()`가 `ObservableList`를 돌려주니까 ListView에 `setItems`로 연결하면, 추가/삭제가 **자동으로** 화면에 반영돼요. 강의의 `update()`가 필요 없어지는 이유예요.
@@K Example: AppContext (manual DI version)
**Manual DI**: 객체를 한곳(AppContext)에서 직접 만들어 static으로 보관하고, 컨트롤러 생성자에 넘겨요. `fxmlLoader.setController(loginController)`: FXMLLoader에게 "컨트롤러는 내가 만든 이 객체를 써"라고 알려줘요.

주의: `setController`를 쓸 때는 FXML에 `fx:controller`가 **없어야** 해요. 둘 다 있으면 "Controller value already specified" 에러가 나요. 실제 샘플을 보면 `student-editor.fxml`에는 `fx:controller`가 없고(그래서 `setController`), `login-view.fxml`과 `student-manager.fxml`에는 있어요(그래서 `setControllerFactory`). `setControllerFactory`는 `fx:controller`에 적힌 클래스를 **어떻게 만들지**만 바꾸는 거라 같이 써도 돼요.
@@K Example: AppContext (Guice version)
같은 AppContext를 Guice 모듈로 바꾼 버전이에요(Week 7에서 자세히).

- `bind(인터페이스).to(구현).in(Scopes.SINGLETON)`: 이 인터페이스를 달라면 이 구현을, 앱 전체에 **하나만**.
- `init()`: `start()`보다 **먼저** 불리는 Application 메서드. 여기서 Injector를 만들어요.
- `setControllerFactory(injector::getInstance)`: FXMLLoader가 컨트롤러를 만들 때 Guice에게 부탁 → `@Inject` 생성자에 Repository를 넣어 줘요.
@@K Example: MainController (double click to edit)
- `@Inject` 생성자로 Repository를 받아요(Guice가 넣어 줌).
- `event.getClickCount() == 2`: **더블클릭** 감지.
- 편집 창은 `new Stage()` + `showAndWait()`: 창이 닫힐 때까지 다음 줄로 안 넘어가요(Week 7 Multiple Views).
- 편집 컨트롤러는 Student를 생성자로 받아야 해서 Guice 대신 `new StudentEditController(student)` + `setController`. 이렇게 **실행 중에 정해지는 값**은 직접 넘기는 게 자연스러워요.

원본 코드는 ListCell의 `updateItem` 안에서 property listener를 매번 새로 붙이고, grade listener는 `setText(newValue.toString())`로 **점수만** 표시해요. 이름과 등록 여부가 사라지는 버그예요. 셋 다 `setText(student.toString())`이어야 하고, listener를 매번 붙이면 계속 쌓이니 실무에서는 다른 방법(`refresh()` 또는 extractor)을 써요.
@@K Example: StudentEditController (bindBidirectional)
`bindBidirectional`: 두 property를 **양방향**으로 묶어요. TextField를 고치면 `student.name`이 바뀌고, 모델을 바꾸면 TextField도 바뀌어요. 저장 버튼이 필요 없어요.

- Spinner는 `valueProperty()`가 `ObjectProperty<Double>`, Student는 `DoubleProperty`라서 타입이 달라 bindBidirectional 대신 **listener**로 한쪽만 연결했어요.
- 창 닫기: `nameField.getScene().getWindow()`로 지금 창(Stage)을 얻어 `close()`. 컨트롤러에 Stage 필드가 없을 때 쓰는 단골 패턴이에요.

Workshop 3 함정(Quiz 4 Q17)과 연결: 이렇게 묶인 객체를 그대로 저장하면, 폼을 고칠 때 저장된 것도 같이 바뀌어요. 그래서 복사본(`new Customer(customer)`)을 저장했죠.

@@TEXT
## 🧩 이번 주 토이 프로젝트: CafeOrder Week 5

Week 4 화면을 MVC로 쪼개요. `Order`(모델: 품목 목록, 합계 계산), `OrderView extends Pane`(컴포넌트 + getter + `update()`), `CafeOrderApp`(컨트롤러: 핸들러에서 모델 변경 후 `view.update()`). 장바구니가 비면 Checkout 버튼 비활성화, 메뉴를 선택 안 하면 Add 비활성화까지. (토이 가이드는 준비 중이에요.)

## ✅ 시험 대비 체크리스트 (Week 5)

- [ ] Model, View, Controller 각각의 책임을 한 문장으로 말할 수 있다.
- [ ] MVC 장점 3개(decouple, complexity 감소, flexibility/maintainability)를 안다. performance는 아니다.
- [ ] 모델을 UI 없이 먼저 테스트하는 이유와 경계 상황(너무 많이 넣기, 지우기)을 안다.
- [ ] View가 모델을 생성자로 받고, 컴포넌트를 필드 + getter로 두는 이유를 안다.
- [ ] View 생성자 끝에서 `update()`를 부르는 이유를 안다.
- [ ] 모든 핸들러의 두 가지 일(모델 변경, view.update)을 안다.
- [ ] `getSelectedIndex()`가 -1, `getSelectedItem()`이 null인 경우를 처리할 수 있다.
- [ ] KeyReleased와 KeyPressed의 차이를 설명할 수 있다.
- [ ] JavaFX property의 get, set, xxxProperty 세 메서드를 쓸 수 있다.
- [ ] `bindBidirectional`로 TextField와 model property를 묶을 수 있다.
- [ ] Manual DI(AppContext + setController)와 Guice(setControllerFactory)의 차이를 안다.

## ✍️ 손으로 써 보기

1. 모델 `Counter`(필드 `count`, `increment()`, `reset()`, `getCount()`)와 View `CounterView extends Pane`(Label, `+1` 버튼, Reset 버튼, getter, `update()`), 그리고 컨트롤러 `start()`를 MVC 규칙대로 쓰세요.

<details><summary>1번 예시 답</summary>

```java
class Counter {
    private int count;
    public void increment() { count++; }
    public void reset() { count = 0; }
    public int getCount() { return count; }
}

class CounterView extends Pane {
    private final Counter model;
    private final Label label = new Label();
    private final Button plus = new Button("+1");
    private final Button reset = new Button("Reset");

    public Button getPlus() { return plus; }
    public Button getReset() { return reset; }

    public CounterView(Counter m) {
        model = m;
        label.relocate(10, 10);
        plus.relocate(10, 40);
        reset.relocate(60, 40);
        getChildren().addAll(label, plus, reset);
        update();
    }

    public void update() {
        label.setText("Count: " + model.getCount());
        reset.setDisable(model.getCount() == 0);
    }
}

// controller
public void start(Stage stage) {
    Counter model = new Counter();
    CounterView view = new CounterView(model);
    view.getPlus().setOnAction(e -> { model.increment(); view.update(); });
    view.getReset().setOnAction(e -> { model.reset(); view.update(); });
    stage.setScene(new Scene(view, 200, 90));
    stage.show();
}
```

</details>

2. 아래 핸들러의 문제 두 가지는?

```java
view.getRemoveButton().setOnAction(e -> {
    int i = view.getList().getSelectionModel().getSelectedIndex();
    view.getList().getItems().remove(i);
});
```

<details><summary>2번 정답</summary>

(1) 모델을 바꾸지 않고 View의 리스트를 직접 고쳐서 모델과 화면이 어긋나요. `model.remove(i); view.update();`여야 해요. (2) 선택이 없으면 `i`가 -1이라 `remove(-1)`에서 예외가 나요. `if (i >= 0)` 검사가 필요해요.

</details>

3. `Book` 모델에 `title`을 JavaFX property 규칙대로 쓰고, `titleField`(TextField)와 양방향으로 묶는 한 줄을 쓰세요.

<details><summary>3번 예시 답</summary>

```java
private final StringProperty title = new SimpleStringProperty();
public String getTitle() { return title.get(); }
public void setTitle(String t) { title.set(t); }
public StringProperty titleProperty() { return title; }

titleField.textProperty().bindBidirectional(book.titleProperty());
```

</details>
