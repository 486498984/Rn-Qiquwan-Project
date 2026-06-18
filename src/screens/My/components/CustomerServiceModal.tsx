import React from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Pressable,
} from 'react-native';
import FastImage from 'react-native-fast-image';
import { px } from '../../../utils/scaleUtils';




interface Props {
  visible: boolean;
  imageUrl: string;
  onClose: () => void;
  onSave: () => void;
}

export default function CustomerServiceModal({
  visible,
  imageUrl,
  onClose,
  onSave,
}: Props) {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
      statusBarTranslucent
    >
      <Pressable
        style={styles.mask}
        onPress={onClose}
      >
        <Pressable
          style={styles.content}
          onPress={() => {}}
        >
          <Text style={styles.title}>
            添加平台客服
          </Text>

          <FastImage
            source={{ uri: imageUrl }}
            style={styles.qrcode}
            resizeMode={FastImage.resizeMode.contain}
          />

          <Text style={styles.desc}>
            截图或保存图片后添加企业微信
          </Text>

          <View style={styles.footer}>
            <TouchableOpacity
              style={styles.cancelBtn}
              onPress={onClose}
            >
              <Text style={styles.cancelText}>
                取消
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.saveBtn}
              onPress={onSave}
            >
              <Text style={styles.saveText}>
                保存图片
              </Text>
            </TouchableOpacity>
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  mask: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.55)',
    justifyContent: 'center',
    alignItems: 'center',
  },

  content: {
    width: px(320),
    backgroundColor: '#fff',
    borderRadius: 16,
    overflow: 'hidden',
    alignItems: 'center',
    paddingTop: px(20),
  },

  title: {
     fontFamily: 'MiSans-Blod',
    fontSize: px(18),
    //fontWeight: '600',
    color: '#333',
  },

  qrcode: {
    width: px(220),
    height: px(320),
    marginTop: px(16),
  },

  desc: {
    fontFamily: 'MiSans-Regular',
    fontSize: px(13),
    color: '#999',
    marginBottom: px(20),
  },

  footer: {
    flexDirection: 'row',
    borderTopWidth: px(1),
    borderTopColor: '#f0f0f0',
  },

  cancelBtn: {
    flex: 1,
    height: px(50),
    justifyContent: 'center',
    alignItems: 'center',
  },

  saveBtn: {
    flex: 1,
    height: px(50),
    justifyContent: 'center',
    alignItems: 'center',
    borderLeftWidth: px(1),
    borderLeftColor: '#f0f0f0',
  },

  cancelText: {
    fontFamily: 'MiSans-Regular',
    fontSize: px(16),
    color: '#666',
  },

  saveText: {
    fontFamily: 'MiSans-Regular',
    fontSize: px(16),
    color: '#FC9026',
    //fontWeight: '600',
  },
});