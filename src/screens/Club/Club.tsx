import React, { useState, useEffect, useCallback } from 'react'
import {
  StyleSheet,
  Text,
  View,
  Image,
  RefreshControl,
  FlatList,
} from 'react-native'

import { px } from '../../utils/scaleUtils'
import ClubItem from '../../components/Club/ClubItem'
import request from '../../api/request'

export default function Club({ navigation }) {

  // 列表数据
  const [storelist, setStorelist] = useState([])

  // 下拉刷新
  const [refreshing, setRefreshing] = useState(false)

  // 分页
  const [page, setPage] = useState(1)

  // 是否还有更多
  const [hasMore, setHasMore] = useState(true)

  // 加载更多
  const [loadingMore, setLoadingMore] = useState(false)

  // 首次加载
  const [loading, setLoading] = useState(false)

  // 获取店铺列表
  const getstorelist = async (
    currentPage = 1,
    isLoadMore = false
  ) => {

    // 防止重复请求
    if (loadingMore) return

    try {

      if (isLoadMore) {
        setLoadingMore(true)
      } else {
        setLoading(true)
      }

      const response = await request({
        url: '/store/app/list',
        method: 'GET',
        query: {
          page: currentPage,
          pageSize: 10,
        }
      })

      console.log('storelist', response)

      if (response.data && response.code == 0) {

        const newList = response.data.list || []

        // 拼接数据
        setStorelist(prev => {

          if (isLoadMore) {
            return [...prev, ...newList]
          }

          return newList
        })

        // 当前页
        setPage(currentPage)

        // 是否还有更多
        setHasMore(newList.length >= 10)
      }

    } catch (error) {

      console.log(error)

    } finally {

      setLoading(false)
      setLoadingMore(false)
      setRefreshing(false)
    }
  }

  // 首次加载
  useEffect(() => {
    getstorelist()
  }, [])

  // 下拉刷新
  const onRefresh = async () => {

    if (refreshing) return

    setRefreshing(true)

    await getstorelist(1, false)
  }

  // 加载下一页
  const handleLoadMore = () => {

    // 正在加载
    if (loadingMore) return

    // 没有更多
    if (!hasMore) return

    getstorelist(page + 1, true)
  }

  // 渲染item
  const renderItem = useCallback(({ item, index }) => {

    return (
      <ClubItem
        navigation={navigation}
        status={1}
        item={item}
      />
    )

  }, [])

  // 底部组件
  const renderFooter = () => {

    // 加载中
    if (loadingMore) {
      return (
        <Text style={styles.footerText}>
          加载中...
        </Text>
      )
    }

    // 没有更多
    if (!hasMore && storelist.length > 0) {
      return (
        <Text style={styles.footerText}>
          我是有底线的～
        </Text>
      )
    }

    return null
  }

  return (
    <View style={styles.container}>

      {/* 顶部背景 */}
      <View style={styles.topbox}>
        <Image
          source={require('../../../assets/images/home/homeback.png')}
          style={{
            width: px(393),
            height: px(185),
            position: 'absolute',
            top: 0,
          }}
        />
      </View>

      {/* 顶部 */}
      <View style={styles.top}>

        <View style={{
          flexDirection: 'row',
          gap: px(12),
        }}>
          <Text style={styles.sanjiao}>三角洲</Text>
          <Text style={styles.sanother}>其他</Text>
        </View>

        <View style={{
          flexDirection: 'row',
          alignItems: 'center',
          gap: px(8),
        }}>

          <View style={styles.parallelogram}>

            <Image
              source={require('../../../assets/images/home/searchbox.png')}
              style={{
                width: px(168),
                height: px(34),
                position: 'absolute',
              }}
            />

            <Image
              source={require('../../../assets/images/home/search.png')}
              style={{
                width: px(16),
                height: px(16),
                marginLeft: px(12),
              }}
            />

            <Text style={styles.searchtext}>
              搜俱乐部
            </Text>

          </View>

          <Image
            source={require('../../../assets/images/home/newcomer.png')}
            style={{
              width: px(34),
              height: px(34),
            }}
          />

        </View>

      </View>

      {/* 列表 */}
      <FlatList
        data={storelist}
        keyExtractor={(item, index) =>
          item.id?.toString() || index.toString()
        }

        renderItem={renderItem}

        showsVerticalScrollIndicator={false}

        style={{
          backgroundColor: '#fff',
        }}

        contentContainerStyle={{
          paddingHorizontal: px(16),
          paddingTop: px(10),
          paddingBottom: px(25),
          gap: px(20),
        }}

        // 下拉刷新
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
          />
        }

        // 上拉加载
        onEndReached={handleLoadMore}

        // 提前加载
        onEndReachedThreshold={0.3}

        // 底部
        ListFooterComponent={renderFooter}

        // 空列表
        ListEmptyComponent={
          !loading && (
            <Text style={styles.empty}>
              暂无数据
            </Text>
          )
        }
      />

    </View>
  )
}

const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: '#fff',
  },

  topbox: {
    paddingHorizontal: px(16),
    position: 'relative',
  },

  top: {
    paddingBottom: px(8),
    justifyContent: 'space-between',
    paddingTop: px(56),
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: px(16),
  },

  sanjiao: {
    fontFamily: 'DingTalk JinBuTi',
    fontSize: px(28),
    color: '#FFFFFF',
    lineHeight: px(34),
  },

  sanother: {
    marginTop: px(10),
    fontFamily: 'DingTalk JinBuTi',
    fontSize: px(18),
    color: '#FFFFFF',
    lineHeight: px(22),
  },

  parallelogram: {
    position: 'relative',
    width: px(168),
    height: px(34),
    flexDirection: 'row',
    alignItems: 'center',
  },

  searchtext: {
    fontFamily: 'MiSans-Regular',
    fontSize: px(12),
    color: 'rgba(255,255,255,0.7)',
    fontWeight: '400',
    lineHeight: px(16),
    marginLeft: px(4),
  },

  footerText: {
    textAlign:'center',
     fontFamily: 'MiSans-Regular',
        fontSize:px(13),
        color:'#AAAAAA',
        fontWeight:400,
        lineHeight:px(17),
  },

  empty: {
    textAlign:'center',
     fontFamily: 'MiSans-Regular',
        fontSize:px(13),
        color:'#AAAAAA',
        fontWeight:400,
        lineHeight:px(17),
  },
}) 