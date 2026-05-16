import { StyleSheet, Text, View,TouchableOpacity,Image,TextInput,TouchableWithoutFeedback,
Keyboard
 } from 'react-native'
import React,{useState,useEffect} from 'react'
import { px } from '../../utils/scaleUtils';
import Storage from '../../utils/storage';
import useAuthStore from '../../utils/zustand'
import { Toast } from '@ant-design/react-native';
import request from '../../api/request';


export default function Name({navigation}) {
    const isLogin = useAuthStore(state => state.isLogin);
      const loginChanged = useAuthStore(state => state.loginChanged);
    const [phonenum, setPhonenum] = useState("");
    const [userinfo, setUserinfo] = useState(null); //登陆状态
    const onChangeText = (e) => { 
        console.log(e);
        setPhonenum(e)
      };
    const handleback = () => {  //返回上一页
    navigation.goBack();
    };

   useEffect(() => {
   getloginstatus();//获取登陆状态
   }, [isLogin]);
   const getloginstatus = async() => {  //获取登陆状态
   const user = await Storage.get("userinfo");
   if(user!==null){
   getuserinfo(user)
   }else{
   }
   console.log(user); // { name: 'Tom', age: 18 }
   };
   const getuserinfo = async(e) => { 
   console.log(e);
        try {
          const response = await request({
            url: '/user/profile',
            method: 'GET',
            data:{},
            query: { userId: e.user.userId }
          });
          console.log(response);
         if(response.data!==undefined&&response.code==0){
         setPhonenum(response.data.profile.nickName)
         setUserinfo(response.data.profile)
         }
        } catch (error) {
          console.error(error);
        }
    };
const handlesave = async() => {  //保存
    if(phonenum==""){
       Toast.show({
          content: '请填写昵称',
          duration: 2,
          position: 'center',
          mask: false,
        })
        return;
      }

          try {
          const response = await request({
            url: '/user/profile/update',
            method: 'POST',
            data:{
            gender: 2,
            nickName: phonenum,
            avatarUrl: userinfo.avatarUrl
            },
            query: {
              userId:userinfo.userId,
            }
          });
          console.log(response);
         if(response.code==0){
            loginChanged();
            Toast.show({
              content: '更新成功',
              duration: 2,
              position: 'center',
              mask: false,
            })
            handleback();
         }
          
        } catch (error) {
          console.error(error);
        } 

    //    Toast.show({
    //       content: '保存成功',
    //       duration: 1,
    //       position: 'center',
    //       mask: false,
    //     })
    //  handleback();
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
         <Text style={styles.title}>修改昵称</Text>
            <TouchableOpacity onPress={handlesave} style={{  position: 'absolute',
        right: px(18),}}>
 <Text style={phonenum==""?styles.savetx:styles.issavetx}>保存</Text>
        </TouchableOpacity>
            </View>
          </View>

          <View style={{width: '100%',backgroundColor: '#fff',height: px(51),
            marginTop: px(10),flexDirection: 'row',alignItems: 'center',
            justifyContent: 'space-between',paddingHorizontal:px(18)
          }}>
   <TextInput
   allowFontScaling={false}
          style={styles.inputbox}
          onChangeText={onChangeText}
          value={phonenum || ''}
          placeholder="请输入昵称"
          //keyboardType="number-pad"
          placeholderTextColor="#AAAAAA"
          maxLength={12}
          selectionColor='#FC9026'
        />
               {phonenum!==""&&
                     <TouchableOpacity onPress={()=>setPhonenum("")}>
     <Image source={require('../../../assets/images/my/delete.png')} 
         style={{width:px(22),height:px(22)}}></Image>
        </TouchableOpacity> 
               }
 
        
          </View>
         <View style={{width: '100%',flexDirection: 'row',justifyContent: 'flex-end',
            paddingHorizontal:px(18),marginTop: px(8),
         }}>
<Text style={styles.destext}>*仅支持汉字、字母、数字(最多12个字符)</Text>
         </View>
    </View>
       </TouchableWithoutFeedback>
  )
}

const styles = StyleSheet.create({
        issavetx:{
  fontFamily: 'MiSans-Regular',
    fontSize:px(16),
    color:'#FF9500',
    fontWeight:400,
    lineHeight:px(21),
    },
    savetx:{
  fontFamily: 'MiSans-Regular',
    fontSize:px(16),
    color:'#AAAAAA',
    fontWeight:400,
    lineHeight:px(21),
    },
    destext:{
  fontFamily: 'MiSans-Regular',
    fontSize:px(12),
    color:'rgba(118, 118, 118,0.6)',
    fontWeight:400,
    lineHeight:px(16),
  },
inputbox:{
  flexDirection: 'row',
  alignItems: 'center',
  width: px(325),
  height: px(51),
  fontSize: px(14),
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