Source: <https://seneca-ictoer.github.io/WEB530/F-Touch/scrolling>

# Scrolling

## Scrolling with your fingers

Scrolling is one of the most common gestures in mobile apps. Users swipe vertically to read long content, swipe horizontally to browse galleries, and pan through screens of information. In React Native, scrolling is typically implemented using the `ScrollView` component.

A `ScrollView` renders **all of its children at once**, which makes it ideal for:

* Static content
* Short lists
* Forms
* Articles or long text blocks

However, because it renders everything up front, a `ScrollView` must have a **bounded height**. If you do not constrain its height, it will expand to fit all its children and will not scroll.

## ScrollView vs FlatList

While `ScrollView` is simple and flexible, it is **not** the best choice for large or dynamic lists. For those cases, React Native provides [FlatList](https://seneca-ictoer.github.io/WEB530/E-Lists/working-with-lists), which:

* Renders items lazily as they appear on screen
* Unmounts items that scroll off screen
* Uses virtualization for performance
* Supports separators, multiple columns, pull‑to‑refresh, and infinite scrolling

Use this rule of thumb:

* **ScrollView** → small, static content
* **FlatList** → large or dynamic lists

## SafeAreaView

On modern iOS devices with notches or rounded corners, content can be obscured by system UI. `SafeAreaView` ensures your content stays within the visible safe area by automatically applying padding.

It is recommended for:

* Full‑screen layouts
* Scrollable screens
* Any screen where content touches the edges

## Basic ScrollView Example

The example below shows a vertical `ScrollView` wrapped in a `SafeAreaView`. The text is repeated so it extends beyond the screen, and the user can scroll naturally with their finger.

```
import { StyleSheet, Text, ScrollView } from 'react-native';
import { SafeAreaView, SafeAreaProvider } from 'react-native-safe-area-context';

const paragraph =
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor ' +
  'incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud ' +
  'exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure ' +
  'dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.';

export default function App() {
  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
        <ScrollView style={styles.scrollView} contentContainerStyle={styles.contentContainer}>
          {Array.from({ length: 6 }, (_, i) => (
            <Text key={i} style={styles.text}>
              {i + 1}. {paragraph}
            </Text>
          ))}
        </ScrollView>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    marginHorizontal: 20,
    backgroundColor: '#FCE4EC',
  },
  contentContainer: {
    padding: 20,
  },
  text: {
    fontSize: 18,
    lineHeight: 28,
    marginBottom: 20,
  },
});
```

Exampleruns in Expo Snack

Opens the code in Snack, where you can edit it and see the result.

## Horizontal Scrolling

ScrollView also supports horizontal scrolling:

```
import { StyleSheet, Text, View, ScrollView } from 'react-native';
import { SafeAreaView, SafeAreaProvider } from 'react-native-safe-area-context';

export default function App() {
  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
        <Text style={styles.title}>Horizontal ScrollView</Text>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          <View style={[styles.card, { backgroundColor: '#FFCDD2' }]}>
            <Text style={styles.cardText}>Card 1</Text>
          </View>

          <View style={[styles.card, { backgroundColor: '#F8BBD0' }]}>
            <Text style={styles.cardText}>Card 2</Text>
          </View>

          <View style={[styles.card, { backgroundColor: '#E1BEE7' }]}>
            <Text style={styles.cardText}>Card 3</Text>
          </View>

          <View style={[styles.card, { backgroundColor: '#D1C4E9' }]}>
            <Text style={styles.cardText}>Card 4</Text>
          </View>

          <View style={[styles.card, { backgroundColor: '#C5CAE9' }]}>
            <Text style={styles.cardText}>Card 5</Text>
          </View>
        </ScrollView>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: '600',
    marginLeft: 20,
    marginBottom: 10,
  },
  scrollContent: {
    paddingHorizontal: 20,
  },
  card: {
    width: 200,
    height: 150,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  cardText: {
    fontSize: 18,
    fontWeight: '500',
  },
});
```

Exampleruns in Expo Snack

Opens the code in Snack, where you can edit it and see the result.

This is useful for:

* Image carousels
* Category chips
* Horizontal menus

**When NOT to use ScrollView**

Avoid ScrollView when:

* You have hundreds or thousands of items
* Items are loaded from a server
* You need infinite scrolling
* You need pull‑to‑refresh
* You need item separators or multi‑column layouts

In these cases, FlatList is the correct choice.

## Momentum and Natural Scrolling

Scrolling is a **continuous** gesture: the content moves every frame for as long as the finger moves. A tap or a long press, by contrast, is a **discrete** gesture that fires once and is over.

Mobile scrolling also has momentum. A quick flick keeps the content moving after the finger lifts, and it slows down on its own. A slow drag moves exactly as far as the finger. `ScrollView` and `FlatList` use the platform's own scrolling, so this behaviour matches every other app on the phone without any extra code. The web preview scrolls with the mouse wheel or trackpad instead, so try the examples on your phone with **My Device** to feel it.

## Nested Scrolling

A horizontal list inside a vertical page is a common layout: think of an app store's home screen, with rows of cards that scroll sideways inside a page that scrolls down. React Native gives each drag to the scroll view that matches its direction, so a sideways drag on the cards moves the cards and an upward drag moves the page.

```
import { ScrollView, View, Text, StyleSheet } from 'react-native';

const cards = Array.from({ length: 10 }, (_, i) => `Card ${i + 1}`);
const rows = Array.from({ length: 30 }, (_, i) => `Item ${i + 1}`);

export default function App() {
  return (
    <ScrollView style={styles.container}>
      <Text style={styles.heading}>Featured</Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.cards}
      >
        {cards.map((card) => (
          <View key={card} style={styles.card}>
            <Text style={styles.text}>{card}</Text>
          </View>
        ))}
      </ScrollView>
      {rows.map((row) => (
        <View key={row} style={styles.row}>
          <Text style={styles.text}>{row}</Text>
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, marginTop: 60 },
  heading: { fontSize: 22, fontWeight: '600', padding: 20 },
  cards: { paddingHorizontal: 20, paddingBottom: 20 },
  card: {
    width: 150,
    height: 150,
    marginRight: 15,
    borderRadius: 12,
    backgroundColor: '#dde',
    justifyContent: 'center',
    alignItems: 'center',
  },
  row: { padding: 20, borderBottomWidth: 1, borderColor: '#ccc' },
  text: { fontSize: 18 },
});
```

Exampleruns in Expo Snack

Opens the code in Snack, where you can edit it and see the result.

In the web preview, scroll the cards sideways with Shift and the mouse wheel, or with two fingers on a trackpad.

Nesting works when the directions differ. Nesting scroll views that scroll the **same** way causes conflicts, because both want every drag. React Native even warns when a `FlatList` is placed inside a vertical `ScrollView`, since the list can no longer tell which rows are on screen. Keep nesting shallow, and use a `FlatList` for the main scrolling content.

## Scrolling and Touch Together

Rows in a scrolling list usually need to be tappable as well. Both gestures start with a finger on a row, so React Native decides which one the user meant: a finger that lifts without moving is a tap, and a finger that moves is a scroll, which cancels the press on the row. You get this for free by putting a `Pressable` inside each row.

```
import { useState } from 'react';
import { View, Text, Pressable, FlatList, StyleSheet } from 'react-native';

const rows = Array.from({ length: 40 }, (_, i) => ({
  id: String(i + 1),
  title: `Row ${i + 1}`,
}));

export default function App() {
  const [selected, setSelected] = useState({});

  function toggle(id) {
    setSelected((prev) => ({ ...prev, [id]: !prev[id] }));
  }

  const count = Object.values(selected).filter(Boolean).length;

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>{count} selected</Text>
      <FlatList
        data={rows}
        keyExtractor={(item) => item.id}
        extraData={selected}
        renderItem={({ item }) => (
          <Pressable
            style={({ pressed }) => [
              styles.row,
              selected[item.id] && styles.selected,
              pressed && styles.pressed,
            ]}
            onPress={() => toggle(item.id)}
          >
            <Text style={styles.text}>{item.title}</Text>
          </Pressable>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingTop: 60 },
  heading: { fontSize: 18, fontWeight: '600', padding: 20 },
  row: { padding: 20, borderBottomWidth: 1, borderColor: '#ccc' },
  selected: { backgroundColor: '#BBDEFB' },
  pressed: { backgroundColor: '#eee' },
  text: { fontSize: 18 },
});
```

Exampleruns in Expo Snack

Opens the code in Snack, where you can edit it and see the result.

Tap rows to select them, and tap again to clear. On a phone, start a scroll with your finger on a row: the row never gets selected.

* `selected` is an object of ids, such as `{ '3': true, '7': true }`. `toggle` copies it and flips one id, using the updater form because the new state depends on the old.
* The pressed style comes last in the style array, so the press feedback still shows on a selected row.
* `extraData={selected}` tells `FlatList` that the rows depend on something outside `data`. Without it, an optimized list can skip re-rendering and leave a tapped row looking unselected.
