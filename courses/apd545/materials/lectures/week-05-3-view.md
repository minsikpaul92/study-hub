Source: <APD545 Week 5 · Segment 3 "Preparing View(s) for GUI" 강의 슬라이드 (Mahboob Ali, Seneca) 핵심 문장 발췌>
# Week 5 · Segment 3. Preparing Views

## Views as Panes

> In general, there may be many views in an application, just as there may be many models and controllers. To keep things simple, we will develop our views as **Pane** objects that can be placed onto our Application windows.

## update()

> For the view to work properly it must refresh its look based on the most up-to-date information in the model. A simple way is to write a method called **update()** that will refresh the "look" of the view whenever it is called. The view must have access to the model: pass the model in as a parameter to the view constructor and store it as an attribute.

## Instance variables and getters

> The ListView is defined as a local variable in the constructor. In order to access it from update(), define the variable as an **instance variable**. The controller needs to access the Button, ListView and TextField objects: make instance variables for all four window components and provide **get methods**.
>
> It is a good idea to **call the update() method at the end of the constructor**. That way, when the view is first created, it can be refreshed right away to show the true state of the model upon startup.

## GroceryListView

```java
public class GroceryListView extends Pane {
    private ItemList model;
    private ListView<String> groceryList;
    private Button addButton;
    private Button removeButton;
    private TextField newItemField;

    public ListView<String> getList()   { return groceryList; }
    public Button getAddButton()        { return addButton; }
    public Button getRemoveButton()     { return removeButton; }
    public TextField getNewItemField()  { return newItemField; }

    public GroceryListView(ItemList m) {
        model = m;
        newItemField = new TextField();
        newItemField.relocate(10, 10);
        newItemField.setPrefSize(150, 25);
        addButton = new Button("Add");
        addButton.relocate(175, 10);
        addButton.setPrefSize(100, 25);
        removeButton = new Button("Remove");
        removeButton.relocate(175, 45);
        removeButton.setPrefSize(100, 25);
        groceryList = new ListView<>();
        groceryList.relocate(10, 45);
        groceryList.setPrefSize(150, 150);

        getChildren().addAll(newItemField, addButton, removeButton, groceryList);
        update();
    }

    public void update() {
        String[] exactList = new String[model.getSize()];
        for (int i = 0; i < model.getSize(); i++)
            exactList[i] = model.getItems()[i];
        groceryList.setItems(FXCollections.observableArrayList(exactList));
    }
}
```

## Why exactList?

> Our model's array is always of size 100 regardless of how many items have been placed in it. setItems() would end up making a list of 100 items, leaving many blanks. So make a new array with a length **exactly equal to the size**.
