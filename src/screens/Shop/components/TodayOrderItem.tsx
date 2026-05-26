import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { px } from '../../../utils/scaleUtils';



const TodayOrderItem=({item})=> {
    const STATUS_MAP = {
  1: {
    text: '待入账',
 boxStyle: {
      backgroundColor: '#FEF7E0',
    },
    textStyle: { color: '#FF9500' },
  },
  2: {
    text: '已退款',
 boxStyle: {
      backgroundColor: '#FFDADA',
    },
    textStyle: { color: '#FF3B30' },
  },
  3: {
    text: '可提现',
    boxStyle: {
      backgroundColor: '#DEFFE5',
    },
    textStyle: { color: '#3CF15F' },
  },
}
const status =  STATUS_MAP[1];
  return (
    <View style={{width:px(361),height: px(127),backgroundColor: '#fff',
        borderRadius: px(8),paddingHorizontal:px(16)
    }}>
    <View style={{width: '100%',flexDirection: 'row',alignItems: 'center',
        justifyContent: 'space-between',marginTop: px(14),
    }}>
<Text style={styles.ordernum}>订单编号：{item.orderNo}</Text>
<View style={{flexDirection: 'row',alignItems: 'center',gap:px(8)}}>
{/* <Text style={styles.ordernum}>2026-10-12 10:39</Text> */}
    <View style={[styles.lrbox, status.boxStyle]}>
<Text style={[styles.ordes, status.textStyle]}>{item.orderStatusText}</Text>
</View>
</View>
    </View>
     {/* <Text style={styles.ordernum}>2026-10-12 10:39</Text> */}
<View style={{width: '100%',marginTop: px(16),flexDirection: 'row',
    alignItems: 'center',
}}>
<Text style={styles.ordertitle}
numberOfLines={1}>{item?.goodsTitle}</Text>
</View>
<View style={{width: '100%',height: px(1),
    backgroundColor: 'rgba(118, 118, 118, 0.2)',marginTop: px(10),}}></View>
    <View style={{width: '100%',flexDirection: 'row',alignItems: 'center',
        justifyContent: 'space-between',marginTop: px(15),
    }}>
<Text style={styles.ordernum}>下单时间：{item?.createdAt}</Text>
<View style={{flexDirection: 'row',alignItems: 'center',}}>
<Text style={styles.ordernum}>实付:</Text>
<Text style={styles.smallprice}>￥{item?.payAmount/100}</Text>
</View>
    </View>
    </View>
  )
}
export default React.memo(TodayOrderItem);
const styles = StyleSheet.create({
        tuilrbox:{
    width: px(42),
    height: px(16),
    backgroundColor: '#FFDADA',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: px(4),
    },
    lrbox:{
    //width: px(42),
    paddingHorizontal:px(6),
    paddingVertical:px(2),
    //height: px(16),
    backgroundColor: '#FEF7E0',
    flexDirection: 'row',
    alignItems: 'center',
    //justifyContent: 'center',
    borderRadius: px(4),
    },
    smallprice:{
  fontFamily: 'MiSans-Medium',
        fontSize:px(12),
        color:'#1A1A1A',
        //fontWeight:500,
        lineHeight:px(16),
    },
    ordertitle:{
  fontFamily: 'MiSans-Medium',
        fontSize:px(13),
        color:'#1A1A1A',
        //fontWeight:500,
        lineHeight:px(17),
    },
    ordes:{
fontFamily: 'MiSans-Regular',
        fontSize:px(10),
        color:'#FF9500',
        fontWeight:400,
        lineHeight:px(13),
    },
ordernum:{
fontFamily: 'MiSans-Regular',
        fontSize:px(12),
        color:'#767676',
        fontWeight:400,
        lineHeight:px(16),
},
})