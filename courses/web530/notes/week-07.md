# Week 7. Location & Maps: 위치 권한, 현재 위치, 실시간 추적, 지도, 마커, 도형

> 이 노트 읽는 법: **📘/💻/🧪 원문**(영어 그대로) 바로 밑에 **🇰🇷 한글 해설**이 있어요. 코드 밑의 **▶ Snack에서 바로 실행하기**를 누르면 그 코드가 Expo Snack에서 열려요(`expo-location`, `react-native-maps` 자동 포함). **지도는 Web에서 안 나와요.** 오른쪽 위 **My Device**를 고르고 폰의 Expo Go로 QR을 찍거나, Android/iOS 미리보기를 쓰세요. **Test 2 범위.**

## 0. 이번 주 한눈에 보기

**위치 기능 4단계 공식**
```jsx
const { status } = await Location.requestForegroundPermissionsAsync(); // 1. 권한 요청
if (status !== "granted") { setErrorMsg("..."); return; }              // 2. 거절 처리
const pos = await Location.getCurrentPositionAsync({});                 // 3. 위치 한 번
const [place] = await Location.reverseGeocodeAsync(pos.coords);         // 4. 좌표 → 주소
```

| 하고 싶은 것 | 함수/컴포넌트 | 기억할 점 |
| --- | --- | --- |
| 권한 묻기 | `requestForegroundPermissionsAsync()` | `status === "granted"` 확인. 거절해도 앱은 동작해야 함 |
| 위치 한 번 | `getCurrentPositionAsync({})` | `pos.coords.latitude/longitude/accuracy` |
| 좌표 → 주소 | `reverseGeocodeAsync(coords)` | **배열** 반환, 첫 번째가 최선. Web에서 안 됨 |
| 계속 추적 | `watchPositionAsync(options, callback)` | `subscription.remove()`로 **꼭 정리**(배터리) |
| 지도 | `<MapView style={{flex:1}} />` | 크기 없으면 안 보임. default export |
| 시작 위치 | `initialRegion` | 처음만. 나중에 바꿔도 안 움직임 |
| 코드로 이동 | `mapRef.current.animateToRegion(region, ms)` | `useRef` + `ref={mapRef}` |
| 파란 점 | `showsUserLocation` | Android는 **권한 먼저** 필요 |
| 핀 | `<Marker coordinate={{...}} title description onPress />` | named export `{ Marker }` |
| 영역 | `<Polygon coordinates={[...]} fillColor strokeColor />` | 점 3개 이상 |
| 지도 탭 좌표 | `onPress={(e) => e.nativeEvent.coordinate}` | `onLongPress`도 같음 |
| 장소 아이콘 숨기기 | `showsPointsOfInterest={false}`(iOS) + `customMapStyle`(Android) | **둘 다** 필요 |

**좌표 상식**: 위도(latitude)는 남북 -90~90, 경도(longitude)는 동서 -180~180. 그리니치 서쪽은 음수라서 토론토 경도는 약 **-79.35**. delta 0.01도 ≈ 약 1km, **작을수록 확대**.


## 목차

- 1. 📘 코스노트: Requesting User Location
- 2. 📘 코스노트: Displaying Maps
- 3. 📘 코스노트: Working with Maps
- 4. 💻 인클래스 예제: Week 7.1 - Notes and Examples
- 5. 🧪 Lab: Lab 6 - Location and Maps
- ✅ Week 7 시험 대비 체크리스트


---

## 1. 📘 코스노트: Requesting User Location

> 원문 출처: https://seneca-ictoer.github.io/WEB530/G-Geolocation/handuser-loc

Many apps need to know where the user is, whether you're showing nearby restaurants, mapping a route, or customizing content based on location. React Native can access a device’s GPS using the expo‑location library, which works inside Snack. The web preview uses your browser's location, which it may not be allowed to ask for, so for reliable results run the examples on a real device: choose **My Device** and scan the QR code with Expo Go.

**Permissions Matter**

Before your app can access GPS data, it must ask the user for permission.
If permission is denied, your app should handle that gracefully.

**🇰🇷 한글 해설**

위치가 필요한 앱: 근처 식당, 길 찾기, 위치 맞춤 콘텐츠. RN에서는 **`expo-location`** 라이브러리로 GPS를 써요(Snack에서도 동작). Web 미리보기는 브라우저 위치를 쓰는데 권한이 없을 수 있어서, **실제 폰(My Device + Expo Go)** 이 확실해요.

**Permissions Matter(권한이 중요)**: GPS를 쓰기 전에 반드시 사용자에게 **허락**을 받아야 하고, 거절하면 **우아하게(gracefully)** 처리해야 해요(앱이 터지거나 멈추면 안 됨).

### 📘 One‑Time Location Lookup

Use this when you only need the user’s location once (for example, when the screen loads).

```jsx
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

▶ **[Snack에서 바로 실행하기](https://snack.expo.dev/?name=WEB530%20W7%20One%E2%80%91Time%20Location%20Lookup&platform=web&sdkVersion=54.0.0&code=import%20React%2C%20%7B%20useState%2C%20useEffect%20%7D%20from%20%27react%27%3B%0Aimport%20%7B%20View%2C%20Text%2C%20StyleSheet%2C%20ActivityIndicator%20%7D%20from%20%27react-native%27%3B%0Aimport%20%2A%20as%20Location%20from%20%27expo-location%27%3B%0A%0Aexport%20default%20function%20App%28%29%20%7B%0A%20%20const%20%5Blocation%2C%20setLocation%5D%20%3D%20useState%28null%29%3B%0A%20%20const%20%5BerrorMsg%2C%20setErrorMsg%5D%20%3D%20useState%28null%29%3B%0A%0A%20%20useEffect%28%28%29%20%3D%3E%20%7B%0A%20%20%20%20%28async%20%28%29%20%3D%3E%20%7B%0A%20%20%20%20%20%20const%20%7B%20status%20%7D%20%3D%20await%20Location.requestForegroundPermissionsAsync%28%29%3B%0A%20%20%20%20%20%20if%20%28status%20%21%3D%3D%20%27granted%27%29%20%7B%0A%20%20%20%20%20%20%20%20setErrorMsg%28%27Permission%20to%20access%20location%20was%20denied%27%29%3B%0A%20%20%20%20%20%20%20%20return%3B%0A%20%20%20%20%20%20%7D%0A%0A%20%20%20%20%20%20const%20pos%20%3D%20await%20Location.getCurrentPositionAsync%28%7B%7D%29%3B%0A%20%20%20%20%20%20setLocation%28pos%29%3B%0A%20%20%20%20%7D%29%28%29%3B%0A%20%20%7D%2C%20%5B%5D%29%3B%0A%0A%20%20if%20%28errorMsg%29%20%7B%0A%20%20%20%20return%20%28%0A%20%20%20%20%20%20%3CView%20style%3D%7Bstyles.center%7D%3E%0A%20%20%20%20%20%20%20%20%3CText%20style%3D%7Bstyles.error%7D%3E%7BerrorMsg%7D%3C%2FText%3E%0A%20%20%20%20%20%20%3C%2FView%3E%0A%20%20%20%20%29%3B%0A%20%20%7D%0A%0A%20%20if%20%28%21location%29%20%7B%0A%20%20%20%20return%20%28%0A%20%20%20%20%20%20%3CView%20style%3D%7Bstyles.center%7D%3E%0A%20%20%20%20%20%20%20%20%3CActivityIndicator%20size%3D%22large%22%20%2F%3E%0A%20%20%20%20%20%20%20%20%3CText%3EGetting%20location%E2%80%A6%3C%2FText%3E%0A%20%20%20%20%20%20%3C%2FView%3E%0A%20%20%20%20%29%3B%0A%20%20%7D%0A%0A%20%20return%20%28%0A%20%20%20%20%3CView%20style%3D%7Bstyles.center%7D%3E%0A%20%20%20%20%20%20%3CText%20style%3D%7Bstyles.title%7D%3EYour%20Location%3C%2FText%3E%0A%20%20%20%20%20%20%3CText%3ELatitude%3A%20%7Blocation.coords.latitude%7D%3C%2FText%3E%0A%20%20%20%20%20%20%3CText%3ELongitude%3A%20%7Blocation.coords.longitude%7D%3C%2FText%3E%0A%20%20%20%20%20%20%3CText%3EAccuracy%3A%20%7Blocation.coords.accuracy%7D%20meters%3C%2FText%3E%0A%20%20%20%20%3C%2FView%3E%0A%20%20%29%3B%0A%7D%0A%0Aconst%20styles%20%3D%20StyleSheet.create%28%7B%0A%20%20center%3A%20%7B%0A%20%20%20%20flex%3A%201%2C%0A%20%20%20%20justifyContent%3A%20%27center%27%2C%0A%20%20%20%20alignItems%3A%20%27center%27%2C%0A%20%20%7D%2C%0A%20%20title%3A%20%7B%0A%20%20%20%20fontSize%3A%2022%2C%0A%20%20%20%20fontWeight%3A%20%27600%27%2C%0A%20%20%20%20marginBottom%3A%2010%2C%0A%20%20%7D%2C%0A%20%20error%3A%20%7B%0A%20%20%20%20color%3A%20%27red%27%2C%0A%20%20%20%20fontSize%3A%2016%2C%0A%20%20%7D%2C%0A%7D%29%3B%0A&dependencies=expo-location%40~19.0.8)** (SDK 54, 필요한 패키지 자동 포함)



**🇰🇷 한글 해설**

**한 번만 위치 가져오기** (화면이 열릴 때 등).
코드 흐름: `useEffect` 안에서 async 함수 정의 → 권한 요청 → `granted` 아니면 에러 메시지 → `getCurrentPositionAsync` → state 저장 → 화면에 위도/경도.

### 📘 Tracking Location in Real Time

Use this when you want updates as the user moves, for example, in a fitness or navigation app.

```jsx
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

