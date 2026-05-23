import { StyleSheet, Text, View,TouchableOpacity,Image,ScrollView,Platform,

 } from 'react-native'
import React,{useState,useEffect,} from 'react'
import { px } from '../../utils/scaleUtils';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import LinearGradient from 'react-native-linear-gradient';
import BottomModal from '../../components/My/BottomModal';
import {
  Radio,
} from '@ant-design/react-native'
import CustomModal from '../../components/My/CustomModal';
import request from '../../api/request';
import { IMG_URL } from '../../api/config';
import SafeFastImage from '../../components/Home/SafeFastImage'
import Clipboard from '@react-native-clipboard/clipboard';
import {
Toast, Modal as Modalitem,
} from '@ant-design/react-native'
import useAuthStore from '../../utils/zustand';
import ImagePreviewer from '../../components/Shop/ImagePreviewer';



const ORDER_STATUS_MAP = {
  WAIT_SERVICE: {
    title: '待服务',
    desc: '请及时安排打手...',
    image: require('../../../assets/images/my/clock.png'),
  },

  IN_SERVICE: {
    title: '服务中',
    desc: '订单进行中...',
    image: require('../../../assets/images/my/newso.png'),
  },

  WAIT_CONFIRM: {
    title: '待确认',
    desc: '3天后自动确认',
    image: require('../../../assets/images/my/clock.png'),
  },

  FINISHED: {
    title: '已完成',
    desc: '订单已完成',
    image: require('../../../assets/images/my/finish.png'),
  },
    CANCELED: {
    title: '已取消',
    desc: '订单已取消',
    image: require('../../../assets/images/my/cannelo.png'),
  },
};
const imgMap = {
  0: require('../../../assets/images/my/clock.png'),
  1: require('../../../assets/images/my/newso.png'),
  2: require('../../../assets/images/my/clock.png'),
  3: require('../../../assets/images/my/finish.png'),
};
export default function ShopOrderInfo({navigation,route}) {
          const insets = useSafeAreaInsets();
          const bottomSafeHeight = insets.bottom; // 底部安全区高度（数值）
 const { e } = route.params || {};
const [orderInfo, setOrderInfo] = useState(null);
 const [type, setType] = useState(0); //订单类型
 const [refund, setRefund] = useState(0); //退款原因
  const [refundsubmode, setRefundsubmode] = useState(1); //退款原因选择   
 const [refundmode, setRefundmode] = useState(1); //退款原因选择    
  const [refundmodal, setRefundmodal] = useState(false); //退款原因弹窗
   const [cannelstatus, setCannelstatus] = useState(false); //取消订单弹窗开关
    const [goods, setGoods] = useState({}); //商品详情
     const [addons, setAddons] = useState(""); //增值服务
     const [starttime, setStarttime] = useState("-"); //开始时间
const [endtime, setEndtime] = useState("-"); //结束时间
const [processList, setProcessList] = useState([]);
const [previewVisiblecon, setPreviewVisiblecon] = useState(false);
const [headimgviewcon, setHeadimgviewcon] = useState([]); // 图片数组
const [currentIndexcon, setCurrentIndexcon] = useState(0);
const [paytime, setPaytime] = useState("-"); //支付时间
const [currentStatus, setCurrentStatus] = useState("-"); //支付时间



const orderRefreshKey =
  useAuthStore(
    state => state.orderRefreshKey
  );

 const handleback = () => {  //返回上一页
   navigation.goBack();
     }; 
     const handlegocom = () => {  //点击右边按钮
    if(e==5){  //写评价
        navigation.navigate('Comment')
    }else if(orderInfo.orderStatus === 'WAIT_CONFIRM'){ //申请退款
setRefundmodal(true)
    }
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
   useEffect(() => {
     if(e){
    console.log(e);
    getorderinfo(e)
     }
   }, [e,orderRefreshKey])
   const getorderinfo = async(e) => { 
         try {
           const response = await request({
             url: '/store/order/detail',
             method: 'GET',
             data:{},
             query: {
              orderId:e.id,
              storeId:e.storeId
              }
           });
           console.log(response);
          if(response.data!==undefined&&response.code==0){
          setCurrentStatus(getStatus(response.data.order))
          setOrderInfo(response.data.order)
          let goods=JSON.parse(response.data.order.goodsSnapshot)
          setGoods(goods)
        const addonTitles = goods.addons
          ?.map(item => `${item.title}x${item.quantity}`)
          ?.join('，') || ''; 
          setAddons(addonTitles)
          console.log(addonTitles);
          if(response.data.logs!==null){
       const list = response.data.logs || [];

if (list.length > 0) {

  // 开始时间
  const startTime =
    list.find(item => item.nodeType === 'START')
      ?.updatedAt || '-';

  // 结束时间
  const endTime =
    list.find(item => item.nodeType === 'END')
      ?.updatedAt || '-';

  setStarttime(startTime);
  setEndtime(endTime);

  // 提取 PROCESS
  const processData = list.filter(
    item => item.nodeType === 'PROCESS'
  );
 console.log(processData);
 
  setProcessList(processData);

} else {
  setStarttime('-');
  setEndtime('-');
  setProcessList([]);
}
          }
   
  let paytype=response.data.order.paymentType
          if(response.data.order.paymentSnapshot!==null&&response.data.order.paymentSnapshot!==""){
          if(paytype=='WECHAT'){
          let payinfo=JSON.parse(response.data.order.paymentSnapshot)
          const date = new Date(payinfo.success_time);
const pad = (n) => n.toString().padStart(2, "0");
const formatted = `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ` +
                  `${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`;
                  setPaytime(formatted)
          }else{
            let payinfo=JSON.parse(response.data.order.paymentSnapshot)
           setPaytime(payinfo.gmt_payment)
          } 
          }
         
          }
         } catch (error) {
           console.error(error);
         }
    }; 

   const getStatus = (e) => {
    console.log(e.orderStatus);
  // 其他状态使用 STATUS_CONFIG
  return ORDER_STATUS_MAP[e.orderStatus];
  }  

// const currentStatus =
//   ORDER_STATUS_MAP[e.orderStatus];

  const handleCopyOrderNo = (e) => {
 console.log(e);
 

 if(e==1){
    if (!orderInfo?.orderNo) {
      Toast.show({
           content: '订单号不存在',
           duration: 2,
           position: 'center',
           mask: false,
         })
    return;
  }
  Clipboard.setString(orderInfo.orderNo);
  Toast.show({
           content: '订单号已复制',
           duration: 2,
           position: 'center',
           mask: false,
         })
 }else{
      if (!orderInfo?.userId) {
      Toast.show({
           content: '用户id不存在',
           duration: 2,
           position: 'center',
           mask: false,
         })
    return;
  }
Clipboard.setString(String(`1258${orderInfo.userId}`));
  Toast.show({
           content: '用户id已复制',
           duration: 2,
           position: 'center',
           mask: false,
         })
 }

};


    if (!orderInfo) {
  return (
    <View style={{
      flex:1,
      justifyContent:'center',
      alignItems:'center',
    }}>
      <Text>加载中...</Text>
    </View>
  );
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
              <Text style={styles.title}>订单详情</Text>
                 </View>
               </View>
<ScrollView style={{paddingHorizontal:px(16),paddingTop:px(16)}}
contentContainerStyle={{paddingBottom:px(110)}} showsVerticalScrollIndicator={false}>
<View style={{flexDirection: 'row',alignItems: 'center',
    justifyContent: 'space-between',
}}>
    <View style={{flexDirection: 'row',alignItems: 'center',gap:px(3)}}>
<Image
  source={currentStatus?.image}
  style={{width:px(32),height:px(32)}}
/>
<Text style={styles.toptitle}>
  {currentStatus?.title}
</Text>
 
    </View>
<Text style={styles.righttx}>
  {currentStatus?.desc}
</Text>
</View>
<View style={{width: '100%',backgroundColor: '#fff',borderRadius: px(14),
    paddingHorizontal:px(8),paddingVertical:px(16),marginTop: px(16),
}}>
<View style={{flexDirection: 'row',alignItems: 'center',justifyContent: 'space-between',}}>
 <Text style={styles.clubname}>一个大啦</Text>
    {(orderInfo.orderStatus === 'WAIT_SERVICE'||orderInfo.orderStatus === 'IN_SERVICE'||orderInfo.orderStatus === 'WAIT_CONFIRM') &&
       <TouchableOpacity style={{flexDirection: 'row',alignItems: 'center',gap:px(3)}}>
      {/* <Image source={require('../../../assets/images/my/kefu.png')} 
    style={{width:px(16),height:px(16)}}></Image> */}
    <Text style={[styles.yingfu,{color:'#FF9500'}]}>联系客户</Text>
   </TouchableOpacity>
    }

</View>
<View style={{flexDirection: 'row',alignItems: 'center',marginTop: px(16),}}>
   <SafeFastImage 
   source={{uri:IMG_URL+goods.goods.coverImage.split(',')[0]}}
                    style={{width:px(93),height:px(93),borderRadius: px(8),}}/>
    <View style={{height: px(93),flexDirection: 'column',
        justifyContent: 'space-between',marginLeft: px(8),}}>
<Text style={styles.shopname}>{goods?.goods?.title}</Text>
<View style={{flexDirection: 'column',gap:px(0)}}>
<Text style={styles.shopnames} >{goods?.sku?.title}</Text>
{addons!==""&&
<Text style={styles.shopnames} >{addons}</Text>
}
<Text style={styles.shopnames}>数量：{orderInfo?.quantity}</Text>
 
</View>
    </View>
</View>
</View>


{orderInfo.orderStatus === 'IN_SERVICE'&&
<View style={{width: '100%',backgroundColor: '#fff',borderRadius: px(14),
    paddingHorizontal:px(8),paddingVertical:px(16),marginTop: px(16),gap:px(16)}}>
<View style={{width: '100%',flexDirection: 'row',alignItems: 'center',justifyContent: 'space-between',}}>
    <Text style={styles.shoppricetx}>上传进度</Text>
</View>
<TouchableOpacity style={{width: px(345),height: px(47),backgroundColor: '#F2F3F5',
    borderRadius: px(8),borderWidth: px(1),borderColor: '#FF9500',
    flexDirection: 'row',alignItems: 'center',justifyContent: 'center',
}} onPress={()=>navigation.navigate('ShopScreenshot',{e})}>
<Image source={require('../../../assets/images/my/addshop.png')} 
    style={{width:px(18),height:px(18)}}></Image>
</TouchableOpacity>
</View>
}


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



<View style={{width: '100%',backgroundColor: '#fff',borderRadius: px(14),
    paddingHorizontal:px(8),paddingVertical:px(16),marginTop: px(16),gap:px(16)}}>
<View style={{width: '100%',flexDirection: 'row',alignItems: 'center',justifyContent: 'space-between',}}>
    <Text style={styles.shoppricetx}>商品总价</Text>
      <Text style={styles.shopprice}>￥{orderInfo?.totalAmount/100}</Text>
</View>
<View style={{width: '100%',flexDirection: 'row',alignItems: 'center',justifyContent: 'space-between',}}>
    <Text style={styles.shopdesnames}>优惠</Text>
      <Text style={styles.shopprice}>￥{orderInfo?.discountAmount/100}</Text>
</View>
<View style={{width: '100%',flexDirection: 'row',alignItems: 'center',
    justifyContent: 'flex-end',}}>
<View style={{flexDirection: 'row',alignItems: 'center',gap:px(3)}}>
          <Text style={styles.yingfu}>应付款</Text>
      <Text style={styles.shopprice}>￥{orderInfo?.payAmount/100}</Text>
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
     <Text style={styles.yingfu}>{orderInfo?.orderNo}</Text>
        <TouchableOpacity onPress={()=>handleCopyOrderNo(1)}>
         <Text style={[styles.yingfu,{fontSize:px(14),lineHeight:px(19)}]}>复制</Text>
         </TouchableOpacity>
</View>
</View>
<View style={{width: '100%',flexDirection: 'row',alignItems: 'center',
    justifyContent: 'space-between',}}>
    <Text style={styles.shopdesnames}>支付方式</Text>
 <Text style={styles.yingfu}>{orderInfo?.paymentType=="WECHAT"?'微信支付':'支付宝'}</Text>
</View>
<View style={{width: '100%',flexDirection: 'row',alignItems: 'center',
    justifyContent: 'space-between',}}>
    <Text style={styles.shopdesnames}>下单时间</Text>
      <Text style={styles.yingfu}>{orderInfo?.createdAt}</Text>
</View>
 
    <View style={{width: '100%',flexDirection: 'row',alignItems: 'center',
        justifyContent: 'space-between',}}>
        <Text style={styles.shopdesnames}>支付时间</Text>
        <Text style={styles.yingfu}>{paytime}</Text>
    </View>
</View>

<View style={{width: '100%',backgroundColor: '#fff',borderRadius: px(14),
    paddingHorizontal:px(8),paddingVertical:px(16),marginTop: px(16),gap:px(16)}}>
<View style={{width: '100%',flexDirection: 'row',alignItems: 'center',justifyContent: 'space-between',}}>
    <Text style={styles.shoppricetx}>客户信息</Text>
</View>
{/* <View style={{width: '100%',flexDirection: 'row',alignItems: 'center',
    justifyContent: 'space-between',}}>
    <Text style={styles.shopdesnames}>用户ID</Text>
     <View style={{flexDirection: 'row',gap:px(3),alignItems: 'center',
     }}>
     <Text style={styles.yingfu}>1258{orderInfo?.userId}</Text>
        <TouchableOpacity onPress={()=>handleCopyOrderNo(2)}>
         <Text style={[styles.yingfu,{fontSize:px(14),lineHeight:px(19)}]}>复制</Text>
         </TouchableOpacity>
</View>
</View> */}
<View style={{width: '100%',flexDirection: 'row',alignItems: 'center',
    justifyContent: 'space-between',}}>
    <Text style={styles.shopdesnames}>用户名</Text>
      <Text style={styles.yingfu}>{orderInfo?.userNickName}</Text>
</View>
<View style={{width: '100%',flexDirection: 'row',alignItems: 'center',
    justifyContent: 'space-between',}}>
    <Text style={styles.shopdesnames}>账号</Text>
      <Text style={styles.yingfu}>{orderInfo?.userPhone}</Text>
</View>
</View>



{starttime!=="-"&&endtime!=="-"&&
<View style={{width: '100%',backgroundColor: '#fff',borderRadius: px(14),
    paddingHorizontal:px(8),paddingVertical:px(16),marginTop: px(16),gap:px(16)}}>
<View style={{width: '100%',flexDirection: 'row',alignItems: 'center',justifyContent: 'space-between',}}>
    <Text style={styles.shoppricetx}>订单状态</Text>
</View>
<View style={{width: '100%',flexDirection: 'row',alignItems: 'center',
    justifyContent: 'space-between',}}>
    <Text style={styles.shopdesnames}>接单时间</Text>
     <View style={{flexDirection: 'row',gap:px(3),alignItems: 'center',
     }}>
     <Text style={styles.yingfu}>{starttime}</Text>
      {/* <Text style={styles.yingfu}>复制</Text> */}
</View>
</View>
<View style={{width: '100%',flexDirection: 'row',alignItems: 'center',
    justifyContent: 'space-between',}}>
    <Text style={styles.shopdesnames}>完成时间</Text>
      <Text style={styles.yingfu}>{endtime}</Text>
</View> 
{/* <View style={{width: '100%',flexDirection: 'row',alignItems: 'center',
    justifyContent: 'space-between',}}>
    <Text style={styles.shopdesnames}>操作人</Text>
      <Text style={styles.yingfu}>运营刘先生</Text>
</View> */}
</View>

}



</ScrollView>

    {e<2&& 
<View style={{position: 'absolute',bottom:0,width: '100%',backgroundColor: '#fff',
   flexDirection: 'row',justifyContent: 'center',
}}>
    <View style={{paddingBottom: bottomSafeHeight+(Platform.OS=='ios'?0 :px(8)),
    alignItems: 'center',gap:px(3)}}>
<View style={{flexDirection: 'row',alignItems: 'center',marginTop: px(8),
    gap:px(21)
}}>
{orderInfo.orderStatus === 'WAIT_SERVICE'&&
 <TouchableOpacity onPress={()=>setCannelstatus(true)}>
<View style={styles.cannelbox}>
<Text style={styles.canneltx}>取消订单</Text>
</View>
       </TouchableOpacity>
}
{/* {e==1&&
 <TouchableOpacity>
<View style={styles.cannelbox}>
<Text style={styles.canneltx}>取消支付</Text>
</View>
       </TouchableOpacity>
} */}
    {/* {(e<2)&&
    <TouchableOpacity>
    <View style={styles.cannelbox}>
    <Text style={styles.canneltx}>申请售后</Text>
    </View>
        </TouchableOpacity>
    } */}

       <TouchableOpacity onPress={()=>handlegocom()}>
        <LinearGradient
              colors={['#FEC525', '#FC9026']} // 渐变颜色
              start={{ x: 1, y: 0 }}   
              end={{ x: 0, y: 0 }}
              style={[styles.payBox,{width:(orderInfo.orderStatus === 'IN_SERVICE')? px(242):px(170),}]}
              >
              <View style={{flexDirection: 'row',alignItems: 'center',}}>
                  {e === 0 ? (
                    <Text style={styles.xiadantx}>接单</Text>
                    ) : e === 1 ? (
                    <Text style={styles.xiadantx}>完成</Text>
                    ) : null
                    }
            
              </View>
              </LinearGradient>
              </TouchableOpacity>
   
     

</View>
</View>
</View>    
}
   <CustomModal visible={cannelstatus} onClose={() => setCannelstatus(false)}
    width={px(323)} isclose={true}> 
       <Text style={styles.destitle}>取消订单</Text>
  <Text style={[styles.canneltxx,{marginTop: px(32)}]}>取消订单前，确保与客户沟通了解后再进行操作</Text>
  <TouchableOpacity
    style={{ marginTop: px(32) }}
    onPress={() => {
      setCannelstatus(false)
    }}
    activeOpacity={0.8}
  >
    {
        // 正常渐变按钮
        <LinearGradient
          colors={['#FEC525', '#FC9026']}
          start={{ x: 1, y: 0 }}
          end={{ x: 0, y: 0 }}
          style={styles.gradientBox}
        >
          <Text style={styles.logintext}>
            确定取消
          </Text>
        </LinearGradient>
    }
  </TouchableOpacity>
     </CustomModal>
    </View>
  )
}

const styles = StyleSheet.create({
        logintext:{
  fontFamily: 'MiSans-Medium',
    fontSize: px(18),
    color: '#FFFFFF',
    lineHeight: px(24),
  },
    gradientBox: {
    width:px(291),
    height: px(48),
    borderRadius: px(30),
    justifyContent: 'center',
    alignItems: 'center',
  },
    canneltxx:{
        textAlign:'center',
fontFamily: 'MiSans-Regular',
        fontSize:px(15),
        color:'#767676',
        fontWeight:400,
        lineHeight:px(26),
    },
            destitle:{
  fontFamily: 'MiSans-Medium',
    fontSize: px(19),
    color: '#1A1A1A',
    lineHeight: px(25),
    },
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