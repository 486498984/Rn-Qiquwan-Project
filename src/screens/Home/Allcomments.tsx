import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  FlatList,
} from 'react-native'
import React, { useEffect, useState } from 'react'
import { px } from '../../utils/scaleUtils'
import StarRating from '../../components/Club/StarRating'
import { IMG_URL } from '../../api/config'
import request from '../../api/request'
import Comment from './components/Comment'
import LinearGradient from 'react-native-linear-gradient'
import { useSafeAreaInsets } from 'react-native-safe-area-context';



export default function Allcomments({ navigation, route }) {
const insets = useSafeAreaInsets();
const bottomSafeHeight = insets.bottom; // 底部安全区高度（数值）
  const { id } = route.params

  const [commentsall, setCommentsall] = useState(null)
  const [comments, setComments] = useState([])

  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(false)
  const [hasMore, setHasMore] = useState(true)

  const pageSize = 10

  const handleback = () => {
    navigation.goBack()
  }

  useEffect(() => {
    if (id) {
      setPage(1)
      setHasMore(true)
      getcomments(1, false)
    }
  }, [id])

  const getcomments = async (pageNum = 1, isLoadMore = false) => {
    if (loading) return

    setLoading(true)

    try {
      const response = await request({
        url: '/goods/comments',
        method: 'GET',
        data: {},
        query: {
          goodsId: id,
          page: pageNum,
          size: pageSize,
        },
      })

      if (response.data && response.code === 0) {
        const infodata = response.data
        const list = infodata.list || []

        setCommentsall(infodata)

        if (isLoadMore) {
          setComments(prev => [...prev, ...list])
        } else {
          setComments(list)
        }

        setHasMore(list.length === pageSize)
      }
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  const loadMore = () => {
    if (!hasMore || loading) return

    const nextPage = page + 1
    setPage(nextPage)
    getcomments(nextPage, true)
  }

  const renderFooter = () => {
    return (
      <View style={{ paddingVertical: px(16), alignItems: 'center' }}>
        <Text style={styles.smadestitle}>
          {loading ? '加载中...' : hasMore ? '上拉加载更多' : '没有更多了'}
        </Text>
      </View>
    )
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
        }}
      >
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
            style={{ position: 'absolute', left: px(16) }}
          >
            <Image
              source={require('../../../assets/images/my/left.png')}
              style={{ width: px(22), height: px(22) }}
            />
          </TouchableOpacity>

          <Text style={styles.title}>评价</Text>
        </View>
      </View>

      {/* 评分卡片 */}
      <View style={{ width: '100%', paddingHorizontal: px(16),paddingBottom:px(10) }}>
        <View style={{ height: px(64) }}>
          <LinearGradient
            colors={['rgba(216,216,216,0)', 'rgba(216,216,216,0.20)']}
            start={{ x: 1, y: 0 }}
            end={{ x: 0, y: 0 }}
            style={styles.comgraguanBox}
          >
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Image
                source={require('../../../assets/images/home/star.png')}
                style={{ width: px(27), height: px(27), marginLeft: px(12) }}
              />

              <Text style={[styles.renum, { marginLeft: px(3) }]}>
                {Number(
                  commentsall?.statistics?.avgRating || 0
                ).toFixed(1)}
              </Text>

              <View
                style={{
                  width: px(1),
                  height: px(27),
                  backgroundColor: 'rgba(118,118,118,0.2)',
                  marginLeft: px(12),
                }}
              />

              <View
                style={{
                  flexDirection: 'column',
                  marginLeft: px(12),
                  gap: px(6),
                }}
              >
                <Text style={styles.comall}>
                  共{commentsall?.total || 0}条评论
                </Text>
              </View>
            </View>
          </LinearGradient>
        </View>
      </View>

      {/* 评论列表 */}
      <FlatList
        data={comments}
        keyExtractor={(item, index) => index.toString()}
        contentContainerStyle={{
          paddingBottom: px(20)+bottomSafeHeight,
          paddingHorizontal: px(16),
        }}
        renderItem={({ item, index }) => (
          <View>
            <Comment item={item} />
            {index !== comments.length - 1 && (
              <View
                style={{
                  width: '100%',
                  height: px(1),
                  backgroundColor: '#F8F8F8',
                  marginTop: px(10),
                }}
              />
            )}
          </View>
        )}
        onEndReached={loadMore}
        onEndReachedThreshold={0.3}
        ListFooterComponent={renderFooter}
        showsVerticalScrollIndicator={false}
      />
    </View>
  )
}

const styles = StyleSheet.create({
    smadestitle:{
    fontFamily: 'MiSans-Regular',
    fontSize:px(13),
    color:'#AAAAAA',
    fontWeight:400,
    lineHeight:px(17),
    },
  comall: {
    fontFamily: 'MiSans-Regular',
    fontSize: px(14),
    color: '#1A1A1A',
    lineHeight: px(19),
  },
  renum: {
    fontFamily: 'MiSans-Bold',
    fontSize: px(20),
    color: '#1A1A1A',
    lineHeight: px(28),
  },
  comgraguanBox: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    height: px(64),
    borderRadius: px(12),
  },
  title: {
    fontFamily: 'MiSans-Medium',
    fontSize: px(16),
    color: '#1A1A1A',
    lineHeight: px(21),
  },
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
}) 