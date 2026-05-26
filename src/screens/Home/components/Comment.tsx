import { StyleSheet, Text, View,Image,TouchableOpacity, } from 'react-native'
import React,{useState} from 'react'
import { px } from '../../../utils/scaleUtils';
import StarRating from '../../../components/Club/StarRating'
import { IMG_URL } from '../../../api/config';
import ImagePreviewer from '../../../components/Shop/ImagePreviewer';
const Comment=({item})=> {
    const [avatarError, setAvatarError] = useState(false);
const [previewVisible, setPreviewVisible] = useState(false);
const [currentIndex, setCurrentIndex] = useState(0);

 
  const avatarUrl = item?.userAvatar
    ? `${IMG_URL}${item.userAvatar}`
    : null;
    const imageList = (item?.images ? item.images.split(',') : []).map(img => ({
  url: `${IMG_URL}${img}`,
}));
  return (
    <View style={{marginTop: px(10),}}>
    <View style={{flexDirection: 'row',}}>
        <Image
          source={
            avatarError || !avatarUrl
              ? require('../../../../assets/images/my/defultavtar.png')
              : { uri: avatarUrl }
          }
          style={{
            width: px(40),
            height: px(40),
            borderRadius: px(20),
          }}
          onError={() => setAvatarError(true)}
        />
    <View style={{flexDirection: 'column',marginLeft: px(12),}}>
<Text style={styles.title}>{item.userNickname}</Text>
<View style={{marginTop: px(6),}}>
<StarRating score={item.rating} size={px(16)}></StarRating>
</View>
<Text style={styles.content}>{item.comment}</Text>
{/* 评论图片 */}
<View
  style={{
    width: px(279),
    //backgroundColor: 'red',
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    marginTop: px(6),
    gap: px(10),
  }}
>
  {imageList.map((img, index) => (
    <TouchableOpacity
      key={index}
      activeOpacity={0.9}
      onPress={() => {
        setCurrentIndex(index);
        setPreviewVisible(true);
      }}
    >
      <Image
        source={{ uri: img.url }}
        style={{
          width: px(80),
          height: px(80),
          borderRadius: px(8),
          backgroundColor: '#F5F5F5',
        }}
        resizeMode="cover"
      />
    </TouchableOpacity>
  ))}
</View>
<Text style={styles.time}>{item?.createdAt?.slice(0, 10)}</Text>
  </View>
  </View>
<ImagePreviewer
  visible={previewVisible}
  images={imageList}
  index={currentIndex}
  onClose={() => setPreviewVisible(false)}
/>
    </View>
  )
}
export default React.memo(Comment)
const styles = StyleSheet.create({
    time:{
        marginTop: px(10),
 fontFamily: 'MiSans-Regular',
        fontSize:px(10),
        color:'#AAAAAA',
        fontWeight:400,
        lineHeight:px(13),
    },
    content:{
        width: px(297),
        marginTop: px(6),
 fontFamily: 'MiSans-Regular',
        fontSize:px(14),
        color:'#1A1A1A',
        fontWeight:400,
        lineHeight:px(19),
    },
title:{
    marginTop: px(2),
     fontFamily: 'MiSans-Medium',
        fontSize:px(15),
        color:'#1A1A1A',
        //fontWeight:500,
        lineHeight:px(20),
}
})