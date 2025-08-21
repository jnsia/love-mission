// 공통 API 응답 타입
export interface ApiResponse<T> {
  data: T
  message?: string
  status: 'success' | 'error'
}

export interface PaginationParams {
  page?: number
  limit?: number
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
    hasNext: boolean
    hasPrev: boolean
  }
}

// 공통 엔티티 타입
export interface BaseEntity {
  id: string
  created_at: string
  updated_at: string
}

// 폼 관련 타입
export interface FormField<T = any> {
  value: T
  error?: string
  touched: boolean
}

export interface FormState<T extends Record<string, any>> {
  fields: {
    [K in keyof T]: FormField<T[K]>
  }
  isValid: boolean
  isSubmitting: boolean
}

// 네비게이션 관련 타입
export interface NavigationProps {
  navigation: any // react-navigation 타입으로 교체 가능
  route: any
}

// 모달 관련 타입
export interface ModalProps {
  visible: boolean
  onClose: () => void
  onConfirm?: () => void
  title?: string
  children?: React.ReactNode
}

// 리스트 아이템 관련 타입
export interface ListItemProps<T> {
  item: T
  index: number
  onPress?: (item: T) => void
  onLongPress?: (item: T) => void
}

// 상태 관련 타입
export type LoadingState = 'idle' | 'loading' | 'success' | 'error'

export interface AsyncState<T> {
  data: T | null
  status: LoadingState
  error: string | null
}

// 이벤트 핸들러 타입
export type EventHandler<T = void> = (data: T) => void | Promise<void>

// 컴포넌트 props 타입 유틸리티
export type WithChildren<T = {}> = T & {
  children?: React.ReactNode
}

export type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>