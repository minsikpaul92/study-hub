# Week 3. 컬렉션, Iterator, 제네릭, 서비스 계층

> **읽는 법**: 📑 표시는 교수님 슬라이드의 핵심 문장(영어 원문 그대로 짧게 발췌)이고, 바로 아래 **🇰🇷 한글 해설**이 이어져요. 💻 표시는 교수님 샘플 코드(`WK_3_DS_Lib_Service`)예요. ⌨️ 표시가 있는 코드는 IntelliJ에서 직접 쳐 보세요.
>
> 이 주의 `List`, `Map`, 제네릭 `<T>`는 Week 5 이후 `ObservableList`, Repository(`Map<Integer, Student>`)에서 매일 써요. **Service Layer**는 Week 6~7 DI, Repository, Service 패턴의 첫 단추예요.

## 0. 이번 주 한눈에 보기

| 개념 | 한 줄 정리 | 시험에 나오는 모양 |
| --- | --- | --- |
| Collection vs Collections | 인터페이스(뿌리) vs 유틸 클래스(`sort`, `shuffle`) | 이름 하나 차이 함정 |
| List | 순서 있음, **중복 허용**, 인덱스 | `remove(1)`은 인덱스, `remove(Integer.valueOf(1))`은 값 |
| ArrayList vs LinkedList | 배열(조회 O(1), 중간 삽입 O(n)) vs 노드 연결(중간 삽입 빠름) | 어느 게 빠른가 |
| ArrayList vs Vector | Vector는 synchronized(느림, legacy), 2배로 늘어남 | 표 비교 |
| Set | **중복 없음**. Hash(순서 없음) / LinkedHash(넣은 순서) / Tree(정렬) | 출력 순서 맞히기 |
| Map | key → value. key 중복 없음, `put`은 덮어씀, 없는 key `get`은 **null** | `keySet()`, `values()`, `entrySet()` |
| Iterator | `hasNext()`, `next()`, `remove()`. 순회 중 삭제는 iterator로 | foreach 안 `remove`는 `ConcurrentModificationException` |
| Generics | 타입을 매개변수로. **컴파일 시간**에 타입 검사, 캐스팅 제거 | `Store<int>` 에러, static T 에러 |
| Type erasure | 컴파일 후 T는 Object로 바뀌고 캐스팅이 자동 삽입 | 정의 |
| Service Layer | 비즈니스 규칙은 서비스에. "Controllers coordinate, services think." | fat controller |

**함정 모음**

- `indexOf`가 못 찾으면 **-1**, `Map.get`이 못 찾으면 **null**.
- `subList(1, 3)`은 인덱스 1, 2만 (끝은 **포함 안 함**).
- `HashSet`, `HashMap` 출력 순서는 **예측 불가**. 순서를 물으면 LinkedHash(넣은 순서) 또는 Tree(정렬)를 써야 함.
- 내가 만든 클래스를 HashSet/HashMap key에 넣을 때 **`equals()`와 `hashCode()`를 둘 다** override해야 중복이 걸러진다.
- 제네릭 타입 인자는 **기본형 불가**: `List<int>` X, `List<Integer>` O.
- `Collection<String> c = new ArrayList<>();`로 선언하면 `c.get(0)`은 **없다** (Collection에는 인덱스 메서드가 없음).

{{PRACTICE}}

{{TOC}}

@@SLIDE week-03-1-collections.md
@@S _doc | read
Java가 기본으로 주는 자료구조 세트(Collections Framework)예요. **List, Set, Map** 세 가지를 언제 무엇을 쓰는지, 출력이 어떻게 나오는지가 핵심이에요.
@@S Collection Example (Basic) | type
할 일: collection1, collection2로 addAll, retainAll, removeAll 결과를 직접 확인
@@S Set implementation | type
할 일: HashSet, LinkedHashSet, TreeSet에 같은 도시를 넣고 출력 순서 비교
@@S Map Implementation | type
할 일: HashMap, TreeMap, LinkedHashMap에 같은 이름과 나이를 넣고 출력 순서 비교
@@K Outcomes
이번 세그먼트 목표: **List, Set, Map** 이해하기.
@@K The Collection
컬렉션 = 객체 여러 개를 담는 **그릇 객체**. 카드 패(목록), 편지함(목록), 전화번호부(이름 → 번호 짝)처럼 일상의 "모음"을 코드로 옮긴 거예요. 배열과 달리 **크기가 자동으로** 늘고 줄어요.
@@K Collection interface hierarchy
구조를 그림으로 외우세요.

