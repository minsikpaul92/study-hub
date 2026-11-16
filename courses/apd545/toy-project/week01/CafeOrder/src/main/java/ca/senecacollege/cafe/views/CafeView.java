package ca.senecacollege.cafe.views;

import ca.senecacollege.cafe.models.MenuItem;

import java.util.Scanner;

/**
 * View: everything the user sees (output) and types (input).
 * The view does NOT calculate anything. It only shows what the controller gives it.
 */
public class CafeView {

    private final Scanner scanner = new Scanner(System.in);

    public void showWelcome() {
        System.out.println("==============================");
        System.out.println("   Welcome to Cafe Order!");
        System.out.println("==============================");
    }

    public void showMenu(MenuItem[] menu) {
        System.out.println();
        System.out.println("---------- MENU ----------");
        for (int i = 0; i < menu.length; i++) {
            System.out.printf("%d. %-15s $%5.2f%n", i + 1, menu[i].getName(), menu[i].getPrice());
        }
        System.out.println("0. Finish order");
        System.out.println("--------------------------");
    }

    public int askMenuNumber() {
        return readInt("Choose a menu number: ");
    }

    public int askQuantity() {
        return readInt("How many? ");
    }

    public void showAdded(String name, int quantity, double runningTotal) {
        System.out.printf("Added %d x %s. Current total: $%.2f%n", quantity, name, runningTotal);
    }

    public void showReceiptLine(String name, int quantity, double lineTotal) {
        System.out.printf("%-15s x%-3d $%6.2f%n", name, quantity, lineTotal);
    }

    public void showReceiptHeader() {
        System.out.println();
        System.out.println("========= RECEIPT =========");
    }

    public void showReceiptFooter(double subtotal, double tax, double total) {
        System.out.println("---------------------------");
        System.out.printf("Subtotal            $%6.2f%n", subtotal);
        System.out.printf("Tax (13%%)           $%6.2f%n", tax);
        System.out.printf("TOTAL               $%6.2f%n", total);
        System.out.println("===========================");
    }

    public void showMessage(String message) {
        System.out.println(message);
    }

    public void showError(String message) {
        System.out.println("[!] " + message);
    }

    /** Keeps asking until the user types a whole number. */
    private int readInt(String prompt) {
        while (true) {
            System.out.print(prompt);
            String line = scanner.nextLine().trim();
            try {
                return Integer.parseInt(line);
            } catch (NumberFormatException e) {
                showError("Please type a number.");
            }
        }
    }
}
