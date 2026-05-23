import { StyleSheet, Text, View, TouchableOpacity, Image, ScrollView
  ,TextInput,KeyboardAvoidingView,Platform,
 } from 'react-native';
import React, { useEffect, useState } from 'react';
import { px } from '../../utils/scaleUtils';
import SafeFastImage from '../../components/Home/SafeFastImage'
import { IMG_URL } from '../../api/config';
import request from '../../api/request';
import Storage from '../../utils/storage';
import ImageUploader from '../../components/Shop/ImageUploader';
import LinearGradient from 'react-native-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  Radio,Toast, Modal as Modalitem,
} from '@ant-design/react-native'
import  {uploadImage}  from '../../api/uploadImage';
import useAuthStore from '../../utils/zustand';



export default function Refund({ navigation, route }) {
  const { orderinfo } = route.params || {};
  const [selectedType, setSelectedType] = useState('退款'); // 默认选中“退款”
  const [goodsinfo, setGoodsinfo] = useState({}); //商品详情
  const [addons, setAddons] = useState(""); //增值服务
  const [shopinfotx, setShopinfotx] = useState(""); //商品详情
  const [shopphoto, setShopphoto] = useState([]); //店铺相册
  const insets = useSafeAreaInsets(); 
  const bottomSafeHeight = insets.bottom; // 底部安全区高度（数值）
  const triggerListOrderRefresh =
  useAuthStore(
    state => state.triggerListOrderRefresh
  );

// 在 Refund 组件内增加状态
const [refundAmount, setRefundAmount] = useState(orderinfo?.payAmount/100 || 0); // 默认最大金额
const [maxAmount, setMaxAmount] = useState(orderinfo?.payAmount/100 || 0);

// 输入金额时的处理函数
const handleRefundAmountChange = (value) => {
  // 只允许输入数字和小数点
  let formattedValue = value.replace(/[^0-9.]/g, '');

  // 保留两位小数
  if (formattedValue.includes('.')) {
    const parts = formattedValue.split('.');
    formattedValue = parts[0] + '.' + parts[1].slice(0, 2);
  }

  // 不超过最大金额
  if (parseFloat(formattedValue) > maxAmount) {
    formattedValue = maxAmount.toString();
  }

  setRefundAmount(formattedValue);
};

  useEffect(() => {
    if (orderinfo) {
      console.log(orderinfo);
      getorderinfo(orderinfo.id)
    }
  }, [orderinfo]);

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
            // setMaxAmount(response.data.payAmount/100)
            // setRefundAmount(response.data.payAmount/100)
          console.log(JSON.parse(response.data.goodsSnapshot));
          let goods=JSON.parse(response.data.goodsSnapshot)
          setGoodsinfo(goods)
         console.log(goods);
        if(goods.addons!==null){
         const addonTitles = goods.addons
          ?.map(item => `${item.title}x${item.quantity}`)
          ?.join('，') || ''; 
          setAddons(addonTitles)
          console.log(addonTitles);
        }
       
        }
         } catch (error) {
           console.error(error);
         }

   };

  const handleback = () => {
    navigation.goBack();
  };

  // 切换选中状态
  const handleSelect = (type) => {
    setSelectedType(type);
  };
     const onChangeShopinfotx = (e) => {  //修改商品详情
    console.log(e);
    setShopinfotx(e)
};
const complete = () => {  //提交售后
   Modalitem.alert('提示', '是否提交？', [
      { text: '取消', onPress: () => console.log('cancel'), style: 'cancel' },
      { text: '确定', onPress: () => complete(),
       style: { color: '#FC9026' },
       },
    ])

 };
 const handlesubmit = async() => { 
  if(selectedType === '退款'){
  if(shopinfotx==""||shopinfotx.length<10){
    Toast.show({
    content: '请填写至少10个字以上的申请说明',
    duration: 2,
    position: 'center',
    mask: false,
  })
   return
  }
  console.log(refundAmount*100);
  if(refundAmount==""){
    Toast.show({
    content: '请填写退款金额',
    duration: 2,
    position: 'center',
    mask: false,
  })
   return
  }
     Modalitem.alert('提示', '是否提交？', [
      { text: '取消', onPress: () => console.log('cancel'), style: 'cancel' },
      { text: '确定', onPress: () => handlerefundmoney(),
       style: { color: '#FC9026' },
       },
    ])
  }else{
  if(shopinfotx==""||shopinfotx.length<10){
    Toast.show({
    content: '请填写至少10个字以上的申请说明',
    duration: 2,
    position: 'center',
    mask: false,
  })
   return
  }
     Modalitem.alert('提示', '售后只有1次提交机会，是否提交？', [
      { text: '取消', onPress: () => console.log('cancel'), style: 'cancel' },
      { text: '确定', onPress: () => handleother(),
       style: { color: '#FC9026' },
       },
    ])


  }

  };
  const handleother = async() => { 
  console.log(1222);
  const finlogo = await handleUploadAndFormat(shopphoto);
  console.log(finlogo);
  const data = {
  orderId: orderinfo.id,
  type: "OTHER",
  reason: shopinfotx,
};
// 只有 finlogo 有值时才加 evidence
if (finlogo) {
  data.evidence = finlogo;
}
  try {
    const response = await request({
      url: '/after_sale/apply',
      method: 'POST',
      data:data,
      query: {}
    });
    console.log(response);
    if(response.data!==undefined&&response.code==0){
      triggerListOrderRefresh();
       Toast.success({
        content: '提交成功',
        duration: 2,
        position: 'center',
        mask: false,
      })
      handleback();
    }else{
    Toast.fail({
    content: '提交售后失败，请稍后重试',
    duration: 2,
    position: 'center',
    mask: false,
  })
    }
    } catch (error) {
      console.error(error);
    }


  };
  const handlerefundmoney = async() => { 
  const finlogo = await handleUploadAndFormat(shopphoto);
  console.log(finlogo,orderinfo.id,shopinfotx,refundAmount*100,);
  const data = {
  orderId: orderinfo.id,
  type: "REFUND",
  reason: shopinfotx,
  applyAmount: refundAmount * 100,
};

// 只有 finlogo 有值时才加 evidence
if (finlogo) {
  data.evidence = finlogo;
}
  try {
    const response = await request({
      url: '/after_sale/apply',
      method: 'POST',
      data:data,
      query: {}
    });
    console.log(response);
    if(response.data!==undefined&&response.code==0){
      triggerListOrderRefresh();
       Toast.success({
        content: '提交成功',
        duration: 2,
        position: 'center',
        mask: false,
      })
      handleback();
    }else{
    Toast.fail({
    content: '提交售后失败，请稍后重试',
    duration: 2,
    position: 'center',
    mask: false,
  })
    }
    } catch (error) {
      console.error(error);
    }

   };
  const handleUploadAndFormat = async (imageList) => {
    try {
      if (!Array.isArray(imageList) || imageList.length === 0) {
        return '';
      }
  
      // 最终结果（保持原顺序）
      const resultList = [];
  
      // 本地图片待上传列表
      const localImages = [];
  
      // 记录本地图片在原数组中的位置
      const localIndexes = [];
  
      imageList.forEach((item, index) => {
        const uri = item?.uri;
  
        if (!uri) return;
  
        // 网络图
        if (uri.startsWith('http')) {
          const uploadIndex = uri.indexOf('upload/');
          if (uploadIndex !== -1) {
            const realPath = uri.substring(uploadIndex + 7); // 去掉 "upload/"
            resultList[index] = realPath;
          } else {
            resultList[index] = uri; // 防止异常格式
          }
        }
  
        // 本地图
        else {
          localImages.push(uri);
          localIndexes.push(index);
        }
      });
  
      // 上传本地图片
      if (localImages.length > 0) {
        const res = await uploadImage(localImages);
  
        const serverImages = Array.isArray(res.data) ? res.data : [];
  
        serverImages.forEach((img, i) => {
          const originalIndex = localIndexes[i];
          resultList[originalIndex] = img;
        });
      }
  
      // 去掉空值并拼接
      return resultList.filter(Boolean).join(',');
    } catch (error) {
      Toast.removeAll();
      Toast.fail('上传图片失败，请稍后重试');
      console.log('上传处理失败:', error);
      return '';
    }
  };

  // 输入框失去焦点处理
  const handleRefundAmountBlur = () => {
    let amount = parseFloat(refundAmount);

    // 如果不是有效数字，则重置为最大金额
    if (isNaN(amount) || amount <= 0) {
      setRefundAmount(maxAmount.toString());
      return;
    }

    // 判断“1.”的情况（可能是用户输入了 1. 或 1.0 之类）
    if (refundAmount.trim() === "1." || refundAmount.trim() === "1.0") {
      // 取消输入，自动改为最大金额
      setRefundAmount(maxAmount.toString());
      return;
    }

    // 如果超过最大金额，也修正
    if (amount > maxAmount) {
      setRefundAmount(maxAmount.toString());
    }
  };
  return (
    <View style={{ flex: 1, backgroundColor: '#F2F3F5' }}>
         <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={0}
      >
    <View style={{ flex: 1, backgroundColor: '#F2F3F5' }}>
      <View style={{ width: px(393), height: px(98), backgroundColor: '#fff', flexDirection: 'row', alignItems: 'flex-end' }}>
        <View
          style={{
            width: '100%',
            paddingHorizontal: px(16),
            marginBottom: px(18),
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <TouchableOpacity
            onPress={handleback}
            style={{
              position: 'absolute',
              left: px(16),
            }}
          >
            <Image source={require('../../../assets/images/my/left.png')} style={{ width: px(22), height: px(22) }} />
          </TouchableOpacity>
          <Text style={styles.title}>售后类型</Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={{ paddingHorizontal: px(16), }}
      showsVerticalScrollIndicator={false}>
        <View style={{ flexDirection: 'column', alignItems: 'center', marginTop: px(16)
          
         }}>
          <View
            style={{
              backgroundColor: '#fff',
              width: '100%',
              height: px(93),
              borderRadius: px(14),
              paddingHorizontal: px(8),
              paddingVertical: px(16),
            }}
          >
            <Text style={styles.bigtitle}>选择售后诉求</Text>
            <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: px(16), gap: px(16) }}>
              {/* 退款 */}
              <TouchableOpacity onPress={() => handleSelect('退款')}>
                <View style={selectedType === '退款' ? styles.chebox : styles.box}>
                  <Text style={[styles.boxtext, selectedType === '退款' ? { color: '#FF9500' } : { color: '#9E9E9E' }]}>退款</Text>
                </View>
              </TouchableOpacity>

              {/* 其他 */}
              <TouchableOpacity onPress={() => handleSelect('其他')}>
                <View style={selectedType === '其他' ? styles.chebox : styles.box}>
                  <Text style={[styles.boxtext, selectedType === '其他' ? { color: '#FF9500' } : { color: '#9E9E9E' }]}>其他</Text>
                </View>
              </TouchableOpacity>
            </View>
          </View>

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
 
       <TouchableOpacity style={{flexDirection: 'row',alignItems: 'center',gap:px(3)}}>
      <Image source={require('../../../assets/images/my/kefu.png')} 
    style={{width:px(16),height:px(16)}}></Image>
    <Text style={styles.yingfu}>客服</Text>
   </TouchableOpacity>

 
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
<Text style={styles.shopnames} numberOfLines={1}>数量：{orderinfo.quantity}</Text>
{addons!==""&&
<Text style={styles.shopnames} numberOfLines={1}>{addons}</Text>
}
</View>
    </View>
</View>
</View>

{selectedType === '退款'&&
<View style={{
  width: '100%',
  backgroundColor: '#fff',
  borderRadius: px(14),
  paddingVertical: px(16),
  paddingHorizontal: px(8),
  marginTop: px(8),
}}>
  <Text style={styles.bigtitle}>退款金额</Text>
  <View style={{flexDirection: 'row',alignItems: 'center',
    width: '100%',justifyContent: 'space-between',
  }}>
  <View style={{flexDirection: 'row',alignItems: 'center',marginTop: px(8),
    gap:px(8)
  }}>
     <Text style={styles.money}>¥</Text>
  <TextInput
    style={{
      width: px(140),
      height: px(40),
      borderRadius: px(8),
      backgroundColor: '#F7F8FC',
      // borderWidth: 1,
      // borderColor: '#E0E0E0',
      // borderRadius: px(8),
      //marginTop: px(8),
      paddingHorizontal: px(8),
      fontSize: px(14),
      color: '#1A1A1A',
      fontFamily: 'MiSans-Medium',
    }}
    keyboardType="numeric"
    value={refundAmount.toString()}
    onChangeText={handleRefundAmountChange}
    onBlur={handleRefundAmountBlur}
    placeholder="请输入退款金额"
    placeholderTextColor="#AAAAAA"
    maxLength={10}
  />
  </View>
  <Text style={{ fontSize: px(12), color: '#AAAAAA', marginTop: px(4) }}>
    最大退款金额：{maxAmount} 元
  </Text>
  </View>
</View>
}



<View style={{width: '100%',backgroundColor: '#fff',borderRadius: px(14),
    paddingVertical:px(16),paddingHorizontal:px(8),marginTop: px(8),
}}>
<View style={{width: '100%',
    flexDirection: 'row',alignItems: 'center',justifyContent: 'space-between',
    marginTop: px(0),
}}>
    <View style={{flexDirection: 'row',alignItems: 'center',}}>
<Text style={styles.bigtitle}>申请说明</Text>
    </View>

</View>

<View style={{width: '100%',backgroundColor: '#F7F8FC',
    marginTop: px(16),padding:px(16),borderRadius: px(8),
}}>
    <View style={{flexDirection: 'row',}}>
     <Image source={require('../../../assets/images/my/edit.png')} 
     style={{width:px(19),height:px(19),marginTop: px(0),}}></Image>
    <TextInput
    allowFontScaling={false}
    multiline
    style={styles.inputbox}
    onChangeText={onChangeShopinfotx}
    value={shopinfotx || ''}
    placeholder="必填，请您清晰描述问题/纠纷的原因"
    //keyboardType="number-pad"
    placeholderTextColor="#AAAAAA"
    maxLength={100}
    selectionColor='#FC9026'
    textAlignVertical="top"  
    onFocus={() => {
  // if (Platform.OS === 'ios') {
  //   scrollRef.current?.scrollToEnd({ animated: true });
  // }
  }}
    />
    </View>

<View style={{width: '100%',flexDirection: 'row',alignItems: 'center',justifyContent: 'flex-end',}}>
 <Text style={styles.count}>
        {shopinfotx?.length||0}
      </Text>
      <Text style={styles.countf}>/100</Text>
</View>
</View>
</View>


  <View style={{width: '100%',marginTop:px(8),backgroundColor: '#fff',
  borderRadius: px(14),paddingHorizontal:px(8),
  paddingTop: px(16),
  flexDirection: 'column',justifyContent: 'center',
  }}>
  <View style={{flexDirection: 'column',paddingBottom:px(8)}}>
    <View style={{flexDirection: 'row',alignItems: 'center',}}>
  <Text style={styles.bigtitle}>截图</Text>
    <Text style={styles.smalltitle}>(官方客服将以此截图作为评判标准)</Text>
    </View>

    <ImageUploader
      max={4}
      value={shopphoto}
      onChange={setShopphoto}
      />
    </View>
    </View>

<View style={{height:bottomSafeHeight+ px(100),}}></View>
        </View>
      </ScrollView>





    </View>
    </KeyboardAvoidingView>
<View style={{position: 'absolute',bottom:0,width: '100%',backgroundColor: '#fff',
   flexDirection: 'row',justifyContent: 'center',
}}>
    <View style={{paddingBottom: bottomSafeHeight+(Platform.OS=='ios'?0 :px(8)),
    alignItems: 'center',gap:px(3)}}>
<View style={{flexDirection: 'row',alignItems: 'center',marginTop: px(8),
    gap:px(21)
}}>

 {/* <TouchableOpacity>
<View style={styles.cannelbox}>
<Text style={styles.canneltx}>取消订单</Text>
</View>
       </TouchableOpacity> */}


       <TouchableOpacity onPress={()=>handlesubmit()}>
        <LinearGradient
              colors={['#FEC525', '#FC9026']} // 渐变颜色
              start={{ x: 1, y: 0 }}   
              end={{ x: 0, y: 0 }}
              style={[styles.payBox,{width: px(242),}]}
              >
              <View style={{flexDirection: 'row',alignItems: 'center',}}>
              <Text style={styles.xiadantx}>提交售后</Text>
              </View>
              </LinearGradient>
              </TouchableOpacity>
</View>
</View>
</View>  
</View>
  );
}

