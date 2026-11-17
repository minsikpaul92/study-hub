# Week 2. 상속, 추상 클래스, 인터페이스

> **읽는 법**: 📑 표시는 교수님 슬라이드의 핵심 문장(영어 원문 그대로 짧게 발췌)이고, 바로 아래 **🇰🇷 한글 해설**이 이어져요. ⌨️ 표시가 있는 코드는 IntelliJ에서 직접 쳐 보세요.
>
> 이번 주 내용은 뒤에서 계속 나와요. Week 5 MVC의 Model 상속, Week 6~7의 `Repository` **인터페이스**와 구현 클래스, Guice의 `bind(인터페이스).to(구현)`이 전부 여기서 출발해요.

## 0. 이번 주 한눈에 보기

| 개념 | 한 줄 정리 | 시험에 나오는 모양 |
| --- | --- | --- |
| 상속 `extends` | is-a 관계. 부모의 필드, 메서드를 물려받음 (private은 직접 접근 불가) | "Circle **is a** GeometricObject" |
| 생성자 | **상속 안 됨**. `super(...)`로 부르고, 안 쓰면 부모의 **인자 없는 생성자**가 자동 호출 | 부모에 인자 없는 생성자가 없으면 컴파일 에러 |
| constructor chaining | 자식 객체를 만들면 **맨 위 조상 생성자부터** 차례로 실행 | 출력 순서 맞히기 |
| overriding | 같은 시그니처로 부모 메서드 교체. 접근 범위는 **넓히기만** 가능 | static은 override 안 됨 (hiding) |
| final | final 클래스는 상속 불가(String), final 메서드는 override 불가 | |
| abstract class | `new` 불가. 추상 메서드 + 일반 메서드 + 필드 가능 | 추상 메서드를 다 구현 안 하면 자식도 abstract |
| interface | 공통 **행동** 명세. 메서드는 기본 public abstract, 필드는 public static final | `implements`, 여러 개 가능 |
| 다중 상속 | 클래스는 하나만 `extends` (Diamond Problem), 인터페이스는 여러 개 `implements` | |

**함정 모음**

- `super(...)`는 생성자의 **첫 줄**이어야 한다. 부모 생성자를 이름으로 부르면(`GeometricObject()`) 에러.
- 부모에 `Fruit(String name)`만 있고 인자 없는 생성자가 없으면, `class Apple extends Fruit {}`는 **컴파일 에러**.
- private 필드도 상속은 된다. 다만 자식 코드에서 **직접 접근이 안 될 뿐** (getter, setter로 접근).
- 메서드 찾기는 **위로만** 올라간다 (자식 → 부모 → ... → Object). 아래로는 안 내려간다.
- abstract 메서드는 **body가 없고, static일 수 없고, 반드시 override**된다.
- 인터페이스 멤버는 private, protected 불가. 구현할 때 `public`을 빼먹으면 접근 범위를 좁힌 것이라 에러.

{{PRACTICE}}

{{TOC}}

@@SLIDE week-02-1-inheritance-abstract.md
@@S _doc | read
비슷한 클래스끼리 겹치는 부분을 **부모 클래스 하나로 모으는 법**(상속)과, "직접 만들지는 말고 꼭 자식을 만들어 써"라고 강제하는 **추상 클래스**를 배워요.
@@S Constructor Chaining | type
할 일: Faculty, Employee, Person을 쳐서 (1)~(4) 출력 순서 확인
@@S Example: abstract GeometricObject | type
할 일: abstract GeometricObject와 Circle, Rectangle을 만들고 `new GeometricObject()`가 에러 나는지 확인
@@K Outcomes
이번 세그먼트 목표는 세 가지예요: 클래스를 **정리하는 법**, **상속**, **추상 클래스**.
@@K Organizing class: The need
Person, Employee, Manager, Customer는 모두 `name`, `phoneNumber`가 있어요. 클래스마다 똑같은 필드와 getter를 복사해 넣으면 고칠 때 네 군데를 다 고쳐야 하죠. 그래서 **공통 부분은 부모 클래스에 한 번만** 쓰고, 각자 다른 부분(Employee의 `employeeID`, Company의 `clientList`)만 자식에 써요.
@@K Class hierarchy
클래스 계층은 **거꾸로 된 나무**예요. 위로 갈수록 일반적(generalization), 아래로 갈수록 구체적(specialization).

