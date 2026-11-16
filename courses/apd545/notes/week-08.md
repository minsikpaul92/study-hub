# Week 8. ORM과 JDBC, JavaFX + JDBC

> **읽는 법**: 📑 표시는 교수님 슬라이드의 핵심 문장(영어 원문 그대로 짧게 발췌)이고, 바로 아래 **🇰🇷 한글 해설**이 이어져요. ⌨️ 표시가 있는 코드는 IntelliJ에서 직접 쳐 보세요. JDBC 연습은 설치가 필요 없는 **SQLite**로 하는 게 편해요 (맨 아래 "직접 해 보기" 참고).
>
> **Quiz 5 (11월 20일) 범위: Week 7 + Week 8.** Segment 1~2(ORM 이론)는 정의와 용어 객관식, Segment 3~4(JDBC)는 코드 읽기와 빈칸 채우기로 나오기 좋아요.

## 0. 이번 주 한눈에 보기

| 개념 | 한 줄 정리 | 퀴즈에 나오는 모양 |
| --- | --- | --- |
| Persistent data | 프로그램을 껐다 켜도 남아 있어야 하는 데이터 | "why the need" |
| 3-Tier | Presentation, Domain(Business) Logic, Data Source | 각 층의 역할 고르기 |
| Object-relational mismatch | 객체(클래스, 상속, 참조) ↔ 테이블(행, 열, 외래키)이 잘 안 맞음 | 차이 5가지 |
| ORM | 객체와 관계형 DB 사이를 **자동으로 변환**하는 기법 | 정의, 장점(CRUD 자동, 비즈니스 로직 집중) |
| Join table | 다대다 관계를 표현하는 세 번째 테이블 `dog_fk | owner_fk` | 표 읽기 |
| ORM 패턴 | Domain Model, Table Module, Active Record, Data Mapper | 이름과 설명 짝짓기 |
| 상속 매핑 | 계층당 테이블 1개 / 구체 클래스당 1개(가장 흔함) / 클래스당 1개 | 가장 흔한 것 |
| Lazy loading | 필요할 때만 불러오기 | 비유(작은 부엌) |
| JDBC | Java ↔ 관계형 DB 표준 API. `java.sql`, `javax.sql` | 정의, 패키지 이름 |
| JDBC 순서 | Driver → Connection → Statement → ResultSet (→ close) | 순서 맞추기 |
| Driver Type | 1 JDBC-ODBC bridge, 2 Java + Native, 3 Middleware, **4 All Java** | 번호와 설명 |
| execute 3형제 | `executeQuery` → ResultSet, `executeUpdate` → int, `execute` → boolean | 반환 타입 |
| PreparedStatement | `?` 자리표시자 + `setXXX(번호, 값)`, 미리 컴파일, **SQL Injection 방지** | 장점 고르기 |

**함정 모음**

- `PreparedStatement`의 `?` 번호와 `ResultSet.getXXX` 열 번호는 **1부터** 시작한다 (0 아님).
- `executeQuery`는 SELECT, `executeUpdate`는 INSERT/UPDATE/DELETE/CREATE. 반대로 쓰면 SQLException.
- `execute()`가 `false`를 반환하면 "결과가 ResultSet이 아니다(업데이트 수다)"라는 뜻이지 **실패가 아니다**. 그래서 CREATE TABLE이 성공해도 `false`.
- `rs.next()`를 부르기 **전에는** 첫 행을 읽을 수 없다. 커서는 첫 행 **앞**에서 시작한다.
- JDBC 4.0부터 `Class.forName(...)`으로 드라이버를 직접 로드할 필요가 없다.
- try-with-resources를 쓰면 `close()`를 따로 안 써도 된다.
- 가장 흔한 상속 매핑은 **table per concrete class**.
- Type 4 드라이버는 **순수 Java**, 네이티브 코드 불필요. Type 2는 네이티브라서 빠를 수 있음.


**⌨️ IntelliJ에서 직접 쳐 볼 것 (이 순서대로)**

어디 칸을 누르면 그 코드로 바로 가요. 코드 위에도 ⌨️ 표시가 있어요.

