import { StyleSheet, Text, View,Image,ScrollView,TouchableOpacity} from 'react-native'
import React from 'react'
import { px } from '../../utils/scaleUtils';
import LinearGradient from 'react-native-linear-gradient';
import RewardOrder from '../../components/My/RewardOrder'




const orderlist1=[{type:1},{type:1},{type:1},{type:1},{type:1},{type:1}] //待入账
export default function Asset({ navigation }) {
     const handleback = () => {  //返回上一页
    navigation.goBack();
     };
  return (
    <View style={styles.container}>

      <Image source={require('../../../assets/images/my/myback.png')} 
           style={{width: '100%',height:px(295),position: 'absolute',}}></Image>

<View style={{marginTop: px(0),position: 'absolute',
    width:'100%',height: px(88),flexDirection: 'row',alignItems: 'flex-end',
}}>
    <View style={{alignItems: 'center',justifyContent: 'center',
        width: '100%',paddingBottom:px(0)
    }}>
  <TouchableOpacity style={{position: 'absolute',left:px(16)}}
  onPress={()=>handleback()}>
   <Image source={require('../../../assets/images/my/wleft.png')} 
   style={{width:px(22),height:px(22),}}></Image>
   </TouchableOpacity>
<Text style={styles.title}>我的资产</Text>
    </View>

</View>
<ScrollView style={{marginTop: px(100),}} showsVerticalScrollIndicator={false}
contentContainerStyle={{paddingBottom:px(38)}}>
    <View style={{width: '100%',flexDirection: 'row',
        alignItems: 'center',justifyContent: 'space-between',
    }}>
<View style={{flexDirection: 'row',alignItems: 'flex-end',marginLeft: px(16),
    gap:px(8)
}}>
       <Image source={require('../../../assets/images/my/defultavtar.png')} 
   style={{width:px(30),height:px(30),borderRadius: px(15),}}></Image>
<Text style={styles.nikename}>Cougar Liu</Text>
</View>
<TouchableOpacity style={{height: px(29),backgroundColor: 'rgba(0, 0, 0,0.3)',
    borderBottomLeftRadius: px(15),borderTopLeftRadius: px(15),
    flexDirection: 'row',alignItems: 'center',gap:px(2),paddingRight:px(8)
}} onPress={()=>navigation.navigate('Invite')}>
    <Image source={require('../../../assets/images/my/share.png')} 
   style={{width:px(20),height:px(20),marginLeft: px(8),}}></Image>
   <Text style={styles.sharetx}>邀请好友</Text>
</TouchableOpacity>
    </View>

<View style={{width: '100%',paddingHorizontal:px(16),flexDirection: 'column',
    alignItems: 'center',marginTop: px(12),
}}>
<View style={{width: px(361),height: px(106),backgroundColor: '#fff',
    borderRadius: px(12),flexDirection: 'row',alignItems: 'center',
    justifyContent: 'space-between',paddingHorizontal:px(16)
}}>
    <View style={{flexDirection: 'column',alignItems: 'flex-start',gap:px(3)}}>
<Text style={styles.firtitle}>累计佣金(元)</Text>
<Text style={styles.firmoney}>2689.56</Text>
    </View>

    <View style={{flexDirection: 'column',alignItems: 'flex-start',gap:px(3)}}>
<Text style={styles.firtitle}>下单总数</Text>
<Text style={styles.firmoney}>630</Text>
    </View>
    <TouchableOpacity style={{flexDirection: 'column',alignItems: 'flex-start',gap:px(3)}}
    onPress={()=>navigation.navigate('Register')}>
        <View style={{flexDirection: 'row',alignItems: 'center',}}>
  <Text style={styles.firtitle}>注册用户</Text>
  <Image source={require('../../../assets/images/my/cright.png')} 
   style={{width:px(20),height:px(20)}}></Image>
        </View>
<Text style={styles.firmoney}>43</Text>
    </TouchableOpacity>
</View>

<View style={{width: px(361),height: px(216),backgroundColor: '#fff',
    borderRadius: px(12),flexDirection: 'column',paddingVertical:px(20),
    justifyContent: 'space-between',paddingHorizontal:px(16),marginTop: px(12),
}}>
    <View>
  <View style={{flexDirection: 'row',alignItems: 'flex-start',
    justifyContent: 'space-between',}}>
   <TouchableOpacity style={{flexDirection: 'column',alignItems: 'flex-start',gap:px(5)}}
   onPress={()=>navigation.navigate('InviteOrder',{type:1})}>
        <View style={{flexDirection: 'row',alignItems: 'center',}}>
  <Text style={styles.firtitle}>可提现(元)</Text>
  <Image source={require('../../../assets/images/my/cright.png')} 
   style={{width:px(20),height:px(20)}}></Image>
        </View>
<Text style={styles.midmoney}>905.99</Text>
    </TouchableOpacity>
 <TouchableOpacity style={{flexDirection: 'row',alignItems: 'center',}}
 onPress={()=>navigation.navigate('Details')}>
  <Text style={styles.firtitle}>资产明细</Text>
  <Image source={require('../../../assets/images/my/cright.png')} 
   style={{width:px(20),height:px(20)}}></Image>
        </TouchableOpacity>
  </View>
<View style={{width: '100%',flexDirection: 'row',alignItems: 'center',
    justifyContent: 'space-between',marginTop: px(18),
}}>
   <TouchableOpacity style={{flexDirection: 'column',alignItems: 'flex-start',gap:px(2)}}
   onPress={()=>navigation.navigate('InviteOrder',{type:2})}>
        <View style={{flexDirection: 'row',alignItems: 'center',}}>
  <Text style={styles.firtitle}>待入账(元)</Text>
  <Image source={require('../../../assets/images/my/cright.png')} 
   style={{width:px(20),height:px(20)}}></Image>
        </View>
<Text style={styles.midmoney}>39.59</Text>
    </TouchableOpacity>
       <TouchableOpacity style={{flexDirection: 'column',alignItems: 'flex-start',gap:px(2)}}
     onPress={()=>navigation.navigate('Withdraw')}>
        <View style={{flexDirection: 'row',alignItems: 'center',}}>
  <Text style={styles.firtitle}>提现中(元)</Text>
  <Image source={require('../../../assets/images/my/cright.png')} 
   style={{width:px(20),height:px(20)}}></Image>
        </View>
<Text style={styles.midmoney}>0.00</Text>
    </TouchableOpacity>
       <TouchableOpacity style={{flexDirection: 'column',alignItems: 'flex-start',gap:px(2)}}
        onPress={()=>navigation.navigate('Withdraw')}>
        <View style={{flexDirection: 'row',alignItems: 'center',}}>
  <Text style={styles.firtitle}>已提现(元)</Text>
  <Image source={require('../../../assets/images/my/cright.png')} 
   style={{width:px(20),height:px(20)}}></Image>
        </View>
<Text style={styles.midmoney}>269.00</Text>
    </TouchableOpacity>
</View>
</View>

<TouchableOpacity style={{width: '100%',flexDirection: 'row',alignItems: 'center',
    justifyContent: 'center',
}} onPress={()=>navigation.navigate('Cashout')}>
         <LinearGradient
            colors={['#FEC525', '#FC9026']}
            start={{ x: 1, y: 0 }}
            end={{ x: 0, y: 0 }}
            style={styles.gradientBox}
          >
            <Text style={styles.logintext}>
              立即提现
            </Text>
          </LinearGradient>
</TouchableOpacity>
</View>

<View style={{paddingHorizontal:px(0),marginTop: px(16),width: '100%',}}>
<View style={{width: '100%',flexDirection:'row',justifyContent: 'flex-start',}}>
<Text style={styles.ordertitle}>最近订单</Text>
</View>
    {orderlist1.map((item,index)=>
        <View key={index}>
        <RewardOrder item={item}/>
        </View>
    )}




</View>
</View>



</ScrollView>

    </View>
  )
}

