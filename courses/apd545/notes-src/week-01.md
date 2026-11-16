# Week 1. Java 입문, Java와 C++, MVC 패턴

> **읽는 법**: 📑 표시는 교수님 슬라이드의 핵심 문장(영어 원문 그대로 짧게 발췌)이고, 바로 아래 **🇰🇷 한글 해설**이 이어져요. 슬라이드 전체는 Blackboard PDF에 있어요. 💻 표시는 교수님 샘플 코드(`WK_1_LE_Ex`)예요. Java 코드는 브라우저에서 못 돌리니까 ⌨️ 표시가 있는 코드는 **IntelliJ에서 직접** 쳐 보세요.

## 0. 이번 주 한눈에 보기

| 개념 | 한 줄 정리 | 시험에 나오는 모양 |
| --- | --- | --- |
| JVM | `.java` → `javac` → `.class`(bytecode) → JVM이 실행 | "Java bytecode can only run in the JVM" |
| WORA | Write Once Run Anywhere. JVM만 있으면 OS 상관없이 실행 | Platform Independent의 뜻 |
| Garbage Collector | Java에는 `delete`, 소멸자가 없음. 안 쓰는 객체는 GC가 치움 | "How does Java delete the DMA?" → Garbage Collected |
| Java vs C++ | 모든 코드는 클래스 안, 클래스 끝에 `;` 없음, `extends`, `super(...)` | 문법 차이 고르기 |
| static | 클래스 하나에 하나만 있는 멤버. 객체 없이 `클래스명.멤버`로 접근 | static 메서드는 `this` 못 씀 |
| MVC | Model = 데이터와 규칙, View = 보여주기, Controller = 입력 처리와 연결 | "view never has to know how data is stored" |
| Code Conventions | 클래스 `PascalCase`, 메서드/변수 `camelCase`, 상수 `UPPER_CASE`, 패키지 소문자 | 이름 고르기 |

**함정 모음**

- Java의 `boolean`은 슬라이드 표에 **1 bit**, `char`는 **2 bytes**(유니코드). C++의 `char` 1 byte와 다르다.
- Java 클래스 정의 끝에는 `;`가 **없다**. C++은 `};`.
- `Polygon p = new Polygon(4,5);`는 `Polygon`이 **abstract**면 컴파일 에러.
- static 메서드 안에서 `this`, `super`, 인스턴스 필드는 못 쓴다.
- MVC에서 **계산은 Controller**(슬라이드 기준). View에 계산을 넣으면 틀린 답.

{{PRACTICE}}

{{TOC}}

@@SLIDE week-01-1-intro-java.md
@@S _doc | read
Java가 어떤 언어인지, 그리고 `.java` 파일이 어떻게 실행되는지(컴파일 → bytecode → JVM) 큰 그림을 잡는 챕터예요. 시험에는 JVM, bytecode, WORA, Java 에디션 이름이 주로 나와요.
@@K Outcomes
이번 세그먼트의 목표는 세 가지예요. (1) Java가 어떤 언어인지, (2) **JVM**이 무엇을 하는지, (3) **Garbage Collector**가 무엇인지. C++에서 `new` 하고 `delete` 했던 것을 기억하죠? Java에서는 `delete`가 없고 GC가 대신 치워 줘요. 이게 이번 주 가장 큰 차이점이에요.
@@K What is Java?
Java를 네 단어로 정리한 슬라이드예요. 시험에 그대로 나올 수 있으니 영어 단어 그대로 외워 두세요.

- **General Purpose**: 게임, 서버, 데스크톱 앱 등 한 분야에 묶이지 않는 범용 언어.
- **Object Oriented**: 클래스와 객체로 현실 세계를 표현.
- **Platform Independent (WORA)**: 한 번 쓰면(Write Once) 어디서나 실행(Run Anywhere). 비결은 아래에 나오는 JVM.
- **Concurrent**: 여러 스레드를 동시에 돌릴 수 있음 (Week 11 Threads에서 자세히).
@@K Why is Java such a Popular Language?
인기 있는 이유 목록이에요. 외울 필요는 크지 않지만 **Platform Independent**(Windows, Linux, Android에서 다시 안 고치고 실행)와 **Security**(네트워크로 받은 코드를 안전한 환경에서 실행) 두 가지는 다른 문제의 근거로도 쓰여요.
@@K How does Java Work? The Platform
Java를 쓰려면 두 가지를 알아야 한다는 말이에요.