▶ **[Snack에서 바로 실행하기](https://snack.expo.dev/?name=WEB530%20W7%20Tracking%20Location%20in%20Real%20Time&platform=web&sdkVersion=54.0.0&code=import%20React%2C%20%7B%20useState%2C%20useEffect%20%7D%20from%20%27react%27%3B%0Aimport%20%7B%20View%2C%20Text%2C%20StyleSheet%20%7D%20from%20%27react-native%27%3B%0Aimport%20%2A%20as%20Location%20from%20%27expo-location%27%3B%0A%0Aexport%20default%20function%20App%28%29%20%7B%0A%20%20const%20%5Bcoords%2C%20setCoords%5D%20%3D%20useState%28null%29%3B%0A%0A%20%20useEffect%28%28%29%20%3D%3E%20%7B%0A%20%20%20%20let%20subscription%3B%0A%20%20%20%20let%20cancelled%20%3D%20false%3B%0A%0A%20%20%20%20%28async%20%28%29%20%3D%3E%20%7B%0A%20%20%20%20%20%20const%20%7B%20status%20%7D%20%3D%20await%20Location.requestForegroundPermissionsAsync%28%29%3B%0A%20%20%20%20%20%20if%20%28status%20%21%3D%3D%20%27granted%27%20%7C%7C%20cancelled%29%20return%3B%0A%0A%20%20%20%20%20%20subscription%20%3D%20await%20Location.watchPositionAsync%28%0A%20%20%20%20%20%20%20%20%7B%0A%20%20%20%20%20%20%20%20%20%20accuracy%3A%20Location.Accuracy.High%2C%0A%20%20%20%20%20%20%20%20%20%20timeInterval%3A%201000%2C%20%2F%2F%20update%20every%20second%0A%20%20%20%20%20%20%20%20%20%20distanceInterval%3A%201%2C%20%2F%2F%20or%20every%201%20meter%0A%20%20%20%20%20%20%20%20%7D%2C%0A%20%20%20%20%20%20%20%20%28pos%29%20%3D%3E%20setCoords%28pos.coords%29%0A%20%20%20%20%20%20%29%3B%0A%0A%20%20%20%20%20%20%2F%2F%20The%20screen%20may%20have%20closed%20while%20we%20were%20waiting.%0A%20%20%20%20%20%20if%20%28cancelled%29%20subscription.remove%28%29%3B%0A%20%20%20%20%7D%29%28%29%3B%0A%0A%20%20%20%20return%20%28%29%20%3D%3E%20%7B%0A%20%20%20%20%20%20cancelled%20%3D%20true%3B%0A%20%20%20%20%20%20if%20%28subscription%29%20subscription.remove%28%29%3B%0A%20%20%20%20%7D%3B%0A%20%20%7D%2C%20%5B%5D%29%3B%0A%0A%20%20return%20%28%0A%20%20%20%20%3CView%20style%3D%7Bstyles.center%7D%3E%0A%20%20%20%20%20%20%3CText%20style%3D%7Bstyles.title%7D%3ELive%20Location%3C%2FText%3E%0A%20%20%20%20%20%20%7Bcoords%20%3F%20%28%0A%20%20%20%20%20%20%20%20%3C%3E%0A%20%20%20%20%20%20%20%20%20%20%3CText%3ELatitude%3A%20%7Bcoords.latitude%7D%3C%2FText%3E%0A%20%20%20%20%20%20%20%20%20%20%3CText%3ELongitude%3A%20%7Bcoords.longitude%7D%3C%2FText%3E%0A%20%20%20%20%20%20%20%20%3C%2F%3E%0A%20%20%20%20%20%20%29%20%3A%20%28%0A%20%20%20%20%20%20%20%20%3CText%3EWaiting%20for%20updates%E2%80%A6%3C%2FText%3E%0A%20%20%20%20%20%20%29%7D%0A%20%20%20%20%3C%2FView%3E%0A%20%20%29%3B%0A%7D%0A%0Aconst%20styles%20%3D%20StyleSheet.create%28%7B%0A%20%20center%3A%20%7B%0A%20%20%20%20flex%3A%201%2C%0A%20%20%20%20justifyContent%3A%20%27center%27%2C%0A%20%20%20%20alignItems%3A%20%27center%27%2C%0A%20%20%7D%2C%0A%20%20title%3A%20%7B%0A%20%20%20%20fontSize%3A%2022%2C%0A%20%20%20%20fontWeight%3A%20%27600%27%2C%0A%20%20%20%20marginBottom%3A%2010%2C%0A%20%20%7D%2C%0A%7D%29%3B%0A&dependencies=expo-location%40~19.0.8)** (SDK 54, 필요한 패키지 자동 포함)



**🇰🇷 한글 해설**

**실시간 추적** (운동 앱, 내비게이션).
- `watchPositionAsync(옵션, 콜백)`: 위치가 바뀔 때마다 콜백 호출.
- 반환된 **subscription**을 cleanup에서 `remove()`. 안 하면 GPS가 계속 켜져 **배터리 소모**.

### 📘 What You Should Remember

* Use useEffect for asynchronous location calls.
* Clean up watchers to avoid battery drain, including one that starts after the screen has already closed.

**🇰🇷 한글 해설**

- 비동기 위치 호출은 **useEffect** 안에서.
- watcher는 **반드시 정리**. 화면이 닫힌 **뒤에** 시작된 watcher까지 (그래서 `cancelled` 깃발이 필요해요, 아래 7.1 Live Location 참고).


---

## 2. 📘 코스노트: Displaying Maps

> 원문 출처: https://seneca-ictoer.github.io/WEB530/G-Geolocation/disp-maps

Interactive maps are a common feature in mobile apps, whether you're showing nearby places, tracking movement, or visualizing routes. In React Native, the easiest way to display a map is by using the react-native-maps library, which provides the `MapView` component.

💡 When running in Snack, maps work on a real device through Expo Go. They won’t render in the web preview, so the examples open on **My Device**: scan the QR code with Expo Go to run them.

`MapView` wraps the phone's own map, so it is a different map on each platform: in Expo Go, iOS draws Apple Maps and Android draws Google Maps. Most props work on both, but some are one platform only.

**🇰🇷 한글 해설**

지도는 **`react-native-maps`** 의 **`MapView`** 컴포넌트로 보여 줘요.
- Snack에서는 Expo Go(실제 폰)에서만 보이고 **Web 미리보기에서는 안 보여요**.
- MapView는 **폰 자체의 지도**를 감싼 거라 플랫폼마다 달라요: **iOS = Apple Maps, Android = Google Maps**. 대부분의 prop은 둘 다 되지만 일부는 한쪽만. (시험 포인트)

### 📘 Rendering a Basic Map

Once you import `MapView`, you can render a full‑screen map just like any other component. The example below shows the user’s location as a blue dot, and a **Find Me** button moves the map back to it.

```jsx
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

▶ **[Snack에서 바로 실행하기](https://snack.expo.dev/?name=WEB530%20W7%20Rendering%20a%20Basic%20Map&platform=ios&sdkVersion=54.0.0&code=import%20React%2C%20%7B%20useState%2C%20useEffect%2C%20useRef%20%7D%20from%20%27react%27%3B%0Aimport%20%7B%20StyleSheet%2C%20View%2C%20Text%2C%20Pressable%20%7D%20from%20%27react-native%27%3B%0Aimport%20MapView%20from%20%27react-native-maps%27%3B%0Aimport%20%2A%20as%20Location%20from%20%27expo-location%27%3B%0A%0Aexport%20default%20function%20App%28%29%20%7B%0A%20%20const%20%5BcanShowUser%2C%20setCanShowUser%5D%20%3D%20useState%28false%29%3B%0A%20%20const%20mapRef%20%3D%20useRef%28null%29%3B%0A%0A%20%20%2F%2F%20showsUserLocation%20fails%20silently%20on%20Android%20without%20permission.%0A%20%20useEffect%28%28%29%20%3D%3E%20%7B%0A%20%20%20%20%28async%20%28%29%20%3D%3E%20%7B%0A%20%20%20%20%20%20const%20%7B%20status%20%7D%20%3D%20await%20Location.requestForegroundPermissionsAsync%28%29%3B%0A%20%20%20%20%20%20setCanShowUser%28status%20%3D%3D%3D%20%27granted%27%29%3B%0A%20%20%20%20%7D%29%28%29%3B%0A%20%20%7D%2C%20%5B%5D%29%3B%0A%0A%20%20async%20function%20findMe%28%29%20%7B%0A%20%20%20%20const%20pos%20%3D%20await%20Location.getCurrentPositionAsync%28%7B%7D%29%3B%0A%20%20%20%20mapRef.current.animateToRegion%28%0A%20%20%20%20%20%20%7B%0A%20%20%20%20%20%20%20%20latitude%3A%20pos.coords.latitude%2C%0A%20%20%20%20%20%20%20%20longitude%3A%20pos.coords.longitude%2C%0A%20%20%20%20%20%20%20%20latitudeDelta%3A%200.005%2C%0A%20%20%20%20%20%20%20%20longitudeDelta%3A%200.005%2C%0A%20%20%20%20%20%20%7D%2C%0A%20%20%20%20%20%201000%0A%20%20%20%20%29%3B%0A%20%20%7D%0A%0A%20%20return%20%28%0A%20%20%20%20%3CView%20style%3D%7Bstyles.container%7D%3E%0A%20%20%20%20%20%20%3CMapView%20ref%3D%7BmapRef%7D%20style%3D%7Bstyles.map%7D%20showsUserLocation%3D%7BcanShowUser%7D%20%2F%3E%0A%20%20%20%20%20%20%3CPressable%20style%3D%7Bstyles.button%7D%20onPress%3D%7BfindMe%7D%20disabled%3D%7B%21canShowUser%7D%3E%0A%20%20%20%20%20%20%20%20%3CText%20style%3D%7Bstyles.buttonText%7D%3EFind%20Me%3C%2FText%3E%0A%20%20%20%20%20%20%3C%2FPressable%3E%0A%20%20%20%20%3C%2FView%3E%0A%20%20%29%3B%0A%7D%0A%0Aconst%20styles%20%3D%20StyleSheet.create%28%7B%0A%20%20container%3A%20%7B%0A%20%20%20%20flex%3A%201%2C%0A%20%20%7D%2C%0A%20%20map%3A%20%7B%0A%20%20%20%20flex%3A%201%2C%0A%20%20%7D%2C%0A%20%20button%3A%20%7B%0A%20%20%20%20position%3A%20%27absolute%27%2C%0A%20%20%20%20bottom%3A%2040%2C%0A%20%20%20%20alignSelf%3A%20%27center%27%2C%0A%20%20%20%20padding%3A%2016%2C%0A%20%20%20%20borderRadius%3A%208%2C%0A%20%20%20%20backgroundColor%3A%20%27%232196F3%27%2C%0A%20%20%7D%2C%0A%20%20buttonText%3A%20%7B%0A%20%20%20%20color%3A%20%27white%27%2C%0A%20%20%20%20fontSize%3A%2018%2C%0A%20%20%7D%2C%0A%7D%29%3B%0A&dependencies=expo-location%40~19.0.8%2Creact-native-maps%401.20.1)** (SDK 54, 필요한 패키지 자동 포함)



**🇰🇷 한글 해설**

**코드 해설**: 전체 화면 지도 + 파란 점(내 위치) + **Find Me** 버튼으로 다시 내 위치로 이동.

### 📘 Understanding the Map Props

**`showsUserLocation`**
When enabled, the map displays a blue dot representing the user’s current GPS position. The app must already have location permission. On Android the dot silently never appears without it, so request it first with `expo-location`.

**`initialRegion`**
The part of the map shown when it first renders: a centre `latitude` and `longitude`, plus `latitudeDelta` and `longitudeDelta`, the span of the map in degrees. Smaller deltas zoom in. It only sets the start; changing it later does not move the map.

**`ref` and `animateToRegion`**
To move the map from code, give it a ref with `useRef`. `mapRef.current.animateToRegion(region, duration)` glides to a new region on both platforms (iOS ignores the duration).

**`followsUserLocation`**
Keeps the map centred on the user as they move. It is Apple Maps only, so it does nothing on Android. For both platforms, move the map yourself with `animateToRegion`, as the Find Me button does.

**🇰🇷 한글 해설**

**prop 4개 (시험 단골)**
- **`showsUserLocation`**: 파란 점. 앱이 이미 위치 권한이 있어야 해요. **Android는 권한 없으면 조용히 안 나와요** → expo-location으로 먼저 요청.
- **`initialRegion`**: 처음 보이는 영역 = 중심 `latitude`, `longitude` + 보이는 범위 `latitudeDelta`, `longitudeDelta`(도 단위). delta가 **작을수록 확대**. **시작만** 정함, 나중에 바꿔도 지도 안 움직임.
- **`ref` + `animateToRegion`**: 코드로 지도 이동. `useRef`로 ref 만들고 `mapRef.current.animateToRegion(region, duration)`. 두 플랫폼 다 되지만 **iOS는 duration 무시**.
- **`followsUserLocation`**: 사용자 따라 중심 유지. **Apple Maps 전용**, Android에선 아무것도 안 함. 두 플랫폼 다 하려면 animateToRegion으로 직접.


---

## 3. 📘 코스노트: Working with Maps

> 원문 출처: https://seneca-ictoer.github.io/WEB530/G-Geolocation/work-maps

Interactive maps become much more useful when you add your own markers, shapes, and custom data. The `react-native-maps` library lets you place pins, draw polygons, and control what appears on the map so you can highlight the locations that matter to your app.

**🇰🇷 한글 해설**

지도에 내 **마커(핀)**, **도형**, 데이터를 올리면 훨씬 유용해져요.

### 📘 Adding Custom Markers

Markers let you point out specific places, campuses, stores, landmarks, or anything your app cares about.
You can also hide the map's own points of interest (shops, restaurants, landmarks) to keep it focused. This is different on each platform: `showsPointsOfInterest={false}` works on iOS (Apple Maps), and a `customMapStyle` rule hides them on Android (Google Maps), so the example uses both. Setting `initialRegion` starts the map centred on the places you mark; the `Delta` values control how much of the map is visible (smaller is more zoomed in).

```jsx
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

▶ **[Snack에서 바로 실행하기](https://snack.expo.dev/?name=WEB530%20W7%20Adding%20Custom%20Markers&platform=ios&sdkVersion=54.0.0&code=import%20React%20from%20%27react%27%3B%0Aimport%20%7B%20StyleSheet%2C%20View%20%7D%20from%20%27react-native%27%3B%0Aimport%20MapView%2C%20%7B%20Marker%20%7D%20from%20%27react-native-maps%27%3B%0A%0A%2F%2F%20Centre%20the%20map%20on%20Seneca%27s%20Newnham%20Campus.%0Aconst%20newnham%20%3D%20%7B%0A%20%20latitude%3A%2043.79457%2C%0A%20%20longitude%3A%20-79.35043%2C%0A%20%20latitudeDelta%3A%200.01%2C%0A%20%20longitudeDelta%3A%200.01%2C%0A%7D%3B%0A%0A%2F%2F%20Google%20Maps%20%28Android%29%20hides%20points%20of%20interest%20with%20a%20style%20rule.%0Aconst%20hidePlaces%20%3D%20%5B%7B%20featureType%3A%20%27poi%27%2C%20stylers%3A%20%5B%7B%20visibility%3A%20%27off%27%20%7D%5D%20%7D%5D%3B%0A%0Aexport%20default%20function%20App%28%29%20%7B%0A%20%20return%20%28%0A%20%20%20%20%3CView%20style%3D%7Bstyles.container%7D%3E%0A%20%20%20%20%20%20%3CMapView%0A%20%20%20%20%20%20%20%20style%3D%7Bstyles.map%7D%0A%20%20%20%20%20%20%20%20initialRegion%3D%7Bnewnham%7D%0A%20%20%20%20%20%20%20%20showsPointsOfInterest%3D%7Bfalse%7D%0A%20%20%20%20%20%20%20%20customMapStyle%3D%7BhidePlaces%7D%0A%20%20%20%20%20%20%3E%0A%20%20%20%20%20%20%20%20%3CMarker%0A%20%20%20%20%20%20%20%20%20%20title%3D%22Seneca%20College%20Newnham%20Campus%22%0A%20%20%20%20%20%20%20%20%20%20description%3D%22Educational%20Institute%22%0A%20%20%20%20%20%20%20%20%20%20coordinate%3D%7B%7B%20latitude%3A%2043.79457%2C%20longitude%3A%20-79.35043%20%7D%7D%0A%20%20%20%20%20%20%20%20%2F%3E%0A%20%20%20%20%20%20%3C%2FMapView%3E%0A%20%20%20%20%3C%2FView%3E%0A%20%20%29%3B%0A%7D%0A%0Aconst%20styles%20%3D%20StyleSheet.create%28%7B%0A%20%20container%3A%20%7B%20flex%3A%201%20%7D%2C%0A%20%20map%3A%20%7B%20flex%3A%201%20%7D%2C%0A%7D%29%3B%0A&dependencies=react-native-maps%401.20.1)** (SDK 54, 필요한 패키지 자동 포함)


![Map with a marker on Newnham Campus](https://seneca-ictoer.github.io/WEB530/assets/images/map-peg-645d5568cc61b35c9bec87113db7296c.webp)


**🇰🇷 한글 해설**

**Marker** = 특정 좌표의 핀(캠퍼스, 가게, 랜드마크).
**지도 자체의 관심 장소(POI: 가게, 식당 등) 숨기기는 플랫폼마다 달라요**:
- iOS(Apple Maps): `showsPointsOfInterest={false}`
- Android(Google Maps): `customMapStyle` 규칙
→ 예제는 **둘 다** 써요. (Lab 6 Part 1 주석 내용!)
`initialRegion`으로 마커들이 보이는 곳에서 시작, delta로 확대 정도.

### 📘 Drawing Shapes (Polygons)

Polygons are useful for outlining regions, campus boundaries, delivery zones, neighborhoods, or any custom area your app needs to highlight.

```jsx
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

▶ **[Snack에서 바로 실행하기](https://snack.expo.dev/?name=WEB530%20W7%20Drawing%20Shapes%20%28Polygons%29&platform=ios&sdkVersion=54.0.0&code=import%20React%20from%20%27react%27%3B%0Aimport%20%7B%20StyleSheet%2C%20View%20%7D%20from%20%27react-native%27%3B%0Aimport%20MapView%2C%20%7B%20Polygon%20%7D%20from%20%27react-native-maps%27%3B%0A%0A%2F%2F%20Centre%20the%20map%20on%20Seneca%27s%20Newnham%20Campus.%0Aconst%20newnham%20%3D%20%7B%0A%20%20latitude%3A%2043.79607%2C%0A%20%20longitude%3A%20-79.3487%2C%0A%20%20latitudeDelta%3A%200.01%2C%0A%20%20longitudeDelta%3A%200.01%2C%0A%7D%3B%0A%0Aexport%20default%20function%20App%28%29%20%7B%0A%20%20return%20%28%0A%20%20%20%20%3CView%20style%3D%7Bstyles.container%7D%3E%0A%20%20%20%20%20%20%3CMapView%20style%3D%7Bstyles.map%7D%20initialRegion%3D%7Bnewnham%7D%3E%0A%20%20%20%20%20%20%20%20%3CPolygon%0A%20%20%20%20%20%20%20%20%20%20coordinates%3D%7B%5B%0A%20%20%20%20%20%20%20%20%20%20%20%20%7B%20latitude%3A%2043.79701%2C%20longitude%3A%20-79.35178%20%7D%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%7B%20latitude%3A%2043.79849%2C%20longitude%3A%20-79.3453%20%7D%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%7B%20latitude%3A%2043.79483%2C%20longitude%3A%20-79.34612%20%7D%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20%7B%20latitude%3A%2043.79382%2C%20longitude%3A%20-79.35049%20%7D%2C%0A%20%20%20%20%20%20%20%20%20%20%5D%7D%0A%20%20%20%20%20%20%20%20%20%20strokeWidth%3D%7B3%7D%0A%20%20%20%20%20%20%20%20%20%20strokeColor%3D%22red%22%0A%20%20%20%20%20%20%20%20%2F%3E%0A%20%20%20%20%20%20%3C%2FMapView%3E%0A%20%20%20%20%3C%2FView%3E%0A%20%20%29%3B%0A%7D%0A%0Aconst%20styles%20%3D%20StyleSheet.create%28%7B%0A%20%20container%3A%20%7B%20flex%3A%201%20%7D%2C%0A%20%20map%3A%20%7B%20flex%3A%201%20%7D%2C%0A%7D%29%3B%0A&dependencies=react-native-maps%401.20.1)** (SDK 54, 필요한 패키지 자동 포함)


![Map with a polygon around Newnham Campus](https://seneca-ictoer.github.io/WEB530/assets/images/map-poly-3d67e0b19e70066065d32717c1965d0e.webp)


**🇰🇷 한글 해설**

**Polygon** = 좌표 목록을 이어 닫힌 도형. 캠퍼스 경계, 배달 구역, 동네 등 **영역** 표시.

### 📘 What You Should Remember

* Use `Marker` to highlight specific coordinates.
* Use `Polygon` to outline areas or regions.
* Hide default points of interest with `showsPointsOfInterest={false}` (iOS) and a `customMapStyle` rule (Android) for a cleaner map.
* All of these features work on a real device through Expo Go.

**🇰🇷 한글 해설**

- 점은 `Marker`, 영역은 `Polygon`.
- POI 숨기기는 iOS `showsPointsOfInterest={false}` + Android `customMapStyle`.
- 모두 Expo Go 실제 기기에서 동작.


---

## 4. 💻 인클래스 예제: Week 7.1 - Notes and Examples

> 원문 출처: github.com/nick-romanidis/web530-2267-nsa  week-07.1-notes.md

### 💻 React Native Playground

React Native Playground (Snack)
_Use this for the examples. Modify App.js_
(https://snack.expo.dev)

- Keep Snack on SDK 54 (the default).
- Every example this week needs two packages: `expo-location` for the device's position and `react-native-maps` for the map. Replace the contents of `package.json` before the first example.

_package.json_

```json
{
  "dependencies": {
    "expo-location": "~19.0.8",
    "react-native-maps": "1.20.1"
  }
}
```

- This week runs on a phone. Choose **My Device** and open the Snack in Expo Go. The location examples also run on **Web**, where the browser asks for your location, but a laptop's position comes from Wi-Fi and is not very accurate. The map examples do not run on Web at all: `react-native-maps` has no web version.
- The first time an example asks, Expo Go shows the phone's permission dialog. Your answer is remembered for Expo Go, not for each Snack. To see the dialog again after you allow or deny it, change the location permission for Expo Go in the phone's Settings.

**🇰🇷 한글 해설**

패키지 2개 필요: `expo-location`(위치), `react-native-maps`(지도). 이번 주는 **폰**에서. 위치 예제는 Web에서도 되지만(브라우저가 위치를 물음) 노트북 위치는 Wi-Fi 기반이라 부정확. **지도는 Web 불가**. Expo Go의 권한 답은 Snack별이 아니라 **Expo Go 앱 단위**로 기억돼요. 다시 보려면 폰 설정에서 Expo Go 위치 권한을 바꾸세요.

### 💻 Why Location?

- Many apps start from where the user is: nearby restaurants, a ride pickup, the weather, a running route, a store's opening hours.
- The phone finds its position with GPS, Wi-Fi and cell towers. The app gets back coordinates: a latitude and a longitude.
- Location is private. It reveals where someone lives, works and goes every day, so the operating system makes the app ask, and the user can say no. The app has to keep working if they do.
- Location calls are asynchronous, like `fetch` in Week 5. They return promises, so they run inside `useEffect` and their results go into state.
- There are two ways to ask: once (where am I now?) or continuously (tell me every time I move). The first two examples show one each.

**🇰🇷 한글 해설**

- 위치에서 시작하는 앱이 많아요(근처 식당, 픽업, 날씨, 달리기).
- 폰은 **GPS, Wi-Fi, 기지국**으로 위치를 찾고 앱은 **위도와 경도**를 받아요.
- 위치는 **사생활**(집, 직장, 동선). 그래서 OS가 앱에게 묻게 하고 사용자는 **거절**할 수 있어요. 거절해도 앱은 계속 동작해야 해요.
- 위치 함수는 5주차 fetch처럼 **비동기(Promise)** → useEffect 안에서, 결과는 state에.
- 묻는 방법 2가지: **한 번**(지금 어디?), **계속**(움직일 때마다 알려 줘).

### 💻 Example: Where Am I?

- The simplest location feature: ask once, show the coordinates, and turn them into an address.

**🇰🇷 한글 해설**

가장 단순한 위치 기능: 한 번 묻고, 좌표 보여 주고, 주소로 바꾸기.

#### 💻 Starter Code

- Replace everything in `App.js`. The screen says it is finding you and spins forever, because nothing asks for the location yet.

```jsx
import { View, Text, ActivityIndicator, StyleSheet } from "react-native";

export default function MyApp() {
  return (
    <View style={styles.center}>
      <Text style={styles.title}>Where Am I?</Text>
      <ActivityIndicator size="large" />
      <Text style={styles.message}>Finding you...</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  title: { fontSize: 24, fontWeight: "600", marginBottom: 20 },
  message: { fontSize: 16, color: "#666", marginTop: 10 },
  error: { fontSize: 16, color: "red", textAlign: "center" },
  value: { fontSize: 18, marginBottom: 6 },
});
```

▶ **[Snack에서 바로 실행하기](https://snack.expo.dev/?name=WEB530%20W7%20Example%3A%20Where%20Am%20I%3F%20-%20Starter%20Code&platform=web&sdkVersion=54.0.0&code=import%20%7B%20View%2C%20Text%2C%20ActivityIndicator%2C%20StyleSheet%20%7D%20from%20%22react-native%22%3B%0A%0Aexport%20default%20function%20MyApp%28%29%20%7B%0A%20%20return%20%28%0A%20%20%20%20%3CView%20style%3D%7Bstyles.center%7D%3E%0A%20%20%20%20%20%20%3CText%20style%3D%7Bstyles.title%7D%3EWhere%20Am%20I%3F%3C%2FText%3E%0A%20%20%20%20%20%20%3CActivityIndicator%20size%3D%22large%22%20%2F%3E%0A%20%20%20%20%20%20%3CText%20style%3D%7Bstyles.message%7D%3EFinding%20you...%3C%2FText%3E%0A%20%20%20%20%3C%2FView%3E%0A%20%20%29%3B%0A%7D%0A%0Aconst%20styles%20%3D%20StyleSheet.create%28%7B%0A%20%20center%3A%20%7B%0A%20%20%20%20flex%3A%201%2C%0A%20%20%20%20justifyContent%3A%20%22center%22%2C%0A%20%20%20%20alignItems%3A%20%22center%22%2C%0A%20%20%20%20padding%3A%2020%2C%0A%20%20%7D%2C%0A%20%20title%3A%20%7B%20fontSize%3A%2024%2C%20fontWeight%3A%20%22600%22%2C%20marginBottom%3A%2020%20%7D%2C%0A%20%20message%3A%20%7B%20fontSize%3A%2016%2C%20color%3A%20%22%23666%22%2C%20marginTop%3A%2010%20%7D%2C%0A%20%20error%3A%20%7B%20fontSize%3A%2016%2C%20color%3A%20%22red%22%2C%20textAlign%3A%20%22center%22%20%7D%2C%0A%20%20value%3A%20%7B%20fontSize%3A%2018%2C%20marginBottom%3A%206%20%7D%2C%0A%7D%29%3B%0A)** (SDK 54, 필요한 패키지 자동 포함)

**🇰🇷 한글 해설**

"찾는 중" 스피너가 영원히 돌아요. 아직 아무도 위치를 묻지 않으니까.

#### 💻 Step 1 - Ask for Permission

- Add the hooks and `expo-location` above the `react-native` import.

```jsx
import { useState, useEffect } from "react";
import * as Location from "expo-location";
```

- `import * as Location` puts every export of the package on one `Location` object: `Location.requestForegroundPermissionsAsync`, `Location.getCurrentPositionAsync`, and so on.
- Add an `errorMsg` state at the top of `MyApp`. `null` means no error.

```jsx
const [errorMsg, setErrorMsg] = useState(null);
```

- Add an effect under it that asks for permission when the screen opens.

```jsx
useEffect(() => {
  async function getLocation() {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      setErrorMsg("Permission to access location was denied.");
      return;
    }
  }

  getLocation();
}, []);
```

- Every function in `expo-location` returns a promise. `await` waits for a promise and gives back its result, and it can only be used inside an `async` function. It does the same job as `.then()` from Week 5, but the code reads top to bottom.
- The effect function itself cannot be `async`, because an effect may only return a clean-up function, and an `async` function always returns a promise. So the effect defines an `async` function and calls it.
- Foreground permission means location while the app is open, which is all this week needs. Background location, while the app is closed, needs extra setup and app store review.
- Above the main `return`, return an error screen when permission was denied.

```jsx
if (errorMsg) {
  return (
    <View style={styles.center}>
      <Text style={styles.error}>{errorMsg}</Text>
    </View>
  );
}
```

- Run it on your phone. The permission dialog appears. Deny it, and the error replaces the spinner. A real app would explain what it needs location for and keep the rest of the app working.
- Allow it (in Settings, if you denied it), and the screen still spins. Permission only opens the door. Nothing has asked for the position yet.

**🇰🇷 한글 해설**

- `import * as Location from "expo-location";` → 모든 기능이 `Location.xxx`로.
- `errorMsg` state(`null` = 에러 없음).
- **async/await**: `await`는 Promise가 끝날 때까지 기다렸다가 결과를 줌. `async` 함수 안에서만 사용. 5주차 `.then()`과 같은 일인데 위에서 아래로 읽혀요.
- **useEffect 콜백 자체는 async가 될 수 없어요.** effect는 cleanup 함수만 return 할 수 있는데 async 함수는 항상 Promise를 return 하니까. 그래서 안에 async 함수를 정의하고 호출. (시험 개념 문제 후보!)
- **Foreground** 권한 = 앱이 열려 있는 동안. Background(앱이 닫혀도)는 추가 설정과 앱스토어 심사 필요.
- 거절 → 에러 화면. 허용해도 여전히 스피너: 권한은 **문만 열어 줄 뿐**, 위치를 아직 안 물었으니까.

#### 💻 Step 2 - Get the Position

- Add a `location` state under `errorMsg`.

```jsx
const [location, setLocation] = useState(null);
```

- Inside `getLocation`, after the permission check, ask for the position and store its coordinates. The `try` / `catch` handles a phone with location services turned off.

```jsx
try {
  const pos = await Location.getCurrentPositionAsync({});
  setLocation(pos.coords);
} catch {
  setErrorMsg("Could not get your location. Is location turned on?");
}
```

- `getCurrentPositionAsync` takes an options object. `{}` keeps the defaults.
- `pos` has a `timestamp` and a `coords` object with `latitude`, `longitude`, `accuracy`, `altitude`, `speed` and `heading`. Some of those can be `null`, depending on the device.
- `try` / `catch` is how `await` code handles a rejected promise. It is the `.catch()` from Week 5.
- Under the error screen, return the spinner screen until the location arrives.

```jsx
if (!location) {
  return (
    <View style={styles.center}>
      <ActivityIndicator size="large" />
      <Text style={styles.message}>Finding you...</Text>
    </View>
  );
}
```

- Replace the main `return` with the coordinates.

```jsx
return (
  <View style={styles.center}>
    <Text style={styles.title}>Where Am I?</Text>
    <Text style={styles.value}>Latitude: {location.latitude.toFixed(5)}</Text>
    <Text style={styles.value}>Longitude: {location.longitude.toFixed(5)}</Text>
    <Text style={styles.message}>
      Accurate to {Math.round(location.accuracy)} metres
    </Text>
  </View>
);
```

- Run it. After a moment the spinner is replaced by your coordinates. At Newnham Campus they are about 43.79 and -79.35.
- Latitude is north-south, from -90 at the South Pole to 90 at the North Pole. Longitude is east-west, from -180 to 180. West of Greenwich is negative, which is why Toronto's longitude is.
- `toFixed(5)` keeps five decimal places, about one metre. The raw numbers have more digits than the GPS can measure.
- `accuracy` is a radius in metres: the phone is somewhere inside that circle. Compare it indoors and next to a window. Run it on **Web** too: the laptop's Wi-Fi position is usually much less accurate.

**🇰🇷 한글 해설**

- `const pos = await Location.getCurrentPositionAsync({});` `{}`는 기본 옵션.
- `pos.coords`: `latitude`, `longitude`, `accuracy`, `altitude`, `speed`, `heading`(일부는 null 가능). `pos.timestamp`도 있음.
- **try/catch** = await 코드에서 reject 처리(5주차 `.catch()`). 폰의 위치 서비스가 꺼져 있을 때 대비.
- `toFixed(5)` = 소수점 5자리(약 1미터). GPS가 실제로 재는 것보다 숫자가 많아서 잘라요.
- **`accuracy`** = 미터 단위 **반지름**. 폰이 그 원 안 어딘가에 있다는 뜻. 실내 vs 창가 비교해 보세요.
- 뉴넘 캠퍼스 ≈ 43.79, -79.35.

#### 💻 Step 3 - Find the Address

- Coordinates mean nothing to a user. `reverseGeocodeAsync` turns them into an address. Add an `address` state under `location`.

```jsx
const [address, setAddress] = useState(null);
```

- Inside the `try`, after `setLocation`, look up the address.

```jsx
const places = await Location.reverseGeocodeAsync(pos.coords);
setAddress(places[0]);
```

- It returns an array of possible matches, best first, so the code keeps the first one.
- Show it under the accuracy line. The address arrives after the coordinates, so check it first.

```jsx
{address && (
  <Text style={styles.value}>
    {address.city}, {address.region}, {address.country}
  </Text>
)}
```

- An address has `name`, `street`, `streetNumber`, `city`, `region`, `postalCode` and `country`. Any of them can be `null`, so pick the ones that make sense for the app.
- Run it on your phone. The city, province and country appear under the coordinates. Reverse geocoding uses the phone's built-in service and does not work on **Web**: there it fails and the `catch` shows the error.

**🇰🇷 한글 해설**

- `reverseGeocodeAsync(coords)` → 좌표를 주소로(**reverse geocoding**). **배열**을 반환, 첫 번째가 가장 잘 맞는 것.
- 주소 필드: `name`, `street`, `streetNumber`, `city`, `region`, `postalCode`, `country`. 전부 **null 가능**.
- 주소는 좌표보다 늦게 오니까 렌더링 전에 `address &&`로 확인.
- 폰 내장 서비스를 써서 **Web에서는 실패** → catch가 에러 표시.

#### 💻 Finished Code

- Compare against this if something is not working.

```jsx
import { useState, useEffect } from "react";
import * as Location from "expo-location";
import { View, Text, ActivityIndicator, StyleSheet } from "react-native";

export default function MyApp() {
  const [errorMsg, setErrorMsg] = useState(null);
  const [location, setLocation] = useState(null);
  const [address, setAddress] = useState(null);

  useEffect(() => {
    async function getLocation() {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setErrorMsg("Permission to access location was denied.");
        return;
      }

      try {
        const pos = await Location.getCurrentPositionAsync({});
        setLocation(pos.coords);

        const places = await Location.reverseGeocodeAsync(pos.coords);
        setAddress(places[0]);
      } catch {
        setErrorMsg("Could not get your location. Is location turned on?");
      }
    }

    getLocation();
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
        <Text style={styles.message}>Finding you...</Text>
      </View>
    );
  }

  return (
    <View style={styles.center}>
      <Text style={styles.title}>Where Am I?</Text>
      <Text style={styles.value}>Latitude: {location.latitude.toFixed(5)}</Text>
      <Text style={styles.value}>Longitude: {location.longitude.toFixed(5)}</Text>
      <Text style={styles.message}>
        Accurate to {Math.round(location.accuracy)} metres
      </Text>
      {address && (
        <Text style={styles.value}>
          {address.city}, {address.region}, {address.country}
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  title: { fontSize: 24, fontWeight: "600", marginBottom: 20 },
  message: { fontSize: 16, color: "#666", marginTop: 10 },
  error: { fontSize: 16, color: "red", textAlign: "center" },
  value: { fontSize: 18, marginBottom: 6 },
});
```

▶ **[Snack에서 바로 실행하기](https://snack.expo.dev/?name=WEB530%20W7%20Example%3A%20Where%20Am%20I%3F%20-%20Finished%20Code&platform=web&sdkVersion=54.0.0&code=import%20%7B%20useState%2C%20useEffect%20%7D%20from%20%22react%22%3B%0Aimport%20%2A%20as%20Location%20from%20%22expo-location%22%3B%0Aimport%20%7B%20View%2C%20Text%2C%20ActivityIndicator%2C%20StyleSheet%20%7D%20from%20%22react-native%22%3B%0A%0Aexport%20default%20function%20MyApp%28%29%20%7B%0A%20%20const%20%5BerrorMsg%2C%20setErrorMsg%5D%20%3D%20useState%28null%29%3B%0A%20%20const%20%5Blocation%2C%20setLocation%5D%20%3D%20useState%28null%29%3B%0A%20%20const%20%5Baddress%2C%20setAddress%5D%20%3D%20useState%28null%29%3B%0A%0A%20%20useEffect%28%28%29%20%3D%3E%20%7B%0A%20%20%20%20async%20function%20getLocation%28%29%20%7B%0A%20%20%20%20%20%20const%20%7B%20status%20%7D%20%3D%20await%20Location.requestForegroundPermissionsAsync%28%29%3B%0A%20%20%20%20%20%20if%20%28status%20%21%3D%3D%20%22granted%22%29%20%7B%0A%20%20%20%20%20%20%20%20setErrorMsg%28%22Permission%20to%20access%20location%20was%20denied.%22%29%3B%0A%20%20%20%20%20%20%20%20return%3B%0A%20%20%20%20%20%20%7D%0A%0A%20%20%20%20%20%20try%20%7B%0A%20%20%20%20%20%20%20%20const%20pos%20%3D%20await%20Location.getCurrentPositionAsync%28%7B%7D%29%3B%0A%20%20%20%20%20%20%20%20setLocation%28pos.coords%29%3B%0A%0A%20%20%20%20%20%20%20%20const%20places%20%3D%20await%20Location.reverseGeocodeAsync%28pos.coords%29%3B%0A%20%20%20%20%20%20%20%20setAddress%28places%5B0%5D%29%3B%0A%20%20%20%20%20%20%7D%20catch%20%7B%0A%20%20%20%20%20%20%20%20setErrorMsg%28%22Could%20not%20get%20your%20location.%20Is%20location%20turned%20on%3F%22%29%3B%0A%20%20%20%20%20%20%7D%0A%20%20%20%20%7D%0A%0A%20%20%20%20getLocation%28%29%3B%0A%20%20%7D%2C%20%5B%5D%29%3B%0A%0A%20%20if%20%28errorMsg%29%20%7B%0A%20%20%20%20return%20%28%0A%20%20%20%20%20%20%3CView%20style%3D%7Bstyles.center%7D%3E%0A%20%20%20%20%20%20%20%20%3CText%20style%3D%7Bstyles.error%7D%3E%7BerrorMsg%7D%3C%2FText%3E%0A%20%20%20%20%20%20%3C%2FView%3E%0A%20%20%20%20%29%3B%0A%20%20%7D%0A%0A%20%20if%20%28%21location%29%20%7B%0A%20%20%20%20return%20%28%0A%20%20%20%20%20%20%3CView%20style%3D%7Bstyles.center%7D%3E%0A%20%20%20%20%20%20%20%20%3CActivityIndicator%20size%3D%22large%22%20%2F%3E%0A%20%20%20%20%20%20%20%20%3CText%20style%3D%7Bstyles.message%7D%3EFinding%20you...%3C%2FText%3E%0A%20%20%20%20%20%20%3C%2FView%3E%0A%20%20%20%20%29%3B%0A%20%20%7D%0A%0A%20%20return%20%28%0A%20%20%20%20%3CView%20style%3D%7Bstyles.center%7D%3E%0A%20%20%20%20%20%20%3CText%20style%3D%7Bstyles.title%7D%3EWhere%20Am%20I%3F%3C%2FText%3E%0A%20%20%20%20%20%20%3CText%20style%3D%7Bstyles.value%7D%3ELatitude%3A%20%7Blocation.latitude.toFixed%285%29%7D%3C%2FText%3E%0A%20%20%20%20%20%20%3CText%20style%3D%7Bstyles.value%7D%3ELongitude%3A%20%7Blocation.longitude.toFixed%285%29%7D%3C%2FText%3E%0A%20%20%20%20%20%20%3CText%20style%3D%7Bstyles.message%7D%3E%0A%20%20%20%20%20%20%20%20Accurate%20to%20%7BMath.round%28location.accuracy%29%7D%20metres%0A%20%20%20%20%20%20%3C%2FText%3E%0A%20%20%20%20%20%20%7Baddress%20%26%26%20%28%0A%20%20%20%20%20%20%20%20%3CText%20style%3D%7Bstyles.value%7D%3E%0A%20%20%20%20%20%20%20%20%20%20%7Baddress.city%7D%2C%20%7Baddress.region%7D%2C%20%7Baddress.country%7D%0A%20%20%20%20%20%20%20%20%3C%2FText%3E%0A%20%20%20%20%20%20%29%7D%0A%20%20%20%20%3C%2FView%3E%0A%20%20%29%3B%0A%7D%0A%0Aconst%20styles%20%3D%20StyleSheet.create%28%7B%0A%20%20center%3A%20%7B%0A%20%20%20%20flex%3A%201%2C%0A%20%20%20%20justifyContent%3A%20%22center%22%2C%0A%20%20%20%20alignItems%3A%20%22center%22%2C%0A%20%20%20%20padding%3A%2020%2C%0A%20%20%7D%2C%0A%20%20title%3A%20%7B%20fontSize%3A%2024%2C%20fontWeight%3A%20%22600%22%2C%20marginBottom%3A%2020%20%7D%2C%0A%20%20message%3A%20%7B%20fontSize%3A%2016%2C%20color%3A%20%22%23666%22%2C%20marginTop%3A%2010%20%7D%2C%0A%20%20error%3A%20%7B%20fontSize%3A%2016%2C%20color%3A%20%22red%22%2C%20textAlign%3A%20%22center%22%20%7D%2C%0A%20%20value%3A%20%7B%20fontSize%3A%2018%2C%20marginBottom%3A%206%20%7D%2C%0A%7D%29%3B%0A&dependencies=expo-location%40~19.0.8)** (SDK 54, 필요한 패키지 자동 포함)

**🇰🇷 한글 해설**

**완성 코드 해설**: `errorMsg`, `location`, `address` state → useEffect 안 async `getLocation`(권한 → 위치 → 주소, try/catch) → early return 3단(에러 → 스피너 → 결과). 5주차 fetch 패턴과 구조가 같아요.

### 💻 Example: Live Location

- A running app, a delivery tracker or turn-by-turn directions need the position every time it changes, not once.
- `watchPositionAsync` keeps calling a function with each new position until the app tells it to stop. Stopping matters: a watcher left running keeps the GPS on and drains the battery.
- Start from the finished Where Am I? code.

**🇰🇷 한글 해설**

- 달리기 앱, 배달 추적, 길 안내는 **바뀔 때마다** 위치가 필요.
- `watchPositionAsync`는 멈추라고 할 때까지 새 위치마다 함수를 불러요. **멈추는 게 중요**: 남겨 두면 GPS가 계속 켜져서 배터리가 닳아요.

#### 💻 Step 1 - Watch Instead of Get

- An address per update would be too many lookups, so take the address out: delete the `address` state, the two `reverseGeocodeAsync` lines and the `{address && ...}` block.
- Change the title in the main `return` to `Live Location`.
- Replace the whole effect.

```jsx
useEffect(() => {
  let subscription;
  let cancelled = false;

  async function startWatching() {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      setErrorMsg("Permission to access location was denied.");
      return;
    }

    try {
      subscription = await Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.High,
          timeInterval: 1000, // at most once a second
          distanceInterval: 1, // and only after moving a metre
        },
        (pos) => setLocation(pos.coords)
      );
    } catch {
      setErrorMsg("Could not get your location. Is location turned on?");
      return;
    }

    // The screen may have closed while we were waiting.
    if (cancelled) subscription.remove();
  }

  startWatching();

  return () => {
    cancelled = true;
    if (subscription) subscription.remove();
  };
}, []);
```

- The second argument to `watchPositionAsync` is the callback. It runs once for each new position, for as long as the watch lasts.
- The options trade accuracy for battery. `Accuracy.High` uses GPS. The two intervals stop the callback from running more than the app needs.
- `watchPositionAsync` resolves to a subscription, and `subscription.remove()` stops the watch. The clean-up function calls it when the screen closes, the same clean-up pattern as the timer in Week 2.
- The `cancelled` flag covers a race. The clean-up can run while the permission dialog is still open, before there is a subscription to remove. When the watch starts after that, the flag says the screen is gone, so it is removed straight away.
- Run it on your phone and walk around the room. The numbers change as you move. Standing still, they stop: `distanceInterval` skips updates under a metre.

**🇰🇷 한글 해설**

- 매 업데이트마다 주소 조회는 너무 많아서 주소 부분 제거.
- `watchPositionAsync({ accuracy: Location.Accuracy.High, timeInterval: 1000, distanceInterval: 1 }, (pos) => setLocation(pos.coords))`
  - 두 번째 인자 = **콜백**, 새 위치마다 실행.
  - 옵션은 **정확도 vs 배터리** 트레이드오프. `Accuracy.High` = GPS. 두 interval은 필요 이상 자주 부르지 않게(1초, 1미터).
- 결과는 **subscription**, `subscription.remove()`로 중지 → cleanup에서 호출(2주차 타이머 정리 패턴).
- **`cancelled` 깃발이 필요한 이유 (중요!)**: 권한 대화상자가 떠 있는 동안 화면이 닫히면 cleanup이 **subscription이 생기기 전에** 실행돼요. 그 뒤에 watch가 시작되면 아무도 안 끄게 되죠. 그래서 시작될 때 `if (cancelled) { sub.remove(); }`로 바로 끄기.
- 가만히 있으면 `distanceInterval` 때문에 업데이트가 멈춰요.

#### 💻 Step 2 - Count the Updates

- Add an `updates` state under `location`.

```jsx
const [updates, setUpdates] = useState(0);
```

- Make the callback count each update as well. The count depends on the previous count, so use the updater form.

```jsx
(pos) => {
  setLocation(pos.coords);
  setUpdates((prev) => prev + 1);
}
```

- Show the count under the accuracy line.

```jsx
<Text style={styles.message}>Updates: {updates}</Text>
```

- Run it. The count proves the watch is live. Walk, and it climbs about once a second. Stand still, and it stops.

**🇰🇷 한글 해설**

`setUpdates((prev) => prev + 1)` 함수형(이전 값 기반). 걸으면 약 1초에 한 번 증가, 멈추면 정지. watch가 살아 있다는 증거.

#### 💻 Step 3 - Pause and Resume

- Tracking should stop when the user does not need it. Add `Button` to the `react-native` import, and a `tracking` state under `updates`.

```jsx
const [tracking, setTracking] = useState(true);
```

- In the effect, add a check as the first line, and change the dependency array to `[tracking]`.

```jsx
useEffect(() => {
  if (!tracking) return;

  let subscription;
  // ...the rest of the effect is unchanged
}, [tracking]);
```

- Add the button under the updates count.

```jsx
<Button
  title={tracking ? "Pause" : "Resume"}
  onPress={() => setTracking((prev) => !prev)}
