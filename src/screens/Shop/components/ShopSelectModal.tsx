import React, {
  useState,
  useEffect,
} from 'react';

import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  Image,
  FlatList,
  StyleSheet,
} from 'react-native';

import {px} from '../../../utils/scaleUtils';
import { IMG_URL } from '../../../api/config';

interface Props {

  visible:boolean;

  onClose:()=>void;

  data:any[];

  value:(number|string)[];

  onConfirm:(values:(number|string)[])=>void;

}



export default function ShopSelectModal({
  visible,
  onClose,
  data,
  value,
  onConfirm,

}:Props){


const [selected,setSelected] =
useState<(number|string)[]>([]);



useEffect(()=>{

 if(visible){

   setSelected(value || []);

 }

},[visible,value]);




const toggleSelect=(id:number|string)=>{


 if(selected.includes(id)){


   setSelected(
    selected.filter(
      item=>item!==id
    )
   );


 }else{


   setSelected([
    ...selected,
    id
   ]);


 }


};




const renderItem=({item})=>{


 const checked =
 selected.includes(item.id);



 return (

<TouchableOpacity
activeOpacity={0.8}
onPress={()=>{
 toggleSelect(item.id)
}}
style={styles.item}
>
<Image
source={{
 uri:IMG_URL+item.coverImage
 ?
IMG_URL+item.coverImage
 :
 undefined
}}
style={styles.cover}
/>
<View
style={styles.info}
>
<Text
style={styles.title}
numberOfLines={1}
>
{item.title}
</Text>
<Text
style={styles.desc}
numberOfLines={1}
>
{item.platform || ''}
</Text>
</View>

<View
style={[
 styles.checkbox,
 checked &&
 styles.checked
]}
>
{
checked &&
<Text
style={styles.checkText}
>
✓
</Text>
}


</View>



</TouchableOpacity>

 );


};




return (

<Modal

visible={visible}

transparent

animationType="slide"

onRequestClose={onClose}
statusBarTranslucent
>


<View
style={styles.mask}
>


<View
style={styles.container}
>



<View
style={styles.header}
>


<TouchableOpacity
onPress={onClose}
>

<Text
style={styles.cancel}
>
取消
</Text>

</TouchableOpacity>



<Text
style={styles.headerTitle}
>
选择关联商品
</Text>



<TouchableOpacity

onPress={()=>{

 onConfirm(selected);

 onClose();

}}

>

<Text
style={styles.confirm}
>
确定
</Text>


</TouchableOpacity>


</View>




<FlatList

data={data}

keyExtractor={(item)=>
String(item.id)
}

renderItem={renderItem}

showsVerticalScrollIndicator={false}

/>




</View>


</View>


</Modal>

)

}





const styles=StyleSheet.create({

mask:{
 flex:1,
 backgroundColor:'rgba(0,0,0,0.4)',
 justifyContent:'flex-end',
},


container:{
 width:'100%',
 height:'70%',
 backgroundColor:'#fff',
 borderTopLeftRadius:px(16),
 borderTopRightRadius:px(16),
},


header:{
 height:px(55),
 flexDirection:'row',
 alignItems:'center',
 justifyContent:'space-between',
 paddingHorizontal:px(16),
 borderBottomWidth:StyleSheet.hairlineWidth,
 borderColor:'#eee',
},


headerTitle:{
 fontSize:px(16),
 color:'#1A1A1A',
 fontWeight:'500',
},


cancel:{
 fontSize:px(14),
 color:'#999',
},


confirm:{
 fontSize:px(14),
 color:'#FC9026',
},


item:{
 height:px(75),
 flexDirection:'row',
 alignItems:'center',
 paddingHorizontal:px(16),
},


cover:{
 width:px(55),
 height:px(55),
 borderRadius:px(6),
 backgroundColor:'#F5F5F5',
},


info:{
 flex:1,
 marginLeft:px(12),
},


title:{
 fontSize:px(14),
 color:'#1A1A1A',
},


desc:{
 marginTop:px(6),
 fontSize:px(12),
 color:'#999',
},


checkbox:{
 width:px(22),
 height:px(22),
 borderRadius:px(11),
 borderWidth:1,
 borderColor:'#ccc',
 alignItems:'center',
 justifyContent:'center',
},


checked:{
 backgroundColor:'#FC9026',
 borderColor:'#FC9026',
},


checkText:{
 color:'#fff',
 fontSize:px(14),
},


});