- **Java language와 API**: 내가 코드를 쓰는 쪽(front-end). 문법 + 미리 만들어진 라이브러리.
- **JVM**: 내 코드와 실제 하드웨어 사이(back-end).

비유하면, 나는 한국어(Java)로 편지를 쓰고, 통역사(JVM)가 각 나라 말(Windows, Mac, Linux 기계어)로 바꿔 주는 구조예요.
@@K Java API
API는 "미리 만들어 둔 Java 프로그램 부품"이에요. 날짜 구하기, 수학 계산, 문자열 처리 같은 걸 매번 직접 만들지 않고 가져다 써요. 예: `Math.max(3, 7)`, `String.format(...)`, `java.util.Scanner`. 우리가 쓰는 코드는 대부분 **내가 새로 쓴 코드 + API 코드**의 조합이에요.
@@K JVM (Java Virtual Machine)
JVM은 Java 플랫폼과 하드웨어 사이의 **추가 추상화 계층**이에요. 그래서 "JVM이 설치된 기계에서만 Java가 실행된다"는 말이 나와요. 거꾸로 말하면 JVM만 깔려 있으면 Windows든 Mac이든 같은 `.class` 파일이 그대로 돌아요. 이게 WORA의 비밀이에요.
@@K Compilers vs Interpreters
두 방식 비교예요.

- **컴파일러**: 프로그램 전체를 먼저 기계어로 바꾼 다음 실행. (C, C++)
- **인터프리터**: 한 줄씩 그때그때 기계어로 바꿔 실행. (Python 같은 방식)

슬라이드의 Question Time "Is C++ an Interpreted Language?"의 답은 **No**예요. C++은 컴파일 언어예요.
@@K Java Runtime Environment
Java는 위 두 방식을 **둘 다** 써요. 시험 단골 흐름이니 순서대로 외우세요.

1. `Hello.java`를 **컴파일**해서 `Hello.class`(**bytecode**)를 만든다.
2. bytecode는 **JVM 안에서만** 실행된다.
3. JVM이 bytecode를 **인터프리트**해서 그 OS에 맞게 실행한다.

참고로 슬라이드에 "The Java code compiler is called the Java Virtual Machine"이라는 문장이 있는데, 정확히는 컴파일러는 `javac`이고 JVM은 실행기예요. 시험에 슬라이드 문장 그대로 나오면 슬라이드 표현을 따르되, 개념은 "javac가 컴파일, JVM이 실행"으로 이해해 두세요.
@@K Java Editions
에디션 세 개의 이름과 용도를 짝지어 외우세요.

| 에디션 | 용도 |
| --- | --- |
| **JSE** (Standard) | 데스크톱(client-side) 앱. **이 수업에서 쓰는 것** |
| **JEE** (Enterprise) | 서버(server-side) 앱. Servlet, JSP, JSF |
| **JME** (Micro) | 모바일, 작은 기기 |
@@K Steps to Use Java SE
실행 단계예요. 명령어 두 개가 핵심이에요.

```bash
javac HelloWorld.java   # 컴파일 → HelloWorld.class 생성
java HelloWorld         # JVM이 실행 (.class는 안 붙임)
```

JVM은 실행 전에 bytecode가 올바른지 **검증**(Bytecode Verification, Integrity Check)하고, 마지막에 **main**부터 실행을 시작해요. IntelliJ의 초록 ▶ 버튼이 이 두 명령을 대신 눌러 주는 거예요.

@@SLIDE week-01-2-java-cpp-similar.md
@@S _doc | read
C++을 배운 사람 입장에서 "Java도 똑같은 것"을 빠르게 훑는 챕터예요. 문법, 반복문, 연산자, OOP 네 기둥, static, for-each, 제네릭. 다른 점만 조심하면 돼요.
@@S Syntax and Comments | type
할 일: Hello.java를 만들어 main 실행해 보기
C++의 `int main()`이 Java에서는 클래스 안의 `public static void main(String[] args)`로 바뀌어요.
@@S Inheritance | type
할 일: Vehicle/Car 상속 예제 실행해 보기
`extends`로 부모의 `brand`와 `honk()`를 물려받아요.
@@S Polymorphism | type
할 일: Animal 타입 변수에 Cat, Dog 넣고 animalSound() 호출해 보기
같은 메서드 호출이 실제 객체에 따라 다르게 동작해요.
@@K Syntax and Comments
C++과 거의 같아요. 다른 점은 딱 하나, **모든 코드가 클래스 안에 있어야 한다**는 것. C++처럼 클래스 밖에 함수를 둘 수 없어요.

