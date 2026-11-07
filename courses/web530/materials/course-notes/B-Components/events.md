Source: <https://seneca-ictoer.github.io/WEB530/B-Components/events>

# Event Handling

## Event Handlers

An **event handler** is a callback function that is triggered once an event takes place. For example, this could be a button click or when the value of a text box is changed. In React, we can configure event handlers on components by modifying the JSX. Let's take a look at a simple example. When the button is clicked, the status is changed from `Waiting` to `Clicked`.

```
import { useState } from 'react';
import { View, Text, Button } from 'react-native';

export default function App() {
  const [status, setStatus] = useState('Waiting');

  return (
    <View>
      <Text>Status: {status}</Text>
      <Button title="Click Me" onPress={(e) => setStatus('Clicked')} />
    </View>
  );
}
```

Exampleruns in Expo Snack

Opens the code in Snack, where you can edit it and see the result.

You can see that an event handler is attached within the JSX by adding the appropriate attribute. In the previous example, we have added `onPress={(e) => setStatus('Clicked')}` to the `<Button>` component. The handler is defined inline using arrow function syntax.

When you assign an event handler, React adds the handler to an internal dictionary of events and functions. Tracking events in this way allows React to keep the declarative UI structures separate from the platform we are running on. For example, if we are running our App in a browser, events are not attached to the underlying DOM element. Instead, there is a single event handler on the root of the app. Once fired, an event **bubbles up** through the tree to the root. React sees the event, checks its internal mapping, then runs the appropriate function. It may seem like a lot of effort but the benefits are plentiful. Since we don't rely on the DOM (or the specifics of the OS), we can wire up events using the same method on all platforms.

As we just learned, we will define events directly in our JSX markup. React uses a declarative approach for setting up event handlers. An advantage to this approach is that event handlers in JSX markup are part of the UI structure. If you compare this to something like JQuery, in JQuery you write imperative code that selects the relevant DOM element and attaches event handler functions. You are left no choice but to track down code that assigns event handlers making debugging and understanding program flow more difficult.

In the code example above, the event handler was coded inline within the JSX using arrow function syntax. This is handy if your function is simple but there are times when you need to perform multiple operations or add complex logic. In these cases, you can move the handler logic to a separate function, then call that function instead.

```
import { useState } from 'react';
import { View, Text, Button } from 'react-native';

export default function App() {
  const [status, setStatus] = useState('Waiting');

  const buttonClicked = () => {
    // Do a bunch of things here.
    setStatus('Clicked');
  };

  return (
    <View>
      <Text>Status: {status}</Text>
      <Button title="Click Me" onPress={buttonClicked} />
    </View>
  );
}
```

Exampleruns in Expo Snack

Opens the code in Snack, where you can edit it and see the result.

It is also possible to pass arguments to event handlers. In the following code example, we are rendering a list of buttons using the objects contained in the `players` array. When a button is clicked, the text is replaced to include the name of the player object associated to the button that was clicked. This code example combines many of the topics we have learned so far.

```
import { Component } from 'react';
import { View, Text, Button } from 'react-native';

class PlayerList extends Component {
  // Initially, the user has not picked their favourite player.
  state = {
    favouritePlayer: null,
  };

  // Event handler for the button onPress event.
  // We only define a single function, it will handle the onPress
  // event for all of the buttons. It accepts an argument.
  onPlayerSelected(number) {
    // Find the object associated to the number of the player.
    const { name } = this.props.players.find((i) => i.number === number);

    this.setState({ favouritePlayer: name });
  }

  render() {
    const { favouritePlayer } = this.state;

    // Conditionally render the <Text> element.
    let text;

    if (favouritePlayer) text = <Text>Your favourite player is {favouritePlayer}</Text>;
    else text = <Text>Choose your favourite player ...</Text>;

    return (
      <View>
        {text}
        {this.props.players.map(({ number, name }) => (
          // We must bind the event handler context in order for the function to access the
          // component, specifically the setState() function. In addition, pass the player.number
          // as an argument to the handler.
          <Button key={number} title={name} onPress={this.onPlayerSelected.bind(this, number)} />
        ))}
      </View>
    );
  }
}

export default function App() {
  // An array of objects passed to the <PlayerList> component as a
  // prop called players. Each player object will render its own <Button>
  const players = [
    { number: 34, name: 'Auston Matthews' },
    { number: 91, name: 'John Tavares' },
    { number: 63, name: 'Matias Maccelli' },
  ];

  return <PlayerList players={players} />;
}
```

Exampleruns in Expo Snack

Opens the code in Snack, where you can edit it and see the result.

## **Synthetic Events**

We discovered that events are bubbled up and handled by an internal mapping system. This allows for a more uniform approach for handling events that can be shared across different browsers or devices. React wraps each native event in an object with the same interface on every platform. These wrapped events are called **synthetic events**.

💡 **Event pooling (older React only)**
You may read in older tutorials that React reuses ("pools") synthetic event objects, so reading `e.target` inside asynchronous code fails. React 17 removed event pooling. In current React and React Native, an event object keeps its properties for as long as your code needs them.
