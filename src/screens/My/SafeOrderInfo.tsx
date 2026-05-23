import { StyleSheet, Text, View,TouchableOpacity,Image,ScrollView,Platform,

 } from 'react-native'
import React,{useState,useEffect,} from 'react'
import { px } from '../../utils/scaleUtils';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import LinearGradient from 'react-native-linear-gradient';
import BottomModal from '../../components/My/BottomModal';
import {
  Radio,Toast, Modal as Modalitem,
} from '@ant-design/react-native'
import request from '../../api/request';
import Storage from '../../utils/storage';
import { IMG_URL } from '../../api/config';
import SafeFastImage from '../../components/Home/SafeFastImage'
import Clipboard from '@react-native-clipboard/clipboard';
 import * as WeChat from 'react-native-wechat-lib';
import { pay } from '@react-native-hero/alipay';
import TextRadioModal from '../../components/Shop/TextRadioModal';
import ImagePreviewer from '../../components/Shop/ImagePreviewer';
import useAuthStore from '../../utils/zustand';

const STATUS_CONFIG = {

  CLOSED:{
    label: '已取消',
    leftText:'',
    rightText: '申请售后',
    topDesc:'可再次申请售后',
    showCustomer:false,
    icon:0,
  },

  CANCELED:{
    label: '已取消',
    leftText:'',
    rightText: '再次购买',
    topDesc:'',
    showCustomer:false,
    icon:0,
  },

  CREATED: {
    label: '待付款',
    leftText:'取消支付',
    rightText: '继续支付',
    topDesc:'29分钟后自动取消',
    showCustomer:false,
    icon:1,
  },

  WAIT_SERVICE: {
    label: '待服务',
    leftText:'',
    rightText: '申请退款',
    topDesc:'俱乐部安排打手中...',
    showCustomer:true,
    icon:2,
  },

  IN_SERVICE: {
    label: '服务中',
    leftText:'',
    rightText: '查看截图',
    topDesc:'打手正在服务中...',
    showCustomer:true,
    icon:3,
  },

  WAIT_CONFIRM: {
    label: '待收货',
    leftText:'申请售后',
    rightText: '确认完成',
    topDesc:'7天后自动收货',
    showCustomer:false,
    icon:4,
  },

  WAIT_COMMENT: {
    label: '售后中',
    leftText:'',
    rightText: '取消售后',
    topDesc:'请耐心等待俱乐部处理',
    showCustomer:false,
    icon:5,
  },

  FINISHED: {
    label: '已完成',
    leftText:'',
    rightText: '',
    topDesc:'售后已完成',
    showCustomer:false,
    icon:6,
  },

}
const imgMap = {
  0: require('../../../assets/images/my/cannelo.png'),
  1: require('../../../assets/images/my/clock.png'),
  2: require('../../../assets/images/my/clock.png'),
  3: require('../../../assets/images/my/newso.png'),
  4: require('../../../assets/images/my/clock.png'),
  5: require('../../../assets/images/my/clock.png'),
  6: require('../../../assets/images/my/finish.png'),
};
const mapOptions = [
  { label: '买多了/买错了', value: 0 },
  { label: '长时间未安排打手', value: 1 },
  { label: '客服态度不好', value: 2 },
  { label: '其他', value: 3 }, 
];
export default function SafeOrderInfo({navigation,route}) {
    const orderListRefreshKey =
  useAuthStore(
    state => state.orderListRefreshKey
  );
    const triggerListOrderRefresh =
    useAuthStore(
        state => state.triggerListOrderRefresh
    );
          const insets = useSafeAreaInsets();
          const bottomSafeHeight = insets.bottom; // 底部安全区高度（数值）
 const { id,refreshAllTabs} = route.params || {e:2};
  const [orderinfo, setOrderinfo] = useState({}); //订单详情
    const [goodsinfo, setGoodsinfo] = useState({}); //商品详情
        const [tags, setTags] = useState([]); //商品标签
 const [type, setType] = useState(0); //订单类型
 const [refund, setRefund] = useState(0); //退款原因
  const [refundsubmode, setRefundsubmode] = useState(1); //退款原因选择   
 const [refundmode, setRefundmode] = useState(1); //退款原因选择    
  const [refundmodal, setRefundmodal] = useState(false); //退款原因弹窗
  const [countdownText, setCountdownText] = useState('');
    const [visiblemap, setVisiblemap] = useState(false) //商品地图弹窗开关
const [maplist, setMaplist] = useState(mapOptions); //地图列表
    const [shopmap, setShopmap] = useState(0); //商品地图
        const [addons, setAddons] = useState(""); //增值服务
  const [paytime, setPaytime] = useState("-"); //支付时间
  const [processList, setProcessList] = useState([]); //记录列表
const [previewVisiblecon, setPreviewVisiblecon] = useState(false);
const [headimgviewcon, setHeadimgviewcon] = useState([]); // 图片数组
const [currentIndexcon, setCurrentIndexcon] = useState(0);
const [currentStatus, setCurrentStatus] = useState(""); //订单状态
const [currentConfig, setCurrentConfig] = useState(""); //订单配置
const [imglist, setImglist] = useState([]); //图片列表

  const [previewVisible, setPreviewVisible] = useState(false); // 预览弹窗显示控制
  const [currentIndex, setCurrentIndex] = useState(0); // 当前预览图片索引

  useEffect(() => {
    if(id){
      console.log(id);
      getorderinfo(id.orderId) //获取订单详情
      console.log(stringToArray(id.evidence));
      setImglist(stringToArray(id.evidence))
      
    setCurrentStatus(getStatus(id))  
    setCurrentConfig(STATUS_CONFIG[getStatus(id)] || STATUS_CONFIG.CREATED)
      //getStatus(id)
    }  
  }, [id,orderListRefreshKey])

      // 点击图片预览
    const handlePreview = (index) => {
      setCurrentIndex(index);
      setPreviewVisible(true);
    };
      // 生成 ImagePreviewer 所需的数据格式
    const previewImages = imglist.map(item => ({
      uri: IMG_URL + item
    }));

  const stringToArray = (str) => {
  if (!str) return []; // 空字符串返回空数组
  return str.split(',').map(item => item.trim()).filter(Boolean); // 去掉多余空格和空值
};
  const getorderinfo = async(e) => { 
      const user = await Storage.get("userinfo");
      console.log(e);
         try {
           const response = await request({
             url: '/order/detail',
             method: 'GET',
             data:{},
             query: {
              orderId:e,
              userId:user.user.userId
              }
           });
           console.log(response);
          if(response.data!==undefined&&response.code==0){
          //setCurrentStatus(getStatus(response.data))  
          //setCurrentConfig(STATUS_CONFIG[getStatus(response.data)] || STATUS_CONFIG.CREATED)
          setOrderinfo(response.data)
          console.log(JSON.parse(response.data.goodsSnapshot));
          let goods=JSON.parse(response.data.goodsSnapshot)
          setGoodsinfo(goods)
          const text = goods.goods.serviceIds;
          const arr = text.split(',');
          console.log(arr);
          setTags(arr)

        const addonTitles = goods.addons
          ?.map(item => `${item.title}x${item.quantity}`)
          ?.join('，') || ''; 
          setAddons(addonTitles)
          let paytype=response.data.paymentType
          if(response.data.paymentSnapshot!==null&&response.data.paymentSnapshot!==""){
          if(paytype=='WECHAT'){
          let payinfo=JSON.parse(response.data.paymentSnapshot)
          const date = new Date(payinfo.success_time);
const pad = (n) => n.toString().padStart(2, "0");
const formatted = `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ` +
                  `${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`;
                  setPaytime(formatted)
          }else{
            let payinfo=JSON.parse(response.data.paymentSnapshot)
           setPaytime(payinfo.gmt_payment)
          } 
          }
         const list = response.data.serviceLogs || [];
        if (list.length > 0) {
          // 提取 PROCESS
          const processData = list.filter(
            item => item.nodeType === 'PROCESS'
          );
        console.log(processData);
          setProcessList(processData);
        } else {
          setProcessList([]);
        }
 
          
          }
         } catch (error) {
           console.error(error);
         }

   };
   const getStatus = (e) => {
    console.log(e);
    
  // 售后中
  if(e.status === "WAIT_STORE" ) {
    return 'WAIT_COMMENT'
  }

  // 已完成
  if(e.status === 'CLOSED' ) {
    return 'FINISHED'
  }

    // 已取消
  if(e.status === "CANCELED" ) {
    return 'CLOSED'
  }

  // 其他状态使用 STATUS_CONFIG
  return orderinfo?.orderStatus || 'CREATED';
}  
      //const currentStatus = orderinfo?.orderStatus || 'CREATED';
    // const currentConfig =
    // STATUS_CONFIG[currentStatus] || STATUS_CONFIG.CREATED;
 const handleback = () => {  //返回上一页
   navigation.goBack();
     };
const handlegocom = () => {

  switch(currentStatus){

    case 'CREATED':
      // 去支付
      console.log(213);
      Continuepaying()
      break;

    case 'WAIT_SERVICE':
      // 申请退款
      setVisiblemap(true);
      break;

    case 'IN_SERVICE':
      // 查看截图
      break;

    case 'WAIT_CONFIRM':
      // 确认完成
      Confirmation()
      break;

    case 'WAIT_COMMENT':
        handlesagee()
      //navigation.navigate('Comment',{orderinfo});
      break;

    case 'FINISHED':
      // 删除订单
      handlerefund()
      break;

    case 'CLOSED':
    case 'CANCELED':
      // 再次购买
      handleagainbuy()
      break;

    default:
      break;
  }

 };
 const handlesagee = () => { 
   Modalitem.alert('提示', '是否取消售后？', [
      { text: '取消', onPress: () => console.log('cancel'), style: 'cancel' },
      { text: '确定', onPress: () => handlecannelsafe(),
       style: { color: '#FC9026' },
       },   
    ])
  };
 const handlecannelsafe = async() => { 
 console.log(id);
          try {
            const response = await request({
              url: '/order/after-sale/cancel',
              method: 'POST',
              data:{
                afterSaleId:id.id
              },
              query: {}
            });
            console.log(response);
           if(response.data!==undefined&&response.code==0){
              Toast.show({
                content: '已取消售后',
                duration: 2,
                position: 'center',
                mask: false,
            })
           handleback();
           triggerListOrderRefresh();
           
           }
          } catch (error) {
            console.error(error);
          }

  };
  const Confirmation = () => { 
   Modalitem.alert('提示', '是否确认完成？', [
      { text: '取消', onPress: () => console.log('cancel'), style: 'cancel' },
      { text: '确定', onPress: () => complete(),
       style: { color: '#FC9026' },
       },
    ])

   };
   const complete = async() => { 
      const user = await Storage.get("userinfo");
             try {
           const response = await request({
             url: '/order/confirm',
             method: 'POST',
             data:{
                orderId:orderinfo.id,
                userId:user.user.userId,
            },
             query: {}
           });
           console.log(response);
          if(response.data!==undefined&&response.code==0){
            getorderinfo(id)
          refreshAllTabs && refreshAllTabs();
            Toast.success({
           content: '确认成功',
           duration: 2,
           position: 'center',
           mask: false,
         })
          }else{
            Toast.fail({
           content: '确认订单失败，请稍后重试',
           duration: 2,
           position: 'center',
           mask: false,
         })
          }
         } catch (error) {
           console.error(error);
         }

    };
   const handlereturn = async(e) => { 
  const user = await Storage.get("userinfo");
  console.log(e,orderinfo.id,mapOptions[e].label);
           try {
             const response = await request({
               url: '/order/refund',
               method: 'POST',
               data:{
                orderId: orderinfo.id,
                userId: user.user.userId,
                refundReason: mapOptions[e].label
               },
               query: {

                }
             });
             console.log(response);
            if(response.data!==undefined&&response.code==0){
            Toast.success({
           content: '退款成功',
           duration: 2,
           position: 'center',
           mask: false,
           })
            refreshAllTabs();
            getorderinfo(id);
            }else{
            Toast.fail({
           content: '退款失败，请稍后再试',
           duration: 2,
           position: 'center',
           mask: false,
           })
            }
           } catch (error) {
             console.error(error);
           }
   };
 const Continuepaying = async() => { 
         try {
           const response = await request({
             url: '/order/repay',
             method: 'POST',
             data:{orderId:orderinfo.id},
             query: {}
           });
           console.log(response);
          if(response.data!==undefined&&response.code==0){
            //console.log(item);
              const res = response.data.payInfo
            if(response.data.paymentType=="WECHAT"){ //微信支付
        let payload={
        partnerId: res.payParams.partnerid,
        prepayId: res.prepayId,
        nonceStr: res.payParams.noncestr,
        timeStamp: res.payParams.timestamp,
        package: res.payParams.package,
        sign: res.payParams.sign,
          }
          handlewechatpay(payload)
            }else{
              handlePay(res.payInfo)
            }
          //handlePay(response.data.payInfo.payInfo)
          }else{
              Toast.show({
           content: '订单已过期，无法付款',
           duration: 2,
           position: 'center',
           mask: false,
         })
          }
         } catch (error) {
           console.error(error);
         }

  };
   const handlewechatpay = async(e) => { 
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
        console.log(result);
        
        if (result.errCode === 0) {
          getorderinfo(id)
          refreshAllTabs && refreshAllTabs();
          //refreshCurrentTab();
            Toast.show({
            content: '您已完成支付，请等待商家服务',
            duration: 2,
            position: 'center',
            mask: false,
          })
       
        } else {
         
  
        }
  
      } catch (error: any) {
         //refreshCurrentTab();
         //console.error('微信支付异常', error);
           Toast.show({
            content: '您已取消支付，请尽快完成支付',
            duration: 2,
            position: 'center',
            mask: false,
          })

      }
  
    };
   const handlePay = async (e) => {
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
       // refreshCurrentTab();
       getorderinfo(id)
       refreshAllTabs && refreshAllTabs();
           Toast.show({
           content: '您已完成支付，请等待商家服务',
           duration: 2,
           position: 'center',
           mask: false,
         })
         console.log('支付成功');
       } else {
         console.log('支付未完成');
       }
     } catch (err) {
       //refreshCurrentTab();
       //console.log('支付失败:', err);
       if (err.code === 6001) {
         console.log('用户取消支付');
          Toast.show({
           content: '您已取消支付，请尽快完成支付',
           duration: 2,
           position: 'center',
           mask: false,
         })
       }
     }
   };
  const handleagainbuy = () => {
    navigation.navigate('Refund',{orderinfo:orderinfo});
    //navigation.navigate('Shopinfo',{shopinfo:goodsinfo.goods})
  };
    const handlerefundmode = (e) => { 
    setRefundmode(e)
     };
  const onGroupChange = (e) => {  //退款原因切换
  console.log(e);
  setRefundmode(e.target.value)
  };
  const handlechoosere = () => {  //退款弹窗确定
setRefundsubmode(refundmode)
setRefundmodal(false)
   };

