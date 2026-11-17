# Week 6. 레이아웃, 메뉴, 대화상자, DI와 Repository

> **읽는 법**: 📑 표시는 교수님 슬라이드의 핵심 문장(영어 원문 그대로 짧게 발췌)이고, 바로 아래 **🇰🇷 한글 해설**이 이어져요. ⌨️ 표시가 있는 코드는 IntelliJ JavaFX 프로젝트에서 직접 쳐 보세요.
>
> **Quiz 4 범위(Week 5~6 + Workshop 3)** 주차예요. 연습문제 Q4~Q10, Q13~Q16, Q18~Q19가 여기서 나왔어요. Segment 5(DI, Repository, Service)는 Week 7 Guice와 Week 8 JDBC의 바탕이에요.

## 0. 이번 주 한눈에 보기

| 개념 | 한 줄 정리 | 시험에 나오는 모양 |
| --- | --- | --- |
| FlowPane | 가로로 늘어놓다가 자리가 없으면 **다음 줄로 wrap** | wrap 되는 레이아웃은? |
| HBox / VBox | 한 줄(가로/세로), **wrap 없음**. 넘치면 안 보임 | `setSpacing` |
| BorderPane | top, bottom, left, right, center **5곳에 하나씩** | 한 칸에 여러 개면 Pane으로 묶기 |
| GridPane | `add(node, col, row)` **column 먼저**, span 가능 | `add(b, 2, 0)` 위치 |
| Insets | `new Insets(top, right, bottom, left)` | bottom 값은? |
| 메뉴 | MenuBar ⊃ Menu ⊃ MenuItem. Radio는 **ToggleGroup** 필요 | CheckMenuItem은 cast 후 `isSelected()` |
| ContextMenu | 어디에도 add 안 함, `show(node, x, y)` | `MouseButton.SECONDARY` |
| Alert | INFORMATION, WARNING, ERROR, CONFIRMATION | X로 닫으면 **CANCEL** |
| `showAndWait()` | `Optional<T>` 반환. `isPresent()`, `get()` | Cancel이면 empty |
| FileChooser | `showOpenDialog`/`showSaveDialog` → File, 취소면 **null** | `if (f != null)` |
| Custom Dialog | 모델이 middle-man. OK면 모델 갱신, Cancel이면 그대로 | `setResultConverter` |
| DI | 의존 객체를 **밖에서 받기** (loose coupling) | 정의, 셰프 비유 |
| Repository | 데이터 접근을 숨기는 중간자 (메모리↔DB 교체) | 도서관 카탈로그 비유 |
| Service | 비즈니스 규칙 층. Controller → Service → Repository → Data | 흐름 쓰기 |

**함정 모음**

- `gridPane.add(button, 2, 0)`은 **column 2, row 0**. 행이 먼저가 아니다.
- `Insets(20, 10, 30, 40)`의 bottom은 **30** (시계 방향: 위, 오른쪽, 아래, 왼쪽).
- RadioMenuItem을 ToggleGroup에 안 넣으면 **여러 개가 동시에** 선택된다.
- ContextMenu를 Pane이나 MenuBar에 add하려 하면 틀린 답. 마우스 핸들러에서 `show()`.
- `alert.showAndWait().get()`은 결과가 비어 있을 수 있는 다른 Dialog에서는 위험. `isPresent()` 먼저.
- `setResultConverter`에서 Cancel일 때 **null을 반환**해야 `isPresent()`가 false가 된다.
- `bind(A).to(B)`는 **인터페이스 → 구현** 방향.

{{PRACTICE}}

{{TOC}}

