Source: <https://seneca-ictoer.github.io/WEB530/B-Components/hooks>

# Hooks for Stateful Components

## Introduction to Hooks

The React Hook API introduces the `useState()` function. `useState()` enables your functional component to become stateful, i.e. it can remember things between each time it is called. Let's look at a code example. In the example we will configure and use initial state values.

```
import { useState } from 'react';
import { View, Text } from 'react-native';

export default function App() {
  const [name] = useState('WEB530');
  const [year] = useState(1967);

  return (
    <View>
      <Text>Welcome to {name}</Text>
      <Text>Established in {year}</Text>
    </View>
  );
}
```

Exampleruns in Expo Snack

Welcome to WEB530
Established in 1967

To interact with it, run the code in Snack, where you can also edit it.

The `App` component is a *stateful* functional component thanks to the `useState()` hook. The example initializes two pieces of state, `name` and `year`, by calling `useState()` once for each state value. You can have as many pieces of state that you need, simply call `useState()` for each. Although it is possible to store a JavaScript object as a state value, it can complicate things and isn't recommended.

Look closely at the code example. You will notice that when we call `useState()`, square brackets surround the variable name. Check out line 5 where it says `[name]`. The reason we use the brackets is because `useState()` returns an array and so can take advantage of array destructuring syntax. The first value of the array is the state value, this is later injected into the UI. The second value of the array is a function that can be used to update the value. Since we are not changing the state, we discard this value. Now let's check out an example where the state is changed.

```
import React, { useState } from 'react';
import { View, Text, TextInput } from 'react-native';

export default function App() {
  // Notice we are destructuring a second variable,
  // it is used for changing the "name" state value.
  const [name, setName] = useState('Paula');

  return (
    <View>
      <Text>What is your name?</Text>
      <TextInput value={name} onChangeText={setName} />
      <Text>Your name is {name}.</Text>
    </View>
  );
}
```

Exampleruns in Expo Snack

What is your name?
Paula
Your name is Paula.

To interact with it, run the code in Snack, where you can also edit it.

In the code example, you will notice we now destructure multiple variables from the array returned by `useState()`. `setName` refers to a function that can be used to change the State. The code above automatically calls the `setName()` function any time the text is changed but we could call it manually using something like `setName("New Name")`. After `setName()` is called the `name` is updated and the UI refreshed.

With functional components that use the `useState()` hook, you can see that we will need to update each piece of state individually. Unlike `setState()` where we could merge multiple pieces of state at the same time, we now have individual functions.

### Updating state based on the previous value

There is one trap with the setter function. The state variable is a plain value that was filled in when the component rendered. It does not change until the next render. If the new value depends on the old one, calculating it from the variable can go wrong. In the example, the button is meant to add 2 by calling `setCount()` twice.

```
import { useState } from 'react';
import { View, Text, Button } from 'react-native';

export default function App() {
  const [count, setCount] = useState(0);

  return (
    <View>
      <Text>Count: {count}</Text>
      <Button
        title="Add 2"
        onPress={() => {
          // Bug: both calls read the same count.
          setCount(count + 1);
          setCount(count + 1);
        }}
      />
    </View>
  );
}
```

Exampleruns in Expo Snack

Count: 0

⬇️ *after pressing the button once*

Count: 1

To interact with it, run the code in Snack, where you can also edit it.

The count goes up by 1, not 2. Both calls read the same `count` of `0`, so both ask React to make it `1`. The same thing happens when the update is delayed by a timer or an effect: the code uses whichever value `count` had when it was written, not the current one.

The fix is to pass a function to the setter instead of a value. React calls the function with the latest state and uses whatever it returns.

```
onPress={() => {
  setCount((prev) => prev + 1);
  setCount((prev) => prev + 1);
}}
```

Now each call receives the value produced by the one before it and the count goes up by 2.

💡 Whenever the new state depends on the old state, always use the function form: `setCount((prev) => prev + 1)`, `setOn((prev) => !prev)`, `setItems((prev) => [...prev, item])`. If it does not, such as `setName('Paula')`, pass the value directly.

## Running Side Effects with `useEffect`

The `useEffect()` hook is used to run "side effects" in your component. Remember, functional components only have one job, that is, to return JSX content. If a component needs to do something else this should be done by a `useEffect()` hook.

