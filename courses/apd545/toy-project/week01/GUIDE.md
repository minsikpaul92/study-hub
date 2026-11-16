# Week 1. 콘솔로 만드는 첫 카페 (MVC 뼈대)

## 1. 이번 주 목표

콘솔에서 메뉴를 보고, 번호와 수량을 입력해서 주문하고, 0을 누르면 영수증(세금 13% 포함)이 찍히는 프로그램을 만듭니다.

```
========= RECEIPT =========
Americano       x2   $  7.00
Cheesecake      x1   $  5.95
---------------------------
Subtotal            $ 12.95
Tax (13%)           $  1.68
TOTAL               $ 14.63
===========================
```

기능은 단순하지만 **처음부터 Model, View, Controller 세 덩어리로 나눠서** 만드는 것이 이번 주의 진짜 목표입니다.

## 2. 강의 근거

| 강의 파일 | 이번 단계에서 쓰는 내용 |
| --- | --- |
| `Week01/Segment 1 - Introduction to Java` | JVM, 컴파일(.java → .class), Garbage Collector |
| `Week01/Segment 2, 3 - Similarities/Differences of Java and C` | 클래스 문법, `String`, 포인터 없음, `main`이 클래스 안에 있음 |
| `Week01/Segment 4 - MVC Pattern` | Employee / EmployeeView / EmployeeController 예제 구조 그대로 |
| `Week01/Java Code Conventions` | 클래스는 `PascalCase`, 변수/메서드는 `camelCase`, 상수는 `UPPER_CASE` |
| 교수님 샘플 `SampleCode/Week01/WK_1_LE_Ex` | `models`, `views`, `controllers` 패키지 나누는 방식 |

## 3. 왜 이렇게 하나요? (초등학생 버전)

카페를 떠올려 보세요.

- **창고 (Model)**: 원두, 우유, 가격표가 있는 곳. 창고는 손님과 말하지 않아요. 그냥 물건과 규칙(가격은 음수가 될 수 없다)만 갖고 있어요.
- **카운터 화면 (View)**: 손님이 메뉴판을 보고, 주문을 말하는 곳. 화면은 계산을 하지 않아요. 보여주고 듣기만 해요.
- **직원 (Controller)**: 손님 말을 듣고(View에서 입력 받기), 창고를 보고(Model), 계산해서 다시 화면에 알려줘요.

이렇게 나누면 좋은 점은 **나중에 카운터 화면만 키오스크로 바꿔도 창고와 직원은 그대로**라는 거예요. 실제로 Week 4에서 콘솔 View를 JavaFX 화면으로 바꿀 때, `MenuItem`은 한 줄도 안 고칩니다. 그걸 직접 체험하려고 지금 일부러 나눠 두는 거예요.

## 4. 따라하기 (IntelliJ)

### 4-1. 프로젝트 만들기

1. IntelliJ → **New Project**
2. 왼쪽에서 **Java** 선택 (JavaFX 아님. JavaFX는 Week 4에 추가)
3. Name: `CafeOrder`, Location: `~/Documents/APD545/ToyProject/my`
4. Build system: **Maven**, JDK: 지금 쓰는 JDK (Workshop 3과 같은 것)
5. Advanced Settings → GroupId: `ca.senecacollege`, ArtifactId: `CafeOrder`
6. Create

> 왜 Maven? Week 4부터 JavaFX, Week 7에 Guice, Week 8에 SQLite 라이브러리를 `pom.xml`에 한 줄씩 추가하면 되기 때문이에요. 지금은 라이브러리가 하나도 없어요.

`pom.xml`의 `<properties>`가 아래처럼 되어 있는지만 확인하세요 (숫자는 본인 JDK 버전이면 OK).

```xml
<properties>
    <project.build.sourceEncoding>UTF-8</project.build.sourceEncoding>
    <maven.compiler.release>21</maven.compiler.release>
</properties>
```

### 4-2. 패키지 만들기

