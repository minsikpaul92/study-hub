package ca.senecacollege.cafe.models;

/**
 * Model: one item on the cafe menu.
 * A model only knows its own data and rules. It never prints anything.
 */
public class MenuItem {

    private String id;
    private String name;
    private double price;

    public MenuItem(String id, String name, double price) {
        this.id = id;
        this.name = name;
        setPrice(price);
    }

    public String getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public double getPrice() {
        return price;
    }

    public void setPrice(double price) {
        if (price < 0) {
            throw new IllegalArgumentException("Price cannot be negative");
        }
        this.price = price;
    }

    @Override
    public String toString() {
        return String.format("%s %s ($%.2f)", id, name, price);
    }
}
