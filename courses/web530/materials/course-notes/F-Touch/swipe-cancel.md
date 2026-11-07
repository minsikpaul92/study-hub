Source: <https://seneca-ictoer.github.io/WEB530/F-Touch/swipe-cancel>

# Swipeable and Cancellable

## Swipe Gestures

Swipe gestures are a common pattern in mobile apps. Email clients, messaging apps, and task managers often allow users to swipe a row to reveal quick actions such as **Delete**, **Archive**, or **Mark as Read**.

A swipe is a horizontal drag, and it must be **cancellable**. Users often start a swipe and change their mind, so a short swipe should snap back and do nothing. Only a deliberate swipe should act. This prevents accidental destructive actions and matches how native iOS and Android apps behave.

A swipe must also share the screen with scrolling. A row that swipes sideways should only take the gesture once the finger is clearly moving sideways, and leave vertical drags to the list.

Swipes need a touch screen. The web preview only has a mouse, so run the examples on this page on your phone with **My Device**.

## Building a Cancellable Swipe

React Native includes two tools for building gestures by hand. `PanResponder` reports where the finger is, and `Animated` moves a view smoothly without re-rendering the component on every frame. The example below lets you drag a card sideways. A short drag snaps back; a drag past 120 points slides the card off the screen.

```
import { useRef, useState } from 'react';
import { View, Text, Button, Animated, PanResponder, StyleSheet } from 'react-native';

export default function App() {
  const [dismissed, setDismissed] = useState(false);
  const translateX = useRef(new Animated.Value(0)).current;

  const pan = useRef(
    PanResponder.create({
      // Only take the gesture once the finger moves sideways.
      onMoveShouldSetPanResponder: (_, gesture) => Math.abs(gesture.dx) > 10,
      onPanResponderMove: (_, gesture) => {
        translateX.setValue(gesture.dx);
      },
      onPanResponderRelease: (_, gesture) => {
        if (Math.abs(gesture.dx) > 120) {
          // Far enough: commit, and slide the card off the screen.
          Animated.timing(translateX, {
            toValue: gesture.dx > 0 ? 500 : -500,
            duration: 200,
            useNativeDriver: true,
          }).start(() => setDismissed(true));
        } else {
          // Not far enough: cancel, and spring back.
          Animated.spring(translateX, {
            toValue: 0,
            useNativeDriver: true,
          }).start();
        }
      },
    })
  ).current;

  function reset() {
    translateX.setValue(0);
    setDismissed(false);
  }

  return (
    <View style={styles.container}>
      {dismissed ? (
        <Button title="Bring It Back" onPress={reset} />
      ) : (
        <Animated.View {...pan.panHandlers} style={[styles.card, { transform: [{ translateX }] }]}>
          <Text style={styles.text}>Swipe Me</Text>
        </Animated.View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 100,
    paddingHorizontal: 20,
  },
  card: {
    padding: 20,
    borderRadius: 8,
    backgroundColor: '#eef',
  },
  text: {
    fontSize: 18,
  },
});
```

Exampleruns in Expo Snack

Opens the code in Snack, where you can edit it and see the result.

### Understanding the Example

1. `useRef` keeps the same object for the whole life of the component. Without it, `new Animated.Value(0)` would create a fresh value, back at 0, on every render. Changing a ref does not cause a re-render.
2. `onMoveShouldSetPanResponder` decides whether the card takes the gesture. It only says yes after 10 points of sideways movement, so taps and vertical drags are left for other components, such as a scroll view.
3. `onPanResponderMove` sets the card's offset to `gesture.dx`, the distance the finger has moved sideways.
4. `onPanResponderRelease` is where the swipe is either committed or cancelled. `Animated.spring` returns the card to 0 with a small bounce, and `Animated.timing` slides it off the screen. The `start` callback changes state only after the animation ends.
5. `useNativeDriver: true` runs the animation on the native side, so it stays smooth even when JavaScript is busy.

## Swipeable Rows

Writing a `PanResponder` for every list row would be a lot of work. In practice, apps use the **Swipeable** component from the `react-native-gesture-handler` library, which Expo includes.

`Swipeable` provides:

* Smooth, physics‑based swipe gestures
* Left and right action panels
* Automatic cancellation when the swipe is not far enough
* Callbacks when a swipe passes a threshold
* Full support for iOS and Android

The example below shows an inbox of swipeable rows. Swiping a row left reveals a **Delete** button underneath it. A short swipe snaps back; a swipe past about half the button's width leaves the row open, and tapping **Delete** removes the message.

