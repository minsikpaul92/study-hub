Source: <https://seneca-ictoer.github.io/WEB530/I-Firebase/fb-getting-started>

# Getting Started with Firebase

This guide will walk you through setting up a Firebase account, creating a Firestore database to power your product shop application, and adding user authentication to secure your Expo Router app.

## 1. Create a Firebase Account and Project

Before writing code, you need to set up a backend project in the Firebase Console.

1. Go to the [Firebase Console](https://console.firebase.google.com/) and sign in with your Google account.
2. Click **Create a new Firebase Project**, enter a name (e.g., `Product-Shop-App`), accept the Firebase terms, and click **Continue**.
3. Choose whether to enable AI assistance (recommended) and click **Continue**.
4. Choose whether to enable Google Analytics (you can experiment with this later, for now turn it off) and click **Continue**.
5. Once your project is ready, click **Continue** to open your project dashboard.

### Register your App

To connect your Expo app, you need to register a Web App within your Firebase project:

1. Click on **Settings** > **General**.
2. Under **Your apps**, click **Web (`</>`)**.
3. Enter an app nickname (e.g., `Expo Shop App`) and click **Register app**. You do not need to set up Firebase Hosting.
4. Firebase will provide a `firebaseConfig` object containing API keys. **Copy this information or keep it open; you will need it shortly.**

## 2. Set Up Cloud Firestore

Cloud Firestore is a flexible, scalable NoSQL cloud database. Let's initialize it and add some product data.

1. In the left-hand menu of the Firebase Console, navigate to **Database and storage** > **Firestore**.
2. Click **Create database**.
3. Select **Standard edition** and click **Next**.
4. Select a location closest to your users and click **Next**. *There are no Canadian locations available, so choose United States.*
5. Choose **Start in test mode** so you can easily read/write data during development. Click **Create**.

### Add a Products Collection

1. Click **Start collection** and name it `products`. Click **Next**.
2. Add a document with an **Auto-ID** and add the fields for a product:
   * `name` (string): e.g., "Wireless Noise-Canceling Headphones"
   * `price` (number): e.g., `299.99`

## 3. Integrate Firebase into your Expo Router App

This tutorial assumes you have already completed the [Expo Router example](https://seneca-ictoer.github.io/WEB530/H-Expo/expo-router). You will build upon this example.

To interact with Cloud Firestore and manage user registration without introducing bulky external software packages, we communicate with Google's servers using an architectural style called **REST**. Instead of an SDK config file, we manage our connections using standard HTTPS network requests.

### Configuration Setup

Create a file named `firebaseConfig.js` inside a `/config` folder to centrally store your project identifiers and credentials retrieved from Step 1:

```
// Store project metadata for endpoint interpolation
export const firebaseConfig = {
  projectId: 'YOUR_PROJECT_ID',
  apiKey: 'YOUR_WEB_API_KEY', // Found in Project Settings > General
};

// Base REST path targeting document root resources
export const firestoreEndpoint = `https://firestore.googleapis.com/v1/projects/${firebaseConfig.projectId}/databases/(default)/documents`;
```

## 4. Modify the Product Shop to Read from Firestore

Update your Jotai Atom `/store/productsAtom.ts`. Instead of initializing with hardcoded items, add a Jotai action atom to handle the asynchronous REST stream and update the state.

```
import { atom } from 'jotai';
import { firestoreEndpoint } from '@/config/firebaseConfig';

export interface Product {
  id: string;
  name: string;
  price: number;
}

// 1. Core atom holding the current array of products
export const productsAtom = atom<Product[]>([]);

// 2. Writable action atom to fetch data from Firestore REST API and update the store
export const fetchProductsAtom = atom(null, async (get, set) => {
  try {
    const response = await fetch(`${firestoreEndpoint}/products`);
    const data = await response.json();

    if (data.documents) {
      const formattedData: Product[] = data.documents.map((doc: any) => {
        const docId = doc.name.split('/').pop();
        return {
          id: docId,
          name: doc.fields.name?.stringValue || 'Unknown Product',
          // Handles both integer and float formats from Firestore REST endpoints
          price: parseFloat(doc.fields.price?.doubleValue || doc.fields.price?.integerValue || '0'),
        };
      });

      // Write parsed data directly into the core atom
      set(productsAtom, formattedData);
    }
  } catch (error) {
    console.error('Failed to sync Firestore products to Jotai:', error);
  }
});
```

Update your product shop screen layout `app/(tabs)/products/index.tsx`.

* Your screen should check if the store is empty when mounting.
* If it is, run the atom setter action using useSetAtom.
* We can also add a clean loading state using native components.

```
import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { Link } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAtomValue, useSetAtom } from 'jotai';
import { productsAtom, fetchProductsAtom } from '@/store/productsAtom';

export default function ShopScreen() {
  // Read the product list directly from your global Jotai store
  const products = useAtomValue(productsAtom);
  // Get the modifier function to dispatch our REST fetch sequence
  const fetchProducts = useSetAtom(fetchProductsAtom);

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function loadInitialData() {
      // Only show spinner and fetch if the store hasn't been filled yet
      if (products.length === 0) {
        setLoading(true);
        await fetchProducts();
        setLoading(false);
      }
    }
    loadInitialData();
  }, [products, fetchProducts]);

  if (loading) {
    return (
      <SafeAreaView style={styles.center}>
        <ActivityIndicator size="large" color="#007AFF" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['left', 'right']}>
      <Text style={styles.heading}>Available Hardware</Text>

      <FlatList
        data={products}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          // Link navigates completely outside the tab directory to the product stack folder
          <Link href={`/products/${item.id}`} asChild>
            <TouchableOpacity style={styles.card}>
              <View style={styles.infoContainer}>
                <Text style={styles.prodName}>{item.name}</Text>
                {/* Dynamically formatting the numeric price from the atom */}
                <Text style={styles.prodPrice}>${item.price.toFixed(2)}</Text>
              </View>
              <Text style={styles.arrow}>View →</Text>
            </TouchableOpacity>
          </Link>
        )}
        ListEmptyComponent={
          !loading && <Text style={styles.emptyText}>No hardware options available.</Text>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingHorizontal: 16, backgroundColor: '#f5f5f7' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#f5f5f7' },
  heading: {
    fontSize: 22,
    fontWeight: 'bold',
    marginTop: 16,
    marginBottom: 16,
    color: '#1c1c1e',
  },
  card: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    elevation: 1,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 4,
  },
  infoContainer: {
    flex: 1,
    paddingRight: 8,
  },
  prodName: { fontSize: 16, fontWeight: '600', color: '#1c1c1e' },
  prodPrice: { fontSize: 14, color: '#007AFF', marginTop: 4 },
  arrow: { color: '#8e8e93', fontWeight: 'bold' },
  emptyText: { textAlign: 'center', marginTop: 40, color: '#8e8e93', fontSize: 16 },
});
```

## 5. Add User Authentication

To secure the application and track who is interacting with your app, we use Google's secure HTTP REST Identity Toolkit.

**Enable Email/Password in Console**

1. In the Firebase Console, navigate to **Security** > **Authentication**.
2. Click **Get Started**.
3. Under **Sign-in providers**, select **Email/Password**.
4. Enable the feature and click **Save**.

* *Do not enable **Email Link (passwordless sign-in)**.*

**Create `store/authAtom.ts`**

```
import { atom } from 'jotai';

