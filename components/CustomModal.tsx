import React from "react";
import { Modal, View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { CustomModalProps } from "../src/types";
import { globalStyles } from "../src/styles/globalStyles";

export default function CustomModal({
  visible,
  title,
  message,
  buttonText,
  onClose,
  onPressButton,
}: CustomModalProps) {
  return (
    <Modal
      transparent
      visible={visible}
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={globalStyles.overlay}>
        <View style={globalStyles.modalContainer}>
          <TouchableOpacity style={globalStyles.closeButton} onPress={onClose}>
            <Ionicons name="close" size={24} color="#333" />
          </TouchableOpacity>

          <Text style={globalStyles.title}>{title}</Text>
          <Text style={globalStyles.message}>{message}</Text>

          <TouchableOpacity style={globalStyles.modalButton} onPress={onPressButton}>
            <Text style={globalStyles.modalButtonText}>{buttonText}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}
