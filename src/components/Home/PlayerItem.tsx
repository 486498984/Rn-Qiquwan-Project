import { StyleSheet, Text, View,Image,TouchableOpacity } from 'react-native'
import React from 'react'
import { px } from '../../utils/scaleUtils';
import { IMG_URL } from '../../api/config';
import SafeFastImage from '../../components/Home/SafeFastImage'
import LinearGradient from 'react-native-linear-gradient';

function PlayerItem({item,navigation,type}) {

  const getFirstImageUrl = (str) => {
  if (!str) return "";
  const domain = IMG_URL;
  const first = str.split(",")[0];
    //console.log(domain + first);
  return domain + first;
};
const imageUri = getFirstImageUrl(item.avatar);
  return (
    <TouchableOpacity style={styles.config} activeOpacity={1}
    onPress={()=>navigation.navigate('PlayerInfo',{item:item})}>
  <View style={styles.shopimgbox}>
<View style={{width:px(120),height:px(120),position: 'relative',}}>
   <SafeFastImage
       source={{ uri: imageUri } } 
       style={{width:px(120),height:px(120),}}
       />
       {type==1&&
       <Image source={require('../../../assets/images/home/shopboder.png')}  
       style={{width:px(120),height:px(120),position: 'absolute',}}></Image>
       }
       {type==2&&
       <Image source={require('../../../assets/images/home/shopboder1.png')}  
       style={{width:px(120),height:px(120),position: 'absolute',}}></Image>
       }
       </View>
 </View>
<View style={styles.rightbox}>
    <View style={{flexDirection: 'row',alignItems: 'center',gap:px(6)}}>
<Text style={styles.nickname}>{item.nickName}</Text>
{item.gender==1&&
<Image source={require('../../../assets/images/my/man.png')} 
style={{width:px(16),height:px(16)}}></Image>
}
{item.gender==2&&
<Image source={require('../../../assets/images/my/woman.png')} 
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
<View style={{flexDirection: 'row',alignItems: 'center',gap:px(4),flexWrap: 'wrap',marginTop: px(10),}}>
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
<View style={{flexDirection: 'row',alignItems: 'center',justifyContent: 'space-between',marginTop: px(3),}}>
<View style={{flexDirection: 'row',alignItems: 'center',gap:px(3)}}>
    <Text style={styles.price}>￥{Number(item?.minPrice)/100}</Text>
    {/* <Text style={styles.yuanprice}>￥388</Text> */}
</View>
<Text style={styles.number}>{item.virtualPayCount}人付款</Text>
</View>

</View>


    </TouchableOpacity>
  )
}
export default React.memo(PlayerItem);
const styles = StyleSheet.create({
    number:{
fontFamily: 'MiSans-Regular',
        fontSize:px(10),
        color:'#AAAAAA',
        fontWeight:400,
        lineHeight:px(13),
    },
    yuanprice:{
        textDecorationLine:'line-through',
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
        fontWeight:400,
        lineHeight:px(20),
    },
      destext:{
        marginTop: px(3),
    //width: px(250),
fontFamily: 'MiSans-Regular',
        fontSize:px(12),
        color:'#9E9E9E',
        fontWeight:400,
        lineHeight:px(16),
  },
      tagstext:{
fontFamily: 'MiSans-Regular',
        fontSize:px(11),
        color:'#2C2C2C',
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
    nickname:{
fontFamily: 'MiSans-Medium',
        fontSize:px(16),
        color:'#1A1A1A',
        fontWeight:400,
        lineHeight:px(21),
    },
    rightbox:{
        flex: 1,
    flexDirection: 'column',
    marginLeft: px(3),
    },
    shopimgbox:{
    width: px(120),
    height: px(120),
    position: 'relative',
    },
    config:{
    flexDirection: 'row',
    alignItems: 'center',
    }

})