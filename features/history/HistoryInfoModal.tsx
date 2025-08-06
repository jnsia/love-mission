import { View, Text, Modal, StyleSheet, ScrollView, TouchableWithoutFeedback } from 'react-native'
import React from 'react'
import theme from '@/shared/constants/Theme'
import { fonts } from '@/shared/constants/Fonts'
import CancelButton from '@/shared/components/CancelButton'

export default function HistoryInfoModal({
  isModalVisible,
  closeModal,
  history,
}: {
  isModalVisible: boolean
  closeModal: () => void
  history: coinHistory
}) {
  return (
    <Modal
      animationType='fade'
      visible={isModalVisible}
      transparent={true}
      onRequestClose={closeModal}
    >
      <TouchableWithoutFeedback onPress={closeModal}>
        <View style={styles.modalOverlay}>
          <ScrollView style={styles.modalView}>
            <View style={styles.historyInfo}>
              <Text style={styles.label}>기록 이름</Text>
              <Text style={styles.historyInfoText}>{history.record}</Text>
            </View>

            <View style={styles.historyInfo}>
              <Text style={styles.label}>기록 날짜</Text>
              <Text style={styles.historyInfoText}>{history.date}</Text>
            </View>

            <View style={styles.historyInfo}>
              <Text style={styles.label}>얻거나 잃은 코인</Text>
              <Text style={styles.historyInfoText}>
                {history.coin > 0 ? `+${history.coin}` : history.coin} Coin
              </Text>
            </View>

            <CancelButton text='닫기' onPressEvent={closeModal} />
          </ScrollView>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  )
}

const styles = StyleSheet.create({
  guideBox: {
    alignItems: 'center',
    padding: 16,
    backgroundColor: theme.colors.button,
    marginBottom: 16,
  },
  guideText: {
    fontSize: 14,
    color: theme.colors.text,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // 배경을 반투명하게 설정
  },
  modalView: {
    position: 'absolute',
    width: '100%',
    bottom: 0,
    padding: 16,
    marginTop: 60,
    backgroundColor: 'white',
  },
  modalTextStyle: {
    color: '#17191c',
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 50,
  },
  label: {
    fontSize: fonts.size.body,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  historyInfo: {
    marginBottom: 16,
  },
  historyInfoText: {
    fontSize: 14,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
})