```
Iterable
  └ Collection
      ├ List   (ArrayList, LinkedList, Vector, Stack)
      ├ Set    (HashSet, LinkedHashSet, TreeSet)
      └ Queue  (PriorityQueue), Deque (ArrayDeque)
Map (따로!)  (HashMap, LinkedHashMap, TreeMap)
```

**Map은 Collection을 상속하지 않아요.** 짝(key, value)으로 저장하니까 구조가 달라요. 시험 단골이에요.

`Collection<E> extends Iterable<E>`라서 모든 컬렉션은 `for (E e : collection)`이 돼요.
@@K Collection Example (Basic)
집합 연산 세 개를 기억하세요.

- `addAll` = **합집합** (List라서 중복 Atlanta가 두 번 들어가요)
- `retainAll` = **교집합** (둘 다에 있는 것만 남김)
- `removeAll` = **차집합** (상대에 있는 것 빼기)

`clone()`으로 복사본을 만든 다음 연산하는 이유: 원본 `collection1`을 망가뜨리지 않으려고요. `clone()`은 `Object`를 돌려주니까 `(ArrayList<String>)` 캐스팅이 필요해요.

`collection2`는 `Collection<String>` 타입으로 선언했어요. **인터페이스 타입으로 선언**하는 습관, Week 2에서 배운 거죠.
@@K Collection vs Collections
`Collection`(s 없음) = 인터페이스, `Collections`(s 있음) = 정적 메서드 모음 클래스. 예: `Collections.sort(list)`, `Collections.shuffle(list)`, `Collections.max(list)`. `Arrays`(배열 도우미)와 `Array`의 관계와 같아요.
@@K Java ArrayList
ArrayList = **자동으로 커지는 배열**. C++의 `vector`와 같아요. 중복 허용, 넣은 순서 유지.
@@K Non-generic vs Generic Collection
옛날 방식 `ArrayList list = new ArrayList();`(raw type)은 아무 타입이나 들어가서, 꺼낼 때 캐스팅해야 하고 잘못 넣으면 **실행 중에** 터져요. `ArrayList<String>`처럼 타입을 정하면 다른 타입을 넣는 순간 **컴파일 에러**로 막아 줘요. 오른쪽은 `new ArrayList<>()`처럼 **다이아몬드**로 줄여 써요.
@@K ArrayList VS Vector
요즘 코드는 거의 ArrayList예요. Vector는 모든 메서드가 `synchronized`(한 번에 한 스레드만)라서 안전하지만 느려요. 시험에는 표의 숫자(**50% vs 100%**)와 "Vector is legacy"가 나와요. 스레드 안전은 Week 11에서 다시 봐요.
@@K The List
List의 세 가지 특징: **순서**, **중복 허용**, **인덱스 접근**. 선언은 `List<Integer> list = new ArrayList<>();`처럼 왼쪽 인터페이스, 오른쪽 구현.
@@K ArrayList methods
헷갈리는 두 개:

```java
List<Integer> l = new ArrayList<>(List.of(10, 20, 30, 40));
l.remove(1);                    // 인덱스 1 삭제 → [10, 30, 40]
l.remove(Integer.valueOf(30));  // 값 30 삭제   → [10, 40]
```

`Integer` 리스트에서 `remove(1)`은 **인덱스**로 해석돼요. 값으로 지우려면 `Integer.valueOf(...)`로 감싸요. (직접 돌려서 확인했어요.)

