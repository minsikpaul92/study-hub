Source: <https://seneca-ictoer.github.io/WEB530/E-Lists/pull-to-refresh>

# Pull to Refresh

## Introduction

Mobile users expect lists to stay up‑to‑date. Whether checking email, refreshing a news feed, or reloading product data, the most common pattern is **pull to refresh**: the user drags downward at the top of a list to trigger a reload.

React Native provides built‑in support for this pattern through the `FlatList` component. You do **not** need to detect gestures manually — the list handles the pull gesture for you.

## How Pull to Refresh Works

`FlatList` exposes two props that enable pull‑to‑refresh:

1. `refreshing` - A boolean that tells React Native whether the list is currently refreshing. When `true`, the list shows a spinner at the top.
2. `onRefresh` - A function that is called when the user performs the pull‑to‑refresh gesture.

Together, they look like this:

```
<FlatList data={items} refreshing={refreshing} onRefresh={loadData} />
```

React Native handles the gesture. You handle the data.

💡 Pulling to refresh needs a touch screen, so it doesn't work in the web preview of the examples below. Run an example and switch the preview to **iOS** or **Android**, or choose **My Device** and open it in Expo Go.

## Basic Pull‑to‑Refresh Example

The example below shows how to refresh a list of items using a simulated network request.

```
import { useState } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';

export default function App() {
  const [items, setItems] = useState(['Apple', 'Banana', 'Cherry']);
  const [refreshing, setRefreshing] = useState(false);

  function loadData() {
    setRefreshing(true);

    // Simulate a network request
    setTimeout(() => {
      setItems((prev) => [...prev, 'New Item ' + (prev.length + 1)]);
      setRefreshing(false);
    }, 1200);
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={items}
        keyExtractor={(item) => item}
        refreshing={refreshing}
        onRefresh={loadData}
        renderItem={({ item }) => (
          <View style={styles.row}>
            <Text style={styles.text}>{item}</Text>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingTop: 60 },
  row: {
    padding: 20,
    borderBottomWidth: 1,
    borderColor: '#ddd',
  },
  text: { fontSize: 18 },
});
```

Exampleruns in Expo Snack

Opens the code in Snack, where you can edit it and see the result.

## Pull to Refresh with API Data

Pull‑to‑refresh becomes most useful when combined with remote data. Here is a version that fetches posts from an API and reloads them when the user pulls down.

```
import { useState, useEffect } from 'react';
import { View, Text, FlatList, ActivityIndicator, StyleSheet } from 'react-native';

export default function App() {
  const [posts, setPosts] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);

  function loadPosts() {
    return fetch('https://jsonplaceholder.typicode.com/posts')
      .then((res) => res.json())
      .then((json) => setPosts(json));
  }

  useEffect(() => {
    // finally() runs after success or failure, so loading always ends.
    loadPosts().finally(() => setLoading(false));
  }, []);

  function refresh() {
    setRefreshing(true);
    loadPosts().finally(() => setRefreshing(false));
  }

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
        <Text>Loading posts…</Text>
      </View>
    );
  }

  return (
    <FlatList
      style={styles.container}
      data={posts}
      keyExtractor={(item) => item.id.toString()}
      refreshing={refreshing}
      onRefresh={refresh}
      renderItem={({ item }) => (
        <View style={styles.row}>
          <Text style={styles.title}>{item.title}</Text>
          <Text style={styles.body}>{item.body}</Text>
        </View>
      )}
    />
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingTop: 60 },
  row: {
    padding: 20,
    borderBottomWidth: 1,
    borderColor: '#ddd',
  },
  title: { fontSize: 18, fontWeight: '600' },
  body: { fontSize: 14, color: '#555', marginTop: 4 },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
```

Exampleruns in Expo Snack

Opens the code in Snack, where you can edit it and see the result.

## Best Practices

1. Keep refresh actions fast - Users expect refresh to complete quickly. If your API is slow, show a spinner and consider caching.
2. Avoid refreshing on every screen load - Use pull‑to‑refresh for manual reloads. Use `useEffect` for initial loads.
3. Do not modify `refreshing` directly - Always set it to `true` before loading and `false` after.
4. Keep the UI responsive - Never block the UI thread. Use async functions or promises.
5. Combine with pagination if needed - Pull‑to‑refresh reloads the top of the list. Pagination loads more items at the bottom.
