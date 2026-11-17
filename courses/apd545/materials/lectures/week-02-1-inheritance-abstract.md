Source: <APD545 Week 2 · Segment 1 "Inheritance and Abstract Classes" 강의 슬라이드 (Mahboob Ali, Seneca) 핵심 문장 발췌>
# Week 2 · Segment 1. Inheritance and Abstract Classes

## Outcomes

> - Organizing Classes
> - Understanding of Inheritance.
> - Understanding of Abstract classes.

## Organizing class: The need

> There are some objects that "share" attributes in common. For example, Person objects may have name and phoneNumber attributes, but so can Employee, Manager, Customer and Company objects.
>
> All object-oriented languages (e.g., JAVA) allow you to organize your classes in a way that allows you to take advantage of the commonality between classes.

## Class hierarchy

> A class hierarchy is often represented as an upside-down tree. A child object defined in the tree is a more specific kind of object than its parent or ancestors in the tree. Hence, there is an **"is a"** (i.e., "is-a-kind-of") relationship between classes.
>
> Each class is a subclass (i.e., a specialization) of some other class which is called its superclass (i.e., a generalization).

## Inheritance (Quick overview)

> - In JAVA, in order to create a subclass of another class, use the **extends** keyword in our class definition.
> - A subclass inherits state and behavior from all its ancestor.
> - Subclass inherits all, but **private** superclass's members

```java
public class SuperClass { ... }
public class SubClass extends SuperClass { ... }
```

## Are Superclass's Constructor Inherited?

> - **No.** They are not inherited. They are invoked explicitly or implicitly.
> - Superclass constructor can only be invoked from the subclasses' constructors, using the keyword **super**.
> - If the keyword super is not explicitly used, the superclass's **no-arg constructor is automatically invoked**.

## Using the Keyword super

> The keyword super refers to the superclass of the class in which super appears. This keyword can be used in two ways: to call a superclass constructor, and to call a superclass method.
>
> - Invoking the name of the superclass's constructor in a subclass causes an error.
> - **super keyword must appear first in the constructor.**

```java
public A() { }            // is equivalent to
public A() { super(); }
```

## Constructor Chaining

> Constructing an instance of a class invokes all the super classes' constructors along the inheritance chain. This is called **constructor chaining**.

```java
public class Faculty extends Employee {
    public static void main(String[] args) {
        new Faculty();
    }
    public Faculty() {
        System.out.println("(4) Faculty's no-arg constructor is invoked");
    }
}

class Employee extends Person {
    public Employee() {
        this("(2) Invoke Employee's overloaded constructor");
        System.out.println("(3) Employee's no-arg constructor is invoked");
    }
    public Employee(String s) {
        System.out.println(s);
    }
}

class Person {
    public Person() {
        System.out.println("(1) Person's no-arg constructor is invoked");
    }
}
```

## Find out the errors in the program

```java
public class Apple extends Fruit {
}

class Fruit {
    public Fruit(String name) {
        System.out.println("Fruit's constructor is invoked");
    }
}
```

## Example: GeometricObject, Circle, Rectangle

> GeometricObject (color, filled, dateCreated) is the superclass. Circle (radius) and Rectangle (width, height) extend it and add getArea(), getPerimeter().

```java
public class CircleFromGeometricObject extends GeometricObject {
    private double radius;

    public CircleFromGeometricObject(double radius, String color, boolean filled) {
        this.radius = radius;
        setColor(color);     // color is private in the superclass, so use the setter
        setFilled(filled);
    }

    public double getArea() { return radius * radius * Math.PI; }
    public double getPerimeter() { return 2 * radius * Math.PI; }
}
```

## Overriding

> Replacing the superclass's implementation with a new method in a subclass is called **overriding**.
>
> - The signature should be identical.
> - Only accessible non-static method can be overridden.
> - Access modifier could be different in overridden method as long as the subclass modifier is **less restrictive** than the superclass.
> - A static method can be inherited. A static method **cannot be overridden**. If you redefine the static method in its subclass then the method of the superclass will be **hidden**.

## Method calling VS Overriding

> Whenever you call a method, JAVA looks first to see whether or not you have such a method in the class that you are calling it from. Otherwise, JAVA tries to look for the method **up the hierarchy (never down the hierarchy)** ... until it reaches the **Object** class at the top of the tree.

## How are access Modifiers affected by Inheritance?

> When an inherited attribute is declared as **private**, the subclasses still inherit it, but they cannot access it directly from within their own "local" code.
>
> A **protected** method cannot be called from a class that is not a subclass (and not in the same package).

## Final Classes / Methods

> - A class that is declared **final cannot be subclassed**. Example: `java.lang.String`
> - A method that is declared final **cannot be overridden** or hidden by subclasses.

## Abstraction

> Abstraction says hide the implementation from the user by showing only functionality. Two ways to achieve abstraction in java: 1. Abstract classes. 2. Interfaces.

## Concrete class vs Abstract class

> A **concrete class** is a class that we can make instances of directly by using the new keyword. An **abstract class** is a class for which we cannot create instances.

## Abstract classes and Abstract Methods

> - Class declared with a keyword abstract. Needs to be extended. **Cannot be instantiated.**
> - An abstract class can contain abstract methods that are to be implemented in concrete subclasses. Abstract classes can also contain non-abstract methods.
> - If a subclass doesn't want to override the abstract methods of the superclass, then subclass needs to be an abstract as well.

## An Abstract method

> Declared with the keyword abstract and does not contain any implementation: `abstract void someMethod();`
>
> - An abstract method cannot be contained in a non-abstract class.
> - A subclass can be abstract even if its superclass is concrete.
> - No body. Must be overridden. Can't be static.

## Abstract Method: Why?

> By defining an abstract method, you are really just informing everyone that the concrete subclasses **must** write code for that method. All concrete subclasses of an abstract class MUST implement the abstract methods defined in their superclasses, there is no way around it.

## Example: abstract GeometricObject

```java
public abstract class GeometricObject {
    private String color = "white";
    private boolean filled;

    protected GeometricObject() { }
    protected GeometricObject(String color, boolean filled) {
        this.color = color;
        this.filled = filled;
    }

    public abstract double getArea();
    public abstract double getPerimeter();
}

public class TestGeometricObject {
    public static void main(String[] args) {
        GeometricObject geo1 = new Circle(5);
        GeometricObject geo2 = new Rectangle(5, 3);
        System.out.println("Same area? " + (geo1.getArea() == geo2.getArea()));
        System.out.println("The area is " + geo2.getArea());
        System.out.println("The perimeter is " + geo2.getPerimeter());
    }
}
```

## Concrete class or Abstract class?

> If we are not sure, it is better to leave them as concrete. By making a class abstract, you are informing the users of that class that they should not be creating instances of that class ... You are actually forcing them to create a subclass.
