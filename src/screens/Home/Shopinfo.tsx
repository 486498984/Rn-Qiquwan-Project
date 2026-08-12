import { StyleSheet, Text, View,Image,StatusBar,TouchableOpacity,ScrollView,
Platform,BackHandler,Animated,ActivityIndicator,DeviceEventEmitter,AppState,
TextInput,KeyboardAvoidingView,NativeModules,
 } from 'react-native'
import React,{useState,useEffect,useRef,useMemo} from 'react'
import { px } from '../../utils/scaleUtils';
import LinearGradient from 'react-native-linear-gradient';
import StarRating from '../../components/Club/StarRating'
import BottomSheet from '../../components/Home/BottomSheet'
import Comment from './components/Comment'
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Stepper, Toast } from '@ant-design/react-native'
import Carousel from 'react-native-reanimated-carousel'
import { IMG_URL } from '../../api/config';
import FastImage from 'react-native-fast-image';
import ImagePreviewer from '../../components/Shop/ImagePreviewer';
import request from '../../api/request';
import { pay } from '@react-native-hero/alipay';
import Storage from '../../utils/storage';
import PaymentLoadingModal from '../../components/Home/PaymentLoadingModal'; // 引入组件
import SafeFastImage from '../../components/Home/SafeFastImage'
 import * as WeChat from 'react-native-wechat-lib';
 import useAuthStore from '../../utils/zustand';
import { trackOAID } from '../../utils/oaidTracker';
import {
  reportActivePay,
} from '../../utils/bdConvert';



const { OaidModule } = NativeModules;
  const commnet=[{title:'东*******',content:'没毛病，很牛逼！！！'},
      {title:'西*******',content:'战绩可查，NB!'},
      {title:'南*******',content:'有打架的实力，带老板的思维差点意思，只知道自己冲，有点顾头不顾尾了。'},
      {title:'2131',content:'213122'},
      {title:'2131',content:'213122'},
  ]
   const data = [
    require('../../../assets/images/home/shop11.png'),
    require('../../../assets/images/home/shop11.png'),
    require('../../../assets/images/home/shop11.png'),
  ]

