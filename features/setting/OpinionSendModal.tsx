import { View, Text, Modal, StyleSheet, TouchableWithoutFeedback, TextInput } from 'react-native'
import React, { useState } from 'react'
import CancelButton from '../common/CancelButton'
import { fonts } from '@/shared/constants/Fonts'
import { supabase } from '@/shared/utils/supabase'
import SubmitButton from '../common/SubmitButton'

export default function OpinionSendModal({
  isVisible,
  closeModal,
}: {
  isVisible: boolean
  closeModal: () => void
}) {
  const [opinion, setOpinion] = useState('')

  const sendOpinion = async () => {
    await supabase.from('opinions').insert({ opinion: opinion })
  }

  return (
    <Modal animationType='fade' visible={isVisible} transparent={true} onRequestClose={closeModal}>
      <TouchableWithoutFeedback onPress={closeModal}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalView}>
            <Text style={styles.title}>개발자에게 의견 보내기</Text>
            <View style={styles.modalBody}>
              <TextInput
                style={styles.input}
                placeholder='앱에 대한 의견을 입력해주세요!'
                value={opinion}
                onChangeText={setOpinion}
                multiline
              />
              <Text style={styles.label}>의견을 수렴하여 더 좋은 앱을 만들겠습니다!</Text>
            </View>
            <View style={{ flexDirection: 'row', gap: 16 }}>
              <CancelButton text='취소하기' onPressEvent={closeModal} />
              <SubmitButton text='의견 공유' onPressEvent={sendOpinion} />
            </View>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  )
}

const styles = StyleSheet.create({
  title: {
    fontSize: 20,
    textAlign: 'center',
    fontFamily: fonts.defaultBold,
    marginBottom: 12,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalView: {
    position: 'absolute',
    width: '90%',
    padding: 16,
    backgroundColor: 'white',
    borderRadius: 8,
  },
  modalBody: {
    gap: 8,
    marginBottom: 8,
  },
  modalTextStyle: {
    color: '#17191c',
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 50,
  },
  label: {
    fontSize: 14,
    marginBottom: 8,
    fontFamily: fonts.default,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    borderRadius: 5,
    fontFamily: fonts.default,
  },
})