- `public static void main(String[] args)`: 프로그램 시작점. `static`이라서 객체를 만들지 않고도 JVM이 바로 부를 수 있어요.
- `System.out.print`: 줄바꿈 없음, `System.out.println`: 줄바꿈 있음. C++의 `cout <<`에 해당.
- 주석 `//`, `/* */`은 C++과 같아요.
@@K Loops, Conditionals and Operators
`for`, `while`, `do while`, `if/else`, `switch`, 산술 연산자, 비교 연산자 모두 C++과 똑같아요. 하나만 주의: Java의 `if` 조건은 **boolean만** 돼요. C++처럼 `if (x)`에 int를 넣으면 컴파일 에러예요. `if (x != 0)`처럼 써야 해요.
@@K Basic Data Types
Java 기본 타입 8개와 크기예요. 시험에 크기를 묻는 문제가 나올 수 있어요.

- `byte` 1, `short` 2, `int` 4, `long` 8, `float` 4, `double` 8 (바이트)
- `char`는 **2 bytes** (유니코드라서 한글도 한 글자). C++은 1 byte.
- `boolean`은 슬라이드 기준 **1 bit**. 값은 `true`/`false`만, 0/1로 못 바꿔요.

Java는 OS와 상관없이 `int`가 항상 4 bytes예요. C++은 기계마다 2 또는 4 bytes일 수 있었죠. 이것도 플랫폼 독립성의 한 부분이에요.
@@K Keywords and Multithreading
`break, continue, new, public, private, return, static` 같은 키워드는 같은 뜻이에요. 두 언어 모두 멀티스레드를 지원한다는 것도 기억하세요 (Week 11).
@@K Object Oriented Programming
OOP 네 기둥은 무조건 외우기: **Inheritance(상속), Polymorphism(다형성), Abstraction(추상화), Encapsulation(캡슐화)**.

슬라이드 Question Time "Choose the OOP characteristics" 보기 중 Operator Overloading, Function Overriding, Modularity는 정답이 **아니에요**. 정답은 위 네 개뿐이에요. (참고로 Java는 연산자 오버로딩을 아예 지원하지 않아요.)
@@K Inheritance
`class Car extends Vehicle`: Car가 Vehicle의 필드와 메서드를 물려받아요. C++의 `class Car : public Vehicle`과 같은 뜻.

- `protected String brand`: 자식 클래스에서 접근 가능.
- `myCar.honk()`: Car에 `honk()`를 안 썼는데도 부르는 게 돼요. 부모 것이니까요.
- Java는 클래스 상속이 **하나만** 돼요(단일 상속). 여러 개를 받고 싶으면 Week 2의 interface를 써요.
@@K Polymorphism
`Animal myCat = new Cat();` 이 한 줄이 다형성의 핵심이에요. 변수 타입은 `Animal`인데 실제 객체는 `Cat`이에요. `myCat.animalSound()`를 부르면 **실제 객체(Cat)의 메서드**가 실행돼서 "The cat says: Meo Meo"가 나와요.

C++에서는 부모 메서드에 `virtual`을 붙여야 이렇게 동작했죠. **Java는 기본이 virtual**이라서 아무것도 안 붙여도 돼요. 출력 순서: `The animal makes a sound` → `The cat says: Meo Meo` → `The dog says: bow wow`.
@@K Abstraction
`abstract` 메서드는 **몸통(body)이 없는** 메서드예요. "동물은 소리를 낸다, 근데 무슨 소리인지는 자식이 정해"라는 뜻이에요.

- abstract 메서드가 하나라도 있으면 클래스도 `abstract class`여야 해요.
- abstract 클래스는 `new Animal()`로 직접 객체를 만들 수 **없어요**.
- 일반 메서드(`sleep()`)는 같이 가질 수 있어요. 이게 Week 2의 interface와 다른 점이에요.
@@K Encapsulation
필드는 `private`로 숨기고, 밖에서는 **getter/setter**로만 접근하게 하는 것이에요. 왜? setter 안에서 "이름은 빈 문자열 안 됨" 같은 규칙을 지킬 수 있으니까요. 토이 프로젝트 `MenuItem.setPrice()`에서 음수 가격을 막는 게 바로 이거예요.
@@K Static Keyword
`static`은 "객체마다 하나"가 아니라 "**클래스에 하나**"라는 뜻이에요.

