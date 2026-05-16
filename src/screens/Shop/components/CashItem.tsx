import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { px } from '../../../utils/scaleUtils';

const STATUS_MAP = {
  pending: {
    text: '审核中',
    bg: '#FEF7E0',
    color: '#FF9500',
    pricolor:'#FF9500',
  },
  success: {
    text: '已打款',
    bg: '#DEFFE5',
    color: '#3CF15F',
    pricolor:'#1A1A1A',
  },
  fail: {
    text: '审核失败',
    bg: '#FCDEDE',
    color: '#DE5452',
    pricolor:'#DE5452',
  },
};
const CashItem=({item={status:'success'}})=> {
const status = STATUS_MAP[item.status] || STATUS_MAP.pending;



  return (
    <View style={{width: '100%',backgroundColor: '#fff',
        paddingHorizontal:px(16),paddingTop:px(16)
    }}>
    <View style={{flexDirection: 'row',justifyContent: 'space-between',
        alignItems: 'flex-start',
    }}>
     <Text style={styles.title}>提现</Text>
     <View style={[styles.okstatus,{backgroundColor:status.bg,}]}>
     <Text style={[styles.statustx,{color:status.color}]}>{status.text}</Text>
     </View>
    </View>
 <View style={{flexDirection: 'row',justifyContent: 'space-between',marginTop: px(12),
    alignItems: 'flex-end',
 }}>
   <Text style={styles.time}>2026-10-12 10:39</Text>
  <Text style={[styles.price,{color:status.pricolor}]}>-83.00</Text>
 </View>
<View style={{width: px(361),height: px(1),backgroundColor: 'rgba(118, 118, 118, 0.2)',
    marginTop: px(12),
}}></View>
    </View>
  )
}
export default React.memo(CashItem);
const styles = StyleSheet.create({
    price:{
  fontFamily: 'MiSans-Medium',
        fontSize:px(20),
        color:'#FF9500',
        //fontWeight:500,
        lineHeight:px(27),
    },
    time:{
fontFamily: 'MiSans-Regular',
        fontSize:px(12),
        color:'#AAAAAA',
        fontWeight:400,
        lineHeight:px(16),
    },
    title:{
fontFamily: 'MiSans-Regular',
        fontSize:px(17),
        color:'#1A1A1A',
        fontWeight:400,
        lineHeight:px(23),
    },
    statustx:{
fontFamily: 'MiSans-Regular',
        fontSize:px(10),
        color:'#FF9500',
        fontWeight:400,
        lineHeight:px(13),
    },
okstatus:{
    //width: px(42),
    paddingHorizontal:px(6),
    paddingVertical:px(2),
    //height: px(16),
    backgroundColor: '#FEF7E0',
    borderRadius: px(4),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
}

})