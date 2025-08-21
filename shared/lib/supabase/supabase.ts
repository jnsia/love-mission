import "react-native-url-polyfill/auto";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { createClient } from "@supabase/supabase-js";

export const supabase = createClient(
  process.env.EXPO_PUBLIC_SUPABASE_URL || "",
  process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || "",
  {
    auth: {
      storage: AsyncStorage,
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: false,
    },
    global: {
      headers: {
        'X-Client-Info': 'love-mission-app',
      },
    },
    // 네트워크 타임아웃 설정
    db: {
      schema: 'public',
    },
    realtime: {
      params: {
        eventsPerSecond: 10,
      },
    },
  }
);

// 전역 에러 리스너 추가 (선택적)
supabase.auth.onAuthStateChange((event, session) => {
  if (event === 'SIGNED_OUT') {
    // 로그아웃 시 처리할 로직
    console.info('🔐 User signed out')
  } else if (event === 'SIGNED_IN') {
    console.info('🔓 User signed in')
  } else if (event === 'TOKEN_REFRESHED') {
    console.info('🔄 Token refreshed')
  }
})

