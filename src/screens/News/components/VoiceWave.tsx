import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated } from 'react-native';
import { px } from '../../../utils/scaleUtils';

export default function VoiceWave({ isPlaying, isme }) {
const anim1 = useRef(new Animated.Value(1)).current;
const anim2 = useRef(new Animated.Value(1)).current;

useEffect(() => {
  let loop;

  if (isPlaying) {
    // ⭐先重置
    anim1.setValue(0);
    anim2.setValue(0);

    loop = Animated.loop(
      Animated.sequence([
        Animated.timing(anim1, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(anim2, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.delay(100),
        Animated.parallel([
          Animated.timing(anim1, {
            toValue: 0,
            duration: 200,
            useNativeDriver: true,
          }),
          Animated.timing(anim2, {
            toValue: 0,
            duration: 200,
            useNativeDriver: true,
          }),
        ]),
      ])
    );

    loop.start();
  } else {
    // ⭐停止时恢复静态
    anim1.setValue(1);
    anim2.setValue(1);
  }

  return () => {
    loop && loop.stop();
  };
}, [isPlaying]);

  return (
    <View
      style={{
        width: px(30),
        height: px(30),
        position: 'relative',
        transform: [{ rotate: isme ? '225deg' : '45deg' }],
      }}
    >
      <View style={styles.container}>
        <View style={styles.content}>
          <View style={styles.arc1} />

          {/* ⭐中间波纹 */}
          <Animated.View
            style={[
              styles.arc2,
              {
                opacity: anim1,
              },
            ]}
          />

          {/* ⭐最外层波纹 */}
          <Animated.View
            style={[
              styles.arc3,
              {
                opacity: anim2,
              },
            ]}
          />
        </View>
      </View>

      <View style={[styles.leftMask,{
        backgroundColor: isme ? '#8CE762' : '#fff', 
      }]} />
      <View style={[styles.rightMask,{
        backgroundColor: isme ? '#8CE762' : '#fff', 
      }]} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: px(30),
    height: px(30),
    borderRadius: px(15),
    //backgroundColor: 'red',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
    position: 'relative',
  // ⭐关键：向右旋转 45°

  },

  content: {
    width: px(30),
    height: px(30),
    justifyContent: 'center',
    alignItems: 'center',
  },
    rightMask:{
    position: 'absolute',
        right: 0,
        bottom: -1,
        width: px(16),   // 一半
        height: px(16),  // 全高 → 上下直线
        backgroundColor: '#8CE762', // 必须和背景一致
        zIndex: 999,
    },
  // ⭐关键：覆盖左半边
  leftMask: {
    position: 'absolute',
    left: 0,
    top: 0,
    width: px(15),   // 一半
    height:px(32),  // 全高 → 上下直线
    
    zIndex: 999,
  },

  arc3: {
    position: 'absolute',
    width: px(30),
    height: px(30),
    borderWidth: px(2),
    borderRadius: px(15),
    borderColor: '#000',
  },

  arc2: {
    position: 'absolute',
    width: px(18),
    height: px(18),
    borderWidth: px(2),
    borderRadius: px(9),
    borderColor: '#000',
  },

  arc1: {
    width: px(8),
    height: px(8),
    borderRadius: px(4),
    backgroundColor: '#000',
  },
});