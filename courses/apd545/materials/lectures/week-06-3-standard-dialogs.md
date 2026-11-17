Source: <APD545 Week 6 · Segment 3 "Standard Dialog Boxes" 강의 슬라이드 (Mahboob Ali, Seneca) 핵심 문장 발췌>
# Week 6 · Segment 3. Standard Dialog Boxes

## Standard Dialog Boxes

> A **Dialog Box** is a secondary window (i.e., not the main application window) that is used to interact with the user, usually to display or obtain additional information. The **Alert** class is used to represent a standard dialog box in JavaFX.

## Alert

```java
Alert alert = new Alert(Alert.AlertType.INFORMATION);   // or WARNING, ERROR
alert.setTitle("Message To the User");
alert.setHeaderText(null);                              // no header
alert.setContentText("If you inserted a USB flash drive, take it with you.");
alert.showAndWait();
```

## Expandable content

```java
alert.getDialogPane().setExpandableContent(expandableContent);   // Show / Hide details
```

## CONFIRMATION

> We can ask for the result from showAndWait() and use get() to find out which ButtonType was pressed. If the user closes the window by pressing the **X**, this is considered as **CANCEL**.

```java
Alert alert = new Alert(Alert.AlertType.CONFIRMATION);
alert.setContentText("Do you want me to clean up your hard drive?");
Optional<ButtonType> result = alert.showAndWait();
if (result.get() == ButtonType.OK) System.out.println("OK, I'm erasing it now ...");
else System.out.println("Fine then, you clean it up!");
```

## Custom buttons

```java
alert.getButtonTypes().setAll();                   // erases the default buttons
ButtonType good = new ButtonType("Good");
alert.getButtonTypes().add(good);
alert.getButtonTypes().add(new ButtonType("Cancel", ButtonBar.ButtonData.CANCEL_CLOSE));
Optional<ButtonType> result = alert.showAndWait();
if (result.get() == good) { ... }
```

## ChoiceDialog

> `isPresent()` allows us to determine whether or not the user selected an item or pressed CANCEL.

```java
String[] options = {"Apple", "Orange", "Strawberry", "Banana", "Peaches"};
ChoiceDialog<String> dialog = new ChoiceDialog<>("Peaches", options);   // default value
Optional<String> result = dialog.showAndWait();
if (result.isPresent()) System.out.println("Your choice: " + result.get());
```

## TextInputDialog

```java
TextInputDialog dialog = new TextInputDialog("Mark");
dialog.setContentText("Please enter your name:");
Optional<String> result = dialog.showAndWait();
if (result.isPresent()) System.out.println("Your name is: " + result.get());
```

## Login Dialog with Dialog

```java
Dialog<Pair<String, String>> dialog = new Dialog<>();
dialog.setTitle("Login Dialog");
ButtonType loginButtonType = new ButtonType("Login", ButtonBar.ButtonData.OK_DONE);
dialog.getDialogPane().getButtonTypes().addAll(loginButtonType, ButtonType.CANCEL);

GridPane grid = new GridPane();
TextField username = new TextField();
PasswordField password = new PasswordField();
grid.add(new Label("Username:"), 0, 0); grid.add(username, 1, 0);
grid.add(new Label("Password:"), 0, 1); grid.add(password, 1, 1);
dialog.getDialogPane().setContent(grid);
```

## setResultConverter

> If we created the dialog box elsewhere, we would not be able to access the username and password fields directly. We would need to adjust the **return value** of the Dialog box. If CANCEL was pressed, or the window was closed, the result will be **null**.

```java
dialog.setResultConverter(new Callback<ButtonType, Pair<String, String>>() {
    public Pair<String, String> call(ButtonType b) {
        if (b == loginButtonType)
            return new Pair<>(username.getText(), password.getText());
        return null;
    }
});

Optional<Pair<String, String>> result = dialog.showAndWait();
if (result.isPresent())
    System.out.println("Username = " + result.get().getKey() + ", Password = " + result.get().getValue());
```

## Login button enable/disable

```java
username.requestFocus();
Node loginButton = dialog.getDialogPane().lookupButton(loginButtonType);
loginButton.setDisable(true);
username.textProperty().addListener((observable, oldValue, newValue) ->
        loginButton.setDisable(newValue.trim().isEmpty()));
```

## File Chooser Dialog Box

> The dialog box returns a **File** object. If the user cancels, it returns **null**.

```java
FileChooser chooser = new FileChooser();
chooser.setTitle("Open Data File");
chooser.setInitialDirectory(new File(System.getProperty("user.home")));
chooser.getExtensionFilters().addAll(
        new FileChooser.ExtensionFilter("All Files", "*.*"),
        new FileChooser.ExtensionFilter("PNG", "*.png"));
File f = chooser.showOpenDialog(primaryStage);   // or showSaveDialog
if (f != null) {
    System.out.println(f.getName());
    System.out.println(f.getAbsolutePath());
}
```
