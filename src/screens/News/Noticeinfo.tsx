import { StyleSheet, Text, View, TouchableOpacity, Image, ScrollView } from 'react-native'
import React, { useEffect } from 'react'
import { px } from '../../utils/scaleUtils'
import SafeFastImage from '../../components/Home/SafeFastImage'
import { IMG_URL } from '../../api/config';
export default function Noticeinfo({ navigation, route }) {
  const { item } = route.params || {}
const [imgRatioMap, setImgRatioMap] = React.useState({})
  useEffect(() => {
    console.log('公告详情:', item)
  }, [item])

  const handleback = () => navigation.goBack()

  // ✅ 统一处理图片（兼容 string / array / 空）
  const images = (() => {
    if (!item?.coverImage) return []

    if (Array.isArray(item.coverImage)) {
      return item.coverImage.filter(i => i && i !== '')
    }

    // 如果后端是 "a.jpg,b.jpg" 这种
    if (typeof item.coverImage === 'string' && item.coverImage.includes(',')) {
      return item.coverImage.split(',').filter(i => i)
    }

    // 单张
    if (typeof item.coverImage === 'string') {
      return [item.coverImage]
    }

    return []
  })()

  return (
    <View style={styles.container}>

      {/* header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handleback} style={styles.backBtn}>
          <Image
            source={require('../../../assets/images/my/left.png')}
            style={{ width: px(22), height: px(22) }}
          />
        </TouchableOpacity>

        <Text style={styles.title}>官方公告</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.contentWrap}>



          {/* 标题 */}
          <Text style={styles.noticeTitle}>{item?.title}</Text>

          {/* 时间 */}
          <Text style={styles.time}>
            {item?.updatedAt || item?.createdAt}
          </Text>

          {/* ✅ 图片区域（在内容前） */}
{images.length > 0 && (
  <View style={styles.imageWrap}>
    {images.map((img, index) => {
      const uri = IMG_URL + img
      const ratio = imgRatioMap[uri] || 1.6

      return (
        <SafeFastImage
          key={index}
          source={{ uri }}
          style={[styles.image, { aspectRatio: ratio }]}
          resizeMode="contain"
       onLoad={(e) => {
  const { width, height } = e.nativeEvent

  if (!width || !height) return

  setImgRatioMap(prev => ({
    ...prev,
    [uri]: width / height,
  }))
}}
        />
      )
    })}
  </View>
)}

          {/* 内容 */}
          <Text style={styles.content}>
            {item?.content}
          </Text>

          {/* 额外信息 */}
          {/* <View style={styles.extraBox}>
            <Text style={styles.extraText}>
              发布人：{item?.createdByName || '系统'}
            </Text>
            <Text style={styles.extraText}>
              浏览量：{item?.viewCount ?? 0}
            </Text>
          </View> */}

        </View>
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2F3F5',
  },

  header: {
    width: '100%',
    height: px(98),
    backgroundColor: '#fff',
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'center',
  },

  backBtn: {
    position: 'absolute',
    left: px(16),
    bottom: px(18),
  },

  title: {
    fontSize: px(16),
    color: '#1A1A1A',
    marginBottom: px(18),
  },

  contentWrap: {
    paddingBottom:px(50),
    padding: px(16),
  },

  imageWrap: {
    marginBottom: px(12),
  },

  image: {
  width: '100%',
  borderRadius: px(10),
  marginBottom: px(10),
  },

  noticeTitle: {
    fontFamily: 'MiSans-Medium',
    fontSize: px(18),
    //fontWeight: '600',
    color: '#1A1A1A',
    marginBottom: px(6),
  },

  time: {
     fontFamily: 'MiSans-Regular',
    fontSize: px(12),
    color: '#999',
    marginBottom: px(12),
  },

  content: {
     fontFamily: 'MiSans-Regular',
    fontSize: px(14),
    color: '#333',
    lineHeight: px(22),
  },

  extraBox: {
    marginTop: px(20),
    paddingTop: px(12),
    borderTopWidth: px(1),
    borderTopColor: '#EEE',
  },

  extraText: {
    fontSize: px(12),
    color: '#777',
    marginTop: px(4),
  },
})