`src/main/java` 우클릭 → New → Package 로 4개를 만듭니다.

```
ca.senecacollege.cafe.models
ca.senecacollege.cafe.views
ca.senecacollege.cafe.controllers
ca.senecacollege.cafe.app
```

> 교수님 샘플(`WK_1_LE_Ex`)도 `models / views / controllers`로 나눠요. 폴더 이름만 봐도 "이 파일은 MVC 중 무엇인지" 알 수 있게 하는 거예요.

### 4-3. Model 먼저: `models/MenuItem.java`

**순서가 중요해요.** 강의(Week 5 Segment 3)에서도 "Model을 먼저 만들고 테스트한 다음 View를 만든다"고 해요. 화면이 없어도 Model은 혼자 존재할 수 있으니까요.

```java
package ca.senecacollege.cafe.models;

public class MenuItem {

    private String id;
    private String name;
    private double price;

    public MenuItem(String id, String name, double price) {
        this.id = id;
        this.name = name;
        setPrice(price);          // 생성자에서도 검사 규칙을 재사용
    }

    public String getId() { return id; }
    public String getName() { return name; }
    public double getPrice() { return price; }

    public void setPrice(double price) {
        if (price < 0) {
            throw new IllegalArgumentException("Price cannot be negative");
        }
        this.price = price;
    }

    @Override
    public String toString() {
        return String.format("%s %s ($%.2f)", id, name, price);
    }
}
```

포인트

- 필드는 전부 `private`. 밖에서는 getter/setter로만 접근 (캡슐화). 강의 Employee 예제와 같은 모양이에요.
- `setPrice` 안에 "음수 금지" 규칙이 있어요. **규칙은 Model이 지킨다**가 핵심.
- `System.out.println`이 Model 안에 하나도 없어요. 출력은 View의 일이니까요.
- C++과 차이: `delete`가 없어요. 안 쓰는 객체는 Garbage Collector가 치워요 (Segment 1).

### 4-4. View: `views/CafeView.java`

View는 **출력하는 메서드**와 **입력받는 메서드**만 가져요. 계산은 절대 하지 않아요.

```java
package ca.senecacollege.cafe.views;

import ca.senecacollege.cafe.models.MenuItem;
import java.util.Scanner;

public class CafeView {

    private final Scanner scanner = new Scanner(System.in);

    public void showWelcome() {
        System.out.println("==============================");
        System.out.println("   Welcome to Cafe Order!");
        System.out.println("==============================");
    }

    public void showMenu(MenuItem[] menu) {
        System.out.println();
        System.out.println("---------- MENU ----------");
        for (int i = 0; i < menu.length; i++) {
            System.out.printf("%d. %-15s $%5.2f%n", i + 1, menu[i].getName(), menu[i].getPrice());
        }
        System.out.println("0. Finish order");
        System.out.println("--------------------------");
    }

    public int askMenuNumber() { return readInt("Choose a menu number: "); }
    public int askQuantity()   { return readInt("How many? "); }

    public void showAdded(String name, int quantity, double runningTotal) {
        System.out.printf("Added %d x %s. Current total: $%.2f%n", quantity, name, runningTotal);
    }

    public void showError(String message) {
        System.out.println("[!] " + message);
    }

    public void showMessage(String message) {
        System.out.println(message);
    }

    // TODO 1: showReceiptHeader(), showReceiptLine(name, qty, lineTotal),
    //         showReceiptFooter(subtotal, tax, total) 를 직접 만들어 보세요.
    //         위 "이번 주 목표"의 영수증 모양이 나오면 성공.

    /** 숫자가 아닌 걸 치면 다시 물어봄 */
    private int readInt(String prompt) {
        while (true) {
            System.out.print(prompt);
            String line = scanner.nextLine().trim();
            try {
                return Integer.parseInt(line);
            } catch (NumberFormatException e) {
                showError("Please type a number.");
            }
        }
    }
}
```

포인트

