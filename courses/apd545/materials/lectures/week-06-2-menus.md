Source: <APD545 Week 6 · Segment 2 "Working with Menus" 강의 슬라이드 (Mahboob Ali, Seneca) 핵심 문장 발췌>
# Week 6 · Segment 2. Working with Menus

## Working with Menus

> A menu is a list of commands presented to the user at his/her request. Menus can be attached to a menu bar at the top of an application or they may be pop-up menus. Classes: **MenuBar, Menu, ContextMenu, MenuItem, CheckMenuItem, SeparatorMenuItem, RadioMenuItem**.

## MenuBar and Menus

```java
VBox aPane = new VBox();
Menu fileMenu = new Menu("_File");
Menu editMenu = new Menu("_Edit");
Menu settingsMenu = new Menu("_Settings");

MenuBar menuBar = new MenuBar();
menuBar.getMenus().addAll(fileMenu, editMenu, settingsMenu);
aPane.getChildren().add(menuBar);
```

## MenuItems, separator and accelerators

```java
MenuItem newItem = new MenuItem("New");
MenuItem openItem = new MenuItem("Open...");
MenuItem closeItem = new MenuItem("Close");
fileMenu.getItems().addAll(newItem, new SeparatorMenuItem(), openItem, closeItem);

newItem.setAccelerator(KeyCombination.keyCombination("Ctrl+N"));
openItem.setAccelerator(KeyCombination.keyCombination("Ctrl+O"));
closeItem.setDisable(true);
```

> Accelerators are "quick key" presses that allow the user to select the menu item without having to go through the menus.

## RadioMenuItem and ToggleGroup

> Each RadioMenuItem is added to a **ToggleGroup**, to ensure that only one can be selected at a time.

```java
ToggleGroup settingGroup = new ToggleGroup();
RadioMenuItem smallItem = new RadioMenuItem("Small");
smallItem.setToggleGroup(settingGroup);
RadioMenuItem largeItem = new RadioMenuItem("Large");
largeItem.setToggleGroup(settingGroup);
settingsMenu.getItems().addAll(smallItem, largeItem);
```

## Cascaded menu and CheckMenuItem

```java
Menu searchMenu = new Menu("Search");
searchMenu.getItems().addAll(new MenuItem("Find"), new MenuItem("Replace"));
CheckMenuItem gridItem = new CheckMenuItem("Use GridLines");
editMenu.getItems().addAll(gridItem, new SeparatorMenuItem(), new MenuItem("Copy"), searchMenu);
```

## ContextMenu

> A menu that will pop up wherever we right click. It is created like any other menu. However, **it is not added to anything**. We use the show() method in a mouse handler.

```java
ContextMenu popupMenu = new ContextMenu();
popupMenu.getItems().addAll(new MenuItem("Help"), new MenuItem("Inspect"));

aPane.setOnMouseClicked(new EventHandler<MouseEvent>() {
    public void handle(MouseEvent e) {
        if (e.getButton() == MouseButton.SECONDARY)
            popupMenu.show(aPane, e.getScreenX() - 50, e.getScreenY() - 25);
    }
});
```

## Menu event handlers

> We simply add it to the MenuItem instead of the Button. For a CheckMenuItem, use **isSelected()**. We need to type-cast because getSource() returns an Object type.

```java
gridItem.setOnAction(new EventHandler<ActionEvent>() {
    public void handle(ActionEvent e) {
        if (((CheckMenuItem) e.getSource()).isSelected())
            System.out.println("USE GRIDLINES has been selected");
        else
            System.out.println("USE GRIDLINES has been unselected");
    }
});

newItem.setOnAction(e -> {
    closeItem.setDisable(false);
    newItem.setDisable(true);
    openItem.setDisable(true);
});
```
