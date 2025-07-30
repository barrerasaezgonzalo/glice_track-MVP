import { View, Text, TouchableOpacity } from "react-native";
import React, { useEffect, useState } from "react";
import { globalStyles } from "../src/styles/globalStyles";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { RootStackParamList } from "../src/types";

type AccountScreenNavigationProp = NativeStackNavigationProp<RootStackParamList>;

const AccountScreen = () => {
  const navigation = useNavigation<AccountScreenNavigationProp>();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const checkUser = async () => {
      const userId = await AsyncStorage.getItem("@glice_track:user_id");
      setIsLoggedIn(!!userId);
    };
    checkUser();
  }, []);

  const handleLoginLogout = () => {
    if (isLoggedIn) {
      AsyncStorage.removeItem("@glice_track:user_id").then(() => {
        setIsLoggedIn(false);
        navigation.navigate("Home");
      });
    } else {
      navigation.navigate("Login");
    }
  };

  return (
    <View style={globalStyles.container}>
      <Text style={globalStyles.description}>
        <Text style={globalStyles.bold}>Regístrate </Text>
        <Text style={globalStyles.text}>para comenzar a usar la app o </Text>
        <Text style={globalStyles.bold}>inicia sesión </Text>
        <Text style={globalStyles.text}>si ya tienes una cuenta.</Text>
      </Text>

      <View style={globalStyles.buttonContainer}>
        {isLoggedIn ? (
          <TouchableOpacity
            style={globalStyles.button}
            onPress={() => navigation.navigate("EditAccount")}
          >
            <Ionicons name="cloud-upload-outline" size={25} color="white" />
            <Text style={globalStyles.buttonText}>Tu Cuenta!</Text>
          </TouchableOpacity>
        ) : (<TouchableOpacity
          style={globalStyles.button}
          onPress={() => navigation.navigate("Register")}
        >
          <Ionicons name="cloud-upload-outline" size={25} color="white" />
          <Text style={globalStyles.buttonText}>Regístrate!</Text>
        </TouchableOpacity>)}


        <TouchableOpacity
          style={globalStyles.button}
          onPress={handleLoginLogout}
        >
          <Ionicons
            name={isLoggedIn ? "log-out-outline" : "log-in-outline"}
            size={25}
            color="white"
          />
          <Text style={globalStyles.buttonText}>
            {isLoggedIn ? "Cerrar sesión" : "Inicia sesión!"}
          </Text>
        </TouchableOpacity>
      </View>

      <View style={globalStyles.motivation}>
        <Text style={globalStyles.motivationLine}>CADA DATO IMPORTA</Text>
        <Text style={globalStyles.motivationLine}>CADA DÍA CUENTA</Text>
      </View>
    </View>
  );
};

export default AccountScreen;
