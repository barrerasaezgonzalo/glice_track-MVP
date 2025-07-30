import React from "react";
import { Text } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Ionicons } from "@expo/vector-icons";
import HomeScreen from "../../app/HomeScreen";
import MeasurementsScreen from "../../app/MeasurementsScreen";
import AccountScreen from "../../app/AccountScreen";
import ReportScreen from "../../app/ReportScreen";
import RegisterScreen from "../../screens/RegisterScreen";
import LoginScreen from "../../screens/LoginScreen";
import EditAccountScreen from "../../screens/EditAccountScreen";
// import EditAccountScreen from '../../screens/EditAccountScreen';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

function BottomTabs() {
  return (
    <Tab.Navigator
      initialRouteName="Home"
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          let iconName: keyof typeof Ionicons.glyphMap = "home";

          if (route.name === "Home") iconName = "home";
          else if (route.name === "Mediciones") iconName = "analytics";
          else if (route.name === "Reporte") iconName = "document-text";
          else if (route.name === "Cuenta") iconName = "person";

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        headerStyle: {
          backgroundColor: "#55bb32",
          shadowColor: "transparent",
        },
        headerTitleAlign: "center",
        headerLeft: () => {
          let iconName: React.ComponentProps<typeof Ionicons>["name"] = "water";
          if (route.name === "Mediciones") iconName = "rocket-outline";
          else if (route.name === "Reporte") iconName = "calendar";
          else if (route.name === "Cuenta") iconName = "person-outline";

          return (
            <Ionicons
              name={iconName}
              size={28}
              color="white"
              style={{ marginLeft: 15 }}
            />
          );
        },
        headerTitle: () => {
          let title = "Glice Track";
          if (route.name === "Mediciones") title = "A Medir !";
          else if (route.name === "Reporte") title = "Mis Registros";
          else if (route.name === "Cuenta") title = "Tu Cuenta";

          return (
            <Text style={{ color: "white", fontWeight: "bold", fontSize: 20 }}>
              {title}
            </Text>
          );
        },
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Mediciones" component={MeasurementsScreen} />
      <Tab.Screen name="Reporte" component={ReportScreen} />
      <Tab.Screen name="Cuenta" component={AccountScreen} />
    </Tab.Navigator>
  );
}

export default function RootNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Tabs" component={BottomTabs} />
        {/* Pantallas fuera de tabs */}
        <Stack.Screen
          name="Register"
          component={RegisterScreen}
          options={{
            headerShown: true,
            headerStyle: { backgroundColor: "#55bb32" },
            headerTintColor: "white",
            headerTitle: () => {
              let title = "Registrate!";
              return (
                <Text
                  style={{ color: "white", fontWeight: "bold", fontSize: 20 }}
                >
                  {title}
                </Text>
              );
            },
          }}
        />
        <Stack.Screen
          name="Login"
          component={LoginScreen}
          options={{
            headerShown: true,
            headerStyle: { backgroundColor: "#55bb32" },
            headerTintColor: "white",
            headerTitle: () => {
              let title = "Iniciar Sesión";
              return (
                <Text
                  style={{ color: "white", fontWeight: "bold", fontSize: 20 }}
                >
                  {title}
                </Text>
              );
            },
          }}
        />

        <Stack.Screen
          name="EditAccount"
          component={EditAccountScreen}
          options={{
            headerShown: true,
            headerTitle: 'Editar Cuenta',
            headerStyle: { backgroundColor: '#55bb32' },
            headerTintColor: 'white',
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
