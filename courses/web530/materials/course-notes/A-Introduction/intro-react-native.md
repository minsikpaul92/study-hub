Source: <https://seneca-ictoer.github.io/WEB530/A-Introduction/intro-react-native>

# Introduction to React Native

On Android, developers build Java apps while on iOS developers implement Swift apps. As a mobile app developer, you will have to learn both languages since picking only one platform is not realistic for success. As a React native developer, you only need to learn one language to target both platforms.

Earlier, we learned that the render target of React is the web browser. React Native on the other hand communicates with the underlying mobile OS to render native controls that behave and look as the OS user would expect. The good news is, the API we use to build React Native mobile apps is almost identical to that of React for the web. A main difference between the two flavours is the fact that React Native ships with components to be used on mobile platforms rather than with HTML elements.

You may be wondering if you can work around mobile apps all-together. In reality, this may be possible, at least at the early stages. But eventually you may find that mobile browsers lack many capabilities needed by your mobile apps. Here are a few things to consider:

* Many of the native controls built-in to mobile devices cannot be replicated by web browsers. For example, the date picker control. It usually looks very different in a web browser than as a native control on your mobile device.
* Many web apps assume the presence of a mouse but mobile devices are almost always interacted using a finger on a touch screen. Mobile platforms have a gesture system to deal with this type of interaction.
* Consistency and familiarity are important for a good user experience. Your app needs to look and behave as if it is part of the device.
* Since React Native uses actual components from the platform, it can easily deal with updates to the underlying OS. As controls are updated and improved, these updates are automatically rolled into your native app.

It is important to mention that although iOS and Android have several areas of overlap, it may not be feasible to write a single codebase shared entirely on both OS. You will want to take advantage of iOS-specific controls and Android specific controls to give your users the experience they expect. Concentrate on providing users the best experience possible rather than building a completely portable application.

💡 Want to try the examples yourself? Open [Snack](https://snack.expo.dev/) and start coding React Native applications in your browser.
