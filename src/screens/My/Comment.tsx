import { StyleSheet, Text, View,TouchableOpacity,Image,TextInput,TouchableWithoutFeedback,
    Keyboard
 } from 'react-native'
import React,{useState} from 'react'
import { px } from '../../utils/scaleUtils';
import LinearGradient from 'react-native-linear-gradient';



export default function Comment({navigation}) {
       const [score, setScore] = useState(5); //评价分数，默认5分

     const handleback = () => {  //返回上一页
   navigation.goBack();
     };
           const [username, setUsername] = useState(null);
                 const onChangeText = (e) => { 
                     console.log(e);
                     setUsername(e)
                   };
  return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
    <View style={styles.container}>
         <View style={{width: px(393),height: px(98),backgroundColor: '#fff',
                   flexDirection: 'row',alignItems: 'flex-end',
                 }}>
                   <View style={{width: '100%',paddingHorizontal:px(16),marginBottom: px(18),
                     flexDirection: 'row',alignItems: 'center',justifyContent: 'center',
                   }}>
              <TouchableOpacity onPress={handleback} style={{  position: 'absolute',
               left: px(16),}}>
                <Image source={require('../../../assets/images/my/left.png')} 
                style={{width:px(22),height:px(22)}}></Image>
                </TouchableOpacity>
                <Text style={styles.title}>写评价</Text>
                 <TouchableOpacity  style={{  position: 'absolute',
               right: px(16),}}>
  <LinearGradient
              colors={['#FEC525', '#FC9026']} // 渐变颜色
              start={{ x: 1, y: 0 }}   
              end={{ x: 0, y: 0 }}
              style={[styles.payBox]}
              >
<Text style={styles.fabu}>发布</Text>
              </LinearGradient>
               </TouchableOpacity>
                   </View>
                 </View>
<View style={{width: '100%',backgroundColor: '#fff',
    marginTop: px(16),padding:px(16),
}}>
    <View style={{flexDirection: 'row',}}>
     <Image source={require('../../../assets/images/my/edit.png')} 
     style={{width:px(19),height:px(19),marginTop: px(0),}}></Image>
    <TextInput
    allowFontScaling={false}
    multiline
    style={styles.inputbox}
    onChangeText={onChangeText}
    value={username || ''}
    placeholder="写一些更有帮助性的评价吧~"
    //keyboardType="number-pad"
    placeholderTextColor="#AAAAAA"
    maxLength={50}
    selectionColor='#FC9026'
    textAlignVertical="top"  
    />
    </View>

<View style={{width: '100%',flexDirection: 'row',alignItems: 'center',justifyContent: 'flex-end',}}>
 <Text style={styles.count}>
        {username?.length||0}
      </Text>
      <Text style={styles.countf}>/50</Text>
</View>
  
</View>

<View style={{width: '100%',height: px(51),backgroundColor: '#fff',
    marginTop: px(16),paddingHorizontal:px(16),flexDirection: 'row',
    alignItems: 'center',justifyContent: 'space-between',
}}>
<Text style={styles.comtx}>服务评价</Text>
<View style={{flexDirection: 'row',alignItems: 'center',gap:px(9)}}>
    {score==1?(
<Text style={styles.comstx}>非常差</Text>
    ):score==2?(
<Text style={styles.comstx}>差</Text>
    ):score==3?(
<Text style={styles.comstx}>一般</Text>
    ):score==4?(
<Text style={styles.comstx}>好</Text>
    ):score==5?(
<Text style={styles.comstx}>非常好</Text>
    ):null

    }

<View style={{flexDirection: 'row',alignItems: 'center',gap:px(2)}}>
    <TouchableOpacity onPress={()=>setScore(1)}>
        {score>=1&&
         <Image source={require('../../../assets/images/my/comstar.png')} 
  style={{width:px(29),height:px(29)}}></Image>
        }
    </TouchableOpacity>
   <TouchableOpacity onPress={()=>setScore(2)}>
     {score>=2&&
         <Image source={require('../../../assets/images/my/comstar.png')} 
  style={{width:px(29),height:px(29)}}></Image>
        }
             {score<2&&
         <Image source={require('../../../assets/images/my/comnostar.png')} 
  style={{width:px(29),height:px(29)}}></Image>
        }
    </TouchableOpacity>
       <TouchableOpacity onPress={()=>setScore(3)}>
   {score>=3&&
         <Image source={require('../../../assets/images/my/comstar.png')} 
  style={{width:px(29),height:px(29)}}></Image>
        }
             {score<3&&
         <Image source={require('../../../assets/images/my/comnostar.png')} 
  style={{width:px(29),height:px(29)}}></Image>
        }
    </TouchableOpacity>
       <TouchableOpacity onPress={()=>setScore(4)}>
   {score>=4&&
         <Image source={require('../../../assets/images/my/comstar.png')} 
  style={{width:px(29),height:px(29)}}></Image>
        }
             {score<4&&
         <Image source={require('../../../assets/images/my/comnostar.png')} 
  style={{width:px(29),height:px(29)}}></Image>
        }
    </TouchableOpacity>
       <TouchableOpacity onPress={()=>setScore(5)}>
   {score>=5&&
         <Image source={require('../../../assets/images/my/comstar.png')} 
  style={{width:px(29),height:px(29)}}></Image>
        }
             {score<5&&
         <Image source={require('../../../assets/images/my/comnostar.png')} 
  style={{width:px(29),height:px(29)}}></Image>
        }
    </TouchableOpacity>
</View>
</View>
</View>
    </View>
    </TouchableWithoutFeedback>
  )
}

const styles = StyleSheet.create({
    comstx:{
 fontFamily: 'MiSans-Regular',
        fontSize:px(14),
        color:'#9E9E9E',
        fontWeight:400,
        lineHeight:px(19),
    },
    comtx:{
  fontFamily: 'MiSans-Medium',
        fontSize:px(14),
        color:'#000000',
        //fontWeight:500,
        lineHeight:px(19),
    },
    countf:{
 fontFamily: 'MiSans-Regular',
        fontSize:px(14),
        color:'#AAAAAA',
        fontWeight:400,
        lineHeight:px(19),
    },
    count:{
 fontFamily: 'MiSans-Regular',
        fontSize:px(14),
        color:'#767676',
        fontWeight:400,
        lineHeight:px(19),
    },
          inputbox:{
            paddingTop: px(0),     // ✅ 关键：统一顶部间距
  paddingBottom: px(8),
  paddingLeft: px(0),
  paddingRight: px(8),
  textAlignVertical: 'top', // Android 必须

            //backgroundColor: 'red',
    marginLeft: px(8),
  flexDirection: 'row',
  alignItems: 'center',
  width: px(325),
  height: px(151),
  fontSize: px(14),
   fontFamily: 'MiSans-Regular',
    },
    fabu:{
  fontFamily: 'MiSans-Medium',
        fontSize:px(14),
        color:'#FFFFFF',
        //fontWeight:500,
        lineHeight:px(19),
    },
                payBox:{
      //marginTop: px(8),
  width: px(52),
  height: px(31),
  borderRadius: px(4),
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'center',
    },
         title:{
  fontFamily: 'MiSans-Medium',
        fontSize:px(16),
        color:'#1A1A1A',
        //fontWeight:500,
        lineHeight:px(21),
  },
    container:{
        flex: 1,
        backgroundColor: '#F2F3F5',
    }
})