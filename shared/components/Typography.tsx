import { Text, TextProps, StyleSheet } from 'react-native'
import React from 'react'
import theme from '@/shared/constants/Theme'
import { fonts } from '@/shared/constants/Fonts'
import { colors } from '@/shared/constants/Colors'

type TypographyVariant = 'h1' | 'h2' | 'h3' | 'h4' | 'body' | 'caption' | 'label'
type TypographyColor = 'primary' | 'secondary' | 'success' | 'danger' | 'accent' | 'white'

interface TypographyProps extends TextProps {
  variant?: TypographyVariant
  color?: TypographyColor
  children: React.ReactNode
}

export default function Typography({ 
  variant = 'body', 
  color = 'primary',
  style,
  children,
  ...props 
}: TypographyProps) {
  const getTextStyle = () => {
    const variantStyle = getVariantStyle(variant)
    const colorStyle = getColorStyle(color)
    return [variantStyle, colorStyle]
  }

  const getVariantStyle = (variant: TypographyVariant) => {
    switch (variant) {
      case 'h1':
        return styles.h1
      case 'h2':
        return styles.h2
      case 'h3':
        return styles.h3
      case 'h4':
        return styles.h4
      case 'body':
        return styles.body
      case 'caption':
        return styles.caption
      case 'label':
        return styles.label
      default:
        return styles.body
    }
  }

  const getColorStyle = (color: TypographyColor) => {
    switch (color) {
      case 'primary':
        return { color: theme.colors.text }
      case 'secondary':
        return { color: theme.colors.subText }
      case 'success':
        return { color: colors.success }
      case 'danger':
        return { color: colors.danger }
      case 'accent':
        return { color: colors.accent }
      case 'white':
        return { color: '#FFFFFF' }
      default:
        return { color: theme.colors.text }
    }
  }

  return (
    <Text style={[getTextStyle(), style]} {...props}>
      {children}
    </Text>
  )
}

const styles = StyleSheet.create({
  h1: {
    fontSize: 32,
    fontWeight: 'bold',
    fontFamily: fonts.defaultBold,
    lineHeight: 40,
  },
  h2: {
    fontSize: 28,
    fontWeight: 'bold',
    fontFamily: fonts.defaultBold,
    lineHeight: 36,
  },
  h3: {
    fontSize: 24,
    fontWeight: 'bold',
    fontFamily: fonts.defaultBold,
    lineHeight: 32,
  },
  h4: {
    fontSize: 20,
    fontWeight: 'bold',
    fontFamily: fonts.defaultBold,
    lineHeight: 28,
  },
  body: {
    fontSize: fonts.size.body,
    fontFamily: fonts.default,
    lineHeight: 20,
  },
  caption: {
    fontSize: 12,
    fontFamily: fonts.default,
    lineHeight: 16,
  },
  label: {
    fontSize: fonts.size.body,
    fontWeight: 'bold',
    fontFamily: fonts.defaultBold,
    lineHeight: 20,
  },
})