/>
```

- Pressing **Pause** changes `tracking`, so React runs the effect's clean-up, which removes the watch. Then it runs the effect again, which returns at the first line without starting a new one.
- Pressing **Resume** starts a new watch. The permission request runs again, but it answers straight away without a dialog, because the user already said yes.
- Run it. Pause, walk, and the count stays still. Resume, and it goes up by one straight away, because a new watch always reports the current position first. Then it climbs again as you move.

**🇰🇷 한글 해설**

- `tracking` state + effect 첫 줄 `if (!tracking) return;` + 의존성 `[tracking]`.
- **Pause** → tracking 변경 → React가 **cleanup 실행(watch 제거)** → effect 재실행 → 첫 줄에서 return(새 watch 없음).
- **Resume** → 새 watch. 권한 요청은 다시 실행되지만 이미 허락해서 대화상자 없이 즉시 응답. 새 watch는 항상 **현재 위치를 먼저** 보고해서 카운트가 바로 +1.
- 2주차 Lab Q5 스톱워치(`[running]`)와 완전히 같은 구조예요!

#### 💻 Finished Code

```jsx
import { useState, useEffect } from "react";
import * as Location from "expo-location";
import {
  View,
  Text,
  Button,
  ActivityIndicator,
  StyleSheet,
} from "react-native";

