import { StyleSheet, Text, View,Image,TouchableOpacity,Animated, } from 'react-native'
import React,{useEffect,useState,useRef,} from 'react'
import { px } from '../../../utils/scaleUtils';
import { IMG_URL } from '../../../api/config';
import LinearGradient from 'react-native-linear-gradient';
import {
  Toast,
  Tooltip,
} from '@ant-design/react-native'

  const statusTextMap = {
  online: '空闲',
  offline: '离线',
  busy:'在忙'
};
  const actions = [
    {
      key: 'online',
      text: '空闲',
    },
    {
      key: 'offline',
      text: '离线',
    },
        {
      key: 'busy',
      text: '在忙',
    },
  ];
  const statusStyleMap = {
  online: {
    borderColor: '#3CF15F',
    textColor: '#3CF15F',
  },

  offline: {
    borderColor: '#D8D8D8',
    textColor: '#1A1A1A',
  },

  busy: {
    borderColor: '#FF9500',
    textColor: '#FF9500',
  },
};
export default function PlayerItem({navigation,item}) {
  const [visible, setVisible] = useState(false);
  const [status, setStatus] = useState('online');
  const rotateAnim = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    if(item){
      console.log(item);
      
    }


  }, [item])
      const handleAction = (item) => {
      console.log('当前状态:', item.key);
  
      if (item.key === 'online') {
        //online(1);
        Toast.show('已切换为客服在线');
      } else {
        //onlineoff();
        Toast.show('已切换为客服离线');
      }
    };
    const rotate = rotateAnim.interpolate({
  inputRange: [0, 1],
  outputRange: ['0deg', '180deg'],
});
const currentStatusStyle =
  statusStyleMap[status];
  return (
    <View style={styles.container}>
    <View style={{flexDirection: 'row',alignItems: 'center',}}>
     <Image source={{uri:IMG_URL+item?.avatar}} 
      style={{width:px(87),height:px(87),borderRadius: px(6),}}></Image>
<View style={{flexDirection: 'column',marginLeft: px(8),gap:px(4)}}>
<View style={{flexDirection: 'row',alignItems: 'center',gap:px(6)}}>
<Text style={styles.nickename}>{item?.nickName}</Text>
{item.gender==1&&
<Image source={require('../../../../assets/images/my/man.png')} 
style={{width:px(16),height:px(16)}}></Image>
}
{item.gender==2&&
<Image source={require('../../../../assets/images/my/woman.png')} 
style={{width:px(16),height:px(16)}}></Image>
}
</View>

<LinearGradient
  colors={[
    'rgba(229,194,108,0.1)',
    'rgba(219,170,36,0.4)',
  ]}
  start={{x: 1, y: 0}}
  end={{x: 0, y: 0}}
  style={{
    //minWidth:px(100),
    //width: 100,
    //height: 20,
    //opacity: 0.5,
    //padding:0,

    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: px(3),
     alignSelf:'flex-start',
   // alignSelf:'flex-start',
  }}
>
  <View style={{    paddingVertical:px(2),
    paddingHorizontal:px(12),}}>
<Text style={styles.rank}>{item?.gameRank}</Text>
  </View>

</LinearGradient>

<View style={{flexDirection: 'row',alignItems: 'center',gap:px(4),flexWrap: 'wrap',}}>
  {
    item?.goodAt
      ?.split(',')
      .filter(Boolean)
      .map((tag, index) => (
        <View
          key={index}
          style={{
            paddingHorizontal:px(4),
            paddingVertical:px(2),
            backgroundColor:'#E6EAED',
            borderRadius:px(4),
          }}
        >
          <Text style={styles.tagstext}>
            {tag}
          </Text>
        </View>
      ))
  }
</View>
<Text style={styles.destext} numberOfLines={1}>{item?.intro}</Text>
</View>
    </View>
<View style={{width: "100%",height: px(1),backgroundColor: 'rgba(118, 118, 118,0.2)',marginTop: px(12),}}></View>
<View style={{flexDirection: 'row',alignItems: 'center',justifyContent: 'flex-end',marginTop: px(8),}}>
{/* <Text style={styles.creattime}>创建时间： 2026.04.02</Text> */}
<View style={{flexDirection: 'row',alignItems: 'center',gap:px(12)}}>
  <TouchableOpacity style={{borderRadius: px(18),width: px(80),height: px(26),flexDirection: 'row',
  borderColor: '#D8D8D8',borderWidth: px(1),alignItems: 'center',justifyContent: 'center',
}} onPress={()=>navigation.navigate('Productass',{item:item})}>
<Text style={styles.edittext}>关联商品</Text>
</TouchableOpacity>
{item.verifyStatus=="PENDING"&&
<View style={{borderRadius: px(18),width: px(80),height: px(26),flexDirection: 'row',
  borderColor: '#D8D8D8',borderWidth: px(1),alignItems: 'center',justifyContent: 'center',
}}>
<Text style={styles.edittext}>审核中</Text>
</View>
}

{item.verifyStatus!=="PENDING"&&
<TouchableOpacity style={{borderRadius: px(18),width: px(80),height: px(26),flexDirection: 'row',
  borderColor: '#D8D8D8',borderWidth: px(1),alignItems: 'center',justifyContent: 'center',
}} onPress={()=>navigation.navigate('Playmateedit',{item:item})}>
<Text style={styles.edittext}>编辑</Text>
</TouchableOpacity>
}
{item.verifyStatus=="REJECTED"&&
<TouchableOpacity style={{borderRadius: px(18),width: px(80),height: px(26),flexDirection: 'row',
  borderColor: '#D8D8D8',borderWidth: px(1),alignItems: 'center',justifyContent: 'center',
}} onPress={()=>        Toast.fail({
           content: item.verifyRemark,
           duration: 2,
           position: 'center',
           mask: false,
           })}>
<Text style={[styles.edittext,{color:'#FF4D4F'}]}>已驳回</Text>
</TouchableOpacity>
}
{/* <LinearGradient
  colors={[
    '#FEC525',
    '#FC9026',
  ]}
  start={{x: 1, y: 0}}
  end={{x: 0, y: 0}}
  style={{
    width: px(80),
    height: px(26),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: px(16),
  }}
>
<Text style={styles.savetext}>保存</Text>
</LinearGradient> */}
{item.verifyStatus=="APPROVED"&&
      <Tooltip.Menu
        actions={actions}
        trigger="onPress"
        //placement="top"
        crossOffset={{ top: 0, left: 0 }}
        mode="light"
    visible={visible}
    onVisibleChange={(v) => {
      setVisible(v);
      Animated.timing(rotateAnim, {
      toValue: v ? 1 : 0,
      duration: 200,
      useNativeDriver: true,
    }).start();
    }}
    onAction={(item) => {

      setStatus(item.key);
      handleAction(item);
      setVisible(false);
    }}
      >
        <TouchableOpacity
          activeOpacity={0.8}
          style={{
            paddingHorizontal: px(16),
            //flex: 1,
            height: px(26),
            width: px(80),
            //borderRadius: 20,
            //backgroundColor: '#1A1A1A',
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
            borderWidth: px(1),
            borderColor: currentStatusStyle.borderColor,
            borderRadius: px(16),
          }}
        >
         <Text
          style={[
            styles.comprehensive,
            {
              color:
                currentStatusStyle.textColor,
            },
          ]}
          >
            {statusTextMap[status]}
          </Text>
           <Animated.Image
            source={require('../../../../assets/images/home/select.png')}
            style={{
              width: px(17),
              height: px(17),
              marginLeft: px(1),
              transform: [{ rotate }],
            // transform: [{ rotate }],
            }}
          />
        </TouchableOpacity>
      </Tooltip.Menu>
}

</View>
</View>
<View style={{flexDirection: 'row',alignItems: 'center',marginTop: px(8),justifyContent: 'flex-end',}}>
<Text style={styles.creattime}>创建时间： {item?.createdAt}</Text>
</View>

    </View>
  )
}

