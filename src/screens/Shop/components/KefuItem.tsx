import { StyleSheet, Text, View,Image,TouchableOpacity,Animated, } from 'react-native'
import React,{useEffect,useState,useRef,} from 'react'
import { px } from '../../../utils/scaleUtils';
import { IMG_URL } from '../../../api/config';
import LinearGradient from 'react-native-linear-gradient';
import {
  Toast,
  Tooltip,
} from '@ant-design/react-native'
import request from '../../../api/request';


const statusTextMap = {
  1: '在线',
  0: '离线',
};
const actions = [
  {
    key: 1,
    text: '在线',
  },
  {
    key: 0,
    text: '离线',
  },
];
const statusStyleMap = {

  1:{
    borderColor:'#3CF15F',
    textColor:'#3CF15F',
  },


  0:{
    borderColor:'#D8D8D8',
    textColor:'#1A1A1A',
  },

};
export default function KefuItem({navigation,item,onRefresh,}) {
  const [visible, setVisible] = useState(false);
  const [status, setStatus] = useState(1);
  const rotateAnim = useRef(new Animated.Value(0)).current;
    useEffect(() => {
      if(item){
        console.log(item);
        setStatus(item.isOnline);
      }
    }, [item])
const handleAction = (item)=>{


console.log('当前状态:',item.key);



Settingstatus(item.key);



if(item.key===1){

 Toast.show('已切换为客服在线');

}else{

 Toast.show('已切换为客服离线');

}


};
    const Settingstatus = async(e) => { 
    console.log(e);
          try {
            const response = await request({
              url: '/store/role/online',
              method: 'PUT',
              data: {
                id:item.id,
                isOnline:e,
                storeId:item.storeId,
              },
              query: {
              },
            }); 
            console.log('status123',response);
          if (response.data !== null && response.code == 0) {
         onRefresh?.();
          } 
          } catch (error) {
            console.error(error);
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
        <View style={{width: '100%',flexDirection: 'row',alignItems: 'center',justifyContent: 'space-between',}}>
        <View style={{flexDirection: 'column',gap:px(7)}}>
 <Text style={styles.nickename}>{item?.name}</Text>
  <Text style={styles.phone}>手机账号:{item?.phone}</Text>
        </View>
<Image
  source={
    item.avatarUrl == ""
      ? require('../../../../assets/images/my/defultavtar.png')
      : { uri: IMG_URL+item.avatarUrl }
  }
  style={{
    width: px(45),
    height: px(45),
    borderRadius: px(4),
  }}
//   onError={() => {
//     if (userinfo != null) {
//       setAvatarError(true);
//     }
//   }}
/>

        </View>


<View style={{width: "100%",height: px(1),backgroundColor: 'rgba(118, 118, 118,0.2)',marginTop: px(12),}}></View>

{/* <Text style={styles.creattime}>创建时间： 2026.04.02</Text> */}
<View style={{flexDirection: 'row',alignItems: 'center',justifyContent: 'space-between',marginTop: px(8),}}>
<Text style={styles.creattime}>创建时间： {item?.createdAt}</Text>
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


</View>

{/* <View style={{flexDirection: 'row',alignItems: 'center',marginTop: px(8),justifyContent: 'flex-end',}}>
<Text style={styles.creattime}>创建时间： {item?.createdAt}</Text>
</View> */}

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
    phone:{
fontFamily: 'MiSans-Regular',
        fontSize:px(12),
        color:'#AAAAAA',
        fontWeight:400,
        lineHeight:px(16),
  },
  nickename:{
fontFamily: 'MiSans-Medium',
        fontSize:px(14),
        color:'#000000',
        //fontWeight:500,
        lineHeight:px(19),
  },
  container:{
    padding:px(8),
    backgroundColor: '#fff',
    borderRadius: px(8),
  }
})