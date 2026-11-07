Source: <https://seneca-ictoer.github.io/WEB530/E-Lists/working-with-lists>

# Working with Item Lists

## FlatList

React Native provides the `FlatList` component as the recommended way to render lists on both iOS and Android. While you can render lists using JavaScript’s `.map()`, this quickly becomes inefficient because `.map()` renders every item at once. `FlatList` is optimized for mobile performance through virtualization, meaning it only renders what is visible on screen.

To get started, pass an array of objects to the `data` prop. Each object must have a stable, unique key. The recommended pattern is to provide an `id` or `key` property, or tell the list which property to use with `keyExtractor`. If no key is found, React Native falls back to each item's position in the array and logs a warning, which can cause rows to update incorrectly when the list changes.

```
import React from 'react';
import { Text, View, FlatList } from 'react-native';

const itemsToShow = new Array(10)
  .fill(null)
  .map((v, i) => ({ id: i.toString(), title: `Item ${i}` }));

// Memoized row component for better performance
const Row = React.memo(({ title }) => {
  return <Text style={{ padding: 10 }}>{title}</Text>;
});

export default function App() {
  return (
    <View style={{ marginTop: 50 }}>
      <FlatList
        data={itemsToShow}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <Row title={item.title} />}
        ListEmptyComponent={<Text>No items found</Text>}
        initialNumToRender={10}
        windowSize={10}
      />
    </View>
  );
}
```

Exampleruns in Expo Snack

![List Items](data:image/webp;base64...)

To interact with it, run the code in Snack, where you can also edit it.

In this example, we begin by generating an array of ten objects using `fill` and `map`, each containing an `id` and a `title`. React Native requires every list item to have a stable, unique key, so we use the `id` field and pass it to `keyExtractor`. The `FlatList` then receives this array through its `data` prop, and each item is rendered using the `renderItem` function, which returns a memoized `Row` component for better performance.

Because `FlatList` is optimized for mobile scrolling through virtualization, it only renders items that are visible on screen, and props like `initialNumToRender` and `windowSize` help control how many items are rendered initially and kept in memory. We also include a `ListEmptyComponent` to handle cases where the list has no data. This structure ensures smooth scrolling, efficient rendering, and predictable updates.

💡 `FlatList` is a `PureComponent`, meaning it only re-renders when props change shallowly. Wrapping each row in `React.memo()` prevents unnecessary updates and improves performance, especially with long lists.

### Fixed Height Rows

If each row has a fixed height, you can add:

```
getItemLayout={(data, index) => ({
  length: 50,
  offset: 50 * index,
  index,
})}
```

This improves scroll-to-index performance and prevents layout jumps.