@@SLIDE week-06-1-layouts.md
@@S _doc | read
Week 4~5에서는 `relocate(x, y)`로 픽셀을 일일이 계산했죠. 이번엔 창 크기가 바뀌어도 **알아서 배치되는 레이아웃 Pane** 다섯 가지를 배워요.
@@S FlowPane | type
할 일: 버튼 6개를 FlowPane에 넣고 창 너비를 줄여서 다음 줄로 wrap 되는지 확인 (HBox로 바꿔서 차이도 보기)
@@S BorderPane | type
할 일: center에 TextArea, bottom에 버튼 FlowPane, right에 VBox 버튼을 넣고 창 크기를 바꿔 보기
@@S More Complicated GridPane | type
할 일: TextField, Add, ListView, Remove를 2x2 GridPane으로 배치하고 창을 키우면 ListView만 커지는지 확인
@@K Why layout panes?
레이아웃 Pane의 장점 3개: (1) 위치, 크기 **계산 안 해도 됨**, (2) 창 크기가 바뀌면 **자동으로** 다시 배치, (3) 어떤 OS에서도 깔끔. 그냥 `Pane`은 레이아웃이 없는(절대 좌표) 컨테이너예요.
@@K FlowPane
**글 쓰듯이** 왼쪽 → 오른쪽, 자리가 없으면 **다음 줄**(wrap). 창이 좁아지면 줄 수가 늘어요. Quiz 4 Q4 정답이 FlowPane이었어요.

간격 세 가지: `setHgap`(옆 간격), `setVgap`(줄 간격), `setPadding`(바깥 여백).

**Insets 순서: top, right, bottom, left** (시계 방향). `new Insets(25)`는 네 방향 모두 25. Quiz 4 Q5 함정이에요.
@@K HBox / VBox
HBox는 가로 한 줄, VBox는 세로 한 줄. FlowPane과 달리 **wrap이 없어서** 넘치는 컴포넌트는 그냥 잘려요. 간격은 `setSpacing(5)` 하나(FlowPane의 hgap/vgap과 이름이 달라요). `new VBox(10, a, b, c)`처럼 생성자에 간격과 자식을 한 번에 넣을 수도 있어요.
@@K BorderPane
동서남북 + 가운데 **5칸**. 창이 커지면 **center가 남는 공간을 다 차지**하고, top/bottom은 가로로, left/right는 세로로 늘어요.

한 칸에는 **하나만**. 버튼 여러 개를 bottom에 두려면 FlowPane(또는 HBox)으로 묶어서 그 Pane 하나를 `setBottom`. Week 7 "같은 틀, 가운데만 교체"(`setCenter`)도 이 Pane이에요.

`BorderPane.setMargin(node, insets)`: 특정 칸의 바깥 여백. 슬라이드는 `aPane.setMargin(...)`으로 썼는데 static 메서드라 클래스 이름으로 부르는 게 정석이에요.
@@K Simple GridPane
바둑판. **`add(컴포넌트, col, row)` column이 먼저**(Quiz 4 Q6). 행, 열 개수는 add한 값들 보고 자동으로 정해져요.

버튼을 200x200으로 "크게" 요청해도 창이 작으면 줄어들어 칸에 맞춰져요. pref는 "원하는" 크기일 뿐이에요.
@@K More Complicated GridPane
복잡한 화면 그리는 순서:

1. 종이에 컴포넌트를 그리고 **가상의 선**을 그어 행, 열 번호(0부터) 매기기
2. `add(node, col, row)`로 배치. 여러 칸 차지는 `add(node, col, row, colSpan, rowSpan)`
3. 정렬: `GridPane.setValignment(removeButton, VPos.TOP)` (기본은 세로 가운데)
4. 크기 고정: `setMinWidth/MinHeight`로 버튼 크기 통일
5. 늘어날 녀석 지정: `setPrefWidth(Integer.MAX_VALUE)`로 "최대한 커져" → ListView가 남는 공간 차지
6. 간격: `GridPane.setMargin(node, new Insets(...))`

Week 4 Grocery 샘플 FXML의 `ColumnConstraints`, `GridPane.columnIndex`가 이걸 FXML로 쓴 거예요.