export default function Shopinfo({navigation,route}) {

    const triggerListOrderRefresh =
    useAuthStore(
        state => state.triggerListOrderRefresh
    );
  const { shopinfo,playinfo,isopen } = route.params || {};
  const insets = useSafeAreaInsets();
  const bottomSafeHeight = insets.bottom; // 底部安全区高度（数值）
  const [visible, setVisible] = useState(false); //下单弹窗
  const [yvisible, setYvisible] = useState(false); //优惠券弹窗
  const [chshoptype, setChshoptype] = useState(0); //选择商品类型
  const [chshoptypezz, setChshoptypezz] = useState(0); //选择增值服务
  const [payways, setPayways] = useState(2); //支付方式
  const [coupon, setCoupon] = useState(0); //优惠券
  const [selectedCoupon, setSelectedCoupon] = useState(null);
  const [paynum, setPaynum] = useState(1); //购买数量
  const [headimg, setHeadimg] = useState(data); //头图logo 
  const [conimage, setConimage] = useState(null); //商品相册
  const [headimgview, setHeadimgview] = useState(data); //预览图
  const [previewVisible, setPreviewVisible] = useState(false); //logo开关
  const [headimgviewcon, setHeadimgviewcon] = useState(data); //商品相册预览图
  const [previewVisiblecon, setPreviewVisiblecon] = useState(false); //商品相册开关
  const [currentIndex, setCurrentIndex] = useState(0); //头图下标
  const [currentIndexcon, setCurrentIndexcon] = useState(0); //商品相册下标
  //console.log(bottomSafeHeight);   
  const [isfollw, setIsfollw] = useState(false)
  const [shopallinfo, setShopallinfo] = useState(null); //商品详情
  const [storeinfo, setStoreinfo] = useState(null); //店铺详情
  const [ratioMap, setRatioMap] = useState({});
  const [storelogo, setStorelogo] = useState(null); //店铺logo
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const [selectedAddons, setSelectedAddons] = useState([]); // ⭐ 增值服务多选
  //const [finalPrice, setFinalPrice] = useState(0); // ⭐ 最终价格
  const [coulist, setCoulist] = useState(null); //优惠券列表
  const [loading, setLoading] = useState(false);//支付弹窗
  const [comments, setComments] = useState([]);//评论列表
  const [commentsall, setCommentsall] = useState(null);//评论详情
  const [username, setUsername] = useState("");//备注信息
  const scrollRef = useRef(null);




       const onChangeText = (e) => { 
           console.log(e);
           setUsername(e)
         };

  const handleback = () => {  //返回上一页
    navigation.goBack();
  };
  const handlechangenum = (e) => {
    console.log(e);
    setPaynum(e)
  };
  const [index, setIndex] = useState(0)
useEffect(() => {
  if (!Array.isArray(conimage)) return;

  conimage.forEach((item) => {
    Image.getSize(item.uri, (w, h) => {
      setRatioMap(prev => ({
        ...prev,
        [item.uri]: w / h
      }));
    });
  });
}, [conimage]);
  useEffect(() => {
    if(isopen){
    setVisible(isopen)
    }
    console.log('详情123',shopinfo);
    if(shopinfo!==null&&shopinfo!==undefined){
      getshopinfo(shopinfo.id) //获取商品详情
      //getstoreinfo(shopinfo.storeId) //获取店铺详情
      getcoments(shopinfo.id) //获取评论
      getfavorites(shopinfo.id); //获取收藏状态
      console.log('21321321',getImageData(shopinfo?.images));
     //setHeadimg(getImageData(shopinfo?.coverImage));
     //setHeadimgview(getImageList(shopinfo?.coverImage));
    }
  }, [shopinfo])
const getshopinfo = async (e) => {
  console.log(e);
  
  try {
    const response = await request({
      url: '/goods/detail',
      method: 'GET',
      data: {},
      query: { id: e }
    });
  console.log(response);
  
    if (response.data !== undefined && response.code == 0) {
      if(response.data.skuList==null){
            Toast.show({ 
              content: '该商品暂时无法下单，请稍后重试～',
              duration: 2,
              position: 'center',
              mask: false,
            })
        handleback();
      return
      }
      const infodata = response.data;
      setHeadimg(getImageData(infodata.coverImage));
      setHeadimgview(getImageList(infodata.coverImage));
      setShopallinfo(infodata);
      setConimage(getImageData(infodata.images));
      setHeadimgviewcon(getImageList(infodata.images));
 
      // ⭐ 核心逻辑：根据 minPriceId 找下标
      if (Array.isArray(infodata.skuList) && shopinfo?.minPriceId) {
        const index = infodata.skuList.findIndex(
          item => item.id === shopinfo.minPriceId
        );
    if (index !== -1 && infodata.skuList[index].quantity > 0) {
      setChshoptype(index);
    } else {
      // 找第一个有库存的
      const firstAvailable = infodata.skuList.findIndex(i => i.quantity > 0);
      if (firstAvailable !== -1) {
        setChshoptype(firstAvailable);
      }
    }
      }
    getstoreinfo(response.data.storeId)  
    }else{
       Toast.info({content:'该商品已被删除，无法下单',mask:false,duration:2});
      handleback()
    }
  } catch (error) {
    console.error(error);
  }
};
const getuserprofile = async() => { 
  const user = await Storage.get("userinfo");
           try {
             const response = await request({
               url: '/user/profile',
               method: 'GET',
               data:{},
               query: { userId: user.user.userId }
             });
             console.log(response);
            if(response.data!==undefined&&response.code==0){
              if(response.data.profile.realName&&response.data.profile.idCardNum){
               return true
              }else{
                   return false
              }
            }else{
            return false
            }
           } catch (error) {
            return false
             console.error(error);
           }

 };
   const getstoreinfo = async(e) => { 
   try {
      const response = await request({
        url: '/store/detail',
        method: 'GET',
        data:{},
        query: { id: e }
      });
      console.log(response);
      if(response.data!==undefined&&response.code==0){
       const infodata=response.data
       setStoreinfo(infodata) 
       setStorelogo(getImageData(infodata.storeLogo))
       console.log(getImageData(infodata.storeLogo));
       return response.data
      }else{
      return null;
      }
    } catch (error) {
      console.error(error);
      return null;
    }
    };
    const getcoments = async(e) => { 
   try {
      const response = await request({
        url: '/goods/comments',
        method: 'GET',
        data:{},
        query: { 
          goodsId: e,
          page:1,
          size:10
         }
      });
      console.log('comments1',response);
      if(response.data!==undefined&&response.code==0){
       const infodata=response.data
       setCommentsall(infodata)
       if(infodata.list!==null){
        setComments(infodata.list)
       }

      }
    } catch (error) {
      console.error(error);
    }
     };
     const getfavorites = async(e) => { 
   try {
      const response = await request({
        url: '/favorites/status',
        method: 'GET',
        data:{},
        query: { 
          goodsId: e,
         }
      });
      console.log('favorites',response);
      if(response.data!==undefined&&response.code==0){
      setIsfollw(response.data.isFavorited)
      }
    } catch (error) {
      console.error(error);
    }
      };
const getImageList = (str) => {
  const domain = IMG_URL;

  return (str || "")
    .split(",")
    .filter(Boolean)
    .map((item) => ({
      uri: domain + item.trim(),
    }));
};
  const getImageData = (str) => {
  const domain = IMG_URL;
  return (str || "")
    .split(",")
    .filter(Boolean)
    .map((item) => ({
      uri: domain + item.trim(),
    }));
};
const formatText = (str) => {
  return (str || "")
    .split(",")
    .filter(Boolean)
    .join(" | ");
};
const handleFollow = async () => {
   const user = await Storage.get("userinfo");
   if(user==null){
    Toast.info({content:'请先完成登陆',mask:false});
    navigation.navigate('Login')
    return;
   }

  followtoggle();

};
const followtoggle = async() => {  //收藏
     const user = await Storage.get("userinfo");

   try {
      const response = await request({
        url: '/favorites/toggle',
        method: 'PUT',
        data:{
          goodsId: shopallinfo?.id
        },
        query: { 
          userId: user.user.userId,
         }
      });
      console.log('favoritescreate',response);
      if(response.data!==undefined&&response.code==0){
       if(response.data.isFavorited){
       Toast.info({content:'收藏成功',mask:false,duration:1});
      // 接口成功才更新状态
      setIsfollw(true);
      // 再执行动画
      runFollowAnim();
      }else{
      setIsfollw(false);
      }
      }else{
     Toast.info({content:'出错了，请稍后再试～',mask:false,duration:1});
      }
    } catch (error) {
      console.error(error);
    }
 };

const runFollowAnim = () => {
  Animated.sequence([
    Animated.timing(scaleAnim, {
      toValue: 1.3,
      duration: 120,
      useNativeDriver: true,
    }),
    Animated.timing(scaleAnim, {
      toValue: 1,
      duration: 120,
      useNativeDriver: true,
    }),
  ]).start();
};
const toggleAddon = (index) => {
  setSelectedAddons(prev => {
    if (prev.includes(index)) {
      // ❌ 已选 → 取消
      return prev.filter(i => i !== index);
    } else {
      // ✅ 未选 → 添加
      return [...prev, index];
    }
  });
};
const finalPrice = useMemo(() => {
  if (!shopallinfo) return 0;

  const mainSku = shopallinfo?.skuList?.[chshoptype];
  const mainPrice = mainSku?.price || 0;

  const addonTotal = selectedAddons.reduce((sum, index) => {
    const addon = shopallinfo?.addonList?.[index];
    return sum + (addon?.price || 0);
  }, 0); 

  //let total = mainPrice * paynum + addonTotal;
  // 主商品 + 增值服务 都乘数量
  let total = (mainPrice + addonTotal) * paynum;

  if (selectedCoupon) {
    const { fullAmount = 0, reduceAmount = 0 } = selectedCoupon;
    if (total >= fullAmount) {
      total -= reduceAmount;
    }
  }

  return Math.max(total, 0);
}, [shopallinfo, chshoptype, paynum, selectedAddons, selectedCoupon]);
useEffect(() => {
  if (!shopallinfo) return;
  getcoupons();
}, [shopallinfo, chshoptype, paynum, selectedAddons]);
 const getcoupons = async() => {  //获取优惠券列表
    const user = await Storage.get("userinfo")
    if(user==null){
    return;
   }
    try {
    const response = await request({
      url: '/user/coupons/available-for-order',
      method: 'POST',
      data: {
      userId: user.user.userId,
      totalAmount: finalPrice,
      goodsIds: [shopallinfo?.id]
      },
      query: {},
    }); 
    console.log(response);
  if (response.data !== null && response.code == 0) {
  const list = response.data || [];
  setCoulist(list);

  // ⭐ 默认选第一张可用券
  if (list.length > 0) {
  setCoulist(list);

  setSelectedCoupon(prev => {
    if (!prev) return list[0] || null;

    // 判断当前券是否还有效
    const stillValid = list.find(i => i.id === prev.id);
    return stillValid ? prev : (list[0] || null);
  });
  } else {
    setSelectedCoupon(null);
  }
} else {
  setCoulist([]);
  setSelectedCoupon(null);
}
  } catch (error) {
    console.error(error);
  }
 };
 const addonIds = selectedAddons.map(index => {
  return shopallinfo?.addonList?.[index]?.id;
}).filter(Boolean);
const handlecreatorder = async() => { //创建订单
    const user = await Storage.get("userinfo");
   if(user==null){
    Toast.info({content:'请先完成登陆',mask:false});
    navigation.navigate('Login')
    return;
   }
    const userprofile = await getuserprofile();
     if (!userprofile) {
    Toast.info({
      content: '请先完成实名认证才可以下单',
      mask: false
    });
    navigation.navigate('Setting')
    return;
  }
    // 查询店铺状态
  const storeData = await getstoreinfo(storeinfo?.id);
  console.log(storeData);
  // 店铺关闭
  if (storeData?.openStatus !== 'OPEN') {
    Toast.info({
      content: '店铺已打烊，暂时无法下单',
      mask: false
    });
    return;
  }
  // const config = JSON.parse(storeData.openHours);
  //   if (!isInTimeRange(config)) {
  //   Toast.info({
  //     content: '当前不在店铺营业时间，暂时无法下单',
  //     mask: false
  //   });
  //   return;
  // }
    //setLoading(true)
    console.log(selectedCoupon ? [selectedCoupon.userCouponId] : []);
    console.log(shopallinfo,shopallinfo?.skuList[chshoptype].id);
    let remark={
      user:username,
      store:'',
      platform:'',
    }
  const attrData:any = {
    source: "app",
  };
  if(playinfo?.player){
    attrData.playerId = playinfo.player.id;
    attrData.nickName = playinfo.player.nickName;
  }
  console.log(attrData);
  try {
    const response = await request({
      url: '/order/create',
      method: 'POST',
      data: {
      userId: user.user.userId,
      storeId: storeinfo?.id,
      goodsId: shopallinfo?.id,
      skuId: shopallinfo?.skuList[chshoptype].id,
      addonIds: addonIds,
      quantity: paynum,
      paymentType:payways==1? "ALIPAY":'WECHAT',
      couponReceiveIds: selectedCoupon ? [selectedCoupon.userCouponId] : [],
      remark: JSON.stringify(remark),
      attr: JSON.stringify(attrData),
      },
      query: {},
    });
    console.log('创建订单',response);
    if (response.data !== undefined && response.code == 0) {
    const res = response.data.payInfo
    if(payways==1){
    handlePay(response.data.payInfo.payInfo,response.data.payAmount)
    }else if(payways==2){
    console.log('shoplistdw',shopallinfo,paynum,response.data.payAmount);

    let payload={
    partnerId: res.payParams.partnerid,
    prepayId: res.prepayId,
    nonceStr: res.payParams.noncestr,
    timeStamp: res.payParams.timestamp,
    package: res.payParams.package,
    sign: res.payParams.sign,
    }
    handlewechatpay(payload,response.data.payAmount)
    }
    if(Platform.OS=='android'){
    trackOAID();
    }
    }
  } catch (error) {
    console.error(error);
  }
 };
 function isInTimeRange(config) {
  const now = new Date();

  // 当前星期（1-7）
  let currentWeek = now.getDay();
  currentWeek = currentWeek === 0 ? 7 : currentWeek;

  // 当前分钟数
  const currentMinutes =
    now.getHours() * 60 + now.getMinutes();

  // 开始分钟数
  const startMinutes =
    config.start[0] * 60 + config.start[1];

  // 结束分钟数
  const endMinutes =
    config.end[0] * 60 + config.end[1];

  // 星期范围
  const startWeek = Number(config.week[0]);
  const endWeek = Number(config.week[1]);

  // 是否在星期范围
  const inWeekRange =
    currentWeek >= startWeek &&
    currentWeek <= endWeek;

  // 是否在时间范围
  const inTimeRange =
    currentMinutes >= startMinutes &&
    currentMinutes <= endMinutes;

  return inWeekRange && inTimeRange;
}

 const handlewechatpay = async(e,payAmount) => { 
  console.log('wechatpay',e,payAmount);
    try {
      // 检查微信是否安装
      const isInstalled = await WeChat.isWXAppInstalled();
      if (!isInstalled) {
        Toast.show({
        content: '请先安装微信',
        duration: 2,
        position: 'center',
        mask: false,
      })
        return;
      }

      // 调用支付
      const result = await WeChat.pay(e);
      console.log('result123:',result);

      if (result.errCode === 0) {
        console.log('微信支付成功！');
        
         setLoading(false)
         triggerListOrderRefresh();
        // 支付成功
          goorder(3)
          Toast.show({
          content: '您已完成支付，请等待商家服务',
          duration: 2,
          position: 'center',
          mask: false,
        })
        await reportActivePay({
          amount: payAmount,
          currency: 'CNY',
          paymentChannel: 'wechat',
          contentId: JSON.stringify(shopallinfo?.id),
          contentName: shopallinfo?.title,
          success: true,
        });
      } else {
        console.log('shoplistdw',shopallinfo);
        
         setLoading(false)
        // 支付失败或取消

      }

    } catch (error: any) {
       setLoading(false)
       triggerListOrderRefresh();
       //console.error('微信支付异常', error);
         Toast.show({
          content: '您已取消支付，请尽快完成支付',
          duration: 2,
          position: 'center',
          mask: false,
        })
      navigation.goBack();
      goorder(2)
    }

  };
  const handlePay = async (e,payAmount) => {
    console.log('alipay113',e,payAmount);
    
    try {
      // 👉 这里应该从后端获取
      const orderString = e;

      const res = await pay({
        orderString,
        appScheme: 'alipay2021006140652743',
      });

      console.log('支付返回:', res);

      const result = res?.data?.alipay_trade_app_pay_response;

      if (result?.code === '10000') {
         goorder(3)
         triggerListOrderRefresh();
          Toast.show({
          content: '您已完成支付，请等待商家服务',
          duration: 2,
          position: 'center',
          mask: false,
        })
          await reportActivePay({
          amount: payAmount,
          currency: 'CNY',
          paymentChannel: 'alipay',
          contentId: JSON.stringify(shopallinfo?.id),
          contentName: shopallinfo?.title,
          success: true,
        });
        console.log('支付成功');
      } else {
        console.log('支付未完成');
      }
     setLoading(false)
    } catch (err) {
      console.log('支付失败:', err);
      if (err.code === 6001) {
        triggerListOrderRefresh();
         navigation.goBack();
        goorder(2)
        console.log('用户取消支付');
         Toast.show({
          content: '您已取消支付，请尽快完成支付',
          duration: 2,
          position: 'center',
          mask: false,
        })
      }
       setLoading(false)
    }
  };
      const goorder = (e) => {  //跳转订单
        console.log(e);
       navigation.navigate('Order',{e:1})
      };
      const formatDateTime = (isoString) => {
      const date = new Date(isoString);

      const pad = (n) => (n < 10 ? '0' + n : n);

      const year = date.getFullYear();
      const month = pad(date.getMonth() + 1);
      const day = pad(date.getDate());
      const hour = pad(date.getHours());
      const minute = pad(date.getMinutes());

      return `${year}-${month}-${day} ${hour}:${minute}`;
      };

        const handlegokefu = async() => {
  console.log(shopallinfo);
  
      const user = await Storage.get("userinfo");
      console.log(user);
      if(user==null){ //未登陆的情况
      Toast.info({content:'请先完成登陆',mask:false});
      return
      }

             try {
             const response = await request({
               url: '/customer/get',
               method: 'GET',
               data:{},
               query: {
                //userId:user.user.userId,
                storeId:shopallinfo.storeId
              }
             });
             console.log(response);
            if(response.data!==undefined&&response.code==0){
              console.log(response.data.userId);
                
              let a={
                storeName: shopallinfo.storeName,
                storeId: response.data.keeper.storeId,
                id: response.data.keeper.sessionId,
              }
              console.log(a);
            navigation.navigate('OneChat',{item:a})
            }else{
            Toast.show({
                content: response.data,
                duration: 2,
                position: 'center',
                mask: false,
              })
            }
           } catch (error) {
             console.error(error);
           }
  };
  const getTotalSales = () => {
  let virtualSales = 0;

  if (shopallinfo?.attr) {
    try {
      const attrData = JSON.parse(shopallinfo.attr);
      virtualSales = Number(attrData?.virtualSales || 0);
    } catch (error) {
      console.log('attr解析失败:', error);
    }
  }

  const salesCount = Number(shopallinfo?.salesCount || 0);

  return virtualSales + salesCount;
};

const totalSales = getTotalSales();


   const [isReady, setIsReady] = useState(false);
       useEffect(() => {
      const timer = setTimeout(() => {
        setIsReady(true);
      }, 1); // 0.5~1s 都可以
  
      return () => clearTimeout(timer);
    }, []);
    // ⭐ 1. 未就绪 -> 只渲染轻量 loading
if (!isReady) {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
      }}
    >
      <ActivityIndicator size="large" color="#FC9026" />
    </View>
  );
} 


  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={()=>handleback()} style={{
      backgroundColor: 'rgba(26, 26, 26,0.4)',position: 'absolute',top:px(58),
  width:px(26),height:px(26),marginLeft: px(16),borderRadius: px(4),zIndex: 1,
  flexDirection: 'row',alignItems: 'center',justifyContent: 'center',
}}>
<Image source={require('../../../assets/images/my/wleft.png')} 
style={{width:px(20),height:px(20)}}></Image>
</TouchableOpacity>
        {/* <StatusBar barStyle="light-content" /> */}
        <ScrollView showsVerticalScrollIndicator={false}
        contentContainerStyle={{paddingBottom:px(50)}} overScrollMode="never" 
        bounces={false}  >
    <TouchableOpacity style={{position: 'relative',width:px(393),height:px(360)}}
   onPress={()=>setPreviewVisible(true)} activeOpacity={1}>
      <Carousel
        width={px(393)}
        height={px(360)}
        data={headimg}
        loop
        autoPlay
        autoPlayInterval={3000}
        onProgressChange={(_, absoluteProgress) => {
          //setIndex(Math.round(absoluteProgress))
        }}
        renderItem={({ item }) => (
          <SafeFastImage
            source={item}
            style={{width: px(393),height: px(360),}}
            resizeMode="stretch"
          />
        )}
      />
    </TouchableOpacity>
   <View style={{width: '100%',paddingHorizontal:px(16),marginTop: px(16),}}>
 <View style={{flexDirection: 'row',alignItems: 'flex-end',
    justifyContent: 'space-between',}}> 
    <View style={{flexDirection: 'row',alignItems: 'flex-end',}}>
    <Text style={styles.isprice}>￥{shopallinfo?.minPrice ? shopallinfo.minPrice / 100 : 128}</Text>
     <Text style={styles.smallprice}>
       ￥{
       shopallinfo?.minOriginalPrice != null
        ? shopallinfo.minOriginalPrice / 100
        : "-"
        }
     </Text>
    </View>
{totalSales > 0 && (
  <Text style={styles.salesnum}>
    月销量{totalSales}+
  </Text>
)}
      </View>
      <Text style={[styles.shoptitle,{marginTop: px(10),}]}>{shopallinfo?.title}</Text>
   </View>
