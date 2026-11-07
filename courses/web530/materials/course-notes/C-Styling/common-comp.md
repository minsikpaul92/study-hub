Source: <https://seneca-ictoer.github.io/WEB530/C-Styling/common-comp>

# Common React Native Components

## **View**

This is the most fundamental component for building a UI. A `View` is a container that maps directly to the native view equivalent: `UIView` on iOS, `android.View` on Android, or `<div>` in a browser. Views can be styled and can hold other views and components.

Learn more: [View](https://reactnative.dev/docs/view)

## **Text**

A component for displaying text. Like the `View` component, you can style and nest a `Text` component. In fact, nesting is an easy way to display formatted text rather than annotating ranges of a string with specific formatting (like bold or colours). Inner `Text` components will inherit styles (such as fontFamily) from parent components.

Unlike most other components, `Text` is unique relative to layout. Everything inside a `<Text>` block no longer uses the Flexbox layout. Instead, it uses a text layout, meaning that nested `Text` components are no longer rectangles, but wrap when they see the end of the line.

Learn more: [Text](https://reactnative.dev/docs/text)

## **Button**

A basic button component that renders correctly on any platform. When clicked, a button will fire the `onPress` event. Although the styling is not completely customizable, buttons do support standard states such as the `disabled` state.

Learn more: [Button](https://reactnative.dev/docs/button)

## **TextInput**

A component for capturing text from the user. Using properties, a `TextInput` can be configured to provide several features, such as auto-correction, auto-capitalization, placeholder text, multi-line text, and different keyboard types, such as a numeric keypad or email keyboard.

When the user modifies the contents of a `TextInput`, the `onChangeText` event is fired. Other common events include the `onSubmitEditing` and `onFocus` events.

Learn more: [TextInput](https://reactnative.dev/docs/textinput)

## **Switch**

Rendered as a toggle, this component provides an easy way to represent Boolean values. This is a controlled component and therefore the programmer is responsible for updating a property to reflect the correct state (toggled or not). By implementing a handler for the `onValueChange` event, you can set the `value` to keep the toggle synchronized with the value.

Learn more: [Switch](https://reactnative.dev/docs/switch)

## **FlatList & SectionList**

A component for rendering lists. A `FlatList` supports "Pull to Refresh" and "Scroll loading". You can even group list items under headings by using a `<SectionList>`.

Learn More: [FlatList](https://reactnative.dev/docs/flatlist), [SectionList](https://reactnative.dev/docs/sectionlist)

## **Image**

Renders an image on the UI. In order to be useful, you must first provide the image data to the component. There are two ways to load the image data, via the network (using a URI) or by providing the data to the component. If you have the image stored as a file within your application, you can use `require()` to use it as an image source.

It is worth noting that an `Image` loaded from the network will not display unless the width and height style properties are set. (Images loaded with `require()` already know their size.) There is also a `resizeMode` property in case you need to scale the image so that it fits within the dimensions of the actual component.

Learn More: [Image](https://reactnative.dev/docs/image)

```
import React from 'react';
import { View, Image, StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    paddingTop: 50,
  },
  image: {
    width: 50,
    height: 50,
  },
});

const MyImageComponent = () => {
  return (
    <View style={styles.container}>
      <Image style={styles.image} source={{ uri: 'https://reactnative.dev/img/tiny_logo.png' }} />
      <Image
        style={styles.image}
        source={{
          uri: 'data:image/png;base64, iVBORw0KGgoAAAANSUhEUgAAADMAAAAzCAYAAAA6oTAqAAAAEXRFWHRTb2Z0d2FyZQBwbmdjcnVzaEB1SfMAAABQSURBVGje7dSxCQBACARB+2/ab8BEeQNhFi6WSYzYLYudDQYGBgYGBgYGBgYGBgYGBgZmcvDqYGBgmhivGQYGBgYGBgYGBgYGBgYGBgbmQw+P/eMrC5UTVAAAAABJRU5ErkJggg==',
        }}
      />
    </View>
  );
};

export default function App() {
  return <MyImageComponent />;
}
```

Exampleruns in Expo Snack

![Images](https://seneca-ictoer.github.io/WEB530/assets/images/ex3-images-9ac48219a706766e312c55b3e69686dc.png)

To interact with it, run the code in Snack, where you can also edit it.

## **Icons**

One more thing about images ... it is possible to use icon fonts such as FontAwesome directly in your React Native apps. Expo projects (and Snack) include the `@expo/vector-icons` package, which bundles many popular icon sets. Import the set you want and pass the icon's `name`, `size` and `color`. You can search every available icon in the [icon directory](https://icons.expo.fyi/).

```
import { View, StyleSheet } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';

export default function App() {
  return (
    <View style={styles.container}>
      <FontAwesome name="home" size={32} color="#20232a" />
      <FontAwesome name="heart" size={32} color="#e53935" />
      <FontAwesome name="star" size={32} color="#fbc02d" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    gap: 24,
    paddingTop: 50,
    paddingLeft: 24,
  },
});
```

Exampleruns in Expo Snack

Opens the code in Snack, where you can edit it and see the result.