const styles = StyleSheet.create({
        comprehensive:{
 fontFamily: 'MiSans-Regular',
        fontSize:px(12),
        color:'#1A1A1A',
        fontWeight:400,
        lineHeight:px(16),
    },
  savetext:{
fontFamily: 'MiSans-Medium',
        fontSize:px(12),
        color:'#FFFFFF',
        fontWeight:400,
        lineHeight:px(16),
  },
  edittext:{
fontFamily: 'MiSans-Regular',
        fontSize:px(12),
        color:'#1A1A1A',
        fontWeight:400,
        lineHeight:px(16),
  },
  creattime:{
fontFamily: 'MiSans-Regular',
        fontSize:px(10),
        color:'#AAAAAA',
        fontWeight:400,
        lineHeight:px(13),
  },
  destext:{
    width: px(250),
fontFamily: 'MiSans-Regular',
        fontSize:px(12),
        color:'#9E9E9E',
        fontWeight:400,
        lineHeight:px(16),
  },
  tagstext:{
fontFamily: 'MiSans-Regular',
        fontSize:px(11),
        color:'#1A1A1A',
        fontWeight:400,
        lineHeight:px(15),
  },
  rank:{
fontFamily: 'MiSans-Regular',
        fontSize:px(13),
        color:'#AD7F00',
        fontWeight:400,
        lineHeight:px(17),
  },
  nickename:{
fontFamily: 'MiSans-Medium',
        fontSize:px(16),
        color:'#1A1A1A',
        fontWeight:500,
        lineHeight:px(21),
  },
  container:{
    padding:px(8),
    backgroundColor: '#fff',
    borderRadius: px(8),
  }
})