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


const imgMap = {
  0: require('../../../assets/images/my/cannelo.png'),
  1: require('../../../assets/images/my/clock.png'),
  2: require('../../../assets/images/my/clock.png'),
  3: require('../../../assets/images/my/newso.png'),
  4: require('../../../assets/images/my/clock.png'),
  5: require('../../../assets/images/my/clock.png'),
  6: require('../../../assets/images/my/finish.png'),
};
export default function OrderInfo({navigation,route}) {
          const insets = useSafeAreaInsets();
          const bottomSafeHeight = insets.bottom; // 底部安全区高度（数值）
 const { e } = route.params || {};
 const [type, setType] = useState(0); //订单类型
 const [refund, setRefund] = useState(0); //退款原因
  const [refundsubmode, setRefundsubmode] = useState(1); //退款原因选择   
 const [refundmode, setRefundmode] = useState(1); //退款原因选择    
  const [refundmodal, setRefundmodal] = useState(false); //退款原因弹窗
  
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
        <Text style={styles.toptitle}>已取消</Text>
        ) : e === 1 ? (
            <Text style={styles.toptitle}>待付款</Text>
        ) : e === 2 ? (
            <Text style={styles.toptitle}>待服务</Text>
        ) : e === 3 ? (
        <Text style={styles.toptitle}>服务中</Text>
        ) : e === 4 ? (
        <Text style={styles.toptitle}>待收货</Text>
        ) :  e === 5 ? (
        <Text style={styles.toptitle}>待评价</Text>
        ) : e === 6 ? (
        <Text style={styles.toptitle}>已完成</Text>
        ) : null
        }
 
    </View>
  {e === 1 ? (
  <Text style={styles.righttx}>29分钟后自动取消</Text>
) : e === 2 ? (
    <Text style={styles.righttx}>俱乐部安排打手中...</Text>
) : e === 3 ? (
 <Text style={styles.righttx}>打手正在服务中...</Text>
) : e === 4 ? (
 <Text style={styles.righttx}>7天后自动收货</Text>
) :  e === 5 ? (
 <Text style={styles.righttx}>3天后自动完成</Text>
) :  e === 6 ? (
 <Text style={styles.righttx}>订单已完成</Text>
) : null
}
</View>
<View style={{width: '100%',backgroundColor: '#fff',borderRadius: px(14),
    paddingHorizontal:px(8),paddingVertical:px(16),marginTop: px(16),
}}>
<View style={{flexDirection: 'row',alignItems: 'center',justifyContent: 'space-between',}}>
    <View style={{flexDirection: 'row',alignItems: 'center',gap:px(3)}}>
 <Text style={styles.clubname}>东东电竞俱乐部</Text>
    <Image source={require('../../../assets/images/my/right.png')} 
    style={{width:px(19),height:px(19)}}></Image>
    </View>
    {(e==1||e==2||e==3) &&
       <TouchableOpacity style={{flexDirection: 'row',alignItems: 'center',gap:px(3)}}>
      <Image source={require('../../../assets/images/my/kefu.png')} 
    style={{width:px(16),height:px(16)}}></Image>
    <Text style={styles.yingfu}>客服</Text>
   </TouchableOpacity>
    }

</View>
<View style={{flexDirection: 'row',alignItems: 'center',marginTop: px(16),}}>
<Image source={require('../../../assets/images/home/shop1.png')} 
    style={{width:px(93),height:px(93)}}></Image>
    <View style={{height: px(93),flexDirection: 'column',
        justifyContent: 'space-between',marginLeft: px(8),}}>
<Text style={styles.shopname}>绝密航天清图国服在榜单三大师/单局保底850W</Text>
<View style={{flexDirection: 'column',gap:px(8)}}>
<Text style={styles.shopnames} numberOfLines={1}>带出暗心燃料(魔王双护),暗星燃料x1,保底888w暗星燃料x1,保底888w</Text>
<View style={{flexDirection: 'row',alignItems: 'center',gap:px(3)}}>
<View style={{backgroundColor: '#FEF7E0',paddingHorizontal:px(4),
    paddingVertical:px(2),borderRadius: px(4),flexDirection: 'row',
    alignItems: 'center',justifyContent: 'center',}}>
<Text style={styles.shopdestx}>炸单包赔</Text>
</View>
<View style={{backgroundColor: '#FEF7E0',paddingHorizontal:px(4),
    paddingVertical:px(2),borderRadius: px(4),flexDirection: 'row',
    alignItems: 'center',justifyContent: 'center',}}>
<Text style={styles.shopdestx}>急速接单</Text>
</View>
<View style={{backgroundColor: '#FEF7E0',paddingHorizontal:px(4),
    paddingVertical:px(2),borderRadius: px(4),flexDirection: 'row',
    alignItems: 'center',justifyContent: 'center',}}>
<Text style={styles.shopdestx}>自营</Text>
</View>
</View>
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
    {e!==0&&e!==1&&
    <View style={{width: '100%',flexDirection: 'row',alignItems: 'center',
        justifyContent: 'space-between',}}>
        <Text style={styles.shopdesnames}>支付时间</Text>
        <Text style={styles.yingfu}>2024-05-10 16:22</Text>
    </View>
    }
    {(e==5||e==6)&&
    <View style={{width: '100%',flexDirection: 'row',alignItems: 'center',
        justifyContent: 'space-between',}}>
        <Text style={styles.shopdesnames}>完成时间</Text>
        <Text style={styles.yingfu}>2024-05-10 16:22</Text>
    </View>
    }

</View>

