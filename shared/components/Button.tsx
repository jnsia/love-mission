import { Text, StyleSheet, TouchableOpacity, TouchableOpacityProps } from 'react-native'
import React from 'react'
import theme from '@/shared/constants/Theme'
import { colors } from '@/shared/constants/Colors'
import { fonts } from '@/shared/constants/Fonts'

type ButtonVariant = 'primary' | 'secondary' | 'danger' | 'cancel'

interface ButtonProps extends Omit<TouchableOpacityProps, 'onPress'> {
  text: string
  variant?: ButtonVariant
  onPress: () => void
}

export default function Button({ 
  text, 
  variant = 'primary', 
  onPress, 
  style,
  ...props 
}: ButtonProps) {
  const getButtonStyle = () => {
    switch (variant) {
      case 'primary':
        return [styles.button, styles.primaryButton]
      case 'secondary':
        return [styles.button, styles.secondaryButton]
      case 'danger':
        return [styles.button, styles.dangerButton]
      case 'cancel':
        return [styles.button, styles.cancelButton]
      default:
        return [styles.button, styles.primaryButton]
    }
  }

  const getTextStyle = () => {
    switch (variant) {
      case 'primary':
        return [styles.buttonText, styles.primaryText]
      case 'secondary':
        return [styles.buttonText, styles.secondaryText]
      case 'danger':
        return [styles.buttonText, styles.dangerText]
      case 'cancel':
        return [styles.buttonText, styles.cancelText]
      default:
        return [styles.buttonText, styles.primaryText]
    }
  }

  return (
    <TouchableOpacity 
      style={[getButtonStyle(), style]} 
      onPress={onPress}
      {...props}
    >
      <Text style={getTextStyle()}>{text}</Text>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  button: {
    justifyContent: 'center',
    height: 48,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  buttonText: {
    fontSize: fonts.size.body,
    fontWeight: 'bold',
    textAlign: 'center',
    fontFamily: fonts.default,
  },
  primaryButton: {
    backgroundColor: theme.colors.button,
  },
  primaryText: {
    color: theme.colors.text,
  },
  secondaryButton: {
    backgroundColor: theme.colors.button,
    marginBottom: 10,
  },
  secondaryText: {
    color: theme.colors.text,
  },
  dangerButton: {
    flex: 1,
    borderWidth: 1,
    borderColor: colors.accent,
    backgroundColor: 'transparent',
  },
  dangerText: {
    color: colors.accent,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: theme.colors.text,
    borderWidth: 1,
  },
  cancelText: {
    color: theme.colors.background,
  },
})