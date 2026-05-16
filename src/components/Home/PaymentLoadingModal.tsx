import React from 'react';
import { Modal, View, ActivityIndicator, StyleSheet, Text } from 'react-native';

export default function PaymentLoadingModal({ visible }) {
  return (
    <Modal
      transparent={true}      // 背景透明
      animationType="fade"    // 淡入淡出
      visible={visible}       // 外部控制显示
      onRequestClose={() => {}} // 安卓必须提供
    >
      <View style={styles.overlay}>
        <View style={styles.container}>
          <ActivityIndicator size="large" color="#fff" />
          <Text style={styles.text}>支付中，请稍候...</Text>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)', // 半透明遮罩
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    width: 180,
    height: 120,
    backgroundColor: 'rgba(0,0,0,0.8)',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  text: {
    color: '#fff',
    marginTop: 15,
    fontSize: 16,
    textAlign: 'center',
  },
});
