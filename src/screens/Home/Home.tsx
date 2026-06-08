import { StyleSheet, Text, View,Image,TouchableOpacity,ScrollView,
Dimensions,Linking,RefreshControl,Platform,Alert,
 } from 'react-native'
import React,{useRef,useState,useEffect,useCallback,} from 'react'
import { px } from '../../utils/scaleUtils';
import HotServices from './components/HotServices'
import StarClub from './components/StarClub'
import Tabs from './components/Tabs'
import Content from './components/Content'
import Carousel from 'react-native-reanimated-carousel'
import { TabView } from "react-native-tab-view";
const { width } = Dimensions.get("window");
const { height } = Dimensions.get('window')
//import {Tabs} from '@ant-design/react-native'
import PagerView from 'react-native-pager-view';
import useAuthStore from '../../utils/zustand'
import { addEventListener } from "@react-native-community/netinfo";
import request from '../../api/request';
import { BASE_URL,IMG_URL } from '../../api/config';
import FastImage from 'react-native-fast-image';
import { Toast } from '@ant-design/react-native'
import DeviceInfo from 'react-native-device-info';
import UpdateModal from '../../components/Home/UpdateModal'; // 引入组件
import BannerCarousel from './components/BannerCarousel';



  const routes = [
    { key: "0", title: "全部" },
    { key: "1", title: "护航" },
    { key: "2", title: "大神" },
    { key: "3", title: "任务" },
    { key: "4", title: "跑刀" },
  ];
