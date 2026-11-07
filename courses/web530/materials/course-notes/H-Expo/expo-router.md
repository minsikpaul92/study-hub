Source: <https://seneca-ictoer.github.io/WEB530/H-Expo/expo-router>

# Introduction to Expo Router

## What is Expo Router?

Expo Router is a powerful, file-based routing framework built on top of **React Navigation**. If you have ever used web frameworks like Next.js, Remix, or Nuxt, the concept will feel immediately familiar: **your file structure determines your application's navigation structure.**

Instead of writing hundreds of lines of boilerplate code to manually configure navigation containers, stacks, and screen listeners in JavaScript, you simply organize your files into directories. Expo Router automatically translates that directory structure into fully functioning native navigation paradigms for iOS and Android.

## Why Use Expo Router?

* **Screens are just files:** The directory path of your code file matches the screen's route.
* **Deep Linking by Default:** Because every screen has a distinct "URL path" under the hood, your app inherently supports deep linking (e.g., launching the app directly to a specific product page from a web link).
* **Native Performance:** While it uses file paths like a web browser, it renders **100% native platform components** underneath. It utilizes standard iOS and Android transitions, gestures, and animations.
* **Type Safety:** It can automatically generate TypeScript types for your routes, preventing broken links at compile time.

## Core Concepts & File Conventions

Expo Router relies on a dedicated directory at the root of your project named `app/`. Every file created inside this folder becomes a route.

To build complex mobile interfaces (like tab bars, headers, and slide-out menus), Expo Router uses specific naming conventions:

### 1. The Entry Point: `index.tsx`

A file named `index` represents the root or "homepage" of that specific directory level.

* `app/index.tsx` matches the root path `/` (the very first screen the user sees when opening the app).
* `app/settings/index.tsx` matches the path `/settings`.

### 2. Layout Files: `_layout.tsx`

Layout files are used to wrap around a collection of child screens. They allow you to define a shared user interface element—such as a **Native Stack Header** or a **Bottom Tab Bar**, that persists across multiple pages.

* A `_layout` file applies to every single sibling file and sub-folder within its directory.
* Inside a layout file, you render a `<Slot />` component (to simply pass through the current child screen) or specific structural components like `<Stack />` or `<Tabs />`.

### 3. Route Groups: `(directory-name)`

Sometimes you need to organize files into folders for shared layouts *without* altering the URL path. Parentheses tell Expo Router to completely ignore that folder name in the URL path.

* **Example:** A folder named `app/(auth)/login.tsx` maps to the path `/login` (the `(auth)` is ignored in the route).
* This allows you to easily separate your user experience into logical sections, such as `(auth)` for login screens and `(tabs)` for your main dashboard, giving each section its own isolated layout configuration.

### 4. Dynamic Routes: `[id].tsx`

To capture dynamic parameters (like an ID for an article or a user profile handle), wrap the filename in square brackets.

* `app/profile/[id].tsx` maps to `/profile/123` or `/profile/steve`.
* You can access that dynamic parameter inside the component using the `useLocalSearchParams()` hook.

## Structural Visualization: Layouts vs. Screens

To understand how individual files assemble into a real mobile app, look at how an `app/` folder translates to the visual hierarchy on a device screen:

### Example Directory Architecture

Here is what a typical, robust production app structure looks like using these conventions:

```
app/
├── _layout.tsx         # Global configurations (Themes, Global Context providers)
├── (auth)/             # Group for authentication screens
│   ├── _layout.tsx     # Stack layout (hides headers for login)
│   ├── login.tsx       # Maps to route: /login
│   └── register.tsx    # Maps to route: /register
├── (tabs)/             # Group for main application workflow
│   ├── _layout.tsx     # Bottom Tabs Layout configuration
│   ├── index.tsx       # Home Tab. Maps to route: /
│   └── explore.tsx     # Explore Tab. Maps to route: /explore
└── details/            # Standard sub-directory
    └── [id].tsx        # Dynamic Route. Maps to route: /details/42
```

## Setting Up Expo Router

1. Start VS Code.
2. Choose `File`, `Open Folder...`. It is recommended you choose an empty folder however you will create a new folder for your application in the next step.
3. Create a project with Router included: `npx create-expo-app@latest MyRouterApp --template tabs` (where `MyRouterApp` refers to the name of the application folder you want to create).

