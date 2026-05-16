import React, { useState,useEffect } from "react";
import { ScrollView, View, Text, TouchableOpacity, StyleSheet,Image,
  Modal,Animated
 } from "react-native";
import { px } from '../../../utils/scaleUtils';
import {
  Button,
  Icon,
  List,
  Provider,
  Toast,
  Tooltip,
} from '@ant-design/react-native'

const sortlist=['综合排序','价格低到高','评分高到低','销量高到低']
const Tabs = ({index, onChange,routes}) => {
  const [showSort, setShowSort] = useState(false)
  const [sortindex, setSortindex] = useState(0)
  const sortOptions = ["综合排序"]
  const rotateAnim = React.useRef(new Animated.Value(0)).current;
  const handlesort = (e) => { 
 console.log(e);
 setSortindex(e)
 setShowSort(false)
   };
   useEffect(() => {
  Animated.timing(rotateAnim, {
    toValue: showSort ? 1 : 0,
    duration: 200,
    useNativeDriver: true,
  }).start();
}, [showSort]);
const rotate = rotateAnim.interpolate({
  inputRange: [0, 1],
  outputRange: ["0deg", "180deg"],
});
  return (
     <View style={{paddingHorizontal:px(0),paddingTop:px(0),
        width: '100%',
      }}>
    <View style={styles.container}>
             {/* 综合排序 */}
      {/* <TouchableOpacity
        onPress={() => setShowSort(!showSort)}
        style={{ flexDirection: 'row', alignItems: 'center',
        height: px(33),}}
      >
        <Text style={styles.comprehensive}>{sortlist[sortindex]}</Text>
       <Animated.Image
        source={require('../../../../assets/images/home/select.png')}
        style={{
          width: px(17),
          height: px(17),
          marginLeft: px(1),
          transform: [{ rotate }],
        }}
      />
      </TouchableOpacity> */}
      {/* Tabs */}
        <ScrollView style={{marginLeft: px(0),}} horizontal showsHorizontalScrollIndicator={false}
        contentContainerStyle={{gap:px(0),flexDirection:'row',alignItems: 'center',}}>
      {routes.map((item, i) => (
        <TouchableOpacity
          key={i}
          onPress={() => onChange(i)}
          style={{height: px(33),flexDirection: 'row',
            alignItems: 'center',justifyContent: 'center',paddingHorizontal:px(7)
          }}
        >
          <Text style={index === i ?styles.setitle:styles.title}>
            {item.title}
          </Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  
    </View>
    {showSort&&
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
    }
  
    </View>
  );
}
export default React.memo(Tabs)
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
    setitle:{
 fontFamily: 'MiSans-Medium',
        fontSize:px(13),
        color:'#FF9500',
        fontWeight:400,
        lineHeight:px(17),
    },
    title:{
 fontFamily: 'MiSans-Regular',
        fontSize:px(13),
        color:'#AAAAAA',
        fontWeight:400,
        lineHeight:px(17),
    },
    comprehensive:{
 fontFamily: 'MiSans-Regular',
        fontSize:px(13),
        color:'#1A1A1A',
        fontWeight:400,
        lineHeight:px(17),
    },
    container:{
      height: px(33),
      paddingHorizontal:px(16),
   flexDirection: 'row',
   alignItems: 'center',
   marginTop: px(0),
    },


});