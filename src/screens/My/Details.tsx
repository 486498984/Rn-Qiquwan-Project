import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  FlatList,
  RefreshControl,
  ActivityIndicator,
} from 'react-native'

import React, {
  useEffect,
  useState,
  useRef,
} from 'react'

import { px } from '../../utils/scaleUtils'
import request from '../../api/request'
import Storage from '../../utils/storage'

const WithdrawItem = ({ item }) => {
  return (
    <View
      style={{
        width: '100%',
        backgroundColor: '#fff',
        height: px(79),
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: px(16),
      }}>

      {/* 左边 */}
      <View
        style={{
          flexDirection: 'column',
          alignItems: 'flex-start',
          gap: px(12),
        }}>

        {item?.direction !== 'IN' ? (
          <Text style={styles.tixiantitle}>提现</Text>
        ) : (
          <Text style={styles.tixiantitle}>分佣</Text>
        )}

        <Text style={styles.time}>
          编号：{item?.transId}
        </Text>
      </View>

      {/* 右边 */}
      <View
        style={{
          flexDirection: 'column',
          alignItems: 'flex-end',
          gap: px(12),
        }}>

        {item?.direction !== 'IN' ? (
          <Text style={styles.price1}>
            -{((item?.amount || 0) / 100).toFixed(2)}
          </Text>
        ) : (
          <Text style={styles.price2}>
            +{((item?.amount || 0) / 100).toFixed(2)}
          </Text>
        )}

        <Text style={styles.time}>
          {item?.createdAt}
        </Text>
      </View>
    </View>
  )
}

