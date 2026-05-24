import { StyleSheet, Text, View,Image} from 'react-native'
import React from 'react'
import { px } from '../../utils/scaleUtils';
import LinearGradient from 'react-native-linear-gradient';

const RewardOrder=({item})=> {
  return (
    <View style={{width: px(361),height: px(127),backgroundColor: '#fff',
        borderRadius: px(12),marginTop: px(16),paddingHorizontal:px(16),
        paddingVertical:px(14)
    }}>
    <View style={{width: '100%',alignItems: 'center',justifyContent: 'space-between',
    flexDirection: 'row',
    }}>
  <Text style={styles.ordercode}>订单编号：{item?.orderNo}</Text>
  <View style={{flexDirection: 'row',alignItems: 'center',gap:px(8)}}>

  <View style={{width: px(42),height: px(16),backgroundColor:item.type==1?'#FEF7E0':'#DEFFE5',
    borderRadius: px(4),flexDirection: 'row',alignItems: 'center',justifyContent: 'center',}}>
<Text style={[styles.waittx,{color: item.type==1?'#FF9500':'#3CF15F'}]}>{item.type==1?'待入账':'可提现'}</Text>
  </View>
  </View>
   </View>
    <View style={{marginTop: px(16),}}>
    <Text style={styles.ordertitle}
    numberOfLines={1}>{item?.goodsTitle}</Text>
    </View>
    <View style={{width: px(329),height: px(1),backgroundColor: 'rgba(118, 118, 118,0.2)',
        marginTop: px(10),
    }}></View>
<View style={{marginTop: px(10),flexDirection: 'row',alignItems: 'center',
    justifyContent: 'space-between',
}}>
<View style={{width: px(114),height: px(26),}}>
  <LinearGradient
          colors={['rgba(222, 84, 82, 0)', 'rgba(222, 84, 82, 0.2)']}
          start={{ x: 1, y: 0 }}
          end={{ x: 0, y: 0 }}
          style={[styles.gradientBox]}
        >
             <Image source={require('../../../assets/images/my/ogift.png')} 
                style={{width:px(16),height:px(16),marginLeft: px(6),}}></Image>
          <Text style={[styles.gifttx,{marginLeft: px(3),}]}>奖励:</Text>
           <Text style={styles.gifttx}>￥{item?.commission/100}</Text>
        </LinearGradient>
</View>
<View style={{flexDirection: 'row',alignItems: 'center',}}>
    <Text style={styles.ordercode}>{item?.createdAt}  </Text>
<Text style={styles.ordercode}>实付:</Text>
<Text style={styles.orderprice}>￥{item?.amount/100}</Text>
</View>


</View>

    </View>
  )
}
export default React.memo(RewardOrder);
const styles = StyleSheet.create({
    orderprice:{
    fontFamily: 'MiSans-Medium',
        fontSize:px(12),
        color:'#1A1A1A',
        //fontWeight:'400',
        lineHeight:px(16),
    },
    gifttx:{
    fontFamily: 'MiSans-Medium',
        fontSize:px(12),
        color:'#DE5452',
        //fontWeight:'400',
        lineHeight:px(16),
    },
   gradientBox: {
    width:px(114),
    height: px(26),
    borderRadius: px(4),
    flexDirection: 'row',
    alignItems: 'center',
  },
    ordertitle:{
        width: px(329),
    fontFamily: 'MiSans-Medium',
        fontSize:px(13),
        color:'#1A1A1A',
        //fontWeight:'400',
        lineHeight:px(17),
    },
    waittx:{
       fontFamily: 'MiSans-Regular',
        fontSize:px(10),
        lineHeight:px(13),
        color:'#FF9500',
        fontWeight:400,
    },
ordercode:{
       fontFamily: 'MiSans-Regular',
        fontSize:px(12),
        lineHeight:px(16),
        color:'#767676',
        fontWeight:400,
}
})