import { StyleSheet, Text, View,Image,TouchableOpacity, } from 'react-native'
import React from 'react'
import { px } from '../../../utils/scaleUtils';
import SafeFastImage from '../../../components/Home/SafeFastImage'
import {IMG_URL } from '../../../api/config';
import { Toast } from '@ant-design/react-native';

const HotService=({item,navigation})=> {
         const goshopinfo = () => {  //跳转商品详情页
  console.log(item);
  
    if(item.minPrice==0){
    Toast.show({ 
      content: '该商品出现异常，无法下单',
      duration: 2,
      position: 'center',
      mask: false,
    })
    return
    }
  navigation.navigate('Shopinfo',{shopinfo:item})
  };
  return (
       <TouchableOpacity style={{flexDirection: 'column',}}
       activeOpacity={0.8} onPress={()=> goshopinfo()}>
          <SafeFastImage source={{uri:IMG_URL+item.coverImage.split(',')[0]}} 
           style={{width:px(175),height:px(175),borderRadius: px(12),}}/>
     <View style={{flexDirection: 'row',alignItems: 'flex-end',gap:px(3),marginTop: px(3),}}>
 {item.minPrice ? (
  <Text style={styles.redprice}>
    ￥{item.minPrice / 100}
  </Text>
) : null}

{item.minOriginalPrice ? (
  <Text style={styles.smallprice}>
    ￥{item.minOriginalPrice / 100}
  </Text>
) : null}
   </View>
    <Text style={styles.destitle}
    numberOfLines={1} ellipsizeMode='tail'>{item.title}</Text>
     <Text style={styles.smadestitle}
      numberOfLines={1} ellipsizeMode='tail'>{item.serviceIds}</Text>
               </TouchableOpacity>
  )
}
export default React.memo(HotService)
const styles = StyleSheet.create({
       smadestitle:{
        marginTop: px(3),
        width: px(175),
 fontFamily: 'MiSans-Regular',
        fontSize:px(12),
        color:'#FF9500',
        fontWeight:400,
        lineHeight:px(16),
    },
        destitle:{
        marginTop: px(3),
 fontFamily: 'MiSans-Medium',
        fontSize:px(12),
        color:'#1A1A1A',
        //fontWeight:500,
        lineHeight:px(16),
        width: px(175),
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
        redprice:{
 fontFamily: 'MiSans-Bold',
        fontSize:px(15),
        color:'#DE5452',
        //fontWeight:400,
        lineHeight:px(20),
    },
})