`add(index, value)`는 그 자리에 **끼워 넣고** 뒤를 밀어요. `set(index, value)`는 **바꿔치기**예요.
@@K Two Ways to Implement Lists
| | ArrayList (배열) | LinkedList (노드) |
| --- | --- | --- |
| `get(i)` | O(1) 빠름 | O(n) 앞에서부터 따라감 |
| 중간 `add`, `remove` | O(n) 밀고 당김 | 위치만 알면 O(1) |
| 메모리 | 값만 | 값 + 다음 노드 주소 |

노드 코드: `head`는 첫 노드, `tail`은 마지막 노드. 새 노드 추가는 `tail.next = new Node<>(...)` 후 `tail = tail.next`. 빈 리스트면 head, tail 둘 다 `null`.

`contains`, `indexOf`는 둘 다 처음부터 **`equals()`로** 하나씩 비교해서 O(n). 검색이 잦으면 HashSet(O(1))을 쓰라는 게 슬라이드 결론이에요.
@@K Examining List
foreach로 돌면서 그 리스트를 `remove`하면 보통 **`ConcurrentModificationException`**이 나요. 해결은 Segment 2의 **Iterator의 `remove()`**:

```java
Iterator<Integer> it = scores.iterator();
while (it.hasNext()) {
    if (it.next() < 60) it.remove();
}
```

또는 Java 8부터 `scores.removeIf(s -> s < 60);` 한 줄.
@@K Set Interface
Set = **중복 없는** 모음. 새 메서드는 없고 "중복 금지"라는 **규칙**만 추가해요. 중복 판단은 `equals()`로 해요 (HashSet은 `hashCode()`도 같이).
@@K Set implementation
세 개의 차이는 **순서**예요. 같은 도시를 넣었을 때 (직접 돌린 결과):

- `HashSet`: `[San Francisco, Beijing, New York, London, Paris]` 순서 뒤죽박죽
- `LinkedHashSet`: `[London, Paris, New York, San Francisco, Beijing]` 넣은 순서
- `TreeSet`: `[Beijing, London, New York, Paris, San Francisco]` 알파벳 순

"New York"을 두 번 넣어도 **하나만** 남아요. `set.forEach(e -> ...)`는 Week 10 람다 미리보기예요.
@@K equals() and hashCode() in a HashSet
Book 두 개는 내용이 같아도 **다른 객체**라서, `equals`와 `hashCode`를 override하지 않으면 HashSet에 **둘 다** 들어가요. (기본 `equals`는 주소 비교.)

규칙: **equals가 true인 두 객체는 hashCode도 같아야** 해요. HashSet은 먼저 hashCode로 버킷을 찾고, 그 안에서 equals로 비교하거든요. 하나만 override하면 중복이 안 걸러져요.
@@K Set and List Performance
5000개 `contains` 실험: HashSet 약 20ms vs ArrayList 약 40,000ms. "이게 있나?"를 자주 물으면 **Set**이 압도적으로 빨라요.
@@K The Map Interface
Map = **사전**. 단어(key)로 뜻(value)을 찾아요. List의 인덱스가 0, 1, 2 정수라면 Map의 key는 아무 객체(보통 String, Integer). key는 중복 불가, value는 중복 가능.
@@K Map methods
꼭 알 것:

```java
Map<String, Integer> m = new HashMap<>();
m.put("a", 1);     // null 반환 (이전 값 없음)
m.put("a", 2);     // 1 반환, 값이 2로 덮어써짐
m.get("a");        // 2
m.get("z");        // null (없는 key)
```

순회 세 가지: `keySet()`(key만, Set), `values()`(value만, Collection), `entrySet()`(둘 다, `entry.getKey()`, `entry.getValue()`).
@@K Hash Table
해시 테이블 원리: key → `hashCode()` → 버킷 번호 → 그 버킷의 연결 리스트에서 `equals`로 찾기. 그래서 평균 **O(1)**.

- 같은 버킷에 여러 개가 들어가는 걸 충돌(collision)이라 하고, 리스트로 이어 붙이는 방식이 **separate chaining**.
- **load factor 0.75**: 75% 차면 배열을 키우고 전부 다시 배치(rehashing, 비쌈).
- HashMap은 null key **하나** 허용, TreeMap은 null key 불가(정렬 비교를 못 하니까).
@@K Map Implementation
Set과 똑같은 3종 세트예요 (실제로 HashSet 안에 HashMap이 들어 있어요).