<View style={{width: '100%',flexDirection: 'row',alignItems: 'center',
    justifyContent: 'center',gap:px(22),marginTop: px(10),}}>
<View style={{flexDirection: 'column',alignItems: 'center',}}>
<Text style={styles.desone}>地图</Text>
<Text style={styles.destwo}>{shopallinfo?.map}</Text>
</View>
<View style={{width: px(1),height: px(28),backgroundColor: "rgba(118, 118, 118,0.2)",}}></View>
<View style={{flexDirection: 'column',alignItems: 'center',}}>
<Text style={styles.desone}>模式</Text>
<Text style={styles.destwo}>{shopallinfo?.difficulty}</Text>
</View>
<View style={{width: px(1),height: px(28),backgroundColor: "rgba(118, 118, 118,0.2)",}}></View>
<View style={{flexDirection: 'column',alignItems: 'center',}}>
<Text style={styles.desone}>平台</Text>
<Text style={styles.destwo}>{shopallinfo?.platform}</Text>
</View>
<View style={{width: px(1),height: px(28),backgroundColor: "rgba(118, 118, 118,0.2)",}}></View>
<View style={{flexDirection: 'column',alignItems: 'center',}}>
<Text style={styles.desone}>炸单</Text>
<Text style={styles.destwo}>包赔</Text>
</View>
<View style={{width: px(1),height: px(28),backgroundColor: "rgba(118, 118, 118,0.2)",}}></View>
<View style={{flexDirection: 'column',alignItems: 'center',}}>
<Text style={styles.desone}>开挂</Text>
<Text style={styles.destwo}>必赔</Text>
</View>
</View>

