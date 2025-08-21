// Base API 클래스
export { BaseApi, type ApiResponse, type PaginationOptions } from './base.api'

// 각 도메인별 API 인스턴스들
export { userApi } from '@/features/user/api/user.api'
export { authApi } from '@/features/user/api/auth.api'
export { fcmTokenApi } from '@/features/user/api/fcmToken.api'
export { missionApi } from '@/features/mission/api/mission.api'
export { couponApi } from '@/features/coupon/api/coupon.api'

// 타입 정의들
export type {
  CreateUserRequest,
  UpdateUserRequest
} from '@/features/user/api/user.api'

export type {
  SignInRequest,
  SignUpRequest
} from '@/features/user/api/auth.api'

// 통합 API 객체 (선택적으로 사용)
export const api = {
  user: userApi,
  auth: authApi,
  fcmToken: fcmTokenApi,
  mission: missionApi,
  coupon: couponApi,
} as const

// API 응답 타입 가드 함수들
export const isApiSuccess = <T>(response: ApiResponse<T>): response is { data: T; error: null } => {
  return response.error === null && response.data !== null
}

export const isApiError = <T>(response: ApiResponse<T>): response is { data: null; error: string } => {
  return response.error !== null
}

// API 응답 처리 헬퍼 함수
export const handleApiResponse = <T>(
  response: ApiResponse<T>,
  onSuccess?: (data: T) => void,
  onError?: (error: string) => void
) => {
  if (isApiSuccess(response) && onSuccess) {
    onSuccess(response.data)
  } else if (isApiError(response) && onError) {
    onError(response.error)
  }
}

export default api