Source: <APD545 Week 3 · Segment 3 "Generics (Templates)" 강의 슬라이드 (Mahboob Ali, Seneca) 핵심 문장 발췌>
# Week 3 · Segment 3. Generics

## What is Generics?

> Generics adds stability to your code by **detecting bugs on the compile time**. Generics is the capability to **parameterize types**: we can pass types as arguments when defining classes, interfaces and methods.

## Motivation

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

## Generic class

> Generics was introduced to solve this. Generics is **purely compile time** concept.

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

## Generic Type and Parameterized Type

> - `class Store<T>`: **generic type**, `T` is the type parameter (formal).
> - `Store<String>`: **parameterized type**, `String` is the type argument (actual).

## Type Parameter Naming Conventions

> Single uppercase letters: **E** Element (Collections), **K** Key, **V** Value (Maps), **N** Number, **T** Type, **S, U, V** 2nd, 3rd, 4th types.

## Multiple Type Parameters

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

## Why Generics: Benefits

> - **Stronger type checking**: `list.add(32)` on a `List<String>` is a compile-time error.
> - **Casting can be eliminated**: `String s = list.get(0);`
> - **Type safety**: holds only a single type of objects.

## Generic Class example: GenericBox

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

## Type Erasure

> When a generic type is instantiated, the compiler translates those types by a technique called **type erasure**: it replaces all references to the type parameter with **Object**, performs the type check, and inserts the required downcast operators.

## Raw Types

> A raw type is the name of a generic class without any type arguments: `Store rawStore = new Store();`. **Avoid raw types**: not type safe, possible runtime error, require casting.

## Generic method

> Type parameters can also be declared within method signatures. The type parameter's scope is limited to the method.

```java
public static <T> boolean isEqual(GenericsType<T> g1, GenericsType<T> g2) {
    return g1.get().equals(g2.get());
}

boolean same = GenericsMethods.<String>isEqual(g1, g2);
same = GenericsMethods.isEqual(g1, g2);   // type inferred
```

## Restrictions

> - Type argument **cannot be a primitive**: `Store<int>` is an error. Use `Store<Integer>`.
> - Type parameter **cannot be used in a static context**: `private static T deviceType;` is an error (T would be Smartphone or Pager?).