{e>2&&
<View style={{width: '100%',backgroundColor: '#fff',borderRadius: px(14),
    paddingHorizontal:px(8),paddingVertical:px(16),marginTop: px(16),gap:px(16)}}>
<View style={{width: '100%',flexDirection: 'row',alignItems: 'center',justifyContent: 'space-between',}}>
    <Text style={styles.shoppricetx}>游戏截图</Text>
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


</ScrollView>

    {e!==3&&
<View style={{position: 'absolute',bottom:0,width: '100%',backgroundColor: '#fff',
   flexDirection: 'row',justifyContent: 'center',
}}>
    <View style={{paddingBottom: bottomSafeHeight+(Platform.OS=='ios'?0 :px(8)),
    alignItems: 'center',gap:px(3)}}>
<View style={{flexDirection: 'row',alignItems: 'center',marginTop: px(8),
    gap:px(21)
}}>
{e==0&&
 <TouchableOpacity>
<View style={styles.cannelbox}>
<Text style={styles.canneltx}>删除订单</Text>
</View>
       </TouchableOpacity>
}
{e==1&&
 <TouchableOpacity>
<View style={styles.cannelbox}>
<Text style={styles.canneltx}>取消支付</Text>
</View>
       </TouchableOpacity>
}
    {(e==4||e==6)&&
    <TouchableOpacity>
    <View style={styles.cannelbox}>
    <Text style={styles.canneltx}>申请售后</Text>
    </View>
        </TouchableOpacity>
    }

       <TouchableOpacity onPress={()=>handlegocom()}>
        <LinearGradient
              colors={['#FEC525', '#FC9026']} // 渐变颜色
              start={{ x: 1, y: 0 }}   
              end={{ x: 0, y: 0 }}
              style={[styles.payBox,{width:(e==2||e==5)? px(242):px(170),}]}
              >
              <View style={{flexDirection: 'row',alignItems: 'center',}}>
                  {e === 0 ? (
                    <Text style={styles.xiadantx}>再次购买</Text>
                    ) : e === 1 ? (
                    <Text style={styles.xiadantx}>继续支付</Text>
                    ) : e === 2 ? (
                    <Text style={styles.xiadantx}>申请退款</Text>
                    ) :   e === 4 ? (
                    <Text style={styles.xiadantx}>确认完成</Text>
                    ) :  e === 5 ? (
                    <Text style={styles.xiadantx}>写评价</Text>
                    ) :  e === 6 ? (
                    <Text style={styles.xiadantx}>删除订单</Text>
                    ) : null
                    }
            
              </View>
              </LinearGradient>
              </TouchableOpacity>
   
     

</View>
</View>
</View>    
}
        <BottomModal
        visible={refundmodal}
        onClose={() => setRefundmodal(false)}
      >
        <View style={{ padding: px(16)}}>
          <View style={{width: '100%',flexDirection: 'row',alignItems: 'center',
            justifyContent: 'center',
          }}>
  <Text style={styles.modaltitle}>退款原因</Text>
  <TouchableOpacity style={{position: 'absolute',right:0}}
  onPress={()=>setRefundmodal(false)}>
     <Image source={require('../../../assets/images/my/close.png')} 
        style={{width:px(16),height:px(16)}}></Image>
  </TouchableOpacity>
          </View>
          <Radio.Group
            onChange={onGroupChange}
            value={refundmode}
           >  
        <TouchableOpacity style={{width: '100%',flexDirection: 'row',alignItems: 'center',
          justifyContent: 'space-between',paddingVertical: px(18),
        }} onPress={()=>handlerefundmode(1)}>
    <Text style={styles.zfbname}>买多了/买错了</Text>
 <Radio value={1}></Radio>
        </TouchableOpacity>
<View style={{width: '100%',height: px(1),
  backgroundColor: 'rgba(118, 118, 118, 0.2)',marginTop: px(0),}}></View>
   <TouchableOpacity style={{width: '100%',flexDirection: 'row',alignItems: 'center',
          justifyContent: 'space-between',paddingVertical: px(16),
        }} onPress={()=>handlerefundmode(2)}>
          <Text style={styles.zfbname}>长时间未安排打手</Text>
    <Radio value={2}></Radio>
        </TouchableOpacity>
        <View style={{width: '100%',height: px(1),
  backgroundColor: 'rgba(118, 118, 118, 0.2)',marginTop: px(0),}}></View>
   <TouchableOpacity style={{width: '100%',flexDirection: 'row',alignItems: 'center',
          justifyContent: 'space-between',paddingVertical: px(16),
        }} onPress={()=>handlerefundmode(3)}>
          <Text style={styles.zfbname}>客服态度不好</Text>
    <Radio value={3}></Radio>
        </TouchableOpacity>
               <View style={{width: '100%',height: px(1),
  backgroundColor: 'rgba(118, 118, 118, 0.2)',marginTop: px(0),}}></View>
   <TouchableOpacity style={{width: '100%',flexDirection: 'row',alignItems: 'center',
          justifyContent: 'space-between',paddingVertical: px(16),
        }} onPress={()=>handlerefundmode(4)}>
          <Text style={styles.zfbname}>其它</Text>
    <Radio value={4}></Radio>
        </TouchableOpacity>
          </Radio.Group>
<View style={{width: '100%',flexDirection: 'row',alignItems: 'center',
  justifyContent: 'center',marginTop: px(21),}}>
    <TouchableOpacity onPress={()=>handlechoosere()}>
    <LinearGradient
        colors={['#FEC525', '#FC9026']}
        start={{ x: 1, y: 0 }}
        end={{ x: 0, y: 0 }}
        style={styles.choosemodeBox}
      >
        <Text style={styles.choosemodetext}>
          确定
        </Text>
      </LinearGradient>
      </TouchableOpacity>
</View>


        </View>
      </BottomModal>

    </View>
  )
}

const styles = StyleSheet.create({
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