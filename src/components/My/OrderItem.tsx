import { StyleSheet, Text, View, Image, TouchableOpacity } from 'react-native'
import React, {  useMemo, useState, useEffect } from 'react'
import { px } from '../../utils/scaleUtils'
import LinearGradient from 'react-native-linear-gradient'
import SafeFastImage from '../../components/Home/SafeFastImage'
import { IMG_URL } from '../../api/config';
import request from '../../api/request';
import { Toast,  Modal as Modalitem, } from '@ant-design/react-native'
import { pay } from '@react-native-hero/alipay';
import Storage from '../../utils/storage';
 import * as WeChat from 'react-native-wechat-lib';
import TextRadioModal from '../../components/Shop/TextRadioModal';
import useAuthStore from '../../utils/zustand';



const TYPE_ICON = {
  1: require('../../../assets/images/home/type/protect.png'),
  2: require('../../../assets/images/home/type/ace.png'),
  3: require('../../../assets/images/home/type/task.png'),
  4: require('../../../assets/images/home/type/knife.png'),
}

const STATUS_CONFIG = {
    CLOSED:{
    label: '已取消',
    leftText:'',
    rightText: '再次购买',
    },
 CANCELED:{
    label: '已取消',
    leftText:'',
    rightText: '再次购买',
    },
  CREATED: {
    label: '待付款',
    leftText:'取消支付',
    rightText: '继续支付',
  },
  WAIT_SERVICE: {
    label: '待服务',
    leftText:'',
    rightText: '申请退款',
  },
  IN_SERVICE: {
    label: '服务中',
    leftText:'申请售后',
    rightText: '查看进度',
  },
  WAIT_CONFIRM: {
    label: '待收货',
    leftText:'申请售后',
    rightText: '确认完成',
  },
  // WAIT_COMMENT: {
  //   label: '待评价',
  //   rightText: '前往评论',
  // },
  FINISHED: {
    label: '已完成',
    rightText: '申请售后',
  },
}
const mapOptions = [
  { label: '买多了/买错了', value: 0 },
  { label: '长时间未安排打手', value: 1 },
  { label: '客服态度不好', value: 2 },
  { label: '其他', value: 3 }, 
];
const OrderItem = ({ item, navigation,refreshCurrentTab,refreshTab,refreshAllTabs }) => {
    const [visiblemap, setVisiblemap] = useState(false) //商品地图弹窗开关
const [maplist, setMaplist] = useState(mapOptions); //地图列表
    const [shopmap, setShopmap] = useState(0); //商品地图
        const [addons, setAddons] = useState(""); //增值服务
           const [status, setStatus] = useState(""); //增值服务
  //const status = STATUS_CONFIG[item.orderStatus] || STATUS_CONFIG.CREATED

     const triggerListOrderRefresh =
    useAuthStore(
        state => state.triggerListOrderRefresh
    );
  
const [countdown, setCountdown] = useState('29:59')
useEffect(() => {
  if(item){
    setStatus(getStatus());
   const goods=JSON.parse(item.goodsSnapshot)
    console.log(goods.addons);
const addonTitles = goods.addons
  ?.map(item => `${item.title}x${item.quantity}`)
  ?.join('，') || '';
  setAddons(addonTitles)
  console.log(addonTitles);
  
  }

}, [item])
// 动态判断状态
const getStatus = () => {
  console.log(item);
  
  // 待评价优先判断
  if(item.orderStatus === 'FINISHED' && item.displayStatus == "WAIT_COMMENT") {
    return {
      label: '待评价',
      leftText: '申请售后',
      rightText: '前往评论',
    };
  }

  // 已完成
  if(item.orderStatus === 'FINISHED' && item.displayStatus !== "WAIT_COMMENT") {
    return {
      label: '已完成',
      leftText: '',
      rightText: '申请售后',
    };
  }

  // 其他状态使用 STATUS_CONFIG
  return STATUS_CONFIG[item.orderStatus] || STATUS_CONFIG.CREATED;
}
useEffect(() => {

  // 只处理待付款
  if (item.orderStatus !== 'CREATED') {
    return
  }

  let expired = false

  const updateCountdown = () => {

    // 创建时间
    const createdTime = new Date(item.createdAt).getTime()

    // 30分钟后过期
    const expireTime = createdTime + 30 * 60 * 1000

    // 剩余时间
    const remain = expireTime - Date.now()

    // 已过期
    if (remain <= 0) {

      setCountdown('00:00')

      // 防止重复刷新
      if (!expired) {

        expired = true
        triggerListOrderRefresh();
        refreshCurrentTab?.()
      }

      return
    }

    // 分
    const minutes = Math.floor(remain / 1000 / 60)

    // 秒
    const seconds = Math.floor((remain / 1000) % 60)

    setCountdown(
      `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
    )
  }

  // 初始化
  updateCountdown()

  // 每秒刷新
  const timer = setInterval(updateCountdown, 1000)

  return () => {
    clearInterval(timer)
  }

}, [item.createdAt, item.orderStatus])

  const typeIcon = TYPE_ICON[item.types]

  const goDetail = () => {
    console.log(item);
    
    navigation.navigate('OrderInfo', { id: item.id ,refreshAllTabs: refreshAllTabs,})
  }
  const handlegostore = () => {  //跳转店铺
  navigation.navigate('ClubHome',{storeinfo:{id:item.storeId}})

   };
   const formatTime = (time) => {
  const date = new Date(time);

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hour = String(date.getHours()).padStart(2, '0');
  const minute = String(date.getMinutes()).padStart(2, '0');

  return `${year}-${month}-${day} ${hour}:${minute}`;
};
  const handlerightbutton = (e) => { 
    console.log(e);
    if(e=="再次购买"){
        goshopinfo(JSON.parse(item.goodsSnapshot).goods)
    //navigation.navigate('Shopinfo',{shopinfo:JSON.parse(item.goodsSnapshot).goods})
    }else if(e=="继续支付"){
    Continuepaying();
    }else if(e=="申请退款"){
    setVisiblemap(true)
    }else if(e=="查看进度"){
     navigation.navigate('OrderInfo', { id: item.id ,refreshAllTabs: refreshAllTabs,})
    }else if(e=="确认完成"){
     Confirmation();
    }else if(e=="前往评论"){
     navigation.navigate('Comment',{orderinfo:item});
    }else if(e=="申请售后"){
     navigation.navigate('Refund',{orderinfo:item});
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
                orderId:item.id,
                userId:user.user.userId,
            },
             query: {}
           });
           console.log(response);
          if(response.data!==undefined&&response.code==0){
            Toast.success({
           content: '确认成功',
           duration: 2,
           position: 'center',
           mask: false,
         })
         triggerListOrderRefresh();
         refreshCurrentTab();
         refreshTab('all');
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
 const handleleftbotton = (e) => { 
    console.log(e);
    if(e=="取消支付"){
    console.log(213123);
    handlecannl()
    }else if(e=="申请售后"){
    navigation.navigate('Refund',{orderinfo:item});
    }


  };
  const handlecannl = () => { 
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
                orderId:item.id,
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
         triggerListOrderRefresh();
         refreshCurrentTab();
         refreshTab('all');
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
 const Continuepaying = async() => { 
         try {
           const response = await request({
             url: '/order/repay',
             method: 'POST',
             data:{orderId:item.id},
             query: {}
           });
           console.log(response);
          if(response.data!==undefined&&response.code==0){
            console.log(item);
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
          refreshAllTabs();
          triggerListOrderRefresh();
            Toast.show({
            content: '您已完成支付，请等待商家服务',
            duration: 2,
            position: 'center',
            mask: false,
          })
       
        } else {
         
  
        }
  
      } catch (error: any) {
         refreshAllTabs();
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
        triggerListOrderRefresh();
        refreshAllTabs();
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
       refreshAllTabs();
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
 const goshopinfo = async(e) => { 
 console.log(e);
         try {
           const response = await request({
             url: '/goods/detail',
             method: 'GET',
             data:{},
             query: { id:e.id }
           });
           console.log(response);
          if(response.data!==undefined&&response.code==0&&response.data.minPrice!==0){
          navigation.navigate('Shopinfo',{shopinfo:response.data})
          }else{
          Toast.info({content:'该商品已被删除，无法下单',mask:false,duration:2});
          }
         } catch (error) {
           console.error(error);
         }

  };
  const handlereturn = async(e) => { 
    setShopmap(0)
  const user = await Storage.get("userinfo");
  console.log(e,item.id,mapOptions[e].label);
           try {
             const response = await request({
               url: '/order/refund',
               method: 'POST',
               data:{
                orderId: item.id,
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
           triggerListOrderRefresh();
            refreshAllTabs()
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
  return (
    <TouchableOpacity style={styles.container} onPress={goDetail} activeOpacity={1}>

      {/* header */}
      <View style={styles.header}>
    <TouchableOpacity style={{flexDirection: 'row',alignItems: 'center',}}
    onPress={()=>handlegostore()}>
        <Text style={styles.clubname}>{item?.storeName}</Text>
        <Image source={require('../../../assets/images/my/right.png')} 
        style={{width:px(19),height:px(19)}}></Image></TouchableOpacity>
        <View style={{flexDirection: 'row',alignItems: 'center',}}>
        <Text style={[styles.status,{color:status.label=='已取消'?'#AAAAAA':'#FF9500'}]}>
            {status.label}
            </Text>
            {status.label=="待付款"&&
          <Text style={styles.status}>
          ,剩余{countdown}
            </Text>   
            }
            </View>
      </View>

      {/* content */}
      <View style={styles.content}>

        <View style={styles.imgBox}>
          <SafeFastImage
            source={{uri:IMG_URL+JSON.parse(item.goodsSnapshot).goods.coverImage.split(',')[0]}}
            style={styles.img}
          />
          {typeIcon && (
            <Image source={typeIcon} style={styles.tag} />
          )}
    <Image source={require('../../../assets/images/home/shopboder.png')}  
    style={{width:px(120),height:px(120),position: 'absolute',}}></Image>
        </View>

        <View style={styles.info}>
          <Text numberOfLines={2} style={styles.title}>
           {JSON.parse(item.goodsSnapshot).goods.title}
          </Text>
          
          <View style={styles.meta}>
            <Text style={styles.text}>{item.goodsTitle}</Text>
            {addons!==""&&
          <Text style={styles.text}>{addons}</Text>
            }
            <Text style={styles.text}>下单时间：{formatTime(item.createdAt)}</Text>
            {/* <Text style={styles.text}>订单号：{item.orderNo}</Text> */}

            <View style={styles.row}>
              <Text style={styles.text}>数量：{item.quantity}</Text>
              <Text style={styles.price}>￥{item.payAmount/100}</Text>
            </View>
          </View>
        </View>

      </View>

      {/* footer */}
      <View style={styles.footer}>

        {status.label !== '已完成'&&status.leftText!=="" && (
          <>
            <TouchableOpacity style={styles.btn} onPress={()=>handleleftbotton(status.leftText)}>
              <Text style={styles.btnText}> {status.leftText}</Text>
            </TouchableOpacity>
          </>
        )}
 {status.rightText!==""&&
         <TouchableOpacity onPress={()=>handlerightbutton(status.rightText)}>
          <LinearGradient
            colors={['#FEC525', '#FC9026']}
            start={{ x: 1, y: 0 }}
            end={{ x: 0, y: 0 }}
            style={styles.primaryBtn}
          >
            <Text style={styles.primaryText}>
              {status.rightText}
            </Text>
          </LinearGradient>
        </TouchableOpacity>
 }


      </View>
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
    </TouchableOpacity>
  )
}

export default React.memo(OrderItem)
const styles = StyleSheet.create({
kefu:{ 
    fontFamily: 'MiSans-Regular', 
    fontSize:px(12), 
    lineHeight:px(16), 
    color:'#AAAAAA', 
    fontWeight:400, },
  container: {
    width: px(361),
    backgroundColor: '#fff',
    borderRadius: px(14),
    padding: px(8),
  },

  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

clubname:{ 
    fontFamily: 'MiSans-Medium', 
    fontSize:px(14), 
    color:'#000000', 
    //fontWeight:'400', 
    lineHeight:px(19),
    },
  status: {
  fontFamily: 'MiSans-Regular',
 lineHeight:px(16), 
 fontSize:px(12), 
 color:'#FF9500', 
 fontWeight:400,
  },

  content: {
    flexDirection: 'row',
    marginTop: px(8),
  },

  imgBox: {
    width: px(120),
    height: px(120),
    position: 'relative',
  },

  img: {
    width: px(120),
    height: px(120),
  },

  tag: {
    width: px(57),
    height: px(23),
    position: 'absolute',
    bottom: 0,
    left: 0,
  },

  info: {
    flex: 1,
    marginLeft: px(8),
  },

  title: {
width: px(222), 
fontFamily: 'MiSans-Medium', 
fontSize:px(16), 
color:'#1A1A1A',
//fontWeight:'400', 
lineHeight:px(21),
  },

  meta: {
    marginTop: px(6),
    gap: px(4),
  },

  text: {
fontFamily: 'MiSans-Regular', 
fontSize:px(12),
lineHeight:px(16),
 color:'#AAAAAA', 
 fontWeight:400,
  },

  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },

  price: {
fontFamily: 'MiSans-Medium', 
fontSize:px(12), 
color:'#DE5452',
 //fontWeight:'400', 
 lineHeight:px(17),
  },

  footer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: px(12),
    gap: px(6),
  },

  btn: {
    width: px(108),
    height: px(30),
    borderWidth: px(1),
    borderColor: '#D8D8D8',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: px(15),
  },

  btnText: {
fontFamily: 'MiSans-Regular', 
fontSize:px(14), 
lineHeight:px(18), 
color:'rgba(170, 170, 170,0.8)', 
fontWeight:400,
  },

  primaryBtn: {
    width: px(108),
    height: px(30),
    borderRadius: px(15),
    justifyContent: 'center',
    alignItems: 'center',
  },

  primaryText: {
fontFamily: 'MiSans-Medium', 
fontSize: px(14), 
color: '#FFFFFF', 
lineHeight: px(18),
  },
})