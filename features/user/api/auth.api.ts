import {
  clearAuthData,
  getAuthData,
  setAuthData,
} from '@/shared/lib/async-storage/auth'
import { supabase } from '@/shared/lib/supabase/supabase'
import { fcmTokenApi } from './fcmToken.api'
import { userApi } from './user.api'
import { registerForPushNotificationsAsync } from '@/shared/lib/pushNotification'
import { ApiResponse } from '@/shared/api/base.api'
import { User } from '../types/user.type'

export interface SignInRequest {
  email: string
  password: string
}

export interface SignUpRequest {
  email: string
  password: string
  name?: string
}

class AuthApi {
  // 로그인
  async signIn(request: SignInRequest): Promise<ApiResponse<User>> {
    try {
      const { email, password } = request

      // Supabase 인증
      const { error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (authError) {
        throw new Error(authError.message)
      }

      // 사용자 정보 조회
      const userResult = await userApi.fetchUserByEmail(email)
      if (userResult.error || !userResult.data) {
        throw new Error('사용자 정보를 찾을 수 없습니다.')
      }

      // 로컬 인증 데이터 저장
      await setAuthData(email)

      // FCM 토큰 등록
      const token = await registerForPushNotificationsAsync()
      if (token) {
        await fcmTokenApi.upsertFcmToken(userResult.data.id, token)
        userResult.data.fcmToken = token
      }

      return { data: userResult.data, error: null }
    } catch (error) {
      return {
        data: null,
        error: error instanceof Error ? error.message : 'Login failed'
      }
    }
  }

  // 회원가입
  async signUp(request: SignUpRequest): Promise<ApiResponse<User>> {
    try {
      const { email, password, name } = request

      // Supabase 인증 회원가입
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
      })

      if (authError) {
        throw new Error(authError.message)
      }

      if (!authData.user) {
        throw new Error('회원가입에 실패했습니다.')
      }

      // 사용자 데이터 생성
      const userResult = await userApi.createUser({
        email,
        name: name || email.split('@')[0], // 기본 이름은 이메일 앞부분
        coin: 0
      })

      if (userResult.error || !userResult.data) {
        throw new Error('사용자 데이터 생성에 실패했습니다.')
      }

      return { data: userResult.data, error: null }
    } catch (error) {
      return {
        data: null,
        error: error instanceof Error ? error.message : 'Sign up failed'
      }
    }
  }

  // 로그아웃
  async logout(): Promise<ApiResponse<void>> {
    try {
      const authData = await getAuthData()
      if (authData?.email) {
        await fcmTokenApi.clearFcmToken(authData.email)
      }

      // Supabase 로그아웃
      await supabase.auth.signOut()

      // 로컬 인증 데이터 클리어
      await clearAuthData()

      return { data: null, error: null }
    } catch (error) {
      return {
        data: null,
        error: error instanceof Error ? error.message : 'Logout failed'
      }
    }
  }

  // 현재 인증 상태 확인
  async getCurrentSession(): Promise<ApiResponse<any>> {
    try {
      const { data: session, error } = await supabase.auth.getSession()
      
      if (error) throw error

      return { data: session, error: null }
    } catch (error) {
      return {
        data: null,
        error: error instanceof Error ? error.message : 'Session check failed'
      }
    }
  }

  // 패스워드 리셋
  async resetPassword(email: string): Promise<ApiResponse<void>> {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email)
      
      if (error) throw error

      return { data: null, error: null }
    } catch (error) {
      return {
        data: null,
        error: error instanceof Error ? error.message : 'Password reset failed'
      }
    }
  }

  // 패스워드 업데이트
  async updatePassword(newPassword: string): Promise<ApiResponse<void>> {
    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword
      })
      
      if (error) throw error

      return { data: null, error: null }
    } catch (error) {
      return {
        data: null,
        error: error instanceof Error ? error.message : 'Password update failed'
      }
    }
  }
}

// 싱글톤 인스턴스 생성 및 export
export const authApi = new AuthApi()

// 기존 함수들을 호환성을 위해 유지 (deprecated)
export const signIn = async (email: string, password: string) => {
  const result = await authApi.signIn({ email, password })
  return result.data
}

export const logout = async () => {
  await authApi.logout()
}
