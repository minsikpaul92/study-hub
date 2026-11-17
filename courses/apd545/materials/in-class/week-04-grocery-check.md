Source: <APD545 Week 4 교수님 샘플 코드 WK_4_Grocery_Check 발췌 (FXML + Controller)>
# Week 4 · Sample: WK_4_Grocery_Check

## Example: GroceryApplication (load FXML)

```java
public class GroceryApplication extends Application {
    @Override
    public void start(Stage stage) throws IOException {
        FXMLLoader fxmlLoader = new FXMLLoader(GroceryApplication.class.getResource("grocery-view.fxml"));
        Scene scene = new Scene(fxmlLoader.load());
        stage.setTitle("Hello!");
        stage.setScene(scene);
        stage.show();
    }
}
```

## Example: grocery-view.fxml (key parts)

```xml
<GridPane fx:controller="ca.senecacollege.application.controllers.GroceryController" ...>
   <children>
      <Label text="Grocery List" />
      <Label text="Checked List" GridPane.columnIndex="2" />
      <ListView fx:id="groceryLV" GridPane.rowIndex="1" />
      <ListView fx:id="checkedLV" GridPane.columnIndex="2" GridPane.rowIndex="1" />
      <VBox alignment="CENTER" spacing="30.0" GridPane.columnIndex="1" GridPane.rowIndex="1">
         <Button onAction="#onClickMoveGroceryLeftToRight" text="&gt;&gt;&gt;" />
         <Button onAction="#onClickMoveGroceryRightToLeft" text="&lt;&lt;&lt;" />
      </VBox>
   </children>
</GridPane>
```

## Example: GroceryController

```java
public class GroceryController {
    @FXML private ListView<String> checkedLV;
    @FXML private ListView<String> groceryLV;

    private ObservableList<String> grocery_list =
        FXCollections.observableArrayList("Apple", "Orange", "PineApple", "Cherry");
    private ObservableList<String> checked_list = FXCollections.observableArrayList();

    @FXML
    public void initialize() {
        groceryLV.setItems(grocery_list);
        checkedLV.setItems(checked_list);
    }

    @FXML
    void onClickMoveGroceryLeftToRight(ActionEvent event) {
        String temp = checkedLV.getSelectionModel().getSelectedItem();
        if (temp != null) {
            grocery_list.add(temp);
            checkedLV.getSelectionModel().clearSelection();
            checked_list.remove(temp);
        }
    }

    @FXML
    void onClickMoveGroceryRightToLeft(ActionEvent event) {
        String temp = groceryLV.getSelectionModel().getSelectedItem();
        if (temp != null) {
            checked_list.add(temp);
            groceryLV.getSelectionModel().clearSelection();
            grocery_list.remove(temp);
        }
    }
}
```
