Source: <APD545 Week 1 · Segment 3 "Major Differences of Java and C++" 강의 슬라이드 (Mahboob Ali, Seneca) 핵심 문장 발췌. 코드는 슬라이드 예제를 Java 쪽만 정리>
# Week 1 · Segment 3. Differences between Java and C++

## Class Definitions

> - Java: `public class CRectangle { ... }` Note: no ";" required here (C++ needs `};`).
> - Java declares the access modifier on every member (`private int width, height;`, `public int area()`).
> - Java does not have destructors.

```java
public class CRectangle {
    private int width, height;

    public CRectangle(int a, int b) {
        width = a;
        height = b;
    }

    public int area() {
        return width * height;
    }
}   // no ";" here
```

## main is inside the class

> main is inside the class, main's type is different: `public static void main(String[] args)`. Objects are created with `new`.

```java
public class CRectangle {
    // ... fields, constructor, area() ...
    public static void main(String[] args) {
        CRectangle rectA = new CRectangle(3, 4);
        CRectangle rectB = new CRectangle(5, 6);
        System.out.println("rectA area: " + rectA.area());
        System.out.println("rectB area: " + rectB.area());
    }
}
```

## Inheritance and Polymorphism

> In C++ you write `class CRectangle: public CPolygon` and call the parent constructor in the initializer list; Java uses `extends` and `super(a,b)`. In C++ the method must be `virtual`; in Java methods are overridable by default.

```java
// Polygon.java
public class Polygon {
    protected int width, height;
    public Polygon(int a, int b) { width = a; height = b; }
    public int area() { return 0; }
}

// Rectangle.java
public class Rectangle extends Polygon {
    public Rectangle(int a, int b) { super(a, b); }
    public int area() { return width * height; }
}

// Triangle.java
public class Triangle extends Polygon {
    public Triangle(int a, int b) { super(a, b); }
    public int area() { return width * height / 2; }
}

// PolyTest.java
public class PolyTest {
    public static void main(String[] args) {
        Polygon rect = new Rectangle(4, 5);
        Polygon trgl = new Triangle(4, 5);
        System.out.println(rect.area());
        System.out.println(trgl.area());
    }
}
```

## Question Time: How does Java delete the DMA?

> - Destructor
> - Delete Keyword
> - Remove Keyword
> - **Garbage Collected**

## Pure Virtual vs Abstract classes

> C++: `virtual int area() = 0;` Java: `public abstract int area();` in a `public abstract class Polygon`. In both, creating the base object is illegal: `// Polygon poly = new Polygon(4,5);`

```java
public abstract class Polygon {
    protected int width, height;
    public Polygon(int a, int b) { width = a; height = b; }
    public abstract int area();
}
```

## Static Block and Static Local Variable

> - **Static Block**: Unlike C++, Java supports a special block, called static block (also called static clause) which can be used for static initialization of a class. This code inside the static block is executed only once.
> - **Static Local Variable**: Unlike Java, C++ supports static local variables.

## Exception Handling

> (슬라이드 제목만 있고 내용은 그림으로 되어 있어요. 아래 한글 해설에 Java 예외 처리 기본을 정리했어요.)
