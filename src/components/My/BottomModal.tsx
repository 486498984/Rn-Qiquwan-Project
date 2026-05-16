import React, { useEffect, useRef, useState } from 'react'
import {
  View,
  StyleSheet,
  Modal,
  Animated,
  TouchableWithoutFeedback,
  Dimensions,
  Keyboard
} from 'react-native'
import { px } from '../../utils/scaleUtils';
const { height } = Dimensions.get('window')
import { useSafeAreaInsets } from 'react-native-safe-area-context';




export default function BottomModal({
  visible,
  onClose,
  children,
  duration = 300,
}) {
  const [show, setShow] = useState(visible)
  const translateY = useRef(new Animated.Value(height)).current
  const opacity = useRef(new Animated.Value(0)).current
     const insets = useSafeAreaInsets();
     const bottomSafeHeight = insets.bottom; // 底部安全区高度（数值）
  useEffect(() => {
    if (visible) {
      setShow(true)

      // ⭐关键1：每次打开必须重置
      translateY.setValue(height)
      opacity.setValue(0)

      requestAnimationFrame(() => {
        Animated.parallel([
          Animated.timing(translateY, {
            toValue: 0,
            duration,
            useNativeDriver: true,
          }),
          Animated.timing(opacity, {
            toValue: 1,
            duration,
            useNativeDriver: true,
          }),
        ]).start()
      })
    } else {
      Animated.parallel([
        Animated.timing(translateY, {
          toValue: height,
          duration,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 0,
          duration,
          useNativeDriver: true,
        }),
      ]).start(() => {
        // ⭐关键2：动画结束再卸载 Modal
        setShow(false)
      })
    }
  }, [visible])
const [keyboardHeight, setKeyboardHeight] = useState(0);

useEffect(() => {
  const showSub = Keyboard.addListener('keyboardWillShow', e => {
    setKeyboardHeight(e.endCoordinates.height);
  });

  const hideSub = Keyboard.addListener('keyboardWillHide', () => {
    setKeyboardHeight(0);
  });

  return () => {
    showSub.remove();
    hideSub.remove();
  };
}, []);
  return (
    <Modal transparent visible={show} animationType="none" statusBarTranslucent>
      {/* 遮罩 */}
      <TouchableWithoutFeedback onPress={onClose}>
        <Animated.View style={[styles.mask, { opacity }]} />
      </TouchableWithoutFeedback>

      {/* 内容 */}
      <Animated.View
        style={[
          styles.container,
          {
            transform: [{ translateY }],
            paddingBottom:  keyboardHeight?keyboardHeight:bottomSafeHeight+keyboardHeight,
          },
          
        ]}
      >
        {children}
      </Animated.View>
    </Modal>
  )
}

const styles = StyleSheet.create({
  mask: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  container: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    backgroundColor: '#fff',
    borderTopLeftRadius: px(16),
    borderTopRightRadius:px(16),
    //paddingBottom: px(120),
    overflow: 'hidden',
  },
}) 