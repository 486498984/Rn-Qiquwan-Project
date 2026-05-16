import React, { useState } from 'react'
import { View, Text, StyleSheet } from 'react-native'
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  runOnJS,
} from 'react-native-reanimated'
import {
  PanGestureHandler,
  GestureHandlerRootView,
} from 'react-native-gesture-handler'

const THRESHOLD = 80

export default function PullPage() {
  const translateY = useSharedValue(0)
  const [loading, setLoading] = useState(false)

  // 模拟刷新
  const refresh = async () => {
    setLoading(true)

    // 停留时间（你要的“停一下”）
    setTimeout(() => {
      setLoading(false)

      // 回弹
      translateY.value = withSpring(0)
    }, 1500)
  }

  // 手指拖动
  const onGesture = (event) => {
    const y = event.nativeEvent.translationY

    if (y > 0 && !loading) {
      // 阻尼效果（越拉越重）
      translateY.value = y * 0.4
    }
  }

  // 松手
  const onEnd = (event) => {
    if (loading) return

    const y = event.nativeEvent.translationY

    if (y > THRESHOLD) {
      // 到阈值 → 进入 loading 状态
      translateY.value = withTiming(60)

      runOnJS(refresh)()
    } else {
      // 不够 → 回弹
      translateY.value = withSpring(0)
    }
  }

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }))

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      {/* 顶部刷新层 */}
      <View style={styles.refreshBox}>
        <Text style={{ color: '#999' }}>
          {loading ? '正在刷新...' : '下拉刷新'}
        </Text>
      </View>

      {/* 整页可拖动 */}
      <PanGestureHandler
        onGestureEvent={onGesture}
        onEnded={onEnd}
      >
        <Animated.View style={[styles.container, animatedStyle]}>
          
          <View style={styles.content}>
            <Text style={styles.text}>🔥 整页下拉刷新 Demo</Text>
            <Text>iOS / Android 统一体验</Text>
          </View>

        </Animated.View>
      </PanGestureHandler>
    </GestureHandlerRootView>
  )
} 

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    zIndex: 2,   // 内容在上层
  },

  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },

  refreshBox: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 60,
    //backgroundColor: 'red',

    paddingBottom: 0,

    zIndex: 1, // 在内容下面
  },
})