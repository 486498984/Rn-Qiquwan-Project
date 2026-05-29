import { StyleSheet, Text, View,TouchableOpacity,ActivityIndicator,Image,
ScrollView,Linking
 } from 'react-native'
import React,{useEffect,useRef,useState,useCallback,} from 'react'
import { px } from '../../utils/scaleUtils';
import { Toast } from '@ant-design/react-native';
import Storage from '../../utils/storage';
import useAuthStore from '../../utils/zustand'
import request from '../../api/request';
import WebviewModal from '../../components/Home/WebviewModal'
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import { scheduleOnRN } from 'react-native-worklets';
import { IMG_URL,TOTAL_URL } from '../../api/config';
import StorePickerModal from '../../components/My/StorePickerModal'
import { useFocusEffect } from '@react-navigation/native';



const bages={
  AFTER_SALE: 0,CREATED: 0,WAIT_COMMENT: 0,WAIT_CONFIRM: 0,WAIT_SERVICE: 0,
}
export default function My({navigation}) {
  const isLogin = useAuthStore(state => state.isLogin);
  const loginChanged = useAuthStore(state => state.loginChanged);
  const [message, setMessage] = useState(true);
  const [loginstatus, setLoginstatus] = useState(false); //登陆状态
  const [userinfo, setUserinfo] = useState(null); //登陆状态
  const [userprofile, setUserprofile] = useState(null); //个人信息
  const [avatarError, setAvatarError] = useState(false);
  const [storeauth, setStoreauth] = useState([]); //俱乐部权限
  const [visiblestorec, setVisiblestorec] = useState(false); //店铺选择弹窗
  const [badge, setBadge] = useState(bages); //下标数字
  const [collect, setCollect] = useState(0); //收藏数字
  const [fllow, setFllow] = useState(0); //关注数字


  useFocusEffect(
    useCallback(() => {
     getloginstatus();//获取登陆状态
    }, [])
  );
 
    const orderListRefreshKey =
  useAuthStore(
    state => state.orderListRefreshKey
  );
   const handletoast = () => { 
    Toast.config({ mask:false })
    //Toast.success('Success')
    //Toast.fail('Fail')
    //Toast.loading('loading...')
    //Toast.offline('Network connection failed !!!')
    Toast.show({
      content: '这条提示不会自动消失',
      duration: 3,
      position: 'center',
      mask: true,
    })
     //Toast.removeAll()
    }; 
  useEffect(() => {
   console.log('isLogin:', isLogin);
   getloginstatus();//获取登陆状态
   }, [isLogin,orderListRefreshKey]);
   const getloginstatus = async() => {  //获取登陆状态
   const user = await Storage.get("userinfo");
   if(user!==null){
   setLoginstatus(true)
   setUserinfo(user)
   getuserinfo(user) //获取用户信息
   getcollect() //获取收藏数字
   getfollwlist() //获取关注数字
   //getclubpermission(user.user.userId)
   }else{
   setBadge(bages)
   setLoginstatus(false)
   setUserinfo(null)
   }
   console.log(user); // { name: 'Tom', age: 18 }
   };
       const getcollect = async() => { 
        const user = await Storage.get("userinfo");
        try {
        const response = await request({
          url: '/favorites/list',
          method: 'GET',
          data: {
          },
          query: {userId:user.user.userId},
        }); 
        console.log(response);
      if (response.data !== null && response.code == 0) {
        if(response.data.list!==null){
       setCollect(response.data.list.length)
        }
       
      } 
      } catch (error) {
        console.error(error);
      }
      };
        const getfollwlist = async() => { 
        const user = await Storage.get("userinfo");
          try {
           const response = await request({
             url: '/user/follows/stores',
             method: 'GET',
             data:{
            },
             query: {
              userId:user.user.userId,
               page:1,
                size:10,
             }
           });
           console.log(response);
          if(response.data!==undefined&&response.code==0){
            if(response.data.list!==null){
       setFllow(response.data.list.length)
        }
          }
         } catch (error) {
           console.error(error);
         }

   };
   const getuserinfo = async(e) => { 
   console.log(e);
        try {
          const response = await request({
            url: '/user/profile',
            method: 'GET',
            data:{},
            query: { userId: e.user.userId }
          });
          console.log(response); 
         if(response.data!==undefined&&response.code==0){
         setAvatarError(false);
         setUserprofile(response.data.profile)
         getbadge(response.data.profile.userId)
         } 
        } catch (error) {
          console.error(error);
        }
    };
    const getbadge = async(e) => { 
        try {
          const response = await request({
            url: '/order/list',
            method: 'GET',
            data:{},
            query: { 
              userId: e,
              page:1,pageSize:10,
             }
          });
          console.log(response); 
         if(response.data!==undefined&&response.code==0){
         setBadge(response.data.badge)
         }
        } catch (error) {
          console.error(error);
        }
     };
    const handlestorage = async() => { //跳转登陆页
      if(userinfo==null){
     navigation.navigate('Login');
      }else{
     navigation.navigate('Profile');
      }
     };
  const [uservisible, setUservisible] = useState(false);
  const [yinsivisible, setYinsivisible] = useState(false);
    const closeModal = () => {
    setUservisible(false)
    setYinsivisible(false)
  };
  // 定义手势
  const swipeRightGesture = Gesture.Pan()
    .onUpdate(e => {
        console.log(e);
      // e.translationX 大于一定值认为右滑
      if (e.translationX > 35) {
      scheduleOnRN(closeModal);
      }
    });
    const goorder = (e) => {  //跳转订单
      console.log(e);
      if(!loginstatus){
          Toast.show({
          content: '请先完成登陆',
          duration: 2,
          position: 'center',
          mask: false,
        })
       return
      }
     navigation.navigate('Order',{e})
    };
    const handlegocoupon = async(e) => {  //跳转优惠券
      if(!loginstatus){
          Toast.show({
          content: '请先完成登陆',
          duration: 2,
          position: 'center',
          mask: false,
        })
       return
      }
      if(e==1){
      navigation.navigate('Coupon')
      }else if(e==2){
      navigation.navigate('Invite')
      //navigation.navigate('Asset')
      }else if(e==3){ //跳转俱乐部
      // const user = await Storage.get("userinfo");
      console.log(storeauth);
      getclubpermission()

      return;
      navigation.navigate('ShopIndex')
      }else if(e==4){
      navigation.navigate('Asset')
      }else if(e==5){
      navigation.navigate('Aftersales')
      }
    };
    const getclubpermission = async() => {
        try {
        const response = await request({
          url: '/store/role/auth',
          method: 'GET',
          data: {
          },
          query: {},
        }); 
        console.log('auth',response);
      if (response.data !== null && response.code == 0) {
        const storelist=response.data
        //console.log('storelist',storelist);
        
        setStoreauth(storelist)
        if (storelist.length === 0) {
          Toast.show({
          content: '暂无权限',
          duration: 2,
          position: 'center',
          mask: false,
        })
      } else if(storelist.length === 1) {
        //setStoreList(list);
        goStore(storelist[0]);
      }else{
      setVisiblestorec(true);
      }
      } else{
            Toast.show({
          content: '暂无权限',
          duration: 2,
          position: 'center',
          mask: false,
        })
      }
      } catch (error) {
            Toast.show({
          content: '暂无权限',
          duration: 2,
          position: 'center',
          mask: false,
        })
        console.error(error);
      }
     };
  const avatarUrl = userprofile?.avatarUrl
  ? `${IMG_URL}${userprofile.avatarUrl}`
  : null;
  const openWeb = async (e) => {
  try {
    await Linking.openURL(e);
  } catch (e) {
    console.log('无法打开链接', e);
  }
};
const goStore = (store) => { //跳转俱乐部
 console.log(store);
 navigation.navigate('ShopIndex',{id:store.storeId,userinfo:store})
};
const openWechatLink = async () => {
  const url = 'https://work.weixin.qq.com/ca/cawcdea2c4e121224f';

  try {
    await Linking.openURL(url);
  } catch (e) {
    console.log('无法打开链接', e);
  }
};
  return (
    <View style={styles.container}>
    <Image source={require('../../../assets/images/my/myback.png')} 
        style={{width: '100%',height:px(295),position: 'absolute',}}></Image>
   <ScrollView contentContainerStyle={{paddingHorizontal:px(16),marginTop: px(95),}}>
  <View style={{flexDirection: 'row',alignItems: 'flex-start',
    justifyContent: 'space-between',}}>
    <View style={{flexDirection: 'row',alignItems: 'center',}}>
<TouchableOpacity onPress={()=>handlestorage()}
 style={{flexDirection: 'row',alignItems: 'center',}}>
  <View style={{width:px(81),height:px(81),position: 'relative',}}>
<Image
  source={
    userinfo == null
      ? require('../../../assets/images/my/nologin.png')
      : avatarError || !avatarUrl
      ? require('../../../assets/images/my/defultavtar.png')
      : { uri: avatarUrl }
  }
  style={{
    width: px(81),
    height: px(81),
    borderRadius: px(12),
  }}
  onError={() => {
    if (userinfo != null) {
      setAvatarError(true);
    }
  }}
/>
        {/* {userinfo!==null&&
           <Image source={require('../../../assets/images/my/camera.png')} 
        style={{width:px(24),height:px(23),position: 'absolute',bottom:0
        }}/>
        } */}
  </View>
</TouchableOpacity>
    <View style={{flexDirection: 'column',justifyContent: 'space-between',
          height: px(81),marginLeft: px(8),
        }}>
        <TouchableOpacity onPress={()=>handlestorage()} style={{gap:px(3)}}>
<Text style={styles.nikename}>{userinfo!==null?userprofile?.nickName:'前往登陆'}</Text>
{/* <Text style={styles.idnumber}>ID {userinfo!==null?'1258'+userinfo?.user?.userId:'-'}</Text> */}
        </TouchableOpacity>
        {userinfo!==null&&
<View style={{flexDirection: 'row',alignItems: 'center',}}>
  <TouchableOpacity style={{flexDirection: 'row',alignItems: 'center',gap:px(3)}}
  onPress={()=>navigation.navigate('Collect')}>
<Text style={styles.follnum}>{collect}</Text>
<Text style={styles.idnumber}>收藏</Text> 
  </TouchableOpacity>
  <TouchableOpacity style={{flexDirection: 'row',alignItems: 'center',gap:px(3),
    marginLeft: px(12),
  }}   onPress={()=>navigation.navigate('Follow')}>
<Text style={styles.follnum}>{fllow}</Text>
<Text style={styles.idnumber}>关注</Text>
  </TouchableOpacity>
</View>
        }


        </View>
    </View>

    


<TouchableOpacity style={{width:px(34),height:px(34),
  flexDirection: 'row',alignItems: 'center',justifyContent: 'center',
}}  onPress={()=>navigation.navigate('Setting')}>
 <Image source={require('../../../assets/images/my/setting.png')} 
        style={{width:px(24),height:px(24)}}></Image>
</TouchableOpacity>
  </View>

<View style={{width: px(361),height: px(103),backgroundColor: '#fff',
  borderRadius: px(12),marginTop: px(16),
}}>
<View style={{flexDirection: 'row',alignItems: 'center',marginTop: px(9),
  justifyContent: 'space-between',
}}>
<View style={{width:px(68),height:px(25),position: 'relative',
  flexDirection: 'row',justifyContent: 'center',left:-px(5)
}}>
   <Image source={require('../../../assets/images/my/myorder.png')} 
        style={{width:px(68),height:px(25),position: 'absolute',}}></Image>
        <Text style={[styles.myordertext,{marginTop: px(3),}]}>我的订单</Text>
</View>
<TouchableOpacity style={{flexDirection: 'row',alignItems: 'center',
  paddingRight:px(7),}} onPress={()=>goorder(1)}>
<Text style={styles.alltext}>全部</Text>
 <Image source={require('../../../assets/images/my/right.png')} 
        style={{width:px(16),height:px(16)}}></Image>
</TouchableOpacity>
</View>
<View style={{flexDirection: 'row',alignItems: 'center',marginTop: px(5),
  justifyContent: 'space-between',width: '100%',
}}>
<TouchableOpacity style={{flexDirection: 'column',alignItems: 'center',flex: 1,gap:px(8)}}
onPress={()=>goorder(2)}>
  <View style={{width:px(30),height:px(30),position: 'relative',}}>
 <Image source={require('../../../assets/images/my/status1.png')} 
        style={{width:px(30),height:px(30)}}></Image>
      {badge.CREATED!==0&&
      <View style={{width: px(16),height: px(16),borderRadius: px(8),
    backgroundColor: '#DE5452',position: 'absolute',right: -px(8),top: -px(8),
    flexDirection: 'row',alignItems: 'center',justifyContent: 'center',}}>
   <Text style={styles.message}>{badge.CREATED}</Text>
   </View>
    }
   </View>

       <Text style={styles.statustext}>待付款</Text> 
</TouchableOpacity>
<TouchableOpacity style={{flexDirection: 'column',alignItems: 'center',flex: 1,gap:px(8)}}
onPress={()=>goorder(3)}>
  <View style={{width:px(30),height:px(30),position: 'relative',}}>
 <Image source={require('../../../assets/images/my/status2.png')} 
        style={{width:px(30),height:px(30)}}></Image>
      {badge.WAIT_SERVICE!==0&&
      <View style={{width: px(16),height: px(16),borderRadius: px(8),
    backgroundColor: '#DE5452',position: 'absolute',right: -px(8),top: -px(8),
    flexDirection: 'row',alignItems: 'center',justifyContent: 'center',}}>
<Text style={styles.message}>{badge.WAIT_SERVICE}</Text>
  </View> 
    }
  </View>
       <Text style={styles.statustext}>待服务</Text> 
</TouchableOpacity>
<TouchableOpacity style={{flexDirection: 'column',alignItems: 'center',flex: 1,gap:px(8)}}
onPress={()=>goorder(4)}>
  <View style={{width:px(30),height:px(30),position: 'relative',}}>
 <Image source={require('../../../assets/images/my/status3.png')} 
        style={{width:px(30),height:px(30)}}></Image>
      {badge.WAIT_CONFIRM!==0&&
      <View style={{width: px(16),height: px(16),borderRadius: px(8),
    backgroundColor: '#DE5452',position: 'absolute',right: -px(8),top: -px(8),
    flexDirection: 'row',alignItems: 'center',justifyContent: 'center',}}>
<Text style={styles.message}>{badge.WAIT_CONFIRM}</Text>
  </View> 
    }
  </View>
       <Text style={styles.statustext}>待收货</Text> 
</TouchableOpacity>
<TouchableOpacity style={{flexDirection: 'column',alignItems: 'center',flex: 1,gap:px(8)}}
onPress={()=>goorder(5)}>
  <View style={{width:px(30),height:px(30),position: 'relative',}}>
 <Image source={require('../../../assets/images/my/status4.png')} 
        style={{width:px(30),height:px(30)}}></Image>
      {badge.WAIT_COMMENT!==0&&
      <View style={{width: px(16),height: px(16),borderRadius: px(8),
    backgroundColor: '#DE5452',position: 'absolute',right: -px(8),top: -px(8),
    flexDirection: 'row',alignItems: 'center',justifyContent: 'center',}}>
<Text style={styles.message}>{badge.WAIT_COMMENT}</Text>
  </View> 
    }
  </View>
       <Text style={styles.statustext}>待评论</Text> 
</TouchableOpacity>
<TouchableOpacity style={{flexDirection: 'column',alignItems: 'center',flex: 1,gap:px(8)}}
onPress={()=>handlegocoupon(5)}>
  <View style={{width:px(30),height:px(30),position: 'relative',}}>
 <Image source={require('../../../assets/images/my/status5.png')} 
        style={{width:px(30),height:px(30)}}></Image>
      {badge.AFTER_SALE!==0&&
      <View style={{width: px(16),height: px(16),borderRadius: px(8),
    backgroundColor: '#DE5452',position: 'absolute',right: -px(8),top: -px(8),
    flexDirection: 'row',alignItems: 'center',justifyContent: 'center',}}>
<Text style={styles.message}>{badge.AFTER_SALE}</Text>
  </View> 
    }
  </View>
       <Text style={styles.statustext}>售后</Text> 
</TouchableOpacity>
</View>
</View>
<View style={{flexDirection: 'row',alignItems: 'center',justifyContent: 'space-between',
  marginTop: px(19),
}}>
<TouchableOpacity style={{width: px(175),height: px(60),backgroundColor: '#fff',
  borderRadius: px(12),flexDirection: 'row',alignItems: 'center',justifyContent: 'flex-start',}}
  onPress={()=>handlegocoupon(1)}>
 <Image source={require('../../../assets/images/my/redpacket.png')} 
  style={{width:px(69),height:px(76),position: 'absolute',bottom:0,left:px(8)}}></Image>
  <View style={{marginLeft: px(89),gap:px(2)}}>
    <View style={{flexDirection: 'column',}}>
    <Text style={styles.coupon}>我的优惠券</Text>
     <Text style={styles.coupondes}>享超值折扣</Text>
    </View>
  </View>
</TouchableOpacity>
<TouchableOpacity style={{width: px(175),height: px(60),backgroundColor: '#fff',
  borderRadius: px(12),flexDirection: 'row',alignItems: 'center',
  justifyContent: 'flex-start',}} onPress={()=>handlegocoupon(4)}>
 <Image source={require('../../../assets/images/my/gift.png')} 
  style={{width:px(69),height:px(76),position: 'absolute',bottom:0,left:px(8)}}></Image>
  <View style={{marginLeft: px(89),gap:px(2)}}>
    <View style={{flexDirection: 'column',}}>
    <Text style={styles.coupon}>我的资产</Text>
     <Text style={styles.coupondes}>单单赚分红</Text>
    </View>
  </View>
</TouchableOpacity>
</View>
<View style={{width: px(361),backgroundColor: '#fff',
  borderRadius: px(12),marginTop: px(10),paddingBottom:px(0)
}}>
<Text style={[styles.moretitle,{marginTop: px(14),marginLeft: px(14),}]}>更多功能</Text>
<View style={{width: '100%',flexDirection: 'row',
  paddingHorizontal:px(10),
}}>
<View style={{flexDirection: 'row',marginTop: px(0),rowGap:px(18),
  flexWrap: 'wrap',width: '100%',alignItems: 'center',
  paddingBottom:px(16),paddingTop:px(18)
}}>
<TouchableOpacity style={{flexDirection: 'column',alignItems: 'center',gap:px(4),
width: '25%',
  }} onPress={()=>navigation.navigate('Guarantee')}>
 <Image source={require('../../../assets/images/my/more1.png')} 
        style={{width:px(33),height:px(33)}}></Image>
       <Text style={styles.moretext}>平台保障</Text> 
</TouchableOpacity>
<TouchableOpacity style={{flexDirection: 'column',alignItems: 'center',gap:px(4),
width: '25%',
}} onPress={()=>navigation.navigate('Join')}>
 <Image source={require('../../../assets/images/my/more2.png')} 
        style={{width:px(33),height:px(33)}}></Image>
       <Text style={styles.moretext}>入驻中心</Text> 
</TouchableOpacity>
<TouchableOpacity style={{flexDirection: 'column',alignItems: 'center',gap:px(4),
width: '25%',
}} onPress={()=>handlegocoupon(2)}>
 <Image source={require('../../../assets/images/my/more8.png')} 
        style={{width:px(33),height:px(33)}}></Image>
       <Text style={styles.moretext}>邀请有礼</Text> 
</TouchableOpacity>

<TouchableOpacity style={{flexDirection: 'column',alignItems: 'center',gap:px(4),
width: '25%',
}} onPress={()=>openWeb(TOTAL_URL+'policy/index.html')}>
 <Image source={require('../../../assets/images/my/more6.png')} 
        style={{width:px(33),height:px(33)}}></Image>
       <Text style={styles.moretext}>服务声明</Text> 
</TouchableOpacity>
<TouchableOpacity style={{flexDirection: 'column',alignItems: 'center',gap:px(4),
width: '25%',
  }} onPress={()=> navigation.navigate('UserAgree')}>
 <Image source={require('../../../assets/images/my/more3.png')} 
        style={{width:px(33),height:px(33)}}></Image>
       <Text style={styles.moretext}>用户协议</Text> 
</TouchableOpacity>
<TouchableOpacity style={{flexDirection: 'column',alignItems: 'center',gap:px(4),
width: '25%',
  }} onPress={()=>navigation.navigate('PrivacyAgree')}>
 <Image source={require('../../../assets/images/my/more4.png')} 
        style={{width:px(33),height:px(33)}}></Image>
       <Text style={styles.moretext}>隐私政策</Text> 
</TouchableOpacity>
<TouchableOpacity style={{flexDirection: 'column',alignItems: 'center',gap:px(4),
width: '25%',
}} onPress={openWechatLink}>
 <Image source={require('../../../assets/images/my/more5.png')} 
        style={{width:px(33),height:px(33)}}></Image>
       <Text style={styles.moretext}>平台客服</Text> 
</TouchableOpacity>
{storeauth&&
<TouchableOpacity style={{flexDirection: 'column',alignItems: 'center',gap:px(4),
width: '25%',
}} onPress={()=>handlegocoupon(3)}>
 <Image source={require('../../../assets/images/my/more7.png')} 
        style={{width:px(33),height:px(33)}}></Image>
       <Text style={styles.moretext}>俱乐部端</Text> 
</TouchableOpacity>
}


</View>
</View>
</View>


   </ScrollView>
          {/* <WebviewModal visible={uservisible} setVisible={setUservisible} 
               uri={TOTAL_URL+'policy/user.html'} swipeRightGesture={swipeRightGesture}
               title={"柒趣玩用户协议"}
               ></WebviewModal>
                 <WebviewModal visible={yinsivisible} setVisible={setYinsivisible} 
               uri={TOTAL_URL+'policy/privacy.html'} swipeRightGesture={swipeRightGesture}
               title={"柒趣玩隐私保护政策"}
               ></WebviewModal> */}
               <StorePickerModal
  visible={visiblestorec}
  storeList={storeauth}
  onCancel={() => setVisiblestorec(false)}
  onConfirm={(store) => {
    setVisiblestorec(false);
    goStore(store);
  }}
/>
    </View>
   
  )
}