```java
class Counter {
    static int count = 0;      // 모든 객체가 공유
    int id;                    // 객체마다 따로
    Counter() { count++; id = count; }
    static void show() {
        System.out.println(count);   // OK: static 데이터
        // System.out.println(id);   // 에러: static 메서드는 인스턴스 필드 못 씀
        // this.id                   // 에러: static 메서드에는 this가 없음
    }
}
// Counter.show();  ← 객체 없이 클래스 이름으로 호출
```

규칙 세 개(static 메서드는 static만 부르고, static 데이터만 쓰고, `this`/`super`를 못 씀)가 시험에 그대로 나와요.
@@K ForEach
`for (var x : arr)`는 "arr의 원소를 하나씩 x에 넣으면서 반복"이에요. 인덱스가 필요 없을 때 써요. `var`는 타입을 컴파일러가 알아서 추론하는 키워드(여기서는 `int`). 출력: `10 20 30 40 `. Week 3에서 ArrayList를 돌 때도 똑같이 써요.
@@K Templates vs Generics
C++의 template에 해당하는 게 Java의 **generics**예요. `GenericClass<T>`의 `T` 자리에 `String`, `Integer` 같은 타입을 넣어요. 주의: Java 제네릭에는 `int` 같은 **기본 타입을 못 넣어요**. 그래서 `Integer`(wrapper 클래스)를 써요. 출력은 `Type:String`, `Value: Generics vs Templates`, `Type:Integer`, `Value: 9`. Week 3 Segment 3에서 자세히 배워요.

@@SLIDE week-01-3-java-cpp-diff.md
@@S _doc | read
이번엔 "C++과 다른 점"이에요. 클래스 정의 모양, main 위치, `super`, 소멸자 없음(GC), abstract, static block. 시험에서 "Java에 맞는 것을 고르라"는 문제의 근거가 되는 챕터예요.
@@S main is inside the class | type
할 일: CRectangle 클래스와 main을 한 파일에 쳐서 넓이 출력하기
@@S Inheritance and Polymorphism | type
할 일: Polygon, Rectangle, Triangle, PolyTest 네 파일 만들어 실행하기
@@K Class Definitions
C++과 다른 점 세 가지만 기억하세요.

1. 클래스 끝에 **`;` 없음**.
2. `public:` 같은 구역 표시 대신 **멤버마다** `private`, `public`을 붙여요.
3. **소멸자(destructor)가 없어요.** `~CRectangle()` 같은 건 Java에 없어요. 메모리는 GC가 정리해요.

또 C++처럼 클래스 안에 선언만 하고 밖에서 `CRectangle::CRectangle(...)`으로 정의하는 방식도 없어요. Java는 메서드 몸통을 항상 클래스 안에 바로 써요.
@@K main is inside the class
C++에서는 `main`이 클래스 밖에 있었지만 Java는 **클래스 안**에 있어요. 그리고 객체는 항상 `new`로 만들어요.

- C++: `CRectangle rectA(3,4);` (스택에 객체)
- Java: `CRectangle rectA = new CRectangle(3, 4);` (힙에 객체, `rectA`는 그 객체를 가리키는 참조)

Java에는 포인터 문법(`*`, `->`)이 없어요. 대신 모든 객체 변수가 참조라서 `.`으로 접근해요. 출력: `rectA area: 12`, `rectB area: 30`.
@@K Inheritance and Polymorphism
C++ ↔ Java 대응표예요.

| C++ | Java |
| --- | --- |
| `class CRectangle: public CPolygon` | `class Rectangle extends Polygon` |
| `CRectangle(int a,int b): CPolygon(a,b) {}` | `public Rectangle(int a,int b) { super(a,b); }` |
| `virtual int area()` | 그냥 `public int area()` (기본이 virtual) |
| `CPolygon* rect = new CRectangle(4,5);` | `Polygon rect = new Rectangle(4,5);` |

`super(a, b)`는 **생성자 첫 줄**에 있어야 해요. 출력은 `20`, `10`. Java는 보통 **public 클래스 하나당 파일 하나**라서 슬라이드도 Polygon.java, Rectangle.java 식으로 나눠요.
@@K Question Time: How does Java delete the DMA?
DMA는 Dynamic Memory Allocation(동적 할당한 메모리)이에요. 정답은 **Garbage Collected**. Java에는 `delete` 키워드도, 소멸자도 없어요. 어떤 객체를 가리키는 변수가 하나도 없어지면 GC가 알아서 그 메모리를 회수해요.