관계를 확인하는 말은 **"is a"**: "Manager **is an** Employee", "Circle **is a** GeometricObject". 이 문장이 자연스러우면 상속이 맞고, "Car is an Engine"처럼 어색하면 상속이 아니라 **has-a**(필드로 가지기)예요.
@@K Inheritance (Quick overview)
`extends` 한 단어로 상속해요. 자식은 **모든 조상**의 상태(필드)와 행동(메서드)을 물려받아요. 단, `private` 멤버는 자식 코드에서 직접 못 써요(아래 접근 제한자 부분에서 다시 나와요).

C++과 다른 점: Java는 `extends` 뒤에 **클래스 하나만** 올 수 있어요. 그리고 아무것도 extends 안 하면 자동으로 `Object`를 상속해요.
@@K Are Superclass's Constructor Inherited?
생성자는 **상속되지 않아요.** 필드, 메서드와 다른 점이에요.

- 자식 생성자 안에서 `super(...)`로 부모 생성자를 **명시적으로** 부르거나,
- 안 쓰면 컴파일러가 첫 줄에 `super();`를 **몰래 넣어요**(암묵적 호출).

그래서 부모에 인자 없는 생성자가 없으면 문제가 생겨요. 아래 Apple/Fruit 문제가 바로 그거예요.
@@K Using the Keyword super
`super`의 두 가지 용도:

1. `super(color, filled)`: 부모 **생성자** 호출. 생성자의 **첫 줄**만 가능.
2. `super.toString()`: 부모의 **메서드** 호출. override한 메서드 안에서 부모 버전도 쓰고 싶을 때.

`public A() { }`와 `public A() { super(); }`는 **똑같아요.** 시험에 "equivalent" 문제로 나와요.
@@K Constructor Chaining
`new Faculty()` 한 줄의 출력:

```
(1) Person's no-arg constructor is invoked
(2) Invoke Employee's overloaded constructor
(3) Employee's no-arg constructor is invoked
(4) Faculty's no-arg constructor is invoked
```

따라가 보면:

1. `Faculty()` 첫 줄에 숨은 `super()` → `Employee()`로.
2. `Employee()` 첫 줄은 `this("(2) ...")`. 같은 클래스의 다른 생성자 `Employee(String s)`로.
3. `Employee(String s)` 첫 줄에 숨은 `super()` → `Person()`. **(1)** 출력.
4. 돌아와서 `Employee(String s)` 몸통: **(2)** 출력.
5. 돌아와서 `Employee()` 나머지: **(3)**, 마지막으로 `Faculty()` 몸통: **(4)**.

규칙: 생성자 첫 줄에 `this(...)`가 있으면 `super()`는 그 **다른 생성자 쪽**에 들어가요. `this(...)`와 `super(...)`는 둘 다 첫 줄이어야 해서 **같이 쓸 수 없어요.** (제가 직접 돌려서 출력 확인했어요.)
@@K Find out the errors in the program
답: **컴파일 에러**예요. `Apple`에는 생성자가 없으니 컴파일러가 기본 생성자 `Apple() { super(); }`를 만들어요. 그런데 `Fruit`에는 `Fruit(String name)`만 있고 **인자 없는 `Fruit()`가 없어요.** 생성자를 하나라도 직접 쓰면 기본 생성자는 자동으로 안 생기거든요.

고치는 법 두 가지: (1) `Fruit`에 `public Fruit() {}` 추가, (2) `Apple`에 `public Apple() { super("apple"); }` 추가.
@@K Example: GeometricObject, Circle, Rectangle
`color`, `filled`는 부모에서 **private**이라 자식이 `this.color = color`로 직접 못 써요. 그래서 `setColor(color)`, `setFilled(filled)`로 넣어요. 또는 `super(color, filled)`를 첫 줄에 쓰는 방법도 있어요(더 깔끔해요).

`toString()`은 부모에만 있는데 `circle.toString()`이 되는 건 **물려받았기 때문**이에요.
@@K Overriding
override 규칙 정리:

- 이름, 매개변수 목록(시그니처)이 **똑같아야** 해요. 매개변수가 다르면 override가 아니라 **overloading**(새 메서드)이에요.
- 접근 제한자는 **같거나 더 넓게**만: 부모가 `protected`면 자식은 `protected`나 `public`. `private`으로 좁히면 에러.
- `static` 메서드는 override가 안 되고 **hiding**(가려짐)이에요.
- `@Override`를 붙이면 컴파일러가 진짜 override인지 검사해 줘요. 오타로 새 메서드를 만드는 실수를 막아요.
@@K Method calling VS Overriding
메서드를 부르면 Java는 **객체의 실제 클래스부터 위로** 찾아요. `GeometricObject g = new Circle(5); g.getArea();`면 변수 타입이 GeometricObject여도 실제 객체가 Circle이니까 **Circle의 getArea()**가 실행돼요. 이게 다형성(polymorphism)이에요.

