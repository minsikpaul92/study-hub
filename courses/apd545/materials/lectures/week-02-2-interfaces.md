Source: <APD545 Week 2 · Segment 2 "Interfaces and Implementations" 강의 슬라이드 (Mahboob Ali, Seneca) 핵심 문장 발췌>
# Week 2 · Segment 2. Interfaces and Implementations

## Outcomes

> - Understanding of multiple Inheritance in Java
> - Understanding of Interfaces in Java

## The question

> How though, would we define (and perhaps force) common behavior between seemingly **unrelated classes** in different parts of the class hierarchy?

## Multiple Inheritance

> Java does not support multiple inheritance. Why? **Diamond Problem**

## Interfaces

> An interface is a specification (i.e., a list) of a set of methods such that any classes implementing the interface are **forced to write these methods**.
>
> In many ways, an interface is similar to an abstract class, but the intent of an interface is to specify **common behavior** for objects. For example, you can specify that the objects are comparable, edible, cloneable.

## Interface Definition

> Interface is a reference type in Java, similar to a class. Interfaces **cannot be instantiated**, they can only be implemented by a class or extended by other interfaces.

```java
interface InterfaceName { }
InterfaceName refVariable;   // an interface is a new reference type
```

## Interface Structure

```java
public interface Sharable {
    String getItemData();
}
```

> - Abstract method is public (and abstract) by default (modifiers omitted)
> - Fields are **public, static and final** by default
> - All members are public by default. Members can't be private & protected.

## Abstract Classes VS Interfaces

> - Similar: we cannot create instances of either (`new Loan()` nor `new Loanable()`).
> - We cannot declare attributes in an interface (only constants), whereas an abstract class may have them.
> - In previous versions of JAVA, we were only able to declare "empty" methods in an interface (newer versions allow interfaces to have code: default and static methods).
> - All methods in an interface must be public.

## implements

> We simply add the keyword **implements** in the class definition, followed by the name of the interface.

## Example: Edible

```java
public interface Edible {
    String howToEat();
}

public abstract class Animal {
    public abstract String sound();
}

public class Chicken extends Animal implements Edible {
    @Override public String howToEat() { return "Chicken: Fry it"; }
    @Override public String sound()    { return "Chicken: cock-a-doodle-doo"; }
}

public class Tiger extends Animal {
    @Override public String sound() { return "Tiger: RROAARR"; }
}

public abstract class Fruit implements Edible { }   // no howToEat() here: OK because abstract

public class Apple extends Fruit {
    @Override public String howToEat() { return "Apple: Make apple cider"; }
}

public class TestEdible {
    public static void main(String[] args) {
        Object[] objs = {new Tiger(), new Chicken(), new Apple()};
        for (int i = 0; i < objs.length; i++) {
            if (objs[i] instanceof Edible)
                System.out.println(((Edible) objs[i]).howToEat());
            if (objs[i] instanceof Animal)
                System.out.println(((Animal) objs[i]).sound());
        }
    }
}
```

## Some Common Interfaces of Java API

> - **Comparable**: allow objects to be compared to another. Common use for ordering the objects in collections like ArrayList.
> - **Serializable**: objects can be written to (serialized) or read from (deserialized) storage or transmitted across a network.
> - **Runnable**: a task to perform, Multithreading.
> - **AutoCloseable**: closing resources. Invoked automatically by the **try-with-resources** statement.
> - **ActionListener**: assign behavior to events when a user clicks a button.
