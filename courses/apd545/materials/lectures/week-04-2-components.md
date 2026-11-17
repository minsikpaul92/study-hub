Source: <APD545 Week 4 · Segment 2 "Components and Containers" 강의 슬라이드 (Mahboob Ali, Seneca) 핵심 문장 발췌>
# Week 4 · Segment 2. Components and Containers

## Scene and Scene Graph

> The scene is arranged as a tree-like graph containing Node objects, called the **scene graph**. It begins with a **root node**. If node c is contained within another node p, then c is called a **child** of p and p is the **parent** of c.

## Window Component

```java
Parent p = aComponent.getParent();
ObservableList<Node> children = aParent.getChildren();
Node c1 = children.get(0);
```

## Button and its settings

```java
Button b = new Button("Press Me");
b.setText("Don't Press Me");
b.setAlignment(Pos.CENTER);

Image anImage = new Image(getClass().getResourceAsStream("brain.gif"));
Button b2 = new Button("Brain", new ImageView(anImage));
b2.setGraphic(new ImageView(anImage));

b.setStyle("-fx-font: 22 arial; -fx-base: rgb(170,0,0); -fx-text-fill: rgb(255,255,255);");
b.setDisable(true);     // cannot be controlled
b.setVisible(false);    // cannot be seen nor controlled
b.relocate(40, 60);     // x, y relative to its parent (top-left corner)
b.setPrefSize(100, 25); // width, height
```

## Example: FruitListApp

```java
Pane aPane = new Pane();

TextField newItemField = new TextField();
newItemField.relocate(10, 10);
newItemField.setPrefSize(150, 25);

Button addButton = new Button("Add");
addButton.relocate(175, 10);
addButton.setPrefSize(100, 25);

Button removeButton = new Button("Remove");
removeButton.relocate(175, 45);
removeButton.setPrefSize(100, 25);

ListView<String> fruitList = new ListView<>();
String[] fruits = {"Apples", "Oranges", "Bananas", "Cherries"};
fruitList.setItems(FXCollections.observableArrayList(fruits));
fruitList.relocate(10, 45);
fruitList.setPrefSize(150, 150);

aPane.getChildren().addAll(newItemField, addButton, removeButton, fruitList);
primaryStage.setTitle("My Fruit List");
primaryStage.setResizable(false);
primaryStage.setScene(new Scene(aPane, 285, 205));
primaryStage.show();
```
