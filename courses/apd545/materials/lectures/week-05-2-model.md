Source: <APD545 Week 5 · Segment 2 "Model Classes for the GUI" 강의 슬라이드 (Mahboob Ali, Seneca) 핵심 문장 발췌>
# Week 5 · Segment 2. Preparing Model Classes

## What is the model?

> To finalize our model classes, we should decide what kinds of methods should be **publicly available** so that the user interface can access, modify and manipulate the model. To figure out the model, understand what "lies beneath" the user interface. What is it that we are displaying and changing? It is the **list of items**.

## ItemList

```java
public class ItemList {
    public final int MAXIMUM_SIZE = 100;
    private String[] items;
    private int size;

    public ItemList() {
        items = new String[MAXIMUM_SIZE];
        size = 0;
    }

    public int getSize() { return size; }
    public String[] getItems() { return items; }
}
```

## add and remove

```java
public void add(String item) {
    if (size < MAXIMUM_SIZE) items[size++] = item;
}

public void remove(int index) {
    if ((index >= 0) && (index < size)) {
        for (int i = index; i < size - 1; i++) items[i] = items[i + 1];
        size--;
    }
}
```

## Test the model

> Once we have the model implemented with useful methods, it is always a good idea to **test it**! Add a few items, remove one, remove too many and add too many.

```java
ItemList groceryList = new ItemList();
groceryList.add("Apples");
groceryList.add("Oranges");
groceryList.add("Bananas");
groceryList.remove(0);                       // Oranges, Bananas
for (int i = 0; i < 4; i++) groceryList.remove(0);   // too many: size stays 0
for (int i = 0; i < 200; i++) groceryList.add("Item# " + i);
System.out.println(groceryList.getSize());   // 100
```
