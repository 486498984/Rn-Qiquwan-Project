import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  Animated,
  PanResponder,
  StyleSheet,
  TouchableWithoutFeedback,
} from 'react-native';
import { px } from '../../../utils/scaleUtils';


const WIDTH = px(85);
const HEIGHT = px(28);
const KNOB_SIZE = px(38);

function SlideSwitch({ value = false, onChange }) {
  const anim = useRef(new Animated.Value(value ? 1 : 0)).current;
 
  useEffect(() => {
    Animated.timing(anim, {
      toValue: value ? 1 : 0,
      duration: 200,
      useNativeDriver: true,
    }).start();
  }, [value]);

  // 背景
  const bgColor = anim.interpolate({
    inputRange: [0, 1],
    outputRange: ['#D8D8D8', '#FFFFFF'],
  });

  // 滑块位置
  const translateX = anim.interpolate({
    inputRange: [0, 1],
    outputRange: [WIDTH - KNOB_SIZE - px(6), 0],
  });

  // 滑块颜色
  const knobColor = anim.interpolate({
    inputRange: [0, 1],
    outputRange: ['#AAAAAA', '#FF9500'],
  });

  // 开/关文字颜色
  const openColor = anim.interpolate({
    inputRange: [0, 1],
    outputRange: ['rgba(0,0,0,0.3)', '#FFFFFF'],
  });

  const closeColor = anim.interpolate({
    inputRange: [0, 1],
    outputRange: ['#FFFFFF', 'rgba(0,0,0,0.3)'],
  });

  const toggle = () => {
    onChange?.(!value);
  };

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderMove: (_, g) => {
        let next = g.dx > 10 ? 1 : g.dx < -10 ? 0 : value;

        Animated.timing(anim, {
          toValue: next,
          duration: 0,
          useNativeDriver: true,
        }).start();
      },
      onPanResponderRelease: (_, g) => {
        const next = g.dx > 0;
        onChange?.(next);
      },
    })
  ).current;

  return (
    <TouchableWithoutFeedback onPress={toggle}>
      <Animated.View
        {...panResponder.panHandlers}
        style={[
          styles.container,
          { backgroundColor: bgColor },
        ]}
      >
        {/* 左：开（永远在最上层） */}
        <Animated.Text
          style={[
            styles.text,
            styles.openText,
            {
              color: openColor,
              zIndex: 10,
              elevation: 10, // Android
            },
          ]}
        >
          开
        </Animated.Text>

        {/* 右：关（永远在最上层） */}
        <Animated.Text
          style={[
            styles.text,
            styles.closeText,
            {
              color: closeColor,
              zIndex: 10,
              elevation: 10,
            },
          ]}
        >
          关
        </Animated.Text>

        {/* 滑块（在文字下方） */}
        <Animated.View
          style={[
            styles.knob,
            {
              backgroundColor: knobColor,
              transform: [{ translateX }],
              zIndex: 1,
              elevation: 1,
            },
          ]}
        />
      </Animated.View>
    </TouchableWithoutFeedback>
  );
}

export default React.memo(SlideSwitch);

const styles = StyleSheet.create({
  container: {
    width: WIDTH,
    height: HEIGHT,
    borderRadius:px(20),
    flexDirection: 'row',
    alignItems: 'center',
    position: 'relative',
    paddingHorizontal: px(3),
    overflow: 'hidden',
  },

  text: {
    position: 'absolute',
  fontFamily: 'MiSans-Medium',
        fontSize:px(12),
        //color:'#1A1A1A',
        //fontWeight:500,
        lineHeight:px(16),
  },

  openText: {
    left: px(16),
  },

  closeText: {
    right: px(16),
  },

  knob: {
    //position: 'absolute',
    width: px(38),
    height: px(22),
    borderRadius:px(20),
    //top: 2,
  },
}); 