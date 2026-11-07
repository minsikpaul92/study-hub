Source: <https://seneca-ictoer.github.io/WEB530/B-Components/class-components>

# Class Components (Optional)

This page documents how to work with props and state in [React's legacy Class Components](https://react.dev/reference/react/Component). You will be using [functional components](https://seneca-ictoer.github.io/WEB530/B-Components/func-components) in your apps, but you might come across older code samples or documentation that uses class-based components, so this can be useful context to have.

## **Component state and properties**

Components are useless unless they display or use data in some meaningful way. We will set some initial data so that our components can render the initial view. As data changes, React can track those changes and automatically update the UI. We will refer to each *snapshot* of the data as the **component state**. Whenever we tell a React component to change its state, the component will automatically re-render itself. The component state can be controlled by the component itself or by code that exists outside of the component itself.

**Properties** (or Attributes) are used to pass data into components. We will pass data to our components properties by modifying the JSX. Properties are different than state because they are typically set during the initial render but remain unchanged afterward. If a property is changed, then the component will need to be re-rendered to keep the display in sync. It is typically a parent component that decides when to re-render the component.

## **Working with component state**

If your component uses state, you should remember to set some initial data. Doing so will prevent render failures due to having unexpected or missing state values. When setting the state, we can simply pass a JavaScript object to the component. The object properties can be used to initialize the data.

```
import React from 'react';
import { View, Button } from 'react-native';

class MyComponent extends React.Component {
  // The initial state is set to a plain JavaScript object
  // with multiple state properties.
  state = {
    first: false,
    second: true,
  };

  render() {
    // The returned JSX uses the boolean "first" and "second" state
    // properties for the value of the <Button> "disabled" properties.
    // The state is set on lines 7-10 so we can safely read these values.
    return (
      <View>
        <Button disabled={this.state.first} title="First" />
        <Button disabled={this.state.second} title="Second" />
      </View>
    );
  }
}

export default function App() {
  return <MyComponent />;
}
```

Exampleruns in Expo Snack

Opens the code in Snack, where you can edit it and see the result.

We have set the initial state and safely rendered the component. What about updating the state after the component has already been rendered? In the example below, a component is rendered with the initial state. After three seconds, the state object is replaced by calling `setState()`. React will automatically detect the change of state and force the component to re-render itself.

```
import React from 'react';
import { View, Text } from 'react-native';

class MyComponent extends React.Component {
  // The initial state is set to a plain JavaScript object
  // with multiple state properties.
  state = {
    heading: 'React-Native (Initial)',
    body: 'Loading, just a moment please ...',
  };

  // This is a "lifecycle" method. It is invoked immediately after
  // a component is inserted into the tree (UI).
  componentDidMount() {
    // After 3 seconds, change the state. React will re-render
    // the component to show the new values.
    setTimeout(
      function () {
        this.setState({
          heading: 'React-Native (Updated)',
          body: 'The new state values have been rendered!',
        });
      }.bind(this),
      3000
    );
  }

  render() {
    // If we store the state into local variables the JSX will
    // look a bit cleaner and becomes easier to understand.
    const { heading, body } = this.state;

    return (
      <View>
        <Text>
          <Text>{heading}</Text>
          {'\n'}
          <Text>{body}</Text>
        </Text>
      </View>
    );
  }
}

export default function App() {
  return <MyComponent />;
}
```

Exampleruns in Expo Snack

React-Native (Initial)
Loading, just a moment please ...

⬇️

React-Native (Updated)
The new state values have been rendered!

To interact with it, run the code in Snack, where you can also edit it.

In the example above, the state object was replaced with a new object. Instead of replacing the entire state object each time, we can change single properties instead (leaving the rest of the state as it was).

```
// The initial state is set to a plain JavaScript object
// with multiple state properties.
state = {
    heading: "React-Native",
    body: "Loading, just a moment please ..."
}

componentDidMount() {
    // Only a single property is changed. React merges the new
    // state variable into the existing state variable.
    setTimeout(function () {
        this.setState({
            body: "Only the 'body' state variable was changed."
        });
    }.bind(this), 3000);
}
```

## **Working with component properties**

In React, **properties** are like state, they allow you to pass data into components. Unlike state, properties are usually only set once, when the component is rendered. Setting property values is slightly different than when working with state values.

💡 **Immutable**
An object or value that cannot be changed.

In the example, we are setting the default property values for a component. Notice the "static" keyword. The default properties are not instance variables as with component state. This is because properties are immutable so there is no need for them to be kept as instance variables.

```
import React from 'react';
import { View, Button } from 'react-native';

class MyComponent extends React.Component {
  // The default properties are set using a plain
  // JavaScript object. Notice the "static" keyword.
  static defaultProps = {
    firstTitle: 'First',
    secondDisabled: true,
  };

  render() {
    // Get the property values before we render the component.
    const { firstTitle, secondDisabled } = this.props;

    return (
      <View>
        <Button title={firstTitle} />
        <Button disabled={secondDisabled} title="Second" />
      </View>
    );
  }
}

export default function App() {
  return <MyComponent />;
}
```

Exampleruns in Expo Snack

Opens the code in Snack, where you can edit it and see the result.

Properties would be more useful if we could set them for each instance of a component directly in the JSX. Below you will find the revised App() function illustrating how the property value can be changed rather than using the default values. We can pass any valid JavaScript expression in the JSX.

```
export default function App() {
  return <MyComponent firstTitle="From Prop" secondDisabled={false} />;
}
```

## **Passing data from parent to child components**

Combining much of the content learned, we are initializing state and passing property data to child components from a parent component.

```
import { Component } from 'react';
import { View, Button } from 'react-native';

class ParentComponent extends Component {
  state = {
    items: ['First Child', 'Second Child', 'Third Child'],
  };

  render() {
    const { items } = this.state;

    return (
      <View>
        {items.map((item) => (
          // A child component is rendered for each item in the
          // state.items array. Data is passed using a property.
          <ChildComponent key={item} buttonTitle={item} />
        ))}
      </View>
    );
  }
}

class ChildComponent extends Component {
  render() {
    const { buttonTitle } = this.props;

    return <Button title={buttonTitle} />;
  }
}

export default function App() {
  return <ParentComponent />;
}
```

Exampleruns in Expo Snack

Opens the code in Snack, where you can edit it and see the result.

## **Lifecycle methods**

React components have a life cycle in which the framework executes various functions in a specific order. In fact, the `render()` function is a lifecycle method used to return the content to be rendered by a component.

There are three main lifecycle flows in React: when the component is first rendered (mounted), whenever it is updated, and when it is removed (unmounted).

**Initial Render**

`getDerivedStateFromProps()` `👉` `render()` `👉` `componentDidMount()`

**Update**

`getDerivedStateFromProps()` `👉` `shouldComponentUpdate()` `👉` `render()` `👉` `getSnapshotBeforeUpdate()` `👉` `componentDidUpdate()`

**Unmount**

`componentWillUnmount()`

### Methods

* **componentDidMount**
  This is called after the component is mounted. This method can be used to perform initialization work such as fetching data.
* **componentDidUpdate**
  This is called when the component is updated. In most cases you will not need to handle this event.
* **componentWillUnmount**
  Called when a component is about to be removed. Gives an opportunity to cancel any pending asynchronous requests.
* **getDerivedStateFromProps**
  Called when the component is first rendered or if a new property value is received. Allows you to update the state of the component based on property values.
* **getSnapshotBeforeUpdate**
  Called right before an update is shown on screen. It lets you read information from the current screen (such as a scroll position) before it changes. Whatever it returns is passed to `componentDidUpdate()`.
* **render**
  Returns the content to be rendered by the component. The method is called when the component is first mounted, if a property value is received, or when `setState()` is called.
* **shouldComponentUpdate**
  Called before `render()`, this method allows you to decide whether the component should re-render. Return `true` to allow rendering otherwise return `false`.
