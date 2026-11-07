Source: <https://seneca-ictoer.github.io/WEB530/C-Styling/stylesheets>

# React Native StyleSheets

When building web pages, we use CSS StyleSheets to describe the presentation of elements. We will continue this trend as we work with React Native applications. By moving styles out of the JSX, you will keep the code concise and easier to understand.

Check out the following example. We are building a new StyleSheet by passing a JavaScript object to the `StyleSheet.create()` function. The stylesheet contains two styles: `container` and `title`. To assign a style to the appropriate component, we set the `style` property, for example `<View style={styles.container}>`.

```
import { View, Text, StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: '#eaeaea',
  },
  title: {
    marginTop: 16,
    paddingVertical: 8,
    borderWidth: 4,
    borderColor: '#20232a',
    borderRadius: 6,
    backgroundColor: '#61dafb',
    color: '#20232a',
    textAlign: 'center',
    fontSize: 30,
    fontWeight: 'bold',
  },
});

export default function App() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>React Native</Text>
    </View>
  );
}
```

Exampleruns in Expo Snack

![Styled Container](data:image/png;base64...)

To interact with it, run the code in Snack, where you can also edit it.

Depending on the platform, we may need to fine-tune our styles. For example, you may need to apply different padding to prevent components from rendering below the status bar of the device. React Native contains a Platform interface that allows us to learn about the underlying OS. Let's take advantage of Platform and rewrite the container style so that it renders a different UI depending on the device used.

```
import { View, Text, StyleSheet, Platform, StatusBar } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#eaeaea',
    ...Platform.select({
      ios: { padding: 20 },
      android: { paddingTop: StatusBar.currentHeight },
    }),
  },
  // ...
});
```

On android devices, we can determine the height of the status bar by reading from `StatusBar.currentHeight` but this is not possible on iOS. To workaround the differences in the platform, we use `Platform.select()` to add conditional styles that render different interfaces on different devices.

### **Building responsive layouts using Flexbox**

Before the flexbox layout model was introduced, approaches used to build layouts were hacky and prone to errors. Flexbox provides a simple and elegant way to build layouts by abstracting many of the properties that are required in order to make the layout work.

The Flexible Layout module (or flexbox) is a box model that allows a one-dimensional layout method for arranging items in rows or columns. Items grow to fill additional space or shrink to fit into smaller spaces.

The main idea is to give a container the ability to alter its items' width, height and order to best fill the available space. The flexbox layout is direction-agnostic, as opposed to regular layouts, and works very well for components of an application.

If you haven't had an opportunity to work with Flexbox, check out the [Complete Guide to Flexbox](https://css-tricks.com/snippets/css/a-guide-to-flexbox/). The article is a great place to start learning to build flexible layouts.

Let's implement a simple layout with three sections that flex from the top to bottom of the screen. We use `flex` as a short hand for `flex-grow`, `flex-shrink`, and `flex-basis`. Using this shorthand is recommended rather than setting individual properties since it will set other values intelligently.

As you review the example, you may notice that the `flexDirection` is set to `column` yet our output shows three rows. We use `column` because that is the direction in which the items will be rendered. That is, they are contained vertically, in a column.

It is important to realize that the output will look correct regardless of the device orientation. When a device is rotated the UI will adjust appropriately.

```
import { View, Text, StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    padding: 10,
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'space-around',
  },

  cell: {
    flexGrow: 1,
    alignSelf: 'stretch',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'lightgray',
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: 'darkslategray',
  },

  cellText: {
    color: 'darkslategray',
    fontWeight: 'bold',
  },
});

export default function App() {
  return (
    <View style={styles.container}>
      <View style={styles.cell}>
        <Text style={styles.cellText}>Top</Text>
      </View>
      <View style={styles.cell}>
        <Text style={styles.cellText}>Middle</Text>
      </View>
      <View style={styles.cell}>
        <Text style={styles.cellText}>Bottom</Text>
      </View>
    </View>
  );
}
```

Exampleruns in Expo Snack

![Flexbox Column](https://seneca-ictoer.github.io/WEB530/assets/images/ex2-flex-col-c065189e92ff284af15d6c251358b546.png)

To interact with it, run the code in Snack, where you can also edit it.

If we change the `flexDirection` to `row` instead, we get the following output. Try it in the example above: run it, then change `'column'` to `'row'`.

![Flexbox Row](https://seneca-ictoer.github.io/WEB530/assets/images/ex2-flex-row-804d467c17e5b512d95419bb39bb351c.png)
