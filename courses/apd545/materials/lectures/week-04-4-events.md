Source: <APD545 Week 4 · Segment 4 "Event Handling" 강의 슬라이드 (Mahboob Ali, Seneca) 핵심 문장 발췌>
# Week 4 · Segment 4. Event Driven Programming

## Three important definitions

> - An **event** is something that happens in the program based on some kind of triggering input, typically caused by user interaction such as pressing a key, moving the mouse, or pressing a mouse button.
> - The **source** of an event is the component for which the event was generated (i.e., when handling button clicks, the Button is the source).
> - An **event handler** is a procedure that contains the code to be executed when a specific type of event occurs.

## Understanding events flow

> The user causes an event → events are generated → the appropriate event handler is called → the event handling code **changes the model** → the user interface is **updated** to reflect these changes.

## Handling Events

> Application logic is contained in the event filters and handlers, which are objects of the **EventHandler** interface.

```java
public interface EventHandler<T extends Event> extends EventListener {
    void handle(T event);
}
```

> EventHandler is a generic interface in `javafx.event`. EventListener is a **marker interface** (empty, no methods) in `java.util`.

## Registering a handler

> For every event that we want to handle, we must not only write the event handler but also **register** that event handler too. Like signing up on a webpage to receive an email notification.

```java
aButton.setOnAction(new EventHandler<ActionEvent>() {
    public void handle(ActionEvent event) {
        System.out.println("That felt good!");
    }
});
```

## One handler for many buttons: Keypad

```java
String[] labels = {"1","2","3","4","5","6","7","8","9","*","0","#"};
for (int row = 0; row < 4; row++) {
    for (int col = 0; col < 3; col++) {
        buttons[row][col] = new Button(labels[row * 3 + col]);
        buttons[row][col].relocate(10 + col * 70, 10 + row * 70);
        buttons[row][col].setPrefSize(65, 65);
        buttons[row][col].setOnAction(new EventHandler<ActionEvent>() {
            public void handle(ActionEvent actionEvent) {
                System.out.println("Button " +
                    ((Button) actionEvent.getSource()).getText() + " was pressed.");
            }
        });
        aPane.getChildren().add(buttons[row][col]);
    }
}
```

## Example: Calculator

> Convert text to numbers: `Float.parseFloat(s)`, `Integer.parseInt(s)`, `Double.parseDouble(s)`, `Boolean.parseBoolean(s)`. Convert a number into a String: `aTextField.setText("" + x);`. Output-only fields: `setEditable(false)`.

```java
computeButton.setOnAction(new EventHandler<ActionEvent>() {
    public void handle(ActionEvent actionEvent) {
        if (valueField.getText().length() > 0) {
            float value = Float.parseFloat(valueField.getText());
            squareField.setText("" + value * value);
            rootField.setText("" + Math.sqrt(value));
        }
    }
});
```
