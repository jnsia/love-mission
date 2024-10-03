import { View, Text, StyleSheet, TextInput, KeyboardTypeOptions } from 'react-native'
import React from 'react'
import { colors } from '@/constants/Colors'
import { fonts } from '@/constants/Fonts'

export default function InputBox({
  label,
  multiline,
  keyboardType,
  text,
  onChangeText,
  isTextNull,
}: {
  label: string
  multiline?: boolean
  keyboardType?: KeyboardTypeOptions
  text: string
  onChangeText: (text: string) => void
  isTextNull?: boolean
}) {
  return (
    <View style={styles.inputBox}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        style={styles.input}
        placeholder={`${label}을 입력해주세요.`}
        value={text}
        onChangeText={onChangeText}
        multiline={multiline || false}
        keyboardType={keyboardType || 'default'}
      />
      {isTextNull && <Text style={styles.warningText}>{label}을 입력해주세요.</Text>}
    </View>
  )
}

const styles = StyleSheet.create({
  inputBox: {
    marginBottom: 16,
  },
  label: {
    fontSize: fonts.size.body,


    fontWeight: 'bold',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    borderRadius: 5,
  },
  warningText: {
    fontSize: 12,
    color: colors.accent,
    paddingTop: 4,
    paddingLeft: 10,
  },
})
