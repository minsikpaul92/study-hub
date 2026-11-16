Source: <APD545 Week 7 교수님 샘플 코드 WK_7_Player_With_DI (Blackboard), 주요 파일 발췌. import 문은 생략>
# Week 7 샘플 코드: WK_7_Player_With_DI (Guice + FXML + 여러 화면)

## Project Structure

```text
src/main/java/
  module-info.java
  ca/senecacollege/application/
    wk_7_player_with_di/  HelloApplication.java, Launcher.java
    controllers/          RootController, PlayerOverviewController, PlayerEditDialogController
    models/               Player.java, DateConverter.java
    repositories/         IPlayerRepository.java, PlayerRepository.java
    utilities/            AppModule.java
src/main/resources/.../wk_7_player_with_di/
    RootLayout.fxml (BorderPane + MenuBar), PlayerOverview.fxml (TableView), PlayerEditDialog.fxml
pom.xml: javafx-controls, javafx-fxml 21, com.google.inject:guice 7.0.0
```

## Example: AppModule (Guice bindings)

```java
public class AppModule extends AbstractModule {
    private Stage primaryStage;

    public AppModule(Stage primaryStage) {
        this.primaryStage = primaryStage;
    }

    @Override
    protected void configure() {
        bind(IPlayerRepository.class).to(PlayerRepository.class).in(Singleton.class);
    }

    @Provides
    @Singleton
    public Stage providePrimaryStage() {
        return primaryStage;
    }
}
```

## Example: Repository interface and implementation

```java
public interface IPlayerRepository {
    ObservableList<Player> findAll();
    void add(Player player);
    void remove(Player player);
}

public class PlayerRepository implements IPlayerRepository {
    private final ObservableList<Player> players = FXCollections.observableArrayList();

    public PlayerRepository() {
        players.add(new Player("John", "Michle", "Alpha"));
        players.add(new Player("Jack", "Adams", "Gamma"));
        players.add(new Player("Mike", "Tylor", "Beta"));
        // ... 4 more players
    }

    @Override public ObservableList<Player> findAll() { return players; }
    @Override public void add(Player player) { players.add(player); }
    @Override public void remove(Player player) { players.remove(player); }
}
```

## Example: Player model with JavaFX properties

```java
public class Player {
    private final StringProperty firstName;
    private final StringProperty lastName;
    private final StringProperty team;
    private final ObjectProperty<LocalDate> birthday;
    // street, postalCode, city ...

    public Player() { this("", "", ""); }

    public Player(String firstName, String lastName, String team) {
        this.firstName = new SimpleStringProperty(firstName);
        this.lastName = new SimpleStringProperty(lastName);
        this.team = new SimpleStringProperty(team);
        this.birthday = new SimpleObjectProperty<LocalDate>(LocalDate.of(2026, 2, 11));
    }

    public StringProperty getFirstNameProperty() { return firstName; }
    public String getFirstName() { return firstName.get(); }
    public void setFirstName(String fn) { firstName.set(fn); }
    // same pattern for lastName, team, birthday ...
}
```

## Example: HelloApplication (Injector + controller factory)

```java
public class HelloApplication extends Application {
    private Injector injector;
    private Stage primaryStage;
    private BorderPane rootLayout;

    @Override
    public void start(Stage primaryStage) throws IOException {
        this.primaryStage = primaryStage;
        this.primaryStage.setTitle("Team Player Application");
        // creating DI containers with the primaryStage
        injector = Guice.createInjector(new AppModule(primaryStage));
        initializeRootLayout();
        showPlayerOverviewLayout();
    }

    private void initializeRootLayout() {
        try {
            FXMLLoader loader = new FXMLLoader(HelloApplication.class.getResource("RootLayout.fxml"));
            // ask the GUICE to provide the constructor default or overloaded
            loader.setControllerFactory(injector::getInstance);
            rootLayout = loader.load();
            Scene scene = new Scene(rootLayout);
            primaryStage.setScene(scene);
            primaryStage.show();
        } catch (Exception e) { e.printStackTrace(); }
    }

    private void showPlayerOverviewLayout() {
        try {
            FXMLLoader fxmlLoader = new FXMLLoader(HelloApplication.class.getResource("PlayerOverview.fxml"));
            fxmlLoader.setControllerFactory(injector::getInstance);
            AnchorPane ap = fxmlLoader.load();
            PlayerOverviewController playerOverviewController = fxmlLoader.getController();
            playerOverviewController.setMainApp(this);
            rootLayout.setCenter(ap);
        } catch (Exception e) { e.printStackTrace(); }
    }

    // Dialog creation leveraging DI controller factory
    public boolean showPlayerAddEditDialog() throws IOException {
        FXMLLoader loader = new FXMLLoader(HelloApplication.class.getResource("PlayerEditDialog.fxml"));
        loader.setControllerFactory(injector::getInstance);
        AnchorPane content = loader.load();
        Stage dialog = new Stage();
        dialog.setTitle("Add / Edit Player Information");
        dialog.initOwner(primaryStage);
        dialog.initModality(Modality.WINDOW_MODAL);
        dialog.setScene(new Scene(content));
        PlayerEditDialogController controller = loader.getController();
        controller.setDialogStage(dialog);
        dialog.showAndWait();
        return controller.isSaveClicked();
    }
}
```

