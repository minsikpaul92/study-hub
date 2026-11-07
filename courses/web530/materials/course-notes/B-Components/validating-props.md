Source: <https://seneca-ictoer.github.io/WEB530/B-Components/validating-props>

# Validating Props

## **Validating Component Properties**

You can think of property validation in components similar to field validation in HTML forms. The goal is to inform *developers* implementing a component that they have provided a value that is not acceptable. This improves the experience for developers that are interacting with components you have created.

### Type Validation

The `prop-types` package includes simple property type validators that can handle most primitive types of JavaScript values. You will use these validators frequently to ensure property values contain the expected data type. It is worth noting that if you do not pass a value to a given property, the type is not validated and no warning is displayed.

```
import React from 'react';
import { View, Text, TextInput } from 'react-native';
import PropTypes from 'prop-types';

const MyComponent = function ({ myString, myNumber, myBool, myFunc, myArray, myObject }) {
  return (
    <View>
      <Text>{myString}</Text>
      <Text>{myNumber}</Text>
      <TextInput editable={myBool} placeholder="Enter text" />
      <Text>{myFunc()}</Text>
      <Text>
        {myArray.map((i) => (
          <Text key={i}>{i}</Text>
        ))}
      </Text>
      <Text>{myObject.myProp}</Text>
    </View>
  );
};

MyComponent.propTypes = {
  myString: PropTypes.string,
  myNumber: PropTypes.number,
  myBool: PropTypes.bool,
  myFunc: PropTypes.func,
  myArray: PropTypes.array,
  myObject: PropTypes.object,
};

export default function App() {
  return (
    <MyComponent
      myString="String"
      myNumber={42}
      myBool={false}
      myFunc={() => 'Function'}
      myArray={['A', 'B', 'C']}
      myObject={{ myProp: 'Object.myProp' }}
    />
  );
}
```

Copy and paste the previous code example into the course's React playground, then try changing the property values so they use the wrong types. For example, change `myBool={false}` to `myBool={"false"}`. You should see a warning similar to: Failed prop type: Invalid prop `myBool` of type `string` supplied to `MyComponent`, expected `boolean`.

💡 React 19 removed `propTypes` checking, so these warnings only appear in React 18 and earlier. The course playground uses React 18 for this reason. Expo SDK 53 and later (including the current Snack) use React 19, where `propTypes` are silently ignored. Newer projects use TypeScript to check props instead; see the [TypeScript guide](https://seneca-ictoer.github.io/WEB530/Z-Guides/typescript).

### Required Values

As mentioned earlier, no warning is shown if you simply ignore a property but there are times when a value is required. Using the `prop-types` package, we can indicate the values that must be specified. Let's modify the previous code example to require all properties be specified.

```
MyComponent.propTypes = {
  myString: PropTypes.string.isRequired,
  myNumber: PropTypes.number.isRequired,
  myBool: PropTypes.bool.isRequired,
  myFunc: PropTypes.func.isRequired,
  myArray: PropTypes.array.isRequired,
  myObject: PropTypes.object.isRequired,
};
```

### Any value

Sometimes you don't know (or care) what type of property is passed to your component but you want to ensure something is passed in. In other words, it is a required property but the data type doesn't matter. This is easily accomplished using `PropTypes.any.isRequired`.

### Specific types

If you need a property validator that checks for a custom type defined by your application, for example a component called `MyComponent`, there are `PropTypes` for this as well.

* `PropTypes.instanceOf(MyComponent)` - requires an instance of `MyComponent`.
* `PropTypes.oneOfType([PropTypes.string, MyComponent])` - requires an instance of `string` or `MyComponent`.
* `PropTypes.arrayOf(PropTypes.instanceOf(MyComponent))` - requires an array of `MyComponent` instances.

### Specific values

So far, we’ve validated the type of each prop, but sometimes the actual value matters just as much.

* `PropTypes.oneOf(possibleValues)` - Checks the property value and warns if the value is not contained in an array `possibleValues`.
* `PropTypes.shape(comparableObj)` - Similar to `instanceOf()` but we don't care about the actual type. Instead, we care that the object passed in has all of the required properties and that each property is valid.

### Custom validators

The validators provided by the `prop-types` package cover a wide range of scenarios but you may require some sort of custom validation logic. Simply define a function accepting three arguments `(props, name, component) => { }`. Return `null` if the value is valid otherwise return an `Error` instance.

```
MyComponent.propTypes = {
  myNumber: (props, name, component) =>
    Number.isFinite(props[name]) && props[name] >= 10 && props[name] <= 99
      ? null
      : new Error(`${component}.${name} expects a number between 10 and 99`),
};
```