@@SLIDE week-06-2-menus.md
@@S _doc | read
창 위쪽 **메뉴바**, 오른쪽 클릭 **팝업 메뉴**, 체크/라디오 메뉴 항목을 만들어요.
@@S MenuBar and Menus | type
할 일: File, Edit, Settings 메뉴를 만들고 단축키, 구분선, 라디오, 체크, 하위 메뉴를 다 넣어 보기
@@S ContextMenu | type
할 일: Pane을 오른쪽 클릭했을 때만 Help, Inspect 팝업이 뜨게 만들기
@@K Working with Menus
구조: **MenuBar ⊃ Menu ⊃ MenuItem**. MenuItem의 친척들:

- `SeparatorMenuItem`: 구분선
- `CheckMenuItem`: 체크 켜기/끄기 (여러 개 독립)
- `RadioMenuItem`: 여럿 중 **하나만** (ToggleGroup 필요)
- `ContextMenu`: 오른쪽 클릭 팝업
@@K MenuBar and Menus
`"_File"`의 밑줄(`_`)은 **mnemonic**: Alt+F로 메뉴를 열 수 있어요. MenuBar는 `getMenus()`, Menu는 `getItems()`로 추가해요. MenuBar도 Node라서 VBox 맨 위(또는 BorderPane top)에 넣어요.
@@K MenuItems, separator and accelerators
- **accelerator**: 메뉴를 열지 않고 바로 실행하는 단축키 (`Ctrl+N`). mnemonic(`_File`)은 메뉴를 **여는** 키, accelerator는 항목을 **바로 실행**하는 키.
- `setDisable(true)`: 지금은 못 고르는 항목(예: 아무것도 안 열었을 때 Close).

슬라이드는 Close에 `Ctrl+C`를 줬는데, 보통 Ctrl+C는 복사라 실제 앱에서는 피하는 게 좋아요.
@@K RadioMenuItem and ToggleGroup
ToggleGroup = "이 중에 하나만" 묶음. 각 RadioMenuItem에 `setToggleGroup(group)`을 해야 해요. 안 하면 Radio처럼 생겼는데 **여러 개가 동시에 선택**돼요. (RadioButton도 똑같아요.)
@@K Cascaded menu and CheckMenuItem
하위 메뉴(cascade) = **Menu 안에 Menu**를 MenuItem처럼 add. `Menu`가 `MenuItem`의 자식 클래스라서 가능해요(Week 2 상속).
@@K ContextMenu
ContextMenu는 **어디에도 add하지 않아요**(Quiz 4 Q7). 마우스 핸들러에서:

- `e.getButton() == MouseButton.SECONDARY`: 오른쪽 버튼인지 확인 (PRIMARY는 왼쪽)
- `popupMenu.show(aPane, e.getScreenX(), e.getScreenY())`: **화면(screen) 좌표**에 띄우기. `getX()`는 노드 기준 좌표라 다른 값이에요.

간단히 하려면 컨트롤에 `setContextMenu(popupMenu)`를 쓰는 방법도 있어요(Control만 가능, Pane은 안 됨).
@@K Menu event handlers
메뉴 항목 이벤트도 버튼처럼 `setOnAction`.

CheckMenuItem 체크 여부(Quiz 4 Q18): `((CheckMenuItem) e.getSource()).isSelected()`. `getSource()`가 `Object`라서 **캐스팅** 필수. 아니면 필드로 저장해 둔 `gridItem.isSelected()`.

New/Open/Close를 서로 켜고 끄는 코드는 "파일 하나만 열 수 있다"는 **상태**를 메뉴로 보여주는 예예요.