const styles = StyleSheet.create({
    ordertitle:{
  fontFamily: 'MiSans-Medium',
    fontSize: px(17),
    color: '#1A1A1A',
    lineHeight: px(23),
    },
        logintext:{
  fontFamily: 'MiSans-Medium',
    fontSize: px(18),
    color: '#FFFFFF',
    lineHeight: px(24),
  },
 gradientBox: {
    width:px(311),
    height: px(48),
    borderRadius: px(30),
    justifyContent: 'center',
    alignItems: 'center',
  },
    midmoney:{
  fontFamily: 'MiSans-Medium',
        fontSize:px(19),
        color:'#1A1A1A',
        //fontWeight:'400',
        lineHeight:px(25),
    },
    firmoney:{
    fontFamily: 'MiSans-Medium',
        fontSize:px(26),
        color:'#1A1A1A',
        //fontWeight:'400',
        lineHeight:px(34),
    },
    firtitle:{
 fontFamily: 'MiSans-Regular',
        fontSize:px(14),
        color:'#767676',
        fontWeight:400,
        lineHeight:px(19),
    },
    sharetx:{
 fontFamily: 'MiSans-Regular',
        fontSize:px(14),
        color:'#fff',
        fontWeight:400,
        lineHeight:px(19),
    },
    nikename:{
        marginBottom: px(4),
    fontFamily: 'MiSans-Medium',
        fontSize:px(15),
        color:'#fff',
        //fontWeight:'400',
        lineHeight:px(20),
    },
    title:{
        textAlign: 'center',
       fontFamily: 'MiSans-Medium',
        fontSize:px(16),
        color:'#fff',
        //fontWeight:'400',
        lineHeight:px(21),
    },
      container:{
    flex: 1,
    backgroundColor: '#F2F3F5',
  }
})