```java
CRectangle r = new CRectangle(3, 4);
r = null;   // 이제 아무도 이 객체를 안 가리킴 → GC 대상
```
@@K Pure Virtual vs Abstract classes
C++의 순수 가상 함수 `virtual int area() = 0;` ↔ Java의 `public abstract int area();`. 둘 다 "몸통 없는 메서드", 그리고 그걸 가진 클래스는 **객체를 직접 만들 수 없어요**. 그래서 슬라이드에 `// illegal: Polygon poly = new Polygon(4,5);`라고 주석 처리돼 있어요. 하지만 `Polygon rect = new Rectangle(4,5);`처럼 **변수 타입**으로는 쓸 수 있어요.
@@K Static Block and Static Local Variable
- **static block**: Java에만 있음. 클래스가 처음 로드될 때 **딱 한 번** 실행돼요.

```java
class Config {
    static int max;
    static {                 // static block
        max = 100;
        System.out.println("loaded once");
    }
}
```

- **static 지역 변수**: C++에만 있음. Java에서는 메서드 안에 `static int x;`를 쓰면 **컴파일 에러**예요. 함수 호출 사이에 값을 유지하고 싶으면 static 필드를 써야 해요.
@@K Exception Handling
슬라이드에는 제목만 있어서 기본을 정리했어요. Java 예외 처리는 C++과 모양이 비슷하지만 더 엄격해요.

```java
try {
    int n = Integer.parseInt("abc");      // NumberFormatException 발생
} catch (NumberFormatException e) {
    System.out.println("숫자가 아니에요: " + e.getMessage());
} finally {
    System.out.println("항상 실행");        // 예외가 나든 안 나든
}
```

- C++은 아무 값(int 등)이나 throw할 수 있지만, Java는 `Throwable`을 상속한 **객체만** throw해요.
- Java에는 **`finally`**가 있어요 (C++에는 없음).
- **checked exception**(예: `IOException`)은 반드시 `try/catch` 하거나 메서드에 `throws`를 써야 컴파일돼요. Week 8 JDBC(`SQLException`), Week 9 파일 IO에서 계속 나와요.
- 토이 프로젝트 `CafeView.readInt()`가 `NumberFormatException`을 잡아서 "Please type a number."를 보여 주는 게 실제 예시예요.

@@SLIDE week-01-4-mvc.md
@@S _doc | read
이 수업 전체를 관통하는 **MVC 패턴**의 시작이에요. Week 4~7의 JavaFX 앱, Workshop, 프로젝트 모두 이 구조로 만들어요. Model, View, Controller 각각의 역할 문장을 정확히 외우는 게 목표예요.
@@S Main.java | type
할 일: Employee, EmployeeView, EmployeeController, MVCMain 네 클래스를 만들어 실행하기
@@K What is Design Pattern?
디자인 패턴은 "자주 나오는 설계 문제에 대한 검증된 해결 방법"이에요. 연결 리스트 같은 **자료구조 코드도 아니고**, 앱 전체 설계도도 아니에요. "어떤 클래스들이 어떤 역할로 서로 대화하는지"를 설명한 것이에요.

슬라이드 Question Time "Why we need Design Pattern?"의 정답은 **Can accelerate development process**(개발을 빠르게 해 줌)예요. "GC를 관리한다", "그냥 재미로"는 오답.
@@K What is MVC?
MVC = 앱을 **세 덩어리**로 나누는 디자인 패턴. 카페로 비유하면:

- **Model** = 창고와 가격표 (데이터와 규칙)
- **View** = 메뉴판과 카운터 화면 (보여주기)
- **Controller** = 직원 (주문 받고, 창고 확인하고, 화면에 알려줌)
@@K What is Model in MVC?
Model은 **앱의 데이터**를 관리해요. 가장 중요한 단어는 **agnostic**: Model은 데이터가 화면에 어떻게 보이는지 전혀 몰라요. 그래서 Model 안에 `System.out.println`이나 버튼 코드가 있으면 안 돼요.

