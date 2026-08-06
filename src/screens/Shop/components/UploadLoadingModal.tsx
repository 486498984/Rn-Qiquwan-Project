import React from 'react';

import {
  Modal,
  View,
  Text,
  ActivityIndicator,
  StyleSheet,
} from 'react-native';

import { px } from '../../../utils/scaleUtils';



interface Props {

  visible:boolean;

  text?:string;

}



export default function UploadLoadingModal({

  visible,

  text='上传中...',

}:Props){


return (

<Modal

visible={visible}

transparent={true}

animationType="fade"

statusBarTranslucent={true}

>

<View
style={styles.mask}
>


<View
style={styles.content}
>


<ActivityIndicator

size="large"

color="#FC9026"

/>



<Text
style={styles.text}
>

{text}

</Text>


</View>



</View>


</Modal>

);


}



const styles = StyleSheet.create({


mask:{

 flex:1,

 backgroundColor:'rgba(0,0,0,0.45)',

 alignItems:'center',

 justifyContent:'center',

},



content:{

 width:px(130),

 height:px(110),

 backgroundColor:'rgba(0,0,0,0.75)',

 borderRadius:px(12),

 alignItems:'center',

 justifyContent:'center',

},



text:{

 marginTop:px(15),

 color:'#fff',

 fontSize:px(14),

 fontFamily:'MiSans-Regular',

},



});