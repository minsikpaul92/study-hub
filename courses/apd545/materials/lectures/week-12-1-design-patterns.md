Source: <APD545 Week 12 · Segment 1 "Observer, Factory & Decorator Design Patterns" 강의 슬라이드 (Mahboob Ali, Seneca) 핵심 문장 발췌. 코드는 슬라이드 개념을 따라 해설용으로 새로 쓴 예시>
# Week 12 · Segment 1. Observer, Factory and Decorator Design Patterns

## Outcomes

> - Decoupling Object Creation (**Factory**): we moved the `new` keyword into a dedicated Factory.
> - Composition over Inheritance (**Decorator**): we used wrappers to add "Cheese" and "Olives" instead of creating subclasses.
> - Event-Driven Communication (**Observer**): we connected the "Order" button to the "Kitchen Display" without tight coupling.

## A Scalable Pizza App

> We need a desktop app where we can create different base pizzas (Margherita, Pepperoni), add infinite toppings (Cheese, Olives) without creating millions of subclasses, and when an order is placed, the Kitchen (a separate screen) must be notified immediately.

```java
// 예시 코드: 세 패턴이 함께 쓰는 공통 인터페이스
public interface Pizza {
    String getDescription();
    double getCost();
}

public class Margherita implements Pizza {
    public String getDescription() { return "Margherita"; }
    public double getCost() { return 10.0; }
}

public class Pepperoni implements Pizza {
    public String getDescription() { return "Pepperoni"; }
    public double getCost() { return 12.0; }
}
```

## The Factory Pattern

> Defines an interface for creating an object, but lets subclasses decide which class to instantiate. Using the `new` keyword creates **tight coupling**: if you change the class name, you have to change it everywhere. Delegate object creation to a special factory method.

## Factory: Real-World Analogy

> A Pizza Shop: you just say, "I want a Pepperoni Pizza." The Kitchen (Factory) handles the complex creation process and hands you the finished object.

## Factory with Map of Supplier

> Replaced if/else chains with a `Map<String, Supplier>`: O(1) performance and a clean "Recipe Registry" that makes adding new pizzas easy without modifying the core logic.

```java
// 예시 코드
public class PizzaFactory {
    private static final Map<String, Supplier<Pizza>> RECIPES = new HashMap<>();
    static {
        RECIPES.put("margherita", Margherita::new);
        RECIPES.put("pepperoni", Pepperoni::new);
    }

    public static Pizza create(String type) {
        Supplier<Pizza> recipe = RECIPES.get(type.toLowerCase());
        if (recipe == null) throw new IllegalArgumentException("Unknown pizza: " + type);
        return recipe.get();
    }
}

Pizza p = PizzaFactory.create("Pepperoni");
```

## The Decorator Pattern

> Attaches additional responsibilities to an object **dynamically**. Inheritance is static (compile-time); decorators allow you to mix and match behaviors at **runtime**. Key principle: "**Open for Extension, Closed for Modification.**"

## Decorator: Real-World Analogy

> Coffee Shop Orders: you start with Coffee, decorate it with Milk, then with Sugar. You don't create a separate class for CoffeeWithMilkAndSugar; you wrap the coffee in layers.

## Decorator in Code

> Used wrappers (Cheese, Olives) around base objects: dynamic pricing and descriptions at runtime, avoiding the "**Class Explosion**" problem (e.g., VeggieWithCheeseAndOlives).

```java
// 예시 코드
public abstract class ToppingDecorator implements Pizza {
    protected final Pizza pizza;          // the wrapped object
    protected ToppingDecorator(Pizza pizza) { this.pizza = pizza; }
}

public class Cheese extends ToppingDecorator {
    public Cheese(Pizza pizza) { super(pizza); }
    public String getDescription() { return pizza.getDescription() + ", Cheese"; }
    public double getCost() { return pizza.getCost() + 1.5; }
}

public class Olives extends ToppingDecorator {
    public Olives(Pizza pizza) { super(pizza); }
    public String getDescription() { return pizza.getDescription() + ", Olives"; }
    public double getCost() { return pizza.getCost() + 1.0; }
}

Pizza order = new Olives(new Cheese(PizzaFactory.create("margherita")));
System.out.println(order.getDescription() + " $" + order.getCost());
// Margherita, Cheese, Olives $12.5
```

## The Observer Pattern

> Defines a **one-to-many** dependency between objects. When one object (the **Subject**) changes state, all its dependents (**Observers**) are notified and updated automatically. Key principle: "**Loose Coupling**": the subject knows it has a list of observers, but doesn't care who they are or what they do.

## Observer: Real-World Analogy

> YouTube Subscriptions: you (the Observer) subscribe to a Channel (the Subject). You don't refresh the channel page every 5 seconds; when a new video is uploaded, the Channel **notifies** you.

## Observer in Code

> Decoupled the Order Button (Subject) from the Kitchen Display (Observer). We can add more listeners (e.g., "Inventory System") later without touching the Controller code.

```java
// 예시 코드
public interface OrderListener {
    void onOrderPlaced(Pizza pizza);
}

public class OrderService {                       // Subject
    private final List<OrderListener> listeners = new ArrayList<>();
    public void addListener(OrderListener l) { listeners.add(l); }
    public void removeListener(OrderListener l) { listeners.remove(l); }

    public void placeOrder(Pizza pizza) {
        for (OrderListener l : listeners) l.onOrderPlaced(pizza);
    }
}

OrderService service = new OrderService();
service.addListener(p -> System.out.println("Kitchen: make " + p.getDescription()));
service.addListener(p -> System.out.println("Inventory: use dough"));
service.placeOrder(order);
```
