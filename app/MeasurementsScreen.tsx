import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import { globalStyles } from "../src/styles/globalStyles";
import { Ionicons } from "@expo/vector-icons";
import { useRequireAuth } from "../src/hooks/useRequireAuth";
import LoadingIndicator from "../components/LoadingIndicator";
import { useTimeSlots } from "../src/hooks/useTimeSlots";
import CustomModal from "../components/CustomModal";
import { supabase } from "../lib/supabase";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function MeasurementScreen() {
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<number | null>(null);
  const [glucose, setGlucose] = useState("");
  const checkingAuth = useRequireAuth();
  const { timeSlots, loadingTimeSlots } = useTimeSlots();
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
   const resetForm = () => {
    setSelectedTimeSlot(null);
    setGlucose("");
  };

  const handleSave = async () => {
    if (!selectedTimeSlot || !glucose) {
      showModal("Error", "Por favor completa todos los campos", "Cerrar");
      return;
    }
    const user_id = await AsyncStorage.getItem("@glice_track:user_id");
    const date_time = new Date().toISOString();
    try {
      const { error } = await supabase
        .from('measurements')
        .insert([
          {
            user_id: user_id,
            time_slot_id: selectedTimeSlot,
            date_time: date_time,
            measure: parseInt(glucose, 10)
          },
        ])
        .select()
      if (error) throw error;
      showModal(
        "Excelente!",
        `Has guardado tu medición de ${glucose} mg/dL`,
        "Continuar",
        () => {
          resetForm();
          setModalVisible(false);
        },
      );
    } catch (error) {
      console.error("Error al guardar la medición:", error);
      showModal("Error", "No se pudo guardar la medición", "Cerrar");
      return;

    }
  };

  if (checkingAuth || loadingTimeSlots) {
    return <LoadingIndicator />;
  }

  return (
    <View style={globalStyles.container}>
      <Text style={globalStyles.infoText}>
        Ingresa el momento del día y tu nivel de glucosa. La medición se
        guardará automáticamente.
      </Text>

      <View style={globalStyles.pickerWrapper}>
        <Picker
          selectedValue={selectedTimeSlot}
          onValueChange={(itemValue) => setSelectedTimeSlot(itemValue)}
        >
          <Picker.Item label="Momento" value={null} />
          {timeSlots.map((slot) => (
            <Picker.Item
              key={slot.index}
              label={slot.name}
              value={slot.id}
            />
          ))}
        </Picker>
      </View>

      <Text style={globalStyles.label}>Medición (mg/dL):</Text>
      <TextInput
        style={globalStyles.input}
        keyboardType="numeric"
        value={glucose}
        onChangeText={setGlucose}
        placeholder="Ej: 101"
      />

      <View style={globalStyles.buttonContainer}>
        <TouchableOpacity style={globalStyles.button} onPress={handleSave}>
          <Ionicons name="cloud-upload-outline" size={25} color="white" />
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
    </View>
  );
}
