import { View, Text, Platform } from "react-native";
import { common } from "../styles/common";

export default function AboutScreen() {
  return (
    <View style={common.center}>
      <Text style={common.title}>Campus Spots</Text>
      <Text style={common.subtle}>WEB530 toy project</Text>
      <Text style={common.subtle}>Made by: Paul</Text>
      <Text style={common.subtle}>Running on {Platform.OS}</Text>
    </View>
  );
}
