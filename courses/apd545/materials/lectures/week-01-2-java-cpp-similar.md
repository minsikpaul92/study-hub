Source: <APD545 Week 1 · Segment 2 "Similarities of Java and C++" 강의 슬라이드 (Mahboob Ali, Seneca) 핵심 문장 발췌. 코드는 슬라이드 예제를 Java 쪽만 정리>
# Week 1 · Segment 2. Similarities of Java and C++

## Syntax and Comments

> Every Java Program starts with a class, nothing stays outside the class.

```java
public class Hello {
    /* Every Java Program starts with a class
       nothing stays outside the class */
    public static void main(String[] args) {   // Execution begins from main
        System.out.print("Hello Java");
    }
}
```

## Loops, Conditionals and Operators

> - All loops such as while, do while, for and so on are all same.
> - All conditional statements such as if, else if, else and switch are all same as well.
> - The arithmetic operators are same in both languages. `+, -, /, *`
> - The relational operators are also same in both languages. `<, >, <=, >=, !=`

## Basic Data Types

> | Java | size |
> | --- | --- |
> | byte | 1 byte |
> | short | 2 bytes |
> | int | 4 bytes |
> | long | 8 bytes |
> | float | 4 bytes |
> | double | 8 bytes |
> | boolean | 1 bit |
> | char | 2 bytes |

## Keywords and Multithreading

> Many of the keywords are same: `break, continue, char, int, double, new, public, private, return, static` etc.
> Both have multiple-threading support.

## Object Oriented Programming

> Both Java and C++ support Object Oriented programming. OOPs characteristics include: **Inheritance, Polymorphism, Abstraction, Encapsulation**

### Inheritance

> Process by which objects of one class can link and share some common properties of objects from another class.

```java
class Vehicle {                       // Base class
    protected String brand = "Ford";
    public void honk() { System.out.println("Tuut, tuut!"); }
}

class Car extends Vehicle {           // Derived class
    private String modelName = "Mustang";

    public static void main(String[] args) {
        Car myCar = new Car();
        myCar.honk();
        System.out.println(myCar.brand + " " + myCar.modelName);
    }
}
```

### Polymorphism

> Allows us to perform a single action in different ways.

```java
class Animal {
    public void animalSound() { System.out.println("The animal makes a sound"); }
}
class Cat extends Animal {
    public void animalSound() { System.out.println("The cat says: Meo Meo"); }
}
class Dog extends Animal {
    public void animalSound() { System.out.println("The dog says: bow wow"); }
}

class Main {
    public static void main(String[] args) {
        Animal myAnimal = new Animal();
        Animal myCat = new Cat();
        Animal myDog = new Dog();
        myAnimal.animalSound();
        myCat.animalSound();
        myDog.animalSound();
    }
}
```

### Abstraction

> Includes representing essential features without including the background details.

```java
abstract class Animal {
    public abstract void animalSound();          // Abstract method (does not have a body)
    public void sleep() { System.out.println("Zzz"); }   // Regular method
}
class Cat extends Animal {
    public void animalSound() { System.out.println("The cat says: Meo Meo"); }
}
```

### Encapsulation

> Process of combining data and functions into a single unit.

```java
public class Person {
    private String name;
    public String getName() { return name; }              // Getter
    public void setName(String newName) { this.name = newName; }   // Setter
}
```

## Static Keyword

> - Like C++, static data members in Java are class members and shared among all objects.
> - Static member methods: They can only call other static methods. They must only access static data. They can't access `this` or `super`.
> - Static data members and static methods can be accessed without creating an object. They can be accessed using the class names.

## ForEach

> Both use the foreach loop to quickly iterate over the elements of a container (array, vectors, etc.) without performing initialization, testing, or increment/decrement.

```java
int arr[] = { 10, 20, 30, 40 };
for (var x : arr)
    System.out.print(x + " ");
```

## Templates vs Generics

> Generics in Java and the similar in C++ named Template come in handy, when we want to write a code ... where our program works regardless of the type of data is being passed.

```java
public class GenericClass<T> {
    private T value;
    public GenericClass(T value) { this.value = value; }
    public void showType() {
        System.out.println("Type:" + value.getClass().getSimpleName());
        System.out.println("Value: " + value);
    }
    public static void main(String[] args) {
        GenericClass<String> str = new GenericClass<>("Generics vs Templates");
        GenericClass<Integer> integer = new GenericClass<>(9);
        str.showType();
        integer.showType();
    }
}
```