* `Ok to proceed? (y)` - You may be asked to install packages, press `y` or `ENTER` to install the packages and proceed.
* `Select an Expo SDK version` - Choose `For learning with Expo Go (SDK 54)`.
* The installation may take a minute or two to complete.

4. Move into the project folder: `cd MyRouterApp`.
5. Start the development server: `npx expo start --tunnel`.

* If asked, install `@expo/ngrok`.

⚠️ It is not uncommon to receive an error like:
`CommandError: Please install @expo/ngrok@^4.1.0 and try again`

💡If you receive the above message, try installing `ngrok` manually:
`npm install -g @expo/ngrok@4.1.0`
`npm install --save-dev @expo/ngrok@^4.1.0`

## Running Your New App

You can run your app in several ways:

* On your phone (recommended)
  + Install Expo Go from the App Store or Google Play
  + Scan the QR code from Expo Dev Tools
  + Your app loads instantly

On a simulator/emulator

* iOS Simulator (macOS only)
* Android Emulator (optional)

💡 If you receive an error that Expo Go needs to be updated on your device,
it may be that the version available in the store is outdated. You can manually
install the latest version by going to (<https://expo.dev/go>).

## Understanding the Default File Architecture

Open your project in VS Code. The default template structures your navigation files within the `app/` directory like this:

```
app/
├── (tabs)/             <-- Route Group for your main application screens
│   ├── _layout.tsx     <-- This file defines and configures the visual bottom tab bar.
│   ├── index.tsx       <-- Because this is named index, it acts as the default root path (/) for your application.
│   └── two.tsx         <-- This maps directly to the /two path. The _layout.tsx file hooks this up to show as the second icon on your bottom tab bar.
├── _layout.tsx         <-- Global Root Layout file.
├── +html.tsx           <-- Expo Router supports iOS, Android, and Web. This file is used strictly for web builds.
├── +not-found.tsx      <-- Custom fallback screen if a route does not exist
└── modal.tsx           <-- In the default template, usually configured to slide up from the bottom as a native modal overlay.
```

## Begin implementing a Product Shop application

### Configure Tabs

1. In the VS Code file explorer, expand the `app` folder, and then expand the `(tabs)` folder.
2. Right-click on `two.tsx` and select `Rename`.
3. Change the name to `settings.tsx` and press Enter.

💡 What just happened? Expo Router instantly changed your app's internal URL route from `/two` to `/settings`. If you were to look at your app right now, the second tab might throw an error or disappear because the layout file is still looking for the old path! Let's fix that.

4. Open `app/(tabs)/_layout.tsx`.
5. Look inside the file for the `<Tabs>` component. You will see a `<Tabs.Screen>` entry specifically configured for `two`.
6. Change the `name` property from `two` to `settings`.
7. Change the `title` property to `Settings` so the text under the icon looks correct on your screen.
8. Change the icon to display as a gear.

```
<Tabs.Screen
  name="settings"
  options={{
    title: 'Settings',
    tabBarIcon: ({ color }) => <TabBarIcon name="cog" color={color} />,
  }}
/>
```

9. Locate the `<Tabs.Screen>` entry where `name="index"`.
10. Update the `title` to `Products` and swap out the `tabBarIcon` for a shopping cart icon.

```
tabBarIcon: ({ color }) => <TabBarIcon name="shopping-cart" color={color} />;
```

### Update the Settings Screen

1. Open `app/(tabs)/settings.tsx`.
2. Overwrite the contents of the file with the following TypeScript.

* Change component name to `SettingsScreen`.
* Clean up the copy, so that our screen appears as a settings screen instead.

```
import { StyleSheet } from 'react-native';

import EditScreenInfo from '@/components/EditScreenInfo';
import { Text, View } from '@/components/Themed';

export default function SettingsScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Settings</Text>
      <View style={styles.separator} lightColor="#eee" darkColor="rgba(255,255,255,0.1)" />
      <EditScreenInfo path="app/(tabs)/settings.tsx" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: '80%',
  },
});
```

### Install Jotai and Configure a Product List

Let's install Jotai and configure it to store our 'hardcoded' product list.

1. Run the following command in your project terminal to install the package: `npm install jotai`.
2. It is a best practice to keep your state files separated from your UI view files. Create a dedicated folder and file for your global atoms.
3. In your project root, create a new folder named `store`.
4. Inside that folder, create a new file named `productsAtom.ts`.
5. Paste the following code into `/store/productsAtom.ts`.

```
import { atom } from 'jotai';

// Define a TypeScript interface for your product structure
export interface Product {
  id: string;
  name: string;
  price: number;
  description: string;
}

// Create a read-only atom containing your hardcoded list of products
export const productsAtom = atom<Product[]>([
  {
    id: '1',
    name: 'Wireless Noise-Canceling Headphones',
    price: 299.99,
    description: 'Immersive sound with premium comfort and long battery life.',
  },
  {
    id: '2',
    name: 'Mechanical Gaming Keyboard',
    price: 129.99,
    description: 'Tactile blue switches with customizable RGB backlighting.',
  },
  {
    id: '3',
    name: 'Ergonomic Wireless Mouse',
    price: 79.99,
    description: 'Precision tracking designed to reduce wrist strain during long sessions.',
  },
  {
    id: '4',
    name: 'Ultra-Wide 4K Monitor',
    price: 449.99,
    description: 'Stunning crystal-clear display perfect for multitasking and gaming.',
  },
]);
```

### Update Tab One - Make it the Product Shop

1. Open `app/(tabs)/index.tsx`.
2. Overwrite the contents of the file with the following TypeScript to hook up your Jotai store.

```
import { StyleSheet, Text, View, FlatList, TouchableOpacity } from 'react-native';
import { Link } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAtomValue } from 'jotai';
import { productsAtom } from '@/store/productsAtom';

export default function ShopScreen() {
  // Read the product list directly from your global Jotai store
  const products = useAtomValue(productsAtom);

  return (
    <SafeAreaView style={styles.container} edges={['left', 'right']}>
      <Text style={styles.heading}>Available Hardware</Text>

      <FlatList
        data={products}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          // Link navigates completely outside the tab directory to the product stack folder
          <Link href={`/product/${item.id}`} asChild>
            <TouchableOpacity style={styles.card}>
              <View style={styles.infoContainer}>
                <Text style={styles.prodName}>{item.name}</Text>
                {/* Dynamically formatting the numeric price from the atom */}
                <Text style={styles.prodPrice}>${item.price.toFixed(2)}</Text>
              </View>
              <Text style={styles.arrow}>View →</Text>
            </TouchableOpacity>
          </Link>
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingHorizontal: 16, backgroundColor: '#f5f5f7' },
  heading: {
    fontSize: 22,
    fontWeight: 'bold',
    marginTop: 16,
    marginBottom: 16,
    color: '#1c1c1e',
  },
  card: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    elevation: 1,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 4,
  },
  infoContainer: {
    flex: 1,
    paddingRight: 8,
  },
  prodName: { fontSize: 16, fontWeight: '600', color: '#1c1c1e' },
  prodPrice: { fontSize: 14, color: '#007AFF', marginTop: 4 },
  arrow: { color: '#8e8e93', fontWeight: 'bold' },
});
```

### Create the Dynamic Product Details Screen

To separate our detail view from our main navigation screens, we will create a dynamic route outside of the route group. This ensures the bottom tab bar hides when viewing a specific product.

1. Inside your `app/` directory, create a new folder named `product`.
2. Inside the `app/product/` folder, create a new file named `[id].tsx`.
3. Overwrite the contents of `app/product/[id].tsx` with the following code to hook it into the global Jotai atom state:

```
import { StyleSheet, Text, View } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { useAtomValue } from 'jotai';
import { productsAtom } from '@/store/productsAtom';

export default function ProductDetailsScreen() {
  // Capture the specific dynamic URL segment string parameter
  const { id } = useLocalSearchParams<{ id: string }>();

  // Fetch the full global product list from Jotai
  const products = useAtomValue(productsAtom);

  // Look up item data details from our global atom state
  const product = products.find((p) => p.id === id);

  if (!product) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Product Not Found</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.detailBox}>
        <Text style={styles.idBadge}>SKU Code: {product.id}</Text>
        <Text style={styles.title}>{product.name}</Text>
        <Text style={styles.price}>${product.price.toFixed(2)}</Text>
        <Text style={styles.description}>{product.description}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#f5f5f7', justifyContent: 'center' },
  detailBox: {
    backgroundColor: '#fff',
    padding: 24,
    borderRadius: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 4,
  },
  idBadge: {
    fontSize: 11,
    color: '#8e8e93',
    fontWeight: 'bold',
    marginBottom: 8,
    textTransform: 'uppercase',
  },
  title: { fontSize: 24, fontWeight: 'bold', color: '#1c1c1e', marginBottom: 6 },
  price: { fontSize: 20, fontWeight: '600', color: '#007AFF', marginBottom: 16 },
  description: { fontSize: 15, color: '#48484a', lineHeight: 22 },
  errorText: { fontSize: 18, color: '#ff3b30', textAlign: 'center' },
});
```

### Checkpoint & Architecture Review

At this point, your core application structure and data flow are fully functional:

* Two Distinct Tabs: A Products shop home screen and a Settings screen.
* Global State Management: Product data is safely lifted out of local UI components and centralized inside a Jotai atom.
* Dynamic Routing: Clicking any item in the `FlatList` reads its unique ID and redirects the user to a full-screen product breakdown.

However, if you interact with the application in its current state, you will notice two major navigation quirks that affect the user experience. Let's look at why they happen and how a Stack Navigator resolves them.

**Diagnosing the Core Navigation Issues**

```
Current Behavior (No Stack Container):
[Products Tab Grid] ──(Click Product)──> [Full Screen View]
                                         ↳ ❌ Bottom Tabs Hidden
                                         ↳ ❌ Header displays "product/[id]"
```

**Issue 1:** Header displays `product/[id]` instead of a clean title

* Why it happens: When you navigate to a screen that doesn’t have a layout configuration file wrapping it, Expo Router has to guess what to show at the top of the screen. Because it has no instructions, it falls back to displaying the literal file system path of that page `product/[id]`.
* The Fix: By wrapping the dynamic file inside a native layout containing a `<Stack>` component, we can explicitly declare options (like title: "Product Details") for that specific file name.

**Issue 2:** The bottom tab bar is completely hidden

* Why it happens: Right now, our `[id].tsx` file lives completely outside of the `(tabs)/` directory. Because it is a completely separate root-level folder, navigating to `/product/1` pushes the user entirely out of the Tab navigation context, making it impossible to switch back to Settings without hitting a back button.
* The Fix: To fix this, we can introduce an architecture called a `Tab-to-Stack` flow. Instead of placing the product details screen out on its own, we will nestedly wrap our Products tab inside a `Stack Navigator`. This way, when a user pushes a new screen onto the stack, it animates natively inside the tab interface, keeping the bottom tab bar visible.

**The Strategy: Implementing a Stack Navigator**
To clean this up, we are going to modify our file architecture. We will introduce a local `_layout.tsx` file to group our store views and handle screen titles dynamically.

Here is how our visual route tree will change:

```
Before (Loose Root Files):             After (Nested Stack Layout):
app/                                   app/
├── (tabs)/                            ├── (tabs)/
│   ├── index.tsx                      │   ├── _layout.tsx
│   └── settings.tsx                   │   ├── index.tsx  <-- (Nested Stack Start)
└── product/                           │   ├── [id].tsx   <-- (Pushed onto Stack)
    └── [id].tsx (Tabs hidden)         │   └── settings.tsx
```

## Resolving the Issues: Building a Tab-Nested Stack

To ensure that our product details screen preserves the bottom tab bar and displays a clean native header, we must restructure our folder tree. We will remove the root-level `product/` directory and nest a dynamic stack directly inside the first tab.

### Step 1: Restructure Your Directories

1. Inside `app/(tabs)/`, create a new folder named `products`.
2. Move your existing `app/(tabs)/index.tsx` file *into* this new `app/(tabs)/products/` folder.
3. Move your existing `app/product/[id].tsx` file *into* this new `app/(tabs)/products/` folder.
4. Delete the now-empty, root-level `app/product/` folder.

Your updated `app/(tabs)/` directory should now look exactly like this:

```
app/
└── (tabs)/
├── products/          <-- The nested Stack container folder
│   ├── index.tsx      <-- The product list grid (Main tab screen)
│   └── [id].tsx       <-- Dynamic product details (Pushes onto stack)
├── _layout.tsx        <-- The global tab bar controller
└── settings.tsx       <-- Standalone settings tab screen
```

### Step 2: Create the Products Stack Layout

Now we need to define a local sub-layout file inside the `products/` folder. This configures the Stack Navigator to handle headers and back-navigation within this specific tab.

1. Inside `app/(tabs)/products/`, create a new file named `_layout.tsx`.
2. Paste the following code into it:

```
import { Stack } from 'expo-router';

export default function ProductsLayout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: '#fff' },
        headerTintColor: '#007AFF',
        headerTitleStyle: { fontWeight: 'bold' },
      }}
    >
      {/* The main product list screen header */}
      <Stack.Screen name="index" options={{ title: 'Hardware Shop' }} />
      {/* The dynamic detail view screen header */}
      <Stack.Screen name="[id]" options={{ title: 'Product Details' }} />
    </Stack>
  );
}
```

### Step 3: Update the Root Tabs Layout

Because we moved the root profile components into a subfolder, we must update our main tab controller file `app/(tabs)/_layout.tsx` so it targets the new folder directory name instead of the raw index file.

1. Open `app/(tabs)/_layout.tsx`.
2. Locate the first `<Tabs.Screen>` entry where `name="index"`.
3. Change the `name` property from "index" to "products".

Your updated tab configuration block should look like this:

```
<Tabs.Screen
  name="products" // <-- Target the folder name instead of index
  options={{
    title: 'Products',
    headerShown: false, // Hides the outer tab header to prevent double-headers!
    tabBarIcon: ({ color }) => (
      <SymbolView
        name={{
          ios: 'cart.fill',
          android: 'shopping_cart',
          web: 'shopping-cart',
        }}
        tintColor={color}
        size={28}
      />
    ),
  }}
/>
```

### Step 4: Fix Relative Links

Finally, we need to update the navigation link inside our product list grid file. Because `index.tsx` and `[id].tsx` are now sibling files residing in the exact same directory, the path context becomes direct.

1. Open `app/(tabs)/products/index.tsx`.
2. Locate the `<Link>` component wrapping your `TouchableOpacity` card.
3. Change the explicit root path link from `href={"/product/" + item.id}` to a dynamic, localized route template:

```
<Link href={`/products/${item.id}`} asChild>
```

Save all open files and press `r` in your terminal to clear the caching bundle.

## Summary: What You Learned

Here is a summary of the core concepts, tools, and structural patterns you mastered in this lesson:

### 1. File-Based Routing with Expo Router

* **Directory Layouts:** You learned that the file tree directly translates into application screens. Folders wrap logical scopes, files represent separate rendering targets, and components like `_layout.tsx` orchestrate contextual layouts across directories.
* **Route Groups `(tabs)`:** You leveraged parentheses to organically group code for structural clarity without affecting the app's clean URL matching patterns.

### 2. State Splitting with Jotai

* **Centralized Store:** You moved away from brittle local arrays inside screen layouts and decoupled the business logic.
* **Atomic Architecture:** By using **Atoms**, you discovered a lightweight state layer that efficiently streams structured types across multiple UI components (such as a multi-item grid list and an isolated detail card view).

### 3. Dynamic Screen Rendering

* **Variable Segments `[id].tsx`:** You configured dynamic param matching using brackets. This enables a single file layout to act as a placeholder, reading matching parameters straight from the router context (`useLocalSearchParams`).

### 4. Advanced Tab-to-Stack Architecture

* **Layout Isolation:** You learned how loose, directory-separate screens break out of the tab viewer, hiding global core UI components.
* **Nested Stacks:** By nesting a `<Stack>` navigator inside a single `<Tabs.Screen>` group folder, you completed an industry-standard navigation flow. This layout allows detail pages to natively animate, handles clean window titles, establishes system-provided back links, and preserves the visibility of the primary tab navigation bar at all times.
