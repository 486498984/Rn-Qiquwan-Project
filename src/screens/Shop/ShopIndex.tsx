import { StyleSheet, Text, View ,ScrollView,Image,TouchableOpacity,

} from 'react-native'
import React,{useState,useEffect,useCallback,} from 'react'
import { px } from '../../utils/scaleUtils';
import StarRating from '../../components/Club/StarRating'
import SlideSwitch from './components/Switch';
import request from '../../api/request';
import { IMG_URL } from '../../api/config';
import { Toast } from '@ant-design/react-native'
import { useFocusEffect } from '@react-navigation/native';




export default function ShopIndex({navigation,route}) {
    const {id,userinfo} =route.params || null
    const [storeinfo, setStoreinfo] = useState(null);
    const [logoError, setLogoError] = useState(false);
  const [badge, setBadge] = useState({}); //订单下标
  const [todaydata, setTodaydata] = useState({}); //今日数据
  const [money, setMoney] = useState({}); //提现数据



    const logoUrl =
  storeinfo?.storeLogo &&
  storeinfo.storeLogo.trim() !== ''
    ? IMG_URL + storeinfo.storeLogo
    : null;
 const handleback = () => {  //返回上一页
 navigation.goBack();
 };
const handlegohome = (e) => { 
console.log(e);
if(e!==5){
navigation.navigate('ShopHomeOrder',{e,id:id})
}else{
  console.log(2131);
  navigation.navigate('ShopSale',{id:id})
  
}
 };
 const [isOn, setIsOn] = useState(true);
 useEffect(() => {
    if(id){
   console.log('huichaun',id,userinfo); //店铺id
   getstoreinfo(id) //获取店铺详情
   gettodaydata(id) //获取今日数据
   getmoney(id) //获取提现金额
    }
 }, [id]) 
   useFocusEffect(
     useCallback(() => {
    if(id){
   console.log(id); //店铺id
   getstoreinfo(id) //获取店铺详情
   gettodaydata(id) //获取今日数据
   getmoney(id) //获取提现金额
    }
     }, [])
   );
 const getmoney = async(e) => { 
          try {
        const response = await request({
          url: '/store/dashboard/fund',
          method: 'GET',
          data: {
          },
          query: {storeId:e},
        }); 
        console.log('storeauth',response);
      if (response.data !== null && response.code == 0) {
      setMoney(response.data)
      } 
      } catch (error) {
        console.error(error);
      }

  };
 const gettodaydata = async(e) => { 
          try {
        const response = await request({
          url: '/store/dashboard/today',
          method: 'GET',
          data: {
          },
          query: {storeId:e},
        }); 
        console.log('storeauth',response);
      if (response.data !== null && response.code == 0) {
       setBadge(response.data.badgeCounts)
       setTodaydata(response.data)
      } 
      } catch (error) {
        console.error(error);
      }
 };
 const getstoreinfo = async(e) => { 
        try {
        const response = await request({
          url: '/store/detail',
          method: 'GET',
          data: {
          },
          query: {id:e},
        }); 
        console.log('storeauth',response);
      if (response.data !== null && response.code == 0) {
       setStoreinfo(response.data)
       if(response.data.openStatus=='OPEN'){ //营业中
        setIsOn(true)
       }else{
        setIsOn(false)
       }
      } 
      } catch (error) {
        console.error(error);
      }
  };
  const handleison = (e) => { 
  console.log(e,isOn);
  if(e){ //开店
  changestatus(true)
  setIsOn(true)
  }else{ //关店
  changestatus(false)
  setIsOn(false)
  }
   };
const changestatus = async (e) => {
  const openStatus = e ? 'OPEN' : 'CLOSED';
  try {
    const response = await request({
      url: '/store/status',
      method: 'PUT',
      data: {
        storeId: id,
        openStatus,
      },
      query: {},
    });
    console.log(response);
    if (response.data !== undefined && response.code == 0) {
    setIsOn(e)
    }else{
      Toast.fail({
        content: '更新失败，请稍后再试',
        duration: 2,
        position: 'center',
        mask: false,
      })
    }
  } catch (error) {
    console.error(error);
  }
};
const goemploye = () => { //跳转员工管理
  console.log(id);
  
  getclubpermission();
  return
  navigation.navigate('ShopEmployee',{storeinfo:id})
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
 const storelist = response.data || [];

// 找到当前店铺
const currentStore = storelist.find(
  item => item.storeId === id
);

// 当前店铺下的用户列表
const users = currentStore?.users || [];

// 判断权限
const hasPermission = users.some(
  item => item.roleCode === 'STORE_ADMIN'
);
// 是否是店铺拥有者
const isOwner = currentStore?.isOwner === true;

if (hasPermission||isOwner) {
  navigation.navigate('ShopEmployee', {
    storeinfo: id,
  });
} else {
  Toast.show({
    content: '暂无权限',
    duration: 2,
    position: 'center',
    mask: false,
  });
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
    const gotixian = async() => {

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
 const storelist = response.data || [];

// 找到当前店铺
const currentStore = storelist.find(
  item => item.storeId === id
);
console.log(currentStore);

// 当前店铺下的用户列表
const users = currentStore?.users || [];

const hasPermission =
  users.length === 1 &&
  users[0]?.roleCode === 'STORE_CS';
console.log(hasPermission);

if (!hasPermission) {
  navigation.navigate('ShopCashout',{id:id})
} else {
  Toast.show({
    content: '暂无权限',
    duration: 2,
    position: 'center',
    mask: false,
  });
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

  return (
    <View style={styles.container}>
          <View style={{width: px(393),height: px(98),backgroundColor: '#fff',
                  flexDirection: 'row',alignItems: 'flex-end',
                }}>
                  <View style={{width: '100%',paddingHorizontal:px(16),marginBottom: px(18),
                    flexDirection: 'row',alignItems: 'center',justifyContent: 'center',
                  }}>
             <TouchableOpacity onPress={handleback}  style={{  position: 'absolute',
              left: px(16),}}>
               <Image source={require('../../../assets/images/my/left.png')} 
               style={{width:px(22),height:px(22)}}></Image>
               </TouchableOpacity>
               <Text style={styles.title}>俱乐部端</Text>
                  </View>
                </View>
     <ScrollView contentContainerStyle={{paddingBottom:px(60)}} showsVerticalScrollIndicator={false}>
    <View style={{paddingHorizontal:px(16)}}>
<View style={{width: '100%',marginTop: px(0),}}>
<View style={{flexDirection: 'row',alignItems: 'center',
justifyContent: 'space-between',
    marginTop: px(16),
}}>
    <View style={{flexDirection: 'row',alignItems: 'center',}}>
<Image
  source={
    !logoError && logoUrl 
      ? { uri: logoUrl }
      : require('../../../assets/images/my/applogo1.png')
    }
    onError={() => setLogoError(true)}
    style={{
        width: px(62),
        height: px(62),
        borderRadius: px(4),
    }}
    /> 
        <View style={{flexDirection: 'column',height: px(62),
            justifyContent: 'space-between',marginLeft: px(8),}}>
<Text style={styles.clubname} numberOfLines={2}>{storeinfo?.storeName}</Text>
<View style={{flexDirection: 'row',alignItems: 'flex-start',
   marginTop: px(2),}}>
        <View style={{flexDirection: 'row',alignItems: 'center',gap:px(3)}}>
<StarRating score={5}></StarRating>
<Text style={styles.score}>5.0</Text>
        </View>
</View>
</View>
    </View>
  <SlideSwitch
        value={isOn}
        onChange={(e)=>handleison(e)}
      />
        </View> 
<View style={{width: px(361),height: px(107),backgroundColor: '#fff',
    marginTop: px(20),borderRadius: px(8),padding:px(8)
}}>
<View style={{width: '100%',flexDirection: 'row',alignItems: 'flex-start',
    justifyContent: 'space-between',
}}>
<Text style={styles.todaydata}>今日数据</Text>
<TouchableOpacity style={{flexDirection: 'row',alignItems: 'center',
    paddingBottom:px(20),paddingLeft:px(12)
}} onPress={()=>navigation.navigate('ShopOrder',{type: 1,id:id})}>
<Text style={styles.alldata}>今日订单</Text>
  <Image source={require('../../../assets/images/my/greyright.png')} 
   style={{width:px(16),height:px(16)}}></Image>
</TouchableOpacity>
</View>

<View style={{width: '100%',flexDirection: 'row',alignItems: 'center',
    justifyContent: 'space-between',paddingHorizontal:px(20)
}}>
<View style={{flexDirection: 'column',alignItems: 'center',
    gap:px(8)
}}>
<Text style={styles.price}>￥{todaydata.todayOrderAmount/100}</Text>
<Text style={styles.pricedes}>成交金额</Text>
</View>
<View style={{flexDirection: 'column',alignItems: 'center',
    gap:px(8)
}}>
<Text style={styles.price}>{todaydata.todayOrderCount}</Text>
<Text style={styles.pricedes}>成交订单数</Text>
</View>
<View style={{flexDirection: 'column',alignItems: 'center',
    gap:px(8)
}}>
<Text style={styles.price}>￥{todaydata.todayRefundAmount/100}</Text>
<Text style={styles.pricedes}>今日退款</Text>
</View>
</View>

</View>

<View style={{width: px(361),height: px(86),backgroundColor: '#fff',
    marginTop: px(16),borderRadius: px(8),flexDirection: 'row',alignItems: 'center',
    justifyContent: 'center',gap:px(18)
}}>
<TouchableOpacity style={{flexDirection: 'column',alignItems: 'center',gap:px(8),}}
onPress={()=>handlegohome(1)}>
     <Image source={require('../../../assets/images/my/willserve.png')} 
           style={{width:px(30),height:px(30)}}></Image>
           <Text style={styles.servetx}>待服务({badge.WAIT_SERVICE})</Text>
</TouchableOpacity>
<TouchableOpacity style={{flexDirection: 'column',alignItems: 'center',gap:px(8),}}
onPress={()=>handlegohome(2)}>
     <Image source={require('../../../assets/images/my/status3.png')} 
           style={{width:px(30),height:px(30)}}></Image>
           <Text style={styles.servetx}>服务中({badge.IN_SERVICE})</Text>
</TouchableOpacity>
<TouchableOpacity style={{flexDirection: 'column',alignItems: 'center',gap:px(8),}}
onPress={()=>handlegohome(3)}>
     <Image source={require('../../../assets/images/my/status4.png')} 
           style={{width:px(30),height:px(30)}}></Image>
           <Text style={styles.servetx}>待确认({badge.WAIT_CONFIRM})</Text>
</TouchableOpacity>
<TouchableOpacity style={{flexDirection: 'column',alignItems: 'center',gap:px(8),}}
onPress={()=>handlegohome(4)}>
     <Image source={require('../../../assets/images/my/complete.png')} 
           style={{width:px(30),height:px(30)}}></Image>
           <Text style={styles.servetx}>已完成</Text>
</TouchableOpacity>
<TouchableOpacity style={{flexDirection: 'column',alignItems: 'center',gap:px(8),}}
onPress={()=>handlegohome(5)}>
     <Image source={require('../../../assets/images/my/status5.png')} 
           style={{width:px(30),height:px(30)}}></Image>
           <Text style={styles.servetx}>售后中({badge.AFTER_SALE})</Text>
</TouchableOpacity>
</View>

<View style={{width: px(361),paddingVertical:px(16),backgroundColor: '#fff',
    marginTop: px(16),borderRadius: px(8),
}}>
<View style={{width: '100%',flexDirection: 'row',alignItems: 'center',
 
}}>
<View style={{flexDirection: 'column',marginLeft: px(30),
     justifyContent: 'space-between',
}}>
<TouchableOpacity style={{flexDirection: 'column',gap:px(6)}} 
onPress={()=>gotixian()}>
<View style={{flexDirection: 'row',alignItems: 'center',}}>
    <Text style={styles.pricedes}>可提现(元)</Text>
    <Image source={require('../../../assets/images/my/greyright.png')} 
   style={{width:px(16),height:px(16)}}></Image>
</View>
<Text style={styles.price}>{money.withdrawableAmount/100}</Text>
</TouchableOpacity>
{/* <View style={{flexDirection: 'column',gap:px(6)}}>
    <Text style={styles.pricedes}>总金额(元)</Text>
<Text style={styles.price}>3,124.4万</Text>
</View> */}
</View>
<View style={{flexDirection: 'column',marginLeft: px(49),
   justifyContent: 'space-between',
}}>
<TouchableOpacity style={{flexDirection: 'column',gap:px(6)}}
onPress={()=>navigation.navigate('ShopPending',{id:id})}>
<View style={{flexDirection: 'row',alignItems: 'center',}}>
    <Text style={styles.pricedes}>待入账(元)</Text>
    <Image source={require('../../../assets/images/my/greyright.png')} 
   style={{width:px(16),height:px(16)}}></Image>
</View>
<Text style={styles.price}>{money.pendingAmount/100}</Text>
</TouchableOpacity>
{/* <View style={{flexDirection: 'column',gap:px(6)}}>
    <Text style={styles.pricedes}>订单数</Text>
<Text style={styles.price}>43万</Text>
</View> */}
</View>
<View style={{flexDirection: 'column',alignItems: 'flex-end',
    marginLeft: px(49),justifyContent: 'flex-end',
    marginRight: px(0),
}}>
<TouchableOpacity style={{flexDirection: 'column',gap:px(6),paddingRight:px(0)}}
onPress={()=>navigation.navigate('ShopDetails',{id:id})}>
<View style={{flexDirection: 'row',alignItems: 'center',}}>
    <Text style={styles.pricedes}>收入明细</Text>
    <Image source={require('../../../assets/images/my/greyright.png')} 
   style={{width:px(16),height:px(16)}}></Image>
</View>
<Text style={styles.price}></Text>
</TouchableOpacity>
</View>

</View>
{/* <TouchableOpacity style={{flexDirection: 'row',alignItems: 'center',
    position: 'absolute',right:0,top:0,paddingTop:px(16),paddingRight:px(8),
    paddingBottom:px(12)
}} onPress={()=>navigation.navigate('ShopOrder',{type: 2})}>
    <Text style={styles.pricedes}>全部订单</Text>
    <Image source={require('../../../assets/images/my/greyright.png')} 
   style={{width:px(16),height:px(16)}}></Image>
</TouchableOpacity> */}
</View>

<TouchableOpacity style={{width: px(361),height: px(64),backgroundColor: '#fff',
marginTop: px(16),borderRadius: px(6),flexDirection: 'row',alignItems: 'center',
}} onPress={()=>navigation.navigate('ShopEnter',{storeinfo:storeinfo})}>
   <Image source={require('../../../assets/images/my/enter.png')} 
    style={{width:px(48),height:px(48),marginLeft: px(8),}}></Image>
    <View style={{height: px(48),flexDirection: 'column',
        justifyContent: 'space-between',marginLeft: px(14),}}>
  <Text style={[styles.entertx,{marginTop: px(4),}]}>+商品录入</Text>
    <Text style={styles.pricedes}>点击快速录入商品～</Text>
    </View>
</TouchableOpacity>

<TouchableOpacity style={{width: px(361),height: px(64),backgroundColor: '#fff',
marginTop: px(16),borderRadius: px(6),flexDirection: 'row',alignItems: 'center',
}} onPress={()=>navigation.navigate('Playmateadd',{storeinfo:storeinfo})}>
   <Image source={require('../../../assets/images/my/peiwan.png')} 
    style={{width:px(48),height:px(48),marginLeft: px(8),}}></Image>
    <View style={{height: px(48),flexDirection: 'column',
        justifyContent: 'space-between',marginLeft: px(14),}}>
  <Text style={[styles.entertx,{marginTop: px(4),}]}>+陪玩录入</Text>
    <Text style={styles.pricedes}>点击快速录入陪玩～</Text>
    </View>
</TouchableOpacity>

<View style={{width: px(361),backgroundColor: '#fff',
    marginTop: px(16),borderRadius: px(8),paddingBottom:px(18)
}}>
    <View style={{marginTop: px(8),marginLeft: px(8),}}>
<Text style={styles.todaydata}>其它功能</Text>
    </View>
<View style={{marginLeft: px(29),marginTop: px(16),flexDirection: 'row',
    flexWrap: 'wrap',    columnGap:px(35), // 横向间距
    rowGap:px(18),    // 纵向间距
}}>
<TouchableOpacity style={{flexDirection: 'column',alignItems: 'center',}}
 onPress={()=>navigation.navigate('ShopSetting',{storeinfo:storeinfo})}>
  <Image source={require('../../../assets/images/my/other1.png')} 
    style={{width:px(33),height:px(33),}}></Image>
    <Text style={styles.bottomdes}>店铺设置</Text>
</TouchableOpacity>
<TouchableOpacity style={{flexDirection: 'column',alignItems: 'center',}}
 onPress={()=>navigation.navigate('ShopManage',{storeinfo:storeinfo})}>
  <Image source={require('../../../assets/images/my/other5.png')} 
    style={{width:px(33),height:px(33),}}></Image>
    <Text style={styles.bottomdes}>商品管理</Text>
</TouchableOpacity>
<TouchableOpacity style={{flexDirection: 'column',alignItems: 'center',}}
 onPress={()=>goemploye()}>
  <Image source={require('../../../assets/images/my/other3.png')} 
    style={{width:px(33),height:px(33),}}></Image>
    <Text style={styles.bottomdes}>员工管理</Text>
</TouchableOpacity>
<TouchableOpacity style={{flexDirection: 'column',alignItems: 'center',}}
 onPress={()=>navigation.navigate('PlaymateList',{storeinfo:id})}>
  <Image source={require('../../../assets/images/my/peiwanic.png')} 
    style={{width:px(33),height:px(33),}}></Image>
    <Text style={styles.bottomdes}>陪玩管理</Text>
</TouchableOpacity>
<TouchableOpacity style={{flexDirection: 'column',alignItems: 'center',}}
 onPress={()=>navigation.navigate('ShopNotice',{storeinfo:id})}>
  <Image source={require('../../../assets/images/my/other6.png')} 
    style={{width:px(33),height:px(33),}}></Image>
    <Text style={styles.bottomdes}>店铺公告</Text>
</TouchableOpacity>
</View>
</View>


</View>
    </View>
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
    bottomdes:{
 fontFamily: 'MiSans-Regular',
        fontSize:px(12),
        color:'#1A1A1A',
        fontWeight:400,
        lineHeight:px(16),
    },
    entertx:{
 fontFamily: 'MiSans-Medium',
        fontSize:px(16),
        color:'#000000',
        //fontWeight:500,
        lineHeight:px(21),
    },
    servetx:{
 fontFamily: 'MiSans-Medium',
        fontSize:px(12),
        color:'#1A1A1A',
        //fontWeight:500,
        lineHeight:px(16),
    },
        pricedes:{
 fontFamily: 'MiSans-Regular',
        fontSize:px(12),
        color:'#AAAAAA',
        //fontWeight:500,
        lineHeight:px(16),
    },
    price:{
 fontFamily: 'MiSans-Medium',
        fontSize:px(13),
        color:'#1A1A1A',
        //fontWeight:500,
        lineHeight:px(17),
    },
    alldata:{
 fontFamily: 'MiSans-Regular',
        fontSize:px(12),
        color:'#AAAAAA',
        fontWeight:400,
        lineHeight:px(16),
    },
    todaydata:{
 fontFamily: 'MiSans-Medium',
        fontSize:px(14),
        color:'#000000',
        //fontWeight:500,
        lineHeight:px(19),
    },
            clubname:{
              //backgroundColor: 'red',
              width: px(185),
 fontFamily: 'MiSans-Medium',
        fontSize:px(18),
        color:'#1A1A1A',
        //fontWeight:500,
        lineHeight:px(22),
    },
            score:{
 fontFamily: 'MiSans-Regular',
        fontSize:px(14),
        color:'#AAAAAA',
        fontWeight:400,
        lineHeight:px(18),
    },
    container:{
        flex: 1,
        backgroundColor: '#F2F3F5',
    }
})