<View style={{marginTop: px(10),width: '100%',}}>
  <LinearGradient
  colors={['rgba(255, 149, 0, 0)', 'rgba(255, 149, 0,0.1)']} // 渐变颜色
  start={{ x: 1, y: 0 }}   
  end={{ x: 0, y: 0 }}
  style={styles.gradientBox}
  >
 <View style={{gap:px(12),paddingVertical:px(7)}}>
  {shopallinfo?.productTag!==''&&
<View style={{flexDirection: 'row',alignItems: 'center',gap:px(8),marginLeft: px(16)}}>
  <Image source={require('../../../assets/images/home/guarantee1.png')} 
         style={{width:px(15),height:px(15)}}></Image>
<Text style={styles.guaone}>商品标签</Text>
<Text style={styles.guatwo}>{formatText(shopallinfo?.productTag)}</Text>
</View>
}
{shopallinfo?.freeService!==''&&
<View style={{flexDirection: 'row',alignItems: 'center',gap:px(8),marginLeft: px(16),}}>
  <Image source={require('../../../assets/images/home/guarantee2.png')} 
         style={{width:px(15),height:px(15)}}></Image>
<Text style={styles.guaone}>免费服务</Text>
<Text style={styles.guatwo}>{formatText(shopallinfo?.freeService)}</Text>
</View>
}
{shopallinfo?.serviceIds!==''&&
<View style={{flexDirection: 'row',alignItems: 'center',gap:px(8),marginLeft: px(16),}}>
  <Image source={require('../../../assets/images/home/guarantee3.png')} 
         style={{width:px(15),height:px(15)}}></Image>
<Text style={styles.guaone}>店铺保障</Text>
<Text style={styles.guatwo}>{formatText(shopallinfo?.serviceIds)}</Text>
</View>
}
</View>

</LinearGradient>
</View>

<View style={{width: '100%',height: px(75),flexDirection: 'row',
alignItems: 'center',justifyContent: 'space-between',
paddingHorizontal:px(16),marginTop: px(16),
}}>
  <View style={{flexDirection: 'row',alignItems: 'center',}}>
  <View style={{width:px(75),height:px(75),position: 'relative',}}>
<Image
  source={
    storelogo
      ? { uri: storelogo[0]?.uri }
      : require('../../../assets/images/home/club1.png')
   }
  style={{ width: px(75), height: px(75), borderRadius: px(4) }}
/>
             <LinearGradient
                        colors={['#FDD888', '#FCF5E3']} // 渐变颜色
                        start={{ x: 1, y: 0 }}   
                        end={{ x: 0, y: 0 }}
                        style={styles.bgradientBox}
                      >
                       <View style={{paddingHorizontal:px(3)}}>
                      <Text style={styles.clubdes}>平台保障</Text> 
                       </View>
                      </LinearGradient>
     </View>
    <View style={{flexDirection: 'column',marginLeft: px(6),
        justifyContent: 'space-between',height:px(75)}}>
 <View style={{flexDirection: 'row',alignItems: 'flex-start',gap:px(3)}}>
<Image source={require('../../../assets/images/club/champion.png')} 
      style={{width:px(17),height:px(17),}}></Image>
<Text style={styles.clubname} numberOfLines={2}>{storeinfo?.storeName}</Text>
</View>
<View style={{flexDirection: 'column',gap:px(2)}}>
  <View style={{flexDirection: 'row',alignItems: 'center',gap:px(3)}}>
<StarRating score={5}></StarRating>
   </View>
<View style={{flexDirection: 'row',alignItems: 'center',gap:px(8)}}>
<View style={{height: px(17),backgroundColor: '#FEF7E0',paddingHorizontal:px(8),
  borderRadius: px(4),flexDirection: 'row',alignItems: 'center',justifyContent: 'center',
}}>
<Text style={styles.recommen}>推荐指数</Text>
</View>
{/* <Text style={styles.follow}>4.8</Text> */}
<Text style={styles.follow}>{storeinfo?.followCount}关注</Text>
    </View>
</View>
    </View>
  </View>
   <TouchableOpacity 
   style={{}} onPress={()=>navigation.navigate('ClubHome',{storeinfo:storeinfo})}>
        <LinearGradient
       colors={['#FEC525', '#FC9026']} // 渐变颜色
       start={{ x: 1, y: 0 }}   
       end={{ x: 0, y: 0 }}
       style={styles.graguanBox}
       >
       <View style={{flexDirection: 'row',alignItems: 'center',}}>
       <Text style={styles.jointext}>进入</Text>
       </View>
       </LinearGradient>
   </TouchableOpacity>
</View>

<View style={{width: '100%',height: px(8),backgroundColor: '#F8F8F8',
    marginTop: px(10),
}}></View>
<View style={{flexDirection: 'column',marginTop: px(0),}}
>
{Array.isArray(conimage) && conimage.length > 0 &&
  conimage.map((item, index) => {
    const ratio = ratioMap[item.uri] || 1;
    return (
      <TouchableOpacity
        key={index}
        activeOpacity={1}
        onPress={() => {
          setCurrentIndexcon(index);       // ⭐ 设置当前索引
          setPreviewVisiblecon(true);   // 打开预览
        }}
      >
        <SafeFastImage
          source={{ uri: item.uri }}
          style={{
            width: px(393),
            aspectRatio: ratio,
          }}
          resizeMode="contain"
        />
      </TouchableOpacity>
    );
  })
}
{shopallinfo?.content ? (
  <View style={{ paddingHorizontal: px(16), marginTop: px(10) }}>
    <Text style={styles.desone}>
      {shopallinfo.content}
    </Text>
  </View>
) : null}
{comments.length!==0&&
<View style={{width: '100%',height: px(8),backgroundColor: '#F8F8F8',
    marginTop: px(10),
}}></View>
}
</View>

