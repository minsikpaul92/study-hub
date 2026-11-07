Source: <https://seneca-ictoer.github.io/WEB530/D-Navigation/navigating>

# Navigating Between Screens

## Testing Navigation in Snack

Every example on this page has an **Example** panel under it, and some also show a screenshot of the output. Press **Run this example** to open the code in Expo Snack, where you can change it and watch the result update. The preview shows the web version of the app; switch to **iOS** or **Android** in the preview, or choose **My Device** and scan the QR code with Expo Go, to try it on a phone.

To try the examples in your own Snack, replace the contents of the package.json file with the following.

*package.json*

```
{
  "dependencies": {
    "@react-navigation/native": "^7.0.0",
    "@react-navigation/native-stack": "^7.0.0",
    "@react-navigation/bottom-tabs": "^7.0.0",
    "@react-navigation/drawer": "^7.0.0",
    "react-native-screens": "~4.16.0",
    "react-native-safe-area-context": "~5.6.0",
    "react-native-gesture-handler": "~2.28.0",
    "react-native-reanimated": "~4.1.1",
    "react-native-worklets": "0.5.1",
    "@expo/vector-icons": "^15.0.3"
  }
}
```

The `@react-navigation` packages are pinned to version 7, which these notes are written for. The other packages are native modules (and the icon set used by the tab examples), and their versions must match the Expo SDK your Snack uses. The versions above match SDK 54, Snack's default. If you switch SDKs, Snack will flag any version that doesn't match.

## Introduction to Navigation

Most apps have more than one screen, so they need a way to move between them. A web browser gives you this for free: every page has a URL, and the back button walks through a history of pages. React Native has nothing like it built in. Apps still need screens, transitions between them, a history to go back through, and often **deep linking** (opening the app directly on a specific screen, for example from a notification).

The community standard for this is the **React Navigation** library. It provides stack, tab and drawer navigators, deep linking, and typed route params for TypeScript. Let's start off with an example.

```
import { View, Text, Button } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

const Stack = createNativeStackNavigator();

function Home({ navigation }) {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>Home Screen</Text>
      <Button title="Go to Settings" onPress={() => navigation.navigate('Settings')} />
    </View>
  );
}

function Settings({ navigation }) {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>Settings Screen</Text>
      <Button title="Go Back Home" onPress={() => navigation.goBack()} />
    </View>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="Home" component={Home} />
        <Stack.Screen name="Settings" component={Settings} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
```

Exampleruns in Expo Snack

