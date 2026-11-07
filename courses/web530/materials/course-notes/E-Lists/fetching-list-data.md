Source: <https://seneca-ictoer.github.io/WEB530/E-Lists/fetching-list-data>

# Fetching List Data

Many applications need to load list data from a remote API. In this example, we fetch a list of user names and display them using a `FlatList`. We use the `useEffect()` hook to perform the asynchronous request when the component mounts, and we store the results in state so they can be sorted and filtered just like locally generated data.

Modern React Native best practices recommend:

* Using an **async function inside useEffect**
* Adding a **cleanup flag** to ignore a response that arrives after the component unmounts
* Including **loading and error states**, and checking `response.ok`, since `fetch()` only rejects on network failures
* Memoizing sorting and filtering with `useMemo`
* Using **stable keys** instead of array indexes

Below is the updated version.

```
import React, { useState, useEffect, useMemo } from 'react';
import { Text, View, Button, TextInput, FlatList, ActivityIndicator } from 'react-native';

// Memoized row component for performance
const Row = React.memo(({ title }) => {
  return <Text style={{ padding: 8 }}>{title}</Text>;
});

export default function App() {
  const [ascending, setAscending] = useState(true);
  const [filter, setFilter] = useState('');
  const [data, setData] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch data using modern async pattern
  useEffect(() => {
    let isMounted = true;

    const load = async () => {
      try {
        const resp = await fetch('https://jsonplaceholder.typicode.com/users');
        if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
        const users = await resp.json();

        if (isMounted) {
          setData(
            users.map((u) => ({
              id: u.id.toString(), // stable key
              title: u.name,
            }))
          );
        }
      } catch (e) {
        if (isMounted) setError('Failed to load data');
      } finally {
        // Runs after success or failure, so the spinner always goes away.
        if (isMounted) setLoading(false);
      }
    };

    load();
    return () => {
      isMounted = false;
    };
  }, []);

  // Memoize sorting + filtering
  const filteredAndSorted = useMemo(() => {
    const filtered = filter
      ? data.filter((item) => item.title.toLowerCase().includes(filter.toLowerCase()))
      : data;

    const sorted = [...filtered].sort((a, b) => {
      return ascending ? a.title.localeCompare(b.title) : b.title.localeCompare(a.title);
    });

    return sorted;
  }, [data, filter, ascending]);

  if (loading) {
    return (
      <View style={{ marginTop: 50 }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={{ marginTop: 50 }}>
        <Text>{error}</Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, marginTop: 50, padding: 10 }}>
      <Button
        title={`Sort ${ascending ? 'Ascending' : 'Descending'}`}
        onPress={() => setAscending((prev) => !prev)}
      />

      <TextInput
        placeholder="Search Text"
        value={filter}
        onChangeText={setFilter}
        style={{
          borderWidth: 1,
          borderColor: '#ccc',
          padding: 8,
          marginVertical: 10,
        }}
      />

      <FlatList
        data={filteredAndSorted}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <Row title={item.title} />}
        ListEmptyComponent={<Text>No items found</Text>}
        initialNumToRender={20}
        windowSize={10}
      />
    </View>
  );
}
```

Exampleruns in Expo Snack

Opens the code in Snack, where you can edit it and see the result.

## Lazy Loading of List Data

The `FlatList` component includes an `onEndReached` property that makes it easy to implement infinite scrolling. This pattern is common in social media feeds, where new content loads automatically as the user scrolls.

To implement lazy loading:

1. Load an initial batch of items
2. Detect when the user scrolls near the bottom
3. Fetch or generate additional items
4. Append them to the existing list

```
<FlatList
  data={items}
  renderItem={...}
  onEndReached={() => {
    if (!loadingMore) {
      loadMoreItems(); // fetch or generate more data
    }
  }}
  onEndReachedThreshold={0.5} // triggers when the end is half a screen away
/>
```

### Best practices for infinite scrolling

* Track a `loadingMore` state to avoid duplicate requests
* Append new items using `setItems(prev => [...prev, ...newItems])`
* Use stable keys to prevent flicker
* Combine with server-side pagination when available
