Source: <https://seneca-ictoer.github.io/WEB530/D-Navigation/handling-state>

# Handling State

On the previous page, we looked at examples that passed data between screens using route parameters. But many apps need shared global state, for example, an inventory count that updates across multiple screens. In React Navigation, there is no special navigation-specific state API. Instead, you manage global state the same way you would in any React app.

To keep things simple and modern, we’ll use Jotai, the lightweight global state library from [Hooks for Stateful Components](https://seneca-ictoer.github.io/WEB530/B-Components/hooks#global-state-with-jotai). It works well with React Native and React Navigation. Jotai lets you create small “atoms” that hold state, and any component can read or update them without prop drilling.

Below is a version of the earlier “custom header” example rewritten to use Jotai for global state. To run it in your own Snack, add `jotai` to the package.json from the previous page, along with `@types/react`. Jotai doesn't need `@types/react`, but Snack reports it as missing without it.

```
import { View, Text, Button } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { atom, useAtom } from 'jotai';

const Stack = createNativeStackNavigator();

// Global state atom
const itemsAtom = atom({
  first: 5,
  second: 0,
  third: 15,
});

// ItemList screen
function ItemList({ navigation }) {
  const [items] = useAtom(itemsAtom);

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Button
        title={`First Item (${items.first})`}
        onPress={() =>
          navigation.navigate('Details', {
            id: 'first',
            title: 'First Item',
            desc: 'First item description',
          })
        }
      />

      <Button
        title={`Second Item (${items.second})`}
        onPress={() =>
          navigation.navigate('Details', {
            id: 'second',
            title: 'Second Item',
            desc: 'Second item description',
          })
        }
      />

      <Button
        title={`Third Item (${items.third})`}
        onPress={() =>
          navigation.navigate('Details', {
            id: 'third',
            title: 'Third Item',
            desc: 'Third item description',
          })
        }
      />
    </View>
  );
}

// Details screen
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
            headerRight: () => <BuyButton route={route} />,
          })}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

// Header button that updates global state
function BuyButton({ route }) {
  const [items, setItems] = useAtom(itemsAtom);
  const id = route.params?.id;
  const qty = items[id] ?? 0;

  const decrement = () => {
    setItems((prev) => ({ ...prev, [id]: Math.max(0, prev[id] - 1) }));
  };

  return <Button title="Buy" onPress={decrement} disabled={qty === 0} />;
}
```

Exampleruns in Expo Snack

Opens the code in Snack, where you can edit it and see the result.

This example uses Jotai to manage global state in a way that feels natural with React Navigation. The `itemsAtom` holds the inventory counts for each item, and any screen can read or update this atom using the `useAtom` hook. The `ItemList` screen reads the atom to display the current quantities, and the `Details` screen uses a custom header button that also reads from the atom and updates it when the user taps “Buy.” Because Jotai atoms are reactive, updating the atom automatically refreshes both the header and the UI on any screen that uses the same state. There’s no prop drilling and no navigation-specific state API. It’s just clean, modern React state management that works seamlessly with navigation. Try it: press **Buy** on the first item a few times, then go back and watch its count on the list.

💡 Another valid way to share state across screens is to “lift state up” into your `App()` component and pass it down through `props`. This works, but it quickly becomes more complex as your app grows because every screen needs to receive and forward that state. Jotai avoids this entirely by giving you simple global atoms that any screen can read or update without prop drilling. For most React Native apps, especially when combined with navigation, Jotai is the cleaner and more scalable approach.
