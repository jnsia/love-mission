import { QueryClient } from '@tanstack/react-query'
import { ErrorHandler } from '@/shared/utils/errorHandler'

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5분
      gcTime: 1000 * 60 * 30, // 30분
      retry: (failureCount, error) => {
        // 커스텀 에러 핸들러를 사용하여 재시도 결정
        if (!ErrorHandler.isRetryable(error)) {
          return false
        }
        return failureCount < 3
      },
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000), // 지수 백오프
    },
    mutations: {
      retry: (failureCount, error) => {
        // 뮤테이션은 네트워크 에러만 재시도
        if (ErrorHandler.isNetworkError(error) && failureCount < 2) {
          return true
        }
        return false
      },
      retryDelay: 1000, // 1초 대기
    },
  },
})

export const queryKeys = {
  auth: {
    user: () => ['auth', 'user'] as const,
  },
  missions: {
    all: () => ['missions'] as const,
    list: (filters?: any) => ['missions', 'list', filters] as const,
    detail: (id: string) => ['missions', 'detail', id] as const,
    failed: () => ['missions', 'failed'] as const,
  },
  coupons: {
    all: () => ['coupons'] as const,
    list: (type?: string) => ['coupons', 'list', type] as const,
    detail: (id: string) => ['coupons', 'detail', id] as const,
  },
  history: {
    all: () => ['history'] as const,
    missions: () => ['history', 'missions'] as const,
    coins: () => ['history', 'coins'] as const,
  },
} as const