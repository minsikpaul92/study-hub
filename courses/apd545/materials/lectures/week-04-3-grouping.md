Source: <APD545 Week 4 · Segment 3 "Grouping Components Together" 강의 슬라이드 (Mahboob Ali, Seneca) 핵심 문장 발췌>
# Week 4 · Segment 3. Grouping Components Together

## Organizing Components

> It is a good idea to share component layouts among the similar windows within an application so that the amount of code you write is reduced. We often lay out components onto a **Pane** and then place the Pane on our window. We can have a Pane within another Pane.

## Example: AddressPane

```java
public class AddressPane extends Pane {
    public AddressPane(String title) {
        Pane innerPane = new Pane();
        innerPane.setStyle("-fx-background-color: white; -fx-border-color: gray; -fx-padding: 4 4;");

        Label label1 = new Label("Name:");
        label1.relocate(10, 20);
        label1.setPrefSize(80, 30);
        TextField nameField = new TextField();
        nameField.relocate(100, 20);
        nameField.setPrefSize(300, 30);
        // ... Street, City, Province, Postal Code the same way

        innerPane.getChildren().addAll(label1, nameField /* , ... */);

        Label titleLabel = new Label(title);
        titleLabel.setStyle("-fx-background-color: white; -fx-translate-y: -8; -fx-translate-x: 10;");
        getChildren().addAll(innerPane, titleLabel);   // order matters: title drawn on top
    }
}
```

> The order of adding is important because we want the titleLabel to be drawn **on top of** the innerPane. The AddressPane class itself is not a runnable application. It will be "treated" as a **single component**.

## ComboBox

> A ComboBox represents a drop-down list. Only the selected item is shown.

```java
ObservableList<String> options = FXCollections.observableArrayList(
        "Home Address", "Work Address", "Alternate Address");
ComboBox<String> addressBox = new ComboBox<>(options);
addressBox.setPromptText("Choose address type");
addressBox.setValue("Work Address");
```

## Reusing the pane

```java
AddressPane myPanel1 = new AddressPane("HOME ADDRESS");
myPanel1.relocate(170, 10);
AddressPane myPanel2 = new AddressPane("ALTERNATE ADDRESS");
myPanel2.relocate(170, 230);
aPane.getChildren().addAll(myPanel1, myPanel2);
```
