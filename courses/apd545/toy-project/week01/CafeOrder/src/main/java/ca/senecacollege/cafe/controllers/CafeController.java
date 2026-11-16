package ca.senecacollege.cafe.controllers;

import ca.senecacollege.cafe.models.MenuItem;
import ca.senecacollege.cafe.views.CafeView;

/**
 * Controller: the middle person.
 * It takes input from the view, changes the model data, and tells the view what to show.
 */
public class CafeController {

    private static final double TAX_RATE = 0.13; // Ontario HST

    private final MenuItem[] menu;
    private final CafeView view;

    // quantities[i] = how many of menu[i] the customer ordered (Week 3 will replace this with a Map)
    private final int[] quantities;

    public CafeController(MenuItem[] menu, CafeView view) {
        this.menu = menu;
        this.view = view;
        this.quantities = new int[menu.length];
    }

    /** Main loop: show menu, take orders, until the user chooses 0. */
    public void run() {
        view.showWelcome();
        boolean ordering = true;
        while (ordering) {
            view.showMenu(menu);
            int choice = view.askMenuNumber();
            if (choice == 0) {
                ordering = false;
            } else if (choice < 1 || choice > menu.length) {
                view.showError("No such menu number: " + choice);
            } else {
                addItem(choice - 1);
            }
        }
        printReceipt();
    }

    private void addItem(int index) {
        int qty = view.askQuantity();
        if (qty <= 0) {
            view.showError("Quantity must be at least 1.");
            return;
        }
        quantities[index] += qty;
        view.showAdded(menu[index].getName(), qty, calculateSubtotal());
    }

    public double calculateSubtotal() {
        double subtotal = 0;
        for (int i = 0; i < menu.length; i++) {
            subtotal += menu[i].getPrice() * quantities[i];
        }
        return subtotal;
    }

    private void printReceipt() {
        double subtotal = calculateSubtotal();
        if (subtotal == 0) {
            view.showMessage("No items ordered. Bye!");
            return;
        }
        view.showReceiptHeader();
        for (int i = 0; i < menu.length; i++) {
            if (quantities[i] > 0) {
                view.showReceiptLine(menu[i].getName(), quantities[i], menu[i].getPrice() * quantities[i]);
            }
        }
        double tax = subtotal * TAX_RATE;
        view.showReceiptFooter(subtotal, tax, subtotal + tax);
    }
}
