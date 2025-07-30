import React, { useState } from "react";
import {
  View,
  TextInput,
  TouchableOpacity,
  Text,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { globalStyles } from "../src/styles/globalStyles";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import CustomModal from "../components/CustomModal";
import { supabase } from "../lib/supabase";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { RootStackParamList } from "../src/types";

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export default function LoginScreen() {
  const [email, setEmail] = useState("a@a.cl");
  const [password, setPassword] = useState("123");
  const navigation = useNavigation<NavigationProp>();
  const [modalVisible, setModalVisible] = useState(false);
  const [modalTitle, setModalTitle] = useState("");
  const [modalMessage, setModalMessage] = useState("");
  const [modalButtonText, setModalButtonText] = useState("Cerrar");
  const [modalOnPressButton, setModalOnPressButton] = useState<() => void>(
    () => {},
  );
  const [modalOnClose, setModalOnClose] = useState<() => void>(() => {});

  const showModal = (
    title: string,
    message: string,
    buttonText: string,
    onPressButton?: () => void,
  ) => {
    setModalTitle(title);
    setModalMessage(message);
    setModalButtonText(buttonText);
    setModalOnPressButton(() => () => {
      if (onPressButton) onPressButton();
      setModalVisible(false);
    });
    setModalOnClose(() => () => setModalVisible(false));
    setModalVisible(true);
  };

  const handleLogin = async () => {
    if (!email || !password) {
      showModal("Error", "Por favor completa todos los campos", "Cerrar");
      return;
    }
    try {
      const { data: userData, error } = await supabase.rpc(
        "validate_user_password",
        {
          p_email: email.trim(),
          p_password: password,
        },
      );
      if (error) throw error;
      if (!userData || userData.length === 0) {
        throw new Error("Email o contraseña incorrecta, o cuenta inactiva.");
      }
      await AsyncStorage.setItem("@glice_track:user_id", userData[0].id);

      showModal(
        "Bienvenido",
        `Has iniciado sesión como ${email}`,
        "Continuar",
        () => {
          setModalVisible(false);
          navigation.navigate("Tabs", {
            screen: "Mediciones",
          });
        },
      );
    } catch (err: any) {
      showModal("Error", err.message || "Error desconocido", "Cerrar");
    }
  };

  return (
    <View style={globalStyles.container}>
      <Text style={globalStyles.title}>Iniciar Sesión</Text>

      <TextInput
        style={globalStyles.input}
        placeholder="Correo electrónico"
        placeholderTextColor="#aaa"
        autoCapitalize="none"
        keyboardType="email-address"
        value={email}
        onChangeText={setEmail}
      />

      <TextInput
        style={globalStyles.input}
        placeholder="Contraseña"
        placeholderTextColor="#aaa"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />

      <TouchableOpacity style={globalStyles.button} onPress={handleLogin}>
        <Ionicons name="log-in-outline" size={25} color="white" />
        <Text style={globalStyles.buttonText}>Ingresar</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate("Register")}>
        <Text style={globalStyles.registerText}>
          ¿No tienes cuenta? Regístrate!
        </Text>
      </TouchableOpacity>

      <CustomModal
        visible={modalVisible}
        title={modalTitle}
        message={modalMessage}
        buttonText={modalButtonText}
        onClose={modalOnClose}
        onPressButton={modalOnPressButton}
      />
    </View>
  );
}