{comments.length!==0&&
<View style={{width: '100%',paddingHorizontal:px(16)}}>
<View style={{width: '100%',flexDirection: 'row',alignItems: 'center',
    justifyContent: 'space-between',marginTop: px(16),
}}>
<Text style={styles.comment}>用户评价</Text>
<TouchableOpacity style={{flexDirection: 'row',alignItems: 'center',
  paddingVertical:px(10),paddingLeft:px(10)}}
  onPress={()=> navigation.navigate('Allcomments',{id:shopallinfo?.id})}>
    <Text style={styles.comments}>全部评价</Text>
      <Image source={require('../../../assets/images/home/right.png')} 
         style={{width:px(16),height:px(16)}}></Image>
</TouchableOpacity>
</View>

<View style={{height: px(64),marginTop: px(0),}}>
<LinearGradient
colors={['rgba(216, 216, 216, 0)', 'rgba(216, 216, 216, 0.20)']} // 渐变颜色
start={{ x: 1, y: 0 }}   
end={{ x: 0, y: 0 }}
style={styles.comgraguanBox}
>
<View style={{flexDirection: 'row',alignItems: 'center',}}>
<Image source={require('../../../assets/images/home/star.png')} 
    style={{width:px(27),height:px(27),marginLeft: px(12),}}></Image>
    <Text style={[styles.renum,{marginLeft: px(3),}]}>{commentsall?.statistics?.avgRating.toFixed(1)}</Text>
    <View style={{width: px(1),height: px(27),
        backgroundColor: 'rgba(118, 118, 118,0.2)',marginLeft: px(12),}}></View>
        <View style={{flexDirection: 'column',marginLeft: px(12),gap:px(6)}}>
<Text style={styles.comall}>共{commentsall?.total}条评论</Text>
{/* <Text style={styles.jincomall}>近三个月服务99人 总计19人评论</Text> */}
</View>
</View>
</LinearGradient>
</View>
<View style={{width: '100%',}}>
    {comments?.map((item,index)=>
    <View key={index}>
     <Comment item={item}></Comment>
     {index!==comments.length-1&&
    <View style={{width: '100%',height: px(1),backgroundColor: '#F8F8F8',
    marginTop: px(10)}}></View>
     }
    </View>
    )}
</View>
</View>
}


</ScrollView>

<View style={[styles.botbox,{paddingBottom: bottomSafeHeight+(Platform.OS=='ios'?0 :px(6)),}]}>
   <View style={{marginTop: px(6),flexDirection: 'row',alignItems: 'center'}}>
    <View style={{flexDirection: 'row',alignItems: 'center',gap:px(0),marginLeft: px(18),}}>
<TouchableOpacity  style={{flexDirection: 'column',alignItems: 'center',
    width: px(46),
}} onPress={()=>navigation.navigate('ClubHome',{storeinfo:storeinfo})}>
 <Image source={require('../../../assets/images/home/game.png')} 
         style={{width:px(34),height:px(34)}}></Image>
<Text style={styles.botext}>俱乐部</Text>
</TouchableOpacity>

<TouchableOpacity  style={{flexDirection: 'column',alignItems: 'center',
    width: px(46),}} onPress={()=>handlegokefu()}>
 <Image source={require('../../../assets/images/home/kefu.png')} 
         style={{width:px(34),height:px(34)}}></Image>
<Text style={styles.botext}>客服</Text>
</TouchableOpacity>

<TouchableOpacity
  style={{
    flexDirection: 'column',
    alignItems: 'center',
    width: px(46),
  }}
  onPress={handleFollow}
  activeOpacity={1}
>
  <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
    <Image
      source={
        isfollw
          ? require('../../../assets/images/home/bostar.png')
          : require('../../../assets/images/home/nobostar.png')
      }
      style={{ width: px(34), height: px(34) }}
    />
  </Animated.View>

  <Text style={styles.botext}>收藏</Text>
</TouchableOpacity>
    </View>

<TouchableOpacity style={{marginLeft: px(13),}} 
onPress={() => setVisible(true)}>
 <LinearGradient
       colors={['#FEC525', '#FC9026']} // 渐变颜色
       start={{ x: 1, y: 0 }}   
       end={{ x: 0, y: 0 }}
       style={styles.txiadnaBox}
       >
       <View style={{flexDirection: 'row',alignItems: 'center',}}>
       <Text style={styles.xiadantx}>立即下单</Text>
       </View>
       </LinearGradient>
</TouchableOpacity>


    </View>
</View>

      <BottomSheet
        visible={visible}
        onClose={() => setVisible(false)}
        sheetHeight={px(745)}
       >
       <View style={{flexDirection:'column',height: px(745),
        paddingTop:px(16),
       }}>
  <View style={{flexDirection: 'row',alignItems: 'center',position: 'relative',
    paddingHorizontal:px(16)
  }}>

  <Image source={{uri:headimg[0].uri}} 
   style={{width:px(111),height:px(111),borderRadius: px(8),}}></Image>
   <TouchableOpacity onPress={()=>setVisible(false)} 
    style={{position: 'absolute',right:px(16),top:0}}>
     <Image source={require('../../../assets/images/my/close.png')} 
   style={{width:px(22),height:px(22),}}></Image>
   </TouchableOpacity>
<View style={{marginLeft: px(11),flexDirection: 'column',
  justifyContent: 'space-between',height: px(111),}}>
    <View style={{gap:px(3)}}>
 <View style={{flexDirection: 'row',alignItems: 'flex-end',}}>
  <Text style={styles.ispricev}>￥</Text>
    <Text style={styles.isprice}>{finalPrice/100}</Text>
     {/* <Text style={styles.smallprice}>￥388</Text> */}
    </View>
    <Text style={styles.modaldes}
    numberOfLines={1}>{formatText(shopallinfo?.serviceIds)}</Text>
    </View>
  <View style={{flexDirection: 'column',gap:px(6)}}>
  {/* <Text style={styles.modalnum}>编号：219739012479102</Text> */}
  <Stepper min={1} max={9999}  
  keyboardType="number-pad"
    returnKeyType="done"
  //readOnly 
  value={paynum}
  onChange={(value)=>handlechangenum(value)} 
  inputStyle={{
  fontFamily: 'MiSans-Medium',
  fontSize: px(15),
  color: '#1A1A1A',
  lineHeight: px(20),
  textAlign: 'center',
  textAlignVertical: 'center',
  }}
  styles={{
  container: { flexDirection: 'row', alignItems: 'center',},
  stepWrap: { width:px(26), height: px(26), borderRadius: px(2), backgroundColor: 'rgba(170, 170, 170,0.2)', justifyContent: 'center', alignItems: 'center' },
  stepText: { color: '#333', fontSize: px(16) },
  stepDisabled: { backgroundColor: '#eee' },
  disabledStepTextColor: { color: '#1A1A1A' },
  suffix:{height: px(26),width:px(26),},
  prefix:{height: px(26),width:px(26),},
  input:{flexDirection: 'row',
    alignItems: 'center',justifyContent: 'center',backgroundColor: '#fff',
  },
}} />
  </View>
</View>
</View>


  <KeyboardAvoidingView
    style={{ flex: 1 }}
    behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    keyboardVerticalOffset={px(0)}
  >
<ScrollView style={{marginTop: px(16),}} showsVerticalScrollIndicator={false}
contentContainerStyle={{paddingBottom:px(20)}} ref={scrollRef}>
{/* <View style={{width: '100%',height: px(8),
backgroundColor: '#F8F8F8',}}></View> */}
<View style={{flexDirection: 'column',}}>
  <View style={{paddingHorizontal:px(16)}}>
