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
const platOptions = [
  { label: '男', value: 0 },
  { label: '女', value: 1 },
];
const gamesOptions=[
    { label: '三角洲行动', value: 1 },
  { label: '王者荣耀', value: 2 },
]
const recommendOptions=[
    { label: '关', value: 0 },
  { label: '开', value: 1 },
]
const SkilledOptions = [
  { label: '零号大坝', value: 0 },
  { label: '长弓溪谷', value: 1 },
  { label: '巴克什', value: 2 },
  { label: '航天基地', value: 3 }, 
  { label: '潮汐监狱', value: 4 }, 
  { label: '中路', value: 5 }, 
  { label: '射手', value: 6 }, 
  { label: '打野', value: 7 }, 
  { label: '上路', value: 8 }, 
  { label: '辅助', value: 9 }, 
];
export default function Playmateedit({navigation,route}) {
  const {item}=route.params||{}
  const [nickname, setNickname] = useState(''); //昵称
  const [phonenumber, setPhonenumber] = useState(''); //手机号码
  const [gender, setGender] = useState(platOptions); //性别
  const [genderindex, setShopplatindex] = useState(0); //选择性别下标
  const [gendervs, setGendervs] = useState(false) //性别弹窗开关
  const [headimages, setHeadimages] = useState([]); //头图列表
  const [Profile, setProfile] = useState(""); //个人简介
  const [audioFile, setAudioFile] = useState<any>(null);// 音频文件
  const [headimagesinfo, setHeadimagesinfo] = useState([]); //图片介绍
  const [videoFiles, setVideoFiles] = useState<any[]>([]);  // 视频列表
  const [gameca, setGameca] = useState(gamesOptions); //游戏种类
  const [gamecavs, setGamecavs] = useState(false) //游戏种类弹窗开关
  const [gamecavalues, setGamecavalues] = useState<(number | string)[]>([]); //游戏种类内容
  const [rank, setRank] = useState(''); //段位
  const [skilled, setSkilled] = useState(SkilledOptions); //擅长
  const [skilledvs, setSkilledvs] = useState(false) //擅长弹窗开关
  const [skilledvalues, setSkilledvalues] = useState<(number | string)[]>([]); //擅长内容
  //const [skilled, setSkilled] = useState(''); //擅长
  const [initial, setInitial] = useState('0'); //初始付款人数
  const [recommend, setRecommend] = useState(recommendOptions); //推荐
  const [recommendindex, setRecommendindex] = useState(0); //推荐下标
  const [recommendvs, setRecommendvs] = useState(false) //推荐弹窗开关
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
    //getshoplist();
    console.log(item);
    if(item){
        initialization(); //初始化
    }
}, [item])
const initialization = async() => { 
    setUploadLoading(true)
    setNickname(item.nickName)
    setShopplatindex(item.gender-1)
    setHeadimages([{uri:IMG_URL+item.avatar}])
    setProfile(item.intro)
    setAudioFile({name:'原音频文件',uri:item.audios,size:435641})
    const imgs = formatImages(item.albums);
    setHeadimagesinfo(imgs);
    if(item.videos){
    const videos =
    await formatVideos(item.videos);
    setVideoFiles(videos);
    }
    const gameca = item.gameIds.split(',').map(item => Number(item));
    console.log(gameca);
    setGamecavalues(gameca);
    setRank(item.gameRank)
    const skilled = getSkilledValues(
    item.goodAt
    );
    setSkilledvalues(skilled)
    setInitial(String(item.virtualPayCount))
    setRecommendindex(item.isRecommend)

    setUploadLoading(false)
 };
 const getSkilledValues = (str) => {
  if (!str) {
    return [];
  }

  return str
    .split(',')
    .filter(Boolean)
    .map(name => {
      const item = SkilledOptions.find(
        option => option.label === name
      );

      return item?.value;
    })
    .filter(value => value !== undefined);
};
const formatVideos = async (str) => {
  if (!str) {
    return [];
  }
  const list = str
    .split(',')
    .filter(Boolean)
    .map(item => ({
      path: item.startsWith('http')
        ? item
        : IMG_URL + item,
    }));
  const result = [];
  for (const item of list) {
    try {
      const thumb =
        await createThumbnail({
          url:item.path,
          timeStamp:1000,
        });
      result.push({
        path:item.path,
        thumbnail:thumb.path,
      });
    } catch(e) {
      console.log('生成视频封面失败',e);
      result.push({
        path:item.path,
        thumbnail:'',
      });
    }
  }
  return result;
};
const formatImages = (str) => {
  if (!str) {
    return [];
  }

  return str
    .split(',')
    .filter(Boolean)
    .map(item => ({
      uri: IMG_URL + item,
    }));
};
const handleback = () => {  //返回上一页
navigation.goBack();
};
const onChangeProfile = (e) => {  //修改商品详情
    console.log(e);
    setProfile(e)
};
const getshoplist = async() => { 
          try {
        const response = await request({
          url: '/store/goods/list',
          method: 'GET',
          data: {
          },
          query: {
            storeId:item.storeId,
            page:1,
            pageSize:50,
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
const chooseAudio = async()=>{

  try {

    const [file] = await pick({
      type:[
        types.audio
      ],
      allowMultiSelection:false,
    });


    console.log(file);


    setAudioFile(file);


  }catch(e){

    console.log(e);

  }

};
const deleteAudio = ()=>{

  setAudioFile(null);

};
const chooseVideo = async()=>{

 try{


  if(videoFiles.length >=4){
    return;
  }


  const videos =
  await ImagePicker.openPicker({

    mediaType:'video',

    multiple:true,

    maxFiles:4-videoFiles.length,

  });



  const maxDuration =
  3*60*1000;



  const validVideos =
  videos.filter(item=>{

    return item.duration <= maxDuration;

  });



  const newVideos=[];


  for(const item of validVideos){


    const thumb =
    await createThumbnail({

      url:item.path,

      timeStamp:1000,

    });


    newVideos.push({

      ...item,

      thumbnail:thumb.path,

    });


  }



  setVideoFiles([
    ...videoFiles,
    ...newVideos
  ].slice(0,4));



 }catch(e){

   console.log(e);

 }


};
const deleteVideo = (index:number)=>{


 const newList =
 videoFiles.filter(
   (_,i)=>i!==index
 );


 setVideoFiles(newList);


};
const getLabels = (values, data) => {
  return data
    .filter(item => values.includes(item.value))
    .map(item => item.label)
    .join('、');
};
const subgetLabels = (values, data) => {
  return data
    .filter(item => values.includes(item.value))
    .map(item => item.label)
    .join(',');
};
const handleUploadAndFormat = async (imageList) => {

  try {

    if (
      !Array.isArray(imageList) ||
      imageList.length === 0
    ) {
      return '';
    }


    const resultList = [];

    const localImages = [];
    const localIndexes = [];


    imageList.forEach((item,index)=>{

      const uri = item?.uri;


      if(!uri){
        return;
      }


      // 网络图片
      if(
        uri.startsWith('http://') ||
        uri.startsWith('https://')
      ){

        /**
         * https://xxx.com/upload/abc.png
         *
         * 转成:
         * abc.png
         */
        const uploadIndex =
          uri.indexOf('upload/');


        if(uploadIndex !== -1){

          resultList[index] =
            uri.substring(
              uploadIndex + 7
            );

        }else{

          // 如果接口需要完整地址
          resultList[index] = uri;

        }


      }


      // 本地图片
      else {

        localImages.push(uri);
        localIndexes.push(index);

      }

    });



    // 上传新图片
    if(localImages.length > 0){

      const res =
        await uploadImage(localImages);


      const serverImages =
        Array.isArray(res.data)
        ? res.data
        : [];


      serverImages.forEach((img,i)=>{

        const index =
          localIndexes[i];


        resultList[index]=img;

      });

    }


    return resultList
      .filter(Boolean)
      .join(',');


  }catch(error){

    console.log(
      '图片处理失败:',
      error
    );

    Toast.fail(
      '图片上传失败'
    );

    return '';

  }

};
const handlesubmit = async() => {  //正式提交
    //console.log(headimages);
    //console.log(audioFile);
   if(nickname==""){
     Toast.show({
      content: '请输入昵称',
      duration: 2,
      position: 'center',
      mask: false,
    })
    return
   }
    if(Profile==""){
     Toast.show({
      content: '请输入个人简介',
      duration: 2,
      position: 'center',
      mask: false,
    })
    return
   }
    if(headimages.length==0){
     Toast.show({
      content: '请上传头像',
      duration: 2,
      position: 'center',
      mask: false,
    })
    return
   }
    if(audioFile==null){
     Toast.show({
      content: '请上传音频介绍',
      duration: 2,
      position: 'center',
      mask: false,
    })
    return
   }
    if(gamecavalues.length==0){
     Toast.show({
      content: '请选择游戏分类',
      duration: 2,
      position: 'center',
      mask: false,
    })
    return
   }
    if(rank==""){
     Toast.show({
      content: '请输入游戏段位',
      duration: 2,
      position: 'center',
      mask: false,
    })
    return
   }
    if(skilledvalues.length==0){
     Toast.show({
      content: '请输入擅长',
      duration: 2,
      position: 'center',
      mask: false,
    })
    return
   }
    if(initial==""){
     Toast.show({
      content: '请输入初始付款人数',
      duration: 2,
      position: 'center',
      mask: false,
    })
    return
   }
    Modalitem.alert('提示', '是否提交？', [
      { text: '取消', onPress: () => console.log('cancel'), style: 'cancel' },
      { text: '确定', onPress: () => handleReview(),
       style: { color: '#FC9026' },
       },   
    ])
};
const handleReview = async() => {  //正式提交
   //setUploadLoading(true);
   console.log(headimages);
   console.log(headimagesinfo);
 
  const headlogoimages = await handleUploadAndFormat(headimages);
  const headinfoimages = await handleUploadAndFormat(headimagesinfo);
  console.log(headlogoimages);
  console.log(headinfoimages);
  console.log(audioFile);
  console.log(videoFiles);

let audioRes = '';
if (
  audioFile?.name === '原音频文件'
) {
  // 编辑模式，原音频不重新上传
  audioRes = audioFile.uri;
} else {
  // 新选择的音频，正常上传
  audioRes = await uploadAudio(audioFile);
}
let videoRes = '';
const oldVideos = videoFiles.filter(
  item =>
    item?.path &&
    item.path.startsWith('http')
);
const newVideos = videoFiles.filter(
  item =>
    item?.path &&
    !item.path.startsWith('http')
);
// 旧视频，直接取文件名
const oldVideoNames = oldVideos.map(item => {
  const uploadIndex =
    item.path.indexOf('upload/');
  if(uploadIndex !== -1){
    return item.path.substring(
      uploadIndex + 7
    );
  }
  return item.path;
});
// 新视频上传
let uploadVideoRes = [];
if(newVideos.length > 0){
  const res =
    await uploadVideo(newVideos);
  if(res){
    uploadVideoRes =
      res.split(',');
  }
}
// 合并，保持原视频+新视频
videoRes = [
  ...oldVideoNames,
  ...uploadVideoRes,
].join(',');
   const gamesIds = gamecavalues?.length
  ? gamecavalues.join(',')
  : '';
     const shopsIds = shopIds?.length
  ? shopIds.join(',')
  : '';
  console.log(headlogoimages);
  console.log(headinfoimages);
  console.log(audioRes);
  console.log(videoRes);
  console.log(gamesIds);
  console.log(shopsIds);

  console.log(item.storeId);
  console.log(phonenumber);
  console.log(nickname);
  console.log(headlogoimages);
  console.log(genderindex+1);
  console.log(Profile);
  console.log(subgetLabels(skilledvalues, skilled));
  console.log(rank);
  console.log(headinfoimages);
  console.log(videoRes);
  console.log(audioRes);
  console.log(gamesIds);
  console.log(recommendindex);
  console.log(Number(initial));
  console.log(shopsIds);
     setUploadLoading(false);

          try {
        const response = await request({
          url: '/store/player/update',
          method: 'PUT',
          data: {
            id:item.id,
        storeId: item.storeId,
        nickName: nickname,
        avatar: headlogoimages,
        gender: Number(genderindex+1),
        age: 22,
        city: "成都",
        intro: Profile, //个人简介
        slogan: "只要你敢倒，我就敢扶",
        voiceType: "类型",
        goodAt: subgetLabels(skilledvalues, skilled),
        gameRank: rank,
        introVideo: "intro_001.mp4",
        tags: "枪法精准,情绪价值,带妹狂魔",
        albums: headinfoimages,
        videos: videoRes,
        audios: audioRes,
        gameIds: gamesIds,
        serviceType: "陪玩",
        serviceHours: "20:00-02:00",
        sortWeight: 0,
        isRecommend:Number(recommendindex),
        virtualPayCount:Number(initial),
        goodsIds: shopsIds
        },
          query: {},
        }); 
        console.log('submitpeiwan',response);
      if (response.data !== null && response.code == 0) {
      Toast.success({content: '保存成功',mask:false,duration:2})
      handleback();
      } else{
        Toast.fail('保存失败,请稍后再试！') 
      }
      } catch (error) {
        Toast.fail('保存失败,请稍后再试！') 
        console.error(error);
      }finally{   setUploadLoading(false);}


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
       <Text style={styles.title}>编辑陪玩</Text>
        </View>
   </View>
    <KeyboardAwareScrollView 
  bottomOffset={30}
  extraKeyboardSpace={20}
  mode="insets"
  showsVerticalScrollIndicator={false}
  keyboardShouldPersistTaps="handled"
  contentContainerStyle={{
      paddingBottom:px(120),
      paddingTop:px(16),
  }}
    >
<View 
style={{
 width: '100%',
 backgroundColor:'#fff',
// paddingHorizontal:px(16),
}}>
<View style={{width: '100%',backgroundColor: '#fff',paddingHorizontal:px(16),}}>
<View style={{flexDirection: 'row',alignItems: 'center',justifyContent: 'space-between',
    height: px(51),
}}>
    <View style={{flexDirection: 'row',alignItems: 'center',}}>
<Text style={styles.lefttitle}>昵称</Text>
<Text style={[styles.lefttitle,{color:'red'}]}>*</Text>
    </View>
     <TextInput
              style={styles.shopnameinput}
              allowFontScaling={false}
              onChangeText={setNickname}
              value={nickname}
              placeholder="请输入昵称"
               placeholderTextColor="#AAAAAA"
                maxLength={30}
                selectionColor='#FC9026'
                multiline
            />
</View>
<Line/>
<TouchableOpacity style={{flexDirection: 'row',alignItems: 'center',
justifyContent: 'space-between',height: px(51),}}
 onPress={()=>setGendervs(true)}>
    <View style={{flexDirection: 'row',alignItems: 'center',}}>
<Text style={styles.lefttitle}>性别</Text>
<Text style={[styles.lefttitle,{color:'red'}]}>*</Text>
    </View>

<View style={{flexDirection: 'row',alignItems: 'center',}}>
<Text style={styles.lefttitle}>{gender[genderindex].label}</Text>
      <Image source={require('../../../assets/images/my/right.png')} 
       style={{width:px(19),height:px(19)}}></Image>
</View>
</TouchableOpacity>
<Line/>
    <View style={{width: '100%',paddingTop:px(16),
    flexDirection: 'column',justifyContent: 'center',
    }}>
   <View style={{flexDirection: 'column',paddingBottom:px(16)}}>
    <View style={{flexDirection: 'row',alignItems: 'center',}}>
<Text style={styles.lefttitle}>头像（主页大图）</Text>
<Text style={[styles.lefttitle,{color:'red'}]}>*</Text>
    </View>
      <Text style={styles.smalldes}>(限1张，推荐360x360pt)</Text>
      <ImageUploader
        max={1}
        value={headimages}
        onChange={setHeadimages}
        />
      </View>
{/* <Line/> */}
  </View>
<Line/>
<View style={{width: '100%',backgroundColor: '#fff',
    paddingVertical:px(16),marginTop: px(0),
}}>
<View style={{width: '100%',
    flexDirection: 'row',alignItems: 'center',justifyContent: 'space-between',
    marginTop: px(0),
}}>
    <View style={{flexDirection: 'row',alignItems: 'center',}}>
<Text style={styles.lefttitle}>个人简介</Text>
<Text style={[styles.lefttitle,{color:'red'}]}>*</Text>
    </View>

</View>

<View style={{width: '100%',backgroundColor: '#F7F8FC',
    marginTop: px(16),padding:px(16),borderRadius: px(8),
}}>
    <View style={{flexDirection: 'row',}}>
     <Image source={require('../../../assets/images/my/edit.png')} 
     style={{width:px(19),height:px(19),marginTop: px(0),}}></Image>
    <TextInput
    allowFontScaling={false}
    multiline
    style={styles.inputbox}
    onChangeText={onChangeProfile}
    value={Profile || ''}
    placeholder="简单介绍下您吧~"
    //keyboardType="number-pad"
    placeholderTextColor="#AAAAAA"
    maxLength={50}
    selectionColor='#FC9026'
    textAlignVertical="top"  
    />
    </View>

<View style={{width: '100%',flexDirection: 'row',alignItems: 'center',justifyContent: 'flex-end',}}>
 <Text style={styles.count}>
        {Profile?.length||0}
      </Text>
      <Text style={styles.countf}>/50</Text>
</View>
</View>






</View>
<Line/>
    <View style={{width: '100%',paddingTop:px(16),
    flexDirection: 'column',justifyContent: 'center',
    }}>
   <View style={{flexDirection: 'column',paddingBottom:px(16)}}>
    <View style={{flexDirection: 'row',alignItems: 'center',}}>
<Text style={styles.lefttitle}>音频介绍</Text>
<Text style={[styles.lefttitle,{color:'red'}]}>*</Text>
    </View>
      <Text style={styles.smalldes}>(限1段，时长小于等于3分钟)</Text>
<View
style={{
 width:'100%',
 marginTop:px(16),
}}
>


{
audioFile ?

(
<View
style={{
 width:'100%',
 height:px(80),
 backgroundColor:'#F7F8FC',
 borderRadius:px(8),
 paddingHorizontal:px(16),
 flexDirection:'row',
 alignItems:'center',
 justifyContent:'space-between',
}}
>


<View
style={{
 flex:1,
}}
>

<Text
style={{
 fontSize:px(14),
 color:'#1A1A1A',
 fontFamily:'MiSans-Regular',
}}
numberOfLines={1}
>
{audioFile.name}
</Text>


{/* <Text
style={{
 marginTop:px(6),
 fontSize:px(12),
 color:'#AAAAAA',
}}
>
{
(audioFile.size / 1024 / 1024)
.toFixed(2)
}
MB
</Text> */}


</View>



<TouchableOpacity
onPress={deleteAudio}
style={{
 padding:px(10),
}}
>

<Text
style={{
 color:'#FF4D4F',
 fontSize:px(14),
}}
>
删除
</Text>

</TouchableOpacity>


</View>
)


:

(
<TouchableOpacity

onPress={chooseAudio}

style={{
 width:px(100),
 height:px(100),
 borderRadius:px(8),
 backgroundColor:'#F7F8FC',

 alignItems:'center',
 justifyContent:'center',
}}
>
<Image
source={
require('../../../assets/images/my/adds.png')
}
style={{
 width:px(38),
 height:px(38),
}}
/>
<Text
style={styles.addsmpa}
>
上传音频
</Text>
</TouchableOpacity>
)
}
</View>
      </View>
{/* <Line/> */}
  </View>
<Line/>
    <View style={{width: '100%',paddingTop:px(16),
    flexDirection: 'column',justifyContent: 'center',
    }}>
   <View style={{flexDirection: 'column',paddingBottom:px(16)}}>
    <View style={{flexDirection: 'row',alignItems: 'center',}}>
<Text style={styles.lefttitle}>图片介绍</Text>
{/* <Text style={[styles.lefttitle,{color:'red'}]}>*</Text> */}
    </View>
      <Text style={styles.smalldes}>(限4张，推荐360x360pt)</Text>
      <ImageUploader
        max={4}
        value={headimagesinfo}
        onChange={setHeadimagesinfo}
        />
      </View>
  </View>
<Line/>
<View
style={{
 width:'100%',
 paddingTop:px(16),
 paddingBottom:px(16)
}}
>
<View
style={{
 flexDirection:'row',
 alignItems:'center',
}}
>
<Text style={styles.lefttitle}>
视频介绍
</Text>
</View>
<Text style={styles.smalldes}>
(限4个视频)
</Text>
<View
style={{
 marginTop:px(16),
 flexDirection:'row',
 flexWrap:'wrap',
}}
>
{
videoFiles.map(
(item,index)=>(
<View
key={index}
style={{
 width:px(100),
 height:px(100),
 marginRight:px(12),
 marginBottom:px(12),
 borderRadius:px(8),
 backgroundColor:'#F7F8FC',
 overflow:'hidden',
}}
>
{/* 视频缩略图区域 */}
<View
style={{
 flex:1,
 alignItems:'center',
 justifyContent:'center',
}}
>
<Image
source={{
 uri:item.thumbnail
}}
style={{
 width:'100%',
 height:'100%',
}}
resizeMode="cover"
/>
</View>
<TouchableOpacity
onPress={()=>{
 deleteVideo(index)
}}
style={{
 position:'absolute',
 right:px(5),
 top:px(5),
 width:px(22),
 height:px(22),
 borderRadius:px(11),
 backgroundColor:'#fff',
 alignItems:'center',
 justifyContent:'center',
}}
>
<Text
style={{
 color:'#000',
 fontSize:px(14),
}}
>
×
</Text>
</TouchableOpacity>



</View>


)

)
}



{
videoFiles.length < 4 &&

<TouchableOpacity

onPress={chooseVideo}

style={{
 width:px(100),
 height:px(100),
 borderRadius:px(8),
 backgroundColor:'#F7F8FC',
 alignItems:'center',
 justifyContent:'center',
}}

>


<Image
source={
require('../../../assets/images/my/adds.png')
}

style={{
 width:px(38),
 height:px(38),
}}
/>


<Text
style={styles.addsmpa}
>
上传视频
</Text>


</TouchableOpacity>

}



</View>


</View>
<Line/>
<TouchableOpacity style={{flexDirection: 'row',alignItems: 'center',
justifyContent: 'space-between',height: px(51),}}
 onPress={()=>setGamecavs(true)}>
    <View style={{flexDirection: 'row',alignItems: 'center',}}>
<Text style={styles.lefttitle}>游戏种类</Text>
<Text style={[styles.lefttitle,{color:'red'}]}>*</Text>
    </View>

<View style={{flexDirection: 'row',alignItems: 'center',}}>
<Text style={styles.lefttitle}>    {gamecavalues?.length
    ? getLabels(gamecavalues, gameca)
    : '请选择'}</Text>
<Image source={require('../../../assets/images/my/right.png')} 
  style={{width:px(19),height:px(19)}}></Image>
</View>
</TouchableOpacity>
<Line/>
<View style={{flexDirection: 'row',alignItems: 'center',justifyContent: 'space-between',
    height: px(51),
}}>
    <View style={{flexDirection: 'row',alignItems: 'center',}}>
<Text style={styles.lefttitle}>游戏段位</Text>
<Text style={[styles.lefttitle,{color:'red'}]}>*</Text>
    </View>
    <TextInput
    style={styles.shopnameinput}
    allowFontScaling={false}
    onChangeText={setRank}
    value={rank}
    placeholder="请输入游戏段位"
    placeholderTextColor="#AAAAAA"
    maxLength={30}
    selectionColor='#FC9026'
    multiline
  />
</View>
<Line/>
<TouchableOpacity style={{flexDirection: 'row',alignItems: 'center',
justifyContent: 'space-between',paddingVertical:px(16)}}
 onPress={()=>setSkilledvs(true)}>
    <View style={{flexDirection: 'row',alignItems: 'center',}}>
<Text style={styles.lefttitle}>擅长</Text>
<Text style={[styles.lefttitle,{color:'red'}]}>*</Text>
    </View>

<View style={{flexDirection: 'row',alignItems: 'center',}}>
<Text style={[styles.lefttitle,{width: px(250),textAlign:'right'}]}>    
  {skilledvalues?.length
    ? getLabels(skilledvalues, skilled)
    : '请选择'}</Text>
<Image source={require('../../../assets/images/my/right.png')} 
  style={{width:px(19),height:px(19)}}></Image>
</View>
</TouchableOpacity>
<Line/>
<View style={{flexDirection: 'row',alignItems: 'center',justifyContent: 'space-between',
    height: px(51),
}}>
    <View style={{flexDirection: 'row',alignItems: 'center',}}>
<Text style={styles.lefttitle}>初始付款人数</Text>
<Text style={[styles.lefttitle,{color:'red'}]}>*</Text>
    </View>
    <TextInput
    style={styles.shopnameinput}
    allowFontScaling={false}
    onChangeText={setInitial}
    value={initial}
    placeholder="请输入初始付款人数"
    placeholderTextColor="#AAAAAA"
    maxLength={10}
    selectionColor='#FC9026'
    multiline
    keyboardType="numeric"
  />
</View>
<Line/>
<TouchableOpacity style={{flexDirection: 'row',alignItems: 'center',
justifyContent: 'space-between',height: px(51),}}
 onPress={()=>setRecommendvs(true)}>
    <View style={{flexDirection: 'row',alignItems: 'center',}}>
<Text style={styles.lefttitle}>首页推荐</Text>
<Text style={[styles.lefttitle,{color:'red'}]}>*</Text>
    </View>

<View style={{flexDirection: 'row',alignItems: 'center',}}>
<Text style={styles.lefttitle}>{recommend[recommendindex].label}</Text>
<Image source={require('../../../assets/images/my/right.png')} 
  style={{width:px(19),height:px(19)}}></Image>
</View>
</TouchableOpacity>







</View>
</View>
</KeyboardAwareScrollView>
<TextRadioModal
  visible={gendervs}
  onClose={() => setGendervs(false)}
  data={gender} 
  value={genderindex}
  onConfirm={(val) => {
    setShopplatindex(val);
    setGendervs(false);
  }}
/>
  <TextCheckboxModal
    visible={gamecavs}
    onClose={() => setGamecavs(false)}
    data={gameca}
    value={gamecavalues}
    onConfirm={(val) => {
      setGamecavalues(val);
      setGamecavs(false);
    }}
    />
      <TextCheckboxModal
    visible={skilledvs}
    onClose={() => setSkilledvs(false)}
    data={skilled}
    value={skilledvalues}
    onConfirm={(val) => {
      setSkilledvalues(val);
      setSkilledvs(false);
    }}
    />
    <TextRadioModal
  visible={recommendvs}
  onClose={() => setRecommendvs(false)}
  data={recommend} 
  value={recommendindex}
  onConfirm={(val) => {
    setRecommendindex(val);
    setRecommendvs(false);
  }}
/>
<ShopSelectModal
visible={shopVisible}
onClose={()=>{
 setShopVisible(false)
}}
data={shopList}
value={shopIds}
onConfirm={(values)=>{
 setShopIds(values);
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
       <TouchableOpacity onPress={()=>handlesubmit()}>
        <LinearGradient
              colors={['#FEC525', '#FC9026']} // 渐变颜色
              start={{ x: 1, y: 0 }}   
              end={{ x: 0, y: 0 }}
              style={[styles.payBox,{width: px(242),}]}
              >
              <View style={{flexDirection: 'row',alignItems: 'center',}}>
              <Text style={styles.xiadantx}>提交审核</Text>
              </View>
              </LinearGradient>
              </TouchableOpacity>
</View>
</View>
</View>
<UploadLoadingModal
visible={uploadLoading}
text="加载中，请稍候..."
 />
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