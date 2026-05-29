import { StyleSheet, Text, View,TouchableOpacity,Image,Linking,
    
 } from 'react-native'
import React,{useState} from 'react'
import { px } from '../../utils/scaleUtils';
import LinearGradient from 'react-native-linear-gradient';


export default function Join({navigation}) {
      const [mode, setMode] = useState(true); //1为俱乐部入驻
      const handleback = () => {  //返回上一页
     navigation.goBack();
     };
const openWechatLink = async () => {
  const url = 'https://work.weixin.qq.com/ca/cawcdea2c4e121224f';

  try {
    await Linking.openURL(url);
  } catch (e) {
    console.log('无法打开链接', e);
  }
};
  return (
    <View style={styles.container}>
           <LinearGradient
                        colors={['#FFFFFF','#FEC525', '#FC9026']} // 渐变颜色
                        start={{ x: 0, y: 1 }}   
                        end={{ x: 0, y: 0 }}
                        style={styles.gradientBox}
                      >
                      </LinearGradient>
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
           <Text style={styles.title}>入驻申请</Text>
              </View>
            </View>
<View style={{marginTop: px(16),flexDirection: 'row',alignItems: 'center',
    marginLeft: px(64),
}}>
 <Text style={styles.midtitle}>柒趣玩电竞</Text>
 <View style={{height: px(18),width: px(1),backgroundColor: '#fff',
    marginLeft: px(6),
 }}></View>
  <Text style={[styles.midtx,{marginLeft: px(12),}]}>合作共赢，共创未来~</Text>
</View>
<View style={{width: '100%',flexDirection: 'row',alignItems: 'center',
    justifyContent: 'center',marginTop: px(16),}}>
<View style={{width: px(360),backgroundColor: '#fff',
    borderRadius: px(14),alignItems: 'center',paddingBottom:px(24)
}}>
<View style={{width: '100%',flexDirection: 'row',alignItems: 'center',
  
}}>
     <TouchableOpacity onPress={() => setMode(true)} activeOpacity={1}>
    <View style={{backgroundColor:mode? '#DECAAE':'#fff', 
    borderTopLeftRadius: px(14),}}>

    <View style={{width: px(180),borderTopRightRadius:mode? px(14):0,
    borderBottomRightRadius:mode? 0:px(14),
    borderTopLeftRadius: px(14),flexDirection: 'row',alignItems: 'center',
    justifyContent: 'center',
    backgroundColor:mode?'#fff':'#DECAAE',height: px(53),}}>
<Text style={mode?styles.joinclub:styles.joinpople}>俱乐部入驻</Text>
    </View>
    
    </View>
</TouchableOpacity>
     <TouchableOpacity onPress={() => setMode(false)} activeOpacity={1}>
   <View style={{backgroundColor:mode? '#fff':'#DECAAE',
    borderTopRightRadius: px(14),}}>
     <View style={{width: px(180),borderBottomLeftRadius:mode? px(14):0,
     borderTopLeftRadius: mode?0:px(14),
     borderTopRightRadius: px(14),flexDirection: 'row',alignItems: 'center',
    justifyContent: 'center',
        backgroundColor:mode? '#DECAAE':'#fff',height: px(53),}}>
<Text style={mode?styles.joinpople:styles.joinclub}>个人入驻</Text>
    </View>
    </View>
    </TouchableOpacity>
</View>
<View style={{width: px(327),height: px(52),flexDirection: 'row',alignItems: 'center',
justifyContent: 'space-between',paddingHorizontal:px(18),
    backgroundColor: 'rgba(255, 149, 0, 0.10)',marginTop: px(18),borderRadius: px(8),}}>
<View style={{flexDirection: 'column',alignItems: 'center',gap:px(1)}}> 
    <View style={{flexDirection: 'row',alignItems: 'center',gap:px(2)}}>
<Image source={require('../../../assets/images/my/joinok.png')} 
style={{width:px(9),height:px(9)}}></Image>
<Text style={styles.topone}>增长快</Text>
    </View>
<Text  style={styles.toptwo}>超多用户使用</Text>
</View>

<View style={{flexDirection: 'column',alignItems: 'center',gap:px(1)}}> 
    <View style={{flexDirection: 'row',alignItems: 'center',gap:px(2)}}>
<Image source={require('../../../assets/images/my/joinok.png')} 
style={{width:px(9),height:px(9)}}></Image>
<Text style={styles.topone}>{mode?'新商家':'新打手'}</Text>
    </View>
<Text  style={styles.toptwo}>平台全面扶持</Text>
</View>

<View style={{flexDirection: 'column',alignItems: 'center',gap:px(1)}}> 
    <View style={{flexDirection: 'row',alignItems: 'center',gap:px(2)}}>
<Image source={require('../../../assets/images/my/joinok.png')} 
style={{width:px(9),height:px(9)}}></Image>
<Text style={styles.topone}>多订单</Text>
    </View>
<Text  style={styles.toptwo}>日均订单上千+</Text>
</View>
</View>
<View style={{width: '100%',flexDirection: 'row',alignItems: 'center',
    justifyContent: 'center',marginTop: px(18),gap:px(3)
}}>
<Text style={styles.midtxtitle}>{mode?'新俱乐部':'个人'}入驻权益</Text>
 <LinearGradient
colors={['#FCF5E3', '#FDD888']} // 渐变颜色
start={{ x: 0, y: 0 }}   
end={{ x: 1, y: 0 }}
style={styles.smallBox}
>
<Text style={styles.limittime}>限时</Text>
</LinearGradient>
</View>
<View style={{flexDirection:'column',paddingHorizontal:px(35),
    marginTop: px(18),
}}>
    <View style={{flexDirection: 'row',alignItems: 'center',
        justifyContent: 'space-between',width: '100%',}}>
<View style={{flexDirection: 'column',alignItems: 'center',gap:px(5)}}>
   <Image source={require('../../../assets/images/my/join1.png')} 
           style={{width:px(52),height:px(52)}}></Image>
           <Text style={styles.smalldes}>0元入驻</Text>
</View>
<View style={{flexDirection: 'column',alignItems: 'center',gap:px(5)}}>
   <Image source={require('../../../assets/images/my/join2.png')} 
           style={{width:px(52),height:px(52)}}></Image>
           <Text style={styles.smalldes}>流量扶持</Text>
</View>
<View style={{flexDirection: 'column',alignItems: 'center',gap:px(5)}}>
   <Image source={require('../../../assets/images/my/join3.png')} 
           style={{width:px(52),height:px(52)}}></Image>
           <Text style={styles.smalldes}>技术支持</Text>
</View>
    </View>

    <View style={{flexDirection: 'row',alignItems: 'center',marginTop: px(16),
        justifyContent: 'space-between',width: '100%',}}>
<View style={{flexDirection: 'column',alignItems: 'center',gap:px(5)}}>
   <Image source={require('../../../assets/images/my/join4.png')} 
           style={{width:px(52),height:px(52)}}></Image>
           <Text style={styles.smalldes}>免费工具</Text>
</View>
<View style={{flexDirection: 'column',alignItems: 'center',gap:px(5)}}>
   <Image source={require('../../../assets/images/my/join5.png')} 
           style={{width:px(52),height:px(52)}}></Image>
           <Text style={styles.smalldes}>专属指导</Text>
</View>
<View style={{flexDirection: 'column',alignItems: 'center',gap:px(5)}}>
   <Image source={require('../../../assets/images/my/join6.png')} 
           style={{width:px(52),height:px(52)}}></Image>
           <Text style={styles.smalldes}>更多权益</Text>
</View>
    </View>

</View>


</View>
</View>
<TouchableOpacity style={{flexDirection: 'row',alignItems: 'center',justifyContent: 'center',
    marginTop: px(18),
}} onPress={openWechatLink}>
  <LinearGradient
                colors={['#FEC525', '#FC9026']} // 渐变颜色
                start={{ x: 1, y: 0 }}   
                end={{ x: 0, y: 0 }}
                style={styles.bogradientBox}
              >
                  <View style={{flexDirection: 'row',alignItems: 'center',}}>
                <Text style={styles.logintext}>前往咨询</Text>
                </View>
              </LinearGradient>
</TouchableOpacity>


    </View>
  )
}

