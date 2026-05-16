import { StyleSheet, Text, View ,TouchableOpacity,} from 'react-native'
import React from 'react'
import { px } from '../../utils/scaleUtils';


const SelectModal=({sortlist,sortindex})=> {
  return (
         <View style={styles.modalbox}>
           <View style={{flexDirection: 'column',justifyContent: 'center',}}>
             {sortlist.map((item,index)=>
             <TouchableOpacity onPress={()=>handlesort(index)} key={index}
             style={{paddingLeft:px(16),height: px(30),
               flexDirection: 'row',alignItems: 'center',
             }}>
               <Text style={sortindex == index?styles.issort:styles.sort} >{item}</Text>
             </TouchableOpacity>
             )}
          </View>
       </View>
  )
}
export default React.memo(SelectModal);
const styles = StyleSheet.create({
      issort:{
 fontFamily: 'MiSans-Regular',
        fontSize:px(13),
        color:'#FF9500',
        fontWeight:400,
        lineHeight:px(17),
  },
  sort:{
 fontFamily: 'MiSans-Regular',
        fontSize:px(13),
        color:'#767676',
        fontWeight:400,
        lineHeight:px(17),
  },
      modalbox:{
    justifyContent: 'center',
    position: 'absolute',
    top: px(33),
       borderRadius: px(14),
    left:px(0),
width: px(100),
height: px(122),
backgroundColor: '#fff',
   // 阴影（iOS）
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 0 }, // 如果是顶部阴影用负数
  shadowOpacity: 0.1,
  shadowRadius: 10,
  // Android
  elevation: 8,
  },
})