<Text style={styles.comment}>商品类型</Text>
 {shopallinfo?.skuList.map((item,index)=>
<TouchableOpacity onPress={() => {
  if (item.quantity === 0) {
    Toast.info({content:'该商品暂无库存',mask:false});
    return;
  }
  setChshoptype(index);
}} activeOpacity={0.8}
style={
  item.quantity === 0
    ? styles.disabledTypebox
    : chshoptype == index
    ? styles.istypebox
    : styles.typebox
}
 key={index}>
  <View style={{flexDirection: 'column',}}>
<Text style={[styles.typetitle,{width: (item.guarantee||item.quantity === 0) ?px(280):'100%',}]}>{item.title}</Text>
{item.subTitle ? (
  <Text style={[styles.botext, { paddingBottom: px(3) }]}>
    {item.subTitle}
  </Text>
) : (
  <View style={{ height: px(8) }} />
)}

  </View>
 <View style={{flexDirection: 'row',alignItems: 'flex-end',}}>
    <Text style={styles.sprice}>￥{item.price/100}</Text>
     <Text style={styles.ssmallprice}>￥{item.originalPrice/100}</Text>
    </View>
    {item.quantity === 0 && (
  <View style={{
    position: 'absolute',
    top: 0,
    right: 0,
    backgroundColor: '#999',
    paddingHorizontal: px(8),
    paddingVertical:px(4),
    borderTopRightRadius: px(14),
    borderBottomLeftRadius: px(14),
  }}>
    <Text style={styles.righttext}>
      已售罄
    </Text>
  </View>
)}
 {item.guarantee ? (
  <LinearGradient
    colors={['#FEC525', '#FC9026']}
    start={{ x: 1, y: 0 }}
    end={{ x: 0, y: 0 }}
    style={chshoptype == index ? styles.isrightBox : styles.rightBox}
  >
    <View style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: px(8) }}>
      <Text style={styles.righttext}>
        保底{item.guarantee}W
      </Text>
    </View>
  </LinearGradient>
) : null}
</TouchableOpacity>
)}
 {shopallinfo?.addonList!==null&&
 <View>
<Text style={[styles.comment,{marginTop: px(20),}]}>增值服务</Text>
 {shopallinfo?.addonList.map((item,index)=>
<TouchableOpacity onPress={() => toggleAddon(index)}
style={selectedAddons.includes(index) ? styles.istypeboxzz : styles.typeboxzz} key={index}>
  <View style={{flexDirection: 'column',}}>
<Text style={styles.typetitle}>{item.title}</Text>
{/* <Text style={styles.botext}>暗星燃料x1，勇敢者之证x1</Text> */}
  </View>
 <View style={{flexDirection: 'row',alignItems: 'flex-end',}}>
    <Text style={styles.sprice}>￥{item.price/100}</Text>
     {/* <Text style={styles.ssmallprice}>￥388</Text> */}
    </View>
</TouchableOpacity>
)}</View>
 }


<View style={{flexDirection: 'row',alignItems: 'center',marginTop: px(16),
  justifyContent: 'space-between',
}}>
<Text style={styles.modalnum}>优惠券</Text>
<TouchableOpacity style={{flexDirection: 'row',alignItems: 'center',
  height: px(22),
}}
onPress={()=>setYvisible(true)}>
  <Text style={styles.pricered}>
   {
    coulist?.length === 0
      ? '暂无可用'
      : selectedCoupon
      ? selectedCoupon.couponName
      : '请选择'
  }
  </Text>
    <Image source={require('../../../assets/images/home/right.png')} 
   style={{width:px(16),height:px(16)}}></Image>
</TouchableOpacity>
</View>
<View style={{marginTop: px(0),flexDirection: 'row',alignItems: 'center',
  justifyContent: 'space-between',
}}>
  <View style={{flexDirection: 'row',alignItems: 'center',}}>
<Text style={styles.shifutx}>实付：</Text>
<Text style={styles.shifuprice}>￥{finalPrice/100}</Text>
  </View>

<View  style={{flexDirection: 'row',alignItems: 'center',}}>
<Text style={styles.comments}>优惠：</Text>
<Text style={[styles.pricered,{marginRight: px(16),}]}>
  ￥{selectedCoupon && finalPrice > 0 ? selectedCoupon.reduceAmount / 100 : 0}
</Text>
</View>
</View>
</View>

<View style={{width: '100%',height: px(8),marginTop: px(16),
backgroundColor: '#F8F8F8',}}></View>

<View style={{height: px(114),backgroundColor: '#fff',}}>
<View style={{marginTop: px(12),marginLeft: px(16),}}>
<Text style={styles.modalnum}>备注信息</Text>
     <TextInput
     allowFontScaling={false}
            style={[styles.inputbox]}
            onChangeText={onChangeText}
            value={username || ''}
            placeholder=""
            //keyboardType="number-pad"
            placeholderTextColor="#AAAAAA"
            maxLength={50}
            selectionColor='#FC9026'
            multiline={true}   // 开启多行
            textAlignVertical="top" // Android 文字顶部开始
              onFocus={() => {
                if(Platform.OS=='ios'){
                setTimeout(() => {
                scrollRef.current?.scrollToEnd({
            animated: true,
            });             
              }, 100);
              }
          }}
          />
</View>


</View>
{/* <View style={{width: '100%',height: px(8),marginTop: px(16),
backgroundColor: '#F8F8F8',}}></View> */}



</View> 


</ScrollView>
</KeyboardAvoidingView>

<View style={{flexDirection: 'column',marginTop: px(10),paddingHorizontal:px(16),
  paddingBottom:px(8)
}}>
<Text style={styles.comment}>支付方式</Text>
<View style={{width: '100%',flexDirection: 'row',alignItems: 'center',
  justifyContent: 'space-between',marginTop: px(10)
}}>
    <TouchableOpacity style={payways==2?styles.ispaybox:styles.paybox} activeOpacity={0.8}
  onPress={()=>setPayways(2)}>
  <Image source={require('../../../assets/images/home/wechat.png')} 
         style={{width:px(32),height:px(32)}}></Image>
           <Text style={styles.wechattx}>微信支付</Text>
  </TouchableOpacity>
  <TouchableOpacity style={payways==1?styles.ispaybox:styles.paybox} activeOpacity={0.8}
  onPress={()=>setPayways(1)}>
  <Image source={require('../../../assets/images/home/zfb.png')} 
         style={{width:px(32),height:px(32)}}></Image>
      <Text style={styles.zfbtx}>支付宝支付</Text>
  </TouchableOpacity>
</View>
</View>
<View  style={{paddingBottom: bottomSafeHeight || px(16),flexDirection: 'row',
  alignItems: 'flex-start',justifyContent: 'center',
}}>
  
  <TouchableOpacity
  onPress={()=>handlecreatorder()}>
 <LinearGradient
       colors={['#FEC525', '#FC9026']} // 渐变颜色
       start={{ x: 1, y: 0 }}   
       end={{ x: 0, y: 0 }}
       style={styles.payBox}
       >
       <View style={{flexDirection: 'row',alignItems: 'center',}}>
       <Text style={styles.xiadantx}>立即支付</Text>
       <Text style={styles.bxiadantx}>￥{finalPrice/100}</Text>
       </View>
       </LinearGradient>
       </TouchableOpacity>
    </View>

        </View>
      </BottomSheet>

       <BottomSheet
        visible={yvisible}
        onClose={() => setYvisible(false)}
        sheetHeight={px(500)}
       >
<View style={{paddingHorizontal:px(16),paddingTop:px(16),height: px(500),}}>
<View style={{flexDirection: 'row',alignItems: 'center',justifyContent: 'center',
  position: 'relative',
}}>
<Text style={styles.coupontitle}>优惠券</Text>
<TouchableOpacity style={{position: 'absolute',right:0}}
onPress={()=>setYvisible(false)}>
  <Image source={require('../../../assets/images/my/close.png')} 
  style={{width:px(20),height:px(20),}}></Image>
</TouchableOpacity>
</View>

<View style={{flexDirection: 'row',alignItems: 'center',
justifyContent: 'space-between',marginTop: px(16),paddingBottom:px(10)
}}>
<Text style={styles.coudetx}>已选优惠共减</Text>
<Text style={styles.coupricered}>
  ￥{selectedCoupon && finalPrice > 0 ? selectedCoupon.reduceAmount / 100 : 0}
</Text>
</View>

