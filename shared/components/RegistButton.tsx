import { Text, StyleSheet, TouchableOpacity } from 'react-native'
import React from 'react'
import theme from '@/shared/constants/Theme'
import { fonts } from '@/shared/constants/Fonts'

export default function RegistButton({
  text,
  onPressEvent,
}: {
  text: string
  onPressEvent: () => void
}) {
  return (
    <TouchableOpacity style={styles.button} onPress={onPressEvent}>
      <Text style={styles.buttonText}>{text}</Text>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  button: {
    justifyContent: 'center',
    backgroundColor: theme.colors.button,
    height: 48,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginBottom: 10,
  },
  buttonText: {
    color: theme.colors.text,
    fontSize: fonts.size.body,

    fontWeight: 'bold',
    textAlign: 'center',
    fontFamily: fonts.default,
  },
})
