import { StyleSheet, Text, View,TouchableOpacity,Image,ScrollView,TextInput,
   TouchableWithoutFeedback,Keyboard,Platform,
 } from 'react-native'
import React,{useState,useEffect,} from 'react'
import { px } from '../../utils/scaleUtils'
import TextRadioModal from '../../components/Shop/TextRadioModal';
import ImageUploader from '../../components/Shop/ImageUploader';
import {
  KeyboardStickyView,KeyboardAwareScrollView
} from "react-native-keyboard-controller";
import {
  pick,
  types,
} from '@react-native-documents/picker';
import ImagePicker from 'react-native-image-crop-picker';
import {createThumbnail} from 'react-native-create-thumbnail';
import TextCheckboxModal from '../../components/Shop/TextCheckboxModal';
import request from '../../api/request';
import ShopSelectModal 
from './components/ShopSelectModal';
import LinearGradient from 'react-native-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  Toast,
  Checkbox,
  Modal as Modalitem,
} from '@ant-design/react-native'
import  {uploadImage}  from '../../api/uploadImage';
import {
 uploadAudio,
 uploadVideo
} from '../../api/uploadMedia';
import UploadLoadingModal 
from './components/UploadLoadingModal';
import { IMG_URL } from '../../api/config';


  const Line=()=>{
    return (
    <View style={{width: '100%',height:StyleSheet.hairlineWidth,
    backgroundColor: 'rgba(118, 118, 118,0.2)',}}/>
    )
}

