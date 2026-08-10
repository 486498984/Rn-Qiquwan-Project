import { StyleSheet, Text, View,ScrollView,Image,TouchableOpacity, } from 'react-native'
import React,{useEffect,useState} from 'react'
import request from '../../api/request';
import { px } from '../../utils/scaleUtils';
import SafeFastImage from '../../components/Home/SafeFastImage'
import { IMG_URL } from '../../api/config';
import LinearGradient from 'react-native-linear-gradient';
import DetailTab from "./components/DetailTab";

const statusConfig = {
  ONLINE: {
    text: '空闲',
    color: '#3CF15F',
    icon: require('../../../assets/images/home/online.png'),
  },

  OFFLINE: {
    text: '离线',
    color: '#AAAAAA',
    icon: require('../../../assets/images/home/offline.png'),
  },

  BUSY: {
    text: '在忙',
    color: '#FF9500',
    icon: require('../../../assets/images/home/busy.png'),
  },
};
export default function PlayerInfo({route,navigation,}) {
      const [playinfo, setPlayinfo] = useState({}); //陪玩详情
    const {item}=route.params||{}
    useEffect(() => {
      if(item){
        console.log(item);
        getplayerinfo();
      }
    }, [item])
    const getplayerinfo = async() => {
    try {
      const response = await request({
        url: '/player/detail',
        method: 'GET',
        query: {
          id:item.id
        },
      });
      console.log(response);
      if (response.code === 0 && response.data) {
       setPlayinfo(response.data)
      }
    } catch (error) {
      console.log(error);
    }
     };
      const handleback = () => {
    navigation.goBack();
  };
  const statusInfo =
  statusConfig[playinfo?.player?.workStatus] || statusConfig.OFFLINE;
  return (
    <View style={styles.container}>

            <TouchableOpacity style={{zIndex: 99,marginTop: px(58),marginLeft: px(20),position: 'absolute',}}
    onPress={()=>handleback()}>
       <Image source={require('../../../assets/images/my/wleft.png')}  
       style={{width:px(22),height:px(22),}}></Image>
    </TouchableOpacity>
     <ScrollView showsVerticalScrollIndicator={false}>
     <View >
    <View style={{width: px(393),height: px(393),position: 'relative',}}>

    <SafeFastImage
        source={{uri:IMG_URL+playinfo?.player?.avatar}}
        style={{ width: px(393), height: px(393),position: 'absolute', }}
    />
    <View style={{position: 'absolute',bottom:px(40),width: '100%',
        flexDirection: 'row',alignItems: 'center',justifyContent: 'space-between',
    }}>
<View style={{flexDirection: 'column',marginLeft: px(16),}}>
<Text style={styles.nickname}>{playinfo?.player?.nickName}</Text>
        {/* {playinfo?.player?.gender==1&&
        <Image source={require('../../../assets/images/my/man.png')} 
        style={{width:px(16),height:px(16)}}></Image>
        }
        {playinfo?.player?.gender==2&&
        <Image source={require('../../../assets/images/my/woman.png')} 
        style={{width:px(16),height:px(16)}}></Image>
        } */}
<LinearGradient
  colors={[
    'rgba(229, 194, 108, 0.10)',
    'rgba(219, 170, 36, 0.80)',
  ]}
  start={{x: 1, y: 0}}
  end={{x: 0, y: 0}}
  style={{
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: px(3),
     alignSelf:'flex-start',
     marginTop: px(7),
  }}
>
  <View style={{    paddingVertical:px(2),
    paddingHorizontal:px(12),}}>
<Text style={styles.rank}>{item?.gameRank}</Text>
  </View>
</LinearGradient>
</View>
<View style={{position: 'relative',width:px(89),height:px(57),flexDirection: 'row',alignItems: 'center',
    gap:px(6)
}}>
       <Image source={require('../../../assets/images/home/audios.png')}  
       style={{width:px(89),height:px(57),position: 'absolute',}}></Image>
          <Image source={require('../../../assets/images/home/play.png')}  
       style={{width:px(25),height:px(25),marginLeft: px(8),}}></Image>
       <Text style={styles.playtext}>播放</Text>
</View>
    </View>
    </View>

<View style={{backgroundColor: '#fff',marginTop:-px(25),
   borderTopRightRadius: px(18),borderTopLeftRadius: px(18),width: '100%',minHeight:px(500)
   //paddingTop:px(18)
}}>
    <View style={{paddingHorizontal:px(16)}}>
<View style={{flexDirection: 'row',alignItems: 'center',justifyContent: 'space-between',
    marginTop: px(18),
}}>
<View style={{flexDirection: 'row',alignItems: 'center',gap:px(6)}}>
          <Image source={require('../../../assets/images/home/clubic.png')}  
       style={{width:px(21),height:px(21)}}></Image>
       <Text style={styles.clubname}>{playinfo?.player?.storeName}</Text>
</View>
<View style={{flexDirection: 'row',alignItems: 'center',gap:px(3)}}>
    <Image  source={statusInfo.icon}
       style={{width:px(17),height:px(17)}}></Image>
       <Text   style={{
      fontSize:px(13),
      color:statusInfo.color,
      fontFamily:'MiSans-Regular',
    }}>{statusInfo.text}</Text>
</View>
</View>
<Text style={[styles.destext,{marginTop: px(8),}]}>
    {playinfo?.player?.intro}
</Text>
<View style={{marginTop: px(8),}}>
        {playinfo?.player?.gender==1&&
        <Image source={require('../../../assets/images/my/man.png')} 
        style={{width:px(16),height:px(16)}}></Image>
        }
        {playinfo?.player?.gender==2&&
        <Image source={require('../../../assets/images/my/woman.png')} 
        style={{width:px(16),height:px(16)}}></Image>
        }
</View>
    </View>


<DetailTab playinfo={playinfo} navigation={navigation}></DetailTab>




</View>
     </View>
     </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
    destext:{
fontFamily: 'MiSans-Regular',
        fontSize:px(13),
        color:'#767676',
        fontWeight:400,
        lineHeight:px(17),
    },
    clubname:{
    fontFamily: 'MiSans-Medium',
    fontSize: px(16),
    color: '#1A1A1A',
    lineHeight: px(21),
    },
          rank:{
fontFamily: 'MiSans-Regular',
        fontSize:px(13),
        color:'#FFC300',
        fontWeight:400,
        lineHeight:px(17),
  },
    nickname:{
    fontFamily: 'MiSans-Medium',
    fontSize: px(21),
    color: '#FFFFFF',
    lineHeight: px(28),
    },
    playtext:{
    fontFamily: 'MiSans-Medium',
    fontSize: px(14),
    color: '#FFFFFF',
    lineHeight: px(19),
    },
container:{
    flex: 1,
    backgroundColor: '#fff',
}
})