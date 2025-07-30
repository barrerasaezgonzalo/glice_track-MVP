import React, { useCallback, useState } from "react";
import {
    View,
    Text,
    TextInput,
    Linking,
    ScrollView,
    TouchableOpacity,
    KeyboardAvoidingView,
    Platform,
} from "react-native";
import { globalStyles } from "../src/styles/globalStyles";
import { Ionicons } from "@expo/vector-icons";
import CustomModal from "../components/CustomModal";
import { useFocusEffect } from '@react-navigation/native';
import { supabase } from "../lib/supabase";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { RootStackParamList } from "../src/types";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useNavigation } from "@react-navigation/native";

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;


export default function EditAccountScreen() {
    const [name, setName] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [modalVisible, setModalVisible] = useState(false);
    const [modalTitle, setModalTitle] = useState("");
    const [modalMessage, setModalMessage] = useState("");
    const [modalButtonText, setModalButtonText] = useState("Cerrar");
    const [modalOnPressButton, setModalOnPressButton] = useState<() => void>(
        () => { },
    );
    const [modalOnClose, setModalOnClose] = useState<() => void>(() => { });
  const navigation = useNavigation<NavigationProp>();

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
    const handleEditAccount = async () => {
        if (!name || !password) {
            showModal("Error", "Por favor completa todos los campos", "Cerrar");
            return;
        }
        if (password !== confirmPassword) {
            showModal("Error", "Las contraseñas no coinciden", "Cerrar");
            return;
        }
        const user_id = await AsyncStorage.getItem("@glice_track:user_id");
        try {
            const { error } = await supabase
                .from('users')
                .update([
                    {
                        name: name,
                        password: password,
                    }
                ])
                .eq('id', user_id);
            if (error) throw error;
            showModal(
                "Excelente!",
                `Tus datos han sido actualizados correctamente.`,
                "Continuar",
                () => {
                    setModalVisible(false);
                    navigation.navigate("Tabs", {
                        screen: "home",
                    });
                },
            );
        } catch (error) {
            console.error("Error al guardar los datos:", error);
            showModal("Error", "No se pudo guardar la información", "Cerrar");
            return;

        }

    }

    const getUserData = async () => {
        const user_id = await AsyncStorage.getItem("@glice_track:user_id");
        if (!user_id) return;
        let { data: user, error } = await supabase
            .from('users')
            .select('name')
            .eq('id', user_id);
        if (error) throw error;
        if (user && user.length > 0) {
            setName(user[0].name);
        }
    }
    useFocusEffect(
        useCallback(() => {
            getUserData();
        }, [])
    );

    return (
        <KeyboardAvoidingView
            style={{ flex: 1 }}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            keyboardVerticalOffset={100}
        ><ScrollView contentContainerStyle={globalStyles.container}>
                <Text style={globalStyles.title}>Tu Cuenta!</Text>
                <Text style={globalStyles.text}>Actualiza tus datos,{' '}
                    <Text
                        style={globalStyles.link}
                        onPress={() => Linking.openURL('mailto:barrerasaezgonzalo@gmail.com')}
                    >contáctate
                    </Text>
                    {' '}con nosotros si tienes algún problema.
                </Text>
                <TextInput
                    style={globalStyles.input}
                    placeholder="Nombre"
                    value={name}
                    onChangeText={setName}
                />
                <Text style={globalStyles.text}>
                    Si necesitas cambiar tu correo debemos hacerlo
                    vía <Text
                        style={globalStyles.link}
                        onPress={() => Linking.openURL('mailto:barrerasaezgonzalo@gmail.com')}
                    >
                        Email
                    </Text>, para cambiar tu contraseña, tan solo escribe una nueva.
                </Text>
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
                    <TouchableOpacity style={globalStyles.button} onPress={handleEditAccount}>
                        <Ionicons name="save-outline" size={25} color="white" />
                        <Text style={globalStyles.buttonText}>Guardar</Text>
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