export default function Productass({navigation,route}) {
  const {storeinfo,item}=route.params||{}
  const [assshoplist, setAssshoplist] = useState([]); //已关联商品列表

    const insets = useSafeAreaInsets();
  const bottomSafeHeight = insets.bottom; // 底部安全区高度（数值）
const [shopList,setShopList]=useState<any[]>([]);
// 已选择商品
const [shopIds,setShopIds]=useState<(number|string)[]>([]);
// 弹窗
const [shopVisible,setShopVisible]=useState(false);
// 上传loading
const [uploadLoading,setUploadLoading] =
useState(false);



useEffect(() => {
  if(item){
    console.log(item);
    
    getshoplist();
    getassshoplist();
  }
}, [item])
const getshoplist = async() => { 
          try {
        const response = await request({
          url: '/store/goods/list',
          method: 'GET',
          data: {
          },
          query: {
            status:"PUBLISHED",
            storeId:item.storeId,
          },
        }); 
        console.log('storeauth',response);
      if (response.data !== null && response.code == 0) {
      setShopList(
      response.data.list || []
      );
      } 
      } catch (error) {
        console.error(error);
      }

 };
const handleback = () => {  //返回上一页
navigation.goBack();
};
const handleaddshop = async(values) => { 
 setShopIds(values);
 console.log(values);
    const str = values.join(',');
    console.log(str);
    try {
        const response = await request({
          url: '/store/player/goods/add',
          method: 'POST',
          data: {
            playerId: item.id,
            storeId: item.storeId,
            goodsId: str,
          },
          query: {
          },
        }); 
        console.log('addreult',response);
      if (response.data !== null && response.code == 0) {
     getassshoplist();
      } 
      } catch (error) {
        console.error(error);
      }
 };
const getassshoplist = async() => { 
          try {
        const response = await request({
          url: '/store/player/goods/list',
          method: 'GET',
          data: {
          },
          query: {
            playerId:item.id,
            storeId:item.storeId,
          },
        }); 
        console.log('shoplist',response);
      if (response.data !== null && response.code == 0) {
        if(response.data.list&&response.data.list.length!==0){
        setAssshoplist(response.data.list)
        const goodsIds = response.data.list.map(
            item => item.goodsId
            );
            console.log(goodsIds);
            setShopIds(goodsIds)
        }else{
        setAssshoplist([])
        }
      } 
      } catch (error) {
        console.error(error);
      }

 };
const handledelete = (e) => { 
 console.log(e);
     Modalitem.alert('提示', '是否删除？', [
       { text: '取消', onPress: () => console.log('cancel'), style: 'cancel' },
       { text: '确定', onPress: () => handledeletesub(e),
        style: { color: '#FC9026' },
        },   
     ])
 };
const handledeletesub = async(e) => {  //正式删除
console.log(e);
          try {
        const response = await request({
          url: '/store/player/goods/delete',
          method: 'DELETE',
          data: {
          },
          query: {
            id:e.id,
            storeId:e.storeId,
          },
        }); 
        console.log('shoplist',response);
      if (response.data !== null && response.code == 0) {
       getassshoplist();
      } 
      } catch (error) {
        console.error(error);
      }
 };

  return (
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
       <Text style={styles.title}>关联商品</Text>
        </View>
   </View>

{assshoplist.length==0&&
    <View style={styles.emptyBox}>
        <Text style={styles.emptyText}>暂无商品</Text>
      </View>
}


<ScrollView contentContainerStyle={{paddingBottom:px(60)}}>
    {assshoplist.map((item,index)=>
        <View key={index}>    
    <View
    style={styles.item}
    >
    <Image
    source={{
     uri:IMG_URL+item.goodsCover
     ?
    IMG_URL+item.goodsCover
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
    {item.goodsPlatform || ''}
    </Text>
    </View>
    <TouchableOpacity onPress={()=>handledelete(item)}>
    <Image source={require('../../../assets/images/my/deleshop.png')} 
       style={{width:px(22),height:px(22)}}></Image>
    </TouchableOpacity>

    </View>
            </View>
        )

    }
</ScrollView>



<ShopSelectModal
visible={shopVisible}
onClose={()=>{
 setShopVisible(false)
}}
data={shopList}
value={shopIds}
onConfirm={(values)=>{
handleaddshop(values);
}}
/>
<View style={{position: 'absolute',bottom:0,width: '100%',backgroundColor: '#fff',
   flexDirection: 'row',justifyContent: 'center',
}}>
    <View style={{paddingBottom: bottomSafeHeight+(Platform.OS=='ios'?0 :px(8)),
    alignItems: 'center',gap:px(3)}}>
<View style={{flexDirection: 'row',alignItems: 'center',marginTop: px(8),
    gap:px(21)
}}>
       <TouchableOpacity onPress={()=>setShopVisible(true)}>
        <LinearGradient
              colors={['#FEC525', '#FC9026']} // 渐变颜色
              start={{ x: 1, y: 0 }}   
              end={{ x: 0, y: 0 }}
              style={[styles.payBox,{width: px(242),}]}
              >
              <View style={{flexDirection: 'row',alignItems: 'center',}}>
              <Text style={styles.xiadantx}>新增商品</Text>
              </View>
              </LinearGradient>
              </TouchableOpacity>
</View>
</View>
</View>
<UploadLoadingModal
visible={uploadLoading}
text="上传中，请稍候..."
 />
    </View>
 

  )
}

const styles = StyleSheet.create({
      emptyBox: {
  alignItems: 'center',
  justifyContent: 'center',
  paddingVertical: px(40),
},

emptyText: {
   fontFamily: 'MiSans-Regular',
        fontSize:px(13),
        color:'#AAAAAA',
        fontWeight:400,
        lineHeight:px(17),
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
    cover:{
 width:px(55),
 height:px(55),
 borderRadius:px(6),
 backgroundColor:'#F5F5F5',
},
    item:{
 height:px(75),
 flexDirection:'row',
 alignItems:'center',
 paddingHorizontal:px(16),
},
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
  addsmpa:{
 fontFamily: 'MiSans-Regular',
        fontSize:px(14),
        color:'#D8D8D8',
        fontWeight:400,
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
  width: px(310),
  height: px(80),
  fontSize: px(14),
   fontFamily: 'MiSans-Regular',
    },
        smalldes:{
  fontFamily: 'MiSans-Regular',
        fontSize:px(9),
        color:'#AAAAAA',
        fontWeight:'400',
        lineHeight:px(12),
    },
        shopnameinput:{
            textAlign:'right',
        //flexDirection: 'row',
        //alignItems: 'center',
    width: px(258),
    //height: 51,
    paddingVertical:0,
    fontSize: px(14),
    fontFamily: 'MiSans-Regular',
    //backgroundColor: 'red',
    },
lefttitle:{
fontFamily: 'MiSans-Regular',
fontSize:px(14),
color:'#1A1A1A',
fontWeight:'400',
lineHeight:px(19),
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