Source: <APD545 Week 10 · Segment 1 "Java Lambdas and Streams" 강의 슬라이드 (Mahboob Ali, Seneca) 핵심 문장 발췌>
# Week 10 · Segment 1. Lambda and Stream

## Why the need?

> The biggest need is due to the rise of **multicore CPUs**. Java 8 lambdas allow you to write complex collection-processing algorithms, and simply by changing a single method call you can efficiently execute this code on multicore CPUs.

## What is Functional Programming?

> Passing code to methods (and also being able to return it and incorporate it into data structures) is commonly referred to as **functional-style programming**. It is thinking about your problem domain in terms of **immutable values and functions** that translate between them.

## Lambda

> Named after **lambda calculus**. Languages that support functional programming can create **anonymous (unnamed) functions**, commonly known as **closures**. In Java 8, functions can be treated like objects: assigned to variables and passed into other functions.

## Imperative vs Declarative

> - **Imperative** style: we tell Java every step of what we want it to do.
> - **Declarative** style: what we want rather than how to do it.

```java
// imperative: every step
boolean found = false;
for (String city : cities) {
    if (city.equals("Chicago")) { found = true; break; }
}

// declarative: just say what you want
System.out.println("Found chicago?:" + cities.contains("Chicago"));
```

> Improvements: no messing around with mutable variables, iteration steps wrapped under the hood, less clutter, better clarity, less error prone.

## JavaFX Button onAction

```java
btn.setOnAction(new EventHandler<ActionEvent>() {
    public void handle(ActionEvent event) {
        System.out.println("Hello World");
    }
});

btn.setOnAction(event -> System.out.println("Hello World"));
```

## Lambda Expressions: Syntax

```java
(param1, param2, ...) -> expression;
(param1, param2, ...) -> { /* code statements */ };
```

> - Parentheses are optional only if there is **one** parameter. With **no** parameters, the parentheses are still required: `() -> ...`.
> - Without curly braces, the body must be a single expression; it is evaluated and **returned implicitly**.
> - With curly braces and a return type, you **must have a return** statement.
> - Lambdas don't define a return type; it is defined by the **functional interface** (the context).

```java
Function<Double, Double> f1 = x -> { return x * x; };   // explicit return
Function<Double, Double> f2 = x -> x * x;               // implicit return
double y = f2.apply(2.0);                               // 4.0

(int x, int y) -> { if (x > y) return x; else return y; }
(x, y) -> x > y ? x : y                                 // same thing

btn.setOnAction((ActionEvent event) -> { System.out.println(event); });
btn.setOnAction((event) -> System.out.println(event));
btn.setOnAction(event -> System.out.println(event));
```

## Functional Interfaces

> Any Java interface which contains **one and only one abstract method** (Single Abstract Method, SAM). `@FunctionalInterface` has no effect on the code; it is a compile time check.

```java
@FunctionalInterface
interface MyEquation {
    double compute(double val1, double val2);
}

MyEquation area = (height, width) -> height * width;
MyEquation perimeter = (height, width) -> 2 * height + 2 * width;
System.out.println("Area = " + area.compute(3, 4));            // 12.0
System.out.println("Perimeter = " + perimeter.compute(3, 4));  // 14.0
```

## Method Reference

> Syntactic sugar for a lambda that just calls one method. The double colon `::` references the method by name.

```java
btn.setOnAction(System.out::println);    // same as e -> System.out.println(e)
```

## java.util.function

> - **Predicate&lt;T&gt;**: `boolean test(T t)`. Filter operations.
> - **Consumer&lt;T&gt;**: `void accept(T t)`. Do something with each element.
> - **Function&lt;T,R&gt;**: `R apply(T t)`. Map one object to another.

```java
Comparator<Apple> byWeight = new Comparator<Apple>() {
    public int compare(Apple a1, Apple a2) {
        return a1.getWeight().compareTo(a2.getWeight());
    }
};
Comparator<Apple> byWeight2 = (a1, a2) -> a1.getWeight().compareTo(a2.getWeight());
```

## What are Streams?

> Streams let you manipulate collections of data in a **declarative** way (you express a query). Think of them as fancy iterators. Streams can be processed **in parallel** transparently. A **pipeline** is a sequence of operations. Start with the `stream()` method of `Collection`.

```java
List<Integer> values = Arrays.asList(23, 84, 74, 85, 54, 60);
int threshold = 54;
values.stream()
      .filter(val -> val > threshold)                          // Predicate
      .sorted()
      .map(dec -> Integer.toHexString(dec).toUpperCase())      // Function
      .forEach(val -> System.out.println(val));                // Consumer
```

## Java 7 VS Java 8 Code

```java
List<String> lowCaloricDishesName =
    menu.stream()
        .filter(d -> d.getCalories() < 400)
        .sorted(Comparator.comparing(Dish::getCalories))
        .map(Dish::getName)
        .collect(Collectors.toList());
```

## What exactly is the Stream?

> A sequence of elements from a source that supports data processing operations. **Collections are about data; Streams are about computations.** Sources: collections, arrays, I/O resources. Operations: filter, map, reduce, find, match, sort.

## Two important characteristics

> - **Pipelining**: many stream operations return a stream themselves, so they can be chained.
> - **Internal iteration**: stream operations do the iteration behind the scenes.
> - **Traversable only once**: after the first iteration the stream is consumed.

```java
Stream<String> a = Arrays.asList("Sky", "is", "blue").stream();
a.forEach(System.out::println);
a.forEach(System.out::println);   // throws IllegalStateException
```

## Stream Operations

> - **Intermediate** operations such as filter or sorted return another stream. They don't perform any processing until a terminal operation is invoked: they're **lazy**.
> - **Terminal** operations produce a result: a List, an Integer, or even void (forEach, collect, count, reduce).
