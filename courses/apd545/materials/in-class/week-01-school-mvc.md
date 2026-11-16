Source: <APD545 Week 1 교수님 샘플 코드 WK_1_LE_Ex (Blackboard), 주요 파일 발췌>
# Week 1 샘플 코드: WK_1_LE_Ex (School MVC)

## Project Structure

```text
src/
  TestClass.java                    (default package)
  testpackage/MyClass.java
  ca/senecacollege/
    abstracts/   Person.java, Staff.java
    models/      Student.java, Teacher.java
    interfaces/  IPersonAction.java
    views/       SchoolView.java
    controllers/ SchoolController.java
    tester/      TestMain.java
```

## Example: Packages and import (TestClass, MyClass)

```java
// testpackage/MyClass.java
package testpackage;

public class MyClass {
    public void print() {
        System.out.println("Hello World from MyClass");
    }
}
```

```java
// TestClass.java (default package)
import testpackage.MyClass;

public class TestClass {
    public void print() {
        System.out.println("Hello World");
    }

    static void main() {
        TestClass test = new TestClass();
        test.print();

        MyClass myClass = new MyClass();
        myClass.print();
    }
}
```

## Example: Abstract base class Person

```java
package ca.senecacollege.abstracts;

public abstract class Person {
    private String name;
    private int age;

    public Person(String name, int age) {
        this.name = name;
        this.age = age;
    }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public int getAge() { return age; }
    public void setAge(int age) { this.age = age; }

    public void greet() {
        System.out.println("Hello, my name is " + name);
    }

    public abstract String getDetails();
}
```

## Example: Staff, Student, Teacher (models)

```java
public abstract class Staff extends Person {
    private String department;

    public Staff(String name, int age, String department) {
        super(name, age);
        this.department = department;
    }
    public String getDepartment() { return department; }

    @Override
    public String getDetails() {
        return "Department Name: " + getDepartment();
    }
}

public class Student extends Person {
    private String studentID;

    public Student(String name, int age, String studentID) {
        super(name, age);
        this.studentID = studentID;
    }

    @Override
    public String getDetails() {
        return "Student ID: " + studentID;
    }
}

public class Teacher extends Staff {
    private String subject;

    public Teacher(String name, int age, String department, String subject) {
        super(name, age, department);
        this.subject = subject;
    }

    @Override
    public String getDetails() {
        return super.getDetails() + ",  Subject: " + subject;
    }
    public String getSubject() { return subject; }
}
```

## Example: Functional interface IPersonAction

```java
package ca.senecacollege.interfaces;

import ca.senecacollege.abstracts.Person;

@FunctionalInterface
public interface IPersonAction {
    String performRole(Person person);
}
```

## Example: View and Controller

```java
public class SchoolView {
    public void displayPersonDetails(String personType, String name, int age, String details) {
        System.out.println("Details of the " + personType + ":");
        System.out.println("Name: " + name);
        System.out.println("Age: " + age);
        System.out.println(details);
        System.out.println();
    }

    public void displayRole(String message) {
        System.out.println(message);
    }
}

public class SchoolController {
    private SchoolView view;

    public SchoolController(SchoolView view) {
        this.view = view;
    }

    public void displayPersonDetails(Person person) {
        view.displayPersonDetails(person.getClass().getSimpleName(),
                                  person.getName(),
                                  person.getAge(),
                                  person.getDetails());
    }

    public void performPersonRole(Person p, IPersonAction action) {
        String message = action.performRole(p);
        view.displayRole(message);
    }
}
```

## Example: TestMain (wiring M, V, C)

```java
public class TestMain {
    static void main() {
        SchoolView view = new SchoolView();
        SchoolController sc = new SchoolController(view);   // controller

        Student student = new Student("Alice", 21, "S1234");          // model
        Teacher teacher = new Teacher("Bob", 32, "Mathematics", "Calculus - 1");

        sc.displayPersonDetails(student);
        sc.displayPersonDetails(teacher);

        // Lambda for roles
        IPersonAction studentRole = (person) -> person.getName() + " is studying";
        IPersonAction teacherRole = (person) -> {
            Teacher t = (Teacher) person;
            return t.getName() + " is teaching" + t.getSubject();
        };

        sc.performPersonRole(student, studentRole);
        sc.performPersonRole(teacher, teacherRole);
    }
}
```