절대 아래(자식)로는 안 내려가요. 그래서 부모 타입 변수로는 자식에만 있는 메서드(`getRadius()`)를 **부를 수 없어요**(컴파일 에러). 캐스팅이 필요해요: `((Circle) g).getRadius()`.
@@K How are access Modifiers affected by Inheritance?
접근 제한자 표:

| | 같은 클래스 | 같은 패키지 | 자식 클래스 | 아무데서나 |
| --- | --- | --- | --- | --- |
| `public` | O | O | O | O |
| `protected` | O | O | O | X |
| (없음, default) | O | O | X (다른 패키지) | X |
| `private` | O | X | X | X |

슬라이드 예: Manager(Employee의 자식)는 Employee의 private 메서드만 못 불러요. Customer(자식 아님)는 protected 메서드도 못 불러요.
@@K Final Classes / Methods
`final`의 세 가지 쓰임:

- `final class`: 자식 금지. 대표 예 `String`.
- `final` 메서드: override 금지.
- `final` 변수: 값 변경 금지(상수).

`String`이 final인 이유: 누가 `String`을 상속해서 이상하게 바꾸면 보안, 안정성 문제가 생기니까요.
@@K Abstraction
추상화 = **무엇을 하는지만 보여주고, 어떻게 하는지는 숨기기**. 리모컨의 전원 버튼만 알면 되고 회로는 몰라도 되는 것처럼요. Java에서는 **추상 클래스**와 **인터페이스** 두 가지로 해요.
@@K Concrete class vs Abstract class
은행에 계좌 종류가 4개(SuperSavings, PowerSavings, BusinessChequing, PowerChequing)만 있다면, 그냥 "Account"는 실제로 열 수 없는 개념이에요. 이렇게 **`new`로 만들 수 있으면 concrete**, 만들 수 없게 막아 둔 건 **abstract**예요.
@@K Abstract classes and Abstract Methods
추상 클래스 규칙:

- `abstract class`는 `new` 불가. 반드시 상속해서 써요.
- 추상 메서드(body 없음)와 **일반 메서드, 필드, 생성자**를 다 가질 수 있어요. 생성자는 자식이 `super(...)`로 불러요(그래서 예제는 `protected` 생성자).
- 자식이 추상 메서드를 다 구현하지 않으면 **자식도 abstract**로 선언해야 해요.
@@K An Abstract method
추상 메서드 3대 규칙(슬라이드 그림): **No Body**, **Must be overridden**, **Can't be static**.

- `abstract void someMethod();` 중괄호 대신 세미콜론.
- 추상 메서드가 하나라도 있으면 클래스도 반드시 `abstract`.
- 반대로, 부모가 concrete여도 자식을 abstract로 만들 수 있어요(예: `Object`는 concrete인데 `GeometricObject`는 abstract).
@@K Abstract Method: Why?
추상 메서드는 **"자식들아, 이 메서드는 꼭 만들어"**라는 약속이에요. GeometricObject는 모양을 모르니 넓이 공식을 쓸 수 없지만, "모든 도형은 넓이가 있다"는 건 확실하죠. 그래서 `getArea()`를 추상으로 두면 Circle, Rectangle이 각자 공식을 **반드시** 써야 해요. 안 쓰면 컴파일러가 막아요.
@@K Example: abstract GeometricObject
이제 `GeometricObject`가 abstract라서 `getArea()`를 부모 타입으로 부를 수 있어요. `equalArea(GeometricObject o1, GeometricObject o2)` 같은 메서드가 **어떤 도형이든** 받을 수 있는 이유예요.

예상 출력(Rectangle 5x3): `The area is 15.0`, `The perimeter is 16.0`. 원(반지름 5) 넓이는 78.539...라서 같은 넓이? `false`.

참고: 원래 슬라이드 출력에는 Rectangle 넓이가 `13.0`으로 적혀 있는데, 5 × 3 = **15.0**이 맞아요. 슬라이드 오타예요.