- `HashMap`: `{Lewis=29, Smith=30, Cook=29, Anderson=31}` 순서 예측 불가
- `TreeMap`: `{Anderson=31, Cook=29, Lewis=29, Smith=30}` **key** 알파벳 순
- `LinkedHashMap`: `{Smith=30, Anderson=31, Lewis=29, Cook=29}` 넣은 순서

참고: 슬라이드의 LinkedHashMap 출력은 `{Smith=30, Anderson=31, Cook=29, Lewis=29}`로 적혀 있지만, 넣은 순서가 Smith, Anderson, Lewis, Cook이라 **Lewis가 Cook보다 먼저** 나와야 맞아요.

`treeMap.forEach((name, age) -> ...)`: Map의 forEach는 매개변수가 **두 개**(key, value)예요.
@@K keySet and values
`for (String name : ages.keySet())`로 key를 돌고 `ages.get(name)`으로 값을 꺼내요. TreeMap이라 Geneva, Marty, Vicki 순으로 나와요.

참고: 원래 슬라이드는 `ages.get(age)`로 적혀 있는데, `age`는 아직 선언 전이라 컴파일 에러예요. `ages.get(name)`이 맞아요.
@@K Reversing a map
GPA → 이름으로 뒤집으면 3.6인 사람이 두 명인데 key는 하나라 **마지막 put만 남아요**(Stef가 Jared를 덮어씀). 해결: value를 **Set**으로 해서 `Map<Double, Set<String>>`. 주의: `get(3.6).add(...)` 전에 그 key에 빈 Set을 **먼저 put**해야 해요. 안 하면 `get`이 null이라 `NullPointerException`.

Java 8 이후 한 줄 버전: `taGpa.computeIfAbsent(3.6, k -> new TreeSet<>()).add("Jared");`

@@SLIDE week-03-2-iterators.md
@@S _doc | read
컬렉션을 하나씩 걸어가며 보는 **커서**(Iterator)예요. 짧지만 "순회 중 안전하게 지우기"가 시험에 잘 나와요.
@@S Iterator example | type
할 일: flowers 리스트를 Iterator로 출력하고, 이어서 "s"로 시작하는 꽃만 it.remove()로 지워 보기
@@K Iterators
Iterator = 컬렉션 위의 **책갈피**. 어느 컬렉션이든 같은 방법(`hasNext`, `next`)으로 돌 수 있어서 "Universal Cursor"라고 불러요. 옛날 Vector에서 쓰던 `Enumeration`을 대체했어요.
@@K The three methods
패턴은 항상 **`hasNext()`로 확인 → `next()`로 꺼내기**. 확인 없이 `next()`를 부르다 끝을 넘으면 `NoSuchElementException`.

`remove()`는 **방금 `next()`로 받은 것**을 지워요. 그래서 `next()` 없이 `remove()`를 부르거나, 한 번의 `next()` 뒤에 `remove()`를 두 번 부르면 `IllegalStateException`.
@@K Iterator example
`flowers.iterator()`로 Iterator를 얻고 while로 돌아요. 출력: `Rose Jasmine sunflower `.

foreach `for (String f : flowers)`도 내부적으로는 이 Iterator를 써요. 차이는 foreach에서는 `remove`를 할 수 없다는 것.
@@K Limitations of Iterator Interface
Iterator는 **앞으로만**, **읽기와 삭제만**. 뒤로 가기나 `set`, `add`가 필요하면 List 전용 **`ListIterator`**(`hasPrevious`, `previous`, `set`, `add`)를 써요.
@@K Iterator VS Iterable
- **Iterable**: "나는 돌 수 있어" 능력. 메서드 `iterator()` 하나. 구현하면 foreach 가능.
- **Iterator**: 실제로 도는 **커서 객체**. `hasNext`, `next`, `remove`.

