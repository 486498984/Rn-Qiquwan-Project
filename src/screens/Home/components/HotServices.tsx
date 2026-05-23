import { StyleSheet, Text, View,Image,TouchableOpacity,Animated, } from 'react-native'
import React,{useEffect,useRef} from 'react'
import { px } from '../../../utils/scaleUtils';
import { IMG_URL } from '../../../api/config';
import FastImage from 'react-native-fast-image';
import SafeFastImage from '../../../components/Home/SafeFastImage'

const HotServices = ({shoplist,navigation}) => {
const [randomList, setRandomList] = React.useState([])
const rotateAnim = useRef(new Animated.Value(0)).current
const getRandomThree = (arr = []) => {
  const copy = [...arr]

  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[copy[i], copy[j]] = [copy[j], copy[i]]
  }

  return copy.slice(0, 3)
}
useEffect(() => {
  if (shoplist?.length) {
    setRandomList(getRandomThree(shoplist))
  }
}, [shoplist])
const startRotate = () => {
  rotateAnim.setValue(0)

  Animated.timing(rotateAnim, {
    toValue: 1,
    duration: 600,
    useNativeDriver: true,
  }).start()
}
const rotate = rotateAnim.interpolate({
  inputRange: [0, 1],
  outputRange: ['0deg', '360deg'],
})
  return (
    <View style={styles.container}>
        <View style={{flexDirection: 'row',alignItems: 'center',
            justifyContent: 'space-between',}}>
    <Text style={styles.title}>热门服务</Text>
    <TouchableOpacity style={{flexDirection: 'row',alignItems: 'center',gap:px(3)}}
      onPress={() => {
      startRotate()
      setRandomList(getRandomThree(shoplist))
  }}>
<Animated.Image
  source={require('../../../../assets/images/home/refresh.png')}
  style={[
    {
      width: px(16),
      height: px(16),
      transform: [{ rotate }],
    },
  ]}
/>
 <Text style={styles.refresh}>刷新</Text>
    </TouchableOpacity>
        </View>
    <View style={{width: '100%',flexDirection: 'row',
        justifyContent: 'space-between',marginTop: px(6),}}>
            {(randomList || [])?.map((item,index)=>
            <TouchableOpacity style={{flexDirection: 'column',}} key={index}
            activeOpacity={0.8}
            onPress={()=>  navigation.navigate('Shopinfo',{shopinfo:item.goodsInfo})}>
                <View style={{position: 'relative',width: px(114),height: px(114),}}>
                       <Image source={require('../../../../assets/images/home/hotlefttop.png')} 
                 style={{width:px(32),height:px(18),position: 'absolute',zIndex: 1,
                    top:px(8),left:-px(4)
                 }}></Image>
                 <Text style={styles.lefttoptext}>活动</Text>
       <SafeFastImage source={{uri:IMG_URL+item?.goodsInfo?.coverImage.split(',')[0]}} 
                 style={{width:px(114),height:px(114),position: 'absolute',
                    borderRadius: px(12),
                 }}/>
                </View>
<View style={{ flexDirection: 'row', alignItems: 'flex-end', gap: px(3), marginTop: px(3) }}>
  <Text style={styles.price}>
    ￥{item?.goodsInfo?.minPrice ? item.goodsInfo.minPrice / 100 : 128}
  </Text>
  {/* <Text style={styles.smallprice}>￥388</Text> */}
</View>
 <Text style={styles.destitle}
 numberOfLines={1} ellipsizeMode='tail'>{item?.goodsInfo?.title}</Text>
  <Text style={styles.smadestitle}
   numberOfLines={1} ellipsizeMode='tail'>纯绿护航 开挂必赔 炸单包赔</Text>
   </TouchableOpacity>
   )}
            

    </View>
      
    </View>
  )
}

export default React.memo(HotServices)

const styles = StyleSheet.create({
    lefttoptext:{
        marginTop: px(9),
        marginLeft: px(2),
        zIndex: 2,
 fontFamily: 'DingTalk JinBuTi',
        fontSize:px(10),
        color:'#FFFFFF',
        //fontWeight:800,
        lineHeight:px(12),
    },
    smadestitle:{
        marginTop: px(2),
        width: px(114),
 fontFamily: 'MiSans-Regular',
        fontSize:px(10),
        color:'#FF9500',
        fontWeight:400,
        lineHeight:px(13),
    },
    destitle:{
        marginTop: px(2),
 fontFamily: 'MiSans-Medium',
        fontSize:px(13),
        color:'#1A1A1A',
        //fontWeight:500,
        lineHeight:px(17),
        width: px(114),
    },
    smallprice:{
        marginBottom: px(2),
        textDecorationLine: 'line-through',
 fontFamily: 'MiSans-Regular',
        fontSize:px(10),
        color:'#AAAAAA',
        fontWeight:400,
        lineHeight:px(13),
    },
    price:{
 fontFamily: 'MiSans-Bold',
        fontSize:px(15),
        color:'#DE5452',
        //fontWeight:400,
        lineHeight:px(21),
    },
    refresh:{
 fontFamily: 'MiSans-Regular',
        fontSize:px(12),
        color:'#AAAAAA',
        fontWeight:400,
        lineHeight:px(16),
    },
    title:{
  //marginTop: px(10),
   fontFamily: 'DingTalk JinBuTi',
        fontSize:px(17),
        color:'#1A1A1A',
        //fontWeight:800,
        lineHeight:px(20),
    },
    container:{
        //flex: 1,
    }
})