/**
 * Global state atom that stores the active user's session token.
 * * State Breakdown:
 * - string: The active JSON Web Token (JWT) returned from the Firebase REST API.
 * - null: Means the user is unauthenticated (signed out / no session).
 */
export const authAtom = atom<string | null>(null);
```

**Create a Registration & Login Actions using `fetch`**

Create a user interface screen file at `app/auth.tsx`. This file contains both our asynchronous network `fetch` requests to Google's Identity Toolkit and the standard text inputs and buttons needed for the form.

When a user authenticates successfully, Google replies with a secure JSON Web Token `idToken`, which we save directly into our global Jotai state to unlock the application.

```
import React, { useState } from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View, Alert } from 'react-native';
import { useSetAtom } from 'jotai';
import { authAtom } from '../store/authAtom'; // Adjust path as needed
import { firebaseConfig } from '../config/firebaseConfig'; // Adjust path as needed

interface AuthResponseData {
  idToken: string;
  email: string;
  refreshToken: string;
  expiresIn: string;
  localId: string;
  registered?: boolean;
}

interface AuthErrorResponse {
  error: { message: string };
}

// Expo Router REQUIRES a default export component for files in the app/ directory
export default function AuthScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const setAuthToken = useSetAtom(authAtom);

  const handleRegister = async () => {
    try {
      const url = `https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${firebaseConfig.apiKey}`;
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, returnSecureToken: true }),
      });
      const data: AuthResponseData | AuthErrorResponse = await response.json();

      if (response.ok) {
        setAuthToken((data as AuthResponseData).idToken);
      } else {
        Alert.alert('Registration Error', (data as AuthErrorResponse).error.message);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleLogin = async () => {
    try {
      const url = `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${firebaseConfig.apiKey}`;
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, returnSecureToken: true }),
      });
      const data: AuthResponseData | AuthErrorResponse = await response.json();

      if (response.ok) {
        setAuthToken((data as AuthResponseData).idToken);
      } else {
        Alert.alert('Login Error', (data as AuthErrorResponse).error.message);
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Account Access</Text>
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Sign In</Text>
      </TouchableOpacity>
      <TouchableOpacity style={[styles.button, styles.secondaryButton]} onPress={handleRegister}>
        <Text style={styles.secondaryButtonText}>Create Account</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 24, backgroundColor: '#fff' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 24, textAlign: 'center' },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
    backgroundColor: '#f9f9f9',
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 12,
  },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: '600' },
  secondaryButton: { backgroundColor: 'transparent', borderWidth: 1, borderColor: '#007AFF' },
  secondaryButtonText: { color: '#007AFF', fontSize: 16, fontWeight: '600' },
});
```

**Listening to Auth State with Jotai in Expo Router**

When working over the native REST API, there is no automatic continuous background connection tracking session changes. Instead, we use a shared global Jotai atom state container to watch our token.

Update your root layout context file `app/_layout.tsx` to intercept changes to the global atom state dynamically:

```
import { useFonts } from 'expo-font';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack, useRouter, useSegments } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect, useState } from 'react';
import 'react-native-reanimated';
import { useAtomValue } from 'jotai';
import { authAtom } from '@/store/authAtom'; // Adjust this import alias path if necessary

