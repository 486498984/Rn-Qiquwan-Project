import { StyleSheet, Text, View,Image,TouchableOpacity } from 'react-native'
import React,{useEffect,useState} from 'react'
import { px } from '../../utils/scaleUtils';
import { IMG_URL } from '../../api/config';
import { Toast } from '@ant-design/react-native';
import FastImage from 'react-native-fast-image';
import SafeFastImage from '../../components/Home/SafeFastImage'


const platformColorMap = {
  '手游': "#EBD1FF",
  '端游': "#D1E3FF",
  '双端': "#FFD1D1",
};
const platformColortx = {
  '手游': "#B638FF",
  '端游': "#008CFF",
  '双端': "#FF2E2E",
};
const ShopItem=({item,navigation,type=1,})=> {
  const [imgError, setImgError] = useState(false);

  const getPlatformColor = (platform) => {
  return platformColorMap[platform] || "#999999"; // 默认灰色
  };
    const gettxPlatformColor = (platform) => {
  return platformColortx[platform] || "#999999"; // 默认灰色
  };
  useEffect(() => {
    console.log('contenttwqr',item);
    
  }, [item])
  const getFirstImageUrl = (str) => {
  if (!str) return "";
  const domain = IMG_URL;
  const first = str.split(",")[0];
    console.log(domain + first);
  return domain + first;
};
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
   const imageUri = getFirstImageUrl(item.coverImage);
  return (
   <TouchableOpacity style={styles.shopbox} activeOpacity={1}
   onPress={()=>goshopinfo()}>
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
    
{item.categoryName=='护航'&&
    <Image source={require('../../../assets/images/home/type/protect.png')} 
    style={{width:px(57),height:px(23),position: 'absolute',
    bottom:0,left:0
    }}></Image>
}
{item.categoryName=='陪玩'&&
    <Image source={require('../../../assets/images/home/type/ace.png')} 
    style={{width:px(57),height:px(23),position: 'absolute',
    bottom:0,left:0
    }}></Image>
}
{item.categoryName=='任务'&&
    <Image source={require('../../../assets/images/home/type/task.png')} 
    style={{width:px(57),height:px(23),position: 'absolute',
    bottom:0,left:0
    }}></Image>
}
{item.categoryName=='跑刀'&&
    <Image source={require('../../../assets/images/home/type/knife.png')} 
    style={{width:px(57),height:px(23),position: 'absolute',
    bottom:0,left:0
    }}></Image>
}
                </View>
                 <View style={styles.shopinfobox}>
   <View style={{flexDirection: 'column',}}>
   <View  style={{width: px(238),position: 'relative',}}>
   <View style={[styles.pcgamebox,{ backgroundColor: getPlatformColor(item?.platform) }]}>
   <Text style={[styles.pcdestext,{color:gettxPlatformColor(item?.platform)}]}>{item?.platform}</Text>
      </View>
      <Text style={styles.shoptitle}>      {item?.title}</Text>
   </View>
   <View style={{flexDirection: 'row',alignItems: 'center',gap:px(3),marginTop: px(6),}}>
  {(item?.serviceIds ? item.serviceIds.split(",") : [])
    .slice(0, 3)
    .map((text, index) => (
      <View style={styles.tagbox} key={index}>
        <Text style={styles.tagtext}>{text}</Text>
      </View>
  ))}
   </View>
        </View>
   
   <View >
   <View>    
     <View style={{flexDirection: 'row',alignItems: 'flex-end',
      justifyContent: 'space-between',
     }}>
      <View style={{flexDirection: 'row',alignItems: 'flex-end',gap:px(3),}}> 
    <Text style={styles.price}>￥{item?.minPrice ? item.minPrice / 100 : 128}</Text>
     <Text style={styles.smallprice}>
      ￥{
      item?.minOriginalPrice != null
      ? item.minOriginalPrice / 100
      : "-"
      }
     </Text>
      <Text style={styles.salesnum}>销量{item?.salesCount > 99 ? "99+" : item?.salesCount || 0}</Text>
      </View>
   {/* <View style={{flexDirection: 'row',}}> 
      <Text style={[styles.onlinetext,{color:'#FF9500'}]}>在线</Text>
       <Text style={styles.onlinetext}>·成都</Text>
   </View> */}
                    </View>
      
    </View>
   <View style={{flexDirection: 'row',alignItems: 'flex-end',
      justifyContent: 'space-between',marginTop: px(2),
   }}>    
   <View style={{flexDirection: 'row',alignItems: 'flex-end',gap:px(3)}}>
   <Text style={styles.platformtitle}>平台保障</Text>
      <Text style={styles.salesnum}>{item?.storeName}</Text>
      </View>
   {/* <View style={{flexDirection: 'row',alignItems: 'center'}}>
      <Text style={styles.onlinetext}>进店</Text>
          <Image source={require('../../../assets/images/home/right.png')} 
                    style={{width:px(13),height:px(13),}}></Image>
      </View> */}
    </View>
        </View>
                </View>
             </TouchableOpacity>
  )
}
export default React.memo(ShopItem);
const styles = StyleSheet.create({
   platformtitle:{
fontFamily: 'MiSans-Medium',
        fontSize:px(13),
        color:'#6E4200',
        fontWeight:400,
        lineHeight:px(17),
   },
   onlinetext:{
 fontFamily: 'MiSans-Regular',
        fontSize:px(10),
        color:'#AAAAAA',
        fontWeight:400,
        lineHeight:px(13),
   },
   salesnum:{
     marginBottom: px(2),
     marginLeft: px(3),
       // textDecorationLine: 'line-through',
 fontFamily: 'MiSans-Regular',
        fontSize:px(10),
        color:'#AAAAAA',
        fontWeight:400,
        lineHeight:px(13),
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
       price:{
 fontFamily: 'MiSans-Bold',
        fontSize:px(15),
        color:'#DE5452',
        //fontWeight:400,
        lineHeight:px(21),
    },
   tagtext:{
 fontFamily: 'MiSans-Regular',
        fontSize:px(11),
        color:'#FF9500',
        fontWeight:400,
        lineHeight:px(15),
   },
   tagbox:{
backgroundColor: '#FEF7E0',
borderRadius: px(4),
paddingHorizontal:px(4),
paddingVertical:px(2),
   },
    tag:{
  fontSize: px(11),
  color:'#008CFF',
  backgroundColor:'#D1E3FF',
  borderRadius:px(4),
  paddingHorizontal:px(6),
  paddingVertical:px(2),
  overflow:'hidden'
},
    pcdestext:{
 fontFamily: 'MiSans-Regular',
        fontSize:px(11),
        color:'#008CFF',
        fontWeight:400,
        lineHeight:px(15),
    },
    pcgamebox:{
position: 'absolute',
top:0,
left:0,
// width: px(28),
// height: px(21),
padding:px(3),
backgroundColor: '#D1E3FF',
borderRadius: px(4),
flexDirection: 'row',
alignItems: 'center',
justifyContent: 'center',
    },
    shoptitle:{
        //backgroundColor: 'red',
      width: px(238),
      //height: px(49),
 fontFamily: 'MiSans-Medium',
        fontSize:px(16),
        color:'#1A1A1A',
        //fontWeight:500,
        lineHeight:px(21),
    },
    shopinfobox:{
        height: px(120),
        //width: 233,
        //backgroundColor: 'red',
  flexDirection: 'column',
  
  justifyContent: 'space-between',
    },
    shopimgbox:{
        width: px(120),
        height: px(120),
position: 'relative',
    },
    shopbox:{
        marginTop: px(0),
flexDirection: 'row',
alignItems: 'center',
justifyContent: 'space-between',
    },
})