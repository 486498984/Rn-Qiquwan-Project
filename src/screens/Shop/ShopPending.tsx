import { StyleSheet, Text, View,Animated,TouchableOpacity,Image, } from 'react-native'
import React,{useRef,} from 'react'
import { px } from '../../utils/scaleUtils';
import OrderItem from './components/OrderItem';


export default function ShopPending({navigation,route}) {
      const { type } = route.params || {}; //1为今日订单 2为全部订单
    const [isDark, setIsDark] = React.useState(false);
   const handleback = () => {  //返回上一页
   navigation.goBack();
     };
const scrollY = useRef(new Animated.Value(0)).current;
  const headerBackgroundColor = scrollY.interpolate({
    inputRange: [0, 150], // 0 到 150 像素滚动范围
    outputRange: [
      'rgba(255, 255, 255, 0)', // 起始：完全透明
      'rgba(255, 255, 255, 1)', // 结束：完全不透明
    ],
    extrapolate: 'clamp', // 限制范围
  });
const titleColor = scrollY.interpolate({
  inputRange: [0, 150],
  outputRange: [
    'rgba(255,255,255,1)', // 初始白色
    'rgba(26, 26, 26, 1)'        // 滑动后黑色
  ],
  extrapolate: 'clamp',
});
const orderlist=[
    {type:type,title:'123'},
    {type:type,title:'123'},
    {type:type,title:'123'},
    {type:type,title:'123'},
    {type:type,title:'123'},
    {type:type,title:'123'},
    {type:type,title:'123'},
]
  return (
    <View style={styles.container}>
             <Animated.View style={{flexDirection: 'row',alignItems: 'flex-end',paddingHorizontal:px(18),backgroundColor: headerBackgroundColor,
          position: 'absolute',height: px(98),width: '100%',top:0,zIndex: 1,}}>
            <View style={{width: '100%',flexDirection: 'row',alignItems: 'center',justifyContent: 'center',marginBottom: px(19),}}>
                     <TouchableOpacity onPress={handleback} style={{  position: 'absolute',
                      left: px(0),}}>
            <Image
  source={
    isDark
      ? require('../../../assets/images/my/left.png')   // 黑色返回按钮
      : require('../../../assets/images/my/wleft.png') // 白色返回按钮
  }
  style={{ width: px(22), height: px(22) }}
/>
                       </TouchableOpacity>
         <Animated.Text style={[styles.title, { color: titleColor }]}>
  {type==1?'待入账':'已退款'}
</Animated.Text>
           <View style={{flexDirection: 'row',alignItems: 'center',}}>
           </View>
           </View>
      </Animated.View>
   <Image source={require('../../../assets/images/my/shoppending.png')} 
   style={{width:'100%',height:px(389),position: 'absolute',top:0}}></Image>

         <Animated.ScrollView bounces={false} showsVerticalScrollIndicator={false} 
       onScroll={Animated.event(
                [{ nativeEvent: { contentOffset: { y: scrollY } } }],
                { useNativeDriver: false,
                     listener: (e) => {
      const y = e.nativeEvent.contentOffset.y;
      setIsDark(y > 100); // 滑动超过100就切换 
    },
                 } // ⚠️颜色动画不能用原生驱动
              )}
              contentContainerStyle={{paddingBottom:px(50)}}>

<View style={{marginTop: px(106),alignItems: 'center',}}>
    <View style={{flexDirection: 'row',alignItems: 'center',width: '100%',
        justifyContent: 'center',}}>
<View style={{width: '50%',flexDirection: 'column',alignItems: 'center',}}>
    <Text style={styles.toptitle}>{type==1?'待入账':'已退款'}(元)</Text>
      <Text style={styles.topprice}>1,124.41</Text>
</View>
<View style={{width: px(1),height: px(36),backgroundColor: '#FFFFFF',}}></View>
<View style={{width: '50%',flexDirection: 'column',alignItems: 'center',}}>
    <Text style={styles.toptitle}>{type==1?'待入账':'已退款'}订单</Text>
     <Text style={styles.topprice}>14</Text>
</View>
    </View>
    <View style={{gap:px(8),marginTop: px(26),}}>
  {orderlist.map((item,index)=>
       <View key={index}>
           <OrderItem item={item}></OrderItem>
       </View>
       )}
    </View>
   
</View>

              </Animated.ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
    topprice:{
    fontFamily: 'MiSans-Medium',
    lineHeight:px(50),
    fontSize:px(38),
    color:'#FFFFFF',
    },
    toptitle:{
fontFamily: 'MiSans-Regular',
        fontSize:px(12),
        color:'#FFFFFF',
        fontWeight:400,
        lineHeight:px(16),
    },
      title:{
    fontFamily: 'MiSans-Medium',
    lineHeight:px(21),
    fontSize:px(16),
    color:'#FFFFFF',
    //fontWeight:400,
  },
container:{
    flex: 1,
    backgroundColor: '#F7F8FC',
}
})