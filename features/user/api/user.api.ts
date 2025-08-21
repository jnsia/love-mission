import { BaseApi, ApiResponse } from '@/shared/api/base.api'
import { User } from '../types/user.type'
import { getAuthData } from '@/shared/lib/async-storage/auth'
import { supabase } from '@/shared/lib/supabase/supabase'

export interface CreateUserRequest {
  email: string
  password?: string
  name?: string
  coin?: number
}

export interface UpdateUserRequest {
  name?: string
  coin?: number
  secret?: string | null
  loveId?: number | null
  fcmToken?: string
}

class UserApi extends BaseApi {
  constructor() {
    super('users')
  }

  // 현재 인증된 사용자 조회
  async fetchCurrentUser(): Promise<ApiResponse<User>> {
    try {
      const authData = await getAuthData()
      if (!authData?.email) {
        return { data: null, error: 'No authenticated user found' }
      }

      return await this.fetchUserByEmail(authData.email)
    } catch (error) {
      return {
        data: null,
        error: error instanceof Error ? error.message : 'Unknown error'
      }
    }
  }

  // 이메일로 사용자 조회
  async fetchUserByEmail(email: string): Promise<ApiResponse<User>> {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('email', email)
        .single()

      if (error) throw error

      return { data, error: null }
    } catch (error) {
      return {
        data: null,
        error: error instanceof Error ? error.message : 'User not found'
      }
    }
  }

  // ID로 사용자 조회
  async fetchUserById(id: string): Promise<ApiResponse<User>> {
    return this.findById<User>(id)
  }

  // 비밀 코드로 사용자 조회
  async fetchUserBySecret(secret: string): Promise<ApiResponse<User>> {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('secret', secret)
        .single()

      if (error) throw error

      return { data, error: null }
    } catch (error) {
      return {
        data: null,
        error: error instanceof Error ? error.message : 'User not found'
      }
    }
  }

  // 사용자 생성
  async createUser(request: CreateUserRequest): Promise<ApiResponse<User>> {
    return this.create<User, CreateUserRequest>({
      ...request,
      coin: request.coin || 0,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    })
  }

  // 사용자 정보 업데이트
  async updateUser(id: string, data: UpdateUserRequest): Promise<ApiResponse<User>> {
    return this.update<User>(id, {
      ...data,
      updated_at: new Date().toISOString()
    })
  }

  // 비밀 코드 업데이트
  async updateSecret(userId: string, secret: string | null): Promise<ApiResponse<User>> {
    return this.updateUser(userId, { secret })
  }

  // 연인 ID 업데이트
  async updateLoveId(userId: string, loveId: number): Promise<ApiResponse<User>> {
    return this.updateUser(userId, { loveId })
  }

  // 코인 업데이트
  async updateCoin(userId: string, coin: number): Promise<ApiResponse<User>> {
    return this.updateUser(userId, { coin })
  }

  // 코인 증가/감소
  async adjustCoin(userId: string, amount: number): Promise<ApiResponse<User>> {
    try {
      const userResult = await this.fetchUserById(userId)
      if (userResult.error || !userResult.data) {
        return { data: null, error: 'User not found' }
      }

      const newCoin = userResult.data.coin + amount
      return this.updateCoin(userId, Math.max(0, newCoin)) // 코인은 0보다 작을 수 없음
    } catch (error) {
      return {
        data: null,
        error: error instanceof Error ? error.message : 'Unknown error'
      }
    }
  }

  // FCM 토큰 업데이트
  async updateFcmToken(userId: string, fcmToken: string): Promise<ApiResponse<User>> {
    return this.updateUser(userId, { fcmToken })
  }

  // 사용자 삭제
  async deleteUser(id: string): Promise<ApiResponse<void>> {
    return this.delete(id)
  }

  // 연인 관계 설정 (양방향)
  async connectLovers(userId1: string, userId2: string): Promise<ApiResponse<void>> {
    try {
      // 트랜잭션처럼 처리
      const [result1, result2] = await Promise.all([
        this.updateLoveId(userId1, parseInt(userId2)),
        this.updateLoveId(userId2, parseInt(userId1))
      ])

      if (result1.error || result2.error) {
        throw new Error('Failed to connect lovers')
      }

      return { data: null, error: null }
    } catch (error) {
      return {
        data: null,
        error: error instanceof Error ? error.message : 'Unknown error'
      }
    }
  }

  // 연인 관계 해제
  async disconnectLovers(userId1: string, userId2: string): Promise<ApiResponse<void>> {
    try {
      const [result1, result2] = await Promise.all([
        this.updateLoveId(userId1, null),
        this.updateLoveId(userId2, null)
      ])

      if (result1.error || result2.error) {
        throw new Error('Failed to disconnect lovers')
      }

      return { data: null, error: null }
    } catch (error) {
      return {
        data: null,
        error: error instanceof Error ? error.message : 'Unknown error'
      }
    }
  }
}

// 싱글톤 인스턴스 생성 및 export
export const userApi = new UserApi()

// 기존 함수들을 호환성을 위해 유지 (deprecated)
export const fetchCurrentUser = async (): Promise<User | null> => {
  const result = await userApi.fetchCurrentUser()
  return result.data
}

export const fetchUserByEmail = async (email: string): Promise<User | null> => {
  const result = await userApi.fetchUserByEmail(email)
  return result.data
}

export const updateSecret = async (userId: number, secret: string | null) => {
  await userApi.updateSecret(String(userId), secret)
}

export const fetchUserBySecret = async (secret: string): Promise<User | null> => {
  const result = await userApi.fetchUserBySecret(secret)
  return result.data
}

export const updateUserLoveId = async (userId: number, loveId: number): Promise<void> => {
  const result = await userApi.updateLoveId(String(userId), loveId)
  if (result.error) {
    throw new Error(result.error)
  }
}
