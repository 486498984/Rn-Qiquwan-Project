import { StyleSheet, Text, View,Image,StatusBar,TouchableOpacity,ScrollView,
Platform,BackHandler,Animated,ActivityIndicator,
 } from 'react-native'
import React,{useEffect,useState,} from 'react'
import { px } from '../../utils/scaleUtils';
import LinearGradient from 'react-native-linear-gradient';
import StarRating from '../../components/Club/StarRating'
import BottomSheet from '../../components/Home/BottomSheet'
import SafeFastImage from '../../components/Home/SafeFastImage'
//import Comment from './components/Comment'
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Stepper, Toast } from '@ant-design/react-native'
import Carousel from 'react-native-reanimated-carousel'
import { IMG_URL } from '../../api/config';
import FastImage from 'react-native-fast-image';
import ImagePreviewer from '../../components/Shop/ImagePreviewer';
import request from '../../api/request';


   const data = [
    require('../../../assets/images/home/shop11.png'),
    require('../../../assets/images/home/shop11.png'),
    require('../../../assets/images/home/shop11.png'),
  ]
export default function ShopPreview({navigation,route}) {
      const insets = useSafeAreaInsets();
      const bottomSafeHeight = insets.bottom; // 底部安全区高度（数值）
    const { shopinfo } =route.params||{}
      const [shopallinfo, setShopallinfo] = useState(null); //商品详情
        const [headimg, setHeadimg] = useState(data); //头图logo 
        const [conimage, setConimage] = useState(null); //商品相册
          const [storelogo, setStorelogo] = useState(null); //店铺logo
            const [storeinfo, setStoreinfo] = useState(null); //店铺详情
              const [ratioMap, setRatioMap] = useState({});
                const [sku, setSku] = useState({}); //第一个sku
                    const [skulist, setSkulist] = useState([]); //sku列表
     const [addonslist, setAddonslist] = useState([]); //add列表
   const [headImgErrorMap, setHeadImgErrorMap] = useState({});
const [contentImgErrorMap, setContentImgErrorMap] = useState({});
  const [visible, setVisible] = useState(false); //下单弹窗
    const [payways, setPayways] = useState(1); //支付方式
    const [paynum, setPaynum] = useState(1); //购买数量
      const [chshoptype, setChshoptype] = useState(0); //选择商品类型
const [selectedAddons, setSelectedAddons] = useState([]); // ⭐ 增值服务多选
const [modalImgError, setModalImgError] = useState(false);
 useEffect(() => {
   if(shopinfo){
   getshopinfo(shopinfo.id); //获取商品详情
   getstoreinfo(shopinfo.storeId) //获取店铺详情
   }
 }, [shopinfo])
 useEffect(() => {
  setModalImgError(false);
}, [headimg]);
const getshopinfo = async (e) => {
  try {
    const response = await request({
      url: '/store/goods/detail',
      method: 'GET',
      data: {},
      query: { id: e }
    });
  console.log(response);
    if (response.data !== undefined && response.code == 0) {
       const infodata = response.data;
       setShopallinfo(infodata.goods);
       if(infodata.skus!==null){
       setSku(infodata.skus[0])
       setSkulist(infodata.skus)
       }
       if(infodata.addons!==null){
        setAddonslist(infodata.addons)
       }
       setHeadimg(getImageData(infodata.goods.coverImage));
       setConimage(getImageData(infodata.goods.images));
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
        data:{},
        query: { id: e }
      });
      console.log(response);
      if(response.data!==undefined&&response.code==0){
       const infodata=response.data
       setStoreinfo(infodata) 
       setStorelogo(getImageData(infodata.storeLogo))
       console.log(getImageData(infodata.storeLogo));
       
      }
    } catch (error) {
      console.error(error);
    }
    };
const getImageData = (str) => {
  const domain = IMG_URL;

  return (str || "")
    .split(",")
    .filter(Boolean)
    .map((item) => {
      const cleanUrl = item.trim();

      const finalUrl = cleanUrl.startsWith("http")
        ? cleanUrl
        : domain + cleanUrl;

      return {
        uri: encodeURI(finalUrl),
      };
    });
};
useEffect(() => {
  setHeadImgErrorMap({});
}, [headimg]); 
const formatText = (str) => {
  return (str || "")
    .split(",")
    .filter(Boolean)
    .join(" | ");
};
  const handleback = () => {  //返回上一页
    navigation.goBack();
  };
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
    const handlechangenum = (e) => {
    console.log(e);
    setPaynum(e)
  };
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
    activeOpacity={1}>
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
        renderItem={({ item,index }) => (
        <SafeFastImage
        source={{uri: item.uri,}}
        style={{ width: px(393), height: px(360) }}
        resizeMode={FastImage.resizeMode.cover}
        />
        )}
      />
    </TouchableOpacity>
   <View style={{width: '100%',paddingHorizontal:px(16),marginTop: px(16),}}>
 <View style={{flexDirection: 'row',alignItems: 'flex-end',
    justifyContent: 'space-between',}}> 
    <View style={{flexDirection: 'row',alignItems: 'flex-end',}}>
    <Text style={styles.isprice}>￥{sku?.price ? sku.price / 100 : 128}</Text>
     <Text style={styles.smallprice}>
       ￥{
       sku?.originalPrice != null
        ? sku.originalPrice / 100
        : "-"
        }
     </Text>
    </View>
      <Text style={styles.salesnum}>销量{shopallinfo?.salesCount > 99 ? "99+" : shopallinfo?.salesCount || 0}</Text>
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
<Text style={styles.desone}>难度</Text>
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
 <View style={{flexDirection: 'row',alignItems: 'center',gap:px(3)}}>
<Image source={require('../../../assets/images/club/champion.png')} 
      style={{width:px(17),height:px(17),}}></Image>