const handleCopyOrderNo = () => {

  if (!orderinfo?.orderNo) {
      Toast.show({
           content: '订单号不存在',
           duration: 2,
           position: 'center',
           mask: false,
         })
    return;
  }

  Clipboard.setString(orderinfo.orderNo);
  Toast.show({
           content: '订单号已复制',
           duration: 2,
           position: 'center',
           mask: false,
         })
};
const handleleftbutton = () => { //左边按钮
  switch(currentStatus){

    case 'CREATED':
      // 去支付
      handlecannel()
      break;

    case 'WAIT_SERVICE':
      // 申请退款
      setRefundmodal(true);
      break;

    case 'IN_SERVICE':
      // 查看截图
      break;

    case 'WAIT_CONFIRM':
      // 确认完成
      break;

    case 'WAIT_COMMENT':
      console.log(211);
      handlerefund()

      break;

    case 'FINISHED':
      // 删除订单
      handlerefund()
      break;

    case 'CLOSED':
    case 'CANCELED':
      // 再次购买
      //handleagainbuy()
      break;

    default:
      break;
  }

 };
 const handlerefund = () => { 
   console.log(orderinfo);
   if(orderinfo.settleStatus!=="FREEZED"&&orderinfo.settleStatus!=="NONE"){
     Toast.show({
      content: '该订单不能发起售后，请联系平台客服处理',
      duration: 2,
      position: 'center',
      mask: false,
      })
     return
   }
    navigation.navigate('Refund',{orderinfo});

  };
