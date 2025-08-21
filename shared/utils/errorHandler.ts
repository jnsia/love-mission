import { Alert } from 'react-native'
import { SupabaseErrorHandler, SupabaseErrorInfo } from './supabaseErrorHandler'

export interface ApiError {
  message: string
  code?: string
  details?: any
}

export class ErrorHandler {
  // 에러 표시 (사용자에게 Alert 보여주기)
  static show(error: unknown, context?: string): void {
    const errorInfo = SupabaseErrorHandler.parseError(error)
    const title = context || '오류'
    
    // 로깅 (개발 환경에서 더 상세한 로그)
    this.log(errorInfo, title, error)
    
    // 사용자에게 보여줄지 결정
    if (SupabaseErrorHandler.shouldShowToUser(errorInfo)) {
      Alert.alert(
        title,
        errorInfo.message,
        [{ text: '확인' }]
      )
    }
  }

  // 단순 에러 메시지만 가져오기 (Alert 없이)
  static getErrorMessage(error: unknown): string {
    const errorInfo = SupabaseErrorHandler.parseError(error)
    return errorInfo.message
  }

  // 에러 정보 전체 가져오기
  static getErrorInfo(error: unknown): SupabaseErrorInfo {
    return SupabaseErrorHandler.parseError(error)
  }

  // 에러 로깅
  private static log(errorInfo: SupabaseErrorInfo, context: string, originalError: unknown): void {
    const logLevel = SupabaseErrorHandler.getLogLevel(errorInfo)
    const logMessage = `[${context}] ${errorInfo.message} (Code: ${errorInfo.code})`

    switch (logLevel) {
      case 'error':
        console.error(logMessage, originalError)
        break
      case 'warn':
        console.warn(logMessage, originalError)
        break
      case 'info':
        console.info(logMessage, originalError)
        break
    }

    // 개발 환경에서 추가 정보
    if (__DEV__) {
      console.group(`🔍 Error Details: ${context}`)
      console.log('Error Info:', errorInfo)
      console.log('Original Error:', originalError)
      console.groupEnd()
    }
  }

  // 에러 핸들링과 함께 비동기 함수 실행
  static async withErrorHandling<T>(
    asyncFn: () => Promise<T>,
    context?: string
  ): Promise<T | null> {
    try {
      return await asyncFn()
    } catch (error) {
      this.show(error, context)
      return null
    }
  }

  // 재시도 가능한 에러인지 확인
  static isRetryable(error: unknown): boolean {
    const errorInfo = SupabaseErrorHandler.parseError(error)
    return SupabaseErrorHandler.isRetryable(errorInfo)
  }

  // 에러 타입 확인 헬퍼 메서드들
  static isNetworkError(error: unknown): boolean {
    return SupabaseErrorHandler.parseError(error).isNetworkError
  }

  static isAuthError(error: unknown): boolean {
    return SupabaseErrorHandler.parseError(error).isAuthError
  }

  static isValidationError(error: unknown): boolean {
    return SupabaseErrorHandler.parseError(error).isValidationError
  }

  static isPermissionError(error: unknown): boolean {
    return SupabaseErrorHandler.parseError(error).isPermissionError
  }
}

// 재시도 로직이 포함된 헬퍼
export const withRetry = async <T>(
  asyncFn: () => Promise<T>,
  maxRetries: number = 3,
  context?: string
): Promise<T | null> => {
  let lastError: unknown = null

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await asyncFn()
    } catch (error) {
      lastError = error

      // 재시도 불가능한 에러면 즉시 실패
      if (!ErrorHandler.isRetryable(error)) {
        break
      }

      // 마지막 시도면 더 이상 재시도하지 않음
      if (attempt === maxRetries) {
        break
      }

      // 네트워크 에러면 잠시 대기 후 재시도
      if (ErrorHandler.isNetworkError(error)) {
        await new Promise(resolve => setTimeout(resolve, 1000 * attempt))
      }
    }
  }

  // 최종적으로 실패한 경우 에러 표시
  ErrorHandler.show(lastError, context)
  return null
}