- `printf`의 `%-15s`는 "왼쪽 정렬로 15칸", `%5.2f`는 "전체 5칸, 소수 둘째 자리". C의 printf와 같아요 (Segment 2 공통점).
- `%n`은 줄바꿈. 영수증에 `%`를 그대로 찍고 싶으면 `%%`라고 써야 해요 (`Tax (13%%)`).
- `readInt`가 `private`인 이유: View 안에서만 쓰는 도우미라서 밖에 보여줄 필요가 없어요.

### 4-5. Controller: `controllers/CafeController.java`

Controller가 Model과 View를 **둘 다 알고 있는 유일한 클래스**예요.

```java
package ca.senecacollege.cafe.controllers;

import ca.senecacollege.cafe.models.MenuItem;
import ca.senecacollege.cafe.views.CafeView;

public class CafeController {

    private static final double TAX_RATE = 0.13;   // 상수는 UPPER_CASE (Code Conventions)

    private final MenuItem[] menu;
    private final CafeView view;
    private final int[] quantities;   // quantities[i] = menu[i]를 몇 개 주문했는지

    public CafeController(MenuItem[] menu, CafeView view) {
        this.menu = menu;
        this.view = view;
        this.quantities = new int[menu.length];
    }

    public void run() {
        view.showWelcome();
        boolean ordering = true;
        while (ordering) {
            view.showMenu(menu);
            int choice = view.askMenuNumber();
            if (choice == 0) {
                ordering = false;
            } else if (choice < 1 || choice > menu.length) {
                view.showError("No such menu number: " + choice);
            } else {
                addItem(choice - 1);       // 화면 번호는 1부터, 배열은 0부터
            }
        }
        printReceipt();
    }

    private void addItem(int index) {
        int qty = view.askQuantity();
        if (qty <= 0) {
            view.showError("Quantity must be at least 1.");
            return;
        }
        quantities[index] += qty;
        view.showAdded(menu[index].getName(), qty, calculateSubtotal());
    }

    public double calculateSubtotal() {
        double subtotal = 0;
        for (int i = 0; i < menu.length; i++) {
            subtotal += menu[i].getPrice() * quantities[i];
        }
        return subtotal;
    }

    private void printReceipt() {
        // TODO 2: 아래 순서로 직접 채워 보세요.
        //  1) subtotal 이 0 이면 "No items ordered. Bye!" 출력하고 끝
        //  2) view.showReceiptHeader()
        //  3) quantities[i] > 0 인 메뉴만 view.showReceiptLine(...)
        //  4) tax = subtotal * TAX_RATE, view.showReceiptFooter(subtotal, tax, subtotal + tax)
    }
}
```

포인트

- `final` 필드: 생성자에서 한 번 정하면 다시 바꿀 수 없어요. C++의 `const` 멤버와 비슷한 역할.
- **배열 두 개(`menu`, `quantities`)를 인덱스로 짝 맞추는 방식이 좀 불편하죠?** 일부러 그렇게 했어요. Week 3에서 `Map<MenuItem, Integer>`로 바꾸면서 "Collection이 왜 필요한가"를 몸으로 느끼게 됩니다.
- 계산(`calculateSubtotal`)이 지금은 Controller에 있어요. Week 3 Service Layer 강의에서 "비즈니스 로직은 Controller에 두지 말라"고 하는데, 그때 `OrderService`로 옮길 거예요. 지금 위치를 기억해 두세요.

### 4-6. 시작점: `app/CafeApp.java`

```java
package ca.senecacollege.cafe.app;

import ca.senecacollege.cafe.controllers.CafeController;
import ca.senecacollege.cafe.models.MenuItem;
import ca.senecacollege.cafe.views.CafeView;

public class CafeApp {

    public static void main(String[] args) {
        MenuItem[] menu = {
                new MenuItem("C01", "Americano", 3.50),
                new MenuItem("C02", "Cafe Latte", 4.75),
                new MenuItem("T01", "Green Tea", 3.25),
                new MenuItem("D01", "Cheesecake", 5.95)
        };
        CafeView view = new CafeView();
        CafeController controller = new CafeController(menu, view);
        controller.run();
    }
}
```