export default function Home({navigation}) {
  const privacyAgreed = useAuthStore(state => state.privacyAgreed);
  const pagerRef = useRef(null)
  const [index, setIndex] = useState(0)  //banner选择下标
  const [tabIndex, setTabIndex] = useState(0) //默认选择下标
  const [shopnumber, setShopnumber] = useState(8)
  const [noMoreTabs, setNoMoreTabs] = useState([]); 
  const [isBottom, setIsBottom] = useState(false);
  const [tablist, setTablist] = useState(routes)  //tab列表
  const [dataMap, setDataMap] = useState({});
  const [isOnline, setIsOnline] = useState(true);
  const [bannerlist, setBannerlist] = useState([]); //banner
  const [storelist, setStorelist] = useState([]); //明星俱乐部
    const [shoplist, setShoplist] = useState([]); //热门商品
  const data = [
    require('../../../assets/images/home/banner1.png'),
    require('../../../assets/images/home/banner1.png'),
    require('../../../assets/images/home/banner1.png'),
  ]
  const versionName = DeviceInfo.getVersion();   // "1.0.0"
  const versionCode = DeviceInfo.getBuildNumber(); // "1"


 


const unsubscribeRef = useRef(null);
//const [hasInit, setHasInit] = useState(false)
useEffect(() => {
  console.log('privacyAgreed',privacyAgreed);
  console.log('isOnline',isOnline);
  
  if (!privacyAgreed) return;
  unsubscribeRef.current = addEventListener(state => {
    // const online =
    //   state.isConnected === true &&
    //   (state.isInternetReachable === true ||
    //   state.isInternetReachable === null);
const online = !!state.isConnected
      console.log(online);
      
    setIsOnline(online);
    if (online) {
      console.log("有网，开始请求");
      gettabinfo();
      getHomeConfig();
      updates();
      // ✅ 关键：请求一次后停止监听
      unsubscribeRef.current && unsubscribeRef.current();
    } 
  });
  return () => {
    unsubscribeRef.current && unsubscribeRef.current();
  };
}, [privacyAgreed]);
  const [hasShownUpdateAlert, setHasShownUpdateAlert] = useState(false);
    const [updateVisible, setUpdateVisible] = useState(false);
    const [apkUrl, setApkUrl] = useState("");
  const [updateways, setUpdateways] = useState(1); //0否，1是
  const [updatename, setUpdatename] = useState("1.0.0"); //更新版本号
  const [updateContent, setUpdaContent] = useState("是否立即下载？"); //更新内容
    const updates = async() => { 
      console.log(999888,versionName,versionCode);
         
    try {
        const response = await request({
          url: '/get/app/version',
          method: 'GET',
          data:{
          },
          query: {platform:Platform.OS}
          });
          console.log(response); 
          console.log(111222666);
          if(response.code==0&&response.data!==null){
          if(Platform.OS=='ios'&& !hasShownUpdateAlert){
   const currentVersion = DeviceInfo.getVersion(); // 当前 App 版本
  const latestVersion = response.data.edition_name;      // 后台最新版本
  const appStoreUrl = response.data.edition_url;
   if(response.data.edition_number>Number(versionCode)){
    // 弹出原生 Alert 
    Alert.alert( 
      '发现新版本',
      `是否立即升级？`,
      [
        { text: '取消', style: 'cancel' },
        { text: '升级', onPress: () => Linking.openURL(appStoreUrl) },
      ],
      { cancelable: false }
     );
        setHasShownUpdateAlert(true); // 标记已弹出
     } 
  
      }else if(Platform.OS=='android'){
          if(response.data.edition_number>versionCode){
          setUpdateways(response.data.edition_force)
          setApkUrl(response.data.edition_url);
          setUpdatename(response.data.edition_name)
          setUpdaContent(response.data.update_desc)
          setUpdateVisible(true);  
          }
       
          }
          }
          
          } catch (error) {
            console.error(error);
          }
     };
const gettabinfo = async () => {

  
  const routes = await gettabslist(); // 👈 返回 routes
  const key = routes?.[tabIndex]?.key;

  if (key) {
    console.log('fetchList1');
    fetchList(key, 1, false);
  }
};
const getHomeConfig = async () => {
  try {
    const response = await request({
      url: '/home/config',
      method: 'GET',
    });
    console.log(response);
    
    if (response.data && response.code == 0) {

      const modules = response.data.modules || [];

      // banner
      const bannerData = modules.find(
        item => item.moduleKey === 'banner'
      );

      if (bannerData) {
        const newBanner = bannerData.items.map(item => ({
          ...item,
          imageUrl: IMG_URL + item.imageUrl,
        }));

        setBannerlist(newBanner);
      }

      // 明星俱乐部
      const storeData = modules.find(
        item => item.moduleKey === 'starStore'
      );

      if (storeData) {
        setStorelist(storeData.items);
      }

      // 热门商品
      const hotData = modules.find(
        item => item.moduleKey === 'hotGoods'
      );

      if (hotData) {
        setShoplist(hotData.items);
      }
    }

  } catch (error) {
    console.log(error);
  }
};
 const getbanner = async() => { 
           try {
             const response = await request({
               url: '/home/config',
               method: 'GET',
               data:{},
               query: {}
             });
             console.log(response);
            if(response.data!==undefined&&response.code==0){
              let data=response.data.modules
 const bannerData = data.find(item => item.moduleKey === 'banner')
 console.log(bannerData); 
 const newList = bannerData.items.map(item => ({
  ...item,
  imageUrl: IMG_URL + item.imageUrl
}))
console.log(newList);
setBannerlist(newList)
            }
           } catch (error) {
             console.error(error);
           }
  };
  const getstorelist = async() => { 
           try {
             const response = await request({
               url: '/home/config',
               method: 'GET',
               data:{},
               query: {}
             });
             console.log(response);
            if(response.data!==undefined&&response.code==0){
       let data=response.data.modules
 const storeData = data.find(item => item.moduleKey === "starStore")
 console.log(storeData); 
 setStorelist(storeData.items)
            }
           } catch (error) {
             console.error(error);
           }
   };
     const gethotgoods = async() => { 
           try {
             const response = await request({
               url: '/home/config',
               method: 'GET',
               data:{},
               query: {}
             });
             console.log(response);
            if(response.data!==undefined&&response.code==0){
            let data=response.data.modules
            const shopData = data.find(item => item.moduleKey === "hotGoods")
            console.log(shopData); 
            setShoplist(shopData.items)
            }
           } catch (error) {
             console.error(error);
           }
   };

   const hasInit = useRef(false);
  useEffect(() => {
  // 未同意隐私协议
  if (!privacyAgreed) {
    return;
  }

  // 无网络
  if (!isOnline) {
    return;
  }
  if (hasInit.current) return;
  const key = tablist[tabIndex]?.key;

  if (key) { 
console.log('fetchList2');
    fetchList(key, 1, false); // ✅ 每次切换都请求
  }
}, [tabIndex, privacyAgreed, isOnline]);

useEffect(() => {
  const list = dataMap[tablist[tabIndex].key]?.list
  console.log("list131",list,dataMap);
  
  if (Array.isArray(list) && list.length > 0) {
    setShopnumber(list.length)
  }
}, [dataMap, tabIndex])

const firstLoadDone = useRef(false);
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
    console.log('请求了商品接口！');
    
    const res = await request({
      url: "/goods/list",
      method: "GET",
      query: {
        categoryId,
        page,
        pageSize: 10,
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
    // ✅ 初始化完成后才允许 loadMore
  firstLoadDone.current = true;
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
           if (!firstLoadDone.current) return; // 🚨 首次禁止触底加载
          if (!data.hasMore || data.loading) return
          console.log('fetchList3');
          fetchList(key, data.page + 1, true)
        }}
      />
    )
  }
 