@@SLIDE week-06-3-standard-dialogs.md
@@S _doc | read
미리 만들어진 **표준 대화상자**(Alert, ChoiceDialog, TextInputDialog, FileChooser)와, 결과를 돌려받는 `Optional`을 배워요.
@@S CONFIRMATION | type
할 일: 확인 Alert를 띄우고 OK, Cancel, X로 닫았을 때 각각 어느 쪽 println이 나오는지 확인
@@S setResultConverter | type
할 일: Login Dialog를 만들고 setResultConverter로 Pair를 돌려받아 출력, Cancel이면 아무것도 출력 안 되는지 확인
@@S File Chooser Dialog Box | type
할 일: File 메뉴의 Open, Save에 FileChooser를 연결하고 취소했을 때 null 처리 확인
@@K Standard Dialog Boxes
대화상자 = **보조 창**. 메인 창을 복잡하게 만들지 말고 필요할 때만 띄워요. JavaFX는 `Alert` 같은 표준 대화상자를 줘서 설정 몇 줄이면 돼요.
@@K Alert
Alert 종류 4개(외우기): **INFORMATION, WARNING, ERROR, CONFIRMATION** (+ NONE).

- `setTitle`: 창 제목줄
- `setHeaderText`: 아이콘 옆 큰 글씨. `null`이면 없앰
- `setContentText`: 본문
- `showAndWait()`: 닫힐 때까지 **기다림**(모달). `show()`는 안 기다려요.
@@K Expandable content
"자세히 보기"처럼 접었다 펴는 영역. 긴 에러 내용을 TextArea에 넣어 붙일 때 써요.
@@K CONFIRMATION
`showAndWait()`는 `Optional<ButtonType>`을 돌려줘요. `result.get() == ButtonType.OK`로 비교.

**X로 닫으면 CANCEL로 취급**(Quiz 4 Q8). 그래서 Confirmation에서 `get()`이 안전한 거예요(항상 OK나 CANCEL이 들어 있음).
@@K Custom buttons
`getButtonTypes().setAll()`(빈 인자)로 기본 버튼을 지우고, `new ButtonType("이름")`으로 내 버튼을 추가. 비교는 **같은 ButtonType 객체**인지(`==`)로 해요. 그래서 버튼 객체를 배열이나 변수에 저장해 둬요.

Cancel 버튼에 `ButtonBar.ButtonData.CANCEL_CLOSE`를 주면 X로 닫을 때 그 버튼으로 취급돼요. 이게 없으면 X 버튼이 동작하지 않을 수 있어요.
@@K ChoiceDialog
드롭다운에서 하나 고르기. 생성자 첫 인자가 **기본값**. 결과는 `Optional<String>`.

**`isPresent()`**: 골랐으면 true, Cancel이면 false. `get()`은 isPresent가 true일 때만! 비어 있는데 `get()`하면 `NoSuchElementException`.
@@K TextInputDialog
글자 입력 받기. 생성자 인자가 **기본 입력값**("Mark"). Cancel을 누르면 Optional이 비어서 `isPresent()`가 false(Quiz 4 Q19: 출력 `No name`).
@@K Login Dialog with Dialog
완전히 내 마음대로 만드는 `Dialog<R>`. 순서:

1. `new ButtonType("Login", ButtonBar.ButtonData.OK_DONE)` + `ButtonType.CANCEL`을 `getDialogPane().getButtonTypes()`에 추가
2. GridPane에 Label, TextField, **PasswordField**(입력이 `●`로 보임) 배치
3. `getDialogPane().setContent(grid)`
@@K setResultConverter
왜 필요한가(Quiz 4 Q14): 대화상자를 **다른 클래스**에서 만들면, 호출하는 쪽은 그 안의 `username` TextField를 볼 수 없어요. 그래서 대화상자가 닫힐 때 **돌려줄 값**을 정해 두는 거예요.

- 매개변수 `b`: 눌린 버튼
- Login이면 `new Pair<>(아이디, 비번)` 반환 → `Optional`에 들어감
- Cancel이나 X면 **null** 반환 → Optional이 **비어서** `isPresent()` false

