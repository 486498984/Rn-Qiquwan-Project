import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Image,StyleSheet, } from 'react-native';
import { px } from '../../utils/scaleUtils';
import LinearGradient from 'react-native-linear-gradient';
import { Radio } from '@ant-design/react-native';
import BottomModal from '../My/BottomModal';

const Line=()=>{
    return (
    <View style={{width: px(361),height: px(1),
    backgroundColor: 'rgba(118, 118, 118,0.2)',}}/>
    )
}
type OptionItem = {
  label: string;
  value: number;
};

type Props = {
  visible: boolean;
  onClose: () => void;
  data: OptionItem[];
  value: number;
  onConfirm: (val: number) => void;
  title?: string;
};
export default function TextRadioModal({
  visible,
  onClose,
  data = [], // [{label:'支付宝', value:1}]
  value,
  onConfirm,
  title = '请选择',
 } : Props) {
  const [tempValue, setTempValue] = useState(value);

  useEffect(() => {
    if (visible) {
    setTempValue(value);
  }
  }, [visible,value]);

  return (
    <BottomModal visible={visible} onClose={onClose}>
      <View style={{ paddingVertical:px(16),paddingLeft:px(16) }}>

        {/* 标题 */}
        <View style={{
          flexDirection: 'row',
          justifyContent: 'center',
          alignItems: 'center'
        }}>
          <Text style={styles.modaltitle}>
            {title}
          </Text>

          <TouchableOpacity
            style={{ position: 'absolute', right:0,
            width:px(62),height:px(35),flexDirection: 'row',alignItems: 'center',
            justifyContent: 'flex-end',paddingRight:px(16)
             }}
            onPress={onClose}
          >
              <Image source={require('../../../assets/images/my/close.png')} 
                 style={{width:px(16),height:px(16)}}></Image>
          </TouchableOpacity>
        </View>

        {/* 单选列表 */}
        <Radio.Group
          value={tempValue}
          onChange={(e) => setTempValue(e.target.value)}
        >
          {data.map((item, index) => (
            <View key={item.value}>
              <TouchableOpacity
              activeOpacity={1}
              onPress={() => setTempValue(item.value)}
              style={{
                height: px(51),
                //backgroundColor: 'red',
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginTop: px(0),
              }}
            >
              {/* 左边纯文字 */}
              <Text style={styles.zfbname}>
                {item.label}
              </Text>

              {/* 右边单选 */}
              <Radio value={item.value} />
            </TouchableOpacity>
            {index!==data.length-1&&
              <Line></Line>
            }
            </View>
          ))}
        </Radio.Group>

        {/* 确定按钮 */}
        <View style={{
          alignItems: 'center',
          marginTop: px(12)
        }}>
          <TouchableOpacity
            onPress={() => onConfirm(tempValue)}
          >
            <LinearGradient
              colors={['#FEC525', '#FC9026']}
              start={{ x: 1, y: 0 }}
              end={{ x: 0, y: 0 }}
              style={{
                width: px(240),
                height: px(38),
                borderRadius: px(30),
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <Text style={styles.subtext}>
                确定
              </Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>

      </View>
    </BottomModal>
  );
}
const styles = StyleSheet.create({
    subtext:{
        fontFamily: 'MiSans-Regular',
        fontSize:px(15),
        color:'#FFFFFF',
        fontWeight:400,
        lineHeight:px(20),
    },
      zfbname:{
 fontFamily: 'MiSans-Regular',
        fontSize:px(14),
        color:'#1A1A1A',
        fontWeight:400,
        lineHeight:px(19),
  },
  modaltitle:{
  fontFamily: 'MiSans-Medium',
    fontSize: px(16),
    color: '#1A1A1A',
    lineHeight: px(21),
  },


})