import { Text, StyleSheet, TouchableOpacity } from 'react-native'
import React from 'react'
import theme from '@/shared/constants/Theme'
import { fonts } from '@/shared/constants/Fonts'

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
    backgroundColor: theme.colors.text,
    justifyContent: 'center',
    borderWidth: 1,
    height: 48,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  buttonText: {
    fontSize: fonts.size.body,
    fontWeight: 'bold',
    textAlign: 'center',
  },
})
