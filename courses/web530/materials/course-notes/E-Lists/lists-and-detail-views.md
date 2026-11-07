Source: <https://seneca-ictoer.github.io/WEB530/E-Lists/lists-and-detail-views>

# Data Lists and Detail Views

## Introduction

Many mobile apps follow a familiar pattern:

1. Show a **list** of items
2. Let the user **tap** an item
3. Navigate to a **detail view** showing more information

Examples include:

* Email inbox → email detail
* Contacts → contact profile
* Products → product page
* News feed → article view

React Native makes this pattern straightforward using:

* **FlatList** for efficient list rendering
* **Pressable** for touch interactions
* **React Navigation** for screen‑to‑screen navigation

This page shows how to build a simple “List → Detail” flow.

## Example

### Navigation

To navigate between screens, we use the [Stack Navigator](https://seneca-ictoer.github.io/WEB530/D-Navigation/navigating) from React Navigation.

```
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="List" component={ListScreen} />
        <Stack.Screen name="Detail" component={DetailScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
```

### List Screen

The list screen displays a list of items using `FlatList`. Each row is a `Pressable` that navigates to the detail screen.

```
import React from 'react';
import { View, Text, FlatList, Pressable, StyleSheet } from 'react-native';

export function ListScreen({ navigation }) {
  const data = new Array(20).fill(null).map((_, id) => ({
    id,
    title: `Item ${id}`,
    description: `This is item number ${id}.`,
  }));

  function openDetail(item) {
    navigation.navigate('Detail', { item });
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={data}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <Pressable style={styles.row} onPress={() => openDetail(item)}>
            <Text style={styles.rowTitle}>{item.title}</Text>
            <Text style={styles.rowSubtitle}>Tap to view details</Text>
          </Pressable>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  row: {
    padding: 20,
    borderBottomWidth: 1,
    borderColor: '#ddd',
  },
  rowTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  rowSubtitle: {
    fontSize: 14,
    color: '#666',
  },
});
```

### Detail Screen

The detail screen receives the selected item through `route.params`.

```
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export function DetailScreen({ route }) {
  const { item } = route.params;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{item.title}</Text>
      <Text style={styles.description}>{item.description}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: { fontSize: 28, fontWeight: '700', marginBottom: 10 },
  description: { fontSize: 18, lineHeight: 26 },
});
```

### Passing Data Between Screens

React Navigation automatically passes parameters using:

```
navigation.navigate('Detail', { item });
```

The detail screen retrieves them using:

```
const { item } = route.params;
```

You can pass:

* Strings
* Numbers
* Objects
* Arrays
* API results

This makes it easy to show a list of items and then display more information about a selected one.

### Fetching Detail Data

Sometimes you only pass an ID, and the detail screen fetches the rest:

```
navigation.navigate('Detail', { id: item.id });
```

Then in the detail screen:

```
useEffect(() => {
  fetch(`https://example.com/items/${id}`)
    .then((res) => res.json())
    .then(setItem);
}, [id]);
```

This is useful for:

* Product pages
* User profiles
* News articles
* Any data that needs to be loaded on demand

## Full Solution (Local Data)

```
import { View, Text, FlatList, Pressable, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

const Stack = createNativeStackNavigator();

// ----------------------
// List Screen
// ----------------------
function ListScreen({ navigation }) {
  const data = new Array(20).fill(null).map((_, id) => ({
    id,
    title: `Item ${id}`,
    description: `This is the detail view for item ${id}.`,
  }));

  function openDetail(item) {
    navigation.navigate('Detail', { item });
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={data}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <Pressable style={styles.row} onPress={() => openDetail(item)}>
            <Text style={styles.rowTitle}>{item.title}</Text>
            <Text style={styles.rowSubtitle}>Tap to view details</Text>
          </Pressable>
        )}
      />
    </View>
  );
}

// ----------------------
// Detail Screen
// ----------------------
function DetailScreen({ route }) {
  const { item } = route.params;

  return (
    <View style={styles.detailContainer}>
      <Text style={styles.detailTitle}>{item.title}</Text>
      <Text style={styles.detailDescription}>{item.description}</Text>
    </View>
  );
}

// ----------------------
// App Entry
// ----------------------
export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="List" component={ListScreen} />
        <Stack.Screen
          name="Detail"
          component={DetailScreen}
          options={({ route }) => ({
            title: route.params.item.title,
          })}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

// ----------------------
// Styles
// ----------------------
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  row: {
    padding: 20,
    borderBottomWidth: 1,
    borderColor: '#ddd',
  },
  rowTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  rowSubtitle: {
    fontSize: 14,
    color: '#666',
  },
  detailContainer: {
    flex: 1,
    padding: 20,
  },
  detailTitle: {
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 10,
  },
  detailDescription: {
    fontSize: 18,
    lineHeight: 26,
  },
});
```

Exampleruns in Expo Snack

Opens the code in Snack, where you can edit it and see the result.

## Full Example (Fetching Remote Data)

```
import { useEffect, useState } from 'react';
import { View, Text, FlatList, Pressable, StyleSheet, ActivityIndicator } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

const Stack = createNativeStackNavigator();

// ----------------------
// List Screen
// ----------------------
function ListScreen({ navigation }) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch('https://jsonplaceholder.typicode.com/posts')
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then((json) => {
        setData(json);
        setLoading(false);
      })
      .catch((err) => {
        setError('Failed to load data');
        setLoading(false);
      });
  }, []);

  function openDetail(item) {
    navigation.navigate('Detail', { id: item.id });
  }

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
        <Text>Loading posts…</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.center}>
        <Text style={{ color: 'red' }}>{error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={data}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <Pressable style={styles.row} onPress={() => openDetail(item)}>
            <Text style={styles.rowTitle}>{item.title}</Text>
            <Text style={styles.rowSubtitle}>Tap to view details</Text>
          </Pressable>
        )}
      />
    </View>
  );
}

// ----------------------
// Detail Screen
// ----------------------
function DetailScreen({ route }) {
  const { id } = route.params;

  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`https://jsonplaceholder.typicode.com/posts/${id}`)
      .then((res) => res.json())
      .then((json) => {
        setItem(json);
        setLoading(false);
      });
  }, [id]);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
        <Text>Loading details…</Text>
      </View>
    );
  }

  return (
    <View style={styles.detailContainer}>
      <Text style={styles.detailTitle}>{item.title}</Text>
      <Text style={styles.detailDescription}>{item.body}</Text>
    </View>
  );
}

// ----------------------
// App Entry
// ----------------------
export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="List" component={ListScreen} />
        <Stack.Screen name="Detail" component={DetailScreen} options={{ title: 'Post Details' }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

// ----------------------
// Styles
// ----------------------
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  row: {
    padding: 20,
    borderBottomWidth: 1,
    borderColor: '#ddd',
  },
  rowTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  rowSubtitle: {
    fontSize: 14,
    color: '#666',
  },
  detailContainer: {
    flex: 1,
    padding: 20,
  },
  detailTitle: {
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 10,
  },
  detailDescription: {
    fontSize: 18,
    lineHeight: 26,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
```

Exampleruns in Expo Snack

Opens the code in Snack, where you can edit it and see the result.
