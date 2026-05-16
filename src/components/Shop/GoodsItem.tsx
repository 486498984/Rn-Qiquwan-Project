import { StyleSheet, Text, View,Image,TouchableOpacity } from 'react-native'
import React,{useState,useEffect,} from 'react'
import { px } from '../../utils/scaleUtils';
import LinearGradient from 'react-native-linear-gradient';
import { IMG_URL } from '../../api/config';
import request from '../../api/request';
import {
  Toast,
  Checkbox,
  Modal as Modalitem,
} from '@ant-design/react-native'
import FastImage from 'react-native-fast-image';
import SafeFastImage from '../Home/SafeFastImage'


const GoodsItem=({item,navigation,currentTab,onUpdate,onDelete})=> {
  const [imgError, setImgError] = useState(false);
    const [goodsinfo, setGoodsinfo] = useState([]); //商品详情
  console.log(item);
const getFirstImage = (str) => {
  return (str || '')
    .split(',')[0]
    ?.trim() || '';
};
const firstImg = getFirstImage(item.coverImage);

const imageUri = firstImg.startsWith('http')
  ? firstImg
  : IMG_URL + firstImg;
  const platformColorMap = {
  '手游': "#EBD1FF",
  '端游': "#D1E3FF",
  '双端': "#FFD1D1",
  };
  const platformColortx = {
    '手游': "#B638FF",
    '端游': "#008CFF",
    '双端': "#FF2E2E",
  };
  const getPlatformColor = (platform) => {
  return platformColorMap[platform] || "#999999"; // 默认灰色
  };
  const gettxPlatformColor = (platform) => {
  return platformColortx[platform] || "#999999"; // 默认灰色
  };
  useEffect(() => {
    if(item){
  getgoodsdetail(item)
    }
  }, [item])
  const getgoodsdetail = async(item) => { 
        try {
          const response = await request({
            url: '/store/goods/detail',
            method: 'GET',
            data:{},
            query: { id:item.id }
          });
          console.log(response);
         if(response.data!==undefined&&response.code==0){
         setGoodsinfo(response.data)
         }
        } catch (error) {
          console.error(error);
        }
   };
   const getDateOnly = (datetime) => {
  return (datetime || '').split(' ')[0] || '';
}; 
const handledelete = async() => { //删除商品
console.log(123);
        try {
          const response = await request({
            url: '/store/goods/delete',
            method: 'DELETE',
            data:{},
            query: { id:item.id }
          });
          console.log(response);
         if(response.data!==undefined&&response.code==0){
          Toast.show({
          content: '删除成功',
          duration: 2,
          position: 'center',
          mask: false,
        })
         onDelete(item.id, currentTab);
         }else{
          Toast.show({
          content: '删除失败，请稍后重试',
          duration: 2,
          position: 'center',
          mask: false,
        })
         }
        } catch (error) {
          Toast.show({
          content: '删除失败，请稍后重试',
          duration: 2,
          position: 'center',
          mask: false,
        })
          console.error(error);
        }
 };
 const gettoast = () => { 
  Toast.show({
          content: '该商品正在审核中，请耐心等待',
          duration: 2,
          position: 'center',
          mask: false,
        })
  };
 const onButtonClick = () => { //删除确认弹窗
    Modalitem.alert('提示', '是否删除？', [
      { text: '取消', onPress: () => console.log('cancel'), style: 'cancel' },
      { text: '确定', onPress: () => handledelete(),
       style: { color: '#FC9026' },
       }, 
       
    ])
  };
    const onofflineButtonClick = () => { //下架确认弹窗
    Modalitem.alert('提示', '是否下架？', [
      { text: '取消', onPress: () => console.log('cancel'), style: 'cancel' },
      { text: '确定', onPress: () => handleoffline(),
       style: { color: '#FC9026' },
       }, 
       
    ])
  };
   const ononlineButtonClick = () => { //上架确认弹窗
    Modalitem.alert('提示', '是否上架？', [
      { text: '取消', onPress: () => console.log('cancel'), style: 'cancel' },
      { text: '确定', onPress: () => handleonline(),
       style: { color: '#FC9026' },
       }, 
       
    ])
  };
  const ononlineonclik = () => {  //重新上架
   Modalitem.alert('提示', '是否重新上架？', [
      { text: '取消', onPress: () => console.log('cancel'), style: 'cancel' },
      { text: '确定', onPress: () => handlereonline(),
       style: { color: '#FC9026' },
       }, 
       
    ])
   };
  const handleonline = async() => { //提交审核
       try {
          const response = await request({
            url: '/store/goods/submit-audit',
            method: 'POST',
            data:{},
            query: { id:item.id }
          });
          console.log(response);
         if(response.data!==undefined&&response.code==0){
          Toast.show({
          content: '提交成功，请等待审核',
          duration: 2,
          position: 'center',
          mask: false,
        })
           onUpdate(item.id, 'all', null, {
          auditStatus: 'PENDING'
          });
         }else{
          Toast.show({
          content: '上架失败，请稍后重试',
          duration: 2,
          position: 'center',
          mask: false,
        })
         }
        } catch (error) {
        Toast.show({
          content: '上架失败，请稍后重试',
          duration: 2,
          position: 'center',
          mask: false,
        })
          console.error(error);
        }
   
   };
   const handleoffline = async() => {  //下架
       try {
          const response = await request({
            url: '/store/goods/offline',
            method: 'PUT',
            data:{},
            query: { id:item.id }
          });
          console.log(response);
         if(response.data!==undefined&&response.code==0){
          Toast.show({
          content: '下架成功',
          duration: 2,
          position: 'center',
          mask: false,
        })
          onUpdate(item.id, 'pending', 'inService', {
          status: 'OFFLINE',
          });
         }else{
          Toast.show({
          content: '下架失败，请稍后重试',
          duration: 2,
          position: 'center',
          mask: false,
        })
         }
        } catch (error) {
        Toast.show({
          content: '下架失败，请稍后重试',
          duration: 2,
          position: 'center',
          mask: false,
        })
          console.error(error);
        }
    }
    const handlereonline = async() => {  //重新上架
      if(item.needAudit==0){ //不需要提交审核
       try {
          const response = await request({
            url: '/store/goods/online',
            method: 'PUT',
            data:{},
            query: { id:item.id }
          });
          console.log(response);
         if(response.data!==undefined&&response.code==0){
          Toast.show({
          content: '上架成功',
          duration: 2,
          position: 'center',
          mask: false,
        })
          onUpdate(item.id, 'inService', 'pending', {
          status: 'PUBLISHED'
          });
         }else{
          Toast.show({
          content: '重新上架失败，请稍后重试',
          duration: 2,
          position: 'center',
          mask: false,
        })
         }
        } catch (error) {
        Toast.show({
          content: '重新上架失败，请稍后重试',
          duration: 2,
          position: 'center',
          mask: false,
        })
          console.error(error);
        }
      }else{ //需要审核
       try {
          const response = await request({
            url: '/store/goods/submit-audit',
            method: 'POST',
            data:{},
            query: { id:item.id }
          });
          console.log(response);
         if(response.data!==undefined&&response.code==0){
          Toast.show({
          content: '提交成功，请等待审核',
          duration: 2,
          position: 'center',
          mask: false,
        })
           onUpdate(item.id, 'inService', null, {
          auditStatus: 'PENDING'
          });
         }else{
          Toast.show({
          content: '重新上架失败，请稍后重试',
          duration: 2,
          position: 'center',
          mask: false,
        })
         }
        } catch (error) {
        Toast.show({
          content: '重新上架失败，请稍后重试',
          duration: 2,
          position: 'center',
          mask: false,
        })
          console.error(error);
        }

      }

     };
     const handlegopreview = () => {  //跳转预览
     navigation.navigate('ShopPreview',{shopinfo:item})
    };
    const handleedit = () => {  //编辑
      console.log(123);
      navigation.navigate('ShopEdit',{shopinfo:item})
     };
  return (
    <TouchableOpacity style={{flex: 1,backgroundColor:item.auditStatus === 'REJECTED'? '#FFF1F0':'#fff',padding:px(8),borderRadius: px(8),}}
    activeOpacity={1}>
   <TouchableOpacity style={styles.shopbox}
   onPress={()=>handlegopreview()}  activeOpacity={1}>
      <SafeFastImage
          source={{ uri: imageUri }}
          //onError={() => setImgError(true)}
          style={{
            width: px(87),
            height: px(87), 
            borderRadius: px(8),
          }}
        />
 
    <View style={styles.shopinfobox}>
      <View style={{gap:px(3)}}>
    <View  style={{width: px(238),position: 'relative',}}>
      <View style={[styles.pcgamebox,{ backgroundColor: getPlatformColor(item?.platform) }]}>
      <Text style={[styles.pcdestext,{color:gettxPlatformColor(item?.platform)}]}>{item?.platform}</Text>
         </View>
         <Text style={styles.shoptitle}>      {item?.title}</Text>
      </View>
   <View style={{flexDirection: 'row',alignItems: 'center',gap:px(3),marginTop: px(0),}}>
    {(item?.serviceIds ? item.serviceIds.split(",") : [])
      .slice(0, 3)
      .map((text, index) => (
        <View style={styles.tagbox} key={index}>
          <Text style={styles.tagtext}>{text}</Text>
        </View>
    ))}
   </View>
   </View>
     <View style={{flexDirection: 'row',alignItems:'center',
      justifyContent: 'space-between',
     }}>
      <View style={{flexDirection: 'row',alignItems: 'flex-end',gap:px(3),}}> 
     <Text style={styles.price}>￥{goodsinfo?.minPrice ? goodsinfo.minPrice / 100 : 128}</Text>
        {/* <Text style={styles.smallprice}> 
           ￥{
         item?.minOriginalPrice != null
         ? item.minOriginalPrice / 100
         : "-"
         }
        </Text> */}
      <Text style={styles.salesnum}>销量{goodsinfo?.goods?.salesCount}</Text>
      </View>
       <Text style={styles.onlinetext}>库存{goodsinfo?.totalStock}</Text>
       </View>
       </View>
             </TouchableOpacity>
             {item.auditStatus === 'REJECTED' && (
            <View style={styles.rejectReasonBox}>
              <Text style={styles.rejectReasonLabel}>审核失败：</Text>
              <Text style={styles.rejectReasonText}>
                {item.auditRemark || '提交资料不符合平台要求，请修改后重新提交。'}
              </Text>
            </View>
          )}
             <View style={{width: px(345),backgroundColor: 'rgba(118, 118, 118,0.2)',height: px(1),
                marginTop: px(12),
             }}></View>
             <View style={{marginTop: px(8),flexDirection: 'row',alignItems: 'center',
              justifyContent: 'space-between',}}>
 <Text style={styles.creattime}>创建时间: {getDateOnly(item.createdAt)}</Text>
 <View style={{flexDirection: 'row',alignItems: 'center',gap:px(12)}}>

    {item.status=="DRAFT"&&item.auditStatus!=='PENDING' && 
    <>
      <TouchableOpacity style={styles.cannelbox} 
      onPress={()=>onButtonClick()}>
    <Text style={styles.canneltext}>删除</Text>
      </TouchableOpacity>
           <TouchableOpacity style={styles.cannelbox} 
           onPress={()=>handleedit()}>
    <Text style={styles.canneltext}>编辑</Text>
      </TouchableOpacity>
         <TouchableOpacity
         onPress={()=>ononlineButtonClick()}>
     <LinearGradient
          colors={['#FEC525', '#FC9026']}
          start={{ x: 1, y: 0 }}
          end={{ x: 0, y: 0 }}
          style={[styles.gradientBox]}
        >
          <Text style={styles.logintext}>
            上架
          </Text>
        </LinearGradient>
  </TouchableOpacity>
      </>
    }
      {item.auditStatus=='PENDING' && 
      <TouchableOpacity style={styles.cannelbox} 
      onPress={()=> gettoast()}>
    <Text style={styles.canneltext}>审核中</Text>
      </TouchableOpacity>
    }
    {/* {item.auditStatus=='REJECTED' &&
       <TouchableOpacity style={styles.cannelbox} >
    <Text style={styles.canneltext}>审核失败</Text>
      </TouchableOpacity>
    } */}
    {item.status=='PUBLISHED' &&
       <TouchableOpacity style={styles.cannelbox} 
       onPress={()=>onofflineButtonClick()}>
    <Text style={styles.canneltext}>下架</Text>
      </TouchableOpacity>
    }
  {item.status=="OFFLINE"&&item.auditStatus!=='PENDING'&&
      <>
          <TouchableOpacity style={styles.cannelbox} 
          onPress={()=>onButtonClick()}>
    <Text style={styles.canneltext}>删除</Text>
      </TouchableOpacity>
           <TouchableOpacity style={styles.cannelbox} 
           onPress={()=>handleedit()}>
    <Text style={styles.canneltext}>编辑</Text>
      </TouchableOpacity>
   <TouchableOpacity
   onPress={()=>ononlineonclik()}>
     <LinearGradient
          colors={['#FEC525', '#FC9026']}
          start={{ x: 1, y: 0 }}
          end={{ x: 0, y: 0 }}
          style={[styles.gradientBox]}
        >
          <Text style={styles.logintext}>
            重新上架
          </Text>
        </LinearGradient>
  </TouchableOpacity>
  </>
  }

</View>
             </View>
             </TouchableOpacity>
  )
}
export default React.memo(GoodsItem);
const styles = StyleSheet.create({
rejectReasonBox: {
  width: '100%',
  flexDirection: 'row',
  //alignItems: 'center',
  marginTop: px(10),
  paddingHorizontal: px(4),
},

rejectReasonLabel: {
  fontFamily: 'MiSans-Medium',
  fontSize: px(11),
  color: '#FF4D4F',
  lineHeight: px(16),
},

rejectReasonText: {
  width: px(288),
  //marginTop: px(2),
  fontFamily: 'MiSans-Regular',
  fontSize: px(11),
  color: '#666666',
  lineHeight: px(16),
},
        canneltext:{
  fontFamily: 'MiSans-Regular',
        fontSize:px(12),
        lineHeight:px(16),
        color:'#1A1A1A',
        fontWeight:400,
    },
    cannelbox:{
width: px(80),
height: px(26),
borderRadius: px(15),
borderWidth: px(1),
borderColor: '#D8D8D8',
flexDirection: 'row',
justifyContent: 'center',
alignItems: 'center',
    },
  logintext:{
  fontFamily: 'MiSans-Medium',
    fontSize: px(12),
    color: '#FFFFFF',
    lineHeight: px(16),
  },
    gradientBox: {
    width:px(80),
    height: px(26),
    borderRadius: px(15),
    justifyContent: 'center',
    alignItems: 'center',
  },
    creattime:{
        width: px(59),
        height: px(26),
 fontFamily: 'MiSans-Regular',
        fontSize:px(10),
        color:'#AAAAAA',
        fontWeight:400,
        lineHeight:px(13),
    },
   platformtitle:{
fontFamily: 'MiSans-Medium',
        fontSize:px(13),
        color:'#6E4200',
        fontWeight:400,
        lineHeight:px(17),
   },
   onlinetext:{
 fontFamily: 'MiSans-Regular',
        fontSize:px(10),
        color:'#AAAAAA',
        fontWeight:400,
        lineHeight:px(13),
   },
   salesnum:{
     marginBottom: px(2),
     marginLeft: px(3),
       // textDecorationLine: 'line-through',
 fontFamily: 'MiSans-Regular',
        fontSize:px(10),
        color:'#AAAAAA',
        fontWeight:400,
        lineHeight:px(13),
   },
       smallprice:{
        marginBottom: px(2),
        textDecorationLine: 'line-through',
 fontFamily: 'MiSans-Regular',
        fontSize:px(10),
        color:'#AAAAAA',
        fontWeight:400,
        lineHeight:px(13),
    },
       price:{
 fontFamily: 'MiSans-Bold',
        fontSize:px(15),
        color:'#DE5452',
        //fontWeight:400,
        lineHeight:px(21),
    },
   tagtext:{
 fontFamily: 'MiSans-Regular',
        fontSize:px(11),
        color:'#FF9500',
        fontWeight:400,
        lineHeight:px(15),
   },
   tagbox:{
backgroundColor: '#FEF7E0',
borderRadius: px(4),
paddingHorizontal:px(4),
paddingVertical:px(2),
   },
    tag:{
  fontSize: px(11),
  color:'#008CFF',
  backgroundColor:'#D1E3FF',
  borderRadius:px(4),
  paddingHorizontal:px(6),
  paddingVertical:px(2),
  overflow:'hidden'
},
    pcdestext:{
 fontFamily: 'MiSans-Regular',
        fontSize:px(11),
        color:'#008CFF',
        fontWeight:400,
        lineHeight:px(15),
    },
    pcgamebox:{
position: 'absolute',
top:0,
left:0,
// width: px(28),
// height: px(21),
padding:px(3),
backgroundColor: '#D1E3FF',
borderRadius: px(4),
flexDirection: 'row',
alignItems: 'center',
justifyContent: 'center',
    },
    shoptitle:{
        //backgroundColor: 'red',
      width: px(238),
    fontFamily: 'MiSans-Medium',
    fontSize:px(16),
    color:'#1A1A1A',
    //fontWeight:500,
    lineHeight:px(21),
    },
    shopinfobox:{
        gap:px(3),
        height: px(87),
        //width: 233,
        //backgroundColor: 'red',
       flexDirection: 'column',
       justifyContent: 'space-between',
    },
    shopimgbox:{
        width: px(120),
        height: px(120),
position: 'relative',
    },
    shopbox:{
    marginTop: px(0),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    },
})