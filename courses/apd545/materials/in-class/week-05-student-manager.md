Source: <APD545 Week 5 교수님 샘플 코드 WK_5_Properties_Manual_DI 발췌 (구조와 핵심 메서드만)>
# Week 5 · Sample: Student Manager (Properties + Manual DI, then Guice)

## Project Structure

```
models/        Student (JavaFX properties), User
repositories/  IStudentRepository, InMemoryStudentRepository
services/      IUserService, UserService
controllers/   LoginController, MainController, StudentEditController
utility/       AppContext (manual DI first, then a Guice module)
resources/     login-view.fxml, student-manager.fxml, student-editor.fxml
```

## Example: Student model with properties

```java
public class Student {
    private StringProperty name = new SimpleStringProperty();
    private DoubleProperty grade = new SimpleDoubleProperty();
    private BooleanProperty enrolled = new SimpleBooleanProperty();

    public Student(String name, double grade, boolean enrolled) {
        this.name.set(name);
        this.grade.set(grade);
        this.enrolled.set(enrolled);
    }

    public String getName() { return name.get(); }
    public void setName(String name) { this.name.set(name); }
    public StringProperty nameProperty() { return name; }
    // grade and enrolled: same three methods (isEnrolled for boolean)
}
```

## Example: Repository interface and in-memory implementation

```java
public interface IStudentRepository {
    ObservableList<Student> getAllStudents();
    void addStudent(Student student);
    void deleteStudent(Student student);
}

public class InMemoryStudentRepository implements IStudentRepository {
    private final ObservableList<Student> students = FXCollections.observableArrayList();
    public ObservableList<Student> getAllStudents() { return students; }
    public void addStudent(Student s)    { students.add(s); }
    public void deleteStudent(Student s) { students.remove(s); }
}
```

## Example: AppContext (manual DI version)

```java
public class AppContext {
    private static final IUserService userService = new UserService();
    private static final IStudentRepository studentRepository = new InMemoryStudentRepository();

    public static IUserService getUserService() { return userService; }
    public static IStudentRepository getStudentRepository() { return studentRepository; }
}

// in HelloApplication.start
LoginController loginController = new LoginController(AppContext.getUserService());
fxmlLoader.setController(loginController);
```

## Example: AppContext (Guice version)

```java
public class AppContext extends AbstractModule {
    @Override
    protected void configure() {
        bind(IUserService.class).to(UserService.class).in(Scopes.SINGLETON);
        bind(IStudentRepository.class).to(InMemoryStudentRepository.class).in(Scopes.SINGLETON);
    }
}

// in HelloApplication
@Override
public void init() { injector = Guice.createInjector(new AppContext()); }

// in start
fxmlLoader.setControllerFactory(injector::getInstance);
```

## Example: MainController (double click to edit)

```java
@Inject
public MainController(IStudentRepository studentRepository) {
    _studentRepository = studentRepository;
}

@FXML
public void initialize() {
    studentListView.setItems(_studentRepository.getAllStudents());
    studentListView.setOnMouseClicked(event -> {
        if (event.getClickCount() == 2) {
            Student selected = studentListView.getSelectionModel().getSelectedItem();
            if (selected != null) openAddEditWindow(selected);
        }
    });
}

private void openAddEditWindow(Student student) throws IOException {
    FXMLLoader loader = new FXMLLoader(HelloApplication.class.getResource("student-editor.fxml"));
    loader.setController(new StudentEditController(student));
    Stage stage = new Stage();
    stage.setScene(new Scene(loader.load()));
    stage.showAndWait();
}
```

## Example: StudentEditController (bindBidirectional)

```java
@FXML
public void initialize() {
    nameField.textProperty().bindBidirectional(student.nameProperty());
    gradeSpinner.setValueFactory(
        new SpinnerValueFactory.DoubleSpinnerValueFactory(0, 100, student.getGrade(), 1));
    gradeSpinner.valueProperty().addListener((obs, oldV, newV) -> student.setGrade(newV));
    enrolledCheckBox.selectedProperty().bindBidirectional(student.enrolledProperty());
}

@FXML
void onClose(ActionEvent event) {
    ((Stage) nameField.getScene().getWindow()).close();
}
```
