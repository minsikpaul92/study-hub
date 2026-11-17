Source: <APD545 Week 5 · Segment 4 "Preparing Controller Classes for GUI" 강의 슬라이드 (Mahboob Ali, Seneca) 핵심 문장 발췌>
# Week 5 · Segment 4. Preparing Controller Classes

## The controller

> The controller is responsible for taking in user input and making changes to the model accordingly. These changes can then be refreshed with a simple call to update() in the view class. The controller will be our **Application** class. It will tie together the model and the view.

```java
public class GroceryListApp extends Application {
    private ItemList model;
    private GroceryListView view;

    public void start(Stage primaryStage) {
        model = new ItemList();
        view = new GroceryListView(model);
        // event handlers are hooked up here
        primaryStage.setTitle("My Grocery List");
        primaryStage.setScene(new Scene(view, 285, 205));
        primaryStage.show();
    }
}
```

## Add Items

> The code does two main things that ALL of your event handlers should do: **Change the Model, Update the View**. The method is **private**, since no external classes should be calling it.

```java
private void handleAddButtonPress() {
    String text = view.getNewItemField().getText().trim();
    if (text.length() > 0) {
        view.getNewItemField().setText("");
        model.add(text);
        view.update();
    }
}

view.getAddButton().setOnAction(new EventHandler<ActionEvent>() {
    public void handle(ActionEvent actionEvent) {
        handleAddButtonPress();
    }
});
```

> `trim()` removes any leading and trailing space and tab characters, so we do not add items consisting of only spaces.

## Removing Items

> `getSelectionModel().getSelectedIndex()` will return **-1 if nothing is selected**, so we should handle that.

```java
private void handleRemoveButtonPress() {
    int index = view.getList().getSelectionModel().getSelectedIndex();
    if (index >= 0) {
        model.remove(index);
        view.update();
    }
}
```

## Extras: Disabling the remove button

> Disable the Remove button when nothing has been selected. Since this is simply a visual change, add a line to the view's update(). Then call update() whenever the user clicks in the list. Repopulating the list unselects the item, so remember the selection and re-select it.

```java
// in view.update()
int selectedIndex = groceryList.getSelectionModel().getSelectedIndex();
groceryList.setItems(FXCollections.observableArrayList(exactList));
groceryList.getSelectionModel().select(selectedIndex);
removeButton.setDisable(groceryList.getSelectionModel().getSelectedIndex() < 0);

// in controller
view.getList().setOnMousePressed(new EventHandler<MouseEvent>() {
    public void handle(MouseEvent mouseEvent) { view.update(); }
});
```

## Extras: Disabling the Add button

```java
// in view.update()
addButton.setDisable(newItemField.getText().trim().length() <= 0);

// in controller
view.getNewItemField().setOnKeyReleased(new EventHandler<KeyEvent>() {
    public void handle(KeyEvent keyEvent) { view.update(); }
});
```

> A **KeyPressed** event will not work here because it will generate the event **before** the typed character is part of the text field's data, so we will always be missing one character. A **KeyReleased** event will be generated AFTER the character has been added. Note it will not be called if the user cuts or pastes via a mouse operation.