const handleScrollEnd = (event) => {
  console.log('打印handleScrollEnd');
  const { layoutMeasurement, contentOffset, contentSize } = event.nativeEvent;
  if (
    layoutMeasurement.height + contentOffset.y >=
    contentSize.height - 20
  ) {
    console.log("底部了！！！");
    const key = tablist[tabIndex]?.key;
    const currentData = dataMap[key];
    if (!currentData?.hasMore || currentData?.loading) {
      return;
    }
    console.log('fetchList4');
    fetchList(
      key,
      currentData.page + 1,
      true
    );
  }
};
const isNoMore = (tabKey) => {
  return noMoreTabs.includes(tabKey);
};
const handleNoMore = (tabKey) => {
  setNoMoreTabs(prev => {
    if (prev.includes(tabKey)) return prev;
    return [...prev, tabKey];
  });
};
const [pagerHeight, setPagerHeight] = useState(300);
// useEffect(() => {
//   gettabslist();
// }, [])
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
  const handlegobanner = useCallback((e) => {  //banner点击操作
  console.log(e);
  if(e.linkType=="URL"){ //跳转网站
  Linking.openURL(e.linkValue)
  }else if(e.linkType=="GOODS"){ //跳转商品
    console.log(e);
    if(e.goodsInfo!==undefined){
    navigation.navigate('Shopinfo',{shopinfo:e.goodsInfo})
    }else{
  Toast.show({
    content: '该商品已下架，看看别的吧～',
    duration: 2,
    position: 'center',
    mask: false,
  })
    }
  }else if(e.linkType=="STORE"){
  console.log(1312);
  navigation.navigate('ClubHome',{storeinfo:e.storeInfo})
  }
}, []);
 
    const [refreshing, setRefreshing] = useState(false);