export default function MyApp() {
  const [errorMsg, setErrorMsg] = useState(null);
  const [location, setLocation] = useState(null);
  const [updates, setUpdates] = useState(0);
  const [tracking, setTracking] = useState(true);

  useEffect(() => {
    if (!tracking) return;

    let subscription;
    let cancelled = false;

    async function startWatching() {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setErrorMsg("Permission to access location was denied.");
        return;
      }

      try {
        subscription = await Location.watchPositionAsync(
          {
            accuracy: Location.Accuracy.High,
            timeInterval: 1000, // at most once a second
            distanceInterval: 1, // and only after moving a metre
          },
          (pos) => {
            setLocation(pos.coords);
            setUpdates((prev) => prev + 1);
          }
        );
      } catch {
        setErrorMsg("Could not get your location. Is location turned on?");
        return;
      }

      // The screen may have closed while we were waiting.
      if (cancelled) subscription.remove();
    }

    startWatching();

    return () => {
      cancelled = true;
      if (subscription) subscription.remove();
    };
  }, [tracking]);

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
        <Text style={styles.message}>Finding you...</Text>
      </View>
    );
  }

  return (
    <View style={styles.center}>
      <Text style={styles.title}>Live Location</Text>
      <Text style={styles.value}>Latitude: {location.latitude.toFixed(5)}</Text>
      <Text style={styles.value}>Longitude: {location.longitude.toFixed(5)}</Text>
      <Text style={styles.message}>
        Accurate to {Math.round(location.accuracy)} metres
      </Text>
      <Text style={styles.message}>Updates: {updates}</Text>
      <Button
        title={tracking ? "Pause" : "Resume"}
        onPress={() => setTracking((prev) => !prev)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  title: { fontSize: 24, fontWeight: "600", marginBottom: 20 },
  message: { fontSize: 16, color: "#666", marginTop: 10 },
  error: { fontSize: 16, color: "red", textAlign: "center" },
  value: { fontSize: 18, marginBottom: 6 },
});
```

▶ **[Snack에서 바로 실행하기](https://snack.expo.dev/?name=WEB530%20W7%20Example%3A%20Live%20Location%20-%20Finished%20Code&platform=web&sdkVersion=54.0.0&code=import%20%7B%20useState%2C%20useEffect%20%7D%20from%20%22react%22%3B%0Aimport%20%2A%20as%20Location%20from%20%22expo-location%22%3B%0Aimport%20%7B%0A%20%20View%2C%0A%20%20Text%2C%0A%20%20Button%2C%0A%20%20ActivityIndicator%2C%0A%20%20StyleSheet%2C%0A%7D%20from%20%22react-native%22%3B%0A%0Aexport%20default%20function%20MyApp%28%29%20%7B%0A%20%20const%20%5BerrorMsg%2C%20setErrorMsg%5D%20%3D%20useState%28null%29%3B%0A%20%20const%20%5Blocation%2C%20setLocation%5D%20%3D%20useState%28null%29%3B%0A%20%20const%20%5Bupdates%2C%20setUpdates%5D%20%3D%20useState%280%29%3B%0A%20%20const%20%5Btracking%2C%20setTracking%5D%20%3D%20useState%28true%29%3B%0A%0A%20%20useEffect%28%28%29%20%3D%3E%20%7B%0A%20%20%20%20if%20%28%21tracking%29%20return%3B%0A%0A%20%20%20%20let%20subscription%3B%0A%20%20%20%20let%20cancelled%20%3D%20false%3B%0A%0A%20%20%20%20async%20function%20startWatching%28%29%20%7B%0A%20%20%20%20%20%20const%20%7B%20status%20%7D%20%3D%20await%20Location.requestForegroundPermissionsAsync%28%29%3B%0A%20%20%20%20%20%20if%20%28status%20%21%3D%3D%20%22granted%22%29%20%7B%0A%20%20%20%20%20%20%20%20setErrorMsg%28%22Permission%20to%20access%20location%20was%20denied.%22%29%3B%0A%20%20%20%20%20%20%20%20return%3B%0A%20%20%20%20%20%20%7D%0A%0A%20%20%20%20%20%20try%20%7B%0A%20%20%20%20%20%20%20%20subscription%20%3D%20await%20Location.watchPositionAsync%28%0A%20%20%20%20%20%20%20%20%20%20%7B%0A%20%20%20%20%20%20%20%20%20%20%20%20accuracy%3A%20Location.Accuracy.High%2C%0A%20%20%20%20%20%20%20%20%20%20%20%20timeInterval%3A%201000%2C%20%2F%2F%20at%20most%20once%20a%20second%0A%20%20%20%20%20%20%20%20%20%20%20%20distanceInterval%3A%201%2C%20%2F%2F%20and%20only%20after%20moving%20a%20metre%0A%20%20%20%20%20%20%20%20%20%20%7D%2C%0A%20%20%20%20%20%20%20%20%20%20%28pos%29%20%3D%3E%20%7B%0A%20%20%20%20%20%20%20%20%20%20%20%20setLocation%28pos.coords%29%3B%0A%20%20%20%20%20%20%20%20%20%20%20%20setUpdates%28%28prev%29%20%3D%3E%20prev%20%2B%201%29%3B%0A%20%20%20%20%20%20%20%20%20%20%7D%0A%20%20%20%20%20%20%20%20%29%3B%0A%20%20%20%20%20%20%7D%20catch%20%7B%0A%20%20%20%20%20%20%20%20setErrorMsg%28%22Could%20not%20get%20your%20location.%20Is%20location%20turned%20on%3F%22%29%3B%0A%20%20%20%20%20%20%20%20return%3B%0A%20%20%20%20%20%20%7D%0A%0A%20%20%20%20%20%20%2F%2F%20The%20screen%20may%20have%20closed%20while%20we%20were%20waiting.%0A%20%20%20%20%20%20if%20%28cancelled%29%20subscription.remove%28%29%3B%0A%20%20%20%20%7D%0A%0A%20%20%20%20startWatching%28%29%3B%0A%0A%20%20%20%20return%20%28%29%20%3D%3E%20%7B%0A%20%20%20%20%20%20cancelled%20%3D%20true%3B%0A%20%20%20%20%20%20if%20%28subscription%29%20subscription.remove%28%29%3B%0A%20%20%20%20%7D%3B%0A%20%20%7D%2C%20%5Btracking%5D%29%3B%0A%0A%20%20if%20%28errorMsg%29%20%7B%0A%20%20%20%20return%20%28%0A%20%20%20%20%20%20%3CView%20style%3D%7Bstyles.center%7D%3E%0A%20%20%20%20%20%20%20%20%3CText%20style%3D%7Bstyles.error%7D%3E%7BerrorMsg%7D%3C%2FText%3E%0A%20%20%20%20%20%20%3C%2FView%3E%0A%20%20%20%20%29%3B%0A%20%20%7D%0A%0A%20%20if%20%28%21location%29%20%7B%0A%20%20%20%20return%20%28%0A%20%20%20%20%20%20%3CView%20style%3D%7Bstyles.center%7D%3E%0A%20%20%20%20%20%20%20%20%3CActivityIndicator%20size%3D%22large%22%20%2F%3E%0A%20%20%20%20%20%20%20%20%3CText%20style%3D%7Bstyles.message%7D%3EFinding%20you...%3C%2FText%3E%0A%20%20%20%20%20%20%3C%2FView%3E%0A%20%20%20%20%29%3B%0A%20%20%7D%0A%0A%20%20return%20%28%0A%20%20%20%20%3CView%20style%3D%7Bstyles.center%7D%3E%0A%20%20%20%20%20%20%3CText%20style%3D%7Bstyles.title%7D%3ELive%20Location%3C%2FText%3E%0A%20%20%20%20%20%20%3CText%20style%3D%7Bstyles.value%7D%3ELatitude%3A%20%7Blocation.latitude.toFixed%285%29%7D%3C%2FText%3E%0A%20%20%20%20%20%20%3CText%20style%3D%7Bstyles.value%7D%3ELongitude%3A%20%7Blocation.longitude.toFixed%285%29%7D%3C%2FText%3E%0A%20%20%20%20%20%20%3CText%20style%3D%7Bstyles.message%7D%3E%0A%20%20%20%20%20%20%20%20Accurate%20to%20%7BMath.round%28location.accuracy%29%7D%20metres%0A%20%20%20%20%20%20%3C%2FText%3E%0A%20%20%20%20%20%20%3CText%20style%3D%7Bstyles.message%7D%3EUpdates%3A%20%7Bupdates%7D%3C%2FText%3E%0A%20%20%20%20%20%20%3CButton%0A%20%20%20%20%20%20%20%20title%3D%7Btracking%20%3F%20%22Pause%22%20%3A%20%22Resume%22%7D%0A%20%20%20%20%20%20%20%20onPress%3D%7B%28%29%20%3D%3E%20setTracking%28%28prev%29%20%3D%3E%20%21prev%29%7D%0A%20%20%20%20%20%20%2F%3E%0A%20%20%20%20%3C%2FView%3E%0A%20%20%29%3B%0A%7D%0A%0Aconst%20styles%20%3D%20StyleSheet.create%28%7B%0A%20%20center%3A%20%7B%0A%20%20%20%20flex%3A%201%2C%0A%20%20%20%20justifyContent%3A%20%22center%22%2C%0A%20%20%20%20alignItems%3A%20%22center%22%2C%0A%20%20%20%20padding%3A%2020%2C%0A%20%20%7D%2C%0A%20%20title%3A%20%7B%20fontSize%3A%2024%2C%20fontWeight%3A%20%22600%22%2C%20marginBottom%3A%2020%20%7D%2C%0A%20%20message%3A%20%7B%20fontSize%3A%2016%2C%20color%3A%20%22%23666%22%2C%20marginTop%3A%2010%20%7D%2C%0A%20%20error%3A%20%7B%20fontSize%3A%2016%2C%20color%3A%20%22red%22%2C%20textAlign%3A%20%22center%22%20%7D%2C%0A%20%20value%3A%20%7B%20fontSize%3A%2018%2C%20marginBottom%3A%206%20%7D%2C%0A%7D%29%3B%0A&dependencies=expo-location%40~19.0.8)** (SDK 54, 필요한 패키지 자동 포함)

**🇰🇷 한글 해설**

**완성 코드 해설**: `[tracking]` 의존 effect 안에서 `cancelled` 깃발 + `subscription` 변수 → async 함수(권한 → watch) → cleanup에서 `cancelled = true; subscription?.remove();`. Pause/Resume 버튼. Test 2에서 "watcher 정리" 코드를 쓰라고 하면 이 패턴.

### 💻 Maps

- Coordinates on a screen are hard to read. A map shows them: where the user is, where the places are, and how they relate.
- `react-native-maps` provides the `MapView` component. It is not a picture of a map. It wraps the phone's own map, so it pans, zooms and rotates like the Maps app.
- That means it is a different map on each platform. In Expo Go, iOS draws Apple Maps and Android draws Google Maps. Most props work on both, but some are one platform only. The examples point those out.
- Expo Go needs no API key for the map. A published Android app needs a Google Maps key, which is a build setting, not code.
- Choose **My Device** for every map example. The **Web** preview shows an error, because there is no web version.

**🇰🇷 한글 해설**

- 좌표 숫자는 읽기 어려워요. 지도로 보여 주면 관계가 보여요.
- `MapView`는 **그림이 아니라 폰의 진짜 지도**를 감싼 것 → 이동, 확대, 회전이 Maps 앱처럼.
- 플랫폼마다 다른 지도(iOS Apple, Android Google), 일부 prop은 한쪽 전용.
- Expo Go는 API 키 불필요. 출시하는 Android 앱은 Google Maps 키 필요(빌드 설정).
- **모든 지도 예제는 My Device.** Web은 에러.

### 💻 Example: Your First Map



**🇰🇷 한글 해설**

첫 지도: 화면 채우기 → 캠퍼스에서 시작 → 파란 점 → Find Me 버튼.

#### 💻 Starter Code

- Replace everything in `App.js`. It has a **Find Me** button over an empty screen, and the region for Newnham Campus, which the steps use.

```jsx
import { View, Text, Pressable, StyleSheet } from "react-native";

const NEWNHAM = {
  latitude: 43.79457,
  longitude: -79.35043,
  latitudeDelta: 0.01,
  longitudeDelta: 0.01,
};

export default function MyApp() {
  return (
    <View style={styles.container}>
      <Pressable
        style={({ pressed }) => [styles.button, pressed && styles.pressed]}
      >
        <Text style={styles.buttonText}>Find Me</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  map: { flex: 1 },
  button: {
    position: "absolute",
    bottom: 40,
    alignSelf: "center",
    padding: 16,
    borderRadius: 8,
    backgroundColor: "#2196F3",
  },
  pressed: { backgroundColor: "#1565C0" },
  buttonText: { color: "white", fontSize: 18 },
});
```

▶ **[Snack에서 바로 실행하기](https://snack.expo.dev/?name=WEB530%20W7%20Example%3A%20Your%20First%20Map%20-%20Starter%20Code&platform=web&sdkVersion=54.0.0&code=import%20%7B%20View%2C%20Text%2C%20Pressable%2C%20StyleSheet%20%7D%20from%20%22react-native%22%3B%0A%0Aconst%20NEWNHAM%20%3D%20%7B%0A%20%20latitude%3A%2043.79457%2C%0A%20%20longitude%3A%20-79.35043%2C%0A%20%20latitudeDelta%3A%200.01%2C%0A%20%20longitudeDelta%3A%200.01%2C%0A%7D%3B%0A%0Aexport%20default%20function%20MyApp%28%29%20%7B%0A%20%20return%20%28%0A%20%20%20%20%3CView%20style%3D%7Bstyles.container%7D%3E%0A%20%20%20%20%20%20%3CPressable%0A%20%20%20%20%20%20%20%20style%3D%7B%28%7B%20pressed%20%7D%29%20%3D%3E%20%5Bstyles.button%2C%20pressed%20%26%26%20styles.pressed%5D%7D%0A%20%20%20%20%20%20%3E%0A%20%20%20%20%20%20%20%20%3CText%20style%3D%7Bstyles.buttonText%7D%3EFind%20Me%3C%2FText%3E%0A%20%20%20%20%20%20%3C%2FPressable%3E%0A%20%20%20%20%3C%2FView%3E%0A%20%20%29%3B%0A%7D%0A%0Aconst%20styles%20%3D%20StyleSheet.create%28%7B%0A%20%20container%3A%20%7B%20flex%3A%201%20%7D%2C%0A%20%20map%3A%20%7B%20flex%3A%201%20%7D%2C%0A%20%20button%3A%20%7B%0A%20%20%20%20position%3A%20%22absolute%22%2C%0A%20%20%20%20bottom%3A%2040%2C%0A%20%20%20%20alignSelf%3A%20%22center%22%2C%0A%20%20%20%20padding%3A%2016%2C%0A%20%20%20%20borderRadius%3A%208%2C%0A%20%20%20%20backgroundColor%3A%20%22%232196F3%22%2C%0A%20%20%7D%2C%0A%20%20pressed%3A%20%7B%20backgroundColor%3A%20%22%231565C0%22%20%7D%2C%0A%20%20buttonText%3A%20%7B%20color%3A%20%22white%22%2C%20fontSize%3A%2018%20%7D%2C%0A%7D%29%3B%0A)** (SDK 54, 필요한 패키지 자동 포함)

- `position: "absolute"` takes the button out of the flexbox layout and places it 40 points above the bottom edge, on top of whatever else is there. `alignSelf: "center"` centres it across.
- The button is the `Pressable` from Week 6, with its pressed style. It does nothing yet.

**🇰🇷 한글 해설**

- `position: "absolute"` + `bottom: 40` → 버튼을 flexbox 흐름에서 빼서 바닥 위 40에 **떠 있게**. `alignSelf: "center"`로 가로 가운데.
- 버튼은 6주차 Pressable + pressed 스타일.

#### 💻 Step 1 - Show a Map

- Import `MapView` under the `react-native` import. It is the package's default export, so it has no braces.

```jsx
import MapView from "react-native-maps";
```

- Add the map as the first child of the container, above the button.

```jsx
<MapView style={styles.map} />
```

- A map has no size of its own. `flex: 1` makes it fill the screen. Without a size it renders as nothing.
- The button comes after the map in the JSX, so it draws on top of it.
- Run it on your phone. Drag to pan, pinch to zoom, and twist with two fingers to rotate. All of that is built in. The starting view is wherever the platform decides, often a whole continent.

**🇰🇷 한글 해설**

- `import MapView from "react-native-maps";` → **default export라 중괄호 없음**.
- 지도는 크기가 없어서 `style={{ flex: 1 }}`(또는 StyleSheet)로 채워야 보여요. 없으면 **아무것도 안 그려짐**.
- JSX에서 **뒤에 오는 것이 위에** 그려져요. 버튼이 지도 뒤에 있어서 지도 위에 떠요.
- 드래그 이동, 핀치 확대, 두 손가락 회전은 다 내장.

#### 💻 Step 2 - Start on Campus

- Give the map a starting region.

```jsx
<MapView style={styles.map} initialRegion={NEWNHAM} />
```

- A region is a centre point and a span. `latitudeDelta` and `longitudeDelta` are how many degrees of latitude and longitude fit on the screen. 0.01 degrees of latitude is about a kilometre.
- A smaller delta zooms in. Change both deltas to `0.1` and run it: you see most of North York. Change them to `0.002`: you see one building. Change them back to `0.01`.
- `initialRegion` only sets where the map starts. After that the user moves the map, and changing the prop does nothing. To move the map later, the code has to tell it to, which is Step 4.

**🇰🇷 한글 해설**

- region = 중심 + 범위. delta 0.01 ≈ 1km.
- 0.1 → 노스요크 대부분, 0.002 → 건물 하나. **작을수록 확대.**
- `initialRegion`은 **시작만**. 이후 prop을 바꿔도 지도는 그대로. 나중에 움직이려면 코드로 명령(Step 4).

#### 💻 Step 3 - Show the Blue Dot

- `showsUserLocation` draws the user as a blue dot, but on Android it fails silently unless the app already has location permission. So ask first with `expo-location`, as in the first example.
- Add the imports.

```jsx
import { useState, useEffect } from "react";
import * as Location from "expo-location";
```

- Add a state and an effect at the top of `MyApp`.

```jsx
const [canShowUser, setCanShowUser] = useState(false);

useEffect(() => {
  async function askPermission() {
    const { status } = await Location.requestForegroundPermissionsAsync();
    setCanShowUser(status === "granted");
  }

  askPermission();
}, []);
```

- Pass the result to the map.

```jsx
<MapView
  style={styles.map}
  initialRegion={NEWNHAM}
  showsUserLocation={canShowUser}
/>
```

- Run it. If you are on campus, the blue dot is on the map. If not, pan or zoom out to find it. The pale circle around it is the accuracy radius from the first example.
- `MapView` also has a `followsUserLocation` prop that keeps the map centred on the user, but it is Apple Maps only. It does nothing on Android. The next step works on both.

**🇰🇷 한글 해설**

- `showsUserLocation`은 **Android에서 권한 없으면 조용히 실패** → expo-location으로 먼저 권한.
- `hasPermission` state + effect에서 요청 → `showsUserLocation={hasPermission}`.
- 파란 점 주변 옅은 원 = accuracy 반지름.
- `followsUserLocation`은 Apple 전용 → Step 4가 양쪽 해결책.

#### 💻 Step 4 - Find Me

- To move the map from code, the code needs the map itself. Add `useRef` to the React import.

```jsx
import { useState, useEffect, useRef } from "react";
```

- Create a ref under the state.

```jsx
const mapRef = useRef(null);
```

- Give the map the ref.

```jsx
<MapView
  ref={mapRef}
  style={styles.map}
  initialRegion={NEWNHAM}
  showsUserLocation={canShowUser}
/>
```

- Week 6 used `useRef` to keep an animated value. A ref passed as the `ref` prop works the other way: React puts the component into `mapRef.current` after it renders. The map component has methods, and `animateToRegion` moves the map.
- Add a function under the effect that finds the user and moves the map there.

```jsx
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
```

- The second argument is how long the animation takes, in milliseconds. iOS ignores it and uses its own speed.
- Wire up the button. `disabled` stops it from working until permission is granted.

```jsx
<Pressable
  style={({ pressed }) => [styles.button, pressed && styles.pressed]}
  onPress={findMe}
  disabled={!canShowUser}
>
```

- Run it. Pan far away, press **Find Me**, and the map glides back to the blue dot and zooms in. That is the "recentre" button every map app has, on both platforms.

**🇰🇷 한글 해설**

- `const mapRef = useRef(null);` + `<MapView ref={mapRef}>`.
- **6주차 useRef와 반대 방향**: 6주차는 값을 보관, 여기선 React가 렌더링 후 **컴포넌트 자체**를 `mapRef.current`에 넣어 줘요. 지도에는 메서드가 있고 그중 `animateToRegion`.
- `findMe`: 현재 위치 → `mapRef.current.animateToRegion({ ...coords, latitudeDelta: 0.005, longitudeDelta: 0.005 }, 1000)`. 1000ms(iOS는 무시).
- `disabled={!hasPermission}`.
- 모든 지도 앱에 있는 "다시 내 위치로" 버튼, 양쪽 플랫폼에서 동작.

#### 💻 Finished Code

```jsx
import { useState, useEffect, useRef } from "react";
import * as Location from "expo-location";
import { View, Text, Pressable, StyleSheet } from "react-native";
import MapView from "react-native-maps";

