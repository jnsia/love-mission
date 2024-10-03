import { Text, StyleSheet, TouchableOpacity } from 'react-native'
import React from 'react'
import theme from '@/constants/Theme'
import { fonts } from '@/constants/Fonts'

export default function SubmitButton({
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
    flex: 1,
    justifyContent: 'center',
    backgroundColor: theme.colors.button,
    height: 48,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  buttonText: {
    color: theme.colors.text,
    fontSize: fonts.size.body,
    fontWeight: 'bold',
    textAlign: 'center',
    fontFamily: fonts.default,
  },
})
