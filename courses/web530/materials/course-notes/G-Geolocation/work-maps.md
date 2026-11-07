Source: <https://seneca-ictoer.github.io/WEB530/G-Geolocation/work-maps>

# Working with Maps

Interactive maps become much more useful when you add your own markers, shapes, and custom data. The `react-native-maps` library lets you place pins, draw polygons, and control what appears on the map so you can highlight the locations that matter to your app.

## Adding Custom Markers

Markers let you point out specific places, campuses, stores, landmarks, or anything your app cares about.
You can also hide the map's own points of interest (shops, restaurants, landmarks) to keep it focused. This is different on each platform: `showsPointsOfInterest={false}` works on iOS (Apple Maps), and a `customMapStyle` rule hides them on Android (Google Maps), so the example uses both. Setting `initialRegion` starts the map centred on the places you mark; the `Delta` values control how much of the map is visible (smaller is more zoomed in).

```
import React from 'react';
import { StyleSheet, View } from 'react-native';
import MapView, { Marker } from 'react-native-maps';

// Centre the map on Seneca's Newnham Campus.
const newnham = {
  latitude: 43.79457,
  longitude: -79.35043,
  latitudeDelta: 0.01,
  longitudeDelta: 0.01,
};

// Google Maps (Android) hides points of interest with a style rule.
const hidePlaces = [{ featureType: 'poi', stylers: [{ visibility: 'off' }] }];

export default function App() {
  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        initialRegion={newnham}
        showsPointsOfInterest={false}
        customMapStyle={hidePlaces}
      >
        <Marker
          title="Seneca College Newnham Campus"
          description="Educational Institute"
          coordinate={{ latitude: 43.79457, longitude: -79.35043 }}
        />
      </MapView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  map: { flex: 1 },
});
```

Exampleruns in Expo Snack

![Map with a marker on Newnham Campus](https://seneca-ictoer.github.io/WEB530/assets/images/map-peg-645d5568cc61b35c9bec87113db7296c.webp)

To interact with it, run the code in Snack, where you can also edit it.

## Drawing Shapes (Polygons)

Polygons are useful for outlining regions, campus boundaries, delivery zones, neighborhoods, or any custom area your app needs to highlight.

```
import React from 'react';
import { StyleSheet, View } from 'react-native';
import MapView, { Polygon } from 'react-native-maps';

// Centre the map on Seneca's Newnham Campus.
const newnham = {
  latitude: 43.79607,
  longitude: -79.3487,
  latitudeDelta: 0.01,
  longitudeDelta: 0.01,
};

export default function App() {
  return (
    <View style={styles.container}>
      <MapView style={styles.map} initialRegion={newnham}>
        <Polygon
          coordinates={[
            { latitude: 43.79701, longitude: -79.35178 },
            { latitude: 43.79849, longitude: -79.3453 },
            { latitude: 43.79483, longitude: -79.34612 },
            { latitude: 43.79382, longitude: -79.35049 },
          ]}
          strokeWidth={3}
          strokeColor="red"
        />
      </MapView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  map: { flex: 1 },
});
```

Exampleruns in Expo Snack

![Map with a polygon around Newnham Campus](https://seneca-ictoer.github.io/WEB530/assets/images/map-poly-3d67e0b19e70066065d32717c1965d0e.webp)

To interact with it, run the code in Snack, where you can also edit it.

## What You Should Remember

* Use `Marker` to highlight specific coordinates.
* Use `Polygon` to outline areas or regions.
* Hide default points of interest with `showsPointsOfInterest={false}` (iOS) and a `customMapStyle` rule (Android) for a cleaner map.
* All of these features work on a real device through Expo Go.
