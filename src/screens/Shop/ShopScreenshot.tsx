import { StyleSheet, Text, View,TouchableOpacity,Image,TextInput,TouchableWithoutFeedback,
    Keyboard,ActivityIndicator
 } from 'react-native'
import React,{useState,useEffect,} from 'react'
import { px } from '../../utils/scaleUtils';
import LinearGradient from 'react-native-linear-gradient';
import { launchImageLibrary } from 'react-native-image-picker';
import ImagePreviewer from '../../components/Shop/ImagePreviewer';
import ImageUploader from '../../components/Shop/ImageUploader';
import { Button, List, Provider, Switch, Toast } from '@ant-design/react-native'
import useAuthStore from '../../utils/zustand';
import  {uploadImage}  from '../../api/uploadImage';
import request from '../../api/request';


export default function ShopScreenshot({navigation,route,}) {
const {e}=route.params || {}
const [score, setScore] = useState(5); //评价分数，默认5分
const [images, setImages] = useState([]);
const [previewVisible, setPreviewVisible] = useState(false);
const [currentIndex, setCurrentIndex] = useState(0);
const triggerOrderRefresh =
  useAuthStore(
    state => state.triggerOrderRefresh
  );


  const handleback = () => {  //返回上一页
   navigation.goBack();
     };
const [username, setUsername] = useState("");
const onChangeText = (e) => { 
    console.log(e);
    setUsername(e)
};
    const handlesubmit = async() => {  //上传进度
    console.log(images);
    console.log(username);
    if(username==""){
        Toast.show({
        content: '请填写备注信息',
        duration: 2,
        position: 'center',
        mask: false,
      })
      return
    }
      if(images.length==0){
        Toast.show({
        content: '请上传截图',
        duration: 2,
        position: 'center',
        mask: false,
      })
      return
    }

    const finalStr = await handleUploadAndFormat(images);
    console.log(finalStr);
             try {
               const response = await request({
                 url: '/store/order/progress',
                 method: 'POST',
                 data:{
                  orderId: e.id,
                  storeId: e.storeId,
                  content: username,
                  images:finalStr
                 },
                 query: {}
               });
               console.log(response);
              if(response.data!==undefined&&response.code==0){
                  Toast.success({
                  content: '上传成功',
                  duration: 2,
                  position: 'center',
                  mask: false,
                  })
                 triggerOrderRefresh();
                 navigation.goBack();
              }
             } catch (error) {
               console.error(error);
             }

     };
     const handleUploadAndFormat = async (imageList) => {
       try {
         if (!Array.isArray(imageList) || imageList.length === 0) {
           return '';
         }
     
         // 最终结果（保持原顺序）
         const resultList = [];
     
         // 本地图片待上传列表
         const localImages = [];
     
         // 记录本地图片在原数组中的位置
         const localIndexes = [];
     
         imageList.forEach((item, index) => {
           const uri = item?.uri;
     
           if (!uri) return;
     
           // 网络图
           if (uri.startsWith('http')) {
             const uploadIndex = uri.indexOf('upload/');
             if (uploadIndex !== -1) {
               const realPath = uri.substring(uploadIndex + 7); // 去掉 "upload/"
               resultList[index] = realPath;
             } else {
               resultList[index] = uri; // 防止异常格式
             }
           }
     
           // 本地图
           else {
             localImages.push(uri);
             localIndexes.push(index);
           }
         });
     
         // 上传本地图片
         if (localImages.length > 0) {
           const res = await uploadImage(localImages);
     
           const serverImages = Array.isArray(res.data) ? res.data : [];
     
           serverImages.forEach((img, i) => {
             const originalIndex = localIndexes[i];
             resultList[originalIndex] = img;
           });
         }
     
         // 去掉空值并拼接
         return resultList.filter(Boolean).join(',');
       } catch (error) {
         Toast.removeAll();
         Toast.fail('上传图片失败，请稍后重试');
         console.log('上传处理失败:', error);
         return '';
       }
     };
     useEffect(() => {
      if(e){
        console.log(e);
      }
     }, [e])
     
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
                <Text style={styles.title}>上传进度</Text>
                 <TouchableOpacity  style={{  position: 'absolute',
               right: px(16),}} onPress={()=>handlesubmit()}>
             <LinearGradient
              colors={['#FEC525', '#FC9026']} // 渐变颜色
              start={{ x: 1, y: 0 }}   
              end={{ x: 0, y: 0 }}
              style={[styles.payBox]}
              >
             <Text style={styles.fabu}>确定</Text>
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
    placeholder="添加备注信息"
    //keyboardType="number-pad"
    placeholderTextColor="#AAAAAA"
    maxLength={30}
    selectionColor='#FC9026'
    textAlignVertical="top"  
    />
    </View>

<View style={{width: '100%',flexDirection: 'row',alignItems: 'center',justifyContent: 'flex-end',}}>
 <Text style={styles.count}>
        {username?.length||0}
      </Text>
      <Text style={styles.countf}>/30</Text>
</View>
  
<ImageUploader
  max={4}
  value={images}
  onChange={setImages}
/>
</View>
{/* <ImagePreviewer
  visible={previewVisible}
  images={images}
  index={currentIndex}
  onClose={() => setPreviewVisible(false)}
  enableLongPressSave={false}
/> */}

    </View>
    </TouchableWithoutFeedback>
  )
}

const styles = StyleSheet.create({
    imageContainer: {
  flexDirection: 'row',
  flexWrap: 'wrap',
  marginTop: px(12),
},

imageBox: {
  width: px(80),
  height: px(80),
  marginRight: px(8),
  marginBottom: px(8),
  position: 'relative',
},

image: {
  width: '100%',
  height: '100%',
  borderRadius: px(6),
},

addBox: {
  width: px(80),
  height: px(80),
  borderWidth: 1,
  borderColor: '#ddd',
  borderStyle: 'dashed',
  alignItems: 'center',
  justifyContent: 'center',
  borderRadius: px(6),
},

deleteBtn: {
  position: 'absolute',
  top: px(4),
  right: px(4),
  width: px(18),
  height: px(18),
  borderRadius: px(9),
  backgroundColor: 'rgba(0,0,0,0.6)',
  alignItems: 'center',
  justifyContent: 'center',
},
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
  height: px(132),
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