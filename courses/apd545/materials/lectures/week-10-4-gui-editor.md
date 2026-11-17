Source: <APD545 Week 10 · Segment 4 "Working with Scene Builder" 강의 슬라이드 (Mahboob Ali, Seneca) 핵심 문장 발췌>
# Week 10 · Segment 4. GUI Editor: Painter App with Scene Builder

## Scene Graph and Node Size

> Nodes shouldn't be defined with explicit size. Instead specify a node's range with acceptable size; the **preferred size** properties should be used by the layout in most cases. A node's position should be defined **relative** to its parent.

## BorderPane areas

> All the areas in the BorderPane are optional. If the top or bottom area is empty, the left, center and right areas expand vertically. If the left or right area is empty, the center expands horizontally.

## Layout settings

> - VBox: Spacing 8, Margin 8, Pref size **USE_COMPUTED_SIZE**, Max Height **MAX_VALUE**.
> - Drawing Pane (center, `fx:id="drawingAreaPane"`): Max Width/Height MAX_VALUE, style `-fx-background-color: white`.
> - **TitledPane**: displays a title at its top and is a collapsible panel containing a layout node.
> - VBox column: Max Width **USE_PREF_SIZE** (only as wide as it needs to be).

## RadioButton and ToggleGroup

> RadioButtons function as mutually exclusive options. Add multiple RadioButtons to a **ToggleGroup** to ensure that only one is selected at a time. In Scene Builder set the Toggle Group property to `colorToggleGroup` / `sizeToggleGroup`.

## Controller and event handler names

> Controller Class: `PainterController`. drawingAreaPane On Mouse Dragged: `drawingAreaMouseDragged`. Color RadioButtons On Action: `colorRadioButtonSelected`. Size RadioButtons: `sizeRadioButtonSelected`. Undo: `undoButtonPressed`. Clear: `clearButtonPressed`. Scene Builder can generate a skeleton: **View > Show Sample Controller Skeleton**.

## PainterController

```java
public class PainterController {
    private enum PenSize {
        SMALL(2), MEDIUM(4), LARGE(6);
        private final int radius;
        PenSize(int radius) { this.radius = radius; }
        public int getRadius() { return radius; }
    }

    @FXML private RadioButton blackRadioButton, redRadioButton, greenRadioButton, blueRadioButton;
    @FXML private RadioButton smallRadioButton, mediumRadioButton, largeRadioButton;
    @FXML private ToggleGroup colorToggleGroup, sizeToggleGroup;
    @FXML private Pane drawingAreaPane;

    private PenSize radius = PenSize.MEDIUM;
    private Paint brushColor = Color.BLACK;

    public void initialize() {
        blackRadioButton.setUserData(Color.BLACK);
        redRadioButton.setUserData(Color.RED);
        greenRadioButton.setUserData(Color.GREEN);
        blueRadioButton.setUserData(Color.BLUE);
        smallRadioButton.setUserData(PenSize.SMALL);
        mediumRadioButton.setUserData(PenSize.MEDIUM);
        largeRadioButton.setUserData(PenSize.LARGE);
    }

    @FXML
    void drawingAreaMouseDragged(MouseEvent event) {
        Circle newCircle = new Circle(event.getX(), event.getY(), radius.getRadius(), brushColor);
        drawingAreaPane.getChildren().add(newCircle);
    }

    @FXML
    void colorRadioButtonSelected(ActionEvent event) {
        brushColor = (Color) colorToggleGroup.getSelectedToggle().getUserData();
    }

    @FXML
    void sizeRadioButtonSelected(ActionEvent e) {
        radius = (PenSize) sizeToggleGroup.getSelectedToggle().getUserData();
    }

    @FXML
    void undoButtonPressed(ActionEvent event) {
        int count = drawingAreaPane.getChildren().size();
        if (count > 0) drawingAreaPane.getChildren().remove(count - 1);
    }

    @FXML
    void clearButtonPressed(ActionEvent event) {
        drawingAreaPane.getChildren().clear();
    }
}
```
