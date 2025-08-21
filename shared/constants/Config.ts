// API 엔드포인트 및 설정
export const API_CONFIG = {
  SUPABASE: {
    RETRY_ATTEMPTS: 3,
    TIMEOUT: 10000,
  },
  PAGINATION: {
    DEFAULT_PAGE_SIZE: 20,
    MAX_PAGE_SIZE: 100,
  },
} as const

// 미션 관련 상수
export const MISSION_CONFIG = {
  TYPES: {
    DAILY: 'daily',
    SPECIAL: 'special',
    EMERGENCY: 'emergency',
    COUPON: 'coupon',
    COMPLETE: 'complete',
  },
  STATUS: {
    PENDING: 'pending',
    COMPLETED: 'completed',
    FAILED: 'failed',
  },
  DEFAULT_COINS: {
    SUCCESS: 100,
    FAILURE: 50,
  },
} as const

// 쿠폰 관련 상수
export const COUPON_CONFIG = {
  TYPES: {
    DISCOUNT: 'discount',
    FREE_SHIPPING: 'free_shipping',
    CASHBACK: 'cashback',
  },
  STATUS: {
    ACTIVE: 'active',
    USED: 'used',
    EXPIRED: 'expired',
  },
} as const

// UI 관련 상수
export const UI_CONFIG = {
  ANIMATION: {
    DURATION: 300,
    SPRING_CONFIG: { damping: 15, stiffness: 300 },
  },
  MODAL: {
    BACKDROP_OPACITY: 0.5,
  },
} as const

// 메시지 상수
export const MESSAGES = {
  ERROR: {
    NETWORK: '네트워크 연결을 확인해주세요.',
    UNAUTHORIZED: '로그인이 필요합니다.',
    FORBIDDEN: '권한이 없습니다.',
    NOT_FOUND: '요청한 데이터를 찾을 수 없습니다.',
    SERVER_ERROR: '서버 오류가 발생했습니다.',
    UNKNOWN: '알 수 없는 오류가 발생했습니다.',
  },
  SUCCESS: {
    MISSION_COMPLETED: '미션이 완료되었습니다!',
    COUPON_ISSUED: '쿠폰이 발급되었습니다!',
    DATA_SAVED: '저장되었습니다.',
  },
  CONFIRM: {
    DELETE: '정말 삭제하시겠습니까?',
    LOGOUT: '로그아웃 하시겠습니까?',
    MISSION_SUBMIT: '미션을 제출하시겠습니까?',
  },
} as const