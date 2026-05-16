import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  TextInput,
  TouchableWithoutFeedback,
  Keyboard,
  FlatList,
  ScrollView,
  useWindowDimensions,
  RefreshControl,
} from 'react-native';
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { px } from '../../utils/scaleUtils';
import { TabView } from 'react-native-tab-view';
import GoodsItem from '../../components/Shop/GoodsItem';
import request from '../../api/request';
import useAuthStore from '../../utils/zustand';



const TAB_STATUS_MAP = {
  all: 'DRAFT',
  pending: 'PUBLISHED',
  inService: 'OFFLINE',
};

const TabContent = ({
  data,
  navigation,
  onLoadMore,
  loading,
  hasMore,
  currentTab,
  onUpdate,
  onDelete,
  fetchGoodsList,
}) => {

  return (
    <FlatList
      data={data}
      keyExtractor={(item, index) =>
        `${item?.id || 'noid'}-${index}`
      }
      contentContainerStyle={{
        paddingHorizontal: px(16),
        paddingTop: px(4),
        paddingBottom: px(50),
      }}
      showsVerticalScrollIndicator={false}
      ItemSeparatorComponent={() => <View style={{ height: px(12) }} />}
      initialNumToRender={6}
      maxToRenderPerBatch={6}
      windowSize={5}
      removeClippedSubviews={true}
      updateCellsBatchingPeriod={50}
      onEndReached={() => {
        if (hasMore && !loading) {
          onLoadMore();
        }
      }}
      onEndReachedThreshold={0.3}
     ListFooterComponent={() => {
  if (data.length === 0) return null;

  return (
    <View style={{ paddingVertical: px(20), alignItems: 'center' }}>
      <Text style={{ color: '#999', fontSize: px(12) }}>
        {loading ? '加载中...' : hasMore ? '' : '没有更多了'}
      </Text>
    </View>
  );
}}
 ListEmptyComponent={() => {
  if (loading) return null;

  return (
    <View style={{ paddingTop: px(80), alignItems: 'center' }}>
      <Text style={{ color: '#999', fontSize: px(13) }}>
        暂无数据
      </Text>
    </View>
  );
}}
      renderItem={({ item }) => (
        <GoodsItem 
        item={item} 
        navigation={navigation} 
        currentTab={currentTab}
        onUpdate={onUpdate}
        onDelete={onDelete}
        />
      )}
    />
  );
};

