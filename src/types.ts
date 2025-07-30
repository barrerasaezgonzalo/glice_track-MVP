import { NativeStackNavigationProp } from "@react-navigation/native-stack";

export type TimeSlot = {
  index: string;
  name: string;
  id: string;
};

export type RootStackParamList = {
  Tabs: { screen: string } | undefined;
  Register: undefined;
  Login: undefined;
  Home: undefined;
  EditAccount: undefined;
};

export type TabsScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  "Tabs"
>;

export type Measurements = {
  id: string;
  user_id: string;
  time_slot_id: string;
  date_time: string;
  measure: number;
  time_slots: TimeSlot | null;
}

export type CustomModalProps = {
  visible: boolean;
  title: string;
  message: string;
  buttonText: string;
  onClose: () => void;
  onPressButton: () => void;
};