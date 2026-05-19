import React, { useState ,useRef,useCallback,useEffect} from 'react';
import { StyleSheet, View, Text, useWindowDimensions,
    TouchableOpacity,Animated,FlatList,ScrollView,Image
 } from 'react-native';
import { TabView, TabBar } from 'react-native-tab-view';
import { px } from '../../utils/scaleUtils';
import OrderItem from '../../components/My/OrderItem'
import request from '../../api/request';
import Storage from '../../utils/storage';

const ORDER_STATUS_MAP = {
  all: '',
  pending: 'CREATED',
  toBeServed: 'WAIT_SERVICE',
  inService: 'IN_SERVICE',
  toBeReceived: 'WAIT_CONFIRM',
  toBeReviewed: 'WAIT_COMMENT',
  completed: 'FINISHED',
};
// Tab 内容示例
const TabContent = ({
  data,
  navigation,
  loadMore,
  hasMore,
  loading,
  refreshCurrentTab,
}) => {
  const onEndReachedCalledDuringMomentum = useRef(false);
  //const data = Array.from({ length: 30 }).map((_, i) => `${title} - 订单 ${i + 1}`);
  return (
    <FlatList
      overScrollMode="never"
      data={data}
      keyExtractor={(item, index) => index.toString()}
      contentContainerStyle={{ paddingHorizontal:px(16),paddingTop:px(4),paddingBottom:px(50) }}
      showsVerticalScrollIndicator={false}
      ItemSeparatorComponent={() => <View style={{ height: px(12) }} />}
        initialNumToRender={6}          // 初始渲染6条
        maxToRenderPerBatch={6}         // 每次最多渲染6条
        windowSize={5}                  // 可视区域前后缓存（默认21，改小更省性能）
        removeClippedSubviews={true}    // 移除屏幕外组件（提升性能）
        updateCellsBatchingPeriod={50}  // 渲染批次间隔（毫秒）
        getItemLayout={(data, index) => ({
            length: px(206), // 每个item高度（你需要改成真实高度）
            offset: px(206) * index,
            index,
        })}
  onMomentumScrollBegin={() => {
    onEndReachedCalledDuringMomentum.current = false;
  }}

  onEndReached={() => {

    if (onEndReachedCalledDuringMomentum.current) {
      return;
    }

    onEndReachedCalledDuringMomentum.current = true;

    if (!loading && hasMore && data.length > 0) {
      loadMore();
    }

  }}
ListFooterComponent={() => {

  if (loading) {

    return (
      <View style={{
        alignItems:'center',
        paddingVertical:px(16)
      }}>
        <Text>加载中...</Text>
      </View>
    )
  }

  if (!hasMore && data.length > 0) {

    return (
      <View style={{
        alignItems:'center',
        paddingVertical:px(16)
      }}>
        <Text>我是有底线的～</Text>
      </View>
    )
  }

  if (data.length === 0) {

    return (
      <View style={{
        alignItems:'center',
        paddingVertical:px(30)
      }}>
        <Text>暂无订单</Text>
      </View>
    )
  }

  return null;

}}
onEndReachedThreshold={0.2}
      renderItem={({ item }) => (
        <OrderItem item={item} 
        navigation={navigation}    
        refreshCurrentTab={refreshCurrentTab}></OrderItem>
      )}
    />
  );
};
export default function Order({navigation,route}) {
   const { e } = route.params || {};
  console.log(e);
const TAB_INDEX_MAP = {
  1: 0, // 全部
  2: 1, // 待付款
  3: 2, // 待服务
  4: 4, // 待收货
  5: 5, // 待评论
  6: 6, // 已完成
};

const getTabIndexByE = (e) => {
  return TAB_INDEX_MAP[e] ?? 0;
};
  const layout = useWindowDimensions();
  const [index, setIndex] = useState(() => getTabIndexByE(e)); 
  const [orderData, setOrderData] = useState({
  all: {
    list: [],
    page: 1,
    hasMore: true,
    loading: false,
  },

  pending: {
    list: [],
    page: 1,
    hasMore: true,
    loading: false,
  },

  toBeServed: {
    list: [],
    page: 1,
    hasMore: true,
    loading: false,
  },

  inService: {
    list: [],
    page: 1,
    hasMore: true,
    loading: false,
  },

  toBeReceived: {
    list: [],
    page: 1,
    hasMore: true,
    loading: false,
  },

  toBeReviewed: {
    list: [],
    page: 1,
    hasMore: true,
    loading: false,
  },

  completed: {
    list: [],
    page: 1,
    hasMore: true,
    loading: false,
  },
});
useEffect(() => {
  setIndex(getTabIndexByE(e));
}, [e]);
  const handleback = () => {  //返回上一页
   navigation.goBack();
     };
  const [routes] = useState([
    { key: 'all', title: '全部'},
    { key: 'pending', title: '待付款'},
    { key: 'toBeServed', title: '待服务'},
    { key: 'inService', title: '服务中'},
    { key: 'toBeReceived', title: '待收货'},
    { key: 'toBeReviewed', title: '待评论'},
    { key: 'completed', title: '已完成'},
  ]);

const renderScene = ({ route }) => {

  const currentData = orderData[route.key];

  return (

    <TabContent
      data={currentData.list}
      navigation={navigation}
      hasMore={currentData.hasMore}
      loading={currentData.loading}

      loadMore={() => {
        getorderlist(
          route.key,
          currentData.page + 1
        );
      }}
      refreshCurrentTab={() => {
        getorderlist(route.key, 1, true);
      }}

    />

  );
};
 
  // 自定义 TabBar
  // 自定义 TabBar 组件
  const renderTabBar = useCallback(
    ({ navigationState, jumpTo }) => {
      const scrollRef = useRef(null);
      const scrollViewWidthRef = useRef(0);
      const TAB_WIDTH = px(58); // 每个标签的固定宽度
      // 自动滚动到当前选中标签
      useEffect(() => {
        const currentIndex = navigationState.index;
        if (scrollRef.current && scrollViewWidthRef.current > 0) {
          // 计算滚动偏移量，使当前标签居中
          const offset =
            currentIndex * TAB_WIDTH -
            (scrollViewWidthRef.current / 2) +
            TAB_WIDTH / 2;
          scrollRef.current.scrollTo({
            x: Math.max(0, offset),
            animated: true,
          });
        }
      }, [navigationState.index]);

      const handlePress = (routeKey, index) => {
        jumpTo(routeKey);
        // 点击后立即滚动（useEffect 也会触发，但这里手动触发保证响应更快）
        if (scrollRef.current && scrollViewWidthRef.current > 0) {
          const offset =
            index * TAB_WIDTH -
            (scrollViewWidthRef.current / 2) +
            TAB_WIDTH / 2;
          scrollRef.current.scrollTo({
            x: Math.max(0, offset),
            animated: true,
          });
        }
      };

      return (
        <View style={{ }}>
          <ScrollView
            ref={scrollRef}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ alignItems: 'center' }}
            onLayout={(e) => {
              scrollViewWidthRef.current = e.nativeEvent.layout.width;
            }}
          >
            {navigationState.routes.map((route, idx) => {
              const isActive = navigationState.index === idx;
              return (
                <TouchableOpacity
                  key={route.key}
                  style={{
                    height: px(53),
                    width: TAB_WIDTH,
                    alignItems: 'center',
                    justifyContent: 'center',
                    
                  }}
                  onPress={() => handlePress(route.key, idx)}
                  activeOpacity={0.7}
                >
                
                 
                  <Text
                    style={{
                      fontFamily: isActive ?'MiSans-Medium':'MiSans-Regular',
                      color: isActive ? '#FF9500' : '#1A1A1A',
                      fontSize: px(14),
                      fontWeight:isActive ? 400:400,
                    }}
                  >
                    {route.title}
                  </Text>
                  {isActive && (
                    <View
                      style={{
                        position: 'absolute',
                        bottom:px(10),
                        //marginTop: 4,
                        height: px(4),
                        width: px(22),
                        backgroundColor: '#FF9500',
                        borderRadius: px(20),
                      }}
                    />
                  )}
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>
      );
    },
    []
  );
  useEffect(() => {
   const currentKey = routes[index].key;

  getorderlist(currentKey, 1, true);
  }, [])
const getorderlist = async (
  routeKey,
  currentPage = 1,
  refresh = false
) => {

  const currentTab = orderData[routeKey];

  // 防止重复请求
  if (currentTab.loading) {
    return;
  }

  // 没更多
  if (!currentTab.hasMore && !refresh) {
    return;
  }

  // 设置loading
  setOrderData(prev => ({
    ...prev,
    [routeKey]: {
      ...prev[routeKey],
      loading: true,
    }
  }));

  const user = await Storage.get("userinfo");

  if (user == null) {
    return;
  }

  try {

    const response = await request({
      url: '/order/list',
      method: 'GET',
      query: {
        userId: user.user.userId,
        page: currentPage,
        pageSize: 10,

        // 全部不传
        ...(ORDER_STATUS_MAP[routeKey]
          ? { orderStatus: ORDER_STATUS_MAP[routeKey] }
          : {})
      },
    });

    console.log(response);

    if (response.data && response.code == 0) {

      const newList = response.data.list || [];

      setOrderData(prev => ({

        ...prev,

        [routeKey]: {

          ...prev[routeKey],

          list: refresh
            ? newList
            : [...prev[routeKey].list, ...newList],

          page: currentPage,

          hasMore:
            currentPage * 10 < response.data.total,

          loading: false,
        }

      }));

    }

  } catch (error) {

    console.error(error);

    setOrderData(prev => ({
      ...prev,
      [routeKey]: {
        ...prev[routeKey],
        loading: false,
      }
    }));

  }

};
useEffect(() => {

  const currentKey = routes[index].key;

  // 没数据才请求
  if (orderData[currentKey].list.length === 0) {

    getorderlist(currentKey, 1, true);

  }

}, [index]);
  return (
    <View style={{ flex: 1 }}>
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
                   <Text style={styles.title}>我的订单</Text>
                      </View>
                    </View>
      <TabView
        navigationState={{ index, routes }}
        renderScene={renderScene}
        onIndexChange={setIndex}
        initialLayout={{ width: layout.width }}
        renderTabBar={renderTabBar}
      />
    </View>
  );
}

const styles = StyleSheet.create({
    desnum:{
   fontFamily: 'MiSans-Regular',
    fontSize: px(12),
    color: '#fff',
    fontWeight: 400,
    lineHeight: px(16),
    },
   title:{
  fontFamily: 'MiSans-Medium',
        fontSize:px(16),
        color:'#1A1A1A',
        //fontWeight:500,
        lineHeight:px(21),
  },
  scene: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
});