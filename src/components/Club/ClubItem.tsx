import { StyleSheet, Text, View,Image,TouchableOpacity } from 'react-native'
import React from 'react'
import { px } from '../../utils/scaleUtils';
import StarRating from '../Club/StarRating'
import FastImage from 'react-native-fast-image';
import SafeFastImage from '../../components/Home/SafeFastImage'
import {IMG_URL } from '../../api/config';
import { Toast } from '@ant-design/react-native';

const  ClubItem =({navigation,status,item,})=> {
    const handlegohome = () => { 
    navigation.navigate('ClubHome',{storeinfo:item})
     };
       const goshopinfo = (e) => {  //跳转商品详情页
  console.log(e);
  
    if(e.minPrice==0){
    Toast.show({ 
      content: '该商品出现异常，无法下单',
      duration: 2,
      position: 'center',
      mask: false,
    })
    return
    }
  navigation.navigate('Shopinfo',{shopinfo:e})
  };
  return (
   <View style={styles.shopbox}>
 <TouchableOpacity activeOpacity={1} style={{flexDirection: 'row',
 alignItems: 'center',justifyContent: 'space-between',width: '100%',}}
    onPress={()=>handlegohome()}> 
    <View style={{width:px(100),height:px(100),position: 'relative',}}>
  <SafeFastImage source={{uri:IMG_URL+item.storeLogo}}  
      style={{width:px(100),height:px(100),borderRadius: px(12),}} />
        <Image source={require('../../../assets/images/home/shopboder.png')} 
      style={{width:px(100),height:px(100),position: 'absolute',}}/>
    </View>
    
 <View style={{flexDirection: 'column',
    height:px(100),justifyContent: 'space-between',}}>
     <View style={{width: px(252),}}>
        <View style={{flexDirection: 'row',alignItems: 'flex-start',
    justifyContent: 'space-between',}}>
        <View style={{flexDirection: 'row',alignItems: 'center',}}>
<Image source={require('../../../assets/images/club/champion.png')} 
      style={{width:px(24),height:px(24),}}></Image>
<Text style={styles.clubname}>{item?.storeName}</Text>
        </View>
<View style={{flexDirection: 'row',alignItems: 'center',}}>
    <Image   source={
    item.openStatus === "OPEN"
      ? require('../../../assets/images/club/open.png')
      : require('../../../assets/images/club/close.png')
    }
      style={{width:px(17),height:px(17),}}></Image>
    <Text style={[styles.online,{color:item.openStatus=="OPEN"?'#FF9500':'#3CF15F'}]}>{item.openStatus=="OPEN"?'在线':'打烊'}</Text>
</View>
</View>
<View style={{flexDirection: 'row',alignItems: 'flex-start',
    justifyContent: 'space-between',marginTop: px(2),}}>
        <View style={{flexDirection: 'row',alignItems: 'center',gap:px(3)}}>
<StarRating score={5}></StarRating>
<Text style={styles.score}>5.0</Text>
        </View>
<Text style={styles.score}>{item.followCount}关注</Text>
</View>
<Text style={styles.clubdes}>{item.storeDesc}</Text>
        </View>
{/* <View style={{flexDirection: 'row',alignItems: 'center',
    justifyContent: 'space-between',}}>
<View style={{flexDirection: 'row',alignItems: 'flex-end',}}>
<Text style={styles.price}>8</Text>
<Text style={styles.yuan}>元</Text>
<Text style={styles.yuandes}>最低起</Text>
    </View>  
<View style={{width: px(1),height: px(8),
    backgroundColor: 'rgba(118, 118, 118,0.2)',}}></View>
<View style={{flexDirection: 'row',alignItems: 'flex-end',}}>
<Text style={styles.price}>98</Text>
<Text style={styles.yuan}>%</Text>
<Text style={styles.yuandes}>好评率</Text>
    </View>  
<View style={{width: px(1),height: px(8),
    backgroundColor: 'rgba(118, 118, 118,0.2)',}}></View>
<View style={{flexDirection: 'row',alignItems: 'flex-end',}}>
<Text style={styles.price}>199</Text>
<Text style={styles.yuan}>人</Text>
<Text style={styles.yuandes}>最近下单</Text>
    </View>  
</View> */}
 </View>
 </TouchableOpacity>
 
{JSON.parse(item.GoodsJSON).length>3&&
<View style={{flexDirection: 'row',alignItems: 'center',
    marginTop: px(6),gap:px(3)}}
    >
    {JSON.parse(item.GoodsJSON).slice(0, 4)?.map((item,index)=>
    <TouchableOpacity style={{flexDirection: 'column',}} key={index}
    onPress={()=> goshopinfo(item)}  activeOpacity={0.8}>
    <SafeFastImage source={{uri:IMG_URL+item.coverImage?.split(',')[0]}} 
        style={{width:px(88),height:px(88),borderRadius: px(9),}} />
        <View style={{flexDirection: 'row',alignItems: 'flex-end',}}>
            <Text style={styles.pricenum}>￥{item.minPrice/100}</Text>
            {/* <Text style={styles.depricenum}>￥88</Text> */}
        </View>
        <Text style={styles.shopdes} numberOfLines={1}>{item.title}</Text>
    </TouchableOpacity>
    )}
</View>
}


 </View>
  )
}
export default React.memo(ClubItem)
const styles = StyleSheet.create({
    shopdes:{
        width: px(88),
 fontFamily: 'MiSans-Medium',
        fontSize:px(10),
        color:'#1A1A1A',
        //fontWeight:500,
        lineHeight:px(13),
    },
    depricenum:{
        marginBottom: px(1),
 fontFamily: 'MiSans-Regular',
        fontSize:px(8),
        color:'#9E9E9E',
        fontWeight:400,
        lineHeight:px(11),
    },
    pricenum:{
 fontFamily: 'MiSans-Bold',
        fontSize:px(11),
        color:'#DE5452',
        //fontWeight:400,
        lineHeight:px(15),
    },
yuandes:{
 fontFamily: 'MiSans-Regular',
        fontSize:px(10),
        color:'#AAAAAA',
        fontWeight:400,
        //lineHeight:px(20),
},
    yuan:{
 fontFamily: 'MiSans-Regular',
        fontSize:px(10),
        color:'#1A1A1A',
        fontWeight:400,
        //lineHeight:px(20),
    },
    price:{
 fontFamily: 'MiSans-Medium',
        fontSize:px(15),
        color:'#1A1A1A',
        //fontWeight:500,
        //lineHeight:px(28),
    },
    clubdes:{
        marginTop: px(3),
 fontFamily: 'MiSans-Regular',
        fontSize:px(13),
        color:'#767676',
        fontWeight:400,
        lineHeight:px(17),
    },
    score:{
 fontFamily: 'MiSans-Regular',
        fontSize:px(14),
        color:'#AAAAAA',
        fontWeight:400,
        lineHeight:px(18),
    },
    online:{
 fontFamily: 'MiSans-Regular',
        fontSize:px(13),
        color:'#FF9500',
        fontWeight:400,
        lineHeight:px(17),
    },
    clubname:{
        marginLeft: px(2),
 fontFamily: 'MiSans-Medium',
        fontSize:px(18),
        color:'#1A1A1A',
        //fontWeight:500,
        lineHeight:px(24),
    },
    shopbox:{
    marginTop: px(0),
    flexDirection: 'column',

    },
})