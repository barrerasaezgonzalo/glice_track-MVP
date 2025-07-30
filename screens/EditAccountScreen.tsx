import React from "react";
import {
    View,
    Text,
    TextInput,
    Linking,
    ScrollView,
    TouchableOpacity,
} from "react-native";
import { globalStyles } from "../src/styles/globalStyles";
import { Ionicons } from "@expo/vector-icons";

export default function EditAccountScreen() {
    return (
        <ScrollView contentContainerStyle={globalStyles.container}>
            <Text style={globalStyles.title}>Tu Cuenta!</Text>
            <Text style={globalStyles.text}>Actualiza tus datos de cuenta,{' '}
                <Text
                    style={globalStyles.link}
                    onPress={() => Linking.openURL('mailto:barrerasaezgonzalo@gmail.com')}
                >
                    contáctate
                </Text>
                {' '}con nosotros si tienes algún problema.
            </Text>
            <TextInput style={globalStyles.input} placeholder="Nombre" />
            <Text style={globalStyles.text}>
                Si necesitas cambiar tu correo debemos hacerlo
                vía <Text
                    style={globalStyles.link}
                    onPress={() => Linking.openURL('mailto:barrerasaezgonzalo@gmail.com')}
                >
                    Email
                </Text>
            </Text>
            <TextInput
                style={globalStyles.input}
                placeholder="Contraseña"
                secureTextEntry
            />
            <TextInput
                style={globalStyles.input}
                placeholder="Repetir contraseña"
                secureTextEntry
            />

            <View style={globalStyles.buttonContainer}>
                <TouchableOpacity style={globalStyles.button} onPress={() => { }}>
                    <Ionicons name="save-outline" size={25} color="white" />
                    <Text style={globalStyles.buttonText}>Guardar</Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
    );
}
