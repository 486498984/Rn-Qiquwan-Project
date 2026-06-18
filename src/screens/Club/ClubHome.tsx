import { StyleSheet, Text, View ,Image,TouchableOpacity,ScrollView,
    ActivityIndicator,FlatList,Dimensions,
} from 'react-native'
import React,{useState,useEffect,} from 'react'
import { px } from '../../utils/scaleUtils';
import StarRating from '../../components/Club/StarRating'
import LinearGradient from 'react-native-linear-gradient';
import {
  NoticeBar,
} from '@ant-design/react-native'
import HotService from './components/HotService'
import ShopItem from '../../components/Home/ShopItem'
import Tabs from './components/Tabs'
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import request from '../../api/request'
import SafeFastImage from '../../components/Home/SafeFastImage'
import AutoImage from '../../components/Club/AutoImage'
import {IMG_URL } from '../../api/config';
import Storage from '../../utils/storage';
import { Stepper, Toast } from '@ant-design/react-native'
import { TabView } from "react-native-tab-view";
import Content from './components/Content'
const { width } = Dimensions.get("window");



  const routes = [
    { key: "0", title: "全部" },
    { key: "1", title: "护航" },
    { key: "2", title: "大神" },
    { key: "3", title: "任务" },
    { key: "4", title: "跑刀" },
  ];
