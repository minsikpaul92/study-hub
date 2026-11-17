# Week 12. 디자인 패턴: Factory, Decorator, Observer

> **읽는 법**: 📑 표시는 교수님 슬라이드의 핵심 문장(영어 원문 그대로 짧게 발췌)이고, 바로 아래 **🇰🇷 한글 해설**이 이어져요. 이번 주 슬라이드는 개념 위주라 코드가 거의 없어서, 피자 앱 예시 코드는 슬라이드 개념대로 **해설용으로 새로 쓴 것**이에요(직접 돌려 확인했어요). ⌨️ 표시가 있는 코드는 IntelliJ에서 직접 쳐 보세요.
>
> 사실 세 패턴 모두 이미 써 봤어요. Factory는 Week 11의 `Executors.newFixedThreadPool()`, Decorator는 Week 9의 `new BufferedReader(new FileReader(...))`, Observer는 Week 10의 `property.addListener(...)`와 Week 4의 `setOnAction`.

## 0. 이번 주 한눈에 보기

| 패턴 | 한 줄 정리 | 핵심 원칙 | 이미 본 예 |
| --- | --- | --- | --- |
| **Factory** | 객체 **생성**을 전용 클래스에 맡김 | `new`를 한 곳에 모아 결합도 낮추기 | `Executors.newFixedThreadPool`, `FXMLLoader.load` |
| **Decorator** | 객체를 **감싸서** 기능 추가(런타임) | 상속보다 조합, **Open for Extension, Closed for Modification** | `BufferedReader(new FileReader())` |
| **Observer** | Subject가 바뀌면 Observer들에게 **자동 알림** | **Loose Coupling**, 1 대 다 | `addListener`, `setOnAction` |

**함정 모음**

- Factory의 목적은 "객체를 만든다"가 아니라 **"만드는 코드를 한 곳으로 모아서, 쓰는 쪽이 구체 클래스를 몰라도 되게"** 하는 것.
- Decorator는 감싸는 대상과 **같은 인터페이스**를 구현해야 해요. 그래야 감싼 것을 또 감쌀 수 있어요.
- Decorator는 상속(컴파일 시점 고정)의 대안. 토핑 조합마다 클래스를 만드는 것 = **Class Explosion**.
- Observer에서 Subject는 Observer가 **누구인지 몰라요**. 인터페이스 목록만 갖고 있어요.
- Observer는 1 대 **다**(one-to-many). 하나의 Subject, 여러 Observer.

{{PRACTICE}}

{{TOC}}

@@SLIDE week-12-1-design-patterns.md
@@S _doc | read
피자 주문 앱 하나로 세 가지 디자인 패턴을 봐요. **Factory**로 기본 피자를 만들고, **Decorator**로 토핑을 얹고, **Observer**로 주방 화면에 알려요.
@@S A Scalable Pizza App | type
할 일: Pizza 인터페이스와 Margherita, Pepperoni 두 구현 클래스를 만들기 (아래 세 패턴이 모두 이걸 써요)
@@S Factory with Map of Supplier | type
할 일: PizzaFactory를 Map과 Supplier로 만들고 create("Pepperoni")와 없는 이름 create("veggie")를 불러 보기
@@S Decorator in Code | type
할 일: Cheese, Olives 데코레이터를 만들고 Margherita를 감싸서 "Margherita, Cheese, Olives $12.5"가 나오는지 확인
@@S Observer in Code | type
할 일: OrderService에 주방, 재고 리스너 두 개를 달고 placeOrder 한 번에 두 줄이 찍히는지 확인
@@K Outcomes
이번 주 목표 세 가지:
1. **Factory**: `new`를 전용 Factory로 옮기기. 새 피자 종류(Veggie)를 추가해도 기존 코드가 안 깨지게.
2. **Decorator**: 하위 클래스 대신 **감싸기**로 치즈, 올리브 추가. 클래스 폭발 없이 런타임에 기능 확장.
3. **Observer**: 주문 버튼과 주방 화면을 **느슨하게** 연결. 유튜브 알림, 가격 알림처럼.

디자인 패턴 = 자주 나오는 설계 문제에 대한 **검증된 해결 방법의 이름**. 이름을 알면 "여기 Observer 쓰자" 한마디로 소통이 돼요.
@@K A Scalable Pizza App
요구사항 3개가 패턴 3개에 딱 대응해요:

| 요구사항 | 패턴 |
| --- | --- |
| 기본 피자 종류 여러 개 만들기 | Factory |
| 토핑을 무한히 조합 | Decorator |
| 주문하면 주방에 바로 알림 | Observer |

모든 피자는 `Pizza` 인터페이스(설명, 가격)를 구현해요. 이 인터페이스가 세 패턴을 묶는 공통 언어예요(Week 2 인터페이스 복습).
@@K The Factory Pattern
문제: 코드 여기저기에 `new Pepperoni()`가 흩어져 있으면 클래스 이름이 바뀌거나 생성 방법이 바뀔 때 **전부** 고쳐야 해요. 이게 **강한 결합(tight coupling)**.