const NEWNHAM = {
  latitude: 43.79457,
  longitude: -79.35043,
  latitudeDelta: 0.01,
  longitudeDelta: 0.01,
};

export default function MyApp() {
  const [canShowUser, setCanShowUser] = useState(false);
  const mapRef = useRef(null);

  useEffect(() => {
    async function askPermission() {
      const { status } = await Location.requestForegroundPermissionsAsync();
      setCanShowUser(status === "granted");
    }

    askPermission();
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
      <MapView
        ref={mapRef}
        style={styles.map}
        initialRegion={NEWNHAM}
        showsUserLocation={canShowUser}
      />
      <Pressable
        style={({ pressed }) => [styles.button, pressed && styles.pressed]}
        onPress={findMe}
        disabled={!canShowUser}
      >
        <Text style={styles.buttonText}>Find Me</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  map: { flex: 1 },
  button: {
    position: "absolute",
    bottom: 40,
    alignSelf: "center",
    padding: 16,
    borderRadius: 8,
    backgroundColor: "#2196F3",
  },
  pressed: { backgroundColor: "#1565C0" },
  buttonText: { color: "white", fontSize: 18 },
});
```

▶ **[Snack에서 바로 실행하기](https://snack.expo.dev/?name=WEB530%20W7%20Example%3A%20Your%20First%20Map%20-%20Finished%20Code&platform=ios&sdkVersion=54.0.0&code=import%20%7B%20useState%2C%20useEffect%2C%20useRef%20%7D%20from%20%22react%22%3B%0Aimport%20%2A%20as%20Location%20from%20%22expo-location%22%3B%0Aimport%20%7B%20View%2C%20Text%2C%20Pressable%2C%20StyleSheet%20%7D%20from%20%22react-native%22%3B%0Aimport%20MapView%20from%20%22react-native-maps%22%3B%0A%0Aconst%20NEWNHAM%20%3D%20%7B%0A%20%20latitude%3A%2043.79457%2C%0A%20%20longitude%3A%20-79.35043%2C%0A%20%20latitudeDelta%3A%200.01%2C%0A%20%20longitudeDelta%3A%200.01%2C%0A%7D%3B%0A%0Aexport%20default%20function%20MyApp%28%29%20%7B%0A%20%20const%20%5BcanShowUser%2C%20setCanShowUser%5D%20%3D%20useState%28false%29%3B%0A%20%20const%20mapRef%20%3D%20useRef%28null%29%3B%0A%0A%20%20useEffect%28%28%29%20%3D%3E%20%7B%0A%20%20%20%20async%20function%20askPermission%28%29%20%7B%0A%20%20%20%20%20%20const%20%7B%20status%20%7D%20%3D%20await%20Location.requestForegroundPermissionsAsync%28%29%3B%0A%20%20%20%20%20%20setCanShowUser%28status%20%3D%3D%3D%20%22granted%22%29%3B%0A%20%20%20%20%7D%0A%0A%20%20%20%20askPermission%28%29%3B%0A%20%20%7D%2C%20%5B%5D%29%3B%0A%0A%20%20async%20function%20findMe%28%29%20%7B%0A%20%20%20%20const%20pos%20%3D%20await%20Location.getCurrentPositionAsync%28%7B%7D%29%3B%0A%20%20%20%20mapRef.current.animateToRegion%28%0A%20%20%20%20%20%20%7B%0A%20%20%20%20%20%20%20%20latitude%3A%20pos.coords.latitude%2C%0A%20%20%20%20%20%20%20%20longitude%3A%20pos.coords.longitude%2C%0A%20%20%20%20%20%20%20%20latitudeDelta%3A%200.005%2C%0A%20%20%20%20%20%20%20%20longitudeDelta%3A%200.005%2C%0A%20%20%20%20%20%20%7D%2C%0A%20%20%20%20%20%201000%0A%20%20%20%20%29%3B%0A%20%20%7D%0A%0A%20%20return%20%28%0A%20%20%20%20%3CView%20style%3D%7Bstyles.container%7D%3E%0A%20%20%20%20%20%20%3CMapView%0A%20%20%20%20%20%20%20%20ref%3D%7BmapRef%7D%0A%20%20%20%20%20%20%20%20style%3D%7Bstyles.map%7D%0A%20%20%20%20%20%20%20%20initialRegion%3D%7BNEWNHAM%7D%0A%20%20%20%20%20%20%20%20showsUserLocation%3D%7BcanShowUser%7D%0A%20%20%20%20%20%20%2F%3E%0A%20%20%20%20%20%20%3CPressable%0A%20%20%20%20%20%20%20%20style%3D%7B%28%7B%20pressed%20%7D%29%20%3D%3E%20%5Bstyles.button%2C%20pressed%20%26%26%20styles.pressed%5D%7D%0A%20%20%20%20%20%20%20%20onPress%3D%7BfindMe%7D%0A%20%20%20%20%20%20%20%20disabled%3D%7B%21canShowUser%7D%0A%20%20%20%20%20%20%3E%0A%20%20%20%20%20%20%20%20%3CText%20style%3D%7Bstyles.buttonText%7D%3EFind%20Me%3C%2FText%3E%0A%20%20%20%20%20%20%3C%2FPressable%3E%0A%20%20%20%20%3C%2FView%3E%0A%20%20%29%3B%0A%7D%0A%0Aconst%20styles%20%3D%20StyleSheet.create%28%7B%0A%20%20container%3A%20%7B%20flex%3A%201%20%7D%2C%0A%20%20map%3A%20%7B%20flex%3A%201%20%7D%2C%0A%20%20button%3A%20%7B%0A%20%20%20%20position%3A%20%22absolute%22%2C%0A%20%20%20%20bottom%3A%2040%2C%0A%20%20%20%20alignSelf%3A%20%22center%22%2C%0A%20%20%20%20padding%3A%2016%2C%0A%20%20%20%20borderRadius%3A%208%2C%0A%20%20%20%20backgroundColor%3A%20%22%232196F3%22%2C%0A%20%20%7D%2C%0A%20%20pressed%3A%20%7B%20backgroundColor%3A%20%22%231565C0%22%20%7D%2C%0A%20%20buttonText%3A%20%7B%20color%3A%20%22white%22%2C%20fontSize%3A%2018%20%7D%2C%0A%7D%29%3B%0A&dependencies=expo-location%40~19.0.8%2Creact-native-maps%401.20.1)** (SDK 54, 필요한 패키지 자동 포함)

**🇰🇷 한글 해설**

**완성 코드 해설**: MapView(ref, initialRegion, showsUserLocation) + 권한 effect + findMe(getCurrentPosition → animateToRegion) + 떠 있는 Pressable 버튼. Lab 6 Part 1~2의 뼈대예요.

### 💻 Example: Campus Markers

- A marker is a pin at a coordinate. It is how a map says "this place matters": a store, a pickup point, a search result.
- Markers are components inside the `MapView`, so a list of places becomes a list of markers with `.map()`, the same way a list became rows in Week 5.

**🇰🇷 한글 해설**

- Marker = 좌표의 핀, "이 장소가 중요해"라는 표시.
- Marker는 MapView **안의 자식 컴포넌트**라서 장소 배열을 `.map()`으로 마커 배열로(5주차 목록과 같은 원리).

#### 💻 Starter Code

- Replace everything in `App.js`. It has the Seneca campuses as data, a map that fits them all, and an info card at the bottom that the steps fill in.

```jsx
import { View, Text, StyleSheet } from "react-native";
import MapView from "react-native-maps";

const CAMPUSES = [
  {
    id: "newnham",
    name: "Newnham Campus",
    address: "1750 Finch Ave E, Toronto",
    latitude: 43.79457,
    longitude: -79.35043,
  },
  {
    id: "york",
    name: "Seneca@York",
    address: "70 The Pond Rd, Toronto",
    latitude: 43.77151,
    longitude: -79.49892,
  },
  {
    id: "markham",
    name: "Markham Campus",
    address: "8 The Seneca Way, Markham",
    latitude: 43.8495,
    longitude: -79.36649,
  },
  {
    id: "king",
    name: "King Campus",
    address: "13990 Dufferin St, King City",
    latitude: 43.95489,
    longitude: -79.51858,
  },
];

const GTA_NORTH = {
  latitude: 43.865,
  longitude: -79.435,
  latitudeDelta: 0.3,
  longitudeDelta: 0.3,
};

export default function MyApp() {
  return (
    <View style={styles.container}>
      <MapView style={styles.map} initialRegion={GTA_NORTH} />
      <View style={styles.card}>
        <Text style={styles.cardHint}>Tap a campus.</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  map: { flex: 1 },
  card: {
    position: "absolute",
    bottom: 40,
    left: 20,
    right: 20,
    padding: 16,
    borderRadius: 8,
    backgroundColor: "white",
  },
  cardTitle: { fontSize: 18, fontWeight: "600" },
  cardText: { fontSize: 14, color: "#666", marginTop: 4 },
  cardHint: { fontSize: 16, color: "#666", textAlign: "center" },
});
```

▶ **[Snack에서 바로 실행하기](https://snack.expo.dev/?name=WEB530%20W7%20Example%3A%20Campus%20Markers%20-%20Starter%20Code&platform=ios&sdkVersion=54.0.0&code=import%20%7B%20View%2C%20Text%2C%20StyleSheet%20%7D%20from%20%22react-native%22%3B%0Aimport%20MapView%20from%20%22react-native-maps%22%3B%0A%0Aconst%20CAMPUSES%20%3D%20%5B%0A%20%20%7B%0A%20%20%20%20id%3A%20%22newnham%22%2C%0A%20%20%20%20name%3A%20%22Newnham%20Campus%22%2C%0A%20%20%20%20address%3A%20%221750%20Finch%20Ave%20E%2C%20Toronto%22%2C%0A%20%20%20%20latitude%3A%2043.79457%2C%0A%20%20%20%20longitude%3A%20-79.35043%2C%0A%20%20%7D%2C%0A%20%20%7B%0A%20%20%20%20id%3A%20%22york%22%2C%0A%20%20%20%20name%3A%20%22Seneca%40York%22%2C%0A%20%20%20%20address%3A%20%2270%20The%20Pond%20Rd%2C%20Toronto%22%2C%0A%20%20%20%20latitude%3A%2043.77151%2C%0A%20%20%20%20longitude%3A%20-79.49892%2C%0A%20%20%7D%2C%0A%20%20%7B%0A%20%20%20%20id%3A%20%22markham%22%2C%0A%20%20%20%20name%3A%20%22Markham%20Campus%22%2C%0A%20%20%20%20address%3A%20%228%20The%20Seneca%20Way%2C%20Markham%22%2C%0A%20%20%20%20latitude%3A%2043.8495%2C%0A%20%20%20%20longitude%3A%20-79.36649%2C%0A%20%20%7D%2C%0A%20%20%7B%0A%20%20%20%20id%3A%20%22king%22%2C%0A%20%20%20%20name%3A%20%22King%20Campus%22%2C%0A%20%20%20%20address%3A%20%2213990%20Dufferin%20St%2C%20King%20City%22%2C%0A%20%20%20%20latitude%3A%2043.95489%2C%0A%20%20%20%20longitude%3A%20-79.51858%2C%0A%20%20%7D%2C%0A%5D%3B%0A%0Aconst%20GTA_NORTH%20%3D%20%7B%0A%20%20latitude%3A%2043.865%2C%0A%20%20longitude%3A%20-79.435%2C%0A%20%20latitudeDelta%3A%200.3%2C%0A%20%20longitudeDelta%3A%200.3%2C%0A%7D%3B%0A%0Aexport%20default%20function%20MyApp%28%29%20%7B%0A%20%20return%20%28%0A%20%20%20%20%3CView%20style%3D%7Bstyles.container%7D%3E%0A%20%20%20%20%20%20%3CMapView%20style%3D%7Bstyles.map%7D%20initialRegion%3D%7BGTA_NORTH%7D%20%2F%3E%0A%20%20%20%20%20%20%3CView%20style%3D%7Bstyles.card%7D%3E%0A%20%20%20%20%20%20%20%20%3CText%20style%3D%7Bstyles.cardHint%7D%3ETap%20a%20campus.%3C%2FText%3E%0A%20%20%20%20%20%20%3C%2FView%3E%0A%20%20%20%20%3C%2FView%3E%0A%20%20%29%3B%0A%7D%0A%0Aconst%20styles%20%3D%20StyleSheet.create%28%7B%0A%20%20container%3A%20%7B%20flex%3A%201%20%7D%2C%0A%20%20map%3A%20%7B%20flex%3A%201%20%7D%2C%0A%20%20card%3A%20%7B%0A%20%20%20%20position%3A%20%22absolute%22%2C%0A%20%20%20%20bottom%3A%2040%2C%0A%20%20%20%20left%3A%2020%2C%0A%20%20%20%20right%3A%2020%2C%0A%20%20%20%20padding%3A%2016%2C%0A%20%20%20%20borderRadius%3A%208%2C%0A%20%20%20%20backgroundColor%3A%20%22white%22%2C%0A%20%20%7D%2C%0A%20%20cardTitle%3A%20%7B%20fontSize%3A%2018%2C%20fontWeight%3A%20%22600%22%20%7D%2C%0A%20%20cardText%3A%20%7B%20fontSize%3A%2014%2C%20color%3A%20%22%23666%22%2C%20marginTop%3A%204%20%7D%2C%0A%20%20cardHint%3A%20%7B%20fontSize%3A%2016%2C%20color%3A%20%22%23666%22%2C%20textAlign%3A%20%22center%22%20%7D%2C%0A%7D%29%3B%0A&dependencies=react-native-maps%401.20.1)** (SDK 54, 필요한 패키지 자동 포함)

- The region's centre sits between the campuses, and a delta of 0.3 is wide enough to fit them all.
- The card uses `position: "absolute"` with `left` and `right`, so it stretches across the bottom of the map with a 20-point margin.

**🇰🇷 한글 해설**

세네카 캠퍼스 데이터 + 전부 보이는 지도(delta 0.3) + 하단 정보 카드(`position: "absolute"` + `left`, `right` 20 → 가로로 늘어남).

#### 💻 Step 1 - Add One Marker

- `Marker` is a named export of `react-native-maps`. Change the import.

```jsx
import MapView, { Marker } from "react-native-maps";
```

- Give the map a child. `MapView` is no longer self-closing.

```jsx
<MapView style={styles.map} initialRegion={GTA_NORTH}>
  <Marker
    coordinate={{ latitude: 43.79457, longitude: -79.35043 }}
    title="Newnham Campus"
    description="1750 Finch Ave E, Toronto"
  />
</MapView>
```

- `coordinate` is the only required prop: an object with `latitude` and `longitude`.
- Run it, and tap the pin. A bubble (a callout) shows the `title` and `description`. On Android, Google Maps also shows two buttons for directions and opening the place in the Maps app.

**🇰🇷 한글 해설**

- `import MapView, { Marker } from "react-native-maps";` → Marker는 **named export(중괄호)**.
- MapView가 더 이상 self-closing이 아님(자식 생김).
- 필수 prop은 **`coordinate`** 하나(`{ latitude, longitude }`).
- 핀을 누르면 **callout**(말풍선)에 `title`, `description`. Android는 길찾기 버튼도.

#### 💻 Step 2 - A Marker for Every Campus

- Replace the single marker with one marker per campus.

```jsx
<MapView style={styles.map} initialRegion={GTA_NORTH}>
  {CAMPUSES.map((campus) => (
    <Marker
      key={campus.id}
      coordinate={{ latitude: campus.latitude, longitude: campus.longitude }}
      title={campus.name}
      description={campus.address}
    />
  ))}
</MapView>
```

- Each marker needs a `key`, like every list in Week 5.
- Run it. Four pins, one per campus. Tap each one. Add a fifth object to `CAMPUSES` with any coordinates you like and it appears without touching the JSX.

**🇰🇷 한글 해설**

`CAMPUSES.map((c) => <Marker key={c.id} coordinate={...} title={c.name} />)`. 각 마커에 **key** 필수. 배열에 하나 추가하면 JSX 수정 없이 핀이 늘어나요.

#### 💻 Step 3 - Show the Selected Campus

- A callout is small. Most apps show details in their own panel instead. Add `useState` above the `react-native` import, and a `selected` state at the top of `MyApp`.

```jsx
import { useState } from "react";
```

```jsx
const [selected, setSelected] = useState(null);
```

- Give each marker an `onPress` that selects its campus.

```jsx
<Marker
  key={campus.id}
  coordinate={{ latitude: campus.latitude, longitude: campus.longitude }}
  title={campus.name}
  description={campus.address}
  onPress={() => setSelected(campus)}
/>
```

- Replace the hint in the card with the selected campus, or the hint when nothing is selected.

```jsx
<View style={styles.card}>
  {selected ? (
    <>
      <Text style={styles.cardTitle}>{selected.name}</Text>
      <Text style={styles.cardText}>{selected.address}</Text>
    </>
  ) : (
    <Text style={styles.cardHint}>Tap a campus.</Text>
  )}
</View>
```

- `selected` holds the whole campus object, so the card can show any of its fields.
- Run it. Tap a pin and the card shows its name and address. Tap another and the card changes. On Android the map also slides to centre the pin you tapped.
- `Marker` has a `pinColor` prop, but set it once. Changing it on a marker that is already drawn does not update on Android, so a different colour for the selected pin is not reliable. The card is the selection feedback.

**🇰🇷 한글 해설**

- callout은 작아서 보통 **자기 패널**에 상세를 보여 줘요.
- `selected` state에 **캠퍼스 객체 전체** 저장 → 카드에서 어떤 필드든 표시.
- 마커 `onPress={() => setSelected(c)}`.
- 카드: `{selected ? 이름/주소 : 힌트}`.
- `pinColor`는 처음 한 번만. Android는 그려진 마커의 색 변경이 반영 안 돼서 **선택 색으로 쓰기엔 불안정** → 카드가 선택 피드백.

#### 💻 Step 4 - Hide Other Places

- The base map is full of restaurants, shops and bus stops. They compete with your markers. Hiding them is different on each platform.
- Add a map style above `MyApp`. It is Google Maps' styling format: a list of rules, each picking a kind of feature and changing how it looks.

```jsx
const HIDE_PLACES = [{ featureType: "poi", stylers: [{ visibility: "off" }] }];
```

- Give the map both props.

```jsx
<MapView
  style={styles.map}
  initialRegion={GTA_NORTH}
  showsPointsOfInterest={false}
  customMapStyle={HIDE_PLACES}
>
```

- `poi` means point of interest: any business or landmark the map labels on its own.
- `showsPointsOfInterest={false}` hides them on iOS (Apple Maps) and is ignored on Android. `customMapStyle` hides them on Android (Google Maps) and is ignored by Apple Maps. Together they work on both.
- Run it and zoom in on a campus. Only roads, buildings and your markers are left.

**🇰🇷 한글 해설**

- 기본 지도의 식당, 가게, 버스 정류장이 내 마커와 경쟁.
- `customMapStyle={[{ featureType: "poi", stylers: [{ visibility: "off" }] }]}` → Google Maps 스타일 규칙. **poi** = point of interest.
- `showsPointsOfInterest={false}` → iOS용, Android는 무시. `customMapStyle` → Android용, Apple은 무시. **둘이 합쳐야 양쪽 다.**

#### 💻 Finished Code

```jsx
import { useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import MapView, { Marker } from "react-native-maps";

const CAMPUSES = [
  {
    id: "newnham",
    name: "Newnham Campus",
    address: "1750 Finch Ave E, Toronto",
    latitude: 43.79457,
    longitude: -79.35043,
  },
  {
    id: "york",
    name: "Seneca@York",
    address: "70 The Pond Rd, Toronto",
    latitude: 43.77151,
    longitude: -79.49892,
  },
  {
    id: "markham",
    name: "Markham Campus",
    address: "8 The Seneca Way, Markham",
    latitude: 43.8495,
    longitude: -79.36649,
  },
  {
    id: "king",
    name: "King Campus",
    address: "13990 Dufferin St, King City",
    latitude: 43.95489,
    longitude: -79.51858,
  },
];

const GTA_NORTH = {
  latitude: 43.865,
  longitude: -79.435,
  latitudeDelta: 0.3,
  longitudeDelta: 0.3,
};

const HIDE_PLACES = [{ featureType: "poi", stylers: [{ visibility: "off" }] }];

export default function MyApp() {
  const [selected, setSelected] = useState(null);

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        initialRegion={GTA_NORTH}
        showsPointsOfInterest={false}
        customMapStyle={HIDE_PLACES}
      >
        {CAMPUSES.map((campus) => (
          <Marker
            key={campus.id}
            coordinate={{ latitude: campus.latitude, longitude: campus.longitude }}
            title={campus.name}
            description={campus.address}
            onPress={() => setSelected(campus)}
          />
        ))}
      </MapView>
      <View style={styles.card}>
        {selected ? (
          <>
            <Text style={styles.cardTitle}>{selected.name}</Text>
            <Text style={styles.cardText}>{selected.address}</Text>
          </>
        ) : (
          <Text style={styles.cardHint}>Tap a campus.</Text>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  map: { flex: 1 },
  card: {
    position: "absolute",
    bottom: 40,
    left: 20,
    right: 20,
    padding: 16,
    borderRadius: 8,
    backgroundColor: "white",
  },
  cardTitle: { fontSize: 18, fontWeight: "600" },
  cardText: { fontSize: 14, color: "#666", marginTop: 4 },
  cardHint: { fontSize: 16, color: "#666", textAlign: "center" },
});
```

▶ **[Snack에서 바로 실행하기](https://snack.expo.dev/?name=WEB530%20W7%20Example%3A%20Campus%20Markers%20-%20Finished%20Code&platform=ios&sdkVersion=54.0.0&code=import%20%7B%20useState%20%7D%20from%20%22react%22%3B%0Aimport%20%7B%20View%2C%20Text%2C%20StyleSheet%20%7D%20from%20%22react-native%22%3B%0Aimport%20MapView%2C%20%7B%20Marker%20%7D%20from%20%22react-native-maps%22%3B%0A%0Aconst%20CAMPUSES%20%3D%20%5B%0A%20%20%7B%0A%20%20%20%20id%3A%20%22newnham%22%2C%0A%20%20%20%20name%3A%20%22Newnham%20Campus%22%2C%0A%20%20%20%20address%3A%20%221750%20Finch%20Ave%20E%2C%20Toronto%22%2C%0A%20%20%20%20latitude%3A%2043.79457%2C%0A%20%20%20%20longitude%3A%20-79.35043%2C%0A%20%20%7D%2C%0A%20%20%7B%0A%20%20%20%20id%3A%20%22york%22%2C%0A%20%20%20%20name%3A%20%22Seneca%40York%22%2C%0A%20%20%20%20address%3A%20%2270%20The%20Pond%20Rd%2C%20Toronto%22%2C%0A%20%20%20%20latitude%3A%2043.77151%2C%0A%20%20%20%20longitude%3A%20-79.49892%2C%0A%20%20%7D%2C%0A%20%20%7B%0A%20%20%20%20id%3A%20%22markham%22%2C%0A%20%20%20%20name%3A%20%22Markham%20Campus%22%2C%0A%20%20%20%20address%3A%20%228%20The%20Seneca%20Way%2C%20Markham%22%2C%0A%20%20%20%20latitude%3A%2043.8495%2C%0A%20%20%20%20longitude%3A%20-79.36649%2C%0A%20%20%7D%2C%0A%20%20%7B%0A%20%20%20%20id%3A%20%22king%22%2C%0A%20%20%20%20name%3A%20%22King%20Campus%22%2C%0A%20%20%20%20address%3A%20%2213990%20Dufferin%20St%2C%20King%20City%22%2C%0A%20%20%20%20latitude%3A%2043.95489%2C%0A%20%20%20%20longitude%3A%20-79.51858%2C%0A%20%20%7D%2C%0A%5D%3B%0A%0Aconst%20GTA_NORTH%20%3D%20%7B%0A%20%20latitude%3A%2043.865%2C%0A%20%20longitude%3A%20-79.435%2C%0A%20%20latitudeDelta%3A%200.3%2C%0A%20%20longitudeDelta%3A%200.3%2C%0A%7D%3B%0A%0Aconst%20HIDE_PLACES%20%3D%20%5B%7B%20featureType%3A%20%22poi%22%2C%20stylers%3A%20%5B%7B%20visibility%3A%20%22off%22%20%7D%5D%20%7D%5D%3B%0A%0Aexport%20default%20function%20MyApp%28%29%20%7B%0A%20%20const%20%5Bselected%2C%20setSelected%5D%20%3D%20useState%28null%29%3B%0A%0A%20%20return%20%28%0A%20%20%20%20%3CView%20style%3D%7Bstyles.container%7D%3E%0A%20%20%20%20%20%20%3CMapView%0A%20%20%20%20%20%20%20%20style%3D%7Bstyles.map%7D%0A%20%20%20%20%20%20%20%20initialRegion%3D%7BGTA_NORTH%7D%0A%20%20%20%20%20%20%20%20showsPointsOfInterest%3D%7Bfalse%7D%0A%20%20%20%20%20%20%20%20customMapStyle%3D%7BHIDE_PLACES%7D%0A%20%20%20%20%20%20%3E%0A%20%20%20%20%20%20%20%20%7BCAMPUSES.map%28%28campus%29%20%3D%3E%20%28%0A%20%20%20%20%20%20%20%20%20%20%3CMarker%0A%20%20%20%20%20%20%20%20%20%20%20%20key%3D%7Bcampus.id%7D%0A%20%20%20%20%20%20%20%20%20%20%20%20coordinate%3D%7B%7B%20latitude%3A%20campus.latitude%2C%20longitude%3A%20campus.longitude%20%7D%7D%0A%20%20%20%20%20%20%20%20%20%20%20%20title%3D%7Bcampus.name%7D%0A%20%20%20%20%20%20%20%20%20%20%20%20description%3D%7Bcampus.address%7D%0A%20%20%20%20%20%20%20%20%20%20%20%20onPress%3D%7B%28%29%20%3D%3E%20setSelected%28campus%29%7D%0A%20%20%20%20%20%20%20%20%20%20%2F%3E%0A%20%20%20%20%20%20%20%20%29%29%7D%0A%20%20%20%20%20%20%3C%2FMapView%3E%0A%20%20%20%20%20%20%3CView%20style%3D%7Bstyles.card%7D%3E%0A%20%20%20%20%20%20%20%20%7Bselected%20%3F%20%28%0A%20%20%20%20%20%20%20%20%20%20%3C%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%3CText%20style%3D%7Bstyles.cardTitle%7D%3E%7Bselected.name%7D%3C%2FText%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%3CText%20style%3D%7Bstyles.cardText%7D%3E%7Bselected.address%7D%3C%2FText%3E%0A%20%20%20%20%20%20%20%20%20%20%3C%2F%3E%0A%20%20%20%20%20%20%20%20%29%20%3A%20%28%0A%20%20%20%20%20%20%20%20%20%20%3CText%20style%3D%7Bstyles.cardHint%7D%3ETap%20a%20campus.%3C%2FText%3E%0A%20%20%20%20%20%20%20%20%29%7D%0A%20%20%20%20%20%20%3C%2FView%3E%0A%20%20%20%20%3C%2FView%3E%0A%20%20%29%3B%0A%7D%0A%0Aconst%20styles%20%3D%20StyleSheet.create%28%7B%0A%20%20container%3A%20%7B%20flex%3A%201%20%7D%2C%0A%20%20map%3A%20%7B%20flex%3A%201%20%7D%2C%0A%20%20card%3A%20%7B%0A%20%20%20%20position%3A%20%22absolute%22%2C%0A%20%20%20%20bottom%3A%2040%2C%0A%20%20%20%20left%3A%2020%2C%0A%20%20%20%20right%3A%2020%2C%0A%20%20%20%20padding%3A%2016%2C%0A%20%20%20%20borderRadius%3A%208%2C%0A%20%20%20%20backgroundColor%3A%20%22white%22%2C%0A%20%20%7D%2C%0A%20%20cardTitle%3A%20%7B%20fontSize%3A%2018%2C%20fontWeight%3A%20%22600%22%20%7D%2C%0A%20%20cardText%3A%20%7B%20fontSize%3A%2014%2C%20color%3A%20%22%23666%22%2C%20marginTop%3A%204%20%7D%2C%0A%20%20cardHint%3A%20%7B%20fontSize%3A%2016%2C%20color%3A%20%22%23666%22%2C%20textAlign%3A%20%22center%22%20%7D%2C%0A%7D%29%3B%0A&dependencies=react-native-maps%401.20.1)** (SDK 54, 필요한 패키지 자동 포함)

**🇰🇷 한글 해설**

**완성 코드 해설**: CAMPUSES 배열 → `.map()` Marker(key, coordinate, title, onPress) → selected state → 하단 카드. POI 숨기기 두 prop. 목록(5주차) + 선택 state + 지도가 합쳐진 Test 2 스타일 코드예요.

### 💻 Example: Drawing on the Map

- Markers show points. Shapes show areas: a campus boundary, a delivery zone, a neighbourhood. `Polygon` draws a closed shape through a list of coordinates.
- The map also reports where the user taps, which is how apps let users drop pins or draw their own areas.

**🇰🇷 한글 해설**

- Marker는 **점**, Polygon은 **영역**(캠퍼스 경계, 배달 구역).
- 지도는 사용자가 **탭한 좌표**도 알려 줘요(핀 꽂기, 영역 그리기).

#### 💻 Starter Code

- Replace everything in `App.js`. It is a map of Newnham Campus with a **Clear** button that the last step uses.

```jsx
import { View, Text, Pressable, StyleSheet } from "react-native";
import MapView from "react-native-maps";

const CAMPUS = {
  latitude: 43.79607,
  longitude: -79.3487,
  latitudeDelta: 0.01,
  longitudeDelta: 0.01,
};

export default function MyApp() {
  return (
    <View style={styles.container}>
      <MapView style={styles.map} initialRegion={CAMPUS} />
      <Pressable
        style={({ pressed }) => [styles.button, pressed && styles.pressed]}
      >
        <Text style={styles.buttonText}>Clear</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  map: { flex: 1 },
  button: {
    position: "absolute",
    bottom: 40,
    alignSelf: "center",
    padding: 16,
    borderRadius: 8,
    backgroundColor: "#2196F3",
  },
  pressed: { backgroundColor: "#1565C0" },
  buttonText: { color: "white", fontSize: 18 },
});
```

▶ **[Snack에서 바로 실행하기](https://snack.expo.dev/?name=WEB530%20W7%20Example%3A%20Drawing%20on%20the%20Map%20-%20Starter%20Code&platform=ios&sdkVersion=54.0.0&code=import%20%7B%20View%2C%20Text%2C%20Pressable%2C%20StyleSheet%20%7D%20from%20%22react-native%22%3B%0Aimport%20MapView%20from%20%22react-native-maps%22%3B%0A%0Aconst%20CAMPUS%20%3D%20%7B%0A%20%20latitude%3A%2043.79607%2C%0A%20%20longitude%3A%20-79.3487%2C%0A%20%20latitudeDelta%3A%200.01%2C%0A%20%20longitudeDelta%3A%200.01%2C%0A%7D%3B%0A%0Aexport%20default%20function%20MyApp%28%29%20%7B%0A%20%20return%20%28%0A%20%20%20%20%3CView%20style%3D%7Bstyles.container%7D%3E%0A%20%20%20%20%20%20%3CMapView%20style%3D%7Bstyles.map%7D%20initialRegion%3D%7BCAMPUS%7D%20%2F%3E%0A%20%20%20%20%20%20%3CPressable%0A%20%20%20%20%20%20%20%20style%3D%7B%28%7B%20pressed%20%7D%29%20%3D%3E%20%5Bstyles.button%2C%20pressed%20%26%26%20styles.pressed%5D%7D%0A%20%20%20%20%20%20%3E%0A%20%20%20%20%20%20%20%20%3CText%20style%3D%7Bstyles.buttonText%7D%3EClear%3C%2FText%3E%0A%20%20%20%20%20%20%3C%2FPressable%3E%0A%20%20%20%20%3C%2FView%3E%0A%20%20%29%3B%0A%7D%0A%0Aconst%20styles%20%3D%20StyleSheet.create%28%7B%0A%20%20container%3A%20%7B%20flex%3A%201%20%7D%2C%0A%20%20map%3A%20%7B%20flex%3A%201%20%7D%2C%0A%20%20button%3A%20%7B%0A%20%20%20%20position%3A%20%22absolute%22%2C%0A%20%20%20%20bottom%3A%2040%2C%0A%20%20%20%20alignSelf%3A%20%22center%22%2C%0A%20%20%20%20padding%3A%2016%2C%0A%20%20%20%20borderRadius%3A%208%2C%0A%20%20%20%20backgroundColor%3A%20%22%232196F3%22%2C%0A%20%20%7D%2C%0A%20%20pressed%3A%20%7B%20backgroundColor%3A%20%22%231565C0%22%20%7D%2C%0A%20%20buttonText%3A%20%7B%20color%3A%20%22white%22%2C%20fontSize%3A%2018%20%7D%2C%0A%7D%29%3B%0A&dependencies=react-native-maps%401.20.1)** (SDK 54, 필요한 패키지 자동 포함)

**🇰🇷 한글 해설**

뉴넘 캠퍼스 지도 + 마지막 단계에서 쓸 Clear 버튼.

#### 💻 Step 1 - Outline the Campus

- Add `Polygon` to the map import.

```jsx
import MapView, { Polygon } from "react-native-maps";
```

- Add the campus corners above `MyApp`.

```jsx
const CAMPUS_OUTLINE = [
  { latitude: 43.79701, longitude: -79.35178 },
  { latitude: 43.79849, longitude: -79.3453 },
  { latitude: 43.79483, longitude: -79.34612 },
  { latitude: 43.79382, longitude: -79.35049 },
];
```

- Draw it inside the map.

```jsx
<MapView style={styles.map} initialRegion={CAMPUS}>
  <Polygon coordinates={CAMPUS_OUTLINE} strokeWidth={3} strokeColor="red" />
</MapView>
```

- The polygon joins the points in order and closes the shape back to the first one. Four points make a four-sided shape. The order matters: swap two of them and the lines cross.
- Run it. A red outline sits around the campus, and it stays in place as you pan and zoom, because it is drawn in map coordinates, not screen points.

**🇰🇷 한글 해설**

- `Polygon` import, 캠퍼스 꼭짓점 배열 `CAMPUS_CORNERS`.
- `<Polygon coordinates={CAMPUS_CORNERS} strokeColor="red" strokeWidth={2} />`.
- 점들을 **순서대로** 잇고 첫 점으로 닫아요. 순서를 바꾸면 선이 꼬여요.
- 지도 좌표로 그려서 이동, 확대해도 제자리.

#### 💻 Step 2 - Fill It In

- Add a fill.

```jsx
<Polygon
  coordinates={CAMPUS_OUTLINE}
  strokeWidth={3}
  strokeColor="red"
  fillColor="rgba(255, 0, 0, 0.2)"
/>
```

- `rgba` is red, green, blue and alpha. The alpha, 0.2, makes the fill 20% opaque, so the map shows through. A solid fill would hide what is underneath.
- Run it. The campus is shaded, and the roads and buildings are still readable.

**🇰🇷 한글 해설**

`fillColor="rgba(255, 0, 0, 0.2)"` → rgba = 빨강, 초록, 파랑, **알파(투명도)**. 0.2 = 20% 불투명이라 지도가 비쳐 보여요.

#### 💻 Step 3 - Draw Your Own Shape

- Add `useState` above the `react-native` import, and `Marker` to the map import.

```jsx
import { useState } from "react";
```

```jsx
import MapView, { Marker, Polygon } from "react-native-maps";
```

- Add a `points` state at the top of `MyApp`.

```jsx
const [points, setPoints] = useState([]);
```

- Give the map an `onPress`. The tapped coordinate is in `e.nativeEvent.coordinate`. Adding it depends on the previous list, so use the updater form.

```jsx
<MapView
  style={styles.map}
  initialRegion={CAMPUS}
  onPress={(e) => {
    const point = e.nativeEvent.coordinate;
    setPoints((prev) => [...prev, point]);
  }}
>
```

- The coordinate is read into `point` first, so the updater only needs a plain value when React runs it later.
- Inside the map, under the campus polygon, show a marker for each point, and the shape once there are enough points for one.

```jsx
{points.map((point, index) => (
  <Marker key={index} coordinate={point} pinColor="blue" />
))}
{points.length >= 3 && (
  <Polygon
    coordinates={points}
    strokeWidth={3}
    strokeColor="blue"
    fillColor="rgba(0, 0, 255, 0.2)"
  />
)}
```

- The points have no ids, so the index is the key. That is safe here because points are only ever added to the end or cleared, never reordered.
- A polygon needs at least three points to have an area, so `&&` waits until there are three.
- Make the button clear the points.

```jsx
<Pressable
  style={({ pressed }) => [styles.button, pressed && styles.pressed]}
  onPress={() => setPoints([])}
>
```

- Run it. Tap three places: three blue pins, then a blue shape. Keep tapping and the shape grows. Press **Clear** to start again.
- A tap on one of the map's own labelled places, like a restaurant icon, is a tap on that place, not on the map, so it adds no point. Hiding the places, as in the previous example, fixes that.

**🇰🇷 한글 해설**

- `points` state(빈 배열).
- `onPress={(e) => { const point = e.nativeEvent.coordinate; setPoints((prev) => [...prev, point]); }}` → 탭한 좌표는 **`e.nativeEvent.coordinate`**. 함수형 업데이트. 좌표를 먼저 `point` 변수에 꺼내 두는 이유: 업데이터는 React가 나중에 실행하니까 이벤트 객체 대신 단순한 값만 쓰게.
- 점마다 Marker(**index를 key로**: 끝에 추가하거나 전부 지우기만 해서 순서가 안 바뀌니 안전).
- `{points.length >= 3 && <Polygon ... />}` → 면적이 있으려면 **최소 3점**.
- Clear: `setPoints([])`.
- 지도 자체의 장소 아이콘을 탭하면 그 장소를 누른 거라 점이 안 생겨요 → POI 숨기면 해결.

#### 💻 Finished Code

```jsx
import { useState } from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import MapView, { Marker, Polygon } from "react-native-maps";

const CAMPUS = {
  latitude: 43.79607,
  longitude: -79.3487,
  latitudeDelta: 0.01,
  longitudeDelta: 0.01,
};

const CAMPUS_OUTLINE = [
  { latitude: 43.79701, longitude: -79.35178 },
  { latitude: 43.79849, longitude: -79.3453 },
  { latitude: 43.79483, longitude: -79.34612 },
  { latitude: 43.79382, longitude: -79.35049 },
];

export default function MyApp() {
  const [points, setPoints] = useState([]);

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        initialRegion={CAMPUS}
        onPress={(e) => {
          const point = e.nativeEvent.coordinate;
          setPoints((prev) => [...prev, point]);
        }}
      >
        <Polygon
          coordinates={CAMPUS_OUTLINE}
          strokeWidth={3}
          strokeColor="red"
          fillColor="rgba(255, 0, 0, 0.2)"
        />
        {points.map((point, index) => (
          <Marker key={index} coordinate={point} pinColor="blue" />
        ))}
        {points.length >= 3 && (
          <Polygon
            coordinates={points}
            strokeWidth={3}
            strokeColor="blue"
            fillColor="rgba(0, 0, 255, 0.2)"
          />
        )}
      </MapView>
      <Pressable
        style={({ pressed }) => [styles.button, pressed && styles.pressed]}
        onPress={() => setPoints([])}
      >
        <Text style={styles.buttonText}>Clear</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  map: { flex: 1 },
  button: {
    position: "absolute",
    bottom: 40,
    alignSelf: "center",
    padding: 16,
    borderRadius: 8,
    backgroundColor: "#2196F3",
  },
  pressed: { backgroundColor: "#1565C0" },
  buttonText: { color: "white", fontSize: 18 },
});
```

▶ **[Snack에서 바로 실행하기](https://snack.expo.dev/?name=WEB530%20W7%20Example%3A%20Drawing%20on%20the%20Map%20-%20Finished%20Code&platform=ios&sdkVersion=54.0.0&code=import%20%7B%20useState%20%7D%20from%20%22react%22%3B%0Aimport%20%7B%20View%2C%20Text%2C%20Pressable%2C%20StyleSheet%20%7D%20from%20%22react-native%22%3B%0Aimport%20MapView%2C%20%7B%20Marker%2C%20Polygon%20%7D%20from%20%22react-native-maps%22%3B%0A%0Aconst%20CAMPUS%20%3D%20%7B%0A%20%20latitude%3A%2043.79607%2C%0A%20%20longitude%3A%20-79.3487%2C%0A%20%20latitudeDelta%3A%200.01%2C%0A%20%20longitudeDelta%3A%200.01%2C%0A%7D%3B%0A%0Aconst%20CAMPUS_OUTLINE%20%3D%20%5B%0A%20%20%7B%20latitude%3A%2043.79701%2C%20longitude%3A%20-79.35178%20%7D%2C%0A%20%20%7B%20latitude%3A%2043.79849%2C%20longitude%3A%20-79.3453%20%7D%2C%0A%20%20%7B%20latitude%3A%2043.79483%2C%20longitude%3A%20-79.34612%20%7D%2C%0A%20%20%7B%20latitude%3A%2043.79382%2C%20longitude%3A%20-79.35049%20%7D%2C%0A%5D%3B%0A%0Aexport%20default%20function%20MyApp%28%29%20%7B%0A%20%20const%20%5Bpoints%2C%20setPoints%5D%20%3D%20useState%28%5B%5D%29%3B%0A%0A%20%20return%20%28%0A%20%20%20%20%3CView%20style%3D%7Bstyles.container%7D%3E%0A%20%20%20%20%20%20%3CMapView%0A%20%20%20%20%20%20%20%20style%3D%7Bstyles.map%7D%0A%20%20%20%20%20%20%20%20initialRegion%3D%7BCAMPUS%7D%0A%20%20%20%20%20%20%20%20onPress%3D%7B%28e%29%20%3D%3E%20%7B%0A%20%20%20%20%20%20%20%20%20%20const%20point%20%3D%20e.nativeEvent.coordinate%3B%0A%20%20%20%20%20%20%20%20%20%20setPoints%28%28prev%29%20%3D%3E%20%5B...prev%2C%20point%5D%29%3B%0A%20%20%20%20%20%20%20%20%7D%7D%0A%20%20%20%20%20%20%3E%0A%20%20%20%20%20%20%20%20%3CPolygon%0A%20%20%20%20%20%20%20%20%20%20coordinates%3D%7BCAMPUS_OUTLINE%7D%0A%20%20%20%20%20%20%20%20%20%20strokeWidth%3D%7B3%7D%0A%20%20%20%20%20%20%20%20%20%20strokeColor%3D%22red%22%0A%20%20%20%20%20%20%20%20%20%20fillColor%3D%22rgba%28255%2C%200%2C%200%2C%200.2%29%22%0A%20%20%20%20%20%20%20%20%2F%3E%0A%20%20%20%20%20%20%20%20%7Bpoints.map%28%28point%2C%20index%29%20%3D%3E%20%28%0A%20%20%20%20%20%20%20%20%20%20%3CMarker%20key%3D%7Bindex%7D%20coordinate%3D%7Bpoint%7D%20pinColor%3D%22blue%22%20%2F%3E%0A%20%20%20%20%20%20%20%20%29%29%7D%0A%20%20%20%20%20%20%20%20%7Bpoints.length%20%3E%3D%203%20%26%26%20%28%0A%20%20%20%20%20%20%20%20%20%20%3CPolygon%0A%20%20%20%20%20%20%20%20%20%20%20%20coordinates%3D%7Bpoints%7D%0A%20%20%20%20%20%20%20%20%20%20%20%20strokeWidth%3D%7B3%7D%0A%20%20%20%20%20%20%20%20%20%20%20%20strokeColor%3D%22blue%22%0A%20%20%20%20%20%20%20%20%20%20%20%20fillColor%3D%22rgba%280%2C%200%2C%20255%2C%200.2%29%22%0A%20%20%20%20%20%20%20%20%20%20%2F%3E%0A%20%20%20%20%20%20%20%20%29%7D%0A%20%20%20%20%20%20%3C%2FMapView%3E%0A%20%20%20%20%20%20%3CPressable%0A%20%20%20%20%20%20%20%20style%3D%7B%28%7B%20pressed%20%7D%29%20%3D%3E%20%5Bstyles.button%2C%20pressed%20%26%26%20styles.pressed%5D%7D%0A%20%20%20%20%20%20%20%20onPress%3D%7B%28%29%20%3D%3E%20setPoints%28%5B%5D%29%7D%0A%20%20%20%20%20%20%3E%0A%20%20%20%20%20%20%20%20%3CText%20style%3D%7Bstyles.buttonText%7D%3EClear%3C%2FText%3E%0A%20%20%20%20%20%20%3C%2FPressable%3E%0A%20%20%20%20%3C%2FView%3E%0A%20%20%29%3B%0A%7D%0A%0Aconst%20styles%20%3D%20StyleSheet.create%28%7B%0A%20%20container%3A%20%7B%20flex%3A%201%20%7D%2C%0A%20%20map%3A%20%7B%20flex%3A%201%20%7D%2C%0A%20%20button%3A%20%7B%0A%20%20%20%20position%3A%20%22absolute%22%2C%0A%20%20%20%20bottom%3A%2040%2C%0A%20%20%20%20alignSelf%3A%20%22center%22%2C%0A%20%20%20%20padding%3A%2016%2C%0A%20%20%20%20borderRadius%3A%208%2C%0A%20%20%20%20backgroundColor%3A%20%22%232196F3%22%2C%0A%20%20%7D%2C%0A%20%20pressed%3A%20%7B%20backgroundColor%3A%20%22%231565C0%22%20%7D%2C%0A%20%20buttonText%3A%20%7B%20color%3A%20%22white%22%2C%20fontSize%3A%2018%20%7D%2C%0A%7D%29%3B%0A&dependencies=react-native-maps%401.20.1)** (SDK 54, 필요한 패키지 자동 포함)

**🇰🇷 한글 해설**

**완성 코드 해설**: 고정 Polygon(캠퍼스) + 사용자가 탭한 점들(Marker) + 3점 이상이면 사용자 Polygon + Clear 버튼. `e.nativeEvent.coordinate`와 `&&` 조건부 렌더링이 핵심.

### 💻 Location and Maps Checklist

- Ask for location when a feature needs it, not when the app opens, and make it clear why.
- Handle "no": a denied permission and location services turned off both need a message, and the rest of the app should still work.
- Show progress while finding the user. A position can take a few seconds.
- Stop watching when the screen closes or the user pauses. A forgotten watcher drains the battery.
- Let the user recentre after they pan away.
- Keep markers few and meaningful, and hide the map's own places when they compete with yours.
- Check every map prop's platform. Some work only on Apple Maps or only on Google Maps.
- Test on a real phone, on both iOS and Android when you can. The web preview cannot show a map.

**🇰🇷 한글 해설**

**위치와 지도 체크리스트 8개 (서술형 대비)**
1. 위치는 **필요한 기능을 쓸 때** 묻기(앱 열자마자 X), 이유를 분명히.
2. "아니요" 처리: 권한 거절, 위치 서비스 꺼짐 둘 다 메시지, 나머지 앱은 계속 동작.
3. 위치 찾는 동안 진행 표시(몇 초 걸림).
4. 화면 닫히거나 일시정지하면 watch 중지(배터리).
5. 사용자가 지도를 옮긴 뒤 **다시 중심으로** 버튼.
6. 마커는 적고 의미 있게, 경쟁하는 지도 장소는 숨기기.
7. 모든 지도 prop의 **플랫폼 확인**(Apple 전용, Google 전용).
8. 실제 폰에서, 가능하면 iOS와 Android 둘 다 테스트. Web은 지도 불가.


---

## 5. 🧪 Lab: Lab 6 - Location and Maps

> 원문 출처: github.com/nick-romanidis/web530-2267-nsa  lab-6.md

**🇰🇷 들어가기 전에**

Lab 6 **Park It**(주차 위치 기억 앱)은 7주차 예제 4개(Where Am I, Live Location, Your First Map, Drawing on the Map)를 합친 문제예요. 각 파트의 연결 예제와 "내 말로 설명" 주석 포인트를 정리했어요.

### 🧪 A Note on AI

AI assistants are welcome in this course, but use them to get unstuck, not to do the work. Attempt every part yourself first. If you are stuck, paste **your** code and ask why it does not work or what concept you are missing, rather than asking for the answer. Never keep code you could not explain line by line to a classmate. If you cannot explain it, you cannot debug it or build on it, and it is not yours yet. The point of this lab is not the finished Snack. It is being able to ask for someone's location at the right moment, put it on a map, and stop using it when you are done.

**🇰🇷 한글 해설**

AI는 막힐 때만. 목표: 적절한 순간에 위치를 묻고, 지도에 올리고, 다 쓰면 그만 쓰기.

### 🧪 Overview

You build one app, **Park It**, that remembers where you left your car. Each part adds to it. Plan for about 45 minutes.

- Part 1 puts a map behind the starter's info card.
- Parts 2 and 3 save your spot with the GPS and look up its address.
- Part 4 tells you how far away the car is as you walk.
- Part 5 lets you fix the spot by hand and clear it when you are back.

Because every part builds on the one before, do them in order. Your submitted Snack shows the finished app, and it is marked against all five parts.

**🇰🇷 한글 해설**

Part 1 지도, 2 주차 위치 저장, 3 주소, 4 거리, 5 수동 수정과 귀가. 순서대로.

### 🧪 Setup

1. Open the React Native Playground (Snack) at https://snack.expo.dev and sign in.
2. Rename the Snack to `WEB530 Lab 6 - Your Name` (click the name at the top left).
3. Keep Snack on SDK 54 (the default).
4. In the file list on the left, add a new file named `styles.js` in the same folder as `App.js`.
5. Replace the contents of `package.json`, `App.js` and `styles.js` with the three starter files below.
6. Click **Save** so the Snack gets a permanent link.

Starter for `package.json`:

```json
{
  "dependencies": {
    "react-native-paper": "4.9.2",
    "@expo/vector-icons": "^15.0.3",
    "expo-location": "~19.0.8",
    "react-native-maps": "1.20.1"
  }
}
```

Starter for `App.js`:

```jsx
import { View, Text, Pressable } from "react-native";
import styles from "./styles";

// Where the map starts: Newnham Campus.
const START = {
  latitude: 43.79457,
  longitude: -79.35043,
  latitudeDelta: 0.01,
  longitudeDelta: 0.01,
};

// Straight-line distance between two { latitude, longitude } points, in metres.
// You do not need to change this function. Part 4 uses it.
function distanceInMetres(a, b) {
  const R = 6371000;
  const toRad = (deg) => (deg * Math.PI) / 180;
  const dLat = toRad(b.latitude - a.latitude);
  const dLon = toRad(b.longitude - a.longitude);
  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(a.latitude)) *
      Math.cos(toRad(b.latitude)) *
      Math.sin(dLon / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(h));
}

export default function MyApp() {
  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.cardHint}>
          Press Park Here when you leave your car.
        </Text>
        <View style={styles.buttonRow}>
          <Pressable
            style={({ pressed }) => [styles.button, pressed && styles.pressed]}
          >
            <Text style={styles.buttonText}>Park Here</Text>
          </Pressable>
          <Pressable
            style={({ pressed }) => [styles.button, pressed && styles.pressed]}
          >
            <Text style={styles.buttonText}>I'm Back</Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
}
```

▶ 이 코드는 다른 파일(또는 Expo Router의 app 폴더 구조)이 필요해서 Snack 한 파일로는 실행되지 않아요. VS Code 로컬 Expo 프로젝트에서 해당 파일에 붙여 넣어 실행하세요.

Starter for `styles.js`:

```js
import { StyleSheet } from "react-native";