`Callback<ButtonType, Pair<String,String>>`은 "ButtonType을 받아 Pair를 돌려주는 함수"예요. 메서드가 `call` 하나라 람다 `b -> ...`로 줄여 쓸 수 있어요. `Pair`는 Week 3 제네릭의 `<K, V>` 예시, `getKey()`, `getValue()`.
@@K Login button enable/disable
- `requestFocus()`: 열리자마자 아이디 칸에 커서
- `lookupButton(loginButtonType)`: 대화상자 안의 실제 버튼 Node 찾기
- `textProperty().addListener(...)`: 글자가 **바뀔 때마다**(붙여넣기 포함) 실행. Week 5의 KeyReleased보다 정확해요. Week 10 Properties의 미리보기예요.
@@K File Chooser Dialog Box
- `showOpenDialog(stage)` / `showSaveDialog(stage)`: 열기/저장 창. stage는 **owner**.
- 반환은 `File`. 취소하면 **null**(Quiz 4 Q9) → `if (f != null)` 필수.
- `getName()`: 파일 이름만, `getAbsolutePath()`: 전체 경로.
- `setInitialDirectory`, `getExtensionFilters()`: 시작 폴더, 확장자 필터.

실제 파일 읽고 쓰기는 Week 9 IO에서 해요.

@@SLIDE week-06-4-custom-dialog.md
@@S _doc | read
`Dialog`를 **상속해서** 나만의 대화상자 클래스를 만들고, 메인 창과 **모델로** 데이터를 주고받아요. 이 주에서 제일 길고 시험에 서술형으로 잘 나와요.
@@S BuddyDetailsDialog | type
할 일: EmailBuddy, EmailBuddyList, EmailBuddyPanel, BuddyDetailsDialog를 만들고 Add로 새 친구 추가, 더블클릭으로 편집, Cancel이면 그대로인지 확인
@@K Making My Own Dialog Boxes
**owner**: 대화상자를 띄운 창. 메인 창을 닫거나 최소화하면 대화상자도 같이.

**모델이 middle-man**(Quiz 4 Q13 서술형, 꼭 외우기):

1. 열 때: 모델 값으로 컴포넌트를 **채움**
2. 사용자가 수정
3. **OK**: 대화상자 값으로 **모델 업데이트**
4. **Cancel 또는 X**: 모델 **변경 없음**
5. 어느 쪽이든 대화상자는 닫힘
@@K Dialog subclass
`class MyDialog extends Dialog<RETURN_TYPE>`. 생성자에 owner Stage, 제목, 그리고 **모델 객체**를 받아요. 모델을 받아야 (1) 처음 값을 채우고 (2) OK 때 수정할 수 있으니까요.

슬라이드는 `extends Dialog`(raw type)로 썼지만 `Dialog<EmailBuddy>`처럼 타입을 주면 `showAndWait()`가 `Optional<EmailBuddy>`로 바로 나와요.
@@K setResultConverter pattern
메인 창은 대화상자 **안**을 몰라요(몰라야 해요). 알아야 할 건 "OK였나, Cancel이었나" 하나. 그래서 OK면 결과 객체, 아니면 **null**을 돌려주게 약속해요. 호출하는 쪽은 `Optional`의 `isPresent()`만 보면 돼요.
@@K EmailBuddy model
모델 두 개: 한 명(`EmailBuddy`)과 목록(`EmailBuddyList`). 목록은 Week 5 ItemList와 같은 배열 + size 구조에 **hot list** 기능을 더했어요.

- `getHotListSize()`: hot인 사람 수
- `getHotListBuddy(i)`: hot인 사람 중 **i번째**. 화면에 hot만 보일 때, 화면 index를 실제 사람으로 바꾸는 데 써요.

`toString()`이 이름을 돌려주니까 `ListView<EmailBuddy>`에 이름이 보여요. ListView는 각 항목의 `toString()`을 표시해요.