해결: 만드는 일을 Factory 한 곳에 맡기고, 쓰는 쪽은 `PizzaFactory.create("pepperoni")`만 불러요. 쓰는 쪽은 `Pizza` 인터페이스만 알고 `Pepperoni` 클래스는 몰라도 돼요.

정의의 "subclasses decide which class to instantiate"는 원래 GoF Factory Method 패턴 설명이에요. 수업에서는 "생성을 전담 클래스/메서드에 맡긴다"로 이해하면 충분해요.
@@K Factory: Real-World Analogy
피자집에서 "밀가루 반죽하고 소스 바르고..."라고 말하지 않고 "페퍼로니 하나요"라고만 해요. 만드는 복잡한 과정은 주방(Factory)이 알아서. 손님(쓰는 코드)은 결과물만 받아요.
@@K Factory with Map of Supplier
초보 Factory는 이렇게 생겼어요:
```java
if (type.equals("margherita")) return new Margherita();
else if (type.equals("pepperoni")) return new Pepperoni();
```
종류가 늘수록 if가 길어지고, 추가할 때마다 이 메서드를 **고쳐야** 해요.

"Pro" 방식: `Map<String, Supplier<Pizza>>` 레시피 등록부.
- `Supplier<T>`는 `T get()` 하나뿐인 함수형 인터페이스(Week 10). "만드는 방법"을 값으로 저장.
- `Margherita::new`는 **생성자 참조** = `() -> new Margherita()`.
- 찾기는 HashMap이라 **O(1)**. 새 피자는 `RECIPES.put("veggie", Veggie::new)` 한 줄.
- `recipe.get()`을 불러야 실제 객체가 **새로** 만들어져요. 부를 때마다 새 피자.

없는 이름이면 `get`이 null → 예외로 알려 줘요. (직접 확인: `Unknown pizza: veggie`.) `toLowerCase()` 덕분에 "Pepperoni"도 찾아요.
@@K The Decorator Pattern
상속으로 토핑을 만들면: `MargheritaWithCheese`, `MargheritaWithOlives`, `MargheritaWithCheeseAndOlives`, `PepperoniWithCheese` ... 조합 수만큼 클래스가 필요해요(**Class Explosion**). 그리고 상속은 **컴파일할 때** 정해져서 실행 중에 바꿀 수 없어요.

Decorator는 객체를 **포장지로 감싸요**. 포장지도 같은 `Pizza`라서 또 감쌀 수 있어요.

**Open for Extension, Closed for Modification**(개방-폐쇄 원칙): 새 토핑(기능)은 새 클래스로 **추가**하고, 기존 Margherita 코드는 **고치지 않아요**.
@@K Decorator: Real-World Analogy
커피 → 우유로 감싸기 → 설탕으로 또 감싸기. "우유설탕커피" 클래스는 없어요. 가격은 안쪽부터 바깥으로 더해져요: 커피 값 + 우유 값 + 설탕 값.

Java IO가 바로 이 모양이에요: `new BufferedReader(new FileReader("a.txt"))`. FileReader에 버퍼 기능을 감싸서 추가(Week 9).
@@K Decorator in Code
구조 3가지:
1. `ToppingDecorator`가 `Pizza`를 **구현**하고(is-a), 안에 `Pizza`를 **필드로 가짐**(has-a). 이 둘이 동시에 있는 게 Decorator의 표식.
2. 각 토핑은 안쪽 피자에게 먼저 물어보고(`pizza.getCost()`) 자기 몫을 더해요.
3. 감싸는 순서대로 설명이 쌓여요.

`new Olives(new Cheese(margherita))` 계산 (직접 확인):
- 설명: "Margherita" → ", Cheese" → ", Olives" = `Margherita, Cheese, Olives`
- 가격: 10.0 + 1.5 + 1.0 = **12.5**

같은 토핑 두 번도 돼요: `new Cheese(new Cheese(pepperoni))` → `Pepperoni, Cheese, Cheese $15.0`. 상속으로는 "치즈 두 배" 클래스를 또 만들어야 했겠죠.
@@K The Observer Pattern
**Subject**(관찰 대상): 상태가 바뀌는 쪽. Observer 목록을 갖고 있다가 바뀌면 전부에게 알려요.
**Observer**(관찰자): 알림을 받고 반응하는 쪽.

"Don't call us, we'll call you" = Observer가 계속 물어보지(polling) 않고, Subject가 **불러 줘요**.

Loose Coupling: Subject는 "OrderListener 인터페이스를 구현한 누군가들"만 알아요. 주방인지 재고인지 몰라요. 그래서 Observer를 추가, 삭제해도 Subject 코드는 그대로.
@@K Observer: Real-World Analogy
유튜브: 구독(=`addListener`)하면 새 영상이 올라올 때 채널이 **알림**을 보내요. 5초마다 새로고침할 필요 없음. 구독 취소 = `removeListener`.