export default StyleSheet.create({
  container: { flex: 1 },
  map: { flex: 1 },
  card: {
    position: "absolute",
    bottom: 40,
    left: 20,
    right: 20,
    padding: 16,
    borderRadius: 8,
    backgroundColor: "white",
  },
  cardTitle: { fontSize: 18, fontWeight: "600" },
  cardText: { fontSize: 14, color: "#666", marginTop: 4 },
  cardHint: { fontSize: 16, color: "#666", textAlign: "center" },
  error: { fontSize: 14, color: "red", marginBottom: 8 },
  buttonRow: { flexDirection: "row", gap: 10, marginTop: 12 },
  button: {
    flex: 1,
    alignItems: "center",
    padding: 12,
    borderRadius: 8,
    backgroundColor: "#2196F3",
  },
  pressed: { backgroundColor: "#1565C0" },
  disabled: { backgroundColor: "#BDBDBD" },
  buttonText: { color: "white", fontSize: 16 },
});
```

▶ **[Snack에서 바로 실행하기](https://snack.expo.dev/?name=WEB530%20W7%20Setup&platform=web&sdkVersion=54.0.0&code=import%20%7B%20StyleSheet%20%7D%20from%20%22react-native%22%3B%0A%0Aexport%20default%20StyleSheet.create%28%7B%0A%20%20container%3A%20%7B%20flex%3A%201%20%7D%2C%0A%20%20map%3A%20%7B%20flex%3A%201%20%7D%2C%0A%20%20card%3A%20%7B%0A%20%20%20%20position%3A%20%22absolute%22%2C%0A%20%20%20%20bottom%3A%2040%2C%0A%20%20%20%20left%3A%2020%2C%0A%20%20%20%20right%3A%2020%2C%0A%20%20%20%20padding%3A%2016%2C%0A%20%20%20%20borderRadius%3A%208%2C%0A%20%20%20%20backgroundColor%3A%20%22white%22%2C%0A%20%20%7D%2C%0A%20%20cardTitle%3A%20%7B%20fontSize%3A%2018%2C%20fontWeight%3A%20%22600%22%20%7D%2C%0A%20%20cardText%3A%20%7B%20fontSize%3A%2014%2C%20color%3A%20%22%23666%22%2C%20marginTop%3A%204%20%7D%2C%0A%20%20cardHint%3A%20%7B%20fontSize%3A%2016%2C%20color%3A%20%22%23666%22%2C%20textAlign%3A%20%22center%22%20%7D%2C%0A%20%20error%3A%20%7B%20fontSize%3A%2014%2C%20color%3A%20%22red%22%2C%20marginBottom%3A%208%20%7D%2C%0A%20%20buttonRow%3A%20%7B%20flexDirection%3A%20%22row%22%2C%20gap%3A%2010%2C%20marginTop%3A%2012%20%7D%2C%0A%20%20button%3A%20%7B%0A%20%20%20%20flex%3A%201%2C%0A%20%20%20%20alignItems%3A%20%22center%22%2C%0A%20%20%20%20padding%3A%2012%2C%0A%20%20%20%20borderRadius%3A%208%2C%0A%20%20%20%20backgroundColor%3A%20%22%232196F3%22%2C%0A%20%20%7D%2C%0A%20%20pressed%3A%20%7B%20backgroundColor%3A%20%22%231565C0%22%20%7D%2C%0A%20%20disabled%3A%20%7B%20backgroundColor%3A%20%22%23BDBDBD%22%20%7D%2C%0A%20%20buttonText%3A%20%7B%20color%3A%20%22white%22%2C%20fontSize%3A%2016%20%7D%2C%0A%7D%29%3B%0A)** (SDK 54, 필요한 패키지 자동 포함)

The card already floats over the bottom of the screen with `position: "absolute"`, as in the week 7 map examples. Every style you need is already in `styles.js`, so you can spend the lab on location and maps.

**🇰🇷 한글 해설**

SDK 54, styles.js 분리, starter 3개 파일. 카드는 이미 `position: "absolute"`로 떠 있어요.

### 🧪 Styling Rules

- Every style is in `styles.js`. There are **no** inline `style={{ ... }}` objects anywhere in `App.js`. A `Pressable` style function that returns an array of styles, like the starter's, is fine.
- You may add styles if you want to, but only in `styles.js`, and with names that describe what they are for.

**🇰🇷 한글 해설**

App.js에 인라인 스타일 금지. Pressable의 style 함수가 배열을 return 하는 건 OK.

### 🧪 Running Your App

- This lab runs on a phone. Choose **My Device** and open the Snack in Expo Go. The **Web** preview cannot show a map: `react-native-maps` has no web version.
- If your phone will not connect, Snack's **Android** tab runs an emulator in the browser. It works for every part, but its location is fixed in Oshawa and never moves, so Part 4 can only show a change when you move the car.
- Expo Go remembers your answer to the permission dialog for Expo Go, not for each Snack. If you allowed location for the week 7 examples, you will not see the dialog again. Part 2 tells you how to test the "no" answer anyway.

**🇰🇷 한글 해설**

폰(My Device)에서. 안 되면 Android 탭(위치가 오샤와로 고정). Expo Go는 권한 답을 앱 단위로 기억.

### 🧪 Submission

- Submit **one** Snack link to the `Lab 6` assessment in Blackboard. After you save, the link looks like `https://snack.expo.dev/@yourname/web530-lab-6-...`.
- The lab is due at the end of class. Submit before you leave.
- Only students who participate in class and hand in a lab slip can receive marks for this lab. If you miss the class, you are still encouraged to complete it as practice.
- Before submitting, save one last time and open your link in a private browser window to confirm it loads without signing in.

