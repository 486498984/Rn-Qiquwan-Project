import { StyleSheet, Text, View,TouchableOpacity, } from 'react-native'
import React from 'react'
import { px } from '../../../utils/scaleUtils';
import Clipboard from '@react-native-clipboard/clipboard';
import { Toast } from '@ant-design/react-native'


const PrizeItem=(({item})=> {
    const isCoupon = item.prizeType === 'COUPON';
const isUsed = item.verifiedAt != null;

const statusConfig = isUsed
  ? {
      text: '已使用',
      color: '#52C41A',
      bg: '#EDFBE7',
    }
  : isCoupon
  ? {
      text: '已发放',
      color: '#1677FF',
      bg: '#E8F3FF',
    }
  : {
      text: '待使用',
      color: '#FF9500',
      bg: '#FFF4DE',
    };
  return (
    <View>
        <View style={{flexDirection: 'row',alignItems: 'center',
            justifyContent: 'space-between',marginTop: px(16),
        }}>
    <Text style={styles.title}>{item?.prizeName}</Text>
 <View
  style={{
    width: px(52),
    height: px(23),
    backgroundColor: statusConfig.bg,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: px(6),
  }}
  >
  <Text
    style={[
      styles.waituse,
      { color: statusConfig.color },
    ]}
  >
    {statusConfig.text}
  </Text>
</View>
        </View>
  
    <View style={{flexDirection: 'row',alignItems: 'center',
            justifyContent: 'space-between',marginTop: px(12),
        }}>
  <Text style={styles.creatime}>{item?.updatedAt}</Text>

<View style={{flexDirection: 'row',alignItems: 'center',}}>
  <Text style={styles.creatime}>券码</Text>
  <Text style={styles.code}>{item?.code}</Text>
  <TouchableOpacity
  onPress={() => {
    Clipboard.setString(item?.code || '');
     Toast.info({content:'已复制',mask:false,duration:2});
  }}
 >
  <Text style={[styles.creatime,{marginLeft: px(3),}]}>复制</Text>
  </TouchableOpacity>
  </View>
        </View>
<View style={{width: '100%',height: px(1),marginTop: px(16),
    backgroundColor: 'rgba(118, 118, 118, 0.2)',}}></View>
    </View>
  )
})
export default React.memo(PrizeItem);
const styles = StyleSheet.create({
    title:{
 fontFamily: 'MiSans-Regular',
        fontSize:px(17),
        color:'#1A1A1A',
        fontWeight:400,
        lineHeight:px(23),
    },
    code:{
 fontFamily: 'MiSans-Regular',
        fontSize:px(12),
        color:'#1A1A1A',
        fontWeight:400,
        lineHeight:px(16),
    },
    creatime:{
    fontFamily: 'MiSans-Regular',
        fontSize:px(12),
        color:'#AAAAAA',
        fontWeight:400,
        lineHeight:px(16),
    },
waituse:{
      fontFamily: 'MiSans-Regular',
        fontSize:px(12),
        color:'#FF9500',
        fontWeight:400,
        lineHeight:px(16),
}
})