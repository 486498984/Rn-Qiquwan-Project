import { StyleSheet, Text, View,TouchableOpacity,Image } from 'react-native'
import React from 'react'
import { px } from '../../utils/scaleUtils';
import {Switch} from '@ant-design/react-native'


export default function Notice({navigation}) {

     const handleback = () => {  //返回上一页
   navigation.goBack();
     };
     const handlechange = (e) => { 
     console.log(e);
  
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
           <Text style={styles.title}>消息通知</Text>
              </View>
            </View>
<View style={{width: '100%',backgroundColor: '#fff',height: px(51),
    marginTop: px(10),flexDirection: 'row',alignItems: 'center',
    justifyContent: 'space-between',paddingHorizontal:px(16)
}}>
<Text style={styles.smalltitle}>接收通知</Text>
  <Switch  style={{width: px(34),height: px(21),marginRight: px(5),}} color='#FF9500'
  defaultChecked={true} onChange={handlechange}/>
</View>
<View style={{width: '100%',flexDirection: 'row',alignItems: 'center',
    justifyContent: 'flex-end',marginTop: px(8),paddingHorizontal:px(18)
}}>
    <Text style={styles.destx}>柒趣玩通知总开关，关闭后将接收不到任何消息通知</Text>
    </View>   
<View style={{width: '100%',backgroundColor: '#fff',height: px(102),
    marginTop: px(8),flexDirection: 'column',justifyContent: 'center',
    gap:px(16),
    paddingHorizontal:px(16)
}}>
    <View style={{flexDirection: 'row',alignItems: 'center',width: '100%',
        justifyContent: 'space-between',
    }}>
<Text style={styles.smalltitle}>声音提示</Text>
  <Switch  style={{width: px(34),height: px(21),marginRight: px(5),}} color='#FF9500'
  defaultChecked={true} onChange={handlechange}/>
    </View>
    <View style={{width: px(361),height: px(1),backgroundColor: 'rgba(118, 118, 118,0.2)',}}></View>
    <View style={{flexDirection: 'row',alignItems: 'center',width: '100%',
        justifyContent: 'space-between',
    }}>
<Text style={styles.smalltitle}>震动提示</Text>
  <Switch  style={{width: px(34),height: px(21),marginRight: px(5),}} color='#FF9500'
  defaultChecked={true} onChange={handlechange}/>
    </View>
</View>

    </View>
  )
}

const styles = StyleSheet.create({
    destx:{
 fontFamily: 'MiSans-Regular',
        fontSize:px(12),
        color:'rgba(118, 118, 118,0.6)',
        fontWeight:400,
        lineHeight:px(16),
    },
    smalltitle:{
   fontFamily: 'MiSans-Regular',
        fontSize:px(14),
        color:'#312520',
        fontWeight:400,
        lineHeight:px(19),
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