비유: Iterable은 책, Iterator는 그 책에 꽂힌 책갈피.
@@K Java Iterator VS C++ Iterator
C++은 `it != v.end()`로 끝을 직접 비교하고 `++it`, `--it`, `*it = x`가 다 돼요. Java Iterator는 `hasNext()`가 끝을 알고, **앞으로만, 읽기 전용**(삭제만 예외)이에요.

@@SLIDE week-03-3-generics.md
@@S _doc | read
`List<String>`의 `<String>`이 무엇인지, 내 클래스에 `<T>`를 붙이는 법을 배워요. C++ template과 비슷하지만 **컴파일할 때만** 존재해요(type erasure).
@@S Generic class | type
할 일: Store<T>를 만들고 Store<String>에 숫자를 넣으면 컴파일 에러가 나는지 확인
@@S Generic Class example: GenericBox | type
할 일: GenericBox를 쳐서 String, Integer, Double 세 상자의 toString 출력 확인
@@K What is Generics?
제네릭 = **타입을 매개변수로 받기**. 메서드에 값을 넘기듯이 클래스에 타입을 넘겨요. 목적은 버그를 **실행 전(컴파일)에** 잡는 것.
@@K Motivation
`Object`로 다 받으면 아무거나 들어가서 편하지만, 꺼낼 때 **캐스팅**이 필요하고 잘못된 타입이면 **실행 중 `ClassCastException`**. 컴파일러가 못 잡아요.

참고: 원래 슬라이드는 `java.util.Date`와 `java.sql.Date`로 이 예를 드는데, `java.sql.Date`는 `java.util.Date`의 **자식**이라 그 캐스팅은 실제로는 성공해요. 그래서 여기서는 String과 Integer로 바꿔서 보여 줬어요.
@@K Generic class
`class Store<T>`: T 자리에 나중에 실제 타입이 들어가요. `Store<Book>`이면 `set(Book)`, `Book get()`이 되는 것처럼 동작해요. 다른 타입을 넣으면 **컴파일 에러**, 꺼낼 때 **캐스팅 불필요**.
@@K Generic Type and Parameterized Type
용어 두 쌍:

- `Store<T>`: **generic type**, T는 **type parameter**(형식)
- `Store<String>`: **parameterized type**, String은 **type argument**(실제)

메서드의 매개변수(parameter)와 인자(argument) 관계랑 똑같아요.
@@K Type Parameter Naming Conventions
관례일 뿐 문법은 아니에요. `List<E>`, `Map<K, V>`가 이 관례예요.
@@K Multiple Type Parameters
쉼표로 여러 개: `Pair<K, V>`. `OrderedPair<String, Integer> p1 = new OrderedPair<>("One", 1);`에서 `1`은 int인데 Integer로 **자동 박싱**돼요. Week 6 `Dialog`의 `Pair<String, String>`이 바로 이거예요.
@@K Why Generics: Benefits
세 가지: **더 강한 타입 검사**, **캐스팅 제거**, **타입 안전**. 한 문장: 실행 중 에러를 컴파일 에러로 바꿔 준다.
@@K Generic Class example: GenericBox
출력:

```
Hello (class java.lang.String)
123 (class java.lang.Integer)
55.66 (class java.lang.Double)
```

`int i = box2.getContent();`: Integer가 int로 자동 **언박싱**. `content.getClass()`는 실행 중 **실제** 객체 타입을 알려줘요.
@@K Type Erasure
컴파일러가 하는 일: (1) 타입 검사, (2) T를 **Object**로 지우기, (3) 꺼내는 곳에 캐스팅 자동 삽입. 그래서 실행 중에는 `List<String>`과 `List<Integer>`가 **같은 클래스**예요. "Generics is purely compile time concept"의 뜻이에요.
@@K Raw Types
raw type = 타입 인자를 안 붙인 제네릭(`Store`, `ArrayList`). 옛날 코드 호환용이라 쓰지 말라는 경고가 나와요.
@@K Generic method
메서드에만 타입 매개변수: **반환 타입 앞에 `<T>`**.

```java
public static <T> boolean isEqual(GenericsType<T> g1, GenericsType<T> g2)
```