const onRefresh = async () => {
  if (refreshing) return;
  setRefreshing(true);
  try {
    await Promise.all([
      gettabinfo(),
      getHomeConfig(),
    ]);

  } catch (error) {
    console.log(error);
  } finally {
    setRefreshing(false);
  }
};
  return (
    <View style={styles.container}>
         <View style={styles.topbox}> 
      <Image source={require('../../../assets/images/home/homeback.png')} 
         style={{width:px(393),height:px(185),position: 'absolute',top:0}}></Image>
        </View>
  <View style={styles.top}>
    <View style={{flexDirection: 'row',gap:px(12)}}>
 <Text style={styles.sanjiao}>三角洲</Text>
  <Text style={styles.sanother}>其他</Text>
    </View>
<View style={{flexDirection: 'row',alignItems: 'center',gap:px(8)}}>
  <TouchableOpacity style={styles.parallelogram}
  onPress={()=>navigation.navigate('Searchlist',{type:1})}>
       <Image source={require('../../../assets/images/home/searchbox.png')} 
         style={{width:px(168),height:px(34),position: 'absolute',}}></Image>
    <Image source={require('../../../assets/images/home/search.png')} 
         style={{width:px(16),height:px(16),marginLeft: px(12),}}></Image>
         <Text style={styles.searchtext}>搜一搜</Text>
</TouchableOpacity> 
<TouchableOpacity onPress={()=>
  navigation.navigate('MainTab', {
  screen: 'Lottery',
})
}>
   <Image source={require('../../../assets/images/home/newcomer.png')} 
         style={{width:px(34),height:px(34),}}></Image>
  </TouchableOpacity>
</View>
  </View>

  <ScrollView showsVerticalScrollIndicator={false} nestedScrollEnabled={true}
  stickyHeaderIndices={[3]} onMomentumScrollEnd={handleScrollEnd} 
  overScrollMode="never"
     refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
            />
          }
          >
  <View style={{paddingHorizontal:px(16),marginTop: px(8),}}>
  {shoplist.length!==0&&
  <HotServices shoplist={shoplist} navigation={navigation}></HotServices>
  }
  </View>
   
  <BannerCarousel
  data={bannerlist}
  onPress={item => handlegobanner(item)}
  />
 {/* <View style={{width: '100%',flexDirection: 'row',
  justifyContent: 'center',marginTop: px(16),}}>
    <View style={styles.wrapper}>
      <Carousel
        width={px(361)}
        height={px(96)}
        data={bannerlist}
        loop
        autoPlay
        autoPlayInterval={3000}
        onProgressChange={(_, absoluteProgress) => {
          setIndex(Math.round(absoluteProgress))
        }}
        renderItem={({ item }) => (
          <TouchableOpacity activeOpacity={0.8}
          onPress={()=>handlegobanner(item)}>
          <FastImage
            source={{uri: item?.imageUrl}}
            style={styles.image}
            resizeMode="cover"
          />
          </TouchableOpacity>
        )}
      /> 
 
      
      <View style={styles.dots}>
        {data.map((_, i) => (
          <View
            key={i}
            style={[
              styles.dot,
              index === i && styles.activeDot
            ]}
          />
        ))}
      </View>

    </View>
 </View> */}

     <View style={{paddingHorizontal:px(16),marginTop: px(16),}}>
    <StarClub storelist={storelist} navigation={navigation}></StarClub>  

  {/* <View style={{width: '100%',flexDirection: 'row',alignItems: 'center',
    justifyContent: 'space-between',marginTop: px(18),
  }}>
<View style={{width: px(179),height: px(96),
  position: 'relative',flexDirection: 'column',
}}>
   <Image source={require('../../../assets/images/home/zhanback.png')} 
         style={{width:px(179),height:px(96),position: 'absolute',}}></Image>
<Text style={styles.toolstitle}>战备工具</Text>
<Text style={styles.toolsstitle}>每日密码一键查询！</Text>
<View style={{marginTop: px(3),marginLeft: px(8),flexDirection: 'row',alignItems: 'center',}}>
 <Image source={require('../../../assets/images/home/tool1.png')} 
         style={{width:px(78.5),height:px(47)}}></Image>
    <Image source={require('../../../assets/images/home/tool1.png')} 
         style={{width:px(78.5),height:px(47),marginLeft: px(1),}}></Image>
</View>
    <Image source={require('../../../assets/images/home/tools.png')} 
         style={{width:px(43),height:px(43),position: 'absolute',
          right:0,bottom:-px(10)
         }}></Image>
</View>
<View style={{width: px(179),height: px(96),
  position: 'relative',flexDirection: 'column',
}}>
     <Image source={require('../../../assets/images/home/quback.png')} 
         style={{width:px(179),height:px(96),position: 'absolute',}}></Image>
  <Text style={styles.toolstitle}>趣味单合集</Text>
<Text style={styles.toolsstitle}>随时猛攻保驾护航！</Text>
<View style={{marginTop: px(3),marginLeft: px(8),flexDirection: 'row',alignItems: 'center',}}>
 <Image source={require('../../../assets/images/home/tool1.png')} 
         style={{width:px(78.5),height:px(47)}}></Image>
    <Image source={require('../../../assets/images/home/tool1.png')} 
         style={{width:px(78.5),height:px(47),marginLeft: px(1),}}></Image>
</View>
  <Image source={require('../../../assets/images/home/fun.png')} 
         style={{width:px(43),height:px(43),position: 'absolute',
          right:0,bottom:-px(10)
         }}></Image>
</View>
  </View> */}

  </View>

  <View style={{marginTop: px(12),}}>
  <Tabs  index={tabIndex} routes={tablist}
     onChange={(i) => {
     setTabIndex(i)
    //pagerRef.current?.setPage(i) // 👈 关键
  }}></Tabs>
  </View>
 

 <View style={{paddingHorizontal:px(0),paddingTop: px(10),
    backgroundColor: '#fff',
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
              <UpdateModal
              updateContent={updateContent}
              updatename={updatename}
              updateways={updateways}
          visible={updateVisible}
          apkUrl={apkUrl}
          onClose={() => setUpdateVisible(false)}
        />
    </View>
  )
}

