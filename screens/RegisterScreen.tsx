import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  ScrollView,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { globalStyles } from "../src/styles/globalStyles";
import { Ionicons } from "@expo/vector-icons";
import { supabase } from "../lib/supabase";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../src/types";
import CustomModal from "../components/CustomModal";

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export default function RegisterScreen() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const navigation = useNavigation<NavigationProp>();
  const [modalVisible, setModalVisible] = useState(false);
  const [modalTitle, setModalTitle] = useState("");
  const [modalMessage, setModalMessage] = useState("");
  const [modalButtonText, setModalButtonText] = useState("Cerrar");
  const [modalOnPressButton, setModalOnPressButton] = useState<() => void>(
    () => { },
  );
  const [modalOnClose, setModalOnClose] = useState<() => void>(() => { });

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
  const handleRegister = async () => {
    if (!name || !email || !password) {
      showModal("Error", "Por favor completa todos los campos", "Cerrar");
      return;
    }
    if (password !== confirmPassword) {
      showModal("Error", "Las contraseñas no coinciden", "Cerrar");
      return;
    }
    try {
      const { error } = await supabase
        .from('users')
        .insert([
          {
            name: name.trim(),
            email: email.trim(),
            password: password.trim(),
          },
        ])
        .select()
      if (error) throw error;

      showModal(
        "Bienvenido",
        `Te has registrado como ${email}`,
        "Inicia sesión",
        () => {
          setModalVisible(false);
          navigation.navigate("Tabs", {
            screen: "Login",
          });
        },
      );
    } catch (err: any) {      
      if (err.code === '23505') {
        showModal("Error", "Este email ya se encuentra registrado", "Cerrar");
        return;
      } else {
        showModal("Error", err.message || "Error desconocido", "Cerrar");
      }
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={100}
    >
      <ScrollView contentContainerStyle={globalStyles.container}>
        <Text style={globalStyles.title}>¡Bienvenido!</Text>
        <Text style={globalStyles.text}>
          Únete y comienza a registrar tus datos de salud de forma simple, rápida
          y segura.
        </Text>

        <TextInput
          style={globalStyles.input}
          placeholder="Nombre"
          value={name}
          onChangeText={setName}
        />
        <TextInput
          style={globalStyles.input}
          placeholder="Email"
          keyboardType="email-address"
          value={email}
          autoCapitalize="none"
          onChangeText={setEmail}
        />
        <TextInput
          style={globalStyles.input}
          placeholder="Contraseña"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />
        <TextInput
          style={globalStyles.input}
          placeholder="Repetir contraseña"
          secureTextEntry
          value={confirmPassword}
          onChangeText={setConfirmPassword}
        />

        <View style={globalStyles.buttonContainer}>
          <TouchableOpacity style={globalStyles.button} onPress={handleRegister}>
            <Ionicons name="log-in-outline" size={25} color="white" />
            <Text style={globalStyles.buttonText}>Regístrate</Text>
          </TouchableOpacity>
        </View>

        <CustomModal
          visible={modalVisible}
          title={modalTitle}
          message={modalMessage}
          buttonText={modalButtonText}
          onClose={modalOnClose}
          onPressButton={modalOnPressButton}
        />
      </ScrollView></KeyboardAvoidingView>
  );
}