<ScrollView contentContainerStyle={{paddingBottom:px(20)}} 
showsVerticalScrollIndicator={false}>
{
  coulist?.length > 0 ? (
    coulist?.map((item, index) => (
      <TouchableOpacity
        style={styles.coubox}
        key={index}
        onPress={() => setSelectedCoupon(item)}
        activeOpacity={0.8}
      >
        <View style={{ flexDirection: 'column', gap: px(3), marginLeft: px(16) }}>
          <Text style={styles.desone}>{item.couponName}</Text>
          <Text style={styles.jincomall}>{formatDateTime(item.expireTime)}前有效</Text>
        </View>

        <View style={{ flexDirection: 'row', alignItems: 'center', gap: px(10) }}>
          <View style={{ flexDirection: 'column', alignItems: 'flex-end' }}>
            <View style={{ flexDirection: 'row', alignItems: 'flex-end' }}>
              <Text style={styles.coupricepo}>￥</Text>
              <Text style={styles.coupricepov}>{item.reduceAmount/100}</Text>
            </View>
            <Text style={styles.coupricepovd}>满{item.fullAmount/100}元可用</Text>
          </View>

          {selectedCoupon?.userCouponId === item.userCouponId? (
            <Image
              source={require('../../../assets/images/home/redischeck.png')}
              style={{ width: px(17), height: px(17), marginRight: px(10) }}
            />
          ) : (
            <Image
              source={require('../../../assets/images/home/redcheck.png')}
              style={{ width: px(17), height: px(17), marginRight: px(10) }}
            />
          )}
        </View>
      </TouchableOpacity>
    ))
  ) : (
    <View style={{ alignItems: 'center', paddingVertical: px(20) }}>
      <Text style={{ color: '#999' }}>暂无可用优惠券</Text>
    </View>
  )
}
</ScrollView>
<View  style={{paddingBottom: bottomSafeHeight,flexDirection: 'row',
  alignItems: 'flex-start',justifyContent: 'center',
}}>
  <TouchableOpacity style={styles.coubottom} onPress={()=>setYvisible(false)}>
       <View style={{flexDirection: 'row',alignItems: 'center',}}>
       <Text style={styles.xiadantx}>确定</Text>
       </View>
       </TouchableOpacity>
      </View>
      </View>
       </BottomSheet>
      <ImagePreviewer
        visible={previewVisible}
        images={headimgview}
        index={currentIndex}
        onClose={() => setPreviewVisible(false)}
        enableLongPressSave={false}
      />
        <ImagePreviewer
        visible={previewVisiblecon}
        images={headimgviewcon}
        index={currentIndexcon}
        onClose={() => setPreviewVisiblecon(false)}
        enableLongPressSave={false}
      />
      <PaymentLoadingModal visible={loading} />
    </View>
  )
}