<Text style={styles.clubname}>{storeinfo?.storeName}</Text>
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
   style={{}}>
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
      >
<SafeFastImage
  source={
     { uri: item.uri }
  }
  style={{
    width: px(393),
    aspectRatio: contentImgErrorMap[item.uri] ? 1 : ratio,
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
{/* {comments.length!==0&&
<View style={{width: '100%',height: px(8),backgroundColor: '#F8F8F8',
    marginTop: px(10),
}}></View>
} */}
</View>




</ScrollView>

<View style={[styles.botbox,{paddingBottom: bottomSafeHeight+(Platform.OS=='ios'?0 :px(6)),}]}>
   <View style={{marginTop: px(6),flexDirection: 'row',alignItems: 'center'}}>
    <View style={{flexDirection: 'row',alignItems: 'center',gap:px(0),marginLeft: px(18),}}>
<TouchableOpacity  style={{flexDirection: 'column',alignItems: 'center',
    width: px(46),
}}>
 <Image source={require('../../../assets/images/home/game.png')} 
         style={{width:px(34),height:px(34)}}></Image>
<Text style={styles.botext}>俱乐部</Text>
</TouchableOpacity>

<TouchableOpacity  style={{flexDirection: 'column',alignItems: 'center',
    width: px(46),
}}>
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
  //onPress={handleFollow}
  //activeOpacity={1}
>
  <Animated.View>
    <Image
      source={
           require('../../../assets/images/home/bostar.png')
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

<SafeFastImage
  source={ { uri: headimg[0].uri }
  }
  style={{
    width: px(111),
    height: px(111),
    borderRadius: px(8),
  }}
/>
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
    <Text style={styles.isprice}>{(sku?.price ?? 0) / 100}</Text>
     {/* <Text style={styles.smallprice}>￥388</Text> */}
    </View>
    <Text style={styles.modaldes}
    numberOfLines={1}>{formatText(shopallinfo?.serviceIds)}</Text>
    </View>
  <View style={{flexDirection: 'column',gap:px(6)}}>
  {/* <Text style={styles.modalnum}>编号：219739012479102</Text> */}
  <Stepper min={1} max={5}  
  readOnly 
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
  container: { flexDirection: 'row', alignItems: 'center',width: px(87),},
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

<ScrollView style={{marginTop: px(16),}} showsVerticalScrollIndicator={false}
contentContainerStyle={{paddingBottom:px(20)}}>
{/* <View style={{width: '100%',height: px(8),
backgroundColor: '#F8F8F8',}}></View> */}
<View style={{flexDirection: 'column',}}>
  <View style={{paddingHorizontal:px(16)}}>
<Text style={styles.comment}>商品类型</Text>
 {skulist?.map((item,index)=>
<TouchableOpacity onPress={() => {
  if (item.quantity === 0) {
    Toast.info({content:'该商品暂无库存',mask:false});
    return;
  }
  //setChshoptype(index);
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
 {addonslist!==null&&
 <View>
<Text style={[styles.comment,{marginTop: px(20),}]}>增值服务</Text>
 {addonslist?.map((item,index)=>
<TouchableOpacity 
//onPress={() => toggleAddon(index)}
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
>
  <Text style={styles.pricered}>
    暂无可用
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
<Text style={styles.shifuprice}>￥{(sku?.price ?? 0) / 100}</Text>
  </View>

<View  style={{flexDirection: 'row',alignItems: 'center',}}>
<Text style={styles.comments}>优惠：</Text>
<Text style={[styles.pricered,{marginRight: px(16),}]}>
  ￥0
</Text>
</View>
</View>
</View>

<View style={{width: '100%',height: px(8),marginTop: px(16),
backgroundColor: '#F8F8F8',}}></View>

<View style={{flexDirection: 'column',marginTop: px(10),paddingHorizontal:px(16)}}>
<Text style={styles.comment}>支付方式</Text>
<View style={{width: '100%',flexDirection: 'row',alignItems: 'center',
  justifyContent: 'space-between',marginTop: px(10)
}}>
  <TouchableOpacity style={payways==1?styles.ispaybox:styles.paybox} activeOpacity={0.8}
  onPress={()=>setPayways(1)}>
  <Image source={require('../../../assets/images/home/zfb.png')} 
         style={{width:px(32),height:px(32)}}></Image>
      <Text style={styles.zfbtx}>支付宝支付</Text>
  </TouchableOpacity>
  <TouchableOpacity style={payways==2?styles.ispaybox:styles.paybox} activeOpacity={0.8}
  onPress={()=>setPayways(2)}>
  <Image source={require('../../../assets/images/home/wechat.png')} 
         style={{width:px(32),height:px(32)}}></Image>
           <Text style={styles.wechattx}>微信支付</Text>
  </TouchableOpacity>
</View>
</View>

</View> 


</ScrollView>
<View  style={{paddingBottom: bottomSafeHeight,flexDirection: 'row',
  alignItems: 'flex-start',justifyContent: 'center',
}}>
  <TouchableOpacity
  //onPress={()=>handlecreatorder()}
  >
 <LinearGradient
       colors={['#FEC525', '#FC9026']} // 渐变颜色
       start={{ x: 1, y: 0 }}   
       end={{ x: 0, y: 0 }}
       style={styles.payBox}
       >
       <View style={{flexDirection: 'row',alignItems: 'center',}}>
       <Text style={styles.xiadantx}>立即支付</Text>
       <Text style={styles.bxiadantx}>￥{(sku?.price ?? 0) / 100}</Text>
       </View>
       </LinearGradient>
       </TouchableOpacity>
    </View>

        </View>
      </BottomSheet>

      
    </View>
  )
}

const styles = StyleSheet.create({
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