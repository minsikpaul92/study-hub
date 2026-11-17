Source: <APD545 Week 6 · Segment 1 "Automatic Resizing using Layouts" 강의 슬라이드 (Mahboob Ali, Seneca) 핵심 문장 발췌>
# Week 6 · Segment 1. Automatic Resizing using Layouts

## Why layout panes?

> JavaFX provides a mechanism called a **Layout Pane** that allows the automatic arrangement of the components as the window is resized. Why? We would not have to compute locations and sizes; our components will resize automatically; our interface will appear "nicely" on all platforms. We will discuss FlowPane, BorderPane, HBox, VBox, and GridPane.

## FlowPane

> Components are arranged horizontally from left to right, like lines of words in a paragraph. If no space remains on the current line, components flow (or **wrap around**) to the next "line". The height of each line is the maximum height of any component on that line.

```java
FlowPane aPane = new FlowPane();
aPane.getChildren().add(new Button("one"));
aPane.getChildren().add(new Button("two"));
aPane.getChildren().add(new Button("three"));
aPane.setVgap(10);                              // gap between rows
aPane.setHgap(30);                              // gap between columns
aPane.setPadding(new Insets(20, 10, 30, 40));   // top, right, bottom, left
aPane.setPadding(new Insets(25));               // same on all 4 sides
```

## HBox / VBox

> Similar to the FlowPane in that it arranges components one after another, either horizontally or vertically. It **does not have a wrap-around effect**. Any components that do not fit on the line are simply not shown.

```java
HBox aPane = new HBox();
aPane.setPadding(new Insets(10));
aPane.setSpacing(5);
```

## BorderPane

> Places components at one of **five anchored positions** (top, left, bottom, right or center). As the window resizes, components stay "anchored" and grow accordingly. You may place **at most one component** in each of the 5 positions, but this one component may be a container such as another Pane.

```java
BorderPane aPane = new BorderPane();
aPane.setPadding(new Insets(10));

FlowPane buttonPane = new FlowPane();
buttonPane.setHgap(10);
buttonPane.getChildren().addAll(new Button("Add"), new Button("Remove"), new Button("Edit"));

aPane.setBottom(buttonPane);
aPane.setCenter(new TextArea());

TextField statusField = new TextField("This is like a status pane");
BorderPane.setMargin(statusField, new Insets(10, 0, 0, 0));
```

## Simple GridPane

> Excellent for arranging a 2-dimensional grid of components. Components are added by specifying their **column and row**: `aGridPane.add(aComponent, col, row);`. JAVA determines the number of rows and columns from the add() calls. `setHgap()`, `setVgap()`, `setPadding()`.

```java
GridPane aPane = new GridPane();
aPane.setPadding(new Insets(10));
aPane.setHgap(1);
aPane.setVgap(1);
for (int row = 1; row <= 6; row++)
    for (int col = 1; col <= 8; col++) {
        Button b = new Button();
        b.setPrefWidth(200);
        b.setPrefHeight(200);
        aPane.add(b, col, row);
    }
```

## More Complicated GridPane

> Imagine lines between components to form a grid, number the columns and rows starting at 0 at the top left. A component can **span** multiple rows and columns.

```java
GridPane aPane = new GridPane();
aPane.setPadding(new Insets(10));

TextField newItemField = new TextField();
newItemField.setMinHeight(30);
aPane.add(newItemField, 0, 0);
GridPane.setMargin(newItemField, new Insets(0, 0, 10, 0));

Button addButton = new Button("Add");
addButton.setMinSize(100, 30);
aPane.add(addButton, 1, 0);
GridPane.setMargin(addButton, new Insets(0, 0, 10, 10));

ListView<String> fruitList = new ListView<>();
fruitList.setPrefWidth(Integer.MAX_VALUE);   // take all the extra space
fruitList.setPrefHeight(Integer.MAX_VALUE);
aPane.add(fruitList, 0, 1);

Button removeButton = new Button("Remove");
removeButton.setMinSize(100, 30);
aPane.add(removeButton, 1, 1);
GridPane.setMargin(removeButton, new Insets(0, 0, 0, 10));
GridPane.setValignment(removeButton, VPos.TOP);
```