Employee 클래스는 private 필드 + getter/setter만 있는 전형적인 Model이에요. 그리고 "Model 만들기가 MVC 프로젝트의 **첫 단계**"라는 문장도 기억하세요. Week 5에서도 Model을 먼저 만들고 테스트한 다음 View를 만들어요.
@@K Why use MVC Design Pattern?
장점: 각 부분을 **따로** 고칠 수 있고(앱 전체를 망가뜨리지 않음), 새 기능 추가가 쉽고, **테스트가 쉬워지고**, 더 좋은 UI를 만들 수 있어요. 예를 들어 Week 4에서 콘솔 View를 JavaFX 화면으로 바꿔도 Model은 그대로예요.
@@K What is View in MVC?
View는 데이터와 **입력 요소**(버튼, 체크박스, 메뉴 등)를 사용자에게 보여주는 부분이에요. 같은 Model을 여러 View로 보여줄 수 있어요: PC 프로그램, 모바일 앱, 웹페이지. `EmployeeView`는 값을 **받아서 출력만** 해요. 계산도 없고 Employee 객체를 직접 바꾸지도 않아요.
@@K What is Controller in MVC?
Controller 문장 네 개가 시험 단골이에요.

1. 사용자 입력을 처리하고 View에 필요한 데이터를 준비한다.
2. **View는 데이터가 어떻게 저장되고 가져와지는지(DB 등) 절대 알 필요가 없다.**
3. 사용자 입력이 다음에 할 일을 정하니까, Controller가 **application logic**을 가진다.
4. **모든 계산과 데이터 변환은 Controller에서** 한다.

`EmployeeController`는 생성자로 model과 view를 **둘 다 받아서** 들고 있어요. M과 V를 둘 다 아는 건 Controller뿐이에요. `updateView()`는 Model에서 값을 꺼내 View에 넘겨줘요.

(Week 3에서 "계산은 Service Layer로 옮긴다"는 내용이 나오는데, Week 1 슬라이드 기준 답은 Controller예요.)
@@K Main.java
`main`은 M, V, C를 **만들고 연결만** 해요.

1. Model 준비 (DB에서 가져왔다고 가정)
2. View 생성
3. Controller에 둘 다 넘김 → `updateView()`로 출력
4. `controller.setEmployeeName("Frank")`로 **Controller를 통해** Model을 바꾸고 다시 `updateView()`

출력:

```text
Employee Details: 
Name: Joe
Employee ID: 11

 Employee Details after updating: 
Employee Details: 
Name: Frank
Employee ID: 11
```

`main`이 직접 `model.setName()`을 부르지 않고 Controller를 거친다는 점이 포인트예요. 이 "누가 객체를 만들어서 넘겨주나"가 Week 6~7의 **Dependency Injection, IoC**로 발전해요.
@@K MVC in Java, in one sentence each
마지막 정리 슬라이드예요. 한 줄씩 외워 두세요.

- **model**: 메모리에 있는 앱의 **상태(state)**.
- **view**: model 값을 보여주고, 사용자 동작을 **controller에게 전달**.
- **controller**: model 데이터를 준비하고, 입력을 처리해 model 값을 바꾸고, **다음에 보여줄 view를 결정**.

@@SLIDE week-01-5-code-conventions.md
@@S _doc | skim
Java 코드 작성 규칙 문서예요. 전부 외울 필요는 없고 **이름 규칙 표**만 확실히 알면 돼요. 과제 채점에서도 이름 규칙을 봐요.
@@K Why Have Code Conventions
소프트웨어 비용의 **80%가 유지보수**이고, 대부분 원래 작성자가 아닌 사람이 유지보수해요. 그래서 모두 같은 규칙으로 써야 남이 빨리 읽을 수 있어요.
@@K File Names and Organization
- 파일 하나에 **public 클래스(또는 인터페이스) 하나**, 그리고 파일 이름 = public 클래스 이름 (`Employee.java` 안에 `public class Employee`). 이건 규칙이 아니라 **컴파일러가 강제**해요.
- 파일 순서: 맨 위 주석 → `package` → `import` → 클래스.
- 2000줄 넘는 파일은 피하기.
@@K Order inside a Class
클래스 안 순서: **static 변수 → 인스턴스 변수 → 생성자 → 메서드**. 변수는 public → protected → (package) → private 순서. 메서드는 접근 제어자가 아니라 **기능별로** 묶어요. Workshop 코드도 이 순서로 쓰면 깔끔해 보여요.
@@K Indentation and Line Length
들여쓰기 **4칸**, 한 줄 **80자** 이내, 줄을 나눌 때는 **쉼표 뒤**, **연산자 앞**에서 끊어요. IntelliJ에서 `Cmd + Option + L`(Mac) 하면 자동 정렬돼요.
@@K Naming Conventions
이 표가 이번 문서의 핵심이에요.

