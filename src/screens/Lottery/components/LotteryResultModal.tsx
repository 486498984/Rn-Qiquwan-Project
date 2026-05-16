import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Modal,
  Animated,
  TouchableOpacity,
  Image,
  StyleSheet,
  Dimensions,
  Text,
} from 'react-native';
import { px } from '../../../utils/scaleUtils';
const { width } = Dimensions.get('window');

export default function LotteryResultModal({
  visible,
  index = 0,   // 👈 父组件传中奖索引
  onClose,
  prizeifo
}) {
  const scale = useRef(new Animated.Value(0.6)).current;
  const opacity = useRef(new Animated.Value(0)).current;

  const [show, setShow] = useState(visible);

  // 👇 子组件写死3张本地图
  const images = [
    require('../../../../assets/images/lottery/coup.png'),
    require('../../../../assets/images/lottery/coin.png'),
    require('../../../../assets/images/lottery/serve.png')
  ];

  useEffect(() => {
    if (visible) {
      setShow(true);

      Animated.parallel([
        Animated.timing(scale, {
          toValue: 1,
          duration: 250,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 1,
          duration: 250,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(scale, {
          toValue: 0.6,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start(() => {
        setShow(false);
      });
    }
  }, [visible]);

  if (!show) return null;

  return (
    <Modal transparent visible={show} animationType="none" statusBarTranslucent>
      <View style={styles.mask}>
        <Animated.View
          style={[
            styles.box,
            {
              transform: [{ scale }],
              opacity,
            },
          ]}
        >
          {/* 只显示父组件指定的一张 */}
          <TouchableOpacity onPress={onClose} activeOpacity={1}
          style={{position: 'relative',width: '100%',height: px(459),}}>
          <Image
            source={images[index]}
            style={styles.img}
            resizeMode="contain"
          />
          <View style={{position: 'absolute',width: '100%',top:px(142),
            flexDirection: 'row',justifyContent: 'center',
          }}>
            <View style={{flexDirection: 'column',alignItems: 'center',}}>
                   {index==0&&
   <Text style={styles.title}>{prizeifo?.prize?.name}</Text>
                   }
           {index==1&&
   <Text style={styles.title}>{prizeifo?.prize?.name}</Text>
                   }
                      {index==2&&
   <Text style={styles.title}>{prizeifo?.prize?.name}</Text>
                   }
   {index==0&&
    <Text style={[styles.stitle,{marginTop: px(4),}]}>下单支付可抵扣{prizeifo?.couponInfo?.reduceAmount/100}元人民币</Text>
   }
     {index==1&&
    <Text style={[styles.stitle,{marginTop: px(4),}]}>联系平台客服咨询使用</Text>
   }
   {index==2&&
    <Text style={[styles.stitle,{marginTop: px(4),}]}>联系平台客服咨询使用</Text>
   }


      {index==0&&
      <View style={{flexDirection: 'row',marginTop: px(27),
    gap:px(41)
    }}>
        <View style={{flexDirection: 'row',alignItems: 'flex-end',}}>
        <Text style={styles.money}>{prizeifo?.couponInfo?.reduceAmount/100}</Text>
            <Text style={[styles.money,{fontSize:px(20)}]}>元</Text>
            </View>
            <Text style={[styles.mdes,{marginTop: px(6),}]}>满{prizeifo?.couponInfo?.fullAmount/100}减{prizeifo?.couponInfo?.reduceAmount/100}抵用券</Text>
    </View>
    }

            </View>

          </View>
     
</TouchableOpacity>
          {/* 关闭按钮 */}
          {/* <TouchableOpacity
            onPress={onClose}
            style={styles.closeBtn}
          >
            <View style={styles.closeLine} />
          </TouchableOpacity> */}
        </Animated.View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
    mdes:{
  fontFamily: 'MiSans-Medium',
        fontSize:px(14),
        color:'#FFFFFF',
        fontWeight:500,
        lineHeight:px(19),
    },
    money:{
  fontFamily: 'MiSans-Bold',
        fontSize:px(38),
        color:'#FFFFFF',
        //fontWeight:500,
        lineHeight:px(47),
    },
    stitle:{
  fontFamily: 'MiSans-Regular',
        fontSize:px(12),
        color:'#5C4129',
        fontWeight:400,
        lineHeight:px(16),
    },
    title:{
  fontFamily: 'MiSans-Bold',
        fontSize:px(21),
        color:'#FD5A56',
        //fontWeight:500,
        lineHeight:px(28),
    },
  mask: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },

  box: {
    width: '100%',
    height: px(459),
    //backgroundColor: '#fff',
    //borderRadius: 16,
    //paddingVertical: 30,
    alignItems: 'center',
  },

  img: {
    width: px(393),
    height: px(459),
  },

  closeBtn: {
    marginTop: 20,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#eee',
    justifyContent: 'center',
    alignItems: 'center',
  },

  closeLine: {
    width: 18,
    height: 2,
    backgroundColor: '#333',
  },
});