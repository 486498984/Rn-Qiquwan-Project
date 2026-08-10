import React from 'react';

import {
  View,
  Modal,
  TouchableOpacity,
  Text,
  StyleSheet,
  Dimensions,
  StatusBar,
} from 'react-native';

import Video from 'react-native-video';

import {px} from '../../../utils/scaleUtils';



interface Props {

  visible:boolean;

  url:string;

  onClose:()=>void;

}



const {width,height} =
Dimensions.get('window');



export default function VideoPlayerModal({
  visible,
  url,
  onClose,
}:Props){


return (

<Modal

visible={visible}

transparent={false}

statusBarTranslucent

animationType="fade"

onRequestClose={onClose}

>


<StatusBar hidden={true}/>



<View

style={styles.container}

>


<Video

source={{
 uri:url
}}


style={styles.video}


resizeMode="contain"



/**
 * 显示系统控制
 */
controls={true}



/**
 * 自动播放
 */
paused={!visible}



/**
 * 播放结束
 */
onEnd={onClose}



/>



<TouchableOpacity

style={styles.close}

onPress={onClose}

>

<Text
style={styles.closeText}
>
×
</Text>


</TouchableOpacity>



</View>


</Modal>

)

}



const styles = StyleSheet.create({

container:{

flex:1,

backgroundColor:'#000',

justifyContent:'center',

alignItems:'center',

},


video:{

width:'100%',

height:'100%',

},


close:{

position:'absolute',

top:px(40),

right:px(20),

width:px(40),

height:px(40),

alignItems:'center',

justifyContent:'center',

},


closeText:{

fontSize:px(32),

color:'#fff',

},


});