| 종류 | 규칙 | 예 |
| --- | --- | --- |
| 패키지 | 전부 소문자 | `ca.senecacollege.models` |
| 클래스, 인터페이스 | **명사**, PascalCase | `MenuItem`, `IPersonAction` |
| 메서드 | **동사**, camelCase | `getName()`, `calculateSubtotal()` |
| 변수 | camelCase, 짧고 뜻이 보이게 | `myWidth`, `quantity` |
| 상수 | 전부 대문자 + `_` | `static final double TAX_RATE = 0.13;` |

변수 이름을 `_`나 `$`로 시작하지 않기. `i, j, k` 같은 한 글자는 반복문 임시 변수에만.

@@IN week-01-school-mvc.md
@@S _doc | type
교수님이 수업 시간에 보여 준 샘플 프로젝트예요. 슬라이드의 상속, abstract, interface, MVC가 **한 프로젝트에 다 들어 있어요**. 패키지 나누는 방식(`models / views / controllers`)도 이 샘플을 따라 하면 돼요.
@@S Example: Abstract base class Person | type
할 일: Person, Staff, Student, Teacher를 패키지 나눠서 만들기
@@S Example: TestMain (wiring M, V, C) | type
할 일: SchoolView, SchoolController, TestMain까지 만들어 실행 결과 확인하기
@@K Project Structure
패키지(폴더) 이름만 봐도 역할이 보이게 나눴어요. `abstracts`(추상 클래스), `models`(실제 데이터 클래스), `interfaces`, `views`, `controllers`, `tester`(main). 패키지 이름은 **회사 도메인을 거꾸로**(`ca.senecacollege`) 시작하는 게 관례예요. IntelliJ에서 `src` 우클릭 → New → Package.
@@K Example: Packages and import (TestClass, MyClass)
다른 패키지의 클래스를 쓰려면 `import 패키지.클래스;`가 필요해요. 그리고 그 클래스와 메서드가 **public**이어야 밖에서 보여요.

눈여겨볼 점: `static void main()`에 `public`도 없고 `String[] args`도 없어요. 이건 **Java 25부터 새로 된 문법**(instance main methods)이라서 교수님 IntelliJ의 최신 JDK에서는 실행돼요. 시험이나 옛날 JDK에서는 전통적인 `public static void main(String[] args)`를 쓰는 게 안전해요.
@@K Example: Abstract base class Person
`Person`은 abstract 클래스예요. 공통 필드(name, age), getter/setter, 공통 메서드 `greet()`는 여기 두고, 사람마다 다른 `getDetails()`는 **abstract**로 남겨서 자식이 꼭 만들게 해요. `new Person(...)`은 안 되지만 `Person p = new Student(...)`는 돼요.
@@K Example: Staff, Student, Teacher (models)
상속이 두 단계예요: `Person` ← `Staff` ← `Teacher`, 그리고 `Person` ← `Student`.

- 모든 자식 생성자의 첫 줄이 `super(...)`예요. 부모 필드는 private이라 자식이 직접 못 넣고 부모 생성자에게 맡겨요.
- `Staff`도 **abstract**예요. 그래서 `getDetails()`를 구현했지만 `new Staff(...)`는 못 해요.
- `Teacher.getDetails()`의 `super.getDetails() + ", Subject: " + subject`: 부모 결과("Department Name: Mathematics")에 **덧붙이는** 오버라이드 패턴이에요.
- `@Override`는 "부모 메서드를 덮어쓴다"는 표시. 철자를 틀리면 컴파일러가 잡아 줘요. 꼭 붙이는 습관을 들이세요.
@@K Example: Functional interface IPersonAction
**추상 메서드가 딱 하나**인 인터페이스를 functional interface라고 해요. `@FunctionalInterface`를 붙이면 컴파일러가 "하나만 있는지" 검사해 줘요. 이런 인터페이스는 **람다**로 구현할 수 있어요 (아래 TestMain). 람다는 Week 10에서 본격적으로 배우지만, 교수님이 Week 1부터 맛보기로 보여 줬어요.
@@K Example: View and Controller
`SchoolView`는 받은 문자열과 숫자를 **출력만** 해요. `SchoolController`는 Model(Person)에서 값을 꺼내 View에 넘겨줘요. 슬라이드의 EmployeeView/EmployeeController와 똑같은 구조예요.