getter 이름 `onHotList()`와 setter `onHotList(boolean)`이 같은 이름(오버로딩)이라 bean 규칙(`isOnHotList`, `setOnHotList`)과 달라요. 시험에서 property 규칙을 물으면 bean 규칙으로 쓰세요.
@@K EmailBuddyPanel (view)
`extends GridPane`이라 생성자 안에서 바로 `add(...)`. `add(buddyList, 0, 0, 1, 3)`: col 0, row 0에서 **1열, 3행 span**. 오른쪽 버튼 3개 높이만큼 리스트가 길게.

`update()` 포인트:

1. 선택 index 기억
2. hot list 체크 여부에 따라 전체 또는 hot만 정확한 크기 배열로
3. `setItems(null)` 후 다시 `setItems(...)`: 편집으로 **같은 객체**의 이름만 바뀌면 ListView가 변화를 못 알아채서, 한 번 비웠다 채우는 요령
4. 선택 복원, Remove 버튼 활성/비활성
@@K BuddyDetailsDialog
- 생성자에서 받은 `bud`로 TextField, CheckBox **초기값 채우기**
- `setResultConverter`: OK면 `bud`에 값을 **써 넣고** `bud` 반환, 아니면 null. Cancel이면 `bud`는 손대지 않으니 모델이 그대로예요.
- OK 버튼은 처음엔 비활성, 이름과 주소가 둘 다 있을 때만 활성. 슬라이드 원문의 조건식은 `nameField...isEmpty() || addressField...isEmpty()`예요(변환 과정에서 `||`가 빠져 있었어요).

생각해 볼 점: Add일 때는 새 객체라 상관없지만, Edit일 때 OK를 누르면 **원래 객체가 직접** 바뀌어요. Workshop 3에서 복사본을 저장한 이유(Quiz 4 Q17)와 같은 이야기예요.
@@K Controller: Add, Remove, Edit
- **Add**: 빈 `EmailBuddy`를 먼저 만들어 대화상자에 넘김 → `isPresent()`면 `model.add` + `update`. Cancel이면 아무것도 안 함(만든 객체는 버려짐).
- **Remove**: `getSelectedIndex() >= 0`이면 `model.remove(index)` + `update`. (hot list 보기에서는 화면 index와 모델 index가 달라서 이 코드는 엉뚱한 사람을 지울 수 있어요. 버그 찾기 문제로 좋아요.)
- **Edit**: `getClickCount() == 2`로 더블클릭. hot list 보기면 `getHotListBuddy(i)`, 아니면 `getBuddy(i)`. OK면 `update`만(객체는 대화상자가 이미 고쳤으니까).
- 한 번 클릭이면 `update()`로 Remove 버튼 활성화.

Week 5 규칙 그대로: **모델 변경 → view.update()**.

@@SLIDE week-06-5-di-repository.md
@@S _doc | read
Week 7 Guice, Week 8 DB 연결의 **설계 바탕**이에요. 짧지만 정의 문장이 시험에 그대로 나와요.
@@K Dependency Injection
DI 한 문장: 객체가 필요한 것(의존성)을 **스스로 `new` 하지 않고 밖에서 받는다**.

- 문제: 클래스 안에서 `new PlayerRepository()` → 구현에 **꽉 묶임**(tight coupling). 바꾸려면 그 클래스를 고쳐야 함.
- 해결: 생성자 매개변수로 받기(**constructor injection**). Week 5 View가 생성자로 model을 받은 게 이미 DI였어요.
- 비유: 셰프가 채소를 직접 기르지 않고 **납품받음**.
- 장점: loose coupling, 테스트 쉬움(가짜 Repository를 넣을 수 있음), 재사용.
@@K Dependency Injection in Practice
Guice 모듈 한 줄 해석: "누가 `PlayerRepository`(인터페이스)를 달라고 하면 `InMemoryPlayerRepository`(구현)를 줘라, 앱 전체에서 **하나만**(Singleton)."

