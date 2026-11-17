Source: <APD545 Week 6 · Segment 5 "Dependency Injection & Repository Patterns" 강의 슬라이드 (Mahboob Ali, Seneca) 핵심 문장 발췌>
# Week 6 · Segment 5. Dependency Injection & Repository Pattern

## Dependency Injection

> **Dependency Injection (DI)** is a design pattern where objects receive their dependencies from an external source rather than creating them internally. Promotes **loose coupling** between classes. Makes code easier to test and maintain. Common in frameworks like Guice, Spring, and Jakarta EE.
>
> Problem: classes often create their own dependencies → **tight coupling**. Solution: give (inject) dependencies from outside. Analogy: instead of a chef growing their own vegetables, the restaurant delivers them.

## Dependency Injection in Practice

```java
public class AppModule extends AbstractModule {
    @Override
    protected void configure() {
        bind(PlayerRepository.class)
            .to(InMemoryPlayerRepository.class)
            .in(Singleton.class);
    }
}
```

> Guice decides which implementation to provide. Controllers don't care how the repository is built.

## Repository Pattern

> The Repository Pattern separates the logic that retrieves data from the business logic that uses the data, acting as a **mediator** between the domain and data mapping layers. Allows **swapping between memory, database, or API** without changing business code. Analogy: a library catalog, you don't search shelves yourself, you ask the catalog.

```java
public interface PlayerRepository {
    ObservableList<Player> findAll();
    void add(Player player);
    void remove(Player player);
}
```

## How do they both work together?

> Controller asks for data → via DI, gets a PlayerRepository. Repository provides data → doesn't matter if memory, DB, or file. **DI + Repository = Decoupled, testable design.**

## Service Design Pattern

> Introduces a dedicated layer that encapsulates business logic and workflows, separating them from both the UI (controllers) and data access (repositories). Keeps controllers focused on UI events only.
>
> - Current: **Controller → Repository → Data**
> - Improved: **Controller → Service → Repository → Data**