생성자가 `protected`인 이유: 어차피 `new`가 안 되니 **자식만** 부르면 되거든요.
@@K Concrete class or Abstract class?
고르는 기준: 확실하지 않으면 **concrete**로 두세요. 자식들이 가능한 모든 경우를 다 덮는다는 확신이 있을 때만 abstract로. abstract의 장점은 "이 클래스는 직접 만들지 말고 구체적인 자식을 만들어"라고 **사용자에게 강제**하는 것, 그래서 코드가 덜 애매해지는 것이에요.

@@SLIDE week-02-2-interfaces.md
@@S _doc | read
서로 **관계없는 클래스들**(Chicken과 Apple)에게 같은 행동("먹는 법")을 강제하려면? 상속으로는 안 되고 **인터페이스**를 써요. Week 6~8의 Repository, Service가 전부 인터페이스라 꼭 잡고 가세요.
@@S Example: Edible | type
할 일: Edible, Animal, Chicken, Tiger, Fruit, Apple, TestEdible을 쳐서 instanceof와 캐스팅 결과 확인
@@K Outcomes
목표: Java에서 **다중 상속**이 어떻게 처리되는지, **인터페이스**가 무엇인지.
@@K The question
상속은 **같은 줄기**(부모-자식)에서만 공통점을 나눠요. 그런데 Book, WebLink, Movie는 각자 다른 부모를 가질 수 있는데도 "공유할 수 있다(Sharable)"는 공통 행동이 있어요. 줄기가 다른 클래스에 같은 행동을 강제하는 도구가 필요해요.
@@K Multiple Inheritance
Java 클래스는 **부모를 하나만** 가질 수 있어요. 이유는 **Diamond Problem**: B와 C가 둘 다 A를 상속하고 같은 메서드를 각자 override했는데, D가 B와 C를 동시에 상속하면 D에서 그 메서드를 부를 때 B 것인지 C 것인지 모호해요. C++은 허용하지만 Java는 막았어요. 대신 **인터페이스는 여러 개** 구현할 수 있어요.
@@K Interfaces
인터페이스 = **메서드 목록(명세)**. 이걸 implements한 클래스는 그 메서드를 **반드시 써야** 해요.

추상 클래스와 비슷하지만 목적이 달라요. 추상 클래스는 "**무엇인가**"(is-a, 가족), 인터페이스는 "**무엇을 할 수 있나**"(can-do, 능력). 그래서 이름도 `Comparable`, `Edible`, `Cloneable`처럼 **-able**이 많아요.
@@K Interface Definition
인터페이스도 **타입**이에요. `Edible e = new Apple();`처럼 변수 타입으로 쓸 수 있어요. 하지만 `new Edible()`은 안 돼요.

이게 Week 6~7의 핵심이에요: `IUserRepository repo = new InMemoryUserRepository();` 이렇게 **인터페이스 타입 변수**에 구현 객체를 넣으면, 나중에 `MySqlUserRepository`로 바꿔도 나머지 코드는 그대로예요.
@@K Interface Structure
생략된 키워드를 채우면:

```java
public interface Sharable {
    public static final int MAX = 10;     // 필드: 자동으로 public static final (상수)
    public abstract String getItemData(); // 메서드: 자동으로 public abstract
}
```

슬라이드에는 메서드가 "public and static by default"라고 적혀 있는데, 정확히는 **public abstract**예요. 추상 메서드는 static일 수 없어요(Segment 1의 "Can't be static"). 시험에서는 "**메서드는 public abstract, 필드는 public static final**"로 기억하세요.

구현 클래스에서 `public`을 빼먹으면 접근 범위를 **좁힌** 것이 되어 컴파일 에러예요.
@@K Abstract Classes VS Interfaces
| | abstract class | interface |
| --- | --- | --- |
| `new` | 불가 | 불가 |
| 필드 | 일반 필드 가능 | 상수(public static final)만 |
| 메서드 | 추상 + 일반 | 추상 (Java 8부터 `default`, `static` 메서드 가능) |
| 생성자 | 있음 | 없음 |
| 접근 | 아무거나 | 전부 public |
| 개수 | `extends` 하나 | `implements` 여러 개 |
@@K implements
문법: `class Person extends Mammal implements Insurable, Comparable<Person>`. **extends가 먼저, implements가 나중**, 인터페이스는 쉼표로 여러 개.

인터페이스끼리는 `interface A extends B, C`처럼 **extends**를 써요(여러 개 가능).
@@K Example: Edible
출력:

```
Tiger: RROAARR
Chicken: Fry it
Chicken: cock-a-doodle-doo
Apple: Make apple cider
```

포인트:

