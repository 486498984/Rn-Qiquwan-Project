import { StyleSheet, Text, View,Image,TouchableOpacity,Linking,

 } from 'react-native'
import React from 'react'
import { px } from '../../../utils/scaleUtils';




const Noticepla = ({item,navigation})=> {
    const handlepress = async() => {
      if(item.type=="URL"){ //跳转外部链接
 const url = item.linkUrl;
  try {
    await Linking.openURL(url);
  } catch (e) {
    console.log('无法打开链接', e);
  }
      }else{
        navigation.navigate('Noticeinfo',{item:item})
        
      }
    };
    
  return (
    <TouchableOpacity style={styles.container}
    onPress={()=>handlepress()} activeOpacity={0.8}>
     <View style={[styles.just,{marginTop: px(13),}]}>
   <Image source={require('../../../../assets/images/home/noticeicon.png')} 
           style={{width:px(19),height:px(19)}}></Image>
           <Text style={styles.time}>{item?.updatedAt}</Text>
     </View>
<View style={{backgroundColor: 'rgba(118, 118, 118, 0.2)',height: px(1),width: px(329),
    marginTop: px(10),
}}></View>
<Text style={styles.toptitle}>{item?.title}</Text>
<Text style={styles.content} numberOfLines={2}>{item?.content}</Text>
<View style={{backgroundColor: 'rgba(118, 118, 118, 0.2)',height: px(1),width: px(329),
    marginTop: px(9),
}}></View>
    <View style={[styles.just,{marginTop: px(9),paddingBottom:px(8)}]}>
  <Text style={styles.chakan}>查看详情</Text>
        <Image source={require('../../../../assets/images/my/greyright.png')} 
           style={{width:px(19),height:px(19)}}></Image>
     </View>


    </TouchableOpacity>
  )
}
export default React.memo(Noticepla)
const styles = StyleSheet.create({
    chakan:{
  fontFamily: 'MiSans-Regular',
        fontSize:px(12),
        color:'#1A1A1A',
        fontWeight:400,
        lineHeight:px(16),
    },
    content:{
        marginTop: px(6),
  fontFamily: 'MiSans-Regular',
        fontSize:px(12),
        color:'#767676',
        fontWeight:400,
        lineHeight:px(16),
    },
    toptitle:{
        marginTop: px(9),
         fontFamily: 'MiSans-Regular',
        fontSize:px(14),
        color:'#1A1A1A',
        fontWeight:400,
        lineHeight:px(19), 
    },
    time:{
  fontFamily: 'MiSans-Regular',
        fontSize:px(12),
        color:'#AAAAAA',
        fontWeight:400,
        lineHeight:px(16),
    },
    just:{
flexDirection: 'row',
alignItems: 'center',
justifyContent: 'space-between',
    },
container:{
    width: px(361),
    backgroundColor: '#FFFFFF',
    paddingHorizontal:px(16),
    //height: px(152),
    borderRadius: px(8),
}
})