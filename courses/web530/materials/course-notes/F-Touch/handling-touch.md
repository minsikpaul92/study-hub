Source: <https://seneca-ictoer.github.io/WEB530/F-Touch/handling-touch>

# Handling Touch

## Pressable

Mobile apps rely heavily on touch interactions. Users tap, press, scroll, swipe, and perform multi‑touch gestures. React Native includes a built‑in **Gesture Responder System (GRS)** that interprets these interactions and decides whether the user intends to tap, scroll, or perform another gesture. While the GRS is powerful, most apps rarely interact with it directly. Instead, React Native provides higher‑level components that simplify touch handling.

In modern React Native, the recommended way to handle taps and presses is the **Pressable** component. Pressable replaces the older `TouchableOpacity`, `TouchableHighlight`, `TouchableWithoutFeedback`, and `TouchableNativeFeedback` components. These legacy components still work, but they are no longer recommended for new code.

`Pressable` provides:

* `onPress` — simple tap
* `onLongPress` — long press
* `onPressIn` / `onPressOut` — press lifecycle events
* `android_ripple` — native ripple effects on Android
* `hitSlop` — makes touch targets easier to tap
* A **style callback** that lets you change appearance when pressed

This makes `Pressable` flexible enough to build custom buttons, cards, list items, and any other interactive UI element.

The examples on this page show feedback in a `Text` component rather than with `Alert.alert()`. Alerts work on phones, but they do nothing in the web preview.

```
import { useState } from 'react';
import { Pressable, Text, StyleSheet, View } from 'react-native';

export default function App() {
  const [message, setMessage] = useState('Not pressed yet');

  return (
    <View style={styles.container}>
      <Pressable
        onPress={() => setMessage('You tapped the button.')}
        style={({ pressed }) => [
          styles.button,
          { backgroundColor: pressed ? '#1976D2' : '#2196F3' },
        ]}
      >
        <Text style={styles.buttonText}>Press Me</Text>
      </Pressable>
      <Text style={styles.message}>{message}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 60,
    alignItems: 'center',
  },
  button: {
    padding: 20,
    borderRadius: 6,
    width: 260,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
  },
  message: {
    marginTop: 20,
    fontSize: 16,
  },
});
```

Exampleruns in Expo Snack

Opens the code in Snack, where you can edit it and see the result.

This example demonstrates the most important modern pattern: **Pressable’s style can change based on whether the component is pressed.**

## Long Press, Press In, and Press Out

`Pressable` supports additional events that help you build richer interactions. The example lists each event as it fires, so you can see their order: a tap fires `onPressIn`, `onPressOut`, then `onPress`, while holding the button fires `onLongPress` instead of `onPress`. Sliding your finger off the button before lifting it cancels the press: only `onPressIn` and `onPressOut` fire, so a user who changes their mind does not trigger anything.

```
import { useState } from 'react';
import { Pressable, Text, View, StyleSheet } from 'react-native';

export default function App() {
  const [events, setEvents] = useState([]);

  // Keep the five most recent events, newest first.
  const log = (name) => setEvents((prev) => [name, ...prev].slice(0, 5));

  return (
    <View style={styles.container}>
      <Pressable
        onPress={() => log('onPress (tap)')}
        onLongPress={() => log('onLongPress (held)')}
        onPressIn={() => log('onPressIn (finger down)')}
        onPressOut={() => log('onPressOut (finger lifted)')}
        style={({ pressed }) => [styles.button, { backgroundColor: pressed ? '#ddd' : '#eee' }]}
      >
        <Text>Press or Hold</Text>
      </Pressable>
      {events.map((event, i) => (
        <Text key={i}>{event}</Text>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 60,
    alignItems: 'center',
  },
  button: {
    padding: 20,
    borderRadius: 6,
    width: 260,
    alignItems: 'center',
    marginBottom: 20,
  },
});
```

Exampleruns in Expo Snack

Opens the code in Snack, where you can edit it and see the result.

## Improving Touch Targets with `hitSlop`

Touch targets should be at least 44×44 points for accessibility. If your UI element is small, you can expand its touch area:

```
import { useState } from 'react';
import { Pressable, Text, View, StyleSheet } from 'react-native';

export default function App() {
  const [taps, setTaps] = useState(0);

  return (
    <View style={styles.container}>
      <Pressable hitSlop={20} onPress={() => setTaps((prev) => prev + 1)}>
        <Text style={styles.smallText}>Small Icon</Text>
      </Pressable>
      <Text>Taps: {taps}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 60,
    alignItems: 'center',
  },
  smallText: {
    fontSize: 14,
    padding: 10,
  },
});
```

Exampleruns in Expo Snack

Opens the code in Snack, where you can edit it and see the result.

`hitSlop={20}` adds 20 points of invisible padding around the element, so the touch area grows without changing the layout. It also accepts an object such as `{ top: 10, bottom: 10 }` to extend one side at a time. Keep the slop smaller than the gap to the next touch target, or a tap may land on the wrong one.

The web preview ignores `hitSlop`, so a click just outside the text does nothing there. Choose **My Device** and run the example on your phone to feel the difference.

## Android Ripple Effects

`Pressable` supports native Android ripple feedback:

```
import { useState } from 'react';
import { Pressable, Text, View, StyleSheet, Platform } from 'react-native';

export default function App() {
  const [taps, setTaps] = useState(0);

  return (
    <View style={styles.container}>
      <Pressable
        onPress={() => setTaps((prev) => prev + 1)}
        android_ripple={{
          color: 'rgba(0,0,0,0.3)',
          foreground: true,
        }}
        style={styles.rippleButton}
      >
        <Text style={styles.text}>Android Ripple (Visible)</Text>
      </Pressable>
      <Text>Taps: {taps}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 60,
    alignItems: 'center',
    gap: 20,
  },
  rippleButton: {
    padding: 20,
    borderRadius: 8,
    backgroundColor: '#E3F2FD', // light background so ripple is visible
    overflow: Platform.OS === 'android' ? 'hidden' : 'visible', // required for ripple clipping
  },
  text: {
    fontSize: 16,
  },
});
```

Exampleruns in Expo Snack

Opens the code in Snack, where you can edit it and see the result.

Ripple effects automatically adapt to Material Design guidelines. They only appear on Android, so switch the preview to **Android** (or use **My Device** with an Android phone) to see one.

## When to Use Gesture Handler

`Pressable` is perfect for:

* Buttons
* Cards
* List items
* Simple taps and long presses

For more advanced gestures, use the Gesture Handler library:

* Swipes
* Drags
* Panning
* Pinch‑to‑zoom
* Complex gesture combinations

Gesture Handler describes each gesture with the `Gesture` API and attaches it to a component with `GestureDetector`:

* `Gesture.Tap()`
* `Gesture.LongPress()`
* `Gesture.Pan()` (drags and swipes)
* `Gesture.Pinch()`

These are ideal for building custom gesture‑driven UI.
