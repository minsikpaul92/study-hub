Source: <APD545 Week 6 · Segment 4 "Crafting Your Own Dialog Boxes" 강의 슬라이드 (Mahboob Ali, Seneca) 핵심 문장 발췌>
# Week 6 · Segment 4. Crafting Your Own Dialog Box

## Making My Own Dialog Boxes

> Dialog boxes have an **owner** which is the window that caused it to appear. When the application quits, all windows are closed; when the owner is minimized, the dialog boxes are also minimized.
>
> The **model is used as the "middle-man"** between the two windows. When the dialog box is first opened, the model contents are used to populate the components. When the dialog box is closed with the **OK** button, the model is updated. When closed with **CANCEL**, the model remains unchanged. When either button is clicked, the dialog box closes. The standard "close" (X) should be treated as a cancel.

## Dialog subclass

```java
public class MyDialog extends Dialog<RETURN_TYPE> {
    public MyDialog(Stage owner, String title, ...) {
        setTitle(title);
    }
}
```

## setResultConverter pattern

> The owner usually needs to know whether OK was pressed or cancelled. Return **null** to indicate that it was cancelled, and something else otherwise.

```java
setResultConverter(new Callback<ButtonType, RETURN_TYPE>() {
    public RETURN_TYPE call(ButtonType b) {
        if (b == okButtonType) {
            // extract data from the dialog box and return it
        }
        return null;
    }
});

Optional<RETURN_TYPE> result = myDialog.showAndWait();
if (result.isPresent()) { ... } else { ... }
```

## EmailBuddy model

```java
public class EmailBuddy {
    private String name, address;
    private boolean onHotList;

    public EmailBuddy() { name = ""; address = ""; onHotList = false; }
    public String getName() { return name; }
    public String getAddress() { return address; }
    public boolean onHotList() { return onHotList; }
    public void setName(String n) { name = n; }
    public void setAddress(String a) { address = a; }
    public void onHotList(boolean b) { onHotList = b; }
    public String toString() { return name; }
}

public class EmailBuddyList {
    // array + size, add, remove, getBuddy(i), getHotListSize(), getHotListBuddy(i)
}
```

## EmailBuddyPanel (view)

```java
public class EmailBuddyPanel extends GridPane {
    private EmailBuddyList model;
    private ListView<EmailBuddy> buddyList;
    private Button addButton, removeButton;
    private CheckBox hotListButton;

    public EmailBuddyPanel(EmailBuddyList m) {
        model = m;
        buddyList = new ListView<>();
        add(buddyList, 0, 0, 1, 3);           // col 0, row 0, spans 1 column, 3 rows
        addButton = new Button("Add");         add(addButton, 1, 0);
        removeButton = new Button("Remove");   add(removeButton, 1, 1);
        hotListButton = new CheckBox("Show Hot List"); add(hotListButton, 1, 2);
        update();
    }

    public void update() {
        int selectedItem = buddyList.getSelectionModel().getSelectedIndex();
        EmailBuddy[] exactList;
        if (hotListButton.isSelected()) {
            exactList = new EmailBuddy[model.getHotListSize()];
            for (int i = 0; i < model.getHotListSize(); i++) exactList[i] = model.getHotListBuddy(i);
        } else {
            exactList = new EmailBuddy[model.getSize()];
            for (int i = 0; i < model.getSize(); i++) exactList[i] = model.getBuddy(i);
        }
        buddyList.setItems(null);   // seems to be required for a proper update
        buddyList.setItems(FXCollections.observableArrayList(exactList));
        buddyList.getSelectionModel().select(selectedItem);
        removeButton.setDisable(buddyList.getSelectionModel().getSelectedIndex() < 0);
    }
}
```

## BuddyDetailsDialog

```java
public class BuddyDetailsDialog extends Dialog<EmailBuddy> {
    public BuddyDetailsDialog(Stage owner, String title, EmailBuddy bud) {
        setTitle(title);
        ButtonType okButtonType = new ButtonType("OK", ButtonBar.ButtonData.OK_DONE);
        getDialogPane().getButtonTypes().addAll(okButtonType, ButtonType.CANCEL);

        TextField nameField = new TextField(bud.getName());          // populate from the model
        TextField addressField = new TextField(bud.getAddress());
        CheckBox onHotList = new CheckBox("On Hot List");
        onHotList.setSelected(bud.onHotList());
        GridPane grid = new GridPane();
        grid.add(new Label("Name:"), 0, 0);    grid.add(nameField, 1, 0);
        grid.add(new Label("Address:"), 0, 1); grid.add(addressField, 1, 1);
        grid.add(onHotList, 1, 2);
        getDialogPane().setContent(grid);

        setResultConverter(b -> {
            if (b == okButtonType) {
                bud.setName(nameField.getText());
                bud.setAddress(addressField.getText());
                bud.onHotList(onHotList.isSelected());
                return bud;
            }
            return null;
        });

        Node okButton = getDialogPane().lookupButton(okButtonType);
        okButton.setDisable(true);
        // on every key/check: okButton.setDisable(nameField empty || addressField empty);
    }
}
```

## Controller: Add, Remove, Edit

```java
view.getAddButton().setOnAction(e -> {
    EmailBuddy aBuddy = new EmailBuddy();
    Dialog<EmailBuddy> dialog = new BuddyDetailsDialog(primaryStage, "New Buddy Details", aBuddy);
    Optional<EmailBuddy> result = dialog.showAndWait();
    if (result.isPresent()) {
        model.add(aBuddy);
        view.update();
    }
});

view.getBuddyList().setOnMousePressed(e -> {
    if (e.getClickCount() == 2) {
        int i = view.getBuddyList().getSelectionModel().getSelectedIndex();
        if (i >= 0) {
            EmailBuddy selected = view.getHotListButton().isSelected()
                    ? model.getHotListBuddy(i) : model.getBuddy(i);
            if (selected == null) return;
            Optional<EmailBuddy> result =
                new BuddyDetailsDialog(primaryStage, "Edit Buddy Details", selected).showAndWait();
            if (result.isPresent()) view.update();
        }
    } else {
        view.update();   // single click: enable Remove
    }
});
```
