package ca.senecacollege.cafe.app;

import ca.senecacollege.cafe.controllers.CafeController;
import ca.senecacollege.cafe.models.MenuItem;
import ca.senecacollege.cafe.views.CafeView;

/**
 * Entry point. Its only job is to create M, V, C and connect them.
 */
public class CafeApp {

    public static void main(String[] args) {
        // Model data
        MenuItem[] menu = {
                new MenuItem("C01", "Americano", 3.50),
                new MenuItem("C02", "Cafe Latte", 4.75),
                new MenuItem("T01", "Green Tea", 3.25),
                new MenuItem("D01", "Cheesecake", 5.95)
        };

        // View
        CafeView view = new CafeView();

        // Controller gets the model and the view
        CafeController controller = new CafeController(menu, view);
        controller.run();
    }
}
