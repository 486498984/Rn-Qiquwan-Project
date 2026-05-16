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
    rightText: '客服 / 申请退款',
  },
  IN_SERVICE: {
    label: '服务中',
    rightText: '客服 / 查看截图',
  },
  WAIT_CONFIRM: {
    label: '待收货',
    rightText: '申请售后 / 确认完成',
  },
  WAIT_COMMENT: {
    label: '待评价',
    rightText: '申请售后 / 前往评论',
  },
  FINISHED: {
    label: '已完成',
    rightText: '删除订单',
  },
}

const OrderItem = ({ item, navigation,refreshCurrentTab }) => {

  const status = STATUS_CONFIG[item.orderStatus] || STATUS_CONFIG.CREATED

const [countdown, setCountdown] = useState('29:59')

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
    navigation.navigate('OrderInfo', { id: item.id })
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
}
 };
 const handleleftbotton = (e) => { 
    console.log(e);
    if(e=="取消支付"){
   console.log(213123);
   handlecannl()

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
         refreshCurrentTab();
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
          handlePay(response.data.payInfo.payInfo)
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
        refreshCurrentTab();
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
       console.log('支付失败:', err);
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