## Example: PlayerOverviewController (@Inject constructor)

```java
public class PlayerOverviewController {
    @FXML private TableView<Player> playerTable;
    @FXML private TableColumn<Player, String> firstNameColumn;
    @FXML private TableColumn<Player, String> lastNameColumn;
    @FXML private TableColumn<Player, String> teamColumn;
    @FXML private Label firstNameLabel;   // ... more labels

    private HelloApplication mainApp;
    private final Stage primaryStage;
    private final PlayerRepository _repository;

    @Inject
    public PlayerOverviewController(Stage primaryStage, PlayerRepository _repository) {
        this.primaryStage = primaryStage;
        this._repository = _repository;
    }

    @FXML
    private void initialize() {
        firstNameColumn.setCellValueFactory(cv -> cv.getValue().getFirstNameProperty());
        lastNameColumn.setCellValueFactory(cv -> cv.getValue().getLastNameProperty());
        teamColumn.setCellValueFactory(cv -> cv.getValue().getTeamProperty());
        playerTable.setItems(_repository.findAll());
        playerTable.getSelectionModel().selectedItemProperty()
                   .addListener((ob, cV, nV) -> showPlayerDetails(nV));
    }

    @FXML
    void handleDeletePlayer(ActionEvent event) {
        Player player = playerTable.getSelectionModel().getSelectedItem();
        if (player != null)
            _repository.remove(player);
        else {
            Alert al = new Alert(Alert.AlertType.WARNING);
            al.initOwner(primaryStage);
            al.setContentText("Please select a player from the table first");
            al.show();
        }
    }

    @FXML
    void handleNewPlayer(ActionEvent event) throws IOException {
        Player newPlayer = new Player();
        _repository.add(newPlayer);
        playerTable.getSelectionModel().select(newPlayer);
        boolean isClicked = mainApp.showPlayerAddEditDialog();
        if (!isClicked) {
            _repository.remove(newPlayer);   // rollback the changes
        }
    }

    public void setMainApp(HelloApplication helloApplication) { mainApp = helloApplication; }
}
```

## Example: PlayerEditDialogController (Save / Cancel)

```java
public class PlayerEditDialogController {
    @FXML private TextField firstNameTextField;   // ... more fields
    private final PlayerRepository repository;
    private Stage stage;
    private boolean isClicked = false;

    @Inject
    public PlayerEditDialogController(PlayerRepository repository) {
        this.repository = repository;
    }

    @FXML
    void handleSave(ActionEvent event) {
        Player player = resolveActivePlayer();
        if (player != null) {
            player.setFirstName(firstNameTextField.getText());
            // ... other fields
            player.setBirthday(DateConverter.convertToLocalDate(birthdayTextField.getText()));
        }
        isClicked = true;
        stage.close();
    }

    @FXML
    void handleCancel(ActionEvent event) {
        isClicked = false;
        stage.close();
    }

    public void setDialogStage(Stage stage) { this.stage = stage; /* fill fields from last player */ }
    public boolean isSaveClicked() { return isClicked; }
}
```

## Example: module-info.java

```java
module ca.senecacollege.application.wk_7_player_with_di {
    requires javafx.controls;
    requires javafx.fxml;
    requires com.google.guice;

    opens ca.senecacollege.application.wk_7_player_with_di to javafx.fxml;
    exports ca.senecacollege.application.wk_7_player_with_di;
    exports ca.senecacollege.application.controllers;
    opens ca.senecacollege.application.controllers to javafx.fxml;
    exports ca.senecacollege.application.repositories to com.google.guice;
    exports ca.senecacollege.application.utilities to com.google.guice;
}
```
