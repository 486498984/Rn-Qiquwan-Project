import { StyleSheet, Text, View,StatusBar,Image,TouchableOpacity,Alert, Platform,
  ActivityIndicator,
 } from 'react-native'
import React,{useEffect,useState} from 'react'
import Storage from '../../utils/storage';
import request from '../../api/request';
import { px } from '../../utils/scaleUtils';
import ImagePicker from 'react-native-image-crop-picker';
import  {uploadImage}  from '../../api/uploadImage';
import { IMG_URL } from '../../api/config';
import useAuthStore from '../../utils/zustand'
import { Toast } from '@ant-design/react-native';
import { check, PERMISSIONS, RESULTS } from 'react-native-permissions'

export default function Avtar({ navigation }) {
    const loginChanged = useAuthStore(state => state.loginChanged);
    const [userinfo, setUserinfo] = useState({NickName:'司徒先生'});
    const [imageUri, setImageUri] = useState(""); //新头像
    const [avatarLoadError, setAvatarLoadError] = useState(false);
    const [imageUriy, setImageUriy] = useState(""); //原来头像
    useEffect(() => {
      getloginstatus()
    }, [])
      const getloginstatus = async() => {  //获取登陆状态
   const user = await Storage.get("userinfo");
   if(user!==null){
   //setUserinfo(user)
   getuserinfo(user)
   }else{

   }
   console.log(user);
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
         setImageUriy(response.data.profile.avatarUrl)
         setUserinfo(response.data.profile)
         }
        } catch (error) {
          console.error(error);
        }
    };
