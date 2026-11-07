Source: <https://seneca-ictoer.github.io/WEB530/B-Components/func-components>

# Functional Components

## Introduction

Functional Components are a simple and efficient way to create reusable UI elements in React and React Native. They use JavaScript functions instead of [classes](https://seneca-ictoer.github.io/WEB530/B-Components/class-components) (which used to be the standard way of writing React components), promoting a declarative coding style. Functional components can leverage React Hooks to manage state and lifecycle events. They offer simplicity, reusability, and composability, making development easier and more productive.

## **Functional components**

Functional components are a simplification of React's original version of [implementing classes](https://react.dev/reference/react/Component) that extend the `Component` class ([optional reading here](https://seneca-ictoer.github.io/WEB530/B-Components/class-components)). Functional components are usually easier to read and require less coding:

```
import { View, Text } from 'react-native';

// MyComponent is written as a functional component.
function MyComponent() {
  return (
    <View>
      <Text>
        <Text>React Native</Text>
        {'\n'}
        <Text>This is a functional component. It is Stateless.</Text>
      </Text>
    </View>
  );
}

export default function App() {
  return <MyComponent />;
}
```

Exampleruns in Expo Snack

Opens the code in Snack, where you can edit it and see the result.

In the example above, you can see that we have written `MyComponent` using a function. As you study the code example, you will notice that:

* `MyComponent()` function is a **pure function**. It affects nothing outside of its own scope, and always returns the same output given the same input.
* The function is written using JavaScript function syntax. It is also perfectly fine to declare the function using arrow function syntax:
  `const MyComponent = () => { … }`

## Properties (`props`)

Let's rewrite the component again, this time we will introduce properties. Our function will accept a new parameter `props` that will contain an object with each of the properties that were passed as attributes when the component was called:

```
import { View, Text } from 'react-native';

function MyComponent(props) {
  return (
    <View>
      <Text>
        <Text>{props.heading}</Text>
        {'\n'}
        <Text>This is a functional component. It has {props.body}.</Text>
      </Text>
    </View>
  );
}

export default function App() {
  return <MyComponent heading="React Native" body="props" />;
}
```

Exampleruns in Expo Snack

React Native
This is a functional component. It has props.

To interact with it, run the code in Snack, where you can also edit it.

[Default properties](https://react.dev/learn/passing-props-to-a-component#specifying-a-default-value-for-a-prop) can be added by destructuring the props object and adding default values using standard JavaScript syntax:

```
import { View, Text } from 'react-native';

function MyComponent(props) {
  return (
    <View>
      <Text>
        <Text>{props.heading || 'React Native Default Props'}</Text>
        {'\n'}
        <Text>This is a functional component. It has {props.body || 'default props'}.</Text>
      </Text>
    </View>
  );
}

export default function App() {
  return <MyComponent heading="React Native" />;
}
```

Exampleruns in Expo Snack

React Native
This is a functional component. It has default props.

To interact with it, run the code in Snack, where you can also edit it.

It is often simpler to [destructure the props](https://react.dev/learn/passing-props-to-a-component#step-2-read-props-inside-the-child-component) directly in the parameter declaration, leaving out the props keyword altogether:

```
import { View, Text } from 'react-native';

function MyComponent({ heading = 'React Native Default Props', body = 'default props' }) {
  return (
    <View>
      <Text>
        <Text>{heading}</Text>
        {'\n'}
        <Text>This is a functional component. It has {body}.</Text>
      </Text>
    </View>
  );
}

export default function App() {
  return <MyComponent heading="React Native" />;
}
```

Exampleruns in Expo Snack

React Native
This is a functional component. It has default props.

To interact with it, run the code in Snack, where you can also edit it.