```
import { useState } from 'react';
import { View, Text, Pressable, FlatList, StyleSheet } from 'react-native';
import { GestureHandlerRootView, Swipeable } from 'react-native-gesture-handler';

const inbox = [
  { id: '1', from: 'Registrar', subject: 'Your timetable is ready' },
  { id: '2', from: 'Library', subject: 'Book due Friday' },
  { id: '3', from: 'Campus Store', subject: 'Textbook back in stock' },
  { id: '4', from: 'IT Services', subject: 'Password expires in 7 days' },
  { id: '5', from: 'Study Group', subject: 'Room 2104 at 3 PM' },
  { id: '6', from: 'Athletics', subject: 'Intramural sign-ups open' },
  { id: '7', from: 'Career Centre', subject: 'Resume workshop Thursday' },
  { id: '8', from: 'Student Union', subject: 'Free pancakes Monday' },
];

function MessageRow({ item, onDelete }) {
  return (
    <Swipeable
      overshootRight={false}
      renderRightActions={() => (
        <Pressable style={styles.deleteButton} onPress={() => onDelete(item.id)}>
          <Text style={styles.actionText}>Delete</Text>
        </Pressable>
      )}
    >
      <View style={styles.row}>
        <Text style={styles.from}>{item.from}</Text>
        <Text style={styles.subject}>{item.subject}</Text>
      </View>
    </Swipeable>
  );
}

export default function App() {
  const [messages, setMessages] = useState(inbox);

  function deleteMessage(id) {
    setMessages((prev) => prev.filter((item) => item.id !== id));
  }

  return (
    <GestureHandlerRootView style={styles.container}>
      <FlatList
        data={messages}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <MessageRow item={item} onDelete={deleteMessage} />}
        ListEmptyComponent={<Text style={styles.empty}>No messages.</Text>}
      />
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 60,
  },
  row: {
    padding: 20,
    borderBottomWidth: 1,
    borderColor: '#ddd',
    backgroundColor: 'white',
  },
  from: {
    fontSize: 16,
    fontWeight: '600',
  },
  subject: {
    fontSize: 14,
    color: '#666',
  },
  deleteButton: {
    justifyContent: 'center',
    paddingHorizontal: 24,
    backgroundColor: '#E53935',
  },
  actionText: {
    color: 'white',
    fontWeight: '600',
  },
  empty: {
    padding: 20,
    color: '#666',
  },
});
```

Exampleruns in Expo Snack

Opens the code in Snack, where you can edit it and see the result.

### Understanding the Example

1. `GestureHandlerRootView` - All gesture‑handler components must be inside this root view. Put it once, around the whole app.
2. `MessageRow` - Each row is wrapped in a `Swipeable`, which handles dragging, cancelling, snapping back and staying open. `MessageRow` is declared at the top level, outside `App`. A component declared inside another one is a new component on every render, so every row would be rebuilt, and lose its swipe position, each time the list changed.
3. Right action panel - `renderRightActions` returns the panel underneath the right edge of the row. Swiping left reveals it. The row has a white background so the panel stays hidden until the swipe.
4. `overshootRight={false}` - Stops the row at the edge of the panel instead of letting it stretch further.
5. Deleting - Tapping **Delete** calls `onDelete`, which removes the message with the updater form of `setMessages`.
6. Gesture priority - Dragging up and down scrolls the list. A row only takes the gesture when the finger moves sideways.

The swipe only reveals the button; the tap deletes. Deleting is destructive, so it takes two deliberate actions. `Swipeable` also has an `onSwipeableOpen` callback that could delete the row as soon as it opens, but then a slightly long swipe would lose a message with no way back. Save that pattern for actions that can be undone, such as archiving.

## When to Use Swipe Actions

Use swipe actions when:

* The action is secondary, such as delete or archive
* The user performs it frequently
* You want to keep the list clean
* You want fast, one‑handed interactions

Avoid swipe actions when:

* The action is critical and the swipe is the only way to do it
* The user needs a confirmation step that a swipe cannot give
* The gesture might conflict with other horizontal scrolling on the screen

Swipes are hidden: nothing on screen tells the user they exist. Always offer another way to reach the same action, such as a button on the detail screen.

💡 Note: `Swipeable` Is Deprecated

The `Swipeable` component used in this example still works, but it has been officially marked as deprecated in `react-native-gesture-handler`. This means it may be removed in a future release and should not be used in new production apps.

**What this means for you**

* You can safely use `Swipeable` for learning purposes in this course.
* It helps you understand the idea of “swipeable and cancellable” UI elements.
* It keeps the example simple and avoids extra setup.

**What modern apps use instead**

Newer React Native projects typically build swipe gestures using:

* `ReanimatedSwipeable`, the replacement component, with a very similar API
* The Gesture API (`Gesture.Pan()`, `GestureDetector`) for custom gestures
* Reanimated for smooth, native‑driven animations

This approach gives developers more control and better performance, especially for complex interactions like Gmail‑style swipe actions.

**Why this example stays as‑is**

* It works reliably in the course environment (Snack).
* It clearly demonstrates the swipe‑to‑delete pattern.
* It avoids the complexity of Reanimated and Worklets, which are beyond the scope of this module.

As you continue learning, you’ll see how the newer Gesture API can be used to build the same interaction with more flexibility and modern tooling.
