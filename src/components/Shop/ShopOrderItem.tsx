import { StyleSheet, Text, View,Image,TouchableOpacity } from 'react-native'
import React,{useState,useEffect} from 'react'
import { px } from '../../utils/scaleUtils';
import LinearGradient from 'react-native-linear-gradient';
import { IMG_URL } from '../../api/config';
import SafeFastImage from '../../components/Home/SafeFastImage'
import request from '../../api/request';
import Storage from '../../utils/storage';
import {
  Toast, Modal as Modalitem,
} from '@ant-design/react-native'



const STATUS_UI = {
  WAIT_SERVICE: {
    label: '待服务',
    rightText: '待服务',
    actions: ['contact', 'cancel', 'accept'],
    gradientText: '接单',
  },
  IN_SERVICE: {
    label: '服务中',
    rightText: '服务中',
    actions: ['contact', 'complete','upload'],
    gradientText: '完成',
    uploadText:'上传进度'
  },
  WAIT_CONFIRM: {
    label: '待确认',
    rightText: '等待用户确认',
    actions: ['contact'],
  },
  FINISHED: {
    label: '已完成',
    rightText: '已完成',
    actions: [],
  },
  CANCELED: {
    label: '已取消',
    rightText: '已取消',
    actions: [],
  },
    CLOSED: {
    label: '已取消',
    rightText: '已取消',
    actions: [],
  },
};
const OrderItem=({item,navigation,refreshAllTabs})=> {
 const [addons, setAddons] = useState(""); //增值服务
 const [goods, setGoods] = useState(JSON.parse(item.goodsSnapshot)); //商品详情
    const handlegoinfo = (e) => { //进入详情
    console.log(e);
    navigation.navigate('ShopOrderInfo',{e:item})
    };
    useEffect(() => {
      if(item){
       const goods=JSON.parse(item.goodsSnapshot)
        console.log(goods.addons);
    const addonTitles = goods.addons
      ?.map(item => `${item.title}x${item.quantity}`)
      ?.join('，') || '';
      setAddons(addonTitles)
      console.log(addonTitles);
      }
    
    }, [item])
     console.log(JSON.parse(item.goodsSnapshot));
     //const skulist=JSON.parse(item.skuList)
     const status = item.orderStatus;
     const ui = STATUS_UI[status] || STATUS_UI.WAIT_SERVICE;
     const handlecanner = async() => {  //取消订单
       console.log(22131);
          Modalitem.alert('提示', '是否取消？', [
           { text: '取消', onPress: () => console.log('cancel'), style: 'cancel' },
           { text: '确定', onPress: () => handlesubcanner(),
            style: { color: '#FC9026' },
            },   
         ])
      };
    const handlesubcanner = async() => {  //取消订单
    console.log(123,item);
      const user = await Storage.get("userinfo");
           try {
             const response = await request({
               url: '/order/refund',
               method: 'POST',
               data:{
                orderId: item.id,
                userId: item.userId,
                refundReason: `俱乐部主动退款${user.user.userId}`
               },
               query: {

                }
             });
             console.log(response);
            if(response.data!==undefined&&response.code==0){
            refreshAllTabs();
            Toast.success({
           content: '退款成功',
           duration: 2,
           position: 'center',
           mask: false,
           })
            refreshAllTabs()
            }else{
            Toast.fail({
           content: '退款失败，请联系平台客服处理',
           duration: 2,
           position: 'center',
           mask: false,
           })
            }
           } catch (error) {
             console.error(error);
           }

     };
     const handleaccept = () => {  //接单
     console.log('iteminfo',ui.gradientText,item,);
       Modalitem.alert('提示', '是否接单？', [
           { text: '取消', onPress: () => console.log('cancel'), style: 'cancel' },
           { text: '确定', onPress: () => handlesubaccept(),
            style: { color: '#FC9026' },
            },   
         ])

      };
      const handlesubaccept = async() => { 
        const user = await Storage.get("userinfo");
           try {
             const response = await request({
               url: '/store/order/start',
               method: 'POST',
               data:{
                orderId: item.id,
                storeId: item.storeId,
                playerId: user.user.userId
               },
               query: {

                }
             });
             console.log(response);
            if(response.data!==undefined&&response.code==0){
            refreshAllTabs();
            Toast.success({
            content: '接单成功',
            duration: 2,
            position: 'center',
            mask: false,
            })
            refreshAllTabs()
            }else{
            Toast.fail({
            content: '接单失败，请稍后再试～',
            duration: 2,
            position: 'center',
            mask: false,
            })
            }
           } catch (error) {
             console.error(error);
           }
       };
      const handlefinish = () => {  //完成订单
       Modalitem.alert('提示', '是否完成订单？', [
           { text: '取消', onPress: () => console.log('cancel'), style: 'cancel' },
           { text: '确定', onPress: () => handlesubfinish(),
            style: { color: '#FC9026' },
            },   
         ])

       };
       const handlesubfinish = async() => {  //提交完成订单
           try {
             const response = await request({
               url: '/store/order/finish',
               method: 'POST',
               data:{
                orderId: item.id,
                storeId: item.storeId,
               },
               query: {

                }
             });
             console.log(response);
            if(response.data!==undefined&&response.code==0){
            refreshAllTabs();
            Toast.success({
           content: '订单确认成功，请等待用户确认',
           duration: 2,
           position: 'center',
           mask: false,
           })
            refreshAllTabs()
            }else{
            Toast.fail({
           content: '订单确认失败，请稍后再试～',
           duration: 2,
           position: 'center',
           mask: false,
           })
            }
           } catch (error) {
             console.error(error);
           }

        };
  const handleupload = () => {  //上传进度
  navigation.navigate('ShopScreenshot',{e:item})
  };
  const handleaddremake = async() => {  //添加备注
    console.log(213,item);
        Modalitem.prompt(
          '提示',
          '请输入备注',
          
          (inputValue) => {
            // 如果输入为空
            if (!inputValue || inputValue.trim() === '') {
              Toast.info('请输入备注', 1); // 显示提示
              return false; // 阻止 Modal 关闭
            }
            // 输入有效
            handlenoagree(inputValue)
            console.log('输入内容:', inputValue);
            // 在这里执行确认操作，例如提交接口
          },
          'default', // 类型：default / secure-text / login-password
          '', // 默认值
          ['添加备注信息'], // placeholder
        );
    //refreshAllTabs()
    return


    };
    const handlenoagree = async(e) => { 
      console.log(item.remark);
      let remark=JSON.parse(item.remark)
      console.log(remark);
      remark.store=e
      console.log(remark);
               try {
             const response = await request({
               url: '/store/order/remark',
               method: 'PUT',
               data:{
                orderId: item.id,
                remark: JSON.stringify(remark),
               },
               query: {

                }
             });
             console.log(response);
            if(response.data!==undefined&&response.code==0){
            Toast.success({
           content: '添加成功',
           duration: 2,
           position: 'center',
           mask: false,
           })
            refreshAllTabs()
            }
           } catch (error) {
             console.error(error);
           }

     };
  return (
    <View style={styles.container}>
        <TouchableOpacity style={{width: px(361),
        backgroundColor: '#fff',borderRadius: px(14),padding:px(8)}}
        onPress={()=>handlegoinfo(item)} activeOpacity={1}>
<View style={{width: '100%',flexDirection: 'row',
    alignItems: 'center',justifyContent: 'space-between',}}>
      <TouchableOpacity style={{flexDirection: 'row',alignItems: 'center',}}>
<Text style={styles.clubname}>{item.userNickName}</Text>
        <Image source={require('../../../assets/images/my/right.png')} 
        style={{width:px(19),height:px(19)}}></Image>
</TouchableOpacity>

<Text style={[styles.waittime,{color:ui.label=='已取消'?'#AAAAAA':'#FF9500'}]}>
  {ui.label}
</Text>
</View>
<View style={{flexDirection: 'row',alignItems: 'center',marginTop: px(8),}}>
  <View style={styles.shopimgbox}>
    <View>
   <SafeFastImage 
   source={{uri:IMG_URL+goods.goods.coverImage.split(',')[0]}}
                    style={{width:px(120),height:px(120),}}/>
            <Image source={require('../../../assets/images/home/shopboder.png')}  
            style={{width:px(120),height:px(120),position: 'absolute',}}></Image>
    </View>
    
{/* {item.types==1&&
    <Image source={require('../../../assets/images/home/type/protect.png')} 
    style={{width:px(57),height:px(23),position: 'absolute',
    bottom:0,left:0
    }}></Image>
}
{item.types==2&&
    <Image source={require('../../../assets/images/home/type/ace.png')} 
    style={{width:px(57),height:px(23),position: 'absolute',
    bottom:0,left:0
    }}></Image>
}
{item.types==3&&
    <Image source={require('../../../assets/images/home/type/task.png')} 
    style={{width:px(57),height:px(23),position: 'absolute',
    bottom:0,left:0
    }}></Image>
}
{item.types==4&&
    <Image source={require('../../../assets/images/home/type/knife.png')} 
    style={{width:px(57),height:px(23),position: 'absolute',
    bottom:0,left:0
    }}></Image>
} */}
</View>
<View style={{flexDirection: 'column',justifyContent: 'space-between',
    marginLeft: px(3),}}>
<Text style={styles.ordername}>{goods?.goods?.title}</Text>
<View style={{gap:px(4)}}>
<Text style={[styles.ordername,{color:'#767676'}]}>备注：{JSON.parse(item.remark).store==""?'-':JSON.parse(item.remark).store}</Text>
<Text style={styles.ordertime}>{goods?.sku?.title}</Text>
{addons!==""&&
<Text style={styles.ordertime}>{addons}</Text>
}

<Text style={styles.ordertime}>下单时间：{item.createdAt}</Text>
<Text style={styles.ordertime}>订单编号：{item.orderNo}</Text>
<View style={{width: px(222),flexDirection: 'row',alignItems: 'center',
    justifyContent: 'space-between',
}}>
<Text style={styles.ordertime}>数量：{item.quantity}</Text>
<Text style={styles.orderprice}>￥{item.payAmount/100}</Text>
</View>
</View>

</View>
</View>
<View style={{flexDirection:'row',justifyContent:'flex-end',gap:px(6),marginTop: px(13),}}>


    <TouchableOpacity style={styles.cannelbox} onPress={()=>handleaddremake()}>
      <Text style={styles.canneltext}>添加备注</Text>
    </TouchableOpacity>
  {/* {ui.actions?.includes('contact') && (
    <TouchableOpacity style={styles.cannelbox}>
      <Text style={styles.canneltext}>联系客户</Text>
    </TouchableOpacity>
  )} */}

  {ui.actions?.includes('cancel') && (
    <TouchableOpacity style={styles.cannelbox} onPress={()=>handlecanner()}>
      <Text style={styles.canneltext}>取消订单</Text>
    </TouchableOpacity>
  )}

  {ui.actions?.includes('accept') && (
    <TouchableOpacity onPress={()=>handleaccept()}>
      <LinearGradient
        colors={['#FEC525', '#FC9026']}
        start={{ x: 1, y: 0 }} end={{ x: 0, y: 0 }}
        style={styles.gradientBox}
      >
        <Text style={styles.logintext}>
          {ui.gradientText}
        </Text>
      </LinearGradient>
    </TouchableOpacity>
  )}

  {ui.actions?.includes('upload') && (
    <TouchableOpacity onPress={()=>handleupload()}>
      <LinearGradient
        colors={['#FEC525', '#FC9026']}
         start={{ x: 1, y: 0 }} end={{ x: 0, y: 0 }}
        style={styles.gradientBox}
      >
        <Text style={styles.logintext}>
          {ui.uploadText}
        </Text>
      </LinearGradient>
    </TouchableOpacity>
  )}

  {ui.actions?.includes('complete') && (
    <TouchableOpacity onPress={()=>handlefinish()}>
      <LinearGradient
        colors={['#FEC525', '#FC9026']}
         start={{ x: 1, y: 0 }} end={{ x: 0, y: 0 }}
        style={styles.gradientBox}
      >
        <Text style={styles.logintext}>
          {ui.gradientText}
        </Text>
      </LinearGradient>
    </TouchableOpacity>
  )}

</View>
     </TouchableOpacity>
      



    </View>
  )
}
export default React.memo(OrderItem);
const styles = StyleSheet.create({
      logintext:{
  fontFamily: 'MiSans-Medium',
    fontSize: px(14),
    color: '#FFFFFF',
    lineHeight: px(18),
  },
            gradientBox: {
    width:px(108),
    height: px(30),
    borderRadius: px(15),
    justifyContent: 'center',
    alignItems: 'center',
  },
    canneltext:{
  fontFamily: 'MiSans-Regular',
        fontSize:px(14),
        lineHeight:px(18),
        color:'rgba(170, 170, 170,0.8)',
        fontWeight:400,
    },
    cannelbox:{
width: px(108),
height: px(30),
borderRadius: px(15),
borderWidth: px(1),
borderColor: '#D8D8D8',
flexDirection: 'row',
justifyContent: 'center',
alignItems: 'center',
    },
    orderprice:{
 fontFamily: 'MiSans-Medium',
        fontSize:px(12),
        color:'#DE5452',
        //fontWeight:'400',
        lineHeight:px(17),
    },
    ordertime:{
  fontFamily: 'MiSans-Regular',
        fontSize:px(12),
        lineHeight:px(16),
        color:'#AAAAAA',
        fontWeight:400,
    },
    ordername:{
        width: px(222),
 fontFamily: 'MiSans-Medium',
        fontSize:px(16),
        color:'#1A1A1A',
        //fontWeight:'400',
        lineHeight:px(21),
    },
        shopimgbox:{
        width: px(120),
        height: px(120),
position: 'relative',
    },
    waittime:{
     fontFamily: 'MiSans-Regular',
        lineHeight:px(16),
        fontSize:px(12),
        color:'#FF9500',
        fontWeight:400,
    },
    clubname:{
    fontFamily: 'MiSans-Medium',
        fontSize:px(14),
        color:'#000000',
        //fontWeight:'400',
        lineHeight:px(19),
    },
container:{
    //marginTop: px(12),
    flex:1,
}
})