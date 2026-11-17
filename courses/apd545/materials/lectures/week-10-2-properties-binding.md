Source: <APD545 Week 10 · Segment 2 "Properties and Binding" 강의 슬라이드 (Mahboob Ali, Seneca) 핵심 문장 발췌>
# Week 10 · Segment 2. Properties and Binding

## Introduction

> Properties are **wrapper objects** for JavaFX-based object attributes such as String or Integer. They allow developers to add **listener** code to respond when the wrapped value has changed or is flagged as invalid. Property objects can be **bound** to one another. Properties let you wire your scene so that the view updates automatically whenever you modify the data behind it.

## Read/Writable Properties

```java
StringProperty password = new SimpleStringProperty("password1");
password.set("1234");
System.out.println("Modified StringProperty " + password.get());   // 1234
```

## Read-Only Properties

> Instantiate a read-only wrapper class, then invoke `getReadOnlyProperty()` to return a true read-only property object.

```java
ReadOnlyStringWrapper userName = new ReadOnlyStringWrapper("jamestkirk");
ReadOnlyStringProperty readOnlyUserName = userName.getReadOnlyProperty();
```

## Creating a property

> Simple classes: `SimpleBooleanProperty, SimpleDoubleProperty, SimpleIntegerProperty, SimpleStringProperty, SimpleObjectProperty, SimpleListProperty, ...`. Without an initial value they default to 0, false, "" or an empty collection. They can also be created with a **bean** (owner object) and a **name**.
>
> All JavaFX properties can: 1. listen for changes, 2. bind, 3. get and set.

## JavaFX Java Bean: Example

```java
public class User {
    private final ReadOnlyStringWrapper userName =
        new ReadOnlyStringWrapper(this, "userName", System.getProperty("user.name"));
    private final StringProperty password = new SimpleStringProperty(this, "password", "");

    public final String getUserName() { return userName.get(); }
    public ReadOnlyStringProperty userNameProperty() { return userName.getReadOnlyProperty(); }

    public final String getPassword() { return password.get(); }
    public final void setPassword(String p) { password.set(p); }
    public StringProperty passwordProperty() { return password; }
}
```

## Listeners

> `addListener()` accepts two types of functional interfaces: **ChangeListener** and **InvalidationListener**. Clean up listeners with `removeListener()` by passing a referenced (named) listener.

```java
SimpleIntegerProperty xProperty = new SimpleIntegerProperty(0);

xProperty.addListener((Observable o) -> {
    // invalidated: value may have changed
});

xProperty.addListener((ObservableValue<? extends Number> ov, Number oldVal, Number newVal) -> {
    // changed: we get the old and the new value
});
```

## Change vs Invalidation Listeners

> A ChangeListener gets the ObservableValue, the **old value, and the new value**. An InvalidationListener only gets the Observable. Invalidation marks values as invalid but does **not recompute** until needed (lazy), useful in layouts. ChangeListener is used for **eager** evaluation such as validation on a form.

## Binding

> Binding means at least two values being synchronized: when a dependent variable changes, the other variable changes. Behind the scenes, binding is a specific use-case of change-listening.

## One-directional binding

```java
StringProperty sourceProperty = new SimpleStringProperty("First Value");
StringProperty targetProperty = new SimpleStringProperty("Second Value");
targetProperty.bind(sourceProperty);
```

> The target listens to the source. If already bound, the old binding is replaced. A null argument throws NullPointerException. The current value of the target is lost (immediately copied from the source).

## Two-directional binding

```java
targetProperty.bindBidirectional(sourceProperty);
```

> After a bidirectional binding, **both properties will have the value of the property passed as an argument** (the source property).

## Intermediate binding techniques

> Three ways: the **Fluent API** (`myProperty.multiply(2)`), the **Bindings API** (`Bindings.add(a, b)`), the **Low-Level API** (custom `DoubleBinding`).

## Fluent API

```java
StringProperty sourceProperty = new SimpleStringProperty("It doesn't matter how slowly you go");
StringProperty targetProperty = new SimpleStringProperty("");
targetProperty.bind(sourceProperty.concat(" as long as you don't stop"));

DoubleProperty degrees = new SimpleDoubleProperty(180);
DoubleProperty radians = new SimpleDoubleProperty();
radians.bind(degrees.multiply(Math.PI).divide(180));
```

## The Bindings API

> A utility class with 249 methods. Operations on values (add, subtract, multiply, divide, min/max, comparisons, string formatting), on collections (bindContent, valueAt, size, isEmpty), and others (and, or, not, when). For subtract and divide, the **order** of arguments matters.

```java
NumberBinding total = Bindings.add(priceA, priceB);
Bindings.bindContent(plainList, observableList);
```

## Low-Level Binding

> Create a Binding object yourself; only override **computeValue()**. Bind the sources in an initialization block.

```java
DoubleProperty cost = new SimpleDoubleProperty(25);
IntegerProperty itemCount = new SimpleIntegerProperty(15);

DoubleBinding totalCost = new DoubleBinding() {
    { super.bind(cost, itemCount); }
    @Override
    protected double computeValue() {
        return itemCount.get() * cost.get();
    }
};
```
