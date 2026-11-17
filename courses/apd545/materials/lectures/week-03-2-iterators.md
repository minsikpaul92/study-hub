Source: <APD545 Week 3 · Segment 2 "Java Iterators" 강의 슬라이드 (Mahboob Ali, Seneca) 핵심 문장 발췌>
# Week 3 · Segment 2. Java Iterators

## Iterators

> An Iterator is a construct/object that is used to traverse or step through the collection. It is part of `java.util`. Types: Enumerator, Iterator, ListIterator. Popularly known as **"Universal Java Cursor"** as it works with all collections. Supports 'read' and 'remove' operations.

## The three methods

> - `E next()`: returns the next element. If there are no more elements, throws **NoSuchElementException**.
> - `boolean hasNext()`: checks if there are more elements; use it to decide if `next()` is to be called.
> - `void remove()`: removes the last element returned by the iterator. Can be called **only once per next()** call. Throws **IllegalStateException** if `next` has not been called yet.

## Iterator example

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

## Limitations of Iterator Interface

> - Cannot replace an element or add a new element.
> - Proceeds only in **one direction** (forward). Supports only sequential iteration.

## Iterator VS Iterable

> Though they sound similar, they are completely different. A class that implements **Iterable** acquires the ability to be iterated (it has `iterator()`, and works with for-each). **Iterator** is the object that does the stepping (`hasNext`, `next`, `remove`).

## Java Iterator VS C++ Iterator

> Java iterators are read-only, forward-only (like C++ input iterators) and know their limit (`hasNext`). C++ iterators can go backwards, write, random access, and the limit is checked by comparing with `end()`. Java iterators can't be copied.
