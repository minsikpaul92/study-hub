import type { NavigatorScreenParams } from "@react-navigation/native";

// 각 화면이 받는 params 의 타입. undefined 는 "params 없음"
export type SpotsStackParamList = {
  SpotList: undefined;
  SpotDetail: { id: string; name: string };
  Reviews: { id: string; name: string };
};

export type TabParamList = {
  SpotsTab: NavigatorScreenParams<SpotsStackParamList>;
  Map: { focusId?: string; at?: number } | undefined;
  Saved: undefined;
  About: undefined;
};