| # | 어디 | 무엇을 |
| --- | --- | --- |
| 1 | [Basic JDBC Connection](#practice-1) | SQLite 드라이버를 pom.xml에 넣고 StatementExample로 연결 객체 출력하기 |
| 2 | [Create Statement Object and execute](#practice-2) | Statement로 users 테이블을 만들고 "Table is created"가 나오는지 확인 |
| 3 | [Execute statement with ResultSet](#practice-3) | 두 명 INSERT 후 SELECT로 출력하기 |
| 4 | [Insert and Select using PreparedStatement](#practice-4) | books 테이블에 PreparedStatement로 두 권 넣고 이름으로 검색하기 |
| 5 | [Step 8: JdbcDao for database operations](#practice-5) | JdbcDao.insertRecord를 SQLite URL로 바꿔서 쳐 보기 |
| 6 | [JdbcDao.validate](#practice-6) | validate를 쳐서 맞는/틀린 비밀번호로 true/false 확인 |

나머지 👀 표시는 읽고 이해만 하면 돼요. 같은 개념을 위 예제에서 이미 타이핑해요.



## 목차

- 1. 📑 강의 슬라이드: Week 8 · Segment 1. Introduction to ORM
- 2. 📑 강의 슬라이드: Week 8 · Segment 2. ORM and Design Patterns
- 3. 📑 강의 슬라이드: Week 8 · Segment 3. Introduction to JDBC
- 4. 📑 강의 슬라이드: Week 8 · Segment 4. JavaFX and JDBC
- ⌨️ 직접 해 보기: SQLite로 JDBC 한 파일 연습
- 🧩 이번 주 토이 프로젝트: CafeOrder Week 8
- ✅ Quiz 5 대비 체크리스트 (Week 8)
- ✍️ 손으로 써 보기


---

## 1. 📑 강의 슬라이드: Week 8 · Segment 1. Introduction to ORM

<div class="sum" data-kind="read">

**🧭 먼저 한국어로** · 👀 읽고 이해하기 (타이핑 안 해도 돼요)

"왜 DB가 어렵고, ORM이 무엇을 해결하나"를 다루는 이론 챕터예요. 코드는 없고 **용어와 정의**가 퀴즈에 나와요. 객체 세계(클래스, 상속, 참조)와 테이블 세계(행, 열, 외래키)가 서로 안 맞는 문제가 핵심이에요.

**이 챕터 구성**

- 👀 **Outcomes**: ORM이 무엇인지, 장점과 단점, ORM 패턴, persistence layer(데이터 저장 계층)를 잘 만드는 방법.
- 👀 **Why the need?**: 소프트웨어 개발에서 가장 큰 도전 중 하나가 데이터베이스라는 말로 시작해요.
- 👀 **Different types of systems**: B2C 온라인 쇼핑몰: 사용자 수가 엄청 많음 → 대량 접속 처리가 어려움.
- 👀 **What are patterns?**: 패턴 = "계속 반복되는 문제 + 그 해결의 핵심".
- 👀 **The Three Principal Layers (3-Tier Architecture)**: Week 6의 Controller → Service → Repository 흐름과 정확히 겹쳐요.
- 👀 **Trouble with Objects**: Object-relational impedance mismatch(객체와 관계형의 불일치)라고 불러요.
- 👀 **Example: Dog and Owner**: UML의 `Dog`(name, spayed)와 `Owner`(name)를 테이블로 바꿔 봐요.
- 👀 **Example: Dog and Owner › Relationship between Dog and Owner**: 한 주인은 개 한 마리(has_one), 한 개는 주인이 여러 명일 수 있음(has_many).
- 👀 **Example: Dog and Owner › Join table**: 세 번째 테이블(join table)이 다대다 관계를 저장해요.
- 👀 **What is ORM then?**: ORM(Object-Relational Mapping) 정의: 서로 호환되지 않는 타입 시스템(객체 ↔ 관계형 테이블) 사이에서 데이터를 변환하는 프로그래밍 기법.
- 👀 **Relational Models vs OO Models**: 차이 5가지. 객관식 보기로 그대로 나와요.
- 👀 **Benefits of ORM**: 밑의 데이터 구조 걱정 없이 객체 모델로 작업.
- 👀 **Selecting a suitable ORM**: Object-to-database mapping: 가장 중요한 기준.

</div>

> 원문 출처: APD545 Week 8 · Segment 1 "ORM's" 강의 슬라이드 (Mahboob Ali, Seneca) 핵심 문장 발췌

### 📑 Outcomes

> - What are ORM's? · Benefits of ORM's. · Disadvantages of ORM's. · ORM Patterns · Best practices for building persistence layers

**🇰🇷 한글 해설**

ORM이 **무엇인지**, **장점**과 **단점**, ORM **패턴**, persistence layer(데이터 저장 계층)를 잘 만드는 방법. 단점은 슬라이드에 따로 길게 없지만 일반적으로 "자동 생성 SQL이 느릴 수 있다, 배우는 데 시간이 든다, 복잡한 쿼리는 결국 SQL을 써야 한다"를 기억해 두면 서술형에 쓸 수 있어요.

### 📑 Why the need?

> - One of the Biggest challenge comes from Database.
> - Enterprise level of application usually involve persistent data.
> - The data is persistent because it needs to be around between multiple runs of the program.
> - Usually, many people access data concurrently.

**🇰🇷 한글 해설**

소프트웨어 개발에서 **가장 큰 도전 중 하나가 데이터베이스**라는 말로 시작해요.

- **Persistent data**: 프로그램을 여러 번 실행해도 **계속 남아 있어야** 하는 데이터. 지금까지 우리 앱(ObservableList)은 끄면 데이터가 다 사라졌죠? 그걸 해결하려고 DB를 써요.
- 데이터가 많고(수천만 행), 여러 사람이 **동시에** 접근하고, 그걸 다루는 화면도 많아요.

### 📑 Different types of systems

> - A B2C (business to customer) online retailer: we need to be able to handle a very high volume of users.
> - A system that automates the processing of leasing agreements: many fewer users, more complicated business logic.
> - A simple expense-tracking system for a small company: you have to build it very quickly and bear in mind that it may grow.

**🇰🇷 한글 해설**

시스템마다 어려운 부분이 달라요.

- **B2C 온라인 쇼핑몰**: 사용자 수가 엄청 많음 → **대량 접속** 처리가 어려움.
- **리스 계약 처리 시스템**: 사용자는 적지만 **비즈니스 로직**(월 청구, 조기 반납, 연체)이 복잡.
- **소규모 회사 경비 관리**: 단순하지만 **빨리** 만들어야 하고 나중에 커질 수 있음.

결론: 그래서 상황에 맞는 **패턴**이 필요하다.

### 📑 What are patterns?

> Each pattern describes a problem which occurs over and over again in our environment, and then describes the core of the solution to that problem, in such a way that you can use this solution a million times over, without ever doing it the same way twice.

**🇰🇷 한글 해설**

패턴 = "계속 반복되는 문제 + 그 해결의 핵심". 같은 해결책을 백만 번 써도 **매번 똑같이 쓰지는 않는다**는 게 포인트예요(틀이지 복붙 코드가 아님). 패턴은 실제로 잘 돌아가는 것을 **관찰해서** 찾아낸 것이에요. Week 1 MVC 슬라이드의 디자인 패턴 정의와 같은 이야기예요.

### 📑 The Three Principal Layers (3-Tier Architecture)

> - **Presentation**: Presentation logic is about how to handle the interaction between the user and the software.
> - **Data Source**: Data source logic is about communicating with other systems that carry out tasks on behalf of the application.
> - **Domain Logic**: also referred to as business logic. It involves calculations based on inputs and stored data, validation of any data that comes in from the presentation and figuring out exactly what data source logic to dispatch.

**🇰🇷 한글 해설**

세 층을 짝지어 외우세요.

| 층 | 하는 일 | 우리 앱에서 |
| --- | --- | --- |
| **Presentation** | 사용자와 소프트웨어 사이 상호작용 (콘솔, GUI, 웹) | FXML, Controller |
| **Domain Logic** (= Business Logic) | 계산, **검증**, 어떤 데이터 작업을 할지 결정 | Service |
| **Data Source** | DB나 다른 시스템과 통신 | Repository, JdbcDao |

Week 6의 Controller → Service → Repository 흐름과 정확히 겹쳐요. 퀴즈에 "입력값 검증은 어느 층?"이 나오면 **Domain Logic**.

### 📑 Trouble with Objects

> - From an OO standpoint, the problem with these persistence mechanisms is that their core abstractions are not objects.
> - They are tables with rows and columns (RDBMS) or (some variation on) key-value pairs (NoSQL).
> - The OO world has classes, sub-classes, inheritance, associations, objects, attributes, methods, polymorphism. These concepts do not easily map into the abstractions of persistence mechanisms.

**🇰🇷 한글 해설**

**Object-relational impedance mismatch**(객체와 관계형의 불일치)라고 불러요.

- DB 쪽: **테이블(행과 열)** 또는 NoSQL의 **key-value**. 객체가 아님.
- 객체 쪽: 클래스, 하위 클래스, **상속**, 연관, 메서드, **다형성**.

이 개념들이 테이블로 **쉽게 옮겨지지 않아요**. 예를 들어 테이블에는 "상속"이라는 개념이 없어요. 객체를 직렬화(Week 9)해서 저장하는 것도 객체끼리 얽힌 그래프를 풀어서 다시 조립해야 해서 쉽지 않다고 해요.

### 📑 Example: Dog and Owner

> - You will at least have a table called `dogs` to store Dog instances and a table called `owners` to store Owner instances.
> - Convention of many object-relational mapping systems: class names are singular; table names are the associated plural form: Person ⇒ People; Cat ⇒ Cats.
> - For each table you would have columns that correspond to each attribute (plus an implicit id column); each row would correspond to an instance of the class: `1 | Fido | true`

**🇰🇷 한글 해설**

UML의 `Dog`(name, spayed)와 `Owner`(name)를 테이블로 바꿔 봐요.

- 클래스 하나당 테이블 하나: `dogs`, `owners`.
- **관례**: 클래스 이름은 **단수**(Dog), 테이블 이름은 **복수**(dogs). Person ⇒ People.
- 속성 하나당 **열(column)** 하나, 그리고 숨은 **id 열**.
- 객체 하나 = **행(row)** 하나. 중성화된 Fido: `1 | Fido | true`.

#### 📑 Relationship between Dog and Owner

> - Owner participates in a "has_one" relationship with Dog. Dog participates in a "has_many" relationship with Owner.
> - The short answer is **foreign key relationships and join tables**.
> - You might see code like: `List<Owner> owners = dog.getOwners();` Behind the scenes, the method will hide the database calls required.

**🇰🇷 한글 해설**

관계는 이렇게 표현해요.

- 한 주인은 개 한 마리(has_one), 한 개는 주인이 여러 명일 수 있음(has_many). 두 주인이 같은 개를 키울 수 있어요.
- DB에서는 **외래키(foreign key)**와 **join table**로 표현.
- ORM을 쓰면 `List<Owner> owners = dog.getOwners();` 한 줄로 끝나요. 뒤에서 SQL을 대신 실행해 주니까요. 이게 ORM의 매력이에요.

#### 📑 Join table

> - dogs: `1 | Fido | true`, `2 | Spot | false`; owners: `1 | Ken`, `2 | Max`
> - A third table is then used to maintain mappings between them: `1 | 1 ; 1 | 2 ; 2 | 2`
> - This says that Fido is owned by Ken and Max and Spot is owned by Max.
> - That third table is known as a join table and has the structure `dog_fk | owner_fk`.

**🇰🇷 한글 해설**

세 번째 테이블(**join table**)이 다대다 관계를 저장해요.

| dogs | | owners | | join (`dog_fk | owner_fk`) |
| --- | --- | --- | --- | --- |
| 1 Fido | | 1 Ken | | 1 \| 1 → Fido의 주인 Ken |
| 2 Spot | | 2 Max | | 1 \| 2 → Fido의 주인 Max |
| | | | | 2 \| 2 → Spot의 주인 Max |

`dog.getOwners()`의 실제 동작: (1) 이 개의 id를 구하고, (2) join table에서 `dog_fk == id`인 행을 모두 찾고, (3) 각 행의 `owner_fk`로 owners 테이블에서 이름을 찾아요. SQL로 쓰면 `SELECT o.name FROM owners o JOIN dog_owner j ON o.id = j.owner_fk WHERE j.dog_fk = 1`.

슬라이드의 "Complication"(Canine, Person 상위 클래스 추가)은 **상속이 끼면 테이블로 옮기기가 더 어려워진다**는 이야기예요. 해결 방법은 Segment 2의 상속 매핑 세 가지.

### 📑 What is ORM then?

> - Object-relational mapping is a programming technique for converting data between incompatible type systems by creating objects using OO programming languages, essentially wrapping tables or stored procedures in classes.
> - ORM is an automated way of connecting an object model, sometimes referred to as a domain model, to a relational database by using metadata as the descriptor of the object and data. This creates, in effect, a "virtual object database".
> - This act of mapping is an efficient way to overcome the mismatch that exists between object-oriented development languages and relational databases.

**🇰🇷 한글 해설**

**ORM(Object-Relational Mapping) 정의**: 서로 호환되지 않는 타입 시스템(객체 ↔ 관계형 테이블) 사이에서 데이터를 **변환하는** 프로그래밍 기법. 테이블을 클래스로 감싸서 메서드와 속성으로 DB를 다뤄요.

- **metadata**(설정 정보)로 객체와 테이블의 대응을 설명.
- 결과적으로 "**virtual object database**(가상 객체 데이터베이스)"가 생긴 효과.
- 목적: 객체지향 언어와 관계형 DB 사이의 **mismatch를 극복**.

대표 도구: Java의 Hibernate/JPA, .NET의 Entity Framework(EF), LINQ to SQL. 우리 수업은 ORM 도구 대신 **JDBC로 직접** 해 보면서 ORM이 뒤에서 무엇을 대신해 주는지 이해하는 흐름이에요.

### 📑 Relational Models vs OO Models

> - Types (ex. `char(n)` versus string)
> - Identity (keys versus address or equality)
> - Relations (foreign keys versus references)
> - Many to many relations require linking table in SQL
> - Inheritance and polymorphism

**🇰🇷 한글 해설**

차이 5가지. 객관식 보기로 그대로 나와요.

| | 관계형 (DB) | 객체지향 (Java) |
| --- | --- | --- |
| **Types** | `char(n)`, `varchar` | `String` |
| **Identity** | 기본키(key) | 메모리 주소 또는 `equals()` |
| **Relations** | 외래키(foreign key) | 참조(reference) |
| **Many-to-many** | **linking(join) table** 필요 | `List<Owner>` 필드면 끝 |
| **Inheritance, polymorphism** | 없음 | 있음 |

### 📑 Benefits of ORM

> - Automates the Object-to-table and Table-to-object conversions.
> - Work in the OO model without having to worry about the underlying data structure.
> - Typically provide support for the full set of CRUD (create, read, update, delete) operations.
> - Save time and money (time to market). Focus on the business logic rather than database/persistence logic.

**🇰🇷 한글 해설**

장점:

- 객체 ↔ 테이블 변환을 **자동화**.
- 밑의 데이터 구조 걱정 없이 **객체 모델로** 작업.
- 객체를 쉽게 저장하고 불러옴. **CRUD**(Create, Read, Update, Delete) 전체 지원.
- 시간과 돈 절약(time to market).
- DB 코드가 아니라 **비즈니스 로직에 집중**.

CRUD 약자는 꼭 외우세요. JDBC로는 INSERT, SELECT, UPDATE, DELETE에 해당해요.

### 📑 Selecting a suitable ORM

> - **Object-to-database mapping**: The single most important aspect of an ORM tool.
> - **Object caching**: to improve performance.
> - **GUI mapping**: Can survive without it but it will be bonus.
> - **Dynamic Querying**
> - **Lazy loading**: Improves the performance by optimizing the memory utilization of database server.
> - **Nonintrusive persistence**: no more class, interface or inheritance based specific relations.

**🇰🇷 한글 해설**

ORM 도구를 고르는 기준이에요.

- **Object-to-database mapping**: **가장 중요한** 기준. 퀴즈에 "single most important aspect"로 나올 수 있어요.
- **Object caching**: 성능 향상.
- **GUI mapping**: 있으면 보너스, 없어도 됨.
- **Dynamic querying**: 사용자 입력에 따른 쿼리.
- **Lazy loading**: 필요할 때 불러와 메모리 절약.
- **Nonintrusive persistence**: 내 클래스가 ORM 전용 부모 클래스나 인터페이스를 상속하지 않아도 됨. (POJO 그대로 저장 가능)


---

## 2. 📑 강의 슬라이드: Week 8 · Segment 2. ORM and Design Patterns

<div class="sum" data-kind="read">

**🧭 먼저 한국어로** · 👀 읽고 이해하기 (타이핑 안 해도 돼요)

ORM을 설계할 때 쓰는 **용어 사전** 같은 챕터예요. DDD, UML 다이어그램 종류, Entity와 Value Object, ORM 패턴 네 가지, 상속 매핑 세 가지, Lazy loading. 짝짓기 객관식 대비용으로 표로 정리했어요.

**이 챕터 구성**

- 👀 **Domain-Driven Design (DDD)**: DDD: 문제의 복잡함을 다루기 위한 개발 철학.
- 👀 **UML**: UML 다이어그램은 총 13개. 슬라이드에 나온 세 개:
- 👀 **Domain Model Structure**: 도메인 모델의 6가지 구성 요소: Entities, Value Objects, Services, Aggregates, Factories, Repositories.
- 👀 **Domain Model Structure › Entities**: Entity = 고유한 정체성(identity)이 있는 객체.
- 👀 **Domain Model Structure › Value Objects**: Value Object = 정체성 없이 값만으로 의미가 있는 객체.
- 👀 **Domain Model Structure › Aggregate**: Entity와 Value Object를 논리적으로 묶은 덩어리.
- 👀 **Object-Relational Patterns**: Active Record와 Data Mapper의 차이: Active Record는 `player.save()`처럼 객체가 스스로 저장, Data Mapper는 `mapper.save(player)`처럼 별도 객체가 저장.
- 👀 **Inheritance Mapping**: 상속을 테이블로 바꾸는 세 가지 방법. 예: `Canine` ← `Dog`, `Wolf`.
- 👀 **Relationships**: 관계 세 종류: One-to-One(사람-여권), One-to-Many(팀-선수), Many-to-Many(개-주인, 학생-수업).
- 👀 **Lazy Loading**: 필요한 것만 필요할 때 불러와서 메모리를 아끼는 방법이에요.

</div>

> 원문 출처: APD545 Week 8 · Segment 2 "ORM's and Design Patterns" 강의 슬라이드 (Mahboob Ali, Seneca) 핵심 문장 발췌

### 📑 Domain-Driven Design (DDD)

> - DDD is one of the focused software development philosophies that overcome the complexities of the problem.
> - **Domain**: is the knowledge, influence or activity around which we work to solve the problem on hand.
> - **Domain Model**: an object model of the domain that incorporates both behavior and data.

**🇰🇷 한글 해설**

- **DDD**: 문제의 복잡함을 다루기 위한 개발 철학. "도메인을 모델로 만들어서 문제를 푼다".
- **Domain**: 우리가 문제를 푸는 **지식과 활동 영역**. 예: 대출 신청 시스템이면 은행 대출 업무 전체.
- **Domain Model**: 그 도메인의 객체 모델. **행동(behavior)과 데이터(data)를 둘 다** 가진다. (데이터만 있는 게 아님)

### 📑 UML

> - The most common language used for modeling. There is total 13 diagrams in UML.
> - **Class Diagram**: Displays static model with all the attributes and relationships between classes and interfaces. Can also include Inheritance, Composition, Associations, Aggregations.
> - **Object Diagram**: Is a simplified version of a class diagram. Depicts the role of an object plays when instantiated and its multiplicity.
> - **Sequence Diagram**: Represent stereotyped elements, such as screens, controllers, entities, and database items.

**🇰🇷 한글 해설**

UML 다이어그램은 총 **13개**. 슬라이드에 나온 세 개:

- **Class Diagram**: 클래스의 속성과 **관계**(상속, 합성 composition, 연관 association, 집합 aggregation)를 보여주는 **정적** 구조.
- **Object Diagram**: Class Diagram의 **단순화 버전**. 실제로 만들어진 객체의 역할과 개수(multiplicity).
- **Sequence Diagram**: 화면, 컨트롤러, 엔티티, DB가 **시간 순서대로** 주고받는 메시지.

### 📑 Domain Model Structure

> A domain model can be broken into these pieces: **Entities, Value Objects, Services, Aggregates, Factories, Repositories**

**🇰🇷 한글 해설**

도메인 모델의 6가지 구성 요소: **Entities, Value Objects, Services, Aggregates, Factories, Repositories**. Service와 Repository는 Week 6에서 이미 만들었고, Factory는 Week 12 디자인 패턴에서 다시 나와요.

#### 📑 Entities

> - Tech definition: In Database entity is a table.
> - Identity: which defines uniqueness not only in real world but also in software world.
> - Example: Car has a VIN. Your car object which has its identity becomes an entity.

**🇰🇷 한글 해설**

**Entity = 고유한 정체성(identity)이 있는 객체**. DB 용어로는 테이블 하나.

예: 자동차는 VIN(차대번호)이 있어서 색과 모델이 같은 차가 두 대 있어도 **서로 다른 차**예요. 정체성이 있으니 Entity. 우리 코드에서는 `id` 필드를 가진 `Player`, `Student`가 Entity예요.

#### 📑 Value Objects

> - They can't exist by themselves. Example: model, engine, color etc. can't exist on their own.
> - A value object is typically an immutable object with no identity, containing values used to describe entities.

**🇰🇷 한글 해설**

**Value Object = 정체성 없이 값만으로 의미가 있는 객체**. 혼자서는 존재하지 않고 Entity를 **설명**해요. 보통 **immutable**(불변).

예: 차의 색, 엔진, 모델. 주소(`street, city, postalCode`)나 금액(`Money(10, "CAD")`)도 대표적이에요. 값이 같으면 같은 것으로 봐요.

구분 질문: "값이 똑같은 두 개를 구분해야 하나?" 예 → Entity, 아니오 → Value Object.

#### 📑 Aggregate

> A logical grouping of entities and value objects into a collection, so that complex relationships that can lead to data inconsistencies in your application and database can be reduced.

**🇰🇷 한글 해설**

Entity와 Value Object를 **논리적으로 묶은 덩어리**. 묶어서 다루면 복잡한 관계 때문에 생기는 **데이터 불일치**를 줄일 수 있어요. 예: `Order`(주문)와 그 안의 `OrderLine`(주문 줄)들. 주문 줄만 따로 지우거나 바꾸지 않고 항상 Order를 통해서 바꿔요.

### 📑 Object-Relational Patterns

> - **Domain Model**: creates a web of interconnected objects, where each object represents some meaningful individual, whether as large as a corporation or as small as a single line on an order form.
> - **Table Module**: create a class per table.
> - **Active Record**: similar to the table module except that the table module is an architectural design principle, whereas an active record falls under the data access pattern category. The active record pattern also encapsulates database access functionality.
> - **Database Mapper**: map objects to a relational database, accomplished by using metadata (for the most part XML) to describe the attributes and relationships between the object model and the data model.

**🇰🇷 한글 해설**

ORM 패턴 네 가지 짝짓기:

| 패턴 | 한 줄 | 
| --- | --- |
| **Domain Model** | 서로 연결된 객체들의 그물. 각 객체는 회사만큼 크거나 주문서 한 줄만큼 작은 의미 있는 대상 |
| **Table Module** | **테이블 하나당 클래스 하나**. (설계 원칙) |
| **Active Record** | Table Module과 비슷하지만 **데이터 접근 패턴**. 객체 자신이 DB 접근 기능(`save()`, `delete()`)을 가짐 |
| **Database (Data) Mapper** | 객체와 DB 사이를 **metadata(주로 XML)**로 매핑. 객체는 DB를 모름. 매핑 엔진이 필요. EF, LINQ to SQL이 예 |

Active Record와 Data Mapper의 차이: Active Record는 `player.save()`처럼 **객체가 스스로 저장**, Data Mapper는 `mapper.save(player)`처럼 **별도 객체가 저장**. 우리의 Repository/JdbcDao 방식은 Data Mapper 쪽에 가까워요.

### 📑 Inheritance Mapping

> There are three key inheritance-mapping approaches:
> - **A single table per class hierarchy**: Mapping your entire class structure to a single table. Quick and easy approach.
> - **A table per concrete class**: The most common approach. Maps each non-abstract class to its own table.
> - **A table per class**: each class to its own table.

**🇰🇷 한글 해설**

상속을 테이블로 바꾸는 세 가지 방법. 예: `Canine` ← `Dog`, `Wolf`.

| 방법 | 테이블 | 장단점 |
| --- | --- | --- |
| **Single table per class hierarchy** | `canines` 하나에 모든 열 + 종류 열 | 빠르고 쉬움. 타입이 많아지면 빈 칸(null)이 많고 복잡 |
| **Table per concrete class** | `dogs`, `wolves` (abstract 제외) | **가장 흔한 방법** |
| **Table per class** | `canines`, `dogs`, `wolves` 모두 | 정규화 잘 됨, 조회할 때 JOIN 많음 |

### 📑 Relationships

> One-to-One · One-to-Many · Many-to-Many

**🇰🇷 한글 해설**

관계 세 종류: **One-to-One**(사람-여권), **One-to-Many**(팀-선수), **Many-to-Many**(개-주인, 학생-수업). 다대다만 **join table**이 필요해요. 일대다는 "다" 쪽 테이블에 외래키 열 하나면 돼요 (`players.team_id`).

### 📑 Lazy Loading

> A way to optimize memory utilization of database servers by prioritizing components that need to be loaded into memory when a program is started.
> Example: take out only the ingredients you need as you need them (small kitchen, many dishes).

**🇰🇷 한글 해설**

필요한 것만 **필요할 때** 불러와서 메모리를 아끼는 방법이에요.

비유: 부엌이 좁은데 요리를 여러 개 해야 할 때, 모든 재료를 한꺼번에 꺼내 놓는(eager loading) 대신 **지금 만드는 요리의 재료만** 꺼내기.

예: 팀 목록 화면에서는 팀 이름만 불러오고, 팀을 클릭했을 때 비로소 선수 목록을 DB에서 가져와요.


---

## 3. 📑 강의 슬라이드: Week 8 · Segment 3. Introduction to JDBC

<div class="sum" data-kind="type">

**🧭 먼저 한국어로** · ⌨️ IntelliJ에서 직접 쳐 보기

이제 진짜 코드예요. **JDBC로 DB에 연결해서 테이블 만들고, 넣고, 읽기**. Quiz 5 코드 문제는 여기서 나올 확률이 높아요. 순서(Connection → Statement → execute → ResultSet)와 메서드 이름, 반환 타입을 손으로 쓸 수 있을 때까지 연습하세요.

**이 챕터 구성**

- 👀 **Outcomes**: 목표: 왜 DB 프로그래밍인지, JDBC 구조, JDBC 인터페이스, 그리고 실제 기술 세 가지(연결, 읽기, 쓰기).
- 👀 **Why Java for Database Programming?**: 이유 세 개 중 앞의 두 개가 중요해요.
- 👀 **What is JDBC?**: JDBC = Java Database Connectivity.
- 👀 **The Architecture of JDBC**: 이 세 단계가 그대로 코드의 `getConnection` → `execute...` → `ResultSet` 순서예요.
- 👀 **JDBC API**: 패키지 두 개: `java.sql`(기본, Connection, Statement, ResultSet 등)과 `javax.sql`(확장, DataSource, 커넥션 풀 등.
- 👀 **Core JDBC Interfaces**: 흐름 4단계: 드라이버 로드 → 연결 → Statement 만들고 실행 → ResultSet 처리.
- 👀 **JDBC Driver Types**: MySQL Connector/J와 sqlite-jdbc 모두 Type 4로 쓰여요.
- 👀 **JDBC Technology: four steps**: Connect to the database
- ⌨️ **[Basic JDBC Connection](#practice-1)**:  (⌨️ SQLite 드라이버를 pom.xml에 넣고 StatementExample로 연결 객체 출력하기)
- ⌨️ **[Create Statement Object and execute](#practice-2)**:  (⌨️ Statement로 users 테이블을 만들고 "Table is created"가 나오는지 확인)
- 👀 **Execute statement with Insert**: `executeUpdate(sql)`: INSERT, UPDATE, DELETE에 써요.
- ⌨️ **[Execute statement with ResultSet](#practice-3)**:  (⌨️ 두 명 INSERT 후 SELECT로 출력하기)
- 👀 **Prepared Statement**: 미리 컴파일된(precompiled) SQL. 같은 SQL을 값만 바꿔 여러 번 실행할 때 효율적.
- 👀 **execute, executeQuery, executeUpdate**: `execute`가 true면 `getResultSet()`, false면 `getUpdateCount()`로 결과를 꺼내요.
- 👀 **Benefits of using PreparedStatement**: 동적, 매개변수 쿼리: 같은 SQL에 값만 바꿔 실행.
- ⌨️ **[Insert and Select using PreparedStatement](#practice-4)**:  (⌨️ books 테이블에 PreparedStatement로 두 권 넣고 이름으로 검색하기)

</div>

> 원문 출처: APD545 Week 8 · Segment 3 "JDBC" 강의 슬라이드 (Seneca) 핵심 문장 발췌. 코드는 슬라이드 예제를 정리 (DB 파일 경로만 짧게 바꿈)

### 📑 Outcomes

> - Understanding of why Database Programming?
> - Understanding architecture of JDBC. Understanding of JDBC Interface.
> - Understanding the Technology of JDBC: Connectivity, Read operations, Write operations

**🇰🇷 한글 해설**

목표: 왜 DB 프로그래밍인지, JDBC **구조**, JDBC **인터페이스**, 그리고 실제 기술 세 가지(**연결, 읽기, 쓰기**).

### 📑 Why Java for Database Programming?

> - First, Java is platform independent. You can develop platform-independent database applications using SQL and Java for any relational database systems.
> - Second, the support for accessing database systems from Java is built into Java API, so you can create database applications using all Java code with a common interface.

**🇰🇷 한글 해설**

이유 세 개 중 앞의 두 개가 중요해요.

1. Java는 **플랫폼 독립적**이라 어떤 관계형 DB와도 플랫폼 독립적인 DB 앱을 만들 수 있다.
2. DB 접근 기능이 **Java API에 내장**돼 있어서, 공통 인터페이스로 순수 Java 코드만으로 만들 수 있다.

(3번 "대학에서 많이 가르친다"는 가볍게.)

### 📑 What is JDBC?

> Java Database Connectivity or JDBC API provides industry-standard and database-independent connectivity between the Java applications and relational database servers (relational databases, spreadsheets, and flat files).

**🇰🇷 한글 해설**

**JDBC = Java Database Connectivity**. Java 앱과 관계형 DB 사이의 **표준**이고 **DB에 독립적인** 연결 API예요. Oracle, SQL Server, DB2, MySQL, SQLite 등 주요 DB를 다 지원해요. 핵심은 "DB가 바뀌어도 JDBC 코드는 거의 그대로, **드라이버만** 바꾸면 된다"는 것.

### 📑 The Architecture of JDBC

> JDBC helps you to write Java applications that manage these three programming activities:
> - Connect to a data source, like a database
> - Send queries and update statements to the database
> - Retrieve and process the results received from the database in answer to your query

**🇰🇷 한글 해설**

JDBC로 하는 일 세 가지:

1. 데이터 소스(DB)에 **연결**
2. 쿼리와 업데이트 문을 DB에 **보내기**
3. DB가 보낸 결과를 **받아서 처리**

이 세 단계가 그대로 코드의 `getConnection` → `execute...` → `ResultSet` 순서예요.

### 📑 JDBC API

> JDBC API consists of two packages: **`java.sql`** and **`javax.sql`**.
> A JDBC driver is a set of Java classes that implement the JDBC interfaces, targeting a specific database. The JDBC interfaces come with standard Java, but the implementation of these interfaces is specific to the database you need to connect to. Such an implementation is called a JDBC driver.

**🇰🇷 한글 해설**

- 패키지 두 개: **`java.sql`**(기본, Connection, Statement, ResultSet 등)과 **`javax.sql`**(확장, DataSource, 커넥션 풀 등. Week 13에서 다시).
- **JDBC driver**: JDBC **인터페이스를 구현한** Java 클래스 묶음. 특정 DB 전용.
- 인터페이스는 Java에 기본으로 들어 있고, **구현(드라이버)은 DB 회사가** 만들어요. MySQL은 `mysql-connector-j`, SQLite는 `sqlite-jdbc`.

Week 2에서 배운 "인터페이스와 구현"의 실제 사례예요. 우리 코드는 `Connection`(인터페이스)만 알고, 실제 객체는 드라이버가 만든 클래스예요.

### 📑 Core JDBC Interfaces

> Loading drivers → Establishing connections → Creating and executing statements → Processing ResultSet
> - **DriverManager** is used to load a JDBC Driver.
> - **Connection** is being returned by the DriverManager's `getConnection` function.
> - A Connection is used to create a **Statement**, or to create and prepare a **PreparedStatement** or **CallableStatement**.
> - Statement and PreparedStatement objects are used to execute SQL statements. CallableStatement objects are used to execute stored procedures.
> - A Connection can also be used to get a **DatabaseMetaData** object.

**🇰🇷 한글 해설**

흐름 4단계: **드라이버 로드 → 연결 → Statement 만들고 실행 → ResultSet 처리**.

| 인터페이스/클래스 | 역할 |
| --- | --- |
| `DriverManager` | 드라이버를 로드하고 `getConnection()`으로 **Connection을 돌려줌** |
| `Connection` | DB와의 연결. 여기서 Statement를 만듦 |
| `Statement` | 고정된 SQL 실행 |
| `PreparedStatement` | `?`가 있는 미리 컴파일된 SQL 실행 |
| `CallableStatement` | **stored procedure**(DB에 저장된 함수) 실행 |
| `ResultSet` | SELECT 결과 표 |
| `DatabaseMetaData` | DB 기능 정보 (`connection.getMetaData()`) |

모든 드라이버가 같은 인터페이스를 구현하니까 **데이터 소스를 바꾸기 쉬워요**.

### 📑 JDBC Driver Types

> 1. **Type 1: JDBC-ODBC bridge driver**: dependent on a native library, transitional solution, not supported by Oracle.
> 2. **Type 2: Java + Native code driver**: wraps a native API with Java classes (Oracle OCI driver). Expected to have better performance than a pure Java driver.
> 3. **Type 3: All Java + Middleware translation driver**: communicates using a network protocol to a middle-tier server.
> 4. **Type 4: All Java driver**: written entirely in Java, communicates directly with the database. No local native code is required. (Oracle's Thin driver)

**🇰🇷 한글 해설**

네 종류. 번호와 특징을 짝지으세요.

| Type | 이름 | 특징 |
| --- | --- | --- |
| 1 | JDBC-ODBC bridge | 네이티브 라이브러리 의존, 이식성 낮음, **임시 방편**, Oracle 미지원 |
| 2 | Java + Native code | 네이티브 API를 Java로 감쌈 (Oracle OCI). 네이티브라 **더 빠를 수 있음** |
| 3 | All Java + Middleware | 네트워크로 **중간 서버**와 통신, 중간 서버가 DB와 통신 |
| 4 | **All Java** | 순수 Java, DB와 **직접** 통신, 네이티브 코드 불필요 (Oracle Thin). 요즘 대부분 이것 |

MySQL Connector/J와 sqlite-jdbc 모두 Type 4로 쓰여요. 설치는 jar를 클래스패스에 추가(Maven이면 pom.xml에 의존성 한 줄).

### 📑 JDBC Technology: four steps

> - Connect to the database
> - Create a statement
> - Execute the query
> - Look at the result set
> - Close connection // not needed if you are using try-with-resources

**🇰🇷 한글 해설**

네 단계 + 1:

1. **Connect** to the database
2. **Create** a statement
3. **Execute** the query
4. **Look at** the result set
5. **Close** connection (try-with-resources면 **필요 없음**)

이 순서를 그대로 빈칸 채우기로 낼 수 있어요.

### 📑 Basic JDBC Connection


<p class="typeit" id="practice-1">⌨️ <b>이 코드는 IntelliJ에서 직접 쳐 보세요</b>: SQLite 드라이버를 pom.xml에 넣고 StatementExample로 연결 객체 출력하기</p>

```java
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;

public class StatementExample {
    public static void main(String[] args) {
        try (Connection connection = DriverManager.getConnection("jdbc:sqlite:testDB.db")) {
            System.out.println(connection);
        } catch (SQLException e) {
            printSQLException(e);
        }
    }

    public static void printSQLException(SQLException ex) {
        for (Throwable e : ex) {
            if (e instanceof SQLException) {
                e.printStackTrace(System.err);
                System.err.println("SQLState: " + ((SQLException) e).getSQLState());
                System.err.println("Error Code: " + ((SQLException) e).getErrorCode());
                System.err.println("Message: " + e.getMessage());
                Throwable t = ex.getCause();
                while (t != null) {
                    System.out.println("Cause: " + t);
                    t = t.getCause();
                }
            }
        }
    }
}
```

**🇰🇷 한글 해설**

- URL 형식: `jdbc:<DB종류>:<위치>`. SQLite는 `jdbc:sqlite:testDB.db`(파일 없으면 **새로 만듦**), MySQL은 `jdbc:mysql://localhost:3306/DB이름`.
- **try-with-resources**: `try (Connection connection = ...) { }` 괄호 안에서 만든 자원은 블록이 끝나면 **자동으로 close**. `AutoCloseable`을 구현한 것만 넣을 수 있어요.
- `System.out.println(connection)`: 연결 객체 정보가 찍히면 연결 성공.
- `SQLException`은 **checked exception**이라 반드시 catch(또는 throws).
- `printSQLException`: `SQLException`은 여러 예외가 **체인**으로 연결돼 있어서 for-each로 돌면서 `getSQLState()`(표준 오류 코드), `getErrorCode()`(DB별 코드), `getMessage()`, 원인(`getCause()`)을 다 찍어 줘요. `for (Throwable e : ex)`가 되는 이유는 `SQLException`이 `Iterable<Throwable>`을 구현하기 때문이에요.

### 📑 Create Statement Object and execute


<p class="typeit" id="practice-2">⌨️ <b>이 코드는 IntelliJ에서 직접 쳐 보세요</b>: Statement로 users 테이블을 만들고 &quot;Table is created&quot;가 나오는지 확인</p>

```java
Statement statement = connection.createStatement();
statement.execute("Drop Table If Exists users");
String query = "Create Table IF NOT EXISTS Users (id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT, "
             + "username varchar(20) not null, email varchar(20) not null, "
             + "country varchar(15), password varchar(20))";
boolean success = statement.execute(query);
if (success)
    System.err.println("Table is not created as the resultSet is being returned");
else
    System.err.println("Table is created");
```

**🇰🇷 한글 해설**

- `connection.createStatement()` → `Statement`.
- `statement.execute(sql)`: 아무 SQL이나 실행. 반환값 **boolean**: 결과가 **ResultSet이면 true**, 업데이트 수거나 결과 없으면 **false**.
- CREATE TABLE은 ResultSet을 안 돌려주니 **false** → 그래서 코드가 `else`에서 "Table is created"를 찍어요. `true`/`false`를 성공/실패로 오해하면 안 돼요. 퀴즈 함정으로 아주 좋아요.
- `Drop Table If Exists users`: 다시 실행해도 에러 안 나게 먼저 지우기.
- SQLite의 `INTEGER PRIMARY KEY AUTOINCREMENT`: id 자동 증가.

### 📑 Execute statement with Insert

```java
int value = 0;
query = "Insert into users (username, email, country, password) "
      + "Values ('mali','m@ali.com','Canada','1234')";
value = statement.executeUpdate(query);
if (value != 0)
    System.err.println("1 row updated in the table");
```

**🇰🇷 한글 해설**

`executeUpdate(sql)`: INSERT, UPDATE, DELETE에 써요. 반환값은 **영향받은 행 수(int)**. 한 명 넣으면 `1`. 그래서 `if (value != 0)`이면 성공.

슬라이드의 두 번째 INSERT는 `statement.execute(query)`로 실행하고 `value`를 다시 검사해요. `value`는 첫 번째 결과(1)가 그대로 남아 있어서 메시지가 찍히지만, 두 번째 INSERT의 결과를 확인한 게 아니에요. 이런 "변수 재사용 실수"도 코드 읽기 문제로 나올 수 있어요.

⚠️ 여기서는 값을 SQL 문자열에 **직접** 넣었어요. 사용자 입력을 이렇게 이어 붙이면 SQL Injection 위험이 있어요. 그래서 아래 PreparedStatement가 나와요.

### 📑 Execute statement with ResultSet


<p class="typeit" id="practice-3">⌨️ <b>이 코드는 IntelliJ에서 직접 쳐 보세요</b>: 두 명 INSERT 후 SELECT로 출력하기</p>

```java
query = "Select * from users";
ResultSet rs = statement.executeQuery(query);
while (rs.next()) {
    System.out.println(rs.getInt(1) + " " + rs.getString(2) + " " + rs.getString(3)
                       + " " + rs.getString(4) + " " + rs.getString(5));
}
```

**🇰🇷 한글 해설**

- `executeQuery(sql)`: **SELECT 전용**. 반환값 **ResultSet**.
- `ResultSet`은 커서가 **첫 행 앞**에 있어요. `rs.next()`를 부를 때마다 한 행 내려가고, 행이 있으면 `true`, 끝이면 `false`. 그래서 `while (rs.next())`.
- `rs.getInt(1)`, `rs.getString(2)`: 열 번호는 **1부터**. 열 이름으로도 가능: `rs.getString("username")` (이 방식이 더 읽기 쉬워요).

출력 예: `1 mali m@ali.com Canada 1234`, `2 frank frank@f.com Canada 5678`.

### 📑 Prepared Statement

> - Prepared statements are precompiled statements that can be reused to execute identical SQL statements with different values more efficiently.
> - They make only one trip to the database for metadata, whereas statements make a round trip with each execution.
> - You use a question mark as a placeholder within the text of a SQL statement ... You can then replace that question mark with an appropriate value using one of the many available `setXXX()` accessor methods.

**🇰🇷 한글 해설**

PreparedStatement 핵심:

- **미리 컴파일된(precompiled)** SQL. 같은 SQL을 값만 바꿔 여러 번 실행할 때 효율적.
- 메타데이터를 위해 DB에 **한 번만** 감. Statement는 실행할 때마다 왕복.
- `?`가 **자리표시자(placeholder)**, `setString(1, ...)`, `setDouble(3, ...)`처럼 **setXXX(번호, 값)**으로 채움. 번호는 **1부터**.
- BLOB 같은 SQL 텍스트로 못 쓰는 값도 넣을 수 있음.

```java
PreparedStatement ps = connection.prepareStatement(
    "SELECT * FROM users WHERE username = ? AND password = ?");
ps.setString(1, "mali");
ps.setString(2, "1234");
ResultSet rs = ps.executeQuery();      // 괄호 안에 SQL을 다시 넣지 않음!
```

주의: PreparedStatement에서는 `ps.executeQuery()`처럼 **인자 없이** 불러요. SQL은 이미 `prepareStatement`에서 넘겼으니까요.

### 📑 execute, executeQuery, executeUpdate

> - The methods for executing SQL statements are `execute`, `executeQuery`, and `executeUpdate`, each of which accepts a string containing a SQL statement as an argument.
> - The `execute` method should be used if the execution produces multiple result sets, multiple update counts, or a combination of result sets and update counts.

**🇰🇷 한글 해설**

세 메서드 비교표. 퀴즈 1순위예요.

| 메서드 | 언제 | 반환 |
| --- | --- | --- |
| `executeQuery` | SELECT | `ResultSet` |
| `executeUpdate` | INSERT, UPDATE, DELETE, CREATE, DROP | `int` (영향받은 행 수, DDL은 0) |
| `execute` | 아무거나, 특히 결과가 **여러 개**거나 종류를 모를 때 | `boolean` (ResultSet이면 true) |

`execute`가 true면 `getResultSet()`, false면 `getUpdateCount()`로 결과를 꺼내요.

### 📑 Benefits of using PreparedStatement

> - PreparedStatement allows you to write a dynamic and parametric query.
> - PreparedStatement is faster than Statement in Java. PreparedStatement gets pre-compiled in database and their access plan is also cached.
> - **PreparedStatement prevents SQL Injection attacks in Java**: all the parameters passed as part of the place-holder will be escaped automatically by JDBC Driver.
> - PreparedStatement queries are more readable and secure than cluttered string concatenated queries.

**🇰🇷 한글 해설**

장점 4개:

1. **동적, 매개변수 쿼리**: 같은 SQL에 값만 바꿔 실행.
2. **더 빠름**: 미리 컴파일되고 실행 계획이 DB에 캐시됨.
3. **SQL Injection 방지**: `?`에 들어가는 값은 드라이버가 자동으로 **escape**(특수문자 처리)해서 SQL 명령으로 해석되지 않음.
4. **읽기 쉽고 안전**: 문자열 이어 붙이기보다 깔끔.

SQL Injection 예: 로그인 비밀번호 칸에 `' OR '1'='1`을 넣으면, 문자열을 이어 붙인 쿼리는 `... WHERE password = '' OR '1'='1'`이 되어 **항상 참** → 아무나 로그인. PreparedStatement는 이 입력을 그냥 "이상한 비밀번호 문자열"로 취급해서 막아요.

### 📑 Insert and Select using PreparedStatement


<p class="typeit" id="practice-4">⌨️ <b>이 코드는 IntelliJ에서 직접 쳐 보세요</b>: books 테이블에 PreparedStatement로 두 권 넣고 이름으로 검색하기</p>

```java
query = "Insert into books (bname, bcategory, bprice, bisbn) Values (?,?,?,?)";
ps = connection.prepareStatement(query);
ps.setString(1, "Harry Potter");
ps.setString(2, "Fantacy");
ps.setDouble(3, 65.3);
ps.setString(4, "123456789");
value = ps.executeUpdate();
if (value != 0)
    System.err.println("1 row updated in the table");

query = "Select * from books where bname = ?";
ps = connection.prepareStatement(query);
ps.setString(1, "Harry Potter");
ResultSet rs = ps.executeQuery();
while (rs.next()) {
    System.out.println(rs.getInt(1) + " " + rs.getString(2) + " " + rs.getString(3)
                       + " " + rs.getString(4) + " " + rs.getString(5));
}
```

**🇰🇷 한글 해설**

- INSERT: `?` 4개 → `setString(1)`, `setString(2)`, `setDouble(3)`, `setString(4)` → `executeUpdate()`.
- **같은 ps를 재사용**: 값만 다시 set하고 또 `executeUpdate()`. 이게 PreparedStatement를 쓰는 이유예요 (SQL은 한 번만 컴파일).
- SELECT: `WHERE bname = ?` → `setString(1, "Harry Potter")` → `executeQuery()` → `while (rs.next())`.
- `bprice`는 숫자인데 출력에서 `rs.getString(4)`로 읽어도 돼요. JDBC가 문자열로 바꿔 줘요. 계산하려면 `rs.getDouble(4)`.

출력: `1 Harry Potter Fantacy 65.3 123456789`.


---

## 4. 📑 강의 슬라이드: Week 8 · Segment 4. JavaFX and JDBC

<div class="sum" data-kind="read">

**🧭 먼저 한국어로** · 👀 읽고 이해하기 (타이핑 안 해도 돼요)

JDBC를 **JavaFX 화면에 붙이는** 단계별 예제예요. 회원가입 폼 → 입력 검사 → `JdbcDao.insertRecord`, 로그인 폼 → `JdbcDao.validate`. Week 7 샘플 `WK_7_Login_MySql`과 거의 같은 구조라 같이 비교하면 좋아요.

**이 챕터 구성**

- 👀 **Outcomes**: MySQL Connector로 JDBC + JavaFX 예제 만들기: 레이아웃, 컨트롤 추가, 입력 검증, MySQL 연결.
- 👀 **Steps 1 to 3: Project, Libraries, Database**: JavaFX 프로젝트 만들기 (슬라이드는 Eclipse, 우리는 IntelliJ + Maven).
- 👀 **Step 5: Main.java**: 평소와 같은 JavaFX 시작 클래스예요. `FXMLLoader.load(getClass().getResource("/com/senecacollege/views/Register.fxml"))`: 경로가 `/`로 시작하면 resources 폴더 루...
- 👀 **Step 7: Registration Controller**: 입력 검증의 정석이에요. Week 7 샘플과 비교해서 올바른 점을 보세요.
- ⌨️ **[Step 8: JdbcDao for database operations](#practice-5)**:  (⌨️ JdbcDao.insertRecord를 SQLite URL로 바꿔서 쳐 보기)
- 👀 **Login view and LoginController**: 회원가입 화면에서 로그인 화면으로: 새 Stage를 만들어 띄워요 (Week 7 "새 창 띄우기"와 같음).
- ⌨️ **[JdbcDao.validate](#practice-6)**:  (⌨️ validate를 쳐서 맞는/틀린 비밀번호로 true/false 확인)

</div>

> 원문 출처: APD545 Week 8 · Segment 4 "JavaFX and JDBC" 강의 슬라이드 (Seneca) 핵심 문장 발췌. 코드는 슬라이드 예제를 정리

### 📑 Outcomes

> JDBC with FX example using MySQL Connector. Creating layouts of JavaFX, adding UI controls, validating controls, connecting with MySQL via JDBC API.

**🇰🇷 한글 해설**

MySQL Connector로 JDBC + JavaFX 예제 만들기: 레이아웃, 컨트롤 추가, **입력 검증**, MySQL 연결.

### 📑 Steps 1 to 3: Project, Libraries, Database

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

**🇰🇷 한글 해설**

준비 3단계:

1. JavaFX 프로젝트 만들기 (슬라이드는 Eclipse, 우리는 IntelliJ + Maven).
2. 라이브러리: JavaFX + **MySQL JDBC Connector**. Maven이면 pom.xml에:

```xml
<dependency>
    <groupId>com.mysql</groupId>
    <artifactId>mysql-connector-j</artifactId>
    <version>9.1.0</version>
</dependency>
```

모듈 프로젝트면 `module-info.java`에 `requires java.sql;`도 추가.

3. MySQL에서 DB와 테이블 생성. `id BIGINT PRIMARY KEY AUTO_INCREMENT`(MySQL은 `AUTO_INCREMENT`, SQLite는 `AUTOINCREMENT`), `NOT NULL`은 빈 값 금지.

### 📑 Step 5: Main.java

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

**🇰🇷 한글 해설**

평소와 같은 JavaFX 시작 클래스예요. `FXMLLoader.load(getClass().getResource("/com/senecacollege/views/Register.fxml"))`: 경로가 `/`로 시작하면 **resources 폴더 루트 기준**, `/` 없으면 이 클래스가 있는 패키지 기준이에요. 경로가 틀리면 `Location is not set` 에러가 나요. `(BorderPane)`는 load 결과를 BorderPane으로 캐스팅.

### 📑 Step 7: Registration Controller

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

**🇰🇷 한글 해설**

입력 검증의 정석이에요. Week 7 샘플과 비교해서 **올바른 점**을 보세요.

- 이름, 이메일, 비밀번호가 비었으면 Alert를 띄우고 **`return;`**. 그래서 빈 값으로 DB에 저장되지 않아요. (Week 7 샘플에는 이 `return`이 빠져 있었죠.)
- 검사를 다 통과한 뒤에야 `JdbcDao`를 만들어 `insertRecord(fullName, emailId, password)`. 인자 순서가 메서드 정의와 **같아요**.
- 성공하면 `AlertType.CONFIRMATION`으로 "Welcome 이름".
- `showAlert` 도우미 메서드로 Alert 만드는 코드 중복을 줄였어요. `setHeaderText(null)`은 머리글 줄을 없애요.
- 역할 분리: Controller는 **화면과 검증**, DB 작업은 **JdbcDao**(DAO = Data Access Object). Repository 패턴과 같은 생각이에요.

### 📑 Step 8: JdbcDao for database operations

> - Steps: Establishing a connection, Create a statement, Execute the query. Using try-with-resources Statements to Automatically Close JDBC Resources.
> - From JDBC 4.0, we don't need to include `Class.forName()` in our code, to load JDBC driver. When the method `getConnection` is called, the `DriverManager` will automatically load the suitable driver.


<p class="typeit" id="practice-5">⌨️ <b>이 코드는 IntelliJ에서 직접 쳐 보세요</b>: JdbcDao.insertRecord를 SQLite URL로 바꿔서 쳐 보기</p>

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

**🇰🇷 한글 해설**

DAO의 표준 모양이에요.

- 상수로 URL, 사용자, 비밀번호, SQL을 모아 둠. (실제 비밀번호를 코드에 쓰는 건 연습용일 때만. 공개 저장소에 올리면 안 돼요.)
- `try (Connection ...; PreparedStatement ...)`: 두 자원을 **세미콜론으로 구분**해 한 번에 열고, 끝나면 **역순으로** 자동 close.
- 주석의 Step 1, 2, 3이 JDBC 4단계와 같아요.
- **JDBC 4.0부터 `Class.forName("com.mysql.cj.jdbc.Driver")` 필요 없음**. `getConnection`할 때 DriverManager가 클래스패스에서 맞는 드라이버를 자동으로 찾아요. 퀴즈에 "Class.forName이 꼭 필요하다(T/F)" → **F**.

SQLite로 연습하려면 URL만 `"jdbc:sqlite:registration.db"`로 바꾸고 사용자/비밀번호 없이 `getConnection(url)`.

### 📑 Login view and LoginController

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

**🇰🇷 한글 해설**

- 회원가입 화면에서 로그인 화면으로: **새 Stage**를 만들어 띄워요 (Week 7 "새 창 띄우기"와 같음).
- 로그인 검사: 이메일, 비밀번호가 비었는지 확인 → `jdbcDao.validate(emailId, password)` → true/false에 따라 메시지.
- 슬라이드의 작은 실수: 성공일 때도 제목이 `"Failed"`예요. 퀴즈에서 "이 코드의 문제는?"으로 나오면 지적할 수 있어야 해요.

### 📑 JdbcDao.validate


<p class="typeit" id="practice-6">⌨️ <b>이 코드는 IntelliJ에서 직접 쳐 보세요</b>: validate를 쳐서 맞는/틀린 비밀번호로 true/false 확인</p>

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

**🇰🇷 한글 해설**

로그인 검사 = **이메일과 비밀번호가 둘 다 맞는 행이 있는가**.

1. `SELECT * FROM registration WHERE email_id = ? and password = ?`
2. `setString(1, emailId)`, `setString(2, password)`
3. `executeQuery()` → `ResultSet`
4. `if (resultSet.next()) return true;` 행이 하나라도 있으면 로그인 성공.
5. 예외가 나거나 행이 없으면 마지막 `return false;`.

`return true`가 try 블록 안에 있어도 try-with-resources가 **close를 먼저 하고** 돌아가요. 걱정 안 해도 돼요.

참고: 실제 서비스에서는 비밀번호를 그대로 저장하지 않고 **해시**해서 저장해요. 수업 예제는 개념 설명용이에요.


---

## ⌨️ 직접 해 보기: SQLite로 JDBC 한 파일 연습

MySQL 설치 없이 바로 돌릴 수 있어요. IntelliJ에서 새 Maven 프로젝트(Java)를 만들고 `pom.xml`에 SQLite 드라이버를 추가하세요.

```xml
<dependencies>
    <dependency>
        <groupId>org.xerial</groupId>
        <artifactId>sqlite-jdbc</artifactId>
        <version>3.46.1.3</version>
    </dependency>
</dependencies>
```

모듈(`module-info.java`)이 없는 프로젝트면 바로 실행돼요. 있으면 `requires java.sql;`을 추가하세요. 아래 파일 하나로 CRUD 네 가지를 다 해 봐요.

```java
import java.sql.*;

public class JdbcPractice {
    private static final String URL = "jdbc:sqlite:practice.db";

    public static void main(String[] args) {
        try (Connection conn = DriverManager.getConnection(URL)) {
            // CREATE
            try (Statement st = conn.createStatement()) {
                st.execute("DROP TABLE IF EXISTS players");
                boolean isResultSet = st.execute(
                    "CREATE TABLE players (id INTEGER PRIMARY KEY AUTOINCREMENT, "
                  + "name TEXT NOT NULL, team TEXT, goals INTEGER)");
                System.out.println("execute() returned " + isResultSet);   // false
            }

            // INSERT (C)
            String insert = "INSERT INTO players (name, team, goals) VALUES (?, ?, ?)";
            try (PreparedStatement ps = conn.prepareStatement(insert)) {
                ps.setString(1, "Jack"); ps.setString(2, "Alpha"); ps.setInt(3, 3);
                System.out.println("rows: " + ps.executeUpdate());           // 1
                ps.setString(1, "Mike"); ps.setString(2, "Beta");  ps.setInt(3, 5);
                ps.executeUpdate();
                ps.setString(1, "Kyle"); ps.setString(2, "Alpha"); ps.setInt(3, 1);
                ps.executeUpdate();
            }

            // UPDATE (U)
            try (PreparedStatement ps = conn.prepareStatement(
                    "UPDATE players SET goals = goals + 1 WHERE team = ?")) {
                ps.setString(1, "Alpha");
                System.out.println("updated: " + ps.executeUpdate());       // 2
            }

            // DELETE (D)
            try (PreparedStatement ps = conn.prepareStatement("DELETE FROM players WHERE name = ?")) {
                ps.setString(1, "Mike");
                ps.executeUpdate();
            }

            // SELECT (R)
            try (PreparedStatement ps = conn.prepareStatement(
                    "SELECT id, name, goals FROM players ORDER BY goals DESC");
                 ResultSet rs = ps.executeQuery()) {
                while (rs.next()) {
                    System.out.println(rs.getInt("id") + " " + rs.getString("name") + " " + rs.getInt(3));
                }
            }
        } catch (SQLException e) {
            System.out.println("DB error: " + e.getMessage());
        }
    }
}
```

예상 출력을 **먼저 종이에 쓰고** 실행해서 맞춰 보세요.

<details><summary>예상 출력</summary>

```text
execute() returned false
rows: 1
updated: 2
1 Jack 4
3 Kyle 2
```

Alpha 팀(Jack 3→4, Kyle 1→2)만 +1, Mike는 삭제, goals 내림차순.

</details>

## 🧩 이번 주 토이 프로젝트: CafeOrder Week 8

Week 7의 `InMemoryMenuRepository` 옆에 `JdbcMenuRepository implements MenuRepository`를 만들어 **SQLite**에 메뉴와 주문을 저장해요. `AppModule`의 bind 한 줄만 바꾸면 메모리 저장 → DB 저장으로 바뀌는 걸 확인하는 게 목표예요 (IoC의 Flexibility 체험). (Week 8 토이 가이드는 준비 중이에요.)

## ✅ Quiz 5 대비 체크리스트 (Week 8)

- [ ] Persistent data, 3-Tier(Presentation, Domain, Data Source)를 설명할 수 있다.
- [ ] Object-relational mismatch와 관계형 vs 객체 모델 차이 5개를 안다.
- [ ] ORM 정의("virtual object database", metadata로 매핑)와 장점(CRUD 자동, 비즈니스 로직 집중)을 안다.
- [ ] 다대다 관계를 join table로 표현할 수 있다.
- [ ] Entity vs Value Object, Aggregate를 구분한다.
- [ ] Domain Model, Table Module, Active Record, Data Mapper를 짝지을 수 있다.
- [ ] 상속 매핑 3가지와 가장 흔한 것(table per concrete class)을 안다.
- [ ] Lazy loading을 비유로 설명할 수 있다.
- [ ] JDBC 정의, `java.sql`/`javax.sql`, 드라이버 Type 1~4를 안다.
- [ ] Connection → Statement/PreparedStatement → execute → ResultSet → close 순서로 코드를 쓸 수 있다.
- [ ] `execute`/`executeQuery`/`executeUpdate`의 용도와 반환 타입을 안다.
- [ ] PreparedStatement 장점 4개, 특히 SQL Injection 방지를 설명할 수 있다.
- [ ] `?`와 열 번호가 1부터라는 것, `rs.next()` 커서 동작을 안다.
- [ ] JDBC 4.0부터 `Class.forName` 불필요, try-with-resources로 자동 close.
- [ ] module-info에 `requires java.sql;`이 필요하다.

## ✍️ 손으로 써 보기

1. `students(id, name, gpa)` 테이블에서 gpa가 주어진 값 **이상**인 학생 이름을 모두 출력하는 메서드 `printHonors(Connection conn, double min)`를 PreparedStatement로 써 보세요.

<details><summary>1번 예시 답</summary>

```java
public static void printHonors(Connection conn, double min) throws SQLException {
    String sql = "SELECT name FROM students WHERE gpa >= ?";
    try (PreparedStatement ps = conn.prepareStatement(sql)) {
        ps.setDouble(1, min);
        try (ResultSet rs = ps.executeQuery()) {
            while (rs.next()) {
                System.out.println(rs.getString("name"));
            }
        }
    }
}
```

</details>

2. 빈칸을 채우세요.

```java
try (Connection c = DriverManager.________("jdbc:sqlite:shop.db");
     PreparedStatement ps = c.________("DELETE FROM items WHERE id = ?")) {
    ps.________(1, 42);
    int n = ps.________();
    System.out.println(n + " row(s) deleted");
}
```

<details><summary>2번 정답</summary>

`getConnection`, `prepareStatement`, `setInt`, `executeUpdate`.

</details>

3. 다음 코드가 위험한 이유와 고친 코드를 쓰세요.

```java
String sql = "SELECT * FROM users WHERE email = '" + emailField.getText() + "'";
ResultSet rs = conn.createStatement().executeQuery(sql);
```

<details><summary>3번 정답</summary>

사용자 입력을 SQL 문자열에 그대로 이어 붙여서 **SQL Injection** 위험이 있어요(예: `' OR '1'='1`). 또 Statement와 ResultSet을 닫지 않아요.

```java
String sql = "SELECT * FROM users WHERE email = ?";
try (PreparedStatement ps = conn.prepareStatement(sql)) {
    ps.setString(1, emailField.getText());
    try (ResultSet rs = ps.executeQuery()) {
        // ...
    }
}
```

</details>
