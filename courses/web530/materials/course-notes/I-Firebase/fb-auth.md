Source: <https://seneca-ictoer.github.io/WEB530/I-Firebase/fb-auth>

# Firebase Authentication

Building a secure authentication system from scratch is notoriously difficult and risky. It requires setting up encryption layers, securely hashing passwords on a database server, generating random session tokens, and writing complex token expiration listeners.

**Firebase Authentication** provides an end-to-end, bank-grade user identity solution out of the box. Google securely handles password storage, hashing algorithms, and token provisioning on their servers so you can focus entirely on building your client application experience.

## The REST Identity Toolkit Architecture

Because we are keeping our Expo application completely free of heavy, platform-specific native dependencies, we interact directly with Google's cloud identity gateway using standard HTTP `POST` requests.

Instead of an ongoing background listener client, our authentication workflow relies on a secure exchange of network payloads using your project's unique **Web API Key**:

### 1. Creating an Account (Sign Up)

When a user submits a registration form, your application sends a `POST` request to Google's registration endpoint with their plaintext credentials:

* **Endpoint:** `https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=YOUR_WEB_API_KEY`
* **Payload Sent:** A JSON object containing `email`, `password`, and a boolean flag `returnSecureToken: true`.
* **The Response:** Firebase validates the password complexity, generates a permanent unique User ID (`localId`), and returns a secure, signed temporary session token.

### 2. Validating Credentials (Sign In)

When an existing user returns to log into your application, you send a `POST` request to the verification node:

* **Endpoint:** `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=YOUR_WEB_API_KEY`
* **The Response:** Firebase evaluates the email and password combination.
  + If valid, it returns a `200 OK` code containing a fresh token string.
  + If invalid, it rejects the request with standard error messages like `EMAIL_NOT_FOUND` or `INVALID_PASSWORD` which you can catch and display directly to the user as form validation warnings.

## Managing Session State with Jotai

When using the raw REST API, we pipe the server's HTTP JSON response directly into our shared **Jotai State Layer**.

We establish a global `authAtom` that tracks the presence of the user's session token:

```
              ┌───────────────────────────┐
              │   User Launches App       │
              └─────────────┬─────────────┘
                            │
             Is an auth token in Jotai?
                            │
           ┌────────────────┴────────────────┐
           ▼ NO                              ▼ YES
┌──────────────────────────────┐  ┌──────────────────────────────┐
│  Render Login Screen         │  │  Render Main (tabs) Router   │
│  (Blocks access to hardware) │  │  (Full access to catalog)    │
└──────────────────────────────┘  └──────────────────────────────┘
```

By binding our layout directly to a Jotai atom, we achieve an instant, smooth user transition. The moment the token atom is updated via a successful `fetch()` login action, the interface automatically hides the public login forms and displays the protected native product catalog views.

## Step-by-Step Implementation Strategy

In our upcoming coding lab, we will implement this architecture across the following steps:

1. **Retrieve Your Web API Key:** Locate your unique credential inside your Firebase Console project settings dashboard.
2. **Create the Auth Atom:** Establish a state file (`store/authAtom.ts`) to track the current user's token string and localized ID.
3. **Build the Network Login Action:** Write an asynchronous JavaScript utility using `fetch` to pass form payloads directly to Google's Identity endpoints.
4. **Configure Conditional Routing:** Update your root layout file to read the Jotai store value and dynamically swap user screen contexts based on their real-time authentication status.
5. **Implement Sign-Out:** Add a control action that clears out the stored Jotai state, instantly dropping the client back to the public login screen.
