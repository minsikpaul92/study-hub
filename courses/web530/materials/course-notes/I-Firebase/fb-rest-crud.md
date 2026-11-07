Source: <https://seneca-ictoer.github.io/WEB530/I-Firebase/fb-rest-crud>

# REST & CRUD

💡 CRUD and REST are the universal architectural building blocks of the modern web. Mastering them empowers you to connect any frontend interface to any backend database service in existence.

To interact with Cloud Firestore without installing restrictive external software packages, we communicate with Google's servers using an architectural style called **REST** (Representational State Transfer).

## Core Principles of a RESTful API

An API (Application Programming Interface) that follows the formal rules of REST is referred to as a **RESTful API**. It relies on four fundamental pillars:

* **Resource Identification (URIs):** In a REST API, every piece of server data is treated as an isolated "resource" mapped to a completely unique URL path. The layout of the URL represents the actual physical hierarchy of your database collections.
* **Standard HTTP Methods:** Instead of inventing custom proprietary command strings, you manipulate remote cloud items using universal web-browser actions: `GET`, `POST`, `PATCH`, and `DELETE`.
* **Stateless Communication:** The server does not store memory of past network requests. Every single outbound request from your mobile app must contain 100% of the context, parameters, and credentials required for the server to process it.
* **Structured Data Representation:** Information flowing back and forth over the wire is packed cleanly into standard **JSON** (JavaScript Object Notation) strings.

## Mapping CRUD Operations to HTTP Verbs

In database management, **CRUD** stands for **C**reate, **R**ead, **U**pdate, and **D**elete. When mapping these local database tasks over an active internet connection to Cloud Firestore, we use specific **HTTP Verbs**:

### The Network Operations Matrix

| CRUD Action | Meaning | HTTP Verb | Firestore Endpoint Path Context |
| --- | --- | --- | --- |
| **Create** | Generates a brand-new database entry. | **`POST`** | Targets the parent collection folder. |
| **Read** | Retrieves current records from the cloud. | **`GET`** | Targets either a whole collection or a single file ID. |
| **Update** | Modifies selective fields without wiping the record. | **`PATCH`** | Targets a specific document ID. |
| **Delete** | Destroys a resource record permanently. | **`DELETE`** | Targets a specific document ID. |

## Understanding Cloud Firestore NoSQL Data Structures

Unlike older database models that store information as a flat, single string-tree, **Cloud Firestore** organizes data hierarchically into explicit **Collections** and **Documents**.

### Official REST Architecture URL Mapping

When targeting your database via network requests, your base URL string reflects this structured directory path exactly:

https://firestore.googleapis.com/v1/projects/{YOUR\_PROJECT\_ID}/databases/(default)/documents/{collection\_name}https://firestore.googleapis.com/v1/projects/\{YOUR\\_PROJECT\\_ID\}/databases/(default)/documents/\{collection\\_name\}https://firestore.googleapis.com/v1/projects/{YOUR\_PROJECT\_ID}/databases/(default)/documents/{collection\_name}

### Document Architecture vs. Raw JSON

When you read a document from Firestore using the native REST API, Google wraps your custom properties inside an explicit internal metadata structure called `fields`. This structure preserves explicit data types (like numbers vs. strings) across the web.

Here is an example of a raw document payload returned over HTTP from a `products` collection:

```
{
  "name": "projects/my-hardware-shop/databases/(default)/documents/products/1",
  "fields": {
    "name": {
      "stringValue": "Wireless Noise-Canceling Headphones"
    },
    "price": {
      "doubleValue": 299.99
    },
    "description": {
      "stringValue": "Immersive sound with premium comfort and long battery life."
    }
  },
  "createTime": "2026-05-26T14:22:10.123456Z",
  "updateTime": "2026-05-26T16:05:45.987654Z"
}
```

### Deconstructing the Document Rules:

* The Resource Identifier `name`: This is the absolute, unique systemic cloud route pinpointing this single product entry within the Google ecosystem.
* The Collections Scope `products/`: The parent grouping container. It functions exactly like a root folder holding files.
* The Document ID `1`: The explicit file target containing individual data attributes.
* Typed Values Layer `fields`: Notice that Firestore explicitly tags `stringValue` for text and `doubleValue` for numeric floats. When we fetch this into our application state layer, our code will parse this metadata block to map it back out into clean, usable client data types.

## Further Reference & Official Resources

To understand the core design choices behind Google's enterprise REST schemas and how parameters are structured, read through the official Google Cloud infrastructure developer documentation:

* Firestore REST API Reference Guides: [Google Cloud Firestore REST Documentation](https://firebase.google.com/docs/firestore/reference/rest)
* Structuring Documents over Web API Vectors: [Google Firestore REST API Datatypes and Methods](https://firebase.google.com/docs/firestore/reference/rest/v1/projects.databases.documents)