export default function ShopManage({ navigation, route }) {
  const shopManageRefreshKey = useAuthStore(
  (state) => state.shopManageRefreshKey
);
  const { storeinfo } = route.params || {};
  const layout = useWindowDimensions();

  const [index, setIndex] = useState(0);
  const [keyword, setKeyword] = useState('');

  const [routes] = useState([
    { key: 'all', title: '草稿箱' },
    { key: 'pending', title: '已上架' },
    { key: 'inService', title: '已下架' },
  ]);

  const [tabData, setTabData] = useState({
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
    inService: {
      list: [],
      page: 1,
      hasMore: true,
      loading: false,
    },
  });

  const fetchGoodsList = async (tabKey, isRefresh = false) => {
    const currentTab = tabData[tabKey];

    if (currentTab.loading) return;
    if (!isRefresh && !currentTab.hasMore) return;

    const page = isRefresh ? 1 : currentTab.page;

    setTabData((prev) => ({
      ...prev,
      [tabKey]: {
        ...prev[tabKey],
        loading: true,
      },
    }));

    try {
      const response = await request({
        url: '/store/goods/list',
        method: 'GET',
        query: {
          storeId: storeinfo?.id,
          status: TAB_STATUS_MAP[tabKey],
          auditStatus: '',
          keyword: keyword || '',
          page,
          pageSize: 10,
        },
      });
       console.log(response);
       
 if (response.code === 0) {
  const newList = response?.data?.list || [];

  setTabData((prev) => {
    const mergedList = isRefresh
      ? newList
      : [...prev[tabKey].list, ...newList];

    const uniqueList = Array.from(
      new Map(mergedList.map(item => [item.id, item])).values()
    );

    return {
      ...prev,
      [tabKey]: {
        list: uniqueList,
        page: page + 1,
        hasMore: newList.length === 10,
        loading: false,
      },
    };
  });
} else {
        setTabData((prev) => ({
          ...prev,
          [tabKey]: {
            ...prev[tabKey],
            loading: false,
          },
        }));
      }
    } catch (error) {
      console.error('获取商品失败', error);

      setTabData((prev) => ({
        ...prev,
        [tabKey]: {
          ...prev[tabKey],
          loading: false,
        },
      }));
    }
  };

  useEffect(() => {
    const currentKey = routes[index].key;

    if (tabData[currentKey].list.length === 0) {
      fetchGoodsList(currentKey, true);
    }
  }, [index]);

  useEffect(() => {
    const timer = setTimeout(() => {
      const currentKey = routes[index].key;
      fetchGoodsList(currentKey, true);
    }, 500);

    return () => clearTimeout(timer);
  }, [keyword]);

  useEffect(() => {
  const currentKey = routes[index].key;

  setTabData((prev) => ({
    ...prev,
    [currentKey]: {
      list: [],
      page: 1,
      hasMore: true,
      loading: false,
    },
  }));

  fetchGoodsList(currentKey, true);
}, [shopManageRefreshKey]);
  const renderScene = ({ route }) => {
    const currentData = tabData[route.key];

    return (
      <TabContent
        data={currentData.list}
        navigation={navigation}
        loading={currentData.loading}
        hasMore={currentData.hasMore}
        onLoadMore={() => fetchGoodsList(route.key)}
        currentTab={route.key}
        onUpdate={updateGoods}
        onDelete={deleteGoods}
        fetchGoodsList={fetchGoodsList}
      />
    );
  };

  const renderTabBar = useCallback(
    ({ navigationState, jumpTo }) => {
      const scrollRef = useRef(null);
      const scrollViewWidthRef = useRef(0);
      const TAB_WIDTH = px(88);

      useEffect(() => {
        const currentIndex = navigationState.index;

        if (scrollRef.current && scrollViewWidthRef.current > 0) {
          const offset =
            currentIndex * TAB_WIDTH -
            scrollViewWidthRef.current / 2 +
            TAB_WIDTH / 2;

          scrollRef.current.scrollTo({
            x: Math.max(0, offset),
            animated: true,
          });
        }
      }, [navigationState.index]);

      return (
        <View>
          <ScrollView
            ref={scrollRef}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ alignItems: 'center' }}
            onLayout={(e) => {
              scrollViewWidthRef.current =
                e.nativeEvent.layout.width;
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
                  onPress={() => jumpTo(route.key)}
                >
                  <Text
                    style={{
                      fontFamily: isActive
                        ? 'MiSans-Medium'
                        : 'MiSans-Regular',
                      color: isActive ? '#FF9500' : '#1A1A1A',
                      fontSize: px(14),
                    }}
                  >
                    {route.title}
                  </Text>

                  {isActive && (
                    <View
                      style={{
                        position: 'absolute',
                        bottom: px(10),
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
const updateGoods = (goodsId, fromTab, toTab = null, patch = {}) => {
  console.log(123333);
  
  setTabData((prev) => {
    const fromList = prev[fromTab].list;

    const targetIndex = fromList.findIndex(i => i.id === goodsId);
    if (targetIndex === -1) return prev;

    const item = fromList[targetIndex];

    const updatedItem = {
      ...item,
      ...patch,
    };

    let newState = {
      ...prev,
      [fromTab]: {
        ...prev[fromTab],
        list: fromList.filter(i => i.id !== goodsId),
      },
    };

    // 👉 如果要跨 tab 移动
    if (toTab) {
      newState[toTab] = {
        ...prev[toTab],
        list: [updatedItem, ...prev[toTab].list],
      };
    } else {
      // 👉 只更新当前 tab
      newState[fromTab] = {
        ...newState[fromTab],
        list: fromList.map(i =>
          i.id === goodsId ? updatedItem : i
        ),
      };
    }

    return newState;
  });
};
const deleteGoods = (goodsId, tabKey) => {
  setTabData((prev) => ({
    ...prev,
    [tabKey]: {
      ...prev[tabKey],
      list: prev[tabKey].list.filter(i => i.id !== goodsId),
    },
  }));
};
const handleTabChange = (i) => {
  const key = routes[i].key;

  setIndex(i);
  setKeyword('');

  setTabData((prev) => ({
    ...prev,
    [key]: {
      list: [],
      page: 1,
      hasMore: true,
      loading: false,
    },
  }));

  setTimeout(() => {
    fetchGoodsList(key, true);
  }, 0);
};
  return (
    <TouchableWithoutFeedback
      onPress={Keyboard.dismiss}
      accessible={false}
    >
      <View style={styles.container}>
        <View
          style={{
            width: px(393),
            height: px(135),
            backgroundColor: '#fff',
            flexDirection: 'column',
            justifyContent: 'flex-end',
          }}
        >
          <View
            style={{
              width: '100%',
              paddingHorizontal: px(16),
              marginBottom: px(15),
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <TouchableOpacity
              onPress={() => navigation.goBack()}
              style={{
                position: 'absolute',
                left: px(16),
              }}
            >
              <Image
                source={require('../../../assets/images/my/left.png')}
                style={{ width: px(22), height: px(22) }}
              />
            </TouchableOpacity>

            <Text style={styles.title}>商品管理</Text>
          </View>

          <View
            style={{
              width: '100%',
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: px(8),
            }}
          >
            <View
              style={{
                width: px(317),
                height: px(32),
                backgroundColor: '#F2F3F5',
                borderRadius: px(20),
                flexDirection: 'row',
                alignItems: 'center',
              }}
            >
              <Image
                source={require('../../../assets/images/my/search1.png')}
                style={{
                  width: px(16),
                  height: px(16),
                  marginLeft: px(8),
                }}
              />

              <TextInput
                allowFontScaling={false}
                style={styles.inputbox}
                onChangeText={setKeyword}
                value={keyword}
                placeholder="搜索"
                placeholderTextColor="#AAAAAA"
                maxLength={20}
                selectionColor="#FC9026"
              />
            </View>
          </View>
        </View>

        <TabView
          navigationState={{ index, routes }}
          renderScene={renderScene}
          onIndexChange={setIndex}
          initialLayout={{ width: layout.width }}
          renderTabBar={renderTabBar}
          lazy
        />
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  inputbox: {
    paddingTop: 0,
    paddingBottom: 0,
    marginLeft: px(7),
    width: px(225),
    height: px(32),
    fontSize: px(12),
    fontFamily: 'MiSans-Regular',
  },

  title: {
    fontFamily: 'MiSans-Medium',
    fontSize: px(16),
    color: '#1A1A1A',
    lineHeight: px(21),
  },

  container: {
    flex: 1,
    backgroundColor: '#F7F8FC',
  },
}); 