**🇰🇷 한글 해설**

수업 끝나기 전 Snack 링크 제출.

### 🧪 Part 1 - The Map (1 point)

Put a map behind the card.

- The map fills the whole screen and starts at `START`.
- The card and its buttons sit on top of the map.
- The map's own places (restaurants, shops, schools) are hidden on **both** iOS and Android, so the only pin on the map will be your car.

Requirements:

- Add a comment above the props that hide the places explaining, in your own words, why it takes two props to do it.

Hint: The map needs a size, or it renders as nothing. Whatever comes later in the JSX draws on top.

**🇰🇷 한글 해설**

**연결**: 7.1 Your First Map Step 1~2 + Campus Markers Step 4.
- `style` flex 1, `initialRegion={START}`, 카드는 JSX에서 지도 **뒤에**(위에 그려짐).
- 주석(내 말로): MapView는 iOS에서 Apple Maps, Android에서 Google Maps를 쓰는데, `showsPointsOfInterest`는 Apple만, `customMapStyle`은 Google만 알아들어서 두 개를 같이 줘야 양쪽에서 숨겨진다.

### 🧪 Part 2 - Park Here (1 point)

Pressing `Park Here` saves where you are standing.

- The app asks for location permission when the user presses `Park Here`, **not** when the app opens. Add a comment above your function explaining, in your own words, why that is the better moment to ask.
- If the user says no, the card shows a message in the `error` style that says what the app needs and what the user can do instead. Suggest long-pressing the map, which you add in Part 5. The map keeps working.
- If the user says yes:
  - The blue dot for the user appears on the map.
  - The app gets the current position and drops a `Marker` there with the title `My car` and the description `Saved at` and the time, for example `Saved at 7:44:50 PM`.
  - The map glides to the car and zooms in, with both deltas at `0.005`.
- While the app is finding you, the button reads `Finding you...`, is disabled, and uses the `disabled` style. It goes back to `Park Here` when it is done, whether it worked or not.
- If getting the position fails, for example because location is turned off on the phone, the card shows `Could not get your location. Is location turned on?`.
- Pressing `Park Here` again moves the car to where you are now. There is only ever one car marker, and an old error message disappears.

Requirements:

