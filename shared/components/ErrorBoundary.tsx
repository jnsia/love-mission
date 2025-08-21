import React, { Component, ErrorInfo, ReactNode } from 'react'
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native'
import { ErrorHandler } from '@/shared/utils/errorHandler'
import theme from '@/shared/constants/Theme'
import Typography from './Typography'
import Button from './Button'

interface Props {
  children: ReactNode
  fallback?: (error: Error, retry: () => void) => ReactNode
}

interface State {
  hasError: boolean
  error: Error | null
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // 에러 로깅
    console.error('🚨 Error Boundary Caught Error:', error)
    console.error('Error Info:', errorInfo)
    
    // 에러 추적 서비스로 전송 (필요시)
    // crashlytics().recordError(error)
  }

  retry = () => {
    this.setState({ hasError: false, error: null })
  }

  render() {
    if (this.state.hasError) {
      // 커스텀 fallback이 있다면 사용
      if (this.props.fallback && this.state.error) {
        return this.props.fallback(this.state.error, this.retry)
      }

      // 기본 에러 UI
      return (
        <View style={styles.container}>
          <View style={styles.content}>
            <Typography variant="h3" color="primary" style={styles.title}>
              앱에 문제가 발생했습니다
            </Typography>
            
            <Typography variant="body" color="secondary" style={styles.message}>
              예상치 못한 오류가 발생했습니다.{'\n'}
              다시 시도해주세요.
            </Typography>

            {__DEV__ && this.state.error && (
              <View style={styles.debugInfo}>
                <Typography variant="caption" color="danger" style={styles.debugTitle}>
                  개발 환경 디버그 정보:
                </Typography>
                <Typography variant="caption" color="secondary" style={styles.debugMessage}>
                  {this.state.error.message}
                </Typography>
              </View>
            )}

            <View style={styles.actions}>
              <Button
                text="다시 시도"
                variant="primary"
                onPress={this.retry}
                style={styles.retryButton}
              />
            </View>
          </View>
        </View>
      )
    }

    return this.props.children
  }
}

// 함수형 컴포넌트용 에러 바운더리 래퍼
interface ErrorBoundaryWrapperProps {
  children: ReactNode
  fallback?: (error: Error, retry: () => void) => ReactNode
  onError?: (error: Error, errorInfo: ErrorInfo) => void
}

export const withErrorBoundary = <P extends object>(
  Component: React.ComponentType<P>,
  errorBoundaryProps?: Omit<ErrorBoundaryWrapperProps, 'children'>
) => {
  const WrappedComponent = (props: P) => (
    <ErrorBoundary {...errorBoundaryProps}>
      <Component {...props} />
    </ErrorBoundary>
  )

  WrappedComponent.displayName = `withErrorBoundary(${Component.displayName || Component.name})`
  return WrappedComponent
}

// Query Error Boundary (React Query용)
export const QueryErrorBoundary: React.FC<{
  children: ReactNode
  onError?: (error: Error) => void
}> = ({ children, onError }) => {
  return (
    <ErrorBoundary
      fallback={(error, retry) => (
        <View style={styles.queryErrorContainer}>
          <Typography variant="h4" color="primary" style={styles.queryErrorTitle}>
            데이터 로딩 실패
          </Typography>
          
          <Typography variant="body" color="secondary" style={styles.queryErrorMessage}>
            {ErrorHandler.getErrorMessage(error)}
          </Typography>

          <Button
            text="다시 시도"
            variant="primary"
            onPress={retry}
            style={styles.retryButton}
          />
        </View>
      )}
    />
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  content: {
    alignItems: 'center',
    maxWidth: 300,
  },
  title: {
    marginBottom: 16,
    textAlign: 'center',
  },
  message: {
    marginBottom: 24,
    textAlign: 'center',
    lineHeight: 20,
  },
  debugInfo: {
    backgroundColor: 'rgba(255, 99, 99, 0.1)',
    padding: 12,
    borderRadius: 8,
    marginBottom: 24,
    width: '100%',
  },
  debugTitle: {
    marginBottom: 8,
    fontWeight: 'bold',
  },
  debugMessage: {
    fontFamily: 'monospace',
  },
  actions: {
    width: '100%',
  },
  retryButton: {
    width: '100%',
  },
  queryErrorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: theme.colors.background,
  },
  queryErrorTitle: {
    marginBottom: 12,
    textAlign: 'center',
  },
  queryErrorMessage: {
    marginBottom: 20,
    textAlign: 'center',
    lineHeight: 20,
  },
})