const styles = StyleSheet.create({
message:{
  fontFamily: 'MiSans-Regular',
        fontSize:px(12),
        color:'#FFFFFF',
        fontWeight:400,
        lineHeight:px(16),
},
  moretext:{
  fontFamily: 'MiSans-Regular',
        fontSize:px(12),
        color:'#1A1A1A',
        fontWeight:400,
        lineHeight:px(16),
  },
  moretitle:{
fontFamily: 'MiSans-Medium',
        fontSize:px(16),
        color:'#1A1A1A',
        //fontWeight:400,
        lineHeight:px(21),
  },
    coupondes:{
  fontFamily: 'MiSans-Regular',
        fontSize:px(10),
        color:'#AAAAAA',
        fontWeight:400,
        lineHeight:px(13),
  },
  coupon:{
fontFamily: 'MiSans-Medium',
        fontSize:px(14),
        color:'#1A1A1A',
        //fontWeight:400,
        lineHeight:px(19),
  },
  statustext:{
  fontFamily: 'MiSans-Regular',
        fontSize:px(13),
        color:'#767676',
        fontWeight:400,
        lineHeight:px(17),
  },
  alltext:{
  fontFamily: 'MiSans-Regular',
        fontSize:px(12),
        color:'#AAAAAA',
        fontWeight:400,
        lineHeight:px(16),
  },
  myordertext:{
  fontFamily: 'DingTalk JinBuTi',
        fontSize:px(12),
        color:'#FFFFFF',
        //fontWeight:800,
        lineHeight:px(14),
  },
  follnum:{
fontFamily: 'MiSans-Medium',
        fontSize:px(13),
        color:'#1A1A1A',
        //fontWeight:400,
        lineHeight:px(17),
  },
  idnumber:{
   fontFamily: 'MiSans-Regular',
        fontSize:px(13),
        color:'rgba(26, 26, 26,0.39)',
        fontWeight:400,
        lineHeight:px(17),
  },
  nikename:{
   fontFamily: 'MiSans-Bold',
        fontSize:px(18),
        color:'#1A1A1A',
        //fontWeight:400,
        lineHeight:px(25),
  },
  container:{
    flex: 1,
    backgroundColor: '#F2F3F5',
  }
})