방향 함정: `bind(인터페이스).to(구현)`. 반대로 쓰면 틀려요(Quiz 4 Q10). Week 5 샘플은 `Scopes.SINGLETON`, 이 슬라이드는 `Singleton.class`인데 둘 다 같은 뜻이에요.
@@K Repository Pattern
Repository = 데이터 **창구**. 컨트롤러는 "선수 목록 줘", "추가해 줘"만 말하고, 그게 메모리인지 MySQL인지 파일인지 몰라요.

- 비유: 도서관 책장을 직접 뒤지지 않고 **카탈로그**에 물어봄
- 장점: 저장소를 **갈아 끼워도** 컨트롤러는 그대로. Week 8에서 InMemory → JDBC로 바꾸는 게 바로 이거예요.

인터페이스가 **계약**(무엇을 할 수 있나), 구현 클래스가 실제 데이터 관리.
@@K How do they both work together?
둘을 합치면: 컨트롤러는 **DI로** Repository를 **인터페이스 타입으로** 받는다 → 실제 구현이 무엇이든 상관없다 → 테스트 때는 가짜, 실행 때는 진짜를 넣는다. "DI + Repository = Decoupled, testable design."
@@K Service Design Pattern
Repository만 있으면 컨트롤러가 `repository.add()`를 직접 부르면서 검증 규칙도 같이 들고 있어요(fat controller). 그 규칙을 **Service**로 빼요.

흐름 비교(Quiz 4 Q15 서술형):

- 없을 때: **Controller → Repository → Data**
- 있을 때: **Controller → Service → Repository → Data**

장점: 규칙, 검증, 작업 흐름이 Service에 모여서 컨트롤러는 UI 이벤트만, 테스트, 확장, 유지보수가 쉬움(separation of concerns). Week 3 Service Layer에 **인터페이스 + DI + Repository**가 붙어 "완전한 패턴"이 된 거예요.

@@TEXT
## 🧩 이번 주 토이 프로젝트: CafeOrder Week 6

화면을 `BorderPane`으로 다시 짜요: top에 MenuBar(File > New Order, Exit / View > 메뉴 정렬 RadioMenuItem), center에 메뉴 GridPane, right에 장바구니 VBox. 품목을 더블클릭하면 `ItemOptionsDialog extends Dialog<OrderLine>`(사이즈, 수량)이 뜨고 OK면 장바구니에 추가. 주문 확정은 CONFIRMATION Alert. 저장소는 `MenuRepository` 인터페이스 + `InMemoryMenuRepository`로 나누고 컨트롤러 생성자로 받기. (토이 가이드는 준비 중이에요.)

## ✅ 시험 대비 체크리스트 (Week 6)

- [ ] FlowPane(wrap), HBox/VBox(no wrap), BorderPane(5칸, 칸마다 하나), GridPane(col, row)의 차이를 안다.
- [ ] `Insets(top, right, bottom, left)` 순서를 안다.
- [ ] GridPane span `add(node, col, row, colSpan, rowSpan)`, `setValignment`, `setMargin`을 쓸 수 있다.
- [ ] `setPrefWidth(Integer.MAX_VALUE)`로 남는 공간을 차지하게 할 수 있다.
- [ ] MenuBar, Menu, MenuItem, SeparatorMenuItem, CheckMenuItem, RadioMenuItem + ToggleGroup을 만든다.
- [ ] mnemonic(`_File`)과 accelerator(`Ctrl+N`)를 구분한다.
- [ ] ContextMenu는 add하지 않고 `show()`로 띄우며 `MouseButton.SECONDARY`를 검사한다.
- [ ] CheckMenuItem의 체크 여부를 `getSource()` 캐스팅으로 알 수 있다.
- [ ] Alert 4종, `showAndWait()`의 `Optional`, X = CANCEL을 안다.
- [ ] ChoiceDialog, TextInputDialog에서 `isPresent()`, `get()`을 쓸 수 있다.
- [ ] `setResultConverter`가 필요한 이유와 OK/Cancel 반환값(객체/null)을 설명할 수 있다.
- [ ] FileChooser의 `showOpenDialog`, `showSaveDialog`, 취소 시 null을 안다.
- [ ] 커스텀 대화상자에서 모델이 middle-man인 흐름(OK/CANCEL)을 서술할 수 있다.
- [ ] DI, Repository, Service의 정의와 비유, 호출 흐름 두 가지를 쓸 수 있다.

