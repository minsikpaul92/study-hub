# Quiz 5 모의퀴즈 정답과 해설 (Week 7~8)

> 먼저 문제 페이지에서 직접 풀고 오세요. 각 해설 끝의 📍는 노트에서 다시 볼 곳이에요.

## A. 객관식

| 번호 | 정답 | 한 줄 해설 |
| --- | --- | --- |
| A1 | **(b)** | 제어(객체 생성, 흐름)를 프레임워크/컨테이너로 넘김. "Don't call us, we'll call you." 📍 Week 7 · Inversion of Control (IoC) |
| A2 | **(c)** | IoC ≠ DI. DI는 IoC의 가장 흔한 기법. Service Locator도 IoC. 📍 Week 7 · What IoC is not? |
| A3 | **(b)** | 프레임워크가 적절한 때 내 코드를 부름 = program flow의 역전 (event/callback). 📍 Week 7 · IoC Techniques |
| A4 | **(b)** | 방향은 인터페이스 → 구현, `in(Scopes.SINGLETON)`. (a)는 방향이 반대. 📍 Week 7 · AppModule |
| A5 | **(c)** | `showAndWait()`는 닫힐 때까지 기다림. `show()`는 바로 다음 줄. 📍 Week 7 · HelloApplication |
| A6 | **(b)** | Domain logic: calculations, **validation**, 어떤 데이터 작업을 할지 결정. 📍 Week 8 · 3-Tier |
| A7 | **(c)** | 다대다만 join table 필요 (`dog_fk | owner_fk`). 📍 Week 8 · Join table |
| A8 | **(d)** | Type 4 = All Java, 직접 통신, 네이티브 코드 없음. 📍 Week 8 · JDBC Driver Types |
| A9 | **(b)** | `execute()`는 결과가 ResultSet일 때만 true. CREATE는 false (실패 아님). 📍 Week 8 · Create Statement Object and execute |
| A10 | **(c)** | 드라이버는 여전히 필요. 나머지 셋은 슬라이드의 장점. 📍 Week 8 · Benefits of using PreparedStatement |

## B. 짧은 서술 (모범 답안)

**B1.** FXMLLoader는 기본적으로 컨트롤러를 **인자 없는(no-arg) 생성자**로 만들어요. 이 컨트롤러는 `IPlayerRepository`를 받는 생성자만 있으니 만들 수 없어요(예외). Guice에게 컨트롤러 생성을 맡기면 `@Inject` 생성자에 의존성을 넣어서 만들어 줘요.

```java
loader.setControllerFactory(injector::getInstance);
```

채점 포인트: no-arg 생성자(1), Guice/injector가 생성하도록 위임(1), 정확한 코드 한 줄(1). 📍 Week 7 · Example from the class

**B2.** **Decoupling**(구체 구현에 의존하지 않음), **Flexibility**(구현 교체 쉬움), **Testability**(주입으로 테스트 쉬움), **Maintainability**(설정이 한곳, `new`가 흩어지지 않음). Flexibility 예: `AppModule`에서 `bind(IPlayerRepository.class).to(InMemoryPlayerRepository.class)`를 `.to(JdbcPlayerRepository.class)`로 한 줄만 바꾸면 컨트롤러 코드는 그대로 두고 메모리 저장에서 DB 저장으로 바뀐다. 📍 Week 7 · Why it matters?

**B3.** **Entity**: 고유한 정체성(identity)이 있어서 값이 같아도 서로 구분되는 객체. 예: 학번이 있는 `Student`, VIN이 있는 `Car`. **Value object**: 정체성 없이 값만으로 의미가 있고 혼자 존재하지 않으며 Entity를 설명, 보통 immutable. 예: `Address`, 색, `Money(10, "CAD")`. 📍 Week 8 · Entities, Value Objects

**B4.**

| 메서드 | 언제 | 반환 |
| --- | --- | --- |
| `executeQuery` | SELECT | `ResultSet` |
| `executeUpdate` | INSERT, UPDATE, DELETE, CREATE/DROP | `int` (영향받은 행 수) |
| `execute` | 아무 SQL, 결과가 여러 개이거나 종류를 모를 때 | `boolean` (ResultSet이면 true) |

📍 Week 8 · execute, executeQuery, executeUpdate

**B5.** PreparedStatement는 SQL 구조를 미리 컴파일하고, `?` 자리에 들어가는 값은 드라이버가 자동으로 **escape**해서 **데이터로만** 취급해요. 그래서 값이 SQL 명령으로 해석되지 않아요. 예: 비밀번호 칸에 `' OR '1'='1`을 넣으면 문자열 이어 붙이기 쿼리는 `WHERE password = '' OR '1'='1'`이 되어 항상 참이라 로그인되지만, PreparedStatement는 이 문자열 전체를 비밀번호 값으로 비교해서 실패해요. 📍 Week 8 · Benefits of using PreparedStatement

## C. 코드

**C1.** `Password` → `equals`는 대소문자를 구분하므로 `"Password".equals("password")`는 false → `Unknown password!`가 표시되고 `return`으로 끝나서 화면이 안 바뀌어요. ` password ` → `trim()`이 앞뒤 공백을 지워서 `"password"`와 같음 → `welcomeScene`으로 전환. 📍 Week 7 · One layout for each view

**C2.**

1. 이름이 비었을 때 Alert만 띄우고 **`return;`이 없어서** 그대로 `insertRecord`가 실행돼 빈 이름이 저장돼요.
2. `insertRecord(fullName, email, password)`인데 **이메일과 이름 순서가 바뀌어** 전달돼요. 둘 다 String이라 컴파일 에러가 안 나고 DB에 거꾸로 저장돼요. 고친 줄: `dao.insertRecord(nameField.getText(), emailField.getText(), passwordField.getText());`

📍 Week 7 · Example: RegistrationController, Week 8 · Step 7: Registration Controller

**C3.** `getConnection`, `prepareStatement`, `setString`, `setString`, `executeQuery`, `next`. 📍 Week 8 · JdbcDao.validate

**C4.**

```text
2
2 Mike 6
1 Jack 5
3 Kyle 3
```

해설: 넣은 직후 Jack 3, Mike 6, Kyle 1. `goals < 4`인 행은 Jack(3), Kyle(1) 두 개 → `executeUpdate()`는 영향받은 행 수 **2**. 각각 +2 → Jack 5, Kyle 3. goals 내림차순으로 Mike 6, Jack 5, Kyle 3. 열 번호(`getInt(1)`)와 열 이름(`getString("name")`)을 섞어 써도 돼요. 📍 Week 8 · Execute statement with Insert, Execute statement with ResultSet

**C5.** 모범 답안:

```java
public class AppModule extends AbstractModule {
    @Override
    protected void configure() {
        bind(IMenuRepository.class).to(InMemoryMenuRepository.class).in(Scopes.SINGLETON);
    }
}

public class MenuController {
    private final IMenuRepository repo;

    @Inject
    public MenuController(IMenuRepository repo) {
        this.repo = repo;
    }
}

// in start(Stage stage)
Injector injector = Guice.createInjector(new AppModule());
FXMLLoader loader = new FXMLLoader(getClass().getResource("menu-view.fxml"));
loader.setControllerFactory(injector::getInstance);
```

채점 포인트(5): `extends AbstractModule` + `configure()`(1), bind 방향과 singleton(1), `@Inject` 생성자(1), 생성자 타입이 **인터페이스**(1, 구체 클래스면 singleton 공유가 안 됨), `createInjector` + `setControllerFactory`(1). 📍 Week 7 · AppModule, PlayerOverviewController의 ⚠️ 설명