import { useColorScheme } from '@/components/useColorScheme';

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from 'expo-router';

export const unstable_settings = {
  // Ensure that reloading on `/modal` keeps a back button present.
  initialRouteName: '(tabs)',
};

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  // Expo Router uses Error Boundaries to catch errors in the navigation tree.
  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return <RootLayoutNav />;
}

function RootLayoutNav() {
  const colorScheme = useColorScheme();

  // 1. Monitor the global authentication token string from Jotai
  const authToken = useAtomValue(authAtom);
  const segments = useSegments();
  const router = useRouter();

  // 2. Navigation mounting safety state gate
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  // 3. Track state changes and conditionally reroute the user context boundary
  useEffect(() => {
    if (!hasMounted) return;

    // Check if the student is currently viewing a screen inside the auth folder layout context
    const inAuthGroup = segments[0] === 'auth';

    if (!authToken && !inAuthGroup) {
      // If no REST token string is present in memory, drop them back to the login screen
      router.replace('/auth');
    } else if (authToken && inAuthGroup) {
      // If a valid token exists and they try to visit login, push them into the main catalog tabs
      router.replace('/products');
    }
  }, [authToken, segments, hasMounted]);

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack>
        {/* Main Application Tabs layout container */}
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        {/* Authentication Entry Screen */}
        <Stack.Screen name="auth" options={{ headerShown: false, title: 'Login' }} />
        {/* Modals & Stack Subdirectories */}
        <Stack.Screen name="modal" options={{ presentation: 'modal' }} />
      </Stack>
    </ThemeProvider>
  );
}
```
