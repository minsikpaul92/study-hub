Source: <https://seneca-ictoer.github.io/WEB530/G-Geolocation/disp-maps>

# Displaying Maps

Interactive maps are a common feature in mobile apps, whether you're showing nearby places, tracking movement, or visualizing routes. In React Native, the easiest way to display a map is by using the react-native-maps library, which provides the `MapView` component.

💡 When running in Snack, maps work on a real device through Expo Go. They won’t render in the web preview, so the examples open on **My Device**: scan the QR code with Expo Go to run them.

`MapView` wraps the phone's own map, so it is a different map on each platform: in Expo Go, iOS draws Apple Maps and Android draws Google Maps. Most props work on both, but some are one platform only.

## Rendering a Basic Map

Once you import `MapView`, you can render a full‑screen map just like any other component. The example below shows the user’s location as a blue dot, and a **Find Me** button moves the map back to it.

```
import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, View, Text, Pressable } from 'react-native';
import MapView from 'react-native-maps';
import * as Location from 'expo-location';

export default function App() {
  const [canShowUser, setCanShowUser] = useState(false);
  const mapRef = useRef(null);

  // showsUserLocation fails silently on Android without permission.
  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      setCanShowUser(status === 'granted');
    })();
  }, []);

  async function findMe() {
    const pos = await Location.getCurrentPositionAsync({});
    mapRef.current.animateToRegion(
      {
        latitude: pos.coords.latitude,
        longitude: pos.coords.longitude,
        latitudeDelta: 0.005,
        longitudeDelta: 0.005,
      },
      1000
    );
  }

  return (
    <View style={styles.container}>
      <MapView ref={mapRef} style={styles.map} showsUserLocation={canShowUser} />
      <Pressable style={styles.button} onPress={findMe} disabled={!canShowUser}>
        <Text style={styles.buttonText}>Find Me</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
  button: {
    position: 'absolute',
    bottom: 40,
    alignSelf: 'center',
    padding: 16,
    borderRadius: 8,
    backgroundColor: '#2196F3',
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
  },
});
```

Exampleruns in Expo Snack

Opens the code in Snack, where you can edit it and see the result.

## Understanding the Map Props

**`showsUserLocation`**
When enabled, the map displays a blue dot representing the user’s current GPS position. The app must already have location permission. On Android the dot silently never appears without it, so request it first with `expo-location`.

**`initialRegion`**
The part of the map shown when it first renders: a centre `latitude` and `longitude`, plus `latitudeDelta` and `longitudeDelta`, the span of the map in degrees. Smaller deltas zoom in. It only sets the start; changing it later does not move the map.

**`ref` and `animateToRegion`**
To move the map from code, give it a ref with `useRef`. `mapRef.current.animateToRegion(region, duration)` glides to a new region on both platforms (iOS ignores the duration).

**`followsUserLocation`**
Keeps the map centred on the user as they move. It is Apple Maps only, so it does nothing on Android. For both platforms, move the map yourself with `animateToRegion`, as the Find Me button does.