So, what kind of initialization or cleanup would a component need to handle? There are many reasons for developers to implement this functionality. A common example could be, loading data. You could use the `fetch API` to fetch data from a remote device and display it on your UI. Fetching is an asynchronous operation and if not implemented correctly, may introduce race conditions or buggy behaviour. Using `useEffect()` we can minimize these problems.

💡 **Race condition**
Occurs when the sequence or timing of events is important. A race condition can occur when events execute in an undesirable order. [Still unclear?](https://techterms.com/definition/race_condition)

The `useEffect()` hook takes two arguments: a function to run, and an optional **dependency array**. React calls the function after the component finishes rendering. An empty array (`[]`) means the effect doesn't depend on any props or state, so it runs only once, after the first render.

```
import { useEffect, useState } from 'react';
import { View, Text } from 'react-native';

// A utility function to fake a call to the fetch API.
// This returns user information after 2 seconds.
function fetchUser() {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ id: 99, name: 'Wayne' });
    }, 2000);
  });
}

export default function App() {
  const [id, setId] = useState(0);
  const [name, setName] = useState('');
  const [status, setStatus] = useState('Loading ...');

  // Runs once, after the first render.
  useEffect(() => {
    fetchUser().then((user) => {
      setId(user.id);
      setName(user.name);
      setStatus('Ready ...');
    });
  }, []);

  return (
    <View>
      <Text>ID: {id}</Text>
      <Text>Name: {name}</Text>
      <Text>Status: {status}</Text>
    </View>
  );
}
```

Exampleruns in Expo Snack

ID: 0
Name:
Status: Loading ...

⬇️ *after about two seconds*

ID: 99
Name: Wayne
Status: Ready ...

To interact with it, run the code in Snack, where you can also edit it.

Leave out the array and the effect runs after *every* render. Because this effect updates state, and updating state causes another render, the user would be fetched again every time the first fetch finished.

### Cleaning up an effect

After about two seconds, the user is fetched and the UI is updated. But the user might leave the screen before the response arrives. The `.then()` callback still runs later and tries to update a component that no longer exists. React ignores that update, but the work is wasted, and the same pattern causes real bugs when an effect runs more than once: a slow, older response can arrive after a newer one and overwrite it.

To handle this, an effect can return a **cleanup function**. React calls it when the component is removed from the screen (unmounted), and also before it runs the effect again. Promises can't be cancelled, so the usual pattern is a flag that tells the callback to ignore a result that is no longer wanted.

```
import { useEffect, useState } from 'react';
import { View, Text } from 'react-native';

// A utility function to fake a call to the fetch API.
// This returns user information after 2 seconds.
function fetchUser() {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ id: 99, name: 'Wayne' });
    }, 2000);
  });
}

export default function App() {
  const [id, setId] = useState(0);
  const [name, setName] = useState('');
  const [status, setStatus] = useState('Loading ...');

  useEffect(() => {
    let ignore = false;

    fetchUser().then((user) => {
      // Skip the update if the cleanup has already run.
      if (!ignore) {
        setId(user.id);
        setName(user.name);
        setStatus('Ready ...');
      }
    });

    // The cleanup function.
    return () => {
      ignore = true;
    };
  }, []);

  return (
    <View>
      <Text>ID: {id}</Text>
      <Text>Name: {name}</Text>
      <Text>Status: {status}</Text>
    </View>
  );
}
```

Exampleruns in Expo Snack

Opens the code in Snack, where you can edit it and see the result.

By adding `return () => { ... }` to the end of the effect, React now knows how to clean it up. If the component unmounts before the user arrives, `ignore` is set to `true` and the callback leaves the state alone.

### Effects that depend on a value

When an effect uses props or state, list them in the dependency array. After each render, React compares every value in the array with the one from the previous render. If any of them changed, React runs the previous cleanup and then runs the effect again.

In the example below, the user to load depends on `userId`. Pressing a button changes the ID, so the effect fetches that user. Try pressing **User 1** and then quickly **User 2**. The cleanup for the first request runs as soon as the ID changes, so its late response can't overwrite the second user.

```
import { useEffect, useState } from 'react';
import { View, Text, Button } from 'react-native';

const names = { 1: 'Wayne', 2: 'Mario' };

// Fakes a call to the fetch API. User 1 takes 3 seconds, user 2 takes 1.
function fetchUser(id) {
  return new Promise((resolve) => {
    setTimeout(() => resolve({ id, name: names[id] }), id === 1 ? 3000 : 1000);
  });
}

export default function App() {
  const [userId, setUserId] = useState(1);
  const [user, setUser] = useState(null);

  useEffect(() => {
    let ignore = false;
    setUser(null);

    fetchUser(userId).then((result) => {
      if (!ignore) setUser(result);
    });

    return () => {
      ignore = true;
    };
  }, [userId]); // Run again whenever userId changes.

  return (
    <View>
      <Text>Selected user: {userId}</Text>
      <Text>Name: {user ? user.name : 'Loading ...'}</Text>
      <Button title="User 1" onPress={() => setUserId(1)} />
      <Button title="User 2" onPress={() => setUserId(2)} />
    </View>
  );
}
```

Exampleruns in Expo Snack

Opens the code in Snack, where you can edit it and see the result.

Without the `ignore` flag, pressing **User 1** then **User 2** would show Mario first and then, when the slower request finished, replace him with Wayne even though user 2 is selected.

💡 A real `fetch()` request can be cancelled, not just ignored. Create an [`AbortController`](https://developer.mozilla.org/en-US/docs/Web/API/AbortController), pass its `signal` to `fetch()`, and call `controller.abort()` in the cleanup function.

## Lifting State Up

Sometimes multiple components need to work with the same piece of data. When this happens, each component should not keep its own separate state. Instead, React encourages a pattern called `lifting state up`. This means you move the shared state into the closest common parent component, then pass the data down as props.

This keeps your UI consistent and prevents components from getting *out of sync*.

**Why lift state up?**

You should lift state up when:

* Two or more components need to display the same data.
* One component needs to update data that another component reads.
* You find yourself duplicating state in multiple places.
* Components behave inconsistently because they each track their own version of the data.

React uses *one‑way data flow*, so the parent becomes the single source of truth.

In the example, we have two components:

* `<NameInput />`: lets the user type their name
* `<NamePreview />`: displays the name

Both components need access to the same value, so the state must live in the parent.

```
import { useState } from 'react';
import { View, Text, TextInput } from 'react-native';

function NameInput({ name, onChange }) {
  return <TextInput value={name} onChangeText={onChange} />;
}

function NamePreview({ name }) {
  return <Text>Your name is {name}</Text>;
}

export default function App() {
  const [name, setName] = useState('');

  return (
    <View>
      <Text>What is your name?</Text>
      <NameInput name={name} onChange={setName} />
      <NamePreview name={name} />
    </View>
  );
}
```

Exampleruns in Expo Snack

Opens the code in Snack, where you can edit it and see the result.

**How this works**

* The `App` component owns the `name` state.
* `NameInput` receives the current value and a function to update it.
* `NamePreview` receives the current value only.
* Both components always stay synchronized because they rely on the same source of truth.

**Benefits of lifting state up**

* Prevents duplicated or conflicting state.
* Makes data flow predictable.
* Keeps components simple and focused.
* Helps you reason about where state should live.

💡 If multiple components need the same data, the state belongs in their nearest shared parent.

## Keeping Functions Stable with `useCallback`

The dependency array of `useEffect()` works by comparing each value with the value from the previous render. For numbers, strings and booleans this is simple: `1` is the same as `1`. Functions are different. Every time a component renders, any function declared inside it is created again as a brand new object, even though the code inside it has not changed. React compares functions by identity, so the `handleTick` from one render is *not* the same as the `handleTick` from the next render.

This matters when a function is a dependency of `useEffect()`. In the example, `App` owns a counter and passes a function down to `<Ticker />`. The `Ticker` starts a one second timer and calls the function when the timer fires.

```
import { useEffect, useState } from 'react';
import { View, Text } from 'react-native';

function Ticker({ onTick }) {
  useEffect(() => {
    const id = setTimeout(() => {
      onTick();
    }, 1000);

    return () => {
      clearTimeout(id);
    };
  }, [onTick]);

  return <Text>Ticking ...</Text>;
}

export default function App() {
  const [count, setCount] = useState(0);

  const handleTick = () => {
    setCount((prev) => prev + 1);
  };

  return (
    <View>
      <Text>Ticks: {count}</Text>
      <Ticker onTick={handleTick} />
    </View>
  );
}
```

Exampleruns in Expo Snack

Ticks: 0
Ticking ...

⬇️ *one second later, and every second after that*

Ticks: 1
Ticks: 2
Ticks: 3
...

To interact with it, run the code in Snack, where you can also edit it.

The counter never stops. Follow the chain of events:

1. `Ticker` renders and the effect starts a timer.
2. The timer fires and calls `onTick`, which updates the state in `App`.
3. `App` re-renders and creates a **new** `handleTick` function.
4. `Ticker` re-renders with a new `onTick` prop. React compares it with the old one, sees a different function, runs the clean-up and runs the effect again, which starts another timer.
5. Return to step 2.

Each tick schedules the next one. The effect depends on a value that changes on every render, so it runs on every render.

A tempting fix is to pass an empty array so the effect only runs once.

```
useEffect(() => {
  const id = setTimeout(() => {
    onTick();
  }, 1000);

  return () => {
    clearTimeout(id);
  };
}, []);
```

The counter now ticks once and stops, but the editor shows a warning: `React Hook useEffect has a missing dependency: 'onTick'`. The effect uses `onTick` but claims to depend on nothing. React will keep calling the `onTick` it captured on the first render, even if the parent later passes a different function. In this small example that is harmless. In a larger app it is a common source of bugs where an effect quietly works with out of date values, so the warning should not be ignored.

The correct fix is to stop the function from changing in the first place. The `useCallback()` hook takes a function and a dependency array, and returns the same function object on every render for as long as the dependencies stay the same.

```
import { useCallback, useEffect, useState } from 'react';
import { View, Text } from 'react-native';

function Ticker({ onTick }) {
  useEffect(() => {
    const id = setTimeout(() => {
      onTick();
    }, 1000);

    return () => {
      clearTimeout(id);
    };
  }, [onTick]);

  return <Text>Ticking ...</Text>;
}

export default function App() {
  const [count, setCount] = useState(0);

  const handleTick = useCallback(() => {
    setCount((prev) => prev + 1);
  }, []);

  return (
    <View>
      <Text>Ticks: {count}</Text>
      <Ticker onTick={handleTick} />
    </View>
  );
}
```

Exampleruns in Expo Snack

Opens the code in Snack, where you can edit it and see the result.

Now `handleTick` is created once. Every render of `App` passes the identical function to `Ticker`, the `[onTick]` dependency never changes, and the effect runs once. The dependency array is honest, there is no warning, and the counter ticks a single time.

Notice that `handleTick` uses the function form of the setter, `setCount((prev) => prev + 1)`, because the new count depends on the old one. With `useCallback()` this matters even more. A function created with `useCallback(..., [])` is created once, so if it used `count` it would only ever see the `count` from the first render, which is `0`, and every tick would set the count to `1`. The function form asks React for the latest value instead, so the callback doesn't depend on `count` at all and the empty array is truthful.

💡 `useCallback()` is not a performance tool to wrap around every function. Reach for it when a function is a dependency of `useEffect()`, or when it is passed to a child component that must not re-render needlessly. Everywhere else, a plain function is simpler and just as fast.

## Sharing data via context

Typically, React components will fetch the data that they *and their children* need but sometimes it is convenient for our app to load *global* data that can be shared across multiple components. To share global data, you can use the React **Context API**. Components that are rendered within a context are able to access the data provided by the context.

```
import { createContext, useContext, useEffect, useState } from 'react';
import { View, Text } from 'react-native';

const UserContext = createContext();

// A utility function to fake a call to the fetch API.
// This returns user information after 2 seconds.
function fetchUser() {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ id: 99, name: 'Wayne' });
    }, 2000);
  });
}

// A container component. It shares state information
// with child components using a context.
function UserContextProvider({ children }) {
  const [user, setUser] = useState({
    id: 0,
    name: '...',
  });

  useEffect(() => {
    fetchUser().then((user) => {
      setUser({
        id: user.id,
        name: user.name,
      });
    });
  }, []);

  return <UserContext.Provider value={user}>{children}</UserContext.Provider>;
}

// Renders a <Text> component that includes the user name.
// The name is obtained from the context provided by the
// UserContextProvider. As the name changes the UI is updated.
function UserInfo() {
  const user = useContext(UserContext);

  return <Text>User name is {user.name}</Text>;
}

export default function App() {
  return (
    <View>
      <UserContextProvider>
        <View>
          <UserInfo />
        </View>
        <View>
          <UserInfo />
        </View>
        <View>
          <UserInfo />
        </View>
      </UserContextProvider>
    </View>
  );
}
```

Exampleruns in Expo Snack

Opens the code in Snack, where you can edit it and see the result.

Study the code example. On line 4, we create a new context by calling `createContext()`. Next we have our utility function for fetching user data. This is similar to the `fetchUser()` function in the other code examples except that we are setting the state value to an object rather than setting individual properties. Finally, we have a `UserContextProvider()` function. The job of this component is to fetch the user information and update the context when the information has been received back by the API.

You will notice the `UserContextProvider()` function accepts an argument `{ children }`. You will also notice that it renders a `<UserContext.Provider>` component. The `<UserContext.Provider>` will act as a container sharing data with the child components. In the example, we are sharing the `user` object by passing it into the `value` attribute.

In our main app component, we render multiple `<UserInfo>` components *used for displaying the user name*. This component grabs the shared data from the parent context provider by calling `useContext()`. As the data is changed, the UI is updated.

**Output:**

User name is ...
User name is ...
User name is ...

⬇️ *after about two seconds*

User name is Wayne
User name is Wayne
User name is Wayne

It is worth mentioning that the `<UserInfo>` component has no knowledge of the global data. Instead of passing the data down from the top-level component as property values, we can rely on the `useContext()` function to provide access to the global data. Components (like the inner `<View>` components) that have nothing to do with the data don't need (or care) about it.

## Global State with Jotai

The React Context API is useful for sharing global data, but it can become verbose as your app grows. You need to create a context, wrap your components in a provider, and manually pass values through the provider’s value attribute. For many apps, this is more setup than necessary.

Jotai is a lightweight state‑management library that makes global state feel as simple as using `useState()`. Instead of creating providers or reducers, you create small pieces of state called `atoms`. Any component can read or update an atom directly.

Jotai works in React Native and Expo with no extra configuration. To use it in your own Snack, add `jotai` to `package.json`. Snack also asks for `@types/react`, which Jotai lists as optional; add it too to clear the message.

**Why Jotai?**

Jotai gives you:

* Global state with the simplicity of `useState`.
* No providers to wrap your app.
* No reducers, actions, or boilerplate.
* Automatic updates across all components that use the same atom.

*If Context feels like “plumbing,” Jotai feels like “just state.”*

Here is the same “global user” idea from the Context example, rewritten using Jotai.

```
import { atom, useAtom } from 'jotai';
import { useEffect } from 'react';
import { View, Text } from 'react-native';

// A global atom that stores the user object.
const userAtom = atom({ id: 0, name: '...' });

// A utility function to fake a call to the fetch API.
function fetchUser() {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ id: 99, name: 'Wayne' });
    }, 2000);
  });
}

function UserLoader() {
  const [, setUser] = useAtom(userAtom);

  useEffect(() => {
    fetchUser().then((user) => {
      setUser(user);
    });
  }, []);

  return null; // This component only loads data.
}

function UserInfo() {
  const [user] = useAtom(userAtom);
  return <Text>User name is {user.name}</Text>;
}

export default function App() {
  return (
    <View>
      <UserLoader />
      <UserInfo />
      <UserInfo />
      <UserInfo />
    </View>
  );
}
```

Exampleruns in Expo Snack

Opens the code in Snack, where you can edit it and see the result.

**How this works**

* `userAtom` is a global piece of state.
* Any component can read it with `useAtom(userAtom)`.
* Any component can update it with the setter returned by `useAtom`.
* When the atom changes, all components using it automatically re-render.
* No providers, no context tree, no prop drilling.

**When to choose Jotai over Context**

Use Jotai when:

* You want global state without boilerplate.
* You want something simpler than Redux or Context.
* Multiple components need to read/write the same data.

Context is still useful for things like themes or configuration, but for shared data that changes over time, Jotai is often the cleaner choice.
