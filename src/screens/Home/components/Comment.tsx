import { StyleSheet, Text, View,Image } from 'react-native'
import React,{useState} from 'react'
import { px } from '../../../utils/scaleUtils';
import StarRating from '../../../components/Club/StarRating'
import { IMG_URL } from '../../../api/config';

const Comment=({item})=> {
    const [avatarError, setAvatarError] = useState(false);

  const avatarUrl = item?.userAvatar
    ? `${IMG_URL}${item.userAvatar}`
    : null;
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
<Text style={styles.time}>{item?.createdAt?.slice(0, 10)}</Text>
  </View>
  </View>

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