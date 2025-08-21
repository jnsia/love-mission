import { PostgrestError } from '@supabase/supabase-js'
import { MESSAGES } from '@/shared/constants/Config'

export interface SupabaseErrorInfo {
  message: string
  code: string
  statusCode?: number
  isNetworkError: boolean
  isAuthError: boolean
  isValidationError: boolean
  isPermissionError: boolean
}

export class SupabaseErrorHandler {
  // Supabase 에러를 분석하고 사용자 친화적인 메시지로 변환
  static parseError(error: unknown): SupabaseErrorInfo {
    // 네트워크 에러
    if (error instanceof TypeError && error.message.includes('fetch')) {
      return {
        message: MESSAGES.ERROR.NETWORK,
        code: 'NETWORK_ERROR',
        isNetworkError: true,
        isAuthError: false,
        isValidationError: false,
        isPermissionError: false,
      }
    }

    // Supabase PostgrestError
    if (this.isPostgrestError(error)) {
      return this.handlePostgrestError(error)
    }

    // Auth 에러
    if (this.isAuthError(error)) {
      return this.handleAuthError(error)
    }

    // 일반 에러
    if (error instanceof Error) {
      return {
        message: error.message,
        code: 'UNKNOWN_ERROR',
        isNetworkError: false,
        isAuthError: false,
        isValidationError: false,
        isPermissionError: false,
      }
    }

    // 기타 에러
    return {
      message: MESSAGES.ERROR.UNKNOWN,
      code: 'UNKNOWN_ERROR',
      isNetworkError: false,
      isAuthError: false,
      isValidationError: false,
      isPermissionError: false,
    }
  }

  private static isPostgrestError(error: any): error is PostgrestError {
    return error && typeof error === 'object' && 'code' in error && 'details' in error
  }

  private static isAuthError(error: any): boolean {
    return error && typeof error === 'object' && 
           (error.status === 401 || error.status === 403 || 
            error.message?.includes('auth') || error.message?.includes('unauthorized'))
  }

  private static handlePostgrestError(error: PostgrestError): SupabaseErrorInfo {
    const code = error.code || 'UNKNOWN_ERROR'
    let message = error.message
    let isValidationError = false
    let isPermissionError = false
    let isAuthError = false

    switch (code) {
      // 인증 관련 에러
      case '42501': // insufficient_privilege
        message = MESSAGES.ERROR.FORBIDDEN
        isAuthError = true
        isPermissionError = true
        break

      // 데이터 검증 에러
      case '23505': // unique_violation
        message = '이미 존재하는 데이터입니다.'
        isValidationError = true
        break

      case '23503': // foreign_key_violation
        message = '참조하는 데이터가 존재하지 않습니다.'
        isValidationError = true
        break

      case '23502': // not_null_violation
        message = '필수 정보가 누락되었습니다.'
        isValidationError = true
        break

      case '23514': // check_violation
        message = '데이터 형식이 올바르지 않습니다.'
        isValidationError = true
        break

      // 데이터 없음
      case 'PGRST116': // No rows found
        message = MESSAGES.ERROR.NOT_FOUND
        break

      // Row Level Security 위반
      case '42501':
      case 'PGRST301':
        message = MESSAGES.ERROR.FORBIDDEN
        isPermissionError = true
        break

      // 연결 에러
      case 'ECONNREFUSED':
      case 'ENOTFOUND':
      case 'ETIMEDOUT':
        message = MESSAGES.ERROR.NETWORK
        break

      default:
        // 상세 메시지가 있으면 사용, 없으면 기본 메시지
        if (error.details) {
          message = `${message} (${error.details})`
        }
    }

    return {
      message,
      code,
      statusCode: this.extractStatusCode(error),
      isNetworkError: this.isNetworkCode(code),
      isAuthError,
      isValidationError,
      isPermissionError,
    }
  }

  private static handleAuthError(error: any): SupabaseErrorInfo {
    let message = MESSAGES.ERROR.UNAUTHORIZED
    let code = 'AUTH_ERROR'

    if (error.status === 401) {
      message = MESSAGES.ERROR.UNAUTHORIZED
      code = 'UNAUTHORIZED'
    } else if (error.status === 403) {
      message = MESSAGES.ERROR.FORBIDDEN  
      code = 'FORBIDDEN'
    } else if (error.message?.includes('email')) {
      message = '이메일이 올바르지 않습니다.'
      code = 'INVALID_EMAIL'
    } else if (error.message?.includes('password')) {
      message = '비밀번호가 올바르지 않습니다.'
      code = 'INVALID_PASSWORD'
    }

    return {
      message,
      code,
      statusCode: error.status,
      isNetworkError: false,
      isAuthError: true,
      isValidationError: false,
      isPermissionError: error.status === 403,
    }
  }

  private static extractStatusCode(error: any): number | undefined {
    return error.status || error.statusCode || undefined
  }

  private static isNetworkCode(code: string): boolean {
    return ['ECONNREFUSED', 'ENOTFOUND', 'ETIMEDOUT', 'NETWORK_ERROR'].includes(code)
  }

  // 에러 타입에 따른 재시도 가능 여부
  static isRetryable(errorInfo: SupabaseErrorInfo): boolean {
    // 네트워크 에러는 재시도 가능
    if (errorInfo.isNetworkError) return true
    
    // 일부 서버 에러는 재시도 가능
    if (errorInfo.statusCode && errorInfo.statusCode >= 500) return true
    
    // 인증, 권한, 검증 에러는 재시도 불가
    if (errorInfo.isAuthError || errorInfo.isPermissionError || errorInfo.isValidationError) {
      return false
    }

    return false
  }

  // 사용자에게 보여줄 메시지인지 확인
  static shouldShowToUser(errorInfo: SupabaseErrorInfo): boolean {
    // 개발 환경에서는 모든 에러 표시
    if (__DEV__) return true

    // 네트워크 에러는 항상 표시
    if (errorInfo.isNetworkError) return true

    // 검증 에러는 표시
    if (errorInfo.isValidationError) return true

    // 권한 에러는 표시
    if (errorInfo.isPermissionError) return true

    // 기타 시스템 에러는 숨김
    return false
  }

  // 로깅 레벨 결정
  static getLogLevel(errorInfo: SupabaseErrorInfo): 'error' | 'warn' | 'info' {
    if (errorInfo.isNetworkError) return 'warn'
    if (errorInfo.isValidationError) return 'info'
    if (errorInfo.isAuthError || errorInfo.isPermissionError) return 'warn'
    return 'error'
  }
}