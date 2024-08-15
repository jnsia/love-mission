import { supabase } from "@/utils/supabase";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import { create } from "zustand";

const useAuthStore = create((set) => ({
  count: 0,
  user: null,

  getPIN: async (state: any) => {
    set((state: any) => ({count: state.count + 1}))
    const PIN = await AsyncStorage.getItem("JNoteS_PIN");

    if (PIN === "980309" || PIN === "950718") {
      try {
        const { data, error } = await supabase
          .from("users")
          .select()
          .eq("pin", PIN);

        if (error) {
          console.error("Error fetching user:", error.message);
          return;
        }

        set({ user: data[0] });
      } catch (error: any) {
        console.error("Error fetching user:", error.message);
      }
    } else {
      // PIN이 유효하지 않은 경우
      set({ user: null });
    }
  },

  logout: async (state: any) => {
    set({ user: null });
    await AsyncStorage.removeItem("JNoteS_PIN");
    router.replace("/(auth)")
  },
}));

export default useAuthStore;