export default function Details({ navigation }) {

  // 列表
  const [order, setOrder] = useState([])

  // 页码
  const [page, setPage] = useState(1)

  // 下拉刷新
  const [refreshing, setRefreshing] = useState(false)

  // 上拉加载
  const [loadingMore, setLoadingMore] = useState(false)

  // 是否还有更多
  const [hasMore, setHasMore] = useState(true)

  // 防止重复触发
  const onEndReachedCalledDuringMomentum = useRef(false)

  useEffect(() => {
    getmoneyinfo(true)
  }, [])

  /**
   * 获取列表
   */
  const getmoneyinfo = async (isRefresh = false) => {

    const user = await Storage.get('userinfo')

    const currentPage = isRefresh ? 1 : page

    // 刷新
    if (isRefresh) {
      setRefreshing(true)
    } else {
      setLoadingMore(true)
    }

    try {

      const response = await request({
        url: '/user/asset/withdrawable-list',
        method: 'GET',
        data: {},
        query: {
          userId: user.user.userId,
          page: currentPage,
          pageSize: 10,
        },
      })

      console.log(response)

      if (
        response?.code == 0 &&
        response?.data !== undefined
      ) {

        const list = response?.data?.list || []

        // 下拉刷新
        if (isRefresh) {

          setOrder(list)

        } else {

          // 加载更多 + 去重
          setOrder(prev => {

            const newList = [...prev, ...list]

            // transId 去重
            const uniqueList = newList.filter(
              (item, index, self) =>
                index === self.findIndex(
                  v => v.transId === item.transId
                )
            )

            return uniqueList
          })
        }

        // 是否还有更多
        setHasMore(list.length === 10)

        // 下一页
        setPage(currentPage + 1)
      }

    } catch (error) {

      console.error(error)

    } finally {

      setRefreshing(false)

      setLoadingMore(false)
    }
  }

  /**
   * 下拉刷新
   */
  const onRefresh = () => {

    setPage(1)

    setHasMore(true)

    getmoneyinfo(true)
  }

  /**
   * 上拉加载更多
   */
  const onEndReached = () => {

    // 防止重复触发
    if (onEndReachedCalledDuringMomentum.current) {
      return
    }

    // 正在加载
    if (loadingMore) {
      return
    }

    // 没有更多
    if (!hasMore) {
      return
    }

    onEndReachedCalledDuringMomentum.current = true

    getmoneyinfo(false)
  }

  /**
   * 返回
   */
  const handleback = () => {
    navigation.goBack()
  }

  /**
   * 底部组件
   */
  const renderFooter = () => {

    // 空数据
    if (
      order.length === 0 &&
      !refreshing
    ) {
      return (
        <View
          style={{
            alignItems: 'center',
            marginTop: px(16),
          }}>
          <Text style={styles.bottomtext}>
            暂无内容
          </Text>
        </View>
      )
    }

    // 加载中
    if (loadingMore) {
      return (
        <View
          style={{
            alignItems: 'center',
            paddingVertical: px(20),
          }}>

          <ActivityIndicator
            size="small"
            color="#999"
          />

          <Text
            style={[
              styles.bottomtext,
              { marginTop: px(6) },
            ]}>
            加载中...
          </Text>
        </View>
      )
    }

    // 没有更多
    if (
      !hasMore &&
      order.length > 0
    ) {
      return (
        <View
          style={{
            alignItems: 'center',
            marginVertical: px(16),
          }}>
          <Text style={styles.bottomtext}>
            我是有底线的～
          </Text>
        </View>
      )
    }

    return null
  }

  return (
    <View style={styles.container}>

      {/* 顶部 */}
      <View
        style={{
          width: px(393),
          height: px(98),
          backgroundColor: '#fff',
          flexDirection: 'row',
          alignItems: 'flex-end',
        }}>

        <View
          style={{
            width: '100%',
            paddingHorizontal: px(16),
            marginBottom: px(18),
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
          }}>

          <TouchableOpacity
            onPress={handleback}
            style={{
              position: 'absolute',
              left: px(16),
            }}>

            <Image
              source={require('../../../assets/images/my/left.png')}
              style={{
                width: px(22),
                height: px(22),
              }}
            />
          </TouchableOpacity>

          <Text style={styles.title}>
            资产明细
          </Text>
        </View>
      </View>

      {/* 列表 */}
      <FlatList
        data={order}

        keyExtractor={(item, index) =>
          index.toString()
        }

        showsVerticalScrollIndicator={false}

        contentContainerStyle={{
          paddingTop: px(16),
          paddingBottom: px(30),
          backgroundColor: '#F2F3F5',
        }}

        renderItem={({ item, index }) => (
          <View
            style={{
              alignItems: 'center',
              backgroundColor: '#fff',
            }}>

            <WithdrawItem item={item} />

            {index !== order.length - 1 && (
              <View
                style={{
                  width: px(361),
                  height: px(1),
                  backgroundColor:
                    'rgba(118, 118, 118, 0.2)',
                }}
              />
            )}
          </View>
        )}

        // 下拉刷新
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor="#999"
          />
        }

        // 上拉加载
        onEndReached={onEndReached}

        onEndReachedThreshold={0.2}

        // 防止重复触发
        onMomentumScrollBegin={() => {
          onEndReachedCalledDuringMomentum.current = false
        }}

        // 底部
        ListFooterComponent={renderFooter}
      />
    </View>
  )
}

const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: '#F2F3F5',
  },

  title: {
    fontFamily: 'MiSans-Medium',
    fontSize: px(16),
    color: '#1A1A1A',
    lineHeight: px(21),
  },

  tixiantitle: {
    fontFamily: 'MiSans-Regular',
    fontSize: px(17),
    color: '#1A1A1A',
    fontWeight: '400',
    lineHeight: px(23),
  },

  time: {
    fontFamily: 'MiSans-Regular',
    fontSize: px(12),
    color: '#AAAAAA',
    fontWeight: '400',
    lineHeight: px(16),
  },

  price1: {
    fontFamily: 'MiSans-Medium',
    fontSize: px(20),
    color: '#FF9500',
    lineHeight: px(27),
  },

  price2: {
    fontFamily: 'MiSans-Medium',
    fontSize: px(20),
    color: '#DE5452',
    lineHeight: px(27),
  },

  bottomtext: {
    textAlign:'center',
     fontFamily: 'MiSans-Regular',
        fontSize:px(13),
        color:'#AAAAAA',
        fontWeight:400,
        lineHeight:px(17),
  },
}) 