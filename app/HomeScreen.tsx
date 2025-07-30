import { View, Text } from "react-native";
import { globalStyles } from "../src/styles/globalStyles";

export default function HomeScreen() {
  return (
    <View style={globalStyles.container}>
      <Text style={globalStyles.title}>
        Tu salud, más cerca de ti. Te explicamos cómo:
      </Text>
      <Text style={globalStyles.text}>
        Primero, ve a <Text style={globalStyles.bold}>"Cuenta"</Text> para
        registrarte o iniciar sesión con tu correo y clave.
      </Text>
      <Text style={globalStyles.text}>
        Cuando estés listo, en{" "}
        <Text style={globalStyles.bold}>"Mediciones"</Text> podrás ingresar tus
        niveles de glucosa durante todo el día.
      </Text>
      <Text style={globalStyles.text}>
        Cuando tengas registros, podrás consultar tus reportes en{" "}
        <Text style={globalStyles.bold}>"Reporte"</Text>.
      </Text>
    </View>
  );
}