`main`은 M, V, C를 **만들고 연결만** 해요. 이 "누가 누구를 만들어서 넘겨주나"가 Week 5 수동 DI, Week 7 Guice(IoC)로 발전합니다. 강의 TestMain(`WK_1_LE_Ex`)도 똑같이 view → controller → model 순서로 만들어요.

실행: `CafeApp`의 `main` 왼쪽 초록 ▶ 클릭.

## 5. 직접 해보기

| # | 할 일 | 힌트 |
| --- | --- | --- |
| TODO 1 | `CafeView`에 영수증 메서드 3개 만들기 | `showMenu`의 printf 모양을 참고 |
| TODO 2 | `printReceipt()` 채우기 | 주석 1)~4) 순서대로 |
| 도전 A | 메뉴에 `Croissant $3.95` 추가하기 | **어느 파일만 고치면 되는지**가 핵심. 고친 파일이 1개면 MVC를 잘 나눈 것 |
| 도전 B | 소계가 $20 이상이면 10% 할인 | 계산이니까 View가 아니라 Controller. Week 3에서 Service로 옮길 예정 |
| 도전 C | 수량 0이나 음수 대신, 수량이 20 넘으면 에러 | 이 규칙은 입력 검사라 Controller에 두기 |

## 6. 동작 확인

아래 순서로 입력해 보세요: `1` → `2` → `4` → `1` → `0`

- "Added 2 x Americano. Current total: $7.00"
- "Added 1 x Cheesecake. Current total: $12.95"
- 영수증 TOTAL `$14.63`

그리고 `abc`를 치면 "Please type a number.", `9`를 치면 "No such menu number: 9"가 나와야 해요.

정답 코드: 같은 폴더의 `CafeOrder/`

## 7. 시험 포인트

- **MVC 각 역할 한 줄씩**: Model = 데이터와 규칙, View = 보여주기와 입력, Controller = 입력을 받아 Model을 바꾸고 View에 알림. "View는 데이터가 어떻게 저장되는지 모른다"는 문장이 슬라이드에 그대로 있어요.
- **Java vs C++**: Java는 포인터 연산이 없고, 다중 상속이 클래스로는 안 되고(인터페이스로 해결, Week 2), 메모리 해제는 GC가 함. 모든 코드는 클래스 안에 있음.
- **Code Conventions**: 클래스 `MenuItem`, 메서드 `calculateSubtotal`, 상수 `TAX_RATE`, 패키지는 전부 소문자.

## 8. 다음 주 예고 (Week 2)

지금 `MenuItem` 하나로 커피도 케이크도 다 표현하고 있어요. 그런데 커피는 사이즈(Tall/Grande)가 있고 케이크는 없죠. Week 2에서는 `abstract class MenuItem` 아래에 `Coffee`, `Tea`, `Dessert`를 두고, 사이즈 선택은 `Customizable` 인터페이스로 만들어요 (상속, 추상 클래스, 인터페이스).

<details>
<summary>도전 A, B 답 (펼치기 전에 먼저 해보기)</summary>

- 도전 A: `CafeApp.java`의 `menu` 배열에 `new MenuItem("B01", "Croissant", 3.95)` 한 줄만 추가. View와 Controller는 배열 길이를 `menu.length`로 쓰기 때문에 고칠 필요가 없어요.
- 도전 B: `CafeController`에 `private static final double DISCOUNT_THRESHOLD = 20.0;`, `DISCOUNT_RATE = 0.10;`을 두고, `printReceipt()`에서 `subtotal >= DISCOUNT_THRESHOLD`면 `subtotal * DISCOUNT_RATE`만큼 빼기. View에는 할인 줄을 보여주는 `showDiscount(double)` 메서드 하나 추가.

</details>