부를 때 `GenericsMethods.<String>isEqual(g1, g2)`처럼 명시해도 되고, 보통은 생략해요(컴파일러가 추론).
@@K Restrictions
두 가지 제한:

1. **기본형 불가**: `Store<int>` X → `Store<Integer>` O. (erasure로 Object가 되는데 int는 Object가 아니니까요.)
2. **static에 T 불가**: static 필드는 모든 객체가 공유하는데, `Device<Smartphone>`과 `Device<Pager>`가 같은 static을 쓰면 T가 무엇인지 정할 수 없어요.

@@SLIDE week-03-4-service-layer.md
@@S _doc | read
비즈니스 규칙을 컨트롤러에서 꺼내 **서비스**로 모으는 이유예요. Week 6~7의 Service Pattern과 이어져요.
@@K Service Layer
Service Layer = 앱의 **규칙과 작업 흐름**이 사는 곳. 예: "책은 두 번 빌려줄 수 없다", "가입한 사용자만 빌릴 수 있다". 이런 건 화면(UI)과 상관없는 **업무 규칙**이에요.
@@K Why do we use Service Layer?
**fat controller** = 버튼 처리, 검증, 계산, 저장을 다 하는 뚱뚱한 컨트롤러. 고치기 어렵고 재사용이 안 돼요. 서비스로 빼면 다른 컨트롤러(웹, 콘솔)도 같은 규칙을 그대로 써요.

외울 문장: **"Controllers coordinate, services think."** 컨트롤러는 "누구에게 시킬지"만, 서비스가 "어떻게 할지"를 판단해요.
@@K Service Layer in the Example
폴더 구조가 곧 역할 분리예요: `controllers/`(사용자 동작), `services/`(규칙), `models/`(데이터). Week 5 MVC에 services 층이 하나 더 붙은 모양이에요.
@@K Working in the Example
흐름: 입력 → 컨트롤러 → **서비스에 위임** → 서비스가 검증, 저장, 규칙 적용 → 결과를 컨트롤러로 → 화면. 컨트롤러에는 `if`로 규칙을 판단하는 코드가 **없어야** 해요.
@@K Issuance Services
"두 번 대출 불가", "사용자가 있어야 대출"은 **business rule**이에요. 화면이 콘솔이든 JavaFX든 똑같이 지켜야 하니까 서비스 소속이에요.
@@K Service Layer vs. Service Layer Design Pattern
이번 주는 "서비스로 나누기"까지만. 완전한 패턴은 **인터페이스 + DI + stateless + Repository**가 붙어요. 그게 Week 6 Segment 5와 Week 7 Guice에서 완성돼요. 지금 서비스는 `new BookService()`를 컨트롤러가 직접 하니까 DI가 아니에요.

@@IN week-03-library-service.md
@@S _doc | read
도서관 앱으로 Map과 Service Layer를 같이 써요. 교수님 코드에서 **규칙이 아직 컨트롤러에 남아 있는 부분**을 찾아보는 게 좋은 복습이에요.
@@K Project Structure
models, services, controllers, views 네 층. MVC + Service예요.
@@K Example: BookService (HashMap by ISBN)
ISBN을 key로 하는 `HashMap<String, Book>`. ISBN으로 찾기, 지우기가 O(1)이에요. `books.values()`로 모든 책을 돌아요(순서는 보장 안 됨).
@@K Example: IssuanceService (LinkedHashMap + entrySet)
대출 기록은 **LinkedHashMap**: 대출한 순서대로 출력하려고요. `entrySet()`으로 key(ISBN)와 value(기록)를 같이 꺼내요.

`returnBook`의 `issuedBooks.remove(isbn)`은 **지운 값**을 돌려주고, 없으면 `null`. 그래서 호출하는 쪽에서 `if (record != null)`로 반납 성공 여부를 알 수 있어요.
@@K Example: LibraryController.issueBook
잘 보세요. "책이 있고, 사용자가 있고, 아직 대출 안 됐으면"이라는 **업무 규칙 if문이 컨트롤러에** 있어요. 슬라이드 원칙("Controller does NOT contain logic")대로라면 이 검사는 `IssuanceService.issue(isbn, userId)` 안으로 들어가야 해요. 시험에서 "이 코드에서 service로 옮겨야 할 부분은?"으로 나올 수 있는 모양이에요.

