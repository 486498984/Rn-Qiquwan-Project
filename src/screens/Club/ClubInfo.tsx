import { StyleSheet, Text, View,TouchableOpacity,Image} from 'react-native'
import React,{useState,useEffect} from 'react'
import { px } from '../../utils/scaleUtils';
import LinearGradient from 'react-native-linear-gradient';
import StarRating from '../../components/Club/StarRating'
import request from '../../api/request'
import Storage from '../../utils/storage';
import { Stepper, Toast } from '@ant-design/react-native'
import SafeFastImage from '../../components/Home/SafeFastImage'
import {IMG_URL } from '../../api/config';


export default function ClubInfo({navigation,route}) {
  const {shopinfo}=route.params || {}
   const [follow, setFollow] = useState(true)
   const handleback = () => {  //返回上一页
   navigation.goBack();
     };
     useEffect(() => {
      if(shopinfo){
      getfollow(shopinfo)
      }
      
     }, [shopinfo])
     
       const getfollow = async(e) => { //获取关注状态
            const user = await Storage.get("userinfo");
            console.log(user);
            
            if(user==null){ //未登陆的情况
          
            return
            }

          try {
             const response = await request({
               url: '/store/follow/status',
               method: 'GET',
               data:{},
               query: {userId:user.user.userId,storeId:e.id}
             });
             console.log(response);
            if(response.data!==undefined&&response.code==0){
                let res=response.data
            setFollow(!res.isFollowed)
            }
           } catch (error) {
             console.error(error);
           }
            };
       const handlefollow = async() => {  //关注
      const user = await Storage.get("userinfo");
            console.log(user);
            if(user==null){ //未登陆的情况
            Toast.info({content:'请先完成登陆',mask:false});
            return
            }
       if(follow){ //关注
       try {
             const response = await request({
               url: '/store/follow',
               method: 'POST',
               data:{},
               query: {userId:user.user.userId,storeId:shopinfo.id}
             });
             console.log(response);
            if(response.data!==undefined&&response.code==0){
             getfollow(shopinfo)
            }
           } catch (error) {
             console.error(error);
           }
            }else{ //取消关注
            try {
             const response = await request({
               url: '/store/unfollow',
               method: 'POST',
               data:{},
               query: {userId:user.user.userId,storeId:shopinfo.id}
             });
             console.log(response);
            if(response.data!==undefined&&response.code==0){
             getfollow(shopinfo)
            }
           } catch (error) {
             console.error(error);
           }
       }
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
     <Text style={styles.title}>店铺详情</Text>
        </View>
      </View>

 <View style={{width: '100%',paddingHorizontal:px(16),marginTop: px(26),}}>
<View style={{width: px(361),height: px(89),backgroundColor: '#fff',
  borderRadius: px(10),flexDirection: 'row',alignItems: 'center',
  justifyContent: 'space-between',paddingHorizontal:px(12)
}}>
  <View style={{flexDirection: 'row',alignItems: 'center',}}>
  <SafeFastImage source={{uri:IMG_URL+shopinfo?.storeLogo}} 
     style={{width:px(65),height:px(65),borderRadius: px(4),}}/>
    <View style={{flexDirection: 'column',marginLeft: px(6),gap:px(2),
     justifyContent: 'space-between',height: px(65),
    }}>
 <View style={{flexDirection: 'row',alignItems: 'flex-start',}}>
<Image source={require('../../../assets/images/club/champion.png')} 
      style={{width:px(24),height:px(24),}}></Image>
<Text style={styles.clubname} numberOfLines={2}>{shopinfo?.storeName}</Text>
        </View>
    {/* <View style={{flexDirection: 'row',alignItems: 'center',gap:px(6)}}>
<View style={{width: px(30),height: px(19),backgroundColor: '#FEF7E0',
  borderRadius: px(4),flexDirection: 'row',alignItems: 'center',justifyContent: 'center',
}}>
<Text style={styles.join}>加盟</Text>
</View>
<Text style={styles.follow}>{shopinfo?.followCount}关注</Text>
    </View> */}
    <View style={{flexDirection: 'row',alignItems: 'center',gap:px(3)}}>
<StarRating score={5}></StarRating>
<Text style={styles.score}>5.0</Text>
        </View>
    </View>
  </View>
<TouchableOpacity onPress={()=>handlefollow()} style={{}}>
    {follow&&
     <LinearGradient
    colors={['#FEC525', '#FC9026']} // 渐变颜色
    start={{ x: 1, y: 0 }}   
    end={{ x: 0, y: 0 }}
    style={styles.gradientBox}
    >
    <View style={{flexDirection: 'row',alignItems: 'center',}}>
    <Text style={styles.logintext}>关注</Text>
    </View>
    </LinearGradient>
    }
    {!follow&&
<View style={{width: px(66),height: px(27),borderRadius: px(6),justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.2)',flexDirection: 'row',alignItems: 'center',}}>
 <Text style={styles.logintext}>已关注</Text>
</View>
    }
</TouchableOpacity>
</View>
{/* <View style={{width: px(363),height: px(43),backgroundColor: '#fff',
  borderRadius: px(10),flexDirection: 'row',alignItems: 'center',
  justifyContent: 'space-between',paddingHorizontal:px(12),marginTop: px(12),}}>
<Text style={styles.clublink}>俱乐部链接</Text>
 <TouchableOpacity 
   style={{}}>
        <LinearGradient
       colors={['#FEC525', '#FC9026']} // 渐变颜色
       start={{ x: 1, y: 0 }}   
       end={{ x: 0, y: 0 }}
       style={styles.smallBox}
       >
       <View style={{flexDirection: 'row',alignItems: 'center',}}>
       <Text style={styles.copytext}>复制</Text>
       </View>
       </LinearGradient>
   </TouchableOpacity>
</View> */}

<View style={{width: px(363),backgroundColor: '#fff',paddingVertical:px(12),
  borderRadius: px(10),paddingHorizontal:px(12),marginTop: px(10),}}>
<View style={{flexDirection: 'row',alignItems: 'flex-start',gap:px(12)
}}>
<Text style={styles.clublink}>俱乐部简介</Text>
<Text style={styles.clubdes}>{shopinfo?.storeDesc}</Text>
</View>
<View style={{width: '100%',flexDirection: 'row',alignItems: 'center',
  justifyContent: 'flex-end',marginTop: px(12),}}>
<View style={{width: px(255),height: px(1),backgroundColor: 'rgba(118, 118, 118,0.2)',}}></View>
</View>
<View style={{flexDirection: 'row',alignItems: 'center',marginTop: px(12),
  gap:px(12)
}}>
<Text style={[styles.clublink,{width: px(70),}]}>开店时间</Text>
<Text style={styles.clubdes}>{shopinfo?.createdAt.split(' ')[0]}</Text>
</View>
  </View>

  </View>
    </View>
  )
}

const styles = StyleSheet.create({
  clubdes:{
    width: px(255),
 fontFamily: 'MiSans-Regular',
        fontSize:px(14),
        color:'#767676',
        fontWeight:400,
        lineHeight:px(19),
  },
       copytext:{
        fontFamily: 'MiSans-Medium',
        fontSize:px(11),
        color:'#FFFFFF',
        //fontWeight:500,
        lineHeight:px(15),
    },
  smallBox:{
    width:px(34),
    height: px(19),
    borderRadius: px(4),
    justifyContent: 'center',
    alignItems: 'center',
  },
  clublink:{
 fontFamily: 'MiSans-Regular',
        fontSize:px(14),
        color:'#1A1A1A',
        fontWeight:400,
        lineHeight:px(19),
  },
          score:{
 fontFamily: 'MiSans-Regular',
        fontSize:px(14),
        color:'#000000',
        fontWeight:400,
        lineHeight:px(18),
    },
  follow:{
 fontFamily: 'MiSans-Regular',
        fontSize:px(11),
        color:'#000000',
        fontWeight:400,
        lineHeight:px(15),
  },
  join:{
 fontFamily: 'MiSans-Regular',
        fontSize:px(11),
        color:'#FF9500',
        fontWeight:400,
        lineHeight:px(15),
  },
          clubname:{
            width: px(170),
 fontFamily: 'MiSans-Medium',
        fontSize:px(18),
        color:'#1A1A1A',
        //fontWeight:500,
        lineHeight:px(24),
    },
     logintext:{
        fontFamily: 'MiSans-Medium',
        fontSize:px(13),
        color:'#FFFFFF',
        //fontWeight:500,
        lineHeight:px(17),
    },
  gradientBox: {
    width:px(66),
    height: px(27),
    borderRadius: px(6),
    justifyContent: 'center',
    alignItems: 'center',
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
  backgroundColor: '#F7F8FC',
}
})