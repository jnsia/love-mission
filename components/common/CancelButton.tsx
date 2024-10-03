import { Text, StyleSheet, TouchableOpacity } from 'react-native'
import React from 'react'
import theme from '@/constants/Theme'
import { fonts } from '@/constants/Fonts'

export default function CancelButton({
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
    borderWidth: 1,
    height: 48,
    paddingHorizontal: 20,
    borderRadius: 5,
    backgroundColor: theme.colors.text,
  },
  buttonText: {
    fontSize: fonts.size.body,
    fontWeight: 'bold',
    textAlign: 'center',
  },
})
