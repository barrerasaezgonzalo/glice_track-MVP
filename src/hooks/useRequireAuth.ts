import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { useCallback, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { TabsScreenNavigationProp } from "../types";

export function useRequireAuth() {
  const [checkingAuth, setCheckingAuth] = useState(true);
  const navigation = useNavigation<TabsScreenNavigationProp>();

  useFocusEffect(
    useCallback(() => {
      let isActive = true;

      const checkUser = async () => {
        const userId = await AsyncStorage.getItem("@glice_track:user_id");
        if (!userId) {
          if (isActive) {
            navigation.replace("Tabs", { screen: "Cuenta" });
          }
        } else {
          if (isActive) {
            setCheckingAuth(false);
          }
        }
      };

      checkUser();

      return () => {
        isActive = false;
      };
    }, [navigation]),
  );

  return checkingAuth;
}