const handlecannel = async() => {  //取消订单
  console.log(22131);
     Modalitem.alert('提示', '是否取消？', [
      { text: '取消', onPress: () => console.log('cancel'), style: 'cancel' },
      { text: '确定', onPress: () => cannelorser(),
       style: { color: '#FC9026' },
       },   
    ])
 };
   const cannelorser = async() => { 
      const user = await Storage.get("userinfo");
             try {
           const response = await request({
             url: '/order/cancel',
             method: 'POST',
             data:{
                orderId:orderinfo.id,
                userId:user.user.userId,
                cancelReason: "用户主动取消订单"
            },
             query: {}
           });
           console.log(response);
          if(response.data!==undefined&&response.code==0){
            Toast.show({
           content: '取消成功',
           duration: 2,
           position: 'center',
           mask: false,
         })
         triggerListOrderRefresh()
         refreshAllTabs()
         getorderinfo(id);
          }else{
            Toast.show({
           content: '取消订单失败',
           duration: 2,
           position: 'center',
           mask: false,
         })
          }
         } catch (error) {
           console.error(error);
         }
   };
   const formatISOToDateTime = (isoString) => { 

  if (!isoString) return '';

  const date = new Date(isoString);

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0'); // 月份从0开始
  const day = String(date.getDate()).padStart(2, '0');

  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');

  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;

    };
    const refundStatusMap = {
  NONE: '未申请',           // 用户未发起售后
  REFUND_FULL: '全额退款',   // 已申请全额退款
  REFUND_PARTIAL: '部分退款', // 已申请部分退款
  REJECT: '已拒绝',          // 商家/平台拒绝
  COMPENSATE: '已赔付',      // 已赔付
  OTHER: '其他',             // 其他情况
  AGREE: '已同意'            // 商家/平台已同意
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
              <Text style={styles.title}>售后详情</Text>
                 </View>
               </View>
<ScrollView style={{paddingHorizontal:px(16),paddingTop:px(16)}}
contentContainerStyle={{paddingBottom:px(110)}} showsVerticalScrollIndicator={false}>
<View style={{flexDirection: 'row',alignItems: 'center',
    justifyContent: 'space-between',
}}>
    <View style={{flexDirection: 'row',alignItems: 'center',gap:px(3)}}>
<Image source={imgMap[currentConfig.icon]}
style={{width:px(32),height:px(32)}}></Image>
<Text style={styles.toptitle}>
  {currentConfig.label}
</Text>
 
    </View>
<Text style={styles.righttx}>
  {
    currentStatus === 'CREATED'
      ? countdownText
      : currentConfig.topDesc
  }
</Text>
</View>

{id.status=="CLOSED"&&
<View style={{width: '100%',backgroundColor: '#fff',borderRadius: px(14),
    paddingHorizontal:px(8),paddingVertical:px(16),marginTop: px(16),gap:px(16)}}>
<View style={{width: '100%',flexDirection: 'row',alignItems: 'center',justifyContent: 'space-between',}}>
    <Text style={styles.shoppricetx}>处理结果</Text>
</View>

<View style={{width: '100%',flexDirection: 'row',alignItems: 'center',justifyContent: 'space-between',}}>
    <Text style={styles.shopdesnames}>处理结果</Text>
      <Text style={styles.yingfu}>{refundStatusMap[id.result]}</Text>
</View>
<View style={{width: '100%',flexDirection: 'row',alignItems: 'center',justifyContent: 'space-between',}}>
    <Text style={styles.shopdesnames}>回复结果</Text>
      <Text style={styles.yingfu}>{id.storeRemark}</Text>
</View>

<View style={{width: '100%',flexDirection: 'row',alignItems: 'center',justifyContent: 'space-between',}}>
    <Text style={styles.shopdesnames}>处理时间</Text>
      <Text style={styles.yingfu}>{formatISOToDateTime(id.updatedAt)}</Text>
</View>


</View>
}



<View style={{width: '100%',backgroundColor: '#fff',borderRadius: px(14),
    paddingHorizontal:px(8),paddingVertical:px(16),marginTop: px(16),
}}>
<View style={{flexDirection: 'row',alignItems: 'center',justifyContent: 'space-between',}}>
    <TouchableOpacity style={{flexDirection: 'row',alignItems: 'center',gap:px(3)}}
  onPress={()=>navigation.navigate('ClubHome',{storeinfo:{id:orderinfo.storeId}})}
    >
 <Text style={styles.clubname}>{orderinfo?.storeName}</Text>
    <Image source={require('../../../assets/images/my/right.png')} 
    style={{width:px(19),height:px(19)}}></Image>
    </TouchableOpacity>
    {currentConfig.showCustomer &&
       <TouchableOpacity style={{flexDirection: 'row',alignItems: 'center',gap:px(3)}}>
      <Image source={require('../../../assets/images/my/kefu.png')} 
    style={{width:px(16),height:px(16)}}></Image>
    <Text style={styles.yingfu}>客服</Text>
   </TouchableOpacity>
    }
 
</View>
<View style={{flexDirection: 'row',alignItems: 'center',marginTop: px(16),}}>
<SafeFastImage 
source={{uri:IMG_URL+goodsinfo?.goods?.coverImage.split(',')[0]}} 
    style={{width:px(93),height:px(93),borderRadius: px(8),}}/>
    <View style={{height: px(93),flexDirection: 'column',
        justifyContent: 'space-between',marginLeft: px(8),}}>
<Text style={styles.shopname}>{goodsinfo?.goods?.title}</Text>
<View style={{flexDirection: 'column',gap:px(8)}}>
<Text style={styles.shopnames} numberOfLines={1}>{goodsinfo?.sku?.title}</Text>
{addons!==""&&
<Text style={styles.shopnames} numberOfLines={1}>{addons}</Text>
}
{tags.length!==0&&
<View style={{flexDirection: 'row',alignItems: 'center',gap:px(3)}}>
  {tags?.map((item,index)=>
  <View style={{backgroundColor: '#FEF7E0',paddingHorizontal:px(4),
    paddingVertical:px(2),borderRadius: px(4),flexDirection: 'row',
    alignItems: 'center',justifyContent: 'center',}} key={index}>
<Text style={styles.shopdestx}>{item}</Text>
</View>
  )}
</View>
}

</View>
    </View>
</View>
</View>

<View style={{width: '100%',backgroundColor: '#fff',borderRadius: px(14),
    paddingHorizontal:px(8),paddingVertical:px(16),marginTop: px(16),gap:px(16)}}>
<View style={{width: '100%',flexDirection: 'row',alignItems: 'center',justifyContent: 'space-between',}}>
    <Text style={styles.shoppricetx}>商品总价</Text>
      <Text style={styles.shopprice}>￥{orderinfo?.totalAmount/100}</Text>
</View>
<View style={{width: '100%',flexDirection: 'row',alignItems: 'center',justifyContent: 'space-between',}}>
    <Text style={styles.shopdesnames}>优惠</Text>
      <Text style={styles.shopprice}>￥{orderinfo?.discountAmount/100}</Text>
</View>
<View style={{width: '100%',flexDirection: 'row',alignItems: 'center',
    justifyContent: 'flex-end',}}>
<View style={{flexDirection: 'row',alignItems: 'center',gap:px(3)}}>
          <Text style={styles.yingfu}>应付款</Text>
      <Text style={styles.shopprice}>￥{orderinfo?.payAmount/100}</Text>
</View>
</View>
</View>

<View style={{width: '100%',backgroundColor: '#fff',borderRadius: px(14),
    paddingHorizontal:px(8),paddingVertical:px(16),marginTop: px(16),gap:px(16)}}>
<View style={{width: '100%',flexDirection: 'row',alignItems: 'center',justifyContent: 'space-between',}}>
    <Text style={styles.shoppricetx}>订单信息</Text>
</View>
<View style={{width: '100%',flexDirection: 'row',alignItems: 'center',
    justifyContent: 'space-between',}}>
    <Text style={styles.shopdesnames}>订单编号</Text>
     <View style={{flexDirection: 'row',gap:px(3),alignItems: 'center',
     }}>
     <Text style={styles.yingfu}>{orderinfo?.orderNo}</Text>
     <TouchableOpacity onPress={handleCopyOrderNo}>
      <Text style={[styles.yingfu,{fontSize:px(14),lineHeight:px(19)}]}>复制</Text>
      </TouchableOpacity>
</View>
</View>
<View style={{width: '100%',flexDirection: 'row',alignItems: 'center',
    justifyContent: 'space-between',}}>
    <Text style={styles.shopdesnames}>支付方式</Text>
      <Text style={styles.yingfu}>{orderinfo?.paymentType=="WECHAT"?'微信支付':'支付宝'}</Text>
</View>
<View style={{width: '100%',flexDirection: 'row',alignItems: 'center',
    justifyContent: 'space-between',}}>
    <Text style={styles.shopdesnames}>下单时间</Text>
      <Text style={styles.yingfu}>{orderinfo?.createdAt}</Text>
</View>
    {!['CLOSED','CANCELED','CREATED']
  .includes(currentStatus) &&
    <View style={{width: '100%',flexDirection: 'row',alignItems: 'center',
        justifyContent: 'space-between',}}>
        <Text style={styles.shopdesnames}>支付时间</Text>
        <Text style={styles.yingfu}>{paytime}</Text>
    </View>
    }

    <View style={{width: '100%',flexDirection: 'row',alignItems: 'center',
        justifyContent: 'space-between',}}>
        <Text style={styles.shopdesnames}>完成时间</Text>
        <Text style={styles.yingfu}>{orderinfo?.updatedAt}</Text>
    </View>
    

</View>


{imglist.length!==0&&
<View style={{width: '100%',backgroundColor: '#fff',borderRadius: px(14),
    paddingHorizontal:px(8),paddingVertical:px(16),marginTop: px(16),gap:px(16)}}>
<View style={{width: '100%',flexDirection: 'row',alignItems: 'center',justifyContent: 'space-between',}}>
    <Text style={styles.shoppricetx}>售后截图</Text>
</View>
<View style={{flexDirection: 'row',alignItems: 'center',gap:px(8)}}>
{imglist.map((item,index)=>
          <TouchableOpacity key={index} onPress={() => handlePreview(index)}>
     <Image source={{uri:IMG_URL+item}} 
     style={{width:px(80),height:px(80),borderRadius: px(8),}}
     key={index}></Image>
     </TouchableOpacity>
)}
</View>
</View>
}



<View style={{width: '100%',backgroundColor: '#fff',borderRadius: px(14),
    paddingHorizontal:px(8),paddingVertical:px(16),marginTop: px(16),gap:px(16)}}>
<View style={{width: '100%',flexDirection: 'row',alignItems: 'center',justifyContent: 'space-between',}}>
    <Text style={styles.shoppricetx}>售后信息</Text>
</View>



    <View style={{width: '100%',flexDirection: 'row',alignItems: 'center',
        justifyContent: 'space-between',}}>
        <Text style={styles.shopdesnames}>售后诉求</Text>
        <Text style={styles.yingfu}>{id.type=="OTHER"?'其他':'退款'}</Text>
    </View>
       <View style={{width: '100%',flexDirection: 'row',alignItems: 'center',
        justifyContent: 'space-between',}}>
        <Text style={styles.shopdesnames}>申请说明</Text>
        <Text style={styles.yingfu}>{id.reason}</Text>
    </View>
       <View style={{width: '100%',flexDirection: 'row',alignItems: 'center',
        justifyContent: 'space-between',}}>
        <Text style={styles.shopdesnames}>售后申请时间</Text>
        <Text style={styles.yingfu}>{formatISOToDateTime(id.createdAt)}</Text>
    </View>

</View>

{
processList.length > 0 &&
processList.map((item,index)=>{

  // 图片数组
  const imageList = item.images
    ? item.images.split(',')
    : [];

  return(
    <View
      key={index}
      style={{
        width: '100%',
        backgroundColor: '#fff',
        borderRadius: px(14),
        paddingHorizontal:px(8),
        paddingVertical:px(16),
        marginTop: px(16),
        gap:px(16)
      }}
    >

      {/* 标题 */}
      <View style={{
        width: '100%',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}>
        <Text style={styles.shoppricetx}>
          上传记录
        </Text>
      </View>

      {/* 时间 */}
      <View style={{
        width: '100%',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}>
        <Text style={styles.shopdesnames}>
          上传时间
        </Text>

        <Text style={styles.yingfu}>
          {item.updatedAt || '-'}
        </Text>
      </View>

      {/* 图片 */}
      <View
        style={{
          flexDirection: 'row',
          flexWrap: 'wrap',
          gap:px(8),
        }}
      >

  {
  imageList.map((img, index2) => (
    <TouchableOpacity
      key={index2}
      onPress={() => {
        const previewArray = imageList.map(i => ({ uri: IMG_URL +i })); 
        setHeadimgviewcon(previewArray);
        console.log(previewArray);
        setCurrentIndexcon(index2);
        setPreviewVisiblecon(true);
      }}
    >
      <SafeFastImage
        source={{ uri: IMG_URL + img }}
        style={{
          width:px(80),
          height:px(80),
          borderRadius:px(8),
        }}
      />
    </TouchableOpacity>
  ))
}

      </View>

      {/* 描述 */}
      {
        item.content !== '' &&
        <View style={{
          backgroundColor: '#F7F8FC',
          padding:px(8),
          borderRadius: px(10),
        }}>
          <Text style={styles.bottomdes}>
            {item.content}
          </Text>
        </View>
      }
<ImagePreviewer
  visible={previewVisiblecon}
  images={headimgviewcon}
  index={currentIndexcon}
  onClose={() => setPreviewVisiblecon(false)}
  enableLongPressSave={false}
/>
    </View>
  )
})
}


</ScrollView>

    {currentStatus !== 'FINISHED'&&
<View style={{position: 'absolute',bottom:0,width: '100%',backgroundColor: '#fff',
   flexDirection: 'row',justifyContent: 'center',
}}>
    <View style={{paddingBottom: bottomSafeHeight+(Platform.OS=='ios'?0 :px(8)),
    alignItems: 'center',gap:px(3)}}>
<View style={{flexDirection: 'row',alignItems: 'center',marginTop: px(8),
    gap:px(21)
}}>
{currentConfig.leftText ? (
  <TouchableOpacity onPress={()=>handleleftbutton()}>
    <View style={styles.cannelbox}>
      <Text style={styles.canneltx}>
        {currentConfig.leftText}
      </Text>
    </View>
  </TouchableOpacity>
) : null}

       <TouchableOpacity onPress={()=>handlegocom()}>
        <LinearGradient
              colors={['#FEC525', '#FC9026']} // 渐变颜色
              start={{ x: 1, y: 0 }}   
              end={{ x: 0, y: 0 }}
              style={[styles.payBox,{width: currentConfig.leftText
              ? px(170)
              : px(242)}]}
              >
              <View style={{flexDirection: 'row',alignItems: 'center',}}>
                <Text style={styles.xiadantx}>
                {currentConfig.rightText}
              </Text>         
              </View>
              </LinearGradient>
              </TouchableOpacity>
   
     

</View>
</View>
</View>    
}

    <TextRadioModal
      visible={visiblemap}
      onClose={() => setVisiblemap(false)}
      data={maplist}
      value={shopmap}
      onConfirm={(val) => {
        setShopmap(val);
        setVisiblemap(false);
        handlereturn(val)
      }}
    />

              {/* 图片预览组件 */}
          <ImagePreviewer
            visible={previewVisible}
            images={previewImages}
            index={currentIndex}
            onClose={() => setPreviewVisible(false)}
            enableLongPressSave={true}
          />
    </View>
  )
}

const styles = StyleSheet.create({
      zfbname:{
fontFamily: 'MiSans-Regular',
        fontSize:px(14),
        color:'#1A1A1A',
        fontWeight:400,
        lineHeight:px(19),
  },
      choosemodetext:{
fontFamily: 'MiSans-Regular',
        fontSize:px(15),
        color:'#FFFFFF',
        fontWeight:400,
        lineHeight:px(20),
  },
      choosemodeBox: {
    width:px(242),
    height: px(38),
    borderRadius: px(30),
    justifyContent: 'center',
    alignItems: 'center',
  },
      modaltitle:{
  fontFamily: 'MiSans-Medium',
    fontSize: px(16),
    color: '#1A1A1A',
    lineHeight: px(21),
  },
    bottomdes:{
 fontFamily: 'MiSans-Regular',
        fontSize:px(12),
        color:'#1A1A1A',
        fontWeight:400,
        lineHeight:px(16),
    },
            righttx:{
 fontFamily: 'MiSans-Regular',
        fontSize:px(14),
        color:'#AAAAAA',
        fontWeight:400,
        lineHeight:px(19),
    },
        canneltx:{
 fontFamily: 'MiSans-Regular',
        fontSize:px(15),
        color:'#AAAAAA',
        fontWeight:400,
        lineHeight:px(20),
    },
    cannelbox:{
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        width: px(170),
        height: px(38),
        borderRadius: px(30),
        borderWidth: px(1),
        borderColor: '#D8D8D8',
    },
            xiadantx:{
      fontFamily: 'MiSans-Regular',
        fontSize:px(15),
        color:'#FFFFFF',
        //fontWeight:500,
        lineHeight:px(20),
    },
            payBox:{
      //marginTop: px(8),
  width: px(170),
  height: px(38),
  borderRadius: px(30),
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'center',
    },
        yingfu:{
 fontFamily: 'MiSans-Regular',
        fontSize:px(12),
        color:'#1A1A1A',
        fontWeight:400,
        lineHeight:px(16),
    },
    shopprice:{
 fontFamily: 'MiSans-Bold',
        fontSize:px(14),
        color:'#1A1A1A',
        //fontWeight:500,
        lineHeight:px(19),
    },
    shoppricetx:{
 fontFamily: 'MiSans-Medium',
        fontSize:px(14),
        color:'#000000',
        //fontWeight:500,
        lineHeight:px(19),
    },
    shopdestx:{
 fontFamily: 'MiSans-Regular',
        fontSize:px(11),
        color:'#FF9500',
        fontWeight:400,
        lineHeight:px(15),
    },
        shopdesnames:{
 fontFamily: 'MiSans-Regular',
        fontSize:px(12),
        color:'#AAAAAA',
        fontWeight:400,
        lineHeight:px(16),
    },
    shopnames:{
        width: px(244),
 fontFamily: 'MiSans-Regular',
        fontSize:px(12),
        color:'#AAAAAA',
        fontWeight:400,
        lineHeight:px(16),
    },
    shopname:{
        width: px(244),
 fontFamily: 'MiSans-Medium',
        fontSize:px(16),
        color:'#1A1A1A',
        //fontWeight:500,
        lineHeight:px(21),
    },
    clubname:{
 fontFamily: 'MiSans-Medium',
        fontSize:px(14),
        color:'#000000',
        //fontWeight:500,
        lineHeight:px(19),
    },
    toptitle:{
  fontFamily: 'MiSans-Medium',
        fontSize:px(24),
        color:'#000000',
        //fontWeight:500,
        lineHeight:px(32),
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
        backgroundColor: '#F2F3F5',
    }
})