@@TEXT
## 🧩 이번 주 토이 프로젝트: CafeOrder Week 3

메뉴를 `Map<String, MenuItem>`(메뉴 코드 → 품목)으로, 장바구니를 `List<OrderLine>`으로 바꿔요. "재고 없는 품목은 담을 수 없다", "같은 품목은 수량만 늘린다" 규칙은 `OrderService`에 넣고 컨트롤러는 서비스만 불러요. (토이 가이드는 준비 중이에요.)

## ✅ 시험 대비 체크리스트 (Week 3)

- [ ] Collection 계층 그림(List, Set, Queue)과 Map이 따로라는 것을 안다.
- [ ] `Collection`과 `Collections`의 차이를 안다.
- [ ] ArrayList vs LinkedList, ArrayList vs Vector 차이를 말할 수 있다.
- [ ] `remove(int)`와 `remove(Object)`, `indexOf`의 -1, `subList`의 끝 미포함을 안다.
- [ ] HashSet, LinkedHashSet, TreeSet의 출력 순서를 예측할 수 있다.
- [ ] HashSet 중복 제거에 `equals`와 `hashCode`가 둘 다 필요한 이유를 안다.
- [ ] Map의 `put` 덮어쓰기, 없는 key의 `get` null, `keySet`/`values`/`entrySet`을 쓸 수 있다.
- [ ] HashMap, LinkedHashMap, TreeMap 순서 차이를 안다.
- [ ] Iterator의 `hasNext`, `next`, `remove` 규칙과 예외 이름(NoSuchElement, IllegalState, ConcurrentModification)을 안다.
- [ ] Iterable과 Iterator 차이를 안다.
- [ ] 제네릭 클래스 `Box<T>`와 제네릭 메서드 `<T> void m(T t)`를 쓸 수 있다.
- [ ] type erasure, raw type, 기본형 불가, static T 불가를 안다.
- [ ] Service Layer의 목적과 "Controllers coordinate, services think"를 설명할 수 있다.

## ✍️ 손으로 써 보기

1. 문장 `"the cat and the hat and the bat"`의 단어 개수를 세는 `Map<String, Integer>`를 만들고, 알파벳 순으로 출력하세요.

<details><summary>1번 예시 답</summary>

```java
Map<String, Integer> counts = new TreeMap<>();
for (String w : "the cat and the hat and the bat".split(" ")) {
    if (counts.containsKey(w)) counts.put(w, counts.get(w) + 1);
    else counts.put(w, 1);
}
System.out.println(counts);   // {and=2, bat=1, cat=1, hat=1, the=3}
```

`counts.merge(w, 1, Integer::sum);` 한 줄로도 돼요.

</details>

2. 다음 코드의 출력은?

```java
List<String> list = new ArrayList<>(List.of("b", "a", "c", "a"));
Set<String> set = new TreeSet<>(list);
System.out.println(list.size() + " " + set.size() + " " + set + " " + list.indexOf("z"));
```

<details><summary>2번 정답</summary>

`4 3 [a, b, c] -1`. List는 중복 허용, TreeSet은 중복 제거 후 정렬, 못 찾으면 -1.

</details>

3. 아무 타입이나 두 개를 담는 `class Pair<A, B>`(생성자, `getFirst`, `getSecond`)와, 두 값을 뒤바꾼 새 Pair를 돌려주는 제네릭 정적 메서드 `swap`을 쓰세요.

<details><summary>3번 예시 답</summary>

```java
class Pair<A, B> {
    private final A first;
    private final B second;
    Pair(A first, B second) { this.first = first; this.second = second; }
    A getFirst() { return first; }
    B getSecond() { return second; }

    static <A, B> Pair<B, A> swap(Pair<A, B> p) {
        return new Pair<>(p.getSecond(), p.getFirst());
    }
}
```

</details>
