import React from 'react'
import { render, RenderOptions } from '@testing-library/react-native'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { User } from '@/features/user/types/user.type'
import { queryKeys } from '@/shared/lib/react-query/queryClient'

// 목 데이터
export const mockUser: User = {
  id: 'test-user-id',
  email: 'test@example.com',
  coin: 1000,
  created_at: '2024-01-01T00:00:00Z',
  updated_at: '2024-01-01T00:00:00Z',
}

// 테스트용 Query Client 생성
const createTestQueryClient = () => new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
      gcTime: Infinity,
    },
    mutations: {
      retry: false,
    },
  },
})

// 테스트 래퍼
interface TestWrapperProps {
  children: React.ReactNode
  initialUserData?: User | null
}

const TestWrapper: React.FC<TestWrapperProps> = ({ 
  children, 
  initialUserData = mockUser 
}) => {
  const queryClient = createTestQueryClient()
  
  // React Query 캐시에 초기 데이터 설정
  React.useEffect(() => {
    if (initialUserData) {
      queryClient.setQueryData(queryKeys.auth.user(), initialUserData)
    }
  }, [queryClient, initialUserData])

  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  )
}

// 커스텀 render 함수
const customRender = (
  ui: React.ReactElement,
  options?: Omit<RenderOptions, 'wrapper'> & {
    initialUserData?: User | null
  }
) => {
  const { initialUserData, ...renderOptions } = options || {}
  
  return render(ui, {
    wrapper: ({ children }) => (
      <TestWrapper initialUserData={initialUserData}>
        {children}
      </TestWrapper>
    ),
    ...renderOptions,
  })
}

// 테스트 헬퍼 함수들
export const createMockNavigation = () => ({
  navigate: jest.fn(),
  goBack: jest.fn(),
  reset: jest.fn(),
  setParams: jest.fn(),
})

export const createMockRoute = (params = {}) => ({
  params,
  key: 'test-route-key',
  name: 'test-route',
})

export const waitFor = (ms: number): Promise<void> => {
  return new Promise(resolve => setTimeout(resolve, ms))
}

// export everything from testing-library
export * from '@testing-library/react-native'

// override render method
export { customRender as render }

// 목 함수 생성 헬퍼
export const createMockSupabaseQuery = (data: any, error: any = null) => ({
  data,
  error,
  count: data?.length || 0,
})

export const createMockAsyncStorage = () => {
  const storage: { [key: string]: string } = {}
  
  return {
    getItem: jest.fn((key: string) => Promise.resolve(storage[key] || null)),
    setItem: jest.fn((key: string, value: string) => {
      storage[key] = value
      return Promise.resolve()
    }),
    removeItem: jest.fn((key: string) => {
      delete storage[key]
      return Promise.resolve()
    }),
    clear: jest.fn(() => {
      Object.keys(storage).forEach(key => delete storage[key])
      return Promise.resolve()
    }),
  }
}