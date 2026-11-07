Source: <https://seneca-ictoer.github.io/WEB530/I-Firebase/fb-intro>

# Firebase Introduction

## What is Firebase?

Firebase is a comprehensive Backend-as-a-Service (BaaS) platform provided by Google. In traditional software development, creating a mobile or web application requires building two separate systems: the frontend client application (what the user sees) and a custom backend server (to handle databases, user authentication, security, and file storage).

Firebase completely eliminates the need to build, deploy, or maintain custom server infrastructure. Instead, it provides instantly provisioned cloud infrastructure that you can connect to your application out of the box.

## What is Cloud Firestore?

For modern applications, our primary storage engine is **Cloud Firestore**, Google's flagship NoSQL cloud database. Unlike rigid relational databases (like MySQL) that require structured tables, rows, and strict schemas, Firestore is flexible and document-oriented.

Firestore structures its data layer using an intuitive hierarchical system:

* **Collections:** Think of these as folders. They store groups of related records (e.g., a `products` folder or a `users` folder). Collections cannot contain raw data; they only contain documents.
* **Documents:** Think of these as individual files inside a folder. Every document is a JSON-like object containing explicit key-value pairs (e.g., `name: "Wireless Mouse", price: 79.99`). Documents can also point to sub-collections, allowing you to nest data cleanly.

## Architectural Choice: Official SDK vs. Native REST API

When connecting a mobile app to Firebase, developers generally have two paths: installing the heavy, official Firebase JavaScript SDK, or making raw HTTPS requests directly to Google's endpoints.

In this course, **we are using the REST API approach.** Here is why this distinction matters to your development workflow:

| Feature | Official Firebase JS SDK | Native HTTPS REST API (Our Approach) |
| --- | --- | --- |
| **Dependencies** | Requires installing large npm packages (`firebase`) and native mobile polyfills. | **Zero dependencies.** Relies entirely on the native web browser/Expo `fetch()` API. |
| **Learning Outcome** | Hides the network layer behind abstract proprietary functions like `getDocs()`. | **Teaches universal skills.** Forces hands-on experience with real HTTP headers, verbs, and JSON payloads. |
| **State Conflict** | Tries to maintain its own background data-cache, which can conflict with local state managers. | Bypasses local caching. Acts as a clean data pipeline that streams straight into your state manager. |
| **Bundle Footprint** | Adds weight to the compiled mobile application bundle. | Extremely lightweight, keeping app execution fast and clean. |

## Essential Firebase Core Features

While Cloud Firestore handles our data, Firebase provides a massive ecosystem of plug-and-play services. Two of the most critical services for any production app are **Authentication** and **CRUD Operations**.

### User Authentication (Firebase Auth)

Building a secure login system from scratch is notoriously difficult and risky. Firebase Authentication provides an end-to-end user identity solution with just a few lines of code.

It handles everything securely on Google's servers, including password hashing, session tokens, and password reset workflows. It supports:

* Traditional Email & Password registration.
* Single Sign-On (SSO) social providers (Google, Apple, GitHub, etc.).
* Passwordless phone/SMS authentication.

### Network CRUD Architecture

To interact with our Cloud Firestore database, our application performs CRUD operations. Because Firestore exposes a native HTTPS REST API, we can execute these data operations using standard JavaScript `fetch()` network requests to Google's endpoints using specific HTTP Verbs:

| Operation | Description | HTTP Verb Used |
| --- | --- | --- |
| **Create** | Appends a brand-new document into a Firestore collection. | `POST` |
| **Read** | Fetches an entire collection list or pulls a specific document's fields. | `GET` |
| **Update** | Modifies existing fields inside a document without replacing the whole file. | `PATCH` |
| **Delete** | Destroys a targeted document resource path entirely. | `DELETE` |

### How it Works in Our Mobile Stack

To keep our Expo application lightweight and lightning-fast, we completely bypass heavy, platform-specific native Firebase packages.

Instead, we treat Cloud Firestore exactly like a standard Web API. Our app sends clean, lightweight HTTPS requests straight to our Firestore endpoint, pulls down the data, and pipes it directly into our local **Jotai global state** to update the user interface seamlessly.
