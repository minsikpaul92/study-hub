Source: <APD545 Week 3 · Segment 1 "Collection Framework" 강의 슬라이드 (Mahboob Ali, Seneca) 핵심 문장 발췌>
# Week 3 · Segment 1. Java Collections Framework

## Outcomes

> Understanding of Collections: Lists, Sets, Maps

## The Collection

> A collection is a container object that represents a group of objects, often referred to as elements. Examples: a poker hand (collection of cards), a mail folder (collection of letters), a telephone directory (mapping of names to phone numbers).

## Collection interface hierarchy

> The **Collection** interface is the root interface for manipulating a collection of objects. `java.util` contains all the collections framework interfaces. Sub-interfaces: **Set, List, Queue, Deque**. (Map is a separate hierarchy.)

```java
public interface Collection<E> extends Iterable<E> { ... }
```

> `<E>` tells you that the interface is generic. `Iterable<T>` is from `java.lang` with one method `iterator()`, so any collection can be used in a for-each loop.

## Collection Example (Basic)

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

## Collection vs Collections

> `Collection` is the root **interface**. `Collections` is a **utility class** with static methods such as `sort`, `shuffle`, `max`.

## Java ArrayList

> - Uses a **dynamic array** for storing the elements. There is no size limit.
> - Can have **duplicate** elements. Maintains the **insertion order**.
> - Implements the List interface.

## Non-generic vs Generic Collection

> Java generic collection allows you to have only one type of object in a collection. Now it is **type-safe**, so typecasting is not required at runtime. If you try to add another type of object, it gives a **compile-time error**.

```java
ArrayList list = new ArrayList();                  // old non-generic (raw)
ArrayList<String> list = new ArrayList<String>();  // generic
```

## ArrayList VS Vector

> | ArrayList | Vector |
> | --- | --- |
> | not synchronized, so **fast** | **synchronized** (thread-safe), so slower |
> | grows by **50%** | grows by **100%** (doubles) |
> | not legacy (JDK 1.2) | legacy class |
> | Iterator | Iterator or Enumeration |

## The List

> A List stores **duplicate** elements, lets the user specify **where** the element is stored, and access the element **by index** (0-based).

```java
List<Integer> arrayList  = new ArrayList<>();
List<Integer> linkedList = new LinkedList<>();
```

## ArrayList methods

> | method | meaning |
> | --- | --- |
> | `add(value)` / `add(index, value)` | append / insert, shifting later values right |
> | `get(index)` / `set(index, value)` | read / replace |
> | `remove(index)` / `remove(value)` | remove by position / by value |
> | `indexOf(value)` / `lastIndexOf(value)` | first / last index, **-1 if not found** |
> | `contains(value)`, `size()`, `clear()`, `isEmpty()` | |
> | `subList(from, to)` | from **inclusive**, to **exclusive** |

## Two Ways to Implement Lists

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

## Examining List

> Elements of Sets and Maps can't be accessed by index; must use a "foreach" loop. Problem: **foreach is read-only**; cannot modify while looping.

```java
for (int score : scores) {
    if (score < 60) {
        scores.remove(score);   // throws ConcurrentModificationException
    }
}
```

## Set Interface

> The Set interface extends Collection. It does not introduce new methods, but it stipulates that an instance of Set contains **no duplicate elements**: no two elements e1 and e2 such that `e1.equals(e2)` is true.

## Set implementation

> - **HashSet**: hash table. Very fast O(1). Elements stored in **unpredictable order**. Default capacity 16, load factor 0.75. Internally uses HashMap.
> - **LinkedHashSet**: O(1), but stores in **order of insertion**.
> - **TreeSet**: binary search tree. O(log N). Elements stored in **sorted order**. `first()`, `last()`.

```java
Set<String> set = new HashSet<>();
set.add("London");
set.add("Paris");
set.add("New York");
set.add("New York");          // added twice, kept once
System.out.println(set.size());  // 3
set.forEach(e -> System.out.print(e.toLowerCase() + " "));
```

## equals() and hashCode() in a HashSet

```java
Book book1 = new Book("Walden", "Henry Thoreau", 1854);
Book book2 = new Book("Walden", "Henry Thoreau", 1854);
Set<Book> set2 = new HashSet<>();
set2.add(book1);
set2.add(book2);
System.out.println(set2.size());   // 2 without equals/hashCode, 1 after overriding both
```

## Set and List Performance

> Conclusion: **Sets are more efficient than Lists** for testing whether an element is in a set or list.

## The Map Interface

> A Map stores a collection of **key/value pairs**. The keys are like indexes. In List, the indexes are integer. In Map, the keys can be any objects. **Cannot contain duplicate keys.** Each key maps to one value.

## Map methods

> | method | meaning |
> | --- | --- |
> | `put(key, value)` | adds a mapping; **if the key already exists, replaces its value** |
> | `get(key)` | value for the key (**null if not found**) |
> | `containsKey(key)`, `containsValue(v)`, `remove(key)`, `size()` | |
> | `keySet()` | a **Set** of all keys |
> | `values()` | a **Collection** of all values |
> | `entrySet()` | a Set of entries (key + value) |

## Hash Table

> Each slot in an array is a **bucket** that references a linked list of mappings. Hash function: bucket # = f(key, array-size), e.g. `key % array-size`. In Java: `hash(key.hashCode())`, then `hash & (length - 1)`. Insertion uses separate chaining: if a mapping with the key exists, **overwrite** the value. Load factor decides when to resize (rehashing).

## Map Implementation

> - **HashMap**: fast, entries in random order. One null key allowed.
> - **TreeMap**: entries in **increasing order of the keys**.
> - **LinkedHashMap**: nearly as fast as HashMap, entries in **insertion order**.

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

## keySet and values

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

## Reversing a map

> More than one TA can have the same GPA. The map will store **only the last mapping** we add. Really each GPA maps to a collection of people:

```java
Map<Double, Set<String>> taGpa = new HashMap<>();
taGpa.put(3.6, new TreeSet<>());
taGpa.get(3.6).add("Jared");
taGpa.get(3.6).add("Stef");
System.out.println(taGpa.get(3.6));   // [Jared, Stef]
```
