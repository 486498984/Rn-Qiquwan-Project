import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Dimensions,
} from 'react-native';

import WheelPicker from '@quidone/react-native-wheel-picker';
import WheelPickerFeedback from '@quidone/react-native-wheel-picker-feedback';
import { px } from '../../utils/scaleUtils';
import LinearGradient from 'react-native-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';



const { height } = Dimensions.get('window');

const StorePickerModal = ({
  visible,
  storeList,
  onConfirm,
  onCancel,
  defaultValue,
}) => {
  const insets = useSafeAreaInsets();
  const bottomSafeHeight = insets.bottom; // 底部安全区高度（数值）
  // =========================
  // 数据转换
  // =========================
  const data = storeList.map(item => ({
    value: item.storeId,
    label: item.storeName,
  }));

  // =========================
  // 状态
  // =========================
  const [show, setShow] = useState(false);
  const [value, setValue] = useState(null);

  // =========================
  // 动画值（关键）
  // =========================
  const translateY = useRef(new Animated.Value(height)).current;
  const opacity = useRef(new Animated.Value(0)).current;

  // =========================
  // 打开动画（从下往上）
  // =========================
  const open = () => {
    setShow(true);

    Animated.parallel([
      Animated.timing(translateY, {
        toValue: 0,
        duration: 280,
        useNativeDriver: true,
      }),
      Animated.timing(opacity, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start();
  };

  // =========================
  // 关闭动画（向下滑出）
  // =========================
  const close = () => {
    Animated.parallel([
      Animated.timing(translateY, {
        toValue: height,
        duration: 250,
        useNativeDriver: true,
      }),
      Animated.timing(opacity, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setShow(false);
      onCancel?.();
    });
  };

  // =========================
  // 外部控制
  // =========================
  useEffect(() => {
    if (visible) {
      setShow(true);

      const initValue = defaultValue || data[0]?.value;
      setValue(initValue);

      requestAnimationFrame(open);
    } else if (show) {
      close();
    }
  }, [visible]);

  return (
    <Modal transparent visible={show} animationType="none"
    statusBarTranslucent>
      
      {/* 遮罩 */}
      <Animated.View style={[styles.mask, { opacity }]}>
        <TouchableOpacity style={{ flex: 1 }} onPress={close} />
      </Animated.View>

      {/* 底部弹窗 */}
      <Animated.View
        style={[
          styles.panel,
          {
            transform: [{ translateY }],
            paddingBottom:bottomSafeHeight
          },
        ]}
      >

        <Text style={styles.title}>选择管理店铺</Text>

        {/* WheelPicker */}
        <WheelPicker
          data={data}
          value={value}
          itemHeight={px(50)}
          visibleItemCount={5}
          enableScrollByTapOnItem
          onValueChanged={({ item }) => {
            setValue(item.value);
          }}
          onValueChanging={() => {
            WheelPickerFeedback.triggerSoundAndImpact();
          }}
        />

        {/* 按钮 */}
        <View style={styles.actions}>
          <TouchableOpacity onPress={close} style={styles.btn}>
            <Text style={styles.canneltx}>取消</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => {
              const selected = storeList.find(
                i => i.storeId === value
              );

              onConfirm?.(selected);
              close();
            }}
           
          >
              <LinearGradient
                 colors={['#FEC525', '#FC9026']} // 渐变颜色
            start={{ x: 1, y: 0 }}   
            end={{ x: 0, y: 0 }}
            style={styles.gradientBox}
                    >
            <Text style={styles.oktx}>确认</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>

      </Animated.View>
    </Modal>
  );
};

export default StorePickerModal;
const styles = StyleSheet.create({
    oktx:{
   fontFamily: 'MiSans-Medium',
        fontSize:px(18),
        color:'#FFFFFF',
        //fontWeight:500,
        lineHeight:px(24),
    },
    canneltx:{
   fontFamily: 'MiSans-Regular',
    fontSize:px(18),
    color:'#767676',
    fontWeight:400,
    lineHeight:px(24), 
    },
        gradientBox: {
    width:px(142),
    height: px(48),
    borderRadius: px(30),
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  mask: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.4)',
  },

  panel: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    backgroundColor: '#fff',
    paddingTop: px(20),
    borderTopLeftRadius: px(12),
    borderTopRightRadius:px(12),
  },

  title: {
    textAlign:'center',
       fontFamily: 'MiSans-Medium',
        fontSize:px(19),
        color:'#1A1A1A',
        //fontWeight:500,
        lineHeight:px(25),
  },

  actions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: px(10),
  },

  btn: {
    borderRadius: px(30),
    width: px(142),
    height: px(48),
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    backgroundColor: '#D8D8D8',
  },

  ok: {
    backgroundColor: '#1677ff',
    borderRadius:px(8),
  },
});