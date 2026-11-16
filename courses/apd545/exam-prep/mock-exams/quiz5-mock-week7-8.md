# Quiz 5 모의퀴즈 (Week 7~8)

> 실제 Quiz 5: **2026년 11월 20일**, 범위 Week 7 (Multiple Views, IoC) + Week 8 (ORM, JDBC, JavaFX + JDBC).
> 형식은 Quiz 4 연습문제와 같은 틀로 만들었어요: **A. 객관식 10문항, B. 짧은 서술 5문항, C. 코드 읽기/쓰기 5문항**. 시간은 **40분**으로 잡고 노트 없이 풀어 보세요. 정답과 해설은 별도 페이지에 있어요.
> 실제 퀴즈의 문항 수와 배점은 다를 수 있어요. 이 모의퀴즈는 범위와 난이도 연습용이에요.

## A. Multiple Choice (1 mark each)

**A1.** Inversion of Control is best described as:

- (a) Each class creating its own dependencies with `new`
- (b) Handing control over object creation or program flow to a framework or container
- (c) Running methods in reverse order
- (d) Letting the database control the user interface

**A2.** Which statement is correct?

- (a) IoC and Dependency Injection are the same thing.
- (b) IoC is one kind of Dependency Injection.
- (c) DI is the most commonly used technique for achieving IoC.
- (d) Service Locator is not a form of IoC.

**A3.** In a JavaFX application, the framework calls your `start(Stage)` method and your button handlers. This is IoC of:

- (a) object creation (DI)
- (b) program flow (event-driven / callback)
- (c) data storage (repository)
- (d) none; it is not IoC

**A4.** Which Guice code binds the interface to the implementation and keeps one shared instance?

- (a) `bind(UserService.class).to(IUserService.class);`
- (b) `bind(IUserService.class).to(UserService.class).in(Scopes.SINGLETON);`
- (c) `inject(IUserService.class, new UserService());`
- (d) `@Singleton new UserService();`

**A5.** Which method shows a new window and does **not** return until that window is closed?

- (a) `stage.show()`
- (b) `stage.setScene(scene)`
- (c) `stage.showAndWait()`
- (d) `stage.initOwner(owner)`

**A6.** In the 3-tier architecture, validation of input coming from the UI belongs to:

- (a) Presentation  (b) Domain (business) logic  (c) Data source  (d) the JDBC driver

**A7.** Which relationship requires a join (linking) table in a relational database?

- (a) One-to-one  (b) One-to-many  (c) Many-to-many  (d) Inheritance with a single table

**A8.** Which JDBC driver type is pure Java and talks directly to the database?

- (a) Type 1  (b) Type 2  (c) Type 3  (d) Type 4

**A9.** `statement.execute("CREATE TABLE t (id INTEGER)")` returns:

- (a) `true`, because the table was created
- (b) `false`, because the result is not a ResultSet
- (c) `1`, the number of tables created
- (d) a `ResultSet` with zero rows

**A10.** Which is **NOT** a benefit of `PreparedStatement`?

- (a) Prevents SQL injection
- (b) Precompiled, faster for repeated queries
- (c) Removes the need for a JDBC driver
- (d) Parametric queries with `?` placeholders

## B. Short Answer (3 marks each)

**B1.** Explain why `FXMLLoader` cannot create a controller whose only constructor is `@Inject public MainController(IPlayerRepository repo)`, and write the one line that fixes it when using Guice.

**B2.** List the four benefits of IoC from the lecture and give a one-line example of **Flexibility** using a repository.

**B3.** Explain the difference between an **entity** and a **value object** with one example of each.

**B4.** Compare `execute`, `executeQuery`, and `executeUpdate`: when to use each and what each returns.

**B5.** Explain how a `PreparedStatement` prevents SQL injection. Include an example of a malicious input.

## C. Code Reading / Writing

**C1. (2 marks)** What happens when the user types `Password` (capital P) and clicks the button? What if they type ` password ` (spaces around)?

```java
loginButton.setOnAction(e -> {
    if (!passwordField.getText().trim().equals("password")) {
        errorLabel.setText("Unknown password!");
        return;
    }
    stage.setScene(welcomeScene);
});
```

**C2. (3 marks)** Find **two** bugs in this registration handler.

```java
@FXML
void submit(ActionEvent event) {
    if (nameField.getText().isEmpty()) {
        showAlert(Alert.AlertType.ERROR, "Please enter your name");
    }
    // insertRecord(String fullName, String email, String password)
    dao.insertRecord(emailField.getText(), nameField.getText(), passwordField.getText());
}
```

**C3. (4 marks)** Fill in the blanks so the method returns `true` only if a user with that email and password exists.

```java
public boolean validate(String email, String pw) {
    String sql = "SELECT * FROM registration WHERE email_id = ? AND password = ?";
    try (Connection c = DriverManager.______(URL, USER, PASS);
         PreparedStatement ps = c.______(sql)) {
        ps.______(1, email);
        ps.______(2, pw);
        ResultSet rs = ps.______();
        if (rs.______()) return true;
    } catch (SQLException e) {
        e.printStackTrace();
    }
    return false;
}
```

**C4. (3 marks)** What is printed? The `players` table is empty and `id` is AUTOINCREMENT starting at 1.

```java
PreparedStatement ins = conn.prepareStatement("INSERT INTO players (name, goals) VALUES (?, ?)");
ins.setString(1, "Jack"); ins.setInt(2, 3); ins.executeUpdate();
ins.setString(1, "Mike"); ins.setInt(2, 6); ins.executeUpdate();
ins.setString(1, "Kyle"); ins.setInt(2, 1); ins.executeUpdate();

PreparedStatement up = conn.prepareStatement("UPDATE players SET goals = goals + 2 WHERE goals < ?");
up.setInt(1, 4);
System.out.println(up.executeUpdate());

ResultSet rs = conn.prepareStatement("SELECT id, name, goals FROM players ORDER BY goals DESC").executeQuery();
while (rs.next()) System.out.println(rs.getInt(1) + " " + rs.getString("name") + " " + rs.getInt(3));
```

**C5. (5 marks)** Write a Guice `AppModule` that binds `IMenuRepository` to `InMemoryMenuRepository` as a singleton, a controller `MenuController` that receives the repository by constructor injection, and the two lines in `start()` that create the injector and make an `FXMLLoader` use Guice for controllers.
