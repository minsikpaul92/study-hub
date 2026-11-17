Source: <APD545 Week 4 · Segment 1 "GUI with JavaFX" 강의 슬라이드 (Mahboob Ali, Seneca) 핵심 문장 발췌>
# Week 4 · Segment 1. User Interfaces and JavaFX Applications

## Model, User Interface, GUI

> - The **model** of an application consists of all classes that represent the "business logic" part of the application. The model is always developed separately from the user interface. It should not assume any knowledge about the user interface at all (e.g., model classes should not assume that `System.out.println()` is available).
> - The **user interface** is the part of the application that is attached to the model which handles interaction with the user and does NOT deal with the business logic. It often causes the model to change, and the changes are reflected back on the user interface.
> - A **graphical user interface (GUI)** is a user interface that makes use of one or more windows to interact with the user.

## What is GUI?

> GUIs are built from GUI components, also called **controls** or **widgets** (window gadgets). There should always be a **separation** in your code between the model classes and the user interface classes. Such a separation allows you to share the same model classes with different interfaces.

## History of GUI with Java

> AWT (original) → Swing (Java SE 1.2) → **JavaFX** (current GUI, graphics and multimedia API).

## JavaFX vs Swing

> - JavaFX provides one API for GUI, graphics and multimedia (images, animation, audio, video). Swing is only for GUIs.
> - JavaFX Scene Builder produces the same code regardless of the IDE.
> - Complete control over look-and-feel via **CSS**.
> - Better threading support; uses the **GPU** for hardware-accelerated rendering.

## Scene Builder and FXML

> JavaFX Scene Builder lets you create GUIs by dragging and dropping components. It generates **FXML**, an XML vocabulary for defining and arranging JavaFX GUI controls. This is an example of **declarative** programming. The separation of the interface (the GUI) from the implementation (the Java code) makes it easier to debug, modify and maintain.

## Basic Structure of JavaFX

> Application → override the **start(Stage)** method. Stage, Scene, and Nodes.

```java
public class JavaFXBasic extends Application {
    @Override
    public void start(Stage primaryStage) {
        Button btOK = new Button("OK");
        Scene scene = new Scene(btOK, 200, 250);
        primaryStage.setTitle("JavaFX Basic Structure");
        primaryStage.setScene(scene);
        primaryStage.show();
    }

    public static void main(String[] args) {
        launch(args);
    }
}
```

## Display a simple shape

```java
Circle circle = new Circle();
circle.setCenterX(100);
circle.setCenterY(100);
circle.setRadius(50);
circle.setStroke(Color.BLACK);
circle.setFill(Color.WHITE);

Pane pane = new Pane();
pane.getChildren().add(circle);
primaryStage.setScene(new Scene(pane, 200, 200));
```

## Components of JavaFX

> - **Stage**: the window in which a JavaFX app's GUI is displayed (`javafx.stage`).
> - **Scene**: the stage contains one active scene that defines the GUI as a **scene graph**, a tree data structure of an app's visual elements (`javafx.scene`).
> - **Node**: each visual element in the scene graph is a node.
> - **Container / Layout container**: nodes that have children; arrange their child nodes. Base class: **Pane**.
> - **Controls**: Labels, TextFields, Buttons and more.
> - **Controller class**: an FXML GUI's event handlers are defined in a controller class.
> - **Event handler**: a method that responds to a user interaction.

## Welcome Application (FXML project)

> - `Welcome.fxml`: the FXML markup for GUI.
> - `Main.java`: creates the GUI from the FXML file and displays it in a window.
> - `WelcomeController.java`: the class in which you'd define the GUI's event handlers.
>
> In Scene Builder: add a **VBox**, make it the root (Edit > Trim Document to Selection), set Alignment to CENTER, Pref Width 450, Pref Height 300, add a Label and an ImageView.