![Intro to Navigation](https://seneca-ictoer.github.io/WEB530/assets/images/intro-nav-bc09d90ea699ef5c0f38079dcd15ede5.png)

To interact with it, run the code in Snack, where you can also edit it.

In earlier React examples, we typically returned JSX directly from a single component. With React Navigation, we define a navigation tree instead. We create a stack navigator with `createNativeStackNavigator()` and wrap it in a `NavigationContainer`, which manages the navigation state for the whole app.

A stack navigator works like a deck of cards. Each new screen is **pushed** on top of the stack, and going back **pops** it off to reveal the one underneath.

Each screen is a normal React component registered with `<Stack.Screen name="Home" component={Home} />`. The name prop defines the route name, and React Navigation automatically passes a navigation prop to each screen component. We call `navigation.navigate('Settings')` to move to another screen and `navigation.goBack()` to return; the navigator handles showing and hiding screens and managing the back stack for us.

When the app starts, the screen named by `initialRouteName` (in this case, "Home") is shown. Without it, the navigator starts on the first screen listed. Navigating to "Settings" pushes a new screen onto the stack, and going back pops it off. The header bar and platform back behavior (including Android’s system back button) are handled automatically by the navigator.

### **Passing data between screens**

In the previous example, each screen was independent. In real apps, screens often need to share information. For example, in a shopping app, tapping an item in a list should navigate to a details screen and show information about that specific item.

React Navigation makes this straightforward. When calling `navigation.navigate()`, you can pass a JavaScript object as the second argument. The destination screen receives this data through the `route` prop.

```
import { View, Text, Button } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

const Stack = createNativeStackNavigator();

function ItemList({ navigation }) {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>Item List</Text>

      <Button
        title="First Item"
        onPress={() => navigation.navigate('Details', { title: 'First Item' })}
      />

      <Button
        title="Second Item"
        onPress={() => navigation.navigate('Details', { title: 'Second Item' })}
      />

      <Button
        title="Third Item"
        onPress={() => navigation.navigate('Details', { title: 'Third Item' })}
      />
    </View>
  );
}

function Details({ route }) {
  // route.params contains the object passed from navigate()
  const { title = 'Unknown Item' } = route.params ?? {};

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>Details: {title}</Text>
    </View>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="ItemList">
        <Stack.Screen name="ItemList" component={ItemList} />
        <Stack.Screen name="Details" component={Details} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
```

Exampleruns in Expo Snack

![Pass Properties in Navigation](https://seneca-ictoer.github.io/WEB530/assets/images/pass-prop-nav-8bdcec4dc737e93bd60d2c7decdaacd7.png)

To interact with it, run the code in Snack, where you can also edit it.

Always treat params as optional. If a screen is opened without them (for example, as the initial route or from a deep link), `route.params` is `undefined`, and destructuring it would crash the app. Writing `route.params ?? {}` falls back to an empty object, and `title = 'Unknown Item'` gives the value a default.

### **Customizing navigation header bars**

The default navigation headers you’ve seen so far are fairly simple; they show the route name and a back button. React Navigation allows you to customize these headers so they better match the content of each screen.

In this example, we’ll pass item data to a details screen and use that data to customize the header title and add a “Buy” button to the header bar.

```
import { View, Text, Button } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

const Stack = createNativeStackNavigator();

function ItemList({ navigation }) {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>Item List</Text>

      <Button
        title="First Item"
        onPress={() =>
          navigation.navigate('Details', {
            title: 'First Item',
            desc: 'First item description',
            qtyAvail: 5,
          })
        }
      />

      <Button
        title="Second Item"
        onPress={() =>
          navigation.navigate('Details', {
            title: 'Second Item',
            desc: 'Second item description',
            qtyAvail: 0,
          })
        }
      />

      <Button
        title="Third Item"
        onPress={() =>
          navigation.navigate('Details', {
            title: 'Third Item',
            desc: 'Third item description',
            qtyAvail: 15,
          })
        }
      />
    </View>
  );
}

function Details({ route }) {
  const { desc = 'No description' } = route.params ?? {};

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>Description: {desc}</Text>
    </View>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="ItemList">
        <Stack.Screen name="ItemList" component={ItemList} />

        <Stack.Screen
          name="Details"
          component={Details}
          options={({ route }) => ({
            title: route.params?.title ?? 'Details',
            headerRight: () => (
              <Button
                title="Buy"
                onPress={() => {}}
                disabled={(route.params?.qtyAvail ?? 0) === 0}
              />
            ),
          })}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
```

Exampleruns in Expo Snack

![Custom Headers in Navigation](https://seneca-ictoer.github.io/WEB530/assets/images/custom-header-nav-b8a8aabafd41b3297562bb834d76e9e5.png)

To interact with it, run the code in Snack, where you can also edit it.

The `ItemList` screen passes several pieces of data to the `Details` screen using `navigation.navigate('Details', { ... })`. These values become available on the destination screen through the `route.params` object, which is how React Navigation exposes parameters. Because the header is configured inside the `<Stack.Screen>` definition, we can customize it using the `options` prop and access the same route parameters there. This allows the header title to reflect the selected item’s name and enables us to add a “Buy” button directly in the header bar. The button’s disabled state is also driven by the passed-in data; if `qtyAvail` is `0`, the button appears disabled. This approach keeps the screen component itself simple while letting the navigation layer dynamically adjust the header based on the item the user selected.

### **Updating params**

A screen can also change its own params with `navigation.setParams()`. Anything that reads those params, including the header options, updates automatically.

```
import { View, Text, Button } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

const Stack = createNativeStackNavigator();

function Home({ navigation }) {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Button
        title="Open Widget"
        onPress={() => navigation.navigate('Details', { title: 'Widget' })}
      />
    </View>
  );
}

function Details({ navigation, route }) {
  const { title = 'Unknown Item' } = route.params ?? {};

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>Editing: {title}</Text>
      <Button
        title="Rename to Super Widget"
        onPress={() => navigation.setParams({ title: 'Super Widget' })}
      />
    </View>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Home" component={Home} />
        <Stack.Screen
          name="Details"
          component={Details}
          options={({ route }) => ({ title: route.params?.title ?? 'Details' })}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
```

Exampleruns in Expo Snack

Opens the code in Snack, where you can edit it and see the result.

`setParams()` merges the new values into the existing params, so any params you don't mention keep their values.

### **Moving through the stack**

`navigate()` and `goBack()` cover most apps, but a stack navigator has a few more ways to move around:

| Method | What it does |
| --- | --- |
| `navigation.navigate('Name')` | Stays put if that screen is already focused (only its params update); otherwise pushes it |
| `navigation.push('Name')` | Always pushes a new copy of the screen, even if one is already focused, which suits drill-down flows |
| `navigation.goBack()` | Pops the current screen and returns to the previous one |
| `navigation.popTo('Name')` | Pops screens until the named screen is on top |
| `navigation.popToTop()` | Pops everything and returns to the first screen in the stack, for example after logging out |

Try each button below and watch the back arrow in the header. Pressing **Navigate to next level** only changes the level number, while **Push next level** adds a new screen you have to go back through.

```
import { View, Text, Button } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

const Stack = createNativeStackNavigator();

function Home({ navigation }) {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>Home Screen</Text>
      <Button title="Open Level 1" onPress={() => navigation.navigate('Level', { depth: 1 })} />
    </View>
  );
}

function Level({ navigation, route }) {
  const { depth = 1 } = route.params ?? {};

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', gap: 8 }}>
      <Text>Level {depth}</Text>
      <Button
        title="Navigate to next level"
        onPress={() => navigation.navigate('Level', { depth: depth + 1 })}
      />
      <Button
        title="Push next level"
        onPress={() => navigation.push('Level', { depth: depth + 1 })}
      />
      <Button title="Go back" onPress={() => navigation.goBack()} />
      <Button title="Pop to Home" onPress={() => navigation.popTo('Home')} />
      <Button title="Pop to top" onPress={() => navigation.popToTop()} />
    </View>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Home" component={Home} />
        <Stack.Screen name="Level" component={Level} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
```

Exampleruns in Expo Snack

Opens the code in Snack, where you can edit it and see the result.

Be careful using `navigate()` to return to a screen further down the stack. If Home is below the current screen, `navigation.navigate('Home')` does not go back to it; it pushes a second Home on top. Use `goBack()` or `popTo('Home')` instead.

### **The useNavigation hook**

Only screens registered with a navigator receive the `navigation` prop. A component nested inside a screen, such as a reusable button, can get the same object from the `useNavigation()` hook.

```
import { View, Text, Button } from 'react-native';
import { NavigationContainer, useNavigation } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

const Stack = createNativeStackNavigator();

// Not a screen, so it doesn't receive a navigation prop
function ProfileButton() {
  const navigation = useNavigation();

  return <Button title="View Profile" onPress={() => navigation.navigate('Profile')} />;
}

function Home() {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>Home Screen</Text>
      <ProfileButton />
    </View>
  );
}

function Profile() {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>Profile Screen</Text>
    </View>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Home" component={Home} />
        <Stack.Screen name="Profile" component={Profile} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
```

Exampleruns in Expo Snack

Opens the code in Snack, where you can edit it and see the result.

Without the hook, `Home` would have to pass its `navigation` prop down to `ProfileButton`, and to every other component in between that needs it.

### **Tab and drawer navigators**

So far, we’ve used a stack navigator and buttons to move between screens. React Navigation also provides other navigator types, such as bottom tabs and drawers, which are common patterns in mobile apps. Tabs are often used for top‑level sections of an app, while drawers provide a slide‑out menu, though both can be used on any platform.

In this example, we’ll use `Platform.select()` to choose a different navigator depending on the device. On iOS, we’ll show a bottom tab navigator; on Android, a drawer navigator; and on any other platform, we’ll fall back to a stack navigator. This isn’t a requirement (tabs and drawers work everywhere), but it’s a useful way to demonstrate how `Platform.select()` can dynamically change UI behavior.

```
import { View, Text, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createDrawerNavigator } from '@react-navigation/drawer';

function Home() {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>Home Content</Text>
    </View>
  );
}

function Settings() {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>Settings Content</Text>
    </View>
  );
}

const Stack = createNativeStackNavigator();
const Tabs = createBottomTabNavigator();
const Drawer = createDrawerNavigator();

// Choose a navigator based on the platform
const Navigator = Platform.select({
  ios: () => (
    <Tabs.Navigator>
      <Tabs.Screen
        name="Home"
        component={Home}
        options={{
          tabBarIcon: ({ color, size }) => <Ionicons name="home" color={color} size={size} />,
        }}
      />
      <Tabs.Screen
        name="Settings"
        component={Settings}
        options={{
          tabBarIcon: ({ color, size }) => <Ionicons name="settings" color={color} size={size} />,
        }}
      />
    </Tabs.Navigator>
  ),
  android: () => (
    <Drawer.Navigator>
      <Drawer.Screen name="Home" component={Home} />
      <Drawer.Screen name="Settings" component={Settings} />
    </Drawer.Navigator>
  ),
  default: () => (
    <Stack.Navigator initialRouteName="Home">
      <Stack.Screen name="Home" component={Home} />
      <Stack.Screen name="Settings" component={Settings} />
    </Stack.Navigator>
  ),
});

export default function App() {
  return <NavigationContainer>{Navigator()}</NavigationContainer>;
}
```

Exampleruns in Expo Snack

Opens the code in Snack, where you can edit it and see the result.

This example shows how different navigator types can be swapped in depending on the platform. When you run it, the preview starts on Web, so it shows the stack. Switch the preview to iOS to see the tabs, or to Android to see the drawer.

Each tab sets the `tabBarIcon` option to draw its icon. It is a function that receives the `color` and `size` the tab bar wants, so the icon changes colour when its tab is selected. Without it, the tab bar shows a placeholder symbol. The icons come from `@expo/vector-icons`, which is included in every Expo project.

All three navigators follow the same pattern. Each has its own creation function (`createNativeStackNavigator()`, `createBottomTabNavigator()` and `createDrawerNavigator()`), each uses the same `<X.Navigator>` and `<X.Screen>` JSX, and the screens inside them use the same `navigation` and `route` props. Navigators differ in how they look and behave, not in how you write screens.

### **Nesting navigators**

Real apps almost always use more than one navigator: for example, a stack for signing in, tabs for the main sections of the app, and a drawer for settings. They are combined by nesting one navigator inside a screen of another. Common patterns include:

* **Stack → Tabs:** tabs inside a stack, so detail screens open over the tab bar.
* **Tabs → Stack:** each tab has its own stack of screens.
* **Drawer → Tabs → Stack:** very common in large apps.
* **Stack → Drawer:** the drawer only appears after the user logs in.

The example below uses the first pattern. The tabs are the app's main sections, and detail screens pushed on the stack open over the tab bar.

```
import { View, Text, Button } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

const Stack = createNativeStackNavigator();
const Tabs = createBottomTabNavigator();

function Feed({ navigation }) {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>Feed</Text>
      <Button title="Open Post" onPress={() => navigation.navigate('Post')} />
    </View>
  );
}

function Account() {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>Account</Text>
    </View>
  );
}

function Post({ navigation }) {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>Post Details</Text>
      <Button
        title="Go to the Account tab"
        onPress={() => navigation.popTo('Main', { screen: 'Account' })}
      />
    </View>
  );
}

// The tab navigator is itself a screen in the stack below
function MainTabs() {
  return (
    <Tabs.Navigator>
      <Tabs.Screen
        name="Feed"
        component={Feed}
        options={{
          tabBarIcon: ({ color, size }) => <Ionicons name="newspaper" color={color} size={size} />,
        }}
      />
      <Tabs.Screen
        name="Account"
        component={Account}
        options={{
          tabBarIcon: ({ color, size }) => <Ionicons name="person" color={color} size={size} />,
        }}
      />
    </Tabs.Navigator>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Main" component={MainTabs} options={{ headerShown: false }} />
        <Stack.Screen name="Post" component={Post} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
```

Exampleruns in Expo Snack

Opens the code in Snack, where you can edit it and see the result.

Each navigator manages its own history, and screens inside any navigator receive the same `navigation` and `route` props. When `Feed` calls `navigation.navigate('Post')`, the tab navigator doesn't have a `Post` screen, so the action passes up to the parent stack, which pushes `Post` over the tabs.

Going the other way needs one extra step. `Post` can't call `navigation.navigate('Account')`, because `Account` lives inside the nested tab navigator, and React Navigation only looks in the current navigator and its parents. Instead, name the parent screen first and the nested screen second: `navigation.popTo('Main', { screen: 'Account' })`.

It uses `popTo()` rather than `navigate()` because `Main` is below `Post` in the stack. This is the same trap as going back with `navigate()`: `navigation.navigate('Main', { screen: 'Account' })` looks like it works, but it pushes a second copy of the tabs on top of `Post`. There is no back arrow to reveal the mistake, because `Main` hides its header, and on Android the back button returns to `Post` instead of leaving the app. `popTo()` goes back to the existing `Main` and then selects the `Account` tab.

The second pattern turns this inside out. The tabs are the parent, and one tab holds a stack. The tab bar stays visible on every screen, including the ones the stack pushes, which is how most apps with a bottom tab bar behave.

```
import { View, Text, Button } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

const Stack = createNativeStackNavigator();
const Tabs = createBottomTabNavigator();

function Inbox({ navigation }) {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>Inbox</Text>
      <Button
        title="Open thread with Sam"
        onPress={() => navigation.navigate('Thread', { from: 'Sam' })}
      />
    </View>
  );
}

function Thread({ route }) {
  const { from = 'Unknown' } = route.params ?? {};

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>Thread with {from}</Text>
    </View>
  );
}

function Contacts({ navigation }) {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>Contacts</Text>
      <Button
        title="Message Sam"
        onPress={() =>
          navigation.navigate('Messages', { screen: 'Thread', params: { from: 'Sam' } })
        }
      />
    </View>
  );
}

// The stack is itself a screen in the tab navigator below
function MessagesStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Inbox" component={Inbox} />
      <Stack.Screen
        name="Thread"
        component={Thread}
        options={({ route }) => ({ title: route.params?.from ?? 'Thread' })}
      />
    </Stack.Navigator>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <Tabs.Navigator>
        <Tabs.Screen
          name="Messages"
          component={MessagesStack}
          options={{
            headerShown: false,
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="chatbubbles" color={color} size={size} />
            ),
          }}
        />
        <Tabs.Screen
          name="Contacts"
          component={Contacts}
          options={{
            tabBarIcon: ({ color, size }) => <Ionicons name="people" color={color} size={size} />,
          }}
        />
      </Tabs.Navigator>
    </NavigationContainer>
  );
}
```

Exampleruns in Expo Snack

Opens the code in Snack, where you can edit it and see the result.

Two things to notice. First, a tab navigator draws a header of its own, and so does the stack, so the Messages tab would show two headers stacked on top of each other. `headerShown: false` on the Messages tab hides the tab's header and lets the stack's header, with its back arrow, do the work. The Contacts tab has no stack, so it keeps the tab's header. Second, `Contacts` is outside the stack, so it can't call `navigation.navigate('Thread')` directly. It names the tab first and the screen inside it second, with the params alongside: `navigation.navigate('Messages', { screen: 'Thread', params: { from: 'Sam' } })`. A tab navigator never pushes anything, so this just switches to the Messages tab and the stack inside it opens the thread.
