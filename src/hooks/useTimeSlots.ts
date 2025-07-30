import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";
import { TimeSlot } from "../types";

export function useTimeSlots() {
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([]);
  const [loadingTimeSlots, setLoadingTimeSlots] = useState(true);

  useEffect(() => {
    const getTimeSlots = async () => {
      try {
        const { data, error } = await supabase
          .from("time_slots")
          .select("*")
          .order("index", { ascending: true });

        if (error) {
          console.error("Supabase error:", error.message);
          return;
        }

        if (data && data.length > 0) {
          setTimeSlots(data);
        } else {
          console.log("No se encontraron time slots.");
        }
      } catch (err) {
        console.error("Unexpected error fetching time slots:", err);
      } finally {
        setLoadingTimeSlots(false);
      }
    };

    getTimeSlots();
  }, []);

  return { timeSlots, loadingTimeSlots };
}
