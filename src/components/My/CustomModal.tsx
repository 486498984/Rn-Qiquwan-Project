import React from 'react';
import { View, Modal, StyleSheet, TouchableWithoutFeedback,Image,TouchableOpacity,
  Animated,Keyboard,KeyboardAvoidingView,Platform
 } from 'react-native';
import { px } from '../../utils/scaleUtils';

const CustomModal=({visible,onClose,children,width=px(323),isclose=false,
 })=> {
  const translateY = React.useRef(new Animated.Value(300)).current;
  React.useEffect(() => {
  if (visible) {
        translateY.setValue(300);
    Animated.timing(translateY, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
  } else {
    Animated.timing(translateY, {
      toValue: 300,
      duration: 250,
      useNativeDriver: true,
    }).start();
  }
}, [visible]);
  return (
    <Modal
      visible={visible}
      transparent
      statusBarTranslucent
      animationType="fade"
      onRequestClose={onClose} // 安卓返回键
    >
      {/* 遮罩层 */}
      <TouchableWithoutFeedback onPress={()=> Keyboard.dismiss()}>
        <View style={styles.overlay} />
      </TouchableWithoutFeedback>
        <KeyboardAvoidingView
          style={{ flex: 1, justifyContent: 'center' }}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          keyboardVerticalOffset={0}
        >
<View       style={{flexDirection: 'row',alignItems: 'center',
  justifyContent: 'center',width: '100%',height: '100%',}}>
    {/* 弹窗内容 */}
      <Animated.View style={{width: '100%',alignItems: 'center',
       marginTop: px(0),flexDirection: 'column',transform: [{ translateY }] }}>
      <View style={[styles.modalContainer, { width }]}>
        {children}
      </View>
      {isclose&&
            <TouchableOpacity onPress={onClose} style={{marginTop: px(20),}}>
      <Image source={require('../../../assets/images/my/boclose.png')}
     style={{width: px(40),height: px(40)}}></Image>
      </TouchableOpacity>
      }
      </Animated.View>
</View>
  </KeyboardAvoidingView>
    </Modal>
  );
}
export default React.memo(CustomModal);
const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: '#1A1A1A',
    opacity: 0.7,
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
  },
  modalContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: px(24),
    //marginHorizontal: px(24),
    //position: 'absolute',
    //top: px(170),
    //left: 0,
    //transform: [{ translateX: -px(186) }, { translateY: -0.5 * px(323) }], // 居中显示，px(186)=宽度一半，如果你希望宽度自适应可改
    //width: px(372), // 可自定义宽度
    padding: px(20),
    //justifyContent: 'center',
    alignItems: 'center',
  },
});