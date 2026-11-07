Source: <https://seneca-ictoer.github.io/WEB530/G-Geolocation/handuser-loc>

# Requesting User Location

Many apps need to know where the user is, whether you're showing nearby restaurants, mapping a route, or customizing content based on location. React Native can access a device’s GPS using the expo‑location library, which works inside Snack. The web preview uses your browser's location, which it may not be allowed to ask for, so for reliable results run the examples on a real device: choose **My Device** and scan the QR code with Expo Go.

**Permissions Matter**

Before your app can access GPS data, it must ask the user for permission.
If permission is denied, your app should handle that gracefully.

## One‑Time Location Lookup

Use this when you only need the user’s location once (for example, when the screen loads).

```
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import * as Location from 'expo-location';

export default function App() {
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);

  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
        return;
      }

      const pos = await Location.getCurrentPositionAsync({});
      setLocation(pos);
    })();
  }, []);

  if (errorMsg) {
    return (
      <View style={styles.center}>
        <Text style={styles.error}>{errorMsg}</Text>
      </View>
    );
  }

  if (!location) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
        <Text>Getting location…</Text>
      </View>
    );
  }

  return (
    <View style={styles.center}>
      <Text style={styles.title}>Your Location</Text>
      <Text>Latitude: {location.coords.latitude}</Text>
      <Text>Longitude: {location.coords.longitude}</Text>
      <Text>Accuracy: {location.coords.accuracy} meters</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 22,
    fontWeight: '600',
    marginBottom: 10,
  },
  error: {
    color: 'red',
    fontSize: 16,
  },
});
```

Exampleruns in Expo Snack

Opens the code in Snack, where you can edit it and see the result.

## Tracking Location in Real Time

Use this when you want updates as the user moves, for example, in a fitness or navigation app.

```
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import * as Location from 'expo-location';

export default function App() {
  const [coords, setCoords] = useState(null);

  useEffect(() => {
    let subscription;
    let cancelled = false;

    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted' || cancelled) return;

      subscription = await Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.High,
          timeInterval: 1000, // update every second
          distanceInterval: 1, // or every 1 meter
        },
        (pos) => setCoords(pos.coords)
      );

      // The screen may have closed while we were waiting.
      if (cancelled) subscription.remove();
    })();

    return () => {
      cancelled = true;
      if (subscription) subscription.remove();
    };
  }, []);

  return (
    <View style={styles.center}>
      <Text style={styles.title}>Live Location</Text>
      {coords ? (
        <>
          <Text>Latitude: {coords.latitude}</Text>
          <Text>Longitude: {coords.longitude}</Text>
        </>
      ) : (
        <Text>Waiting for updates…</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 22,
    fontWeight: '600',
    marginBottom: 10,
  },
});
```

Exampleruns in Expo Snack

Opens the code in Snack, where you can edit it and see the result.

## What You Should Remember

* Use useEffect for asynchronous location calls.
* Clean up watchers to avoid battery drain, including one that starts after the screen has already closed.
