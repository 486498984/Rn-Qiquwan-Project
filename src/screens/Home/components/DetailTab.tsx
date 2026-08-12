import React, {
  useState,
} from 'react';

import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';

import {
  TabView,
  TabBar,
} from 'react-native-tab-view';

import {px} from '../../../utils/scaleUtils';
import Playershop from "../../../components/Home/Playershop";
import SafeFastImage from '../../../components/Home/SafeFastImage';
import { IMG_URL } from '../../../api/config';
import ImagePreviewer from '../../../components/Shop/ImagePreviewer';
import {
  createThumbnail
} from 'react-native-create-thumbnail';
import VideoThumbnail from "./VideoThumbnail";
import VideoPlayerModal from "./VideoPlayerModal";



export default function DetailTab({playinfo,navigation}){

const goodsCount =
  playinfo?.goods?.length || 0;


const albumCount =
  playinfo?.player?.albums
    ? playinfo.player.albums
        .split(',')
        .filter(item => item.trim() !== '')
        .length
    : 0;


const videoCount =
  playinfo?.player?.videos
    ? playinfo.player.videos
        .split(',')
        .filter(item => item.trim() !== '')
        .length
    : 0;

  const [index,setIndex] =
    useState(0);

const routes = [
  {
    key:'play',
    title:`陪玩 ${goodsCount}`,
  },
 
  {
    key:'album',
    title:`相册 ${albumCount}`,
  },

  {
    key:'video',
    title:`视频 ${videoCount}`,
  },
];
const [previewVisiblecon,setPreviewVisiblecon] =
useState(false);


const [currentIndexcon,setCurrentIndexcon] =
useState(0);
const headimgviewcon =
playinfo?.player?.albums
?
playinfo.player.albums
.split(',')
.filter(item=>item.trim()!=='')
.map(item=>({
  url:IMG_URL+item,
}))
:
[];
const videoList =
playinfo?.player?.videos
?
playinfo.player.videos
.split(',')
.filter(item=>item.trim()!=='')
.map(item=>IMG_URL+item)
:
[];
const [videoVisible,setVideoVisible] =
useState(false);


const [currentVideo,setCurrentVideo] =
useState('');


  return (
    <>
        <TabView
      navigationState={{
        index,
        routes,
      }}
      renderScene={({route})=>{
        switch(route.key){
          case 'play':
            return (
              <View style={styles.page}>
               {playinfo?.goods?.map((item,index)=>
            <Playershop
            key={String(item.id)}
            item={item}
            navigation={navigation}
            type={1}
            playinfo={playinfo}
            />
            )}
              </View>
            );

          case 'album':
            return (
              <View style={styles.page}>
              <View style={{width: '100%',flexDirection: 'row',alignItems: 'center',
                flexWrap: 'wrap',gap:px(4)
              }}>
{
headimgviewcon.map((item,index)=>(


<TouchableOpacity

key={index}

activeOpacity={0.8}

onPress={()=>{

  setCurrentIndexcon(index);

  setPreviewVisiblecon(true);

}}

>


<SafeFastImage

source={{
 uri:item.url
}}

style={{
 width:px(178),
 height:px(178),
 borderRadius:px(8),
}}

/>


</TouchableOpacity>


))
}
              </View>
              </View>

            );



case 'video':
return (
<View style={styles.page}>
    <View style={{flexDirection: 'row',alignItems: 'center',
        flexWrap: 'wrap',gap:px(4),width: '100%',
    }}>

{
videoList.map((item,index)=>(
<TouchableOpacity
key={index}
style={{
 width:px(178),
 height:px(178),
 marginBottom:px(8),
}}
activeOpacity={0.8}


onPress={()=>{
navigation.navigate('VideoPlayer',{
 url:item
});
// setCurrentVideo(item);

//setVideoVisible(true);

}}
>
<VideoThumbnail
url={item}
/>
</TouchableOpacity>
))
}
    </View>



</View>

)


          default:

            return null;

        }


      }}
      onIndexChange={
        setIndex
      }
      renderTabBar={
        props=>(
            <View
            style={{
                flexDirection:'row',
                alignItems:'center',
                justifyContent:'space-between',
                backgroundColor:'#fff',
                paddingHorizontal:px(16)
            }}
            >
          <TabBar
            {...props}
            pressColor="transparent"
            /**
             * Tab靠左排列
             */
            contentContainerStyle={{
              justifyContent:'flex-start',
              //backgroundColor: 'red',
              //paddingHorizontal:px(16)
            }}
            /**
             * 背景
             */
            style={{
              backgroundColor:'#fff',
              elevation:0,
              shadowOpacity:0,
            }}
            /**
             * 文字颜色
             */
            renderTabBarItem={(itemProps)=>{
            const {
                route,
                navigationState,
                onPress,
            } = itemProps;
            const focused =
                navigationState.routes[
                navigationState.index
                ].key === route.key;
            return (
                <TouchableOpacity
                onPress={onPress}
                activeOpacity={0.8}
                style={{
                    width:px(70),
                    height:px(48),
                    //alignItems:'center',
                    justifyContent:'center',
                }}
                >
                <Text
                    style={{
                    fontFamily: focused
                        ? 'MiSans-Medium'
                        : 'MiSans-Regular',
                    fontSize:focused ?px(16):px(14),
                    color:focused
                        ? '#1A1A1A'
                        : '#8E8E8E',
                        
                    }}
                >
                    {route.title}
                </Text>
                </TouchableOpacity>
                );
                }}
            /**
             * 每个tab宽度
             */
            tabStyle={{
              width:px(70),
            }}
            /**
             * 滑块
             */
            indicatorStyle={{
              /**
               * 滑块宽度
               */
              width:px(20),
              /**
               * 高度
               */
              height:px(3),
              borderRadius:px(10),
              backgroundColor:'#000000',
              /**
               * 关键：
               * (tab宽70 - 滑块24) / 2
               */
              marginLeft:px(6),
              bottom:px(8),
            }}
          />
        <Text style={styles.paynumber}>{playinfo?.player?.virtualPayCount}人付款</Text>
      </View>
        )

      }
    />
    <ImagePreviewer
      visible={previewVisiblecon}
      images={headimgviewcon}
      index={currentIndexcon}
      onClose={() => setPreviewVisiblecon(false)}
      enableLongPressSave={false}
    />
    <VideoPlayerModal

visible={videoVisible}

url={currentVideo}

onClose={()=>{

 setVideoVisible(false);

}}

/>
    </>


  )

}




const styles = StyleSheet.create({
paynumber:{
fontFamily: 'MiSans-Regular',
        fontSize:px(14),
        color:'#8E8E8E',
        fontWeight:400,
        lineHeight:px(19),
},
  page:{
    //flex:1,
    paddingHorizontal:px(16),
    marginTop: px(0),
    gap:px(16),
    alignItems:'center',
    justifyContent:'center',
  },
});