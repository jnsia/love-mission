import { ApiResponse } from '@/shared/api/base.api'
import { supabase } from '@/shared/lib/supabase/supabase'

class FcmTokenApi {
  // FCM 토큰 등록/업데이트
  async upsertFcmToken(userId: string | number, token: string): Promise<ApiResponse<void>> {
    try {
      const { error } = await supabase
        .from('users')
        .update({ fcmToken: token })
        .eq('id', userId)

      if (error) throw error

      return { data: null, error: null }
    } catch (error) {
      return {
        data: null,
        error: error instanceof Error ? error.message : 'FCM token update failed'
      }
    }
  }

  // FCM 토큰 조회
  async getFcmToken(userId: string | number): Promise<ApiResponse<string>> {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('fcmToken')
        .eq('id', userId)
        .single()

      if (error) throw error

      return { data: data?.fcmToken || null, error: null }
    } catch (error) {
      return {
        data: null,
        error: error instanceof Error ? error.message : 'FCM token fetch failed'
      }
    }
  }

  // FCM 토큰 삭제 (이메일 기준)
  async clearFcmToken(email: string): Promise<ApiResponse<void>> {
    try {
      const { error } = await supabase
        .from('users')
        .update({ fcmToken: null })
        .eq('email', email)

      if (error) throw error

      return { data: null, error: null }
    } catch (error) {
      return {
        data: null,
        error: error instanceof Error ? error.message : 'FCM token clear failed'
      }
    }
  }

  // FCM 토큰 삭제 (사용자 ID 기준)
  async clearFcmTokenById(userId: string | number): Promise<ApiResponse<void>> {
    try {
      const { error } = await supabase
        .from('users')
        .update({ fcmToken: null })
        .eq('id', userId)

      if (error) throw error

      return { data: null, error: null }
    } catch (error) {
      return {
        data: null,
        error: error instanceof Error ? error.message : 'FCM token clear failed'
      }
    }
  }

  // 특정 FCM 토큰을 가진 사용자들 조회
  async getUsersByFcmToken(token: string): Promise<ApiResponse<any[]>> {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('id, email, name')
        .eq('fcmToken', token)

      if (error) throw error

      return { data: data || [], error: null }
    } catch (error) {
      return {
        data: null,
        error: error instanceof Error ? error.message : 'Users fetch failed'
      }
    }
  }
}

// 싱글톤 인스턴스 생성 및 export
export const fcmTokenApi = new FcmTokenApi()

// 기존 함수들을 호환성을 위해 유지 (deprecated)
export const upsertFcmToken = async (userId: number, token: string) => {
  await fcmTokenApi.upsertFcmToken(userId, token)
}

export const getFcmToken = async (userId: number): Promise<string | null> => {
  const result = await fcmTokenApi.getFcmToken(userId)
  return result.data
}

export const clearFcmToken = async (email: string) => {
  await fcmTokenApi.clearFcmToken(email)
}
