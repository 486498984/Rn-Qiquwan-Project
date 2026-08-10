import React, {
  useRef,
  useState,
} from 'react';


import {
  View,
  StyleSheet,
  TouchableWithoutFeedback,
  TouchableOpacity,
  Image,
} from 'react-native';


import Video from 'react-native-video';

import Slider from '@react-native-community/slider';

import {px} from '../../utils/scaleUtils';



export default function VideoPlayer({
  route,
  navigation
}){


const {
  url
} = route.params || {};



const videoRef =
useRef<any>(null);



/**
 * 是否播放
 */
const [playing,setPlaying] =
useState(true);



/**
 * 当前播放时间
 */
const [currentTime,setCurrentTime] =
useState(0);



/**
 * 视频总时长
 */
const [duration,setDuration] =
useState(1);





/**
 * 点击视频区域
 * 播放 <-> 暂停
 */
const handlePress = ()=>{

  setPlaying(prev=>!prev);

};




return (

<View

style={styles.container}

>


{/* 返回按钮 */}

<TouchableOpacity

style={styles.back}

onPress={()=>{

navigation.goBack();

}}

>

<Image

source={
require('../../../assets/images/my/wleft.png')
}


style={styles.backIcon}

/>

</TouchableOpacity>





<TouchableWithoutFeedback

onPress={handlePress}

>


<View style={styles.videoBox}>


<Video

ref={videoRef}

source={{
 uri:url
}}

style={styles.video}

resizeMode="contain"

paused={!playing}


onLoad={(data)=>{

 setDuration(data.duration || 1);

}}


onProgress={(data)=>{

 setCurrentTime(data.currentTime);

}}


/>


{/* 点击层，必须覆盖 Video */}

<TouchableOpacity

activeOpacity={1}

style={styles.touchLayer}

onPress={()=>{

 setPlaying(prev=>!prev);

}}

>



</TouchableOpacity>



{/* 暂停显示播放按钮 */}

{
!playing &&

<TouchableOpacity

style={styles.playButton}

activeOpacity={0.8}

onPress={()=>{

 setPlaying(true);

}}

>

<Image
source={
require('../../../assets/images/home/playing2.png')
}
style={styles.playIcon}
/>
</TouchableOpacity>

}



</View>


</TouchableWithoutFeedback>





{/* 底部进度条 */}

<View

style={styles.sliderBox}

>


<Slider


value={currentTime}



maximumValue={
duration
}



minimumValue={0}



minimumTrackTintColor="#fff"


maximumTrackTintColor="rgba(255,255,255,0.5)"


thumbTintColor="#fff"



onSlidingComplete={(value)=>{


videoRef.current?.seek(
value
);


}}


/>


</View>




</View>

)

}




const styles = StyleSheet.create({
    playButton:{
 position:'absolute',
 opacity:0.5,
 width:px(60),
 height:px(60),

 alignItems:'center',
 justifyContent:'center',

 zIndex:10,

 elevation:10,

},
touchLayer:{
 position:'absolute',

 top:0,
 left:0,
 right:0,
 bottom:0,

 zIndex:5,

},

container:{

flex:1,

backgroundColor:'#000',

},



videoBox:{

flex:1,

justifyContent:'center',

alignItems:'center',

},



video:{

width:'100%',

height:'100%',

},



back:{

position:'absolute',

top:px(55),

left:px(16),

zIndex:20,

elevation:20,

width:px(40),

height:px(40),

justifyContent:'center',

},



backIcon:{

width:px(22),

height:px(22),

},




playIcon:{

width:px(55),

height:px(55),

},



sliderBox:{

position:'absolute',

bottom:px(20),

left:px(15),

right:px(15),

zIndex:20,

elevation:20,

},


});