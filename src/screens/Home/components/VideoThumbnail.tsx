import React,{
  useEffect,
  useState,
} from 'react';


import {
  Image,
  View,
} from 'react-native';


import {
  createThumbnail
} from 'react-native-create-thumbnail';


import {px} from '../../../utils/scaleUtils';



export default function VideoThumbnail({
  url,
}){


const [thumbnail,setThumbnail] =
useState<any>(null);



useEffect(()=>{


let mounted=true;


createThumbnail({

  url:url,

  timeStamp:1000,

})


.then(response=>{


if(mounted){

setThumbnail(response);

}


})


.catch(error=>{

console.log(error);

});



return ()=>{

mounted=false;

}


},[url]);

if(!thumbnail){
return (
<View
style={{
width:px(178),
height:px(178),
backgroundColor:'#eee',
borderRadius:px(8),
}}
/>
)
}
const width =
px(178);
const height =
width *
thumbnail.height /
thumbnail.width;
return (

<View
style={{
  width:px(178),
  height:px(178),
  borderRadius:px(8),
  overflow:'hidden',
}}
>


  {/* 视频封面 */}
  <Image

    source={{
      uri:thumbnail.path
    }}

    style={{
      width:'100%',
      height:'100%',
    }}

    resizeMode="cover"

  />



  {/* 中间播放按钮 */}
  <Image

    source={
      require('../../../../assets/images/home/videoplay.png')
    }

    style={{
      position:'absolute',

      width:px(36),

      height:px(36),

      left:px(71),

      top:px(71),

    }}

  />


</View>

)
}