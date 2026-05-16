import { StyleSheet, Text, View,Image,TouchableOpacity } from 'react-native'
import React from 'react'
import { px } from '../../utils/scaleUtils';
import LinearGradient from 'react-native-linear-gradient';

const OrderItem=({item,navigation})=> {


    const handlegoinfo = (e) => { //进入详情
    console.log(e);
    navigation.navigate('ShopOrderInfo',{e})
    };
    const cannelorder = (e) => {  //取消订单
    console.log(e);

     };
  return (
    <View style={styles.container}>
        {item.type==0&&
        <TouchableOpacity style={{width: px(361),height: px(206),
        backgroundColor: '#fff',borderRadius: px(14),padding:px(8)}}
        onPress={()=>handlegoinfo(0)} activeOpacity={1}>
<View style={{width: '100%',flexDirection: 'row',
    alignItems: 'center',justifyContent: 'space-between',}}>
  
<Text style={styles.clubname}>一个大啦</Text>
     
<Text style={styles.waittime}>待服务</Text>
</View>
<View style={{flexDirection: 'row',alignItems: 'center',marginTop: px(8),}}>
  <View style={styles.shopimgbox}>
       <Image source={require('../../../assets/images/home/shop1.png')} 
                    style={{width:px(120),height:px(120),}}></Image>
{item.types==1&&
    <Image source={require('../../../assets/images/home/type/protect.png')} 
    style={{width:px(57),height:px(23),position: 'absolute',
    bottom:0,left:0
    }}></Image>
}
{item.types==2&&
    <Image source={require('../../../assets/images/home/type/ace.png')} 
    style={{width:px(57),height:px(23),position: 'absolute',
    bottom:0,left:0
    }}></Image>
}
{item.types==3&&
    <Image source={require('../../../assets/images/home/type/task.png')} 
    style={{width:px(57),height:px(23),position: 'absolute',
    bottom:0,left:0
    }}></Image>
}
{item.types==4&&
    <Image source={require('../../../assets/images/home/type/knife.png')} 
    style={{width:px(57),height:px(23),position: 'absolute',
    bottom:0,left:0
    }}></Image>
}
</View>
<View style={{flexDirection: 'column',justifyContent: 'space-between',
    height: px(120),marginLeft: px(3),}}>
<Text style={styles.ordername}>绝密航天清图国服在榜单三大师/单局保底850W</Text>
<View style={{gap:px(6)}}>
<Text style={styles.ordertime}>下单时间：2024-05-10 16:22</Text>
<Text style={styles.ordertime}>订单编号：219739012479102</Text>
<View style={{width: px(222),flexDirection: 'row',alignItems: 'center',
    justifyContent: 'space-between',
}}>
<Text style={styles.ordertime}>数量：1</Text>
<Text style={styles.orderprice}>￥138</Text>
</View>
</View>

</View>
</View>
<View style={{width: '100%',flexDirection: 'row',alignItems: 'center',
    justifyContent: 'flex-end',marginTop: px(13),gap:px(6)}}>
          <TouchableOpacity style={styles.cannelbox} onPress={()=>
    cannelorder(item)}>
<Text style={styles.canneltext}>联系客户</Text>
  </TouchableOpacity>
  <TouchableOpacity style={styles.cannelbox} onPress={()=>
    cannelorder(item)}>
<Text style={styles.canneltext}>取消订单</Text>
  </TouchableOpacity>
  <TouchableOpacity>
     <LinearGradient
          colors={['#FEC525', '#FC9026']}
          start={{ x: 1, y: 0 }}
          end={{ x: 0, y: 0 }}
          style={[styles.gradientBox]}
        >
          <Text style={styles.logintext}>
            接单
          </Text>
        </LinearGradient>
  </TouchableOpacity>
</View>
     </TouchableOpacity>
        }
         {item.type==1&&
        <TouchableOpacity style={{width: px(361),height: px(206),
        backgroundColor: '#fff',borderRadius: px(14),padding:px(8)}}
        onPress={()=>handlegoinfo(1)} activeOpacity={1}>
<View style={{width: '100%',flexDirection: 'row',
    alignItems: 'center',justifyContent: 'space-between',}}>
<Text style={styles.clubname}>不渡</Text>
<Text style={styles.waittime}>服务中</Text>
</View>
<View style={{flexDirection: 'row',alignItems: 'center',marginTop: px(8),}}>
  <View style={styles.shopimgbox}>
       <Image source={require('../../../assets/images/home/shop1.png')} 
                    style={{width:px(120),height:px(120),}}></Image>
{item.types==1&&
    <Image source={require('../../../assets/images/home/type/protect.png')} 
    style={{width:px(57),height:px(23),position: 'absolute',
    bottom:0,left:0
    }}></Image>
}
{item.types==2&&
    <Image source={require('../../../assets/images/home/type/ace.png')} 
    style={{width:px(57),height:px(23),position: 'absolute',
    bottom:0,left:0
    }}></Image>
}
{item.types==3&&
    <Image source={require('../../../assets/images/home/type/task.png')} 
    style={{width:px(57),height:px(23),position: 'absolute',
    bottom:0,left:0
    }}></Image>
}
{item.types==4&&
    <Image source={require('../../../assets/images/home/type/knife.png')} 
    style={{width:px(57),height:px(23),position: 'absolute',
    bottom:0,left:0
    }}></Image>
}
</View>
<View style={{flexDirection: 'column',justifyContent: 'space-between',
    height: px(120),marginLeft: px(3),}}>
<Text style={styles.ordername}>绝密航天清图国服在榜单三大师/单局保底850W</Text>
<View style={{gap:px(6)}}>
<Text style={styles.ordertime}>下单时间：2024-05-10 16:22</Text>
<Text style={styles.ordertime}>订单编号：219739012479102</Text>
<View style={{width: px(222),flexDirection: 'row',alignItems: 'center',
    justifyContent: 'space-between',
}}>
<Text style={styles.ordertime}>数量：1</Text>
<Text style={styles.orderprice}>￥138</Text>
</View>
</View>

</View>
</View>
<View style={{width: '100%',flexDirection: 'row',alignItems: 'center',
    justifyContent: 'flex-end',marginTop: px(13),gap:px(6)}}>
          <TouchableOpacity style={styles.cannelbox} onPress={()=>
    cannelorder(item)}>
<Text style={styles.canneltext}>联系客户</Text>
  </TouchableOpacity>
  <TouchableOpacity>
     <LinearGradient
          colors={['#FEC525', '#FC9026']}
          start={{ x: 1, y: 0 }}
          end={{ x: 0, y: 0 }}
          style={[styles.gradientBox]}
        >
          <Text style={styles.logintext}>
            完成
          </Text>
        </LinearGradient>
  </TouchableOpacity>
</View>
     </TouchableOpacity>
        }
     {item.type==2&&
        <TouchableOpacity style={{width: px(361),height: px(206),
        backgroundColor: '#fff',borderRadius: px(14),padding:px(8)}}
        onPress={()=>handlegoinfo(2)} activeOpacity={1}>
<View style={{width: '100%',flexDirection: 'row',
    alignItems: 'center',justifyContent: 'space-between',}}>
<Text style={styles.clubname}>往旧</Text>
<Text style={[styles.waittime,{color:'#AAAAAA'}]}>等待用户确认，剩余3天</Text>
</View>
<View style={{flexDirection: 'row',alignItems: 'center',marginTop: px(8),}}>
  <View style={styles.shopimgbox}>
       <Image source={require('../../../assets/images/home/shop1.png')} 
                    style={{width:px(120),height:px(120),}}></Image>
{item.types==1&&
    <Image source={require('../../../assets/images/home/type/protect.png')} 
    style={{width:px(57),height:px(23),position: 'absolute',
    bottom:0,left:0
    }}></Image>
}
{item.types==2&&
    <Image source={require('../../../assets/images/home/type/ace.png')} 
    style={{width:px(57),height:px(23),position: 'absolute',
    bottom:0,left:0
    }}></Image>
}
{item.types==3&&
    <Image source={require('../../../assets/images/home/type/task.png')} 
    style={{width:px(57),height:px(23),position: 'absolute',
    bottom:0,left:0
    }}></Image>
}
{item.types==4&&
    <Image source={require('../../../assets/images/home/type/knife.png')} 
    style={{width:px(57),height:px(23),position: 'absolute',
    bottom:0,left:0
    }}></Image>
}
</View>
<View style={{flexDirection: 'column',justifyContent: 'space-between',
    height: px(120),marginLeft: px(3),}}>
<Text style={styles.ordername}>绝密航天清图国服在榜单三大师/单局保底850W</Text>
<View style={{gap:px(6)}}>
<Text style={styles.ordertime}>下单时间：2024-05-10 16:22</Text>
<Text style={styles.ordertime}>订单编号：219739012479102</Text>
<View style={{width: px(222),flexDirection: 'row',alignItems: 'center',
    justifyContent: 'space-between',
}}>
<Text style={styles.ordertime}>数量：1</Text>
<Text style={styles.orderprice}>￥138</Text>
</View>
</View>

</View>
</View>
<View style={{width: '100%',flexDirection: 'row',alignItems: 'center',
    justifyContent: 'flex-end',marginTop: px(13),gap:px(6)}}>
          <TouchableOpacity style={styles.cannelbox} onPress={()=>
    cannelorder(item)}>
<Text style={styles.canneltext}>联系客户</Text>
  </TouchableOpacity>

</View>
     </TouchableOpacity>
        }
    {item.type==3&&
        <TouchableOpacity style={{width: px(361),paddingVertical:px(8),
        backgroundColor: '#fff',borderRadius: px(14),padding:px(8)}}
        onPress={()=>handlegoinfo(3)} activeOpacity={1}>
<View style={{width: '100%',flexDirection: 'row',
    alignItems: 'center',justifyContent: 'space-between',}}>
<Text style={styles.clubname}>测试用户</Text>
<Text style={[styles.waittime,{color:'#AAAAAA'}]}>已完成</Text>
</View>
<View style={{flexDirection: 'row',alignItems: 'center',marginTop: px(8),}}>
  <View style={styles.shopimgbox}>
       <Image source={require('../../../assets/images/home/shop1.png')} 
                    style={{width:px(120),height:px(120),}}></Image>
{item.types==1&&
    <Image source={require('../../../assets/images/home/type/protect.png')} 
    style={{width:px(57),height:px(23),position: 'absolute',
    bottom:0,left:0
    }}></Image>
}
{item.types==2&&
    <Image source={require('../../../assets/images/home/type/ace.png')} 
    style={{width:px(57),height:px(23),position: 'absolute',
    bottom:0,left:0
    }}></Image>
}
{item.types==3&&
    <Image source={require('../../../assets/images/home/type/task.png')} 
    style={{width:px(57),height:px(23),position: 'absolute',
    bottom:0,left:0
    }}></Image>
}
{item.types==4&&
    <Image source={require('../../../assets/images/home/type/knife.png')} 
    style={{width:px(57),height:px(23),position: 'absolute',
    bottom:0,left:0
    }}></Image>
}
</View>
<View style={{flexDirection: 'column',justifyContent: 'space-between',
    height: px(120),marginLeft: px(3),}}>
<Text style={styles.ordername}>绝密航天清图国服在榜单三大师/单局保底850W</Text>
<View style={{gap:px(6)}}>
<Text style={styles.ordertime}>下单时间：2024-05-10 16:22</Text>
<Text style={styles.ordertime}>订单编号：219739012479102</Text>
<View style={{width: px(222),flexDirection: 'row',alignItems: 'center',
    justifyContent: 'space-between',
}}>
<Text style={styles.ordertime}>数量：1</Text>
<Text style={styles.orderprice}>￥138</Text>
</View>
</View>

</View>
</View>

     </TouchableOpacity>
        }


    </View>
  )
}
export default React.memo(OrderItem);
const styles = StyleSheet.create({
      logintext:{
  fontFamily: 'MiSans-Medium',
    fontSize: px(14),
    color: '#FFFFFF',
    lineHeight: px(18),
  },
            gradientBox: {
    width:px(108),
    height: px(30),
    borderRadius: px(15),
    justifyContent: 'center',
    alignItems: 'center',
  },
    canneltext:{
  fontFamily: 'MiSans-Regular',
        fontSize:px(14),
        lineHeight:px(18),
        color:'#1A1A1A',
        fontWeight:400,
    },
    cannelbox:{
width: px(108),
height: px(30),
borderRadius: px(15),
borderWidth: px(1),
borderColor: '#D8D8D8',
flexDirection: 'row',
justifyContent: 'center',
alignItems: 'center',
    },
    orderprice:{
 fontFamily: 'MiSans-Medium',
        fontSize:px(12),
        color:'#DE5452',
        //fontWeight:'400',
        lineHeight:px(17),
    },
    ordertime:{
  fontFamily: 'MiSans-Regular',
        fontSize:px(12),
        lineHeight:px(16),
        color:'#AAAAAA',
        fontWeight:400,
    },
    ordername:{
        width: px(222),
 fontFamily: 'MiSans-Medium',
        fontSize:px(16),
        color:'#1A1A1A',
        //fontWeight:'400',
        lineHeight:px(21),
    },
        shopimgbox:{
        width: px(120),
        height: px(120),
position: 'relative',
    },
    waittime:{
     fontFamily: 'MiSans-Regular',
        lineHeight:px(16),
        fontSize:px(12),
        color:'#FF9500',
        fontWeight:400,
    },
    clubname:{
    fontFamily: 'MiSans-Medium',
        fontSize:px(14),
        color:'#000000',
        //fontWeight:'400',
        lineHeight:px(19),
    },
container:{
    //marginTop: px(12),
    flex:1,
}
})