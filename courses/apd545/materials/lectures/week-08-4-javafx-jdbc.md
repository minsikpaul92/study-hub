Source: <APD545 Week 8 · Segment 4 "JavaFX and JDBC" 강의 슬라이드 (Seneca) 핵심 문장 발췌. 코드는 슬라이드 예제를 정리>
# Week 8 · Segment 4. JavaFX and JDBC

## Outcomes

> JDBC with FX example using MySQL Connector. Creating layouts of JavaFX, adding UI controls, validating controls, connecting with MySQL via JDBC API.

## Steps 1 to 3: Project, Libraries, Database

> - Add JavaFX libraries required for the project. Download the MySQL JDBC Connector and add it to the project as well.
> - Make sure you have MySQL installed on your machine. First create the database, next create a table.

```sql
create database registrationloginFX;

CREATE TABLE registration (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    full_name varchar(250) NOT NULL,
    email_id varchar(250) NOT NULL,
    password varchar(250)
);
```

## Step 5: Main.java

> As before, for creating a JavaFX application, we'll need to extend our Main class from `javafx.application.Application` and override its `start()` method.

```java
public class Main extends Application {
    @Override
    public void start(Stage primaryStage) {
        try {
            BorderPane root = (BorderPane) FXMLLoader.load(
                getClass().getResource("/com/senecacollege/views/Register.fxml"));
            primaryStage.setTitle("User Registration");
            Scene scene = new Scene(root, 800, 500);
            primaryStage.setScene(scene);
            primaryStage.show();
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}
```

## Step 7: Registration Controller

```java
@FXML
void submitButton(ActionEvent event) throws SQLException {
    Window owner = submitButton.getScene().getWindow();
    if (fullNameText.getText().isEmpty()) {
        showAlert(Alert.AlertType.ERROR, owner, "Form Error!", "Please enter your name");
        return;
    }
    if (emailidText.getText().isEmpty()) {
        showAlert(Alert.AlertType.ERROR, owner, "Form Error!", "Please enter your email id");
        return;
    }
    if (passwordField.getText().isEmpty()) {
        showAlert(Alert.AlertType.ERROR, owner, "Form Error!", "Please enter a password");
        return;
    }
    String fullName = fullNameText.getText();
    String emailId = emailidText.getText();
    String password = passwordField.getText();

    JdbcDao jdbcDao = new JdbcDao();
    jdbcDao.insertRecord(fullName, emailId, password);
    showAlert(Alert.AlertType.CONFIRMATION, owner, "Registration Successful!",
              "Welcome " + fullNameText.getText());
}

private static void showAlert(Alert.AlertType alertType, Window owner, String title, String message) {
    Alert alert = new Alert(alertType);
    alert.setTitle(title);
    alert.setHeaderText(null);
    alert.setContentText(message);
    alert.initOwner(owner);
    alert.show();
}
```

> JdbcDao class is being used for validating the fields and to store and to retrieve or to manipulate data from the database.

## Step 8: JdbcDao for database operations

> - Steps: Establishing a connection, Create a statement, Execute the query. Using try-with-resources Statements to Automatically Close JDBC Resources.
> - From JDBC 4.0, we don't need to include `Class.forName()` in our code, to load JDBC driver. When the method `getConnection` is called, the `DriverManager` will automatically load the suitable driver.

```java
public class JdbcDao {
    // Replace below database url, username and password with your actual database credentials
    private static final String DATABASE_URL = "jdbc:mysql://localhost:3306/registrationFX?useSSL=false";
    private static final String DATABASE_USERNAME = "root";
    private static final String DATABASE_PASSWORD = "root";
    private static final String INSERT_QUERY =
        "INSERT INTO registration (full_name, email_id, password) VALUES (?, ?, ?)";

    public void insertRecord(String fullName, String emailId, String password) throws SQLException {
        // Step 1: Establishing a Connection and
        // try-with-resource statement will auto close the connection.
        try (Connection connection = DriverManager.getConnection(DATABASE_URL, DATABASE_USERNAME, DATABASE_PASSWORD);
             // Step 2: Create a statement using connection object
             PreparedStatement preparedStatement = connection.prepareStatement(INSERT_QUERY)) {
            preparedStatement.setString(1, fullName);
            preparedStatement.setString(2, emailId);
            preparedStatement.setString(3, password);
            // Step 3: Execute the query or update query
            preparedStatement.executeUpdate();
        } catch (SQLException e) {
            printSQLException(e);
        }
    }
}
```

## Login view and LoginController

```java
// RegisterController: open the login window
@FXML
void loginClickEvent(ActionEvent event) {
    try {
        FXMLLoader loader = new FXMLLoader(getClass().getResource("/com/senecacollege/views/Login.fxml"));
        Parent loginRoot = loader.load();
        Stage st = new Stage();
        st.setTitle("User Login");
        Scene scene = new Scene(loginRoot, 800, 500);
        st.setScene(scene);
        st.show();
    } catch (Exception e) {
        e.printStackTrace();
    }
}

// LoginController
@FXML
void login(ActionEvent event) throws SQLException {
    Window owner = submitButton.getScene().getWindow();
    if (emailIdField.getText().isEmpty()) {
        showAlert(Alert.AlertType.ERROR, owner, "Form Error!", "Please enter your email id");
        return;
    }
    if (passwordField.getText().isEmpty()) {
        showAlert(Alert.AlertType.ERROR, owner, "Form Error!", "Please enter a password");
        return;
    }
    String emailId = emailIdField.getText();
    String password = passwordField.getText();
    JdbcDao jdbcDao = new JdbcDao();
    boolean flag = jdbcDao.validate(emailId, password);
    if (!flag) {
        infoBox("Please enter correct Email and Password", null, "Failed");
    } else {
        infoBox("Login Successful!", null, "Failed");
    }
}
```

## JdbcDao.validate

```java
private static final String SELECT_QUERY = "SELECT * FROM registration WHERE email_id = ? and password = ?";

public boolean validate(String emailId, String password) throws SQLException {
    try (Connection connection = DriverManager.getConnection(DATABASE_URL, DATABASE_USERNAME, DATABASE_PASSWORD);
         PreparedStatement preparedStatement = connection.prepareStatement(SELECT_QUERY)) {
        preparedStatement.setString(1, emailId);
        preparedStatement.setString(2, password);
        ResultSet resultSet = preparedStatement.executeQuery();
        if (resultSet.next()) {
            return true;
        }
    } catch (SQLException e) {
        printSQLException(e);
    }
    return false;
}
```
