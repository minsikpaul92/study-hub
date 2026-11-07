Source: <https://seneca-ictoer.github.io/WEB530/E-Lists/sorting-lists>

# Sorting and filtering lists

The `FlatList` component renders whatever items you pass into its `data` array. If you modify the array, by adding, removing, sorting, or filtering items, the list automatically re-renders to reflect those changes. This makes `FlatList` ideal for building interactive UIs where users can search, filter, or reorder content.

However, modern React Native best practices recommend **avoiding sorting or filtering directly inside the render function**. Instead, these operations should be memoized using `useMemo` so they only run when their inputs change. This improves performance and prevents unnecessary re-renders.

Below is an example that demonstrates sorting and filtering using modern patterns.

```
import React, { useState, useMemo } from 'react';
import { Text, View, Button, TextInput, FlatList } from 'react-native';

// Generate 99 items with stable IDs
const itemsToShow = new Array(99)
  .fill(null)
  .map((v, i) => ({ id: i.toString(), title: `Item ${i}` }));

// Memoized row component for performance
const Row = React.memo(({ title }) => {
  return <Text style={{ padding: 8 }}>{title}</Text>;
});

export default function App() {
  const [ascending, setAscending] = useState(true);
  const [filter, setFilter] = useState('');

  // Memoize sorting + filtering so it only recalculates when needed
  const filteredAndSorted = useMemo(() => {
    // Filter
    const filtered = filter
      ? itemsToShow.filter((item) => item.title.toLowerCase().includes(filter.toLowerCase()))
      : itemsToShow;

    // Sort
    const sorted = [...filtered].sort((a, b) => {
      const aNum = Number(a.id);
      const bNum = Number(b.id);
      return ascending ? aNum - bNum : bNum - aNum;
    });

    return sorted;
  }, [filter, ascending]);

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

This example demonstrates how to combine sorting and filtering in a performant way. We begin by generating an array of 99 items, each with a stable `id` and a `title`. The user can toggle between ascending and descending order using a button, and they can filter the list by typing into a controlled `TextInput`. Instead of sorting and filtering inside the render function, which would cause unnecessary work on every re-render, we wrap the logic inside a `useMemo` hook. This ensures the list is only recalculated when the filter text or sort direction changes. The `FlatList` then receives this memoized array through its data prop, and each row is rendered using a memoized `Row` component for improved performance. A `ListEmptyComponent` is included to handle cases where no items match the filter. This approach keeps the UI responsive, avoids wasted renders, and follows modern React Native best practices.
