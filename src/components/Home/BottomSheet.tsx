import React, { useEffect } from "react";
import { View, StyleSheet, TouchableWithoutFeedback,BackHandler, Pressable,
  Keyboard,
} from "react-native";
import {
  Gesture,
  GestureDetector,
} from "react-native-gesture-handler";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSpring,
  runOnJS,
} from "react-native-reanimated";
import { px } from '../../utils/scaleUtils';


const BottomSheet = ({ visible, onClose, children, sheetHeight = 400,
  
 }) => {
  const translateY = useSharedValue(sheetHeight);
  const opacity = useSharedValue(0);

  useEffect(() => {
    if (visible) {
      translateY.value = withTiming(0, { duration: 300 });
      opacity.value = withTiming(1);
    } else {
      translateY.value = withTiming(sheetHeight, { duration: 300 });
      opacity.value = withTiming(0);
    }
  }, [visible]);

  const panGesture = Gesture.Pan()
    .onUpdate((e) => {
      if (e.translationY > 0) {
        translateY.value = e.translationY;
      }
    })
    .onEnd((e) => {
      if (e.translationY > 120 || e.velocityY > 1000) {
        runOnJS(onClose)(); // 👈 关键
      } else {
        translateY.value = withSpring(0);
      }
    });

  const sheetStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));

  const maskStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));
useEffect(() => {
  const onBackPress = () => {
    if (visible) {
      onClose();   // ✅ 关闭弹窗
      return true; // ✅ 阻止默认返回（关键！）
    }
    return false;  // ❌ 继续执行默认返回（返回上一页）
  };

  const subscription = BackHandler.addEventListener(
    "hardwareBackPress",
    onBackPress
  );

  return () => subscription.remove();
}, [visible]);
  return (
    <View style={styles.container}>
      <TouchableWithoutFeedback onPress={onClose}>
        <Animated.View style={[styles.mask, maskStyle]} pointerEvents={visible ? "auto" : "none"}/>
      </TouchableWithoutFeedback>

   
       <Animated.View
          style={[
            styles.sheet,
            { height: sheetHeight },
            sheetStyle,
          ]}
        >
          {children}
        </Animated.View>
    
    </View>
  );
};

export default BottomSheet;

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    width: "100%",
    height: "100%",
    justifyContent: "flex-end",
  },
  mask: {
    ...StyleSheet.absoluteFill,
    backgroundColor: "rgba(0,0,0,0.4)",
  },
  sheet: {
    backgroundColor: "#fff",
    borderTopLeftRadius: px(12),
    borderTopRightRadius: px(12),
    //paddingTop: px(16),
    //paddingLeft:px(16),
    //paddingRight:px(16)
  },
  handle: {
    width: 40,
    height: 5,
    borderRadius: 3,
    backgroundColor: "#ccc",
    alignSelf: "center",
    marginBottom: 10,
  },
});