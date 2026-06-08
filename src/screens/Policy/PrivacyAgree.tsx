import { StyleSheet, Text, View,TouchableOpacity,Image,Platform,

 } from 'react-native'
import React from 'react'
import { px } from '../../utils/scaleUtils';
import { WebView } from 'react-native-webview';
import { TOTAL_URL } from '../../api/config';


export default function PrivacyAgree({navigation}) {
  const handleback = () => {  //返回上一页
   navigation.goBack();
     };
     const url = TOTAL_URL + 'policy/privacy.html?t=' + new Date().getTime();
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
            <Text style={styles.title}>隐私保护政策</Text>
               </View>
             </View>

    <View style={{ flex: 1 }}>
      <WebView source={{ uri: url }}
        //bounces={false}           // 禁止 iOS 边缘回弹
        scrollEnabled={true}      // 确保可滚动
        decelerationRate={Platform.OS === 'ios' ? 'normal' : 0.985}/>
    </View>


    </View>
  )
}

const styles = StyleSheet.create({
          title:{
  fontFamily: 'MiSans-Medium',
        fontSize:px(16),
        color:'#1A1A1A',
        //fontWeight:500,
        lineHeight:px(21),
  },
container:{
  flex: 1,
  backgroundColor: '#fff',
}
})