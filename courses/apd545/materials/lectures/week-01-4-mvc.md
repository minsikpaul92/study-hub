Source: <APD545 Week 1 · Segment 4 "MVC Pattern" 강의 슬라이드 (Mahboob Ali, Seneca) 핵심 문장 발췌. Employee 예제 코드는 슬라이드 그대로 정리>
# Week 1 · Segment 4. MVC Pattern

## What is Design Pattern?

> - Designing object-oriented software is hard and designing reusable object-oriented software is even harder.
> - Design patterns make it easier to reuse successful designs and architectures.
> - The design patterns are descriptions of communicating objects and classes that are customized to solve a general design problem in a particular context.

## What is MVC?

> MVC is a software design pattern. It describes the separation of software into three elements: **Model, View, Controller**

## What is Model in MVC?

> - Manages the data of an application.
> - The model is agnostic to the way the data is represented to the user or any application workflow, so it can be said that the model is the central part of a MVC application.
> - Developing a model is among the first steps of any MVC software project.

```java
// class that represents model
public class Employee {
    private String EmployeeName;
    private String EmployeeId;

    public String getId() { return EmployeeId; }
    public void setId(String id) { this.EmployeeId = id; }
    public String getName() { return EmployeeName; }
    public void setName(String name) { this.EmployeeName = name; }
}
```

## Why use MVC Design Pattern?

> This makes it easier to work on each part separately, so you can update or fix things without messing up the whole app. It helps developers add new features smoothly, makes testing simpler, and allows for better user interfaces.

## What is View in MVC?

> - Describes the presentation of the data and control elements (inputs, buttons, check boxes, menus, and so on) to the user.
> - A view also may use different technologies, like a GUI component installed on the user's PC, an app on a mobile phone, or a web page to be viewed in a browser.

```java
// class which represents the view
public class EmployeeView {
    public void printEmployeeDetails(String EmployeeName, String EmployeeId) {
        System.out.println("Employee Details: ");
        System.out.println("Name: " + EmployeeName);
        System.out.println("Employee ID: " + EmployeeId);
    }
}
```

## What is Controller in MVC?

> - Handles user input and prepares the data set necessary for the view part to do its work.
> - While a view shows model items, the view never has to know how data is stored and retrieved from some persistent storage (database).
> - Because the user input determines what an application has to do next, the controller also contains the application logic.
> - Any calculation and data transformation happens in the control part of MVC.

```java
// class which represent the controller
public class EmployeeController {
    private Employee model;
    private EmployeeView view;

    public EmployeeController(Employee model, EmployeeView view) {
        this.model = model;
        this.view = view;
    }

    public void setEmployeeName(String name) { model.setName(name); }
    public void setEmployeeId(String id) { model.setId(id); }
    public String getEmployeeId() { return model.getId(); }

    // method to update view
    public void updateView() {
        view.printEmployeeDetails(model.getName(), model.getId());
    }
}
```

## Main.java

```java
public class MVCMain {
    public static void main(String[] args) {
        // fetching the employee record based on the employee_id from the database
        Employee model = retriveEmployeeFromDatabase();
        // creating a view to write Employee details on console
        EmployeeView view = new EmployeeView();
        EmployeeController controller = new EmployeeController(model, view);
        controller.updateView();

        // updating the model data
        controller.setEmployeeName("Frank");
        System.out.println("\n Employee Details after updating: ");
        controller.updateView();
    }

    // (슬라이드에는 없는 부분: 실행되도록 추가한 가짜 DB 조회)
    private static Employee retriveEmployeeFromDatabase() {
        Employee employee = new Employee();
        employee.setName("Joe");
        employee.setId("11");
        return employee;
    }
}
```

## MVC in Java, in one sentence each

> - a model (stored in memory) defines the application's state;
> - a view shows model values and sends user interactions to a controller;
> - the controller prepares model data, handles user input and accordingly changes model values, and then decides which view page to show next.
