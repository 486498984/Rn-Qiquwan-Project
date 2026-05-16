import { StyleSheet, Text, View,TouchableOpacity,Image,ScrollView,Platform,

 } from 'react-native'
import React,{useState} from 'react'
import { px } from '../../utils/scaleUtils';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import LinearGradient from 'react-native-linear-gradient';
import BottomModal from '../../components/My/BottomModal';
import {
  Radio,
} from '@ant-design/react-native'
import CustomModal from '../../components/My/CustomModal';

const imgMap = {
  0: require('../../../assets/images/my/clock.png'),
  1: require('../../../assets/images/my/newso.png'),
  2: require('../../../assets/images/my/clock.png'),
  3: require('../../../assets/images/my/finish.png'),
};
export default function ShopOrderInfo({navigation,route}) {
          const insets = useSafeAreaInsets();
          const bottomSafeHeight = insets.bottom; // 底部安全区高度（数值）
 const { e } = route.params || {};
 const [type, setType] = useState(0); //订单类型
 const [refund, setRefund] = useState(0); //退款原因
  const [refundsubmode, setRefundsubmode] = useState(1); //退款原因选择   
 const [refundmode, setRefundmode] = useState(1); //退款原因选择    
  const [refundmodal, setRefundmodal] = useState(false); //退款原因弹窗
   const [cannelstatus, setCannelstatus] = useState(false); //取消订单弹窗开关
 const handleback = () => {  //返回上一页
   navigation.goBack();
     };
     const handlegocom = () => {  //点击右边按钮
    if(e==5){  //写评价
        navigation.navigate('Comment')
    }else if(e==2){ //申请退款
setRefundmodal(true)
    }
    };
    const handlerefundmode = (e) => { 
    setRefundmode(e)
     };
  const onGroupChange = (e) => {  //退款原因切换
  console.log(e);
  setRefundmode(e.target.value)
  };
  const handlechoosere = () => {  //退款弹窗确定
setRefundsubmode(refundmode)
setRefundmodal(false)
   };
  return (
    <View style={styles.container}>
      <View style={{width: px(393),height: px(98),backgroundColor: '#fff',
                 flexDirection: 'row',alignItems: 'flex-end',
               }}>
                 <View style={{width: '100%',paddingHorizontal:px(16),marginBottom: px(18),
                   flexDirection: 'row',alignItems: 'center',justifyContent: 'center',
                 }}>
            <TouchableOpacity onPress={handleback} style={{  position: 'absolute',
             left: px(16),}}>
              <Image source={require('../../../assets/images/my/left.png')} 
              style={{width:px(22),height:px(22)}}></Image>
              </TouchableOpacity>
              <Text style={styles.title}>订单详情</Text>
                 </View>
               </View>
<ScrollView style={{paddingHorizontal:px(16),paddingTop:px(16)}}
contentContainerStyle={{paddingBottom:px(110)}} showsVerticalScrollIndicator={false}>
<View style={{flexDirection: 'row',alignItems: 'center',
    justifyContent: 'space-between',
}}>
    <View style={{flexDirection: 'row',alignItems: 'center',gap:px(3)}}>
<Image source={imgMap[e]}
style={{width:px(32),height:px(32)}}></Image>
        {e === 0 ? (
        <Text style={styles.toptitle}>待服务</Text>
        ) : e === 1 ? (
            <Text style={styles.toptitle}>服务中</Text>
        ) : e === 2 ? (
            <Text style={styles.toptitle}>待确认</Text>
        ) : e === 3 ? (
        <Text style={styles.toptitle}>已完成</Text>
        ) : null
        }
 
    </View>
  {e === 0 ? (
  <Text style={styles.righttx}>请及时安排打手...</Text>
) : e === 1 ? (
    <Text style={styles.righttx}>订单进行中...</Text>
) : e === 2 ? (
 <Text style={styles.righttx}>3天后自动确认</Text>
) : e === 3 ? (
 <Text style={styles.righttx}>订单已完成</Text>
) : null
}
</View>
<View style={{width: '100%',backgroundColor: '#fff',borderRadius: px(14),
    paddingHorizontal:px(8),paddingVertical:px(16),marginTop: px(16),
}}>
<View style={{flexDirection: 'row',alignItems: 'center',justifyContent: 'space-between',}}>
 <Text style={styles.clubname}>一个大啦</Text>
    {(e==0||e==1||e==2) &&
       <TouchableOpacity style={{flexDirection: 'row',alignItems: 'center',gap:px(3)}}>
      {/* <Image source={require('../../../assets/images/my/kefu.png')} 
    style={{width:px(16),height:px(16)}}></Image> */}
    <Text style={[styles.yingfu,{color:'#FF9500'}]}>联系客户</Text>
   </TouchableOpacity>
    }

</View>
<View style={{flexDirection: 'row',alignItems: 'center',marginTop: px(16),}}>
<Image source={require('../../../assets/images/home/shop1.png')} 
    style={{width:px(93),height:px(93)}}></Image>
    <View style={{height: px(93),flexDirection: 'column',
        justifyContent: 'space-between',marginLeft: px(8),}}>
<Text style={styles.shopname}>绝密航天清图国服在榜单三大师/单局保底850W</Text>
<View style={{flexDirection: 'column',gap:px(0)}}>
<Text style={styles.shopnames} >带出暗心燃料(魔王双护),暗星燃料x1,保底888w暗星燃料x1,保底888w</Text>

<Text style={styles.shopnames}>数量：1</Text>

</View>
    </View>
</View>
</View>

<View style={{width: '100%',backgroundColor: '#fff',borderRadius: px(14),
    paddingHorizontal:px(8),paddingVertical:px(16),marginTop: px(16),gap:px(16)}}>
<View style={{width: '100%',flexDirection: 'row',alignItems: 'center',justifyContent: 'space-between',}}>
    <Text style={styles.shoppricetx}>商品总价</Text>
      <Text style={styles.shopprice}>￥138</Text>
</View>
<View style={{width: '100%',flexDirection: 'row',alignItems: 'center',justifyContent: 'space-between',}}>
    <Text style={styles.shopdesnames}>优惠</Text>
      <Text style={styles.shopprice}>￥10</Text>
</View>
<View style={{width: '100%',flexDirection: 'row',alignItems: 'center',
    justifyContent: 'flex-end',}}>
<View style={{flexDirection: 'row',alignItems: 'center',gap:px(3)}}>
          <Text style={styles.yingfu}>应付款</Text>
      <Text style={styles.shopprice}>￥128</Text>
</View>
</View>
</View>

<View style={{width: '100%',backgroundColor: '#fff',borderRadius: px(14),
    paddingHorizontal:px(8),paddingVertical:px(16),marginTop: px(16),gap:px(16)}}>
<View style={{width: '100%',flexDirection: 'row',alignItems: 'center',justifyContent: 'space-between',}}>
    <Text style={styles.shoppricetx}>订单信息</Text>
</View>
<View style={{width: '100%',flexDirection: 'row',alignItems: 'center',
    justifyContent: 'space-between',}}>
    <Text style={styles.shopdesnames}>订单编号</Text>
     <View style={{flexDirection: 'row',gap:px(3),alignItems: 'center',
     }}>
     <Text style={styles.yingfu}>219739012479102</Text>
      <Text style={styles.yingfu}>复制</Text>
</View>
</View>
<View style={{width: '100%',flexDirection: 'row',alignItems: 'center',
    justifyContent: 'space-between',}}>
    <Text style={styles.shopdesnames}>支付方式</Text>
      <Text style={styles.yingfu}>微信支付</Text>
</View>
<View style={{width: '100%',flexDirection: 'row',alignItems: 'center',
    justifyContent: 'space-between',}}>
    <Text style={styles.shopdesnames}>下单时间</Text>
      <Text style={styles.yingfu}>2024-05-10 16:22</Text>
</View>
 
    <View style={{width: '100%',flexDirection: 'row',alignItems: 'center',
        justifyContent: 'space-between',}}>
        <Text style={styles.shopdesnames}>支付时间</Text>
        <Text style={styles.yingfu}>2024-05-10 16:22</Text>
    </View>
</View>

<View style={{width: '100%',backgroundColor: '#fff',borderRadius: px(14),
    paddingHorizontal:px(8),paddingVertical:px(16),marginTop: px(16),gap:px(16)}}>
<View style={{width: '100%',flexDirection: 'row',alignItems: 'center',justifyContent: 'space-between',}}>
    <Text style={styles.shoppricetx}>客户信息</Text>
</View>
<View style={{width: '100%',flexDirection: 'row',alignItems: 'center',
    justifyContent: 'space-between',}}>
    <Text style={styles.shopdesnames}>用户ID</Text>
     <View style={{flexDirection: 'row',gap:px(3),alignItems: 'center',
     }}>
     <Text style={styles.yingfu}>53496798</Text>
      <Text style={styles.yingfu}>复制</Text>
</View>
</View>
<View style={{width: '100%',flexDirection: 'row',alignItems: 'center',
    justifyContent: 'space-between',}}>
    <Text style={styles.shopdesnames}>用户名</Text>
      <Text style={styles.yingfu}>伊戈达拉到特勤</Text>
</View>
<View style={{width: '100%',flexDirection: 'row',alignItems: 'center',
    justifyContent: 'space-between',}}>
    <Text style={styles.shopdesnames}>账号</Text>
      <Text style={styles.yingfu}>199****8345</Text>
</View>
</View>



{e>0&&
<View style={{width: '100%',backgroundColor: '#fff',borderRadius: px(14),
    paddingHorizontal:px(8),paddingVertical:px(16),marginTop: px(16),gap:px(16)}}>
<View style={{width: '100%',flexDirection: 'row',alignItems: 'center',justifyContent: 'space-between',}}>
    <Text style={styles.shoppricetx}>上传截图</Text>
</View>
<View style={{width: '100%',flexDirection: 'row',alignItems: 'center',
    justifyContent: 'space-between',}}>
    <Text style={styles.shopdesnames}>上传时间</Text>
      <Text style={styles.yingfu}>2024-05-10 16:22</Text>
</View>
<View style={{flexDirection: 'row',alignItems: 'center',flexWrap: 'wrap',
    gap:px(8),
}}>
<Image source={require('../../../assets/images/home/shop1.png')} 
    style={{width:px(80),height:px(80)}}></Image>
    <Image source={require('../../../assets/images/home/shop1.png')} 
    style={{width:px(80),height:px(80)}}></Image>
       <Image source={require('../../../assets/images/home/shop1.png')} 
    style={{width:px(80),height:px(80)}}></Image>
       <Image source={require('../../../assets/images/home/shop1.png')} 
    style={{width:px(80),height:px(80)}}></Image>
</View>
<View style={{backgroundColor: '#F7F8FC',padding:px(8),borderRadius: px(10),}}>
<Text style={styles.bottomdes}>开始游戏已确认账号相关信息准确无误开始游戏已确认账号相关信息准确无误开始游戏已确认账号相关信息准确无误。</Text>
</View>

</View>
}
{e==1&&
<View style={{width: '100%',backgroundColor: '#fff',borderRadius: px(14),
    paddingHorizontal:px(8),paddingVertical:px(16),marginTop: px(16),gap:px(16)}}>
<View style={{width: '100%',flexDirection: 'row',alignItems: 'center',justifyContent: 'space-between',}}>
    <Text style={styles.shoppricetx}>上传截图</Text>
</View>
<TouchableOpacity style={{width: px(345),height: px(47),backgroundColor: '#F2F3F5',
    borderRadius: px(8),borderWidth: px(1),borderColor: '#FF9500',
    flexDirection: 'row',alignItems: 'center',justifyContent: 'center',
}} onPress={()=>navigation.navigate('ShopScreenshot',{e})}>
<Image source={require('../../../assets/images/my/addshop.png')} 
    style={{width:px(18),height:px(18)}}></Image>
</TouchableOpacity>
</View>
}


{e>0&&
<View style={{width: '100%',backgroundColor: '#fff',borderRadius: px(14),
    paddingHorizontal:px(8),paddingVertical:px(16),marginTop: px(16),gap:px(16)}}>
<View style={{width: '100%',flexDirection: 'row',alignItems: 'center',justifyContent: 'space-between',}}>
    <Text style={styles.shoppricetx}>订单状态</Text>
</View>
<View style={{width: '100%',flexDirection: 'row',alignItems: 'center',
    justifyContent: 'space-between',}}>
    <Text style={styles.shopdesnames}>接单时间</Text>
     <View style={{flexDirection: 'row',gap:px(3),alignItems: 'center',
     }}>
     <Text style={styles.yingfu}>2024-05-10 16:22</Text>
      {/* <Text style={styles.yingfu}>复制</Text> */}
</View>
</View>
<View style={{width: '100%',flexDirection: 'row',alignItems: 'center',
    justifyContent: 'space-between',}}>
    <Text style={styles.shopdesnames}>完成时间</Text>
      <Text style={styles.yingfu}>2024-05-10 16:22</Text>
</View>
<View style={{width: '100%',flexDirection: 'row',alignItems: 'center',
    justifyContent: 'space-between',}}>
    <Text style={styles.shopdesnames}>操作人</Text>
      <Text style={styles.yingfu}>运营刘先生</Text>
</View>
</View>
}

</ScrollView>

    {e<2&& 
<View style={{position: 'absolute',bottom:0,width: '100%',backgroundColor: '#fff',
   flexDirection: 'row',justifyContent: 'center',
}}>
    <View style={{paddingBottom: bottomSafeHeight+(Platform.OS=='ios'?0 :px(8)),
    alignItems: 'center',gap:px(3)}}>
<View style={{flexDirection: 'row',alignItems: 'center',marginTop: px(8),
    gap:px(21)
}}>
{e==0&&
 <TouchableOpacity onPress={()=>setCannelstatus(true)}>
<View style={styles.cannelbox}>
<Text style={styles.canneltx}>取消订单</Text>
</View>
       </TouchableOpacity>
}
{/* {e==1&&
 <TouchableOpacity>
<View style={styles.cannelbox}>
<Text style={styles.canneltx}>取消支付</Text>
</View>
       </TouchableOpacity>
} */}
    {/* {(e<2)&&
    <TouchableOpacity>
    <View style={styles.cannelbox}>
    <Text style={styles.canneltx}>申请售后</Text>
    </View>
        </TouchableOpacity>
    } */}

       <TouchableOpacity onPress={()=>handlegocom()}>
        <LinearGradient
              colors={['#FEC525', '#FC9026']} // 渐变颜色
              start={{ x: 1, y: 0 }}   
              end={{ x: 0, y: 0 }}
              style={[styles.payBox,{width:(e==1)? px(242):px(170),}]}
              >
              <View style={{flexDirection: 'row',alignItems: 'center',}}>
                  {e === 0 ? (
                    <Text style={styles.xiadantx}>接单</Text>
                    ) : e === 1 ? (
                    <Text style={styles.xiadantx}>完成</Text>
                    ) : null
                    }
            
              </View>
              </LinearGradient>
              </TouchableOpacity>
   
     

</View>
</View>
</View>    
}
   <CustomModal visible={cannelstatus} onClose={() => setCannelstatus(false)}
    width={px(323)} isclose={true}> 
       <Text style={styles.destitle}>取消订单</Text>
  <Text style={[styles.canneltxx,{marginTop: px(32)}]}>取消订单前，确保与客户沟通了解后再进行操作</Text>
  <TouchableOpacity
    style={{ marginTop: px(32) }}
    onPress={() => {
      setCannelstatus(false)
    }}
    activeOpacity={0.8}
  >
    {
        // 正常渐变按钮
        <LinearGradient
          colors={['#FEC525', '#FC9026']}
          start={{ x: 1, y: 0 }}
          end={{ x: 0, y: 0 }}
          style={styles.gradientBox}
        >
          <Text style={styles.logintext}>
            确定取消
          </Text>
        </LinearGradient>
    }
  </TouchableOpacity>
     </CustomModal>
    </View>
  )
}