- One piece of state, `spot`, holds the car as `{ latitude, longitude, time }`, where `time` is `new Date()`. It starts as `null`.
- Use `try` / `catch` around the position request, and `animateToRegion` on a ref to move the map.
- Test the "no" answer. On Android, choose **Don't allow** the first time the dialog appears. If you already allowed location, temporarily change `"granted"` in your permission check to `"nope"`, so the app acts as though the user said no. Put it back afterwards.

Hint: This is the Your First Map example from the week 7 notes, with the permission request moved into the button. `showsUserLocation` only works on Android once permission has been granted, so it needs its own state.

**🇰🇷 한글 해설**

**연결**: 7.1 Your First Map Step 3~4, 단 권한 요청을 **버튼 안으로** 이동.
- 주석(내 말로): 앱 열자마자 물으면 사용자는 왜 필요한지 모르고 거절하기 쉽다. 주차 버튼을 누른 순간이면 위치가 왜 필요한지 분명해서 허락받기 쉽고, 필요할 때만 쓰게 된다.
- `spot` state `{ latitude, longitude, time: new Date() }` 시작은 null.
- 진행 중 state(`finding`)로 버튼 `Finding you...`, disabled. `finally`에서 원복.
- 파란 점용 권한 state 따로(Android 조건).
- `animateToRegion` delta 0.005.

### 🧪 Part 3 - The Address (1 point)

Coordinates mean nothing to someone looking for their car. Show the address in the card.

- When a spot is saved, the card's first line, in the `cardTitle` style, is the street number, street and city, for example `915 Grandview Street North, Oshawa`. The second line, in the `cardText` style, is `Saved at` and the time.
- While the address is being looked up, the first line reads `Looking up the address...`. It must **never** show the address of the previous spot.
- If the lookup fails, or the place it finds has no street, show the coordinates to five decimal places instead, for example `43.92280, -78.86930`.
- When there is no spot, the card shows the starter's hint, as it does now.

Requirements:

- Look up the address in a `useEffect` with `[spot]` as its dependency array, **not** inside your `Park Here` function. Part 5 changes the spot a second way, and the effect covers both.
- Use a `cancelled` flag, as in the Live Location example, so a lookup that finishes after the spot has moved is ignored. Add a comment above it explaining, in your own words, what would go wrong without it.

Hint: `reverseGeocodeAsync` returns an array, best match first. `streetNumber` can be `null` even when `street` is not.

**🇰🇷 한글 해설**

**연결**: 7.1 Where Am I Step 3 + Live Location의 cancelled 깃발.
- `useEffect(..., [spot])` 안에서 reverse geocode(Part 5의 길게 누르기도 같이 커버).
- 먼저 주소 state를 비워 `Looking up the address...` → 이전 주소 절대 표시 X.
- 실패하거나 street 없으면 `lat.toFixed(5), lng.toFixed(5)`.
- 주석(내 말로): 주소 조회가 끝나기 전에 spot이 또 바뀌면, 늦게 도착한 옛날 주소가 새 spot의 주소를 덮어쓸 수 있다(race condition). cancelled 깃발로 옛날 결과를 무시한다.

### 🧪 Part 4 - How Far Is the Car? (1 point)

While a spot is saved, the card tells you how far away the car is, and keeps telling you as you walk.

- The card's third line reads `Your car is 230 m away.`, with the distance rounded to whole metres. Under 20 metres, it reads `Your car is right here.` instead.
- Until the first position arrives, there is no third line.
- The app only watches your position while a spot is saved. With no spot, it does not watch at all.

Requirements:

- Use `watchPositionAsync` in a `useEffect`, with a clean-up function that removes the subscription and the `cancelled` flag from the Live Location example.
- Keep the latest position from the watch in state. Work out the distance with the starter's `distanceInMetres` above the `return`, on every render. Do **not** store the distance in state.
- Make a boolean, `const parked = spot !== null;`, and use `[parked]` as the dependency array. Add a comment above the effect explaining, in your own words, why `[spot]` would be the wrong choice here.

Walk around the room with your phone and watch the number change. GPS indoors is only accurate to a few metres, so it will not count every step.

**🇰🇷 한글 해설**

**연결**: 7.1 Live Location.
- watch로 받은 최신 위치는 state, **거리는 state 아님**(derived, return 위에서 `distanceInMetres` 계산).
- `const parked = spot !== null;` 의존성 `[parked]`.
- 주석(내 말로): `[spot]`이면 spot을 길게 눌러 옮길 때마다(시간도 바뀌니까) watch를 껐다 켜게 되는데, 필요한 건 "주차 중인지 아닌지"가 바뀔 때만 watch를 시작/중지하는 것이라 boolean `parked`가 맞다.
- 20m 미만이면 `right here`.

### 🧪 Part 5 - Fix the Spot and Go Home (1 point)

The GPS is not always right, and you will not always have it. Let the user fix the spot by hand, and clear it when they are back.

- Long-pressing the map moves the car there. The marker moves, the saved time updates, and the address and distance update to match.
- Long-pressing works even when location permission was denied, so the advice in your Part 2 message is true. Without permission the address may fall back to coordinates, and there is no distance, but the marker still moves.
- Pressing `I'm Back` removes the marker, puts the hint back in the card, and stops watching the position.
- `I'm Back` is disabled, and uses the `disabled` style, whenever no spot is saved.

Requirements:

- Use the map's `onLongPress` prop. The pressed coordinate is in `e.nativeEvent.coordinate`, the same as `onPress` in the Drawing on the Map example.
- If your Parts 3 and 4 effects are right, the address, distance and watch need no new code for this part.

**🇰🇷 한글 해설**

**연결**: 7.1 Drawing on the Map Step 3.
- `onLongPress={(e) => setSpot({ ...e.nativeEvent.coordinate, time: new Date() })}`. 권한 없어도 동작.
- I'm Back: `setSpot(null)` → parked false → watch 정리, 주소 effect도 힌트로.
- Part 3, 4 effect가 제대로면 **새 코드가 거의 필요 없음**. 이게 effect를 state에 의존시키는 설계의 장점이에요.


---

## ✅ Week 7 시험 대비 체크리스트

1. 위치 권한 요청 함수와 확인 값? → `requestForegroundPermissionsAsync()`, `status === "granted"`
2. Foreground vs Background 권한?
3. useEffect 콜백을 async로 못 만드는 이유? → effect는 cleanup만 return, async는 Promise를 return
4. await를 쓸 수 있는 곳? → async 함수 안
5. 위치 한 번 / 계속? → `getCurrentPositionAsync` / `watchPositionAsync`
6. `pos.coords`에 들어 있는 것? → latitude, longitude, accuracy, altitude, speed, heading
7. accuracy의 의미? → 미터 단위 반지름
8. reverseGeocodeAsync 반환형? → 배열(첫 번째가 최선), 필드는 null 가능, Web 불가
9. watch를 정리하는 방법과 이유? → `subscription.remove()` in cleanup, 배터리
10. cancelled 깃발이 필요한 상황? → 권한 대화상자 중 화면이 닫히면 구독 생성 전에 cleanup 실행
11. Pause/Resume 구현? → `[tracking]` 의존 + 첫 줄 early return
12. MapView가 안 보이는 이유? → 크기(flex: 1) 없음 / Web 미리보기
13. iOS와 Android 지도? → Apple Maps / Google Maps
14. initialRegion 4개 값과 delta 의미? → 작을수록 확대, 시작만 설정
15. 코드로 지도 이동? → `useRef` + `ref` + `animateToRegion(region, ms)` (iOS는 ms 무시)
16. showsUserLocation 주의점? → Android는 권한 먼저
17. followsUserLocation? → Apple 전용
18. MapView / Marker import 차이? → default / named `{ Marker }`
19. POI 숨기기? → iOS `showsPointsOfInterest={false}` + Android `customMapStyle`
20. 지도 탭 좌표? → `e.nativeEvent.coordinate`
21. Polygon 최소 점 개수와 rgba 알파?
22. 위치를 묻기 좋은 시점? → 기능을 쓸 때

**손으로 써 보기 과제**: "내 맛집 지도". 지도를 길게 눌러 맛집 핀 추가, 핀을 누르면 하단 카드에 정보, Find Me 버튼, POI 숨기기. 보지 않고 써 본 뒤 비교하세요. (폰의 Expo Go나 iOS/Android 미리보기에서 실행)

```jsx
import { useEffect, useRef, useState } from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import MapView, { Marker } from "react-native-maps";
import * as Location from "expo-location";

const START = { latitude: 43.7955, longitude: -79.3496, latitudeDelta: 0.02, longitudeDelta: 0.02 };
const HIDE_POI = [{ featureType: "poi", stylers: [{ visibility: "off" }] }];

export default function App() {
  const mapRef = useRef(null);
  const [hasPermission, setHasPermission] = useState(false);
  const [spots, setSpots] = useState([]);
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    const ask = async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      setHasPermission(status === "granted");
    };
    ask();
  }, []);

  const findMe = async () => {
    try {
      const pos = await Location.getCurrentPositionAsync({});
      mapRef.current.animateToRegion(
        { ...pos.coords, latitudeDelta: 0.005, longitudeDelta: 0.005 },
        1000
      );
    } catch (e) {
      console.log("Could not get location");
    }
  };

  const addSpot = (e) => {
    const coord = e.nativeEvent.coordinate;
    setSpots((prev) => [...prev, { id: Date.now().toString(), name: `Spot ${prev.length + 1}`, ...coord }]);
  };

  return (
    <View style={styles.container}>
      <MapView
        ref={mapRef}
        style={styles.map}
        initialRegion={START}
        showsUserLocation={hasPermission}
        showsPointsOfInterest={false}
        customMapStyle={HIDE_POI}
        onLongPress={addSpot}
      >
        {spots.map((s) => (
          <Marker
            key={s.id}
            coordinate={{ latitude: s.latitude, longitude: s.longitude }}
            title={s.name}
            onPress={() => setSelected(s)}
          />
        ))}
      </MapView>
      <View style={styles.card}>
        <Text style={styles.cardTitle}>
          {selected ? selected.name : "Long-press the map to add a spot"}
        </Text>
        {selected && (
          <Text>
            {selected.latitude.toFixed(5)}, {selected.longitude.toFixed(5)}
          </Text>
        )}
        <Pressable
          disabled={!hasPermission}
          onPress={findMe}
          style={({ pressed }) => [styles.button, pressed && styles.pressed, !hasPermission && styles.disabled]}
        >
          <Text style={styles.buttonText}>Find Me</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  map: { flex: 1 },
  card: { position: "absolute", left: 20, right: 20, bottom: 40, padding: 16, borderRadius: 12, backgroundColor: "#fff", gap: 8 },
  cardTitle: { fontSize: 18, fontWeight: "bold" },
  button: { backgroundColor: "#1e88e5", padding: 12, borderRadius: 8, alignItems: "center" },
  pressed: { backgroundColor: "#1565c0" },
  disabled: { backgroundColor: "#aaa" },
  buttonText: { color: "#fff", fontWeight: "bold" },
});
```

▶ **[Snack에서 바로 실행하기](https://snack.expo.dev/?name=WEB530%20W7%20practice&platform=ios&sdkVersion=54.0.0&code=import%20%7B%20useEffect%2C%20useRef%2C%20useState%20%7D%20from%20%22react%22%3B%0Aimport%20%7B%20View%2C%20Text%2C%20Pressable%2C%20StyleSheet%20%7D%20from%20%22react-native%22%3B%0Aimport%20MapView%2C%20%7B%20Marker%20%7D%20from%20%22react-native-maps%22%3B%0Aimport%20%2A%20as%20Location%20from%20%22expo-location%22%3B%0A%0Aconst%20START%20%3D%20%7B%20latitude%3A%2043.7955%2C%20longitude%3A%20-79.3496%2C%20latitudeDelta%3A%200.02%2C%20longitudeDelta%3A%200.02%20%7D%3B%0Aconst%20HIDE_POI%20%3D%20%5B%7B%20featureType%3A%20%22poi%22%2C%20stylers%3A%20%5B%7B%20visibility%3A%20%22off%22%20%7D%5D%20%7D%5D%3B%0A%0Aexport%20default%20function%20App%28%29%20%7B%0A%20%20const%20mapRef%20%3D%20useRef%28null%29%3B%0A%20%20const%20%5BhasPermission%2C%20setHasPermission%5D%20%3D%20useState%28false%29%3B%0A%20%20const%20%5Bspots%2C%20setSpots%5D%20%3D%20useState%28%5B%5D%29%3B%0A%20%20const%20%5Bselected%2C%20setSelected%5D%20%3D%20useState%28null%29%3B%0A%0A%20%20useEffect%28%28%29%20%3D%3E%20%7B%0A%20%20%20%20const%20ask%20%3D%20async%20%28%29%20%3D%3E%20%7B%0A%20%20%20%20%20%20const%20%7B%20status%20%7D%20%3D%20await%20Location.requestForegroundPermissionsAsync%28%29%3B%0A%20%20%20%20%20%20setHasPermission%28status%20%3D%3D%3D%20%22granted%22%29%3B%0A%20%20%20%20%7D%3B%0A%20%20%20%20ask%28%29%3B%0A%20%20%7D%2C%20%5B%5D%29%3B%0A%0A%20%20const%20findMe%20%3D%20async%20%28%29%20%3D%3E%20%7B%0A%20%20%20%20try%20%7B%0A%20%20%20%20%20%20const%20pos%20%3D%20await%20Location.getCurrentPositionAsync%28%7B%7D%29%3B%0A%20%20%20%20%20%20mapRef.current.animateToRegion%28%0A%20%20%20%20%20%20%20%20%7B%20...pos.coords%2C%20latitudeDelta%3A%200.005%2C%20longitudeDelta%3A%200.005%20%7D%2C%0A%20%20%20%20%20%20%20%201000%0A%20%20%20%20%20%20%29%3B%0A%20%20%20%20%7D%20catch%20%28e%29%20%7B%0A%20%20%20%20%20%20console.log%28%22Could%20not%20get%20location%22%29%3B%0A%20%20%20%20%7D%0A%20%20%7D%3B%0A%0A%20%20const%20addSpot%20%3D%20%28e%29%20%3D%3E%20%7B%0A%20%20%20%20const%20coord%20%3D%20e.nativeEvent.coordinate%3B%0A%20%20%20%20setSpots%28%28prev%29%20%3D%3E%20%5B...prev%2C%20%7B%20id%3A%20Date.now%28%29.toString%28%29%2C%20name%3A%20%60Spot%20%24%7Bprev.length%20%2B%201%7D%60%2C%20...coord%20%7D%5D%29%3B%0A%20%20%7D%3B%0A%0A%20%20return%20%28%0A%20%20%20%20%3CView%20style%3D%7Bstyles.container%7D%3E%0A%20%20%20%20%20%20%3CMapView%0A%20%20%20%20%20%20%20%20ref%3D%7BmapRef%7D%0A%20%20%20%20%20%20%20%20style%3D%7Bstyles.map%7D%0A%20%20%20%20%20%20%20%20initialRegion%3D%7BSTART%7D%0A%20%20%20%20%20%20%20%20showsUserLocation%3D%7BhasPermission%7D%0A%20%20%20%20%20%20%20%20showsPointsOfInterest%3D%7Bfalse%7D%0A%20%20%20%20%20%20%20%20customMapStyle%3D%7BHIDE_POI%7D%0A%20%20%20%20%20%20%20%20onLongPress%3D%7BaddSpot%7D%0A%20%20%20%20%20%20%3E%0A%20%20%20%20%20%20%20%20%7Bspots.map%28%28s%29%20%3D%3E%20%28%0A%20%20%20%20%20%20%20%20%20%20%3CMarker%0A%20%20%20%20%20%20%20%20%20%20%20%20key%3D%7Bs.id%7D%0A%20%20%20%20%20%20%20%20%20%20%20%20coordinate%3D%7B%7B%20latitude%3A%20s.latitude%2C%20longitude%3A%20s.longitude%20%7D%7D%0A%20%20%20%20%20%20%20%20%20%20%20%20title%3D%7Bs.name%7D%0A%20%20%20%20%20%20%20%20%20%20%20%20onPress%3D%7B%28%29%20%3D%3E%20setSelected%28s%29%7D%0A%20%20%20%20%20%20%20%20%20%20%2F%3E%0A%20%20%20%20%20%20%20%20%29%29%7D%0A%20%20%20%20%20%20%3C%2FMapView%3E%0A%20%20%20%20%20%20%3CView%20style%3D%7Bstyles.card%7D%3E%0A%20%20%20%20%20%20%20%20%3CText%20style%3D%7Bstyles.cardTitle%7D%3E%0A%20%20%20%20%20%20%20%20%20%20%7Bselected%20%3F%20selected.name%20%3A%20%22Long-press%20the%20map%20to%20add%20a%20spot%22%7D%0A%20%20%20%20%20%20%20%20%3C%2FText%3E%0A%20%20%20%20%20%20%20%20%7Bselected%20%26%26%20%28%0A%20%20%20%20%20%20%20%20%20%20%3CText%3E%0A%20%20%20%20%20%20%20%20%20%20%20%20%7Bselected.latitude.toFixed%285%29%7D%2C%20%7Bselected.longitude.toFixed%285%29%7D%0A%20%20%20%20%20%20%20%20%20%20%3C%2FText%3E%0A%20%20%20%20%20%20%20%20%29%7D%0A%20%20%20%20%20%20%20%20%3CPressable%0A%20%20%20%20%20%20%20%20%20%20disabled%3D%7B%21hasPermission%7D%0A%20%20%20%20%20%20%20%20%20%20onPress%3D%7BfindMe%7D%0A%20%20%20%20%20%20%20%20%20%20style%3D%7B%28%7B%20pressed%20%7D%29%20%3D%3E%20%5Bstyles.button%2C%20pressed%20%26%26%20styles.pressed%2C%20%21hasPermission%20%26%26%20styles.disabled%5D%7D%0A%20%20%20%20%20%20%20%20%3E%0A%20%20%20%20%20%20%20%20%20%20%3CText%20style%3D%7Bstyles.buttonText%7D%3EFind%20Me%3C%2FText%3E%0A%20%20%20%20%20%20%20%20%3C%2FPressable%3E%0A%20%20%20%20%20%20%3C%2FView%3E%0A%20%20%20%20%3C%2FView%3E%0A%20%20%29%3B%0A%7D%0A%0Aconst%20styles%20%3D%20StyleSheet.create%28%7B%0A%20%20container%3A%20%7B%20flex%3A%201%20%7D%2C%0A%20%20map%3A%20%7B%20flex%3A%201%20%7D%2C%0A%20%20card%3A%20%7B%20position%3A%20%22absolute%22%2C%20left%3A%2020%2C%20right%3A%2020%2C%20bottom%3A%2040%2C%20padding%3A%2016%2C%20borderRadius%3A%2012%2C%20backgroundColor%3A%20%22%23fff%22%2C%20gap%3A%208%20%7D%2C%0A%20%20cardTitle%3A%20%7B%20fontSize%3A%2018%2C%20fontWeight%3A%20%22bold%22%20%7D%2C%0A%20%20button%3A%20%7B%20backgroundColor%3A%20%22%231e88e5%22%2C%20padding%3A%2012%2C%20borderRadius%3A%208%2C%20alignItems%3A%20%22center%22%20%7D%2C%0A%20%20pressed%3A%20%7B%20backgroundColor%3A%20%22%231565c0%22%20%7D%2C%0A%20%20disabled%3A%20%7B%20backgroundColor%3A%20%22%23aaa%22%20%7D%2C%0A%20%20buttonText%3A%20%7B%20color%3A%20%22%23fff%22%2C%20fontWeight%3A%20%22bold%22%20%7D%2C%0A%7D%29%3B%0A&dependencies=expo-location%40~19.0.8%2Creact-native-maps%401.20.1)** (SDK 54, 필요한 패키지 자동 포함)

**해설**: 권한은 화면이 열릴 때 한 번만 묻고, 그 결과(`hasPermission`)로 파란 점과 버튼 활성화를 정해요. 길게 누른 좌표는 `e.nativeEvent.coordinate`, 추가는 함수형 업데이트. 카드가 JSX에서 지도 뒤에 있어서 지도 위에 떠요.