const styles = StyleSheet.create({
    smalldes:{
 fontFamily: 'MiSans-Regular',
        fontSize:px(11),
        color:'#1A1A1A',
        fontWeight:400,
        lineHeight:px(13),
    },
    logintext:{
  fontFamily: 'MiSans-Medium',
        fontSize:px(18),
        color:'#FFFFFF',
        //fontWeight:500,
        lineHeight:px(24),
    },
    bogradientBox:{
width: px(327),
height: px(48),
borderRadius: px(30),
flexDirection: 'row',
alignItems: 'center',
justifyContent: 'center',
    },
    limittime:{
 fontFamily: 'MiSans-Regular',
        fontSize:px(12),
        color:'#6E4200',
        fontWeight:400,
        lineHeight:px(16),
    },
    midtxtitle:{
 fontFamily: 'MiSans-Regular',
        fontSize:px(18),
        color:'#1A1A1A',
        fontWeight:400,
        lineHeight:px(24),
    },
    smallBox:{
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: px(4),
width: px(34),
height: px(22),
    },
    toptwo:{
 fontFamily: 'MiSans-Regular',
        fontSize:px(11),
        color:'rgba(255, 149, 0,0.7)',
        fontWeight:400,
        lineHeight:px(15),
    },
    topone:{
  fontFamily: 'MiSans-Medium',
        fontSize:px(12),
        color:'#FF9500',
        //fontWeight:500,
        lineHeight:px(16),
    },
    joinpople:{
  fontFamily: 'MiSans-Medium',
        fontSize:px(16),
        color:'#5D3E2E',
        //fontWeight:500,
        lineHeight:px(21),
    },
    joinclub:{
  fontFamily: 'MiSans-Medium',
        fontSize:px(16),
        color:'#FF9500',
        //fontWeight:500,
        lineHeight:px(21),
    },
    midtx:{
 fontFamily: 'MiSans-Regular',
        fontSize:px(15),
        color:'rgba(255, 255, 255,0.8)',
        fontWeight:400,
        lineHeight:px(20),
    },
gradientBox: {
    width:px(393),
    height: px(852),
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
  },
    midtitle:{
  fontFamily: 'MiSans-Medium',
        fontSize:px(18),
        color:'#FFFFFF',
        //fontWeight:500,
        lineHeight:px(24),
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