- 배열 타입이 `Object[]`라서 그대로는 `howToEat()`를 못 불러요. `instanceof`로 확인하고 `(Edible)`로 **캐스팅**해야 해요.
- Tiger는 Edible이 아니라 `howToEat` 줄이 없어요. Apple은 Animal이 아니라 `sound` 줄이 없어요. Chicken만 둘 다.
- `Fruit`는 Edible을 implements했지만 `howToEat()`를 안 써요. **abstract라서 괜찮아요.** 대신 concrete 자식 Apple, Orange가 써야 해요.
@@K Some Common Interfaces of Java API
뒤 주차와 연결해서 외우세요.

- `Comparable<T>`: `compareTo` 하나. Week 3 컬렉션 정렬(`Collections.sort`).
- `Serializable`: 메서드 없는 표시용(marker) 인터페이스. Week 9 객체 파일 저장.
- `Runnable`: `run()`. Week 11 Thread.
- `AutoCloseable`: `close()`. Week 8 JDBC의 try-with-resources.
- `ActionListener`: 버튼 클릭 처리(AWT/Swing). JavaFX에서는 `EventHandler<ActionEvent>`가 같은 역할.

@@TEXT
## 🧩 이번 주 토이 프로젝트: CafeOrder Week 2

CafeOrder의 `MenuItem`을 **abstract class**로 바꾸고 `Drink`, `Food`가 상속하게 해요. 가격 계산 `getPrice()`는 추상 메서드로 두고, `Drink`는 사이즈별 추가 요금을 더해요. 할인 가능 품목에는 `Discountable` 인터페이스를 붙여요. (토이 가이드는 준비 중이에요.)

## ✅ 시험 대비 체크리스트 (Week 2)

- [ ] is-a 관계와 `extends`, private 멤버 상속의 의미를 설명할 수 있다.
- [ ] 생성자는 상속되지 않고, `super(...)`가 첫 줄이어야 하며, 없으면 `super()`가 자동으로 들어간다는 것을 안다.
- [ ] constructor chaining 출력 순서를 예측할 수 있다 (`this(...)` 포함).
- [ ] 부모에 인자 없는 생성자가 없을 때 생기는 컴파일 에러를 찾고 고칠 수 있다.
- [ ] override 규칙(시그니처 동일, 접근 범위 넓히기만, static은 hiding)을 안다.
- [ ] final 클래스, final 메서드의 의미를 안다.
- [ ] abstract 클래스와 abstract 메서드 규칙(No body, Must be overridden, Can't be static)을 안다.
- [ ] 인터페이스 멤버의 기본 키워드(메서드 public abstract, 필드 public static final)를 안다.
- [ ] abstract class와 interface 차이를 표로 말할 수 있다.
- [ ] Java가 다중 상속을 막는 이유(Diamond Problem)를 설명할 수 있다.
- [ ] `instanceof`와 캐스팅으로 인터페이스 메서드를 부를 수 있다.

## ✍️ 손으로 써 보기

1. `abstract class Shape`에 `abstract double area();`와 `public String describe() { return "Area: " + area(); }`를 두고, `Square(double side)`를 만들어 `new Square(3).describe()`가 `Area: 9.0`이 되게 하세요.

<details><summary>1번 예시 답</summary>

```java
abstract class Shape {
    abstract double area();
    public String describe() { return "Area: " + area(); }
}

class Square extends Shape {
    private double side;
    Square(double side) { this.side = side; }
    @Override
    double area() { return side * side; }
}
```

`describe()`는 부모에 있지만, 안에서 부르는 `area()`는 실제 객체(Square)의 것이 실행돼요.

</details>

2. 다음 코드의 출력은?

```java
class A { A() { System.out.print("A "); } }
class B extends A { B() { System.out.print("B "); } }
class C extends B { C() { super(); System.out.print("C "); } }
// main: new C();
```

<details><summary>2번 정답</summary>

`A B C`. 생성자는 맨 위 조상부터 실행돼요.

</details>

3. `interface Payable { double pay(); }`를 만들고, 관계없는 두 클래스 `Employee`와 `Invoice`가 구현하게 한 뒤, `Payable[]` 배열을 돌며 합계를 구하세요.

<details><summary>3번 예시 답</summary>

```java
interface Payable { double pay(); }

class Employee implements Payable {
    public double pay() { return 1000; }   // public 필수
}

class Invoice implements Payable {
    public double pay() { return 250.5; }
}

Payable[] items = { new Employee(), new Invoice() };
double total = 0;
for (Payable p : items) total += p.pay();
System.out.println(total);   // 1250.5
```

</details>
