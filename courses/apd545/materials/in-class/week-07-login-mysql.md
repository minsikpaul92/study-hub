Source: <APD545 Week 7 교수님 샘플 코드 WK_7_Login_MySql (Blackboard), 주요 파일 발췌. DB 비밀번호는 지움, import 문은 생략>
# Week 7 샘플 코드: WK_7_Login_MySql (JavaFX + JDBC + MySQL)

## Example: DatabaseAccess (JDBC)

```java
public class DatabaseAccess {
    private static final String DB_URL = "jdbc:mysql://localhost:3306/";
    private static final String DB_NAME = "javafxregistration?useSSL=false";
    private static final String DB_USER = "root";
    private static final String DB_PASSWORD = "<your password>";
    private static final String INSERT_QRY =
        " insert into registration(full_name, email_id, password) values (?, ?, ?)";
    private static final String SELECT_QRY =
        " select * from registration where email_id = ? AND password = ?";

    public void insertRecord(String fn, String email, String pw) {
        try (Connection connection = DriverManager.getConnection(DB_URL + DB_NAME, DB_USER, DB_PASSWORD);
             PreparedStatement ps = connection.prepareStatement(INSERT_QRY)) {
            ps.setString(1, fn);
            ps.setString(2, email);
            ps.setString(3, pw);
            ps.executeUpdate();
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    public boolean validation(String email, String pw) {
        try (Connection connection = DriverManager.getConnection(DB_URL + DB_NAME, DB_USER, DB_PASSWORD);
             PreparedStatement ps = connection.prepareStatement(SELECT_QRY)) {
            ps.setString(1, email);
            ps.setString(2, pw);
            ResultSet rs = ps.executeQuery();
            while (rs.next()) { return true; }
        } catch (Exception e) {
            e.printStackTrace();
        }
        return false;
    }
}
```

## Example: LoginController (open a second window)

```java
public class LoginController {
    @FXML private TextField emailIdTextFiled;
    @FXML private Button loginButton;
    @FXML private TextField passwordTextField;
    @FXML private Button registerButton;

    private DatabaseAccess db = new DatabaseAccess();

    @FXML
    void loginButtonEvent(ActionEvent event) {
        Window window = loginButton.getScene().getWindow();
        if (emailIdTextFiled.getText().isEmpty()) {
            Alert alert = new Alert(Alert.AlertType.ERROR);
            alert.setContentText("Please enter email");
            alert.initOwner(window);
            alert.showAndWait();
        }
        boolean flag = db.validation(emailIdTextFiled.getText(), passwordTextField.getText());
        if (flag) {
            Alert alert = new Alert(Alert.AlertType.ERROR);
            alert.setContentText("Login Successful");
            alert.initOwner(window);
            alert.showAndWait();
        } else {
            Alert alert = new Alert(Alert.AlertType.ERROR);
            alert.setContentText("Either username or password is incorrect");
            alert.initOwner(window);
            alert.showAndWait();
        }
    }

    @FXML
    void registerButtonEvent(ActionEvent event) throws IOException {
        FXMLLoader loader = new FXMLLoader(LoginSignupApplication.class.getResource("register.fxml"));
        Parent root = loader.load();
        Stage stage = new Stage();
        Scene scene = new Scene(root);
        stage.setScene(scene);
        stage.setTitle("Register Account");
        stage.show();
    }
}
```

## Example: RegistrationController

```java
public class RegistrationController {
    @FXML private TextField emailTextField;
    @FXML private TextField fullnameTextField;
    @FXML private PasswordField passwordField;
    @FXML private Button submitBtn;

    private DatabaseAccess db = new DatabaseAccess();

    @FXML
    void cancelButtonEvent(ActionEvent event) {
        Platform.exit();
    }

    @FXML
    void submitButtonEvent(ActionEvent event) {
        Window owner = submitBtn.getScene().getWindow();
        if (fullnameTextField.getText().trim().isEmpty()) {
            Alert alert = new Alert(Alert.AlertType.ERROR);
            alert.setContentText("Please enter user name");
            alert.initOwner(owner);
            alert.showAndWait();
        }
        db.insertRecord(emailTextField.getText(),
                        fullnameTextField.getText(),
                        passwordField.getText());
    }
}
```

## Example: module-info.java (requires java.sql)

```java
module ca.senecacollege.application.wk_7_login_mysql {
    requires javafx.controls;
    requires javafx.fxml;
    requires java.sql;

    opens ca.senecacollege.application.wk_7_login_mysql to javafx.fxml;
    exports ca.senecacollege.application.wk_7_login_mysql;
    exports ca.senecacollege.application.controllers;
    opens ca.senecacollege.application.controllers to javafx.fxml;
}
```