const styles = StyleSheet.create({
  pagerView: {
    backgroundColor: 'red',
    flex: 1,
  },
  toolsstitle:{
 fontFamily: 'MiSans-Regular',
        fontSize:px(11),
        color:'#767676',
        fontWeight:400,
        lineHeight:px(15),
        marginLeft: px(16),
  },
  toolstitle:{
    marginTop: px(5),
    marginLeft: px(18),
   fontFamily: 'DingTalk JinBuTi',
        fontSize:px(16),
        color:'#1A1A1A',
        //fontWeight:800,
        lineHeight:px(19),
  },
  wrapper: {
    alignItems: 'center',
  },
  image: {
    width: '100%',
    height: '100%',
    //borderRadius: 8,
  },
  dots: {
    flexDirection: 'row',
    position: 'absolute',
    bottom: px(3),
  },
  dot: {
    width: px(4),
    height:px(4),
    borderRadius: 3,
    backgroundColor: '#FFFFFF',
    marginHorizontal: px(2),
  },
  activeDot: {
    width: px(12),
    backgroundColor: 'rgba(255, 255, 255,0.7)',
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
  width: px(168),
  height: px(34),
  //backgroundColor: 'rgba(0, 0, 0, 0.1)',
  //transform: [{ skewX: '-20deg' }],
  flexDirection: 'row',
  alignItems: 'center',
  //borderRadius: px(10),
},
  sanother:{
    marginTop: px(10),
   fontFamily: 'DingTalk JinBuTi',
        fontSize:px(18),
        color:'#FFFFFF',
        //fontWeight:800,
        lineHeight:px(22),
  },
  sanjiao:{
   fontFamily: 'DingTalk JinBuTi',
        fontSize:px(28),
        color:'#FFFFFF',
        //fontWeight:800,
        lineHeight:px(34),
  },
  top:{
    paddingBottom:px(8),
    //backgroundColor: 'red',
    justifyContent: 'space-between',
    paddingTop: px(56),
    //marginTop: px(56),
    flexDirection: 'row',
    alignItems: 'center',
 paddingHorizontal:px(16),
  },
    topbox:{
    paddingHorizontal:px(16),
    position: 'relative',
    },
        submit:{
        fontFamily: 'DingTalk JinBuTi',
        fontSize:px(28),
        color:'#000',
        //fontWeight:800,
        lineHeight:px(34),
    },
    container:{
    flex: 1,
    backgroundColor: '#fff',
  }
})