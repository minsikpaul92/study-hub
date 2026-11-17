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


**⌨️ IntelliJ에서 직접 쳐 볼 것 (이 순서대로)**

어디 칸을 누르면 그 코드로 바로 가요. 코드 위에도 ⌨️ 표시가 있어요.

| # | 어디 | 무엇을 |
| --- | --- | --- |
| 1 | [Collection Example (Basic)](#practice-1) | collection1, collection2로 addAll, retainAll, removeAll 결과를 직접 확인 |
| 2 | [Set implementation](#practice-2) | HashSet, LinkedHashSet, TreeSet에 같은 도시를 넣고 출력 순서 비교 |
| 3 | [Map Implementation](#practice-3) | HashMap, TreeMap, LinkedHashMap에 같은 이름과 나이를 넣고 출력 순서 비교 |
| 4 | [Iterator example](#practice-4) | flowers 리스트를 Iterator로 출력하고, 이어서 "s"로 시작하는 꽃만 it.remove()로 지워 보기 |
| 5 | [Generic class](#practice-5) | Store<T>를 만들고 Store<String>에 숫자를 넣으면 컴파일 에러가 나는지 확인 |
| 6 | [Generic Class example: GenericBox](#practice-6) | GenericBox를 쳐서 String, Integer, Double 세 상자의 toString 출력 확인 |

나머지 👀 표시는 읽고 이해만 하면 돼요. 같은 개념을 위 예제에서 이미 타이핑해요.



## 목차

- 1. 📑 강의 슬라이드: Week 3 · Segment 1. Java Collections Framework
- 2. 📑 강의 슬라이드: Week 3 · Segment 2. Java Iterators
- 3. 📑 강의 슬라이드: Week 3 · Segment 3. Generics
- 4. 📑 강의 슬라이드: Week 3 · Segment 4. Service Layer
- 5. 💻 교수님 샘플 코드: Week 3 · Sample: WK_3_DS_Lib_Service
- 🧩 이번 주 토이 프로젝트: CafeOrder Week 3
- ✅ 시험 대비 체크리스트 (Week 3)
- ✍️ 손으로 써 보기


---

## 1. 📑 강의 슬라이드: Week 3 · Segment 1. Java Collections Framework

<div class="sum" data-kind="read">

**🧭 먼저 한국어로** · 👀 읽고 이해하기 (타이핑 안 해도 돼요)

Java가 기본으로 주는 자료구조 세트(Collections Framework)예요. **List, Set, Map** 세 가지를 언제 무엇을 쓰는지, 출력이 어떻게 나오는지가 핵심이에요.

**이 챕터 구성**

- 👀 **Outcomes**: 이번 세그먼트 목표: List, Set, Map 이해하기.
- 👀 **The Collection**: 컬렉션 = 객체 여러 개를 담는 그릇 객체. 카드 패(목록), 편지함(목록), 전화번호부(이름 → 번호 짝)처럼 일상의 "모음"을 코드로 옮긴 거예요.
- 👀 **Collection interface hierarchy**: ├ List (ArrayList, LinkedList, Vector, Stack)
- ⌨️ **[Collection Example (Basic)](#practice-1)**:  (⌨️ collection1, collection2로 addAll, retainAll, removeAll 결과를 직접 확인)
- 👀 **Collection vs Collections**: `Collection`(s 없음) = 인터페이스, `Collections`(s 있음) = 정적 메서드 모음 클래스.
- 👀 **Java ArrayList**: ArrayList = 자동으로 커지는 배열. C++의 `vector`와 같아요.
- 👀 **Non-generic vs Generic Collection**: 옛날 방식 `ArrayList list = new ArrayList();`(raw type)은 아무 타입이나 들어가서, 꺼낼 때 캐스팅해야 하고 잘못 넣으면 실행 중에 터져요.
- 👀 **ArrayList VS Vector**: 요즘 코드는 거의 ArrayList예요. Vector는 모든 메서드가 `synchronized`(한 번에 한 스레드만)라서 안전하지만 느려요.
- 👀 **The List**: List의 세 가지 특징: 순서, 중복 허용, 인덱스 접근.
- 👀 **ArrayList methods**: List<Integer> l = new ArrayList<>(List.of(10, 20, 30, 40));
- 👀 **Two Ways to Implement Lists**: 노드 코드: `head`는 첫 노드, `tail`은 마지막 노드.
- 👀 **Examining List**: foreach로 돌면서 그 리스트를 `remove`하면 보통 `ConcurrentModificationException`이 나요.
- 👀 **Set Interface**: Set = 중복 없는 모음. 새 메서드는 없고 "중복 금지"라는 규칙만 추가해요.
- ⌨️ **[Set implementation](#practice-2)**:  (⌨️ HashSet, LinkedHashSet, TreeSet에 같은 도시를 넣고 출력 순서 비교)
- 👀 **equals() and hashCode() in a HashSet**: Book 두 개는 내용이 같아도 다른 객체라서, `equals`와 `hashCode`를 override하지 않으면 HashSet에 둘 다 들어가요.
- 👀 **Set and List Performance**: 5000개 `contains` 실험: HashSet 약 20ms vs ArrayList 약 40,000ms.
- 👀 **The Map Interface**: Map = 사전. 단어(key)로 뜻(value)을 찾아요.
- 👀 **Map methods**: Map<String, Integer> m = new HashMap<>();
- 👀 **Hash Table**: 해시 테이블 원리: key → `hashCode()` → 버킷 번호 → 그 버킷의 연결 리스트에서 `equals`로 찾기.
- ⌨️ **[Map Implementation](#practice-3)**:  (⌨️ HashMap, TreeMap, LinkedHashMap에 같은 이름과 나이를 넣고 출력 순서 비교)
- 👀 **keySet and values**: `for (String name : ages.keySet())`로 key를 돌고 `ages.get(name)`으로 값을 꺼내요.
- 👀 **Reversing a map**: GPA → 이름으로 뒤집으면 3.6인 사람이 두 명인데 key는 하나라 마지막 put만 남아요(Stef가 Jared를 덮어씀).

</div>

> 원문 출처: APD545 Week 3 · Segment 1 "Collection Framework" 강의 슬라이드 (Mahboob Ali, Seneca) 핵심 문장 발췌

### 📑 Outcomes

> Understanding of Collections: Lists, Sets, Maps

**🇰🇷 한글 해설**

이번 세그먼트 목표: **List, Set, Map** 이해하기.

### 📑 The Collection

> A collection is a container object that represents a group of objects, often referred to as elements. Examples: a poker hand (collection of cards), a mail folder (collection of letters), a telephone directory (mapping of names to phone numbers).

**🇰🇷 한글 해설**

컬렉션 = 객체 여러 개를 담는 **그릇 객체**. 카드 패(목록), 편지함(목록), 전화번호부(이름 → 번호 짝)처럼 일상의 "모음"을 코드로 옮긴 거예요. 배열과 달리 **크기가 자동으로** 늘고 줄어요.

### 📑 Collection interface hierarchy

> The **Collection** interface is the root interface for manipulating a collection of objects. `java.util` contains all the collections framework interfaces. Sub-interfaces: **Set, List, Queue, Deque**. (Map is a separate hierarchy.)

```java
public interface Collection<E> extends Iterable<E> { ... }
```

> `<E>` tells you that the interface is generic. `Iterable<T>` is from `java.lang` with one method `iterator()`, so any collection can be used in a for-each loop.

**🇰🇷 한글 해설**

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

### 📑 Collection Example (Basic)


<p class="typeit" id="practice-1">⌨️ <b>이 코드는 IntelliJ에서 직접 쳐 보세요</b>: collection1, collection2로 addAll, retainAll, removeAll 결과를 직접 확인</p>

```java
ArrayList<String> collection1 = new ArrayList<>();
collection1.add("New York");
collection1.add("Atlanta");
collection1.add("Dallas");
collection1.add("Madison");
System.out.println(collection1.contains("Dallas"));   // true
collection1.remove("Dallas");
System.out.println(collection1.size());               // 3

Collection<String> collection2 = new ArrayList<>();
collection2.add("Seattle");
collection2.add("Portland");
collection2.add("Los Angeles");
collection2.add("Atlanta");

ArrayList<String> c1 = (ArrayList<String>) collection1.clone();
c1.addAll(collection2);      // union:        [New York, Atlanta, Madison, Seattle, Portland, Los Angeles, Atlanta]
c1 = (ArrayList<String>) collection1.clone();
c1.retainAll(collection2);   // intersection: [Atlanta]
c1 = (ArrayList<String>) collection1.clone();
c1.removeAll(collection2);   // difference:   [New York, Madison]
```

**🇰🇷 한글 해설**

집합 연산 세 개를 기억하세요.

- `addAll` = **합집합** (List라서 중복 Atlanta가 두 번 들어가요)
- `retainAll` = **교집합** (둘 다에 있는 것만 남김)
- `removeAll` = **차집합** (상대에 있는 것 빼기)

`clone()`으로 복사본을 만든 다음 연산하는 이유: 원본 `collection1`을 망가뜨리지 않으려고요. `clone()`은 `Object`를 돌려주니까 `(ArrayList<String>)` 캐스팅이 필요해요.

`collection2`는 `Collection<String>` 타입으로 선언했어요. **인터페이스 타입으로 선언**하는 습관, Week 2에서 배운 거죠.

### 📑 Collection vs Collections

> `Collection` is the root **interface**. `Collections` is a **utility class** with static methods such as `sort`, `shuffle`, `max`.

**🇰🇷 한글 해설**

`Collection`(s 없음) = 인터페이스, `Collections`(s 있음) = 정적 메서드 모음 클래스. 예: `Collections.sort(list)`, `Collections.shuffle(list)`, `Collections.max(list)`. `Arrays`(배열 도우미)와 `Array`의 관계와 같아요.

### 📑 Java ArrayList

> - Uses a **dynamic array** for storing the elements. There is no size limit.
> - Can have **duplicate** elements. Maintains the **insertion order**.
> - Implements the List interface.

**🇰🇷 한글 해설**

ArrayList = **자동으로 커지는 배열**. C++의 `vector`와 같아요. 중복 허용, 넣은 순서 유지.

### 📑 Non-generic vs Generic Collection

> Java generic collection allows you to have only one type of object in a collection. Now it is **type-safe**, so typecasting is not required at runtime. If you try to add another type of object, it gives a **compile-time error**.

```java
ArrayList list = new ArrayList();                  // old non-generic (raw)
ArrayList<String> list = new ArrayList<String>();  // generic
```

**🇰🇷 한글 해설**

옛날 방식 `ArrayList list = new ArrayList();`(raw type)은 아무 타입이나 들어가서, 꺼낼 때 캐스팅해야 하고 잘못 넣으면 **실행 중에** 터져요. `ArrayList<String>`처럼 타입을 정하면 다른 타입을 넣는 순간 **컴파일 에러**로 막아 줘요. 오른쪽은 `new ArrayList<>()`처럼 **다이아몬드**로 줄여 써요.

### 📑 ArrayList VS Vector

> | ArrayList | Vector |
> | --- | --- |
> | not synchronized, so **fast** | **synchronized** (thread-safe), so slower |
> | grows by **50%** | grows by **100%** (doubles) |
> | not legacy (JDK 1.2) | legacy class |
> | Iterator | Iterator or Enumeration |

**🇰🇷 한글 해설**

요즘 코드는 거의 ArrayList예요. Vector는 모든 메서드가 `synchronized`(한 번에 한 스레드만)라서 안전하지만 느려요. 시험에는 표의 숫자(**50% vs 100%**)와 "Vector is legacy"가 나와요. 스레드 안전은 Week 11에서 다시 봐요.

### 📑 The List

> A List stores **duplicate** elements, lets the user specify **where** the element is stored, and access the element **by index** (0-based).

```java
List<Integer> arrayList  = new ArrayList<>();
List<Integer> linkedList = new LinkedList<>();
```

**🇰🇷 한글 해설**

List의 세 가지 특징: **순서**, **중복 허용**, **인덱스 접근**. 선언은 `List<Integer> list = new ArrayList<>();`처럼 왼쪽 인터페이스, 오른쪽 구현.

### 📑 ArrayList methods

> | method | meaning |
> | --- | --- |
> | `add(value)` / `add(index, value)` | append / insert, shifting later values right |
> | `get(index)` / `set(index, value)` | read / replace |
> | `remove(index)` / `remove(value)` | remove by position / by value |
> | `indexOf(value)` / `lastIndexOf(value)` | first / last index, **-1 if not found** |
> | `contains(value)`, `size()`, `clear()`, `isEmpty()` | |
> | `subList(from, to)` | from **inclusive**, to **exclusive** |

**🇰🇷 한글 해설**

헷갈리는 두 개:

```java
List<Integer> l = new ArrayList<>(List.of(10, 20, 30, 40));
l.remove(1);                    // 인덱스 1 삭제 → [10, 30, 40]
l.remove(Integer.valueOf(30));  // 값 30 삭제   → [10, 40]
```

`Integer` 리스트에서 `remove(1)`은 **인덱스**로 해석돼요. 값으로 지우려면 `Integer.valueOf(...)`로 감싸요. (직접 돌려서 확인했어요.)

`add(index, value)`는 그 자리에 **끼워 넣고** 뒤를 밀어요. `set(index, value)`는 **바꿔치기**예요.

### 📑 Two Ways to Implement Lists

> - **Array**: if the capacity is exceeded, create a new larger array and copy. ArrayList default capacity is 10, increased by 50%. Fast random access O(1). `add(index, e)` and `remove(index)` shift elements: O(n). `contains()`, `indexOf()` use `equals()`: O(n).
> - **Linked list**: a linked structure consists of nodes. Each node holds an element and a link to its next neighbor. Efficient for adding and removing anywhere.

```java
class Node<E> {
    E element;
    Node<E> next;
    public Node(E o) { element = o; }
}

Node<String> head = new Node<>("Chicago");
Node<String> tail = head;
tail.next = new Node<>("Denver");
tail = tail.next;
```

**🇰🇷 한글 해설**

| | ArrayList (배열) | LinkedList (노드) |
| --- | --- | --- |
| `get(i)` | O(1) 빠름 | O(n) 앞에서부터 따라감 |
| 중간 `add`, `remove` | O(n) 밀고 당김 | 위치만 알면 O(1) |
| 메모리 | 값만 | 값 + 다음 노드 주소 |

노드 코드: `head`는 첫 노드, `tail`은 마지막 노드. 새 노드 추가는 `tail.next = new Node<>(...)` 후 `tail = tail.next`. 빈 리스트면 head, tail 둘 다 `null`.

`contains`, `indexOf`는 둘 다 처음부터 **`equals()`로** 하나씩 비교해서 O(n). 검색이 잦으면 HashSet(O(1))을 쓰라는 게 슬라이드 결론이에요.

### 📑 Examining List

> Elements of Sets and Maps can't be accessed by index; must use a "foreach" loop. Problem: **foreach is read-only**; cannot modify while looping.

```java
for (int score : scores) {
    if (score < 60) {
        scores.remove(score);   // throws ConcurrentModificationException
    }
}
```

**🇰🇷 한글 해설**

foreach로 돌면서 그 리스트를 `remove`하면 보통 **`ConcurrentModificationException`**이 나요. 해결은 Segment 2의 **Iterator의 `remove()`**:

```java
Iterator<Integer> it = scores.iterator();
while (it.hasNext()) {
    if (it.next() < 60) it.remove();
}
```

또는 Java 8부터 `scores.removeIf(s -> s < 60);` 한 줄.

### 📑 Set Interface

> The Set interface extends Collection. It does not introduce new methods, but it stipulates that an instance of Set contains **no duplicate elements**: no two elements e1 and e2 such that `e1.equals(e2)` is true.

**🇰🇷 한글 해설**

Set = **중복 없는** 모음. 새 메서드는 없고 "중복 금지"라는 **규칙**만 추가해요. 중복 판단은 `equals()`로 해요 (HashSet은 `hashCode()`도 같이).

### 📑 Set implementation

> - **HashSet**: hash table. Very fast O(1). Elements stored in **unpredictable order**. Default capacity 16, load factor 0.75. Internally uses HashMap.
> - **LinkedHashSet**: O(1), but stores in **order of insertion**.
> - **TreeSet**: binary search tree. O(log N). Elements stored in **sorted order**. `first()`, `last()`.


<p class="typeit" id="practice-2">⌨️ <b>이 코드는 IntelliJ에서 직접 쳐 보세요</b>: HashSet, LinkedHashSet, TreeSet에 같은 도시를 넣고 출력 순서 비교</p>

```java
Set<String> set = new HashSet<>();
set.add("London");
set.add("Paris");
set.add("New York");
set.add("New York");          // added twice, kept once
System.out.println(set.size());  // 3
set.forEach(e -> System.out.print(e.toLowerCase() + " "));
```

**🇰🇷 한글 해설**

세 개의 차이는 **순서**예요. 같은 도시를 넣었을 때 (직접 돌린 결과):

- `HashSet`: `[San Francisco, Beijing, New York, London, Paris]` 순서 뒤죽박죽
- `LinkedHashSet`: `[London, Paris, New York, San Francisco, Beijing]` 넣은 순서
- `TreeSet`: `[Beijing, London, New York, Paris, San Francisco]` 알파벳 순

"New York"을 두 번 넣어도 **하나만** 남아요. `set.forEach(e -> ...)`는 Week 10 람다 미리보기예요.

### 📑 equals() and hashCode() in a HashSet

```java
Book book1 = new Book("Walden", "Henry Thoreau", 1854);
Book book2 = new Book("Walden", "Henry Thoreau", 1854);
Set<Book> set2 = new HashSet<>();
set2.add(book1);
set2.add(book2);
System.out.println(set2.size());   // 2 without equals/hashCode, 1 after overriding both
```

**🇰🇷 한글 해설**

Book 두 개는 내용이 같아도 **다른 객체**라서, `equals`와 `hashCode`를 override하지 않으면 HashSet에 **둘 다** 들어가요. (기본 `equals`는 주소 비교.)

규칙: **equals가 true인 두 객체는 hashCode도 같아야** 해요. HashSet은 먼저 hashCode로 버킷을 찾고, 그 안에서 equals로 비교하거든요. 하나만 override하면 중복이 안 걸러져요.

### 📑 Set and List Performance

> Conclusion: **Sets are more efficient than Lists** for testing whether an element is in a set or list.

**🇰🇷 한글 해설**

5000개 `contains` 실험: HashSet 약 20ms vs ArrayList 약 40,000ms. "이게 있나?"를 자주 물으면 **Set**이 압도적으로 빨라요.

### 📑 The Map Interface

> A Map stores a collection of **key/value pairs**. The keys are like indexes. In List, the indexes are integer. In Map, the keys can be any objects. **Cannot contain duplicate keys.** Each key maps to one value.

**🇰🇷 한글 해설**

Map = **사전**. 단어(key)로 뜻(value)을 찾아요. List의 인덱스가 0, 1, 2 정수라면 Map의 key는 아무 객체(보통 String, Integer). key는 중복 불가, value는 중복 가능.

### 📑 Map methods

> | method | meaning |
> | --- | --- |
> | `put(key, value)` | adds a mapping; **if the key already exists, replaces its value** |
> | `get(key)` | value for the key (**null if not found**) |
> | `containsKey(key)`, `containsValue(v)`, `remove(key)`, `size()` | |
> | `keySet()` | a **Set** of all keys |
> | `values()` | a **Collection** of all values |
> | `entrySet()` | a Set of entries (key + value) |

**🇰🇷 한글 해설**

꼭 알 것:

```java
Map<String, Integer> m = new HashMap<>();
m.put("a", 1);     // null 반환 (이전 값 없음)
m.put("a", 2);     // 1 반환, 값이 2로 덮어써짐
m.get("a");        // 2
m.get("z");        // null (없는 key)
```

순회 세 가지: `keySet()`(key만, Set), `values()`(value만, Collection), `entrySet()`(둘 다, `entry.getKey()`, `entry.getValue()`).

### 📑 Hash Table

> Each slot in an array is a **bucket** that references a linked list of mappings. Hash function: bucket # = f(key, array-size), e.g. `key % array-size`. In Java: `hash(key.hashCode())`, then `hash & (length - 1)`. Insertion uses separate chaining: if a mapping with the key exists, **overwrite** the value. Load factor decides when to resize (rehashing).

**🇰🇷 한글 해설**

해시 테이블 원리: key → `hashCode()` → 버킷 번호 → 그 버킷의 연결 리스트에서 `equals`로 찾기. 그래서 평균 **O(1)**.

- 같은 버킷에 여러 개가 들어가는 걸 충돌(collision)이라 하고, 리스트로 이어 붙이는 방식이 **separate chaining**.
- **load factor 0.75**: 75% 차면 배열을 키우고 전부 다시 배치(rehashing, 비쌈).
- HashMap은 null key **하나** 허용, TreeMap은 null key 불가(정렬 비교를 못 하니까).

### 📑 Map Implementation

> - **HashMap**: fast, entries in random order. One null key allowed.
> - **TreeMap**: entries in **increasing order of the keys**.
> - **LinkedHashMap**: nearly as fast as HashMap, entries in **insertion order**.


<p class="typeit" id="practice-3">⌨️ <b>이 코드는 IntelliJ에서 직접 쳐 보세요</b>: HashMap, TreeMap, LinkedHashMap에 같은 이름과 나이를 넣고 출력 순서 비교</p>

```java
Map<String, Integer> hashMap = new HashMap<>();
hashMap.put("Smith", 30);
hashMap.put("Anderson", 31);
hashMap.put("Lewis", 29);
hashMap.put("Cook", 29);

Map<String, Integer> treeMap = new TreeMap<>(hashMap);
System.out.println(treeMap);   // {Anderson=31, Cook=29, Lewis=29, Smith=30}

treeMap.forEach((name, age) -> System.out.print(name + ": " + age + " "));
```

**🇰🇷 한글 해설**

Set과 똑같은 3종 세트예요 (실제로 HashSet 안에 HashMap이 들어 있어요).

- `HashMap`: `{Lewis=29, Smith=30, Cook=29, Anderson=31}` 순서 예측 불가
- `TreeMap`: `{Anderson=31, Cook=29, Lewis=29, Smith=30}` **key** 알파벳 순
- `LinkedHashMap`: `{Smith=30, Anderson=31, Lewis=29, Cook=29}` 넣은 순서

참고: 슬라이드의 LinkedHashMap 출력은 `{Smith=30, Anderson=31, Cook=29, Lewis=29}`로 적혀 있지만, 넣은 순서가 Smith, Anderson, Lewis, Cook이라 **Lewis가 Cook보다 먼저** 나와야 맞아요.

`treeMap.forEach((name, age) -> ...)`: Map의 forEach는 매개변수가 **두 개**(key, value)예요.

### 📑 keySet and values

```java
Map<String, Integer> ages = new TreeMap<>();
ages.put("Marty", 19);
ages.put("Geneva", 2);
ages.put("Vicki", 57);
for (String name : ages.keySet()) {
    int age = ages.get(name);
    System.out.println(name + " -> " + age);
}
```

**🇰🇷 한글 해설**

`for (String name : ages.keySet())`로 key를 돌고 `ages.get(name)`으로 값을 꺼내요. TreeMap이라 Geneva, Marty, Vicki 순으로 나와요.

참고: 원래 슬라이드는 `ages.get(age)`로 적혀 있는데, `age`는 아직 선언 전이라 컴파일 에러예요. `ages.get(name)`이 맞아요.

### 📑 Reversing a map

> More than one TA can have the same GPA. The map will store **only the last mapping** we add. Really each GPA maps to a collection of people:

```java
Map<Double, Set<String>> taGpa = new HashMap<>();
taGpa.put(3.6, new TreeSet<>());
taGpa.get(3.6).add("Jared");
taGpa.get(3.6).add("Stef");
System.out.println(taGpa.get(3.6));   // [Jared, Stef]
```

**🇰🇷 한글 해설**

GPA → 이름으로 뒤집으면 3.6인 사람이 두 명인데 key는 하나라 **마지막 put만 남아요**(Stef가 Jared를 덮어씀). 해결: value를 **Set**으로 해서 `Map<Double, Set<String>>`. 주의: `get(3.6).add(...)` 전에 그 key에 빈 Set을 **먼저 put**해야 해요. 안 하면 `get`이 null이라 `NullPointerException`.

Java 8 이후 한 줄 버전: `taGpa.computeIfAbsent(3.6, k -> new TreeSet<>()).add("Jared");`


---

## 2. 📑 강의 슬라이드: Week 3 · Segment 2. Java Iterators

<div class="sum" data-kind="read">

**🧭 먼저 한국어로** · 👀 읽고 이해하기 (타이핑 안 해도 돼요)

컬렉션을 하나씩 걸어가며 보는 **커서**(Iterator)예요. 짧지만 "순회 중 안전하게 지우기"가 시험에 잘 나와요.

**이 챕터 구성**

- 👀 **Iterators**: Iterator = 컬렉션 위의 책갈피. 어느 컬렉션이든 같은 방법(`hasNext`, `next`)으로 돌 수 있어서 "Universal Cursor"라고 불러요.
- 👀 **The three methods**: 패턴은 항상 `hasNext()`로 확인 → `next()`로 꺼내기.
- ⌨️ **[Iterator example](#practice-4)**:  (⌨️ flowers 리스트를 Iterator로 출력하고, 이어서 "s"로 시작하는 꽃만 it.remove()로 지워 보기)
- 👀 **Limitations of Iterator Interface**: Iterator는 앞으로만, 읽기와 삭제만. 뒤로 가기나 `set`, `add`가 필요하면 List 전용 `ListIterator`(`hasPrevious`, `previous`, `set`, `add`)를 써요.
- 👀 **Iterator VS Iterable**: Iterable: "나는 돌 수 있어" 능력. 메서드 `iterator()` 하나.
- 👀 **Java Iterator VS C++ Iterator**: C++은 `it != v.end()`로 끝을 직접 비교하고 `++it`, `--it`, `*it = x`가 다 돼요.

</div>

> 원문 출처: APD545 Week 3 · Segment 2 "Java Iterators" 강의 슬라이드 (Mahboob Ali, Seneca) 핵심 문장 발췌

### 📑 Iterators

> An Iterator is a construct/object that is used to traverse or step through the collection. It is part of `java.util`. Types: Enumerator, Iterator, ListIterator. Popularly known as **"Universal Java Cursor"** as it works with all collections. Supports 'read' and 'remove' operations.

**🇰🇷 한글 해설**

Iterator = 컬렉션 위의 **책갈피**. 어느 컬렉션이든 같은 방법(`hasNext`, `next`)으로 돌 수 있어서 "Universal Cursor"라고 불러요. 옛날 Vector에서 쓰던 `Enumeration`을 대체했어요.

### 📑 The three methods

> - `E next()`: returns the next element. If there are no more elements, throws **NoSuchElementException**.
> - `boolean hasNext()`: checks if there are more elements; use it to decide if `next()` is to be called.
> - `void remove()`: removes the last element returned by the iterator. Can be called **only once per next()** call. Throws **IllegalStateException** if `next` has not been called yet.

**🇰🇷 한글 해설**

패턴은 항상 **`hasNext()`로 확인 → `next()`로 꺼내기**. 확인 없이 `next()`를 부르다 끝을 넘으면 `NoSuchElementException`.

`remove()`는 **방금 `next()`로 받은 것**을 지워요. 그래서 `next()` 없이 `remove()`를 부르거나, 한 번의 `next()` 뒤에 `remove()`를 두 번 부르면 `IllegalStateException`.

### 📑 Iterator example


<p class="typeit" id="practice-4">⌨️ <b>이 코드는 IntelliJ에서 직접 쳐 보세요</b>: flowers 리스트를 Iterator로 출력하고, 이어서 &quot;s&quot;로 시작하는 꽃만 it.remove()로 지워 보기</p>

```java
List<String> flowers = new ArrayList<>();
flowers.add("Rose");
flowers.add("Jasmine");
flowers.add("sunflower");

Iterator<String> flowersIterator = flowers.iterator();
while (flowersIterator.hasNext()) {
    System.out.print(flowersIterator.next() + " ");
}
```

**🇰🇷 한글 해설**

`flowers.iterator()`로 Iterator를 얻고 while로 돌아요. 출력: `Rose Jasmine sunflower `.

foreach `for (String f : flowers)`도 내부적으로는 이 Iterator를 써요. 차이는 foreach에서는 `remove`를 할 수 없다는 것.

### 📑 Limitations of Iterator Interface

> - Cannot replace an element or add a new element.
> - Proceeds only in **one direction** (forward). Supports only sequential iteration.

**🇰🇷 한글 해설**

Iterator는 **앞으로만**, **읽기와 삭제만**. 뒤로 가기나 `set`, `add`가 필요하면 List 전용 **`ListIterator`**(`hasPrevious`, `previous`, `set`, `add`)를 써요.

### 📑 Iterator VS Iterable

> Though they sound similar, they are completely different. A class that implements **Iterable** acquires the ability to be iterated (it has `iterator()`, and works with for-each). **Iterator** is the object that does the stepping (`hasNext`, `next`, `remove`).

**🇰🇷 한글 해설**

- **Iterable**: "나는 돌 수 있어" 능력. 메서드 `iterator()` 하나. 구현하면 foreach 가능.
- **Iterator**: 실제로 도는 **커서 객체**. `hasNext`, `next`, `remove`.

비유: Iterable은 책, Iterator는 그 책에 꽂힌 책갈피.

### 📑 Java Iterator VS C++ Iterator

> Java iterators are read-only, forward-only (like C++ input iterators) and know their limit (`hasNext`). C++ iterators can go backwards, write, random access, and the limit is checked by comparing with `end()`. Java iterators can't be copied.

**🇰🇷 한글 해설**

C++은 `it != v.end()`로 끝을 직접 비교하고 `++it`, `--it`, `*it = x`가 다 돼요. Java Iterator는 `hasNext()`가 끝을 알고, **앞으로만, 읽기 전용**(삭제만 예외)이에요.


---

## 3. 📑 강의 슬라이드: Week 3 · Segment 3. Generics

<div class="sum" data-kind="read">

**🧭 먼저 한국어로** · 👀 읽고 이해하기 (타이핑 안 해도 돼요)

`List<String>`의 `<String>`이 무엇인지, 내 클래스에 `<T>`를 붙이는 법을 배워요. C++ template과 비슷하지만 **컴파일할 때만** 존재해요(type erasure).

**이 챕터 구성**

- 👀 **What is Generics?**: 제네릭 = 타입을 매개변수로 받기. 메서드에 값을 넘기듯이 클래스에 타입을 넘겨요.
- 👀 **Motivation**: `Object`로 다 받으면 아무거나 들어가서 편하지만, 꺼낼 때 캐스팅이 필요하고 잘못된 타입이면 실행 중 `ClassCastException`.
- ⌨️ **[Generic class](#practice-5)**:  (⌨️ Store<T>를 만들고 Store<String>에 숫자를 넣으면 컴파일 에러가 나는지 확인)
- 👀 **Generic Type and Parameterized Type**: `Store<T>`: generic type, T는 type parameter(형식)
- 👀 **Type Parameter Naming Conventions**: 관례일 뿐 문법은 아니에요. `List<E>`, `Map<K, V>`가 이 관례예요.
- 👀 **Multiple Type Parameters**: 쉼표로 여러 개: `Pair<K, V>`. `OrderedPair<String, Integer> p1 = new OrderedPair<>("One", 1);`에서 `1`은 int인데 Integer로 자동 박싱돼요.
- 👀 **Why Generics: Benefits**: 세 가지: 더 강한 타입 검사, 캐스팅 제거, 타입 안전.
- ⌨️ **[Generic Class example: GenericBox](#practice-6)**:  (⌨️ GenericBox를 쳐서 String, Integer, Double 세 상자의 toString 출력 확인)
- 👀 **Type Erasure**: 컴파일러가 하는 일: (1) 타입 검사, (2) T를 Object로 지우기, (3) 꺼내는 곳에 캐스팅 자동 삽입.
- 👀 **Raw Types**: raw type = 타입 인자를 안 붙인 제네릭(`Store`, `ArrayList`).
- 👀 **Generic method**: 메서드에만 타입 매개변수: 반환 타입 앞에 `<T>`.
- 👀 **Restrictions**: 기본형 불가: `Store<int>` X → `Store<Integer>` O.

</div>

> 원문 출처: APD545 Week 3 · Segment 3 "Generics (Templates)" 강의 슬라이드 (Mahboob Ali, Seneca) 핵심 문장 발췌

### 📑 What is Generics?

> Generics adds stability to your code by **detecting bugs on the compile time**. Generics is the capability to **parameterize types**: we can pass types as arguments when defining classes, interfaces and methods.

**🇰🇷 한글 해설**

제네릭 = **타입을 매개변수로 받기**. 메서드에 값을 넘기듯이 클래스에 타입을 넘겨요. 목적은 버그를 **실행 전(컴파일)에** 잡는 것.

### 📑 Motivation

> A `Store` holding `Object` is too generic: explicit casting, and a **ClassCastException at runtime** if someone stores a different type.

```java
class Store {
    private Object a;
    public void set(Object a) { this.a = a; }
    public Object get() { return a; }
}

Store store = new Store();
store.set("hello");                 // someone stores a String
Integer n = (Integer) store.get();  // compiles, but ClassCastException at runtime
```

**🇰🇷 한글 해설**

`Object`로 다 받으면 아무거나 들어가서 편하지만, 꺼낼 때 **캐스팅**이 필요하고 잘못된 타입이면 **실행 중 `ClassCastException`**. 컴파일러가 못 잡아요.

참고: 원래 슬라이드는 `java.util.Date`와 `java.sql.Date`로 이 예를 드는데, `java.sql.Date`는 `java.util.Date`의 **자식**이라 그 캐스팅은 실제로는 성공해요. 그래서 여기서는 String과 Integer로 바꿔서 보여 줬어요.

### 📑 Generic class

> Generics was introduced to solve this. Generics is **purely compile time** concept.


<p class="typeit" id="practice-5">⌨️ <b>이 코드는 IntelliJ에서 직접 쳐 보세요</b>: Store&lt;T&gt;를 만들고 Store&lt;String&gt;에 숫자를 넣으면 컴파일 에러가 나는지 확인</p>

```java
class Store<T> {
    private T a;
    public void set(T a) { this.a = a; }
    public T get() { return a; }
}

Store<Book> store = new Store<>();   // diamond notation (Java 7)
store.set(new Book());
Book b = store.get();                // no cast
```

**🇰🇷 한글 해설**

`class Store<T>`: T 자리에 나중에 실제 타입이 들어가요. `Store<Book>`이면 `set(Book)`, `Book get()`이 되는 것처럼 동작해요. 다른 타입을 넣으면 **컴파일 에러**, 꺼낼 때 **캐스팅 불필요**.

### 📑 Generic Type and Parameterized Type

> - `class Store<T>`: **generic type**, `T` is the type parameter (formal).
> - `Store<String>`: **parameterized type**, `String` is the type argument (actual).

**🇰🇷 한글 해설**

용어 두 쌍:

- `Store<T>`: **generic type**, T는 **type parameter**(형식)
- `Store<String>`: **parameterized type**, String은 **type argument**(실제)

메서드의 매개변수(parameter)와 인자(argument) 관계랑 똑같아요.

### 📑 Type Parameter Naming Conventions

> Single uppercase letters: **E** Element (Collections), **K** Key, **V** Value (Maps), **N** Number, **T** Type, **S, U, V** 2nd, 3rd, 4th types.

**🇰🇷 한글 해설**

관례일 뿐 문법은 아니에요. `List<E>`, `Map<K, V>`가 이 관례예요.

### 📑 Multiple Type Parameters

```java
public interface Pair<K, V> {
    K getKey();
    V getValue();
}

public class OrderedPair<K, V> implements Pair<K, V> {
    private K key;
    private V value;
    public OrderedPair(K key, V value) { this.key = key; this.value = value; }
    public K getKey() { return key; }
    public V getValue() { return value; }
}

OrderedPair<String, Integer> p1 = new OrderedPair<>("One", 1);
```

**🇰🇷 한글 해설**

쉼표로 여러 개: `Pair<K, V>`. `OrderedPair<String, Integer> p1 = new OrderedPair<>("One", 1);`에서 `1`은 int인데 Integer로 **자동 박싱**돼요. Week 6 `Dialog`의 `Pair<String, String>`이 바로 이거예요.

### 📑 Why Generics: Benefits

> - **Stronger type checking**: `list.add(32)` on a `List<String>` is a compile-time error.
> - **Casting can be eliminated**: `String s = list.get(0);`
> - **Type safety**: holds only a single type of objects.

**🇰🇷 한글 해설**

세 가지: **더 강한 타입 검사**, **캐스팅 제거**, **타입 안전**. 한 문장: 실행 중 에러를 컴파일 에러로 바꿔 준다.

### 📑 Generic Class example: GenericBox


<p class="typeit" id="practice-6">⌨️ <b>이 코드는 IntelliJ에서 직접 쳐 보세요</b>: GenericBox를 쳐서 String, Integer, Double 세 상자의 toString 출력 확인</p>

```java
public class GenericBox<E> {
    private E content;
    public GenericBox(E content) { this.content = content; }
    public E getContent() { return content; }
    public String toString() { return content + " (" + content.getClass() + ")"; }
}

GenericBox<Integer> box2 = new GenericBox<>(123);   // autobox int to Integer
int i = box2.getContent();                          // unbox
System.out.println(box2);                           // 123 (class java.lang.Integer)
```

**🇰🇷 한글 해설**

출력:

```
Hello (class java.lang.String)
123 (class java.lang.Integer)
55.66 (class java.lang.Double)
```

`int i = box2.getContent();`: Integer가 int로 자동 **언박싱**. `content.getClass()`는 실행 중 **실제** 객체 타입을 알려줘요.

### 📑 Type Erasure

> When a generic type is instantiated, the compiler translates those types by a technique called **type erasure**: it replaces all references to the type parameter with **Object**, performs the type check, and inserts the required downcast operators.

**🇰🇷 한글 해설**

컴파일러가 하는 일: (1) 타입 검사, (2) T를 **Object**로 지우기, (3) 꺼내는 곳에 캐스팅 자동 삽입. 그래서 실행 중에는 `List<String>`과 `List<Integer>`가 **같은 클래스**예요. "Generics is purely compile time concept"의 뜻이에요.

### 📑 Raw Types

> A raw type is the name of a generic class without any type arguments: `Store rawStore = new Store();`. **Avoid raw types**: not type safe, possible runtime error, require casting.

**🇰🇷 한글 해설**

raw type = 타입 인자를 안 붙인 제네릭(`Store`, `ArrayList`). 옛날 코드 호환용이라 쓰지 말라는 경고가 나와요.

### 📑 Generic method

> Type parameters can also be declared within method signatures. The type parameter's scope is limited to the method.

```java
public static <T> boolean isEqual(GenericsType<T> g1, GenericsType<T> g2) {
    return g1.get().equals(g2.get());
}

boolean same = GenericsMethods.<String>isEqual(g1, g2);
same = GenericsMethods.isEqual(g1, g2);   // type inferred
```

**🇰🇷 한글 해설**

메서드에만 타입 매개변수: **반환 타입 앞에 `<T>`**.

```java
public static <T> boolean isEqual(GenericsType<T> g1, GenericsType<T> g2)
```

부를 때 `GenericsMethods.<String>isEqual(g1, g2)`처럼 명시해도 되고, 보통은 생략해요(컴파일러가 추론).

### 📑 Restrictions

> - Type argument **cannot be a primitive**: `Store<int>` is an error. Use `Store<Integer>`.
> - Type parameter **cannot be used in a static context**: `private static T deviceType;` is an error (T would be Smartphone or Pager?).

**🇰🇷 한글 해설**

두 가지 제한:

1. **기본형 불가**: `Store<int>` X → `Store<Integer>` O. (erasure로 Object가 되는데 int는 Object가 아니니까요.)
2. **static에 T 불가**: static 필드는 모든 객체가 공유하는데, `Device<Smartphone>`과 `Device<Pager>`가 같은 static을 쓰면 T가 무엇인지 정할 수 없어요.


---

## 4. 📑 강의 슬라이드: Week 3 · Segment 4. Service Layer

<div class="sum" data-kind="read">

**🧭 먼저 한국어로** · 👀 읽고 이해하기 (타이핑 안 해도 돼요)

비즈니스 규칙을 컨트롤러에서 꺼내 **서비스**로 모으는 이유예요. Week 6~7의 Service Pattern과 이어져요.

**이 챕터 구성**

- 👀 **Service Layer**: Service Layer = 앱의 규칙과 작업 흐름이 사는 곳.
- 👀 **Why do we use Service Layer?**: fat controller = 버튼 처리, 검증, 계산, 저장을 다 하는 뚱뚱한 컨트롤러.
- 👀 **Service Layer in the Example**: 폴더 구조가 곧 역할 분리예요: `controllers/`(사용자 동작), `services/`(규칙), `models/`(데이터).
- 👀 **Working in the Example**: 흐름: 입력 → 컨트롤러 → 서비스에 위임 → 서비스가 검증, 저장, 규칙 적용 → 결과를 컨트롤러로 → 화면.
- 👀 **Issuance Services**: "두 번 대출 불가", "사용자가 있어야 대출"은 business rule이에요.
- 👀 **Service Layer vs. Service Layer Design Pattern**: 이번 주는 "서비스로 나누기"까지만. 완전한 패턴은 인터페이스 + DI + stateless + Repository가 붙어요.

</div>

> 원문 출처: APD545 Week 3 · Segment 4 "Service Layer" 강의 슬라이드 (Mahboob Ali, Seneca) 핵심 문장 발췌

### 📑 Service Layer

> A Service Layer is a dedicated part of your application that contains **business logic**: the rules, operations, and workflows of your system. Purpose: keep controllers clean, centralize logic in one place, make code easier to maintain and test, promote modular design.

**🇰🇷 한글 해설**

Service Layer = 앱의 **규칙과 작업 흐름**이 사는 곳. 예: "책은 두 번 빌려줄 수 없다", "가입한 사용자만 빌릴 수 있다". 이런 건 화면(UI)과 상관없는 **업무 규칙**이에요.

### 📑 Why do we use Service Layer?

> - Avoids **"fat controllers"**
> - Encourages separation of concerns
> - Makes the system easier to extend
> - Allows reuse of logic across multiple controllers
>
> Key Concept: **Controllers coordinate, services think.**

**🇰🇷 한글 해설**

**fat controller** = 버튼 처리, 검증, 계산, 저장을 다 하는 뚱뚱한 컨트롤러. 고치기 어렵고 재사용이 안 돼요. 서비스로 빼면 다른 컨트롤러(웹, 콘솔)도 같은 규칙을 그대로 써요.

외울 문장: **"Controllers coordinate, services think."** 컨트롤러는 "누구에게 시킬지"만, 서비스가 "어떻게 할지"를 판단해요.

### 📑 Service Layer in the Example

> controllers/ handles user actions, services/ contains business logic, models/ holds data structures. LibraryController calls BookService, UserService, IssuanceService.

**🇰🇷 한글 해설**

폴더 구조가 곧 역할 분리예요: `controllers/`(사용자 동작), `services/`(규칙), `models/`(데이터). Week 5 MVC에 services 층이 하나 더 붙은 모양이에요.

### 📑 Working in the Example

> Controller receives input, delegates to a service (`bookService.addBook(book)`). Service validates, updates internal data, applies rules, and returns results. **Controller does NOT contain logic.**

**🇰🇷 한글 해설**

흐름: 입력 → 컨트롤러 → **서비스에 위임** → 서비스가 검증, 저장, 규칙 적용 → 결과를 컨트롤러로 → 화면. 컨트롤러에는 `if`로 규칙을 판단하는 코드가 **없어야** 해요.

### 📑 Issuance Services

> Handles rules like "A book cannot be issued twice" and "A user must exist before issuing". These are **business rules, not controller rules**.

**🇰🇷 한글 해설**

"두 번 대출 불가", "사용자가 있어야 대출"은 **business rule**이에요. 화면이 콘솔이든 JavaFX든 똑같이 지켜야 하니까 서비스 소속이에요.

### 📑 Service Layer vs. Service Layer Design Pattern

> What we implemented: a Service Layer. What we did NOT implement yet: the full Service Layer Design Pattern, which includes **interfaces, dependency injection, stateless services, repository layer**. Coming soon.

**🇰🇷 한글 해설**

이번 주는 "서비스로 나누기"까지만. 완전한 패턴은 **인터페이스 + DI + stateless + Repository**가 붙어요. 그게 Week 6 Segment 5와 Week 7 Guice에서 완성돼요. 지금 서비스는 `new BookService()`를 컨트롤러가 직접 하니까 DI가 아니에요.


---

## 5. 💻 교수님 샘플 코드: Week 3 · Sample: WK_3_DS_Lib_Service

<div class="sum" data-kind="read">

**🧭 먼저 한국어로** · 👀 읽고 이해하기 (타이핑 안 해도 돼요)

도서관 앱으로 Map과 Service Layer를 같이 써요. 교수님 코드에서 **규칙이 아직 컨트롤러에 남아 있는 부분**을 찾아보는 게 좋은 복습이에요.

**이 챕터 구성**

- 👀 **Project Structure**: models, services, controllers, views 네 층.
- ⌨️ **Example: BookService (HashMap by ISBN)**: ISBN을 key로 하는 `HashMap<String, Book>`.
- ⌨️ **Example: IssuanceService (LinkedHashMap + entrySet)**: 대출 기록은 LinkedHashMap: 대출한 순서대로 출력하려고요.
- ⌨️ **Example: LibraryController.issueBook**: 잘 보세요. "책이 있고, 사용자가 있고, 아직 대출 안 됐으면"이라는 업무 규칙 if문이 컨트롤러에 있어요.

</div>

> 원문 출처: APD545 Week 3 교수님 샘플 코드 WK_3_DS_Lib_Service 발췌 (구조와 핵심 메서드만)

### 💻 Project Structure

```jsx
ca.senecacollege
  models/       Book, User, BookIssueRecord, Library
  services/     BookService, UserService, IssuanceService, LibraryService
  controllers/  LibraryController
  views/        MainView
```

**🇰🇷 한글 해설**

models, services, controllers, views 네 층. MVC + Service예요.

### 💻 Example: BookService (HashMap by ISBN)

```java
public class BookService {
    private Map<String, Book> books;

    public BookService() { books = new HashMap<>(); }

    public void addBook(Book book)     { books.put(book.getIsbn(), book); }
    public Book getBook(String isbn)   { return books.get(isbn); }
    public void removeBook(String isbn){ books.remove(isbn); }

    public void displayBooks() {
        for (Book book : books.values()) System.out.println(book);
    }
}
```

**🇰🇷 한글 해설**

ISBN을 key로 하는 `HashMap<String, Book>`. ISBN으로 찾기, 지우기가 O(1)이에요. `books.values()`로 모든 책을 돌아요(순서는 보장 안 됨).

### 💻 Example: IssuanceService (LinkedHashMap + entrySet)

```java
public class IssuanceService {
    private Map<String, BookIssueRecord> issuedBooks = new LinkedHashMap<>();

    public void issueBook(String isbn, String userId, BookIssueRecord record) {
        issuedBooks.put(isbn, record);
    }

    public BookIssueRecord returnBook(String isbn) {
        return issuedBooks.remove(isbn);    // returns the removed value, or null
    }

    public void displayIssuedBooks() {
        for (Map.Entry<String, BookIssueRecord> entry : issuedBooks.entrySet()) {
            System.out.println(entry.getKey() + " -> " + entry.getValue().getUserId());
        }
    }
}
```

**🇰🇷 한글 해설**

대출 기록은 **LinkedHashMap**: 대출한 순서대로 출력하려고요. `entrySet()`으로 key(ISBN)와 value(기록)를 같이 꺼내요.

`returnBook`의 `issuedBooks.remove(isbn)`은 **지운 값**을 돌려주고, 없으면 `null`. 그래서 호출하는 쪽에서 `if (record != null)`로 반납 성공 여부를 알 수 있어요.

### 💻 Example: LibraryController.issueBook

```java
public void issueBook(String isbn, String userId) {
    if (bookService.getBook(isbn) != null &&
        userService.getUser(userId) != null &&
        issuanceService.getIssuedBooks().get(isbn) == null) {

        issuanceService.issueBook(isbn, userId, new BookIssueRecord(userId, new Date(), null));
        bookService.removeBook(isbn);
        System.out.println("Book issued");
    } else {
        System.out.println("Book can't be issued");
    }
}
```

**🇰🇷 한글 해설**

잘 보세요. "책이 있고, 사용자가 있고, 아직 대출 안 됐으면"이라는 **업무 규칙 if문이 컨트롤러에** 있어요. 슬라이드 원칙("Controller does NOT contain logic")대로라면 이 검사는 `IssuanceService.issue(isbn, userId)` 안으로 들어가야 해요. 시험에서 "이 코드에서 service로 옮겨야 할 부분은?"으로 나올 수 있는 모양이에요.


---

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
