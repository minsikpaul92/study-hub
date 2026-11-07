Source: <https://seneca-ictoer.github.io/WEB530/A-Introduction/intro-react>

# Introduction to React

## What is React

If you visit the [reactjs.org](https://reactjs.org/) website, you will learn that *React is a JavaScript library for building user interfaces*. Released by [Facebook](https://www.facebook.com/) in 2013, React is used by companies big and small to develop user interfaces (UIs) for web, mobile and desktop applications. React is often compared to [Angular](https://angular.io/) but there are alot of differences between the two.

* Based on the Model-View-Controller (MVC) pattern, Angular is a front-end framework for building web applications. React, on the other hand, is for creating user interfaces (the "View" part of the MVC pattern).
* Angular works on the web page's DOM, updating the entire page when a change is made to the data driving our view. React implements a virtual DOM allowing for quicker updates since only the relevant portions are updated.
* Angular offers one-way and two-way binding but React only uses one-way. Since data only flows in one direction, React apps can be easier to debug.

In this course, we will learn how to use React (and React Native) to produce cross-platform applications.

**React is component-based.**

Components are reusable pieces of code used to render HTML markup (what the user sees) to the browser DOM (the render target). Components are similar to views in Handlebars but they can manage their own state.

**React is declarative.**

React components mix *HTML* markup and JavaScript together using a syntax called JavaScript XML (or simply JSX). When developing React components, there is no need to execute steps using imperative approaches. Instead, programmers can easily build interactive user interfaces (UI) by describing what they should look like. In other words, programmers will decide what HTML elements each component will render, not how they will be rendered.

💡 **Declarative syntax**
A way of describing the code you want to write, without having to worry about how it's going to be implemented. In other words, you are specifying what needs to be done.

💡 **Imperative syntax**
You supply a set of instructions to follow and the computer does what you want. In other words, you are defining how a task should be performed.

## React components

In React, we will build our UI using JSX. JSX is just static text that represents the resulting HTML. On the initial render, React components and their JSX are no different than other template libraries. For example, Handlebars will render a template to HTML and a React component will do the same. However, React becomes much more interesting when data is changed. When using Handlebars, if the data changes we need to render the view again. With React, changes to the page are made automatically.

When data changes, refreshing a Handlebars view will take time but with React things update much more efficiently thanks to the virtual DOM. Reacts virtual DOM keeps a tally of the *real* DOM elements in memory and as data changes, it compares the new content with the already displayed content. Using diffing and patching, the virtual DOM can execute the imperative steps needed to update the HTML.

*Remember, we are going to declare our components using declarative code and not worry about how to refresh the page. React will figure out exactly how the UI should be rendered or updated.*

💡 **Diffing**
Comparing old content with new content to figure out what's changed.

💡 **Patching**
Executing the necessary DOM operations to render the new content.

### JavaScript XML (JSX)

Remember, we will build React components using JSX syntax. JSX allows us to mix HTML and JavaScript together. The code we write is extracted from the HTML and transpiled into JavaScript statements. Browsers have no idea what JSX is and they don't need to since they only see the pure JavaScript after it is transpiled.

💡 **Transpiler**
A [source-to-source compiler](https://en.wikipedia.org/wiki/Source-to-source_compiler) which takes the source code of a program written in some programming language and converts it into another programming language.

Let's take a look at a simple "hello world" example. This is a React app, not a React Native app so the target is a web browser. As you study the example, you will notice a few things:

* The first few lines of the program will create a React DOM element from an HTML element in the browsers DOM.
* The last few lines build our UI, returning HTML to be rendered in the browser.
* The application combines JavaScript and XML. Since this is a React app the render target is the browser and so JSX has support for HTML tags. In other words, React already has components built-in for the common HTML elements that you use on a daily basis.

💡 Want to try the examples yourself? Open [this CodeSandbox template](https://codesandbox.io/p/sandbox/react-basic-3rqll4) and start coding.

**index.html**

```
<div id="root"></div>
```

**index.js**

```
import React from 'react';
import { createRoot } from 'react-dom/client';

const rootElement = document.getElementById('root');
const root = createRoot(rootElement);

root.render(
  <p>
    Hello, <strong>JSX</strong>!
  </p>
);
```

If you need to render multiple tags, they must be nested within a single tag. This is because React needs a root component to render. For example, you can't render adjacent elements like `<p><p><p>`. Look at the next code example and you will notice that the `<p>` and `<button>` have been placed into a single `<div>`.

Tag names are case-sensitive. When writing HTML, as is done in the code example below, specify the tag names using only lowercase characters. When specifying non-html elements, start the tag with a capital letter. This convention makes it easier to scan the markup and spot the built-in HTML elements.

We can also pass HTML elements any of their standard properties. In the code example, we are passing the "foo" property. Since this is not a standard property, a warning may be logged but the HTML will still render.

```
// React needs a root element to render.
// Notice the tag names use lowercase letters.
// Also notice the property "foo" added to the button.
import React from 'react';
import { createRoot } from 'react-dom/client';

const root = createRoot(document.getElementById('root'));

root.render(
  <div>
    <p>JSX is fun</p>
    <button foo="bar">Click Me</button>
  </div>
);
```

JSX is a great way to describe even complex UI structures.

```
// Render a much more complex UI
import React from 'react';
import { createRoot } from 'react-dom/client';

const root = createRoot(document.getElementById('root'));

root.render(
  <section>
    <header>
      <h1>JSX</h1>
    </header>

    <nav>
      <a href="item">Link 1</a>
      <br />
      <a href="item">Link 2</a>
    </nav>

    <main>
      <p>This is a much more complex UI.</p>
    </main>

    <footer>
      <small>&copy; SDSS</small>
    </footer>
  </section>
);
```

### Writing components using JSX

Components are the fundamental building blocks of React.

```
import React from 'react';
import { createRoot } from 'react-dom/client';

// "MyComponent" is simply a function that returns some JSX,
// which defines the elements of our UI
function MyComponent() {
  return (
    <div>
      <h1>My First Component</h1>
      <p>A component is the fundamental building block of React.</p>
    </div>
  );
}

const root = createRoot(document.getElementById('root'));

// Render the component
root.render(<MyComponent />);
```

In the above example, we are defining a component called `MyComponent`, which is literally just a function of that name. In line 18 we are rendering our custom tag. React replaces that tag with the JSX returned by `MyComponent`.

Using JSX markup is not only useful for building reusable components but also for describing UI structures that have parent-child relationships. As an example, a `<li>` tag is useful as a child of a `<ul>`. To make this work, we can build our own components specifying the `children` property.

```
import React from 'react';
import { createRoot } from 'react-dom/client';

// Renders a <div> element containing a heading, paragraph and unordered list.
// The list is populated using {props.children}.
function ParentComponent(props) {
  return (
    <div>
      <h1>Parent Component</h1>
      <p>This component encapsulates a ul element containing the children</p>
      <ul>{props.children}</ul>
    </div>
  );
}

// Renders a <li> element. The text for the list item is populated using {props.children}
function ChildComponent(props) {
  return <li>{props.children}</li>;
}

const root = createRoot(document.getElementById('root'));

// Render the nested UI structure
root.render(
  <ParentComponent>
    <ChildComponent>First child</ChildComponent>
    <ChildComponent>Second child</ChildComponent>
  </ParentComponent>
);
```

In the parent-child example, we are defining two React components. If you look at the JSX for the final render, you will notice that `<ChildComponent>` is a child of`<ParentComponent>`. You will also notice that `<ChildComponent>` accepts text as its child instead of additional JSX elements. In both components,`{props.children}` acts as a placeholder for the content.

So, text is passed into the `<ChildComponent>` and multiple `<ChildComponent>` tags are passed into the `<ParentComponent>` yet the rendered output includes the `<div>`, `<h1>`, `<p>`, `<ul>`, and three `<li>` tags. The browser shows something like this:

### Using JavaScript expressions

The following examples shows how easy it is to mix JavaScript and HTML to build JSX. You will notice that JavaScript variables can be passed in to components. Any valid JavaScript expression can be placed between the `{ }`.

```
import React from 'react';
import { createRoot } from 'react-dom/client';

const enabled = false;
const value = 'Test';
const buttonText = 'GO';

const root = createRoot(document.getElementById('root'));

root.render(
  <div>
    <input type="text" value={value} />
    <button disabled={!enabled}>{buttonText}</button>
  </div>
);
```

Even arrays can be used to build a dynamic UI:

```
import React from 'react';
import { createRoot } from 'react-dom/client';

const optionArray = [
  { id: 1, name: 'First' },
  { id: 2, name: 'Second' },
  { id: 3, name: 'Third' },
];

const root = createRoot(document.getElementById('root'));

root.render(
  <div>
    <h1>Array</h1>

    {/* Maps "array" to an array of "<option>"s.
        Note the "key" property on "<option>".
        This is necessary for performance reasons,
        and React will warn us if it's missing. */}
    <select size="3">
      {optionArray.map((item) => (
        <option key={item.id} value={item.id}>
          {item.name}
        </option>
      ))}
    </select>
  </div>
);
```
