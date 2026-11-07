Source: <https://seneca-ictoer.github.io/WEB530/Z-Guides/typescript>

# TypeScript for React Native

TypeScript is a powerful extension of JavaScript that adds static typing. This means you can define the types of variables, function parameters, and component props ahead of time. This helps catch errors early, improve code readability, and make your React Native apps more robust and maintainable.

## Why Use TypeScript in React Native?

TypeScript offers several benefits that make it a valuable tool for React Native development:

* Catch errors early: TypeScript checks your code for type errors before you even run your app, reducing runtime bugs.
* Better editor support: Tools like VS Code and Snack provide improved auto-completion and IntelliSense with TypeScript.
* Clearer components: By explicitly defining the types of props, your components become easier to understand and use.
* Scalability: TypeScript helps teams work together more effectively by making data structures and interfaces explicit.

React Native fully supports TypeScript, and you can write your components in `.tsx` files, which are just like `.js` files but with type annotations.

## Introduction to TypeScript Syntax

If you are new to TypeScript, here are some foundational concepts and syntax you should know.

### Variables and Types

In TypeScript, you declare variables with explicit types to ensure they hold the expected kind of data.

```
let count: number = 0; // number type
let name: string = 'Nicholas'; // string type
let isActive: boolean = true; // boolean type
```

### Arrays

Arrays can be typed to hold only specific types of elements.

```
let scores: number[] = [10, 20, 30];
let names: string[] = ['Ava', 'Ben', 'Chris'];
```

### Objects

You can define the shape of objects by specifying the types of their properties.

```
let user: { name: string; age: number } = {
  name: 'Ava',
  age: 21,
};
```

## Using TypeScript in React Native Components

React Native components are typically written in `.tsx` files. These files allow you to add type annotations to your components and props.

### Functional Component Without Props

Here is a simple example of a functional component written in TypeScript:

```
import React from 'react';
import { View, Text } from 'react-native';

export default function MyBox() {
  return (
    <View style={{ padding: 20, backgroundColor: 'lightblue' }}>
      <Text>Hello from TypeScript!</Text>
    </View>
  );
}
```

Exampleruns in Expo Snack

Opens the code in Snack, where you can edit it and see the result.

### Typing Component Props with Interfaces

Interfaces in TypeScript let you define the expected structure of props passed to components.

Example: Component with Typed Props

```
import { View, Text } from 'react-native';

interface GreetingProps {
  name: string; // required prop
  excited?: boolean; // optional prop
}

function Greeting({ name, excited }: GreetingProps) {
  return (
    <Text>
      Hello {name}
      {excited ? '!!!' : '.'}
    </Text>
  );
}

// Using the component
export default function App() {
  return (
    <View style={{ padding: 20 }}>
      <Greeting name="Ava" />
      <Greeting name="Ben" excited={true} />
    </View>
  );
}
```

Exampleruns in Expo Snack

Opens the code in Snack, where you can edit it and see the result.

If you remove `name="Ava"`, an editor that checks types (such as VS Code) marks the `<Greeting>` as an error, because a required prop is missing.

## Typing State with useState

React hooks like `useState` can also be typed to specify the type of state variables.

Example: Typed State

```
import React, { useState } from 'react';

const [count, setCount] = useState<number>(0);
```

TypeScript can often infer the type automatically:

```
const [name, setName] = useState('Ava'); // inferred as string
```

## Typing Event Handlers

You can type event handler functions to ensure they receive the correct parameters.

Example: Button Press Handler

```
const handlePress = (): void => {
  console.log('Pressed!');
};

<Button title="Press me" onPress={handlePress} />;
```

Example: TextInput Change Handler

```
const handleChange = (text: string) => {
  setName(text);
};

<TextInput value={name} onChangeText={handleChange} />;
```

## Combining Props, State, and Events

Here is a small but complete example that combines typed props, state, and event handlers.

```
import React, { useState } from 'react';
import { View, Text, Button } from 'react-native';

interface CounterProps {
  start: number;
}

function Counter({ start }: CounterProps) {
  const [count, setCount] = useState(start);

  return (
    <View style={{ padding: 20 }}>
      <Text style={{ fontSize: 24 }}>Count: {count}</Text>
      <Button title="+1" onPress={() => setCount((prev) => prev + 1)} />
    </View>
  );
}

export default function App() {
  return <Counter start={5} />;
}
```

Exampleruns in Expo Snack

Opens the code in Snack, where you can edit it and see the result.

## Typing API Data (Beginner Level)

When fetching data from an API, it is helpful to define interfaces for the expected response data.

```
interface Post {
  id: number;
  title: string;
  body: string;
}

const [posts, setPosts] = useState<Post[]>([]);
```

## When You Don’t Need to Use Types

While TypeScript is very useful, you don’t need to type everything. Here are some guidelines:

**Skip typing when:**

* The type is obvious (e.g., useState(0))
* You are prototyping quickly
* You are writing simple UI components

**Use types when:**

* Passing props to components
* Handling API data
* Managing complex state

## Summary

* TypeScript adds safety and clarity to React Native apps.
* Use interfaces to type props.
* Use typed state when needed.
* TypeScript works naturally with Snack and Expo.