const shoplistd2=[
    { key: "0",title:'全部',type:1, },
  { key: "1",title:'护航',type:1, },
  { key: "2",title:'大神',type:1, },
  { key: "0",title:'全部',type:1, },
  { key: "1",title:'护航',type:1, },
  { key: "2",title:'大神',type:1, },
];
export default function ClubHome({navigation,route}) {
    const {storeinfo}=route.params
   const [follow, setFollow] = useState(true) //店铺关注
   const [shoplist, setShoplist] = useState(shoplistd2)
   const [mode, setMode] = useState(1)
   const [tabIndex, setTabIndex] = useState(0)
   const [number, setNumber] = useState(0)
      const [noMore, setNoMore] = useState(false)
      const [photolist, setPhotolist] = useState([]) //相册列表
        const insets = useSafeAreaInsets();
        const bottomSafeHeight = insets.bottom; // 底部安全区高度（数值）
      const [storedata, setStoredata] = useState("") //店铺详情
    const [newshop, setNewshop] = useState([]) //新商品列表
const [hotshop, setHotshop] = useState([]) //热销商品列表
const [reshop, setReshop] = useState([]) //推荐商品列表
  const [tablist, setTablist] = useState(routes)  //tab列表
  const [dataMap, setDataMap] = useState({});
  const [shopnumber, setShopnumber] = useState(8)
  const [notice, setNotice] = useState(null) //公告详情


          const handleback = () => {  //返回上一页
         navigation.goBack();
          };
          useEffect(() => {
           if(storeinfo!==undefined){
            console.log(storeinfo);
            getstoreinfo(storeinfo) //获取店铺详情
            getfollow(storeinfo)//获取关注状态
            getshoplist(storeinfo,'isNew') //获取商品列表
            getshoplist(storeinfo,'isHot') //获取商品列表
            getshoplist(storeinfo,'isRecommend') //获取商品列表
            gettabinfo();
            getnotice(storeinfo);
           }
          }, [storeinfo])
          useEffect(() => {
            const list = dataMap[tablist[tabIndex].key]?.list
            console.log("list131",list,dataMap);
            
            if (Array.isArray(list) && list.length > 0) {
              setShopnumber(list.length)
            }
          }, [dataMap, tabIndex])
            useEffect(() => {
          
            const key = tablist[tabIndex]?.key;
          
            if (key) { 
              fetchList(key, 1, false); // ✅ 每次切换都请求
            }
          }, [tabIndex]);
          const getnotice = async(e) => { 
        try {
    const response = await request({
      url: '/store/notice/detail',
      method: 'GET',
      data: {
        },
      query: {
        storeId:e.id,
      },
        }); 
      console.log('address',response);
      if (response.data !== null && response.code == 0&&response.data.status=="PUBLISHED") {
      setNotice(response.data)
      }
      } catch (error) {
      console.error(error);
      }

           };
const gettabinfo = async () => {
  const routes = await gettabslist(); // 👈 返回 routes
  const key = routes?.[tabIndex]?.key;

  if (key) {
    fetchList(key, 1, false);
  }
};
  // ✅ 请求数据（核心）
  const fetchList = async (categoryId, page = 1, isLoadMore = false) => {

    if (dataMap[categoryId]?.loading) return

    setDataMap(prev => ({
      ...prev,
      [categoryId]: {
        ...(prev[categoryId] || {}),
        loading: true,
      }
    }))

    const res = await request({
      url: "/goods/list",
      method: "GET",
      query: {
        categoryId,
        page,
        pageSize: 10,
        storeId:storeinfo.id,
      },
    })

    const newData = res?.data?.list || []

setDataMap(prev => {
  const old = prev[categoryId] || { list: [], page: 1 }

  const oldList = Array.isArray(old.list) ? old.list : []
  const newList = Array.isArray(newData) ? newData : []

  const list = isLoadMore
    ? [...oldList, ...newList]
    : newList

  return {
    ...prev,
    [categoryId]: {
      list,
      page,
      hasMore: newList.length === 10,
      loading: false,
    }
  }
})
  };
const gettabslist = async () => { 
  try {
    const response = await request({
      url: '/category/tree',
      method: 'GET',
    });

    if (response.data && response.code == 0) {
      const list = response.data[0].children;

      const routes = [
        { key: "0", title: "全部" },
        ...list.map(item => ({
          key: String(item.id),
          title: item.name,
        }))
      ];

      setTablist(routes);
      return routes; // ✅ 返回
    }
  } catch (error) {
    console.error(error);
  }
};
  // ✅ 渲染tab内容
  const renderScene = ({ route }) => {
    //const key = Number(route.key)
    const key = route.key; // ✅ 不要转 Number
    const data = dataMap[key] || {
      list: [],
      page: 1,
      hasMore: true,
      loading: false,
    }

    return (
      <Content
        data={data}
        navigation={navigation}
        loadMore={() => {
          if (!data.hasMore || data.loading) return
          fetchList(key, data.page + 1, true)
        }}
      />
    )
  }
          const getshoplist = async(e,type) => { 
           try {
             const response = await request({
               url: '/goods/list',
               method: 'GET',
               data:{},
               query: {
               categoryId:0, 
               page:1,
               pageSize:4,
               storeId:e.id,
               [type]: 1,
               }
             });
             console.log(response);
            if(response.data.list!==null&&response.code==0){
              let res=response.data.list
                     // 根据不同类型存数据
      if (type === 'isNew') {
        setNewshop(res);
      }

      if (type === 'isHot') {
        setHotshop(res);
      }

      if (type === 'isRecommend') {
        setReshop(res);
      }
            }
           } catch (error) {
             console.error(error);
           }

           };
          const getstoreinfo = async(e) => {  //获取店铺信息
           try {
             const response = await request({
               url: '/store/detail',
               method: 'GET',
               data:{},
               query: {id:e.id}
             });
             console.log(response);
            if(response.data!==undefined&&response.code==0){
                let res=response.data
                setStoredata(res)
                 const imgList = res.storePhoto
                    ? res.storePhoto.split(',')
                    : [];
                  console.log(imgList);
                  setPhotolist(imgList)
                  if(response.data?.openStatus=="CLOSED"){
                  Toast.info({content:'该店铺已打烊',mask:false,duration:2});
                  }
            }
           } catch (error) {
             console.error(error);
           }
           };
           const getfollow = async(e) => { //获取关注状态
            const user = await Storage.get("userinfo");
            console.log(user);
            
            if(user==null){ //未登陆的情况
          
            return
            }

          try {
             const response = await request({
               url: '/store/follow/status',
               method: 'GET',
               data:{},
               query: {userId:user.user.userId,storeId:e.id}
             });
             console.log(response);
            if(response.data!==undefined&&response.code==0){
                let res=response.data
            setFollow(!res.isFollowed)
            }
           } catch (error) {
             console.error(error);
           }
            };
     const handleChangeMode = (e) => { 
        console.log(e);
        if(e!==mode){
        setMode(e)
        }
      };
      // const routes = React.useMemo(() => [
      //   { key: "0", title: "全部" },
      //   { key: "1", title: "特价" },
      //   { key: "2", title: "上新" },
      //   { key: "3", title: "限购" },
      // ], []);
  const handleScrollEnd = (event) => {
  const { layoutMeasurement, contentOffset, contentSize } = event.nativeEvent;
  if (layoutMeasurement.height + contentOffset.y >= contentSize.height - 20) {
    console.log("底部了！！！");
   if(number<3){
    setShoplist(prev => [
    ...prev,
    { key: "3", title: '新商品1', type: 2 },
    { key: "4", title: '新商品2', type: 2 }
    ]);
    setNumber(prev => prev + 1)
  }else{
    setNoMore(true)
  }
  }
  };

  const handlefollow = async() => {  //关注
      const user = await Storage.get("userinfo");
            console.log(user);
            if(user==null){ //未登陆的情况
            Toast.info({content:'请先完成登陆',mask:false});
            return
            }
       if(follow){ //关注
       try {
             const response = await request({
               url: '/store/follow',
               method: 'POST',
               data:{},
               query: {userId:user.user.userId,storeId:storedata.id}
             });
             console.log(response);
            if(response.data!==undefined&&response.code==0){
             getfollow(storedata)
            }
           } catch (error) {
             console.error(error);
           }
            }else{ //取消关注
            try {
             const response = await request({
               url: '/store/unfollow',
               method: 'POST',
               data:{},
               query: {userId:user.user.userId,storeId:storedata.id}
             });
             console.log(response);
            if(response.data!==undefined&&response.code==0){
             getfollow(storedata)
            }
           } catch (error) {
             console.error(error);
           }
       }
       };
  const handlegokefu = async() => {
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
                storeId:storedata.id
              }
             });
             console.log(response);
            if(response.data!==undefined&&response.code==0){
              console.log(response.data.userId);
                
              let a={
                storeName: '123',
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
  return (
    <View style={styles.container}>
     <View style={styles.top}>
        <View style={{flexDirection: 'row',alignItems: 'center',width: '100%',
            justifyContent: 'space-between',marginBottom: px(12),}}>
                <View style={{flexDirection: 'row',alignItems: 'center',gap:px(12)}}>
                    <TouchableOpacity onPress={handleback}>
 <Image source={require('../../../assets/images/my/left.png')} 
              style={{width:px(22),height:px(22)}}></Image>
                    </TouchableOpacity>

<Text style={styles.title}>俱乐部</Text>
                </View>
                <View style={{flexDirection: 'row',alignItems: 'center',gap:px(12)}}>
  <TouchableOpacity style={styles.parallelogram}
    onPress={()=>navigation.navigate('Searchlist',{type:1,id:storeinfo.id})}>
       <Image source={require('../../../assets/images/home/searchbox.png')} 
         style={{width:px(187),height:px(34),position: 'absolute',}}></Image>
    <Image source={require('../../../assets/images/home/search.png')} 
         style={{width:px(16),height:px(16),marginLeft: px(12),}}></Image>
         <Text style={styles.searchtext}>搜店内商品</Text>
</TouchableOpacity>
<TouchableOpacity style={{width:px(32),height: px(32),flexDirection: 'row',
    alignItems: 'center',gap:px(5),justifyContent: 'center',
}} onPress={()=> navigation.navigate('ClubInfo',{shopinfo:storedata})}>
<View style={{width: px(4),height: px(4),borderRadius: px(2),
    backgroundColor: '#FF9500',}}></View>
    <View style={{width: px(4),height: px(4),borderRadius: px(2),
    backgroundColor: '#FF9500',}}></View>
    <View style={{width: px(4),height: px(4),borderRadius: px(2),
    backgroundColor: '#FF9500',}}></View>
</TouchableOpacity>

</View>
        </View>
     </View>
{mode==1&&
<ScrollView contentContainerStyle={{paddingHorizontal:px(16),paddingBottom:px(120)}}
showsVerticalScrollIndicator={false}>
<View style={{flexDirection: 'row',alignItems: 'center',justifyContent: 'space-between',
    marginTop: px(16),
}}>
<SafeFastImage source={{uri:IMG_URL+storedata?.storeLogo}} 
style={{width:px(65),height:px(65),borderRadius: px(4),}}/>
<View style={{flexDirection: 'row',alignItems: 'center',
justifyContent: 'space-between',width: px(290),height: px(65),}}>

 <View style={{flexDirection: 'column',justifyContent: 'space-between',
  height: px(65),
 }}>
        <View style={{flexDirection: 'row',alignItems: 'flex-start',
    justifyContent: 'space-between',}}>
        <View style={{flexDirection: 'row',alignItems: 'flex-start',}}>
<Image source={require('../../../assets/images/club/champion.png')} 
      style={{width:px(24),height:px(24),}}></Image>
<Text style={styles.clubname} numberOfLines={2}>{storedata?.storeName}</Text>
        </View>

</View>
<View style={{flexDirection: 'row',alignItems: 'flex-start',
   marginTop: px(0),}}>
        <View style={{flexDirection: 'row',alignItems: 'center',gap:px(3)}}>
<StarRating score={5}></StarRating>
<Text style={styles.score}>5.0</Text>
        </View>
<Text style={[styles.score,{marginLeft: px(8),}]}>{storedata?.followCount}关注</Text>
</View>



        </View> 
<TouchableOpacity onPress={()=>handlefollow()} style={{}}>
    {follow&&
     <LinearGradient
    colors={['#FEC525', '#FC9026']} // 渐变颜色
    start={{ x: 1, y: 0 }}   
    end={{ x: 0, y: 0 }}
    style={styles.gradientBox}
    >
    <View style={{flexDirection: 'row',alignItems: 'center',}}>
    <Text style={styles.logintext}>关注</Text>
    </View>
    </LinearGradient>
    }
    {!follow&&
<View style={{width: px(66),height: px(27),borderRadius: px(6),justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.2)',flexDirection: 'row',alignItems: 'center',}}>
 <Text style={styles.logintext}>已关注</Text>
</View>
    }
</TouchableOpacity>
{/* <View style={{flexDirection: 'row',alignItems: 'center',
    justifyContent: 'space-between',}}>
<View style={{flexDirection: 'row',alignItems: 'flex-end',}}>
<Text style={styles.price}>8</Text>
<Text style={styles.yuan}>元</Text>
<Text style={styles.yuandes}>最低起</Text>
    </View>  
<View style={{width: px(1),height: px(8),
    backgroundColor: 'rgba(118, 118, 118,0.2)',}}></View>
<View style={{flexDirection: 'row',alignItems: 'flex-end',}}>
<Text style={styles.price}>98</Text>
<Text style={styles.yuan}>%</Text>
<Text style={styles.yuandes}>好评率</Text>
    </View>  
<View style={{width: px(1),height: px(8),
    backgroundColor: 'rgba(118, 118, 118,0.2)',}}></View>
<View style={{flexDirection: 'row',alignItems: 'flex-end',}}>
<Text style={styles.price}>199</Text>
<Text style={styles.yuan}>人</Text>
<Text style={styles.yuandes}>最近下单</Text>
    </View>  
    <View style={{width: px(1),height: px(8),
    backgroundColor: 'rgba(118, 118, 118,0.2)',}}></View>
<View style={{flexDirection: 'row',alignItems: 'flex-end',}}>
<Text style={styles.price}>99</Text>
<Text style={styles.yuan}>件</Text>
<Text style={styles.yuandes}>商品</Text>
    </View>  
</View> */}
</View>
</View>
  {notice!==null&&
  <View style={{marginTop: px(12),}}>
      <NoticeBar marqueeProps={{ loop: true }}
      icon={<Image source={require('../../../assets/images/club/notice.png')} 
      style={{width:px(18),height:px(18),}}></Image>}
        styles={{
      font: { color: '#1A1A1A',},
      marquee:{fontSize:px(13),fontFamily: 'MiSans-Medium',lineHeight:px(17)},
      background: { backgroundColor: '#fff' },
      iconWrap:{marginLeft: px(7),},
      container:{borderRadius: px(8),},
      }}
      >
    {notice?.content}
  </NoticeBar>
  </View>
  }
 
<View style={{marginTop: px(12),}}>
    {/* <Image source={require('../../../assets/images/club/clubback.png')} 
    style={{width:'100%',height:px(626),}}></Image> */}
  {
    photolist?.map((item,index)=>(
      <AutoImage
        key={index}
        uri={IMG_URL+item}
      />
    ))
  }
</View>
{hotshop.length!==0&&
<View style={{flexDirection: 'column',marginTop: px(12),}}>
<View style={{flexDirection: 'row',alignItems: 'center',justifyContent: 'space-between',}}>
<Text style={styles.hottitle}>主推热销</Text>
<Image source={require('../../../assets/images/club/decoration.png')} 
style={{width:px(251),height:px(18),}}></Image>
</View>
<View style={{flexDirection: 'row',flexWrap: 'wrap',marginTop: px(12),gap:px(10)}}>
    {hotshop?.map((item,index)=>
     <HotService key={index} item={item} navigation={navigation}></HotService>
    )}
</View>
</View>
}
 {newshop.length!==0&&
 <View style={{flexDirection: 'column',marginTop: px(12),}}>
<View style={{flexDirection: 'row',alignItems: 'center',justifyContent: 'space-between',}}>
<Text style={styles.hottitle}>新品套餐</Text>
<Image source={require('../../../assets/images/club/decoration.png')} 
style={{width:px(251),height:px(18),}}></Image>
</View>
<View style={{flexDirection: 'column',marginTop: px(12),gap:px(16)}}>
    {newshop?.map((item,index)=>
     <ShopItem key={index} item={item} navigation={navigation} type={2}/>
    )}
</View>
</View>
 }
 {reshop.length!==0&&
 <View style={{flexDirection: 'column',marginTop: px(12),}}>
<View style={{flexDirection: 'row',alignItems: 'center',justifyContent: 'space-between',}}>
<Text style={styles.hottitle}>推荐套餐</Text>
<Image source={require('../../../assets/images/club/decoration.png')} 
style={{width:px(251),height:px(18),}}></Image>
</View>
<View style={{flexDirection: 'column',marginTop: px(12),gap:px(16)}}>
    {reshop?.map((item,index)=>
     <ShopItem key={index} item={item} navigation={navigation} type={2}/>
    )}
</View>
</View>
 }
</ScrollView>
}
{mode==2&&
<ScrollView  contentContainerStyle={{paddingHorizontal:px(0),paddingBottom:px(120)}}
showsVerticalScrollIndicator={false}
stickyHeaderIndices={[1]} onMomentumScrollEnd={handleScrollEnd}>
  <View style={{paddingHorizontal:px(16)}}>
<View style={{flexDirection: 'row',alignItems: 'center',justifyContent: 'space-between',
    marginTop: px(16),
}}>
<SafeFastImage source={{uri:IMG_URL+storedata?.storeLogo}} 
style={{width:px(65),height:px(65),borderRadius: px(4),}}/>
<View style={{flexDirection: 'row',alignItems: 'center',
justifyContent: 'space-between',width: px(290),height: px(65),}}>

 <View style={{flexDirection: 'column',justifyContent: 'space-between',
  height: px(65),
 }}>
        <View style={{flexDirection: 'row',alignItems: 'flex-start',
    justifyContent: 'space-between',}}>
        <View style={{flexDirection: 'row',alignItems: 'flex-start',}}>
<Image source={require('../../../assets/images/club/champion.png')} 
      style={{width:px(24),height:px(24),}}></Image>
<Text style={styles.clubname} numberOfLines={2}>{storedata?.storeName}</Text>
        </View>

</View>
<View style={{flexDirection: 'row',alignItems: 'flex-start',
   marginTop: px(0),}}>
        <View style={{flexDirection: 'row',alignItems: 'center',gap:px(3)}}>
<StarRating score={5}></StarRating>
<Text style={styles.score}>5.0</Text>
        </View>
<Text style={[styles.score,{marginLeft: px(8),}]}>{storedata?.followCount}关注</Text>
</View>



        </View> 
<TouchableOpacity onPress={()=>handlefollow()} style={{}}>
    {follow&&
     <LinearGradient
    colors={['#FEC525', '#FC9026']} // 渐变颜色
    start={{ x: 1, y: 0 }}   
    end={{ x: 0, y: 0 }}
    style={styles.gradientBox}
    >
    <View style={{flexDirection: 'row',alignItems: 'center',}}>
    <Text style={styles.logintext}>关注</Text>
    </View>
    </LinearGradient>
    }
    {!follow&&
<View style={{width: px(66),height: px(27),borderRadius: px(6),justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.2)',flexDirection: 'row',alignItems: 'center',}}>
 <Text style={styles.logintext}>已关注</Text>
</View>
    }
</TouchableOpacity>
{/* <View style={{flexDirection: 'row',alignItems: 'center',
    justifyContent: 'space-between',}}>
<View style={{flexDirection: 'row',alignItems: 'flex-end',}}>
<Text style={styles.price}>8</Text>
<Text style={styles.yuan}>元</Text>
<Text style={styles.yuandes}>最低起</Text>
    </View>  
<View style={{width: px(1),height: px(8),
    backgroundColor: 'rgba(118, 118, 118,0.2)',}}></View>
<View style={{flexDirection: 'row',alignItems: 'flex-end',}}>
<Text style={styles.price}>98</Text>
<Text style={styles.yuan}>%</Text>
<Text style={styles.yuandes}>好评率</Text>
    </View>  
<View style={{width: px(1),height: px(8),
    backgroundColor: 'rgba(118, 118, 118,0.2)',}}></View>
<View style={{flexDirection: 'row',alignItems: 'flex-end',}}>
<Text style={styles.price}>199</Text>
<Text style={styles.yuan}>人</Text>
<Text style={styles.yuandes}>最近下单</Text>
    </View>  
    <View style={{width: px(1),height: px(8),
    backgroundColor: 'rgba(118, 118, 118,0.2)',}}></View>
<View style={{flexDirection: 'row',alignItems: 'flex-end',}}>
<Text style={styles.price}>99</Text>
<Text style={styles.yuan}>件</Text>
<Text style={styles.yuandes}>商品</Text>
    </View>  
</View> */}
</View>
</View>
{storedata?.Notice!==null&&
<View style={{marginTop: px(12),}}>
     <NoticeBar marqueeProps={{ loop: true }}
     icon={<Image source={require('../../../assets/images/club/notice.png')} 
     style={{width:px(18),height:px(18),}}></Image>}
      styles={{
    font: { color: '#1A1A1A',},
    marquee:{fontSize:px(13),fontFamily: 'MiSans-Medium',lineHeight:px(17)},
    background: { backgroundColor: '#fff' },
    iconWrap:{marginLeft: px(7),},
    container:{borderRadius: px(8),},
    }}
    >
  {storedata?.Notice?.content}
</NoticeBar>
</View>
}
</View>
    <View style={{marginTop: px(10),backgroundColor: '#F2F3F5',}}>
  <Tabs  index={tabIndex} routes={tablist}
     onChange={(i) => {
     setTabIndex(i)
    //pagerRef.current?.setPage(i) // 👈 关键
  }}></Tabs>
    </View>
 <View style={{paddingHorizontal:px(0),paddingTop: px(10),
    backgroundColor: '#F2F3F5',
    height:px(52)+ px(136)*shopnumber,
  }}>
        <TabView
          key={tablist.length}
          navigationState={{ index: tabIndex, routes: tablist }}
          onIndexChange={setTabIndex}
          renderTabBar={() => null}   // 关闭默认TabBar
          renderScene={renderScene}
          initialLayout={{width}}
          lazy
          lazyPreloadDistance={1}
        />
  </View>

</ScrollView>
}
<View style={[styles.bottom,{}]}>
    <View style={{marginTop: px(8),flexDirection: 'row',
        alignItems: 'center',gap:px(21)}}>
<TouchableOpacity onPress={()=>handleChangeMode(1)} style={{paddingHorizontal:px(21),
paddingBottom:bottomSafeHeight+px(16)
}}>
<Text style={mode==1?styles.bottomtx:styles.nobottomtx}>首页</Text>
</TouchableOpacity>
<View style={{width: px(1),height: px(9),marginBottom : bottomSafeHeight+px(16),
    backgroundColor: 'rgba(118, 118, 118,0.2)',}}></View>

<TouchableOpacity onPress={()=>handleChangeMode(2)} style={{paddingHorizontal:px(21),
   paddingBottom:bottomSafeHeight+px(16)
}}>
<Text style={mode==2?styles.bottomtx:styles.nobottomtx}>商品</Text>
</TouchableOpacity>


<View style={{width: px(1),height: px(9),marginBottom : bottomSafeHeight+px(16),
    backgroundColor: 'rgba(118, 118, 118,0.2)',}}></View>
<TouchableOpacity style={{paddingHorizontal:px(21),
paddingBottom:bottomSafeHeight+px(16)
}} onPress={()=>handlegokefu()}>
<Text style={styles.nobottomtx}>客服</Text>
</TouchableOpacity>
    </View>

</View>
    </View>
  )
}

const styles = StyleSheet.create({
      photoimage: {
    width: '100%',
    //height: 120,
    borderRadius: px(12),
    //marginRight: 10,
  },
   bottomtext:{
 fontFamily: 'MiSans-Regular',
        fontSize:px(13),
        color:'#767676',
        fontWeight:400,
        lineHeight:px(17),
  },
    hottitle:{
 fontFamily: 'DingTalk JinBuTi',
        fontSize:px(20),
        color:'#1A1A1A',
        //fontWeight:800,
        lineHeight:px(24),
    },
        nobottomtx:{
     fontFamily: 'MiSans-Regular',
        fontSize:px(16),
        color:'#AAAAAA',
        fontWeight:400,
        lineHeight:px(21),
    },
    bottomtx:{
     fontFamily: 'MiSans-Medium',
        fontSize:px(16),
        color:'#FF9500',
        //fontWeight:500,
        lineHeight:px(21),
    },
    bottom:{
        flexDirection: 'row',
        alignItems: 'flex-start',
        justifyContent: 'center',
    position: 'absolute',
    bottom:0,
    width: '100%',
    //height: px(70),
    backgroundColor: '#fff',
shadowColor: '#000',
shadowOffset: { width: 0, height: -8 }, // ⭐ 关键：负数 = 向上
shadowOpacity: 0.1,
shadowRadius: 20,
elevation: 8, // Android
    },
            logintext:{
        fontFamily: 'MiSans-Medium',
        fontSize:px(13),
        color:'#FFFFFF',
        //fontWeight:500,
        lineHeight:px(17),
    },
          gradientBox: {
    width:px(66),
    height: px(27),
    borderRadius: px(6),
    justifyContent: 'center',
    alignItems: 'center',
  },
        clubname:{
          width: px(180),
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
    yuandes:{
 fontFamily: 'MiSans-Regular',
        fontSize:px(10),
        color:'#AAAAAA',
        fontWeight:400,
        //lineHeight:px(20),
},
    yuan:{
 fontFamily: 'MiSans-Regular',
        fontSize:px(10),
        color:'#1A1A1A',
        fontWeight:400,
        //lineHeight:px(20),
    },
    price:{
 fontFamily: 'MiSans-Medium',
        fontSize:px(15),
        color:'#1A1A1A',
        //fontWeight:500,
        //lineHeight:px(28),
    },
      searchtext:{
   fontFamily: 'MiSans-Regular',
        fontSize:px(12),
        color:'rgba(255, 255, 255, 0.7)',
        fontWeight:400,
        lineHeight:px(16),
        marginLeft: px(4),
  },
    parallelogram: {
  position: 'relative',
  width: px(187),
  height: px(34),
  //backgroundColor: 'rgba(0, 0, 0, 0.1)',
  //transform: [{ skewX: '-20deg' }],
  flexDirection: 'row',
  alignItems: 'center',
  //borderRadius: px(10),
},
    title:{
 fontFamily: 'DingTalk JinBuTi',
        fontSize:px(28),
        color:'#1A1A1A',
        //fontWeight:800,
        lineHeight:px(34),
    },
    top:{
        paddingHorizontal:px(16),
        flexDirection: 'row',
        alignItems: 'flex-end',
width:px(393),
height: px(98),
backgroundColor: '#FFFFFF',
    },
    container:{
        flex: 1,
        backgroundColor: '#F2F3F5',
    }
})