const handleavtar = async(e) => {  //上传头像
       console.log(e);
       if(e==1){ //拍照
        if(Platform.OS=='ios'){
        ImagePicker.openCamera({
        width: 400,
        height: 400,
        cropping: true, // 裁剪
        cropperCancelText: '取消',
        cropperChooseText: '确定',
        }).then(image => {
          console.log(image);
        setImageUri(image.path)
        setAvatarLoadError(false);
        //handleuploadImage(image.path)imageUri
        });
        }else{
          const result = await check(PERMISSIONS.ANDROID.CAMERA)
          console.log(result);
          if(result!=="granted"){
    Alert.alert(
      '相机权限申请',
      '为了上传头像，我们需要使用您的相机权限。\n该权限仅用于上传头像，不会用于其他用途。',
      [
      {
        text: '取消',
        style: 'cancel'
      },
      {
        text: '继续授权',
        onPress: () => {
   ImagePicker.openCamera({
    width: 400,
    height: 400,
    cropping: true, // 裁剪
    cropperCancelText: '取消',
  cropperChooseText: '确定',
  }).then(image => {
    console.log(image);
   setImageUri(image.path)
  setAvatarLoadError(false);
   //handleuploadImage(image.path)imageUri
  });
        }
      }
    ]
  )
          }else{
    ImagePicker.openCamera({
    width: 400,
    height: 400,
    cropping: true, // 裁剪
    cropperCancelText: '取消',
  cropperChooseText: '确定',
  }).then(image => {
    console.log(image);
   setImageUri(image.path)
setAvatarLoadError(false);
   //handleuploadImage(image.path)imageUri
  });   
          }
    
        }
  }else if(e==2){ //上传照片
  ImagePicker.openPicker({
    width: 400,
    height: 400,
    cropping: true, // 裁剪
    cropperCancelText: '取消',
    cropperChooseText: '确定',
    }).then(image => {
      console.log(image);
      setImageUri(image.path)
      setAvatarLoadError(false);
    //handleuploadImage(image.path)
    });
       }
       };
  const handleuploadImage = async(e) => {  //上传图片
       if(e==""){
        console.log(222);
        Toast.show({
          content: '请先上传新的头像',
          duration: 2,
          position: 'center',
          mask: false,
        })
       return
       }
       var ress = await uploadImage(e);
       console.log(ress);
       console.log(IMG_URL+ress.data[0]);
       if(ress.data!==undefined&&ress.data!==null){
       //const user = await Storage.get('userinfo');
          try {
          const response = await request({
            url: '/user/profile/update',
            method: 'POST',
            data:{
            gender: 2,
            nickName: userinfo.nickName,
            avatarUrl: ress.data[0]
            },
            query: {
              userId:userinfo.userId,
            }
          });
          console.log(response);
         if(response.code==0){
            loginChanged();
            navigation.goBack();
            Toast.show({
              content: '更新成功',
              duration: 2,
              position: 'center',
              mask: false,
            })
         }
          
        } catch (error) {
          console.error(error);
        } 
       }

        };
    const handleback = () => {  //返回上一页
        navigation.goBack();
     };
     const handlesave = () => {  //保存
     handleuploadImage(imageUri)
    };
  return (
    <View style={styles.container}>
        <StatusBar 
        barStyle="light-content" 
        />
     <View style={{flexDirection: 'column',alignItems: 'center',}}>
    <View style={{width: '100%',flexDirection: 'column',justifyContent: 'flex-end',
      marginTop: px(58),
    }}>
    <View style={{flexDirection: 'row',alignItems: 'center',
      justifyContent: 'center',position: 'relative',width: '100%',}}>
      <TouchableOpacity onPress={handleback} style={{position: 'absolute',left:px(16)}}>
    <Image source={require('../../../assets/images/my/wleft.png')} style={{width: px(22),height: px(22),}}></Image>
    </TouchableOpacity>
    
  
    <Text style={styles.toptitle}>编辑头像</Text>
    
    
    
      <TouchableOpacity onPress={handlesave} style={{position: 'absolute',right:px(16)}}>
    <Text style={styles.savetext}>保存</Text>
    </TouchableOpacity>
    
    
    </View>
  </View>
        <View style={{marginTop: px(80),width: '100%',}}>
<Image
  source={
    imageUri
      ? { uri: imageUri } // 新上传本地头像
      : !avatarLoadError && imageUriy
      ? { uri: IMG_URL + imageUriy } // 远程头像
      : require('../../../assets/images/my/defultavtar.png') // 默认头像
  }
  style={{ width: px(393), height: px(393) }}
  onError={() => {
    if (!imageUri) {
      setAvatarLoadError(true);
    }
  }}
/>
     {/* {imageUri==""&&
      <Image source={require('../../../assets/images/my/defultavtar.png')}
     style={{width: px(393),height: px(393)}}></Image>}
     {imageUri!==""&&
      <Image source={{uri:IMG_URL+imageUri,}} 
     style={{width: px(393),height: px(393)}}></Image>
     }  */}

     <View style={{width: '100%',flexDirection: 'column',justifyContent: 'center',
        marginTop: px(90),alignItems: 'center',gap:px(16)}}>
    <TouchableOpacity onPress={()=>handleavtar(1)} style={{width: px(338),height: px(42),backgroundColor: '#4F4F4F',borderRadius: px(90),
        flexDirection: 'row',alignItems: 'center',justifyContent: 'center',
    }}>
   <Text style={styles.infotext}>拍照</Text>
    </TouchableOpacity>
        <TouchableOpacity onPress={()=>handleavtar(2)} style={{width: px(338),height: px(42),backgroundColor: '#4F4F4F',borderRadius: px(90),
            flexDirection: 'row',alignItems: 'center',justifyContent: 'center',
        }}>
 <Text style={styles.infotext}>从手机相册选择</Text>
    </TouchableOpacity>
     </View>
        </View>

     </View>
    </View>
  )
}

const styles = StyleSheet.create({
      savetext:{
        fontFamily: 'MiSans-Regular',
        fontSize:px(16),
        color:'#fff',
        fontWeight:'400',
        lineHeight:px(21),
    },
    toptitle:{
        fontFamily: 'MiSans-Medium',
        fontSize:px(16),
        color:'#fff',
        //fontWeight:'400',
        lineHeight:px(21),
    },
    infotext:{
 fontFamily: 'MiSans-Regular',
        lineHeight:px(21),
        fontSize:px(16),
        color:'#FFFFFF',
        fontWeight:400,
    },
container:{
    flex: 1,
    backgroundColor: '#1C1C1E',
}
})