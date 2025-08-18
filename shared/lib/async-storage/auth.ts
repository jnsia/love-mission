import AsyncStorage from '@react-native-async-storage/async-storage'

const AUTH_KEY = '@love-mission/auth'

interface AuthData {
  email: string
}

export const setAuthData = async (email: string) => {
  try {
    const authData: AuthData = { email }
    await AsyncStorage.setItem(AUTH_KEY, JSON.stringify(authData))
  } catch (error) {
    console.error('Failed to save auth data:', error)
  }
}

export const getAuthData = async (): Promise<AuthData | null> => {
  try {
    const authDataString = await AsyncStorage.getItem(AUTH_KEY)
    return authDataString ? JSON.parse(authDataString) : null
  } catch (error) {
    console.error('Failed to retrieve auth data:', error)
    return null
  }
}

export const clearAuthData = async () => {
  try {
    await AsyncStorage.removeItem(AUTH_KEY)
  } catch (error) {
    console.error('Failed to clear auth data:', error)
  }
}
