Source: <APD545 Week 7 · Segment 2 "Inversion of Control" 강의 슬라이드 (Mahboob Ali, Seneca) 핵심 문장 발췌>
# Week 7 · Segment 2. Inversion of Control (IoC)

## Outcomes

> - I can explain IoC: define Inversion of Control and describe how it changes responsibility in a program.
> - I can spot IoC in frameworks: recognize examples of IoC in Dependency Injection, callbacks, and design patterns.
> - I can use IoC in code: apply IoC by writing code that uses a DI framework (like Guice) instead of manual wiring.

## Inversion of Control (IoC)

> Inversion of Control (IoC) is a design principle in software engineering where the control over program flow or object creation is inverted: instead of the application code directly managing dependencies and execution, a framework or container takes responsibility for providing objects and orchestrating the flow.
>
> Key idea: **"Don't call us, we'll call you."**

## What is it?

> - Shifts responsibility of object creation & wiring from your code → to a framework/container
> - Your code focuses on business logic, not dependency management

## Why it matters?

> - **Decoupling**: Classes don't depend on concrete implementations
> - **Flexibility**: Swap implementations easily (e.g., mock vs real repository)
> - **Testability**: Easier unit testing with injected dependencies
> - **Maintainability**: Centralized configuration, less scattered `new` statements

## In Action

> Without IoC (manual wiring):

```java
SceneRepository repo = new InMemorySceneRepository();
MainController controller = new MainController(stage, repo);
```

> With IoC (using Guice): Framework injects dependencies automatically

```java
@Inject
public MainController(Stage stage, SceneRepository repo) { ... }
```

## IoC Techniques

> - **Dependency Injection (DI)**: Constructor, setter, or field injection. Most popular because it makes dependencies explicit and testable.
> - **Service Locator Pattern**: Instead of injecting, classes ask a central "locator" for dependencies. Still IoC, because the class doesn't decide how the dependency is built. Less favored today because it hides dependencies.
> - **Event-driven / Callback style**: Framework calls your code at the right time (e.g., JavaFX method, servlet lifecycle methods). You don't control the flow, the framework does. This inversion of control is about program flow, not just object creation.
> - **Template Method Pattern**: Framework defines the skeleton of an algorithm, and your subclass provides specific steps. Control of execution order is inverted to the framework.

## Example from the class

> - Controllers declare dependencies (Stage, SceneRepository)
> - Guice AppModule binds interfaces → implementations
> - FXMLLoader uses Guice to create controllers
> - Result: Controllers only handle scene logic, not wiring

## What IoC is not?

> IoC is ≠ Dependency Injection. Rather DI is the most commonly used technique of IoC.

## Analogy: Restaurant Ordering

> - Without IoC (manual control): You go into the kitchen, gather ingredients, cook the meal yourself. You control everything.
> - With IoC (inversion of control): You sit at a table, order from the menu. The chef and staff handle cooking, serving, cleanup. You focus only on enjoying the meal.