const styles = StyleSheet.create({
    inputbox:{
      backgroundColor: '#F8F8F8',
   // marginLeft: px(8),
   marginTop: px(8),
  flexDirection: 'row',
  alignItems: 'center',
  width: px(361),
  minHeight: px(62),
  //height: px(62),
  borderRadius: px(8),
  fontSize: px(15),
  padding:px(12)
    },
  disabledTypebox: {
  marginTop: px(10),
  padding: px(8),
  width: px(361),
  backgroundColor: '#F5F5F5',
  borderRadius: px(14),
  opacity: 0.6,
},
      clubdes:{
 fontFamily: 'MiSans-Regular',
        fontSize:px(10),
        color:'#6E4200',
        fontWeight:400,
        lineHeight:px(13),
    },
  coubottom:{
  backgroundColor: '#DE5452',
  marginTop: px(6),
  width: px(303),
  height: px(48),
  borderRadius: px(24),
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'center',
    },
          coupricepovd:{
 fontFamily: 'MiSans-Regular',
        fontSize:px(10),
        color:'#DE5452',
        fontWeight:400,
        lineHeight:px(13),
  },
        coupricepov:{
 fontFamily: 'MiSans-Medium',
        fontSize:px(22),
        color:'#DE5452',
        fontWeight:400,
        lineHeight:px(24),
  },
      coupricepo:{
 fontFamily: 'MiSans-Medium',
        fontSize:px(13),
        color:'#DE5452',
        //fontWeight:400,
        lineHeight:px(17),
  },
  coubox:{
    marginTop: px(10),
 width: px(361),
 height: px(93),
 backgroundColor: 'rgba(222, 84, 82, 0.1)',
 borderRadius: px(14),
 flexDirection: 'row',
 alignItems: 'center',
 justifyContent: 'space-between',
  },
    coupricered:{
 fontFamily: 'MiSans-Regular',
        fontSize:px(13),
        color:'#DE5452',
        fontWeight:400,
        lineHeight:px(17),
  },
        coudetx:{
 fontFamily: 'MiSans-Regular',
        fontSize:px(13),
        color:'#1A1A1A',
        //fontWeight:400,
        lineHeight:px(17),
  },
      coupontitle:{
 fontFamily: 'MiSans-Medium',
        fontSize:px(16),
        color:'#1A1A1A',
        //fontWeight:400,
        lineHeight:px(21),
  },
    wechattx:{
 fontFamily: 'MiSans-Medium',
        fontSize:px(12),
        color:'#24B340',
        //fontWeight:400,
        lineHeight:px(16),
  },
  zfbtx:{
 fontFamily: 'MiSans-Medium',
        fontSize:px(12),
        color:'#009FE8',
        //fontWeight:400,
        lineHeight:px(16),
  },
    ispaybox:{
    gap:px(6),
width: px(175),
height: px(44),
    backgroundColor: '#FFFFFF',
    //borderRadius: px(14),
    borderColor: '#FEC525',
    borderWidth: px(1.5),
borderRadius: px(8),
flexDirection: 'row',
alignItems: 'center',
padding:px(4.5)
  },
  paybox:{
    gap:px(6),
width: px(175),
height: px(44),
backgroundColor: '#EEEEEE',
borderRadius: px(8),
flexDirection: 'row',
alignItems: 'center',
padding:px(6)
  },
    shifuprice:{
 fontFamily: 'MiSans-Medium',
        fontSize:px(18),
        color:'#DE5452',
        //fontWeight:400,
        lineHeight:px(24),
  },
  shifutx:{
     fontFamily: 'MiSans-Regular',
        fontSize:px(18),
        color:'#AAAAAA',
        fontWeight:400,
        lineHeight:px(24),
  },
  pricered:{
 fontFamily: 'MiSans-Regular',
        fontSize:px(12),
        color:'#DE5452',
        fontWeight:400,
        lineHeight:px(16),
  },
  righttext:{
      fontFamily: 'MiSans-Medium',
        fontSize:px(12),
        color:'#FFFFFF',
        //fontWeight:500,
        lineHeight:px(16),
  },
    isrightBox:{
  position: 'absolute',
  top:-px(1.5),
  right:-px(1.5),
  //width: px(76),
  //paddingHorizontal:px(8),
  height: px(24),
  borderTopRightRadius: px(14),
  borderBottomLeftRadius: px(14),
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'center',
  },
  rightBox:{
  position: 'absolute',
  top:0,
  right:0,
  //width: px(76),
  //paddingHorizontal:px(8),
  height: px(24),
  borderTopRightRadius: px(14),
  borderBottomLeftRadius: px(14),
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'center',
  },
      typetitle:{
        width: px(280),
      fontFamily: 'MiSans-Medium',
        fontSize:px(14),
        color:'#1A1A1A',
        //fontWeight:500,
        lineHeight:px(19),
      },
   istypeboxzz:{
    marginTop: px(10),
    padding:px(6.5),
    position: 'relative',
    flexDirection: 'column',
    justifyContent: 'space-between',
    width: px(361),
    //height: px(62),
    backgroundColor: '#FFFFFF',
    borderRadius: px(14),
    borderColor: '#FEC525',
    borderWidth: px(1.5),
  },
    istypebox:{
    marginTop: px(10),
    padding:px(6.5),
    position: 'relative',
    flexDirection: 'column',
    justifyContent: 'space-between',
    width: px(361),
    //height: px(72),
    backgroundColor: '#FFFFFF',
    borderRadius: px(14),
    borderColor: '#FEC525',
    borderWidth: px(1.5),
  },
    typeboxzz:{
    marginTop: px(10),
    padding:px(8),
    position: 'relative',
    flexDirection: 'column',
    justifyContent: 'space-between',
    width: px(361),
    //height: px(62),
    backgroundColor: '#EEEEEE',
    borderRadius: px(14),
    //borderColor: '#EEEEEE',
    //borderWidth: px(1),
  },
  typebox:{
    marginTop: px(10),
    padding:px(8),
    position: 'relative',
    flexDirection: 'column',
    justifyContent: 'space-between',
    width: px(361),
    //height: px(72),
    backgroundColor: '#EEEEEE',
    borderRadius: px(14),
    //borderColor: '#EEEEEE',
    //borderWidth: px(1),
  },
  modalnum:{
 fontFamily: 'MiSans-Regular',
        fontSize:px(12),
        color:'#AAAAAA',
        fontWeight:400,
        lineHeight:px(16),
  },
  modaldes:{
    width: px(239),
 fontFamily: 'MiSans-Regular',
        fontSize:px(11),
        color:'#FF9500',
        fontWeight:400,
        lineHeight:px(15),
  },
      bxiadantx:{
      fontFamily: 'MiSans-Medium',
        fontSize:px(21),
        color:'#FFFFFF',
        //fontWeight:500,
        lineHeight:px(28),
    },
    xiadantx:{
      fontFamily: 'MiSans-Medium',
        fontSize:px(18),
        color:'#FFFFFF',
        //fontWeight:500,
        lineHeight:px(24),
    },
    payBox:{
      marginTop: px(6),
  width: px(303),
  height: px(48),
  borderRadius: px(24),
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'center',
    },
    txiadnaBox:{
  width: px(208),
  height: px(48),
  borderRadius: px(24),
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'center',
    },
    botext:{
 fontFamily: 'MiSans-Regular',
        fontSize:px(11),
        color:'#AAAAAA',
        fontWeight:400,
        lineHeight:px(15),
    },
    botbox:{
        width: '100%',
        //height: Platform.OS=='ios'?bottom:undefined,
        backgroundColor: '#fff',
shadowColor: '#000',
shadowOffset: { width: 0, height: -8 }, // ⭐ 关键：负数 = 向上
shadowOpacity: 0.1,
shadowRadius: 20,
elevation: 8, // Android
    },
    jincomall:{
 fontFamily: 'MiSans-Regular',
        fontSize:px(10),
        color:'#AAAAAA',
        fontWeight:400,
        lineHeight:px(13),
    },
    comall:{
 fontFamily: 'MiSans-Regular',
        fontSize:px(14),
        color:'#1A1A1A',
        fontWeight:400,
        lineHeight:px(19),
    },
    renum:{
 fontFamily: 'MiSans-Bold',
        fontSize:px(20),
        color:'#1A1A1A',
        //fontWeight:400,
        lineHeight:px(28),
    },
    comgraguanBox:{
        flexDirection: 'row',
        alignItems: 'center',
 width: '100%',
 height: px(64),
 borderRadius: px(12),
    },
    comments:{
 fontFamily: 'MiSans-Regular',
        fontSize:px(12),
        color:'#AAAAAA',
        fontWeight:400,
        lineHeight:px(16),
    },
    comment:{
        fontFamily: 'MiSans-Medium',
        fontSize:px(15),
        color:'#1A1A1A',
        //fontWeight:500,
        lineHeight:px(20),
    },
         jointext:{
        fontFamily: 'MiSans-Medium',
        fontSize:px(14),
        color:'#FFFFFF',
        //fontWeight:500,
        lineHeight:px(19),
    },
      follow:{
 fontFamily: 'MiSans-Regular',
        fontSize:px(10),
        color:'#1A1A1A',
        fontWeight:400,
        lineHeight:px(13),
  },
      recommen:{
 fontFamily: 'MiSans-Regular',
        fontSize:px(11),
        color:'#FF9500',
        fontWeight:400,
        lineHeight:px(15),
  },
              clubname:{
                width: px(180),
 fontFamily: 'MiSans-Medium',
        fontSize:px(13),
        color:'#1A1A1A',
        //fontWeight:500,
        lineHeight:px(17),
    },
      graguanBox: {
    width:px(80),
    height: px(29),
    borderRadius: px(30),
    justifyContent: 'center',
    alignItems: 'center',
  },
    guatwo:{
 fontFamily: 'MiSans-Regular',
        fontSize:px(11),
        color:'#767676',
        fontWeight:400,
        lineHeight:px(15),
    },
    guaone:{
 fontFamily: 'MiSans-Regular',
        fontSize:px(11),
        color:'#6E4200',
        fontWeight:400,
        lineHeight:px(15),
    },
                  bgradientBox: {
                backgroundColor: 'red',
                top:0,
                left:0,
                position: 'absolute',
                zIndex: 1,
                //paddingHorizontal:px(3),
    //width:px(26),
    height: px(17),
    borderRadius: px(4),
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
gradientBox: {
    //paddingHorizontal:px(16),
    //paddingVertical:px(7),
    //paddingBottom: px(7),
    width:'100%',
    //height: px(83),
    flexDirection: 'column',
    //justifyContent: 'center',
    //gap:px(12)
  },
    destwo:{
 fontFamily: 'MiSans-Regular',
        fontSize:px(12),
        color:'#767676',
        fontWeight:400,
        lineHeight:px(16),
    },
    desone:{
 fontFamily: 'MiSans-Regular',
        fontSize:px(14),
        color:'#1A1A1A',
        fontWeight:400,
        lineHeight:px(19),
    },
    shoptitle:{
 fontFamily: 'MiSans-Regular',
        fontSize:px(19),
        color:'#1A1A1A',
        fontWeight:400,
        lineHeight:px(25),
    },
       salesnum:{
     marginBottom: px(2),
     marginLeft: px(3),
       // textDecorationLine: 'line-through',
 fontFamily: 'MiSans-Regular',
        fontSize:px(15),
        color:'#AAAAAA',
        fontWeight:400,
        lineHeight:px(20),
   },
              tsmallprice:{
            marginLeft: px(3),
        marginBottom: px(3),
        textDecorationLine: 'line-through',
        fontFamily: 'MiSans-Regular',
        fontSize:px(10),
        color:'#AAAAAA',
        fontWeight:400,
        lineHeight:px(13),
    },
               ssmallprice:{
            marginLeft: px(3),
        marginBottom: px(1),
        textDecorationLine: 'line-through',
 fontFamily: 'MiSans-Regular',
        fontSize:px(10),
        color:'#AAAAAA',
        fontWeight:400,
        lineHeight:px(13),
    },
           smallprice:{
            marginLeft: px(3),
        marginBottom: px(2),
        textDecorationLine: 'line-through',
 fontFamily: 'MiSans-Regular',
        fontSize:px(15),
        color:'#AAAAAA',
        fontWeight:400,
        lineHeight:px(21),
    },
          ispricev:{
            marginBottom: px(2),
        fontFamily: 'MiSans-Regular',
        fontSize:px(15),
        color:'#DE5452',
        fontWeight:400,
        lineHeight:px(20),
    },
      isprice:{
        fontFamily: 'MiSans-Bold',
        fontSize:px(24),
        color:'#DE5452',
        //fontWeight:400,
        lineHeight:px(28),
    },
    titleprice:{
 fontFamily: 'MiSans-Bold',
        fontSize:px(15),
        color:'#DE5452',
        //fontWeight:400,
        lineHeight:px(20),
    },
    sprice:{
 fontFamily: 'MiSans-Medium',
        fontSize:px(14),
        color:'#DE5452',
        fontWeight:400,
        lineHeight:px(19),
    },
           price:{
 fontFamily: 'MiSans-Bold',
        fontSize:px(15),
        color:'#DE5452',
        fontWeight:400,
        lineHeight:px(21),
    },
    container:{
        flex: 1,
        backgroundColor: '#FFFFFF',
    }
})