JavaFX에서 이미 매일 쓰고 있어요:
- `button.setOnAction(...)`: 버튼(Subject)이 클릭되면 핸들러(Observer)를 불러요.
- `property.addListener(...)`: Week 10의 ChangeListener가 그대로 Observer 패턴이에요.
@@K Observer in Code
- `OrderListener`: Observer 인터페이스. 메서드가 하나라서 **람다**로 등록할 수 있어요.
- `OrderService`: Subject. `List<OrderListener>`를 갖고, `placeOrder`에서 **for로 전부 호출**(= notify).
- 컨트롤러는 주문 버튼에서 `service.placeOrder(pizza)`만 부르고, 주방 화면이 있는지도 몰라요.

출력 (직접 확인):
```
Kitchen: make Margherita, Cheese, Olives
Inventory: use dough
```
나중에 "영수증 프린터"를 추가해도 `addListener` 한 줄. OrderService와 컨트롤러는 안 고쳐요. 이게 슬라이드 결론의 "without touching the Controller code"예요.

@@TEXT
## 🧩 이번 주 토이 프로젝트: CafeOrder Week 12

CafeOrder에 세 패턴을 그대로 넣어요. `DrinkFactory`(Map + Supplier)로 Americano, Latte를 만들고, `ExtraShot`, `OatMilk` 데코레이터로 옵션 가격을 더하고, 주문하면 `OrderService`가 바리스타 화면과 매출 집계에 알림(Observer). (토이 가이드는 준비 중이에요.)

## ✅ 시험 대비 체크리스트 (Week 12)

- [ ] 디자인 패턴이 무엇이고 왜 쓰는지 한 문장으로 말할 수 있다.
- [ ] Factory의 문제(new로 인한 강한 결합)와 해결(생성 위임)을 설명할 수 있다.
- [ ] if/else Factory와 `Map<String, Supplier>` Factory의 차이(O(1), 수정 없이 추가)를 안다.
- [ ] 생성자 참조 `Margherita::new`가 Supplier가 되는 이유를 안다.
- [ ] Decorator의 구조(같은 인터페이스 구현 + 감싼 객체 필드)를 그릴 수 있다.
- [ ] Class Explosion과 Open for Extension, Closed for Modification을 설명할 수 있다.
- [ ] 데코레이터를 여러 겹 감쌌을 때 설명과 가격을 계산할 수 있다.
- [ ] Observer의 Subject, Observer 역할과 one-to-many, Loose Coupling을 설명할 수 있다.
- [ ] Java IO(Decorator), addListener/setOnAction(Observer), Executors(Factory) 예를 연결할 수 있다.
- [ ] 실생활 비유(피자집, 커피, 유튜브)로 세 패턴을 구분할 수 있다.

## ✍️ 손으로 써 보기

1. 다음 상황에 맞는 패턴을 고르세요(Factory, Decorator, Observer).
   - (a) 주식 가격이 바뀌면 차트, 알림, 로그가 모두 갱신돼야 한다.
   - (b) 문자열 "circle", "square"를 받아 알맞은 Shape 객체를 돌려준다.
   - (c) 텍스트에 굵게, 기울임, 밑줄을 원하는 조합으로 실행 중에 덧입힌다.

<details><summary>1번 정답</summary>

(a) Observer, (b) Factory, (c) Decorator.

</details>

2. `Pizza`를 감싸는 `ExtraSauce` 데코레이터를 쓰세요. 설명에 ", Extra Sauce", 가격에 0.75를 더해요. 그리고 `new ExtraSauce(new Olives(new Pepperoni()))`의 출력을 예측하세요.

<details><summary>2번 예시 답</summary>

```java
public class ExtraSauce extends ToppingDecorator {
    public ExtraSauce(Pizza pizza) { super(pizza); }
    public String getDescription() { return pizza.getDescription() + ", Extra Sauce"; }
    public double getCost() { return pizza.getCost() + 0.75; }
}
```

출력: `Pepperoni, Olives, Extra Sauce $13.75` (12.0 + 1.0 + 0.75).

</details>

3. Observer 패턴에서 Subject가 Observer의 구체 클래스(KitchenDisplay)를 직접 필드로 갖고 `kitchen.show(pizza)`를 부르면 어떤 문제가 있나요?

<details><summary>3번 정답</summary>

강한 결합이 돼요. 재고 시스템 같은 Observer를 추가할 때마다 Subject 코드를 고쳐야 하고, 주방 화면 없이 Subject를 재사용하거나 테스트하기 어려워요. 인터페이스 목록(`List<OrderListener>`)을 두면 Subject는 수정 없이 Observer를 늘릴 수 있어요.

</details>