- `person.getClass().getSimpleName()`: 실제 객체의 클래스 이름("Student", "Teacher")을 문자열로 줘요. 변수 타입이 `Person`이어도 실제 객체 이름이 나와요 (다형성).
- `person.getDetails()`: 실제 객체의 오버라이드된 메서드가 불려요.
- `performPersonRole(Person p, IPersonAction action)`: "무엇을 할지"를 **매개변수로** 받아요. 행동을 값처럼 넘기는 거예요.
@@K Example: TestMain (wiring M, V, C)
순서: View 만들기 → Controller에 View 넘기기 → Model 만들기 → Controller에게 일 시키기. 출력:

```text
Details of the Student:
Name: Alice
Age: 21
Student ID: S1234

Details of the Teacher:
Name: Bob
Age: 32
Department Name: Mathematics,  Subject: Calculus - 1

Alice is studying
Bob is teachingCalculus - 1
```

- 람다 `(person) -> person.getName() + " is studying"`는 `IPersonAction`의 `performRole`을 한 줄로 구현한 거예요.
- `(Teacher) person`: `Person` 타입을 `Teacher`로 **다운캐스팅**. 실제 객체가 Teacher가 아니면 실행 중 `ClassCastException`이 나요.
- 마지막 줄 "teachingCalculus"처럼 띄어쓰기가 붙어 나오는 건 원본 코드에 공백이 빠져서예요. 시험에서 출력 예측 문제로 나오면 이런 것까지 봐야 해요.

@@TEXT
## 🧩 이번 주 토이 프로젝트: CafeOrder Week 1

콘솔에서 메뉴를 고르고 영수증(세금 13%)을 출력하는 카페 주문 프로그램을 **MVC로 나눠서** 만들어요. `MenuItem`(Model), `CafeView`(View), `CafeController`(Controller), `CafeApp`(main). 가이드와 정답 코드는 사이트의 토이 프로젝트 메뉴에 있어요.

## ✅ 시험 대비 체크리스트

- [ ] `javac` → `.class`(bytecode) → `java`(JVM) 흐름을 설명할 수 있다.
- [ ] WORA, JSE/JEE/JME를 설명할 수 있다.
- [ ] Java 기본 타입 8개와 크기(`char` 2 bytes, `boolean` 1 bit)를 안다.
- [ ] Java는 소멸자가 없고 GC가 메모리를 회수한다는 것을 안다.
- [ ] `extends`, `super(...)`, `@Override`, `abstract`를 C++과 비교해 설명할 수 있다.
- [ ] static 메서드가 할 수 없는 것 세 가지를 안다.
- [ ] MVC 각 역할 문장을 영어로 말할 수 있다. 특히 "view never has to know how data is stored", "calculation happens in the controller".
- [ ] 이름 규칙(패키지, 클래스, 메서드, 변수, 상수)을 고를 수 있다.

## ✍️ 손으로 써 보기

종이에 먼저 쓰고 IntelliJ로 확인하세요.

1. 아래 출력이 나오는 `Book`(Model), `BookView`(View), `BookController`(Controller), `BookApp`(main)을 써 보세요. 가격 setter는 음수를 막아야 해요.

```text
Book: Clean Code ($45.00)
Book: Clean Code ($39.99)
```

2. 다음 코드의 출력은?

```java
abstract class Shape {
    abstract double area();
    public String toString() { return getClass().getSimpleName() + " " + area(); }
}
class Square extends Shape {
    double s;
    Square(double s) { this.s = s; }
    double area() { return s * s; }
}
public class Q2 {
    public static void main(String[] args) {
        Shape sh = new Square(3);
        System.out.println(sh);
    }
}
```

<details><summary>2번 정답</summary>

`Square 9.0`. `println(sh)`는 `sh.toString()`을 부르고, `getClass()`는 실제 객체(Square)를, `area()`는 Square의 오버라이드를 불러요. `double`이라 `9`가 아니라 `9.0`.

</details>

3. 아래 코드에서 컴파일 에러가 나는 줄을 모두 찾으세요.

```java
public class Counter {
    static int total;
    int mine;
    static void report() {
        System.out.println(total);   // (a)
        System.out.println(mine);    // (b)
        System.out.println(this);    // (c)
    }
}
```

<details><summary>3번 정답</summary>

(b), (c). static 메서드는 인스턴스 필드(`mine`)와 `this`를 쓸 수 없어요. (a)는 static 필드라 OK.

</details>
