import { FlatList, Text, View, TouchableOpacity } from "react-native";
import { Picker } from "@react-native-picker/picker";
import { useCallback, useMemo, useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import { globalStyles } from "../src/styles/globalStyles";
import { useRequireAuth } from "../src/hooks/useRequireAuth";
import LoadingIndicator from "../components/LoadingIndicator";
import { useTimeSlots } from "../src/hooks/useTimeSlots";
import { currentMonthYear, formatDateTime, generateMonths, parseMonthYearString } from "../src/utils";
import { supabase } from "../lib/supabase";
import { Measurements } from "../src/types";
import { useFocusEffect } from '@react-navigation/native';
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function ReportScreen() {
    const [allMeasurements, setAllMeasurements] = useState<Measurements[]>([]);
    const [measurements, setMeasurements] = useState<Measurements[]>([]);
    const [loadingMeasurements, setLoadingMeasurements] = useState(true);
    const [showFilters, setShowFilters] = useState(false);
    const [selectedMonthYear, setSelectedMonthYear] = useState(currentMonthYear);
    const [selectedTimeSlot, setSelectedTimeSlot] = useState<string | null>(null);
    const checkingAuth = useRequireAuth();
    const average = measurements.reduce((sum, item) => sum + item.measure, 0) / measurements.length || 0;
    const { timeSlots, loadingTimeSlots } = useTimeSlots();
    const now = new Date();
    const startYear = 2025;
    const startMonth = 0;
    const monthsList = useMemo(() =>
        generateMonths(startYear, startMonth, now.getFullYear(), now.getMonth()),
        [startYear, startMonth, now.getFullYear(), now.getMonth()],
    );

    const handleChange = (value: string | null, type: "month" | "time_slot") => {
        if (type === "month" && value !== null) setSelectedMonthYear(value);
        if (type === "time_slot") setSelectedTimeSlot(value);
    };

    const fetchData = async () => {
        const user_id = await AsyncStorage.getItem("@glice_track:user_id");
        if (!user_id) {
            return;
        }
        const { data, error } = await supabase
            .from('measurements')
            .select(`
          *,
          time_slots (
            name
          )
        `).eq('user_id', user_id)

        if (error) {
            console.error(error);
            return;
        }

        const now = new Date();
        const currentMonth = now.getMonth();
        const currentYear = now.getFullYear();

        const filteredData = data.filter((item) => {
            const itemDate = new Date(item.date_time);
            return (
                itemDate.getMonth() === currentMonth &&
                itemDate.getFullYear() === currentYear
            );
        });

        setMeasurements(filteredData);
        setAllMeasurements(data);
        setLoadingMeasurements(false);
    };

    useFocusEffect(
        useCallback(() => {
            fetchData();
            setSelectedMonthYear(currentMonthYear);
            setSelectedTimeSlot("todos");
        }, [])
    );


    const handleFilterData = () => {
        let filteredData = [...allMeasurements];

        if (selectedMonthYear) {
            const parsed = parseMonthYearString(selectedMonthYear);
            if (parsed) {
                filteredData = filteredData.filter((item) => {
                    const itemDate = new Date(item.date_time);
                    return (
                        itemDate.getFullYear() === parsed.year &&
                        itemDate.getMonth() === parsed.month
                    );
                });
            }
        }

        if (selectedTimeSlot !== "todos") {
            filteredData = filteredData.filter(
                (item) => item.time_slot_id === selectedTimeSlot
            );
        }

        setMeasurements(filteredData);
        setShowFilters(false)
    };

    if (checkingAuth || loadingTimeSlots || loadingMeasurements) {
        return <LoadingIndicator />;
    }

    return (
        <>
            <TouchableOpacity
                style={globalStyles.toggleButton}
                onPress={() => setShowFilters(!showFilters)}
            >
                <Text style={globalStyles.toggleText}>
                    {showFilters ? "Ocultar filtros" : "Mostrar filtros"}
                </Text>
                <Ionicons name="filter" size={20} color="#55bb32" />
            </TouchableOpacity>

            <Text style={globalStyles.textReport}>
                Mediciones {selectedMonthYear}
            </Text>

            {showFilters && (
                <View style={globalStyles.container}>
                    <View style={globalStyles.pickerWrapper}>
                        <Picker
                            selectedValue={selectedMonthYear}
                            onValueChange={(value) => handleChange(value, "month")}
                            style={globalStyles.picker}
                        >
                            {monthsList.map((monthYear) => (
                                <Picker.Item
                                    key={monthYear}
                                    label={monthYear}
                                    value={monthYear}
                                />
                            ))}
                        </Picker>
                    </View>

                    <View style={globalStyles.pickerWrapper}>
                        <Picker
                            selectedValue={selectedTimeSlot}
                            onValueChange={(value) => handleChange(value, "time_slot")}
                        >
                            <Picker.Item label="Todos los momentos" value="todos" />
                            {timeSlots.map((slot) => (
                                <Picker.Item
                                    key={slot.index}
                                    label={slot.name}
                                    value={slot.id}
                                />
                            ))}
                        </Picker>
                    </View>

                    <View style={globalStyles.buttonContainer}>
                        <TouchableOpacity style={globalStyles.button} onPress={handleFilterData}>
                            <Ionicons name="filter-outline" size={25} color="white" />
                            <Text style={globalStyles.buttonText}>Filtrar</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            )}

            <FlatList
                data={measurements}
                keyExtractor={(item) => item.id}
                contentContainerStyle={{ padding: 0 }}
                renderItem={({ item }) => (
                    <View style={globalStyles.card}>
                        <Text style={globalStyles.text}>🗓️ {formatDateTime(item.date_time)}</Text>
                        <Text style={globalStyles.text}>🍽️ {item.time_slots?.name}</Text>
                        <Text style={globalStyles.text}>💉 {item.measure} mg/dL</Text>
                    </View>
                )}                
            />

            <View style={globalStyles.averageContainer}>
                <Text style={globalStyles.averageText}>
                    Promedio: {average.toFixed(1)} mg/dL
                </Text>                
            </View>
        </>
    );
}