## ✍️ 손으로 써 보기

1. BorderPane의 top에 `File` 메뉴(Exit 항목, `Ctrl+Q`), center에 TextArea, bottom에 `Save`, `Clear` 버튼을 오른쪽 정렬로 두는 `start`를 쓰세요. Exit은 창을 닫고 Clear는 TextArea를 비웁니다.

<details><summary>1번 예시 답</summary>

```java
@Override
public void start(Stage stage) {
    BorderPane root = new BorderPane();

    Menu file = new Menu("_File");
    MenuItem exit = new MenuItem("Exit");
    exit.setAccelerator(KeyCombination.keyCombination("Ctrl+Q"));
    exit.setOnAction(e -> stage.close());
    file.getItems().add(exit);
    root.setTop(new MenuBar(file));

    TextArea area = new TextArea();
    root.setCenter(area);

    Button save = new Button("Save");
    Button clear = new Button("Clear");
    clear.setOnAction(e -> area.clear());
    HBox buttons = new HBox(10, save, clear);
    buttons.setAlignment(Pos.CENTER_RIGHT);
    buttons.setPadding(new Insets(10));
    root.setBottom(buttons);

    stage.setScene(new Scene(root, 400, 300));
    stage.show();
}
```

</details>

2. `Product`(name, price) 모델을 편집하는 `ProductDialog extends Dialog<Product>`를 쓰세요. 열 때 값을 채우고, OK면 모델을 고쳐서 반환, Cancel이면 null. 가격이 숫자가 아니면 OK 때 null을 반환하세요.

<details><summary>2번 예시 답</summary>

```java
public class ProductDialog extends Dialog<Product> {
    public ProductDialog(Stage owner, Product p) {
        initOwner(owner);
        setTitle("Edit Product");
        ButtonType ok = new ButtonType("OK", ButtonBar.ButtonData.OK_DONE);
        getDialogPane().getButtonTypes().addAll(ok, ButtonType.CANCEL);

        TextField name = new TextField(p.getName());
        TextField price = new TextField(String.valueOf(p.getPrice()));
        GridPane grid = new GridPane();
        grid.setHgap(10);
        grid.setVgap(10);
        grid.add(new Label("Name:"), 0, 0);  grid.add(name, 1, 0);
        grid.add(new Label("Price:"), 0, 1); grid.add(price, 1, 1);
        getDialogPane().setContent(grid);

        setResultConverter(b -> {
            if (b != ok) return null;
            try {
                double value = Double.parseDouble(price.getText().trim());
                p.setName(name.getText().trim());
                p.setPrice(value);
                return p;
            } catch (NumberFormatException ex) {
                return null;
            }
        });
    }
}

// 사용
Optional<Product> r = new ProductDialog(stage, product).showAndWait();
if (r.isPresent()) view.update();
```

</details>

3. 다음 코드의 출력은? 사용자는 X 버튼으로 닫았어요.

```java
Alert a = new Alert(Alert.AlertType.CONFIRMATION, "Delete?");
Optional<ButtonType> r = a.showAndWait();
System.out.println(r.isPresent() + " " + (r.get() == ButtonType.CANCEL));
```

<details><summary>3번 정답</summary>

`true true`. CONFIRMATION을 X로 닫으면 CANCEL 버튼을 누른 것으로 취급돼서 Optional에 `ButtonType.CANCEL`이 들어 있어요.

</details>