const styles = StyleSheet.create({
        logintext:{
  fontFamily: 'MiSans-Medium',
    fontSize: px(18),
    color: '#FFFFFF',
    lineHeight: px(24),
  },
    gradientBox: {
    width:px(291),
    height: px(48),
    borderRadius: px(30),
    justifyContent: 'center',
    alignItems: 'center',
  },
    canneltxx:{
        textAlign:'center',
fontFamily: 'MiSans-Regular',
        fontSize:px(15),
        color:'#767676',
        fontWeight:400,
        lineHeight:px(26),
    },
            destitle:{
  fontFamily: 'MiSans-Medium',
    fontSize: px(19),
    color: '#1A1A1A',
    lineHeight: px(25),
    },
      zfbname:{
fontFamily: 'MiSans-Regular',
        fontSize:px(14),
        color:'#1A1A1A',
        fontWeight:400,
        lineHeight:px(19),
  },
      choosemodetext:{
fontFamily: 'MiSans-Regular',
        fontSize:px(15),
        color:'#FFFFFF',
        fontWeight:400,
        lineHeight:px(20),
  },
      choosemodeBox: {
    width:px(242),
    height: px(38),
    borderRadius: px(30),
    justifyContent: 'center',
    alignItems: 'center',
  },
      modaltitle:{
  fontFamily: 'MiSans-Medium',
    fontSize: px(16),
    color: '#1A1A1A',
    lineHeight: px(21),
  },
    bottomdes:{
 fontFamily: 'MiSans-Regular',
        fontSize:px(12),
        color:'#1A1A1A',
        fontWeight:400,
        lineHeight:px(16),
    },
            righttx:{
 fontFamily: 'MiSans-Regular',
        fontSize:px(14),
        color:'#AAAAAA',
        fontWeight:400,
        lineHeight:px(19),
    },
        canneltx:{
 fontFamily: 'MiSans-Regular',
        fontSize:px(15),
        color:'#AAAAAA',
        fontWeight:400,
        lineHeight:px(20),
    },
    cannelbox:{
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        width: px(170),
        height: px(38),
        borderRadius: px(30),
        borderWidth: px(1),
        borderColor: '#D8D8D8',
    },
            xiadantx:{
      fontFamily: 'MiSans-Regular',
        fontSize:px(15),
        color:'#FFFFFF',
        //fontWeight:500,
        lineHeight:px(20),
    },
            payBox:{
      //marginTop: px(8),
  width: px(170),
  height: px(38),
  borderRadius: px(30),
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'center',
    },
        yingfu:{
 fontFamily: 'MiSans-Regular',
        fontSize:px(12),
        color:'#1A1A1A',
        fontWeight:400,
        lineHeight:px(16),
    },
    shopprice:{
 fontFamily: 'MiSans-Bold',
        fontSize:px(14),
        color:'#1A1A1A',
        //fontWeight:500,
        lineHeight:px(19),
    },
    shoppricetx:{
 fontFamily: 'MiSans-Medium',
        fontSize:px(14),
        color:'#000000',
        //fontWeight:500,
        lineHeight:px(19),
    },
    shopdestx:{
 fontFamily: 'MiSans-Regular',
        fontSize:px(11),
        color:'#FF9500',
        fontWeight:400,
        lineHeight:px(15),
    },
        shopdesnames:{
 fontFamily: 'MiSans-Regular',
        fontSize:px(12),
        color:'#AAAAAA',
        fontWeight:400,
        lineHeight:px(16),
    },
    shopnames:{
        width: px(244),
 fontFamily: 'MiSans-Regular',
        fontSize:px(12),
        color:'#AAAAAA',
        fontWeight:400,
        lineHeight:px(16),
    },
    shopname:{
        width: px(244),
 fontFamily: 'MiSans-Medium',
        fontSize:px(16),
        color:'#1A1A1A',
        //fontWeight:500,
        lineHeight:px(21),
    },
    clubname:{
 fontFamily: 'MiSans-Medium',
        fontSize:px(14),
        color:'#000000',
        //fontWeight:500,
        lineHeight:px(19),
    },
    toptitle:{
  fontFamily: 'MiSans-Medium',
        fontSize:px(24),
        color:'#000000',
        //fontWeight:500,
        lineHeight:px(32),
    },
          title:{
  fontFamily: 'MiSans-Medium',
        fontSize:px(16),
        color:'#1A1A1A',
        //fontWeight:500,
        lineHeight:px(21),
  },
    container:{
        flex: 1,
        backgroundColor: '#F2F3F5',
    }
})