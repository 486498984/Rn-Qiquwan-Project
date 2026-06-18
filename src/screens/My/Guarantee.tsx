import { StyleSheet, Text, View,TouchableOpacity,Image,ScrollView } from 'react-native'
import React,{useState,useEffect}from 'react'
import { px } from '../../utils/scaleUtils';
import { IMG_URL } from '../../api/config';
import { Toast } from '@ant-design/react-native';
import FastImage from 'react-native-fast-image';
import SafeFastImage from '../../components/Home/SafeFastImage'



export default function Guarantee({navigation}) {
  const [ratio, setRatio] = useState(1);

  const uri = IMG_URL + 'protect.png';
  // useEffect(() => {
  //       Toast.loading({
  //       content: '加载中',
  //       mask: true,
  //       duration: 5,
  //     })
  //   Image.getSize(uri, (w, h) => {
  //     setRatio(w / h);
  //     Toast.removeAll()
  //   });
  // }, []);
  const handleback = () => {  //返回上一页
   navigation.goBack();
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
            <Text style={styles.title}>平台保障条例</Text>
               </View>
             </View>

       <ScrollView contentContainerStyle={{paddingHorizontal:px(16),paddingBottom:px(48)}}
       showsVerticalScrollIndicator={false}>
         <SafeFastImage source={{uri:IMG_URL+'protect1.png'}} 
         style={{width:'100%',height: px(281),}} resizeMode='contain' />
          <SafeFastImage source={{uri:IMG_URL+'protect2.png'}} 
         style={{width:'100%',height: px(313),marginTop: px(30),}} resizeMode='contain'/>
                   <SafeFastImage source={{uri:IMG_URL+'protect3.png'}} 
         style={{width:'100%',height: px(362),marginTop: px(30),}} resizeMode='contain'/>
                   <SafeFastImage source={{uri:IMG_URL+'protect4.png'}} 
         style={{width:'100%',height: px(260),marginTop: px(30),}} resizeMode='contain'/>
        </ScrollView>
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