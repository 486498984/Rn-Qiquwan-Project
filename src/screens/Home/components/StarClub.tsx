import { StyleSheet, Text, View,Image,Animated,TouchableOpacity, } from 'react-native'
import React,{useEffect,useRef,} from 'react'
import { px } from '../../../utils/scaleUtils';
import LinearGradient from 'react-native-linear-gradient';
import { IMG_URL } from '../../../api/config';
import SafeFastImage from '../../../components/Home/SafeFastImage'

const StarClub = ({storelist,navigation}) => {
    console.log(storelist);
    const [randomList, setRandomList] = React.useState([])
    const rotateAnim = useRef(new Animated.Value(0)).current
    const getRandomThree = (arr = []) => {
      const copy = [...arr]
    
      for (let i = copy.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1))
        ;[copy[i], copy[j]] = [copy[j], copy[i]]
      }
    
      return copy.slice(0,5)
    }
    useEffect(() => {
      if (storelist.length) {
        setRandomList(getRandomThree(storelist))
      }
    }, [storelist])
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
    <Text style={styles.title}>明星俱乐部</Text>
    <TouchableOpacity style={{flexDirection: 'row',alignItems: 'center',gap:px(3)}}
      onPress={() => {
      startRotate()
  setRandomList(getRandomThree(storelist))
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

   {(randomList || []).map((item,index)=>
 <TouchableOpacity style={{flexDirection: 'column',}} key={index}
 activeOpacity={0.8} onPress={()=>navigation.navigate('ClubHome',{storeinfo:item.storeInfo})}>
        <View style={{position: 'relative',width: px(64),height: px(64),
            borderRadius: px(4),
        }}>
          <LinearGradient
                     colors={['#FDD888', '#FCF5E3']} // 渐变颜色
                     start={{ x: 1, y: 0 }}   
                     end={{ x: 0, y: 0 }}
                     style={styles.gradientBox}
                   >
                    <View style={{paddingHorizontal:px(3)}}>
                   <Text style={styles.clubdes}>平台保障</Text> 
                    </View> 
                   </LinearGradient>
<SafeFastImage source={{uri:IMG_URL+item?.storeInfo?.storeLogo}} 
            style={{width:px(64),height:px(64),position: 'absolute',
                borderRadius: px(4),
            }} />
        </View>
        <View style={{flexDirection: 'row',alignItems: 'center',
            justifyContent: 'center',marginTop: px(3),}}>
<Text style={styles.clubname} numberOfLines={1}>{item?.storeInfo?.storeName}</Text>
        </View>

    </TouchableOpacity>
)}         
   
       
      
    </View>
      
    </View>
  )
}

export default React.memo(StarClub)

const styles = StyleSheet.create({
    clubname:{
        textAlign:'center',
        width: px(64),
 fontFamily: 'MiSans-Regular',
        fontSize:px(11),
        color:'#1A1A1A',
        fontWeight:400,
        lineHeight:px(15),
    },
    clubdes:{
 fontFamily: 'MiSans-Regular',
        fontSize:px(10),
        color:'#6E4200',
        fontWeight:400,
        lineHeight:px(13),
    },
              gradientBox: {
                backgroundColor: 'red',
                top:0,
                left:0,
                position: 'absolute',
                zIndex: 1,
                //paddingHorizontal:px(3),
    //width:px(26),
    height: px(17),
    borderRadius: px(4),
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
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