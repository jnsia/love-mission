import { user } from "@/types/user";
import { supabase } from "@/utils/supabase";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import { create } from "zustand";

const useAuthStore = create((set) => ({
  // Sample Code
  // count: 0
  // set((state: any) => ({count: state.count + 1}))

  isLoggedIn: false,
  user: null,

  getRecentUserInfo: async (userId: any) => {
    const { data, error } = await supabase
      .from("users")
      .select()
      .eq("id", userId);

    if (error) {
      console.error("Error fetching user:", error.message);
      return;
    }

    const user: user = data[0];
    set({ user: user });
  },

  getPIN: async (state: any) => {
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

        const user: user = data[0];

        set({ isLoggedIn: true });
        set({ user: user });
      } catch (error: any) {
        console.error("Error fetching user:", error.message);
      }
    } else {
      // PIN이 유효하지 않은 경우
      set({ user: null });
    }
  },

  logout: async (state: any) => {
    set({ isLoggedIn: null });
    await AsyncStorage.removeItem("JNoteS_PIN");
    router.replace("/(auth)");
  },
}));

export default useAuthStore;
