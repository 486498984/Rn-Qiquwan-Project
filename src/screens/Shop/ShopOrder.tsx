import { StyleSheet, Text, View,TouchableOpacity,Image,ScrollView,
Animated,
 } from 'react-native'
import React,{useState,useEffect} from 'react'
import { px } from '../../utils/scaleUtils';
import {
  Button,
  Icon,
  List,
  Provider,
  Toast,
  Tooltip,
} from '@ant-design/react-native'
import OrderItem from './components/OrderItem';


export default function ShopOrder({navigation,route}) {
  const { type } = route.params || {}; //1为今日订单 2为全部订单
  const actions = [
    {
    key: 'wait',
    text: <Text style={styles.tooltx}>待入账</Text>,
  },
    {
    key: 'return',
    text: <Text style={styles.tooltx}>已退款</Text>,
  },
      { 
    key: 'all',
    text: <Text style={styles.tooltx}>全部</Text>,
  },
]
 const actionst = [
     {
    key: 'ok',
    text: <Text style={styles.tooltx}>可提现</Text>,
  },
    {
    key: 'wait',
    text: <Text style={styles.tooltx}>待入账</Text>,
  },
    {
    key: 'return',
    text: <Text style={styles.tooltx}>已退款</Text>,
  },
      { 
    key: 'all',
    text: <Text style={styles.tooltx}>全部</Text>,
  },
]
  useEffect(() => {
  if(type==1){
  setActionsse(actions)
  }else{
  setActionsse(actionst)
  }
  }, [type])
 const [actionsse, setActionsse] = useState(actions);
 const [rttext, setRttext] = useState('全部'); //右上角文字
 const rotateAnim = useState(new Animated.Value(0))[0]
const [open, setOpen] = useState(false)
 const handleback = () => {  //返回上一页
   navigation.goBack();
  };
const toggleRotate = () => {
  Animated.timing(rotateAnim, {
    toValue: open ? 0 : 1,
    duration: 200,
    useNativeDriver: true,
  }).start()

  setOpen(!open)
}
const rotate = rotateAnim.interpolate({
  inputRange: [0, 1],
  outputRange: ['0deg', '180deg'],
})
  console.log(type);
  const handlenode = (e) => {  //切换右上角
  console.log(e.text.props.children);
  setRttext(e.text.props.children)
  }
  const a= {
    orderNo:123,
    expectedDate:'2026-5-28',
    amount:100,
    goodsTitle:'高级陪玩服务'
  } 
  return (
    <View style={styles.container}>
         <View style={{width: px(393),height: px(98),backgroundColor: '#fff',
        flexDirection: 'row',alignItems: 'flex-end',
      }}>
        <View style={{width: '100%',paddingHorizontal:px(16),marginBottom: px(18),
          flexDirection: 'row',alignItems: 'center',justifyContent: 'center',
        }}>
    <TouchableOpacity onPress={handleback}  style={{  position: 'absolute',
    left: px(16),}}>
      <Image source={require('../../../assets/images/my/left.png')} 
      style={{width:px(22),height:px(22)}}></Image>
      </TouchableOpacity>
      <Text style={styles.title}>{type==1?'今日订单':'全部订单'}</Text>

         <Tooltip.Menu
            actions={actionsse}
            placement="bottom-end"
            crossOffset={{ top: 0, left: 0 }}
            onVisibleChange={(e)=>toggleRotate()}
            onAction={(node) => handlenode(node)
          }
            trigger="onPress"
       >
      <TouchableOpacity   style={{  position: 'absolute',
      right: px(16),flexDirection: 'row',alignItems: 'center',height:px(35),
      }}>
        <Text style={styles.alltx}>{rttext}</Text>
        <Animated.Image
        source={require('../../../assets/images/my/select.png')}
        style={{
          width: px(17),
          height: px(17),
          transform: [{ rotate }],
        }}
        />
      </TouchableOpacity>
          </Tooltip.Menu>
        </View>
      </View>

  <ScrollView contentContainerStyle={{flexDirection: 'column',
    alignItems: 'center',gap:px(8),paddingBottom:px(50)}}>
      <View style={{height: px(8),}}></View>
    {[0,1,2,3,4,5,6,7,8,9,10].map((item,index)=>
    <View key={index}>
        <OrderItem item={a}></OrderItem>
    </View>
    )}

  </ScrollView>



    </View>
  )
}

const styles = StyleSheet.create({
  tooltx:{
fontFamily: 'MiSans-Regular',
        fontSize:px(13),
        color:'#1A1A1A',
        fontWeight:400,
        lineHeight:px(17),
  },
  alltx:{
fontFamily: 'MiSans-Regular',
        fontSize:px(13),
        color:'#1A1A1A',
        fontWeight:400,
        lineHeight:px(17),
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
        backgroundColor: '#F7F8FC',
    }
})