const styles = StyleSheet.create({
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
  smalltitle:{
 fontFamily: 'MiSans-Regular',
        fontSize:px(9),
        color:'#AAAAAA',
        fontWeight:400,
        lineHeight:px(12),
  },
  countf:{
 fontFamily: 'MiSans-Regular',
        fontSize:px(14),
        color:'#AAAAAA',
        fontWeight:400,
        lineHeight:px(19),
    },
    count:{
 fontFamily: 'MiSans-Regular',
        fontSize:px(14),
        color:'#767676',
        fontWeight:400,
        lineHeight:px(19),
    },
     inputbox:{
            paddingTop: px(0),     // ✅ 关键：统一顶部间距
  paddingBottom: px(8),
  paddingLeft: px(0),
  paddingRight: px(8),
  textAlignVertical: 'top', // Android 必须

    //backgroundColor: 'red',
    marginLeft: px(8),
  flexDirection: 'row',
  alignItems: 'center',
  width: px(300),
  height: px(100),
  fontSize: px(14),
   fontFamily: 'MiSans-Regular',
    },
      clubname:{
 fontFamily: 'MiSans-Medium',
        fontSize:px(14),
        color:'#000000',
        //fontWeight:500,
        lineHeight:px(19),
    },
          yingfu:{
 fontFamily: 'MiSans-Regular',
        fontSize:px(12),
        color:'#1A1A1A',
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
      shopnames:{
        width: px(244),
 fontFamily: 'MiSans-Regular',
        fontSize:px(12),
        color:'#AAAAAA',
        fontWeight:400,
        lineHeight:px(16),
    },
  boxtext: {
    fontFamily: 'MiSans-Regular',
    fontSize: px(12),
    fontWeight: '400',
    lineHeight: px(16),
  },
  box: {
    width: px(53),
    height: px(26),
    backgroundColor: '#F7F8FC',
    borderRadius: px(4),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  chebox: {
    width: px(53),
    height: px(26),
    backgroundColor: '#fff',
    borderRadius: px(4),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: px(1),
    borderColor: '#FF9500',
  },
  bigtitle: {
    fontFamily: 'MiSans-Medium',
    fontSize: px(14),
    color: '#000000',
    lineHeight: px(19),
  },
    money: {
    fontFamily: 'MiSans-Medium',
    fontSize: px(16),
    color: '#1A1A1A',
    lineHeight: px(21),
  },
  title: {
    fontFamily: 'MiSans-Medium',
    fontSize: px(16),
    color: '#1A1A1A',
    lineHeight: px(21),
  },
}); 