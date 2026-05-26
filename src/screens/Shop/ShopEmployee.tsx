import { StyleSheet, Text, View,TouchableWithoutFeedback,Keyboard,TouchableOpacity,Image,TextInput,
Animated,
ScrollView,Platform,
 } from 'react-native'
import React,{useState,useEffect,} from 'react'
import { px } from '../../utils/scaleUtils';
import {
  Toast,
  Tooltip,
} from '@ant-design/react-native'
import EmployeeItem from './components/EmployeeItem'
import LinearGradient from 'react-native-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import request from '../../api/request'


export default function ShopEmployee({ navigation,route }) {
         const insets = useSafeAreaInsets();
          const bottomSafeHeight = insets.bottom; // 底部安全区高度（数值）
          const actions = [
          { 
            key: 'all',
            text: <Text style={styles.tooltx}>全部</Text>,
          },
            {
            key: 'admin',
            text: <Text style={styles.tooltx}>管理员</Text>,
          },
            {
            key: 'operation',
            text: <Text style={styles.tooltx}>运营</Text>,
          },
        {
            key: 'finance',
            text: <Text style={styles.tooltx}>财务</Text>,
          },
              {
            key: 'kefu',
            text: <Text style={styles.tooltx}>客服</Text>,
          },
        ]
      const [username, setUsername] = useState(null);
       const [actionsse, setActionsse] = useState(actions);
        const [rttext, setRttext] = useState('全部'); //右上角文字
         const rotateAnim = useState(new Animated.Value(0))[0]
        const [open, setOpen] = useState(false)
        const rotate = rotateAnim.interpolate({
        inputRange: [0, 1],
        outputRange: ['0deg', '180deg'],
        })
    const {storeinfo}=route.params||{}



     const onChangeText = (e) => {
      console.log(e);
      setUsername(e)
     };
      const handleback = () => {  //返回上一页
   navigation.goBack();
  };
    const handlenode = (e) => {  //切换右上角
  console.log(e.text.props.children);
  setRttext(e.text.props.children)
  };
  const toggleRotate = () => {
    Animated.timing(rotateAnim, {
      toValue: open ? 0 : 1,
      duration: 200,
      useNativeDriver: true,
    }).start()
  
    setOpen(!open)
  };
    const handlesubmit = () => {  //提交
    navigation.navigate('ShopAddEmployee')
    };

    useEffect(() => {
      if(storeinfo){
        console.log(storeinfo);
      getemployeelist(storeinfo);
      }

    }, [storeinfo])
    const getemployeelist = async(id) => { 
          try {
             const response = await request({
               url: '/store/role/list',
               method: 'GET',
               data:{},
               query: {
                storeId:id,
                page:1,
                pageSize:10,

              }
             });
             console.log(response);
            if(response.data!==undefined&&response.code==0){
                let res=response.data

            }
           } catch (error) {
             console.error(error);
           }
 
     };


  return (
    
     <View style={styles.container}>
        <View style={{width: px(393),height: px(135),backgroundColor: '#fff',
                   flexDirection: 'column',justifyContent: 'flex-end',
                 }}>
                   <View style={{width: '100%',paddingHorizontal:px(16),marginBottom: px(15),
                     flexDirection: 'row',alignItems: 'center',justifyContent: 'center',
                   }}>
      <TouchableOpacity onPress={handleback} style={{  position: 'absolute',
        left: px(16),}}>
        <Image source={require('../../../assets/images/my/left.png')} 
        style={{width:px(22),height:px(22)}}></Image>
        </TouchableOpacity>
        <Text style={styles.title}>员工管理</Text>
            </View>
            <View style={{width: '100%',flexDirection: 'row',alignItems: 'center',
             justifyContent:'space-between',marginBottom: px(8),paddingHorizontal:px(16)
            }}>
    <View style={{width: px(290),height: px(32),backgroundColor: '#F2F3F5',
             borderRadius: px(20), flexDirection: 'row',alignItems: 'center',
             padding:px(0),
            }}>
            <Image source={require('../../../assets/images/my/search1.png')} 
            style={{width:px(16),height:px(16),marginLeft: px(8),}}></Image>
            <TextInput
            allowFontScaling={false}
            style={styles.inputbox}
            onChangeText={onChangeText}
            value={username || ''}
            placeholder="搜索"
            placeholderTextColor="#AAAAAA"
            maxLength={20}
            selectionColor='#FC9026'
            />
            </View>

           <Tooltip.Menu
            actions={actionsse}
            onVisibleChange={(e)=>toggleRotate()}
            placement="bottom-end"
            crossOffset={{ top: 0, left: 0 }}
            onAction={(node) => handlenode(node)
            }
            trigger="onPress"
       >
        <TouchableOpacity   style={{  position: 'absolute',
        right: px(16),flexDirection: 'row',alignItems: 'center',height:px(35),
        }}>
        <Text style={styles.alltx}>{rttext}</Text>
        <Animated.Image
        source={require('../../../assets/images/my/select.png')}
        style={{
          width: px(17),
          height: px(17),
          transform: [{ rotate }],
        }}
        />
      </TouchableOpacity>
          </Tooltip.Menu>
            </View>
         
          </View>
 <ScrollView contentContainerStyle={{paddingTop:px(8),paddingHorizontal:px(16),paddingBottom:px(155),
    
 }}  showsVerticalScrollIndicator={false}>
{[0,1,2,3,4,5,6].map((item,index)=>
    <View key={index} style={{marginTop: px(8),}}>
   <EmployeeItem navigation={navigation}></EmployeeItem>
    </View>
)}

 </ScrollView>

    <View style={{position: 'absolute',bottom:0,width: '100%',backgroundColor: '#fff',
    flexDirection: 'row',justifyContent: 'center',
 }}>
     <View style={{paddingBottom: bottomSafeHeight+(Platform.OS=='ios'?0 :px(8)),
     alignItems: 'center',gap:px(3)}}>
 <View style={{flexDirection: 'row',alignItems: 'center',marginTop: px(8),
     gap:px(21)
 }}>
        <TouchableOpacity onPress={()=>handlesubmit()}>
         <LinearGradient
               colors={['#FEC525', '#FC9026']} // 渐变颜色
               start={{ x: 1, y: 0 }}   
               end={{ x: 0, y: 0 }}
               style={[styles.payBox,{width: px(242),}]}
               >
               <View style={{flexDirection: 'row',alignItems: 'center',}}>
               <Text style={styles.xiadantx}>添加员工</Text>
               </View>
               </LinearGradient>
               </TouchableOpacity>
 </View>
 </View>
 </View>  
     </View>
  
  )
}

const styles = StyleSheet.create({
                    xiadantx:{
      fontFamily: 'MiSans-Regular',
        fontSize:px(15),
        color:'#FFFFFF',
        //fontWeight:500,
        lineHeight:px(20),
    },
            payBox:{
      //marginTop: px(8),
  width: px(170),
  height: px(38),
  borderRadius: px(30),
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'center',
    },
      alltx:{
fontFamily: 'MiSans-Regular',
        fontSize:px(13),
        color:'#1A1A1A',
        fontWeight:400,
        lineHeight:px(17),
  },
      tooltx:{
fontFamily: 'MiSans-Regular',
        fontSize:px(13),
        color:'#1A1A1A',
        fontWeight:400,
        lineHeight:px(17),
  },
      inputbox:{
  paddingTop:0,
  paddingBottom:0,
    marginLeft: px(7),
  width: px(225),
  height: px(32),
  fontSize: px(12),
  fontFamily: 'MiSans-Regular',
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
        backgroundColor: '#F7F8FC',
    }
})